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
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 20)->unique()->nullable();
            $table->string('google_id')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->rememberToken();
            $table->enum('role', ['admin', 'staff', 'proktor', 'guru', 'siswa', 'user'])->nullable();
            $table->timestamps();

            // Dipakai saat login via Google OAuth (WHERE google_id = ?).
            // Tanpa index ini, setiap login Google bakal full table scan.
            $table->index('google_id');

            // Dipakai admin panel untuk listing user per role (semua guru,
            // semua siswa, dll). Cardinality-nya rendah (cuma 6 nilai), tapi
            // tetap membantu planner PostgreSQL dibanding scan penuh saat
            // jumlah user sudah puluhan/ratusan ribu baris.
            $table->index('role');
        });

        // NOTE: Tabel 'sessions' SUDAH dibuat di migration
        // 2026_06_23_122456_create_sessions_table.php — sengaja tidak
        // diulang di sini supaya tidak bentrok "relation already exists".

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
    }
};