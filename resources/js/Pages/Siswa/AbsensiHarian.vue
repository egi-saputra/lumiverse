<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import { Head } from '@inertiajs/vue3'

const props = defineProps({
    sekretaris: { type: Object, required: true },
    daftar_siswa: { type: Array, default: () => [] },
    absensi_hari_ini: { type: Array, default: () => [] },
    sudah_disimpan: { type: Boolean, default: false },
    rekap_bulan: { type: Object, default: () => ({ hadir: 0, sakit: 0, izin: 0, alpha: 0, total_hari_aktif: 0 }) },
})

const STATUS = {
    hadir: { label: 'Hadir', short: 'H', icon: 'ti-circle-check', bg: '#EAF3DE', text: '#3B6D11', border: '#97C459', ring: '#639922' },
    sakit: { label: 'Sakit', short: 'S', icon: 'ti-heart-rate-monitor', bg: '#FAEEDA', text: '#854F0B', border: '#EF9F27', ring: '#BA7517' },
    izin: { label: 'Izin', short: 'I', icon: 'ti-file-description', bg: '#E6F1FB', text: '#185FA5', border: '#85B7EB', ring: '#378ADD' },
    alpha: { label: 'Alpha', short: 'A', icon: 'ti-circle-x', bg: '#FCEBEB', text: '#A32D2D', border: '#F09595', ring: '#E24B4A' },
}

const now = ref(new Date())
const loading = ref(false)
const showConfirm = ref(false)
const search = ref('')
const filterStatus = ref('semua')
const errors = ref({})
const absensiMap = ref({})

const page = usePage()
const flashMsg = ref(page.props.flash?.success || page.props.flash?.error || null)
const flashType = ref(page.props.flash?.error ? 'error' : 'success')

function localDateString(d) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

function initAbsensiMap() {
    const map = {}
    props.daftar_siswa.forEach(s => {
        const existing = props.absensi_hari_ini.find(a => a.siswa_id === s.id)
        const status = existing?.status || 'hadir'
        map[s.id] = {
            status,
            keterangan: existing?.keterangan || '',
            // showKet: true jika status butuh ket ATAU sudah ada keterangan tersimpan
            showKet: bolehKeterangan(status) || !!(existing?.keterangan),
        }
    })
    absensiMap.value = map
}

let clockTimer
onMounted(() => {
    initAbsensiMap()
    clockTimer = setInterval(() => { now.value = new Date() }, 1000)
    if (flashMsg.value) setTimeout(() => { flashMsg.value = null }, 4500)
})
onUnmounted(() => clearInterval(clockTimer))

const tanggalFormatted = computed(() =>
    now.value.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)
const jamFormatted = computed(() =>
    now.value.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
)
const daftarFiltered = computed(() => {
    let list = props.daftar_siswa
    if (search.value.trim()) {
        const q = search.value.toLowerCase()
        list = list.filter(s => s.nama.toLowerCase().includes(q) || String(s.nis).includes(q))
    }
    if (filterStatus.value !== 'semua') {
        list = list.filter(s => absensiMap.value[s.id]?.status === filterStatus.value)
    }
    return list
})
const summary = computed(() => {
    const counts = { hadir: 0, sakit: 0, izin: 0, alpha: 0 }
    Object.values(absensiMap.value).forEach(a => {
        if (a.status && counts[a.status] !== undefined) counts[a.status]++
    })
    return { ...counts, total: props.daftar_siswa.length }
})
const persenHadir = computed(() => {
    if (!summary.value.total) return 0
    return Math.round((summary.value.hadir / summary.value.total) * 100)
})
const allFilled = computed(() =>
    props.daftar_siswa.every(s => !!absensiMap.value[s.id]?.status)
)

// Apakah status ini boleh punya keterangan?
function bolehKeterangan(status) {
    // return status !== 'hadir'
    return status === 'izin' || status === 'alpha'
}

