<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('device_biometric_keys', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('device_id');
            $table->foreign('device_id')->references('id')->on('devices')->cascadeOnDelete();

            // Private key nggak pernah keluar dari Secure Enclave (iOS)
            // / Keystore (Android) — server cuma nyimpen public key buat
            // verifikasi signature challenge (ECDSA P-256 / ES256).
            $table->text('public_key');
            $table->string('algorithm', 20)->default('ES256');
            $table->timestamp('last_used_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_biometric_keys');
    }
};