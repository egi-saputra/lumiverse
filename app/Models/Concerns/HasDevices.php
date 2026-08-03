<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Models\Device;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasDevices
{
    /**
     * Semua device (HP) yang pernah didaftarkan model ini — dipakai
     * untuk PIN/biometric unlock & step-up auth sebelum aksi sensitif
     * (payout, ganti rekening bank).
     */
    public function devices(): MorphMany
    {
        return $this->morphMany(Device::class, 'authenticatable');
    }
}