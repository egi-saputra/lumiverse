<template>
    <MenuLayout>
        <div class="min-h-screen sm:p-6 pb-20 relative">

            <!-- Header Desktop -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="sm:text-3xl text-xl font-bold text-gray-900 dark:text-white">Learning Material List</h1>
            </div>

            <div class="grid grid-cols-1 gap-6">
                <Link v-for="materi in materials" :key="materi.id" :href="route('siswa.material.show', materi.id)"
                    class="relative cursor-pointer bg-transparent dark:bg-gradient-to-r dark:from-blue-400/20 dark:via-blue-500/20 dark:to-blue-700/10 border border-gray-400 dark:border-blue-600 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col justify-between transition hover:border-blue-600">

                    <div>
                        <h2 class="text-xl font-semibold dark:text-white mb-2">
                            Title : {{ materi.judul }}
                        </h2>

                        <p class="dark:text-gray-200 font-semibold text-sm mb-2">{{ materi.deskripsi }}</p>

                        <!-- File preview -->
                        <div class="flex flex-col space-y-2">

                            <template v-if="materi.file_path">
                                <!-- Image Preview -->
                                <div v-if="isImage(materi.file_path)">
                                    <p class="text-sm sm:text-xs dark:text-gray-300">Materi ini menggunakan sebuah
                                        gambar/image.</p>
                                    <!-- <img :src="getFileUrl(materi.file_path)" alt="preview"
                                        class="mt-2 w-full mb-3 sm:border border-gray-300 dark:border-white max-h-48 object-cover rounded" />
                                    <div class="flex w-full justify-end">
                                        <button @click.stop="previewFile(materi.file_path)"
                                            class="bg-blue-700 text-white hover:bg-gray-300 px-3 mb-3 py-1 rounded text-sm font-semibold">
                                            Preview Image
                                        </button>
                                    </div> -->
                                </div>

                                <!-- Local Video Preview -->
                                <div v-else-if="isVideo(materi.file_path) && !isExternal(materi.file_path)">
                                    <video @click.stop class="mt-2 w-full max-h-48 rounded" controls>
                                        <source :src="materi.file_url" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                <!-- YouTube or Drive Video -->
                                <div v-else-if="isExternalVideo(materi.file_path)">
                                    <!-- <iframe @click.stop class="mt-2 w-full bg-gray-200 rounded"
                                        :src="getVideoEmbedUrl(materi.file_path)" frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowfullscreen></iframe> -->
                                    <p class="text-sm sm:text-xs dark:text-gray-300">Materi ini memiliki sebuah video.
                                    </p>
                                </div>

                                <!-- PDF -->
                                <div v-else-if="isPdf(materi.file_path)">
                                    <p class="text-sm sm:text-xs dark:text-gray-300">Materi ini menggunakan file
                                        pdf.
                                    </p>
                                </div>

                                <!-- Other Files -->
                                <div v-else>
                                    <p class="text-sm dark:text-gray-300">
                                        Materi ini menggunakan file word/excel/docx.
                                    </p>
                                </div>
                            </template>
                        </div>

                        <div class="flex sm:flex-row mt-6 flex-col justify-between">
                            <div class="flex sm:flex-row flex-col gap-3">
                                <p
                                    class="bg-blue-100 p-1 text-center rounded-full px-4 text-xs font-semibold border border-blue-500 text-blue-600">
                                    Subject: {{ materi.mapel.mapel }}</p>
                                <p
                                    class="sm:bg-amber-100 sm:p-1 dark:text-gray-300 sm:rounded-full sm:px-4 text-xs sm:font-semibold sm:border sm:border-amber-500 dark:sm:text-amber-600 sm:text-amber-600">
                                    Author:
                                    <span
                                        class="sm:font-semibold dark:text-gray-300 dark:sm:text-amber-600 sm:text-amber-600">
                                        {{ materi.guru.nama_lengkap }}
                                    </span>
                                </p>
                            </div>

                            <!-- <p
                                class="p-1 sm:border sm:dark:border-gray-600 sm:rounded-full px-4 dark:text-gray-400 sm:mt-0 mt-4 text-end text-xs">
                                Updated At: {{ formatDate(materi.updated_at) }}
                            </p> -->
                        </div>
                    </div>
                </Link>
            </div>

            <div v-if="materials.length === 0" class="col-span-full text-center text-gray-500 dark:text-gray-400">
                No learning materials submitted yet.
            </div>
        </div>

    </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { format } from 'date-fns'
import { Link, router } from '@inertiajs/vue3'

const props = defineProps({ materials: Array })
const formatDate = (date) => format(new Date(date), 'dd MMM yyyy, HH:mm')

// File helpers
const isFile = path => ['jpg', 'jpeg', 'png', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'zip'].includes(path.split('.').pop().toLowerCase())
const isImage = path => ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(path.split('.').pop().toLowerCase())
const isVideo = path => ['mp4', 'webm', 'ogg'].includes(path.split('.').pop().toLowerCase())
const isPdf = path => path.split('.').pop().toLowerCase() === 'pdf'
const fileName = path => path.split('/').pop()
const previewFile = (materi) => window.open(materi.file_url, '_blank')

// Cek kalau file path eksternal (YouTube / Drive)
const isExternal = path => path.startsWith('http')
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
        // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
        const idMatch = url.match(/\/d\/(.*?)\//)
        if (idMatch) return `https://drive.google.com/file/d/${idMatch[1]}/preview`
    }
    return url
}
</script>
