<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
    //     dd(
    //     tenant('logo_path'),
    //     Storage::disk('central_public')->exists(tenant('logo_path')),
    //     Storage::disk('central_public')->url(tenant('logo_path'))
    // );

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $remember = $request->boolean('remember');

        $request->authenticate($remember);
        $request->session()->regenerate();

        $user = Auth::user();

        $redirectUrl = match ($user->role) {
            'admin' => '/admin/dashboard',
            'proktor' => '/proktor/dashboard',
            'guru' => '/guru/dashboard',
            'user' => '/user/dashboard',
            'siswa' => '/siswa/dashboard',
            'user' => '/user/dashboard',
            default => '/user/dashboard',
        };

        return redirect()->intended($redirectUrl);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
