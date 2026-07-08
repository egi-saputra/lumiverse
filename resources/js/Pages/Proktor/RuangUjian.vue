<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import {
    BookOpenIcon, BuildingLibraryIcon, MagnifyingGlassIcon,
    TrashIcon, ArrowPathIcon, XMarkIcon,
    UserGroupIcon, FunnelIcon
} from "@heroicons/vue/24/outline";
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

/* ─── PROPS ─────────────────────────────────────────────────── */
const props = defineProps({
    peserta: { type: Array, default: () => [] }
});

/* ─── STATE ──────────────────────────────────────────────────── */
const pesertaList = ref([...props.peserta]);
const filterKelas = ref('');
const filterMapel = ref('');
const searchNama = ref('');
const isLoading = ref(false);
const loadingIds = ref(new Set());
const filterStatus = ref('');

/* ─── DROPDOWN OPTIONS ───────────────────────────────────────── */
const kelasOptions = computed(() => {
    const set = new Set();
    pesertaList.value.forEach(p => p.user?.siswa?.kelas?.kelas && set.add(p.user.siswa.kelas.kelas));
    return [...set].sort();
});

const mapelOptions = computed(() => {
    const set = new Set();
    pesertaList.value.forEach(p => p.soal?.mapel?.mapel && set.add(p.soal.mapel.mapel));
    return [...set].sort();
});

/* ─── FILTER & PAGINATION ────────────────────────────────────── */
const currentPage = ref(1);
const perPage = 30;
const MAX_PAGES = 7;

const filteredPeserta = computed(() => {
    let data = pesertaList.value;
    if (filterKelas.value) data = data.filter(p => p.user?.siswa?.kelas?.kelas === filterKelas.value);
    if (filterMapel.value) data = data.filter(p => p.soal?.mapel?.mapel === filterMapel.value);
    if (filterStatus.value) {
        if (filterStatus.value === 'Terkunci') {
            data = data.filter(p => !p.status || p.status === 'Terkunci');
        } else {
            data = data.filter(p => p.status === filterStatus.value);
        }
    }
    if (searchNama.value) {
        const q = searchNama.value.toLowerCase();
        data = data.filter(p => p.user?.siswa?.nama_lengkap?.toLowerCase().includes(q));
    }
    return data;
});

watch(filteredPeserta, () => { currentPage.value = 1; });

