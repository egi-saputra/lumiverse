<script setup>
defineProps({
    error: {
        type: String,
        default: null,
    },
})

defineEmits(['select'])

const products = [
    {
        type: 'school',
        icon: '🏫',
        accent: 'school',
        brand: 'Lumi',
        name: 'Classroom',
        tagline: 'Untuk Sekolah / Lembaga Pendidikan',
        desc: 'Platform manajemen sekolah lengkap dalam satu aplikasi.',
        features: ['Bank soal & Ujian online', 'Materi & Tugas Harian', 'Presensi & rekap Absensi otomatis', 'Rekap nilai otomatis & Fitur Lainnya'],
    },
    {
        type: 'workspace',
        icon: '🏢',
        accent: 'workspace',
        brand: 'Lumi',
        name: 'Workspace',
        tagline: 'Untuk Perusahaan / Korporat',
        desc: 'Ruang kerja digital untuk kelola tim dan operasional harian.',
        features: ['Manajemen data karyawan', 'Modul Pelatihan & Pengembangan', 'Psikotest / Test masuk karyawan baru', 'Pengumuman, informasi dan lainnya'],
    },
]
</script>

<template>
    <div class="product-select">
        <div class="product-grid">
            <button v-for="p in products" :key="p.type" type="button" class="product-card"
                :class="`product-card--${p.accent}`" @click="$emit('select', p.type)">
                <span class="product-card__glow"></span>

                <span class="product-icon-wrap">
                    <span class="product-icon">{{ p.icon }}</span>
                </span>

                <span class="product-name">{{ p.brand }} <span class="text-cyan">{{ p.name }}</span></span>
                <span class="product-tagline">{{ p.tagline }}</span>
                <span class="product-desc">{{ p.desc }}</span>

                <ul class="product-features">
                    <li v-for="f in p.features" :key="f">
                        <span class="product-feature-dot">✓</span>{{ f }}
                    </li>
                </ul>

                <span class="product-cta">
                    Gunakan produk ini
                    <span class="product-cta-arrow">→</span>
                </span>
            </button>
        </div>

        <div v-if="error" class="field-error text-center">{{ error }}</div>
    </div>
</template>

<style scoped>
.product-select {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.1rem;
}

.product-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.55rem;
    text-align: left;
    padding: 1.6rem 1.4rem 1.5rem;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0));
    cursor: pointer;
    overflow: hidden;
    isolation: isolate;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.product-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, var(--card-accent, var(--cyan)), transparent 55%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
}

.product-card:hover {
    transform: translateY(-4px);
    border-color: transparent;
    box-shadow: 0 16px 32px -18px rgba(0, 0, 0, 0.55);
}

.product-card:hover::before {
    opacity: 1;
}

.product-card--school {
    --card-accent: #00d4ff;
}

.product-card--workspace {
    --card-accent: #a78bfa;
}

.product-card__glow {
    position: absolute;
    top: -40%;
    right: -30%;
    width: 60%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--card-accent, var(--cyan));
    opacity: 0.12;
    filter: blur(30px);
    z-index: -1;
    transition: opacity 0.25s ease;
}

.product-card:hover .product-card__glow {
    opacity: 0.22;
}

.product-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: color-mix(in srgb, var(--card-accent, var(--cyan)) 16%, transparent);
    border: 1px solid color-mix(in srgb, var(--card-accent, var(--cyan)) 30%, transparent);
    margin-bottom: 0.15rem;
}

.product-icon {
    font-size: 1.5rem;
    line-height: 1;
}

.product-name {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--white);
}

.product-tagline {
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--card-accent, var(--cyan));
}

.product-desc {
    font-size: 0.82rem;
    line-height: 1.45;
    color: var(--muted);
}

.product-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin: 0.3rem 0 0.15rem;
    padding: 0;
    width: 100%;
}

.product-features li {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.78rem;
    color: var(--muted);
}

.product-feature-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--card-accent, var(--cyan)) 20%, transparent);
    color: var(--card-accent, var(--cyan));
    font-size: 0.6rem;
    font-weight: 700;
    flex-shrink: 0;
}

.product-cta {
    margin-top: 0.6rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--card-accent, var(--cyan));
}

.product-cta-arrow {
    transition: transform 0.2s ease;
}

.product-card:hover .product-cta-arrow {
    transform: translateX(4px);
}

@media (max-width: 480px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
}
</style>