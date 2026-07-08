<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { ref, computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import {
    MegaphoneIcon, PlusIcon, CalendarDaysIcon,
    ChevronRightIcon, PhotoIcon, VideoCameraIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
    pengumuman: { type: Array, default: () => [] },
    canManage: { type: Boolean, default: false },
})

// ── Pagination ────────────────────────────────────────────
const PER_PAGE = 8
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(props.pengumuman.length / PER_PAGE)))
const paginated = computed(() => {
    const s = (currentPage.value - 1) * PER_PAGE
    return props.pengumuman.slice(s, s + PER_PAGE)
})
const prev = () => { if (currentPage.value > 1) currentPage.value-- }
const next = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

// ── Helpers ───────────────────────────────────────────────
const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })

const excerpt = (html, len = 130) => {
    const plain = (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return plain.length > len ? plain.slice(0, len) + '…' : plain
}
</script>

<template>
    <MenuLayout>
        <div class="mx-auto space-y-6">

            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
                        <MegaphoneIcon class="w-6 h-6" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Informasi Terkini</h1>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {{ pengumuman.length }} pengumuman tersedia
                        </p>
                    </div>
                </div>
                <Link v-if="canManage" :href="route('pengumuman.create')" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white
                           bg-gradient-to-r from-indigo-600 to-purple-600
                           hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition">
                    <PlusIcon class="w-4 h-4" />
                    Buat Pengumuman
                </Link>
            </div>

            <!-- Empty -->
            <div v-if="pengumuman.length === 0" class="rounded-2xl border border-white/20 dark:border-white/10
                       bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl
                       py-20 text-center space-y-2">
                <MegaphoneIcon class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                <p class="text-gray-400 dark:text-gray-500 italic text-sm">Belum ada pengumuman.</p>
            </div>

            <!-- List -->
            <ul v-else class="space-y-3">
                <li v-for="item in paginated" :key="item.id">
                    <Link :href="route('pengumuman.show', item.id)" class="group flex items-start gap-4 p-5 rounded-2xl
                               bg-white/70 dark:bg-white/5 backdrop-blur-xl
                               border border-white/20 dark:border-white/10
                               shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <div class="flex-1 min-w-0">
                            <h2 class="font-bold text-base text-gray-800 dark:text-white truncate
                                       group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {{ item.judul }}
                            </h2>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {{ excerpt(item.pengumuman) }}
                            </p>
                            <div
                                class="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                                <span class="flex items-center gap-1">
                                    <CalendarDaysIcon class="w-3.5 h-3.5" />
                                    {{ formatDate(item.created_at) }}
                                </span>
                                <span v-if="item.user" class="hidden sm:inline">
                                    oleh <strong class="text-gray-600 dark:text-gray-300">{{ item.user.name }}</strong>
                                </span>
                                <span v-if="item.file_path" class="flex items-center gap-1 text-indigo-400">
                                    <PhotoIcon class="w-3.5 h-3.5" /> Gambar
                                </span>
                                <span v-if="item.video_url" class="flex items-center gap-1 text-purple-400">
                                    <VideoCameraIcon class="w-3.5 h-3.5" /> Video
                                </span>
                            </div>
                        </div>
                        <ChevronRightIcon
                            class="shrink-0 w-5 h-5 mt-1 text-gray-300 dark:text-gray-600
                                   group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" />
                    </Link>
                </li>
            </ul>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 pt-2">
                <button @click="prev" :disabled="currentPage === 1" class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-white/10
                           text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-white/10
                           disabled:opacity-40 transition">← Prev</button>
                <span class="px-4 py-2 rounded-lg bg-white/50 dark:bg-white/5
                             text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ currentPage }} / {{ totalPages }}
                </span>
                <button @click="next" :disabled="currentPage === totalPages" class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-white/10
                           text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-white/10
                           disabled:opacity-40 transition">Next →</button>
            </div>

        </div>
    </MenuLayout>
</template>