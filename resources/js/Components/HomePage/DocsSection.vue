<script setup>
const docFeatures = [
    {
        icon: '📖', bg: 'rgba(0,212,255,0.1)',
        title: 'REST API Lengkap',
        desc: 'Endpoint terdokumentasi untuk semua fitur: siswa, nilai, absensi, ujian, laporan, dan manajemen pengguna.',
    },
    {
        icon: '🔔', bg: 'rgba(245,166,35,0.1)',
        title: 'Webhook & Event System',
        desc: 'Subscribe ke events real-time: pendaftaran siswa baru, selesai ujian, upload materi, dan 20+ event lainnya.',
    },
    {
        icon: '🧩', bg: 'rgba(52,211,153,0.1)',
        title: 'SDK Laravel & Vue',
        desc: 'Package Composer dan NPM resmi untuk integrasi cepat ke sistem existing berbasis Laravel + Vue.js.',
    },
    {
        icon: '🛟', bg: 'rgba(167,139,250,0.1)',
        title: 'Panduan Step-by-Step',
        desc: 'Panduan lengkap dalam Bahasa Indonesia untuk admin, guru, dan siswa. Dari setup pertama hingga fitur lanjutan.',
    },
]
</script>

<template>
    <section class="docs-section" id="docs" aria-labelledby="docs-title">
        <div class="container">
            <div class="docs-layout">
                <!-- Sidebar Preview -->
                <div class="docs-sidebar reveal">
                    <div class="docs-topbar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" color="rgba(255,255,255,0.4)">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span class="docs-topbar-label">docs.lumiverse.co.id</span>
                    </div>
                    <div class="docs-nav">
                        <div class="docs-nav-group">
                            <div class="docs-nav-title">Memulai</div>
                            <div class="docs-nav-item active">Pengenalan</div>
                            <div class="docs-nav-item">Instalasi & Setup</div>
                            <div class="docs-nav-item">Manajemen Pengguna</div>
                        </div>
                        <div class="docs-nav-group">
                            <div class="docs-nav-title">API Reference</div>
                            <div class="docs-nav-item">REST API v1</div>
                            <div class="docs-nav-item">Webhook Events</div>
                            <div class="docs-nav-item">SDK & Library</div>
                        </div>
                        <div class="docs-nav-group">
                            <div class="docs-nav-title">Panduan</div>
                            <div class="docs-nav-item">Panduan Guru</div>
                            <div class="docs-nav-item">Panduan Admin</div>
                        </div>
                    </div>
                    <div class="docs-content-preview">
                        <div class="docs-code">
                            <span class="cyan"># Autentikasi API</span>

                            Semua request ke API Lumiverse
                            harus menyertakan Bearer token.

                            <span class="gold">curl</span> -X GET \
                            https://api.lumiverse.co.id/v1/siswa \
                            -H <span class="green">"Authorization: Bearer {token}"</span> \
                            -H <span class="green">"Accept: application/json"</span>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div>
                    <div class="section-header reveal">
                        <div class="section-eyebrow">Dokumentasi Lengkap</div>
                        <h2 class="section-title" id="docs-title">
                            Developer-first.<br>
                            <span class="text-cyan">Docs yang benar-benar berguna.</span>
                        </h2>
                        <p class="section-desc">
                            Dokumentasi teknis lengkap, contoh kode nyata, dan panduan integrasi — tersedia dalam Bahasa
                            Indonesia dan Inggris.
                        </p>
                    </div>

                    <div class="docs-features">
                        <div v-for="(feat, i) in docFeatures" :key="feat.title" class="doc-feature reveal"
                            :style="{ transitionDelay: `${(i + 1) * 0.1}s` }">
                            <div class="doc-feature-icon" :style="{ background: feat.bg }">{{ feat.icon }}</div>
                            <div class="doc-feature-text">
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
.docs-section {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

.docs-layout {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 5rem;
    align-items: center;
}

.docs-sidebar {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.3);
}

.docs-topbar {
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border);
    padding: 0.875rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.docs-topbar-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--muted);
}

.docs-nav {
    padding: 1.25rem;
}

.docs-nav-group {
    margin-bottom: 1.5rem;
}

.docs-nav-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;
}

.docs-nav-item {
    padding: 0.45rem 0.75rem;
    border-radius: 7px;
    font-size: 0.82rem;
    color: var(--muted);
    transition: all 0.2s;
    margin-bottom: 0.1rem;
    cursor: default;
}

.docs-nav-item:hover {
    background: var(--glass);
    color: var(--white);
}

.docs-nav-item.active {
    background: rgba(0, 212, 255, 0.1);
    color: var(--cyan);
}

.docs-content-preview {
    background: rgba(255, 255, 255, 0.02);
    border-top: 1px solid var(--border);
    padding: 1.25rem;
}

.docs-code {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    line-height: 1.7;
    color: var(--muted);
    white-space: pre;
}

.cyan {
    color: var(--cyan);
}

.gold {
    color: var(--gold);
}

.green {
    color: #86efac;
}

.docs-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.doc-feature {
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 14px;
    border: 1px solid var(--border);
    transition: all 0.3s;
}

.doc-feature:hover {
    border-color: rgba(0, 212, 255, 0.2);
    background: rgba(0, 212, 255, 0.02);
}

.doc-feature-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}

.doc-feature-text .title {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.doc-feature-text .desc {
    font-size: 0.85rem;
    color: var(--muted);
}

@media (max-width: 1024px) {
    .docs-layout {
        grid-template-columns: 1fr;
    }
}
</style>