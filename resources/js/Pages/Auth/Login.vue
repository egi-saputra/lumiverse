<script setup>
import { ref, computed, onMounted } from 'vue'
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import AlertError from '@/Components/Modals/AlertError.vue'

// ─── Props ────────────────────────────────────────────────────────────────────

const props = defineProps({
    canResetPassword: Boolean,
    status: String,
})

const page = usePage()

// ─── Product type ───────────────────────────────────────────────────────────
const isWorkspace = computed(() => page.props.tenant?.product_type === 'workspace')

// ─── Label & teks kondisional per product_type ─────────────────────────────────
const eyebrowText = computed(() => isWorkspace.value ? 'Workspace Management System' : 'Learning Management System')

const taglineLine1 = computed(() => isWorkspace.value
    ? 'Lumiverse smart workspace management system app'
    : 'Lumiverse smart learning management system app')

const taglineLine2 = computed(() => isWorkspace.value
    ? 'Satu aplikasi untuk semua kebutuhan kerja tim dan sistem digitalisasi perusahaan'
    : 'Satu aplikasi untuk semua kebutuhan belajar mengajar dan sistem digitalisasi sekolah')

const lumiverseDirectoryLabel = computed(() => isWorkspace.value
    ? 'Lumi Workspace - Smart Workspace System App'
    : 'Lumiverse School - Smart Learning System App')

// Daftar Direktori — item "Mading Digital" hanya relevan untuk tenant school
const directoryItems = computed(() => {
    const items = [
        {
            href: page.props.tenant?.institution_website || '#',
            external: true,
            label: `Website Resmi ${page.props.tenant?.name ?? ''}`,
        },
    ]

    // if (!isWorkspace.value) {
    //     items.push({
    //         routeName: 'mading.index',
    //         external: false,
    //         label: `Mading Digital ${page.props.tenant?.name ?? ''}`,
    //     })
    // }

    items.push({
        href: 'https://www.lumiverse.co.id',
        external: true,
        label: lumiverseDirectoryLabel.value,
    })

    return items
})

// ─── Form ─────────────────────────────────────────────────────────────────────

const form = useForm({
    email: '',
    password: '',
    remember: false,
})

// ─── UI State ─────────────────────────────────────────────────────────────────

const alertError = ref(null)
const showPassword = ref(false)

const errorMessage = computed(() => {
    const error = new URLSearchParams(window.location.search).get('error')
    if (error === 'email_not_registered') return 'Akun tidak ditemukan / belum terdaftar.'
    if (error === 'google_failed') return 'Login Google gagal. Silakan coba lagi.'
    return null
})

// ─── Auth ─────────────────────────────────────────────────────────────────────

function submitLogin() {
    form.post(route('login'), {
        preserveScroll: true,
        onError: (errors) => {
            const message = errors.email ?? 'These credentials do not match our records.'
            alertError.value?.open(message)
        },
    })
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
    if (window.innerWidth < 768) {
        form.remember = true
    }
})
</script>

