<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
    <section class="cta-section" id="cta" aria-labelledby="cta-title">
        <div class="container">
            <div class="cta-box reveal">
                <h2 class="cta-title" id="cta-title">
                    Siap transformasi<br>
                    <span class="gradient-text">bersama kami?</span>
                </h2>
                <p class="cta-desc">
                    Pendaftaran gratis. Tanpa kartu kredit. Setup mudah dalam 5 menit.
                </p>
                <div class="cta-actions">
                    <Link href="/registration" class="btn-hero">
                        Mulai Gratis Sekarang →
                    </Link>
                    <!-- <a href="https://wa.me/628987504976" class="btn-outline" target="_blank" rel="noopener noreferrer">
                        💬 Chat via WhatsApp
                    </a> -->
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.cta-section {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

.cta-box {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(245, 166, 35, 0.04));
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 28px;
    padding: 5rem 3rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta-box::before {
    content: '';
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(0, 212, 255, 0.12), transparent 70%);
    pointer-events: none;
}

.cta-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
    position: relative;
}

.gradient-text {
    background: linear-gradient(135deg, var(--cyan), #7dd3fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.cta-desc {
    font-size: 1.1rem;
    color: var(--muted);
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.5;
    position: relative;
}

.cta-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    position: relative;
}

@media (max-width: 768px) {
    .container {
        padding: 0 0.75rem;
    }

    .cta-section {
        padding: 2rem 0;
    }

    .cta-box {
        padding: 3rem 1.5rem;
    }
}
</style>