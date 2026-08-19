<script setup>
import { Head, router } from '@inertiajs/vue3'
import { reactive } from 'vue'
import DevLayout from '@/Layouts/DevLayout.vue'

const props = defineProps({
    invoices: Object,
    summary: Object,
    filters: Object,
})

const form = reactive({
    search: props.filters.search ?? '',
    status: props.filters.status ?? '',
    plan: props.filters.plan ?? '',
    period: props.filters.period ?? 'all',
})

function applyFilters() {
    router.get(route('developer.ai-invoices.index'), form, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    })
}

function clearFilters() {
    form.search = ''
    form.status = ''
    form.plan = ''
    form.period = 'all'
    applyFilters()
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0)
}

function statusClass(status) {
    return {
        paid: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
        pending: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
        expired: 'bg-slate-400/10 text-slate-300 border-slate-400/20',
        failed: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
    }[status] ?? 'bg-white/5 text-[var(--muted)] border-[var(--border)]'
}

function statusLabel(status) {
    return {
        paid: 'Paid',
        pending: 'Pending',
        expired: 'Expired',
        failed: 'Failed',
    }[status] ?? status
}
</script>

<template>
    <Head title="Transaksi AI" />
    <DevLayout>
        <div class="mx-auto max-w-[1500px] px-6 py-8">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-7">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.18em] text-[var(--cyan)] mb-2">Central monitoring</p>
                    <h1 class="text-2xl font-extrabold tracking-tight">Riwayat Transaksi AI</h1>
                    <p class="mt-1 text-sm text-[var(--muted)]">Pantau invoice Xendit dari seluruh tenant Lumiverse.</p>
                </div>
                <div class="text-xs text-[var(--muted)]">{{ invoices.total }} transaksi ditemukan</div>
            </div>

            <div class="grid grid-cols-2 gap-3 xl:grid-cols-4 mb-5">
                <div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-4">
                    <p class="text-xs text-[var(--muted)]">Total transaksi</p>
                    <p class="mt-2 text-2xl font-extrabold tabular-nums">{{ summary.total }}</p>
                </div>
                <div class="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
                    <p class="text-xs text-emerald-300/70">Berhasil</p>
                    <p class="mt-2 text-2xl font-extrabold text-emerald-400 tabular-nums">{{ summary.paid }}</p>
                </div>
                <div class="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-4">
                    <p class="text-xs text-amber-300/70">Menunggu pembayaran</p>
                    <p class="mt-2 text-2xl font-extrabold text-amber-400 tabular-nums">{{ summary.pending }}</p>
                </div>
                <div class="rounded-2xl border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.04] p-4">
                    <p class="text-xs text-[var(--cyan)]/70">Pendapatan berhasil</p>
                    <p class="mt-2 text-lg font-extrabold text-[var(--cyan)] tabular-nums">{{ formatCurrency(summary.revenue) }}</p>
                </div>
            </div>

            <form @submit.prevent="applyFilters" class="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-4">
                <div class="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_150px_150px_150px_auto_auto]">
                    <input v-model="form.search" type="search" placeholder="Cari external ID, invoice ID, tenant..."
                        class="min-w-0 rounded-lg border border-[var(--border)] bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-[var(--cyan)]" />
                    <select v-model="form.status" class="rounded-lg border border-[var(--border)] bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--cyan)]">
                        <option value="">Semua status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                        <option value="failed">Failed</option>
                    </select>
                    <select v-model="form.plan" class="rounded-lg border border-[var(--border)] bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--cyan)]">
                        <option value="">Semua plan</option>
                        <option value="pro">Pro</option>
                        <option value="max">Max</option>
                    </select>
                    <select v-model="form.period" class="rounded-lg border border-[var(--border)] bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--cyan)]">
                        <option value="all">Semua waktu</option>
                        <option value="today">Hari ini</option>
                        <option value="7d">7 hari terakhir</option>
                        <option value="30d">30 hari terakhir</option>
                    </select>
                    <button type="submit" class="rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-bold text-[#0a0f1e] transition hover:opacity-90">Terapkan</button>
                    <button type="button" @click="clearFilters" class="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:border-white/20 hover:text-white">Reset</button>
                </div>
            </form>

            <div class="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--navy)]">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1050px] border-collapse text-sm">
                        <thead>
                            <tr class="border-b border-[var(--border)] bg-white/[0.02]">
                                <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Transaksi</th>
                                <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Tenant</th>
                                <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Plan</th>
                                <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Nominal</th>
                                <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Status</th>
                                <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Dibuat</th>
                            </tr>
                        </thead>
                        <tbody v-if="invoices.data.length">
                            <tr v-for="invoice in invoices.data" :key="invoice.id" class="border-t border-[var(--border)] transition hover:bg-white/[0.025]">
                                <td class="px-5 py-4">
                                    <div class="font-mono text-xs text-white">{{ invoice.external_id }}</div>
                                    <div class="mt-1 text-xs text-[var(--muted)]">{{ invoice.invoice_id ?? 'Belum ada invoice Xendit' }}</div>
                                </td>
                                <td class="px-5 py-4">
                                    <div class="font-semibold">{{ invoice.tenant_name }}</div>
                                    <div class="mt-1 font-mono text-xs text-[var(--cyan)]">#{{ invoice.tenant_id ?? '—' }}</div>
                                </td>
                                <td class="px-5 py-4">
                                    <span class="rounded-md bg-white/5 px-2 py-1 text-xs font-bold uppercase">{{ invoice.plan_key }}</span>
                                </td>
                                <td class="px-5 py-4 font-semibold tabular-nums">{{ formatCurrency(invoice.amount) }}</td>
                                <td class="px-5 py-4">
                                    <span class="rounded-full border px-2.5 py-1 text-xs font-bold" :class="statusClass(invoice.status)">{{ statusLabel(invoice.status) }}</span>
                                    <div v-if="invoice.paid_at" class="mt-1 text-xs text-[var(--muted)]">{{ invoice.paid_at }}</div>
                                </td>
                                <td class="px-5 py-4 text-xs text-[var(--muted)] whitespace-nowrap">{{ invoice.created_at }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="!invoices.data.length" class="px-6 py-16 text-center text-sm text-[var(--muted)]">Belum ada transaksi yang cocok dengan filter.</div>

                <div v-if="invoices.links.length > 3" class="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-4">
                    <span class="text-xs text-[var(--muted)]">Halaman {{ invoices.current_page }} dari {{ invoices.last_page }}</span>
                    <div class="flex flex-wrap gap-1">
                        <template v-for="(link, index) in invoices.links" :key="index">
                            <a v-if="link.url" :href="link.url" v-html="link.label" class="rounded-md border px-2.5 py-1.5 text-xs transition" :class="link.active ? 'border-[var(--cyan)] bg-[var(--cyan)]/10 text-[var(--cyan)]' : 'border-[var(--border)] text-[var(--muted)] hover:text-white'"></a>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </DevLayout>
</template>
