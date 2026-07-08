<script setup>
import { Head, router } from '@inertiajs/vue3'
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'

// ─── Props ────────────────────────────────────────────────────────────────────
// Versi publik TIDAK menerima prop `guru` — tidak ada user login.
// NIS tidak dikirim dari server, jadi tidak ada di sini.
const props = defineProps({
    kelasList: { type: Array, default: () => [] },
    kelas: { type: Object, default: null },
    dataLoaded: { type: Boolean, default: false },
    mode: { type: String, default: 'bulan' },
    bulan: { type: Number, default: null },
    tahun: { type: Number, default: null },
    mulai: { type: String, default: null },
    sampai: { type: String, default: null },
    label: { type: String, default: '' },
    hariEfektif: { type: Array, default: () => [] },
    analytics: { type: Object, default: null },
})

// ─── Konstanta ────────────────────────────────────────────────────────────────
const BULAN_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const COLORS = {
    hadir: '#639922',
    sakit: '#BA7517',
    izin: '#378ADD',
    alpha: '#E24B4A',
}

// ─── Kelas picker ─────────────────────────────────────────────────────────────
const kelasSearch = ref('')
const loading = ref(false)

const kelasFiltered = computed(() => {
    const q = kelasSearch.value.trim().toLowerCase()
    if (!q) return props.kelasList
    return props.kelasList.filter(k =>
        k.kelas.toLowerCase().includes(q) ||
        k.guru_nama.toLowerCase().includes(q)
    )
})

function selectKelas(kelasId) {
    loading.value = true
    router.get(route('public.absensi.analytics'), { kelas_id: kelasId }, {
        preserveScroll: false,
        onFinish: () => { loading.value = false },
    })
}

function changeKelas() {
    router.get(route('public.absensi.analytics'), {}, { preserveScroll: false })
}

// ─── Filter periode ───────────────────────────────────────────────────────────
const filterMode = ref(props.mode ?? 'bulan')
const selectedBulan = ref(props.bulan ?? (new Date().getMonth() + 1))
const selectedTahun = ref(props.tahun ?? new Date().getFullYear())
const tanggalMulai = ref(props.mulai ?? '')
const tanggalSampai = ref(props.sampai ?? '')
const filterError = ref('')

const tahunOptions = computed(() => {
    const y = new Date().getFullYear()
    return Array.from({ length: 6 }, (_, i) => y - i)
})

const todayStr = new Date().toISOString().slice(0, 10)

function applyFilter() {
    if (!props.kelas) return
    filterError.value = ''
    const base = { kelas_id: props.kelas.id }

    if (filterMode.value === 'bulan') {
        loading.value = true
        router.get(route('public.absensi.analytics'), {
            ...base, mode: 'bulan',
            bulan: selectedBulan.value,
            tahun: selectedTahun.value,
        }, { preserveScroll: false, onFinish: () => { loading.value = false } })
        return
    }

    if (!tanggalMulai.value || !tanggalSampai.value) {
        filterError.value = 'Isi kedua tanggal terlebih dahulu.'
        return
    }
    if (tanggalMulai.value > tanggalSampai.value) {
        filterError.value = 'Tanggal mulai harus sebelum tanggal akhir.'
        return
    }
    const diff = (new Date(tanggalSampai.value) - new Date(tanggalMulai.value)) / 86400000
    if (diff > 92) {
        filterError.value = 'Rentang maksimal 92 hari.'
        return
    }

    loading.value = true
    router.get(route('public.absensi.analytics'), {
        ...base, mode: 'rentang',
        mulai: tanggalMulai.value,
        sampai: tanggalSampai.value,
    }, { preserveScroll: false, onFinish: () => { loading.value = false } })
}

// ─── Threshold ────────────────────────────────────────────────────────────────
const threshold = ref(80)
const thresholdOptions = [
    { label: '≤ 80%', value: 80 },
    { label: '≤ 70%', value: 70 },
    { label: '≤ 60%', value: 60 },
]

// ─── Derived data ─────────────────────────────────────────────────────────────
const hasData = computed(() => props.hariEfektif.length > 0 && !!props.analytics)

const siswa = computed(() => props.analytics?.siswa ?? [])

