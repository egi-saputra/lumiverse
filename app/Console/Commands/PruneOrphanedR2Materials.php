<?php

namespace App\Console\Commands;

use App\Models\Materi;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PruneOrphanedR2Materials extends Command
{
    protected $signature = 'r2:prune-orphaned-materials
                            {--force : Benar-benar hapus file. Tanpa flag ini, cuma laporan (dry-run).}
                            {--hours=24 : Grace period — file yang lebih baru dari ini dari sekarang tidak disentuh.}
                            {--tenant= : Batasi ke satu tenant (by id/code). Kosongkan untuk semua tenant.}';

    protected $description = 'Hapus file di R2 folder "materials/" yang sudah tidak punya row Materi manapun (file yatim). Default dry-run.';

    public function handle(): int
    {
        $isDryRun     = ! $this->option('force');
        $graceHours   = (int) $this->option('hours');
        $tenantFilter = $this->option('tenant');

        $this->info($isDryRun
            ? '=== DRY RUN — tidak ada file yang benar-benar dihapus ==='
            : '=== MODE HAPUS AKTIF — file yang terdeteksi yatim akan dihapus permanen ===');

        $tenants = Tenant::query()
            ->when($tenantFilter, fn ($q) => $q->where('id', $tenantFilter)->orWhere('code', $tenantFilter))
            ->get();

        $totalOrphans = 0;
        $totalDeleted = 0;
        $totalErrors  = 0;

        foreach ($tenants as $tenant) {
            $this->line("--- Tenant: {$tenant->name} ({$tenant->code}) ---");

            $tenant->run(function () use ($tenant, $isDryRun, $graceHours, &$totalOrphans, &$totalDeleted, &$totalErrors) {

                // 1. Kumpulkan semua path yang MASIH VALID (dipakai row Materi manapun).
                $validPaths = Materi::query()
                    ->whereNotNull('file_path')
                    ->where('file_path', 'not like', 'http%')
                    ->pluck('file_path')
                    ->unique()
                    ->flip(); // flip supaya lookup isset() O(1), bukan in_array() O(n)

                // 2. Ambil semua file fisik yang ada di folder materials/ pada disk r2.
                $filesOnDisk = Storage::disk('r2')->allFiles('materials');

                $cutoff = now()->subHours($graceHours);

                foreach ($filesOnDisk as $path) {
                    if (isset($validPaths[$path])) {
                        continue; // masih dipakai, skip
                    }

                    // Grace period — jangan sentuh file yang baru diupload
                    // (kemungkinan row Materi-nya belum sempat ter-create).
                    $lastModified = Storage::disk('r2')->lastModified($path);
                    if ($lastModified && \Carbon\Carbon::createFromTimestamp($lastModified)->gt($cutoff)) {
                        continue;
                    }

                    $totalOrphans++;
                    $this->warn(($isDryRun ? '[AKAN DIHAPUS] ' : '[DIHAPUS] ') . "{$tenant->code}: {$path}");

                    Log::channel('single')->info('r2-prune-orphaned-materials', [
                        'tenant'    => $tenant->code,
                        'path'      => $path,
                        'action'    => $isDryRun ? 'would_delete' : 'deleted',
                        'timestamp' => now()->toISOString(),
                    ]);

                    if (! $isDryRun) {
                        try {
                            Storage::disk('r2')->delete($path);
                            $totalDeleted++;
                        } catch (\Throwable $e) {
                            $totalErrors++;
                            report($e);
                            $this->error("Gagal hapus {$path}: {$e->getMessage()}");
                        }
                    }
                }
            });
        }

        $this->newLine();
        $this->info("Selesai. File yatim ditemukan: {$totalOrphans}"
            . ($isDryRun ? ' (belum dihapus, jalankan dengan --force untuk eksekusi).' : ", berhasil dihapus: {$totalDeleted}, gagal: {$totalErrors}."));

        return self::SUCCESS;
    }
}