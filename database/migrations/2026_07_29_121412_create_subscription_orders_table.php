<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscription_orders', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id');
            $table->unsignedBigInteger('plan_id');
            $table->string('billing_cycle');
            $table->unsignedBigInteger('subtotal');
            $table->unsignedBigInteger('yearly_discount');
            $table->unsignedTinyInteger('discount_percent')->default(0);
            $table->unsignedBigInteger('discount_amount')->default(0);
            $table->unsignedBigInteger('referral_discount_amount')->default(0);

            // Kandidat partner untuk order ini — diisi saat checkout kalau tenant
            // input kode referral (atau tenant sudah permanen ter-link lewat
            // tenant_referrals). Atribusi permanen baru DIKUNCI (dibuatkan row
            // tenant_referrals) saat order ini berhasil dibayar, bukan di sini.
            $table->unsignedBigInteger('referrer_partner_id')->nullable();

            $table->unsignedBigInteger('credit_amount')->default(0);
            $table->unsignedInteger('bonus_days')->default(0);
            $table->string('order_id')->unique();
            $table->date('expires_at')->nullable();
            $table->string('snap_token')->nullable();
            $table->string('xendit_invoice_id')->nullable();
            $table->unsignedBigInteger('amount');
            $table->unsignedBigInteger('tax_amount')->default(0);
            $table->string('action')->nullable();
            $table->string('status')->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->json('xendit_payload')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('plan_id')->references('id')->on('plans');
            $table->foreign('referrer_partner_id')->references('id')->on('partners')->nullOnDelete();

            // Index untuk kolom FK
            $table->index('tenant_id');
            $table->index('plan_id');
            $table->index('referrer_partner_id');

            // Query paling umum: riwayat order milik satu tenant, diurutkan
            // dari yang terbaru (halaman billing/invoice tenant).
            $table->index(['tenant_id', 'created_at'], 'subscription_orders_tenant_created_idx');

            // Dipakai saat callback dari payment gateway (Midtrans) meng-query
            // ulang berdasarkan snap_token.
            $table->index('snap_token');
        });

        // Partial index: dipakai oleh scheduler/job yang mencari order dengan
        // status 'pending' untuk di-expire atau dicek ulang statusnya ke Midtrans.
        // Karena mayoritas order lama akhirnya berstatus 'paid'/'expired'/'failed',
        // partial index ini jauh lebih kecil & tetap cepat walau tabel order
        // sudah berisi jutaan baris di production.
        DB::statement(
            "CREATE INDEX subscription_orders_pending_idx ON subscription_orders (created_at) WHERE status = 'pending'"
        );

        // Partial index untuk laporan/rekap pembayaran (hanya order yang sudah dibayar).
        DB::statement(
            'CREATE INDEX subscription_orders_paid_at_idx ON subscription_orders (paid_at) WHERE paid_at IS NOT NULL'
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_orders');
    }
};