<script setup>
const serviceFeatures = [
    {
        icon: '📊', bg: 'rgba(0,212,255,0.1)',
        title: 'Absensi & Nilai Real-time',
        desc: 'Guru input sekali, orang tua dan siswa langsung melihat pembaruan absensi dan nilai secara instan.',
    },
    {
        icon: '🔔', bg: 'rgba(245,166,35,0.1)',
        title: 'Notifikasi WhatsApp Otomatis',
        desc: 'Pemberitahuan pendaftaran, hasil ujian, dan pengumuman penting dikirim otomatis ke WhatsApp orang tua.',
    },
    {
        icon: '📅', bg: 'rgba(52,211,153,0.1)',
        title: 'Jadwal & Kalender Akademik',
        desc: 'Jadwal pelajaran, ujian, dan agenda sekolah tersinkronisasi otomatis di aplikasi setiap siswa dan guru.',
    },
    {
        icon: '📱', bg: 'rgba(167,139,250,0.1)',
        title: 'Aplikasi Mobile Native',
        desc: 'Akses kapan saja lewat aplikasi Android & iOS yang ringan, cepat, dan bisa dipakai offline sebagian fitur.',
    },
]
</script>

<template>
    <section class="layanan-section" id="layanan" aria-labelledby="layanan-title">
        <div class="container">
            <div class="layanan-layout">
                <!-- Mobile App Mockup -->
                <div class="phone-stage reveal">
                    <div class="phone-mockup">
                        <div class="phone-notch"></div>
                        <div class="phone-screen">
                            <!-- Status bar -->
                            <div class="status-bar">
                                <span class="status-time">09:41</span>
                                <div class="status-icons">
                                    <svg width="14" height="10" viewBox="0 0 16 12" fill="currentColor">
                                        <rect x="0" y="8" width="3" height="4" rx="0.5" />
                                        <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
                                        <rect x="9" y="2" width="3" height="10" rx="0.5" />
                                        <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.4" />
                                    </svg>
                                    <svg width="15" height="10" viewBox="0 0 20 12" fill="none" stroke="currentColor"
                                        stroke-width="1.4">
                                        <path d="M1 4a13 13 0 0 1 18 0" stroke-opacity="0.4" />
                                        <path d="M4.2 7a8.5 8.5 0 0 1 11.6 0" />
                                        <circle cx="10" cy="10" r="1.4" fill="currentColor" stroke="none" />
                                    </svg>
                                    <svg width="20" height="10" viewBox="0 0 24 12" fill="none">
                                        <rect x="0.5" y="0.5" width="19" height="11" rx="2.5" stroke="currentColor"
                                            stroke-opacity="0.5" />
                                        <rect x="2" y="2" width="14" height="8" rx="1.2" fill="currentColor" />
                                        <rect x="20.5" y="4" width="2" height="4" rx="1" fill="currentColor"
                                            fill-opacity="0.5" />
                                    </svg>
                                </div>
                            </div>

                            <!-- App header -->
                            <div class="app-header">
                                <div>
                                    <div class="app-greeting">Selamat pagi 👋</div>
                                    <div class="app-username">Ahmad Fauzi</div>
                                </div>
                                <div class="app-avatar">AF</div>
                            </div>

                            <!-- Stat pills -->
                            <div class="app-stats">
                                <div class="app-stat">
                                    <div class="app-stat-value cyan">98%</div>
                                    <div class="app-stat-label">Kehadiran</div>
                                </div>
                                <div class="app-stat">
                                    <div class="app-stat-value gold">12/15</div>
                                    <div class="app-stat-label">Tugas Selesai</div>
                                </div>
                            </div>

                            <!-- Schedule list -->
                            <div class="app-section-label">Jadwal Hari Ini</div>
                            <div class="app-schedule">
                                <div class="app-schedule-item">
                                    <div class="app-schedule-time">07:30</div>
                                    <div class="app-schedule-dot active"></div>
                                    <div class="app-schedule-text">
                                        <div class="app-schedule-title">Matematika</div>
                                        <div class="app-schedule-sub">Kelas XII IPA 1 · Ruang 204</div>
                                    </div>
                                </div>
                                <div class="app-schedule-item">
                                    <div class="app-schedule-time">09:15</div>
                                    <div class="app-schedule-dot"></div>
                                    <div class="app-schedule-text">
                                        <div class="app-schedule-title">Bahasa Indonesia</div>
                                        <div class="app-schedule-sub">Kelas XII IPA 1 · Ruang 204</div>
                                    </div>
                                </div>
                                <div class="app-schedule-item">
                                    <div class="app-schedule-time">10:45</div>
                                    <div class="app-schedule-dot"></div>
                                    <div class="app-schedule-text">
                                        <div class="app-schedule-title">Ujian Fisika</div>
                                        <div class="app-schedule-sub">Kelas XII IPA 1 · Lab 1</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Bottom nav -->
                            <div class="app-nav w-64 absolute bottom-6 left-6">
                                <div class="app-nav-item active">
                                    <span class="app-nav-icon">🏠</span>
                                </div>
                                <div class="app-nav-item">
                                    <span class="app-nav-icon">📅</span>
                                </div>
                                <div class="app-nav-item">
                                    <span class="app-nav-icon">📊</span>
                                </div>
                                <div class="app-nav-item">
                                    <span class="app-nav-icon">👤</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Floating notification cards -->
                    <div class="float-card float-card--top">
                        <span class="float-icon">✅</span>
                        <div>
                            <div class="float-title">Absensi berhasil</div>
                            <div class="float-sub">Tercatat 07:28 WIB</div>
                        </div>
                    </div>
                    <div class="float-card float-card--bottom">
                        <span class="float-icon wa">💬</span>
                        <div>
                            <div class="float-title">WhatsApp terkirim</div>
                            <div class="float-sub">Nilai Ujian Fisika telah diperbarui</div>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div>
                    <div class="section-header reveal">
                        <div class="section-eyebrow">Fitur & Layanan</div>
                        <h2 class="section-title" id="layanan-title">
                            Satu aplikasi,<br>
                            <span class="text-gradient">Untuk semua kebutuhan sekolah.</span>
                        </h2>
                        <!-- <p class="section-desc">
                            Dari absensi harian hingga notifikasi WhatsApp otomatis — semua berjalan
                            di satu ekosistem yang saling terhubung, real-time, dan mudah dipakai.
                        </p> -->
                    </div>

                    <div class="layanan-features">
                        <div v-for="(feat, i) in serviceFeatures" :key="feat.title" class="svc-feature reveal"
                            :style="{ transitionDelay: `${(i + 1) * 0.1}s` }">
                            <div class="svc-feature-icon" :style="{ background: feat.bg }">{{ feat.icon }}</div>
                            <div class="svc-feature-text">
                                <div class="title">{{ feat.title }}</div>
                                <div class="desc">{{ feat.desc }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.layanan-section {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

.layanan-layout {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 5rem;
    align-items: center;
}

/* ── Phone stage ──────────────────────────────────────── */
.phone-stage {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 1.5rem 0;
}

.phone-mockup {
    position: relative;
    width: 320px;
    background: #0a0e17;
    border: 8px solid #14192a;
    border-radius: 42px;
    box-shadow:
        0 40px 90px rgba(0, 0, 0, 0.45),
        0 0 0 1px var(--border);
    overflow: hidden;
}

.phone-notch {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 90px;
    height: 20px;
    background: #14192a;
    border-radius: 0 0 14px 14px;
    z-index: 2;
}

.phone-screen {
    background: linear-gradient(180deg, #0d1220, var(--navy) 30%);
    padding: 2.25rem 1.1rem 1rem;
    min-height: 600px;
}

.status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 1.5rem;
    padding: 0 0.25rem;
}

.status-time {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.75rem;
}

.status-icons {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
}

.app-greeting {
    font-size: 0.7rem;
    color: var(--muted);
    margin-bottom: 0.15rem;
}

.app-username {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--white);
}

.app-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--cyan), #0066ff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 0.7rem;
    color: #05080f;
    flex-shrink: 0;
}

