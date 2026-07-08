<script setup>
import { useHead } from '@vueuse/head'
import { onMounted } from 'vue'
import Navbar from '@/Components/HomePage/Navbar.vue'
import Footer from '@/Components/HomePage/Footer.vue'

useHead({
    link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
    ],
})

// Scroll reveal observer — runs once layout mounts
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
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    // Observe all .reveal elements (including those in slots)
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})
</script>

<template>
    <div>
        <Navbar />
        <main>
            <slot />
        </main>
        <Footer />
    </div>
</template>