<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3'
import ConfirmDelete from '@/Components/Modals/ConfirmDelete.vue'
import AlertSuccess from '@/Components/Modals/AlertSuccess.vue'
import AlertError from '@/Components/Modals/AlertError.vue'
import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
    EnvelopeIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    UserIcon,
    AcademicCapIcon,
    ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'

/* PROPS */
const props = defineProps({
    users: {
        type: Array,
        required: true,
    },
})

/* STATE */
const search = ref('')
const role = ref('')
const sort = ref('asc')
const currentPage = ref(1)
const perPage = 12

/* FILTER + SORT */
const filteredUsers = computed(() => {
    let data = [...props.users]

    if (search.value) {
        data = data.filter(u =>
            u.name.toLowerCase().includes(search.value.toLowerCase())
        )
    }

    if (role.value) {
        data = data.filter(u => u.role === role.value)
    }

    data.sort((a, b) =>
        sort.value === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
    )

    return data
})

/* PAGINATION */
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredUsers.value.slice(start, start + perPage)
})

const totalPages = computed(() =>
    Math.ceil(filteredUsers.value.length / perPage)
)

const MAX_VISIBLE_PAGES = 10

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value

    if (total <= MAX_VISIBLE_PAGES) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const half = Math.floor(MAX_VISIBLE_PAGES / 2)

    let start = current - half
    let end = current + half - 1

    if (start < 1) {
        start = 1
        end = MAX_VISIBLE_PAGES
    }

    if (end > total) {
        end = total
        start = total - MAX_VISIBLE_PAGES + 1
    }

    return Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
    )
})

/* RESET */
const resetFilter = () => {
    search.value = ''
    role.value = ''
    sort.value = 'asc'
    currentPage.value = 1
}

/* FLASH */
const confirm = () => {
    router.delete(route(deleteRoute.value, deleteId.value), {
        onSuccess: () => {
            // flash dari server akan muncul
        }
    })
    close()
}

const deleteModal = ref(null)

const openDelete = (id) => {
    deleteModal.value.open(id, 'admin.users.destroy')
}
</script>

<template>

    <Head title="Users Management" />

    <MenuLayout>
        <div>

            <!-- Flash Alerts -->
            <AlertSuccess />
            <AlertError />

            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div class="flex items-center gap-3">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            Users Management
                        </h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Manage room for registered users
                        </p>
                    </div>
                </div>

                <Link :href="route('admin.users.create')"
                    class="px-5 py-2 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition sm:shadow-lg text-sm font-medium">
                    + Create User
                </Link>
            </div>

            <!-- FILTER BAR -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 md:mb-6">
                <!-- Search -->
                <input v-model="search" placeholder="Search by name..."
                    class="w-full lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md transition" />

                <div class="flex md:flex-row flex-cols gap-3">
                    <!-- Role Filter -->
                    <select v-model="role"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                        <option value="">All Roles</option>
                        <option value="guru">Guru</option>
                        <option value="proktor">Proktor</option>
                        <option value="siswa">Siswa</option>
                        <option value="user">User</option>
                    </select>

                    <!-- Sort -->
                    <select v-model="sort"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                        <option value="asc">Sort A – Z</option>
                        <option value="desc">Sort Z – A</option>
                    </select>
                </div>

                <!-- Reset -->
                <button @click="resetFilter"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-1 dark:border-gray-600 bg-gray-100 dark:bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                    <ArrowPathIcon class="w-4 h-4" />
                    Reset
                </button>
            </div>

            <!-- CARDS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(user, i) in paginatedUsers" :key="user.id"
                    class="relative rounded border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-5 backdrop-blur-md shadow-lg transition hover:shadow-xl">
                    <!-- Accent Gradient -->
                    <div
                        class="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500">
                    </div>

                    <!-- User Info -->
                    <div class="flex items-center gap-4 mt-2">
                        <!-- <div
                            class="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                            {{ user.name.charAt(0).toUpperCase() }}
                        </div> -->

                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-800 dark:text-gray-100">
                                {{ user.name }}
                            </h3>

                            <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <EnvelopeIcon class="w-4 h-4" />
                                {{ user.email }}
                            </div>

                            <!-- Role Badge -->
                            <span
                                class="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border"
                                :class="{
                                    'bg-green-50 border-green-200 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300': user.role === 'guru',
                                    'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-300': user.role === 'proktor',
                                    'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300': user.role === 'siswa',
                                }">
                                <AcademicCapIcon v-if="user.role === 'guru'" class="w-4 h-4" />
                                <Cog6ToothIcon v-else-if="user.role === 'proktor'" class="w-4 h-4" />
                                <UserIcon v-else class="w-4 h-4" />
                                {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
                            </span>
                        </div>
                    </div>

                    <!-- Meta -->
                    <div class="flex items-center gap-1 mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <UserCircleIcon class="w-4 h-4" />
                        User #{{ (currentPage - 1) * perPage + i + 1 }}
                    </div>

                    <!-- Actions -->
                    <div class="absolute right-4 bottom-4 flex gap-2">
                        <Link :href="route('admin.users.edit', user.id)"
                            class="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 flex items-center justify-center transition">
                            <PencilSquareIcon class="w-5 h-5" />
                        </Link>

                        <button v-if="user.role !== 'admin'" @click="openDelete(user.id)"
                            class="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 flex items-center justify-center transition">
                            <TrashIcon class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- DELETE CONFIRM MODAL -->
            <ConfirmDelete ref="deleteModal" title="Are you sure ?"
                description="Deleting this user will permanently remove all related data." />

            <!-- EMPTY STATE -->
            <div v-if="filteredUsers.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
                Tidak ada data user
            </div>

            <!-- PAGINATION -->
            <div class="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <!-- Prev -->
                <button @click="currentPage--" :disabled="currentPage === 1"
                    class="px-3 py-1 rounded-md text-sm transition"
                    :class="currentPage === 1
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
                    ‹ Prev
                </button>

                <!-- Pages -->
                <button v-for="p in visiblePages" :key="p" @click="currentPage = p"
                    class="px-3 py-1 rounded-md text-sm transition"
                    :class="p === currentPage
                        ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
                    {{ p }}
                </button>

                <!-- Next -->
                <button @click="currentPage++" :disabled="currentPage === totalPages"
                    class="px-3 py-1 rounded-md text-sm transition"
                    :class="currentPage === totalPages
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
                    Next ›
                </button>
            </div>
        </div>
    </MenuLayout>
</template>

<style scoped>
/* subtle glassmorphism effect on hover */
div.relative:hover {
    backdrop-filter: blur(6px);
    background-color: rgba(255, 255, 255, 0.2);
    transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
}
</style>
