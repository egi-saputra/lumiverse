<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\AbsensiHarian;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PresensiController extends Controller
{
    // ─────────────────────────────────────────────────────────────
    //  Helpers — TIDAK ada lagi resolveKelas / authorizeKelas
    //  Semua guru bebas akses semua route di controller ini.
    // ─────────────────────────────────────────────────────────────

    private function resolveGuru(): Guru
    {
        return Guru::where('user_id', auth()->id())->firstOrFail();
    }

    /**
     * Ambil semua kelas beserta info wali kelas dan jumlah siswa aktif.
     */
    private function getAllKelasList(): \Illuminate\Support\Collection
    {
        return Kelas::with('guru:id,nama_lengkap')
            ->withCount(['siswa' => fn ($q) => $q->where('status', 'Activated')])
            ->orderBy('kelas')
            ->get()
            ->map(fn (Kelas $k) => [
                'id'           => $k->id,
                'kelas'        => $k->kelas,
                'guru_nama'    => $k->guru?->nama_lengkap ?? '—',
                'jumlah_siswa' => $k->siswa_count,
            ]);
    }

    /**
     * Ambil semua siswa aktif suatu kelas, diurutkan nama.
     */
    private function getSiswaKelas(int $kelasId)
    {
        return Siswa::where('kelas_id', $kelasId)
            ->where('status', 'Activated')
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nis', 'nisn', 'id_siswa']);
    }

    // ─────────────────────────────────────────────────────────────
    //  INDEX — Input absensi harian
    //  Semua guru bisa akses. Jika belum pilih kelas → tampilkan picker.
    // ─────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $guru      = $this->resolveGuru();
        $kelasList = $this->getAllKelasList();

        // Belum pilih kelas → kembalikan picker
        if (! $request->filled('kelas_id')) {
            return Inertia::render('Guru/Walas/Rekap', [
                'guru'      => $guru->only(['id', 'nama_lengkap', 'jabatan']),
                'kelasList' => $kelasList,
                'kelas'     => null,
                'tanggal'   => null,
                'siswa'     => [],
                'rekap'     => null,
                'sudahAbsen'=> [],
                'bulanTahun'=> null,
            ]);
        }

        $kelas   = Kelas::findOrFail($request->kelas_id);
        $tanggal = $request->filled('tanggal')
            ? Carbon::parse($request->tanggal)->toDateString()
            : today()->toDateString();

        $siswaList = $this->getSiswaKelas($kelas->id);

        $absensiMap = AbsensiHarian::where('kelas_id', $kelas->id)
            ->whereDate('tanggal', $tanggal)
            ->get()
            ->keyBy('siswa_id');

        $data = $siswaList->map(function (Siswa $s) use ($absensiMap) {
            $absensi = $absensiMap->get($s->id);
            return [
                'siswa_id'     => $s->id,
                'nama_lengkap' => $s->nama_lengkap,
                'nis'          => $s->nis,
                'nisn'         => $s->nisn,
                'id_siswa'     => $s->id_siswa,
                'absensi_id'   => $absensi?->id,
                'status'       => $absensi?->status ?? null,
                'keterangan'   => $absensi?->keterangan ?? '',
            ];
        });

        $rekap = [
            'total'  => $data->count(),
            'hadir'  => $data->where('status', 'hadir')->count(),
            'sakit'  => $data->where('status', 'sakit')->count(),
            'izin'   => $data->where('status', 'izin')->count(),
            'alpha'  => $data->where('status', 'alpha')->count(),
            'belum'  => $data->whereNull('status')->count(),
        ];

        $bulan      = Carbon::parse($tanggal)->month;
        $tahun      = Carbon::parse($tanggal)->year;
        $sudahAbsen = AbsensiHarian::where('kelas_id', $kelas->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->distinct()
            ->pluck('tanggal')
            ->map(fn ($t) => Carbon::parse($t)->toDateString())
            ->unique()
            ->values();

        return Inertia::render('Guru/Walas/Rekap', [
            'guru'       => $guru->only(['id', 'nama_lengkap', 'jabatan']),
            'kelasList'  => $kelasList,
            'kelas'      => $kelas->only(['id', 'kelas']),
            'tanggal'    => $tanggal,
            'siswa'      => $data->values(),
            'rekap'      => $rekap,
            'sudahAbsen' => $sudahAbsen,
            'bulanTahun' => ['bulan' => $bulan, 'tahun' => $tahun],
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    //  STORE — Simpan absensi (bulk, satu tanggal)
    //  Semua guru bisa menyimpan absensi untuk kelas manapun.
    // ─────────────────────────────────────────────────────────────

    public function store(Request $request)
    {
        $this->resolveGuru();

        $validated = $request->validate([
            'kelas_id'             => ['required', 'integer', 'exists:kelas,id'],
            'tanggal'              => ['required', 'date', 'before_or_equal:today'],
            'absensi'              => ['required', 'array', 'min:1'],
            'absensi.*.siswa_id'   => ['required', 'integer', 'exists:siswa,id'],
            'absensi.*.status'     => ['required', Rule::in(AbsensiHarian::STATUSES)],
            'absensi.*.keterangan' => ['nullable', 'string', 'max:500'],
        ]);

        $kelasId = $validated['kelas_id'];
        $tanggal = $validated['tanggal'];
        $userId  = auth()->id();

        // Pastikan siswa yang disubmit memang milik kelas tersebut
        $validSiswaIds = Siswa::where('kelas_id', $kelasId)->pluck('id')->toArray();
        $submitted     = collect($validated['absensi']);
        $invalid       = $submitted->pluck('siswa_id')->diff($validSiswaIds);
        abort_if($invalid->isNotEmpty(), 422, 'Terdapat siswa yang bukan bagian dari kelas ini.');

        DB::transaction(function () use ($submitted, $tanggal, $kelasId, $userId) {
            foreach ($submitted as $item) {
                AbsensiHarian::updateOrCreate(
                    ['siswa_id' => $item['siswa_id'], 'tanggal' => $tanggal],
                    [
                        'kelas_id'     => $kelasId,
                        'status'       => $item['status'],
                        'keterangan'   => $item['keterangan'] ?? null,
                        'dicatat_oleh' => $userId,
                    ]
                );
            }
        });

        return back()->with('success', "Absensi tanggal {$tanggal} berhasil disimpan.");
    }

    // ─────────────────────────────────────────────────────────────
    //  REKAP — Rekap absensi
    //  Semua guru bisa akses. Pilih kelas + klik Tampilkan dulu.
    // ─────────────────────────────────────────────────────────────

    public function rekap(Request $request)
    {
        $guru      = $this->resolveGuru();
        $kelasList = $this->getAllKelasList();

        // Belum pilih kelas → tampilkan picker saja, tanpa data apapun
        if (! $request->filled('kelas_id')) {
            return Inertia::render('Guru/Walas/Rekap', [
                'guru'        => $guru->only(['id', 'nama_lengkap']),
                'kelasList'   => $kelasList,
                'kelas'       => null,
                'mode'        => 'bulan',
                'bulan'       => now()->month,
                'tahun'       => now()->year,
                'mulai'       => null,
                'sampai'      => null,
                'label'       => '',
                'hariEfektif' => [],
                'siswa'       => [],
                'rekapKelas'  => null,
                // Flag: user belum klik "Tampilkan", jadi beda dari "sudah tampilkan tapi kosong"
                'dataLoaded'  => false,
            ]);
        }

        $kelas = Kelas::with('guru:id,nama_lengkap')->findOrFail($request->kelas_id);

        // Jika kelas sudah dipilih tapi belum klik Tampilkan
        // (tidak ada parameter mode/bulan/tahun/mulai/sampai yang eksplisit dari user)
        $userClickedTampilkan = $request->hasAny(['bulan', 'tahun', 'mulai', 'sampai'])
            || $request->filled('mode');

        if (! $userClickedTampilkan) {
            return Inertia::render('Guru/Walas/Rekap', [
                'guru'        => $guru->only(['id', 'nama_lengkap']),
                'kelasList'   => $kelasList,
                'kelas'       => [
                    'id'        => $kelas->id,
                    'kelas'     => $kelas->kelas,
                    'guru_nama' => $kelas->guru?->nama_lengkap ?? '—',
                ],
                'mode'        => 'bulan',
                'bulan'       => now()->month,
                'tahun'       => now()->year,
                'mulai'       => null,
                'sampai'      => null,
                'label'       => '',
                'hariEfektif' => [],
                'siswa'       => [],
                'rekapKelas'  => null,
                'dataLoaded'  => false,
            ]);
        }

        // ── Tentukan rentang tanggal ────────────────────────────
        $mode = $request->input('mode', 'bulan');

        if ($mode === 'rentang' && $request->filled(['mulai', 'sampai'])) {
            $mulai  = Carbon::parse($request->mulai)->startOfDay();
            $sampai = Carbon::parse($request->sampai)->endOfDay();

            abort_if($mulai->gt($sampai),              422, 'Tanggal mulai harus sebelum tanggal akhir.');
            abort_if($mulai->diffInDays($sampai) > 92, 422, 'Rentang maksimal 92 hari.');
            abort_if(
                $sampai->gt(now()->endOfDay()),
                422,
                'Tanggal akhir tidak boleh melebihi hari ini.'
            );

            $queryAbsensi = AbsensiHarian::where('kelas_id', $kelas->id)
                ->whereBetween('tanggal', [$mulai->toDateString(), $sampai->toDateString()]);

            $mulaiStr  = $mulai->toDateString();
            $sampaiStr = $sampai->toDateString();
            $bulan     = null;
            $tahun     = null;
            $label     = $mulai->translatedFormat('d M Y') . ' — ' . $sampai->translatedFormat('d M Y');

        } else {
            $mode  = 'bulan';
            $bulan = (int) ($request->bulan ?? now()->month);
            $tahun = (int) ($request->tahun ?? now()->year);

            abort_if($bulan < 1 || $bulan > 12,                 422, 'Bulan tidak valid.');
            abort_if($tahun < 2020 || $tahun > now()->year + 1, 422, 'Tahun tidak valid.');

            $mulai  = Carbon::createFromDate($tahun, $bulan, 1)->startOfMonth();
            $sampai = Carbon::createFromDate($tahun, $bulan, 1)->endOfMonth();

            $queryAbsensi = AbsensiHarian::where('kelas_id', $kelas->id)
                ->whereMonth('tanggal', $bulan)
                ->whereYear('tanggal', $tahun);

            $mulaiStr  = $mulai->toDateString();
            $sampaiStr = $sampai->toDateString();
            $label     = $mulai->translatedFormat('F Y');
        }

        // ── Proses data ─────────────────────────────────────────
        $siswaList   = $this->getSiswaKelas($kelas->id);
        $absensiList = $queryAbsensi->get(['siswa_id', 'tanggal', 'status', 'keterangan']);

        $hariEfektif = $absensiList
            ->pluck('tanggal')
            ->map(fn ($t) => Carbon::parse($t)->toDateString())
            ->unique()->sort()->values();

        $absensiPerSiswa = $absensiList->groupBy('siswa_id');

        $rekapSiswa = $siswaList->map(function (Siswa $s) use ($absensiPerSiswa, $hariEfektif) {
            $records   = $absensiPerSiswa->get($s->id, collect());
            $statusMap = $records->keyBy(fn ($r) => Carbon::parse($r->tanggal)->toDateString());

            $counts = [
                'hadir' => $records->where('status', 'hadir')->count(),
                'sakit' => $records->where('status', 'sakit')->count(),
                'izin'  => $records->where('status', 'izin')->count(),
                'alpha' => $records->where('status', 'alpha')->count(),
            ];

            $totalHari    = $hariEfektif->count();
            $pctKehadiran = $totalHari > 0
                ? round(($counts['hadir'] / $totalHari) * 100, 1)
                : null;

            $catatanList = $hariEfektif
                ->filter(fn ($tgl) => $statusMap->has($tgl) && ! empty($statusMap->get($tgl)?->keterangan))
                ->map(fn ($tgl) => [
                    'tanggal'    => $tgl,
                    'status'     => $statusMap->get($tgl)?->status,
                    'keterangan' => $statusMap->get($tgl)?->keterangan,
                ])
                ->values();

            return [
                'siswa_id'      => $s->id,
                'nama_lengkap'  => $s->nama_lengkap,
                'nis'           => $s->nis,
                'id_siswa'      => $s->id_siswa,
                'counts'        => $counts,
                'pct_kehadiran' => $pctKehadiran,
                'catatan'       => $catatanList,
                'detail'        => $hariEfektif->map(fn ($tgl) => [
                    'tanggal'    => $tgl,
                    'status'     => $statusMap->get($tgl)?->status     ?? null,
                    'keterangan' => $statusMap->get($tgl)?->keterangan ?? null,
                ])->values(),
            ];
        });

        $rekapKelas = [
            'total_siswa'  => $siswaList->count(),
            'hari_efektif' => $hariEfektif->count(),
            'total_hadir'  => $rekapSiswa->sum(fn ($s) => $s['counts']['hadir']),
            'total_sakit'  => $rekapSiswa->sum(fn ($s) => $s['counts']['sakit']),
            'total_izin'   => $rekapSiswa->sum(fn ($s) => $s['counts']['izin']),
            'total_alpha'  => $rekapSiswa->sum(fn ($s) => $s['counts']['alpha']),
        ];

        return Inertia::render('Guru/Walas/Rekap', [
            'guru'        => $guru->only(['id', 'nama_lengkap']),
            'kelasList'   => $kelasList,
            'kelas'       => [
                'id'        => $kelas->id,
                'kelas'     => $kelas->kelas,
                'guru_nama' => $kelas->guru?->nama_lengkap ?? '—',
            ],
            'mode'        => $mode,
            'bulan'       => $bulan,
            'tahun'       => $tahun,
            'mulai'       => $mulaiStr,
            'sampai'      => $sampaiStr,
            'label'       => $label,
            'hariEfektif' => $hariEfektif,
            'siswa'       => $rekapSiswa->values(),
            'rekapKelas'  => $rekapKelas,
            'dataLoaded'  => true,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    //  UPDATE — Edit satu record absensi
    //  Semua guru bisa edit.
    // ─────────────────────────────────────────────────────────────

    public function update(Request $request, AbsensiHarian $absensi)
    {
        $this->resolveGuru();

        $validated = $request->validate([
            'status'     => ['required', Rule::in(AbsensiHarian::STATUSES)],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ]);

        $absensi->update([
            'status'       => $validated['status'],
            'keterangan'   => $validated['keterangan'] ?? null,
            'dicatat_oleh' => auth()->id(),
        ]);

        return back()->with('success', 'Absensi berhasil diperbarui.');
    }

    // ─────────────────────────────────────────────────────────────
    //  DESTROY — Hapus satu record absensi
    //  Semua guru bisa hapus.
    // ─────────────────────────────────────────────────────────────

    public function destroy(AbsensiHarian $absensi)
    {
        $this->resolveGuru();
        $absensi->delete();

        return back()->with('success', 'Data absensi berhasil dihapus.');
    }
}