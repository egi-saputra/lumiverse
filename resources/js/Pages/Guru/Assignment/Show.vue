<template>
    <MenuLayout>
        <div v-if="assignment" class="min-h-screen sm:p-6">

            <!-- Back button -->
            <Link :href="route('guru.assignment.index')" class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400
                       hover:text-gray-800 dark:hover:text-white mb-6 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Assignments
            </Link>

            <!-- Header Card -->
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                        rounded-2xl p-6 shadow-sm mb-5">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {{ assignment.judul }}
                </h1>

                <div class="flex flex-wrap gap-2">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                                 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400
                                 border border-blue-100 dark:border-blue-800">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {{ assignment.mapel.mapel }}
                    </span>

                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                                 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400
                                 border border-amber-100 dark:border-amber-800/50">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {{ assignment.siswa.nama_lengkap }}
                    </span>
                </div>
            </div>

            <!-- Attachment Section -->
            <div v-if="assignment.file_path" class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                       rounded-2xl p-6 shadow-sm mb-5">

                <div class="flex items-center justify-between mb-4">
                    <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        Attachment
                    </p>

                    <!-- Download button (semua tipe kecuali video eksternal) -->
                    <a v-if="!isExternalVideo(assignment.file_path)" :href="getFileUrl(assignment.file_path)"
                        :download="getFileName(assignment.file_path)" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                              bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400
                              border border-emerald-100 dark:border-emerald-800
                              hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </a>
                </div>

                <!-- Image -->
                <div v-if="isImage(assignment.file_path)">
                    <img :src="getFileUrl(assignment.file_path)" alt="Assignment attachment" class="w-full rounded-xl object-cover mb-3
                                border border-gray-100 dark:border-gray-700" />
                    <div class="flex justify-end">
                        <a :href="getFileUrl(assignment.file_path)" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                                  bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                                  hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open Full Size
                        </a>
                    </div>
                </div>

                <!-- Local Video (tidak ada tombol download — file video bisa besar) -->
                <div v-else-if="isVideo(assignment.file_path) && !isExternal(assignment.file_path)">
                    <video class="w-full rounded-xl border border-gray-100 dark:border-gray-700" controls>
                        <source :src="getFileUrl(assignment.file_path)" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <!-- YouTube / Drive (embed, tanpa download) -->
                <div v-else-if="isExternalVideo(assignment.file_path)" class="w-full aspect-video rounded-xl overflow-hidden
                           border border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    <iframe class="w-full h-full" :src="getVideoEmbedUrl(assignment.file_path)" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen />
                </div>

                <!-- PDF -->
                <div v-else-if="isPdf(assignment.file_path)" class="space-y-3">
                    <div class="h-[70vh] border border-gray-200 dark:border-gray-700 rounded-xl
                                overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <iframe class="w-full h-full" :src="getPdfEmbedUrl(assignment.file_path)" frameborder="0" />
                    </div>
                    <div class="flex justify-end">
                        <a :href="getFileUrl(assignment.file_path)" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                                  bg-blue-600 text-white hover:bg-blue-700 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open in New Tab
                        </a>
                    </div>
                </div>

                <!-- Word / Excel / PowerPoint / file lainnya -->
                <div v-else class="flex flex-col items-center justify-center py-10 border-2 border-dashed
                           border-gray-200 dark:border-gray-700 rounded-xl
                           bg-gray-50 dark:bg-gray-800/50 text-center gap-3">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center"
                        :class="fileIconBg(assignment.file_path)">
                        <svg class="w-6 h-6" :class="fileIconColor(assignment.file_path)" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                            {{ fileTypeLabel(assignment.file_path) }}
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            This file cannot be previewed in browser
                        </p>
                    </div>
                    <a :href="getFileUrl(assignment.file_path)" :download="getFileName(assignment.file_path)" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                              bg-blue-600 text-white hover:bg-blue-700 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download File
                    </a>
                </div>
            </div>

            <!-- Description Card -->
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                        rounded-2xl p-6 shadow-sm mb-5">
                <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    Description
                </p>
                <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {{ assignment.deskripsi }}
                </p>
            </div>

            <!-- Meta Footer -->
            <div class="flex flex-col sm:flex-row justify-between gap-2 px-1">
                <p class="text-xs text-gray-400 dark:text-gray-500">
                    Submitted: {{ formatDate(assignment.created_at) }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500">
                    Last updated: {{ formatDate(assignment.updated_at) }}
                </p>
            </div>

            <!-- Revision History -->
            <div v-if="assignment.revisions.length > 0" class="mt-8">
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Revision History (Jumlah revisi {{ assignment.revisions.length }}x)
                </h3>
                <div class="space-y-2">
                    <div v-for="rev in assignment.revisions" :key="rev.id"
                        class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-medium text-gray-800 dark:text-white">
                                Revisi Ke - {{ rev.revision_number }}
                            </span>
                            <span class="text-xs text-gray-400">{{ formatDate(rev.created_at) }}</span>
                        </div>
                        <p class="text-gray-500 dark:text-gray-400 text-xs">{{ rev.judul }}</p>
                        <p v-if="rev.catatan_revisi" class="mt-1 text-amber-600 dark:text-amber-400 text-xs italic">
                            "{{ rev.catatan_revisi }}"
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { format } from 'date-fns'
import { Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'

// ─── Props ────────────────────────────────────────────────────────────────────

const props = defineProps({ assignment: Object })

// ─── Date ─────────────────────────────────────────────────────────────────────

const formatDate = (date) => format(new Date(date), 'dd MMM yyyy, HH:mm')

// ─── File Helpers ─────────────────────────────────────────────────────────────

const getExt = (path) => (path ?? '').split('.').pop().toLowerCase()
// const getFileName = (path) => (path ?? '').split('/').pop()
const getFileName = (path) => {
    if (!path) return 'download'

    const ext = getExt(path)

    const nama = props.assignment?.siswa?.nama_lengkap
        ?.replace(/\s+/g, '_')
        ?.replace(/[^\w\-]/g, '')

    return `${nama}.${ext}`
}

const isImage = (path) => ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(getExt(path))
const isVideo = (path) => ['mp4', 'webm', 'ogg'].includes(getExt(path))
const isPdf = (path) => getExt(path) === 'pdf'
const isWord = (path) => ['doc', 'docx'].includes(getExt(path))
const isExcel = (path) => ['xls', 'xlsx'].includes(getExt(path))
const isPpt = (path) => ['ppt', 'pptx'].includes(getExt(path))

const getFileUrl = () => props.assignment.file_url ?? ''
const isExternal = (path) => (path ?? '').startsWith('http')

const isExternalVideo = (path) => {
    if (!isExternal(path)) return false
    return path.includes('youtube.com') || path.includes('youtu.be') || path.includes('drive.google.com')
}

// ─── Embed Helpers ────────────────────────────────────────────────────────────

const getVideoEmbedUrl = (url) => {
    if (url.includes('youtu.be')) {
        const id = url.split('/').pop().split('?')[0]
        return `https://www.youtube.com/embed/${id}`
    }
    if (url.includes('youtube.com')) {
        const id = new URL(url).searchParams.get('v')
        return `https://www.youtube.com/embed/${id}`
    }
    if (url.includes('drive.google.com')) {
        const match = url.match(/\/d\/([^/]+)/)
        if (match) return `https://drive.google.com/file/d/${match[1]}/preview`
    }
    return url
}

const getPdfEmbedUrl = (url) => {
    if (!url) return ''
    if (url.includes('drive.google.com')) {
        const match = url.match(/\/d\/([^/]+)/)
        if (match) return `https://drive.google.com/file/d/${match[1]}/preview`
    }
    return getFileUrl(url)
}

// ─── File Type Display ────────────────────────────────────────────────────────

const FILE_TYPES = {
    doc: { label: 'Word Document', bg: 'bg-blue-100 dark:bg-blue-900/40', color: 'text-blue-600 dark:text-blue-400' },
    docx: { label: 'Word Document', bg: 'bg-blue-100 dark:bg-blue-900/40', color: 'text-blue-600 dark:text-blue-400' },
    xls: { label: 'Excel Spreadsheet', bg: 'bg-green-100 dark:bg-green-900/40', color: 'text-green-600 dark:text-green-400' },
    xlsx: { label: 'Excel Spreadsheet', bg: 'bg-green-100 dark:bg-green-900/40', color: 'text-green-600 dark:text-green-400' },
    ppt: { label: 'PowerPoint', bg: 'bg-orange-100 dark:bg-orange-900/40', color: 'text-orange-600 dark:text-orange-400' },
    pptx: { label: 'PowerPoint', bg: 'bg-orange-100 dark:bg-orange-900/40', color: 'text-orange-600 dark:text-orange-400' },
}

const getFileMeta = (path) => FILE_TYPES[getExt(path)] ?? { label: 'File', bg: 'bg-gray-100 dark:bg-gray-700', color: 'text-gray-500 dark:text-gray-400' }
const fileTypeLabel = (path) => getFileMeta(path).label
const fileIconBg = (path) => getFileMeta(path).bg
const fileIconColor = (path) => getFileMeta(path).color
</script>