<script setup>
import { useHead } from '@vueuse/head'
import { onMounted, ref, provide } from 'vue'
import Navbar from '@/Components/HomePage/Navbar.vue'
import Footer from '@/Components/HomePage/Footer.vue'

const scrollRoot = ref(null)
provide('scrollRoot', scrollRoot) // dipakai Navbar buat scroll & deteksi posisi

useHead({
    meta: [
        // Warna address bar browser (Chrome Android, Safari iOS 15+)
        { name: 'theme-color', content: '#0b1120' },
        { name: 'msapplication-navbutton-color', content: '#0b1120' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'color-scheme', content: 'dark' },
    ],
    link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
    ],
})

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                    observer.unobserve(entry.target)
                }
            })
        },
        {
            root: scrollRoot.value, // penting: root sekarang container, bukan viewport document
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px',
        },
    )

    scrollRoot.value?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})
</script>

<template>
    <div ref="scrollRoot" class="scroll-viewport" id="scroll-root">
        <Navbar />
        <main>
            <slot />
        </main>
        <Footer />
    </div>
</template>