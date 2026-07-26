<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('materi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // siswa/pengirim tugas
            $table->unsignedBigInteger('kelas_id'); // referensi ke tabel kelas
            $table->unsignedBigInteger('mapel_id'); // referensi ke tabel mapel
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();

            // foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('kelas_id')->references('id')->on('kelas')->onDelete('cascade');
            $table->foreign('mapel_id')->references('id')->on('mapel')->onDelete('cascade');

            // Query paling umum: siswa lihat materi untuk kelas & mapel
            // mereka (WHERE kelas_id = ? AND mapel_id = ?), diurutkan
            // terbaru. Composite ini leftmost-nya kelas_id, jadi otomatis
            // meng-cover query kelas_id saja juga.
            $table->index(['kelas_id', 'mapel_id', 'created_at'], 'materi_kelas_mapel_created_idx');

            // Riwayat materi yang diupload oleh satu user (guru), diurutkan terbaru.
            $table->index(['user_id', 'created_at'], 'materi_user_created_idx');

            // mapel_id butuh index sendiri (bukan cuma kolom kedua di
            // composite di atas) supaya ON DELETE CASCADE dari tabel mapel
            // tetap efisien mencari baris materi terkait.
            $table->index('mapel_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('materi');
    }
};