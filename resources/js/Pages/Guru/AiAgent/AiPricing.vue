<template>
    <MenuLayout>
        <div class="min-h-screen sm:p-6 flex justify-center items-start py-12">
            <div class="w-full max-w-6xl">
                <!-- Header -->
                <div class="text-center mb-10">
                    <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                        Lumiverse Premium Tools
                    </h1>
                    <p class="text-base text-gray-500 dark:text-gray-400 mx-auto">
                        Meluaskan waktu Anda untuk mencari inovasi terbaik dan menciptakan pembelajaran yang lebih
                        bermakna
                    </p>
                </div>

                <!-- Inline notification -->
                <transition name="fade">
                    <div v-if="notice" :class="[
                        'max-w-xl mx-auto mb-8 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 border',
                        notice.type === 'error'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                            : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                    ]">
                        <svg v-if="notice.type === 'error'" class="w-5 h-5 flex-shrink-0" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12.75l2.25 2.25 4.5-4.5m5.25 2.25a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ notice.message }}
                    </div>
                </transition>

                <!-- Billing cycle toggle -->
                <div class="flex justify-center mb-12">
                    <div
                        class="relative inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
                        <span
                            class="absolute top-1 bottom-1 left-1 w-32 rounded-full bg-white dark:bg-gray-700 shadow-sm transition-transform duration-300 ease-out"
                            :class="billingCycle === 'yearly' ? 'translate-x-32' : 'translate-x-0'"></span>
                        <button @click="billingCycle = 'monthly'" :class="[
                            'relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 w-32',
                            billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                        ]">
                            Bulanan
                        </button>
                        <button @click="billingCycle = 'yearly'" :class="[
                            'relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 w-32 flex items-center justify-center gap-1.5',
                            billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                        ]">
                            Tahunan
                            <span
                                class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">Hemat</span>
                        </button>
                    </div>
                </div>

                <!-- Pricing Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div v-for="plan in plans" :key="plan.key"
                        class="rounded-2xl p-6 sm:p-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex flex-col">

                        <!-- Plan Header -->
                        <div class="mb-6">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white capitalize mb-1">{{ plan.label }}
                            </h3>
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ quotaLabel(plan) }}</div>

                            <transition name="price-fade" mode="out-in">
                                <div :key="billingCycle" class="flex items-baseline gap-1">
                                    <span class="text-3xl font-extrabold text-gray-900 dark:text-white">
                                        {{ formatPrice(priceFor(plan)) }}
                                    </span>
                                    <span v-if="priceFor(plan) > 0" class="text-sm text-gray-500 dark:text-gray-400">
                                        /{{ billingCycle === 'yearly' ? 'tahun' : 'bulan' }}
                                    </span>
                                </div>
                            </transition>

                            <div v-if="billingCycle === 'yearly' && plan.yearly_price"
                                class="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">
                                Hemat {{ calculateSavings(plan.monthly_price, plan.yearly_price) }}%
                            </div>
                        </div>

                        <!-- Status Badge -->
                        <div v-if="current_plan === plan.key && current_plan_status === 'active'"
                            class="mb-4 inline-flex items-center gap-1 self-start bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            Paket Aktif Anda
                        </div>

                        <!-- Action Button -->
                        <button v-if="plan.key === 'free'" disabled
                            class="mb-6 w-full py-2.5 px-4 rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 font-semibold cursor-not-allowed">
                            Paket Gratis (Aktif)
                        </button>
                        <button v-else @click="selectPlan(plan, billingCycle)" :disabled="!!loadingState"
                            class="mb-6 w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <svg v-if="isLoadingPlan(plan.key, billingCycle)" class="animate-spin h-4 w-4" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                                </path>
                            </svg>
                            <span>{{ isLoadingPlan(plan.key, billingCycle) ? loadingLabel : `Dapatkan Paket
                                ${plan.label}` }}</span>
                        </button>

                        <!-- Features -->
                        <ul class="space-y-2.5 flex-1">
                            <li v-for="feature in featuresFor(plan)" :key="feature" class="flex items-start gap-2.5">
                                <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400"
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-sm text-gray-600 dark:text-gray-300">{{ feature }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { ref } from 'vue'
import { route } from 'ziggy-js'
import axios from 'axios'

