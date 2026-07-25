import { unref, withCtx, createTextVNode, openBlock, createBlock, createVNode, createCommentVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1, a as _sfc_main$2, b as _sfc_main$3 } from "./TextInput-A0-GkXWF.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { usePage, useForm, Link } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "UpdateProfileInformationForm",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: { type: Boolean },
    status: { type: String }
  },
  setup(__props) {
    const user = usePage().props.auth.user;
    const form = useForm({
      name: user.name,
      email: user.email
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><header><h2 class="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h2><p class="mt-1 text-sm text-gray-600 dark:text-gray-400"> Update your account&#39;s profile information and email address. </p></header><form class="mt-6 space-y-6"><div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        for: "name",
        value: "Name",
        class: "dark:text-gray-300"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        id: "name",
        type: "text",
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        required: "",
        autofocus: "",
        autocomplete: "name",
        class: "mt-1 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        class: "mt-2",
        message: unref(form).errors.name
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        for: "email",
        value: "Email",
        class: "dark:text-gray-300"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        id: "email",
        type: "email",
        modelValue: unref(form).email,
        "onUpdate:modelValue": ($event) => unref(form).email = $event,
        required: "",
        autocomplete: "username",
        class: "mt-1 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        class: "mt-2",
        message: unref(form).errors.email
      }, null, _parent));
      _push(`</div>`);
      if (__props.mustVerifyEmail && unref(user).email_verified_at === null) {
        _push(`<div><p class="text-sm mt-2 text-gray-800 dark:text-gray-400"> Your email address is unverified. `);
        _push(ssrRenderComponent(unref(Link), {
          href: _ctx.route("verification.send"),
          method: "post",
          as: "button",
          class: "underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Click here to re-send the verification email. `);
            } else {
              return [
                createTextVNode(" Click here to re-send the verification email. ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p><div class="mt-2 font-medium text-sm text-green-600 dark:text-green-400" style="${ssrRenderStyle(__props.status === "verification-link-sent" ? null : { display: "none" })}"> A new verification link has been sent to your email address. </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-4">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
