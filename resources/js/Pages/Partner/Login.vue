<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from 'vue'
import { Head, Link, router, useForm } from '@inertiajs/vue3'
import axios from 'axios'
import AlertError from '@/Components/Modals/AlertError.vue'
import { useTheme } from '@/Composables/useTheme'

defineProps({
    canResetPassword: Boolean,
    status: String,
})

const form = useForm({
    email: '',
    password: '',
    remember: false,
})

const alertError = ref(null)
const showPassword = ref(false)

// step 'email'    -> hanya minta alamat email dulu (layar 1)
// step 'code'     -> kode verifikasi baru saja dikirim ke email (layar 2),
//                    user bisa lanjut dengan kode ATAU pindah ke password
// step 'password' -> tampilkan email (bisa di-Edit) + form password (layar 3),
//                    user juga bisa balik ke step 'code'
const step = ref('email')
const emailInput = ref(null)
const codeInput = ref(null)
const passwordInput = ref(null)

// Spinner-spinner terpisah per aksi, supaya tombol yang lagi diklik yang
// nunjukkin loading — bukan seluruh form.
const sendingCode = ref(false)
const verifyingCode = ref(false)
const resendingCode = ref(false)

const verificationCode = ref('')
const codeError = ref('')

// Diisi dari respons /login/send-code — true kalau email BELUM terdaftar.
// Dipakai buat ganti label tombol "Lanjutkan" -> "Buat Akun" di step
// 'code' & 'password', dan bikin field password di step itu jadi opsional
// (nullable), supaya satu halaman ini bisa berfungsi untuk login maupun
// bikin akun baru sekaligus.
const isNewAccount = ref(false)
const ctaLabel = computed(() => (isNewAccount.value ? 'Buat Akun' : 'Lanjutkan'))

const googleLoginUrl = `${window.location.protocol}//${window.location.hostname.endsWith('.localhost') ? 'localhost' : 'lumiverse.co.id'}${window.location.port ? `:${window.location.port}` : ''}/auth/google?from_partner=1`

// Halaman login partner ini selalu tampil light mode, apapun preferensi
// tema yang aktif di halaman lain. initTheme() tetap dipanggil supaya
// state tema global (isDark) akurat mengikuti localStorage/preferensi
// sistem — cuma tampilan <html> di halaman ini yang dipaksa dilepas
// dari class 'dark', lalu dikembalikan saat user pindah ke halaman lain.
const { isDark, initTheme } = useTheme()

onMounted(() => {
    initTheme()
    document.documentElement.classList.remove('dark')
})

