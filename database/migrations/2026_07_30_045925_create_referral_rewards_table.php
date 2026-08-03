<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referral_rewards', function (Blueprint $table) {
            $table->id();

            // Satu order berbayar hanya bisa menghasilkan satu reward —
            // unique() ini yang menjamin idempotensi kalau webhook Xendit
            // terpanggil dobel untuk order yang sama. Tenant mana yang
            // order bisa ditelusuri lewat order_id -> subscription_orders,
            // jadi tidak perlu disimpan ulang di sini.
            $table->foreignId('order_id')
                  ->unique()
                  ->constrained('subscription_orders')
                  ->cascadeOnDelete();

            // Partner pemilik kode referral yang dipakai
            $table->unsignedBigInteger('referrer_partner_id');

            $table->unsignedTinyInteger('reward_percent');
            $table->unsignedInteger('reward_amount');
            $table->timestamp('credited_at')->nullable();
            $table->timestamps();

            $table->foreign('referrer_partner_id')
                  ->references('id')->on('partners')->cascadeOnDelete();

            $table->index('referrer_partner_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_rewards');
    }
};