<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { computed } from 'vue'
import { Link, router } from '@inertiajs/vue3'
import { resolveEmbedUrl } from '@/Composables/useEmbedUrl.js'
import {
    ArrowLeftIcon, CalendarDaysIcon, UserIcon,
    PencilSquareIcon, TrashIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
    pengumuman: { type: Object, required: true },
    canManage: { type: Boolean, default: false },
})

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })

const imageUrl = computed(() => props.pengumuman.file_url ?? null)
const embedUrl = computed(() => resolveEmbedUrl(props.pengumuman.video_url))
const hasRawUrl = computed(() => props.pengumuman.video_url && !embedUrl.value)

const confirmDelete = () => {
    if (!confirm('Hapus pengumuman ini?')) return
    router.delete(route('pengumuman.destroy', props.pengumuman.id))
}
</script>

<template>
    <MenuLayout>
        <div class="mx-auto px-4 space-y-6">

            <!-- Nav -->
            <div class="flex items-center justify-between">
                <Link :href="route('pengumuman.index')" class="inline-flex items-center gap-2 text-sm font-semibold
                           text-gray-500 dark:text-gray-400
                           hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    <ArrowLeftIcon class="w-4 h-4" /> Back to List
                </Link>
                <div v-if="canManage" class="flex items-center gap-2">
                    <Link :href="route('pengumuman.edit', pengumuman.id)" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                               bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15
                               text-gray-700 dark:text-gray-200 transition">
                        <PencilSquareIcon class="w-4 h-4" /> Edit
                    </Link>
                    <button @click="confirmDelete" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                               bg-red-600 hover:bg-red-700 text-white transition">
                        <TrashIcon class="w-4 h-4" /> Hapus
                    </button>
                </div>
            </div>

            <!-- Card -->
            <article class="rounded-2xl border border-white/20 dark:border-white/10
                            bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">

                <!-- Accent -->
                <div class="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />

                <div class="p-6 sm:p-10 space-y-6">

                    <!-- Judul -->
                    <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        {{ pengumuman.judul }}
                    </h1>

                    <!-- Meta -->
                    <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span class="flex items-center gap-1.5">
                            <CalendarDaysIcon class="w-4 h-4" />
                            {{ formatDate(pengumuman.created_at) }}
                        </span>
                        <span v-if="pengumuman.user" class="flex items-center gap-1.5">
                            <UserIcon class="w-4 h-4" />
                            {{ pengumuman.user.name }}
                        </span>
                    </div>

                    <hr class="border-gray-200 dark:border-white/10" />

                    <!-- Gambar -->
                    <div v-if="imageUrl" class="space-y-2">
                        <!-- <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Lampiran Gambar</p> -->
                        <div class="flex justify-center bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <img :src="imageUrl" :alt="pengumuman.judul" loading="lazy" decoding="async"
                                class="max-w-full max-h-[600px] object-contain" style="image-rendering: auto;" />
                        </div>
                    </div>

                    <!-- Lampiran Video (embed) -->
                    <div v-if="embedUrl" class="pt-2">
                        <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                            Video
                        </p>
                        <div class="relative w-full rounded-xl overflow-hidden shadow-md" style="padding-top: 56.25%">
                            <iframe :src="embedUrl" class="absolute inset-0 w-full h-full" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen loading="lazy" />
                        </div>
                    </div>

                    <!-- Video: link tidak dikenali -->
                    <div v-else-if="hasRawUrl" class="pt-2">
                        <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                            Link Video
                        </p>
                        <a :href="pengumuman.video_url" target="_blank" rel="noopener noreferrer"
                            class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all">
                            {{ pengumuman.video_url }}
                        </a>
                    </div>

                    <!-- Isi -->
                    <div class="ql-display max-w-none text-gray-700 dark:text-gray-200 leading-relaxed text-base"
                        v-html="pengumuman.pengumuman" />

                </div>
            </article>
        </div>
    </MenuLayout>
</template>

<style>
.ql-display p {
    margin: 0;
    min-height: 1.2em;
}

.ql-display strong {
    font-weight: 700;
}

.ql-display em {
    font-style: italic;
}

.ql-display u {
    text-decoration: underline;
}

.ql-display a {
    color: #6366f1;
    text-decoration: underline;
}

.ql-display ul {
    list-style-type: disc;
    padding-left: 1.5rem;
}

.ql-display ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
}

.ql-display h1 {
    font-size: 1.5rem;
    font-weight: 700;
}

.ql-display h2 {
    font-size: 1.25rem;
    font-weight: 700;
}

.ql-display h3 {
    font-size: 1.1rem;
    font-weight: 700;
}

.ql-display blockquote {
    border-left: 3px solid #e5e7eb;
    padding-left: 1rem;
    color: #6b7280;
}
</style>