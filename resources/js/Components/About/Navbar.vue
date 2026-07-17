<script setup>
import { ref, onMounted, onUnmounted, inject, computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()
const isScrolled = ref(false)
const isMenuOpen = ref(false)
const scrollRoot = inject('scrollRoot')

// ─── Utilities ──────────────────────────────────────────────────────────
function isIpOrLocalhost(hostname) {
    return hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
}

const centralDomain = computed(() => {
    const hostname = window.location.hostname
    if (isIpOrLocalhost(hostname)) return 'localhost'
    return page.props.centralDomain ?? hostname
})

const protocolPort = computed(() => {
    const protocol = window.location.protocol
    const port = window.location.port ? `:${window.location.port}` : ''
    return { protocol, port }
})

// Subdomain aktif saat ini — null kalau di central domain (halaman "/")
const currentSubdomain = computed(() => {
    const hostname = window.location.hostname
    const base = centralDomain.value
    if (hostname === base) return null
    return hostname.replace(`.${base}`, '')
})

function subdomainUrl(prefix) {
    const { protocol, port } = protocolPort.value
    if (!prefix) return `${protocol}//${centralDomain.value}${port}/`
    return `${protocol}//${prefix}.${centralDomain.value}${port}/`
}

// ─── Menu — tiap item = 1 subdomain (kosong berarti central domain "/") ───
const navItems = [
    { key: null, label: 'Beranda' },
    { key: 'about', label: 'Tentang Kami' },
    { key: 'article', label: 'Artikel' },
    { key: 'docs', label: 'Dokumentasi' },
]

function isCurrent(key) {
    return currentSubdomain.value === key
}

// ─── Efek blur/background navbar saat scroll ───────────────────────────
function handleScroll() {
    isScrolled.value = (scrollRoot?.value?.scrollTop ?? 0) > 40
}

onMounted(() => {
    scrollRoot?.value?.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    scrollRoot?.value?.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <nav class="navbar" :class="{ scrolled: isScrolled, 'menu-open': isMenuOpen }" role="navigation"
        aria-label="Main navigation">
        <div class="navbar-bg" aria-hidden="true"></div>

        <div class="container">
            <div class="navbar-content">
                <a :href="subdomainUrl(null)" class="nav-logo">
                    <img src="/images/logo-dark.webp" alt="Lumiverse School" class="h-8 object-cover scale-150 flex" />
                    <div class="text-2xl font-semibold logo-text-static">
                        Lumiverse <span class="text-cyan">School</span>
                    </div>
                </a>

                <ul class="nav-links" role="list">
                    <li v-for="item in navItems" :key="item.label">
                        <a v-if="!isCurrent(item.key)" :href="subdomainUrl(item.key)">{{ item.label }}</a>
                        <span v-else class="nav-current">{{ item.label }}</span>
                    </li>
                    <li><a :href="subdomainUrl(null) + '#kontak'">Kontak</a></li>
                </ul>

                <div class="nav-actions">
                    <Link href="/lumiverse/login" class="btn-ghost">Login</Link>
                    <Link href="/registration" class="btn-primary">Coba Gratis</Link>
                </div>

                <button class="nav-toggle" :aria-expanded="isMenuOpen" aria-label="Buka menu"
                    @click="isMenuOpen = !isMenuOpen">
                    <span class="burger-line" :class="{ open: isMenuOpen }"></span>
                    <span class="burger-line" :class="{ open: isMenuOpen }"></span>
                    <span class="burger-line" :class="{ open: isMenuOpen }"></span>
                </button>
            </div>

            <div class="mobile-menu" :class="{ open: isMenuOpen }">
                <ul class="mobile-links">
                    <li v-for="(item, i) in navItems" :key="item.label" :style="`--i: ${i}`">
                        <a v-if="!isCurrent(item.key)" class="mobile-link" :href="subdomainUrl(item.key)">
                            {{ item.label }}
                        </a>
                        <span v-else class="mobile-link nav-current">{{ item.label }}</span>
                    </li>
                    <li :style="`--i: ${navItems.length}`">
                        <a class="mobile-link" :href="subdomainUrl(null) + '#kontak'">Kontak</a>
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
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    /* GPU layer — tidak ada reflow saat scroll */
    transform: translateZ(0);
    will-change: transform;
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

.nav-current {
    color: var(--cyan);
    font-weight: 700;
    cursor: default;
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

/* Wrapper teks logo */
.logo-text-static {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
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

    /* Menu mobile memenuhi sisa layar, CTA menempel di bawah */
    .navbar.menu-open {
        height: 100vh;
        height: 100dvh;
    }

    .navbar.menu-open .container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .navbar.menu-open .mobile-menu {
        flex: 1;
        max-height: none;
        height: auto;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .navbar.menu-open .mobile-cta-group {
        margin-top: auto;
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