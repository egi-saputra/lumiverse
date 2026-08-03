<script setup>
import { Link } from '@inertiajs/vue3'
import { computed, nextTick, onMounted, onUnmounted, provide, ref } from 'vue'

const sidebarOpen = ref(false)
const currentHash = ref(window.location.hash || '#overview')
const language = ref(localStorage.getItem('docs-language') || 'en')
const theme = ref(localStorage.getItem('docs-theme') || 'dark')
provide('docsLanguage', language)

const centralUrl = computed(() => {
    const hostname = window.location.hostname
    const port = window.location.port ? `:${window.location.port}` : ''
    const protocol = window.location.protocol
    const isLocal = hostname === 'localhost'
        || hostname.endsWith('.localhost')
        || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)

    return isLocal ? `${protocol}//localhost${port}` : 'https://lumiverse.co.id'
})

const helpUrl = computed(() => `${centralUrl.value}/help`)

const groups = [
    {
        title: { id: 'Memulai', en: 'Getting started' },
        items: [
            { id: 'overview', label: { id: 'Pengenalan', en: 'Overview' } },
            { id: 'setup', label: { id: 'Setup lembaga', en: 'Organization setup' } },
            { id: 'roles', label: { id: 'Peran pengguna', en: 'User roles' } },
        ],
    },
    {
        title: { id: 'Panduan', en: 'Guides' },
        items: [
            { id: 'admin', label: { id: 'Panduan admin', en: 'Admin guide' } },
            { id: 'teacher', label: { id: 'Panduan guru', en: 'Teacher guide' } },
            { id: 'student', label: { id: 'Panduan siswa', en: 'Student guide' } },
            { id: 'partner', label: { id: 'Program partner', en: 'Partner program' } },
        ],
    },
    {
        title: { id: 'Referensi', en: 'Reference' },
        items: [
            { id: 'api', label: { id: 'API & integrasi', en: 'API & integration' } },
            { id: 'security', label: { id: 'Keamanan', en: 'Security' } },
        ],
    },
]

const allItems = computed(() => groups.flatMap(group => group.items))

function setLanguage(value) {
    language.value = value
    localStorage.setItem('docs-language', value)
}

function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('docs-theme', theme.value)
}

function selectItem(id) {
    currentHash.value = `#${id}`
    sidebarOpen.value = false
}

function isActive(id) {
    return currentHash.value === `#${id}`
}

let sectionObserver

function updateActiveSection() {
    const sections = [...document.querySelectorAll('.docs-section')]
    const passedSections = sections.filter(section => section.getBoundingClientRect().top <= 140)
    const activeSection = passedSections.at(-1) || sections[0]

    if (!activeSection) return

    currentHash.value = `#${activeSection.id}`
    history.replaceState(null, '', currentHash.value)
}

function observeSections() {
    sectionObserver = new IntersectionObserver(() => updateActiveSection(), {
        rootMargin: '-110px 0px -55% 0px',
        threshold: [0, 0.1, 0.5],
    })

    document.querySelectorAll('.docs-section').forEach(section => sectionObserver.observe(section))
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    updateActiveSection()
}

onMounted(() => {
    nextTick(observeSections)
})

onUnmounted(() => {
    sectionObserver?.disconnect()
    window.removeEventListener('scroll', updateActiveSection)
})
</script>

<template>
    <div class="docs-shell" :class="{ 'docs-light': theme === 'light' }">
        <header class="docs-topbar">
            <div class="docs-topbar-inner">
                <button class="docs-menu-button" type="button" aria-label="Buka menu dokumentasi"
                    @click="sidebarOpen = !sidebarOpen">
                    <span></span><span></span><span></span>
                </button>
                <a :href="centralUrl" class="docs-brand">
                    <img src="/images/logo-dark.webp" alt="Lumiverse" class="brand-logo" />
                    <span>Lumiverse <b>Docs</b></span>
                </a>
                <nav class="docs-top-links">
                    <button type="button" class="theme-switch" :class="{ 'is-light': theme === 'light' }"
                        :aria-label="theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'"
                        @click="toggleTheme">
                        <span class="theme-icon" aria-hidden="true">{{ theme === 'dark' ? '☾' : '☼' }}</span>
                        <span class="theme-track" aria-hidden="true"><span class="theme-thumb"></span></span>
                        <span class="theme-label">{{ theme === 'dark' ? 'Dark' : 'Light' }}</span>
                    </button>
                    <a :href="centralUrl">Website</a>
                    <a :href="helpUrl">Support</a>
                </nav>
            </div>
        </header>

        <div class="docs-body">
            <div v-if="sidebarOpen" class="docs-overlay" @click="sidebarOpen = false"></div>
            <aside class="docs-sidebar" :class="{ open: sidebarOpen }">
                <div class="docs-sidebar-head">
                    <span class="sidebar-kicker">{{ language === 'en' ? 'DOCUMENTATION' : 'DOKUMENTASI' }}</span>
                    <span class="version-label">v1.0</span>
                </div>
                <div class="language-switcher" aria-label="Pilih bahasa">
                    <button type="button" :class="{ active: language === 'id' }" @click="setLanguage('id')">ID</button>
                    <button type="button" :class="{ active: language === 'en' }" @click="setLanguage('en')">EN</button>
                </div>
                <nav :aria-label="language === 'en' ? 'Documentation navigation' : 'Navigasi dokumentasi'">
                    <div v-for="group in groups" :key="group.title.id" class="docs-nav-group">
                        <p>{{ group.title[language] }}</p>
                        <a v-for="item in group.items" :key="item.id" :href="`#${item.id}`"
                            :class="{ active: isActive(item.id) }" @click="selectItem(item.id)">
                            <span class="nav-dot"></span>{{ item.label[language] }}
                        </a>
                    </div>
                </nav>
                <div class="docs-sidebar-foot">
                    <span>{{ language === 'en' ? 'Need help?' : 'Butuh bantuan?' }}</span>
                    <a :href="helpUrl">Help Center</a>
                </div>
            </aside>

            <main class="docs-content">
                <slot :all-items="allItems" />
            </main>
        </div>
    </div>
