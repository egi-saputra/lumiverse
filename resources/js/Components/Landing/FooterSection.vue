<script setup>
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3'

const page = usePage()

const profil = computed(() => page.props.profilSekolah ?? {})
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const year = new Date().getFullYear();

const links = {
    'Navigasi': [
        { label: 'Beranda', id: 'home' },
        { label: 'Tentang Kami', id: 'about' },
        { label: 'Program Keahlian', id: 'programs' },
        { label: 'Artikel', id: 'articles' },
        { label: 'Kontak', id: 'contact' },
    ],
    'Program': [
        { label: 'MPLB', id: 'programs' },
        { label: 'Bisnis Retail', id: 'programs' },
    ],
    'Info': [
        { label: 'Pendaftaran', id: 'contact' },
        { label: 'Beasiswa', id: 'contact' },
        { label: 'Karir Alumni', id: 'contact' },
        { label: 'Kerjasama Industri', id: 'contact' },
    ],
};
</script>

<template>
    <footer class="footer">
        <div class="footer-top-line"></div>
        <div class="footer-glow"></div>

        <div class="footer-inner">
            <!-- Brand column -->
            <div class="footer-brand">
                <button class="footer-logo" @click="scrollTo('home')">
                    <!-- <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                        <polygon points="16,2 30,26 2,26" fill="none" stroke="var(--gold-500)" stroke-width="1.5" />
                        <polygon points="16,8 26,26 6,26" fill="none" stroke="var(--gold-400)" stroke-width="0.75"
                            opacity="0.5" />
                        <circle cx="16" cy="18" r="3" fill="var(--gold-500)" />
                    </svg> -->
                    <span class="footer-logo-text">{{ profil.namaSekolah ?? '-' }}</span>
                </button>

                <p class="footer-tagline">
                    Mencetak generasi profesional yang siap bersaing di era global dengan pendidikan vokasi berkualitas
                    tinggi.
                </p>

                <div class="footer-accreditation">
                    <span class="accreditation-badge">Akreditasi B</span>
                    <span class="accreditation-badge">SMK PK — Pusat Keunggulan</span>
                </div>

                <div class="footer-socials">
                    <a href="#" class="footer-social" aria-label="Instagram">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="5" />
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                    <a href="#" class="footer-social" aria-label="YouTube">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <rect x="2" y="5" width="20" height="14" rx="3" />
                            <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                    <a href="#" class="footer-social" aria-label="WhatsApp">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <path
                                d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.4-.7 2.7-1.8 3.4l.8 2.6-2.8-.9C11.5 17.7 9.8 17 9 15.8" />
                        </svg>
                    </a>
                    <a href="#" class="footer-social" aria-label="TikTok">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <path d="M9 12a4 4 0 1 0 4 4V4c.5 2 2.5 4 5 4" />
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Nav columns -->
            <div v-for="(items, groupName) in links" :key="groupName" class="footer-col">
                <h4 class="footer-col-title">{{ groupName }}</h4>
                <ul class="footer-links">
                    <li v-for="link in items" :key="link.label">
                        <button class="footer-link" @click="scrollTo(link.id)">
                            {{ link.label }}
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Contact column -->
            <div class="footer-col">
                <h4 class="footer-col-title">Kontak</h4>
                <div class="footer-contact-list">
                    <div class="footer-contact-item">
                        <span class="fc-icon">📍</span>
                        <span>{{ profil.alamat ?? '-' }}</span>
                    </div>
                    <div class="footer-contact-item">
                        <span class="fc-icon">📞</span>
                        <span>{{ profil.telepon ?? '-' }}</span>
                    </div>
                    <div class="footer-contact-item">
                        <span class="fc-icon">✉️</span>
                        <span>{{ profil.email ?? '-' }}</span>
                    </div>
                </div>

                <button class="btn-gold-solid footer-cta-btn" @click="scrollTo('contact')">
                    Daftar Sekarang
                </button>
            </div>
        </div>

        <!-- Bottom bar -->
        <div class="footer-bottom">
            <div class="footer-bottom-inner">
                <!-- <span class="footer-copy">
                    © {{ year }} {{ profil.namaSekolah ?? '-' }}. Hak Cipta Dilindungi Oleh Undang-Undang.
                </span> -->
                <span class="footer-copy">
                    © {{ year }} PT Lumi Platforms Indonesia
                </span>
                <div class="footer-bottom-links">
                    <a href="#" class="footer-policy-link">Kebijakan Privasi</a>
                    <span class="footer-bottom-sep">·</span>
                    <a href="#" class="footer-policy-link">Syarat & Ketentuan</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    position: relative;
    background: var(--navy-950);
    overflow: hidden;
}

