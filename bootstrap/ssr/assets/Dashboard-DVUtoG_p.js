import { unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./DevLayout-DPhNoVcK.js";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto px-6 py-6"${_scopeId}><h1 class="text-xl font-extrabold mb-1"${_scopeId}>Dashboard</h1><p class="text-sm text-[var(--muted)]"${_scopeId}>Selamat datang di panel developer Lumiverse.</p></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto px-6 py-6" }, [
                createVNode("h1", { class: "text-xl font-extrabold mb-1" }, "Dashboard"),
                createVNode("p", { class: "text-sm text-[var(--muted)]" }, "Selamat datang di panel developer Lumiverse.")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Developer/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
