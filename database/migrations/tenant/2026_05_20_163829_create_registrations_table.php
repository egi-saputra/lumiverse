<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel utama menyimpan data pendaftaran siswa baru SMK Nusantara.
     */
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();

            // Data siswa
            $table->string('name', 150);
            $table->string('phone', 20)->unique(); // WhatsApp — unik per nomor
            $table->string('program', 100);         // Jurusan yang dipilih
            $table->text('message')->nullable();    // Pertanyaan/pesan (opsional)

            // Anti-spam & device fingerprint
            $table->string('device_fingerprint', 64)->nullable()->index(); // SHA-256 hash
            $table->string('ip_address', 45)->nullable();                  // IPv4 / IPv6
            $table->string('user_agent')->nullable();
            $table->json('device_info')->nullable();                       // metadata device tambahan

            // Status pendaftaran
            $table->enum('status', ['pending', 'contacted', 'enrolled', 'rejected'])
                ->default('pending');

            // Rate-limit tracking
            $table->timestamp('last_submission_at')->nullable();

            $table->softDeletes(); // soft delete untuk audit trail
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};