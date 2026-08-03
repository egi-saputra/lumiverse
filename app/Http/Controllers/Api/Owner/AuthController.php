<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantOwner;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        $owner = TenantOwner::where('email', $data['email'])->first();

        if (! $owner || ! Hash::check($data['password'], $owner->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 422);
        }

        Auth::guard('owner')->login($owner, $request->boolean('remember'));
        $request->session()->regenerate();

        return response()->json(['user' => $owner, 'token' => $owner->createToken('owner-api')->plainTextToken]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:tenant_owners,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $owner = TenantOwner::create([...$data, 'password' => Hash::make($data['password'])]);
        Auth::guard('owner')->login($owner);
        $request->session()->regenerate();

        return response()->json(['user' => $owner, 'token' => $owner->createToken('owner-api')->plainTextToken], 201);
    }

    public function googleLogin(Request $request)
    {
        $data = $request->validate(['token' => 'required|string']);
        $google = Socialite::driver('google')->stateless()->userFromToken($data['token']);
        $owner = TenantOwner::where('email', $google->getEmail())->first();

        if (! $owner) return response()->json(['message' => 'Akun owner belum terdaftar.'], 404);
        $owner->update(['google_id' => $google->getId()]);
        Auth::guard('owner')->login($owner, true);
        $request->session()->regenerate();

        return response()->json(['user' => $owner, 'token' => $owner->createToken('owner-api')->plainTextToken]);
    }

    public function googleRegister(Request $request)
    {
        $data = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'phone' => 'nullable|string|max:20',
            'token' => 'required|string',
        ]);
        $google = Socialite::driver('google')->stateless()->userFromToken($data['token']);

        if (TenantOwner::where('email', $google->getEmail())->exists()) {
            return response()->json(['message' => 'Email owner sudah terdaftar.'], 422);
        }

        $owner = TenantOwner::create([
            'tenant_id' => $data['tenant_id'], 'name' => $google->getName() ?: $google->getEmail(),
            'email' => $google->getEmail(), 'phone' => $data['phone'] ?? null,
            'google_id' => $google->getId(), 'password' => Hash::make(Str::random(40)),
        ]);
        Auth::guard('owner')->login($owner, true);
        $request->session()->regenerate();

        return response()->json(['user' => $owner, 'token' => $owner->createToken('owner-api')->plainTextToken], 201);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        Password::broker('tenant_owners')->sendResetLink(['email' => $request->email]);
        return response()->json(['message' => 'Jika email terdaftar, instruksi reset password telah dikirim.']);
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate(['token' => 'required', 'email' => 'required|email', 'password' => 'required|min:8|confirmed']);
        $status = Password::broker('tenant_owners')->reset($data, function (TenantOwner $owner, string $password) {
            $owner->forceFill(['password' => Hash::make($password), 'remember_token' => Str::random(60)])->save();
            event(new PasswordReset($owner));
        });
        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password berhasil diubah.'])
            : response()->json(['message' => __($status)], 422);
    }
}
