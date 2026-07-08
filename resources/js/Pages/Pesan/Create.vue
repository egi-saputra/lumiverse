<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { ref, computed, watch } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import { ToastAlert } from '@/Composables/ToastAlert.js'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilSquareIcon,
    PaperAirplaneIcon,
    ArrowPathIcon,
} from '@heroicons/vue/24/outline'

// ─── Props ───────────────────────────────────────────────────
// BUG FIX: myPesan adalah Array biasa (bukan Object paginasi)
// karena controller mengembalikan ->get() bukan ->paginate()
const props = defineProps({
    kelas: { type: Array, default: () => [] },
    myPesan: { type: Array, default: () => [] },
})

const { success, error } = ToastAlert()

// ─── Form ─────────────────────────────────────────────────────
// BUG FIX: field 'isi' (bukan 'pengumuman') sesuai tabel & controller
const form = useForm({
    judul: '',
    isi: '',
    penerima: 'semua',
    kelas_id: null,
})

// Reset kelas_id saat penerima bukan siswa
watch(() => form.penerima, (val) => {
    if (val !== 'siswa') form.kelas_id = null
})

const submit = () => {
    form.post(route('pesan.store'), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset()
            success('Pesan berhasil dikirim!')
        },
        onError: () => error('Gagal mengirim pesan. Periksa kembali isian form.'),
    })
}

// ─── Sent list (optimistic sync) ──────────────────────────────
// BUG FIX: props.myPesan adalah array langsung, tidak perlu .data
const localPesan = ref([...props.myPesan])

// Sinkronisasi saat Inertia refresh props (setelah store/delete)
watch(() => props.myPesan, (val) => {
    localPesan.value = [...(val ?? [])]
})

// ─── Client-side pagination ───────────────────────────────────
const PER_PAGE = 5
const currentPage = ref(1)

const totalPages = computed(() =>
    Math.max(1, Math.ceil(localPesan.value.length / PER_PAGE))
)

const paginated = computed(() => {
    const start = (currentPage.value - 1) * PER_PAGE
    return localPesan.value.slice(start, start + PER_PAGE)
})

watch(totalPages, (t) => {
    if (currentPage.value > t) currentPage.value = t
})

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

// ─── Delete one ───────────────────────────────────────────────
const deleting = ref(null)

const deletePesan = (id) => {
    if (!confirm('Hapus pesan ini?')) return
    deleting.value = id

    router.delete(route('pesan.destroy', id), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            localPesan.value = localPesan.value.filter(p => p.id !== id)
            success('Pesan dihapus.')
        },
        onError: () => error('Gagal menghapus pesan.'),
        onFinish: () => { deleting.value = null },
    })
}

// ─── Delete all ───────────────────────────────────────────────
const deletingAll = ref(false)

const deleteAll = () => {
    if (!confirm('Hapus semua pesan yang Anda kirim?')) return
    deletingAll.value = true

    router.delete(route('pesan.deleteAll'), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            localPesan.value = []
            currentPage.value = 1
            success('Semua pesan dihapus.')
        },
        onError: () => error('Gagal menghapus semua pesan.'),
        onFinish: () => { deletingAll.value = false },
    })
}

// ─── Display helpers ──────────────────────────────────────────
// BUG FIX: gunakan item.kelas (relasi eager-loaded) bukan lookup manual
const labelPenerima = (item) => {
    if (item.penerima === 'semua') return 'Semua User'
    if (item.penerima === 'siswa') {
        return item.kelas
            ? `Siswa — Kelas ${item.kelas.kelas}`
            : 'Siswa (Semua Kelas)'
    }
    return item.penerima.charAt(0).toUpperCase() + item.penerima.slice(1)
}

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
</script>

