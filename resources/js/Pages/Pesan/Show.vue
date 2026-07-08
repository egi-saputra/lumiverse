<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { Link } from '@inertiajs/vue3'
import { ArrowLeftIcon, CalendarDaysIcon, UserIcon, UsersIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    pesan: { type: Object, required: true },
})

const labelPenerima = (item) => {
    if (item.penerima === 'semua') return 'Semua User'
    if (item.penerima === 'siswa') {
        return item.kelas ? `Kelas ${item.kelas.kelas}` : 'Semua Siswa'
    }
    return item.penerima.charAt(0).toUpperCase() + item.penerima.slice(1)
}

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
</script>

<template>
    <MenuLayout>
        <div class="mx-auto px-4 space-y-6">

            <!-- Back -->
            <Link :href="route('pesan.index')" class="inline-flex items-center gap-2 text-sm font-semibold
                       text-gray-500 dark:text-gray-400
                       hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                <ArrowLeftIcon class="w-4 h-4" /> Kembali
            </Link>

            <!-- Card -->
            <article class="rounded-2xl border border-white/20 dark:border-white/10
                            bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">

                <div class="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />

                <div class="p-6 sm:p-10 space-y-6">

                    <!-- Judul -->
                    <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        {{ pesan.judul }}
                    </h1>

                    <!-- Meta -->
                    <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span class="flex items-center gap-1.5">
                            <UserIcon class="w-4 h-4" />
                            Dari: <strong class="text-gray-700 dark:text-gray-200 ml-1">{{ pesan.pengirim.name
                            }}</strong>
                        </span>
                        <span class="flex items-center gap-1.5">
                            <UsersIcon class="w-4 h-4" />
                            Kepada: <strong class="text-gray-700 dark:text-gray-200 ml-1">{{ labelPenerima(pesan)
                            }}</strong>
                        </span>
                        <span class="flex items-center gap-1.5">
                            <CalendarDaysIcon class="w-4 h-4" />
                            {{ formatDate(pesan.created_at) }}
                        </span>
                    </div>

                    <hr class="border-gray-200 dark:border-white/10" />

                    <!-- Isi -->
                    <div class="ql-display max-w-none text-gray-700 dark:text-gray-200 leading-relaxed text-base"
                        v-html="pesan.isi" />

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

.dark .ql-display {
    color: #e5e7eb;
}

.dark .ql-display a {
    color: #818cf8;
}

.dark .ql-display blockquote {
    border-color: rgba(255, 255, 255, 0.1);
    color: #9ca3af;
}
</style>