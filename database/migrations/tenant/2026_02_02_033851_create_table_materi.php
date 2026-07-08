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
        });
    }

    public function down()
    {
        Schema::dropIfExists('materi');
    }
};
