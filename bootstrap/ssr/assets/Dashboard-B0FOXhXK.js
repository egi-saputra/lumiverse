import { unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { CheckCircleIcon, PowerIcon } from "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Pendaftaran Berhasil" }, null, _parent));
      _push(`<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#063970] via-[#0a4e8c] to-[#0f6ab4] px-4"><div class="relative max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center"><div class="flex justify-center mb-4">`);
      _push(ssrRenderComponent(unref(CheckCircleIcon), { class: "w-20 h-20 text-green-500 drop-shadow-lg" }, null, _parent));
      _push(`</div><h1 class="text-2xl font-bold text-[#063970] mb-2"> Pendaftaran Berhasil </h1><p class="text-gray-700 leading-relaxed mb-6"> Akun Anda telah berhasil didaftarkan.<br> Silakan menghubungi <span class="font-semibold text-[#063970]">Administrator</span> untuk proses aktivasi sebelum Anda dapat mengakses sistem. </p><div class="h-px w-full bg-gray-300/60 my-5"></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("logout"),
        method: "post",
        as: "button",
        class: "w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-300 shadow-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PowerIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` Logout `);
          } else {
            return [
              createVNode(unref(PowerIcon), { class: "w-5 h-5" }),
              createTextVNode(" Logout ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="mt-5 text-xs text-gray-500"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Nusantara Learning Management System </p></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/User/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
