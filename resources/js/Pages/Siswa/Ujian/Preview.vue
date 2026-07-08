<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { Head, Link, router } from '@inertiajs/vue3'
import { ArrowLeftIcon, PlayCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    soal: Object,
    jumlahSoal: Number,
})

const mulaiUjian = () => {

    if (props.jumlahSoal <= 0) {
        alert('Quiz ini belum memiliki soal, silakan hubungi panitia ujian!')
        return
    }

    router.visit(route('siswa.ujian.kerjakan', props.soal.id))
}
</script>

<template>
    <!-- <MenuLayout> -->

    <div class="dark:bg-[#020617]">

        <Head title="Informasi Ujian" />

        <!-- Header -->
        <template>
            <h2 class="text-xl md:text-3xl font-extrabold tracking-tight
                       bg-gradient-to-r from-indigo-500 to-purple-600
                       bg-clip-text text-transparent">
                Informasi Ujian
            </h2>
        </template>

        <!-- CONTAINER -->
        <div class="sm:max-w-4xl mx-auto sm:px-4 sm:py-8">

            <!-- GLASS CARD -->
            <div class="relative overflow-hidden sm:rounded-3xl
                       bg-white/70 dark:bg-white/5
                       backdrop-blur-xl
                       border border-white/30 dark:border-white/10
                       shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]
                       py-6 p-4 md:p-10">

                <!-- Glow -->
                <div class="absolute inset-0 pointer-events-none
                            bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent"></div>

                <!-- Title -->
                <h3 class="relative z-10 text-2xl md:text-4xl font-extrabold
                           text-gray-800 dark:text-white text-center mb-10">
                    Quiz / Exam Overview
                </h3>

                <!-- TOKEN -->
                <div class="relative z-10 mb-10 p-6 md:p-8 rounded-2xl
                           bg-gradient-to-br from-indigo-500 to-purple-600
                           text-center shadow-xl">
                    <p class="text-xs uppercase tracking-[0.3em] text-white/80">
                        Exam Token
                    </p>
                    <p class="mt-3 text-4xl md:text-5xl font-black tracking-widest text-white select-all">
                        {{ soal.token }}
                    </p>
                </div>

                <!-- INFO GRID -->
                <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

                    <div v-for="([label, value], i) in [
                        ['Quiz Title', soal.title ?? 'Tidak ada'],
                        ['Subject', soal.mapel?.mapel ?? '-'],
                        ['Class Unit', soal.kelas ?? '-'],
                        ['Total Questions', jumlahSoal + ' Items'],
                        ['Duration', soal.waktu + ' Minutes']
                    ]" :key="i" class="p-4 rounded-2xl
               bg-white/70 dark:bg-white/5
               backdrop-blur-lg
               border border-white/30 dark:border-white/10
               shadow-md hover:shadow-xl
               transition-all duration-300">

                        <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            {{ label }}
                        </p>

                        <p class="mt-1 font-semibold text-gray-800 dark:text-white">
                            {{ value }}
                        </p>

                    </div>

                </div>

                <!-- WARNING -->
                <div class="relative z-10 p-6 rounded-2xl
                           bg-red-500/10 dark:bg-red-500/20
                           border border-red-500/30
                           shadow-lg mb-10">
                    <h4 class="flex items-center gap-2 font-bold text-red-600 dark:text-red-400 mb-4">
                        ⚠️ Perhatian Penting
                    </h4>

                    <ul class="list-disc list-inside text-sm text-red-600 dark:text-red-300 space-y-2">
                        <li>Kerjakan ujian sesuai waktu yang ditentukan.</li>
                        <li>Waktu dimulai setelah klik <b>Kerjakan</b>.</li>
                        <li>Ujian otomatis berakhir saat waktu habis.</li>
                        <li>Dilarang membuka tab baru atau refresh.</li>
                        <li>Dilarang copy–paste, screenshot, shortcut, DevTools.</li>
                    </ul>

                    <p class="mt-4 text-sm font-medium text-red-700 dark:text-red-300">
                        Pelanggaran dapat menyebabkan ujian dibatalkan otomatis.
                    </p>
                </div>

                <!-- ACTION -->
                <div class="relative z-10 flex flex-col sm:flex-row gap-4 justify-between">

                    <Link :href="route('siswa.ujian.token')" class="flex items-center justify-center gap-2
                               px-6 py-3 rounded-xl
                               bg-gray-800 hover:bg-gray-900
                               text-white font-semibold
                               transition shadow-lg">
                        <ArrowLeftIcon class="w-5 h-5" />
                        Kembali
                    </Link>

                    <button @click="mulaiUjian" class="flex items-center justify-center gap-2
           px-8 py-3 rounded-xl
           bg-gradient-to-r from-indigo-500 to-purple-600
           hover:from-indigo-600 hover:to-purple-700
           text-white font-extrabold
           shadow-xl transition transform hover:-translate-y-0.5">
                        <PlayCircleIcon class="w-6 h-6" />
                        Kerjakan Ujian
                    </button>

                </div>

            </div>
        </div>
    </div>
    <!-- </MenuLayout> -->
</template>
