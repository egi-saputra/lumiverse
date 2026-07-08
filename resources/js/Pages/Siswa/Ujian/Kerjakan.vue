<script setup>
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import axios from 'axios'

/* ================= PROPS ================= */
const props = defineProps({
    soal: Object,
    ujianSiswa: Object,
    quest: Object,
    riwayat: Object,
    nomorList: Array,
    no: Number,
    totalSoal: Number,
    sisaDetik: Number,
    answered: Array,
})

/* ================= TYPE & LINK ================= */
const directLampiranLink = computed(() => {
    if (props.quest?.jenis_lampiran !== 'Gambar') return null
    return props.quest?.link_lampiran_url ?? null
})

const isEssay = computed(() => props.quest?.tipe_soal === 'Essay')
const allAnswered = computed(() => props.nomorList.every(id => answeredLocal.value.includes(id)))

/* ================= STATE ================= */
const perPage = 10
const currentPage = ref(1)
const token = ref(props.ujianSiswa.token)
const jawaban = ref(props.riwayat?.jawaban ?? null)
const jawabanAwal = ref(props.riwayat?.jawaban ?? null)
const timer = ref(props.sisaDetik)
let interval = null
const answeredLocal = ref([...props.answered])

watch(() => props.answered, (val) => {
    answeredLocal.value = [...val]
})

/* ================= PAGINATION ================= */
const totalPages = computed(() => Math.ceil(props.nomorList.length / perPage))
const paginatedNomorList = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return props.nomorList.slice(start, start + perPage)
})
watch(() => props.no, val => {
    currentPage.value = Math.ceil(val / perPage)
})

/* ================= LEGEND ================= */
const showLegend = ref(false)
const toggleLegend = () => showLegend.value = !showLegend.value
const closeLegend = e => {
    if (!e.target.closest('.legend-wrapper')) showLegend.value = false
}

/* ================= UTIL ================= */
const isAnswered = (questId) => answeredLocal.value.includes(questId)
const ujianSelesai = ref(false)

/* ================= FULLSCREEN MODE ================= */
const isFullscreen = ref(false)

const requestFullscreen = () => {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else if (el.msRequestFullscreen) el.msRequestFullscreen()
}

const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen()
}

const supportsFullscreen = computed(() => {
    return !!(
        document.documentElement.requestFullscreen ||
        document.documentElement.webkitRequestFullscreen ||
        document.documentElement.msRequestFullscreen
    )
})

const onFullscreenChange = () => {
    const fs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement

    isFullscreen.value = !!fs

    if (!fs && !ujianSelesai.value) {
        alert('Keluar dari mode layar penuh tidak diperbolehkan!')
        blockExit()
    }
}

/* ================= SYNC SOAL ================= */
watch(
    () => props.quest?.id,
    () => {
        jawaban.value = props.riwayat?.jawaban ?? null
        jawabanAwal.value = props.riwayat?.jawaban ?? null
    },
    { immediate: true }
)

/* ================= TIMER ================= */
const updateTimer = () => {
    if (timer.value <= 0) {
        clearInterval(interval)
        exitFullscreen()
        submitUjian()
        return
    }
    timer.value--
}

/* ================= AUTOSAVE QUEUE ─────────────────────────────────────────
 * Menggunakan antrian lokal (pendingQueue) sehingga:
 *   • Hanya 1 request aktif ke server dalam satu waktu
 *   • Jawaban terbaru selalu diambil dari queue (tidak terlewat)
 *   • Debounce 600ms mencegah request berlebihan saat user mengetik
 * ───────────────────────────────────────────────────────────────────────── */

const isSaving = ref(false)
const isNavigating = ref(false)

// Target nomor soal yang sedang di-navigate (untuk spinner tombol & nomor)
const navigatingTo = ref(null)

let saveTimeout = null

// Antrian: key = quest_id, value = jawaban terbaru
// Dengan Map, update quest yang sama selalu overwrite (tidak stack)
const pendingQueue = new Map()

