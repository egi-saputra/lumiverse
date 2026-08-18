<template>
    <MenuLayout>
        <div class="min-h-screen pb-20 relative">

            <!-- Header Desktop -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="sm:text-3xl text-2xl font-bold text-gray-900 dark:text-white">Learning Material List</h1>
                <div class="hidden sm:flex gap-3">
                    <Link :href="route('guru.material.createAi')" prefetch preserve-scroll
                        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-lg shadow transition">
                        ✨ Buat dengan AI
                    </Link>
                    <Link :href="route('guru.material.create')" prefetch preserve-scroll
                        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-lg shadow transition">
                        + New Create
                    </Link>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6">

                <div v-for="material in materials" :key="material.id"
                    class="relative bg-transparent dark:bg-gradient-to-r dark:from-blue-400/20 dark:via-blue-500/20 dark:to-blue-700/10 border border-gray-400 dark:border-blue-600 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col justify-between transition hover:shadow-xl">

                    <!-- Tombol Delete pojok kanan bawah -->
                    <button @click="deleteMaterial(material.id)"
                        class="absolute bottom-3 right-4 sm:bottom-6 sm:right-6 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                        Delete
                    </button>

                    <div>
                        <h2 class="text-xl font-semibold dark:text-white mb-2">{{ material.judul }}</h2>
                        <MateriContent :content="material.deskripsi" clamp class="text-sm mb-2" />
                        <div class="flex gap-4">
                            <p class="dark:text-gray-300 text-xs mb-2">Subject: {{ material.mapel.mapel }}</p>
                            <p class="dark:text-gray-300 text-xs mb-2">Recipient: {{ material.kelas.kelas }}</p>
                        </div>
                    </div>

                    <!-- File preview -->
                    <div class="mt-4 flex flex-col space-y-2">

                        <template v-if="material.file_path">
                            <!-- Image Preview -->
                            <div v-if="isImage(material.file_path)">
                                <img :src="material.file_url" alt="preview"
                                    class="mt-2 w-full mb-3 max-h-48 object-cover rounded" />
                                <button @click="previewFile(material)"
                                    class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 px-3 mb-3 py-1 rounded text-sm font-semibold">
                                    Preview Image
                                </button>
                            </div>

                            <!-- Local Video Preview -->
                            <div v-else-if="isVideo(material.file_path) && !isExternal(material.file_path)">
                                <video class="mt-2 w-full max-h-48 rounded" controls>
                                    <source :src="material.file_url" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            <!-- YouTube or Drive Video -->
                            <div v-else-if="isExternalVideo(material.file_path)">
                                <iframe class="mt-2 w-full bg-gray-200 rounded"
                                    :src="getVideoEmbedUrl(material.file_path)" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen></iframe>
                            </div>

                            <!-- PDF -->
                            <div v-else-if="isPdf(material.file_path)">
                                <button @click="previewFile(material)"
                                    class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 px-3 py-1 rounded text-sm font-semibold">
                                    Preview PDF
                                </button>
                            </div>

                            <!-- Other Files -->
                            <div v-else>
                                <p class="text-sm dark:text-gray-300 truncate">
                                    {{ fileName(material.file_path) }}
                                    <a :href="material.file_url" target="_blank"
                                        class="ml-2 text-blue-500 hover:underline text-sm">Download</a>
                                </p>
                            </div>
                        </template>

                        <!-- External Link -->
                        <a v-if="material.file_path && !isFile(material.file_path)" :href="material.file_path"
                            target="_blank" class="text-blue-300 hover:underline text-sm truncate">Open Link</a>

                        <p class="dark:text-gray-400 text-xs">Submitted: {{ formatDate(material.created_at) }}</p>
                    </div>

                </div>

                <div v-if="materials.length === 0"
                    class="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    <div
                        class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p class="text-base font-semibold text-gray-700 dark:text-gray-300">No learning materials submitted
                        yet</p>
                    <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Learning material submitted will appear
                        here.</p>
                </div>
            </div>

            <!-- Floating button Mobile -->
            <div class="sm:hidden fixed bottom-6 right-6 flex flex-col items-end gap-3">
                <Link :href="route('guru.material.createAi')" prefetch preserve-scroll
                    class="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 text-sm hover:to-purple-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg">
                    ✨ Buat dengan AI
                </Link>
                <Link :href="route('guru.material.create')" prefetch preserve-scroll
                    class="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 text-sm hover:to-blue-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg">
                    + Add New
                </Link>
            </div>

        </div>
    </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { format } from 'date-fns'
import { Link, router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ToastAlert } from '@/Composables/ToastAlert.js';
import MateriContent from '@/Components/MateriContent.vue'

const { success, error, confirm } = ToastAlert();

const props = defineProps({ materials: Array })
const formatDate = (date) => format(new Date(date), 'dd MMM yyyy, HH:mm')

// Delete material
const deleteMaterial = async (id) => {
    const result = await confirm({
        title: 'Delete this material?',
        text: 'This action cannot be undone.',
        confirmButtonText: 'Yes, delete',
    });
    if (!result.isConfirmed) return;

    router.delete(route('guru.material.destroy', id), {
        preserveScroll: true,
        onSuccess: () => {
            success('Material successfully deleted.');
        },
        onError: () => {
            error('Failed to delete material.');
        },
    });
}

// File helpers — deteksi tipe berdasarkan ekstensi di file_path mentah
const isFile = path => path && ['jpg', 'jpeg', 'png', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'zip'].includes(path.split('.').pop().toLowerCase())
const isImage = path => path && ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(path.split('.').pop().toLowerCase())
const isVideo = path => path && ['mp4', 'webm', 'ogg'].includes(path.split('.').pop().toLowerCase())
const isPdf = path => path && path.split('.').pop().toLowerCase() === 'pdf'
const fileName = path => path ? path.split('/').pop() : ''
const previewFile = (material) => window.open(material.file_url, '_blank')

// Cek kalau file path eksternal (YouTube / Drive)
const isExternal = path => path && path.startsWith('http')
const isExternalVideo = path => {
    if (!isExternal(path)) return false
    return path.includes('youtube.com') || path.includes('youtu.be') || path.includes('drive.google.com')
}

// Generate embed URL untuk iframe
const getVideoEmbedUrl = url => {
    if (url.includes('youtu.be')) {
        const id = url.split('/').pop()
        return `https://www.youtube.com/embed/${id}`
    } else if (url.includes('youtube.com')) {
        const params = new URL(url).searchParams
        return `https://www.youtube.com/embed/${params.get('v')}`
    } else if (url.includes('drive.google.com')) {
        const idMatch = url.match(/\/d\/(.*?)\//)
        if (idMatch) return `https://drive.google.com/file/d/${idMatch[1]}/preview`
    }
    return url
}
</script>