function setStatus(siswaId, status) {
    if (props.sudah_disimpan) return
    absensiMap.value[siswaId].status = status
    if (bolehKeterangan(status)) {
        // Langsung tampilkan textarea, tidak perlu klik toggle
        absensiMap.value[siswaId].showKet = true
    } else {
        absensiMap.value[siswaId].keterangan = ''
        absensiMap.value[siswaId].showKet = false
    }
    delete errors.value[siswaId]
}

function toggleKet(siswaId) {
    if (props.sudah_disimpan) return
    absensiMap.value[siswaId].showKet = !absensiMap.value[siswaId].showKet
}

function setAllHadir() {
    if (props.sudah_disimpan) return
    props.daftar_siswa.forEach(s => {
        absensiMap.value[s.id].status = 'hadir'
        absensiMap.value[s.id].keterangan = ''
        absensiMap.value[s.id].showKet = false
    })
}

function submitAbsensi() {
    errors.value = {}
    let valid = true
    props.daftar_siswa.forEach(s => {
        if (!absensiMap.value[s.id]?.status) {
            errors.value[s.id] = 'Status wajib dipilih'
            valid = false
        }
    })
    if (!valid) {
        flashMsg.value = 'Ada siswa yang belum dipilih statusnya.'
        flashType.value = 'error'
        showConfirm.value = false
        return
    }

    loading.value = true
    const payload = props.daftar_siswa.map(s => ({
        siswa_id: s.id,
        status: absensiMap.value[s.id].status,
        keterangan: absensiMap.value[s.id].keterangan || null,
    }))

    router.post(route('siswa.absensi.store'), {
        kelas_id: props.sekretaris.kelas_id,
        tanggal: localDateString(now.value),
        absensi: payload,
    }, {
        onSuccess: () => {
            showConfirm.value = false
            loading.value = false
            flashMsg.value = 'Absensi berhasil disimpan!'
            flashType.value = 'success'
            setTimeout(() => { flashMsg.value = null }, 4500)
        },
        onError: () => {
            loading.value = false
            showConfirm.value = false
            flashMsg.value = 'Gagal menyimpan. Periksa kembali data absensi.'
            flashType.value = 'error'
        },
        preserveScroll: true,
    })
}
</script>

