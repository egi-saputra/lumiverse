<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, router, Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ref } from 'vue'
import {
    BookOpenIcon,
    ClockIcon,
    CalendarDaysIcon,
    ArrowLeftIcon,
    EyeIcon,
    XMarkIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({
    guru: Object,
    journals: Object,
    filters: Object,
})

const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const periodeLabel = `${namaBulan[props.filters.bulan - 1]} ${props.filters.tahun}`

const goToPage = (url) => {
    if (!url) return
    router.get(url, {}, {
        only: ['journals'],
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
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

const formatJam = (j) => j ? j.slice(0, 5) : ''

// ---- Modal detail materi ----
const materiAktif = ref(null)

const bukaModalMateri = (journal) => {
    materiAktif.value = journal
}

const tutupModalMateri = () => {
    materiAktif.value = null
}
</script>

<template>

    <Head :title="`Jurnal ${guru.nama_lengkap}`" />

    <MenuLayout>
        <div class="mx-auto">

            <!-- Header -->
            <div class="flex items-center gap-3 mb-6">
                <Link :href="route('admin.journal.index', { bulan: filters.bulan, tahun: filters.tahun })"
                    class="p-2 rounded-xl sm:flex hidden bg-gray-50 hover:bg-gray-100 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">
                    <ArrowLeftIcon class="w-4 h-4" />
                </Link>
                <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <BookOpenIcon class="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ guru.nama_lengkap }}</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Detail jurnal mengajar - Periode {{ periodeLabel
                        }}</p>
                </div>
            </div>

            <template v-if="journals.data.length">
                <!-- ================= DESKTOP: TABLE ================= -->
                <div class="hidden md:block rounded-2xl border overflow-hidden bg-white border-gray-100 shadow-sm
                            dark:bg-gray-900/60 dark:border-gray-800">
                    <table class="w-full text-sm">
                        <thead>
                            <tr
                                class="bg-gray-50 dark:bg-gray-800/60 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                <th class="px-5 py-3 text-center">Tanggal</th>
                                <th class="px-5 py-3 text-center">Jam</th>
                                <th class="px-5 py-3  text-center">Jumlah Jam</th>
                                <th class="px-5 py-3 text-center">Kelas</th>
                                <th class="px-5 py-3 text-center">Mapel</th>
                                <th class="px-5 py-3">Materi Pembelajaran</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr v-for="journal in journals.data" :key="journal.id"
                                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors align-top">
                                <td class="px-5 py-4 whitespace-nowrap text-center text-gray-700 dark:text-gray-300">
                                    {{ formatTanggalPendek(journal.tanggal) }}
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                                    {{ formatJam(journal.jam_mulai) }}<template v-if="journal.jam_selesai"> - {{
                                        formatJam(journal.jam_selesai) }}</template>
                                </td>
                                <td
                                    class="px-5 py-4 whitespace-nowrap text-center text-gray-600 dark:text-gray-300 font-medium">
                                    {{ journal.jumlah_jam }} jam
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap text-center">
                                    <span
                                        class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
                                        {{ journal.kelas?.kelas }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap text-center">
                                    <span
                                        class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                                        {{ journal.mapel?.mapel }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 max-w-xs">
                                    <div class="flex items-center gap-2">
                                        <p class="truncate text-gray-700 dark:text-gray-300">{{ journal.materi }}</p>
                                        <button @click="bukaModalMateri(journal)"
                                            class="flex-shrink-0 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">
                                            <EyeIcon class="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- ================= MOBILE: CARD ================= -->
                <div class="md:hidden space-y-3">
                    <div v-for="journal in journals.data" :key="journal.id" class="p-5 rounded-2xl border bg-white border-gray-100 shadow-sm
                               dark:bg-gray-900/60 dark:border-gray-800">
                        <div class="flex items-start justify-between gap-3 mb-2">
                            <div
                                class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
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
                            <span
                                class="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400">
                                {{ journal.jumlah_jam }} jam
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

                        <div class="flex items-start gap-2">
                            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 flex-1">
                                {{ journal.materi }}
                            </p>
                            <button @click="bukaModalMateri(journal)"
                                class="flex-shrink-0 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">
                                <EyeIcon class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Empty state -->
            <div v-else class="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <BookOpenIcon class="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada jurnal pada periode ini.</p>
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

            <!-- Modal: Detail Materi -->
            <Teleport to="body">
                <div v-if="materiAktif" @click.self="tutupModalMateri"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div class="w-full max-w-lg rounded-2xl bg-white border border-gray-100 shadow-xl
                                dark:bg-gray-900 dark:border-gray-800">
                        <div
                            class="flex items-start justify-between gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Materi Pembelajaran</h2>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {{ formatTanggal(materiAktif.tanggal) }} · {{ materiAktif.kelas?.kelas }} · {{
                                        materiAktif.mapel?.mapel }}
                                </p>
                            </div>
                            <button @click="tutupModalMateri"
                                class="flex-shrink-0 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">
                                <XMarkIcon class="w-4 h-4" />
                            </button>
                        </div>
                        <div class="p-5 max-h-[60vh] overflow-y-auto">
                            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {{ materiAktif.materi }}
                            </p>
                        </div>
                    </div>
                </div>
            </Teleport>
        </div>
    </MenuLayout>
</template>