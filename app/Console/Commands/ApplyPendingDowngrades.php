<?php

namespace App\Console\Commands;

use App\Http\Controllers\Owner\SubscriptionController;
use App\Models\Plan;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ApplyPendingDowngrades extends Command
{
    protected $signature = 'subscriptions:apply-pending-downgrades';
    protected $description = 'Terapkan downgrade plan yang sudah dijadwalkan begitu masa aktif plan lama habis';

    // Berapa hari tenggang sebelum user berlebih (melebihi max_users plan baru) dihapus otomatis.
    protected int $gracePeriodDays = 7;

    public function handle(SubscriptionController $subscriptionController): void
    {
        $now = Carbon::now();

        $tenants = Tenant::query()
            ->whereNotNull('pending_plan_id')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', $now)
            ->get();

        if ($tenants->isEmpty()) {
            $this->info('Tidak ada downgrade yang perlu diterapkan.');
            return;
        }

        foreach ($tenants as $tenant) {
            $newPlan = Plan::find($tenant->pending_plan_id);

            // Plan tujuan sudah tidak ada/dihapus → batalkan jadwal downgrade
            // daripada memaksa tenant pindah ke plan yang tidak valid.
            if (!$newPlan) {
                Log::warning('Pending plan tidak ditemukan, downgrade dibatalkan', [
                    'tenant_id'        => $tenant->id,
                    'pending_plan_id'  => $tenant->pending_plan_id,
                ]);

                $tenant->pending_plan_id       = null;
                $tenant->pending_billing_cycle = null;
                $tenant->save();

                $this->warn("Tenant {$tenant->id}: plan tujuan tidak ditemukan, downgrade dibatalkan.");
                continue;
            }

            $cycle = $tenant->pending_billing_cycle ?? 'monthly';

            // Cek dulu apakah user count saat ini melebihi max_users plan tujuan —
            // kalau iya, jadwalkan cleanup otomatis setelah masa tenggang.
            $currentUserCount = $tenant->run(fn () => \App\Models\User::count());
            $newMaxUsers      = $newPlan->max_users;
            $isOverQuota      = $newMaxUsers !== null && $currentUserCount > $newMaxUsers;

            $tenant->plan_id               = $newPlan->id;
            $tenant->expires_at            = $subscriptionController->addCyclePeriod($now, $cycle);
            $tenant->max_users             = $newMaxUsers; // ← sinkronkan kuota, jangan biarkan nilai plan lama nyangkut
            $tenant->pending_plan_id       = null;
            $tenant->pending_billing_cycle = null;
            $tenant->quota_grace_until     = $isOverQuota ? $now->copy()->addDays($this->gracePeriodDays) : null;
            $tenant->save();

            if ($isOverQuota) {
                Log::info('Downgrade diterapkan, over-quota — cleanup dijadwalkan', [
                    'tenant_id'          => $tenant->id,
                    'current_user_count' => $currentUserCount,
                    'new_max_users'      => $newMaxUsers,
                    'cleanup_at'         => $tenant->quota_grace_until,
                ]);
                $this->info("Tenant {$tenant->id} diturunkan ke plan '{$newPlan->key}' ({$cycle}). Over-quota ({$currentUserCount}/{$newMaxUsers}) — cleanup user dijadwalkan {$this->gracePeriodDays} hari lagi.");
            } else {
                $this->info("Tenant {$tenant->id} diturunkan ke plan '{$newPlan->key}' ({$cycle}).");
            }
        }
    }
}