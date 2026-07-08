<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const mounted = ref(false);
const currentSlide = ref(0);
const prevSlide = ref(-1);
const direction = ref(1);
const isAnimating = ref(false);
const progressWidth = ref(0);
const slideReady = ref(false);   // true setelah API selesai
const autoplayDuration = 5500;
let autoplayTimer = null;
let progressRaf = null;
let progressStart = null;

// ── Slides dari API ─────────────────────────────────────────────────────
const slides = ref([]);

async function fetchSlides() {
    try {
        const res = await fetch('/api/v1/hero-slides');
        const data = await res.json();
        slides.value = data;
    } catch (e) {
        console.error('Gagal memuat hero slides:', e);
        slides.value = [];
    } finally {
        slideReady.value = true;
    }
}

// ── Computed — akses aman ke slide aktif ────────────────────────────────
const active = computed(() => slides.value[currentSlide.value] ?? null);
const prev = computed(() => prevSlide.value >= 0 ? slides.value[prevSlide.value] ?? null : null);

// ── Stats ────────────────────────────────────────────────────────────────
const stats = [
    { num: '18+', label: 'Tahun Berdiri' },
    { num: '5K+', label: 'Alumni' },
    { num: '75+', label: 'Mitra Industri' },
    { num: '99%', label: 'Kelulusan' },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

function startProgress() {
    progressWidth.value = 0;
    progressStart = performance.now();
    cancelAnimationFrame(progressRaf);
    function step(now) {
        const elapsed = now - progressStart;
        progressWidth.value = Math.min((elapsed / autoplayDuration) * 100, 100);
        if (elapsed < autoplayDuration) progressRaf = requestAnimationFrame(step);
    }
    progressRaf = requestAnimationFrame(step);
}

function goTo(index, dir = 1) {
    if (isAnimating.value || index === currentSlide.value) return;
    isAnimating.value = true;
    direction.value = dir;
    prevSlide.value = currentSlide.value;
    currentSlide.value = index;
    startProgress();
    setTimeout(() => { prevSlide.value = -1; isAnimating.value = false; }, 750);
}

function next(userTriggered = false) {
    if (!slides.value.length) return;
    goTo((currentSlide.value + 1) % slides.value.length, 1);
    if (userTriggered) resetAutoplay();
}

function prevAction() {
    if (!slides.value.length) return;
    goTo((currentSlide.value - 1 + slides.value.length) % slides.value.length, -1);
    resetAutoplay();
}

function dotClick(i) {
    const dir = i > currentSlide.value ? 1 : -1;
    goTo(i, dir);
    resetAutoplay();
}

function resetAutoplay() {
    clearTimeout(autoplayTimer);
    autoplayTimer = setTimeout(() => { next(); resetAutoplay(); }, autoplayDuration);
}

onMounted(async () => {
    await fetchSlides();
    setTimeout(() => { mounted.value = true; }, 100);
    if (slides.value.length) {
        startProgress();
        resetAutoplay();
    }
});

onUnmounted(() => {
    clearTimeout(autoplayTimer);
    cancelAnimationFrame(progressRaf);
});
</script>

<template>
    <section id="home" class="hero">

        <!-- ── Loading state ──────────────────────────────────────────── -->
        <div v-if="!slideReady" class="hero-loading">
            <div class="hero-loading-bar"></div>
        </div>

        <template v-else-if="slides.length > 0 && active">

            <!-- ── Slide BGs ─────────────────────────────────────────── -->
            <div class="slides-wrap">

                <!-- Outgoing -->
                <div v-if="prev" class="slide slide-out" :class="direction === 1 ? 'out-to-left' : 'out-to-right'"
                    :key="'p' + prevSlide">
                    <div class="slide-img" :style="`background-image:url('${prev.img}')`"></div>
                </div>

                <!-- Incoming -->
                <div class="slide slide-in" :class="direction === 1 ? 'in-from-right' : 'in-from-left'"
                    :key="'c' + currentSlide">
                    <div class="slide-img" :style="`background-image:url('${active.img}')`"></div>
                </div>


            </div>

            <!-- STATIC OVERLAY -->
            <div class="slide-ol-base"></div>
            <div class="slide-ol-grad"></div>
            <div class="slide-ol-noise"></div>

            <!-- ── Decorative ─────────────────────────────────────────── -->
            <div class="hero-grid"></div>
            <div class="hero-diag diag-1"></div>
            <div class="hero-diag diag-2"></div>

            <!-- ── Layout ─────────────────────────────────────────────── -->
            <div class="hero-layout" :class="{ mounted }">

                <!-- Left: content -->
                <div class="hero-content">

                    <div class="slide-label">
                        <!-- <span class="label-bar"></span> -->
                        <span class="label-icon">◈</span>
                        <Transition name="lbl" mode="out-in">
                            <span :key="currentSlide" class="label-text">{{ active.label }}</span>
                        </Transition>
                    </div>

                    <div class="hero-heading">
                        <Transition name="hdg" mode="out-in">
                            <div :key="currentSlide" class="heading-group">
                                <span v-for="(line, li) in active.heading" :key="li"
                                    :class="['heading-line', { 'line-gold': li === active.accent }]"
                                    :style="`--i:${li}`">{{ line }}</span>
                            </div>
                        </Transition>
                    </div>

                    <Transition name="cnt" mode="out-in">
                        <p :key="currentSlide" class="hero-sub">{{ active.sub }}</p>
                    </Transition>

                    <Transition name="cnt" mode="out-in">
                        <div :key="currentSlide + 't'" class="hero-tag">
                            <span class="tag-dot"></span>{{ active.tag }}
                        </div>
                    </Transition>

                    <!-- <div class="flex gap-3">
                        <Transition name="cnt" mode="out-in">
                            <button :key="currentSlide + 'b'" class="btn-primary-hero"
                                @click="scrollTo(active.ctaTarget)">
                                {{ active.cta }}
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </Transition>
                        <button class="btn-ghost-hero" @click="scrollTo('contact')">Daftar Sekarang</button>
                    </div> -->
                </div>

                <div
                    class="absolute bottom-10 left-4 right-4 sm:left-16 sm:right-auto sm:bottom-20 flex flex-col sm:flex-row gap-3 items-center sm:items-start justify-center sm:justify-start mx-auto">

                    <Transition name="cnt" mode="out-in">
                        <button :key="currentSlide + 'b'" class="btn-ghost-hero" @click="scrollTo(active.ctaTarget)">
                            {{ active.cta }}
                        </button>
                    </Transition>

                    <button class="btn-primary-hero" @click="scrollTo('contact')">
                        Daftar Sekarang
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>

                </div>

                <!-- Right: panel -->
                <!-- <div class="hero-panel">
                    <div class="panel-inner">
                        <div class="panel-label">Pencapaian Kami</div>
                        <div class="panel-stats">
                            <div v-for="(s, i) in stats" :key="i" class="panel-stat" :style="`--si:${i}`">
                                <span class="ps-num">{{ s.num }}</span>
                                <span class="ps-label">{{ s.label }}</span>
                                <div class="ps-line"></div>
                            </div>
                        </div>

                        <div class="hero-ctas">
                            <Transition name="cnt" mode="out-in">
                                <button :key="currentSlide + 'b'" class="btn-primary-hero"
                                    @click="scrollTo(active.ctaTarget)">
                                    {{ active.cta }}
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                            </Transition>
                            <button class="btn-ghost-hero" @click="scrollTo('contact')">Daftar Sekarang</button>
                        </div>
                    </div>
                </div> -->
            </div>

            <!-- ── Slide Controls ────────────────────────────────────── -->
            <div class="slide-controls">
                <button class="ctrl-btn" @click="prevAction" aria-label="Previous">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M11 4L6 9l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
                <div class="slide-dots">
                    <button v-for="(s, i) in slides" :key="i" :class="['dot', { active: currentSlide === i }]"
                        @click="dotClick(i)" :aria-label="`Slide ${i + 1}`">
                        <span class="dot-inner">
                            <span v-if="currentSlide === i" class="dot-progress"
                                :style="`width:${progressWidth}%`"></span>
                        </span>
                    </button>
                </div>
                <button class="ctrl-btn" @click="next(true)" aria-label="Next">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M7 4l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
                <span class="ctrl-count">
                    <span class="count-cur">{{ String(currentSlide + 1).padStart(2, '0') }}</span>
                    <span class="count-sep">/</span>
                    <span class="count-tot">{{ String(slides.length).padStart(2, '0') }}</span>
                </span>
            </div>

            <!-- ── Stats bar ─────────────────────────────────────────── -->
            <div class="stats-bar" :class="{ mounted }">
                <div class="stats-bar-inner">
                    <div v-for="(s, i) in stats" :key="i" class="sbar-item">
                        <span class="sbar-num">{{ s.num }}</span>
                        <span class="sbar-label">{{ s.label }}</span>
                    </div>
                </div>
            </div>

            <!-- ── Scroll cue ────────────────────────────────────────── -->
            <div class="scroll-cue" @click="scrollTo('about')">
                <span class="sc-text">Scroll</span>
                <div class="sc-track">
                    <div class="sc-runner"></div>
                </div>
            </div>

        </template>

        <!-- ── Empty state (API berhasil tapi slide kosong) ─────────── -->
        <div v-else-if="slideReady && slides.length === 0" class="hero-empty">
            <p>Belum ada slide yang diaktifkan!</p>
        </div>

    </section>
</template>

<style scoped>
.hero {
    position: relative;
    max-height: 100vh;
    overflow: hidden;
    background: #030d1a;
    display: flex;
    flex-direction: column;
}

/* ── Loading skeleton ─────────────────────────────────────────────────── */
.hero-loading {
    min-height: 100vh;
    background: #030d1a;
    display: flex;
    align-items: flex-end;
    padding-bottom: 4px;
}

.hero-loading-bar {
    height: 2px;
    width: 40%;
    background: linear-gradient(90deg, transparent, #C9A84C, transparent);
    animation: loadSlide 1.4s ease-in-out infinite;
}

@keyframes loadSlide {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(300%);
    }
}

.hero-empty {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.25);
    font-size: 0.85rem;
    letter-spacing: 0.08em;
}

