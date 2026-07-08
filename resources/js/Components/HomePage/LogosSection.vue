<script setup>
const logos = [
    'SDIT Nurul Hikmah', 'SMPN 2 Bojong Gede', 'SMKN 1 Jakarta', 'SMP Islam Nusantara', 'SMK Nusantara', 'Pesantren Mathla`ul Anwar', 'SMA Bina Bangsa', 'SMP Kusuma Bangsa', 'SMK Laboratorium Indonesia', 'Yayasan Pendidikan Nurul Qolbi', 'SMP Binadidaktika',
]
</script>

<template>
    <section class="logos-section" aria-label="Dipercaya oleh">
        <div class="container">
            <p class="logos-label">Dipercaya oleh berbagai lembaga pendidikan di Indonesia</p>
            <div class="logos-track">
                <div v-for="logo in logos" :key="logo" class="logo-item">{{ logo }}</div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.logos-section {
    padding: 3rem 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.01);
    position: relative;
    z-index: 1;
}

.logos-label {
    text-align: center;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin-bottom: 2rem;
}

.logos-track {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
}

.logo-item {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: -0.02em;
    white-space: nowrap;
    transition: color 0.3s;
}

.logo-item:hover {
    color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
    .logos-track {
        gap: 1.5rem;
    }
}
</style>