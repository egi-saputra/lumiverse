import { withCtx, unref, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Link } from "@inertiajs/vue3";
import { ArrowLeftIcon, UserIcon, UsersIcon, CalendarDaysIcon } from "@heroicons/vue/24/outline";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    pesan: { type: Object, required: true }
  },
  setup(__props) {
    const labelPenerima = (item) => {
      if (item.penerima === "semua") return "Semua User";
      if (item.penerima === "siswa") {
        return item.kelas ? `Kelas ${item.kelas.kelas}` : "Semua Siswa";
      }
      return item.penerima.charAt(0).toUpperCase() + item.penerima.slice(1);
    };
    const formatDate = (iso) => new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto px-4 space-y-6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("pesan.index"),
              class: "inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                  _push3(` Kembali `);
                } else {
                  return [
                    createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Kembali ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<article class="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden"${_scopeId}><div class="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"${_scopeId}></div><div class="p-6 sm:p-10 space-y-6"${_scopeId}><h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight"${_scopeId}>${ssrInterpolate(__props.pesan.judul)}</h1><div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400"${_scopeId}><span class="flex items-center gap-1.5"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(UserIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Dari: <strong class="text-gray-700 dark:text-gray-200 ml-1"${_scopeId}>${ssrInterpolate(__props.pesan.pengirim.name)}</strong></span><span class="flex items-center gap-1.5"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(UsersIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Kepada: <strong class="text-gray-700 dark:text-gray-200 ml-1"${_scopeId}>${ssrInterpolate(labelPenerima(__props.pesan))}</strong></span><span class="flex items-center gap-1.5"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CalendarDaysIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(formatDate(__props.pesan.created_at))}</span></div><hr class="border-gray-200 dark:border-white/10"${_scopeId}><div class="ql-display max-w-none text-gray-700 dark:text-gray-200 leading-relaxed text-base"${_scopeId}>${__props.pesan.isi ?? ""}</div></div></article></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto px-4 space-y-6" }, [
                createVNode(unref(Link), {
                  href: _ctx.route("pesan.index"),
                  class: "inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Kembali ")
                  ]),
                  _: 1
                }, 8, ["href"]),
                createVNode("article", { class: "rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden" }, [
                  createVNode("div", { class: "h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" }),
                  createVNode("div", { class: "p-6 sm:p-10 space-y-6" }, [
                    createVNode("h1", { class: "text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight" }, toDisplayString(__props.pesan.judul), 1),
                    createVNode("div", { class: "flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400" }, [
                      createVNode("span", { class: "flex items-center gap-1.5" }, [
                        createVNode(unref(UserIcon), { class: "w-4 h-4" }),
                        createTextVNode(" Dari: "),
                        createVNode("strong", { class: "text-gray-700 dark:text-gray-200 ml-1" }, toDisplayString(__props.pesan.pengirim.name), 1)
                      ]),
                      createVNode("span", { class: "flex items-center gap-1.5" }, [
                        createVNode(unref(UsersIcon), { class: "w-4 h-4" }),
                        createTextVNode(" Kepada: "),
                        createVNode("strong", { class: "text-gray-700 dark:text-gray-200 ml-1" }, toDisplayString(labelPenerima(__props.pesan)), 1)
                      ]),
                      createVNode("span", { class: "flex items-center gap-1.5" }, [
                        createVNode(unref(CalendarDaysIcon), { class: "w-4 h-4" }),
                        createTextVNode(" " + toDisplayString(formatDate(__props.pesan.created_at)), 1)
                      ])
                    ]),
                    createVNode("hr", { class: "border-gray-200 dark:border-white/10" }),
                    createVNode("div", {
                      class: "ql-display max-w-none text-gray-700 dark:text-gray-200 leading-relaxed text-base",
                      innerHTML: __props.pesan.isi
                    }, null, 8, ["innerHTML"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Pesan/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
