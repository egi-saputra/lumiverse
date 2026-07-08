<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel untuk melacak percobaan submit per device/IP
     * agar bisa block spam tanpa perlu Redis.
     */
    public function up(): void
    {
        Schema::create('registration_rate_limits', function (Blueprint $table) {
            $table->id();

            // Identifier: bisa dari IP, device fingerprint, atau keduanya
            $table->string('identifier', 100)->index();
            $table->enum('identifier_type', ['ip', 'fingerprint', 'combined']);

            $table->unsignedSmallInteger('attempt_count')->default(1);
            $table->timestamp('first_attempt_at')->useCurrent();
            $table->timestamp('last_attempt_at')->useCurrent();
            $table->timestamp('blocked_until')->nullable(); // null = tidak diblokir

            // Metadata untuk investigasi
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();

            $table->timestamps();

            // Unik per identifier
            $table->unique(['identifier', 'identifier_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_rate_limits');
    }
};