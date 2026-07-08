<script setup>
import { Head, usePage } from '@inertiajs/vue3';
import Navbar from '@/Components/Landing/Navbar.vue';
import HeroSection from '@/Components/Landing/HeroSection.vue';
import AboutSection from '@/Components/Landing/AboutSection.vue';
import ProgramsSection from '@/Components/Landing/ProgramsSection.vue';
import StatsSection from '@/Components/Landing/StatsSection.vue';
import TestimonialsSection from '@/Components/Landing/TestimonialsSection.vue';
import CTASection from '@/Components/Landing/CTASection.vue';
import ContactSection from '@/Components/Landing/ContactSection.vue';
import FooterSection from '@/Components/Landing/FooterSection.vue';

const page = usePage()

const schemaOrg = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "SMK Nusantara",
    "description": "Sekolah Menengah Kejuruan Nusantara — mencetak generasi profesional siap kerja",
    "url": "https://smknusantara.sch.id",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "ID",
        "addressRegion": "Indonesia"
    }
})
</script>

<template>
    <!-- SEO Meta Tags via Inertia Head -->

    <Head>
        <title class="capitalize">{{ page.props.tenant?.name }} | Smart Learning System App</title>
        <meta name="description"
            content="SMK Nusantara adalah sekolah menengah kejuruan terkemuka yang mendidik generasi profesional siap kerja dengan kurikulum modern, fasilitas lengkap, dan mitra industri terpercaya." />
        <meta name="keywords"
            content="SMK Nusantara, sekolah kejuruan terbaik, RPL, TKJ, Multimedia, Akuntansi, pendaftaran SMK 2024, SMK unggulan" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="SMK Nusantara" />
        <meta property="og:title" content="SMK Nusantara — Sekolah Kejuruan Unggulan" />
        <meta property="og:description"
            content="Bergabunglah dengan SMK Nusantara. Kami mencetak generasi profesional yang siap bersaing di era global dengan pendidikan vokasi berkualitas tinggi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smknusantara.sch.id" />
        <meta property="og:image" content="https://smknusantara.sch.id/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SMK Nusantara — Sekolah Kejuruan Unggulan" />
        <meta name="twitter:description" content="Wujudkan masa depan gemilangmu bersama SMK Nusantara." />
        <link rel="canonical" href="https://smknusantara.sch.id" />
        <!-- Preconnect for performance -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet" />
        <!-- Schema.org structured data -->
        <!-- <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "SMK Nusantara",
      "description": "Sekolah Menengah Kejuruan Nusantara — mencetak generasi profesional siap kerja",
      "url": "https://smknusantara.sch.id",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ID",
        "addressRegion": "Indonesia"
      }
    }
    </script> -->
    </Head>

    <div id="smk-nusantara" class="smk-root">
        <Navbar />
        <main>
            <HeroSection />
            <AboutSection />
            <ProgramsSection />
            <StatsSection />
            <TestimonialsSection />
            <CTASection />
            <ContactSection />
        </main>
        <FooterSection />
    </div>
</template>

<!-- Global styles — NOT scoped -->
<style>
/* === SMK NUSANTARA GLOBAL DESIGN TOKENS === */
:root {
    --navy-950: #030B18;
    --navy-900: #050E1F;
    --navy-800: #0B1E3D;
    --navy-700: #112850;
    --navy-600: #1A3A6B;
    --gold-600: #A8882A;
    --gold-500: #C9A84C;
    --gold-400: #D4B55B;
    --gold-300: #E8CF84;
    --gold-200: #F3E3B0;
    --cream-50: #FAFAF7;
    --cream-100: #F5F0E6;
    --cream-200: #EDE4D0;
    --white: #FFFFFF;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

html {
    scroll-behavior: smooth;
}

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.smk-root {
    font-family: var(--font-body);
    overflow-x: hidden;
    background: var(--navy-900);
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-track {
    background: var(--navy-950);
}

::-webkit-scrollbar-thumb {
    background: var(--gold-500);
    border-radius: 3px;
}

/* Shared animation classes */
.fade-up {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-up.visible {
    opacity: 1;
    transform: translateY(0);
}

.fade-left {
    opacity: 0;
    transform: translateX(-40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-left.visible {
    opacity: 1;
    transform: translateX(0);
}

.fade-right {
    opacity: 0;
    transform: translateX(40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-right.visible {
    opacity: 1;
    transform: translateX(0);
}

/* Stagger delays */
.delay-100 {
    transition-delay: 0.1s;
}

.delay-200 {
    transition-delay: 0.2s;
}

.delay-300 {
    transition-delay: 0.3s;
}

.delay-400 {
    transition-delay: 0.4s;
}

.delay-500 {
    transition-delay: 0.5s;
}

.delay-600 {
    transition-delay: 0.6s;
}

/* Shared gold button */
.btn-gold-solid {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, var(--gold-500), var(--gold-400));
    color: var(--navy-900);
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 0.875rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.875rem 2rem;
    border: none;
    cursor: pointer;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(201, 168, 76, 0.35);
    text-decoration: none;
}

.btn-gold-solid:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(201, 168, 76, 0.55);
    background: linear-gradient(135deg, var(--gold-400), var(--gold-300));
}

.btn-outline-gold {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--gold-500);
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.875rem 2rem;
    border: 1.5px solid var(--gold-500);
    cursor: pointer;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: all 0.3s ease;
    text-decoration: none;
}

.btn-outline-gold:hover {
    background: rgba(201, 168, 76, 0.1);
    transform: translateY(-2px);
}

/* Section heading shared styles */
.section-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold-500);
    margin-bottom: 1rem;
}

/* .section-label::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--gold-500);
} */

.section-label::before {
    content: '◈';
    color: var(--gold-400);
    font-size: 1rem;
    text-shadow: 0 0 10px rgba(201, 168, 76, 0.5);
}

.section-title-light {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 600;
    line-height: 1.15;
    color: var(--white);
}

.section-title-dark {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 600;
    line-height: 1.15;
    color: var(--navy-900);
}

.text-gold {
    color: var(--gold-500);
}

.text-gold-gradient {
    background: linear-gradient(135deg, var(--gold-500), var(--gold-300));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
</style>