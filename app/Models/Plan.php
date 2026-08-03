<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'key',
        'name',
        'description',
        'price_monthly',
        'price_yearly',
        'tax',
        'discount',
        'max_users',
        'duration_days',
        'features',
        'unavailable_features',
        'badge',
        'accent_color',
        'is_highlighted',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features'             => 'array',
        'unavailable_features' => 'array',
        'is_highlighted'       => 'boolean',
        'is_active'            => 'boolean',
        'price_monthly'        => 'integer',
        'price_yearly'         => 'integer',
        'tax'                  => 'integer',
        'discount'             => 'integer',
        'max_users'            => 'integer',
        'duration_days'        => 'integer',
    ];

    /**
     * Hanya plan yang aktif, urut berdasarkan sort_order.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    /**
     * Format untuk ditampilkan di Pricing.vue (owner-facing).
     */
    public function toPricingArray(): array
    {
        return [
            'key'          => $this->key,
            'name'         => $this->name,
            'desc'         => $this->description,
            'price'        => [
                'monthly' => $this->price_monthly,
                'yearly'  => $this->price_yearly,
            ],
            'tax'          => $this->tax,
            'discount'     => $this->discount,
            'maxUsers'     => $this->max_users,
            'highlight'    => $this->is_highlighted,
            'badge'        => $this->badge,
            'accent'       => $this->accent_color,
            'features'     => $this->features ?? [],
            'unavailable'  => $this->unavailable_features ?? [],
            'sortOrder'   => $this->sort_order,
        ];
    }
}