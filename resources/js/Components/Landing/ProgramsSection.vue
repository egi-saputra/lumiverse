<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const sectionRef = ref(null);
const isVisible = ref(false);
const activeCard = ref(0);
const selectedProgram = ref(null);
const activeTab = ref('profil');

const programs = [
    {
        code: 'MPLB',
        title: 'MANAJEMEN PERKANTORAN DAN LAYANAN BISNIS',
        subtitle: 'OFFICE MANAGEMENT (MPLB)',
        icon: '⌨',
        color: '#C9A84C',
        desc: 'Program Keahlian Manajemen dan Layanan Bisnis (MPLB) SMK Nusantara Kabupaten Bogor menerapkan Konsentrasi Keahlian Manajemen Perkantoran yang berfokus pada keterampilan mengelola layanan administrasi dan tata kelola perkantoran.',
        skills: ['Junior Administrative', 'Sekretaris Junior', 'Office Administrative Staff', 'Front Desk Officer', 'Admin Online'],
        career: ['Junior Administrative', 'Sekretaris Junior', 'Office Administrative Staff', 'Front Desk Officer'],
        duration: '18 Tahun',
        seats: '120 Kursi',
        kepala: {
            nama: 'Sandi Destian, S. Pd.',
            inisial: 'SD',
            foto: null,
            jabatan: 'Kepala Program MPLB',
            pendidikan: 'S1 Manajemen Pendidikan, UNJ',
            bio: 'Bapak Sandi Destian, S. Pd telah memimpin Program MPLB selama lebih dari satu dekade dengan fokus pada pengembangan kompetensi digital-office dan sertifikasi BNSP.',
            stats: [
                { nilai: '12 Thn', label: 'Pengalaman' },
                { nilai: '480+', label: 'Lulusan' },
                { nilai: '8', label: 'Mitra Industri' },
            ],
            pesan: 'Dunia administrasi modern bukan lagi soal meja dan kertas. Ia adalah tentang kemampuan mengelola informasi, berkomunikasi dengan presisi, dan berkolaborasi lintas tim.',
        },
    },
    {
        code: 'BR',
        title: 'BISNIS RETAIL DAN PEMASARAN',
        subtitle: 'Retail Business (BR)',
        icon: '⬡',
        color: '#A8882A',
        desc: 'Pelajari infrastruktur bisnis, strategi pemasaran, digitalisasi bidang pemasaran. Fondasi dunia bisnis dan strategi marketing yang efisien untuk mencetak wirausahawan muda.',
        skills: ['Retail Business', 'Digital Marketing', 'Relationship', 'Public Speaking'],
        career: ['CEO', 'Enterpreneur', 'Super Visor', 'Cashier', 'Influencer', 'Sales Marketing', 'Wirausaha'],
        duration: '18 Tahun',
        seats: '90 Kursi',
        kepala: {
            nama: 'Andini Alawiyah, S. Pd',
            inisial: 'AA',
            foto: null,
            jabatan: 'Kepala Program BR',
            pendidikan: 'S1 Bisnis Manajemen, UNESA',
            bio: 'Ibu Andini Alawiyah, S. Pd merupakan praktisi bisnis berpengalaman yang bergabung sebagai kepala program setelah 8 tahun berkarier di industri retail nasional.',
            stats: [
                { nilai: '9 Thn', label: 'Pengalaman' },
                { nilai: '360+', label: 'Lulusan' },
                { nilai: '6', label: 'Mitra Industri' },
            ],
            pesan: 'Bisnis yang sukses dimulai dari memahami pelanggan. Di sinilah kalian akan belajar bukan hanya cara menjual, tapi cara membangun relasi dan menciptakan nilai.',
        },
    },
];

function openModal(program) {
    selectedProgram.value = program;
    activeTab.value = 'profil';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    selectedProgram.value = null;
    document.body.style.overflow = '';
}

function handleOverlayClick(e) {
    if (e.target === e.currentTarget) closeModal();
}

function handleKeydown(e) {
    if (e.key === 'Escape') closeModal();
}

let observer;
onMounted(() => {
    observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) isVisible.value = true; }, { threshold: 0.1 });
    if (sectionRef.value) observer.observe(sectionRef.value);
    window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
    observer?.disconnect();
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
});
</script>

