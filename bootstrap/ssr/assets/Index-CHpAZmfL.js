import { ref, computed, unref, withCtx, createTextVNode, createVNode, withDirectives, vModelText, vModelSelect, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2, a as _sfc_main$4 } from "./AlertSuccess-BZ7XVdF-.js";
import { _ as _sfc_main$3 } from "./AlertError-BtD7qWDV.js";
import { ArrowPathIcon, EnvelopeIcon, AcademicCapIcon, Cog6ToothIcon, UserIcon, UserCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const perPage = 12;
const MAX_VISIBLE_PAGES = 10;
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const search = ref("");
    const role = ref("");
    const sort = ref("asc");
    const currentPage = ref(1);
    const filteredUsers = computed(() => {
      let data = [...props.users];
      if (search.value) {
        data = data.filter(
          (u) => u.name.toLowerCase().includes(search.value.toLowerCase())
        );
      }
      if (role.value) {
        data = data.filter((u) => u.role === role.value);
      }
      data.sort(
        (a, b) => sort.value === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
      return data;
    });
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filteredUsers.value.slice(start, start + perPage);
    });
    const totalPages = computed(
      () => Math.ceil(filteredUsers.value.length / perPage)
    );
    const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      if (total <= MAX_VISIBLE_PAGES) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const half = Math.floor(MAX_VISIBLE_PAGES / 2);
      let start = current - half;
      let end = current + half - 1;
      if (start < 1) {
        start = 1;
        end = MAX_VISIBLE_PAGES;
      }
      if (end > total) {
        end = total;
        start = total - MAX_VISIBLE_PAGES + 1;
      }
      return Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );
    });
    const resetFilter = () => {
      search.value = "";
      role.value = "";
      sort.value = "asc";
      currentPage.value = 1;
    };
    const deleteModal = ref(null);
    const openDelete = (id) => {
      deleteModal.value.open(id, "admin.users.destroy");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Users Management" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-355b8137${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, null, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8" data-v-355b8137${_scopeId}><div class="flex items-center gap-3" data-v-355b8137${_scopeId}><div data-v-355b8137${_scopeId}><h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" data-v-355b8137${_scopeId}> Users Management </h1><p class="text-sm text-gray-500 dark:text-gray-400" data-v-355b8137${_scopeId}> Manage room for registered users </p></div></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("admin.users.create"),
              class: "px-5 py-2 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition sm:shadow-lg text-sm font-medium"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + Create User `);
                } else {
                  return [
                    createTextVNode(" + Create User ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 md:mb-6" data-v-355b8137${_scopeId}><input${ssrRenderAttr("value", search.value)} placeholder="Search by name..." class="w-full lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md transition" data-v-355b8137${_scopeId}><div class="flex md:flex-row flex-cols gap-3" data-v-355b8137${_scopeId}><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" data-v-355b8137${_scopeId}><option value="" data-v-355b8137${ssrIncludeBooleanAttr(Array.isArray(role.value) ? ssrLooseContain(role.value, "") : ssrLooseEqual(role.value, "")) ? " selected" : ""}${_scopeId}>All Roles</option><option value="guru" data-v-355b8137${ssrIncludeBooleanAttr(Array.isArray(role.value) ? ssrLooseContain(role.value, "guru") : ssrLooseEqual(role.value, "guru")) ? " selected" : ""}${_scopeId}>Guru</option><option value="proktor" data-v-355b8137${ssrIncludeBooleanAttr(Array.isArray(role.value) ? ssrLooseContain(role.value, "proktor") : ssrLooseEqual(role.value, "proktor")) ? " selected" : ""}${_scopeId}>Proktor</option><option value="siswa" data-v-355b8137${ssrIncludeBooleanAttr(Array.isArray(role.value) ? ssrLooseContain(role.value, "siswa") : ssrLooseEqual(role.value, "siswa")) ? " selected" : ""}${_scopeId}>Siswa</option><option value="user" data-v-355b8137${ssrIncludeBooleanAttr(Array.isArray(role.value) ? ssrLooseContain(role.value, "user") : ssrLooseEqual(role.value, "user")) ? " selected" : ""}${_scopeId}>User</option></select><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" data-v-355b8137${_scopeId}><option value="asc" data-v-355b8137${ssrIncludeBooleanAttr(Array.isArray(sort.value) ? ssrLooseContain(sort.value, "asc") : ssrLooseEqual(sort.value, "asc")) ? " selected" : ""}${_scopeId}>Sort A – Z</option><option value="desc" data-v-355b8137${ssrIncludeBooleanAttr(Array.isArray(sort.value) ? ssrLooseContain(sort.value, "desc") : ssrLooseEqual(sort.value, "desc")) ? " selected" : ""}${_scopeId}>Sort Z – A</option></select></div><button class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-1 dark:border-gray-600 bg-gray-100 dark:bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition" data-v-355b8137${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Reset </button></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-v-355b8137${_scopeId}><!--[-->`);
            ssrRenderList(paginatedUsers.value, (user, i) => {
              _push2(`<div class="relative rounded border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-5 backdrop-blur-md shadow-lg transition hover:shadow-xl" data-v-355b8137${_scopeId}><div class="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500" data-v-355b8137${_scopeId}></div><div class="flex items-center gap-4 mt-2" data-v-355b8137${_scopeId}><div class="flex-1" data-v-355b8137${_scopeId}><h3 class="font-semibold text-gray-800 dark:text-gray-100" data-v-355b8137${_scopeId}>${ssrInterpolate(user.name)}</h3><div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400" data-v-355b8137${_scopeId}>`);
              _push2(ssrRenderComponent(unref(EnvelopeIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(user.email)}</div><span class="${ssrRenderClass([{
                "bg-green-50 border-green-200 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300": user.role === "guru",
                "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-300": user.role === "proktor",
                "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300": user.role === "siswa"
              }, "inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border"])}" data-v-355b8137${_scopeId}>`);
              if (user.role === "guru") {
                _push2(ssrRenderComponent(unref(AcademicCapIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              } else if (user.role === "proktor") {
                _push2(ssrRenderComponent(unref(Cog6ToothIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(UserIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              }
              _push2(` ${ssrInterpolate(user.role.charAt(0).toUpperCase() + user.role.slice(1))}</span></div></div><div class="flex items-center gap-1 mt-4 text-sm text-gray-500 dark:text-gray-400" data-v-355b8137${_scopeId}>`);
              _push2(ssrRenderComponent(unref(UserCircleIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` User #${ssrInterpolate((currentPage.value - 1) * perPage + i + 1)}</div><div class="absolute right-4 bottom-4 flex gap-2" data-v-355b8137${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("admin.users.edit", user.id),
                class: "w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 flex items-center justify-center transition"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-5 h-5" }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(PencilSquareIcon), { class: "w-5 h-5" })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              if (user.role !== "admin") {
                _push2(`<button class="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 flex items-center justify-center transition" data-v-355b8137${_scopeId}>`);
                _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              ref_key: "deleteModal",
              ref: deleteModal,
              title: "Are you sure ?",
              description: "Deleting this user will permanently remove all related data."
            }, null, _parent2, _scopeId));
            if (filteredUsers.value.length === 0) {
              _push2(`<div class="text-center py-12 text-gray-500 dark:text-gray-400" data-v-355b8137${_scopeId}> Tidak ada data user </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center justify-center gap-2 mt-10 flex-wrap" data-v-355b8137${_scopeId}><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="${ssrRenderClass([currentPage.value === 1 ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600", "px-3 py-1 rounded-md text-sm transition"])}" data-v-355b8137${_scopeId}> ‹ Prev </button><!--[-->`);
            ssrRenderList(visiblePages.value, (p) => {
              _push2(`<button class="${ssrRenderClass([p === currentPage.value ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600", "px-3 py-1 rounded-md text-sm transition"])}" data-v-355b8137${_scopeId}>${ssrInterpolate(p)}</button>`);
            });
            _push2(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="${ssrRenderClass([currentPage.value === totalPages.value ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600", "px-3 py-1 rounded-md text-sm transition"])}" data-v-355b8137${_scopeId}> Next › </button></div></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode(_sfc_main$2),
                createVNode(_sfc_main$3),
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8" }, [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" }, " Users Management "),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, " Manage room for registered users ")
                    ])
                  ]),
                  createVNode(unref(Link), {
                    href: _ctx.route("admin.users.create"),
                    class: "px-5 py-2 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition sm:shadow-lg text-sm font-medium"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + Create User ")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 md:mb-6" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => search.value = $event,
                    placeholder: "Search by name...",
                    class: "w-full lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md transition"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, search.value]
                  ]),
                  createVNode("div", { class: "flex md:flex-row flex-cols gap-3" }, [
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => role.value = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    }, [
                      createVNode("option", { value: "" }, "All Roles"),
                      createVNode("option", { value: "guru" }, "Guru"),
                      createVNode("option", { value: "proktor" }, "Proktor"),
                      createVNode("option", { value: "siswa" }, "Siswa"),
                      createVNode("option", { value: "user" }, "User")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, role.value]
                    ]),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => sort.value = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    }, [
                      createVNode("option", { value: "asc" }, "Sort A – Z"),
                      createVNode("option", { value: "desc" }, "Sort Z – A")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, sort.value]
                    ])
                  ]),
                  createVNode("button", {
                    onClick: resetFilter,
                    class: "w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-1 dark:border-gray-600 bg-gray-100 dark:bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                  }, [
                    createVNode(unref(ArrowPathIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Reset ")
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(paginatedUsers.value, (user, i) => {
                    return openBlock(), createBlock("div", {
                      key: user.id,
                      class: "relative rounded border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-5 backdrop-blur-md shadow-lg transition hover:shadow-xl"
                    }, [
                      createVNode("div", { class: "absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500" }),
                      createVNode("div", { class: "flex items-center gap-4 mt-2" }, [
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("h3", { class: "font-semibold text-gray-800 dark:text-gray-100" }, toDisplayString(user.name), 1),
                          createVNode("div", { class: "flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400" }, [
                            createVNode(unref(EnvelopeIcon), { class: "w-4 h-4" }),
                            createTextVNode(" " + toDisplayString(user.email), 1)
                          ]),
                          createVNode("span", {
                            class: ["inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border", {
                              "bg-green-50 border-green-200 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300": user.role === "guru",
                              "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-300": user.role === "proktor",
                              "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300": user.role === "siswa"
                            }]
                          }, [
                            user.role === "guru" ? (openBlock(), createBlock(unref(AcademicCapIcon), {
                              key: 0,
                              class: "w-4 h-4"
                            })) : user.role === "proktor" ? (openBlock(), createBlock(unref(Cog6ToothIcon), {
                              key: 1,
                              class: "w-4 h-4"
                            })) : (openBlock(), createBlock(unref(UserIcon), {
                              key: 2,
                              class: "w-4 h-4"
                            })),
                            createTextVNode(" " + toDisplayString(user.role.charAt(0).toUpperCase() + user.role.slice(1)), 1)
                          ], 2)
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center gap-1 mt-4 text-sm text-gray-500 dark:text-gray-400" }, [
                        createVNode(unref(UserCircleIcon), { class: "w-4 h-4" }),
                        createTextVNode(" User #" + toDisplayString((currentPage.value - 1) * perPage + i + 1), 1)
                      ]),
                      createVNode("div", { class: "absolute right-4 bottom-4 flex gap-2" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("admin.users.edit", user.id),
                          class: "w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 flex items-center justify-center transition"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(PencilSquareIcon), { class: "w-5 h-5" })
                          ]),
                          _: 1
                        }, 8, ["href"]),
                        user.role !== "admin" ? (openBlock(), createBlock("button", {
                          key: 0,
                          onClick: ($event) => openDelete(user.id),
                          class: "w-9 h-9 rounded-full bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 flex items-center justify-center transition"
                        }, [
                          createVNode(unref(TrashIcon), { class: "w-5 h-5" })
                        ], 8, ["onClick"])) : createCommentVNode("", true)
                      ])
                    ]);
                  }), 128))
                ]),
                createVNode(_sfc_main$4, {
                  ref_key: "deleteModal",
                  ref: deleteModal,
                  title: "Are you sure ?",
                  description: "Deleting this user will permanently remove all related data."
                }, null, 512),
                filteredUsers.value.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-12 text-gray-500 dark:text-gray-400"
                }, " Tidak ada data user ")) : createCommentVNode("", true),
                createVNode("div", { class: "flex items-center justify-center gap-2 mt-10 flex-wrap" }, [
                  createVNode("button", {
                    onClick: ($event) => currentPage.value--,
                    disabled: currentPage.value === 1,
                    class: ["px-3 py-1 rounded-md text-sm transition", currentPage.value === 1 ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"]
                  }, " ‹ Prev ", 10, ["onClick", "disabled"]),
                  (openBlock(true), createBlock(Fragment, null, renderList(visiblePages.value, (p) => {
                    return openBlock(), createBlock("button", {
                      key: p,
                      onClick: ($event) => currentPage.value = p,
                      class: ["px-3 py-1 rounded-md text-sm transition", p === currentPage.value ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"]
                    }, toDisplayString(p), 11, ["onClick"]);
                  }), 128)),
                  createVNode("button", {
                    onClick: ($event) => currentPage.value++,
                    disabled: currentPage.value === totalPages.value,
                    class: ["px-3 py-1 rounded-md text-sm transition", currentPage.value === totalPages.value ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"]
                  }, " Next › ", 10, ["onClick", "disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Users/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-355b8137"]]);
export {
  Index as default
};
