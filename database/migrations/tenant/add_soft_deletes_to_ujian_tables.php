<?php
// database/migrations/xxxx_xx_xx_add_soft_deletes_to_ujian_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ujian_siswa', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('riwayat_ujian', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('ujian_siswa', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('riwayat_ujian', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};