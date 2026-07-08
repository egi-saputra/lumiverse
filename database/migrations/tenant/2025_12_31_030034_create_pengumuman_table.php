<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->id();
            $table->string('judul')->nullable();
            $table->text('pengumuman');

            $table->unsignedBigInteger('user_id'); // pembuat pengumuman
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');

            $table->string('file_path')->nullable();
            $table->string('video_url', 500)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengumuman');
    }
};
