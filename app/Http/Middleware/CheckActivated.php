<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Siswa;

class CheckActivated
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check()) {
            $userId = Auth::id();

            // Ambil data siswa dari tabel siswa
            $siswa = Siswa::where('user_id', $userId)->first();

            // Jika tidak ditemukan atau status bukan 'Activated'
            if (!$siswa || strtolower($siswa->status) !== 'activated') {
                return redirect()->route('siswa.dashboard')
                    ->with('error', 'Akun anda belum diaktifkan!');
            }
        }

        return $next($request);
    }
}
