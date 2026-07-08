<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tugas', function (Blueprint $table) {
            // Tracks whether the receiving teacher has read this assignment.
            // Default false = unread when first submitted.
            $table->boolean('is_read')->default(false)->after('file_path');
            $table->boolean('is_updated')->default(false)->after('is_read');
            $table->tinyInteger('revision_count')->default(0)->after('is_updated');
        });
    }

    public function down(): void
    {
        Schema::table('tugas', function (Blueprint $table) {
            $table->dropColumn('is_read');
            $table->dropColumn('is_updated');
            $table->dropColumn('revision_count');
        });
    }
};



<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tugas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // siswa/pengirim tugas
            $table->unsignedBigInteger('guru_id'); // referensi ke tabel guru
            $table->unsignedBigInteger('mapel_id'); // referensi ke tabel mapel
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();

            // foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('guru_id')->references('id')->on('guru')->onDelete('cascade');
            $table->foreign('mapel_id')->references('id')->on('mapel')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tugas');
    }
};
