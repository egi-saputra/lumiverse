<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const plans = [
    {
        tier: 'Starter Pack',
        tierKey: 'dasar',
        name: 'Learning',
        desc: 'Untuk sekolah kecil yang baru memulai perjalanan digitalisasi.',
        price: 'Rp 199K',
        period: '/bln',
        priceNote: 'atau Rp 1,9 juta/tahun (hemat 20%)',
        popular: false,
        accentVar: '--color-learning',
        features: [
            { included: true, text: '100+ User Account' },
            // { included: true, text: '5 akun guru' },
            { included: true, text: 'Modul & materi belajar' },
            { included: true, text: 'Ujian online dasar' },
            { included: true, text: '5 GB penyimpanan' },
            { included: false, text: 'Rapor digital' },
            { included: false, text: 'Notifikasi WhatsApp' },
            { included: false, text: 'Akses API' },
        ],
        btnClass: 'btn-learning',
        btnText: 'Coba Gratis Sekarang',
        btnHref: '/registration',
    },
    {
        tier: 'Modular',
        tierKey: 'popular',
        name: 'Understanding',
        desc: 'Untuk sekolah menengah dengan kebutuhan yang lebih lengkap.',
        price: 'Rp 599K',
        period: '/bln',
        priceNote: 'atau Rp 3,8 juta/tahun (hemat 20%)',
        popular: true,
        accentVar: '--color-understanding',
        features: [
            { included: true, text: '300+ User Account' },
            // { included: true, text: '20 akun guru' },
            { included: true, text: 'Semua fitur Learning' },
            { included: true, text: 'Rapor digital' },
            { included: true, text: '25 GB penyimpanan' },
            { included: true, text: 'Notifikasi WhatsApp' },
            { included: false, text: 'Analitik lanjutan' },
            { included: false, text: 'Akses API' },
        ],
        btnClass: 'btn-understanding',
        btnText: 'Coba Gratis Sekarang',
        btnHref: '/registration',
    },
    {
        tier: 'Enterprise',
        tierKey: 'unggulan',
        name: 'Mastering',
        desc: 'Pilihan terbaik untuk sekolah aktif dengan ekosistem digital penuh.',
        price: 'Rp 899K',
        period: '/bln',
        priceNote: 'atau Rp 6,7 juta/tahun (hemat 20%)',
        popular: false,
        accentVar: '--color-mastering',
        features: [
            { included: true, text: '500+ Pengguna / Anggota' },
            // { included: true, text: 'Guru tidak terbatas' },
            { included: true, text: 'Semua fitur Understanding' },
            { included: true, text: 'Absensi digital' },
            { included: true, text: 'Analitik lanjutan' },
            { included: true, text: '100 GB penyimpanan' },
            { included: true, text: 'Akses REST API' },
            { included: false, text: 'White-label & custom domain' },
        ],
        btnClass: 'btn-mastering',
        btnText: 'Coba Gratis Sekarang',
        btnHref: '/registration',
    },
    {
        tier: 'Expertise',
        tierKey: 'expertise',
        name: 'Inspiring',
        desc: 'Untuk institusi besar dengan branding sendiri dan integrasi penuh.',
        price: 'Rp 1.299K',
        period: '/bln',
        priceNote: 'atau Rp 11,5 juta/tahun (hemat 20%)',
        popular: false,
        accentVar: '--color-inspiring',
        features: [
            { included: true, text: '800+ User Account' },
            { included: true, text: 'Semua fitur Mastering' },
            { included: true, text: 'White-label & custom domain' },
            { included: true, text: 'Integrasi sistem existing' },
            { included: true, text: '500 GB penyimpanan' },
            { included: true, text: 'SLA 99.9% uptime' },
            { included: true, text: 'Priority support' },
            { included: false, text: 'Dedicated support manager' },
        ],
        btnClass: 'btn-inspiring',
        btnText: 'Coba Gratis Sekarang',
        btnHref: '/registration',
    },
    {
        tier: 'Pro Max',
        tierKey: 'promax',
        name: 'Universe',
        desc: 'Untuk institusi besar dengan branding sendiri dan integrasi penuh.',
        price: 'Rp 1.799K',
        period: '/bln',
        priceNote: 'atau Rp 11,5 juta/tahun (hemat 20%)',
        popular: false,
        accentVar: '--color-inspiring',
        features: [
            { included: true, text: '1000+ User Account' },
            { included: true, text: 'Semua fitur Mastering' },
            { included: true, text: 'White-label & custom domain' },
            { included: true, text: 'Integrasi sistem existing' },
            { included: true, text: '500 GB penyimpanan' },
            { included: true, text: 'SLA 99.9% uptime' },
            { included: true, text: 'Priority support' },
            { included: false, text: 'Dedicated support manager' },
        ],
        btnClass: 'btn-inspiring',
        btnText: 'Coba Gratis Sekarang',
        btnHref: '/registration',
    },
    // {
    //     tier: 'Paket Enterprise',
    //     tierKey: 'promax',
    //     name: 'Custom Yayasan',
    //     desc: 'Untuk yayasan multi-unit dengan kebutuhan custom dan skala enterprise.',
    //     price: 'Custom',
    //     period: '',
    //     priceNote: 'Hubungi kami untuk penawaran khusus',
    //     popular: false,
    //     accentVar: '--color-promax',
    //     features: [
    //         { included: true, text: 'Siswa tidak terbatas' },
    //         { included: true, text: 'Multi-unit sekolah' },
    //         { included: true, text: 'Semua fitur Inspiring' },
    //         { included: true, text: 'Penyimpanan tidak terbatas' },
    //         { included: true, text: 'SLA 99.99% uptime' },
    //         { included: true, text: 'Dedicated support manager' },
    //         { included: true, text: 'Onboarding & pelatihan tim' },
    //         { included: true, text: 'Custom development' },
    //     ],
    //     btnClass: 'btn-promax',
    //     btnText: 'Hubungi Tim Sales',
    //     btnHref: 'mailto:sales@kreaticraft.id',
    // },
]

