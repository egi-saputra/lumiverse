import { computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderClass } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { ArrowLeftIcon, CalendarDaysIcon, PhotoIcon, VideoCameraIcon } from "@heroicons/vue/24/solid";
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
const perPage = 10;
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const pengumuman = computed(() => page.props.announcements ?? []);
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    };
    const excerpt = (html, len = 130) => {
      const plain = (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      return plain.length > len ? plain.slice(0, len) + "…" : plain;
    };
    const currentPage = ref(1);
    const totalPages = computed(() => Math.ceil(pengumuman.value.length / perPage) || 1);
    const paginated = computed(() => {
      const s = (currentPage.value - 1) * perPage;
      return pengumuman.value.slice(s, s + perPage);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full py-6 px-4 sm:py-12 md:px-10 max-w-6xl mx-auto" }, _attrs))}><div class="mb-12 text-center"><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900"> Mading <span class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Sekolah Nusantara </span></h1><p class="mt-4 text-gray-500 text-sm sm:text-base"> Pengumuman, informasi, dan berita terbaru sekolah </p><div class="w-24 mt-5 h-1 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("login"),
        class: "sm:inline-flex hidden items-center gap-2 mb-6 font-semibold text-sm text-gray-500 hover:text-indigo-600 transition"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Kembali ke Login `);
          } else {
            return [
              createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
              createTextVNode(" Kembali ke Login ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (pengumuman.value.length === 0) {
        _push(`<div class="text-center py-24 text-gray-400 italic text-lg"> Belum ada pengumuman 📭 </div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(paginated.value, (item) => {
          _push(ssrRenderComponent(unref(Link), {
            key: item.id,
            href: _ctx.route("mading.show", item.id),
            class: "group relative flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 overflow-hidden transition-all duration-200"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity"${_scopeId}></div><div class="flex-1 min-w-0"${_scopeId}><h2 class="font-semibold text-base text-gray-800 truncate group-hover:text-indigo-600 transition-colors"${_scopeId}>${ssrInterpolate(item.judul)}</h2><p class="mt-1 text-sm text-gray-500 line-clamp-2"${_scopeId}>${ssrInterpolate(excerpt(item.pengumuman))}</p><div class="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-gray-400"${_scopeId}><span class="flex items-center gap-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(CalendarDaysIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(formatDate(item.created_at))}</span>`);
                if (item.file_path) {
                  _push2(`<span class="flex items-center gap-1 text-indigo-400"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(PhotoIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                  _push2(` Gambar </span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (item.video_url) {
                  _push2(`<span class="flex items-center gap-1 text-purple-400"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(VideoCameraIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                  _push2(` Video </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
                _push2(ssrRenderComponent(unref(ChevronRightIcon), { class: "shrink-0 w-5 h-5 mt-1 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode("div", { class: "absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity" }),
                  createVNode("div", { class: "flex-1 min-w-0" }, [
                    createVNode("h2", { class: "font-semibold text-base text-gray-800 truncate group-hover:text-indigo-600 transition-colors" }, toDisplayString(item.judul), 1),
                    createVNode("p", { class: "mt-1 text-sm text-gray-500 line-clamp-2" }, toDisplayString(excerpt(item.pengumuman)), 1),
                    createVNode("div", { class: "mt-2.5 flex flex-wrap items-center gap-3 text-xs text-gray-400" }, [
                      createVNode("span", { class: "flex items-center gap-1" }, [
                        createVNode(unref(CalendarDaysIcon), { class: "w-3.5 h-3.5" }),
                        createTextVNode(" " + toDisplayString(formatDate(item.created_at)), 1)
                      ]),
                      item.file_path ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "flex items-center gap-1 text-indigo-400"
                      }, [
                        createVNode(unref(PhotoIcon), { class: "w-3.5 h-3.5" }),
                        createTextVNode(" Gambar ")
                      ])) : createCommentVNode("", true),
                      item.video_url ? (openBlock(), createBlock("span", {
                        key: 1,
                        class: "flex items-center gap-1 text-purple-400"
                      }, [
                        createVNode(unref(VideoCameraIcon), { class: "w-3.5 h-3.5" }),
                        createTextVNode(" Video ")
                      ])) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode(unref(ChevronRightIcon), { class: "shrink-0 w-5 h-5 mt-1 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" })
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (totalPages.value > 1) {
        _push(`<div class="flex justify-center items-center gap-2 mt-10 flex-wrap"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-2 rounded-lg border text-sm font-medium border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition">← Prev</button><!--[-->`);
        ssrRenderList(totalPages.value, (p) => {
          _push(`<button class="${ssrRenderClass([p === currentPage.value ? "bg-indigo-600 text-white shadow-md" : "border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600", "w-9 h-9 rounded-lg text-sm font-semibold transition"])}">${ssrInterpolate(p)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-2 rounded-lg border text-sm font-medium border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition">Next →</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Mading/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
