<script setup>
const values = [
    { icon: '⚡', title: 'Performance Matters', desc: 'Dengan struktur sistem micro engine terpisah. Setiap fitur dirancang agar tetap cepat, responsif, dan stabil. Terutama pada bagian-bagian paling krusial yang membutuhkan performa dan stabilitas yang sangat baik untuk digunakan oleh jutaan pengguna secara bersamaan dan dapat memberikan pengalaman yang lebih mengesankan.' },
    { icon: '🚀', title: 'Fast by Default', desc: 'Pengalaman yang cepat bukan fitur tambahan, tetapi standar kualitas produk. Kami menghilangkan proses manual yang tidak perlu dan membuang waktu.' },
    { icon: '🤖', title: 'Automate Everything', desc: 'Setiap proses yang dapat diotomatisasi akan kami sederhanakan agar pengguna dapat fokus pada hal yang lebih bermakna.' },
    { icon: '🎯', title: 'Built for Simplicity', desc: 'Teknologi yang kompleks kami sembunyikan di balik pengalaman pengguna yang sederhana dan mudah dipahami.' },
    { icon: '🔒', title: 'Security by Design', desc: 'Dengan provisioning isolation system, setiap keamanan dan privasi data lembaga dapat terisolasi secara terpisah dan aman.' },
    { icon: '✨', title: 'Thoughtful Experience', desc: 'Kami percaya pengalaman pengguna yang baik lebih penting daripada daftar fitur yang panjang namun tidak optimal.' },
    { icon: '🔄', title: 'Continuous Improvement', desc: 'Kami terus mendengarkan masukan pengguna, untuk menghadirkan pembaruan yang lebih bermakna.' },
    { icon: '❤️', title: 'Built with Passion', desc: 'Kami membangun Lumiverse School sebagai produk yang terus berkembang dengan visi dan misi yang panjang, bukan sekadar proyek digital yang selesai setelah diluncurkan.' },
]
</script>

<template>
    <section id="about" class="about-section" aria-labelledby="about-title">
        <div class="ambient" aria-hidden="true">
            <div class="orb orb--cyan"></div>
            <div class="orb orb--violet"></div>
        </div>

        <div class="container">
            <div class="section-header reveal">
                <span class="section-eyebrow">Prinsip & Nilai Kami</span>
                <h2 class="section-title" id="about-title">
                    Nilai yang membentuk <span class="text-gradient">setiap langkah</span> kami
                </h2>
                <p class="section-lede">
                    Delapan prinsip yang kami pegang dalam membangun Lumiverse School<br class="br-desktop">
                    bukan sekadar slogan tetapi cara kami bekerja setiap hari.
                </p>
            </div>

            <!-- ── Desktop: Bento cards ─────────────────────────── -->
            <div class="values-bento">
                <div v-for="(val, i) in values" :key="`bento-${val.title}`" class="value-card reveal" :class="`v-${i}`"
                    :style="`transition-delay: ${i * 0.08}s`">
                    <span class="value-glow" aria-hidden="true"></span>
                    <div class="value-icon">{{ val.icon }}</div>
                    <h3 class="value-title">{{ val.title }}</h3>
                    <p class="value-desc">{{ val.desc }}</p>
                </div>
            </div>

            <!-- ── Mobile: Timeline ─────────────────────────────── -->
            <div class="timeline" role="list">
                <div v-for="(val, i) in values" :key="`tl-${val.title}`" class="timeline-item reveal"
                    :class="{ 'timeline-item--right': i % 2 !== 0 }" :style="`transition-delay: ${i * 0.1}s`"
                    role="listitem">
                    <!-- <div class="timeline-icon" aria-hidden="true"> {{ val.title }}</div> -->
                    <h4 class="timeline-title">{{ val.title }}</h4>
                    <div class="timeline-connector" aria-hidden="true">
                        <div class="timeline-dot"></div>
                        <div class="timeline-line"></div>
                    </div>
                    <div class="timeline-content">
                        <!-- <h4 class="timeline-title">{{ val.title }}</h4> -->
                        <p class="timeline-desc">{{ val.desc }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* ── Section wrapper ─────────────────────────────────── */
.about-section {
    position: relative;
    padding: 8rem 0;
    overflow: hidden;
    z-index: 1;
}

/* ── Ambient background ──────────────────────────────── */
.ambient {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
}

.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.16;
    animation: float 18s ease-in-out infinite;
}

.orb--cyan {
    width: 480px;
    height: 480px;
    top: -10%;
    left: -8%;
    background: radial-gradient(circle, var(--cyan), transparent 70%);
}

