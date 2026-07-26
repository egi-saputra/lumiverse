<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Identitas siswa
            $table->string('nama_lengkap');

            $table->string('tempat_lahir', 100)->nullable();
            $table->date('tanggal_lahir')->nullable();

            $table->enum('jenis_kelamin', [
                'L',
                'P'
            ])->nullable();

            $table->enum('agama', [
                'Islam',
                'Kristen',
                'Katolik',
                'Hindu',
                'Buddha',
                'Konghucu'
            ])->nullable();

            $table->string('no_hp', 15)->nullable();
            $table->string('no_hp_ortu', 15)->nullable();

            $table->text('alamat')->nullable();
            $table->string('kelurahan', 100)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->string('kota', 100)->nullable();
            $table->string('kode_pos', 10)->nullable();

            // NIS & NISN
            $table->string('nis', 10)->nullable()->unique();
            $table->string('nisn', 10)->nullable()->unique();

            // Relasi
            $table->string('kelas_id');
            $table->string('kejuruan_id')->nullable();

            // ID internal siswa
            $table->string('id_siswa', 20)->nullable()->unique();

            // Status
            $table->enum('status', [
                'Activated',
                'Deactivated'
            ])->default('Activated');

            $table->enum('sekretaris', [
                'yes',
                'no'
            ])->default('no');

            $table->enum('bendahara', [
                'yes',
                'no'
            ])->default('no');

            $table->enum('osis', [
                'yes',
                'no'
            ])->default('no');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};