</template>

<style>
.docs-shell {
    min-height: 100vh;
    color: #e8f0f7;
    background: #08111c;
    font-family: var(--font-body);
}

.docs-topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    border-bottom: 1px solid rgba(153, 190, 214, 0.12);
    background: rgba(8, 17, 28, 0.9);
    backdrop-filter: blur(18px);
}

.docs-topbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: min(100% - 3rem, 1440px);
    min-height: 72px;
    margin: 0 auto;
}

.docs-brand {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    color: #f5fbff;
    font-family: var(--font-display);
    font-size: 1.02rem;
    font-weight: 700;
    text-decoration: none;
}

.docs-brand b {
    color: #62d9eb;
}

.brand-mark {
    display: grid;
    width: 30px;
    height: 30px;
    place-items: center;
    border-radius: 8px;
    background: #62d9eb;
    color: #08111c;
    font-weight: 900;
}

.docs-top-links {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.docs-top-links a,
.docs-sidebar-foot a,
.theme-switch {
    color: #8fa8b8;
    font-size: 0.78rem;
    text-decoration: none;
}

.theme-switch {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.25rem 0.35rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    cursor: pointer;
    transition: background 0.2s ease;
}

.brand-logo {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.theme-switch:hover {
    background: rgba(98, 217, 235, 0.08);
}

.theme-icon {
    width: 1rem;
    color: #62d9eb;
    font-size: 0.9rem;
    line-height: 1;
    text-align: center;
}

.theme-track {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 34px;
    height: 19px;
    padding: 2px;
    border: 1px solid rgba(98, 217, 235, 0.45);
    border-radius: 999px;
    background: rgba(98, 217, 235, 0.14);
    transition: background 0.2s ease, border-color 0.2s ease;
}

.theme-thumb {
    display: block;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #62d9eb;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
    transform: translateX(0);
    transition: transform 0.25s ease, background 0.2s ease;
}

.theme-switch.is-light .theme-track {
    border-color: rgba(8, 127, 148, 0.45);
    background: rgba(8, 127, 148, 0.13);
}

.theme-switch.is-light .theme-thumb {
    background: #087f94;
    transform: translateX(15px);
}

.theme-label {
    min-width: 2.3rem;
    font-size: 0.68rem;
    font-weight: 700;
    text-align: left;
}

.docs-top-links a:hover,
.docs-sidebar-foot a:hover,
.theme-switch:hover {
    color: #62d9eb;
}

.docs-light {
    color: #203342;
    background: #f5f8fa;
}

.docs-light .docs-topbar {
    border-bottom-color: rgba(32, 51, 66, 0.12);
    background: rgba(245, 248, 250, 0.9);
}

.docs-light .docs-brand,
.docs-light .docs-nav-group a:hover,
.docs-light .docs-nav-group a.active,
.docs-light .docs-sidebar-foot span,
.docs-light .docs-sidebar-foot a,
.docs-light .docs-top-links a,
.docs-light .theme-switch {
    color: #203342;
}

.docs-light .docs-brand b,
.docs-light .docs-top-links a:hover,
.docs-light .docs-sidebar-foot a:hover,
.docs-light .theme-switch:hover {
    color: #087f94;
}

.docs-light .docs-sidebar {
    scrollbar-color: rgba(8, 127, 148, 0.4) transparent;
}

.docs-light .docs-sidebar::-webkit-scrollbar-thumb {
    background: rgba(8, 127, 148, 0.4);
}

.docs-light .docs-nav-group a,
.docs-light .role-grid span,
.docs-light .muted-note,
.docs-light .split-section p,
.docs-light .step-list,
.docs-light .bullet-list,
.docs-light .docs-lead {
    color: #526b7a !important;
}

.docs-light .docs-hero h1,
.docs-light h2,
.docs-light .role-grid strong,
.docs-light .step-list b,
.docs-light .bullet-list b,
.docs-light .callout b {
    color: #203342 !important;
}

.docs-light .docs-hero h1 span,
.docs-light .docs-eyebrow,
.docs-light .section-index,
.docs-light .api-table code,
.docs-light .docs-contact a {
    color: #087f94 !important;
}

.docs-light .split-section,
.docs-light .docs-contact,
.docs-light .role-grid>div,
.docs-light .api-table>div {
    border-color: rgba(32, 51, 66, 0.14) !important;
}

.docs-light .role-grid>div,
.docs-light .callout {
    background: rgba(8, 127, 148, 0.055) !important;
}

.docs-light .code-block {
    border-color: rgba(32, 51, 66, 0.16);
    background: #e9f0f3 !important;
    color: #075f70 !important;
}

.docs-light .api-table span {
    color: #526b7a !important;
}

.docs-menu-button {
    display: none;
}

.docs-body {
    display: grid;
    grid-template-columns: 260px minmax(0, 900px);
    gap: clamp(3rem, 7vw, 8rem);
    width: min(100% - 3rem, 1440px);
    margin: 0 auto;
}

.docs-sidebar {
    position: sticky;
    top: 72px;
    display: flex;
    height: calc(100vh - 72px);
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    padding: 2.25rem 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(98, 217, 235, 0.35) transparent;
}

.docs-sidebar::-webkit-scrollbar {
    width: 5px;
}

.docs-sidebar::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(98, 217, 235, 0.35);
}

.language-switcher {
    display: inline-flex;
    align-self: flex-start;
    gap: 0.2rem;
    margin-bottom: 1.75rem;
    padding: 0.2rem;
    border: 1px solid rgba(153, 190, 214, 0.14);
    border-radius: 7px;
}

.language-switcher button {
    padding: 0.3rem 0.55rem;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: #708b9c;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    cursor: pointer;
}

.language-switcher button.active,
.language-switcher button:hover {
    background: rgba(98, 217, 235, 0.12);
    color: #62d9eb;
}

.docs-sidebar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.sidebar-kicker,
.version-label,
.docs-nav-group>p,
.sidebar-kicker {
    color: #708b9c;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.12em;
}

.version-label {
    color: #62d9eb;
    letter-spacing: 0;
    padding-right: 0.35rem;
}

.docs-nav-group {
    margin-bottom: 1.75rem;
}

.docs-nav-group>p {
    margin: 0 0 0.65rem;
    text-transform: uppercase;
}

.docs-nav-group a {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.55rem 0;
    color: #8fa8b8;
    font-size: 0.84rem;
    text-decoration: none;
    transition: color 0.2s ease, transform 0.2s ease;
}

.docs-nav-group a:hover,
.docs-nav-group a.active {
    color: #f5fbff;
    transform: translateX(3px);
}

.docs-nav-group a.active .nav-dot {
    background: #62d9eb;
    box-shadow: 0 0 0 4px rgba(98, 217, 235, 0.12);
}

.nav-dot {
    width: 5px;
    height: 5px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #425b6a;
}

.docs-sidebar-foot {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(153, 190, 214, 0.12);
}

.docs-sidebar-foot span {
    color: #708b9c;
    font-size: 0.74rem;
}

.docs-content {
    min-width: 0;
    padding: 5.5rem 0 7rem;
}

.docs-overlay {
    display: none;
}

@media (max-width: 800px) {

    .docs-topbar-inner,
    .docs-body {
        width: min(100% - 2rem, 640px);
    }

    .docs-menu-button {
        display: flex;
        width: 34px;
        flex-direction: column;
        gap: 4px;
        padding: 0.45rem;
        border: 0;
        background: transparent;
        cursor: pointer;
    }

    .docs-menu-button span {
        display: block;
        width: 20px;
        height: 2px;
        background: #8fa8b8;
    }

    .docs-top-links {
        display: flex;
    }

    .docs-top-links a {
        display: none;
    }

    .docs-body {
        display: block;
    }

    .docs-sidebar {
        position: fixed;
        top: 72px;
        left: 0;
        z-index: 15;
        width: min(290px, 85vw);
        padding: 2rem 1.5rem;
        background: #0b1825;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
    }

    .docs-sidebar.open {
        transform: translateX(0);
    }

    .docs-overlay {
        position: fixed;
        inset: 72px 0 0;
        z-index: 14;
        display: block;
        background: rgba(0, 0, 0, 0.5);
    }

    .docs-content {
        padding: 3.5rem 0 5rem;
    }
}
</style>
