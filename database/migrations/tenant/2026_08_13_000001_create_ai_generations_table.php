<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_generations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('plan_key')->nullable();
            $table->string('source')->default('material');
            // $table->unsignedInteger('cost')->default(1);
            $table->string('status')->default('generated');
            $table->timestamps();

            $table->index(['user_id', 'plan_key', 'created_at']);
            $table->index(['created_at']);
            $table->index(['user_id', 'created_at', 'status'], 'ai_generations_user_period_idx');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_generations');
    }
};
