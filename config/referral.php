<?php

return [
    // 'percent' atau 'fixed'
    'discount_type' => env('REFERRAL_DISCOUNT_TYPE', 'percent'),

    // dipakai kalau discount_type = 'percent'
    'discount_percent' => env('REFERRAL_DISCOUNT_PERCENT', 10),

    // dipakai kalau discount_type = 'fixed' — dalam Rupiah
    'discount_amount' => env('REFERRAL_DISCOUNT_AMOUNT', 100000),
];