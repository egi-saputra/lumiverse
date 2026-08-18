import MarkdownIt from "markdown-it";
import texmath from "markdown-it-texmath";
import katex from "katex";
import hljs from "markdown-it-highlightjs";
import DOMPurify from "dompurify";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css"; // 1 tema global untuk syntax highlighting, lihat catatan di bawah

// Regex kasar untuk deteksi paragraf/heading yang didominasi teks Arab
// (Arabic block U+0600–U+06FF, Arabic Supplement U+0750–U+077F).
const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F]/g;

function isArabicDominant(text) {
    if (!text) return false;
    const matches = text.match(ARABIC_RE);
    if (!matches) return false;
    return matches.length > text.length * 0.3;
}

const md = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: true,
})
    .use(texmath, {
        engine: katex,
        delimiters: "dollars", // cocok dengan format prompt AI: $...$ inline, $$...$$ block
        katexOptions: {
            throwOnError: false, // LaTeX sedikit invalid jangan bikin seluruh render crash
            output: "html", // skip MathML — kurangi tag yang perlu di-whitelist DOMPurify
        },
    })
    .use(hljs, {
        inline: false,
        auto: true, // auto-detect bahasa kalau AI lupa kasih label di fenced code block
    });

// Tambahkan dir="rtl" otomatis pada blok yang didominasi teks Arab, tanpa
// perlu AI menandainya secara eksplisit di markdown-nya.
function wrapWithDirection(tokens, idx, options, env, self, tag) {
    const contentToken = tokens[idx + 1];
    const rawText = contentToken?.content ?? "";
    const defaultRender = self.renderToken(tokens, idx, options);

    if (isArabicDominant(rawText)) {
        return defaultRender.replace(`<${tag}`, `<${tag} dir="rtl" lang="ar"`);
    }
    return defaultRender;
}

md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) =>
    wrapWithDirection(tokens, idx, options, env, self, "p");

md.renderer.rules.heading_open = (tokens, idx, options, env, self) =>
    wrapWithDirection(tokens, idx, options, env, self, tokens[idx].tag);

md.renderer.rules.list_item_open = (tokens, idx, options, env, self) =>
    wrapWithDirection(tokens, idx, options, env, self, "li");

// Center-kan cell tabel yang isinya murni angka (kolom "No"/"Langkah"/urutan),
// tanpa perlu tahu posisi kolomnya — dicek per-cell, bukan per-kolom, jadi
// otomatis benar untuk tabel apa pun yang di-generate AI.
function centerIfNumeric(tokens, idx, options, env, self, tag) {
    const contentToken = tokens[idx + 1];
    const rawText = (contentToken?.content ?? "").trim();
    const isPureNumber = /^\d+$/.test(rawText);
    const defaultRender = self.renderToken(tokens, idx, options);

    if (isPureNumber) {
        return defaultRender.replace(
            `<${tag}`,
            `<${tag} style="text-align:center"`,
        );
    }
    return defaultRender;
}

md.renderer.rules.td_open = (tokens, idx, options, env, self) =>
    centerIfNumeric(tokens, idx, options, env, self, "td");

// Whitelist tag & atribut yang diizinkan, biar tetap aman dari XSS
// (script, img, iframe, onclick, dll otomatis dibuang oleh DOMPurify).
//
// TAMBAHAN dari versi sebelumnya:
// - "span": dipakai internal oleh KaTeX (struktur rumus) & highlight.js (token warna kode)
// - "svg", "path": dipakai KaTeX untuk simbol akar (√), garis stretchy, dst
const ALLOWED_TAGS = [
    "p",
    "br",
    "hr",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "del",
    "mark",
    "code",
    "pre",
    "blockquote",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "span",
    "svg",
    "path",
];

// TAMBAHAN dari versi sebelumnya:
// - "class": WAJIB untuk KaTeX (.katex, .katex-display, dst) & highlight.js (.hljs-keyword,
//   .hljs-string, dst) — tanpa ini styling rumus & warna syntax kode hilang total
// - "style": WAJIB untuk KaTeX — dia melakukan positioning rumus (pecahan, pangkat, akar
//   bersarang) lewat inline style per elemen, bukan cuma lewat class. DOMPurify tetap
//   menyaring isi style dari nilai berbahaya (javascript:, expression, url(), dst)
// - "dir", "lang": untuk penandaan RTL otomatis pada teks Arab
// - atribut SVG (viewBox, width, height, d, dst): dipakai KaTeX untuk simbol akar
const ALLOWED_ATTR = [
    "href",
    "target",
    "rel",
    "class",
    "style",
    "dir",
    "lang",
    "viewBox",
    "width",
    "height",
    "preserveAspectRatio",
    "d",
    "xmlns",
    "focusable",
    "aria-hidden",
    "role",
];

export function renderMarkdown(text) {
    if (!text) return "";
    const rawHtml = md.render(text);
    return DOMPurify.sanitize(rawHtml, { ALLOWED_TAGS, ALLOWED_ATTR });
}
