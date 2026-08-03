<script setup>
import { Head, Link } from '@inertiajs/vue3'
import HomeLayout from '@/Layouts/HomeLayout.vue'
import { ref } from 'vue'

const emailCopied = ref(false)

async function copyEmail() {
    try {
        await navigator.clipboard.writeText('info@lumiverse.co.id')
        emailCopied.value = true
        window.setTimeout(() => {
            emailCopied.value = false
        }, 2200)
    } catch {
        emailCopied.value = false
    }
}

const cookieTypes = [
    {
        label: 'Wajib',
        tone: 'required',
        title: 'Cookie yang diperlukan',
        description: 'Cookie ini diperlukan agar fungsi utama Lumiverse dapat berjalan, termasuk sesi login, keamanan request, dan perpindahan halaman. Cookie wajib tidak dapat dimatikan melalui halaman ini karena layanan dapat berhenti berfungsi.',
        examples: 'Sesi login dan perlindungan keamanan layanan.',
    },
    {
        label: 'Keamanan',
        tone: 'security',
        title: 'Penyimpanan keamanan perangkat',
        description: 'Pada area partner, browser dapat menyimpan pengenal perangkat untuk menghubungkan perangkat dengan akun dan menjalankan verifikasi PIN atau biometric. Pengenal ini bukan password dan tidak berisi PIN Anda.',
        examples: 'Pengenal perangkat pada penyimpanan lokal browser.',
    },
    {
        label: 'Opsional',
        tone: 'optional',
        title: 'Cookie analitik dan pemasaran',
        description: 'Saat ini kami tidak mengaktifkan cookie analitik atau pemasaran pihak ketiga pada halaman ini. Jika kategori opsional ditambahkan di kemudian hari, halaman ini akan diperbarui dan pilihan Anda akan dijelaskan sebelum digunakan.',
        examples: 'Belum digunakan pada konfigurasi saat ini.',
    },
]
</script>

<template>

    <Head>
        <title>Kelola Cookie | Lumiverse</title>
        <meta head-key="description" name="description" content="Informasi dan pengaturan cookie Lumiverse School." />
        <link head-key="canonical" rel="canonical" href="https://lumiverse.co.id/cookie" />
    </Head>

    <section class="cookie-page">
        <div class="cookie-shell">
            <div class="cookie-intro">
                <Link href="/" class="back-link" prefetch="hover">Kembali ke Lumiverse</Link>
                <p class="eyebrow">PREFERENSI BROWSER</p>
                <h1>Kelola Cookie</h1>
                <p class="intro-copy">
                    Halaman ini menjelaskan teknologi penyimpanan yang digunakan Lumiverse agar Anda dapat memahami
                    fungsi dan cara mengelolanya melalui browser.
                </p>
                <p class="updated">Terakhir diperbarui: 31 Juli 2026</p>
            </div>

            <div class="notice">
                <span class="notice-mark" aria-hidden="true">i</span>
                <p>
                    Lumiverse saat ini hanya menggunakan penyimpanan yang diperlukan untuk menjalankan layanan dan
                    keamanan. Tidak ada cookie analitik atau pemasaran opsional yang aktif pada halaman ini.
                </p>
            </div>

            <div class="cookie-list">
                <article v-for="cookie in cookieTypes" :key="cookie.label" class="cookie-card">
                    <div class="cookie-card-top">
                        <span class="cookie-label" :class="`cookie-label-${cookie.tone}`">{{ cookie.label }}</span>
                        <span class="cookie-status">{{ cookie.tone === 'optional' ? 'Tidak aktif' : 'Aktif' }}</span>
                    </div>
                    <h2>{{ cookie.title }}</h2>
                    <p>{{ cookie.description }}</p>
                    <div class="example-row">
                        <span class="example-key">Contoh</span>
                        <span>{{ cookie.examples }}</span>
                    </div>
                </article>
            </div>

            <div class="cookie-help">
                <div>
                    <p class="eyebrow">PENGATURAN BROWSER</p>
                    <h2>Menghapus atau memblokir cookie</h2>
                </div>
                <p>
                    Anda dapat menghapus atau memblokir cookie melalui pengaturan browser. Jika cookie wajib diblokir,
                    login, formulir, atau fitur keamanan mungkin tidak berjalan normal. Pengaturan browser juga dapat
                    menghapus pengenal perangkat dan membuat partner perlu mendaftarkan perangkat kembali.
                </p>
            </div>

            <div class="cookie-footer">
                <p class="contact-copy">
                    Untuk pertanyaan tentang cookie atau data pribadi, hubungi
                    <a href="mailto:info@lumiverse.co.id" @click="copyEmail">info@lumiverse.co.id</a>.
                    <button type="button" class="copy-button" @click="copyEmail">
                        {{ emailCopied ? 'Tersalin' : 'Salin email' }}
                    </button>
                </p>
                <div class="legal-links">
                    <Link href="/privasi" prefetch="hover">Kebijakan Privasi</Link>
                    <Link href="/syarat" prefetch="hover">Syarat & Ketentuan</Link>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.cookie-page {
    min-height: 100%;
    padding: 8rem 1.25rem 6rem;
    color: var(--white);
    background:
        radial-gradient(circle at 85% 0%, rgba(251, 191, 36, 0.1), transparent 28rem),
        var(--midnight);
}

