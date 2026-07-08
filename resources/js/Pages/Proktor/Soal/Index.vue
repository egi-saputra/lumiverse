<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Link, usePage, Head, router } from '@inertiajs/vue3';
import { ref, computed, onMounted, watch } from 'vue';
import { PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import { useAlert } from '@/Composables/useAlert.js';
import axios from 'axios';

const props = defineProps({
    soal: Object,
    filters: Object,
});

const page = usePage();
const { success, error, confirm } = useAlert();

const flash = computed(() => page.props.flash?.success);
const exportingId = ref(null);

// ─── All data cache (fetch once) ─────────────────────────────────────────────
const allSoal = ref([]);
const isLoading = ref(false);

async function fetchAllSoal() {
    isLoading.value = true;
    try {
        const res = await axios.get(route('proktor.soal.index'), {
            params: { per_page: 'all' },
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
        });
        allSoal.value = res.data.data ?? res.data;
    } catch (e) {
        allSoal.value = props.soal?.data ?? [];
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    if (flash.value) success(flash.value);

    allSoal.value = props.soal?.data ?? [];

    const totalFromProps = props.soal?.total ?? 0;
    const dataFromProps = props.soal?.data?.length ?? 0;

    if (totalFromProps > dataFromProps) {
        await fetchAllSoal();
    }
});

watch(flash, (val) => { if (val) success(val); });

// ─── Filters ──────────────────────────────────────────────────────────────────
const search = ref(props.filters?.search ?? '');
const filterStatus = ref('semua');     // 'semua' | 'Aktif' | 'Tidak Aktif'
const filterSoal = ref('semua');       // 'semua' | 'ada' | 'kosong'

// ─── Pagination ───────────────────────────────────────────────────────────────
const currentPage = ref(1);
const perPage = 10;

// Reset ke halaman 1 kalau filter berubah
watch([search, filterStatus, filterSoal], () => { currentPage.value = 1; });

const filteredSoal = computed(() => {
    const q = search.value.trim().toLowerCase();
    return allSoal.value.filter(item => {
        // Filter pencarian
        if (q && !(
            item.kelas?.toLowerCase().includes(q) ||
            item.token?.toLowerCase().includes(q) ||
            item.mapel?.mapel?.toLowerCase().includes(q) ||
            item.title?.toLowerCase().includes(q)
        )) return false;

        // Filter status
        if (filterStatus.value !== 'semua' && item.status !== filterStatus.value) return false;

        // Filter soal kosong/ada isi
        const jumlahSoal = item.bank_soal?.length ?? 0;
        if (filterSoal.value === 'ada' && jumlahSoal === 0) return false;
        if (filterSoal.value === 'kosong' && jumlahSoal > 0) return false;

        return true;
    });
});

const totalPages = computed(() => Math.ceil(filteredSoal.value.length / perPage));

const paginatedSoal = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return filteredSoal.value.slice(start, start + perPage);
});

