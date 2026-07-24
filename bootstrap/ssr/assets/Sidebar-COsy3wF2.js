import Swal from "sweetalert2";
import { usePage, Link } from "@inertiajs/vue3";
import { onMounted, onUnmounted, computed, ref, mergeProps, useSSRContext, unref, withCtx, renderSlot, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderStyle, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { route } from "ziggy-js";
import { HomeIcon, UsersIcon, BuildingLibraryIcon, SquaresPlusIcon, ChevronDownIcon, ClipboardDocumentCheckIcon, AcademicCapIcon, CheckBadgeIcon, AdjustmentsHorizontalIcon, ChartBarIcon, BookOpenIcon, ClipboardDocumentListIcon, CalendarDaysIcon } from "@heroicons/vue/24/outline";
function ToastAlert() {
  const page = usePage();
  const getToastPosition = () => window.innerWidth < 768 ? "bottom-start" : "top-end";
  const getToastWidth = () => window.innerWidth < 768 ? "100%" : "auto";
  onMounted(() => {
    const flashSuccess = page.props.flash?.success;
    const flashError = page.props.flash?.error;
    if (flashSuccess) {
      Swal.fire({
        icon: "success",
        title: flashSuccess,
        toast: true,
        position: getToastPosition(),
        timer: 2e3,
        showConfirmButton: false,
        timerProgressBar: true,
        width: getToastWidth(),
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        }
      });
    }
    if (flashError) {
      Swal.fire({
        icon: "error",
        title: flashError,
        toast: true,
        position: getToastPosition(),
        timer: 2e3,
        showConfirmButton: false,
        timerProgressBar: true,
        width: getToastWidth(),
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        }
      });
    }
  });
  function success(message) {
    Swal.fire({
      icon: "success",
      title: message,
      toast: true,
      position: getToastPosition(),
      timer: 2e3,
      showConfirmButton: false,
      timerProgressBar: true,
      width: getToastWidth(),
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    });
  }
  function error(message) {
    Swal.fire({
      icon: "error",
      title: message,
      toast: true,
      position: getToastPosition(),
      timer: 2e3,
      showConfirmButton: false,
      timerProgressBar: true,
      width: getToastWidth(),
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    });
  }
  function confirm({
    title = "Are you sure?",
    text = "",
    confirmButtonText = "Yes, Delete",
    cancelButtonText = "Cancel"
  } = {}) {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor: "#dc2626"
    });
  }
  return { success, error, confirm };
}
const _sfc_main$6 = {
  __name: "Dropdown",
  __ssrInlineRender: true,
  props: {
    align: {
      type: String,
      default: "right"
    },
    width: {
      type: String,
      default: "48"
    },
    contentClasses: {
      type: String,
      default: "py-1 bg-white"
    }
  },
  setup(__props) {
    const props = __props;
    const closeOnEscape = (e) => {
      if (open.value && e.key === "Escape") {
        open.value = false;
      }
    };
    onMounted(() => document.addEventListener("keydown", closeOnEscape));
    onUnmounted(() => document.removeEventListener("keydown", closeOnEscape));
    const widthClass = computed(() => {
      return {
        48: "w-48"
      }[props.width.toString()];
    });
    const alignmentClasses = computed(() => {
      if (props.align === "left") {
        return "ltr:origin-top-left rtl:origin-top-right start-0";
      } else if (props.align === "right") {
        return "ltr:origin-top-right rtl:origin-top-left end-0";
      } else {
        return "origin-top";
      }
    });
    const open = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}><div>`);
      ssrRenderSlot(_ctx.$slots, "trigger", {}, null, _push, _parent);
      _push(`</div><div class="fixed inset-0 z-40" style="${ssrRenderStyle(open.value ? null : { display: "none" })}"></div><div class="${ssrRenderClass([[widthClass.value, alignmentClasses.value], "absolute z-50 mt-2 rounded-md shadow-lg"])}" style="${ssrRenderStyle([
        { "display": "none" },
        open.value ? null : { display: "none" }
      ])}"><div class="${ssrRenderClass([__props.contentClasses, "rounded-md ring-1 dark:bg-[#1e1b4b] ring-black ring-opacity-5"])}">`);
      ssrRenderSlot(_ctx.$slots, "content", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Dropdown.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "DropdownLink",
  __ssrInlineRender: true,
  props: {
    href: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: __props.href,
        class: "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 dark:bg-[#1e1b4b] dark:hover:bg-[#16133b] dark:hover:text-gray-100 dark:text-white focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/DropdownLink.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "ResponsiveNavLink",
  __ssrInlineRender: true,
  props: {
    href: {
      type: String,
      required: true
    },
    active: {
      type: Boolean
    }
  },
  setup(__props) {
    const props = __props;
    const classes = computed(
      () => props.active ? "block w-full ps-3 pe-4 py-2 border-l-4 border-indigo-400 text-start text-base font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out" : "block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: __props.href,
        class: classes.value
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ResponsiveNavLink.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: {
    tenant: Object
  },
  setup(__props) {
    const page = usePage();
    const isSmk = computed(
      () => (page.props.tenant?.school_level ?? "").toString().toLowerCase() === "smk"
    );
    const isWorkspace = computed(() => page.props.tenant?.product_type === "workspace");
    const labels = computed(() => isWorkspace.value ? {
      section: "Organization Setup",
      teacher: "Manager List",
      student: "Employee",
      subject: "Department List",
      classroom: "Team / Division"
    } : {
      section: "School Administration",
      teacher: "Teacher Directory",
      student: "Student Directory",
      subject: "Subject Directory",
      classroom: "Classroom Directory"
    });
    const menuItems = computed(() => [
      { name: "Admin Dashboard", routeName: "admin.dashboard", icon: HomeIcon },
      // { name: 'School Management', routeName: 'admin.profil_sekolah.index', icon: BuildingOffice2Icon },
      { name: "User Management", routeName: "admin.users.index", icon: UsersIcon },
      // School / Organization Management
      {
        name: labels.value.section,
        icon: BuildingLibraryIcon,
        children: [
          {
            name: labels.value.teacher,
            routeName: "admin.guru.index"
          },
          {
            name: labels.value.student,
            routeName: "admin.siswa.index"
          },
          {
            name: labels.value.subject,
            routeName: "admin.mapel.index"
          },
          // Kejuruan hanya muncul kalau tenant berjenjang SMK (tidak relevan untuk workspace)
          ...isSmk.value && !isWorkspace.value ? [{
            name: "Vocational Directory",
            routeName: "admin.kejuruan.index"
          }] : [],
          {
            name: labels.value.classroom,
            routeName: "admin.kelas.index"
          }
        ]
      },
      // Additional Features
      {
        name: "Additional Features",
        icon: SquaresPlusIcon,
        children: [
          // { name: 'Website Settings', routeName: 'admin.hero-slides', },
          {
            name: "Inbox / Messages",
            routeName: "pesan.index"
          },
          {
            name: "Announcements",
            routeName: "pengumuman.index"
          }
        ]
      }
    ]);
    const menuItemsWithActive = computed(() => {
      return menuItems.value.map((item) => {
        const href = item.routeName ? route(item.routeName) : null;
        const isActive = item.routeName ? route().current(item.routeName) : false;
        return { ...item, href, isActive };
      });
    });
    const initialDropdownState = computed(() => {
      const state = {};
      menuItems.value.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) => route().current(child.routeName)
          );
          state[item.name] = hasActiveChild;
        }
      });
      return state;
    });
    const dropdownOpen = ref({ ...initialDropdownState.value });
    const isDropdownOpen = (name) => dropdownOpen.value[name] ?? false;
    ref({});
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white w-auto min-h-screen border-gray-200" }, _attrs))}><div class="p-2 space-y-1"><!--[-->`);
      ssrRenderList(menuItemsWithActive.value, (item) => {
        _push(`<div>`);
        if (!item.children) {
          _push(`<div>`);
          _push(ssrRenderComponent(unref(Link), {
            href: item.href,
            class: ["flex w-full items-center gap-3 px-4 py-2 font-semibold text-gray-600 dark:text-white rounded dark:hover:!bg-[#1e1b4b] hover:bg-gray-100 transition", item.isActive ? "bg-gray-100 dark:bg-[#1e1b4b] dark:!text-gray-200" : ""]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), { class: "w-5 h-5" }, null), _parent2, _scopeId);
                _push2(`<span class="flex-1"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
              } else {
                return [
                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-5 h-5" })),
                  createVNode("span", { class: "flex-1" }, toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="relative"><button class="w-full flex items-center justify-between gap-3 px-4 py-2 font-semibold rounded hover:bg-gray-100 transition dark:hover:bg-[#1e1b4b] dark:text-white text-gray-600"><div class="flex items-center gap-3">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "w-5 h-5" }, null), _parent);
          _push(`<span>${ssrInterpolate(item.name)}</span></div>`);
          _push(ssrRenderComponent(unref(ChevronDownIcon), {
            class: ["w-4 h-4 transition-transform", isDropdownOpen(item.name) ? "rotate-180" : "rotate-0"]
          }, null, _parent));
          _push(`</button><div class="pl-12 mt-1 -space-y-1 overflow-hidden" style="${ssrRenderStyle(isDropdownOpen(item.name) ? null : { display: "none" })}"><!--[-->`);
          ssrRenderList(item.children, (child, idx) => {
            _push(ssrRenderComponent(unref(Link), {
              key: child.name,
              href: unref(route)(child.routeName),
              class: "relative block w-full pr-4 pl-2 py-1 dark:text-white text-gray-600"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="absolute left-0 top-4 h-2 w-2 rounded-full bg-gray-500 dark:bg-white"${_scopeId}></span><span class="${ssrRenderClass([unref(route)().current(child.routeName) ? "text-gray-600 dark:text-gray-100 font-semibold dark:bg-[#1e1b4b] bg-gray-100" : "dark:hover:bg-[#1e1b4b] hover:bg-gray-100", "relative w-full ml-4 block rounded transition px-2 py-1"])}"${_scopeId}>${ssrInterpolate(child.name)}</span>`);
                  if (idx < item.children.length - 1) {
                    _push2(`<span class="absolute left-1 top-5 z-20 dark:border-white -bottom-5 border-l border-gray-500"${_scopeId}></span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("span", { class: "absolute left-0 top-4 h-2 w-2 rounded-full bg-gray-500 dark:bg-white" }),
                    createVNode("span", {
                      class: ["relative w-full ml-4 block rounded transition px-2 py-1", unref(route)().current(child.routeName) ? "text-gray-600 dark:text-gray-100 font-semibold dark:bg-[#1e1b4b] bg-gray-100" : "dark:hover:bg-[#1e1b4b] hover:bg-gray-100"]
                    }, toDisplayString(child.name), 3),
                    idx < item.children.length - 1 ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "absolute left-1 top-5 z-20 dark:border-white -bottom-5 border-l border-gray-500"
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Admin/Sidebar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const RAW_MENU = [
      {
        name: "Proktor Dashboard",
        routeName: "proktor.dashboard",
        icon: HomeIcon
      },
      {
        name: "Student List",
        routeName: "proktor.peserta.index",
        icon: UsersIcon
      },
      {
        name: "Question Bank",
        routeName: "proktor.soal.index",
        icon: ClipboardDocumentCheckIcon
      },
      {
        name: "Exam Rooms",
        routeName: "proktor.ruangUjian.index",
        icon: AcademicCapIcon
      },
      {
        name: "Assessments",
        routeName: "proktor.nilai.index",
        icon: CheckBadgeIcon
      },
      {
        name: "Other Features",
        icon: AdjustmentsHorizontalIcon,
        children: [
          {
            name: "Inbox / Messages",
            routeName: "pesan.index"
          },
          {
            name: "Announcements",
            routeName: "pengumuman.index"
          }
        ]
      }
    ];
    const isActive = (routeName) => {
      try {
        return route().current(routeName);
      } catch {
        return false;
      }
    };
    const menuItems = computed(
      () => RAW_MENU.map((item) => ({
        ...item,
        href: item.routeName ? route(item.routeName) : null,
        isActive: item.routeName ? isActive(item.routeName) : false,
        hasActiveChild: item.children?.some((c) => isActive(c.routeName)) ?? false
      }))
    );
    const dropdownOpen = ref(
      Object.fromEntries(
        RAW_MENU.filter((i) => i.children).map((i) => [
          i.name,
          i.children.some((c) => isActive(c.routeName))
        ])
      )
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "flex flex-col h-full w-auto select-none" }, _attrs))}><div class="px-4 pb-4 border-b border-gray-100 dark:border-white/5"><div class="flex items-center gap-2.5"><div class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0"><svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"></path></svg></div><span class="text-sm font-bold text-gray-800 dark:text-white tracking-tight leading-none"> Smart Learning System </span></div></div><div class="flex-1 overflow-y-auto px-3 py-3 space-y-0.5"><!--[-->`);
      ssrRenderList(menuItems.value, (item) => {
        _push(`<!--[-->`);
        if (!item.children) {
          _push(ssrRenderComponent(unref(Link), {
            href: item.href,
            class: ["group relative flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150", item.isActive ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (item.isActive) {
                  _push2(`<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full"${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                  class: ["w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150", item.isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"]
                }, null), _parent2, _scopeId);
                _push2(`<span class="flex-1 truncate"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
              } else {
                return [
                  item.isActive ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                  })) : createCommentVNode("", true),
                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                    class: ["w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150", item.isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"]
                  }, null, 8, ["class"])),
                  createVNode("span", { class: "flex-1 truncate" }, toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<div class="space-y-0.5"><button class="${ssrRenderClass([item.hasActiveChild ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white", "group flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"])}">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), {
            class: ["w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150", item.hasActiveChild ? "text-gray-700 dark:text-gray-200" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"]
          }, null), _parent);
          _push(`<span class="flex-1 text-left truncate">${ssrInterpolate(item.name)}</span>`);
          _push(ssrRenderComponent(unref(ChevronDownIcon), {
            class: ["w-3.5 h-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-300", dropdownOpen.value[item.name] ? "rotate-180" : ""]
          }, null, _parent));
          _push(`</button><div class="overflow-hidden" style="${ssrRenderStyle(dropdownOpen.value[item.name] ? null : { display: "none" })}"><div class="ml-3 pl-4 border-l border-gray-200 dark:border-white/10 space-y-0.5 py-1"><!--[-->`);
          ssrRenderList(item.children, (child) => {
            _push(ssrRenderComponent(unref(Link), {
              key: child.routeName,
              href: unref(route)(child.routeName),
              class: ["flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150", isActive(child.routeName) ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white font-medium"]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="${ssrRenderClass([isActive(child.routeName) ? "bg-blue-500 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600", "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"])}"${_scopeId}></span> ${ssrInterpolate(child.name)}`);
                } else {
                  return [
                    createVNode("span", {
                      class: ["w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors", isActive(child.routeName) ? "bg-blue-500 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"]
                    }, null, 2),
                    createTextVNode(" " + toDisplayString(child.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div></div>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></nav>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Proktor/Sidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: {
    isKejuruanGuru: { type: Boolean, default: false },
    isWalas: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const unreadCount = computed(() => page.props.unreadAssignmentCount ?? 0);
    const menuItems = computed(() => {
      const items = [
        {
          name: "Teacher Dashboard",
          routeName: "guru.dashboard",
          icon: HomeIcon
        },
        {
          name: "Presention Analytics",
          routeName: "public.absensi.analytics",
          icon: ChartBarIcon
        },
        {
          name: "Attendance Recap",
          routeName: "guru.absensi.index",
          icon: ClipboardDocumentCheckIcon
        },
        {
          name: "Learning Materials",
          routeName: "guru.material.index",
          icon: BookOpenIcon
        },
        {
          name: "Assignment Rooms",
          routeName: "guru.assignment.index",
          icon: ClipboardDocumentListIcon,
          badge: unreadCount.value > 0 ? unreadCount.value : null
        },
        {
          name: "Daily Test / Exam",
          icon: AcademicCapIcon,
          children: [
            { name: "Exam Quiz List", routeName: "guru.soal.index" },
            // { name: 'Daily Quiz', routeName: 'guru.soal.index' },
            { name: "Assessment", routeName: "guru.NilaiUjian.index" }
          ]
        },
        {
          name: "Additional Features",
          icon: AdjustmentsHorizontalIcon,
          children: [
            { name: "Inbox Messages", routeName: "pesan.index" },
            { name: "Announcements", routeName: "pengumuman.index" }
          ]
        }
      ];
      if (props.isWalas) {
        items.splice(1, 0, {
          name: "Homeroom Teacher",
          routeName: "guru.walas.index",
          icon: UsersIcon
        });
      }
      if (props.isKejuruanGuru) {
        items.splice(props.isWalas ? 4 : 3, 0, {
          name: "Prakerin Journal",
          routeName: "guru.journal.index",
          icon: CalendarDaysIcon
        });
      }
      return items;
    });
    const resolvedItems = computed(
      () => menuItems.value.map((item) => ({
        ...item,
        href: item.routeName ? route(item.routeName) : null,
        isActive: item.routeName ? route().current(item.routeName) : false,
        hasActiveChild: item.children ? item.children.some((c) => route().current(c.routeName)) : false
      }))
    );
    const dropdownOpen = ref(
      Object.fromEntries(
        menuItems.value.filter((i) => i.children).map((i) => [
          i.name,
          i.children.some((c) => {
            try {
              return route().current(c.routeName);
            } catch {
              return false;
            }
          })
        ])
      )
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "flex flex-col h-full w-auto select-none" }, _attrs))}><div class="px-4 pb-4 border-b border-gray-100 dark:border-white/5"><div class="flex items-center gap-2.5"><div class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0"><svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"></path></svg></div><span class="text-sm font-bold text-gray-800 dark:text-white tracking-tight leading-none"> Smart Learning System </span></div></div><div class="flex-1 overflow-y-auto px-3 py-3 space-y-0.5"><!--[-->`);
      ssrRenderList(resolvedItems.value, (item) => {
        _push(`<!--[-->`);
        if (!item.children) {
          _push(ssrRenderComponent(unref(Link), {
            href: item.href,
            class: ["group relative flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150", item.isActive ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (item.isActive) {
                  _push2(`<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full"${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                  class: ["w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150", item.isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"]
                }, null), _parent2, _scopeId);
                _push2(`<span class="flex-1 truncate"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
                if (item.badge) {
                  _push2(`<span class="${ssrRenderClass([item.isActive ? "" : "bg-blue-600", "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold leading-none text-white bg-blue-600 dark:bg-blue-500 shadow-sm"])}"${ssrRenderAttr("title", `${item.badge} unread assignment${item.badge > 1 ? "s" : ""}`)}${_scopeId}>${ssrInterpolate(item.badge > 99 ? "99+" : item.badge)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  item.isActive ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                  })) : createCommentVNode("", true),
                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                    class: ["w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150", item.isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"]
                  }, null, 8, ["class"])),
                  createVNode("span", { class: "flex-1 truncate" }, toDisplayString(item.name), 1),
                  item.badge ? (openBlock(), createBlock("span", {
                    key: 1,
                    class: ["inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold leading-none text-white bg-blue-600 dark:bg-blue-500 shadow-sm", item.isActive ? "" : "bg-blue-600"],
                    title: `${item.badge} unread assignment${item.badge > 1 ? "s" : ""}`
                  }, toDisplayString(item.badge > 99 ? "99+" : item.badge), 11, ["title"])) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<div class="space-y-0.5"><button class="${ssrRenderClass([item.hasActiveChild ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white", "group flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"])}">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), {
            class: ["w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150", item.hasActiveChild ? "text-gray-700 dark:text-gray-200" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"]
          }, null), _parent);
          _push(`<span class="flex-1 text-left truncate">${ssrInterpolate(item.name)}</span>`);
          _push(ssrRenderComponent(unref(ChevronDownIcon), {
            class: ["w-3.5 h-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-300", dropdownOpen.value[item.name] ? "rotate-180" : "rotate-0"]
          }, null, _parent));
          _push(`</button><div class="overflow-hidden" style="${ssrRenderStyle(dropdownOpen.value[item.name] ? null : { display: "none" })}"><div class="ml-3 pl-4 border-l border-gray-200 dark:border-white/10 space-y-0.5 py-1"><!--[-->`);
          ssrRenderList(item.children, (child) => {
            _push(ssrRenderComponent(unref(Link), {
              key: child.routeName,
              href: unref(route)(child.routeName),
              class: ["flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150", unref(route)().current(child.routeName) ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white font-medium"]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="${ssrRenderClass([unref(route)().current(child.routeName) ? "bg-blue-500 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600", "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"])}"${_scopeId}></span> ${ssrInterpolate(child.name)}`);
                } else {
                  return [
                    createVNode("span", {
                      class: ["w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors", unref(route)().current(child.routeName) ? "bg-blue-500 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"]
                    }, null, 2),
                    createTextVNode(" " + toDisplayString(child.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div></div>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></nav>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Guru/Sidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    usePage();
    const menuItems = [
      { name: "Student Dashboard", routeName: "siswa.dashboard", icon: HomeIcon },
      // { name: 'Student Directory', routeName: 'siswa.absensi.index', icon: UsersIcon },
      { name: "Daily Attendance", routeName: "siswa.absensi.index", icon: UsersIcon },
      { name: "Learning Materials", routeName: "siswa.material.index", icon: ClipboardDocumentCheckIcon },
      { name: "Assignment Rooms", routeName: "siswa.assignment.index", icon: CheckBadgeIcon },
      { name: "Exam Rooms / Test", routeName: "siswa.ujian.token", icon: AcademicCapIcon }
      // Kalau nanti mau dropdown tinggal aktifkan
      // {
      //     name: 'Rekap Penilaian',
      //     icon: CheckBadgeIcon,
      //     children: [
      //         { name: 'Rekap Nilai Harian', routeName: 'siswa.dashboard' },
      //         { name: 'Rekap Nilai Ujian', routeName: 'siswa.dashboard' },
      //     ]
      // },
    ];
    const menuItemsWithActive = computed(() => {
      return menuItems.map((item) => {
        const href = item.routeName ? route(item.routeName) : null;
        const isActive = item.routeName ? route().current(item.routeName) : false;
        return { ...item, href, isActive };
      });
    });
    const initialDropdownState = computed(() => {
      const state = {};
      menuItems.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) => route().current(child.routeName)
          );
          state[item.name] = hasActiveChild;
        }
      });
      return state;
    });
    const dropdownOpen = ref({ ...initialDropdownState.value });
    const isDropdownOpen = (name) => dropdownOpen.value[name] ?? false;
    ref({});
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white w-auto min-h-screen border-gray-200" }, _attrs))}><div class="p-2 space-y-1"><!--[-->`);
      ssrRenderList(menuItemsWithActive.value, (item) => {
        _push(`<div>`);
        if (!item.children) {
          _push(`<div>`);
          _push(ssrRenderComponent(unref(Link), {
            href: item.href,
            class: ["flex w-full items-center gap-3 px-4 py-2 font-semibold text-gray-600 dark:text-white rounded dark:hover:!bg-[#1e1b4b] hover:bg-gray-100 transition", item.isActive ? "bg-gray-100 dark:bg-[#1e1b4b] dark:!text-gray-200" : ""]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), { class: "w-5 h-5" }, null), _parent2, _scopeId);
                _push2(`<span class="flex-1"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
              } else {
                return [
                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-5 h-5" })),
                  createVNode("span", { class: "flex-1" }, toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="relative"><button class="w-full flex items-center justify-between gap-3 px-4 py-2 font-semibold rounded hover:bg-gray-100 transition dark:hover:bg-[#1e1b4b] dark:text-white text-gray-600"><div class="flex items-center gap-3">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "w-5 h-5" }, null), _parent);
          _push(`<span>${ssrInterpolate(item.name)}</span></div>`);
          _push(ssrRenderComponent(unref(ChevronDownIcon), {
            class: ["w-4 h-4 transition-transform", isDropdownOpen(item.name) ? "rotate-180" : "rotate-0"]
          }, null, _parent));
          _push(`</button><div class="pl-12 mt-1 -space-y-1 overflow-hidden" style="${ssrRenderStyle(isDropdownOpen(item.name) ? null : { display: "none" })}"><!--[-->`);
          ssrRenderList(item.children, (child, idx) => {
            _push(ssrRenderComponent(unref(Link), {
              key: child.name,
              href: unref(route)(child.routeName),
              class: "relative block w-full pr-4 pl-2 py-1 dark:text-white text-gray-600"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="absolute left-0 top-4 h-2 w-2 rounded-full bg-gray-500 dark:bg-white"${_scopeId}></span><span class="${ssrRenderClass([unref(route)().current(child.routeName) ? "text-gray-600 dark:text-gray-100 font-semibold dark:bg-[#1e1b4b] bg-gray-100" : "dark:hover:bg-[#1e1b4b] hover:bg-gray-100", "relative w-full ml-4 block rounded transition px-2 py-1"])}"${_scopeId}>${ssrInterpolate(child.name)}</span>`);
                  if (idx < item.children.length - 1) {
                    _push2(`<span class="absolute left-1 top-5 z-20 dark:border-white -bottom-5 border-l border-gray-500"${_scopeId}></span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("span", { class: "absolute left-0 top-4 h-2 w-2 rounded-full bg-gray-500 dark:bg-white" }),
                    createVNode("span", {
                      class: ["relative w-full ml-4 block rounded transition px-2 py-1", unref(route)().current(child.routeName) ? "text-gray-600 dark:text-gray-100 font-semibold dark:bg-[#1e1b4b] bg-gray-100" : "dark:hover:bg-[#1e1b4b] hover:bg-gray-100"]
                    }, toDisplayString(child.name), 3),
                    idx < item.children.length - 1 ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "absolute left-1 top-5 z-20 dark:border-white -bottom-5 border-l border-gray-500"
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Siswa/Sidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  ToastAlert as T,
  _sfc_main as _,
  _sfc_main$1 as a,
  _sfc_main$2 as b,
  _sfc_main$3 as c,
  _sfc_main$6 as d,
  _sfc_main$5 as e,
  _sfc_main$4 as f
};
