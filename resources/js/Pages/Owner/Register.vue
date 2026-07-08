<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import { computed, onMounted, ref } from 'vue'

const form = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
})

const showPassword = ref(false)
const showConfPassword = ref(false)

const passwordRules = computed(() => [
    { label: 'Minimal 8 karakter', valid: form.password.length >= 8 },
    { label: 'Huruf besar (A-Z)', valid: /[A-Z]/.test(form.password) },
    { label: 'Huruf kecil (a-z)', valid: /[a-z]/.test(form.password) },
    { label: 'Angka (0-9)', valid: /[0-9]/.test(form.password) },
    { label: 'Simbol (!@#$...)', valid: /[^A-Za-z0-9]/.test(form.password) },
])

const passwordStrength = computed(() => {
    const passed = passwordRules.value.filter(r => r.valid).length
    if (passed <= 1) return { label: 'Sangat Lemah', color: '#fb7185', width: '20%' }
    if (passed === 2) return { label: 'Lemah', color: '#f97316', width: '40%' }
    if (passed === 3) return { label: 'Cukup', color: '#fbbf24', width: '60%' }
    if (passed === 4) return { label: 'Kuat', color: '#34d399', width: '80%' }
    return { label: 'Sangat Kuat', color: '#00d4ff', width: '100%' }
})

const passwordMatch = computed(() =>
    form.password_confirmation.length > 0 &&
    form.password === form.password_confirmation
)

function submit() {
    form.post(route('owner.register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    })
}

onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>

    <Head title="Daftar Akun" />

    <div class="register-page flex-col">
        <div class="register-card">
            <h1 class="register-title">Buat Akun Baru</h1>
            <p class="register-sub">Daftar untuk mengakses dashboard central kamu.</p>

            <form @submit.prevent="submit" class="register-form">
                <div class="field">
                    <label for="name">* Nama Lengkap</label>
                    <input id="name" type="text" v-model="form.name" autofocus autocomplete="name"
                        placeholder="Budi Santoso" />
                    <div v-if="form.errors.name" class="field-error">{{ form.errors.name }}</div>
                </div>

                <div class="field">
                    <label for="email">* Alamat Email</label>
                    <input id="email" type="email" v-model="form.email" autocomplete="username"
                        placeholder="budi@sekolah.id" />
                    <div v-if="form.errors.email" class="field-error">{{ form.errors.email }}</div>
                </div>

                <div class="field">
                    <label for="phone">Nomor WhatsApp <span class="optional-tag">(opsional)</span></label>
                    <input id="phone" type="text" v-model="form.phone" autocomplete="tel" placeholder="08123456789" />
                    <div v-if="form.errors.phone" class="field-error">{{ form.errors.phone }}</div>
                </div>

                <div class="field">
                    <label for="password">* Password</label>
                    <div class="input-eye-wrap">
                        <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
                            autocomplete="new-password" placeholder="Min. 8 karakter" />
                        <button type="button" class="eye-btn" @click="showPassword = !showPassword">
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
                    <div v-if="form.errors.password" class="field-error">{{ form.errors.password }}</div>

                    <!-- Password strength bar -->
                    <div v-if="form.password.length > 0" class="pw-strength-wrap">
                        <div class="pw-strength-bar">
                            <div class="pw-strength-fill"
                                :style="{ width: passwordStrength.width, background: passwordStrength.color }" />
                        </div>
                        <span class="pw-strength-label" :style="{ color: passwordStrength.color }">{{
                            passwordStrength.label }}</span>
                    </div>

                    <!-- Password rules checklist -->
                    <div v-if="form.password.length > 0" class="pw-rules">
                        <div v-for="rule in passwordRules" :key="rule.label" class="pw-rule"
                            :class="{ 'pw-rule-valid': rule.valid }">
                            <span class="pw-rule-icon">{{ rule.valid ? '✓' : '○' }}</span>
                            <span>{{ rule.label }}</span>
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label for="password_confirmation">* Konfirmasi Password</label>
                    <div class="input-eye-wrap">
                        <input id="password_confirmation" :type="showConfPassword ? 'text' : 'password'"
                            v-model="form.password_confirmation" autocomplete="new-password" placeholder="Ulangi password"
                            :class="{ 'input-match': passwordMatch, 'input-nomatch': form.password_confirmation.length > 0 && !passwordMatch }" />
                        <button type="button" class="eye-btn" @click="showConfPassword = !showConfPassword">
                            <svg v-if="!showConfPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
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
                    <div v-if="form.errors.password_confirmation" class="field-error">
                        {{ form.errors.password_confirmation }}
                    </div>
                    <div v-if="form.password_confirmation.length > 0" class="pw-match-hint"
                        :class="passwordMatch ? 'pw-match-ok' : 'pw-match-no'">
                        {{ passwordMatch ? '✓ Password cocok' : '✗ Password tidak cocok' }}
                    </div>
                </div>

                <button type="submit" class="btn-hero step-next" :disabled="form.processing">
                    <span>{{ form.processing ? 'Mendaftarkan...' : 'Daftar Sekarang →' }}</span>
                </button>
            </form>

            <p class="register-footer">
                Sudah punya akun?
                <Link :href="route('owner.login')" class="text-cyan">Masuk di sini.</Link>
            </p>
        </div>

        <div class="flex justify-center gap-1 mt-6 -mb-2">
            <img src="/images/logo.png" alt="Lumiverse School" class="h-5 object-cover scale-150 sm:flex hidden" />
            <p class="font-semibold text-sm text-[var(--muted)] sm:flex hidden justify-center">
                Lumi Platforms, Inc.
            </p>
        </div>
    </div>
</template>

<style scoped>
.register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: var(--midnight);
}

.register-card {
    width: 100%;
    max-width: 460px;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem;
}

.register-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
}

