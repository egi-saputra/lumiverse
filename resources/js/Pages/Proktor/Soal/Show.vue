<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import { ArrowLeftIcon, PlusIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid';
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps({
    soal: Object,
});

const deletingId = ref(null);
const isDeletingAll = ref(false);
const isExporting = ref(false);

// ─── Export soal ──────────────────────────────────────────────────────────────
async function exportSoal() {
    if (!props.soal.bank_soal?.length) return;

    isExporting.value = true;

    try {
        const response = await axios.get(
            `/proktor/bank-soal/soal/${props.soal.id}/export`,
            { responseType: 'blob' }
        );

        // Ambil nama file dari header Content-Disposition jika ada
        const disposition = response.headers['content-disposition'] ?? '';
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        const filename = match ? match[1].replace(/['"]/g, '') : `soal_${props.soal.token}.xlsx`;

        // Trigger download
        const url = URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: 'Failed to export questions. Please try again.',
            confirmButtonColor: '#ef4444',
        });
    } finally {
        isExporting.value = false;
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getJawaban = (item) => item.jawaban_benar || 'Belum ada kunci jawaban.';

const jawabanLabel = (item) => {
    if (item.tipe_soal !== 'PG' || !item.jawaban_benar) return getJawaban(item);
    const map = { opsi_a: 'A', opsi_b: 'B', opsi_c: 'C', opsi_d: 'D', opsi_e: 'E' };
    const label = map[item.jawaban_benar];
    const text = item[item.jawaban_benar];
    return label ? `${label}. ${text ?? ''}` : item.jawaban_benar;
};

// ─── Delete single ────────────────────────────────────────────────────────────
async function confirmDeleteItem(id) {
    const result = await Swal.fire({
        title: 'Hapus soal ini?',
        text: 'Tindakan ini tidak dapat dibatalkan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    deletingId.value = id;

    try {
        const res = await axios.delete(`/proktor/bank-soal/${id}`);

        // Optimistic UI: hapus item dari list tanpa reload halaman
        const idx = props.soal.bank_soal.findIndex(s => s.id === id);
        if (idx !== -1) props.soal.bank_soal.splice(idx, 1);

        Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: res.data.success || 'Soal berhasil dihapus.',
            timer: 1800,
            showConfirmButton: false,
        });
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: err.response?.data?.message || 'Gagal menghapus soal.',
            confirmButtonColor: '#ef4444',
        });
    } finally {
        deletingId.value = null;
    }
}

// ─── Delete all ───────────────────────────────────────────────────────────────
async function confirmDeleteAll() {
    const result = await Swal.fire({
        title: 'Hapus semua soal?',
        text: 'Seluruh soal pada quiz ini akan dihapus permanen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, hapus semua',
        cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    isDeletingAll.value = true;

    try {
        const res = await axios.delete(`/proktor/bank-soal/soal/${props.soal.id}/delete-all`);

        // Kosongkan list secara reaktif
        props.soal.bank_soal.splice(0);

        Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: res.data.success || 'Semua soal berhasil dihapus.',
            timer: 1800,
            showConfirmButton: false,
        });
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: err.response?.data?.message || 'Gagal menghapus semua soal.',
            confirmButtonColor: '#ef4444',
        });
    } finally {
        isDeletingAll.value = false;
    }
}
</script>

