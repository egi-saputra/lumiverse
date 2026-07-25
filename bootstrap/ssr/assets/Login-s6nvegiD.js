import { computed, ref, onMounted, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderDynamicModel, ssrRenderClass, ssrLooseContain } from "vue/server-renderer";
import { usePage, useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AlertError-BtD7qWDV.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    canResetPassword: Boolean,
    status: String
  },
  setup(__props) {
    const page = usePage();
    const isWorkspace = computed(() => page.props.tenant?.product_type === "workspace");
    const eyebrowText = computed(() => isWorkspace.value ? "Workspace Management System" : "Learning Management System");
    const taglineLine1 = computed(() => isWorkspace.value ? "Lumiverse smart workspace management system app" : "Lumiverse smart learning management system app");
    const taglineLine2 = computed(() => isWorkspace.value ? "Satu aplikasi untuk semua kebutuhan kerja tim dan sistem digitalisasi perusahaan" : "Satu aplikasi untuk semua kebutuhan belajar mengajar dan sistem digitalisasi sekolah");
    const lumiverseDirectoryLabel = computed(() => isWorkspace.value ? "Lumi Workspace - Smart Workspace System App" : "Lumiverse School - Smart Learning System App");
    const directoryItems = computed(() => {
      const items = [
        {
          href: "https://smknusantara.id",
          external: true,
          label: `Website Resmi ${page.props.tenant?.name ?? ""}`
        }
      ];
      if (!isWorkspace.value) {
        items.push({
          routeName: "mading.index",
          external: false,
          label: `Mading Digital ${page.props.tenant?.name ?? ""}`
        });
      }
      items.push({
        href: "https://www.lumiverse.co.id",
        external: true,
        label: lumiverseDirectoryLabel.value
      });
      return items;
    });
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    const alertError = ref(null);
    const showPassword = ref(false);
    const errorMessage = computed(() => {
      const error = new URLSearchParams(window.location.search).get("error");
      if (error === "email_not_registered") return "Akun tidak ditemukan / belum terdaftar.";
      if (error === "google_failed") return "Login Google gagal. Silakan coba lagi.";
      return null;
    });
    onMounted(() => {
      if (window.innerWidth < 768) {
        form.remember = true;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Login" }, null, _parent));
      _push(`<div class="flex flex-col h-screen md:flex-row" data-v-25fb4ec5>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        ref_key: "alertError",
        ref: alertError,
        title: "Login Failed"
      }, null, _parent));
      _push(`<aside class="relative hidden md:flex md:w-1/2 flex-col justify-between overflow-hidden bg-[#1A1B3A] p-10 lg:p-14 text-[#FAF9F5]" data-v-25fb4ec5><div class="pattern-overlay absolute inset-0" aria-hidden="true" data-v-25fb4ec5></div><div class="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#C9A227]/10 blur-3xl" aria-hidden="true" data-v-25fb4ec5></div><div class="relative z-10" data-v-25fb4ec5><img${ssrRenderAttr("src", unref(page).props.tenant?.logo ?? "/images/default.png")}${ssrRenderAttr("alt", unref(page).props.tenant?.name)} class="h-20 w-auto mb-4 ml-2 rounded-md" data-v-25fb4ec5><p class="eyebrow text-[#C9A227]" data-v-25fb4ec5>${ssrInterpolate(eyebrowText.value)}</p><h1 class="font-display mt-3 text-3xl leading-[1.1] uppercase" data-v-25fb4ec5>${ssrInterpolate(unref(page).props.tenant?.name)}</h1><div class="my-5 h-px w-24 bg-[#C9A227]/70" data-v-25fb4ec5></div><p class="max-w-xl text-sm leading-relaxed text-[#FAF9F5]/70" data-v-25fb4ec5>${ssrInterpolate(taglineLine1.value)}</p><p class="max-w-xl text-sm leading-relaxed text-[#FAF9F5]/70" data-v-25fb4ec5>${ssrInterpolate(taglineLine2.value)}</p></div><nav class="relative z-10 mt-14" aria-label="Tautan cepat" data-v-25fb4ec5><p class="eyebrow mb-4 text-[#FAF9F5]/40" data-v-25fb4ec5>Direktori</p><ul class="divide-y divide-white/10 border-t border-white/10" data-v-25fb4ec5><!--[-->`);
      ssrRenderList(directoryItems.value, (item, i) => {
        _push(`<li data-v-25fb4ec5>`);
        if (item.external) {
          _push(`<a${ssrRenderAttr("href", item.href)} target="_blank" rel="noopener noreferrer" class="directory-row" data-v-25fb4ec5><span class="directory-index" data-v-25fb4ec5>${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span><span class="flex-1 capitalize" data-v-25fb4ec5>${ssrInterpolate(item.label)}</span><i class="bi bi-arrow-up-right text-[#C9A227]/70" aria-hidden="true" data-v-25fb4ec5></i></a>`);
        } else {
          _push(ssrRenderComponent(unref(Link), {
            href: _ctx.route(item.routeName),
            prefetch: "",
            "preserve-scroll": "",
            "preserve-state": "",
            class: "directory-row"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="directory-index" data-v-25fb4ec5${_scopeId}>${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span><span class="flex-1 capitalize" data-v-25fb4ec5${_scopeId}>${ssrInterpolate(item.label)}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" class="text-[#C9A227]/70" aria-hidden="true" data-v-25fb4ec5${_scopeId}><path d="M6 11L11 6M11 6H7M11 6V10" stroke-linecap="round" stroke-linejoin="round" data-v-25fb4ec5${_scopeId}></path></svg>`);
              } else {
                return [
                  createVNode("span", { class: "directory-index" }, toDisplayString(String(i + 1).padStart(2, "0")), 1),
                  createVNode("span", { class: "flex-1 capitalize" }, toDisplayString(item.label), 1),
                  (openBlock(), createBlock("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 16 16",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "1.5",
                    class: "text-[#C9A227]/70",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", {
                      d: "M6 11L11 6M11 6H7M11 6V10",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav><p class="relative z-10 mt-10 text-xs text-[#FAF9F5]/40" data-v-25fb4ec5> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} PT Lumi Platforms Indonesia · All Rights Reserved. </p></aside><main class="flex flex-1 flex-col items-center sm:justify-center sm:mt-0 mt-4 overflow-y-auto bg-[#FAF9F5] sm:px-6 px-8 py-10" data-v-25fb4ec5><div class="w-full max-w-sm" data-v-25fb4ec5><div class="sm:mb-10 mb-6" data-v-25fb4ec5><h2 class="font-display text-3xl text-[#1A1B3A]" data-v-25fb4ec5>Welcome Back 👋</h2><p class="sm:mt-2 mt-1 text-sm text-[#C9A227]" data-v-25fb4ec5>Please sign in your account to continue.</p></div><form novalidate class="space-y-5" data-v-25fb4ec5><div class="field" data-v-25fb4ec5><input id="email" type="email" name="email"${ssrRenderAttr("value", unref(form).email)} autocomplete="email"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} placeholder="Enter email address" required class="field-input" data-v-25fb4ec5></div><div class="field" data-v-25fb4ec5><div class="relative" data-v-25fb4ec5><input id="password"${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(form).password, null)} autocomplete="current-password"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} placeholder="Enter password" required class="field-input pr-10" data-v-25fb4ec5><button type="button"${ssrRenderAttr("aria-label", showPassword.value ? "Hide password" : "Show password")} class="password-toggle" data-v-25fb4ec5><i class="${ssrRenderClass(showPassword.value ? "bi bi-eye" : "bi bi-eye-slash")}" aria-hidden="true" data-v-25fb4ec5></i></button></div></div><div class="flex items-center justify-between pt-1" data-v-25fb4ec5><label class="flex items-center gap-2 cursor-pointer select-none text-sm text-[#6B7086]" data-v-25fb4ec5><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} class="remember-checkbox" data-v-25fb4ec5> Remember Me </label>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("password.request"),
        prefetch: "",
        "preserve-scroll": "",
        class: "text-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Forgot Password? `);
          } else {
            return [
              createTextVNode(" Forgot Password? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="btn-primary" data-v-25fb4ec5>`);
      if (unref(form).processing) {
        _push(`<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true" data-v-25fb4ec5><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-25fb4ec5></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" data-v-25fb4ec5></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span data-v-25fb4ec5>${ssrInterpolate(unref(form).processing ? "Signing in…" : "Sign In")}</span></button><p class="text-center text-sm text-[#6B7086]" data-v-25fb4ec5> Don&#39;t have an account? `);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("register"),
        prefetch: "",
        "preserve-state": "",
        "preserve-scroll": "",
        class: "text-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Register here. `);
          } else {
            return [
              createTextVNode(" Register here. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><div class="divider-stars" data-v-25fb4ec5><span data-v-25fb4ec5>OR</span></div>`);
      if (errorMessage.value) {
        _push(`<div class="mb-6 rounded-lg text-center border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" data-v-25fb4ec5>${ssrInterpolate(errorMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<a${ssrRenderAttr("href", `/auth/google?from_tenant=${unref(page).props.tenant?.id}`)} class="btn-outline" data-v-25fb4ec5><img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="" width="18" height="18" data-v-25fb4ec5><span data-v-25fb4ec5>Continue with Google</span></a></form><p class="text-xs font-semibold sm:hidden flex absolute bottom-4 right-0 left-0 justify-center text-[#6B7086] font-poppins" data-v-25fb4ec5> Lumi Platforms, Inc. </p></div></main></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-25fb4ec5"]]);
export {
  Login as default
};
