<?php

namespace App\Services;

use App\Models\Materi;
use App\Models\User;

class MaterialUploadQuotaService
{
    /**
     * Batas jumlah materi yang PUNYA file attachment (bukan link) per plan.
     * Materi tanpa file (link saja / tanpa attachment) TIDAK dibatasi.
     */
    private const LIMITS = [
        'free' => 2,
        'pro'  => 25,
        'max'  => 50,
    ];

    private const DEFAULT_LIMIT = 2; // fallback kalau plan tidak dikenali

    public function limitForPlan(string $planKey): int
    {
        return self::LIMITS[$planKey] ?? self::DEFAULT_LIMIT;
    }

    public function limitForUser(User $user): int
    {
        return $this->limitForPlan($user->aiPlanKey());
    }

    /**
     * Hitung materi user yang punya file attachment asli
     * (file_path terisi DAN bukan link http).
     */
    public function uploadedCountForUser(int $userId): int
    {
        // COUNT(DISTINCT file_path) — broadcast ke banyak kelas dari 1 file
        // cuma dihitung SEKALI, bukan per baris/kelas.
        return Materi::where('user_id', $userId)
            ->whereNotNull('file_path')
            ->where('file_path', 'not like', 'http%')
            ->distinct()
            ->count('file_path');
    }

    public function remainingForUser(User $user): int
    {
        return max(0, $this->limitForUser($user) - $this->uploadedCountForUser($user->id));
    }

    public function canUpload(User $user): bool
    {
        return $this->remainingForUser($user) > 0;
    }
}