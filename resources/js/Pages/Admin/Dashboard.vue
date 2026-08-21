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
import { BookUserIcon, BookCheckIcon, Building2Icon, FileCog2Icon, BookOpenIcon, ClipboardCheckIcon, FileQuestionIcon, CalendarCheckIcon, DownloadIcon, RotateCcwIcon } from 'lucide-vue-next';

const page = usePage();
const userName = page.props.auth.user.name || 'User';
const usersCount = computed(() => page.props.usersCount ?? {})
const insights = computed(() => page.props.insights ?? {})
const materials = computed(() => insights.value.materials ?? { total: 0, items: [] })
const assignments = computed(() => insights.value.assignments ?? { total: 0, unread: 0, items: [] })
const quizzes = computed(() => insights.value.quizzes ?? { total: 0, active: 0, questions: 0, items: [] })
const exams = computed(() => insights.value.exams ?? { sessions: 0, completed: 0, in_progress: 0, items: [] })
const attendance = computed(() => insights.value.attendance ?? { total: 0, hadir: 0, sakit: 0, izin: 0, alpha: 0, items: [] })
const announcements = computed(() => insights.value.announcements ?? { total: 0, items: [] })
const resetModal = ref({ show: false, resource: '', label: '' })
const resetting = ref(false)

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

const formatDate = (value) => value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(value ?? 0)
const exportScores = () => {
    const rows = [['Siswa', 'Ujian', 'Nilai', 'Selesai'], ...exams.value.items.map(item => [item.student, item.exam, item.score, formatDate(item.completed_at)])]
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rekap-nilai-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
}

const openResetModal = (resource, label) => {
    resetModal.value = { show: true, resource, label }
}

const closeResetModal = () => {
    if (!resetting.value) resetModal.value.show = false
}

const resetResource = () => {
    if (resetting.value) return

    resetting.value = true
    router.delete(route('admin.dashboard.reset', resetModal.value.resource), {
        preserveScroll: true,
        onSuccess: () => {
            resetModal.value.show = false
            showToast(`${resetModal.value.label} berhasil direset.`, 'success')
        },
        onFinish: () => { resetting.value = false },
    })
}
</script>

