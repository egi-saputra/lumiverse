<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->bigIncrements('id');

            // Data akun — pola sama seperti users (login guard terpisah: 'partner')
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 20)->unique()->nullable();
            $table->string('lumiverse_id')->nullable();
            $table->string('google_id')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->rememberToken();

            // Referral — pola sama seperti tenants, tapi sekarang tinggal di sini
            $table->string('referral_code')->nullable()->unique();
            $table->unsignedInteger('referral_credit_balance')->default(0);

            // Status akun partner (mis. suspend kalau ada penyalahgunaan kode referral)
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Dipakai saat login via Google OAuth (WHERE google_id = ?), sama
            // seperti pola di tabel users.
            $table->index('google_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};