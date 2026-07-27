<script setup>
import { Head, router, usePage } from '@inertiajs/vue3'
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import SubscriptionInvoiceModal from '@/Components/SubscriptionInvoiceModal.vue'
import {
    CheckIcon, SparklesIcon, BoltIcon, BuildingLibraryIcon, AcademicCapIcon,
    ChevronLeftIcon, ChevronRightIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon,
} from '@heroicons/vue/24/outline'
import OwnerLayout from '@/Layouts/OwnerLayout.vue'

const props = defineProps({
    owner: Object,
    tenant: Object,
    currentPlan: String,
    currentSortOrder: Number,
    expiresAt: String,
    pendingPlan: String,
    trialUsed: Boolean,
    plans: {
        type: Array,
        default: () => [],
    },
})

const billingCycle = ref('yearly') // 'monthly' | 'yearly'

// Safety wrapper — selalu Array meski prop belum siap
const planList = computed(() => props.plans ?? [])

// ─── Tentukan aksi per plan ───────────────────────────────────────────────────
function getPlanAction(plan) {
    if (plan.key === props.currentPlan) return 'current'
    if (!props.currentPlan) return 'subscribe'
    const currentSort = props.currentSortOrder ?? 0
    return plan.sortOrder > currentSort ? 'upgrade' : 'downgrade'
}

function getCtaLabel(plan) {
    if (plan.key === props.pendingPlan) return '⏳ Dijadwalkan'
    const action = getPlanAction(plan)
    if (action === 'current') return '✓ Paket Aktif'
    if (action === 'upgrade') return '↑ Upgrade ke ' + plan.name
    if (action === 'downgrade') return '↓ Downgrade ke ' + plan.name
    return plan.cta
}

function isCtaDisabled(plan) {
    // Disabled jika ini plan aktif saat ini
    if (plan.key === props.currentPlan) return true
    // Disabled jika plan ini sudah dijadwalkan sebagai downgrade pending
    if (plan.key === props.pendingPlan) return true
    return false
}

// ─── Modal konfirmasi ─────────────────────────────────────────────────────────
const page = usePage()
const showModal = ref(false)
const modalPlan = ref(null)
const modalCalc = ref(null)
const modalLoading = ref(false)
const submitting = ref(false)

function csrfToken() {
    return page.props.csrf_token
        ?? document.querySelector('meta[name="csrf-token"]')?.content
        ?? ''
}

async function handleCta(plan) {
    if (isCtaDisabled(plan)) return

    // Enterprise → WA
    // if (plan.key === 'enterprise') {
    //     window.open('https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20paket%20Enterprise%20Lumiverse', '_blank')
    //     return
    // }

    // Ambil preview kalkulasi dari server
    modalPlan.value = plan
    modalCalc.value = null
    modalLoading.value = true
    showModal.value = true

    try {
        const res = await fetch(route('owner.subscription.preview'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken(),
                'Accept': 'application/json',
            },

            body: JSON.stringify({
                plan_key: plan.key,
                billing_cycle: billingCycle.value,
            }),
        })
        modalCalc.value = await res.json()
    } catch (e) {
        modalCalc.value = null
    } finally {
        modalLoading.value = false
    }
}

function closeModal() {
    showModal.value = false
    modalPlan.value = null
    modalCalc.value = null
}

async function confirmSubscribe() {
    if (!modalPlan.value || submitting.value) return
    submitting.value = true

    try {
        const res = await fetch(route('owner.subscription.charge'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken(),
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                plan_key: modalPlan.value.key,
                billing_cycle: billingCycle.value,
            }),
        })

        const data = await res.json()

        if (data.action === 'activated' || data.action === 'downgrade') {
            // Gratis atau downgrade → reload halaman untuk refresh state
            closeModal()
            router.reload({ only: ['currentPlan', 'expiresAt', 'pendingPlan'] })
            return
        }

        if (data.action === 'pay' && data.snap_token) {
            closeModal()
            const orderId = data.order_id  // ← simpan dari response charge

            window.snap.pay(data.snap_token, {
                onSuccess: (result) => {
                    window.location.href = route('owner.subscription.finish')
                        + '?order_id=' + (result.order_id || orderId)
                },
                onPending: () => {
                    window.location.href = route('owner.subscription.history')
                },
                onError: () => {
                    alert('Pembayaran gagal. Silakan coba lagi.')
                },
                onClose: () => {
                    // Triggered saat user klik close setelah bayar sukses
                    window.location.href = route('owner.subscription.finish')
                        + '?order_id=' + orderId
                },
            })
        }
    } catch (e) {
        alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
        submitting.value = false
    }
}

function cancelDowngrade() {
    router.post(route('owner.subscription.cancel-downgrade'), {}, {
        preserveScroll: true,
    })
}

