<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { Link } from '@inertiajs/vue3'
import { useTheme } from '@/Composables/useTheme'

const isScrolled = ref(false)
const scrollRoot = inject('scrollRoot')
const { isDark, initTheme, toggleTheme } = useTheme()

const CENTRAL_HOST_MAP = {
    'partner.lumiverse.co.id': 'lumiverse.co.id',
    'about.lumiverse.co.id': 'lumiverse.co.id',
    'article.lumiverse.co.id': 'lumiverse.co.id',
    'partner.localhost': 'localhost',
    'about.localhost': 'localhost',
    'article.localhost': 'localhost',
}

const homeUrl = computed(() => {
    if (typeof window === 'undefined') return '/'
    const { protocol, hostname, port } = window.location
    const targetHost = CENTRAL_HOST_MAP[hostname] ?? hostname
    return `${protocol}//${targetHost}${port ? ':' + port : ''}/`
})

function handleScroll() {
    isScrolled.value = (scrollRoot?.value?.scrollTop ?? 0) > 40
}

// initTheme() idempotent — aman walau layout/halaman lain juga memanggilnya
initTheme()

onMounted(() => {
    scrollRoot?.value?.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    scrollRoot?.value?.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <nav class="navbar" :class="{ scrolled: isScrolled }" role="navigation" aria-label="Main navigation">
        <div class="navbar-bg" aria-hidden="true"></div>

        <div class="container">
            <div class="navbar-content">
                <a :href="homeUrl" class="nav-logo">
                    <img src="/images/logo-dark.webp" alt="Lumiverse School"
                        class="h-7 sm:h-9 object-cover scale-125 sm:scale-150 flex mt-1" />
                    <div class="text-xl sm:text-2xl font-semibold logo-text-static">
                        Lumiverse <span class="text-[var(--cyan-dim)] logo-suffix">Partnership</span>
                    </div>
                </a>

                <div class="nav-actions">
                    <button class="theme-toggle" role="switch" :aria-checked="isDark" aria-label="Toggle dark mode"
                        @click="toggleTheme">
                        <span class="theme-track">
                            <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" />
                                <path
                                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            </svg>
                            <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor"
                                    stroke-width="2" stroke-linejoin="round" fill="currentColor" />
                            </svg>
                            <span class="theme-thumb" :class="{ 'is-dark': isDark }"></span>
                        </span>
                    </button>

                    <Link :href="route('login')" class="btn-ghost" prefetch>Masuk</Link>
                    <Link :href="route('login')" class="btn-primary" prefetch>
                        <span class="full-label">Daftar Sekarang</span>
                        <span class="short-label">Daftar</span>
                    </Link>
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
    transform: translateZ(0);
    will-change: transform;
}

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
    will-change: background, backdrop-filter;
}

.navbar.scrolled .navbar-bg {
    background: var(--nav-scroll-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom-color: var(--border);
}

.navbar-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 0;
}

/* Logo */
.nav-logo {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 1;
    min-width: 0;
}

.logo-text-static {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    white-space: nowrap;
}

/* Label pendek untuk tombol daftar — disembunyikan di desktop */
.short-label {
    display: none;
}

/* Actions */
.nav-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
}

.btn-ghost {
    font-size: 1rem;
    font-weight: 600;
    color: var(--muted);
    font-family: var(--font-body);
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
    font-weight: 600;
    padding: 0.45rem 1.1rem;
    border-radius: 100px;
    background: var(--cyan);
    /* background: linear-gradient(135deg, var(--cyan), var(--cyan-dim)); */
    font-family: var(--font-body);
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

/* ── Dark mode toggle ──────────────────────────────────
   Pill-shaped switch dengan sun/moon icon yang fade + rotate
   saat state berpindah, thumb geser dengan spring-like ease.
*/
.theme-toggle {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
}

.theme-track {
    position: relative;
    width: 52px;
    height: 28px;
    border-radius: 100px;
    background: var(--glass);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 6px;
    justify-content: space-between;
    transition: background 0.3s ease, border-color 0.3s ease;
}

.theme-toggle:hover .theme-track {
    border-color: var(--cyan-dim);
}

.icon {
    width: 14px;
    height: 14px;
    position: relative;
    z-index: 1;
    transition: color 0.3s ease, opacity 0.3s ease, transform 0.4s ease;
}

.icon-sun {
    color: #ffb020;
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

.icon-moon {
    color: var(--muted);
    opacity: 0.6;
    transform: rotate(0deg) scale(1);
}

.theme-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
    z-index: 0;
}

.theme-thumb.is-dark {
    transform: translateX(24px);
    background: linear-gradient(135deg, #2b3556, #1a2138);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
}

/* Saat thumb ada di posisi sun (light), sun icon jelas, moon redup */
.theme-track:has(.theme-thumb:not(.is-dark)) .icon-sun {
    opacity: 1;
    transform: scale(1.05);
}

.theme-track:has(.theme-thumb:not(.is-dark)) .icon-moon {
    opacity: 0.35;
}

/* Saat dark, moon jelas, sun redup */
.theme-track:has(.theme-thumb.is-dark) .icon-moon {
    opacity: 1;
    color: #cbd5f5;
    transform: scale(1.05);
}

.theme-track:has(.theme-thumb.is-dark) .icon-sun {
    opacity: 0.35;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
    .container {
        max-width: 95vw;
        margin: 0 auto;
        padding: 0 0.5rem;
    }

    .navbar-content {
        padding: 1rem 0;
        gap: 0.5rem;
    }

    .nav-logo {
        gap: 0.4rem;
    }

    .logo-text-static {
        margin-left: -4px;
    }

    .nav-actions {
        gap: 0.4rem;
    }

    .theme-toggle {
        display: none;
    }

    .btn-ghost {
        padding: 0.4rem 0.65rem;
        font-size: 0.85rem;
    }

    .btn-primary {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
    }

    .theme-track {
        width: 44px;
        height: 24px;
    }

    .theme-thumb {
        width: 18px;
        height: 18px;
    }

    .theme-thumb.is-dark {
        transform: translateX(20px);
    }
}

/* Layar sangat sempit (HP kecil) — singkat-kan label & susutkan logo
   supaya navbar tidak pernah overflow horizontal */
@media (max-width: 400px) {
    /* .logo-suffix {
        display: none;
    } */

    .logo-text-static {
        font-size: 1rem;
    }

    .full-label {
        display: none;
    }

    .short-label {
        display: inline;
    }

    .nav-actions {
        gap: 0.3rem;
    }

    .btn-ghost {
        padding: 0.35rem 0.5rem;
        font-size: 0.8rem;
    }

    .btn-primary {
        display: none;
    }

    .theme-track {
        width: 38px;
        height: 22px;
    }

    .theme-thumb {
        width: 16px;
        height: 16px;
    }

    .theme-thumb.is-dark {
        transform: translateX(16px);
    }
}
</style>