<script setup>
const features = [
    {
        icon: '📚', color: 'cyan', goldAccent: false,
        title: 'Manajemen Administrasi',
        desc: 'Kelola data siswa / karyawan, modul dan materi pembelajaran secara terstruktur, cepat dan mudah.',
    },
    {
        icon: '✏️', color: 'gold', goldAccent: false,
        title: 'Ujian Online & Bank Soal',
        desc: 'Buat berbagai soal ujian dan pelatihan mandiri dengan cepat, mudah,terorganisir dan penilaian secara otomatis.',
    },
    {
        icon: '📊', color: 'green', goldAccent: false,
        title: 'Rapor / Sertifikasi & Analitik Penilaian',
        desc: 'Generate rapor atau sertifikat digital secara otomatis. Pantau perkembangan siswa / karyawan dengan grafik analitik yang mudah dipahami.',
    },
    {
        icon: '🗓️', color: 'purple', goldAccent: false,
        title: 'Absensi Digital',
        desc: 'Catat kehadiran siswa / karyawan secara digital. Laporan absensi otomatis tersedia kapanpun dibutuhkan.',
    },
    {
        icon: '💬', color: 'rose', goldAccent: true,
        title: 'Notifikasi WhatsApp',
        desc: 'Kirim pengumuman, hasil ujian, dan informasi penting langsung ke WhatsApp orang tua siswa secara otomatis.',
    },
    {
        icon: '🔐', color: 'orange', goldAccent: false,
        title: 'Keamanan Data Terjamin',
        desc: 'Data sekolah atau perusahaan disimpan di server berstandar ISO 27001. Backup otomatis setiap hari tanpa konfigurasi tambahan.',
    },
]
</script>

<template>
    <section class="features-section" id="fitur" aria-labelledby="features-title">
        <div class="container">
            <div class="section-header centered reveal">
                <div class="section-eyebrow">fitur dan layanan kami</div>
                <h2 class="section-title" id="features-title">
                    Semua kebutuhan digitalisasi sekolah modern
                </h2>
                <p class="section-desc">
                    Dari manajemen administrasi, absensi, ujian online, psikotest, formulir hingga rapor dan sertifikat
                    digital semuanya dalam satu platform yang terintegrasi.
                </p>
            </div>

            <div class="features-grid">
                <!-- Feature Cards -->
                <div v-for="(feature, i) in features" :key="feature.title" class="feature-card reveal"
                    :class="{ 'gold-accent': feature.goldAccent }" :style="{ transitionDelay: `${i * 0.1}s` }">
                    <div class="feature-icon" :class="feature.color">{{ feature.icon }}</div>
                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <p class="feature-desc">{{ feature.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.features-section {
    padding: 6rem 0;
    position: relative;
    z-index: 1;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.feature-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
}

.feature-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.04), transparent);
    opacity: 0;
    transition: opacity 0.3s;
}

.feature-card:hover {
    border-color: rgba(0, 212, 255, 0.25);
    transform: translateY(-4px);
}

.feature-card:hover::before {
    opacity: 1;
}

.feature-card.gold-accent:hover {
    border-color: rgba(245, 166, 35, 0.3);
}

.feature-card.gold-accent::before {
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.04), transparent);
}

.feature-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
}

.feature-icon.cyan {
    background: rgba(0, 212, 255, 0.1);
}

.feature-icon.gold {
    background: rgba(245, 166, 35, 0.1);
}

.feature-icon.green {
    background: rgba(52, 211, 153, 0.1);
}

.feature-icon.purple {
    background: rgba(167, 139, 250, 0.1);
}

.feature-icon.rose {
    background: rgba(251, 113, 133, 0.1);
}

.feature-icon.orange {
    background: rgba(251, 146, 60, 0.1);
}

.feature-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.6rem;
}

.feature-desc {
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.65;
}

.feature-highlight {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
}

.feature-highlight-visual {
    background: rgba(0, 212, 255, 0.04);
    border-radius: 16px;
    padding: 2rem;
    border: 1px solid rgba(0, 212, 255, 0.1);
}

.code-block {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    line-height: 1.8;
    color: var(--muted);
    white-space: pre;
}

.code-block :deep(.kw) {
    color: #c084fc;
}

.code-block :deep(.fn) {
    color: var(--cyan);
}

.code-block :deep(.str) {
    color: #86efac;
}

.code-block :deep(.cm) {
    color: rgba(255, 255, 255, 0.3);
}

.code-block :deep(.num) {
    color: var(--gold);
}

.link-api {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--cyan);
}

@media (max-width: 1024px) {
    .features-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .feature-highlight {
        grid-column: 1 / -1;
        grid-template-columns: 1fr;
    }
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
        line-height: 1.5;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }
}
</style>