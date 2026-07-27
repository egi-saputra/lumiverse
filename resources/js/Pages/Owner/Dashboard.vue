<script setup>
import { Head, Link, usePage, router } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import SubscriptionInvoiceModal from '@/Components/SubscriptionInvoiceModal.vue'
import OwnerLayout from '@/Layouts/OwnerLayout.vue'
import QRCode from 'qrcode'

const props = defineProps({
    owner: Object,
    tenant: Object,
    pendingOrderId: String,
})

const page = usePage()

const tenantName = computed(() => page.props.tenant?.name ?? 'Lumi Platforms, Inc')

// ─── Plan Badge Visibility ────────────────────────────────────────────────────
// Badge upgrade cuma tampil kalau plan tergolong free: plan_key kosong/null,
// 'trial', atau 'free'. Selain itu (paket berbayar) badge disembunyikan total.
const isFreePlan = computed(() => {
    const key = props.tenant.plan_key
    return !key || key === 'trial' || key === 'free'
})

// ─── Utilities ────────────────────────────────────────────────────────────────
function isIpOrLocalhost(hostname) {
    return hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
}

const centralDomain = computed(() => {
    const hostname = window.location.hostname
    const port = window.location.port ? `:${window.location.port}` : ''
    if (isIpOrLocalhost(hostname)) return `${hostname}${port}`
    return page.props.centralDomain ?? hostname
})

const tenantAppUrl = computed(() => {
    if (!props.tenant.subdomain) return null
    const protocol = window.location.protocol
    const port = window.location.port ? `:${window.location.port}` : ''
    const hostname = window.location.hostname
    if (isIpOrLocalhost(hostname)) {
        return `${protocol}//${props.tenant.subdomain}.localhost${port}/`
    }
    const base = page.props.centralDomain ?? hostname
    return `${protocol}//${props.tenant.subdomain}.${base}${port}/`
})

const statusClass = computed(() => {
    if (props.tenant.status === 'Aktif') return 'status-active'
    if (props.tenant.status === 'Expired') return 'status-expired'
    return 'status-disabled'
})

const expiresAtFormatted = computed(() => {
    if (!props.tenant.expires_at) return '-'
    const d = new Date(props.tenant.expires_at)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
})

// ─── Label & teks statis (tanpa kondisional workspace) ─────────────────────────
const welcomeSub = 'Kelola data informasi sekolah / lembaga pendidikan-mu dengan mudah dan cepat di sini!'
const idRowLabel = 'ID Lembaga / Institusi'
const appCardLabel = 'Aplikasi LMS / Digitalisasi Sekolah'
const appCardDesc = 'Masuk ke aplikasi LMS untuk mengelola data guru, kelas, siswa, materi, tugas, ujian dan administrasi lainnya pada satuan pendidikan yang Anda kelola.'
const appLinkLabel = 'Masuk ke LMS →'
const appUrlRowLabel = 'URL LMS'

// ─── Modal bayar tagihan pending ────────────────────────────────────────────
const showPayModal = ref(false)
const payModalCalc = ref(null)
const payModalLoading = ref(false)
const paySubmitting = ref(false)

function csrfToken() {
    return page.props.csrf_token
        ?? document.querySelector('meta[name="csrf-token"]')?.content
        ?? ''
}

async function openPayModal() {
    if (!props.pendingOrderId) return
    payModalCalc.value = null
    payModalLoading.value = true
    showPayModal.value = true
    try {
        const res = await fetch(route('owner.subscription.order-preview', props.pendingOrderId), {
            headers: { 'Accept': 'application/json' },
        })
        payModalCalc.value = await res.json()
    } catch (e) {
        payModalCalc.value = null
    } finally {
        payModalLoading.value = false
    }
}

function closePayModal() {
    showPayModal.value = false
    payModalCalc.value = null
}

async function confirmPay() {
    if (!props.pendingOrderId || paySubmitting.value) return
    paySubmitting.value = true
    try {
        const res = await fetch(route('owner.subscription.retry', props.pendingOrderId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken(),
                'Accept': 'application/json',
            },
        })
        const data = await res.json()

        if (data.action === 'already_paid') {
            closePayModal()
            router.reload()
            return
        }
        if (data.action === 'failed') {
            closePayModal()
            alert('Transaksi ini sudah kedaluwarsa/dibatalkan.')
            router.reload()
            return
        }
        if (data.action === 'pay' && data.snap_token) {
            const orderId = props.pendingOrderId
            closePayModal()
            window.snap.pay(data.snap_token, {
                onSuccess: () => { window.location.href = route('owner.subscription.finish') + '?order_id=' + orderId },
                onPending: () => router.reload(),
                onError: () => alert('Pembayaran gagal. Silakan coba lagi.'),
                onClose: () => { window.location.href = route('owner.subscription.finish') + '?order_id=' + orderId },
            })
        }
    } catch (e) {
        alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
        paySubmitting.value = false
    }
}

