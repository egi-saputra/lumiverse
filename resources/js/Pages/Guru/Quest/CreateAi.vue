<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { ref, computed, onBeforeUnmount } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import { ArrowLeftIcon, SparklesIcon, XMarkIcon, CheckIcon } from '@heroicons/vue/24/solid';
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps({
    soal: Object,
    materiList: Array,
    aiPlan: Object,
    creditRules: Object,
    jumlah_opsi_pg: 4,
});

const form = ref({
    topik: '',
    jumlah_pg: 5,
    jumlah_essay: 0,
    nilai_per_soal: 0,
    jumlah_opsi_pg: 4,
});

const opsiPgChoices = [
    { value: 3, label: '3 Opsi (A–C)' },
    { value: 4, label: '4 Opsi (A–D)' },
    { value: 5, label: '5 Opsi (A–E)' },
];

const generating = ref(false);

// ─── Pemilihan materi referensi (multi-select via modal) ───────────────────
const showMateriModal = ref(false);
const selectedMateriIds = ref([]); // array of number
const draftSelectedIds = ref([]);  // buffer di dalam modal, di-commit saat "Terapkan"

const selectedMateris = computed(() =>
    props.materiList.filter(m => selectedMateriIds.value.includes(m.id))
);

const openMateriModal = () => {
    draftSelectedIds.value = [...selectedMateriIds.value];
    showMateriModal.value = true;
};

const closeMateriModal = () => {
    showMateriModal.value = false;
};

const toggleDraftMateri = (id) => {
    const idx = draftSelectedIds.value.indexOf(id);
    if (idx === -1) {
        draftSelectedIds.value.push(id);
    } else {
        draftSelectedIds.value.splice(idx, 1);
    }
};

const applyMateriSelection = () => {
    selectedMateriIds.value = [...draftSelectedIds.value];
    showMateriModal.value = false;
};

const removeMateriChip = (id) => {
    selectedMateriIds.value = selectedMateriIds.value.filter(x => x !== id);
};

// ─── Biaya kredit dinamis ───────────────────────────────────────────────────
const currentCost = computed(() =>
    selectedMateriIds.value.length > 0 ? props.creditRules.with_materi : props.creditRules.without_materi
);

const totalSoal = computed(() =>
    (Number(form.value.jumlah_pg) || 0) + (Number(form.value.jumlah_essay) || 0)
);

const notEnoughCredit = computed(() => props.aiPlan.remaining < currentCost.value);

const canGenerate = computed(() => {
    if (generating.value) return false;
    if (totalSoal.value < 1) return false;
    if (selectedMateriIds.value.length === 0 && !form.value.topik.trim()) return false;
    // notEnoughCredit sengaja TIDAK dicek di sini,
    // supaya tombol tetap bisa diklik dan memunculkan alert upgrade
    return true;
});

// ─── Stage / polling (pola sama seperti generate materi AI) ────────────────
const stageMeta = {
    queued: { text: 'Sedang berpikir...' },
    analyzing: { text: 'Menyiapkan konteks soal...' },
    contacting_ai: { text: 'Mengumpulkan sumber materi...' },
    parsing: { text: 'Menyusun soal...' },
    done: { icon: '✅', text: 'Selesai!' },
    failed: { icon: '⚠️', text: 'Gagal generate' },
};

const currentStageKey = ref('queued');
const currentStageMessage = ref('');
const currentStage = computed(() => ({
    ...(stageMeta[currentStageKey.value] ?? stageMeta.queued),
    text: currentStageMessage.value || (stageMeta[currentStageKey.value] ?? stageMeta.queued).text,
}));

let pollTimer = null;
let pollActive = false;

const stopPolling = () => {
    pollActive = false;
    if (pollTimer) clearTimeout(pollTimer);
    pollTimer = null;
};

onBeforeUnmount(() => stopPolling());

const pollStatus = (generationId) => {
    pollActive = true;

    const tick = async () => {
        if (!pollActive) return;

        try {
            const { data } = await axios.post(`/guru/bank-soal/generate-ai-status/${generationId}`);
            if (!pollActive) return;

            currentStageKey.value = data.stage;
            currentStageMessage.value = data.message ?? '';

            if (data.stage === 'done') {
                stopPolling();
                generating.value = false;

                const { total_generated, total_requested, shortfall } = data.result;

                await Swal.fire({
                    icon: shortfall > 0 ? 'warning' : 'success',
                    title: 'Selesai!',
                    text: shortfall > 0
                        ? `${total_generated} dari ${total_requested} soal berhasil dibuat (${shortfall} soal gagal, coba generate lagi untuk menambah kalau perlu).`
                        : `${total_generated} soal berhasil dibuat dan ditambahkan ke quiz ini.`,
                    confirmButtonColor: '#7c3aed',
                });

                router.visit(`/guru/soal/${props.soal.id}`);
                return;
            }

            if (data.stage === 'failed') {
                stopPolling();
                generating.value = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message || 'Gagal generate soal dengan AI.',
                    confirmButtonColor: '#ef4444',
                });
                return;
            }

            pollTimer = setTimeout(tick, 1200);
        } catch (e) {
            stopPolling();
            generating.value = false;
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal memantau proses generate. Coba lagi.',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    tick();
};

