<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::command('subscriptions:expire-pending')->hourly();
Schedule::command('subscriptions:generate-renewal-invoices')->dailyAt('08:00');
Schedule::command('subscriptions:apply-pending-downgrades')->hourly();
Schedule::command('subscriptions:revert-expired-to-free')->hourly();
Schedule::command('subscriptions:cleanup-excess-users')->dailyAt('02:00');
Schedule::command('ai-invoices:expire-stale')->everyFifteenMinutes();
Schedule::command('sitemap:generate')->daily();
Schedule::command('tenants:prune-journals')->twiceYearlyOn(1, 7, '00:05');
Schedule::command('tenants:prune-absensi')->twiceYearlyOn(1, 7, '00:10');
Schedule::command('tenants:reset-ujian')->twiceYearlyOn(1, 7, '00:15');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');