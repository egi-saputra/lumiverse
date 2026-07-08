<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Catatan: kolom FK (tenant_id, plan_id, pending_plan_id) sudah otomatis
     * terindeks oleh MySQL/InnoDB saat foreign key dibuat, jadi tidak perlu
     * diindeks ulang di sini. Migration ini fokus ke kolom filter/sort yang
     * sering dipakai di WHERE / ORDER BY tapi belum punya index.
     */
    public function up(): void
    {
        // Halaman pricing: WHERE is_active = true ORDER BY sort_order
        Schema::table('plans', function (Blueprint $table) {
            $table->index(['is_active', 'sort_order'], 'plans_active_sort_idx');
        });

        // Cron/cek tenant aktif & mendekati/sudah expired
        Schema::table('tenants', function (Blueprint $table) {
            $table->index(['is_active', 'expires_at'], 'tenants_active_expires_idx');
            $table->index('institution_type', 'tenants_institution_type_idx');
            $table->index('product_type', 'tenants_product_type_idx');
        });

        // Cek status order per tenant (paling sering dipakai di dashboard tenant)
        // + filter status untuk dashboard admin, dan laporan berdasarkan paid_at
        Schema::table('subscription_orders', function (Blueprint $table) {
            $table->index(['tenant_id', 'status'], 'sub_orders_tenant_status_idx');
            $table->index('status', 'sub_orders_status_idx');
            $table->index('paid_at', 'sub_orders_paid_at_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropIndex('plans_active_sort_idx');
        });

        Schema::table('tenants', function (Blueprint $table) {
            $table->dropIndex('tenants_active_expires_idx');
            $table->dropIndex('tenants_institution_type_idx');
            $table->dropIndex('tenants_product_type_idx');
        });

        Schema::table('subscription_orders', function (Blueprint $table) {
            $table->dropIndex('sub_orders_tenant_status_idx');
            $table->dropIndex('sub_orders_status_idx');
            $table->dropIndex('sub_orders_paid_at_idx');
        });
    }
};