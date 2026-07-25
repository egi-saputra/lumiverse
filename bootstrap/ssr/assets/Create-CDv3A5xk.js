import { withCtx, unref, createVNode, createTextVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { usePage, useForm, Link } from "@inertiajs/vue3";
import { CheckIcon, ArrowLeftIcon } from "@heroicons/vue/24/solid";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import "@vueuse/core";
import "@heroicons/vue/24/outline";
import "sweetalert2";
import "ziggy-js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    mapel: Array
  },
  setup(__props) {
    const page = usePage();
    const { success, error } = ToastAlert();
    const form = useForm({
      title: "",
      mapel_id: "",
      kelas: "",
      waktu: "60",
      status: "Tidak Aktif",
      tipe_soal: "Berurutan"
    });
    const submit = () => {
      form.post("/guru/soal", {
        onSuccess: () => {
          if (page.props.flash?.error) {
            error(page.props.flash.error);
          } else {
            success("Quiz berhasil dibuat.");
          }
        },
        onError: () => {
          error("Terjadi kesalahan saat membuat quiz.");
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen sm:py-4 pb-14 sm:px-2"${_scopeId}><div class="rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl p-6 sm:p-10"${_scopeId}><div class="mb-8"${_scopeId}><h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3"${_scopeId}><span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"${_scopeId}> + </span> Create / Add Quiz </h1><p class="mt-2 text-gray-500 dark:text-gray-400 text-sm sm:text-base"${_scopeId}> Create and configure a new quiz or exam for your class. </p></div><form class="space-y-6"${_scopeId}><div${_scopeId}><label class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200"${_scopeId}> Quiz Title </label><input${ssrRenderAttr("value", unref(form).title)} type="text" placeholder="e.g. ASAS GANJIL 2025" class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"${_scopeId}>`);
            if (unref(form).errors.title) {
              _push2(`<p class="mt-1 text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.title)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-6"${_scopeId}><div${_scopeId}><label class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200"${_scopeId}> Subject </label><select class="w-full border rounded-xl p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel_id) ? ssrLooseContain(unref(form).mapel_id, "") : ssrLooseEqual(unref(form).mapel_id, "")) ? " selected" : ""}${_scopeId}>-- Select Subject --</option><!--[-->`);
            ssrRenderList(__props.mapel, (m) => {
              _push2(`<option${ssrRenderAttr("value", m.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel_id) ? ssrLooseContain(unref(form).mapel_id, m.id) : ssrLooseEqual(unref(form).mapel_id, m.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(m.mapel)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.mapel_id) {
              _push2(`<p class="mt-1 text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.mapel_id)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200"${_scopeId}> Class Unit </label><input${ssrRenderAttr("value", unref(form).kelas)} type="text" placeholder="XI BR / XII MP" class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue- dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"${_scopeId}>`);
            if (unref(form).errors.kelas) {
              _push2(`<p class="mt-1 text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.kelas)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="flex flex-col sm:flex-row gap-4 pt-4"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(CheckIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(form).processing ? "Creating Quiz..." : "Create Quiz")}</span></button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/guru/soal",
              class: "flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gray-800 dark:bg-white/10 border border-gray-300 dark:border-gray-600 text-gray-100 dark:text-white font-semibold hover:bg-gray-900 dark:hover:bg-white/20 transition"
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
              createVNode("div", { class: "min-h-screen sm:py-4 pb-14 sm:px-2" }, [
                createVNode("div", { class: "rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl p-6 sm:p-10" }, [
                  createVNode("div", { class: "mb-8" }, [
                    createVNode("h1", { class: "text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3" }, [
                      createVNode("span", { class: "inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg" }, " + "),
                      createTextVNode(" Create / Add Quiz ")
                    ]),
                    createVNode("p", { class: "mt-2 text-gray-500 dark:text-gray-400 text-sm sm:text-base" }, " Create and configure a new quiz or exam for your class. ")
                  ]),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "space-y-6"
                  }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200" }, " Quiz Title "),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).title = $event,
                        type: "text",
                        placeholder: "e.g. ASAS GANJIL 2025",
                        class: "w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).title]
                      ]),
                      unref(form).errors.title ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.title), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-6" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200" }, " Subject "),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => unref(form).mapel_id = $event,
                          class: "w-full border rounded-xl p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2"
                        }, [
                          createVNode("option", { value: "" }, "-- Select Subject --"),
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.mapel, (m) => {
                            return openBlock(), createBlock("option", {
                              key: m.id,
                              value: m.id
                            }, toDisplayString(m.mapel), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, unref(form).mapel_id]
                        ]),
                        unref(form).errors.mapel_id ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.mapel_id), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200" }, " Class Unit "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).kelas = $event,
                          type: "text",
                          placeholder: "XI BR / XII MP",
                          class: "w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue- dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).kelas]
                        ]),
                        unref(form).errors.kelas ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.kelas), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "flex flex-col sm:flex-row gap-4 pt-4" }, [
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition"
                      }, [
                        unref(form).processing ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "w-5 h-5 animate-spin",
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
                        createVNode("span", null, toDisplayString(unref(form).processing ? "Creating Quiz..." : "Create Quiz"), 1)
                      ], 8, ["disabled"]),
                      createVNode(unref(Link), {
                        href: "/guru/soal",
                        class: "flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gray-800 dark:bg-white/10 border border-gray-300 dark:border-gray-600 text-gray-100 dark:text-white font-semibold hover:bg-gray-900 dark:hover:bg-white/20 transition"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
                          createTextVNode(" Back to Quiz ")
                        ]),
                        _: 1
                      })
                    ])
                  ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Quiz/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