<template>

    <Head title="Login" />

    <div class="flex flex-col h-screen md:flex-row">

        <AlertError ref="alertError" title="Login Failed" />

        <!-- ── Left Panel (Desktop only) ───────────────────────────────────── -->
        <aside
            class="relative hidden md:flex md:w-1/2 flex-col justify-between overflow-hidden bg-[#1A1B3A] p-10 lg:p-14 text-[#FAF9F5]">

            <div class="pattern-overlay absolute inset-0" aria-hidden="true"></div>
            <div class="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#C9A227]/10 blur-3xl" aria-hidden="true">
            </div>

            <div class="relative z-10">
                <img :src="page.props.tenant?.logo ?? '/images/default.png'" :alt="page.props.tenant?.name"
                    class="h-20 w-auto mb-4 ml-2 rounded-md" />

                <p class="eyebrow text-[#C9A227]">{{ eyebrowText }}</p>
                <h1 class="font-display mt-3 text-3xl leading-[1.1] uppercase">
                    {{ page.props.tenant?.name }}
                </h1>

                <div class="my-5 h-px w-24 bg-[#C9A227]/70"></div>
                <p class="max-w-xl text-sm leading-relaxed text-[#FAF9F5]/70 ">
                    {{ taglineLine1 }}
                </p>
                <p class="max-w-xl text-sm leading-relaxed text-[#FAF9F5]/70">
                    {{ taglineLine2 }}
                </p>
            </div>

            <nav class="relative z-10 mt-14" aria-label="Tautan cepat">
                <p class="eyebrow mb-4 text-[#FAF9F5]/40">Direktori</p>
                <ul class="divide-y divide-white/10 border-t border-white/10">
                    <li v-for="(item, i) in directoryItems" :key="item.label">
                        <a v-if="item.external" :href="item.href" target="_blank" rel="noopener noreferrer"
                            class="directory-row">
                            <span class="directory-index">{{ String(i + 1).padStart(2, '0') }}</span>
                            <span class="flex-1 capitalize">{{ item.label }}</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                                stroke-width="1.5" class="text-[#C9A227]/70" aria-hidden="true">
                                <path d="M6 11L11 6M11 6H7M11 6V10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>

                        <!-- <Link v-else :href="route(item.routeName)" prefetch preserve-scroll preserve-state
                            class="directory-row">
                            <span class="directory-index">{{ String(i + 1).padStart(2, '0') }}</span>
                            <span class="flex-1 capitalize">{{ item.label }}</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                                stroke-width="1.5" class="text-[#C9A227]/70" aria-hidden="true">
                                <path d="M6 11L11 6M11 6H7M11 6V10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </Link> -->
                    </li>
                </ul>
            </nav>

            <p class="relative z-10 mt-10 text-xs text-[#FAF9F5]/40">
                © {{ new Date().getFullYear() }} PT Lumi Platforms Indonesia · All Rights Reserved.
            </p>
        </aside>

        <!-- ── Right Panel ─────────────────────────────────────────────────── -->
        <main
            class="relative flex flex-1 flex-col items-center justify-center overflow-y-auto bg-[#FAF9F5] sm:px-6 px-8 py-10 pb-24 sm:pb-10">
            <div class="w-full max-w-sm">

                <!-- Header -->
                <div class="sm:mb-10 mb-6">
                    <h2 class="font-display text-3xl text-[#1A1B3A]">Welcome Back 👋</h2>
                    <p class="sm:mt-2 mt-1 text-sm text-[#C9A227]">Please sign in your account to continue.</p>
                </div>

                <!-- ── Login Form ────────────────────────────────────────── -->
                <form @submit.prevent="submitLogin" novalidate class="space-y-5">

                    <!-- Email -->
                    <div class="field">
                        <input id="email" type="email" name="email" v-model="form.email" autocomplete="email"
                            :disabled="form.processing" placeholder=" " required class="field-input" />
                        <label for="email" class="field-label pointer-events-none">Email Address</label>
                    </div>

                    <!-- Password -->
                    <div class="field">
                        <div class="relative">
                            <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
                                autocomplete="current-password" :disabled="form.processing" placeholder=" " required
                                class="field-input pr-10" />
                            <label for="password" class="field-label pointer-events-none">Password</label>

                            <button type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                class="password-toggle" @click="showPassword = !showPassword">
                                <!-- Eye open (visible) -->
                                <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <!-- Eye slash (hidden) -->
                                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <path
                                        d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 4.22-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Remember / Forgot -->
                    <div class="flex items-center justify-between pt-1">
                        <label class="flex items-center gap-2 cursor-pointer select-none text-sm text-[#6B7086]">
                            <input type="checkbox" v-model="form.remember" class="remember-checkbox" />
                            Remember Me
                        </label>

                        <Link :href="route('password.request')" prefetch preserve-scroll class="text-link">
                            Forgot Password?
                        </Link>
                    </div>

                    <!-- Submit -->
                    <button type="submit" :disabled="form.processing" class="btn-primary">
                        <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                            aria-hidden="true">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span>{{ form.processing ? 'Signing in…' : 'Sign In' }}</span>
                    </button>

                    <p class="text-center text-sm text-[#6B7086]">
                        Don't have an account?
                        <Link :href="route('register')" prefetch preserve-state preserve-scroll class="text-link">
                            Register here.
                        </Link>
                    </p>

                    <div class="divider-stars"><span>OR</span></div>

                    <!-- Error Google -->
                    <div v-if="errorMessage"
                        class="mb-6 rounded-lg text-center border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {{ errorMessage }}
                    </div>

                    <a :href="`/auth/google?from_tenant=${page.props.tenant?.id}`" class="btn-outline">
                        <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="" width="18"
                            height="18" />
                        <span>Continue with Google</span>
                    </a>
                </form>

                <!-- <div
                    class="sm:hidden fixed bottom-0 left-0 right-0 flex justify-center py-3 bg-[#FAF9F5]/95 backdrop-blur-sm border-t border-black/5">
                    <a href="https://lumiverse.co.id" class="flex items-center justify-center">
                        <img src="/images/logo-dark.webp" alt="Lumiverse School"
                            class="h-7 w-auto object-contain mt-1 grayscale" />
                        <span class="text-sm font-semibold text-[#6B7086] leading-none">
                            Lumiverse School
                        </span>
                    </a>
                </div> -->
            </div>
        </main>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

