<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('title');
            $table->foreignId('mapel_id')
                  ->constrained('mapel')
                  ->onDelete('cascade');

            $table->string('kelas');

            $table->enum('status', ['Aktif', 'Tidak Aktif'])->default('Tidak Aktif');
            $table->enum('tipe_soal', ['Berurutan', 'Acak'])->default('Berurutan');

            $table->integer('waktu')->comment('Waktu dalam menit atau detik');

            $table->string('token', 6)->unique(); // Token unik 6 digit

            $table->timestamps();

            // FK belum ke-index otomatis di PostgreSQL.
            // Dipakai buat: daftar soal milik satu guru, diurutkan terbaru.
            $table->index(['user_id', 'created_at'], 'soal_user_created_idx');
            $table->index('mapel_id');
        });

        // Partial index: query paling sering dari sisi siswa adalah
        // "tampilkan soal aktif untuk kelas X" (WHERE kelas = ? AND status = 'Aktif').
        // Karena mayoritas soal lama akhirnya berstatus 'Tidak Aktif' (sudah lewat/diarsipkan),
        // partial index ini cuma menyimpan baris yang benar-benar sedang dipakai —
        // jauh lebih kecil & stabil walau riwayat soal menumpuk di production.
        DB::statement(
            "CREATE INDEX soal_active_kelas_idx ON soal (kelas) WHERE status = 'Aktif'"
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('soal');
    }
};