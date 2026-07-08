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
        Schema::create('subscription_orders', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id');
            $table->unsignedBigInteger('plan_id');
            $table->string('billing_cycle');
            $table->unsignedBigInteger('subtotal');
            $table->unsignedBigInteger('yearly_discount');
            $table->unsignedTinyInteger('discount_percent')->default(0);
            $table->unsignedBigInteger('discount_amount')->default(0);
            $table->unsignedBigInteger('credit_amount')->default(0);
            $table->unsignedInteger('bonus_days')->default(0);
            $table->string('order_id')->unique();
            $table->date('expires_at')->nullable();
            $table->string('snap_token')->nullable();
            $table->unsignedBigInteger('amount');
            $table->unsignedBigInteger('tax_amount')->default(0);
            $table->string('action')->nullable();
            $table->string('status')->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->json('midtrans_payload')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('plan_id')->references('id')->on('plans');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_orders');
    }
};
