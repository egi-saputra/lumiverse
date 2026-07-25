import { ref, computed, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Link } from "@inertiajs/vue3";
import { MegaphoneIcon, PlusIcon, CalendarDaysIcon, PhotoIcon, VideoCameraIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const PER_PAGE = 8;
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    pengumuman: { type: Array, default: () => [] },
    canManage: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const currentPage = ref(1);
    const totalPages = computed(() => Math.max(1, Math.ceil(props.pengumuman.length / PER_PAGE)));
    const paginated = computed(() => {
      const s = (currentPage.value - 1) * PER_PAGE;
      return props.pengumuman.slice(s, s + PER_PAGE);
    });
    const prev = () => {
      if (currentPage.value > 1) currentPage.value--;
    };
    const next = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };
    const formatDate = (iso) => new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    const excerpt = (html, len = 130) => {
      const plain = (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      return plain.length > len ? plain.slice(0, len) + "…" : plain;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto space-y-6"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(MegaphoneIcon), { class: "w-6 h-6" }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white"${_scopeId}>Informasi Terkini</h1><p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"${_scopeId}>${ssrInterpolate(__props.pengumuman.length)} pengumuman tersedia </p></div></div>`);
            if (__props.canManage) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("pengumuman.create"),
                class: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(PlusIcon), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                    _push3(` Buat Pengumuman `);
                  } else {
                    return [
                      createVNode(unref(PlusIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Buat Pengumuman ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.pengumuman.length === 0) {
              _push2(`<div class="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl py-20 text-center space-y-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(MegaphoneIcon), { class: "w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" }, null, _parent2, _scopeId));
              _push2(`<p class="text-gray-400 dark:text-gray-500 italic text-sm"${_scopeId}>Belum ada pengumuman.</p></div>`);
            } else {
              _push2(`<ul class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(paginated.value, (item) => {
                _push2(`<li${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("pengumuman.show", item.id),
                  class: "group flex items-start gap-4 p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex-1 min-w-0"${_scopeId2}><h2 class="font-bold text-base text-gray-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"${_scopeId2}>${ssrInterpolate(item.judul)}</h2><p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2"${_scopeId2}>${ssrInterpolate(excerpt(item.pengumuman))}</p><div class="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500"${_scopeId2}><span class="flex items-center gap-1"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(CalendarDaysIcon), { class: "w-3.5 h-3.5" }, null, _parent3, _scopeId2));
                      _push3(` ${ssrInterpolate(formatDate(item.created_at))}</span>`);
                      if (item.user) {
                        _push3(`<span class="hidden sm:inline"${_scopeId2}> oleh <strong class="text-gray-600 dark:text-gray-300"${_scopeId2}>${ssrInterpolate(item.user.name)}</strong></span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      if (item.file_path) {
                        _push3(`<span class="flex items-center gap-1 text-indigo-400"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(PhotoIcon), { class: "w-3.5 h-3.5" }, null, _parent3, _scopeId2));
                        _push3(` Gambar </span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      if (item.video_url) {
                        _push3(`<span class="flex items-center gap-1 text-purple-400"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(VideoCameraIcon), { class: "w-3.5 h-3.5" }, null, _parent3, _scopeId2));
                        _push3(` Video </span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div></div>`);
                      _push3(ssrRenderComponent(unref(ChevronRightIcon), { class: "shrink-0 w-5 h-5 mt-1 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("h2", { class: "font-bold text-base text-gray-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" }, toDisplayString(item.judul), 1),
                          createVNode("p", { class: "mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2" }, toDisplayString(excerpt(item.pengumuman)), 1),
                          createVNode("div", { class: "mt-2.5 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500" }, [
                            createVNode("span", { class: "flex items-center gap-1" }, [
                              createVNode(unref(CalendarDaysIcon), { class: "w-3.5 h-3.5" }),
                              createTextVNode(" " + toDisplayString(formatDate(item.created_at)), 1)
                            ]),
                            item.user ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "hidden sm:inline"
                            }, [
                              createTextVNode(" oleh "),
                              createVNode("strong", { class: "text-gray-600 dark:text-gray-300" }, toDisplayString(item.user.name), 1)
                            ])) : createCommentVNode("", true),
                            item.file_path ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: "flex items-center gap-1 text-indigo-400"
                            }, [
                              createVNode(unref(PhotoIcon), { class: "w-3.5 h-3.5" }),
                              createTextVNode(" Gambar ")
                            ])) : createCommentVNode("", true),
                            item.video_url ? (openBlock(), createBlock("span", {
                              key: 2,
                              class: "flex items-center gap-1 text-purple-400"
                            }, [
                              createVNode(unref(VideoCameraIcon), { class: "w-3.5 h-3.5" }),
                              createTextVNode(" Video ")
                            ])) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode(unref(ChevronRightIcon), { class: "shrink-0 w-5 h-5 mt-1 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" })
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul>`);
            }
            if (totalPages.value > 1) {
              _push2(`<div class="flex justify-center items-center gap-2 pt-2"${_scopeId}><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-white/10 disabled:opacity-40 transition"${_scopeId}>← Prev</button><span class="px-4 py-2 rounded-lg bg-white/50 dark:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}>${ssrInterpolate(currentPage.value)} / ${ssrInterpolate(totalPages.value)}</span><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-white/10 disabled:opacity-40 transition"${_scopeId}>Next →</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto space-y-6" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", { class: "p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md" }, [
                      createVNode(unref(MegaphoneIcon), { class: "w-6 h-6" })
                    ]),
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-xl sm:text-2xl font-bold text-gray-800 dark:text-white" }, "Informasi Terkini"),
                      createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400 mt-0.5" }, toDisplayString(__props.pengumuman.length) + " pengumuman tersedia ", 1)
                    ])
                  ]),
                  __props.canManage ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: _ctx.route("pengumuman.create"),
                    class: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(PlusIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Buat Pengumuman ")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
                ]),
                __props.pengumuman.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl py-20 text-center space-y-2"
                }, [
                  createVNode(unref(MegaphoneIcon), { class: "w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" }),
                  createVNode("p", { class: "text-gray-400 dark:text-gray-500 italic text-sm" }, "Belum ada pengumuman.")
                ])) : (openBlock(), createBlock("ul", {
                  key: 1,
                  class: "space-y-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(paginated.value, (item) => {
                    return openBlock(), createBlock("li", {
                      key: item.id
                    }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("pengumuman.show", item.id),
                        class: "group flex items-start gap-4 p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("h2", { class: "font-bold text-base text-gray-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" }, toDisplayString(item.judul), 1),
                            createVNode("p", { class: "mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2" }, toDisplayString(excerpt(item.pengumuman)), 1),
                            createVNode("div", { class: "mt-2.5 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500" }, [
                              createVNode("span", { class: "flex items-center gap-1" }, [
                                createVNode(unref(CalendarDaysIcon), { class: "w-3.5 h-3.5" }),
                                createTextVNode(" " + toDisplayString(formatDate(item.created_at)), 1)
                              ]),
                              item.user ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "hidden sm:inline"
                              }, [
                                createTextVNode(" oleh "),
                                createVNode("strong", { class: "text-gray-600 dark:text-gray-300" }, toDisplayString(item.user.name), 1)
                              ])) : createCommentVNode("", true),
                              item.file_path ? (openBlock(), createBlock("span", {
                                key: 1,
                                class: "flex items-center gap-1 text-indigo-400"
                              }, [
                                createVNode(unref(PhotoIcon), { class: "w-3.5 h-3.5" }),
                                createTextVNode(" Gambar ")
                              ])) : createCommentVNode("", true),
                              item.video_url ? (openBlock(), createBlock("span", {
                                key: 2,
                                class: "flex items-center gap-1 text-purple-400"
                              }, [
                                createVNode(unref(VideoCameraIcon), { class: "w-3.5 h-3.5" }),
                                createTextVNode(" Video ")
                              ])) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode(unref(ChevronRightIcon), { class: "shrink-0 w-5 h-5 mt-1 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" })
                        ]),
                        _: 2
                      }, 1032, ["href"])
                    ]);
                  }), 128))
                ])),
                totalPages.value > 1 ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "flex justify-center items-center gap-2 pt-2"
                }, [
                  createVNode("button", {
                    onClick: prev,
                    disabled: currentPage.value === 1,
                    class: "px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-white/10 disabled:opacity-40 transition"
                  }, "← Prev", 8, ["disabled"]),
                  createVNode("span", { class: "px-4 py-2 rounded-lg bg-white/50 dark:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300" }, toDisplayString(currentPage.value) + " / " + toDisplayString(totalPages.value), 1),
                  createVNode("button", {
                    onClick: next,
                    disabled: currentPage.value === totalPages.value,
                    class: "px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-white/10 disabled:opacity-40 transition"
                  }, "Next →", 8, ["disabled"])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Pengumuman/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
