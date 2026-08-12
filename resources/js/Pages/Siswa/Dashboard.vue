<script setup>
import UserLayout from '@/Layouts/UserLayout.vue'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
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
    ChartBarIcon,
} from '@heroicons/vue/24/solid'
import { EnvelopeIcon } from '@heroicons/vue/24/outline'

/* ================= PAGE & USER ================= */
const page = usePage()
const user = computed(() => page.props.auth.user || {})

/* ================= PROPS (analytics kehadiran kelas untuk desktop) ================= */
// Dikirim dari controller dashboard siswa, dibangun dari logika yang sama
// dengan PublicAbsensiAnalyticsController::buildAnalytics(), tapi kelas_id
// otomatis dikunci ke kelas milik siswa yang sedang login.
const props = defineProps({
    analytics: { type: Object, default: null },
    hariEfektif: { type: Array, default: () => [] },
    label: { type: String, default: '' },
})

/* ================= TOAST ================= */
const toast = ref({ show: false, message: '', type: 'info' })

const showToast = (message, type = 'info') => {
    toast.value = { show: true, message, type }
    setTimeout(() => { toast.value.show = false }, 2500)
}

/* ================= SISWA (data pribadi) ================= */
const siswa = computed(() => page.props.siswa || {})

/* ================= MENU ================= */
const menuItems = computed(() => [
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
        // Menu ini yang mengarah ke halaman analytics kehadiran kelas.
        // Di mobile, ini satu-satunya akses ke analytics (bukan ditampilkan penuh).
        // Di desktop, card ini SENGAJA di-exclude dari grid Quick Access
        // (lihat `desktopMenuItems`) karena datanya sudah langsung tampil
        // penuh/terbuka di section bawah Quick Access.
        title: 'Analytics',
        icon: ChartBarIcon,
        route: route('public.absensi.analytics', siswa.value.kelas?.id ? { kelas_id: siswa.value.kelas.id } : {}),
        gradient: 'from-purple-500 to-fuchsia-600',
        glow: 'shadow-purple-400/30',
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        border: 'border-purple-100 dark:border-purple-800/30',
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
])

/* ================= NAV ================= */
const goTo = (url) => router.visit(url, { preserveScroll: true, preserveState: true })

// Di desktop, "Attendance Analytics" TIDAK ditampilkan sebagai card menu —
// datanya langsung tampil penuh (terbuka, tanpa perlu klik) di section
// "DESKTOP: ANALYTICS KEHADIRAN KELAS" di bawah Quick Access.
// Di mobile, tetap tampil sebagai card carousel karena itu satu-satunya akses ke halaman analytics.
const desktopMenuItems = computed(() =>
    menuItems.value.filter((item) => item.title !== 'Attendance Analytics')
)

/* ================= COPY ================= */
const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => showToast('ID berhasil disalin!', 'success'))
        .catch(() => showToast('Gagal menyalin ke clipboard!', 'error'))
}

/* ================= SLIDER (Welcome / Personal Info) ================= */
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

/* ================= QUICK ACCESS CAROUSEL (Mobile) ================= */
// 4 kartu per halaman, geser ke samping (drag/swipe), supaya tidak
// manjang ke bawah walau menunya banyak.
// Catatan: carousel mobile SENGAJA tetap pakai `menuItems` (lengkap,
// termasuk Attendance Analytics) — beda dengan grid desktop yang pakai
// `desktopMenuItems`.
const CARDS_PER_PAGE = 4

const menuPages = computed(() => {
    const pages = []
    for (let i = 0; i < menuItems.value.length; i += CARDS_PER_PAGE) {
        pages.push(menuItems.value.slice(i, i + CARDS_PER_PAGE))
    }
    return pages
})

const menuCarouselRef = ref(null)
const activeMenuPage = ref(0)
let isMenuDragging = false
let menuDragStartX = 0
let menuScrollStartX = 0

const onMenuDragStart = (e) => {
    if (!menuCarouselRef.value) return
    isMenuDragging = true
    menuDragStartX = e.clientX
    menuScrollStartX = menuCarouselRef.value.scrollLeft
    menuCarouselRef.value.setPointerCapture?.(e.pointerId)
}

const onMenuDragMove = (e) => {
    if (!isMenuDragging || !menuCarouselRef.value) return
    const delta = e.clientX - menuDragStartX
    menuCarouselRef.value.scrollLeft = menuScrollStartX - delta
}

const onMenuDragEnd = () => {
    isMenuDragging = false
}

