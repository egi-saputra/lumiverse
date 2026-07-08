<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->string('id')->primary();

            // Kode unik lembaga (6 digit angka, autogenerate)
            $table->string('code', 6)->nullable()->unique();

            // Data Tenant
            $table->string('name')->nullable();
            $table->string('product_type')->nullable();

            // Jenis lembaga
            $table->string('institution_type')->default('sekolah');
            $table->string('institution_type_other')->nullable();
            $table->string('school_level')->nullable();

            // Identitas lembaga
            $table->string('npsn')->nullable();
            $table->string('nss')->nullable();
            $table->string('registration_number')->nullable();

            // Kontak
            $table->string('contact_phone')->nullable();
            $table->string('institution_email')->nullable();
            $table->string('institution_website')->nullable();
            $table->text('address')->nullable();
            $table->string('logo_path')->nullable();

            // Paket langganan
            $table->unsignedBigInteger('plan_id')->nullable();
            $table->timestamp('trial_used_at')->nullable();
            $table->unsignedBigInteger('pending_plan_id')->nullable();
            $table->string('pending_billing_cycle')->nullable();
            $table->timestamp('quota_grace_until')->nullable();
            $table->integer('max_users')->nullable();
            $table->date('expires_at')->nullable();
            $table->boolean('is_active')->default(true);

            // Laravel
            $table->timestamps();
            $table->json('data')->nullable();
        });

        // Foreign keys ditambah setelah tabel plans ada
        // Jalankan ini via migration terpisah atau pastikan plans dibuat duluan
        Schema::table('tenants', function (Blueprint $table) {
            $table->foreign('plan_id')
                  ->references('id')
                  ->on('plans')
                  ->nullOnDelete();

            $table->foreign('pending_plan_id')
                  ->references('id')
                  ->on('plans')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropForeign(['plan_id']);
            $table->dropForeign(['pending_plan_id']);
        });

        Schema::dropIfExists('tenants');
    }
};