// ─── Share QR Code ID lembaga via WhatsApp ─────────────────────────────────
const sharingBarcode = ref(false)

async function shareBarcode() {
    if (sharingBarcode.value) return
    sharingBarcode.value = true

    let canvas
    try {
        canvas = await generateQrCanvas()
    } catch (e) {
        alert('Gagal membuat QR code. Pastikan kode ID lembaga valid.')
        sharingBarcode.value = false
        return
    }

    canvas.toBlob(async (blob) => {
        sharingBarcode.value = false
        if (!blob) return

        const file = new File([blob], `qr-${props.tenant.code}.png`, { type: 'image/png' })
        const shareText = `QR Code ID Lembaga ${props.tenant.name} (${props.tenant.code})`

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file] })
            } catch (e) {
                // dibatalkan user, diamkan
            }
            return
        }

        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `qr-${props.tenant.code}.png`
        link.click()
        URL.revokeObjectURL(link.href)

        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
    }, 'image/png')
}

async function generateQrCanvas() {
    // Faktor skala biar hasil PNG tajam (retina-quality), bukan blur
    const scale = 3

    // 1. Generate QR code langsung di resolusi tinggi
    const qrSize = 260
    const qrCanvas = document.createElement('canvas')
    await QRCode.toCanvas(qrCanvas, tenantAppUrl.value ?? props.tenant.code, {
        width: qrSize * scale,
        margin: 0,
        color: {
            dark: '#0a0f1e',
            light: '#ffffff',
        },
    })

    // 2. Ukuran logis kartu
    const padding = 32
    const qrBoxPadding = 20
    const cardWidth = qrSize + padding * 2
    const headerHeight = 90
    const footerHeight = 70
    const qrBoxSize = qrSize + qrBoxPadding * 2
    const cardHeight = headerHeight + qrBoxSize + footerHeight

    // 3. Canvas utama di-scale up, ctx di-scale supaya kode gambar tetap pakai koordinat logis
    const canvas = document.createElement('canvas')
    canvas.width = cardWidth * scale
    canvas.height = cardHeight * scale
    canvas.style.width = `${cardWidth}px`
    canvas.style.height = `${cardHeight}px`

    const ctx = canvas.getContext('2d')
    ctx.scale(scale, scale)

    // 4. Background kartu — persegi penuh, TANPA radius
    const bgGradient = ctx.createLinearGradient(0, 0, 0, cardHeight)
    bgGradient.addColorStop(0, '#0f1730')
    bgGradient.addColorStop(1, '#0a0f1e')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, cardWidth, cardHeight)

    // 5. Border tipis cyan — persegi penuh
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, cardWidth - 2, cardHeight - 2)

    // 6. Header: nama tenant
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    wrapText(ctx, props.tenant.name, cardWidth / 2, 38, cardWidth - padding * 2, 24)

    ctx.fillStyle = '#00d4ff'
    ctx.font = '600 12px Arial, sans-serif'
    ctx.fillText('ID LEMBAGA · ' + props.tenant.code, cardWidth / 2, headerHeight - 14)

    // 7. Kotak putih pembungkus QR — persegi penuh, TANPA radius
    const qrBoxX = (cardWidth - qrBoxSize) / 2
    const qrBoxY = headerHeight
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize)

    // 8. Tempel QR code ke tengah kotak putih
    ctx.drawImage(qrCanvas, qrBoxX + qrBoxPadding, qrBoxY + qrBoxPadding, qrSize, qrSize)

    // 9. Footer: teks "Scan Here"
    const footerY = qrBoxY + qrBoxSize + 32
    ctx.fillStyle = '#00d4ff'
    ctx.font = 'bold 16px Arial, sans-serif'
    ctx.fillText('SCAN DI SINI', cardWidth / 2, footerY)

    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '11px Arial, sans-serif'
    ctx.fillText('untuk membuka aplikasi lembaga', cardWidth / 2, footerY + 18)

    return canvas
}

// ─── Helper: wrap teks panjang jadi beberapa baris ──────────────────────────
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ')
    let line = ''
    let lines = []
    for (const word of words) {
        const testLine = line + word + ' '
        if (ctx.measureText(testLine).width > maxWidth && line !== '') {
            lines.push(line.trim())
            line = word + ' '
        } else {
            line = testLine
        }
    }
    lines.push(line.trim())

    // kalau kepanjangan (>2 baris), potong biar gak numpuk
    if (lines.length > 2) lines = [lines[0], lines[1].slice(0, -1) + '…']

    const startY = y - (lines.length - 1) * (lineHeight / 2)
    lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight))
}
</script>

