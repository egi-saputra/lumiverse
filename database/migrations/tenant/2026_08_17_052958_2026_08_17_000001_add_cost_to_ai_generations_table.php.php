<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_generations', function (Blueprint $table) {
            // Default 1 supaya baris lama (generate materi) tetap dianggap 1 kredit,
            // sesuai perilaku sebelum kolom ini ada.
            $table->unsignedInteger('cost')->default(1)->after('source');
        });
    }

    public function down(): void
    {
        Schema::table('ai_generations', function (Blueprint $table) {
            $table->dropColumn('cost');
        });
    }
};