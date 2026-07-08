<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const current = computed(() => testimonials[activeIndex.value]);

const sectionRef = ref(null);
const isVisible = ref(false);
const activeIndex = ref(0);
let autoplayInterval;

const testimonials = [
    {
        name: 'Andhika Alamsyah',
        role: 'Software Engineer',
        company: 'Gojek',
        batch: 'Lulusan 2022',
        quote: 'SMK Nusantara benar-benar mengubah hidup saya. Kurikulum yang selaras dengan industri membuat saya langsung siap kerja setelah lulus. Kini saya berkarier di Gojek sebagai Software Engineer.',
        avatar: 'AA',
        color: '#C9A84C',
    },
    {
        name: 'Shela Juliana Putri',
        role: 'Digital Marketing Manager',
        company: 'Tokopedia',
        batch: 'Lulusan 2017',
        quote: 'Program Bisnis Retail di sini jauh melampaui ekspektasi saya. Praktik langsung di mitra industri nyata memberi pengalaman yang tidak bisa didapatkan di tempat lain.',
        avatar: 'SJ',
        color: '#A8882A',
    },
    {
        name: 'Ardhito Pratama',
        role: 'Network Administrator',
        company: 'Telkom Indonesia',
        batch: 'Lulusan 2023',
        quote: 'Fasilitas lab OTKP yang lengkap dan instruktur berpengalaman membuat saya menguasai bidang ini dengan cepat. Terima kasih SMK Nusantara!',
        avatar: 'SD',
        color: '#C9A84C',
    },
    {
        name: 'Muhammad Rivaldi',
        role: 'Content Creator',
        company: '1.2M Followers',
        batch: 'Lulusan 2020',
        quote: 'Jurusan MP di sini memberikan fondasi kreatif dan teknis yang kuat. Saya bisa membangun karier sebagai kreator konten dengan percaya diri.',
        avatar: 'MR',
        color: '#D4B55B',
    },
];

const goTo = (i) => {
    activeIndex.value = i;
    resetAutoplay();
};

const prev = () => {
    activeIndex.value = (activeIndex.value - 1 + testimonials.length) % testimonials.length;
    resetAutoplay();
};

const next = () => {
    activeIndex.value = (activeIndex.value + 1) % testimonials.length;
    resetAutoplay();
};

const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(next, 5000);
};

let observer;
onMounted(() => {
    observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) isVisible.value = true;
    }, { threshold: 0.15 });
    if (sectionRef.value) observer.observe(sectionRef.value);
    autoplayInterval = setInterval(next, 5000);
});
onUnmounted(() => {
    observer?.disconnect();
    clearInterval(autoplayInterval);
});
</script>

