<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionOrder extends Model
{
    protected $fillable = [
        'tenant_id', 'plan_id', 'billing_cycle',
        'order_id', 'snap_token', 'amount', 'discount_percent', 'discount_amount',
        'subtotal', 'yearly_discount', 'credit_amount', 'bonus_days', 'tax_amount', 'action',
        'status', 'paid_at', 'expires_at', 'xendit_invoice_id', 'xendit_payload', 'referral_discount_amount',
        'referrer_partner_id',
    ];

    protected $casts = [
        'xendit_payload'   => 'array',
        'paid_at'          => 'datetime',
        'expires_at'       => 'date',
        'discount_percent' => 'integer',
        'discount_amount'  => 'integer',
    ];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function plan()   { return $this->belongsTo(Plan::class); }

    /**
     * Reward partner yang di-generate dari order ini (kalau tenant order
     * ini punya atribusi referral & webhook pembayaran sudah diproses).
     * order_id di referral_rewards unique, jadi ini aman sebagai hasOne.
     */
    public function reward()
    {
        return $this->hasOne(ReferralReward::class, 'order_id');
    }

    /**
     * Kandidat partner untuk order ini (dari kode referral yang diinput
     * saat checkout, atau dari atribusi permanen yang sudah ada). Baru
     * jadi atribusi PERMANEN (tenant_referrals) setelah order ini dibayar
     * — lihat SubscriptionController::lockReferralAttribution().
     */
    public function referrerPartner()
    {
        return $this->belongsTo(Partner::class, 'referrer_partner_id');
    }
}