.register-sub {
    font-size: 0.9rem;
    color: var(--muted);
    margin-bottom: 1.25rem;
}

.step-intro {
    font-size: 0.85rem;
    color: var(--muted);
    margin-bottom: 1.5rem;
    padding: 0.75rem 1rem;
    background: rgba(0, 212, 255, 0.06);
    border-radius: 10px;
    border: 1px solid rgba(0, 212, 255, 0.15);
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.field label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--muted);
}

.optional-tag {
    font-weight: 400;
    color: var(--muted);
    opacity: 0.7;
}

.field input {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--white);
    font-size: 0.9rem;
    transition: border-color 0.2s;
    font-family: inherit;
}

.field input:focus {
    outline: none;
    border-color: var(--cyan);
}

.input-eye-wrap {
    position: relative;
}

.input-eye-wrap input {
    padding-right: 2.5rem;
}

.eye-btn {
    position: absolute;
    right: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    line-height: 0;
}

.eye-btn:hover {
    color: var(--white);
}

/* Password strength */
.pw-strength-wrap {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.5rem;
}

.pw-strength-bar {
    flex: 1;
    height: 4px;
    background: var(--border);
    border-radius: 100px;
    overflow: hidden;
}

.pw-strength-fill {
    height: 100%;
    border-radius: 100px;
    transition: width 0.4s ease, background 0.4s ease;
}

.pw-strength-label {
    font-size: 0.72rem;
    font-weight: 700;
    white-space: nowrap;
    transition: color 0.4s ease;
}

/* Password rules checklist */
.pw-rules {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.3rem 0.75rem;
    margin-top: 0.6rem;
    padding: 0.65rem 0.85rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 10px;
}

.pw-rule {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.74rem;
    color: var(--muted);
    transition: color 0.25s ease;
}

.pw-rule-valid {
    color: #34d399;
}

.pw-rule-icon {
    font-size: 0.72rem;
    font-weight: 700;
    width: 14px;
    text-align: center;
    transition: all 0.25s ease;
}

/* Confirm password match */
.input-match {
    border-color: #34d399 !important;
}

.input-nomatch {
    border-color: #fb7185 !important;
}

.pw-match-hint {
    margin-top: 0.35rem;
    font-size: 0.74rem;
    font-weight: 600;
    transition: color 0.2s;
}

.pw-match-ok {
    color: #34d399;
}

.pw-match-no {
    color: #fb7185;
}

.step-next {
    margin-top: 0.5rem;
    width: 100%;
    justify-content: center;
}

.step-next:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.field-error {
    margin-top: 0.4rem;
    font-size: 0.78rem;
    color: #fb7185;
}

.register-footer {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--muted);
}
</style>