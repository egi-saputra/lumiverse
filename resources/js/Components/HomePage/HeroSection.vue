<script setup>
import { Link } from '@inertiajs/vue3'
import { ref, onMounted, onUnmounted } from 'vue'

const variants = [
    {
        platform: 'LMS',
        audience: 'sekolah Indonesia',
        subject: 'Pembelajaran',
        pace: 'Cepat,'
    },
    // {
    //     platform: 'Classroom',
    //     audience: 'Komunitas Anda',
    //     subject: 'Pelatihan',
    //     pace: 'Cepat,'
    // },
    {
        platform: 'Workspace',
        audience: 'Bisnis Anda',
        subject: 'Pengembangan',
        pace: 'Cerdas,'
        // pace: 'Cermat,'
    }
]

const activeIndex = ref(0)
let intervalId = null

onMounted(() => {
    intervalId = setInterval(() => {
        activeIndex.value = (activeIndex.value + 1) % variants.length
    }, 2500)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<template>
    <section class="hero" id="hero" aria-labelledby="hero-title">
        <!-- Background -->
        <div class="hero-bg" aria-hidden="true">
            <div class="hero-glow-1"></div>
            <div class="hero-glow-2"></div>
            <div class="hero-grid"></div>
        </div>

        <div class="container">
            <div class="hero-layout">
                <!-- Content -->
                <div class="hero-content">
                    <div class="hero-badge"
                        :aria-label="`Platform ${variants[activeIndex].platform} #1 untuk ${variants[activeIndex].audience}`">
                        <div class="hero-badge-dot"></div>
                        <span>Platform</span>
                        <span class="word-slot">
                            <Transition name="slide-up">
                                <span :key="variants[activeIndex].platform" class="word-inner">{{
                                    variants[activeIndex].platform }}</span>
                            </Transition>
                        </span>
                        <span>#1 untuk</span>
                        <span class="word-slot">
                            <Transition name="slide-up">
                                <span :key="variants[activeIndex].audience" class="word-inner">{{
                                    variants[activeIndex].audience }}</span>
                            </Transition>
                        </span>
                    </div>

                    <h1 class="hero-title" id="hero-title">
                        Kelola Sistem
                        <span class="word-slot-h word-slot-h-title">
                            <Transition name="slide-horizontal">
                                <span :key="variants[activeIndex].subject" class="word-inner-h">{{
                                    variants[activeIndex].subject }}</span>
                            </Transition>
                        </span><br>
                        <span class="highlight word-slot-h word-slot-h-title">
                            Lebih
                            <Transition name="slide-horizontal">
                                <span :key="variants[activeIndex].pace" class="word-inner-h">{{
                                    variants[activeIndex].pace }}</span>
                            </Transition>
                        </span><br>
                        <span class="highlight-gold">Lebih Mudah.</span>
                    </h1>

                    <!-- The All in One Growth System Platform -->
                    <p class="hero-desc">
                        Lumiverse merupakan The All in One Growth System Platform berbasis cloud pertama di
                        Indonesia, yang hadir
                        untuk memberikan solusi dan kemudahan bagi sebuah bisnis, perusahaan atau lembaga pendidikan.
                    </p>

                    <div class="hero-actions">
                        <Link href="/registration" class="btn-hero">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                            Coba Gratis Sekarang
                        </Link>
                        <a href="#demo" class="btn-outline">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                            Lihat Demo
                        </a>
                    </div>

                    <div class="hero-trust">
                        <div class="trust-avatars" aria-hidden="true">
                            <div class="trust-avatar">NH</div>
                            <div class="trust-avatar">WB</div>
                            <div class="trust-avatar">SN</div>
                            <div class="trust-avatar">+</div>
                        </div>
                        <p class="trust-text"><strong>1000+ pengguna</strong> telah bergabung — tanpa kartu kredit</p>
                    </div>
                </div>

                <!-- Dashboard Visual -->
                <div class="hero-visual" aria-hidden="true">
                    <div class="hero-dashboard">
                        <div class="dashboard-topbar">
                            <div class="dot dot-red"></div>
                            <div class="dot dot-yellow"></div>
                            <div class="dot dot-green"></div>
                            <div class="dashboard-url">app.lumiverse.co.id/dashboard</div>
                        </div>
                        <div class="dashboard-body">
                            <div class="dashboard-sidebar">
                                <div class="sidebar-brand">Lumiverse School</div>
                                <div class="sidebar-label">Menu Utama</div>
                                <div class="sidebar-item active">
                                    <div class="sidebar-icon"></div> Dashboard
                                </div>
                                <div class="sidebar-item">
                                    <div class="sidebar-icon"></div> Mata Pelajaran
                                </div>
                                <div class="sidebar-item">
                                    <div class="sidebar-icon"></div> Siswa
                                </div>
                                <div class="sidebar-item">
                                    <div class="sidebar-icon"></div> Ujian
                                </div>
                                <div class="sidebar-item">
                                    <div class="sidebar-icon"></div> Nilai & Rapor
                                </div>
                                <div class="sidebar-item">
                                    <div class="sidebar-icon"></div> Absensi
                                </div>
                                <div style="margin-top:1rem">
                                    <div class="sidebar-label">Administrasi</div>
                                    <div class="sidebar-item">
                                        <div class="sidebar-icon"></div> Guru
                                    </div>
                                    <div class="sidebar-item">
                                        <div class="sidebar-icon"></div> Laporan
                                    </div>
                                </div>
                            </div>
                            <div class="dashboard-main">
                                <div class="dash-header">Selamat datang, Pak Budi 👋</div>
                                <div class="dash-cards">
                                    <div class="dash-card">
                                        <div class="dash-card-label">Total Siswa</div>
                                        <div class="dash-card-val cyan">847</div>
                                        <div class="dash-card-sub">↑ 12% bulan ini</div>
                                    </div>
                                    <div class="dash-card">
                                        <div class="dash-card-label">Guru Aktif</div>
                                        <div class="dash-card-val gold">64</div>
                                        <div class="dash-card-sub">↑ 3 baru</div>
                                    </div>
                                    <div class="dash-card">
                                        <div class="dash-card-label">Avg. Nilai</div>
                                        <div class="dash-card-val green">87.4</div>
                                        <div class="dash-card-sub">↑ 5.2 poin</div>
                                    </div>
                                </div>
                                <div class="dash-chart-area">
                                    <div class="chart-label">Aktivitas Belajar — 7 Hari Terakhir</div>
                                    <div class="chart-bars">
                                        <div class="chart-bar" style="height:40%"></div>
                                        <div class="chart-bar" style="height:65%"></div>
                                        <div class="chart-bar" style="height:55%"></div>
                                        <div class="chart-bar" style="height:80%"></div>
                                        <div class="chart-bar" style="height:70%"></div>
                                        <div class="chart-bar" style="height:90%"></div>
                                        <div class="chart-bar" style="height:100%"></div>
                                    </div>
                                </div>
                                <div class="dash-activity">
                                    <div class="activity-label">Aktivitas Terbaru</div>
                                    <div class="activity-item">
                                        <div class="activity-dot" style="background:var(--cyan)"></div>
                                        Ujian Matematika kelas X selesai — 32 siswa
                                    </div>
                                    <div class="activity-item">
                                        <div class="activity-dot" style="background:var(--gold)"></div>
                                        Materi baru diunggah: Fisika Dasar Bab 7
                                    </div>
                                    <div class="activity-item" style="border:none">
                                        <div class="activity-dot" style="background:#34d399"></div>
                                        Rapor Semester 1 siap diunduh
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Floating badges -->
                    <div class="hero-float float-1">
                        <div class="float-icon cyan">🚀</div>
                        <div class="float-info">
                            <div class="label">Uptime</div>
                            <div class="val cyan">99.97%</div>
                        </div>
                    </div>
                    <div class="hero-float float-2">
                        <div class="float-icon green">✓</div>
                        <div class="float-info">
                            <div class="label">Infastruktur Keamanan Data</div>
                            <div class="val green">Standar ISO 27001</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8rem 0 6rem;
    position: relative;
    overflow: hidden;
}

.hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.hero-glow-1 {
    position: absolute;
    top: -20%;
    left: -10%;
    width: 70vw;
    height: 70vw;
    max-width: 800px;
    max-height: 800px;
    background: radial-gradient(ellipse, rgba(0, 212, 255, 0.08) 0%, transparent 70%);
    border-radius: 50%;
}

.hero-glow-2 {
    position: absolute;
    bottom: -20%;
    right: -10%;
    width: 60vw;
    height: 60vw;
    max-width: 700px;
    max-height: 700px;
    background: radial-gradient(ellipse, rgba(245, 166, 35, 0.06) 0%, transparent 70%);
    border-radius: 50%;
}

.hero-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
}

