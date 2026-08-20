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
     * Get reset frequency for a plan (monthly | semester).
     */
    public function resetFrequency(?string $planKey): string
    {
        return $this->planConfig($planKey)['reset_frequency'] ?? 'monthly';
    }

    /**
     * Tentukan rentang periode kuota saat ini.
     * - Plan free: reset setiap 6 bulan (semester) dari ai_token_last_reset_at
     * - Plan berbayar aktif (pro/max): rolling monthly dari ai_plan_started_at (anniversary date)
    * - Plan free: rolling semester dari anchor reset/aktivasi user
     */
    public function currentPeriod(?User $user = null): array
    {
        $user ??= Auth::user();

        if (! $user) {
            return [now()->startOfMonth(), now()->copy()->endOfMonth()];
        }

        // For free plan: stable 6-month rolling reset.
        if ($user->aiPlanKey() === 'free') {
            $anchor = ($user->ai_token_last_reset_at
                ?? $user->ai_plan_started_at
                ?? $user->created_at
                ?? now())->copy();
            $start = $anchor;

            // Gulirkan start ke periode semester yang mencakup waktu sekarang.
            while ($start->copy()->addMonths(6)->lte(now())) {
                $start = $start->addMonths(6);
            }

            $end = $start->copy()->addMonths(6)->subSecond();
            return [$start, $end];
        }

        // For paid active plans (pro/max): rolling monthly
        if ($user->ai_plan_status === 'active' && $user->ai_plan_started_at) {
            $anchor = $user->ai_plan_started_at->copy();
            $start = $anchor->copy();

            // Gulirkan start ke periode bulanan terdekat yang mencakup waktu sekarang
            while ($start->copy()->addMonthNoOverflow()->lte(now())) {
                $start = $start->addMonthNoOverflow();
            }

            $end = $start->copy()->addMonthNoOverflow()->subSecond();
            return [$start, $end];
        }

        // Default: kalender bulan berjalan
        return [now()->startOfMonth(), now()->copy()->endOfMonth()];
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
                ->get(['cost'])       // <-- ambil baris (dengan lock), bukan langsung sum di SQL
                ->sum('cost');        // <-- jumlahkan di PHP (Collection::sum, bukan query builder)

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
        
        // Add token balance from previous period (carryover tokens)
        $user = $userId === Auth::id() ? Auth::user() : ($userId ? User::find($userId) : null);
        $carryover = $user ? (int) $user->ai_token_balance : 0;

        return max(0, $limit + $carryover - $used);
    }

    /**
     * Hitung sisa token dari plan lama dan siapkan carryover ke plan baru.
     * Dipanggil saat user upgrade plan.
     * 
     * @return int sisa token yang akan di-carry over ke plan baru
     */
    public function shouldCarryOverTokens(?string $oldPlanKey, ?string $newPlanKey): bool
    {
        $oldPlan = strtolower((string) ($oldPlanKey ?? 'free'));
        $newPlan = strtolower((string) ($newPlanKey ?? 'free'));

        if (! in_array($oldPlan, ['free', 'pro', 'max'], true)) {
            return false;
        }

        if (! in_array($newPlan, ['free', 'pro', 'max'], true)) {
            return false;
        }

        if ($oldPlan === 'free' || $oldPlan === $newPlan) {
            return false;
        }

        return $this->resolveLimitForPlan($newPlan) > $this->resolveLimitForPlan($oldPlan);
    }

    public function calculateCarryoverTokens(User $user, string $oldPlanKey): int
    {
        // Hitung sisa token dari plan lama untuk periode saat ini
        $remaining = $this->remainingForCurrentMonth($oldPlanKey, $user->id);

        // Carryover hanya sisa token yang belum terpakai
        // Jika ada token leftover, simpan untuk plan baru
        return max(0, $remaining);
    }

    /**
     * Saat user upgrade plan, set token balance untuk carryover.
     * Dipanggil di webhook atau plan activation logic.
     */
    public function handlePlanUpgrade(User $user, string $oldPlanKey, string $newPlanKey): void
    {
        if (! $this->shouldCarryOverTokens($oldPlanKey, $newPlanKey)) {
            $user->update([
                'ai_token_balance' => 0,
                'ai_token_last_reset_at' => now(),
            ]);

            return;
        }

        // Hitung carryover tokens dari plan lama
        $carryoverTokens = $this->calculateCarryoverTokens($user, $oldPlanKey);

        if ($carryoverTokens > 0) {
            $user->update([
                'ai_token_balance' => $carryoverTokens,
                'ai_token_last_reset_at' => now(),
            ]);

            \Illuminate\Support\Facades\Log::info('AI upgrade: tokens carried over', [
                'user_id' => $user->id,
                'from_plan' => $oldPlanKey,
                'to_plan' => $newPlanKey,
                'carryover_tokens' => $carryoverTokens,
            ]);
        } else {
            // Reset token balance jika tidak ada carryover
            $user->update([
                'ai_token_balance' => 0,
                'ai_token_last_reset_at' => now(),
            ]);
        }
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