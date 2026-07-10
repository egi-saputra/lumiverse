<script setup>
import { Head, useForm } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import OwnerLayout from '@/Layouts/OwnerLayout.vue'
import { PencilSquareIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    owner: Object,
    tenant: Object,
})

// ─── Product type ──────────────────────────────────────────────────────────
const isWorkspace = computed(() => props.tenant.product_type === 'workspace')

// ─── Edit modes ───────────────────────────────────────────────────────────────
const editingProfile = ref(false)
const editingAccount = ref(false)

// ─── Forms ────────────────────────────────────────────────────────────────────
const profileForm = useForm({
    school_name: props.tenant.name,
    institution_type: props.tenant.institution_type,
    institution_type_other: props.tenant.institution_type_other ?? '',
    school_level: props.tenant.school_level ?? '',
    npsn: props.tenant.npsn ?? '',
    nss: props.tenant.nss ?? '',
    registration_number: props.tenant.institution_type !== 'sekolah' ? (props.tenant.registration_number ?? '') : '',
    registration_number_school: props.tenant.institution_type === 'sekolah' ? (props.tenant.registration_number ?? '') : '',
    contact_phone: props.tenant.contact_phone ?? '',
    institution_email: props.tenant.institution_email ?? '',
    institution_website: props.tenant.institution_website ?? '',
    address: props.tenant.address ?? '',
    logo: null,
})

const accountForm = useForm({
    name: props.owner.name,
    email: props.owner.email,
    phone: props.owner.phone ?? '',
    password: '',
    password_confirmation: '',
})

// ─── Cancel helpers ───────────────────────────────────────────────────────────
function cancelProfile() {
    profileForm.reset()
    profileForm.school_name = props.tenant.name
    profileForm.institution_type = props.tenant.institution_type
    profileForm.institution_type_other = props.tenant.institution_type_other ?? ''
    profileForm.school_level = props.tenant.school_level ?? ''
    profileForm.npsn = props.tenant.npsn ?? ''
    profileForm.nss = props.tenant.nss ?? ''
    profileForm.registration_number = props.tenant.institution_type !== 'sekolah' ? (props.tenant.registration_number ?? '') : ''
    profileForm.registration_number_school = props.tenant.institution_type === 'sekolah' ? (props.tenant.registration_number ?? '') : ''
    profileForm.contact_phone = props.tenant.contact_phone ?? ''
    profileForm.institution_email = props.tenant.institution_email ?? ''
    profileForm.institution_website = props.tenant.institution_website ?? ''
    profileForm.address = props.tenant.address ?? ''
    profileForm.logo = null
    editingProfile.value = false
}
function cancelAccount() {
    accountForm.reset()
    accountForm.name = props.owner.name
    accountForm.email = props.owner.email
    accountForm.phone = props.owner.phone ?? ''
    accountForm.password = ''
    accountForm.password_confirmation = ''
    editingAccount.value = false
}

// ─── Submit handlers ──────────────────────────────────────────────────────────
function submitProfile() {
    profileForm.post(route('owner.update.profile'), {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => { editingProfile.value = false },
    })
}

function submitAccount() {
    accountForm.patch(route('owner.update.account'), {
        preserveScroll: true,
        onSuccess: () => {
            editingAccount.value = false
            accountForm.password = ''
            accountForm.password_confirmation = ''
        },
    })
}

// ─── Utilities ────────────────────────────────────────────────────────────────
const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfPassword = ref(false)

// ─── Opsi jenis lembaga/organisasi — kondisional per product_type ──────────────
const institutionTypes = computed(() => {
    if (isWorkspace.value) {
        return [
            { value: 'pt', label: 'PT (Perseroan Terbatas)' },
            { value: 'cv', label: 'CV (Commanditaire Venootschap)' },
            { value: 'startup', label: 'Startup / Rintisan' },
            { value: 'yayasan', label: 'Yayasan / Organisasi Non-Profit' },
            { value: 'lainnya', label: 'Lainnya' },
        ]
    }
    return [
        { value: 'sekolah', label: 'Sekolah' },
        { value: 'kursus', label: 'Kursus & Bimbel' },
        { value: 'privat', label: 'Privat / Tutor' },
        { value: 'yayasan', label: 'Yayasan' },
        { value: 'lainnya', label: 'Lainnya' },
    ]
})

