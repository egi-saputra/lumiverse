<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absensi_harian', function (Blueprint $table) {
            $table->id();

            // Relasi ke siswa & kelas (snapshot kelas_id agar histori tidak rusak jika siswa pindah kelas)
            $table->foreignId('siswa_id')
                  ->constrained('siswa')
                  ->cascadeOnDelete();

            $table->unsignedBigInteger('kelas_id');   // snapshot, tidak FK agar data historis aman
            $table->date('tanggal');

            // Status: hadir | sakit | izin | alpha
            $table->enum('status', ['hadir', 'sakit', 'izin', 'alpha'])->default('alpha');

            // Keterangan opsional (misal: nama dokter, surat izin)
            $table->text('keterangan')->nullable();

            // Dicatat oleh wali kelas
            $table->foreignId('dicatat_oleh')
                  ->constrained('users')
                  ->restrictOnDelete();

            $table->timestamps();

            // Satu siswa hanya boleh punya 1 record per tanggal.
            // Composite unique ini leftmost-nya siswa_id, jadi otomatis
            // meng-cover query "WHERE siswa_id = ?" dan "WHERE siswa_id = ?
            // AND tanggal = ?" juga — index terpisah untuk kombinasi yang
            // sama (siswa_id, tanggal) jadi duplikat dan sudah dihapus.
            $table->unique(['siswa_id', 'tanggal'], 'unique_absensi_per_hari');

            // Index untuk query laporan absensi per kelas per tanggal
            // (rekap harian wali kelas / admin).
            $table->index(['kelas_id', 'tanggal']);

            // FK belum ke-index otomatis di PostgreSQL. Berguna kalau ada
            // fitur "riwayat pencatatan absensi oleh guru X" atau audit trail.
            $table->index('dicatat_oleh');
        });

        // Partial index: dipakai fitur monitoring "siswa dengan
        // sakit/izin/alpha berlebihan" (BK/wali kelas). Mayoritas baris di
        // tabel ini pasti berstatus 'hadir' (siswa masuk sekolah tiap hari
        // jauh lebih sering daripada absen), jadi baris 'hadir' sengaja
        // TIDAK ikut ter-index — bikin index ini jauh lebih kecil & query
        // riwayat ketidakhadiran tetap cepat walau data absensi harian
        // menumpuk bertahun-tahun.
        DB::statement(
            "CREATE INDEX absensi_harian_non_hadir_idx ON absensi_harian (siswa_id, tanggal) WHERE status != 'hadir'"
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi_harian');
    }
};