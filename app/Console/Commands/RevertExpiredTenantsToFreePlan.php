<?php

namespace App\Console\Commands;

use App\Models\Plan;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class RevertExpiredTenantsToFreePlan extends Command
{
    protected $signature = 'subscriptions:revert-expired-to-free';
    protected $description = 'Kembalikan tenant ke plan Free jika plan berbayarnya sudah expired dan tidak ada renewal/downgrade terjadwal';

    // Berapa hari tenggang sebelum user berlebih (melebihi max_users plan baru) dihapus otomatis.
    protected int $gracePeriodDays = 7;

    public function handle(): void
    {
        $now = Carbon::now();

        // Hanya tenant yang:
        // - punya plan aktif (plan_id terisi)
        // - expires_at sudah lewat
        // - TIDAK sedang menunggu downgrade terjadwal (itu domain ApplyPendingDowngrades,
        //   supaya dua command ini tidak saling tabrak menangani tenant yang sama)
        $tenants = Tenant::query()
            ->whereNotNull('plan_id')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', $now)
            ->whereNull('pending_plan_id')
            ->get();

        if ($tenants->isEmpty()) {
            $this->info('Tidak ada tenant expired yang perlu dikembalikan ke Free.');
            return;
        }

        foreach ($tenants as $tenant) {
            $currentPlan = Plan::find($tenant->plan_id);

            // Tenant yang plan saat ini sudah Free (price_monthly = 0) dilewati —
            // tidak relevan untuk direvert, biarkan alur renewal/upgrade normal yang menangani.
            if (!$currentPlan || (int) $currentPlan->price_monthly === 0) {
                continue;
            }

            $freePlan = Plan::where('product_type', $currentPlan->product_type)
                ->where('price_monthly', 0)
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->first();

            if (!$freePlan) {
                Log::warning('Tidak ada plan Free aktif untuk product_type ini, tenant dilewati', [
                    'tenant_id'    => $tenant->id,
                    'product_type' => $currentPlan->product_type,
                ]);
                $this->warn("Tenant {$tenant->id}: plan Free untuk '{$currentPlan->product_type}' tidak ditemukan, dilewati.");
                continue;
            }

            $currentUserCount = $tenant->run(fn () => \App\Models\User::count());
            $newMaxUsers       = $freePlan->max_users;
            $isOverQuota        = $newMaxUsers !== null && $currentUserCount > $newMaxUsers;

            $tenant->plan_id           = $freePlan->id;
            $tenant->expires_at        = null; // Free tidak punya masa expired
            $tenant->max_users         = $newMaxUsers; // ← sinkronkan kuota, jangan biarkan nilai plan lama nyangkut
            $tenant->quota_grace_until = $isOverQuota ? $now->copy()->addDays($this->gracePeriodDays) : null;
            $tenant->save();

            if ($isOverQuota) {
                Log::info('Tenant direvert ke Free, over-quota — cleanup dijadwalkan', [
                    'tenant_id'          => $tenant->id,
                    'current_user_count' => $currentUserCount,
                    'new_max_users'      => $newMaxUsers,
                    'cleanup_at'         => $tenant->quota_grace_until,
                ]);
                $this->info("Tenant {$tenant->id} direvert ke Free. Over-quota ({$currentUserCount}/{$newMaxUsers}) — cleanup user dijadwalkan {$this->gracePeriodDays} hari lagi.");
            } else {
                $this->info("Tenant {$tenant->id} direvert ke Free.");
            }
        }
    }
}