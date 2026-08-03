<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Owner\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->prefix('api/owner/auth')->name('api.owner.auth.')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('guest:owner')->name('login');
    Route::post('/register', [AuthController::class, 'register'])->middleware('guest:owner')->name('register');
    Route::post('/google/login', [AuthController::class, 'googleLogin'])->middleware('guest:owner')->name('google.login');
    Route::post('/google/register', [AuthController::class, 'googleRegister'])->middleware('guest:owner')->name('google.register');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('guest:owner')->name('password.email');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('guest:owner')->name('password.reset');
});
