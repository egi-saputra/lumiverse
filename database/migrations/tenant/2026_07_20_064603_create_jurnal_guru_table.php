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
        Schema::create('jurnals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('guru_id')
                ->constrained('guru')
                ->cascadeOnDelete();

            $table->foreignId('kelas_id')
                ->constrained('kelas')
                ->cascadeOnDelete();

            $table->foreignId('mapel_id')
                ->constrained('mapel')
                ->cascadeOnDelete();

            // Waktu (hari, tanggal, tahun didapat dari kolom date)
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
 
            // Accuracy (meter) yang dilaporkan Geolocation API device.
            $table->decimal('akurasi_meter', 8, 2)->nullable();
 
            // Jarak ke titik target, dihitung ULANG di server (bukan dari
            // client) saat submit — ini yang jadi acuan valid/tidaknya.
            $table->decimal('jarak_meter', 8, 2)->nullable();

            // Materi yang diajarkan pada pertemuan tsb
            $table->text('materi');
            $table->unsignedTinyInteger('jumlah_jam')->default(1);

            $table->timestamps();

            // Cegah guru mengisi jurnal ganda pada kelas/mapel/jam yang sama
            $table->unique(['guru_id', 'kelas_id', 'mapel_id', 'tanggal', 'jam_mulai'], 'jurnal_unique_entry');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurnals');
    }
};