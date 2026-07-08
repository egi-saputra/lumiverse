<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { usePage } from '@inertiajs/vue3'

// ── Konfigurasi API ────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

const profil = computed(() => page.props.profilSekolah ?? {})

// ── State ──────────────────────────────────────────────────────────
const page = usePage()
const sectionRef = ref(null);
const isVisible = ref(false);
const submitted = ref(false);
const loading = ref(false);
const serverErrors = ref({});   // Error dari server (validasi / spam)
const globalError = ref('');   // Error umum (500, network, dll.)

const form = ref({
    name: '',
    phone: '',
    program: '',
    message: '',
    device_fingerprint: '',
    device_info: {},
});

const programs = [
    'MPLB — Manajemen Perkantoran & Lembaga Bisnis',
    'BR — Bisnis Retail & Pemasaran',
];

const contacts = computed(() => [
    { icon: '📍', label: 'Alamat', value: profil.value.alamat ?? '-' },
    { icon: '📞', label: 'Telepon', value: profil.value.telepon ?? '-' },
    { icon: '✉️', label: 'Email', value: profil.value.email ?? '-' },
    { icon: '⏰', label: 'Jam Operasional', value: 'Senin–Sabtu, 07.00–16.00 WIB' },
])

// ── Computed: error per field ──────────────────────────────────────
const fieldError = (field) => serverErrors.value[field]?.[0] ?? '';

// ── Device Fingerprint ─────────────────────────────────────────────
/**
 * Buat fingerprint ringan dari properti browser yang tersedia.
 * Tidak bergantung library eksternal — cukup untuk identifikasi device.
 */
async function generateFingerprint() {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency ?? '',
        navigator.platform ?? '',
    ].join('|');

    // SHA-256 via Web Crypto API (tersedia di semua modern browser)
    const encoder = new TextEncoder();
    const data = encoder.encode(components);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hex = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    return hex;
}

async function collectDeviceInfo() {
    const fingerprint = await generateFingerprint();

    form.value.device_fingerprint = fingerprint;
    form.value.device_info = {
        screen_width: screen.width,
        screen_height: screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform ?? '',
    };
}

