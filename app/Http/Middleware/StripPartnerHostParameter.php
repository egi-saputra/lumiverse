<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class StripPartnerHostParameter
{
    /**
     * Hapus parameter 'partnerHost' dari route SETELAH SetPartnerHostDefault
     * sempat membacanya (untuk URL::defaults()), supaya parameter ini tidak
     * ikut kehitung sebagai argumen posisi saat Laravel resolve method
     * controller — mencegah dia "menggeser" parameter route model binding
     * lain (mis. {bankAccount}) jadi salah posisi.
     */
    public function handle(Request $request, Closure $next)
    {
        $request->route()?->forgetParameter('partnerHost');

        return $next($request);
    }
}