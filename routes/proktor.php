<?php

use Inertia\Inertia;
use App\Http\Controllers\Proktor\{
    PesertaUjianController,
    PesertaController,
    SoalController,
    BankSoalController,
    RuangUjianController,
    NilaiController
};

// Semua route guru, pakai auth, verified dan role guru
Route::middleware(['auth', 'verified', 'role:proktor'])->prefix('proktor')->name('proktor.')->group(function () {

        /** Register Peserta */
        Route::get('/peserta/register', [PesertaUjianController::class, 'showForm'])
        ->name('peserta.register.show');
        
        Route::post('/peserta/register', [PesertaUjianController::class, 'store'])
        ->name('peserta.register.store');

        Route::get('/peserta/template', [PesertaUjianController::class, 'downloadTemplate'])->name('peserta.template');
        
        Route::post('/peserta/import', [PesertaUjianController::class, 'importExcel'])->name('peserta.import');
        
        /** Halaman daftar peserta */
        Route::delete('/peserta/destroy-all', [PesertaUjianController::class, 'destroyAll'])
            ->name('peserta.destroyAll');

        Route::get('/peserta', [PesertaUjianController::class, 'index'])
            ->name('peserta.index');

        Route::put('/peserta/{id}', [PesertaUjianController::class, 'update'])
            ->name('peserta.update');

        Route::delete('/peserta/{id}', [PesertaUjianController::class, 'destroy'])
            ->name('peserta.destroy');
            

        // ===== SISWA =====
        Route::resource('siswa', PesertaController::class)
            ->except(['show']);


        /** Soal */
        Route::resource('soal', SoalController::class);
        Route::put('/soal/{soal}/update-nilai', [SoalController::class, 'updateNilai']);

        /** Bank Soal */
        Route::get('/bank-soal/template', [BankSoalController::class, 'downloadTemplate'])
            ->name('bank-soal.template');

        Route::post('/bank-soal/import', [BankSoalController::class, 'import'])
            ->name('bank-soal.import');

        Route::delete('/bank-soal/soal/{soal}/delete-all', [BankSoalController::class, 'destroyAll'])
            ->name('bank-soal.destroyAll');

        Route::get('/bank-soal/soal/{soal_id}/export', [BankSoalController::class, 'exportSoal'])->name('bank-soal.export');
            
        Route::resource('bank-soal', BankSoalController::class);

        Route::delete('/ruang-ujian/peserta/destroy-all', [RuangUjianController::class, 'destroyAll']);

        Route::get('/ruang-ujian/peserta', [RuangUjianController::class, 'peserta'] )
            ->name('ruangUjian.peserta');

        Route::get('/ruang-ujian', [RuangUjianController::class, 'index'])
            ->name('ruangUjian.index');

        Route::get('/ruang-ujian/peserta/refresh-all', [RuangUjianController::class, 'refreshAll']);

        // Ambil data token terbaru
        Route::get('/ruang-ujian/peserta/{peserta}/refresh-token', [RuangUjianController::class, 'refreshToken'])->name('ruangUjian.refreshToken');

        // Delete peserta AJAX
        Route::delete('/ruang-ujian/peserta/{peserta}', [RuangUjianController::class, 'destroyPeserta'])
            ->name('ruangUjian.destroyPeserta');

        // Rekap Nilai Ujian Siswa
        Route::get('/rekap-nilai', [NilaiController::class, 'index'])
            ->name('nilai.index');

        // Hapus rekap nilai berdasarkan filter
        Route::delete('/rekap-nilai/destroy', [NilaiController::class, 'destroyRekap'])
            ->name('nilai.destroyRekap');

    });
