<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, useForm } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ref } from 'vue'
import { MapPinIcon, CogIcon, ClockIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    setting: Object,
    default: Object,
})

const awal = props.setting ?? props.default

// Kalau props.setting ada, berarti sudah pernah disimpan sebelumnya -> mode update
const sudahAda = !!props.setting

const form = useForm({
    latitude: awal.latitude,
    longitude: awal.longitude,
    radius_meter: awal.radius_meter,
    toleransi_meter: awal.toleransi_meter,
    max_akurasi_meter: awal.max_akurasi_meter,
    kecepatan_maksimum_kmh: awal.kecepatan_maksimum_kmh,
    // Kolom time() dari backend formatnya 'HH:mm:ss', input type="time" butuh 'HH:mm'
    jam_buka: (awal.jam_buka || '').slice(0, 5),
    jam_tutup: (awal.jam_tutup || '').slice(0, 5),
    durasi_sesi_menit: awal.durasi_sesi_menit,
    timezone: awal.timezone,
})

const simpan = () => {
    form.put(route('admin.journal-setting.update'), {
        preserveScroll: true,
    })
}

// ── Status ambil lokasi GPS (browser Geolocation API punya jeda,
//    jadi perlu indikator loading biar user tidak bingung nunggu apa) ──
const sedangAmbilLokasi = ref(false)
const errorAmbilLokasi = ref('')

const ambilLokasiSaya = () => {
    if (!navigator.geolocation) {
        errorAmbilLokasi.value = 'Browser ini tidak mendukung geolocation.'
        return
    }

    sedangAmbilLokasi.value = true
    errorAmbilLokasi.value = ''

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            form.latitude = pos.coords.latitude
            form.longitude = pos.coords.longitude
            sedangAmbilLokasi.value = false
        },
        () => {
            errorAmbilLokasi.value = 'Gagal mengambil lokasi. Pastikan izin lokasi diaktifkan.'
            sedangAmbilLokasi.value = false
        },
        { enableHighAccuracy: true, timeout: 15000 }
    )
}

const timezoneOptions = [
    { value: 'Asia/Jakarta', label: 'WIB — Jakarta' },
    { value: 'Asia/Makassar', label: 'WITA — Makassar' },
    { value: 'Asia/Jayapura', label: 'WIT — Jayapura' },
]

const inputClass = 'w-full px-4 py-2.5 rounded-xl border text-sm bg-white border-gray-200 text-gray-800 \
    dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40'
const labelClass = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5'
</script>