/* ─── Slide BGs ─── */
.slides-wrap {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
}

.slide {
    position: absolute;
    inset: 0;
    will-change: transform;
    animation-duration: 750ms;
    animation-timing-function: cubic-bezier(0.77, 0, 0.18, 1);
    animation-fill-mode: both;
}

.slide-in {
    z-index: 2;
}

.slide-out {
    z-index: 1;
}

.in-from-right {
    animation-name: inFromRight;
}

.in-from-left {
    animation-name: inFromLeft;
}

.out-to-left {
    animation-name: outToLeft;
}

.out-to-right {
    animation-name: outToRight;
}

@keyframes inFromRight {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes inFromLeft {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes outToLeft {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-100%);
    }
}

@keyframes outToRight {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(100%);
    }
}

.slide-img {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    animation: kenBurns 6s ease-out forwards;
}

@keyframes kenBurns {
    from {
        transform: scale(1.05);
    }

    to {
        transform: scale(1);
    }
}

/* .slide-ol-base {
    position: absolute;
    inset: 0;
    background: rgba(2, 9, 20, 0.55);
}

.slide-ol-grad {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(90deg, rgba(2, 9, 20, 0.93) 0%, rgba(2, 9, 20, 0.52) 55%, rgba(2, 9, 20, 0.22) 100%),
        linear-gradient(to top, rgba(2, 9, 20, 0.9) 0%, transparent 40%);
} */


