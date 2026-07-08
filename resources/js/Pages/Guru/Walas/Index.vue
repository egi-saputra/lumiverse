<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import { ref, watch, computed, onUnmounted, nextTick } from 'vue';
import { ToastAlert } from '@/Composables/ToastAlert.js';

const { success, error } = ToastAlert();

// ──────────────── Props ────────────────
const props = defineProps({
    kelas: { type: Object, default: null },
    guru: { type: Object, default: null },
    siswa: { type: Object, default: null },
    stats: { type: Object, default: null },
    filters: { type: Object, default: () => ({}) },
});

// ──────────────── Flash ────────────────


// ──────────────── Filter State ────────────────
const search = ref(props.filters.search ?? '');
const filterStatus = ref(props.filters.status ?? '');
const filterRole = ref(props.filters.role ?? '');
let debounceTimer = null;

// ──────────────── Computed ────────────────
const siswaList = computed(() => props.siswa?.data ?? []);
const pagination = computed(() => props.siswa ?? {});
const hasKelas = computed(() => !!props.kelas);
const hasActiveFilter = computed(() =>
    search.value.trim() || filterStatus.value || filterRole.value
);

// ──────────────── Filter Logic ────────────────
function buildParams() {
    return {
        ...(search.value.trim() ? { search: search.value.trim() } : {}),
        ...(filterStatus.value ? { status: filterStatus.value } : {}),
        ...(filterRole.value ? { role: filterRole.value } : {}),
    };
}

function applyFilter() {
    router.get(route('guru.walas.index'), buildParams(), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

// Debounce search, immediate untuk select
watch(search, () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilter, 400);
});

watch([filterStatus, filterRole], () => {
    clearTimeout(debounceTimer); // batalkan debounce search yang mungkin pending
    applyFilter();
});

onUnmounted(() => clearTimeout(debounceTimer));