onUnmounted(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Step 1 → 2: kirim kode verifikasi ke email ──────────────────────────
// Backend sekalian ngecek apakah email ini sudah terdaftar (is_new),
// supaya step berikutnya tahu harus tampil sebagai "login" atau "daftar".
async function sendVerificationCode() {
    form.clearErrors()

    if (!form.email.trim()) {
        form.setError('email', 'Email wajib diisi.')
        return
    }
    if (!emailPattern.test(form.email.trim())) {
        form.setError('email', 'Format email tidak valid.')
        return
    }

    sendingCode.value = true

    try {
        const { data } = await axios.post('/api/partner/auth/login/send-code', { email: form.email })
        isNewAccount.value = !!data?.is_new
        codeError.value = ''
        verificationCode.value = ''
        step.value = 'code'
        nextTick(() => codeInput.value?.focus())
    } catch (error) {
        const errors = error.response?.data?.errors
        if (errors) form.setError(errors)
        alertError.value?.open(error.response?.data?.message || 'Gagal mengirim kode verifikasi. Coba lagi.')
    } finally {
        sendingCode.value = false
    }
}

async function resendCode() {
    resendingCode.value = true

    try {
        const { data } = await axios.post('/api/partner/auth/login/send-code', { email: form.email })
        isNewAccount.value = !!data?.is_new
    } catch (error) {
        alertError.value?.open(error.response?.data?.message || 'Gagal mengirim ulang kode.')
    } finally {
        resendingCode.value = false
    }
}

// ── Step 2: verifikasi kode ─────────────────────────────────────────────
// Akun lama -> langsung login (passwordless), redirect ke dashboard.
// Akun baru -> kode benar cuma menandakan email terverifikasi; JANGAN
// langsung ke dashboard, lanjut ke step "password" dulu supaya user bikin
// kata sandi sebelum akunnya benar-benar dibuat.
async function verifyCode() {
    codeError.value = ''
    form.clearErrors()

    if (!verificationCode.value.trim()) {
        codeError.value = 'Kode verifikasi wajib diisi.'
        return
    }

    verifyingCode.value = true

    try {
        await axios.post('/api/partner/auth/login/verify-code', {
            email: form.email,
            code: verificationCode.value.trim(),
        })

        if (isNewAccount.value) {
            step.value = 'password'
            nextTick(() => passwordInput.value?.focus())
        } else {
            router.visit(route('partner.dashboard'))
        }
    } catch (error) {
        codeError.value = error.response?.data?.errors?.code?.[0]
            || error.response?.data?.message
            || 'Kode verifikasi salah atau sudah kedaluwarsa.'
    } finally {
        verifyingCode.value = false
    }
}

function editEmail() {
    step.value = 'email'
    form.clearErrors()
    form.password = ''
    verificationCode.value = ''
    codeError.value = ''
    nextTick(() => emailInput.value?.focus())
}

function switchToPassword() {
    step.value = 'password'
    form.clearErrors()
    nextTick(() => passwordInput.value?.focus())
}

function switchToCode() {
    step.value = 'code'
    form.clearErrors()
    nextTick(() => codeInput.value?.focus())
}

// ── Step 3: password ────────────────────────────────────────────────────
// Akun lama -> login biasa (email + password) lewat /login.
// Akun baru -> kode sudah diverifikasi di step sebelumnya, di sini tinggal
// kirim email + password baru untuk menyelesaikan pembuatan akun (tidak
// perlu kirim kode lagi).
async function submitLogin() {
    form.processing = true
    form.clearErrors()

    try {
        if (isNewAccount.value) {
            await axios.post('/api/partner/auth/register/complete', {
                email: form.email,
                password: form.password,
                remember: form.remember,
            })
        } else {
            await axios.post('/api/partner/auth/login', form.data())
        }

        router.visit(route('partner.dashboard'))
    } catch (error) {
        const errors = error.response?.data?.errors
        if (errors) form.setError(errors)
        alertError.value?.open(
            error.response?.data?.message
            || errors?.email?.[0]
            || errors?.code?.[0]
            || errors?.password?.[0]
            || 'Login gagal.'
        )
    } finally {
        form.processing = false
        form.reset('password')
    }
}
</script>

<template>

    <Head title="Login Partner" />

    <div class="auth-shell">
        <AlertError ref="alertError" title="Login Failed" />

        <div class="auth-topbar">
            <Link :href="route('home.partner')" class="brand-mark font-poppins">
                <img src="/images/logo.webp" alt="Lumiverse" class="brand-logo" />
                <span class="brand-label">Lumiverse</span>
            </Link>
        </div>

        <main class="auth-main">
            <div class="auth-card">

                <!-- ── Step 1: Email ────────────────────────────────────── -->
                <template v-if="step === 'email'">
                    <h1 class="auth-title">Welcome Back 👋</h1>
                    <p class="auth-desc">Masuk ke akun program partner kamu.</p>

                    <a :href="googleLoginUrl" class="google-button">
                        <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="" width="18"
                            height="18" />
                        Lanjutkan dengan Google
                    </a>

                    <div class="auth-divider"><span>ATAU</span></div>

                    <form @submit.prevent="sendVerificationCode" class="auth-form" novalidate>
                        <div class="field">
                            <input id="email" ref="emailInput" type="email" name="email" v-model="form.email"
                                autocomplete="email" :disabled="sendingCode" placeholder=" " required
                                class="field-input" />
                            <label for="email" class="field-label pointer-events-none">Alamat Email</label>
                        </div>

                        <p v-if="form.errors.email" class="field-error">{{ form.errors.email }}</p>

                        <button type="submit" :disabled="sendingCode" class="btn-premier">
                            <svg v-if="sendingCode" class="spinner" viewBox="0 0 24 24" aria-hidden="true">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                                    fill="none" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <span v-else>Lanjutkan</span>
                        </button>
                    </form>
                </template>

                <!-- ── Step 2: Masukkan kode verifikasi ────────────────────── -->
                <template v-else-if="step === 'code'">
                    <h1 class="auth-title">Cek kotak masuk Anda</h1>
                    <p class="auth-desc">
                        Masukkan kode verifikasi yang baru saja kami kirim ke
                        <strong>{{ form.email }}</strong>
                    </p>

                    <form @submit.prevent="verifyCode" class="auth-form" novalidate>
                        <div class="field">
                            <input id="code" ref="codeInput" type="text" inputmode="numeric"
                                autocomplete="one-time-code" v-model="verificationCode" :disabled="verifyingCode"
                                placeholder=" " required class="field-input" />
                            <label for="code" class="field-label pointer-events-none">Kode</label>
                        </div>

                        <p v-if="codeError" class="field-error">{{ codeError }}</p>

                        <button type="submit" :disabled="verifyingCode" class="btn-premier">
                            <svg v-if="verifyingCode" class="spinner" viewBox="0 0 24 24" aria-hidden="true">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                                    fill="none" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <span v-else>{{ ctaLabel }}</span>
                        </button>
                    </form>

                    <button type="button" class="text-link resend-link" :disabled="resendingCode" @click="resendCode">
                        {{ resendingCode ? 'Mengirim ulang…' : 'Kirim ulang email' }}
                    </button>

                    <!-- Skip kode -> masuk pakai kata sandi. Cuma boleh untuk akun yang
         SUDAH terdaftar; untuk akun baru wajib verifikasi email dulu. -->
                    <template v-if="!isNewAccount">
                        <div class="auth-divider"><span>ATAU</span></div>

                        <button type="button" class="btn-second" @click="switchToPassword">
                            Lanjutkan dengan kata sandi
                        </button>
                    </template>
                </template>

                <!-- ── Step 3: Password ────────────────────────────────────── -->
                <template v-else>
                    <h1 class="auth-title">
                        {{ isNewAccount ? 'Buat Kata Sandi' : 'Masukkan kata sandi Anda' }}
                    </h1>

                    <form @submit.prevent="submitLogin" class="auth-form" novalidate>
                        <div class="field">
                            <div class="field-input-display field-display">
                                <span class="field-display-value">{{ form.email }}</span>
                                <button type="button" class="field-display-edit" @click="editEmail">Edit</button>
                            </div>
                            <label class="field-label field-label-filled">Alamat Email</label>
                        </div>

                        <div class="field">
                            <input id="password" ref="passwordInput" :type="showPassword ? 'text' : 'password'"
                                v-model="form.password" autocomplete="current-password" :disabled="form.processing"
                                placeholder=" " required class="field-input pr-10" />
                            <label for="password" class="field-label pointer-events-none">
                                {{ isNewAccount ? 'Kata Sandi' : 'Kata Sandi' }}
                            </label>

                            <button type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                class="password-toggle" @click="showPassword = !showPassword">
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

                        <p v-if="form.errors.password" class="field-error">{{ form.errors.password }}</p>
                        <p v-if="form.errors.code" class="field-error">{{ form.errors.code }}</p>

                        <div class="row-between">
                            <label class="remember-label">
                                <input type="checkbox" v-model="form.remember" class="remember-checkbox" />
                                Ingat saya
                            </label>
                            <Link v-if="!isNewAccount" :href="route('partner.forgot-password')" prefetch
                                class="text-link">
                                Lupa kata sandi?
                            </Link>
                        </div>

                        <button type="submit" :disabled="form.processing" class="btn-premier">
                            <svg v-if="form.processing" class="spinner" viewBox="0 0 24 24" aria-hidden="true">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                                    fill="none" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <span v-else>{{ ctaLabel }}</span>
                        </button>
                    </form>

                    <div class="auth-divider"><span>ATAU</span></div>

                    <button type="button" class="btn-second" @click="switchToCode">
                        {{ isNewAccount ? 'Kembali ke kode verifikasi' : 'Masuk dengan kode sekali pakai' }}
                    </button>
                </template>
            </div>
        </main>

        <footer class="auth-footer">
            <Link :href="route('partner.login')">Syarat & Ketentuan</Link>
            <span class="dot">|</span>
            <Link :href="route('partner.register')">Kebijakan Privasi</Link>
        </footer>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.auth-shell * {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

.auth-shell *,
.auth-shell *::before,
.auth-shell *::after {
    box-sizing: border-box;
}

.auth-shell {
    --auth-text: #0b1120;
    --auth-muted: #64748b;
    --auth-hover: #1163fa;
    --auth-border: #e2e8f0;
    --auth-gold: #f5a623;

    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    color: var(--auth-text);
}

/* ── Topbar ─────────────────────────────────────────────────── */
.auth-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    padding: 1.25rem 1.25rem;
    background: #ffffff;
}

.brand-mark {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 800;
    font-size: 1.1rem;
    text-decoration: none;
    color: var(--auth-text);
}

.brand-logo {
    height: 46px;
    width: auto;
    object-fit: contain;
}

.brand-label {
    font-family: 'Fraunces', serif;
    gap: 0.4rem;
    margin-left: -14px;
    margin-top: -4px;
    font-size: 1.25rem;
}

/* ── Card ───────────────────────────────────────────────────── */
.auth-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 1.5rem 4rem;
    z-index: 20;
}

