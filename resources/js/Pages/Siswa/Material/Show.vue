<template>
    <MenuLayout>
        <div v-if="material" class="sm:p-6">
            <h1 class="text-2xl mb-3 font-bold dark:text-white">{{ material.judul }}</h1>

            <div class="flex gap-3">
                <p
                    class="bg-blue-50 p-1 rounded-full px-4 text-xs font-semibold mb-2 border border-blue-500 text-blue-600">
                    Subject: {{ material.mapel.mapel }}</p>
                <p
                    class="bg-amber-50 p-1 rounded-full px-4 text-xs font-semibold mb-2 border border-amber-500 text-amber-600">
                    Author:
                    <span class="font-semibold">
                        {{ material.guru.nama_lengkap }}
                    </span>
                </p>
            </div>

            <!-- File preview -->
            <div class="flex flex-col space-y-2">

                <template v-if="material.file_path">
                    <!-- Image Preview -->
                    <div v-if="isImage(material.file_path)">
                        <img :src="material.file_url" alt="preview"
                            class="mt-2 w-full mb-3 object-cover rounded shadow-lg" />
                        <div class="flex w-full justify-end">
                            <button @click.stop="previewFile(material)"
                                class="bg-blue-700 text-white hover:bg-gray-300 px-6 mb-3 py-2 rounded text-sm font-semibold">
                                View Image
                            </button>
                        </div>
                    </div>

                    <!-- Local Video Preview -->
                    <div v-else-if="isVideo(material.file_path) && !isExternal(material.file_path)">
                        <video @click.stop class="mt-2 w-full max-h-48 rounded" controls>
                            <source :src="material.file_url" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <!-- YouTube or Drive Video -->
                    <div v-else-if="isExternalVideo(material.file_path)"
                        class="my-6 mb-12 w-full aspect-video border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden">

                        <iframe class="w-full h-full border rounded-lg" :src="getVideoEmbedUrl(material.file_path)"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>

                    </div>

                    <!-- PDF -->
                    <div v-else-if="isPdf(material.file_path)" class="mt-4 w-full space-y-2">

                        <div class="h-[70vh] border rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <iframe class="w-full h-full" :src="getPdfEmbedUrl(material)" frameborder="0">
                            </iframe>
                        </div>

                        <div class="flex justify-end">
                            <a :href="material.file_url" target="_blank"
                                class="text-sm  my-4 py-2 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold">
                                Buka di tab baru
                            </a>
                        </div>

                    </div>

                    <!-- Other Files -->
                    <!-- <div v-else>
                        <p class="text-sm dark:text-gray-300 truncate">
                            {{ fileName(material.file_path) }}
                            <a @click.stop :href="getFileUrl(material.file_path)" target="_blank"
                                class="ml-2 text-blue-500 hover:underline text-sm">
                                Download
                            </a>
                        </p>
                    </div> -->
                    <div v-else-if="isWord(material.file_path) || isExcel(material.file_path)"
                        class="sm:my-12 my-6 border sm:mx-auto p-10 sm:p-12 sm:px-40 border-dashed rounded-lg justify-center items-center dark:bg-white/5 bg-gray-100 dark:bg-gray-800">

                        <p class="font-semibold text-gray-700 text-center dark:text-gray-200">
                            File {{ isWord(material.file_path) ? 'Word' : 'Excel' }}
                        </p>

                        <p class="text-sm text-gray-500 text-center mb-3">
                            File ini tidak bisa ditampilkan langsung di browser.
                        </p>

                        <div class="flex justify-center">
                            <a :href="material.file_url"
                                class="inline-block px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold">
                                Download File
                            </a>
                        </div>
                    </div>
                </template>
            </div>

            <p class="mb-2 font-semibold sm:text-lg dark:text-gray-200">Pembahasan Materi :</p>
            <MateriContent :content="material.deskripsi" class="mb-6" />

            <div class="w-full border-t border-gray-400 dark:border-gray-700 mb-2"></div>

            <div class="flex justify-between flex-row gap-3">
                <p class="sm:inline-flex hidden dark:text-gray-400 text-xs">
                    Submitted: {{ formatDate(material.created_at) }}
                </p>

                <p class="dark:text-gray-400 text-xs">
                    Last updated: {{ formatDate(material.updated_at) }}
                </p>
            </div>


        </div>
    </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { format } from 'date-fns'
import MateriContent from '@/Components/MateriContent.vue'

const props = defineProps({ material: Object })
const formatDate = (date) => format(new Date(date), 'dd MMM yyyy, HH:mm')

// File helpers
const isFile = path => ['jpg', 'jpeg', 'png', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'zip'].includes(path.split('.').pop().toLowerCase())
const isImage = path => ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(path.split('.').pop().toLowerCase())
const isVideo = path => ['mp4', 'webm', 'ogg'].includes(path.split('.').pop().toLowerCase())
const isPdf = path => path.split('.').pop().toLowerCase() === 'pdf'
const fileName = path => path.split('/').pop()
const previewFile = (material) => window.open(material.file_url, '_blank')

const isWord = path =>
    ['doc', 'docx'].includes(path.split('.').pop().toLowerCase())

const isExcel = path =>
    ['xls', 'xlsx'].includes(path.split('.').pop().toLowerCase())

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

const getPdfEmbedUrl = (material) => {
    if (!material?.file_path) return ''

    if (material.file_path.includes('drive.google.com')) {
        const match = material.file_path.match(/\/d\/([^/]+)/)
        if (match) {
            return `https://drive.google.com/file/d/${match[1]}/preview`
        }
    }

    return material.file_url
}
</script>
