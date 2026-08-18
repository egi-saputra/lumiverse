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

    // ── Proktor — rekap nilai (update ke sanctum juga) ──────────────────────
    Route::middleware(['auth:sanctum', 'role:proktor'])->group(function () {
        Route::get('/rekap-nilai',     [NilaiController::class, 'rekapNilai']);
        Route::get('/list-soal',       [NilaiController::class, 'listSoal']);
        Route::get('/list-mapel',      [NilaiController::class, 'listMapel']);
        Route::get('/list-kelas',      [NilaiController::class, 'listKelas']);
        Route::post('/rekap-filtered', [NilaiController::class, 'rekapFiltered']);
    });
});