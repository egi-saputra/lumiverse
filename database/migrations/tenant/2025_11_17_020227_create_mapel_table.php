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
        Schema::create('mapel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')
                  ->constrained('guru')
                  ->onDelete('cascade');
            $table->string('mapel');
            $table->timestamps();

            // Satu guru tidak boleh punya nama mapel yang sama dua kali.
            // Composite unique ini sekaligus berfungsi sebagai index —
            // guru_id ada di posisi pertama, jadi query "semua mapel milik
            // guru X" maupun "cek apakah guru X sudah punya mapel Y" sama-sama
            // kepakai index ini. Index tunggal guru_id jadi tidak perlu lagi.
            $table->unique(['guru_id', 'mapel']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mapel');
    }
};