<script setup>
import { Head } from '@inertiajs/vue3'

defineProps({
    schoolName: {
        type: String,
        default: '',
    },
})
</script>

<template>

    <Head title="Akun Tidak Aktif" />

    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full text-center">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
            </div>

            <h1 class="text-xl font-semibold text-gray-900 mb-2">
                Akun Sekolah Tidak Aktif
            </h1>

            <p v-if="schoolName" class="text-gray-500 mb-1">
                Akses untuk <span class="font-medium text-gray-700">{{ schoolName }}</span> saat ini sedang tidak aktif.
            </p>
            <p v-else class="text-gray-500 mb-1">
                Akses untuk sekolah ini saat ini sedang tidak aktif.
            </p>

            <p class="text-sm text-gray-400 mb-6">
                Silakan hubungi Lumiverse School support untuk informasi lebih lanjut.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">

                <a href="https://wa.me/628987504976" class="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium
                text-white hover:bg-gray-800">
                    Hubungi Support
                </a>

                <a href="https://lumiverse.co.id" class="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm
                font-medium text-gray-700 hover:bg-gray-50">
                    Ke Halaman Utama
                </a>
            </div>
        </div>
    </div>
</template>