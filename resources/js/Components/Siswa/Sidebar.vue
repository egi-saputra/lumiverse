<script setup>
import { ref, computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { route } from 'ziggy-js';

import {
    HomeIcon,
    UsersIcon,
    ClipboardDocumentCheckIcon,
    CheckBadgeIcon,
    ChevronDownIcon,
    AcademicCapIcon
} from '@heroicons/vue/24/outline';

const page = usePage();

// ============================
// MENU ITEMS (pakai routeName seperti proktor)
// ============================
const menuItems = [
    { name: 'Student Dashboard', routeName: 'siswa.dashboard', icon: HomeIcon },
    // { name: 'Student Directory', routeName: 'siswa.absensi.index', icon: UsersIcon },
    { name: 'Daily Attendance', routeName: 'siswa.absensi.index', icon: UsersIcon },
    { name: 'Learning Materials', routeName: 'siswa.material.index', icon: ClipboardDocumentCheckIcon },
    { name: 'Assignment Rooms', routeName: 'siswa.assignment.index', icon: CheckBadgeIcon },
    { name: 'Exam Rooms / Test', routeName: 'siswa.ujian.token', icon: AcademicCapIcon },

    // Kalau nanti mau dropdown tinggal aktifkan
    // {
    //     name: 'Rekap Penilaian',
    //     icon: CheckBadgeIcon,
    //     children: [
    //         { name: 'Rekap Nilai Harian', routeName: 'siswa.dashboard' },
    //         { name: 'Rekap Nilai Ujian', routeName: 'siswa.dashboard' },
    //     ]
    // },
];

// ============================
// ACTIVE STATE (mirip proktor)
// ============================
const menuItemsWithActive = computed(() => {
    return menuItems.map(item => {
        const href = item.routeName ? route(item.routeName) : null;

        const isActive = item.routeName
            ? route().current(item.routeName)
            : false;

        return { ...item, href, isActive };
    });
});

// ============================
// AUTO-OPEN DROPDOWN IF CHILD ACTIVE
// ============================
const initialDropdownState = computed(() => {
    const state = {};
    menuItems.forEach(item => {
        if (item.children) {
            const hasActiveChild = item.children.some(child =>
                route().current(child.routeName)
            );
            state[item.name] = hasActiveChild;
        }
    });
    return state;
});

// dropdown state
const dropdownOpen = ref({ ...initialDropdownState.value });

// toggle dropdown
const toggleDropdown = (name) => {
    dropdownOpen.value[name] = !dropdownOpen.value[name];
};

const isDropdownOpen = (name) => dropdownOpen.value[name] ?? false;

// Smooth Sliding Dropdown
const dropdownRefs = ref({});

const enter = (el) => {
    el.style.maxHeight = '0px';
    el.style.opacity = '0';

    requestAnimationFrame(() => {
        el.style.transition = 'max-height 0.35s ease, opacity 0.25s ease';
        el.style.maxHeight = el.scrollHeight + 'px';
        el.style.opacity = '1';
    });
};

const leave = (el) => {
    el.style.maxHeight = el.scrollHeight + 'px';
    el.style.opacity = '1';

    requestAnimationFrame(() => {
        el.style.transition = 'max-height 0.35s ease, opacity 0.25s ease';
        el.style.maxHeight = '0px';
        el.style.opacity = '0';
    });
};
</script>

<template>
    <div class="bg-white w-auto min-h-screen border-gray-200">
        <div class="p-2 space-y-1">

            <div v-for="item in menuItemsWithActive" :key="item.name">

                <!-- MENU TANPA CHILD -->
                <div v-if="!item.children">
                    <Link :href="item.href"
                        class="flex w-full items-center gap-3 px-4 py-2 font-semibold text-gray-600 dark:text-white rounded dark:hover:!bg-[#1e1b4b] hover:bg-gray-100 transition"
                        :class="item.isActive ? 'bg-gray-100 dark:bg-[#1e1b4b] dark:!text-gray-200' : ''">
                        <component :is="item.icon" class="w-5 h-5" />
                        <span class="flex-1">{{ item.name }}</span>
                    </Link>
                </div>

                <!-- MENU DROPDOWN -->
                <div v-else class="relative">
                    <button @click="toggleDropdown(item.name)"
                        class="w-full flex items-center justify-between gap-3 px-4 py-2 font-semibold rounded hover:bg-gray-100 transition dark:hover:bg-[#1e1b4b] dark:text-white text-gray-600">
                        <div class="flex items-center gap-3">
                            <component :is="item.icon" class="w-5 h-5" />
                            <span>{{ item.name }}</span>
                        </div>

                        <ChevronDownIcon
                            :class="['w-4 h-4 transition-transform', isDropdownOpen(item.name) ? 'rotate-180' : 'rotate-0']" />
                    </button>

                    <transition @enter="enter" @leave="leave">
                        <div v-show="isDropdownOpen(item.name)" ref="dropdownRefs"
                            class="pl-12 mt-1 -space-y-1 overflow-hidden">
                            <Link v-for="(child, idx) in item.children" :key="child.name" :href="route(child.routeName)"
                                class="relative block w-full pr-4 pl-2 py-1 dark:text-white text-gray-600">
                                <!-- Titik -->
                                <span
                                    class="absolute left-0 top-4 h-2 w-2 rounded-full bg-gray-500 dark:bg-white"></span>

                                <!-- Container teks dengan padding agar BG mulai di sini -->
                                <span class="relative w-full ml-4 block rounded transition px-2 py-1" :class="route().current(child.routeName)
                                    ? 'text-gray-600 dark:text-gray-100 font-semibold dark:bg-[#1e1b4b] bg-gray-100'
                                    : 'dark:hover:bg-[#1e1b4b] hover:bg-gray-100'">
                                    {{ child.name }}
                                </span>

                                <!-- Garis vertical di samping titik -->
                                <span v-if="idx < item.children.length - 1"
                                    class="absolute left-1 top-5 z-20 dark:border-white -bottom-5 border-l border-gray-500"></span>
                            </Link>
                        </div>
                    </transition>
                </div>

            </div>

        </div>
    </div>
</template>
