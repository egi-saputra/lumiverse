<?php

namespace App\Console\Commands;

use App\Models\Journal;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TenantPruneJournals extends Command
{
    /**
     * php artisan tenants:prune-journals
     * php artisan tenants:prune-journals --months=3
     * php artisan tenants:prune-journals --dry-run
     */
    protected $signature = 'tenants:prune-journals
                            {--months=1 : Hapus jurnal yang lebih tua dari sekian bulan}
                            {--dry-run : Hanya tampilkan berapa yang akan dihapus, tanpa benar-benar menghapus}';

    protected $description = 'Hapus otomatis entri jurnal mengajar guru di semua tenant';

    public function handle(): int
    {
        $batas = now()->subMonths((int) $this->option('months'))->startOfDay();
        $dryRun = (bool) $this->option('dry-run');

        $tenants = Tenant::all();
        $this->info("Memproses {$tenants->count()} tenant (batas: {$batas->format('d-m-Y')})...");

        $totalDihapus = 0;
        $tenantGagal = 0;

        foreach ($tenants as $tenant) {
            try {
                $tenant->run(function () use ($batas, $dryRun, $tenant, &$totalDihapus) {
                    $jumlah = Journal::where('tanggal', '<', $batas)->count();

                    if ($jumlah === 0) {
                        return;
                    }

                    if ($dryRun) {
                        $this->line("[DRY RUN] Tenant {$tenant->id}: {$jumlah} jurnal akan dihapus.");
                        return;
                    }

                    $dihapusTenantIni = 0;
                    Journal::where('tanggal', '<', $batas)
                        ->chunkById(500, function ($journals) use (&$dihapusTenantIni) {
                            $ids = $journals->pluck('id');
                            Journal::whereIn('id', $ids)->delete();
                            $dihapusTenantIni += $ids->count();
                        });

                    $this->info("Tenant {$tenant->id}: berhasil menghapus {$dihapusTenantIni} jurnal.");
                    $totalDihapus += $dihapusTenantIni;
                });
            } catch (\Throwable $e) {
                $tenantGagal++;
                Log::error("Gagal prune jurnal untuk tenant {$tenant->id}: {$e->getMessage()}");
                $this->error("Tenant {$tenant->id}: GAGAL - {$e->getMessage()}");
            }
        }

        $this->info("Selesai. Total dihapus: {$totalDihapus}. Tenant gagal: {$tenantGagal}.");

        return self::SUCCESS;
    }
}