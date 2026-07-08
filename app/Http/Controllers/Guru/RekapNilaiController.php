<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Soal;
use App\Models\Mapel;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RiwayatUjian;
use Illuminate\Support\Facades\DB;

class RekapNilaiController extends Controller
{
    // ── Halaman utama (Inertia) ────────────────────────────────────────────────
    public function index()
    {
        return Inertia::render('Guru/NilaiUjian', [
            'title' => 'Assessment',
        ]);
    }

    // ── Dropdown: list soal milik guru ─────────────────────────────────────────
    public function listSoal()
    {
        return Soal::select('id', 'title', 'mapel_id', 'kelas')
            ->where('user_id', auth()->id())
            ->orderBy('title')
            ->get();
    }

    // ── Dropdown: mapel yang pernah dipakai guru ───────────────────────────────
    public function listMapel()
    {
        $mapelIds = Soal::where('user_id', auth()->id())
            ->pluck('mapel_id')
            ->unique()
            ->filter();

        return Mapel::select('id', 'mapel')
            ->whereIn('id', $mapelIds)
            ->orderBy('mapel')
            ->get();
    }

    // ── Dropdown: kelas yang sudah mengerjakan soal guru ──────────────────────
    public function listKelas()
    {
        $kelasIds = RiwayatUjian::join('soal', 'soal.id', '=', 'riwayat_ujian.soal_id')
            ->join('siswa', 'siswa.user_id', '=', 'riwayat_ujian.user_id')
            ->where('soal.user_id', auth()->id())
            ->whereNotNull('siswa.kelas_id')
            ->where('siswa.kelas_id', '!=', '')
            ->pluck('siswa.kelas_id')
            ->unique()
            ->values();

        return Kelas::select('id', 'kelas')
            ->whereIn('id', $kelasIds)
            ->whereNotNull('kelas')
            ->where('kelas', '!=', '')
            ->orderBy('kelas')
            ->get();
    }

    // ── Rekap filtered (satu query, data flat) ────────────────────────────────
    public function rekapFiltered(Request $req)
    {
        $guruId = auth()->id();

        $query = DB::table('riwayat_ujian as ru')
            ->join('soal',  'soal.id',  '=', 'ru.soal_id')
            ->join('mapel', 'mapel.id', '=', 'soal.mapel_id')
            ->join('users', 'users.id', '=', 'ru.user_id')
            ->join('siswa', 'siswa.user_id', '=', 'users.id')
            ->leftJoin('kelas', function ($join) {
                $join->whereRaw('kelas.id = CAST(siswa.kelas_id AS UNSIGNED)');
            })
            ->where('soal.user_id', $guruId)
            ->select(
                'ru.user_id',
                'ru.soal_id',
                'siswa.nama_lengkap',
                'kelas.kelas       as nama_kelas',
                'mapel.mapel       as nama_mapel',
                'soal.title        as nama_soal',
                DB::raw('SUM(ru.benar)       as total_benar'),
                DB::raw('SUM(ru.nilai)       as total_nilai'),
                DB::raw('COUNT(ru.quest_id)  as dijawab'),   // ← soal yang dijawab
                DB::raw('MAX(ru.status)      as status')
            )
            ->groupBy(
                'ru.user_id', 'ru.soal_id',
                'siswa.nama_lengkap', 'kelas.kelas',
                'mapel.mapel', 'soal.title'
            );

        if ($req->filled('soal_title')) $query->where('soal.title', $req->soal_title);
        if ($req->filled('mapel_id'))   $query->where('mapel.id',   $req->mapel_id);
        if ($req->filled('kelas_id'))   $query->where('siswa.kelas_id', $req->kelas_id);

        $rekap = $query->orderBy('siswa.nama_lengkap')->get();

        // ── Ambil total soal dari bank_soal (bulk, bukan per-item) ────────────
        $soalIds     = $rekap->pluck('soal_id')->unique()->values();
        $totalSoalMap = DB::table('bank_soal')
            ->select('soal_id', DB::raw('COUNT(*) as total'))
            ->whereIn('soal_id', $soalIds)
            ->groupBy('soal_id')
            ->pluck('total', 'soal_id');

        // ── Map ke shape flat yang dipakai frontend ───────────────────────────
        $result = $rekap->map(function ($item) use ($totalSoalMap) {
            $totalSoal  = (int) ($totalSoalMap[$item->soal_id] ?? 0);
            $dijawab    = (int) $item->dijawab;
            $totalBenar = (int) $item->total_benar;

            return [
                'user_id'       => $item->user_id,
                'soal_id'       => $item->soal_id,
                'nama_lengkap'  => $item->nama_lengkap ?? '-',
                'nama_kelas'    => $item->nama_kelas   ?? '-',
                'nama_mapel'    => $item->nama_mapel   ?? '-',
                'nama_soal'     => $item->nama_soal    ?? '-',
                'total_soal'    => $totalSoal,
                'dijawab'       => $dijawab,
                'tidak_dijawab' => max(0, $totalSoal - $dijawab),
                'total_benar'   => $totalBenar,
                'salah'         => max(0, $dijawab - $totalBenar),
                'total_nilai'   => (float) $item->total_nilai,
                'status'        => $item->status ?? '-',
            ];
        });

        return response()->json($result);
    }
}