// Nomor halaman yang ditampilkan (maks 5 tombol)
const pageNumbers = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const hasData = computed(() => allSoal.value.length > 0);
const hasFilteredData = computed(() => filteredSoal.value.length > 0);
const isFiltering = computed(() =>
    search.value.trim() || filterStatus.value !== 'semua' || filterSoal.value !== 'semua'
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function avgNilai(bank_soal) {
    if (!bank_soal?.length) return 0;
    return Math.round(bank_soal.reduce((s, b) => s + b.nilai, 0) / bank_soal.length);
}

function resetFilters() {
    search.value = '';
    filterStatus.value = 'semua';
    filterSoal.value = 'semua';
}

// ─── Delete ───────────────────────────────────────────────────────────────────
function confirmDeleteItem(id, event) {
    event.stopPropagation();
    confirm({ text: 'Yakin hapus quiz ini?' }).then(result => {
        if (result.isConfirmed) {
            axios.delete(`/proktor/soal/${id}`)
                .then(res => {
                    success(res.data.success || 'Quiz berhasil dihapus');
                    allSoal.value = allSoal.value.filter(s => s.id !== id);
                })
                .catch(err => error(err.response?.data?.message || 'Gagal hapus quiz'));
        }
    });
}

// ─── Export ───────────────────────────────────────────────────────────────────
async function exportSoal(item, event) {
    event.stopPropagation();
    if (!item.bank_soal?.length) {
        return Swal.fire({ icon: 'warning', title: 'No questions', text: 'This quiz has no questions to export.', confirmButtonColor: '#3b82f6' });
    }
    exportingId.value = item.id;
    try {
        const response = await axios.get(`/proktor/bank-soal/soal/${item.id}/export`, { responseType: 'blob' });
        const disposition = response.headers['content-disposition'] ?? '';
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        const filename = match ? match[1].replace(/['"]/g, '') : `Soal_${item.id}.xlsx`;
        const url = URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    } catch (e) {
        Swal.fire({ icon: 'error', title: 'Export Failed', text: 'Failed to export questions.', confirmButtonColor: '#ef4444' });
    } finally {
        exportingId.value = null;
    }
}
</script>

<template>

    <Head title="Daftar Quiz" />
    <MenuLayout>
        <div class="mx-auto w-full sm:px-4 pb-16">

            <!-- HEADER -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:mb-8 mb-4 pt-2">
                <div>
                    <h1
                        class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                        Daftar Quiz &amp; Soal
                    </h1>
                </div>
                <Link v-if="hasData" href="/proktor/soal/create"
                    class="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-150 whitespace-nowrap">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Buat Quiz Baru
                </Link>
            </div>

            <!-- SEARCH & FILTER BAR -->
            <div v-if="hasData" class="mb-6 flex flex-col sm:flex-row gap-3">
                <!-- Search -->
                <div class="relative flex-1 max-w-lg">
                    <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input v-model="search" type="text" placeholder="Cari mapel, kelas, token..."
                        class="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 shadow-sm transition" />
                    <button v-if="search" @click="search = ''"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Filter Status -->
                <select v-model="filterStatus"
                    class="py-2.5 px-3 pr-8 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 shadow-sm transition cursor-pointer">
                    <option value="semua">Semua Status</option>
                    <option value="Aktif">Soal Aktif</option>
                    <option value="Tidak Aktif">Soal Nonaktif</option>
                </select>

                <!-- Filter Soal -->
                <select v-model="filterSoal"
                    class="py-2.5 px-3 pr-8 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 shadow-sm transition cursor-pointer">
                    <option value="semua">Semua Soal</option>
                    <option value="ada">Sudah Ada Soal</option>
                    <option value="kosong">Soal Masih Kosong</option>
                </select>

                <!-- Reset Filter -->
                <button v-if="isFiltering" @click="resetFilters"
                    class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition whitespace-nowrap">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reset
                </button>
            </div>

            <!-- Info hasil filter -->
            <div v-if="hasData && isFiltering" class="mb-4 text-xs text-gray-400 dark:text-gray-500">
                Menampilkan <span class="font-semibold text-gray-600 dark:text-gray-300">{{ filteredSoal.length
                    }}</span>
                dari <span class="font-semibold text-gray-600 dark:text-gray-300">{{ allSoal.length }}</span> quiz
            </div>

            <!-- LOADING SKELETON -->
            <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div v-for="n in 4" :key="n"
                    class="h-52 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 animate-pulse">
                    <div class="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-t-2xl"></div>
                    <div class="p-5 space-y-3">
                        <div class="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div class="h-3 w-1/2 bg-slate-100 dark:bg-slate-600 rounded"></div>
                        <div class="grid grid-cols-3 gap-2 pt-2">
                            <div class="h-10 bg-slate-100 dark:bg-slate-600 rounded-xl"></div>
                            <div class="h-10 bg-slate-100 dark:bg-slate-600 rounded-xl"></div>
                            <div class="h-10 bg-slate-100 dark:bg-slate-600 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- EMPTY STATE -->
            <div v-else-if="!hasFilteredData"
                class="flex flex-col items-center justify-center py-24 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 shadow-sm text-center">
                <div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-5">
                    <svg class="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M9 12h6m-3-3v6m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p class="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    {{ isFiltering ? 'Tidak ada hasil ditemukan' : 'Belum ada quiz atau soal' }}
                </p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mb-6">
                    {{ isFiltering ? 'Coba ubah atau reset filter pencarian.' : 'Mulai buat quiz pertama untuk ujian siswa.' }}
                </p>
                <button v-if="isFiltering" @click="resetFilters"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reset Filter
                </button>
                <template v-else>
                    <Link href="/proktor/soal/create"
                        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30 transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Buat Quiz Sekarang
                    </Link>
                </template>
            </div>

            <!-- CARD GRID -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div v-for="item in paginatedSoal" :key="item.id"
                    class="relative flex flex-col bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-lg overflow-hidden transition-shadow duration-200">
                    <div class="h-1 w-full" :class="item.status === 'Aktif'
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                        : 'bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500'">
                    </div>
                    <div class="flex flex-col flex-1 p-5 gap-4">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <p
                                    class="font-bold text-base text-gray-900 dark:text-white leading-snug truncate w-full">
                                    {{ item.mapel?.mapel ?? '—' }}
                                </p>
                                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                                    {{ item.title ?? 'Tanpa judul' }}
                                </p>
                            </div>
                            <span
                                class="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                                :class="item.status === 'Aktif'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400'">
                                <span class="w-1.5 h-1.5 rounded-full"
                                    :class="item.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                                {{ item.status }}
                            </span>
                        </div>
                        <div class="grid grid-cols-3 gap-2">
                            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5 text-center">
                                <p
                                    class="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                                    Kelas</p>
                                <p class="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{{ item.kelas }}
                                </p>
                            </div>
                            <div class="bg-blue-50 dark:bg-blue-500/10 rounded-xl px-3 py-2.5 text-center">
                                <p class="text-[9px] font-bold uppercase tracking-widest text-blue-400 mb-1">Token</p>
                                <p class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest">
                                    {{
                                        item.token }}</p>
                            </div>
                            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5 text-center">
                                <p
                                    class="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                                    Poin
                                </p>
                                <p class="text-xs font-bold text-gray-700 dark:text-gray-200">{{
                                    avgNilai(item.bank_soal) }}</p>
                            </div>
                        </div>
                        <div
                            class="flex sm:flex-row flex-col gap-2 items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                            <div class="flex items-center gap-3">
                                <span class="flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                                    </svg>
                                    {{ item.waktu }} Menit
                                </span>
                                <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span>{{ item.tipe_soal }}</span>
                                <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <!-- Badge jumlah soal dengan warna berbeda kalau kosong -->
                                <span :class="(item.bank_soal?.length ?? 0) === 0
                                    ? 'text-amber-500 dark:text-amber-400 font-semibold'
                                    : ''">
                                    {{ item.bank_soal?.length ?? 0 }} Soal
                                    <span v-if="(item.bank_soal?.length ?? 0) === 0" class="text-[10px]">(kosong)</span>
                                </span>
                            </div>
                            <Link :href="`/proktor/soal/${item.id}`"
                                class="group inline-flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                                Preview Quiz
                                <svg class="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <div class="border-t border-gray-100 dark:border-white/5"></div>
                        <div class="flex items-center gap-2" @click.stop>
                            <Link :href="`/proktor/soal/${item.id}/edit`" @click.stop
                                class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-600 dark:bg-slate-700 dark:hover:bg-blue-600 text-slate-600 hover:text-white dark:text-slate-300 dark:hover:text-white transition-all duration-150">
                                <PencilIcon class="w-3.5 h-3.5" />
                                Settings
                            </Link>
                            <button @click="exportSoal(item, $event)"
                                :disabled="exportingId === item.id || !item.bank_soal?.length"
                                class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-600 dark:bg-slate-700 dark:hover:bg-emerald-600 text-slate-600 hover:text-white dark:text-slate-300 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-700 disabled:hover:text-slate-600 dark:disabled:hover:text-slate-300 transition-all duration-150">
                                <svg v-if="exportingId === item.id" class="w-3.5 h-3.5 animate-spin" fill="none"
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                <ArrowDownTrayIcon v-else class="w-3.5 h-3.5" />
                                {{ exportingId === item.id ? 'Downloading...' : 'Download' }}
                            </button>
                            <button @click="confirmDeleteItem(item.id, $event)"
                                class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-600 dark:bg-slate-700 dark:hover:bg-red-600 text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white transition-all duration-150">
                                <TrashIcon class="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PAGINATION -->
            <div v-if="!isLoading && hasFilteredData && totalPages > 1"
                class="flex justify-between items-center mt-8 gap-2">

                <!-- Tombol Sebelumnya -->
                <button @click="currentPage--" :disabled="currentPage === 1"
                    class="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm">
                    ← Sebelumnya
                </button>

                <!-- Nomor Halaman -->
                <div class="flex items-center gap-1">
                    <!-- Halaman pertama + ellipsis kalau perlu -->
                    <template v-if="pageNumbers[0] > 1">
                        <button @click="currentPage = 1"
                            class="w-9 h-9 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                            1
                        </button>
                        <span v-if="pageNumbers[0] > 2" class="px-1 text-gray-400">…</span>
                    </template>

                    <button v-for="n in pageNumbers" :key="n" @click="currentPage = n"
                        class="w-9 h-9 rounded-lg text-sm font-medium border transition"
                        :class="n === currentPage
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25'
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'">
                        {{ n }}
                    </button>

                    <!-- Ellipsis + halaman terakhir -->
                    <template v-if="pageNumbers[pageNumbers.length - 1] < totalPages">
                        <span v-if="pageNumbers[pageNumbers.length - 1] < totalPages - 1"
                            class="px-1 text-gray-400">…</span>
                        <button @click="currentPage = totalPages"
                            class="w-9 h-9 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                            {{ totalPages }}
                        </button>
                    </template>
                </div>

                <!-- Tombol Berikutnya -->
                <button @click="currentPage++" :disabled="currentPage === totalPages"
                    class="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm">
                    Berikutnya →
                </button>
            </div>

            <!-- Info halaman -->
            <div v-if="!isLoading && hasFilteredData && totalPages > 1"
                class="text-center mt-3 text-xs text-gray-400 dark:text-gray-500">
                Halaman {{ currentPage }} dari {{ totalPages }}
                ({{ filteredSoal.length }} item)
            </div>

        </div>
    </MenuLayout>
</template>