const generateWithAi = async () => {
    if (!canGenerate.value) return;

    if (notEnoughCredit.value) {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Kredit Tidak Cukup',
            text: `Butuh ${currentCost.value} token, sisa kredit Anda ${aiPlan.remaining}. Upgrade paket untuk melanjutkan.`,
            showCancelButton: true,
            confirmButtonText: 'Upgrade Paket',
            cancelButtonText: 'Tutup',
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            router.visit('/guru/ai-pricing'); // sesuaikan route halaman aiPricing
        }
        return;
    }

    generating.value = true;
    currentStageKey.value = 'queued';
    currentStageMessage.value = '';

    try {
        const { data } = await axios.post('/guru/bank-soal/generate-ai', {
            soal_id: props.soal.id,
            materi_ids: selectedMateriIds.value,
            topik: form.value.topik || null,
            jumlah_pg: Number(form.value.jumlah_pg) || 0,
            jumlah_essay: Number(form.value.jumlah_essay) || 0,
            nilai_per_soal: Number(form.value.nilai_per_soal) || 0,
            jumlah_opsi_pg: Number(form.value.jumlah_opsi_pg) || 4,
        });

        pollStatus(data.generation_id);
    } catch (e) {
        generating.value = false;

        const status = e.response?.status;
        const message = e.response?.data?.message || '';
        const isCreditError = status === 402 || status === 403 || /kredit|token.*tidak cukup/i.test(message);

        if (isCreditError) {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Kredit Tidak Cukup',
                text: message || 'Kredit token Anda tidak cukup untuk generate soal ini.',
                showCancelButton: true,
                confirmButtonText: 'Upgrade Paket',
                cancelButtonText: 'Tutup',
                confirmButtonColor: '#3b82f6',
                cancelButtonColor: '#6b7280',
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                router.visit(route('guru.ai-billing.pricing'));
            }
            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'Gagal memulai',
            text: message || 'Gagal memulai proses generate.',
            confirmButtonColor: '#ef4444',
        });
    }
};
</script>

