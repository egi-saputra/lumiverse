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
                            {--hours=24 : Grace period — file yang lebih baru dari ini dari sekarang tidak disentuh.}';

    protected $description = 'Hapus file di R2 folder "materials/" (shared, bukan per-tenant) yang tidak dirujuk oleh row Materi manapun di SEMUA tenant. Default dry-run.';

    public function handle(): int
    {
        $isDryRun   = ! $this->option('force');
        $graceHours = (int) $this->option('hours');

        $this->info($isDryRun
            ? '=== DRY RUN — tidak ada file yang benar-benar dihapus ==='
            : '=== MODE HAPUS AKTIF — file yang terdeteksi yatim akan dihapus permanen ===');

        // PENTING: folder materials/ di R2 adalah flat, dipakai bersama SEMUA tenant.
        // Jadi validasi HARUS union dari semua tenant dulu, sebelum diff ke disk.
        // Jangan pernah cek per-tenant secara terpisah — itu yang menyebabkan
        // false-positive kemarin (file tenant lain ikut tertandai orphan).

        $this->line('Mengumpulkan file_path valid dari semua tenant...');
        $validPaths = collect();

        Tenant::query()->get()->each(function ($tenant) use (&$validPaths) {
            $tenant->run(function () use ($tenant, &$validPaths) {
                $paths = Materi::query()
                    ->whereNotNull('file_path')
                    ->where('file_path', 'not like', 'http%')
                    ->pluck('file_path');

                $this->line("  - {$tenant->code}: {$paths->count()} referensi file");
                $validPaths = $validPaths->concat($paths);
            });
        });

        $validPaths = $validPaths->unique()->flip(); // O(1) lookup
        $this->line("Total referensi file valid (gabungan semua tenant): {$validPaths->count()}");
        $this->newLine();

        // Scan disk SEKALI, bukan per tenant.
        $filesOnDisk = Storage::disk('r2')->allFiles('materials');
        $cutoff = now()->subHours($graceHours);

        $totalOrphans = 0;
        $totalDeleted = 0;
        $totalErrors  = 0;

        foreach ($filesOnDisk as $path) {
            if (isset($validPaths[$path])) {
                continue; // masih dipakai oleh tenant manapun, skip
            }

            $lastModified = Storage::disk('r2')->lastModified($path);
            if ($lastModified && \Carbon\Carbon::createFromTimestamp($lastModified)->gt($cutoff)) {
                continue; // grace period, belum tentu row-nya sudah ter-create
            }

            $totalOrphans++;
            $this->warn(($isDryRun ? '[AKAN DIHAPUS] ' : '[DIHAPUS] ') . $path);

            Log::channel('single')->info('r2-prune-orphaned-materials', [
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

        $this->newLine();
        $this->info("Selesai. File yatim ditemukan: {$totalOrphans}"
            . ($isDryRun ? ' (belum dihapus, jalankan dengan --force untuk eksekusi).' : ", berhasil dihapus: {$totalDeleted}, gagal: {$totalErrors}."));

        return self::SUCCESS;
    }
}