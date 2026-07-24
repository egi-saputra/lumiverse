import { computed, ref, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderDynamicModel, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import { usePage, useForm, Head, Link } from "@inertiajs/vue3";
import { CheckIcon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Register",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const isWorkspace = computed(() => page.props.tenant?.product_type === "workspace");
    const eyebrowText = computed(() => isWorkspace.value ? "Perusahaan / Organisasi" : "Lembaga Pendidikan");
    const taglineLine1 = computed(() => isWorkspace.value ? "The Greatest Workspace Management System App" : "The Greatest Learning Management System App");
    const taglineLine2 = computed(() => isWorkspace.value ? "Bergabung dan mulai kelola operasional serta aktivitas kerja tim secara digital." : "Bergabung dan mulai kelola aktivitas belajar mengajar secara digital.");
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
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    const showPassword = ref(false);
    ref(false);
    const passwordRules = computed(() => [
      { label: "Minimal 8 karakter", valid: form.password.length >= 8 },
      { label: "Huruf besar (A-Z)", valid: /[A-Z]/.test(form.password) },
      { label: "Huruf kecil (a-z)", valid: /[a-z]/.test(form.password) },
      { label: "Angka (0-9)", valid: /[0-9]/.test(form.password) },
      { label: "Simbol (!@#$...)", valid: /[^A-Za-z0-9]/.test(form.password) }
    ]);
    const passwordStrength = computed(() => {
      const passed = passwordRules.value.filter((r) => r.valid).length;
      if (passed <= 1) return { label: "Very Weak", color: "#C0392B", width: "20%" };
      if (passed === 2) return { label: "Weak", color: "#D97706", width: "40%" };
      if (passed === 3) return { label: "Enough", color: "#C9A227", width: "60%" };
      if (passed === 4) return { label: "Strong", color: "#7C9A6E", width: "80%" };
      return { label: "Very Strong", color: "#1A1B3A", width: "100%" };
    });
    const isPasswordValid = computed(
      () => passwordRules.value.every((r) => r.valid)
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Register" }, null, _parent));
      _push(`<div class="flex flex-col h-screen md:flex-row" data-v-a2ee66c5><aside class="relative hidden md:flex md:w-1/2 flex-col justify-between overflow-hidden bg-[#1A1B3A] p-10 lg:p-14 text-[#FAF9F5]" data-v-a2ee66c5><div class="pattern-overlay absolute inset-0" aria-hidden="true" data-v-a2ee66c5></div><div class="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#C9A227]/10 blur-3xl" aria-hidden="true" data-v-a2ee66c5></div><div class="relative z-10" data-v-a2ee66c5><img${ssrRenderAttr("src", unref(page).props.tenant?.logo ?? "/images/default.png")}${ssrRenderAttr("alt", unref(page).props.tenant?.name)} class="h-20 w-auto mb-4 ml-2 rounded-md" data-v-a2ee66c5><p class="eyebrow text-[#C9A227]" data-v-a2ee66c5>${ssrInterpolate(eyebrowText.value)}</p><h1 class="font-display mt-3 text-3xl leading-[1.1] uppercase" data-v-a2ee66c5>${ssrInterpolate(unref(page).props.tenant?.name)}</h1><div class="my-5 h-px w-24 bg-[#C9A227]/70" data-v-a2ee66c5></div><p class="max-w-xl text-sm leading-relaxed text-[#FAF9F5]/70 capitalize" data-v-a2ee66c5>${ssrInterpolate(taglineLine1.value)}</p><p class="max-w-xl text-sm leading-relaxed text-[#FAF9F5]/70" data-v-a2ee66c5>${ssrInterpolate(taglineLine2.value)}</p></div><nav class="relative z-10 mt-14" aria-label="Tautan cepat" data-v-a2ee66c5><p class="eyebrow mb-4 text-[#FAF9F5]/40" data-v-a2ee66c5>Direktori</p><ul class="divide-y divide-white/10 border-t border-white/10" data-v-a2ee66c5><!--[-->`);
      ssrRenderList(directoryItems.value, (item, i) => {
        _push(`<li data-v-a2ee66c5>`);
        if (item.external) {
          _push(`<a${ssrRenderAttr("href", item.href)} target="_blank" rel="noopener noreferrer" class="directory-row" data-v-a2ee66c5><span class="directory-index" data-v-a2ee66c5>${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span><span class="flex-1 capitalize" data-v-a2ee66c5>${ssrInterpolate(item.label)}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" class="text-[#C9A227]/70" aria-hidden="true" data-v-a2ee66c5><path d="M6 11L11 6M11 6H7M11 6V10" stroke-linecap="round" stroke-linejoin="round" data-v-a2ee66c5></path></svg></a>`);
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
                _push2(`<span class="directory-index" data-v-a2ee66c5${_scopeId}>${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span><span class="flex-1 capitalize" data-v-a2ee66c5${_scopeId}>${ssrInterpolate(item.label)}</span><i class="bi bi-arrow-up-right text-[#C9A227]/70" aria-hidden="true" data-v-a2ee66c5${_scopeId}></i>`);
              } else {
                return [
                  createVNode("span", { class: "directory-index" }, toDisplayString(String(i + 1).padStart(2, "0")), 1),
                  createVNode("span", { class: "flex-1 capitalize" }, toDisplayString(item.label), 1),
                  createVNode("i", {
                    class: "bi bi-arrow-up-right text-[#C9A227]/70",
                    "aria-hidden": "true"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav><p class="relative z-10 mt-10 text-xs text-[#FAF9F5]/40" data-v-a2ee66c5> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} PT Lumi Platforms Indonesia · All Rights Reserved. </p></aside><main class="flex flex-1 flex-col items-center sm:justify-center overflow-y-auto bg-[#FAF9F5] sm:px-6 px-8 py-10" data-v-a2ee66c5><div class="w-full max-w-sm" data-v-a2ee66c5><div class="mb-6" data-v-a2ee66c5><h2 class="font-display text-3xl text-[#C9A227]" data-v-a2ee66c5>Register Account</h2><p class="sm:mt-2 mt-1 text-sm text-[#6B7086]" data-v-a2ee66c5>Complete the following data to start using services. </p></div><form novalidate class="space-y-5" data-v-a2ee66c5><div class="field" data-v-a2ee66c5><input id="name" type="text" name="name"${ssrRenderAttr("value", unref(form).name)} autocomplete="username"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} placeholder="Enter Username" required class="field-input" data-v-a2ee66c5>`);
      if (unref(form).errors.name) {
        _push(`<p class="field-error" data-v-a2ee66c5>${ssrInterpolate(unref(form).errors.name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-a2ee66c5><input id="email" type="email" name="email"${ssrRenderAttr("value", unref(form).email)} autocomplete="email"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} placeholder="Enter email address" required class="field-input" data-v-a2ee66c5>`);
      if (unref(form).errors.email) {
        _push(`<p class="field-error" data-v-a2ee66c5>${ssrInterpolate(unref(form).errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-a2ee66c5><div class="relative" data-v-a2ee66c5><input id="password"${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(form).password, null)} autocomplete="new-password"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} placeholder="Enter password" required class="field-input pr-10" data-v-a2ee66c5><button type="button"${ssrRenderAttr("aria-label", showPassword.value ? "Hide password" : "Show password")} class="password-toggle" data-v-a2ee66c5><i class="${ssrRenderClass(showPassword.value ? "bi bi-eye" : "bi bi-eye-slash")}" aria-hidden="true" data-v-a2ee66c5></i></button></div>`);
      if (unref(form).password.length > 0) {
        _push(`<div class="pw-strength-wrap" data-v-a2ee66c5><div class="pw-strength-bar" data-v-a2ee66c5><div class="pw-strength-fill" style="${ssrRenderStyle({ width: passwordStrength.value.width, background: passwordStrength.value.color })}" data-v-a2ee66c5></div></div><span class="pw-strength-label" style="${ssrRenderStyle({ color: passwordStrength.value.color })}" data-v-a2ee66c5>${ssrInterpolate(passwordStrength.value.label)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).password.length > 0) {
        _push(`<div class="pw-rules" data-v-a2ee66c5><!--[-->`);
        ssrRenderList(passwordRules.value, (rule) => {
          _push(`<div class="${ssrRenderClass([{ "pw-rule-valid": rule.valid }, "pw-rule"])}" data-v-a2ee66c5>`);
          if (rule.valid) {
            _push(ssrRenderComponent(unref(CheckIcon), { class: "h-3.5 w-3.5" }, null, _parent));
          } else {
            _push(`<span class="pw-rule-dot" data-v-a2ee66c5>○</span>`);
          }
          _push(`<span data-v-a2ee66c5>${ssrInterpolate(rule.label)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).errors.password) {
        _push(`<p class="field-error" data-v-a2ee66c5>${ssrInterpolate(unref(form).errors.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing || !isPasswordValid.value) ? " disabled" : ""} class="btn-primary" data-v-a2ee66c5>`);
      if (unref(form).processing) {
        _push(`<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true" data-v-a2ee66c5><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-a2ee66c5></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" data-v-a2ee66c5></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span data-v-a2ee66c5>${ssrInterpolate(unref(form).processing ? "Creating your account…" : "Register")}</span></button><p class="text-center text-sm text-[#6B7086]" data-v-a2ee66c5> Have an account? `);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("login"),
        prefetch: "",
        "preserve-scroll": "",
        "preserve-state": "",
        only: [],
        class: "text-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign in here. `);
          } else {
            return [
              createTextVNode(" Sign in here. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><div class="divider-stars" data-v-a2ee66c5><span data-v-a2ee66c5>OR</span></div><a${ssrRenderAttr("href", `/auth/google?from_tenant=${unref(page).props.tenant?.id}`)} class="btn-outline" data-v-a2ee66c5><img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="" width="18" height="18" data-v-a2ee66c5><span data-v-a2ee66c5>Register with Google</span></a></form><p class="text-xs font-semibold sm:hidden flex absolute bottom-4 right-0 left-0 justify-center text-[#6B7086] font-poppins" data-v-a2ee66c5> Lumi Platforms, Inc. </p></div></main></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a2ee66c5"]]);
export {
  Register as default
};
