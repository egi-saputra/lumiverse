<script setup>
import { useForm, Head, router, usePage } from '@inertiajs/vue3'
import {
    ArrowLeftOnRectangleIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckBadgeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
} from '@heroicons/vue/24/solid'
import {
    AcademicCapIcon,
    IdentificationIcon,
    UserIcon,
    PhoneIcon,
    MapPinIcon,
} from '@heroicons/vue/24/outline'
import { ref, onMounted, computed } from 'vue'

/* ─── Props & Page ──────────────────────────────────────── */
const page = usePage()
const props = defineProps({ kelas: Array, kejuruan: Array, isSmk: Boolean })

/* ─── Toast ─────────────────────────────────────────────── */
const toast = ref({ show: false, type: 'success', message: '' })
let toastTimer = null

const showToast = (type, message) => {
    clearTimeout(toastTimer)
    toast.value = { show: true, type, message }
    toastTimer = setTimeout(() => { toast.value.show = false }, 5000)
}

const dismissToast = () => {
    clearTimeout(toastTimer)
    toast.value.show = false
}

const toastStyle = computed(() => ({
    success: { bg: 'bg-emerald-600', icon: CheckBadgeIcon },
    error: { bg: 'bg-red-600', icon: ExclamationTriangleIcon },
    info: { bg: 'bg-blue-600', icon: CheckCircleIcon },
}[toast.value.type] ?? { bg: 'bg-gray-700', icon: CheckCircleIcon }))

onMounted(() => {
    if (page.props.flash?.success) showToast('success', page.props.flash.success)
    if (page.props.flash?.error) showToast('error', page.props.flash.error)
    if (page.props.flash?.info) showToast('info', page.props.flash.info)
})

/* ─── Form ───────────────────────────────────────────────── */
const form = useForm({
    // Identitas
    nama_lengkap: '',
    nis: '',
    nisn: '',
    kelas_id: '',
    kejuruan_id: '',
    // Pribadi
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    agama: '',
    no_hp: '',
    no_hp_ortu: '',
    // Alamat
    alamat: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    kode_pos: '',
})

/* ─── Label field untuk pesan error yang jelas ──────────── */
const fieldLabels = {
    nama_lengkap: 'Nama Lengkap',
    nis: 'NIS',
    nisn: 'NISN',
    kelas_id: 'Unit Kelas',
    kejuruan_id: 'Program Kejuruan',
    tempat_lahir: 'Tempat Lahir',
    tanggal_lahir: 'Tanggal Lahir',
    jenis_kelamin: 'Jenis Kelamin',
    agama: 'Agama',
    no_hp: 'No. HP Siswa',
    no_hp_ortu: 'No. HP Orang Tua',
    alamat: 'Alamat',
    kelurahan: 'Kelurahan',
    kecamatan: 'Kecamatan',
    kota: 'Kota',
    kode_pos: 'Kode Pos',
}

/* ─── Capitalize helper ──────────────────────────────────── */
const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )

const handleTitleCase = (field, event) => {
    const pos = event.target.selectionStart
    const value = toTitleCase(event.target.value)
    form[field] = value
    event.target.value = value
    event.target.setSelectionRange(pos, pos)
}

/* ─── Wizard step state ──────────────────────────────────── */
const steps = ['Identitas Siswa', 'Data Pribadi', 'Alamat Tinggal']
const currentStep = ref(0)
const isLastStep = computed(() => currentStep.value === steps.length - 1)
const isFirstStep = computed(() => currentStep.value === 0)

