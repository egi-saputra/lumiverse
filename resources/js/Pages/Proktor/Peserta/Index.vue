<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { ToastAlert } from '@/Composables/ToastAlert.js';
import { ref, computed, onMounted, watch } from 'vue';
import { Link, usePage, router } from '@inertiajs/vue3';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { ArrowPathIcon, UsersIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import { route } from 'ziggy-js'
import Swal from 'sweetalert2'

const { success, error, confirm } = ToastAlert();

// Data peserta & kelas dari server
const page = usePage();
const pesertaData = ref([...page.props.pesertaAll]);

watch(
    () => page.props.pesertaAll,
    (newVal) => {
        pesertaData.value = [...newVal];
    }
);

const kelasAll = ref([...page.props.kelasList]);

// Filter
const filterNama = ref('');
const filterKelas = ref('');

// Editing
const editing = ref(false);
const editForm = ref({
    id: null,
    nama_lengkap: '',
    kelas_id: '',
    status: '',
    email: '',
    password: '',
});

// Select kelas untuk edit (tanpa tenant filter)
const kelasForEdit = computed(() => {
    return kelasAll.value; // tampilkan semua kelas
});

const refreshData = () => {
    filterNama.value = '';
    filterKelas.value = '';
    currentPage.value = 1;
};

// --- Pagination Frontend ---
const currentPage = ref(1);
const perPage = 25;
const MAX_VISIBLE_PAGES = 7;

const filteredPeserta = computed(() => {
    return pesertaData.value.filter(p => {
        const byNama = p.nama.toLowerCase().includes(filterNama.value.toLowerCase());
        const byKelas = filterKelas.value ? p.kelas_id == filterKelas.value : true;
        return byNama && byKelas;
    });
});

const paginatedPeserta = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return filteredPeserta.value.slice(start, start + perPage).map(p => ({
        ...p,
        displayStatus: p.status === 'Activated' ? 'Active' : 'Inactive',
    }));
});

const totalPages = computed(() => Math.ceil(filteredPeserta.value.length / perPage));

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    if (total <= MAX_VISIBLE_PAGES) return Array.from({ length: total }, (_, i) => i + 1);
    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = current - half;
    let end = current + half - 1;
    if (start < 1) { start = 1; end = MAX_VISIBLE_PAGES; }
    if (end > total) { end = total; start = total - MAX_VISIBLE_PAGES + 1; }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const prevPage = () => { currentPage.value = Math.max(currentPage.value - 1, 1); }
const nextPage = () => { currentPage.value = Math.min(currentPage.value + 1, totalPages.value); }

// Reset page jika filter berubah
watch([filterNama, filterKelas], () => { currentPage.value = 1; });

// --- Edit ---
const openEdit = (p) => {
    editing.value = true;
    editForm.value = {
        id: p.id,
        nama_lengkap: p.nama,
        kelas_id: p.kelas_id,
        status: p.status,
        email: p.email,
        password: '',
    };
};

const closeEdit = () => { editing.value = false; }

// --- Update ---
const updatePeserta = async () => {
    try {

        const payload = {
            nama_lengkap: editForm.value.nama_lengkap,
            kelas_id: editForm.value.kelas_id,
            status: editForm.value.status,
            email: editForm.value.email,
        };

        // kirim password hanya jika diisi
        if (editForm.value.password?.trim() !== '') {
            payload.password = editForm.value.password;
        }

        const res = await axios.put(
            `/proktor/peserta/${editForm.value.id}`,
            payload
        );

        success(res.data.success || 'Peserta berhasil diupdate');

        closeEdit();

        router.reload({
            only: ['pesertaAll'],
            preserveScroll: true,
        });

    } catch (err) {

        console.log(err.response?.data);

        if (err.response?.data?.errors) {
            const errors = Object.values(err.response.data.errors)
                .flat()
                .join('\n');

            error(errors);
        } else {
            error(
                err.response?.data?.message ||
                'Gagal update peserta'
            );
        }
    }
};

// --- Delete Per User ---
const deletePeserta = async (id) => {
    const result = await confirm({ text: 'Yakin ingin menghapus peserta ini?' });
    if (!result.isConfirmed) return;

    await axios.delete(`/proktor/peserta/${id}`);

    pesertaData.value = pesertaData.value.filter(p => p.id !== id);
    success('Peserta berhasil dihapus');
};

// --- Delete All ---
const deleteAllPeserta = () => {
    confirm({
        text: filterKelas.value
            ? 'Yakin ingin menghapus semua peserta di kelas ini?'
            : 'Yakin ingin menghapus semua peserta?'
    })
        .then(result => {
            if (result.isConfirmed) {

                axios.delete('/proktor/peserta/destroy-all', {
                    data: {
                        kelas_id: filterKelas.value
                    }
                })
                    .then(res => {
                        success(res.data.success);

                        router.reload({
                            only: ['pesertaAll'],
                            preserveScroll: true
                        });
                    })
                    .catch(err => {
                        error(err.response?.data?.message || 'Gagal hapus peserta');
                    });

            }
        });
};

