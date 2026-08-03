<?php

declare(strict_types=1);

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Partner\Concerns\AuthorizesDevice;
use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StepUpController extends Controller
{
    use AuthorizesDevice;

    /**
     * Kalau device punya biometric, kasih challenge buat di-sign.
     * Kalau cuma punya PIN, client cukup langsung POST ke verify()
     * dengan field 'pin' — tanpa perlu challenge dulu.
     */
    public function challenge(Request $request, Device $device)
    {
        $this->authorizeDevice($request, $device);

        if (! $device->biometricKey) {
            return response()->json(['method' => 'pin']);
        }

        $challenge = base64_encode(random_bytes(32));
        Cache::put($this->cacheKey($device, 'stepup-challenge'), $challenge, now()->addMinutes(2));

        return response()->json(['method' => 'biometric', 'challenge' => $challenge]);
    }

    public function verify(Request $request, Device $device)
    {
        $this->authorizeDevice($request, $device);

        $partner = $request->user('partner');

        $validated = $request->validate([
            'pin' => 'nullable|digits:6',
            'signature' => 'nullable|string',
        ]);

        $ok = match (true) {
            filled($validated['signature'] ?? null) => $this->verifyBiometric($device, $validated['signature']),
            filled($validated['pin'] ?? null) => $this->verifyPin($device, $validated['pin']),
            default => false,
        };

        if (! $ok) {
            return response()->json(['message' => 'Konfirmasi gagal.'], 422);
        }

        $grantToken = Str::random(40);

        Cache::put(
            "stepup:partner:{$partner->id}:{$device->device_uuid}",
            $grantToken,
            now()->addMinutes(5)
        );

        return response()->json(['step_up_token' => $grantToken]);
    }

    private function verifyBiometric(Device $device, string $signature): bool
    {
        $challenge = Cache::pull($this->cacheKey($device, 'stepup-challenge'));
        $biometricKey = $device->biometricKey;

        if (! $challenge || ! $biometricKey) {
            return false;
        }

        return openssl_verify(
            base64_decode($challenge),
            base64_decode($signature),
            $biometricKey->public_key,
            OPENSSL_ALGO_SHA256
        ) === 1;
    }

    private function verifyPin(Device $device, string $pin): bool
    {
        $devicePin = $device->pin;

        if (! $devicePin || $devicePin->isLocked()) {
            return false;
        }

        $valid = Hash::check($pin, $devicePin->pin_hash);

        if (! $valid) {
            $devicePin->increment('failed_attempts');
        } else {
            $devicePin->update(['failed_attempts' => 0, 'locked_until' => null]);
        }

        return $valid;
    }
}