const schoolLevels = [
    { value: 'sd', label: 'SD / MI / Sederajat' },
    { value: 'smp', label: 'SMP / MTS / Sederajat' },
    { value: 'smk', label: 'SMA / SMK / Sederajat' },
]

const institutionTypeLabel = computed(() => {
    const map = Object.fromEntries(institutionTypes.value.map(t => [t.value, t.label]))
    const base = map[props.tenant.institution_type] || props.tenant.institution_type
    if (props.tenant.institution_type === 'lainnya' && props.tenant.institution_type_other) {
        return `${base} (${props.tenant.institution_type_other})`
    }
    return base
})

const schoolLevelLabel = computed(() => {
    const map = { sd: 'SD / Sederajat', smp: 'SMP / MTS / Sederajat', smk: 'SMA / SMK / Sederajat' }
    return props.tenant.school_level ? map[props.tenant.school_level] || props.tenant.school_level : null
})

const logoUrl = computed(() => props.tenant.logo_url ?? null)

// ─── Label & teks kondisional per product_type ─────────────────────────────────
const pageLead = computed(() => isWorkspace.value
    ? 'Kelola data perusahaan / organisasi dan akun admin (PIC) yang digunakan untuk mengakses Lumiverse.'
    : 'Kelola data lembaga / institusi pendidikan dan akun admin (PIC) yang digunakan untuk mengakses Lumiverse.')

const profileSectionTitle = computed(() => isWorkspace.value
    ? 'Profil Perusahaan / Organisasi'
    : 'Profil Lembaga / Institusi Pendidikan')

const profileSubLabel = computed(() => isWorkspace.value ? 'Jenis Organisasi' : 'Jenis Lembaga Pendidikan')

const nameFieldLabel = computed(() => isWorkspace.value ? 'Nama Perusahaan / Organisasi' : 'Nama Lembaga Pendidikan')

const typeFieldLabel = computed(() => isWorkspace.value ? 'Jenis Organisasi' : 'Jenis Lembaga Pendidikan')

const typeOtherFieldLabel = computed(() => isWorkspace.value ? 'Nama Jenis Organisasi' : 'Nama Jenis Lembaga')

const typeOtherPlaceholder = computed(() => isWorkspace.value ? 'contoh: Koperasi' : 'contoh: Pesantren')

const legalityFieldLabel = computed(() => isWorkspace.value ? 'NPWP / No. Legalitas Perusahaan' : 'No. Legalitas')

const legalityPlaceholder = computed(() => isWorkspace.value ? 'Nomor NPWP / akta pendirian' : 'Nomor akta / ijin')

const phoneFieldLabel = computed(() => isWorkspace.value ? 'Telepon Kantor' : 'Telepon Sekolah / Lembaga')

const addressFieldLabel = computed(() => isWorkspace.value ? 'Alamat Kantor / Perusahaan' : 'Alamat Sekolah / Lembaga Pendidikan')

const addressPlaceholder = computed(() => isWorkspace.value ? 'Alamat lengkap kantor / perusahaan' : 'Alamat lengkap lembaga')

const websiteFieldLabel = computed(() => isWorkspace.value ? 'Website Perusahaan' : 'Website')

const emailFieldLabel = computed(() => isWorkspace.value ? 'Alamat Email Perusahaan' : 'Alamat Email')

const namePlaceholder = computed(() => isWorkspace.value ? 'Nama perusahaan / organisasi' : 'Nama lembaga')

const emailRowLabel = computed(() => isWorkspace.value ? 'Email Perusahaan' : 'Email Address')