<template>

    <Head title="Input Absensi Kelas" />

    <div class="page-wrap">

        <!-- Flash -->
        <Transition name="flash">
            <div v-if="flashMsg" class="flash" :class="flashType" role="alert" aria-live="polite">
                <i :class="flashType === 'success' ? 'ti ti-circle-check' : 'ti ti-alert-circle'" aria-hidden="true" />
                <span>{{ flashMsg }}</span>
                <button @click="flashMsg = null" class="flash-x" aria-label="Tutup notifikasi">
                    <i class="ti ti-x" />
                </button>
            </div>
        </Transition>

        <!-- Topbar -->
        <header class="topbar">
            <div class="topbar-inner">
                <div class="topbar-left">
                    <div class="topbar-logo" aria-hidden="true"><i class="ti ti-clipboard-list" /></div>
                    <div>
                        <div class="topbar-title">Input Absensi</div>
                        <div class="topbar-sub">{{ sekretaris.kelas_nama }} · Sekretaris</div>
                    </div>
                </div>
                <div class="topbar-clock">
                    <div class="clock-hms">{{ jamFormatted }}</div>
                    <div class="clock-date">{{ tanggalFormatted }}</div>
                </div>
            </div>
        </header>

        <main class="page-main">

            <!-- Info Bar -->
            <div class="info-bar">
                <div class="info-bar-left">
                    <div class="avatar-circle" aria-hidden="true">
                        {{sekretaris.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}}
                    </div>
                    <div>
                        <p class="info-nama">{{ sekretaris.nama }}</p>
                        <p class="info-meta">NIS {{ sekretaris.nis }} · Sekretaris Kelas</p>
                    </div>
                </div>
                <div class="info-bar-right">
                    <div v-if="sudah_disimpan" class="pill saved-pill">
                        <i class="ti ti-lock" aria-hidden="true" /> Sudah Tersimpan
                    </div>
                    <div v-else class="pill draft-pill">
                        <i class="ti ti-pencil" aria-hidden="true" /> Draft — Belum Disimpan
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <div class="summary-strip">
                <div v-for="(cfg, key) in STATUS" :key="key" class="summary-card"
                    :style="{ background: cfg.bg, borderColor: cfg.border }">
                    <i :class="'ti ' + cfg.icon" :style="{ color: cfg.ring }" aria-hidden="true" />
                    <span class="sum-val" :style="{ color: cfg.text }">{{ summary[key] }}</span>
                    <span class="sum-lbl" :style="{ color: cfg.text }">{{ cfg.label }}</span>
                </div>
            </div>

            <!-- Progress -->
            <div class="progress-row">
                <div class="progress-track">
                    <div class="progress-fill" :style="{ width: persenHadir + '%' }" />
                </div>
                <span class="progress-pct">{{ persenHadir }}% hadir hari ini</span>
            </div>

            <!-- Toolbar -->
            <div class="flex sm:flex-row flex-col w-full gap-2 justify-between">
                <div class="flex sm:flex-row flex-col w-full sm:w-auto gap-3">
                    <div class="search-box">
                        <i class="ti ti-search" aria-hidden="true" />
                        <input v-model="search" type="search" placeholder="Cari nama atau NIS…" class="search-input"
                            aria-label="Cari siswa" />
                        <button v-if="search" @click="search = ''" class="search-clear" aria-label="Hapus pencarian">
                            <i class="ti ti-x" />
                        </button>
                    </div>
                    <div class="sm:flex hidden gap-1" role="group" aria-label="Filter status">
                        <button v-for="opt in ['semua', 'hadir', 'sakit', 'izin', 'alpha']" :key="opt"
                            class="filter-tab" :class="{ active: filterStatus === opt }"
                            :aria-pressed="filterStatus === opt" @click="filterStatus = opt">
                            {{ opt === 'semua' ? 'Semua' : STATUS[opt]?.label }}
                        </button>
                    </div>
                </div>

                <div class="toolbar-right">
                    <button v-if="!sudah_disimpan" class="btn-all-hadir" @click="setAllHadir">
                        <i class="ti ti-checks" aria-hidden="true" /> Semua Hadir
                    </button>
                </div>
            </div>

            <!-- ── Daftar Siswa ── -->
            <div class="siswa-list" role="list">
                <TransitionGroup name="list">
                    <div v-for="siswa in daftarFiltered" :key="siswa.id" class="siswa-row"
                        :class="{ locked: sudah_disimpan, 'has-error': errors[siswa.id] }" role="listitem">

                        <!-- Baris utama: nama | tombol status | toggle keterangan -->
                        <div class="row-main">

                            <!-- Nama -->
                            <div class="siswa-info">
                                <span class="siswa-nama">
                                    {{ siswa.nama }}
                                    <span v-if="siswa.is_sekretaris" class="badge-sek">Sekretaris</span>
                                </span>
                                <span class="siswa-nis">{{ siswa.nis }}</span>
                            </div>

                            <!-- Tombol H / S / I / A -->
                            <div class="status-btns" role="group" :aria-label="`Status ${siswa.nama}`">
                                <button v-for="(cfg, key) in STATUS" :key="key" class="status-btn"
                                    :class="{ active: absensiMap[siswa.id]?.status === key }" :style="absensiMap[siswa.id]?.status === key
                                        ? { background: cfg.bg, color: cfg.text, borderColor: cfg.ring }
                                        : {}" @click="setStatus(siswa.id, key)" :disabled="sudah_disimpan"
                                    :aria-pressed="absensiMap[siswa.id]?.status === key" :title="cfg.label">
                                    <span class="btn-short">{{ cfg.short }}</span>
                                    <span class="btn-label">{{ cfg.label }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Baris keterangan — di LUAR grid, langsung anak .siswa-row -->
                        <Transition name="ket">
                            <div v-if="absensiMap[siswa.id]?.showKet" class="row-ket">
                                <textarea v-model="absensiMap[siswa.id].keterangan" class="ket-input"
                                    :placeholder="`Keterangan ${STATUS[absensiMap[siswa.id]?.status]?.label ?? ''} (opsional)…`"
                                    rows="2" :disabled="sudah_disimpan"
                                    :aria-label="`Keterangan absensi ${siswa.nama}`" />
                            </div>
                        </Transition>

                        <!-- Error -->
                        <p v-if="errors[siswa.id]" class="row-error" role="alert">{{ errors[siswa.id] }}</p>
                    </div>
                </TransitionGroup>

                <div v-if="!daftarFiltered.length" class="empty-state">
                    <i class="ti ti-mood-empty" aria-hidden="true" />
                    <p>Tidak ada siswa yang cocok dengan filter</p>
                </div>
            </div>

        </main>

        <!-- Sticky Footer -->
        <div v-if="!sudah_disimpan" class="action-footer">
            <div class="footer-info">
                <span class="footer-count">
                    {{ summary.hadir + summary.sakit + summary.izin + summary.alpha }} / {{ summary.total }} siswa diisi
                </span>
                <span class="footer-date">{{ tanggalFormatted }}</span>
            </div>
            <button class="btn-simpan" @click="showConfirm = true" :disabled="!allFilled"
                :title="!allFilled ? 'Lengkapi status semua siswa terlebih dahulu' : 'Simpan absensi'">
                <i class="ti ti-device-floppy" aria-hidden="true" /> Simpan Absensi
            </button>
        </div>
        <div v-else class="action-footer action-footer--saved">
            <div class="footer-saved">
                <i class="ti ti-lock-check" aria-hidden="true" />
                <span>Absensi hari ini sudah tersimpan dan terkunci</span>
            </div>
        </div>

        <!-- Modal Konfirmasi -->
        <Transition name="modal">
            <div v-if="showConfirm" class="modal-veil" @click.self="!loading && (showConfirm = false)" role="dialog"
                aria-modal="true" aria-labelledby="modal-title">
                <div class="modal-box">
                    <div class="modal-head">
                        <div class="modal-icon"><i class="ti ti-clipboard-check" /></div>
                        <div>
                            <h3 class="modal-title" id="modal-title">Simpan Absensi Kelas</h3>
                            <p class="modal-sub">{{ sekretaris.kelas_nama }} · {{ tanggalFormatted }}</p>
                        </div>
                        <button class="modal-close-btn" @click="showConfirm = false" :disabled="loading"
                            aria-label="Tutup">
                            <i class="ti ti-x" />
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="confirm-grid">
                            <div v-for="(cfg, key) in STATUS" :key="key" class="confirm-item"
                                :style="{ background: cfg.bg, borderColor: cfg.border }">
                                <i :class="'ti ' + cfg.icon" :style="{ color: cfg.ring }" />
                                <span class="ci-val" :style="{ color: cfg.text }">{{ summary[key] }}</span>
                                <span class="ci-lbl" :style="{ color: cfg.text }">{{ cfg.label }}</span>
                            </div>
                        </div>
                        <p class="confirm-note">
                            <i class="ti ti-info-circle" />
                            Setelah disimpan, absensi akan <strong>terkunci</strong> dan tidak bisa diubah kecuali oleh
                            guru atau admin.
                        </p>
                    </div>
                    <div class="modal-foot">
                        <button class="btn-cancel" @click="showConfirm = false" :disabled="loading">Batal</button>
                        <button class="btn-confirm" @click="submitAbsensi" :disabled="loading">
                            <i v-if="loading" class="ti ti-loader-2 spin" />
                            <i v-else class="ti ti-check" />
                            {{ loading ? 'Menyimpan…' : 'Ya, Simpan Sekarang' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.page-wrap {
    min-height: 100vh;
    padding-bottom: 20px;
    background: #F2F1ED;
    font-family: 'DM Sans', 'Sora', ui-sans-serif, system-ui, sans-serif;
    color: #1C1C28;
}

/* Flash */
.flash {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.7rem 1.1rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0 6px 24px rgba(0, 0, 0, .13);
}

.flash.success {
    background: #EAF3DE;
    color: #3B6D11;
    border: 1px solid #97C459;
}

.flash.error {
    background: #FCEBEB;
    color: #A32D2D;
    border: 1px solid #F09595;
}

.flash-x {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 0.25rem;
    color: inherit;
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 4px;
}

.flash-enter-active,
.flash-leave-active {
    transition: all .3s ease;
}

.flash-enter-from,
.flash-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
}

/* Topbar */
.topbar {
    background: #12122A;
    position: sticky;
    top: 0;
    z-index: 200;
}

.topbar-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.topbar-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
}

.topbar-logo {
    width: 40px;
    height: 40px;
    border-radius: 11px;
    background: rgba(255, 255, 255, .1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: #93C5FD;
}

.topbar-title {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
}

.topbar-sub {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, .45);
    margin-top: 1px;
}

.topbar-clock {
    text-align: right;
}

.clock-hms {
    font-size: 1.35rem;
    font-weight: 700;
    color: #93C5FD;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
}

.clock-date {
    font-size: 0.68rem;
    color: rgba(255, 255, 255, .4);
    margin-top: 1px;
}

/* Main */
.page-main {
    max-width: 1120px;
    margin: 0 auto;
    padding: 1.25rem 1.5rem 6rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Info Bar */
.info-bar {
    background: #12122A;
    border-radius: 14px;
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}

.info-bar-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
}

.avatar-circle {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    color: #fff;
    font-size: 0.95rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.info-nama {
    font-size: 0.95rem;
    font-weight: 700;
    color: #fff;
}

.info-meta {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, .45);
    margin-top: 2px;
}

.pill {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
}

.saved-pill {
    background: #EAF3DE;
    color: #3B6D11;
}

.draft-pill {
    background: #FAEEDA;
    color: #854F0B;
}

/* Summary */
.summary-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
}

