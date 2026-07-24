import { ref, inject, onMounted, onUnmounted, mergeProps, unref, withCtx, createTextVNode, useSSRContext, provide, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link, Head } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { F as Footer } from "./LegalitasSection-WL5YB0Nn.js";
const _sfc_main$1 = {
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    usePage();
    const isScrolled = ref(false);
    const isMenuOpen = ref(false);
    const scrollRoot = inject("scrollRoot");
    const navItems = [
      { id: "hero", href: "#hero", label: "Beranda Utama" },
      // { id: 'about', href: '#about', label: 'Tentang Kami' },
      { id: "layanan", href: "#layanan", label: "Fitur Aplikasi" },
      { id: "cara-kerja", href: "#cara-kerja", label: "Dokumentasi" },
      // { id: 'harga', href: '#harga', label: 'Paket Harga' },
      // { id: 'testimonial', href: '#testimonial', label: 'Testimoni' },
      // { id: 'legalitas', href: '#legalitas', label: 'Legalitas' },
      { id: "kontak", href: "#kontak", label: "Kontak Layanan" }
    ];
    function handleScroll() {
      isScrolled.value = (scrollRoot?.value?.scrollTop ?? 0) > 40;
    }
    onMounted(() => {
      scrollRoot?.value?.addEventListener("scroll", handleScroll, { passive: true });
    });
    onUnmounted(() => {
      scrollRoot?.value?.removeEventListener("scroll", handleScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: ["navbar", { scrolled: isScrolled.value, "menu-open": isMenuOpen.value }],
        role: "navigation",
        "aria-label": "Main navigation"
      }, _attrs))} data-v-0b69ddb0><div class="navbar-bg" aria-hidden="true" data-v-0b69ddb0></div><div class="container" data-v-0b69ddb0><div class="navbar-content" data-v-0b69ddb0><a href="/" class="nav-logo" data-v-0b69ddb0><img src="/images/logo-dark.webp" alt="Lumiverse School" class="h-9 object-cover scale-150 flex mt-1" data-v-0b69ddb0><div class="text-2xl font-semibold logo-text-static" data-v-0b69ddb0> Lumiverse <span class="text-cyan" data-v-0b69ddb0>School</span></div></a><ul class="nav-links" role="list" data-v-0b69ddb0><li data-v-0b69ddb0><a href="#hero" data-v-0b69ddb0>Beranda</a></li><li data-v-0b69ddb0><a href="#layanan" data-v-0b69ddb0>Fitur &amp; Layanan</a></li><li data-v-0b69ddb0><a href="#cara-kerja" data-v-0b69ddb0>Dokumentasi</a></li><li data-v-0b69ddb0><a href="#kontak" data-v-0b69ddb0>Kontak Kami</a></li></ul><div class="nav-actions" data-v-0b69ddb0>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/lumiverse/login",
        class: "btn-ghost"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Log In`);
          } else {
            return [
              createTextVNode("Log In")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/registration",
        class: "btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Daftar Sekarang`);
          } else {
            return [
              createTextVNode("Daftar Sekarang")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button class="nav-toggle"${ssrRenderAttr("aria-expanded", isMenuOpen.value)} aria-label="Buka menu" data-v-0b69ddb0><span class="${ssrRenderClass([{ open: isMenuOpen.value }, "burger-line"])}" data-v-0b69ddb0></span><span class="${ssrRenderClass([{ open: isMenuOpen.value }, "burger-line"])}" data-v-0b69ddb0></span><span class="${ssrRenderClass([{ open: isMenuOpen.value }, "burger-line"])}" data-v-0b69ddb0></span></button></div><div class="${ssrRenderClass([{ open: isMenuOpen.value }, "mobile-menu"])}" data-v-0b69ddb0><ul class="mobile-links" data-v-0b69ddb0><!--[-->`);
      ssrRenderList(navItems, (item, i) => {
        _push(`<li style="${ssrRenderStyle(`--i: ${i}`)}" data-v-0b69ddb0><a class="mobile-link"${ssrRenderAttr("href", item.href)} data-v-0b69ddb0>${ssrInterpolate(item.label)}</a></li>`);
      });
      _push(`<!--]--></ul><div class="mobile-cta-group" data-v-0b69ddb0>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/lumiverse/login",
        class: "btn-mob-ghost",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Masuk`);
          } else {
            return [
              createTextVNode("Masuk")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/registration",
        class: "btn-mob-cta",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Daftar Sekarang`);
          } else {
            return [
              createTextVNode("Daftar Sekarang")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></nav>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/Navbar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0b69ddb0"]]);
const _sfc_main = {
  __name: "HomeLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const scrollRoot = ref(null);
    provide("scrollRoot", scrollRoot);
    onMounted(() => {
      document.documentElement.classList.add("lock-scroll");
      document.body.classList.add("lock-scroll");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: scrollRoot.value,
          // penting: root sekarang container, bukan viewport document
          threshold: 0.1,
          rootMargin: "0px 0px -40px 0px"
        }
      );
      scrollRoot.value?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    });
    onUnmounted(() => {
      document.documentElement.classList.remove("lock-scroll");
      document.body.classList.remove("lock-scroll");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="theme-color" content="#0b1120"${_scopeId}><meta name="msapplication-navbutton-color" content="#0b1120"${_scopeId}><meta name="apple-mobile-web-app-capable" content="yes"${_scopeId}><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"${_scopeId}><meta name="color-scheme" content="dark"${_scopeId}><link rel="preconnect" href="https://fonts.googleapis.com"${_scopeId}><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin${_scopeId}><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&amp;family=Inter:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap"${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "theme-color",
                content: "#0b1120"
              }),
              createVNode("meta", {
                name: "msapplication-navbutton-color",
                content: "#0b1120"
              }),
              createVNode("meta", {
                name: "apple-mobile-web-app-capable",
                content: "yes"
              }),
              createVNode("meta", {
                name: "apple-mobile-web-app-status-bar-style",
                content: "black-translucent"
              }),
              createVNode("meta", {
                name: "color-scheme",
                content: "dark"
              }),
              createVNode("link", {
                rel: "preconnect",
                href: "https://fonts.googleapis.com"
              }),
              createVNode("link", {
                rel: "preconnect",
                href: "https://fonts.gstatic.com",
                crossorigin: ""
              }),
              createVNode("link", {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="scroll-viewport no-scrollbar" id="scroll-root">`);
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      _push(`<main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/HomeLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
