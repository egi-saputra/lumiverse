<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ref } from 'vue'
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    kejuruan: Array,
    guru: Array,
})

const showModal = ref(false)
const form = ref({
    id: null,
    kejuruan: '',
    guru_id: ''
})

const openEdit = (k) => {
    form.value.id = k.id
    form.value.kejuruan = k.kejuruan
    form.value.guru_id = k.guru_id
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    form.value = { id: null, kejuruan: '', guru_id: '' }
}

const update = () => {
    router.put(
        route('admin.kejuruan.update', form.value.id),
        {
            kejuruan: form.value.kejuruan,
            guru_id: form.value.guru_id
        },
        {
            preserveScroll: true,
            onSuccess: () => closeModal()
        }
    )
}

const hapus = (id) => {
    if (confirm('Yakin ingin menghapus kejuruan ini?')) {
        router.delete(route('admin.kejuruan.destroy', id))
    }
}
</script>

<template>

    <Head title="Vocational Programs" />

    <MenuLayout>
        <div class="max-w-6xl mx-auto sm:p-6">

            <!-- Card container with glass effect -->
            <!-- <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition"> -->
            <div>

                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-10">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                            List of <span class="sm:inline-block hidden">Vocational Programs</span>
                            <span class="inline-block sm:hidden">Programs</span>
                        </h1>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            Manage vocational program <span class="sm:inline-block hidden">data at school</span>
                        </p>
                    </div>
                    <Link :href="route('admin.kejuruan.create')"
                        class="px-4 py-2 rounded sm:block hidden bg-blue-600 text-white hover:bg-blue-700 transition text-sm sm:text-base">
                        + <span>Add Program</span>
                    </Link>
                </div>

                <!-- TABLE FOR DESKTOP -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full border-collapse rounded overflow-hidden shadow-sm">
                        <thead class="bg-blue-700 text-white rounded-lg">
                            <tr>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">No</th>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">Program Name</th>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">Head of Program</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(k, index) in props.kejuruan" :key="k.id"
                                class="hover:bg-indigo-50 dark:hover:bg-gray-700 transition">
                                <td class="px-4 py-2 text-gray-800 dark:text-gray-200 text-center">{{ index + 1
                                }}</td>
                                <td class="px-6 py-2 text-left font-medium text-gray-800 dark:text-gray-200">{{
                                    k.kejuruan }}</td>
                                <td class="px-6 py-2 text-left text-gray-600 dark:text-gray-300">{{
                                    k.guru?.nama_lengkap ?? '—' }}</td>
                                <td class="px-4 py-2 flex justify-center gap-2">
                                    <button @click="openEdit(k)"
                                        class="text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300 transition"
                                        title="Edit">
                                        <PencilSquareIcon class="w-5 h-5" />
                                    </button>
                                    <button @click="hapus(k.id)" class="text-red-600 hover:text-red-800 transition"
                                        title="Delete">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="props.kejuruan.length === 0">
                                <td colspan="4" class="text-center py-6 text-gray-500 dark:text-gray-400">
                                    No vocational program data available
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- CARD FOR MOBILE -->
                <div class="md:hidden space-y-4">
                    <div v-for="(k, index) in props.kejuruan" :key="k.id"
                        class="bg-white/60 dark:bg-gray-700/50 rounded-2xl p-5 shadow hover:shadow-lg transition">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="font-semibold text-indigo-600">{{ k.kejuruan }}</h2>
                            <span class="text-gray-500 dark:text-gray-300">{{ k.guru?.nama_lengkap ?? '—' }}</span>
                        </div>
                        <div class="flex gap-2 justify-end mt-3">
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
                    <div v-if="props.kejuruan.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
                        No vocational program data available
                    </div>

                    <!-- FLOATING CREATE BUTTON -->
                    <Link :href="route('admin.kejuruan.create')"
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
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md w-full max-w-md rounded-2xl shadow-xl sm:m-0 m-3 p-6 transition">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Program</h2>
                <button @click="closeModal">
                    <XMarkIcon
                        class="w-5 h-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white" />
                </button>
            </div>

            <!-- Program Name -->
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Program Name</label>
                <input v-model="form.kejuruan" type="text"
                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2
                          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
            </div>

            <!-- Head of Program -->
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Head of Program</label>
                <select v-model="form.guru_id"
                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                    <option value="">-- Select Teacher --</option>
                    <option v-for="g in props.guru" :value="g.id" :key="g.id">{{ g.nama_lengkap }}</option>
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
