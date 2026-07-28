<script setup>
import { Head, Link, usePage, router } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import SubscriptionInvoiceModal from '@/Components/SubscriptionInvoiceModal.vue'
import { handleSubscriptionResponse, postSubscriptionJson } from '@/Utils/subscriptionPayment'
import OwnerLayout from '@/Layouts/OwnerLayout.vue'


const props = defineProps({
    orders: Object, // hasil paginate() Laravel: { data: [...], links: [...], meta / current_page dst }
})

const page = usePage()
const flash = computed(() => page.props.flash ?? {})
const showModal = ref(false)
const modalCalc = ref(null)
const modalLoading = ref(false)
const submitting = ref(false)
const activeOrderId = ref(null)

const statusMap = {
    paid: { label: '✓ Lunas', class: 'badge-paid' },
    pending: { label: '⏳ Menunggu', class: 'badge-pending' },
    failed: { label: '✗ Gagal', class: 'badge-failed' },
}

function statusInfo(status) {
    return statusMap[status] ?? { label: status, class: 'badge-pending' }
}

function formatPrice(amount) {
    if (amount === null || amount === undefined) return '-'
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount)
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
    })
}

function csrfToken() {
    return page.props.csrf_token
        ?? document.querySelector('meta[name="csrf-token"]')?.content
        ?? ''
}

async function openPayModal(orderId) {
    activeOrderId.value = orderId
    modalCalc.value = null
    modalLoading.value = true
    showModal.value = true
    try {
        const res = await fetch(route('owner.subscription.order-preview', orderId), {
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
    activeOrderId.value = null
}

async function confirmPay() {
    if (!activeOrderId.value || submitting.value) return
    submitting.value = true

    try {
        const data = await postSubscriptionJson(
            route('owner.subscription.retry', activeOrderId.value),
            csrfToken()
        )
        const orderId = activeOrderId.value
        closeModal()

        handleSubscriptionResponse(data, {
            onError: (msg) => alert(msg),
            onAlreadyPaid: () => router.visit(route('owner.subscription.invoice', orderId)),
        })
    } catch (e) {
        alert(e.message ?? 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
        submitting.value = false
    }
}

function cancelOrder(orderId) {
    if (!confirm('Batalkan pesanan ini? Tindakan ini tidak bisa dibatalkan.')) return
    router.post(route('owner.subscription.cancel-order', orderId), {}, { preserveScroll: true })
}
</script>

<template>

    <Head title="Billing History" />
    <OwnerLayout>
        <template #header>
            <h1 class="topbar-title">My Billing History</h1>
        </template>

        <div v-if="flash.success" class="flash flash-success">{{ flash.success }}</div>
        <div v-if="flash.warning" class="flash flash-warning">{{ flash.warning }}</div>
        <div v-if="flash.info" class="flash flash-info">{{ flash.info }}</div>

        <div class="history-card overflow-x-auto">
            <table class="history-table whitespace-nowrap" v-if="orders.data.length">
                <thead>
                    <tr>
                        <th># Invoice</th>
                        <th>Plan</th>
                        <th>Subscription</th>
                        <th>Invoice Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders.data" :key="order.order_id">
                        <td class="mono">{{ order.order_id }}</td>
                        <td>{{ order.plan_name ?? '-' }}</td>
                        <td>{{ order.billing_cycle === 'yearly' ? 'Yearly' : 'Monthly' }}</td>
                        <td>{{ formatDate(order.created_at) }}</td>
                        <td>{{ formatPrice(order.amount) }}</td>
                        <td>
                            <span class="badge" :class="statusInfo(order.status).class">
                                {{ statusInfo(order.status).label }}
                            </span>
                        </td>
                        <td>
                            <div class="action-group" v-if="order.status === 'pending'">
                                <button class="pay-btn" @click="openPayModal(order.order_id)">💳 Bayar</button>
                                <button class="cancel-btn" @click="cancelOrder(order.order_id)">Batalkan</button>
                            </div>
                            <Link v-else :href="route('owner.subscription.invoice', order.order_id)" class="view-link">
                                Detail →
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-else class="history-empty">
                Belum ada transaksi. Silakan pilih paket di halaman Upgrade Premium.
            </div>
        </div>

        <SubscriptionInvoiceModal :show="showModal" :loading="modalLoading" :submitting="submitting" :calc="modalCalc"
            :plan-name="modalCalc?.plan_name" :accent-color="modalCalc?.plan_accent" @close="closeModal"
            @confirm="confirmPay" />

        <div class="pagination" v-if="orders.links && orders.links.length > 3">
            <Link v-for="(link, i) in orders.links" :key="i" :href="link.url || ''" class="page-btn"
                :class="{ 'page-btn-active': link.active, 'page-btn-disabled': !link.url }" v-html="link.label"
                preserve-scroll />
        </div>
    </OwnerLayout>
</template>

<style scoped>
.flash {
    padding: 0.7rem 1rem;
    border-radius: 10px;
    font-size: 0.85rem;
    margin-bottom: 1.25rem;
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

.flash-info {
    background: rgba(99, 179, 237, 0.1);
    border: 1px solid rgba(99, 179, 237, 0.3);
    color: #63b3ed;
}

.history-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    /* overflow: hidden; */
}

.history-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.84rem;
}

.history-table th {
    text-align: left;
    padding: 0.85rem 1.1rem;
    color: var(--muted);
    font-weight: 600;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid var(--border);
}

.history-table td {
    padding: 0.85rem 1.1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    color: var(--white);
}

.history-table tr:last-child td {
    border-bottom: none;
}

.mono {
    font-family: monospace;
    font-size: 0.78rem;
    color: var(--muted);
}

.badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
    font-size: 0.72rem;
    font-weight: 700;
}

.badge-paid {
    background: rgba(52, 211, 153, 0.12);
    color: #34d399;
}

.badge-pending {
    background: rgba(251, 191, 36, 0.12);
    color: #fbbf24;
}

.badge-failed {
    background: rgba(251, 113, 133, 0.12);
    color: #fb7185;
}

.view-link {
    color: var(--cyan);
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
}

.view-link:hover {
    text-decoration: underline;
}

.history-empty {
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--muted);
    font-size: 0.88rem;
}

.pagination {
    display: flex;
    gap: 0.35rem;
    justify-content: center;
    margin-top: 1.25rem;
    flex-wrap: wrap;
}

.page-btn {
    padding: 0.35rem 0.7rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 0.8rem;
    text-decoration: none;
}

.page-btn-active {
    color: var(--white);
    border-color: var(--cyan);
    background: rgba(0, 212, 255, 0.08);
}

.page-btn-disabled {
    opacity: 0.3;
    pointer-events: none;
}

.pay-btn {
    padding: 0.3rem 0.7rem;
    border-radius: 8px;
    border: none;
    background: rgba(0, 212, 255, 0.12);
    color: var(--cyan);
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
}

.pay-btn:hover:not(:disabled) {
    background: rgba(0, 212, 255, 0.2);
}

.pay-btn:disabled {
    opacity: 0.5;
    cursor: default;
}

.action-group {
    display: flex;
    gap: 0.4rem;
}

.cancel-btn {
    padding: 0.3rem 0.7rem;
    border-radius: 8px;
    border: 1px solid rgba(251, 113, 133, 0.3);
    background: transparent;
    color: #fb7185;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
}

.cancel-btn:hover {
    background: rgba(251, 113, 133, 0.08);
}
</style>