// ─── Format helpers ───────────────────────────────────────────────────────────
const faqs = [
    {
        q: 'Apakah ada masa uji coba gratis?',
        a: 'Ya, semua paket berbayar memiliki masa uji coba 14 hari tanpa perlu kartu kredit. Anda bisa upgrade atau batal kapan saja.',
    },
    {
        q: 'Bagaimana cara pembayaran?',
        a: 'Kami menerima transfer bank, kartu kredit/debit, dan dompet digital (GoPay, OVO, DANA) melalui Midtrans.',
    },
    {
        q: 'Apakah data saya aman saat upgrade/downgrade?',
        a: 'Tentu. Semua data tersimpan aman. Saat downgrade, data tetap ada namun akses ke fitur premium akan dibatasi.',
    },
    {
        q: 'Bisakah saya ganti paket di tengah periode?',
        a: 'Bisa. Upgrade langsung aktif dengan perhitungan prorata. Downgrade berlaku di akhir periode tagihan.',
    },
    {
        q: 'Apakah harga sudah termasuk PPN?',
        a: 'Harga yang ditampilkan belum termasuk PPN 11%. Total akan terlihat pada halaman pembayaran.',
    },
]

const openFaq = ref(null)
function toggleFaq(i) {
    openFaq.value = openFaq.value === i ? null : i
}

function formatPrice(amount) {
    if (amount === null || amount === undefined) return null
    if (amount === 0) return '0'
    return new Intl.NumberFormat('id-ID').format(amount)
}

// ─── Yearly Discount ──────────────────────────────────────────────────────
// Hitung rata-rata % diskon yearly vs monthly dari semua plan berbayar
const avgYearlyDiscount = computed(() => {
    const discounts = planList.value
        .filter(p => p.price?.monthly > 0 && p.price?.yearly > 0)
        .map(p => Math.round((1 - p.price.yearly / p.price.monthly) * 100))

    if (!discounts.length) return null
    const avg = Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length)
    return avg > 0 ? avg : null
})

function getSavingPercent(plan) {
    if (!plan.price?.monthly || !plan.price?.yearly) return null
    return Math.round((1 - plan.price.yearly / plan.price.monthly) * 100)
}

function getSaving(plan) {
    if (!plan.price.monthly || !plan.price.yearly) return null
    const saved = (plan.price.monthly - plan.price.yearly) * 12
    return formatPrice(saved)
}

function isCurrentPlan(plan) {
    return plan.key === props.currentPlan
}

// ─── Billing toggle pill ──────────────────────────────────────────────────────
const billingToggle = ref(null)

