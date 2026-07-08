<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePage } from '@inertiajs/vue3'

const page = usePage()

const profil = computed(() => page.props.profilSekolah ?? {})

const sectionRef = ref(null);
const isVisible = ref(false);

const values = computed(() => [
    {
        icon: '◈',
        title: 'Visi Kami',
        desc: profil.value.visi ?? '-'
    },
    {
        icon: '◉',
        title: 'Misi Kami',
        desc: profil.value.misi ?? '-'
    },
    {
        icon: '◇',
        title: 'Nilai Kami',
        desc: 'Integritas, Inovasi, dan Kolaborasi menjadi fondasi kami dalam membentuk generasi penerus yang unggul dan berkarakter.'
    },
])

let observer;
onMounted(() => {
    observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) isVisible.value = true; }, { threshold: 0.15 });
    if (sectionRef.value) observer.observe(sectionRef.value);
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
    <section id="about" class="about" ref="sectionRef">
        <!-- BG texture -->
        <div class="about-bg">
            <div class="bg-lines"></div>
        </div>

        <div class="about-inner">
            <!-- Left: Text -->
            <div :class="['about-text', { visible: isVisible }]">
                <span class="section-label">Tentang Kami</span>

                <h2 class="section-title-light">
                    Mendidik dengan Hati
                    <span class="text-gold-gradient">Mengembangkan Skill Standar Industri</span>
                </h2>

                <p class="about-lead">
                    18 Tahun berdiri sejak tahun 2009, SMK Nusantara telah menjadi
                    pilihan utama keluarga Indonesia yang ingin anaknya memiliki keahlian
                    nyata dan masa depan cerah.
                </p>

                <p class="about-body">
                    Kami percaya pendidikan vokasi bukan sekadar transfer ilmu — ini tentang
                    membentuk karakter, mengasah keterampilan, dan membuka pintu karier.
                    Setiap program kami dirancang bersama mitra industri terkemuka agar
                    relevan dengan kebutuhan dunia kerja masa kini dan mendatang.
                </p>

                <!-- Accreditation badge -->
                <div class="accred-badges">
                    <!-- <div class="badge-item">
                        <div class="badge-letter">🏛</div>
                        <div class="badge-info">
                            <span class="bi-label">Nomor Statistik</span>
                            <span class="bi-value">402020213175</span>
                        </div>
                    </div> -->
                    <div class="badge-divider"></div>
                    <div class="badge-item">
                        <div class="badge-letter">B</div>
                        <div class="badge-info">
                            <span class="bi-label">Akreditasi</span>
                            <span class="bi-value">Terakreditasi - B</span>
                        </div>
                    </div>
                    <div class="badge-divider"></div>
                    <div class="badge-item">
                        <div class="badge-letter">★</div>
                        <div class="badge-info">
                            <span class="bi-label">Program Penghargaan</span>
                            <span class="bi-value">SMK Pusat Keunggulan Tahun 2025</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Values cards -->
            <div class="about-cards">
                <div v-for="(v, i) in values" :key="i" :class="['value-card', { visible: isVisible }]"
                    :style="`--delay: ${i * 0.15}s`">
                    <div class="vc-icon">{{ v.icon }}</div>
                    <div class="vc-content">
                        <h3 class="vc-title">{{ v.title }}</h3>
                        <p class="vc-desc">{{ v.desc }}</p>
                    </div>
                    <!-- Hover glow line -->
                    <div class="vc-glow"></div>
                </div>

                <!-- decorative element -->
                <div class="about-deco">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="90" stroke="rgba(201,168,76,0.08)" stroke-width="1" />
                        <circle cx="100" cy="100" r="65" stroke="rgba(201,168,76,0.06)" stroke-width="1"
                            stroke-dasharray="4 6" />
                        <circle cx="100" cy="100" r="40" stroke="rgba(201,168,76,0.1)" stroke-width="1.5" />
                        <circle cx="100" cy="100" r="6" fill="rgba(201,168,76,0.3)" />
                        <line x1="100" y1="10" x2="100" y2="60" stroke="rgba(201,168,76,0.2)" stroke-width="1" />
                        <line x1="100" y1="140" x2="100" y2="190" stroke="rgba(201,168,76,0.2)" stroke-width="1" />
                        <line x1="10" y1="100" x2="60" y2="100" stroke="rgba(201,168,76,0.2)" stroke-width="1" />
                        <line x1="140" y1="100" x2="190" y2="100" stroke="rgba(201,168,76,0.2)" stroke-width="1" />
                    </svg>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.about {
    position: relative;
    padding: 7rem 2rem;
    background: var(--navy-900);
    overflow: hidden;
}

.about-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.bg-lines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(-45deg,
            transparent,
            transparent 60px,
            rgba(201, 168, 76, 0.02) 60px,
            rgba(201, 168, 76, 0.02) 61px);
}

.about-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
}

/* Text side */
.about-text {
    opacity: 0;
    transform: translateX(-40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.about-text.visible {
    opacity: 1;
    transform: translateX(0);
}

.about-lead {
    font-size: 1.1rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.8);
    margin: 1.5rem 0 1rem;
    font-weight: 400;
}

.about-body {
    font-size: 0.95rem;
    line-height: 1.85;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 2.5rem;
}

/* Accreditation */
.accred-badges {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.25rem 1.5rem;
    background: rgba(201, 168, 76, 0.04);
    border: 1px solid rgba(201, 168, 76, 0.12);
    border-left: 3px solid var(--gold-500);
}

.badge-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.badge-letter {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(201, 168, 76, 0.15);
    border: 1px solid rgba(201, 168, 76, 0.3);
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--gold-400);
    flex-shrink: 0;
}

.badge-info {
    display: flex;
    flex-direction: column;
}

.bi-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
}

.bi-value {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
}

.badge-divider {
    width: 1px;
    height: 36px;
    background: rgba(201, 168, 76, 0.15);
}

/* Cards side */
.about-cards {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.value-card {
    position: relative;
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    padding: 1.5rem;
    background: rgba(11, 30, 61, 0.5);
    border: 1px solid rgba(201, 168, 76, 0.1);
    transition: all 0.4s ease, opacity 0.7s ease var(--delay), transform 0.7s ease var(--delay);
    overflow: hidden;
    cursor: default;
    opacity: 0;
    transform: translateX(40px);
}

.value-card.visible {
    opacity: 1;
    transform: translateX(0);
}

.value-card:hover {
    border-color: rgba(201, 168, 76, 0.3);
    background: rgba(11, 30, 61, 0.8);
    transform: translateX(-4px);
}

.value-card:hover .vc-glow {
    opacity: 1;
}

.vc-glow {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, transparent, var(--gold-500), transparent);
    opacity: 0;
    transition: opacity 0.3s;
}

.vc-icon {
    font-size: 1.5rem;
    color: var(--gold-500);
    flex-shrink: 0;
    margin-top: 2px;
    filter: drop-shadow(0 0 8px rgba(201, 168, 76, 0.4));
}

.vc-title {
    font-family: var(--font-display);
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 0.4rem;
}

.vc-desc {
    font-size: 0.875rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.5);
}

/* Deco circle */
.about-deco {
    position: absolute;
    bottom: -80px;
    right: -80px;
    width: 200px;
    height: 200px;
    pointer-events: none;
    animation: rotateSlow 30s linear infinite;
}

@keyframes rotateSlow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 900px) {
    .about-inner {
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .accred-badges {
        flex-wrap: wrap;
        gap: 1rem;
    }

    .badge-divider {
        display: none;
    }
}
</style>