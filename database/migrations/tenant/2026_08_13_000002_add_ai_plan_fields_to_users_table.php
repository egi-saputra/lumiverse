<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('ai_plan')->nullable()->default('free')->after('role');
            $table->string('ai_plan_status')->nullable()->default('inactive')->after('ai_plan');
            $table->timestamp('ai_plan_started_at')->nullable()->after('ai_plan_status');
            $table->timestamp('ai_plan_expires_at')->nullable()->after('ai_plan_started_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['ai_plan', 'ai_plan_status', 'ai_plan_started_at', 'ai_plan_expires_at']);
        });
    }
};
