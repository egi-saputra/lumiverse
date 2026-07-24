import { computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, withDirectives, vModelText, openBlock, createBlock, createCommentVNode, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
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
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    kelas: Array,
    kejuruan: Array,
    isSmk: Boolean
  },
  setup(__props) {
    const { isWorkspace } = useTenant();
    const t = computed(() => isWorkspace.value ? {
      pageTitle: "Register Employee",
      heading: "Employee Registration",
      idPrimaryLabel: "Employee ID",
      idSecondaryLabel: "Secondary Employee ID",
      groupLabel: "Team / Division",
      groupPlaceholder: "-- Choose the team / division --"
    } : {
      pageTitle: "Register Siswa",
      heading: "Registrasi Siswa",
      idPrimaryLabel: "NIS (10 digit)",
      idSecondaryLabel: "NISN (10 digit)",
      groupLabel: "Class Unit",
      groupPlaceholder: "-- Choose the class --"
    });
    const form = useForm({
      nama_lengkap: "",
      nis: "",
      nisn: "",
      kelas_id: "",
      kejuruan_id: ""
    });
    const submit = () => {
      form.post(route("admin.siswa.store"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: t.value.pageTitle
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white rounded-lg shadow p-6"${_scopeId}><h1 class="text-xl font-semibold mb-6"${_scopeId}>${ssrInterpolate(t.value.heading)}</h1><form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Nama Lengkap</label><input${ssrRenderAttr("value", unref(form).nama_lengkap)} type="text" class="w-full rounded-lg border-gray-300"${_scopeId}>`);
            if (unref(form).errors.nama_lengkap) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.nama_lengkap)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>${ssrInterpolate(t.value.idPrimaryLabel)}</label><input${ssrRenderAttr("value", unref(form).nis)} type="text" maxlength="10" class="w-full rounded-lg border-gray-300"${_scopeId}>`);
            if (unref(form).errors.nis) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.nis)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>${ssrInterpolate(t.value.idSecondaryLabel)}</label><input${ssrRenderAttr("value", unref(form).nisn)} type="text" maxlength="10" class="w-full rounded-lg border-gray-300"${_scopeId}>`);
            if (unref(form).errors.nisn) {
              _push2(`<div class="text-red-500 text-sm"${_scopeId}>${ssrInterpolate(unref(form).errors.nisn)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>${ssrInterpolate(t.value.groupLabel)}</label><select class="w-full rounded-lg border-gray-300"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, "") : ssrLooseEqual(unref(form).kelas_id, "")) ? " selected" : ""}${_scopeId}>${ssrInterpolate(t.value.groupPlaceholder)}</option><!--[-->`);
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
              _push2(`<div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Vocational</label><select class="w-full rounded-lg border-gray-300"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).kejuruan_id) ? ssrLooseContain(unref(form).kejuruan_id, "") : ssrLooseEqual(unref(form).kejuruan_id, "")) ? " selected" : ""}${_scopeId}>-- Choose a vocation --</option><!--[-->`);
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
            _push2(`<div class="flex justify-end gap-2 pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("admin.siswa.index"),
              class: "px-4 py-2 rounded-lg border"
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
            _push2(`<button type="submit" class="px-4 py-2 rounded-lg bg-indigo-600 text-white"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}> Save </button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-white rounded-lg shadow p-6" }, [
                createVNode("h1", { class: "text-xl font-semibold mb-6" }, toDisplayString(t.value.heading), 1),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "space-y-4"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1" }, "Nama Lengkap"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).nama_lengkap = $event,
                      type: "text",
                      class: "w-full rounded-lg border-gray-300"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).nama_lengkap]
                    ]),
                    unref(form).errors.nama_lengkap ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.nama_lengkap), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1" }, toDisplayString(t.value.idPrimaryLabel), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).nis = $event,
                      type: "text",
                      maxlength: "10",
                      class: "w-full rounded-lg border-gray-300"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).nis]
                    ]),
                    unref(form).errors.nis ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.nis), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1" }, toDisplayString(t.value.idSecondaryLabel), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).nisn = $event,
                      type: "text",
                      maxlength: "10",
                      class: "w-full rounded-lg border-gray-300"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).nisn]
                    ]),
                    unref(form).errors.nisn ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-500 text-sm"
                    }, toDisplayString(unref(form).errors.nisn), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1" }, toDisplayString(t.value.groupLabel), 1),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).kelas_id = $event,
                      class: "w-full rounded-lg border-gray-300"
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
                    createVNode("label", { class: "block text-sm font-medium mb-1" }, "Vocational"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).kejuruan_id = $event,
                      class: "w-full rounded-lg border-gray-300"
                    }, [
                      createVNode("option", { value: "" }, "-- Choose a vocation --"),
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
                  createVNode("div", { class: "flex justify-end gap-2 pt-4" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("admin.siswa.index"),
                      class: "px-4 py-2 rounded-lg border"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      class: "px-4 py-2 rounded-lg bg-indigo-600 text-white",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Siswa/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
