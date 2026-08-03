<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class SetPartnerHostDefault
{
    public function handle(Request $request, Closure $next)
    {
        // Ini yang bikin Ziggy & route() di backend otomatis tahu domain
        // saat ini, tanpa perlu kita pass manual tiap panggil route().
        URL::defaults(['partnerHost' => $request->route('partnerHost')]);

        return $next($request);
    }
}