<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()
const isScrolled = ref(false)
const isMenuOpen = ref(false)

const navItems = [
    { id: 'hero', href: '#hero', label: 'Beranda' },
    // { id: 'about', href: '#about', label: 'Tentang Kami' },
    { id: 'fitur', href: '#fitur', label: 'Fitur Aplikasi' },
    { id: 'cara-kerja', href: '#cara-kerja', label: 'Dokumentasi' },
    // { id: 'harga', href: '#harga', label: 'Paket Harga' },
    { id: 'testimonial', href: '#testimonial', label: 'Testimoni' },
    { id: 'legalitas', href: '#legalitas', label: 'Legalitas' },
    { id: 'kontak', href: '#kontak', label: 'Kontak' },
]

// Varian nama brand — bergantian tiap 2.5 detik, sinkron dengan tema Hero (LMS/Workspace)
const brandVariants = [
    { prefix: 'Lumi', suffix: 'School' },
    // { prefix: 'Lumi', suffix: 'Class' },
    { prefix: 'Lumi', suffix: 'Workspace' },
]
const activeBrand = ref(0)
let brandIntervalId = null

function handleScroll() {
    isScrolled.value = window.scrollY > 40
}

function scrollTo(id) {
    isMenuOpen.value = false
    // Delay sedikit biar dropdown selesai tutup dulu
    setTimeout(() => {
        const el = document.querySelector(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
}

function handleLogoClick() {
    if (window.location.pathname === '/') {
        // Sudah di homepage — scroll ke atas saja
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
        // Dari halaman lain — navigate biasa
        window.location.href = '/'
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    brandIntervalId = setInterval(() => {
        activeBrand.value = (activeBrand.value + 1) % brandVariants.length
    }, 2500)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (brandIntervalId) clearInterval(brandIntervalId)
})
</script>

<template>
    <nav class="navbar" :class="{ scrolled: isScrolled, 'menu-open': isMenuOpen }" role="navigation"
        aria-label="Main navigation">
        <!-- Layer backdrop terpisah — tidak mempengaruhi layout konten -->
        <div class="navbar-bg" aria-hidden="true"></div>

        <div class="container">
            <div class="navbar-content">
                <a href="/" class="nav-logo" @click.prevent="handleLogoClick">
                    <img src="/images/logo-dark.png" alt="Lumiverse" class="h-8 object-cover scale-150 flex" />
                    <div class="text-2xl font-semibold logo-text-static">
                        Lumiverse
                        <!-- <span class="logo-text-wrap sm:inline-flex hidden">
                            <Transition name="slide-up">
                                <span :key="activeBrand" class="logo-text-inner text-cyan">{{
                                    brandVariants[activeBrand].suffix }}</span>
                            </Transition>
                        </span> -->
                    </div>
                </a>

                <ul class="nav-links" role="list">
                    <li><a href="#hero" @click.prevent="scrollTo('#hero')">Beranda</a></li>
                    <!-- <li><a href="#about" @click.prevent="scrollTo('#about')">Tentang Kami</a></li> -->
                    <li><a href="#fitur" @click.prevent="scrollTo('#fitur')">Fitur Aplikasi</a></li>
                    <li><a href="#cara-kerja" @click.prevent="scrollTo('#cara-kerja')">Dokumentasi</a></li>
                    <li><a href="#harga" @click.prevent="scrollTo('#harga')">Paket Harga</a></li>
                    <li><a href="#testimonial" @click.prevent="scrollTo('#testimonial')">Testimoni</a></li>
                    <!-- <li><a href="#legalitas" @click.prevent="scrollTo('#legalitas')">Legalitas</a></li> -->
                </ul>

                <div class="nav-actions">
                    <Link href="/lumiverse/login" class="btn-ghost">Login</Link>
                    <Link href="/registration" class="btn-primary">Coba Gratis</Link>
                    <!-- <Link href="/lumiverse/login" class="btn-primary">Login</Link> -->
                </div>

                <!-- Burger animasi (rotate jadi X) menggantikan icon SVG statis -->
                <button class="nav-toggle" :aria-expanded="isMenuOpen" aria-label="Buka menu"
                    @click="isMenuOpen = !isMenuOpen">
                    <span class="burger-line" :class="{ open: isMenuOpen }"></span>
                    <span class="burger-line" :class="{ open: isMenuOpen }"></span>
                    <span class="burger-line" :class="{ open: isMenuOpen }"></span>
                </button>
            </div>

            <!-- Mobile dropdown menu — max-height + staggered slide-in, menggantikan full-screen overlay -->
            <div class="mobile-menu" :class="{ open: isMenuOpen }">
                <ul class="mobile-links">
                    <li v-for="(item, i) in navItems" :key="item.id" :style="`--i: ${i}`">
                        <a class="mobile-link" :href="item.href" @click.prevent="scrollTo(item.href)">
                            {{ item.label }}
                        </a>
                    </li>
                </ul>

                <div class="mobile-cta-group">
                    <Link href="/lumiverse/login" class="btn-mob-ghost" @click="isMenuOpen = false">Masuk</Link>
                    <Link href="/registration" class="btn-mob-cta" @click="isMenuOpen = false">Coba Gratis</Link>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
/* ── Navbar ─────────────────────────────────────────── */
.navbar {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    /* GPU layer — tidak ada reflow saat scroll */
    /* transform: translateZ(0);
    will-change: transform; */
}

/* Backdrop sebagai layer terpisah — tidak menggeser layout konten */
.navbar-bg {
    position: absolute;
    inset: 0;
    background: transparent;
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    border-bottom: 1px solid transparent;
    transition:
        background 0.3s ease,
        border-color 0.3s ease,
        backdrop-filter 0.3s ease;
    /* Layer sendiri biar blur tidak trigger repaint navbar */
    will-change: background, backdrop-filter;
}

.navbar.scrolled .navbar-bg,
.navbar.menu-open .navbar-bg {
    background: rgba(11, 17, 32, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom-color: var(--border);
}

/* Konten navbar di atas backdrop layer */
.navbar-content {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 0;
}

/* Logo */
.nav-logo {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
    justify-self: start;
}

.nav-logo-mark {
    width: 34px;
    height: 34px;
    background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1rem;
    color: var(--midnight);
    flex-shrink: 0;
}

/* Wrapper teks logo — overflow hidden supaya animasi tidak dorong elemen lain */
.logo-text-static {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
}

.logo-text-wrap {
    position: relative;
    overflow: hidden;
    height: 1.75rem;
    line-height: 1.75rem;
    vertical-align: middle;
}

.logo-text-inner {
    display: inline-block;
    white-space: nowrap;
}

.nav-logo-text {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 0.95rem;
    line-height: 1.1;
}

.nav-logo-text span {
    color: var(--cyan);
}

/* Desktop links */
.nav-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    justify-self: center;
}

.nav-links a {
    font-size: 1rem;
    font-weight: 500;
    color: var(--muted);
    transition: color 0.15s;
    white-space: nowrap;
    cursor: pointer;
}

.nav-links a:hover {
    color: var(--white);
}

/* Desktop actions */
.nav-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    justify-self: end;
}

.btn-ghost {
    font-size: 1rem;
    font-weight: 600;
    color: var(--muted);
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    border: none;
    background: none;
    transition: color 0.15s, background 0.15s;
    cursor: pointer;
    white-space: nowrap;
}

.btn-ghost:hover {
    color: var(--white);
    background: var(--glass);
}

.btn-primary {
    font-size: 1rem;
    font-weight: 700;
    padding: 0.45rem 1.1rem;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
    color: var(--midnight);
    border: none;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
}

/* ── Burger (animasi rotate ke X) ─────────────────────── */
.nav-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.15s;
    flex-shrink: 0;
    justify-self: end;
    grid-column: 3;
}

@media (max-width: 768px) {
    .container {
        padding: 0 0.5rem;
    }

    .navbar-content {
        grid-template-columns: 1fr 1fr;
    }

    .nav-links {
        display: none;
    }

    .nav-actions {
        display: none;
    }

    .nav-toggle {
        display: flex;
        grid-column: 2;
    }
}

.nav-toggle:hover {
    background: var(--glass);
}

.burger-line {
    width: 22px;
    height: 2px;
    background: var(--white);
    border-radius: 1px;
    transition: all 0.3s ease;
    transform-origin: center;
}

.burger-line.open:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}

