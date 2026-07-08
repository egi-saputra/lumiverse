<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { ref } from 'vue'
import { useForm, Link, router } from '@inertiajs/vue3'
import { ToastAlert } from '@/Composables/ToastAlert.js'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ArrowLeftIcon, PhotoIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    pengumuman: { type: Object, required: true },
})

const { success, error } = ToastAlert()

const form = useForm({
    judul: props.pengumuman.judul ?? '',
    pengumuman: props.pengumuman.pengumuman ?? '',
    file: null,
    video_url: props.pengumuman.video_url ?? '',
    remove_file: false,
})

// ── Gambar: existing vs new preview ──────────────────────
const existingFile = ref(props.pengumuman.file_url ?? null)
const previewUrl = ref(null)

const onFileChange = (e) => {
    const file = e.target.files[0] ?? null
    form.file = file
    form.remove_file = false
    previewUrl.value = file ? URL.createObjectURL(file) : null
}

const removeExisting = () => {
    existingFile.value = null
    form.remove_file = true
}

const removeNew = () => {
    form.file = null
    previewUrl.value = null
    const el = document.getElementById('file-input-edit')
    if (el) el.value = ''
}

const submit = () => {
    form.post(route('pengumuman.update', props.pengumuman.id), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => success('Pengumuman berhasil diperbarui!'),
        onError: () => error('Gagal memperbarui. Periksa isian form.'),
    })
}

const confirmDelete = () => {
    if (!confirm('Hapus pengumuman ini? Tindakan tidak dapat dibatalkan.')) return
    router.delete(route('pengumuman.destroy', props.pengumuman.id))
}
</script>