const track = ref(null)
const spacerStart = ref(null)   // ⬅️ ref baru untuk spacer kiri
const cardRefs = ref([])
const currentIndex = ref(2)
const isDragging = ref(false)
const isMobile = ref(false)
const startX = ref(0)
const scrollStart = ref(0)
const CARD_WIDTH = ref(300)
const GAP = 24

function getCardWidth() {
    if (window.innerWidth <= 480) return window.innerWidth - 72
    if (window.innerWidth <= 768) return 260
    return 300
}

function updateCardWidth() {
    isMobile.value = window.innerWidth <= 768
    CARD_WIDTH.value = getCardWidth()
}

function getSpacerWidth() {
    return spacerStart.value ? spacerStart.value.offsetWidth : 0
}

// Center a given index in the viewport
function scrollToIndex(idx, smooth = true) {
    if (!track.value) return
    const clamped = Math.max(0, Math.min(idx, plans.length - 1))
    currentIndex.value = clamped

    const trackWidth = track.value.clientWidth
    const spacerW = getSpacerWidth()
    const cardPos = spacerW + clamped * (CARD_WIDTH.value + GAP)
    const offset = cardPos - (trackWidth / 2 - CARD_WIDTH.value / 2)
    track.value.scrollTo({ left: Math.max(0, offset), behavior: smooth ? 'smooth' : 'instant' })
}

function onPointerDown(e) {
    isDragging.value = true
    startX.value = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    scrollStart.value = track.value.scrollLeft
    track.value.style.cursor = 'grabbing'
}

function onPointerMove(e) {
    if (!isDragging.value) return
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    track.value.scrollLeft = scrollStart.value - (x - startX.value)
    updateActiveFromScroll()
}

function onPointerUp() {
    if (!isDragging.value) return
    isDragging.value = false
    track.value.style.cursor = 'grab'
    snapToNearest()
}

function updateActiveFromScroll() {
    const trackWidth = track.value.clientWidth
    const spacerW = getSpacerWidth()
    const center = track.value.scrollLeft + trackWidth / 2
    const nearest = Math.round((center - spacerW - CARD_WIDTH.value / 2) / (CARD_WIDTH.value + GAP))
    currentIndex.value = Math.max(0, Math.min(nearest, plans.length - 1))
}

function snapToNearest() {
    updateActiveFromScroll()
    scrollToIndex(currentIndex.value)
}

function onScroll() {
    if (isDragging.value) return
    updateActiveFromScroll()
}

