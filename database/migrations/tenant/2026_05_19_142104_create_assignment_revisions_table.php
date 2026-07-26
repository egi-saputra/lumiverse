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
        Schema::create('assignment_revisions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('tugas_id')
                  ->constrained('tugas')
                  ->cascadeOnDelete();

            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('file_path')->nullable();
            $table->text('catatan_revisi')->nullable();
            $table->tinyInteger('revision_number');

            $table->timestamps();

            // Satu tugas tidak boleh punya revision_number yang sama dua kali.
            // Composite unique ini tetap berfungsi persis seperti index
            // biasa untuk query "semua revisi tugas X" (leftmost tugas_id)
            // maupun "revisi ke-N dari tugas X", sekaligus menjaga integritas
            // data di level database.
            $table->unique(['tugas_id', 'revision_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_revisions');
    }
};