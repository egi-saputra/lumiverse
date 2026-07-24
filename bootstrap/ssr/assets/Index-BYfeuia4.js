import { computed, ref, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { u as useTenant } from "./useTenant-CDcYNPHx.js";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@vueuse/core";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    guru: Array,
    users: Array
  },
  setup(__props) {
    const props = __props;
    usePage();
    const { isWorkspace } = useTenant();
    const t = computed(() => isWorkspace.value ? {
      pageTitle: "Manager List",
      heading: "All Managers",
      subheading: "Manage manager data",
      addBtn: "Add Manager",
      colName: "Full Name",
      emptyTable: "No manager data available",
      emptyCard: "No manager data available",
      editModalTitle: "Edit Manager Data",
      userLabel: "Manager User",
      userPlaceholder: "-- select manager user --",
      nameLabel: "Manager Name",
      confirmDelete: "Yakin ingin menghapus data manajer ini?"
    } : {
      pageTitle: "Teacher List",
      heading: "All Teachers",
      subheading: "Manage teacher data",
      addBtn: "Add Teacher",
      colName: "Full Name",
      emptyTable: "No teacher data available",
      emptyCard: "No teacher data available",
      editModalTitle: "Edit Teacher Data",
      userLabel: "Teacher User",
      userPlaceholder: "-- select teacher user --",
      nameLabel: "Teacher Name",
      confirmDelete: "Yakin ingin menghapus guru ini?"
    });
    const showModal = ref(false);
    const form = ref({
      id: null,
      user_id: "",
      nama_lengkap: ""
    });
    const openEdit = (g) => {
      form.value.id = g.id;
      form.value.user_id = g.user_id;
      form.value.nama_lengkap = g.nama_lengkap;
      showModal.value = true;
    };
    const hapus = (id) => {
      if (confirm(t.value.confirmDelete)) {
        router.delete(route("admin.guru.destroy", id));
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
            _push2(`<div class="sm:bg-white/60 dark:sm:bg-gray-800/60 sm:backdrop-blur-md sm:rounded sm:shadow sm:p-6"${_scopeId}><div class="flex items-center justify-between mb-6"${_scopeId}><div${_scopeId}><h1 class="text-xl dark:text-gray-200 font-semibold"${_scopeId}>${ssrInterpolate(t.value.heading)}</h1><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(t.value.subheading)}</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("admin.guru.create"),
              class: "px-4 py-2 sm:block hidden rounded bg-blue-800 text-white hover:bg-blue-900 transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + <span${_scopeId2}>${ssrInterpolate(t.value.addBtn)}</span>`);
                } else {
                  return [
                    createTextVNode(" + "),
                    createVNode("span", null, toDisplayString(t.value.addBtn), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="hidden md:block rounded-lg overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md"${_scopeId}><table class="w-full border-collapse"${_scopeId}><thead class="bg-blue-800 text-white"${_scopeId}><tr${_scopeId}><th class="px-4 py-2 text-center border-r"${_scopeId}>No</th><th class="px-4 py-2 whitespace-nowrap text-center"${_scopeId}>${ssrInterpolate(t.value.colName)}</th><th class="px-4 py-2 text-center border-l"${_scopeId}>Actions</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.guru, (g, index) => {
              _push2(`<tr class="border-t dark:border-none hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"${_scopeId}><td class="px-4 py-2 text-center"${_scopeId}>${ssrInterpolate(index + 1)}</td><td class="px-10 whitespace-nowrap py-2"${_scopeId}>${ssrInterpolate(g.nama_lengkap)}</td><td class="px-4 py-2 text-center"${_scopeId}><div class="flex items-center justify-center gap-3"${_scopeId}><button class="text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300" title="Edit"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button><button class="text-red-600 hover:text-red-800" title="Delete"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button></div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.guru.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="3" class="text-center py-6 text-gray-500"${_scopeId}>${ssrInterpolate(t.value.emptyTable)}</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div><div class="md:hidden space-y-4"${_scopeId}><!--[-->`);
            ssrRenderList(props.guru, (g, index) => {
              _push2(`<div class="bg-white/60 dark:bg-gray-700/50 rounded p-5 shadow hover:shadow-lg transition"${_scopeId}><div class="flex justify-between items-center mb-2"${_scopeId}><h2 class="font-semibold dark:text-white text-blue-600"${_scopeId}>${ssrInterpolate(g.nama_lengkap)}</h2><span class="text-gray-500 dark:text-gray-300"${_scopeId}># ${ssrInterpolate(index + 1)}</span></div><div class="flex gap-2 justify-end mt-3"${_scopeId}><button class="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Edit </button><button class="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Delete </button></div></div>`);
            });
            _push2(`<!--]-->`);
            if (props.guru.length === 0) {
              _push2(`<div class="text-center py-6 text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(t.value.emptyCard)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/guru/create",
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
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "sm:bg-white/60 dark:sm:bg-gray-800/60 sm:backdrop-blur-md sm:rounded sm:shadow sm:p-6" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-xl dark:text-gray-200 font-semibold" }, toDisplayString(t.value.heading), 1),
                    createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(t.value.subheading), 1)
                  ]),
                  createVNode(unref(Link), {
                    href: unref(route)("admin.guru.create"),
                    class: "px-4 py-2 sm:block hidden rounded bg-blue-800 text-white hover:bg-blue-900 transition"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + "),
                      createVNode("span", null, toDisplayString(t.value.addBtn), 1)
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                createVNode("div", { class: "hidden md:block rounded-lg overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md" }, [
                  createVNode("table", { class: "w-full border-collapse" }, [
                    createVNode("thead", { class: "bg-blue-800 text-white" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-4 py-2 text-center border-r" }, "No"),
                        createVNode("th", { class: "px-4 py-2 whitespace-nowrap text-center" }, toDisplayString(t.value.colName), 1),
                        createVNode("th", { class: "px-4 py-2 text-center border-l" }, "Actions")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.guru, (g, index) => {
                        return openBlock(), createBlock("tr", {
                          key: g.id,
                          class: "border-t dark:border-none hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
                        }, [
                          createVNode("td", { class: "px-4 py-2 text-center" }, toDisplayString(index + 1), 1),
                          createVNode("td", { class: "px-10 whitespace-nowrap py-2" }, toDisplayString(g.nama_lengkap), 1),
                          createVNode("td", { class: "px-4 py-2 text-center" }, [
                            createVNode("div", { class: "flex items-center justify-center gap-3" }, [
                              createVNode("button", {
                                onClick: ($event) => openEdit(g),
                                class: "text-blue-600 hover:text-blue-800 dark:text-gray-100 dark:hover:text-gray-300",
                                title: "Edit"
                              }, [
                                createVNode(unref(PencilSquareIcon), { class: "w-5 h-5" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => hapus(g.id),
                                class: "text-red-600 hover:text-red-800",
                                title: "Delete"
                              }, [
                                createVNode(unref(TrashIcon), { class: "w-5 h-5" })
                              ], 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128)),
                      __props.guru.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "3",
                          class: "text-center py-6 text-gray-500"
                        }, toDisplayString(t.value.emptyTable), 1)
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                createVNode("div", { class: "md:hidden space-y-4" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(props.guru, (g, index) => {
                    return openBlock(), createBlock("div", {
                      key: g.id,
                      class: "bg-white/60 dark:bg-gray-700/50 rounded p-5 shadow hover:shadow-lg transition"
                    }, [
                      createVNode("div", { class: "flex justify-between items-center mb-2" }, [
                        createVNode("h2", { class: "font-semibold dark:text-white text-blue-600" }, toDisplayString(g.nama_lengkap), 1),
                        createVNode("span", { class: "text-gray-500 dark:text-gray-300" }, "# " + toDisplayString(index + 1), 1)
                      ]),
                      createVNode("div", { class: "flex gap-2 justify-end mt-3" }, [
                        createVNode("button", {
                          onClick: ($event) => openEdit(g),
                          class: "flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition"
                        }, [
                          createVNode(unref(PencilSquareIcon), { class: "w-4 h-4" }),
                          createTextVNode(" Edit ")
                        ], 8, ["onClick"]),
                        createVNode("button", {
                          onClick: ($event) => hapus(g.id),
                          class: "flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition"
                        }, [
                          createVNode(unref(TrashIcon), { class: "w-4 h-4" }),
                          createTextVNode(" Delete ")
                        ], 8, ["onClick"])
                      ])
                    ]);
                  }), 128)),
                  props.guru.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-6 text-gray-500 dark:text-gray-400"
                  }, toDisplayString(t.value.emptyCard), 1)) : createCommentVNode("", true),
                  createVNode(unref(Link), {
                    href: "/admin/guru/create",
                    class: "fixed bottom-6 right-5 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl active:scale-95 transition"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + Add ")
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (showModal.value) {
        _push(`<div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition flex items-center justify-center z-50"><div class="relative w-full max-w-md rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl p-6 m-3 transition"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-gray-900 dark:text-white">${ssrInterpolate(t.value.editModalTitle)}</h2><button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">`);
        _push(ssrRenderComponent(unref(XMarkIcon), { class: "w-5 h-5" }, null, _parent));
        _push(`</button></div><div class="mb-4"><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">${ssrInterpolate(t.value.userLabel)}</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.value.user_id) ? ssrLooseContain(form.value.user_id, "") : ssrLooseEqual(form.value.user_id, "")) ? " selected" : ""}>${ssrInterpolate(t.value.userPlaceholder)}</option><!--[-->`);
        ssrRenderList(__props.users, (u) => {
          _push(`<option${ssrRenderAttr("value", u.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.user_id) ? ssrLooseContain(form.value.user_id, u.id) : ssrLooseEqual(form.value.user_id, u.id)) ? " selected" : ""}>${ssrInterpolate(u.name)}</option>`);
        });
        _push(`<!--]--></select></div><div class="mb-4"><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">${ssrInterpolate(t.value.nameLabel)}</label><input${ssrRenderAttr("value", form.value.nama_lengkap)} type="text" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"></div><div class="flex justify-end gap-2"><button class="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition dark:text-gray-300"> Cancel </button><button class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"> Save </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Guru/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
