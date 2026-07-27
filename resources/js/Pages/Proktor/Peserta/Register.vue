<script setup>
import { ref, computed, nextTick } from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import MenuLayout from '@/Layouts/MenuLayout.vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import { route } from 'ziggy-js'
import { DocumentArrowUpIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const page = usePage();

const isSmk = computed(() =>
    (page.props.tenant?.school_level ?? '').toString().toLowerCase() === 'smk'
);

// null = kuota tidak dibatasi (kalau controller mengirim remainingSlots)
const remainingSlots = computed(() => page.props.remainingSlots ?? null);

// Ambil daftar kelas & kejuruan dari page props (dari controller)
const kelasAll = ref([...page.props.kelasList]);
const kejuruanList = ref([...page.props.kejuruanList || []]);

// ─────────────────────────────────────────────────────────────────────────
// FORM MANUAL — BULK (pilih kelas & kejuruan dulu, baru input nama+email)
// ─────────────────────────────────────────────────────────────────────────
const selectedKelas = ref('');
const selectedKejuruan = ref('');
const selectionConfirmed = ref(false);

const canContinue = computed(() => {
    if (!selectedKelas.value) return false;
    if (isSmk.value && !selectedKejuruan.value) return false;
    return true;
});

const confirmSelection = () => {
    if (!canContinue.value) return;
    selectionConfirmed.value = true;
};

const changeSelection = () => {
    selectionConfirmed.value = false;
};

const selectedKelasLabel = computed(() =>
    kelasAll.value.find(k => k.id === selectedKelas.value)?.kelas ?? ''
);
const selectedKejuruanLabel = computed(() =>
    kejuruanList.value.find(k => k.id === selectedKejuruan.value)?.kejuruan ?? ''
);

const rows = ref([
    { nama_lengkap: '', email: '' },
]);

const namaRefs = ref([]);
const emailRefs = ref([]);

const setRef = (refsArray, el, index) => {
    if (el) refsArray[index] = el;
};

const quotaReached = computed(() => {
    if (remainingSlots.value === null) return false;
    return rows.value.length >= remainingSlots.value;
});

const addRowIfPossible = async (field, index) => {
    if (index !== rows.value.length - 1) return;
    if (!rows.value[index][field].trim()) return;
    if (quotaReached.value) return;

    rows.value.push({ nama_lengkap: '', email: '' });
    await nextTick();

    const targetRefs = field === 'nama_lengkap' ? namaRefs : emailRefs;
    targetRefs.value[rows.value.length - 1]?.focus();
};

const focusNext = async (field, index) => {
    if (index === rows.value.length - 1) {
        await addRowIfPossible(field, index);
        return;
    }
    const targetRefs = field === 'nama_lengkap' ? namaRefs : emailRefs;
    targetRefs.value[index + 1]?.focus();
};

const removeRow = (index) => {
    if (rows.value.length === 1) {
        rows.value[0] = { nama_lengkap: '', email: '' };
        return;
    }
    rows.value.splice(index, 1);
    namaRefs.value.splice(index, 1);
    emailRefs.value.splice(index, 1);
};

const manualProcessing = ref(false);
const manualErrors = ref({});

// Submit manual peserta (bulk)
const submitManual = async () => {
    const items = rows.value
        .filter(r => r.nama_lengkap.trim() || r.email.trim())
        .map(r => ({
            nama_lengkap: r.nama_lengkap.trim(),
            email: r.email.trim(),
        }));

    if (items.length === 0) return;

    manualProcessing.value = true;
    manualErrors.value = {};

    try {
        const res = await axios.post(route('proktor.peserta.register.store'), {
            kelas_id: selectedKelas.value,
            kejuruan_id: isSmk.value ? selectedKejuruan.value : '',
            items,
        });

        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: res.data.success || 'Peserta berhasil didaftarkan.',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
        });

        // Reset baris, tapi tetap di kelas yang sama supaya bisa lanjut input batch berikutnya
        rows.value = [{ nama_lengkap: '', email: '' }];
    } catch (err) {
        if (err.response?.status === 422 && err.response?.data?.errors) {
            manualErrors.value = err.response.data.errors;
        }

        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: err.response?.data?.message || err.response?.data?.error || 'Gagal submit peserta.',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
        });
    } finally {
        manualProcessing.value = false;
    }
};

const errorFor = (index, field) => {
    return manualErrors.value?.[`items.${index}.${field}`]?.[0] ?? null;
};

// ─────────────────────────────────────────────────────────────────────────
// FORM IMPORT EXCEL — styling TIDAK diubah, hanya fix logic spinner
// ─────────────────────────────────────────────────────────────────────────
const form = useFormStub();

// Stub kecil supaya variabel `form` dari kode lama (excel, processing) tetap ada
// tanpa mengubah struktur/markup section import.
function useFormStub() {
    return ref({ excel: null, processing: false }).value;
}

