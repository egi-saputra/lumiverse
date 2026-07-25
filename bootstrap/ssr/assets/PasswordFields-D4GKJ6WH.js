import { ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "PasswordFields",
  __ssrInlineRender: true,
  props: {
    password: { type: String, default: "" },
    passwordConfirmation: { type: String, default: "" },
    passwordError: { type: String, default: null },
    confirmationError: { type: String, default: null }
  },
  emits: ["update:password", "update:passwordConfirmation"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const showPassword = ref(false);
    const showConfPassword = ref(false);
    const passwordRules = computed(() => [
      { label: "Minimal 8 karakter", valid: props.password.length >= 8 },
      { label: "Huruf besar (A-Z)", valid: /[A-Z]/.test(props.password) },
      { label: "Huruf kecil (a-z)", valid: /[a-z]/.test(props.password) },
      { label: "Angka (0-9)", valid: /[0-9]/.test(props.password) },
      { label: "Simbol (!@#$...)", valid: /[^A-Za-z0-9]/.test(props.password) }
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
      () => props.passwordConfirmation.length > 0 && props.password === props.passwordConfirmation
    );
    __expose({ passwordRules, passwordMatch });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pw-fields" }, _attrs))} data-v-e7661f5f><div class="field" data-v-e7661f5f><label for="admin_password" data-v-e7661f5f>* Password</label><div class="input-eye-wrap" data-v-e7661f5f><input id="admin_password"${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderAttr("value", __props.password)} placeholder="Min. 8 karakter" data-v-e7661f5f><button type="button" class="eye-btn" data-v-e7661f5f>`);
      if (!showPassword.value) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-e7661f5f><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-v-e7661f5f></path><circle cx="12" cy="12" r="3" data-v-e7661f5f></circle></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-e7661f5f><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" data-v-e7661f5f></path><line x1="1" y1="1" x2="23" y2="23" data-v-e7661f5f></line></svg>`);
      }
      _push(`</button></div>`);
      if (__props.passwordError) {
        _push(`<div class="field-error" data-v-e7661f5f>${ssrInterpolate(__props.passwordError)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.password.length > 0) {
        _push(`<div class="pw-strength-wrap" data-v-e7661f5f><div class="pw-strength-bar" data-v-e7661f5f><div class="pw-strength-fill" style="${ssrRenderStyle({ width: passwordStrength.value.width, background: passwordStrength.value.color })}" data-v-e7661f5f></div></div><span class="pw-strength-label" style="${ssrRenderStyle({ color: passwordStrength.value.color })}" data-v-e7661f5f>${ssrInterpolate(passwordStrength.value.label)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.password.length > 0) {
        _push(`<div class="pw-rules" data-v-e7661f5f><!--[-->`);
        ssrRenderList(passwordRules.value, (rule) => {
          _push(`<div class="${ssrRenderClass([{ "pw-rule-valid": rule.valid }, "pw-rule"])}" data-v-e7661f5f><span class="pw-rule-icon" data-v-e7661f5f>${ssrInterpolate(rule.valid ? "✓" : "○")}</span><span data-v-e7661f5f>${ssrInterpolate(rule.label)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field" data-v-e7661f5f><label for="admin_password_confirmation" data-v-e7661f5f>* Konfirmasi Password</label><div class="input-eye-wrap" data-v-e7661f5f><input id="admin_password_confirmation"${ssrRenderAttr("type", showConfPassword.value ? "text" : "password")}${ssrRenderAttr("value", __props.passwordConfirmation)} placeholder="Ulangi password" class="${ssrRenderClass({
        "input-match": passwordMatch.value,
        "input-nomatch": __props.passwordConfirmation.length > 0 && !passwordMatch.value
      })}" data-v-e7661f5f><button type="button" class="eye-btn" data-v-e7661f5f>`);
      if (!showConfPassword.value) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-e7661f5f><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-v-e7661f5f></path><circle cx="12" cy="12" r="3" data-v-e7661f5f></circle></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-e7661f5f><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" data-v-e7661f5f></path><line x1="1" y1="1" x2="23" y2="23" data-v-e7661f5f></line></svg>`);
      }
      _push(`</button></div>`);
      if (__props.confirmationError) {
        _push(`<div class="field-error" data-v-e7661f5f>${ssrInterpolate(__props.confirmationError)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.passwordConfirmation.length > 0) {
        _push(`<div class="${ssrRenderClass([passwordMatch.value ? "pw-match-ok" : "pw-match-no", "pw-match-hint"])}" data-v-e7661f5f>${ssrInterpolate(passwordMatch.value ? "✓ Password cocok" : "✗ Password tidak cocok")}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Tenant/Partials/PasswordFields.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PasswordFields = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e7661f5f"]]);
export {
  PasswordFields as default
};
