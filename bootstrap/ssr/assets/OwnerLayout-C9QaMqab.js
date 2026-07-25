import { ref, computed, onMounted, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { usePage, useForm, Link } from "@inertiajs/vue3";
import { Squares2X2Icon, BuildingLibraryIcon, UsersIcon, DocumentCurrencyDollarIcon, ClockIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, Bars3Icon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "OwnerLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const sidebarOpen = ref(false);
    const pendingInvoiceCount = computed(() => page.props.pendingInvoiceCount ?? 0);
    const currentPath = computed(() => page.url.split("?")[0].split("#")[0]);
    useForm({});
    function isActive(href) {
      return currentPath.value === href;
    }
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-shell" }, _attrs))} data-v-8ac614fd>`);
      if (sidebarOpen.value) {
        _push(`<div class="sidebar-backdrop" data-v-8ac614fd></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<aside class="${ssrRenderClass([{ "sidebar-open": sidebarOpen.value }, "sidebar no-scrollbar"])}" data-v-8ac614fd><div class="sidebar-logo font-poppins" data-v-8ac614fd><img src="/images/logo-dark.webp" alt="Lumiverse" class="h-7 object-cover scale-150 sm:flex hidden" data-v-8ac614fd><span data-v-8ac614fd>LUMIVERSE</span></div><nav class="sidebar-nav" data-v-8ac614fd>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/lumiverse/dashboard",
        class: ["nav-item", { "nav-item-active": isActive("/lumiverse/dashboard") }],
        prefetch: "",
        onClick: ($event) => sidebarOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Squares2X2Icon), { class: "nav-icon" }, null, _parent2, _scopeId));
            _push2(` Dashboard Admin `);
          } else {
            return [
              createVNode(unref(Squares2X2Icon), { class: "nav-icon" }),
              createTextVNode(" Dashboard Admin ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/lumiverse/profil",
        class: ["nav-item", { "nav-item-active": currentPath.value.startsWith("/lumiverse/profil") }],
        prefetch: "",
        onClick: ($event) => sidebarOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(BuildingLibraryIcon), { class: "nav-icon" }, null, _parent2, _scopeId));
            _push2(` Lembaga / Institusi `);
          } else {
            return [
              createVNode(unref(BuildingLibraryIcon), { class: "nav-icon" }),
              createTextVNode(" Lembaga / Institusi ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/lumiverse/users",
        class: ["nav-item", { "nav-item-active": currentPath.value.startsWith("/lumiverse/users") }],
        prefetch: "",
        onClick: ($event) => sidebarOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(UsersIcon), { class: "nav-icon" }, null, _parent2, _scopeId));
            _push2(` Kelola Pengguna `);
          } else {
            return [
              createVNode(unref(UsersIcon), { class: "nav-icon" }),
              createTextVNode(" Kelola Pengguna ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/lumiverse/pricing",
        class: ["nav-item", { "nav-item-active": isActive("/lumiverse/pricing") }],
        prefetch: "",
        onClick: ($event) => sidebarOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DocumentCurrencyDollarIcon), { class: "nav-icon" }, null, _parent2, _scopeId));
            _push2(` Upgrade Premium `);
          } else {
            return [
              createVNode(unref(DocumentCurrencyDollarIcon), { class: "nav-icon" }),
              createTextVNode(" Upgrade Premium ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/lumiverse/subscription/history",
        class: ["nav-item", { "nav-item-active": isActive("/lumiverse/subscription/history") }],
        prefetch: "",
        onClick: ($event) => sidebarOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ClockIcon), { class: "nav-icon" }, null, _parent2, _scopeId));
            _push2(` Riwayat Pembayaran `);
            if (pendingInvoiceCount.value > 0) {
              _push2(`<span class="nav-badge" data-v-8ac614fd${_scopeId}>${ssrInterpolate(pendingInvoiceCount.value)}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(unref(ClockIcon), { class: "nav-icon" }),
              createTextVNode(" Riwayat Pembayaran "),
              pendingInvoiceCount.value > 0 ? (openBlock(), createBlock("span", {
                key: 0,
                class: "nav-badge"
              }, toDisplayString(pendingInvoiceCount.value), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="sidebar-footer" data-v-8ac614fd><a href="#teknis" class="nav-item" data-v-8ac614fd>`);
      _push(ssrRenderComponent(unref(Cog6ToothIcon), { class: "nav-icon" }, null, _parent));
      _push(` Panduan Pengguna </a><button class="nav-item nav-item-logout" data-v-8ac614fd>`);
      _push(ssrRenderComponent(unref(ArrowLeftOnRectangleIcon), { class: "nav-icon" }, null, _parent));
      _push(` Keluar Dari Aplikasi </button></div></aside><div class="main-col" data-v-8ac614fd><header class="topbar" data-v-8ac614fd><div class="topbar-content" data-v-8ac614fd>`);
      ssrRenderSlot(_ctx.$slots, "header", {}, () => {
        _push(`...`);
      }, _push, _parent);
      _push(`</div><button class="hamburger" aria-label="Buka menu" data-v-8ac614fd>`);
      _push(ssrRenderComponent(unref(Bars3Icon), { class: "hamburger-icon" }, null, _parent));
      _push(`</button></header><main class="content-scroll no-scrollbar" data-v-8ac614fd><div class="content-inner" data-v-8ac614fd>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/OwnerLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const OwnerLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8ac614fd"]]);
export {
  OwnerLayout as O
};
