<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::command('subscriptions:expire-pending')->hourly();
Schedule::command('subscriptions:generate-renewal-invoices')->dailyAt('08:00');
Schedule::command('subscriptions:apply-pending-downgrades')->hourly();
Schedule::command('subscriptions:revert-expired-to-free')->hourly();
Schedule::command('subscriptions:cleanup-excess-users')->dailyAt('02:00');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');