<template>
    <section id="testimonials" class="relative py-28 px-8 bg-navy-950 overflow-hidden" ref="sectionRef">
        <!-- Background -->
        <div class="absolute inset-0 pointer-events-none"
            style="background: radial-gradient(ellipse 70% 50% at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 50%, rgba(26,58,107,0.25) 0%, transparent 60%);">
        </div>

        <div class="max-w-[900px] mx-auto">

            <!-- Header -->
            <div class="text-center mb-14 transition-all duration-700 ease-out"
                :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
                <span class="section-label justify-center before:hidden">Suara Alumni</span>
                <h2 class="section-title-light">
                    Mereka yang Telah <span class="text-gold-gradient">Membuktikan</span>
                </h2>
            </div>

            <!-- Carousel -->
            <div class="relative border border-[rgba(201,168,76,0.12)] bg-[rgba(11,30,61,0.4)] px-12 pt-14 pb-10 mb-8 transition-all duration-700 ease-out delay-150"
                :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">

                <!-- Decorative quote mark -->
                <div
                    class="absolute sm:top-4 top-2 sm:left-8 left-4 font-display text-[7rem] leading-none text-[rgba(201,168,76,0.1)] pointer-events-none select-none">
                    "
                </div>

                <!-- Slides -->
                <div class="relative">
                    <transition name="testi-fade" mode="out-in">
                        <div :key="activeIndex">

                            <!-- Quote -->
                            <p
                                class="font-display text-[clamp(1.05rem,2.5vw,1.3rem)] font-medium italic leading-[1.75] text-white/75 mt-4 mb-8 min-h-[100px]">
                                {{ current.quote }}
                            </p>

                            <!-- Person -->
                            <div class="flex items-center gap-4">

                                <!-- Avatar -->
                                <div class="w-[52px] h-[52px] shrink-0 sm:flex hidden items-center justify-center font-display text-base font-bold"
                                    :style="`background: linear-gradient(135deg, ${current.color}, rgba(201,168,76,0.3)); border: 1.5px solid $color: var(--navy-900); clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);`">
                                    {{ current.avatar }}
                                </div>

                                <!-- Info -->
                                <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                                    <span class="text-sm font-bold text-white tracking-wide truncate">
                                        {{ current.name }}
                                    </span>
                                    <span class="text-xs text-[#C9A84C] font-medium">
                                        {{ current.role }} · {{ current.company }}
                                    </span>
                                    <span class="text-[0.65rem] text-white/30 tracking-widest uppercase">
                                        {{ current.batch }}
                                    </span>
                                </div>

                                <!-- Stars -->
                                <div class="shrink-0 text-[#C9A84C] tracking-widest text-sm">
                                    ★★★★★
                                </div>

                            </div>

                        </div>
                    </transition>
                </div>

                <!-- Controls -->
                <div class="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)]">
                    <button
                        class="w-9 h-9 border border-[rgba(201,168,76,0.3)] bg-transparent text-gold-500 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold-500"
                        @click="prev" aria-label="Previous">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M11 4l-5 5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>

                    <div class="flex gap-[6px]">
                        <button v-for="(_, i) in testimonials" :key="i"
                            class="h-[2px] border-none cursor-pointer p-0 transition-all duration-300" :class="i === activeIndex
                                ? 'w-8 bg-gold-500'
                                : 'w-5 bg-[rgba(201,168,76,0.2)]'" @click="goTo(i)">
                        </button>
                    </div>

                    <button
                        class="w-9 h-9 border border-[rgba(201,168,76,0.3)] bg-transparent text-gold-500 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold-500"
                        @click="next" aria-label="Next">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M7 4l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Thumbnail nav -->
            <div class="sm:flex hidden gap-3 justify-center flex-wrap transition-all duration-700 ease-out delay-[250ms]"
                :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'">
                <button v-for="(t, i) in testimonials" :key="i"
                    class="flex items-center gap-2 px-[0.875rem] py-2 bg-transparent border cursor-pointer transition-all duration-300"
                    :class="i === activeIndex
                        ? 'opacity-100 bg-[rgba(201,168,76,0.05)]'
                        : 'opacity-45 border-[rgba(255,255,255,0.06)] hover:opacity-80'"
                    :style="i === activeIndex ? `border-color: ${t.color};` : ''" @click="goTo(i)">
                    <!-- Thumb avatar -->
                    <span class="w-6 h-6 flex items-center justify-center text-[0.6rem] font-bold flex-shrink-0"
                        :style="`background: linear-gradient(135deg, ${t.color}, rgba(201,168,76,0.2)); color: var(--navy-900);`">
                        {{ t.avatar }}
                    </span>
                    <!-- Thumb name -->
                    <span class="text-[0.72rem] font-semibold tracking-[0.04em] whitespace-nowrap"
                        :class="i === activeIndex ? 'text-white' : 'text-[rgba(255,255,255,0.6)]'">
                        {{ t.name }}
                    </span>
                </button>
            </div>

        </div>
    </section>
</template>

<style scoped>
/* Slide transition — tetap di sini karena tidak bisa pakai Tailwind untuk keyframe transition Vue */
.testi-fade-enter-active,
.testi-fade-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.testi-fade-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.testi-fade-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

@media (max-width: 640px) {
    section {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }

    /* Carousel padding mobile */
    .relative.border {
        padding: 2.5rem 1.5rem 2rem;
    }

    /* Hide thumbs on mobile */
    .testi-thumbs-wrap {
        display: none;
    }
}
</style>