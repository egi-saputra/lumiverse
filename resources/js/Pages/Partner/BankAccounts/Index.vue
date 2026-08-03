<script setup>
import { Head, useForm, usePage } from '@inertiajs/vue3'
import PartnerLayout from '@/Layouts/PartnerLayout.vue'
import axios from 'axios'
import { ref } from 'vue'
import { ensureDeviceRegistered, getOrCreateDeviceUuid } from '@/Utils/device'

const props = defineProps({
    accounts: Array,
    banks: Array,
    cooling_off_hours: Number,
})

const page = usePage()

const form = useForm({
    bank_code: '',
    account_number: '',
    account_holder_name: '',
})

const showForm = ref(false)
const showPinForm = ref(false)
const pin = ref('')
const currentPassword = ref('')
const pinMode = ref('verify')
const pinError = ref('')
const pinProcessing = ref(false)
const pendingAction = ref(null)

// id rekening yang tooltip-nya sedang terbuka (untuk tap di mobile)
const openTooltipId = ref(null)

function toggleTooltip(id) {
    openTooltipId.value = openTooltipId.value === id ? null : id
}

function askForPin(action) {
    pendingAction.value = action
    pin.value = ''
    currentPassword.value = ''
    pinMode.value = 'verify'
    pinError.value = ''
    showPinForm.value = true
}

async function confirmPin() {
    if (!pendingAction.value || pinProcessing.value) return

    pinProcessing.value = true
    pinError.value = ''

    try {
        const deviceId = await ensureDeviceRegistered()

        if (pinMode.value === 'setup') {
            await axios.post(route('partner.devices.pin.store', deviceId), {
                current_password: currentPassword.value,
                pin: pin.value,
            })
        }

        await axios.post(route('partner.devices.step-up.challenge', deviceId))
        const { data } = await axios.post(route('partner.devices.step-up.verify', deviceId), {
            pin: pin.value,
        })

        const action = pendingAction.value
        pendingAction.value = null
        showPinForm.value = false
        action({
            'X-Device-Uuid': getOrCreateDeviceUuid(),
            'X-Step-Up-Token': data.step_up_token,
        })
    } catch (error) {
        pinError.value = error.response?.data?.message
            || error.response?.data?.errors?.current_password?.[0]
            || 'PIN tidak dapat diverifikasi.'
    } finally {
        pinProcessing.value = false
    }
}

function cancelPin() {
    if (pinProcessing.value) return
    showPinForm.value = false
    pendingAction.value = null
}

function showPinSetup() {
    pinMode.value = 'setup'
    pin.value = ''
    currentPassword.value = ''
    pinError.value = ''
}

function showPinVerification() {
    pinMode.value = 'verify'
    pin.value = ''
    currentPassword.value = ''
    pinError.value = ''
}

function submit() {
    askForPin((headers) => form.post(route('partner.bank-accounts.store'), {
        preserveScroll: true,
        headers,
        onSuccess: () => {
            form.reset()
            showForm.value = false
        },
    }))
}

function setPrimary(account) {
    if (account.is_primary) return
    askForPin((headers) => form.patch(route('partner.bank-accounts.primary', account.id), {
        preserveScroll: true,
        headers,
    }))
}

function destroyAccount(account) {
    if (!confirm(`Hapus rekening ${account.bank_code} ${account.account_number}?`)) return
    askForPin((headers) => form.delete(route('partner.bank-accounts.destroy', account.id), {
        preserveScroll: true,
        headers,
    }))
}

function statusLabel(status) {
    if (status === 'verified') return 'Terverifikasi'
    if (status === 'failed') return 'Gagal Verifikasi'
    return 'Belum Diverifikasi'
}

function statusClass(status) {
    if (status === 'verified') return 'status-verified'
    if (status === 'failed') return 'status-failed'
    return 'status-unverified'
}

function statusHint(account) {
    if (account.verification_status === 'failed') {
        return account.verification_failure_reason
            || 'Pencairan komisi ke rekening ini gagal diproses. Periksa kembali data rekening, lalu coba lagi.'
    }
    if (account.verification_status === 'unverified') {
        let hint = 'Akun bank Anda akan diverifikasi secara otomatis oleh sistem saat melakukan penarikan / pencairan dana pertama kali,'
        if (!account.eligible_for_payout) {
            hint += ` Rekening ini masih dalam masa tunggu keamanan, akun bank dapat digunakan setelah ${props.cooling_off_hours} jam sejak ditambahkan.`
        }
        return hint
    }
    return null
}