.cookie-shell {
    width: min(100%, 980px);
    margin: 0 auto;
}

.cookie-intro {
    max-width: 720px;
    padding-bottom: 3.5rem;
}

.back-link,
.legal-links a,
.cookie-footer a {
    color: var(--cyan);
    text-decoration: none;
}

.back-link {
    display: inline-flex;
    margin-bottom: 3rem;
    font-size: 0.8rem;
}

.back-link:hover,
.legal-links a:hover,
.cookie-footer a:hover {
    text-decoration: underline;
}

.copy-button {
    margin-left: 0.35rem;
    padding: 0.35rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.03);
    color: var(--muted);
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
}

.copy-button:hover,
.copy-button:focus-visible {
    border-color: var(--cyan);
    background: rgba(0, 212, 255, 0.08);
    color: var(--cyan);
    outline: none;
}

.eyebrow {
    margin: 0 0 0.75rem;
    color: #fbbf24;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
}

h1,
h2 {
    font-family: var(--font-display);
}

h1 {
    margin: 0;
    font-size: clamp(2.4rem, 7vw, 5.2rem);
    line-height: 0.98;
    letter-spacing: -0.03em;
}

.intro-copy {
    max-width: 650px;
    margin: 1.5rem 0 0;
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.8;
}

.updated {
    margin: 1.25rem 0 0;
    color: var(--muted);
    font-size: 0.76rem;
}

.notice {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 2rem;
    padding: 1rem 1.1rem;
    border: 1px solid rgba(251, 191, 36, 0.28);
    border-radius: 12px;
    background: rgba(251, 191, 36, 0.08);
}

.notice-mark {
    display: grid;
    width: 19px;
    height: 19px;
    flex-shrink: 0;
    place-items: center;
    border: 1px solid #fbbf24;
    border-radius: 50%;
    color: #fbbf24;
    font-size: 0.7rem;
    font-weight: 800;
}

.notice p,
.cookie-card p,
.cookie-help>p,
.cookie-footer p {
    margin: 0;
    color: var(--muted);
    font-size: 0.88rem;
    line-height: 1.75;
}

.cookie-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
}

.cookie-card {
    display: flex;
    flex-direction: column;
    min-height: 300px;
    padding: 1.35rem;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--navy);
}

.cookie-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1.4rem;
}

.cookie-label,
.cookie-status {
    font-size: 0.68rem;
    font-weight: 700;
}

.cookie-label {
    padding: 0.25rem 0.55rem;
    border-radius: 100px;
}

.cookie-label-required {
    color: #34d399;
    background: rgba(52, 211, 153, 0.12);
}

.cookie-label-security {
    color: var(--cyan);
    background: rgba(0, 212, 255, 0.12);
}

.cookie-label-optional {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.12);
}

.cookie-status {
    color: var(--muted);
}

.cookie-card h2,
.cookie-help h2 {
    margin: 0 0 0.75rem;
    font-size: 1.1rem;
    line-height: 1.25;
}

.example-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: auto;
    padding-top: 1.25rem;
    color: var(--muted);
    font-size: 0.74rem;
    line-height: 1.5;
}

.example-key {
    color: var(--white);
    font-weight: 700;
}

.cookie-help {
    display: grid;
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: 2rem;
    margin-top: 4rem;
    padding: 2rem 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.cookie-help .eyebrow {
    margin-bottom: 0.5rem;
}

.cookie-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 2rem;
}

.legal-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.78rem;
}

@media (max-width: 760px) {
    .cookie-page {
        padding-top: 6.5rem;
    }

    .cookie-list,
    .cookie-help {
        grid-template-columns: 1fr;
    }

    .cookie-card {
        min-height: auto;
    }

    .example-row {
        margin-top: 1rem;
    }

    .cookie-footer {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>
