<script setup>
import { Head, Link } from '@inertiajs/vue3'
import PartnerHomeLayout from '@/Layouts/PartnerHomeLayout.vue'
import FaqSection from '@/Components/Partner/FaqSection.vue'
import { LinkIcon, BuildingLibraryIcon, BanknotesIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '@/Composables/useTheme'

defineOptions({
    layout: PartnerHomeLayout,
})

// Pakai composable yang sama dengan Navbar — bukan paksa 'dark' lagi,
// supaya preferensi user (localStorage / prefers-color-scheme) tetap dihormati
// dan sinkron di semua halaman.
const { initTheme } = useTheme()
initTheme()
</script>

<template>

    <Head>
        <title>Lumiverse Partner Program</title>
        <meta head-key="description" name="description"
            content="Gabung jadi partner Lumiverse. Dapatkan komisi dari setiap sekolah / lembaga yang berhasil kamu referensikan menggunakan platform LMS Lumiverse." />
        <meta head-key="og:type" property="og:type" content="website" />
        <meta head-key="og:site_name" property="og:site_name" content="Lumiverse Partner" />
        <meta head-key="og:url" property="og:url" content="https://partner.lumiverse.co.id/" />
        <meta head-key="og:title" property="og:title" content="Lumiverse Partner Program" />
        <meta head-key="og:description" property="og:description"
            content="Program referral Lumiverse — ajak sekolah & lembaga pendidikan bergabung, dapatkan komisi otomatis dari setiap langganan yang berhasil terkonversi." />
        <link head-key="canonical" rel="canonical" href="https://partner.lumiverse.co.id/" />
    </Head>

    <main class="partner-page">
        <!-- ═══ Hero ═══ -->
        <section class="hero">
            <div class="hero-glow" aria-hidden="true"></div>

            <div class="hero-inner">
                <p class="eyebrow reveal" style="--d:0">Program Kemitraan Lumiverse School</p>
                <h1 class="hero-title reveal" style="--d:1">
                    Setiap Sekolah yang Kamu Ajak,<br class="title-break" />
                    Jadi Penghasilanmu.
                </h1>
                <p class="hero-sub reveal" style="--d:2">
                    Bagikan kode referral ke sekolah, pesantren, atau lembaga pendidikan
                    yang kamu kenal. Setiap kali mereka berlangganan Lumiverse, komisinya
                    masuk otomatis ke rekening saldo kamu secara berulang (recurring).
                </p>

                <div class="hero-actions reveal" style="--d:3">
                    <Link :href="route('partner.register')" class="btn-primary" prefetch>Daftar Program Partner</Link>
                    <Link :href="route('partner.login')" class="btn-ghost" prefetch>Masuk ke Akun</Link>
                </div>

                <ul class="trust-strip reveal" style="--d:4">
                    <li>Tanpa biaya pendaftaran</li>
                    <li>Komisi cair otomatis ke rekening bank</li>
                    <li>Kode referral unik milikmu sendiri</li>
                </ul>
            </div>
        </section>

        <!-- ═══ Cara Kerja ═══ -->
        <section class="flow-section">
            <p class="section-eyebrow w-full flex text-center">Cara kerja</p>
            <h2 class="section-title">Tiga langkah, tanpa ribet.</h2>

            <div class="flow-track">
                <div class="flow-step">
                    <span class="flow-index">01</span>
                    <div class="flow-icon">
                        <LinkIcon />
                    </div>
                    <h3>Bagikan kode referral</h3>
                    <p>Kirim kode unikmu lewat WhatsApp, media sosial, atau langsung ke kontak sekolah.</p>
                </div>

                <div class="flow-line" aria-hidden="true"></div>

                <div class="flow-step">
                    <span class="flow-index">02</span>
                    <div class="flow-icon">
                        <BuildingLibraryIcon />
                    </div>
                    <h3>Sekolah berlangganan</h3>
                    <p>Mereka daftar pakai kode kamu dan memilih paket Lumiverse yang sesuai kebutuhan.</p>
                </div>

                <div class="flow-line" aria-hidden="true"></div>

                <div class="flow-step">
                    <span class="flow-index">03</span>
                    <div class="flow-icon">
                        <BanknotesIcon />
                    </div>
                    <h3>Komisi otomatis cair</h3>
                    <p>Saldo komisi masuk ke akunmu, tinggal tarik kapan saja ke rekening pribadi.</p>
                </div>
            </div>
        </section>

        <!-- ═══ Tangga Komisi (signature element) ═══ -->
        <section class="ladder-section">
            <p class="section-eyebrow w-full flex text-center">Skema komisi</p>
            <h2 class="section-title">Makin banyak referral, makin tinggi persentasenya.</h2>
            <p class="section-sub">
                Persentase komisi naik otomatis berdasarkan urutan sekolah ke berapa yang
                berhasil kamu referensikan — dihitung sejak partner pertama kali bergabung.
            </p>

            <div class="ladder">
                <div class="ladder-bar ladder-bar--1">
                    <span class="ladder-percent">10%</span>
                    <div class="ladder-fill"></div>
                    <span class="ladder-range">Referral ke-1 – 3</span>
                </div>

                <div class="ladder-bar ladder-bar--2">
                    <span class="ladder-percent">15%</span>
                    <div class="ladder-fill"></div>
                    <span class="ladder-range">Referral ke-4 – 6</span>
                </div>

                <div class="ladder-bar ladder-bar--3">
                    <span class="ladder-percent">20%</span>
                    <div class="ladder-fill"></div>
                    <span class="ladder-range">Referral ke-7 – 10</span>
                </div>

                <div class="ladder-bar ladder-bar--4">
                    <span class="ladder-badge sm:flex hidden">Tertinggi</span>
                    <span class="ladder-percent">25%</span>
                    <div class="ladder-fill"></div>
                    <span class="ladder-range">Referral ke-11 & Seterusnya</span>
                </div>
            </div>
        </section>

        <FaqSection />

        <!-- ═══ CTA akhir ═══ -->
        <section class="cta-band">
            <h2>Siap mulai menghasilkan dari jaringanmu?</h2>
            <p>Pendaftaran cuma butuh waktu beberapa menit, kode referral langsung aktif setelah itu.</p>
            <Link :href="route('partner.register')" class="btn-primary btn-primary--lg mx-auto" prefetch>Gabung Sekarang
            </Link>
        </section>
    </main>
</template>

<style scoped>
.partner-page {
    background: var(--midnight);
    color: var(--white);
    overflow-x: hidden;
}

/* ═══════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════ */
.hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rem 1.5rem 4rem;
}

