<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerBankAccount extends Model
{
    protected $fillable = [
        'partner_id',
        'bank_code',
        'account_number',
        'account_holder_name',
        'verification_status',
        'verification_failure_reason',
        'verified_at',
        'is_primary',
    ];

    protected $casts = [
        'is_primary'   => 'boolean',
        'verified_at'  => 'datetime',
    ];

    public const STATUS_UNVERIFIED = 'unverified';
    public const STATUS_VERIFIED   = 'verified';
    public const STATUS_FAILED     = 'failed';

    public function partner()
    {
        return $this->belongsTo(Partner::class, 'partner_id');
    }

    public function isVerified(): bool
    {
        return $this->verification_status === self::STATUS_VERIFIED;
    }

    /**
     * Tandai rekening ini sebagai satu-satunya yang primary milik partner.
     * Rekening lain milik partner yang sama otomatis di-unset.
     */
    public function markAsPrimary(): void
    {
        static::where('partner_id', $this->partner_id)
            ->where('id', '!=', $this->id)
            ->update(['is_primary' => false]);

        $this->update(['is_primary' => true]);

        $this->partner->notify(new \App\Notifications\PrimaryBankAccountChanged($this));
    }
}