<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partner_bank_accounts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('partner_id')
                  ->constrained('partners')
                  ->cascadeOnDelete();

            // Bank code Xendit (mis. "BCA", "MANDIRI", dst — sesuai daftar
            // channel_code Disbursement API Xendit)
            $table->string('bank_code');
            $table->string('account_number');
            $table->string('account_holder_name');

            // Hasil name-check dari Xendit (kalau dipakai) sebelum rekening
            // dianggap valid untuk pencairan — mencegah salah kirim ke
            // rekening yang nama pemiliknya tidak cocok.
            $table->string('verification_status')->default('unverified'); // unverified|verified|failed
            $table->text('verification_failure_reason')->nullable();
            $table->timestamp('verified_at')->nullable();

            // Satu partner bisa punya beberapa rekening tersimpan, tapi cuma
            // satu yang aktif dipakai untuk pencairan otomatis.
            $table->boolean('is_primary')->default(false);
            
            $table->softDeletes();
            $table->timestamps();

            $table->index('partner_id');

            // Satu partner tidak boleh daftarkan rekening yang sama dua kali
            $table->unique(['partner_id', 'bank_code', 'account_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_bank_accounts');
    }
};