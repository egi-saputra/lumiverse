<script setup>
import { Head, useForm, usePage } from '@inertiajs/vue3'
import PartnerLayout from '@/Layouts/PartnerLayout.vue'
import { computed, ref } from 'vue'
import axios from 'axios'
import { ensureDeviceRegistered, getOrCreateDeviceUuid } from '@/Utils/device'

const props = defineProps({
    payouts: Array,
    balance: Number,
    min_amount: Number,
})

const form = useForm({ amount: props.min_amount })
const page = usePage()
const showPinForm = ref(false)
const pinMode = ref('verify')
const pin = ref('')
const currentPassword = ref('')
const pinError = ref('')
const pinProcessing = ref(false)

// Angka cepat yang bisa dipilih tanpa ngetik manual.
const quickAmounts = computed(() => {
    const opts = [props.min_amount, props.min_amount * 2, props.min_amount * 5]
        .filter(v => v <= props.balance)

    // "Semua saldo" hanya muncul kalau saldo di atas minimum.
    if (props.balance >= props.min_amount && !opts.includes(props.balance)) {
        opts.push(props.balance)
    }
    return [...new Set(opts)]
})

function pickAmount(value) {
    form.amount = value
}

function submitPayout() {
    pinMode.value = 'verify'
    pin.value = ''
    currentPassword.value = ''
    pinError.value = ''
    showPinForm.value = true
}

