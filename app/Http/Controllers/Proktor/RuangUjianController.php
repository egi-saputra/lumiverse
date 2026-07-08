<?php

namespace App\Http\Controllers\Proktor;

use App\Http\Controllers\Controller;
use App\Models\RiwayatUjian;
use App\Models\UjianSiswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class RuangUjianController extends Controller
{
    // ── Page ──────────────────────────────────────────────────────

    public function index(): Response
    {
        return Inertia::render('Proktor/RuangUjian', [
            'peserta' => $this->loadPeserta(),
            'title' => "Exam Rooms",
        ]);
    }

    // ── API: daftar peserta ────────────────────────────────────────

    public function peserta(): JsonResponse
    {
        return response()->json([
            'peserta' => $this->loadPeserta(),
        ]);
    }

    // ── API: hapus satu peserta (tanpa riwayat) ───────────────────

    public function destroyPeserta(int $id): JsonResponse
    {
        $peserta = UjianSiswa::findOrFail($id);
        $peserta->delete();

        return response()->json(['message' => 'Peserta berhasil dihapus.']);
    }

    // ── API: hapus semua / per-kelas ──────────────────────────────

    public function destroyAll(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kelas'           => ['nullable', 'string', 'max:100'],
            'include_riwayat' => ['required', 'boolean'],
        ]);

        $kelas          = $validated['kelas'] ?? null;
        $includeRiwayat = (bool) $validated['include_riwayat'];

        try {
            DB::transaction(function () use ($kelas, $includeRiwayat) {

                // 1. Tentukan ID ujian_siswa yang akan dihapus
                $ids = UjianSiswa::query()
                    ->when(
                        $kelas,
                        fn ($q) => $q->whereHas(
                            'user.siswa.kelas',
                            fn ($q2) => $q2->where('kelas', $kelas)
                        )
                    )
                    ->pluck('id');

                if ($ids->isEmpty()) {
                    return;
                }

                // 2. Hapus riwayat_ujian terlebih dahulu jika diminta
                //    — gunakan ujian_siswa_id (kolom FK yang benar)
                //    — fallback ke user_id+soal_id untuk data lama yang belum ter-backfill
                if ($includeRiwayat) {
                    RiwayatUjian::where(function ($q) use ($ids) {
                        $q->whereIn('ujian_siswa_id', $ids)           // data baru (punya FK)
                          ->orWhereIn(                                  // data lama (FK null)
                              'id',
                              RiwayatUjian::whereNull('ujian_siswa_id')
                                  ->whereIn('user_id', function ($sub) use ($ids) {
                                      $sub->select('user_id')
                                          ->from('ujian_siswa')
                                          ->whereIn('id', $ids);
                                  })
                                  ->whereIn('soal_id', function ($sub) use ($ids) {
                                      $sub->select('soal_id')
                                          ->from('ujian_siswa')
                                          ->whereIn('id', $ids);
                                  })
                                  ->select('id')
                          );
                    })->delete();
                }

                // 3. Hapus ujian_siswa
                UjianSiswa::whereIn('id', $ids)->delete();
            });

            return response()->json(['message' => 'Data berhasil dihapus.']);

        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.',
            ], 500);
        }
    }

    // ── Internal ──────────────────────────────────────────────────

    private function loadPeserta(): \Illuminate\Database\Eloquent\Collection
    {
        return UjianSiswa::with([
            'user.siswa.kelas',
            'soal.mapel',
        ])->orderByDesc('id')->get();
    }
}