.auth-card {
    width: 100%;
    max-width: 480px;
    text-align: center;
}

.auth-title {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 1.9rem;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
}

.auth-desc {
    font-size: 0.92rem;
    line-height: 1.65;
    color: var(--auth-muted);
    margin-bottom: 2rem;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    text-align: left;
}

/* ── Form fields ────────────────────────────────────────────── */
/* Mobile-first: center via auto margin, full width sampai max-width.
   Geseran ke kanan ala desktop (margin-left fixed) HANYA di media
   query bawah, supaya di layar sempit fieldnya tidak kedorong keluar. */
.field {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    position: relative;
}

.field-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--auth-muted);
    position: absolute;
    left: 1.35rem;
    top: 0.85rem;
    background: #ffffff;
    padding: 0 0.25rem;
    transition: all 0.2s ease;
}

.field-input {
    width: 100%;
    max-width: 360px;
    padding: 0.7rem 0.5rem;
    padding-left: 1.5rem;
    border: 1px solid var(--auth-border);
    border-radius: 50px;
    background: transparent;
    font-size: 0.95rem;
    color: var(--auth-text);
    transition: border-color 0.2s ease;
    outline: none;
    box-shadow: none;
    -webkit-appearance: none;
}

.field-input-display {
    width: 100%;
    max-width: 360px;
    padding: 0.7rem 0.5rem;
    padding-left: 1.5rem;
    border: 1px solid var(--auth-border);
    border-radius: 50px;
    background: transparent;
    font-size: 0.95rem;
    color: var(--auth-text);
    transition: border-color 0.2s ease;
    outline: none;
    box-shadow: none;
    -webkit-appearance: none;
}

