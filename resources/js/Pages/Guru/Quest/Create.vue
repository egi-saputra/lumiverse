<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { ref, computed } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import {
    CheckIcon,
    ArrowLeftIcon,
    DocumentArrowUpIcon,
    PlusIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
} from '@heroicons/vue/24/solid';
import axios from 'axios';
import Swal from 'sweetalert2';
import MateriContent from '@/Components/MateriContent.vue';

const props = defineProps({ soal_id: [Number, String] });

// ─── Form state ───────────────────────────────────────────────────────────────
const form = ref({
    soal_id: Number(props.soal_id),
    soal: '',
    tipe_soal: 'PG',
    jenis_lampiran: 'Tanpa Lampiran',
    lampiran_file: null,
    opsi_a: '',
    opsi_b: '',
    opsi_c: '',
    opsi_d: '',
    opsi_e: '',
    jawaban_benar: '',
    nilai: 0,
    excel: null,
});

const isSubmitting = ref(false);
const isImporting = ref(false);
const opsiState = ref(['a']);
const fileInputRef = ref(null);
const opsiFiles = ref({});
const opsiPreviews = ref({});

// Tab Edit/Preview untuk field pertanyaan (Markdown + LaTeX + kode)
const soalTab = ref('edit'); // 'edit' | 'preview'

// ─── Opsi helpers ─────────────────────────────────────────────────────────────
function addOpsi() {
    if (opsiState.value.length < 5) {
        opsiState.value.push(String.fromCharCode(97 + opsiState.value.length));
    }
}

function removeOpsi() {
    if (opsiState.value.length > 1) {
        const lastKey = opsiState.value.pop();
        form.value['opsi_' + lastKey] = '';
        // Bersihkan file & preview opsi yang dihapus
        if (opsiPreviews.value[lastKey]) URL.revokeObjectURL(opsiPreviews.value[lastKey]);
        delete opsiFiles.value[lastKey];
        delete opsiPreviews.value[lastKey];
    }
}

// ─── File lampiran ────────────────────────────────────────────────────────────
function handleFile(event) {
    form.value.lampiran_file = event.target.files[0] || null;
}

function handleOpsiFile(event, key) {
    const file = event.target.files[0];
    if (!file) return;
    if (opsiPreviews.value[key]) URL.revokeObjectURL(opsiPreviews.value[key]);
    opsiFiles.value[key] = file;
    opsiPreviews.value[key] = URL.createObjectURL(file);
}

// ─── Submit soal manual ───────────────────────────────────────────────────────
async function submitManual() {
    if (form.value.jenis_lampiran === 'Gambar' && !form.value.lampiran_file) {
        return Swal.fire({
            icon: 'warning',
            title: 'No image selected',
            text: 'Please upload an image file first!',
            confirmButtonColor: '#3b82f6',
        });
    }

    const data = new FormData();
    Object.entries(form.value).forEach(([key, val]) => {
        if (key === 'lampiran_file') {
            if (form.value.jenis_lampiran === 'Gambar' && val) data.append(key, val);
        } else if (key !== 'excel') {
            data.append(key, val ?? '');
        }
    });

    // Lampirkan gambar opsi
    Object.entries(opsiFiles.value).forEach(([key, file]) => {
        data.append(`opsi_${key}_file`, file);
    });

    isSubmitting.value = true;
    try {
        const res = await axios.post('/guru/bank-soal', data);
        await Swal.fire({
            icon: 'success', title: 'Success!',
            text: res.data.success || 'Question successfully added.',
            confirmButtonText: 'OK', confirmButtonColor: '#3b82f6',
        });
        router.visit(res.data.redirect || `/guru/soal/${props.soal_id}`);
    } catch (err) {
        const msg = err.response?.data?.errors
            ? Object.values(err.response.data.errors).flat().join('\n')
            : err.response?.data?.message || 'An error occurred while saving the question.';
        Swal.fire({ icon: 'error', title: 'Failed', text: msg, confirmButtonColor: '#ef4444' });
    } finally {
        isSubmitting.value = false;
    }
}

// ─── Import Excel ─────────────────────────────────────────────────────────────
function importExcel(event) {
    form.value.excel = event.target.files[0] || null;
}