<template>

    <Head title="Pengaturan Lokasi Jurnal" />

    <MenuLayout>
        <div>

            <!-- Header -->
            <div class="flex items-center gap-3 mb-6">
                <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <MapPinIcon class="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 class="text-xl font-bold text-gray-900 dark:text-white">Pengaturan Jurnal Mengajar</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Lokasi, jam operasional & toleransi untuk
                        validasi pengisian jurnal</p>
                </div>
            </div>

            <form @submit.prevent="simpan" class="p-5 rounded-2xl border bg-white border-gray-100 shadow-sm space-y-5
                       dark:bg-gray-900/60 dark:border-gray-800">

                <!-- Koordinat -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label :class="labelClass">Latitude</label>
                        <input v-model="form.latitude" type="number" step="0.0000001" :disabled="sedangAmbilLokasi"
                            :class="[inputClass, sedangAmbilLokasi ? 'opacity-60 cursor-not-allowed' : '']" />
                        <p v-if="form.errors.latitude" class="text-xs text-red-500 mt-1">{{ form.errors.latitude }}</p>
                    </div>
                    <div>
                        <label :class="labelClass">Longitude</label>
                        <input v-model="form.longitude" type="number" step="0.0000001" :disabled="sedangAmbilLokasi"
                            :class="[inputClass, sedangAmbilLokasi ? 'opacity-60 cursor-not-allowed' : '']" />
                        <p v-if="form.errors.longitude" class="text-xs text-red-500 mt-1">{{ form.errors.longitude }}
                        </p>
                    </div>
                </div>

                <div>
                    <button type="button" @click="ambilLokasiSaya" :disabled="sedangAmbilLokasi"
                        class="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:no-underline">
                        <svg v-if="sedangAmbilLokasi" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <MapPinIcon v-else class="w-3.5 h-3.5" />
                        {{ sedangAmbilLokasi ? 'Mengambil titik lokasi, mohon tunggu...' : 'Ambil dari lokasi saya sekarang' }}
                    </button>
                    <p v-if="errorAmbilLokasi" class="text-xs text-red-500 mt-1.5">{{ errorAmbilLokasi }}</p>
                </div>

                <p v-if="form.latitude && form.longitude" class="text-xs text-gray-400">
                    Cek di peta:
                    <a :href="`https://www.google.com/maps?q=${form.latitude},${form.longitude}`" target="_blank"
                        class="text-cyan-600 dark:text-cyan-400 hover:underline">
                        buka Google Maps
                    </a>
                </p>

                <hr class="border-gray-100 dark:border-gray-800" />

                <!-- Threshold lokasi -->
                <div
                    class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    <CogIcon class="w-4 h-4" />
                    Threshold Validasi Lokasi
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label :class="labelClass">Radius lokasi (meter)</label>
                        <input v-model.number="form.radius_meter" type="number" min="1" :class="inputClass" />
                        <p v-if="form.errors.radius_meter" class="text-xs text-red-500 mt-1">{{ form.errors.radius_meter
                        }}</p>
                    </div>
                    <div>
                        <label :class="labelClass">Toleransi jarak (meter)</label>
                        <input v-model.number="form.toleransi_meter" type="number" min="0" :class="inputClass" />
                        <p v-if="form.errors.toleransi_meter" class="text-xs text-red-500 mt-1">{{
                            form.errors.toleransi_meter }}</p>
                    </div>
                    <div>
                        <label :class="labelClass">Maks. akurasi GPS diterima (meter)</label>
                        <input v-model.number="form.max_akurasi_meter" type="number" min="1" :class="inputClass" />
                        <p class="text-xs text-gray-400 mt-1">Semakin kecil = semakin ketat, tapi makin sering ditolak
                            di lokasi sinyal GPS lemah.</p>
                        <p v-if="form.errors.max_akurasi_meter" class="text-xs text-red-500 mt-1">{{
                            form.errors.max_akurasi_meter }}</p>
                    </div>
                    <div>
                        <label :class="labelClass">Maks. kecepatan wajar (km/jam)</label>
                        <input v-model.number="form.kecepatan_maksimum_kmh" type="number" min="1" :class="inputClass" />
                        <p v-if="form.errors.kecepatan_maksimum_kmh" class="text-xs text-red-500 mt-1">{{
                            form.errors.kecepatan_maksimum_kmh }}</p>
                    </div>
                </div>

                <hr class="border-gray-100 dark:border-gray-800" />

                <!-- Jam operasional -->
                <div
                    class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    <ClockIcon class="w-4 h-4" />
                    Jam Operasional Pengisian Jurnal
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label :class="labelClass">Jam buka</label>
                        <input v-model="form.jam_buka" type="time" :class="inputClass" />
                        <p v-if="form.errors.jam_buka" class="text-xs text-red-500 mt-1">{{ form.errors.jam_buka }}</p>
                    </div>
                    <div>
                        <label :class="labelClass">Jam tutup</label>
                        <input v-model="form.jam_tutup" type="time" :class="inputClass" />
                        <p v-if="form.errors.jam_tutup" class="text-xs text-red-500 mt-1">{{ form.errors.jam_tutup }}
                        </p>
                    </div>
                    <div>
                        <label :class="labelClass">Durasi satu sesi (menit)</label>
                        <input v-model.number="form.durasi_sesi_menit" type="number" min="5" max="480"
                            :class="inputClass" />
                        <p class="text-xs text-gray-400 mt-1">Dipakai untuk hitung jam selesai otomatis saat guru submit
                            jurnal.</p>
                        <p v-if="form.errors.durasi_sesi_menit" class="text-xs text-red-500 mt-1">{{
                            form.errors.durasi_sesi_menit }}</p>
                    </div>
                    <div>
                        <label :class="labelClass">Zona waktu</label>
                        <select v-model="form.timezone" :class="inputClass">
                            <option v-for="tz in timezoneOptions" :key="tz.value" :value="tz.value">{{ tz.label }}
                            </option>
                        </select>
                        <p v-if="form.errors.timezone" class="text-xs text-red-500 mt-1">{{ form.errors.timezone }}</p>
                    </div>
                </div>

                <div class="flex justify-end pt-2">
                    <button type="submit" :disabled="form.processing || sedangAmbilLokasi"
                        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed">
                        <svg v-if="form.processing" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>
                            <template v-if="form.processing">
                                {{ sudahAda ? 'Memperbarui...' : 'Menyimpan...' }}
                            </template>
                            <template v-else>
                                {{ sudahAda ? 'Update Pengaturan' : 'Simpan Pengaturan' }}
                            </template>
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </MenuLayout>
</template>