const legalityRowLabel = computed(() => isWorkspace.value ? 'NPWP / No. Legalitas' : 'No. Legalitas')

const accountNote = computed(() => isWorkspace.value
    ? 'Informasi / data akun ini dapat digunakan untuk mengakses halaman dashboard lumiverse dan juga aplikasi workspace pada url perusahaan yang sudah Anda daftarkan!'
    : 'Informasi / data akun ini dapat digunakan untuk mengakses halaman dashboard lumiverse dan juga aplikasi lms pada url sekolah yang sudah Anda daftarkan!')
</script>

<template>

    <Head title="Profil Lembaga & Akun" />

    <OwnerLayout>

        <template #header>
            <h1 class="topbar-title">Profil Lembaga & Akun</h1>
        </template>

        <p class="page-lead">{{ pageLead }}</p>

        <!-- ═══════════════════════════════════════════════════════════════
                 Profil Lembaga / Perusahaan
            ════════════════════════════════════════════════════════════════ -->
        <div class="section-title">{{ profileSectionTitle }}</div>
        <div class="info-card mb-gap">

            <!-- ── View mode ── -->
            <template v-if="!editingProfile">
                <div class="profile-header">
                    <div class="logo-box">
                        <img v-if="logoUrl" :src="logoUrl" :alt="tenant.name" class="logo-img" />
                        <div v-else class="logo-placeholder">{{ tenant.name?.charAt(0) ?? '?' }}</div>
                    </div>
                    <div>
                        <div class="profile-name">{{ tenant.name }}</div>
                        <div class="profile-sub">{{ profileSubLabel }} ( {{ institutionTypeLabel }} )</div>
                    </div>
                </div>

                <div class="two-col-grid">
                    <div class="info-card-row">
                        <span>{{ typeFieldLabel }}</span>
                        <strong>{{ institutionTypeLabel }}</strong>
                    </div>
                    <div class="info-card-row" v-if="!isWorkspace && schoolLevelLabel">
                        <span>Tingkat / Jenjang</span>
                        <strong>{{ schoolLevelLabel }}</strong>
                    </div>
                    <div class="info-card-row" v-if="!isWorkspace && tenant.npsn">
                        <span>NPSN</span>
                        <strong class="mono">{{ tenant.npsn }}</strong>
                    </div>
                    <div class="info-card-row" v-if="!isWorkspace && tenant.nss">
                        <span>NSS</span>
                        <strong class="mono">{{ tenant.nss }}</strong>
                    </div>
                    <div class="info-card-row"
                        v-if="!isWorkspace && tenant.institution_type === 'sekolah' && tenant.registration_number">
                        <span>No. Izin Pendirian</span>
                        <strong class="mono">{{ tenant.registration_number }}</strong>
                    </div>
                    <div class="info-card-row"
                        v-if="tenant.institution_type !== 'sekolah' && tenant.registration_number">
                        <span>{{ legalityRowLabel }}</span>
                        <strong class="mono">{{ tenant.registration_number }}</strong>
                    </div>
                    <div class="info-card-row" v-if="tenant.contact_phone">
                        <span>{{ phoneFieldLabel }}</span>
                        <strong>{{ tenant.contact_phone }}</strong>
                    </div>
                    <div class="info-card-row" v-if="tenant.institution_email">
                        <span>{{ emailRowLabel }}</span>
                        <strong>{{ tenant.institution_email }}</strong>
                    </div>
                    <div class="info-card-row" v-if="tenant.institution_website">
                        <span>{{ websiteFieldLabel }}</span>
                        <a :href="tenant.institution_website" target="_blank" class="link-cyan">{{
                            tenant.institution_website }}</a>
                    </div>
                    <div class="info-card-row col-span-2" v-if="tenant.address">
                        <span>{{ addressFieldLabel }}</span>
                        <strong class="text-right">{{ tenant.address }}</strong>
                    </div>
                </div>
            </template>

            <!-- ── Edit mode ── -->
            <template v-else>
                <div class="edit-grid">
                    <!-- Nama -->
                    <div class="field-group col-span-2">
                        <label class="field-label">{{ nameFieldLabel }}</label>
                        <input v-model="profileForm.school_name" class="field-input" :placeholder="namePlaceholder" />
                        <p v-if="profileForm.errors.school_name" class="field-error">{{
                            profileForm.errors.school_name }}</p>
                    </div>

                    <!-- Jenis Lembaga / Organisasi -->
                    <div class="field-group">
                        <label class="field-label">{{ typeFieldLabel }}</label>
                        <select v-model="profileForm.institution_type" class="field-input">
                            <option v-for="t in institutionTypes" :key="t.value" :value="t.value">{{ t.label }}
                            </option>
                        </select>
                        <p v-if="profileForm.errors.institution_type" class="field-error">{{
                            profileForm.errors.institution_type }}</p>
                    </div>

                    <!-- Nama jenis lainnya -->
                    <div class="field-group" v-if="profileForm.institution_type === 'lainnya'">
                        <label class="field-label">{{ typeOtherFieldLabel }}</label>
                        <input v-model="profileForm.institution_type_other" class="field-input"
                            :placeholder="typeOtherPlaceholder" />
                        <p v-if="profileForm.errors.institution_type_other" class="field-error">{{
                            profileForm.errors.institution_type_other }}</p>
                    </div>

                    <!-- Jenjang (sekolah saja) -->
                    <div class="field-group" v-if="!isWorkspace && profileForm.institution_type === 'sekolah'">
                        <label class="field-label">Tingkat / Jenjang</label>
                        <select v-model="profileForm.school_level" class="field-input">
                            <option value="">— Pilih jenjang —</option>
                            <option v-for="l in schoolLevels" :key="l.value" :value="l.value">{{ l.label }}</option>
                        </select>
                        <p v-if="profileForm.errors.school_level" class="field-error">{{
                            profileForm.errors.school_level }}</p>
                    </div>

                    <!-- NPSN (sekolah saja) -->
                    <div class="field-group" v-if="!isWorkspace && profileForm.institution_type === 'sekolah'">
                        <label class="field-label">No. Pokok Sekolah Nasional (NPSN)</label>
                        <input v-model="profileForm.npsn" class="field-input mono" placeholder="8 digit"
                            maxlength="8" />
                        <p v-if="profileForm.errors.npsn" class="field-error">{{ profileForm.errors.npsn }}</p>
                    </div>

                    <!-- NSS (sekolah saja) -->
                    <div class="field-group" v-if="!isWorkspace && profileForm.institution_type === 'sekolah'">
                        <label class="field-label">No. Statistik Sekolah (NSS)</label>
                        <input v-model="profileForm.nss" class="field-input mono" placeholder="12 digit"
                            maxlength="12" />
                        <p v-if="profileForm.errors.nss" class="field-error">{{ profileForm.errors.nss }}</p>
                    </div>

                    <!-- No. Izin Pendirian (sekolah saja) -->
                    <div class="field-group col-span-2"
                        v-if="!isWorkspace && profileForm.institution_type === 'sekolah'">
                        <label class="field-label">No. Izin Pendirian / Operasional <span
                                class="field-optional">(opsional)</span></label>
                        <input v-model="profileForm.registration_number_school" class="field-input mono"
                            placeholder="Nomor izin pendirian sekolah" />
                        <p v-if="profileForm.errors.registration_number_school" class="field-error">{{
                            profileForm.errors.registration_number_school }}</p>
                    </div>

                    <!-- No. legalitas / NPWP (non-sekolah, termasuk semua tipe workspace) -->
                    <div class="field-group" v-if="profileForm.institution_type !== 'sekolah'">
                        <label class="field-label">{{ legalityFieldLabel }}</label>
                        <input v-model="profileForm.registration_number" class="field-input mono"
                            :placeholder="legalityPlaceholder" />
                        <p v-if="profileForm.errors.registration_number" class="field-error">{{
                            profileForm.errors.registration_number }}</p>
                    </div>

                    <!-- Telepon -->
                    <div class="field-group">
                        <label class="field-label">{{ phoneFieldLabel }} <span
                                class="field-optional">(opsional)</span></label>
                        <input v-model="profileForm.contact_phone" class="field-input" placeholder="021-xxxxxxx" />
                        <p v-if="profileForm.errors.contact_phone" class="field-error">{{
                            profileForm.errors.contact_phone }}</p>
                    </div>

                    <!-- Email lembaga/perusahaan -->
                    <div class="field-group">
                        <label class="field-label">{{ emailFieldLabel }} <span
                                class="field-optional">(opsional)</span></label>
                        <input v-model="profileForm.institution_email" class="field-input" type="email"
                            placeholder="email@lumiverse.co.id" />
                        <p v-if="profileForm.errors.institution_email" class="field-error">{{
                            profileForm.errors.institution_email }}</p>
                    </div>

                    <!-- Website -->
                    <div class="field-group col-span-2">
                        <label class="field-label">{{ websiteFieldLabel }} <span
                                class="field-optional">(opsional)</span></label>
                        <input v-model="profileForm.institution_website" class="field-input"
                            placeholder="https://lumiverse.sch.id" />
                        <p v-if="profileForm.errors.institution_website" class="field-error">{{
                            profileForm.errors.institution_website }}</p>
                    </div>

                    <!-- Alamat -->
                    <div class="field-group col-span-2">
                        <label class="field-label">{{ addressFieldLabel }}</label>
                        <textarea v-model="profileForm.address" class="field-input field-textarea" rows="3"
                            :placeholder="addressPlaceholder"></textarea>
                        <p v-if="profileForm.errors.address" class="field-error">{{ profileForm.errors.address }}
                        </p>
                    </div>

                    <!-- Logo -->
                    <div class="field-group col-span-2">
                        <label class="field-label">Logo <span class="field-optional">(opsional, max 15MB ·
                                JPG/PNG/WebP)</span></label>
                        <div class="logo-upload-row">
                            <div class="logo-preview-sm">
                                <img v-if="logoUrl" :src="logoUrl" class="logo-img" />
                                <div v-else class="logo-placeholder logo-placeholder-sm">{{ tenant.name?.charAt(0)
                                    ?? '?' }}</div>
                            </div>
                            <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp"
                                class="field-input file-input" @change="e => profileForm.logo = e.target.files[0]" />
                        </div>
                        <p v-if="profileForm.errors.logo" class="field-error">{{ profileForm.errors.logo }}</p>
                    </div>
                </div>
            </template>

            <div class="card-footer">
                <template v-if="!editingProfile">
                    <button class="btn-edit" @click="editingProfile = true">
                        <PencilSquareIcon class="btn-icon" /> Edit Profil
                    </button>
                </template>
                <template v-else>
                    <button class="btn-cancel" @click="cancelProfile">Batal</button>
                    <button class="btn-update" :disabled="profileForm.processing" @click="submitProfile">
                        {{ profileForm.processing ? 'Menyimpan...' : 'Simpan Profil' }}
                    </button>
                </template>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
                 Akun Admin (PIC)
            ════════════════════════════════════════════════════════════════ -->
        <div class="section-title">Akun Admin / Penanggung Jawab (PIC)</div>
        <div class="info-card">

            <!-- ── View mode ── -->
            <template v-if="!editingAccount">
                <p class="title-note">{{ accountNote }}</p>

                <div class="two-col-grid">
                    <div class="info-card-row">
                        <span>Nama Lengkap</span>
                        <strong>{{ owner.name }}</strong>
                    </div>
                    <div class="info-card-row">
                        <span>Email Address</span>
                        <strong>{{ owner.email }}</strong>
                    </div>
                    <div class="info-card-row">
                        <span>No. WhatsApp</span>
                        <strong>{{ owner.phone || '-' }}</strong>
                    </div>
                    <div class="info-card-row">
                        <span>Password</span>
                        <div class="password-field">
                            <span class="mono password-value">{{ showPassword ? '(tersimpan di database)' :
                                '••••••••••' }}</span>
                            <button class="eye-btn" @click="showPassword = !showPassword"
                                :title="showPassword ? 'Sembunyikan' : 'Tampilkan'">
                                <EyeIcon v-if="!showPassword" class="icon-16" />
                                <EyeSlashIcon v-else class="icon-16" />
                            </button>
                        </div>
                    </div>
                </div>
                <p class="password-note">🔒 Password di-hash dan tidak dapat dilihat. Gunakan tombol edit untuk
                    menggantinya.</p>
            </template>

            <!-- ── Edit mode ── -->
            <template v-else>
                <div class="edit-grid">
                    <div class="field-group">
                        <label class="field-label">Nama Lengkap</label>
                        <input v-model="accountForm.name" class="field-input" placeholder="Nama lengkap" />
                        <p v-if="accountForm.errors.name" class="field-error">{{ accountForm.errors.name }}</p>
                    </div>
                    <div class="field-group">
                        <label class="field-label">Email Address</label>
                        <input v-model="accountForm.email" class="field-input" type="email"
                            placeholder="email@domain.com" />
                        <p v-if="accountForm.errors.email" class="field-error">{{ accountForm.errors.email }}</p>
                    </div>
                    <div class="field-group col-span-2">
                        <label class="field-label">No. WhatsApp</label>
                        <input v-model="accountForm.phone" class="field-input" placeholder="08xxxxxxxxxx" />
                        <p v-if="accountForm.errors.phone" class="field-error">{{ accountForm.errors.phone }}</p>
                    </div>

                    <div class="field-divider col-span-2">
                        <span>Ganti Password <span class="field-optional">(kosongkan jika tidak ingin
                                diganti)</span></span>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Password Baru</label>
                        <div class="input-eye-wrap">
                            <input v-model="accountForm.password" :type="showNewPassword ? 'text' : 'password'"
                                class="field-input" placeholder="Min. 8 karakter" />
                            <button class="eye-btn eye-inside" type="button"
                                @click="showNewPassword = !showNewPassword">
                                <EyeIcon v-if="!showNewPassword" class="icon-15" />
                                <EyeSlashIcon v-else class="icon-15" />
                            </button>
                        </div>
                        <p v-if="accountForm.errors.password" class="field-error">{{ accountForm.errors.password }}
                        </p>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Konfirmasi Password</label>
                        <div class="input-eye-wrap">
                            <input v-model="accountForm.password_confirmation"
                                :type="showConfPassword ? 'text' : 'password'" class="field-input"
                                placeholder="Ulangi password baru" />
                            <button class="eye-btn eye-inside" type="button"
                                @click="showConfPassword = !showConfPassword">
                                <EyeIcon v-if="!showConfPassword" class="icon-15" />
                                <EyeSlashIcon v-else class="icon-15" />
                            </button>
                        </div>
                        <p v-if="accountForm.errors.password_confirmation" class="field-error">{{
                            accountForm.errors.password_confirmation }}</p>
                    </div>
                </div>
            </template>

            <div class="card-footer">
                <template v-if="!editingAccount">
                    <button class="btn-edit" @click="editingAccount = true">
                        <PencilSquareIcon class="btn-icon" /> Edit Akun
                    </button>
                </template>
                <template v-else>
                    <button class="btn-cancel" @click="cancelAccount">Batal</button>
                    <button class="btn-update" :disabled="accountForm.processing" @click="submitAccount">
                        {{ accountForm.processing ? 'Menyimpan...' : 'Simpan Akun' }}
                    </button>
                </template>
            </div>
        </div>

    </OwnerLayout>
