<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const testimonials = [
    {
        text: 'Sejak pakai Lumiverse, proses rekap nilai dan pembuatan rapor yang dulu butuh 2 minggu sekarang bisa selesai dalam 2 jam. Luar biasa efisiennya!',
        name: 'Aditya Dwi Anggara, M.Pd',
        role: 'Waka Kurikulum, SMK Nusantara',
        initials: 'AD',
        avatarGradient: '',
    },
    {
        text: 'Fitur pembuatan modul pelatihan dan pengembangan karyawan yang sangat membantu. Mereka sekarang jadi lebih cepat untuk mengakses modul sebagai bahan bacaan dan pembelajaran untuk perkembangan skill mereka.',
        name: 'Ade Kurniawan',
        role: 'Kepala Toko, Koperasi Desa Sejahtera',
        initials: 'AS',
        avatarGradient: 'linear-gradient(135deg,var(--gold-dim),var(--navy-light))',
    },
    {
        text: 'Sangat membantu saya untuk keperluan recruitment pegawai baru. Bisa melakukan test / psikotest terhadap karyawan baru secara daring dengan visual yang lebih modern dan futuristic.',
        name: 'Ahmad Prasetyo',
        role: 'HR Staff, PT Jala Lintas Media',
        initials: 'AP',
        avatarGradient: 'linear-gradient(135deg,#7dd3fc,var(--navy-light))',
    },
    {
        text: 'Onboarding sekolah kami hanya butuh waktu seminggu. Tim support sangat responsif menjawab pertanyaan teknis maupun non-teknis dari guru-guru kami.',
        name: 'Siti Nurhaliza, S.Pd',
        role: 'Kepala Sekolah, SMA Cendekia Bangsa',
        initials: 'SN',
        avatarGradient: 'linear-gradient(135deg,#a78bfa,var(--navy-light))',
    },
    {
        text: 'Notifikasi WhatsApp otomatis ke orang tua benar-benar mengurangi beban admin. Tidak ada lagi telepon manual satu per satu saat ada pengumuman penting.',
        name: 'Bagus Setiawan',
        role: 'Staff TU, MA Al-Hikmah',
        initials: 'BS',
        avatarGradient: 'linear-gradient(135deg,#34d399,var(--navy-light))',
    },
]

const track = ref(null)
const activeIndex = ref(0)
const perView = ref(3)
let autoplayTimer = null
let isPaused = false

// Drag/swipe state
let isDragging = false
let dragStartX = 0
let dragDelta = 0

function updatePerView() {
    const w = window.innerWidth
    perView.value = w <= 768 ? 1 : w <= 1100 ? 2 : 3
    if (activeIndex.value > maxIndex.value) {
        activeIndex.value = maxIndex.value
    }
}

const maxIndex = ref(0)
function recalcMaxIndex() {
    maxIndex.value = Math.max(0, testimonials.length - perView.value)
}

function goTo(i) {
    activeIndex.value = Math.min(Math.max(i, 0), maxIndex.value)
}

function next() {
    activeIndex.value = activeIndex.value >= maxIndex.value ? 0 : activeIndex.value + 1
}

function prev() {
    activeIndex.value = activeIndex.value <= 0 ? maxIndex.value : activeIndex.value - 1
}

function startAutoplay() {
    stopAutoplay()
    autoplayTimer = setInterval(() => {
        if (!isPaused) next()
    }, 5000)
}

function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer)
}

function onPointerDown(e) {
    isDragging = true
    dragStartX = e.touches ? e.touches[0].clientX : e.clientX
    dragDelta = 0
    isPaused = true
}

function onPointerMove(e) {
    if (!isDragging) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    dragDelta = x - dragStartX
}

function onPointerUp() {
    if (!isDragging) return
    isDragging = false
    isPaused = false
    if (dragDelta > 50) prev()
    else if (dragDelta < -50) next()
    dragDelta = 0
}

function handleResize() {
    updatePerView()
    recalcMaxIndex()
}

