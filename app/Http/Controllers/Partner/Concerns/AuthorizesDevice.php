<?php

declare(strict_types=1);

namespace App\Http\Controllers\Partner\Concerns;

use App\Models\Device;
use App\Models\Partner;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

trait AuthorizesDevice
{
    protected function authorizeDevice(Request $request, Device $device): void
    {
        /** @var Partner $partner */
        $partner = $request->user('partner');

        $owned = $device->authenticatable_type === Partner::class
            && $device->authenticatable_id === $partner->id
            && ! $device->isRevoked();

        if (! $owned) {
            // 404, bukan 403 — supaya nggak konfirmasi ke penyerang
            // bahwa device ID itu memang ada tapi milik orang lain.
            throw new NotFoundHttpException();
        }
    }

    protected function cacheKey(Device $device, string $purpose): string
    {
        return "device:{$purpose}:{$device->id}";
    }
}