<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->string('id')->primary();

            // Kode unik lembaga (6 digit angka, autogenerate)
            $table->string('code')->nullable()->unique();

            // Data Tenant
            $table->string('name')->nullable();

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
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);

            // Laravel
            $table->timestamps();
            $table->json('data')->nullable();

            // Index untuk kolom FK. PostgreSQL, tidak seperti MySQL, TIDAK
            // otomatis membuat index saat kolom dipakai sebagai foreign key —
            // jadi ini wajib ditambah manual biar JOIN & lookup plan cepat.
            $table->index('plan_id');
            $table->index('pending_plan_id');
        });

        // Foreign keys ditambah setelah tabel plans ada / setelah tabel tenants
        // selesai dibuat sepenuhnya.
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

        // Partial index: dipakai oleh job/cron pengecekan expiry & quota grace
        // yang hanya peduli pada tenant yang masih aktif (is_active = true).
        // Jauh lebih ringkas dibanding index composite biasa karena tenant
        // yang sudah nonaktif (churn, suspended) tidak ikut ter-index.
        DB::statement(
            'CREATE INDEX tenants_active_expires_idx ON tenants (expires_at) WHERE is_active = true'
        );
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