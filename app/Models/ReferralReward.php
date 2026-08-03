<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralReward extends Model
{
    protected $fillable = [
        'order_id',
        'referrer_partner_id',
        'reward_percent',
        'reward_amount',
        'credited_at',
    ];

    protected $casts = [
        'reward_percent' => 'integer',
        'reward_amount'  => 'integer',
        'credited_at'    => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(SubscriptionOrder::class, 'order_id');
    }

    public function referrer()
    {
        return $this->belongsTo(Partner::class, 'referrer_partner_id');
    }
}