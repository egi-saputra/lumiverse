import { onMounted, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./HomeLayout-BfxWiMNu.js";
import { L as LegalitasSection } from "./LegalitasSection-WL5YB0Nn.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ Object.assign({ layout: _sfc_main$1 }, {
  __name: "Workspace",
  __ssrInlineRender: true,
  setup(__props) {
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud</title><meta head-key="description" name="description" content="Lumiverse Workspace adalah platform kolaborasi tim berbasis cloud untuk perusahaan dan korporasi di Indonesia. Kelola tim, proyek, dan alur kerja."${_scopeId}><meta head-key="og:type" property="og:type" content="website"${_scopeId}><meta head-key="og:url" property="og:url" content="https://workspace.lumiverse.co.id/"${_scopeId}><meta head-key="og:title" property="og:title" content="Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud"${_scopeId}><meta head-key="og:description" property="og:description" content="Platform kolaborasi dan manajemen kerja tim berbasis cloud untuk perusahaan dan korporasi di Indonesia. Cepat, aman, dan mudah digunakan."${_scopeId}><meta head-key="og:image" property="og:image" content="https://workspace.lumiverse.co.id/og-image-workspace.jpg"${_scopeId}><meta head-key="og:locale" property="og:locale" content="id_ID"${_scopeId}><meta head-key="twitter:card" name="twitter:card" content="summary_large_image"${_scopeId}><meta head-key="twitter:title" name="twitter:title" content="Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud"${_scopeId}><meta head-key="twitter:description" name="twitter:description" content="Platform kolaborasi tim berbasis cloud untuk perusahaan dan korporasi di Indonesia."${_scopeId}><meta head-key="twitter:image" name="twitter:image" content="https://workspace.lumiverse.co.id/og-image-workspace.jpg"${_scopeId}><link head-key="canonical" rel="canonical" href="https://workspace.lumiverse.co.id/"${_scopeId}><script type="application/ld+json"${_scopeId}>
            {
                &quot;@context&quot;: &quot;https://schema.org&quot;,
                &quot;@type&quot;: &quot;SoftwareApplication&quot;,
                &quot;name&quot;: &quot;Lumiverse Workspace&quot;,
                &quot;applicationCategory&quot;: &quot;BusinessApplication&quot;,
                &quot;operatingSystem&quot;: &quot;Web&quot;,
                &quot;url&quot;: &quot;https://workspace.lumiverse.co.id&quot;,
                &quot;description&quot;: &quot;Platform kolaborasi dan manajemen kerja tim berbasis cloud untuk perusahaan dan korporasi di Indonesia.&quot;,
                &quot;provider&quot;: {
                    &quot;@type&quot;: &quot;Organization&quot;,
                    &quot;name&quot;: &quot;PT Lumi Platforms Indonesia&quot;,
                    &quot;url&quot;: &quot;https://lumiverse.co.id&quot;,
                    &quot;logo&quot;: &quot;https://lumiverse.co.id/logo.svg&quot;,
                    &quot;address&quot;: { &quot;@type&quot;: &quot;PostalAddress&quot;, &quot;addressLocality&quot;: &quot;Bogor&quot;, &quot;addressCountry&quot;: &quot;ID&quot; },
                    &quot;contactPoint&quot;: {
                        &quot;@type&quot;: &quot;ContactPoint&quot;,
                        &quot;contactType&quot;: &quot;customer support&quot;,
                        &quot;email&quot;: &quot;info@lumiverse.co.id&quot;,
                        &quot;availableLanguage&quot;: [&quot;Indonesian&quot;, &quot;English&quot;]
                    },
                    &quot;sameAs&quot;: [
                        &quot;https://linkedin.com/company/lumiverse&quot;,
                        &quot;https://instagram.com/lumiverse&quot;
                    ]
                }
            }
        <\/script>`);
          } else {
            return [
              createVNode("title", null, "Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud"),
              createVNode("meta", {
                "head-key": "description",
                name: "description",
                content: "Lumiverse Workspace adalah platform kolaborasi tim berbasis cloud untuk perusahaan dan korporasi di Indonesia. Kelola tim, proyek, dan alur kerja."
              }),
              createVNode("meta", {
                "head-key": "og:type",
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                "head-key": "og:url",
                property: "og:url",
                content: "https://workspace.lumiverse.co.id/"
              }),
              createVNode("meta", {
                "head-key": "og:title",
                property: "og:title",
                content: "Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud"
              }),
              createVNode("meta", {
                "head-key": "og:description",
                property: "og:description",
                content: "Platform kolaborasi dan manajemen kerja tim berbasis cloud untuk perusahaan dan korporasi di Indonesia. Cepat, aman, dan mudah digunakan."
              }),
              createVNode("meta", {
                "head-key": "og:image",
                property: "og:image",
                content: "https://workspace.lumiverse.co.id/og-image-workspace.jpg"
              }),
              createVNode("meta", {
                "head-key": "og:locale",
                property: "og:locale",
                content: "id_ID"
              }),
              createVNode("meta", {
                "head-key": "twitter:card",
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                "head-key": "twitter:title",
                name: "twitter:title",
                content: "Lumiverse Workspace — Tools Kolaborasi Tim Berbasis Cloud"
              }),
              createVNode("meta", {
                "head-key": "twitter:description",
                name: "twitter:description",
                content: "Platform kolaborasi tim berbasis cloud untuk perusahaan dan korporasi di Indonesia."
              }),
              createVNode("meta", {
                "head-key": "twitter:image",
                name: "twitter:image",
                content: "https://workspace.lumiverse.co.id/og-image-workspace.jpg"
              }),
              createVNode("link", {
                "head-key": "canonical",
                rel: "canonical",
                href: "https://workspace.lumiverse.co.id/"
              }),
              createVNode("script", { type: "application/ld+json" }, '\n            {\n                "@context": "https://schema.org",\n                "@type": "SoftwareApplication",\n                "name": "Lumiverse Workspace",\n                "applicationCategory": "BusinessApplication",\n                "operatingSystem": "Web",\n                "url": "https://workspace.lumiverse.co.id",\n                "description": "Platform kolaborasi dan manajemen kerja tim berbasis cloud untuk perusahaan dan korporasi di Indonesia.",\n                "provider": {\n                    "@type": "Organization",\n                    "name": "PT Lumi Platforms Indonesia",\n                    "url": "https://lumiverse.co.id",\n                    "logo": "https://lumiverse.co.id/logo.svg",\n                    "address": { "@type": "PostalAddress", "addressLocality": "Bogor", "addressCountry": "ID" },\n                    "contactPoint": {\n                        "@type": "ContactPoint",\n                        "contactType": "customer support",\n                        "email": "info@lumiverse.co.id",\n                        "availableLanguage": ["Indonesian", "English"]\n                    },\n                    "sameAs": [\n                        "https://linkedin.com/company/lumiverse",\n                        "https://instagram.com/lumiverse"\n                    ]\n                }\n            }\n        ')
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(LegalitasSection, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home/Workspace.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
