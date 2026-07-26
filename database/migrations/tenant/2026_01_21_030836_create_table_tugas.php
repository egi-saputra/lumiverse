<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tugas', function (Blueprint $table) {
            $table->id();

            // Siswa/Pengirim Tugas
            $table->unsignedBigInteger('user_id');

            // Guru Penerima
            $table->unsignedBigInteger('guru_id');

            // Mata Pelajaran
            $table->unsignedBigInteger('mapel_id');

            // Data Tugas
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('file_path')->nullable();

            // Status Tugas
            $table->boolean('is_read')->default(false);
            $table->boolean('is_updated')->default(false);
            $table->tinyInteger('revision_count')->default(0);

            $table->timestamps();

            // Foreign Key
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('guru_id')
                ->references('id')
                ->on('guru')
                ->onDelete('cascade');

            $table->foreign('mapel_id')
                ->references('id')
                ->on('mapel')
                ->onDelete('cascade');

            // Dashboard guru: "semua tugas masuk untuk saya" (WHERE guru_id = ?),
            // opsional difilter per mapel juga. Composite ini leftmost-nya
            // guru_id, jadi otomatis meng-cover query guru_id saja.
            $table->index(['guru_id', 'mapel_id'], 'tugas_guru_mapel_idx');

            // Riwayat pengumpulan tugas milik satu siswa, diurutkan terbaru.
            $table->index(['user_id', 'created_at'], 'tugas_user_created_idx');

            // mapel_id juga butuh index sendiri (bukan cuma sebagai kolom
            // kedua di composite di atas) supaya ON DELETE CASCADE dari
            // tabel mapel tetap efisien mencari baris tugas terkait, tanpa
            // ini PostgreSQL akan full scan tabel tugas tiap kali ada mapel
            // yang dihapus.
            $table->index('mapel_id');
        });

        // Partial index: badge notifikasi "tugas belum dibaca" di dashboard
        // guru (WHERE guru_id = ? AND is_read = false). Begitu tugas dibaca,
        // baris itu tidak lagi relevan buat notifikasi — jadi baris
        // is_read = true sengaja tidak ikut ter-index. Index ini akan tetap
        // kecil & cepat meskipun volume tugas yang sudah dibaca terus
        // menumpuk di production.
        DB::statement(
            'CREATE INDEX tugas_unread_idx ON tugas (guru_id) WHERE is_read = false'
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('tugas');
    }
};