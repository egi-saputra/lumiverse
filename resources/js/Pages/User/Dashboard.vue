<script setup>
import { Head, Link } from '@inertiajs/vue3'
import { CheckCircleIcon, PowerIcon } from '@heroicons/vue/24/solid'
</script>

<template>

    <Head title="Pendaftaran Berhasil" />

    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#063970] via-[#0a4e8c] to-[#0f6ab4] px-4">

        <div class="relative max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center">

            <!-- Icon -->
            <div class="flex justify-center mb-4">
                <CheckCircleIcon class="w-20 h-20 text-green-500 drop-shadow-lg" />
            </div>

            <!-- Title -->
            <h1 class="text-2xl font-bold text-[#063970] mb-2">
                Pendaftaran Berhasil
            </h1>

            <!-- Message -->
            <p class="text-gray-700 leading-relaxed mb-6">
                Akun Anda telah berhasil didaftarkan.<br>
                Silakan menghubungi
                <span class="font-semibold text-[#063970]">Administrator</span>
                untuk proses aktivasi sebelum Anda dapat mengakses sistem.
            </p>

            <!-- Divider -->
            <div class="h-px w-full bg-gray-300/60 my-5"></div>

            <!-- Logout Button -->
            <Link :href="route('logout')" method="post" as="button" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       bg-gradient-to-br from-red-500 to-red-600
                       hover:from-red-600 hover:to-red-700
                       text-white font-semibold transition-all duration-300 shadow-lg">

                <PowerIcon class="w-5 h-5" />
                Logout
            </Link>

            <!-- Footer Text -->
            <p class="mt-5 text-xs text-gray-500">
                © {{ new Date().getFullYear() }} Nusantara Learning Management System
            </p>

        </div>
    </div>
</template>