const bankName = (code) => props.banks.find(b => b.code === code)?.name ?? code
</script>

<template>

    <Head title="Bank Account" />
    <PartnerLayout>
        <template #header>
            <h1 class="topbar-title">Bank Account</h1>
        </template>

        <div class="header-row mb-gap">
            <div>
                <h1 class="page-title">Kelola Akun Bank</h1>
                <p class="page-sub">Rekening utama dipakai sebagai tujuan pencairan komisi kamu.</p>
            </div>
            <button class="btn-primary-sm" @click="showForm = !showForm">
                {{ showForm ? 'Batal' : '+ Tambah Rekening' }}
            </button>
        </div>

        <div v-if="page.props.flash?.success" class="flash-banner flash-success mb-gap">
            {{ page.props.flash.success }}
        </div>
        <div v-if="page.props.flash?.warning" class="flash-banner flash-warning mb-gap">
            {{ page.props.flash.warning }}
        </div>
        <div v-if="page.props.flash?.error" class="flash-banner flash-error mb-gap">
            {{ page.props.flash.error }}
        </div>

        <div v-if="showPinForm" class="pin-backdrop" @click.self="cancelPin">
            <form class="pin-modal" @submit.prevent="confirmPin">
                <h2 class="pin-title">{{ pinMode === 'setup' ? 'Atur PIN Keamanan' : 'Konfirmasi Keamanan' }}</h2>
                <p class="pin-subtitle">
                    {{ pinMode === 'setup' ? 'Konfirmasi password akun lalu buat PIN 6 digit.' : 'Masukkan PIN 6 digit untuk melanjutkan.' }}
                </p>
                <input v-if="pinMode === 'setup'" v-model="currentPassword" class="field-input" type="password"
                    autocomplete="current-password" placeholder="Password akun" required />
                <input v-model="pin" class="field-input pin-input" type="password" inputmode="numeric" maxlength="6"
                    pattern="[0-9]{6}" autocomplete="one-time-code" placeholder="••••••"
                    @input="pin = pin.replace(/\D/g, '')" required autofocus />
                <p v-if="pinError" class="field-error">{{ pinError }}</p>
                <div class="pin-actions">
                    <button v-if="pinMode === 'verify'" type="button" class="pin-link" :disabled="pinProcessing"
                        @click="showPinSetup">
                        Belum punya PIN?
                    </button>
                    <button v-else type="button" class="pin-link" :disabled="pinProcessing"
                        @click="showPinVerification">
                        Sudah punya PIN
                    </button>
                    <button type="button" class="btn-outline-sm" :disabled="pinProcessing" @click="cancelPin">
                        Batal
                    </button>
                    <button type="submit" class="btn-primary-sm" :disabled="pinProcessing || pin.length !== 6">
                        {{ pinProcessing ? 'Memeriksa…' : 'Konfirmasi' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Form tambah rekening -->
        <Transition name="expand">
            <div v-if="showForm" class="info-card mb-gap">
                <form @submit.prevent="submit" class="form-grid">
                    <div class="form-row">
                        <div class="field">
                            <label class="field-label">Bank</label>
                            <select v-model="form.bank_code" class="field-input" required>
                                <option value="" disabled>Pilih bank</option>
                                <option v-for="bank in banks" :key="bank.code" :value="bank.code">
                                    {{ bank.name }}
                                </option>
                            </select>
                            <p v-if="form.errors.bank_code" class="field-error">{{ form.errors.bank_code }}</p>
                        </div>

                        <div class="field">
                            <label class="field-label">Nomor Rekening</label>
                            <input v-model="form.account_number" type="text" class="field-input mono"
                                placeholder="1234567890" required />
                            <p v-if="form.errors.account_number" class="field-error">{{ form.errors.account_number }}
                            </p>
                        </div>
                    </div>

                    <div class="field">
                        <label class="field-label">Nama Pemilik Rekening</label>
                        <input v-model="form.account_holder_name" type="text" class="field-input"
                            placeholder="Sesuai buku rekening" required />
                        <p v-if="form.errors.account_holder_name" class="field-error">
                            {{ form.errors.account_holder_name }}
                        </p>
                    </div>

                    <p class="field-hint">
                        Rekening baru akan berstatus "Belum Diverifikasi" sampai kamu melakukan pencairan pertama, lalu
                        otomatis "Terverifikasi" kalau berhasil. Untuk keamanan, rekening baru baru bisa dipakai
                        pencairan setelah {{ cooling_off_hours }} jam sejak ditambahkan.
                    </p>

                    <button type="submit" :disabled="form.processing" class="btn-primary">
                        {{ form.processing ? 'Menyimpan…' : 'Simpan Rekening' }}
                    </button>
                </form>
            </div>
        </Transition>

        <!-- Daftar rekening -->
        <div v-if="accounts.length === 0" class="info-card empty-state">
            Belum ada rekening yang terdaftar. Tambahkan rekening untuk mulai menerima pencairan komisi.
        </div>

        <div v-else class="accounts-list">
            <div v-for="account in accounts" :key="account.id" class="info-card account-card"
                :class="{ 'account-card-primary': account.is_primary }">
                <div class="account-main">
                    <div class="account-bank-row">
                        <strong class="account-bank">{{ bankName(account.bank_code) }}</strong>
                        <span v-if="account.is_primary" class="primary-badge">Utama</span>

                        <span class="status-wrap">
                            <span class="status-pill" :class="statusClass(account.verification_status)">
                                {{ statusLabel(account.verification_status) }}
                            </span>

                            <button v-if="statusHint(account)" type="button" class="info-btn"
                                :class="{ 'info-btn-danger': account.verification_status === 'failed' }"
                                :aria-label="'Info status: ' + statusLabel(account.verification_status)"
                                @click="toggleTooltip(account.id)" @blur="openTooltipId = null">
                                i
                                <span class="tooltip" :class="{ 'tooltip-open': openTooltipId === account.id }">
                                    {{ statusHint(account) }}
                                </span>
                            </button>
                        </span>
                    </div>

                    <div class="account-number mono">{{ account.account_number }}</div>
                    <div class="account-holder">{{ account.account_holder_name }}</div>
                </div>

                <div class="account-actions">
                    <button v-if="!account.is_primary" class="btn-outline-sm" @click="setPrimary(account)">
                        Jadikan Utama
                    </button>
                    <button class="btn-danger-sm" @click="destroyAccount(account)">
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    </PartnerLayout>
</template>

<style scoped>
.header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}

.page-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.2rem;
    margin: 0;
    letter-spacing: -0.01em;
}

