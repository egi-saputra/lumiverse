<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->unsignedInteger('radius_meter')->default(100);
            $table->unsignedInteger('toleransi_meter')->default(15);
            $table->unsignedInteger('max_akurasi_meter')->default(50);
            $table->unsignedInteger('kecepatan_maksimum_kmh')->default(120);

            $table->time('jam_buka')->default('07:00:00');
            $table->time('jam_tutup')->default('14:00:00');
            $table->unsignedInteger('durasi_sesi_menit');
 
            // Indonesia punya 3 zona waktu (WIB/WITA/WIT) jadi tenant di
            // luar Jawa bisa beda timezone, bukan cuma beda jam.
            $table->string('timezone', 40)->default('Asia/Jakarta');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_settings');
    }
};