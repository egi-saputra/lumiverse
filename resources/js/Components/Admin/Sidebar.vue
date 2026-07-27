<script setup>
import { ref, computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { useTenant } from '@/Composables/useTenant'
import { route } from 'ziggy-js';
import {
    HomeIcon,
    UsersIcon,
    BuildingLibraryIcon,
    ChevronDownIcon,
    SquaresPlusIcon,
    BuildingOffice2Icon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
    tenant: Object,
});

const page = usePage();

const { tenant, isSmk } = useTenant()

// Label section — tidak ada lagi kondisional product_type, tenant selalu sekolah
const labels = {
    section: 'School Administration',
    teacher: 'Teacher Directory',
    student: 'Student Directory',
    subject: 'Subject Directory',
    classroom: 'Classroom Directory',
};

// MENU UTAMA
const menuItems = computed(() => [
    { name: 'Admin Dashboard', routeName: 'admin.dashboard', icon: HomeIcon },
    // { name: 'School Management', routeName: 'admin.profil_sekolah.index', icon: BuildingOffice2Icon },
    { name: 'User Management', routeName: 'admin.users.index', icon: UsersIcon },

    // School Management
    {
        name: labels.section,
        icon: BuildingLibraryIcon,
        children: [
            {
                name: labels.teacher,
                routeName: 'admin.guru.index',
            },
            {
                name: labels.student,
                routeName: 'admin.siswa.index'
            },
            {
                name: labels.subject,
                routeName: 'admin.mapel.index',
            },
            // Kejuruan hanya muncul kalau tenant berjenjang SMK
            ...(isSmk.value ? [{
                name: 'Vocational Directory',
                routeName: 'admin.kejuruan.index'
            }] : []),
            {
                name: labels.classroom,
                routeName: 'admin.kelas.index',
            },
        ]
    },

    // Additional Features
    {
        name: 'Additional Features',
        icon: SquaresPlusIcon,
        children: [
            {
                name: 'Announcements',
                routeName: 'pengumuman.index',
            },
        ]
    },
]);

// ACTIVE STATE + HREF AUTO-GENERATE
const menuItemsWithActive = computed(() => {
    return menuItems.value.map(item => {
        const href = item.routeName ? route(item.routeName) : null;
        const isActive = item.routeName ? route().current(item.routeName) : false;

        return { ...item, href, isActive };
    });
});

// AUTO OPEN DROPDOWN JIKA ADA CHILD AKTIF
const initialDropdownState = computed(() => {
    const state = {};
    menuItems.value.forEach(item => {
        if (item.children) {
            const hasActiveChild = item.children.some(child =>
                route().current(child.routeName)
            );
            state[item.name] = hasActiveChild;
        }
    });
    return state;
});

// STATE DROPDOWN
const dropdownOpen = ref({ ...initialDropdownState.value });

// TOGGLE
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