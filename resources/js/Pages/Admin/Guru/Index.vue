<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ref } from 'vue'
import { PencilSquareIcon, TrashIcon, ArrowDownTrayIcon, PhotoIcon, DocumentIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import jsPDF from 'jspdf'

const props = defineProps({
    guru: Array,
})

const page = usePage()

// ─── Label statis (tanpa kondisional workspace) ─────────────────────────────
const pageTitle = 'Teacher List'
const heading = 'All Teachers'
const subheading = 'Manage teacher data'
const addBtn = 'Add Teacher'
const colName = 'Full Name'
const colCode = 'Teacher ID'
const emptyTable = 'No teacher data available'
const emptyCard = 'No teacher data available'
const editModalTitle = 'Edit Teacher Data'
const nameLabel = 'Teacher Name'
const codeLabel = 'Teacher ID / RFID Card No.'
const confirmDelete = 'Yakin ingin menghapus guru ini?'

const showModal = ref(false)
const saving = ref(false)

const showExportModal = ref(false)
const exporting = ref(false)

const form = ref({
    id: null,
    nama_lengkap: '',
    kode_guru: '',
})

const openEdit = (g) => {
    form.value.id = g.id
    form.value.nama_lengkap = g.nama_lengkap
    form.value.kode_guru = g.kode_guru
    showModal.value = true
}

const closeModal = () => {
    if (saving.value) return
    showModal.value = false
    form.value = { id: null, nama_lengkap: '', kode_guru: '' }
}

// UPDATE Guru
const update = () => {
    saving.value = true
    router.put(
        route('admin.guru.update', form.value.id),
        {
            nama_lengkap: form.value.nama_lengkap,
            kode_guru: form.value.kode_guru,
        },
        {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => { saving.value = false },
        }
    )
}

// HAPUS Guru
const hapus = (id) => {
    if (confirm(confirmDelete)) {
        router.delete(route('admin.guru.destroy', id))
    }
}

const buildRows = () => props.guru.map((g, i) => ({
    no: i + 1,
    nama: g.nama_lengkap,
    kode: g.kode_guru ?? '-',
}))

const exportAsImage = () => {
    if (!props.guru.length) return
    exporting.value = true

    setTimeout(() => {
        const rowHeight = 50
        const headerHeight = 100
        const tableHeaderHeight = 40
        const bottomPadding = 30
        const paddingX = 40
        const width = 700
        const height = headerHeight + tableHeaderHeight + (rowHeight * props.guru.length) + bottomPadding

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = '#1e3a8a'
        ctx.font = 'bold 24px sans-serif'
        ctx.fillText(heading, paddingX, 42)

        ctx.fillStyle = '#6b7280'
        ctx.font = '13px sans-serif'
        const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        ctx.fillText(`Diekspor pada ${tanggal}`, paddingX, 64)

        let y = headerHeight
        ctx.fillStyle = '#1e40af'
        ctx.fillRect(paddingX, y, width - paddingX * 2, tableHeaderHeight)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 14px sans-serif'
        ctx.fillText('No', paddingX + 14, y + 26)
        ctx.fillText(colName, paddingX + 60, y + 26)
        ctx.fillText(colCode, width - paddingX - 160, y + 26)

        y += tableHeaderHeight

        buildRows().forEach((row, i) => {
            ctx.fillStyle = i % 2 === 0 ? '#f9fafb' : '#ffffff'
            ctx.fillRect(paddingX, y, width - paddingX * 2, rowHeight)

            ctx.fillStyle = '#111827'
            ctx.font = '14px sans-serif'
            ctx.fillText(String(row.no), paddingX + 14, y + 30)
            ctx.fillText(row.nama, paddingX + 60, y + 30)

            ctx.fillStyle = '#1e3a8a'
            ctx.font = 'bold 14px monospace'
            ctx.fillText(row.kode, width - paddingX - 160, y + 30)

            y += rowHeight
        })

        ctx.strokeStyle = '#d1d5db'
        ctx.lineWidth = 1
        ctx.strokeRect(paddingX, headerHeight, width - paddingX * 2, y - headerHeight)

        const link = document.createElement('a')
        link.download = `daftar-guru-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()

        exporting.value = false
        showExportModal.value = false
    }, 50)
}

const exportAsPDF = () => {
    if (!props.guru.length) return
    exporting.value = true

    setTimeout(() => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' })
        const marginX = 40
        let y = 50

        doc.setFontSize(18)
        doc.setTextColor(30, 58, 138)
        doc.text(heading, marginX, y)

        y += 20
        doc.setFontSize(10)
        doc.setTextColor(107, 114, 128)
        const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        doc.text(`Diekspor pada ${tanggal}`, marginX, y)

        y += 25
        const rowHeight = 22
        const colNoX = marginX + 5
        const colNameX = marginX + 40
        const colCodeX = 400

        doc.setFillColor(30, 64, 175)
        doc.rect(marginX, y, 515, rowHeight, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text('No', colNoX, y + 15)
        doc.text(colName, colNameX, y + 15)
        doc.text(colCode, colCodeX, y + 15)
        y += rowHeight

        doc.setFont(undefined, 'normal')

        buildRows().forEach((row, i) => {
            if (y > 780) {
                doc.addPage()
                y = 50
            }

            doc.setFillColor(i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 251 : 255)
            doc.rect(marginX, y, 515, rowHeight, 'F')

            doc.setTextColor(17, 24, 39)
            doc.text(String(row.no), colNoX, y + 15)
            doc.text(row.nama, colNameX, y + 15)

            doc.setTextColor(30, 58, 138)
            doc.setFont(undefined, 'bold')
            doc.text(row.kode, colCodeX, y + 15)
            doc.setFont(undefined, 'normal')

            y += rowHeight
        })

        doc.save(`daftar-guru-${Date.now()}.pdf`)

        exporting.value = false
        showExportModal.value = false
    }, 50)
}
</script>

<template>

    <Head :title="pageTitle" />

    <MenuLayout>
        <div class="sm:bg-white/60 dark:sm:bg-gray-800/60 sm:backdrop-blur-md sm:rounded sm:shadow sm:p-6">

            <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 class="text-xl dark:text-gray-200 font-semibold">{{ heading }}</h1>
                    <p class="text-sm text-gray-500">{{ subheading }}</p>
                </div>

                <div class="flex items-center gap-2">
                    <button @click="showExportModal = true" :disabled="guru.length === 0"
                        class="flex items-center gap-2 px-4 py-2 rounded border border-blue-800 text-blue-800 dark:text-blue-300 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowDownTrayIcon class="w-4 h-4" />
                        <span>Export</span>
                    </button>

                    <Link :href="route('admin.guru.create')"
                        class="px-4 py-2 sm:block hidden rounded bg-blue-800 text-white hover:bg-blue-900 transition">
                        + <span>{{ addBtn }}</span>
                    </Link>
                </div>
            </div>

            <div
                class="hidden md:block rounded-lg overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
                <table class="w-full border-collapse">

                    <thead class="bg-blue-800 text-white">
                        <tr>
                            <th class="px-4 py-2 text-center border-r">No</th>
                            <th class="px-4 py-2 whitespace-nowrap text-center">{{ colName }}</th>
                            <th class="px-4 py-2 whitespace-nowrap text-center border-l">{{ colCode }}</th>
                            <th class="px-4 py-2 text-center border-l">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(g, index) in guru" :key="g.id"
                            class="border-t dark:border-none hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300">
                            <td class="px-4 py-2 text-center">{{ index + 1 }}</td>
                            <td class="px-10 whitespace-nowrap py-2">{{ g.nama_lengkap }}</td>
                            <td class="px-4 py-2 text-center whitespace-nowrap font-mono">{{ g.kode_guru ?? '-' }}</td>
                            <td class="px-4 py-2 text-center">
                                <div class="flex items-center justify-center gap-3">
                                    <button @click="openEdit(g)"
                                        class="text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300"
                                        title="Edit">
                                        <PencilSquareIcon class="w-5 h-5" />
                                    </button>
                                    <button @click="hapus(g.id)" class="text-red-600 hover:text-red-800" title="Delete">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="guru.length === 0">
                            <td colspan="4" class="text-center py-6 text-gray-500">
                                {{ emptyTable }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="md:hidden space-y-4">
                <div v-for="(g, index) in props.guru" :key="g.id"
                    class="bg-white/60 dark:bg-gray-700/50 rounded p-5 shadow hover:shadow-lg transition">
                    <div class="flex justify-between items-center mb-1">
                        <h2 class="font-semibold dark:text-white text-blue-600">{{ g.nama_lengkap }}</h2>
                        <span class="text-gray-500 dark:text-gray-300"># {{ index + 1 }}</span>
                    </div>
                    <p class="text-xs font-mono text-gray-500 dark:text-gray-400 mb-2">
                        {{ colCode }}: {{ g.kode_guru ?? '-' }}
                    </p>
                    <div class="flex gap-2 justify-end mt-3">
                        <button @click="openEdit(g)"
                            class="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition">
                            <PencilSquareIcon class="w-4 h-4" /> Edit
                        </button>
                        <button @click="hapus(g.id)"
                            class="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition">
                            <TrashIcon class="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>
                <div v-if="props.guru.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
                    {{ emptyCard }}
                </div>

                <Link href="/admin/guru/create" class="fixed bottom-6 right-5 z-50
               flex items-center gap-2
               px-6 py-3 rounded-full
               bg-gradient-to-r from-blue-600 to-indigo-600
               text-white font-semibold shadow-2xl
               active:scale-95 transition">
                    + Add
                </Link>
            </div>
        </div>
    </MenuLayout>

    <!-- EDIT MODAL -->
    <div v-if="showModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm transition flex items-center justify-center z-50">
        <div
            class="relative w-full max-w-md rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl p-6 m-3 transition">

            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ editModalTitle }}</h2>
                <button @click="closeModal" :disabled="saving"
                    class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>

            <!-- FULL NAME INPUT -->
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{{ nameLabel }}</label>
                <input v-model="form.nama_lengkap" type="text" :disabled="saving"
                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2
                          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60" />
            </div>

            <!-- KODE GURU / RFID INPUT -->
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{{ codeLabel }}</label>
                <input v-model="form.kode_guru" type="text" :disabled="saving"
                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 font-mono
                          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60" />
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Bisa diganti dengan nomor kartu RFID jika sudah tersedia.
                </p>
            </div>

            <div class="flex justify-end gap-2">
                <button @click="closeModal" :disabled="saving"
                    class="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed">
                    Cancel
                </button>
                <button @click="update" :disabled="saving"
                    class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed min-w-[90px]">
                    <svg v-if="saving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z">
                        </path>
                    </svg>
                    <span>{{ saving ? 'Saving...' : 'Save' }}</span>
                </button>
            </div>

        </div>
    </div>

    <!-- EXPORT CHOICE MODAL -->
    <div v-if="showExportModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm transition flex items-center justify-center z-50">
        <div
            class="relative w-full max-w-sm rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl p-6 m-3 transition">

            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Export Data Guru</h2>
                <button @click="showExportModal = false" :disabled="exporting"
                    class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Pilih format export yang diinginkan.
            </p>

            <div class="grid grid-cols-2 gap-3">
                <button @click="exportAsImage" :disabled="exporting"
                    class="flex flex-col items-center justify-center gap-2 py-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <PhotoIcon class="w-7 h-7 text-blue-700 dark:text-blue-300" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Image (PNG)</span>
                </button>

                <button @click="exportAsPDF" :disabled="exporting"
                    class="flex flex-col items-center justify-center gap-2 py-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <DocumentIcon class="w-7 h-7 text-blue-700 dark:text-blue-300" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">PDF</span>
                </button>
            </div>

            <div v-if="exporting"
                class="flex items-center justify-center gap-2 mt-5 text-sm text-gray-500 dark:text-gray-400">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Sedang membuat file...</span>
            </div>
        </div>
    </div>
</template>