.app-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
}

.app-stat {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.7rem 0.75rem;
}

.app-stat-value {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.1rem;
    line-height: 1;
    margin-bottom: 0.25rem;
}

.app-stat-value.cyan {
    color: var(--cyan);
}

.app-stat-value.gold {
    color: var(--gold);
}

.app-stat-label {
    font-size: 0.65rem;
    color: var(--muted);
}

.app-section-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin-bottom: 0.75rem;
}

.app-schedule {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-bottom: 1.75rem;
}

.app-schedule-item {
    display: grid;
    grid-template-columns: 34px 12px 1fr;
    align-items: center;
    gap: 0.5rem;
}

.app-schedule-time {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--muted);
}

.app-schedule-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    justify-self: center;
}

.app-schedule-dot.active {
    background: var(--cyan);
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
}

.app-schedule-title {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 0.1rem;
}

.app-schedule-sub {
    font-size: 0.65rem;
    color: var(--muted);
}

.app-nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 0.6rem;
    margin-top: auto;
}

.app-nav-item {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 0.85rem;
    opacity: 0.5;
}

.app-nav-item.active {
    opacity: 1;
    background: rgba(0, 212, 255, 0.12);
}

/* ── Floating notification cards ─────────────────────── */
.float-card {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 0.65rem 0.9rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
    max-width: 200px;
    animation: floaty 6s ease-in-out infinite;
}

.float-card--top {
    top: 4%;
    left: 2%;
    animation-delay: 0s;
}

.float-card--bottom {
    bottom: 20%;
    right: 0;
    animation-delay: -3s;
}

@keyframes floaty {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .float-card {
        animation: none;
    }
}

.float-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
}

.float-icon.wa {
    filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.5));
}

.float-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--white);
    line-height: 1.3;
}

.float-sub {
    font-size: 0.65rem;
    color: var(--muted);
    line-height: 1.3;
}

/* ── Right content ────────────────────────────────────── */
.section-eyebrow {
    display: inline-block;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--cyan);
    margin-bottom: 0.75rem;
}

.section-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.7rem, 3.2vw, 2.4rem);
    line-height: 1.3;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
}

.text-cyan {
    color: var(--cyan);
}

.text-gradient {
    background: linear-gradient(135deg, var(--cyan), #7dd3fc 60%, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-desc {
    font-size: 1rem;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 2.5rem;
}

.layanan-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.svc-feature {
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 14px;
    border: 1px solid var(--border);
    transition: all 0.3s;
}

.svc-feature:hover {
    border-color: rgba(0, 212, 255, 0.2);
    background: rgba(0, 212, 255, 0.02);
}

.svc-feature-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}

.svc-feature-text .title {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.svc-feature-text .desc {
    font-size: 0.85rem;
    color: var(--muted);
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 1024px) {
    .layanan-layout {
        grid-template-columns: 1fr;
        gap: 3.5rem;
    }

    .phone-stage {
        padding: 2.5rem 0;
    }
}

@media (max-width: 480px) {
    .float-card--top {
        left: -6%;
        top: 10%;
    }

    .float-card--bottom {
        right: -6%;
        bottom: 24%;
    }
}
</style>