<template>

    <Head title="Detail Quiz" />

    <MenuLayout>
        <template #header>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-slate-100">
                Detail Quiz
            </h2>
        </template>

        <!-- ── Info Soal ──────────────────────────────────────────────────── -->
        <div class="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="rounded-xl border border-gray-200 dark:border-slate-800
                        bg-white dark:bg-slate-900 p-4 shadow-sm">
                <p class="text-xs text-gray-400 dark:text-slate-500 mb-1">Token Quiz</p>
                <p class="text-lg font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
                    {{ soal.token }}
                </p>
            </div>

            <div class="rounded-xl border border-gray-200 dark:border-slate-800
                        bg-white dark:bg-slate-900 p-4 shadow-sm">
                <p class="text-xs text-gray-400 dark:text-slate-500 mb-1">Status</p>
                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="soal.status === 'Aktif'
                    ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400'">
                    <span class="w-1.5 h-1.5 rounded-full"
                        :class="soal.status === 'Aktif' ? 'bg-green-500' : 'bg-gray-400'" />
                    {{ soal.status }}
                </span>
            </div>

            <div class="rounded-xl border border-gray-200 dark:border-slate-800
                        bg-white dark:bg-slate-900 p-4 shadow-sm">
                <p class="text-xs text-gray-400 dark:text-slate-500 mb-1">Format</p>
                <p class="font-semibold text-gray-800 dark:text-slate-200">{{ soal.tipe_soal }}</p>
            </div>

            <div class="rounded-xl border border-gray-200 dark:border-slate-800
                        bg-white dark:bg-slate-900 p-4 shadow-sm">
                <p class="text-xs text-gray-400 dark:text-slate-500 mb-1">Durasi</p>
                <p class="font-semibold text-gray-800 dark:text-slate-200">{{ soal.waktu }} menit</p>
            </div>

            <div class="rounded-xl border border-gray-200 dark:border-slate-800
                        bg-white dark:bg-slate-900 p-4 shadow-sm">
                <p class="text-xs text-gray-400 dark:text-slate-500 mb-1">Mata Pelajaran</p>
                <p class="font-semibold text-gray-800 dark:text-slate-200">
                    {{ soal.mapel?.mapel ?? '-' }}
                </p>
            </div>

            <div class="rounded-xl border border-gray-200 dark:border-slate-800
                        bg-white dark:bg-slate-900 p-4 shadow-sm">
                <p class="text-xs text-gray-400 dark:text-slate-500 mb-1">Kelas</p>
                <p class="font-semibold text-gray-800 dark:text-slate-200">{{ soal.kelas }}</p>
            </div>
        </div>

        <!-- ── Toolbar ────────────────────────────────────────────────────── -->
        <div class="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
                <Link href="/proktor/soal" class="hidden md:inline-flex items-center gap-1.5 rounded-lg
                           border border-gray-300 dark:border-slate-700
                           bg-white dark:bg-slate-900
                           px-4 py-2 text-sm font-medium
                           text-gray-700 dark:text-slate-300
                           hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeftIcon class="w-4 h-4" />
                    Kembali
                </Link>
                <span class="hidden md:inline-flex items-center gap-1.5 rounded-lg
                           border border-gray-300 dark:border-slate-700
                           bg-white dark:bg-slate-900
                           px-4 py-2 text-sm font-medium
                           text-gray-700 dark:text-slate-300 ">
                    {{ soal.bank_soal?.length ?? 0 }} SOAL
                </span>
            </div>

            <div class="flex gap-2 w-full sm:w-auto">
                <Link :href="`/proktor/bank-soal/create?soal_id=${soal.id}`" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5
                           rounded-lg px-4 py-2 text-sm font-semibold text-white
                           bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm">
                    <PlusIcon class="w-4 h-4" />
                    Tambah Soal
                </Link>

                <!-- Export -->
                <button @click="exportSoal" :disabled="isExporting || !soal.bank_soal?.length" class="flex-1 sm:flex-none sm:inline-flex hidden items-center justify-center gap-1.5
                           rounded-lg px-4 py-2 text-sm font-semibold text-white
                           bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all shadow-sm">
                    <svg v-if="isExporting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <ArrowDownTrayIcon v-else class="w-4 h-4" />
                    Download
                </button>

                <button @click="confirmDeleteAll" :disabled="isDeletingAll || !soal.bank_soal?.length" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5
                           rounded-lg px-4 py-2 text-sm font-semibold text-white
                           bg-red-600 hover:bg-red-700 active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all shadow-sm">
                    <svg v-if="isDeletingAll" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <TrashIcon v-else class="w-4 h-4" />
                    Hapus Semua
                </button>
            </div>
        </div>

        <!-- ── Empty state ────────────────────────────────────────────────── -->
        <div v-if="!soal.bank_soal || soal.bank_soal.length === 0" class="flex flex-col items-center justify-center rounded-2xl
                    border border-dashed border-gray-300 dark:border-slate-700
                    bg-white dark:bg-slate-900 py-16 text-center">
            <div class="rounded-full bg-gray-100 dark:bg-slate-800 p-4 mb-4">
                <svg class="w-8 h-8 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                             M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <p class="font-medium text-gray-500 dark:text-slate-400">Belum ada soal</p>
            <p class="text-sm text-gray-400 dark:text-slate-500 mt-1">
                Klik "Tambah Soal" untuk mulai membuat soal.
            </p>
        </div>

        <!-- ── List soal ──────────────────────────────────────────────────── -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(item, index) in soal.bank_soal" :key="item.id" class="group rounded-2xl border border-gray-200 dark:border-slate-800
                       bg-white dark:bg-slate-900 shadow-sm
                       hover:shadow-md hover:border-gray-300 dark:hover:border-slate-700
                       transition-all duration-200 overflow-hidden">
                <!-- Card header -->
                <div class="flex items-center justify-between
                            px-4 py-3 border-b border-gray-100 dark:border-slate-800
                            bg-gray-50 dark:bg-slate-800/60">
                    <span class="text-xs font-medium text-gray-400 dark:text-slate-500">
                        No. {{ index + 1 }}
                    </span>
                    <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="item.tipe_soal === 'PG'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'">
                        {{ item.tipe_soal === 'PG' ? 'Pilihan Ganda' : 'Essay' }}
                    </span>
                </div>

                <!-- Card body -->
                <div class="p-4 space-y-3 flex-1">
                    <!-- Pertanyaan -->
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide
                                  text-gray-400 dark:text-slate-500 mb-1">
                            Pertanyaan
                        </p>
                        <div v-html="item.soal" class="prose prose-sm max-w-none text-gray-800 dark:text-slate-200
                                   dark:prose-invert announcement-content line-clamp-4" />
                    </div>

                    <!-- Gambar lampiran -->
                    <div v-if="item.link_lampiran">
                        <img v-if="item.link_lampiran_url" :src="item.link_lampiran_url" alt="Lampiran soal" class="rounded-lg border border-gray-200 dark:border-slate-700
                                   max-h-40 object-cover w-full" />
                    </div>

                    <!-- Opsi PG -->
                    <div v-if="item.tipe_soal === 'PG'" class="space-y-1.5 text-sm">
                        <p class="text-xs font-semibold uppercase tracking-wide
                                  text-gray-400 dark:text-slate-500 mb-1">
                            Pilihan Jawaban
                        </p>
                        <template v-for="key in ['a', 'b', 'c', 'd', 'e']" :key="key">
                            <div v-if="item['opsi_' + key]"
                                class="flex items-start gap-2 rounded-lg px-2.5 py-1.5 transition-colors" :class="item.jawaban_benar === 'opsi_' + key
                                    ? 'bg-green-50 dark:bg-green-500/10'
                                    : 'bg-gray-50 dark:bg-slate-800/50'">
                                <span class="w-5 h-5 rounded-full shrink-0 text-xs font-bold
                                             flex items-center justify-center border mt-0.5"
                                    :class="item.jawaban_benar === 'opsi_' + key
                                        ? 'bg-green-100 border-green-300 text-green-700 dark:bg-green-500/20 dark:border-green-500/40 dark:text-green-400'
                                        : 'bg-white border-gray-200 text-gray-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400'">
                                    {{ key.toUpperCase() }}
                                </span>
                                <span :class="item.jawaban_benar === 'opsi_' + key
                                    ? 'font-semibold text-green-700 dark:text-green-400'
                                    : 'text-gray-700 dark:text-slate-300'">
                                    {{ item['opsi_' + key] }}
                                </span>
                                <span v-if="item.jawaban_benar === 'opsi_' + key" class="ml-auto text-xs font-semibold text-green-600 dark:text-green-400
                                             shrink-0 flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Benar
                                </span>
                            </div>
                            <!-- Slot kosong jika opsi belum diisi -->
                            <div v-else class="flex items-center gap-2 rounded-lg px-2.5 py-1.5
                                        bg-gray-50 dark:bg-slate-800/30 opacity-40">
                                <span class="w-5 h-5 rounded-full shrink-0 text-xs font-bold
                                             flex items-center justify-center border
                                             bg-white border-gray-200 text-gray-400
                                             dark:bg-slate-700 dark:border-slate-600 dark:text-slate-500">
                                    {{ key.toUpperCase() }}
                                </span>
                                <span class="text-xs text-gray-400 dark:text-slate-500 italic">
                                    Opsi {{ key.toUpperCase() }} belum diisi
                                </span>
                            </div>
                        </template>
                    </div>

                    <!-- Jawaban benar -->
                    <div class="rounded-lg bg-green-50 dark:bg-green-500/10
                                border border-green-200 dark:border-green-500/20
                                px-3 py-2">
                        <p class="text-xs font-semibold text-green-700 dark:text-green-400 mb-0.5">
                            Kunci Jawaban
                        </p>
                        <p class="text-sm text-green-800 dark:text-green-300">
                            {{ jawabанLabel(item) }}
                        </p>
                    </div>
                </div>

                <!-- Card footer / actions -->
                <div class="flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-slate-800">
                    <Link :href="`/proktor/bank-soal/${item.id}/edit`" class="flex-1 inline-flex items-center justify-center gap-1.5
                               rounded-lg px-3 py-2 text-xs font-semibold
                               text-blue-700 dark:text-blue-400
                               bg-blue-50 dark:bg-blue-500/10
                               hover:bg-blue-100 dark:hover:bg-blue-500/20
                               transition-colors">
                        Edit
                    </Link>

                    <button @click="confirmDeleteItem(item.id)" :disabled="deletingId === item.id" class="flex-1 inline-flex items-center justify-center gap-1.5
                               rounded-lg px-3 py-2 text-xs font-semibold
                               text-red-700 dark:text-red-400
                               bg-red-50 dark:bg-red-500/10
                               hover:bg-red-100 dark:hover:bg-red-500/20
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors">
                        <svg v-if="deletingId === item.id" class="w-3.5 h-3.5 animate-spin" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        {{ deletingId === item.id ? 'Menghapus...' : 'Hapus' }}
                    </button>
                </div>
            </div>
        </div>

    </MenuLayout>
</template>