<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiInvoice extends Model
{
    use HasFactory;

    protected $table = 'ai_invoices';

    protected $fillable = [
        'user_id',
        'external_id',
        'invoice_id',
        'plan_key',
        'amount',
        'status',
        'paid_at',
        'expired_at',
        'invoice_url',
        'meta',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'expired_at' => 'datetime',
        'meta' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}