import { onMounted, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1, A as AboutSection } from "./AboutSection-CFGm2_By.js";
import { V as ValuesSection } from "./ValuesSection-DYw0Od39.js";
import { L as LegalitasSection } from "./LegalitasSection-WL5YB0Nn.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ Object.assign({
  layout: _sfc_main$1
}, {
  __name: "About",
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
            _push2(`<title${_scopeId}>About Us | Lumiverse School</title><meta head-key="description" name="description" content="Lumiverse merupakan sebuah platform Learning Management System berbasis cloud yang hadir untuk memberikan solusi dan kemudahan bagi sekolah dan intansi lembaga pendidikan lainnya di Indonesia."${_scopeId}><meta head-key="og:type" property="og:type" content="website"${_scopeId}><meta head-key="og:site_name" property="og:site_name" content="About Us | Lumiverse School"${_scopeId}><meta head-key="og:url" property="og:url" content="https://about.lumiverse.co.id/"${_scopeId}><meta head-key="og:title" property="og:title" content="About Us | Lumiverse School"${_scopeId}><meta head-key="og:description" property="og:description" content="Platform LMS gratis berbasis cloud untuk sekolah, pesantren, dan lembaga pendidikan di Indonesia. Kelola kelas, materi pembelajaran online, tugas harian siswa, ujian online, rekap nilai siswa otomatis, rapor digital, presensi siswa, rekap absensi siswa otomatis dalam satu sistem."${_scopeId}><meta head-key="og:image" property="og:image" content="https://about.lumiverse.co.id/og-image-about.jpg"${_scopeId}><meta head-key="og:locale" property="og:locale" content="id_ID"${_scopeId}><meta head-key="twitter:card" name="twitter:card" content="summary_large_image"${_scopeId}><meta head-key="twitter:title" name="twitter:title" content="Lumiverse — Sistem LMS Sekolah Berbasis Cloud"${_scopeId}><meta head-key="twitter:description" name="twitter:description" content="LMS cloud untuk sekolah dan lembaga pendidikan di Indonesia. Cepat, aman, dan mudah digunakan guru maupun siswa."${_scopeId}><meta head-key="twitter:image" name="twitter:image" content="https://about.lumiverse.co.id/og-image-about.jpg"${_scopeId}><link head-key="canonical" rel="canonical" href="https://about.lumiverse.co.id/"${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, "About Us | Lumiverse School"),
              createVNode("meta", {
                "head-key": "description",
                name: "description",
                content: "Lumiverse merupakan sebuah platform Learning Management System berbasis cloud yang hadir untuk memberikan solusi dan kemudahan bagi sekolah dan intansi lembaga pendidikan lainnya di Indonesia."
              }),
              createVNode("meta", {
                "head-key": "og:type",
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                "head-key": "og:site_name",
                property: "og:site_name",
                content: "About Us | Lumiverse School"
              }),
              createVNode("meta", {
                "head-key": "og:url",
                property: "og:url",
                content: "https://about.lumiverse.co.id/"
              }),
              createVNode("meta", {
                "head-key": "og:title",
                property: "og:title",
                content: "About Us | Lumiverse School"
              }),
              createVNode("meta", {
                "head-key": "og:description",
                property: "og:description",
                content: "Platform LMS gratis berbasis cloud untuk sekolah, pesantren, dan lembaga pendidikan di Indonesia. Kelola kelas, materi pembelajaran online, tugas harian siswa, ujian online, rekap nilai siswa otomatis, rapor digital, presensi siswa, rekap absensi siswa otomatis dalam satu sistem."
              }),
              createVNode("meta", {
                "head-key": "og:image",
                property: "og:image",
                content: "https://about.lumiverse.co.id/og-image-about.jpg"
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
                content: "Lumiverse — Sistem LMS Sekolah Berbasis Cloud"
              }),
              createVNode("meta", {
                "head-key": "twitter:description",
                name: "twitter:description",
                content: "LMS cloud untuk sekolah dan lembaga pendidikan di Indonesia. Cepat, aman, dan mudah digunakan guru maupun siswa."
              }),
              createVNode("meta", {
                "head-key": "twitter:image",
                name: "twitter:image",
                content: "https://about.lumiverse.co.id/og-image-about.jpg"
              }),
              createVNode("link", {
                "head-key": "canonical",
                rel: "canonical",
                href: "https://about.lumiverse.co.id/"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(AboutSection, null, null, _parent));
      _push(ssrRenderComponent(ValuesSection, null, null, _parent));
      _push(ssrRenderComponent(LegalitasSection, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home/About.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
