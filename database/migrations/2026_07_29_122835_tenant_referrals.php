<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_referrals', function (Blueprint $table) {
            $table->id();

            // Satu tenant cuma bisa punya SATU partner referrer, dan ini
            // permanen — makanya unique(). Begitu tenant daftar pakai kode
            // referral, atribusi ini terkunci seumur hidup tenant tsb,
            // walaupun partner gonta-ganti referral_code di kemudian hari.
            $table->string('tenant_id')->unique();

            $table->foreignId('partner_id')
                  ->constrained('partners')
                  ->cascadeOnDelete();

            // Snapshot kode yang dipakai SAAT signup, murni untuk audit/log
            // ("dulu masuk pakai kode apa"). Tidak dipakai untuk logic
            // penentuan komisi — itu selalu lewat partner_id di atas.
            $table->string('referral_code_used')->nullable();

            $table->timestamp('attributed_at');
            $table->timestamps();

            $table->foreign('tenant_id')
                  ->references('id')->on('tenants')->cascadeOnDelete();

            $table->index('partner_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_referrals');
    }
};