async function submitExcel() {
    if (!form.value.excel) return;

    const data = new FormData();
    data.append('excel', form.value.excel);
    data.append('soal_id', props.soal_id);

    isImporting.value = true;

    try {
        const res = await axios.post('/guru/bank-soal/import', data);

        await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: res.data.success,
            confirmButtonText: 'OK',
            confirmButtonColor: '#3b82f6',
        });

        router.visit(res.data.redirect || `/guru/soal/${props.soal_id}`);
    } catch (err) {
        const msg = err.response?.data?.message || 'An error occurred while importing.';
        Swal.fire({
            icon: 'error',
            title: 'Import Failed',
            text: msg,
            confirmButtonColor: '#ef4444',
        });
    } finally {
        isImporting.value = false;
    }
}

function clearExcel() {
    form.value.excel = null;
    if (fileInputRef.value) fileInputRef.value.value = '';
}

function downloadTemplate() {
    window.location.href = '/guru/bank-soal/template';
}

const isManualDisabled = computed(() => !!form.value.excel);
</script>

<template>
    <MenuLayout>
        <div class="min-h-screen bg-gray-50 dark:bg-slate-950">

            <div
                class="sm:rounded-2xl sm:border sm:border-gray-200 sm:bg-white sm:shadow-sm sm:dark:border-slate-800 sm:dark:bg-slate-900 overflow-hidden">

                <!-- ── Header card ─────────────────────────────────── -->
                <div class="border-b border-gray-200 dark:border-slate-800 sm:px-6 sm:py-5 sm:pb-0 pb-5">
                    <h1 class="text-xl font-semibold text-gray-900 dark:text-slate-100">
                        Add Quiz Question
                    </h1>
                    <p class="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        Fill in the form below or import from an Excel file.
                    </p>
                </div>

                <div class="sm:px-6 py-6 space-y-6">

                    <!-- ── Import Excel ────────────────────────────── -->
                    <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50
                                    dark:border-slate-700 dark:bg-slate-800/50 p-5">
                        <div class="flex flex-col items-center gap-3">
                            <div class="rounded-full bg-blue-50 dark:bg-blue-500/10 p-3">
                                <DocumentArrowUpIcon class="w-7 h-7 text-blue-500" />
                            </div>
                            <div class="text-center">
                                <p class="font-medium text-gray-700 dark:text-slate-200">
                                    Import Questions from Excel
                                </p>
                                <p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                                    Format: .xlsx / .xls
                                </p>
                            </div>

                            <label class="cursor-pointer inline-flex items-center gap-2 rounded-lg
                                              border border-gray-300 dark:border-slate-600
                                              bg-white dark:bg-slate-700
                                              px-4 py-2 text-sm font-medium
                                              text-gray-700 dark:text-slate-200
                                              hover:bg-gray-50 dark:hover:bg-slate-600
                                              transition-colors">
                                Choose File
                                <input ref="fileInputRef" type="file" accept=".xlsx,.xls" @change="importExcel"
                                    class="hidden" />
                            </label>

                            <!-- File terpilih -->
                            <div v-if="form.excel" class="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-500/10
                                            border border-green-200 dark:border-green-500/20
                                            px-3 py-2 text-sm text-green-700 dark:text-green-400">
                                <span class="truncate max-w-[220px]">{{ form.excel.name }}</span>
                                <button type="button" @click="clearExcel"
                                    class="ml-1 rounded-full hover:bg-green-100 dark:hover:bg-green-500/20 p-0.5 transition">
                                    <XMarkIcon class="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div class="flex justify-center gap-3 mt-4">
                            <button type="button" @click="submitExcel" :disabled="!form.excel || isImporting" class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold
                                           text-white transition-colors
                                           disabled:opacity-50 disabled:cursor-not-allowed
                                           bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600">
                                <svg v-if="isImporting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                {{ isImporting ? 'Importing...' : 'Import Excel' }}
                            </button>

                            <button type="button" @click="downloadTemplate" class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold
                                           text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                                <ArrowDownTrayIcon class="w-4 h-4" />
                                Download Template
                            </button>
                        </div>
                    </div>

                    <!-- ── Divider ──────────────────────────────────── -->
                    <div class="relative flex items-center gap-3">
                        <div class="flex-1 border-t border-gray-200 dark:border-slate-700" />
                        <span class="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                            or fill manually
                        </span>
                        <div class="flex-1 border-t border-gray-200 dark:border-slate-700" />
                    </div>

                    <!-- ── Form Manual ─────────────────────────────── -->
                    <form @submit.prevent="submitManual" class="space-y-5"
                        :class="{ 'opacity-50 pointer-events-none': isManualDisabled }">

                        <div class="grid sm:grid-cols-2 gap-4">
                            <!-- Question Type -->
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Question Type <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.tipe_soal" class="w-full rounded-lg border border-gray-300
                                                   bg-white dark:bg-slate-800
                                                   dark:border-slate-700 dark:text-slate-100
                                                   px-3 py-2.5 text-sm
                                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                                   transition">
                                    <option value="PG">Multiple Choice</option>
                                    <option value="Essay">Essay</option>
                                </select>
                            </div>

                            <!-- Attachment Type -->
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Attachment
                                </label>
                                <select v-model="form.jenis_lampiran" class="w-full rounded-lg border border-gray-300
                                                   bg-white dark:bg-slate-800
                                                   dark:border-slate-700 dark:text-slate-100
                                                   px-3 py-2.5 text-sm
                                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                                   transition">
                                    <option value="Tanpa Lampiran">No Attachment</option>
                                    <option value="Gambar">Image</option>
                                </select>
                            </div>
                        </div>

                        <!-- Upload Image -->
                        <div v-if="form.jenis_lampiran === 'Gambar'" class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                Upload Image
                            </label>
                            <input type="file" accept="image/*" @change="handleFile" class="w-full rounded-lg border border-gray-300
                                           dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200
                                           px-3 py-2 text-sm file:mr-3 file:rounded file:border-0
                                           file:bg-blue-50 file:text-blue-700 file:text-xs file:font-medium
                                           dark:file:bg-blue-500/10 dark:file:text-blue-400
                                           transition" />
                            <p v-if="form.lampiran_file" class="text-xs text-green-600 dark:text-green-400">
                                ✓ {{ form.lampiran_file.name }}
                            </p>
                        </div>

                        <!-- Question (Markdown + LaTeX + kode, dengan tab Edit/Preview) -->
                        <div class="space-y-1.5">
                            <div class="flex items-center justify-between mb-1">
                                <label class="font-medium text-gray-700 dark:text-slate-300">
                                    Question <span class="text-red-500">*</span>
                                </label>

                                <div
                                    class="inline-flex rounded-lg border border-gray-300 dark:border-slate-600 p-0.5 bg-gray-50 dark:bg-slate-900">
                                    <button type="button" @click="soalTab = 'edit'" :class="[
                                        'px-3 py-1 text-xs font-semibold rounded-md transition-colors',
                                        soalTab === 'edit'
                                            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    ]">
                                        ✏️ Edit
                                    </button>
                                    <button type="button" @click="soalTab = 'preview'" :class="[
                                        'px-3 py-1 text-xs font-semibold rounded-md transition-colors',
                                        soalTab === 'preview'
                                            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    ]">
                                        👁️ Preview
                                    </button>
                                </div>
                            </div>

                            <textarea v-show="soalTab === 'edit'" v-model="form.soal" required rows="5" class="w-full rounded-lg border border-gray-300 font-mono
                                       dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100
                                       px-3 py-2.5 text-sm resize-y
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Tulis pertanyaan di sini. Mendukung Markdown, LaTeX ($x^2$ atau $$...$$), dan blok kode (```python ... ```)."></textarea>

                            <div v-show="soalTab === 'preview'"
                                class="w-full min-h-[120px] border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 bg-white dark:bg-slate-800">
                                <MateriContent v-if="form.soal" :content="form.soal" />
                                <p v-else class="text-sm text-gray-400 italic">Belum ada konten untuk di-preview.</p>
                            </div>

                            <p class="text-xs text-gray-500 dark:text-slate-400">
                                Mendukung Markdown dasar, LaTeX untuk rumus matematika, dan blok kode.
                            </p>
                        </div>

                        <!-- Answer Options (PG) -->
                        <div v-if="form.tipe_soal === 'PG'" class="space-y-3">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Answer Options
                                </label>
                                <div class="flex gap-2">
                                    <button v-if="opsiState.length > 1" type="button" @click="removeOpsi" class="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs
                       font-medium text-red-600 dark:text-red-400
                       border border-red-200 dark:border-red-500/30
                       hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                                        <XMarkIcon class="w-3 h-3" /> Remove
                                    </button>
                                    <button v-if="opsiState.length < 5" type="button" @click="addOpsi" class="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs
                       font-medium text-blue-600 dark:text-blue-400
                       border border-blue-200 dark:border-blue-500/30
                       hover:bg-blue-50 dark:hover:bg-blue-500/10 transition">
                                        <PlusIcon class="w-3 h-3" /> Add
                                    </button>
                                </div>
                            </div>

                            <div class="grid md:grid-cols-2 gap-3">
                                <div v-for="key in opsiState" :key="key" class="space-y-2">
                                    <label
                                        class="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                                        Option {{ key.toUpperCase() }}
                                    </label>

                                    <!-- Teks opsi -->
                                    <input v-model="form['opsi_' + key]"
                                        :placeholder="`Enter option ${key.toUpperCase()}`"
                                        class="w-full rounded-lg border border-gray-300  dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 dark:placeholder-slate-500" />

                                    <!-- Upload gambar opsi -->
                                    <div class="flex items-center gap-2">
                                        <label :for="`opsi_${key}_file`"
                                            class="cursor-pointer inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition">
                                            📷 Image (optional)
                                        </label>
                                        <input :id="`opsi_${key}_file`" type="file" accept="image/*"
                                            @change="handleOpsiFile($event, key)" class="hidden" />
                                        <span v-if="opsiFiles[key]"
                                            class="text-xs text-green-600 dark:text-green-400 truncate max-w-[120px]">
                                            {{ opsiFiles[key].name }}
                                        </span>
                                    </div>

                                    <!-- Preview thumbnail -->
                                    <img v-if="opsiPreviews[key]" :src="opsiPreviews[key]"
                                        class="h-20 rounded-lg object-cover border border-gray-200 dark:border-slate-700" />
                                </div>
                            </div>
                        </div>

                        <!-- Correct Answer + Score -->
                        <div class="grid sm:grid-cols-2 gap-4">
                            <!-- Correct Answer -->
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Correct Answer
                                </label>
                                <textarea v-if="form.tipe_soal === 'Essay'" v-model="form.jawaban_benar" rows="3"
                                    placeholder="Essay answer key" class="w-full rounded-lg border border-gray-300
                                               dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100
                                               px-3 py-2.5 text-sm resize-none
                                               focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                                <select v-else v-model="form.jawaban_benar" class="w-full rounded-lg border border-gray-300
                                               bg-white dark:bg-slate-800
                                               dark:border-slate-700 dark:text-slate-100
                                               px-3 py-2.5 text-sm
                                               focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                                    <option value="">-- Select correct answer --</option>
                                    <option v-for="key in opsiState" :key="key" :value="'opsi_' + key">
                                        {{ key.toUpperCase() }}. {{ form['opsi_' + key] || '(empty)' }}
                                    </option>
                                </select>
                            </div>

                            <!-- Score -->
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Score Weight <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.nilai" type="number" min="0" placeholder="0" class="w-full rounded-lg border border-gray-300
                                               dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100
                                               px-3 py-2.5 text-sm
                                               focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                            </div>
                        </div>

                        <!-- Action buttons -->
                        <div class="flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="submit" :disabled="isSubmitting" class="flex-1 inline-flex items-center justify-center gap-2
                                           rounded-xl px-6 py-3 text-sm font-semibold text-white
                                           bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
                                           disabled:opacity-60 disabled:cursor-not-allowed
                                           transition-all shadow-sm">
                                <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                <CheckIcon v-else class="w-4 h-4" />
                                {{ isSubmitting ? 'Saving...' : 'Create Question' }}
                            </button>

                            <Link :href="`/guru/soal/${props.soal_id}`" class="flex-1 inline-flex items-center justify-center gap-2
                                           rounded-xl px-6 py-3 text-sm font-semibold
                                           text-gray-700 dark:text-slate-300
                                           border border-gray-300 dark:border-slate-700
                                           hover:bg-gray-50 dark:hover:bg-slate-800
                                           active:scale-[0.98] transition-all">
                                <ArrowLeftIcon class="w-4 h-4" />
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </MenuLayout>
</template>