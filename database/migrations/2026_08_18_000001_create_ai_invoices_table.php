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
        Schema::connection('central')->create('ai_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('external_id')->unique();
            $table->string('invoice_id')->nullable();
            $table->string('invoice_url')->nullable();
            $table->string('plan_key');
            $table->unsignedBigInteger('amount')->default(0);
            $table->string('status')->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'user_id', 'status', 'created_at']);
            $table->index(['user_id', 'status', 'created_at']);
            $table->index('external_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('central')->dropIfExists('ai_invoices');
    }
};