<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Device extends Model
{
    protected $fillable = [
        'device_uuid',
        'platform',
        'device_name',
        'push_token',
        'last_used_at',
    ];

    protected $casts = [
        'last_used_at'       => 'datetime',
        'revoked_at'         => 'datetime',
        'authenticatable_id' => 'integer',
    ];

    public function authenticatable(): MorphTo
    {
        return $this->morphTo();
    }

    public function pin(): HasOne
    {
        return $this->hasOne(DevicePin::class);
    }

    public function biometricKey(): HasOne
    {
        return $this->hasOne(DeviceBiometricKey::class);
    }

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }
}