</template>

<style scoped>
.page-lead {
    color: var(--muted);
    font-size: 0.88rem;
    margin-bottom: 1.5rem;
}

.section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--muted);
    font-weight: 700;
    margin-bottom: 0.75rem;
    margin-top: 0.25rem;
}

.mb-gap {
    margin-bottom: 1.5rem;
}

.info-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
}

.info-card-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-top: 1px solid var(--border);
    font-size: 0.88rem;
    gap: 1rem;
}

.info-card-row span {
    color: var(--muted);
    flex-shrink: 0;
}

.info-card-row strong,
.info-card-row a {
    text-align: right;
    word-break: break-word;
}

.col-span-2 {
    grid-column: 1 / -1;
}

.two-col-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
}

.card-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
}

.btn-icon {
    width: 13px;
    height: 13px;
    display: inline;
    vertical-align: -1px;
}

.icon-16 {
    width: 16px;
    height: 16px;
}

.icon-15 {
    width: 15px;
    height: 15px;
}

.btn-edit {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted);
    padding: 0.4rem 0.9rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-edit:hover {
    color: var(--white);
    border-color: rgba(255, 255, 255, 0.2);
    background: var(--glass);
}

.btn-cancel {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted);
    padding: 0.4rem 0.9rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel:hover {
    color: var(--white);
    border-color: rgba(255, 255, 255, 0.2);
}