<template>
    <MenuLayout>
        <div class="px-10">
            <div class="rounded-2xl border border-gray-200 bg-white shadow-sm
                        dark:border-slate-800 dark:bg-slate-900 overflow-hidden">

                <!-- Header -->
                <div class="border-b border-gray-200 dark:border-slate-800 px-6 py-5 flex items-center gap-3">
                    <div class="rounded-full bg-purple-50 dark:bg-purple-500/10 p-2.5">
                        <SparklesIcon class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h1 class="text-xl font-semibold text-gray-900 dark:text-slate-100">
                            Buat Soal dengan AI
                        </h1>
                        <p class="text-sm text-gray-500 dark:text-slate-400">
                            {{ soal.title }}
                        </p>
                    </div>
                </div>

                <div class="px-6 py-6 space-y-6">

                    <!-- Sisa kredit -->
                    <div class="rounded-xl border border-purple-200 dark:border-purple-500/20
                                bg-purple-50 dark:bg-purple-500/10 px-4 py-3 flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-purple-800 dark:text-purple-300">
                                Sisa kredit token bulan ini
                            </p>
                            <!-- <p class="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                                Pakai referensi materi: {{ creditRules.with_materi }} token · Tanpa referensi (AI cari
                                sendiri): {{ creditRules.without_materi }} token
                            </p> -->
                            <p class="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                                Gunakan referensi dari materi yang sudah Anda buat untuk mendapatkan hasil generate soal
                                yang lebih relevan dan akurat.
                            </p>
                        </div>
                        <div class="text-2xl font-bold text-purple-700 dark:text-purple-300 shrink-0">
                            {{ aiPlan.remaining }}
                        </div>
                    </div>

                    <!-- Materi referensi -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                            Materi Referensi <span class="text-gray-400 font-normal">(opsional, bisa pilih lebih dari
                                satu)</span>
                        </label>

                        <button type="button" @click="openMateriModal" class="w-full inline-flex items-center justify-center gap-2 rounded-lg
                                   border border-dashed border-gray-300 dark:border-slate-600
                                   px-3 py-2.5 text-sm font-medium
                                   text-gray-600 dark:text-slate-300
                                   hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            <SparklesIcon class="w-4 h-4 text-purple-500" />
                            {{ selectedMateriIds.length > 0 ? 'Ubah Pilihan Materi' : 'Pilih Referensi Dari Materi Yang Sudah Ada' }}
                        </button>

                        <!-- Chips materi terpilih -->
                        <div v-if="selectedMateris.length" class="flex flex-wrap gap-2 pt-1">
                            <span v-for="m in selectedMateris" :key="m.id" class="inline-flex items-center gap-1.5 rounded-full
                                       bg-purple-50 dark:bg-purple-500/10
                                       border border-purple-200 dark:border-purple-500/20
                                       pl-3 pr-1.5 py-1 text-xs font-medium
                                       text-purple-700 dark:text-purple-300">
                                {{ m.judul }}
                                <button type="button" @click="removeMateriChip(m.id)"
                                    class="rounded-full hover:bg-purple-100 dark:hover:bg-purple-500/20 p-0.5 transition">
                                    <XMarkIcon class="w-3 h-3" />
                                </button>
                            </span>
                        </div>

                        <p class="text-xs text-gray-500 dark:text-slate-400">
                            <!-- <template v-if="selectedMateris.length">
                                Soal akan dibuat berdasarkan isi {{ selectedMateris.length }} materi yang dipilih sebagai referensi
                                — biaya {{ creditRules.with_materi }} token.
                            </template> -->
                            <template v-if="selectedMateris.length">
                                Soal akan dibuat berdasarkan isi materi yang dipilih sebagai referensi utama.<br>Jika
                                materi tidak memadai untuk membuat soal dari jumlah soal yang ditentukan, maka Ai akan
                                mencari sumber lain yang relevan dengan materi tersebut.
                            </template>
                            <template v-else>
                                AI akan mencari & riset sumber sendiri dari web berdasarkan topik di bawah — biaya
                                {{ creditRules.without_materi }} token (lebih mahal karena butuh browsing).
                            </template>
                        </p>
                    </div>

                    <!-- Topik -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                            Topik / Instruksi Tambahan
                            <span v-if="!selectedMateris.length" class="text-red-500">*</span>
                            <span v-else class="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <textarea v-model="form.topik" rows="3"
                            :placeholder="selectedMateris.length
                                ? 'Instruksi tambahan, mis. fokuskan pada sub-bab tertentu (opsional)'
                                : 'Wajib diisi jika tidak ada materi yang digunakan sebagai referensi. Contoh: Soal tentang siklus air untuk kelas 5 SD'"
                            class="w-full rounded-lg border border-gray-300
                                   dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100
                                   px-3 py-2.5 text-sm resize-none
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                    </div>

                    <!-- Jumlah soal -->
                    <div class="grid sm:grid-cols-3 gap-4">
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                Jumlah Pilihan Ganda
                            </label>
                            <input v-model.number="form.jumlah_pg" type="number" min="0" max="100" class="w-full rounded-lg border border-gray-300
                                       dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100
                                       px-3 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                Jumlah Essay
                            </label>
                            <input v-model.number="form.jumlah_essay" type="number" min="0" max="100" class="w-full rounded-lg border border-gray-300
                                       dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100
                                       px-3 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                Poin / Butir Soal
                            </label>
                            <input v-model.number="form.nilai_per_soal" type="number" min="0"
                                class="w-full rounded-lg border border-gray-300  dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                        </div>
                    </div>

                    <div v-if="form.jumlah_pg > 0" class="space-y-1.5">
                        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                            Jumlah Opsi Jawaban PG
                        </label>
                        <div class="grid grid-cols-3 gap-2">
                            <button v-for="choice in opsiPgChoices" :key="choice.value" type="button"
                                @click="form.jumlah_opsi_pg = choice.value"
                                class="rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors"
                                :class="form.jumlah_opsi_pg === choice.value
                                    ? 'bg-purple-600 border-purple-600 text-white'
                                    : 'border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'">
                                {{ choice.label }}
                            </button>
                        </div>
                    </div>

                    <p v-if="totalSoal < 1" class="text-xs text-amber-600 dark:text-amber-400">
                        Isi minimal 1 soal (PG dan/atau Essay).
                    </p>
                    <p v-else-if="notEnoughCredit" class="text-xs text-red-600 dark:text-red-400">
                        Kredit tidak cukup — butuh {{ currentCost }} token, sisa {{ aiPlan.remaining }}.
                    </p>
                    <p v-else class="text-xs text-gray-500 dark:text-slate-400">
                        Total {{ totalSoal }} soal akan dibuat, biaya {{ currentCost }} token.
                    </p>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="button" @click="generateWithAi" :disabled="!canGenerate" class="relative flex-1 overflow-hidden inline-flex items-center justify-center gap-2
                                   rounded-xl px-6 py-3 text-sm font-semibold text-white
                                   bg-purple-600 hover:bg-purple-700 active:scale-[0.98]
                                   disabled:opacity-60 disabled:cursor-not-allowed
                                   transition-all shadow-sm">
                            <svg v-if="generating" class="w-4 h-4 animate-spin shrink-0" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <SparklesIcon v-else class="w-4 h-4" />
                            <span>{{ generating ? currentStage.text : `Generate ${totalSoal || ''} Soal` }}</span>
                        </button>

                        <Link :href="`/guru/soal/${soal.id}`" class="flex-1 inline-flex items-center justify-center gap-2
                                   rounded-xl px-6 py-3 text-sm font-semibold
                                   text-gray-700 dark:text-slate-300
                                   border border-gray-300 dark:border-slate-700
                                   hover:bg-gray-50 dark:hover:bg-slate-800
                                   active:scale-[0.98] transition-all">
                            <ArrowLeftIcon class="w-4 h-4" />
                            Batal
                        </Link>
                    </div>

                    <p class="text-xs text-gray-400 dark:text-slate-500 text-center">
                        Soal langsung ditambahkan ke daftar soal quiz ini setelah AI selesai. Anda tetap bisa
                        edit/hapus soal satu per satu setelahnya.
                    </p>
                </div>
            </div>
        </div>

        <!-- ── Modal Pilih Materi Referensi ──────────────────────────────── -->
        <div v-if="showMateriModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center
                   bg-black/40 backdrop-blur-sm px-0 sm:px-4" @click.self="closeMateriModal">
            <div class="w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl
                        bg-white dark:bg-slate-900
                        border border-gray-200 dark:border-slate-800
                        shadow-xl max-h-[85vh] flex flex-col">

                <!-- Modal header -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-800">
                    <div>
                        <h3 class="font-semibold text-gray-900 dark:text-slate-100">Pilih Materi Referensi</h3>
                        <p class="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                            {{ draftSelectedIds.length }} materi dipilih
                        </p>
                    </div>
                    <button type="button" @click="closeMateriModal"
                        class="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        <XMarkIcon class="w-5 h-5 text-gray-500 dark:text-slate-400" />
                    </button>
                </div>

                <!-- Modal body: checkbox list -->
                <div class="flex-1 overflow-y-auto px-5 py-3 space-y-1.5">
                    <p v-if="!materiList.length" class="text-sm text-gray-400 dark:text-slate-500 text-center py-8">
                        Belum ada materi. Buat materi terlebih dahulu untuk bisa dijadikan referensi.
                    </p>

                    <label v-for="m in materiList" :key="m.id" class="flex items-start gap-3 rounded-lg px-3 py-2.5 cursor-pointer
                               border transition-colors"
                        :class="draftSelectedIds.includes(m.id)
                            ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30'
                            : 'bg-white dark:bg-slate-900 border-transparent hover:bg-gray-50 dark:hover:bg-slate-800'">
                        <span class="mt-0.5 w-4.5 h-4.5 shrink-0 rounded flex items-center justify-center border"
                            :class="draftSelectedIds.includes(m.id)
                                ? 'bg-purple-600 border-purple-600'
                                : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600'">
                            <CheckIcon v-if="draftSelectedIds.includes(m.id)" class="w-3 h-3 text-white" />
                        </span>
                        <input type="checkbox" class="hidden" :checked="draftSelectedIds.includes(m.id)"
                            @change="toggleDraftMateri(m.id)" />
                        <span class="flex-1 min-w-0">
                            <span class="block text-sm font-medium text-gray-800 dark:text-slate-200 truncate">
                                {{ m.judul }}
                            </span>
                            <span class="block text-xs text-gray-400 dark:text-slate-500">
                                {{ m.mapel?.mapel ?? '-' }} · {{ m.kelas?.kelas ?? '-' }}
                            </span>
                        </span>
                    </label>
                </div>

                <!-- Modal footer -->
                <div class="flex gap-3 px-5 py-4 border-t border-gray-200 dark:border-slate-800">
                    <button type="button" @click="closeMateriModal" class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold
                                   text-gray-700 dark:text-slate-300
                                   border border-gray-300 dark:border-slate-700
                                   hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        Batal
                    </button>
                    <button type="button" @click="applyMateriSelection" class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white
                                   bg-purple-600 hover:bg-purple-700 transition-colors">
                        Terapkan ({{ draftSelectedIds.length }})
                    </button>
                </div>
            </div>
        </div>
    </MenuLayout>
</template>