<?php

declare(strict_types=1);

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Partner\Concerns\AuthorizesDevice;
use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class DevicePinController extends Controller
{
    use AuthorizesDevice;

    /**
     * Setup / ganti PIN. Wajib konfirmasi password akun supaya orang yang
     * menemukan HP dalam keadaan unlocked tidak bisa asal ganti PIN.
     */
    public function store(Request $request, Device $device)
    {
        $this->authorizeDevice($request, $device);

        $validated = $request->validate([
            'current_password' => 'required|string',
            'pin' => 'required|digits:6',
        ]);

        $partner = $request->user('partner');

        if (! Hash::check($validated['current_password'], $partner->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'Password salah.',
            ]);
        }

        $device->pin()->updateOrCreate([], [
            'pin_hash' => Hash::make($validated['pin']),
            'failed_attempts' => 0,
            'locked_until' => null,
        ]);

        return response()->json(['message' => 'PIN berhasil disimpan.']);
    }

    public function verify(Request $request, Device $device)
    {
        $this->authorizeDevice($request, $device);

        $request->validate(['pin' => 'required|digits:6']);

        $pin = $device->pin;

        if (! $pin) {
            return response()->json(['message' => 'PIN belum diaktifkan di device ini.'], 422);
        }

        if ($pin->isLocked()) {
            return response()->json([
                'message' => 'PIN terkunci sementara, coba lagi nanti.',
                'locked_until' => $pin->locked_until,
            ], 423);
        }

        if (! Hash::check($request->input('pin'), $pin->pin_hash)) {
            $pin->increment('failed_attempts');

            if ($pin->failed_attempts >= 5) {
                // Lockout progresif: 2, 4, 8, 16, 32 menit dst.
                $minutes = 2 ** min($pin->failed_attempts - 4, 5);
                $pin->update(['locked_until' => now()->addMinutes($minutes)]);
            }

            return response()->json(['message' => 'PIN salah.'], 422);
        }

        $pin->update(['failed_attempts' => 0, 'locked_until' => null]);
        $device->update(['last_used_at' => now()]);

        return response()->json(['message' => 'Berhasil.']);
    }
}