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
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('label');                        // e.g. "Program Unggulan"
            $table->json('heading');                        // array of heading lines
            $table->unsignedTinyInteger('accent')->default(0); // index of gold line
            $table->text('sub');                            // subtitle / description
            $table->string('image_path');                   // stored file path
            $table->string('tag')->nullable();              // e.g. "Pendaftaran 2025/2026 Dibuka"
            $table->string('cta')->default('Lihat Program'); // button label
            $table->string('cta_target')->default('programs'); // scroll target ID
            $table->unsignedTinyInteger('order')->default(0);  // display order
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
    }
};