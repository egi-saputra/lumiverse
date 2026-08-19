<script setup>
import { Link, useForm } from '@inertiajs/vue3'
import { onMounted } from 'vue'

const logoutForm = useForm({})
function logout() { logoutForm.post(route('developer.logout')) }

onMounted(() => { document.documentElement.classList.add('dark') })

const navItems = [
    { label: 'Dashboard', route: 'developer.dashboard' },
    { label: 'Tenant', route: 'developer.tenants.index' },
    { label: 'Paket / Plan', route: 'developer.plans.index' },
    { label: 'Transaksi AI', route: 'developer.ai-invoices.index' },
]
</script>

<template>
    <div class="min-h-screen bg-[var(--midnight)] text-white">
        <!-- Sidebar -->
        <aside
            class="fixed top-0 left-0 h-screen w-56 border-r border-[var(--border)] bg-[var(--navy)] flex flex-col z-50">
            <div class="px-5 py-5 flex items-center gap-2.5 border-b border-[var(--border)]">
                <div
                    class="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--cyan-dim)] flex items-center justify-center text-[var(--midnight)] font-black text-sm">
                    L</div>
                <span class="font-extrabold text-sm tracking-wide">LUMI <span
                        class="text-[var(--cyan)]">DEV</span></span>
            </div>

            <nav class="flex-1 px-3 py-4 flex flex-col gap-1">
                <Link v-for="item in navItems" :key="item.route" :href="route(item.route)"
                    class="px-3 py-2 rounded-lg text-sm font-medium transition" :class="$page.url.startsWith('/' + item.route.split('.')[1])
                        ? 'bg-[var(--cyan)]/10 text-[var(--cyan)]'
                        : 'text-[var(--muted)] hover:text-white hover:bg-white/5'">
                    {{ item.label }}
                </Link>
            </nav>

            <div class="px-3 py-4 border-t border-[var(--border)]">
                <button @click="logout"
                    class="w-full px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5 transition text-left">
                    Keluar
                </button>
            </div>
        </aside>

        <!-- Main content -->
        <div class="ml-56 min-h-screen">
            <slot />
        </div>
    </div>
</template>