const rekapKelas = computed(() => props.analytics?.rekap_kelas ?? null)

const avgKehadiran = computed(() => {
    const valid = siswa.value.filter(s => s.pct_kehadiran !== null && s.pct_kehadiran !== undefined)
    if (!valid.length) return null
    return Math.round(valid.reduce((a, s) => a + s.pct_kehadiran, 0) / valid.length * 10) / 10
})

const siswaByPct = computed(() =>
    [...siswa.value].sort((a, b) => (b.pct_kehadiran ?? 0) - (a.pct_kehadiran ?? 0))
)

const topSiswa = computed(() => siswaByPct.value.slice(0, 5))

const bottomSiswa = computed(() =>
    siswaByPct.value
        .filter(s => s.pct_kehadiran !== null && s.pct_kehadiran < threshold.value)
        .sort((a, b) => (a.pct_kehadiran ?? 0) - (b.pct_kehadiran ?? 0))
)

const trendTab = ref('mingguan')
const trendData = computed(() => {
    if (!props.analytics) return []
    return trendTab.value === 'mingguan'
        ? (props.analytics.trend_mingguan ?? [])
        : (props.analytics.trend_bulanan ?? [])
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(nama) {
    return (nama ?? '').split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()
}

function pctColor(pct) {
    if (pct === null || pct === undefined) return '#888'
    if (pct >= 80) return COLORS.hadir
    if (pct >= 70) return COLORS.sakit
    return COLORS.alpha
}

function pctTextClass(pct) {
    if (pct === null || pct === undefined) return 'text-slate-400'
    if (pct >= 80) return 'text-emerald-700 dark:text-emerald-400'
    if (pct >= 70) return 'text-amber-700 dark:text-amber-400'
    return 'text-rose-600 dark:text-rose-400'
}

function avgClass(avg) {
    if (avg === null) return 'text-slate-400'
    if (avg >= 80) return 'text-emerald-700 dark:text-emerald-400'
    if (avg >= 70) return 'text-amber-700 dark:text-amber-400'
    return 'text-rose-600 dark:text-rose-400'
}

// ─── Chart.js ─────────────────────────────────────────────────────────────────
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
    const canvas = document.getElementById('pubDonut')
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
    const canvas = document.getElementById('pubBarDaily')
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
    const canvas = document.getElementById('pubTrendLine')
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

async function initCharts() {
    await loadChartJs()
    await nextTick()
    renderPie()
    renderBar()
    renderTrend()
}

watch(trendTab, async () => { await nextTick(); renderTrend() })

watch(() => props.analytics, async (val) => {
    if (!val) return
    await nextTick()
    renderPie()
    renderBar()
    renderTrend()
}, { deep: true })

onMounted(() => { if (hasData.value) initCharts() })

onBeforeUnmount(() => {
    destroyChart(pieInstance)
    destroyChart(barInstance)
    destroyChart(trendInstance)
})
</script>

<template>

    <Head title="Rekap Kehadiran Kelas" />

    <!--
        Versi publik TIDAK memakai MenuLayout (tidak ada sidebar/navbar login).
        Gunakan layout kosong atau layout publik milikmu sendiri.
        Jika kamu punya PublicLayout, ganti <div class="pub-root"> dengan <PublicLayout>.
    -->
    <div class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

        <!-- ══ NAVBAR PUBLIK ══════════════════════════════════════════════ -->
        <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
            <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <div class="flex items-center gap-2.5">
                    <div
                        class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-base flex-shrink-0">
                        📊
                    </div>
                    <span class="text-sm font-bold text-slate-800 dark:text-white">Rekap Kehadiran Kelas</span>
                </div>

                <!-- Badge "Data Publik" -->
                <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
                    🌐 Data Publik
                </span>
            </div>
        </nav>

        <!-- ══ BANNER INFO PUBLIK ═════════════════════════════════════════ -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
            <div class="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2.5">
                <span class="text-blue-500 text-sm flex-shrink-0">ℹ️</span>
                <p class="text-xs text-blue-700 dark:text-blue-300 leading-snug">
                    Halaman ini menampilkan <strong>data agregat kehadiran kelas</strong> secara publik.
                    Informasi pribadi seperti NIS dan catatan absensi tidak ditampilkan.
                    Data diperbarui setiap 15 menit.
                </p>
            </div>
        </div>

        <main class="max-w-5xl mx-auto px-4 py-6 space-y-5 pb-16">

            <!-- ══ STEP 1: PILIH KELAS ════════════════════════════════════ -->
            <template v-if="!kelas">
                <div class="text-center py-6">
                    <h1 class="text-2xl font-extrabold text-slate-800 dark:text-white">Pilih kelas</h1>
                    <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                        Lihat statistik kehadiran kelas secara transparan dan terbuka.
                    </p>
                </div>

                <div class="max-w-md mx-auto mb-8">
                    <div
                        class="flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors">
                        <span class="text-slate-400 text-sm">🔍</span>
                        <input v-model="kelasSearch" type="search" placeholder="Cari kelas atau wali kelas…"
                            class="flex-1 bg-transparent outline-none text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-white" />
                    </div>
                </div>

                <div v-if="kelasFiltered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <button v-for="k in kelasFiltered" :key="k.id" @click="selectKelas(k.id)"
                        class="group flex items-center gap-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200">
                        <div
                            class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl flex-shrink-0">
                            🏫</div>
                        <div class="flex-1 min-w-0">
                            <div class="font-bold text-slate-800 dark:text-white text-sm">{{ k.kelas }}</div>
                            <div
                                class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                                <span>👤 {{ k.guru_nama }}</span>
                                <span>🎓 {{ k.jumlah_siswa }} siswa</span>
                            </div>
                        </div>
                        <span
                            class="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all text-sm">›</span>
                    </button>
                </div>

                <div v-else class="text-center py-16 text-slate-400 dark:text-slate-500">
                    <div class="text-4xl mb-3">😶</div>
                    <p class="text-sm">Tidak ada kelas yang cocok</p>
                </div>
            </template>

            <!-- ══ STEP 2: KELAS DIPILIH ══════════════════════════════════ -->
            <template v-else>

                <!-- Breadcrumb kelas -->
                <div
                    class="flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg flex-shrink-0">
                            🏫</div>
                        <div>
                            <div class="font-bold text-slate-800 dark:text-white text-sm">{{ kelas.kelas }}</div>
                            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Wali Kelas: {{
                                kelas.guru_nama }}</div>
                        </div>
                    </div>
                    <button @click="changeKelas"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                        🔄 Ganti Kelas
                    </button>
                </div>

                <!-- Filter card -->
                <div
                    class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
                    <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">🔽
                        Filter Periode</p>

                    <div class="flex gap-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl p-1 w-fit">
                        <button
                            :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all', filterMode === 'bulan' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white']"
                            @click="filterMode = 'bulan'; filterError = ''">📆 Per Bulan</button>
                        <button
                            :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all', filterMode === 'rentang' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white']"
                            @click="filterMode = 'rentang'; filterError = ''">📅 Rentang Tanggal</button>
                    </div>

                    <div class="flex flex-wrap items-end gap-3">
                        <template v-if="filterMode === 'bulan'">
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Bulan</label>
                                <select v-model="selectedBulan"
                                    class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-w-[150px] transition">
                                    <option v-for="(nama, idx) in BULAN_NAMES" :key="idx" :value="idx + 1">{{ nama }}
                                    </option>
                                </select>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tahun</label>
                                <select v-model="selectedTahun"
                                    class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-w-[110px] transition">
                                    <option v-for="y in tahunOptions" :key="y" :value="y">{{ y }}</option>
                                </select>
                            </div>
                        </template>

                        <template v-else>
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Dari
                                    Tanggal</label>
                                <div class="relative">
                                    <input type="date" v-model="tanggalMulai" :max="tanggalSampai || todayStr"
                                        class="date-input w-full pr-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                                    <CalendarDaysIcon
                                        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label
                                    class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sampai
                                    Tanggal</label>
                                <div class="relative">
                                    <input type="date" v-model="tanggalSampai" :min="tanggalMulai || undefined"
                                        :max="todayStr"
                                        class="date-input w-full pr-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                                    <CalendarDaysIcon
                                        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </template>

                        <p v-if="filterError" class="text-xs text-rose-500 flex items-center gap-1 pb-1.5">⚠️ {{
                            filterError }}</p>

                        <button @click="applyFilter" :disabled="loading"
                            class="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <span v-else>🔍</span>
                            {{ loading ? 'Memuat…' : 'Tampilkan' }}
                        </button>
                    </div>
                </div>

                <!-- Placeholder -->
                <div v-if="!dataLoaded && !hasData"
                    class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-16 text-center">
                    <div class="text-5xl mb-4">📊</div>
                    <p class="font-semibold text-slate-700 dark:text-slate-200">Belum ada data ditampilkan</p>
                    <p class="mt-1.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                        Pilih periode, lalu klik <strong>Tampilkan</strong>.
                    </p>
                </div>

                <div v-else-if="dataLoaded && !hasData"
                    class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-16 text-center">
                    <div class="text-5xl mb-4">📭</div>
                    <p class="font-semibold text-slate-700 dark:text-slate-200">Belum ada data absensi</p>
                    <p class="mt-1.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                        Pilih periode lain atau pastikan absensi sudah diinput.
                    </p>
                </div>

                <!-- ══ DATA ADA ════════════════════════════════════════════ -->
                <template v-if="hasData">

                    <!-- Label periode -->
                    <div class="flex items-center flex-wrap gap-3">
                        <span
                            class="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-950 text-sky-300 px-4 py-1.5 rounded-full text-xs font-bold">
                            📅 {{ label }}
                        </span>
                        <span class="text-xs text-slate-500 dark:text-slate-400">
                            {{ rekapKelas?.hari_efektif }} hari efektif · {{ rekapKelas?.total_siswa }} siswa
                        </span>
                        <!-- Tanda data dipublikasikan -->
                        <span class="text-[10px] text-slate-400 dark:text-slate-500 italic ml-auto">
                            🕐 Data diperbarui setiap 15 menit
                        </span>
                    </div>

                    <!-- Alert -->
                    <div v-if="bottomSiswa.length"
                        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                        <span class="text-rose-500 text-xl flex-shrink-0">⚠️</span>
                        <p class="text-sm text-rose-700 dark:text-rose-300">
                            <strong>{{ bottomSiswa.length }} siswa</strong> memiliki kehadiran di bawah {{ threshold
                            }}%.
                        </p>
                    </div>

                    <!-- Metric cards -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div
                            class="rounded-xl p-4 bg-slate-50 dark:bg-slate-800/60 ring-1 ring-slate-200 dark:ring-slate-700 hover:scale-[1.02] hover:shadow-md transition-all duration-200 cursor-default">
                            <div class="text-lg mb-1.5">📊</div>
                            <div :class="['text-2xl font-extrabold leading-none font-mono', avgClass(avgKehadiran)]">
                                {{ avgKehadiran !== null ? avgKehadiran + '%' : '—' }}
                            </div>
                            <div
                                class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Rata-rata</div>
                        </div>
                        <div
                            class="rounded-xl p-4 bg-slate-50 dark:bg-slate-800/60 ring-1 ring-slate-200 dark:ring-slate-700 hover:scale-[1.02] hover:shadow-md transition-all duration-200 cursor-default">
                            <div class="text-lg mb-1.5">📅</div>
                            <div class="text-2xl font-extrabold leading-none font-mono text-slate-800 dark:text-white">
                                {{ rekapKelas?.hari_efektif }}</div>
                            <div
                                class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Hari Efektif</div>
                        </div>
                        <div
                            class="rounded-xl p-4 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-200 dark:ring-emerald-800 hover:scale-[1.02] hover:shadow-md transition-all duration-200 cursor-default">
                            <div class="text-lg mb-1.5">✅</div>
                            <div
                                class="text-2xl font-extrabold leading-none font-mono text-emerald-700 dark:text-emerald-300">
                                {{ rekapKelas?.total_hadir }}</div>
                            <div
                                class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Hadir</div>
                        </div>
                        <div
                            class="rounded-xl p-4 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-200 dark:ring-amber-800 hover:scale-[1.02] hover:shadow-md transition-all duration-200 cursor-default">
                            <div class="text-lg mb-1.5">🩺</div>
                            <div
                                class="text-2xl font-extrabold leading-none font-mono text-amber-700 dark:text-amber-300">
                                {{ rekapKelas?.total_sakit }}</div>
                            <div
                                class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Sakit</div>
                        </div>
                        <div
                            class="rounded-xl p-4 bg-sky-50 dark:bg-sky-900/20 ring-1 ring-sky-200 dark:ring-sky-800 hover:scale-[1.02] hover:shadow-md transition-all duration-200 cursor-default">
                            <div class="text-lg mb-1.5">📋</div>
                            <div class="text-2xl font-extrabold leading-none font-mono text-sky-700 dark:text-sky-300">
                                {{ rekapKelas?.total_izin }}</div>
                            <div
                                class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Izin</div>
                        </div>
                        <div
                            class="rounded-xl p-4 bg-rose-50 dark:bg-rose-900/20 ring-1 ring-rose-200 dark:ring-rose-800 hover:scale-[1.02] hover:shadow-md transition-all duration-200 cursor-default">
                            <div class="text-lg mb-1.5">🚫</div>
                            <div
                                class="text-2xl font-extrabold leading-none font-mono text-rose-700 dark:text-rose-300">
                                {{ rekapKelas?.total_alpha }}</div>
                            <div
                                class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Alpha</div>
                        </div>
                    </div>

                    <!-- Charts row -->
                    <div class="grid grid-cols-1 sm:grid-cols-5 gap-4">
                        <!-- Donut -->
                        <div
                            class="sm:col-span-2 bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                            <p
                                class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                                Distribusi Status</p>
                            <div class="flex flex-wrap gap-3 mb-3">
                                <span
                                    v-for="(color, key) in { Hadir: '#639922', Sakit: '#BA7517', Izin: '#378ADD', Alpha: '#E24B4A' }"
                                    :key="key"
                                    class="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                                    <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                        :style="{ background: color }"></span>
                                    {{ key }}
                                </span>
                            </div>
                            <div style="position:relative;height:200px;">
                                <canvas id="pubDonut" role="img"
                                    aria-label="Distribusi status kehadiran kelas.">Distribusi kehadiran kelas.</canvas>
                            </div>
                        </div>

                        <!-- Bar harian -->
                        <div
                            class="sm:col-span-3 bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                            <div class="flex items-center justify-between mb-3">
                                <p
                                    class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                    Kehadiran Per Hari</p>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="(color, lbl) in { Hadir: '#639922', Sakit: '#BA7517', Izin: '#378ADD', Alpha: '#E24B4A' }"
                                        :key="lbl"
                                        class="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                                        <span class="w-2 h-2 rounded-sm" :style="{ background: color }"></span>{{ lbl }}
                                    </span>
                                </div>
                            </div>
                            <div style="position:relative;height:220px;">
                                <canvas id="pubBarDaily" role="img" aria-label="Bar chart kehadiran per hari.">Kehadiran
                                    harian kelas.</canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Tabel siswa -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        <!-- Top hadir -->
                        <div
                            class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                            <div
                                class="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                                <div class="flex items-center gap-2">
                                    <span class="text-base">🏆</span>
                                    <span
                                        class="text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Kehadiran
                                        Tertinggi</span>
                                </div>
                                <span
                                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                                    Top {{ topSiswa.length }}
                                </span>
                            </div>
                            <div>
                                <div v-for="(s, idx) in topSiswa" :key="s.siswa_id"
                                    class="flex items-center gap-3 px-5 py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <span
                                        class="text-xs text-slate-400 dark:text-slate-500 font-mono w-4 text-right flex-shrink-0">{{
                                        idx + 1 }}</span>
                                    <div
                                        class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {{ initials(s.nama_lengkap) }}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-semibold text-slate-800 dark:text-white truncate">{{
                                            s.nama_lengkap }}</div>
                                        <!-- NIS tidak ditampilkan di versi publik -->
                                    </div>
                                    <div class="w-20 flex-shrink-0">
                                        <div
                                            class="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-1">
                                            <div class="h-full rounded-full transition-all"
                                                :style="{ width: (s.pct_kehadiran ?? 0) + '%', background: pctColor(s.pct_kehadiran) }">
                                            </div>
                                        </div>
                                        <div
                                            :class="['text-xs font-bold font-mono text-right', pctTextClass(s.pct_kehadiran)]">
                                            {{ s.pct_kehadiran !== null ? s.pct_kehadiran + '%' : '—' }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="!topSiswa.length" class="px-5 py-10 text-center text-slate-400 text-sm">Belum
                                    ada data siswa.</div>
                            </div>
                        </div>

                        <!-- Perlu perhatian -->
                        <div
                            class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                            <div
                                class="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex-wrap gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-base">⚠️</span>
                                    <span
                                        class="text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Perlu
                                        Perhatian</span>
                                </div>
                                <div class="flex gap-1">
                                    <button v-for="opt in thresholdOptions" :key="opt.value"
                                        @click="threshold = opt.value" :class="[
                                            'px-2 py-0.5 rounded-md text-[10px] font-bold transition-all border',
                                            threshold === opt.value
                                                ? 'bg-rose-600 text-white border-rose-600'
                                                : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-rose-400 dark:hover:border-rose-500',
                                        ]">
                                        {{ opt.label }}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div v-for="(s, idx) in bottomSiswa" :key="s.siswa_id"
                                    class="flex items-center gap-3 px-5 py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <span
                                        class="text-xs text-slate-400 dark:text-slate-500 font-mono w-4 text-right flex-shrink-0">{{
                                        idx + 1 }}</span>
                                    <div
                                        class="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {{ initials(s.nama_lengkap) }}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-semibold text-slate-800 dark:text-white truncate">{{
                                            s.nama_lengkap }}</div>
                                        <div class="text-xs text-slate-400 dark:text-slate-500">
                                            alpha {{ s.counts?.alpha ?? 0 }}×
                                        </div>
                                    </div>
                                    <div class="w-20 flex-shrink-0">
                                        <div
                                            class="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-1">
                                            <div class="h-full rounded-full transition-all"
                                                :style="{ width: (s.pct_kehadiran ?? 0) + '%', background: pctColor(s.pct_kehadiran) }">
                                            </div>
                                        </div>
                                        <div
                                            :class="['text-xs font-bold font-mono text-right', pctTextClass(s.pct_kehadiran)]">
                                            {{ s.pct_kehadiran !== null ? s.pct_kehadiran + '%' : '—' }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="!bottomSiswa.length"
                                    class="px-5 py-10 text-center text-slate-400 dark:text-slate-500 text-sm">
                                    <div class="text-3xl mb-2">✅</div>
                                    Semua siswa di atas {{ threshold }}% — bagus!
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tren -->
                    <div
                        class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <p
                                class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                Tren Rata-rata Kehadiran Kelas</p>
                            <div class="flex gap-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg p-0.5">
                                <button
                                    :class="['px-3 py-1 rounded-md text-xs font-semibold transition-all', trendTab === 'mingguan' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white']"
                                    @click="trendTab = 'mingguan'">Mingguan</button>
                                <button
                                    :class="['px-3 py-1 rounded-md text-xs font-semibold transition-all', trendTab === 'bulanan' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white']"
                                    @click="trendTab = 'bulanan'">Bulanan</button>
                            </div>
                        </div>
                        <div v-if="trendData.length" style="position:relative;height:200px;">
                            <canvas id="pubTrendLine" role="img" aria-label="Tren rata-rata kehadiran kelas.">Tren
                                kehadiran kelas dari waktu ke waktu.</canvas>
                        </div>
                        <div v-else class="py-10 text-center text-slate-400 dark:text-slate-500 text-sm">
                            Data tren tidak tersedia untuk periode ini.
                        </div>
                    </div>

                    <!-- Footer info privasi -->
                    <div
                        class="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                        <span class="text-slate-400 text-sm flex-shrink-0 mt-0.5">🔒</span>
                        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Halaman ini menampilkan data kehadiran secara agregat.
                            Informasi sensitif seperti NIS, nomor telepon, dan catatan absensi pribadi tidak ditampilkan
                            demi menjaga privasi siswa.
                        </p>
                    </div>

                </template>
            </template>

        </main>
    </div>
</template>

<style scoped>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance: none;
    appearance: none;
}

.date-input::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}
</style>