@media (max-width: 640px) {
    .summary-strip {
        grid-template-columns: repeat(2, 1fr);
    }
}

.summary-card {
    border-radius: 12px;
    border: 1px solid;
    padding: 0.85rem 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
}

.summary-card i {
    font-size: 1rem;
    margin-bottom: 2px;
}

.sum-val {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1;
}

.sum-lbl {
    font-size: 0.68rem;
    font-weight: 600;
    opacity: .8;
}

/* Progress */
.progress-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.progress-track {
    flex: 1;
    height: 7px;
    background: #DDDBD3;
    border-radius: 999px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #4ADE80, #16A34A);
    transition: width .6s cubic-bezier(.4, 0, .2, 1);
}

.progress-pct {
    font-size: 0.78rem;
    font-weight: 700;
    color: #16A34A;
    white-space: nowrap;
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.9rem;
    background: #fff;
    border: 1px solid #D3D1C7;
    border-radius: 10px;
    min-width: 220px;
}

.search-box i {
    color: #B4B2A9;
    font-size: 0.95rem;
    flex-shrink: 0;
}

.search-input {
    border: none;
    outline: none;
    background: none;
    font-size: 0.85rem;
    color: #1C1C28;
    font-family: inherit;
    width: 100%;
}

.search-input::placeholder {
    color: #B4B2A9;
}

