<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\TenantOwner;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class OwnerSocialAuthController extends Controller
{
    private const SUPPORTED_PROVIDERS = ['google', 'apple', 'facebook'];

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
            return response()->json(['message' => 'Token tidak valid atau kedaluwarsa.'], 401);
        }

        $owner = TenantOwner::where('email', $socialUser->getEmail())->first();

        if (! $owner) {
            return response()->json([
                'message' => 'Akun belum terdaftar. Silakan registrasi terlebih dahulu.',
                'code'    => 'NOT_REGISTERED',
            ], 404);
        }

        $token = $owner->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'owner' => $owner,
        ]);
    }
}