.field-input:focus,
.field-input:not(:placeholder-shown) {
    border: 1px solid var(--auth-hover);
    transition: border-color 0.2s ease;
}

.field-input-display:focus {
    border: 1px solid var(--auth-text);
    transition: border-color 0.2s ease;
}

.field-input.pr-10 {
    padding-right: 2.75rem;
}

.field-input::placeholder {
    color: transparent;
}

.field-input:disabled {
    opacity: 0.6;
}

.field-input:not(:placeholder-shown)~.field-label,
.field-input:focus~.field-label {
    left: 1.35rem;
    top: -0.7rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--auth-hover);
}

.field-error {
    font-size: 0.78rem;
    color: #e11d48;
    text-align: left;
    margin-top: -0.85rem;
}

/* ── Step "password": email ditampilkan statis, style-nya disamakan
   persis dengan .field-input (pill) supaya nggak beda bentuk dengan
   kolom password di bawahnya. Tombol "Edit" nempel di kanan supaya
   user tetap bisa balik ganti email tanpa mengubah bentuk pill. */
.field-display {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    min-height: 1.35rem;
    color: var(--auth-muted);
    cursor: default;
}

.field-display-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.field-display-edit {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0;
    margin-right: 0.5rem;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--auth-hover);
    cursor: pointer;
}

.field-display-edit:hover {
    text-decoration: underline;
}

.field-label-filled {
    left: 1.35rem;
    top: -0.7rem;
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--auth-muted);
}

