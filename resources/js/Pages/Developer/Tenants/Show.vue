<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import DevLayout from '@/Layouts/DevLayout.vue'

const props = defineProps({ tenant: Object })

function deleteTenant() {
    if (!confirm(`Hapus "${props.tenant.name}"? Database tenant akan ikut terhapus permanen.`)) return
    useForm({}).delete(route('developer.tenants.delete', props.tenant.id))
}

function toggleTenant() {
    useForm({}).post(route('developer.tenants.toggle', props.tenant.id))
}

const statusClass = props.tenant.status === 'Aktif'
    ? 'bg-emerald-400/10 text-emerald-400'
    : props.tenant.status === 'Expired'
        ? 'bg-amber-400/10 text-amber-400'
        : 'bg-rose-400/10 text-rose-400'
</script>

<template>

    <Head :title="tenant.name" />
    <DevLayout>
        <div class="mx-auto px-6 py-8">

            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 text-xs text-[var(--muted)] mb-6">
                <Link :href="route('developer.tenants.index')" class="hover:text-white transition">Tenant</Link>
                <span>/</span>
                <span class="text-white">{{ tenant.name }}</span>
            </div>

            <!-- Header card -->
            <div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-6 mb-4">
                <div class="flex items-start gap-4">
                    <img v-if="tenant.logo_path" :src="tenant.logo_path" :alt="tenant.name"
                        class="w-16 h-16 rounded-xl object-cover border border-[var(--border)]" />
                    <div class="w-16 h-16 rounded-xl border border-[var(--border)] bg-white/5 flex items-center justify-center text-2xl font-black text-[var(--muted)]"
                        v-else>
                        {{ tenant.name?.charAt(0) }}
                    </div>

                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h1 class="text-xl font-extrabold truncate">{{ tenant.name }}</h1>
                            <span class="text-xs font-bold px-2.5 py-1 rounded-full" :class="statusClass">
                                {{ tenant.status }}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            <span v-for="d in tenant.domains" :key="d"
                                class="font-mono text-xs bg-[var(--cyan)]/8 text-[var(--cyan)] px-2 py-0.5 rounded">
                                {{ d }}
                            </span>
                        </div>
                        <p class="text-xs text-[var(--muted)] mt-1.5">Terdaftar {{ tenant.created_at }}</p>
                    </div>

                    <div class="flex gap-2 flex-shrink-0">
                        <button @click="toggleTenant" class="px-3 py-1.5 text-xs font-bold rounded-lg border transition"
                            :class="tenant.is_active
                                ? 'border-rose-400/30 text-rose-400 hover:bg-rose-400/10'
                                : 'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10'">
                            {{ tenant.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                        </button>
                        <Link :href="route('developer.tenants.edit', tenant.id)"
                            class="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 transition">
                            Edit
                        </Link>
                    </div>
                </div>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div class="rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4">
                    <div class="text-xs text-[var(--muted)] mb-1">Plan</div>
                    <div class="font-bold capitalize">{{ tenant.plan }}</div>
                </div>
                <div class="rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4">
                    <div class="text-xs text-[var(--muted)] mb-1">Kuota User</div>
                    <div class="font-bold tabular-nums">
                        {{ tenant.user_count }} / {{ tenant.max_users ?? '∞' }}
                    </div>
                </div>
                <div class="rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4">
                    <div class="text-xs text-[var(--muted)] mb-1">Sisa Waktu</div>
                    <div class="font-bold">
                        {{ tenant.days_left === null ? '—' : tenant.days_left < 0 ? 'Expired' : tenant.days_left
                            + ' hari' }} </div>
                    </div>
                    <div class="rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4">
                        <div class="text-xs text-[var(--muted)] mb-1">Kedaluwarsa</div>
                        <div class="font-bold">{{ tenant.expires_at ?? '—' }}</div>
                    </div>
                </div>

                <!-- Detail info -->
                <div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] divide-y divide-[var(--border)]">
                    <div class="px-6 py-4">
                        <h2 class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Informasi Lembaga
                        </h2>
                    </div>
                    <template v-for="(row, i) in [
                        { label: 'Jenis Lembaga', value: tenant.institution_type },
                        { label: 'Jenjang', value: tenant.school_level?.toUpperCase() ?? '—' },
                        { label: 'NPSN', value: tenant.npsn ?? '—' },
                        { label: 'NSS', value: tenant.nss ?? '—' },
                        { label: 'No. Izin / Legalitas', value: tenant.registration_number ?? '—' },
                        { label: 'Telepon', value: tenant.contact_phone ?? '—' },
                        { label: 'Email Lembaga', value: tenant.institution_email ?? '—' },
                        { label: 'Website', value: tenant.institution_website ?? '—' },
                        { label: 'Alamat', value: tenant.address ?? '—' },
                    ]" :key="i">
                        <div class="px-6 py-3.5 flex gap-4">
                            <div class="w-44 flex-shrink-0 text-xs text-[var(--muted)] pt-0.5">{{ row.label }}</div>
                            <div class="text-sm">{{ row.value }}</div>
                        </div>
                    </template>
                </div>

                <!-- Danger zone -->
                <div class="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5">
                    <h2 class="text-sm font-bold text-rose-400 mb-1">Zona Berbahaya</h2>
                    <p class="text-xs text-[var(--muted)] mb-3">Menghapus tenant akan menghapus seluruh database dan
                        data lembaga secara
                        permanen.</p>
                    <button @click="deleteTenant"
                        class="px-4 py-2 text-xs font-bold rounded-lg bg-rose-400 text-[#0a0f1e] hover:opacity-90 transition">
                        Hapus Tenant Ini
                    </button>
                </div>
            </div>
    </DevLayout>
</template>