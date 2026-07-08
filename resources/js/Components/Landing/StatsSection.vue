<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const sectionRef = ref(null);
const isVisible = ref(false);
const counters = ref([0, 0, 0, 0]);

const stats = [
    { num: 18, suffix: '+', label: 'Tahun Berdiri', desc: 'Pengalaman mendidik generasi unggul', icon: '🏛️' },
    { num: 5000, suffix: '+', label: 'Alumni Tersebar', desc: 'Di seluruh Indonesia & mancanegara', icon: '🌏' },
    { num: 99, suffix: '%', label: 'Tingkat Kelulusan', desc: 'Konsisten setiap tahun ajaran', icon: '🏆' },
    { num: 200, suffix: '+', label: 'Mitra Industri', desc: 'Siap menyerap lulusan kami', icon: '🤝' },
];

let observer;
let animationFrames = [];

const animateCounter = (index, target) => {
    const duration = 2000;
    const start = performance.now();
    const step = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        counters.value[index] = Math.round(eased * target);
        if (progress < 1) {
            animationFrames[index] = requestAnimationFrame(step);
        }
    };
    animationFrames[index] = requestAnimationFrame(step);
};

onMounted(() => {
    observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
            isVisible.value = true;
            stats.forEach((s, i) => setTimeout(() => animateCounter(i, s.num), i * 150));
        }
    }, { threshold: 0.2 });
    if (sectionRef.value) observer.observe(sectionRef.value);
});
onUnmounted(() => {
    observer?.disconnect();
    animationFrames.forEach(f => cancelAnimationFrame(f));
});
</script>

<template>
    <section id="stats" class="stats-section" ref="sectionRef">
        <div class="stats-glow"></div>
        <div class="stats-line-top"></div>

        <div class="stats-inner">
            <div class="stats-label-wrap" :class="{ visible: isVisible }">
                <span class="section-label">Pencapaian Kami</span>
            </div>

            <div class="stats-grid">
                <div v-for="(s, i) in stats" :key="i" class="stat-card" :class="{ visible: isVisible }"
                    :style="`--delay: ${i * 0.1}s`">
                    <div class="stat-icon">{{ s.icon }}</div>
                    <div class="stat-number">
                        <span class="stat-num">{{ counters[i].toLocaleString('id-ID') }}</span>
                        <span class="stat-suffix">{{ s.suffix }}</span>
                    </div>
                    <div class="stat-label">{{ s.label }}</div>
                    <div class="stat-desc">{{ s.desc }}</div>
                    <div class="stat-bar"></div>
                </div>
            </div>
        </div>

        <div class="stats-line-bottom"></div>
    </section>
</template>

<style scoped>
.stats-section {
    position: relative;
    padding: 6rem 2rem;
    background: var(--navy-900);
    overflow: hidden;
}

.stats-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(201, 168, 76, 0.05) 0%, transparent 70%);
    pointer-events: none;
}

.stats-line-top,
.stats-line-bottom {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.2), transparent);
}

.stats-line-top {
    top: 0;
}

.stats-line-bottom {
    bottom: 0;
}

.stats-inner {
    max-width: 1280px;
    margin: 0 auto;
}

.stats-label-wrap {
    text-align: center;
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
}

.stats-label-wrap.visible {
    opacity: 1;
    transform: translateY(0);
}

.stats-label-wrap .section-label {
    justify-content: center;
}

.stats-label-wrap .section-label::before {
    display: none;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(201, 168, 76, 0.06);
    border: 1px solid rgba(201, 168, 76, 0.06);
}

.stat-card {
    position: relative;
    padding: 2.5rem 2rem;
    background: var(--navy-900);
    text-align: center;
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease var(--delay), transform 0.6s ease var(--delay), background 0.3s;
}

.stat-card.visible {
    opacity: 1;
    transform: translateY(0);
}

.stat-card:hover {
    background: rgba(11, 30, 61, 0.9);
}

.stat-card:hover .stat-bar {
    width: 100%;
}

.stat-icon {
    font-size: 1.75rem;
    margin-bottom: 1rem;
    filter: grayscale(0.3);
}

.stat-number {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 2px;
    margin-bottom: 0.4rem;
}

.stat-num {
    font-family: var(--font-display);
    font-size: 3.2rem;
    font-weight: 700;
    color: var(--gold-400);
    line-height: 1;
}

.stat-suffix {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 700;
    color: var(--gold-500);
}

.stat-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--white);
    margin-bottom: 0.5rem;
}

.stat-desc {
    font-size: 0.78rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.35);
}

.stat-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background: linear-gradient(90deg, var(--gold-500), var(--gold-300));
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 900px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>