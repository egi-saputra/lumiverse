<script setup>
import { Head, Link, router } from '@inertiajs/vue3'
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import PasswordFields from './Partials/PasswordFields.vue'

const form = reactive({
    institution_type: '',
    institution_type_other: '',
    school_name: '',
    subdomain: '',
    address: '',
    school_level: '',
    npsn: '',
    registration_number: '',
    admin_name: '',
    admin_email: '',
    admin_phone: '',
    admin_password: '',
    admin_password_confirmation: '',
})

const errors = ref({})
const generalError = ref('')
const stepErrors = ref({})
const currentStep = ref(1)
const totalSteps = 3
const stepLabels = ['Jenis Lembaga', 'Data Lembaga', 'Akun Admin']
const subdomainTouchedManually = ref(false)
const centralDomain = window.location.hostname
const passwordFieldsRef = ref(null)

const institutionOptions = [
    { value: 'sekolah', label: 'Sekolah / Madrasah', desc: 'SD, SMP, SMA/SMK/Sederajat', icon: '🏫' },
    { value: 'yayasan', label: 'Yayasan / Lembaga', desc: 'Yayasan pendidikan / Lembaga sosial', icon: '🏛️' },
    { value: 'kursus', label: 'Kursus & Bimbel', desc: 'Lembaga pelatihan / bimbingan belajar', icon: '📚' },
    { value: 'lainnya', label: 'Institusi Lainnya', desc: 'Lembaga pendidikan lainnya', icon: '🎓' },
]

const schoolLevelOptions = [
    { value: 'sd', label: 'SD / MI / Sederajat' },
    { value: 'smp', label: 'SMP / MTS / Sederajat' },
    { value: 'smk', label: 'SMA / SMK / Sederajat' },
]

const isSchool = computed(() => form.institution_type === 'sekolah')
const isLainnya = computed(() => form.institution_type === 'lainnya')

const registrationNumberLabel = computed(() => {
    const map = {
        kursus: 'Nomor Izin Operasional',
        privat: 'NIK / NPWP Penanggung Jawab',
        yayasan: 'Nomor Akta Notaris Yayasan',
        lainnya: 'Nomor Izin / Legalitas Lembaga',
    }
    return map[form.institution_type] || 'Nomor Izin Pendirian / Operasional'
})

// Pemetaan field ke step, supaya wizard bisa auto-lompat ke step yang error
// (dipakai untuk error validasi dari backend, misal school_name.unique)
const fieldStepMap = {
    institution_type: 1, institution_type_other: 1,
    school_name: 2, subdomain: 2, address: 2, school_level: 2, npsn: 2, registration_number: 2,
    admin_name: 3, admin_email: 3, admin_phone: 3, admin_password: 3,
}

function jumpToFirstErrorStep() {
    const errorKeys = Object.keys(errors.value)
    if (errorKeys.length === 0) return
    const steps = errorKeys.map((key) => fieldStepMap[key] || 1)
    currentStep.value = Math.min(...steps)
}

function fieldError(field) {
    return errors.value[field]?.[0] || stepErrors.value[field] || null
}

let debounceTimer = null
watch(() => form.school_name, (newName) => {
    if (subdomainTouchedManually.value) return

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
        if (!newName.trim()) {
            form.subdomain = ''
            return
        }
        try {
            const { data } = await axios.post(route('tenant.suggest-subdomain'), { name: newName })
            form.subdomain = data.subdomain
        } catch (e) {
            // diamkan
        }
    }, 200)
})

function onSubdomainInput() {
    subdomainTouchedManually.value = false
}

function onNpsnInput(e) {
    form.npsn = e.target.value.replace(/\D/g, '').slice(0, 8)
}

function validateStep(step) {
    stepErrors.value = {}

    if (step === 1) {
        if (!form.institution_type) stepErrors.value.institution_type = 'Pilih jenis lembaga terlebih dahulu.'
        if (isLainnya.value && !form.institution_type_other.trim()) {
            stepErrors.value.institution_type_other = 'Nama jenis lembaga wajib diisi.'
        }
    }

    if (step === 2) {
        if (!form.school_name.trim()) stepErrors.value.school_name = 'Nama lembaga wajib diisi.'
        if (!form.subdomain.trim()) stepErrors.value.subdomain = 'Subdomain wajib diisi.'
        if (isSchool.value) {
            if (!form.school_level) stepErrors.value.school_level = 'Pilih jenjang sekolah.'
            if (!form.npsn.trim()) stepErrors.value.npsn = 'NPSN wajib diisi.'
        } else if (form.institution_type) {
            if (!form.registration_number.trim()) stepErrors.value.registration_number = 'Nomor legalitas wajib diisi.'
        }
    }

    return Object.keys(stepErrors.value).length === 0
}