.hero-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    position: relative;
    z-index: 1;
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 1rem;
    border-radius: 100px;
    border: 1px solid rgba(0, 212, 255, 0.3);
    background: rgba(0, 212, 255, 0.06);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--cyan);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 2rem;
    animation: fadeInDown 0.6s ease both;
    flex-wrap: nowrap;
    white-space: nowrap;
}

.hero-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--cyan);
    animation: pulse 2s infinite;
    flex-shrink: 0;
}

/* Slot vertikal (badge) — overflow hidden, animasi naik-turun */
.word-slot {
    position: relative;
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
    height: 1.2em;
    line-height: 1.2em;
}

.word-inner {
    display: inline-block;
    white-space: nowrap;
}

/* Slot horizontal (judul) — overflow hidden, animasi geser kiri-kanan */
.word-slot-h {
    position: relative;
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
}

.word-slot-h-title {
    height: 1.15em;
    line-height: 1.15em;
}

.word-inner-h {
    display: inline-block;
    white-space: nowrap;
}

.hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.8rem, 6vw, 5rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 1.5rem;
    animation: fadeInDown 0.6s 0.1s ease both;
}

.highlight {
    background: linear-gradient(135deg, var(--cyan) 0%, #7dd3fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.highlight-gold {
    background: linear-gradient(135deg, var(--gold) 0%, #fcd34d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-desc {
    font-size: 1.15rem;
    color: var(--muted);
    max-width: 580px;
    line-height: 1.75;
    margin-bottom: 2.5rem;
    animation: fadeInDown 0.6s 0.2s ease both;
}

.hero-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 4rem;
    animation: fadeInDown 0.6s 0.3s ease both;
}

.hero-trust {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    animation: fadeInDown 0.6s 0.4s ease both;
}

.trust-avatars {
    display: flex;
}

.trust-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--midnight);
    background: linear-gradient(135deg, var(--navy-light), var(--cyan-dim));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--white);
    margin-left: -8px;
}

