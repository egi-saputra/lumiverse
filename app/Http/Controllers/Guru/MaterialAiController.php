<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateMaterialAiJob;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Services\Ai\AiGenerationQuotaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MaterialAiController extends Controller
{
    protected AiGenerationQuotaService $quotaService;

    public function __construct(AiGenerationQuotaService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    public function createAi()
    {
        $user = Auth::user();
        $kelas = Kelas::select('id', 'kelas')->orderBy('kelas')->get();
        $subjects = Mapel::select('id', 'mapel')->orderBy('mapel')->get();

        $aiPlan = [
            'current_plan' => $user->ai_plan ?? 'free',
            'status' => $user->ai_plan_status ?? 'inactive',
            'expires_at' => $user->ai_plan_expires_at,
            'limit' => $this->quotaService->resolveLimitForPlan($user->ai_plan ?? 'free'),
            'used' => $this->quotaService->usageForCurrentMonth($user->id),
            'remaining' => $this->quotaService->remainingForCurrentMonth(null, $user->id),
        ];

        return Inertia::render('Guru/Material/AiCreate', [
            'kelas' => $kelas,
            'subjects' => $subjects,
            'title' => 'Lumi Ai Assistant',
            'aiPlan' => $aiPlan,
        ]);
    }

    public function generateAi(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mapel_id' => 'required|exists:mapel,id',
            'judul'    => 'nullable|string|max:255',
            'topik'    => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        $planKey = $this->quotaService->currentUserAiPlanKey();
        $limit = $this->quotaService->resolveLimitForPlan($planKey);

        $reservation = $this->quotaService->reserveGeneration(
            planKey: $planKey,
            user: $user,
            source: 'material',
            cost: 4,
        );

        if (! $reservation) {
            return response()->json([
                'message' => "Limit AI materi Anda untuk bulan ini sudah tercapai ({$limit}x). Upgrade paket AI untuk menambah kuota generate AI.",
            ], 403);
        }

        $generationId = (string) Str::uuid();

        Cache::put("ai_gen:{$generationId}", [
            'stage' => 'queued',
            'message' => 'Menunggu giliran diproses...',
            'user_id' => $user->id,
            'updated_at' => now()->toIso8601String(),
        ], now()->addMinutes(10));

        GenerateMaterialAiJob::dispatch(
            $generationId,
            $user->id,
            $planKey,
            (int) $request->kelas_id,
            (int) $request->mapel_id,
            $request->judul,
            $request->topik,
            $reservation->id,
        );

        return response()->json(['generation_id' => $generationId]);
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