<template>
    <section id="programs" class="relative py-28 px-8 bg-[#030B18] overflow-hidden" ref="sectionRef">

        <!-- Background -->
        <div class="absolute inset-0 pointer-events-none"
            style="background: radial-gradient(ellipse 60% 40% at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(26,58,107,0.3) 0%, transparent 60%);">
        </div>

        <div class="max-w-[1280px] mx-auto">

            <!-- Header -->
            <div class="text-center max-w-[580px] mx-auto mb-16 transition-all duration-700 ease-out"
                :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
                <span class="section-label justify-center before:hidden">Program Keahlian</span>
                <h2 class="section-title-light">
                    Pilih Jurusan <span class="text-gold-gradient">Impianmu</span>
                </h2>
                <p class="mt-4 text-[0.95rem] leading-[1.7] text-white/45">
                    Program unggulan yang dirancang bersama beberapa mitra industri untuk memastikan
                    kamu lulus dengan keahlian yang langsung bisa diaplikasikan.
                </p>
            </div>

            <!-- Program grid -->
            <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.08)]">
                <div v-for="(p, i) in programs" :key="p.code"
                    class="relative p-7 pb-10 bg-[#030B18] overflow-hidden cursor-pointer transition-all duration-700 ease-out group"
                    :class="[
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                        activeCard === i ? 'bg-[rgba(11,30,61,0.95)] z-10' : ''
                    ]"
                    :style="`--delay: ${i * 0.12}s; --accent: ${p.color}; transition-delay: ${isVisible ? i * 0.12 : 0}s`"
                    @mouseenter="activeCard = i" @mouseleave="activeCard = 0" @click="openModal(p)" tabindex="0"
                    @keydown.enter="openModal(p)">

                    <!-- Glow bg -->
                    <div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style="background: radial-gradient(circle at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%);">
                    </div>

                    <!-- Bottom line -->
                    <div class="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        :style="`background: linear-gradient(90deg, ${p.color}, transparent)`">
                    </div>

                    <!-- Top row -->
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl" :style="`color: ${p.color}`">{{ p.icon }}</span>
                            <span class="font-display text-[1.8rem] font-bold leading-none"
                                :style="`color: ${p.color}`">
                                {{ p.code }}
                            </span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[0.65rem] font-bold tracking-[0.08em] uppercase text-white/30">{{
                                p.duration }}</span>
                            <span class="text-white/20 text-sm">·</span>
                            <span class="text-[0.65rem] font-bold tracking-[0.08em] uppercase text-white/30">{{ p.seats
                                }}</span>
                        </div>
                    </div>

                    <!-- Title -->
                    <div class="mb-4">
                        <h3 class="font-display text-[1.2rem] font-semibold text-white leading-[1.3] mb-1">{{ p.title }}
                        </h3>
                        <p class="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-white/30">{{ p.subtitle
                            }}</p>
                    </div>

                    <p class="text-[0.85rem] leading-[1.7] text-white/50 mb-6">{{ p.desc }}</p>

                    <!-- Skills -->
                    <div class="flex flex-wrap gap-1.5 mb-6">
                        <span v-for="s in p.skills" :key="s"
                            class="text-[0.65rem] font-semibold tracking-[0.06em] px-2.5 py-1 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] text-white/60 transition-all duration-300"
                            :class="activeCard === i ? 'border-[rgba(201,168,76,0.3)] text-white/80' : ''">
                            {{ s }}
                        </span>
                    </div>

                    <!-- Career -->
                    <div class="text-[0.75rem] text-white/35 leading-[1.6] mb-6">
                        <span class="text-[0.65rem] font-bold tracking-[0.08em] uppercase mr-1.5"
                            :style="`color: ${p.color}`">Karier:</span>
                        <span v-for="(c, ci) in p.career" :key="c" class="text-white/50">
                            {{ c }}<span v-if="ci < p.career.length - 1" class="mr-1">,</span>
                        </span>
                    </div>

                    <!-- Kaprodi hint -->
                    <div class="flex items-center gap-2 pt-4 border-t border-[rgba(201,168,76,0.1)] transition-colors duration-300"
                        :class="activeCard === i ? 'border-[rgba(201,168,76,0.2)]' : ''">
                        <span
                            class="w-6 h-6 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] text-[0.55rem] font-bold flex items-center justify-center shrink-0"
                            :style="`color: ${p.color}`">
                            {{ p.kepala.inisial }}
                        </span>
                        <span class="text-[0.7rem] font-semibold tracking-[0.06em] text-[rgba(201,168,76,0.6)]">Lihat
                            Kepala Program</span>
                        <span
                            class="ml-auto text-[0.75rem] text-[rgba(201,168,76,0.4)] transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <!-- ─── Modal ─── -->
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="selectedProgram"
                class="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center backdrop-blur-md bg-black/80 sm:p-6 p-0"
                @click="handleOverlayClick" role="dialog" aria-modal="true">

                <Transition name="modal-slide">
                    <div v-if="selectedProgram" class="relative w-full sm:max-w-[540px] bg-[#07152b] border border-[rgba(201,168,76,0.2)] flex flex-col
                               sm:rounded-sm
                               max-h-[100vh] sm:max-h-[90vh]" :style="`--accent: ${selectedProgram.color}`">

                        <!-- Mobile drag handle -->
                        <!-- <div class="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                            <div class="w-10 h-1 rounded-full bg-white/20"></div>
                        </div> -->

                        <!-- Top decorative band -->
                        <div
                            class="flex items-center gap-4 px-6 py-3.5 bg-[rgba(201,168,76,0.04)] border-b border-[rgba(201,168,76,0.1)] shrink-0">
                            <div class="flex-1 h-px bg-[rgba(201,168,76,0.2)]"></div>
                            <span class="font-display text-[0.6rem] font-bold tracking-[0.3em] uppercase"
                                :style="`color: ${selectedProgram.color}`">
                                {{ selectedProgram.code }}
                            </span>
                            <div class="flex-1 h-px bg-[rgba(201,168,76,0.2)]"></div>
                        </div>

                        <!-- Close button -->
                        <!-- <button
                            class="absolute top-20 right-3 sm:top-14 bg-none border-none text-white/30 text-base cursor-pointer px-1.5 py-0.5 leading-none z-10 hover:text-white/80 transition-colors"
                            @click="closeModal" aria-label="Tutup">✕</button> -->

                        <!-- Header: avatar + identity -->
                        <div
                            class="flex flex-col sm:flex-row items-center sm:items-start gap-5 px-6 pt-5 pb-4 shrink-0">
                            <!-- Avatar -->
                            <div class="shrink-0">
                                <div
                                    class="w-20 h-20 rounded-full border border-[rgba(201,168,76,0.4)] p-[3px] bg-[rgba(201,168,76,0.05)]">
                                    <img v-if="selectedProgram.kepala.foto" :src="selectedProgram.kepala.foto"
                                        :alt="selectedProgram.kepala.nama"
                                        class="w-full h-full rounded-full object-cover block" />
                                    <div v-else
                                        class="w-full h-full rounded-full bg-[rgba(201,168,76,0.1)] flex items-center justify-center font-display text-2xl font-bold"
                                        :style="`color: ${selectedProgram.color}`">
                                        {{ selectedProgram.kepala.inisial }}
                                    </div>
                                </div>
                            </div>

                            <!-- Identity -->
                            <div class="flex-1 text-center sm:text-left pt-0 sm:pt-1">
                                <p class="text-[0.6rem] font-bold tracking-[0.12em] uppercase mb-1.5 opacity-70"
                                    :style="`color: ${selectedProgram.color}`">
                                    Kepala Program Keahlian
                                </p>
                                <h3 class="font-display text-[1.05rem] font-semibold text-white leading-[1.3] mb-1">
                                    {{ selectedProgram.kepala.nama }}
                                </h3>
                                <p class="text-[0.7rem] text-white/35 mb-2">{{ selectedProgram.kepala.pendidikan }}</p>
                                <span
                                    class="text-[0.6rem] font-bold tracking-[0.06em] uppercase text-white/25 bg-[rgba(201,168,76,0.07)] border border-[rgba(201,168,76,0.12)] px-2.5 py-1 inline-block">
                                    {{ selectedProgram.title }}
                                </span>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="grid grid-cols-3 border-t border-b border-white/[0.04] shrink-0">
                            <div v-for="(s, si) in selectedProgram.kepala.stats" :key="s.label"
                                class="flex flex-col items-center py-3 px-2"
                                :class="si < selectedProgram.kepala.stats.length - 1 ? 'border-r border-white/[0.04]' : ''">
                                <span class="font-display text-base font-bold"
                                    :style="`color: ${selectedProgram.color}`">
                                    {{ s.nilai }}
                                </span>
                                <span class="text-[0.55rem] tracking-[0.08em] uppercase text-white/25 mt-0.5">
                                    {{ s.label }}
                                </span>
                            </div>
                        </div>

                        <!-- Tabs -->
                        <div class="flex border-b border-white/[0.06] px-6 shrink-0">
                            <button v-for="tab in ['profil', 'pesan']" :key="tab"
                                class="bg-none border-none py-2.5 mr-6 text-[0.7rem] font-bold tracking-[0.08em] uppercase cursor-pointer border-b-2 -mb-px transition-all duration-200"
                                :class="activeTab === tab
                                    ? 'border-b-[var(--accent)] text-[var(--accent)]'
                                    : 'border-b-transparent text-white/30 hover:text-white/50'"
                                @click="activeTab = tab">
                                {{ tab === 'profil' ? 'Profil Singkat' : 'Pesan Singkat' }}
                            </button>
                        </div>

                        <!-- Tab body — scrollable -->
                        <div class="overflow-y-auto flex-1">
                            <Transition name="tab-fade" mode="out-in">

                                <!-- Profil tab -->
                                <div v-if="activeTab === 'profil'" key="profil" class="px-6 py-5">
                                    <p class="text-[0.83rem] leading-[1.8] text-white/50 mb-5">
                                        {{ selectedProgram.kepala.bio }}
                                    </p>
                                    <p class="text-[0.6rem] font-bold tracking-[0.1em] uppercase text-white/25 mb-2.5">
                                        Kompetensi Program
                                    </p>
                                    <div class="flex flex-wrap gap-1.5 mb-4">
                                        <span v-for="s in selectedProgram.skills" :key="s"
                                            class="text-[0.65rem] font-semibold tracking-[0.05em] px-2.5 py-1 bg-[rgba(201,168,76,0.07)] border border-[rgba(201,168,76,0.15)] text-white/55">
                                            {{ s }}
                                        </span>
                                    </div>
                                    <div class="text-[0.75rem] text-white/35 leading-[1.7]">
                                        <span class="text-[0.6rem] font-bold tracking-[0.08em] uppercase mr-1.5"
                                            :style="`color: ${selectedProgram.color}`">Prospek Karier:</span>
                                        <span v-for="(c, ci) in selectedProgram.career" :key="c" class="text-white/45">
                                            {{ c }}<span v-if="ci < selectedProgram.career.length - 1">, </span>
                                        </span>
                                    </div>
                                </div>

                                <!-- Pesan tab -->
                                <div v-else key="pesan" class="px-6 py-5 flex flex-col justify-center">
                                    <div
                                        class="bg-[rgba(201,168,76,0.04)] border-l-2 border-[rgba(201,168,76,0.3)] px-5 py-5 mb-4">
                                        <span
                                            class="block font-serif text-[3.5rem] leading-[0.8] text-[rgba(201,168,76,0.12)] select-none mb-[-0.5rem]">"</span>
                                        <p class="text-[0.88rem] leading-[1.85] text-white/65 italic">
                                            {{ selectedProgram.kepala.pesan }}
                                        </p>
                                        <span
                                            class="block font-serif text-[3.5rem] leading-[0.8] text-[rgba(201,168,76,0.12)] select-none text-right mt-[-0.5rem]">"</span>
                                    </div>
                                    <p class="text-[0.7rem] text-[rgba(201,168,76,0.5)] text-right italic">
                                        — {{ selectedProgram.kepala.nama }}, {{ selectedProgram.kepala.jabatan }}
                                    </p>
                                </div>

                            </Transition>
                        </div>

                        <!-- Footer -->
                        <div
                            class="flex items-center justify-between gap-2.5 px-6 py-3.5 border-t border-white/[0.06] bg-black/15 shrink-0">
                            <button
                                class="bg-transparent w-full border border-white/10 text-white/40 text-[0.7rem] font-bold tracking-[0.06em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 hover:border-white/25 hover:text-white/70"
                                @click="closeModal">
                                Tutup
                            </button>
                            <button
                                class="border-none w-full text-[#07152b] text-[0.7rem] font-bold tracking-[0.06em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                                :style="`background: ${selectedProgram.color}`">
                                Daftar Sekarang
                            </button>
                        </div>

                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Vue transition — tidak bisa Tailwind */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-slide-enter-active {
    transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.modal-slide-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-slide-enter-from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
}

.modal-slide-leave-to {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
}

/* Mobile: slide up from bottom */
@media (max-width: 639px) {
    .modal-slide-enter-from {
        opacity: 1;
        transform: translateY(100%);
    }

    .modal-slide-leave-to {
        opacity: 1;
        transform: translateY(100%);
    }

    .modal-slide-enter-active {
        transition: transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
    }

    .modal-slide-leave-active {
        transition: transform 0.25s ease;
    }
}

.tab-fade-enter-active,
.tab-fade-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.tab-fade-enter-from {
    opacity: 0;
    transform: translateX(8px);
}

.tab-fade-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}
</style>