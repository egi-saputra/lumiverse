<script setup>
import UserLayout from '@/Layouts/UserLayout.vue';
import { ref, computed } from 'vue'
import { Head, usePage, router, Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import {
    UserIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    AcademicCapIcon,
    CheckBadgeIcon,
    XMarkIcon,
    NewspaperIcon,
    DocumentTextIcon,
    SparklesIcon,
    ArrowTrendingUpIcon,
    MegaphoneIcon,
    EnvelopeIcon, UsersIcon,
    ArrowRightOnRectangleIcon, CheckCircleIcon, ExclamationCircleIcon
} from '@heroicons/vue/24/solid'
import {
    BookOpenIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    PencilSquareIcon,
} from '@heroicons/vue/24/outline'

const page = usePage();
const userName = page.props.auth.user.name || 'User';
const props = defineProps({
    isWalas: { type: Boolean, default: false },
})

const insights = computed(() => page.props.insights ?? {})
const materials = computed(() => insights.value.materials ?? { total: 0, items: [] })
const quizzes = computed(() => insights.value.quizzes ?? { total: 0, items: [] })
const journals = computed(() => insights.value.journals ?? { items: [] })
const exams = computed(() => insights.value.exams ?? { completed: 0, in_progress: 0, items: [] })
const attendance = computed(() => insights.value.attendance ?? { total: 0, hadir: 0, sakit: 0, izin: 0, alpha: 0 })
const attendanceToday = computed(() => insights.value.attendance_today ?? { date: null, filled: [], not_filled: [] })
const attendanceClasses = computed(() => insights.value.attendance_classes ?? { items: [] })
const announcements = computed(() => insights.value.announcements ?? { total: 0, items: [] })

const toast = ref({
    show: false,
    message: '',
    type: 'info'
});

const showToast = (message, type = 'info') => {
    toast.value.message = message;
    toast.value.type = type;
    toast.value.show = true;

    setTimeout(() => {
        toast.value.show = false;
    }, 2000);
};

// Status jendela pengisian jurnal, dikirim dari server lewat shared Inertia props
// (lihat app/Support/JournalWindow.php + HandleInertiaRequests)
const journalWindow = computed(() => page.props.journal ?? {
    isOpen: false,
    phase: 'after',
    opensAt: '06:00',
    closesAt: '14:00',
})

const journalStatusText = computed(() => {
    switch (journalWindow.value.phase) {
        case 'open':
            return 'Tap untuk isi jurnal sekarang'
        case 'before':
            return `Buka pukul ${journalWindow.value.opensAt}`
        default:
            return `Sudah Ditutup, akan dibuka kembali besok pada pukul ${journalWindow.value.opensAt}`
    }
})

const menuItems = computed(() => {
    const items = [
        {
            title: 'Classroom',
            icon: UsersIcon,
            route: route('guru.walas.index'),
            color: 'from-indigo-500 to-blue-600',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            walasOnly: true,
        },
        {
            title: 'Attendance',
            icon: ClipboardDocumentCheckIcon,
            route: route('guru.absensi.index'),
            color: 'from-sky-500 to-cyan-600',
            bg: 'bg-sky-50 dark:bg-sky-900/20'
        },
        {
            title: 'Analytics',
            icon: ChartBarIcon,
            route: route('public.absensi.analytics'),
            color: 'from-purple-500 to-violet-600',
            bg: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            title: 'Learning',
            icon: BookOpenIcon,
            route: route('guru.material.index'),
            color: 'from-teal-500 to-emerald-600',
            bg: 'bg-teal-50 dark:bg-teal-900/20'
        },
        {
            title: 'Assignment',
            icon: DocumentTextIcon,
            route: route('guru.assignment.index'),
            color: 'from-fuchsia-500 to-pink-600',
            bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20'
        },
        {
            title: 'Quiz List',
            icon: PencilSquareIcon,
            route: route('guru.soal.index'),
            color: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            title: 'Assessment',
            icon: CheckBadgeIcon,
            route: route('guru.NilaiUjian.index'),
            color: 'from-emerald-500 to-green-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20'
        },
        {
            title: 'Announcements',
            icon: MegaphoneIcon,
            route: route('pengumuman.index'),
            color: 'from-rose-500 to-red-600',
            bg: 'bg-rose-50 dark:bg-rose-900/20'
        },
    ]
    // Sembunyikan menu Classroom kalau guru bukan wali kelas
    return items.filter(item => !item.walasOnly || props.isWalas)
})

// ── Menu tambahan khusus grid mobile: dokumentasi, partner, logout ──
// Ditempel di akhir daftar kartu supaya ikut masuk ke halaman
// carousel terakhir, bukan navigasi utama seperti menuItems di atas.
const extraMobileItems = [
    {
        title: 'Dokumentasi',
        icon: DocumentTextIcon,
        type: 'external',
        route: 'https://docs.lumiverse.co.id',
        color: 'from-slate-500 to-gray-700',
        bg: 'bg-slate-50 dark:bg-slate-900/20',
    },
    {
        title: 'Partner',
        icon: UserGroupIcon,
        type: 'external',
        route: 'https://partner.lumiverse.co.id',
        color: 'from-cyan-500 to-blue-600',
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    },
    {
        title: 'Logout',
        icon: ArrowRightOnRectangleIcon,
        type: 'logout',
        color: 'from-red-500 to-rose-600',
        bg: 'bg-red-50 dark:bg-red-900/20',
    },
]

const mobileMenuItems = computed(() => [
    ...menuItems.value.map(item => ({ type: 'link', ...item })),
    ...extraMobileItems,
])

// ── Carousel: 4 kartu per halaman, geser ke samping (drag/swipe) ──
const CARDS_PER_PAGE = 4

const menuPages = computed(() => {
    const pages = []
    for (let i = 0; i < mobileMenuItems.value.length; i += CARDS_PER_PAGE) {
        pages.push(mobileMenuItems.value.slice(i, i + CARDS_PER_PAGE))
    }
    return pages
})

const carouselRef = ref(null)
const activePage = ref(0)
let isDragging = false
let dragStartX = 0
let scrollStartX = 0

const onDragStart = (e) => {
    if (!carouselRef.value) return
    isDragging = true
    dragStartX = e.clientX
    scrollStartX = carouselRef.value.scrollLeft
    carouselRef.value.setPointerCapture?.(e.pointerId)
}

const onDragMove = (e) => {
    if (!isDragging || !carouselRef.value) return
    const delta = e.clientX - dragStartX
    carouselRef.value.scrollLeft = scrollStartX - delta
}

const onDragEnd = () => {
    isDragging = false
}

const onCarouselScroll = () => {
    if (!carouselRef.value) return
    const pageWidth = carouselRef.value.clientWidth
    if (!pageWidth) return
    activePage.value = Math.round(carouselRef.value.scrollLeft / pageWidth)
}

const scrollToPage = (index) => {
    if (!carouselRef.value) return
    carouselRef.value.scrollTo({
        left: index * carouselRef.value.clientWidth,
        behavior: 'smooth',
    })
}

const handleLogout = () => {
    router.post(route('logout'))
}

const goTo = (url) => {
    router.visit(url, {
        preserveScroll: true,
        preserveState: true,
    });
};

const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const formatDate = (value) => value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(value ?? 0)
</script>

<template>

    <Head title="Dashboard" />

    <UserLayout>

        <!-- ── TOAST MOBILE ── -->
        <Transition enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-4 scale-95">
            <div v-if="toast.show" class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm 
                       bg-gray-900/95 backdrop-blur-xl text-white px-5 py-3.5 rounded-2xl shadow-2xl 
                       flex items-center justify-between z-50 border border-white/10 md:hidden">
                <span class="text-sm font-medium truncate">{{ toast.message }}</span>
                <button @click="toast.show = false"
                    class="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                    <XMarkIcon class="w-4 h-4" />
                </button>
            </div>
        </Transition>

        <!-- ── TOAST DESKTOP ── -->
        <Transition enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-x-4 scale-95" enter-to-class="opacity-100 translate-x-0 scale-100"
            leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-x-0 scale-100"
            leave-to-class="opacity-0 translate-x-4 scale-95">
            <div v-if="toast.show" class="hidden md:flex fixed top-6 right-6 w-80 px-5 py-4 rounded-2xl shadow-2xl z-50
                       backdrop-blur-xl border items-center gap-3 text-sm font-medium" :class="toast.type === 'success'
                        ? 'bg-emerald-500/90 border-emerald-400/30 text-white'
                        : 'bg-gray-900/95 border-white/10 text-white'">
                <div v-if="toast.type === 'success'"
                    class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span class="truncate">{{ toast.message }}</span>
                <button @click="toast.show = false"
                    class="ml-auto flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                    <XMarkIcon class="w-4 h-4" />
                </button>
            </div>
        </Transition>

        <!-- ── HERO WELCOME ── -->
        <div class="relative mb-7 overflow-hidden rounded-2xl">
            <!-- Background layers -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 
                        dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#312e81]"></div>
            <div class="absolute inset-0 opacity-30 dark:opacity-20"
                style="background-image: radial-gradient(circle at 20% 50%, rgba(99,102,241,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.3) 0%, transparent 50%)">
            </div>
            <!-- Decorative orbs -->
            <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none">
            </div>
            <div
                class="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-violet-500/10 blur-2xl pointer-events-none">
            </div>
            <!-- Subtle grid pattern -->
            <div class="absolute inset-0 opacity-[0.04]"
                style="background-image: linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px); background-size: 32px 32px;">
            </div>

            <div class="relative flex flex-col sm:flex-row items-center sm:text-left text-center gap-5 p-6 sm:p-8">
                <!-- Avatar -->
                <div class="relative flex-shrink-0">
                    <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 
                                flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {{ getInitials(userName) }}
                    </div>
                    <span
                        class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white/30"></span>
                </div>
                <!-- Text -->
                <div class="flex-1">
                    <!-- <p class="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-widest mb-1">Dashboard
                        Guru</p> -->
                    <h1 class="text-2xl sm:text-3xl font-bold text-white leading-tight">
                        Welcome, {{ userName }}! 👋
                    </h1>
                    <p class="text-white/70 text-sm sm:text-base mt-1">May your day remain productive and enjoyable!
                    </p>
                </div>
                <!-- Badge -->
                <a href="https://lumiverse.co.id" target="_blank" rel="noopener noreferrer" class="hidden sm:flex items-center gap-2 relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 
           px-4 py-2 rounded-full text-white/80 text-sm hover:bg-white/15 hover:text-white hover:border-white/30
           transition-colors duration-300">
                    <SparklesIcon class="w-4 h-4 text-amber-300 relative z-10" />
                    <span class="relative z-10">Lumiverse School</span>
                    <span class="badge-shimmer absolute inset-0 pointer-events-none"></span>
                </a>
            </div>

            <!-- Jurnal Mengajar — badge/tombol status di dalam hero card -->
            <div class="relative px-6 sm:px-8 pb-6 sm:pb-8">
                <component :is="journalWindow.isOpen ? Link : 'div'"
                    v-bind="journalWindow.isOpen ? { href: route('guru.journal.create'), prefetch: 'hover' } : {}"
                    class="group flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-5 py-3.5 rounded-2xl border backdrop-blur-sm transition-all duration-300"
                    :class="journalWindow.isOpen
                        ? 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90 border-blue-400/30 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 hover:-translate-y-0.5 cursor-pointer'
                        : 'bg-gradient-to-r from-rose-500/80 to-red-600/80 border-rose-400/30 shadow-lg shadow-rose-900/10 opacity-90 cursor-not-allowed'">

                    <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                        :class="journalWindow.isOpen ? 'group-hover:scale-110' : ''">
                        <BookOpenIcon v-if="journalWindow.isOpen" class="w-5 h-5 text-white" />
                        <LockClosedIcon v-else class="w-5 h-5 text-white" />
                    </div>

                    <div class="flex-1 min-w-0 text-left">
                        <p class="text-white text-sm font-semibold leading-tight">Jurnal Mengajar</p>
                        <p class="text-white/75 text-xs leading-tight mt-0.5">{{ journalStatusText }}</p>
                    </div>

                    <span
                        class="flex-shrink-0 px-2.5 sm:flex hidden py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
                        {{ journalWindow.isOpen ? 'Open' : 'Closed' }}
                    </span>

                    <ArrowRightIcon v-if="journalWindow.isOpen"
                        class="w-4 h-4 text-white/70 flex-shrink-0 hidden sm:block transition-transform duration-300 group-hover:translate-x-0.5" />
                </component>
            </div>
        </div>

        <!-- ── STATS CARDS (Desktop) ── -->
        <div class="sm:grid hidden mb-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <!-- Proktor -->
            <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
                        bg-white border-gray-100 shadow-sm
                        dark:bg-gray-900/60 dark:border-gray-800 dark:shadow-none dark:backdrop-blur-xl">
                <div
                    class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/10 dark:to-transparent">
                </div>
                <div class="relative p-6 flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <UserIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Proktor</p>
                        <div class="flex items-end gap-2">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{
                                page.props.usersCount.proktor }}</h3>
                            <span class="text-xs text-gray-400 dark:text-gray-500 mb-0.5">pengguna</span>
                        </div>
                    </div>
                    <ArrowTrendingUpIcon class="w-4 h-4 text-purple-400 opacity-50" />
                </div>
                <div class="h-0.5 bg-gradient-to-r from-purple-500 to-violet-600 opacity-60 rounded-full mx-6 mb-4">
                </div>
            </div>

            <!-- Guru -->
            <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
                        bg-white border-gray-100 shadow-sm
                        dark:bg-gray-900/60 dark:border-gray-800 dark:shadow-none dark:backdrop-blur-xl">
                <div
                    class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/10 dark:to-transparent">
                </div>
                <div class="relative p-6 flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <AcademicCapIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Guru</p>
                        <div class="flex items-end gap-2">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ page.props.usersCount.guru
                                }}</h3>
                            <span class="text-xs text-gray-400 dark:text-gray-500 mb-0.5">pengguna</span>
                        </div>
                    </div>
                    <ArrowTrendingUpIcon class="w-4 h-4 text-emerald-400 opacity-50" />
                </div>
                <div class="h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-60 rounded-full mx-6 mb-4">
                </div>
            </div>

            <!-- Siswa -->
            <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
                        bg-white border-gray-100 shadow-sm
                        dark:bg-gray-900/60 dark:border-gray-800 dark:shadow-none dark:backdrop-blur-xl">
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            bg-gradient-to-br from-sky-50 to-transparent dark:from-sky-900/10 dark:to-transparent">
                </div>
                <div class="relative p-6 flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                        <UserGroupIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Siswa</p>
                        <div class="flex items-end gap-2">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ page.props.usersCount.siswa
                                }}</h3>
                            <span class="text-xs text-gray-400 dark:text-gray-500 mb-0.5">pengguna</span>
                        </div>
                    </div>
                    <ArrowTrendingUpIcon class="w-4 h-4 text-sky-400 opacity-50" />
                </div>
                <div class="h-0.5 bg-gradient-to-r from-sky-500 to-blue-600 opacity-60 rounded-full mx-6 mb-4"></div>
            </div>
        </div>

        <!-- ── INSIGHT DASHBOARD (Desktop) ── -->
        <div
            class="sm:block hidden mb-7 rounded-2xl border transition-all duration-300 bg-white border-gray-100 shadow-sm dark:bg-gray-900/60 dark:border-gray-800 dark:backdrop-blur-xl">
            <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div
                    class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                    <ArrowTrendingUpIcon class="w-4 h-4 text-white" />
                </div>
                <h2 class="font-semibold text-gray-800 dark:text-white">Insight Pembelajaran</h2>
            </div>
            <div class="p-6 grid sm:grid-cols-2 gap-4">
                <!-- Top 6 Kelas Berdasarkan Persentase Kehadiran Tertinggi -->
                <div
                    class="rounded-xl bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-500/15 p-4 sm:col-span-2">
                    <div class="mb-3 flex items-center gap-3">
                        <span
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400">
                            <CheckBadgeIcon class="h-4 w-4" />
                        </span>
                        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Top 6
                            kelas berdasarkan persentase tingkat kehadiran tertinggi</p>
                    </div>
                    <div class="mt-3 grid gap-3 sm:grid-cols-2">
                        <div v-for="(item, index) in attendanceClasses.items" :key="item.id">
                            <div class="mb-1 flex justify-between text-xs">
                                <span class="truncate text-gray-600 dark:text-gray-300">0{{ index + 1 }} · {{ item.class
                                    }}</span>
                                <b class="text-teal-600">{{ item.percentage }}%</b>
                            </div>
                            <p class="mt-0.5 truncate text-[11px] text-gray-400">Wali kelas: {{ item.walas }}</p>
                            <div class="h-1.5 rounded-full bg-white/70 dark:bg-gray-800">
                                <div class="h-full rounded-full bg-teal-500" :style="{ width: `${item.percentage}%` }">
                                </div>
                            </div>
                        </div>
                        <p v-if="!attendanceClasses.items.length" class="text-xs text-gray-400">Belum ada data absensi
                            kelas.</p>
                    </div>
                </div>

                <!-- Jurnal guru terbaru -->
                <div
                    class="rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/15 p-4">
                    <div class="mb-3 flex items-center gap-3">
                        <span
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                            <BookOpenIcon class="h-4 w-4" />
                        </span>
                        <p class="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                            Jurnal guru terbaru</p>
                    </div>
                    <div
                        class="mt-3 space-y-2 max-h-[280px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-indigo-200 dark:[&::-webkit-scrollbar-thumb]:bg-indigo-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <div v-for="item in journals.items.slice(0, 10)" :key="item.id" class="text-xs">
                            <p class="truncate font-semibold text-gray-700 dark:text-gray-200">{{ item.teacher }}</p>
                            <p class="truncate text-gray-500">{{ item.class }} · {{ item.subject }} · {{
                                formatDate(item.date) }}</p>
                        </div>
                        <p v-if="!journals.items.length" class="text-xs text-gray-400">Belum ada jurnal.</p>
                    </div>
                </div>

                <!-- Absensi Siswa -->
                <div
                    class="rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/15 p-4">
                    <div class="mb-3 flex items-center gap-3">
                        <span
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                            <ClipboardDocumentCheckIcon class="h-4 w-4" />
                        </span>
                        <p
                            class="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            Absensi bulan ini</p>
                    </div>
                    <div class="mt-3 grid grid-cols-4 gap-2 text-center">
                        <div><b class="block text-lg text-emerald-600">{{ attendance.hadir }}</b><span
                                class="text-[10px] text-gray-500">Hadir</span></div>
                        <div><b class="block text-lg text-amber-600">{{ attendance.sakit }}</b><span
                                class="text-[10px] text-gray-500">Sakit</span></div>
                        <div><b class="block text-lg text-blue-600">{{ attendance.izin }}</b><span
                                class="text-[10px] text-gray-500">Izin</span></div>
                        <div><b class="block text-lg text-rose-600">{{ attendance.alpha }}</b><span
                                class="text-[10px] text-gray-500">Alpha</span></div>
                    </div>

                    <!-- ── Status pengisian absen hari ini per kelas ── -->
                    <div class="mt-4 space-y-3 border-t border-emerald-100 pt-3.5 dark:border-emerald-500/10">
                        <div class="flex items-center justify-between">
                            <p
                                class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Status absen hari ini
                            </p>
                            <span class="font-mono text-[10px] tabular-nums text-gray-400">
                                {{ attendanceToday.filled.length }}/{{ attendanceToday.filled.length +
                                    attendanceToday.not_filled.length }}
                            </span>
                        </div>

                        <!-- Progress bar ringkas -->
                        <div class="h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                                :style="{
                                    width: `${(attendanceToday.filled.length + attendanceToday.not_filled.length)
                                        ? (attendanceToday.filled.length / (attendanceToday.filled.length + attendanceToday.not_filled.length)) * 100
                                        : 0}%`
                                }">
                            </div>
                        </div>

                        <div>
                            <p
                                class="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircleIcon class="h-3.5 w-3.5" />
                                Daftar kelas yang sudah mengisi absensi hari ini ({{ attendanceToday.filled.length }})
                            </p>
                            <div class="flex flex-wrap gap-1.5">
                                <span v-for="k in attendanceToday.filled" :key="'f-' + k.id"
                                    class="group inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:ring-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25 dark:hover:ring-emerald-500/40">
                                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                    {{ k.class }}
                                </span>
                                <span v-if="!attendanceToday.filled.length"
                                    class="text-[11px] italic text-gray-400">Belum ada.</span>
                            </div>
                        </div>

                        <div>
                            <p
                                class="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                <ExclamationCircleIcon class="h-3.5 w-3.5" />
                                Daftar kelas yang belum mengisi absensi hari ini ({{ attendanceToday.not_filled.length
                                }})
                            </p>
                            <div class="flex flex-wrap gap-1.5">
                                <span v-for="k in attendanceToday.not_filled" :key="'n-' + k.id"
                                    class="group inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-rose-700 ring-1 ring-inset ring-rose-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:ring-rose-300 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/25 dark:hover:ring-rose-500/40">
                                    <span class="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                    {{ k.class }}
                                </span>
                                <span v-if="!attendanceToday.not_filled.length"
                                    class="text-[11px] italic text-gray-400">Semua kelas sudah isi 🎉</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Materi Terbaru -->
                <div
                    class="rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-500/15 p-4 sm:col-span-2">
                    <div class="mb-4 flex items-center gap-3">
                        <span
                            class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400">
                            <BookOpenIcon class="h-4 w-4" />
                        </span>
                        <div>
                            <p class="font-bold text-gray-800 dark:text-white">Materi terbaru</p>
                            <p class="text-xs text-gray-500">{{ formatNumber(materials.total) }} materi dan authornya
                            </p>
                        </div>
                    </div>
                    <div
                        class="no-scrollbar divide-y divide-cyan-100 dark:divide-gray-800 max-h-[280px] overflow-y-auto">
                        <div v-for="item in materials.items.slice(0, 10)" :key="item.id"
                            class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                            <div class="min-w-0">
                                <p class="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{{ item.title
                                }}</p>
                                <p class="truncate text-xs text-gray-500">{{ item.author }} · {{ item.class }} · {{
                                    item.subject }}</p>
                            </div>
                            <span class="shrink-0 font-mono text-xs tabular-nums text-gray-400">{{
                                formatDate(item.created_at) }}</span>
                        </div>
                        <p v-if="!materials.items.length" class="text-xs text-gray-400">Belum ada materi.</p>
                    </div>
                </div>

                <!-- Bank Soal & Evaluasi -->
                <div
                    class="rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-500/15 p-4">
                    <div class="mb-4 flex items-center gap-3">
                        <span
                            class="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                            <PencilSquareIcon class="h-4 w-4" />
                        </span>
                        <div>
                            <h2 class="font-bold text-gray-800 dark:text-white">Bank soal & evaluasi</h2>
                            <p class="text-xs text-gray-500">Author, status, dan jumlah butir soal</p>
                        </div>
                    </div>
                    <div class="divide-y divide-rose-100 dark:divide-gray-800">
                        <div v-for="item in quizzes.items" :key="item.id"
                            class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                            <div class="min-w-0">
                                <p class="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{{ item.title
                                }}</p>
                                <p class="truncate text-xs text-gray-500">{{ item.author }} · {{ item.subject }} · Kelas
                                    {{ item.class }}</p>
                            </div>
                            <span class="shrink-0 text-right text-xs">
                                <span
                                    class="block font-mono font-semibold tabular-nums text-gray-700 dark:text-gray-300">{{
                                        item.questions }} soal</span>
                                <span class="font-medium"
                                    :class="item.status === 'Aktif' ? 'text-emerald-600' : 'text-gray-400'">{{
                                        item.status }}</span>
                            </span>
                        </div>
                        <p v-if="!quizzes.items.length" class="py-6 text-center text-sm text-gray-400">Belum ada soal
                            ujian.</p>
                    </div>
                </div>

                <!-- Ujian & Nilai -->
                <div class="rounded-xl bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-500/15 p-4">
                    <div class="flex items-center gap-3">
                        <span
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
                            <ClipboardDocumentCheckIcon class="h-4 w-4" />
                        </span>
                        <p class="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">Ujian &
                            nilai</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ exams.completed }} ujian selesai · {{
                        exams.in_progress }} sedang berjalan</p>
                    <div class="mt-3 grid gap-2 sm:grid-cols-2">
                        <div v-for="item in exams.items.slice(0, 4)" :key="item.id"
                            class="flex justify-between gap-2 text-xs"><span
                                class="truncate text-gray-600 dark:text-gray-300">{{ item.student }} · {{ item.exam
                                }}</span><b class="shrink-0 text-emerald-600">{{ item.score }}</b></div>
                        <p v-if="!exams.items.length" class="text-xs text-gray-400">Belum ada ujian selesai.</p>
                    </div>
                </div>

                <!-- Pengumuman -->
                <div
                    class="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/15 p-4 sm:col-span-2">
                    <div class="flex items-center gap-3">
                        <span
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                            <MegaphoneIcon class="h-4 w-4" />
                        </span>
                        <p class="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            Pengumuman</p>
                    </div>
                    <div class="mt-3 grid gap-2 sm:grid-cols-2">
                        <div v-for="item in announcements.items.slice(0, 4)" :key="item.id" class="text-xs">
                            <p class="truncate font-semibold text-gray-700 dark:text-gray-200">{{ item.title }}</p>
                            <p class="truncate text-gray-500">{{ item.author }} · {{ formatDate(item.created_at) }}</p>
                        </div>
                        <p v-if="!announcements.items.length" class="text-xs text-gray-400">Belum ada pengumuman.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── MOBILE MENU CAROUSEL ── -->
        <div class="max-w-7xl mx-auto md:hidden overflow-x-hidden">

            <div ref="carouselRef" @scroll="onCarouselScroll" @pointerdown="onDragStart" @pointermove="onDragMove"
                @pointerup="onDragEnd" @pointerleave="onDragEnd" @pointercancel="onDragEnd"
                class="no-scrollbar flex overflow-x-auto snap-x snap-mandatory scroll-smooth select-none cursor-grab active:cursor-grabbing">

                <div v-for="(cardsPage, pageIndex) in menuPages" :key="pageIndex"
                    class="grid grid-cols-2 grid-rows-2 gap-3.5 shrink-0 w-full snap-start snap-always box-border px-1">

                    <template v-for="item in cardsPage" :key="item.title">

                        <!-- Item navigasi internal -->
                        <Link v-if="item.type === 'link'" :href="item.route" prefetch="hover" preserve-scroll
                            preserve-state class="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                                   border transition-all duration-300 active:scale-[0.97]
                                   bg-white border-gray-100 shadow-sm
                                   dark:bg-gray-900/60 dark:border-gray-800 dark:backdrop-blur-xl">
                            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                :class="item.bg"></div>
                            <div class="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br"
                                :class="item.color">
                                <component :is="item.icon" class="w-6 h-6 text-white" />
                            </div>
                            <span
                                class="relative text-sm font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight">
                                {{ item.title }}
                            </span>
                        </Link>

                        <!-- Item tautan eksternal (dokumentasi, partner) -->
                        <a v-else-if="item.type === 'external'" :href="item.route" target="_blank"
                            rel="noopener noreferrer" class="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                                   border transition-all duration-300 active:scale-[0.97]
                                   bg-white border-gray-100 shadow-sm
                                   dark:bg-gray-900/60 dark:border-gray-800 dark:backdrop-blur-xl">
                            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                :class="item.bg"></div>
                            <div class="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br"
                                :class="item.color">
                                <component :is="item.icon" class="w-6 h-6 text-white" />
                            </div>
                            <span
                                class="relative text-sm font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight">
                                {{ item.title }}
                            </span>
                        </a>

                        <!-- Item logout -->
                        <button v-else type="button" @click="handleLogout" class="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                                   border transition-all duration-300 active:scale-[0.97]
                                   bg-white border-gray-100 shadow-sm
                                   dark:bg-gray-900/60 dark:border-gray-800 dark:backdrop-blur-xl">
                            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                :class="item.bg"></div>
                            <div class="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br"
                                :class="item.color">
                                <component :is="item.icon" class="w-6 h-6 text-white" />
                            </div>
                            <span
                                class="relative text-sm font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight">
                                {{ item.title }}
                            </span>
                        </button>

                    </template>
                </div>
            </div>

            <!-- Dots indikator halaman -->
            <div v-if="menuPages.length > 1" class="flex items-center justify-center gap-1.5 mt-4">
                <button v-for="(cardsPage, i) in menuPages" :key="i" type="button" @click="scrollToPage(i)"
                    class="h-1.5 rounded-full transition-all duration-300"
                    :class="i === activePage ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-1.5 bg-gray-300 dark:bg-gray-700'" />
            </div>
        </div>

    </UserLayout>
</template>

<style>
.badge-shimmer {
    background: linear-gradient(110deg,
            transparent 20%,
            rgba(255, 255, 255, 0.35) 45%,
            rgba(255, 255, 255, 0.35) 55%,
            transparent 80%);
    background-size: 200% 100%;
    animation: badge-shimmer-move 2.8s ease-in-out infinite;
}

@keyframes badge-shimmer-move {
    0% {
        background-position: 150% 0;
    }

    100% {
        background-position: -50% 0;
    }
}

/* Sembunyikan scrollbar carousel menu mobile, geser tetap berfungsi */
.no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>