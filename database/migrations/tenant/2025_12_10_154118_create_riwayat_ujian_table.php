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

            // Composite unique ini leftmost-nya user_id, jadi otomatis meng-cover
            // query "WHERE user_id = ?" dan "WHERE user_id = ? AND soal_id = ?"
            // juga. Index terpisah untuk kombinasi itu jadi tidak diperlukan lagi
            // (dulu ada riwayat_ujian_user_soal_idx yang duplikat dengan ini).
            $table->unique(
                ['user_id', 'soal_id', 'quest_id'],
                'riwayat_ujian_unique'
            );

            // Dashboard siswa/guru: "soal mana saja yang belum/sedang dikerjakan
            // DALAM SATU sesi ujian" (WHERE ujian_siswa_id = ? AND status = ?).
            // Composite ini juga otomatis meng-cover "WHERE ujian_siswa_id = ?"
            // saja (tanpa filter status), jadi index tunggal ujian_siswa_id
            // yang lama tidak perlu dipertahankan terpisah.
            $table->index(['ujian_siswa_id', 'status'], 'riwayat_ujian_siswa_status_idx');

            // Analisis butir soal: "berapa % siswa jawab benar soal ini"
            // (WHERE quest_id = ? [AND benar = ?]). Composite ini meng-cover
            // "WHERE quest_id = ?" saja maupun dikombinasikan dengan benar,
            // jadi menggantikan dua index terpisah (quest_id, benar) sebelumnya.
            $table->index(['quest_id', 'benar'], 'riwayat_ujian_quest_benar_idx');

            // Dipakai untuk laporan/rentang waktu pengerjaan lintas sesi
            // (misal audit, ekspor data per periode). Tidak ada kolom
            // pendamping berkardinalitas rendah yang cocok dijadikan composite,
            // jadi tetap sebagai index tunggal.
            $table->index('waktu_pengerjaan', 'riwayat_ujian_waktu_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_ujian');
    }
};