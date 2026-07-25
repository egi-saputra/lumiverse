import { computed, onMounted, watch, ref, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrRenderSlot } from "vue/server-renderer";
import { usePage, router } from "@inertiajs/vue3";
import { T as ToastAlert, _ as _sfc_main$1, a as _sfc_main$2, b as _sfc_main$3, c as _sfc_main$4, d as _sfc_main$5, e as _sfc_main$6, f as _sfc_main$7 } from "./Sidebar-COsy3wF2.js";
import { onClickOutside } from "@vueuse/core";
import { ArrowLeftIcon, ChevronRightIcon, ArrowRightOnRectangleIcon } from "@heroicons/vue/24/solid";
import { SunIcon, MoonIcon, BellIcon, Cog6ToothIcon } from "@heroicons/vue/24/outline";
const _sfc_main = {
  __name: "MenuLayout",
  __ssrInlineRender: true,
  props: {
    disableSwal: { type: Boolean, default: false }
    // logoUrl: { type: String, default: '/images/logo.png' },
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const { success, error } = ToastAlert();
    computed(() => page.props.logoUrl ?? "/images/logo.png");
    computed(() => page.props.namaSekolah ?? "Nama Sekolah");
    onMounted(() => {
      if (props.disableSwal) return;
      if (page.props.flash?.success) success(page.props.flash.success);
      if (page.props.flash?.error) error(page.props.flash.error);
    });
    watch(
      () => page.props.flash,
      (flash) => {
        if (props.disableSwal) return;
        if (flash?.success) success(flash.success);
        if (flash?.error) error(flash.error);
      }
    );
    const authUser = computed(() => page.props.auth?.user ?? null);
    const authRole = computed(() => page.props.auth?.role ?? "");
    const userName = computed(() => authUser.value?.name ?? "");
    const showingNotifDropdown = ref(false);
    const notifDropdownRef = ref(null);
    const bellButtonRef = ref(null);
    const userId = computed(() => authUser.value?.id ?? "guest");
    computed(() => `readNotifications_${userId.value}`);
    const readIds = ref(
      new Set(JSON.parse(localStorage.getItem(`readNotifications_${page.props.auth?.user?.id ?? "guest"}`) || "[]"))
    );
    const notifications = computed(() => {
      const role = authRole.value;
      if (!role) return [];
      return (page.props.announcements ?? []).filter((item) => {
        if (item.penerima === role) return true;
        if (role === "siswa" && item.kelas_id) {
          return Number(item.kelas_id) === Number(page.props.kelasId);
        }
        return false;
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });
    const recentNotifs = computed(() => notifications.value.slice(0, 10));
    const isUnread = (id) => !readIds.value.has(id);
    const unreadCount = computed(() => recentNotifs.value.filter((n) => isUnread(n.id)).length);
    onClickOutside(notifDropdownRef, () => showingNotifDropdown.value = false, { ignore: [bellButtonRef] });
    const showingNavigationDropdown = ref(false);
    const navDropdownRef = ref(null);
    const navButtonRef = ref(null);
    onClickOutside(navDropdownRef, () => showingNavigationDropdown.value = false, { ignore: [navButtonRef] });
    const SidebarComponent = computed(() => {
      switch (authRole.value) {
        case "admin":
          return _sfc_main$4;
        case "proktor":
          return _sfc_main$3;
        case "guru":
          return _sfc_main$2;
        case "siswa":
          return _sfc_main$1;
        default:
          return null;
      }
    });
    const dashboardHref = computed(() => {
      switch (authRole.value) {
        case "admin":
          return route("admin.dashboard");
        case "proktor":
          return route("proktor.dashboard");
        case "guru":
          return route("guru.dashboard");
        case "siswa":
          return route("siswa.dashboard");
        default:
          return route("dashboard");
      }
    });
    const isDark = ref(false);
    const applyTheme = (dark) => {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("theme", dark ? "dark" : "light");
    };
    onMounted(() => {
      const theme = localStorage.getItem("theme");
      isDark.value = theme === "dark";
      applyTheme(isDark.value);
    });
    const logout = () => router.post(route("logout"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div id="theme-transition-layer"></div><div class="h-screen bg-gray-100 dark:bg-[#063970] flex flex-col overflow-hidden"><nav class="bg-white dark:bg-[#041C32] sm:dark:bg-[#0F172A] border-b border-gray-300 dark:sm:border-gray-700 dark:border-[#1e1b4b] sticky top-0 z-50"><div class="mx-auto sm:px-6 px-2"><div class="flex justify-between h-16 items-center"><div class="flex items-center"><img${ssrRenderAttr("src", unref(page).props.tenant?.logo ?? "/images/default.png")}${ssrRenderAttr("alt", unref(page).props.tenant?.name)} class="h-10 sm:block hidden object-contain" loading="lazy"><span class="sm:text-lg text-base ml-3 font-raleway font-extrabold uppercase dark:text-white text-[#063970] sm:block hidden">${ssrInterpolate(unref(page).props.tenant?.name ?? "Lumiverse School")}</span><button class="p-1 mr-2 sm:hidden block rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(ArrowLeftIcon), { class: "h-5 w-5 text-[#063970] dark:text-white" }, null, _parent));
      _push(`</button><span class="text-lg font-bold sm:hidden block dark:text-white text-[#063970]">${ssrInterpolate(unref(page).props.title ?? "")}</span></div><div class="flex items-center gap-1"><button title="Toggle Dark Mode" class="relative mr-2 sm:flex hidden w-16 h-8 rounded-full backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-white/10 shadow-inner shadow-black/10 dark:shadow-black/40 transition-all duration-300">`);
      _push(ssrRenderComponent(unref(SunIcon), {
        class: ["absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 transition-opacity duration-300", isDark.value ? "opacity-90" : "opacity-100"]
      }, null, _parent));
      _push(ssrRenderComponent(unref(MoonIcon), {
        class: ["absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 transition-opacity duration-300", isDark.value ? "opacity-100" : "opacity-60"]
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([isDark.value ? "translate-x-8" : "translate-x-1", "absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full backdrop-blur-md bg-white/80 dark:bg-slate-800 shadow-md shadow-black/20 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"])}"></span></button><button title="Toggle Dark Mode" class="relative mr-1 sm:hidden w-14 h-8 rounded-full backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-white/10 shadow-inner shadow-black/10 dark:shadow-black/40 transition-all duration-300">`);
      _push(ssrRenderComponent(unref(SunIcon), {
        class: ["absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 transition-opacity duration-300", isDark.value ? "opacity-30" : "opacity-100"]
      }, null, _parent));
      _push(ssrRenderComponent(unref(MoonIcon), {
        class: ["absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 transition-opacity duration-300", isDark.value ? "opacity-100" : "opacity-30"]
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([isDark.value ? "-translate-x-6" : "translate-x-0", "absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full backdrop-blur-md bg-white/80 dark:bg-slate-800/80 shadow-md shadow-black/20 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"])}"></span></button><div class="relative"><button aria-label="Notifikasi pengumuman" class="relative p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-white/10">`);
      _push(ssrRenderComponent(unref(BellIcon), { class: "w-6 h-6 text-gray-500 dark:text-white" }, null, _parent));
      if (unreadCount.value > 0) {
        _push(`<span class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold leading-none bg-red-500 text-white ring-2 ring-white dark:ring-[#0F172A] shadow-sm">${ssrInterpolate(unreadCount.value > 99 ? "99+" : unreadCount.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (showingNotifDropdown.value) {
        _push(`<div class="absolute -right-6 mt-2 z-30 w-80 rounded-xl overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-black/40"><div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10"><span class="flex items-center gap-2 font-semibold text-sm text-gray-700 dark:text-white">`);
        _push(ssrRenderComponent(unref(BellIcon), { class: "w-4 h-4 text-indigo-500" }, null, _parent));
        _push(` Pengumuman `);
        if (unreadCount.value > 0) {
          _push(`<span class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-red-500 text-white">${ssrInterpolate(unreadCount.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span><button class="text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"> Lihat Semua </button></div><ul class="divide-y divide-gray-100 dark:divide-white/10 max-h-72 overflow-y-auto"><!--[-->`);
        ssrRenderList(recentNotifs.value, (notif) => {
          _push(`<li class="flex items-center gap-3 px-4 py-3 cursor-pointer transition hover:bg-white/60 dark:hover:bg-white/5"><span class="${ssrRenderClass([isUnread(notif.id) ? "bg-indigo-500" : "bg-transparent", "shrink-0 w-2 h-2 rounded-full transition-colors"])}"></span><div class="flex-1 min-w-0"><p class="${ssrRenderClass([isUnread(notif.id) ? "font-semibold" : "font-medium", "text-sm text-gray-700 dark:text-white truncate"])}">${ssrInterpolate(notif.judul)}</p><p class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">${notif.pengumuman ?? ""}</p></div>`);
          _push(ssrRenderComponent(unref(ChevronRightIcon), { class: "shrink-0 w-4 h-4 text-gray-300 dark:text-gray-600" }, null, _parent));
          _push(`</li>`);
        });
        _push(`<!--]-->`);
        if (recentNotifs.value.length === 0) {
          _push(`<li class="px-4 py-8 text-center text-sm italic text-gray-400 dark:text-gray-500"> Tidak ada pengumuman. </li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul><div class="px-4 py-2.5 border-t border-gray-100 dark:border-white/10 text-center"><button class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition"> Buka Semua Pengumuman → </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="hidden sm:flex sm:items-center sm:ml-2">`);
      _push(ssrRenderComponent(_sfc_main$5, { align: "right" }, {
        trigger: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border border-transparent text-gray-500 dark:text-white bg-white dark:bg-[#0F172A] hover:text-gray-700 dark:hover:text-gray-300 transition"${_scopeId}>${ssrInterpolate(userName.value)} <svg class="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"${_scopeId}><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"${_scopeId}></path></svg></button>`);
          } else {
            return [
              createVNode("button", { class: "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border border-transparent text-gray-500 dark:text-white bg-white dark:bg-[#0F172A] hover:text-gray-700 dark:hover:text-gray-300 transition" }, [
                createTextVNode(toDisplayString(userName.value) + " ", 1),
                (openBlock(), createBlock("svg", {
                  class: "ml-2 h-4 w-4",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor"
                }, [
                  createVNode("path", {
                    "fill-rule": "evenodd",
                    d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                    "clip-rule": "evenodd"
                  })
                ]))
              ])
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$6, {
              href: _ctx.route("profile.edit")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Profile`);
                } else {
                  return [
                    createTextVNode("Profile")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              as: "button",
              onClick: logout
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Log Out`);
                } else {
                  return [
                    createTextVNode("Log Out")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$6, {
                href: _ctx.route("profile.edit")
              }, {
                default: withCtx(() => [
                  createTextVNode("Profile")
                ]),
                _: 1
              }, 8, ["href"]),
              createVNode(_sfc_main$6, {
                as: "button",
                onClick: logout
              }, {
                default: withCtx(() => [
                  createTextVNode("Log Out")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center sm:hidden"><button class="p-2 rounded-md text-gray-500 dark:text-white hover:text-gray-800 dark:hover:text-gray-300 transition">`);
      _push(ssrRenderComponent(unref(Cog6ToothIcon), {
        class: [showingNavigationDropdown.value ? "rotate-90" : "rotate-0", "h-6 w-6 transform transition-transform duration-300 ease-in-out"]
      }, null, _parent));
      _push(`</button></div></div></div></div>`);
      if (showingNavigationDropdown.value) {
        _push(`<div class="absolute right-3 top-14 z-50 w-56 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-xl shadow-black/10 dark:shadow-black/40 border border-white/40 dark:border-white/10 origin-top"><div class="py-2 flex flex-col gap-1">`);
        _push(ssrRenderComponent(_sfc_main$7, {
          href: dashboardHref.value,
          class: "flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-white/10 rounded-lg transition",
          onClick: ($event) => showingNavigationDropdown.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Dashboard `);
            } else {
              return [
                createTextVNode(" Dashboard ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_sfc_main$7, {
          href: _ctx.route("profile.edit"),
          class: "flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-white/10 rounded-lg transition",
          onClick: ($event) => showingNavigationDropdown.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Profile `);
            } else {
              return [
                createTextVNode(" Profile ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="border-t border-white/30 dark:border-white/10 px-2 py-2">`);
        _push(ssrRenderComponent(_sfc_main$7, {
          as: "button",
          class: "flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition",
          onClick: ($event) => {
            logout();
            showingNavigationDropdown.value = false;
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowRightOnRectangleIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(` Log Out `);
            } else {
              return [
                createVNode(unref(ArrowRightOnRectangleIcon), { class: "w-5 h-5" }),
                createTextVNode(" Log Out ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav><div class="flex flex-1 min-h-0">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(SidebarComponent.value), {
        isKejuruanGuru: unref(page).props.isKejuruanGuru,
        isWalas: unref(page).props.isWalas,
        class: "hidden md:block bg-white dark:bg-[#0F172A] border-r dark:border-gray-600 border-gray-300 pt-4 overflow-y-auto overflow-x-hidden"
      }, null), _parent);
      _push(`<div class="flex-1 px-4 sm:px-8 py-6 pb-20 bg-gray-100 dark:bg-[#020617] overflow-auto">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div><div class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#020617] backdrop-blur border-t border-gray-200 dark:border-gray-700 md:hidden safe-bottom"><div class="flex items-center justify-center h-14 px-4"><p class="text-xs font-medium text-gray-500 dark:text-gray-400 text-center"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} <span class="font-semibold text-gray-700 dark:text-gray-200">LMS NUSANTARA</span> · All rights reserved </p></div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/MenuLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
