<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Link } from '@inertiajs/vue3';
import {
    ArrowUturnLeftIcon, TrashIcon, ArrowPathIcon,
    ArrowLeftIcon, ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const trashedList = ref([]);
const isLoading = ref(false);
const selectedIds = ref(new Set());

const toast = (icon, title, text = '') => Swal.fire({
    icon, title, text,
    toast: true, position: 'top-end', showConfirmButton: false,
    timer: 3000, timerProgressBar: true, customClass: { popup: 'text-sm' },
});

const loadTrashed = async () => {
    isLoading.value = true;
    try {
        const { data } = await axios.get('/proktor/ruang-ujian/trash/data');
        trashedList.value = data.trashed;
        selectedIds.value = new Set();
    } catch {
        toast('error', 'Gagal memuat data terhapus');
    } finally {
        isLoading.value = false;
    }
};

onMounted(loadTrashed);

const allSelected = computed(() =>
    trashedList.value.length > 0 && selectedIds.value.size === trashedList.value.length
);

const toggleSelectAll = () => {
    selectedIds.value = allSelected.value
        ? new Set()
        : new Set(trashedList.value.map(t => t.id));
};

const toggleSelect = (id) => {
    const next = new Set(selectedIds.value);
    next.has(id) ? next.delete(id) : next.add(id);
    selectedIds.value = next;
};

const hasSelection = computed(() => selectedIds.value.size > 0);

/* ─── RESTORE ────────────────────────────────────────────────── */
const restoreSelected = async () => {
    const jumlah = selectedIds.value.size;
    const result = await Swal.fire({
        title: 'Pulihkan Data?',
        html: `<strong>${jumlah} peserta</strong> beserta riwayat ujiannya akan dikembalikan seperti semula.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Pulihkan',
        cancelButtonText: 'Batal',
    });
    if (!result.isConfirmed) return;

    isLoading.value = true;
    try {
        await axios.post('/proktor/ruang-ujian/trash/restore', {
            ids: [...selectedIds.value],
            include_riwayat: true,
        });
        toast('success', 'Data berhasil dipulihkan');
        await loadTrashed();
    } catch (e) {
        toast('error', 'Gagal memulihkan', e.response?.data?.message ?? 'Terjadi kesalahan.');
        isLoading.value = false;
    }
};

/* ─── FORCE DELETE (PERMANEN) ────────────────────────────────── */
const forceDeleteSelected = async () => {
    const jumlah = selectedIds.value.size;

    const step1 = await Swal.fire({
        title: 'Hapus Permanen?',
        html: `<div class="text-left">
                 <p class="mb-2"><strong>${jumlah} data</strong> akan dihapus <strong>PERMANEN</strong> dari database.</p>
                 <p class="text-red-600 font-medium">Tindakan ini TIDAK BISA dibatalkan — data tidak akan bisa dipulihkan lagi setelah ini.</p>
               </div>`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Lanjutkan',
        cancelButtonText: 'Batal',
    });
    if (!step1.isConfirmed) return;

    const step2 = await Swal.fire({
        title: 'Konfirmasi Terakhir',
        html: `Ketik <strong>HAPUS PERMANEN</strong> untuk melanjutkan.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Hapus Permanen',
        cancelButtonText: 'Batal',
        input: 'text',
        inputPlaceholder: 'Ketik: HAPUS PERMANEN',
        inputAttributes: { autocomplete: 'off' },
        preConfirm: (val) => {
            if (val !== 'HAPUS PERMANEN') {
                Swal.showValidationMessage('Teks tidak cocok. Ketik tepat: HAPUS PERMANEN');
                return false;
            }
        },
    });
    if (!step2.isConfirmed) return;

    isLoading.value = true;
    try {
        await axios.delete('/proktor/ruang-ujian/trash/force-delete', {
            data: {
                ids: [...selectedIds.value],
                include_riwayat: true,
                confirm_label: step2.value,
            }
        });
        toast('success', 'Data berhasil dihapus permanen');
        await loadTrashed();
    } catch (e) {
        toast('error', 'Gagal menghapus permanen', e.response?.data?.message ?? 'Terjadi kesalahan.');
        isLoading.value = false;
    }
};
</script>

<template>
    <MenuLayout>
        <div class="mx-auto w-full px-4 pb-10">

            <div class="flex items-center justify-between mb-6">
                <div>
                    <Link href="/proktor/ruang-ujian"
                        class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 mb-2">
                        <ArrowLeftIcon class="w-4 h-4" /> Kembali ke Exam Rooms
                    </Link>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                        Data Terhapus (Trash)
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Peserta yang sudah dihapus dari Exam Rooms. Bisa dipulihkan atau dihapus permanen.
                    </p>
                </div>

                <button @click="loadTrashed" :disabled="isLoading" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                           bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10
                           text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700
                           disabled:opacity-50 transition shadow-sm">
                    <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
                    Reload
                </button>
            </div>

            <!-- ── TOOLBAR AKSI ─────────────────────────────────── -->
            <div v-if="trashedList.length"
                class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-sm p-3 mb-4 flex items-center justify-between">
                <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                    <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
                    Pilih semua ({{ trashedList.length }})
                </label>

                <div class="flex gap-2">
                    <button @click="restoreSelected" :disabled="!hasSelection || isLoading" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                               bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white transition">
                        <ArrowUturnLeftIcon class="w-4 h-4" />
                        Pulihkan ({{ selectedIds.size }})
                    </button>
                    <button @click="forceDeleteSelected" :disabled="!hasSelection || isLoading" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                               bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white transition">
                        <TrashIcon class="w-4 h-4" />
                        Hapus Permanen ({{ selectedIds.size }})
                    </button>
                </div>
            </div>

            <!-- ── LIST ─────────────────────────────────────────── -->
            <div v-if="trashedList.length"
                class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-sm divide-y divide-gray-100 dark:divide-white/5">
                <label v-for="t in trashedList" :key="t.id"
                    class="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/30 transition">
                    <input type="checkbox" :checked="selectedIds.has(t.id)" @change="toggleSelect(t.id)" />
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {{ t.user?.siswa?.nama_lengkap ?? '—' }}
                            <span class="text-xs text-gray-400 font-normal">
                                · {{ t.user?.siswa?.kelas?.kelas ?? '—' }} · {{ t.soal?.mapel?.mapel ?? '—' }}
                            </span>
                        </p>
                        <p class="text-xs text-gray-400 mt-0.5">Dihapus pada: {{ t.deleted_at }}</p>
                    </div>
                </label>
            </div>

            <!-- ── EMPTY STATE ──────────────────────────────────── -->
            <div v-else class="flex flex-col items-center justify-center py-20 text-center">
                <ExclamationTriangleIcon class="w-14 h-14 text-gray-300 dark:text-gray-600 mb-4" />
                <p class="text-gray-500 dark:text-gray-400 font-medium">
                    {{ isLoading ? 'Memuat…' : 'Tidak ada data terhapus' }}
                </p>
            </div>

        </div>
    </MenuLayout>
</template>