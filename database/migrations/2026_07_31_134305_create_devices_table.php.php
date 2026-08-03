<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->bigIncrements('id');

            // Polymorphic — supaya nanti bisa dipakai juga untuk Owner,
            // Developer, atau User (tenant) tanpa bikin tabel devices
            // terpisah per guard. Untuk sekarang cuma diisi Partner.
            $table->unsignedBigInteger('authenticatable_id');
            $table->string('authenticatable_type');

            // device_uuid digenerate di client (mobile app) dan disimpan
            // di Keychain (iOS) / Keystore (Android) — dipakai app buat
            // mengenali dirinya sendiri di semua request berikutnya.
            $table->uuid('device_uuid')->unique();
            $table->string('platform', 20); // ios | android
            $table->string('device_name')->nullable(); // "iPhone 15 - Egsa"
            $table->string('push_token')->nullable();

            $table->timestamp('last_used_at')->nullable();

            // Soft-revoke, bukan delete — biar ada audit trail kalau
            // partner logout/hapus device dari HP lama.
            $table->timestamp('revoked_at')->nullable();

            $table->timestamps();

            $table->index(['authenticatable_type', 'authenticatable_id', 'revoked_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};