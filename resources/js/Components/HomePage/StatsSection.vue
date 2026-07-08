<script setup>
const stats = [
    { num: '100', suffix: '+', color: 'cyan', label: 'Sekolah & Lembaga' },
    { num: '75K', suffix: '+', color: 'gold', label: 'Siswa Aktif' },
    { num: '99.97', suffix: '%', color: 'white', label: 'Uptime Dijamin' },
    { num: '4.9', suffix: '★', color: 'green', label: 'Rating Kepuasan' },
]
</script>

<template>
    <section class="stats-section">
        <div class="container">
            <div class="stats-grid" role="list">
                <div v-for="stat in stats" :key="stat.label" class="stat-item reveal" role="listitem">
                    <div class="stat-num" :class="stat.color">
                        {{ stat.num }}<span>{{ stat.suffix }}</span>
                    </div>
                    <div class="stat-label">{{ stat.label }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.stats-section {
    padding: 6rem 0;
    position: relative;
    z-index: 1;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
}

.stat-item {
    background: var(--midnight);
    padding: 2.5rem 2rem;
    text-align: center;
    transition: background 0.3s;
}

.stat-item:hover {
    background: rgba(255, 255, 255, 0.02);
}

.stat-num {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 3rem;
    line-height: 1;
    margin-bottom: 0.5rem;
}

.stat-num span {
    font-size: 1.5rem;
}

.stat-num.cyan {
    color: var(--cyan);
}

.stat-num.gold {
    color: var(--gold);
}

.stat-num.white {
    color: var(--white);
}

.stat-num.green {
    color: #34d399;
}

.stat-label {
    font-size: 0.9rem;
    color: var(--muted);
}

@media (max-width: 1024px) {
    .stats-grid {
        grid-template-columns: repeat(1, 1fr);
    }
}

@media (max-width: 768px) {
    .container {
        padding: 0 0.75rem;
    }

    .stats-section {
        padding: 2rem 0;
    }

    .stats-grid {
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>