function measurePill() {
    if (!billingToggle.value) return
    const btns = billingToggle.value.querySelectorAll('.toggle-btn')
    if (btns.length < 2) return
    billingToggle.value.style.setProperty('--pill-monthly-w', btns[0].offsetWidth + 'px')
    billingToggle.value.style.setProperty('--pill-yearly-w', btns[1].offsetWidth + 'px')
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
const sliderRoot = ref(null)
const track = ref(null)
const currentIndex = ref(1)
const CARD_WIDTH = 340
const GAP = 24

function getHalfContainer() {
    return sliderRoot.value ? sliderRoot.value.clientWidth / 2 : 0
}

function scrollToIndex(idx, smooth = true) {
    if (!track.value) return
    const clamped = Math.max(0, Math.min(idx, planList.value.length - 1))
    currentIndex.value = clamped
    const half = getHalfContainer()
    const spacerW = half - CARD_WIDTH / 2
    const cardLeft = spacerW + clamped * (CARD_WIDTH + GAP)
    track.value.scrollTo({ left: Math.max(0, cardLeft - (half - CARD_WIDTH / 2)), behavior: smooth ? 'smooth' : 'instant' })
}

function updateActiveFromScroll() {
    if (!track.value || !sliderRoot.value) return
    const half = getHalfContainer()
    const spacerW = half - CARD_WIDTH / 2
    const center = track.value.scrollLeft + half
    const nearest = Math.round((center - spacerW - CARD_WIDTH / 2) / (CARD_WIDTH + GAP))
    currentIndex.value = Math.max(0, Math.min(nearest, planList.value.length - 1))
}

function onKeydown(e) {
    if (e.key === 'ArrowLeft') scrollToIndex(currentIndex.value - 1)
    if (e.key === 'ArrowRight') scrollToIndex(currentIndex.value + 1)
}

onMounted(() => {
    window.addEventListener('resize', measurePill)
    window.addEventListener('resize', () => nextTick(() => scrollToIndex(currentIndex.value, false)))
})

// Ganti watch sebelumnya dengan ini:
watch(
    () => props.plans,
    (plans) => {
        if (!plans || plans.length === 0) return
        nextTick(() => {
            measurePill()
            setTimeout(() => scrollToIndex(1, false), 80)
        })
    },
    { immediate: true, flush: 'post' }
)

function formatDate(dateStr) {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>

    <Head title="Price List" />
    <OwnerLayout>

        <template #header>
            <h1 class="topbar-title">Price List & Our Services</h1>
        </template>

        <!-- ── Hero ──────────────────────────────────────────────────────── -->
        <div class="pricing-hero">
            <div class="hero-badge">
                <SparklesIcon class="hero-badge-icon" />
                Paket Layanan & Daftar Harga
            </div>
            <h1 class="hero-title hidden sm:block">Berbagai macam fitur <span class="hidden sm:inline-flex">untuk semua
                    kebutuhanmu!</span></h1>
            <p class="hero-sub">Akses fitur lengkap sepuasnya, berhenti berlangganan kapan saja. <span
                    class="hidden sm:inline-flex">Tanpa kontrak panjang, tanpa kartu kredit dan tanpa biaya
                    tersembunyi.</span></p>

            <div class="billing-toggle" ref="billingToggle" :data-cycle="billingCycle">
                <div class="toggle-slider-pill" />
                <button class="toggle-btn" :class="{ active: billingCycle === 'monthly' }"
                    @click="billingCycle = 'monthly'">Bulanan</button>
                <button class="toggle-btn" :class="{ active: billingCycle === 'yearly' }"
                    @click="billingCycle = 'yearly'">
                    Tahunan <span v-if="avgYearlyDiscount" class="toggle-save">Hemat hingga ~30%</span>
                </button>
                <!-- <button class="toggle-btn" :class="{ active: billingCycle === 'yearly' }"
                    @click="billingCycle = 'yearly'">
                    Tahunan <span v-if="avgYearlyDiscount" class="toggle-save">Hemat ~{{ avgYearlyDiscount }}%</span>
                </button> -->
            </div>
        </div>

        <template v-if="planList.length > 0">

            <!-- ── Desktop Carousel ───────────────────────────────────────────── -->
            <div class="slider-root desktop-only" ref="sliderRoot" @keydown="onKeydown" tabindex="-1">

                <button class="slider-arrow slider-arrow-left" :disabled="currentIndex === 0"
                    @click="scrollToIndex(currentIndex - 1)" aria-label="Sebelumnya">
                    <ChevronLeftIcon class="arrow-icon" />
                </button>

                <div class="slider-track" ref="track" @scroll.passive="onCarouselScroll">

                    <div class="track-spacer" aria-hidden="true" />

                    <div v-for="(plan, i) in planList" :key="plan.key" class="plan-card" :class="{
                        'card-active': currentIndex === i,
                        'card-side': Math.abs(currentIndex - i) === 1,
                        'card-far': Math.abs(currentIndex - i) >= 2,
                        'plan-card-current': isCurrentPlan(plan),
                    }" :style="{ '--accent': plan.accent }" @click="currentIndex !== i && scrollToIndex(i)">
                        <div v-if="plan.badge && currentIndex === i" class="plan-popular-badge">
                            <SparklesIcon style="width:11px;height:11px;" /> {{ plan.badge }}
                        </div>

                        <div class="plan-header">
                            <div class="plan-icon">
                                <AcademicCapIcon v-if="plan.key === 'basic'" style="width:16px;height:16px;" />
                                <BuildingLibraryIcon v-else-if="plan.key === 'enterprise'"
                                    style="width:16px;height:16px;" />
                                <SparklesIcon v-else-if="plan.key === 'expertise'" style="width:16px;height:16px;" />
                                <BoltIcon v-else style="width:16px;height:16px;" />
                            </div>
                            <div>
                                <div class="plan-name">{{ plan.name }}</div>
                                <div class="plan-desc">{{ plan.desc }}</div>
                            </div>
                        </div>

                        <div class="plan-price-block">
                            <template v-if="plan.priceLabel">
                                <div class="plan-price-custom">{{ plan.priceLabel }}</div>
                            </template>
                            <template v-else-if="plan.price[billingCycle] === 0">
                                <div class="plan-price-amount">Gratis</div>
                                <div class="plan-price-period">selamanya</div>
                            </template>
                            <template v-else>
                                <div class="plan-price-row">
                                    <span class="plan-price-currency">Rp</span>
                                    <span class="plan-price-amount">{{ formatPrice(plan.price[billingCycle]) }}</span>
                                </div>
                                <div class="plan-price-period">
                                    per bulan<span v-if="billingCycle === 'yearly'"> · ditagih tahunan</span>
                                </div>
                                <div v-if="billingCycle === 'yearly' && getSaving(plan)" class="plan-price-saving">
                                    Hemat {{ getSavingPercent(plan) }}% · Rp {{ getSaving(plan) }}/tahun
                                </div>
                            </template>
                        </div>

                        <div class="plan-users flex justify-center" v-if="plan.maxUsers">
                            Hingga <strong class="pl-1">{{ plan.maxUsers.toLocaleString('id-ID') }} pengguna</strong>
                        </div>
                        <div class="plan-users flex justify-center" v-else-if="plan.key === 'expertise'">
                            <strong>Unlimited account</strong>
                        </div>

                        <button class="plan-cta" :class="{
                            'plan-cta-highlight': plan.highlight && !isCurrentPlan(plan),
                            'plan-cta-current': isCurrentPlan(plan),
                            'plan-cta-accent': !plan.highlight && !isCurrentPlan(plan),
                        }" :disabled="isCurrentPlan(plan)" :tabindex="currentIndex === i ? 0 : -1"
                            @click.stop="handleCta(plan)">
                            {{ isCurrentPlan(plan) ? '✓ Paket Aktif' : plan.cta }}
                        </button>

                        <div class="plan-features">
                            <div v-for="f in plan.features" :key="f" class="plan-feature">
                                <CheckIcon class="feature-check feature-check-yes" />
                                <span>{{ f }}</span>
                            </div>
                            <div v-for="f in plan.unavailable" :key="f" class="plan-feature plan-feature-no">
                                <span class="feature-check feature-check-no">—</span>
                                <span>{{ f }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="track-spacer" aria-hidden="true" />
                </div>

                <button class="slider-arrow slider-arrow-right" :disabled="currentIndex === planList.length - 1"
                    @click="scrollToIndex(currentIndex + 1)" aria-label="Berikutnya">
                    <ChevronRightIcon class="arrow-icon" />
                </button>
            </div>

            <!-- Dots — desktop only -->
            <div class="slider-dots desktop-only" role="tablist">
                <button v-for="(plan, i) in planList" :key="plan.key" class="dot"
                    :class="{ 'dot-active': currentIndex === i }"
                    :style="currentIndex === i ? { background: plan.accent, width: '26px' } : {}"
                    @click="scrollToIndex(i)" :aria-label="plan.name" role="tab" :aria-selected="currentIndex === i" />
            </div>

            <!-- Labels — desktop only -->
            <div class="slider-labels desktop-only">
                <span v-for="(plan, i) in planList" :key="plan.key" class="slider-label"
                    :class="{ 'label-active': currentIndex === i }"
                    :style="currentIndex === i ? { color: plan.accent, borderColor: plan.accent + '44', background: plan.accent + '12' } : {}"
                    @click="scrollToIndex(i)">{{ plan.name }}</span>
            </div>

            <!-- ── Mobile Static Cards ────────────────────────────────────────── -->
            <div class="mobile-cards mobile-only">
                <div v-for="plan in planList" :key="plan.key" class="mobile-plan-card"
                    :class="{ 'mobile-plan-card-current': isCurrentPlan(plan), 'mobile-plan-card-highlight': plan.highlight }"
                    :style="{ '--accent': plan.accent }">

                    <div v-if="plan.badge" class="mobile-popular-badge">
                        <SparklesIcon style="width:10px;height:10px;" /> {{ plan.badge }}
                    </div>

                    <div class="plan-header">
                        <!-- <div class="plan-icon">
                        <AcademicCapIcon v-if="plan.key === 'basic'" style="width:16px;height:16px;" />
                        <BuildingLibraryIcon v-else-if="plan.key === 'enterprise'" style="width:16px;height:16px;" />
                        <SparklesIcon v-else-if="plan.key === 'expertise'" style="width:16px;height:16px;" />
                        <BoltIcon v-else style="width:16px;height:16px;" />
                    </div> -->
                        <div>
                            <div class="plan-name">{{ plan.name }}</div>
                            <div class="plan-desc">{{ plan.desc }}</div>
                        </div>
                    </div>

                    <div class="mobile-price-row">
                        <div class="plan-price-block">
                            <div class="plan-price-row">
                                <span class="plan-price-currency">Rp</span>
                                <span class="plan-price-amount">{{ formatPrice(plan.price[billingCycle]) }}</span>
                            </div>
                            <div class="plan-price-period">
                                per bulan<span v-if="billingCycle === 'yearly'"> · ditagih tahunan</span>
                            </div>
                            <div v-if="billingCycle === 'yearly' && getSaving(plan)" class="plan-price-saving">
                                Hemat Rp {{ getSaving(plan) }}/tahun
                            </div>
                        </div>
                    </div>


                    <div class="plan-users flex justify-center" v-if="plan.maxUsers">
                        Hingga <strong class="pl-1">{{ plan.maxUsers.toLocaleString('id-ID') }} akun pengguna</strong>
                    </div>
                    <div class="plan-users flex justify-center" v-else-if="plan.key === 'expertise'">
                        <strong class="pl-1">Unlimited Akun Pengguna</strong>
                    </div>

                    <button class="plan-cta mobile-cta" :class="{
                        'plan-cta-highlight': plan.highlight && !isCurrentPlan(plan),
                        'plan-cta-current': isCurrentPlan(plan),
                        'plan-cta-accent': !plan.highlight && !isCurrentPlan(plan),
                    }" :disabled="isCurrentPlan(plan)" @click="handleCta(plan)">
                        {{ isCurrentPlan(plan) ? '✓ Aktif' : plan.cta }}
                    </button>

                    <div class="plan-features">
                        <div v-for="f in plan.features" :key="f" class="plan-feature">
                            <CheckIcon class="feature-check feature-check-yes" />
                            <span>{{ f }}</span>
                        </div>
                        <div v-for="f in plan.unavailable" :key="f" class="plan-feature plan-feature-no">
                            <span class="feature-check feature-check-no">—</span>
                            <span>{{ f }}</span>
                        </div>
                    </div>
                </div>
            </div>

        </template>

        <!-- ── Empty state — belum ada paket ──────────────────────────────── -->
        <div v-else class="pricing-empty-state">
            <div class="pricing-empty-icon">
                <SparklesIcon style="width:28px;height:28px;" />
            </div>
            <div class="pricing-empty-title">Belum ada paket tersedia</div>
            <p class="pricing-empty-desc">
                Saat ini belum ada paket harga yang bisa ditampilkan.
                Silakan hubungi tim kami untuk informasi lebih lanjut.
            </p>
        </div>

        <!-- ── Guarantee strip ────────────────────────────────────────────── -->
        <div class="guarantee-strip">
            <div class="guarantee-item"><span class="guarantee-icon">🔒</span><span>Sistem pembayaran yang cepat, mudah
                    dan
                    aman</span></div>
            <div class="guarantee-divider" />
            <div class="guarantee-item"><span class="guarantee-icon">↩️</span><span>Uji coba 14 hari dan batalkan kapan
                    saja</span></div>
            <div class="guarantee-divider" />
            <div class="guarantee-item"><span class="guarantee-icon">📞</span><span>Dukungan layanan uptime 24/7</span>
            </div>
        </div>

        <!-- ── FAQ ───────────────────────────────────────────────────────── -->
        <div class="faq-section">
            <div class="section-title">Pertanyaan Umum</div>
            <div class="faq-list">
                <div v-for="(item, i) in faqs" :key="i" class="faq-item" :class="{ 'faq-item-open': openFaq === i }">
                    <button class="faq-question" @click="toggleFaq(i)">
                        <span>{{ item.q }}</span>
                        <span class="faq-chevron" :class="{ 'faq-chevron-open': openFaq === i }">›</span>
                    </button>
                    <div v-show="openFaq === i" class="faq-answer">{{ item.a }}</div>
                </div>
            </div>
        </div>

        <!-- ── Modal Konfirmasi Pembayaran ───────────────────────────────────────── -->
        <SubscriptionInvoiceModal :show="showModal" :loading="modalLoading" :submitting="submitting" :calc="modalCalc"
            :plan-name="modalPlan?.name" :accent-color="modalPlan?.accent" @close="closeModal"
            @confirm="confirmSubscribe" />

    </OwnerLayout>
