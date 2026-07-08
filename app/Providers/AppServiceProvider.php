<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Stancl\Tenancy\Events\TenancyInitialized;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Event::listen(TenancyInitialized::class, function ($event) {
            URL::defaults([
                'tenant' => $event->tenancy->tenant->id,
                'centralDomain' => config('tenancy.central_domain', env('CENTRAL_DOMAIN', 'localhost:8000')),
            ]);
        });
    }
}