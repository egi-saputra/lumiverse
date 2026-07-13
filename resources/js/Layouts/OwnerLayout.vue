<script setup>
import { useTenant } from '@/Composables/useTenant.js'
import { useForm, Link, usePage } from '@inertiajs/vue3'
import { ref, computed, onMounted } from 'vue'
import {
    Bars3Icon,
    Squares2X2Icon,
    BuildingLibraryIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    UsersIcon,
    DocumentCurrencyDollarIcon,
    ArrowLeftOnRectangleIcon,
    SunIcon,
    MoonIcon,
    ClockIcon
} from '@heroicons/vue/24/outline'

const page = usePage()
const sidebarOpen = ref(false)

const pendingInvoiceCount = computed(() => page.props.pendingInvoiceCount ?? 0)
const currentPath = computed(() => page.url.split('?')[0].split('#')[0])

const logoutForm = useForm({})
function logout() {
    logoutForm.post(route('owner.logout'))
}

function isActive(href) {
    return currentPath.value === href
}

/* ─── Dark Mode ──────────────────────────────────────────── */
// const isDark = ref(false)

// function applyTheme(dark) {
//     document.documentElement.classList.toggle('dark', dark)
//     localStorage.setItem('theme', dark ? 'dark' : 'light')
// }

// function toggleDarkMode() {
//     isDark.value = !isDark.value
//     applyTheme(isDark.value)
// }

// onMounted(() => {
//     const theme = localStorage.getItem('theme')
//     isDark.value = theme === 'dark'
//     applyTheme(isDark.value)
// })

/* ─── Dark Mode — dipaksa selalu aktif untuk Owner area ──── */
onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>
    <div class="app-shell">
        <!-- Mobile backdrop -->
        <div v-if="sidebarOpen" class="sidebar-backdrop" @click="sidebarOpen = false" />

        <!-- ── Sidebar ── -->
        <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
            <div class="sidebar-logo font-poppins">
                <img src="/images/logo-dark.webp" alt="Lumiverse" class="h-7 object-cover scale-150 sm:flex hidden" />
                <span>LUMIVERSE</span>
            </div>

            <nav class="sidebar-nav">
                <Link href="/lumiverse/dashboard" class="nav-item"
                    :class="{ 'nav-item-active': isActive('/lumiverse/dashboard') }" prefetch
                    @click="sidebarOpen = false">
                    <Squares2X2Icon class="nav-icon" />
                    Dashboard Admin
                </Link>

                <Link href="/lumiverse/profil" class="nav-item"
                    :class="{ 'nav-item-active': currentPath.startsWith('/lumiverse/profil') }" prefetch
                    @click="sidebarOpen = false">
                    <BuildingLibraryIcon class="nav-icon" />
                    Lembaga / Institusi
                </Link>

                <Link href="/lumiverse/users" class="nav-item"
                    :class="{ 'nav-item-active': currentPath.startsWith('/lumiverse/users') }" prefetch
                    @click="sidebarOpen = false">
                    <UsersIcon class="nav-icon" />
                    Kelola Pengguna
                </Link>

                <Link href="/lumiverse/pricing" class="nav-item"
                    :class="{ 'nav-item-active': isActive('/lumiverse/pricing') }" prefetch
                    @click="sidebarOpen = false">
                    <DocumentCurrencyDollarIcon class="nav-icon" />
                    Upgrade Premium
                </Link>

                <Link href="/lumiverse/subscription/history" class="nav-item"
                    :class="{ 'nav-item-active': isActive('/lumiverse/subscription/history') }" prefetch
                    @click="sidebarOpen = false">
                    <ClockIcon class="nav-icon" />
                    Riwayat Pembayaran
                    <span v-if="pendingInvoiceCount > 0" class="nav-badge">{{ pendingInvoiceCount }}</span>
                </Link>
            </nav>

            <div class="sidebar-footer">
                <!-- <button @click="toggleDarkMode" class="nav-item">
                    <SunIcon v-if="isDark" class="nav-icon" />
                    <MoonIcon v-else class="nav-icon" />
                    {{ isDark ? 'Mode Terang' : 'Mode Gelap' }}
                </button> -->

                <a href="#teknis" class="nav-item" @click="sidebarOpen = false">
                    <Cog6ToothIcon class="nav-icon" />
                    Panduan Pengguna
                </a>
                <button @click="logout" class="nav-item nav-item-logout">
                    <ArrowLeftOnRectangleIcon class="nav-icon" />
                    Keluar Dari Aplikasi
                </button>
            </div>
        </aside>

        <!-- ── Main column ── -->
        <div class="main-col">
            <header class="topbar">
                <div class="topbar-content">
                    <slot name="header">...</slot>
                </div>
                <button class="hamburger" @click="sidebarOpen = true" aria-label="Buka menu">
                    <Bars3Icon class="hamburger-icon" />
                </button>
            </header>

            <main class="content-scroll">
                <div class="content-inner">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