</template>

<style scoped>
/* ── Visibility helpers ────────────────────────────────────────────────────── */
.desktop-only {
    display: flex;
}

.mobile-only {
    display: none !important;
}

@media (max-width: 768px) {
    .desktop-only {
        display: none !important;
    }

    .mobile-only {
        display: block !important;
    }
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */
.pricing-hero {
    text-align: center;
    padding: 1.5rem 0 2.5rem;
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--cyan);
    background: rgba(0, 212, 255, 0.08);
    border: 1px solid rgba(0, 212, 255, 0.2);
    padding: 0.3rem 0.75rem;
    border-radius: 100px;
    margin-bottom: 1.25rem;
}

.hero-badge-icon {
    width: 12px;
    height: 12px;
}

.hero-title {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 2rem;
    line-height: 1.2;
    margin: 0 0 0.75rem;
}

.hero-sub {
    color: var(--muted);
    font-size: 0.95rem;
    margin: 0 0 2rem;
}

/* ── Billing toggle ────────────────────────────────────────────────────────── */
.billing-toggle {
    display: inline-flex;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 0.25rem;
    gap: 0;
    position: relative;
}

.toggle-slider-pill {
    position: absolute;
    top: 0.25rem;
    bottom: 0.25rem;
    left: 0.25rem;
    border-radius: 100px;
    background: var(--glass);
    border: 1px solid var(--border);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.billing-toggle[data-cycle="monthly"] .toggle-slider-pill {
    width: var(--pill-monthly-w, 80px);
    transform: translateX(0);
}

.billing-toggle[data-cycle="yearly"] .toggle-slider-pill {
    width: var(--pill-yearly-w, 140px);
    transform: translateX(var(--pill-monthly-w, 80px));
}

.toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.35rem 1rem;
    border-radius: 100px;
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.25s ease;
    position: relative;
    z-index: 1;
    white-space: nowrap;
}