.hero-glow {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 900px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.14) 0%, rgba(0, 212, 255, 0) 60%);
    pointer-events: none;
}

.hero-inner {
    position: relative;
    max-width: 1420px;
    text-align: center;
    z-index: 1;
}

.eyebrow {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--cyan);
    margin-bottom: 1.1rem;
}

.hero-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2.1rem, 5vw, 3.25rem);
    line-height: 1.12;
    letter-spacing: -0.01em;
    margin-bottom: 1.35rem;
}

.hero-sub {
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.7;
    max-width: 540px;
    margin: 0 auto 2.25rem;
}

.hero-actions {
    display: flex;
    justify-content: center;
    gap: 0.85rem;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
}

.btn-primary {
    max-width: 16rem !important;
    padding: 0.8rem 1.6rem;
    border-radius: 10px;
    background: var(--cyan);
    color: var(--midnight);
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    transition: transform 0.15s ease, opacity 0.15s ease;
}

.btn-primary:hover {
    transform: translateY(-1px);
    opacity: 0.9;
}

.btn-primary:focus-visible,
.btn-ghost:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 3px;
}

.btn-ghost {
    padding: 0.8rem 1.6rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    color: var(--white);
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    transition: border-color 0.15s ease;
}

.btn-ghost:hover {
    border-color: var(--cyan);
}

.trust-strip {
    list-style: none;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem 1.75rem;
    padding: 0;
    margin: 0;
    font-size: 0.82rem;
    color: var(--muted);
}

.trust-strip li {
    position: relative;
    padding-left: 1.2rem;
}

.trust-strip li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.42rem;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--cyan);
}

/* Hero entrance — one orchestrated moment, staggered by --d */
.reveal {
    animation: reveal-up 0.6s ease both;
    animation-delay: calc(var(--d) * 0.09s);
}

@keyframes reveal-up {
    from {
        opacity: 0;
        transform: translateY(14px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .reveal {
        animation: none;
    }
}

/* ═══════════════════════════════════════════════════════════
   Shared section heading
   ═══════════════════════════════════════════════════════════ */
.section-eyebrow {
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--cyan);
    text-align: center;
    margin-bottom: 0.75rem;
}

.section-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(1.5rem, 3vw, 2rem);
    text-align: center;
    margin: 0 auto 0.85rem;
    line-height: 1.25;
}

.section-sub {
    text-align: center;
    color: var(--muted);
    font-size: 0.94rem;
    max-width: 520px;
    margin: 0 auto 3rem;
    line-height: 1.65;
}

/* ═══════════════════════════════════════════════════════════
   Cara Kerja — flow
   ═══════════════════════════════════════════════════════════ */
.flow-section {
    padding: 5rem 1.5rem;
    border-top: 1px solid var(--border);
}

.flow-track {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr;
    align-items: start;
    gap: 0 1rem;
}

.flow-step {
    text-align: center;
    padding: 0 0.5rem;
}

.flow-index {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--muted);
    letter-spacing: 0.1em;
    margin-bottom: 0.9rem;
}

.flow-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(0, 212, 255, 0.08);
    border: 1px solid rgba(0, 212, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.1rem;
    color: var(--cyan);
}

.flow-icon svg {
    width: 24px;
    height: 24px;
}

.flow-step h3 {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
}

.flow-step p {
    color: var(--muted);
    font-size: 0.86rem;
    line-height: 1.6;
}

