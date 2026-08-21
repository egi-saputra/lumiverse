<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePage, router } from '@inertiajs/vue3'
import { ToastAlert } from '@/Composables/ToastAlert.js'
import { onClickOutside } from '@vueuse/core'

import Dropdown from '@/Components/Dropdown.vue'
import DropdownLink from '@/Components/DropdownLink.vue'
import ResponsiveNavLink from '@/Components/ResponsiveNavLink.vue'

import AdminSidebar from '@/Components/Admin/Sidebar.vue'
import ProktorSidebar from '@/Components/Proktor/Sidebar.vue'
import GuruSidebar from '@/Components/Guru/Sidebar.vue'
import SiswaSidebar from '@/Components/Siswa/Sidebar.vue'

import { BellIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'

/* ─── Props ─────────────────────────────────────────────── */
const props = defineProps({
    disableSwal: { type: Boolean, default: false },
    // logoUrl: { type: String, default: '/images/logo.png' },
})

const page = usePage()
const { success, error } = ToastAlert()

/* ─── Flash Messages ─────────────────────────────────────── */
onMounted(() => {
    if (props.disableSwal) return
    if (page.props.flash?.success) success(page.props.flash.success)
    if (page.props.flash?.error) error(page.props.flash.error)
})

watch(
    () => page.props.flash,
    flash => {
        if (props.disableSwal) return
        if (flash?.success) success(flash.success)
        if (flash?.error) error(flash.error)
    }
)

/* ─── Notification / Pengumuman Bell ────────────────────── */
const showingNotifDropdown = ref(false)
const notifDropdownRef = ref(null)
const bellButtonRef = ref(null)

// localStorage key per-user untuk isolasi antar akun
const userId = page.props.auth?.user?.id ?? 'guest'
const storageKey = `readPengumuman_${userId}`
const readIds = ref(new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')))

const persistRead = () => {
    localStorage.setItem(storageKey, JSON.stringify([...readIds.value]))
}

// Ambil daftar pengumuman dari shared prop (diisi HandleInertiaRequests)
const pengumumanList = computed(() => {
    const role = page.props.auth?.role ?? ''
    if (!role) return []

    return (page.props.announcements ?? []).filter(item => {
        if (item.penerima === 'semua') return true
        if (item.penerima === role) return true
        if (role === 'siswa' && item.kelas_id) {
            return Number(item.kelas_id) === Number(page.props.kelasId)
        }
        return false
    })
})

// 10 pengumuman terbaru untuk dropdown
const recentPengumuman = computed(() =>
    [...pengumumanList.value]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10)
)

const isUnread = id => !readIds.value.has(id)
const unreadCount = computed(() => recentPengumuman.value.filter(p => isUnread(p.id)).length)

const toggleNotifDropdown = () => {
    showingNotifDropdown.value = !showingNotifDropdown.value

    // Tandai semua yang muncul di dropdown sebagai terbaca
    if (showingNotifDropdown.value) {
        recentPengumuman.value.forEach(p => readIds.value.add(p.id))
        persistRead()
    }
}

const goToAnnouncement = id => {
    showingNotifDropdown.value = false
    router.visit(route('pengumuman.index', id ? { id } : {}))
}

onClickOutside(notifDropdownRef, () => (showingNotifDropdown.value = false), { ignore: [bellButtonRef] })

const refreshAnnouncements = () => {
    if (!page.props.auth?.user) return

    router.reload({
        only: ['announcements'],
        preserveState: true,
        preserveScroll: true,
    })
}

const announcementRefreshTimer = setInterval(refreshAnnouncements, 30000)
onUnmounted(() => clearInterval(announcementRefreshTimer))

/* ─── Nav Dropdown ───────────────────────────────────────── */
const showingNavigationDropdown = ref(false)
const dropdownMenu = ref(null)
const toggleButton = ref(null)

onClickOutside(dropdownMenu, () => (showingNavigationDropdown.value = false), { ignore: [toggleButton] })

/* ─── Sidebar ────────────────────────────────────────────── */
const SidebarComponent = computed(() => {
    switch (page.props.auth.role) {
        case 'admin': return AdminSidebar
        case 'proktor': return ProktorSidebar
        case 'guru': return GuruSidebar
        case 'siswa': return SiswaSidebar
        default: return null
    }
})

/* ─── Dashboard Route ────────────────────────────────────── */
const dashboardHref = computed(() => {
    switch (page.props.auth.role) {
        case 'admin': return route('admin.dashboard')
        case 'proktor': return route('proktor.dashboard')
        case 'guru': return route('guru.dashboard')
        case 'siswa': return route('siswa.dashboard')
        default: return route('dashboard')
    }
})

/* ─── Nav Links ──────────────────────────────────────────── */
const navLinks = computed(() => {
    const role = page.props.auth.role
    const shared = [{ name: 'Profile', href: route('profile.edit') }]
    return shared
})

/* ─── Dark Mode ──────────────────────────────────────────── */
const isDark = ref(false)

const applyTheme = dark => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
}