.trust-avatar:first-child {
    margin-left: 0;
}

.trust-text {
    font-size: 0.85rem;
    color: var(--muted);
}

.trust-text strong {
    color: var(--white);
}

/* Dashboard Visual */
.hero-visual {
    position: relative;
    height: 520px;
    animation: fadeInRight 0.8s 0.3s ease both;
}

.hero-dashboard {
    position: absolute;
    inset: 0;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border);
}

.dashboard-topbar {
    height: 48px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 1.25rem;
    gap: 0.5rem;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.dot-red {
    background: #ff5f57;
}

.dot-yellow {
    background: #febc2e;
}

.dot-green {
    background: #28c840;
}

.dashboard-url {
    flex: 1;
    margin: 0 1rem;
    height: 24px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--muted);
}

.dashboard-body {
    display: grid;
    grid-template-columns: 180px 1fr;
    height: calc(100% - 48px);
}

.dashboard-sidebar {
    background: rgba(255, 255, 255, 0.02);
    border-right: 1px solid var(--border);
    padding: 1.25rem 0.75rem;
}

.sidebar-brand {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 0.85rem;
    color: var(--cyan);
    padding: 0 0.5rem;
    margin-bottom: 1.5rem;
}

.sidebar-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    padding: 0 0.5rem;
    margin-bottom: 0.5rem;
}

