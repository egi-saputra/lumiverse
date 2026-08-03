<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayoutRequest extends Model
{
    protected $fillable = [
        'partner_id',
        'partner_bank_account_id',
        'amount',
        'status',
        'xendit_payout_id',
        'failure_reason',
        'completed_at',
    ];

    protected $casts = [
        'amount'       => 'integer',
        'completed_at' => 'datetime',
    ];

    public const STATUS_PENDING    = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_COMPLETED  = 'completed';
    public const STATUS_FAILED     = 'failed';

    public function partner()
    {
        return $this->belongsTo(Partner::class, 'partner_id');
    }

    public function bankAccount()
    {
        return $this->belongsTo(PartnerBankAccount::class, 'partner_bank_account_id');
    }
}