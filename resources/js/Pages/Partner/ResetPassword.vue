<script setup>
import { Head, useForm } from '@inertiajs/vue3'
import axios from 'axios'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/Composables/useTheme'

const props = defineProps({
    token: String,
    email: String,
})

const form = useForm({
    token: props.token || '',
    email: props.email || '',
    password: '',
    password_confirmation: '',
})

const showPassword = ref(false)
const status = ref('idle') // idle | success | error
const serverMessage = ref('')

const { isDark, initTheme } = useTheme()

onMounted(() => {
    initTheme()
    document.documentElement.classList.remove('dark')
})

onUnmounted(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
})

const passwordRules = computed(() => [
    { label: 'Minimal 8 karakter', valid: form.password.length >= 8 },
    { label: 'Huruf besar (A-Z)', valid: /[A-Z]/.test(form.password) },
    { label: 'Huruf kecil (a-z)', valid: /[a-z]/.test(form.password) },
    { label: 'Angka (0-9)', valid: /[0-9]/.test(form.password) },
    { label: 'Simbol (!@#$...)', valid: /[^A-Za-z0-9]/.test(form.password) },
])

const isPasswordValid = computed(() => passwordRules.value.every(r => r.valid))
const passwordsMatch = computed(() =>
    form.password.length > 0 && form.password === form.password_confirmation
)

async function submit() {
    form.processing = true
    form.clearErrors()
    serverMessage.value = ''

    try {
        const { data } = await axios.post('/api/partner/auth/reset-password', form.data())
        status.value = 'success'
        serverMessage.value = data.message || 'Password berhasil diubah.'
    } catch (error) {
        const errors = error.response?.data?.errors
        if (errors) form.setError(errors)
        status.value = 'error'
        serverMessage.value = error.response?.data?.message || 'Gagal mengatur ulang password. Token mungkin sudah kedaluwarsa.'
    } finally {
        form.processing = false
    }
}
</script>

