<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Exports\BankSoalExport;
use App\Exports\BankSoalWithDataExport;
use App\Imports\BankSoalImport;
use App\Models\BankSoal;
use App\Models\Soal;
use App\Models\UjianSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;
use App\Services\Ai\AiGenerationQuotaService;
use Illuminate\Support\Facades\Auth;

class QuestController extends Controller
{
    protected AiGenerationQuotaService $quotaService;

    public function __construct(AiGenerationQuotaService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    // ─── Recalculate riwayat_ujian setelah jawaban_benar atau nilai berubah ───
    private function recalculateRiwayat(BankSoal $bankSoal): void
    {
        // Essay tidak punya logika benar/salah otomatis
        if ($bankSoal->tipe_soal === 'Essay' || is_null($bankSoal->jawaban_benar)) {
            return;
        }

        $exists = DB::table('riwayat_ujian')
            ->where('quest_id', $bankSoal->id)
            ->exists();

        if (!$exists) {
            return;
        }

        // jawaban_benar = 'opsi_b', jawaban siswa = 'B'
        // CONCAT('opsi_', LOWER(jawaban)) untuk menyamakan format
        DB::statement("
            UPDATE riwayat_ujian
            SET
                benar = CASE WHEN CONCAT('opsi_', LOWER(jawaban)) = ? THEN 1 ELSE 0 END,
                nilai = CASE WHEN CONCAT('opsi_', LOWER(jawaban)) = ? THEN ? ELSE 0 END
            WHERE quest_id = ?
        ", [
            $bankSoal->jawaban_benar,
            $bankSoal->jawaban_benar,
            (float) $bankSoal->nilai,
            $bankSoal->id,
        ]);
    }

    // ─── Cache flush helper ───────────────────────────────────────────────────
    private function flushSoalCache(int $soalId): void
    {
        Cache::forget("soal:{$soalId}:jumlah");
        Cache::forget("soal:{$soalId}:base");
        Cache::forget("soal:{$soalId}:detail");

        UjianSiswa::where('soal_id', $soalId)
            ->where('status', '!=', 'Sedang Dikerjakan')
            ->pluck('user_id')
            ->each(function ($userId) use ($soalId) {
                Cache::forget("ujian:{$soalId}:u:{$userId}:urutan");
                Cache::forget("ujian:{$soalId}:u:{$userId}:answered");
            });
    }

    // ─── Simpan file lampiran ─────────────────────────────────────────────────

