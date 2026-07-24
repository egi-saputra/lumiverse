import { ssrInterpolate } from "vue/server-renderer";
import { ref, useSSRContext, watch } from "vue";
import { usePage } from "@inertiajs/vue3";
const _sfc_main$1 = {
  __name: "ConfirmDelete",
  __ssrInlineRender: true,
  props: {
    description: {
      type: String,
      default: "This action cannot be undone."
    },
    title: {
      type: String,
      default: "Delete Data?"
    }
  },
  setup(__props, { expose: __expose }) {
    const show = ref(false);
    const deleteId = ref(null);
    const deleteRoute = ref(null);
    const open = (id, routeName) => {
      deleteId.value = id;
      deleteRoute.value = routeName;
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
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center px-4"><div class="relative bg-white border-2 border-amber-900 rounded-xl -mb-10 w-full max-w-sm py-6 px-6 shadow-2xl"><div class="absolute -top-[10.8rem] -right-2 pointer-events-none w-44 h-44 mx-auto -mb-2 overflow-hidden rounded"><img src="/images/delete-warning.png" class="w-full h-full object-cover"></div><h3 class="text-lg font-semibold text-center text-gray-800">${ssrInterpolate(__props.title)}</h3><p class="text-sm text-gray-500 text-center mt-2">${ssrInterpolate(__props.description)}</p><div class="flex gap-3 mt-6"><button class="flex-1 rounded-lg border-2 border-amber-900 px-4 py-2 text-sm hover:bg-amber-100 transition"> Cancel </button><button class="flex-1 rounded-lg bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700 transition"> Delete </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Modals/ConfirmDelete.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "AlertSuccess",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: "Success! 🎉"
    }
  },
  setup(__props) {
    const show = ref(false);
    const message = ref("");
    const page = usePage();
    watch(
      () => page.props.flash?.success,
      (val) => {
        if (val) {
          message.value = val;
          show.value = true;
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (show.value) {
        _push(`<div class="fixed inset-0 z-40 bg-black/60"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (show.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center px-4"><div class="relative bg-white rounded-xl -mb-10 w-full max-w-sm py-6 px-6 shadow-2xl"><div class="absolute -top-[9rem] -right-2 pointer-events-none w-44 h-44 mx-auto -mb-2 overflow-hidden rounded"><img src="/images/success.png" class="w-full h-full object-cover"></div><div class="border-2 border-amber-900 border-dashed rounded-lg p-6"><h3 class="text-2xl font-bold text-center tracking-wide text-green-600 mt-6">${ssrInterpolate(__props.title)}</h3><p class="text-sm text-gray-500 text-center mt-2">${ssrInterpolate(message.value)}</p><div class="mt-6 mb-6 w-full flex justify-center"><button class="rounded bg-blue-600 text-white font-extrabold px-12 py-2 hover:bg-blue-700 text-sm font-mono tracking-widest transition"> Close </button></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Modals/AlertSuccess.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  _sfc_main$1 as a
};
