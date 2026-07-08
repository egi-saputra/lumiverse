<?php

namespace App\Http\Controllers\Proktor;

use App\Http\Controllers\Controller;
use App\Models\Soal;
use App\Models\Mapel;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NilaiController extends Controller
{
    /**
     * Render halaman utama Rekap Nilai.
     */
    public function index(): Response
    {
        return Inertia::render('Proktor/Nilai', [
            'title' => 'Rekap Penilaian',
        ]);
    }

    /**
     * Daftar soal untuk dropdown filter.
     */
    public function listSoal(): JsonResponse
    {
        $soal = Soal::select('id', 'title')
            ->orderBy('title')
            ->get();

        return response()->json($soal);
    }

    /**
     * Daftar mapel untuk dropdown filter.
     */
    public function listMapel(): JsonResponse
    {
        $mapel = Mapel::select('id', 'mapel')
            ->orderBy('mapel')
            ->get();

        return response()->json($mapel);
    }

    /**
     * Daftar kelas untuk dropdown filter.
     */
    public function listKelas(): JsonResponse
    {
        $kelas = Kelas::select('id', 'kelas')
            ->orderBy('kelas')
            ->get();

        return response()->json($kelas);
    }

    /**
     * Generate rekap nilai berdasarkan filter.
     * Menggunakan single query dengan JOIN agar lebih efisien (N+1 free).
     */
    public function rekapFiltered(Request $request): JsonResponse
    {
        // Validasi input filter
        $validated = $request->validate([
            'soal_title' => ['nullable', 'string', 'max:255'],
            'mapel_id'   => ['nullable', 'integer', 'exists:mapel,id'],
            'kelas_id'   => ['nullable', 'integer', 'exists:kelas,id'],
        ]);

        $query = DB::table('riwayat_ujian as ru')
            ->leftJoin('soal',  'soal.id',  '=', 'ru.soal_id')
            ->leftJoin('mapel', 'mapel.id', '=', 'soal.mapel_id')
            ->leftJoin('users', 'users.id', '=', 'ru.user_id')
            ->leftJoin('siswa', 'siswa.user_id', '=', 'users.id')
            ->leftJoin('kelas', 'kelas.id',  '=', 'siswa.kelas_id')
            ->select([
                'ru.user_id',
                'ru.soal_id',

                // Data siswa
                'siswa.nama_lengkap',
                'kelas.kelas as nama_kelas',
                'kelas.id as kelas_id',

                // Data soal & mapel
                'soal.title as soal_title',
                'soal.mapel_id',
                'mapel.mapel as nama_mapel',

                // Agregat
                DB::raw('SUM(ru.benar)         AS total_benar'),
                DB::raw('SUM(ru.nilai)          AS total_nilai'),
                DB::raw('COUNT(ru.quest_id)     AS dijawab'),
                DB::raw('MAX(ru.status)         AS status'),
            ]);

        // Filter aman via validated data (no raw user input in query)
        if (!empty($validated['soal_title'])) {
            $query->where('soal.title', $validated['soal_title']);
        }
        if (!empty($validated['mapel_id'])) {
            $query->where('mapel.id', $validated['mapel_id']);
        }
        if (!empty($validated['kelas_id'])) {
            $query->where('kelas.id', $validated['kelas_id']);
        }

        $query->groupBy(
            'ru.user_id',
            'ru.soal_id',
            'siswa.nama_lengkap',
            'kelas.kelas',
            'kelas.id',
            'soal.title',
            'soal.mapel_id',
            'mapel.mapel',
        );

        $rekap = $query->get();

        // Hitung total soal dari bank_soal (bulk query, bukan per-item)
        $soalIds = $rekap->pluck('soal_id')->unique()->values();

        $totalSoalMap = DB::table('bank_soal')
            ->select('soal_id', DB::raw('COUNT(*) as total'))
            ->whereIn('soal_id', $soalIds)
            ->groupBy('soal_id')
            ->pluck('total', 'soal_id');

        // Map data final — tidak ada query di dalam loop
        $result = $rekap->map(function ($item) use ($totalSoalMap) {
            $totalSoal    = (int) ($totalSoalMap[$item->soal_id] ?? 0);
            $dijawab      = (int) $item->dijawab;
            $totalBenar   = (int) $item->total_benar;

            return [
                'user_id'        => $item->user_id,
                'soal_id'        => $item->soal_id,
                'nama_lengkap'   => $item->nama_lengkap ?? '-',
                'nama_kelas'     => $item->nama_kelas   ?? '-',
                'kelas_id'       => $item->kelas_id,
                'soal_title'     => $item->soal_title   ?? '-',
                'mapel_id'       => $item->mapel_id,
                'nama_mapel'     => $item->nama_mapel   ?? '-',
                'total_soal'     => $totalSoal,
                'dijawab'        => $dijawab,
                'tidak_dijawab'  => max(0, $totalSoal - $dijawab),
                'total_benar'    => $totalBenar,
                'salah'          => max(0, $dijawab - $totalBenar),
                'total_nilai'    => (float) $item->total_nilai,
                'status'         => $item->status ?? '-',
            ];
        });

        return response()->json($result);
    }

    /**
     * Hapus semua riwayat ujian berdasarkan filter aktif.
     * Yang dihapus: riwayat_ujian dengan soal_id & kelas_id sesuai filter.
     */
    public function destroyRekap(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'soal_title' => ['nullable', 'string', 'max:255'],
            'mapel_id'   => ['nullable', 'integer', 'exists:mapel,id'],
            'kelas_id'   => ['nullable', 'integer', 'exists:kelas,id'],
        ]);

        // Minimal satu filter harus aktif — mencegah hapus semua data sekaligus
        if (empty($validated['soal_title']) && empty($validated['mapel_id']) && empty($validated['kelas_id'])) {
            return response()->json(['message' => 'Minimal satu filter harus aktif.'], 422);
        }

        // Kumpulkan soal_id yang cocok dengan filter
        $soalQuery = DB::table('soal')
            ->select('soal.id');

        if (!empty($validated['soal_title'])) {
            $soalQuery->where('soal.title', $validated['soal_title']);
        }
        if (!empty($validated['mapel_id'])) {
            $soalQuery->where('soal.mapel_id', $validated['mapel_id']);
        }

        $soalIds = $soalQuery->pluck('id');

        if ($soalIds->isEmpty()) {
            return response()->json(['message' => 'Tidak ada soal yang cocok dengan filter.'], 404);
        }

        // Build query hapus riwayat_ujian
        $deleteQuery = DB::table('riwayat_ujian')
            ->whereIn('soal_id', $soalIds);

        // Filter kelas: join via siswa → users
        if (!empty($validated['kelas_id'])) {
            $userIds = DB::table('siswa')
                ->where('kelas_id', $validated['kelas_id'])
                ->pluck('user_id');

            $deleteQuery->whereIn('user_id', $userIds);
        }

        $deleted = $deleteQuery->delete();

        return response()->json([
            'message' => "Berhasil menghapus {$deleted} baris riwayat ujian.",
            'deleted' => $deleted,
        ]);
    }
}