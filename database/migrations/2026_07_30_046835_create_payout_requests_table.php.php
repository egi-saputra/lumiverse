<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payout_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('partner_id')->constrained('partners')->cascadeOnDelete();
            $table->foreignId('partner_bank_account_id')->constrained('partner_bank_accounts')->restrictOnDelete();

            $table->unsignedInteger('amount');

            // pending    -> baru dibuat, saldo sudah dikunci/dikurangi
            // processing -> sudah dikirim ke Xendit, nunggu webhook
            // completed  -> dana sudah sampai
            // failed     -> gagal, saldo partner sudah dikembalikan
            $table->string('status')->default('pending');

            $table->string('xendit_payout_id')->nullable()->unique();
            $table->text('failure_reason')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->index('partner_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payout_requests');
    }
};