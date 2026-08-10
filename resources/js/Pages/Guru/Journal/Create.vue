<script setup>
import UserLayout from '@/Layouts/UserLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeftIcon, MapPinIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import Form from './Form.vue'

const props = defineProps({
    kelasList: Array,
    mapelList: Array,
    serverTime: Object, // { tanggal, jam_mulai, jam_selesai } — ditentukan oleh server
    targetLocation: Object, // { latitude, longitude, radiusMeter, toleransiMeter, maxAkurasiMeter } — dari server, hanya untuk pratinjau
})

// Tanggal & jam hanya untuk ditampilkan (read-only), nilai final tetap dihitung ulang di server saat submit
const form = useForm({
    kelas_id: '',
    mapel_id: '',
    tanggal: props.serverTime.tanggal,
    jam_mulai: props.serverTime.jam_mulai,
    jam_selesai: props.serverTime.jam_selesai,
    materi: '',
    latitude: null,
    longitude: null,
    akurasi_meter: null,
})

// --- Validasi lokasi (GPS) ---------------------------------------------
// Status lokal hanya untuk PRATINJAU/UX sebelum submit. Server SELALU
// menghitung ulang & menentukan valid/tidaknya secara independen — jadi
// nilai di sini tidak pernah dianggap otoritatif.
const lokasiStatus = ref('requesting') // 'requesting' | 'ok' | 'out_of_range' | 'poor_accuracy' | 'denied' | 'unsupported'
const jarakPerkiraan = ref(null)
let watcherId = null

function jarakMeter(lat1, lng1, lat2, lng2) {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function evaluasiPosisi(pos) {
    const { latitude, longitude, accuracy } = pos.coords

    form.latitude = latitude
    form.longitude = longitude
    form.akurasi_meter = accuracy

    const target = props.targetLocation
    const jarak = jarakMeter(latitude, longitude, target.latitude, target.longitude)
    jarakPerkiraan.value = Math.round(jarak)

    if (accuracy > target.maxAkurasiMeter) {
        lokasiStatus.value = 'poor_accuracy'
        return
    }

    if (jarak > target.radiusMeter + target.toleransiMeter) {
        lokasiStatus.value = 'out_of_range'
        return
    }

    lokasiStatus.value = 'ok'
}

function mintaLokasi() {
    if (!('geolocation' in navigator)) {
        lokasiStatus.value = 'unsupported'
        return
    }

    lokasiStatus.value = 'requesting'
    jarakPerkiraan.value = null

    // watchPosition (bukan getCurrentPosition sekali saja) supaya kalau
    // guru tetap di tempat & sinyal GPS membaik, status ikut ter-update
    // otomatis tanpa perlu klik ulang.
    watcherId = navigator.geolocation.watchPosition(evaluasiPosisi, (err) => {
        lokasiStatus.value = err.code === err.PERMISSION_DENIED ? 'denied' : 'unsupported'
    }, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
    })
}

onMounted(mintaLokasi)
onUnmounted(() => {
    if (watcherId !== null) navigator.geolocation.clearWatch(watcherId)
})

const lokasiValid = computed(() => lokasiStatus.value === 'ok')

const pesanLokasi = computed(() => {
    switch (lokasiStatus.value) {
        case 'requesting': return 'Mendeteksi lokasi Anda...'
        case 'ok': return `Lokasi terverifikasi (± ${jarakPerkiraan.value} m dari sekolah).`
        case 'out_of_range': return `Anda berada di luar radius sekolah (± ${jarakPerkiraan.value} m). Mendekatlah ke area sekolah.`
        case 'poor_accuracy': return 'Sinyal GPS kurang akurat. Coba di tempat terbuka atau tunggu sebentar.'
        case 'denied': return 'Izin lokasi ditolak. Aktifkan izin lokasi di browser untuk mengisi jurnal.'
        case 'unsupported': return 'Perangkat/browser ini tidak mendukung deteksi lokasi.'
        default: return ''
    }
})

const submit = () => {
    if (!lokasiValid.value) return
    form.post(route('guru.journal.store'))
}
</script>

<template>

    <Head title="Isi Jurnal Mengajar" />

    <UserLayout>
        <div class="mx-auto">
            <Link :href="route('guru.journal.index')"
                class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5">
                <ArrowLeftIcon class="w-4 h-4" />
                Kembali ke Jurnal
            </Link>

            <div class="mb-6">
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">Isi Jurnal Mengajar</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Catat kehadiran & materi sebelum memulai pelajaran.
                </p>
            </div>

            <!-- Status lokasi -->
            <div class="mb-5 px-4 py-3 rounded-xl border flex items-start gap-2.5 text-sm font-medium" :class="{
                'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800/60 dark:border-gray-800 dark:text-gray-400': lokasiStatus === 'requesting',
                'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500/20 dark:text-emerald-400': lokasiStatus === 'ok',
                'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500/20 dark:text-amber-400': ['out_of_range', 'poor_accuracy'].includes(lokasiStatus),
                'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-500/20 dark:text-rose-400': ['denied', 'unsupported'].includes(lokasiStatus),
            }">
                <ArrowPathIcon v-if="lokasiStatus === 'requesting'" class="w-4 h-4 mt-0.5 flex-shrink-0 animate-spin" />
                <MapPinIcon v-else-if="lokasiStatus === 'ok'" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <ExclamationTriangleIcon v-else class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div class="flex-1">
                    {{ pesanLokasi }}
                </div>
                <button v-if="['out_of_range', 'poor_accuracy', 'denied', 'unsupported'].includes(lokasiStatus)"
                    type="button" @click="mintaLokasi" class="text-xs font-semibold underline flex-shrink-0">
                    Coba lagi
                </button>
            </div>

            <div
                class="p-6 rounded-2xl border bg-white border-gray-100 shadow-sm dark:bg-gray-900/60 dark:border-gray-800">
                <Form :form="form" :kelas-list="kelasList" :mapel-list="mapelList" :lock-time="true"
                    :submit-disabled="!lokasiValid" submit-label="Simpan Jurnal" @submit="submit" />
            </div>
        </div>
    </UserLayout>
</template>