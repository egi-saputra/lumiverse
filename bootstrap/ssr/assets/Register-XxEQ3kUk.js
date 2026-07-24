import { ref, computed, onMounted, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderDynamicModel, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Register",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: ""
    });
    const showPassword = ref(false);
    const showConfPassword = ref(false);
    const passwordRules = computed(() => [
      { label: "Minimal 8 karakter", valid: form.password.length >= 8 },
      { label: "Huruf besar (A-Z)", valid: /[A-Z]/.test(form.password) },
      { label: "Huruf kecil (a-z)", valid: /[a-z]/.test(form.password) },
      { label: "Angka (0-9)", valid: /[0-9]/.test(form.password) },
      { label: "Simbol (!@#$...)", valid: /[^A-Za-z0-9]/.test(form.password) }
    ]);
    const passwordStrength = computed(() => {
      const passed = passwordRules.value.filter((r) => r.valid).length;
      if (passed <= 1) return { label: "Sangat Lemah", color: "#fb7185", width: "20%" };
      if (passed === 2) return { label: "Lemah", color: "#f97316", width: "40%" };
      if (passed === 3) return { label: "Cukup", color: "#fbbf24", width: "60%" };
      if (passed === 4) return { label: "Kuat", color: "#34d399", width: "80%" };
      return { label: "Sangat Kuat", color: "#00d4ff", width: "100%" };
    });
    const passwordMatch = computed(
      () => form.password_confirmation.length > 0 && form.password === form.password_confirmation
    );
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Daftar Akun" }, null, _parent));
      _push(`<div class="register-page flex-col" data-v-6a8d27aa><div class="register-card" data-v-6a8d27aa><h1 class="register-title" data-v-6a8d27aa>Buat Akun Baru</h1><p class="register-sub" data-v-6a8d27aa>Daftar untuk mengakses dashboard central kamu.</p><form class="register-form" data-v-6a8d27aa><div class="field" data-v-6a8d27aa><label for="name" data-v-6a8d27aa>* Nama Lengkap</label><input id="name" type="text"${ssrRenderAttr("value", unref(form).name)} autofocus autocomplete="name" placeholder="Budi Santoso" data-v-6a8d27aa>`);
      if (unref(form).errors.name) {
        _push(`<div class="field-error" data-v-6a8d27aa>${ssrInterpolate(unref(form).errors.name)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-6a8d27aa><label for="email" data-v-6a8d27aa>* Alamat Email</label><input id="email" type="email"${ssrRenderAttr("value", unref(form).email)} autocomplete="username" placeholder="budi@sekolah.id" data-v-6a8d27aa>`);
      if (unref(form).errors.email) {
        _push(`<div class="field-error" data-v-6a8d27aa>${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-6a8d27aa><label for="phone" data-v-6a8d27aa>Nomor WhatsApp <span class="optional-tag" data-v-6a8d27aa>(opsional)</span></label><input id="phone" type="text"${ssrRenderAttr("value", unref(form).phone)} autocomplete="tel" placeholder="08123456789" data-v-6a8d27aa>`);
      if (unref(form).errors.phone) {
        _push(`<div class="field-error" data-v-6a8d27aa>${ssrInterpolate(unref(form).errors.phone)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-6a8d27aa><label for="password" data-v-6a8d27aa>* Password</label><div class="input-eye-wrap" data-v-6a8d27aa><input id="password"${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(form).password, null)} autocomplete="new-password" placeholder="Min. 8 karakter" data-v-6a8d27aa><button type="button" class="eye-btn" data-v-6a8d27aa>`);
      if (!showPassword.value) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-6a8d27aa><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-v-6a8d27aa></path><circle cx="12" cy="12" r="3" data-v-6a8d27aa></circle></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-6a8d27aa><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" data-v-6a8d27aa></path><line x1="1" y1="1" x2="23" y2="23" data-v-6a8d27aa></line></svg>`);
      }
      _push(`</button></div>`);
      if (unref(form).errors.password) {
        _push(`<div class="field-error" data-v-6a8d27aa>${ssrInterpolate(unref(form).errors.password)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).password.length > 0) {
        _push(`<div class="pw-strength-wrap" data-v-6a8d27aa><div class="pw-strength-bar" data-v-6a8d27aa><div class="pw-strength-fill" style="${ssrRenderStyle({ width: passwordStrength.value.width, background: passwordStrength.value.color })}" data-v-6a8d27aa></div></div><span class="pw-strength-label" style="${ssrRenderStyle({ color: passwordStrength.value.color })}" data-v-6a8d27aa>${ssrInterpolate(passwordStrength.value.label)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).password.length > 0) {
        _push(`<div class="pw-rules" data-v-6a8d27aa><!--[-->`);
        ssrRenderList(passwordRules.value, (rule) => {
          _push(`<div class="${ssrRenderClass([{ "pw-rule-valid": rule.valid }, "pw-rule"])}" data-v-6a8d27aa><span class="pw-rule-icon" data-v-6a8d27aa>${ssrInterpolate(rule.valid ? "✓" : "○")}</span><span data-v-6a8d27aa>${ssrInterpolate(rule.label)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-6a8d27aa><label for="password_confirmation" data-v-6a8d27aa>* Konfirmasi Password</label><div class="input-eye-wrap" data-v-6a8d27aa><input id="password_confirmation"${ssrRenderAttr("type", showConfPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showConfPassword.value ? "text" : "password", unref(form).password_confirmation, null)} autocomplete="new-password" placeholder="Ulangi password" class="${ssrRenderClass({ "input-match": passwordMatch.value, "input-nomatch": unref(form).password_confirmation.length > 0 && !passwordMatch.value })}" data-v-6a8d27aa><button type="button" class="eye-btn" data-v-6a8d27aa>`);
      if (!showConfPassword.value) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-6a8d27aa><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-v-6a8d27aa></path><circle cx="12" cy="12" r="3" data-v-6a8d27aa></circle></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-6a8d27aa><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" data-v-6a8d27aa></path><line x1="1" y1="1" x2="23" y2="23" data-v-6a8d27aa></line></svg>`);
      }
      _push(`</button></div>`);
      if (unref(form).errors.password_confirmation) {
        _push(`<div class="field-error" data-v-6a8d27aa>${ssrInterpolate(unref(form).errors.password_confirmation)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).password_confirmation.length > 0) {
        _push(`<div class="${ssrRenderClass([passwordMatch.value ? "pw-match-ok" : "pw-match-no", "pw-match-hint"])}" data-v-6a8d27aa>${ssrInterpolate(passwordMatch.value ? "✓ Password cocok" : "✗ Password tidak cocok")}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit" class="btn-hero step-next"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-6a8d27aa><span data-v-6a8d27aa>${ssrInterpolate(unref(form).processing ? "Mendaftarkan..." : "Daftar Sekarang →")}</span></button></form><p class="register-footer" data-v-6a8d27aa> Sudah punya akun? `);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("owner.login"),
        class: "text-cyan"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Masuk di sini.`);
          } else {
            return [
              createTextVNode("Masuk di sini.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div><div class="flex justify-center gap-1 mt-6 -mb-2" data-v-6a8d27aa><img src="/images/logo.png" alt="Lumiverse School" class="h-5 object-cover scale-150 sm:flex hidden" data-v-6a8d27aa><p class="font-semibold text-sm text-[var(--muted)] sm:flex hidden justify-center" data-v-6a8d27aa> Lumi Platforms, Inc. </p></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Owner/Register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6a8d27aa"]]);
export {
  Register as default
};