defineProps({
    plans: Array,
    current_plan: String,
    current_plan_status: String,
    current_plan_expires_at: String,
})

// toggle global: 'monthly' | 'yearly'
const billingCycle = ref('monthly')
// state: 'planKey-cycle' saat proses berjalan
const loadingState = ref(null)
// teks status yang berubah sesuai tahap proses, dipakai di tombol
const loadingLabel = ref('')
// notifikasi inline pengganti sweetalert: { type: 'success' | 'error', message: string }
const notice = ref(null)

const formatPrice = (price) => {
    if (!price || price === 0) return 'Gratis'
    return 'Rp ' + price.toLocaleString('id-ID')
}

const calculateSavings = (monthly, yearly) => {
    if (!monthly || !yearly || monthly === 0) return 0
    const yearlyMonthly = (yearly / 12)
    return Math.round(((monthly - yearlyMonthly) / monthly) * 100)
}

const priceFor = (plan) => {
    return billingCycle.value === 'yearly' ? plan.yearly_price : plan.monthly_price
}

const isLoadingPlan = (planKey, cycle) => {
    return loadingState.value === `${planKey}-${cycle}`
}

const quotaLabel = (plan) => {
    return plan.key === 'free'
        ? `${plan.limit} token kredit / 3 bulan`
        : `${plan.limit} token kredit / bulan`
}

const featuresFor = (plan) => {
    if (plan.key === 'free') {
        return [
            quotaLabel(plan),
            'Membuat materi pembelajaran dengan Ai',
            'Membuat soal otomatis dengan Ai',
        ]
    }

    if (plan.key === 'max') {
        return [
            quotaLabel(plan),
            'Generate materi dengan Ai',
            'Generate soal dengan Ai',
            'Fitur export soal ujian',
            'Fitur export materi pembelajaran',
            // 'Generate dokumen PDF otomatis',
            'Prioritas tinggi untuk request AI',
        ]
    }

    // paket menengah (mis. pro)
    return [
        quotaLabel(plan),
        'Generate materi dengan Ai',
        'Generate soal dengan Ai',
        'Fitur export soal ujian',
        'Fitur export materi pembelajaran',
    ]
}

const showNotice = (type, message, autoHideMs = 4000) => {
    notice.value = { type, message }
    if (autoHideMs) {
        setTimeout(() => {
            if (notice.value && notice.value.message === message) notice.value = null
        }, autoHideMs)
    }
}

const selectPlan = async (plan, cycle) => {
    if (plan.key === 'free' || loadingState.value) return

    const billingCycleToSend = cycle
    loadingState.value = `${plan.key}-${billingCycleToSend}`
    loadingLabel.value = 'Menyiapkan pembayaran...'
    notice.value = null

    try {
        const { data } = await axios.post(route('guru.ai-billing.checkout'), {
            plan_key: plan.key,
            billing_cycle: billingCycleToSend,
        })

        if (data.action === 'activated') {
            loadingLabel.value = 'Mengaktifkan paket...'
            showNotice('success', `Paket ${plan.label} berhasil diaktifkan!`)
            setTimeout(() => {
                backToCreate()
            }, 1500)
        } else if (data.action === 'pay' && data.invoice_url) {
            loadingLabel.value = 'Mengalihkan ke halaman pembayaran...'
            window.location.href = data.invoice_url
            return // biarkan loading state tetap sampai redirect terjadi
        }
    } catch (e) {
        showNotice('error', e.response?.data?.message || 'Gagal memproses upgrade paket.')
    } finally {
        if (loadingState.value && loadingLabel.value !== 'Mengalihkan ke halaman pembayaran...') {
            loadingState.value = null
            loadingLabel.value = ''
        }
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.price-fade-enter-active,
.price-fade-leave-active {
    transition: opacity 0.15s ease;
}

.price-fade-enter-from,
.price-fade-leave-to {
    opacity: 0;
}
</style>