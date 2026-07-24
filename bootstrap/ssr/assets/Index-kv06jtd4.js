import { ref, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Head, Link, router } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    kelas: Array,
    guru: Array
  },
  setup(__props) {
    const showModal = ref(false);
    const form = ref({
      id: null,
      kelas: "",
      guru_id: ""
    });
    const openEdit = (k) => {
      form.value.id = k.id;
      form.value.kelas = k.kelas;
      form.value.guru_id = k.guru_id ?? "";
      showModal.value = true;
    };
    const hapus = (id) => {
      if (confirm("Yakin ingin menghapus kelas ini?")) {
        router.delete(route("admin.kelas.destroy", id));
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Class Data" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-6xl mx-auto sm:p-6"${_scopeId}><div${_scopeId}><div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>List of Classes</h1><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Manage class / homeroom data</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("admin.kelas.create"),
              class: "px-4 py-2 rounded sm:block hidden bg-blue-700 hover:bg-blue-800 text-white shadow transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + <span${_scopeId2}>Add Class</span>`);
                } else {
                  return [
                    createTextVNode(" + "),
                    createVNode("span", null, "Add Class")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="hidden md:block overflow-x-auto"${_scopeId}><table class="w-full border-collapse rounded overflow-hidden shadow-sm"${_scopeId}><thead class="bg-blue-700 text-white rounded"${_scopeId}><tr${_scopeId}><th class="px-4 py-2 text-center border-r whitespace-nowrap"${_scopeId}>No</th><th class="px-4 py-2 text-center border-r whitespace-nowrap"${_scopeId}>Class Name</th><th class="px-4 py-2 text-center border-r whitespace-nowrap"${_scopeId}>Homeroom Teacher</th><th class="px-4 py-2 text-center w-40 whitespace-nowrap"${_scopeId}>Actions</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.kelas, (k, index) => {
              _push2(`<tr class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition"${_scopeId}><td class="px-4 py-2 text-center"${_scopeId}>${ssrInterpolate(index + 1)}</td><td class="px-4 py-2 text-center"${_scopeId}>${ssrInterpolate(k.kelas)}</td><td class="px-10 py-2"${_scopeId}>${ssrInterpolate(k.guru?.nama_lengkap ?? "-")}</td><td class="px-4 py-2 flex justify-center gap-2"${_scopeId}><button class="text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button><button class="text-red-600 hover:text-red-800 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.kelas.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="4" class="text-center py-6 text-gray-500 dark:text-gray-400"${_scopeId}> No class data available </td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div><div class="md:hidden space-y-4"${_scopeId}><!--[-->`);
            ssrRenderList(__props.kelas, (k, index) => {
              _push2(`<div class="border rounded-2xl p-5 shadow hover:shadow-lg transition bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"${_scopeId}><div class="flex justify-between items-center mb-2"${_scopeId}><h2 class="font-semibold text-indigo-600"${_scopeId}>${ssrInterpolate(k.kelas)}</h2><span class="text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(k.guru?.nama_lengkap ?? "-")}</span></div><div class="flex gap-2 mt-3 justify-end"${_scopeId}><button class="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Edit </button><button class="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Delete </button></div></div>`);
            });
            _push2(`<!--]-->`);
            if (__props.kelas.length === 0) {
              _push2(`<div class="text-center py-6 text-gray-500 dark:text-gray-400"${_scopeId}> No class data available </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("admin.kelas.create"),
              class: "fixed bottom-6 right-5 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl active:scale-95 transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + Add `);
                } else {
                  return [
                    createTextVNode(" + Add ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-6xl mx-auto sm:p-6" }, [
                createVNode("div", null, [
                  createVNode("div", { class: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "List of Classes"),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Manage class / homeroom data")
                    ]),
                    createVNode(unref(Link), {
                      href: unref(route)("admin.kelas.create"),
                      class: "px-4 py-2 rounded sm:block hidden bg-blue-700 hover:bg-blue-800 text-white shadow transition"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" + "),
                        createVNode("span", null, "Add Class")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ]),
                  createVNode("div", { class: "hidden md:block overflow-x-auto" }, [
                    createVNode("table", { class: "w-full border-collapse rounded overflow-hidden shadow-sm" }, [
                      createVNode("thead", { class: "bg-blue-700 text-white rounded" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-4 py-2 text-center border-r whitespace-nowrap" }, "No"),
                          createVNode("th", { class: "px-4 py-2 text-center border-r whitespace-nowrap" }, "Class Name"),
                          createVNode("th", { class: "px-4 py-2 text-center border-r whitespace-nowrap" }, "Homeroom Teacher"),
                          createVNode("th", { class: "px-4 py-2 text-center w-40 whitespace-nowrap" }, "Actions")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.kelas, (k, index) => {
                          return openBlock(), createBlock("tr", {
                            key: k.id,
                            class: "border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                          }, [
                            createVNode("td", { class: "px-4 py-2 text-center" }, toDisplayString(index + 1), 1),
                            createVNode("td", { class: "px-4 py-2 text-center" }, toDisplayString(k.kelas), 1),
                            createVNode("td", { class: "px-10 py-2" }, toDisplayString(k.guru?.nama_lengkap ?? "-"), 1),
                            createVNode("td", { class: "px-4 py-2 flex justify-center gap-2" }, [
                              createVNode("button", {
                                onClick: ($event) => openEdit(k),
                                class: "text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300 transition"
                              }, [
                                createVNode(unref(PencilSquareIcon), { class: "w-5 h-5" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => hapus(k.id),
                                class: "text-red-600 hover:text-red-800 transition"
                              }, [
                                createVNode(unref(TrashIcon), { class: "w-5 h-5" })
                              ], 8, ["onClick"])
                            ])
                          ]);
                        }), 128)),
                        __props.kelas.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                          createVNode("td", {
                            colspan: "4",
                            class: "text-center py-6 text-gray-500 dark:text-gray-400"
                          }, " No class data available ")
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "md:hidden space-y-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.kelas, (k, index) => {
                      return openBlock(), createBlock("div", {
                        key: k.id,
                        class: "border rounded-2xl p-5 shadow hover:shadow-lg transition bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
                      }, [
                        createVNode("div", { class: "flex justify-between items-center mb-2" }, [
                          createVNode("h2", { class: "font-semibold text-indigo-600" }, toDisplayString(k.kelas), 1),
                          createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, toDisplayString(k.guru?.nama_lengkap ?? "-"), 1)
                        ]),
                        createVNode("div", { class: "flex gap-2 mt-3 justify-end" }, [
                          createVNode("button", {
                            onClick: ($event) => openEdit(k),
                            class: "flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition"
                          }, [
                            createVNode(unref(PencilSquareIcon), { class: "w-4 h-4" }),
                            createTextVNode(" Edit ")
                          ], 8, ["onClick"]),
                          createVNode("button", {
                            onClick: ($event) => hapus(k.id),
                            class: "flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition"
                          }, [
                            createVNode(unref(TrashIcon), { class: "w-4 h-4" }),
                            createTextVNode(" Delete ")
                          ], 8, ["onClick"])
                        ])
                      ]);
                    }), 128)),
                    __props.kelas.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-center py-6 text-gray-500 dark:text-gray-400"
                    }, " No class data available ")) : createCommentVNode("", true),
                    createVNode(unref(Link), {
                      href: unref(route)("admin.kelas.create"),
                      class: "fixed bottom-6 right-5 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl active:scale-95 transition"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" + Add ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (showModal.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center z-30"><div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition"></div><div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md w-full max-w-md rounded-2xl sm:m-0 m-3 shadow-xl p-6"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Class</h2><button>`);
        _push(ssrRenderComponent(unref(XMarkIcon), { class: "w-5 h-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" }, null, _parent));
        _push(`</button></div><div class="mb-4"><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Class Name</label><input${ssrRenderAttr("value", form.value.kelas)} type="text" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"></div><div class="mb-4"><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Homeroom Teacher</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.value.guru_id) ? ssrLooseContain(form.value.guru_id, "") : ssrLooseEqual(form.value.guru_id, "")) ? " selected" : ""}>-- select homeroom teacher --</option><!--[-->`);
        ssrRenderList(__props.guru, (g) => {
          _push(`<option${ssrRenderAttr("value", g.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.guru_id) ? ssrLooseContain(form.value.guru_id, g.id) : ssrLooseEqual(form.value.guru_id, g.id)) ? " selected" : ""}>${ssrInterpolate(g.nama_lengkap)}</option>`);
        });
        _push(`<!--]--></select></div><div class="flex justify-end gap-2"><button class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"> Cancel </button><button class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"> Save </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Kelas/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
