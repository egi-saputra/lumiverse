<script setup>
import { ref } from 'vue'

const faqs = [
    {
        q: 'Apa itu Lumiverse School dan siapa yang cocok menggunakannya?',
        a: 'Lumiverse School adalah platform Learning Management System (LMS) berbasis cloud yang dirancang untuk memudahkan sekolah dalam mengelola pembelajaran dan administrasi secara digital. Seluruh kebutuhan seperti absensi, rekap absen otomatis, analitik kehadiran siswa, materi / modul pembelajaran, tugas harian siswa, ujian online, rekap nilai otomatis, hingga komunikasi dengan orang tua tersedia dalam satu platform. Cocok untuk sekolah maupun lembaga pendidikan yang ingin bertransformasi digital dengan cepat dan mudah tanpa memerlukan tim IT khusus.',
    },
    {
        q: 'Berapa lama proses onboarding hingga Lumiverse School siap digunakan?',
        a: 'Sekolah Anda dapat mulai menggunakan Lumiverse School dalam waktu kurang dari 1 menit setelah menyelesaikan proses pendaftaran. Seluruh proses aktivasi dilakukan secara otomatis, sehingga Anda tidak perlu menghubungi sales atau menunggu proses integrasi manual.',
    },
    {
        q: 'Apakah data sekolah kami aman dan terpisah dari sekolah lain?',
        a: 'Tentu. Setiap sekolah memiliki lingkungan yang terisolasi sehingga seluruh data tetap aman dan tidak pernah bercampur dengan sekolah lain. Seluruh komunikasi data dilindungi melalui koneksi HTTPS/TLS (SSL) yang terenkripsi serta sistem hak akses berdasarkan peran untuk memastikan setiap pengguna hanya dapat mengakses informasi yang menjadi kewenangannya.',
    },
    {
        q: "Apakah Lumiverse School tetap stabil saat digunakan untuk ujian serentak?",
        a: "Tentu. Lumiverse School telah digunakan oleh sekolah mitra kami selama lebih dari dua tahun. Platform ini juga telah melalui uji coba secara langsung dengan 2.374 siswa dan guru yang mengakses sistem secara bersamaan saat pelaksanaan ujian, serta pengujian beban (load testing) dengan simulasi ratusan ribu pengguna. Seluruh pengujian tersebut menjadi dasar dalam membangun platform yang cepat, responsif, dan stabil untuk mendukung aktivitas pembelajaran maupun ujian online."
    },
    // {
    //     q: 'Apakah bisa mengintegrasikan sistem yang sudah kami pakai sekarang?',
    //     a: 'Bisa. Kami menyediakan REST API, webhook events, serta SDK resmi untuk Laravel dan Vue.js sehingga sistem existing sekolah — misalnya aplikasi pendaftaran atau portal keuangan — dapat terhubung tanpa perlu membangun ulang dari nol.',
    // },
    {
        q: 'Berapa biaya berlangganan dan apakah ada masa uji coba?',
        a: 'Biaya disesuaikan dengan jumlah pengguna aktif dan modul yang digunakan. Kami menyediakan masa uji coba gratis untuk sekolah yang ingin melihat dan merasakan secara langsung bagaimana Lumiverse School bekerja sebelum berkomitmen jangka panjang. Hubungi tim kami untuk penawaran yang sesuai.',
    },
    // {
    //     q: 'Apakah tersedia dukungan teknis jika terjadi kendala?',
    //     a: 'Tim support kami tersedia melalui WhatsApp, email, dan panduan dokumentasi lengkap. Untuk isu krusial seperti pelaksanaan ujian, kami menyediakan jalur prioritas agar kendala dapat ditangani secepat mungkin.',
    // },
]

const openIndex = ref(-1)
// const openIndex = ref(0)

function toggle(i) {
    openIndex.value = openIndex.value === i ? -1 : i
}
</script>

