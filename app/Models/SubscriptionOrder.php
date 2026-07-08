<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionOrder extends Model
{
    protected $fillable = [
        'tenant_id', 'plan_id', 'billing_cycle',
        'order_id', 'snap_token', 'amount', 'discount_percent', 'discount_amount',
        'subtotal', 'yearly_discount', 'credit_amount', 'bonus_days', 'tax_amount', 'action',
        'status', 'paid_at', 'midtrans_payload', 'expires_at',
    ];

    protected $casts = [
        'midtrans_payload' => 'array',
        'paid_at'          => 'datetime',
        'expires_at'       => 'date',
        'discount_percent' => 'integer',
        'discount_amount'  => 'integer',
    ];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function plan()   { return $this->belongsTo(Plan::class); }
}