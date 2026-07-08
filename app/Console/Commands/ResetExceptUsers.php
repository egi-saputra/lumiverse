<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ResetExceptUsers extends Command
{
    protected $signature = 'reset:except-users';
    protected $description = 'Reset semua tabel kecuali tabel users';

    public function handle()
    {
        $excludedTables = ['users', 'migrations'];

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $tables = DB::select('SHOW TABLES');

        $dbName = DB::getDatabaseName();
        $key = 'Tables_in_' . $dbName;

        foreach ($tables as $table) {
            $tableName = $table->$key;

            if (!in_array($tableName, $excludedTables)) {
                DB::table($tableName)->truncate();
                $this->line("✔ {$tableName} di-reset");
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info('✅ Semua tabel berhasil di-reset kecuali users');
    }
}
