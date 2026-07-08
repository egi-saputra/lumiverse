<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('riwayat_ujian', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');

            // soal_id nullable
            $table->unsignedBigInteger('soal_id')->nullable();
            $table->foreign('soal_id')
                ->references('id')->on('soal')
                ->nullOnDelete();

            // ujian_siswa_id nullable
            $table->unsignedBigInteger('ujian_siswa_id')->nullable();
            $table->foreign('ujian_siswa_id')
                ->references('id')->on('ujian_siswa')
                ->nullOnDelete();

            // quest_id nullable
            $table->unsignedBigInteger('quest_id')->nullable();
            $table->foreign('quest_id')
                ->references('id')->on('bank_soal')
                ->nullOnDelete();

            $table->string('jawaban')->nullable();

            $table->boolean('benar')->nullable()->default(null);
            $table->integer('nilai')->nullable()->default(null);

            $table->enum('status', [
                'Belum Dikerjakan',
                'Sedang Dikerjakan',
                'Terkunci',
                'Selesai',
            ])->default('Belum Dikerjakan');

            $table->dateTime('waktu_pengerjaan')->nullable();

            $table->timestamps();

            $table->unique(
                ['user_id', 'soal_id', 'quest_id'],
                'riwayat_ujian_unique'
            );

            $table->index('ujian_siswa_id', 'riwayat_ujian_siswa_idx');
            $table->index(['user_id', 'soal_id'], 'riwayat_ujian_user_soal_idx');
            $table->index('status', 'riwayat_ujian_status_idx');
            $table->index('benar', 'riwayat_ujian_benar_idx');
            $table->index('quest_id', 'riwayat_ujian_quest_idx');
            $table->index('waktu_pengerjaan', 'riwayat_ujian_waktu_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_ujian');
    }
};