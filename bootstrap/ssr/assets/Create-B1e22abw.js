import { computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, withDirectives, openBlock, createBlock, Fragment, renderList, vModelSelect, createCommentVNode, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { u as useTenant } from "./useTenant-CDcYNPHx.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    users: Array
    // menerima data user role guru
  },
  setup(__props) {
    const props = __props;
    const { isWorkspace } = useTenant();
    const t = computed(() => isWorkspace.value ? {
      pageTitle: "Add Manager",
      heading: "Add Manager",
      userSelectLabel: "Select User",
      userSelectPlaceholder: "-- select user --",
      nameLabel: "Manager Name (Optional)",
      namePlaceholder: "e.g., Budi Santoso",
      cancelRoute: "admin.guru.index"
    } : {
      pageTitle: "Add Teacher Data",
      heading: "Add Teacher",
      userSelectLabel: "Select User",
      userSelectPlaceholder: "-- select user --",
      nameLabel: "Full Name + Title (Optional)",
      namePlaceholder: "e.g., Guru Pertama, S. Pd",
      cancelRoute: "admin.guru.index"
    });
    const form = useForm({
      user_id: "",
      nama_lengkap: ""
    });
    const submit = () => {
      form.post(route("admin.guru.store"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: t.value.pageTitle
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition"${_scopeId}><h1 class="text-xl dark:text-gray-200 font-semibold mb-6"${_scopeId}>${ssrInterpolate(t.value.heading)}</h1><form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm dark:text-gray-400 font-medium mb-1"${_scopeId}>${ssrInterpolate(t.value.userSelectLabel)}</label><select required class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).user_id) ? ssrLooseContain(unref(form).user_id, "") : ssrLooseEqual(unref(form).user_id, "")) ? " selected" : ""}${_scopeId}>${ssrInterpolate(t.value.userSelectPlaceholder)}</option><!--[-->`);
            ssrRenderList(props.users, (u) => {
              _push2(`<option${ssrRenderAttr("value", u.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).user_id) ? ssrLooseContain(unref(form).user_id, u.id) : ssrLooseEqual(unref(form).user_id, u.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(u.name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.user_id) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.user_id)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium dark:text-gray-400 mb-1"${_scopeId}>${ssrInterpolate(t.value.nameLabel)}</label><input${ssrRenderAttr("value", unref(form).nama_lengkap)} type="text"${ssrRenderAttr("placeholder", t.value.namePlaceholder)} required class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}>`);
            if (unref(form).errors.nama_lengkap) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.nama_lengkap)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex justify-end gap-2 pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route(t.value.cancelRoute),
              class: "px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
            _push2(`<button type="submit" class="px-4 py-2 rounded-lg hover:bg-blue-800 bg-blue-600 text-white"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}> Save </button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition" }, [
                createVNode("h1", { class: "text-xl dark:text-gray-200 font-semibold mb-6" }, toDisplayString(t.value.heading), 1),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "space-y-4"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm dark:text-gray-400 font-medium mb-1" }, toDisplayString(t.value.userSelectLabel), 1),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).user_id = $event,
                      required: "",
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    }, [
                      createVNode("option", { value: "" }, toDisplayString(t.value.userSelectPlaceholder), 1),
                      (openBlock(true), createBlock(Fragment, null, renderList(props.users, (u) => {
                        return openBlock(), createBlock("option", {
                          key: u.id,
                          value: u.id
                        }, toDisplayString(u.name), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(form).user_id]
                    ]),
                    unref(form).errors.user_id ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.user_id), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium dark:text-gray-400 mb-1" }, toDisplayString(t.value.nameLabel), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).nama_lengkap = $event,
                      type: "text",
                      placeholder: t.value.namePlaceholder,
                      required: "",
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(form).nama_lengkap]
                    ]),
                    unref(form).errors.nama_lengkap ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.nama_lengkap), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex justify-end gap-2 pt-4" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route(t.value.cancelRoute),
                      class: "px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      class: "px-4 py-2 rounded-lg hover:bg-blue-800 bg-blue-600 text-white",
                      disabled: unref(form).processing
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Guru/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
