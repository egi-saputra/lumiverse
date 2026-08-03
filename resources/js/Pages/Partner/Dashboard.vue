<script setup>
import { Head, Link } from '@inertiajs/vue3'
import PartnerLayout from '@/Layouts/PartnerLayout.vue'
import { computed, ref } from 'vue'

const props = defineProps({
    partner: Object,
    recent_payouts: Array,
})

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID')

const greeting = computed(() => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat pagi'
    if (h < 15) return 'Selamat siang'
    if (h < 19) return 'Selamat sore'
    return 'Selamat malam'
})

const copied = ref(false)

async function copyReferralCode() {
    try {
        await navigator.clipboard.writeText(props.partner.referral_code)
        copied.value = true
        setTimeout(() => (copied.value = false), 1800)
    } catch {
        // Clipboard API tidak tersedia (mis. konteks non-HTTPS) — abaikan diam-diam.
    }
}

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
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    })
}
</script>

<template>

    <Head title="Dashboard Partner" />

    <PartnerLayout>
        <template #header>
            <h1 class="topbar-title">Partner Dashboard</h1>
        </template>

        <div class="header-row mb-gap">
            <div>
                <p class="greeting-eyebrow">{{ greeting }}</p>
                <h1 class="welcome-title">Halo, {{ partner.name }} <span class="wave">👋</span></h1>
            </div>
        </div>

        <div class="cards-grid-3 mb-gap">
            <!-- Kode referral -->
            <div class="info-card card-glow">
                <div class="card-glow-bg" aria-hidden="true"></div>
                <div class="card-head">
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.5 12a3.5 3.5 0 1 0-3.1-1.86M8.5 12a3.5 3.5 0 1 1 3.1 5.14M8.5 12l7-4M11.6 17.14l4.9 2.72M15.5 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 13a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="info-card-label">Kode Referral Kamu</div>
                </div>

                <button type="button" class="referral-code-value" @click="copyReferralCode">
                    {{ partner.referral_code }}
                    <span class="copy-icon" :class="{ 'copy-icon-done': copied }">
                        <svg v-if="!copied" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.6" />
                            <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="1.6"
                                stroke-linecap="round" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </span>
                </button>
                <p class="referral-hint">
                    <Transition name="fade" mode="out-in">
                        <span v-if="copied" key="copied" class="copied-text">Kode disalin ke clipboard ✓</span>
                        <span v-else key="hint">Bagikan kode ini ke sekolah / lembaga yang ingin mendaftar
                            Lumiverse.</span>
                    </Transition>
                </p>
            </div>

            <!-- Saldo komisi -->
            <div class="info-card card-glow">
                <div class="card-glow-bg" aria-hidden="true"></div>
                <div class="card-head">
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2H5a2 2 0 0 0 0 4h14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                                stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            <circle cx="16.5" cy="13" r="1.15" fill="currentColor" />
                        </svg>
                    </div>
                    <div class="info-card-label">Saldo Komisi</div>
                </div>
                <div class="stat-value">{{ rupiah(partner.referral_credit_balance) }}</div>
                <Link :href="route('partner.payout.index')" class="btn-payout">
                    Tarik Saldo
                    <span class="arrow">→</span>
                </Link>
            </div>

            <!-- Total referral -->
            <div class="info-card">
                <div class="card-head">
                    <div class="card-icon card-icon-muted">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16 11a4 4 0 1 0-3.2-6.4M16 11a4 4 0 1 1-3.2-6.4M16 11c2.5 0 5 1.4 5 4v2M2 17v-2c0-2.6 2.5-4 5-4s5 1.4 5 4v2"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="info-card-label">Total Referral Berhasil</div>
                </div>
                <div class="stat-value">{{ partner.referred_tenants_count }}</div>
                <p class="referral-hint">Lembaga yang berhasil bergabung lewat kode kamu.</p>
            </div>
        </div>

        <div class="section-head">
            <div class="section-title">Riwayat Penarikan</div>
            <Link :href="route('partner.payout.index')" class="see-all-link">Lihat semua</Link>
        </div>

        <div class="info-card payout-card">
            <div v-if="!recent_payouts.length" class="empty-hint-block">
                <p class="empty-hint">Belum ada riwayat penarikan dana.</p>
                <Link :href="route('partner.payout.index')" class="see-all-link">Tarik saldo sekarang →</Link>
            </div>

            <div v-else class="mini-timeline">
                <div v-for="(p, i) in recent_payouts" :key="p.id" class="mini-item" :style="{ '--i': i }"
                    :class="statusMeta(p.status).class">
                    <span class="mini-dot" :class="{ 'mini-pulse': p.status === 'processing' }"></span>

                    <div class="mini-body">
                        <div class="mini-row">
                            <strong class="mini-amount">{{ rupiah(p.amount) }}</strong>
                            <span class="status-pill" :class="statusMeta(p.status).class">
                                {{ statusMeta(p.status).label }}
                            </span>
                        </div>
                        <p class="mini-date">{{ formatDate(p.requested_at) }}</p>
                        <p v-if="p.failure_reason" class="mini-error">{{ p.failure_reason }}</p>
                    </div>
                </div>
            </div>
        </div>
    </PartnerLayout>
</template>

<style scoped>
.header-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex-wrap: wrap;
}

