<script setup>
import { useForm, Head, router } from '@inertiajs/vue3'
import { AcademicCapIcon, UserGroupIcon, UsersIcon, ArrowLeftOnRectangleIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'

const peranOptions = [
    { value: 'guru', label: 'Guru', icon: AcademicCapIcon, desc: 'Mengajar dan mengelola kelas' },
    { value: 'siswa', label: 'Siswa', icon: UserGroupIcon, desc: 'Belajar dan mengikuti kelas' },
    { value: 'orang_tua', label: 'Orang Tua / Wali', icon: UsersIcon, desc: 'Memantau perkembangan anak' },
]

const selected = ref(null)
const siswaForm = useForm({ peran: 'siswa' })

// Klik kartu HANYA menandai pilihan, tidak ada efek server sama sekali
const pilihKartu = (value) => {
    selected.value = value
}

// Baru saat klik "Lanjutkan" barulah terjadi navigasi/submit
const lanjutkan = () => {
    if (!selected.value) return

    if (selected.value === 'guru') {
        router.visit(route('role.guru.create'))
        return
    }
    if (selected.value === 'orang_tua') {
        router.visit(route('role.orangtua.create'))
        return
    }
    siswaForm.post(route('role.store'), { preserveScroll: true })
}

const isProcessing = computed(() => siswaForm.processing)
const logout = () => router.post(route('logout'))
</script>

<template>

    <Head title="Pilih Peran" />

    <div
        class="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div class="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8">
            <div class="flex items-start justify-between mb-1">
                <h1 class="text-2xl font-bold text-gray-900">Kamu berperan sebagai siapa?</h1>
            </div>
            <p class="text-sm text-gray-500 mb-6">Pilih salah satu, lalu klik Lanjutkan.</p>

            <div class="grid grid-cols-1 gap-3 mb-5">
                <button v-for="opt in peranOptions" :key="opt.value" type="button" @click="pilihKartu(opt.value)"
                    class="flex items-center gap-3 p-4 rounded-xl border text-left transition" :class="selected === opt.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'">
                    <component :is="opt.icon" class="w-6 h-6 text-blue-500 shrink-0" />
                    <div class="flex-1">
                        <p class="text-sm font-semibold text-gray-800">{{ opt.label }}</p>
                        <p class="text-xs text-gray-500">{{ opt.desc }}</p>
                    </div>
                </button>
            </div>

            <button type="button" @click="lanjutkan" :disabled="!selected || isProcessing" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white
                       bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                       disabled:opacity-50 disabled:cursor-not-allowed transition">
                {{ isProcessing ? 'Memproses...' : 'Lanjutkan' }}
                <ArrowRightIcon v-if="!isProcessing" class="w-4 h-4" />
            </button>

            <button type="button" @click="logout" class="w-full mt-3 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium
                       text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200
                       transition-colors">
                <ArrowLeftOnRectangleIcon class="w-4 h-4" />
                Kembali ke halaman login
            </button>
        </div>
    </div>
</template>