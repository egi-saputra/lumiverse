<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class ShareTenantRouteDefaults
{
    public function handle(Request $request, Closure $next)
    {
        if (tenant()) {
            URL::defaults([
            'tenant' => tenant('id'),
            'centralDomain' => env('CENTRAL_DOMAIN', 'localhost:8000'),
            ]);
        }

        // Hapus parameter domain dari route agar tidak ikut
        // di-passing sebagai argumen posisi ke controller method.
        // Tanpa ini, setiap method controller yang menerima route-model-binding
        // harus mendeklarasikan $tenant dan $centralDomain di depan parameter model,
        // karena Laravel menyusun argumen method berdasarkan urutan parameter route.
        $route = $request->route();
        if ($route) {
            $route->forgetParameter('tenant');
            $route->forgetParameter('centralDomain');
        }

        return $next($request);
    }
}