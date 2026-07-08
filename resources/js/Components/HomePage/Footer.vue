<script setup>
import { Link } from '@inertiajs/vue3'

const productLinks = [
    { href: '#fitur', label: 'Fitur', anchor: true },
    { href: '#harga', label: 'Harga', anchor: true },
    { href: '#docs', label: 'Dokumentasi', anchor: true },
    { href: '/changelog', label: 'Changelog' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/status', label: 'Status Sistem' },
]
const companyLinks = [
    { href: '/tentang', label: 'Tentang Kami' },
    { href: '/blog', label: 'Blog' },
    { href: '/karir', label: 'Karir' },
    { href: '/partner', label: 'Program Partner' },
    { href: '#testimonial', label: 'Testimoni', anchor: true },
    { href: '/press', label: 'Press Kit' },
]
const supportLinks = [
    { href: '/bantuan', label: 'Pusat Bantuan' },
    { href: '#docs', label: 'API Docs', anchor: true },
    { href: '/tutorial', label: 'Video Tutorial' },
    { href: 'mailto:hello@lumiverse.co.id', label: 'hello@lumiverse.co.id' },
    { href: 'https://wa.me/8987504976', label: 'WhatsApp Support', external: true },
]
</script>

<template>
    <footer class="footer" id="kontak" role="contentinfo">
        <div class="container">
            <div class="footer-grid">
                <!-- Brand -->
                <div>
                    <div class="footer-brand-row">
                        <img src="/images/logo-dark.png" alt="Lumiverse"
                            class="h-8 object-cover scale-150 sm:flex hidden" />
                        <div class="font-semibold text-3xl">Lumiverse</div>
                    </div>
                    <p class="footer-brand-desc">
                        The All in One Growth System Platform berbasis cloud terpercaya,
                        hadir untuk memberikan solusi dan kemudahan bagi sebuah bisnis, perusahaan atau lembaga
                        pendidikan.
                    </p>
                    <div class="footer-socials">
                        <a href="https://instagram.com/kreaticraft.id" class="social-link" aria-label="Instagram"
                            target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        <a href="https://linkedin.com/company/lumiplatforms" class="social-link" aria-label="LinkedIn"
                            target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </a>
                        <a href="https://youtube.com/@lumiverse" class="social-link" aria-label="YouTube"
                            target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Produk -->
                <div>
                    <div class="footer-col-title">Produk</div>
                    <nav class="footer-links" aria-label="Product links">
                        <a v-for="link in productLinks" :key="link.label" :href="link.href">
                            {{ link.label }}
                        </a>
                    </nav>
                </div>

                <!-- Perusahaan -->
                <div>
                    <div class="footer-col-title">Perusahaan</div>
                    <nav class="footer-links" aria-label="Company links">
                        <a v-for="link in companyLinks" :key="link.label" :href="link.href">
                            {{ link.label }}
                        </a>
                    </nav>
                </div>

                <!-- Bantuan -->
                <div>
                    <div class="footer-col-title">Bantuan</div>
                    <nav class="footer-links" aria-label="Support links">
                        <a v-for="link in supportLinks" :key="link.label" :href="link.href"
                            :target="link.external ? '_blank' : undefined"
                            :rel="link.external ? 'noopener noreferrer' : undefined">
                            {{ link.label }}
                        </a>
                    </nav>
                </div>
            </div>

            <div class="footer-bottom">
                <!-- <p class="footer-legal-text">
                    © 2026 PT Lumi Platforms Indonesia. Hak cipta dilindungi undang-undang.
                    <span class="sm:inline-block hidden"><span class="sep">|</span>
                        Bogor, Indonesia 🇮🇩</span>
                </p> -->
                <p class="footer-legal-text">
                    © 2026 PT Lumi Platforms Indonesia. <span class="sm:inline-flex hidden">Hak cipta dilindungi
                        undang-undang.</span><span class="inline-flex sm:hidden">All rights reserved.</span>
                </p>
                <nav class="footer-legal-links" aria-label="Legal links">
                    <a href="/privasi">Kebijakan Privasi</a>
                    <a href="/syarat">Syarat & Ketentuan</a>
                    <a href="/cookie">Cookie Policy</a>
                    <!-- <a href="#legalitas">Legalitas</a> -->
                </nav>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    border-top: 1px solid var(--border);
    padding: 4rem 0 2.5rem;
    position: relative;
    z-index: 1;
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
}

.footer-brand-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
}

.footer-logo-mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--cyan), var(--cyan-dim));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 0.95rem;
    color: var(--midnight);
}

.footer-brand-name {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.1rem;
}

.footer-brand-desc {
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.65;
    margin-bottom: 1.5rem;
}

.footer-socials {
    display: flex;
    gap: 0.75rem;
}

.social-link {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    color: var(--muted);
    transition: all 0.2s;
}

.social-link:hover {
    border-color: var(--cyan);
    color: var(--cyan);
}

.footer-col-title {
    font-family: var(--font-display);
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
}

.footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.footer-links a {
    font-size: 0.875rem;
    color: var(--muted);
    transition: color 0.2s;
}

.footer-links a:hover {
    color: var(--white);
}

.footer-bottom {
    border-top: 1px solid var(--border);
    padding-top: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.footer-legal-text {
    font-size: 0.8rem;
    color: var(--muted);
}

.sep {
    color: rgba(255, 255, 255, 0.1);
    margin: 0 0.5rem;
}

.footer-legal-links {
    display: flex;
    gap: 1.5rem;
}

.footer-legal-links a {
    font-size: 0.8rem;
    color: var(--muted);
    transition: color 0.2s;
}

.footer-legal-links a:hover {
    color: var(--white);
}

@media (max-width: 1024px) {
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 768px) {
    .container {
        padding: 0 0.75rem;
    }

    .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .footer-bottom {
        flex-direction: column;
        text-align: center;
    }
}
</style>