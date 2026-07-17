<script setup>
import { Head } from '@inertiajs/vue3'
import AboutLayout from '@/Layouts/AboutLayout.vue'
import AboutSection from '@/Components/HomePage/AboutSection.vue'
import ValuesSection from '@/Components/HomePage/ValuesSection.vue'
import LegalitasSection from '@/Components/HomePage/LegalitasSection.vue'
import { onMounted } from 'vue'

defineOptions({
    layout: AboutLayout,
})

/* ─── Dark Mode — dipaksa selalu aktif ──── */
onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>

    <Head>
        <title>About Us | Lumiverse School</title>
        <meta head-key="description" name="description"
            content="Lumiverse merupakan sebuah platform Learning Management System berbasis cloud yang hadir untuk memberikan solusi dan kemudahan bagi sekolah dan intansi lembaga pendidikan lainnya di Indonesia." />
        <meta head-key="og:type" property="og:type" content="website" />
        <meta head-key="og:site_name" property="og:site_name" content="About Us | Lumiverse School" />
        <meta head-key="og:url" property="og:url" content="https://about.lumiverse.co.id/" />
        <meta head-key="og:title" property="og:title" content="About Us | Lumiverse School" />
        <meta head-key="og:description" property="og:description"
            content="Platform LMS gratis berbasis cloud untuk sekolah, pesantren, dan lembaga pendidikan di Indonesia. Kelola kelas, materi pembelajaran online, tugas harian siswa, ujian online, rekap nilai siswa otomatis, rapor digital, presensi siswa, rekap absensi siswa otomatis dalam satu sistem." />
        <meta head-key="og:image" property="og:image" content="https://about.lumiverse.co.id/og-image-about.jpg" />
        <meta head-key="og:locale" property="og:locale" content="id_ID" />
        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta head-key="twitter:title" name="twitter:title" content="Lumiverse — Sistem LMS Sekolah Berbasis Cloud" />
        <meta head-key="twitter:description" name="twitter:description"
            content="LMS cloud untuk sekolah dan lembaga pendidikan di Indonesia. Cepat, aman, dan mudah digunakan guru maupun siswa." />
        <meta head-key="twitter:image" name="twitter:image"
            content="https://about.lumiverse.co.id/og-image-about.jpg" />
        <link head-key="canonical" rel="canonical" href="https://about.lumiverse.co.id/" />
    </Head>
    <AboutSection />
    <ValuesSection />
    <LegalitasSection />
</template>