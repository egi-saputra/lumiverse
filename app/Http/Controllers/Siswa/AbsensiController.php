<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\AbsensiHarian;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AbsensiController extends Controller
{
    /**
     * Tampilkan halaman input absensi oleh sekretaris.
     * GET /siswa/absensi
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user    = Auth::user();
        $siswaMe = $user->siswa;

        abort_unless(
            $siswaMe && $siswaMe->sekretaris === 'yes',
            403,
            'Hanya sekretaris kelas yang dapat mengakses halaman ini.'
        );

        $kelas = $siswaMe->kelas;
        $today = Carbon::today();

        $daftarSiswa = Siswa::where('kelas_id', $siswaMe->kelas_id)
            ->where('status', 'Activated')
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nis', 'id_siswa', 'sekretaris']);

        $absensiHariIni = AbsensiHarian::where('kelas_id', $siswaMe->kelas_id)
            ->tanggal($today->toDateString())
            ->get(['siswa_id', 'status', 'keterangan']);

        $sudahDisimpan = $absensiHariIni->isNotEmpty();

        $rekapBulan = AbsensiHarian::where('kelas_id', $siswaMe->kelas_id)
            ->bulan($today->month, $today->year)
            ->selectRaw("
                COUNT(DISTINCT tanggal)      AS total_hari_aktif,
                SUM(status = 'hadir')        AS hadir,
                SUM(status = 'sakit')        AS sakit,
                SUM(status = 'izin')         AS izin,
                SUM(status = 'alpha')        AS alpha
            ")
            ->first();

        return Inertia::render('Siswa/AbsensiHarian', [
            'sekretaris' => [
                'id'         => $siswaMe->id,
                'nama'       => $siswaMe->nama_lengkap,
                'nis'        => $siswaMe->nis,
                'kelas_id'   => (int) $siswaMe->kelas_id,   // ← cast integer
                'kelas_nama' => $kelas->nama ?? '-',
            ],
            'daftar_siswa' => $daftarSiswa->map(fn($s) => [
                'id'            => (int) $s->id,
                'nama'          => $s->nama_lengkap,
                'nis'           => $s->nis ?? $s->id_siswa,
                'is_sekretaris' => $s->sekretaris === 'yes',
            ]),
            'absensi_hari_ini' => $absensiHariIni->map(fn($a) => [
                'siswa_id'   => (int) $a->siswa_id,
                'status'     => $a->status,
                'keterangan' => $a->keterangan,
            ]),
            'sudah_disimpan' => $sudahDisimpan,
            'rekap_bulan' => [
                'hadir'            => (int) ($rekapBulan->hadir            ?? 0),
                'sakit'            => (int) ($rekapBulan->sakit            ?? 0),
                'izin'             => (int) ($rekapBulan->izin             ?? 0),
                'alpha'            => (int) ($rekapBulan->alpha            ?? 0),
                'total_hari_aktif' => (int) ($rekapBulan->total_hari_aktif ?? 0),
            ],
        ]);
    }

    /**
     * Simpan absensi seluruh siswa kelas sekaligus.
     * POST /siswa/absensi
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user    = Auth::user();
        $siswaMe = $user->siswa;

        abort_unless(
            $siswaMe && $siswaMe->sekretaris === 'yes',
            403,
            'Hanya sekretaris kelas yang dapat menyimpan absensi.'
        );

        $request->validate([
            'kelas_id'             => ['required', 'integer', 'exists:kelas,id'],
            'tanggal'              => ['required', 'date', 'before_or_equal:today'],
            'absensi'              => ['required', 'array', 'min:1'],
            'absensi.*.siswa_id'   => ['required', 'integer', 'exists:siswa,id'],
            'absensi.*.status'     => ['required', 'in:' . implode(',', AbsensiHarian::STATUSES)],
            'absensi.*.keterangan' => ['nullable', 'string', 'max:500'],
        ]);

        // FIX: cast kedua sisi ke integer agar strict comparison tidak gagal
        abort_unless(
            (int) $request->kelas_id === (int) $siswaMe->kelas_id,
            403,
            'Kelas tidak sesuai dengan kelas Anda.'
        );

        // Tolak jika absensi hari itu sudah ada
        $sudahAda = AbsensiHarian::where('kelas_id', $request->kelas_id)
            ->whereDate('tanggal', $request->tanggal)
            ->exists();

        if ($sudahAda) {
            return back()->with('error', 'Absensi untuk hari ini sudah pernah disimpan dan terkunci.');
        }

        // Validasi: semua siswa_id harus dari kelas yang sama dan berstatus aktif
        $siswaIds = Siswa::where('kelas_id', $request->kelas_id)
            ->where('status', 'Activated')
            ->pluck('id')
            ->map(fn($id) => (int) $id)
            ->toArray();

        foreach ($request->absensi as $item) {
            abort_unless(
                in_array((int) $item['siswa_id'], $siswaIds, true),
                422,
                'Terdapat siswa yang bukan anggota aktif kelas ini.'
            );
        }

        DB::transaction(function () use ($request, $user) {
            $now  = now();
            $rows = array_map(fn($item) => [
                'siswa_id'     => (int) $item['siswa_id'],
                'kelas_id'     => (int) $request->kelas_id,
                'tanggal'      => $request->tanggal,
                'status'       => $item['status'],
                'keterangan'   => $item['keterangan'] ?? null,
                'dicatat_oleh' => $user->id,
                'created_at'   => $now,
                'updated_at'   => $now,
            ], $request->absensi);

            AbsensiHarian::insert($rows);
        });

        return back()->with('success', 'Absensi kelas berhasil disimpan!');
    }
}