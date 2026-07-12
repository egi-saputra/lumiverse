<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" translate="no">
    <head>
        <!-- Google tag (gtag.js) -->
        {{-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-RSHLJ3JZLM"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-RSHLJ3JZLM');
        </script> --}}

        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        @if(tenancy()->initialized)
            <meta name="robots" content="noindex, nofollow, noarchive">
        @endif

        <!-- Theme color untuk address bar browser (Chrome Android) -->
        <meta name="theme-color" content="#0b1120">

        <!-- iOS Safari -->
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Lumiverse">

        <!-- Windows/Edge tile -->
        <meta name="msapplication-navbutton-color" content="#0b1120">
        <meta name="msapplication-TileColor" content="#0b1120">

        <!-- Beritahu browser bahwa page ini dark themed -->
        <meta name="color-scheme" content="dark">

        <!-- Mencegah Google Translate & browser menerjemahkan otomatis -->
        <meta name="google" content="notranslate">
        <meta http-equiv="Content-Language" content="{{ str_replace('_', '-', app()->getLocale()) }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">

        <!-- Fonts Preload -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        <!-- Icons Preload -->
        {{-- <link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" as="style" onload="this.onload=null;this.rel='stylesheet'"> --}}

        <!-- Scripts -->
        @routes
        @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
    </head>

    <body class="font-sans antialiased" oncontextmenu="true false;" oncopy="return true;" oncut="return true;">
        @inertia
    </body>
</html>
