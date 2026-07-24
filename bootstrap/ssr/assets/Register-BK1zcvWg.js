import { onMounted, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Register",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Admin Register" }, null, _parent));
      _push(`<div class="auth-page" data-v-68b0e5eb><div class="auth-card" data-v-68b0e5eb><h1 class="auth-title text-center" data-v-68b0e5eb>Buat Akun Super Admin</h1><p class="auth-sub text-center" data-v-68b0e5eb> ⚠️ Nonaktifkan halaman ini setelah berhasil register!. </p><form class="auth-form" data-v-68b0e5eb><div class="field" data-v-68b0e5eb><label for="name" data-v-68b0e5eb>Nama</label><input id="name" type="text"${ssrRenderAttr("value", unref(form).name)} autofocus autocomplete="name" data-v-68b0e5eb>`);
      if (unref(form).errors.name) {
        _push(`<div class="field-error" data-v-68b0e5eb>${ssrInterpolate(unref(form).errors.name)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-68b0e5eb><label for="email" data-v-68b0e5eb>Email</label><input id="email" type="email"${ssrRenderAttr("value", unref(form).email)} autocomplete="username" data-v-68b0e5eb>`);
      if (unref(form).errors.email) {
        _push(`<div class="field-error" data-v-68b0e5eb>${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-68b0e5eb><label for="password" data-v-68b0e5eb>Password</label><input id="password" type="password"${ssrRenderAttr("value", unref(form).password)} autocomplete="new-password" data-v-68b0e5eb>`);
      if (unref(form).errors.password) {
        _push(`<div class="field-error" data-v-68b0e5eb>${ssrInterpolate(unref(form).errors.password)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-68b0e5eb><label for="password_confirmation" data-v-68b0e5eb>Konfirmasi Password</label><input id="password_confirmation" type="password"${ssrRenderAttr("value", unref(form).password_confirmation)} autocomplete="new-password" data-v-68b0e5eb></div><button type="submit" class="btn-hero auth-submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-68b0e5eb> Daftar </button></form><p class="auth-footer" data-v-68b0e5eb> Sudah punya akun? `);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("developer.login"),
        class: "text-cyan"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Masuk di sini`);
          } else {
            return [
              createTextVNode("Masuk di sini")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Developer/Register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-68b0e5eb"]]);
export {
  Register as default
};