.burger-line.open:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
}

.burger-line.open:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}

/* ── Mobile dropdown menu ──────────────────────────────
   Menggantikan full-screen Teleport overlay dengan dropdown
   max-height seperti navbar referensi, lengkap dengan
   staggered slide-in pada tiap link.
*/
.mobile-menu {
    position: relative;
    z-index: 1;

    max-height: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;

    border-top: 1px solid transparent;

    transition:
        max-height 0.4s ease,
        opacity 0.3s ease,
        padding 0.3s ease,
        border-color 0.3s ease;
}

.mobile-menu.open {
    max-height: 600px;
    opacity: 1;
    pointer-events: auto;
    border-top-color: var(--border);
    padding: 1.25rem 0 calc(1.5rem + env(safe-area-inset-bottom));
}

.mobile-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    margin-bottom: 1.25rem;
}

.mobile-link {
    display: flex;
    align-items: center;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1rem;
    color: var(--muted);
    cursor: pointer;
    padding: 0.875rem 0.25rem;
    /* border-radius: 8px; */
    border-bottom: 1px solid var(--border);
    transition: color 0.15s, background 0.15s;

    opacity: 0;
    transform: translateX(-20px);
}

.mobile-menu.open .mobile-link {
    animation: navSlideIn 0.4s ease forwards;
    animation-delay: calc(var(--i) * 0.06s);
}

@keyframes navSlideIn {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.mobile-link:hover {
    color: var(--white);
    background: var(--glass);
}

.mobile-links li:last-child .mobile-link {
    border-bottom: none;
}

.mobile-cta-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.btn-mob-ghost {
    width: 100%;
    padding: 0.8rem;
    border-radius: 10px;
    background: var(--glass);
    border: 1px solid var(--border);
    color: var(--white);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    text-align: center;
    transition: background 0.15s;
    display: block;
}

.btn-mob-ghost:hover {
    background: rgba(255, 255, 255, 0.08);
}

.btn-mob-cta {
    width: 100%;
    padding: 0.85rem;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
    color: var(--midnight);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    border: none;
    text-align: center;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 0 24px rgba(0, 212, 255, 0.25);
    display: block;
}

.btn-mob-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 36px rgba(0, 212, 255, 0.4);
}

/* ── Transisi slide-up untuk logo text (sama gaya dengan badge Hero) ── */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
}

.slide-up-leave-active {
    position: absolute;
    top: 0;
    left: 0;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(100%);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
    .nav-links {
        display: none;
    }

    .nav-actions {
        display: none;
    }

    .nav-toggle {
        display: flex;
    }
}
</style>