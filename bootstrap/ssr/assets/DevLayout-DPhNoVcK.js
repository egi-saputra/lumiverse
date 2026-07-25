import { onMounted, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { useForm, Link } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "DevLayout",
  __ssrInlineRender: true,
  setup(__props) {
    useForm({});
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    const navItems = [
      { label: "Dashboard", route: "developer.dashboard" },
      { label: "Tenant", route: "developer.tenants.index" },
      { label: "Paket / Plan", route: "developer.plans.index" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--midnight)] text-white" }, _attrs))}><aside class="fixed top-0 left-0 h-screen w-56 border-r border-[var(--border)] bg-[var(--navy)] flex flex-col z-50"><div class="px-5 py-5 flex items-center gap-2.5 border-b border-[var(--border)]"><div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--cyan-dim)] flex items-center justify-center text-[var(--midnight)] font-black text-sm"> L</div><span class="font-extrabold text-sm tracking-wide">LUMI <span class="text-[var(--cyan)]">DEV</span></span></div><nav class="flex-1 px-3 py-4 flex flex-col gap-1"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(unref(Link), {
          key: item.route,
          href: _ctx.route(item.route),
          class: ["px-3 py-2 rounded-lg text-sm font-medium transition", _ctx.$page.url.startsWith("/" + item.route.split(".")[1]) ? "bg-[var(--cyan)]/10 text-[var(--cyan)]" : "text-[var(--muted)] hover:text-white hover:bg-white/5"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="px-3 py-4 border-t border-[var(--border)]"><button class="w-full px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5 transition text-left"> Keluar </button></div></aside><div class="ml-56 min-h-screen">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/DevLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
