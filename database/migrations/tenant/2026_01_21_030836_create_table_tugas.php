<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tugas');
    }
};