<template>

    <Head title="Dashboard" />

    <OwnerLayout>

        <template #header>
            <h1 class="topbar-title">{{ tenantName }}</h1>
        </template>

        <div class="flex sm:flex-row flex-col sm:mb-3 mb-6 w-full justify-between items-start">

            <div>
                <div class="header-row">
                    <h1 class="welcome-title">Welcome Back, {{ owner.name }} 👋</h1>
                </div>
                <p class="welcome-sub mb-gap sm:flex hidden">{{ welcomeSub }}</p>
            </div>

            <!-- Badge — cuma muncul kalau plan free -->
            <div v-if="isFreePlan" class="flex justify-end sm:w-auto w-full sm:mr-10 mr-0">
                <Link :href="route('owner.pricing')" class="upgrade-badge" prefetch>
                    <svg class="upgrade-badge-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                        viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
                    </svg>
                    <span class="upgrade-badge-text">Upgrade ke Premium</span>
                </Link>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
                 Baris 1: Status Langganan + Akses Aplikasi
            ════════════════════════════════════════════════════════════════ -->
        <div class="cards-grid-2 mb-gap">

            <!-- Card Status Langganan — read-only -->
            <div class="info-card">
                <div class="info-card-header">
                    <span class="info-card-label">Status <span class="sm:inline-flex hidden">Penggunaan
                            Aplikasi</span></span>
                    <span class="status-pill" :class="statusClass">{{ tenant.status }}</span>
                </div>

                <div class="info-card-title">{{ tenant.name }}</div>

                <div class="info-card-row">
                    <span>{{ idRowLabel }}</span>
                    <span class="id-with-share">
                        <strong class="mono">{{ tenant.code }}</strong>
                        <button type="button" class="share-icon-btn" :disabled="sharingBarcode"
                            title="Bagikan barcode via WhatsApp" @click="shareBarcode">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <circle cx="18" cy="5" r="3" />
                                <circle cx="6" cy="12" r="3" />
                                <circle cx="18" cy="19" r="3" />
                                <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
                                <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
                            </svg>
                        </button>
                    </span>
                </div>
                <div class="info-card-row">
                    <span>Jumlah Pengguna</span>
                    <strong>
                        {{ tenant.user_count }} / {{ tenant.max_users ?? '∞' }}
                    </strong>
                </div>

                <div class="info-card-row">
                    <span>Paket Yang Digunakan</span>
                    <strong class="capitalize">{{ tenant.plan ?? 'Free' }}</strong>
                </div>

                <div class="info-card-row" v-if="tenant.days_left !== null">
                    <span>Sisa Masa Aktif</span>
                    <span class="days-left-value">
                        <button v-if="pendingOrderId" class="btn-pay-mini" @click="openPayModal">
                            💳 Bayar Untuk Perpanjang
                        </button>
                        <strong :class="tenant.days_left <= 7 ? 'text-warn' : ''">
                            {{ tenant.days_left >= 0 ? `${tenant.days_left} hari` : 'Expired' }}
                        </strong>
                    </span>
                </div>

                <div class="info-card-row" v-if="tenant.expires_at">
                    <span>Masa Berlaku Hingga</span>
                    <strong>{{ expiresAtFormatted }}</strong>
                </div>
            </div>

            <!-- Card Aplikasi — read-only -->
            <div class="info-card info-card-highlight">
                <div class="info-card-label">{{ appCardLabel }}</div>
                <p class="lms-desc">{{ appCardDesc }}</p>
                <a v-if="tenantAppUrl" :href="tenantAppUrl" target="_blank" class="btn-hero lms-link">
                    {{ appLinkLabel }}
                </a>
                <p class="subdomain-hint">{{ tenant.subdomain }}.{{ centralDomain }}</p>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
                 Baris 2: Info Teknis (read-only)
            ════════════════════════════════════════════════════════════════ -->
        <div class="section-title">Info Teknis Lainnya</div>
        <div class="info-card">
            <div class="two-col-grid">
                <div class="info-card-row">
                    <span>ID Database</span>
                    <strong class="mono">{{ tenant.subdomain }} ({{ tenant.code }})</strong>
                </div>
                <div class="info-card-row">
                    <span>{{ appUrlRowLabel }}</span>
                    <a v-if="tenantAppUrl" :href="tenantAppUrl" target="_blank" class="link-cyan mono">
                        {{ tenant.subdomain }}.{{ centralDomain }}
                    </a>
                </div>
            </div>
        </div>

        <SubscriptionInvoiceModal :show="showPayModal" :loading="payModalLoading" :submitting="paySubmitting"
            :calc="payModalCalc" :plan-name="payModalCalc?.plan_name" :accent-color="payModalCalc?.plan_accent"
            @close="closePayModal" @confirm="confirmPay" />

    </OwnerLayout>
