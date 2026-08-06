<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()

const partnerProgramUrl = computed(() => {
    if (typeof window === 'undefined') {
        return 'https://partner.lumiverse.co.id/'
    }

    const hostname = window.location.hostname
    const port = window.location.port ? `:${window.location.port}` : ''
    const protocol = window.location.protocol

    const isLocal = hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)

    if (isLocal) {
        return `${protocol}//partner.localhost${port}/`
    }

    return `${protocol}//partner.lumiverse.co.id/`
})

const docsUrl = computed(() => {
    if (typeof window === 'undefined') {
        return 'https://docs.lumiverse.co.id/'
    }

    const hostname = window.location.hostname
    const port = window.location.port ? `:${window.location.port}` : ''
    const protocol = window.location.protocol

    const isLocal = hostname === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
    return isLocal ? `${protocol}//docs.localhost${port}/` : 'https://docs.lumiverse.co.id/'
})

const productLinks = [
    { href: '/', label: 'LMS Platform', anchor: true },
    { href: '/pricing-list', label: 'Pricing List', fullReload: true },
]
const companyLinks = computed(() => [
    { href: '/', label: 'Company Info' },
    { href: '/', label: 'Media Gallery' },
    { href: '/', label: 'Brand Resources' },
    { href: partnerProgramUrl.value, label: 'Partner Programs' },
])
const supportLinks = [
    { href: '/help', label: 'Help Center' },
    { href: docsUrl.value, label: 'Documentation' },
    { href: 'mailto:info@lumiverse.co.id', label: 'Email Support' },
    { href: 'https://wa.me/+628987504976', label: 'WhatsApp Support', external: true },
]
</script>

<template>
    <footer class="footer" id="kontak" role="contentinfo">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <!-- Brand -->
                    <div class="footer-brand-row">
                        <img src="/images/logo-dark.webp" alt="Lumiverse"
                            class="sm:h-10 h-9 object-cover scale-150 mt-1" />
                        <div class="font-semibold sm:text-3xl text-2xl">Lumiverse <span class="text-cyan">School</span>
                        </div>
                    </div>

                    <!-- Social Links -->
                    <div class="footer-socials">
                        <a href="https://instagram.com/lumiplatforms" class="social-link" aria-label="Instagram"
                            target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>

                        <!-- LinkedIn -->
                        <!-- <a href="https://linkedin.com/company/lumiplatforms" class="social-link" aria-label="LinkedIn"
                            target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </a> -->

                        <!-- Youtube -->
                        <a href="https://youtube.com/@lumiverse" class="social-link" aria-label="YouTube"
                            target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                            </svg>
                        </a>

                        <!-- X (Twitter) -->
                        <a href="https://x.com/lumiplatforms" class="social-link" aria-label="X" target="_blank"
                            rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>

                        <!-- Facebook -->
                        <a href="https://facebook.com/lumiplatforms" class="social-link" aria-label="Facebook"
                            target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.774-1.63 1.567v1.88h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
                            </svg>
                        </a>

                        <!-- Threads -->
                        <!-- <a href="https://threads.net/@lumiplatforms" class="social-link" aria-label="Threads"
                            target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.574.878-6.428 2.523-8.482C5.845 1.205 8.598.024 12.179 0h.014c2.746.02 5.032.725 6.79 2.098 1.657 1.294 2.81 3.13 3.428 5.458l-2.007.537c-1.02-3.842-3.6-5.79-7.665-5.79h-.011c-3.44.024-6.207 1.31-7.696 3.635-1.29 2.014-1.55 4.618-1.575 6.055.025 1.436.284 4.038 1.575 6.052 1.489 2.323 4.256 3.61 7.696 3.635h.008c3.02-.021 4.939-1.06 6.055-3.264.635-1.256.895-2.646.99-3.87-.53.297-1.16.532-1.885.696-1.395.317-2.98.234-4.375-.42-1.66-.78-2.58-2.24-2.53-4.01.05-1.756 1.15-3.19 2.94-3.83 1.87-.665 3.9-.29 5.365.98a4.94 4.94 0 0 1 .89 1.05c.31-1.03.31-2.13-.06-3.05-.62-1.54-2.29-2.44-4.71-2.53l-.02-2.002c3.135.113 5.42 1.49 6.44 4.033.63 1.57.575 3.335-.16 5.02.01.05.02.1.03.15.29 1.61.02 4.15-1.08 6.28-1.42 2.75-3.85 4.15-7.18 4.176z" />
                            </svg>
                        </a> -->

                        <!-- TikTok -->
                        <a href="https://tiktok.com/@lumiplatforms" class="social-link" aria-label="TikTok"
                            target="_blank" rel="noopener">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M16.6 5.82c-1.02-.9-1.6-2.19-1.6-3.51V2h-3.34v13.61c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1 0-5.44c.28 0 .55.04.8.12v-3.4a6.08 6.08 0 0 0-.8-.06 6.12 6.12 0 0 0 0 12.24c3.38 0 6.12-2.74 6.12-6.12V8.34a8.9 8.9 0 0 0 5.14 1.65V6.65c-1.13 0-2.18-.35-3.6-1.6z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Produk -->
                <div>
                    <div class="footer-col-title">Products</div>
                    <nav class="footer-links" aria-label="Product links">
                        <template v-for="link in productLinks" :key="link.label">
                            <a v-if="link.fullReload" :href="link.href">{{ link.label }}</a>
                            <Link v-else :href="link.href" prefetch="hover">{{ link.label }}</Link>
                        </template>
                    </nav>
                </div>

                <!-- Perusahaan -->
                <div>
                    <div class="footer-col-title">About us</div>
                    <nav class="footer-links" aria-label="Company links">
                        <template v-for="link in companyLinks" :key="link.label">
                            <Link v-if="link.href.startsWith('/')" :href="link.href" prefetch="hover">
                                {{ link.label }}
                            </Link>
                            <a v-else :href="link.href">{{ link.label }}</a>
                        </template>
                    </nav>
                </div>

                <!-- Bantuan -->
                <div>
                    <div class="footer-col-title">Contact us</div>
                    <nav class="footer-links" aria-label="Support links">
                        <template v-for="link in supportLinks" :key="link.label">
                            <Link v-if="link.href.startsWith('/')" :href="link.href" prefetch="hover">
                                {{ link.label }}
                            </Link>
                            <a v-else :href="link.href" :target="link.external ? '_blank' : undefined"
                                :rel="link.external ? 'noopener noreferrer' : undefined">
                                {{ link.label }}
                            </a>
                        </template>
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
                    <Link href="/privasi" prefetch="hover">Kebijakan Privasi</Link>
                    <Link href="/syarat" prefetch="hover">Syarat & Ketentuan</Link>
                    <Link href="/cookie" prefetch="hover">Kelola Cookie</Link>
                    <!-- <a href="#legalitas">Legalitas</a> -->
                </nav>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    border-top: 1px solid var(--border);
    padding: 6rem 0 2.5rem;
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
    gap: 1.15rem;
}

.social-link {
    width: 42px;
    height: 42px;
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
    font-size: 1rem;
    font-weight: 600;
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

    .footer-col-title {
        font-size: 1rem;
    }

    .footer-socials {
        display: flex;
        gap: 0.75rem;
    }

    .footer-links a {
        font-size: 0.875rem;
        color: var(--muted);
        transition: color 0.2s;
    }
}
</style>