.flow-line {
    align-self: center;
    height: 1px;
    width: 100%;
    min-width: 32px;
    margin-top: 26px;
    background: repeating-linear-gradient(90deg, var(--border) 0 6px, transparent 6px 12px);
}

/* ═══════════════════════════════════════════════════════════
   Tangga Komisi — signature element
   ═══════════════════════════════════════════════════════════ */
.ladder-section {
    padding: 5rem 1.5rem 6rem;
    border-top: 1px solid var(--border);
}

.ladder {
    max-width: 1220px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: end;
    gap: 1rem;
}

.ladder-bar {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
}

.ladder-percent {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.6rem;
    color: var(--white);
}

.ladder-fill {
    width: 100%;
    border-radius: 12px 12px 4px 4px;
    background: linear-gradient(180deg, rgba(0, 212, 255, 0.22), rgba(0, 212, 255, 0.06));
    border: 1px solid rgba(0, 212, 255, 0.25);
}

.ladder-bar--1 .ladder-fill {
    height: 90px;
}

.ladder-bar--2 .ladder-fill {
    height: 130px;
}

.ladder-bar--3 .ladder-fill {
    height: 175px;
    /* background: linear-gradient(180deg, rgba(245, 166, 35, 0.28), rgba(245, 166, 35, 0.06));
    border-color: rgba(245, 166, 35, 0.4);
    box-shadow: 0 0 40px rgba(245, 166, 35, 0.15); */
}

.ladder-bar--4 .ladder-fill {
    height: 200px;
    background: linear-gradient(180deg, rgba(245, 166, 35, 0.28), rgba(245, 166, 35, 0.06));
    border-color: rgba(245, 166, 35, 0.4);
    box-shadow: 0 0 40px rgba(245, 166, 35, 0.15);
}

.ladder-bar--4 .ladder-percent {
    color: var(--gold);
}

.ladder-badge {
    position: absolute;
    top: -1.75rem;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--gold);
    background: rgba(245, 166, 35, 0.12);
    border: 1px solid rgba(245, 166, 35, 0.3);
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
}

.ladder-range {
    font-size: 0.78rem;
    color: var(--muted);
    text-align: center;
}

/* ═══════════════════════════════════════════════════════════
   CTA akhir
   ═══════════════════════════════════════════════════════════ */
.cta-band {
    text-align: center;
    padding: 5rem 1.5rem 6rem;
    border-top: 1px solid var(--border);
}

.cta-band h2 {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    margin-bottom: 0.6rem;
}

.cta-band p {
    color: var(--muted);
    font-size: 0.95rem;
    margin-bottom: 1.75rem;
}

.btn-primary--lg {
    padding: 0.95rem 2.2rem;
    font-size: 1rem;
}

/* ═══════════════════════════════════════════════════════════
   Responsive — Mobile (<=780px)
   ═══════════════════════════════════════════════════════════ */
@media (max-width: 780px) {

    /* ── Hero ── */
    .hero {
        min-height: auto;
        padding: 7rem 1.25rem 3rem;
    }

    .hero-glow {
        width: 560px;
        height: 560px;
        top: -8%;
    }

    /* Biarkan judul mengalir natural, jangan paksa patah baris di layar sempit */
    .title-break {
        display: none;
    }

    .hero-sub {
        font-size: 0.95rem;
        max-width: 100%;
    }

    .hero-actions {
        flex-direction: column;
        width: 100%;
        gap: 0.7rem;
        margin-bottom: 2rem;
    }

    .hero-actions .btn-primary,
    .hero-actions .btn-ghost {
        width: 100%;
        max-width: none !important;
    }

    .trust-strip {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.6rem;
        padding-left: 0.1rem;
    }

    /* ── Cara Kerja ── */
    .flow-section {
        padding: 3.5rem 1.25rem;
    }

    .section-title {
        font-size: 1.35rem;
        padding: 0 0.25rem;
    }

    .section-sub {
        padding: 0 0.25rem;
        margin-bottom: 2.25rem;
    }

    .flow-track {
        grid-template-columns: 1fr;
        gap: 2.25rem 0;
    }

    .flow-line {
        display: none;
    }

    /* ── Tangga Komisi: jadi card, bukan bar tipis ── */
    .ladder-section {
        padding: 3.5rem 1.25rem 4rem;
    }

    .ladder {
        grid-template-columns: 1fr;
        gap: 1rem;
        max-width: 380px;
    }

    .ladder-bar {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 1rem 1.1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border);
        border-radius: 14px;
    }

    .ladder-bar--4 {
        border-color: rgba(245, 166, 35, 0.35);
    }

    .ladder-fill {
        order: 2;
        width: 56px;
        height: 40px !important;
        border-radius: 10px;
        flex-shrink: 0;
    }

    .ladder-range {
        text-align: left;
    }

    .ladder-badge {
        top: -0.65rem;
        right: 1rem;
    }

    /* ── CTA akhir ── */
    .cta-band {
        padding: 3.5rem 1.25rem 4rem;
    }

    .cta-band .btn-primary--lg {
        width: 100%;
        max-width: none;
    }
}
</style>