<template>

    <Head title="Dashboard" />

    <UserLayout>
        <!-- MOBILE TOAST (default) -->
        <div v-if="toast.show" class="fixed bottom-5 left-1/2 z-50 flex w-full max-w-3xl -translate-x-1/2 transform
           items-center justify-between rounded-xl bg-slate-900 px-5 py-3 text-white shadow-xl shadow-black/20
           ring-1 ring-white/10 transition-all duration-300 ease-out
           opacity-0 scale-95 md:hidden" :class="toast.show ? 'opacity-100 scale-100' : ''">

            <span class="truncate text-sm">{{ toast.message }}</span>

            <button @click="toast.show = false" class="ml-4 flex-shrink-0 rounded-md p-1 hover:bg-white/10">
                <XMarkIcon class="h-4 w-4 text-white" />
            </button>
        </div>

        <!-- DESKTOP TOAST (pojok kanan atas) -->
        <div v-if="toast.show" class="fixed right-5 top-5 z-50 hidden w-full max-w-sm items-center gap-3 rounded-xl
           px-4 py-3 text-white shadow-xl shadow-black/20 ring-1 ring-white/10
           transition-all duration-300 ease-out opacity-0 scale-95 md:flex" :class="[
            toast.show ? 'opacity-100 scale-100' : '',
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-slate-900'
        ]">

            <span v-if="toast.type === 'success'"
                class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
                <svg class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </span>

            <span class="truncate text-sm">{{ toast.message }}</span>

            <button @click="toast.show = false" class="ml-auto flex-shrink-0 rounded-md p-1 hover:bg-white/10">
                <XMarkIcon class="h-4 w-4 text-white" />
            </button>
        </div>

        <!-- HERO -->
        <div
            class="relative mb-6 overflow-hidden rounded-2xl border border-slate-800/60 bg-[#0A1122] p-5 text-white shadow-xl sm:p-8">
            <!-- signature glow + faint grid, kept subtle and behind content -->
            <div class="pointer-events-none absolute inset-0"
                style="background:radial-gradient(600px 240px at 88% -10%, rgba(242,177,52,0.20), transparent 70%);">
            </div>
            <div class="pointer-events-none absolute inset-0 opacity-[0.07]"
                style="background-image:radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px); background-size:18px 18px;">
            </div>

            <div class="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p
                        class="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
                        <span class="relative flex h-1.5 w-1.5">
                            <span
                                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-60"></span>
                            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-300"></span>
                        </span>
                        Lumiverse intelligence
                    </p>
                    <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Ringkasan sekolah, {{ userName }}</h1>
                    <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">Pantau pengguna, pembelajaran,
                        evaluasi, dan kehadiran dari satu ruang kerja.</p>
                </div>
                <div
                    class="flex shrink-0 items-center gap-2 self-start rounded-full border border-slate-700/60 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400 sm:self-auto">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    <span>Data tenant aktif</span>
                    <span class="text-slate-600">·</span>
                    <span class="font-mono tabular-nums">{{ formatDate(new Date()) }}</span>
                </div>
            </div>
        </div>

        <!-- STAT STRIP -->
        <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div v-for="stat in [
                { label: 'Total user', value: usersCount.total, icon: UserGroupIcon, tint: 'slate' },
                { label: 'Proktor', value: usersCount.proktor, icon: ClipboardCheckIcon, tint: 'amber' },
                { label: 'Guru', value: usersCount.guru, icon: AcademicCapIcon, tint: 'emerald' },
                { label: 'Siswa', value: usersCount.siswa, icon: BookUserIcon, tint: 'blue' },
                { label: 'Materi', value: materials.total, icon: BookOpenIcon, tint: 'cyan' },
                { label: 'Quiz', value: quizzes.total, icon: FileQuestionIcon, tint: 'rose' },
            ]" :key="stat.label" class="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4
                   shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
                   dark:border-slate-700 dark:bg-slate-900">
                <span class="absolute inset-x-0 top-0 h-0.5" :class="{
                    'bg-slate-400': stat.tint === 'slate',
                    'bg-amber-400': stat.tint === 'amber',
                    'bg-emerald-400': stat.tint === 'emerald',
                    'bg-blue-400': stat.tint === 'blue',
                    'bg-cyan-400': stat.tint === 'cyan',
                    'bg-rose-400': stat.tint === 'rose',
                }"></span>

                <span class="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg" :class="{
                    'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400': stat.tint === 'slate',
                    'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400': stat.tint === 'amber',
                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400': stat.tint === 'emerald',
                    'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400': stat.tint === 'blue',
                    'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400': stat.tint === 'cyan',
                    'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400': stat.tint === 'rose',
                }">
                    <component :is="stat.icon" class="h-4 w-4" />
                </span>

                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
                <p class="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{{
                    formatNumber(stat.value) }}</p>
            </div>
        </div>

        <div class="mb-6 grid gap-6 xl:grid-cols-2">
            <section
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span
                            class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                            <BookOpenIcon class="h-4.5 w-4.5" />
                        </span>
                        <div>
                            <h2 class="font-bold text-slate-900 dark:text-white">Materi terbaru</h2>
                            <p class="text-xs text-slate-500">{{ formatNumber(materials.total) }} materi dan
                                pembuatnya</p>
                        </div>
                    </div>
                    <button title="Reset seluruh materi" @click="openResetModal('materials', 'Materi')"
                        class="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10">
                        <RotateCcwIcon class="h-4 w-4" />
                    </button>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                    <div v-for="item in materials.items" :key="item.id"
                        class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{{ item.title
                            }}</p>
                            <p class="truncate text-xs text-slate-500">{{ item.author }} · {{ item.class }} · {{
                                item.subject }}
                            </p>
                        </div>
                        <span class="shrink-0 font-mono text-xs tabular-nums text-slate-400">{{
                            formatDate(item.created_at) }}</span>
                    </div>
                    <p v-if="!materials.items.length" class="py-6 text-center text-sm text-slate-400">Belum ada
                        materi.
                    </p>
                </div>
            </section>
            <section
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span
                            class="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                            <FileQuestionIcon class="h-4.5 w-4.5" />
                        </span>
                        <div>
                            <h2 class="font-bold text-slate-900 dark:text-white">Bank soal & evaluasi</h2>
                            <p class="text-xs text-slate-500">Siapa pembuatnya, status, dan jumlah butir</p>
                        </div>
                    </div>
                    <button title="Reset seluruh bank soal" @click="openResetModal('question-bank', 'Bank soal')"
                        class="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10">
                        <RotateCcwIcon class="h-4 w-4" />
                    </button>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                    <div v-for="item in quizzes.items" :key="item.id"
                        class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{{ item.title
                            }}</p>
                            <p class="truncate text-xs text-slate-500">{{ item.author }} · {{ item.subject }} · Kelas
                                {{ item.class }}</p>
                        </div>
                        <span class="shrink-0 text-right text-xs">
                            <span
                                class="block font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-300">{{
                                    item.questions }} soal</span>
                            <span class="font-medium"
                                :class="item.status === 'Aktif' ? 'text-emerald-600' : 'text-slate-400'">{{
                                    item.status }}</span>
                        </span>
                    </div>
                    <p v-if="!quizzes.items.length" class="py-6 text-center text-sm text-slate-400">Belum ada soal
                        ujian.</p>
                </div>
            </section>
        </div>

        <section
            class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span
                        class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                        <MegaphoneIcon class="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <h2 class="font-bold text-slate-900 dark:text-white">Pengumuman terbaru</h2>
                        <p class="text-xs text-slate-500">{{ formatNumber(announcements.total) }} pengumuman dan
                            pembuatnya</p>
                    </div>
                </div>
                <button title="Reset seluruh pengumuman" @click="openResetModal('announcements', 'Pengumuman')"
                    class="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10">
                    <RotateCcwIcon class="h-4 w-4" />
                </button>
            </div>
            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div v-for="item in announcements.items" :key="item.id"
                    class="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                    <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{{ item.title }}</p>
                    <p class="mt-2 truncate text-xs text-slate-500">{{ item.author }}</p>
                    <p class="mt-1 font-mono text-xs tabular-nums text-slate-400">{{ formatDate(item.created_at) }}</p>
                </div>
                <p v-if="!announcements.items.length" class="col-span-full py-6 text-center text-sm text-slate-400">
                    Belum ada pengumuman.
                </p>
            </div>
        </section>

        <div class="mb-6 grid gap-6 xl:grid-cols-3">
            <section
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 xl:col-span-2">
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span
                            class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <CalendarCheckIcon class="h-4.5 w-4.5" />
                        </span>
                        <div>
                            <h2 class="font-bold text-slate-900 dark:text-white">Ujian & nilai terbaru</h2>
                            <p class="text-xs text-slate-500 font-mono tabular-nums">{{ exams.completed }} selesai ·
                                {{ exams.in_progress }} sedang berjalan</p>
                        </div>
                    </div>
                    <button title="Download rekap nilai" @click="exportScores"
                        class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800">
                        <DownloadIcon class="h-5 w-5" />
                    </button>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                    <div v-for="item in exams.items" :key="item.id"
                        class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{{
                                item.student
                            }}</p>
                            <p class="truncate text-xs text-slate-500">{{ item.exam }} · {{
                                formatDate(item.completed_at) }}</p>
                        </div>
                        <span
                            class="rounded-full bg-emerald-50 px-3 py-1 font-mono text-sm font-bold tabular-nums text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">{{
                                item.score }}</span>
                    </div>
                    <p v-if="!exams.items.length" class="py-6 text-center text-sm text-slate-400">Belum ada ujian
                        selesai.</p>
                </div>
            </section>
            <section
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span
                            class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <CalendarCheckIcon class="h-4.5 w-4.5" />
                        </span>
                        <div>
                            <h2 class="font-bold text-slate-900 dark:text-white">Absensi bulan ini</h2>
                            <p class="text-xs text-slate-500">{{ formatNumber(attendance.total) }} catatan</p>
                        </div>
                    </div>
                    <button title="Reset seluruh absensi" @click="openResetModal('attendance', 'Absensi')"
                        class="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10">
                        <RotateCcwIcon class="h-4 w-4" />
                    </button>
                </div>
                <div class="mb-5 grid grid-cols-4 gap-2 text-center">
                    <div class="rounded-lg bg-emerald-50/60 py-2 dark:bg-emerald-500/5">
                        <b class="block font-mono text-lg tabular-nums text-emerald-600">{{ attendance.hadir }}</b>
                        <span class="text-[11px] text-slate-500">Hadir</span>
                    </div>
                    <div class="rounded-lg bg-amber-50/60 py-2 dark:bg-amber-500/5">
                        <b class="block font-mono text-lg tabular-nums text-amber-600">{{ attendance.sakit }}</b>
                        <span class="text-[11px] text-slate-500">Sakit</span>
                    </div>
                    <div class="rounded-lg bg-blue-50/60 py-2 dark:bg-blue-500/5">
                        <b class="block font-mono text-lg tabular-nums text-blue-600">{{ attendance.izin }}</b>
                        <span class="text-[11px] text-slate-500">Izin</span>
                    </div>
                    <div class="rounded-lg bg-rose-50/60 py-2 dark:bg-rose-500/5">
                        <b class="block font-mono text-lg tabular-nums text-rose-600">{{ attendance.alpha }}</b>
                        <span class="text-[11px] text-slate-500">Alpha</span>
                    </div>
                </div>
                <div class="space-y-2">
                    <div v-for="item in attendance.items.slice(0, 6)" :key="item.id"
                        class="flex items-center justify-between text-sm">
                        <span class="truncate text-slate-700 dark:text-slate-300">{{ item.student }}</span>
                        <span class="ml-3 rounded-full px-2 py-0.5 text-xs font-semibold" :class="item.status === 'hadir'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : item.status === 'alpha'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'">{{
                                    item.status }}</span>
                    </div>
                    <p v-if="!attendance.items.length" class="py-4 text-center text-sm text-slate-400">Belum ada data
                        absensi.
                    </p>
                </div>
            </section>
        </div>

        <section
            class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span
                        class="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400">
                        <ClipboardDocumentListIcon class="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <h2 class="font-bold text-slate-900 dark:text-white">Tugas siswa terbaru</h2>
                        <p class="text-xs text-slate-500">Siswa, guru penerima, dan mata pelajaran</p>
                    </div>
                </div>
                <button title="Reset seluruh tugas siswa" @click="openResetModal('assignments', 'Tugas siswa')"
                    class="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10">
                    <RotateCcwIcon class="h-4 w-4" />
                </button>
            </div>
            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div v-for="item in assignments.items" :key="item.id"
                    class="relative overflow-hidden rounded-xl border border-slate-100 p-3 pl-4 transition hover:border-slate-200 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-700">
                    <span class="absolute inset-y-0 left-0 w-1"
                        :class="item.status === 'Belum dibaca' ? 'bg-amber-400' : 'bg-emerald-400'"></span>
                    <div class="flex items-start justify-between gap-2">
                        <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{{ item.title }}
                        </p>
                    </div>
                    <p class="mt-2 text-xs text-slate-500">{{ item.student }} → {{ item.teacher }}</p>
                    <p class="mt-1 text-xs text-slate-400">{{ item.subject }} · {{ formatDate(item.created_at) }}</p>
                </div>
                <p v-if="!assignments.items.length" class="col-span-full py-6 text-center text-sm text-slate-400">
                    Belum
                    ada
                    tugas.</p>
            </div>
        </section>

        <div v-if="resetModal.show"
            class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
            @click.self="closeResetModal">
            <div
                class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div class="flex items-start gap-4">
                    <span
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                        <RotateCcwIcon class="h-5 w-5" />
                    </span>
                    <div>
                        <h2 class="text-lg font-bold text-slate-900 dark:text-white">Reset {{ resetModal.label }}?</h2>
                        <p class="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Seluruh data {{ resetModal.label.toLowerCase() }} akan dihapus permanen. Tindakan ini tidak
                            dapat dibatalkan.
                        </p>
                    </div>
                    <button title="Tutup" @click="closeResetModal"
                        class="ml-auto rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800">
                        <XMarkIcon class="h-5 w-5" />
                    </button>
                </div>
                <div class="mt-6 flex justify-end gap-3">
                    <button type="button" @click="closeResetModal" :disabled="resetting"
                        class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        Batal
                    </button>
                    <button type="button" @click="resetResource" :disabled="resetting"
                        class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {{ resetting ? 'Mereset...' : 'Reset sekarang' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Buttons -->
        <div class="mx-auto max-w-7xl space-y-6 pb-16">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:hidden">
                <Link v-for="item in menuItems" :key="item.title" :href="item.route" prefetch="hover" preserve-scroll
                    preserve-state
                    class="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white p-4
                    text-center shadow-sm transition active:scale-[0.98]
                    dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0A1122] dark:via-[#0F1E3D] dark:to-[#1B1750]">
                    <span
                        class="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-white/[0.06] dark:text-slate-200">
                        <component :is="item.icon" class="h-6 w-6" />
                    </span>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-100">
                        {{ item.title }}
                    </span>
                </Link>
            </div>
        </div>
    </UserLayout>
</template>