import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "ValuesSection",
  __ssrInlineRender: true,
  setup(__props) {
    const values = [
      { icon: "⚡", title: "Performance Matters", desc: "Dengan struktur sistem micro engine terpisah. Setiap fitur dirancang agar tetap cepat, responsif, dan stabil. Terutama pada bagian-bagian paling krusial yang membutuhkan performa dan stabilitas yang sangat baik untuk digunakan oleh jutaan pengguna secara bersamaan dan dapat memberikan pengalaman yang lebih mengesankan." },
      { icon: "🚀", title: "Fast by Default", desc: "Pengalaman yang cepat bukan fitur tambahan, tetapi standar kualitas produk. Kami menghilangkan proses manual yang tidak perlu dan membuang waktu." },
      { icon: "🤖", title: "Automate Everything", desc: "Setiap proses yang dapat diotomatisasi akan kami sederhanakan agar pengguna dapat fokus pada hal yang lebih bermakna." },
      { icon: "🎯", title: "Built for Simplicity", desc: "Teknologi yang kompleks kami sembunyikan di balik pengalaman pengguna yang sederhana dan mudah dipahami." },
      { icon: "🔒", title: "Security by Design", desc: "Dengan provisioning isolation system, setiap keamanan dan privasi data lembaga dapat terisolasi secara terpisah dan aman." },
      { icon: "✨", title: "Thoughtful Experience", desc: "Kami percaya pengalaman pengguna yang baik lebih penting daripada daftar fitur yang panjang namun tidak optimal." },
      { icon: "🔄", title: "Continuous Improvement", desc: "Kami terus mendengarkan masukan pengguna, untuk menghadirkan pembaruan yang lebih bermakna." },
      { icon: "❤️", title: "Built with Passion", desc: "Kami membangun Lumiverse School sebagai produk yang terus berkembang dengan visi dan misi yang panjang, bukan sekadar proyek digital yang selesai setelah diluncurkan." }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "about",
        class: "about-section",
        "aria-labelledby": "about-title"
      }, _attrs))} data-v-91eb7c10><div class="ambient" aria-hidden="true" data-v-91eb7c10><div class="orb orb--cyan" data-v-91eb7c10></div><div class="orb orb--violet" data-v-91eb7c10></div></div><div class="container" data-v-91eb7c10><div class="section-header reveal" data-v-91eb7c10><span class="section-eyebrow" data-v-91eb7c10>Prinsip &amp; Nilai Kami</span><h2 class="section-title" id="about-title" data-v-91eb7c10> Nilai yang membentuk <span class="text-gradient" data-v-91eb7c10>setiap langkah</span> kami </h2><p class="section-lede" data-v-91eb7c10> Delapan prinsip yang kami pegang dalam membangun Lumiverse School<br class="br-desktop" data-v-91eb7c10> bukan sekadar slogan tetapi cara kami bekerja setiap hari. </p></div><div class="values-bento" data-v-91eb7c10><!--[-->`);
      ssrRenderList(values, (val, i) => {
        _push(`<div class="${ssrRenderClass([`v-${i}`, "value-card reveal"])}" style="${ssrRenderStyle(`transition-delay: ${i * 0.08}s`)}" data-v-91eb7c10><span class="value-glow" aria-hidden="true" data-v-91eb7c10></span><div class="value-icon" data-v-91eb7c10>${ssrInterpolate(val.icon)}</div><h3 class="value-title" data-v-91eb7c10>${ssrInterpolate(val.title)}</h3><p class="value-desc" data-v-91eb7c10>${ssrInterpolate(val.desc)}</p></div>`);
      });
      _push(`<!--]--></div><div class="timeline" role="list" data-v-91eb7c10><!--[-->`);
      ssrRenderList(values, (val, i) => {
        _push(`<div class="${ssrRenderClass([{ "timeline-item--right": i % 2 !== 0 }, "timeline-item reveal"])}" style="${ssrRenderStyle(`transition-delay: ${i * 0.1}s`)}" role="listitem" data-v-91eb7c10><h4 class="timeline-title" data-v-91eb7c10>${ssrInterpolate(val.title)}</h4><div class="timeline-connector" aria-hidden="true" data-v-91eb7c10><div class="timeline-dot" data-v-91eb7c10></div><div class="timeline-line" data-v-91eb7c10></div></div><div class="timeline-content" data-v-91eb7c10><p class="timeline-desc" data-v-91eb7c10>${ssrInterpolate(val.desc)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/ValuesSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ValuesSection = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-91eb7c10"]]);
export {
  ValuesSection as V
};
