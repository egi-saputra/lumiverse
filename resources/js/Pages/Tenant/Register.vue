<script setup>
import { Head, Link, router, useForm } from '@inertiajs/vue3'
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import ProductSelectModal from '@/Components/Modals/ProductSelectModal.vue'
import PasswordFields from './Partials/PasswordFields.vue'

const props = defineProps({
    productType: {
        type: String,
        default: 'school',
    },
})

const form = useForm({
    product_type: props.productType,
    institution_type: '',
    institution_type_other: '',
    school_name: '',
    subdomain: '',
    logo: null,
    school_level: '',
    npsn: '',
    nss: '',
    registration_number: '',
    registration_number_school: '',
    contact_phone: '',
    institution_email: '',
    institution_website: '',
    address: '',
    admin_name: '',
    admin_email: '',
    admin_phone: '',
    admin_password: '',
    admin_password_confirmation: '',
})

const currentStep = ref(1)
const isWorkspace = computed(() => form.product_type === 'workspace')
const showProductModal = ref(false)

// Workspace: 3 step (Detail Perusahaan, Kontak Perusahaan, Akun Admin)
// Sekolah/Lembaga: 4 step (Lembaga, Profil, Kontak, Admin)
const totalSteps = computed(() => (isWorkspace.value ? 3 : 4))
const stepLabels = computed(() =>
    isWorkspace.value
        ? ['Detail Perusahaan', 'Kontak Perusahaan', 'Admin']
        : ['Lembaga', 'Profil', 'Kontak', 'Admin']
)
const subdomainTouchedManually = ref(false)
const centralDomain = window.location.hostname
const logoPreview = ref(null)
const stepErrors = ref({})
const passwordFieldsRef = ref(null)

// Pemetaan field ke step, supaya wizard bisa auto-lompat ke step yang error
const fieldStepMap = computed(() => {
    if (isWorkspace.value) {
        return {
            school_name: 1, subdomain: 1, logo: 1, registration_number: 1, address: 1,
            contact_phone: 2, institution_email: 2, institution_website: 2,
            admin_name: 3, admin_email: 3, admin_phone: 3, admin_password: 3,
        }
    }
    return {
        institution_type: 1, institution_type_other: 1,
        school_name: 2, subdomain: 2, logo: 2, school_level: 2, npsn: 2, nss: 2, registration_number: 2,
        contact_phone: 3, institution_email: 3, institution_website: 3, address: 3,
        admin_name: 4, admin_email: 4, admin_phone: 4, admin_password: 4,
    }
})

function jumpToFirstErrorStep() {
    const errorKeys = Object.keys(form.errors)
    if (errorKeys.length === 0) return

    const steps = errorKeys.map((key) => fieldStepMap.value[key] || 1)
    currentStep.value = Math.min(...steps)
}

onMounted(jumpToFirstErrorStep)
watch(() => form.errors, jumpToFirstErrorStep)

let debounceTimer = null

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

function onSchoolNameInput(e) {
    const value = e.target.value
    form.school_name = value.replace(/\w\S*/g, (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toUpperCase()
    )
}

function onNpsnInput(e) {
    form.npsn = e.target.value.replace(/\D/g, '').slice(0, 8)
}

function onNssInput(e) {
    form.nss = e.target.value.replace(/\D/g, '').slice(0, 12)
}

function fieldError(field) {
    return form.errors[field] || stepErrors.value[field] || null
}

function onLogoChange(e) {
    const file = e.target.files[0]
    form.logo = file
    if (file) {
        logoPreview.value = URL.createObjectURL(file)
    } else {
        logoPreview.value = null
    }
}

function removeLogo() {
    form.logo = null
    logoPreview.value = null
}

// Ganti jenis produk — navigasi ulang ke halaman register dengan query
// param baru. Controller yang menangkap & set productType default-nya.
function onSwitchProduct(type) {
    showProductModal.value = false
    if (type === form.product_type) return
    router.get(route('tenant.register.form'), { product: type })
}

function validateStep(step) {
    stepErrors.value = {}

    if (isWorkspace.value) {
        if (step === 1) {
            if (!form.school_name.trim()) stepErrors.value.school_name = 'Nama perusahaan wajib diisi.'
            if (!form.subdomain.trim()) stepErrors.value.subdomain = 'Subdomain wajib diisi.'
            if (!form.address.trim()) stepErrors.value.address = 'Alamat wajib diisi.'
        }
        return Object.keys(stepErrors.value).length === 0
    }

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

    if (step === 3) {
        if (!form.address.trim()) stepErrors.value.address = 'Alamat wajib diisi.'
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
        // router.visit('/')
        window.location.href = '/'
        return
    }
    currentStep.value--
    stepErrors.value = {}
}

function submit() {
    const rules = passwordFieldsRef.value?.passwordRules ?? []
    if (rules.some((r) => !r.valid)) {
        stepErrors.value.admin_password = 'Password belum memenuhi semua syarat keamanan.'
        return
    }
    if (!passwordFieldsRef.value?.passwordMatch) {
        stepErrors.value.admin_password_confirmation = 'Konfirmasi password tidak cocok.'
        return
    }

    if (isWorkspace.value) {
        if (!validateStep(1)) {
            currentStep.value = 1
            return
        }
    } else if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
        if (!validateStep(1)) currentStep.value = 1
        else if (!validateStep(2)) currentStep.value = 2
        else currentStep.value = 3
        return
    }

    form.post(route('tenant.register'), {
        forceFormData: true,
        onFinish: () => form.reset('admin_password', 'admin_password_confirmation'),
    })
}

