import { unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "402",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-b30fd882${_scopeId}>402 - This site has suspended and unpaid payment</title>`);
          } else {
            return [
              createVNode("title", null, "402 - This site has suspended and unpaid payment")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="nginx-page" data-v-b30fd882><div class="container" data-v-b30fd882><h1 data-v-b30fd882>Payment Required</h1><p data-v-b30fd882> If you see this page, the server has been temporarily suspended due to an unpaid invoice. </p><p data-v-b30fd882> Please complete your payment to restore service access. </p><p data-v-b30fd882> For support, contact your hosting provider. </p><hr data-v-b30fd882><p data-v-b30fd882><em data-v-b30fd882>Thank you for using our services.</em></p><p class="footer" data-v-b30fd882><em data-v-b30fd882>KreatiCraft Indonesia</em></p></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/402.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _402 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b30fd882"]]);
export {
  _402 as default
};
