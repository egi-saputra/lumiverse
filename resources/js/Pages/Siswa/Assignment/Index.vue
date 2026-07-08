<template>
    <MenuLayout>
        <div class="min-h-screen sm:p-6 pb-24">

            <!-- Header -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">My Assignments</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {{ assignments.length }} submission{{ assignments.length !== 1 ? 's' : '' }}
                    </p>
                </div>
                <Link :href="route('siswa.assignment.create')" prefetch
                    class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-none transition-all duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    New Submission
                </Link>
            </div>

            <!-- Assignment List -->
            <div v-if="assignments.length > 0" class="space-y-3">
                <div v-for="assignment in assignments" :key="assignment.id"
                    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">

                    <div class="flex items-start gap-3">
                        <!-- Attachment type icon -->
                        <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                            :class="getAttachmentColor(assignment.file_path)">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    :d="getAttachmentIcon(assignment.file_path)" />
                            </svg>
                        </div>

                        <div class="flex-1 min-w-0">
                            <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                {{ assignment.judul }}
                            </h2>

                            <!--
                                KEY FIX: whitespace-pre-line makes Enter/newline from mobile
                                display correctly as line breaks, while line-clamp-3 keeps
                                the preview compact.
                            -->
                            <p
                                class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-pre-line leading-relaxed">
                                {{ assignment.deskripsi }}
                            </p>

                            <div class="flex flex-wrap items-center gap-2 mt-3">
                                <span
                                    class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                    {{ assignment.mapel.mapel }}
                                </span>
                                <span
                                    class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                                    To: {{ assignment.guru.nama_lengkap }}
                                </span>
                                <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto hidden sm:inline">
                                    {{ formatDate(assignment.created_at) }}
                                </span>
                            </div>

                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-2 sm:hidden">
                                {{ formatDate(assignment.created_at) }}
                            </p>
                        </div>

                        <!-- Edit & Delete actions -->
                        <div class="flex-shrink-0 flex flex-col sm:flex-row items-center gap-1">
                            <Link :href="route('siswa.assignment.edit', assignment.id)"
                                class="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                                title="Edit assignment">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </Link>
                            <button @click="deleteAssignment(assignment)"
                                class="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                                title="Delete assignment">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-else
                class="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p class="text-base font-semibold text-gray-700 dark:text-gray-300">No assignments submitted yet</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-5">Submit your first assignment to get
                    started.</p>
                <Link :href="route('siswa.assignment.create')"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Submit Assignment
                </Link>
            </div>

            <!-- Floating button Mobile -->
            <Link :href="route('siswa.assignment.create')" prefetch
                class="sm:hidden fixed bottom-6 right-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-blue-300/40 dark:shadow-none transition-all duration-200 z-50">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                New
            </Link>

        </div>
    </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { format } from 'date-fns'
import { Link, router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'

const props = defineProps({ assignments: Array })

const formatDate = (date) => format(new Date(date), 'dd MMM yyyy, HH:mm')

const deleteAssignment = (assignment) => {
    if (!confirm(`Delete "${assignment.judul}"?\nThis action cannot be undone.`)) return
    router.delete(route('siswa.assignment.destroy', assignment.id), {
        preserveScroll: true,
    })
}

// --- File type helpers ---
const getExt = (path) => (path || '').split('.').pop().toLowerCase()
const isImage = (path) => ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(getExt(path))
const isPdf = (path) => getExt(path) === 'pdf'
const isVideo = (path) => ['mp4', 'webm', 'ogg'].includes(getExt(path))
const isWord = (path) => ['doc', 'docx'].includes(getExt(path))
const isExcel = (path) => ['xls', 'xlsx'].includes(getExt(path))
const isExternal = (path) => (path || '').startsWith('http')
const isExternalVideo = (path) => {
    if (!isExternal(path)) return false
    return path.includes('youtube.com') || path.includes('youtu.be') || path.includes('drive.google.com')
}

const getAttachmentColor = (path) => {
    if (!path) return 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
    if (isImage(path)) return 'bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400'
    if (isPdf(path)) return 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
    if (isExternalVideo(path) || isVideo(path)) return 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400'
    if (isWord(path)) return 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400'
    if (isExcel(path)) return 'bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400'
    return 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
}

const getAttachmentIcon = (path) => {
    if (!path) return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    if (isImage(path)) return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    if (isPdf(path)) return 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    if (isExternalVideo(path) || isVideo(path)) return 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    return 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
}
</script>