<template>

    <Head title="Reset Password" />

    <div class="auth-shell flex flex-col h-screen md:flex-row">

        <!-- ── Left Panel (Desktop only) ───────────────────────────────────── -->
        <aside class="auth-side relative hidden md:flex md:w-1/2 flex-col justify-between overflow-hidden p-10 lg:p-14">
            <div class="pattern-overlay absolute inset-0" aria-hidden="true"></div>
            <div class="glow-orb absolute -top-32 -right-24 h-96 w-96 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10">
                <div class="brand-mark font-poppins">
                    <img src="/images/logo.webp" alt="Lumiverse" class="brand-logo" />
                    <span class="brand-label">Lumiverse <span class="text-cyan">Partnership</span></span>
                </div>

                <p class="eyebrow">Partner Program</p>
                <h1 class="font-display hero-title">
                    Atur Ulang<br />Password Kamu.
                </h1>

                <div class="divider"></div>
                <p class="hero-sub">
                    Buat password baru untuk akun partner kamu. Setelah berhasil,
                    kamu bisa langsung masuk ke dashboard partner seperti biasa.
                </p>
            </div>

            <p class="relative z-10 mt-10 footer-text">
                © {{ new Date().getFullYear() }} PT Lumi Platforms Indonesia · All Rights Reserved.
            </p>
        </aside>

        <!-- ── Right Panel ─────────────────────────────────────────────────── -->
        <main
            class="auth-main relative flex flex-1 flex-col items-center justify-center overflow-y-auto sm:px-6 px-8 py-10 pb-24 sm:pb-10">
            <div class="w-full max-w-sm">

                <div class="mb-4 flex md:hidden justify-center">
                    <div class="brand-mark-mobile font-poppins">
                        <img src="/images/logo-light.webp" alt="Lumiverse" class="brand-logo" />
                        Lumi <span class="text-cyan">Partnership</span>
                    </div>
                </div>

                <div class="sm:mb-10 mb-6 text-left">
                    <h2 class="font-display welcome-title">Buat Password Baru</h2>
                    <p class="sm:mt-2 mt-1 welcome-sub">
                        {{ form.email ? `Untuk akun ${form.email}` : 'Masukkan password baru kamu di bawah ini.' }}
                    </p>
                </div>

                <!-- Sukses -->
                <div v-if="status === 'success'" class="status-box status-success">
                    <p class="status-title">Password berhasil diubah</p>
                    <p class="status-desc">{{ serverMessage }}</p>
                    <a :href="route('partner.login')" class="btn-primary status-cta">Masuk sekarang</a>
                </div>

                <!-- Token invalid/hilang -->
                <div v-else-if="!form.token || !form.email" class="status-box status-error">
                    <p class="status-title">Link reset password tidak valid</p>
                    <p class="status-desc">
                        Link ini kedaluwarsa atau rusak. Silakan minta link reset password baru lewat halaman login.
                    </p>
                    <a :href="route('partner.login')" class="btn-primary status-cta">Kembali ke Login</a>
                </div>

                <!-- Form -->
                <form v-else @submit.prevent="submit" novalidate class="space-y-5">

                    <div class="field">
                        <div class="relative">
                            <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
                                autocomplete="new-password" :disabled="form.processing" placeholder=" " required
                                class="field-input pr-10" />
                            <label for="password" class="field-label pointer-events-none">Password Baru</label>
                            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                                <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <path
                                        d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 4.22-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            </button>
                        </div>

                        <div v-if="form.password.length > 0" class="pw-rules">
                            <div v-for="rule in passwordRules" :key="rule.label" class="pw-rule"
                                :class="{ 'pw-rule-valid': rule.valid }">
                                <span v-if="rule.valid">✓</span>
                                <span v-else class="pw-rule-dot">○</span>
                                <span>{{ rule.label }}</span>
                            </div>
                        </div>

                        <p v-if="form.errors.password" class="field-error">{{ form.errors.password }}</p>
                    </div>

                    <div class="field">
                        <input id="password_confirmation" type="password" v-model="form.password_confirmation"
                            autocomplete="new-password" :disabled="form.processing" placeholder=" " required
                            class="field-input" />
                        <label for="password_confirmation" class="field-label pointer-events-none">Konfirmasi
                            Password</label>
                        <p v-if="form.password_confirmation.length > 0 && !passwordsMatch" class="field-error">
                            Konfirmasi password tidak cocok.
                        </p>
                        <p v-if="form.errors.password_confirmation" class="field-error">
                            {{ form.errors.password_confirmation }}
                        </p>
                    </div>

                    <p v-if="status === 'error'" class="field-error">{{ serverMessage }}</p>

                    <button type="submit" :disabled="form.processing || !isPasswordValid || !passwordsMatch"
                        class="btn-primary">
                        <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                            aria-hidden="true">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span>{{ form.processing ? 'Menyimpan…' : 'Simpan Password Baru' }}</span>
                    </button>
                </form>
            </div>
        </main>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.auth-shell * {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

.font-display {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    letter-spacing: -0.01em;
}

.auth-shell {
    --auth-bg-dark: #0b1120;
    --auth-bg-dark-2: #111827;
    --auth-text-on-dark: #f8f9ff;
    --auth-border-on-dark: rgba(255, 255, 255, 0.08);

    --auth-bg-light: #ffffff;
    --auth-text-on-light: #0b1120;
    --auth-muted: #64748b;
    --auth-gold: #f5a623;
    --auth-gold-dim: #c98a1a;
    --auth-cyan: #00d4ff;

    background: var(--auth-bg-dark);
}

.auth-side {
    background: linear-gradient(160deg, var(--auth-bg-dark-2) 0%, var(--auth-bg-dark) 100%);
    color: var(--auth-text-on-dark);
    border-right: 1px solid var(--auth-border-on-dark);
}

.glow-orb {
    background: rgba(0, 212, 255, 0.12);
}

.pattern-overlay {
    opacity: 0.05;
    background-repeat: repeat;
    background-size: 80px 80px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%2300D4FF' stroke-width='1'%3E%3Cpath d='M40 6 L74 40 L40 74 L6 40 Z'/%3E%3Cpath d='M18 18 H62 V62 H18 Z'/%3E%3C/g%3E%3C/svg%3E");
}

.brand-mark {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.02em;
    margin-bottom: 2.5rem;
}

.brand-logo {
    height: 40px;
    width: auto;
    object-fit: contain;
    flex-shrink: 0;
}

.brand-label {
    margin-left: -4px;
    gap: 0.5rem;
}

.text-cyan {
    color: var(--auth-cyan);
}

.eyebrow {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--auth-cyan);
}

