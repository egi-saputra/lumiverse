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
Schedule::command('school:reset-journal-attendance')->cron('5 0 1 1,7 *');
schedule::command('ai-invoices:expire-stale')->everyFifteenMinutes();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');