.password-toggle {
    position: absolute;
    right: 1.1rem;
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

.password-toggle:focus {
    outline: none;
}

.password-toggle:hover {
    color: var(--auth-text);
}

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

/* ── Remember + lupa password ──────────────────────────────── */
.row-between {
    width: 100%;
    max-width: 340px;
    margin: -0.5rem auto 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.remember-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    color: var(--auth-muted);
    cursor: pointer;
    user-select: none;
}

.remember-checkbox {
    accent-color: var(--auth-gold);
    width: 1rem;
    height: 1rem;
}

/* ── Buttons ────────────────────────────────────────────────── */
.btn-premier {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1rem;
    border-radius: 100px;
    background: var(--auth-text);
    color: #f8f9ff;
    font-weight: 600;
    font-size: 0.92rem;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.15s ease;
}

.btn-premier:hover:not(:disabled) {
    opacity: 0.80;
}

.btn-premier:disabled {
    cursor: not-allowed;
}

.spinner {
    height: 1rem;
    width: 1rem;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Tombol alternatif berbayang-bayang, dipakai untuk "Lanjutkan dengan
   kata sandi" (step kode) dan "Masuk dengan kode sekali pakai" (step
   password) — sama seperti btn-secondary di ForgotPassword.vue. */
.btn-second {
    width: 100%;
    max-width: 370px;
    margin: 0 auto;
    padding: 0.8rem 1rem;
    border-radius: 100px;
    background: transparent;
    color: var(--auth-text);
    font-weight: 600;
    font-size: 0.88rem;
    border: 1px solid var(--auth-border);
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
}

.btn-second:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
}

.google-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 44px;
    padding: 0.85rem 1rem;
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 600;
    width: 100%;
    max-width: 360px;
    border: 1px solid var(--auth-border);
    color: #334155;
    text-decoration: none;
    transition: background 0.15s ease, border-color 0.15s ease;
}

.google-button:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
}

.auth-divider {
    max-width: 360px;
    margin: 1.25rem auto;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #94a3b8;
    font-size: 0.68rem;
    font-weight: 700;
}

.auth-divider::before,
.auth-divider::after {
    height: 1px;
    flex: 1;
    content: '';
    background: var(--auth-border);
}

/* ── Links / footer text ───────────────────────────────────── */
.bottom-text {
    margin-top: 1.75rem;
    font-size: 0.85rem;
    color: var(--auth-muted);
}

.text-link {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--auth-text);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
}

.text-link:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    text-decoration: none;
}

.resend-link {
    display: block;
    margin: 1.5rem auto 0;
}

.back-link {
    display: block;
    margin: 1.5rem auto 0;
    background: none;
    border: none;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--auth-text);
    cursor: pointer;
}

.back-link:hover {
    text-decoration: underline;
}

.auth-footer {
    padding: 1.5rem;
    text-align: center;
    font-size: 0.78rem;
    color: #94a3b8;
}

.auth-footer a {
    color: #94a3b8;
    text-decoration: none;
}

.auth-footer a:hover {
    text-decoration: underline;
}

.auth-footer .dot {
    margin: 0 0.5rem;
}

/* ── Desktop-only geseran ke kanan ─────────────────────────────
   Layout desktop yang sudah rapi sengaja digeser sedikit ke kanan
   (margin-left) supaya nggak dead-center. Ini HANYA berlaku di atas
   640px; di bawahnya (mobile) semua elemen full-width & center via
   margin: 0 auto seperti di rule dasar di atas. */
@media (min-width: 640px) {
    /* .auth-topbar {
        display: none;
    } */

    .field {
        margin-left: 4rem;
        margin-right: 0;
    }

    .btn-premier {
        margin-left: 4rem;
        margin-right: 0;
    }

    .btn-second {
        margin-left: 0.75rem;
        margin-right: 0;
    }

    .auth-divider {
        margin-left: 4rem;
        margin-right: 0;
    }

    .row-between {
        margin-left: 4.5rem;
        margin-right: 0;
    }
}

/* ── Mobile: logo center, nempel tepat di atas judul step ──────
   Di layar sempit, topbar dilepas dari fixed positioning supaya
   dia jadi bagian alur normal (bukan melayang terpisah), lalu
   di-center secara horizontal persis di atas <h1> tiap step. */
/* @media (max-width: 639px) {
    .auth-topbar {
        position: static;
        display: flex;
        justify-content: center;
        padding: 1.5rem 1.25rem 0;
    }

    .auth-main {
        align-items: flex-start;
        padding-top: 3rem;
    }
} */
</style>