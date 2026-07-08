<template>
    <MenuLayout>
        <div class="min-h-screen sm:p-6 flex justify-center items-start">
            <div class="w-full">

                <!-- Page Header -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Submit Assignment</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to submit your
                        assignment to your teacher.</p>
                </div>

                <form ref="assignmentForm" @submit.prevent="submitAssignment" class="space-y-5">

                    <!-- Card: Recipient & Subject -->
                    <div
                        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4">
                        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Target</p>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Teacher -->
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipient
                                    (Teacher)</label>
                                <select v-model="form.guru_id" required
                                    class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                                    <option value="" disabled>Select a teacher...</option>
                                    <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                                        {{ teacher.nama_lengkap }}
                                    </option>
                                </select>
                            </div>

                            <!-- Subject — filtered by selected teacher -->
                            <div class="space-y-1.5">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Subject
                                    <span v-if="!form.guru_id" class="font-normal text-gray-400">(Select a teacher
                                        first)</span>
                                </label>
                                <select v-model="form.mapel_id" required :disabled="!form.guru_id || loadingMapel"
                                    class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    <option value="" disabled>
                                        {{ loadingMapel ? 'Loading...' : (form.guru_id ? 'Select a subject...' :
                                            'Select teacher first') }}
                                    </option>
                                    <option v-for="subject in filteredSubjects" :key="subject.id" :value="subject.id">
                                        {{ subject.mapel }}
                                    </option>
                                </select>
                                <p v-if="form.guru_id && !loadingMapel && filteredSubjects.length === 0"
                                    class="text-xs text-amber-500 dark:text-amber-400">
                                    No subjects found for this teacher.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Card: Assignment Details -->
                    <div
                        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4">
                        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Details</p>

                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input type="text" v-model="form.judul" required maxlength="255"
                                class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="e.g. Math Homework Chapter 3" />
                        </div>

                        <div class="space-y-1.5">
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea v-model="form.deskripsi" rows="5" required maxlength="5000"
                                class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none leading-relaxed"
                                placeholder="Describe your assignment in detail. Use Enter/Return to separate paragraphs." />
                            <p class="text-xs text-gray-400 dark:text-gray-500">You can press Enter to create new
                                paragraphs.</p>
                        </div>
                    </div>

                    <!-- Card: Attachment -->
                    <div
                        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4">
                        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Attachment</p>

                        <!-- Toggle -->
                        <div
                            class="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 p-1 gap-1">
                            <button type="button" @click="setFileType('none')" :class="fileType === 'none'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                                class="flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 text-center">
                                None
                            </button>
                            <button type="button" @click="setFileType('file')" :class="fileType === 'file'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                                class="flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 text-center">
                                File
                            </button>
                            <button type="button" @click="setFileType('link')" :class="fileType === 'link'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                                class="flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 text-center">
                                Link
                            </button>
                        </div>

                        <!-- File Upload -->
                        <div v-if="fileType === 'file'" class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Choose File
                                <span class="font-normal text-gray-400">(Image, PDF, Excel, Word — max 10MB)</span>
                            </label>
                            <label
                                class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition group">
                                <div class="flex flex-col items-center gap-1 text-center px-4">
                                    <svg class="w-7 h-7 text-gray-400 group-hover:text-blue-500 transition" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    <span v-if="selectedFile"
                                        class="text-sm font-medium text-blue-600 dark:text-blue-400 truncate max-w-xs">
                                        {{ selectedFile.name }}
                                    </span>
                                    <span v-else class="text-sm text-gray-500 dark:text-gray-400">
                                        Click to upload or drag & drop
                                    </span>
                                </div>
                                <input type="file" class="hidden" @change="handleFile" required
                                    accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.doc,.docx,.zip" />
                            </label>
                        </div>

                        <!-- Link Input -->
                        <div v-if="fileType === 'link'" class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Enter Link
                                <span class="font-normal text-gray-400">(YouTube, Google Drive, etc.)</span>
                            </label>
                            <input type="url" v-model="form.link" required maxlength="2048"
                                class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="https://youtube.com/..." />
                        </div>

                        <p v-if="fileType === 'none'" class="text-sm text-gray-400 dark:text-gray-500 italic">
                            No attachment will be added to this submission.
                        </p>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 pt-2 pb-8">
                        <Link :href="route('siswa.assignment.index')"
                            class="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                            Cancel
                        </Link>
                        <button type="submit" :disabled="sending"
                            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-200 dark:shadow-none transition-all duration-200">
                            <svg v-if="sending" class="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            {{ sending ? 'Submitting...' : 'Submit Assignment' }}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { reactive, ref, computed, watch } from 'vue'
import { Link, router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'

const props = defineProps({
    teachers: Array,  // [{ id, nama_lengkap }]
    subjects: Array,  // [{ id, mapel, guru_id }]
})

const form = reactive({
    guru_id: '',
    mapel_id: '',
    judul: '',
    deskripsi: '',
    file: null,
    link: '',
})

const fileType = ref('none')
const selectedFile = ref(null)
const sending = ref(false)
const loadingMapel = ref(false)
const assignmentForm = ref(null)

/**
 * Filter subjects based on selected teacher (guru_id).
 * Relies on mapel.guru_id relation passed from backend.
 */
const filteredSubjects = computed(() => {
    if (!form.guru_id) return []
    return (props.subjects || []).filter(
        (s) => String(s.guru_id) === String(form.guru_id)
    )
})

/**
 * When teacher changes, reset subject selection.
 * If there's only one subject, auto-select it.
 */
watch(() => form.guru_id, () => {
    form.mapel_id = ''
    loadingMapel.value = true
    // Simulate async tick so UI reflects the disabled state briefly
    setTimeout(() => {
        loadingMapel.value = false
        if (filteredSubjects.value.length === 1) {
            form.mapel_id = filteredSubjects.value[0].id
        }
    }, 150)
})

const setFileType = (type) => {
    fileType.value = type
    // Reset attachment data when switching type
    form.file = null
    form.link = ''
    selectedFile.value = null
}

const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    selectedFile.value = file
    form.file = file
}

const resetForm = () => {
    form.guru_id = ''
    form.mapel_id = ''
    form.judul = ''
    form.deskripsi = ''
    form.file = null
    form.link = ''
    fileType.value = 'none'
    selectedFile.value = null
}

const submitAssignment = () => {
    if (!assignmentForm.value.checkValidity()) {
        assignmentForm.value.reportValidity()
        return
    }

    sending.value = true

    const formData = new FormData()
    formData.append('guru_id', form.guru_id)
    formData.append('mapel_id', form.mapel_id)
    formData.append('judul', form.judul)
    // Normalize line endings: \r\n (Windows/mobile) → \n
    const normalizedDesc = (form.deskripsi || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    formData.append('deskripsi', normalizedDesc)
    if (fileType.value === 'file' && form.file) formData.append('file', form.file)
    if (fileType.value === 'link') formData.append('link', form.link)

    router.post(route('siswa.assignment.store'), formData, {
        onSuccess: () => {
            sending.value = false
            resetForm()
        },
        onError: () => {
            sending.value = false
        },
    })
}
</script>