.toggle-btn.active {
    color: var(--white);
}

.toggle-save {
    font-size: 0.68rem;
    font-weight: 700;
    background: rgba(52, 211, 153, 0.15);
    color: #34d399;
    padding: 0.15rem 0.45rem;
    border-radius: 100px;
}

/* ── Carousel shell ────────────────────────────────────────────────────────── */
.slider-root {
    display: flex;
    align-items: center;
    gap: 0;
    position: relative;
    margin-bottom: 1rem;
    overflow: hidden;
}

/* ── Track ─────────────────────────────────────────────────────────────────── */
.slider-track {
    display: flex;
    align-items: center;
    gap: 12px;
    overflow-x: auto;
    scrollbar-width: none;
    flex: 1;
    padding: 3rem 0 3.5rem;
}

.slider-track::-webkit-scrollbar {
    display: none;
}

.track-spacer {
    flex: 0 0 calc(50% - 170px);
    min-width: 0;
}

/* ── Cards ─────────────────────────────────────────────────────────────────── */
.plan-card {
    flex: 0 0 340px;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 1.75rem;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    cursor: pointer;
    user-select: none;
    will-change: transform, opacity;
    transition:
        transform 0.45s cubic-bezier(.34, 1.3, .64, 1),
        opacity 0.35s ease,
        border-color 0.35s ease,
        box-shadow 0.35s ease;
    transform: scale(0.88);
    opacity: 0.45;
}

