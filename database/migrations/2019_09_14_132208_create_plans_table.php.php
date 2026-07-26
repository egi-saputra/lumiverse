<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();             // 'trial', 'starter', 'pro', dll — dipakai di tenants.plan
            $table->enum('product_type', ['school', 'workspace'])
                  ->default('school');
            $table->string('name');                      // 'Starter Kit', 'Basic', dll
            $table->text('description')->nullable();     // deskripsi singkat untuk halaman pricing
            $table->unsignedBigInteger('price_monthly')->default(0); // dalam rupiah, 0 = gratis
            $table->unsignedBigInteger('price_yearly')->default(0);
            // Persentase pajak & diskon default untuk plan ini (0-100)
            $table->unsignedTinyInteger('tax')->default(0);
            $table->unsignedTinyInteger('discount')->default(0);
            $table->unsignedInteger('max_users')->nullable();        // null = unlimited
            $table->unsignedInteger('duration_days')->nullable();    // null = tidak ada batas waktu
            $table->json('features')->nullable();        // ["Fitur A", "Fitur B"]
            $table->json('unavailable_features')->nullable(); // fitur yang belum tersedia di plan ini
            $table->string('badge')->nullable();         // "Paling Populer", "Rekomendasi", dll
            $table->string('accent_color', 20)->default('#00d4ff'); // hex color
            $table->boolean('is_highlighted')->default(false); // tampil sebagai kartu utama di pricing
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0); // urutan tampil
            $table->timestamps();
        });

        // Index tambahan untuk performa query di PostgreSQL
        // -----------------------------------------------------------------
        // Query paling umum: tampilkan plan yang aktif untuk product_type
        // tertentu, diurutkan sesuai sort_order (halaman pricing / registrasi tenant).
        // Pakai PARTIAL INDEX karena is_active itu boolean (low cardinality) —
        // index hanya menyimpan baris is_active = true, jauh lebih kecil &
        // efisien dibanding composite index biasa, dan tetap stabil walau
        // jumlah plan bertambah banyak (termasuk plan yang sudah nonaktif/diarsipkan).
        DB::statement(
            'CREATE INDEX plans_active_type_sort_idx ON plans (product_type, sort_order) WHERE is_active = true'
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};