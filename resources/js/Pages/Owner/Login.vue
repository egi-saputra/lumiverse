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

    <Head title="Lumi Sign In" />

    <div class="auth-page">
        <div class="auth-card">
            <!-- <div class="auth-logo">
                <div class="auth-logo-mark">K</div>
                <span>KREATICRAFT <span class="text-cyan">INDONESIA</span></span>
            </div> -->

            <h1 class="auth-title">Welcome Back 👋</h1>
            <p class="auth-sub">Please sign in your account to continue.</p>

            <!-- Alert Error -->
            <div v-if="errorMessage" class="field-error"
                style="margin-bottom: 1rem; padding: 0.75rem; border-radius: 8px; background: rgba(251,113,133,0.1); border: 1px solid rgba(251,113,133,0.3);">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="submit" class="auth-form">
                <div class="field">
                    <label for="email">Email Address</label>
                    <input id="email" type="email" v-model="form.email" autofocus autocomplete="username" />
                    <div v-if="form.errors.email" class="field-error">{{ form.errors.email }}</div>
                </div>

                <div class="field">
                    <label for="password">Password</label>
                    <div class="input-eye-wrap">
                        <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
                            autocomplete="current-password" />
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
                </div>

                <label class="checkbox-row">
                    <input type="checkbox" v-model="form.remember" />
                    Remember Me
                </label>

                <button type="submit" class="btn-hero auth-submit" :disabled="form.processing">
                    <svg v-if="form.processing" class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>{{ form.processing ? 'Signing in...' : 'Sign In' }}</span>
                </button>
            </form>

            <p class="auth-footer">
                Don't have an account?
                <Link href="/registration" class="text-cyan">Register here.</Link>
            </p>

            <div class="divider">OR</div>

            <a :href="route('google.redirect.central')" class="btn-google">
                <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="" width="18" height="18" />
                <span>Continue with Google</span>
            </a>

            <!-- <div class="flex justify-center gap-0.5 mt-6 -mb-6">
                <img src="/images/logo.png" alt="Lumiverse School" class="h-4 object-cover scale-150 sm:flex hidden" />
                <p class="font-semibold text-xs text-[var(--muted)] sm:flex hidden justify-center">
                    Lumi Platforms, Inc.
                </p>
            </div> -->

        </div>
    </div>
</template>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: var(--midnight);
}

.auth-card {
    width: 100%;
    max-width: 460px;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem;
}

.auth-logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 0.95rem;
    margin-bottom: 2rem;
}

.auth-logo-mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--midnight);
    font-weight: 900;
}

.auth-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    /* margin-bottom: 0.5rem; */
}

.auth-sub {
    font-size: 0.9rem;
    color: var(--muted);
    margin-bottom: 1.5rem;
}

.auth-form {
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

.field input {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--white);
    font-size: 0.9rem;
    transition: border-color 0.2s;
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
    right: 1rem;
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

.auth-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.spin-icon {
    animation: spin 0.8s linear infinite;
}

.spin-icon .opacity-25 {
    opacity: 0.25;
}

.spin-icon .opacity-75 {
    opacity: 0.75;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.field-error {
    margin-top: 0.4rem;
    font-size: 0.78rem;
    color: #fb7185;
}

.checkbox-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--muted);
    cursor: pointer;
}

.auth-submit {
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
}

.auth-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: var(--muted);
    margin: 0.5rem 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
}

.btn-google {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.7rem 1rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    color: var(--white);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
}

.btn-google:hover {
    border-color: #4285F4;
    background: rgba(66, 133, 244, 0.08);
}

.auth-footer {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--muted);
}
</style>