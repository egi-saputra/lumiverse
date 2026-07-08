<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3';  // ← router, bukan Inertia
import { CheckIcon, ArrowLeftIcon, PlusIcon } from '@heroicons/vue/24/solid';
import Swal from 'sweetalert2';
import axios from 'axios';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps({ bankSoal: Object });

const form = ref({
    soal: props.bankSoal.soal,
    tipe_soal: props.bankSoal.tipe_soal,
    jawaban_benar: props.bankSoal.jawaban_benar ?? '',
    nilai: props.bankSoal.nilai,
    jenis_lampiran: props.bankSoal.jenis_lampiran,
    link_lampiran: props.bankSoal.link_lampiran,
    lampiran_file: null,
    opsi_a: props.bankSoal.opsi_a,
    opsi_b: props.bankSoal.opsi_b,
    opsi_c: props.bankSoal.opsi_c,
    opsi_d: props.bankSoal.opsi_d,
    opsi_e: props.bankSoal.opsi_e,
    opsi_a_lampiran: props.bankSoal.opsi_a_lampiran,
    opsi_b_lampiran: props.bankSoal.opsi_b_lampiran,
    opsi_c_lampiran: props.bankSoal.opsi_c_lampiran,
    opsi_d_lampiran: props.bankSoal.opsi_d_lampiran,
    opsi_e_lampiran: props.bankSoal.opsi_e_lampiran,
});

const isSubmitting = ref(false);
const existingFile = ref(props.bankSoal.link_lampiran || '');
const opsiFiles = ref({});
const opsiPreviews = ref({});
const removeFlags = ref({});

// ─── Opsi state ───────────────────────────────────────────────────────────────
const opsiState = ref([]);
['a', 'b', 'c', 'd', 'e'].forEach(k => {
    if (form.value['opsi_' + k]) opsiState.value.push(k);
});
if (!opsiState.value.length) opsiState.value.push('a');

const opsiLampiranUrls = ref({});
['a', 'b', 'c', 'd', 'e'].forEach(k => {
    opsiLampiranUrls.value[k] = props.bankSoal['opsi_' + k + '_lampiran_url'] ?? null;
});

function addOpsi() {
    if (opsiState.value.length < 5) {
        opsiState.value.push(String.fromCharCode(97 + opsiState.value.length));
    }
}

// ─── File helpers ─────────────────────────────────────────────────────────────
function handleFile(event) {
    form.value.lampiran_file = event.target.files[0] || null;
}

function handleOpsiFile(event, key) {
    const file = event.target.files[0];
    if (!file) return;
    if (opsiPreviews.value[key]) URL.revokeObjectURL(opsiPreviews.value[key]);
    opsiFiles.value[key] = file;
    opsiPreviews.value[key] = URL.createObjectURL(file);
    delete removeFlags.value[key];
}