.slide-ol-grad {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(90deg,
            rgba(2, 9, 20, 1) 0%,
            rgba(2, 9, 20, 0.85) 25%,
            rgba(2, 9, 20, 0.65) 55%,
            rgba(2, 9, 20, 0.15) 80%,
            transparent 100%),
        linear-gradient(to top,
            rgba(2, 9, 20, 0.9) 0%,
            transparent 40%);
}

.slide-ol-noise {
    position: absolute;
    inset: 0;
    opacity: 0.35;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}

.slide-ol-base,
.slide-ol-grad,
.slide-ol-noise {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
}

/* ─── Decorative ─── */
.hero-grid {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background-image:
        linear-gradient(rgba(201, 168, 76, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201, 168, 76, 0.03) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: radial-gradient(ellipse 70% 70% at 30% 50%, black 20%, transparent 80%);
}

.hero-diag {
    position: absolute;
    z-index: 1;
    width: 1px;
    top: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent, rgba(201, 168, 76, 0.18), transparent);
    pointer-events: none;
}

.diag-1 {
    right: 42%;
    transform: skewX(-8deg);
}

.diag-2 {
    right: 38%;
    transform: skewX(-8deg);
    opacity: 0.4;
}

/* ─── Layout ─── */
.hero-layout {
    position: relative;
    z-index: 2;
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 380px;
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    padding: 0 3rem 0 4rem;
    align-items: center;
    min-height: 100vh;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s;
}