.btn-update {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--midnight);
    padding: 0.4rem 1.1rem;
    border-radius: 8px;
    border: none;
    background: var(--cyan);
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-update:hover {
    opacity: 0.88;
}

.btn-update:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.edit-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem 1.5rem;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.field-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.field-optional {
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    font-size: 0.74rem;
}

.field-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--white);
    font-size: 0.875rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
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

.field-textarea {
    resize: vertical;
    min-height: 80px;
}

.field-error {
    font-size: 0.76rem;
    color: #fb7185;
    margin: 0;
}

.field-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--muted);
    font-size: 0.8rem;
    padding: 0.5rem 0;
    border-top: 1px solid var(--border);
    margin-top: 0.25rem;
}

.input-eye-wrap {
    position: relative;
}

.input-eye-wrap .field-input {
    padding-right: 2.5rem;
}

.eye-inside {
    position: absolute;
    right: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
}

.logo-upload-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo-preview-sm {
    flex-shrink: 0;
}

.logo-placeholder-sm {
    font-size: 1.1rem;
    width: 42px;
    height: 42px;
}

.file-input {
    flex: 1;
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
}

.file-input::file-selector-button {
    background: var(--glass);
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    cursor: pointer;
    margin-right: 0.5rem;
    font-size: 0.78rem;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
}

