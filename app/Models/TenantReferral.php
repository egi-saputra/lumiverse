<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantReferral extends Model
{
    protected $fillable = [
        'tenant_id',
        'partner_id',
        'referral_code_used',
        'attributed_at',
    ];

    protected $casts = [
        'attributed_at' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class, 'partner_id');
    }
}