<template>
    <MenuLayout>
        <div class="mx-auto space-y-10 px-4 py-6">

            <!-- ══════════════════════════════════════
                 COMPOSE FORM
            ══════════════════════════════════════ -->
            <section class="rounded-2xl border border-white/20 dark:border-white/10
                            bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8">

                <!-- Header -->
                <div class="flex items-center gap-3 mb-8">
                    <div class="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
                        <PencilSquareIcon class="w-6 h-6" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white leading-tight">
                            Kirim Pesan
                        </h1>
                        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Kirim informasi atau pesan kepada role atau kelas tertentu.
                        </p>
                    </div>
                </div>

                <form @submit.prevent="submit" novalidate class="space-y-6">

                    <!-- Judul -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Judul Pesan <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.judul" type="text" maxlength="255" placeholder="Masukkan judul pesan..."
                            :class="[
                                'w-full rounded-xl px-4 py-3 transition',
                                'bg-white dark:bg-[#0F172A]',
                                'text-gray-800 dark:text-gray-100',
                                'placeholder-gray-400 dark:placeholder-gray-600',
                                'focus:outline-none focus:ring-2 focus:border-transparent',
                                form.errors.judul
                                    ? 'border border-red-500 focus:ring-red-400'
                                    : 'border border-gray-300 dark:border-white/10 focus:ring-indigo-500',
                            ]" />
                        <p v-if="form.errors.judul" class="mt-1 text-xs text-red-500">
                            {{ form.errors.judul }}
                        </p>
                    </div>

                    <!-- Isi Pesan -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Isi Pesan <span class="text-red-500">*</span>
                        </label>
                        <div class="rounded-xl overflow-hidden border shadow-sm" :class="form.errors.isi
                            ? 'border-red-500'
                            : 'border-gray-300 dark:border-white/10'">
                            <QuillEditor v-model:content="form.isi" content-type="html" theme="snow"
                                placeholder="Tulis pesan di sini..." class="pesan-editor" :toolbar="[
                                    ['bold', 'italic', 'underline'],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    [{ align: [] }],
                                    ['clean'],
                                ]" />
                            <div class="flex justify-end border-t border-gray-200 dark:border-white/10
                                        px-3 py-1.5 bg-white dark:bg-[#0F172A]">
                                <span class="text-xs text-gray-400 dark:text-gray-500">
                                    Powered by
                                    <strong class="text-gray-600 dark:text-gray-300">Lumiverse</strong>
                                </span>
                            </div>
                        </div>
                        <p v-if="form.errors.isi" class="mt-1 text-xs text-red-500">
                            {{ form.errors.isi }}
                        </p>
                    </div>

                    <!-- Penerima -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Penerima <span class="text-red-500">*</span>
                        </label>
                        <select v-model="form.penerima" class="w-full rounded-xl px-4 py-3 transition
                                   bg-white dark:bg-[#0F172A]
                                   border border-gray-300 dark:border-white/10
                                   text-gray-800 dark:text-gray-100
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="semua">Semua Pengguna</option>
                            <option value="admin">Admin</option>
                            <option value="guru">Guru</option>
                            <option value="proktor">Proktor</option>
                            <option value="siswa">Siswa</option>
                        </select>
                        <p v-if="form.errors.penerima" class="mt-1 text-xs text-red-500">
                            {{ form.errors.penerima }}
                        </p>
                    </div>

                    <Transition name="slide-fade">
                        <div v-if="form.penerima === 'siswa'" key="kelas-field">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Filter Kelas
                            </label>
                            <select v-model="form.kelas_id" class="w-full rounded-xl px-4 py-3 transition
                                       bg-white dark:bg-[#0F172A]
                                       border border-gray-300 dark:border-white/10
                                       text-gray-800 dark:text-gray-100
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option :value="null">— Semua Kelas —</option>

                                <!-- BUG FIX: debug guard — tampilkan pesan jika kelas kosong -->
                                <template v-if="kelas && kelas.length > 0">
                                    <option v-for="k in kelas" :key="k.id" :value="k.id">
                                        {{ k.kelas }}
                                    </option>
                                </template>
                                <option v-else disabled value="">
                                    (Tidak ada data kelas)
                                </option>
                            </select>
                            <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                * Biarkan "Semua Kelas" untuk broadcast ke seluruh kelas
                            </p>
                            <p v-if="form.errors.kelas_id" class="mt-1 text-xs text-red-500">
                                {{ form.errors.kelas_id }}
                            </p>
                        </div>
                    </Transition>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="form.reset()" :disabled="form.processing" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                                   bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15
                                   text-gray-700 dark:text-gray-200 transition disabled:opacity-50">
                            <ArrowPathIcon class="w-4 h-4" />
                            Reset
                        </button>

                        <button type="submit" :disabled="form.processing" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm
                                   bg-gradient-to-r from-indigo-600 to-purple-600
                                   hover:from-indigo-700 hover:to-purple-700
                                   text-white shadow-md hover:shadow-lg
                                   transition disabled:opacity-60">
                            <svg v-if="form.processing" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <PaperAirplaneIcon v-else class="w-4 h-4" />
                            {{ form.processing ? 'Mengirim...' : 'Kirim Pesan' }}
                        </button>
                    </div>
                </form>
            </section>

            <!-- ══════════════════════════════════════
                 PESAN TERKIRIM
            ══════════════════════════════════════ -->
            <section class="rounded-2xl border border-white/20 dark:border-white/10
                            bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8">

                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        📤 Pesan Terkirim
                        <span class="text-sm font-normal text-gray-400 dark:text-gray-500">
                            ({{ localPesan.length }})
                        </span>
                    </h2>
                    <button v-if="localPesan.length > 0" @click="deleteAll" :disabled="deletingAll" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg
                               text-sm font-semibold bg-red-600 hover:bg-red-700
                               text-white transition disabled:opacity-60">
                        <TrashIcon class="w-4 h-4" />
                        {{ deletingAll ? 'Menghapus...' : 'Hapus Semua' }}
                    </button>
                </div>

                <!-- Empty state -->
                <div v-if="localPesan.length === 0"
                    class="py-14 text-center text-gray-400 dark:text-gray-500 italic text-sm">
                    Belum ada pesan yang dikirim.
                </div>

                <!-- List -->
                <ul v-else class="space-y-4">
                    <li v-for="item in paginated" :key="item.id" class="rounded-xl p-5
                               bg-white dark:bg-[#0F172A]
                               border border-gray-200 dark:border-white/10
                               shadow-sm hover:shadow-md transition">
                        <div class="flex justify-between gap-4">
                            <div class="flex-1 min-w-0">
                                <span class="inline-block mb-2 px-2.5 py-0.5 text-xs font-semibold rounded-full
                                             bg-indigo-100 text-indigo-700
                                             dark:bg-indigo-900/40 dark:text-indigo-300">
                                    Ke: {{ labelPenerima(item) }}
                                </span>
                                <h3 class="font-bold text-base text-gray-800 dark:text-white truncate">
                                    {{ item.judul }}
                                </h3>
                                <div class="prose prose-sm dark:prose-invert max-w-none mt-1.5 text-sm pesan-preview"
                                    v-html="item.isi" />
                                <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                    {{ formatDate(item.created_at) }}
                                </p>
                            </div>
                            <button @click="deletePesan(item.id)" :disabled="deleting === item.id" class="shrink-0 text-gray-400 hover:text-red-500
                                       transition disabled:opacity-40 self-start mt-1" title="Hapus pesan">
                                <TrashIcon class="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                </ul>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex justify-center items-center gap-3 mt-6">
                    <button @click="prevPage" :disabled="currentPage === 1" class="p-2 rounded-lg bg-gray-100 dark:bg-white/10
                               hover:bg-gray-200 dark:hover:bg-white/20
                               transition disabled:opacity-40">
                        <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <span class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10
                                 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button @click="nextPage" :disabled="currentPage === totalPages" class="p-2 rounded-lg bg-gray-100 dark:bg-white/10
                               hover:bg-gray-200 dark:hover:bg-white/20
                               transition disabled:opacity-40">
                        <ChevronRightIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </section>

        </div>
    </MenuLayout>
</template>

<style>
/* ── Quill Dark Mode ─────────────────────────────────────── */
.dark .pesan-editor .ql-editor {
    color: #f3f4f6 !important;
}

.dark .pesan-editor .ql-editor * {
    color: inherit !important;
    background: transparent !important;
}

.dark .pesan-editor .ql-editor.ql-blank::before {
    color: #6b7280 !important;
}

.dark .pesan-editor .ql-toolbar {
    border-color: rgba(255, 255, 255, .1);
    background: #0F172A;
}

.dark .pesan-editor .ql-container {
    border-color: rgba(255, 255, 255, .1);
    background: #0F172A;
}

.dark .pesan-editor .ql-stroke {
    stroke: #d1d5db !important;
}

.dark .pesan-editor .ql-fill {
    fill: #d1d5db !important;
}

.dark .pesan-editor .ql-picker {
    color: #d1d5db !important;
}
</style>

<style scoped>
.pesan-preview {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all .25s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
