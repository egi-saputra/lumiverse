<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { router, usePage } from '@inertiajs/vue3';

// const props = defineProps({
//     logoUrl: { type: String, default: '/images/logo-nusantara.png' }
// })

const page = usePage()

// Ambil logo dari shared props
const logoUrl = computed(() => page.props.logoUrl ?? '/images/default.png')
// const namaSekolah = computed(() => page.props.namaSekolah ?? 'KREATICRAFT ID')
const profil = computed(() => page.props.profilSekolah ?? {})

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const activeSection = ref('home');

const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'about', label: 'Tentang' },
    { id: 'programs', label: 'Program' },
    { id: 'testimonials', label: 'Alumni' },
    { id: 'spmb', label: 'SPMB' },
    { id: 'contact', label: 'Kontak' },
];

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;

    for (const link of navLinks) {
        const el = document.getElementById(link.id);

        if (el) {
            const rect = el.getBoundingClientRect();

            if (rect.top <= 150 && rect.bottom >= 150) {
                activeSection.value = link.id;
            }
        }
    }
};

const scrollTo = (id) => {
    isMenuOpen.value = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const goToLogin = () => {
    isMenuOpen.value = false;
    router.visit('/login');
    // window.location.href = 'https://lms.smknusantara.id';
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
});

onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
    <nav :class="['smk-nav', { scrolled: isScrolled }]">
        <div class="nav-inner">
            <!-- Logo -->
            <button class="nav-logo" @click="scrollTo('home')">
                <span class="logo-emblem">
                    <img :src="logoUrl" class="sm:h-14 h-8 object-cover" alt="Logo" loading="lazy" />

                    <!-- <img :src="logoUrl" class="h-10 sm:block hidden object-contain" alt="Logo Sekolah" loading="lazy" /> -->
                </span>
                <span class="logo-text">
                    <span class="logo-primary mb-1 uppercase">{{ profil.namaSekolah ?? '-' }}</span>
                    <span class="logo-secondary">Lumi Platforms, Inc. Collaboration</span>
                </span>
            </button>

            <!-- Desktop Links -->
            <ul class="nav-links">
                <li v-for="link in navLinks" :key="link.id">
                    <button :class="['nav-link', { active: activeSection === link.id }]" @click="scrollTo(link.id)">
                        {{ link.label }}
                    </button>
                </li>
            </ul>

            <!-- CTA -->
            <div class="nav-cta">
                <button class="btn-outline-gold hero-btn" @click="goToLogin">
                    Login
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>

            <!-- Mobile Burger -->
            <button class="burger" @click="isMenuOpen = !isMenuOpen" :aria-expanded="isMenuOpen">
                <span :class="['burger-line', { open: isMenuOpen }]"></span>
                <span :class="['burger-line', { open: isMenuOpen }]"></span>
                <span :class="['burger-line', { open: isMenuOpen }]"></span>
            </button>
        </div>

        <!-- Mobile Menu -->
        <div :class="['mobile-menu', { open: isMenuOpen }]">
            <ul class="mobile-links">
                <li v-for="(link, i) in navLinks" :key="link.id" :style="`--i: ${i}`">
                    <button :class="['mobile-link', { active: activeSection === link.id }]" @click="scrollTo(link.id)">
                        {{ link.label }}
                    </button>
                </li>
            </ul>
            <div class="mobile-cta-group">
                <button class="btn-login mobile-btn" @click="goToLogin">
                    Login
                </button>

                <button class="btn-gold-solid mobile-btn" @click="scrollTo('contact')">
                    Daftar
                </button>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.smk-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: all 0.4s ease;
    padding: 0;
}

.smk-nav.scrolled {
    background: rgba(3, 11, 24, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(201, 168, 76, 0.15);
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.4);
}

.nav-inner {
    max-width: 100vw;
    margin: 0 auto;
    padding: 1.25rem 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
}

/* Logo */
.app-logo {
    width: 42px;
    height: 42px;
    fill: var(--gold-500);
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
}

.logo-emblem {
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 8px rgba(201, 168, 76, 0.4));
}

.logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
}

.logo-primary {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--gold-400);
    letter-spacing: 0.1em;
    text-align: left;
}

.logo-secondary {
    font-family: var(--font-body);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.30em;
    color: rgba(255, 255, 255, 0.5);
}

/* Nav links */
.nav-links {
    display: flex;
    list-style: none;
    gap: 0.25rem;
    margin-left: auto;
}

.nav-link {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
    padding: 0.5rem 0.875rem;
    position: relative;
    transition: color 0.3s ease;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    right: 50%;
    height: 1px;
    background: var(--gold-500);
    transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
    color: var(--gold-400);
}

.nav-link:hover::after,
.nav-link.active::after {
    left: 0.875rem;
    right: 0.875rem;
}

/* CTA */
.nav-cta {
    margin-left: 1rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.hero-btn {
    font-size: 0.8rem;
}

/* Button Login */
.btn-login {
    background: transparent;
    border: 1px solid rgba(201, 168, 76, 0.4);
    color: var(--gold-400);
    padding: 0.7rem 1.25rem;
    border-radius: 999px;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: all 0.3s ease;
}

.btn-login:hover {
    background: rgba(201, 168, 76, 0.1);
    border-color: var(--gold-500);
    transform: translateY(-1px);
}

/* Mobile CTA */
.mobile-cta-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.mobile-btn {
    width: 100%;
    justify-content: center;
}

/* Burger */
.burger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    margin-left: auto;
}

.burger-line {
    width: 24px;
    height: 1.5px;
    background: var(--gold-400);
    transition: all 0.3s ease;
    transform-origin: center;
}

.burger-line.open:nth-child(1) {
    transform: translateY(6.5px) rotate(45deg);
}

.burger-line.open:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
}

.burger-line.open:nth-child(3) {
    transform: translateY(-6.5px) rotate(-45deg);
}

/* Mobile menu */
.mobile-menu {
    max-height: 0;
    overflow: hidden;

    opacity: 0;
    pointer-events: none;

    background: rgba(3, 11, 24, 0.98);
    border-top: 1px solid rgba(201, 168, 76, 0.15);

    padding: 0 2rem;

    transition:
        max-height 0.4s ease,
        opacity 0.3s ease,
        padding 0.3s ease;
}

.mobile-menu.open {
    max-height: 500px;

    opacity: 1;
    pointer-events: auto;

    padding: 1.5rem 2rem 2rem;
}

.mobile-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1.5rem;
}

.mobile-link {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    padding: 0.875rem 0;
    width: 100%;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    transition: color 0.3s;
    opacity: 0;
    transform: translateX(-20px);
}

.mobile-menu.open .mobile-link {
    animation: slideIn 0.4s ease forwards;
    animation-delay: calc(var(--i) * 0.06s);
}

@keyframes slideIn {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.mobile-link:hover,
.mobile-link.active {
    color: var(--gold-400);
}

.mobile-cta {
    width: 100%;
    justify-content: center;
    clip-path: none;
}

@media (max-width: 900px) {
    .nav-inner {
        padding: 1rem 1rem;
    }

    .smk-nav {
        padding: 0;
    }

    /* .logo-secondary {
        display: none;
    } */

    .nav-links,
    .nav-cta {
        display: none;
    }

    .burger {
        display: flex;
    }
}
</style>