// Field yang dipakai di masing-masing step, untuk validasi bertahap
const stepFields = computed(() => [
    props.isSmk
        ? ['nama_lengkap', 'nis', 'nisn', 'kelas_id', 'kejuruan_id']
        : ['nama_lengkap', 'nis', 'nisn', 'kelas_id'],
    ['tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'no_hp', 'no_hp_ortu'],
    ['alamat', 'kelurahan', 'kecamatan', 'kota', 'kode_pos'],
])

/* ─── Validasi client-side ───────────────────────────────── */
const localErrors = ref({})

/**
 * Hitung semua kemungkinan error di seluruh form (semua step).
 * Dipakai baik untuk validasi per-step maupun validasi akhir sebelum submit.
 */
const computeErrors = () => {
    const errs = {}
    if (!form.nama_lengkap.trim())
        errs.nama_lengkap = 'Nama lengkap wajib diisi.'
    if (form.nis && form.nis.trim().length < 7)
        errs.nis = 'NIS minimal 7 karakter.'
    if (!form.nisn)
        errs.nisn = 'NISN wajib diisi.'
    else if (!/^\d{10}$/.test(form.nisn))
        errs.nisn = 'NISN harus tepat 10 digit angka.'
    if (!form.kelas_id)
        errs.kelas_id = 'Silakan pilih kelas.'
    if (props.isSmk && !form.kejuruan_id)
        errs.kejuruan_id = 'Silakan pilih program kejuruan.'

    // Step 2: semua wajib kecuali no_hp_ortu
    if (!form.tempat_lahir.trim())
        errs.tempat_lahir = 'Tempat lahir wajib diisi.'
    if (!form.tanggal_lahir)
        errs.tanggal_lahir = 'Tanggal lahir wajib diisi.'
    else if (new Date(form.tanggal_lahir) >= new Date())
        errs.tanggal_lahir = 'Tanggal lahir tidak boleh hari ini atau masa depan.'
    if (!form.jenis_kelamin)
        errs.jenis_kelamin = 'Silakan pilih jenis kelamin.'
    if (!form.agama)
        errs.agama = 'Silakan pilih agama.'
    if (!form.no_hp.trim())
        errs.no_hp = 'No. HP siswa wajib diisi.'
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.no_hp))
        errs.no_hp = 'Format nomor HP tidak valid.'
    if (form.no_hp_ortu && !/^[0-9+\-\s]{8,15}$/.test(form.no_hp_ortu))
        errs.no_hp_ortu = 'Format nomor HP orang tua tidak valid.'

    // Step 3: semua wajib kecuali kode_pos
    if (!form.alamat.trim())
        errs.alamat = 'Alamat lengkap wajib diisi.'
    if (!form.kelurahan.trim())
        errs.kelurahan = 'Kelurahan/Desa wajib diisi.'
    if (!form.kecamatan.trim())
        errs.kecamatan = 'Kecamatan wajib diisi.'
    if (!form.kota.trim())
        errs.kota = 'Kota/Kabupaten wajib diisi.'
    if (form.kode_pos && !/^\d{5}$/.test(form.kode_pos))
        errs.kode_pos = 'Kode pos harus 5 digit angka.'

    return errs
}

/**
 * Validasi hanya field-field milik step tertentu.
 * Dipanggil saat user klik "Selanjutnya".
 */
const validateStep = (step) => {
    const errs = computeErrors()
    const fields = stepFields.value[step]

    // Bersihkan error lama milik step ini, lalu isi ulang kalau masih ada
    const updated = { ...localErrors.value }
    fields.forEach((f) => {
        if (errs[f]) updated[f] = errs[f]
        else delete updated[f]
    })
    localErrors.value = updated

    return fields.every((f) => !errs[f])
}

/**
 * Validasi penuh seluruh form, dipanggil tepat sebelum submit ke server.
 */
const validateClient = () => {
    const errs = computeErrors()
    localErrors.value = errs
    return Object.keys(errs).length === 0
}

const fieldError = (field) => localErrors.value[field] || form.errors[field]

