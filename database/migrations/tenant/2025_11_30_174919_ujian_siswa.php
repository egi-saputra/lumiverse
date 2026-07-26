<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
            // 1) Cek apakah siswa X sudah/sedang mengerjakan soal Y, dan
            //    riwayat ujian per siswa (user_id di posisi pertama).
            $table->index(['user_id', 'soal_id'], 'ujian_siswa_user_soal_idx');

            // 2) Dashboard guru: "tampilkan status semua siswa untuk ujian X"
            //    (WHERE soal_id = ? [AND status = ?]). Sebelumnya belum ada
            //    index dengan soal_id di posisi pertama, jadi query ini
            //    full table scan padahal ini query paling sering dipakai guru.
            $table->index(['soal_id', 'status'], 'ujian_siswa_soal_status_idx');
        });

        // Partial index: dipakai oleh cron/job auto-submit yang mencari
        // sesi ujian dengan status 'Sedang Dikerjakan' lalu bandingkan
        // waktu_mulai dengan durasi ujian buat cek timeout. Baris dengan
        // status lain (terutama 'Selesai', yang jumlahnya akan terus
        // bertambah seiring waktu) sama sekali tidak masuk index ini —
        // jauh lebih ringkas & stabil dibanding index waktu_mulai biasa.
        DB::statement(
            "CREATE INDEX ujian_siswa_active_waktu_mulai_idx ON ujian_siswa (waktu_mulai) WHERE status = 'Sedang Dikerjakan'"
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('ujian_siswa');
    }
};