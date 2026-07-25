import { computed, ref, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, withDirectives, vModelText, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Head, Link, router } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { u as useTenant } from "./useTenant-CDcYNPHx.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    mapel: Array,
    guru: Array
    // ← ditambahkan
  },
  setup(__props) {
    const { isWorkspace } = useTenant();
    const t = computed(() => isWorkspace.value ? {
      pageTitle: "Departments Data",
      heading: "List of All Departments",
      subheading: "Manage organization departments data",
      addButtonLabel: "Add Department",
      itemNameColumn: "Department Name",
      personColumn: "Manager",
      noDataMessage: "No departments available",
      editModalTitle: "Edit Department",
      itemNameLabel: "Department Name",
      personLabel: "Department Manager",
      personPlaceholder: "-- select manager --",
      confirmDelete: "Yakin ingin menghapus departemen ini?"
    } : {
      pageTitle: "Subjects Data",
      heading: "List of All Subjects",
      subheading: "Manage school subjects data",
      addButtonLabel: "Add Subject",
      itemNameColumn: "Subject Name",
      personColumn: "Teacher",
      noDataMessage: "No subjects available",
      editModalTitle: "Edit Subject",
      itemNameLabel: "Subject Name",
      personLabel: "Subject Teacher",
      personPlaceholder: "-- select teacher --",
      confirmDelete: "Yakin ingin menghapus mapel ini?"
    });
    const showModal = ref(false);
    const form = ref({
      id: null,
      mapel: "",
      guru_id: ""
    });
    const openEdit = (m) => {
      form.value.id = m.id;
      form.value.mapel = m.mapel;
      form.value.guru_id = m.guru_id ?? "";
      showModal.value = true;
    };
    const closeModal = () => {
      showModal.value = false;
      form.value = { id: null, mapel: "", guru_id: "" };
    };
    const update = () => {
      router.put(
        route("admin.mapel.update", form.value.id),
        {
          mapel: form.value.mapel,
          guru_id: form.value.guru_id
        },
        {
          preserveScroll: true,
          onSuccess: () => closeModal()
        }
      );
    };
    const hapus = (id) => {
      if (confirm(t.value.confirmDelete)) {
        router.delete(route("admin.mapel.destroy", id));
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: t.value.pageTitle
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-6xl mx-auto sm:p-6" data-v-33f5cad7${_scopeId}><div class="flex flex-col mb-6 sm:mb-10 sm:flex-row items-start sm:items-center justify-between gap-4" data-v-33f5cad7${_scopeId}><div data-v-33f5cad7${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white" data-v-33f5cad7${_scopeId}>${ssrInterpolate(t.value.heading)}</h1><p class="text-sm text-gray-500 dark:text-gray-400" data-v-33f5cad7${_scopeId}>${ssrInterpolate(t.value.subheading)}</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("admin.mapel.create"),
              class: "px-4 py-2 hidden rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-md transition sm:flex items-center justify-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + <span class="sm:inline-block hidden ml-1" data-v-33f5cad7${_scopeId2}>${ssrInterpolate(t.value.addButtonLabel)}</span>`);
                } else {
                  return [
                    createTextVNode(" + "),
                    createVNode("span", { class: "sm:inline-block hidden ml-1" }, toDisplayString(t.value.addButtonLabel), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="hidden md:block rounded-lg overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md" data-v-33f5cad7${_scopeId}><table class="w-full border-collapse" data-v-33f5cad7${_scopeId}><thead class="bg-blue-700 text-white" data-v-33f5cad7${_scopeId}><tr data-v-33f5cad7${_scopeId}><th class="px-4 py-3 text-center border-r whitespace-nowrap" data-v-33f5cad7${_scopeId}>No</th><th class="px-4 py-3 text-center border-r whitespace-nowrap" data-v-33f5cad7${_scopeId}>${ssrInterpolate(t.value.itemNameColumn)}</th><th class="px-4 py-3 text-center border-r whitespace-nowrap" data-v-33f5cad7${_scopeId}>${ssrInterpolate(t.value.personColumn)}</th><th class="px-4 py-3 text-center whitespace-nowrap" data-v-33f5cad7${_scopeId}>Actions</th></tr></thead><tbody data-v-33f5cad7${_scopeId}><!--[-->`);
            ssrRenderList(__props.mapel, (m, index) => {
              _push2(`<tr class="hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition" data-v-33f5cad7${_scopeId}><td class="px-4 py-3 text-center" data-v-33f5cad7${_scopeId}>${ssrInterpolate(index + 1)}</td><td class="px-6 py-3" data-v-33f5cad7${_scopeId}>${ssrInterpolate(m.mapel)}</td><td class="px-6 py-3" data-v-33f5cad7${_scopeId}>${ssrInterpolate(m.guru?.nama_lengkap ?? "-")}</td><td class="px-4 py-3 flex justify-center gap-3" data-v-33f5cad7${_scopeId}><button class="text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300 transition" title="Edit" data-v-33f5cad7${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button><button class="text-red-600 hover:text-red-800 transition" title="Delete" data-v-33f5cad7${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.mapel.length === 0) {
              _push2(`<tr data-v-33f5cad7${_scopeId}><td colspan="4" class="text-center py-6 text-gray-500 dark:text-gray-400" data-v-33f5cad7${_scopeId}>${ssrInterpolate(t.value.noDataMessage)}</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div><div class="md:hidden space-y-4" data-v-33f5cad7${_scopeId}><!--[-->`);
            ssrRenderList(__props.mapel, (m, index) => {
              _push2(`<div class="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-md hover:shadow-lg transition" data-v-33f5cad7${_scopeId}><div class="flex justify-between items-center mb-2" data-v-33f5cad7${_scopeId}><h2 class="font-semibold text-indigo-600" data-v-33f5cad7${_scopeId}>${ssrInterpolate(m.mapel)}</h2><span class="text-sm text-gray-500 dark:text-gray-400" data-v-33f5cad7${_scopeId}>${ssrInterpolate(m.guru?.nama_lengkap ?? "-")}</span></div><div class="flex gap-2 mt-3 justify-end" data-v-33f5cad7${_scopeId}><button class="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition" data-v-33f5cad7${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Edit </button><button class="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition" data-v-33f5cad7${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Delete </button></div></div>`);
            });
            _push2(`<!--]-->`);
            if (__props.mapel.length === 0) {
              _push2(`<div class="text-center py-6 text-gray-500 dark:text-gray-400" data-v-33f5cad7${_scopeId}>${ssrInterpolate(t.value.noDataMessage)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("admin.mapel.create"),
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
            _push2(`</div>`);
            if (showModal.value) {
              _push2(`<div class="fixed inset-0 flex items-center justify-center z-50" data-v-33f5cad7${_scopeId}><div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition" data-v-33f5cad7${_scopeId}></div><div class="relative w-full max-w-md rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl p-6 m-3 transition" data-v-33f5cad7${_scopeId}><div class="flex items-center justify-between mb-4" data-v-33f5cad7${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white" data-v-33f5cad7${_scopeId}>${ssrInterpolate(t.value.editModalTitle)}</h2><button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" data-v-33f5cad7${_scopeId}>`);
              _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button></div><div class="mb-4" data-v-33f5cad7${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-33f5cad7${_scopeId}>${ssrInterpolate(t.value.itemNameLabel)}</label><input${ssrRenderAttr("value", form.value.mapel)} type="text" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" data-v-33f5cad7${_scopeId}></div><div class="mb-4" data-v-33f5cad7${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-33f5cad7${_scopeId}>${ssrInterpolate(t.value.personLabel)}</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" data-v-33f5cad7${_scopeId}><option value="" data-v-33f5cad7${ssrIncludeBooleanAttr(Array.isArray(form.value.guru_id) ? ssrLooseContain(form.value.guru_id, "") : ssrLooseEqual(form.value.guru_id, "")) ? " selected" : ""}${_scopeId}>${ssrInterpolate(t.value.personPlaceholder)}</option><!--[-->`);
              ssrRenderList(__props.guru, (g) => {
                _push2(`<option${ssrRenderAttr("value", g.id)} data-v-33f5cad7${ssrIncludeBooleanAttr(Array.isArray(form.value.guru_id) ? ssrLooseContain(form.value.guru_id, g.id) : ssrLooseEqual(form.value.guru_id, g.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(g.nama_lengkap)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="flex justify-end gap-2" data-v-33f5cad7${_scopeId}><button class="px-4 py-2 rounded-xl border dark:text-gray-300 border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition" data-v-33f5cad7${_scopeId}> Cancel </button><button class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition" data-v-33f5cad7${_scopeId}> Save </button></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-6xl mx-auto sm:p-6" }, [
                createVNode("div", { class: "flex flex-col mb-6 sm:mb-10 sm:flex-row items-start sm:items-center justify-between gap-4" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(t.value.heading), 1),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(t.value.subheading), 1)
                  ]),
                  createVNode(unref(Link), {
                    href: unref(route)("admin.mapel.create"),
                    class: "px-4 py-2 hidden rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-md transition sm:flex items-center justify-center"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + "),
                      createVNode("span", { class: "sm:inline-block hidden ml-1" }, toDisplayString(t.value.addButtonLabel), 1)
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                createVNode("div", { class: "hidden md:block rounded-lg overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md" }, [
                  createVNode("table", { class: "w-full border-collapse" }, [
                    createVNode("thead", { class: "bg-blue-700 text-white" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-4 py-3 text-center border-r whitespace-nowrap" }, "No"),
                        createVNode("th", { class: "px-4 py-3 text-center border-r whitespace-nowrap" }, toDisplayString(t.value.itemNameColumn), 1),
                        createVNode("th", { class: "px-4 py-3 text-center border-r whitespace-nowrap" }, toDisplayString(t.value.personColumn), 1),
                        createVNode("th", { class: "px-4 py-3 text-center whitespace-nowrap" }, "Actions")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.mapel, (m, index) => {
                        return openBlock(), createBlock("tr", {
                          key: m.id,
                          class: "hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                        }, [
                          createVNode("td", { class: "px-4 py-3 text-center" }, toDisplayString(index + 1), 1),
                          createVNode("td", { class: "px-6 py-3" }, toDisplayString(m.mapel), 1),
                          createVNode("td", { class: "px-6 py-3" }, toDisplayString(m.guru?.nama_lengkap ?? "-"), 1),
                          createVNode("td", { class: "px-4 py-3 flex justify-center gap-3" }, [
                            createVNode("button", {
                              onClick: ($event) => openEdit(m),
                              class: "text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300 transition",
                              title: "Edit"
                            }, [
                              createVNode(unref(PencilSquareIcon), { class: "w-5 h-5" })
                            ], 8, ["onClick"]),
                            createVNode("button", {
                              onClick: ($event) => hapus(m.id),
                              class: "text-red-600 hover:text-red-800 transition",
                              title: "Delete"
                            }, [
                              createVNode(unref(TrashIcon), { class: "w-5 h-5" })
                            ], 8, ["onClick"])
                          ])
                        ]);
                      }), 128)),
                      __props.mapel.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "4",
                          class: "text-center py-6 text-gray-500 dark:text-gray-400"
                        }, toDisplayString(t.value.noDataMessage), 1)
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                createVNode("div", { class: "md:hidden space-y-4" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.mapel, (m, index) => {
                    return openBlock(), createBlock("div", {
                      key: m.id,
                      class: "p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-md hover:shadow-lg transition"
                    }, [
                      createVNode("div", { class: "flex justify-between items-center mb-2" }, [
                        createVNode("h2", { class: "font-semibold text-indigo-600" }, toDisplayString(m.mapel), 1),
                        createVNode("span", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(m.guru?.nama_lengkap ?? "-"), 1)
                      ]),
                      createVNode("div", { class: "flex gap-2 mt-3 justify-end" }, [
                        createVNode("button", {
                          onClick: ($event) => openEdit(m),
                          class: "flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                        }, [
                          createVNode(unref(PencilSquareIcon), { class: "w-4 h-4" }),
                          createTextVNode(" Edit ")
                        ], 8, ["onClick"]),
                        createVNode("button", {
                          onClick: ($event) => hapus(m.id),
                          class: "flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                        }, [
                          createVNode(unref(TrashIcon), { class: "w-4 h-4" }),
                          createTextVNode(" Delete ")
                        ], 8, ["onClick"])
                      ])
                    ]);
                  }), 128)),
                  __props.mapel.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-6 text-gray-500 dark:text-gray-400"
                  }, toDisplayString(t.value.noDataMessage), 1)) : createCommentVNode("", true),
                  createVNode(unref(Link), {
                    href: unref(route)("admin.mapel.create"),
                    class: "fixed bottom-6 right-5 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl active:scale-95 transition"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + Add ")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                showModal.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 flex items-center justify-center z-50"
                }, [
                  createVNode("div", { class: "absolute inset-0 bg-black/40 backdrop-blur-sm transition" }),
                  createVNode("div", { class: "relative w-full max-w-md rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl p-6 m-3 transition" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                      createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, toDisplayString(t.value.editModalTitle), 1),
                      createVNode("button", {
                        onClick: closeModal,
                        class: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }, [
                        createVNode(unref(XMarkIcon), { class: "w-5 h-5" })
                      ])
                    ]),
                    createVNode("div", { class: "mb-4" }, [
                      createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, toDisplayString(t.value.itemNameLabel), 1),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => form.value.mapel = $event,
                        type: "text",
                        class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.mapel]
                      ])
                    ]),
                    createVNode("div", { class: "mb-4" }, [
                      createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, toDisplayString(t.value.personLabel), 1),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.guru_id = $event,
                        class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      }, [
                        createVNode("option", { value: "" }, toDisplayString(t.value.personPlaceholder), 1),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.guru, (g) => {
                          return openBlock(), createBlock("option", {
                            key: g.id,
                            value: g.id
                          }, toDisplayString(g.nama_lengkap), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.value.guru_id]
                      ])
                    ]),
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode("button", {
                        onClick: closeModal,
                        class: "px-4 py-2 rounded-xl border dark:text-gray-300 border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      }, " Cancel "),
                      createVNode("button", {
                        onClick: update,
                        class: "px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                      }, " Save ")
                    ])
                  ])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Mapel/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-33f5cad7"]]);
export {
  Index as default
};