function clearFilters() {
    search.value = '';
    filterStatus.value = '';
    filterRole.value = '';
    router.get(route('guru.walas.index'), {}, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

function goToPage(url) {
    if (url) router.get(url, buildParams(), { preserveScroll: true });
}

// ──────────────── UI Helpers ────────────────
function getInitials(name) {
    return (name ?? '?')
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();
}

const AVATAR_COLORS = [
    'from-violet-500 to-purple-600',
    'from-sky-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-sky-600',
    'from-indigo-500 to-violet-600',
    'from-fuchsia-500 to-pink-600',
];

function avatarColor(name) {
    let hash = 0;
    for (const c of (name ?? '')) hash += c.charCodeAt(0);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const statCards = computed(() => {
    if (!props.stats) return [];
    return [
        { label: 'Total Siswa', value: props.stats.total, icon: '👥', color: 'bg-indigo-50  dark:bg-indigo-900/30  text-indigo-700  dark:text-indigo-300', ring: 'ring-indigo-200  dark:ring-indigo-700' },
        { label: 'Aktif', value: props.stats.aktif, icon: '✅', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-200 dark:ring-emerald-700' },
        { label: 'Nonaktif', value: props.stats.nonaktif, icon: '⛔', color: 'bg-rose-50    dark:bg-rose-900/30    text-rose-700    dark:text-rose-300', ring: 'ring-rose-200    dark:ring-rose-700' },
        { label: 'Sekretaris', value: props.stats.sekretaris, icon: '📋', color: 'bg-sky-50     dark:bg-sky-900/30     text-sky-700     dark:text-sky-300', ring: 'ring-sky-200     dark:ring-sky-700' },
        { label: 'Bendahara', value: props.stats.bendahara, icon: '💰', color: 'bg-amber-50   dark:bg-amber-900/30   text-amber-700   dark:text-amber-300', ring: 'ring-amber-200   dark:ring-amber-700' },
        { label: 'OSIS', value: props.stats.osis, icon: '🏅', color: 'bg-violet-50  dark:bg-violet-900/30  text-violet-700  dark:text-violet-300', ring: 'ring-violet-200  dark:ring-violet-700' },
    ];
});

// ──────────────── Edit Modal ────────────────
const showEditModal = ref(false);
const editLoading = ref(false);
const editErrors = ref({});
const editForm = ref({
    id: null,
    nama_lengkap: '',
    status: 'Activated',
    sekretaris: 'no',
    bendahara: 'no',
    osis: 'no',
});

function openEdit(siswa) {
    editErrors.value = {};
    editForm.value = {
        id: siswa.id,
        nama_lengkap: siswa.nama_lengkap,
        status: siswa.status,
        sekretaris: siswa.sekretaris ?? 'no',
        bendahara: siswa.bendahara ?? 'no',
        osis: siswa.osis ?? 'no',
    };
    showEditModal.value = true;
}

function closeEdit() {
    if (editLoading.value) return;
    showEditModal.value = false;
}

function submitEdit() {
    if (editLoading.value) return;
    editLoading.value = true;
    editErrors.value = {};

    router.put(
        route('guru.walas.update', editForm.value.id),
        {
            status: editForm.value.status,
            sekretaris: editForm.value.sekretaris,
            bendahara: editForm.value.bendahara,
            osis: editForm.value.osis,
        },
        {
            preserveScroll: true,
            onSuccess: () => {
                showEditModal.value = false;
                success('Data siswa berhasil diperbarui.');
            },
            onError: (errors) => {
                editErrors.value = errors;
                error('Gagal memperbarui data siswa. Periksa kembali isian form.');
            },
            onFinish: () => {
                editLoading.value = false;
            },
        }
    );
}

// ──────────────── Delete Confirm ────────────────
const showDeleteModal = ref(false);
const deleteLoading = ref(false);
const deleteSiswa = ref(null);

function openDelete(siswa) {
    deleteSiswa.value = siswa;
    showDeleteModal.value = true;
}

function closeDelete() {
    if (deleteLoading.value) return;
    showDeleteModal.value = false;
    deleteSiswa.value = null;
}

function confirmDelete() {
    if (deleteLoading.value || !deleteSiswa.value) return;
    deleteLoading.value = true;

    router.delete(
        route('guru.walas.destroy', deleteSiswa.value.id),
        {
            preserveScroll: true,
            data: buildParams(),  // kirim filter agar redirect balik ke halaman/filter yang sama
            onSuccess: () => {
                showDeleteModal.value = false;
                deleteSiswa.value = null;
            },
            onFinish: () => {
                deleteLoading.value = false;
            },
        }
    );
}

// Tutup modal saat tekan Escape
function onKeydown(e) {
    if (e.key === 'Escape') {
        closeEdit();
        closeDelete();
    }
}
</script>

<template>

    <Head title="Wali Kelas" />

    <MenuLayout @keydown.esc.window="onKeydown">
        <div class="min-h-screen py-4 px-2 sm:px-0">
            <div class="mx-auto max-w-7xl space-y-6">

                <!-- ─── HEADER CARD ─── -->
                <div
                    class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 shadow-xl p-6 sm:p-8">
                    <div
                        class="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl">
                    </div>
                    <div
                        class="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-violet-500/10 blur-2xl">
                    </div>

                    <div class="relative flex flex-col sm:flex-row sm:items-center gap-4">
                        <div
                            class="flex-shrink-0 w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl shadow-inner ring-1 ring-white/20">
                            🏫
                        </div>
                        <div class="flex-1">
                            <!-- <p class="text-xs font-semibold uppercase tracking-widest text-indigo-300/80 mb-1">Homeroom
                                Teacher</p> -->
                            <h1 class="text-2xl sm:text-3xl font-bold text-white leading-tight">
                                Wali Kelas
                                <span v-if="hasKelas" class="ml-2 text-indigo-300">— {{ kelas.kelas }}</span>
                            </h1>
                            <p v-if="guru" class="mt-1 text-slate-400 text-sm">
                                {{ guru.nama_lengkap }}
                                <span class="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs text-slate-300">{{
                                    guru.jabatan }}</span>
                            </p>
                        </div>
                        <div v-if="hasKelas" class="flex-shrink-0">
                            <div
                                class="px-5 py-2 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30 backdrop-blur text-center">
                                <p class="text-xs text-indigo-300 font-medium uppercase tracking-wider">Kelas</p>
                                <p class="text-xl font-bold text-white mt-0.5">{{ kelas.kelas }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ─── NO CLASS STATE ─── -->
                <div v-if="!hasKelas"
                    class="rounded-2xl bg-white dark:bg-slate-800/60 shadow-sm border border-slate-100 dark:border-slate-700/50 p-12 text-center">
                    <div class="text-6xl mb-4">🏷️</div>
                    <h2 class="text-xl font-semibold text-slate-700 dark:text-slate-200">Belum Memiliki Kelas Wali</h2>
                    <p class="mt-2 text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
                        Anda belum ditugaskan sebagai wali kelas. Hubungi admin untuk pengaturan lebih lanjut.
                    </p>
                </div>

                <!-- ─── STATS GRID ─── -->
                <div v-if="hasKelas && stats" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div v-for="card in statCards" :key="card.label"
                        :class="['rounded-xl p-4 ring-1 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-default', card.color, card.ring]">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-lg">{{ card.icon }}</span>
                        </div>
                        <p class="text-2xl font-bold leading-none">{{ card.value }}</p>
                        <p class="text-xs font-medium mt-1 opacity-80">{{ card.label }}</p>
                    </div>
                </div>

                <!-- ─── TABLE SECTION ─── -->
                <div v-if="hasKelas"
                    class="rounded-2xl bg-white dark:bg-slate-800/60 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">

                    <!-- Toolbar -->
                    <div
                        class="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div class="flex items-center gap-2">
                            <h2 class="font-semibold text-slate-800 dark:text-white text-sm">Data Siswa</h2>
                            <span
                                class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full">
                                {{ pagination.total ?? 0 }} siswa
                            </span>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full sm:w-auto">
                            <!-- Search -->
                            <div class="relative flex-1 sm:flex-none">
                                <span
                                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">🔍</span>
                                <input v-model="search" type="text" placeholder="Cari nama, NIS, NISN..."
                                    class="w-full sm:w-60 pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition" />
                            </div>

                            <!-- Filter Status -->
                            <select v-model="filterStatus"
                                class="px-10 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition">
                                <option value="">Semua Status</option>
                                <option value="Activated">Aktif</option>
                                <option value="Deactivated">Nonaktif</option>
                            </select>

                            <!-- Filter Peran -->
                            <select v-model="filterRole"
                                class="px-10 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition">
                                <option value="">Semua Peran</option>
                                <option value="sekretaris">Sekretaris</option>
                                <option value="bendahara">Bendahara</option>
                                <option value="osis">OSIS</option>
                            </select>

                            <!-- Reset -->
                            <button v-if="hasActiveFilter" @click="clearFilters"
                                class="px-3 py-2 text-sm rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition font-medium">
                                ✕ Reset
                            </button>
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr
                                    class="bg-slate-50/80 dark:bg-slate-700/40 border-b border-slate-100 dark:border-slate-700/50">
                                    <th
                                        class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-8">
                                        #</th>
                                    <th
                                        class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Siswa</th>
                                    <th
                                        class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        NIS</th>
                                    <th
                                        class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        NISN</th>
                                    <!-- <th
                                        class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        ID Siswa</th> -->
                                    <th
                                        class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Kejuruan</th>
                                    <th
                                        class="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Peran</th>
                                    <th
                                        class="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Status</th>
                                    <th
                                        class="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/40">

                                <!-- Empty state -->
                                <tr v-if="siswaList.length === 0">
                                    <td colspan="9" class="px-4 py-16 text-center">
                                        <div class="text-4xl mb-3">🔍</div>
                                        <p class="text-slate-500 dark:text-slate-400 font-medium">Tidak ada siswa
                                            ditemukan</p>
                                        <p class="text-slate-400 dark:text-slate-500 text-xs mt-1">Coba ubah filter atau
                                            kata kunci pencarian</p>
                                    </td>
                                </tr>

                                <!-- Rows -->
                                <tr v-for="(s, idx) in siswaList" :key="s.id"
                                    class="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors duration-100">

                                    <!-- No -->
                                    <td class="px-4 py-3 text-slate-400 dark:text-slate-500 text-xs font-mono">
                                        {{ (pagination.current_page - 1) * pagination.per_page + idx + 1 }}
                                    </td>

                                    <!-- Nama -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <div
                                                :class="['flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br text-white text-xs font-bold flex items-center justify-center shadow-sm', avatarColor(s.nama_lengkap)]">
                                                {{ getInitials(s.nama_lengkap) }}
                                            </div>
                                            <span class="font-medium text-slate-800 dark:text-white">{{ s.nama_lengkap
                                            }}</span>
                                        </div>
                                    </td>

                                    <!-- NIS -->
                                    <td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-300 text-xs">{{ s.nis
                                        ?? '—' }}</td>

                                    <!-- NISN -->
                                    <td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-300 text-xs">{{ s.nisn
                                        ?? '—' }}</td>

                                    <!-- ID Siswa -->
                                    <!-- <td class="px-4 py-3">
                                        <span
                                            class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-xs text-slate-600 dark:text-slate-300">
                                            {{ s.id_siswa }}
                                        </span>
                                    </td> -->

                                    <!-- Kejuruan — gunakan relasi jika ada, fallback ke id -->
                                    <td class="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
                                        {{ s.kejuruan?.kejuruan ?? '—' }}
                                    </td>

                                    <!-- Peran -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center justify-center gap-1 flex-wrap">
                                            <span v-if="s.sekretaris === 'yes'"
                                                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300">📋
                                                Sekretaris</span>
                                            <span v-if="s.bendahara === 'yes'"
                                                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">💰
                                                Bendahara</span>
                                            <span v-if="s.osis === 'yes'"
                                                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">🏅
                                                OSIS</span>
                                            <span
                                                v-if="s.sekretaris !== 'yes' && s.bendahara !== 'yes' && s.osis !== 'yes'"
                                                class="text-slate-300 dark:text-slate-600 text-xs">—</span>
                                        </div>
                                    </td>

                                    <!-- Status -->
                                    <td class="px-4 py-3 text-center">
                                        <span :class="['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                                            s.status === 'Activated'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                                : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300']">
                                            <span
                                                :class="['w-1.5 h-1.5 rounded-full', s.status === 'Activated' ? 'bg-emerald-500' : 'bg-rose-500']"></span>
                                            {{ s.status === 'Activated' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </td>

                                    <!-- Aksi -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center justify-center gap-1.5">
                                            <button @click="openEdit(s)"
                                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
                                                title="Edit siswa">
                                                ✏️ Edit
                                            </button>
                                            <button @click="openDelete(s)"
                                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
                                                title="Hapus siswa">
                                                🗑️ Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div v-if="pagination.last_page > 1"
                        class="px-5 py-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                            Menampilkan
                            <span class="font-semibold text-slate-700 dark:text-slate-200">{{ pagination.from }}–{{
                                pagination.to }}</span>
                            dari
                            <span class="font-semibold text-slate-700 dark:text-slate-200">{{ pagination.total }}</span>
                            siswa
                        </p>

                        <div class="flex items-center gap-1">
                            <button @click="goToPage(pagination.prev_page_url)" :disabled="!pagination.prev_page_url"
                                class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
                                ← Sebelumnya
                            </button>

                            <template v-for="link in pagination.links" :key="link.label">
                                <button v-if="link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'"
                                    @click="goToPage(link.url)" :disabled="!link.url"
                                    :class="['w-8 h-8 text-xs rounded-lg border transition font-medium',
                                        link.active
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                            : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed']"
                                    v-html="link.label">
                                </button>
                            </template>

                            <button @click="goToPage(pagination.next_page_url)" :disabled="!pagination.next_page_url"
                                class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
                                Berikutnya →
                            </button>
                        </div>
                    </div>

                    <div v-else-if="siswaList.length > 0"
                        class="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50">
                        <p class="text-xs text-slate-400 dark:text-slate-500">
                            Total {{ pagination.total ?? siswaList.length }} siswa ditampilkan
                        </p>
                    </div>
                </div>

            </div>
        </div>

        <!-- ══════════════════════════════════════════════ -->
        <!--  EDIT MODAL                                   -->
        <!-- ══════════════════════════════════════════════ -->
        <Teleport to="body">
            <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200"
                leave-to-class="opacity-0" leave-active-class="transition duration-150">
                <div v-if="showEditModal"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    @click.self="closeEdit">

                    <Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-200"
                        leave-to-class="opacity-0 scale-95" leave-active-class="transition duration-150">
                        <div v-if="showEditModal"
                            class="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden">

                            <!-- Modal Header -->
                            <div
                                class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div>
                                    <h3 class="font-semibold text-slate-800 dark:text-white text-base">Edit Data Siswa
                                    </h3>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{
                                        editForm.nama_lengkap }}</p>
                                </div>
                                <button @click="closeEdit"
                                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                    ✕
                                </button>
                            </div>

                            <!-- Modal Body -->
                            <div class="px-6 py-5 space-y-5">

                                <!-- Status -->
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide">Status</label>
                                    <div class="flex gap-3">
                                        <label
                                            v-for="opt in [{ value: 'Activated', label: '✅ Aktif' }, { value: 'Deactivated', label: '⛔ Nonaktif' }]"
                                            :key="opt.value"
                                            :class="['flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition',
                                                editForm.status === opt.value
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500']">
                                            <input type="radio" v-model="editForm.status" :value="opt.value"
                                                class="sr-only" />
                                            {{ opt.label }}
                                        </label>
                                    </div>
                                    <p v-if="editErrors.status" class="mt-1 text-xs text-rose-500">{{ editErrors.status
                                    }}</p>
                                </div>

                                <!-- Peran -->
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide">Peran
                                        Kelas</label>
                                    <div class="space-y-2">
                                        <label v-for="role in [
                                            { key: 'sekretaris', label: '📋 Sekretaris', note: 'Hanya 1 per kelas' },
                                            { key: 'bendahara', label: '💰 Bendahara', note: 'Hanya 1 per kelas' },
                                            { key: 'osis', label: '🏅 OSIS', note: 'Bisa lebih dari 1' },
                                        ]" :key="role.key"
                                            :class="['flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition',
                                                editForm[role.key] === 'yes'
                                                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500']">
                                            <div>
                                                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{{
                                                    role.label }}</span>
                                                <span class="ml-2 text-xs text-slate-400">{{ role.note }}</span>
                                            </div>
                                            <button type="button"
                                                @click="editForm[role.key] = editForm[role.key] === 'yes' ? 'no' : 'yes'"
                                                :class="['relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
                                                    editForm[role.key] === 'yes' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600']">
                                                <span
                                                    :class="['inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200',
                                                        editForm[role.key] === 'yes' ? 'translate-x-4' : 'translate-x-1']"></span>
                                            </button>
                                        </label>
                                    </div>
                                    <p v-if="editErrors.sekretaris || editErrors.bendahara || editErrors.osis"
                                        class="mt-1 text-xs text-rose-500">
                                        {{ editErrors.sekretaris || editErrors.bendahara || editErrors.osis }}
                                    </p>
                                </div>
                            </div>

                            <!-- Modal Footer -->
                            <div
                                class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
                                <button @click="closeEdit" :disabled="editLoading"
                                    class="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition">
                                    Batal
                                </button>
                                <button @click="submitEdit" :disabled="editLoading"
                                    class="inline-flex items-center gap-2 px-5 py-2 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60 transition">
                                    <svg v-if="editLoading" class="animate-spin h-4 w-4" fill="none"
                                        viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4" />
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    {{ editLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>

        <!-- ══════════════════════════════════════════════ -->
        <!--  DELETE CONFIRM MODAL                         -->
        <!-- ══════════════════════════════════════════════ -->
        <Teleport to="body">
            <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200"
                leave-to-class="opacity-0" leave-active-class="transition duration-150">
                <div v-if="showDeleteModal"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    @click.self="closeDelete">

                    <Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-200"
                        leave-to-class="opacity-0 scale-95" leave-active-class="transition duration-150">
                        <div v-if="showDeleteModal"
                            class="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden">

                            <div class="p-6 text-center">
                                <div
                                    class="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-2xl mx-auto mb-4">
                                    🗑️
                                </div>
                                <h3 class="text-base font-semibold text-slate-800 dark:text-white">Hapus Siswa?</h3>
                                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Anda akan menghapus
                                    <span class="font-semibold text-slate-700 dark:text-slate-200">{{
                                        deleteSiswa?.nama_lengkap
                                    }}</span>.
                                    Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>

                            <div class="px-6 pb-6 flex gap-3">
                                <button @click="closeDelete" :disabled="deleteLoading"
                                    class="flex-1 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition font-medium">
                                    Batal
                                </button>
                                <button @click="confirmDelete" :disabled="deleteLoading"
                                    class="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium disabled:opacity-60 transition">
                                    <svg v-if="deleteLoading" class="animate-spin h-4 w-4" fill="none"
                                        viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4" />
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    {{ deleteLoading ? 'Menghapus...' : 'Ya, Hapus' }}
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>

    </MenuLayout>
</template>
