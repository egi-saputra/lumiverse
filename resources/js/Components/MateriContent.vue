<template>
    <div ref="rootEl" :class="{ dark: isDark }">
        <div class="materi-content" :class="{ 'materi-content--clamped': clamp && !expanded }" v-html="html"></div>
        <button v-if="clamp && showToggle" @click.stop.prevent="expanded = !expanded"
            class="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            {{ expanded ? 'Sembunyikan' : 'Baca selengkapnya' }}
        </button>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { renderMarkdown } from '@/Utils/markdown'

const props = defineProps({
    content: { type: String, default: '' },
    clamp: { type: Boolean, default: false }, // true = batasi tinggi (buat card list)
    showToggle: { type: Boolean, default: true }, // false = clamp tanpa tombol, cocok kalau parent-nya sendiri sudah bisa diklik (mis. <Link>)
})

const expanded = ref(false)
const html = computed(() => renderMarkdown(props.content))

// Deteksi dark mode langsung dari class `dark` di <html>, lalu terapkan
// sebagai class LOKAL di root komponen ini. Ini menghindari ketergantungan
// pada selector :global(.dark) di scoped CSS yang kadang tidak ter-compile
// konsisten saat dikombinasikan dengan :deep().
const isDark = ref(false)
let observer = null

const checkDark = () => {
    isDark.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
    checkDark()
    observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
    observer?.disconnect()
})
</script>

<style scoped>
.materi-content {
    max-width: 100%;
    overflow-wrap: break-word;
    word-break: break-word;
}

.materi-content :deep(h1),
.materi-content :deep(h2),
.materi-content :deep(h3) {
    font-weight: 700;
    margin-top: 1em;
    margin-bottom: 0.4em;
    color: #111827;
}

.materi-content :deep(h1) {
    font-size: 1.3rem;
}

.materi-content :deep(h2) {
    font-size: 1.15rem;
}

.materi-content :deep(h3) {
    font-size: 1rem;
}

.materi-content :deep(p) {
    margin-bottom: 0.75em;
    line-height: 1.7;
    color: #374151;
}

.materi-content :deep(strong) {
    font-weight: 700;
}

.materi-content :deep(em) {
    font-style: italic;
}

.materi-content :deep(ul),
.materi-content :deep(ol) {
    margin: 0.4em 0 1em 1.25em;
    line-height: 1.7;
    color: #374151;
}

.materi-content :deep(ul) {
    list-style: disc;
}

.materi-content :deep(ol) {
    list-style: decimal;
}

.materi-content :deep(li) {
    margin-bottom: 0.3em;
}

.materi-content :deep(blockquote) {
    border-left: 3px solid #93c5fd;
    padding-left: 0.75em;
    color: #4b5563;
    margin: 0.75em 0;
    font-style: italic;
}

.materi-content :deep(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.92em;
    color: #b91c1c;
    background: transparent;
    word-break: break-word;
    white-space: pre-wrap;
}

.materi-content :deep(pre) {
    overflow-x: auto;
    max-width: 100%;
    background: rgba(0, 0, 0, 0.06);
    padding: 0.75em 1em;
    border-radius: 0.5em;
    margin: 0.75em 0;
}

.materi-content :deep(pre code) {
    background: transparent;
    padding: 0;
    white-space: pre;
    color: inherit;
}

.materi-content :deep(hr) {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 1.1em 0;
}

.materi-content :deep(a) {
    color: #2563eb;
    text-decoration: underline;
    word-break: break-word;
}

.materi-content :deep(table) {
    display: block;
    overflow-x: auto;
    max-width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    font-size: 0.9em;
}

.materi-content :deep(th),
.materi-content :deep(td) {
    border: 1px solid #e5e7eb;
    padding: 0.5em 0.75em;
    vertical-align: top;
    color: #374151;
}

.materi-content :deep(th) {
    text-align: center;
}

.materi-content :deep(td) {
    text-align: left;
}

.materi-content :deep(th) {
    background: #f3f4f6;
    font-weight: 700;
    white-space: nowrap;
}

.materi-content :deep(tr:nth-child(even)) {
    background: #f9fafb;
}

/* Clamp mode: buat tampilan card, batasi tinggi biar gak makan tempat */
.materi-content--clamped {
    max-height: 6.5em;
    overflow: hidden;
    position: relative;
    mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
}

/* Dark mode — class `dark` sekarang diterapkan LOKAL di root komponen ini
   (lihat isDark di <script>), jadi tidak lagi pakai :global(.dark) */
.dark .materi-content :deep(h1),
.dark .materi-content :deep(h2),
.dark .materi-content :deep(h3) {
    color: #f9fafb;
}

.dark .materi-content :deep(p),
.dark .materi-content :deep(ul),
.dark .materi-content :deep(ol) {
    color: #e5e7eb;
}

.dark .materi-content :deep(blockquote) {
    color: #d1d5db;
    border-left-color: #3b82f6;
}

.dark .materi-content :deep(code) {
    color: #f87171;
}

.dark .materi-content :deep(pre) {
    background: rgba(255, 255, 255, 0.08);
}

.dark .materi-content :deep(pre code) {
    color: #e5e7eb;
}

.dark .materi-content :deep(hr) {
    border-top-color: #374151;
}

.dark .materi-content :deep(a) {
    color: #60a5fa;
}

.dark .materi-content :deep(th),
.dark .materi-content :deep(td) {
    border-color: #374151;
    color: #e5e7eb;
}

.dark .materi-content :deep(th) {
    background: #1f2937;
    color: #f9fafb;
}

.dark .materi-content :deep(tr:nth-child(even)) {
    background: rgba(255, 255, 255, 0.03);
}

/* Rumus blok ($$...$$) */
.materi-content :deep(.katex-display) {
    margin: 0.75em 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 0.25em;
    /* biar scrollbar horizontal gak nempel ke rumus */
}

/* Rumus inline ($...$) — cegah dia ikut ke-word-break seperti teks biasa */
.materi-content :deep(.katex) {
    word-break: normal;
    white-space: nowrap;
}

/* Blok/paragraf berbahasa Arab (dir="rtl" ditambahkan otomatis oleh renderMarkdown) */
.materi-content :deep([dir='rtl']) {
    text-align: right;
    font-family: 'Noto Naskh Arabic', 'Traditional Arabic', serif;
}

.dark .materi-content :deep(.katex) {
    color: #e5e7eb;
}
</style>