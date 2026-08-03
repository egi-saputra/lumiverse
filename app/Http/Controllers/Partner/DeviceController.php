<?php

declare(strict_types=1);

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Partner\Concerns\AuthorizesDevice;
use App\Models\Device;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    use AuthorizesDevice;

    public function register(Request $request)
    {
        $validated = $request->validate([
            'device_uuid' => 'required|uuid',
            'platform' => 'required|in:ios,android,web',
            'device_name' => 'nullable|string|max:100',
            'push_token' => 'nullable|string|max:255',
        ]);

        $partner = $request->user('partner');

        $device = $partner->devices()->updateOrCreate(
            ['device_uuid' => $validated['device_uuid']],
            [
                'platform' => $validated['platform'],
                'device_name' => $validated['device_name'] ?? null,
                'push_token' => $validated['push_token'] ?? null,
                'last_used_at' => now(),
                'revoked_at' => null, // re-register otomatis un-revoke
            ]
        );

        return response()->json([
            'device_id' => $device->id,
            'message' => 'Device terdaftar.',
        ]);
    }

    public function revoke(Request $request, Device $device)
    {
        $this->authorizeDevice($request, $device);

        $device->update(['revoked_at' => now()]);

        return response()->json(['message' => 'Device berhasil dicabut.']);
    }
}