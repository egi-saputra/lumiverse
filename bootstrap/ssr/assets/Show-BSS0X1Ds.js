import { computed, withCtx, unref, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Link, router } from "@inertiajs/vue3";
import { r as resolveEmbedUrl } from "./useEmbedUrl-gNXae2BC.js";
import { ArrowLeftIcon, PencilSquareIcon, TrashIcon, CalendarDaysIcon, UserIcon } from "@heroicons/vue/24/outline";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    pengumuman: { type: Object, required: true },
    canManage: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const formatDate = (iso) => new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const imageUrl = computed(() => props.pengumuman.file_url ?? null);
    const embedUrl = computed(() => resolveEmbedUrl(props.pengumuman.video_url));
    const hasRawUrl = computed(() => props.pengumuman.video_url && !embedUrl.value);
    const confirmDelete = () => {
      if (!confirm("Hapus pengumuman ini?")) return;
      router.delete(route("pengumuman.destroy", props.pengumuman.id));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto px-4 space-y-6"${_scopeId}><div class="flex items-center justify-between"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("pengumuman.index"),
              class: "inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                  _push3(` Back to List `);
                } else {
                  return [
                    createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Back to List ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (__props.canManage) {
              _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("pengumuman.edit", __props.pengumuman.id),
                class: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 transition"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                    _push3(` Edit `);
                  } else {
                    return [
                      createVNode(unref(PencilSquareIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Edit ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<button class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Hapus </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><article class="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden"${_scopeId}><div class="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"${_scopeId}></div><div class="p-6 sm:p-10 space-y-6"${_scopeId}><h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight"${_scopeId}>${ssrInterpolate(__props.pengumuman.judul)}</h1><div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400"${_scopeId}><span class="flex items-center gap-1.5"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CalendarDaysIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(formatDate(__props.pengumuman.created_at))}</span>`);
            if (__props.pengumuman.user) {
              _push2(`<span class="flex items-center gap-1.5"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(UserIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(__props.pengumuman.user.name)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><hr class="border-gray-200 dark:border-white/10"${_scopeId}>`);
            if (imageUrl.value) {
              _push2(`<div class="space-y-2"${_scopeId}><div class="flex justify-center bg-white rounded-xl border border-gray-200 overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", imageUrl.value)}${ssrRenderAttr("alt", __props.pengumuman.judul)} loading="lazy" decoding="async" class="max-w-full max-h-[600px] object-contain" style="${ssrRenderStyle({ "image-rendering": "auto" })}"${_scopeId}></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (embedUrl.value) {
              _push2(`<div class="pt-2"${_scopeId}><p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2"${_scopeId}> Video </p><div class="relative w-full rounded-xl overflow-hidden shadow-md" style="${ssrRenderStyle({ "padding-top": "56.25%" })}"${_scopeId}><iframe${ssrRenderAttr("src", embedUrl.value)} class="absolute inset-0 w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"${_scopeId}></iframe></div></div>`);
            } else if (hasRawUrl.value) {
              _push2(`<div class="pt-2"${_scopeId}><p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1"${_scopeId}> Link Video </p><a${ssrRenderAttr("href", __props.pengumuman.video_url)} target="_blank" rel="noopener noreferrer" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all"${_scopeId}>${ssrInterpolate(__props.pengumuman.video_url)}</a></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="ql-display max-w-none text-gray-700 dark:text-gray-200 leading-relaxed text-base"${_scopeId}>${__props.pengumuman.pengumuman ?? ""}</div></div></article></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto px-4 space-y-6" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode(unref(Link), {
                    href: _ctx.route("pengumuman.index"),
                    class: "inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Back to List ")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  __props.canManage ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex items-center gap-2"
                  }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("pengumuman.edit", __props.pengumuman.id),
                      class: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 transition"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(PencilSquareIcon), { class: "w-4 h-4" }),
                        createTextVNode(" Edit ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      onClick: confirmDelete,
                      class: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition"
                    }, [
                      createVNode(unref(TrashIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Hapus ")
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("article", { class: "rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden" }, [
                  createVNode("div", { class: "h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" }),
                  createVNode("div", { class: "p-6 sm:p-10 space-y-6" }, [
                    createVNode("h1", { class: "text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight" }, toDisplayString(__props.pengumuman.judul), 1),
                    createVNode("div", { class: "flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400" }, [
                      createVNode("span", { class: "flex items-center gap-1.5" }, [
                        createVNode(unref(CalendarDaysIcon), { class: "w-4 h-4" }),
                        createTextVNode(" " + toDisplayString(formatDate(__props.pengumuman.created_at)), 1)
                      ]),
                      __props.pengumuman.user ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "flex items-center gap-1.5"
                      }, [
                        createVNode(unref(UserIcon), { class: "w-4 h-4" }),
                        createTextVNode(" " + toDisplayString(__props.pengumuman.user.name), 1)
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("hr", { class: "border-gray-200 dark:border-white/10" }),
                    imageUrl.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-2"
                    }, [
                      createVNode("div", { class: "flex justify-center bg-white rounded-xl border border-gray-200 overflow-hidden" }, [
                        createVNode("img", {
                          src: imageUrl.value,
                          alt: __props.pengumuman.judul,
                          loading: "lazy",
                          decoding: "async",
                          class: "max-w-full max-h-[600px] object-contain",
                          style: { "image-rendering": "auto" }
                        }, null, 8, ["src", "alt"])
                      ])
                    ])) : createCommentVNode("", true),
                    embedUrl.value ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "pt-2"
                    }, [
                      createVNode("p", { class: "text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2" }, " Video "),
                      createVNode("div", {
                        class: "relative w-full rounded-xl overflow-hidden shadow-md",
                        style: { "padding-top": "56.25%" }
                      }, [
                        createVNode("iframe", {
                          src: embedUrl.value,
                          class: "absolute inset-0 w-full h-full",
                          frameborder: "0",
                          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                          allowfullscreen: "",
                          loading: "lazy"
                        }, null, 8, ["src"])
                      ])
                    ])) : hasRawUrl.value ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "pt-2"
                    }, [
                      createVNode("p", { class: "text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1" }, " Link Video "),
                      createVNode("a", {
                        href: __props.pengumuman.video_url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                      }, toDisplayString(__props.pengumuman.video_url), 9, ["href"])
                    ])) : createCommentVNode("", true),
                    createVNode("div", {
                      class: "ql-display max-w-none text-gray-700 dark:text-gray-200 leading-relaxed text-base",
                      innerHTML: __props.pengumuman.pengumuman
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Pengumuman/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
