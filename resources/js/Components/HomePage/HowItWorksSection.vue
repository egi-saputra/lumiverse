<script setup>
const steps = [
    { num: '01', title: 'Daftar Akun', desc: 'Daftar gratis dengan email sekolah. Tidak perlu kartu kredit.' },
    { num: '02', title: 'Setup Sekolah', desc: 'Isi profil sekolah, import data siswa & guru via Excel atau formulir.' },
    { num: '03', title: 'Konfigurasi Kelas', desc: 'Buat mata pelajaran, jadwal, dan kurikulum sesuai kebutuhan sekolah.' },
    { num: '04', title: 'Mulai Belajar', desc: 'Platform siap digunakan. Siswa dan guru bisa langsung login hari ini.' },
]
</script>

<template>
    <section class="how-section" id="cara-kerja" aria-labelledby="how-title">
        <div class="container">
            <div class="section-header centered reveal">
                <div class="section-eyebrow">How It Works</div>
                <h2 class="section-title" id="how-title">Mulai dalam 4 langkah mudah</h2>
                <p class="section-desc">Tidak perlu keahlian teknis secara khusus. Lembaga Anda bisa langsung aktif
                    hanya dalam hitungan menit.</p>
            </div>

            <div class="steps-grid">
                <div v-for="(step, i) in steps" :key="step.num" class="step-item reveal"
                    :style="{ transitionDelay: `${i * 0.1}s` }">
                    <div class="step-num">{{ step.num }}</div>
                    <h3 class="step-title">{{ step.title }}</h3>
                    <p class="step-desc">{{ step.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.how-section {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

.steps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    position: relative;
}

.steps-grid::before {
    content: '';
    position: absolute;
    top: 60px;
    left: calc(12.5% + 20px);
    right: calc(12.5% + 20px);
    height: 1px;
    background: linear-gradient(90deg, var(--cyan), var(--gold), var(--cyan));
    opacity: 0.3;
}

.step-item {
    text-align: center;
    padding: 2rem 1rem;
}

.step-num {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: var(--navy);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.1rem;
    position: relative;
    z-index: 1;
    transition: all 0.3s;
}

.step-item:hover .step-num {
    border-color: var(--cyan);
    color: var(--cyan);
    box-shadow: 0 0 24px rgba(0, 212, 255, 0.3);
}

.step-title {
    font-family: var(--font-display);
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.step-desc {
    font-size: 0.875rem;
    color: var(--muted);
}

@media (max-width: 768px) {
    .container {
        padding: 0 0.75rem;
    }

    .section-title {
        font-size: clamp(1.45rem, 3.5vw, 2.75rem);
    }

    .section-desc {
        font-size: 0.875rem;
        line-height: 1.25;
    }

    .steps-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .steps-grid::before {
        display: none;
    }

    .step-title {
        font-weight: 600;
    }

    .step-desc {
        font-size: 0.875rem;
        line-height: 1.35;
    }
}
</style>