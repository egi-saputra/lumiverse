import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main$1 = {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const productLinks = [
      { href: "/", label: "LMS Platform", anchor: true },
      { href: "/", label: "Pricing List", anchor: true }
      // { href: '/', label: 'Blog' },
      // { href: '/', label: 'Cashtify Lite', anchor: true },
      // { href: '/', label: 'Lumi Workspace', anchor: true },
      // { href: '/', label: 'KreatiCraft ID', anchor: true },
      // { href: '/', label: 'Roadmap' },
      // { href: '/', label: 'Changelog' },
      // { href: '/', label: 'Status Sistem' },
    ];
    const companyLinks = [
      { href: "/", label: "Company Info" },
      // { href: '/', label: 'Careers Info' },
      { href: "/", label: "Media Gallery" },
      { href: "/", label: "Brand Resources" },
      { href: "/", label: "Partner Programs" }
      // { href: '#testimonial', label: 'Testimoni', anchor: true },
      // { href: '/', label: 'Press Kit' },
    ];
    const supportLinks = [
      { href: "/", label: "Help Center" },
      { href: "/", label: "Documentation", anchor: true },
      // { href: '#docs', label: 'API Docs', anchor: true },
      // { href: '/', label: 'Video Tutorial' },
      { href: "mailto:info@lumiverse.co.id", label: "Email Support" },
      { href: "https://wa.me/+628987504976", label: "WhatsApp Support", external: true }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({
        class: "footer",
        id: "kontak",
        role: "contentinfo"
      }, _attrs))} data-v-4ad621b5><div class="container" data-v-4ad621b5><div class="footer-grid" data-v-4ad621b5><div data-v-4ad621b5><div class="footer-brand-row" data-v-4ad621b5><img src="/images/logo-dark.webp" alt="Lumiverse" class="sm:h-10 h-9 object-cover scale-150 mt-1" data-v-4ad621b5><div class="font-semibold sm:text-3xl text-2xl" data-v-4ad621b5>Lumiverse <span class="text-cyan" data-v-4ad621b5>School</span></div></div><div class="footer-socials" data-v-4ad621b5><a href="https://instagram.com/lumiplatforms" class="social-link" aria-label="Instagram" target="_blank" rel="noopener" data-v-4ad621b5><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-4ad621b5><rect x="2" y="2" width="20" height="20" rx="5" ry="5" data-v-4ad621b5></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" data-v-4ad621b5></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" data-v-4ad621b5></line></svg></a><a href="https://youtube.com/@lumiverse" class="social-link" aria-label="YouTube" target="_blank" rel="noopener" data-v-4ad621b5><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-4ad621b5><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" data-v-4ad621b5></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" data-v-4ad621b5></polygon></svg></a><a href="https://x.com/lumiplatforms" class="social-link" aria-label="X" target="_blank" rel="noopener" data-v-4ad621b5><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-4ad621b5><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" data-v-4ad621b5></path></svg></a><a href="https://facebook.com/lumiplatforms" class="social-link" aria-label="Facebook" target="_blank" rel="noopener" data-v-4ad621b5><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-4ad621b5><path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.774-1.63 1.567v1.88h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" data-v-4ad621b5></path></svg></a><a href="https://tiktok.com/@lumiplatforms" class="social-link" aria-label="TikTok" target="_blank" rel="noopener" data-v-4ad621b5><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-4ad621b5><path d="M16.6 5.82c-1.02-.9-1.6-2.19-1.6-3.51V2h-3.34v13.61c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1 0-5.44c.28 0 .55.04.8.12v-3.4a6.08 6.08 0 0 0-.8-.06 6.12 6.12 0 0 0 0 12.24c3.38 0 6.12-2.74 6.12-6.12V8.34a8.9 8.9 0 0 0 5.14 1.65V6.65c-1.13 0-2.18-.35-3.6-1.6z" data-v-4ad621b5></path></svg></a></div></div><div data-v-4ad621b5><div class="footer-col-title" data-v-4ad621b5>Products</div><nav class="footer-links" aria-label="Product links" data-v-4ad621b5><!--[-->`);
      ssrRenderList(productLinks, (link) => {
        _push(`<a${ssrRenderAttr("href", link.href)} data-v-4ad621b5>${ssrInterpolate(link.label)}</a>`);
      });
      _push(`<!--]--></nav></div><div data-v-4ad621b5><div class="footer-col-title" data-v-4ad621b5>About us</div><nav class="footer-links" aria-label="Company links" data-v-4ad621b5><!--[-->`);
      ssrRenderList(companyLinks, (link) => {
        _push(`<a${ssrRenderAttr("href", link.href)} data-v-4ad621b5>${ssrInterpolate(link.label)}</a>`);
      });
      _push(`<!--]--></nav></div><div data-v-4ad621b5><div class="footer-col-title" data-v-4ad621b5>Contact us</div><nav class="footer-links" aria-label="Support links" data-v-4ad621b5><!--[-->`);
      ssrRenderList(supportLinks, (link) => {
        _push(`<a${ssrRenderAttr("href", link.href)}${ssrRenderAttr("target", link.external ? "_blank" : void 0)}${ssrRenderAttr("rel", link.external ? "noopener noreferrer" : void 0)} data-v-4ad621b5>${ssrInterpolate(link.label)}</a>`);
      });
      _push(`<!--]--></nav></div></div><div class="footer-bottom" data-v-4ad621b5><p class="footer-legal-text" data-v-4ad621b5> © 2026 PT Lumi Platforms Indonesia. <span class="sm:inline-flex hidden" data-v-4ad621b5>Hak cipta dilindungi undang-undang.</span><span class="inline-flex sm:hidden" data-v-4ad621b5>All rights reserved.</span></p><nav class="footer-legal-links" aria-label="Legal links" data-v-4ad621b5><a href="/privasi" data-v-4ad621b5>Kebijakan Privasi</a><a href="/syarat" data-v-4ad621b5>Syarat &amp; Ketentuan</a><a href="/cookie" data-v-4ad621b5>Kelola Cookie</a></nav></div></div></footer>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4ad621b5"]]);
const _sfc_main = {
  __name: "LegalitasSection",
  __ssrInlineRender: true,
  setup(__props) {
    const items = [
      {
        icon: "🏢",
        title: "Badan Hukum",
        num: "PT Lumi Platforms Indonesia",
        desc: "Terdaftar sebagai Perseroan Terbatas di Indonesia sesuai UU No. 40 Tahun 2007."
      },
      {
        icon: "📋",
        title: "NIB & SIUP",
        num: "NIB: 0306260081148",
        desc: "Nomor Induk Berusaha terdaftar di OSS Kemenko Perekonomian RI."
      },
      {
        icon: "🔒",
        title: "Keamanan Data",
        num: "ISO/IEC 27001:2022",
        desc: "Sistem keamanan informasi bersertifikasi internasional. Data sekolah Anda terlindungi penuh."
      },
      {
        icon: "⚖️",
        title: "Kepatuhan PDP",
        num: "UU No. 27 Tahun 2022",
        desc: "Patuh pada Undang-Undang Perlindungan Data Pribadi Republik Indonesia."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "legal-section",
        id: "legalitas",
        "aria-labelledby": "legal-title"
      }, _attrs))} data-v-b9b4b579><div class="container" data-v-b9b4b579><div class="section-header centered reveal" data-v-b9b4b579><div class="section-eyebrow" data-v-b9b4b579>Legalitas &amp; Keamanan</div><h2 class="section-title" id="legal-title" data-v-b9b4b579> Terpercaya &amp; Legal di Indonesia </h2><p class="section-desc" data-v-b9b4b579> Lumiverse beroperasi dengan penuh kepatuhan hukum dan standar keamanan internasional dalam payung hukum PT Lumi Platforms Indonesia. </p></div><div class="legal-grid" data-v-b9b4b579><!--[-->`);
      ssrRenderList(items, (item, i) => {
        _push(`<div class="legal-card reveal" style="${ssrRenderStyle({ transitionDelay: `${i * 0.1}s` })}" data-v-b9b4b579><div class="legal-icon" data-v-b9b4b579>${ssrInterpolate(item.icon)}</div><div class="legal-title" data-v-b9b4b579>${ssrInterpolate(item.title)}</div><div class="legal-num" data-v-b9b4b579>${ssrInterpolate(item.num)}</div><div class="legal-desc" data-v-b9b4b579>${ssrInterpolate(item.desc)}</div></div>`);
      });
      _push(`<!--]--></div><div class="legal-note reveal" data-v-b9b4b579><p data-v-b9b4b579> Untuk verifikasi legalitas atau kerjasama institusional, hubungi: <a href="mailto:legal@lumiverse.co.id" data-v-b9b4b579>legal@lumiverse.co.id</a></p></div></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/LegalitasSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LegalitasSection = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b9b4b579"]]);
export {
  Footer as F,
  LegalitasSection as L
};
