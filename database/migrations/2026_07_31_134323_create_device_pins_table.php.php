<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('device_pins', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('device_id');
            $table->foreign('device_id')->references('id')->on('devices')->cascadeOnDelete();

            // PIN cuma disimpan dalam bentuk hash, nggak pernah plain.
            $table->string('pin_hash');
            $table->unsignedTinyInteger('failed_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_pins');
    }
};