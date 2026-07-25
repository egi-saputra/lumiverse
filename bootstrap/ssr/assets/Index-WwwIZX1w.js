import { unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./UserLayout-bEWAD7gb.js";
import { Head } from "@inertiajs/vue3";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Homeroom Teacher" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-6"${_scopeId}><div class="mx-auto max-w-7xl"${_scopeId}><div class="bg-white dark:bg-[#0F172A] rounded-xl shadow p-8"${_scopeId}><h1 class="text-2xl font-bold text-gray-800 dark:text-white"${_scopeId}> Journal Online Prakerin </h1><p class="mt-4 text-gray-600 dark:text-gray-300"${_scopeId}> This feature is currently under development. </p><p class="mt-4 text-gray-600 dark:text-gray-300"${_scopeId}> Halaman ini sedang dalam tahap pengembangan. </p><p class="mt-4 text-gray-600 dark:text-gray-300"${_scopeId}> Halaman ini sedang menunggu budgeting masuk. </p></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "py-6" }, [
                createVNode("div", { class: "mx-auto max-w-7xl" }, [
                  createVNode("div", { class: "bg-white dark:bg-[#0F172A] rounded-xl shadow p-8" }, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-800 dark:text-white" }, " Journal Online Prakerin "),
                    createVNode("p", { class: "mt-4 text-gray-600 dark:text-gray-300" }, " This feature is currently under development. "),
                    createVNode("p", { class: "mt-4 text-gray-600 dark:text-gray-300" }, " Halaman ini sedang dalam tahap pengembangan. "),
                    createVNode("p", { class: "mt-4 text-gray-600 dark:text-gray-300" }, " Halaman ini sedang menunggu budgeting masuk. ")
                  ])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Journal/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