// keyboard support
function onKeydown(e) {
    if (e.key === 'ArrowLeft') scrollToIndex(currentIndex.value - 1)
    if (e.key === 'ArrowRight') scrollToIndex(currentIndex.value + 1)
}

onMounted(() => {
    updateCardWidth()
    window.addEventListener('resize', () => {
        updateCardWidth()
        nextTick(() => scrollToIndex(currentIndex.value, false))
    })
    // Start at Mastering (index 2)
    nextTick(() => setTimeout(() => scrollToIndex(2, false), 60))
})
</script>

<template>
    <section class="pricing-section" id="harga" aria-labelledby="pricing-title" @keydown="onKeydown" tabindex="-1">
        <div class="container">
            <div class="section-header centered reveal">
                <div class="section-eyebrow">Daftar Harga & Paket Layanan</div>
                <h2 class="section-title" id="pricing-title">
                    Harga transparan tanpa biaya tersembunyi
                </h2>
                <p class="section-desc">
                    Pilih paket plan yang sesuai dengan ukuran dan kebutuhan lembaga pendidikan Anda.<br>
                    Upgrade atau downgrade kapanpun, tanpa penalti.
                </p>
            </div>

            <!-- Slider -->
            <div class="slider-root">
                <button class="slider-arrow arrow-left" :disabled="currentIndex === 0"
                    @click="scrollToIndex(currentIndex - 1)" aria-label="Sebelumnya">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                <div class="slider-track" ref="track" @mousedown="onPointerDown" @mousemove="onPointerMove"
                    @mouseup="onPointerUp" @mouseleave="onPointerUp" @touchstart.passive="onPointerDown"
                    @touchmove.passive="onPointerMove" @touchend="onPointerUp" @scroll.passive="onScroll">

                    <!-- left spacer so first card can center -->
                    <div class="track-spacer" ref="spacerStart" aria-hidden="true" />

                    <div v-for="(plan, i) in plans" :key="plan.name" :ref="el => cardRefs[i] = el" class="pricing-card"
                        :class="[
                            'card-' + plan.tierKey,
                            { 'card-active': currentIndex === i },
                            { 'card-side': Math.abs(currentIndex - i) === 1 },
                            { 'card-far': Math.abs(currentIndex - i) >= 2 },
                            { popular: plan.popular },
                        ]" :style="{ '--accent': `var(${plan.accentVar})` }"
                        @click="!isMobile && currentIndex !== i && scrollToIndex(i)">

                        <div v-if="plan.popular && currentIndex === i" class="popular-badge">✦ Paling Populer</div>

                        <div class="card-top">
                            <div class="pricing-tier">{{ plan.tier }}</div>
                            <div class="pricing-name">{{ plan.name }}</div>
                            <div class="pricing-desc">{{ plan.desc }}</div>
                        </div>

                        <div class="pricing-price">
                            <div class="price-amount">
                                {{ plan.price }}<span v-if="plan.period" class="price-period">{{ plan.period }}</span>
                            </div>
                            <div class="price-note">{{ plan.priceNote }}</div>
                        </div>

                        <div class="pricing-features">
                            <div v-for="feat in plan.features" :key="feat.text" class="pricing-feature"
                                :class="{ 'feat-off': !feat.included }">
                                <span class="feat-icon">{{ feat.included ? '✓' : '✕' }}</span>
                                <span>{{ feat.text }}</span>
                            </div>
                        </div>

                        <a :href="plan.btnHref" class="btn-plan" :class="plan.btnClass"
                            :tabindex="currentIndex === i ? 0 : -1">
                            {{ plan.btnText }}
                        </a>
                    </div>

                    <!-- right spacer -->
                    <div class="track-spacer" aria-hidden="true" />
                </div>

                <button class="slider-arrow arrow-right" :disabled="currentIndex === plans.length - 1"
                    @click="scrollToIndex(currentIndex + 1)" aria-label="Berikutnya">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>

            <!-- Dots -->
            <div class="slider-dots" role="tablist">
                <button v-for="(plan, i) in plans" :key="i" class="dot" :class="{ 'dot-active': currentIndex === i }"
                    :style="currentIndex === i ? { background: `var(${plan.accentVar})` } : {}"
                    @click="scrollToIndex(i)" :aria-label="plan.name" role="tab" :aria-selected="currentIndex === i" />
            </div>

            <!-- Labels -->
            <div class="slider-labels">
                <span v-for="(plan, i) in plans" :key="plan.name" class="slider-label"
                    :class="{ 'label-active': currentIndex === i }"
                    :style="currentIndex === i ? { color: `var(${plan.accentVar})`, borderColor: `color-mix(in srgb, var(${plan.accentVar}) 30%, transparent)`, background: `color-mix(in srgb, var(${plan.accentVar}) 8%, transparent)` } : {}"
                    @click="scrollToIndex(i)">
                    {{ plan.name }}
                </span>
            </div>
        </div>
    </section>
