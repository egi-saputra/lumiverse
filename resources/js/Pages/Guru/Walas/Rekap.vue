<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import { Head } from '@inertiajs/vue3'
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'
import ExportExcel from '@/Components/Export/ExportExcel.vue'
import ExportPdf from '@/Components/Export/ExportPdf.vue'

const props = defineProps({
    guru: { type: Object, required: true },
    kelasList: { type: Array, default: () => [] },
    kelas: { type: Object, default: null },
    mode: { type: String, default: 'bulan' },
    bulan: { type: Number, default: null },
    tahun: { type: Number, default: null },
    mulai: { type: String, default: null },
    sampai: { type: String, default: null },
    label: { type: String, default: '' },
    hariEfektif: { type: Array, default: () => [] },
    siswa: { type: Array, default: () => [] },
    rekapKelas: { type: Object, default: null },
    dataLoaded: { type: Boolean, default: false },
})

// ─── Konstanta ────────────────────────────────────────────────
const STATUS = {
    hadir: { label: 'Hadir', short: 'H', bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-300 dark:ring-emerald-700' },
    sakit: { label: 'Sakit', short: 'S', bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', ring: 'ring-amber-300 dark:ring-amber-700' },
    izin: { label: 'Izin', short: 'I', bg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-700 dark:text-sky-300', ring: 'ring-sky-300 dark:ring-sky-700' },
    alpha: { label: 'Alpha', short: 'A', bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', ring: 'ring-rose-300 dark:ring-rose-700' },
}

const BULAN_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

// ─── Kelas picker ─────────────────────────────────────────────
const kelasSearch = ref('')
const loading = ref(false)

const kelasFiltered = computed(() => {
    if (!kelasSearch.value.trim()) return props.kelasList
    const q = kelasSearch.value.toLowerCase()
    return props.kelasList.filter(k =>
        k.kelas.toLowerCase().includes(q) ||
        k.guru_nama.toLowerCase().includes(q)
    )
})

function selectKelas(kelasId) {
    loading.value = true
    router.get(route('guru.absensi.rekap'), { kelas_id: kelasId },
        { preserveScroll: false, onFinish: () => { loading.value = false } })
}

function changeKelas() {
    router.get(route('guru.absensi.rekap'), {}, { preserveScroll: false })
}

// ─── Filter ───────────────────────────────────────────────────
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

function applyFilter() {
    if (!props.kelas) return
    filterError.value = ''
    const base = { kelas_id: props.kelas.id }

    if (filterMode.value === 'bulan') {
        loading.value = true
        router.get(route('guru.absensi.rekap'), {
            ...base, mode: 'bulan',
            bulan: selectedBulan.value,
            tahun: selectedTahun.value,
        }, { preserveScroll: false, onFinish: () => { loading.value = false } })
    } else {
        if (!tanggalMulai.value || !tanggalSampai.value) { filterError.value = 'Isi kedua tanggal terlebih dahulu.'; return }
        if (tanggalMulai.value > tanggalSampai.value) { filterError.value = 'Tanggal mulai harus sebelum tanggal akhir.'; return }
        const diff = (new Date(tanggalSampai.value) - new Date(tanggalMulai.value)) / 86400000
        if (diff > 92) { filterError.value = 'Rentang maksimal 92 hari.'; return }
        loading.value = true
        router.get(route('guru.absensi.rekap'), {
            ...base, mode: 'rentang',
            mulai: tanggalMulai.value,
            sampai: tanggalSampai.value,
        }, { preserveScroll: false, onFinish: () => { loading.value = false } })
    }
}

// ─── Catatan panel ────────────────────────────────────────────
const showCatatan = ref(false)
const allCatatan = computed(() =>
    props.siswa.flatMap(s =>
        (s.catatan ?? []).map(c => ({ ...c, nama: s.nama_lengkap, nis: s.nis }))
    ).sort((a, b) => a.tanggal.localeCompare(b.tanggal))
)

// ─── Tooltip ──────────────────────────────────────────────────
const tooltip = ref({ visible: false, text: '', x: 0, y: 0 })
function showTooltip(evt, text) {
    if (!text) return
    tooltip.value = { visible: true, text, x: evt.clientX + 14, y: evt.clientY + 14 }
}
function hideTooltip() { tooltip.value.visible = false }

// ─── Tabel helpers ────────────────────────────────────────────
const search = ref('')

const siswaFiltered = computed(() => {
    if (!search.value.trim()) return props.siswa
    const q = search.value.toLowerCase()
    return props.siswa.filter(s =>
        s.nama_lengkap.toLowerCase().includes(q) || String(s.nis).includes(q)
    )
})

const hasData = computed(() => props.hariEfektif.length > 0)

function formatTanggal(tgl) {
    return new Date(tgl).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}
function getDayShort(tgl) {
    return new Date(tgl).toLocaleDateString('id-ID', { weekday: 'short' })
}
function isWeekend(tgl) {
    const d = new Date(tgl).getDay()
    return d === 0 || d === 6
}
function getDetail(siswa, tgl) {
    return siswa.detail?.find(d => d.tanggal === tgl) ?? null
}
function pctStyle(pct) {
    if (pct === null || pct === undefined) return 'none'
    if (pct >= 80) return 'high'
    if (pct >= 60) return 'mid'
    return 'low'
}
function pctClass(pct) {
    const s = pctStyle(pct)
    if (s === 'high') return 'text-emerald-700 dark:text-emerald-300'
    if (s === 'mid') return 'text-orange-700 dark:text-orange-300'
    if (s === 'low') return 'text-rose-700 dark:text-rose-300'
    return 'text-slate-400 dark:text-slate-500'
}

const avgKehadiran = computed(() => {
    const valid = props.siswa.filter(s => s.pct_kehadiran !== null && s.pct_kehadiran !== undefined)
    if (!valid.length) return null
    return Math.round(valid.reduce((a, s) => a + s.pct_kehadiran, 0) / valid.length * 10) / 10
})

// ─── Summary cards ────────────────────────────────────────────
const summaryCards = computed(() => {
    if (!props.rekapKelas) return []
    return [
        { label: 'Hari Efektif', value: props.rekapKelas.hari_efektif, icon: '📅', color: 'bg-slate-50 dark:bg-slate-800/60', ring: 'ring-1 ring-slate-200 dark:ring-slate-700', val: 'text-slate-800 dark:text-white' },
        { label: 'Hadir', value: props.rekapKelas.total_hadir, icon: '✅', color: 'bg-emerald-50 dark:bg-emerald-900/20', ring: 'ring-1 ring-emerald-200 dark:ring-emerald-800', val: 'text-emerald-700 dark:text-emerald-300' },
        { label: 'Sakit', value: props.rekapKelas.total_sakit, icon: '🩺', color: 'bg-amber-50 dark:bg-amber-900/20', ring: 'ring-1 ring-amber-200 dark:ring-amber-800', val: 'text-amber-700 dark:text-amber-300' },
        { label: 'Izin', value: props.rekapKelas.total_izin, icon: '📋', color: 'bg-sky-50 dark:bg-sky-900/20', ring: 'ring-1 ring-sky-200 dark:ring-sky-800', val: 'text-sky-700 dark:text-sky-300' },
        { label: 'Alpha', value: props.rekapKelas.total_alpha, icon: '🚫', color: 'bg-rose-50 dark:bg-rose-900/20', ring: 'ring-1 ring-rose-200 dark:ring-rose-800', val: 'text-rose-700 dark:text-rose-300' },
        {
            label: 'Rata-rata',
            value: avgKehadiran.value !== null ? avgKehadiran.value + '%' : '—',
            icon: '📊',
            color: pctStyle(avgKehadiran.value) === 'high' ? 'bg-emerald-50 dark:bg-emerald-900/20'
                : pctStyle(avgKehadiran.value) === 'mid' ? 'bg-orange-50 dark:bg-orange-900/20'
                    : pctStyle(avgKehadiran.value) === 'low' ? 'bg-rose-50 dark:bg-rose-900/20'
                        : 'bg-slate-50 dark:bg-slate-800/60',
            ring: 'ring-1 ring-slate-200 dark:ring-slate-700',
            val: pctClass(avgKehadiran.value),
        },
    ]
})
</script>

<template>

    <Head title="Rekap Absensi" />
    <MenuLayout>

        <!-- Global Tooltip -->
        <Teleport to="body">
            <div v-if="tooltip.visible"
                class="fixed z-[9999] pointer-events-none max-w-[240px] px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-950 text-white text-xs leading-snug shadow-xl"
                :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
                {{ tooltip.text }}
            </div>
        </Teleport>

        <div class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

            <!-- ══ TOPBAR ══════════════════════════════════════════ -->
            <header>
                <div class="mx-auto py-4 px-2 flex items-center justify-between gap-4">

                    <!-- Brand -->
                    <div class="flex items-center gap-3">
                        <div
                            class="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg flex-shrink-0">
                            📋
                        </div>
                        <div>
                            <div class="text-sm font-bold dark:text-gray-200 text-gray-700 leading-tight">Rekap Absensi
                            </div>
                            <div class="text-xs text-slate-400 mt-0.5">{{ guru.nama_lengkap }}</div>
                        </div>
                    </div>

                    <!-- Actions (only when data is loaded) -->
                    <div v-if="hasData" class="flex items-center gap-2">

                        <ExportExcel :kelas="kelas" :label="label" :hari-efektif="hariEfektif" :siswa="siswa"
                            :rekap-kelas="rekapKelas" :avg-kehadiran="avgKehadiran" :all-catatan="allCatatan" />

                        <ExportPdf :kelas="kelas" :label="label" :hari-efektif="hariEfektif" :siswa="siswa"
                            :rekap-kelas="rekapKelas" :avg-kehadiran="avgKehadiran" :all-catatan="allCatatan" />

                    </div>
                </div>
            </header>

            <main class="mx-auto space-y-5">

                <!-- ══ STEP 1: PILIH KELAS ═════════════════════════ -->
                <template v-if="!kelas">

                    <div class="text-center py-4">
                        <span
                            class="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-widest mb-3">
                            Langkah 1
                        </span>
                        <h2 class="text-2xl font-extrabold text-slate-800 dark:text-white">Pilih kelasnya dulu yuk!</h2>
                        <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Sekarang, semua guru dapat merekap
                            data absensi siswa dari kelas manapun dengan mudah.</p>
                    </div>

                    <div class="max-w-md mx-auto">
                        <div
                            class="flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 transition-colors">
                            <span class="text-slate-400 text-sm">🔍</span>
                            <input v-model="kelasSearch" type="search" placeholder="Cari kelas atau wali kelas…"
                                class="flex-1 bg-transparent outline-none text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-white" />
                        </div>
                    </div>

                    <div v-if="kelasFiltered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <button v-for="k in kelasFiltered" :key="k.id" @click="selectKelas(k.id)"
                            class="group flex items-center gap-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200">
                            <div
                                class="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
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
                                class="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all text-sm">›</span>
                        </button>
                    </div>

                    <div v-else class="text-center py-16 text-slate-400 dark:text-slate-500">
                        <div class="text-4xl mb-3">😶</div>
                        <p class="text-sm">Tidak ada kelas yang cocok dengan pencarian</p>
                    </div>

                </template>

                <!-- ══ STEP 2: KELAS DIPILIH ═══════════════════════ -->
                <template v-else>

                    <!-- Breadcrumb kelas -->
                    <div
                        class="flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg flex-shrink-0">
                                🏫</div>
                            <div>
                                <div class="font-bold text-slate-800 dark:text-white text-sm">{{ kelas.kelas }}</div>
                                <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Wali Kelas: {{
                                    kelas.guru_nama }}</div>
                            </div>
                        </div>
                        <button @click="changeKelas"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                            🔄 Ganti Kelas
                        </button>
                    </div>

                    <!-- Filter card -->
                    <div
                        class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
                        <p
                            class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            🔽 Filter Periode
                        </p>

                        <div class="flex gap-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl p-1 w-fit">
                            <button
                                :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all', filterMode === 'bulan' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white']"
                                @click="filterMode = 'bulan'; filterError = ''">
                                📆 Per Bulan
                            </button>
                            <button
                                :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all', filterMode === 'rentang' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white']"
                                @click="filterMode = 'rentang'; filterError = ''">
                                📅 Rentang Tanggal
                            </button>
                        </div>

                        <div class="flex flex-wrap items-end gap-3">
                            <template v-if="filterMode === 'bulan'">
                                <div class="flex flex-col gap-1">
                                    <label
                                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Bulan</label>
                                    <select v-model="selectedBulan"
                                        class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 min-w-[150px] transition">
                                        <option v-for="(nama, idx) in BULAN_NAMES" :key="idx" :value="idx + 1">{{ nama
                                            }}</option>
                                    </select>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label
                                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tahun</label>
                                    <select v-model="selectedTahun"
                                        class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 min-w-[110px] transition">
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
                                        <input type="date" v-model="tanggalMulai" :max="tanggalSampai || undefined"
                                            class="date-input w-full pr-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-gray-700 dark:text-gray-200" />
                                        <CalendarDaysIcon
                                            class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label
                                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sampai
                                        Tanggal</label>
                                    <div class="relative">
                                        <input type="date" v-model="tanggalSampai" :min="tanggalMulai || undefined"
                                            :max="new Date().toISOString().slice(0, 10)"
                                            class="date-input w-full pr-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-gray-700 dark:text-gray-200" />
                                        <CalendarDaysIcon
                                            class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                    </div>
                                </div>
                            </template>

                            <p v-if="filterError" class="text-xs text-rose-500 flex items-center gap-1 pb-1.5">⚠️ {{
                                filterError }}</p>

                            <button @click="applyFilter" :disabled="loading"
                                class="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
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
                            Pilih periode (bulan atau rentang tanggal), lalu klik <strong>Tampilkan</strong>.
                        </p>
                    </div>

                    <!-- Data tersedia -->
                    <template v-if="hasData">

                        <!-- Period bar -->
                        <div class="flex items-center flex-wrap gap-3">
                            <span
                                class="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-950 text-sky-300 px-4 py-1.5 rounded-full text-xs font-bold">
                                📅 {{ label }}
                            </span>
                            <span class="text-xs text-slate-500 dark:text-slate-400">
                                {{ rekapKelas.hari_efektif }} hari efektif · {{ rekapKelas.total_siswa }} siswa
                            </span>
                            <div class="flex-1" />
                            <button v-if="allCatatan.length" @click="showCatatan = !showCatatan"
                                class="sm:inline-flex hidden items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                                📝 Catatan ({{ allCatatan.length }}) <span>{{ showCatatan ? '▲' : '▼' }}</span>
                            </button>
                        </div>

                        <!-- Summary cards -->
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            <div v-for="card in summaryCards" :key="card.label"
                                :class="['rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-default', card.color, card.ring]">
                                <div class="text-lg mb-1.5">{{ card.icon }}</div>
                                <div :class="['text-2xl font-extrabold leading-none font-mono', card.val]">{{ card.value
                                    }}</div>
                                <div
                                    class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                    {{ card.label }}</div>
                            </div>
                        </div>

                        <!-- Catatan toggle (mobile) -->
                        <div class="w-full sm:hidden flex justify-end">
                            <button v-if="allCatatan.length" @click="showCatatan = !showCatatan"
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all">
                                📝 Catatan ({{ allCatatan.length }}) <span>{{ showCatatan ? '▲' : '▼' }}</span>
                            </button>
                        </div>

                        <!-- Panel catatan -->
                        <div v-if="showCatatan && allCatatan.length"
                            class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                            <div
                                class="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 flex items-center gap-1.5">
                                📝 Daftar Keterangan Absensi
                            </div>
                            <div class="divide-y divide-slate-100 dark:divide-slate-700/50">
                                <div v-for="(c, i) in allCatatan" :key="i"
                                    class="flex items-start gap-3 px-5 py-3 flex-wrap">
                                    <span
                                        :class="['inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] font-extrabold flex-shrink-0', STATUS[c.status]?.bg, STATUS[c.status]?.text]">
                                        {{ STATUS[c.status]?.short }}
                                    </span>
                                    <div class="flex flex-col mt-0.5 min-w-0">
                                        <span class="text-sm font-semibold text-slate-800 dark:text-white">{{ c.nama
                                            }}</span>
                                    </div>
                                    <span
                                        class="text-xs dark:text-slate-400 text-slate-700 font-mono self-center whitespace-nowrap">Tanggal
                                        {{ formatTanggal(c.tanggal) }}</span>
                                    <span
                                        class="text-sm sm:pl-0 pl-10 text-slate-600 dark:text-slate-300 flex-1 min-w-[180px] self-center">{{
                                            c.keterangan }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Toolbar tabel -->
                        <div class="flex items-center justify-between gap-3 flex-wrap">
                            <div
                                class="group relative flex items-center min-w-[240px] max-w-sm w-full overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/70 backdrop-blur px-4 py-2.5 shadow-sm">
                                <div
                                    class="absolute inset-0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-500/5 via-sky-500/5 to-transparent">
                                </div>
                                <div
                                    class="relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                                    🔍</div>
                                <input v-model="search" type="search" placeholder="Cari nama siswa atau NIS..."
                                    class="relative flex-1 bg-transparent px-3 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-0 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus:ring-transparent focus:shadow-none" />
                                <button v-if="search" @click="search = ''"
                                    class="relative flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200">✕</button>
                            </div>

                            <div class="hidden sm:flex items-center gap-2 flex-wrap">
                                <span v-for="(cfg, key) in STATUS" :key="key"
                                    :class="['inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold', cfg.bg, cfg.text, cfg.ring.replace('ring-1', 'border')]">
                                    {{ cfg.short }} = {{ cfg.label }}
                                </span>
                                <span
                                    class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800">
                                    💬 Ada catatan
                                </span>
                            </div>
                        </div>

                        <!-- Tabel -->
                        <div class="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/70"
                            tabindex="0">
                            <table class="border-collapse w-max min-w-full text-[13px]">
                                <thead>
                                    <tr>
                                        <th
                                            class="md:sticky md:left-0 md:z-20 px-3 py-3 bg-slate-900 dark:bg-slate-950 text-white/70 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 min-w-[40px]">
                                            #</th>
                                        <th
                                            class="md:sticky md:left-10 md:z-20 px-3 py-3 bg-slate-900 dark:bg-slate-950 text-white/70 text-[11px] font-bold text-left whitespace-nowrap border-r border-white/5 min-w-[160px] w-52">
                                            Nama Siswa</th>
                                        <th
                                            class="md:sticky md:left-[248px] md:z-20 px-3 py-3 bg-slate-900 dark:bg-slate-950 text-white/70 text-[11px] font-bold text-center whitespace-nowrap border-r-2 border-white/10 w-20 min-w-[80px] font-mono">
                                            NIS</th>
                                        <th
                                            class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-emerald-950 text-emerald-400">
                                            H</th>
                                        <th
                                            class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-orange-950 text-orange-400">
                                            S</th>
                                        <th
                                            class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-sky-950 text-sky-400">
                                            I</th>
                                        <th
                                            class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-rose-950 text-rose-400">
                                            A</th>
                                        <th
                                            class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-16 bg-slate-900 dark:bg-slate-950 text-white/70">
                                            %</th>
                                        <th v-for="tgl in hariEfektif" :key="'hd-' + tgl"
                                            :class="['px-1 py-2 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-[72px] min-w-[64px]', isWeekend(tgl) ? 'bg-indigo-950 text-indigo-300/80' : 'bg-slate-900 dark:bg-slate-950 text-white/60']">
                                            <div class="flex flex-col items-center gap-0.5">
                                                <span class="text-[9px] opacity-60">{{ getDayShort(tgl) }}</span>
                                                <span class="text-[10px] font-bold">{{ formatTanggal(tgl) }}</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="!siswaFiltered.length">
                                        <td :colspan="8 + hariEfektif.length"
                                            class="px-4 py-14 text-center text-slate-400 dark:text-slate-500">
                                            <div class="text-3xl mb-2">😶</div>
                                            <p class="text-sm">Tidak ada siswa yang cocok</p>
                                        </td>
                                    </tr>
                                    <tr v-for="(s, idx) in siswaFiltered" :key="s.siswa_id"
                                        class="group border-b border-slate-100 dark:border-slate-700/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors">
                                        <td
                                            class="md:sticky md:left-0 md:z-10 px-3 py-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 font-mono bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/50">
                                            {{ idx + 1 }}</td>
                                        <td
                                            class="md:sticky md:left-10 md:z-10 px-3 py-2.5 text-left font-medium text-slate-800 dark:text-white bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/50 whitespace-nowrap">
                                            {{ s.nama_lengkap }}</td>
                                        <td
                                            class="md:sticky md:left-[248px] md:z-10 px-3 py-2.5 text-center text-[12px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 border-r-2 border-slate-200 dark:border-slate-600 whitespace-nowrap">
                                            {{ s.nis }}</td>
                                        <td
                                            class="px-2 py-2.5 text-center font-bold font-mono text-[13px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-900/10 border-r border-slate-100 dark:border-slate-700/50">
                                            {{ s.counts.hadir }}</td>
                                        <td
                                            class="px-2 py-2.5 text-center font-bold font-mono text-[13px] text-orange-700 dark:text-orange-300 bg-orange-50/60 dark:bg-orange-900/10 border-r border-slate-100 dark:border-slate-700/50">
                                            {{ s.counts.sakit }}</td>
                                        <td
                                            class="px-2 py-2.5 text-center font-bold font-mono text-[13px] text-sky-700 dark:text-sky-300 bg-sky-50/60 dark:bg-sky-900/10 border-r border-slate-100 dark:border-slate-700/50">
                                            {{ s.counts.izin }}</td>
                                        <td
                                            class="px-2 py-2.5 text-center font-bold font-mono text-[13px] text-rose-700 dark:text-rose-300 bg-rose-50/60 dark:bg-rose-900/10 border-r border-slate-100 dark:border-slate-700/50">
                                            {{ s.counts.alpha }}</td>
                                        <td
                                            class="px-2 py-2.5 text-center border-r border-slate-100 dark:border-slate-700/50">
                                            <span
                                                :class="['inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-bold font-mono', pctClass(s.pct_kehadiran)]">
                                                {{ s.pct_kehadiran !== null && s.pct_kehadiran !== undefined ?
                                                    s.pct_kehadiran + '%' : '—' }}
                                            </span>
                                        </td>
                                        <td v-for="tgl in hariEfektif" :key="'c-' + tgl"
                                            :class="['px-1 py-1.5 text-center border-r border-slate-100 dark:border-slate-700/50', isWeekend(tgl) ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : '']">
                                            <template v-if="getDetail(s, tgl)">
                                                <div class="flex flex-col items-center gap-0.5 cursor-default"
                                                    :class="{ 'cursor-help': !!getDetail(s, tgl).keterangan }"
                                                    @mouseenter="e => showTooltip(e, getDetail(s, tgl).keterangan)"
                                                    @mouseleave="hideTooltip">
                                                    <span
                                                        :class="['inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-extrabold hover:scale-110 transition-transform', STATUS[getDetail(s, tgl).status]?.bg, STATUS[getDetail(s, tgl).status]?.text]">
                                                        {{ STATUS[getDetail(s, tgl).status]?.short }}
                                                    </span>
                                                    <span v-if="getDetail(s, tgl).keterangan"
                                                        class="text-[9px] text-indigo-400 dark:text-indigo-500">💬</span>
                                                </div>
                                            </template>
                                            <span v-else
                                                class="inline-flex items-center justify-center w-7 h-7 text-xs text-slate-300 dark:text-slate-600">—</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p
                            class="text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1 sm:hidden">
                            ↔ Geser untuk melihat semua hari
                        </p>

                    </template>

                    <!-- Belum ada data setelah tampilkan -->
                    <div v-else-if="dataLoaded"
                        class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-16 text-center">
                        <div class="text-5xl mb-4">📭</div>
                        <p class="font-semibold text-slate-700 dark:text-slate-200">Belum ada data absensi</p>
                        <p class="mt-1.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                            Pilih periode lain atau pastikan absensi sudah diinput terlebih dahulu.
                        </p>
                    </div>

                </template>
            </main>
        </div>

    </MenuLayout>
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