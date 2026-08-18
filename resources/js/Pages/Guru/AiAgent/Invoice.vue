<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'

const props = defineProps({
    invoice: Object,
})

const payTo = {
    name: 'PT Lumi Platforms Indonesia',
    address: 'Jl. Citayam - Parung No. 30 Ragajaya, Kabupaten Bogor, Jawa Barat 16920',
    npwp: '10.000.000.1-032.5710',
}

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    })
}

const formatPrice = (amount) => {
    if (!amount) return 'Rp 0'
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount)
}

const statusLabel = (status) => {
    if (status === 'paid') return 'PAID'
    if (status === 'pending') return 'PENDING'
    return status.toUpperCase()
}

const printInvoice = () => window.print()
const goBack = () => router.visit(route('guru.ai-agent.dashboard'))
</script>

<template>
    <MenuLayout>
        <div class="invoice-page">
            <div class="invoice-actions no-print">
                <button class="btn-back" @click="goBack">← Back</button>
                <button class="btn-print" @click="printInvoice">🖨️ Print Invoice</button>
            </div>

            <!-- ── Invoice sheet — always light, doesn't follow dashboard dark mode ── -->
            <div class="invoice-sheet">

                <div class="inv-top">
                    <div>
                        <div class="flex flex-row">
                            <img src="/images/logo.webp" alt="Lumiverse"
                                class="h-10 object-cover mt-1 scale-150 sm:flex hidden" />
                            <div class="inv-brand mt-0.5">Lumiverse <span class="inv-brand-accent">School</span></div>
                        </div>
                        <div class="inv-status-line">
                            STATUS:
                            <span class="inv-status" :class="'status-' + invoice.status">
                                {{ statusLabel(invoice.status) }}
                            </span>
                        </div>
                        <div class="inv-sub-line" v-if="invoice.status === 'paid'">
                            Invoice Date Paid: {{ formatDate(invoice.paid_at) }}
                        </div>
                    </div>
                    <div class="inv-meta">
                        <div class="inv-meta-title">#INVOICE</div>
                        <div class="inv-meta-row"><span>No.</span><span>{{ invoice.invoice_number }}</span></div>
                        <div class="inv-meta-row"><span>Order Date</span><span>{{ formatDate(invoice.created_at)
                        }}</span></div>
                        <div class="inv-meta-row" v-if="invoice.expires_at"><span>Valid Until</span><span>{{
                            formatDate(invoice.expires_at) }}</span></div>
                    </div>
                </div>

                <div class="inv-divider" />

                <div class="party-grid">
                    <div class="party-block">
                        <div class="party-label">Invoiced To</div>
                        <div class="party-name">{{ invoice.user_name }}</div>
                        <div class="party-detail">{{ invoice.user_email }}</div>
                        <div class="party-detail" v-if="invoice.user_phone">{{ invoice.user_phone }}</div>
                    </div>

                    <div class="party-block">
                        <div class="party-label">Pay To</div>
                        <div class="party-name">{{ payTo.name }}</div>
                        <div class="party-detail max-w-md">{{ payTo.address }}</div>
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
                                    <div class="inv-item-title">{{ invoice.description }}</div>
                                    <div class="inv-item-sub">
                                        {{ invoice.plan_label }} Plan
                                        · {{ invoice.billing_cycle === 'yearly' ? 'Yearly Subscription' : 'Monthly Subscription' }}
                                    </div>
                                </td>
                                <td class="text-right">{{ formatPrice(invoice.amount) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="inv-summary">
                        <div class="inv-summary-row">
                            <span>Sub Total</span>
                            <span>{{ formatPrice(invoice.amount) }}</span>
                        </div>
                        <div class="inv-summary-row inv-summary-total">
                            <span>Total Paid</span>
                            <span>{{ formatPrice(invoice.amount) }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="invoice.expires_at" class="inv-expires">
                    Active package / plan until <strong>{{ formatDate(invoice.expires_at) }}</strong>
                </div>

                <div class="inv-footer">
                    This invoice was generated automatically by the Lumiverse system and is valid without a wet
                    signature.
                    <br class="no-print" />
                    <span class="inv-ref">Ref: {{ invoice.external_id }}</span>
                </div>
            </div>
        </div>
    </MenuLayout>
</template>

<style scoped>
.invoice-page {
    padding: 1.5rem;
    margin: 0 auto;
}

.invoice-actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    margin-bottom: 1rem;
}

.btn-print,
.btn-back {
    border: none;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 0.6rem 1.1rem;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}

.btn-print {
    background: #7c3aed;
    color: #ffffff;
}

.btn-print:hover {
    opacity: 0.88;
}

.btn-back {
    color: #111827;
    background: transparent;
}

.btn-back:hover {
    opacity: 0.7;
}

/* ── Invoice sheet — ALWAYS light, ignores dashboard dark mode ── */
.invoice-sheet {
    background: #ffffff;
    color: #1f2937;
    border-radius: 12px;
    padding: 2.5rem;
    margin: 0 auto;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
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
    color: #7c3aed;
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
    color: #7c3aed;
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

.text-right {
    text-align: right;
    white-space: nowrap;
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
    line-height: 1.6;
}

.inv-ref {
    font-size: 0.68rem;
    color: #d1d5db;
}

@media (max-width: 640px) {
    .party-grid {
        grid-template-columns: 1fr;
    }

    .inv-meta {
        text-align: left;
    }

    .inv-meta-row {
        justify-content: flex-start;
    }
}
</style>

<style>
/* Global print rules — targets elements from MenuLayout, so not scoped */
@media print {
    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    #theme-transition-layer {
        display: none !important;
    }

    .no-print {
        display: none !important;
    }

    .layout-shell {
        height: auto !important;
        overflow: visible !important;
        display: block !important;
        background: #ffffff !important;
    }

    .layout-main {
        display: block !important;
        min-height: 0 !important;
    }

    .layout-content {
        padding: 0 !important;
        overflow: visible !important;
        background: #ffffff !important;
    }

    body {
        background: #ffffff !important;
    }

    .invoice-page {
        padding: 0 !important;
        max-width: 100% !important;
    }

    .invoice-sheet {
        box-shadow: none !important;
        max-width: 100% !important;
        border-radius: 0 !important;
    }
}
</style>