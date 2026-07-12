<script setup>
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { CheckIcon } from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue';

const page = usePage()

// ─── Product type ───────────────────────────────────────────────────────────
const isWorkspace = computed(() => page.props.tenant?.product_type === 'workspace')

// ─── Label & teks kondisional per product_type ─────────────────────────────────
const eyebrowText = computed(() => isWorkspace.value ? 'Perusahaan / Organisasi' : 'Lembaga Pendidikan')

const taglineLine1 = computed(() => isWorkspace.value
    ? 'The Greatest Workspace Management System App'
    : 'The Greatest Learning Management System App')

const taglineLine2 = computed(() => isWorkspace.value
    ? 'Bergabung dan mulai kelola operasional serta aktivitas kerja tim secara digital.'
    : 'Bergabung dan mulai kelola aktivitas belajar mengajar secara digital.')

const lumiverseDirectoryLabel = computed(() => isWorkspace.value
    ? 'Lumi Workspace - Smart Workspace System App'
    : 'Lumiverse School - Smart Learning System App')

// Daftar Direktori — item "Mading Digital" hanya relevan untuk tenant school
const directoryItems = computed(() => {
    const items = [
        {
            href: 'https://smknusantara.id',
            external: true,
            label: `Website Resmi ${page.props.tenant?.name ?? ''}`,
        },
    ]

    if (!isWorkspace.value) {
        items.push({
            routeName: 'mading.index',
            external: false,
            label: `Mading Digital ${page.props.tenant?.name ?? ''}`,
        })
    }

    items.push({
        href: 'https://www.lumiverse.co.id',
        external: true,
        label: lumiverseDirectoryLabel.value,
    })

    return items
})

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const submit = () => {
    form.post(route('register'), {
        preserveScroll: true,
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};

// ─── Password rules ─────────────────────────────────────────────────────────

const passwordRules = computed(() => [
    { label: 'Minimal 8 karakter', valid: form.password.length >= 8 },
    { label: 'Huruf besar (A-Z)', valid: /[A-Z]/.test(form.password) },
    { label: 'Huruf kecil (a-z)', valid: /[a-z]/.test(form.password) },
    { label: 'Angka (0-9)', valid: /[0-9]/.test(form.password) },
    { label: 'Simbol (!@#$...)', valid: /[^A-Za-z0-9]/.test(form.password) },
])

const passwordStrength = computed(() => {
    const passed = passwordRules.value.filter(r => r.valid).length
    if (passed <= 1) return { label: 'Very Weak', color: '#C0392B', width: '20%' }
    if (passed === 2) return { label: 'Weak', color: '#D97706', width: '40%' }
    if (passed === 3) return { label: 'Enough', color: '#C9A227', width: '60%' }
    if (passed === 4) return { label: 'Strong', color: '#7C9A6E', width: '80%' }
    return { label: 'Very Strong', color: '#1A1B3A', width: '100%' }
})

const isPasswordValid = computed(() =>
    passwordRules.value.every(r => r.valid)
)
</script>

<template>

    <Head title="Register" />

    <div class="flex flex-col h-screen md:flex-row">

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
                <p class="max-w-xl text-sm leading-relaxed text-[#FAF9F5]/70 capitalize">
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
                            <!-- <i class="bi bi-arrow-up-right text-[#C9A227]/70" aria-hidden="true"></i> -->
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                                stroke-width="1.5" class="text-[#C9A227]/70" aria-hidden="true">
                                <path d="M6 11L11 6M11 6H7M11 6V10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>
                        <Link v-else :href="route(item.routeName)" prefetch preserve-scroll preserve-state
                            class="directory-row">
                            <span class="directory-index">{{ String(i + 1).padStart(2, '0') }}</span>
                            <span class="flex-1 capitalize">{{ item.label }}</span>
                            <i class="bi bi-arrow-up-right text-[#C9A227]/70" aria-hidden="true"></i>
                        </Link>
                    </li>
                </ul>
            </nav>

            <p class="relative z-10 mt-10 text-xs text-[#FAF9F5]/40">
                © {{ new Date().getFullYear() }} PT Lumi Platforms Indonesia · All Rights Reserved.
            </p>
        </aside>

        <!-- ── Right Panel ─────────────────────────────────────────────────── -->
        <main
            class="flex flex-1 flex-col items-center sm:justify-center overflow-y-auto bg-[#FAF9F5] sm:px-6 px-8 py-10">
            <div class="w-full max-w-sm">

                <!-- Header -->
                <div class="mb-6">
                    <h2 class="font-display text-3xl text-[#C9A227]">Register Account</h2>
                    <p class="sm:mt-2 mt-1 text-sm text-[#6B7086]">Complete the following data to start using services.
                    </p>
                </div>

                <!-- ── Register Form ─────────────────────────────────────── -->
                <form @submit.prevent="submit" novalidate class="space-y-5">

                    <!-- Username -->
                    <div class="field">
                        <!-- <label for="name" class="field-label">Username</label> -->
                        <input id="name" type="text" name="name" v-model="form.name" autocomplete="username"
                            :disabled="form.processing" placeholder="Enter Username" required class="field-input" />
                        <p v-if="form.errors.name" class="field-error">{{ form.errors.name }}</p>
                    </div>

                    <!-- Email -->
                    <div class="field">
                        <!-- <label for="email" class="field-label">Alamat Email</label> -->
                        <input id="email" type="email" name="email" v-model="form.email" autocomplete="email"
                            :disabled="form.processing" placeholder="Enter email address" required
                            class="field-input" />
                        <p v-if="form.errors.email" class="field-error">{{ form.errors.email }}</p>
                    </div>

                    <!-- Password -->
                    <div class="field">
                        <!-- <label for="password" class="field-label">Kata Sandi</label> -->
                        <div class="relative">
                            <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
                                autocomplete="new-password" :disabled="form.processing" placeholder="Enter password"
                                required class="field-input pr-10" />
                            <button type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                class="password-toggle" @click="showPassword = !showPassword">
                                <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'" aria-hidden="true"></i>
                            </button>
                        </div>

                        <!-- Password strength bar -->
                        <div v-if="form.password.length > 0" class="pw-strength-wrap">
                            <div class="pw-strength-bar">
                                <div class="pw-strength-fill"
                                    :style="{ width: passwordStrength.width, background: passwordStrength.color }" />
                            </div>
                            <span class="pw-strength-label" :style="{ color: passwordStrength.color }">
                                {{ passwordStrength.label }}
                            </span>
                        </div>

                        <!-- Password rules checklist -->
                        <div v-if="form.password.length > 0" class="pw-rules">
                            <div v-for="rule in passwordRules" :key="rule.label" class="pw-rule"
                                :class="{ 'pw-rule-valid': rule.valid }">
                                <CheckIcon v-if="rule.valid" class="h-3.5 w-3.5" />
                                <span v-else class="pw-rule-dot">○</span>
                                <span>{{ rule.label }}</span>
                            </div>
                        </div>

                        <p v-if="form.errors.password" class="field-error">{{ form.errors.password }}</p>
                    </div>

                    <!-- Password Confirmation -->
                    <!-- <div class="field">
                        <label for="password_confirmation" class="field-label">Konfirmasi Kata Sandi</label>
                        <div class="relative">
                            <input id="password_confirmation" :type="showPasswordConfirmation ? 'text' : 'password'"
                                v-model="form.password_confirmation" autocomplete="new-password"
                                :disabled="form.processing" placeholder="••••••••" required class="field-input pr-10" />
                            <button type="button"
                                :aria-label="showPasswordConfirmation ? 'Hide password' : 'Show password'"
                                class="password-toggle" @click="showPasswordConfirmation = !showPasswordConfirmation">
                                <i :class="showPasswordConfirmation ? 'bi bi-eye' : 'bi bi-eye-slash'"
                                    aria-hidden="true"></i>
                            </button>
                        </div>
                        <p v-if="form.errors.password_confirmation" class="field-error">
                            {{ form.errors.password_confirmation }}
                        </p>
                    </div> -->

                    <!-- Submit -->
                    <button type="submit" :disabled="form.processing || !isPasswordValid" class="btn-primary">
                        <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                            aria-hidden="true">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span>{{ form.processing ? 'Creating your account…' : 'Register' }}</span>
                    </button>

                    <p class="text-center text-sm text-[#6B7086]">
                        Have an account?
                        <Link :href="route('login')" prefetch preserve-scroll preserve-state :only="[]"
                            class="text-link">
                            Sign in here.
                        </Link>
                    </p>

                    <div class="divider-stars"><span>OR</span></div>

                    <a :href="`/auth/google?from_tenant=${page.props.tenant?.id}`" class="btn-outline">
                        <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="" width="18"
                            height="18" />
                        <span>Register with Google</span>
                    </a>
                </form>

                <p
                    class="text-xs font-semibold sm:hidden flex absolute bottom-4 right-0 left-0 justify-center text-[#6B7086] font-poppins">
                    Lumi Platforms,
                    Inc.
                </p>
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

/* ── Form fields ── */
.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.field-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6B7086;
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
    color: #B7B6C4;
}

.field-input:disabled {
    opacity: 0.6;
}

.field-input:focus {
    outline: none;
    box-shadow: none;
    border-bottom-color: #C9A227;
}

.field-error {
    font-size: 0.75rem;
    color: #C0392B;
    margin-top: 0.15rem;
}

/* ── Password strength ─────────────────────────────────────── */
.pw-strength-wrap {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.5rem;
}

.pw-strength-bar {
    flex: 1;
    height: 4px;
    background: #E2E0DA;
    border-radius: 100px;
    overflow: hidden;
}

.pw-strength-fill {
    height: 100%;
    border-radius: 100px;
    transition: width 0.4s ease, background 0.4s ease;
}

.pw-strength-label {
    font-size: 0.7rem;
    font-weight: 700;
    white-space: nowrap;
}

/* ── Password rules checklist ──────────────────────────────── */
.pw-rules {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.3rem 0.75rem;
    margin-top: 0.6rem;
    padding: 0.65rem 0.85rem;
    background: rgba(26, 27, 58, 0.03);
    border: 1px solid #E2E0DA;
    border-radius: 10px;
}

.pw-rule {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    color: #6B7086;
    transition: color 0.25s ease;
}

.pw-rule-valid {
    color: #7C9A6E;
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
    color: #9C9FB3;
    transition: color 0.2s ease;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

.password-toggle:focus {
    outline: none;
}

.password-toggle:hover {
    color: #1A1B3A;
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

.btn-outline {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.7rem 1rem;
    border: 1.5px solid #E2E0DA;
    border-radius: 0.6rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #1A1B3A;
    text-decoration: none;
    transition: border-color 0.2s ease, background 0.2s ease;
}

.btn-outline:hover {
    border-color: #C9A227;
    background: #FAF7EE;
}
</style>