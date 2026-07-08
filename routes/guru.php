<?php

use Inertia\Inertia;
use App\Http\Controllers\Guru\{
    QuizController,
    QuestController,
    RekapNilaiController,
    ExamRoomController,
    AssignController,
    MaterialController,
    JournalController,
    WalasController,
    PresensiController,
    // AbsensiAnalyticsController
};

// Semua route guru, pakai auth, verified dan role guru
Route::middleware(['auth', 'verified', 'role:guru'])->prefix('guru')->name('guru.')->group(function () {

    /** Soal / Quiz */
    Route::resource('soal', QuizController::class);
    // Route::resource('/walas', WalasController::class);
    Route::resource('/journal', JournalController::class);

    Route::prefix('walas')->name('walas.')->group(function () {
        Route::get('/',                    [WalasController::class, 'index'])   ->name('index');
        Route::put('/{siswa}',             [WalasController::class, 'update'])  ->name('update');
        Route::delete('/{siswa}',          [WalasController::class, 'destroy']) ->name('destroy');
    });

    Route::prefix('absensi')->name('absensi.')->group(function () {
            Route::get('/', [PresensiController::class, 'index'])   ->name('index');
            Route::post('/', [PresensiController::class, 'store'])   ->name('store');
            Route::put('/{absensi}', [PresensiController::class, 'update'])  ->name('update');
            Route::delete('/{absensi}', [PresensiController::class, 'destroy']) ->name('destroy');
            Route::get('/rekap', [PresensiController::class, 'rekap'])   ->name('rekap');

            // Route::get('/analytics', [AbsensiAnalyticsController::class, 'index'])
            // ->name('analytics');
        });


    /** Bank Soal / Quest ─────────────────────────────────────────────────────────
     *
     * URUTAN ROUTE INI SANGAT PENTING:
     * Route statis (template, import, export, delete-all) HARUS didefinisikan
     * SEBELUM Route::resource() agar tidak tertangkap sebagai {bank_soal} parameter.
     *
     */
    
    // 1. Template download (GET statis)
    Route::get('/bank-soal/template', [QuestController::class, 'downloadTemplate'])
        ->name('bank-soal.template');
    
    // 2. Import (POST statis)
    Route::post('/bank-soal/import', [QuestController::class, 'import'])
        ->name('bank-soal.import');
    
    // 3. Delete all (DELETE dengan sub-path)
    Route::delete('/bank-soal/soal/{soal}/delete-all', [QuestController::class, 'destroyAll'])
        ->name('bank-soal.destroyAll');
    
    // 4. Export soal berisi data (GET dengan sub-path)
    //    WAJIB sebelum resource agar /bank-soal/soal/{id}/export
    //    tidak terbaca sebagai resource show dengan bank_soal = "soal"
    Route::get('/bank-soal/soal/{soal_id}/export', [QuestController::class, 'exportSoal'])
        ->name('bank-soal.export');
    
    // 5. Resource (terakhir — menangkap /bank-soal/{bank_soal}/...)
    Route::resource('bank-soal', QuestController::class);

    /** Rekap Nilai Ujian Siswa */
    Route::get('/rekap-nilai', [RekapNilaiController::class, 'index'])
    ->name('NilaiUjian.index');

    /** Rekap Nilai API untuk Vue */
    Route::get('/list-soal', [RekapNilaiController::class, 'listSoal']);
    Route::get('/list-mapel', [RekapNilaiController::class, 'listMapel']);
    Route::get('/list-kelas', [RekapNilaiController::class, 'listKelas']);
    Route::post('/rekap-filtered', [RekapNilaiController::class, 'rekapFiltered']);

    /** Ruang Ujian - daftar peserta */
    Route::get('/ruang-ujian', [ExamRoomController::class, 'index'])
        ->name('ruangUjian.index');

    /** Ambil data token terbaru */
    Route::get('/ruang-ujian/peserta/{peserta}/refresh-token', [ExamRoomController::class, 'refreshToken'])
        ->name('ruangUjian.refreshToken');

    /** Delete peserta AJAX */
    Route::delete('/ruang-ujian/peserta/{peserta}', [ExamRoomController::class, 'destroyPeserta'])
        ->name('ruangUjian.destroyPeserta');

    Route::get('/assignment', [AssignController::class, 'index'])->name('assignment.index');

    Route::post('/assignment/mark-all-read', [AssignController::class, 'markAllRead'])->name('assignment.markAllRead');

    Route::get('/assignment/{assignment}', [AssignController::class, 'show'])->name('assignment.show');

    Route::prefix('material')->group(function () {
            Route::get('/', [MaterialController::class, 'index'])->name('material.index');
            Route::get('/create', [MaterialController::class, 'create'])->name('material.create');
            Route::post('/store', [MaterialController::class, 'store'])->name('material.store');
            Route::delete('/{material}', [MaterialController::class, 'destroy'])->name('material.destroy');
        });

});