/** Kirim satu item dari antrian ke server */
const flushQueue = async () => {
    if (isSaving.value || pendingQueue.size === 0) return

    isSaving.value = true

    // Ambil item pertama dari queue
    const [[questId, { jaw, tipe_soal }]] = pendingQueue
    pendingQueue.delete(questId)

    try {
        await axios.post(route('siswa.ujian.autosave'), {
            soal_id: props.soal.id,
            quest_id: questId,
            jawaban: jaw,
            tipe_soal: tipe_soal,
            token: token.value,
        })

        // Update jawabanAwal hanya jika quest yang disimpan adalah quest aktif
        if (questId === props.quest?.id) {
            jawabanAwal.value = jaw
        }

        // Tandai sebagai terjawab
        if (jaw !== null && !answeredLocal.value.includes(questId)) {
            answeredLocal.value.push(questId)
        }
    } catch (err) {
        // Re-queue jika gagal (silent retry pada autosave berikutnya)
        if (!pendingQueue.has(questId)) {
            pendingQueue.set(questId, { jaw, tipe_soal })
        }
        console.warn('Autosave retry queued:', err?.response?.status)
    } finally {
        isSaving.value = false
        // Lanjutkan flush jika masih ada antrian
        if (pendingQueue.size > 0) {
            flushQueue()
        }
    }
}

/** Tambahkan jawaban ke antrian dan debounce flush */
const autosave = () => {

    if (jawaban.value === null) return

    // hanya skip jika benar-benar sama
    if (jawaban.value === jawabanAwal.value) return

    pendingQueue.set(props.quest.id, {
        jaw: jawaban.value,
        tipe_soal: props.quest.tipe_soal,
    })

    clearTimeout(saveTimeout)

    saveTimeout = setTimeout(() => {
        flushQueue()
    }, 600)
}

// Trigger autosave saat jawaban berubah
watch(jawaban, () => {
    if (isNavigating.value) return
    autosave()
})

/* ================= NAVIGASI ================= */
const goTo = async (n) => {
    if (isNavigating.value) return

    isNavigating.value = true
    navigatingTo.value = n

    // Simpan jawaban saat ini ke queue lalu flush segera sebelum pindah
    if (jawaban.value !== null && jawaban.value !== jawabanAwal.value) {
        pendingQueue.set(props.quest.id, {
            jaw: jawaban.value,
            tipe_soal: props.quest.tipe_soal,
        })
    }
    clearTimeout(saveTimeout)
    await flushQueue()

    router.get(
        route('siswa.ujian.kerjakan', props.soal.id),
        { no: n },
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => {
                isNavigating.value = false
                navigatingTo.value = null
            },
        }
    )
}

/* ================= SUBMIT ================= */
const isSubmitting = ref(false)

const submitUjian = async () => {
    if (isSubmitting.value) return
    isSubmitting.value = true

    try {
        // Paksa simpan jawaban aktif sebelum submit
        if (jawaban.value !== null && jawaban.value !== jawabanAwal.value) {
            pendingQueue.set(props.quest.id, {
                jaw: jawaban.value,
                tipe_soal: props.quest.tipe_soal,
            })
        }
        clearTimeout(saveTimeout)
        await flushQueue()

        // Tunggu semua antrian kosong (maks 3 detik)
        const waitQueue = new Promise((resolve) => {
            const check = setInterval(() => {
                if (pendingQueue.size === 0 && !isSaving.value) {
                    clearInterval(check)
                    resolve()
                }
            }, 100)
            setTimeout(() => { clearInterval(check); resolve() }, 3000)
        })
        await waitQueue

        // Submit ke server
        await axios.post(route('siswa.ujian.submit', props.soal.id), {
            token: token.value,
        })

        ujianSelesai.value = true
        exitFullscreen()
        router.get(route('siswa.ujian.finish'))

    } catch (e) {
        console.error(e)
        alert('Gagal menyimpan jawaban terakhir. Silakan coba lagi.')
    } finally {
        isSubmitting.value = false
    }
}

/* ================= REFRESH TOKEN ================= */
const refreshToken = async () => {
    try {
        await axios.post(route('siswa.ujian.refreshToken', props.soal.id), {}, {
            headers: { 'X-CSRF-TOKEN': usePage().props.csrf_token },
        })
    } catch (err) {
        console.error('Refresh token error:', err)
    }
}

/* ================= BLOCK EXIT ================= */
// blockExit dipanggil saat siswa keluar tab / fullscreen / visibilitychange.
// Urutan penting: refreshToken DULU (token baru di DB), baru forceExit
// (status = Terkunci, session dihapus). Dengan urutan ini token yang
// tersimpan di DB sudah pasti token terbaru yang dipegang guru/siswa.
const blockExit = async () => {
    clearInterval(interval)
    clearTimeout(saveTimeout)

    // 1️⃣ Refresh token terlebih dahulu agar token baru tersimpan di DB
    await refreshToken()

    // 2️⃣ Baru set status Terkunci + hapus session
    try {
        await axios.post(route('siswa.ujian.forceExit', props.soal.id))
    } catch (e) { /* silent */ }

    window.location.href = route('siswa.ujian.token')
}

