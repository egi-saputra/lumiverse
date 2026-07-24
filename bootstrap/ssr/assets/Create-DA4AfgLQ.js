import { withCtx, unref, createVNode, createTextVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { usePage, useForm, Link } from "@inertiajs/vue3";
import { CheckIcon, ArrowLeftIcon } from "@heroicons/vue/24/solid";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    mapel: Array
  },
  setup(__props) {
    usePage();
    const form = useForm({
      title: "",
      mapel_id: "",
      kelas: "",
      waktu: "",
      status: "Tidak Aktif",
      tipe_soal: "Berurutan"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="sm:py-8 sm:pb-0 pb-10 sm:px-4 min-h-screen"${_scopeId}><div class="mx-auto md:border md:text-base text-sm md:border-gray-300 md:bg-white dark:bg-slate-900/70 dark:border-slate-800 md:rounded-2xl md:shadow-xl md:p-8"${_scopeId}><div class="mb-6"${_scopeId}><h1 class="text-2xl sm:inline-block hidden font-extrabold text-gray-800 dark:text-slate-100 text-left"${_scopeId}> Create / Add Quiz </h1><p class="text-gray-500 dark:text-slate-400 sm:text-base text-sm"${_scopeId}> This page is intended to create or add quiz. </p></div><form${_scopeId}><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"${_scopeId}><div${_scopeId}><label class="block font-semibold text-gray-700 dark:text-slate-200"${_scopeId}> Quiz Title </label><input${ssrRenderAttr("value", unref(form).title)} type="text" placeholder="Please enter the quiz title" class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"${_scopeId}>`);
            if (unref(form).errors.title) {
              _push2(`<p class="text-red-600 text-sm mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.title)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block font-semibold text-gray-700 dark:text-slate-200"${_scopeId}> Subjects </label><select class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel_id) ? ssrLooseContain(unref(form).mapel_id, "") : ssrLooseEqual(unref(form).mapel_id, "")) ? " selected" : ""}${_scopeId}>-- Choose the subjects --</option><!--[-->`);
            ssrRenderList(__props.mapel, (m) => {
              _push2(`<option${ssrRenderAttr("value", m.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel_id) ? ssrLooseContain(unref(form).mapel_id, m.id) : ssrLooseEqual(unref(form).mapel_id, m.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(m.mapel)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.mapel_id) {
              _push2(`<div class="text-red-500 text-sm mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.mapel_id)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block font-semibold text-gray-700 dark:text-slate-200"${_scopeId}> Class Room </label><input${ssrRenderAttr("value", unref(form).kelas)} type="text" placeholder="Please enter the class room" class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue- dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"${_scopeId}>`);
            if (unref(form).errors.kelas) {
              _push2(`<p class="text-red-600 text-sm mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.kelas)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block font-semibold text-gray-700 dark:text-slate-200"${_scopeId}> Duration (Minute) </label><input${ssrRenderAttr("value", unref(form).waktu)} type="number" placeholder="Enter the time limit here" class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"${_scopeId}>`);
            if (unref(form).errors.waktu) {
              _push2(`<p class="text-red-600 text-sm mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.waktu)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"${_scopeId}><div${_scopeId}><label class="block font-semibold text-gray-700 dark:text-slate-200"${_scopeId}> Quiz Status </label><select class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2"${_scopeId}><option value="Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Aktif") : ssrLooseEqual(unref(form).status, "Aktif")) ? " selected" : ""}${_scopeId}>Activated</option><option value="Tidak Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Tidak Aktif") : ssrLooseEqual(unref(form).status, "Tidak Aktif")) ? " selected" : ""}${_scopeId}>Deactivated</option></select></div><div${_scopeId}><label class="block font-semibold text-gray-700 dark:text-slate-200"${_scopeId}> Question Form </label><select class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2"${_scopeId}><option value="Berurutan"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe_soal) ? ssrLooseContain(unref(form).tipe_soal, "Berurutan") : ssrLooseEqual(unref(form).tipe_soal, "Berurutan")) ? " selected" : ""}${_scopeId}>Sequence</option><option value="Acak"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe_soal) ? ssrLooseContain(unref(form).tipe_soal, "Acak") : ssrLooseEqual(unref(form).tipe_soal, "Acak")) ? " selected" : ""}${_scopeId}>Shuffle</option></select></div></div><div class="flex flex-col sm:flex-row gap-4 mt-6"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transition"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<svg class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(CheckIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(form).processing ? "Creating your quiz...." : "Create Quiz")}</span></button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/proktor/soal/",
              class: "flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold rounded-lg shadow-lg transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-5 h-5" }, null, _parent3, _scopeId2));
                  _push3(` Back to Quiz `);
                } else {
                  return [
                    createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
                    createTextVNode(" Back to Quiz ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "sm:py-8 sm:pb-0 pb-10 sm:px-4 min-h-screen" }, [
                createVNode("div", { class: "mx-auto md:border md:text-base text-sm md:border-gray-300 md:bg-white dark:bg-slate-900/70 dark:border-slate-800 md:rounded-2xl md:shadow-xl md:p-8" }, [
                  createVNode("div", { class: "mb-6" }, [
                    createVNode("h1", { class: "text-2xl sm:inline-block hidden font-extrabold text-gray-800 dark:text-slate-100 text-left" }, " Create / Add Quiz "),
                    createVNode("p", { class: "text-gray-500 dark:text-slate-400 sm:text-base text-sm" }, " This page is intended to create or add quiz. ")
                  ]),
                  createVNode("form", {
                    onSubmit: withModifiers(() => {
                      console.log(unref(form));
                      unref(form).post("/proktor/soal");
                    }, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block font-semibold text-gray-700 dark:text-slate-200" }, " Quiz Title "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).title = $event,
                          type: "text",
                          placeholder: "Please enter the quiz title",
                          class: "w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).title]
                        ]),
                        unref(form).errors.title ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-red-600 text-sm mt-1"
                        }, toDisplayString(unref(form).errors.title), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block font-semibold text-gray-700 dark:text-slate-200" }, " Subjects "),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => unref(form).mapel_id = $event,
                          class: "w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2"
                        }, [
                          createVNode("option", { value: "" }, "-- Choose the subjects --"),
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.mapel, (m) => {
                            return openBlock(), createBlock("option", {
                              key: m.id,
                              value: m.id
                            }, toDisplayString(m.mapel), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, unref(form).mapel_id]
                        ]),
                        unref(form).errors.mapel_id ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-red-500 text-sm mt-1"
                        }, toDisplayString(unref(form).errors.mapel_id), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block font-semibold text-gray-700 dark:text-slate-200" }, " Class Room "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).kelas = $event,
                          type: "text",
                          placeholder: "Please enter the class room",
                          class: "w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue- dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).kelas]
                        ]),
                        unref(form).errors.kelas ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-red-600 text-sm mt-1"
                        }, toDisplayString(unref(form).errors.kelas), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block font-semibold text-gray-700 dark:text-slate-200" }, " Duration (Minute) "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).waktu = $event,
                          type: "number",
                          placeholder: "Enter the time limit here",
                          class: "w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).waktu]
                        ]),
                        unref(form).errors.waktu ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-red-600 text-sm mt-1"
                        }, toDisplayString(unref(form).errors.waktu), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block font-semibold text-gray-700 dark:text-slate-200" }, " Quiz Status "),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => unref(form).status = $event,
                          class: "w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2"
                        }, [
                          createVNode("option", { value: "Aktif" }, "Activated"),
                          createVNode("option", { value: "Tidak Aktif" }, "Deactivated")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, unref(form).status]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block font-semibold text-gray-700 dark:text-slate-200" }, " Question Form "),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => unref(form).tipe_soal = $event,
                          class: "w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2"
                        }, [
                          createVNode("option", { value: "Berurutan" }, "Sequence"),
                          createVNode("option", { value: "Acak" }, "Shuffle")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, unref(form).tipe_soal]
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "flex flex-col sm:flex-row gap-4 mt-6" }, [
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transition"
                      }, [
                        unref(form).processing ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "w-5 h-5 animate-spin text-white",
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
                            d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          })
                        ])) : (openBlock(), createBlock(unref(CheckIcon), {
                          key: 1,
                          class: "w-5 h-5"
                        })),
                        createVNode("span", null, toDisplayString(unref(form).processing ? "Creating your quiz...." : "Create Quiz"), 1)
                      ], 8, ["disabled"]),
                      createVNode(unref(Link), {
                        href: "/proktor/soal/",
                        class: "flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold rounded-lg shadow-lg transition"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
                          createTextVNode(" Back to Quiz ")
                        ]),
                        _: 1
                      })
                    ])
                  ], 40, ["onSubmit"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Proktor/Soal/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
