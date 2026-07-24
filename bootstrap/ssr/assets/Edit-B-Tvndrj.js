import { ref, unref, withCtx, createVNode, createTextVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, vModelSelect, vModelDynamic, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderDynamicModel } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { usePage, useForm, Head, Link } from "@inertiajs/vue3";
import { EyeIcon, EyeSlashIcon, XMarkIcon, ArrowPathIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    user: Object
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const roles = page.props.roles;
    const showPassword = ref(false);
    const form = useForm({
      name: props.user.name,
      email: props.user.email,
      role: props.user.role,
      password: ""
    });
    const submit = () => {
      form.put(route("admin.users.update", props.user.id), {
        preserveScroll: true,
        onSuccess: () => {
          form.reset("password");
          showPassword.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Edit User" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-3xl mx-auto p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-xl transition" data-v-d9351971${_scopeId}><div class="flex items-center justify-between mb-6" data-v-d9351971${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white" data-v-d9351971${_scopeId}>User Profile Settings</h1></div><form class="space-y-6" data-v-d9351971${_scopeId}><div data-v-d9351971${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-d9351971${_scopeId}>Username</label><input type="text"${ssrRenderAttr("value", unref(form).name)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-d9351971${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-d9351971${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-d9351971${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-d9351971${_scopeId}>Email Address</label><input type="email"${ssrRenderAttr("value", unref(form).email)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-d9351971${_scopeId}>`);
            if (unref(form).errors.email) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-d9351971${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-d9351971${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-d9351971${_scopeId}>Role User</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" data-v-d9351971${_scopeId}><option value="" disabled data-v-d9351971${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "") : ssrLooseEqual(unref(form).role, "")) ? " selected" : ""}${_scopeId}>-- Select Role --</option><!--[-->`);
            ssrRenderList(unref(roles), (role) => {
              _push2(`<option${ssrRenderAttr("value", role)} data-v-d9351971${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, role) : ssrLooseEqual(unref(form).role, role)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(role)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.role) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-d9351971${_scopeId}>${ssrInterpolate(unref(form).errors.role)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-d9351971${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-d9351971${_scopeId}>New Password (Optional)</label><div class="relative" data-v-d9351971${_scopeId}><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(form).password, null)} class="w-full pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-d9351971${_scopeId}><button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition" data-v-d9351971${_scopeId}>`);
            if (!showPassword.value) {
              _push2(ssrRenderComponent(unref(EyeIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(EyeSlashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            }
            _push2(`</button></div></div><div class="flex flex-row w-full justify-end gap-3 pt-4" data-v-d9351971${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("admin.users.index"),
              class: "inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                  _push3(` Cancel `);
                } else {
                  return [
                    createVNode(unref(XMarkIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition" data-v-d9351971${_scopeId}>`);
            if (unref(form).processing) {
              _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-4 h-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(CheckCircleIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            }
            _push2(`<span data-v-d9351971${_scopeId}>${ssrInterpolate(unref(form).processing ? "Updating…" : "Update")}</span></button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-3xl mx-auto p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-xl transition" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "User Profile Settings")
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "space-y-6"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Username"),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).name]
                    ]),
                    unref(form).errors.name ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-600 text-sm mt-1"
                    }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Email Address"),
                    withDirectives(createVNode("input", {
                      type: "email",
                      "onUpdate:modelValue": ($event) => unref(form).email = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).email]
                    ]),
                    unref(form).errors.email ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-600 text-sm mt-1"
                    }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Role User"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).role = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    }, [
                      createVNode("option", {
                        value: "",
                        disabled: ""
                      }, "-- Select Role --"),
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(roles), (role) => {
                        return openBlock(), createBlock("option", {
                          key: role,
                          value: role
                        }, toDisplayString(role), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(form).role]
                    ]),
                    unref(form).errors.role ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-600 text-sm mt-1"
                    }, toDisplayString(unref(form).errors.role), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "New Password (Optional)"),
                    createVNode("div", { class: "relative" }, [
                      withDirectives(createVNode("input", {
                        type: showPassword.value ? "text" : "password",
                        "onUpdate:modelValue": ($event) => unref(form).password = $event,
                        class: "w-full pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition"
                      }, null, 8, ["type", "onUpdate:modelValue"]), [
                        [vModelDynamic, unref(form).password]
                      ]),
                      createVNode("button", {
                        type: "button",
                        onClick: ($event) => showPassword.value = !showPassword.value,
                        class: "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
                      }, [
                        !showPassword.value ? (openBlock(), createBlock(unref(EyeIcon), {
                          key: 0,
                          class: "w-5 h-5"
                        })) : (openBlock(), createBlock(unref(EyeSlashIcon), {
                          key: 1,
                          class: "w-5 h-5"
                        }))
                      ], 8, ["onClick"])
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-row w-full justify-end gap-3 pt-4" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("admin.users.index"),
                      class: "inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(XMarkIcon), { class: "w-4 h-4" }),
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    }, [
                      unref(form).processing ? (openBlock(), createBlock(unref(ArrowPathIcon), {
                        key: 0,
                        class: "w-4 h-4 animate-spin"
                      })) : (openBlock(), createBlock(unref(CheckCircleIcon), {
                        key: 1,
                        class: "w-4 h-4"
                      })),
                      createVNode("span", null, toDisplayString(unref(form).processing ? "Updating…" : "Update"), 1)
                    ], 8, ["disabled"])
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Users/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Edit = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d9351971"]]);
export {
  Edit as default
};
