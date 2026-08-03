<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceBiometricKey extends Model
{
    protected $fillable = [
        'public_key',
        'algorithm',
        'last_used_at',
    ];

    protected $hidden = [
        'public_key',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}