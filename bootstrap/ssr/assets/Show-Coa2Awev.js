import { computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { r as resolveEmbedUrl } from "./useEmbedUrl-gNXae2BC.js";
import { ArrowLeftIcon, CalendarDaysIcon } from "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const announcement = computed(() => page.props.announcement);
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    };
    const imageUrl = computed(() => announcement.value?.file_url ?? null);
    const embedUrl = computed(() => resolveEmbedUrl(announcement.value?.video_url));
    const hasRawUrl = computed(() => announcement.value?.video_url && !embedUrl.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl sm:py-8 mx-auto sm:px-6" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("mading.index"),
        class: "inline-flex py-4 items-center gap-2 font-semibold text-sm text-gray-500 hover:text-indigo-600 transition sm:px-0 px-4 sm:mb-6"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Kembali ke Mading `);
          } else {
            return [
              createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
              createTextVNode(" Kembali ke Mading ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<article class="bg-white sm:rounded-2xl sm:shadow-lg sm:border sm:border-gray-200 overflow-hidden"><div class="sm:h-2 h-0.5 animated-gradient"></div><div class="p-6 sm:p-10 space-y-6"><h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">${ssrInterpolate(announcement.value.judul)}</h1><div class="flex items-center gap-3 text-sm text-gray-500">`);
      _push(ssrRenderComponent(unref(CalendarDaysIcon), { class: "w-4 h-4" }, null, _parent));
      _push(`<span>${ssrInterpolate(formatDate(announcement.value.created_at))}</span></div><hr class="border-gray-100">`);
      if (imageUrl.value) {
        _push(`<div class="space-y-2"><div class="flex justify-center bg-white rounded-xl border border-gray-200 overflow-hidden"><img${ssrRenderAttr("src", imageUrl.value)}${ssrRenderAttr("alt", announcement.value.judul)} loading="lazy" decoding="async" class="max-w-full max-h-[600px] object-contain" style="${ssrRenderStyle({ "image-rendering": "auto" })}"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (embedUrl.value) {
        _push(`<div><div class="relative w-full rounded-xl overflow-hidden shadow-md" style="${ssrRenderStyle({ "padding-top": "56.25%" })}"><iframe${ssrRenderAttr("src", embedUrl.value)} class="absolute inset-0 w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div></div>`);
      } else if (hasRawUrl.value) {
        _push(`<div><p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Link Video</p><a${ssrRenderAttr("href", announcement.value.video_url)} target="_blank" rel="noopener noreferrer" class="text-sm text-indigo-600 hover:underline break-all">${ssrInterpolate(announcement.value.video_url)}</a></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="ql-display max-w-none text-gray-700 leading-relaxed text-base">${announcement.value.pengumuman ?? ""}</div></div></article></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Mading/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
