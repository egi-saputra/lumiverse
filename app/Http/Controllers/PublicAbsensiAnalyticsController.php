<?php

namespace App\Http\Controllers;

use App\Models\AbsensiHarian;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PublicAbsensiAnalyticsController extends Controller
{
    /**
     * Durasi cache hasil analytics (menit).
     * Halaman publik tidak perlu real-time — cache mengurangi beban DB.
     */
    private const CACHE_TTL_MINUTES = 15;

    /**
     * Batas maksimal rentang tanggal yang diizinkan (hari).
     */
    private const MAX_RANGE_DAYS = 92;

    /**
     * Tampilkan halaman analytics publik — TANPA autentikasi.
     *
     * Perbedaan vs versi guru:
     *  - Tidak ada Auth::user(); semua data bersifat agregat atau anonim.
     *  - NIS siswa TIDAK ditampilkan (privacy).
     *  - Nama siswa hanya ditampilkan jika kelas bersifat publik (is_public = true).
     *    Jika kolom is_public tidak ada di skema, hapus kondisi itu dan tetap tampilkan nama.
     *  - Hasil di-cache per kombinasi (kelas_id + mode + periode).
     *  - Rate limiting ditangani di route (throttle middleware).
     */
    public function index(Request $request): Response
    {
        // ── Validasi query param ────────────────────────────────────────────
        $validated = $request->validate([
            'kelas_id' => ['nullable', 'integer', 'exists:kelas,id'],
            'mode'     => ['nullable', 'string', 'in:bulan,rentang'],
            'bulan'    => ['nullable', 'integer', 'min:1', 'max:12'],
            'tahun'    => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'mulai'    => ['nullable', 'date_format:Y-m-d'],
            'sampai'   => ['nullable', 'date_format:Y-m-d', 'after_or_equal:mulai'],
        ]);

        // ── Daftar kelas publik untuk picker ───────────────────────────────
        // Jika kamu punya kolom `is_public` di tabel kelas, aktifkan ->where('is_public', true)
        // Jika tidak ada kolom itu, hapus baris where tersebut — semua kelas akan tampil.
        $kelasList = Kelas::with('guru:id,nama_lengkap')
            ->withCount('siswa')
            // ->where('is_public', true) // ← aktifkan jika ingin filter kelas tertentu saja
            ->orderBy('kelas')
            ->get()
            ->map(fn (Kelas $k) => [
                'id'           => $k->id,
                'kelas'        => $k->kelas,
                'guru_nama'    => $k->guru?->nama_lengkap ?? '—',
                'jumlah_siswa' => $k->siswa_count,
            ]);

        // ── Jika belum pilih kelas ─────────────────────────────────────────
        if (empty($validated['kelas_id'])) {
            return Inertia::render('Public/AbsensiAnalytics', [
                'kelasList'   => $kelasList,
                'kelas'       => null,
                'dataLoaded'  => false,
                'mode'        => 'bulan',
                'bulan'       => now()->month,
                'tahun'       => now()->year,
                'mulai'       => null,
                'sampai'      => null,
                'label'       => '',
                'hariEfektif' => [],
                'analytics'   => null,
            ]);
        }

        // ── Ambil kelas — pastikan kelas memang ada ────────────────────────
        $kelas = Kelas::with('guru:id,nama_lengkap')
            ->withCount('siswa')
            // ->where('is_public', true) // ← aktifkan jika pakai filter publik
            ->findOrFail($validated['kelas_id']);

        $kelasData = [
            'id'           => $kelas->id,
            'kelas'        => $kelas->kelas,
            'guru_nama'    => $kelas->guru?->nama_lengkap ?? '—',
            'jumlah_siswa' => $kelas->siswa_count,
        ];

        // ── Tentukan periode ───────────────────────────────────────────────
        $mode   = $validated['mode'] ?? 'bulan';
        $now    = now();
        $bulan  = (int) ($validated['bulan'] ?? $now->month);
        $tahun  = (int) ($validated['tahun'] ?? $now->year);
        $mulai  = $validated['mulai'] ?? null;
        $sampai = $validated['sampai'] ?? null;

        if ($mode === 'rentang' && (! $mulai || ! $sampai)) {
            $mode = 'bulan';
        }

        if ($mode === 'rentang') {
            $diffDays = (int) \Carbon\Carbon::parse($mulai)->diffInDays(\Carbon\Carbon::parse($sampai));
            if ($diffDays > self::MAX_RANGE_DAYS) {
                $sampai = \Carbon\Carbon::parse($mulai)->addDays(self::MAX_RANGE_DAYS)->format('Y-m-d');
            }
        }

        // ── Bangun label ───────────────────────────────────────────────────
        $bulanNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $label = $mode === 'bulan'
            ? ($bulanNames[$bulan] ?? '') . ' ' . $tahun
            : $this->formatTanggalId($mulai) . ' – ' . $this->formatTanggalId($sampai);

        // ── Cache key unik per kombinasi parameter ─────────────────────────
        $cacheKey = 'public_analytics_'
            . $kelas->id . '_'
            . $mode . '_'
            . ($mode === 'bulan' ? "{$bulan}_{$tahun}" : "{$mulai}_{$sampai}");

        $analytics = Cache::remember($cacheKey, now()->addMinutes(self::CACHE_TTL_MINUTES), function () use (
            $kelas, $mode, $bulan, $tahun, $mulai, $sampai, $bulanNames
        ) {
            return $this->buildAnalytics($kelas, $mode, $bulan, $tahun, $mulai, $sampai, $bulanNames);
        });

        // Tidak ada data sama sekali
        if ($analytics === null) {
            return Inertia::render('Public/AbsensiAnalytics', [
                'kelasList'   => $kelasList,
                'kelas'       => $kelasData,
                'dataLoaded'  => true,
                'mode'        => $mode,
                'bulan'       => $bulan,
                'tahun'       => $tahun,
                'mulai'       => $mulai,
                'sampai'      => $sampai,
                'label'       => $label,
                'hariEfektif' => [],
                'analytics'   => null,
            ]);
        }

        return Inertia::render('Public/AbsensiAnalytics', [
            'kelasList'   => $kelasList,
            'kelas'       => $kelasData,
            'dataLoaded'  => true,
            'mode'        => $mode,
            'bulan'       => $bulan,
            'tahun'       => $tahun,
            'mulai'       => $mulai,
            'sampai'      => $sampai,
            'label'       => $label,
            'hariEfektif' => $analytics['hari_efektif_list'],
            'analytics'   => $analytics,
        ]);
    }

    // ── Core builder (dipisah agar mudah di-cache) ─────────────────────────

    private function buildAnalytics(
        Kelas $kelas,
        string $mode,
        int $bulan,
        int $tahun,
        ?string $mulai,
        ?string $sampai,
        array $bulanNames,
    ): ?array {
        $query = AbsensiHarian::where('kelas_id', $kelas->id);

        if ($mode === 'bulan') {
            $query->whereMonth('tanggal', $bulan)->whereYear('tanggal', $tahun);
        } else {
            $query->whereBetween('tanggal', [$mulai, $sampai]);
        }

        $allRecords = $query
            ->select(['siswa_id', 'tanggal', 'status'])
            // ⚠ PRIVASI: kolom `keterangan` sengaja tidak diambil di versi publik
            ->orderBy('tanggal')
            ->get();

        $hariEfektifList = $allRecords
            ->pluck('tanggal')
            ->map(fn ($t) => $t->format('Y-m-d'))
            ->unique()
            ->sort()
            ->values()
            ->all();

        if (empty($hariEfektifList)) {
            return null;
        }

        $jumlahHariEfektif = count($hariEfektifList);

        $siswaDikelas = Siswa::where('kelas_id', $kelas->id)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap']);
        // ⚠ PRIVASI: `nis` tidak di-select di versi publik

        $recordsBySiswa = $allRecords->groupBy('siswa_id');

        $siswaData = $siswaDikelas->map(function (Siswa $s) use ($recordsBySiswa, $jumlahHariEfektif) {
            $records = $recordsBySiswa->get($s->id, collect());

            $counts = [
                'hadir' => $records->where('status', AbsensiHarian::STATUS_HADIR)->count(),
                'sakit' => $records->where('status', AbsensiHarian::STATUS_SAKIT)->count(),
                'izin'  => $records->where('status', AbsensiHarian::STATUS_IZIN)->count(),
                'alpha' => $records->where('status', AbsensiHarian::STATUS_ALPHA)->count(),
            ];

            $pctKehadiran = $jumlahHariEfektif > 0
                ? round($counts['hadir'] / $jumlahHariEfektif * 100, 1)
                : null;

            return [
                'siswa_id'      => $s->id,
                'nama_lengkap'  => $s->nama_lengkap,
                // 'nis' => TIDAK dikirim ke publik
                'counts'        => $counts,
                'pct_kehadiran' => $pctKehadiran,
                // 'detail' => TIDAK dikirim ke publik (per-hari terlalu rinci)
            ];
        })->values()->all();

        $rekapKelas = [
            'hari_efektif' => $jumlahHariEfektif,
            'total_siswa'  => count($siswaData),
            'total_hadir'  => $allRecords->where('status', AbsensiHarian::STATUS_HADIR)->count(),
            'total_sakit'  => $allRecords->where('status', AbsensiHarian::STATUS_SAKIT)->count(),
            'total_izin'   => $allRecords->where('status', AbsensiHarian::STATUS_IZIN)->count(),
            'total_alpha'  => $allRecords->where('status', AbsensiHarian::STATUS_ALPHA)->count(),
        ];

        // Tren harian — hanya agregat, tanpa nama siswa
        $trendHarian = collect($hariEfektifList)->map(function (string $tgl) use ($allRecords) {
            $dayRecords = $allRecords->filter(fn ($r) => $r->tanggal->format('Y-m-d') === $tgl);
            $total  = $dayRecords->count();
            $hadir  = $dayRecords->where('status', AbsensiHarian::STATUS_HADIR)->count();
            $sakit  = $dayRecords->where('status', AbsensiHarian::STATUS_SAKIT)->count();
            $izin   = $dayRecords->where('status', AbsensiHarian::STATUS_IZIN)->count();
            $alpha  = $dayRecords->where('status', AbsensiHarian::STATUS_ALPHA)->count();

            return [
                'tanggal'   => $tgl,
                'hadir'     => $hadir,
                'sakit'     => $sakit,
                'izin'      => $izin,
                'alpha'     => $alpha,
                'pct_hadir' => $total > 0 ? round($hadir / $total * 100, 1) : 0,
            ];
        })->values()->all();

        $trendMingguan = collect($trendHarian)
            ->groupBy(fn ($d) => \Carbon\Carbon::parse($d['tanggal'])->startOfWeek()->format('Y-m-d'))
            ->map(function ($minggu, $startOfWeek) {
                $arr = $minggu->pluck('pct_hadir')->filter(fn ($v) => $v !== null);
                return [
                    'label'     => 'Mgu ' . \Carbon\Carbon::parse($startOfWeek)->format('d/m'),
                    'pct_hadir' => $arr->count() ? round($arr->avg(), 1) : 0,
                ];
            })
            ->values()
            ->all();

        $trendBulanan = collect($trendHarian)
            ->groupBy(fn ($d) => \Carbon\Carbon::parse($d['tanggal'])->format('Y-m'))
            ->map(function ($bulanGroup, $ym) use ($bulanNames) {
                [$y, $m] = explode('-', $ym);
                $arr = $bulanGroup->pluck('pct_hadir')->filter(fn ($v) => $v !== null);
                return [
                    'label'     => ($bulanNames[(int)$m] ?? $m) . ' ' . $y,
                    'pct_hadir' => $arr->count() ? round($arr->avg(), 1) : 0,
                ];
            })
            ->values()
            ->all();

        return [
            'hari_efektif_list' => $hariEfektifList,
            'rekap_kelas'       => $rekapKelas,
            'siswa'             => $siswaData,
            'trend_harian'      => $trendHarian,
            'trend_mingguan'    => $trendMingguan,
            'trend_bulanan'     => $trendBulanan,
        ];
    }

    private function formatTanggalId(string $date): string
    {
        $bulanNames = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Ags',
            9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
        ];
        $dt = \Carbon\Carbon::parse($date);
        return $dt->day . ' ' . ($bulanNames[$dt->month] ?? '') . ' ' . $dt->year;
    }
}