<template>
    <section class="faq-section" id="faq" aria-labelledby="faq-title">
        <div class="container">
            <div class="faq-layout">
                <!-- Left: intro + contact -->
                <div class="faq-intro reveal">
                    <div class="section-eyebrow">Pertanyaan Umum</div>
                    <h2 class="section-title" id="faq-title">
                        Masih ada yang<br>
                        <span class="text-cyan">ingin ditanyakan?</span>
                    </h2>
                    <p class="section-desc">
                        Temukan jawaban atas pertanyaan yang paling sering diajukan sebelum menggunakan Lumiverse
                        School.
                    </p>

                    <div class="contact-card sm:flex hidden">
                        <div class="contact-icon">💬</div>
                        <div class="contact-text">
                            <div class="contact-title">Belum menemukan jawabannya?</div>
                            <div class="contact-sub">Tim kami siap membantu Anda secara langsung melalui
                                WhatsApp.</div>
                        </div>
                        <a href="https://wa.me/6281234567890" class="contact-btn" target="_blank" rel="noopener">
                            Hubungi Kami
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Right: accordion -->
                <div class="faq-list reveal">
                    <div v-for="(item, i) in faqs" :key="item.q" class="faq-item"
                        :class="{ 'faq-item--open': openIndex === i }" :style="{ '--i': i }">
                        <button class="faq-question" type="button" :aria-expanded="openIndex === i" @click="toggle(i)">
                            <span class="faq-index sm:inline-flex hidden">{{ String(i + 1).padStart(2, '0') }}</span>
                            <span class="faq-question-text">{{ item.q }}</span>
                            <span class="faq-toggle" aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <path d="M5 12h14M12 5v14" class="plus-v" />
                                </svg>
                            </span>
                        </button>
                        <div class="faq-answer-wrap">
                            <div class="faq-answer-inner">
                                <p class="faq-answer">{{ item.a }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="contact-card flex sm:hidden">
                    <div class="contact-icon">💬</div>
                    <div class="contact-text">
                        <div class="contact-title">Belum menemukan jawabannya?</div>
                        <div class="contact-sub">Tim kami siap membantu Anda secara langsung melalui
                            WhatsApp.
                        </div>
                    </div>
                    <a href="https://wa.me/6281234567890" class="contact-btn" target="_blank" rel="noopener">
                        Hubungi Kami
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.faq-section {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

.faq-layout {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 5rem;
    align-items: start;
}

/* ── Left: intro ─────────────────────────────────────── */
.faq-intro {
    position: sticky;
    top: 6rem;
}

.section-eyebrow {
    display: inline-block;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--cyan);
    margin-bottom: 0.75rem;
}

.section-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.7rem, 3.2vw, 2.4rem);
    line-height: 1.3;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
}

.text-cyan {
    color: var(--cyan);
}

.section-desc {
    font-size: 1rem;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 2.25rem;
}

.contact-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 1.5rem;
    flex-direction: column;
    gap: 0.85rem;
    align-items: flex-start;
    transition: border-color 0.3s;
}

.contact-card:hover {
    border-color: rgba(52, 211, 153, 0.3);
}

.contact-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(52, 211, 153, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
}

.contact-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 0.2rem;
}

.contact-sub {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.5;
}

.contact-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.85rem;
    color: #05080f;
    background: linear-gradient(135deg, #34d399, #059669);
    padding: 0.6rem 1.1rem;
    border-radius: 10px;
    margin-top: 0.25rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.contact-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(52, 211, 153, 0.3);
}

.contact-btn svg {
    transition: transform 0.2s;
}

.contact-btn:hover svg {
    transform: translateX(2px);
}

/* ── Right: accordion ─────────────────────────────────── */
.faq-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.faq-item {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.3s;
    animation: faq-fade-in 0.5s ease backwards;
    animation-delay: calc(var(--i) * 0.06s);
}

@keyframes faq-fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .faq-item {
        animation: none;
    }
}

.faq-item--open {
    border-color: rgba(0, 212, 255, 0.3);
}

.faq-question {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: none;
    border: none;
    text-align: left;
    padding: 1.25rem 1.5rem;
    cursor: pointer;
    color: var(--white);
}

.faq-index {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--cyan);
    opacity: 0.7;
    flex-shrink: 0;
    padding-top: 0.1rem;
}

.faq-question-text {
    flex: 1;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.98rem;
    line-height: 1.5;
}

.faq-toggle {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.04);
    color: var(--muted);
    transition: background 0.3s, color 0.3s, transform 0.3s;
}

.faq-item--open .faq-toggle {
    background: rgba(0, 212, 255, 0.12);
    color: var(--cyan);
    transform: rotate(135deg);
}

.plus-v {
    transition: opacity 0.2s;
}

/* Smooth height animation via grid trick */
.faq-answer-wrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s ease;
}

.faq-item--open .faq-answer-wrap {
    grid-template-rows: 1fr;
}

.faq-answer-inner {
    overflow: hidden;
}

.faq-answer {
    padding: 0 1.5rem 1.5rem 3.25rem;
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.75;
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 1024px) {
    .faq-layout {
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .faq-intro {
        position: static;
    }
}

@media (max-width: 640px) {
    .section-desc {
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 1rem;
    }

    .faq-section {
        padding: 5rem 0;
    }

    .faq-list {
        margin-top: -2rem;
    }

    .faq-question {
        padding: 1.1rem 1.1rem;
        gap: 0.75rem;
    }

    .faq-answer {
        padding: 0 1.1rem 1.25rem 1.25rem;
    }
}
</style>