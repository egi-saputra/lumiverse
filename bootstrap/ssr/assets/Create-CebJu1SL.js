import { unref, withCtx, createTextVNode, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { usePage, useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const roles = page.props.roles;
    const form = useForm({
      name: "",
      email: "",
      password: "",
      role: ""
    });
    const submit = () => {
      form.post(route("admin.users.store"), {
        preserveScroll: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Create User" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-3xl mx-auto p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-xl transition" data-v-cf17201e${_scopeId}><div class="flex items-center justify-between mb-6" data-v-cf17201e${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white" data-v-cf17201e${_scopeId}> + Create New User </h1></div><form class="space-y-6" data-v-cf17201e${_scopeId}><div data-v-cf17201e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-cf17201e${_scopeId}>Username</label><input type="text"${ssrRenderAttr("value", unref(form).name)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-cf17201e${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-cf17201e${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-cf17201e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-cf17201e${_scopeId}>Email Address</label><input type="email"${ssrRenderAttr("value", unref(form).email)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-cf17201e${_scopeId}>`);
            if (unref(form).errors.email) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-cf17201e${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-cf17201e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-cf17201e${_scopeId}>Role User</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" data-v-cf17201e${_scopeId}><option value="" disabled data-v-cf17201e${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "") : ssrLooseEqual(unref(form).role, "")) ? " selected" : ""}${_scopeId}>-- Pilih Role --</option><!--[-->`);
            ssrRenderList(unref(roles), (role) => {
              _push2(`<option${ssrRenderAttr("value", role)} data-v-cf17201e${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, role) : ssrLooseEqual(unref(form).role, role)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(role)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.role) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-cf17201e${_scopeId}>${ssrInterpolate(unref(form).errors.role)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-cf17201e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-cf17201e${_scopeId}>Password</label><input type="password"${ssrRenderAttr("value", unref(form).password)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-cf17201e${_scopeId}>`);
            if (unref(form).errors.password) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-cf17201e${_scopeId}>${ssrInterpolate(unref(form).errors.password)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col sm:flex-row justify-end gap-3 pt-4" data-v-cf17201e${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("admin.users.index"),
              class: "px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition" data-v-cf17201e${_scopeId}> Save </button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-3xl mx-auto p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-xl transition" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, " + Create New User ")
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
                      }, "-- Pilih Role --"),
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
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Password"),
                    withDirectives(createVNode("input", {
                      type: "password",
                      "onUpdate:modelValue": ($event) => unref(form).password = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).password]
                    ]),
                    unref(form).errors.password ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-600 text-sm mt-1"
                    }, toDisplayString(unref(form).errors.password), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex flex-col sm:flex-row justify-end gap-3 pt-4" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("admin.users.index"),
                      class: "px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-center"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                    }, " Save ", 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Users/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cf17201e"]]);
export {
  Create as default
};