.card-side {
    transform: scale(0.93);
    opacity: 0.7;
}

.card-far {
    transform: scale(0.86);
    opacity: 0.3;
}

.card-active {
    transform: scale(1.04);
    opacity: 1;
    cursor: default;
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    box-shadow:
        0 0 48px color-mix(in srgb, var(--accent) 14%, transparent),
        0 24px 60px rgba(0, 0, 0, 0.35);
}

.plan-card-current.card-active {
    border-color: rgba(52, 211, 153, 0.45);
    box-shadow: 0 0 32px rgba(52, 211, 153, 0.1), 0 24px 60px rgba(0, 0, 0, 0.35);
}

/* ── Arrows — floating, no background ─────────────────────────────────────── */
.slider-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
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
    flex-shrink: 0;
    pointer-events: all;
}

.arrow-icon {
    width: 16px;
    height: 16px;
}

.slider-arrow-left {
    left: 4px;
}

.slider-arrow-right {
    right: 4px;
}

.slider-arrow:hover:not(:disabled) {
    border-color: rgba(255, 255, 255, 0.35);
    color: var(--white);
    background: rgba(255, 255, 255, 0.06);
}

.slider-arrow:disabled {
    opacity: 0.2;
    cursor: default;
}

/* ── Dots ──────────────────────────────────────────────────────────────────── */
.slider-dots {
    justify-content: center;
    gap: 0.4rem;
    margin-bottom: 0.85rem;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: var(--border);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s cubic-bezier(.34, 1.3, .64, 1);
}

/* ── Labels ────────────────────────────────────────────────────────────────── */
.slider-labels {
    justify-content: center;
    gap: 0.2rem;
    margin-bottom: 2rem;
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

/* ── Card internals ────────────────────────────────────────────────────────── */
.plan-popular-badge {
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--midnight);
    background: var(--accent);
    padding: 0.25rem 0.75rem;
    border-radius: 0 0 8px 8px;
    white-space: nowrap;
}

.plan-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.plan-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    color: var(--accent);
}

.plan-name {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1rem;
    line-height: 1.2;
}

.plan-desc {
    font-size: 0.78rem;
    color: var(--muted);
    margin-top: 0.2rem;
    line-height: 1.4;
}

.plan-price-block {
    min-height: 56px;
}

.plan-price-custom {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1.4rem;
    color: var(--accent);
}

.plan-price-row {
    display: flex;
    align-items: baseline;
    gap: 0.2rem;
}

.plan-price-currency {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--muted);
}

.plan-price-amount {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1.6rem;
    line-height: 1;
    color: var(--accent);
}

.plan-price-period {
    font-size: 0.76rem;
    color: var(--muted);
    margin-top: 0.2rem;
}

.plan-price-saving {
    display: inline-block;
    margin-top: 0.4rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: #34d399;
    background: rgba(52, 211, 153, 0.1);
    padding: 0.15rem 0.5rem;
    border-radius: 100px;
}