function nextStep() {
    if (validateStep(currentStep.value)) {
        currentStep.value++
        stepErrors.value = {}
    }
}

function prevStep() {
    // Di step paling awal, "Kembali" langsung ke homepage
    if (currentStep.value <= 1) {
        router.visit('/', { preserveScroll: false })
        return
    }
    currentStep.value--
    stepErrors.value = {}
}

/* ─── Progress bar submission ──────────────────────────────────────────── */
const isSubmitting = ref(false)
const isDone = ref(false)
const progress = ref(0)
const stageLabel = ref('')
const dashboardUrl = ref(null)
let progressTimer = null

const stages = [
    { upTo: 25, label: 'Menyimpan data lembaga...' },
    { upTo: 55, label: 'Membuat akun admin...' },
    { upTo: 88, label: 'Provisioning database...' },
    { upTo: 92, label: 'Menyiapkan aplikasi...' },
]

function startProgressSimulation() {
    progress.value = 0
    stageLabel.value = stages[0].label
    clearInterval(progressTimer)
    progressTimer = setInterval(() => {
        // Jangan sampai 100% duluan — tunggu response asli dari server.
        if (progress.value >= 92) return
        progress.value = Math.min(92, progress.value + Math.random() * 4 + 1)
        const stage = stages.find((s) => progress.value <= s.upTo)
        if (stage) stageLabel.value = stage.label
    }, 250)
}

function finishProgress() {
    clearInterval(progressTimer)
    progress.value = 100
    stageLabel.value = 'Aplikasi siap digunakan.'
    isDone.value = true
}

function stopProgressOnError() {
    clearInterval(progressTimer)
    isSubmitting.value = false
    progress.value = 0
}

onBeforeUnmount(() => clearInterval(progressTimer))

async function submit() {
    errors.value = {}
    generalError.value = ''

    const rules = passwordFieldsRef.value?.passwordRules ?? []
    if (rules.some((r) => !r.valid)) {
        stepErrors.value.admin_password = 'Password belum memenuhi semua syarat keamanan.'
        return
    }
    if (!passwordFieldsRef.value?.passwordMatch) {
        stepErrors.value.admin_password_confirmation = 'Konfirmasi password tidak cocok.'
        return
    }

    if (!validateStep(1) || !validateStep(2)) {
        if (!validateStep(1)) currentStep.value = 1
        else currentStep.value = 2
        return
    }

    isSubmitting.value = true
    isDone.value = false
    startProgressSimulation()

    try {
        const { data } = await axios.post(route('tenant.register'), form)
        dashboardUrl.value = data.redirect
        finishProgress()
    } catch (e) {
        stopProgressOnError()
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors || {}
            jumpToFirstErrorStep()
        } else {
            generalError.value = e.response?.data?.message || 'Terjadi kesalahan, silakan coba lagi.'
        }
    }
}

function goToDashboard() {
    if (dashboardUrl.value) {
        router.visit(dashboardUrl.value)
    }
}

/* ─── Dark Mode — dipaksa selalu aktif ──── */
onMounted(() => {
    document.documentElement.classList.add('dark')
    router.prefetch('/')
})
</script>

