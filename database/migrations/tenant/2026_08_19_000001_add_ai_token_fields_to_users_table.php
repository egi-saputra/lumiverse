<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Track token balance (sisa token yang tidak terpakai dari periode sebelumnya)
            $table->unsignedInteger('ai_token_balance')->default(0)->after('ai_plan_expires_at');
            
            // Track last token reset date (untuk determine kapan reset berikutnya)
            $table->timestamp('ai_token_last_reset_at')->nullable()->after('ai_token_balance');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['ai_token_balance', 'ai_token_last_reset_at']);
        });
    }
};
