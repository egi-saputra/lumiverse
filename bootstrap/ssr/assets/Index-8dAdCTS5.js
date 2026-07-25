import { computed, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { usePage, Link } from "@inertiajs/vue3";
import { InboxIcon, EnvelopeOpenIcon } from "@heroicons/vue/24/outline";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    pesan: { type: Array, default: () => [] }
  },
  setup(__props) {
    const page = usePage();
    const userRole = computed(() => page.props.auth?.role ?? "");
    const labelPenerima = (item) => {
      if (item.penerima === "semua") return "Semua User";
      if (item.penerima === "siswa") {
        return item.kelas ? `Kelas ${item.kelas.kelas}` : "Semua Siswa";
      }
      return item.penerima.charAt(0).toUpperCase() + item.penerima.slice(1);
    };
    const formatDate = (iso) => new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto space-y-6"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(InboxIcon), { class: "w-6 h-6" }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white leading-tight"${_scopeId}> Kotak Masuk </h1><p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5"${_scopeId}>${ssrInterpolate(__props.pesan.length)} pesan diterima (Tap pesan untuk membuka pesan) </p></div></div>`);
            if (["admin", "proktor"].includes(userRole.value)) {
              _push2(`<a${ssrRenderAttr("href", _ctx.route("pesan.create"))} class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition"${_scopeId}> ✉️ Kirim Pesan </a>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.pesan.length === 0) {
              _push2(`<div class="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl py-20 text-center"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(EnvelopeOpenIcon), { class: "w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" }, null, _parent2, _scopeId));
              _push2(`<p class="text-gray-400 dark:text-gray-500 italic text-sm"${_scopeId}>Tidak ada pesan masuk.</p></div>`);
            } else {
              _push2(`<ul class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.pesan, (item) => {
                _push2(`<li${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("pesan.show", item.id),
                  class: "group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur- shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex flex-col gap-2 w-full"${_scopeId2}><p class="mt-1 text-xs text-gray-400 dark:text-gray-500 truncate"${_scopeId2}>${ssrInterpolate(item.pengirim.name)} <span class="mx-1"${_scopeId2}>→</span> ${ssrInterpolate(labelPenerima(item))}</p><div class="flex w-full justify-between"${_scopeId2}><p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2"${_scopeId2}>${ssrInterpolate(item.isi.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim())}</p><span class="shrink-0 text-xs text-gray-400 dark:text-gray-500"${_scopeId2}>${ssrInterpolate(formatDate(item.created_at))}</span></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex flex-col gap-2 w-full" }, [
                          createVNode("p", { class: "mt-1 text-xs text-gray-400 dark:text-gray-500 truncate" }, [
                            createTextVNode(toDisplayString(item.pengirim.name) + " ", 1),
                            createVNode("span", { class: "mx-1" }, "→"),
                            createTextVNode(" " + toDisplayString(labelPenerima(item)), 1)
                          ]),
                          createVNode("div", { class: "flex w-full justify-between" }, [
                            createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400 line-clamp-2" }, toDisplayString(item.isi.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()), 1),
                            createVNode("span", { class: "shrink-0 text-xs text-gray-400 dark:text-gray-500" }, toDisplayString(formatDate(item.created_at)), 1)
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto space-y-6" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", { class: "p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md" }, [
                      createVNode(unref(InboxIcon), { class: "w-6 h-6" })
                    ]),
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-xl sm:text-2xl font-bold text-gray-800 dark:text-white leading-tight" }, " Kotak Masuk "),
                      createVNode("p", { class: "text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5" }, toDisplayString(__props.pesan.length) + " pesan diterima (Tap pesan untuk membuka pesan) ", 1)
                    ])
                  ]),
                  ["admin", "proktor"].includes(userRole.value) ? (openBlock(), createBlock("a", {
                    key: 0,
                    href: _ctx.route("pesan.create"),
                    class: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition"
                  }, " ✉️ Kirim Pesan ", 8, ["href"])) : createCommentVNode("", true)
                ]),
                __props.pesan.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl py-20 text-center"
                }, [
                  createVNode(unref(EnvelopeOpenIcon), { class: "w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" }),
                  createVNode("p", { class: "text-gray-400 dark:text-gray-500 italic text-sm" }, "Tidak ada pesan masuk.")
                ])) : (openBlock(), createBlock("ul", {
                  key: 1,
                  class: "space-y-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.pesan, (item) => {
                    return openBlock(), createBlock("li", {
                      key: item.id
                    }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("pesan.show", item.id),
                        class: "group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur- shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-col gap-2 w-full" }, [
                            createVNode("p", { class: "mt-1 text-xs text-gray-400 dark:text-gray-500 truncate" }, [
                              createTextVNode(toDisplayString(item.pengirim.name) + " ", 1),
                              createVNode("span", { class: "mx-1" }, "→"),
                              createTextVNode(" " + toDisplayString(labelPenerima(item)), 1)
                            ]),
                            createVNode("div", { class: "flex w-full justify-between" }, [
                              createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400 line-clamp-2" }, toDisplayString(item.isi.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()), 1),
                              createVNode("span", { class: "shrink-0 text-xs text-gray-400 dark:text-gray-500" }, toDisplayString(formatDate(item.created_at)), 1)
                            ])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["href"])
                    ]);
                  }), 128))
                ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Pesan/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