<template>

    <Head title="Registration" />

    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 max-sm:p-0">
        <div class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[20px] p-10 max-sm:rounded-none max-sm:p-6"
            :class="isSubmitting ? 'max-sm:min-h-screen max-sm:flex max-sm:flex-col max-sm:justify-center' : ''">

            <template v-if="!isSubmitting">
                <h1 class="text-2xl font-extrabold text-white text-center mb-2 max-sm:text-xl max-sm:font-semibold">
                    Saatnya transformasi bersama kami!
                </h1>
                <p
                    class="flex sm:flex-row flex-col justify-center text-center gap-1 text-sm text-slate-400 mb-5 max-sm:mb-8">
                    <span>Daftar gratis sekarang juga!</span>
                    <span>Provisioning otomatis dalam hitungan menit.</span>
                </p>

                <!-- Step indicator -->
                <div class="flex items-start mb-9">
                    <div v-for="n in totalSteps" :key="n" class="flex flex-col items-center relative flex-1">
                        <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all z-10"
                            :class="currentStep === n
                                ? 'border-cyan-400 text-cyan-400 bg-slate-950 shadow-[0_0_0_4px_rgba(34,211,238,0.12)]'
                                : currentStep > n
                                    ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                                    : 'border-slate-700 bg-slate-950 text-slate-400'">
                            <span v-if="currentStep > n">✓</span>
                            <span v-else>{{ n }}</span>
                        </div>
                        <span class="text-[11px] text-slate-400 mt-1.5 text-center max-sm:text-[10px]">{{ stepLabels[n -
                            1] }}</span>
                        <div v-if="n < totalSteps"
                            class="absolute top-[15px] left-[calc(50%+16px)] right-[calc(-50%+16px)] h-0.5 z-0"
                            :class="currentStep > n ? 'bg-cyan-400' : 'bg-slate-700'">
                        </div>
                    </div>
                </div>

                <form @submit.prevent="submit" class="flex flex-col gap-5">
                    <transition name="fade-slide" mode="out-in">

                        <!-- STEP 1: Jenis Lembaga -->
                        <div v-if="currentStep === 1" key="step1">
                            <div>
                                <label class="block text-[13px] font-semibold mb-2 mt-0.5 text-slate-400">
                                    Apa Jenis Institusi / Lembaga Pendidikanmu ?
                                </label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button v-for="opt in institutionOptions" :key="opt.value" type="button"
                                        class="flex flex-col items-start gap-1 p-4 rounded-xl border cursor-pointer text-left transition-all hover:border-cyan-400/40 hover:bg-cyan-400/[0.04]"
                                        :class="form.institution_type === opt.value
                                            ? 'border-cyan-400 bg-cyan-400/[0.08]'
                                            : 'border-slate-800 bg-white/[0.02]'"
                                        @click="form.institution_type = opt.value">
                                        <span class="text-2xl">{{ opt.icon }}</span>
                                        <span class="font-bold text-sm text-white">{{ opt.label }}</span>
                                        <span class="text-xs text-slate-400">{{ opt.desc }}</span>
                                    </button>
                                </div>
                                <div v-if="fieldError('institution_type')" class="mt-1.5 text-xs text-rose-400">
                                    {{ fieldError('institution_type') }}
                                </div>
                            </div>

                            <transition name="fade-slide">
                                <div v-if="isLainnya" class="mt-5">
                                    <label for="institution_type_other"
                                        class="block text-[13px] font-semibold mb-2 mt-2 text-slate-400">
                                        Nama Jenis Lembaga Anda
                                    </label>
                                    <input id="institution_type_other" type="text" v-model="form.institution_type_other"
                                        placeholder="Contoh: Komunitas Belajar, Tutor, Private, PAUD, Pesantren dll"
                                        class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400" />
                                    <div v-if="fieldError('institution_type_other')"
                                        class="mt-1.5 text-xs text-rose-400">
                                        {{ fieldError('institution_type_other') }}
                                    </div>
                                </div>
                            </transition>

                            <div class="pt-4 flex gap-3">
                                <button type="button"
                                    class="shrink-0 px-5 py-2.5 rounded-lg border border-slate-800 bg-white/5 text-slate-400 text-sm font-semibold cursor-pointer transition-all hover:text-white hover:border-white/20"
                                    @click="prevStep">Kembali</button>
                                <button type="button" class="btn-hero flex-1 justify-center"
                                    @click="nextStep">Selanjutnya</button>
                            </div>
                        </div>

                        <!-- STEP 2: Data Lembaga -->
                        <div v-else-if="currentStep === 2" key="step2">
                            <div>
                                <label for="school_name"
                                    class="block text-[13px] font-semibold mb-2 mt-0.5 text-slate-400">
                                    * Nama Lengkap Lembaga
                                </label>
                                <input id="school_name" type="text" v-model="form.school_name"
                                    placeholder="Lumi Boarding School"
                                    class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400" />
                                <div v-if="fieldError('school_name')" class="mt-1.5 text-xs text-rose-400">
                                    {{ fieldError('school_name') }}
                                </div>
                            </div>

                            <div class="mt-5">
                                <label for="subdomain" class="block text-[13px] font-semibold mb-2 mt-2 text-slate-400">
                                    * URL / Link Akses Aplikasi LMS
                                </label>
                                <div
                                    class="flex items-center border border-slate-800 rounded-lg bg-white/[0.03] overflow-hidden focus-within:border-cyan-400">
                                    <input id="subdomain" type="text" v-model="form.subdomain" @input="onSubdomainInput"
                                        placeholder="smkluminous"
                                        class="border-0 bg-transparent flex-1 px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none" />
                                    <span class="px-3.5 text-sm text-slate-400 font-mono whitespace-nowrap">.{{
                                        centralDomain }}</span>
                                </div>
                                <div v-if="fieldError('subdomain')" class="mt-1.5 text-xs text-rose-400">
                                    {{ fieldError('subdomain') }}
                                </div>
                                <p class="mt-1.5 text-xs text-slate-400">Ini akan jadi alamat khusus untuk sekolah /
                                    lembaga Anda.</p>
                            </div>

                            <div class="mt-5">
                                <label for="address" class="block text-[13px] font-semibold mb-2 mt-2 text-slate-400">
                                    Alamat Lengkap <span class="font-normal text-slate-400/70">(opsional)</span>
                                </label>
                                <textarea id="address" v-model="form.address" rows="3"
                                    placeholder="Jl. Pendidikan No. 1, Bogor, Jawa Barat, 17820."
                                    class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400 resize-y"></textarea>
                                <div v-if="fieldError('address')" class="mt-1.5 text-xs text-rose-400">
                                    {{ fieldError('address') }}
                                </div>
                            </div>

                            <div class="border-t border-slate-800 my-3"></div>

                            <transition name="fade-slide" mode="out-in">
                                <div v-if="isSchool" key="sekolah-fields" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label for="school_level"
                                            class="block text-[13px] font-semibold mb-2 text-slate-400">
                                            * Tingkat / Jenjang
                                        </label>
                                        <select id="school_level" v-model="form.school_level"
                                            class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm focus:outline-none focus:border-cyan-400">
                                            <option value="" disabled>Silakan Pilih jenjang</option>
                                            <option v-for="lvl in schoolLevelOptions" :key="lvl.value"
                                                :value="lvl.value" class="bg-slate-800 text-white">
                                                {{ lvl.label }}
                                            </option>
                                        </select>
                                        <div v-if="fieldError('school_level')" class="mt-1.5 text-xs text-rose-400">
                                            {{ fieldError('school_level') }}
                                        </div>
                                    </div>

                                    <div>
                                        <label for="npsn" class="block text-[13px] font-semibold mb-2 text-slate-400">
                                            * NPSN <span class="font-normal text-slate-400/70">(8 digit)</span>
                                        </label>
                                        <input id="npsn" type="text" inputmode="numeric" :value="form.npsn"
                                            @input="onNpsnInput" maxlength="8" placeholder="20123456"
                                            class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400" />
                                        <div v-if="fieldError('npsn')" class="mt-1.5 text-xs text-rose-400">
                                            {{ fieldError('npsn') }}
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="form.institution_type" key="non-sekolah-fields">
                                    <label for="registration_number"
                                        class="block text-[13px] font-semibold mb-2 text-slate-400">
                                        {{ registrationNumberLabel }}
                                    </label>
                                    <input id="registration_number" type="text" v-model="form.registration_number"
                                        placeholder="Masukkan nomor legalitas"
                                        class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400" />
                                    <div v-if="fieldError('registration_number')" class="mt-1.5 text-xs text-rose-400">
                                        {{ fieldError('registration_number') }}
                                    </div>
                                </div>
                            </transition>

                            <div class="pt-4 flex gap-3">
                                <button type="button"
                                    class="shrink-0 px-5 py-2.5 rounded-lg border border-slate-800 bg-white/5 text-slate-400 text-sm font-semibold cursor-pointer transition-all hover:text-white hover:border-white/20"
                                    @click="prevStep">Kembali</button>
                                <button type="button" class="btn-hero flex-1 justify-center"
                                    @click="nextStep">Selanjutnya</button>
                            </div>
                        </div>

                        <!-- STEP 3: Akun Admin -->
                        <div v-else-if="currentStep === 3" key="step3">
                            <p
                                class="text-sm text-slate-400 mb-5 px-4 py-3 bg-cyan-400/[0.06] rounded-[10px] border border-cyan-400/15">
                                Data ini akan digunakan untuk login / masuk ke halaman dashboard
                                dan juga aplikasi LMS lembaga Kamu.
                            </p>

                            <div>
                                <label for="admin_name"
                                    class="block text-[13px] font-semibold mb-2 mt-0.5 text-slate-400">
                                    * Nama Lengkap (Admin / PIC)
                                </label>
                                <input id="admin_name" type="text" v-model="form.admin_name" placeholder="Budi Santoso"
                                    class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400" />
                                <div v-if="fieldError('admin_name')" class="mt-1.5 text-xs text-rose-400">
                                    {{ fieldError('admin_name') }}
                                </div>
                            </div>

                            <div class="mt-5">
                                <label for="admin_email"
                                    class="block text-[13px] font-semibold mb-2 mt-2 text-slate-400">
                                    * Alamat Email
                                </label>
                                <input id="admin_email" type="email" v-model="form.admin_email"
                                    placeholder="budi@sekolah.id"
                                    class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400" />
                                <div v-if="fieldError('admin_email')" class="mt-1.5 text-xs text-rose-400">
                                    {{ fieldError('admin_email') }}
                                </div>
                            </div>

                            <div class="mt-5">
                                <label for="admin_phone"
                                    class="block text-[13px] font-semibold mb-2 mt-2 text-slate-400">
                                    * Nomor WhatsApp
                                </label>
                                <input id="admin_phone" type="text" v-model="form.admin_phone" placeholder="08123456789"
                                    class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400" />
                                <div v-if="fieldError('admin_phone')" class="mt-1.5 text-xs text-rose-400">
                                    {{ fieldError('admin_phone') }}
                                </div>
                            </div>

                            <PasswordFields ref="passwordFieldsRef" v-model:password="form.admin_password"
                                v-model:password-confirmation="form.admin_password_confirmation"
                                :password-error="fieldError('admin_password')"
                                :confirmation-error="fieldError('admin_password_confirmation')" />

                            <div v-if="generalError" class="mt-2 text-xs text-rose-400 text-center">{{ generalError }}
                            </div>

                            <div class="pt-4 flex gap-3">
                                <button type="button"
                                    class="shrink-0 px-5 py-2.5 rounded-lg border border-slate-800 bg-white/5 text-slate-400 text-sm font-semibold cursor-pointer transition-all hover:text-white hover:border-white/20"
                                    @click="prevStep">Kembali</button>
                                <button type="submit" class="btn-hero flex-1 justify-center">Daftar Sekarang</button>
                            </div>
                        </div>
                    </transition>
                </form>

                <p class="mt-7 text-center text-sm text-slate-400">
                    Sudah terdaftar?
                    <Link :href="route('owner.login')" class="text-cyan">Masuk di sini</Link>
                </p>
            </template>

            <template v-else>
                <div
                    class="flex flex-col items-center text-center gap-2 py-8 max-sm:py-0 max-sm:flex-1 max-sm:justify-center max-sm:w-full">
                    <h2 class="text-xl font-extrabold text-white">
                        {{ isDone ? 'Selesai! Pendaftaran berhasil.' : 'Pendaftaran sedang diproses...' }}
                    </h2>
                    <p class="text-sm text-slate-400 min-h-[1.2rem]">{{ stageLabel }}</p>

                    <div class="w-full h-2.5 rounded-full bg-white/5 border border-slate-800 overflow-hidden mt-3">
                        <div class="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 transition-[width] duration-200 ease-linear"
                            :style="{ width: progress + '%' }"></div>
                    </div>
                    <p class="font-mono text-xs text-cyan-400 -mt-1">{{ Math.round(progress) }}%</p>

                    <button v-if="isDone" type="button" class="btn-hero mt-4 w-full justify-center"
                        @click="goToDashboard">
                        Masuk ke Dashboard
                    </button>
                </div>
            </template>

        </div>
    </div>
</template>

<style scoped>
/* Vue <transition> butuh CSS class transisi asli — Tailwind gak bisa gantiin ini */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.25s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(12px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-12px);
}
</style>