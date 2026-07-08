<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import {
    ClipboardDocumentCheckIcon, ArrowPathIcon, BookOpenIcon,
    AcademicCapIcon, ArrowDownTrayIcon, DocumentTextIcon,
    InboxIcon, CheckCircleIcon, ClockIcon,
    ChevronLeftIcon, ChevronRightIcon,
    ArrowUpIcon, ArrowDownIcon, XMarkIcon, TrashIcon
} from '@heroicons/vue/24/outline';
import { PlayIcon } from '@heroicons/vue/24/solid';
import { ref, computed, onMounted, watch } from 'vue';
import { ToastAlert } from '@/Composables/ToastAlert.js';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

// ── Composables ────────────────────────────────────────────────────────────────
const { success, error } = ToastAlert();

// ── State ──────────────────────────────────────────────────────────────────────
const loading = ref(false);
const loaded = ref(false);
const rekap = ref([]);

const filter = ref({ soal_title: '', mapel_id: '', kelas_id: '' });
const sort = ref({ by: 'nilai', direction: 'desc' });

const listSoal = ref([]);
const listMapel = ref([]);
const listKelas = ref([]);

// ── Config ─────────────────────────────────────────────────────────────────────
const perPage = 50;
const MAX_VISIBLE_PAGES = 7;
const currentPage = ref(1);

const sortOptions = [
    { label: 'Nilai', value: 'nilai' },
    { label: 'Nama', value: 'nama' },
];

// ── Computed ───────────────────────────────────────────────────────────────────
const hasFilter = computed(() =>
    !!filter.value.soal_title || !!filter.value.mapel_id || !!filter.value.kelas_id
);

/** Soal unik by title untuk dropdown */
const uniqueSoal = computed(() => {
    const seen = new Set();
    return listSoal.value.filter(s => {
        if (seen.has(s.title)) return false;
        seen.add(s.title);
        return true;
    });
});

/** Data sudah di-flatten dari backend — filter status Selesai saja */
const filteredRekap = computed(() =>
    rekap.value.filter(r => r.status === 'Selesai')
);

/** Sorted */
const sortedRekap = computed(() => {
    const data = [...filteredRekap.value];
    const dir = sort.value.direction === 'asc' ? 1 : -1;

    if (sort.value.by === 'nilai') {
        data.sort((a, b) => dir * ((a.total_nilai ?? 0) - (b.total_nilai ?? 0)));
    } else {
        data.sort((a, b) =>
            dir * (a.nama_lengkap ?? '').localeCompare(b.nama_lengkap ?? '', 'id')
        );
    }
    return data;
});

/** Paginated */
const paginatedRekap = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return sortedRekap.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(sortedRekap.value.length / perPage));

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    if (total <= MAX_VISIBLE_PAGES) return Array.from({ length: total }, (_, i) => i + 1);

    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + MAX_VISIBLE_PAGES - 1);
    if (end - start < MAX_VISIBLE_PAGES - 1) start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(async () => {
    try {
        const [soalRes, mapelRes, kelasRes] = await Promise.all([
            fetch('/api/list-soal'),
            fetch('/api/list-mapel'),
            fetch('/api/list-kelas'),
        ]);
        [listSoal.value, listMapel.value, listKelas.value] = await Promise.all([
            soalRes.json(), mapelRes.json(), kelasRes.json(),
        ]);
    } catch {
        error('Gagal memuat data dropdown filter.');
    }
});

// ── Watchers ───────────────────────────────────────────────────────────────────
watch(filter, () => { currentPage.value = 1; }, { deep: true });
watch(sortedRekap, () => { currentPage.value = 1; });

// ── Methods ────────────────────────────────────────────────────────────────────
const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

