import { computed, ref, watch, unref, withCtx, createVNode, toDisplayString, withDirectives, vModelText, vModelSelect, openBlock, createBlock, Fragment, renderList, createTextVNode, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Head, Link, router } from "@inertiajs/vue3";
import { ArrowPathIcon, TrashIcon, InformationCircleIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import { u as useTenant } from "./useTenant-CDcYNPHx.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const MAX_VISIBLE_PAGES = 6;
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    siswa: Array,
    kelas: { type: Array, default: null },
    isSmk: Boolean
  },
  setup(__props) {
    const props = __props;
    const { isWorkspace } = useTenant();
    const t = computed(() => isWorkspace.value ? {
      pageTitle: "Employee List",
      heading: "List of All Employees",
      subheading: "Manage employee data",
      searchPlaceholder: "Search employee name...",
      allGroupsOption: "All Teams",
      groupColumnLabel: "Team",
      idColumnLabel: "Employee ID",
      listAutoUpdateNote: "Employee List Updates Automatically",
      noDataMessage: "No employee data available",
      deleteAllSuffix: "Employees in This Team",
      confirmDeleteOne: "Yakin ingin menghapus karyawan ini?",
      confirmDeleteAllEntity: "karyawan",
      confirmDeleteAllGroup: "tim",
      fallbackGroupName: "tim ini"
    } : {
      pageTitle: "Student List",
      heading: "List of All Students",
      subheading: "Manage student data",
      searchPlaceholder: "Search student name...",
      allGroupsOption: "All Classes",
      groupColumnLabel: "Class",
      idColumnLabel: "NIS / NISN",
      listAutoUpdateNote: "Student List Updates Automatically",
      noDataMessage: "No student data available",
      deleteAllSuffix: "Students in This Class",
      confirmDeleteOne: "Yakin ingin menghapus siswa ini?",
      confirmDeleteAllEntity: "siswa",
      confirmDeleteAllGroup: "kelas",
      fallbackGroupName: "kelas ini"
    });
    const search = ref("");
    const sort = ref("asc");
    const filterKelas = ref("");
    const currentPage = ref(1);
    const perPage = ref(12);
    const kelasList = computed(() => {
      if (props.kelas?.length) return props.kelas;
      const seen = /* @__PURE__ */ new Map();
      props.siswa.forEach((s) => {
        if (s.kelas && !seen.has(s.kelas_id)) {
          seen.set(s.kelas_id, { id: s.kelas_id, kelas: s.kelas.kelas });
        }
      });
      return [...seen.values()].sort((a, b) => a.kelas.localeCompare(b.kelas));
    });
    watch([search, sort, filterKelas], () => {
      currentPage.value = 1;
    });
    const filteredSiswa = computed(() => {
      let data = [...props.siswa];
      if (search.value.trim()) {
        const q = search.value.trim().toLowerCase();
        data = data.filter((s) => s.nama_lengkap.toLowerCase().includes(q));
      }
      if (filterKelas.value) {
        data = data.filter((s) => String(s.kelas_id) === String(filterKelas.value));
      }
      data.sort(
        (a, b) => sort.value === "asc" ? a.nama_lengkap.localeCompare(b.nama_lengkap) : b.nama_lengkap.localeCompare(a.nama_lengkap)
      );
      return data;
    });
    const totalPages = computed(() => Math.ceil(filteredSiswa.value.length / perPage.value));
    const paginatedSiswa = computed(() => {
      const start = (currentPage.value - 1) * perPage.value;
      return filteredSiswa.value.slice(start, start + perPage.value);
    });
    const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      if (total <= MAX_VISIBLE_PAGES)
        return Array.from({ length: total }, (_, i) => i + 1);
      const half = Math.floor(MAX_VISIBLE_PAGES / 2);
      let start = Math.max(1, current - half);
      let end = start + MAX_VISIBLE_PAGES - 1;
      if (end > total) {
        end = total;
        start = Math.max(1, total - MAX_VISIBLE_PAGES + 1);
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });
    const resetFilter = () => {
      search.value = "";
      sort.value = "asc";
      filterKelas.value = "";
      currentPage.value = 1;
    };
    const hapus = (id) => {
      if (!confirm(t.value.confirmDeleteOne)) return;
      router.delete(route("admin.siswa.destroy", id), {
        preserveScroll: true
      });
    };
    const hapusSemuaByKelas = () => {
      if (!filterKelas.value) return;
      const namaKelas = kelasList.value.find(
        (k) => String(k.id) === String(filterKelas.value)
      )?.kelas ?? t.value.fallbackGroupName;
      const jumlah = filteredSiswa.value.length;
      if (!confirm(
        `Yakin ingin menghapus SEMUA ${jumlah} ${t.value.confirmDeleteAllEntity} di ${t.value.confirmDeleteAllGroup} "${namaKelas}"?
Tindakan ini tidak dapat dibatalkan.`
      )) return;
      router.delete(route("admin.siswa.destroyByKelas"), {
        data: { kelas_id: filterKelas.value },
        preserveScroll: true,
        onSuccess: () => {
          filterKelas.value = "";
          currentPage.value = 1;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: t.value.pageTitle
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="sm:bg-white/60 dark:sm:bg-gray-800/60 sm:backdrop-blur-md sm:rounded sm:shadow sm:p-6"${_scopeId}><div class="flex flex-col dark:text-gray-200 sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"${_scopeId}><div${_scopeId}><h1 class="text-xl font-semibold"${_scopeId}>${ssrInterpolate(t.value.heading)}</h1><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(t.value.subheading)}</p></div></div><div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4"${_scopeId}><input${ssrRenderAttr("value", search.value)} type="text"${ssrRenderAttr("placeholder", t.value.searchPlaceholder)} class="w-full rounded border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}><select class="w-full rounded border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}><option value="asc"${ssrIncludeBooleanAttr(Array.isArray(sort.value) ? ssrLooseContain(sort.value, "asc") : ssrLooseEqual(sort.value, "asc")) ? " selected" : ""}${_scopeId}>Sort A – Z</option><option value="desc"${ssrIncludeBooleanAttr(Array.isArray(sort.value) ? ssrLooseContain(sort.value, "desc") : ssrLooseEqual(sort.value, "desc")) ? " selected" : ""}${_scopeId}>Sort Z – A</option></select><select class="w-full rounded border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(filterKelas.value) ? ssrLooseContain(filterKelas.value, "") : ssrLooseEqual(filterKelas.value, "")) ? " selected" : ""}${_scopeId}>${ssrInterpolate(t.value.allGroupsOption)}</option><!--[-->`);
            ssrRenderList(kelasList.value, (k) => {
              _push2(`<option${ssrRenderAttr("value", k.id)}${ssrIncludeBooleanAttr(Array.isArray(filterKelas.value) ? ssrLooseContain(filterKelas.value, k.id) : ssrLooseEqual(filterKelas.value, k.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k.kelas)}</option>`);
            });
            _push2(`<!--]--></select><button class="flex items-center justify-center gap-2 px-4 py-2 rounded border bg-gray-700 dark:hover:bg-gray-800 text-white dark:bg-transparent hover:bg-gray-800 transition text-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Reset </button></div>`);
            if (filterKelas.value && filteredSiswa.value.length > 0) {
              _push2(`<div class="flex w-full mb-6 justify-end"${_scopeId}><button class="flex items-center gap-2 px-4 py-2 rounded border border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition text-sm font-medium"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Delete All ( ${ssrInterpolate(filteredSiswa.value.length)} ) ${ssrInterpolate(t.value.deleteAllSuffix)}</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="hidden md:block"${_scopeId}><h2 class="text-xl font-semibold dark:text-gray-300 mb-4 flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(InformationCircleIcon), { class: "w-6 h-6 text-blue-500" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(t.value.listAutoUpdateNote)}</h2><div class="hidden md:block rounded-lg overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md"${_scopeId}><table class="w-full border-collapse"${_scopeId}><thead class="bg-blue-800 text-white"${_scopeId}><tr${_scopeId}><th class="px-4 py-2 text-center border-r whitespace-nowrap"${_scopeId}>No</th><th class="px-4 py-2 text-center border-r whitespace-nowrap"${_scopeId}>Full Name</th><th class="px-4 py-2 text-center border-r whitespace-nowrap"${_scopeId}>${ssrInterpolate(t.value.idColumnLabel)}</th><th class="px-4 py-2 text-center border-r whitespace-nowrap"${_scopeId}>${ssrInterpolate(t.value.groupColumnLabel)} `);
            if (__props.isSmk && !unref(isWorkspace)) {
              _push2(`<span${_scopeId}> / Major</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="px-4 py-2 text-center border-r whitespace-nowrap"${_scopeId}>Status</th><th class="px-4 py-2 text-center whitespace-nowrap"${_scopeId}>Actions</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(paginatedSiswa.value, (s, index) => {
              _push2(`<tr class="border-t dark:border-none hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"${_scopeId}><td class="px-4 py-2 text-center"${_scopeId}>${ssrInterpolate((currentPage.value - 1) * perPage.value + index + 1)}</td><td class="px-4 py-2"${_scopeId}>${ssrInterpolate(s.nama_lengkap ?? "-")}</td><td class="px-4 py-2 text-center"${_scopeId}>${ssrInterpolate(s.nis ?? "-")} / ${ssrInterpolate(s.nisn ?? "-")}</td><td class="px-4 py-2 text-center"${_scopeId}>${ssrInterpolate(s.kelas?.kelas ?? "-")}`);
              if (__props.isSmk && !unref(isWorkspace)) {
                _push2(`<span${_scopeId}> / ${ssrInterpolate(s.kejuruan?.kejuruan ?? "-")}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td><td class="px-4 py-2 text-center"${_scopeId}><span class="${ssrRenderClass([{
                "text-green-700 dark:text-green-500": s.status === "Activated",
                "text-red-700 dark:text-red-500": s.status === "Deactivated"
              }, "font-semibold"])}"${_scopeId}>${ssrInterpolate(s.status === "Activated" ? "Active" : "Inactive")}</span></td><td class="px-6 justify-center py-2 flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("admin.siswa.edit", s.id),
                class: "text-blue-600 dark:text-gray-100 dark:hover:text-gray-300 hover:text-blue-800"
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
              _push2(`<button class="text-red-600 hover:text-red-800"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (filteredSiswa.value.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="6" class="text-center py-6 text-gray-500"${_scopeId}>${ssrInterpolate(t.value.noDataMessage)}</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div></div><div class="md:hidden grid grid-cols-1 gap-4"${_scopeId}><h2 class="text-lg font-semibold dark:text-gray-300 flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(InformationCircleIcon), { class: "w-6 h-6 text-blue-500" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(t.value.listAutoUpdateNote)}</h2><!--[-->`);
            ssrRenderList(paginatedSiswa.value, (s) => {
              _push2(`<div class="relative rounded border z-30 p-5 shadow hover:shadow-lg transition"${_scopeId}><div class="absolute z-20 inset-x-0 top-0 h-1 rounded-t bg-gradient-to-r from-blue-500 to-pink-500"${_scopeId}></div><div class="flex items-center gap-3 mt-2"${_scopeId}><div class="flex-1"${_scopeId}><div class="flex gap-3"${_scopeId}><div class="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-pink-600 text-white flex items-center justify-center font-bold text-lg"${_scopeId}>${ssrInterpolate(s.nama_lengkap.charAt(0).toUpperCase())}</div><h3 class="font-semibold mb-3 dark:text-gray-300 text-gray-800"${_scopeId}>${ssrInterpolate(s.nama_lengkap)}</h3></div><p class="text-sm mb-2 ml-10 dark:text-gray-400 text-gray-500"${_scopeId}>${ssrInterpolate(t.value.idColumnLabel)}: ${ssrInterpolate(s.nis ?? "-")} / ${ssrInterpolate(s.nisn ?? "-")}</p><p class="text-sm mb-4 ml-10 dark:text-gray-400 text-gray-500"${_scopeId}>${ssrInterpolate(t.value.groupColumnLabel)}: ${ssrInterpolate(s.kelas?.kelas ?? "-")}`);
              if (__props.isSmk && !unref(isWorkspace)) {
                _push2(`<span${_scopeId}> (${ssrInterpolate(s.kejuruan?.kejuruan ?? "-")})</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</p><span class="${ssrRenderClass([{
                "bg-green-50 border-green-200 text-green-700": s.status === "Activated",
                "bg-red-50 border-red-200 text-red-700": s.status === "Deactivated"
              }, "inline-flex ml-8 items-center gap-1 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border"])}"${_scopeId}>${ssrInterpolate(s.status === "Activated" ? "Active" : "Inactive")}</span></div></div><div class="absolute right-4 bottom-4 flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("admin.siswa.edit", s.id),
                class: "w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:bg-indigo-100 flex items-center justify-center"
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
              _push2(`<button class="w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button></div></div>`);
            });
            _push2(`<!--]-->`);
            if (filteredSiswa.value.length === 0) {
              _push2(`<p class="text-center py-6 text-gray-500"${_scopeId}>${ssrInterpolate(t.value.noDataMessage)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center justify-center gap-2 mt-6"${_scopeId}><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="${ssrRenderClass([currentPage.value === 1 ? "bg-gray-100 dark:bg-transparent text-gray-400 cursor-not-allowed" : "bg-gray-100 dark:bg-transparent text-gray-600 hover:bg-gray-200", "px-3 py-1 rounded-md text-sm"])}"${_scopeId}> ‹ Prev </button><!--[-->`);
            ssrRenderList(visiblePages.value, (p) => {
              _push2(`<button class="${ssrRenderClass([p === currentPage.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200", "px-3 py-1 rounded-md text-sm"])}"${_scopeId}>${ssrInterpolate(p)}</button>`);
            });
            _push2(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="${ssrRenderClass([currentPage.value === totalPages.value ? "bg-gray-100 dark:bg-transparent text-gray-400 cursor-not-allowed" : "bg-gray-100 dark:bg-transparent text-gray-600 hover:bg-gray-200", "px-3 py-1 rounded-md text-sm"])}"${_scopeId}> Next › </button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "sm:bg-white/60 dark:sm:bg-gray-800/60 sm:backdrop-blur-md sm:rounded sm:shadow sm:p-6" }, [
                createVNode("div", { class: "flex flex-col dark:text-gray-200 sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-xl font-semibold" }, toDisplayString(t.value.heading), 1),
                    createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(t.value.subheading), 1)
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => search.value = $event,
                    type: "text",
                    placeholder: t.value.searchPlaceholder,
                    class: "w-full rounded border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                    [vModelText, search.value]
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => sort.value = $event,
                    class: "w-full rounded border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  }, [
                    createVNode("option", { value: "asc" }, "Sort A – Z"),
                    createVNode("option", { value: "desc" }, "Sort Z – A")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, sort.value]
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => filterKelas.value = $event,
                    class: "w-full rounded border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-3 py-2 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  }, [
                    createVNode("option", { value: "" }, toDisplayString(t.value.allGroupsOption), 1),
                    (openBlock(true), createBlock(Fragment, null, renderList(kelasList.value, (k) => {
                      return openBlock(), createBlock("option", {
                        key: k.id,
                        value: k.id
                      }, toDisplayString(k.kelas), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, filterKelas.value]
                  ]),
                  createVNode("button", {
                    onClick: resetFilter,
                    class: "flex items-center justify-center gap-2 px-4 py-2 rounded border bg-gray-700 dark:hover:bg-gray-800 text-white dark:bg-transparent hover:bg-gray-800 transition text-sm"
                  }, [
                    createVNode(unref(ArrowPathIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Reset ")
                  ])
                ]),
                filterKelas.value && filteredSiswa.value.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex w-full mb-6 justify-end"
                }, [
                  createVNode("button", {
                    onClick: hapusSemuaByKelas,
                    class: "flex items-center gap-2 px-4 py-2 rounded border border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition text-sm font-medium"
                  }, [
                    createVNode(unref(TrashIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Delete All ( " + toDisplayString(filteredSiswa.value.length) + " ) " + toDisplayString(t.value.deleteAllSuffix), 1)
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "hidden md:block" }, [
                  createVNode("h2", { class: "text-xl font-semibold dark:text-gray-300 mb-4 flex items-center gap-2" }, [
                    createVNode(unref(InformationCircleIcon), { class: "w-6 h-6 text-blue-500" }),
                    createTextVNode(" " + toDisplayString(t.value.listAutoUpdateNote), 1)
                  ]),
                  createVNode("div", { class: "hidden md:block rounded-lg overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-md" }, [
                    createVNode("table", { class: "w-full border-collapse" }, [
                      createVNode("thead", { class: "bg-blue-800 text-white" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-4 py-2 text-center border-r whitespace-nowrap" }, "No"),
                          createVNode("th", { class: "px-4 py-2 text-center border-r whitespace-nowrap" }, "Full Name"),
                          createVNode("th", { class: "px-4 py-2 text-center border-r whitespace-nowrap" }, toDisplayString(t.value.idColumnLabel), 1),
                          createVNode("th", { class: "px-4 py-2 text-center border-r whitespace-nowrap" }, [
                            createTextVNode(toDisplayString(t.value.groupColumnLabel) + " ", 1),
                            __props.isSmk && !unref(isWorkspace) ? (openBlock(), createBlock("span", { key: 0 }, " / Major")) : createCommentVNode("", true)
                          ]),
                          createVNode("th", { class: "px-4 py-2 text-center border-r whitespace-nowrap" }, "Status"),
                          createVNode("th", { class: "px-4 py-2 text-center whitespace-nowrap" }, "Actions")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(paginatedSiswa.value, (s, index) => {
                          return openBlock(), createBlock("tr", {
                            key: s.id,
                            class: "border-t dark:border-none hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
                          }, [
                            createVNode("td", { class: "px-4 py-2 text-center" }, toDisplayString((currentPage.value - 1) * perPage.value + index + 1), 1),
                            createVNode("td", { class: "px-4 py-2" }, toDisplayString(s.nama_lengkap ?? "-"), 1),
                            createVNode("td", { class: "px-4 py-2 text-center" }, toDisplayString(s.nis ?? "-") + " / " + toDisplayString(s.nisn ?? "-"), 1),
                            createVNode("td", { class: "px-4 py-2 text-center" }, [
                              createTextVNode(toDisplayString(s.kelas?.kelas ?? "-"), 1),
                              __props.isSmk && !unref(isWorkspace) ? (openBlock(), createBlock("span", { key: 0 }, " / " + toDisplayString(s.kejuruan?.kejuruan ?? "-"), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("td", { class: "px-4 py-2 text-center" }, [
                              createVNode("span", {
                                class: ["font-semibold", {
                                  "text-green-700 dark:text-green-500": s.status === "Activated",
                                  "text-red-700 dark:text-red-500": s.status === "Deactivated"
                                }]
                              }, toDisplayString(s.status === "Activated" ? "Active" : "Inactive"), 3)
                            ]),
                            createVNode("td", { class: "px-6 justify-center py-2 flex gap-2" }, [
                              createVNode(unref(Link), {
                                href: _ctx.route("admin.siswa.edit", s.id),
                                class: "text-blue-600 dark:text-gray-100 dark:hover:text-gray-300 hover:text-blue-800"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(PencilSquareIcon), { class: "w-5 h-5" })
                                ]),
                                _: 1
                              }, 8, ["href"]),
                              createVNode("button", {
                                onClick: ($event) => hapus(s.id),
                                class: "text-red-600 hover:text-red-800"
                              }, [
                                createVNode(unref(TrashIcon), { class: "w-5 h-5" })
                              ], 8, ["onClick"])
                            ])
                          ]);
                        }), 128)),
                        filteredSiswa.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                          createVNode("td", {
                            colspan: "6",
                            class: "text-center py-6 text-gray-500"
                          }, toDisplayString(t.value.noDataMessage), 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "md:hidden grid grid-cols-1 gap-4" }, [
                  createVNode("h2", { class: "text-lg font-semibold dark:text-gray-300 flex items-center gap-2" }, [
                    createVNode(unref(InformationCircleIcon), { class: "w-6 h-6 text-blue-500" }),
                    createTextVNode(" " + toDisplayString(t.value.listAutoUpdateNote), 1)
                  ]),
                  (openBlock(true), createBlock(Fragment, null, renderList(paginatedSiswa.value, (s) => {
                    return openBlock(), createBlock("div", {
                      key: s.id,
                      class: "relative rounded border z-30 p-5 shadow hover:shadow-lg transition"
                    }, [
                      createVNode("div", { class: "absolute z-20 inset-x-0 top-0 h-1 rounded-t bg-gradient-to-r from-blue-500 to-pink-500" }),
                      createVNode("div", { class: "flex items-center gap-3 mt-2" }, [
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("div", { class: "flex gap-3" }, [
                            createVNode("div", { class: "w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-pink-600 text-white flex items-center justify-center font-bold text-lg" }, toDisplayString(s.nama_lengkap.charAt(0).toUpperCase()), 1),
                            createVNode("h3", { class: "font-semibold mb-3 dark:text-gray-300 text-gray-800" }, toDisplayString(s.nama_lengkap), 1)
                          ]),
                          createVNode("p", { class: "text-sm mb-2 ml-10 dark:text-gray-400 text-gray-500" }, toDisplayString(t.value.idColumnLabel) + ": " + toDisplayString(s.nis ?? "-") + " / " + toDisplayString(s.nisn ?? "-"), 1),
                          createVNode("p", { class: "text-sm mb-4 ml-10 dark:text-gray-400 text-gray-500" }, [
                            createTextVNode(toDisplayString(t.value.groupColumnLabel) + ": " + toDisplayString(s.kelas?.kelas ?? "-"), 1),
                            __props.isSmk && !unref(isWorkspace) ? (openBlock(), createBlock("span", { key: 0 }, " (" + toDisplayString(s.kejuruan?.kejuruan ?? "-") + ")", 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("span", {
                            class: ["inline-flex ml-8 items-center gap-1 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border", {
                              "bg-green-50 border-green-200 text-green-700": s.status === "Activated",
                              "bg-red-50 border-red-200 text-red-700": s.status === "Deactivated"
                            }]
                          }, toDisplayString(s.status === "Activated" ? "Active" : "Inactive"), 3)
                        ])
                      ]),
                      createVNode("div", { class: "absolute right-4 bottom-4 flex gap-2" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("admin.siswa.edit", s.id),
                          class: "w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:bg-indigo-100 flex items-center justify-center"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(PencilSquareIcon), { class: "w-5 h-5" })
                          ]),
                          _: 1
                        }, 8, ["href"]),
                        createVNode("button", {
                          onClick: ($event) => hapus(s.id),
                          class: "w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center"
                        }, [
                          createVNode(unref(TrashIcon), { class: "w-5 h-5" })
                        ], 8, ["onClick"])
                      ])
                    ]);
                  }), 128)),
                  filteredSiswa.value.length === 0 ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-center py-6 text-gray-500"
                  }, toDisplayString(t.value.noDataMessage), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex items-center justify-center gap-2 mt-6" }, [
                  createVNode("button", {
                    onClick: ($event) => currentPage.value--,
                    disabled: currentPage.value === 1,
                    class: ["px-3 py-1 rounded-md text-sm", currentPage.value === 1 ? "bg-gray-100 dark:bg-transparent text-gray-400 cursor-not-allowed" : "bg-gray-100 dark:bg-transparent text-gray-600 hover:bg-gray-200"]
                  }, " ‹ Prev ", 10, ["onClick", "disabled"]),
                  (openBlock(true), createBlock(Fragment, null, renderList(visiblePages.value, (p) => {
                    return openBlock(), createBlock("button", {
                      key: p,
                      onClick: ($event) => currentPage.value = p,
                      class: ["px-3 py-1 rounded-md text-sm", p === currentPage.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"]
                    }, toDisplayString(p), 11, ["onClick"]);
                  }), 128)),
                  createVNode("button", {
                    onClick: ($event) => currentPage.value++,
                    disabled: currentPage.value === totalPages.value,
                    class: ["px-3 py-1 rounded-md text-sm", currentPage.value === totalPages.value ? "bg-gray-100 dark:bg-transparent text-gray-400 cursor-not-allowed" : "bg-gray-100 dark:bg-transparent text-gray-600 hover:bg-gray-200"]
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Siswa/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