.orb--violet {
    width: 420px;
    height: 420px;
    bottom: -12%;
    right: -6%;
    background: radial-gradient(circle, #a78bfa, transparent 70%);
    animation-delay: -9s;
}

@keyframes float {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    50% {
        transform: translate(3%, -4%) scale(1.06);
    }
}

@media (prefers-reduced-motion: reduce) {
    .orb {
        animation: none;
    }
}

/* ── Header (shared) ──────────────────────────────────── */
.section-header {
    max-width: 640px;
    margin: 0 auto 4.5rem;
    text-align: center;
}

.section-eyebrow {
    display: inline-block;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--cyan);
    margin-bottom: 1rem;
}

.section-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(1.7rem, 4vw, 2.75rem);
    line-height: 1.25;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
}

.text-gradient {
    background: linear-gradient(135deg, var(--cyan), #7dd3fc 60%, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-lede {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--muted);
}

.br-desktop {
    display: none;
}

@media (min-width: 769px) {
    .br-desktop {
        display: inline;
    }
}

/* ══════════════════════════════════════════════════════
   DESKTOP — Bento grid (visible ≥ 769px)
   ══════════════════════════════════════════════════════ */
.values-bento {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: dense;
    gap: 1.25rem;
}

.value-card {
    position: relative;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem 1.75rem;
    overflow: hidden;
    transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
    display: flex;
    flex-direction: column;
}

.value-card.v-0 {
    grid-column: span 2;
    grid-row: span 2;
    padding: 2.5rem;
    justify-content: center;
}

.value-card.v-0 .value-icon {
    font-size: 2.75rem;
}

.value-card.v-0 .value-title {
    font-size: 1.4rem;
}

.value-card.v-0 .value-desc {
    font-size: 0.98rem;
}

.value-card.v-7 {
    grid-column: span 2;
}

.value-glow {
    position: absolute;
    inset: -1px;
    border-radius: 20px;
    padding: 1px;
    background: conic-gradient(from 180deg, var(--cyan), #a78bfa, var(--gold), var(--cyan));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
}

.value-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.value-card:hover .value-glow {
    opacity: 1;
}

.value-icon {
    font-size: 1.9rem;
    margin-bottom: 1.1rem;
    filter: drop-shadow(0 0 12px rgba(0, 212, 255, 0.15));
}

.value-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: -0.01em;
    margin-bottom: 0.6rem;
}

.value-desc {
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.7;
}

@media (max-width: 1024px) {
    .values-bento {
        grid-template-columns: repeat(2, 1fr);
    }

    .value-card.v-0,
    .value-card.v-7 {
        grid-column: span 2;
    }

    .value-card.v-0 {
        grid-row: span 1;
    }
}

/* Hide bento on mobile */
@media (max-width: 768px) {
    .values-bento {
        display: none;
    }
}

/* ══════════════════════════════════════════════════════
   MOBILE — Timeline (visible ≤ 768px)
   ══════════════════════════════════════════════════════ */
.timeline {
    display: none;
    position: relative;
    flex-direction: column;
    gap: 0;
}

@media (max-width: 768px) {
    .timeline {
        display: flex;
    }
}

.timeline::before {
    content: '';
    position: absolute;
    left: 7.5px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border) 10%, var(--border) 90%, transparent);
}

.timeline-item {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: auto auto;
    align-items: start;
    padding: 1.5rem 0;
}

.timeline-item .timeline-icon {
    grid-column: 2;
    grid-row: 1;
    text-align: left;
    padding: 0 0 0.25rem 1.5rem;
    font-size: 1.5rem;
    line-height: 1;
}

.timeline-item .timeline-connector {
    grid-column: 1;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 0.2rem;
    position: relative;
    z-index: 1;
}

.timeline-item .timeline-content {
    grid-column: 2;
    grid-row: 2;
    padding: 0;
    text-align: left;
}

.timeline-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--midnight);
    border: 2px solid var(--cyan);
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.4);
    flex-shrink: 0;
    margin-top: 0.2rem;
    transition: all 0.3s;
}

.timeline-item:hover .timeline-dot {
    background: var(--cyan);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
    transform: scale(1.2);
}

.timeline-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
}

.timeline-desc {
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.65;
}

@media (max-width: 640px) {
    .about-section {
        padding: 6rem 0;
    }

    .container {
        padding: 0 1rem;
    }

    .orb {
        opacity: 0.1;
    }
}
</style>