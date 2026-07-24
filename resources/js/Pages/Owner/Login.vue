<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import { onMounted, computed, ref } from 'vue'

const form = useForm({
    email: '',
    password: '',
    remember: false,
})

const showPassword = ref(false)

const errorMessage = computed(() => {
    const error = new URLSearchParams(window.location.search).get('error')
    if (error === 'email_not_registered') return 'Email ini belum terdaftar sebagai pemilik lembaga.'
    if (error === 'google_failed') return 'Login Google gagal. Silakan coba lagi.'
    return null
})

function submit() {
    form.post(route('owner.login'), {
        onFinish: () => form.reset('password'),
    })
}

onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>

    <Head title="Lumiverse Sign In" />

    <div class="min-h-screen flex items-center justify-center p-6 bg-slate-950 max-sm:p-0">
        <div
            class="w-full max-w-[460px] bg-slate-900 border border-slate-800 rounded-[20px] p-10 max-sm:rounded-none max-sm:p-6 max-sm:min-h-screen max-sm:flex max-sm:flex-col max-sm:justify-center">
            <!-- <div class="flex items-center gap-2.5 font-extrabold text-[0.95rem] mb-8">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-slate-950 font-black">K</div>
                <span>KREATICRAFT <span class="text-cyan">INDONESIA</span></span>
            </div> -->

            <h1 class="text-2xl font-extrabold text-white">Welcome Back 👋</h1>
            <p class="text-sm text-slate-400 mb-6">Please sign in your account to continue.</p>

            <!-- Alert Error -->
            <div v-if="errorMessage"
                class="mb-4 p-3 rounded-lg bg-rose-400/10 border border-rose-400/30 text-xs text-rose-400">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="submit" class="flex flex-col gap-5">
                <div>
                    <label for="email" class="block text-[13px] font-semibold mb-2 text-slate-400">
                        Email Address
                    </label>
                    <input id="email" type="email" v-model="form.email" autofocus autocomplete="username"
                        class="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm focus:outline-none focus:border-cyan-400" />
                    <div v-if="form.errors.email" class="mt-1.5 text-xs text-rose-400">{{ form.errors.email }}</div>
                </div>

                <div>
                    <label for="password" class="block text-[13px] font-semibold mb-2 text-slate-400">
                        Password
                    </label>
                    <div class="relative">
                        <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
                            autocomplete="current-password"
                            class="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm focus:outline-none focus:border-cyan-400" />
                        <button type="button"
                            class="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-0 text-slate-400 cursor-pointer flex items-center leading-none transition-colors hover:text-white"
                            @click="showPassword = !showPassword">
                            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        </button>
                    </div>
                    <div v-if="form.errors.password" class="mt-1.5 text-xs text-rose-400">{{ form.errors.password }}
                    </div>
                </div>

                <label class="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                    <input type="checkbox" v-model="form.remember" />
                    Remember Me
                </label>

                <button type="submit" class="btn-hero w-full justify-center mt-2 flex items-center gap-2"
                    :class="{ 'opacity-60 cursor-not-allowed': form.processing }" :disabled="form.processing">
                    <svg v-if="form.processing" class="animate-spin" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>{{ form.processing ? 'Signing in...' : 'Sign In' }}</span>
                </button>
            </form>

            <p class="mt-7 text-center text-sm text-slate-400">
                Don't have an account?
                <Link href="/registration" class="text-cyan">Register here.</Link>
            </p>

            <div
                class="flex items-center gap-3 text-xs text-slate-400 my-2 before:content-[''] before:flex-1 before:h-px before:bg-slate-800 after:content-[''] after:flex-1 after:h-px after:bg-slate-800">
                OR
            </div>

            <a :href="route('google.redirect.central')"
                class="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-800 bg-white/[0.03] text-white text-sm font-medium no-underline transition-colors hover:border-[#4285F4] hover:bg-[#4285F4]/[0.08]">
                <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="" width="18" height="18" />
                <span>Continue with Google</span>
            </a>

            <!-- <div class="flex justify-center gap-0.5 mt-6 -mb-6">
                <img src="/images/logo.png" alt="Lumiverse School" class="h-4 object-cover scale-150 sm:flex hidden" />
                <p class="font-semibold text-xs text-slate-400 sm:flex hidden justify-center">
                    Lumi Platforms, Inc.
                </p>
            </div> -->

        </div>
    </div>
</template>