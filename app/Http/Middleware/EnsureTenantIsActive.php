<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = tenant();

        if ($tenant && ! $tenant->isCurrentlyActive()) {
            abort(403, 'Akses sekolah ini sudah tidak aktif. Silakan hubungi admin Lumiverse School untuk informasi lebih lanjut.');
        }

        return $next($request);
    }
}