.logo-box {
    flex-shrink: 0;
}

.logo-img {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    object-fit: cover;
}

.logo-placeholder {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1.5rem;
    color: var(--midnight);
}

.profile-name {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.1rem;
}

.profile-sub {
    font-size: 0.82rem;
    color: var(--muted);
    margin-top: 0.2rem;
}

.password-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: flex-end;
}

.password-value {
    font-size: 0.85rem;
    color: var(--muted);
    letter-spacing: 0.05em;
}

.eye-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    padding: 0.2rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    line-height: 0;
}

.eye-btn:hover {
    color: var(--white);
}

.title-note {
    font-size: 0.76rem;
    color: var(--muted);
    margin-bottom: 1.5rem;
}

.password-note {
    font-size: 0.76rem;
    color: var(--muted);
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
}

.mono {
    font-family: var(--font-mono);
    font-size: 0.84rem;
}

.link-cyan {
    color: var(--cyan);
    text-decoration: none;
    font-size: 0.84rem;
}

.link-cyan:hover {
    text-decoration: underline;
}

.text-right {
    text-align: right;
}

@media (max-width: 720px) {
    .two-col-grid {
        grid-template-columns: 1fr;
    }

    .edit-grid {
        grid-template-columns: 1fr;
    }

    .col-span-2 {
        grid-column: 1;
    }
}
</style>