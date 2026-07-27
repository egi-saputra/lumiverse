<script setup>
import UserLayout from '@/Layouts/UserLayout.vue';
import { ref, computed } from 'vue'
import { Head, usePage, router, Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { useTenant } from '@/Composables/useTenant'
import {
    UserGroupIcon,
    ClipboardDocumentListIcon,
    AcademicCapIcon,
    CheckBadgeIcon,
    XMarkIcon,
    MegaphoneIcon
} from '@heroicons/vue/24/outline'
import { UserIcon } from '@heroicons/vue/24/solid'
import { BookUserIcon, BookCheckIcon, Building2Icon, FileCog2Icon } from 'lucide-vue-next';

const page = usePage();
const userName = page.props.auth.user.name || 'User';

const { isSmk } = useTenant()

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

const menuItems = computed(() => [
    { title: 'Users Directory', icon: UserGroupIcon, route: route('admin.users.index') },
    { title: 'Teacher List', icon: AcademicCapIcon, route: route('admin.guru.index') },
    { title: 'Student List', icon: BookUserIcon, route: route('admin.siswa.index') },
    { title: 'Class Room', icon: Building2Icon, route: route('admin.kelas.index') },
    { title: 'Subjects', icon: BookCheckIcon, route: route('admin.mapel.index') },
    // Vocational hanya muncul kalau tenant berjenjang SMK, sama seperti di sidebar
    ...(isSmk.value ? [{ title: 'Vocational', icon: FileCog2Icon, route: route('admin.kejuruan.index') }] : []),
    { title: 'Announcement', icon: MegaphoneIcon, route: route('pengumuman.create') },
])

const goTo = (url) => {
    router.visit(url, {
        preserveScroll: true,
        preserveState: true,
    });
};
</script>

<template>

    <Head title="Dashboard" />

    <UserLayout>
        <!-- MOBILE TOAST (default) -->
        <div v-if="toast.show" class="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-3xl 
           bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg 
           flex items-center justify-between z-50 
           transition-all duration-300 ease-out opacity-0 scale-95 md:hidden"
            :class="toast.show ? 'opacity-100 scale-100' : ''">

            <span class="truncate">{{ toast.message }}</span>

            <button @click="toast.show = false" class="ml-4 flex-shrink-0">
                <XMarkIcon class="w-5 h-5 text-white" />
            </button>
        </div>

        <!-- DESKTOP TOAST (pojok kanan atas) -->
        <div v-if="toast.show" class="hidden md:flex fixed top-5 right-5 w-full max-w-sm 
           px-5 py-3 rounded-lg shadow-lg z-50
           transition-all duration-300 ease-out opacity-0 scale-95
           items-center gap-3 text-white" :class="[
            toast.show ? 'opacity-100 scale-100' : '',
            toast.type === 'success' ? 'bg-green-600' : 'bg-gray-800'
        ]">

            <!-- Icon success -->
            <template v-if="toast.type === 'success'">
                <svg class="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </template>

            <span class="truncate">{{ toast.message }}</span>

            <button @click="toast.show = false" class="ml-auto flex-shrink-0">
                <XMarkIcon class="w-5 h-5 text-white" />
            </button>

            <!-- PROGRESS BAR -->
            <!-- <div class="absolute bottom-0 left-0 h-0.5 bg-white" :style="{ width: progress + '%' }"></div> -->
        </div>

        <!-- Welcome Section -->
        <div
            class="bg-gradient-to-r mb-6 from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:shadow-lg dark:bg-gradient-to-br dark:sm:from-[#1e1b4b] dark:sm:via-[#312e81] dark:sm:to-[#4c1d95] dark:from-[#063970] dark:via-[#0a4e8c] dark:to-[#1e1b4b] border dark:border-[#1e1b4b] transition-all duration-300 sm:p-6 p-4 flex flex-col sm:flex-row items-center sm:text-left text-center gap-4">
            <UserIcon class="w-12 h-12 text-white" />
            <div>
                <h1 class="sm:text-3xl text-xl font-bold">Welcome, {{ userName }}! 👋</h1>
                <p class="text-white/90 sm:text-base text-xs">May your day remain productive and enjoyable!</p>
            </div>
        </div>

        <!-- Cards Section -->
        <div class="sm:grid hidden mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <!-- Proktor -->
            <div
                class="bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-lg transition">
                <UserGroupIcon class="w-10 h-10 dark:text-orange-500 text-purple-500" />
                <div>
                    <p class="text-gray-500 dark:text-white">Proktor</p>
                    <h3 class="text-xl font-bold dark:text-white">{{ page.props.usersCount.proktor }}</h3>
                </div>
            </div>

            <!-- Guru -->
            <div
                class="bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-lg transition">
                <AcademicCapIcon class="w-10 h-10 text-green-500" />
                <div>
                    <p class="text-gray-500 dark:text-white">Guru</p>
                    <h3 class="text-xl font-bold dark:text-white">{{ page.props.usersCount.guru }}</h3>
                </div>
            </div>

            <!-- Siswa -->
            <div
                class="bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-lg transition">
                <ClipboardDocumentListIcon class="w-10 h-10 text-blue-500" />
                <div>
                    <p class="text-gray-500 dark:text-white">Siswa</p>
                    <h3 class="text-xl font-bold dark:text-white">{{ page.props.usersCount.siswa }}</h3>
                </div>
            </div>
        </div>

        <!-- Informasi tambahan / widget -->
        <div
            class="bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] sm:block hidden rounded-lg shadow p-6">
            <h2 class="font-semibold text-lg dark:text-white text-gray-700 mb-4">Aktivitas Terbaru</h2>
            <ul class="space-y-2">
                <li class="flex items-center dark:text-white gap-2">
                    <CheckBadgeIcon class="w-5 h-5 text-green-500" />
                    Peserta baru mendaftar 3 menit yang lalu
                </li>
                <li class="flex items-center dark:text-white gap-2">
                    <ClipboardDocumentListIcon class="w-5 h-5 text-blue-500" />
                    Ujian baru ditambahkan
                </li>
                <li class="flex items-center dark:text-white gap-2">
                    <AcademicCapIcon class="w-5 h-5 text-yellow-500" />
                    Nilai ujian diperbarui
                </li>
            </ul>
        </div>

        <!-- Mobile Menu Buttons -->
        <div class="max-w-7xl pb-16 mx-auto space-y-6">
            <div class="grid md:hidden grid-cols-2 sm:grid-cols-3 gap-4">
                <Link v-for="item in menuItems" :key="item.title" :href="item.route" prefetch="hover" preserve-scroll
                    preserve-state
                    class="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl dark:bg-gradient-to-br dark:from-[#063970] dark:via-[#0a4e8c] dark:to-[#1e1b4b] transition transform w-full">
                    <component :is="item.icon" class="w-10 h-10 dark:text-gray-300 text-blue-500" />
                    <span class="text-sm font-medium dark:text-gray-100 text-gray-700 text-center">
                        {{ item.title }}
                    </span>
                </Link>
            </div>
        </div>
    </UserLayout>
</template>