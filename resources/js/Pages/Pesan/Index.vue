<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { computed } from 'vue'
import { usePage, Link } from '@inertiajs/vue3'
import { InboxIcon, EnvelopeOpenIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    pesan: { type: Array, default: () => [] },
})

const page = usePage()
const userRole = computed(() => page.props.auth?.role ?? '')

const labelPenerima = (item) => {
    if (item.penerima === 'semua') return 'Semua User'
    if (item.penerima === 'siswa') {
        return item.kelas ? `Kelas ${item.kelas.kelas}` : 'Semua Siswa'
    }
    return item.penerima.charAt(0).toUpperCase() + item.penerima.slice(1)
}

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
</script>

<template>
    <MenuLayout>
        <div class="mx-auto space-y-6">

            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
                        <InboxIcon class="w-6 h-6" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white leading-tight">
                            Kotak Masuk
                        </h1>
                        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {{ pesan.length }} pesan diterima (Tap pesan untuk membuka pesan)
                        </p>
                    </div>
                </div>

                <a v-if="['admin', 'proktor'].includes(userRole)" :href="route('pesan.create')" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white
                           bg-gradient-to-r from-indigo-600 to-purple-600
                           hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition">
                    ✉️ Kirim Pesan
                </a>
            </div>

            <!-- Empty state -->
            <div v-if="pesan.length === 0" class="rounded-2xl border border-white/20 dark:border-white/10
                       bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl py-20 text-center">
                <EnvelopeOpenIcon class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p class="text-gray-400 dark:text-gray-500 italic text-sm">Tidak ada pesan masuk.</p>
            </div>

            <!-- List pesan -->
            <ul v-else class="space-y-3">
                <li v-for="item in pesan" :key="item.id">
                    <Link :href="route('pesan.show', item.id)"
                        class="group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur- shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

                        <div class="flex flex-col gap-2 w-full">
                            <!-- Judul -->
                            <!-- <p
                                class="font-semibold text-sm text-gray-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {{ item.judul }}
                            </p> -->

                            <!-- Dari → Ke -->
                            <p class="mt-1 text-xs text-gray-400 dark:text-gray-500 truncate">
                                {{ item.pengirim.name }}
                                <span class="mx-1">→</span>
                                {{ labelPenerima(item) }}
                            </p>


                            <div class="flex w-full justify-between">
                                <!-- Preview isi -->
                                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {{ item.isi.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() }}
                                </p>

                                <!-- Waktu -->
                                <span class="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                                    {{ formatDate(item.created_at) }}
                                </span>
                            </div>
                        </div>
                    </Link>
                </li>
            </ul>

        </div>
    </MenuLayout>
</template>