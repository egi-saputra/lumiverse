<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ujian_siswa', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');

            // soal_id tidak ikut terhapus
            $table->unsignedBigInteger('soal_id')->nullable();
            $table->foreign('soal_id')
                ->references('id')->on('soal')
                ->nullOnDelete();

            $table->timestamp('waktu_mulai')->nullable();
            $table->timestamp('waktu_selesai')->nullable();

            $table->enum('status', [
                'Belum Dikerjakan',
                'Sedang Dikerjakan',
                'Terkunci',
                'Selesai',
            ])->default('Belum Dikerjakan');

            $table->string('token', 6)->unique()->nullable();
            $table->json('soal_ids')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'soal_id'], 'ujian_siswa_user_soal_idx');
            $table->index('status', 'ujian_siswa_status_idx');
            $table->index('waktu_mulai', 'ujian_siswa_waktu_mulai_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ujian_siswa');
    }
};