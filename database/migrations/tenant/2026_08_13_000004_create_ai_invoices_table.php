<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('external_id')->unique();
            $table->string('invoice_id')->nullable(); // ID dari Xendit
            $table->string('invoice_url')->nullable();
            $table->string('plan_key'); // pro / max
            $table->unsignedBigInteger('amount')->default(0);
            $table->string('status')->default('pending'); // pending, paid, failed, expired
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->json('meta')->nullable(); // buat nyimpen payload webhook mentah kalau perlu
            $table->timestamps();

            $table->index(['user_id', 'status', 'created_at']);
            $table->index(['external_id']);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_invoices');
    }
};