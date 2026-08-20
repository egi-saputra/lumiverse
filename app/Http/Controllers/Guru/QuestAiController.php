<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateQuizAiJob;
use App\Models\Materi; // ASUMSI: sesuaikan namespace kalau nama model materi berbeda
use App\Models\Soal;
use App\Services\Ai\AiGenerationQuotaService;
use App\Services\Ai\MateriAdequacyChecker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuestAiController extends Controller
{
    protected AiGenerationQuotaService $quotaService;

    public function __construct(AiGenerationQuotaService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    /**
     * Halaman form "Buat Soal dengan AI".
     */
    public function createAi(Request $request)
    {
        $user = Auth::user();

        $soal = Soal::where('id', $request->soal_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $materiList = Materi::where('user_id', $user->id)
            ->select('id', 'judul', 'mapel_id', 'kelas_id')
            ->with(['mapel:id,mapel', 'kelas:id,kelas'])
            ->orderByDesc('created_at')
            ->get();

        $planKey = $this->quotaService->currentUserAiPlanKey();

        $aiPlan = [
            'current_plan' => $planKey,
            'limit' => $this->quotaService->resolveLimitForPlan($planKey),
            'used' => $this->quotaService->usageForCurrentMonth($user->id),
            'remaining' => $this->quotaService->remainingForCurrentMonth($planKey, $user->id),
        ];

        return Inertia::render('Guru/Quest/CreateAi', [
            'soal' => $soal->only(['id', 'title', 'mapel_id', 'kelas']),
            'materiList' => $materiList,
            'aiPlan' => $aiPlan,
            'title' => "Lumi Ai Assistant",
            'creditRules' => [
                'with_materi' => 3,
                'without_materi' => 6,
            ],
            'maxSoalPerGenerate' => $planKey === 'free' ? 20 : null, // null = tidak dibatasi
        ]);
    }

    /**
     * Mulai proses generate soal via AI (async lewat job + polling status).
     */
    public function generateAi(Request $request)
    {
        $request->validate([
            'soal_id' => 'required|exists:soal,id',
            'materi_ids' => 'nullable|array',
            'materi_ids.*' => 'integer|exists:materi,id',
            'topik' => 'nullable|string|max:2000',
            'jumlah_pg' => 'required|integer|min:0|max:100',
            'jumlah_essay' => 'required|integer|min:0|max:100',
            'nilai_per_soal' => 'required|numeric|min:0',
            'jumlah_opsi_pg' => 'nullable|integer|in:3,4,5',
        ]);

        $jumlahOpsiPg = (int) ($request->jumlah_opsi_pg ?: 4);

        $totalSoal = (int) $request->jumlah_pg + (int) $request->jumlah_essay;

        if ($totalSoal < 1) {
            return response()->json([
                'message' => 'Jumlah soal PG dan Essay tidak boleh 0 dua-duanya.',
            ], 422);
        }

        if ($totalSoal > 100) {
            return response()->json([
                'message' => 'Maksimal 50 soal per generate. Coba pecah menjadi beberapa batch.',
            ], 422);
        }

        $user = Auth::user();

        $planKey = $this->quotaService->currentUserAiPlanKey();

        if ($planKey === 'free' && $totalSoal > 20) {
            return response()->json([
                'message' => "Paket Free maksimal 20 soal per generate (Anda meminta {$totalSoal} soal). Kurangi jumlah soal atau upgrade paket untuk generate lebih banyak sekaligus.",
            ], 403);
        }

        $soal = Soal::where('id', $request->soal_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $materiIds = array_values(array_unique(array_filter((array) $request->materi_ids)));
        $materis = collect();

        if (! empty($materiIds)) {
            $materis = Materi::whereIn('id', $materiIds)
                ->where('user_id', $user->id)
                ->get();

            if ($materis->count() !== count($materiIds)) {
                return response()->json(['message' => 'Salah satu materi referensi tidak ditemukan.'], 404);
            }
        }

        if ($materis->isEmpty() && ! $request->filled('topik')) {
            return response()->json([
                'message' => 'Cantumkan topik, atau pilih minimal 1 materi referensi terlebih dahulu.',
            ], 422);
        }

        // Skema kredit:
        // - Materi referensi dipilih DAN kontennya cukup untuk jumlah soal yang diminta = 3 token.
        // - Tanpa materi, ATAU materi dipilih tapi kontennya terlalu sedikit untuk jumlah soal
        //   yang diminta (AI perlu riset tambahan dari web untuk melengkapi) = 6 token.
        $materiCukup = MateriAdequacyChecker::cukup($materis, $totalSoal);
        $cost = $materiCukup ? 3 : 6;

        $remaining = $this->quotaService->remainingForCurrentMonth($planKey, $user->id);

        if ($remaining < $cost) {
            return response()->json([
                'message' => "Sisa kredit token Anda tidak mencukupi, untuk generate soal ini butuh {$cost} token, kredit tersisa {$remaining}. Upgrade paket untuk menambah kuota.",
            ], 403);
        }

        $reservation = $this->quotaService->reserveGeneration($planKey, $user, 'quiz', $cost);

        if (! $reservation) {
            return response()->json([
                'message' => "Kredit token AI Anda tidak cukup untuk generate soal ini (butuh {$cost} token).",
            ], 403);
        }

        $generationId = (string) Str::uuid();

        Cache::put("ai_gen:{$generationId}", [
            'stage' => 'queued',
            'message' => 'Menunggu giliran diproses...',
            'user_id' => $user->id,
            'updated_at' => now()->toIso8601String(),
        ], now()->addMinutes(15));

        GenerateQuizAiJob::dispatch(
            $generationId,
            $user->id,
            (int) $soal->id,
            $materis->pluck('id')->all(),
            (string) ($request->topik ?? ''),
            (int) $request->jumlah_pg,
            (int) $request->jumlah_essay,
            (float) $request->nilai_per_soal,
            $reservation->id,
            $cost,
            $jumlahOpsiPg,
        );

        return response()->json([
            'generation_id' => $generationId,
            'cost' => $cost,
        ]);
    }

    public function generateAiStatus(string $generationId)
    {
        $state = Cache::get("ai_gen:{$generationId}");

        if (! $state || (int) ($state['user_id'] ?? null) !== Auth::id()) {
            return response()->json(['message' => 'Generation tidak ditemukan atau sudah kedaluwarsa.'], 404);
        }

        return response()->json($state);
    }
}