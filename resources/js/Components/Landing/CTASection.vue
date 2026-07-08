<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const sectionRef = ref(null);
const isVisible = ref(false);

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

let observer;
onMounted(() => {
    observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) isVisible.value = true;
    }, { threshold: 0.2 });
    if (sectionRef.value) observer.observe(sectionRef.value);
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
    <section id="spmb" class="cta-section" ref="sectionRef">
        <!-- Grid bg -->
        <div class="cta-grid"></div>

        <!-- Diagonal line accents -->
        <div class="cta-line cta-line-1"></div>
        <div class="cta-line cta-line-2"></div>

        <!-- Glow -->
        <div class="cta-glow"></div>

        <div class="cta-inner" :class="{ visible: isVisible }">
            <!-- Badge -->
            <div class="cta-badge">
                <span class="badge-pulse"></span>
                Pendaftaran 2025/2026 Dibuka
            </div>

            <h2 class="cta-title">
                Siap Wujudkan<br>
                <span class="cta-title-gold">Masa Depanmu?</span>
            </h2>

            <p class="cta-desc">
                Bergabunglah dengan ribuan alumni sukses SMK Nusantara.
                Kuota terbatas — segera daftarkan dirimu sebelum kehabisan.
            </p>

            <!-- Urgency strip -->
            <div class="cta-urgency">
                <div class="urgency-item">
                    <span class="urgency-num">120</span>
                    <span class="urgency-label">Kuota tersisa</span>
                </div>
                <div class="urgency-sep"></div>
                <div class="urgency-item">
                    <span class="urgency-num">2</span>
                    <span class="urgency-label">Program Unggulan</span>
                </div>
                <div class="urgency-sep"></div>
                <div class="urgency-item">
                    <span class="urgency-num">Gratis</span>
                    <span class="urgency-label">Biaya pendaftaran</span>
                </div>
            </div>

            <!-- Actions -->
            <div class="cta-actions">
                <button class="btn-gold-solid cta-btn-primary" @click="scrollTo('contact')">
                    Daftar Sekarang
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
                <button class="btn-outline-gold" @click="scrollTo('programs')">
                    Lihat Program
                </button>
            </div>

            <!-- Trust badges -->
            <div class="trust-row">
                <span class="trust-item">✓ Sertifikasi Pusat Keunggulan</span>
                <span class="trust-item">✓ Kurikulum Nasional</span>
                <span class="trust-item">✓ Terakreditasi B</span>
                <span class="trust-item">✓ Sertifikasi Industri</span>
            </div>
        </div>
    </section>
</template>

<style scoped>
.cta-section {
    position: relative;
    padding: 7rem 2rem;
    background: var(--navy-800);
    overflow: hidden;
}

.cta-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(201, 168, 76, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201, 168, 76, 0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}

.cta-line {
    position: absolute;
    height: 1px;
    width: 60%;
    background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.25), transparent);
    pointer-events: none;
}

.cta-line-1 {
    top: 0;
    left: 20%;
}

.cta-line-2 {
    bottom: 0;
    left: 20%;
}

.cta-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(201, 168, 76, 0.06) 0%, transparent 70%);
    pointer-events: none;
}

.cta-inner {
    position: relative;
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s ease;
}

.cta-inner.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Badge */
.cta-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(201, 168, 76, 0.08);
    border: 1px solid rgba(201, 168, 76, 0.25);
    padding: 0.45rem 1.25rem;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--gold-400);
    margin-bottom: 2rem;
    text-transform: uppercase;
}

.badge-pulse {
    width: 7px;
    height: 7px;
    background: var(--gold-500);
    border-radius: 50%;
    animation: ctaPulse 2s ease-in-out infinite;
    flex-shrink: 0;
}

@keyframes ctaPulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.4);
    }

    50% {
        box-shadow: 0 0 0 6px rgba(201, 168, 76, 0);
    }
}

/* Title */
.cta-title {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 600;
    line-height: 1.15;
    color: var(--white);
    margin-bottom: 1.25rem;
}

.cta-title-gold {
    background: linear-gradient(135deg, var(--gold-500), var(--gold-300));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-style: italic;
}

/* Desc */
.cta-desc {
    font-size: 1rem;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.5);
    max-width: 500px;
    margin: 0 auto 2.5rem;
}

/* Urgency strip */
.cta-urgency {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2.5rem;
    padding: 1.5rem 2rem;
    background: rgba(5, 14, 31, 0.6);
    border: 1px solid rgba(201, 168, 76, 0.1);
    flex-wrap: wrap;
}

.urgency-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.urgency-num {
    font-family: var(--font-display);
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--gold-400);
    line-height: 1;
}

.urgency-label {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.35);
}

.urgency-sep {
    width: 1px;
    height: 40px;
    background: rgba(201, 168, 76, 0.15);
}

/* Actions */
.cta-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.cta-btn-primary {
    font-size: 0.85rem;
    padding: 1rem 2.5rem;
}

/* Trust */
.trust-row {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
}

.trust-item {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
}

@media (max-width: 480px) {
    .urgency-sep {
        display: none;
    }

    .cta-urgency {
        gap: 1.5rem;
    }
}
</style>