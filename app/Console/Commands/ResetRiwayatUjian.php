<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetRiwayatUjian extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'reset:ujian';

    /**
     * The console command description.
     */
    protected $description = 'Menghapus semua data pada tabel riwayat_ujian';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('riwayat_ujian')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info('✅ Tabel riwayat_ujian berhasil di-reset.');
    }
}
