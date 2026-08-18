<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import MateriContent from '@/Components/MateriContent.vue'
import { reactive, ref, computed, onBeforeUnmount } from 'vue'
import { router } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import axios from 'axios'
import { useAlert } from '@/Composables/useAlert.js';

const props = defineProps({
    kelas: Array,
    subjects: Array,
    aiPlan: Object,
})

const { success, error } = useAlert();

const goToUpgrade = () => {
    router.visit(route('guru.aiPricing'))
}

// --- Plan / badge logic ---
const isPremiumPlan = computed(() =>
    ['pro', 'max'].includes(props.aiPlan?.current_plan) &&
    props.aiPlan?.status === 'active'
)

const planLabel = computed(() => {
    if (!isPremiumPlan.value) return 'Beta'
    return props.aiPlan?.current_plan === 'max' ? 'Max Premium' : 'Pro Premium'
})

// --- Upgrade button logic: hanya muncul kalau kredit sudah habis ---
const creditsRemaining = computed(() => props.aiPlan?.remaining ?? 0)

const showUpgradeButton = computed(() => {
    // tampilkan tombol upgrade hanya jika kredit sudah habis,
    // dan user belum di paket tertinggi (max) yang sedang aktif
    const isMaxActive = props.aiPlan?.current_plan === 'max' && props.aiPlan?.status === 'active'
    return creditsRemaining.value <= 0 && !isMaxActive
})

const form = reactive({
    kelas_id: '',
    mapel_id: '',
    judul: '',
    topik: '',
    deskripsi: '',
})

const generating = ref(false)
const create = ref(false)
const materiForm = ref(null)

// Kolom Judul disembunyikan sampai AI selesai generate deskripsi — begitu
// hasil pertama muncul, kolom judul (hasil generate, tetap bisa diedit)
// baru ditampilkan.
const hasGenerated = ref(false)
const descTab = ref('edit') // 'edit' | 'preview'

const canGenerate = computed(() =>
    form.kelas_id && form.mapel_id && form.topik
)

const toTitleCase = (str) => {
    if (!str) return ''
    const kecil = ['dan', 'di', 'ke', 'dari', 'yang', 'untuk', 'pada', 'dengan', 'atau', 'ini', 'itu']
    return str.toLowerCase().split(' ').map((w, i) => {
        if (i !== 0 && kecil.includes(w)) return w
        return w.charAt(0).toUpperCase() + w.slice(1)
    }).join(' ')
}

const stageMeta = {
    queued: { text: 'Sedang berpikir...' },
    analyzing: { text: 'Menganalisis topik & kelas...' },
    contacting_ai: { text: 'Mencari sumber yang relevan...' },
    parsing: { text: 'Menyusun kerangka materi...' },
    done: { icon: '✅', text: 'Selesai!' },
    failed: { icon: '⚠️', text: 'Gagal generate' },
}

const currentStageKey = ref('queued')
const currentStage = computed(() => stageMeta[currentStageKey.value] ?? stageMeta.queued)

let pollTimer = null
let pollActive = false

const stopPolling = () => {
    pollActive = false
    if (pollTimer) clearTimeout(pollTimer)
    pollTimer = null
}

onBeforeUnmount(() => {
    stopPolling()
})

const pollStatus = (generationId) => {
    pollActive = true

    const tick = async () => {
        if (!pollActive) return // sudah dihentikan, jangan lanjut

        try {
            const { data } = await axios.post(route('guru.material.generateAiStatus', generationId))

            if (!pollActive) return // dihentikan SAAT request lagi jalan — buang hasilnya

            currentStageKey.value = data.stage

            if (data.stage === 'done') {
                stopPolling()
                generating.value = false

                form.judul = toTitleCase(data.result.judul || form.judul)
                form.deskripsi = data.result.deskripsi
                hasGenerated.value = true

                success('Deskripsi berhasil digenerate. Silakan review sebelum disimpan.')
                return
            }

            if (data.stage === 'failed') {
                stopPolling()
                generating.value = false
                error(data.message || 'Gagal generate materi dengan AI.')
                return
            }

            pollTimer = setTimeout(tick, 1200)
        } catch (e) {
            stopPolling()
            generating.value = false
            error('Gagal memantau proses generate. Coba lagi.')
        }
    }

    tick()
}

