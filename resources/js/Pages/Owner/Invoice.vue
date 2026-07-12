<script setup>
import { Head, usePage, router } from '@inertiajs/vue3'
import OwnerLayout from '@/Layouts/OwnerLayout.vue'
import SubscriptionInvoiceModal from '@/Components/SubscriptionInvoiceModal.vue'
import { ref } from 'vue'

const props = defineProps({
    order: Object,
    tenant: Object,
    owner: Object,
})

const page = usePage()
const paying = ref(false)
const showModal = ref(false)
const modalCalc = ref(null)
const modalLoading = ref(false)
const submitting = ref(false)

const payTo = {
    name: 'PT Lumi Platforms Indonesia',
    address: 'Jl. Citayam - Parung No. 30 Ragajaya, Kabupaten Bogor, Jawa Barat 16920',
    email: 'billing@lumiverse.co.id',
    phone: '+62 21 5555 0123',
    npwp: '1000 0000 1032 5710',
}

function formatPrice(amount) {
    if (!amount) return 'Rp 0'
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount)
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    })
}

function csrfToken() {
    return page.props.csrf_token
        ?? document.querySelector('meta[name="csrf-token"]')?.content
        ?? ''
}

async function openPayModal() {
    modalCalc.value = null
    modalLoading.value = true
    showModal.value = true
    try {
        const res = await fetch(route('owner.subscription.order-preview', props.order.order_id), {
            headers: { 'Accept': 'application/json' },
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
    modalCalc.value = null
}

async function confirmPay() {
    if (submitting.value) return
    submitting.value = true
    try {
        const res = await fetch(route('owner.subscription.retry', props.order.order_id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken(),
                'Accept': 'application/json',
            },
        })
        const data = await res.json()

        if (data.action === 'already_paid') { closeModal(); router.reload(); return }
        if (data.action === 'failed') { closeModal(); alert('Transaksi ini sudah kedaluwarsa/dibatalkan.'); router.reload(); return }

        if (data.action === 'pay' && data.snap_token) {
            closeModal()
            window.snap.pay(data.snap_token, {
                onSuccess: () => { window.location.href = route('owner.subscription.finish') + '?order_id=' + props.order.order_id },
                onPending: () => router.reload(),
                onError: () => alert('Pembayaran gagal. Silakan coba lagi.'),
                onClose: () => { window.location.href = route('owner.subscription.finish') + '?order_id=' + props.order.order_id },
            })
        }
    } catch (e) {
        alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
        submitting.value = false
    }
}

function print() {
    window.print()
}
</script>

<template>

    <Head :title="'Invoice ' + order.order_id" />
    <OwnerLayout>
        <template #header>
            <h1 class="topbar-title">Payment Invoice #{{ order.order_id }}</h1>
        </template>

        <div class="invoice-actions no-print">
            <button class="btn-print" @click="print">🖨️ Cetak Invoice</button>
        </div>

        <div v-if="order.status === 'pending'" class="status-notice no-print">
            ⏳ Transaksi ini <strong>belum dibayar</strong>.
            <button class="btn-inline-pay" @click="openPayModal">💳 Bayar Sekarang</button>
        </div>
        <div v-else-if="order.status === 'failed'" class="status-notice no-print">
            ⚠️ Transaksi ini <strong>gagal/dibatalkan</strong>. Invoice ini bukan bukti pembayaran resmi.
        </div>

        <!-- ── Kertas invoice — selalu terang, terlepas dari dark mode dashboard ── -->
        <div class="invoice-sheet">

            <div class="inv-top">
                <div>
                    <div class="flex flex-row">
                        <img src="/images/logo-light.webp" alt="Lumiverse School"
                            class="h-10 object-cover mt-1 scale-150 sm:flex hidden" />
                        <div class="inv-brand mt-0.5">LUMIVERSE <span class="inv-brand-accent">SCHOOL</span></div>
                    </div>
                    <div class="inv-status-line">
                        STATUS:
                        <span class="inv-status" :class="'status-' + order.status">
                            {{ order.status === 'paid' ? 'PAID' : order.status.toUpperCase() }}
                        </span>
                    </div>
                    <div class="inv-sub-line" v-if="order.status === 'paid'">
                        Invoice Date Paid: {{ formatDate(order.paid_at) }}
                    </div>
                </div>
                <div class="inv-meta">
                    <div class="inv-meta-title">#INVOICE</div>
                    <div class="inv-meta-row"><span>No.</span><span>{{ order.order_id }}</span></div>
                    <div class="inv-meta-row"><span>Order Date</span><span>{{ formatDate(order.created_at) }}</span>
                    </div>
                </div>
            </div>

            <div class="inv-divider" />

            <div class="party-grid">
                <div class="party-block">
                    <div class="party-label">Invoiced To</div>
                    <div class="party-name">{{ tenant.name }}</div>
                    <div class="party-detail">{{ owner.name }}</div>
                    <!-- <div class="party-detail">{{ owner.email }}</div> -->
                    <!-- <div class="party-detail" v-if="owner.phone">{{ owner.phone }}</div> -->
                    <div class="party-detail" v-if="tenant.address">{{ tenant.address }}</div>
                </div>

                <div class="party-block">
                    <div class="party-label">Pay To</div>
                    <div class="party-name">{{ payTo.name }}</div>
                    <div class="party-detail max-w-md">{{ payTo.address }}</div>
                    <!-- <div class="party-detail">{{ payTo.email }}</div> -->
                    <!-- <div class="party-detail">{{ payTo.phone }}</div> -->
                    <div class="party-detail" v-if="payTo.npwp">NPWP: {{ payTo.npwp }}</div>
                </div>
            </div>

            <div class="inv-table-wrap">
                <div class="inv-table-label">Invoice Items</div>
                <table class="inv-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th class="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="inv-item-title">{{ order.plan_name }} Plan Service</div>
                                <div class="inv-item-sub">
                                    {{ order.billing_cycle === 'yearly' ? 'Yearly Subscription' : 'Monthly Subscription'
                                    }}
                                    <span v-if="order.action === 'upgrade'"> · Upgraded</span>
                                    <span v-else-if="order.action === 'downgrade'"> · Downgrade</span>
                                </div>
                            </td>
                            <td class="text-right">{{ formatPrice(order.subtotal) }}</td>
                        </tr>

                        <tr v-if="order.yearly_discount > 0">
                            <td class="text-muted">Diskon tahunan</td>
                            <td class="text-right inv-green">− {{ formatPrice(order.yearly_discount) }}</td>
                        </tr>

                        <tr v-if="order.discount_amount > 0">
                            <td class="text-muted">Diskon paket {{ order.discount_percent }}%</td>
                            <td class="text-right inv-green">− {{ formatPrice(order.discount_amount) }}</td>
                        </tr>

                        <tr v-if="order.credit_amount > 0">
                            <td class="text-muted">Previous package credit</td>
                            <td class="text-right inv-green">− {{ formatPrice(order.credit_amount) }}</td>
                        </tr>

                        <tr v-if="order.bonus_days > 0">
                            <td class="text-muted">Renewal bonus</td>
                            <td class="text-right inv-green">+ {{ order.bonus_days }} days</td>
                        </tr>
                    </tbody>
                </table>

                <div class="inv-summary">
                    <div class="inv-summary-row">
                        <span>Sub Total</span>
                        <span>{{ formatPrice(order.subtotal - order.yearly_discount - order.discount_amount -
                            order.credit_amount) }}</span>
                    </div>
                    <div class="inv-summary-row" v-if="order.tax_amount > 0">
                        <span>PPN ({{ order.tax_percent }}%)</span>
                        <span>{{ formatPrice(order.tax_amount) }}</span>
                    </div>
                    <div class="inv-summary-row inv-summary-total">
                        <span>Total Paid</span>
                        <span>{{ formatPrice(order.amount) }}</span>
                    </div>
                </div>
            </div>

            <div v-if="order.expires_at" class="inv-expires">
                Active package / plan until <strong>{{ formatDate(order.expires_at) }}</strong>
            </div>

            <div class="inv-footer">
                Invoice ini dibuat otomatis oleh sistem Lumiverse dan sah tanpa tanda tangan basah.
            </div>
        </div>

        <SubscriptionInvoiceModal :show="showModal" :loading="modalLoading" :submitting="submitting" :calc="modalCalc"
            :plan-name="order.plan_name" accent-color="#00d4ff" @close="closeModal" @confirm="confirmPay" />

    </OwnerLayout>
</template>

<style scoped>
.invoice-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

.btn-print {
    padding: 0.55rem 1.1rem;
    border-radius: 10px;
    border: none;
    background: var(--cyan, #00d4ff);
    color: var(--midnight);
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
}

.btn-print:hover {
    opacity: 0.88;
}

.status-notice {
    background: rgba(251, 191, 36, 0.08);
    border: 1px solid rgba(251, 191, 36, 0.25);
    color: #fbbf24;
    padding: 0.7rem 1rem;
    border-radius: 10px;
    font-size: 0.84rem;
    margin-bottom: 1.25rem;
}

/* ── Kertas invoice — SELALU terang, tidak ikut dark mode dashboard ── */
.invoice-sheet {
    background: #ffffff;
    color: #1f2937;
    border-radius: 12px;
    padding: 2.5rem;
    /* max-width: 760px; */
    margin: 0 auto;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}

.inv-top {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.inv-brand {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.75rem;
    color: #111827;
    margin-bottom: 0.5rem;
}

.inv-brand-accent {
    color: #0891b2;
}

.inv-status-line {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.05rem;
    letter-spacing: 0.03em;
    color: #111827;
}

.inv-status.status-paid {
    color: #16a34a;
}

.inv-status.status-pending {
    color: #d97706;
}

.inv-status.status-failed {
    color: #dc2626;
}

.inv-sub-line {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 0.35rem;
}

.inv-meta {
    text-align: right;
}

.inv-meta-title {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1.75rem;
    color: #111827;
    margin-bottom: 0.75rem;
    letter-spacing: 0.05em;
}

.inv-meta-row {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 0.2rem;
}

.inv-meta-row span:last-child {
    color: #111827;
    font-weight: 600;
}

.inv-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 1.5rem 0;
}

.party-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.75rem;
}

.party-block {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.party-label {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #0891b2;
    margin-bottom: 0.35rem;
}

.party-name {
    font-weight: 700;
    font-size: 0.92rem;
    color: #111827;
}

.party-detail {
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.5;
}

.inv-table-wrap {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
}

.inv-table-label {
    padding: 0.65rem 1rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: #374151;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.inv-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
}

.inv-table th {
    text-align: left;
    padding: 0.6rem 1rem;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    border-bottom: 1px solid #e5e7eb;
}

.inv-table td {
    padding: 0.65rem 1rem;
    color: #111827;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: top;
}

.inv-table tbody tr:last-child td {
    border-bottom: none;
}

.inv-item-title {
    font-weight: 600;
}

.inv-item-sub {
    font-size: 0.72rem;
    color: #9ca3af;
    margin-top: 0.15rem;
}

.text-muted {
    color: #6b7280;
}

.text-right {
    text-align: right;
    white-space: nowrap;
}

.inv-green {
    color: #16a34a;
}

.inv-summary {
    padding: 0.85rem 1rem;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
}

.inv-summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.84rem;
    color: #374151;
    padding: 0.2rem 0;
}

.inv-summary-total {
    margin-top: 0.4rem;
    padding-top: 0.6rem;
    border-top: 1px solid #e5e7eb;
    font-weight: 800;
    font-size: 0.95rem;
    color: #111827;
}

.inv-expires {
    margin-top: 1.25rem;
    font-size: 0.8rem;
    color: #6b7280;
}

.inv-expires strong {
    color: #111827;
}

.inv-footer {
    margin-top: 2rem;
    font-size: 0.72rem;
    color: #9ca3af;
    text-align: center;
}

.btn-inline-pay {
    margin-left: 0.5rem;
    padding: 0.2rem 0.6rem;
    border-radius: 8px;
    border: none;
    background: #fbbf24;
    color: #111827;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
}

.btn-inline-pay:disabled {
    opacity: 0.6;
    cursor: default;
}

@media (max-width: 640px) {
    .party-grid {
        grid-template-columns: 1fr;
    }

    .party-block.text-right {
        text-align: left;
    }
}
</style>

<style>
/* Global — print rules menyasar elemen dari OwnerLayout, jadi tidak scoped */
@media print {
    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    .sidebar,
    .topbar,
    .hamburger,
    .no-print {
        display: none !important;
    }

    .app-shell,
    .main-col,
    .content-scroll {
        height: auto !important;
        overflow: visible !important;
        display: block !important;
    }

    .content-inner {
        padding: 0 !important;
    }

    body {
        background: #ffffff !important;
    }

    .invoice-sheet {
        box-shadow: none !important;
        max-width: 100% !important;
        border-radius: 0 !important;
    }
}
</style>