<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    password: { type: String, default: '' },
    passwordConfirmation: { type: String, default: '' },
    passwordError: { type: String, default: null },
    confirmationError: { type: String, default: null },
})

const emit = defineEmits(['update:password', 'update:passwordConfirmation'])

const showPassword = ref(false)
const showConfPassword = ref(false)

const passwordRules = computed(() => [
    { label: 'Minimal 8 karakter', valid: props.password.length >= 8 },
    { label: 'Huruf besar (A-Z)', valid: /[A-Z]/.test(props.password) },
    { label: 'Huruf kecil (a-z)', valid: /[a-z]/.test(props.password) },
    { label: 'Angka (0-9)', valid: /[0-9]/.test(props.password) },
    { label: 'Simbol (!@#$...)', valid: /[^A-Za-z0-9]/.test(props.password) },
])

const passwordStrength = computed(() => {
    const passed = passwordRules.value.filter((r) => r.valid).length
    if (passed <= 1) return { label: 'Sangat Lemah', color: '#fb7185', width: '20%' }
    if (passed === 2) return { label: 'Lemah', color: '#f97316', width: '40%' }
    if (passed === 3) return { label: 'Cukup', color: '#fbbf24', width: '60%' }
    if (passed === 4) return { label: 'Kuat', color: '#34d399', width: '80%' }
    return { label: 'Sangat Kuat', color: '#00d4ff', width: '100%' }
})

const passwordMatch = computed(
    () => props.passwordConfirmation.length > 0 && props.password === props.passwordConfirmation
)

// Diekspos supaya parent bisa cek validitas sebelum submit
// (mis. some(r => !r.valid) dan passwordMatch)
defineExpose({ passwordRules, passwordMatch })
</script>

<template>
    <div class="pw-fields">
        <div class="field">
            <label for="admin_password">* Password</label>
            <div class="input-eye-wrap">
                <input id="admin_password" :type="showPassword ? 'text' : 'password'" :value="password"
                    @input="emit('update:password', $event.target.value)" placeholder="Min. 8 karakter" />
                <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
            <div v-if="passwordError" class="field-error">{{ passwordError }}</div>

            <div v-if="password.length > 0" class="pw-strength-wrap">
                <div class="pw-strength-bar">
                    <div class="pw-strength-fill"
                        :style="{ width: passwordStrength.width, background: passwordStrength.color }" />
                </div>
                <span class="pw-strength-label" :style="{ color: passwordStrength.color }">
                    {{ passwordStrength.label }}
                </span>
            </div>

            <div v-if="password.length > 0" class="pw-rules">
                <div v-for="rule in passwordRules" :key="rule.label" class="pw-rule"
                    :class="{ 'pw-rule-valid': rule.valid }">
                    <span class="pw-rule-icon">{{ rule.valid ? '✓' : '○' }}</span>
                    <span>{{ rule.label }}</span>
                </div>
            </div>
        </div>

        <div class="field">
            <label for="admin_password_confirmation">* Konfirmasi Password</label>
            <div class="input-eye-wrap">
                <input id="admin_password_confirmation" :type="showConfPassword ? 'text' : 'password'"
                    :value="passwordConfirmation" @input="emit('update:passwordConfirmation', $event.target.value)"
                    placeholder="Ulangi password" :class="{
                        'input-match': passwordMatch,
                        'input-nomatch': passwordConfirmation.length > 0 && !passwordMatch,
                    }" />
                <button type="button" class="eye-btn" @click="showConfPassword = !showConfPassword">
                    <svg v-if="!showConfPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
            <div v-if="confirmationError" class="field-error">{{ confirmationError }}</div>
            <div v-if="passwordConfirmation.length > 0" class="pw-match-hint"
                :class="passwordMatch ? 'pw-match-ok' : 'pw-match-no'">
                {{ passwordMatch ? '✓ Password cocok' : '✗ Password tidak cocok' }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.field label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
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

.field-error {
    margin-top: 0.4rem;
    font-size: 0.78rem;
    color: #fb7185;
}

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
</style>