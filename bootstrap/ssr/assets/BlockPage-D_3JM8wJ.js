import { ref, onMounted, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "BlockPage",
  __ssrInlineRender: true,
  setup(__props) {
    const mounted = ref(false);
    const serverId = ref("7F3A2C91");
    const dueDate = ref("2 JUNI 2026");
    onMounted(() => {
      setTimeout(() => {
        mounted.value = true;
      }, 100);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "payment-wall" }, _attrs))} data-v-9412ade3><div class="grid-bg" data-v-9412ade3></div><div class="scanline" data-v-9412ade3></div><div class="noise" data-v-9412ade3></div><div class="orb orb-1" data-v-9412ade3></div><div class="orb orb-2" data-v-9412ade3></div><div class="orb orb-3" data-v-9412ade3></div><div class="container" data-v-9412ade3><div class="${ssrRenderClass([{ visible: mounted.value }, "badge"])}" data-v-9412ade3><span class="badge-dot" data-v-9412ade3></span><span data-v-9412ade3>SERVER STATUS</span></div><div class="${ssrRenderClass([{ visible: mounted.value }, "status-block"])}" data-v-9412ade3><div class="status-code" data-v-9412ade3><span class="digit" style="${ssrRenderStyle({ "--i": "0" })}" data-v-9412ade3>4</span><span class="digit" style="${ssrRenderStyle({ "--i": "1" })}" data-v-9412ade3>0</span><span class="digit" style="${ssrRenderStyle({ "--i": "2" })}" data-v-9412ade3>2</span></div><div class="status-divider" data-v-9412ade3></div><p class="status-label" data-v-9412ade3>PAYMENT REQUIRED</p></div><div class="${ssrRenderClass([{ visible: mounted.value }, "content"])}" data-v-9412ade3><h1 class="headline" data-v-9412ade3> Akses Ditangguhkan </h1><p class="subtext" data-v-9412ade3> Layanan server Anda telah dinonaktifkan sementara. </p><p class="subtext" data-v-9412ade3> Selesaikan pembayaran untuk mengaktifkan kembali server Anda. </p></div><div class="${ssrRenderClass([{ visible: mounted.value }, "info-card"])}" data-v-9412ade3><div class="info-row" data-v-9412ade3><div class="info-item" data-v-9412ade3><span class="info-label" data-v-9412ade3>Server ID</span><span class="info-value mono" data-v-9412ade3>SRV-${ssrInterpolate(serverId.value)}</span></div><div class="info-sep" data-v-9412ade3></div><div class="info-item" data-v-9412ade3><span class="info-label" data-v-9412ade3>Jatuh Tempo</span><span class="info-value urgent" data-v-9412ade3>${ssrInterpolate(dueDate.value)}</span></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/BlockPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BlockPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9412ade3"]]);
export {
  BlockPage as default
};
