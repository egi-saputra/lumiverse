<script setup>
import { ref, computed } from 'vue'
import { usePage, Link } from '@inertiajs/vue3'
import { CalendarDaysIcon, ArrowLeftIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/vue/24/solid'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

const page = usePage()
const pengumuman = computed(() => page.props.announcements ?? [])

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const excerpt = (html, len = 130) => {
    const plain = (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return plain.length > len ? plain.slice(0, len) + '…' : plain
}

const perPage = 10
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(pengumuman.value.length / perPage) || 1)
const paginated = computed(() => {
    const s = (currentPage.value - 1) * perPage
    return pengumuman.value.slice(s, s + perPage)
})
const goToPage = (p) => {
    if (p < 1 || p > totalPages.value) return
    currentPage.value = p
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
    <div class="w-full py-6 px-4 sm:py-12 md:px-10 max-w-6xl mx-auto">

        <!-- Header -->
        <div class="mb-12 text-center">
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Mading
                <span class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Sekolah Nusantara
                </span>
            </h1>
            <p class="mt-4 text-gray-500 text-sm sm:text-base">
                Pengumuman, informasi, dan berita terbaru sekolah
            </p>
            <div class="w-24 mt-5 h-1 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
        </div>

        <!-- Back to login -->
        <Link :href="route('login')"
            class="sm:inline-flex hidden items-center gap-2 mb-6 font-semibold text-sm text-gray-500 hover:text-indigo-600 transition">
            <ArrowLeftIcon class="w-4 h-4" />
            Kembali ke Login
        </Link>

        <!-- Empty -->
        <div v-if="pengumuman.length === 0" class="text-center py-24 text-gray-400 italic text-lg">
            Belum ada pengumuman 📭
        </div>

        <!-- List -->
        <div v-else class="space-y-3">
            <Link v-for="item in paginated" :key="item.id" :href="route('mading.show', item.id)" class="group relative flex items-start gap-4 p-5 rounded-xl
                       bg-white border border-gray-200 shadow-sm
                       hover:shadow-lg hover:-translate-y-0.5 overflow-hidden
                       transition-all duration-200">
                <!-- Accent bar -->
                <div class="absolute top-0 left-0 w-full h-0.5
                            bg-gradient-to-r from-indigo-500 to-purple-600
                            opacity-60 group-hover:opacity-100 transition-opacity" />

                <div class="flex-1 min-w-0">
                    <h2 class="font-semibold text-base text-gray-800 truncate
                               group-hover:text-indigo-600 transition-colors">
                        {{ item.judul }}
                    </h2>
                    <p class="mt-1 text-sm text-gray-500 line-clamp-2">
                        {{ excerpt(item.pengumuman) }}
                    </p>
                    <div class="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span class="flex items-center gap-1">
                            <CalendarDaysIcon class="w-3.5 h-3.5" />
                            {{ formatDate(item.created_at) }}
                        </span>
                        <span v-if="item.file_path" class="flex items-center gap-1 text-indigo-400">
                            <PhotoIcon class="w-3.5 h-3.5" /> Gambar
                        </span>
                        <span v-if="item.video_url" class="flex items-center gap-1 text-purple-400">
                            <VideoCameraIcon class="w-3.5 h-3.5" /> Video
                        </span>
                    </div>
                </div>
                <ChevronRightIcon class="shrink-0 w-5 h-5 mt-1 text-gray-300
                           group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" />
            </Link>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-2 rounded-lg border text-sm font-medium border-gray-200 text-gray-600
                       hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition">← Prev</button>
            <button v-for="p in totalPages" :key="p" @click="goToPage(p)"
                class="w-9 h-9 rounded-lg text-sm font-semibold transition" :class="p === currentPage
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'">
                {{ p }}
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-2 rounded-lg border text-sm font-medium border-gray-200 text-gray-600
                       hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition">Next →</button>
        </div>
    </div>
</template>