<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soal');
    }
};
