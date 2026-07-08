<?php

declare(strict_types=1);

use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use App\Http\Middleware\EnsureTenantIsActive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Proktor\NilaiController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Admin\HeroSlideController;

Route::middleware([
    'web',
    InitializeTenancyBySubdomain::class,
    PreventAccessFromCentralDomains::class,
    EnsureTenantIsActive::class,
    \App\Http\Middleware\ShareTenantRouteDefaults::class,
])->prefix('api')->group(function () {

    // ── Auth info ──────────────────────────────────────────────────────────────
    Route::middleware('auth')->get('/user', function (Request $request) {
        return $request->user();
    });

    // ── Proktor — rekap nilai ──────────────────────────────────────────────────
    Route::middleware(['auth', 'role:proktor'])->group(function () {
        Route::get('/rekap-nilai',     [NilaiController::class, 'rekapNilai']);
        Route::get('/list-soal',       [NilaiController::class, 'listSoal']);
        Route::get('/list-mapel',      [NilaiController::class, 'listMapel']);
        Route::get('/list-kelas',      [NilaiController::class, 'listKelas']);
        Route::post('/rekap-filtered', [NilaiController::class, 'rekapFiltered']);
    });

    // ── Public routes (tanpa auth) ─────────────────────────────────────────────
    Route::prefix('v1')->group(function () {

        // Hero slides — dikonsumsi Vue HeroSection
        Route::get('/hero-slides', [HeroSlideController::class, 'publicIndex']);

        // Pendaftaran siswa baru
        Route::middleware('throttle:registration')->group(function () {
            Route::post('/registrations', [RegistrationController::class, 'store'])
                ->name('api.registrations.store');
        });
    });

    // ── Admin routes ───────────────────────────────────────────────────────────
    //
    // Pakai 'auth' (web session guard), bukan 'auth:sanctum'.
    // Halaman admin di-render via Inertia sehingga autentikasi berjalan
    // melalui session Laravel biasa — tidak perlu Sanctum handshake.
    //
    Route::prefix('v1/admin')
        ->middleware(['auth', 'role:admin'])
        ->name('api.admin.')
        ->group(function () {

            // Registrations
            Route::get('/registrations', [RegistrationController::class, 'index'])
                ->name('registrations.index');

            Route::patch('/registrations/{registration}/status', [RegistrationController::class, 'updateStatus'])
                ->name('registrations.update-status');

            // Hero Slides
            Route::get('/hero-slides',                [HeroSlideController::class, 'index']);
            Route::post('/hero-slides',               [HeroSlideController::class, 'store']);
            Route::put('/hero-slides/{heroSlide}',    [HeroSlideController::class, 'update']);
            Route::post('/hero-slides/{heroSlide}',   [HeroSlideController::class, 'update']); // _method=PUT
            Route::get('/hero-slides/{heroSlide}',    [HeroSlideController::class, 'show']);
            Route::delete('/hero-slides/{heroSlide}', [HeroSlideController::class, 'destroy']);
            Route::post('/hero-slides-reorder',       [HeroSlideController::class, 'reorder']);
        });
});