const onMenuCarouselScroll = () => {
    if (!menuCarouselRef.value) return
    const pageWidth = menuCarouselRef.value.clientWidth
    if (!pageWidth) return
    activeMenuPage.value = Math.round(menuCarouselRef.value.scrollLeft / pageWidth)
}

const scrollToMenuPage = (index) => {
    if (!menuCarouselRef.value) return
    menuCarouselRef.value.scrollTo({
        left: index * menuCarouselRef.value.clientWidth,
        behavior: 'smooth',
    })
}

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

/* ================= ANALYTICS KEHADIRAN KELAS (Desktop only) ================= */
const COLORS = {
    hadir: '#639922',
    sakit: '#BA7517',
    izin: '#378ADD',
    alpha: '#E24B4A',
}

const hasAnalyticsData = computed(() => props.hariEfektif.length > 0 && !!props.analytics)
const rekapKelas = computed(() => props.analytics?.rekap_kelas ?? null)

const avgKehadiranKelas = computed(() => {
    const list = props.analytics?.siswa ?? []
    const valid = list.filter(s => s.pct_kehadiran !== null && s.pct_kehadiran !== undefined)
    if (!valid.length) return null
    return Math.round(valid.reduce((a, s) => a + s.pct_kehadiran, 0) / valid.length * 10) / 10
})

function avgClass(avg) {
    if (avg === null) return 'text-slate-400'
    if (avg >= 80) return 'text-emerald-700 dark:text-emerald-400'
    if (avg >= 70) return 'text-amber-700 dark:text-amber-400'
    return 'text-rose-600 dark:text-rose-400'
}

const trendTab = ref('mingguan')
const trendData = computed(() => {
    if (!props.analytics) return []
    return trendTab.value === 'mingguan'
        ? (props.analytics.trend_mingguan ?? [])
        : (props.analytics.trend_bulanan ?? [])
})

let Chart = null
let pieInstance = null
let barInstance = null
let trendInstance = null

async function loadChartJs() {
    if (window.Chart) { Chart = window.Chart; return }
    await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
        s.onload = () => { Chart = window.Chart; resolve() }
        s.onerror = reject
        document.head.appendChild(s)
    })
}

function destroyChart(instance) {
    try { instance?.destroy() } catch (_) { }
}

function renderPie() {
    const canvas = document.getElementById('siswaDonut')
    if (!canvas || !Chart || !rekapKelas.value) return
    destroyChart(pieInstance)

    const { total_hadir: h, total_sakit: s, total_izin: i, total_alpha: a } = rekapKelas.value
    const total = h + s + i + a || 1

    pieInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Hadir', 'Sakit', 'Izin', 'Alpha'],
            datasets: [{
                data: [h, s, i, a],
                backgroundColor: [COLORS.hadir, COLORS.sakit, COLORS.izin, COLORS.alpha],
                borderWidth: 0,
                hoverOffset: 6,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${ctx.raw} hari (${Math.round(ctx.raw / total * 100)}%)`,
                    },
                },
            },
        },
    })
}

function renderBar() {
    const canvas = document.getElementById('siswaBarDaily')
    if (!canvas || !Chart || !props.analytics) return
    destroyChart(barInstance)

    const trendHarian = props.analytics.trend_harian ?? []
    if (!trendHarian.length) return

    barInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: trendHarian.map(d => new Date(d.tanggal).getDate()),
            datasets: [
                { label: 'Hadir', data: trendHarian.map(d => d.hadir), backgroundColor: COLORS.hadir, borderRadius: 3, borderSkipped: false },
                { label: 'Sakit', data: trendHarian.map(d => d.sakit), backgroundColor: COLORS.sakit, borderRadius: 3, borderSkipped: false },
                { label: 'Izin', data: trendHarian.map(d => d.izin), backgroundColor: COLORS.izin, borderRadius: 3, borderSkipped: false },
                { label: 'Alpha', data: trendHarian.map(d => d.alpha), backgroundColor: COLORS.alpha, borderRadius: 3, borderSkipped: false },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
            scales: {
                x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 }, autoSkip: true, maxTicksLimit: 15 } },
                y: { stacked: true, grid: { color: 'rgba(128,128,128,.08)' }, ticks: { font: { size: 10 }, stepSize: 5 }, beginAtZero: true },
            },
        },
    })
}

function renderTrend() {
    const canvas = document.getElementById('siswaTrendLine')
    if (!canvas || !Chart) return
    destroyChart(trendInstance)

    const data = trendData.value
    if (!data.length) return

    trendInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: data.map(d => d.label),
            datasets: [{
                label: 'Rata-rata kehadiran (%)',
                data: data.map(d => d.pct_hadir),
                borderColor: COLORS.izin,
                backgroundColor: 'rgba(55,138,221,0.08)',
                borderWidth: 2,
                pointBackgroundColor: COLORS.izin,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.35,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toFixed(1)}%` } } },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                y: { min: 50, max: 100, grid: { color: 'rgba(128,128,128,.08)' }, ticks: { font: { size: 11 }, callback: v => v + '%' } },
            },
        },
    })
}

