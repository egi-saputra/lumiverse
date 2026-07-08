<script setup>
import { ref, computed, watch } from 'vue';
import { useForm, usePage, router } from '@inertiajs/vue3';
import MenuLayout from '@/Layouts/MenuLayout.vue';
// import { useAlert } from '@/Composables/useAlert.js';
import Swal from 'sweetalert2';
import axios from 'axios';
import { route } from 'ziggy-js'
import { DocumentArrowUpIcon } from '@heroicons/vue/24/solid';

// Form manual & import
const form = useForm({
    nama_lengkap: '',
    email: '',
    password: '',
    kelas_id: '',
    kejuruan_id: '',
    excel: null,
    processing: false
});

const fileInput = ref(null);
const page = usePage();

const isSmk = computed(() =>
    (page.props.tenant?.school_level ?? '').toString().toLowerCase() === 'smk'
);

// Ambil daftar kelas
const kelasAll = ref([...page.props.kelasList]);

// Ambil daftar kejuruan dari page props (dari controller)
const kejuruanList = ref([...page.props.kejuruanList || []]);

// Submit manual peserta
const submitManual = async () => {
    form.processing = true;

    try {
        // const res = await axios.post(route('proktor.peserta.register.store'), form);
        const res = await axios.post(route('proktor.peserta.register.store'), {
            nama_lengkap: form.nama_lengkap,
            email: form.email,
            password: form.password,
            kelas_id: form.kelas_id,
            kejuruan_id: form.kejuruan_id,
        });

        // Panggil SweetAlert langsung dari response JSON
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: res.data.success || 'Peserta berhasil didaftarkan.',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
        });

        form.reset();
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: err.response?.data?.error || 'Gagal submit peserta.',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
        });
    } finally {
        form.processing = false;
    }
};

// Tangani file change
const handleFileChange = (e) => {
    form.excel = e.target.files[0] || null;
};

// Nama file untuk tampilan
const fileName = computed(() => form.excel?.name || '');

// Status processing
const isProcessing = computed(() => form.processing);

// Import Excel
const submitExcel = async () => {
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

    form.processing = true;

    router.post(route('proktor.peserta.import'), data);

    form.processing = false;
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

            <!-- Form Manual -->
            <div
                class="bg-white dark:bg-white/5 dark:border-gray-700 shadow-sm border border-gray-300 rounded-lg p-6 mb-8">
                <h2 class="sm:text-xl text-lg font-semibold dark:text-gray-200 text-gray-700 mb-4">Daftarkan Peserta
                    Didik</h2>
                <form @submit.prevent="submitManual" class="flex flex-wrap gap-4">
                    <!-- Kolom 1: Nama Lengkap -->
                    <div class="w-full mt-2">
                        <input v-model="form.nama_lengkap" type="text" placeholder="Nama Lengkap" required
                            class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition" />
                    </div>

                    <!-- Kolom 2: Email -->
                    <div class="sm:flex-1 sm:min-w-[45%] w-full">
                        <input v-model="form.email" type="email" placeholder="Email Address" required
                            class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition" />
                    </div>

                    <!-- Kolom 3: Password -->
                    <div class="sm:flex-1 sm:min-w-[45%] w-full">
                        <input v-model="form.password" type="password" placeholder="Password" required
                            class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition" />
                    </div>

                    <!-- Kolom 4: Pilih Kelas -->
                    <div class="sm:flex-1 sm:min-w-[45%] w-full">
                        <select v-model="form.kelas_id" required
                            class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition">
                            <option value="">-- Pilih Kelas --</option>
                            <option v-for="k in kelasAll" :key="k.id" :value="k.id">{{ k.kelas }}</option>
                        </select>
                    </div>

                    <!-- Kolom 5: Pilih Kejuruan -->
                    <div v-if="isSmk" class="sm:flex-1 sm:min-w-[45%] w-full">
                        <select v-model="form.kejuruan_id" required
                            class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition">
                            <option value="">-- Pilih Kejuruan --</option>
                            <option v-for="kj in kejuruanList" :key="kj.id" :value="kj.id">{{ kj.kejuruan }}</option>
                        </select>
                    </div>


                    <!-- Tombol submit full width -->
                    <div class="w-full mt-2">
                        <button type="submit" :disabled="form.processing"
                            class="bg-[#063970] text-white px-6 py-3 rounded-lg transition font-semibold shadow-md hover:bg-[#052d5a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full">
                            <svg v-if="form.processing" class="w-5 h-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                                </path>
                            </svg>
                            <span>{{ form.processing ? 'Processing...' : 'Daftarkan' }}</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Form Import Excel -->
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