* {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

.font-display {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    letter-spacing: -0.01em;
}

.eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: capitalize;
}

.pattern-overlay {
    opacity: 0.06;
    background-repeat: repeat;
    background-size: 80px 80px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23F4E9C8' stroke-width='1'%3E%3Cpath d='M40 6 L74 40 L40 74 L6 40 Z'/%3E%3Cpath d='M18 18 H62 V62 H18 Z'/%3E%3C/g%3E%3C/svg%3E");
}

.directory-row {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.9rem 0.25rem;
    font-size: 0.875rem;
    color: rgba(250, 249, 245, 0.85);
    text-decoration: none;
    transition: color 0.2s ease, padding-left 0.2s ease;
}

.directory-row:hover {
    color: #fff;
    padding-left: 0.5rem;
}

.directory-index {
    font-family: 'Fraunces', serif;
    font-size: 0.75rem;
    width: 1.5rem;
    color: #C9A227;
}

.divider-stars {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #9C9FB3;
}

.divider-stars::before,
.divider-stars::after {
    content: '';
    flex: 1;
    height: 6px;
    background-repeat: repeat-x;
    background-position: center;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='6' viewBox='0 0 16 6'%3E%3Cpath d='M8 0 L11 3 L8 6 L5 3 Z' fill='%23E2E0DA'/%3E%3C/svg%3E");
}

/* ── Form fields ── */
.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    position: relative;
}

.field-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6B7086;
    position: absolute;
    left: 0.5rem;
    top: 0.65rem;
    background: #FAF9F5;
    padding: 0 0.25rem;
    transition: all 0.2s ease;
}

.field-input {
    width: 100%;
    padding: 0.65rem 0.5rem;
    border: none;
    border-bottom: 1.5px solid #E2E0DA;
    border-radius: 2px;
    background: transparent;
    font-size: 0.95rem;
    color: #1A1B3A;
    transition: border-color 0.2s ease;

    outline: none;
    box-shadow: none;
    -webkit-appearance: none;
}

.field-input::placeholder {
    color: transparent;
}

.field-input:disabled {
    opacity: 0.6;
}

.field-input:focus {
    outline: none;
    box-shadow: none;
    border-bottom-color: #C9A227;
}

/* Label naik ke atas saat input diisi ATAU sedang fokus — bekerja juga untuk autofill */
.field-input:not(:placeholder-shown)~.field-label,
.field-input:focus~.field-label {
    top: -0.6rem;
    font-size: 0.6rem;
    color: #C9A227;
}

.password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9C9FB3;
    transition: color 0.2s ease;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.password-toggle:focus {
    outline: none;
}

.password-toggle:hover {
    color: #1A1B3A;
}

/* Matikan icon reveal-password bawaan browser agar tidak bertabrakan dgn icon custom */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
    display: none;
}

input::-webkit-credentials-auto-fill-button {
    visibility: hidden;
    pointer-events: none;
    position: absolute;
    right: 0;
}

.remember-checkbox {
    accent-color: #C9A227;
    width: 1rem;
    height: 1rem;
}

.text-link {
    font-size: 0.85rem;
    font-weight: 600;
    color: #A6841B;
    text-decoration: none;
}

.text-link:hover {
    text-decoration: underline;
}

/* ── Buttons ── */
.btn-primary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8rem 1rem;
    border-radius: 0.6rem;
    background: #1A1B3A;
    color: #FAF9F5;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease;
}

.btn-primary:hover:not(:disabled) {
    background: #2E2A6E;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-outline {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.7rem 1rem;
    border: 1.5px solid #acaba9;
    border-radius: 0.6rem;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: #FAF9F5;
    color: #1A1B3A;
    text-decoration: none;
    transition: border-color 0.2s ease, background 0.2s ease;
}

.btn-outline:hover {
    border-color: #C9A227;
    background: #FAF7EE;
}
</style>