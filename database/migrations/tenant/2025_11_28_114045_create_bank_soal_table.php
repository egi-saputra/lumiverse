<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bank_soal', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel soal (paket ujian)
            $table->foreignId('soal_id')
                ->constrained('soal')
                ->onDelete('cascade');

            $table->text('soal');

            $table->enum('tipe_soal', [
                'PG',
                'Essay'
            ])->default('PG');

            $table->enum('jenis_lampiran', [
                'Tanpa Lampiran',
                'Gambar'
            ])->default('Tanpa Lampiran');

            // Lampiran soal
            $table->string('link_lampiran')->nullable();

            // Jawaban benar
            $table->text('jawaban_benar')->nullable();

            // Opsi jawaban
            $table->text('opsi_a')->nullable();
            $table->string('opsi_a_lampiran')->nullable();

            $table->text('opsi_b')->nullable();
            $table->string('opsi_b_lampiran')->nullable();

            $table->text('opsi_c')->nullable();
            $table->string('opsi_c_lampiran')->nullable();

            $table->text('opsi_d')->nullable();
            $table->string('opsi_d_lampiran')->nullable();

            $table->text('opsi_e')->nullable();
            $table->string('opsi_e_lampiran')->nullable();

            // Nilai soal
            $table->integer('nilai')->default(0);

            $table->timestamps();

            // Query paling dominan di tabel ini: ambil semua butir soal milik
            // satu paket ujian (WHERE soal_id = ?), misal saat siswa mulai
            // ujian atau guru mengedit paket. FK ini belum ke-index otomatis
            // di PostgreSQL.
            $table->index('soal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_soal');
    }
};