<script setup>
import UserLayout from '@/Layouts/UserLayout.vue';
import { ref, computed } from 'vue'
import { Head, usePage, router, Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import {
    UserIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    AcademicCapIcon,
    CheckBadgeIcon,
    XMarkIcon,
    NewspaperIcon,
    DocumentTextIcon,
    SparklesIcon,
    ArrowTrendingUpIcon,
    MegaphoneIcon,
    EnvelopeIcon
} from '@heroicons/vue/24/solid'
import { ChartBarIcon } from '@heroicons/vue/24/outline';

const page = usePage();
const userName = page.props.auth.user.name || 'User';

const toast = ref({
    show: false,
    message: '',
    type: 'info'
});

const showToast = (message, type = 'info') => {
    toast.value.message = message;
    toast.value.type = type;
    toast.value.show = true;

    setTimeout(() => {
        toast.value.show = false;
    }, 2000);
};

const menuItems = [
    {
        title: 'Attendance',
        icon: AcademicCapIcon,
        route: route('guru.absensi.index'),
        color: 'from-sky-500 to-blue-600',
        bg: 'bg-sky-50 dark:bg-sky-900/20'
    },

    {
        title: 'Analytics',
        icon: ChartBarIcon,
        route: route('public.absensi.analytics'),
        color: 'from-indigo-500 to-purple-600',
        bg: 'bg-indigo-50 dark:bg-indigo-900/20'
    },

    {
        title: 'Learning',
        icon: NewspaperIcon,
        route: route('guru.material.index'),
        color: 'from-cyan-500 to-teal-500',
        bg: 'bg-cyan-50 dark:bg-cyan-900/20'
    },

    {
        title: 'Assignment',
        icon: DocumentTextIcon,
        route: route('guru.assignment.index'),
        color: 'from-violet-500 to-fuchsia-600',
        bg: 'bg-violet-50 dark:bg-violet-900/20'
    },

    {
        title: 'Quiz List',
        icon: ClipboardDocumentListIcon,
        route: route('guru.soal.index'),
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50 dark:bg-amber-900/20'
    },

    {
        title: 'Assessment',
        icon: UserGroupIcon,
        route: route('guru.NilaiUjian.index'),
        color: 'from-emerald-500 to-green-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },

    {
        title: 'Announcements',
        icon: MegaphoneIcon,
        route: route('pengumuman.index'),
        color: 'from-rose-500 to-pink-600',
        bg: 'bg-rose-50 dark:bg-rose-900/20'
    },

    {
        title: 'Messages',
        icon: EnvelopeIcon,
        route: route('pesan.index'),
        color: 'from-slate-500 to-gray-700',
        bg: 'bg-slate-50 dark:bg-slate-800/40'
    },
]

const goTo = (url) => {
    router.visit(url, {
        preserveScroll: true,
        preserveState: true,
    });
};

const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}
</script>

<template>

    <Head title="Dashboard" />

    <UserLayout>

        <!-- ── TOAST MOBILE ── -->
        <Transition enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-4 scale-95">
            <div v-if="toast.show" class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm 
                       bg-gray-900/95 backdrop-blur-xl text-white px-5 py-3.5 rounded-2xl shadow-2xl 
                       flex items-center justify-between z-50 border border-white/10 md:hidden">
                <span class="text-sm font-medium truncate">{{ toast.message }}</span>
                <button @click="toast.show = false"
                    class="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                    <XMarkIcon class="w-4 h-4" />
                </button>
            </div>
        </Transition>

        <!-- ── TOAST DESKTOP ── -->
        <Transition enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-x-4 scale-95" enter-to-class="opacity-100 translate-x-0 scale-100"
            leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-x-0 scale-100"
            leave-to-class="opacity-0 translate-x-4 scale-95">
            <div v-if="toast.show" class="hidden md:flex fixed top-6 right-6 w-80 px-5 py-4 rounded-2xl shadow-2xl z-50
                       backdrop-blur-xl border items-center gap-3 text-sm font-medium" :class="toast.type === 'success'
                        ? 'bg-emerald-500/90 border-emerald-400/30 text-white'
                        : 'bg-gray-900/95 border-white/10 text-white'">
                <div v-if="toast.type === 'success'"
                    class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span class="truncate">{{ toast.message }}</span>
                <button @click="toast.show = false"
                    class="ml-auto flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                    <XMarkIcon class="w-4 h-4" />
                </button>
            </div>
        </Transition>

        <!-- ── HERO WELCOME ── -->
        <div class="relative mb-7 overflow-hidden rounded-2xl">
            <!-- Background layers -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 
                        dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#312e81]"></div>
            <div class="absolute inset-0 opacity-30 dark:opacity-20"
                style="background-image: radial-gradient(circle at 20% 50%, rgba(99,102,241,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.3) 0%, transparent 50%)">
            </div>
            <!-- Decorative orbs -->
            <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none">
            </div>
            <div
                class="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-violet-500/10 blur-2xl pointer-events-none">
            </div>
            <!-- Subtle grid pattern -->
            <div class="absolute inset-0 opacity-[0.04]"
                style="background-image: linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px); background-size: 32px 32px;">
            </div>

            <div class="relative flex flex-col sm:flex-row items-center sm:text-left text-center gap-5 p-6 sm:p-8">
                <!-- Avatar -->
                <div class="relative flex-shrink-0">
                    <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 
                                flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {{ getInitials(userName) }}
                    </div>
                    <span
                        class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white/30"></span>
                </div>
                <!-- Text -->
                <div class="flex-1">
                    <h1 class="text-2xl sm:text-3xl font-bold text-white leading-tight">
                        Welcome, {{ userName }}! 👋
                    </h1>
                    <p class="text-white/70 text-sm sm:text-base mt-1">May your day remain productive and enjoyable!
                    </p>
                </div>
                <!-- Badge -->
                <div class="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 
                            px-4 py-2 rounded-full text-white/80 text-sm">
                    <SparklesIcon class="w-4 h-4 text-amber-300" />
                    <span>Lumiverse School</span>
                </div>
            </div>
        </div>

        <!-- ── STATS CARDS (Desktop) ── -->
        <div class="sm:grid hidden mb-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <!-- Proktor -->
            <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
                        bg-white border-gray-100 shadow-sm
                        dark:bg-gray-900/60 dark:border-gray-800 dark:shadow-none dark:backdrop-blur-xl">
                <div
                    class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/10 dark:to-transparent">
                </div>
                <div class="relative p-6 flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <UserIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Proktor</p>
                        <div class="flex items-end gap-2">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{
                                page.props.usersCount.proktor }}</h3>
                            <span class="text-xs text-gray-400 dark:text-gray-500 mb-0.5">pengguna</span>
                        </div>
                    </div>
                    <ArrowTrendingUpIcon class="w-4 h-4 text-purple-400 opacity-50" />
                </div>
                <div class="h-0.5 bg-gradient-to-r from-purple-500 to-violet-600 opacity-60 rounded-full mx-6 mb-4">
                </div>
            </div>

            <!-- Guru -->
            <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
                        bg-white border-gray-100 shadow-sm
                        dark:bg-gray-900/60 dark:border-gray-800 dark:shadow-none dark:backdrop-blur-xl">
                <div
                    class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/10 dark:to-transparent">
                </div>
                <div class="relative p-6 flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <AcademicCapIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Guru</p>
                        <div class="flex items-end gap-2">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ page.props.usersCount.guru
                            }}</h3>
                            <span class="text-xs text-gray-400 dark:text-gray-500 mb-0.5">pengguna</span>
                        </div>
                    </div>
                    <ArrowTrendingUpIcon class="w-4 h-4 text-emerald-400 opacity-50" />
                </div>
                <div class="h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-60 rounded-full mx-6 mb-4">
                </div>
            </div>

            <!-- Siswa -->
            <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
                        bg-white border-gray-100 shadow-sm
                        dark:bg-gray-900/60 dark:border-gray-800 dark:shadow-none dark:backdrop-blur-xl">
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            bg-gradient-to-br from-sky-50 to-transparent dark:from-sky-900/10 dark:to-transparent">
                </div>
                <div class="relative p-6 flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                        <UserGroupIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Siswa</p>
                        <div class="flex items-end gap-2">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ page.props.usersCount.siswa
                            }}</h3>
                            <span class="text-xs text-gray-400 dark:text-gray-500 mb-0.5">pengguna</span>
                        </div>
                    </div>
                    <ArrowTrendingUpIcon class="w-4 h-4 text-sky-400 opacity-50" />
                </div>
                <div class="h-0.5 bg-gradient-to-r from-sky-500 to-blue-600 opacity-60 rounded-full mx-6 mb-4"></div>
            </div>
        </div>

        <!-- ── FITUR TERBARU (Desktop) ── -->
        <div class="sm:block hidden rounded-2xl border transition-all duration-300
                    bg-white border-gray-100 shadow-sm
                    dark:bg-gray-900/60 dark:border-gray-800 dark:backdrop-blur-xl">
            <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div
                    class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                    <SparklesIcon class="w-4 h-4 text-white" />
                </div>
                <h2 class="font-semibold text-gray-800 dark:text-white">Fitur – Fitur Terbaru</h2>
            </div>

            <div class="p-6 grid sm:grid-cols-2 gap-4">
                <!-- Soon -->
                <div
                    class="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/15">
                    <div
                        class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckBadgeIcon class="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-800 dark:text-white mb-1">Coming Soon</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            Insya Allah kalo dapet moodnya! — Wali Kelas, Journal Online Prakerin, Nilai Harian, SPMB
                            dan Sistem Pembayaran Digital.
                        </p>
                    </div>
                </div>

                <!-- Learning Materials -->
                <div
                    class="flex gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/15">
                    <div
                        class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckBadgeIcon class="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-800 dark:text-white mb-1">Learning Materials</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            Membuat materi pembelajaran yang sudah support semua tipe external data seperti PDF, Excel,
                            Word, PPT, Image, Video!
                        </p>
                    </div>
                </div>

                <!-- Assignment -->
                <div
                    class="flex gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-500/15 sm:col-span-2">
                    <div
                        class="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckBadgeIcon class="w-4 h-4 text-sky-500" />
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-800 dark:text-white mb-1">Assignment List</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            Mengumpulkan tugas siswa jadi lebih mudah dan terindeks tanpa harus membuat drive terlebih
                            dahulu. Biarkan siswa upload tugasnya berdasarkan nama guru yang telah memberikan tugas —
                            tinggal tunggu sambil ngopi! ☕
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── MOBILE MENU GRID ── -->
        <div class="max-w-7xl mx-auto">
            <div class="grid md:hidden grid-cols-2 gap-3.5">
                <Link v-for="item in menuItems" :key="item.title" :href="item.route" prefetch="hover" preserve-scroll
                    preserve-state class="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                           border transition-all duration-300 active:scale-[0.97]
                           bg-white border-gray-100 shadow-sm
                           dark:bg-gray-900/60 dark:border-gray-800 dark:backdrop-blur-xl">
                    <!-- Hover glow -->
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        :class="item.bg"></div>
                    <!-- Icon bubble -->
                    <div class="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br"
                        :class="item.color">
                        <component :is="item.icon" class="w-6 h-6 text-white" />
                    </div>
                    <span
                        class="relative text-sm font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight">
                        {{ item.title }}
                    </span>
                </Link>
            </div>
        </div>

    </UserLayout>
</template>