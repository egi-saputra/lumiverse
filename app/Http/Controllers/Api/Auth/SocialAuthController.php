<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /** Provider yang didukung. Tambah di sini kalau nanti ada provider baru. */
    private const SUPPORTED_PROVIDERS = ['google', 'apple', 'facebook'];

    /**
     * Login via provider sosial — HANYA untuk user yang sudah terdaftar.
     * Tidak pernah membuat akun baru.
     *
     * Body: { "provider": "google", "token": "<access_token_dari_client_sdk>" }
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'provider' => ['required', 'string', 'in:' . implode(',', self::SUPPORTED_PROVIDERS)],
            'token'    => ['required', 'string'],
        ]);

        try {
            $socialUser = Socialite::driver($validated['provider'])
                ->stateless()
                ->userFromToken($validated['token']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Token tidak valid atau kedaluwarsa.',
            ], 401);
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        if (! $user) {
            return response()->json([
                'message' => 'Akun belum terdaftar. Silakan registrasi terlebih dahulu.',
                'code'    => 'NOT_REGISTERED',
            ], 404);
        }

        // Sinkronkan info provider (opsional, sesuaikan kolom yang ada)
        $user->update([
            'google_id' => $validated['provider'] === 'google' ? $socialUser->getId() : $user->google_id,
            'avatar'    => $socialUser->getAvatar() ?? $user->avatar,
        ]);

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }
}