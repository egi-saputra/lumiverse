<?php

namespace App\Console\Commands;

use App\Models\Materi;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PruneOrphanedR2Materials extends Command
{
    protected $signature = 'r2:prune-orphaned-materials
                            {--force : Benar-benar hapus file. Tanpa flag ini, cuma laporan (dry-run).}
                            {--hours=24 : Grace period — file yang lebih baru dari ini dari sekarang tidak disentuh.}';

    protected $description = 'Hapus file di R2 folder "materials/" (shared: semua tenant Lumiverse + smknusantara) yang tidak dirujuk oleh row Materi manapun. Default dry-run.';

    public function handle(): int
    {
        $isDryRun   = ! $this->option('force');
        $graceHours = (int) $this->option('hours');

        $this->info($isDryRun
            ? '=== DRY RUN — tidak ada file yang benar-benar dihapus ==='
            : '=== MODE HAPUS AKTIF — file yang terdeteksi yatim akan dihapus permanen ===');

        $this->line('Mengumpulkan file_path valid dari semua tenant Lumiverse...');
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

        $this->line('Mengumpulkan file_path valid dari smknusantara (database terpisah)...');
        try {
            $smkPaths = DB::connection('smknusantara')
                ->table('materi')
                ->whereNotNull('file_path')
                ->where('file_path', 'not like', 'http%')
                ->pluck('file_path');

            $this->line("  - smknusantara: {$smkPaths->count()} referensi file");
            $validPaths = $validPaths->concat($smkPaths);
        } catch (\Throwable $e) {
            $this->error('GAGAL konek ke database smknusantara: ' . $e->getMessage());
            $this->error('Command dihentikan — tidak aman lanjut tanpa data referensi smknusantara.');
            return self::FAILURE;
        }

        $validPaths = $validPaths->unique()->flip();
        $this->line("Total referensi file valid (Lumiverse + smknusantara): {$validPaths->count()}");
        $this->newLine();

        $filesOnDisk = Storage::disk('r2')->allFiles('materials');
        $cutoff = now()->subHours($graceHours);

        $totalOrphans = 0;
        $totalDeleted = 0;
        $totalErrors  = 0;

        foreach ($filesOnDisk as $path) {
            if (isset($validPaths[$path])) {
                continue;
            }

            $lastModified = Storage::disk('r2')->lastModified($path);
            if ($lastModified && \Carbon\Carbon::createFromTimestamp($lastModified)->gt($cutoff)) {
                continue;
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