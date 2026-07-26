<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('guru', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->string('kode_guru', 20)->nullable()->unique();
            $table->string('nama_lengkap');
            $table->timestamps();

            // constrained() hanya membuat FOREIGN KEY constraint, TIDAK otomatis
            // membuat index di PostgreSQL (beda dengan asumsi umum). Tanpa ini,
            // JOIN/lookup guru berdasarkan user_id akan full table scan.
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guru');
    }
};