const fileInput = ref(null);

// Tangani file change
const handleFileChange = (e) => {
    form.excel = e.target.files[0] || null;
};

// Nama file untuk tampilan
const fileName = computed(() => form.excel?.name || '');

// Status processing
const isProcessing = computed(() => form.processing);

// Import Excel — sebelumnya form.processing di-set false tepat setelah
// router.post() dipanggil (tidak menunggu request selesai), jadi spinner
// tidak sempat kelihatan. Sekarang pakai onStart/onFinish dari Inertia.
const submitExcel = () => {
    if (!form.excel) {
        return Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Pilih file Excel terlebih dahulu!',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
        });
    }

    const data = new FormData();
    data.append('excel', form.excel);

    router.post(route('proktor.peserta.import'), data, {
        forceFormData: true,
        onStart: () => {
            form.processing = true;
        },
        onFinish: () => {
            form.processing = false;
        },
    });
};

// Download template tanpa buka tab baru
const downloadTemplate = async () => {
    try {
        const res = await axios.get(route('proktor.peserta.template'), { responseType: 'blob' });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'template_peserta.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Gagal download template', 'error');
    }
};
</script>

<template>
    <MenuLayout>
        <div class="sm:px-6 mx-auto">
            <h1 class="sm:text-3xl text-xl font-bold dark:text-white text-[#063970] mb-8">Form Register Peserta Didik
            </h1>

            <!-- ══════════════════════════════════════════════════════════ -->
            <!-- FORM MANUAL — BULK -->
            <!-- ══════════════════════════════════════════════════════════ -->
            <div
                class="bg-white dark:bg-white/5 dark:border-gray-700 shadow-sm border border-gray-300 rounded-lg p-6 mb-8">
                <h2 class="sm:text-xl text-lg font-semibold dark:text-gray-200 text-gray-700 mb-4">Daftarkan Peserta
                    Didik</h2>

                <p v-if="remainingSlots !== null" class="text-sm mb-4"
                    :class="remainingSlots === 0 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'">
                    Sisa kuota akun: <span class="font-semibold">{{ remainingSlots }}</span>
                </p>

                <!-- STEP 1: PILIH KELAS & KEJURUAN -->
                <div v-if="!selectionConfirmed" class="space-y-4">
                    <div class="flex flex-wrap gap-4">
                        <div class="sm:flex-1 sm:min-w-[45%] w-full">
                            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Kelas</label>
                            <select v-model="selectedKelas"
                                class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition">
                                <option value="">-- Pilih Kelas --</option>
                                <option v-for="k in kelasAll" :key="k.id" :value="k.id">{{ k.kelas }}</option>
                            </select>
                        </div>

                        <div v-if="isSmk" class="sm:flex-1 sm:min-w-[45%] w-full">
                            <label
                                class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Kejuruan</label>
                            <select v-model="selectedKejuruan"
                                class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition">
                                <option value="">-- Pilih Kejuruan --</option>
                                <option v-for="kj in kejuruanList" :key="kj.id" :value="kj.id">{{ kj.kejuruan }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <p class="text-xs text-gray-400 dark:text-gray-500">
                        Semua peserta yang ditambahkan pada sesi ini akan masuk ke kelas{{ isSmk ? ' & kejuruan' : '' }}
                        yang sama.
                    </p>

                    <div class="flex justify-end">
                        <button type="button" @click="confirmSelection" :disabled="!canContinue"
                            class="bg-[#063970] text-white px-6 py-3 rounded-lg transition font-semibold shadow-md hover:bg-[#052d5a] disabled:opacity-50 disabled:cursor-not-allowed">
                            Lanjutkan
                        </button>
                    </div>
                </div>

                <!-- STEP 2: BULK INPUT NAMA & EMAIL -->
                <form v-else @submit.prevent="submitManual" class="space-y-4">

                    <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-900/40 rounded-lg px-4 py-2">
                        <span class="text-sm text-gray-700 dark:text-gray-300">
                            Kelas: <span class="font-semibold">{{ selectedKelasLabel }}</span>
                            <span v-if="isSmk"> · Kejuruan: <span class="font-semibold">{{ selectedKejuruanLabel
                            }}</span></span>
                        </span>
                        <button type="button" @click="changeSelection" :disabled="manualProcessing"
                            class="text-sm text-[#063970] dark:text-blue-300 hover:underline disabled:opacity-50">
                            Ganti kelas
                        </button>
                    </div>

                    <!-- Info password default -->
                    <div
                        class="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                        <InformationCircleIcon class="w-5 h-5 shrink-0 mt-0.5" />
                        <span>
                            Password semua peserta otomatis di-set ke <code
                                class="font-mono font-semibold">"password"</code>.
                            Sampaikan ke peserta agar mengganti password setelah login pertama kali.
                        </span>
                    </div>

                    <p class="text-sm text-gray-500 dark:text-gray-400">Tekan Enter untuk menambah baris baru</p>

                    <!-- Header kolom -->
                    <div class="hidden sm:flex gap-3 px-1">
                        <div class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</div>
                        <div class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</div>
                        <div class="w-9"></div>
                    </div>

                    <div v-for="(row, index) in rows" :key="index" class="flex flex-col sm:flex-row gap-2 sm:gap-3">

                        <!-- Nama Lengkap -->
                        <div class="flex-1">
                            <input :ref="el => setRef(namaRefs, el, index)" v-model="row.nama_lengkap" type="text"
                                placeholder="Nama Lengkap" :disabled="manualProcessing"
                                @keydown.enter.prevent="focusNext('nama_lengkap', index)"
                                class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition disabled:opacity-60" />
                            <p v-if="errorFor(index, 'nama_lengkap')" class="text-xs text-red-600 mt-1">
                                {{ errorFor(index, 'nama_lengkap') }}
                            </p>
                        </div>

                        <!-- Email -->
                        <div class="flex-1">
                            <input :ref="el => setRef(emailRefs, el, index)" v-model="row.email" type="email"
                                placeholder="Email Address" :disabled="manualProcessing"
                                @keydown.enter.prevent="focusNext('email', index)"
                                class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition disabled:opacity-60" />
                            <p v-if="errorFor(index, 'email')" class="text-xs text-red-600 mt-1">
                                {{ errorFor(index, 'email') }}
                            </p>
                        </div>

                        <!-- Tombol Hapus -->
                        <button type="button" @click="removeRow(index)" :disabled="manualProcessing"
                            class="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition shrink-0 self-center disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Hapus baris">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <p v-if="quotaReached" class="text-sm text-amber-600 dark:text-amber-400">
                        Jumlah baris sudah mencapai sisa kuota ({{ remainingSlots }}). Hapus baris lain untuk menambah
                        baris baru.
                    </p>

                    <!-- Tombol submit full width -->
                    <div class="w-full mt-2">
                        <button type="submit" :disabled="manualProcessing"
                            class="bg-[#063970] text-white px-6 py-3 rounded-lg transition font-semibold shadow-md hover:bg-[#052d5a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full">
                            <svg v-if="manualProcessing" class="w-5 h-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                                </path>
                            </svg>
                            <span>{{ manualProcessing ? 'Processing...' : 'Daftarkan Semua' }}</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- ══════════════════════════════════════════════════════════ -->
            <!-- FORM IMPORT EXCEL — TIDAK DIUBAH, hanya fix spinner -->
            <!-- ══════════════════════════════════════════════════════════ -->
            <div
                class="border border-gray-300 dark:border-gray-700 p-6 rounded-lg dark:bg-white/5 bg-white text-center space-y-4">
                <h2 class="text-xl font-semibold dark:text-white text-gray-700 mb-2">Import Peserta dari Excel</h2>

                <label
                    class="flex flex-col items-center border-dashed justify-center cursor-pointer border dark:border-gray-700 border-gray-300 max-w-2xl mx-auto rounded-lg p-4 bg-white dark:bg-white/5 dark:hover:bg-gray-900 hover:bg-gray-100 transition">
                    <DocumentArrowUpIcon class="w-10 h-10 text-blue-500 mb-2" />
                    <span class="text-gray-600 dark:text-gray-400 font-semibold mb-1">Upload File Peserta</span>
                    <span class="text-gray-400 text-sm">(.xlsx / .xls)</span>
                    <input type="file" ref="fileInput" @change="handleFileChange" accept=".xls,.xlsx" class="hidden" />
                </label>

                <p v-if="fileName" class="text-red-600 font-extrabold">{{ fileName }}</p>

                <div class="flex flex-col md:flex-row justify-center gap-3 mt-2">
                    <button type="button" @click="submitExcel" :class="[
                        'px-4 py-2 rounded text-white font-medium flex items-center justify-center gap-2 transition cursor-pointer',
                        isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#063970] hover:bg-gray-800'
                    ]" :disabled="!fileName || isProcessing">
                        <svg v-if="isProcessing" class="w-5 h-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span>{{ isProcessing ? 'Importing...' : 'Import File' }}</span>
                    </button>

                    <button type="button" @click="downloadTemplate"
                        class="px-4 py-2 text-[#063970] border border-[#063970] font-semibold rounded dark:text-white dark:border-gray-400 hover:bg-gray-100 dark:hover:text-gray-800 transition">
                        Download
                    </button>
                </div>

                <p class="text-gray-500 mt-2 text-sm">Pastikan format Excel sesuai template.</p>
            </div>
        </div>
    </MenuLayout>
</template>