/* ================= BLOCK Keydown ================= */
const blockKeydown = e => {
    if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'r', 't', 'n', 'w'].includes(e.key.toLowerCase())) e.preventDefault()
    if (['F5', 'Escape'].includes(e.key)) e.preventDefault()
    if (e.key === 'Escape') {
        e.preventDefault()
        alert('ESC tidak diperbolehkan!')
    }
}

const blockContext = e => e.preventDefault()
const blockClipboard = e => e.preventDefault()
const blockSelect = e => e.preventDefault()


/* ================= BLOCK SCREENSHOT ================= */
const blockScreenshot = (e) => {
    if (e.key === 'PrintScreen') {
        e.preventDefault()
        alert('Screenshot tidak diperbolehkan!')
        blockExit()
    }
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault()
        alert('Screenshot tidak diperbolehkan!')
        blockExit()
    }
}

/* ================= LIFECYCLE ================= */
const onVisibilityChange = () => {
    if (document.hidden) blockExit()
}

// handleBeforeUnload: TIDAK memanggil refreshToken di sini.
// Alasan: blockExit (dipanggil via visibilitychange / fullscreenchange)
// sudah menangani refreshToken + forceExit secara berurutan dan terkoordinasi.
// Memanggil sendBeacon refreshToken di sini justru akan me-overwrite token
// yang sudah di-set oleh forceExit, membuat token di DB tidak konsisten.
const handleBeforeUnload = () => {
    // intentionally empty — token diurus oleh blockExit
}

onMounted(() => {
    interval = setInterval(updateTimer, 1000)

    document.addEventListener('visibilitychange', onVisibilityChange)
    document.addEventListener('keydown', blockKeydown)
    document.addEventListener('keydown', blockScreenshot)
    document.addEventListener('contextmenu', blockContext)
    document.addEventListener('cut', blockClipboard)
    document.addEventListener('copy', blockClipboard)
    document.addEventListener('paste', blockClipboard)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    document.addEventListener('msfullscreenchange', onFullscreenChange)
    document.addEventListener('selectstart', blockSelect)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('click', closeLegend)

    window.addEventListener('pageshow', (e) => {
        if (e.persisted) blockExit()
    })
})

onBeforeUnmount(() => {
    clearInterval(interval)
    clearTimeout(saveTimeout)

    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('click', closeLegend)
    document.removeEventListener('keydown', blockKeydown)
    document.removeEventListener('keydown', blockScreenshot)
    document.removeEventListener('contextmenu', blockContext)
    document.removeEventListener('cut', blockClipboard)
    document.removeEventListener('copy', blockClipboard)
    document.removeEventListener('paste', blockClipboard)
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    document.removeEventListener('msfullscreenchange', onFullscreenChange)
    document.removeEventListener('selectstart', blockSelect)

    // onBeforeUnmount: TIDAK memanggil refreshToken di sini.
    // Ini dipanggil saat navigasi normal Inertia (pindah halaman setelah submit).
    // Memanggil refreshToken di sini akan me-invalidate token siswa yang sudah
    // selesai ujian, padahal tidak perlu.
})

const showFullscreenGate = ref(true)
</script>


