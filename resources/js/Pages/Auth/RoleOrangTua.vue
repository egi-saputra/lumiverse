<script setup>
import { useForm, Head, router } from '@inertiajs/vue3'
import {
    UsersIcon,
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    CheckBadgeIcon,
    PencilSquareIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import axios from 'axios'

const step = ref('input') // 'input' | 'preview'
const checking = ref(false)
const checkError = ref('')
const preview = ref(null) // { nama_lengkap, kelas }

const form = useForm({ id_siswa: '' })

const cekKode = async () => {
    if (!form.id_siswa) return

    checking.value = true
    checkError.value = ''

    try {
        const { data } = await axios.get(route('role.orangtua.lookup'), {
            params: { id_siswa: form.id_siswa },
        })
        preview.value = data
        step.value = 'preview'
    } catch (e) {
        checkError.value = e.response?.data?.message ?? 'Terjadi kesalahan, coba lagi.'
    } finally {
        checking.value = false
    }
}

const gantiKode = () => {
    step.value = 'input'
    preview.value = null
    checkError.value = ''
}

const konfirmasi = () => {
    form.post(route('role.orangtua.store'), { preserveScroll: true })
}

const kembali = () => router.visit(route('role.select'))
</script>

<template>

    <Head title="Verifikasi Orang Tua" />

    <div
        class="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div class="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8">
            <button type="button" @click="kembali"
                class="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors mb-6">
                <ArrowLeftIcon class="w-4 h-4" />
                Kembali
            </button>

            <div class="flex items-center gap-3 mb-1">
                <div
                    class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <UsersIcon class="w-5 h-5 text-blue-500" />
                </div>
                <h1 class="text-xl font-bold text-gray-900">Verifikasi sebagai Orang Tua</h1>
            </div>

            <!-- ══ STEP 1: Input ID siswa ══ -->
            <template v-if="step === 'input'">
                <p class="text-sm text-gray-500 mb-6">
                    Masukkan ID siswa milik anak kamu untuk mengaitkan akun.
                </p>

                <form @submit.prevent="cekKode" class="space-y-5">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">ID Siswa (Anak)</label>
                        <input v-model="form.id_siswa" type="text" placeholder="Masukkan ID siswa anak kamu" autofocus
                            class="w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400
                                   transition focus:outline-none focus:ring-2" :class="checkError
                                    ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                    : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                        <p v-if="checkError" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                            {{ checkError }}
                        </p>
                    </div>

                    <button type="submit" :disabled="!form.id_siswa || checking" class="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600
                               hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition">
                        {{ checking ? 'Memeriksa...' : 'Cek ID Siswa' }}
                    </button>
                </form>
            </template>

            <!-- ══ STEP 2: Preview & Konfirmasi ══ -->
            <template v-else>
                <p class="text-sm text-gray-500 mb-6">
                    Pastikan data anak di bawah ini benar sebelum melanjutkan.
                </p>

                <div class="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 mb-5 text-center">
                    <p class="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">Data ditemukan</p>
                    <p class="text-lg font-bold text-gray-900">{{ preview.nama_lengkap }}</p>
                    <p v-if="preview.kelas" class="text-xs text-gray-400 mt-1">Kelas: {{ preview.kelas }}</p>
                    <p class="text-xs text-gray-400 mt-1">ID Siswa: {{ form.id_siswa }}</p>
                </div>

                <p v-if="form.errors.id_siswa" class="mb-4 text-xs text-red-500 flex items-center gap-1">
                    <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                    {{ form.errors.id_siswa }}
                </p>

                <div class="space-y-3">
                    <button type="button" @click="konfirmasi" :disabled="form.processing" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white
                               bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                               disabled:opacity-50 transition">
                        <CheckBadgeIcon class="w-4 h-4" />
                        {{ form.processing ? 'Menyimpan...' : 'Ya, Ini Anak Saya - Lanjutkan' }}
                    </button>

                    <button type="button" @click="gantiKode" :disabled="form.processing" class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
                               text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition">
                        <PencilSquareIcon class="w-4 h-4" />
                        Bukan Anak Saya, Ganti ID
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>