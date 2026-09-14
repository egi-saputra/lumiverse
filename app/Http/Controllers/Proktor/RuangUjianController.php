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
            'ids'             => ['required', 'array', 'min:1'],
            'ids.*'           => ['integer', 'exists:ujian_siswa,id'],
            'include_riwayat' => ['required', 'boolean'],
            'confirm_label' => ['required', 'string', 'in:HAPUS'],
        ]);

        $ids            = collect($validated['ids']);
        $includeRiwayat = (bool) $validated['include_riwayat'];

        try {
            DB::transaction(function () use ($ids, $includeRiwayat) {

                if ($includeRiwayat) {
                    RiwayatUjian::where(function ($q) use ($ids) {
                        $q->whereIn('ujian_siswa_id', $ids)
                        ->orWhereIn(
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
                    })->delete(); // soft delete otomatis karena trait SoftDeletes
                }

                UjianSiswa::whereIn('id', $ids)->delete(); // soft delete
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

    // ── Page: halaman trash ────────────────────────────────────────

    public function trashIndex(): Response
    {
        return Inertia::render('Proktor/RuangUjianTrash', [
            'title' => 'Data Terhapus (Trash)',
        ]);
    }

    // ── API: daftar data yang sudah soft-delete ────────────────────

    public function trashed(): JsonResponse
    {
        return response()->json([
            'trashed' => UjianSiswa::onlyTrashed()
                ->with(['user.siswa.kelas', 'soal.mapel'])
                ->orderByDesc('deleted_at')
                ->get(),
        ]);
    }

    // ── API: pulihkan data ──────────────────────────────────────────

    public function restore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids'             => ['required', 'array', 'min:1'],
            'ids.*'           => ['integer'],
            'include_riwayat' => ['required', 'boolean'],
        ]);

        $ids            = collect($validated['ids']);
        $includeRiwayat = (bool) $validated['include_riwayat'];

        try {
            DB::transaction(function () use ($ids, $includeRiwayat) {
                UjianSiswa::onlyTrashed()->whereIn('id', $ids)->restore();

                if ($includeRiwayat) {
                    $this->scopeRiwayatByUjianSiswaIds($ids, onlyTrashed: true)->restore();
                }
            });

            return response()->json(['message' => 'Data berhasil dipulihkan.']);

        } catch (Throwable $e) {
            report($e);

            return response()->json(['message' => 'Terjadi kesalahan saat memulihkan data.'], 500);
        }
    }

    // ── API: hapus permanen (tidak bisa dibatalkan) ─────────────────

    public function forceDeleteData(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids'             => ['required', 'array', 'min:1'],
            'ids.*'           => ['integer'],
            'include_riwayat' => ['required', 'boolean'],
            'confirm_label'   => ['required', 'string', 'in:HAPUS PERMANEN'],
        ]);

        $ids            = collect($validated['ids']);
        $includeRiwayat = (bool) $validated['include_riwayat'];

        try {
            DB::transaction(function () use ($ids, $includeRiwayat) {
                if ($includeRiwayat) {
                    $this->scopeRiwayatByUjianSiswaIds($ids, onlyTrashed: true)->forceDelete();
                }

                // Hanya boleh force-delete data yang MEMANG sudah trashed —
                // mencegah force-delete tidak sengaja kena data aktif.
                UjianSiswa::onlyTrashed()->whereIn('id', $ids)->forceDelete();
            });

            return response()->json(['message' => 'Data berhasil dihapus permanen.']);

        } catch (Throwable $e) {
            report($e);

            return response()->json(['message' => 'Terjadi kesalahan saat menghapus permanen.'], 500);
        }
    }

    // ── Internal: scope riwayat_ujian berdasarkan ujian_siswa_id (+ fallback lama) ──

    private function scopeRiwayatByUjianSiswaIds($ids, bool $onlyTrashed = false)
    {
        $query = $onlyTrashed ? RiwayatUjian::onlyTrashed() : RiwayatUjian::query();

        return $query->where(function ($q) use ($ids, $onlyTrashed) {
            $q->whereIn('ujian_siswa_id', $ids)
            ->orWhereIn(
                'id',
                ($onlyTrashed ? RiwayatUjian::onlyTrashed() : RiwayatUjian::query())
                    ->whereNull('ujian_siswa_id')
                    ->whereIn('user_id', fn ($sub) => $sub->select('user_id')->from('ujian_siswa')->whereIn('id', $ids))
                    ->whereIn('soal_id', fn ($sub) => $sub->select('soal_id')->from('ujian_siswa')->whereIn('id', $ids))
                    ->select('id')
            );
        });
    }
}