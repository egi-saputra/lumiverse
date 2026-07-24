import { computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, withDirectives, vModelText, openBlock, createBlock, createCommentVNode, vModelSelect, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { u as useTenant } from "./useTenant-CDcYNPHx.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    siswa: Object,
    kelas: Array,
    kejuruan: Array,
    isSmk: Boolean
  },
  setup(__props) {
    const props = __props;
    const { isWorkspace } = useTenant();
    const t = computed(() => isWorkspace.value ? {
      pageTitle: "Edit Employee Data",
      heading: "Edit Employee Data",
      idPrimaryLabel: "Employee ID",
      idPrimaryPlaceholder: "Enter Employee ID here...",
      idSecondaryLabel: "Secondary Employee ID",
      idSecondaryPlaceholder: "Enter Secondary Employee ID here...",
      groupLabel: "Team / Division",
      groupPlaceholder: "-- Select Team / Division --",
      leadLabel: "Team Lead"
    } : {
      pageTitle: "Edit Student Data",
      heading: "Edit Student Data",
      idPrimaryLabel: "NIS",
      idPrimaryPlaceholder: "Enter NIS here...",
      idSecondaryLabel: "NISN",
      idSecondaryPlaceholder: "Enter NISN here...",
      groupLabel: "Class Unit",
      groupPlaceholder: "-- Select Class --",
      leadLabel: "OSIS Member"
    });
    const form = useForm({
      nama_lengkap: props.siswa.nama_lengkap,
      nis: props.siswa.nis,
      nisn: props.siswa.nisn,
      kelas_id: props.siswa.kelas_id,
      kejuruan_id: props.siswa.kejuruan_id,
      status: props.siswa.status,
      osis: props.siswa.osis
    });
    const submit = () => {
      form.put(route("admin.siswa.update", props.siswa.id));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: t.value.pageTitle
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition"${_scopeId}><div class="flex items-center gap-2 mb-6"${_scopeId}><h1 class="text-xl dark:text-gray-100 font-semibold"${_scopeId}>${ssrInterpolate(t.value.heading)}</h1></div><form class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm dark:text-gray-300 font-medium mb-1"${_scopeId}>Full Name</label><input${ssrRenderAttr("value", unref(form).nama_lengkap)} type="text" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}>`);
            if (unref(form).errors.nama_lengkap) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.nama_lengkap)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm dark:text-gray-300 font-medium mb-1"${_scopeId}>Account Status</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}><option value="Activated"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Activated") : ssrLooseEqual(unref(form).status, "Activated")) ? " selected" : ""}${_scopeId}>Active</option><option value="Deactivated"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Deactivated") : ssrLooseEqual(unref(form).status, "Deactivated")) ? " selected" : ""}${_scopeId}>Inactive</option></select></div><div${_scopeId}><label class="block text-sm dark:text-gray-300 font-medium mb-1"${_scopeId}>${ssrInterpolate(t.value.idPrimaryLabel)}</label><input${ssrRenderAttr("value", unref(form).nis)} type="text"${ssrRenderAttr("placeholder", t.value.idPrimaryPlaceholder)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}>`);
            if (unref(form).errors.nis) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.nis)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm dark:text-gray-300 font-medium mb-1"${_scopeId}>${ssrInterpolate(t.value.idSecondaryLabel)}</label><input${ssrRenderAttr("value", unref(form).nisn)} type="text" maxlength="10"${ssrRenderAttr("placeholder", t.value.idSecondaryPlaceholder)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}>`);
            if (unref(form).errors.nisn) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.nisn)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm dark:text-gray-300 font-medium mb-1"${_scopeId}>${ssrInterpolate(t.value.groupLabel)}</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, "") : ssrLooseEqual(unref(form).kelas_id, "")) ? " selected" : ""}${_scopeId}>${ssrInterpolate(t.value.groupPlaceholder)}</option><!--[-->`);
            ssrRenderList(__props.kelas, (k) => {
              _push2(`<option${ssrRenderAttr("value", k.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, k.id) : ssrLooseEqual(unref(form).kelas_id, k.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k.kelas)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.kelas_id) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.kelas_id)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.isSmk && !unref(isWorkspace)) {
              _push2(`<div${_scopeId}><label class="block text-sm dark:text-gray-300 font-medium mb-1"${_scopeId}>Vocational Program</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).kejuruan_id) ? ssrLooseContain(unref(form).kejuruan_id, "") : ssrLooseEqual(unref(form).kejuruan_id, "")) ? " selected" : ""}${_scopeId}>-- Select Program --</option><!--[-->`);
              ssrRenderList(__props.kejuruan, (k) => {
                _push2(`<option${ssrRenderAttr("value", k.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).kejuruan_id) ? ssrLooseContain(unref(form).kejuruan_id, k.id) : ssrLooseEqual(unref(form).kejuruan_id, k.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k.kejuruan)}</option>`);
              });
              _push2(`<!--]--></select>`);
              if (unref(form).errors.kejuruan_id) {
                _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.kejuruan_id)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div${_scopeId}><label class="block text-sm dark:text-gray-300 font-medium mb-1"${_scopeId}>${ssrInterpolate(t.value.leadLabel)}</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).osis) ? ssrLooseContain(unref(form).osis, "") : ssrLooseEqual(unref(form).osis, "")) ? " selected" : ""}${_scopeId}>-- Select --</option><option value="yes"${ssrIncludeBooleanAttr(Array.isArray(unref(form).osis) ? ssrLooseContain(unref(form).osis, "yes") : ssrLooseEqual(unref(form).osis, "yes")) ? " selected" : ""}${_scopeId}>Yes</option><option value="no"${ssrIncludeBooleanAttr(Array.isArray(unref(form).osis) ? ssrLooseContain(unref(form).osis, "no") : ssrLooseEqual(unref(form).osis, "no")) ? " selected" : ""}${_scopeId}>No</option></select>`);
            if (unref(form).errors.osis) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.osis)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="md:col-span-2 flex dark:text-gray-300 justify-end gap-2 pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("admin.siswa.index"),
              class: "px-4 py-2 dark:hover:bg-gray-800 rounded-lg border"
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
            _push2(`<button type="submit" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}> Save Changes </button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition" }, [
                createVNode("div", { class: "flex items-center gap-2 mb-6" }, [
                  createVNode("h1", { class: "text-xl dark:text-gray-100 font-semibold" }, toDisplayString(t.value.heading), 1)
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "grid grid-cols-1 md:grid-cols-2 gap-4"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm dark:text-gray-300 font-medium mb-1" }, "Full Name"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).nama_lengkap = $event,
                      type: "text",
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).nama_lengkap]
                    ]),
                    unref(form).errors.nama_lengkap ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.nama_lengkap), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm dark:text-gray-300 font-medium mb-1" }, "Account Status"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).status = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    }, [
                      createVNode("option", { value: "Activated" }, "Active"),
                      createVNode("option", { value: "Deactivated" }, "Inactive")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(form).status]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm dark:text-gray-300 font-medium mb-1" }, toDisplayString(t.value.idPrimaryLabel), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).nis = $event,
                      type: "text",
                      placeholder: t.value.idPrimaryPlaceholder,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(form).nis]
                    ]),
                    unref(form).errors.nis ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.nis), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm dark:text-gray-300 font-medium mb-1" }, toDisplayString(t.value.idSecondaryLabel), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).nisn = $event,
                      type: "text",
                      maxlength: "10",
                      placeholder: t.value.idSecondaryPlaceholder,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(form).nisn]
                    ]),
                    unref(form).errors.nisn ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.nisn), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm dark:text-gray-300 font-medium mb-1" }, toDisplayString(t.value.groupLabel), 1),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).kelas_id = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    }, [
                      createVNode("option", { value: "" }, toDisplayString(t.value.groupPlaceholder), 1),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.kelas, (k) => {
                        return openBlock(), createBlock("option", {
                          key: k.id,
                          value: k.id
                        }, toDisplayString(k.kelas), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(form).kelas_id]
                    ]),
                    unref(form).errors.kelas_id ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.kelas_id), 1)) : createCommentVNode("", true)
                  ]),
                  __props.isSmk && !unref(isWorkspace) ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("label", { class: "block text-sm dark:text-gray-300 font-medium mb-1" }, "Vocational Program"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).kejuruan_id = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    }, [
                      createVNode("option", { value: "" }, "-- Select Program --"),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.kejuruan, (k) => {
                        return openBlock(), createBlock("option", {
                          key: k.id,
                          value: k.id
                        }, toDisplayString(k.kejuruan), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(form).kejuruan_id]
                    ]),
                    unref(form).errors.kejuruan_id ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.kejuruan_id), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm dark:text-gray-300 font-medium mb-1" }, toDisplayString(t.value.leadLabel), 1),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).osis = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    }, [
                      createVNode("option", { value: "" }, "-- Select --"),
                      createVNode("option", { value: "yes" }, "Yes"),
                      createVNode("option", { value: "no" }, "No")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(form).osis]
                    ]),
                    unref(form).errors.osis ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.osis), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "md:col-span-2 flex dark:text-gray-300 justify-end gap-2 pt-4" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("admin.siswa.index"),
                      class: "px-4 py-2 dark:hover:bg-gray-800 rounded-lg border"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      class: "px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition",
                      disabled: unref(form).processing
                    }, " Save Changes ", 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Siswa/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