const generateWithAi = async () => {
    if (!canGenerate.value) {
        error('Lengkapi kelas, mapel, judul, dan topik dulu sebelum generate.')
        return
    }

    generating.value = true
    currentStageKey.value = 'queued'

    try {
        const { data } = await axios.post(route('guru.material.generateAi'), {
            kelas_id: form.kelas_id,
            mapel_id: form.mapel_id,
            judul: form.judul || null,
            topik: form.topik,
        })

        pollStatus(data.generation_id)
    } catch (e) {
        generating.value = false
        error(e.response?.data?.message || 'Gagal memulai proses generate.')
    }
}

const submitMateri = () => {
    if (!materiForm.value.checkValidity()) {
        materiForm.value.reportValidity()
        return
    }

    create.value = true
    const formData = new FormData()
    formData.append('kelas_id', form.kelas_id)
    formData.append('mapel_id', form.mapel_id)
    formData.append('judul', form.judul)
    formData.append('deskripsi', form.deskripsi)

    router.post(route('guru.material.store'), formData, {
        onSuccess: () => { create.value = false },
        onError: () => { create.value = false }
    })
}
</script>

<template>
    <MenuLayout>
        <div class="min-h-screen sm:p-6 flex justify-center items-start">
            <div class="w-full max-w-7xl rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800">

                <!-- Header with Title and Upgrade Button -->
                <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-2">
                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Buat Materi dengan Ai</h1>

                        <!-- Badge: Beta (free) atau Premium (pro/max) dengan shimmer -->
                        <span :class="[
                            'text-xs px-2 py-1 rounded-full font-semibold',
                            isPremiumPlan
                                ? 'badge-shimmer text-white'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                        ]">
                            {{ planLabel }}
                        </span>
                    </div>
                    <div class="flex items-center gap-3">
                        <!-- Upgrade Button: hanya muncul kalau kredit sudah habis -->
                        <button v-if="showUpgradeButton" @click="goToUpgrade"
                            class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            Upgrade Paket
                        </button>
                    </div>
                </div>

                <form ref="materiForm" @submit.prevent="submitMateri" class="space-y-6">

                    <!-- Recipient & Subject -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Recipient</label>
                            <select v-model="form.kelas_id" required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                <option value="" disabled>Select Class</option>
                                <option v-for="k in kelas" :key="k.id" :value="k.id">{{ k.kelas }}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Subject</label>
                            <select v-model="form.mapel_id" required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                <option value="" disabled>Select subject</option>
                                <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.mapel }}</option>
                            </select>
                        </div>
                    </div>

                    <!-- Topik / Prompt untuk AI -->
                    <div>
                        <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                            Prompting ( Instruksi untuk Ai )
                        </label>
                        <textarea v-model="form.topik" rows="3"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder="e.g., Jelaskan proses fotosintesis secara sederhana untuk siswa, sertakan tahapannya. Bisa juga sebutkan referensi spesifik, mis. 'sesuai buku Biologi Campbell edisi 9'"></textarea>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Pilih kelas & mapel dulu di atas, lalu tuliskan topik. AI akan mencari referensi
                            tepercaya secara langsung (atau memakai referensi yang kamu sebutkan), menyesuaikan
                            bahasa dan tingkat kesulitan sesuai kelas & mapel, serta menyertakan sumber sebagai
                            catatan kaki.
                        </p>
                    </div>

                    <button type="button" @click="generateWithAi" :disabled="generating || !canGenerate"
                        class="relative w-full sm:w-auto sm:min-w-[280px] overflow-hidden inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-90 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg transition">

                        <!-- Shimmer background waktu generating -->
                        <span v-if="generating" class="absolute inset-0 gen-shimmer"></span>

                        <span class="relative flex items-center gap-2">
                            <template v-if="generating">
                                <svg class="animate-spin h-4 w-4 text-white shrink-0" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <Transition name="stage-fade" mode="out-in">
                                    <span :key="currentStageKey" class="inline-flex items-center gap-1.5">
                                        <span>{{ currentStage.icon }}</span>
                                        <span>{{ currentStage.text }}</span>
                                    </span>
                                </Transition>
                            </template>
                            <template v-else>
                                ✨ Generate dengan AI
                            </template>
                        </span>
                    </button>

                    <!-- Title: disembunyikan sampai AI selesai generate, lalu muncul terisi otomatis & bisa diedit -->
                    <div v-if="hasGenerated">
                        <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                            Title / Judul Materi
                        </label>
                        <input type="text" v-model="form.judul"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder="Judul hasil generate AI, edit jika perlu" />
                        <span class="text-xs font-normal text-gray-400">Judul dibuat AI mengikuti isi materi. Anda
                            dapat mengubahnya sebelum disimpan</span>
                    </div>

                    <!-- Description (hasil AI, tetap bisa diedit manual, dengan preview rapi) -->
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="font-medium text-gray-700 dark:text-gray-200">Description</label>

                            <!-- Toggle Edit / Preview -->
                            <div
                                class="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 p-0.5 bg-gray-50 dark:bg-gray-900">
                                <button type="button" @click="descTab = 'edit'" :class="[
                                    'px-3 py-1 text-xs font-semibold rounded-md transition-colors',
                                    descTab === 'edit'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                ]">
                                    ✏️ Edit
                                </button>
                                <button type="button" @click="descTab = 'preview'" :class="[
                                    'px-3 py-1 text-xs font-semibold rounded-md transition-colors',
                                    descTab === 'preview'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                ]">
                                    👁️ Preview
                                </button>
                            </div>
                        </div>

                        <!-- Mode Edit: textarea raw markdown, tetap yang divalidasi form -->
                        <textarea v-show="descTab === 'edit'" v-model="form.deskripsi" required rows="14"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder="Hasil generate AI akan muncul di sini, dan bisa kamu edit sebelum disimpan..."></textarea>

                        <!-- Mode Preview: render rapi pakai komponen yang sama dengan yang dilihat siswa -->
                        <div v-show="descTab === 'preview'"
                            class="w-full min-h-[280px] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800">
                            <MateriContent v-if="form.deskripsi" :content="form.deskripsi" />
                            <p v-else class="text-sm text-gray-400 italic">Belum ada konten untuk di-preview.</p>
                        </div>
                    </div>

                    <span class="text-sm font-normal text-gray-400">Note : AI dapat melakukan kesalahan.
                        Harap periksa kembali hasil respons.</span>

                    <!-- Submit & Cancel Buttons -->
                    <div class="flex justify-end space-x-4 mt-6">
                        <button type="button" @click="router.get(route('guru.material.index'))"
                            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg flex items-center justify-center transition-all duration-200">
                            Cancel
                        </button>

                        <button type="submit"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-all duration-200"
                            :disabled="create">
                            <svg v-if="create" class="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                                </path>
                            </svg>
                            {{ create ? 'Creating...' : 'Create Material' }}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </MenuLayout>
</template>

<style scoped>
.badge-shimmer {
    position: relative;
    overflow: hidden;
    background: linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed);
    background-size: 200% 100%;
    animation: shimmer-move 2.5s linear infinite;
}

.badge-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 45%,
            rgba(255, 255, 255, 0.5) 55%,
            transparent 100%);
    background-size: 200% 100%;
    animation: shimmer-shine 2.5s ease-in-out infinite;
}

@keyframes shimmer-move {
    0% {
        background-position: 0% 0%;
    }

    100% {
        background-position: 200% 0%;
    }
}

@keyframes shimmer-shine {
    0% {
        background-position: 150% 0;
    }

    100% {
        background-position: -50% 0;
    }
}

/* Shimmer di background tombol generate saat proses */
.gen-shimmer {
    background: linear-gradient(100deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0) 70%);
    background-size: 200% 100%;
    animation: gen-shimmer-move 1.8s ease-in-out infinite;
}

@keyframes gen-shimmer-move {
    0% {
        background-position: -100% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

/* Transisi teks antar tahap */
.stage-fade-enter-active,
.stage-fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.stage-fade-enter-from {
    opacity: 0;
    transform: translateY(4px);
}

.stage-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>