<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3'
import { ref, nextTick } from 'vue'

const props = defineProps({
    guru: Array, // menerima list guru dari controller
})

// ─── Label statis (tanpa kondisional workspace) ─────────────────────────────
const pageTitle = 'Add Subject'
const heading = 'Add Subject Data (Bulk)'
const subheading = 'Isi nama mapel di sebelah nama guru yang mengampu. Tekan Enter untuk pindah ke baris berikutnya. Baris yang dikosongkan akan diabaikan.'
const colGuru = 'Teacher'
const colMapel = 'Subject Name'
const mapelPlaceholder = 'Enter subject name...'
const cancelRoute = 'admin.mapel.index'
const saveBtn = 'Save All'

// satu baris per guru: { guru_id, nama_lengkap, mapel }
const rows = ref(
    props.guru.map(g => ({
        guru_id: g.id,
        nama_lengkap: g.nama_lengkap,
        mapel: '',
    }))
)

// ref ke setiap input mapel, untuk pindah fokus pakai Enter
const inputRefs = ref([])
const setInputRef = (el, index) => {
    if (el) inputRefs.value[index] = el
}

const focusNext = async (index) => {
    await nextTick()
    inputRefs.value[index + 1]?.focus()
}

const form = useForm({
    items: [],
})

const submit = () => {
    const items = rows.value
        .filter(r => r.mapel.trim().length > 0)
        .map(r => ({
            mapel: r.mapel.trim(),
            guru_id: r.guru_id,
        }))

    if (items.length === 0) return

    form.items = items
    form.post(route('admin.mapel.store'))
}
</script>

<template>

    <Head :title="pageTitle" />

    <MenuLayout>
        <div class="mx-auto sm:p-6">
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ heading }}</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{{ subheading }}</p>

                <form @submit.prevent="submit" class="space-y-4">

                    <div v-if="rows.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
                        Semua guru sudah memiliki mapel, atau belum ada data guru. Tambahkan guru baru jika diperlukan.
                    </div>

                    <template v-else>
                        <!-- Header kolom -->
                        <div class="hidden sm:flex gap-3 px-1">
                            <div class="w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300">{{ colGuru }}</div>
                            <div class="w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300">{{ colMapel }}</div>
                        </div>

                        <div v-for="(row, index) in rows" :key="row.guru_id"
                            class="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">

                            <!-- Nama Guru (readonly) -->
                            <div
                                class="sm:w-1/2 px-4 py-2 rounded-xl bg-gray-100/70 dark:bg-gray-700/40 text-gray-800 dark:text-gray-200 text-sm">
                                {{ row.nama_lengkap }}
                            </div>

                            <!-- Nama Mapel -->
                            <div class="sm:w-1/2">
                                <input :ref="el => setInputRef(el, index)" v-model="row.mapel" type="text"
                                    :placeholder="mapelPlaceholder" :disabled="form.processing"
                                    @keydown.enter.prevent="focusNext(index)"
                                    class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60" />
                            </div>
                        </div>
                    </template>

                    <div v-if="form.errors.items" class="text-red-600 text-sm mt-1">
                        {{ form.errors.items }}
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end gap-3 pt-4">
                        <Link :href="route(cancelRoute)" :class="{ 'pointer-events-none opacity-50': form.processing }"
                            class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            Cancel
                        </Link>

                        <button type="submit" :disabled="form.processing || rows.length === 0"
                            class="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition min-w-[110px]">
                            <svg v-if="form.processing" class="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <span>{{ form.processing ? 'Saving...' : saveBtn }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </MenuLayout>
</template>

<style scoped>
/* Optional: smooth shadow & hover for better UI feel */
input:focus {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}
</style>