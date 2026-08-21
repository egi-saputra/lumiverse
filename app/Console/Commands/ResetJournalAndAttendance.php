<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetJournalAndAttendance extends Command
{
    protected $signature = 'school:reset-journal-attendance {--dry-run : Tampilkan jumlah data tanpa menghapus}';

    protected $description = 'Reset jurnal guru dan absensi siswa di seluruh tenant';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $tenants = Tenant::query()->get();

        if ($tenants->isEmpty()) {
            $this->info('Tidak ada tenant yang ditemukan.');
            return self::SUCCESS;
        }

        foreach ($tenants as $tenant) {
            $result = $tenant->run(function () use ($dryRun) {
                $journalCount = DB::table('jurnals')->count();
                $attendanceCount = DB::table('absensi_harian')->count();

                if (!$dryRun) {
                    DB::transaction(function () {
                        DB::table('jurnals')->delete();
                        DB::table('absensi_harian')->delete();
                    });
                }

                return [
                    'journals' => $journalCount,
                    'attendance' => $attendanceCount,
                ];
            });

            $action = $dryRun ? 'akan direset' : 'berhasil direset';
            $this->line("Tenant {$tenant->id}: {$result['journals']} jurnal dan {$result['attendance']} absensi {$action}.");
        }

        $this->info($dryRun
            ? 'Dry-run selesai. Tidak ada data yang dihapus.'
            : 'Reset jurnal guru dan absensi siswa selesai untuk seluruh tenant.');

        return self::SUCCESS;
    }
}
