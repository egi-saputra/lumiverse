<script setup>
import { Head, router, usePage } from '@inertiajs/vue3'
import { ref, watch, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import Swal from 'sweetalert2'
import StatsBar from './Partials/StatsBar.vue'
import RegistrationTable from './Partials/RegistrationTable.vue'

// ── Props dari controller ────────────────────────────────────────

const props = defineProps({
    registrations: Object,
    stats: Object,
    byProgram: Object,
    filters: Object,
    programs: Array,
    statusOptions: Array,
})

// ── Filter state (sync dari URL via props.filters) ───────────────

const search = ref(props.filters.search ?? '')
const status = ref(props.filters.status ?? '')
const program = ref(props.filters.program ?? '')
const perPage = ref(props.filters.per_page ?? 20)

// ── Kirim filter ke server ───────────────────────────────────────

function applyFilters() {
    router.get(
        route('admin.registrations.index'),
        {
            search: search.value || undefined,
            status: status.value || undefined,
            program: program.value || undefined,
            per_page: perPage.value !== 20 ? perPage.value : undefined,
        },
        { preserveState: true, replace: true }
    )
}

const debouncedApply = useDebounceFn(applyFilters, 350)

watch(search, debouncedApply)
watch([status, program, perPage], applyFilters)

function resetFilters() {
    search.value = ''
    status.value = ''
    program.value = ''
    perPage.value = 20
}

// ── Flash message ────────────────────────────────────────────────

const flash = computed(() => usePage().props.flash)

// ── Apakah ada filter aktif? ─────────────────────────────────────

const hasActiveFilter = computed(() =>
    !!(search.value || status.value || program.value)
)

// ── Label deskriptif filter aktif (untuk pesan konfirmasi) ───────

const activeFilterLabel = computed(() => {
    const parts = []
    if (status.value) parts.push(`status "${status.value}"`)
    if (program.value) parts.push(`jurusan "${program.value.split('—')[0].trim()}"`)
    if (search.value) parts.push(`pencarian "${search.value}"`)
    return parts.length ? parts.join(', ') : null
})

// ────────────────────────────────────────────────────────────────
// SweetAlert helper: minta user ketik "HAPUS"
// ────────────────────────────────────────────────────────────────

async function confirmWithTyping(title, html) {
    const result = await Swal.fire({
        title,
        html,
        input: 'text',
        inputPlaceholder: 'Ketik HAPUS di sini',
        inputAttributes: {
            autocomplete: 'off',
            spellcheck: 'false',
            autocorrect: 'off',
            autocapitalize: 'none',
        },
        showCancelButton: true,
        confirmButtonText: '<i class="ti ti-trash mr-1"></i> Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
        focusCancel: true,
        preConfirm: (inputValue) => {
            if (inputValue !== 'HAPUS') {
                Swal.showValidationMessage(
                    '<i class="ti ti-alert-circle mr-1"></i> Ketik persis <b>HAPUS</b> (huruf kapital) untuk melanjutkan'
                )
                return false
            }
            return true
        },
    })

    return result.isConfirmed
}

// ────────────────────────────────────────────────────────────────
// Hapus satu data (dipanggil dari RegistrationTable via emit)
// ────────────────────────────────────────────────────────────────

async function handleSingleDelete(id, name) {
    const confirmed = await confirmWithTyping(
        'Hapus Pendaftaran?',
        `Data pendaftaran atas nama <strong class="text-gray-900">${name}</strong> akan dihapus.
        <br><br>
        Ketik <code style="background:#fee2e2;color:#dc2626;padding:2px 6px;border-radius:4px;font-weight:700">HAPUS</code> untuk mengkonfirmasi.`
    )

    if (!confirmed) return

    router.delete(route('admin.registrations.destroy', id), {
        preserveScroll: true,
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Dihapus!',
                text: `Data pendaftaran ${name} berhasil dihapus.`,
                timer: 2500,
                showConfirmButton: false,
                timerProgressBar: true,
            })
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.',
            })
        },
    })
}

// ────────────────────────────────────────────────────────────────
// Hapus semua / berdasarkan filter aktif
// ────────────────────────────────────────────────────────────────

async function handleBulkDelete() {
    const isFiltered = hasActiveFilter.value
    const totalAll = props.stats?.total ?? 0

    let title, html

    if (isFiltered) {
        // Ada filter aktif → hapus data yang sesuai filter saja
        title = 'Hapus Data Terfilter?'
        html = `Hanya data dengan filter <strong>${activeFilterLabel.value}</strong> yang akan dihapus.
                 <br><br>
                 Ketik <code style="background:#fee2e2;color:#dc2626;padding:2px 6px;border-radius:4px;font-weight:700">HAPUS</code> untuk mengkonfirmasi.`
    } else {
        // Tidak ada filter → hapus semua + rate limits
        title = '⚠️ Hapus SEMUA Data?'
        html = `<div style="color:#dc2626;font-weight:600;margin-bottom:8px;">PERINGATAN: Tindakan ini tidak bisa dibatalkan!</div>
                 Seluruh <strong>${totalAll} data</strong> pendaftaran <u>dan</u> semua data rate-limit akan dihapus.
                 <br><br>
                 Ketik <code style="background:#fee2e2;color:#dc2626;padding:2px 6px;border-radius:4px;font-weight:700">HAPUS</code> untuk mengkonfirmasi.`
    }

    const confirmed = await confirmWithTyping(title, html)
    if (!confirmed) return

    router.delete(route('admin.registrations.bulk-destroy'), {
        data: {
            search: search.value || undefined,
            status: status.value || undefined,
            program: program.value || undefined,
        },
        preserveScroll: true,
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: isFiltered
                    ? 'Data yang sesuai filter berhasil dihapus.'
                    : 'Semua data pendaftaran dan rate-limit berhasil dihapus.',
                timer: 2500,
                showConfirmButton: false,
                timerProgressBar: true,
            })

            // Reset filter setelah hapus semua
            if (!isFiltered) {
                resetFilters()
            }
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.',
            })
        },
    })
}
</script>