.search-clear {
    background: none;
    border: none;
    cursor: pointer;
    color: #B4B2A9;
    display: flex;
    align-items: center;
    padding: 1px;
}

.search-clear:hover {
    color: #444441;
}

.filter-tabs {
    display: flex;
    gap: 4px;
}

.filter-tab {
    padding: 0.38rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #D3D1C7;
    background: #fff;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    color: #5F5E5A;
    font-family: inherit;
    transition: all .15s;
}

.filter-tab.active {
    background: #12122A;
    border-color: #12122A;
    color: #fff;
}

.filter-tab:not(.active):hover {
    background: #ECEAE3;
}

.btn-all-hadir {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 1rem;
    border-radius: 8px;
    border: 1.5px solid #97C459;
    background: #EAF3DE;
    color: #3B6D11;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all .15s;
}

.btn-all-hadir:hover {
    background: #D5E9B8;
}

/* ── Siswa List ──
   .siswa-row    = flex column (nama + tombol + keterangan tumpuk ke bawah)
   .row-main     = flex row (nama | tombol | toggle) — TIDAK pakai grid
   .row-ket      = full-width textarea di bawah .row-main
*/
.siswa-list {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 16px;
    border: 1px solid #ECEAE3;
    overflow: hidden;
}

.siswa-row {
    display: flex;
    /* KUNCI: flex column, bukan grid */
    flex-direction: column;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #F2F1ED;
    transition: background .12s;
}

