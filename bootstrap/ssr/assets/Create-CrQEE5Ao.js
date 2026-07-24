import { unref, withCtx, createTextVNode, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
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
    guru: Array
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      kejuruan: "",
      guru_id: ""
    });
    const submit = () => {
      form.post(route("admin.kejuruan.store"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Add Vocational Program" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-3xl mx-auto sm:p-6"${_scopeId}><div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition"${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6"${_scopeId}>Add Vocational Program Data</h1><form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"${_scopeId}>Program Name</label><input${ssrRenderAttr("value", unref(form).kejuruan)} type="text" placeholder="Enter vocational program" required class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}>`);
            if (unref(form).errors.kejuruan) {
              _push2(`<div class="text-red-600 dark:text-red-400 text-sm mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.kejuruan)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"${_scopeId}>Head of Program</label><select required class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700 50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).guru_id) ? ssrLooseContain(unref(form).guru_id, "") : ssrLooseEqual(unref(form).guru_id, "")) ? " selected" : ""}${_scopeId}>-- Select Teacher --</option><!--[-->`);
            ssrRenderList(props.guru, (g) => {
              _push2(`<option${ssrRenderAttr("value", g.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).guru_id) ? ssrLooseContain(unref(form).guru_id, g.id) : ssrLooseEqual(unref(form).guru_id, g.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(g.nama_lengkap)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.guru_id) {
              _push2(`<div class="text-red-600 dark:text-red-400 text-sm mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.guru_id)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex justify-end gap-3 pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("admin.kejuruan.index"),
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
            _push2(`<button type="submit" class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"${_scopeId}> Save </button></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-3xl mx-auto sm:p-6" }, [
                createVNode("div", { class: "bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition" }, [
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white mb-6" }, "Add Vocational Program Data"),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Program Name"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).kejuruan = $event,
                        type: "text",
                        placeholder: "Enter vocational program",
                        required: "",
                        class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).kejuruan]
                      ]),
                      unref(form).errors.kejuruan ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-red-600 dark:text-red-400 text-sm mt-1"
                      }, toDisplayString(unref(form).errors.kejuruan), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Head of Program"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).guru_id = $event,
                        required: "",
                        class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700 50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      }, [
                        createVNode("option", { value: "" }, "-- Select Teacher --"),
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
                        class: "text-red-600 dark:text-red-400 text-sm mt-1"
                      }, toDisplayString(unref(form).errors.guru_id), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex justify-end gap-3 pt-4" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("admin.kejuruan.index"),
                        class: "px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      createVNode("button", {
                        type: "submit",
                        class: "px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      }, " Save ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Kejuruan/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