<template>

    <Head title="Manajemen Pendaftaran — Admin" />

    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">

        <!-- ── Top bar ────────────────────────────────────────────── -->
        <header
            class="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between gap-4">
                <div class="flex items-center gap-2.5">
                    <i class="ti ti-school text-xl text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    <span class="font-semibold text-gray-800 dark:text-gray-100 text-sm tracking-tight">
                        SMK NUSANTARA
                    </span>
                    <span class="text-gray-300 dark:text-gray-600">/</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Sistem Pendaftaran Murid Baru (SPMB)</span>
                </div>

                <a :href="route('admin.registrations.index', { ...filters, export: 'csv' })"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <i class="ti ti-download text-sm" aria-hidden="true" />
                    Powered By KreatiCraft Indonesia
                </a>
            </div>
        </header>

        <!-- ── Main content ───────────────────────────────────────── -->
        <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">

            <!-- Flash message -->
            <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 -translate-y-2"
                leave-active-class="transition-all duration-200" leave-to-class="opacity-0">
                <div v-if="flash?.success"
                    class="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                    <i class="ti ti-circle-check text-base shrink-0" aria-hidden="true" />
                    {{ flash.success }}
                </div>
            </Transition>

            <!-- ── Page title ──────────────────────────────────────── -->
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Data Pendaftaran Siswa Baru
                    </h1>
                    <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        Kelola dan update status setiap pendaftaran yang masuk.
                    </p>
                </div>

                <!-- ── Tombol hapus bulk ──────────────────────────── -->
                <button v-if="(stats?.total ?? 0) > 0" @click="handleBulkDelete"
                    class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors shrink-0"
                    :class="hasActiveFilter
                        ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'"
                    :title="hasActiveFilter ? 'Hapus semua data yang sesuai filter aktif' : 'Hapus semua data pendaftaran'">
                    <i class="ti ti-trash text-sm" aria-hidden="true" />
                    <span v-if="hasActiveFilter">Hapus Data Terfilter</span>
                    <span v-else>Hapus Semua Data</span>
                </button>
            </div>

            <!-- Statistik -->
            <StatsBar :stats="stats" :by-program="byProgram" />

            <!-- ── Filter bar ──────────────────────────────────────── -->
            <div class="flex flex-wrap items-end gap-3">
                <!-- Search -->
                <div class="relative flex-1 min-w-[180px]">
                    <label for="search" class="sr-only">Cari nama / nomor WA</label>
                    <i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
                        aria-hidden="true" />
                    <input id="search" v-model="search" type="search" placeholder="Cari nama atau nomor HP…"
                        class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>

                <!-- Status filter -->
                <div>
                    <label for="filter-status" class="sr-only">Filter status</label>
                    <select id="filter-status" v-model="status"
                        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-10 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                            {{ opt.label }}
                        </option>
                    </select>
                </div>

                <!-- Program filter -->
                <div>
                    <label for="filter-program" class="sr-only">Filter jurusan</label>
                    <select id="filter-program" v-model="program"
                        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-10 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                        <option value="">Semua Jurusan</option>
                        <option v-for="p in programs" :key="p" :value="p">
                            {{ p.split('—')[0].trim() }}
                        </option>
                    </select>
                </div>

                <!-- Per page -->
                <div>
                    <label for="per-page" class="sr-only">Baris per halaman</label>
                    <select id="per-page" v-model="perPage"
                        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-10 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                        <option :value="10">10 / hal</option>
                        <option :value="20">20 / hal</option>
                        <option :value="50">50 / hal</option>
                        <option :value="100">100 / hal</option>
                    </select>
                </div>

                <!-- Reset -->
                <button v-if="search || status || program || perPage !== 20" @click="resetFilters"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <i class="ti ti-x text-sm" aria-hidden="true" />
                    Reset
                </button>
            </div>

            <!-- ── Tabel ───────────────────────────────────────────── -->
            <!--
                Tambahkan @delete="handleSingleDelete" ke RegistrationTable.
                Component akan emit('delete', id, name) dari tombol hapus per baris.
            -->
            <RegistrationTable :registrations="registrations" :status-options="statusOptions"
                @delete="handleSingleDelete" />

        </main>
    </div>
</template>