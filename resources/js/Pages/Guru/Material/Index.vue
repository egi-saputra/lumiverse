<template>
    <MenuLayout>
        <div class="min-h-screen pb-20 relative">

            <!-- Header Desktop -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Learning Material List</h1>
                <Link :href="route('guru.material.create')" prefetch preserve-scroll
                    class="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-lg shadow transition">
                    + New Create
                </Link>
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
                        <p class="dark:text-gray-200 text-sm mb-2">{{ material.deskripsi }}</p>
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

                <div v-if="materials.length === 0" class="col-span-full text-center text-gray-500 dark:text-gray-400">
                    No learning materials submitted yet.
                </div>
            </div>

            <!-- Floating button Mobile -->
            <Link :href="route('guru.material.create')" prefetch preserve-scroll
                class="sm:hidden fixed bottom-16 right-3 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 text-sm sm:text-base hover:to-blue-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg">
                + Add New
            </Link>

        </div>
    </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { format } from 'date-fns'
import { Link, router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ToastAlert } from '@/Composables/ToastAlert.js';

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