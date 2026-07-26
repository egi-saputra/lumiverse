<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class SetRouteDomainDefault
{
    /**
     * Set parameter 'centralHost' sebagai default untuk generate URL/route,
     * supaya route('nama.route') di Vue (via Ziggy) atau di Blade/PHP
     * tidak perlu menyebutkan host secara manual setiap kali.
     */
    public function handle(Request $request, Closure $next)
    {
        URL::defaults(['centralHost' => $request->getHost()]);

        return $next($request);
    }
}