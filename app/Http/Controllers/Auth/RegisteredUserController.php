<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            // 'tenant' => tenant('id'),
            // 'centralDomain' => env('CENTRAL_DOMAIN', 'localhost:8000'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', Rules\Password::defaults()],
        ]);

        // Cek kuota user berdasarkan max_users di tabel tenants
        $tenant = tenant();
        if ($tenant && $tenant->max_users !== null) {
            $currentCount = User::count();
            if ($currentCount >= $tenant->max_users) {
                throw ValidationException::withMessages([
                    'email' => "Kuota pengguna sudah penuh ({$tenant->max_users} akun). Hubungi administrator untuk upgrade paket.",
                ]);
            }
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role ?? 'siswa',
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect()
            ->route('siswa.dashboard')
            ->with('success', 'Your account has been created successfully.');
    }
}