.page-sub {
    color: var(--muted);
    font-size: 0.85rem;
    margin-top: 0.3rem;
    line-height: 1.5;
}

.mb-gap {
    margin-bottom: 1.5rem;
}

/* ── Flash banners ────────────────────────────────────────── */
.flash-banner {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-size: 0.85rem;
    line-height: 1.5;
}

.flash-success {
    background: rgba(52, 211, 153, 0.1);
    border: 1px solid rgba(52, 211, 153, 0.3);
    color: #34d399;
}

.flash-warning {
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.3);
    color: #fbbf24;
}

.flash-error {
    background: rgba(251, 113, 133, 0.1);
    border: 1px solid rgba(251, 113, 133, 0.3);
    color: #fb7185;
}

.pin-backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgba(3, 8, 20, 0.72);
}

.pin-modal {
    width: min(100%, 360px);
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--navy);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.pin-title {
    margin: 0;
    color: var(--white);
    font-size: 1.05rem;
    font-weight: 800;
}

.pin-subtitle {
    margin: 0.4rem 0 1rem;
    color: var(--muted);
    font-size: 0.82rem;
}

.pin-input {
    width: 100%;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 1.15rem;
    letter-spacing: 0.2em;
}

.pin-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.25rem;
}

.pin-link {
    margin-right: auto;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--cyan);
    font-size: 0.75rem;
    cursor: pointer;
}

.pin-link:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.pin-actions button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.info-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
}

.empty-state {
    color: var(--muted);
    font-size: 0.88rem;
    text-align: center;
    padding: 2.5rem 1.5rem;
}

/* ── Form ─────────────────────────────────────────────────── */
.form-grid {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    max-width: 460px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.1rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.field-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
}

