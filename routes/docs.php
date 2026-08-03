<?php

declare(strict_types=1);

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$docsDomains = ['docs.localhost', 'docs.lumiverse.co.id'];

Route::domain('{docsHost}')
    ->where(['docsHost' => implode('|', array_map('preg_quote', $docsDomains))])
    ->middleware('web')
    ->group(function () {
        Route::get('/', function () {
            return Inertia::render('Docs/Index', [
                'laravelVersion' => Application::VERSION,
            ]);
        })->name('docs.index');
    });
