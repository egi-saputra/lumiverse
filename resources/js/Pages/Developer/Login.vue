<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import { onMounted } from 'vue'

const form = useForm({
    email: '',
    password: '',
    remember: false,
})

function submit() {
    form.post(route('developer.login'), {
        onFinish: () => form.reset('password'),
    })
}

/* ─── Dark Mode — dipaksa selalu aktif ──── */
onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>

    <Head title="Dev Sign In" />

    <div class="auth-page">
        <div class="auth-card">
            <h1 class="auth-title text-center">Masuk ke Dashboard</h1>
            <p class="auth-sub text-center">Kelola seluruh tenant sekolah dari satu tempat.</p>

            <form @submit.prevent="submit" class="auth-form">
                <div class="field">
                    <label for="email">Email Address</label>
                    <input id="email" type="email" v-model="form.email" autofocus autocomplete="username" />
                    <div v-if="form.errors.email" class="field-error">{{ form.errors.email }}</div>
                </div>

                <div class="field">
                    <label for="password">Password</label>
                    <input id="password" type="password" v-model="form.password" autocomplete="current-password" />
                    <div v-if="form.errors.password" class="field-error">{{ form.errors.password }}</div>
                </div>

                <label class="checkbox-row">
                    <input type="checkbox" v-model="form.remember" />
                    Ingat saya
                </label>

                <button type="submit" class="btn-hero auth-submit" :disabled="form.processing">
                    Masuk
                </button>
            </form>

            <p class="auth-footer">
                Belum punya akun?
                <Link :href="route('developer.register')" class="text-cyan">Daftar di sini</Link>
            </p>
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
    max-width: 420px;
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
}

.auth-sub {
    font-size: 0.9rem;
    color: var(--muted);
    margin-bottom: 2rem;
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

.auth-footer {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--muted);
}
</style>