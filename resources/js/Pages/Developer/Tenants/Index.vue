<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import DevLayout from '@/Layouts/DevLayout.vue'

const props = defineProps({
    tenants: Array,
    totalTenants: Number,
})

function quotaLabel(t) {
    return t.max_users === null ? `${t.user_count} / ∞` : `${t.user_count} / ${t.max_users}`
}

function daysLeftLabel(t) {
    if (t.days_left === null) return '—'
    if (t.days_left < 0) return 'Expired'
    return `${t.days_left} hari`
}

function statusClass(t) {
    if (t.status === 'Aktif') return 'bg-emerald-400/10 text-emerald-400'
    if (t.status === 'Expired') return 'bg-amber-400/10 text-amber-400'
    return 'bg-rose-400/10 text-rose-400'
}

function deleteTenant(tenant) {
    if (!confirm(`Hapus "${tenant.name}"? Database tenant akan ikut terhapus permanen.`)) return
    useForm({}).delete(route('developer.tenants.delete', tenant.id))
}

function toggleTenant(tenant) {
    useForm({}).post(route('developer.tenants.toggle', tenant.id))
}
</script>

<template>

    <Head title="Manajemen Tenant" />
    <DevLayout>
        <div class="max-w-7xl mx-auto px-6 py-8">

            <!-- Header -->
            <div class="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-xl font-extrabold mb-1">Manajemen Tenant</h1>
                    <p class="text-sm text-[var(--muted)]">Semua sekolah / lembaga yang terdaftar di platform.</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-extrabold text-[var(--cyan)]">{{ totalTenants }}</div>
                    <div class="text-xs text-[var(--muted)]">Total Tenant</div>
                </div>
            </div>

            <!-- Flash -->
            <div v-if="$page.props.flash?.success"
                class="px-4 py-3 rounded-lg text-sm mb-4 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400">
                {{ $page.props.flash.success }}
            </div>

            <!-- Table -->
            <div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] overflow-x-auto">
                <table class="w-full border-collapse text-sm min-w-[860px]" v-if="tenants.length">
                    <thead>
                        <tr class="border-b border-[var(--border)]">
                            <th
                                class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold whitespace-nowrap">
                                Nama Lembaga</th>
                            <th
                                class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold">
                                Subdomain</th>
                            <th
                                class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold">
                                Plan</th>
                            <th
                                class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold">
                                Kuota</th>
                            <th
                                class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold">
                                Sisa Waktu</th>
                            <th
                                class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold">
                                Status</th>
                            <th class="px-5 py-3 w-[160px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tenant in tenants" :key="tenant.id"
                            class="border-t border-[var(--border)] hover:bg-white/[0.02] transition">
                            <td class="px-5 py-3.5 font-semibold whitespace-nowrap">{{ tenant.name }}</td>
                            <td class="px-5 py-3.5">
                                <span v-for="domain in tenant.domains" :key="domain"
                                    class="inline-block font-mono text-xs bg-[var(--cyan)]/8 text-[var(--cyan)] px-2 py-0.5 rounded mr-1">
                                    {{ domain }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5 capitalize">{{ tenant.plan }}</td>
                            <td class="px-5 py-3.5 tabular-nums">{{ quotaLabel(tenant) }}</td>
                            <td class="px-5 py-3.5">{{ daysLeftLabel(tenant) }}</td>
                            <td class="px-5 py-3.5">
                                <span class="text-xs font-bold px-2.5 py-1 rounded-full" :class="statusClass(tenant)">
                                    {{ tenant.status }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5">
                                <div class="flex items-center gap-1.5 justify-end">
                                    <Link :href="route('developer.tenants.show', tenant.id)"
                                        class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition">
                                        Detail
                                    </Link>
                                    <Link :href="route('developer.tenants.edit', tenant.id)"
                                        class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition">
                                        Edit
                                    </Link>
                                    <button @click="deleteTenant(tenant)"
                                        class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-rose-400/30 text-rose-400 hover:bg-rose-400/10 transition">
                                        Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-else class="py-16 text-center text-sm text-[var(--muted)]">
                    Belum ada tenant yang terdaftar.
                </div>
            </div>
        </div>
    </DevLayout>
</template>