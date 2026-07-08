<script setup>
import OwnerLayout from '@/Layouts/OwnerLayout.vue'
import { Head, Link, router } from '@inertiajs/vue3'
import ConfirmDelete from '@/Components/Modals/ConfirmDelete.vue'
import AlertSuccess from '@/Components/Modals/AlertSuccess.vue'
import AlertError from '@/Components/Modals/AlertError.vue'
import UserDetailModal from '@/Components/Modals/UserDetailModal.vue'
import { ref, computed, watch } from 'vue'
import {
    PlusIcon, EnvelopeIcon, UserCircleIcon, PencilSquareIcon,
    TrashIcon, EyeIcon, Cog6ToothIcon, UserIcon, AcademicCapIcon,
    ShieldCheckIcon, ArrowPathIcon, SparklesIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
    users: Object,
    filters: Object,
    roleOptions: Array,
    roleLabels: Object,
    userCount: Number,
    maxUsers: { type: [Number, null], default: null },
})

const search = ref(props.filters.search ?? '')
const role = ref(props.filters.role ?? '')
const detailModal = ref(null)
const openDetail = (u) => {
    detailModal.value.open(u)
}

function applyFilters() {
    router.get(route('owner.users.index'), {
        search: search.value || undefined,
        role: role.value || undefined,
    }, { preserveState: true, preserveScroll: true, replace: true })
}

let debounceTimer = null
watch(search, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(applyFilters, 400)
})
watch(role, applyFilters)

function resetFilter() {
    search.value = ''
    role.value = ''
}

function roleLabel(u) {
    if (u.role === 'admin' && u.isSelf) return 'PIC / Super Admin'
    return props.roleLabels[u.role] ?? u.role
}

const roleBadgeClass = (u) => ({
    'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/40 dark:border-amber-600 dark:text-amber-300': u.role === 'admin' && u.isSelf,
    'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900 dark:border-purple-600 dark:text-purple-300': u.role === 'admin' && !u.isSelf,
    'bg-green-50 border-green-200 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300': u.role === 'guru',
    'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-300': u.role === 'proktor',
    'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300': u.role === 'siswa',
    'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300': u.role === 'user',
})

const deleteModal = ref(null)
const openDelete = (id) => {
    deleteModal.value.open(id, 'owner.users.destroy')
}

const limitReached = computed(() => props.maxUsers && props.userCount >= props.maxUsers)
</script>

<template>

    <Head title="Kelola Pengguna" />

    <OwnerLayout>
        <template #header>
            <h1 class="topbar-title">Kelola Pengguna</h1>
        </template>

        <div>
            <!-- Flash Alerts -->
            <AlertSuccess />
            <AlertError />

            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Kelola Pengguna
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ userCount }}<span v-if="maxUsers"> / {{ maxUsers }}</span> pengguna terdaftar di lembaga Anda
                    </p>
                </div>

                <Link v-if="!limitReached" :href="route('owner.users.create')"
                    class="px-5 py-2 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition sm:shadow-lg text-sm font-medium">
                    + Tambah Pengguna
                </Link>
            </div>

            <div v-if="limitReached"
                class="mb-6 rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/40 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                Batas jumlah pengguna ({{ maxUsers }}) untuk paket Anda sudah tercapai.
                <Link href="/lumiverse/pricing" class="font-semibold underline">Upgrade paket</Link> untuk menambah
                pengguna
                baru.
            </div>

            <!-- FILTER BAR -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 md:mb-6">
                <input v-model="search" placeholder="Cari nama atau email..."
                    class="w-full lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md transition" />

                <select v-model="role"
                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="">Semua Peran</option>
                    <option v-for="r in roleOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
                </select>

                <button @click="resetFilter"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-1 dark:border-gray-600 bg-gray-100 dark:bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                    <ArrowPathIcon class="w-4 h-4" />
                    Reset
                </button>
            </div>

            <!-- CARDS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(u, i) in users.data" :key="u.id"
                    class="relative rounded border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-5 backdrop-blur-md shadow-lg transition hover:shadow-xl">
                    <div
                        class="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500" />

                    <div class="flex items-center gap-4 mt-2">
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-800 dark:text-gray-100">
                                {{ u.name }}
                            </h3>

                            <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <EnvelopeIcon class="w-4 h-4" />
                                {{ u.email }}
                            </div>

                            <span
                                class="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border"
                                :class="roleBadgeClass(u)">
                                <SparklesIcon v-if="u.role === 'admin' && u.isSelf" class="w-4 h-4" />
                                <ShieldCheckIcon v-else-if="u.role === 'admin'" class="w-4 h-4" />
                                <AcademicCapIcon v-else-if="u.role === 'guru'" class="w-4 h-4" />
                                <Cog6ToothIcon v-else-if="u.role === 'proktor'" class="w-4 h-4" />
                                <UserIcon v-else class="w-4 h-4" />
                                {{ roleLabel(u) }}
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center gap-1 mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <UserCircleIcon class="w-4 h-4" />
                        {{ u.phone ?? 'Tidak ada nomor telepon' }}
                    </div>

                    <div class="absolute right-4 bottom-4 flex gap-2">
                        <!-- <button @click="openDetail(u)"
                            class="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition">
                            <EyeIcon class="w-5 h-5" />
                        </button> -->

                        <Link :href="route('owner.users.edit', u.id)"
                            class="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 flex items-center justify-center transition">
                            <PencilSquareIcon class="w-5 h-5" />
                        </Link>

                        <button @click="openDelete(u.id)"
                            class="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 flex items-center justify-center transition">
                            <TrashIcon class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDelete ref="deleteModal" title="Yakin ingin menghapus?"
                description="Menghapus pengguna ini akan menghilangkan seluruh data terkait secara permanen." />

            <UserDetailModal ref="detailModal" :role-labels="roleLabels" @delete="openDelete" />

            <div v-if="users.data.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
                Tidak ada data pengguna yang cocok.
            </div>

            <!-- PAGINATION -->
            <div v-if="users.links.length > 3" class="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <template v-for="(link, i) in users.links" :key="i">
                    <Link v-if="link.url" :href="link.url" preserve-scroll preserve-state
                        class="px-3 py-1 rounded-md text-sm transition"
                        :class="link.active
                            ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'" v-html="link.label" />
                    <span v-else
                        class="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        v-html="link.label" />
                </template>
            </div>
        </div>
    </OwnerLayout>
</template>

<style scoped>
div.relative:hover {
    backdrop-filter: blur(6px);
    background-color: rgba(255, 255, 255, 0.2);
    transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
}
</style>