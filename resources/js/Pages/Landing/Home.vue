<script setup>
import { useHead } from '@vueuse/head'
import { Head } from '@inertiajs/vue3'
import LandingLayout from '@/Layouts/LandingLayout.vue'
import HeroSection from '@/Components/HomePage/HeroSection.vue'
// import AboutSection from '@/Components/HomePage/AboutSection.vue'
import LogosSection from '@/Components/HomePage/LogosSection.vue'
import StatsSection from '@/Components/HomePage/StatsSection.vue'
import FeaturesSection from '@/Components/HomePage/FeaturesSection.vue'
import HowItWorksSection from '@/Components/HomePage/HowItWorksSection.vue'
// import DocsSection from '@/Components/HomePage/DocsSection.vue'
import PricingSection from '@/Components/HomePage/PricingSection.vue'
import TestimonialsSection from '@/Components/HomePage/TestimonialsSection.vue'
import LegalitasSection from '@/Components/HomePage/LegalitasSection.vue'
import CtaSection from '@/Components/HomePage/CtaSection.vue'
import { onMounted } from 'vue'

defineOptions({ layout: LandingLayout })

useHead({
    // title: 'Lumi Platforms Smart Learning System',
    meta: [
        {
            name: 'description',
            content: 'Lumiverse School menghadirkan Learning Management System (LMS) berbasis cloud yang cepat, aman, dan dirancang khusus untuk sekolah tingkat SD, SMP, SMK, dan semua lembaga pendidikan di Indonesia.',
        },
        {
            name: 'keywords',
            content: 'LMS Indonesia, Learning Management System, platform belajar online, sistem manajemen sekolah, e-learning sekolah, Smart School, Sekolah Digital, Digitalisasi Sekolah, Ujian Online, Guru Pejuang Digital, LMS SD, LMS SMP, LMS SMK, LMS pesantren, LMS Pendidikan, LUMIVERSE, LUMIVERSE SCHOOL, Lumiverse School, PT LUMI PLATFORMS INDONESIA, PT Lumi Platforms Indonesia, pt lumi platforms indonesia',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://lumiverse.co.id/' },
        { property: 'og:title', content: 'Lumiverse School — Platform LMS Modern untuk Sekolah' },
        {
            property: 'og:description',
            content: 'LMS berbasis cloud yang cepat, aman, dan dirancang khusus untuk sekolah dan lembaga pendidikan di Indonesia.',
        },
        { property: 'og:image', content: 'https://lumiverse.co.id/og-image.jpg' },
        { property: 'og:locale', content: 'id_ID' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Lumiverse School — Platform LMS Modern' },
        { name: 'twitter:description', content: 'LMS cloud untuk sekolah Indonesia. Cepat, aman, profesional.' },
        { name: 'twitter:image', content: 'https://lumiverse.co.id/og-image.jpg' },
    ],
    script: [
        {
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Lumiverse School',
                url: 'https://lumiverse.co.id',
                logo: 'https://lumiverse.co.id/logo.svg',
                description: 'Platform Learning Management System (LMS) cloud untuk sekolah dan lembaga pendidikan di Indonesia.',
                address: { '@type': 'PostalAddress', addressLocality: 'Bogor', addressCountry: 'ID' },
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: 'info@lumiverse.co.id',
                    availableLanguage: ['Indonesian', 'English'],
                },
                sameAs: [
                    'https://linkedin.com/company/lumiverse-school',
                    'https://instagram.com/lumiverse',
                ],
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

    <Head title="Lumi Platforms Smart Learning System" />
    <HeroSection />
    <!-- <AboutSection /> -->
    <LogosSection />
    <StatsSection />
    <FeaturesSection />
    <HowItWorksSection />
    <!-- <DocsSection /> -->
    <PricingSection />
    <TestimonialsSection />
    <LegalitasSection />
    <CtaSection />
</template>