/* ─── Dark Mode — dipaksa selalu aktif ──── */
onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>

    <Head title="Registration" />

    <div class="register-page flex-col">
        <div class="register-card">
            <h1 class="register-title text-center">Saatnya transformasi bersama kami!</h1>
            <p class="register-sub flex sm:flex-row flex-col justify-center text-center gap-1"><span>Daftar gratis
                    sekarang
                    juga!
                </span><span>Provisioning
                    otomatis
                    dalam hitungan menit.</span></p>

            <!-- <div class="switch-product-row">
                <button type="button" class="switch-product-link" @click="showProductModal = true">
                    Mendaftar sebagai {{ isWorkspace ? 'Perusahaan / Workspace' : 'Sekolah / Lembaga Pendidikan' }} ·
                    <span class="text-cyan">Ganti</span>
                </button>
            </div> -->

            <!-- Step indicator -->
            <div class="steps-bar">
                <div v-for="n in totalSteps" :key="n" class="step-item">
                    <div class="step-circle" :class="{
                        'step-active': currentStep === n,
                        'step-done': currentStep > n,
                    }">
                        <span v-if="currentStep > n">✓</span>
                        <span v-else>{{ n }}</span>
                    </div>
                    <span class="step-label">
                        {{ stepLabels[n - 1] }}
                    </span>
                    <div v-if="n < totalSteps" class="step-line" :class="{ 'step-line-done': currentStep > n }">
                    </div>
                </div>
            </div>

            <form @submit.prevent="submit" class="register-form">

                <transition name="fade-slide" mode="out-in">
                    <!-- WORKSPACE STEP 1: Detail Perusahaan -->
                    <div v-if="currentStep === 1 && isWorkspace" key="ws-step1">
                        <div class="field">
                            <label for="ws_school_name">* Nama Perusahaan</label>
                            <input id="ws_school_name" type="text" :value="form.school_name" @input="onSchoolNameInput"
                                placeholder="PT Lumi Platforms Indonesia" />
                            <div v-if="fieldError('school_name')" class="field-error">{{ fieldError('school_name')
                                }}
                            </div>
                        </div>

                        <div class="field">
                            <label for="ws_subdomain">* URL / Link Akses Aplikasi</label>
                            <div class="subdomain-input">
                                <input id="ws_subdomain" type="text" v-model="form.subdomain" @input="onSubdomainInput"
                                    placeholder="lumiplatforms" />
                                <span class="subdomain-suffix">.{{ centralDomain }}</span>
                            </div>
                            <div v-if="fieldError('subdomain')" class="field-error">{{ fieldError('subdomain') }}
                            </div>
                            <p class="field-hint">Ini akan jadi alamat khusus workspace perusahaan Anda.</p>
                        </div>

                        <div class="field">
                            <label>Logo Perusahaan <span class="optional-tag">(opsional, maks 15MB)</span></label>
                            <div v-if="!logoPreview" class="logo-upload">
                                <input type="file" accept="image/*" @change="onLogoChange" id="ws_logo"
                                    class="logo-input" />
                                <label for="ws_logo" class="logo-upload-label">
                                    <span class="logo-upload-icon">📷</span>
                                    <span>Klik untuk upload logo</span>
                                    <span class="field-hint">PNG/JPG/WebP, maks 15MB</span>
                                </label>
                            </div>
                            <div v-else class="logo-preview">
                                <img :src="logoPreview" alt="Preview logo" />
                                <button type="button" class="logo-remove" @click="removeLogo">✕</button>
                            </div>
                            <div v-if="fieldError('logo')" class="field-error">{{ fieldError('logo') }}</div>
                        </div>

                        <div class="field-divider"></div>

                        <div class="field">
                            <label for="ws_registration_number">Nomor Legalitas Perusahaan <span
                                    class="optional-tag">(opsional, NIB/NPWP/Akta)</span></label>
                            <input id="ws_registration_number" type="text" v-model="form.registration_number"
                                placeholder="Masukkan nomor legalitas perusahaan" />
                            <div v-if="fieldError('registration_number')" class="field-error">{{
                                fieldError('registration_number') }}</div>
                        </div>

                        <div class="field">
                            <label for="ws_address">* Alamat Lengkap Perusahaan</label>
                            <textarea id="ws_address" v-model="form.address" rows="3"
                                placeholder="Jl. Sudirman No. 1, Jakarta Selatan, 12190."></textarea>
                            <div v-if="fieldError('address')" class="field-error">{{ fieldError('address') }}</div>
                        </div>

                        <div class="step-actions">
                            <button type="button" class="btn-ghost-step" @click="prevStep">Kembali</button>
                            <button type="button" class="btn-hero step-next" @click="nextStep">Selanjutnya</button>
                        </div>
                    </div>

                    <!-- WORKSPACE STEP 2: Kontak Perusahaan -->
                    <div v-else-if="currentStep === 2 && isWorkspace" key="ws-step2">
                        <p class="step-intro">Informasi kontak ini akan ditampilkan sebagai kontak resmi
                            perusahaan Anda di platform. Semua field pada step ini bersifat opsional.</p>

                        <div class="field">
                            <label for="ws_contact_phone">Nomor Telepon <span
                                    class="optional-tag">(opsional)</span></label>
                            <input id="ws_contact_phone" type="text" v-model="form.contact_phone"
                                placeholder="Masukkan No.Telp Perusahaan" />
                            <div v-if="fieldError('contact_phone')" class="field-error">{{
                                fieldError('contact_phone') }}</div>
                        </div>

                        <div class="field">
                            <label for="ws_institution_email">Alamat Email <span
                                    class="optional-tag">(opsional)</span></label>
                            <input id="ws_institution_email" type="email" v-model="form.institution_email"
                                placeholder="info@perusahaan.co.id" />
                            <div v-if="fieldError('institution_email')" class="field-error">{{
                                fieldError('institution_email') }}</div>
                        </div>

                        <div class="field">
                            <label for="ws_institution_website">Website Utama <span
                                    class="optional-tag">(opsional)</span></label>
                            <input id="ws_institution_website" type="text" v-model="form.institution_website"
                                placeholder="https://perusahaan.co.id" />
                            <div v-if="fieldError('institution_website')" class="field-error">{{
                                fieldError('institution_website') }}</div>
                        </div>

                        <div class="step-actions">
                            <button type="button" class="btn-ghost-step" @click="prevStep">Kembali</button>
                            <button type="button" class="btn-hero step-next" @click="nextStep">Selanjutnya</button>
                        </div>
                    </div>

                    <!-- WORKSPACE STEP 3: Akun Admin -->
                    <div v-else-if="currentStep === 3 && isWorkspace" key="ws-step3">
                        <p class="step-intro">Data ini akan digunakan untuk login / masuk ke halaman dashboard
                            Lumiverse Workspace perusahaan Kamu.</p>

                        <div class="field">
                            <label for="ws_admin_name">* Nama Lengkap (Admin / PIC)</label>
                            <input id="ws_admin_name" type="text" v-model="form.admin_name"
                                placeholder="Budi Santoso" />
                            <div v-if="fieldError('admin_name')" class="field-error">{{ fieldError('admin_name') }}
                            </div>
                        </div>

                        <div class="field">
                            <label for="ws_admin_email">* Alamat Email</label>
                            <input id="ws_admin_email" type="email" v-model="form.admin_email"
                                placeholder="budi@perusahaan.co.id" />
                            <div v-if="fieldError('admin_email')" class="field-error">{{ fieldError('admin_email')
                                }}
                            </div>
                        </div>

                        <div class="field">
                            <label for="ws_admin_phone">* Nomor WhatsApp</label>
                            <input id="ws_admin_phone" type="text" v-model="form.admin_phone"
                                placeholder="08123456789" />
                            <div v-if="fieldError('admin_phone')" class="field-error">{{ fieldError('admin_phone')
                                }}
                            </div>
                        </div>

                        <PasswordFields ref="passwordFieldsRef" v-model:password="form.admin_password"
                            v-model:password-confirmation="form.admin_password_confirmation"
                            :password-error="fieldError('admin_password')"
                            :confirmation-error="fieldError('admin_password_confirmation')" />

                        <div v-if="fieldError('school_name')" class="field-error submit-error">{{
                            fieldError('school_name') }}</div>

                        <div class="step-actions">
                            <button type="button" class="btn-ghost-step" @click="prevStep">Kembali</button>
                            <button type="submit" class="btn-hero step-next" :disabled="form.processing">
                                {{ form.processing ? 'Sedang membuat akun...' : 'Daftar Sekarang' }}
                            </button>
                        </div>
                    </div>

                    <!-- STEP 1: Jenis Lembaga -->
                    <div v-else-if="currentStep === 1" key="step1">
                        <div class="field">
                            <label>Apa Jenis Instansi Lembaga Pendidikanmu ?</label>
                            <div class="institution-grid">
                                <button v-for="opt in institutionOptions" :key="opt.value" type="button"
                                    class="institution-card"
                                    :class="{ 'institution-card-active': form.institution_type === opt.value }"
                                    @click="form.institution_type = opt.value">
                                    <span class="institution-icon">{{ opt.icon }}</span>
                                    <span class="institution-label">{{ opt.label }}</span>
                                    <span class="institution-desc">{{ opt.desc }}</span>
                                </button>
                            </div>
                            <div v-if="fieldError('institution_type')" class="field-error">{{
                                fieldError('institution_type') }}</div>
                        </div>

                        <transition name="fade-slide">
                            <div v-if="isLainnya" class="field">
                                <label for="institution_type_other">Nama Jenis Lembaga Anda</label>
                                <input id="institution_type_other" type="text" v-model="form.institution_type_other"
                                    placeholder="Contoh: Komunitas Belajar, Tutor, Private, PAUD, Pesantren dll" />
                                <div v-if="fieldError('institution_type_other')" class="field-error">{{
                                    fieldError('institution_type_other') }}</div>
                            </div>
                        </transition>

                        <div class="step-actions">
                            <button type="button" class="btn-ghost-step" @click="prevStep">Kembali</button>
                            <button type="button" class="btn-hero step-next" @click="nextStep">Selanjutnya</button>
                        </div>
                    </div>

                    <!-- STEP 2: Data Lembaga -->
                    <div v-else-if="currentStep === 2" key="step2">
                        <div class="field">
                            <label for="school_name">* Nama Lengkap Lembaga</label>
                            <input id="school_name" type="text" :value="form.school_name" @input="onSchoolNameInput"
                                placeholder="Lumi Boarding School" />
                            <div v-if="fieldError('school_name')" class="field-error">{{ fieldError('school_name')
                                }}
                            </div>
                        </div>

                        <div class="field">
                            <label for="subdomain">* URL / Link Akses Aplikasi LMS</label>
                            <div class="subdomain-input">
                                <input id="subdomain" type="text" v-model="form.subdomain" @input="onSubdomainInput"
                                    placeholder="smkluminous" />
                                <span class="subdomain-suffix">.{{ centralDomain }}</span>
                            </div>
                            <div v-if="fieldError('subdomain')" class="field-error">{{ fieldError('subdomain') }}
                            </div>
                            <p class="field-hint">Ini akan jadi alamat khusus untuk sekolah / lembaga Anda.
                            </p>
                        </div>

                        <div class="field">
                            <label>Logo Utama <span class="optional-tag">(opsional, maks
                                    15MB)</span></label>
                            <div v-if="!logoPreview" class="logo-upload">
                                <input type="file" accept="image/*" @change="onLogoChange" id="logo"
                                    class="logo-input" />
                                <label for="logo" class="logo-upload-label">
                                    <span class="logo-upload-icon">📷</span>
                                    <span>Klik untuk upload logo sekolah / lembaga</span>
                                </label>
                            </div>
                            <div v-else class="logo-preview">
                                <img :src="logoPreview" alt="Preview logo" />
                                <button type="button" class="logo-remove" @click="removeLogo">✕</button>
                            </div>
                            <div v-if="fieldError('logo')" class="field-error">{{ fieldError('logo') }}</div>
                        </div>

                        <div class="field-divider"></div>

                        <transition name="fade-slide" mode="out-in">
                            <div v-if="isSchool" key="sekolah-fields" class="field-row">

                                <div class="field">
                                    <label for="school_level" class="field-label">* Tingkat / Jenjang</label>
                                    <select id="school_level" v-model="form.school_level" class="field-input">
                                        <option value="" disabled>Silakan Pilih jenjang</option>
                                        <option v-for="lvl in schoolLevelOptions" :key="lvl.value" :value="lvl.value">
                                            {{ lvl.label }}
                                        </option>
                                    </select>
                                    <div v-if="fieldError('school_level')" class="field-error">{{
                                        fieldError('school_level') }}</div>
                                </div>

                                <div class="field">
                                    <label for="npsn">* NPSN <span class="optional-tag">(8 digit)</span></label>
                                    <input id="npsn" type="text" inputmode="numeric" :value="form.npsn"
                                        @input="onNpsnInput" maxlength="8" placeholder="20123456" />
                                    <div v-if="fieldError('npsn')" class="field-error">{{ fieldError('npsn') }}
                                    </div>
                                </div>
                            </div>

                            <div v-else-if="form.institution_type" key="non-sekolah-fields" class="field">
                                <label for="registration_number">{{ registrationNumberLabel }}</label>
                                <input id="registration_number" type="text" v-model="form.registration_number"
                                    placeholder="Masukkan nomor legalitas" />
                                <div v-if="fieldError('registration_number')" class="field-error">{{
                                    fieldError('registration_number') }}</div>
                            </div>
                        </transition>

                        <div v-if="isSchool" class="field">
                            <label for="nss">NSS <span class="optional-tag">(opsional, 12 digit)</span></label>
                            <input id="nss" type="text" inputmode="numeric" :value="form.nss" @input="onNssInput"
                                maxlength="12" placeholder="201234567890" />
                            <div v-if="fieldError('nss')" class="field-error">{{ fieldError('nss') }}</div>
                        </div>

                        <div v-if="isSchool" class="field">
                            <label for="registration_number_school">Nomor Izin Pendirian / Operasional <span
                                    class="optional-tag">(opsional)</span></label>
                            <input id="registration_number_school" type="text" v-model="form.registration_number_school"
                                placeholder="Masukkan nomor izin (jika ada)" />
                            <div v-if="fieldError('registration_number_school')" class="field-error">{{
                                fieldError('registration_number_school') }}</div>
                        </div>

                        <div class="step-actions">
                            <button type="button" class="btn-ghost-step" @click="prevStep">Kembali</button>
                            <button type="button" class="btn-hero step-next" @click="nextStep">Selanjutnya</button>
                        </div>
                    </div>

                    <!-- STEP 3: Kontak Lembaga -->
                    <div v-else-if="currentStep === 3" key="step3">
                        <div class="field">
                            <label for="contact_phone">Nomor Telepon <span
                                    class="optional-tag">(opsional)</span></label>
                            <input id="contact_phone" type="text" v-model="form.contact_phone"
                                placeholder="Masukkan No.Telp Sekolah / Lembaga Pendidikan" />
                            <div v-if="fieldError('contact_phone')" class="field-error">{{
                                fieldError('contact_phone') }}</div>
                        </div>

                        <div class="field">
                            <label for="institution_email">Alamat Email <span
                                    class="optional-tag">(opsional)</span></label>
                            <input id="institution_email" type="email" v-model="form.institution_email"
                                placeholder="info@sekolah.sch.id" />
                            <div v-if="fieldError('institution_email')" class="field-error">{{
                                fieldError('institution_email') }}</div>
                        </div>

                        <div class="field">
                            <label for="institution_website">Website Utama <span
                                    class="optional-tag">(opsional)</span></label>
                            <input id="institution_website" type="text" v-model="form.institution_website"
                                placeholder="https://sekolah.sch.id" />
                            <div v-if="fieldError('institution_website')" class="field-error">{{
                                fieldError('institution_website') }}</div>
                        </div>

                        <div class="field">
                            <label for="address">* Alamat Lengkap (Lembaga)</label>
                            <textarea id="address" v-model="form.address" rows="3"
                                placeholder="Jl. Pendidikan No. 1, Bogor, Jawa Barat, 17820."></textarea>
                            <div v-if="fieldError('address')" class="field-error">{{ fieldError('address') }}</div>
                        </div>

                        <div class="step-actions">
                            <button type="button" class="btn-ghost-step" @click="prevStep">Kembali</button>
                            <button type="button" class="btn-hero step-next" @click="nextStep">Selanjutnya</button>
                        </div>
                    </div>

                    <!-- STEP 4: Kontak Admin / PIC -->
                    <div v-else-if="currentStep === 4" key="step4">
                        <p class="step-intro">Data ini akan digunakan untuk login / masuk ke halaman dashboard
                            lumiverse
                            dan juga aplikasi LMS lembaga Kamu.</p>

                        <div class="field">
                            <label for="admin_name">* Nama Lengkap (Admin / PIC)</label>
                            <input id="admin_name" type="text" v-model="form.admin_name" placeholder="Budi Santoso" />
                            <div v-if="fieldError('admin_name')" class="field-error">{{ fieldError('admin_name') }}
                            </div>
                        </div>

                        <div class="field">
                            <label for="admin_email">* Alamat Email</label>
                            <input id="admin_email" type="email" v-model="form.admin_email"
                                placeholder="budi@sekolah.id" />
                            <div v-if="fieldError('admin_email')" class="field-error">{{ fieldError('admin_email')
                                }}
                            </div>
                        </div>

                        <div class="field">
                            <label for="admin_phone">* Nomor WhatsApp</label>
                            <input id="admin_phone" type="text" v-model="form.admin_phone" placeholder="08123456789" />
                            <div v-if="fieldError('admin_phone')" class="field-error">{{ fieldError('admin_phone')
                                }}
                            </div>
                        </div>

                        <PasswordFields ref="passwordFieldsRef" v-model:password="form.admin_password"
                            v-model:password-confirmation="form.admin_password_confirmation"
                            :password-error="fieldError('admin_password')"
                            :confirmation-error="fieldError('admin_password_confirmation')" />

                        <div v-if="fieldError('school_name')" class="field-error submit-error">{{
                            fieldError('school_name') }}</div>

                        <div class="step-actions">
                            <button type="button" class="btn-ghost-step" @click="prevStep">Kembali</button>
                            <button type="submit" class="btn-hero step-next" :disabled="form.processing">
                                {{ form.processing ? 'Sedang membuat akun...' : 'Daftar Sekarang' }}
                            </button>
                        </div>
                    </div>
                </transition>
            </form>

            <p class="register-footer">
                Sudah terdaftar?
                <Link :href="route('owner.login')" class="text-cyan">Masuk di sini</Link>
            </p>
        </div>

        <ProductSelectModal :show="showProductModal" @close="showProductModal = false" @select="onSwitchProduct" />
    </div>
