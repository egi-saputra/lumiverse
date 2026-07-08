<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ref } from 'vue'
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    kelas: Array,
    guru: Array,
})

const showModal = ref(false)

const form = ref({
    id: null,
    kelas: '',
    guru_id: '',
})

// ------ OPEN EDIT ------
const openEdit = (k) => {
    form.value.id = k.id
    form.value.kelas = k.kelas
    form.value.guru_id = k.guru_id ?? ''   // penting!
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    form.value = { id: null, kelas: '', guru_id: '' }
}

// ------ UPDATE ------
const update = () => {
    router.put(
        route('admin.kelas.update', form.value.id),
        {
            kelas: form.value.kelas,
            guru_id: form.value.guru_id,
        },
        {
            preserveScroll: true,
            onSuccess: () => closeModal()
        }
    )
}

// ------ DELETE ------
const hapus = (id) => {
    if (confirm('Yakin ingin menghapus kelas ini?')) {
        router.delete(route('admin.kelas.destroy', id))
    }
}
</script>

<template>

    <Head title="Class Data" />

    <MenuLayout>
        <div class="max-w-6xl mx-auto sm:p-6">

            <!-- Glassmorphism container -->
            <div>

                <!-- Header -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">List of Classes</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Manage class / homeroom data</p>
                    </div>
                    <Link :href="route('admin.kelas.create')"
                        class="px-4 py-2 rounded sm:block hidden bg-blue-700 hover:bg-blue-800 text-white shadow transition">
                        + <span>Add Class</span>
                    </Link>
                </div>

                <!-- TABLE FOR DESKTOP -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full border-collapse rounded overflow-hidden shadow-sm">
                        <thead class="bg-blue-700 text-white rounded">
                            <tr>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">No</th>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">Class Name</th>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">Homeroom Teacher</th>
                                <th class="px-4 py-2 text-center w-40 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(k, index) in kelas" :key="k.id"
                                class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition">
                                <td class="px-4 py-2 text-center">{{ index + 1 }}</td>
                                <td class="px-4 py-2 text-center">{{ k.kelas }}</td>
                                <td class="px-10 py-2">{{ k.guru?.nama_lengkap ?? '-' }}</td>
                                <td class="px-4 py-2 flex justify-center gap-2">
                                    <button @click="openEdit(k)"
                                        class="text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300 transition">
                                        <PencilSquareIcon class="w-5 h-5" />
                                    </button>
                                    <button @click="hapus(k.id)" class="text-red-600 hover:text-red-800 transition">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="kelas.length === 0">
                                <td colspan="4" class="text-center py-6 text-gray-500 dark:text-gray-400">
                                    No class data available
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- CARD FOR MOBILE -->
                <div class="md:hidden space-y-4">
                    <div v-for="(k, index) in kelas" :key="k.id"
                        class="border rounded-2xl p-5 shadow hover:shadow-lg transition bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="font-semibold text-indigo-600">{{ k.kelas }}</h2>
                            <span class="text-gray-500 dark:text-gray-400">{{ k.guru?.nama_lengkap ?? '-' }}</span>
                        </div>
                        <div class="flex gap-2 mt-3 justify-end">
                            <button @click="openEdit(k)"
                                class="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition">
                                <PencilSquareIcon class="w-4 h-4" /> Edit
                            </button>
                            <button @click="hapus(k.id)"
                                class="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition">
                                <TrashIcon class="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </div>

                    <div v-if="kelas.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
                        No class data available
                    </div>

                    <!-- FLOATING CREATE BUTTON -->
                    <Link :href="route('admin.kelas.create')"
                        class="fixed bottom-6 right-5 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl active:scale-95 transition">
                        + Add
                    </Link>
                </div>

            </div>
        </div>
    </MenuLayout>

    <!-- EDIT MODAL -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-30">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition"></div>
        <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md w-full max-w-md rounded-2xl sm:m-0 m-3 shadow-xl p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Class</h2>
                <button @click="closeModal">
                    <XMarkIcon
                        class="w-5 h-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" />
                </button>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Class Name</label>
                <input v-model="form.kelas" type="text"
                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2
                          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Homeroom Teacher</label>
                <select v-model="form.guru_id"
                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                    <option value="">-- select homeroom teacher --</option>
                    <option v-for="g in guru" :key="g.id" :value="g.id">{{ g.nama_lengkap }}</option>
                </select>
            </div>

            <div class="flex justify-end gap-2">
                <button @click="closeModal" class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    Cancel
                </button>
                <button @click="update"
                    class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>
