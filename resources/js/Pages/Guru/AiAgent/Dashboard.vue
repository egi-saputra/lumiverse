<template>
    <MenuLayout>
        <div class="min-h-screen sm:px-4 flex justify-center items-start py-6">
            <div class="w-full space-y-8">

                <!-- Hero Section -->
                <div
                    class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-gray-300 dark:border-purple-600">

                    <!-- Subtle background pattern (grid) -->
                    <svg class="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-800"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="lumi-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" stroke-width="1" />
                            </pattern>
                            <radialGradient id="lumi-fade" cx="50%" cy="20%" r="85%">
                                <stop offset="0%" stop-color="white" stop-opacity="1" />
                                <stop offset="100%" stop-color="white" stop-opacity="0.15" />
                            </radialGradient>
                            <mask id="lumi-mask">
                                <rect width="100%" height="100%" fill="url(#lumi-fade)" />
                            </mask>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#lumi-grid)" mask="url(#lumi-mask)" />
                    </svg>

                    <!-- Content -->
                    <div class="relative z-10 p-8 sm:p-12">
                        <div class="flex items-start justify-between mb-6 gap-4">
                            <div>
                                <div class="flex items-center gap-3 mb-3">
                                    <div
                                        class="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
                                        <svg class="w-7 h-7 text-purple-600 dark:text-purple-400" fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h1
                                        class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        Lumi Ai Assistant</h1>
                                </div>
                                <p class="text-gray-600 dark:text-gray-300 text-lg font-medium max-w-2xl">
                                    Asisten Kecerdasan Buatan Untuk Efisiensi Kinerja Yang Lebih Optimal ✨
                                </p>
                            </div>
                            <span v-if="planInfo.status === 'active'"
                                class="shrink-0 inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-xs font-bold px-4 py-2 rounded-full">
                                ✓ PREMIUM
                            </span>
                            <span v-else
                                class="shrink-0 inline-flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-900 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-4 py-2 rounded-full">
                                FREE TRIAL
                            </span>
                        </div>

                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
                            Lumi Assistant merupakan solusi inovatif yang dirancang khusus untuk mendukung Bapak/Ibu
                            guru dalam mengembangkan konten pembelajaran berkualitas tinggi yang sudah terintegrasi
                            penuh dengan sistem Lumiverse School. Dengan teknologi kecerdasan
                            buatan terdepan, kami membantu Anda membuat materi pembelajaran yang menarik dan soal ujian
                            yang terukur dalam waktu singkat.
                        </p>
                    </div>
                </div>

                <!-- Features Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Current Features -->
                    <div
                        class="rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 shadow-lg p-6 border-l-4 border-purple-600">
                        <div class="flex items-start gap-3 mb-4">
                            <svg class="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                            </svg>
                            <div>
                                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Fitur Tersedia Saat Ini
                                </h3>
                                <ul class="space-y-2">
                                    <li class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span class="text-gray-700 dark:text-gray-300"><strong>Generate Materi
                                                Pembelajaran</strong><br>Membuat materi pembelajaran yang komprehensif
                                            berdasarkan topik yang Anda tentukan berdasarkan sumber yang relevan dan
                                            terpercaya.</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span class="text-gray-700 dark:text-gray-300"><strong>Generate Dokumen
                                                PDF</strong><br>Otomatis membuat contoh dokumen dalam format PDF yang
                                            siap cetak.</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span class="text-gray-700 dark:text-gray-300"><strong>Personalisasi
                                                Konten</strong><br>AI sistem kami akan menyesuaikan bahasa dan tingkat
                                            kesulitan sesuai
                                            kelas / jenjang yang ditentukan.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Coming Soon Features -->
                    <div
                        class="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-lg p-6 border-l-4 border-blue-600">
                        <div class="flex items-start gap-3 mb-4">
                            <svg class="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <div>
                                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Fitur Mendatang
                                    (Roadmap) 🚀</h3>
                                <ul class="space-y-2">
                                    <li class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                            <path fill-rule="evenodd"
                                                d="M4 5a2 2 0 012-2 1 1 0 000 2h10a1 1 0 000-2 2 2 0 00-2 2v10a2 2 0 002 2 1 1 0 100 2h-2a1 1 0 100 2h2a4 4 0 004-4V5a4 4 0 00-4-4H8a4 4 0 00-4 4v10a2 2 0 002-2V5z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                        <span class="text-gray-700 dark:text-gray-300"><strong>Generate Soal
                                                Ujian Otomatis</strong><br>Buat soal-soal berkualitas berdasarkan materi
                                            yang
                                            telah Anda buat sebagai referensi nyata.</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                            <path fill-rule="evenodd"
                                                d="M4 5a2 2 0 012-2 1 1 0 000 2h10a1 1 0 000-2 2 2 0 00-2 2v10a2 2 0 002 2 1 1 0 100 2h-2a1 1 0 100 2h2a4 4 0 004-4V5a4 4 0 00-4-4H8a4 4 0 00-4 4v10a2 2 0 002-2V5z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                        <span class="text-gray-700 dark:text-gray-300"><strong>Saran Rubrik
                                                Penilaian</strong><br>AI memberikan panduan penilaian yang sesuai dengan
                                            standar pendidikan.</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                            <path fill-rule="evenodd"
                                                d="M4 5a2 2 0 012-2 1 1 0 000 2h10a1 1 0 000-2 2 2 0 00-2 2v10a2 2 0 002 2 1 1 0 100 2h-2a1 1 0 100 2h2a4 4 0 004-4V5a4 4 0 00-4-4H8a4 4 0 00-4 4v10a2 2 0 002-2V5z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                        <span class="text-gray-700 dark:text-gray-300"><strong>Analisis
                                                Pembelajaran</strong><br>Dapatkan wawasan mendalam tentang efektivitas
                                            materi pembelajaran.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Current Plan & Usage Section -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <!-- Plan Card -->
                    <div
                        class="lg:col-span-1 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 shadow-lg p-6 border-t-4 border-purple-600">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Informasi Layanan</h3>

                        <div class="space-y-4">
                            <div>
                                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Paket Aktif Saat Ini</div>
                                <div class="text-3xl font-bold text-purple-600 capitalize">{{ planInfo.current_plan }}
                                </div>
                            </div>

                            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Kuota Per Bulan</div>
                                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ planInfo.limit }}
                                    Kredit Token</div>
                            </div>

                            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <span
                                            class="text-sm font-medium text-gray-700 dark:text-gray-300">Digunakan</span>
                                        <span class="text-sm font-bold text-gray-900 dark:text-white">{{ planInfo.used
                                            }} / {{ planInfo.limit }}</span>
                                    </div>
                                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div class="bg-gradient-to-r from-green-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                                            :style="{ width: Math.min(planInfo.percentage_used, 100) + '%' }">
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-gray-600 dark:text-gray-400">{{
                                            planInfo.percentage_used }}% digunakan</span>
                                        <span class="text-xs font-semibold"
                                            :class="planInfo.remaining > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                            {{ planInfo.remaining }} tersisa
                                        </span>
                                    </div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 pt-1">
                                        Kuota di-reset otomatis pada {{ formatDate(planInfo.reset_at) }}
                                    </p>
                                </div>

                                <div v-if="planInfo.status !== 'active'"
                                    class="mt-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                    <p class="text-sm text-yellow-800 dark:text-yellow-200">
                                        Upgrade paket Pro atau Max
                                        untuk mendapatkan kredit token yang lebih banyak.
                                    </p>
                                </div>
                            </div>

                            <div v-if="planInfo.status === 'active'"
                                class="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Berlaku Hingga</div>
                                <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                    {{ formatDate(planInfo.expires_at) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Upgrade Options -->
                    <div
                        class="lg:col-span-2 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 shadow-lg p-6 border-l-4 border-purple-600">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Upgrade Paket</h3>
                            <span
                                class="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-full">
                                Hemat 20% dengan tahunan
                            </span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div v-for="plan in allPlans.filter(p => p.key !== 'free')" :key="plan.key"
                                class="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group"
                                @click="goToUpgrade">
                                <div class="flex-1">
                                    <div class="font-bold text-gray-900 dark:text-white capitalize text-sm">{{
                                        plan.label }}</div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ plan.limit }} kredit
                                        token</div>
                                </div>
                                <div class="text-right">
                                    <div class="font-bold text-purple-600 text-sm">Rp {{
                                        plan.monthly_price.toLocaleString('id-ID') }}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">/bulan</div>
                                </div>
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                            <button @click="goToUpgrade"
                                class="col-span-1 sm:col-span-2 py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all duration-200 flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Lihat Semua Paket
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Payment History Section -->
                <div v-if="paymentHistory.length > 0"
                    class="rounded-xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Riwayat Pembayaran</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th
                                        class="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Tanggal</th>
                                    <th
                                        class="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Paket</th>
                                    <th
                                        class="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Jumlah</th>
                                    <th
                                        class="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Status</th>
                                    <th
                                        class="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr v-for="payment in paymentHistory" :key="payment.id"
                                    class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {{ formatDate(payment.created_at) }}
                                    </td>
                                    <td
                                        class="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                        {{ payment.plan_key }}
                                    </td>
                                    <td class="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        <span v-if="payment.amount > 0">Rp {{ payment.amount.toLocaleString('id-ID')
                                        }}</span>
                                        <span v-else class="text-gray-600 dark:text-gray-400">Gratis</span>
                                    </td>
                                    <td class="px-6 py-4 text-sm">
                                        <span v-if="payment.status === 'paid'"
                                            class="inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full">
                                            ✓ Succeded
                                        </span>
                                        <span v-else-if="payment.status === 'pending'"
                                            class="inline-block bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-xs font-bold px-3 py-1 rounded-full">
                                            ⏳ Pending
                                        </span>
                                        <span v-else-if="payment.status === 'expired'"
                                            class="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
                                            ⏱ Expired
                                        </span>
                                        <span v-else
                                            class="inline-block bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold px-3 py-1 rounded-full">
                                            ✕ Failed
                                        </span>
                                    </td>

                                    <td class="px-6 py-4 text-center">
                                        <div class="flex items-center justify-center gap-3">
                                            <a v-if="payment.status === 'pending' && payment.invoice_url"
                                                :href="payment.invoice_url" target="_blank"
                                                class="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 font-semibold text-sm transition-colors">
                                                Bayar Sekarang
                                            </a>

                                            <button v-else-if="payment.status === 'expired'"
                                                @click="retryCheckout(payment.id)"
                                                :disabled="retryLoadingId === payment.id"
                                                class="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 font-semibold text-sm transition-colors disabled:opacity-50">
                                                {{ retryLoadingId === payment.id ? 'Memproses...' : 'Buat Invoice Baru'
                                                }}
                                            </button>

                                            <button @click="viewInvoice(payment.external_id)"
                                                class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 font-semibold text-sm transition-colors">
                                                Lihat Invoice
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Empty State for Payment History -->
                <div v-else class="rounded-xl bg-white dark:bg-gray-800 shadow-lg p-12 text-center">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Tidak Ada Riwayat Pembayaran</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Anda belum memiliki riwayat pembayaran untuk paket
                        premium.</p>
                    <button @click="goToUpgrade"
                        class="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Upgrade Sekarang
                    </button>
                </div>
            </div>
        </div>
    </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import axios from 'axios'
import { route } from 'ziggy-js'

defineProps({
    planInfo: Object,
    allPlans: Array,
    paymentHistory: Array,
})

const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const nextResetLabel = computed(() => {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})

const goToUpgrade = () => {
    router.visit(route('guru.ai-billing.pricing'))
}

const viewInvoice = (externalId) => {
    router.visit(route('guru.ai-agent.invoice', { externalId }))
}

const retryLoadingId = ref(null)

const retryCheckout = async (aiInvoiceId) => {
    retryLoadingId.value = aiInvoiceId
    try {
        const { data } = await axios.post(route('guru.ai-billing.retry', { aiInvoice: aiInvoiceId }))
        if (data.invoice_url) {
            window.location.href = data.invoice_url
        }
    } catch (e) {
        alert(e.response?.data?.message ?? 'Gagal membuat invoice baru. Coba lagi.')
    } finally {
        retryLoadingId.value = null
    }
}
</script>
