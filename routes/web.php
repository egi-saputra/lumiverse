<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Developer\AuthController;
use App\Http\Controllers\Developer\PlanController;
use App\Http\Controllers\Developer\TenantController;
use App\Http\Controllers\TenantRegistrationController;
use App\Http\Controllers\Owner\AuthController as AdminAuthController;
use App\Http\Controllers\Owner\ProfilController;
use App\Http\Controllers\Owner\UserController;
use App\Http\Controllers\Owner\PricingController;
use App\Http\Controllers\Owner\SubscriptionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$centralDomains = config('tenancy.central_domains');

Route::domain('{domain}')
    ->where(['domain' => implode('|', array_map('preg_quote', $centralDomains))])
    ->middleware(['web'])
    ->group(function () {

        Route::get('/', function () {
            return Inertia::render('Landing/Home', [
                'laravelVersion' => Application::VERSION,
                'phpVersion' => PHP_VERSION,
            ]);
        });

        Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect.central');
        Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback.central');

        Route::prefix('developer')->name('developer.')->group(function () {
            Route::middleware('guest:developer')->group(function () {
                Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
                Route::post('/login', [AuthController::class, 'login']);
                Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
                Route::post('/register', [AuthController::class, 'register']);
            });

            Route::middleware('auth:developer')->group(function () {
                Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');
                Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

                Route::get('/tenants', [TenantController::class, 'index'])->name('tenants.index');
                Route::get('/tenants/{tenant}', [TenantController::class, 'show'])->name('tenants.show');
                Route::get('/tenants/{tenant}/edit', [TenantController::class, 'edit'])->name('tenants.edit');
                Route::put('/tenants/{tenant}', [TenantController::class, 'update'])->name('tenants.update');
                Route::post('/tenants/{tenant}/toggle', [TenantController::class, 'toggle'])->name('tenants.toggle');
                Route::delete('/tenants/{tenant}', [TenantController::class, 'destroy'])->name('tenants.delete');

                Route::get('/plans', [PlanController::class, 'index'])->name('plans.index');
                Route::post('/plans', [PlanController::class, 'store'])->name('plans.store');
                Route::post('/plans/reorder', [PlanController::class, 'reorder'])->name('plans.reorder');
                Route::put('/plans/{plan}', [PlanController::class, 'update'])->name('plans.update');
                Route::delete('/plans/{plan}', [PlanController::class, 'destroy'])->name('plans.destroy');
            });
        });

        Route::prefix('lumiverse')->name('owner.')->group(function () {
            Route::middleware('guest:owner')->group(function () {
                Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
                Route::post('/login', [AdminAuthController::class, 'login']);
            });

            Route::middleware('auth:owner')->group(function () {
                Route::get('/dashboard', [AdminAuthController::class, 'dashboard'])->name('dashboard');
                Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
                Route::get('/profil', [ProfilController::class, 'edit'])->name('profil');
                Route::post('/update/profile', [ProfilController::class, 'updateProfile'])->name('update.profile');
                Route::patch('/update/account', [ProfilController::class, 'updateAccount'])->name('update.account');

                Route::prefix('users')->name('users.')->group(function () {
                    Route::get('/', [UserController::class, 'index'])->name('index');
                    Route::get('/create', [UserController::class, 'create'])->name('create');
                    Route::post('/', [UserController::class, 'store'])->name('store');
                    Route::get('/{id}', [UserController::class, 'show'])->name('show');
                    Route::get('/{id}/edit', [UserController::class, 'edit'])->name('edit');
                    Route::put('/{id}', [UserController::class, 'update'])->name('update');
                    Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
                });

                Route::get('/pricing', [PricingController::class, 'index'])->name('pricing');

                Route::post('/subscription/preview', [SubscriptionController::class, 'preview'])->name('subscription.preview');
                Route::post('/subscription/charge', [SubscriptionController::class, 'charge'])->name('subscription.charge');
                Route::post('/subscription/cancel-downgrade', [SubscriptionController::class, 'cancelDowngrade'])->name('subscription.cancel-downgrade');
                Route::get('/subscription/finish', [SubscriptionController::class, 'finish'])->name('subscription.finish');
                Route::get('/subscription/history', [SubscriptionController::class, 'history'])->name('subscription.history');
                Route::get('/subscription/invoice/{order_id}', [SubscriptionController::class, 'invoice'])->name('subscription.invoice');
                Route::post('/subscription/retry/{order_id}', [SubscriptionController::class, 'retryPayment'])->name('subscription.retry');
                Route::post('/subscription/cancel-order/{order_id}', [SubscriptionController::class, 'cancelOrder'])->name('subscription.cancel-order');
                Route::get('/subscription/order-preview/{order_id}', [SubscriptionController::class, 'orderPreview'])->name('subscription.order-preview');
            });

            Route::post('/subscription/webhook', [SubscriptionController::class, 'webhook'])->name('subscription.webhook');
        });

        Route::get('/registration', [TenantRegistrationController::class, 'create'])
            ->name('tenant.register.form');

        Route::post('/registration', [TenantRegistrationController::class, 'store'])
            ->middleware('throttle:5,1')
            ->name('tenant.register');

        Route::post('/registration/suggest-subdomain', [TenantRegistrationController::class, 'suggestSubdomain'])
            ->name('tenant.suggest-subdomain');
    });