// --- Import Excel ---
const submitExcel = async (fileInput) => {
    if (!fileInput.value?.files[0]) {
        return Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Pilih file Excel terlebih dahulu!',
            toast: true,
            position: 'top-end',
            timer: 2000,
            showConfirmButton: false,
        });
    }
    const formData = new FormData();
    formData.append('excel', fileInput.value.files[0]);
    try {
        await axios.post(route('proktor.peserta.import'), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        window.location.href = route('proktor.peserta.index');
    } catch (err) {
        console.error(err);
    }
};

// --- Toast flash ---
onMounted(() => {
    const flashSuccess = page.props.flash?.success;
    if (flashSuccess) success(flashSuccess);
});
</script>

<template>
    <MenuLayout>
        <div>
            <!-- Header -->
            <header class="page-header">
                <div class="header-left">
                    <div class="header-icon">
                        <UsersIcon class="icon" />
                    </div>
                    <div>
                        <h1 class="page-title">Student List</h1>
                        <p class="page-subtitle">Kelola daftar siswa / peserta ujian</p>
                    </div>
                </div>

                <Link href="/proktor/peserta/register"
                    class="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 w-full sm:w-auto text-center">
                    + Tambah Peserta
                </Link>
            </header>

            <div class="sm:bg-white dark:bg-white/5 sm:rounded sm:p-6 sm:shadow">
                <!-- Filter -->
                <div class="flex flex-col md:flex-row md:justify-between gap-3 mb-6 items-start md:items-center">
                    <!-- Filter Inputs -->
                    <div class="flex flex-col sm:flex-row gap-3 sm:mb-0 mb-6 w-full md:w-auto">
                        <input type="text" v-model="filterNama" placeholder="Cari nama..."
                            class="border px-3 py-2 rounded-lg dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition sm:w-auto flex-1" />
                        <select v-model="filterKelas"
                            class="w-full rounded-lg border pr-10 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                            <option value="">Semua Kelas</option>
                            <option v-for="k in kelasAll" :key="k.id" :value="k.id">{{ k.kelas }}</option>
                        </select>
                        <button @click="refreshData"
                            class="flex gap-2 justify-center bg-gray-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto">
                            <ArrowPathIcon class="w-5 h-5" /> Refresh
                        </button>
                    </div>

                    <!-- Delete All Button -->
                    <button @click="deleteAllPeserta"
                        class="bg-red-700 text-white px-4 py-2 rounded-lg hidden sm:flex items-center justify-center gap-1 w-full sm:w-auto">
                        <TrashIcon class="w-5 h-5" /> Hapus Semua
                    </button>
                </div>

                <!-- Table Desktop -->
                <table class="w-full border dark:border-gray-500 text-center hidden md:table">
                    <thead class="bg-[#063970] text-white">
                        <tr>
                            <th class="p-2 border dark:border-gray-500">No</th>
                            <th class="p-2 border dark:border-gray-500">Full Name</th>
                            <th class="p-2 border dark:border-gray-500">Email Address</th>
                            <th class="p-2 border dark:border-gray-500">Class Name</th>
                            <!-- <th class="p-2 border">ID PD</th> -->
                            <th class="p-2 border dark:border-gray-500">Status</th>
                            <th class="p-2 border dark:border-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-700 dark:text-gray-300">
                        <tr v-for="(p, i) in paginatedPeserta" :key="p.id">
                            <td class="p-2 border dark:border-gray-700">{{ (currentPage - 1) * perPage + i + 1 }}</td>
                            <td class="p-2 text-left border dark:border-gray-700">{{ p.nama }}</td>
                            <td class="p-2 text-left border dark:border-gray-700">{{ p.email }}</td>
                            <td class="p-2 border dark:border-gray-700">{{ p.kelas }}</td>
                            <!-- <td class="p-2 border font-extrabold font-mono">{{ p.id }}</td> -->
                            <td class="p-2 border dark:border-gray-700">
                                <span
                                    :class="p.status === 'Activated' ? 'text-green-600 font-semibold' : 'text-gray-500'">
                                    {{ p.displayStatus }}
                                </span>
                            </td>
                            <td class="p-2 border dark:border-gray-700">
                                <div class="flex justify-center gap-3">
                                    <button @click="openEdit(p)" class="p-2 bg-blue-600 text-white rounded">
                                        <PencilSquareIcon class="w-4 h-4" />
                                    </button>
                                    <button @click="deletePeserta(p.id)" class="p-2 bg-red-600 text-white rounded">
                                        <TrashIcon class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="paginatedPeserta.length === 0">
                            <td colspan="7" class="p-3 dark:text-gray-300 text-gray-500">Tidak ada data peserta.</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Card Mobile -->
                <div class="md:hidden flex flex-col gap-4">
                    <div v-for="(p, i) in paginatedPeserta" :key="p.id"
                        class="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
                        <div class="flex justify-between items-center">
                            <div class="font-semibold text-gray-800">{{ p.nama }}</div>
                            <div class="text-sm text-gray-500 font-mono">{{ (currentPage - 1) * perPage + i + 1 }}</div>
                        </div>
                        <div class="mt-2 flex flex-col gap-2 text-gray-600 text-sm">
                            <div>Email: <span class="font-mono">{{ p.email }}</span></div>
                            <!-- <div>ID PD: <span class="font-mono font-bold">{{ p.id }}</span></div> -->
                            <div class="flex justify-between w-full gap 4">
                                <div
                                    class="bg-ambers-50 w-1/2 p-2 px-4 items-center text-center rounded-lg text-amber-600">
                                    Kelas:
                                    <span class="font-semibold text-amber-600">{{ p.kelas }}</span>
                                </div>
                                <div class="w-1/2 p-2 px-4 items-center text-center rounded-lg"
                                    :class="p.status === 'Activated' ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-500 bg-gray-50'">
                                    Status:
                                    <span>
                                        {{ p.displayStatus }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2 mt-3">
                            <button @click="openEdit(p)"
                                class="flex-1 bg-blue-600 text-white px-2 py-1 rounded flex justify-center items-center gap-1">
                                <PencilSquareIcon class="w-4 h-4" /> Edit
                            </button>
                            <button @click="deletePeserta(p.id)"
                                class="flex-1 bg-red-600 text-white px-2 py-1 rounded flex justify-center items-center gap-1">
                                <TrashIcon class="w-4 h-4" /> Hapus
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal Edit -->
                <div v-if="editing" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div class="bg-white dark:bg-gray-900 p-6 w-[460px] rounded shadow-lg">
                        <h2 class="text-xl font-bold mb-4">Edit Peserta</h2>
                        <div class="mb-3">
                            <label class="block font-semibold">Nama Lengkap</label>
                            <input v-model="editForm.nama_lengkap"
                                class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition" />
                        </div>
                        <div class="mb-3">
                            <label class="block font-semibold">Email</label>
                            <input v-model="editForm.email" type="email"
                                class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition" />
                        </div>
                        <div class="mb-3">
                            <label class="block font-semibold">Kelas</label>
                            <select v-model="editForm.kelas_id"
                                class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition">
                                <option v-for="k in kelasForEdit" :key="k.id" :value="k.id">{{ k.kelas }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="block font-semibold">Password</label>
                            <input v-model="editForm.password" type="password"
                                placeholder="Kosongkan jika tidak ingin mengubah"
                                class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition" />
                        </div>
                        <div class="mb-3">
                            <label class="block font-semibold">Status</label>
                            <select v-model="editForm.status"
                                class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition">
                                <option value="Activated">Activated</option>
                                <option value="Deactivated">Deactivated</option>
                            </select>
                        </div>
                        <div class="flex justify-end gap-2 mt-4">
                            <button @click="closeEdit"
                                class="px-3 py-2 bg-gray-300 dark:bg-white/5 rounded">Batal</button>
                            <button @click="updatePeserta"
                                class="px-3 py-2 bg-blue-600 text-white rounded">Simpan</button>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="flex justify-center gap-2 mt-4">
                    <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 rounded border"
                        :class="currentPage === 1 ? 'bg-gray-100 dark:bg-white/5 dark:border-gray-700 text-gray-400 dark:text-gray-700 cursor-not-allowed' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400 dark:hover:bg-white/10'">
                        Prev
                    </button>

                    <button v-for="p in visiblePages" :key="p" @click="currentPage = p" class="px-3 py-1 rounded border"
                        :class="p === currentPage ? 'bg-blue-600 dark:border-gray-700 text-white' : 'bg-gray-100 dark:bg-white/5 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700'">
                        {{ p }}
                    </button>

                    <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 rounded border"
                        :class="currentPage === totalPages ? 'bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:text-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-100 dark:border-gray-700 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 dark:text-gray-400 text-gray-700'">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </MenuLayout>
</template>

<style scoped>
/* ══ Header ══════════════════════════════════════════════════════════════ */
.page-header {
    @apply flex items-center justify-between gap-4;
}

.header-left {
    @apply flex items-center gap-4 mb-10;
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
</style>