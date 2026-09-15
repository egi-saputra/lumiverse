<?php

namespace App\Console\Commands;

use App\Models\BankSoal;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PruneOrphanedR2BankSoal extends Command
{
    protected $signature = 'r2:prune-orphaned-bank-soal
                            {--force : Benar-benar hapus file. Tanpa flag ini, cuma laporan (dry-run).}
                            {--hours=24 : Grace period — file yang lebih baru dari ini dari sekarang tidak disentuh.}';

    protected $description = 'Hapus file di R2 folder "bank_soal/" (shared, bukan per-tenant) yang tidak dirujuk oleh kolom lampiran manapun (link_lampiran, opsi_a..e_lampiran) di row BankSoal manapun di SEMUA tenant. Default dry-run.';

    private const LAMPIRAN_COLUMNS = [
        'link_lampiran',
        'opsi_a_lampiran',
        'opsi_b_lampiran',
        'opsi_c_lampiran',
        'opsi_d_lampiran',
        'opsi_e_lampiran',
    ];

    public function handle(): int
    {
        $isDryRun   = ! $this->option('force');
        $graceHours = (int) $this->option('hours');

        $this->info($isDryRun
            ? '=== DRY RUN — tidak ada file yang benar-benar dihapus ==='
            : '=== MODE HAPUS AKTIF — file yang terdeteksi yatim akan dihapus permanen ===');

        $this->line('Mengumpulkan path lampiran valid (6 kolom) dari semua tenant...');
        $validPaths = collect();

        Tenant::query()->get()->each(function ($tenant) use (&$validPaths) {
            $tenant->run(function () use ($tenant, &$validPaths) {
                $rows = BankSoal::query()
                    ->select(self::LAMPIRAN_COLUMNS)
                    ->get();

                $paths = collect();
                foreach (self::LAMPIRAN_COLUMNS as $column) {
                    $paths = $paths->concat(
                        $rows->pluck($column)
                            ->filter() // buang null
                            ->reject(fn ($p) => str_starts_with($p, 'http'))
                    );
                }

                $this->line("  - {$tenant->code}: {$paths->count()} referensi file (dari 6 kolom)");
                $validPaths = $validPaths->concat($paths);
            });
        });

        $validPaths = $validPaths->unique()->flip();
        $this->line("Total referensi file valid (gabungan semua tenant): {$validPaths->count()}");
        $this->newLine();

        $filesOnDisk = Storage::disk('r2')->allFiles('bank_soal');
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

            Log::channel('single')->info('r2-prune-orphaned-bank-soal', [
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