async function initAnalyticsCharts() {
    await loadChartJs()
    await nextTick()
    renderPie()
    renderBar()
    renderTrend()
}

watch(trendTab, async () => { await nextTick(); renderTrend() })

onMounted(() => {
    if (hasAnalyticsData.value) initAnalyticsCharts()
})
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
                    <div class="p-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
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

                        <!-- Kejuruan -->
                        <div
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

            <!-- ── MOBILE QUICK ACCESS (carousel, 4 kartu per halaman) ── -->
            <!-- Sengaja tetap pakai `menuItems` (lengkap, termasuk Attendance Analytics) -->
            <div class="md:hidden">
                <p class="text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-3 px-0.5">
                    Quick Access</p>

                <div ref="menuCarouselRef" @scroll="onMenuCarouselScroll" @pointerdown="onMenuDragStart"
                    @pointermove="onMenuDragMove" @pointerup="onMenuDragEnd" @pointerleave="onMenuDragEnd"
                    @pointercancel="onMenuDragEnd"
                    class="no-scrollbar flex overflow-x-auto snap-x snap-mandatory scroll-smooth select-none cursor-grab active:cursor-grabbing">

                    <div v-for="(cardsPage, pageIndex) in menuPages" :key="pageIndex"
                        class="grid grid-cols-2 grid-rows-2 gap-3 shrink-0 w-full snap-start snap-always box-border pl-1 pr-4">
                        <Link v-for="item in cardsPage" :key="item.title" :href="item.route" preserve-scroll class="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border
                                   transition-all duration-300 active:scale-[0.97]" :class="[item.bg, item.border]">
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

                <!-- Dots indikator halaman -->
                <div v-if="menuPages.length > 1" class="flex items-center justify-center gap-1.5 mt-4">
                    <button v-for="(cardsPage, i) in menuPages" :key="i" type="button" @click="scrollToMenuPage(i)"
                        class="h-1.5 rounded-full transition-all duration-300"
                        :class="i === activeMenuPage ? 'w-5 bg-indigo-600 dark:bg-blue-400' : 'w-1.5 bg-gray-300 dark:bg-gray-700'" />
                </div>
            </div>

            <!-- ── DESKTOP NAV CARDS ── -->
            <!-- Pakai `desktopMenuItems` (tanpa Attendance Analytics), karena
                 datanya langsung tampil penuh di section analytics di bawah -->
            <div class="hidden md:block">
                <p class="text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-4 px-0.5">
                    Quick Acces</p>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link v-for="item in desktopMenuItems" :key="item.title" :href="item.route" preserve-scroll class="group relative overflow-hidden flex items-center gap-4 px-5 py-4 rounded-2xl border
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

            <!-- ── DESKTOP: ANALYTICS KEHADIRAN KELAS (di bawah, tampil terbuka tanpa perlu klik) ── -->
            <div v-if="hasAnalyticsData" class="hidden md:block">
                <div class="flex items-center justify-between mb-4 px-0.5">
                    <p class="text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
                        Attendance Analytics{{ label ? ` · ${label}` : '' }}
                    </p>
                    <Link :href="route('public.absensi.analytics', siswa.kelas?.id ? { kelas_id: siswa.kelas.id } : {})"
                        class="text-xs font-semibold text-indigo-600 dark:text-blue-400 hover:underline">
                        Lihat detail lengkap →
                    </Link>
                </div>

                <!-- Metric cards -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                    <div
                        class="rounded-xl p-4 bg-slate-50 dark:bg-gray-900/60 ring-1 ring-slate-200 dark:ring-gray-700">
                        <div class="text-lg mb-1.5">📊</div>
                        <div :class="['text-2xl font-extrabold leading-none font-mono', avgClass(avgKehadiranKelas)]">
                            {{ avgKehadiranKelas !== null ? avgKehadiranKelas + '%' : '—' }}
                        </div>
                        <div
                            class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                            Rata-rata</div>
                    </div>
                    <div
                        class="rounded-xl p-4 bg-slate-50 dark:bg-gray-900/60 ring-1 ring-slate-200 dark:ring-gray-700">
                        <div class="text-lg mb-1.5">📅</div>
                        <div class="text-2xl font-extrabold leading-none font-mono text-slate-800 dark:text-white">
                            {{ rekapKelas?.hari_efektif }}</div>
                        <div
                            class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                            Hari Efektif</div>
                    </div>
                    <div
                        class="rounded-xl p-4 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-200 dark:ring-emerald-800">
                        <div class="text-lg mb-1.5">✅</div>
                        <div
                            class="text-2xl font-extrabold leading-none font-mono text-emerald-700 dark:text-emerald-300">
                            {{ rekapKelas?.total_hadir }}</div>
                        <div
                            class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                            Hadir</div>
                    </div>
                    <div
                        class="rounded-xl p-4 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-200 dark:ring-amber-800">
                        <div class="text-lg mb-1.5">🩺</div>
                        <div class="text-2xl font-extrabold leading-none font-mono text-amber-700 dark:text-amber-300">
                            {{ rekapKelas?.total_sakit }}</div>
                        <div
                            class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                            Sakit</div>
                    </div>
                    <div class="rounded-xl p-4 bg-sky-50 dark:bg-sky-900/20 ring-1 ring-sky-200 dark:ring-sky-800">
                        <div class="text-lg mb-1.5">📋</div>
                        <div class="text-2xl font-extrabold leading-none font-mono text-sky-700 dark:text-sky-300">
                            {{ rekapKelas?.total_izin }}</div>
                        <div
                            class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                            Izin</div>
                    </div>
                    <div class="rounded-xl p-4 bg-rose-50 dark:bg-rose-900/20 ring-1 ring-rose-200 dark:ring-rose-800">
                        <div class="text-lg mb-1.5">🚫</div>
                        <div class="text-2xl font-extrabold leading-none font-mono text-rose-700 dark:text-rose-300">
                            {{ rekapKelas?.total_alpha }}</div>
                        <div
                            class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                            Alpha</div>
                    </div>
                </div>

                <!-- Charts row -->
                <div class="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
                    <!-- Donut -->
                    <div
                        class="sm:col-span-2 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
                        <p
                            class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-3">
                            Distribusi Status</p>
                        <div class="flex flex-wrap gap-3 mb-3">
                            <span
                                v-for="(color, key) in { Hadir: '#639922', Sakit: '#BA7517', Izin: '#378ADD', Alpha: '#E24B4A' }"
                                :key="key"
                                class="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-gray-300">
                                <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                    :style="{ background: color }"></span>
                                {{ key }}
                            </span>
                        </div>
                        <div style="position:relative;height:200px;">
                            <canvas id="siswaDonut" role="img" aria-label="Distribusi status kehadiran kelas.">
                                Distribusi kehadiran kelas.</canvas>
                        </div>
                    </div>

                    <!-- Bar harian -->
                    <div
                        class="sm:col-span-3 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
                        <div class="flex items-center justify-between mb-3">
                            <p
                                class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">
                                Kehadiran Per Hari</p>
                            <div class="flex flex-wrap gap-2">
                                <span
                                    v-for="(color, lbl) in { Hadir: '#639922', Sakit: '#BA7517', Izin: '#378ADD', Alpha: '#E24B4A' }"
                                    :key="lbl"
                                    class="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-gray-400">
                                    <span class="w-2 h-2 rounded-sm" :style="{ background: color }"></span>{{ lbl }}
                                </span>
                            </div>
                        </div>
                        <div style="position:relative;height:220px;">
                            <canvas id="siswaBarDaily" role="img" aria-label="Bar chart kehadiran per hari.">
                                Kehadiran harian kelas.</canvas>
                        </div>
                    </div>
                </div>

                <!-- Tren -->
                <div class="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
                    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">
                            Tren Rata-rata Kehadiran Kelas</p>
                        <div class="flex gap-1 bg-slate-100 dark:bg-gray-900/50 rounded-lg p-0.5">
                            <button
                                :class="['px-3 py-1 rounded-md text-xs font-semibold transition-all', trendTab === 'mingguan' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white']"
                                @click="trendTab = 'mingguan'">Mingguan</button>
                            <button
                                :class="['px-3 py-1 rounded-md text-xs font-semibold transition-all', trendTab === 'bulanan' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white']"
                                @click="trendTab = 'bulanan'">Bulanan</button>
                        </div>
                    </div>
                    <div v-if="trendData.length" style="position:relative;height:200px;">
                        <canvas id="siswaTrendLine" role="img" aria-label="Tren rata-rata kehadiran kelas.">
                            Tren kehadiran kelas dari waktu ke waktu.</canvas>
                    </div>
                    <div v-else class="py-10 text-center text-slate-400 dark:text-gray-500 text-sm">
                        Data tren tidak tersedia untuk periode ini.
                    </div>
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