/* ── Shell ─────────────────────────────────────────────────── */
.app-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: var(--midnight);
}

/* ── Sidebar ────────────────────────────────────────────────── */
.sidebar {
    width: 232px;
    flex-shrink: 0;
    background: var(--navy);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}

/* Logo area */
.sidebar-logo {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    gap: 0.25rem;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.04em;
    padding: 1.25rem 1.25rem 1.1rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
}

.sidebar-logo-mark {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--midnight);
    font-weight: 900;
    font-size: 0.75rem;
    flex-shrink: 0;
}

/* Nav */
.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    padding: 0.85rem 0.75rem 0.5rem;
}

.nav-item {
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.75rem;
    border-radius: 8px;
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--muted);
    text-decoration: none;
    cursor: pointer;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    transition: color 0.15s, background 0.15s;
    line-height: 1;
}

.nav-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 100px;
    background: #fb2424;
    color: #111827;
    font-size: 0.68rem;
    font-weight: 800;
    line-height: 1;
    flex-shrink: 0;
}

.nav-icon {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    opacity: 0.7;
    transition: opacity 0.15s;
}

.nav-item:hover {
    color: var(--white);
    background: rgba(255, 255, 255, 0.05);
}

.nav-item:hover .nav-icon {
    opacity: 1;
}

.nav-item-active {
    color: var(--cyan);
    background: rgba(0, 212, 255, 0.08);
    font-weight: 600;
}

.nav-item-active .nav-icon {
    opacity: 1;
}

/* Footer */
.sidebar-footer {
    padding: 0.75rem;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
}

.nav-item-logout:hover {
    color: #fb7185;
    background: rgba(251, 113, 133, 0.07);
}

.sidebar-backdrop {
    display: none;
}

/* ── Main column ────────────────────────────────────────────── */
.main-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-width: 0;
}

/* Topbar */
.topbar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1.75rem;
    height: 67px;
    border-bottom: 1px solid var(--border);
    background: var(--midnight);
}

.topbar-content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
}

:deep(.topbar-title) {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1rem;
    color: var(--white);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.15s, border-color 0.15s;
}

.hamburger-icon {
    width: 20px;
    height: 20px;
}

.hamburger:hover {
    color: var(--white);
    border-color: rgba(255, 255, 255, 0.2);
}

/* Content */
.content-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
}

.content-inner {
    padding: 1.75rem 2rem;
}

/* ── Responsive ─────────────────────────────────────────────── */
@media (max-width: 900px) {
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 50;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
        box-shadow: 16px 0 48px rgba(0, 0, 0, 0.4);
    }

    .sidebar-open {
        transform: translateX(0);
    }

    .sidebar-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        z-index: 40;
    }

    .hamburger {
        display: flex;
    }

    .content-inner {
        padding: 1.25rem;
    }
}
</style>