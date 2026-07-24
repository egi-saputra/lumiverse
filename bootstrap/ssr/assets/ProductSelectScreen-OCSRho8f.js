import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "ProductSelectScreen",
  __ssrInlineRender: true,
  props: {
    error: {
      type: String,
      default: null
    }
  },
  emits: ["select"],
  setup(__props) {
    const products = [
      {
        type: "school",
        icon: "🏫",
        accent: "school",
        brand: "Lumi",
        name: "Classroom",
        tagline: "Untuk Sekolah / Lembaga Pendidikan",
        desc: "Platform manajemen sekolah lengkap dalam satu aplikasi.",
        features: ["Bank soal & Ujian online", "Materi & Tugas Harian", "Presensi & rekap Absensi otomatis", "Rekap nilai otomatis & Fitur Lainnya"]
      },
      {
        type: "workspace",
        icon: "🏢",
        accent: "workspace",
        brand: "Lumi",
        name: "Workspace",
        tagline: "Untuk Perusahaan / Korporat",
        desc: "Ruang kerja digital untuk kelola tim dan operasional harian.",
        features: ["Manajemen data karyawan", "Modul Pelatihan & Pengembangan", "Psikotest / Test masuk karyawan baru", "Pengumuman, informasi dan lainnya"]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "product-select" }, _attrs))} data-v-442899b7><div class="product-grid" data-v-442899b7><!--[-->`);
      ssrRenderList(products, (p) => {
        _push(`<button type="button" class="${ssrRenderClass([`product-card--${p.accent}`, "product-card"])}" data-v-442899b7><span class="product-card__glow" data-v-442899b7></span><span class="product-icon-wrap" data-v-442899b7><span class="product-icon" data-v-442899b7>${ssrInterpolate(p.icon)}</span></span><span class="product-name" data-v-442899b7>${ssrInterpolate(p.brand)} <span class="text-cyan" data-v-442899b7>${ssrInterpolate(p.name)}</span></span><span class="product-tagline" data-v-442899b7>${ssrInterpolate(p.tagline)}</span><span class="product-desc" data-v-442899b7>${ssrInterpolate(p.desc)}</span><ul class="product-features" data-v-442899b7><!--[-->`);
        ssrRenderList(p.features, (f) => {
          _push(`<li data-v-442899b7><span class="product-feature-dot" data-v-442899b7>✓</span>${ssrInterpolate(f)}</li>`);
        });
        _push(`<!--]--></ul><span class="product-cta" data-v-442899b7> Gunakan produk ini <span class="product-cta-arrow" data-v-442899b7>→</span></span></button>`);
      });
      _push(`<!--]--></div>`);
      if (__props.error) {
        _push(`<div class="field-error text-center" data-v-442899b7>${ssrInterpolate(__props.error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Tenant/Partials/ProductSelectScreen.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductSelectScreen = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-442899b7"]]);
export {
  ProductSelectScreen as default
};
