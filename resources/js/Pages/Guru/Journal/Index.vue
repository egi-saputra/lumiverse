<script setup>
import UserLayout from '@/Layouts/UserLayout.vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ref, watch } from 'vue'
import {
    PlusIcon,
    PencilSquareIcon,
    BookOpenIcon,
    ClockIcon,
    CalendarDaysIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({
    journals: Object,
    filters: Object,
})

const page = usePage()
const search = ref(props.filters?.search || '')
const tanggal = ref(props.filters?.tanggal || '')

let searchTimeout = null
watch([search, tanggal], () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        router.get(route('guru.journal.index'), {
            search: search.value,
            tanggal: tanggal.value,
        }, {
            only: ['journals', 'filters'], // partial reload — cuma data ini yang di-fetch ulang
            preserveState: true,
            preserveScroll: true,
            replace: true,
        })
    }, 350)
})

const goToPage = (url) => {
    if (!url) return
    router.get(url, {}, {
        only: ['journals', 'filters'],
        preserveState: true,
        preserveScroll: true,
    })
}

const formatTanggal = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

const formatTanggalPendek = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

const formatJam = (j) => j ? j.slice(0, 5) : ''
</script>

<template>

    <Head title="Jurnal Mengajar" />

    <UserLayout>
        <div class="mx-auto">

            <!-- Flash message -->
            <div v-if="page.props.flash?.success" class="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium
                       dark:bg-emerald-900/20 dark:border-emerald-500/20 dark:text-emerald-400">
                {{ page.props.flash.success }}
            </div>
            <div v-if="page.props.flash?.error" class="mb-5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium
                       dark:bg-rose-900/20 dark:border-rose-500/20 dark:text-rose-400">
                {{ page.props.flash.error }}
            </div>

            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div class="flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <BookOpenIcon class="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Jurnal Mengajar</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Absensi harian & catatan materi kelas</p>
                    </div>
                </div>

                <Link :href="route('guru.journal.create')"
                    class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500
                           text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-opacity">
                    <PlusIcon class="w-4 h-4" />
                    Isi Jurnal
                </Link>
            </div>

            <!-- Filters -->
            <div class="flex flex-col sm:flex-row gap-3 mb-5">
                <input v-model="search" type="text" placeholder="Cari materi..."
                    class="flex-1 px-4 py-2.5 rounded-xl border text-sm bg-white border-gray-200 text-gray-800
                           dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" />
                <input v-model="tanggal" type="date" class="px-4 py-2.5 rounded-xl border text-sm bg-white border-gray-200 text-gray-800
                           dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40
                           dark:[color-scheme:dark] [color-scheme:light]" />
            </div>

            <template v-if="journals.data.length">
                <!-- ================= DESKTOP: TABLE ================= -->
                <div class="hidden md:block rounded-2xl border overflow-hidden bg-white border-gray-100 shadow-sm
                            dark:bg-gray-900/60 dark:border-gray-800">
                    <table class="w-full text-sm">
                        <thead>
                            <tr
                                class="bg-gray-50 dark:bg-gray-800/60 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                <th class="px-5 py-3">Tanggal</th>
                                <th class="px-5 py-3">Jam</th>
                                <th class="px-5 py-3">Kelas</th>
                                <th class="px-5 py-3">Mapel</th>
                                <th class="px-5 py-3">Materi</th>
                                <th class="px-5 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr v-for="journal in journals.data" :key="journal.id"
                                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors align-top">
                                <td class="px-5 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                                    {{ formatTanggalPendek(journal.tanggal) }}
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                    {{ formatJam(journal.jam_mulai) }}<template v-if="journal.jam_selesai"> - {{
                                        formatJam(journal.jam_selesai) }}</template>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap">
                                    <span
                                        class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
                                        {{ journal.kelas?.kelas }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap">
                                    <span
                                        class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                                        {{ journal.mapel?.mapel }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 text-gray-700 dark:text-gray-300 max-w-md">
                                    {{ journal.materi }}
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap text-right">
                                    <Link :href="route('guru.journal.edit', journal.id)"
                                        class="inline-flex p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">
                                        <PencilSquareIcon class="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- ================= MOBILE: CARD ================= -->
                <div class="md:hidden space-y-3">
                    <div v-for="journal in journals.data" :key="journal.id" class="p-5 rounded-2xl border bg-white border-gray-100 shadow-sm
                               dark:bg-gray-900/60 dark:border-gray-800">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex-1">
                                <div
                                    class="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span class="inline-flex items-center gap-1">
                                        <CalendarDaysIcon class="w-4 h-4" />
                                        {{ formatTanggal(journal.tanggal) }}
                                    </span>
                                    <span class="inline-flex items-center gap-1">
                                        <ClockIcon class="w-4 h-4" />
                                        {{ formatJam(journal.jam_mulai) }}<template v-if="journal.jam_selesai"> - {{
                                            formatJam(journal.jam_selesai) }}</template>
                                    </span>
                                </div>

                                <div class="flex flex-wrap gap-2 mb-2">
                                    <span
                                        class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
                                        {{ journal.kelas?.kelas }}
                                    </span>
                                    <span
                                        class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                                        {{ journal.mapel?.mapel }}
                                    </span>
                                </div>

                                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ journal.materi }}
                                </p>
                            </div>

                            <Link :href="route('guru.journal.edit', journal.id)"
                                class="flex-shrink-0 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">
                                <PencilSquareIcon class="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Empty state -->
            <div v-else class="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <BookOpenIcon class="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p class="text-sm text-gray-500 dark:text-gray-400">Belum ada jurnal mengajar yang diisi.</p>
            </div>

            <!-- Pagination -->
            <div v-if="journals.links.length > 3" class="flex flex-wrap gap-2 mt-6 justify-center">
                <button v-for="(link, i) in journals.links" :key="i" @click="goToPage(link.url)" v-html="link.label"
                    :disabled="!link.url" class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                    :class="[
                        link.active ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white dark:bg-gray-900/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800',
                        !link.url ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]" />
            </div>
        </div>
    </UserLayout>
</template>