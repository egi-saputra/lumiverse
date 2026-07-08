<template>
    <MenuLayout>
        <div class="min-h-screen sm:p-6 pb-20">

            <!-- Header -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Assignments Directory
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {{ assignments.length }} submission{{ assignments.length !== 1 ? 's' : '' }} received
                    </p>
                </div>
            </div>

            <!-- Assignment List -->
            <div v-if="assignments.length > 0" class="space-y-3">
                <Link v-for="assignment in assignments" :key="assignment.id"
                    :href="route('guru.assignment.show', assignment.id)"
                    class="group flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer">

                    <!-- Icon / Attachment indicator -->
                    <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                        :class="getAttachmentColor(assignment.file_path)">
                        <component :is="'svg'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                :d="getAttachmentIcon(assignment.file_path)" />
                        </component>
                    </div>

                    <!-- Main content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-2 mb-1">
                            <h2 class="text-base font-semibold text-gray-900 dark:text-white truncate">
                                {{ assignment.judul }}
                            </h2>
                            <span v-if="!assignment.is_read || assignment.is_updated"
                                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                                :class="assignment.is_updated
                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                    : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'">

                                <!-- {{ assignment.is_updated
                                    ? `Updated / Revisi Ke - ${assignment.revision_count}`
                                    : 'New'
                                }} -->
                                {{ assignment.is_updated
                                    ? `Updated`
                                    : 'New'
                                }}
                            </span>
                        </div>

                        <!-- Description preview: handle newlines properly -->
                        <p
                            class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 whitespace-pre-line leading-relaxed">
                            {{ assignment.deskripsi }}
                        </p>

                        <!-- Badges -->
                        <div class="flex w-full justify-between flex-wrap items-center gap-2 mt-3">
                            <div class="flex gap-2 flex-wrap">
                                <span
                                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    {{ assignment.mapel.mapel }}
                                </span>

                                <span
                                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {{ assignment.siswa.nama_lengkap }}
                                </span>
                            </div>

                            <span class="text-xs text-gray-400 dark:text-gray-500">
                                {{ formatDate(assignment.created_at) }}
                            </span>
                        </div>
                    </div>

                    <!-- Arrow -->
                    <div
                        class="hidden sm:flex flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Link>
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
                <p class="text-base font-semibold text-gray-700 dark:text-gray-300">No assignments yet</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Assignments submitted by students will appear
                    here.</p>
            </div>
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

// File type helpers
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