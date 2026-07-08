<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class RegistrationRateLimit extends Model
{
    protected $fillable = [
        'identifier',
        'identifier_type',
        'attempt_count',
        'first_attempt_at',
        'last_attempt_at',
        'blocked_until',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'first_attempt_at' => 'datetime',
        'last_attempt_at'  => 'datetime',
        'blocked_until'    => 'datetime',
    ];

    // ----------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------

    /**
     * Cek apakah identifier ini sedang diblokir.
     */
    public function isBlocked(): bool
    {
        return $this->blocked_until && $this->blocked_until->isFuture();
    }

    /**
     * Sisa waktu blokir dalam detik.
     */
    public function remainingBlockSeconds(): int
    {
        if (!$this->isBlocked()) {
            return 0;
        }

        return (int) now()->diffInSeconds($this->blocked_until, false);
    }
}