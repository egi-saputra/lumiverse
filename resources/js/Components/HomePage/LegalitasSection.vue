<script setup>
const items = [
    {
        icon: '🏢',
        title: 'Badan Hukum',
        num: 'PT Lumi Platforms Indonesia',
        desc: 'Terdaftar sebagai Perseroan Terbatas di Indonesia sesuai UU No. 40 Tahun 2007.',
    },
    {
        icon: '📋',
        title: 'NIB & SIUP',
        num: 'NIB: 0306260081148',
        desc: 'Nomor Induk Berusaha terdaftar di OSS Kemenko Perekonomian RI.',
    },
    {
        icon: '🔒',
        title: 'Keamanan Data',
        num: 'ISO/IEC 27001:2022',
        desc: 'Sistem keamanan informasi bersertifikasi internasional. Data sekolah Anda terlindungi penuh.',
    },
    {
        icon: '⚖️',
        title: 'Kepatuhan PDP',
        num: 'UU No. 27 Tahun 2022',
        desc: 'Patuh pada Undang-Undang Perlindungan Data Pribadi Republik Indonesia.',
    },
]
</script>

<template>
    <section class="legal-section" id="legalitas" aria-labelledby="legal-title">
        <div class="container">
            <div class="section-header centered reveal">
                <div class="section-eyebrow">Legalitas & Keamanan</div>
                <h2 class="section-title" id="legal-title">
                    Terpercaya & Legal di Indonesia
                </h2>
                <p class="section-desc">
                    Lumiverse beroperasi dengan penuh kepatuhan hukum dan standar keamanan internasional dalam payung
                    hukum PT Lumi Platforms Indonesia.
                </p>
            </div>

            <div class="legal-grid">
                <div v-for="(item, i) in items" :key="item.title" class="legal-card reveal"
                    :style="{ transitionDelay: `${i * 0.1}s` }">
                    <div class="legal-icon">{{ item.icon }}</div>
                    <div class="legal-title">{{ item.title }}</div>
                    <div class="legal-num">{{ item.num }}</div>
                    <div class="legal-desc">{{ item.desc }}</div>
                </div>
            </div>

            <div class="legal-note reveal">
                <p>
                    Untuk verifikasi legalitas atau kerjasama institusional, hubungi:
                    <a href="mailto:legal@lumiverse.co.id">legal@lumiverse.co.id</a>
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.legal-section {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

.legal-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.legal-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.75rem;
    text-align: center;
    transition: all 0.3s;
}

.legal-card:hover {
    border-color: rgba(245, 166, 35, 0.3);
    transform: translateY(-2px);
}

.legal-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: rgba(245, 166, 35, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    font-size: 1.5rem;
}

.legal-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
}

.legal-num {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--gold);
    margin-bottom: 0.5rem;
}

.legal-desc {
    font-size: 0.8rem;
    color: var(--muted);
}

.legal-note {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--muted);
}

.legal-note a {
    color: var(--cyan);
    font-weight: 600;
}

@media (max-width: 1024px) {
    .legal-grid {
        grid-template-columns: repeat(1, 1fr);
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

    .legal-grid {
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>