/* ─── Navigasi step ──────────────────────────────────────── */
const scrollToTop = () => {
    document.querySelector('.wizard-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const nextStep = () => {
    if (!validateStep(currentStep.value)) {
        const errs = localErrors.value
        const fieldsWithError = stepFields.value[currentStep.value].filter((f) => errs[f])
        const labels = fieldsWithError.map((f) => fieldLabels[f] ?? f)

        showToast(
            'error',
            labels.length === 1
                ? `${labels[0]} belum sesuai: ${errs[fieldsWithError[0]]}`
                : `Mohon lengkapi/perbaiki: ${labels.join(', ')}.`
        )
        return
    }
    if (!isLastStep.value) {
        currentStep.value++
        scrollToTop()
    }
}

const prevStep = () => {
    if (!isFirstStep.value) {
        currentStep.value--
        scrollToTop()
    }
}

const goToStep = (index) => {
    // Boleh mundur bebas ke step yang sudah dilewati,
    // tapi untuk maju harus lewat validasi step demi step
    if (index <= currentStep.value) {
        currentStep.value = index
        scrollToTop()
    }
}

/* ─── Submit ─────────────────────────────────────────────── */
const submit = () => {
    if (!validateClient()) {
        const errs = localErrors.value
        const brokenStepIndex = stepFields.value.findIndex((fields) =>
            fields.some((f) => errs[f])
        )
        if (brokenStepIndex !== -1) currentStep.value = brokenStepIndex

        const labels = Object.keys(errs).map((f) => fieldLabels[f] ?? f)
        showToast('error', `Mohon lengkapi/perbaiki: ${labels.join(', ')}.`)
        return
    }
    form.post(route('siswa.form.store'), {
        preserveScroll: true,
        onError: (errors) => {
            // Tampilkan pesan asli dari server (sudah dalam Bahasa Indonesia dan spesifik,
            // misalnya "NISN ini sudah terdaftar, hubungi admin jika ada kesalahan.")
            const messages = Object.values(errors)
            showToast(
                'error',
                messages.length
                    ? messages.join(' ')
                    : 'Gagal menyimpan data. Periksa kembali isian kamu.'
            )

            // Pindah ke step yang mengandung field bermasalah dari server
            const errorFields = Object.keys(errors)
            const brokenStepIndex = stepFields.value.findIndex((fields) =>
                fields.some((f) => errorFields.includes(f))
            )
            if (brokenStepIndex !== -1) currentStep.value = brokenStepIndex
        },
    })
}

const logout = () => router.post(route('logout'))

/* ─── Pilihan dropdown ───────────────────────────────────── */
const agamaOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']
</script>

<template>

    <Head title="Form Data Siswa" />

    <!-- Toast -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 md:translate-y-0 md:translate-x-4"
        enter-to-class="opacity-100 translate-y-0 md:translate-x-0" leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="toast.show" :class="[toastStyle.bg,
            'fixed z-50 flex items-center gap-3 px-5 py-3.5 shadow-2xl text-white',
            'bottom-4 left-4 right-4 rounded-xl',
            'md:top-5 md:right-5 md:bottom-auto md:left-auto md:rounded-xl md:w-auto md:max-w-sm']">
            <component :is="toastStyle.icon" class="w-5 h-5 shrink-0" />
            <span class="text-sm font-medium flex-1 leading-snug">{{ toast.message }}</span>
            <button @click="dismissToast" class="ml-1 opacity-70 hover:opacity-100 transition">
                <XMarkIcon class="w-4 h-4" />
            </button>
        </div>
    </Transition>

    <!-- Page -->
    <div class="min-h-screen flex items-center justify-center px-4 py-10 sm:px-6
                bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

        <!-- Decorative blobs -->
        <div class="pointer-events-none fixed inset-0 overflow-hidden -z-10">
            <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl"></div>
            <div class="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-200/40 blur-3xl"></div>
        </div>

        <div class="w-full max-w-2xl">

            <!-- Card -->
            <div
                class="wizard-card bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden scroll-mt-6">

                <div class="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <div class="px-8 pt-8 pb-10 sm:px-10">

                    <!-- Header -->
                    <div class="flex items-start justify-between mb-8">
                        <div>
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                                        bg-blue-50 border border-blue-100 text-blue-600
                                        text-xs font-semibold tracking-wide mb-3">
                                <AcademicCapIcon class="w-3.5 h-3.5" />
                                FORM PENDAFTARAN SISWA
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                Lengkapi Data Diri
                            </h1>
                            <p class="mt-1.5 text-gray-500 text-sm">
                                Isi dengan data yang sesuai ijazah terakhir kamu.
                            </p>
                        </div>
                        <button type="button" @click="logout" class="flex items-center gap-1.5 text-xs font-medium text-gray-400
                                   hover:text-red-500 transition-colors mt-1 shrink-0">
                            <ArrowLeftOnRectangleIcon class="w-4 h-4" />
                            <span class="hidden sm:inline">Keluar</span>
                        </button>
                    </div>

                    <!-- Step pills (klik untuk mundur ke step sebelumnya) -->
                    <div class="flex justify-center items-center gap-2 mb-8">
                        <template v-for="(step, i) in steps" :key="i">
                            <button type="button" @click="goToStep(i)" :disabled="i > currentStep"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                :class="[
                                    i <= currentStep
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        : 'bg-gray-100 text-gray-400',
                                    i < currentStep ? 'cursor-pointer hover:bg-blue-700' : (i > currentStep ? 'cursor-not-allowed' : 'cursor-default')
                                ]">
                                <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                                    :class="i <= currentStep ? 'bg-white/30' : 'bg-gray-200'">{{ i + 1 }}</span>
                                <span class="hidden sm:inline">{{ step }}</span>
                            </button>
                            <div v-if="i < steps.length - 1" class="w-6 h-px shrink-0"
                                :class="i < currentStep ? 'bg-blue-400' : 'bg-gray-200'"></div>
                        </template>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="isLastStep ? submit() : nextStep()" class="space-y-5" novalidate>

                        <!-- ══ STEP 1: Identitas ══ -->
                        <template v-if="currentStep === 0">
                            <div class="flex items-center gap-2 mb-1">
                                <UserIcon class="w-4 h-4 text-blue-500" />
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Identitas Siswa
                                </span>
                            </div>

                            <!-- Nama Lengkap -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Nama Lengkap <span class="text-red-500">*</span>
                                    <span class="text-gray-400 font-normal ml-1 text-xs">(sesuai ijazah)</span>
                                </label>
                                <input :value="form.nama_lengkap" @input="handleTitleCase('nama_lengkap', $event)"
                                    type="text" placeholder="Contoh: Budi Santoso" autocomplete="name" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                           bg-white text-gray-900 placeholder-gray-400
                                           transition focus:outline-none focus:ring-2" :class="fieldError('nama_lengkap')
                                            ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                            : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                <p v-if="fieldError('nama_lengkap')"
                                    class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                                    {{ fieldError('nama_lengkap') }}
                                </p>
                            </div>

                            <!-- NIS + NISN -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        NIS <span class="text-gray-400 font-normal ml-1 text-xs">(opsional)</span>
                                    </label>
                                    <input v-model="form.nis" type="text" placeholder="Min. 7 digit" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2" :class="fieldError('nis')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                    <p v-if="fieldError('nis')"
                                        class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                                        {{ fieldError('nis') }}
                                    </p>
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        NISN <span class="text-red-500">*</span>
                                        <span class="text-gray-400 font-normal ml-1 text-xs">(10 digit)</span>
                                    </label>
                                    <input v-model="form.nisn" type="text" placeholder="0000000000" maxlength="10"
                                        inputmode="numeric" @input="form.nisn = form.nisn.replace(/\D/g, '')" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2 tracking-widest" :class="fieldError('nisn')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                    <div class="flex items-center justify-between mt-1.5">
                                        <p v-if="fieldError('nisn')"
                                            class="text-xs text-red-500 flex items-center gap-1">
                                            <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                                            {{ fieldError('nisn') }}
                                        </p>
                                        <p v-else class="text-xs text-gray-400"></p>
                                        <span class="text-xs tabular-nums shrink-0"
                                            :class="form.nisn.length === 10 ? 'text-emerald-500 font-semibold' : 'text-gray-400'">
                                            {{ form.nisn.length }}/10
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Kelas + Kejuruan -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <!-- Kelas -->
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Unit Kelas <span class="text-red-500">*</span>
                                    </label>
                                    <select v-model="form.kelas_id" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                           bg-white text-gray-900 transition focus:outline-none
                                           focus:ring-2 appearance-none select-custom" :class="fieldError('kelas_id')
                                            ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                            : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'">
                                        <option value="">-- Pilih Kelas --</option>
                                        <option v-for="k in kelas" :key="k.id" :value="k.id">{{ k.kelas }}</option>
                                    </select>
                                    <p v-if="fieldError('kelas_id')"
                                        class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                                        {{ fieldError('kelas_id') }}
                                    </p>
                                </div>

                                <!-- Kejuruan -->
                                <div v-if="isSmk">
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Program Kejuruan <span class="text-red-500">*</span>
                                    </label>
                                    <select v-model="form.kejuruan_id" class="w-full rounded-xl border px-4 py-2.5 text-sm
                   bg-white text-gray-900 transition focus:outline-none
                   focus:ring-2 appearance-none select-custom" :class="fieldError('kejuruan_id')
                    ? 'border-red-400 focus:ring-red-300 bg-red-50'
                    : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'">
                                        <option value="">-- Pilih Program Kejuruan --</option>
                                        <option v-for="j in kejuruan" :key="j.id" :value="j.id">{{ j.kejuruan }}
                                        </option>
                                    </select>
                                    <p v-if="fieldError('kejuruan_id')"
                                        class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                                        {{ fieldError('kejuruan_id') }}
                                    </p>
                                </div>
                            </div>
                        </template>

                        <!-- ══ STEP 2: Data Pribadi ══ -->
                        <template v-if="currentStep === 1">
                            <div class="flex items-center gap-2 mb-1">
                                <IdentificationIcon class="w-4 h-4 text-blue-500" />
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Data Pribadi
                                </span>
                            </div>

                            <!-- Tempat & Tanggal Lahir -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Tempat Lahir <span class="text-red-500">*</span>
                                    </label>
                                    <input :value="form.tempat_lahir" @input="handleTitleCase('tempat_lahir', $event)"
                                        type="text" placeholder="Contoh: Jakarta" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2" :class="fieldError('tempat_lahir')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Tanggal Lahir <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="form.tanggal_lahir" type="date"
                                        :max="new Date().toISOString().split('T')[0]" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2" :class="fieldError('tanggal_lahir')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                    <p v-if="fieldError('tanggal_lahir')"
                                        class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                                        {{ fieldError('tanggal_lahir') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Jenis Kelamin & Agama -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Jenis Kelamin <span class="text-red-500">*</span>
                                    </label>
                                    <select v-model="form.jenis_kelamin" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 transition focus:outline-none
                                               focus:ring-2 appearance-none select-custom" :class="fieldError('jenis_kelamin')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'">
                                        <option value="">-- Pilih --</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Agama <span class="text-red-500">*</span>
                                    </label>
                                    <select v-model="form.agama" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 transition focus:outline-none
                                               focus:ring-2 appearance-none select-custom" :class="fieldError('agama')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'">
                                        <option value="">-- Pilih --</option>
                                        <option v-for="a in agamaOptions" :key="a" :value="a">{{ a }}</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Kontak -->
                            <div class="flex items-center gap-2 pt-3 mb-1">
                                <PhoneIcon class="w-4 h-4 text-blue-500" />
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Kontak Siswa & Wali Murid
                                </span>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        No. HP / WA Siswa <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="form.no_hp" type="tel" placeholder="08xxxxxxxxxx" inputmode="tel"
                                        @input="form.no_hp = form.no_hp.replace(/[^\d+\-\s]/g, '')" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2" :class="fieldError('no_hp')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                    <p v-if="fieldError('no_hp')"
                                        class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                                        {{ fieldError('no_hp') }}
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        No. HP Orang Tua / Wali <span
                                            class="text-gray-400 font-normal ml-1 text-xs">(opsional)</span>
                                    </label>
                                    <input v-model="form.no_hp_ortu" type="tel" placeholder="08xxxxxxxxxx"
                                        inputmode="tel"
                                        @input="form.no_hp_ortu = form.no_hp_ortu.replace(/[^\d+\-\s]/g, '')" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2" :class="fieldError('no_hp_ortu')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                    <p v-if="fieldError('no_hp_ortu')"
                                        class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                                        {{ fieldError('no_hp_ortu') }}
                                    </p>
                                </div>
                            </div>
                        </template>

                        <!-- ══ STEP 3: Alamat ══ -->
                        <template v-if="currentStep === 2">
                            <div class="flex items-center gap-2 mb-1">
                                <MapPinIcon class="w-4 h-4 text-blue-500" />
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Alamat Tempat Tinggal
                                </span>
                            </div>

                            <!-- Alamat lengkap -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Alamat Lengkap <span class="text-red-500">*</span>
                                </label>
                                <textarea v-model="form.alamat" rows="2"
                                    placeholder="Nama jalan, nomor rumah, RT/RW, dll." class="w-full rounded-xl border px-4 py-2.5 text-sm
                                           bg-white text-gray-900 placeholder-gray-400
                                           transition focus:outline-none focus:ring-2 resize-none" :class="fieldError('alamat')
                                            ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                            : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'"></textarea>
                            </div>

                            <!-- Kelurahan & Kecamatan -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Kelurahan / Desa <span class="text-red-500">*</span>
                                    </label>
                                    <input :value="form.kelurahan" @input="handleTitleCase('kelurahan', $event)"
                                        type="text" placeholder="Contoh: Cempaka Putih" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2" :class="fieldError('kelurahan')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Kecamatan <span class="text-red-500">*</span>
                                    </label>
                                    <input :value="form.kecamatan" @input="handleTitleCase('kecamatan', $event)"
                                        type="text" placeholder="Contoh: Tanah Abang" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2" :class="fieldError('kecamatan')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                </div>
                            </div>

                            <!-- Kota & Kode Pos -->
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div class="col-span-2 sm:col-span-2">
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Kota / Kabupaten <span class="text-red-500">*</span>
                                    </label>
                                    <input :value="form.kota" @input="handleTitleCase('kota', $event)" type="text"
                                        placeholder="Contoh: Jakarta Pusat" class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2" :class="fieldError('kota')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Kode Pos <span class="text-gray-400 font-normal ml-1 text-xs">(opsional)</span>
                                    </label>
                                    <input v-model="form.kode_pos" type="text" placeholder="12345" maxlength="5"
                                        inputmode="numeric" @input="form.kode_pos = form.kode_pos.replace(/\D/g, '')"
                                        class="w-full rounded-xl border px-4 py-2.5 text-sm
                                               bg-white text-gray-900 placeholder-gray-400
                                               transition focus:outline-none focus:ring-2 tracking-widest" :class="fieldError('kode_pos')
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : 'border-gray-200 focus:ring-blue-300 focus:border-blue-400'" />
                                    <p v-if="fieldError('kode_pos')"
                                        class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <ExclamationTriangleIcon class="w-3.5 h-3.5 shrink-0" />
                                        {{ fieldError('kode_pos') }}
                                    </p>
                                </div>
                            </div>
                        </template>

                        <p class="mt-1 text-xs text-gray-400">
                            Kolom bertanda <span class="text-red-500 font-semibold">*</span> wajib diisi. Selebihnya
                            opsional, boleh dikosongkan.
                        </p>

                        <!-- ══ NAVIGASI ══ -->
                        <div class="pt-4 flex items-center gap-3">
                            <button v-if="!isFirstStep" type="button" @click="prevStep" class="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold
                                       text-gray-600 bg-gray-100 hover:bg-gray-200
                                       transition-all duration-200 shrink-0">
                                <ArrowLeftIcon class="w-4 h-4" />
                                Kembali
                            </button>

                            <button v-if="!isLastStep" type="submit" class="flex-1 flex items-center justify-center gap-2.5
                                       px-6 py-3 rounded-xl text-sm font-bold text-white
                                       bg-gradient-to-r from-blue-600 to-indigo-600
                                       hover:from-blue-700 hover:to-indigo-700
                                       active:scale-[0.98]
                                       shadow-lg shadow-blue-200
                                       transition-all duration-200">
                                Selanjutnya
                                <ArrowRightIcon class="w-4 h-4" />
                            </button>

                            <button v-else type="submit" :disabled="form.processing" class="flex-1 flex items-center justify-center gap-2.5
                                       px-6 py-3 rounded-xl text-sm font-bold text-white
                                       bg-gradient-to-r from-blue-600 to-indigo-600
                                       hover:from-blue-700 hover:to-indigo-700
                                       active:scale-[0.98]
                                       disabled:opacity-60 disabled:cursor-not-allowed
                                       shadow-lg shadow-blue-200
                                       transition-all duration-200">
                                <svg v-if="form.processing" class="animate-spin w-4 h-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <CheckBadgeIcon v-else class="w-4 h-4" />
                                {{ form.processing ? 'Menyimpan...' : 'Simpan Data' }}
                            </button>
                        </div>

                        <button v-if="isFirstStep" type="button" @click="logout" class="w-full mt-1 flex items-center justify-center gap-2
                                   px-6 py-2.5 rounded-xl text-sm font-medium
                                   text-gray-500 hover:text-red-500
                                   border border-gray-200 hover:border-red-200
                                   transition-colors sm:hidden">
                            <ArrowLeftOnRectangleIcon class="w-4 h-4" />
                            Keluar dari Akun
                        </button>

                    </form>
                </div>
            </div>

            <p class="text-center text-xs text-gray-400 mt-5">
                Data yang kamu isi akan digunakan untuk keperluan administrasi sekolah.
            </p>

        </div>
    </div>
</template>

<style scoped>
.select-custom {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1.2em;
    padding-right: 2.5rem;
}
</style>