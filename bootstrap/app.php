<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\SetRouteDomainDefault::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'lumiverse/subscription/webhook',
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'check.siswa.data' => \App\Http\Middleware\CheckSiswaData::class,
            'activated' => \App\Http\Middleware\CheckActivated::class,
            'backup.ujian' => \App\Http\Middleware\BackupJawabanUjian::class,
        ]);

        $middleware->redirectUsersTo(function (Illuminate\Http\Request $request) {
            if (Illuminate\Support\Facades\Auth::guard('owner')->check()) {
                return route('owner.dashboard');
            }

            if (Illuminate\Support\Facades\Auth::guard('developer')->check()) {
                return route('developer.dashboard');
            }

            return route('dashboard'); // fallback untuk guard 'web' biasa (tenant)
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
