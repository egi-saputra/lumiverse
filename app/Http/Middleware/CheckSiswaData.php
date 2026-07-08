<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckSiswaData
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Cek apakah user login
        $user = Auth::user();

        if ($user && $user->role === 'siswa') { // pastikan ini siswa
            // Cek apakah sudah punya data di tabel siswa
            $siswaExists = \App\Models\Siswa::where('user_id', $user->id)->exists();

            if (!$siswaExists) {
                // Redirect ke form create siswa
                return redirect()->route('siswa.form.create');
            }
        }

        return $next($request);
    }
}