</template>

<style scoped>
.register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: var(--midnight);
}

.register-card {
    width: 100%;
    max-width: 720px;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem;
}

.register-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
}

.register-sub {
    font-size: 0.9rem;
    color: var(--muted);
    margin-bottom: 1.25rem;
}

.switch-product-row {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.switch-product-link {
    font-size: 0.8rem;
    color: var(--muted);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
}

.switch-product-link:hover {
    border-color: rgba(0, 212, 255, 0.35);
    color: var(--white);
}

.step-intro {
    font-size: 0.85rem;
    color: var(--muted);
    margin-bottom: 1.25rem;
    padding: 0.75rem 1rem;
    background: rgba(0, 212, 255, 0.06);
    border-radius: 10px;
    border: 1px solid rgba(0, 212, 255, 0.15);
}

/* Step indicator */
.steps-bar {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2.25rem;
}

.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
}

.step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: var(--midnight);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--muted);
    transition: all 0.3s;
    z-index: 1;
}

.step-active {
    border-color: var(--cyan);
    color: var(--cyan);
    box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.12);
}

.step-done {
    border-color: var(--cyan);
    background: var(--cyan);
    color: var(--midnight);
}

.step-label {
    font-size: 0.7rem;
    color: var(--muted);
    margin-top: 0.4rem;
    text-align: center;
}

