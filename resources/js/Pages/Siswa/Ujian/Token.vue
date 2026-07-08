<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import MenuLayout from '@/Layouts/MenuLayout.vue'
import { Head, useForm, usePage } from '@inertiajs/vue3'
import { router } from '@inertiajs/vue3'

onMounted(() => {
    // Paksa ganti history agar halaman ini tidak bisa "ditinggali"
    window.history.pushState(null, '', window.location.href)

    const handleBack = () => {
        router.visit(route('siswa.dashboard'), {
            replace: true
        })
    }

    window.addEventListener('popstate', handleBack)

    // cleanup
    onUnmounted(() => {
        window.removeEventListener('popstate', handleBack)
    })
})

const page = usePage()


const form = useForm({ token: '' })
const isSubmitting = ref(false)
const tokenInput = ref(null)

const submit = () => {
    if (isSubmitting.value) return
    isSubmitting.value = true

    form.post(route('siswa.ujian.validateToken'), {
        preserveScroll: true,
        onFinish: () => { isSubmitting.value = false }
    })
}

onMounted(() => {
    // Reset token secara manual, tapi jangan reset ref input, supaya copy-paste bisa
    form.token = ''
    nextTick(() => {
        tokenInput.value?.focus()
        // Seleksi text supaya bisa langsung di-copy/paste
        tokenInput.value?.select()
    })
})
</script>

<template>
    <MenuLayout :disableSwal="true">

        <Head title="Input Token Ujian" />

        <!-- WRAPPER -->
        <div class="sm:min-h-[80vh] flex items-center justify-center sm:px-4">

            <!-- CARD GLASS -->
            <div class="relative w-full max-w-lg rounded-3xl
                       bg-white/70 dark:bg-white/10
                       backdrop-blur-2xl
                       border border-white/30 dark:border-white/10
                       shadow-2xl p-8 sm:p-10 transition">

                <!-- GLOW -->
                <div class="absolute -top-24 -right-24 w-72 h-72
                           dark:bg-gradient-to-br dark:from-blue-500 dark:to-indigo-600
                           opacity-20 blur-3xl rounded-full">
                </div>

                <!-- HEADER -->
                <div class="relative z-10 text-center space-y-4 mb-8">

                    <!-- ICON -->
                    <div class="mx-auto w-16 h-16 flex items-center justify-center
                               rounded-2xl shadow-lg
                               transition-all duration-300" :class="page.props.flash?.error
                                ? 'bg-red-100 dark:bg-red-500/20'
                                : 'bg-blue-100 dark:bg-blue-500/20'">

                        <!-- LOCK ICON -->
                        <svg v-if="!form.processing" class="w-8 h-8" :class="page.props.flash?.error
                            ? 'text-red-600'
                            : 'text-blue-600'" viewBox="0 0 24 24" fill="currentColor">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 116 0v3H9z" />
                        </svg>

                        <!-- SPINNER -->
                        <svg v-else class="w-6 h-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                    </div>

                    <!-- ERROR -->
                    <div v-if="page.props.flash?.error" class="mx-auto w-fit px-6 py-2
                               bg-red-100 dark:bg-red-500/10
                               text-red-700 dark:text-red-400
                               rounded-full text-sm font-mono tracking-widest">
                        {{ page.props.flash.error }}
                    </div>

                    <!-- TITLE -->
                    <h1 class="text-2xl sm:text-3xl font-extrabold tracking-wide
                               text-gray-800 dark:text-white">
                        Enter Exam Token
                    </h1>

                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Masukkan kode ujian yang diberikan oleh pengawas
                    </p>
                </div>

                <!-- FORM -->
                <form @submit.prevent="submit" class="relative z-10">

                    <div class="space-y-5 p-6 sm:p-8 rounded-2xl
                               bg-white/60 dark:bg-white/5
                               border border-dashed border-gray-300 dark:border-white/20
                               backdrop-blur-lg">

                        <!-- INPUT -->
                        <input ref="tokenInput" v-model="form.token" required autocomplete="off" placeholder="XXXX-XXXX"
                            class="w-full text-center
                                   px-5 py-4 rounded-xl
                                   text-lg sm:text-2xl font-mono font-bold tracking-widest
                                   text-blue-700 dark:text-blue-400
                                   bg-white dark:bg-transparent
                                   border border-gray-300 dark:border-white/20
                                   focus:ring-4 focus:ring-blue-400/40
                                   focus:outline-none transition" />

                        <!-- VALIDATION -->
                        <p v-if="form.errors.token" class="text-sm text-red-600 text-center">
                            {{ form.errors.token }}
                        </p>

                        <!-- SUBMIT -->
                        <button type="submit" :disabled="isSubmitting || form.processing" class="w-full py-4 rounded-xl
                                   font-bold text-white tracking-wide
                                   bg-gradient-to-r from-blue-600 to-indigo-600
                                   hover:from-blue-700 hover:to-indigo-700
                                   shadow-lg hover:shadow-xl
                                   transition-all duration-300
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   flex items-center justify-center gap-3">

                            <svg v-if="isSubmitting || form.processing" class="w-5 h-5 animate-spin text-white"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>

                            <span>
                                {{ (isSubmitting || form.processing)
                                    ? 'Verifying...'
                                    : 'Verify & Start Exam' }}
                            </span>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </MenuLayout>
</template>
