<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ref } from 'vue'
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    mapel: Array,
    guru: Array, // ← ditambahkan
})

const showModal = ref(false)

const form = ref({
    id: null,
    mapel: '',
    guru_id: '',
})

// ------ OPEN EDIT ------
const openEdit = (m) => {
    form.value.id = m.id
    form.value.mapel = m.mapel
    form.value.guru_id = m.guru_id ?? ''   // penting!
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    form.value = { id: null, mapel: '', guru_id: '' }
}

// ------ UPDATE ------
const update = () => {
    router.put(
        route('admin.mapel.update', form.value.id),
        {
            mapel: form.value.mapel,
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
    if (confirm('Yakin ingin menghapus mapel ini?')) {
        router.delete(route('admin.mapel.destroy', id))
    }
}
</script>

<template>

    <Head title="Subjects Data" />

    <MenuLayout>
        <div class="max-w-6xl mx-auto sm:p-6">

            <!-- Header -->
            <div class="flex flex-col mb-6 sm:mb-10 sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">List of All Subjects</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Manage school subjects data</p>
                </div>
                <Link :href="route('admin.mapel.create')"
                    class="px-4 py-2 hidden rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-md transition sm:flex items-center justify-center">
                    + <span class="sm:inline-block hidden ml-1">Add Subject</span>
                </Link>
            </div>

            <!-- TABLE FOR DESKTOP -->
            <div
                class="hidden md:block rounded-lg overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
                <table class="w-full border-collapse">
                    <thead class="bg-blue-700 text-white">
                        <tr>
                            <th class="px-4 py-3 text-center border-r whitespace-nowrap">No</th>
                            <th class="px-4 py-3 text-center border-r whitespace-nowrap">Subject Name</th>
                            <th class="px-4 py-3 text-center border-r whitespace-nowrap">Teacher</th>
                            <th class="px-4 py-3 text-center whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(m, index) in mapel" :key="m.id"
                            class="hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition">
                            <td class="px-4 py-3 text-center">{{ index + 1 }}</td>
                            <td class="px-6 py-3">{{ m.mapel }}</td>
                            <td class="px-6 py-3">{{ m.guru?.nama_lengkap ?? '-' }}</td>
                            <td class="px-4 py-3 flex justify-center gap-3">
                                <button @click="openEdit(m)"
                                    class="text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300 transition"
                                    title="Edit">
                                    <PencilSquareIcon class="w-5 h-5" />
                                </button>
                                <button @click="hapus(m.id)" class="text-red-600 hover:text-red-800 transition"
                                    title="Delete">
                                    <TrashIcon class="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="mapel.length === 0">
                            <td colspan="4" class="text-center py-6 text-gray-500 dark:text-gray-400">No subjects
                                available</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- CARD FOR MOBILE -->
            <div class="md:hidden space-y-4">
                <div v-for="(m, index) in mapel" :key="m.id"
                    class="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-md hover:shadow-lg transition">
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="font-semibold text-indigo-600">{{ m.mapel }}</h2>
                        <span class="text-sm text-gray-500 dark:text-gray-400">{{ m.guru?.nama_lengkap ?? '-' }}</span>
                    </div>
                    <div class="flex gap-2 mt-3 justify-end">
                        <button @click="openEdit(m)"
                            class="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
                            <PencilSquareIcon class="w-4 h-4" /> Edit
                        </button>
                        <button @click="hapus(m.id)"
                            class="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">
                            <TrashIcon class="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>
                <div v-if="mapel.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
                    No subjects available
                </div>

                <!-- FLOATING CREATE BUTTON -->
                <Link :href="route('admin.mapel.create')"
                    class="fixed bottom-6 right-5 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl active:scale-95 transition">
                    + Add
                </Link>
            </div>

            <!-- EDIT MODAL -->
            <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition"></div>
                <div
                    class="relative w-full max-w-md rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl p-6 m-3 transition">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Subject</h2>
                        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Subject
                            Name</label>
                        <input v-model="form.mapel" type="text"
                            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2
                          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Subject
                            Teacher</label>
                        <select v-model="form.guru_id"
                            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                            <option value="">-- select teacher --</option>
                            <option v-for="g in guru" :key="g.id" :value="g.id">{{ g.nama_lengkap }}</option>
                        </select>
                    </div>

                    <div class="flex justify-end gap-2">
                        <button @click="closeModal"
                            class="px-4 py-2 rounded-xl border dark:text-gray-300 border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            Cancel
                        </button>
                        <button @click="update"
                            class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
                            Save
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </MenuLayout>
</template>

<style scoped>
/* Optional: smooth shadow for interactive hover effects */
table tr:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.3s;
}
</style>