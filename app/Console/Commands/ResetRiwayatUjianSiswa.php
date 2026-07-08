<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetRiwayatUjianSiswa extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'reset:ujian-siswa';

    /**
     * The console command description.
     */
    protected $description = 'Menghapus semua data pada tabel riwayat_ujian dan ujian_siswa';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('riwayat_ujian')->truncate();
        DB::table('ujian_siswa')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info('✅ Tabel riwayat_ujian dan ujian_siswa berhasil di-reset.');
    }
}