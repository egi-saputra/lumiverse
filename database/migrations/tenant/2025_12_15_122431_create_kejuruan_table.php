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
        Schema::create('kejuruan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')
                  ->constrained('guru')
                  ->onDelete('cascade');
            $table->string('kejuruan');
            $table->timestamps();

            // constrained() cuma bikin FK constraint, bukan index — jadi
            // lookup "semua kejuruan milik guru X" tanpa ini bakal full table scan.
            $table->index('guru_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kejuruan');
    }
};