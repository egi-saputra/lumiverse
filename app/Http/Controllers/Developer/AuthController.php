<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Developer;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Tampilkan halaman login developer.
     */
    public function showLogin(): Response
    {
        return Inertia::render('Developer/Login');
    }

    /**
     * Proses login developer.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('developer')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended(route('developer.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->onlyInput('email');
    }

    /**
     * Tampilkan halaman register developer.
     *
     * CATATAN PENTING: hapus/nonaktifkan route ini setelah akun pertama
     * kamu berhasil dibuat. Jangan biarkan terbuka publik di production.
     */
    public function showRegister(): Response
    {
        return Inertia::render('Developer/Register');
    }

    /**
     * Proses register developer.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:developers,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $developer = Developer::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        Auth::guard('developer')->login($developer);

        return redirect()->route('developer.dashboard');
    }

    /**
     * Logout developer.
     */
    public function logout(Request $request)
    {
        Auth::guard('developer')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('developer.login');
    }

    /**
     * Dashboard developer — list semua tenant lengkap dengan status, kuota, dan jumlah user.
     */
    public function dashboard(): Response
    {
        return Inertia::render('Developer/Dashboard');
    }
}