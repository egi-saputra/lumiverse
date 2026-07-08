<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'paths' => ['api/*', 'sanctum/csrf-cookie'],
 
    'allowed_methods' => ['*'],
 
    // 'allowed_origins' => [
    //     // Development
    //     'http://localhost:5173',
    //     'http://localhost:3000',
    //     'http://127.0.0.1:8000',
 
    //     // Production — ganti dengan domain kamu!
    //     'https://smknusantara.id',
    //     'https://www.smknusantara.id',
    // ],
 
    'allowed_origins_patterns' => [],
 
    'allowed_headers' => ['*'],
 
    'exposed_headers' => [],
 
    'max_age' => 0,
 
    'supports_credentials' => true, // Wajib true untuk Sanctum cookie auth

];
