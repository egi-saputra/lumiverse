<script setup>
import { Head, Link } from '@inertiajs/vue3'
import axios from 'axios'
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/Composables/useTheme'

const email = ref('')
const processing = ref(false)
const errorMessage = ref('')
const sent = ref(false)

const { isDark, initTheme } = useTheme()

onMounted(() => {
    initTheme()
    document.documentElement.classList.remove('dark')
})

onUnmounted(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
})

async function submit() {
    processing.value = true
    errorMessage.value = ''

    try {
        await axios.post('/api/partner/auth/forgot-password', { email: email.value })
        sent.value = true
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Permintaan reset password gagal. Coba lagi.'
    } finally {
        processing.value = false
    }
}
</script>

<template>

    <Head title="Lupa Password" />

    <div class="forgot-shell">
        <div class="forgot-topbar">
            <div class="brand-mark font-poppins">
                <img src="/images/logo.webp" alt="Lumiverse" class="brand-logo" />
                <span class="brand-label">Lumiverse</span>
            </div>
        </div>

        <main class="forgot-main">
            <div class="forgot-card">

                <!-- ── State: form input email ─────────────────────── -->
                <template v-if="!sent">
                    <h1 class="forgot-title">Lupa Password?</h1>
                    <p class="forgot-desc">
                        Masukkan email akun partner kamu. Kami akan kirim link
                        untuk membuat password baru.
                    </p>

                    <form @submit.prevent="submit" class="forgot-form">
                        <div class="field">
                            <input id="email" type="email" v-model="email" autocomplete="email" :disabled="processing"
                                placeholder=" " required class="field-input" />
                            <label for="email" class="field-label pointer-events-none">Alamat Email</label>
                        </div>

                        <p v-if="errorMessage" class="field-error">{{ errorMessage }}</p>

                        <button type="submit" :disabled="processing || !email" class="btn-primary">
                            <svg v-if="processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                                aria-hidden="true">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <span>{{ processing ? 'Mengirim…' : 'Kirim Link Reset' }}</span>
                        </button>
                    </form>
                </template>

                <!-- ── State: sudah dikirim ────────────────────────── -->
                <template v-else>
                    <h1 class="forgot-title">Silakan cek email</h1>
                    <p class="forgot-desc">
                        Link reset password telah dikirim ke <strong>{{ email }}</strong>.
                    </p>

                    <button type="button" class="btn-secondary" @click="sent = false">
                        Kirim ulang ke email lain
                    </button>
                </template>

                <Link :href="route('partner.login')" class="back-link">Kembali ke masuk</Link>
            </div>
        </main>

        <footer class="forgot-footer">
            <Link :href="route('partner.login')">Syarat & Ketentuan</Link>
            <span class="dot">|</span>
            <Link :href="route('partner.register')">Kebijakan Privasi</Link>
        </footer>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.forgot-shell * {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

.forgot-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    color: #0b1120;
}

.forgot-topbar {
    padding: 1.25rem 1.25rem;
}

.brand-mark {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 800;
    font-size: 1.1rem;
}

.brand-logo {
    height: 46px;
    width: auto;
    object-fit: contain;
}

.brand-label {
    font-family: var(--font-display);
    gap: 0.4rem;
    margin-left: -14px;
    margin-top: -4px;
    font-size: 1.25rem;
}

.forgot-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem 4rem;
}

.forgot-card {
    width: 100%;
    max-width: 380px;
    text-align: center;
}

.forgot-title {
    font-family: var(--font-display), 'Fraunces', serif;
    font-weight: 600;
    font-size: 1.9rem;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
}

.forgot-desc {
    font-size: 0.92rem;
    line-height: 1.65;
    color: #64748b;
    margin-bottom: 2rem;
}

.forgot-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    text-align: left;
}

.field {
    position: relative;
}

.field-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.10em;
    /* text-transform: uppercase; */
    color: #64748b;
    position: absolute;
    left: 1.35rem;
    top: 0.75rem;
    background: #ffffff;
    padding: 0 0.25rem;
    transition: all 0.2s ease;
}

.field-input {
    width: 100%;
    padding: 0.65rem 0.5rem;
    padding-left: 1.5rem;
    border: 1px solid #0b1120;
    /* border-bottom: 1.5px solid #64748b; */
    border-radius: 50px;
    background: transparent;
    font-size: 0.95rem;
    color: #0b1120;
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

/* .field-input:focus {
    border-bottom-color: #f5a623;
} */

.field-input:not(:placeholder-shown)~.field-label,
.field-input:focus~.field-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    left: 1.35rem;
    top: -0.7rem;
    font-size: 0.8rem;
    font-weight: 800;
    color: #0b1120;
}

.field-error {
    font-size: 0.78rem;
    color: #e11d48;
    text-align: left;
}

.btn-primary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1rem;
    border-radius: 100px;
    background: #0b1120;
    color: #f8f9ff;
    font-weight: 700;
    font-size: 0.92rem;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.15s ease;
}

.btn-primary:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    /* opacity: 0.5; */
    cursor: not-allowed;
}

.btn-secondary {
    width: 100%;
    padding: 0.8rem 1rem;
    border-radius: 100px;
    background: transparent;
    color: #0b1120;
    font-weight: 700;
    font-size: 0.88rem;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
}

.btn-secondary:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
}

.back-link {
    display: block;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #0b1120;
    text-decoration: none;
}

.back-link:hover {
    text-decoration: underline;
}

.forgot-footer {
    padding: 1.5rem;
    text-align: center;
    font-size: 0.78rem;
    color: #94a3b8;
}

.forgot-footer a {
    color: #94a3b8;
    text-decoration: none;
}

.forgot-footer a:hover {
    text-decoration: underline;
}

.forgot-footer .dot {
    margin: 0 0.5rem;
}
</style>