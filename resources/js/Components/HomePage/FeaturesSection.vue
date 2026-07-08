<script setup>
const features = [
    {
        icon: '📚', color: 'cyan', goldAccent: false,
        title: 'Manajemen Kurikulum',
        desc: 'Susun mata pelajaran, modul, dan materi pembelajaran secara terstruktur sesuai kurikulum Merdeka Belajar atau KTSP.',
    },
    {
        icon: '✏️', color: 'gold', goldAccent: false,
        title: 'Ujian Online & Bank Soal',
        desc: 'Buat ujian dengan berbagai tipe soal — pilihan ganda, essay, benar/salah — dengan bank soal terorganisir dan penilaian otomatis.',
    },
    {
        icon: '📊', color: 'green', goldAccent: false,
        title: 'Rapor & Analitik Nilai',
        desc: 'Generate rapor digital secara otomatis. Pantau perkembangan siswa dengan grafik analitik yang mudah dipahami.',
    },
    {
        icon: '🗓️', color: 'purple', goldAccent: false,
        title: 'Absensi Digital',
        desc: 'Catat kehadiran siswa dan guru secara digital. Laporan absensi otomatis tersedia kapanpun dibutuhkan.',
    },
    {
        icon: '💬', color: 'rose', goldAccent: true,
        title: 'Notifikasi WhatsApp',
        desc: 'Kirim pengumuman, hasil ujian, dan informasi penting langsung ke WhatsApp orang tua siswa secara otomatis.',
    },
    {
        icon: '🔐', color: 'orange', goldAccent: false,
        title: 'Keamanan Data Terjamin',
        desc: 'Data sekolah dienkripsi dan disimpan di server berstandar ISO 27001. Backup otomatis setiap hari tanpa konfigurasi tambahan.',
    },
]
</script>

<template>
    <section class="features-section" id="fitur" aria-labelledby="features-title">
        <div class="container">
            <div class="section-header centered reveal">
                <div class="section-eyebrow">fitur dan layanan kami</div>
                <h2 class="section-title" id="features-title">
                    Semua kebutuhan lembaga pendidikan modern
                </h2>
                <p class="section-desc">
                    Dari manajemen siswa, absensi, ujian online hingga rapor digital semuanya dalam satu platform yang
                    terintegrasi.
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

                <!-- Full-width API Highlight -->
                <!-- <div class="feature-card feature-highlight reveal" style="transition-delay:.6s">
                    <div>
                        <div class="feature-icon cyan" style="margin-bottom:1.5rem">⚡</div>
                        <h3 class="feature-title" style="font-size:1.4rem;margin-bottom:1rem">
                            Integrasi API & Webhook
                        </h3>
                        <p class="feature-desc" style="margin-bottom:1.5rem">
                            Hubungkan KREATICRAFT dengan sistem yang sudah berjalan di sekolah Anda — SIAK, presensi
                            fingerprint, atau sistem keuangan — melalui REST API yang terdokumentasi lengkap.
                        </p>
                        <a href="#docs" class="link-api">
                            Baca Dokumentasi API
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                    <div class="feature-highlight-visual">
                        <div class="code-block">
                            <span class="cm">// Contoh: Kirim nilai siswa via API</span>
                            <span class="kw">POST</span> <span class="fn">/api/v1/nilai</span>
                            <span class="cm">Authorization: Bearer {token}</span>

                            {
                            <span class="str">"siswa_id"</span>: <span class="num">10482</span>,
                            <span class="str">"mapel"</span>: <span class="str">"matematika"</span>,
                            <span class="str">"semester"</span>: <span class="num">1</span>,
                            <span class="str">"nilai_uts"</span>: <span class="num">87</span>,
                            <span class="str">"nilai_uas"</span>: <span class="num">92</span>
                            }

                            <span class="cm">// Response</span>
                            {
                            <span class="str">"status"</span>: <span class="str">"success"</span>,
                            <span class="str">"nilai_akhir"</span>: <span class="num">90.2</span>,
                            <span class="str">"predikat"</span>: <span class="str">"A"</span>
                            }
                        </div>
                    </div>
                </div> -->
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

    .features-grid {
        grid-template-columns: 1fr;
    }
}
</style>