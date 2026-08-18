<?php

use Inertia\Inertia;
use App\Http\Controllers\Ai\AiBillingController;
use App\Http\Controllers\Ai\AiAgentController;
use App\Http\Controllers\Guru\{
    QuizController,
    QuestController,
    RekapNilaiController,
    ExamRoomController,
    AssignController,
    MaterialController,
    MaterialAiController,
    JournalController,
    WalasController,
    PresensiController,
    QuestAiController,
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
     * Route statis (create-ai, generate-ai, template, import, export, delete-all)
     * HARUS didefinisikan SEBELUM Route::resource() agar tidak tertangkap sebagai
     * {bank_soal} parameter.
     */

    // Generate soal via AI
    Route::get('/bank-soal/create-ai', [QuestAiController::class, 'createAi'])
        ->name('bank-soal.createAi');
    Route::post('/bank-soal/generate-ai', [QuestAiController::class, 'generateAi'])
        ->name('bank-soal.generateAi');
    Route::post('/bank-soal/generate-ai-status/{generationId}', [QuestAiController::class, 'generateAiStatus'])
        ->name('bank-soal.generateAiStatus');

    // Template download (GET statis)
    Route::get('/bank-soal/template', [QuestController::class, 'downloadTemplate'])
        ->name('bank-soal.template');

    // Import (POST statis)
    Route::post('/bank-soal/import', [QuestController::class, 'import'])
        ->name('bank-soal.import');

    // Delete all (DELETE dengan sub-path)
    Route::delete('/bank-soal/soal/{soal}/delete-all', [QuestController::class, 'destroyAll'])
        ->name('bank-soal.destroyAll');

    // Export soal berisi data (GET dengan sub-path)
    // WAJIB sebelum resource agar /bank-soal/soal/{id}/export
    // tidak terbaca sebagai resource show dengan bank_soal = "soal"
    Route::get('/bank-soal/soal/{soal_id}/export', [QuestController::class, 'exportSoal'])
        ->name('bank-soal.export');

    // Resource (terakhir — menangkap /bank-soal/{bank_soal}/...)
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
        Route::get('/create-ai', [MaterialAiController::class, 'createAi'])->name('material.createAi');
        Route::post('/generate-ai', [MaterialAiController::class, 'generateAi'])
            ->name('material.generateAi')
            ->middleware('throttle:10,1');
        Route::post('/generate-ai/status/{generationId}', [MaterialAiController::class, 'generateAiStatus'])
            ->name('material.generateAiStatus');
        Route::get('/ai-document-preview/{filename}', [MaterialAiController::class, 'previewDocument'])
            ->name('material.aiDocumentPreview');
        Route::post('/store', [MaterialController::class, 'store'])->name('material.store');
        Route::delete('/{material}', [MaterialController::class, 'destroy'])->name('material.destroy');
    });

    /** AI Billing — pricing, checkout, retry (AiBillingController) */
    Route::prefix('ai-billing')->name('ai-billing.')->group(function () {
        Route::get('/pricing', [AiBillingController::class, 'pricing'])->name('pricing');
        Route::post('/checkout', [AiBillingController::class, 'checkout'])->name('checkout');
        Route::post('/retry/{aiInvoice}', [AiBillingController::class, 'retryCheckout'])->name('retry');
    });

    /** AI Agent — dashboard, invoice, payment redirect (AiAgentController) */
    Route::prefix('ai-agent')->name('ai-agent.')->group(function () {
        Route::get('/dashboard', [AiAgentController::class, 'dashboard'])->name('dashboard');
        Route::get('/invoice/{externalId}', [AiAgentController::class, 'invoice'])->name('invoice');
        Route::get('/payment-success/{external_id}', [AiAgentController::class, 'paymentSuccess'])->name('payment-success');
        Route::get('/payment-failed/{external_id}', [AiAgentController::class, 'paymentFailed'])->name('payment-failed');
    });

});
