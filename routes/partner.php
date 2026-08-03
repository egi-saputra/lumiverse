<?php

declare(strict_types=1);

use App\Http\Controllers\Partner\AuthController as PartnerAuthController;
use App\Http\Controllers\Partner\BankAccountController;
use App\Http\Controllers\Partner\DeviceBiometricController;
use App\Http\Controllers\Partner\DeviceController;
use App\Http\Controllers\Partner\DevicePinController;
use App\Http\Controllers\Partner\PayoutController;
use App\Http\Controllers\Partner\ReferralController;
use App\Http\Controllers\Partner\StepUpController;
use App\Http\Controllers\Webhooks\XenditPayoutWebhookController;
use App\Http\Middleware\SetPartnerHostDefault;
use App\Http\Middleware\StripPartnerHostParameter;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rute khusus subdomain Partner (partner.localhost / partner.lumiverse.co.id)
|--------------------------------------------------------------------------
| Dipisah dari web.php supaya semua yang berkaitan dengan partner —
| landing, auth, dashboard, device/PIN/biometric, payout — ada di satu
| tempat dan gampang di-scan tanpa nyampur ke domain lain.
*/

$partnerDomains = ['partner.localhost', 'partner.lumiverse.co.id'];

Route::domain('{partnerHost}')
    ->where(['partnerHost' => implode('|', array_map('preg_quote', $partnerDomains))])
    ->middleware(['web', SetPartnerHostDefault::class, StripPartnerHostParameter::class])
    ->group(function () {
        require __DIR__ . '/partner-api.php';

        Route::get('/', function () {
            return Inertia::render('Home/Partner', [
                'laravelVersion' => Application::VERSION,
                'phpVersion' => PHP_VERSION,
            ]);
        })->name('home.partner');

        Route::name('partner.')->group(function () {
            Route::middleware('guest:partner')->group(function () {
                Route::get('/auth/google/token', [PartnerAuthController::class, 'loginWithGoogleToken'])->name('google.token');
                Route::get('/login', [PartnerAuthController::class, 'showLogin'])->name('login');
                Route::post('/login', [PartnerAuthController::class, 'login'])->name('login.store');
                Route::get('/register', [PartnerAuthController::class, 'showRegister'])->name('register');
                Route::post('/register', [PartnerAuthController::class, 'register'])->name('register.store');

                // Halaman "Lupa Password" — form input email, terpisah dari
                // form login (bukan lagi kolom inline yang muncul di halaman
                // login). Submit-nya lewat axios ke /api/partner/auth/forgot-password.
                Route::get('/forgot-password', function () {
                    return Inertia::render('Partner/ForgotPassword');
                })->name('forgot-password');

                // Halaman yang dibuka dari link di email "Reset Password".
                // Token & email datang lewat query string (?token=...&email=...)
                // lalu dikirim balik ke POST /api/partner/auth/reset-password
                // dari sisi Vue (ResetPassword.vue).
                Route::get('/reset-password', function (\Illuminate\Http\Request $request) {
                    return Inertia::render('Partner/ResetPassword', [
                        'token' => $request->query('token'),
                        'email' => $request->query('email'),
                    ]);
                })->name('reset-password');
            });

            Route::middleware('auth:partner')->group(function () {
                Route::get('/dashboard', [PartnerAuthController::class, 'dashboard'])->name('dashboard');
                Route::post('/logout', [PartnerAuthController::class, 'logout'])->name('logout');
                Route::get('/referral', [ReferralController::class, 'index'])->name('referral.index');
                Route::patch('/referral/code', [ReferralController::class, 'updateCode'])
                    ->name('referral.update-code');

                // Hanya route BACA di sini. Aksi yang mengubah state sensitif
                // (store / setPrimary / destroy / payout store) ada di bawah,
                // di dalam group yang mewajibkan step-up token.
                Route::prefix('bank-accounts')->name('bank-accounts.')->group(function () {
                    Route::get('/', [BankAccountController::class, 'index'])->name('index');
                });

                Route::prefix('payout')->name('payout.')->group(function () {
                    Route::get('/', [PayoutController::class, 'index'])->name('index');
                });

                // ── Device / PIN / Biometric ─────────────────────────
                Route::prefix('devices')->name('devices.')->group(function () {
                    Route::post('/', [DeviceController::class, 'register'])->name('register');
                    Route::delete('/{device}', [DeviceController::class, 'revoke'])->name('revoke');

                    Route::post('/{device}/pin', [DevicePinController::class, 'store'])->name('pin.store');
                    Route::post('/{device}/pin/verify', [DevicePinController::class, 'verify'])->name('pin.verify');

                    Route::post('/{device}/biometric', [DeviceBiometricController::class, 'store'])->name('biometric.store');
                    Route::post('/{device}/biometric/challenge', [DeviceBiometricController::class, 'challenge'])->name('biometric.challenge');
                    Route::post('/{device}/biometric/verify', [DeviceBiometricController::class, 'verify'])->name('biometric.verify');

                    Route::post('/{device}/step-up/challenge', [StepUpController::class, 'challenge'])->name('step-up.challenge');
                    Route::post('/{device}/step-up/verify', [StepUpController::class, 'verify'])->name('step-up.verify');
                });
            });

            // ── Aksi sensitif — wajib step-up token valid (lihat middleware 'stepup') ──
            // Semua endpoint yang mengubah rekening bank (tambah/jadikan primary/hapus)
            // dan yang mencairkan dana WAJIB lewat sini. Nama route sengaja dibuat
            // identik dengan sebelumnya (partner.bank-accounts.store, dst) supaya
            // route(...) di sisi Vue tidak perlu diubah.
            Route::middleware(['auth:partner', 'stepup'])->group(function () {
                Route::post('/bank-accounts', [BankAccountController::class, 'store'])->name('bank-accounts.store');
                Route::patch('/bank-accounts/{bankAccount}/primary', [BankAccountController::class, 'setPrimary'])->name('bank-accounts.primary');
                Route::delete('/bank-accounts/{bankAccount}', [BankAccountController::class, 'destroy'])->name('bank-accounts.destroy');
                Route::post('/payout', [PayoutController::class, 'store'])->name('payout.store');
            });

            Route::post('/webhooks/xendit/payout', [XenditPayoutWebhookController::class, 'handle'])
                ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class])
                ->name('webhooks.xendit.payout');
        });
    });