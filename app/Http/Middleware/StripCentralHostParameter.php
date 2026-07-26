<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StripCentralHostParameter
{
    public function handle(Request $request, Closure $next): Response
    {
        $route = $request->route();

        if ($route && $route->hasParameter('centralHost')) {
            $route->forgetParameter('centralHost');
        }

        return $next($request);
    }
}