.hero-layout.mounted {
    opacity: 1;
    transform: none;
}

/* ─── Content left ─── */
.hero-content {
    padding: 7rem 0 8rem;
    display: flex;
    flex-direction: column;
}

.slide-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    min-height: 20px;
}

.label-bar {
    display: block;
    width: 24px;
    height: 2px;
    background: #C9A84C;
    flex-shrink: 0;
}

.label-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #C9A84C;
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
    filter: drop-shadow(0 0 6px rgba(201, 168, 76, 0.4));
}

.label-text {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(201, 168, 76, 0.75);
}

.hero-heading {
    margin-bottom: 1.5rem;
    /* overflow: hidden; */
}

.heading-group {
    display: flex;
    flex-direction: column;
}

.heading-line {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(3rem, 6.5vw, 5.5rem);
    font-weight: 700;
    line-height: 1;
    color: #fff;
    display: block;
    opacity: 0;
    transform: translateY(24px);
    animation: lineReveal 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: calc(var(--i) * 0.08s + 0.05s);
}

.line-gold {
    color: transparent;
    background: linear-gradient(120deg, #C9A84C 0%, #e8c96b 50%, #C9A84C 100%);
    -webkit-background-clip: text;
    background-clip: text;
    font-style: italic;
    padding-bottom: 10px;
}

@keyframes lineReveal {
    to {
        opacity: 1;
        transform: none;
    }
}

.hero-sub {
    font-size: 1rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.5);
    max-width: 680px;
    margin-bottom: 1.5rem;
}

.hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(201, 168, 76, 0.07);
    border: 1px solid rgba(201, 168, 76, 0.22);
    padding: 0.35rem 0.9rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    color: rgba(201, 168, 76, 0.8);
    margin-bottom: 2rem;
    width: fit-content;
}

.tag-dot {
    width: 6px;
    height: 6px;
    background: #C9A84C;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.4);
    }

    50% {
        box-shadow: 0 0 0 5px rgba(201, 168, 76, 0);
    }
}

.hero-ctas {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
}

.btn-primary-hero {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #C9A84C;
    color: #060f1e;
    border: none;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.7rem 1.5rem;
    cursor: pointer;
    transition: filter 0.2s, transform 0.15s;
}

.btn-primary-hero:hover {
    filter: brightness(1.12);
    transform: translateY(-1px);
}

.btn-primary-hero:active {
    transform: scale(0.97);
}

.btn-ghost-hero {
    min-width: 200px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.7rem 1.4rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-ghost-hero:hover {
    border-color: rgba(201, 168, 76, 0.3);
    color: rgba(201, 168, 76, 0.8);
}

/* ─── Slide controls ─── */
.slide-controls {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    z-index: 3;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
}

.ctrl-btn {
    width: 38px;
    height: 38px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.ctrl-btn:hover {
    border-color: rgba(201, 168, 76, 0.4);
    color: #C9A84C;
    background: rgba(201, 168, 76, 0.07);
}

.slide-dots {
    display: flex;
    gap: 8px;
}

.dot {
    background: none;
    border: none;
    padding: 4px 0;
    cursor: pointer;
}

.dot-inner {
    display: block;
    width: 32px;
    height: 2px;
    background: rgba(255, 255, 255, 0.15);
    position: relative;
    overflow: hidden;
}

.dot.active .dot-inner {
    background: rgba(201, 168, 76, 0.25);
}

.dot-progress {
    position: absolute;
    inset-y: 0;
    left: 0;
    background: #C9A84C;
    transition: width 0.1s linear;
}

.ctrl-count {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    margin-left: 0.5rem;
}

.count-cur {
    color: #C9A84C;
    font-weight: 700;
}

.count-sep {
    color: rgba(255, 255, 255, 0.2);
    margin: 0 3px;
}

.count-tot {
    color: rgba(255, 255, 255, 0.25);
}

/* ─── Right panel ─── */
.hero-panel {
    height: 100%;
    display: flex;
    align-items: stretch;
}

.panel-inner {
    width: 100%;
    background: rgba(3, 11, 22, 0.75);
    border-left: 1px solid rgba(201, 168, 76, 0.1);
    backdrop-filter: blur(12px);
    padding: 7rem 1.75rem 3rem;
    display: flex;
    flex-direction: column;
}

.panel-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(201, 168, 76, 0.5);
    margin-bottom: 1.5rem;
}

.panel-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.04);
    margin-bottom: 2rem;
}