<template>
    <div class="min-h-screen no-select w-full py-4 md:py-10 p-4 dark:bg-[#020617] md:px-6">

        <!-- ================= FULLSCREEN GATE ================= -->
        <div v-if="showFullscreenGate"
            class="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center text-white">
            <div class="text-center space-y-6 w-full px-6">
                <h2 class="text-2xl font-bold">Masuk Mode Ujian</h2>
                <p class="text-sm text-gray-300">
                    Ujian harus dikerjakan dalam <b>mode layar penuh (Full screen)</b>.
                    Keluar dari mode full screen akan mengakhiri ujian dan anda akan dikeluarkan secara paksa.
                </p>

                <button @click="() => { requestFullscreen(); showFullscreenGate = false }"
                    class="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 font-semibold">
                    Mulai Ujian
                </button>
            </div>
        </div>

        <div v-if="isSubmitting" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow">
                Mengirim jawaban...
            </div>
        </div>

        <div class="flex sm:flex-row w-full sm:mx-auto sm:max-w-6xl mt-4 sm:mt-12 flex-col gap-4">

            <!-- ================= PANEL SOAL ================= -->
            <div
                class="flex-1 bg-white/70 dark:bg-[#0F172A]/90 backdrop-blur-xl md:shadow-xl border border-white/20 dark:border-white/10 rounded-lg md:rounded-2xl md:p-6 pt-4 pb-6 px-4 md:px-6 md:pt-6 md:pb-6">

                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold dark:text-gray-200 select-none pointer-events-none text-gray-700">
                        Soal {{ no }} dari {{ totalSoal }}
                    </h3>

                    <!-- ================= TIMER FIXED ================= -->
                    <div
                        class="z-20 md:-mt-20 -mt-2 -mr-2 md:mr-0 dark:bg-[#0F172A] bg-white md:rounded-xl dark:md:border-white/10 px-4 py-2 flex items-center gap-2 md:border">
                        <svg class="w-5 h-5 text-red-500 dark:md:text-gray-300 md:text-[#063970]" fill="none"
                            stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span
                            class="font-bold md:inline-block hidden -ml-1 mt-0.5 text-[#063970] dark:text-indigo-300 text-sm select-none pointer-events-none">
                            Timer :
                        </span>
                        <span class="font-bold text-red-600 dark:text-red-500 mt-0.5 text-sm">
                            {{ Math.floor(timer / 60) }}:{{ String(timer % 60).padStart(2, '0') }}
                        </span>
                    </div>

                </div>

                <!-- LAMPIRAN SOAL -->
                <div v-if="directLampiranLink" class="mb-4 mt-3 w-full">
                    <img :src="directLampiranLink"
                        class="w-full max-w-sm max-h-24 sm:max-h-32 object-contain object-left" />
                </div>

                <!-- <div v-html="quest.soal" :key="quest.id"
                    class="announcement-content prose prose-sm max-w-none dark:prose-invert mb-6 text-gray-800 dark:text-gray-100 leading-relaxed">
                </div> -->

                <!-- Konten soal -->
                <div v-html="quest.soal" :key="quest.id" class="announcement-content prose prose-sm max-w-none dark:prose-invert mb-6 
           text-gray-800 dark:text-gray-100 leading-relaxed
           select-none pointer-events-none">
                </div>

                <!-- JAWABAN -->
                <!-- PILIHAN GANDA -->
                <div v-if="!isEssay" class="space-y-2.5">
                    <template v-for="opsi in ['A', 'B', 'C', 'D', 'E']" :key="opsi">
                        <label
                            v-if="quest['opsi_' + opsi.toLowerCase()] || quest['opsi_' + opsi.toLowerCase() + '_lampiran']"
                            class="flex gap-3 items-center cursor-pointer px-4 py-3 rounded-xl border-2 transition-all duration-200 select-none"
                            :class="jawaban === opsi
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400 shadow-sm'
                                : 'border-gray-200 dark:border-white/10 bg-white/60 dark:bg-slate-800/40 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/5'">

                            <input type="radio" :value="opsi" v-model="jawaban" class="sr-only" />

                            <!-- Badge huruf -->
                            <span
                                class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 self-start mt-0.5"
                                :class="jawaban === opsi
                                    ? 'bg-blue-500 text-white dark:bg-blue-400 dark:text-white'
                                    : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'">
                                {{ opsi }}
                            </span>

                            <!-- Konten opsi: teks + gambar (bisa keduanya, salah satu, atau hanya gambar) -->
                            <span class="flex-1 flex flex-col gap-2 min-w-0">

                                <!-- Teks opsi (hanya render jika ada) -->
                                <span v-if="quest['opsi_' + opsi.toLowerCase()]"
                                    v-html="quest['opsi_' + opsi.toLowerCase()]"
                                    class="text-sm leading-relaxed pointer-events-none select-none transition-colors duration-200"
                                    :class="jawaban === opsi
                                        ? 'text-blue-900 dark:text-blue-100 font-medium'
                                        : 'text-gray-700 dark:text-gray-300'">
                                </span>

                                <!-- Gambar opsi (hanya render jika ada) -->
                                <img v-if="quest['opsi_' + opsi.toLowerCase() + '_lampiran']"
                                    :src="quest['opsi_' + opsi.toLowerCase() + '_lampiran_url']"
                                    :alt="`Gambar opsi ${opsi}`"
                                    class="max-h-40 max-w-xs rounded-lg object-contain border pointer-events-none select-none"
                                    :class="jawaban === opsi
                                        ? 'border-blue-300 dark:border-blue-500'
                                        : 'border-gray-200 dark:border-slate-600'" />

                            </span>

                            <!-- Checkmark kanan -->
                            <svg v-if="jawaban === opsi"
                                class="flex-shrink-0 w-5 h-5 text-blue-500 dark:text-blue-400 self-start mt-1"
                                fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>

                        </label>
                    </template>
                </div>

                <!-- ESSAY -->
                <div v-else class="mt-4">
                    <label class="block text-sm font-semibold dark:text-gray-400 text-gray-600 mb-2">
                        Jawaban Anda
                    </label>

                    <textarea v-model="jawaban" rows="6" placeholder="Tulis jawaban Anda di sini..."
                        class="w-full rounded-xl bg-white/70 dark:bg-[#0F172A]/90 backdrop-blur border-2 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-300 p-4 text-sm leading-relaxed focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors resize-none">
    </textarea>

                    <p class="text-xs dark:text-gray-500 text-gray-400 mt-2 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Jawaban tersimpan otomatis
                    </p>
                </div>

                <!-- ================= NAVIGASI ================= -->
                <div class="flex flex-col sm:flex-row gap-3 justify-between mt-8">

                    <!-- Tombol Sebelumnya -->
                    <button v-if="no > 1" @click="goTo(no - 1)" :disabled="isNavigating" class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition
                               disabled:opacity-50 disabled:cursor-not-allowed
                               dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                        <svg v-if="isNavigating && navigatingTo === no - 1" class="animate-spin w-4 h-4 shrink-0"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <svg v-else class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>{{ isNavigating && navigatingTo === no - 1 ? 'Menyimpan...' : 'Sebelumnya' }}</span>
                    </button>

                    <!-- Tombol Selanjutnya -->
                    <button v-if="no < totalSoal" @click="goTo(no + 1)" :disabled="isNavigating"
                        class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white transition
                               disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 disabled:hover:bg-blue-600">
                        <span>{{ isNavigating && navigatingTo === no + 1 ? 'Menyimpan...' : 'Selanjutnya' }}</span>
                        <svg v-if="isNavigating && navigatingTo === no + 1" class="animate-spin w-4 h-4 shrink-0"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <svg v-else class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <!-- Tombol Selesaikan Ujian -->
                    <button v-if="no === totalSoal" @click="submitUjian"
                        :disabled="isSubmitting || isNavigating || !allAnswered"
                        :title="!allAnswered ? 'Masih ada soal yang belum dijawab' : ''" class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white transition
           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 disabled:hover:bg-blue-600">
                        <svg v-if="isSubmitting" class="animate-spin w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span>{{ isSubmitting ? 'Mengirim Jawaban...' : 'Selesaikan Ujian' }}</span>
                        <PaperAirplaneIcon v-if="!isSubmitting" class="w-5 h-5 shrink-0" />
                    </button>

                    <!-- Pesan peringatan jika belum semua dijawab -->
                    <p v-if="no === totalSoal && !allAnswered"
                        class="text-xs text-red-500 dark:text-red-400 mt-1 text-center w-full">
                        {{ props.nomorList.length - answeredLocal.length }} soal belum dijawab
                    </p>

                </div>
            </div>

            <!-- ================= DAFTAR NOMOR (DESKTOP) ================= -->
            <div
                class="hidden md:block w-72 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 relative">

                <!-- HEADER + ICON INFO -->
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold dark:text-gray-300 text-gray-700">
                        Daftar Soal
                    </h3>

                    <div class="relative legend-wrapper">
                        <button @click.stop="toggleLegend"
                            class="w-6 h-6 rounded-xl border border-gray-300 font-extrabold flex items-center justify-center dark:text-gray-300 text-gray-500 transition">
                            !
                        </button>

                        <div v-if="showLegend"
                            class="absolute right-8 -mt-6 w-48 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl dark:text-gray-200 border border-white/20 dark:border-white/10 shadow-xl rounded-xl p-3 text-xs z-50">
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded bg-green-600"></span>
                                    <span>Soal aktif</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded bg-blue-600"></span>
                                    <span>Sudah dijawab</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded bg-gray-300"></span>
                                    <span>Belum dijawab</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LIST NOMOR -->
                <div class="grid grid-cols-5 gap-2">
                    <button v-for="(id, i) in nomorList" :key="id" @click="goTo(i + 1)" :disabled="isNavigating" class="aspect-square rounded-lg font-bold text-sm border transition relative
                               disabled:cursor-not-allowed" :class="{
                                'bg-blue-500 text-white border-blue-400':
                                    navigatingTo === i + 1,
                                'bg-green-600 text-white border-green-700':
                                    i + 1 === no && navigatingTo !== i + 1,
                                'bg-blue-600 text-white border-blue-700':
                                    i + 1 !== no && isAnswered(id) && navigatingTo !== i + 1,
                                'bg-gray-100 text-gray-700 border-gray-300 disabled:opacity-60':
                                    i + 1 !== no && !isAnswered(id) && navigatingTo !== i + 1,
                            }">
                        <!-- Nomor disembunyikan saat spinner tampil -->
                        <span :class="{ 'opacity-0': navigatingTo === i + 1 }">{{ i + 1 }}</span>
                        <svg v-if="navigatingTo === i + 1" class="animate-spin w-3 h-3 absolute inset-0 m-auto"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    </button>
                </div>
            </div>

        </div>

        <!-- ================= DAFTAR NOMOR (MOBILE) ================= -->
        <div
            class="md:hidden mt-6 bg-white/70 dark:bg-[#0F172A]/90 backdrop-blur-xl rounded-lg md:border-t border-white/20 dark:border-white/10 md:shadow-xl p-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold dark:text-gray-300 text-gray-700">
                    Daftar Soal
                </h3>

                <div class="relative legend-wrapper">
                    <button @click.stop="toggleLegend"
                        class="w-6 h-6 rounded-full border border-gray-500 dark:border-gray-300 flex items-center justify-center
                       text-gray-500 hover:bg-gray-50 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-800 dark:hover:border-gray-800 transition">
                        !
                    </button>

                    <div v-if="showLegend"
                        class="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl dark:text-gray-200 border border-white/20 dark:border-white/10 shadow-xl rounded-xl p-3 text-xs z-50">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded bg-green-600"></span>
                                <span>Soal aktif</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded bg-blue-600"></span>
                                <span>Sudah dijawab</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded bg-gray-300"></span>
                                <span>Belum dijawab</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-5 gap-2">
                <button v-for="(id, i) in paginatedNomorList" :key="id"
                    @click="goTo((currentPage - 1) * perPage + i + 1)" :disabled="isNavigating" class="aspect-square rounded-lg font-bold text-sm border transition relative
                           disabled:cursor-not-allowed" :class="{
                            'bg-blue-500 text-white border-blue-400':
                                navigatingTo === (currentPage - 1) * perPage + i + 1,
                            'bg-green-600 text-white border-green-700':
                                (currentPage - 1) * perPage + i + 1 === no && navigatingTo !== (currentPage - 1) * perPage + i + 1,
                            'bg-blue-600 text-white border-blue-700':
                                (currentPage - 1) * perPage + i + 1 !== no && isAnswered(id) && navigatingTo !== (currentPage - 1) * perPage + i + 1,
                            'bg-gray-100 text-gray-700 border-gray-300 disabled:opacity-60':
                                (currentPage - 1) * perPage + i + 1 !== no && !isAnswered(id) && navigatingTo !== (currentPage - 1) * perPage + i + 1,
                        }">
                    <span :class="{ 'opacity-0': navigatingTo === (currentPage - 1) * perPage + i + 1 }">
                        {{ (currentPage - 1) * perPage + i + 1 }}
                    </span>
                    <svg v-if="navigatingTo === (currentPage - 1) * perPage + i + 1"
                        class="animate-spin w-3 h-3 absolute inset-0 m-auto" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                </button>
            </div>

            <div class="flex justify-between items-center mt-4 text-sm">

                <button @click="currentPage--" :disabled="currentPage === 1 || isNavigating"
                    class="px-3 py-2 rounded border dark:hover:bg-gray-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed">
                    ← Prev
                </button>

                <span class="text-gray-500 dark:text-gray-400">
                    {{ currentPage }} / {{ totalPages }}
                </span>

                <button @click="currentPage++" :disabled="currentPage === totalPages || isNavigating"
                    class="px-3 py-2 rounded border dark:hover:bg-gray-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed">
                    Next →
                </button>

            </div>
        </div>

    </div>
</template>
