import { ref, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./UserLayout-bEWAD7gb.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { UserGroupIcon, AcademicCapIcon, XMarkIcon, ClipboardDocumentListIcon, CheckBadgeIcon } from "@heroicons/vue/24/outline";
import { UserIcon } from "@heroicons/vue/24/solid";
import { BookUserIcon, Building2Icon, BookCheckIcon, FileCog2Icon } from "lucide-vue-next";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@vueuse/core";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const userName = page.props.auth.user.name || "User";
    const toast = ref({
      show: false,
      message: "",
      type: "info"
    });
    const menuItems = [
      { title: "Users Directory", icon: UserGroupIcon, route: route("admin.users.index") },
      { title: "Teacher List", icon: AcademicCapIcon, route: route("admin.guru.index") },
      { title: "Student List", icon: BookUserIcon, route: route("admin.siswa.index") },
      { title: "Class Room", icon: Building2Icon, route: route("admin.kelas.index") },
      { title: "Subjects", icon: BookCheckIcon, route: route("admin.mapel.index") },
      { title: "Vocational", icon: FileCog2Icon, route: route("admin.kejuruan.index") }
      // { title: 'Announcement', icon: MegaphoneIcon, route: route('pengumuman.create') },
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (toast.value.show) {
              _push2(`<div class="${ssrRenderClass([toast.value.show ? "opacity-100 scale-100" : "", "fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-3xl bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between z-50 transition-all duration-300 ease-out opacity-0 scale-95 md:hidden"])}"${_scopeId}><span class="truncate"${_scopeId}>${ssrInterpolate(toast.value.message)}</span><button class="ml-4 flex-shrink-0"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-5 h-5 text-white" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (toast.value.show) {
              _push2(`<div class="${ssrRenderClass([[
                toast.value.show ? "opacity-100 scale-100" : "",
                toast.value.type === "success" ? "bg-green-600" : "bg-gray-800"
              ], "hidden md:flex fixed top-5 right-5 w-full max-w-sm px-5 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-out opacity-0 scale-95 items-center gap-3 text-white"])}"${_scopeId}>`);
              if (toast.value.type === "success") {
                _push2(`<svg class="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="truncate"${_scopeId}>${ssrInterpolate(toast.value.message)}</span><button class="ml-auto flex-shrink-0"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-5 h-5 text-white" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="bg-gradient-to-r mb-6 from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:shadow-lg dark:bg-gradient-to-br dark:sm:from-[#1e1b4b] dark:sm:via-[#312e81] dark:sm:to-[#4c1d95] dark:from-[#063970] dark:via-[#0a4e8c] dark:to-[#1e1b4b] border dark:border-[#1e1b4b] transition-all duration-300 sm:p-6 p-4 flex flex-col sm:flex-row items-center sm:text-left text-center gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(UserIcon), { class: "w-12 h-12 text-white" }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><h1 class="sm:text-3xl text-xl font-bold"${_scopeId}>Welcome, ${ssrInterpolate(unref(userName))}! 👋</h1><p class="text-white/90 sm:text-base text-xs"${_scopeId}>May your day remain productive and enjoyable!</p></div></div><div class="sm:grid hidden mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"${_scopeId}><div class="bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-lg transition"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(UserGroupIcon), { class: "w-10 h-10 dark:text-orange-500 text-purple-500" }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="text-gray-500 dark:text-white"${_scopeId}>Proktor</p><h3 class="text-xl font-bold dark:text-white"${_scopeId}>${ssrInterpolate(unref(page).props.usersCount.proktor)}</h3></div></div><div class="bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-lg transition"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(AcademicCapIcon), { class: "w-10 h-10 text-green-500" }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="text-gray-500 dark:text-white"${_scopeId}>Guru</p><h3 class="text-xl font-bold dark:text-white"${_scopeId}>${ssrInterpolate(unref(page).props.usersCount.guru)}</h3></div></div><div class="bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-lg transition"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ClipboardDocumentListIcon), { class: "w-10 h-10 text-blue-500" }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="text-gray-500 dark:text-white"${_scopeId}>Siswa</p><h3 class="text-xl font-bold dark:text-white"${_scopeId}>${ssrInterpolate(unref(page).props.usersCount.siswa)}</h3></div></div></div><div class="bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] sm:block hidden rounded-lg shadow p-6"${_scopeId}><h2 class="font-semibold text-lg dark:text-white text-gray-700 mb-4"${_scopeId}>Aktivitas Terbaru</h2><ul class="space-y-2"${_scopeId}><li class="flex items-center dark:text-white gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckBadgeIcon), { class: "w-5 h-5 text-green-500" }, null, _parent2, _scopeId));
            _push2(` Peserta baru mendaftar 3 menit yang lalu </li><li class="flex items-center dark:text-white gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ClipboardDocumentListIcon), { class: "w-5 h-5 text-blue-500" }, null, _parent2, _scopeId));
            _push2(` Ujian baru ditambahkan </li><li class="flex items-center dark:text-white gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(AcademicCapIcon), { class: "w-5 h-5 text-yellow-500" }, null, _parent2, _scopeId));
            _push2(` Nilai ujian diperbarui </li></ul></div><div class="max-w-7xl pb-16 mx-auto space-y-6"${_scopeId}><div class="grid md:hidden grid-cols-2 sm:grid-cols-3 gap-4"${_scopeId}><!--[-->`);
            ssrRenderList(menuItems, (item) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: item.title,
                href: item.route,
                prefetch: "hover",
                "preserve-scroll": "",
                "preserve-state": "",
                class: "flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl dark:bg-gradient-to-br dark:from-[#063970] dark:via-[#0a4e8c] dark:to-[#1e1b4b] transition transform w-full"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(item.icon), { class: "w-10 h-10 dark:text-gray-300 text-blue-500" }, null), _parent3, _scopeId2);
                    _push3(`<span class="text-sm font-medium dark:text-gray-100 text-gray-700 text-center"${_scopeId2}>${ssrInterpolate(item.title)}</span>`);
                  } else {
                    return [
                      (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-10 h-10 dark:text-gray-300 text-blue-500" })),
                      createVNode("span", { class: "text-sm font-medium dark:text-gray-100 text-gray-700 text-center" }, toDisplayString(item.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              toast.value.show ? (openBlock(), createBlock("div", {
                key: 0,
                class: ["fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-3xl bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between z-50 transition-all duration-300 ease-out opacity-0 scale-95 md:hidden", toast.value.show ? "opacity-100 scale-100" : ""]
              }, [
                createVNode("span", { class: "truncate" }, toDisplayString(toast.value.message), 1),
                createVNode("button", {
                  onClick: ($event) => toast.value.show = false,
                  class: "ml-4 flex-shrink-0"
                }, [
                  createVNode(unref(XMarkIcon), { class: "w-5 h-5 text-white" })
                ], 8, ["onClick"])
              ], 2)) : createCommentVNode("", true),
              toast.value.show ? (openBlock(), createBlock("div", {
                key: 1,
                class: ["hidden md:flex fixed top-5 right-5 w-full max-w-sm px-5 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-out opacity-0 scale-95 items-center gap-3 text-white", [
                  toast.value.show ? "opacity-100 scale-100" : "",
                  toast.value.type === "success" ? "bg-green-600" : "bg-gray-800"
                ]]
              }, [
                toast.value.type === "success" ? (openBlock(), createBlock("svg", {
                  key: 0,
                  class: "w-6 h-6 text-white flex-shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M5 13l4 4L19 7"
                  })
                ])) : createCommentVNode("", true),
                createVNode("span", { class: "truncate" }, toDisplayString(toast.value.message), 1),
                createVNode("button", {
                  onClick: ($event) => toast.value.show = false,
                  class: "ml-auto flex-shrink-0"
                }, [
                  createVNode(unref(XMarkIcon), { class: "w-5 h-5 text-white" })
                ], 8, ["onClick"])
              ], 2)) : createCommentVNode("", true),
              createVNode("div", { class: "bg-gradient-to-r mb-6 from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:shadow-lg dark:bg-gradient-to-br dark:sm:from-[#1e1b4b] dark:sm:via-[#312e81] dark:sm:to-[#4c1d95] dark:from-[#063970] dark:via-[#0a4e8c] dark:to-[#1e1b4b] border dark:border-[#1e1b4b] transition-all duration-300 sm:p-6 p-4 flex flex-col sm:flex-row items-center sm:text-left text-center gap-4" }, [
                createVNode(unref(UserIcon), { class: "w-12 h-12 text-white" }),
                createVNode("div", null, [
                  createVNode("h1", { class: "sm:text-3xl text-xl font-bold" }, "Welcome, " + toDisplayString(unref(userName)) + "! 👋", 1),
                  createVNode("p", { class: "text-white/90 sm:text-base text-xs" }, "May your day remain productive and enjoyable!")
                ])
              ]),
              createVNode("div", { class: "sm:grid hidden mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" }, [
                createVNode("div", { class: "bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-lg transition" }, [
                  createVNode(unref(UserGroupIcon), { class: "w-10 h-10 dark:text-orange-500 text-purple-500" }),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-gray-500 dark:text-white" }, "Proktor"),
                    createVNode("h3", { class: "text-xl font-bold dark:text-white" }, toDisplayString(unref(page).props.usersCount.proktor), 1)
                  ])
                ]),
                createVNode("div", { class: "bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-lg transition" }, [
                  createVNode(unref(AcademicCapIcon), { class: "w-10 h-10 text-green-500" }),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-gray-500 dark:text-white" }, "Guru"),
                    createVNode("h3", { class: "text-xl font-bold dark:text-white" }, toDisplayString(unref(page).props.usersCount.guru), 1)
                  ])
                ]),
                createVNode("div", { class: "bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-lg transition" }, [
                  createVNode(unref(ClipboardDocumentListIcon), { class: "w-10 h-10 text-blue-500" }),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-gray-500 dark:text-white" }, "Siswa"),
                    createVNode("h3", { class: "text-xl font-bold dark:text-white" }, toDisplayString(unref(page).props.usersCount.siswa), 1)
                  ])
                ])
              ]),
              createVNode("div", { class: "bg-white dark:bg-gradient-to-br dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#4c1d95] sm:block hidden rounded-lg shadow p-6" }, [
                createVNode("h2", { class: "font-semibold text-lg dark:text-white text-gray-700 mb-4" }, "Aktivitas Terbaru"),
                createVNode("ul", { class: "space-y-2" }, [
                  createVNode("li", { class: "flex items-center dark:text-white gap-2" }, [
                    createVNode(unref(CheckBadgeIcon), { class: "w-5 h-5 text-green-500" }),
                    createTextVNode(" Peserta baru mendaftar 3 menit yang lalu ")
                  ]),
                  createVNode("li", { class: "flex items-center dark:text-white gap-2" }, [
                    createVNode(unref(ClipboardDocumentListIcon), { class: "w-5 h-5 text-blue-500" }),
                    createTextVNode(" Ujian baru ditambahkan ")
                  ]),
                  createVNode("li", { class: "flex items-center dark:text-white gap-2" }, [
                    createVNode(unref(AcademicCapIcon), { class: "w-5 h-5 text-yellow-500" }),
                    createTextVNode(" Nilai ujian diperbarui ")
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-7xl pb-16 mx-auto space-y-6" }, [
                createVNode("div", { class: "grid md:hidden grid-cols-2 sm:grid-cols-3 gap-4" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item) => {
                    return createVNode(unref(Link), {
                      key: item.title,
                      href: item.route,
                      prefetch: "hover",
                      "preserve-scroll": "",
                      "preserve-state": "",
                      class: "flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl dark:bg-gradient-to-br dark:from-[#063970] dark:via-[#0a4e8c] dark:to-[#1e1b4b] transition transform w-full"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-10 h-10 dark:text-gray-300 text-blue-500" })),
                        createVNode("span", { class: "text-sm font-medium dark:text-gray-100 text-gray-700 text-center" }, toDisplayString(item.title), 1)
                      ]),
                      _: 2
                    }, 1032, ["href"]);
                  }), 64))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