    private function storeLampiran(Request $request): ?string
    {
        if ($request->jenis_lampiran !== 'Gambar' || !$request->hasFile('lampiran_file')) {
            return null;
        }

        $file     = $request->file('lampiran_file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->storeAs('public/bank_soal', $filename);

        return 'storage/bank_soal/' . $filename;
    }

    // ─── Hapus file lampiran lama ─────────────────────────────────────────────

    private function deleteLampiran(?string $path): void
    {
        if (!$path) return;

        $storagePath = str_replace('storage/', 'public/', $path);
        if (Storage::exists($storagePath)) {
            Storage::delete($storagePath);
        }
    }

    // ─── Simpan lampiran opsi jawaban ─────────────────────────────────────────

    private function storeOpsiLampiran(Request $request, string $key): ?string
    {
        $field = "opsi_{$key}_file";
        if (!$request->hasFile($field)) return null;

        $file     = $request->file($field);
        $filename = time() . '_' . $key . '_' . $file->getClientOriginalName();
        $file->storeAs('public/bank_soal', $filename);

        return 'storage/bank_soal/' . $filename;
    }

    private function deleteAllOpsiLampiran(BankSoal $bankSoal): void
    {
        foreach (['a', 'b', 'c', 'd', 'e'] as $key) {
            $this->deleteLampiran($bankSoal->{"opsi_{$key}_lampiran"});
        }
    }

    // ─── Index ────────────────────────────────────────────────────────────────

    public function index()
    {
        return redirect()->route('guru.soal.index');
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    public function create(Request $request)
    {
        return Inertia::render('Guru/Quest/Create', [
            'soal_id' => $request->soal_id,
        ]);
    }

    // ─── Store ────────────────────────────────────────────────────────────────

    public function store(Request $request)
    {
        $request->validate([
            'soal_id'        => 'required|exists:soal,id',
            'soal'           => 'required|string',
            'tipe_soal'      => 'required|in:PG,Essay',
            'jawaban_benar'  => 'nullable|string',
            'nilai'          => 'required|numeric',
            'jenis_lampiran' => 'nullable|string|in:Tanpa Lampiran,Gambar',
            'lampiran_file'  => 'nullable|file|image|max:5120',
            'opsi_a'         => 'nullable|string',
            'opsi_b'         => 'nullable|string',
            'opsi_c'         => 'nullable|string',
            'opsi_d'         => 'nullable|string',
            'opsi_e'         => 'nullable|string',
            'opsi_a_file'    => 'nullable|file|image|max:5120',
            'opsi_b_file'    => 'nullable|file|image|max:5120',
            'opsi_c_file'    => 'nullable|file|image|max:5120',
            'opsi_d_file'    => 'nullable|file|image|max:5120',
            'opsi_e_file'    => 'nullable|file|image|max:5120',
        ]);

        try {
            $bankSoal = BankSoal::create([
                'soal_id'         => $request->soal_id,
                'soal'            => $request->soal,
                'tipe_soal'       => $request->tipe_soal,
                'jenis_lampiran'  => $request->jenis_lampiran,
                'link_lampiran'   => $this->storeLampiran($request),
                'jawaban_benar'   => $request->jawaban_benar,
                'opsi_a'          => $request->opsi_a,
                'opsi_b'          => $request->opsi_b,
                'opsi_c'          => $request->opsi_c,
                'opsi_d'          => $request->opsi_d,
                'opsi_e'          => $request->opsi_e,
                'opsi_a_lampiran' => $this->storeOpsiLampiran($request, 'a'),
                'opsi_b_lampiran' => $this->storeOpsiLampiran($request, 'b'),
                'opsi_c_lampiran' => $this->storeOpsiLampiran($request, 'c'),
                'opsi_d_lampiran' => $this->storeOpsiLampiran($request, 'd'),
                'opsi_e_lampiran' => $this->storeOpsiLampiran($request, 'e'),
                'nilai'           => $request->nilai,
            ]);

            $this->flushSoalCache((int) $request->soal_id);

            return response()->json([
                'success'  => 'Your question has been successfully added!',
                'bankSoal' => $bankSoal,
                'redirect' => route('guru.soal.show', ['soal' => $request->soal_id]),
            ]);
        } catch (Throwable $e) {
            Log::error('Quest store error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while saving the question.'], 500);
        }
    }

    // ─── Edit ─────────────────────────────────────────────────────────────────

    public function edit(BankSoal $bankSoal)
    {
        return Inertia::render('Guru/Quest/Edit', [
            'bankSoal' => $bankSoal,
            'soal'     => $bankSoal,
        ]);
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    public function update(Request $request, BankSoal $bankSoal)
    {
        $hasExistingFile = (bool) ($request->existing_file ?? $bankSoal->link_lampiran);

        $request->validate([
            'soal'           => 'required|string',
            'tipe_soal'      => 'required|in:PG,Essay',
            'jawaban_benar'  => 'nullable|string',
            'nilai'          => 'nullable|numeric',
            'jenis_lampiran' => 'required|string|in:Tanpa Lampiran,Gambar',
            'lampiran_file'  => $request->jenis_lampiran === 'Gambar' && !$hasExistingFile
                ? 'required|file|image|max:5120'
                : 'nullable|file|image|max:5120',
            'opsi_a'         => 'nullable|string',
            'opsi_b'         => 'nullable|string',
            'opsi_c'         => 'nullable|string',
            'opsi_d'         => 'nullable|string',
            'opsi_e'         => 'nullable|string',
            'opsi_a_file'    => 'nullable|file|image|max:5120',
            'opsi_b_file'    => 'nullable|file|image|max:5120',
            'opsi_c_file'    => 'nullable|file|image|max:5120',
            'opsi_d_file'    => 'nullable|file|image|max:5120',
            'opsi_e_file'    => 'nullable|file|image|max:5120',
            'remove_opsi_a_lampiran' => 'nullable|boolean',
            'remove_opsi_b_lampiran' => 'nullable|boolean',
            'remove_opsi_c_lampiran' => 'nullable|boolean',
            'remove_opsi_d_lampiran' => 'nullable|boolean',
            'remove_opsi_e_lampiran' => 'nullable|boolean',
        ]);

        try {
            // ── Lampiran soal utama ──────────────────────────────────────────
            if ($request->jenis_lampiran === 'Tanpa Lampiran') {
                $this->deleteLampiran($bankSoal->link_lampiran);
                $linkLampiran = null;
            } elseif ($request->hasFile('lampiran_file')) {
                $this->deleteLampiran($bankSoal->link_lampiran);
                $linkLampiran = $this->storeLampiran($request);
            } else {
                $linkLampiran = $bankSoal->link_lampiran;
            }

            // ── Lampiran per opsi ────────────────────────────────────────────
            $opsiLampiran = [];
            foreach (['a', 'b', 'c', 'd', 'e'] as $key) {
                $removeFlag  = $request->boolean("remove_opsi_{$key}_lampiran");
                $existingImg = $bankSoal->{"opsi_{$key}_lampiran"};

                if ($removeFlag) {
                    $this->deleteLampiran($existingImg);
                    $opsiLampiran["opsi_{$key}_lampiran"] = null;
                } elseif ($request->hasFile("opsi_{$key}_file")) {
                    $this->deleteLampiran($existingImg);
                    $opsiLampiran["opsi_{$key}_lampiran"] = $this->storeOpsiLampiran($request, $key);
                } else {
                    $opsiLampiran["opsi_{$key}_lampiran"] = $existingImg;
                }
            }

            // ── Update bank_soal + recalculate riwayat dalam satu transaksi ─
            DB::transaction(function () use ($request, $bankSoal, $linkLampiran, $opsiLampiran) {
                $bankSoal->update(array_merge([
                    'soal'           => $request->soal,
                    'tipe_soal'      => $request->tipe_soal,
                    'jenis_lampiran' => $request->jenis_lampiran,
                    'link_lampiran'  => $linkLampiran,
                    'jawaban_benar'  => $request->jawaban_benar,
                    'opsi_a'         => $request->opsi_a,
                    'opsi_b'         => $request->opsi_b,
                    'opsi_c'         => $request->opsi_c,
                    'opsi_d'         => $request->opsi_d,
                    'opsi_e'         => $request->opsi_e,
                    'nilai'          => $request->nilai,
                ], $opsiLampiran));

                // Recalculate setelah data terbaru tersimpan
                $this->recalculateRiwayat($bankSoal->fresh());
            });

            $this->flushSoalCache((int) $bankSoal->soal_id);

            return response()->json([
                'success'  => 'Question has been successfully updated!',
                'bankSoal' => $bankSoal->fresh(),
                'redirect' => route('guru.soal.show', ['soal' => $bankSoal->soal_id]),
            ]);
        } catch (Throwable $e) {
            Log::error('Quest update error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating the question.'], 500);
        }
    }

    // ─── Import ───────────────────────────────────────────────────────────────

    public function import(Request $request)
    {
        $request->validate([
            'excel'   => 'required|file|mimes:xlsx,xls',
            'soal_id' => 'required|exists:soal,id',
        ]);

        $soalId = (int) $request->soal_id;
        $before = BankSoal::where('soal_id', $soalId)->count();

        try {
            Excel::import(new BankSoalImport($soalId), $request->file('excel'));
        } catch (Throwable $e) {
            Log::error('Quest import error: ' . $e->getMessage());

            return response()->json([
                'message' => 'File format does not match the template!',
            ], 422);
        }

        $after = BankSoal::where('soal_id', $soalId)->count();

        if ($after === $before) {
            return response()->json([
                'message' => 'File is empty or contains no valid data!',
            ], 422);
        }

        $this->flushSoalCache($soalId);

        return response()->json([
            'success'  => 'Your questions have been successfully imported!',
            'redirect' => route('guru.soal.show', ['soal' => $soalId]),
        ]);
    }

    // ─── Download template ────────────────────────────────────────────────────

    public function downloadTemplate()
    {
        return Excel::download(new BankSoalExport, 'template_bank_soal.xlsx');
    }

    // ─── Destroy ──────────────────────────────────────────────────────────────

    public function destroy(BankSoal $bankSoal)
    {
        $soalId = (int) $bankSoal->soal_id;

        try {
            $this->deleteLampiran($bankSoal->link_lampiran);
            $this->deleteAllOpsiLampiran($bankSoal);
            $bankSoal->delete();
            $this->flushSoalCache($soalId);

            return response()->json([
                'success' => 'This question has been successfully deleted!',
                'id'      => $bankSoal->id,
            ]);
        } catch (Throwable $e) {
            Log::error('Quest destroy error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete the question.'], 500);
        }
    }

