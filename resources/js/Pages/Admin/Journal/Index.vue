<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, router, Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import {
    BookOpenIcon,
    ClockIcon,
    UserCircleIcon,
    ChevronRightIcon,
    MapPinIcon,
    TrashIcon,
    ArrowDownTrayIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({
    rekap: Array,
    filters: Object,
})

const search = ref(props.filters?.search || '')
const bulan = ref(props.filters?.bulan)
const tahun = ref(props.filters?.tahun)

const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const tahunOptions = computed(() => {
    const now = new Date().getFullYear()
    return [now - 2, now - 1, now, now + 1]
})

const applyFilters = () => {
    router.get(route('admin.journal.index'), {
        search: search.value,
        bulan: bulan.value,
        tahun: tahun.value,
    }, {
        only: ['rekap', 'filters'],
        preserveState: true,
        preserveScroll: true,
        replace: true,
    })
}

let searchTimeout = null
watch(search, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(applyFilters, 350)
})
watch([bulan, tahun], applyFilters)

const bukaDetail = (guruId) => {
    router.get(route('admin.journal.show', guruId), {
        bulan: bulan.value,
        tahun: tahun.value,
    })
}

const hapusRekap = (item) => {
    const namaPeriode = `${namaBulan[bulan.value - 1]} ${tahun.value}`

    Swal.fire({
        title: 'Hapus riwayat jurnal?',
        html: `Semua entri jurnal <b>${item.guru?.nama_lengkap}</b> untuk periode <b>${namaPeriode}</b> (${item.total_pertemuan}x pertemuan) akan dihapus permanen dan tidak bisa dikembalikan.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#e11d48',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
    }).then((result) => {
        if (!result.isConfirmed) return

        router.delete(route('admin.journal.destroyByGuru', item.guru_id), {
            data: { bulan: bulan.value, tahun: tahun.value },
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil dihapus',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                })
            },
            onError: () => {
                Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data.', 'error')
            },
        })
    })
}

const exportExcel = () => {
    window.location.href = route('admin.journal.export', {
        bulan: bulan.value,
        tahun: tahun.value,
        search: search.value,
    })
}

const inputClass = 'px-4 py-2.5 rounded-xl border text-sm bg-white border-gray-200 text-gray-800 \
    dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40'
</script>

<template>

    <Head title="Rekap Jurnal Mengajar" />

    <MenuLayout>
        <div class="mx-auto">

            <!-- Header -->
            <div class="flex items-center justify-between gap-3 mb-6">
                <div class="flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <BookOpenIcon class="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Rekap Jurnal Mengajar</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Total jam mengajar setiap guru</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button @click="exportExcel"
                        class="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/40">
                        <ArrowDownTrayIcon class="w-4 h-4" />
                        <span class="hidden sm:inline">Export Excel</span>
                    </button>

                    <Link :href="route('admin.journal-setting.edit')"
                        class="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity">
                        <MapPinIcon class="w-4 h-4" />
                        <span class="hidden sm:inline">Atur Lokasi</span>
                    </Link>
                </div>
            </div>

            <!-- Filters -->
            <div class="p-4 rounded-2xl border bg-white border-gray-100 shadow-sm mb-5
                        dark:bg-gray-900/60 dark:border-gray-800">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input v-model="search" type="text" placeholder="Cari nama guru..." :class="inputClass" />

                    <select v-model="bulan" :class="inputClass">
                        <option v-for="(nama, i) in namaBulan" :key="i" :value="i + 1">{{ nama }}</option>
                    </select>

                    <select v-model="tahun" :class="inputClass">
                        <option v-for="t in tahunOptions" :key="t" :value="t">{{ t }}</option>
                    </select>
                </div>
            </div>

            <template v-if="rekap.length">
                <!-- ================= DESKTOP: TABLE ================= -->
                <div class="hidden md:block rounded-2xl border overflow-hidden bg-white border-gray-100 shadow-sm
                            dark:bg-gray-900/60 dark:border-gray-800">
                    <table class="w-full text-sm">
                        <thead>
                            <tr
                                class="bg-gray-50 dark:bg-gray-800/60 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                <th class="px-5 py-3">Guru</th>
                                <th class="px-5 py-3">Jumlah Pertemuan</th>
                                <th class="px-5 py-3">Total Jam Mengajar</th>
                                <th class="px-5 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr v-for="item in rekap" :key="item.guru_id" @click="bukaDetail(item.guru_id)"
                                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer">
                                <td class="px-5 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 font-medium">
                                    {{ item.guru?.nama_lengkap }}
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                    {{ item.total_pertemuan }}x pertemuan
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap">
                                    <span
                                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400">
                                        <ClockIcon class="w-3.5 h-3.5" />
                                        {{ item.total_jam }} jam
                                    </span>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap text-right">
                                    <div class="flex items-center justify-end gap-3">
                                        <button @click.stop="hapusRekap(item)" title="Hapus riwayat periode ini"
                                            class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                                            <TrashIcon class="w-4 h-4" />
                                        </button>
                                        <ChevronRightIcon class="w-4 h-4 text-gray-400" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- ================= MOBILE: CARD ================= -->
                <div class="md:hidden space-y-3">
                    <div v-for="item in rekap" :key="item.guru_id" @click="bukaDetail(item.guru_id)" class="p-5 rounded-2xl border bg-white border-gray-100 shadow-sm active:scale-[0.99] transition-transform cursor-pointer
                               dark:bg-gray-900/60 dark:border-gray-800">
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2.5">
                                <UserCircleIcon class="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                <div>
                                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{
                                        item.guru?.nama_lengkap }}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.total_pertemuan }}x
                                        pertemuan</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400">
                                    <ClockIcon class="w-3.5 h-3.5" />
                                    {{ item.total_jam }} jam
                                </span>
                                <button @click.stop="hapusRekap(item)" title="Hapus riwayat periode ini"
                                    class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                                    <TrashIcon class="w-4 h-4" />
                                </button>
                                <ChevronRightIcon class="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Empty state -->
            <div v-else class="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <BookOpenIcon class="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada jurnal pada periode ini.</p>
            </div>
        </div>
    </MenuLayout>
</template>