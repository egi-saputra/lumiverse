<script setup>
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'

const props = defineProps({
    registrations: Object,
    statusOptions: Array,
})

// ── Emit ke Index.vue (yang handle SweetAlert) ───────────────────
const emit = defineEmits(['delete'])

// ── Status update ───────────────────────────────────────────────

const updating = ref(null)

function updateStatus(registration, status) {
    if (status === registration.status) return
    updating.value = registration.id

    router.patch(
        route('admin.registrations.update-status', registration.id),
        { status },
        {
            preserveScroll: true,
            onFinish: () => { updating.value = null },
        }
    )
}

// ── Hapus satu data: emit ke Index.vue, bukan handle langsung ────
function requestDelete(registration) {
    emit('delete', registration.id, registration.name)
}

// ── Helpers ─────────────────────────────────────────────────────

const STATUS_STYLE = {
    pending: 'bg-amber-100  text-amber-800  dark:bg-amber-900/40  dark:text-amber-300',
    contacted: 'bg-blue-100   text-blue-800   dark:bg-blue-900/40   dark:text-blue-300',
    enrolled: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    rejected: 'bg-red-100    text-red-800    dark:bg-red-900/40    dark:text-red-300',
}

const PROGRAM_STYLE = {
    MPLB: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    BR: 'bg-sky-100    text-sky-800    dark:bg-sky-900/40    dark:text-sky-300',
}

const STATUS_NEXT = {
    pending: ['contacted', 'rejected'],
    contacted: ['enrolled', 'rejected'],
    enrolled: [],
    rejected: ['pending'],
}

const STATUS_LABEL = {
    contacted: 'Proses',
    enrolled: 'Terima',
    rejected: 'Tolak',
    pending: 'Reset',
}
</script>

<template>
    <!-- Table wrapper with horizontal scroll on narrow screens -->
    <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table class="w-full text-sm">
            <thead>
                <tr
                    class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <!-- <th class="px-4 py-3">#</th> -->
                    <th class="px-4 py-3">Nama Pendaftar</th>
                    <th class="px-4 py-3">No. WhatsApp</th>
                    <th class="px-4 py-3">Program Kejuruan</th>
                    <th class="px-4 py-3">Status Pendaftaran</th>
                    <th class="px-4 py-3">Waktu Pendaftaran</th>
                    <th class="px-4 py-3 text-center">Tindakan</th>
                    <th class="px-4 py-3 text-center"></th>
                </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">

                <!-- Empty state -->
                <tr v-if="!registrations.data.length">
                    <td colspan="7" class="py-16 text-center text-gray-400 dark:text-gray-500">
                        <i class="ti ti-inbox text-4xl block mb-2" aria-hidden="true" />
                        Tidak ada data pendaftaran ditemukan.
                    </td>
                </tr>

                <tr v-for="reg in registrations.data" :key="reg.id"
                    class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

                    <!-- ID -->
                    <!-- <td class="px-4 py-3 tabular-nums text-gray-400 dark:text-gray-500 text-xs">
                        {{ reg.id }}
                    </td> -->

                    <!-- Nama + pesan -->
                    <td class="px-4 py-3 max-w-[180px]">
                        <p class="font-medium text-gray-800 dark:text-gray-100 truncate">
                            {{ reg.name }}
                        </p>
                        <p v-if="reg.message" class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5"
                            :title="reg.message">
                            {{ reg.message }}
                        </p>
                    </td>

                    <!-- Telepon -->
                    <td class="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        <a :href="`https://wa.me/${reg.phone.replace(/\D/g, '')}`" target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            <i class="ti ti-brand-whatsapp text-base" aria-hidden="true" />
                            {{ reg.phone }}
                        </a>
                    </td>

                    <!-- Program -->
                    <td class="px-4 py-3">
                        <span :class="[
                            'inline-block rounded-full px-2 py-0.5 text-xs font-semibold',
                            PROGRAM_STYLE[reg.program_short] ?? 'bg-gray-100 text-gray-600',
                        ]">
                            {{ reg.program_short }}
                        </span>
                    </td>

                    <!-- Status badge -->
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                            <span :class="[
                                'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
                                STATUS_STYLE[reg.status],
                            ]">
                                {{ reg.status_label }}
                            </span>
                            <!-- Spinner saat update -->
                            <i v-if="updating === reg.id" class="ti ti-loader-2 animate-spin text-gray-400"
                                aria-hidden="true" />
                        </div>
                    </td>

                    <!-- Tanggal daftar -->
                    <td class="px-4 py-3 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        <time :datetime="reg.created_at" :title="reg.created_at">
                            {{ reg.created_at_human }}
                        </time>
                    </td>

                    <!-- Aksi -->
                    <td class="px-4 py-3">
                        <div class="flex items-center justify-center gap-1.5">

                            <!-- Quick status transitions -->
                            <template v-for="next in STATUS_NEXT[reg.status]" :key="next">
                                <button :title="`Tandai: ${next}`" :disabled="updating === reg.id"
                                    @click="updateStatus(reg, next)"
                                    class="rounded-lg px-2 py-1 text-xs font-medium transition-colors disabled:opacity-40"
                                    :class="{
                                        'bg-blue-50    text-blue-700    hover:bg-blue-100    dark:bg-blue-900/30    dark:text-blue-300': next === 'contacted',
                                        'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300': next === 'enrolled',
                                        'bg-red-50     text-red-700     hover:bg-red-100     dark:bg-red-900/30     dark:text-red-300': next === 'rejected',
                                        'bg-gray-100   text-gray-600   hover:bg-gray-200    dark:bg-gray-800       dark:text-gray-300': next === 'pending',
                                    }">
                                    {{ STATUS_LABEL[next] }}
                                </button>
                            </template>
                        </div>
                    </td>

                    <!-- Delete -->
                    <td class="px-4 py-3">
                        <div class="flex items-center justify-center gap-1.5">
                            <!-- Tombol Hapus — emit ke Index.vue untuk SweetAlert -->
                            <button :disabled="updating === reg.id" @click="requestDelete(reg)"
                                class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-40"
                                title="Hapus pendaftaran ini" aria-label="Hapus pendaftaran">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" aria-hidden="true">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M4 7l16 0" />
                                    <path d="M10 11l0 6" />
                                    <path d="M14 11l0 6" />
                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                </svg>
                            </button>

                        </div>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <div v-if="registrations.meta?.last_page > 1"
        class="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
        <p>
            Menampilkan
            <strong class="text-gray-700 dark:text-gray-200">
                {{ registrations.meta.from }}–{{ registrations.meta.to }}
            </strong>
            dari
            <strong class="text-gray-700 dark:text-gray-200">{{ registrations.meta.total }}</strong>
            data
        </p>

        <div class="flex gap-1">
            <Link v-for="link in registrations.meta.links" :key="link.label" :href="link.url ?? '#'" preserve-scroll
                :class="[
                    'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs transition-colors',
                    link.active
                        ? 'bg-indigo-600 text-white font-semibold'
                        : link.url
                            ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            : 'opacity-40 cursor-not-allowed',
                ]" v-html="link.label" />
        </div>
    </div>
</template>