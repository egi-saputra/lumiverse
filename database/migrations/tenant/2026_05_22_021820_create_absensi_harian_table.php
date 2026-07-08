<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absensi_harian', function (Blueprint $table) {
            $table->id();

            // Relasi ke siswa & kelas (snapshot kelas_id agar histori tidak rusak jika siswa pindah kelas)
            $table->foreignId('siswa_id')
                  ->constrained('siswa')
                  ->cascadeOnDelete();

            $table->unsignedBigInteger('kelas_id');   // snapshot, tidak FK agar data historis aman
            $table->date('tanggal');

            // Status: hadir | sakit | izin | alpha
            $table->enum('status', ['hadir', 'sakit', 'izin', 'alpha'])->default('alpha');

            // Keterangan opsional (misal: nama dokter, surat izin)
            $table->text('keterangan')->nullable();

            // Dicatat oleh wali kelas
            $table->foreignId('dicatat_oleh')
                  ->constrained('users')
                  ->restrictOnDelete();

            $table->timestamps();

            // Satu siswa hanya boleh punya 1 record per tanggal
            $table->unique(['siswa_id', 'tanggal'], 'unique_absensi_per_hari');

            // Index untuk query laporan
            $table->index(['kelas_id', 'tanggal']);
            $table->index(['siswa_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi_harian');
    }
};