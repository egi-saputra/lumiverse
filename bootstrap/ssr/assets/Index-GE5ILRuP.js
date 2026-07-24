import { ref, resolveComponent, unref, withCtx, createVNode, createTextVNode, useSSRContext, watch, computed, toDisplayString, openBlock, createBlock, createCommentVNode, withDirectives, vModelText, Fragment, renderList, vModelSelect } from "vue";
import { ssrRenderTeleport, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { O as OwnerLayout } from "./OwnerLayout-C9QaMqab.js";
import { Link, Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$2, a as _sfc_main$4 } from "./AlertSuccess-BZ7XVdF-.js";
import { _ as _sfc_main$3 } from "./AlertError-BtD7qWDV.js";
import { XMarkIcon, ShieldCheckIcon, AcademicCapIcon, Cog6ToothIcon, UserIcon, EnvelopeIcon, UserCircleIcon, CalendarIcon, TrashIcon, PencilSquareIcon, ArrowPathIcon, SparklesIcon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main$1 = {
  __name: "UserDetailModal",
  __ssrInlineRender: true,
  props: {
    roleLabels: Object
  },
  emits: ["delete"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const show = ref(false);
    const user = ref(null);
    function open(u) {
      user.value = u;
      show.value = true;
    }
    function roleLabel(u) {
      if (!u) return "";
      if (u.role === "admin" && u.isSelf) return "Super Admin";
      return props.roleLabels?.[u.role] ?? u.role;
    }
    const roleBadgeClass = (u) => ({
      "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/40 dark:border-amber-600 dark:text-amber-300": u.role === "admin" && u.isSelf,
      "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900 dark:border-purple-600 dark:text-purple-300": u.role === "admin" && !u.isSelf,
      "bg-green-50 border-green-200 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300": u.role === "guru",
      "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-300": u.role === "proktor",
      "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300": u.role === "siswa",
      "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300": u.role === "user"
    });
    __expose({ open });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SparklesIcon = resolveComponent("SparklesIcon");
      ssrRenderTeleport(_push, (_push2) => {
        if (show.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center px-4"><div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>`);
          if (user.value) {
            _push2(`<div class="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden"><div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div><button class="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition">`);
            _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-5 h-5" }, null, _parent));
            _push2(`</button><div class="p-6"><div class="flex items-center gap-4 mb-5"><div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xl">${ssrInterpolate(user.value.name.charAt(0).toUpperCase())}</div><div class="min-w-0"><h3 class="font-semibold text-lg text-gray-900 dark:text-white truncate">${ssrInterpolate(user.value.name)}</h3><span class="${ssrRenderClass([roleBadgeClass(user.value), "inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border"])}">`);
            if (user.value.role === "admin" && user.value.isSelf) {
              _push2(ssrRenderComponent(_component_SparklesIcon, { class: "w-3.5 h-3.5" }, null, _parent));
            } else if (user.value.role === "admin") {
              _push2(ssrRenderComponent(unref(ShieldCheckIcon), { class: "w-3.5 h-3.5" }, null, _parent));
            } else if (user.value.role === "guru") {
              _push2(ssrRenderComponent(unref(AcademicCapIcon), { class: "w-3.5 h-3.5" }, null, _parent));
            } else if (user.value.role === "proktor") {
              _push2(ssrRenderComponent(unref(Cog6ToothIcon), { class: "w-3.5 h-3.5" }, null, _parent));
            } else {
              _push2(ssrRenderComponent(unref(UserIcon), { class: "w-3.5 h-3.5" }, null, _parent));
            }
            _push2(` ${ssrInterpolate(roleLabel(user.value))}</span></div></div><div class="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4"><div class="flex items-center gap-2 text-sm">`);
            _push2(ssrRenderComponent(unref(EnvelopeIcon), { class: "w-4 h-4 text-gray-400 flex-shrink-0" }, null, _parent));
            _push2(`<span class="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">Email</span><span class="text-gray-800 dark:text-gray-200 truncate">${ssrInterpolate(user.value.email)}</span></div><div class="flex items-center gap-2 text-sm">`);
            _push2(ssrRenderComponent(unref(UserCircleIcon), { class: "w-4 h-4 text-gray-400 flex-shrink-0" }, null, _parent));
            _push2(`<span class="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">Telepon</span><span class="text-gray-800 dark:text-gray-200">${ssrInterpolate(user.value.phone ?? "-")}</span></div>`);
            if (user.value.created_at) {
              _push2(`<div class="flex items-center gap-2 text-sm">`);
              _push2(ssrRenderComponent(unref(CalendarIcon), { class: "w-4 h-4 text-gray-400 flex-shrink-0" }, null, _parent));
              _push2(`<span class="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">Terdaftar</span><span class="text-gray-800 dark:text-gray-200">${ssrInterpolate(user.value.created_at)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (user.value.isSelf) {
              _push2(`<p class="mt-4 text-xs text-amber-600 dark:text-amber-400"> Ini adalah akun Anda sendiri. </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">`);
            if (!user.value.isSelf) {
              _push2(`<button class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/40 hover:bg-red-100 dark:hover:bg-red-900 transition">`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent));
              _push2(` Hapus </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("owner.users.edit", user.value.id),
              class: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                  _push3(` Edit `);
                } else {
                  return [
                    createVNode(unref(PencilSquareIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Edit ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Modals/UserDetailModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    users: Object,
    filters: Object,
    roleOptions: Array,
    roleLabels: Object,
    userCount: Number,
    maxUsers: { type: [Number, null], default: null }
  },
  setup(__props) {
    const props = __props;
    const search = ref(props.filters.search ?? "");
    const role = ref(props.filters.role ?? "");
    const detailModal = ref(null);
    function applyFilters() {
      router.get(route("owner.users.index"), {
        search: search.value || void 0,
        role: role.value || void 0
      }, { preserveState: true, preserveScroll: true, replace: true });
    }
    let debounceTimer = null;
    watch(search, () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 400);
    });
    watch(role, applyFilters);
    function resetFilter() {
      search.value = "";
      role.value = "";
    }
    function roleLabel(u) {
      if (u.role === "admin" && u.isSelf) return "PIC / Super Admin";
      return props.roleLabels[u.role] ?? u.role;
    }
    const roleBadgeClass = (u) => ({
      "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/40 dark:border-amber-600 dark:text-amber-300": u.role === "admin" && u.isSelf,
      "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900 dark:border-purple-600 dark:text-purple-300": u.role === "admin" && !u.isSelf,
      "bg-green-50 border-green-200 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300": u.role === "guru",
      "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-300": u.role === "proktor",
      "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300": u.role === "siswa",
      "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300": u.role === "user"
    });
    const deleteModal = ref(null);
    const openDelete = (id) => {
      deleteModal.value.open(id, "owner.users.destroy");
    };
    const limitReached = computed(() => props.maxUsers && props.userCount >= props.maxUsers);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Kelola Pengguna" }, null, _parent));
      _push(ssrRenderComponent(OwnerLayout, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="topbar-title" data-v-83840235${_scopeId}>Kelola Pengguna</h1>`);
          } else {
            return [
              createVNode("h1", { class: "topbar-title" }, "Kelola Pengguna")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-83840235${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, null, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8" data-v-83840235${_scopeId}><div data-v-83840235${_scopeId}><h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" data-v-83840235${_scopeId}> Kelola Pengguna </h1><p class="text-sm text-gray-500 dark:text-gray-400" data-v-83840235${_scopeId}>${ssrInterpolate(__props.userCount)}`);
            if (__props.maxUsers) {
              _push2(`<span data-v-83840235${_scopeId}> / ${ssrInterpolate(__props.maxUsers)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` pengguna terdaftar di lembaga Anda </p></div>`);
            if (!limitReached.value) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("owner.users.create"),
                class: "px-5 py-2 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition sm:shadow-lg text-sm font-medium"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` + Tambah Pengguna `);
                  } else {
                    return [
                      createTextVNode(" + Tambah Pengguna ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (limitReached.value) {
              _push2(`<div class="mb-6 rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/40 px-4 py-3 text-sm text-amber-700 dark:text-amber-300" data-v-83840235${_scopeId}> Batas jumlah pengguna (${ssrInterpolate(__props.maxUsers)}) untuk paket Anda sudah tercapai. `);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/lumiverse/pricing",
                class: "font-semibold underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Upgrade paket`);
                  } else {
                    return [
                      createTextVNode("Upgrade paket")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(` untuk menambah pengguna baru. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 md:mb-6" data-v-83840235${_scopeId}><input${ssrRenderAttr("value", search.value)} placeholder="Cari nama atau email..." class="w-full lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md transition" data-v-83840235${_scopeId}><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" data-v-83840235${_scopeId}><option value="" data-v-83840235${ssrIncludeBooleanAttr(Array.isArray(role.value) ? ssrLooseContain(role.value, "") : ssrLooseEqual(role.value, "")) ? " selected" : ""}${_scopeId}>Semua Peran</option><!--[-->`);
            ssrRenderList(__props.roleOptions, (r) => {
              _push2(`<option${ssrRenderAttr("value", r.value)} data-v-83840235${ssrIncludeBooleanAttr(Array.isArray(role.value) ? ssrLooseContain(role.value, r.value) : ssrLooseEqual(role.value, r.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(r.label)}</option>`);
            });
            _push2(`<!--]--></select><button class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-1 dark:border-gray-600 bg-gray-100 dark:bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition" data-v-83840235${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Reset </button></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-v-83840235${_scopeId}><!--[-->`);
            ssrRenderList(__props.users.data, (u, i) => {
              _push2(`<div class="relative rounded border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-5 backdrop-blur-md shadow-lg transition hover:shadow-xl" data-v-83840235${_scopeId}><div class="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500" data-v-83840235${_scopeId}></div><div class="flex items-center gap-4 mt-2" data-v-83840235${_scopeId}><div class="flex-1" data-v-83840235${_scopeId}><h3 class="font-semibold text-gray-800 dark:text-gray-100" data-v-83840235${_scopeId}>${ssrInterpolate(u.name)}</h3><div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400" data-v-83840235${_scopeId}>`);
              _push2(ssrRenderComponent(unref(EnvelopeIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(u.email)}</div><span class="${ssrRenderClass([roleBadgeClass(u), "inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border"])}" data-v-83840235${_scopeId}>`);
              if (u.role === "admin" && u.isSelf) {
                _push2(ssrRenderComponent(unref(SparklesIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              } else if (u.role === "admin") {
                _push2(ssrRenderComponent(unref(ShieldCheckIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              } else if (u.role === "guru") {
                _push2(ssrRenderComponent(unref(AcademicCapIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              } else if (u.role === "proktor") {
                _push2(ssrRenderComponent(unref(Cog6ToothIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(UserIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              }
              _push2(` ${ssrInterpolate(roleLabel(u))}</span></div></div><div class="flex items-center gap-1 mt-4 text-sm text-gray-500 dark:text-gray-400" data-v-83840235${_scopeId}>`);
              _push2(ssrRenderComponent(unref(UserCircleIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(u.phone ?? "Tidak ada nomor telepon")}</div><div class="absolute right-4 bottom-4 flex gap-2" data-v-83840235${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("owner.users.edit", u.id),
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
              _push2(`<button class="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 flex items-center justify-center transition" data-v-83840235${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(`</button></div></div>`);
            });
            _push2(`<!--]--></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              ref_key: "deleteModal",
              ref: deleteModal,
              title: "Yakin ingin menghapus?",
              description: "Menghapus pengguna ini akan menghilangkan seluruh data terkait secara permanen."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, {
              ref_key: "detailModal",
              ref: detailModal,
              "role-labels": __props.roleLabels,
              onDelete: openDelete
            }, null, _parent2, _scopeId));
            if (__props.users.data.length === 0) {
              _push2(`<div class="text-center py-12 text-gray-500 dark:text-gray-400" data-v-83840235${_scopeId}> Tidak ada data pengguna yang cocok. </div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.users.links.length > 3) {
              _push2(`<div class="flex items-center justify-center gap-2 mt-10 flex-wrap" data-v-83840235${_scopeId}><!--[-->`);
              ssrRenderList(__props.users.links, (link, i) => {
                _push2(`<!--[-->`);
                if (link.url) {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: link.url,
                    "preserve-scroll": "",
                    "preserve-state": "",
                    class: ["px-3 py-1 rounded-md text-sm transition", link.active ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"]
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<span class="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed" data-v-83840235${_scopeId}>${link.label ?? ""}</span>`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode(_sfc_main$2),
                createVNode(_sfc_main$3),
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" }, " Kelola Pengguna "),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, [
                      createTextVNode(toDisplayString(__props.userCount), 1),
                      __props.maxUsers ? (openBlock(), createBlock("span", { key: 0 }, " / " + toDisplayString(__props.maxUsers), 1)) : createCommentVNode("", true),
                      createTextVNode(" pengguna terdaftar di lembaga Anda ")
                    ])
                  ]),
                  !limitReached.value ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: _ctx.route("owner.users.create"),
                    class: "px-5 py-2 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition sm:shadow-lg text-sm font-medium"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + Tambah Pengguna ")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
                ]),
                limitReached.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mb-6 rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/40 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
                }, [
                  createTextVNode(" Batas jumlah pengguna (" + toDisplayString(__props.maxUsers) + ") untuk paket Anda sudah tercapai. ", 1),
                  createVNode(unref(Link), {
                    href: "/lumiverse/pricing",
                    class: "font-semibold underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Upgrade paket")
                    ]),
                    _: 1
                  }),
                  createTextVNode(" untuk menambah pengguna baru. ")
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 md:mb-6" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => search.value = $event,
                    placeholder: "Cari nama atau email...",
                    class: "w-full lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md transition"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, search.value]
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => role.value = $event,
                    class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  }, [
                    createVNode("option", { value: "" }, "Semua Peran"),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.roleOptions, (r) => {
                      return openBlock(), createBlock("option", {
                        key: r.value,
                        value: r.value
                      }, toDisplayString(r.label), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, role.value]
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
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.users.data, (u, i) => {
                    return openBlock(), createBlock("div", {
                      key: u.id,
                      class: "relative rounded border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-5 backdrop-blur-md shadow-lg transition hover:shadow-xl"
                    }, [
                      createVNode("div", { class: "absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500" }),
                      createVNode("div", { class: "flex items-center gap-4 mt-2" }, [
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("h3", { class: "font-semibold text-gray-800 dark:text-gray-100" }, toDisplayString(u.name), 1),
                          createVNode("div", { class: "flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400" }, [
                            createVNode(unref(EnvelopeIcon), { class: "w-4 h-4" }),
                            createTextVNode(" " + toDisplayString(u.email), 1)
                          ]),
                          createVNode("span", {
                            class: ["inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border", roleBadgeClass(u)]
                          }, [
                            u.role === "admin" && u.isSelf ? (openBlock(), createBlock(unref(SparklesIcon), {
                              key: 0,
                              class: "w-4 h-4"
                            })) : u.role === "admin" ? (openBlock(), createBlock(unref(ShieldCheckIcon), {
                              key: 1,
                              class: "w-4 h-4"
                            })) : u.role === "guru" ? (openBlock(), createBlock(unref(AcademicCapIcon), {
                              key: 2,
                              class: "w-4 h-4"
                            })) : u.role === "proktor" ? (openBlock(), createBlock(unref(Cog6ToothIcon), {
                              key: 3,
                              class: "w-4 h-4"
                            })) : (openBlock(), createBlock(unref(UserIcon), {
                              key: 4,
                              class: "w-4 h-4"
                            })),
                            createTextVNode(" " + toDisplayString(roleLabel(u)), 1)
                          ], 2)
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center gap-1 mt-4 text-sm text-gray-500 dark:text-gray-400" }, [
                        createVNode(unref(UserCircleIcon), { class: "w-4 h-4" }),
                        createTextVNode(" " + toDisplayString(u.phone ?? "Tidak ada nomor telepon"), 1)
                      ]),
                      createVNode("div", { class: "absolute right-4 bottom-4 flex gap-2" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("owner.users.edit", u.id),
                          class: "w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 flex items-center justify-center transition"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(PencilSquareIcon), { class: "w-5 h-5" })
                          ]),
                          _: 1
                        }, 8, ["href"]),
                        createVNode("button", {
                          onClick: ($event) => openDelete(u.id),
                          class: "w-9 h-9 rounded-full bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 flex items-center justify-center transition"
                        }, [
                          createVNode(unref(TrashIcon), { class: "w-5 h-5" })
                        ], 8, ["onClick"])
                      ])
                    ]);
                  }), 128))
                ]),
                createVNode(_sfc_main$4, {
                  ref_key: "deleteModal",
                  ref: deleteModal,
                  title: "Yakin ingin menghapus?",
                  description: "Menghapus pengguna ini akan menghilangkan seluruh data terkait secara permanen."
                }, null, 512),
                createVNode(_sfc_main$1, {
                  ref_key: "detailModal",
                  ref: detailModal,
                  "role-labels": __props.roleLabels,
                  onDelete: openDelete
                }, null, 8, ["role-labels"]),
                __props.users.data.length === 0 ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center py-12 text-gray-500 dark:text-gray-400"
                }, " Tidak ada data pengguna yang cocok. ")) : createCommentVNode("", true),
                __props.users.links.length > 3 ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "flex items-center justify-center gap-2 mt-10 flex-wrap"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.users.links, (link, i) => {
                    return openBlock(), createBlock(Fragment, { key: i }, [
                      link.url ? (openBlock(), createBlock(unref(Link), {
                        key: 0,
                        href: link.url,
                        "preserve-scroll": "",
                        "preserve-state": "",
                        class: ["px-3 py-1 rounded-md text-sm transition", link.active ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"],
                        innerHTML: link.label
                      }, null, 8, ["href", "class", "innerHTML"])) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed",
                        innerHTML: link.label
                      }, null, 8, ["innerHTML"]))
                    ], 64);
                  }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Owner/Users/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-83840235"]]);
export {
  Index as default
};
