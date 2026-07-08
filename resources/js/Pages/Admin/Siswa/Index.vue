<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3'
import {
    PencilSquareIcon, TrashIcon,
    ArrowPathIcon, InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { ref, computed, watch } from 'vue'
import { useTenant } from '@/Composables/useTenant.js'

/* ─── Props ──────────────────────────────────────────────── */
const props = defineProps({
    siswa: Array,
    kelas: { type: Array, default: null },
    isSmk: Boolean,
})

/* ─── Tenant (product_type) ─────────────────────────────── */
const { isWorkspace } = useTenant()

/* ─── Label kondisional per product_type ────────────────── */
const t = computed(() => isWorkspace.value ? {
    pageTitle: 'Employee List',
    heading: 'List of All Employees',
    subheading: 'Manage employee data',
    searchPlaceholder: 'Search employee name...',
    allGroupsOption: 'All Teams',
    groupColumnLabel: 'Team',
    idColumnLabel: 'Employee ID',
    listAutoUpdateNote: 'Employee List Updates Automatically',
    noDataMessage: 'No employee data available',
    deleteAllSuffix: 'Employees in This Team',
    confirmDeleteOne: 'Yakin ingin menghapus karyawan ini?',
    confirmDeleteAllEntity: 'karyawan',
    confirmDeleteAllGroup: 'tim',
    fallbackGroupName: 'tim ini',
} : {
    pageTitle: 'Student List',
    heading: 'List of All Students',
    subheading: 'Manage student data',
    searchPlaceholder: 'Search student name...',
    allGroupsOption: 'All Classes',
    groupColumnLabel: 'Class',
    idColumnLabel: 'NIS / NISN',
    listAutoUpdateNote: 'Student List Updates Automatically',
    noDataMessage: 'No student data available',
    deleteAllSuffix: 'Students in This Class',
    confirmDeleteOne: 'Yakin ingin menghapus siswa ini?',
    confirmDeleteAllEntity: 'siswa',
    confirmDeleteAllGroup: 'kelas',
    fallbackGroupName: 'kelas ini',
})

/* ─── State Filter & Pagination ─────────────────────────── */
const search = ref('')
const sort = ref('asc')
const filterKelas = ref('')   // '' = semua kelas
const currentPage = ref(1)
const perPage = ref(12)

/* ─── Derived: daftar kelas unik dari data siswa ─────────── */
// Dipakai jika prop `kelas` tidak dikirim dari controller
const kelasList = computed(() => {
    if (props.kelas?.length) return props.kelas

    const seen = new Map()
    props.siswa.forEach(s => {
        if (s.kelas && !seen.has(s.kelas_id)) {
            seen.set(s.kelas_id, { id: s.kelas_id, kelas: s.kelas.kelas })
        }
    })
    return [...seen.values()].sort((a, b) => a.kelas.localeCompare(b.kelas))
})

/* ─── Reset page saat filter berubah ────────────────────── */
watch([search, sort, filterKelas], () => { currentPage.value = 1 })

/* ─── Filter + Sort ──────────────────────────────────────── */
const filteredSiswa = computed(() => {
    let data = [...props.siswa]

    if (search.value.trim()) {
        const q = search.value.trim().toLowerCase()
        data = data.filter(s => s.nama_lengkap.toLowerCase().includes(q))
    }

    if (filterKelas.value) {
        data = data.filter(s => String(s.kelas_id) === String(filterKelas.value))
    }

    data.sort((a, b) =>
        sort.value === 'asc'
            ? a.nama_lengkap.localeCompare(b.nama_lengkap)
            : b.nama_lengkap.localeCompare(a.nama_lengkap)
    )

    return data
})

/* ─── Pagination ─────────────────────────────────────────── */
const totalPages = computed(() => Math.ceil(filteredSiswa.value.length / perPage.value))

const paginatedSiswa = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    return filteredSiswa.value.slice(start, start + perPage.value)
})

const MAX_VISIBLE_PAGES = 6
const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    if (total <= MAX_VISIBLE_PAGES)
        return Array.from({ length: total }, (_, i) => i + 1)

    const half = Math.floor(MAX_VISIBLE_PAGES / 2)
    let start = Math.max(1, current - half)
    let end = start + MAX_VISIBLE_PAGES - 1

    if (end > total) { end = total; start = Math.max(1, total - MAX_VISIBLE_PAGES + 1) }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

/* ─── Reset Filter ───────────────────────────────────────── */
const resetFilter = () => {
    search.value = ''
    sort.value = 'asc'
    filterKelas.value = ''
    currentPage.value = 1
}