.step-line {
    position: absolute;
    top: 15px;
    left: calc(50% + 16px);
    right: calc(-50% + 16px);
    height: 2px;
    background: var(--border);
    z-index: 0;
}

.step-line-done {
    background: var(--cyan);
}

/* Form */
.register-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.field-divider {
    border-top: 1px solid var(--border);
    margin: 0.45rem 0;
}

.field label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    color: var(--muted);
}

.optional-tag {
    font-weight: 400;
    color: var(--muted);
    opacity: 0.7;
}

.field input,
.field select,
.field textarea {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--white);
    font-size: 0.9rem;
    transition: border-color 0.2s;
    font-family: inherit;
}

.field-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.04em;
}

.field-input:focus {
    border-color: var(--cyan);
}

.field-input::placeholder {
    color: rgba(255, 255, 255, 0.25);
}

select.field-input {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2rem;
}

select.field-input option {
    background: #1a2236;
    color: var(--white);
}

.field select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%237a8194' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.9rem center;
}

.field textarea {
    resize: vertical;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
    outline: none;
    border-color: var(--cyan);
}

.subdomain-input {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    overflow: hidden;
}

.subdomain-input input {
    border: none;
    background: transparent;
    flex: 1;
}

.subdomain-input input:focus {
    outline: none;
}

