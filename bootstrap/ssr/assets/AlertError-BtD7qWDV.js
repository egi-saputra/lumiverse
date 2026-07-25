import { ssrInterpolate } from "vue/server-renderer";
import { ref, useSSRContext } from "vue";
const _sfc_main = {
  __name: "AlertError",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: "Error!"
    },
    description: {
      type: String,
      default: "Something went wrong."
    }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const show = ref(false);
    const descriptionText = ref(props.description);
    const open = (msg) => {
      if (msg) descriptionText.value = msg;
      show.value = true;
    };
    __expose({ open });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (show.value) {
        _push(`<div class="fixed inset-0 z-40 bg-black/80"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (show.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center px-4"><div class="relative bg-white rounded-xl -mb-10 w-full max-w-sm py-6 px-6 shadow-2xl"><div class="absolute -top-[9.7rem] -right-3 pointer-events-none w-48 h-48 mx-auto -mb-2 overflow-hidden rounded"><img src="/images/error.png" class="w-full h-full object-cover"></div><div class="border-2 border-amber-900 border-dashed rounded-lg p-6"><h3 class="text-2xl font-bold text-center tracking-wide text-red-600 mt-6">${ssrInterpolate(__props.title)}</h3><p class="text-sm text-gray-500 text-center mt-2">${ssrInterpolate(descriptionText.value)}</p><div class="mt-6 mb-3 w-full flex justify-center"><button class="rounded border border-dashed border-red-600 text-stone-600 font-extrabold px-12 py-2 hover:bg-blue-100 hover:text-red-600 text-sm font-mono tracking-widest transition"> Close </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Modals/AlertError.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
