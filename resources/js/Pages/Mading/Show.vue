<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { resolveEmbedUrl } from '@/Composables/useEmbedUrl.js'
import { CalendarDaysIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid'

const page = usePage()
const announcement = computed(() => page.props.announcement)

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const imageUrl = computed(() => announcement.value?.file_url ?? null)
const embedUrl = computed(() => resolveEmbedUrl(announcement.value?.video_url))
const hasRawUrl = computed(() => announcement.value?.video_url && !embedUrl.value)
</script>

<template>
    <div class="max-w-7xl sm:py-8 mx-auto sm:px-6">

        <Link :href="route('mading.index')" class="inline-flex py-4 items-center gap-2 font-semibold text-sm text-gray-500
                   hover:text-indigo-600 transition sm:px-0 px-4 sm:mb-6">
            <ArrowLeftIcon class="w-4 h-4" />
            Kembali ke Mading
        </Link>

        <article class="bg-white sm:rounded-2xl sm:shadow-lg sm:border sm:border-gray-200 overflow-hidden">

            <!-- Accent -->
            <div class="sm:h-2 h-0.5 animated-gradient" />

            <div class="p-6 sm:p-10 space-y-6">

                <!-- Judul -->
                <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                    {{ announcement.judul }}
                </h1>

                <!-- Meta -->
                <div class="flex items-center gap-3 text-sm text-gray-500">
                    <CalendarDaysIcon class="w-4 h-4" />
                    <span>{{ formatDate(announcement.created_at) }}</span>
                </div>

                <hr class="border-gray-100" />


                <!-- Gambar -->
                <div v-if="imageUrl" class="space-y-2">
                    <!-- <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Lampiran Gambar</p> -->
                    <div class="flex justify-center bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <img :src="imageUrl" :alt="announcement.judul" loading="lazy" decoding="async"
                            class="max-w-full max-h-[600px] object-contain" style="image-rendering: auto;" />
                    </div>
                </div>

                <!-- Video embed -->
                <div v-if="embedUrl">
                    <!-- <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Video</p> -->
                    <div class="relative w-full rounded-xl overflow-hidden shadow-md" style="padding-top:56.25%">
                        <iframe :src="embedUrl" class="absolute inset-0 w-full h-full" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen loading="lazy" />
                    </div>
                </div>

                <!-- Link tidak dikenali -->
                <div v-else-if="hasRawUrl">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Link Video</p>
                    <a :href="announcement.video_url" target="_blank" rel="noopener noreferrer"
                        class="text-sm text-indigo-600 hover:underline break-all">
                        {{ announcement.video_url }}
                    </a>
                </div>

                <!-- Isi -->
                <div class="ql-display max-w-none text-gray-700 leading-relaxed text-base"
                    v-html="announcement.pengumuman" />

            </div>
        </article>
    </div>
</template>

<style>
.animated-gradient {
    background: linear-gradient(270deg, #6366f1, #8b5cf6, #6366f1);
    background-size: 600% 100%;
    animation: gradientMove 5s linear infinite;
}

@keyframes gradientMove {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

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