</template>

<style scoped>
.pricing-section {
    --color-learning: #60a5fa;
    --color-understanding: #a78bfa;
    --color-mastering: #00d4ff;
    --color-inspiring: #f59e0b;
    --color-promax: #f97316;

    padding: 7rem 0 5rem;
    position: relative;
    z-index: 1;
    overflow: hidden;
}

/* ── Slider shell ──────────────────────────────────────────────────────────── */
.slider-root {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
}

/* ── Track ─────────────────────────────────────────────────────────────────── */
.slider-track {
    display: flex;
    align-items: center;
    /* cards vertically centred so scale has room */
    gap: 24px;
    overflow-x: auto;
    scrollbar-width: none;
    cursor: grab;
    flex: 1;
    /* extra vertical padding so scale(1.06) never clips */
    padding: 3rem 0 3.5rem;
    -webkit-mask-image: linear-gradient(to right,
            transparent 0%, black 8%, black 92%, transparent 100%);
    mask-image: linear-gradient(to right,
            transparent 0%, black 8%, black 92%, transparent 100%);
    /* NO scroll-snap — we handle snapping manually on pointer-up */
}

.slider-track::-webkit-scrollbar {
    display: none;
}

/* spacers push first/last card to the visual centre */
.track-spacer {
    flex: 0 0 calc(50% - 150px);
    /* half-viewport minus half-card (300/2) */
    min-width: 0;
}

/* ── Cards ─────────────────────────────────────────────────────────────────── */
.pricing-card {
    flex: 0 0 300px;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    position: relative;
    /* scale + opacity transition — the signature effect */
    transition: transform 0.45s cubic-bezier(.34, 1.3, .64, 1),
        opacity 0.35s ease,
        border-color 0.35s ease,
        box-shadow 0.35s ease;
    transform: scale(0.88);
    opacity: 0.5;
    will-change: transform, opacity;
    user-select: none;
}

/* side cards — almost full opacity, slight shrink */
.card-side {
    transform: scale(0.93);
    opacity: 0.72;
    cursor: pointer;
}

/* far cards — more faded */
.card-far {
    transform: scale(0.86);
    opacity: 0.35;
    cursor: pointer;
}

/* ACTIVE — centred, full size */
.card-active {
    transform: scale(1.055);
    opacity: 1;
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    /* box-shadow:
        0 0 55px color-mix(in srgb, var(--accent) 18%, transparent),
        0 28px 70px rgba(0, 0, 0, .4); */
    cursor: default;
}

.card-active.popular {
    border-color: var(--accent);
    /* box-shadow:
        0 0 70px color-mix(in srgb, var(--accent) 22%, transparent),
        0 32px 80px rgba(0, 0, 0, .45); */
}

/* ── Popular badge ─────────────────────────────────────────────────────────── */
.popular-badge {
    position: absolute;
    top: -13px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #000));
    color: var(--midnight);
    font-size: 0.66rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 0.26rem 0.9rem;
    border-radius: 100px;
    white-space: nowrap;
}

/* ── Card internals ────────────────────────────────────────────────────────── */
.card-top {
    margin-bottom: 1.25rem;
}

.pricing-tier {
    font-size: 0.69rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--accent);
    margin-bottom: 0.4rem;
    opacity: 0.85;
}

.pricing-name {
    font-family: var(--font-display);
    font-size: 1.45rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 0.35rem;
}

.pricing-desc {
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.55;
}

.pricing-price {
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--border);
}

.price-amount {
    font-family: var(--font-display);
    font-size: 2.1rem;
    font-weight: 800;
    line-height: 1;
    color: var(--accent);
}

