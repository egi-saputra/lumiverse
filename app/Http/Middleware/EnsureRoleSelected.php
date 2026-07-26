<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureRoleSelected
{
    private const FINAL_ROLES = ['admin', 'staff', 'proktor', 'guru', 'siswa', 'user'];

    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user && !in_array($user->role, self::FINAL_ROLES, true)) {
            if (!$request->routeIs('role.*') && !$request->routeIs('logout')) {
                return redirect()->route('role.select');
            }
        }

        return $next($request);
    }
}