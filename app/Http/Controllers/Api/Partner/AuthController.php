<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Partner;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Notifications\PartnerLoginCodeNotification;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        $partner = Partner::where('email', $data['email'])->first();
        if (! $partner || ! Hash::check($data['password'], $partner->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 422);
        }

        Auth::guard('partner')->login($partner, $request->boolean('remember'));
        $request->session()->regenerate();

        return response()->json(['user' => $partner, 'token' => $partner->createToken('partner-api')->plainTextToken]);
    }

    public function sendLoginCode(Request $request)
    {
        $data = $request->validate(['email' => 'required|email']);

        $email = Str::lower($data['email']);
        $code = (string) random_int(100000, 999999);

        Cache::put(
            'partner:login-code:' . $email,
            Hash::make($code),
            now()->addMinutes(10)
        );

        $partner = Partner::where('email', $email)->first();
        if ($partner) {
            $partner->notify(new PartnerLoginCodeNotification($code));
        } else {
            Notification::route('mail', $email)->notify(new PartnerLoginCodeNotification($code));
        }

        return response()->json([
            'message' => 'Kode verifikasi telah dikirim ke email Anda.',
            'is_new' => is_null($partner),
        ]);
    }

    public function verifyLoginCode(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
            'remember' => 'nullable|boolean',
        ]);

        $email = Str::lower($data['email']);
        $cacheKey = 'partner:login-code:' . $email;
        $hashedCode = Cache::get($cacheKey);

        if (! $hashedCode || ! Hash::check($data['code'], $hashedCode)) {
            throw ValidationException::withMessages([
                'code' => 'Kode verifikasi salah atau sudah kedaluwarsa.',
            ]);
        }

        Cache::forget($cacheKey);

        $partner = Partner::where('email', $email)->first();

        // Akun sudah ada -> ini alur LOGIN passwordless, langsung login.
        if ($partner) {
            if (is_null($partner->email_verified_at)) {
                $partner->forceFill(['email_verified_at' => now()])->save();
            }

            Auth::guard('partner')->login($partner, (bool) ($data['remember'] ?? false));
            $request->session()->regenerate();

            return response()->json(['message' => 'Login berhasil.', 'is_new' => false]);
        }

        // Akun belum ada -> ini alur REGISTER. Kode benar, tapi akun BELUM dibuat
        // & user BELUM login. Simpan penanda "email ini sudah lolos verifikasi"
        // beberapa menit, supaya completeRegistration() nanti bisa membuat akun
        // tanpa minta kode itu lagi setelah user isi password.
        Cache::put('partner:register-verified:' . $email, true, now()->addMinutes(15));

        return response()->json(['message' => 'Email terverifikasi. Silakan buat kata sandi.', 'is_new' => true]);
    }

    public function completeRegistration(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
            'remember' => 'nullable|boolean',
        ]);

        $email = Str::lower($data['email']);
        $verifiedKey = 'partner:register-verified:' . $email;

        if (! Cache::get($verifiedKey)) {
            throw ValidationException::withMessages([
                'code' => 'Verifikasi email sudah kedaluwarsa. Silakan ulangi proses dari awal.',
            ]);
        }

        if (Partner::where('email', $email)->exists()) {
            Cache::forget($verifiedKey);
            throw ValidationException::withMessages([
                'email' => 'Email sudah terdaftar. Silakan login.',
            ]);
        }

        Cache::forget($verifiedKey);

        $partner = Partner::create([
            'name' => Str::before($email, '@'),
            'email' => $email,
            'password' => Hash::make($data['password']),
            'referral_code' => Partner::generateUniqueReferralCode(),
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Auth::guard('partner')->login($partner, (bool) ($data['remember'] ?? false));
        $request->session()->regenerate();

        return response()->json(['message' => 'Akun berhasil dibuat.']);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:partners,email',
            'phone' => 'nullable|string|max:20|unique:partners,phone',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $partner = Partner::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'referral_code' => Partner::generateUniqueReferralCode(),
            'is_active' => true,
        ]);

        Auth::guard('partner')->login($partner);
        $request->session()->regenerate();

        return response()->json(['user' => $partner, 'token' => $partner->createToken('partner-api')->plainTextToken], 201);
    }

    public function googleLogin(Request $request)
    {
        $data = $request->validate(['token' => 'required|string']);
        $google = Socialite::driver('google')->stateless()->userFromToken($data['token']);
        $partner = Partner::where('email', $google->getEmail())->first();
        if (! $partner) return response()->json(['message' => 'Akun partner belum terdaftar.'], 404);
        $partner->update(['google_id' => $google->getId(), 'avatar' => $google->getAvatar() ?? $partner->avatar]);
        Auth::guard('partner')->login($partner, true);
        $request->session()->regenerate();
        return response()->json(['user' => $partner, 'token' => $partner->createToken('partner-api')->plainTextToken]);
    }

    public function googleRegister(Request $request)
    {
        $data = $request->validate(['token' => 'required|string', 'phone' => 'nullable|string|max:20|unique:partners,phone']);
        $google = Socialite::driver('google')->stateless()->userFromToken($data['token']);
        if (Partner::where('email', $google->getEmail())->exists()) return response()->json(['message' => 'Email partner sudah terdaftar.'], 422);
        $partner = Partner::create(['name' => $google->getName() ?: $google->getEmail(), 'email' => $google->getEmail(), 'phone' => $data['phone'] ?? null, 'google_id' => $google->getId(), 'avatar' => $google->getAvatar(), 'password' => Hash::make(Str::random(40)), 'referral_code' => Partner::generateUniqueReferralCode(), 'is_active' => true]);
        Auth::guard('partner')->login($partner, true);
        $request->session()->regenerate();
        return response()->json(['user' => $partner, 'token' => $partner->createToken('partner-api')->plainTextToken], 201);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        Password::broker('partners')->sendResetLink(['email' => $request->email]);
        return response()->json(['message' => 'Jika email terdaftar, instruksi reset password telah dikirim.']);
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate(['token' => 'required', 'email' => 'required|email', 'password' => 'required|min:8|confirmed']);
        $status = Password::broker('partners')->reset($data, function (Partner $partner, string $password) {
            $partner->forceFill(['password' => Hash::make($password), 'remember_token' => Str::random(60)])->save();
            event(new PasswordReset($partner));
        });
        return $status === Password::PASSWORD_RESET ? response()->json(['message' => 'Password berhasil diubah.']) : response()->json(['message' => __($status)], 422);
    }
}
