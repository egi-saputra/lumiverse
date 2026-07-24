import { computed, ref, unref, withCtx, openBlock, createBlock, createVNode, createCommentVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1, a as _sfc_main$2, b as _sfc_main$3 } from "./TextInput-A0-GkXWF.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { usePage, useForm } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "UpdatePasswordForm",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const hasPassword = computed(() => page.props.hasPassword);
    const passwordInput = ref(null);
    const currentPasswordInput = ref(null);
    const showCurrent = ref(false);
    const showNew = ref(false);
    const showConfirm = ref(false);
    const form = useForm({
      current_password: "",
      password: "",
      password_confirmation: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><header><h2 class="text-lg font-medium text-gray-900 dark:text-white">Update Password</h2><p class="mt-1 text-sm text-gray-600 dark:text-gray-400"> Ensure your account is using a long, random password to stay secure. </p></header><form class="mt-6 space-y-6">`);
      if (hasPassword.value) {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          for: "current_password",
          value: "Current Password",
          class: "dark:text-gray-300"
        }, null, _parent));
        _push(`<div class="relative mt-1">`);
        _push(ssrRenderComponent(_sfc_main$2, {
          id: "current_password",
          ref_key: "currentPasswordInput",
          ref: currentPasswordInput,
          modelValue: unref(form).current_password,
          "onUpdate:modelValue": ($event) => unref(form).current_password = $event,
          type: showCurrent.value ? "text" : "password",
          autocomplete: "current-password",
          class: "block w-full pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        }, null, _parent));
        _push(`<button type="button" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition" tabindex="-1"${ssrRenderAttr("aria-label", showCurrent.value ? "Hide password" : "Show password")}>`);
        if (!showCurrent.value) {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5
                                   c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639
                                   C20.577 16.49 16.64 19.5 12 19.5
                                   c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`);
        } else {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12
                                   C3.226 16.338 7.244 19.5 12 19.5
                                   c.993 0 1.953-.138 2.863-.395
                                   M6.228 6.228A10.45 10.45 0 0112 4.5
                                   c4.756 0 8.773 3.162 10.065 7.498
                                   a10.523 10.523 0 01-4.293 5.774
                                   M6.228 6.228L3 3m3.228 3.228l3.65 3.65
                                   m7.894 7.894L21 21m-3.228-3.228-3.65-3.65
                                   m0 0a3 3 0 10-4.243-4.243
                                   m4.242 4.242L9.88 9.88"></path></svg>`);
        }
        _push(`</button></div>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          message: unref(form).errors.current_password,
          class: "mt-2"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        for: "password",
        value: "New Password",
        class: "dark:text-gray-300"
      }, null, _parent));
      _push(`<div class="relative mt-1">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        id: "password",
        ref_key: "passwordInput",
        ref: passwordInput,
        modelValue: unref(form).password,
        "onUpdate:modelValue": ($event) => unref(form).password = $event,
        type: showNew.value ? "text" : "password",
        autocomplete: "new-password",
        class: "block w-full pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      }, null, _parent));
      _push(`<button type="button" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition" tabindex="-1"${ssrRenderAttr("aria-label", showNew.value ? "Hide password" : "Show password")}>`);
      if (!showNew.value) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5
                                   c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639
                                   C20.577 16.49 16.64 19.5 12 19.5
                                   c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12
                                   C3.226 16.338 7.244 19.5 12 19.5
                                   c.993 0 1.953-.138 2.863-.395
                                   M6.228 6.228A10.45 10.45 0 0112 4.5
                                   c4.756 0 8.773 3.162 10.065 7.498
                                   a10.523 10.523 0 01-4.293 5.774
                                   M6.228 6.228L3 3m3.228 3.228l3.65 3.65
                                   m7.894 7.894L21 21m-3.228-3.228-3.65-3.65
                                   m0 0a3 3 0 10-4.243-4.243
                                   m4.242 4.242L9.88 9.88"></path></svg>`);
      }
      _push(`</button></div>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        message: unref(form).errors.password,
        class: "mt-2"
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        for: "password_confirmation",
        value: "Confirm Password",
        class: "dark:text-gray-300"
      }, null, _parent));
      _push(`<div class="relative mt-1">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        id: "password_confirmation",
        modelValue: unref(form).password_confirmation,
        "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
        type: showConfirm.value ? "text" : "password",
        autocomplete: "new-password",
        class: "block w-full pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      }, null, _parent));
      _push(`<button type="button" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition" tabindex="-1"${ssrRenderAttr("aria-label", showConfirm.value ? "Hide password" : "Show password")}>`);
      if (!showConfirm.value) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5
                                   c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639
                                   C20.577 16.49 16.64 19.5 12 19.5
                                   c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12
                                   C3.226 16.338 7.244 19.5 12 19.5
                                   c.993 0 1.953-.138 2.863-.395
                                   M6.228 6.228A10.45 10.45 0 0112 4.5
                                   c4.756 0 8.773 3.162 10.065 7.498
                                   a10.523 10.523 0 01-4.293 5.774
                                   M6.228 6.228L3 3m3.228 3.228l3.65 3.65
                                   m7.894 7.894L21 21m-3.228-3.228-3.65-3.65
                                   m0 0a3 3 0 10-4.243-4.243
                                   m4.242 4.242L9.88 9.88"></path></svg>`);
      }
      _push(`</button></div>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        message: unref(form).errors.password_confirmation,
        class: "mt-2"
      }, null, _parent));
      _push(`</div><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(PrimaryButton, {
        disabled: unref(form).processing,
        class: "flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(form).processing) {
              _push2(`<svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(form).processing ? "Saving..." : "Save")}`);
          } else {
            return [
              unref(form).processing ? (openBlock(), createBlock("svg", {
                key: 0,
                class: "animate-spin w-4 h-4 text-white",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24"
              }, [
                createVNode("circle", {
                  class: "opacity-25",
                  cx: "12",
                  cy: "12",
                  r: "10",
                  stroke: "currentColor",
                  "stroke-width": "4"
                }),
                createVNode("path", {
                  class: "opacity-75",
                  fill: "currentColor",
                  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                })
              ])) : createCommentVNode("", true),
              createTextVNode(" " + toDisplayString(unref(form).processing ? "Saving..." : "Save"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(form).recentlySuccessful) {
        _push(`<p class="text-sm text-gray-600 dark:text-gray-400">Saved.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/UpdatePasswordForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
