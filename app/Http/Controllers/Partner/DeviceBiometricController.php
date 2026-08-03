<?php

declare(strict_types=1);

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Partner\Concerns\AuthorizesDevice;
use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class DeviceBiometricController extends Controller
{
    use AuthorizesDevice;

    /**
     * Enroll public key yang digenerate device saat user mengaktifkan
     * Face ID / fingerprint. Private key-nya TIDAK PERNAH dikirim ke
     * server — cuma public key (PEM, ECDSA P-256 / ES256).
     */
    public function store(Request $request, Device $device)
    {
        $this->authorizeDevice($request, $device);

        $validated = $request->validate([
            'current_password' => 'required|string',
            'public_key' => 'required|string',
        ]);

        $partner = $request->user('partner');

        if (! Hash::check($validated['current_password'], $partner->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'Password salah.',
            ]);
        }

        // Validasi bahwa string yang dikirim benar-benar public key PEM
        // yang valid, bukan sekadar string sembarang.
        $keyResource = openssl_pkey_get_public($validated['public_key']);

        if ($keyResource === false) {
            throw ValidationException::withMessages([
                'public_key' => 'Public key tidak valid.',
            ]);
        }

        $device->biometricKey()->updateOrCreate([], [
            'public_key' => $validated['public_key'],
            'algorithm' => 'ES256',
        ]);

        return response()->json(['message' => 'Biometric berhasil diaktifkan.']);
    }

    /**
     * Server generate nonce acak — device sign nonce ini pakai private
     * key yang dilindungi biometric, lalu signature-nya diverifikasi
     * di endpoint verify().
     */
    public function challenge(Request $request, Device $device)
    {
        $this->authorizeDevice($request, $device);

        if (! $device->biometricKey) {
            return response()->json(['message' => 'Biometric belum diaktifkan di device ini.'], 422);
        }

        $challenge = base64_encode(random_bytes(32));

        Cache::put($this->cacheKey($device, 'biometric-challenge'), $challenge, now()->addMinutes(2));

        return response()->json(['challenge' => $challenge]);
    }

    public function verify(Request $request, Device $device)
    {
        $this->authorizeDevice($request, $device);

        $request->validate(['signature' => 'required|string']);

        $challenge = Cache::pull($this->cacheKey($device, 'biometric-challenge'));

        if (! $challenge) {
            return response()->json(['message' => 'Challenge kadaluarsa, minta ulang.'], 422);
        }

        $biometricKey = $device->biometricKey;

        if (! $biometricKey) {
            return response()->json(['message' => 'Biometric belum diaktifkan di device ini.'], 422);
        }

        $verified = openssl_verify(
            base64_decode($challenge),
            base64_decode($request->input('signature')),
            $biometricKey->public_key,
            OPENSSL_ALGO_SHA256
        );

        if ($verified !== 1) {
            return response()->json(['message' => 'Verifikasi biometric gagal.'], 422);
        }

        $biometricKey->update(['last_used_at' => now()]);
        $device->update(['last_used_at' => now()]);

        return response()->json(['message' => 'Berhasil.']);
    }
}