const toggleDarkMode = () => {
    const layer = document.getElementById('theme-transition-layer')
    layer.classList.remove('reveal-in', 'reveal-out')
    layer.classList.add('reveal-in')

    setTimeout(() => {
        isDark.value = !isDark.value
        applyTheme(isDark.value)
    }, 600)

    setTimeout(() => {
        layer.classList.remove('reveal-in')
        layer.classList.add('reveal-out')
    }, 600)

    setTimeout(() => {
        layer.classList.remove('reveal-out')
        layer.style.clipPath = 'circle(0% at 0% 0%)'
    }, 1200)
}

onMounted(() => {
    const theme = localStorage.getItem('theme')
    isDark.value = theme === 'dark'
    applyTheme(isDark.value)
})

/* ─── Logout ─────────────────────────────────────────────── */
const logout = () => router.post(route('logout'))
</script>

<template>
    <div id="theme-transition-layer" />
    <div class="h-screen bg-gray-100 dark:bg-[#063970] flex flex-col overflow-hidden">

        <!-- ══════════ NAVBAR ══════════ -->
        <nav class="bg-white dark:bg-[#041C32] sm:dark:bg-[#0F172A]
                    border-b border-gray-300 dark:sm:border-gray-700 dark:border-[#1e1b4b]
                    sticky top-0 z-50">
            <div class="mx-auto sm:px-6 px-2">
                <div class="flex justify-between h-16 items-center">

                    <!-- LEFT: Logo + Name -->
                    <div class="flex items-center">
                        <img :src="page.props.tenant?.logo ?? '/images/default.png'" :alt="page.props.tenant?.name"
                            class="h-10 sm:block hidden object-contain" alt="Logo Sekolah" loading="lazy" />
                        <span class="sm:text-lg text-base ml-3 uppercase
                                     font-raleway font-extrabold
                                     dark:text-white text-[#063970]">
                            {{ page.props.tenant?.name ?? "Lumiverse School" }}
                        </span>
                    </div>

                    <!-- RIGHT -->
                    <div class="flex items-center gap-1">

                        <!-- Dark Mode Toggle — Desktop -->
                        <button @click="toggleDarkMode" title="Toggle Dark Mode" class="relative mr-2 sm:flex hidden w-16 h-8 rounded-full
                                       backdrop-blur-xl bg-white/60 dark:bg-slate-900/60
                                       border border-white/40 dark:border-white/10
                                       shadow-inner shadow-black/10 dark:shadow-black/40
                                       transition-all duration-300">
                            <SunIcon
                                class="absolute left-2  top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 transition-opacity duration-300"
                                :class="isDark ? 'opacity-90' : 'opacity-100'" />
                            <MoonIcon
                                class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 transition-opacity duration-300"
                                :class="isDark ? 'opacity-100' : 'opacity-60'" />
                            <span class="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                                         backdrop-blur-md bg-white/80 dark:bg-slate-800
                                         shadow-md shadow-black/20
                                         transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
                                :class="isDark ? 'translate-x-8' : 'translate-x-1'" />
                        </button>

                        <!-- Dark Mode Toggle — Mobile -->
                        <button @click="toggleDarkMode" title="Toggle Dark Mode" class="relative mr-1 sm:hidden w-14 h-8 rounded-full
                                       backdrop-blur-xl bg-white/60 dark:bg-slate-900/60
                                       border border-white/40 dark:border-white/10
                                       shadow-inner shadow-black/10 dark:shadow-black/40
                                       transition-all duration-300">
                            <SunIcon
                                class="absolute left-2  top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 transition-opacity duration-300"
                                :class="isDark ? 'opacity-30' : 'opacity-100'" />
                            <MoonIcon
                                class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 transition-opacity duration-300"
                                :class="isDark ? 'opacity-100' : 'opacity-30'" />
                            <span class="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                                         backdrop-blur-md bg-white/80 dark:bg-slate-800/80
                                         shadow-md shadow-black/20
                                         transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
                                :class="isDark ? '-translate-x-6' : 'translate-x-0'" />
                        </button>

                        <!-- ── Bell Notification (Pengumuman) ──────── -->
                        <div class="relative">
                            <button ref="bellButtonRef" @click="toggleNotifDropdown" aria-label="Notifikasi pengumuman"
                                class="relative p-2 rounded-full transition-colors
                                           hover:bg-gray-100 dark:hover:bg-white/10">
                                <BellIcon class="w-6 h-6 text-gray-500 dark:text-white" />

                                <!-- Badge: angka unread -->
                                <Transition enter-active-class="transition-all duration-200"
                                    enter-from-class="opacity-0 scale-50" enter-to-class="opacity-100 scale-100"
                                    leave-active-class="transition-all duration-150"
                                    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-50">
                                    <span v-if="unreadCount > 0" class="absolute -top-0.5 -right-0.5
                                               min-w-[18px] h-[18px] px-1
                                               flex items-center justify-center
                                               rounded-full text-[10px] font-bold leading-none
                                               bg-red-500 text-white
                                               ring-2 ring-white dark:ring-[#0F172A]
                                               shadow-sm">
                                        {{ unreadCount > 99 ? '99+' : unreadCount }}
                                    </span>
                                </Transition>
                            </button>

                            <!-- ── Notification Dropdown ────────────── -->
                            <Transition enter-active-class="transition ease-out duration-200"
                                enter-from-class="opacity-0 translate-y-2 scale-95"
                                enter-to-class="opacity-100 translate-y-0 scale-100"
                                leave-active-class="transition ease-in duration-150"
                                leave-from-class="opacity-100 translate-y-0 scale-100"
                                leave-to-class="opacity-0 translate-y-2 scale-95">
                                <div v-if="showingNotifDropdown" ref="notifDropdownRef" class="absolute -right-6 mt-2 z-30 w-80
                                           rounded-xl overflow-hidden
                                           backdrop-blur-xl
                                           bg-white/80 dark:bg-slate-900/80
                                           border border-white/40 dark:border-white/10
                                           shadow-xl shadow-black/10 dark:shadow-black/40">
                                    <!-- Header dropdown -->
                                    <div class="flex items-center justify-between
                                                px-4 py-3
                                                border-b border-gray-200 dark:border-white/10">
                                        <span
                                            class="flex items-center gap-2 font-semibold text-sm text-gray-700 dark:text-white">
                                            <BellIcon class="w-4 h-4 text-indigo-500" />
                                            Pengumuman
                                            <span v-if="unreadCount > 0" class="inline-flex items-center justify-center
                                                       min-w-[20px] h-5 px-1.5
                                                       rounded-full text-[10px] font-bold
                                                       bg-red-500 text-white">
                                                {{ unreadCount }}
                                            </span>
                                        </span>
                                        <button @click="goToAnnouncement()" class="text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300
                                                   font-medium transition-colors">
                                            Lihat Semua
                                        </button>
                                    </div>

                                    <!-- List pengumuman -->
                                    <ul class="divide-y divide-gray-100 dark:divide-white/10 max-h-72 overflow-y-auto">
                                        <li v-for="p in recentPengumuman" :key="p.id" @click="goToAnnouncement(p.id)"
                                            class="flex items-center gap-3 px-4 py-3
                                                   cursor-pointer transition
                                                   hover:bg-white/60 dark:hover:bg-white/5">
                                            <!-- Unread dot -->
                                            <span class="shrink-0 w-2 h-2 rounded-full transition-colors" :class="isUnread(p.id)
                                                ? 'bg-indigo-500'
                                                : 'bg-transparent'" />

                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-medium text-gray-700 dark:text-white truncate"
                                                    :class="{ 'font-semibold': isUnread(p.id) }">
                                                    {{ p.judul }}
                                                </p>
                                                <p class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5"
                                                    v-html="p.pengumuman" />
                                            </div>

                                            <ChevronRightIcon
                                                class="shrink-0 w-4 h-4 text-gray-300 dark:text-gray-600" />
                                        </li>

                                        <li v-if="recentPengumuman.length === 0"
                                            class="px-4 py-8 text-center text-sm italic text-gray-400 dark:text-gray-500">
                                            Tidak ada pengumuman masuk.
                                        </li>
                                    </ul>

                                    <!-- Footer dropdown -->
                                    <div class="px-4 py-2.5 border-t border-gray-100 dark:border-white/10 text-center">
                                        <button @click="goToAnnouncement()" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400
                                                   hover:underline transition">
                                            Buka Semua Pengumuman →
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                        <!-- ── End Bell ────────────────────────────── -->

                        <!-- User Dropdown — Desktop -->
                        <div class="hidden sm:flex sm:items-center sm:ml-2">
                            <Dropdown align="right">
                                <template #trigger>
                                    <button class="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                                                   border border-transparent
                                                   text-gray-500 dark:text-white bg-white dark:bg-[#0F172A]
                                                   hover:text-gray-700 dark:hover:text-gray-300 transition">
                                        {{ $page.props.auth.user.name }}
                                        <svg class="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </template>
                                <template #content>
                                    <DropdownLink :href="route('profile.edit')">Profile</DropdownLink>
                                    <DropdownLink as="button" @click="logout">Log Out</DropdownLink>
                                </template>
                            </Dropdown>
                        </div>

                        <!-- Ellipsis — Mobile -->
                        <div class="flex items-center sm:hidden">
                            <button ref="toggleButton" @click="showingNavigationDropdown = !showingNavigationDropdown"
                                class="p-2 rounded-md text-gray-500 dark:text-white
                                           hover:text-gray-800 dark:hover:text-gray-300 transition">
                                <EllipsisVerticalIcon class="w-6 h-6" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Mobile Dropdown Menu -->
            <Transition enter-active-class="transition-all ease-out duration-300"
                enter-from-class="opacity-0 -translate-y-3" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all ease-in duration-200" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-3">
                <div v-if="showingNavigationDropdown" ref="dropdownMenu" class="absolute right-3 top-14 z-50 w-56 rounded-2xl
                            backdrop-blur-xl
                            bg-white/70 dark:bg-slate-900/70
                            shadow-xl shadow-black/10 dark:shadow-black/40
                            border border-white/40 dark:border-white/10
                            origin-top">
                    <div class="py-2">
                        <ResponsiveNavLink v-for="link in navLinks" :key="link.name" :href="link.href" preserve-scroll
                            preserve-state :active="page.url.startsWith(link.href)" class="block px-4 py-2 text-gray-700 dark:text-gray-200
                                   hover:bg-white/60 dark:hover:bg-white/10
                                   rounded-lg transition" @click="showingNavigationDropdown = false">
                            {{ link.name }}
                        </ResponsiveNavLink>
                    </div>
                    <div class="border-t border-white/30 dark:border-white/10 px-2 py-2">
                        <ResponsiveNavLink as="button" class="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400
                                   hover:bg-red-500/10 rounded-lg transition"
                            @click="logout(); showingNavigationDropdown = false">
                            Log Out
                        </ResponsiveNavLink>
                    </div>
                </div>
            </Transition>
        </nav>
        <!-- ══════════ END NAVBAR ══════════ -->

        <!-- Main area: Sidebar + Content -->
        <div class="flex flex-1 min-h-0">

            <!-- <component :is="SidebarComponent" :isKejuruanGuru="page.props.isKejuruanGuru" :isWalas="page.props.isWalas"
                class="hidden md:block bg-white dark:bg-[#0F172A]
                       border-r dark:border-gray-600 border-gray-300
                       pt-4 overflow-y-auto overflow-x-hidden" /> -->

            <component :is="SidebarComponent" :isKejuruanGuru="page.props.isKejuruanGuru" :isWalas="page.props.isWalas"
                class="no-print hidden md:flex bg-white dark:bg-[#0F172A]
                  border-r dark:border-gray-600 border-gray-300
                  pt-4" />

            <div class="flex-1 px-4 sm:px-8 py-6
                        bg-gray-100 dark:bg-[#020617] overflow-auto">
                <slot />
            </div>
        </div>
    </div>
</template>