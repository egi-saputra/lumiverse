<script setup>
import { useHead } from '@vueuse/head'
import { Head } from '@inertiajs/vue3'
import LandingLayout from '@/Layouts/LandingLayout.vue'
import HeroSection from '@/Components/WorkspacePage/HeroSection.vue'
import StatsSection from '@/Components/WorkspacePage/StatsSection.vue'
import FeaturesSection from '@/Components/WorkspacePage/FeaturesSection.vue'
import HowItWorksSection from '@/Components/WorkspacePage/HowItWorksSection.vue'
import TestimonialsSection from '@/Components/WorkspacePage/TestimonialsSection.vue'
import LegalitasSection from '@/Components/HomePage/LegalitasSection.vue'
import CtaSection from '@/Components/WorkspacePage/CtaSection.vue'
import { onMounted } from 'vue'

defineOptions({ layout: LandingLayout })

useHead({
    title: 'Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud',
    meta: [
        {
            name: 'description',
            content: 'Lumiverse Workspace adalah platform kolaborasi tim berbasis cloud untuk perusahaan dan korporasi di Indonesia. Kelola tim, proyek, dan alur kerja.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://workspace.lumiverse.co.id/' },
        { property: 'og:title', content: 'Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud' },
        {
            property: 'og:description',
            content: 'Platform kolaborasi dan manajemen kerja tim berbasis cloud untuk perusahaan dan korporasi di Indonesia. Cepat, aman, dan mudah digunakan.',
        },
        { property: 'og:image', content: 'https://workspace.lumiverse.co.id/og-image-workspace.jpg' },
        { property: 'og:locale', content: 'id_ID' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud' },
        { name: 'twitter:description', content: 'Platform kolaborasi tim berbasis cloud untuk perusahaan dan korporasi di Indonesia.' },
        { name: 'twitter:image', content: 'https://workspace.lumiverse.co.id/og-image-workspace.jpg' },
    ],
    link: [
        { rel: 'canonical', href: 'https://workspace.lumiverse.co.id/' },
    ],
    script: [
        {
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Lumiverse Workspace',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                url: 'https://workspace.lumiverse.co.id',
                description: 'Platform kolaborasi dan manajemen kerja tim berbasis cloud untuk perusahaan dan korporasi di Indonesia.',
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
    <Head title="Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud" />
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <HowItWorksSection />
    <TestimonialsSection />
    <LegalitasSection />
    <CtaSection />
</template>