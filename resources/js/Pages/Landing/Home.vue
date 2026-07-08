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

defineOptions({ layout: LandingLayout })

useHead({
    // title: 'Lumi Platforms Smart Learning System',
    meta: [
        {
            name: 'description',
            content: 'Lumiverse merupakan The All in One Growth System Platform berbasis cloud pertama di Indonesia, yang hadir untuk memberikan solusi dan kemudahan bagi sebuah bisnis, perusahaan atau lembaga pendidikan.',
        },
        {
            name: 'keywords',
            content: 'LMS Indonesia, Learning Management System, platform belajar online, sistem manajemen sekolah, e-learning sekolah, Smart School, Sekolah Digital, Digitalisasi Sekolah, Ujian Online, Guru Pejuang Digital, LMS SD, LMS SMP, LMS SMK, LMS pesantren, LMS Pendidikan, LUMIVERSE, LUMIVERSE SCHOOL, Lumiverse School, LUMI WORKSPACE, Lumi Workspace, LUMI CLASSROOM, Lumi Classroom, PT LUMI PLATFORMS INDONESIA, PT Lumi Platforms Indonesia, pt lumi platforms indonesia',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://lumiverse.co.id/' },
        { property: 'og:title', content: 'Lumiverse — The All in One Growth System Platform' },
        {
            property: 'og:description',
            content: 'Platform LMS dan Workspace berbasis cloud yang cepat, aman, dan dirancang khusus untuk sekolah, lembaga pendidikan, perusahaan dan korporasi di Indonesia.',
        },
        { property: 'og:image', content: 'https://lumiverse.co.id/og-image.jpg' },
        { property: 'og:locale', content: 'id_ID' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Lumiverse — Platform LMS dan Workspace Modern' },
        { name: 'twitter:description', content: 'Platform LMS dan Workspace berbasis cloud untuk sekolah, lembaga pendidikan, perusahaan dan korporasi di Indonesia. Cepat, aman, profesional.' },
        { name: 'twitter:image', content: 'https://lumiverse.co.id/og-image.jpg' },
    ],
    script: [
        {
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Lumiverse',
                url: 'https://lumiverse.co.id',
                logo: 'https://lumiverse.co.id/logo.svg',
                description: 'Platform LMS dan Workspace berbasis cloud untuk sekolah, lembaga pendidikan, perusahaan dan korporasi di Indonesia.',
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

    <Head title="Lumiverse The All in One Growth Platform System" />
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