.hero-title {
    margin-top: 0.85rem;
    font-size: 2rem;
    line-height: 1.15;
    font-weight: 800;
}

.divider {
    margin: 1.25rem 0;
    height: 1px;
    width: 6rem;
    background: rgba(0, 212, 255, 0.4);
}

.hero-sub {
    max-width: 32rem;
    font-size: 0.9rem;
    line-height: 1.65;
    color: rgba(250, 249, 245, 0.65);
}

.footer-text {
    font-size: 0.72rem;
    color: rgba(250, 249, 245, 0.35);
}

.auth-main {
    background: var(--auth-bg-light);
}

.brand-mark-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    font-weight: 700;
    font-size: 1rem;
    color: var(--auth-text-on-light);
}

.welcome-title {
    font-size: 1.6rem;
    color: var(--auth-text-on-light);
}

.welcome-sub {
    font-size: 0.88rem;
    color: var(--auth-muted);
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    position: relative;
}

.field-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--auth-muted);
    position: absolute;
    left: 0.5rem;
    top: 0.65rem;
    background: var(--auth-bg-light);
    padding: 0 0.25rem;
    transition: all 0.2s ease;
}

.field-input {
    width: 100%;
    padding: 0.65rem 0.5rem;
    border: none;
    border-bottom: 1.5px solid var(--auth-muted);
    border-radius: 2px;
    background: transparent;
    font-size: 0.95rem;
    color: var(--auth-text-on-light);
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
    border-bottom-color: var(--auth-gold);
}

.field-input:not(:placeholder-shown)~.field-label,
.field-input:focus~.field-label {
    top: -0.6rem;
    font-size: 0.6rem;
    color: var(--auth-gold);
}

.field-error {
    font-size: 0.75rem;
    color: #e11d48;
    margin-top: 0.15rem;
}

.pw-rules {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.3rem 0.75rem;
    margin-top: 0.6rem;
    padding: 0.65rem 0.85rem;
    background: rgba(14, 165, 196, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 10px;
}

.pw-rule {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    color: var(--auth-muted);
    transition: color 0.25s ease;
}

.pw-rule-valid {
    color: #16a34a;
}

.pw-rule-dot {
    font-size: 0.7rem;
    width: 14px;
    text-align: center;
}

.password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--auth-muted);
    transition: color 0.2s ease;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.password-toggle:hover {
    color: var(--auth-text-on-light);
}

.btn-primary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8rem 1rem;
    border-radius: 0.6rem;
    background: var(--auth-bg-dark);
    color: var(--auth-text-on-dark);
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.15s ease;
    text-decoration: none;
}

.btn-primary:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.status-box {
    padding: 1.25rem;
    border-radius: 12px;
    border: 1px solid var(--auth-border-on-light, #e2e8f0);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.status-success {
    background: rgba(22, 163, 74, 0.06);
    border-color: rgba(22, 163, 74, 0.25);
}

.status-error {
    background: rgba(225, 29, 72, 0.05);
    border-color: rgba(225, 29, 72, 0.2);
}

.status-title {
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--auth-text-on-light);
}

.status-desc {
    font-size: 0.82rem;
    color: var(--auth-muted);
    line-height: 1.6;
}

.status-cta {
    margin-top: 0.5rem;
    text-align: center;
}
</style>