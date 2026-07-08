<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CleanupExcessTenantUsers extends Command
{
    protected $signature = 'subscriptions:cleanup-excess-users';
    protected $description = 'Hapus user berlebih pada tenant yang sudah lewat masa tenggang setelah downgrade/expired';

    // Role yang TIDAK PERNAH dihapus otomatis, walau tenant over-quota.
    protected array $protectedRoles = ['admin'];

    public function handle(): void
    {
        $now = Carbon::now();

        $tenants = Tenant::query()
            ->whereNotNull('quota_grace_until')
            ->where('quota_grace_until', '<=', $now)
            ->get();

        if ($tenants->isEmpty()) {
            $this->info('Tidak ada tenant yang perlu dibersihkan user-nya.');
            return;
        }

        foreach ($tenants as $tenant) {
            // Pakai tenant->max_users (kolom denormalisasi, sinkron dengan plan aktif)
            // sebagai sumber kebenaran kuota — bukan lookup ulang ke Plan — supaya konsisten
            // dengan nilai yang benar-benar dipakai untuk enforcement kuota di tempat lain.
            // NULL = unlimited, tidak ada yang perlu dibersihkan.
            if ($tenant->max_users === null) {
                $tenant->quota_grace_until = null;
                $tenant->save();
                continue;
            }

            $maxUsers = $tenant->max_users;

            $currentUserCount = $tenant->run(fn () => \App\Models\User::count());

            // Sudah tidak over-quota lagi (mungkin admin sudah hapus manual, atau
            // tenant sudah upgrade lagi tapi entah kenapa grace belum sempat dibersihkan) → lewati.
            if ($currentUserCount <= $maxUsers) {
                $tenant->quota_grace_until = null;
                $tenant->save();
                $this->info("Tenant {$tenant->id} sudah tidak over-quota, cleanup dibatalkan.");
                continue;
            }

            $excessCount = $currentUserCount - $maxUsers;

            // Hapus user berlebih DI DALAM database tenant.
            // Aturan: role di $protectedRoles tidak pernah dihapus; dari sisa user
            // yang boleh dihapus, yang PALING BARU dibuat dihapus duluan (asumsi:
            // akun yang ditambahkan belakangan adalah yang ditambahkan selama
            // menikmati kuota plan yang lebih tinggi).
            $deletedCount = $tenant->run(function () use ($excessCount) {
                $deletable = \App\Models\User::whereNotIn('role', $this->protectedRoles)
                    ->orderByDesc('created_at')
                    ->limit($excessCount)
                    ->get();

                $count = $deletable->count();
                foreach ($deletable as $user) {
                    $user->delete();
                }

                return $count;
            });

            $tenant->quota_grace_until = null;
            $tenant->save();

            if ($deletedCount < $excessCount) {
                Log::warning('Cleanup user berlebih tidak tuntas — kemungkinan mayoritas sisa user berrole protected', [
                    'tenant_id'     => $tenant->id,
                    'excess_needed' => $excessCount,
                    'deleted'       => $deletedCount,
                ]);
                $this->warn("Tenant {$tenant->id}: hanya berhasil hapus {$deletedCount} dari {$excessCount} user berlebih (sisanya berrole terlindungi).");
            } else {
                Log::info('Cleanup user berlebih selesai', [
                    'tenant_id' => $tenant->id,
                    'deleted'   => $deletedCount,
                ]);
                $this->info("Tenant {$tenant->id}: {$deletedCount} user berlebih berhasil dihapus.");
            }
        }
    }
}