/* ─── Hapus satu siswa ───────────────────────────────────── */
const hapus = (id) => {
    if (!confirm(t.value.confirmDeleteOne)) return
    router.delete(route('admin.siswa.destroy', id), {
        preserveScroll: true,
    })
}

/* ─── Hapus semua siswa berdasarkan kelas yang dipilih ───── */
const hapusSemuaByKelas = () => {
    if (!filterKelas.value) return

    const namaKelas = kelasList.value.find(
        k => String(k.id) === String(filterKelas.value)
    )?.kelas ?? t.value.fallbackGroupName

    const jumlah = filteredSiswa.value.length

    if (!confirm(
        `Yakin ingin menghapus SEMUA ${jumlah} ${t.value.confirmDeleteAllEntity} di ${t.value.confirmDeleteAllGroup} "${namaKelas}"?\n` +
        `Tindakan ini tidak dapat dibatalkan.`
    )) return

    router.delete(route('admin.siswa.destroyByKelas'), {
        data: { kelas_id: filterKelas.value },
        preserveScroll: true,
        onSuccess: () => {
            filterKelas.value = ''
            currentPage.value = 1
        },
    })
}
</script>

<template>

    <Head :title="t.pageTitle" />

    <MenuLayout>
        <div class="sm:bg-white/60 dark:sm:bg-gray-800/60 sm:backdrop-blur-md sm:rounded sm:shadow sm:p-6">

            <!-- Header -->
            <div class="flex flex-col dark:text-gray-200 sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-xl font-semibold">{{ t.heading }}</h1>
                    <p class="text-sm text-gray-500">{{ t.subheading }}</p>
                </div>
            </div>

            <!-- Filter Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <!-- Search -->
                <input v-model="search" type="text" :placeholder="t.searchPlaceholder" class="w-full rounded border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2
                           text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />

                <!-- Sort -->
                <select v-model="sort"
                    class="w-full rounded border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2
                           text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                    <option value="asc">Sort A – Z</option>
                    <option value="desc">Sort Z – A</option>
                </select>

                <!-- Filter Kelas -->
                <select v-model="filterKelas"
                    class="w-full rounded border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2
                           text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                    <option value="">{{ t.allGroupsOption }}</option>
                    <option v-for="k in kelasList" :key="k.id" :value="k.id">
                        {{ k.kelas }}
                    </option>
                </select>

                <!-- Reset -->
                <button @click="resetFilter" class="flex items-center justify-center gap-2 px-4 py-2 rounded border bg-gray-700 dark:hover:bg-gray-800
                           text-white dark:bg-transparent hover:bg-gray-800 transition text-sm">
                    <ArrowPathIcon class="w-4 h-4" /> Reset
                </button>
            </div>

            <!-- Tombol Hapus Semua by Kelas (muncul hanya saat filter kelas aktif) -->
            <div v-if="filterKelas && filteredSiswa.length > 0" class="flex w-full mb-6 justify-end">
                <button @click="hapusSemuaByKelas"
                    class="flex items-center gap-2 px-4 py-2 rounded border border-red-500 bg-red-50 dark:bg-red-900/20
                           text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition text-sm font-medium">
                    <TrashIcon class="w-4 h-4" />
                    Delete All ( {{ filteredSiswa.length }} ) {{ t.deleteAllSuffix }}
                </button>
            </div>

            <!-- Desktop Table -->
            <div class="hidden md:block">
                <h2 class="text-xl font-semibold dark:text-gray-300 mb-4 flex items-center gap-2">
                    <InformationCircleIcon class="w-6 h-6 text-blue-500" />
                    {{ t.listAutoUpdateNote }}
                </h2>

                <div
                    class="hidden md:block rounded-lg overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
                    <table class="w-full border-collapse">

                        <thead class="bg-blue-800 text-white">
                            <tr>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">No</th>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">Full Name</th>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">{{ t.idColumnLabel }}</th>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">{{ t.groupColumnLabel }}
                                    <span v-if="isSmk && !isWorkspace"> / Major</span>
                                </th>
                                <th class="px-4 py-2 text-center border-r whitespace-nowrap">Status</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(s, index) in paginatedSiswa" :key="s.id"
                                class="border-t dark:border-none hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300">
                                <td class="px-4 py-2 text-center">
                                    {{ (currentPage - 1) * perPage + index + 1 }}
                                </td>

                                <td class="px-4 py-2">{{ s.nama_lengkap ?? '-' }}</td>

                                <td class="px-4 py-2 text-center">
                                    {{ s.nis ?? '-' }} / {{ s.nisn ?? '-' }}
                                </td>

                                <td class="px-4 py-2 text-center">
                                    {{ s.kelas?.kelas ?? '-' }}<span v-if="isSmk && !isWorkspace"> / {{
                                        s.kejuruan?.kejuruan ?? '-' }}</span>
                                </td>

                                <td class="px-4 py-2 text-center">
                                    <span class="font-semibold" :class="{
                                        'text-green-700 dark:text-green-500': s.status === 'Activated',
                                        'text-red-700 dark:text-red-500': s.status === 'Deactivated',
                                    }">
                                        {{ s.status === 'Activated' ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                <td class="px-6 justify-center py-2 flex gap-2">
                                    <Link :href="route('admin.siswa.edit', s.id)"
                                        class="text-blue-600 dark:text-gray-100 dark:hover:text-gray-300 hover:text-blue-800">
                                        <PencilSquareIcon class="w-5 h-5" />
                                    </Link>

                                    <button @click="hapus(s.id)" class="text-red-600 hover:text-red-800">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>

                            <tr v-if="filteredSiswa.length === 0">
                                <td colspan="6" class="text-center py-6 text-gray-500">
                                    {{ t.noDataMessage }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Card View -->
            <div class="md:hidden grid grid-cols-1 gap-4">
                <h2 class="text-lg font-semibold dark:text-gray-300 flex items-center gap-2">
                    <InformationCircleIcon class="w-6 h-6 text-blue-500" />
                    {{ t.listAutoUpdateNote }}
                </h2>

                <div v-for="(s) in paginatedSiswa" :key="s.id"
                    class="relative rounded border z-30 p-5 shadow hover:shadow-lg transition">
                    <div class="absolute z-20 inset-x-0 top-0 h-1 rounded-t bg-gradient-to-r from-blue-500 to-pink-500">
                    </div>

                    <div class="flex items-center gap-3 mt-2">
                        <div class="flex-1">
                            <div class="flex gap-3">
                                <div class="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-pink-600 text-white
                                           flex items-center justify-center font-bold text-lg">
                                    {{ s.nama_lengkap.charAt(0).toUpperCase() }}
                                </div>
                                <h3 class="font-semibold mb-3 dark:text-gray-300 text-gray-800">{{ s.nama_lengkap }}
                                </h3>
                            </div>

                            <p class="text-sm mb-2 ml-10 dark:text-gray-400 text-gray-500">
                                {{ t.idColumnLabel }}: {{ s.nis ?? '-' }} / {{ s.nisn ?? '-' }}
                            </p>

                            <p class="text-sm mb-4 ml-10 dark:text-gray-400 text-gray-500">
                                {{ t.groupColumnLabel }}: {{ s.kelas?.kelas ?? '-' }}<span v-if="isSmk && !isWorkspace">
                                    ({{ s.kejuruan?.kejuruan ?? '-' }})</span>
                            </p>

                            <span
                                class="inline-flex ml-8 items-center gap-1 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border"
                                :class="{
                                    'bg-green-50 border-green-200 text-green-700': s.status === 'Activated',
                                    'bg-red-50 border-red-200 text-red-700': s.status === 'Deactivated',
                                }">
                                {{ s.status === 'Activated' ? 'Active' : 'Inactive' }}
                            </span>
                        </div>
                    </div>

                    <div class="absolute right-4 bottom-4 flex gap-2">
                        <Link :href="route('admin.siswa.edit', s.id)" class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                                   hover:bg-indigo-100 flex items-center justify-center">
                            <PencilSquareIcon class="w-5 h-5" />
                        </Link>

                        <button @click="hapus(s.id)"
                            class="w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center">
                            <TrashIcon class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <p v-if="filteredSiswa.length === 0" class="text-center py-6 text-gray-500">
                    {{ t.noDataMessage }}
                </p>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-center gap-2 mt-6">
                <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 rounded-md text-sm"
                    :class="currentPage === 1
                        ? 'bg-gray-100 dark:bg-transparent text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-transparent text-gray-600 hover:bg-gray-200'">
                    ‹ Prev
                </button>

                <button v-for="p in visiblePages" :key="p" @click="currentPage = p" class="px-3 py-1 rounded-md text-sm"
                    :class="p === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                    {{ p }}
                </button>

                <button @click="currentPage++" :disabled="currentPage === totalPages"
                    class="px-3 py-1 rounded-md text-sm" :class="currentPage === totalPages
                        ? 'bg-gray-100 dark:bg-transparent text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-transparent text-gray-600 hover:bg-gray-200'">
                    Next ›
                </button>
            </div>

        </div>
    </MenuLayout>
</template>