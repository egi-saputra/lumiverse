import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "nginx-default" }, _attrs))} data-v-b2200866><div class="content" data-v-b2200866><h1 data-v-b2200866>Welcome to nginx!</h1><p data-v-b2200866> If you see this page, the nginx web server is successfully installed and working. Further configuration is required. </p><p data-v-b2200866> For online documentation and support please refer to <a href="http://nginx.org/" target="_blank" data-v-b2200866>nginx.org</a>.<br data-v-b2200866> Commercial support is available at <a href="http://nginx.com/" target="_blank" data-v-b2200866>nginx.com</a>. </p><p data-v-b2200866><em data-v-b2200866>Thank you for using nginx.</em></p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Nginx.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Nginx = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-b2200866"]]);
export {
  Nginx as default
};
