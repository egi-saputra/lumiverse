import { computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, withDirectives, vModelText, openBlock, createBlock, createCommentVNode, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { u as useTenant } from "./useTenant-CDcYNPHx.js";
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
  props: {
    guru: Array
    // menerima list guru dari controller
  },
  setup(__props) {
    const props = __props;
    const { isWorkspace } = useTenant();
    const t = computed(() => isWorkspace.value ? {
      pageTitle: "Add Department",
      heading: "Add Department Data",
      itemNameLabel: "Department Name",
      itemNamePlaceholder: "Enter department name...",
      personLabel: "Department Manager",
      personPlaceholder: "-- select manager --"
    } : {
      pageTitle: "Add Subject",
      heading: "Add Subject Data",
      itemNameLabel: "Subject Name",
      itemNamePlaceholder: "Enter subject name...",
      personLabel: "Subject Teacher",
      personPlaceholder: "-- select teacher --"
    });
    const form = useForm({
      mapel: "",
      guru_id: ""
      // tambahkan ini
    });
    const submit = () => {
      form.post(route("admin.mapel.store"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: t.value.pageTitle
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-3xl mx-auto sm:p-6" data-v-d20f6934${_scopeId}><div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition" data-v-d20f6934${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6" data-v-d20f6934${_scopeId}>${ssrInterpolate(t.value.heading)}</h1><form class="space-y-5" data-v-d20f6934${_scopeId}><div data-v-d20f6934${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-d20f6934${_scopeId}>${ssrInterpolate(t.value.itemNameLabel)}</label><input${ssrRenderAttr("value", unref(form).mapel)} type="text"${ssrRenderAttr("placeholder", t.value.itemNamePlaceholder)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required data-v-d20f6934${_scopeId}>`);
            if (unref(form).errors.mapel) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-d20f6934${_scopeId}>${ssrInterpolate(unref(form).errors.mapel)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-d20f6934${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-d20f6934${_scopeId}>${ssrInterpolate(t.value.personLabel)}</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required data-v-d20f6934${_scopeId}><option value="" data-v-d20f6934${ssrIncludeBooleanAttr(Array.isArray(unref(form).guru_id) ? ssrLooseContain(unref(form).guru_id, "") : ssrLooseEqual(unref(form).guru_id, "")) ? " selected" : ""}${_scopeId}>${ssrInterpolate(t.value.personPlaceholder)}</option><!--[-->`);
            ssrRenderList(props.guru, (g) => {
              _push2(`<option${ssrRenderAttr("value", g.id)} data-v-d20f6934${ssrIncludeBooleanAttr(Array.isArray(unref(form).guru_id) ? ssrLooseContain(unref(form).guru_id, g.id) : ssrLooseEqual(unref(form).guru_id, g.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(g.nama_lengkap)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.guru_id) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-d20f6934${_scopeId}>${ssrInterpolate(unref(form).errors.guru_id)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex justify-end gap-3 pt-4" data-v-d20f6934${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("admin.mapel.index"),
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
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition" data-v-d20f6934${_scopeId}> Save </button></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-3xl mx-auto sm:p-6" }, [
                createVNode("div", { class: "bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition" }, [
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white mb-6" }, toDisplayString(t.value.heading), 1),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "space-y-5"
                  }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, toDisplayString(t.value.itemNameLabel), 1),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).mapel = $event,
                        type: "text",
                        placeholder: t.value.itemNamePlaceholder,
                        class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, unref(form).mapel]
                      ]),
                      unref(form).errors.mapel ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-red-600 text-sm mt-1"
                      }, toDisplayString(unref(form).errors.mapel), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, toDisplayString(t.value.personLabel), 1),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).guru_id = $event,
                        class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                        required: ""
                      }, [
                        createVNode("option", { value: "" }, toDisplayString(t.value.personPlaceholder), 1),
                        (openBlock(true), createBlock(Fragment, null, renderList(props.guru, (g) => {
                          return openBlock(), createBlock("option", {
                            key: g.id,
                            value: g.id
                          }, toDisplayString(g.nama_lengkap), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).guru_id]
                      ]),
                      unref(form).errors.guru_id ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-red-600 text-sm mt-1"
                      }, toDisplayString(unref(form).errors.guru_id), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex justify-end gap-3 pt-4" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("admin.mapel.index"),
                        class: "px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      }, " Save ", 8, ["disabled"])
                    ])
                  ], 32)
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Mapel/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d20f6934"]]);
export {
  Create as default
};
