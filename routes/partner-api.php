<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Partner\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->prefix('api/partner/auth')->name('api.partner.auth.')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('guest:partner')->name('login');

    // Alur login pakai kode verifikasi (passwordless) — dipanggil di step
    // "email" sebelum masuk ke step "code" pada Login.vue. send-code SELALU
    // balas sukses generik, terlepas email tsb terdaftar atau belum, supaya
    // tidak membocorkan status akun (account enumeration).
    Route::post('/login/send-code', [AuthController::class, 'sendLoginCode'])->middleware(['guest:partner', 'throttle:6,1'])->name('login.send-code');
    Route::post('/login/verify-code', [AuthController::class, 'verifyLoginCode'])->middleware(['guest:partner', 'throttle:10,1'])->name('login.verify-code');
    // Step lanjutan setelah kode terverifikasi & akun belum ada — bikin akun +
    // set password, lalu login. Dipanggil dari step "password" di Login.vue
    // khusus untuk kasus isNewAccount.
    Route::post('/register/complete', [AuthController::class, 'completeRegistration'])->middleware(['guest:partner', 'throttle:10,1'])->name('register.complete');

    Route::post('/register', [AuthController::class, 'register'])->middleware('guest:partner')->name('register');
    Route::post('/google/login', [AuthController::class, 'googleLogin'])->middleware('guest:partner')->name('google.login');
    Route::post('/google/register', [AuthController::class, 'googleRegister'])->middleware('guest:partner')->name('google.register');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('guest:partner')->name('password.email');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('guest:partner')->name('password.reset');
});