.panel-stat {
    background: rgba(3, 11, 22, 0.8);
    padding: 1rem 0.75rem 0.9rem;
    position: relative;
    opacity: 0;
    animation: statIn 0.5s ease forwards;
    animation-delay: calc(var(--si) * 0.08s + 0.4s);
}

@keyframes statIn {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

.ps-num {
    display: block;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #C9A84C;
    line-height: 1;
    margin-bottom: 0.2rem;
}

.ps-label {
    display: block;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
}

.ps-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(201, 168, 76, 0.08);
}

/* ─── Stats bar ─── */
.stats-bar {
    position: relative;
    z-index: 2;
    border-top: 1px solid rgba(201, 168, 76, 0.1);
    background: rgba(2, 7, 18, 0.85);
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease 0.6s, transform 0.7s ease 0.6s;
    display: none;
}

.stats-bar.mounted {
    opacity: 1;
    transform: none;
}

.stats-bar-inner {
    max-width: 1440px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 0 4rem;
}

.sbar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.1rem 1rem;
    border-right: 1px solid rgba(255, 255, 255, 0.04);
}

.sbar-item:last-child {
    border-right: none;
}

.sbar-num {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #C9A84C;
}

.sbar-label {
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.28);
    margin-top: 3px;
}

/* ─── Scroll cue ─── */
.scroll-cue {
    position: absolute;
    bottom: 1rem;
    left: 2rem;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    opacity: 0.45;
    transition: opacity 0.3s;
}

.scroll-cue:hover {
    opacity: 0.9;
}

.sc-text {
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #C9A84C;
    writing-mode: vertical-rl;
}

.sc-track {
    width: 1px;
    height: 50px;
    background: rgba(201, 168, 76, 0.2);
    position: relative;
    overflow: hidden;
}

.sc-runner {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 12px;
    background: #C9A84C;
    animation: scrollRun 1.6s ease-in-out infinite;
}

@keyframes scrollRun {
    0% {
        top: -12px;
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    80% {
        opacity: 1;
    }

    100% {
        top: 100%;
        opacity: 0;
    }
}

/* ─── Vue Transitions ─── */
.lbl-enter-active {
    transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
}

.lbl-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.lbl-enter-from {
    opacity: 0;
    transform: translateX(14px);
}

.lbl-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}

.hdg-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.hdg-enter-active {
    transition: none;
}

.hdg-leave-to {
    opacity: 0;
    transform: translateX(-16px);
}

.cnt-enter-active {
    transition: opacity 0.38s ease 0.12s, transform 0.38s ease 0.12s;
}

.cnt-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.cnt-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.cnt-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

/* ─── Responsive ─── */
@media (min-width: 1024px) {
    .stats-bar {
        display: block;
    }
}

@media (max-width: 1100px) {
    .hero-layout {
        grid-template-columns: 1fr;
        padding: 0 2rem;
    }

    .hero-panel {
        display: none;
    }

    .diag-1,
    .diag-2 {
        display: none;
    }

    .slide-ol-grad {
        background:
            linear-gradient(to bottom, rgba(2, 9, 20, 0.5) 0%, rgba(2, 9, 20, 0.85) 100%),
            linear-gradient(90deg, rgba(2, 9, 20, 0.7) 0%, rgba(2, 9, 20, 0.3) 100%);
    }

    .hero-content {
        padding: 7rem 0 10rem;
    }

    .scroll-cue {
        display: none;
    }
}

@media (max-width: 600px) {
    .hero-layout {
        padding: 0 1.25rem;
    }

    .heading-line {
        font-size: clamp(2.2rem, 11vw, 3rem);
    }

    /* .hero-sub,
    .slide-label {
        display: none;
    } */

    .slide-label {
        display: none;
    }

    .hero-ctas {
        flex-direction: column;
        align-items: flex-start;
    }

    .btn-primary-hero,
    .btn-ghost-hero {
        width: 100%;
        justify-content: center;
    }

    .slide-controls {
        display: none;
    }
}
</style>