<template>
    <MenuLayout>
        <div class="mx-auto px-4 py-6 space-y-6">

            <!-- Back -->
            <div class="flex items-center justify-between">
                <Link :href="route('pengumuman.show', pengumuman.id)" class="inline-flex items-center gap-2 text-sm font-semibold
                           text-gray-500 dark:text-gray-400
                           hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    <ArrowLeftIcon class="w-4 h-4" />
                    Kembali
                </Link>
                <button @click="confirmDelete" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                           bg-red-600 hover:bg-red-700 text-white transition">
                    <TrashIcon class="w-4 h-4" />
                    Hapus
                </button>
            </div>

            <section class="rounded-2xl border border-white/20 dark:border-white/10
                            bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8">

                <h1 class="text-xl font-bold text-gray-800 dark:text-white mb-6">Edit Pengumuman</h1>

                <form @submit.prevent="submit" class="space-y-6" novalidate>

                    <!-- Judul -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Judul <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.judul" type="text" maxlength="255" class="w-full rounded-xl px-4 py-3 transition
                                   bg-white dark:bg-[#0F172A]
                                   text-gray-800 dark:text-gray-100
                                   focus:outline-none focus:ring-2 focus:border-transparent" :class="form.errors.judul
                                    ? 'border border-red-500 focus:ring-red-400'
                                    : 'border border-gray-300 dark:border-white/10 focus:ring-indigo-500'" />
                        <p v-if="form.errors.judul" class="mt-1 text-xs text-red-500">{{ form.errors.judul }}</p>
                    </div>

                    <!-- Isi -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Isi Pengumuman <span class="text-red-500">*</span>
                        </label>
                        <div class="rounded-xl overflow-hidden border shadow-sm"
                            :class="form.errors.pengumuman ? 'border-red-500' : 'border-gray-300 dark:border-white/10'">
                            <QuillEditor v-model:content="form.pengumuman" content-type="html" theme="snow"
                                class="pengumuman-editor" :toolbar="[
                                    ['bold', 'italic', 'underline'],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    [{ align: [] }],
                                    ['link'],
                                    ['clean'],
                                ]" />
                        </div>
                        <p v-if="form.errors.pengumuman" class="mt-1 text-xs text-red-500">{{ form.errors.pengumuman }}
                        </p>
                    </div>

                    <!-- Gambar -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Lampiran Gambar
                            <span class="font-normal text-gray-400 dark:text-gray-500">(opsional)</span>
                        </label>

                        <!-- Gambar existing -->
                        <div v-if="existingFile && !previewUrl" class="mb-3 relative inline-block">
                            <img :src="existingFile" alt="Gambar saat ini"
                                class="max-h-48 rounded-xl border border-gray-200 dark:border-white/10 object-cover shadow-sm" />
                            <button type="button" @click="removeExisting" class="absolute -top-2 -right-2 p-1 rounded-full
                                       bg-red-500 hover:bg-red-600 text-white shadow transition">
                                <TrashIcon class="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <!-- Preview baru -->
                        <div v-else-if="previewUrl" class="mb-3 relative inline-block">
                            <img :src="previewUrl" alt="Preview baru"
                                class="max-h-48 rounded-xl border border-indigo-300 dark:border-indigo-500 object-cover shadow-sm" />
                            <button type="button" @click="removeNew" class="absolute -top-2 -right-2 p-1 rounded-full
                                       bg-red-500 hover:bg-red-600 text-white shadow transition">
                                <TrashIcon class="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <!-- Upload input (tampil jika belum ada gambar) -->
                        <template v-if="!existingFile && !previewUrl">
                            <label for="file-input-edit" class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                                       border-2 border-dashed border-gray-300 dark:border-white/10
                                       hover:border-indigo-400 text-gray-400 hover:text-indigo-500 transition">
                                <PhotoIcon class="w-6 h-6 shrink-0" />
                                <span class="text-sm">Pilih gambar baru</span>
                            </label>
                            <input id="file-input-edit" type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                                class="hidden" @change="onFileChange" />
                        </template>

                        <!-- Tombol ganti jika sudah ada gambar lama -->
                        <template v-else-if="existingFile && !previewUrl">
                            <label for="file-input-edit" class="inline-flex items-center gap-2 mt-2 px-3 py-2 rounded-lg cursor-pointer
                                       text-xs font-medium border border-gray-300 dark:border-white/10
                                       text-gray-500 hover:text-indigo-600 hover:border-indigo-400 transition">
                                <PhotoIcon class="w-4 h-4" />
                                Ganti gambar
                            </label>
                            <input id="file-input-edit" type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                                class="hidden" @change="onFileChange" />
                        </template>

                        <p v-if="form.errors.file" class="mt-1 text-xs text-red-500">{{ form.errors.file }}</p>
                    </div>

                    <!-- Video URL -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Link Video
                            <span class="font-normal text-gray-400 dark:text-gray-500">(opsional, YouTube / Google
                                Drive)</span>
                        </label>
                        <input v-model="form.video_url" type="url" placeholder="https://www.youtube.com/watch?v=..."
                            class="w-full rounded-xl px-4 py-3 transition
                                   bg-white dark:bg-[#0F172A]
                                   text-gray-800 dark:text-gray-100
                                   placeholder-gray-400 dark:placeholder-gray-600
                                   border border-gray-300 dark:border-white/10
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            :class="{ 'border-red-500 focus:ring-red-400': form.errors.video_url }" />
                        <p v-if="form.errors.video_url" class="mt-1 text-xs text-red-500">{{ form.errors.video_url }}
                        </p>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 pt-2">
                        <Link :href="route('pengumuman.show', pengumuman.id)" class="px-5 py-2.5 rounded-xl font-semibold text-sm
                                   bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15
                                   text-gray-700 dark:text-gray-200 transition">
                            Batal
                        </Link>
                        <button type="submit" :disabled="form.processing" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm
                                   bg-gradient-to-r from-indigo-600 to-purple-600
                                   hover:from-indigo-700 hover:to-purple-700
                                   text-white shadow-md hover:shadow-lg transition disabled:opacity-60">
                            <svg v-if="form.processing" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {{ form.processing ? 'Menyimpan...' : 'Perbarui Pengumuman' }}
                        </button>
                    </div>

                </form>
            </section>
        </div>
    </MenuLayout>
</template>

<style>
.dark .pengumuman-editor .ql-editor {
    color: #f3f4f6 !important;
}

.dark .pengumuman-editor .ql-editor * {
    color: inherit !important;
    background: transparent !important;
}

.dark .pengumuman-editor .ql-editor.ql-blank::before {
    color: #6b7280 !important;
}

.dark .pengumuman-editor .ql-toolbar {
    border-color: rgba(255, 255, 255, .1);
    background: #0F172A;
}

.dark .pengumuman-editor .ql-container {
    border-color: rgba(255, 255, 255, .1);
    background: #0F172A;
}

.dark .pengumuman-editor .ql-stroke {
    stroke: #d1d5db !important;
}

.dark .pengumuman-editor .ql-fill {
    fill: #d1d5db !important;
}

.dark .pengumuman-editor .ql-picker {
    color: #d1d5db !important;
}
</style>