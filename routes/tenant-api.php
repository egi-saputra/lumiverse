<?php

declare(strict_types=1);

use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use App\Http\Middleware\EnsureTenantIsActive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Proktor\NilaiController;
use App\Http\Controllers\Api\Auth\SocialAuthController;

Route::middleware([
    'web',
    InitializeTenancyBySubdomain::class,
    PreventAccessFromCentralDomains::class,
    EnsureTenantIsActive::class,
    \App\Http\Middleware\ShareTenantRouteDefaults::class,
])->prefix('api')->group(function () {

    // ── Auth via social (tanpa auto-create) ─────────────────────────────────
    Route::post('/auth/social/login', [SocialAuthController::class, 'login']);

    // ── Auth info (pakai Sanctum, bukan session) ────────────────────────────
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/login', [MobileAuthController::class, 'login'])
    ->middleware('throttle:mobile-login');
    Route::post('/register', [MobileAuthController::class, 'register'])
        ->middleware('throttle:registration');
    Route::middleware('auth:sanctum')->post('/logout', [MobileAuthController::class, 'logout']);

    Route::middleware(['auth:sanctum', 'role:guru'])->prefix('guru')->group(function () {
        Route::get('/journal', [GuruJournalController::class, 'index']);
        Route::get('/journal/create', [GuruJournalController::class, 'create']);
        Route::get('/journal/history', [GuruJournalController::class, 'history']);
        Route::post('/journal', [GuruJournalController::class, 'store']);
        Route::get('/dashboard/insights', [GuruDashboardController::class, 'insights']);
    });

    Route::middleware(['auth:sanctum', 'role:siswa'])->prefix('siswa')->group(function () {
        Route::get('/dashboard', [SiswaDashboardController::class, 'index']);
    });

    // Pengumuman — dipakai semua role yang login (bukan cuma guru/siswa),
    // disambungkan ke ikon bell notifikasi di Navbar Expo.
    Route::middleware('auth:sanctum')->prefix('announcements')->group(function () {
        Route::get('/', [AnnouncementController::class, 'index']);
        Route::get('/{pengumuman}', [AnnouncementController::class, 'show']);
    });

    Route::middleware('auth:sanctum')->post('/push-tokens', [PushTokenController::class, 'store']);

    // Routes untuk Proktor
    Route::get('/rekap-nilai',     [NilaiController::class, 'rekapNilai']);
    Route::get('/list-soal',       [NilaiController::class, 'listSoal']);
    Route::get('/list-mapel',      [NilaiController::class, 'listMapel']);
    Route::get('/list-kelas',      [NilaiController::class, 'listKelas']);
    Route::post('/rekap-filtered', [NilaiController::class, 'rekapFiltered']);
});