// ── Submit Handler ─────────────────────────────────────────────────
async function submitForm() {
    // Reset state
    serverErrors.value = {};
    globalError.value = '';

    // Validasi frontend minimal
    if (!form.value.name || !form.value.phone || !form.value.program) return;

    loading.value = true;

    try {
        // Pastikan fingerprint sudah ada
        if (!form.value.device_fingerprint) {
            await collectDeviceInfo();
        }

        const response = await fetch(`${API_BASE}/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // CSRF token (jika menggunakan cookie-based session)
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            credentials: 'include', // penting untuk Sanctum / cookie
            body: JSON.stringify({
                name: form.value.name,
                phone: form.value.phone,
                program: form.value.program,
                message: form.value.message || undefined,
                device_fingerprint: form.value.device_fingerprint,
                device_info: form.value.device_info,
            }),
        });

        const json = await response.json();

        if (response.ok && json.success) {
            submitted.value = true;
            return;
        }

        // ── Error handling berdasarkan status HTTP ─────────────────
        if (response.status === 422) {
            // Validasi gagal — tampilkan error per field
            serverErrors.value = json.errors ?? {};
        } else if (response.status === 429) {
            // Rate limit / spam guard
            globalError.value = json.message ?? 'Terlalu banyak percobaan. Silakan coba lagi nanti.';
        } else if (response.status === 409) {
            // Duplikasi device
            globalError.value = json.message ?? 'Perangkat ini sudah pernah mendaftar.';
        } else {
            globalError.value = json.message ?? 'Terjadi kesalahan. Silakan coba beberapa saat lagi.';
        }

    } catch (err) {
        console.error('[Registration] Network error:', err);
        globalError.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu.';
    } finally {
        loading.value = false;
    }
}

// ── Helpers ───────────────────────────────────────────────────────
/**
 * Baca XSRF-TOKEN dari cookie (otomatis di-set Laravel setelah hit /sanctum/csrf-cookie)
 */
function getCsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Inisialisasi CSRF + fingerprint saat komponen mount.
 * Untuk Sanctum, hit /sanctum/csrf-cookie terlebih dahulu.
 */
async function initSession() {
    try {
        // Hanya perlu sekali per sesi — bisa di-skip jika sudah ada cookie
        if (!getCsrfToken()) {
            await fetch(`${import.meta.env.VITE_APP_URL ?? 'http://localhost:8000'}/sanctum/csrf-cookie`, {
                credentials: 'include',
            });
        }
    } catch (_) {
        // Abaikan error CSRF saat dev; server mungkin belum jalan
    }

    await collectDeviceInfo();
}

// ── Intersection Observer ─────────────────────────────────────────
let observer;
onMounted(async () => {
    await initSession();

    observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) isVisible.value = true; },
        { threshold: 0.1 }
    );
    if (sectionRef.value) observer.observe(sectionRef.value);
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
    <section id="contact" class="contact-section" ref="sectionRef">
        <div class="contact-bg"></div>

        <div class="contact-inner">
            <!-- Left: Info -->
            <div class="contact-info" :class="{ visible: isVisible }">
                <span class="section-label">Hubungi Kami</span>
                <h2 class="section-title-light">
                    Mulai Perjalananmu<br>
                    <span class="text-gold-gradient">Bersama Kami</span>
                </h2>
                <p class="contact-lead">
                    Punya pertanyaan tentang program, fasilitas, atau pendaftaran?
                    Tim kami siap membantu kamu menemukan jurusan terbaik.
                </p>

                <!-- Contact cards -->
                <div class="info-cards">
                    <div v-for="(c, i) in contacts" :key="i" class="info-card" :style="`--delay: ${i * 0.08}s`"
                        :class="{ visible: isVisible }">
                        <span class="info-icon">{{ c.icon }}</span>
                        <div class="info-text">
                            <span class="info-label">{{ c.label }}</span>
                            <span class="info-value">{{ c.value }}</span>
                        </div>
                    </div>
                </div>

                <!-- Social links -->
                <div class="social-row">
                    <a href="#" class="social-btn" aria-label="Instagram">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="5" />
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                    <a href="#" class="social-btn" aria-label="YouTube">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <rect x="2" y="5" width="20" height="14" rx="3" />
                            <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                    <a href="#" class="social-btn" aria-label="WhatsApp">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <path
                                d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.4-.7 2.7-1.8 3.4l.8 2.6-2.8-.9C11.5 17.7 9.8 17 9 15.8" />
                        </svg>
                    </a>
                    <a href="#" class="social-btn" aria-label="TikTok">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <path d="M9 12a4 4 0 1 0 4 4V4c.5 2 2.5 4 5 4" />
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Right: Form -->
            <div class="contact-form-wrap" :class="{ visible: isVisible }">

                <!-- ── Success state ────────────────────────────────── -->
                <transition name="fade-up-t">
                    <div v-if="submitted" class="form-success">
                        <div class="success-icon">✓</div>
                        <h3 class="success-title">Terima Kasih!</h3>
                        <p class="success-msg">
                            Kami telah menerima pendaftaranmu. Tim kami akan menghubungimu dalam 1×24 jam.
                        </p>
                    </div>

                    <!-- ── Form ─────────────────────────────────────── -->
                    <form v-else class="contact-form" @submit.prevent="submitForm" novalidate>
                        <div class="form-header">
                            <h3 class="form-title">Formulir Pendaftaran</h3>
                            <p class="form-sub">Isi data di bawah — gratis &amp; tanpa biaya apapun</p>
                        </div>

                        <div class="form-grid">
                            <!-- Name -->
                            <div class="form-field" :class="{ 'has-error': fieldError('name') }">
                                <label class="field-label">Nama Lengkap *</label>
                                <input v-model="form.name" type="text" class="field-input"
                                    placeholder="Masukkan nama lengkap" required autocomplete="name" />
                                <span v-if="fieldError('name')" class="field-error">{{ fieldError('name') }}</span>
                            </div>

                            <!-- Phone -->
                            <div class="form-field" :class="{ 'has-error': fieldError('phone') }">
                                <label class="field-label">Nomor WhatsApp *</label>
                                <input v-model="form.phone" type="tel" class="field-input" placeholder="08xx-xxxx-xxxx"
                                    required autocomplete="tel" />
                                <span v-if="fieldError('phone')" class="field-error">{{ fieldError('phone') }}</span>
                            </div>

                            <!-- Program -->
                            <div class="form-field form-field--full" :class="{ 'has-error': fieldError('program') }">
                                <label class="field-label">Jurusan yang Diminati *</label>
                                <select v-model="form.program" class="field-input field-select" required>
                                    <option value="" disabled>Pilih jurusan</option>
                                    <option v-for="p in programs" :key="p" :value="p">{{ p }}</option>
                                </select>
                                <span v-if="fieldError('program')" class="field-error">{{ fieldError('program')
                                    }}</span>
                            </div>

                            <!-- Message -->
                            <div class="form-field form-field--full">
                                <label class="field-label">Pesan / Pertanyaan</label>
                                <textarea v-model="form.message" class="field-input field-textarea"
                                    placeholder="Tulis pertanyaan atau pesan kamu di sini..." rows="4"></textarea>
                            </div>
                        </div>

                        <!-- ── Global error banner ──────────────────────────── -->
                        <transition name="fade-up-t">
                            <div v-if="globalError" class="alert-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                                {{ globalError }}
                            </div>
                        </transition>

                        <button type="submit" class="btn-gold-solid form-submit" :disabled="loading">
                            <span v-if="loading" class="loading-spinner"></span>
                            <span v-else>Kirim Pendaftaran</span>
                            <span v-if="!loading">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                        </button>

                        <p class="form-note">* Wajib diisi. Data kamu aman bersama kami.</p>
                    </form>
                </transition>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* ── Semua style original dipertahankan + tambahan error styles ── */

.contact-section {
    position: relative;
    padding: 7rem 2rem;
    background: var(--navy-900);
    overflow: hidden;
}

.contact-bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 50% 60% at 0% 50%, rgba(26, 58, 107, 0.35) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 100% 20%, rgba(201, 168, 76, 0.04) 0%, transparent 60%);
    pointer-events: none;
}

.contact-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: start;
}

/* Info side */
.contact-info {
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.8s ease;
}

.contact-info.visible {
    opacity: 1;
    transform: translateX(0);
}

.contact-lead {
    font-size: 0.95rem;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.45);
    margin: 1.25rem 0 2.5rem;
    max-width: 420px;
}

.info-cards {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
}

.info-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: rgba(11, 30, 61, 0.5);
    border: 1px solid rgba(201, 168, 76, 0.08);
    opacity: 0;
    transform: translateX(-20px);
    transition: opacity 0.6s ease var(--delay), transform 0.6s ease var(--delay), border-color 0.3s;
}

.info-card.visible {
    opacity: 1;
    transform: translateX(0);
}

.info-card:hover {
    border-color: rgba(201, 168, 76, 0.2);
}

.info-icon {
    font-size: 1.1rem;
    line-height: 1.4;
    flex-shrink: 0;
}

.info-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.info-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold-500);
}

.info-value {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.5;
}

.social-row {
    display: flex;
    gap: 0.5rem;
}

.social-btn {
    width: 40px;
    height: 40px;
    border: 1px solid rgba(201, 168, 76, 0.2);
    color: rgba(255, 255, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.3s;
}

.social-btn:hover {
    border-color: var(--gold-500);
    color: var(--gold-500);
    background: rgba(201, 168, 76, 0.07);
}

/* Form side */
.contact-form-wrap {
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.8s ease 0.15s;
}

.contact-form-wrap.visible {
    opacity: 1;
    transform: translateX(0);
}

.contact-form {
    background: rgba(11, 30, 61, 0.5);
    border: 1px solid rgba(201, 168, 76, 0.1);
    padding: 2.5rem;
}

.form-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.form-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 0.25rem;
}

.form-sub {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.35);
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-field--full {
    grid-column: 1 / -1;
}

.field-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
}

.field-input {
    background: rgba(5, 14, 31, 0.7);
    border: 1px solid rgba(201, 168, 76, 0.12);
    color: var(--white);
    font-family: var(--font-body);
    font-size: 0.875rem;
    padding: 0.8rem 1rem;
    width: 100%;
    outline: none;
    transition: border-color 0.3s;
    appearance: none;
    -webkit-appearance: none;
}

.field-input::placeholder {
    color: rgba(255, 255, 255, 0.2);
}

.field-input:focus {
    border-color: rgba(201, 168, 76, 0.45);
}

/* Error state pada field */
.has-error .field-input {
    border-color: rgba(239, 68, 68, 0.5);
}

.has-error .field-input:focus {
    border-color: rgba(239, 68, 68, 0.8);
}

.field-error {
    font-size: 0.7rem;
    color: #f87171;
    letter-spacing: 0.02em;
    margin-top: 2px;
}

/* Global error banner */
.alert-error {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.9rem 1.1rem;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    color: #f87171;
    font-size: 0.82rem;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.alert-error svg {
    flex-shrink: 0;
    margin-top: 1px;
}

.field-select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(201,168,76,0.5)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
    color: rgba(255, 255, 255, 0.7);
}

.field-select option {
    background: var(--navy-800);
    color: var(--white);
}

.field-textarea {
    resize: none;
    line-height: 1.6;
}

.form-submit {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-size: 0.85rem;
    padding: 1rem;
    clip-path: none;
    margin-bottom: 1rem;
    gap: 0.5rem;
}

.form-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.loading-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(5, 14, 31, 0.3);
    border-top-color: var(--navy-900);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.form-note {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.25);
    text-align: center;
    letter-spacing: 0.04em;
}

/* Success state */
.form-success {
    background: rgba(11, 30, 61, 0.5);
    border: 1px solid rgba(201, 168, 76, 0.15);
    padding: 4rem 2.5rem;
    text-align: center;
}

.success-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--gold-500), var(--gold-300));
    color: var(--navy-900);
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}

.success-title {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 600;
    color: var(--gold-400);
    margin-bottom: 0.75rem;
}

.success-msg {
    font-size: 0.9rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.5);
}

/* Transitions */
.fade-up-t-enter-active,
.fade-up-t-leave-active {
    transition: all 0.4s ease;
}

.fade-up-t-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-up-t-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@media (max-width: 900px) {
    .contact-inner {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
}

@media (max-width: 480px) {
    .form-grid {
        grid-template-columns: 1fr;
    }

    .contact-form {
        padding: 1.75rem;
    }
}
</style>