<template>
    <MenuLayout>
        <div class="min-h-screen sm:p-6 flex justify-center items-start">
            <div class="w-full max-w-7xl rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800">

                <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Submit Materials</h1>

                <form ref="materiForm" @submit.prevent="submitMateri" class="space-y-6">

                    <!-- Recipient & Subject -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Recipient</label>
                            <select v-model="form.kelas_id" required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                <option value="" disabled>Select Class</option>
                                <option v-for="kelas in kelas" :key="kelas.id" :value="kelas.id">
                                    {{ kelas.kelas }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Subject</label>
                            <select v-model="form.mapel_id" required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                <option value="" disabled>Select subject</option>
                                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                                    {{ subject.mapel }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Title & Attachment Type -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Title</label>
                            <input type="text" v-model="form.judul" required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                placeholder="Enter title" />
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Attachment
                                Type</label>
                            <select v-model="fileType"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                <option value="none">No Attachment</option>
                                <option value="file">File (Image, PDF, Excel, Word)</option>
                                <option value="link">Link (Video, PPT)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Description</label>
                        <textarea v-model="form.deskripsi" required
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder="Enter description"></textarea>
                    </div>

                    <!-- File Upload -->
                    <div v-if="fileType === 'file'">
                        <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Choose File</label>
                        <input type="file" @change="handleFile" required
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    </div>

                    <!-- Link Input -->
                    <div v-if="fileType === 'link'">
                        <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Enter Link</label>
                        <input type="url" v-model="form.link" required
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder="https://example.com/video-or-ppt" />
                    </div>

                    <!-- Submit & Cancel Buttons -->
                    <div class="flex justify-end space-x-4 mt-6">
                        <button type="button" @click="router.get(route('guru.material.index'))"
                            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg flex items-center justify-center transition-all duration-200">
                            Cancel
                        </button>

                        <button type="submit"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-all duration-200"
                            :disabled="create">
                            <svg v-if="create" class="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                                </path>
                            </svg>
                            {{ create ? 'Creating...' : 'Create Material' }}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </MenuLayout>
</template>


<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { reactive, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { useAlert } from '@/Composables/useAlert.js';

const props = defineProps({
    kelas: Array,
    subjects: Array
})

const { success, error, confirm } = useAlert();

const form = reactive({
    kelas_id: '',
    mapel_id: '',
    judul: '',
    deskripsi: '',
    file: null,
    link: ''
})

const fileType = ref('none')
const selectedFile = ref(null)
const create = ref(false)
const materiForm = ref(null)

const handleFile = (e) => {
    selectedFile.value = e.target.files[0]
    form.file = selectedFile.value
}

const submitMateri = () => {
    if (!materiForm.value.checkValidity()) {
        materiForm.value.reportValidity()
        return
    }

    create.value = true
    const formData = new FormData()
    formData.append('kelas_id', form.kelas_id)
    formData.append('mapel_id', form.mapel_id)
    formData.append('judul', form.judul)
    formData.append('deskripsi', form.deskripsi)
    if (fileType.value === 'file') formData.append('file', form.file)
    if (fileType.value === 'link') formData.append('link', form.link)

    router.post(route('guru.material.store'), formData, {
        onSuccess: () => {
            // sending.value = false
            create.value = false
            form.kelas_id = ''
            form.mapel_id = ''
            form.judul = ''
            form.deskripsi = ''
            form.file = null
            form.link = ''
            fileType.value = 'none'
            selectedFile.value = null
        },
        onError: () => {
            create.value = false
        }
    })
}
</script>