    // ─── Destroy All ──────────────────────────────────────────────────────────

    public function destroyAll($soal_id)
    {
        $soal   = Soal::findOrFail($soal_id);
        $soalId = (int) $soal_id;

        try {
            BankSoal::where('soal_id', $soalId)
                ->orderBy('id')
                ->select('id', 'link_lampiran',
                        'opsi_a_lampiran', 'opsi_b_lampiran', 'opsi_c_lampiran',
                        'opsi_d_lampiran', 'opsi_e_lampiran')
                ->chunkById(100, function ($items) {
                    foreach ($items as $item) {
                        $this->deleteLampiran($item->link_lampiran);
                        $this->deleteAllOpsiLampiran($item);
                    }
                });

            $soal->bank_soal()->delete();
            $this->flushSoalCache($soalId);

            return response()->json([
                'success' => 'All questions have been successfully deleted!',
                'soal_id' => $soalId,
            ]);
        } catch (Throwable $e) {
            Log::error('Quest destroyAll error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete all questions.'], 500);
        }
    }

     // ─── Export soal berisi data ──────────────────────────────────────────────
    public function exportSoal(int $soal_id)
    {
        $soal = Soal::with('mapel')->findOrFail($soal_id);

        if (!$soal->bank_soal()->exists()) {
            return response()->json([
                'message' => 'No questions to export.',
            ], 422);
        }

        $user    = Auth::user();
        $planKey = $this->quotaService->currentUserAiPlanKey();

        // Download soal cuma fitur paket Pro & Max
        if (! in_array($planKey, ['pro', 'max'], true)) {
            return response()->json([
                'message' => 'Fitur download soal hanya tersedia untuk paket Pro atau Max. Upgrade paket AI Anda untuk membuka fitur ini.',
            ], 403);
        }

        $cost      = 2;
        $remaining = $this->quotaService->remainingForCurrentMonth($planKey, $user->id);

        if ($remaining < $cost) {
            return response()->json([
                'message' => "Sisa kredit token Anda tidak mencukupi untuk download soal ini (butuh {$cost} token, kredit tersisa {$remaining}). Tunggu reset bulanan atau upgrade paket.",
            ], 403);
        }

        $reservation = $this->quotaService->reserveGeneration($planKey, $user, 'soal_download', $cost);

        if (! $reservation) {
            return response()->json([
                'message' => "Kredit token AI Anda tidak cukup untuk download soal ini (butuh {$cost} token).",
            ], 403);
        }

        $mapel    = str($soal->mapel?->mapel ?? 'Mapel')->slug(' ')->title();
        $kelas    = str($soal->kelas ?? 'Kelas')->slug(' ')->upper();
        $filename = "Soal {$mapel} {$kelas}.xlsx";

        try {
            // Export sinkron, kalau sampai sini artinya file berhasil dibentuk
            $reservation->update(['status' => 'completed']);

            return Excel::download(new BankSoalWithDataExport($soal_id), $filename);
        } catch (Throwable $e) {
            // Rollback kredit kalau ternyata gagal di tengah proses
            $reservation->update(['status' => 'failed']);
            Log::error('Quest exportSoal error: ' . $e->getMessage());

            return response()->json(['message' => 'Failed to export questions.'], 500);
        }
    }
}