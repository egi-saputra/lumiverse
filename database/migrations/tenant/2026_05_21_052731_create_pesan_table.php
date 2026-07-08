<?php
 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pesan', function (Blueprint $table) {
            $table->id();
            $table->string('judul', 255);
            $table->longText('isi');
            $table->string('penerima', 20)->index(); // semua|admin|guru|proktor|siswa
            $table->foreignId('kelas_id')
                  ->nullable()
                  ->constrained('kelas')
                  ->nullOnDelete();
            $table->foreignId('pengirim_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->timestamps();
        });
    }
 
    public function down(): void
    {
        Schema::dropIfExists('pesan');
    }
};