const paginatedPeserta = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return filteredPeserta.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(filteredPeserta.value.length / perPage));

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    if (total <= MAX_PAGES) return Array.from({ length: total }, (_, i) => i + 1);
    const half = Math.floor(MAX_PAGES / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + MAX_PAGES - 1);
    if (end - start + 1 < MAX_PAGES) start = Math.max(1, end - MAX_PAGES + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

const hasActiveFilter = computed(() =>
    filterKelas.value || filterMapel.value || filterStatus.value || searchNama.value
);

const resetFilter = () => {
    filterKelas.value = '';
    filterMapel.value = '';
    filterStatus.value = '';
    searchNama.value = '';
};

/* ─── STATS ──────────────────────────────────────────────────── */
const stats = computed(() => ({
    total: pesertaList.value.length,
    selesai: pesertaList.value.filter(p => p.status === 'Selesai').length,
    aktif: pesertaList.value.filter(p => p.status === 'Sedang Dikerjakan').length,
    terkunci: pesertaList.value.filter(p => !p.status || p.status === 'Terkunci').length,
}));

/* ─── HELPERS ────────────────────────────────────────────────── */
const toast = (icon, title, text = '') => Swal.fire({
    icon, title, text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: { popup: 'text-sm' },
});

const setRowLoading = (id, val) => {
    const next = new Set(loadingIds.value);
    val ? next.add(id) : next.delete(id);
    loadingIds.value = next;
};

/* ─── ACTIONS ────────────────────────────────────────────────── */
const copyToken = (token) => {
    navigator.clipboard.writeText(token).then(() => toast('success', 'Token disalin!'));
};

const reloadPeserta = async () => {
    isLoading.value = true;
    try {
        const { data } = await axios.get('/proktor/ruang-ujian/peserta');
        pesertaList.value = data.peserta;
        toast('success', 'Data diperbarui');
    } catch {
        toast('error', 'Gagal memuat data', 'Periksa koneksi internet Anda.');
    } finally {
        isLoading.value = false;
    }
};

const deletePeserta = async (id, nama) => {
    const result = await Swal.fire({
        title: 'Hapus Peserta?',
        html: `Peserta <strong>${nama ?? 'ini'}</strong> akan dihapus dari ruang ujian.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
    });
    if (!result.isConfirmed) return;

    setRowLoading(id, true);
    try {
        await axios.delete(`/proktor/ruang-ujian/peserta/${id}`);
        pesertaList.value = pesertaList.value.filter(p => p.id !== id);
        toast('success', 'Peserta dihapus');
    } catch (e) {
        const msg = e.response?.data?.message ?? 'Terjadi kesalahan.';
        toast('error', 'Gagal menghapus', msg);
    } finally {
        setRowLoading(id, false);
    }
};

const deleteAllPeserta = async () => {
    const kelasAktif = filterKelas.value;
    const label = kelasAktif ? `kelas <strong>${kelasAktif}</strong>` : 'semua kelas';
    const jumlah = filteredPeserta.value.length;

    if (jumlah === 0) {
        return toast('info', 'Tidak ada data', 'Tidak ada peserta yang cocok dengan filter saat ini.');
    }

    // Step 1 — Konfirmasi scope
    const step1 = await Swal.fire({
        title: 'Hapus Data Peserta',
        html: `Anda akan menghapus <strong>${jumlah} peserta</strong> dari ${label}.<br><br>
               Pilih data yang ingin dihapus:`,
        icon: 'warning',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        denyButtonColor: '#f97316',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '🗑️ Ujian Siswa + Riwayat',
        denyButtonText: '📋 Ujian Siswa Saja',
        cancelButtonText: 'Batal',
        reverseButtons: false,
    });

    if (step1.isDismissed) return;

    const includeRiwayat = step1.isConfirmed; // true = keduanya, false = ujian saja

    // Step 2 — Konfirmasi akhir
    const step2 = await Swal.fire({
        title: 'Konfirmasi Akhir',
        html: `Tindakan ini <strong>tidak dapat dibatalkan</strong>.<br>
               ${jumlah} data dari ${label} akan dihapus${includeRiwayat ? ' beserta seluruh riwayat ujian' : ''}.`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Hapus Sekarang',
        cancelButtonText: 'Batal',
        input: 'text',
        inputPlaceholder: 'Ketik HAPUS untuk konfirmasi',
        inputAttributes: { autocomplete: 'off' },
        preConfirm: (val) => {
            if (val !== 'HAPUS') {
                Swal.showValidationMessage('Ketik tepat: HAPUS');
                return false;
            }
        },
    });

    if (!step2.isConfirmed) return;

    isLoading.value = true;
    try {
        await axios.delete('/proktor/ruang-ujian/peserta/destroy-all', {
            data: {
                kelas: kelasAktif || null,
                include_riwayat: includeRiwayat,
            }
        });

        // Update local state
        if (kelasAktif) {
            pesertaList.value = pesertaList.value.filter(
                p => p.user?.siswa?.kelas?.kelas !== kelasAktif
            );
        } else {
            pesertaList.value = [];
        }

        filterKelas.value = '';
        toast('success', 'Data berhasil dihapus', `${jumlah} peserta telah dihapus.`);

    } catch (e) {
        const msg = e.response?.data?.message ?? 'Terjadi kesalahan pada server.';
        toast('error', 'Gagal menghapus', msg);
    } finally {
        isLoading.value = false;
    }
};

/* ─── LIFECYCLE ──────────────────────────────────────────────── */
onMounted(async () => {
    try {
        const { data } = await axios.get('/proktor/ruang-ujian/peserta');
        pesertaList.value = data.peserta;
    } catch {
        toast('error', 'Gagal memuat data awal', 'Coba refresh halaman.');
    }
});

/* ─── STATUS STYLE ───────────────────────────────────────────── */
const statusClass = (status) => {
    if (status === 'Selesai') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
    if (status === 'Sedang Dikerjakan') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';
    return 'bg-slate-100 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400';
};

const statusDot = (status) => {
    if (status === 'Selesai') return 'bg-emerald-500';
    if (status === 'Sedang Dikerjakan') return 'bg-amber-500 animate-pulse';
    return 'bg-slate-400';
};
</script>

<template>
    <MenuLayout>
        <div class="mx-auto max-w-6xl w-full px-4 pb-10">

            <!-- ── HEADER ────────────────────────────────────── -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                        Exam Room Management
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Kelola dan pantau peserta ujian (Klik tombol reload untuk refresh dan menampilkan data terbaru)
                    </p>
                </div>

                <div class="flex gap-2">
                    <button @click="reloadPeserta" :disabled="isLoading" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                               bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10
                               text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700
                               disabled:opacity-50 transition shadow-sm">
                        <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
                        Reload
                    </button>

                    <button @click="deleteAllPeserta" :disabled="isLoading || filteredPeserta.length === 0" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                               bg-red-500 hover:bg-red-600 disabled:opacity-50
                               text-white transition shadow-sm">
                        <TrashIcon class="w-4 h-4" />
                        Hapus {{ filterKelas ? `Kelas ${filterKelas}` : 'Semua' }}
                    </button>
                </div>
            </div>

            <!-- ── STAT CARDS ─────────────────────────────────── -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div
                    class="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Total</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{{ stats.total }}</p>
                </div>
                <div
                    class="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
                    <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide">
                        Selesai</p>
                    <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ stats.selesai }}</p>
                </div>
                <div
                    class="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
                    <p class="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide">Aktif</p>
                    <p class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{{ stats.aktif }}</p>
                </div>
                <div
                    class="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Terkunci
                    </p>
                    <p class="text-2xl font-bold text-slate-600 dark:text-slate-300 mt-1">{{ stats.terkunci }}</p>
                </div>
            </div>

            <!-- ── FILTER BAR ──────────────────────────────────── -->
            <div class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10
                        rounded-xl shadow-sm p-4 mb-5">
                <div class="flex flex-col sm:flex-row gap-3">
                    <!-- Kelas -->
                    <div class="relative flex-1">
                        <BuildingLibraryIcon class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select v-model="filterKelas" class="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10
                                   bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                            <option value="">Semua Kelas</option>
                            <option v-for="k in kelasOptions" :key="k" :value="k">{{ k }}</option>
                        </select>
                    </div>

                    <!-- Mapel -->
                    <div class="relative flex-1">
                        <BookOpenIcon class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select v-model="filterMapel" class="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10
                                   bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                            <option value="">Semua Mapel</option>
                            <option v-for="m in mapelOptions" :key="m" :value="m">{{ m }}</option>
                        </select>
                    </div>

                    <!-- Status -->
                    <div class="relative flex-1">
                        <FunnelIcon class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select v-model="filterStatus" class="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10
               bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200
               focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                            <option value="">Semua Status</option>
                            <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Terkunci">Terkunci</option>
                        </select>
                    </div>

                    <!-- Search -->
                    <div class="relative flex-1">
                        <MagnifyingGlassIcon class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" v-model="searchNama" placeholder="Cari nama peserta…" class="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10
                                   bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    </div>

                    <!-- Reset -->
                    <button v-if="hasActiveFilter" @click="resetFilter" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium
                               bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300
                               hover:bg-gray-200 dark:hover:bg-slate-600 transition">
                        <XMarkIcon class="w-4 h-4" /> Reset
                    </button>
                </div>

                <!-- Filter summary -->
                <p v-if="hasActiveFilter" class="text-xs text-gray-400 dark:text-gray-500 mt-2.5">
                    Menampilkan <strong class="text-gray-600 dark:text-gray-300">{{ filteredPeserta.length }}</strong>
                    dari {{ pesertaList.length }} peserta
                </p>
            </div>

            <!-- ── DESKTOP TABLE ───────────────────────────────── -->
            <div v-if="filteredPeserta.length" class="hidden md:block bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10
                       rounded-xl shadow-sm overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 dark:bg-slate-700/60 border-b border-gray-100 dark:border-white/10">
                            <th
                                class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center w-12">
                                #</th>
                            <th
                                class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left">
                                Nama</th>
                            <th
                                class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center">
                                Kelas</th>
                            <th
                                class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center">
                                Token</th>
                            <th
                                class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center">
                                Status</th>
                            <th
                                class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center w-16">
                                Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                        <tr v-for="(p, i) in paginatedPeserta" :key="p.id"
                            class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">

                            <td class="px-4 py-3 text-center text-xs text-gray-400 dark:text-gray-500">
                                {{ (currentPage - 1) * perPage + i + 1 }}
                            </td>

                            <td class="px-4 py-3">
                                <span class="font-medium text-gray-800 dark:text-gray-100">
                                    {{ p.user?.siswa?.nama_lengkap ?? '—' }}
                                </span>
                                <span v-if="p.soal?.mapel?.mapel"
                                    class="block text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    {{ p.soal.mapel.mapel }}
                                </span>
                            </td>

                            <td class="px-4 py-3 text-center">
                                <span class="inline-block px-2.5 py-1 rounded-md text-xs font-medium
                                             bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {{ p.user?.siswa?.kelas?.kelas ?? '—' }}
                                </span>
                            </td>

                            <td class="px-4 py-3 text-center">
                                <button @click="copyToken(p.token)" class="font-mono text-xs px-2.5 py-1.5 rounded-md
                                           bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300
                                           hover:bg-blue-100 dark:hover:bg-blue-500/20
                                           hover:text-blue-600 dark:hover:text-blue-300
                                           transition cursor-copy tracking-wider">
                                    {{ p.token }}
                                </button>
                            </td>

                            <td class="px-4 py-3 text-center">
                                <span
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                    :class="statusClass(p.status)">
                                    <span class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        :class="statusDot(p.status)"></span>
                                    {{ p.status ?? 'Terkunci' }}
                                </span>
                            </td>

                            <td class="px-4 py-3 text-center">
                                <button @click="deletePeserta(p.id, p.user?.siswa?.nama_lengkap)"
                                    :disabled="loadingIds.has(p.id)" class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50
                                           dark:hover:bg-red-500/10 dark:hover:text-red-400
                                           disabled:opacity-40 transition">
                                    <ArrowPathIcon v-if="loadingIds.has(p.id)" class="w-4 h-4 animate-spin" />
                                    <TrashIcon v-else class="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- ── MOBILE CARD ─────────────────────────────────── -->
            <div v-if="filteredPeserta.length" class="md:hidden space-y-3">
                <div v-for="(p, i) in paginatedPeserta" :key="p.id" class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10
                           rounded-xl p-4 shadow-sm">

                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <p class="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                {{ p.user?.siswa?.nama_lengkap ?? '—' }}
                            </p>
                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {{ p.soal?.mapel?.mapel ?? '—' }}
                            </p>
                        </div>
                        <span
                            class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                            :class="statusClass(p.status)">
                            <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(p.status)"></span>
                            {{ p.status ?? 'Terkunci' }}
                        </span>
                    </div>

                    <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                            <span
                                class="block text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-0.5">Kelas</span>
                            <span class="font-medium text-gray-700 dark:text-gray-200">{{ p.user?.siswa?.kelas?.kelas ??
                                '—' }}</span>
                        </div>
                        <button @click="copyToken(p.token)" class="bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2 text-left cursor-copy
                                   hover:bg-blue-50 dark:hover:bg-blue-500/10 transition">
                            <span
                                class="block text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-0.5">Token</span>
                            <span class="font-mono font-medium text-gray-700 dark:text-gray-200 tracking-wider">{{
                                p.token }}</span>
                        </button>
                    </div>

                    <button @click="deletePeserta(p.id, p.user?.siswa?.nama_lengkap)" :disabled="loadingIds.has(p.id)"
                        class="mt-3 w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg text-sm
                               border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400
                               hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 transition">
                        <ArrowPathIcon v-if="loadingIds.has(p.id)" class="w-4 h-4 animate-spin" />
                        <TrashIcon v-else class="w-4 h-4" />
                        {{ loadingIds.has(p.id) ? 'Menghapus…' : 'Hapus Peserta' }}
                    </button>
                </div>
            </div>

            <!-- ── EMPTY STATE ─────────────────────────────────── -->
            <div v-if="!filteredPeserta.length" class="flex flex-col items-center justify-center py-20 text-center">
                <UserGroupIcon class="w-14 h-14 text-gray-300 dark:text-gray-600 mb-4" />
                <p class="text-gray-500 dark:text-gray-400 font-medium">Tidak ada peserta ditemukan</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {{ hasActiveFilter ? 'Coba ubah filter pencarian.' : 'Belum ada peserta yang terdaftar.' }}
                </p>
                <button v-if="hasActiveFilter" @click="resetFilter"
                    class="mt-4 text-sm text-blue-500 hover:underline">Reset filter</button>
            </div>

            <!-- ── PAGINATION ──────────────────────────────────── -->
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-1 mt-6">
                <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-2 rounded-lg border text-sm border-gray-200 dark:border-white/10
                           bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400
                           disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50
                           dark:hover:bg-slate-700 transition">‹</button>

                <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
                    class="px-3 py-2 rounded-lg border text-sm transition"
                    :class="page === currentPage
                        ? 'bg-blue-600 border-blue-600 text-white font-medium shadow-sm'
                        : 'border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'">
                    {{ page }}
                </button>

                <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-2 rounded-lg border text-sm border-gray-200 dark:border-white/10
                           bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400
                           disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50
                           dark:hover:bg-slate-700 transition">›</button>
            </div>

        </div>
    </MenuLayout>
</template>