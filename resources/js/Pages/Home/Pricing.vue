<script setup>
import { Head } from '@inertiajs/vue3'
import HomeLayout from '@/Layouts/HomeLayout.vue'
import PricingSection from '@/Components/HomePage/PricingSection.vue'
import { onMounted } from 'vue'

defineOptions({
    layout: HomeLayout,
})

onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>

    <Head>
        <title>Pricing List | Lumiverse School</title>
        <meta head-key="description" name="description"
            content="Daftar harga dan paket layanan Lumiverse School untuk sekolah dan lembaga pendidikan." />
        <link head-key="canonical" rel="canonical" href="https://lumiverse.co.id/pricing-list" />
    </Head>

    <main class="pricing-page">
        <PricingSection />
    </main>
</template>