.sidebar-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.75rem;
    color: var(--muted);
    margin-bottom: 0.15rem;
}

.sidebar-item.active {
    background: rgba(0, 212, 255, 0.1);
    color: var(--cyan);
}

.sidebar-icon {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: currentColor;
    opacity: 0.4;
    flex-shrink: 0;
}

.dashboard-main {
    padding: 1.25rem;
    overflow: hidden;
}

.dash-header {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.dash-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.dash-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.875rem;
}

.dash-card-label {
    font-size: 0.65rem;
    color: var(--muted);
    margin-bottom: 0.25rem;
}

.dash-card-val {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.3rem;
}

.dash-card-val.cyan {
    color: var(--cyan);
}

.dash-card-val.gold {
    color: var(--gold);
}

.dash-card-val.green {
    color: #34d399;
}

.dash-card-sub {
    font-size: 0.62rem;
    color: #34d399;
    margin-top: 0.2rem;
}

.dash-chart-area {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.875rem;
    margin-bottom: 0.75rem;
}

.chart-label {
    font-size: 0.65rem;
    color: var(--muted);
    margin-bottom: 0.6rem;
}

.chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 48px;
}

.chart-bar {
    flex: 1;
    border-radius: 3px;
    background: linear-gradient(to top, var(--cyan-dim), var(--cyan));
    opacity: 0.6;
    animation: growBar 1s ease both;
}

.chart-bar:last-child {
    opacity: 1;
}

.activity-label {
    font-size: 0.65rem;
    color: var(--muted);
    margin-bottom: 0.5rem;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.68rem;
    color: var(--muted);
}

.activity-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

/* Floating badges */
.hero-float {
    position: absolute;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    z-index: 2;
}

.float-1 {
    top: -16px;
    right: -20px;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    animation: floatY 4s ease-in-out infinite;
}

.float-2 {
    bottom: 60px;
    left: -24px;
    animation: floatY 4s 2s ease-in-out infinite;
}

.float-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}

.float-icon.cyan {
    background: rgba(0, 212, 255, 0.15);
}

.float-icon.green {
    background: rgba(52, 211, 153, 0.15);
}

.float-info .label {
    padding-top: 4px;
    font-size: 0.7rem;
    color: var(--muted);
}

.float-info .val {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 700;
}

.float-info .val.cyan {
    color: var(--cyan);
}

.float-info .val.green {
    color: #34d399;
}

/* Transisi vertikal (badge): naik-turun, enter & leave bersamaan */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
}

.slide-up-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(100%);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}

/* Transisi horizontal (judul): geser kiri-kanan, enter & leave bersamaan */
.slide-horizontal-enter-active,
.slide-horizontal-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
}

.slide-horizontal-leave-active {
    position: absolute;
    top: 0;
    left: 0;
}

.slide-horizontal-enter-from {
    opacity: 0;
    transform: translateX(60%);
}

.slide-horizontal-leave-to {
    opacity: 0;
    transform: translateX(-60%);
}

@media (max-width: 1024px) {
    .hero-layout {
        grid-template-columns: 1fr;
    }

    .hero-visual {
        display: none;
    }
}

@media (max-width: 768px) {
    .hero {
        padding: 7rem 0 4rem;
    }

    .hero-title {
        font-size: 2.3rem;
    }
}
</style>