const generate = async () => {
    if (!hasFilter.value) {
        error('Pilih minimal satu filter sebelum generate rekap.');
        return;
    }

    loading.value = true;
    rekap.value = [];
    loaded.value = false;

    try {
        const res = await fetch('/api/rekap-filtered', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(filter.value),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        rekap.value = await res.json();
        loaded.value = true;
        success(`Rekap berhasil dimuat — ${filteredRekap.value.length} data ditemukan.`);
    } catch (err) {
        console.error('Gagal generate rekap:', err);
        error('Terjadi kesalahan saat mengambil data. Coba lagi.');
    } finally {
        loading.value = false;
    }
};

const resetFilter = () => {
    filter.value = { soal_title: '', mapel_id: '', kelas_id: '' };
    rekap.value = [];
    loaded.value = false;
};

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

// ── Export Excel ───────────────────────────────────────────────────────────────
const exportExcel = async () => {
    if (!sortedRekap.value.length) return;

    const mapelLabel = filter.value.mapel_id
        ? (listMapel.value.find(m => m.id === filter.value.mapel_id)?.mapel ?? 'Semua')
        : 'Semua';
    const kelasLabel = filter.value.kelas_id
        ? (listKelas.value.find(k => k.id === filter.value.kelas_id)?.kelas ?? 'Semua')
        : 'Semua';

    const wb = new ExcelJS.Workbook();
    const sheet = wb.addWorksheet('Rekap Nilai');

    sheet.columns = [
        { header: 'No', key: 'no', width: 6 },
        { header: 'Nama Siswa', key: 'nama', width: 32 },
        { header: 'Kelas', key: 'kelas', width: 16 },
        { header: 'Mata Pelajaran', key: 'mapel', width: 26 },
        { header: 'Jumlah Soal', key: 'total', width: 16 },
        { header: 'Soal Dijawab', key: 'dijawab', width: 16 },
        { header: 'Tidak Dijawab', key: 'skip', width: 16 },
        { header: 'Jawaban Benar', key: 'benar', width: 16 },
        { header: 'Jawban Salah', key: 'salah', width: 16 },
        { header: 'Total Nilai', key: 'nilai', width: 16 },
    ];

    sortedRekap.value.forEach((item, idx) => {
        sheet.addRow({
            no: idx + 1,
            nama: item.nama_lengkap,
            kelas: item.nama_kelas,
            mapel: item.nama_mapel,
            total: item.total_soal,
            dijawab: item.dijawab,
            skip: item.tidak_dijawab,
            benar: item.total_benar,
            salah: item.salah,
            nilai: item.total_nilai,
        });
    });

    // Style header
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 22;

    // Style data rows
    sheet.eachRow({ includeEmpty: false }, (row, rn) => {
        if (rn === 1) return;
        const isEven = rn % 2 === 0;
        row.eachCell((cell, colNumber) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isEven ? 'FFF0F4FF' : 'FFFFFFFF' } };
            cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
            cell.alignment = {
                vertical: 'middle',
                horizontal: colNumber === 2 ? 'left' : 'center', // kolom 2 = Nama Siswa
            };
        });
    });

    const buf = await wb.xlsx.writeBuffer();
    saveAs(
        new Blob([buf], { type: 'application/octet-stream' }),
        `Rekap_Nilai_${mapelLabel}_${kelasLabel}.xlsx`
    );
};

const destroyRekap = async () => {
    // Hitung jumlah data yang akan dihapus
    const jumlah = sortedRekap.value.length;

    const { value: konfirmasi } = await Swal.fire({
        title: 'Hapus Semua Data Rekap?',
        html: `
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Tindakan ini akan menghapus <strong>${jumlah} data riwayat ujian</strong>
                sesuai filter aktif dan <strong class="text-red-600">tidak dapat dibatalkan</strong>.
            </p>
            <p class="text-sm text-gray-500 mb-1">Ketik <b>DELETE</b> untuk konfirmasi:</p>
        `,
        input: 'text',
        inputPlaceholder: 'Ketik DELETE',
        inputAttributes: { autocomplete: 'off' },
        showCancelButton: true,
        confirmButtonText: 'Hapus Sekarang',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
        preConfirm: (val) => {
            if (val !== 'DELETE') {
                Swal.showValidationMessage('Ketik DELETE (huruf kapital) untuk melanjutkan');
                return false;
            }
            return true;
        },
    });

    if (!konfirmasi) return;

    try {
        const res = await fetch('/proktor/rekap-nilai/destroy', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(filter.value),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);

        // Reset state lokal
        rekap.value = [];
        loaded.value = false;

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil Dihapus',
            text: data.message,
            confirmButtonColor: '#2563eb',
        });

    } catch (err) {
        console.error('Gagal hapus rekap:', err);
        await Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: err.message || 'Terjadi kesalahan. Coba lagi.',
            confirmButtonColor: '#2563eb',
        });
    }
};
</script>

