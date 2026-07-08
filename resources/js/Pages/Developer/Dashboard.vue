<script setup>
import { Head } from '@inertiajs/vue3'
import DevLayout from '@/Layouts/DevLayout.vue'
</script>

<template>

    <Head title="Dashboard" />
    <DevLayout>
        <div class="mx-auto px-6 py-6">
            <h1 class="text-xl font-extrabold mb-1">Dashboard</h1>
            <p class="text-sm text-[var(--muted)]">Selamat datang di panel developer Lumiverse.</p>
        </div>
    </DevLayout>
</template>