.footer-top-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.3), transparent);
}

.footer-glow {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(201, 168, 76, 0.04) 0%, transparent 70%);
    pointer-events: none;
}

.footer-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 5rem 2rem 3rem;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
    gap: 3rem;
}

/* Brand */
.footer-brand {}

.footer-logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: none;
    border: none;
    cursor: pointer;
    margin-bottom: 1.25rem;
    padding: 0;
}

.footer-logo-text {
    font-family: var(--font-display);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--gold-400);
    letter-spacing: 0.08em;
}

.footer-tagline {
    font-size: 0.82rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.35);
    margin-bottom: 1.25rem;
    max-width: 260px;
}

.footer-accreditation {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.accreditation-badge {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold-600);
    border: 1px solid rgba(201, 168, 76, 0.25);
    padding: 0.25rem 0.6rem;
}

.footer-socials {
    display: flex;
    gap: 0.5rem;
}

.footer-social {
    width: 34px;
    height: 34px;
    border: 1px solid rgba(201, 168, 76, 0.15);
    color: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.3s;
}

.footer-social:hover {
    border-color: var(--gold-500);
    color: var(--gold-500);
    background: rgba(201, 168, 76, 0.06);
}

/* Nav columns */
.footer-col {}

.footer-col-title {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold-500);
    margin-bottom: 1.25rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid rgba(201, 168, 76, 0.12);
}

.footer-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.footer-link {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.4);
    text-align: left;
    padding: 0.2rem 0;
    transition: color 0.25s;
    line-height: 1.5;
}

.footer-link:hover {
    color: var(--gold-400);
}

/* Contact column */
.footer-contact-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.footer-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.5;
}

.fc-icon {
    font-size: 0.85rem;
    flex-shrink: 0;
    margin-top: 1px;
}

.footer-cta-btn {
    font-size: 0.75rem;
    padding: 0.75rem 1.5rem;
    clip-path: none;
    width: 100%;
    justify-content: center;
}

/* Bottom bar */
.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 1.25rem 2rem;
}

.footer-bottom-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.footer-copy {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 0.04em;
}

.footer-bottom-links {
    display: flex;
    gap: 0.6rem;
    align-items: center;
}

.footer-policy-link {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.2);
    text-decoration: none;
    transition: color 0.25s;
    letter-spacing: 0.04em;
}

.footer-policy-link:hover {
    color: var(--gold-500);
}

.footer-bottom-sep {
    color: rgba(255, 255, 255, 0.1);
    font-size: 0.8rem;
}

@media (max-width: 1100px) {
    .footer-inner {
        grid-template-columns: 1fr 1fr 1fr;
    }

    .footer-brand {
        grid-column: 1 / -1;
    }
}

@media (max-width: 600px) {
    .footer-inner {
        grid-template-columns: 1fr 1fr;
        padding: 3rem 1.5rem 2rem;
        gap: 2rem;
    }

    .footer-brand {
        grid-column: 1 / -1;
    }

    .footer-bottom-inner {
        width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.4rem;
    }
}

@media (max-width: 400px) {
    .footer-inner {
        grid-template-columns: 1fr;
    }
}
</style>