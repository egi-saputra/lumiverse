import { onMounted, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Login",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Dev Sign In" }, null, _parent));
      _push(`<div class="auth-page" data-v-d1de0ae8><div class="auth-card" data-v-d1de0ae8><h1 class="auth-title text-center" data-v-d1de0ae8>Masuk ke Dashboard</h1><p class="auth-sub text-center" data-v-d1de0ae8>Kelola seluruh tenant sekolah dari satu tempat.</p><form class="auth-form" data-v-d1de0ae8><div class="field" data-v-d1de0ae8><label for="email" data-v-d1de0ae8>Email Address</label><input id="email" type="email"${ssrRenderAttr("value", unref(form).email)} autofocus autocomplete="username" data-v-d1de0ae8>`);
      if (unref(form).errors.email) {
        _push(`<div class="field-error" data-v-d1de0ae8>${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-d1de0ae8><label for="password" data-v-d1de0ae8>Password</label><input id="password" type="password"${ssrRenderAttr("value", unref(form).password)} autocomplete="current-password" data-v-d1de0ae8>`);
      if (unref(form).errors.password) {
        _push(`<div class="field-error" data-v-d1de0ae8>${ssrInterpolate(unref(form).errors.password)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><label class="checkbox-row" data-v-d1de0ae8><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} data-v-d1de0ae8> Ingat saya </label><button type="submit" class="btn-hero auth-submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-d1de0ae8> Masuk </button></form><p class="auth-footer" data-v-d1de0ae8> Belum punya akun? `);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("developer.register"),
        class: "text-cyan"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Daftar di sini`);
          } else {
            return [
              createTextVNode("Daftar di sini")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Developer/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d1de0ae8"]]);
export {
  Login as default
};
