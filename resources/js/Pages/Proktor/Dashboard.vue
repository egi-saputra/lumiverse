<script setup>
import UserLayout from '@/Layouts/UserLayout.vue';
import { ref } from 'vue'
import { Head, usePage, Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import {
    UserGroupIcon,
    ClipboardDocumentListIcon,
    UserIcon,
    AcademicCapIcon,
    XMarkIcon,
    NewspaperIcon,
    DocumentTextIcon,
    MegaphoneIcon
} from '@heroicons/vue/24/solid'

const page = usePage();
const userName = page.props.auth.user.name || 'User';
const userInitials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const toast = ref({ show: false, message: '', type: 'info' });

const showToast = (message, type = 'info') => {
    toast.value = { show: true, message, type };
    setTimeout(() => { toast.value.show = false; }, 2000);
};

const menuItems = [
    {
        title: 'Students',
        desc: 'Kelola data siswa',
        icon: UserGroupIcon,
        route: route('proktor.peserta.index'),
        color: 'purple',
    },
    {
        title: 'Exam Room',
        desc: 'Ruang ujian aktif',
        icon: DocumentTextIcon,
        route: route('proktor.ruangUjian.index'),
        color: 'blue',
    },
    {
        title: 'Quiz List',
        desc: 'Daftar soal ujian',
        icon: ClipboardDocumentListIcon,
        route: route('proktor.soal.index'),
        color: 'green',
    },
    {
        title: 'Assessment',
        desc: 'Penilaian siswa',
        icon: NewspaperIcon,
        route: route('proktor.nilai.index'),
        color: 'amber',
    },
    {
        title: 'Announcement',
        desc: 'Kirim token & pengumuman',
        icon: MegaphoneIcon,
        route: route('pesan.index'),
        color: 'red',
        wide: true,
    },
]

const statCards = [
    { label: 'Proktor', key: 'proktor', color: 'purple', icon: UserIcon },
    { label: 'Guru', key: 'guru', color: 'green', icon: AcademicCapIcon },
    { label: 'Siswa', key: 'siswa', color: 'blue', icon: UserGroupIcon },
]

const notices = [
    { type: 'g', text: 'Pastikan semua <b>data soal</b> sudah benar sebelum ujian dimulai.' },
    { type: 'g', text: 'Pastikan semua <b>data siswa</b> sudah dicek dan benar sebelum ujian.' },
    { type: 'g', text: 'Siswa yang tidak diperkenankan ujian dapat <b>dinonaktifkan</b> di fitur daftar siswa.' },
    { type: 'y', text: 'Berikan <b>token soal secara bergilir</b> dengan jeda beberapa detik / menit antar ruang.' },
    { type: 'g', text: 'Token dapat dikirim melalui fitur <b>Ruang Informasi</b> berdasarkan kelas masing-masing.' },
    { type: 'g', text: 'Minta pengawas konfirmasi ke siswa bahwa <b>token ujian telah dikirim</b>.' },
    { type: 'g', text: 'Siswa dapat melihat token melalui <b>notifikasi icon bell</b> di pojok kanan atas.' },
    { type: 'r', text: '<b>Jangan edit data soal saat ujian berlangsung!</b> Dapat menyebabkan cache sistem bermasalah dan data tidak sinkron.' },
    { type: 'b', text: 'Pantau alur ujian pada <b>Ruang Ujian</b>, jangan lupa sambil ngopi biar gak goyang! Semangat!! ☕' },
]
</script>

<template>

    <Head title="Dashboard" />

    <UserLayout>

        <!-- ===== TOAST MOBILE ===== -->
        <Transition name="toast">
            <div v-if="toast.show" class="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md
                       bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl
                       flex items-center justify-between z-50 md:hidden border border-white/10">
                <span class="truncate text-sm">{{ toast.message }}</span>
                <button @click="toast.show = false" class="ml-4 flex-shrink-0 text-white/60 hover:text-white">
                    <XMarkIcon class="w-4 h-4" />
                </button>
            </div>
        </Transition>

        <!-- ===== TOAST DESKTOP ===== -->
        <Transition name="toast-desk">
            <div v-if="toast.show" class="hidden md:flex fixed top-5 right-5 w-80 px-5 py-3.5 rounded-xl shadow-2xl z-50
                       items-center gap-3 text-white border border-white/10"
                :class="toast.type === 'success' ? 'bg-emerald-700' : 'bg-gray-900'">
                <svg v-if="toast.type === 'success'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor"
                    stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="truncate text-sm">{{ toast.message }}</span>
                <button @click="toast.show = false" class="ml-auto text-white/60 hover:text-white">
                    <XMarkIcon class="w-4 h-4" />
                </button>
            </div>
        </Transition>

        <!-- ===== TOPBAR ===== -->
        <div class="flex items-center justify-between mb-7 animate-slide-down">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600
                            flex items-center justify-center text-white font-bold text-sm
                            shadow-lg shadow-indigo-500/30">
                    ✨
                </div>
                <div>
                    <p class="text-sm font-semibold leading-none tracking-tight
                               text-gray-900 dark:text-slate-100"><span class="sm:inline-flex hidden">Lumiverse
                            System</span>
                        <span class="inline-flex sm:hidden">Kreaticraft Smart Learning
                            System</span>
                    </p>
                    <p class="text-[11px] mt-0.5 text-gray-400 dark:text-slate-500">Proktor Dashboard</p>
                </div>
            </div>
            <div class="flex items-center gap-2.5">
                <span class="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full
                             text-[11px] font-mono font-medium tracking-wider
                             bg-indigo-50 border border-indigo-200 text-indigo-600
                             dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-300">
                    PROKTOR
                </span>
                <div class="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
                            sm:flex hidden items-center justify-center text-white text-xs font-semibold
                            border-2 border-indigo-200 dark:border-indigo-500/40 cursor-pointer">
                    {{ userInitials }}
                    <span class="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full
                                 border-2 border-white dark:border-[#0b0f1a]"></span>
                </div>
            </div>
        </div>

        <!-- ===== WELCOME BANNER ===== -->
        <div class="relative overflow-hidden rounded-2xl mb-6 p-6 sm:p-8 animate-fade-up
                    bg-white border border-blue-100
                    dark:bg-[#111827] dark:border-blue-500/20" style="animation-delay:.05s">
            <!-- Glow -->
            <div class="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none blur-3xl
                        bg-indigo-100 dark:bg-indigo-600/20"></div>
            <div class="absolute -bottom-16 left-4 w-48 h-48 rounded-full pointer-events-none blur-3xl
                        bg-blue-50 dark:bg-blue-500/10"></div>
            <!-- Grid pattern -->
            <div class="absolute inset-0 opacity-[0.035] dark:opacity-[0.03]"
                style="background-image:repeating-linear-gradient(0deg,#6366f1 0,#6366f1 1px,transparent 1px,transparent 25px),repeating-linear-gradient(90deg,#6366f1 0,#6366f1 1px,transparent 1px,transparent 25px)">
            </div>

            <div class="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                <!-- Icon -->
                <div
                    class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0
                            bg-blue-50 border border-blue-200
                            dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-indigo-600/20 dark:border-indigo-500/30">
                    <UserIcon class="w-7 h-7 text-blue-500 dark:text-blue-400" />
                </div>
                <!-- Text -->
                <div class="flex-1">
                    <h1
                        class="text-xl sm:text-2xl font-bold tracking-tight
                               text-gray-800 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-slate-400 dark:bg-clip-text">
                        Welcome, {{ userName }}! 👋
                    </h1>
                    <p class="text-sm mt-1 text-gray-400 dark:text-slate-400">
                        May your day remain productive and enjoyable!
                    </p>
                </div>
                <!-- Mini stats -->
                <div class="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <div class="text-center px-5 py-2 rounded-xl
                                bg-blue-50 border border-blue-100
                                dark:bg-transparent dark:border-0">
                        <p
                            class="text-2xl font-bold font-mono tracking-tight
                                  text-blue-600
                                  dark:text-transparent dark:bg-gradient-to-b dark:from-blue-300 dark:to-indigo-400 dark:bg-clip-text">
                            {{ page.props.usersCount?.siswa ?? 0 }}
                        </p>
                        <p class="text-[10px] uppercase tracking-widest mt-1 text-gray-400 dark:text-slate-500">Siswa
                        </p>
                    </div>
                    <div class="w-px h-8 bg-blue-100 dark:bg-white/5"></div>
                    <div class="text-center px-5 py-2 rounded-xl
                                bg-indigo-50 border border-indigo-100
                                dark:bg-transparent dark:border-0">
                        <p
                            class="text-2xl font-bold font-mono tracking-tight
                                  text-indigo-600
                                  dark:text-transparent dark:bg-gradient-to-b dark:from-blue-300 dark:to-indigo-400 dark:bg-clip-text">
                            {{ page.props.usersCount?.proktor ?? 0 }}
                        </p>
                        <p class="text-[10px] uppercase tracking-widest mt-1 text-gray-400 dark:text-slate-500">Proktor
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== STAT CARDS ===== -->
        <div class="hidden sm:grid grid-cols-3 gap-3 mb-6">
            <div v-for="(card, i) in statCards" :key="card.key" class="relative overflow-hidden rounded-2xl border p-5 cursor-default
                       transition-all duration-200 hover:-translate-y-1 animate-fade-up
                       bg-white dark:bg-[#111827]" :class="{
                        'border-violet-100 hover:border-violet-300 dark:border-indigo-500/20 dark:hover:border-indigo-500/50': card.color === 'purple',
                        'border-blue-100   hover:border-blue-300   dark:border-blue-500/20   dark:hover:border-blue-500/50': card.color === 'blue',
                        'border-emerald-100 hover:border-emerald-300 dark:border-emerald-500/20 dark:hover:border-emerald-500/50': card.color === 'green',
                    }" :style="`animation-delay:${0.12 + i * 0.05}s`">

                <!-- Top accent bar -->
                <div class="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-2xl" :class="{
                    'bg-gradient-to-r from-indigo-500 to-violet-400': card.color === 'purple',
                    'bg-gradient-to-r from-blue-500 to-sky-400': card.color === 'blue',
                    'bg-gradient-to-r from-emerald-500 to-teal-400': card.color === 'green',
                }">
                </div>

                <!-- Icon -->
                <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-4" :class="{
                    'bg-violet-50  dark:bg-indigo-500/10': card.color === 'purple',
                    'bg-blue-50    dark:bg-blue-500/10': card.color === 'blue',
                    'bg-emerald-50 dark:bg-emerald-500/10': card.color === 'green',
                }">
                    <component :is="card.icon" class="w-[18px] h-[18px]" :class="{
                        'text-violet-500 dark:text-violet-400': card.color === 'purple',
                        'text-blue-500   dark:text-sky-400': card.color === 'blue',
                        'text-emerald-500 dark:text-teal-400': card.color === 'green',
                    }" />
                </div>

                <p class="text-[11px] uppercase tracking-widest font-medium mb-1
                          text-gray-400 dark:text-slate-500">{{ card.label }}</p>
                <p class="text-3xl font-bold font-mono tracking-tight" :class="{
                    'text-violet-600 dark:text-violet-300': card.color === 'purple',
                    'text-blue-600   dark:text-sky-300': card.color === 'blue',
                    'text-emerald-600 dark:text-teal-300': card.color === 'green',
                }">
                    {{ page.props.usersCount?.[card.key] ?? 0 }}
                </p>
            </div>
        </div>

        <!-- ===== QUICK NAV ===== -->
        <p class="text-[11px] uppercase tracking-widest font-semibold mb-3 px-0.5 animate-fade-up
                  text-gray-400 dark:text-slate-500" style="animation-delay:.28s">
            Navigasi Cepat
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <Link v-for="(item, i) in menuItems" :key="item.title" :href="item.route" prefetch="hover" preserve-scroll
                preserve-state class="group relative flex flex-col items-start gap-3 p-4 rounded-2xl border
                       transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl
                       animate-fade-up bg-white dark:bg-[#111827]" :class="{
                        'border-violet-100 hover:border-violet-300 hover:shadow-violet-100/60 dark:border-indigo-500/20 dark:hover:border-indigo-500/50 dark:hover:shadow-indigo-500/10': item.color === 'purple',
                        'border-blue-100   hover:border-blue-300   hover:shadow-blue-100/60   dark:border-blue-500/20   dark:hover:border-blue-500/50   dark:hover:shadow-blue-500/10': item.color === 'blue',
                        'border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/60 dark:border-emerald-500/20 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10': item.color === 'green',
                        'border-amber-100  hover:border-amber-300  hover:shadow-amber-100/60  dark:border-amber-500/20  dark:hover:border-amber-500/50  dark:hover:shadow-amber-500/10': item.color === 'amber',
                        'border-red-100    hover:border-red-300    hover:shadow-red-100/60    dark:border-red-500/20    dark:hover:border-red-500/50    dark:hover:shadow-red-500/10': item.color === 'red',
                        'sm:col-span-2 lg:col-span-1': item.wide,
                    }" :style="`animation-delay:${0.32 + i * 0.05}s`">

                <div class="w-10 h-10 rounded-[11px] flex items-center justify-center
                            transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3" :class="{
                                'bg-violet-50  dark:bg-indigo-500/10': item.color === 'purple',
                                'bg-blue-50    dark:bg-blue-500/10': item.color === 'blue',
                                'bg-emerald-50 dark:bg-emerald-500/10': item.color === 'green',
                                'bg-amber-50   dark:bg-amber-500/10': item.color === 'amber',
                                'bg-red-50     dark:bg-red-500/10': item.color === 'red',
                            }">
                    <component :is="item.icon" class="w-5 h-5" :class="{
                        'text-violet-500 dark:text-violet-400': item.color === 'purple',
                        'text-blue-500   dark:text-sky-400': item.color === 'blue',
                        'text-emerald-500 dark:text-teal-400': item.color === 'green',
                        'text-amber-500  dark:text-amber-400': item.color === 'amber',
                        'text-red-500    dark:text-red-400': item.color === 'red',
                    }" />
                </div>

                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold leading-tight
                               text-gray-800 dark:text-slate-100">{{ item.title }}</p>
                    <p class="text-[11px] mt-0.5 leading-tight
                               text-gray-400 dark:text-slate-500">{{ item.desc }}</p>
                </div>

                <span class="text-xs transition-all duration-200
                             text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1
                             dark:text-slate-600 dark:group-hover:text-blue-400">→</span>
            </Link>
        </div>

        <!-- ===== NOTICE BOARD ===== -->
        <div class="rounded-2xl border p-5 sm:p-6 animate-fade-up
                    bg-white border-gray-100
                    dark:bg-[#111827] dark:border-white/5" style="animation-delay:.55s">

            <!-- Header -->
            <div class="flex items-center gap-3 mb-5 pb-4
                        border-b border-gray-100 dark:border-white/5">
                <div class="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0
                            bg-amber-50 dark:bg-amber-500/10">
                    <svg class="w-[18px] h-[18px] text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor"
                        stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <div>
                    <p class="text-[15px] font-semibold tracking-tight
                               text-gray-800 dark:text-slate-100">Peringatan Penting</p>
                    <p class="text-[11px] mt-0.5 text-gray-400 dark:text-slate-500">Panduan pelaksanaan ujian</p>
                </div>
            </div>

            <!-- Notice items -->
            <ul class="space-y-1.5">
                <li v-for="notice in notices" :key="notice.text" class="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-transparent
                           transition-all duration-150
                           hover:bg-gray-50 hover:border-gray-100
                           dark:hover:bg-white/[0.03] dark:hover:border-white/5">

                    <div class="w-[22px] h-[22px] rounded-[7px] flex items-center justify-center flex-shrink-0 mt-px"
                        :class="{
                            'bg-emerald-50 dark:bg-emerald-500/10': notice.type === 'g',
                            'bg-amber-50   dark:bg-amber-500/10': notice.type === 'y',
                            'bg-red-50     dark:bg-red-500/10': notice.type === 'r',
                            'bg-blue-50    dark:bg-blue-500/10': notice.type === 'b',
                        }">
                        <svg v-if="notice.type === 'g'" class="w-3 h-3 text-emerald-500 dark:text-emerald-400"
                            fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <svg v-else-if="notice.type === 'y'" class="w-3 h-3 text-amber-500 dark:text-amber-400"
                            fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.007v-.008H12z" />
                        </svg>
                        <svg v-else-if="notice.type === 'r'" class="w-3 h-3 text-red-500 dark:text-red-400" fill="none"
                            stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <svg v-else-if="notice.type === 'b'" class="w-3 h-3 text-blue-500 dark:text-blue-400"
                            fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>

                    <p class="text-[13px] leading-relaxed flex-1 notice-text
                               text-gray-500 dark:text-slate-400" v-html="notice.text"></p>
                </li>
            </ul>
        </div>

    </UserLayout>
</template>

<style scoped>
@keyframes slide-down {
    from {
        opacity: 0;
        transform: translateY(-12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-up {
    from {
        opacity: 0;
        transform: translateY(16px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-down {
    animation: slide-down .45s ease both;
}

.animate-fade-up {
    opacity: 0;
    animation: fade-up .45s ease both;
}

/* Bold teks notice menyesuaikan mode */
/* Bold notice */
.notice-text :deep(b) {
    font-weight: 600;
    color: #1e293b;
}

/* Dark mode */
.dark .notice-text :deep(b) {
    color: #f8fafc;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
    transition: all .25s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
}

.toast-desk-enter-active,
.toast-desk-leave-active {
    transition: all .25s ease;
}

.toast-desk-enter-from,
.toast-desk-leave-to {
    opacity: 0;
    transform: translateX(12px);
}
</style>