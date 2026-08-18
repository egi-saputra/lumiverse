<?php

namespace App\Services\Ai;

use App\Models\AiGeneration;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AiGenerationQuotaService
{
    public function planConfig(?string $planKey): array
    {
        $safeKey = strtolower((string) ($planKey ?? 'free'));

        return config('ai.plans.' . $safeKey, config('ai.plans.free'));
    }

    public function resolveLimitForPlan(?string $planKey): int
    {
        return (int) ($this->planConfig($planKey)['limit'] ?? 10);
    }

    public function currentUserAiPlanKey(): string
    {
        $user = Auth::user();

        if (! $user) {
            return 'free';
        }

        $planKey = strtolower((string) ($user->ai_plan ?? 'free'));
        if ($user->ai_plan_status === 'active' && $user->ai_plan_expires_at && $user->ai_plan_expires_at->isPast()) {
            $user->update([
                'ai_plan' => 'free',
                'ai_plan_status' => 'inactive',
                'ai_plan_expires_at' => null,
            ]);
            return 'free';
        }

        if (! in_array($planKey, ['free', 'pro', 'max'], true)) {
            return 'free';
        }

        return $user->ai_plan_status === 'active' ? $planKey : 'free';
    }

    /**
     * Tentukan rentang periode kuota saat ini.
     * - Plan berbayar aktif: rolling monthly dari ai_plan_started_at (anniversary date)
     * - Plan free / gak aktif: kalender bulan berjalan (tanggal 1 - akhir bulan)
     */
    public function currentPeriod(?User $user = null): array
    {
        $user ??= Auth::user();

        if (! $user || $user->ai_plan_status !== 'active' || ! $user->ai_plan_started_at) {
            return [now()->startOfMonth(), now()->copy()->endOfMonth()];
        }

        $anchor = $user->ai_plan_started_at->copy();
        $start = $anchor->copy();

        // gulirkan start ke periode bulanan terdekat yang mencakup waktu sekarang
        while ($start->copy()->addMonthNoOverflow()->lte(now())) {
            $start = $start->addMonthNoOverflow();
        }

        $end = $start->copy()->addMonthNoOverflow()->subSecond();

        return [$start, $end];
    }

    /**
     * Total KREDIT TOKEN terpakai bulan berjalan (SUM(cost), bukan COUNT baris).
     * Generate materi = 4 kredit, generate quiz = 3 (pakai referensi materi) atau
     * 6 (AI cari sendiri dari web) kredit — sesuai kolom `cost` per baris.
     */
    public function usageForCurrentMonth(?int $userId = null): int
    {
        $userId ??= Auth::id();

        if (! $userId) {
            return 0;
        }

        $user = $userId === Auth::id() ? Auth::user() : User::find($userId);
        [$start, $end] = $this->currentPeriod($user);

        return (int) AiGeneration::query()
            ->where('user_id', $userId)
            // reservasi yang berakhir gagal jangan ikut makan kuota permanen
            ->where('status', '!=', 'failed')
            ->whereBetween('created_at', [$start, $end])
            ->sum('cost');
    }

    /**
     * Reservasi kredit token secara atomik (row-lock), supaya dua request
     * generate yang datang hampir bersamaan tidak bisa lolos dua-duanya
     * kalau totalnya bakal melebihi limit.
     *
     * @param int $cost jumlah kredit token yang dipakai generation ini - WAJIB
     *                  diisi eksplisit oleh caller, tidak ada default, supaya
     *                  fitur AI baru tidak diam-diam kepotong 1 kredit kalau
     *                  lupa mengisi. Generate materi mengirim 4, generate quiz
     *                  mengirim 3 atau 6 sesuai ada/tidaknya referensi materi.
     * Return AiGeneration (status=pending) kalau berhasil, null kalau kredit tidak cukup.
     */
    public function reserveGeneration(string $planKey, User $user, string $source, int $cost): ?AiGeneration
    {
        $limit = $this->resolveLimitForPlan($planKey);
        [$start, $end] = $this->currentPeriod($user);

        return DB::transaction(function () use ($user, $planKey, $limit, $start, $end, $source, $cost) {
            $used = (int) AiGeneration::query()
                ->where('user_id', $user->id)
                ->where('status', '!=', 'failed')
                ->whereBetween('created_at', [$start, $end])
                ->lockForUpdate()
                ->sum('cost');

            if ($used + $cost > $limit) {
                return null;
            }

            return AiGeneration::create([
                'user_id' => $user->id,
                'plan_key' => $planKey,
                'source' => $source,
                'status' => 'pending',
                'cost' => $cost,
            ]);
        });
    }

    public function remainingForCurrentMonth(?string $planKey = null, ?int $userId = null): int
    {
        $planKey ??= $this->currentUserAiPlanKey();
        $limit = $this->resolveLimitForPlan($planKey);
        $used = $this->usageForCurrentMonth($userId);

        return max(0, $limit - $used);
    }

    public function hasReachedLimit(?string $planKey = null, ?int $userId = null): bool
    {
        $userId ??= Auth::id();

        if (! $userId) {
            return false;
        }

        $planKey ??= $this->currentUserAiPlanKey();

        return $this->usageForCurrentMonth($userId) >= $this->resolveLimitForPlan($planKey);
    }

    /**
     * Kapan kuota berikutnya reset (buat ditampilkan di UI).
     */
    public function nextResetAt(?User $user = null): Carbon
    {
        $user ??= Auth::user();
        [, $end] = $this->currentPeriod($user);

        return $end->copy()->addSecond();
    }
}