</template>

<style scoped>
/* ── Header row & welcome ─────────────────────────────────────────────────── */
.header-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex-wrap: wrap;
}

.welcome-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.3rem;
    margin: 0;
}

.welcome-sub {
    color: var(--muted);
    font-size: 0.92rem;
}

/* ── Upgrade badge ─────────────────────────────────────────────────────────── */
.upgrade-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    font-weight: 700;
    padding: 0.45rem 0.9rem;
    border-radius: 100px;
    margin-top: 1rem;
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.16), rgba(245, 166, 35, 0.08));
    color: var(--gold);
    text-decoration: none;
    white-space: nowrap;
    border: 1px solid rgba(245, 166, 35, 0.35);
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
    position: relative;
    overflow: hidden;
}

.upgrade-badge-icon {
    flex-shrink: 0;
}

.upgrade-badge::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(245, 166, 35, 0.18), transparent);
    transform: skewX(-20deg);
    animation: badge-shimmer 8s ease-in-out infinite;
}

@keyframes badge-shimmer {

    0%,
    15% {
        left: -60%;
    }

    40%,
    100% {
        left: 140%;
    }
}

.upgrade-badge:hover {
    border-color: rgba(245, 166, 35, 0.6);
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.22), rgba(245, 166, 35, 0.1));
    transform: translateY(-1px);
}

/* ── Layout helpers ────────────────────────────────────────────────────────── */
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

.cards-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
}

.two-col-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
}

/* ── Info card ─────────────────────────────────────────────────────────────── */
.info-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
}

.info-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.info-card-label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    font-weight: 600;
}

.info-card-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.15rem;
    margin-bottom: 1rem;
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

.id-with-share {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}

.share-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    /* border-radius: 2px; */
    /* border: 1px solid var(--border); */
    /* background: rgba(255, 255, 255, 0.03); */
    color: var(--muted);
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    transition: color 0.2s, border-color 0.2s;
}

.share-icon-btn:hover:not(:disabled) {
    color: var(--cyan);
    border-color: var(--cyan);
}

.share-icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ── Status pills ──────────────────────────────────────────────────────────── */
.status-pill {
    display: inline-block;
    font-size: 0.74rem;
    font-weight: 700;
    padding: 0.25rem 0.7rem;
    border-radius: 100px;
}

.status-active {
    background: rgba(52, 211, 153, 0.12);
    color: #34d399;
}

.status-expired {
    background: rgba(245, 166, 35, 0.12);
    color: var(--gold);
}

.status-disabled {
    background: rgba(251, 113, 133, 0.12);
    color: #fb7185;
}

.text-warn {
    color: var(--gold);
}

/* ── App card ──────────────────────────────────────────────────────────────── */
.info-card-highlight {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.06), rgba(0, 212, 255, 0.02));
    border-color: rgba(0, 212, 255, 0.25);
    display: flex;
    flex-direction: column;
}

.lms-desc {
    font-size: 0.88rem;
    color: var(--muted);
    margin: 0.75rem 0 1.25rem;
    flex: 1;
}

.lms-link {
    width: 100%;
    justify-content: center;
}

.subdomain-hint {
    margin-top: 0.75rem;
    font-size: 0.76rem;
    color: var(--muted);
    font-family: var(--font-mono);
    text-align: center;
}

/* ── Misc ──────────────────────────────────────────────────────────────────── */
.mono {
    font-family: var(--font-mono);
    font-size: 0.84rem;
}

.capitalize {
    text-transform: capitalize;
}

.link-cyan {
    color: var(--cyan);
    text-decoration: none;
    font-size: 0.84rem;
}

.link-cyan:hover {
    text-decoration: underline;
}

.days-left-value {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-pay-mini {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.2rem 0.55rem;
    border-radius: 100px;
    border: none;
    background: var(--gold);
    color: #1c0f00;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.2s;
}

.btn-pay-mini:hover {
    opacity: 0.85;
}

/* ── Responsive ────────────────────────────────────────────────────────────── */
@media (max-width: 720px) {
    .cards-grid-2 {
        grid-template-columns: 1fr;
    }

    .two-col-grid {
        grid-template-columns: 1fr;
    }
}
</style>