<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\AbsensiHarian;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AbsensiAnalyticsController extends Controller
{
    /**
     * Batas maksimal rentang tanggal yang diizinkan (hari).
     */
    private const MAX_RANGE_DAYS = 92;

    /**
     * Tampilkan halaman analytics absensi.
     */
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $guru */
        $guru = Auth::user();

        // ── Validasi query param ────────────────────────────────────────────
        $validated = $request->validate([
            'kelas_id' => ['nullable', 'integer', 'exists:kelas,id'],
            'mode'     => ['nullable', 'string', 'in:bulan,rentang'],
            'bulan'    => ['nullable', 'integer', 'min:1', 'max:12'],
            'tahun'    => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'mulai'    => ['nullable', 'date_format:Y-m-d'],
            'sampai'   => ['nullable', 'date_format:Y-m-d', 'after_or_equal:mulai'],
        ]);

        // ── Daftar semua kelas (untuk picker) ──────────────────────────────
        $kelasList = Kelas::with('guru:id,nama_lengkap')
            ->withCount('siswa')
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
            return Inertia::render('Guru/AbsensiAnalytics', [
                'guru'       => ['nama_lengkap' => $guru->nama_lengkap],
                'kelasList'  => $kelasList,
                'kelas'      => null,
                'dataLoaded' => false,
                // default nilai kosong
                'mode'          => 'bulan',
                'bulan'         => now()->month,
                'tahun'         => now()->year,
                'mulai'         => null,
                'sampai'        => null,
                'label'         => '',
                'hariEfektif'   => [],
                'analytics'     => null,
            ]);
        }

        // ── Kelas terpilih ─────────────────────────────────────────────────
        $kelas = Kelas::with('guru:id,nama_lengkap')
            ->withCount('siswa')
            ->findOrFail($validated['kelas_id']);

        $kelasData = [
            'id'           => $kelas->id,
            'kelas'        => $kelas->kelas,
            'guru_nama'    => $kelas->guru?->nama_lengkap ?? '—',
            'jumlah_siswa' => $kelas->siswa_count,
        ];

        // ── Tentukan periode ───────────────────────────────────────────────
        $mode  = $validated['mode'] ?? 'bulan';
        $now   = now();
        $bulan = (int) ($validated['bulan'] ?? $now->month);
        $tahun = (int) ($validated['tahun'] ?? $now->year);
        $mulai = $validated['mulai'] ?? null;
        $sampai = $validated['sampai'] ?? null;

        // Jika mode rentang tapi tanggal tidak lengkap → fallback ke bulan
        if ($mode === 'rentang' && (! $mulai || ! $sampai)) {
            $mode = 'bulan';
        }

        // Validasi rentang maksimal
        if ($mode === 'rentang') {
            $diffDays = (int) \Carbon\Carbon::parse($mulai)->diffInDays(\Carbon\Carbon::parse($sampai));
            if ($diffDays > self::MAX_RANGE_DAYS) {
                // Potong sampai ke MAX_RANGE_DAYS
                $sampai = \Carbon\Carbon::parse($mulai)->addDays(self::MAX_RANGE_DAYS)->format('Y-m-d');
            }
        }

        // ── Bangun label periode ───────────────────────────────────────────
        $bulanNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $label = $mode === 'bulan'
            ? ($bulanNames[$bulan] ?? '') . ' ' . $tahun
            : $this->formatTanggalId($mulai) . ' – ' . $this->formatTanggalId($sampai);

        // ── Query absensi ──────────────────────────────────────────────────
        $query = AbsensiHarian::where('kelas_id', $kelas->id);

        if ($mode === 'bulan') {
            $query->whereMonth('tanggal', $bulan)->whereYear('tanggal', $tahun);
        } else {
            $query->whereBetween('tanggal', [$mulai, $sampai]);
        }

        // Ambil semua record sekaligus; lebih efisien daripada query per-siswa
        $allRecords = $query
            ->select(['siswa_id', 'tanggal', 'status', 'keterangan'])
            ->orderBy('tanggal')
            ->get();

        // ── Hari efektif (tanggal unik yang ada absensinya) ────────────────
        $hariEfektif = $allRecords
            ->pluck('tanggal')
            ->map(fn ($t) => $t->format('Y-m-d'))
            ->unique()
            ->sort()
            ->values()
            ->all();

        if (empty($hariEfektif)) {
            return Inertia::render('Guru/AbsensiAnalytics', [
                'guru'       => ['nama_lengkap' => $guru->nama_lengkap],
                'kelasList'  => $kelasList,
                'kelas'      => $kelasData,
                'dataLoaded' => true,
                'mode'       => $mode,
                'bulan'      => $bulan,
                'tahun'      => $tahun,
                'mulai'      => $mulai,
                'sampai'     => $sampai,
                'label'      => $label,
                'hariEfektif' => [],
                'analytics'  => null,
            ]);
        }

        $jumlahHariEfektif = count($hariEfektif);

        // ── Daftar siswa aktif di kelas ────────────────────────────────────
        $siswaDikelas = Siswa::where('kelas_id', $kelas->id)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nis']);

        // ── Kelompokkan records per siswa ──────────────────────────────────
        $recordsBySiswa = $allRecords->groupBy('siswa_id');

        // ── Hitung per-siswa ───────────────────────────────────────────────
        $siswaData = $siswaDikelas->map(function (Siswa $s) use ($recordsBySiswa, $hariEfektif, $jumlahHariEfektif) {
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

            // Detail per tanggal (untuk tabel rekap — tidak dipakai di analytics tapi tetap disertakan)
            $detail = $records->map(fn ($r) => [
                'tanggal'    => $r->tanggal->format('Y-m-d'),
                'status'     => $r->status,
                'keterangan' => $r->keterangan,
            ])->values()->all();

            return [
                'siswa_id'     => $s->id,
                'nama_lengkap' => $s->nama_lengkap,
                'nis'          => $s->nis,
                'counts'       => $counts,
                'pct_kehadiran' => $pctKehadiran,
                'detail'       => $detail,
            ];
        })->values()->all();

        // ── Rekap level kelas ──────────────────────────────────────────────
        $rekapKelas = [
            'hari_efektif'  => $jumlahHariEfektif,
            'total_siswa'   => count($siswaData),
            'total_hadir'   => $allRecords->where('status', AbsensiHarian::STATUS_HADIR)->count(),
            'total_sakit'   => $allRecords->where('status', AbsensiHarian::STATUS_SAKIT)->count(),
            'total_izin'    => $allRecords->where('status', AbsensiHarian::STATUS_IZIN)->count(),
            'total_alpha'   => $allRecords->where('status', AbsensiHarian::STATUS_ALPHA)->count(),
        ];

        // ── Tren harian (jumlah hadir per tanggal) ─────────────────────────
        $trendHarian = collect($hariEfektif)->map(function (string $tgl) use ($allRecords) {
            $dayRecords = $allRecords->filter(fn ($r) => $r->tanggal->format('Y-m-d') === $tgl);
            $total  = $dayRecords->count();
            $hadir  = $dayRecords->where('status', AbsensiHarian::STATUS_HADIR)->count();
            $sakit  = $dayRecords->where('status', AbsensiHarian::STATUS_SAKIT)->count();
            $izin   = $dayRecords->where('status', AbsensiHarian::STATUS_IZIN)->count();
            $alpha  = $dayRecords->where('status', AbsensiHarian::STATUS_ALPHA)->count();
            $pctHadir = $total > 0 ? round($hadir / $total * 100, 1) : 0;

            return [
                'tanggal'   => $tgl,
                'hadir'     => $hadir,
                'sakit'     => $sakit,
                'izin'      => $izin,
                'alpha'     => $alpha,
                'pct_hadir' => $pctHadir,
            ];
        })->values()->all();

        // ── Tren mingguan (rata-rata kehadiran per minggu) ─────────────────
        $trendMingguan = collect($trendHarian)
            ->groupBy(fn ($d) => \Carbon\Carbon::parse($d['tanggal'])->startOfWeek()->format('Y-m-d'))
            ->map(function ($minggu, $startOfWeek) {
                $hadirArr = $minggu->pluck('pct_hadir')->filter(fn ($v) => $v !== null);
                return [
                    'label'     => 'Mgu ' . \Carbon\Carbon::parse($startOfWeek)->format('d/m'),
                    'pct_hadir' => $hadirArr->count() ? round($hadirArr->avg(), 1) : 0,
                ];
            })
            ->values()
            ->all();

        // ── Tren bulanan (rata-rata kehadiran per bulan dalam rentang) ─────
        $trendBulanan = collect($trendHarian)
            ->groupBy(fn ($d) => \Carbon\Carbon::parse($d['tanggal'])->format('Y-m'))
            ->map(function ($bulanGroup, $ym) use ($bulanNames) {
                [$y, $m] = explode('-', $ym);
                $hadirArr = $bulanGroup->pluck('pct_hadir')->filter(fn ($v) => $v !== null);
                return [
                    'label'     => ($bulanNames[(int)$m] ?? $m) . ' ' . $y,
                    'pct_hadir' => $hadirArr->count() ? round($hadirArr->avg(), 1) : 0,
                ];
            })
            ->values()
            ->all();

        // ── Package analytics ──────────────────────────────────────────────
        $analytics = [
            'rekap_kelas'    => $rekapKelas,
            'siswa'          => $siswaData,
            'trend_harian'   => $trendHarian,
            'trend_mingguan' => $trendMingguan,
            'trend_bulanan'  => $trendBulanan,
        ];

        return Inertia::render('Guru/AbsensiAnalytics', [
            'guru'        => ['nama_lengkap' => $guru->nama_lengkap],
            'kelasList'   => $kelasList,
            'kelas'       => $kelasData,
            'dataLoaded'  => true,
            'mode'        => $mode,
            'bulan'       => $bulan,
            'tahun'       => $tahun,
            'mulai'       => $mulai,
            'sampai'      => $sampai,
            'label'       => $label,
            'hariEfektif' => $hariEfektif,
            'analytics'   => $analytics,
        ]);
    }

    // ── Helper ─────────────────────────────────────────────────────────────

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