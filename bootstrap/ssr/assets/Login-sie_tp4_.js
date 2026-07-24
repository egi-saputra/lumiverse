import { ref, computed, onMounted, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
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
    const showPassword = ref(false);
    const errorMessage = computed(() => {
      const error = new URLSearchParams(window.location.search).get("error");
      if (error === "email_not_registered") return "Email ini belum terdaftar sebagai pemilik lembaga.";
      if (error === "google_failed") return "Login Google gagal. Silakan coba lagi.";
      return null;
    });
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Lumi Sign In" }, null, _parent));
      _push(`<div class="auth-page" data-v-1a16d457><div class="auth-card" data-v-1a16d457><h1 class="auth-title" data-v-1a16d457>Welcome Back 👋</h1><p class="auth-sub" data-v-1a16d457>Please sign in your account to continue.</p>`);
      if (errorMessage.value) {
        _push(`<div class="field-error" style="${ssrRenderStyle({ "margin-bottom": "1rem", "padding": "0.75rem", "border-radius": "8px", "background": "rgba(251,113,133,0.1)", "border": "1px solid rgba(251,113,133,0.3)" })}" data-v-1a16d457>${ssrInterpolate(errorMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="auth-form" data-v-1a16d457><div class="field" data-v-1a16d457><label for="email" data-v-1a16d457>Email Address</label><input id="email" type="email"${ssrRenderAttr("value", unref(form).email)} autofocus autocomplete="username" data-v-1a16d457>`);
      if (unref(form).errors.email) {
        _push(`<div class="field-error" data-v-1a16d457>${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-1a16d457><label for="password" data-v-1a16d457>Password</label><div class="input-eye-wrap" data-v-1a16d457><input id="password"${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(form).password, null)} autocomplete="current-password" data-v-1a16d457><button type="button" class="eye-btn" data-v-1a16d457>`);
      if (!showPassword.value) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-1a16d457><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-v-1a16d457></path><circle cx="12" cy="12" r="3" data-v-1a16d457></circle></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-1a16d457><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" data-v-1a16d457></path><line x1="1" y1="1" x2="23" y2="23" data-v-1a16d457></line></svg>`);
      }
      _push(`</button></div>`);
      if (unref(form).errors.password) {
        _push(`<div class="field-error" data-v-1a16d457>${ssrInterpolate(unref(form).errors.password)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><label class="checkbox-row" data-v-1a16d457><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} data-v-1a16d457> Remember Me </label><button type="submit" class="btn-hero auth-submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-1a16d457>`);
      if (unref(form).processing) {
        _push(`<svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-1a16d457><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-1a16d457></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" data-v-1a16d457></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span data-v-1a16d457>${ssrInterpolate(unref(form).processing ? "Signing in..." : "Sign In")}</span></button></form><p class="auth-footer" data-v-1a16d457> Don&#39;t have an account? `);
      _push(ssrRenderComponent(unref(Link), {
        href: "/registration",
        class: "text-cyan"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Register here.`);
          } else {
            return [
              createTextVNode("Register here.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><div class="divider" data-v-1a16d457>OR</div><a${ssrRenderAttr("href", _ctx.route("google.redirect.central"))} class="btn-google" data-v-1a16d457><img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="" width="18" height="18" data-v-1a16d457><span data-v-1a16d457>Continue with Google</span></a></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Owner/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1a16d457"]]);
export {
  Login as default
};