.greeting-eyebrow {
    font-size: 0.8rem;
    color: var(--muted);
    margin: 0 0 0.15rem;
}

.welcome-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.35rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.wave {
    display: inline-block;
    animation: wave 2.4s ease-in-out infinite;
    transform-origin: 70% 70%;
}

@keyframes wave {

    0%,
    60%,
    100% {
        transform: rotate(0deg);
    }

    10% {
        transform: rotate(16deg);
    }

    20% {
        transform: rotate(-8deg);
    }

    30% {
        transform: rotate(16deg);
    }

    40% {
        transform: rotate(-4deg);
    }
}

.mb-gap {
    margin-bottom: 1.5rem;
}

.cards-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
}

.info-card {
    position: relative;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    transition: border-color 0.2s ease, transform 0.2s ease;
}

.card-glow {
    overflow: hidden;
    isolation: isolate;
}

.card-glow-bg {
    position: absolute;
    inset: -60% -30% auto -30%;
    height: 180px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.16), transparent 65%);
    filter: blur(18px);
    z-index: -1;
    animation: drift 12s ease-in-out infinite alternate;
}

@keyframes drift {
    from {
        transform: translate(-6%, -4%) scale(1);
    }

    to {
        transform: translate(6%, 4%) scale(1.1);
    }
}

.card-head {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.9rem;
}

.card-icon {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    background: rgba(0, 212, 255, 0.12);
    color: var(--cyan);
}

.card-icon svg {
    width: 16px;
    height: 16px;
}

.card-icon-muted {
    background: rgba(156, 163, 175, 0.12);
    color: var(--muted);
}

.info-card-label {
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    font-weight: 600;
}

.referral-code-value {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    font-family: var(--font-mono);
    font-size: 1.45rem;
    font-weight: 800;
    color: var(--cyan);
    letter-spacing: 0.05em;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: opacity 0.15s ease;
}

.referral-code-value:hover {
    opacity: 0.85;
}

.referral-code-value:active {
    transform: scale(0.98);
}

.copy-icon {
    display: inline-flex;
    color: var(--muted);
    transition: color 0.15s ease;
}

.copy-icon svg {
    width: 15px;
    height: 15px;
}

.copy-icon-done {
    color: #34d399;
}

.referral-hint {
    font-size: 0.78rem;
    color: var(--muted);
    margin-top: 0.6rem;
    min-height: 1.1em;
}

.copied-text {
    color: #34d399;
    font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.stat-value {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.6rem;
    color: var(--white);
}

/* ── Tombol Tarik Saldo ───────────────────────────────────── */
.btn-payout {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.85rem;
    background: var(--cyan);
    color: var(--midnight);
    font-weight: 700;
    font-size: 0.82rem;
    border: none;
    border-radius: 8px;
    padding: 0.55rem 1rem;
    text-decoration: none;
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.btn-payout:hover {
    opacity: 0.9;
}

.btn-payout:active {
    transform: scale(0.97);
}

.btn-payout .arrow {
    transition: transform 0.15s ease;
}

.btn-payout:hover .arrow {
    transform: translateX(3px);
}

/* ── Section head ─────────────────────────────────────────── */
.section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
}

.section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--muted);
    font-weight: 700;
}

.see-all-link {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--cyan);
    text-decoration: none;
}

.see-all-link:hover {
    text-decoration: underline;
}

/* ── Riwayat penarikan (mini timeline) ────────────────────── */
.payout-card {
    padding: 1.1rem 1.5rem;
}

.empty-hint-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.5rem 0;
}

.empty-hint {
    color: var(--muted);
    font-size: 0.85rem;
    margin: 0;
}

.mini-timeline {
    display: flex;
    flex-direction: column;
}

.mini-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    padding: 0.85rem 0;
    opacity: 0;
    animation: rise 0.35s ease forwards;
    animation-delay: calc(var(--i) * 60ms);
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.mini-item:not(:last-child) {
    border-bottom: 1px solid var(--border);
}

.mini-dot {
    margin-top: 0.35rem;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--muted);
    position: relative;
}

.mini-item.st-completed .mini-dot {
    background: #34d399;
}

.mini-item.st-failed .mini-dot {
    background: #fb7185;
}

.mini-item.st-processing .mini-dot,
.mini-item.st-pending .mini-dot {
    background: #fbbf24;
}

.mini-pulse::before {
    content: '';
    position: absolute;
    inset: -4px;
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

.mini-body {
    flex: 1;
    min-width: 0;
}

.mini-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.mini-amount {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--white);
}

.mini-date {
    font-size: 0.75rem;
    color: var(--muted);
    margin: 0.15rem 0 0;
}

.mini-error {
    font-size: 0.75rem;
    color: #fb7185;
    margin: 0.3rem 0 0;
}

.status-pill {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
    white-space: nowrap;
    flex-shrink: 0;
}

.status-pill.st-pending,
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

@media (max-width: 720px) {
    .cards-grid-3 {
        grid-template-columns: 1fr;
    }

    .mini-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.3rem;
    }
}

@media (prefers-reduced-motion: reduce) {

    .card-glow-bg,
    .wave,
    .mini-item,
    .mini-pulse::before {
        animation: none !important;
    }

    .mini-item {
        opacity: 1;
    }
}
</style>