<script setup>
import { Head, Link } from '@inertiajs/vue3'

defineProps({
    domain: {
        type: String,
        default: '',
    },
})
</script>

<template>

    <Head title="Lembaga Tidak Ditemukan" />

    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full text-center">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            <h1 class="text-xl font-semibold text-gray-900 mb-2">
                Sekolah atau Lembaga Tidak Ditemukan
            </h1>

            <p class="text-gray-500 mb-1">
                Tidak ada sekolah atau lembaga pendidikan yang terdaftar dengan alamat ini.
            </p>

            <p v-if="domain" class="text-sm text-gray-400 font-mono mb-6">
                {{ domain }}
            </p>
            <p v-else class="mb-6"></p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">

                <a href="https://lumiverse.co.id" class="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium
                text-white hover:bg-gray-800">
                    Ke Halaman Utama
                </a>

                <a href="https://lumiverse.co.id/registration" class="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm
                font-medium text-gray-700 hover:bg-gray-50">
                    Daftarkan Lembaga Baru
                </a>
            </div>
        </div>
    </div>
</template>