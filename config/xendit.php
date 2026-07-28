<?php
return [
    // Secret key dari dashboard Xendit (test: xnd_development_..., live: xnd_production_...)
    'secret_key' => env('XENDIT_SECRET_KEY'),

    // Verification Token dari Dashboard Xendit > Settings > Callbacks
    // (token statis, BUKAN dihitung dari payload seperti signature_key Midtrans)
    'callback_token' => env('XENDIT_CALLBACK_TOKEN'),

    // Berapa lama invoice aktif sebelum otomatis EXPIRED (detik). 24 jam ≈ token Snap lama.
    'invoice_duration' => env('XENDIT_INVOICE_DURATION', 60 * 60 * 24),
];