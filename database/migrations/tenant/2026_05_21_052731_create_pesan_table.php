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
            $table->string('penerima', 20); // semua|admin|guru|proktor|siswa
            $table->foreignId('kelas_id')
                  ->nullable()
                  ->constrained('kelas')
                  ->nullOnDelete();
            $table->foreignId('pengirim_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->timestamps();

            // Query paling umum: user ambil pesan yang ditujukan buat
            // role-nya, opsional difilter per kelas juga
            // (WHERE penerima IN (?, 'semua') AND kelas_id = ?). Diganti
            // dari index tunggal 'penerima' jadi composite ini karena
            // leftmost-nya tetap penerima, jadi query lama (penerima saja)
            // tetap ke-cover, plus dapat kemampuan filter kelas_id gratis.
            $table->index(['penerima', 'kelas_id'], 'pesan_penerima_kelas_idx');

            // FK belum ke-index otomatis di PostgreSQL. Dipakai untuk
            // "riwayat pesan yang saya kirim" (admin/guru).
            $table->index('pengirim_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesan');
    }
};