async function confirmPin() {
    if (pinProcessing.value) return

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

        showPinForm.value = false
        form.post(route('partner.payout.store'), {
            preserveScroll: true,
            headers: {
                'X-Device-Uuid': getOrCreateDeviceUuid(),
                'X-Step-Up-Token': data.step_up_token,
            },
            onSuccess: () => {
                form.reset()
            },
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

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID')

const STATUS_META = {
    pending: { label: 'Menunggu', class: 'st-pending' },
    processing: { label: 'Diproses', class: 'st-processing' },
    completed: { label: 'Berhasil', class: 'st-completed' },
    failed: { label: 'Gagal', class: 'st-failed' },
}

function statusMeta(status) {
    return STATUS_META[status] ?? { label: status, class: 'st-pending' }
}

function formatDate(dt) {
    if (!dt) return ''
    return new Date(dt.replace(' ', 'T')).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}
</script>

<template>

    <Head title="Withdrawn History" />
    <PartnerLayout>
        <template #header>
            <h1 class="topbar-title">Penarikan dana komisi / reward</h1>
        </template>

        <div v-if="page.props.flash?.success" class="flash-banner flash-success mb-gap">
            {{ page.props.flash.success }}
        </div>
        <div v-if="page.props.flash?.error" class="flash-banner flash-error mb-gap">
            {{ page.props.flash.error }}
        </div>

        <div v-if="showPinForm" class="pin-backdrop" @click.self="cancelPin">
            <form class="pin-modal" @submit.prevent="confirmPin">
                <h2 class="pin-title">{{ pinMode === 'setup' ? 'Atur PIN Keamanan' : 'Konfirmasi Keamanan' }}</h2>
                <p class="pin-subtitle">
                    {{ pinMode === 'setup' ? 'Konfirmasi password akun lalu buat PIN 6 digit.' : 'Masukkan PIN 6 digit
                    untuk
                    melanjutkan.' }}
                </p>
                <input v-if="pinMode === 'setup'" v-model="currentPassword" class="field-input" type="password"
                    autocomplete="current-password" placeholder="Password akun" required />
                <input v-model="pin" class="field-input pin-input" type="password" inputmode="numeric" maxlength="6"
                    pattern="[0-9]{6}" autocomplete="one-time-code" placeholder="******"
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
                        {{ pinProcessing ? 'Memeriksa...' : 'Konfirmasi' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- ── Hero: saldo + form penarikan ─────────────────────── -->
        <div class="balance-hero mb-gap">
            <div class="hero-glow" aria-hidden="true"></div>

            <div class="hero-top">
                <div class="wallet-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2H5a2 2 0 0 0 0 4h14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                            stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                        <circle cx="16.5" cy="13" r="1.25" fill="currentColor" />
                    </svg>
                </div>
                <div>
                    <p class="hero-label">Saldo saat ini</p>
                    <p class="hero-amount">{{ rupiah(balance) }}</p>
                </div>
            </div>

            <form @submit.prevent="submitPayout" class="withdraw-form">
                <div class="amount-field">
                    <span class="amount-prefix">Rp</span>
                    <input v-model.number="form.amount" type="number" :min="min_amount" autocomplete="off"
                        inputmode="numeric" class="amount-input" placeholder="0" />
                </div>

                <div v-if="quickAmounts.length" class="quick-chips">
                    <button v-for="qa in quickAmounts" :key="qa" type="button" class="chip"
                        :class="{ 'chip-active': form.amount === qa }" @click="pickAmount(qa)">
                        {{ qa === balance ? 'Semua · ' : '' }}{{ rupiah(qa) }}
                    </button>
                </div>

                <p v-if="form.errors.amount" class="field-error">{{ form.errors.amount }}</p>
                <p class="field-hint">Minimum pencairan {{ rupiah(min_amount) }}.</p>

                <button type="submit" :disabled="form.processing" class="btn-primary">
                    <span v-if="form.processing" class="spinner" aria-hidden="true"></span>
                    {{ form.processing ? 'Memproses…' : 'Tarik Saldo' }}
                </button>
            </form>
        </div>

        <!-- ── Riwayat: timeline ─────────────────────────────────── -->
        <h2 class="section-title">Riwayat Penarikan</h2>

        <div v-if="!payouts.length" class="empty-state">
            Belum ada riwayat penarikan dana.
        </div>

        <div v-else class="timeline">
            <div v-for="(p, i) in payouts" :key="p.id" class="timeline-item" :style="{ '--i': i }"
                :class="statusMeta(p.status).class">
                <div class="timeline-node">
                    <span class="node-dot" :class="{ 'node-pulse': p.status === 'processing' }"></span>
                </div>

                <div class="timeline-card">
                    <div class="timeline-row">
                        <strong class="timeline-amount">{{ rupiah(p.amount) }}</strong>
                        <span class="status-pill" :class="statusMeta(p.status).class">
                            {{ statusMeta(p.status).label }}
                        </span>
                    </div>
                    <p class="timeline-date">{{ formatDate(p.requested_at) }}</p>
                    <p v-if="p.failure_reason" class="field-error">{{ p.failure_reason }}</p>
                </div>
            </div>
        </div>
    </PartnerLayout>
</template>

<style scoped>
.mb-gap {
    margin-bottom: 1.75rem;
}

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
    gap: 0.65rem;
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
    margin: 0 0 0.35rem;
    color: var(--muted);
    font-size: 0.82rem;
}

.field-input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--midnight);
    color: var(--white);
}

.field-input:focus {
    outline: none;
    border-color: var(--cyan);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
}

.pin-input {
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
    margin-top: 0.65rem;
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

.pin-link:disabled,
.pin-actions button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.btn-primary-sm,
.btn-outline-sm {
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    cursor: pointer;
}

.btn-primary-sm {
    border: 0;
    background: var(--cyan);
    color: var(--midnight);
}

.btn-outline-sm {
    border: 1px solid var(--border);
    background: transparent;
    color: var(--white);
}

/* ── Hero card ────────────────────────────────────────────── */
.balance-hero {
    position: relative;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 1.75rem;
    overflow: hidden;
    isolation: isolate;
}

.hero-glow {
    position: absolute;
    inset: -40% -20% auto -20%;
    height: 220px;
    background:
        radial-gradient(circle at 20% 30%, rgba(0, 212, 255, 0.22), transparent 60%),
        radial-gradient(circle at 75% 60%, rgba(0, 212, 255, 0.12), transparent 55%);
    filter: blur(20px);
    z-index: -1;
    animation: drift 14s ease-in-out infinite alternate;
}

@keyframes drift {
    from {
        transform: translate(-4%, -2%) scale(1);
    }

    to {
        transform: translate(4%, 3%) scale(1.08);
    }
}

.hero-top {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-bottom: 1.5rem;
}

.wallet-icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: rgba(0, 212, 255, 0.12);
    color: var(--cyan);
}

.wallet-icon svg {
    width: 22px;
    height: 22px;
}

.hero-label {
    font-size: 0.78rem;
    color: var(--muted);
    margin: 0 0 0.15rem;
}

.hero-amount {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.75rem;
    letter-spacing: -0.01em;
    margin: 0;
    color: var(--white);
}

/* ── Form ─────────────────────────────────────────────────── */
.withdraw-form {
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.amount-field {
    display: flex;
    align-items: center;
    background: var(--midnight);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0 0.85rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.amount-field:focus-within {
    border-color: var(--cyan);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
}

.amount-prefix {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--muted);
    padding-right: 0.5rem;
    border-right: 1px solid var(--border);
    margin-right: 0.65rem;
}

.amount-input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 0.75rem 0;
    font-size: 1.1rem;
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--white);
    min-width: 0;
}

.amount-input:focus {
    outline: none;
}

/* Sembunyikan spin arrow number input biar rapi */
.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.amount-input[type=number] {
    appearance: textfield;
    -moz-appearance: textfield;
}

.quick-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.chip {
    font-size: 0.76rem;
    font-weight: 600;
    padding: 0.4rem 0.75rem;
    border-radius: 100px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.chip:hover {
    border-color: var(--cyan);
    color: var(--cyan);
}

.chip-active {
    background: rgba(0, 212, 255, 0.14);
    border-color: var(--cyan);
    color: var(--cyan);
}

.field-error {
    font-size: 0.78rem;
    color: #fb7185;
    margin: 0;
}

.field-hint {
    font-size: 0.76rem;
    color: var(--muted);
    margin: 0;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--cyan);
    color: var(--midnight);
    font-weight: 700;
    font-size: 0.9rem;
    border: none;
    border-radius: 10px;
    padding: 0.75rem 1.4rem;
    cursor: pointer;
    align-self: flex-start;
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-primary:active {
    transform: scale(0.98);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(11, 22, 38, 0.35);
    border-top-color: var(--midnight);
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Section title ────────────────────────────────────────── */
.section-title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--white);
    margin: 0 0 1rem;
}

.empty-state {
    color: var(--muted);
    font-size: 0.88rem;
    text-align: center;
    padding: 2.5rem 1.5rem;
    background: var(--navy);
    border: 1px dashed var(--border);
    border-radius: 16px;
}

/* ── Timeline ─────────────────────────────────────────────── */
.timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding-left: 0.25rem;
}

.timeline-item {
    position: relative;
    display: flex;
    gap: 1rem;
    opacity: 0;
    animation: rise 0.4s ease forwards;
    animation-delay: calc(var(--i) * 60ms);
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.timeline-item:not(:last-child) .timeline-node::after {
    content: '';
    position: absolute;
    top: 22px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + 0.9rem - 22px);
    background: var(--border);
}

.timeline-node {
    position: relative;
    width: 22px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    padding-top: 1.35rem;
}

.node-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: var(--muted);
    box-shadow: 0 0 0 4px var(--midnight);
}

.timeline-item.st-completed .node-dot {
    background: #34d399;
}

.timeline-item.st-failed .node-dot {
    background: #fb7185;
}

.timeline-item.st-processing .node-dot,
.timeline-item.st-pending .node-dot {
    background: #fbbf24;
}

.node-pulse {
    position: relative;
}

.node-pulse::before {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    background: #fbbf24;
    opacity: 0.4;
    animation: pulse 1.6s ease-out infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.6);
        opacity: 0.5;
    }

    100% {
        transform: scale(1.9);
        opacity: 0;
    }
}

