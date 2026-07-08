<script setup>
import { ref, computed, onMounted } from 'vue'
import { Link, router, usePage } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import {
    HomeIcon,
    BookOpenIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentListIcon,
    AcademicCapIcon,
    AdjustmentsHorizontalIcon,
    CalendarDaysIcon,
    ChevronDownIcon,
    ChartBarIcon,
    UsersIcon
} from '@heroicons/vue/24/outline'

// ── Props ─────────────────────────────────────────────────────
const props = defineProps({
    isKejuruanGuru: { type: Boolean, default: false },
    isWalas: { type: Boolean, default: false },
})

// ── Shared data dari Inertia (HandleInertiaRequests::share) ──
const page = usePage()

/**
 * Jumlah tugas belum dibaca milik guru yang sedang login.
 * Di-share dari backend via HandleInertiaRequests middleware.
 * Reaktif: otomatis update setiap kali Inertia melakukan navigasi.
 */
const unreadCount = computed(() => page.props.unreadAssignmentCount ?? 0)

// ── Menu definition ──────────────────────────────────────────
const menuItems = computed(() => {
    const items = [
        {
            name: 'Teacher Dashboard',
            routeName: 'guru.dashboard',
            icon: HomeIcon,
        },
        {
            name: 'Presention Analytics',
            routeName: 'public.absensi.analytics',
            icon: ChartBarIcon,
        },
        {
            name: 'Attendance Recap',
            routeName: 'guru.absensi.index',
            icon: ClipboardDocumentCheckIcon,
        },
        {
            name: 'Learning Materials',
            routeName: 'guru.material.index',
            icon: BookOpenIcon,
        },
        {
            name: 'Assignment Rooms',
            routeName: 'guru.assignment.index',
            icon: ClipboardDocumentListIcon,
            badge: unreadCount.value > 0 ? unreadCount.value : null,
        },
        {
            name: 'Daily Test / Exam',
            icon: AcademicCapIcon,
            children: [
                { name: 'Exam Quiz List', routeName: 'guru.soal.index' },
                // { name: 'Daily Quiz', routeName: 'guru.soal.index' },
                { name: 'Assessment', routeName: 'guru.NilaiUjian.index' },
            ],
        },
        {
            name: 'Additional Features',
            icon: AdjustmentsHorizontalIcon,
            children: [
                { name: 'Inbox Messages', routeName: 'pesan.index' },
                { name: 'Announcements', routeName: 'pengumuman.index' },
            ],
        },
    ]

    if (props.isWalas) {
        items.splice(1, 0, {
            name: 'Homeroom Teacher',
            routeName: 'guru.walas.index',
            icon: UsersIcon,
        })
    }

    if (props.isKejuruanGuru) {
        items.splice(props.isWalas ? 4 : 3, 0, {
            name: 'Prakerin Journal',
            routeName: 'guru.journal.index',
            icon: CalendarDaysIcon,
        })
    }

    return items
})

// ── Active state computation ──────────────────────────────────
const resolvedItems = computed(() =>
    menuItems.value.map(item => ({
        ...item,
        href: item.routeName ? route(item.routeName) : null,
        isActive: item.routeName ? route().current(item.routeName) : false,
        hasActiveChild: item.children
            ? item.children.some(c => route().current(c.routeName))
            : false,
    }))
)

// ── Dropdown state ────────────────────────────────────────────
/**
 * Auto-open dropdown if any child is currently active.
 * Persists toggle state per item name.
 */
const dropdownOpen = ref(
    Object.fromEntries(
        menuItems.value
            .filter(i => i.children)
            .map(i => [
                i.name,
                i.children.some(c => {
                    try { return route().current(c.routeName) }
                    catch { return false }
                }),
            ])
    )
)

const toggleDropdown = (name) => {
    dropdownOpen.value[name] = !dropdownOpen.value[name]
}

// ── Transition hooks (smooth slide) ──────────────────────────
const enterDropdown = (el) => {
    el.style.maxHeight = '0px'
    el.style.opacity = '0'
    requestAnimationFrame(() => {
        el.style.transition = 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease'
        el.style.maxHeight = el.scrollHeight + 'px'
        el.style.opacity = '1'
    })
}
const leaveDropdown = (el) => {
    el.style.maxHeight = el.scrollHeight + 'px'
    el.style.opacity = '1'
    requestAnimationFrame(() => {
        el.style.transition = 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease'
        el.style.maxHeight = '0px'
        el.style.opacity = '0'
    })
}
</script>

<template>
    <nav class="flex flex-col h-full w-auto select-none">

        <!-- ── Brand / logo strip ──────────────────────────── -->
        <div class="px-4 pb-4 border-b border-gray-100 dark:border-white/5">
            <div class="flex items-center gap-2.5">
                <div
                    class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
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

        <!-- ── Navigation items ────────────────────────────── -->
        <div class="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">

            <template v-for="item in resolvedItems" :key="item.name">

                <!-- ── Single item (no children) ───────────── -->
                <Link v-if="!item.children" :href="item.href"
                    class="group relative flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                    :class="item.isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'">

                    <!-- Active indicator bar -->
                    <span v-if="item.isActive"
                        class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full" />

                    <!-- Icon -->
                    <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150"
                        :class="item.isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'" />

                    <!-- Label -->
                    <span class="flex-1 truncate">{{ item.name }}</span>

                    <!-- Unread badge -->
                    <span v-if="item.badge"
                        class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold leading-none text-white bg-blue-600 dark:bg-blue-500 shadow-sm"
                        :class="item.isActive ? '' : 'bg-blue-600'"
                        :title="`${item.badge} unread assignment${item.badge > 1 ? 's' : ''}`">
                        {{ item.badge > 99 ? '99+' : item.badge }}
                    </span>
                </Link>

                <!-- ── Dropdown item (has children) ─────────── -->
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
                            :class="dropdownOpen[item.name] ? 'rotate-180' : 'rotate-0'" />
                    </button>

                    <!-- Dropdown children -->
                    <transition @enter="enterDropdown" @leave="leaveDropdown">
                        <div v-show="dropdownOpen[item.name]" class="overflow-hidden">
                            <div class="ml-3 pl-4 border-l border-gray-200 dark:border-white/10 space-y-0.5 py-1">
                                <Link v-for="child in item.children" :key="child.routeName"
                                    :href="route(child.routeName)"
                                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                                    :class="route().current(child.routeName)
                                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white font-medium'">

                                    <!-- Child active dot -->
                                    <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors" :class="route().current(child.routeName)
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

        <!-- ── Footer strip ────────────────────────────────── -->
        <!-- <div class="px-4 py-3 border-t border-gray-100 dark:border-white/5">
            <p class="text-[10px] text-gray-400 dark:text-gray-600 tracking-wide uppercase font-medium">
                powered by kreaticraft
            </p>
        </div> -->

    </nav>
</template>