.field-input {
    background: var(--midnight);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.65rem 0.75rem;
    font-size: 0.88rem;
    color: var(--white);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field-input:focus {
    outline: none;
    border-color: var(--cyan);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
}

.field-error {
    font-size: 0.75rem;
    color: #fb7185;
}

.field-hint {
    font-size: 0.75rem;
    color: var(--muted);
    line-height: 1.55;
}

.btn-primary,
.btn-primary-sm {
    background: var(--cyan);
    color: var(--midnight);
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.btn-primary {
    padding: 0.7rem 1.25rem;
    font-size: 0.88rem;
    align-self: flex-start;
}

.btn-primary-sm {
    padding: 0.5rem 1rem;
    font-size: 0.82rem;
    white-space: nowrap;
}

.btn-primary:hover,
.btn-primary-sm:hover {
    opacity: 0.88;
}

.btn-primary:active,
.btn-primary-sm:active {
    transform: scale(0.98);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.expand-enter-active,
.expand-leave-active {
    transition: opacity 0.15s ease;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
}

/* ── List ─────────────────────────────────────────────────── */
.accounts-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.account-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    transition: border-color 0.15s ease;
}

.account-card-primary {
    border-color: rgba(0, 212, 255, 0.4);
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.06), rgba(0, 212, 255, 0.02));
}

.account-bank-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
    flex-wrap: wrap;
}

.account-bank {
    font-size: 0.95rem;
}

.primary-badge {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.15rem 0.55rem;
    border-radius: 100px;
    background: rgba(0, 212, 255, 0.15);
    color: var(--cyan);
}

/* ── Status pill + info tooltip ──────────────────────────── */
.status-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    position: relative;
}

.status-pill {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.15rem 0.55rem;
    border-radius: 100px;
    line-height: 1.4;
}

.status-verified {
    background: rgba(52, 211, 153, 0.12);
    color: #34d399;
}

.status-unverified {
    background: rgba(156, 163, 175, 0.15);
    color: var(--muted);
}

.status-failed {
    background: rgba(251, 113, 133, 0.12);
    color: #fb7185;
}

.info-btn {
    position: relative;
    width: 16px;
    height: 16px;
    line-height: 16px;
    padding: 0;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-size: 0.62rem;
    font-style: italic;
    font-weight: 700;
    font-family: Georgia, serif;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.15s ease, color 0.15s ease;
}

.info-btn:hover,
.info-btn:focus-visible {
    border-color: var(--cyan);
    color: var(--cyan);
}

.info-btn-danger:hover,
.info-btn-danger:focus-visible {
    border-color: #fb7185;
    color: #fb7185;
}

.tooltip {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 8px);
    transform: translateX(-50%) translateY(4px);
    width: max-content;
    max-width: 360px;
    background: var(--midnight);
    border: 1px solid var(--border);
    color: var(--white);
    font-size: 0.72rem;
    font-weight: 400;
    font-style: normal;
    font-family: inherit;
    line-height: 1.5;
    padding: 0.55rem 0.7rem;
    border-radius: 8px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
    text-align: left;
    z-index: 20;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
    pointer-events: none;
}

.info-btn:hover .tooltip,
.info-btn:focus-visible .tooltip,
.tooltip-open {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateX(-50%) translateY(0) !important;
}

.account-number {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
}

.account-holder {
    font-size: 0.8rem;
    color: var(--muted);
}

.account-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
}

.btn-outline-sm,
.btn-danger-sm {
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.4rem 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.btn-outline-sm {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--white);
}

.btn-outline-sm:hover {
    border-color: var(--cyan);
    color: var(--cyan);
}

.btn-danger-sm {
    background: rgba(251, 113, 133, 0.1);
    border: 1px solid rgba(251, 113, 133, 0.3);
    color: #fb7185;
}

.btn-danger-sm:hover {
    background: rgba(251, 113, 133, 0.18);
}

.mono {
    font-family: var(--font-mono);
}

@media (max-width: 640px) {
    .form-row {
        grid-template-columns: 1fr;
    }

    .account-card {
        flex-direction: column;
        align-items: flex-start;
    }

    .account-actions {
        width: 100%;
    }

    .btn-outline-sm,
    .btn-danger-sm {
        flex: 1;
        text-align: center;
    }

    .tooltip {
        left: 0;
        transform: translateX(0) translateY(4px);
    }

    .tooltip-open,
    .info-btn:focus-visible .tooltip {
        transform: translateX(0) translateY(0) !important;
    }
}
</style>