.siswa-row:last-child {
    border-bottom: none;
}

.siswa-row:hover:not(.locked) {
    background: #FAFAF8;
}

.siswa-row.locked {
    opacity: .85;
}

.siswa-row.has-error {
    background: #FFF5F5;
}

/* Baris utama: info | tombol | toggle — flex row */
.row-main {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.siswa-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.siswa-nama {
    font-size: 0.88rem;
    font-weight: 600;
    color: #1C1C28;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.siswa-nis {
    font-size: 0.72rem;
    color: #B4B2A9;
}

.badge-sek {
    display: inline-flex;
    align-items: center;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 4px;
    background: #EEF2FF;
    color: #4F46E5;
    border: 1px solid #C7D2FE;
    vertical-align: middle;
    margin-left: 5px;
}

.status-btns {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
}

.status-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0.3rem 0.65rem;
    border-radius: 7px;
    border: 1.5px solid #D3D1C7;
    background: #F2F1ED;
    color: #888780;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all .13s;
}

.status-btn .btn-short {
    display: none;
}

.status-btn .btn-label {
    display: inline;
}

.status-btn:hover:not(:disabled) {
    border-color: #888780;
    color: #1C1C28;
}

.status-btn.active {
    font-weight: 700;
}

.status-btn:disabled {
    cursor: default;
}

.ket-col {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    width: 28px;
    justify-content: center;
}

.ket-toggle {
    background: none;
    border: none;
    cursor: pointer;
    color: #B4B2A9;
    font-size: 1.05rem;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    transition: all .13s;
}

.ket-toggle:hover {
    color: #4F46E5;
    background: #EEF2FF;
}

.ket-toggle.ket-open {
    color: #4F46E5;
}

.ket-readonly {
    color: #B4B2A9;
    font-size: 0.95rem;
    cursor: help;
}

/* Baris keterangan — full width, muncul di bawah .row-main */
.row-ket {
    padding-top: 0.5rem;
}

.ket-input {
    width: 100%;
    padding: 0.55rem 0.75rem;
    border: 1px solid #D3D1C7;
    border-radius: 8px;
    font-size: 0.82rem;
    color: #1C1C28;
    resize: vertical;
    font-family: inherit;
    background: #FAFAF8;
    transition: border-color .15s;
}

.ket-input:focus {
    outline: none;
    border-color: #4F46E5;
}

.row-error {
    font-size: 0.72rem;
    color: #A32D2D;
    padding-top: 0.25rem;
}

/* Transitions */
.ket-enter-active,
.ket-leave-active {
    transition: all .2s ease;
    overflow: hidden;
}

.ket-enter-from,
.ket-leave-to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
}

.ket-enter-to,
.ket-leave-from {
    opacity: 1;
    max-height: 120px;
}

.list-move,
.list-enter-active,
.list-leave-active {
    transition: all .25s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}

.list-leave-active {
    position: absolute;
}

.empty-state {
    padding: 3rem;
    text-align: center;
    color: #B4B2A9;
}

.empty-state i {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.5rem;
}

.empty-state p {
    font-size: 0.85rem;
}

/* Footer */
.action-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #fff;
    border-top: 1px solid #ECEAE3;
    padding: 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.action-footer--saved {
    justify-content: center;
    background: #EAF3DE;
}

