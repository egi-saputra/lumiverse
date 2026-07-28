<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = tenant();

        if ($tenant && ! $tenant->isCurrentlyActive()) {
            return Inertia::render('Tenant/Inactive', [
                'schoolName' => $tenant->name,
            ])
                ->toResponse($request)
                ->setStatusCode(403);
        }

        return $next($request);
    }
}