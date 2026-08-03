<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevicePin extends Model
{
    protected $fillable = [
        'pin_hash',
        'failed_attempts',
        'locked_until',
    ];

    protected $hidden = [
        'pin_hash',
    ];

    protected $casts = [
        'locked_until' => 'datetime',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function isLocked(): bool
    {
        return $this->locked_until !== null && $this->locked_until->isFuture();
    }
}