<template>
    <MenuLayout>
        <div class="nilai-page">

            <!-- ══ HEADER ══════════════════════════════════════════════ -->
            <header class="page-header">
                <div class="header-left">
                    <div class="header-icon">
                        <ClipboardDocumentCheckIcon class="icon" />
                    </div>
                    <div>
                        <h1 class="page-title">Rekap Penilaian</h1>
                        <p class="page-subtitle">Assessment & Evaluasi Hasil Ujian Siswa</p>
                    </div>
                </div>

                <div v-if="loaded && sortedRekap.length > 0" class="header-stat">
                    <span class="stat-num">{{ sortedRekap.length }}</span>
                    <span class="stat-label">Siswa</span>
                </div>
            </header>

            <!-- ══ FILTER PANEL ══════════════════════════════════════════ -->
            <section class="filter-panel">
                <div class="filter-grid">
                    <div class="filter-field">
                        <label class="field-label">
                            <DocumentTextIcon class="label-icon" /> Judul Soal
                        </label>
                        <select v-model="filter.soal_title" class="field-select">
                            <option value="">Semua Soal</option>
                            <option v-for="s in uniqueSoal" :key="s.id" :value="s.title">
                                {{ s.title }}
                            </option>
                        </select>
                    </div>

                    <div class="filter-field">
                        <label class="field-label">
                            <BookOpenIcon class="label-icon" /> Mata Pelajaran
                        </label>
                        <select v-model="filter.mapel_id" class="field-select">
                            <option value="">Semua Mapel</option>
                            <option v-for="m in listMapel" :key="m.id" :value="m.id">{{ m.mapel }}</option>
                        </select>
                    </div>

                    <div class="filter-field">
                        <label class="field-label">
                            <AcademicCapIcon class="label-icon" /> Kelas
                        </label>
                        <select v-model="filter.kelas_id" class="field-select">
                            <option value="">Semua Kelas</option>
                            <option v-for="k in listKelas" :key="k.id" :value="k.id">{{ k.kelas }}</option>
                        </select>
                    </div>
                </div>

                <div class="filter-actions">
                    <button @click="resetFilter" class="btn-reset" :disabled="!hasFilter">
                        <XMarkIcon class="w-4 h-4" /> Reset
                    </button>
                    <button @click="generate" class="btn-generate" :disabled="loading">
                        <template v-if="loading">
                            <ArrowPathIcon class="w-4 h-4 animate-spin" /> Memuat...
                        </template>
                        <template v-else>
                            <PlayIcon class="w-4 h-4" /> Generate Rekap
                        </template>
                    </button>
                </div>
            </section>

            <!-- ══ LOADING ═══════════════════════════════════════════════ -->
            <div v-if="loading" class="state-loading">
                <div class="loading-spinner"></div>
                <p>Mengambil data rekap nilai…</p>
            </div>

            <!-- ══ EMPTY STATE ════════════════════════════════════════════ -->
            <div v-else-if="loaded && sortedRekap.length === 0" class="state-empty">
                <div class="empty-icon">
                    <InboxIcon class="w-10 h-10" />
                </div>
                <h3>Tidak Ada Data</h3>
                <p>Tidak ditemukan rekap nilai sesuai filter yang dipilih.</p>
            </div>

            <!-- ══ CONTENT ════════════════════════════════════════════════ -->
            <template v-else-if="sortedRekap.length > 0">

                <!-- Toolbar sort + export -->
                <div class="toolbar">
                    <div class="sort-group">
                        <span class="sort-label">urutkan berdasarkan:</span>
                        <div class="sort-tabs">
                            <button v-for="opt in sortOptions" :key="opt.value" @click="sort.by = opt.value"
                                class="sort-tab" :class="{ active: sort.by === opt.value }">
                                {{ opt.label }}
                            </button>
                        </div>
                        <button @click="sort.direction = sort.direction === 'asc' ? 'desc' : 'asc'" class="sort-dir-btn"
                            :title="sort.direction === 'asc' ? 'Ascending' : 'Descending'">
                            <ArrowUpIcon v-if="sort.direction === 'asc'" class="w-4 h-4" />
                            <ArrowDownIcon v-else class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Tombol aksi kanan -->
                    <div class="flex items-center gap-2">
                        <button @click="destroyRekap" class="btn-destroy">
                            <TrashIcon class="w-4 h-4" />
                            <span class="hidden sm:inline">Hapus Semua</span>
                        </button>

                        <button @click="exportExcel" class="btn-export">
                            <ArrowDownTrayIcon class="w-4 h-4" />
                            <span class="hidden sm:inline">Export Excel</span>
                        </button>
                    </div>
                </div>

                <!-- ── DESKTOP TABLE ──────────────────────────────────── -->
                <div class="table-wrapper hidden md:block">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th class="col-no">No</th>
                                <th class="col-text">Nama Siswa</th>
                                <th class="col-text">Unit Kelas</th>
                                <th class="col-text">Mata Pelajaran</th>
                                <th class="col-num">Jumlah Soal</th>
                                <th class="col-num">Dijawab</th>
                                <!-- <th class="col-num">Tdk Dijawab</th> -->
                                <th class="col-num">Benar</th>
                                <!-- <th class="col-num">Salah</th> -->
                                <th class="col-num">Nilai</th>
                                <th class="col-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in paginatedRekap" :key="`${item.user_id}-${item.soal_id}`"
                                class="data-row">
                                <td class="col-no text-muted">
                                    {{ (currentPage - 1) * perPage + i + 1 }}
                                </td>
                                <td class="col-text cell-name">{{ item.nama_lengkap }}</td>
                                <td class="col-text">
                                    <span class="badge badge-kelas">{{ item.nama_kelas }}</span>
                                </td>
                                <td class="col-text">{{ item.nama_mapel }}</td>
                                <td class="col-num">{{ item.total_soal }}</td>
                                <td class="col-num">{{ item.dijawab }}</td>
                                <!-- <td class="col-num">
                                    <span class="num-warn">{{ item.tidak_dijawab }}</span>
                                </td> -->
                                <td class="col-num">
                                    <span class="num-success">{{ item.total_benar }}</span>
                                </td>
                                <!-- <td class="col-num">
                                    <span class="num-danger">{{ item.salah }}</span>
                                </td> -->
                                <td class="col-num">
                                    <span class="nilai-badge">{{ item.total_nilai }}</span>
                                </td>
                                <td class="col-center">
                                    <span class="status-badge"
                                        :class="item.status === 'Selesai' ? 'status-done' : 'status-pending'">
                                        <CheckCircleIcon v-if="item.status === 'Selesai'" class="w-3.5 h-3.5" />
                                        <ClockIcon v-else class="w-3.5 h-3.5" />
                                        {{ item.status }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- ── MOBILE CARDS ────────────────────────────────────── -->
                <div class="card-list md:hidden">
                    <div v-for="(item, i) in paginatedRekap" :key="`${item.user_id}-${item.soal_id}`"
                        class="nilai-card">

                        <div class="card-header-row">
                            <div class="card-rank">{{ (currentPage - 1) * perPage + i + 1 }}</div>
                            <div class="card-identity">
                                <span class="card-name">{{ item.nama_lengkap }}</span>
                                <div class="card-meta">
                                    <span class="badge badge-kelas">{{ item.nama_kelas }}</span>
                                    <span class="badge badge-mapel">{{ item.nama_mapel }}</span>
                                </div>
                            </div>
                            <span class="status-badge"
                                :class="item.status === 'Selesai' ? 'status-done' : 'status-pending'">
                                {{ item.status }}
                            </span>
                        </div>

                        <div class="card-stats">
                            <div class="stat-item">
                                <span class="stat-value">{{ item.total_soal }}</span>
                                <span class="stat-key">Total Soal</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">{{ item.dijawab }}</span>
                                <span class="stat-key">Dijawab</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value num-success">{{ item.total_benar }}</span>
                                <span class="stat-key">Benar</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value num-danger">{{ item.salah }}</span>
                                <span class="stat-key">Salah</span>
                            </div>
                        </div>

                        <div class="card-nilai-row">
                            <span class="card-nilai-label">Total Nilai</span>
                            <span class="card-nilai-value">{{ item.total_nilai }}</span>
                        </div>
                    </div>
                </div>

                <!-- ── PAGINATION ──────────────────────────────────────── -->
                <div v-if="totalPages > 1" class="pagination">
                    <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
                        <ChevronLeftIcon class="w-4 h-4" />
                    </button>

                    <template v-for="p in visiblePages" :key="p">
                        <button @click="currentPage = p" class="page-btn" :class="{ 'page-active': p === currentPage }">
                            {{ p }}
                        </button>
                    </template>

                    <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
                        <ChevronRightIcon class="w-4 h-4" />
                    </button>

                    <span class="page-info">
                        {{ currentPage }} / {{ totalPages }} halaman
                        &mdash; {{ sortedRekap.length }} data
                    </span>
                </div>

            </template>
        </div>
    </MenuLayout>
</template>

<style scoped>
/* ══ Base ═════════════════════════════════════════════════════════════════ */
.nilai-page {
    @apply min-h-screen space-y-5 pb-20 px-1 sm:px-0;
}

/* ══ Header ══════════════════════════════════════════════════════════════ */
.page-header {
    @apply flex items-center justify-between gap-4;
}

.header-left {
    @apply flex items-center gap-4;
}

.header-icon {
    @apply w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/40 flex-shrink-0;
}

.header-icon .icon {
    @apply w-6 h-6 text-white;
}

.page-title {
    @apply text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight;
}

.page-subtitle {
    @apply text-sm text-gray-500 dark:text-gray-400 mt-0.5;
}

.header-stat {
    @apply flex flex-col items-center bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl px-4 py-2 text-center;
}

.stat-num {
    @apply text-2xl font-bold text-blue-600 dark:text-blue-400 leading-none;
}

.stat-label {
    @apply text-xs text-blue-500 dark:text-blue-400 mt-0.5;
}

/* ══ Filter Panel ════════════════════════════════════════════════════════ */
.filter-panel {
    @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4;
}

.filter-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

.filter-field {
    @apply flex flex-col gap-1.5;
}

.field-label {
    @apply flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400;
}

.label-icon {
    @apply w-3.5 h-3.5;
}

.field-select {
    @apply w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer;
}

.filter-actions {
    @apply flex items-center justify-end gap-3;
}

.btn-reset {
    @apply flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition disabled:opacity-40;
}

.btn-generate {
    @apply flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-300 dark:shadow-blue-900/50 transition disabled:opacity-60 disabled:cursor-not-allowed;
}

/* ══ State ═══════════════════════════════════════════════════════════════ */
.state-loading {
    @apply flex flex-col items-center justify-center py-20 gap-4 text-gray-400;
}

.loading-spinner {
    @apply w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin;
}

.state-empty {
    @apply flex flex-col items-center justify-center py-20 gap-3 text-gray-400;
}

.empty-icon {
    @apply w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400;
}

.state-empty h3 {
    @apply text-lg font-semibold text-gray-600 dark:text-gray-300;
}

.state-empty p {
    @apply text-sm text-center max-w-xs;
}

/* ══ Toolbar ════════════════════════════════════════════════════════════ */
.toolbar {
    @apply flex items-center justify-between flex-wrap gap-3;
}

.sort-group {
    @apply flex items-center gap-2;
}

.sort-label {
    @apply text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider;
}

.sort-tabs {
    @apply flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 gap-0.5;
}

.sort-tab {
    @apply px-3 py-1.5 text-sm rounded-md font-medium transition text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200;
}

.sort-tab.active {
    @apply bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold;
}

.sort-dir-btn {
    @apply p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition;
}

.btn-export {
    @apply flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md shadow-green-300 dark:shadow-green-900/40 transition;
}

/* ══ Table ══════════════════════════════════════════════════════════════ */
.table-wrapper {
    @apply rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800;
}

.data-table {
    @apply min-w-full text-sm;
}

.data-table thead {
    @apply bg-gray-50 dark:bg-gray-700/70;
}

.data-table thead tr {
    @apply border-b border-gray-200 dark:border-gray-700;
}

.data-table th {
    @apply px-4 py-3.5 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400;
}

.col-no {
    @apply text-center w-12;
}

.col-text {
    @apply text-left;
}

.col-num {
    @apply text-center;
}

.col-center {
    @apply text-center;
}

.data-row {
    @apply border-t border-gray-100 dark:border-gray-700/60 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors;
}

.data-row td {
    @apply px-4 py-3.5 text-gray-700 dark:text-gray-300;
}

.text-muted {
    @apply text-gray-400 dark:text-gray-500;
}

.cell-name {
    @apply font-medium text-gray-900 dark:text-white;
}

/* ══ Badges ═════════════════════════════════════════════════════════════ */
.badge {
    @apply inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium;
}

.badge-kelas {
    @apply bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700;
}

.badge-mapel {
    @apply bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700;
}

.num-success {
    @apply text-emerald-600 dark:text-emerald-400 font-bold;
}

.num-danger {
    @apply text-red-500 dark:text-red-400 font-bold;
}

.num-warn {
    @apply text-amber-500 dark:text-amber-400 font-bold;
}

.nilai-badge {
    @apply inline-block px-3 py-0.5 rounded-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700;
}

.status-badge {
    @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold;
}

.status-done {
    @apply bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700;
}

.status-pending {
    @apply bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700;
}

/* ══ Mobile Cards ════════════════════════════════════════════════════════ */
.card-list {
    @apply space-y-3;
}

.nilai-card {
    @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-3 shadow-sm;
}

.card-header-row {
    @apply flex items-start gap-3;
}

.card-rank {
    @apply w-7 h-7 flex-shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold flex items-center justify-center;
}

.card-identity {
    @apply flex-1 min-w-0 space-y-1.5;
}

.card-name {
    @apply font-semibold text-gray-900 dark:text-white text-sm block truncate;
}

.card-meta {
    @apply flex flex-wrap gap-1.5;
}

.card-stats {
    @apply grid grid-cols-4 gap-2 border-t border-gray-100 dark:border-gray-700 pt-3;
}

.stat-item {
    @apply flex flex-col items-center gap-0.5;
}

.stat-value {
    @apply text-base font-bold text-gray-800 dark:text-gray-100;
}

.stat-key {
    @apply text-xs text-gray-400 text-center;
}

.card-nilai-row {
    @apply flex items-center justify-between rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-4 py-2;
}

.card-nilai-label {
    @apply text-sm font-medium text-blue-600 dark:text-blue-400;
}

.card-nilai-value {
    @apply text-xl font-bold text-blue-700 dark:text-blue-300;
}

/* ══ Pagination ══════════════════════════════════════════════════════════ */
.pagination {
    @apply flex items-center justify-center flex-wrap gap-2 py-4;
}

.page-btn {
    @apply px-3 py-2 rounded-lg text-sm font-medium transition bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed;
}

.page-active {
    @apply bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600;
}

.page-info {
    @apply text-xs text-gray-400 dark:text-gray-500 ml-2;
}

.btn-destroy {
    @apply flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md shadow-red-300 dark:shadow-red-900/40 transition;
}
</style>