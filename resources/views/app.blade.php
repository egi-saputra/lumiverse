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

        <title inertia>{{ config('app.name', 'Lumiverse') }}</title>

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

        <script type="application/ld+json">
            @verbatim
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Lumiverse School",
                "alternateName": ["Lumiverse"],
                "url": "https://lumiverse.co.id"
            }
            @endverbatim
        </script>
        <script type="application/ld+json">
            @verbatim
            {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Lumiverse School",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Web",
                "url": "https://lumiverse.co.id",
                "description": "Platform Learning Management System (LMS) berbasis cloud untuk sekolah, pesantren, dan lembaga pendidikan di Indonesia.",
                "provider": {
                    "@type": "Organization",
                    "name": "PT Lumi Platforms Indonesia",
                    "url": "https://lumiverse.co.id",
                    "logo": "https://lumiverse.co.id/logo.svg",
                    "address": { "@type": "PostalAddress", "addressLocality": "Bogor", "addressCountry": "ID" },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "contactType": "customer support",
                        "email": "info@lumiverse.co.id",
                        "availableLanguage": ["Indonesian", "English"]
                    },
                    "sameAs": [
                        "https://linkedin.com/company/lumiverse",
                        "https://instagram.com/lumiverse"
                    ]
                }
            }
            @endverbatim
        </script>
    </head>

    <body class="font-sans antialiased" oncontextmenu="true false;" oncopy="return true;" oncut="return true;">
        @inertia

        <!-- Sandbox -->
                    <script src="https://app.midtrans.com/snap/snap.js"
                        data-client-key="{{ config('midtrans.client_key') }}"></script>
                    <!-- Production: ganti URL ke https://app.midtrans.com/snap/snap.js -->
    </body>
</html>
