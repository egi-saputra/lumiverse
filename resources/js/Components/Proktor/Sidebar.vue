<script setup>
import { ref, computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import {
    HomeIcon,
    ClipboardDocumentCheckIcon,
    AcademicCapIcon,
    AdjustmentsHorizontalIcon,
    ChevronDownIcon,
    CheckBadgeIcon,
    UsersIcon,
} from '@heroicons/vue/24/outline'

// ── Menu definition ───────────────────────────────────────────
const RAW_MENU = [
    {
        name: 'Proktor Dashboard',
        routeName: 'proktor.dashboard',
        icon: HomeIcon
    },
    {
        name: 'Student List',
        routeName: 'proktor.peserta.index',
        icon: UsersIcon
    },
    {
        name: 'Question Bank',
        routeName: 'proktor.soal.index',
        icon: ClipboardDocumentCheckIcon
    },
    {
        name: 'Exam Rooms',
        routeName: 'proktor.ruangUjian.index',
        icon: AcademicCapIcon
    },
    {
        name: 'Assessments',
        routeName: 'proktor.nilai.index',
        icon: CheckBadgeIcon
    },
    {
        name: 'Other Features',
        icon: AdjustmentsHorizontalIcon,
        children: [
            {
                name: 'Inbox / Messages',
                routeName: 'pesan.index'
            },
            {
                name: 'Announcements',
                routeName: 'pengumuman.index'
            },
        ],
    },
]

// ── Active state ──────────────────────────────────────────────
const isActive = (routeName) => {
    try { return route().current(routeName) } catch { return false }
}

const menuItems = computed(() =>
    RAW_MENU.map(item => ({
        ...item,
        href: item.routeName ? route(item.routeName) : null,
        isActive: item.routeName ? isActive(item.routeName) : false,
        hasActiveChild: item.children?.some(c => isActive(c.routeName)) ?? false,
    }))
)

// ── Dropdown state ────────────────────────────────────────────
const dropdownOpen = ref(
    Object.fromEntries(
        RAW_MENU
            .filter(i => i.children)
            .map(i => [
                i.name,
                i.children.some(c => isActive(c.routeName)),
            ])
    )
)

const toggleDropdown = (name) => {
    dropdownOpen.value[name] = !dropdownOpen.value[name]
}

// ── Dropdown transition ───────────────────────────────────────
const onEnter = (el) => {
    el.style.maxHeight = '0'
    el.style.opacity = '0'
    requestAnimationFrame(() => {
        el.style.transition = 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease'
        el.style.maxHeight = el.scrollHeight + 'px'
        el.style.opacity = '1'
    })
}
const onLeave = (el) => {
    el.style.maxHeight = el.scrollHeight + 'px'
    el.style.opacity = '1'
    requestAnimationFrame(() => {
        el.style.transition = 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease'
        el.style.maxHeight = '0'
        el.style.opacity = '0'
    })
}
</script>

<template>
    <nav class="flex flex-col h-full w-auto select-none">

        <!-- Brand -->
        <div class="px-4 pb-4 border-b border-gray-100 dark:border-white/5">
            <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600
                            flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                </div>
                <span class="text-sm font-bold text-gray-800 dark:text-white tracking-tight leading-none">
                    Smart Learning System
                </span>
            </div>
        </div>

        <!-- Nav items -->
        <div class="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
            <template v-for="item in menuItems" :key="item.name">

                <!-- Single item -->
                <Link v-if="!item.children" :href="item.href"
                    class="group relative flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                    :class="item.isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'">

                    <span v-if="item.isActive"
                        class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full" />

                    <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150"
                        :class="item.isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'" />

                    <span class="flex-1 truncate">{{ item.name }}</span>
                </Link>

                <!-- Dropdown item -->
                <div v-else class="space-y-0.5">
                    <button @click="toggleDropdown(item.name)"
                        class="group flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                        :class="item.hasActiveChild
                            ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'">

                        <component :is="item.icon"
                            class="w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150"
                            :class="item.hasActiveChild
                                ? 'text-gray-700 dark:text-gray-200'
                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'" />

                        <span class="flex-1 text-left truncate">{{ item.name }}</span>

                        <ChevronDownIcon
                            class="w-3.5 h-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-300"
                            :class="dropdownOpen[item.name] ? 'rotate-180' : ''" />
                    </button>

                    <transition @enter="onEnter" @leave="onLeave">
                        <div v-show="dropdownOpen[item.name]" class="overflow-hidden">
                            <div class="ml-3 pl-4 border-l border-gray-200 dark:border-white/10 space-y-0.5 py-1">
                                <Link v-for="child in item.children" :key="child.routeName"
                                    :href="route(child.routeName)"
                                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                                    :class="isActive(child.routeName)
                                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white font-medium'">

                                    <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors" :class="isActive(child.routeName)
                                        ? 'bg-blue-500 dark:bg-blue-400'
                                        : 'bg-gray-300 dark:bg-gray-600'" />

                                    {{ child.name }}
                                </Link>
                            </div>
                        </div>
                    </transition>
                </div>

            </template>
        </div>

    </nav>
</template>