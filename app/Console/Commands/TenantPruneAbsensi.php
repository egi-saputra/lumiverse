<?php

namespace App\Console\Commands;

use App\Models\AbsensiHarian;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TenantPruneAbsensi extends Command
{
    /**
     * php artisan tenants:prune-absensi
     * php artisan tenants:prune-absensi --months=6
     * php artisan tenants:prune-absensi --dry-run
     */
    protected $signature = 'tenants:prune-absensi
                            {--months=6 : Hapus absensi yang lebih tua dari sekian bulan}
                            {--dry-run : Hanya tampilkan berapa yang akan dihapus, tanpa benar-benar menghapus}';

    protected $description = 'Hapus otomatis data absensi siswa di semua tenant';

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
                    $jumlah = AbsensiHarian::where('tanggal', '<', $batas)->count();

                    if ($jumlah === 0) {
                        return;
                    }

                    if ($dryRun) {
                        $this->line("[DRY RUN] Tenant {$tenant->id}: {$jumlah} absensi akan dihapus.");
                        return;
                    }

                    $dihapusTenantIni = 0;
                    AbsensiHarian::where('tanggal', '<', $batas)
                        ->chunkById(500, function ($absensi) use (&$dihapusTenantIni) {
                            $ids = $absensi->pluck('id');
                            AbsensiHarian::whereIn('id', $ids)->delete();
                            $dihapusTenantIni += $ids->count();
                        });

                    $this->info("Tenant {$tenant->id}: berhasil menghapus {$dihapusTenantIni} absensi.");
                    $totalDihapus += $dihapusTenantIni;
                });
            } catch (\Throwable $e) {
                $tenantGagal++;
                Log::error("Gagal prune absensi untuk tenant {$tenant->id}: {$e->getMessage()}");
                $this->error("Tenant {$tenant->id}: GAGAL - {$e->getMessage()}");
            }
        }

        $this->info("Selesai. Total dihapus: {$totalDihapus}. Tenant gagal: {$tenantGagal}.");

        return self::SUCCESS;
    }
}