.footer-saved {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #3B6D11;
    font-size: 0.875rem;
    font-weight: 600;
}

.footer-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.footer-count {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1C1C28;
}

.footer-date {
    font-size: 0.72rem;
    color: #B4B2A9;
}

.btn-simpan {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.6rem;
    border-radius: 10px;
    border: none;
    background: #12122A;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all .18s;
}

.btn-simpan:hover:not(:disabled) {
    background: #1e1e40;
    transform: translateY(-1px);
}

.btn-simpan:active:not(:disabled) {
    transform: scale(0.98);
}

.btn-simpan:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

/* Modal */
.modal-veil {
    position: fixed;
    inset: 0;
    z-index: 9000;
    background: rgba(18, 18, 42, .65);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    backdrop-filter: blur(5px);
}

.modal-box {
    background: #fff;
    border-radius: 20px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, .22);
    overflow: hidden;
}

.modal-head {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    padding: 1.4rem 1.4rem 1.1rem;
    border-bottom: 1px solid #F2F1ED;
}

.modal-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    flex-shrink: 0;
    background: #EEF2FF;
    color: #4F46E5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
}

.modal-title {
    font-size: 1rem;
    font-weight: 800;
    color: #1C1C28;
}

.modal-sub {
    font-size: 0.75rem;
    color: #888780;
    margin-top: 2px;
}

.modal-close-btn {
    margin-left: auto;
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #B4B2A9;
    border-radius: 8px;
    padding: 4px;
    display: flex;
    transition: all .13s;
}

.modal-close-btn:hover:not(:disabled) {
    background: #F2F1ED;
    color: #444;
}

.modal-close-btn:disabled {
    opacity: .4;
    cursor: not-allowed;
}

.modal-body {
    padding: 1.1rem 1.4rem;
}

.confirm-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem;
    margin-bottom: 1rem;
}

.confirm-item {
    border-radius: 10px;
    border: 1px solid;
    padding: 0.7rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
}

.confirm-item i {
    font-size: 1.1rem;
}

.ci-val {
    font-size: 1.3rem;
    font-weight: 800;
    line-height: 1;
}

.ci-lbl {
    font-size: 0.65rem;
    font-weight: 600;
    opacity: .8;
}

.confirm-note {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    background: #FAEEDA;
    border-radius: 8px;
    padding: 0.7rem 0.85rem;
    font-size: 0.78rem;
    color: #854F0B;
    line-height: 1.5;
}

.confirm-note i {
    flex-shrink: 0;
    margin-top: 1px;
}

.modal-foot {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.4rem 1.4rem;
}

.btn-cancel {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    border: 1px solid #D3D1C7;
    background: none;
    font-size: 0.875rem;
    color: #5F5E5A;
    cursor: pointer;
    font-family: inherit;
    transition: all .13s;
}

.btn-cancel:hover:not(:disabled) {
    background: #F2F1ED;
}

.btn-cancel:disabled {
    opacity: .5;
    cursor: not-allowed;
}

.btn-confirm {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1.4rem;
    border-radius: 8px;
    border: none;
    background: #12122A;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all .15s;
}

.btn-confirm:hover:not(:disabled) {
    background: #1e1e40;
}

.btn-confirm:disabled {
    opacity: .6;
    cursor: not-allowed;
}

.modal-enter-active,
.modal-leave-active {
    transition: all .25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
    transform: scale(.94) translateY(12px);
}

.spin {
    animation: spin .75s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 720px) {
    .status-btn .btn-label {
        display: none;
    }

    .status-btn .btn-short {
        display: inline;
    }

    .status-btn {
        padding: 0.3rem 0.55rem;
    }

    .filter-tabs {
        display: none;
    }

    .search-box {
        min-width: 160px;
    }

    .page-main {
        padding: 1rem 0.85rem 5.5rem;
    }

    .action-footer {
        padding: 0.75rem 1rem;
    }

    .confirm-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .topbar-inner {
        padding: 0.7rem 1rem;
    }

    .clock-hms {
        font-size: 1.1rem;
    }

    .summary-strip {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>