.timeline-card {
    flex: 1;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1rem 1.15rem;
    transition: border-color 0.15s ease, transform 0.15s ease;
}

.timeline-card:hover {
    border-color: rgba(0, 212, 255, 0.35);
    transform: translateY(-1px);
}

.timeline-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.3rem;
}

.timeline-amount {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    color: var(--white);
}

.timeline-date {
    font-size: 0.76rem;
    color: var(--muted);
    margin: 0;
}

.status-pill {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
    white-space: nowrap;
}

.status-pill.st-pending {
    background: rgba(251, 191, 36, 0.12);
    color: #fbbf24;
}

.status-pill.st-processing {
    background: rgba(251, 191, 36, 0.12);
    color: #fbbf24;
}

.status-pill.st-completed {
    background: rgba(52, 211, 153, 0.12);
    color: #34d399;
}

.status-pill.st-failed {
    background: rgba(251, 113, 133, 0.12);
    color: #fb7185;
}

@media (max-width: 560px) {
    .hero-amount {
        font-size: 1.45rem;
    }

    .timeline-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.35rem;
    }
}

@media (prefers-reduced-motion: reduce) {

    .hero-glow,
    .timeline-item,
    .spinner,
    .node-pulse::before {
        animation: none !important;
    }

    .timeline-item {
        opacity: 1;
    }
}
</style>