onMounted(() => {
    updatePerView()
    recalcMaxIndex()
    startAutoplay()
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    stopAutoplay()
    window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <section class="testimonials-section" id="testimonial" aria-labelledby="testimonials-title">
        <div class="container">
            <div class="section-header centered reveal">
                <div class="section-eyebrow">Apa kata mereka</div>
                <h2 class="section-title" id="testimonials-title">
                    Dipercaya 100+ lembaga pendidikan di Indonesia
                </h2>
            </div>

            <div class="carousel reveal" @mouseenter="isPaused = true" @mouseleave="isPaused = false">
                <button class="carousel-arrow carousel-arrow--prev" type="button" aria-label="Sebelumnya" @click="prev">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                <div class="carousel-viewport" @mousedown="onPointerDown" @mousemove="onPointerMove"
                    @mouseup="onPointerUp" @touchstart.passive="onPointerDown" @touchmove.passive="onPointerMove"
                    @touchend="onPointerUp">
                    <div ref="track" class="carousel-track" :style="{
                        transform: `translateX(calc(-${activeIndex} * (100% / ${perView})))`,
                    }">
                        <div v-for="t in testimonials" :key="t.name" class="carousel-slide"
                            :style="{ '--per-view': perView }">
                            <div class="testimonial-card">
                                <div class="testimonial-stars">★★★★★</div>
                                <p class="testimonial-text">"{{ t.text }}"</p>
                                <div class="testimonial-author">
                                    <div class="author-avatar"
                                        :style="t.avatarGradient ? { background: t.avatarGradient } : {}">
                                        {{ t.initials }}
                                    </div>
                                    <div>
                                        <div class="author-name">{{ t.name }}</div>
                                        <div class="author-role">{{ t.role }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="carousel-arrow carousel-arrow--next" type="button" aria-label="Berikutnya" @click="next">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            <div class="carousel-dots" role="tablist">
                <button v-for="i in maxIndex + 1" :key="i" class="carousel-dot"
                    :class="{ 'carousel-dot--active': activeIndex === i - 1 }" type="button"
                    :aria-label="`Ke slide ${i}`" @click="goTo(i - 1)"></button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.testimonials-section {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

/* ── Carousel shell ───────────────────────────────────── */
.carousel {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.carousel-viewport {
    flex: 1;
    overflow: hidden;
    cursor: grab;
    user-select: none;
}

.carousel-viewport:active {
    cursor: grabbing;
}

.carousel-track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
    will-change: transform;
}

/* ── Card ─────────────────────────────────────────────── */
/* ── Slide wrapper: mengatur lebar & spacing ─────────── */
.carousel-slide {
    flex: 0 0 calc(100% / var(--per-view));
    box-sizing: border-box;
    padding: 0 0.6rem;
    display: flex;
}

/* ── Card: mengisi penuh slide, tinggi seragam ───────── */
.testimonial-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
}

.testimonial-card:hover {
    border-color: rgba(0, 212, 255, 0.2);
    /* transform: translateY(-2px); */
}

.testimonial-stars {
    display: flex;
    gap: 0.2rem;
    margin-bottom: 1rem;
    color: var(--gold);
    font-size: 0.875rem;
}

.testimonial-text {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    font-style: italic;
    flex: 1;
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: auto;
}

.author-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--cyan-dim), var(--navy-light));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.9rem;
    color: var(--white);
    flex-shrink: 0;
}

.author-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.9rem;
}

.author-role {
    font-size: 0.78rem;
    color: var(--muted);
}

/* ── Arrows ───────────────────────────────────────────── */
.carousel-arrow {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--navy);
    border: 1px solid var(--border);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s;
}

.carousel-arrow:hover {
    border-color: rgba(0, 212, 255, 0.4);
    background: rgba(0, 212, 255, 0.08);
    color: var(--cyan);
}

/* ── Dots ─────────────────────────────────────────────── */
.carousel-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
}

.carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s;
}

.carousel-dot--active {
    width: 22px;
    border-radius: 4px;
    background: var(--cyan);
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 768px) {
    .container {
        padding: 0;
    }

    .carousel-arrow {
        display: none;
    }

    .testimonial-card {
        margin: 0;
        width: 100%;
    }
}
</style>