function requestRemoveOpsiImg(key) {
    if (opsiPreviews.value[key]) {
        URL.revokeObjectURL(opsiPreviews.value[key]);
        delete opsiPreviews.value[key];
        delete opsiFiles.value[key];
    }
    removeFlags.value[key] = true;
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function submit() {
    const data = new FormData();

    const skipKeys = new Set([
        'lampiran_file',
        'opsi_a_lampiran', 'opsi_b_lampiran', 'opsi_c_lampiran',
        'opsi_d_lampiran', 'opsi_e_lampiran',
    ]);

    Object.keys(form.value).forEach(key => {
        if (skipKeys.has(key)) return;
        data.append(key, form.value[key] ?? '');
    });

    if (form.value.lampiran_file) data.append('lampiran_file', form.value.lampiran_file);
    if (existingFile.value) data.append('existing_file', existingFile.value);

    Object.entries(opsiFiles.value).forEach(([key, file]) => {
        data.append(`opsi_${key}_file`, file);
    });
    Object.keys(removeFlags.value).forEach(key => {
        data.append(`remove_opsi_${key}_lampiran`, '1');
    });

    isSubmitting.value = true;
    try {
        const res = await axios.post(`/proktor/bank-soal/${props.bankSoal.id}?_method=PUT`, data);
        await Swal.fire({
            icon: 'success', title: 'Berhasil!',
            text: res.data.success || 'Butir soal berhasil diperbarui!',
            confirmButtonText: 'OKE', confirmButtonColor: '#3b82f6',
        });
        router.visit(res.data.redirect || `/proktor/soal/${props.bankSoal.soal_id}`);
    } catch (err) {
        const errors = err.response?.data?.errors;
        const msg = errors
            ? Object.values(errors).flat().join('\n')
            : err.response?.data?.message || 'Terjadi kesalahan saat update.';
        Swal.fire({ icon: 'error', title: 'Gagal!', text: msg, confirmButtonColor: '#ef4444' });
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <MenuLayout>
        <div class="mx-auto sm:rounded-2xl sm:shadow-xl sm:p-8
                   bg-white dark:bg-white/5
                   border border-gray-200 dark:border-white/10">

            <h1 class="text-lg sm:text-2xl font-bold mb-6
                       text-gray-800 dark:text-gray-100">
                Edit Detail Soal
            </h1>

            <form @submit.prevent="submit" class="space-y-5">

                <!-- Soal -->
                <div>
                    <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                        Soal / Pertanyaan
                    </label>

                    <div class="relative rounded-xl overflow-hidden
                               border border-gray-300 dark:border-white/10
                               bg-white dark:bg-slate-900 shadow-sm">

                        <QuillEditor v-model:content="form.soal" content-type="html" theme="snow"
                            placeholder="Type the question here..." class="announcement-editor" :toolbar="[
                                ['bold', 'italic', 'underline'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ align: [] }],
                                ['clean']
                            ]" />

                        <div class="flex w-full justify-end border-t
                                   border-gray-300 dark:border-white/10">
                            <span class="w-full px-3 py-2 text-xs text-right
                                       text-gray-500 dark:text-gray-400">
                                Powered by
                                <strong class="pl-1 tracking-widest
                                           text-gray-700 dark:text-gray-200">
                                    Lumiverse
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Tipe Soal, Nilai, Lampiran -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Tipe Soal
                        </label>
                        <select v-model="form.tipe_soal"
                            class="form-input w-full p-3 rounded-lg border transition border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                            <option value="PG">Pilihan Ganda</option>
                            <option value="Essay">Essay</option>
                        </select>
                    </div>

                    <div>
                        <label class="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Bobot Nilai
                        </label>
                        <input type="number" min="0" v-model="form.nilai" placeholder="Nilai soal"
                            class="form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" />
                    </div>

                    <div>
                        <label class="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Jenis Lampiran
                        </label>
                        <select v-model="form.jenis_lampiran"
                            class="form-input w-full p-3 rounded-lg border transition border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                            <option value="Tanpa Lampiran">Tanpa Lampiran</option>
                            <option value="Gambar">Gambar</option>
                        </select>
                    </div>
                </div>

                <!-- UPLOAD GAMBAR -->
                <div v-if="form.jenis_lampiran === 'Gambar'">
                    <label class="block font-semibold mb-1 text-gray-700 dark:text-slate-200">
                        Upload Gambar
                    </label>
                    <input type="file" @change="handleFile"
                        class="w-full p-2 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" />
                    <p v-if="form.lampiran_file" class="mt-1 text-green-600 dark:text-green-400">
                        {{ form.lampiran_file.name }}
                    </p>
                </div>

                <!-- Opsi PG -->
                <div v-if="form.tipe_soal === 'PG'" class="space-y-4">
                    <div v-for="key in opsiState" :key="key" class="space-y-2">
                        <label class="font-semibold text-gray-700 dark:text-gray-300">
                            Opsi {{ key.toUpperCase() }}
                        </label>

                        <!-- Teks opsi -->
                        <input v-model="form['opsi_' + key]" class="form-input w-full p-3 rounded-lg border
                   border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" />

                        <!-- Gambar lama (jika ada dan belum di-remove) -->
                        <div v-if="opsiLampiranUrls[key] && !removeFlags[key]" class="flex items-center gap-3">
                            <img :src="opsiLampiranUrls[key]"
                                class="h-16 rounded-lg object-cover border border-gray-200 dark:border-slate-700" />
                            <button type="button" @click="requestRemoveOpsiImg(key)"
                                class="text-xs text-red-500 hover:text-red-700 font-medium">
                                🗑 Hapus gambar
                            </button>
                        </div>

                        <!-- Upload gambar baru -->
                        <div class="flex items-center gap-2">
                            <label :for="`opsi_${key}_file`" class="cursor-pointer text-xs px-3 py-1.5 rounded-lg border
                       border-gray-300 dark:border-slate-600
                       bg-gray-50 dark:bg-slate-800
                       text-gray-600 dark:text-slate-300
                       hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                                📷 {{ form['opsi_' + key + '_lampiran'] && !removeFlags[key] ? 'Ganti Gambar' : 'Tambah Gambar' }}
                            </label>
                            <input :id="`opsi_${key}_file`" type="file" accept="image/*"
                                @change="handleOpsiFile($event, key)" class="hidden" />

                            <span v-if="opsiFiles[key]"
                                class="text-xs text-green-600 dark:text-green-400 truncate max-w-[140px]">
                                {{ opsiFiles[key].name }}
                            </span>
                        </div>

                        <!-- Preview gambar baru -->
                        <img v-if="opsiPreviews[key]" :src="opsiPreviews[key]"
                            class="h-20 rounded-lg object-cover border border-gray-200 dark:border-slate-700" />
                    </div>

                    <button v-if="opsiState.length < 5" type="button" @click="addOpsi"
                        class="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                        <PlusIcon class="w-4 h-4" /> Tambah
                    </button>
                </div>

                <!-- Jawaban Benar -->
                <div>
                    <label class="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                        Jawaban Benar
                    </label>

                    <input v-if="form.tipe_soal === 'Essay'" v-model="form.jawaban_benar" type="text"
                        placeholder="Jawaban Essay"
                        class="form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" />

                    <select v-else v-model="form.jawaban_benar"
                        class="form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                        <option v-for="key in opsiState" :key="key" :value="'opsi_' + key">
                            {{ key.toUpperCase() }}. {{ form['opsi_' + key] }}
                        </option>
                    </select>
                </div>

                <!-- Tombol -->
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <button type="submit" :disabled="isSubmitting" class="btn-primary">
                        <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <CheckIcon v-else class="w-5 h-5" />
                        <span>{{ isSubmitting ? 'Updating process...' : 'Update' }}</span>
                    </button>

                    <Link :href="`/proktor/soal/${props.bankSoal.soal_id}`" class="btn-secondary">
                        <ArrowLeftIcon class="w-5 h-5" /> Cancel
                    </Link>
                </div>

            </form>
        </div>
    </MenuLayout>
</template>