.plan-users {
    font-size: 0.8rem;
    color: var(--muted);
    padding: 0.5rem 0.75rem;
    background: color-mix(in srgb, var(--accent) 6%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    border-radius: 8px;
}

.plan-users strong {
    color: var(--accent);
}

.plan-cta {
    width: 100%;
    padding: 0.6rem 1rem;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.plan-cta-accent {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
    color: var(--accent);
}

.plan-cta-accent:hover:not(:disabled) {
    background: color-mix(in srgb, var(--accent) 20%, transparent);
}

.plan-cta-highlight {
    background: var(--accent);
    color: var(--midnight);
    box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 35%, transparent);
}

.plan-cta-highlight:hover:not(:disabled) {
    opacity: 0.88;
    box-shadow: 0 0 32px color-mix(in srgb, var(--accent) 50%, transparent);
}

.plan-cta-current {
    background: rgba(52, 211, 153, 0.1);
    border: 1px solid rgba(52, 211, 153, 0.3);
    color: #34d399;
    cursor: default;
}

.plan-cta:disabled {
    cursor: default;
}

.plan-features {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    padding-top: 0.25rem;
    border-top: 1px solid var(--border);
}

.plan-feature {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.8rem;
    line-height: 1.4;
    color: var(--white);
}

.plan-feature-no {
    color: var(--muted);
}

.feature-check {
    flex-shrink: 0;
    margin-top: 1px;
}

.feature-check-yes {
    width: 14px;
    height: 14px;
    color: var(--accent);
}

.feature-check-no {
    width: 14px;
    height: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.2);
    line-height: 1;
}

/* ── Mobile static cards ───────────────────────────────────────────────────── */
.mobile-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

.mobile-plan-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem 1.25rem;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    margin-bottom: 2rem;
    transition: border-color 0.2s;
}

.mobile-plan-card-highlight {
    border-color: color-mix(in srgb, var(--accent) 45%, transparent);
    box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 10%, transparent);
}

.mobile-plan-card-current {
    border-color: rgba(52, 211, 153, 0.35);
}

.mobile-popular-badge {
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--midnight);
    background: var(--accent);
    padding: 0.2rem 0.65rem;
    border-radius: 0 0 8px 8px;
    white-space: nowrap;
}

.mobile-price-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.75rem;
}

.mobile-cta {
    width: auto;
    flex-shrink: 0;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    white-space: nowrap;
}

/* ── Empty state ───────────────────────────────────────────────────────────── */
.pricing-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    max-width: 420px;
    margin: 2.5rem auto 3rem;
    padding: 2.5rem 1.5rem;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.02);
}

.pricing-empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(0, 212, 255, 0.08);
    color: var(--accent, #00d4ff);
}

.pricing-empty-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--white);
}

.pricing-empty-desc {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.5;
    margin: 0;
}

/* ── Guarantee ─────────────────────────────────────────────────────────────── */
.guarantee-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1rem 1.5rem;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 2.5rem;
}

.guarantee-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    color: var(--muted);
}

.guarantee-icon {
    font-size: 1rem;
}

.guarantee-divider {
    width: 1px;
    height: 20px;
    background: var(--border);
}