.price-period {
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--muted);
    font-family: inherit;
}

.price-note {
    font-size: 0.74rem;
    color: var(--muted);
    margin-top: 0.3rem;
}

.pricing-features {
    flex: 1;
    margin-bottom: 1.5rem;
}

.pricing-feature {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.81rem;
    color: var(--white);
    padding: 0.38rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, .04);
}

.pricing-feature.feat-off {
    color: var(--muted);
    opacity: 0.4;
}

.feat-icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.55rem;
    font-weight: 800;
    flex-shrink: 0;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    color: var(--accent);
}

.feat-off .feat-icon {
    background: rgba(255, 255, 255, .05);
    color: rgba(255, 255, 255, .2);
}

/* ── CTA buttons ───────────────────────────────────────────────────────────── */
.btn-plan {
    display: block;
    width: 100%;
    text-align: center;
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.8rem;
    border-radius: 11px;
    transition: all 0.22s;
    text-decoration: none;
}

.btn-learning {
    background: rgba(96, 165, 250, .1);
    color: #60a5fa;
    border: 1px solid rgba(96, 165, 250, .3);
}

.btn-learning:hover {
    background: rgba(96, 165, 250, .18);
    border-color: #60a5fa;
}

.btn-understanding {
    background: rgba(167, 139, 250, .1);
    color: #a78bfa;
    border: 1px solid rgba(167, 139, 250, .3);
}

.btn-understanding:hover {
    background: rgba(167, 139, 250, .18);
    border-color: #a78bfa;
}

.btn-mastering {
    background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
    color: var(--midnight);
    border: none;
    box-shadow: 0 0 26px rgba(0, 212, 255, .25);
}

.btn-mastering:hover {
    box-shadow: 0 0 44px rgba(0, 212, 255, .42);
    transform: translateY(-1px);
}

.btn-inspiring {
    background: rgba(245, 158, 11, .12);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, .3);
}

.btn-inspiring:hover {
    background: rgba(245, 158, 11, .2);
    border-color: #f59e0b;
}

.btn-promax {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff;
    border: none;
    box-shadow: 0 0 22px rgba(249, 115, 22, .25);
}

.btn-promax:hover {
    box-shadow: 0 0 38px rgba(249, 115, 22, .45);
    transform: translateY(-1px);
}

/* ── Arrow buttons ─────────────────────────────────────────────────────────── */
.slider-arrow {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--navy);
    color: var(--white);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 2;
}

.slider-arrow:hover:not(:disabled) {
    border-color: rgba(255, 255, 255, .25);
    background: rgba(255, 255, 255, .07);
}

.slider-arrow:disabled {
    opacity: 0.2;
    cursor: default;
}

/* ── Dots ──────────────────────────────────────────────────────────────────── */
.slider-dots {
    display: flex;
    justify-content: center;
    gap: 0.4rem;
    margin-top: 1.5rem;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--border);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s cubic-bezier(.34, 1.3, .64, 1);
}

.dot-active {
    width: 26px;
    border-radius: 3px;
}

/* ── Labels ────────────────────────────────────────────────────────────────── */
.slider-labels {
    display: flex;
    justify-content: center;
    gap: 0.2rem;
    margin-top: 0.85rem;
    flex-wrap: wrap;
}

.slider-label {
    font-size: 0.73rem;
    font-weight: 600;
    color: var(--muted);
    padding: 0.26rem 0.7rem;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.slider-label:hover {
    color: var(--white);
}

/* ── Responsive ────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
    .slider-root {
        display: block;
    }

    .pricing-card {
        flex: none;
        width: 100%;
        transform: none;
        opacity: 1;
        cursor: default;
    }

    .slider-arrow {
        display: none;
    }

    .slider-track {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: visible;
        padding: 1rem 0 0;
        -webkit-mask-image: none;
        mask-image: none;
        cursor: default;
    }

    .track-spacer {
        display: none;
    }

    .card-side,
    .card-far,
    .card-active,
    .card-active.popular {
        transform: none;
        opacity: 1;
    }

    .slider-dots,
    .slider-labels {
        display: none;
    }

    .popular-badge {
        top: 0.85rem;
        right: 1rem;
        left: auto;
        transform: none;
    }
}
</style>