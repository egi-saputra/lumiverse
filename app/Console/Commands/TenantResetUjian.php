<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TenantResetUjian extends Command
{
    /**
     * php artisan tenants:reset-ujian
     * php artisan tenants:reset-ujian --dry-run
     */
    protected $signature = 'tenants:reset-ujian
                            {--dry-run : Hanya tampilkan jumlah baris tiap tabel, tanpa benar-benar menghapus}';

    protected $description = 'Reset (truncate) tabel riwayat_ujian & ujian_siswa di semua tenant, tiap 1 Jan & 1 Jul';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $tenants = Tenant::all();
        $this->info("Memproses {$tenants->count()} tenant...");

        $tenantSukses = 0;
        $tenantGagal = 0;

        foreach ($tenants as $tenant) {
            try {
                $tenant->run(function () use ($dryRun, $tenant, &$tenantSukses) {
                    if ($dryRun) {
                        $jumlahRiwayat = DB::table('riwayat_ujian')->count();
                        $jumlahUjianSiswa = DB::table('ujian_siswa')->count();
                        $this->line("[DRY RUN] Tenant {$tenant->id}: riwayat_ujian={$jumlahRiwayat}, ujian_siswa={$jumlahUjianSiswa}");
                        return;
                    }

                    // TRUNCATE ... CASCADE: cara PostgreSQL menangani FK constraint
                    // saat truncate (setara SET FOREIGN_KEY_CHECKS=0 di MySQL).
                    // RESTART IDENTITY biar sequence id-nya balik ke 1 juga.
                    DB::statement('TRUNCATE TABLE riwayat_ujian, ujian_siswa RESTART IDENTITY CASCADE;');

                    $this->info("Tenant {$tenant->id}: riwayat_ujian & ujian_siswa berhasil di-reset.");
                    $tenantSukses++;
                });
            } catch (\Throwable $e) {
                $tenantGagal++;
                Log::error("Gagal reset ujian untuk tenant {$tenant->id}: {$e->getMessage()}");
                $this->error("Tenant {$tenant->id}: GAGAL - {$e->getMessage()}");
            }
        }

        $this->info("Selesai. Tenant berhasil: {$tenantSukses}. Tenant gagal: {$tenantGagal}.");

        return self::SUCCESS;
    }
}