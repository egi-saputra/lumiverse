<script setup>
import UserLayout from '@/Layouts/UserLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { Head, usePage, router, Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'

import {
    UserGroupIcon,
    ClipboardDocumentListIcon,
    AcademicCapIcon,
    XMarkIcon,
    NewspaperIcon,
    DocumentTextIcon,
    IdentificationIcon,
    MegaphoneIcon,
} from '@heroicons/vue/24/solid'
import { EnvelopeIcon } from '@heroicons/vue/24/outline'

/* ================= PAGE & USER ================= */
const page = usePage()
const user = computed(() => page.props.auth.user || {})

/* ================= TENANT / SMK CHECK ================= */
const isSmk = computed(() =>
    (page.props.tenant?.school_level ?? '').toString().trim().toLowerCase() === 'smk'
)

/* ================= TOAST ================= */
const toast = ref({ show: false, message: '', type: 'info' })

const showToast = (message, type = 'info') => {
    toast.value = { show: true, message, type }
    setTimeout(() => { toast.value.show = false }, 2500)
}

/* ================= MENU ================= */
const menuItems = [
    {
        title: 'Learning',
        icon: NewspaperIcon,
        route: route('siswa.material.index'),
        gradient: 'from-sky-400 to-cyan-500',
        glow: 'shadow-sky-400/30',
        bg: 'bg-sky-50 dark:bg-sky-950/40',
        border: 'border-sky-100 dark:border-sky-800/30',
    },
    {
        title: 'Assignment',
        icon: DocumentTextIcon,
        route: route('siswa.assignment.index'),
        gradient: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-400/30',
        bg: 'bg-violet-50 dark:bg-violet-950/40',
        border: 'border-violet-100 dark:border-violet-800/30',
    },
    {
        title: 'Exam Room',
        icon: ClipboardDocumentListIcon,
        route: route('siswa.ujian.token'),
        gradient: 'from-rose-500 to-pink-600',
        glow: 'shadow-rose-400/30',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        border: 'border-rose-100 dark:border-rose-800/30',
    },

    {
        title: 'Attendance',
        icon: UserGroupIcon,
        route: route('siswa.absensi.index'),
        gradient: 'from-blue-500 to-teal-500',
        glow: 'shadow-blue-400/30',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        border: 'border-blue-100 dark:border-blue-800/30',
    },
    {
        title: 'Messages',
        icon: EnvelopeIcon,
        route: route('pesan.index'),
        gradient: 'from-emerald-500 to-teal-500',
        glow: 'shadow-emerald-400/30',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-100 dark:border-emerald-800/30',
    },
    {
        title: 'Announcements',
        icon: MegaphoneIcon,
        route: route('pengumuman.index'),
        gradient: 'from-amber-500 to-orange-500',
        glow: 'shadow-amber-400/30',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-100 dark:border-amber-800/30',
    },
]

/* ================= SISWA ================= */
const siswa = computed(() => page.props.siswa || {})

/* ================= NAV ================= */
const goTo = (url) => router.visit(url, { preserveScroll: true, preserveState: true })

/* ================= COPY ================= */
const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => showToast('ID berhasil disalin!', 'success'))
        .catch(() => showToast('Gagal menyalin ke clipboard!', 'error'))
}

/* ================= SLIDER ================= */
const sliderRef = ref(null)
const activeSlide = ref(0)

onMounted(() => {
    if (!sliderRef.value) return
    sliderRef.value.addEventListener('scroll', () => {
        activeSlide.value = Math.round(
            sliderRef.value.scrollLeft / sliderRef.value.clientWidth
        )
    })
})

/* ================= EXPORT ================= */
const exportExcel = () => {
    showToast('Export Excel dimulai...', 'success')
    router.visit(route('siswa.export.excel'), { preserveScroll: true })
}

/* ================= HELPERS ================= */
const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
</script>

