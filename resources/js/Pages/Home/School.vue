<script setup>
import { useHead } from '@vueuse/head'
import { Head } from '@inertiajs/vue3'
import LandingLayout from '@/Layouts/LandingLayout.vue'
import HeroSection from '@/Components/HomePage/HeroSection.vue'
// import AboutSection from '@/Components/HomePage/AboutSection.vue'
// import LogosSection from '@/Components/HomePage/LogosSection.vue'
import StatsSection from '@/Components/HomePage/StatsSection.vue'
import FeaturesSection from '@/Components/HomePage/FeaturesSection.vue'
import HowItWorksSection from '@/Components/HomePage/HowItWorksSection.vue'
// import DocsSection from '@/Components/HomePage/DocsSection.vue'
// import PricingSection from '@/Components/HomePage/PricingSection.vue'
import TestimonialsSection from '@/Components/HomePage/TestimonialsSection.vue'
import LegalitasSection from '@/Components/HomePage/LegalitasSection.vue'
import CtaSection from '@/Components/HomePage/CtaSection.vue'
import { onMounted } from 'vue'

defineOptions({
    layout: LandingLayout,
})

useHead({
    title: 'Lumiverse School',
    meta: [
        {
            name: 'description',
            // 145 karakter — aman tidak dipotong Google (< 160)
            content: 'Lumiverse merupakan sebuah platform Learning Management System berbasis cloud yang hadir untuk memberikan solusi dan kemudahan bagi sekolah dan intansi lembaga pendidikan lainnya di Indonesia.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Lumiverse School' },
        { property: 'og:url', content: 'https://lumiverse.co.id/' },
        { property: 'og:title', content: 'Lumiverse School' },
        {
            property: 'og:description',
            content: 'Platform LMS gratis berbasis cloud untuk sekolah, pesantren, dan lembaga pendidikan di Indonesia. Kelola kelas, materi pembelajaran online, tugas harian siswa, ujian online, rekap nilai siswa otomatis, rapor digital, presensi siswa, rekap absensi siswa otomatis dalam satu sistem.',
        },
        { property: 'og:image', content: 'https://lumiverse.co.id/og-image-lms.jpg' },
        { property: 'og:locale', content: 'id_ID' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Lumiverse — Sistem LMS Sekolah Berbasis Cloud' },
        { name: 'twitter:description', content: 'LMS cloud untuk sekolah dan lembaga pendidikan di Indonesia. Cepat, aman, dan mudah digunakan guru maupun siswa.' },
        { name: 'twitter:image', content: 'https://lumiverse.co.id/og-image-lms.jpg' },
    ],
    link: [
        { rel: 'canonical', href: 'https://lumiverse.co.id/' },
    ],
    script: [
        {
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Lumiverse School',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web',
                url: 'https://lumiverse.co.id',
                description: 'Platform Learning Management System (LMS) berbasis cloud untuk sekolah, pesantren, dan lembaga pendidikan di Indonesia.',
                provider: {
                    '@type': 'Organization',
                    name: 'PT Lumi Platforms Indonesia',
                    url: 'https://lumiverse.co.id',
                    logo: 'https://lumiverse.co.id/logo.svg',
                    address: { '@type': 'PostalAddress', addressLocality: 'Bogor', addressCountry: 'ID' },
                    contactPoint: {
                        '@type': 'ContactPoint',
                        contactType: 'customer support',
                        email: 'info@lumiverse.co.id',
                        availableLanguage: ['Indonesian', 'English'],
                    },
                    sameAs: [
                        'https://linkedin.com/company/lumiverse',
                        'https://instagram.com/lumiverse',
                    ],
                },
            }),
        },
    ],
})

/* ─── Dark Mode — dipaksa selalu aktif ──── */
onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>

    <Head title="Lumiverse School" />
    <HeroSection />
    <!-- <AboutSection /> -->
    <!-- <LogosSection /> -->
    <StatsSection />
    <FeaturesSection />
    <HowItWorksSection />
    <!-- <DocsSection /> -->
    <!-- <PricingSection /> -->
    <TestimonialsSection />
    <LegalitasSection />
    <CtaSection />
</template>