.subdomain-suffix {
    padding: 0 0.9rem;
    font-size: 0.85rem;
    color: var(--muted);
    font-family: var(--font-mono);
    white-space: nowrap;
}

.field-hint {
    margin-top: 0.4rem;
    font-size: 0.78rem;
    color: var(--muted);
}

.field-error {
    margin-top: 0.4rem;
    font-size: 0.78rem;
    color: #fb7185;
}

.submit-error {
    text-align: center;
}

/* Institution type cards */
.institution-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.institution-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.02);
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
}

.institution-card:hover {
    border-color: rgba(0, 212, 255, 0.4);
    background: rgba(0, 212, 255, 0.04);
}

.institution-card-active {
    border-color: var(--cyan);
    background: rgba(0, 212, 255, 0.08);
}

.institution-icon {
    font-size: 1.5rem;
}

.institution-label {
    font-weight: 700;
    font-size: 0.88rem;
    color: var(--white);
}

.institution-desc {
    font-size: 0.74rem;
    color: var(--muted);
}

/* Logo upload */
.logo-upload {
    position: relative;
}

.logo-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
}

.logo-upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 1.5rem;
    border: 1px dashed var(--border);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.02);
    color: var(--muted);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
}

.logo-upload-label:hover {
    border-color: var(--cyan);
}

