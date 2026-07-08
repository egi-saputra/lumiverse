<script setup>
defineProps({
    stats: Object,
    byProgram: Object,
})

const statusCards = (stats) => [
    {
        label: 'Total Pendaftar',
        value: stats?.total ?? 0,
        color: 'neutral',
        icon: 'ti-users',
    },
    {
        label: 'Pending / Belum Diproses',
        value: stats?.pending ?? 0,
        color: 'amber',
        icon: 'ti-clock',
    },
    {
        label: 'Sedang Dihubungi / Diproses',
        value: stats?.contacted ?? 0,
        color: 'blue',
        icon: 'ti-phone',
    },
    {
        label: 'Pendaftaran Diterima',
        value: stats?.enrolled ?? 0,
        color: 'green',
        icon: 'ti-circle-check',
    },
    {
        label: 'Pendaftaran Ditolak',
        value: stats?.rejected ?? 0,
        color: 'red',
        icon: 'ti-circle-x',
    },
]

const colorMap = {
    neutral: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-200',
        icon: 'text-gray-500',
    },
    amber: {
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-300',
        icon: 'text-amber-500',
    },
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        icon: 'text-blue-500',
    },
    green: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        text: 'text-emerald-700 dark:text-emerald-300',
        icon: 'text-emerald-500',
    },
    red: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        icon: 'text-red-500',
    },
}
</script>

<template>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div v-for="card in statusCards(stats)" :key="card.label" :class="[
            'rounded-xl p-4 flex flex-col gap-1',
            colorMap[card.color].bg,
        ]">
            <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {{ card.label }}
                </span>
                <i :class="['ti', card.icon, 'text-lg', colorMap[card.color].icon]" aria-hidden="true" />
            </div>
            <p :class="['text-2xl font-semibold tabular-nums', colorMap[card.color].text]">
                {{ card.value.toLocaleString('id-ID') }}
            </p>
        </div>
    </div>

    <!-- Breakdown per program -->
    <div v-if="byProgram && Object.keys(byProgram).length" class="mt-3 flex flex-wrap gap-2">
        <span v-for="(count, program) in byProgram" :key="program"
            class="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            <span class="font-semibold">{{ count }}</span>
            {{ program.split('—')[0].trim() }}
        </span>
    </div>
</template>