<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3'
import { ref, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'

// ─── Label statis (tanpa kondisional workspace) ─────────────────────────────
const pageTitle = 'Add Teacher Data'
const heading = 'Add Teacher (Bulk)'
const subheading = 'Tekan Enter untuk menambah baris baru'
const nameLabel = 'Full Name + Title (Optional)'
const namePlaceholder = 'e.g., Budi Santoso, S. Pd'
const cancelRoute = 'admin.guru.index'
const saveBtn = 'Save All'

// ─── Generate preview kode guru (hanya tampilan, kode final digenerate di server) ───
const generatePreviewKode = () => {
    return String(Math.floor(10000000 + Math.random() * 90000000)) // 8 digit
}

// setiap baris: { nama_lengkap, kodePreview }
const rows = ref([
    { nama_lengkap: '', kodePreview: generatePreviewKode() },
])

// ref ke setiap input untuk auto-focus baris baru
const inputRefs = ref([])
const setInputRef = (el, index) => {
    if (el) inputRefs.value[index] = el
}

const addRow = async (index) => {
    // hanya tambah baris baru kalau ini baris terakhir dan tidak kosong
    if (index !== rows.value.length - 1) return
    if (!rows.value[index].nama_lengkap.trim()) return

    rows.value.push({ nama_lengkap: '', kodePreview: generatePreviewKode() })
    await nextTick()
    inputRefs.value[rows.value.length - 1]?.focus()
}

const removeRow = (index) => {
    if (rows.value.length === 1) {
        // kalau tinggal 1 baris, kosongkan saja daripada dihapus total
        rows.value[0].nama_lengkap = ''
        return
    }
    rows.value.splice(index, 1)
}

const form = useForm({
    nama_lengkap: [],
})

const submit = () => {
    const namaList = rows.value
        .map(r => r.nama_lengkap.trim())
        .filter(n => n.length > 0)

    if (namaList.length === 0) return

    form.nama_lengkap = namaList
    form.post(route('admin.guru.store'))
}
</script>

<template>

    <Head :title="pageTitle" />

    <MenuLayout>
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition">
            <h1 class="text-xl dark:text-gray-200 font-semibold">{{ heading }}</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{{ subheading }}</p>

            <form @submit.prevent="submit" class="space-y-3">

                <div v-for="(row, index) in rows" :key="index" class="flex items-end gap-3">

                    <!-- Full Name -->
                    <div class="flex-1">
                        <label v-if="index === 0" class="block text-sm font-medium dark:text-gray-400 mb-1">
                            {{ nameLabel }}
                        </label>
                        <input :ref="el => setInputRef(el, index)" v-model="row.nama_lengkap" type="text"
                            :placeholder="namePlaceholder" :disabled="form.processing"
                            @keydown.enter.prevent="addRow(index)"
                            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60" />
                    </div>

                    <!-- Kode Guru (preview, auto-generate) -->
                    <div class="w-36">
                        <label v-if="index === 0" class="block text-sm font-medium dark:text-gray-400 mb-1">
                            ID Guru
                        </label>
                        <div
                            class="w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-100/60 dark:bg-gray-700/30 px-4 py-2 text-gray-500 dark:text-gray-400 text-sm select-none">
                            {{ row.kodePreview }}
                        </div>
                    </div>

                    <!-- Tombol Hapus -->
                    <button type="button" @click="removeRow(index)" :disabled="form.processing"
                        :class="index === 0 ? 'mb-0' : ''"
                        class="p-2 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Hapus baris">
                        <XMarkIcon class="w-5 h-5" />
                    </button>
                </div>

                <div v-if="form.errors.nama_lengkap" class="text-red-500 text-sm">
                    {{ form.errors.nama_lengkap }}
                </div>

                <p class="text-xs text-gray-400 dark:text-gray-500 pt-1">
                    Kode guru di atas hanya pratinjau — kode final akan dibuat otomatis oleh sistem saat data disimpan.
                </p>

                <div class="flex justify-end gap-2 pt-4">
                    <Link :href="route(cancelRoute)" :class="{ 'pointer-events-none opacity-50': form.processing }"
                        class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        Cancel
                    </Link>
                    <button type="submit" :disabled="form.processing"
                        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-800 transition disabled:opacity-70 disabled:cursor-not-allowed min-w-[110px]">
                        <svg v-if="form.processing" class="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <span>{{ form.processing ? 'Saving...' : saveBtn }}</span>
                    </button>
                </div>
            </form>
        </div>
    </MenuLayout>
</template>