.logo-upload-icon {
    font-size: 1.6rem;
}

.logo-preview {
    position: relative;
    width: fit-content;
}

.logo-preview img {
    width: 88px;
    height: 88px;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid var(--border);
}

.logo-remove {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #fb7185;
    color: var(--white);
    border: none;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Step actions */
.step-actions {
    padding-top: 1rem;
    display: flex;
    gap: 0.75rem;
}

.step-next {
    margin-top: 1rem;
    width: 100%;
    justify-content: center;
}

.step-actions .step-next {
    flex: 1;
}

.btn-ghost-step {
    flex-shrink: 0;
    margin-top: 1rem;
    padding: 0.7rem 1.2rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--glass);
    color: var(--muted);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-ghost-step:hover {
    color: var(--white);
    border-color: rgba(255, 255, 255, 0.2);
}

.register-submit:disabled,
.step-next:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.register-footer {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--muted);
}

/* Transition */
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

@media (max-width: 480px) {
    .register-page {
        padding: 0;
    }

    .register-card {
        width: 100%;
        max-width: 640px;
        background: var(--navy);
        border: 1px solid var(--border);
        border-radius: 0;
        padding: 1.5rem;
    }

    .register-title {
        font-size: 1.25rem;
        font-weight: 600;
    }

    .register-sub {
        font-size: 0.875rem;
        line-height: 1rem;
        margin-bottom: 2rem;
    }

    .field-row,
    .institution-grid {
        grid-template-columns: 1fr;
    }

    .step-label {
        font-size: 0.65rem;
    }
}
</style>