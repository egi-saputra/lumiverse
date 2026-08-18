<?php

return [
    'plans' => [
        'free' => [
            'label' => 'Free',
            'limit' => 10,
            'monthly_price' => 0,
            'yearly_price' => 0,
            'reset_frequency' => 'semester', // Reset setiap 6 bulan (semester)
        ],
        'pro' => [
            'label' => 'Pro',
            'limit' => 75,
            'monthly_price' => 19499,
            'yearly_price' => 429375,
            'reset_frequency' => 'monthly', // Reset setiap bulan
        ],
        'max' => [
            'label' => 'Max',
            'limit' => 200,
            'monthly_price' => 129999,
            'yearly_price' => 1299799,
            'reset_frequency' => 'monthly', // Reset setiap bulan
        ],
    ],
];