/* ── FAQ ───────────────────────────────────────────────────────────────────── */
.faq-section {
    margin-bottom: 2rem;
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.faq-item {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.2s;
}

.faq-item-open {
    border-color: rgba(255, 255, 255, 0.12);
}

.faq-question {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: none;
    border: none;
    color: var(--white);
    font-size: 0.88rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    gap: 1rem;
    transition: background 0.15s;
}

.faq-question:hover {
    background: rgba(255, 255, 255, 0.02);
}

.faq-chevron {
    font-size: 1.2rem;
    color: var(--muted);
    transition: transform 0.2s;
    flex-shrink: 0;
    line-height: 1;
}

.faq-chevron-open {
    transform: rotate(90deg);
}

.faq-answer {
    padding: 0 1.25rem 1rem;
    font-size: 0.84rem;
    color: var(--muted);
    line-height: 1.6;
    border-top: 1px solid var(--border);
    padding-top: 0.75rem;
}

/* ── Responsive ────────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
    .hero-title {
        font-size: 1.5rem;
    }

    .guarantee-strip {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
    }

    .guarantee-divider {
        width: 40px;
        height: 1px;
    }
}

/* ── Modal ─────────────────────────────────────────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-box {
    background: var(--navy);
    border: 1px solid color-mix(in srgb, var(--accent, #00d4ff) 30%, var(--border));
    border-radius: 20px;
    padding: 1.75rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 0 60px color-mix(in srgb, var(--accent, #00d4ff) 12%, transparent),
        0 24px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}

.modal-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.1rem;
}

.modal-subtitle {
    font-size: 0.82rem;
    color: var(--muted);
    margin-top: 0.2rem;
}

.modal-close {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 0.2rem;
    flex-shrink: 0;
    transition: color 0.2s;
}

.modal-close:hover {
    color: var(--white);
}

.modal-summary {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.modal-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--muted);
}

.modal-row-credit {
    color: #34d399;
}

.modal-divider {
    height: 1px;
    background: var(--border);
    margin: 0.25rem 0;
}

.modal-row-total {
    font-weight: 700;
    font-size: 1rem;
    color: var(--white);
}

.modal-expires {
    font-size: 0.78rem;
    color: var(--muted);
    margin-top: 0.25rem;
}

.modal-note {
    font-size: 0.78rem;
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.08);
    border: 1px solid rgba(251, 191, 36, 0.2);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    margin-top: 0.25rem;
}

.modal-warning {
    font-size: 0.78rem;
    color: #fb923c;
    background: rgba(251, 146, 60, 0.08);
    border: 1px solid rgba(251, 146, 60, 0.25);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
}

.modal-actions {
    display: flex;
    gap: 0.75rem;
}

.modal-btn-cancel {
    flex: 1;
    padding: 0.65rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.modal-btn-cancel:hover {
    color: var(--white);
    border-color: rgba(255, 255, 255, 0.2);
}

.modal-btn-confirm {
    flex: 2;
    padding: 0.65rem;
    border-radius: 10px;
    border: none;
    background: var(--accent, #00d4ff);
    color: var(--midnight, #0a0f1e);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.modal-btn-confirm:hover:not(:disabled) {
    opacity: 0.88;
}

.modal-btn-confirm:disabled {
    opacity: 0.5;
    cursor: default;
}

.modal-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 0;
    color: var(--muted);
    font-size: 0.85rem;
}

.modal-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid var(--border);
    border-top-color: var(--accent, #00d4ff);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Modal invoice redesign ─────────────────────────────────────────────────── */
.modal-box {
    max-height: 90vh;
    overflow: hidden;
}

.modal-invoice-label {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent, #00d4ff);
    margin-bottom: 0.25rem;
}

.modal-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.modal-subtitle {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-top: 0.1rem;
}

.inv-cycle-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.72rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 0.15rem 0.55rem;
    border-radius: 100px;
}

.inv-action-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.15rem 0.55rem;
    border-radius: 100px;
}

.inv-upgrade {
    background: rgba(99, 179, 237, 0.12);
    color: #63b3ed;
    border: 1px solid rgba(99, 179, 237, 0.25);
}

.inv-downgrade {
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.25);
}

.inv-new {
    background: rgba(var(--accent, #00d4ff), 0.08);
    color: var(--accent, #00d4ff);
    border: 1px solid color-mix(in srgb, var(--accent, #00d4ff) 30%, transparent);
}

/* ── Invoice body ────────────────────────────────────────────────────────────── */
.inv-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 12px;
    max-height: 50vh;
    overflow-y: auto;
    scrollbar-width: none;
    /* Firefox */
}

.inv-body::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Edge */
}

.inv-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.7rem 1rem;
    font-size: 0.84rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.inv-row:last-child {
    border-bottom: none;
}

.inv-label {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    color: var(--muted);
    flex: 1;
}

.inv-label-sub {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 400;
}

.inv-value {
    font-weight: 600;
    color: var(--white);
    white-space: nowrap;
    text-align: right;
}

.inv-green {
    color: #34d399;
}

.inv-row-discount {
    background: rgba(52, 211, 153, 0.04);
}

.inv-row-credit {
    background: rgba(52, 211, 153, 0.04);
}

.inv-row-bonus {
    background: rgba(52, 211, 153, 0.04);
}

.inv-row-tax {
    background: rgba(255, 255, 255, 0.015);
}

.inv-divider {
    height: 1px;
    background: var(--border);
    margin: 0;
}

.inv-divider-bold {
    /* height: 2px; */
    background: rgba(255, 255, 255, 0.12);
}

.inv-row-grand {
    position: sticky;
    bottom: 2.45rem;
    padding: 0.5rem 1rem;
    font-weight: 800;
    font-size: 0.92rem;
    color: var(--white);
    background: var(--navy);
}

.inv-grand-value {
    font-family: var(--font-display);
    font-size: 0.92rem;
    font-weight: 900;
    color: var(--accent, #00d4ff);
    white-space: nowrap;
}

.inv-expires {
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1rem;
    font-size: 0.78rem;
    color: var(--muted);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    /* background: rgba(255, 255, 255, 0.01); */
    background: var(--navy);
}

.inv-expires strong {
    color: var(--white);
}
</style>