<template>

    <Head title="Dashboard" />

    <UserLayout>
        <!-- ── TOAST MOBILE ── -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-3"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-3">
            <div v-if="toast.show" class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50 md:hidden
                       flex items-center justify-between gap-3
                       px-5 py-3.5 rounded-2xl text-sm font-medium text-white
                       shadow-2xl backdrop-blur-xl border border-white/10"
                :class="toast.type === 'success' ? 'bg-emerald-600/90' : toast.type === 'error' ? 'bg-rose-600/90' : 'bg-gray-900/90'">
                <span class="truncate">{{ toast.message }}</span>
                <button @click="toast.show = false" class="flex-shrink-0 opacity-70 hover:opacity-100">
                    <XMarkIcon class="w-4 h-4" />
                </button>
            </div>
        </Transition>

        <!-- ── TOAST DESKTOP ── -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-x-3"
            enter-to-class="opacity-100 translate-x-0" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 translate-x-3">
            <div v-if="toast.show" class="hidden md:flex fixed top-6 right-6 w-72 z-50
                       items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium text-white
                       shadow-2xl backdrop-blur-xl border border-white/10"
                :class="toast.type === 'success' ? 'bg-emerald-600/90' : toast.type === 'error' ? 'bg-rose-600/90' : 'bg-gray-900/90'">
                <span class="truncate">{{ toast.message }}</span>
                <button @click="toast.show = false" class="ml-auto flex-shrink-0 opacity-70 hover:opacity-100">
                    <XMarkIcon class="w-4 h-4" />
                </button>
            </div>
        </Transition>

        <div class="sm:max-w-7xl mx-auto overflow-x-hidden sm:py-6 space-y-5 min-h-screen">

            <!-- ══════════════════════════════════════════════════
                 SLIDE CONTAINER  (Mobile: horizontal snap scroll
                                   Desktop: vertical stacked)
            ══════════════════════════════════════════════════ -->
            <div ref="sliderRef" class="flex md:flex-col gap-5
                       overflow-x-auto no-scrollbar
                       snap-x snap-mandatory md:snap-none scroll-smooth
                       -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">

                <!-- ── SLIDE 1 · WELCOME ── -->
                <div class="min-w-full snap-center relative overflow-hidden rounded-2xl sm:rounded-3xl">
                    <!-- Layered background -->
                    <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600
                                dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#0c4a6e]"></div>
                    <div class="absolute inset-0 opacity-25"
                        style="background-image: radial-gradient(ellipse at 15% 60%, rgba(99,102,241,0.6) 0%, transparent 55%), radial-gradient(ellipse at 85% 10%, rgba(6,182,212,0.4) 0%, transparent 50%)">
                    </div>
                    <!-- Grid dots -->
                    <div class="absolute inset-0 opacity-[0.06]"
                        style="background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px); background-size: 24px 24px;">
                    </div>
                    <!-- Blur orbs -->
                    <div
                        class="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none">
                    </div>
                    <div
                        class="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none">
                    </div>

                    <div class="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 sm:p-8">
                        <!-- Avatar -->
                        <div class="relative flex-shrink-0">
                            <img v-if="user.avatar" :src="user.avatar" alt="Avatar"
                                class="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white/30 shadow-xl" />
                            <div v-else class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 
                                       flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                                {{ getInitials(user.name) }}
                            </div>
                        </div>

                        <!-- Text -->
                        <div class="text-center sm:text-left flex-1">

                            <h1 class="text-xl sm:text-3xl font-bold text-white leading-tight">
                                Hai, {{ user.name }}! 👋
                            </h1>
                            <p class="text-white/70 text-sm mt-1">
                                May your day remain productive and enjoyable!
                            </p>
                        </div>

                        <!-- Status pill (desktop) -->
                        <div
                            class="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
                            <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                            <span class="text-white/80 text-xs font-medium">Lumiverse School</span>
                        </div>
                    </div>
                </div>

                <!-- ── SLIDE 2 · PERSONAL INFORMATION ── -->
                <!-- Desktop header -->
                <div class="hidden md:flex items-center gap-3 -mb-1">
                    <div
                        class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-400/25">
                        <IdentificationIcon class="w-5 h-5 text-white" />
                    </div>
                    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Personal Information</h2>
                </div>

                <div class="min-w-full snap-center rounded-2xl sm:rounded-3xl border transition-all duration-300
                            bg-white border-gray-100 shadow-sm
                            dark:bg-gray-900/60 dark:border-gray-700 dark:backdrop-blur-xl">

                    <!-- Card Header -->
                    <div
                        class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4">
                        <div class="flex-1">
                            <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {{ siswa.nama_lengkap || '—' }}
                            </h3>
                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Data pribadi siswa</p>
                        </div>
                        <!-- Status badge -->
                        <span :class="[
                            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0',
                            siswa.status === 'Activated'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        ]">
                            <span :class="[
                                'w-1.5 h-1.5 rounded-full',
                                siswa.status === 'Activated' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            ]"></span>
                            {{ siswa.status === 'Activated' ? 'Active' : 'Inactive' }}
                        </span>
                    </div>

                    <!-- Info Grid -->
                    <div class="p-6 grid grid-cols-2 gap-4" :class="isSmk ? 'sm:grid-cols-5' : 'sm:grid-cols-4'">
                        <!-- Kelas -->
                        <div
                            class="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20">
                            <div class="flex items-center gap-1.5 mb-0.5">
                                <AcademicCapIcon class="w-3.5 h-3.5 text-sky-500" />
                                <span
                                    class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Kelas</span>
                            </div>
                            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {{ siswa.kelas?.kelas || 'Belum ada' }}
                            </span>
                        </div>

                        <!-- Kejuruan (hanya untuk tenant SMK) -->
                        <div v-if="isSmk"
                            class="hidden sm:flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20">
                            <div class="flex items-center gap-1.5 mb-0.5">
                                <DocumentTextIcon class="w-3.5 h-3.5 text-rose-500" />
                                <span
                                    class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Jurusan</span>
                            </div>
                            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                {{ siswa.kejuruan?.kejuruan || 'Belum ada' }}
                            </span>
                        </div>

                        <!-- ID Siswa -->
                        <div
                            class="flex flex-col gap-1 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/15 border border-indigo-100 dark:border-indigo-800/20">
                            <div class="flex items-center justify-between mb-0.5">
                                <span
                                    class="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 dark:text-indigo-400">ID
                                    Siswa</span>
                                <button @click="copyToClipboard(siswa.id_siswa)"
                                    class="opacity-60 hover:opacity-100 transition-opacity active:scale-90">
                                    <ClipboardDocumentListIcon
                                        class="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                                </button>
                            </div>
                            <span class="text-sm font-bold font-mono text-indigo-700 dark:text-indigo-300">
                                {{ siswa.id_siswa }}
                            </span>
                        </div>

                        <!-- NIS -->
                        <div
                            class="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20">
                            <span
                                class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 mb-0.5">NIS</span>
                            <span class="text-sm font-semibold font-mono text-gray-800 dark:text-gray-200">
                                {{ siswa.nis || '—' }}
                            </span>
                        </div>

                        <!-- NISN -->
                        <div
                            class="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20">
                            <span
                                class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 mb-0.5">NISN</span>
                            <span class="text-sm font-semibold font-mono text-gray-800 dark:text-gray-200">
                                {{ siswa.nisn || '—' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── SLIDE INDICATOR (Mobile only) ── -->
            <div class="flex justify-center items-center gap-2 md:hidden">
                <button v-for="i in 2" :key="i"
                    @click="sliderRef && sliderRef.scrollTo({ left: (i - 1) * sliderRef.clientWidth, behavior: 'smooth' })"
                    class="transition-all duration-300 rounded-full" :class="activeSlide === i - 1
                        ? 'w-6 h-2 bg-indigo-500 dark:bg-blue-400'
                        : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'" />
            </div>

            <!-- ── MOBILE QUICK ACCESS ── -->
            <div class="md:hidden">
                <p class="text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-3 px-0.5">
                    Quick Access</p>
                <div class="grid grid-cols-2 gap-3">
                    <Link v-for="(item, index) in menuItems" :key="item.title" :href="item.route" preserve-scroll class="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border
                               transition-all duration-300 active:scale-[0.97]" :class="[
                                item.bg,
                                item.border,
                                menuItems.length % 2 !== 0 && index === menuItems.length - 1
                                    ? 'col-span-2'
                                    : ''
                            ]">
                        <!-- Hover shimmer -->
                        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                    bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 rounded-2xl">
                        </div>
                        <!-- Icon -->
                        <div class="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] bg-gradient-to-br"
                            :class="[item.gradient, item.glow]">
                            <component :is="item.icon" class="w-6 h-6 text-white" />
                        </div>
                        <span
                            class="relative text-sm font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight">
                            {{ item.title }}
                        </span>
                    </Link>
                </div>
            </div>

            <!-- ── DESKTOP NAV CARDS ── -->
            <div class="hidden md:block">
                <p class="text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-4 px-0.5">
                    Quick Acces</p>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link v-for="item in menuItems" :key="item.title" :href="item.route" preserve-scroll class="group relative overflow-hidden flex items-center gap-4 px-5 py-4 rounded-2xl border
                               transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        :class="[item.bg, item.border]">
                        <div class="relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br"
                            :class="[item.gradient, item.glow]">
                            <component :is="item.icon" class="w-5 h-5 text-white" />
                        </div>
                        <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {{ item.title }}
                        </span>
                        <!-- Arrow on hover -->
                        <svg class="w-4 h-4 ml-auto text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

        </div>
    </UserLayout>
</template>

<style scoped>
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>