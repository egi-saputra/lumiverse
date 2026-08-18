<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('ai_pending_plan')->nullable()->after('ai_plan_expires_at');
            $table->string('ai_external_id')->nullable()->after('ai_pending_plan');
            $table->string('ai_invoice_id')->nullable()->after('ai_external_id');
            $table->string('ai_last_invoice_status')->nullable()->default('inactive')->after('ai_invoice_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['ai_pending_plan', 'ai_external_id', 'ai_invoice_id', 'ai_last_invoice_status']);
        });
    }
};
