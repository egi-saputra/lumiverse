import { computed, ref, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createTextVNode, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { u as useTenant } from "./useTenant-CDcYNPHx.js";
import { S as SubscriptionInvoiceModal } from "./SubscriptionInvoiceModal-DhKsRycN.js";
import { O as OwnerLayout } from "./OwnerLayout-C9QaMqab.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "@heroicons/vue/24/outline";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    owner: Object,
    tenant: Object,
    pendingOrderId: String
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const tenantName = computed(() => page.props.tenant?.name ?? "Lumi Platforms, Inc");
    const { isWorkspace } = useTenant(computed(() => props.tenant));
    const planBadgeStyle = computed(() => {
      if (!props.tenant.plan_key || props.tenant.plan_key === "trial") return null;
      const accent = props.tenant.plan_accent ?? "#60a5fa";
      const hex = accent.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const textColor = luminance > 0.5 ? "#0a0f1e" : "#ffffff";
      return {
        bg: `linear-gradient(135deg, ${accent}ee 0%, ${accent}aa 100%)`,
        color: textColor,
        border: `${accent}66`,
        shadow: `${accent}44`
      };
    });
    function isIpOrLocalhost(hostname) {
      return hostname === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    }
    const centralDomain = computed(() => {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : "";
      if (isIpOrLocalhost(hostname)) return `${hostname}${port}`;
      return page.props.centralDomain ?? hostname;
    });
    const tenantAppUrl = computed(() => {
      if (!props.tenant.subdomain) return null;
      const protocol = window.location.protocol;
      const port = window.location.port ? `:${window.location.port}` : "";
      const hostname = window.location.hostname;
      if (isIpOrLocalhost(hostname)) {
        return `${protocol}//${props.tenant.subdomain}.localhost${port}/`;
      }
      const base = page.props.centralDomain ?? hostname;
      return `${protocol}//${props.tenant.subdomain}.${base}${port}/`;
    });
    const statusClass = computed(() => {
      if (props.tenant.status === "Aktif") return "status-active";
      if (props.tenant.status === "Expired") return "status-expired";
      return "status-disabled";
    });
    const expiresAtFormatted = computed(() => {
      if (!props.tenant.expires_at) return "-";
      const d = new Date(props.tenant.expires_at);
      return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    });
    const welcomeSub = computed(() => isWorkspace.value ? "Kelola data perusahaan / organisasi-mu dengan mudah dan cepat di sini!" : "Kelola data informasi sekolah / lembaga pendidikan-mu dengan mudah dan cepat di sini!");
    const idRowLabel = computed(() => isWorkspace.value ? "ID Perusahaan / Organisasi" : "ID Lembaga / Institusi");
    const appCardLabel = computed(() => isWorkspace.value ? "Aplikasi Workspace / Produktivitas Tim" : "Aplikasi LMS / Digitalisasi Sekolah");
    const appCardDesc = computed(() => isWorkspace.value ? "Masuk ke aplikasi Workspace untuk mengelola data karyawan, tim, proyek, tugas, laporan dan administrasi lainnya pada perusahaan / organisasi yang Anda kelola." : "Masuk ke aplikasi LMS untuk mengelola data guru, kelas, siswa, materi, tugas, ujian dan administrasi lainnya pada satuan pendidikan yang Anda kelola.");
    const appLinkLabel = computed(() => isWorkspace.value ? "Masuk ke Workspace →" : "Masuk ke LMS →");
    const appUrlRowLabel = computed(() => isWorkspace.value ? "URL Workspace" : "URL LMS");
    const showPayModal = ref(false);
    const payModalCalc = ref(null);
    const payModalLoading = ref(false);
    const paySubmitting = ref(false);
    function csrfToken() {
      return page.props.csrf_token ?? document.querySelector('meta[name="csrf-token"]')?.content ?? "";
    }
    async function openPayModal() {
      if (!props.pendingOrderId) return;
      payModalCalc.value = null;
      payModalLoading.value = true;
      showPayModal.value = true;
      try {
        const res = await fetch(route("owner.subscription.order-preview", props.pendingOrderId), {
          headers: { "Accept": "application/json" }
        });
        payModalCalc.value = await res.json();
      } catch (e) {
        payModalCalc.value = null;
      } finally {
        payModalLoading.value = false;
      }
    }
    function closePayModal() {
      showPayModal.value = false;
      payModalCalc.value = null;
    }
    async function confirmPay() {
      if (!props.pendingOrderId || paySubmitting.value) return;
      paySubmitting.value = true;
      try {
        const res = await fetch(route("owner.subscription.retry", props.pendingOrderId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken(),
            "Accept": "application/json"
          }
        });
        const data = await res.json();
        if (data.action === "already_paid") {
          closePayModal();
          router.reload();
          return;
        }
        if (data.action === "failed") {
          closePayModal();
          alert("Transaksi ini sudah kedaluwarsa/dibatalkan.");
          router.reload();
          return;
        }
        if (data.action === "pay" && data.snap_token) {
          const orderId = props.pendingOrderId;
          closePayModal();
          window.snap.pay(data.snap_token, {
            onSuccess: () => {
              window.location.href = route("owner.subscription.finish") + "?order_id=" + orderId;
            },
            onPending: () => router.reload(),
            onError: () => alert("Pembayaran gagal. Silakan coba lagi."),
            onClose: () => {
              window.location.href = route("owner.subscription.finish") + "?order_id=" + orderId;
            }
          });
        }
      } catch (e) {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        paySubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent));
      _push(ssrRenderComponent(OwnerLayout, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="topbar-title uppercase" data-v-43b6e919${_scopeId}>${ssrInterpolate(tenantName.value)}</h1>`);
          } else {
            return [
              createVNode("h1", { class: "topbar-title uppercase" }, toDisplayString(tenantName.value), 1)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex sm:flex-row flex-col sm:mb-3 mb-6 w-full justify-between items-start" data-v-43b6e919${_scopeId}><div data-v-43b6e919${_scopeId}><div class="header-row" data-v-43b6e919${_scopeId}><h1 class="welcome-title" data-v-43b6e919${_scopeId}>Welcome Back, ${ssrInterpolate(__props.owner.name)} 👋</h1></div><p class="welcome-sub mb-gap sm:flex hidden" data-v-43b6e919${_scopeId}>${ssrInterpolate(welcomeSub.value)}</p></div><div class="flex justify-end sm:w-auto w-full sm:mr-10 mr-0" data-v-43b6e919${_scopeId}>`);
            if (!planBadgeStyle.value) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("owner.pricing"),
                class: "upgrade-badge",
                prefetch: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span style="${ssrRenderStyle({ "width": "24px", "height": "24px", "background": "rgba(0,0,0,0.12)", "border-radius": "50%", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}" data-v-43b6e919${_scopeId2}> + </span><span style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1px", "line-height": "1" })}" data-v-43b6e919${_scopeId2}><span style="${ssrRenderStyle({ "font-size": "0.6rem", "font-weight": "600", "opacity": "0.65", "letter-spacing": "0.06em", "text-transform": "uppercase" })}" data-v-43b6e919${_scopeId2}>Akses Fitur Lengkap</span><span style="${ssrRenderStyle({ "font-size": "0.8rem", "font-weight": "800" })}" data-v-43b6e919${_scopeId2}>Upgrade ke Premium</span></span>`);
                  } else {
                    return [
                      createVNode("span", { style: { "width": "24px", "height": "24px", "background": "rgba(0,0,0,0.12)", "border-radius": "50%", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" } }, " + "),
                      createVNode("span", { style: { "display": "flex", "flex-direction": "column", "gap": "1px", "line-height": "1" } }, [
                        createVNode("span", { style: { "font-size": "0.6rem", "font-weight": "600", "opacity": "0.65", "letter-spacing": "0.06em", "text-transform": "uppercase" } }, "Akses Fitur Lengkap"),
                        createVNode("span", { style: { "font-size": "0.8rem", "font-weight": "800" } }, "Upgrade ke Premium")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("owner.pricing"),
                class: "upgrade-badge",
                prefetch: "",
                style: {
                  background: planBadgeStyle.value.bg,
                  color: planBadgeStyle.value.color,
                  border: `1px solid ${planBadgeStyle.value.border}`,
                  boxShadow: `0 1px 0 rgba(255,255,255,0.18) inset, 0 2px 8px ${planBadgeStyle.value.shadow}`
                }
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="text-gray-900" style="${ssrRenderStyle({ "width": "24px", "height": "24px", "background": "rgba(0,0,0,0.10)", "border-radius": "50%", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}" data-v-43b6e919${_scopeId2}> ✦ </span><span style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "1px", "line-height": "1" })}" data-v-43b6e919${_scopeId2}><span class="text-gray-900" style="${ssrRenderStyle({ "font-size": "0.8rem", "font-weight": "800" })}" data-v-43b6e919${_scopeId2}>Premium ${ssrInterpolate(__props.tenant.plan)}</span></span>`);
                  } else {
                    return [
                      createVNode("span", {
                        class: "text-gray-900",
                        style: { "width": "24px", "height": "24px", "background": "rgba(0,0,0,0.10)", "border-radius": "50%", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" }
                      }, " ✦ "),
                      createVNode("span", { style: { "display": "flex", "flex-direction": "column", "gap": "1px", "line-height": "1" } }, [
                        createVNode("span", {
                          class: "text-gray-900",
                          style: { "font-size": "0.8rem", "font-weight": "800" }
                        }, "Premium " + toDisplayString(__props.tenant.plan), 1)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`</div></div><div class="cards-grid-2 mb-gap" data-v-43b6e919${_scopeId}><div class="info-card" data-v-43b6e919${_scopeId}><div class="info-card-header" data-v-43b6e919${_scopeId}><span class="info-card-label" data-v-43b6e919${_scopeId}>Status <span class="sm:inline-flex hidden" data-v-43b6e919${_scopeId}>Penggunaan Aplikasi</span></span><span class="${ssrRenderClass([statusClass.value, "status-pill"])}" data-v-43b6e919${_scopeId}>${ssrInterpolate(__props.tenant.status)}</span></div><div class="info-card-title" data-v-43b6e919${_scopeId}>${ssrInterpolate(__props.tenant.name)}</div><div class="info-card-row" data-v-43b6e919${_scopeId}><span data-v-43b6e919${_scopeId}>${ssrInterpolate(idRowLabel.value)}</span><strong class="mono" data-v-43b6e919${_scopeId}>${ssrInterpolate(__props.tenant.code)}</strong></div><div class="info-card-row" data-v-43b6e919${_scopeId}><span data-v-43b6e919${_scopeId}>Jumlah Pengguna</span><strong data-v-43b6e919${_scopeId}>${ssrInterpolate(__props.tenant.user_count)} / ${ssrInterpolate(__props.tenant.max_users ?? "∞")}</strong></div><div class="info-card-row" data-v-43b6e919${_scopeId}><span data-v-43b6e919${_scopeId}>Paket Yang Digunakan</span><strong class="capitalize" data-v-43b6e919${_scopeId}>${ssrInterpolate(__props.tenant.plan ?? "Free")}</strong></div>`);
            if (__props.tenant.days_left !== null) {
              _push2(`<div class="info-card-row" data-v-43b6e919${_scopeId}><span data-v-43b6e919${_scopeId}>Sisa Masa Aktif</span><span class="days-left-value" data-v-43b6e919${_scopeId}>`);
              if (__props.pendingOrderId) {
                _push2(`<button class="btn-pay-mini" data-v-43b6e919${_scopeId}> 💳 Bayar Untuk Perpanjang </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<strong class="${ssrRenderClass(__props.tenant.days_left <= 7 ? "text-warn" : "")}" data-v-43b6e919${_scopeId}>${ssrInterpolate(__props.tenant.days_left >= 0 ? `${__props.tenant.days_left} hari` : "Expired")}</strong></span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.tenant.expires_at) {
              _push2(`<div class="info-card-row" data-v-43b6e919${_scopeId}><span data-v-43b6e919${_scopeId}>Masa Berlaku Hingga</span><strong data-v-43b6e919${_scopeId}>${ssrInterpolate(expiresAtFormatted.value)}</strong></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="info-card info-card-highlight" data-v-43b6e919${_scopeId}><div class="info-card-label" data-v-43b6e919${_scopeId}>${ssrInterpolate(appCardLabel.value)}</div><p class="lms-desc" data-v-43b6e919${_scopeId}>${ssrInterpolate(appCardDesc.value)}</p>`);
            if (tenantAppUrl.value) {
              _push2(`<a${ssrRenderAttr("href", tenantAppUrl.value)} target="_blank" class="btn-hero lms-link" data-v-43b6e919${_scopeId}>${ssrInterpolate(appLinkLabel.value)}</a>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="subdomain-hint" data-v-43b6e919${_scopeId}>${ssrInterpolate(__props.tenant.subdomain)}.${ssrInterpolate(centralDomain.value)}</p></div></div><div class="section-title" data-v-43b6e919${_scopeId}>Info Teknis Lainnya</div><div class="info-card" data-v-43b6e919${_scopeId}><div class="two-col-grid" data-v-43b6e919${_scopeId}><div class="info-card-row" data-v-43b6e919${_scopeId}><span data-v-43b6e919${_scopeId}>ID Database</span><strong class="mono" data-v-43b6e919${_scopeId}>${ssrInterpolate(__props.tenant.subdomain)} (${ssrInterpolate(__props.tenant.code)})</strong></div><div class="info-card-row" data-v-43b6e919${_scopeId}><span data-v-43b6e919${_scopeId}>${ssrInterpolate(appUrlRowLabel.value)}</span>`);
            if (tenantAppUrl.value) {
              _push2(`<a${ssrRenderAttr("href", tenantAppUrl.value)} target="_blank" class="link-cyan mono" data-v-43b6e919${_scopeId}>${ssrInterpolate(__props.tenant.subdomain)}.${ssrInterpolate(centralDomain.value)}</a>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
            _push2(ssrRenderComponent(SubscriptionInvoiceModal, {
              show: showPayModal.value,
              loading: payModalLoading.value,
              submitting: paySubmitting.value,
              calc: payModalCalc.value,
              "plan-name": payModalCalc.value?.plan_name,
              "accent-color": payModalCalc.value?.plan_accent,
              onClose: closePayModal,
              onConfirm: confirmPay
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "flex sm:flex-row flex-col sm:mb-3 mb-6 w-full justify-between items-start" }, [
                createVNode("div", null, [
                  createVNode("div", { class: "header-row" }, [
                    createVNode("h1", { class: "welcome-title" }, "Welcome Back, " + toDisplayString(__props.owner.name) + " 👋", 1)
                  ]),
                  createVNode("p", { class: "welcome-sub mb-gap sm:flex hidden" }, toDisplayString(welcomeSub.value), 1)
                ]),
                createVNode("div", { class: "flex justify-end sm:w-auto w-full sm:mr-10 mr-0" }, [
                  !planBadgeStyle.value ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: _ctx.route("owner.pricing"),
                    class: "upgrade-badge",
                    prefetch: ""
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { style: { "width": "24px", "height": "24px", "background": "rgba(0,0,0,0.12)", "border-radius": "50%", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" } }, " + "),
                      createVNode("span", { style: { "display": "flex", "flex-direction": "column", "gap": "1px", "line-height": "1" } }, [
                        createVNode("span", { style: { "font-size": "0.6rem", "font-weight": "600", "opacity": "0.65", "letter-spacing": "0.06em", "text-transform": "uppercase" } }, "Akses Fitur Lengkap"),
                        createVNode("span", { style: { "font-size": "0.8rem", "font-weight": "800" } }, "Upgrade ke Premium")
                      ])
                    ]),
                    _: 1
                  }, 8, ["href"])) : (openBlock(), createBlock(unref(Link), {
                    key: 1,
                    href: _ctx.route("owner.pricing"),
                    class: "upgrade-badge",
                    prefetch: "",
                    style: {
                      background: planBadgeStyle.value.bg,
                      color: planBadgeStyle.value.color,
                      border: `1px solid ${planBadgeStyle.value.border}`,
                      boxShadow: `0 1px 0 rgba(255,255,255,0.18) inset, 0 2px 8px ${planBadgeStyle.value.shadow}`
                    }
                  }, {
                    default: withCtx(() => [
                      createVNode("span", {
                        class: "text-gray-900",
                        style: { "width": "24px", "height": "24px", "background": "rgba(0,0,0,0.10)", "border-radius": "50%", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" }
                      }, " ✦ "),
                      createVNode("span", { style: { "display": "flex", "flex-direction": "column", "gap": "1px", "line-height": "1" } }, [
                        createVNode("span", {
                          class: "text-gray-900",
                          style: { "font-size": "0.8rem", "font-weight": "800" }
                        }, "Premium " + toDisplayString(__props.tenant.plan), 1)
                      ])
                    ]),
                    _: 1
                  }, 8, ["href", "style"]))
                ])
              ]),
              createVNode("div", { class: "cards-grid-2 mb-gap" }, [
                createVNode("div", { class: "info-card" }, [
                  createVNode("div", { class: "info-card-header" }, [
                    createVNode("span", { class: "info-card-label" }, [
                      createTextVNode("Status "),
                      createVNode("span", { class: "sm:inline-flex hidden" }, "Penggunaan Aplikasi")
                    ]),
                    createVNode("span", {
                      class: ["status-pill", statusClass.value]
                    }, toDisplayString(__props.tenant.status), 3)
                  ]),
                  createVNode("div", { class: "info-card-title" }, toDisplayString(__props.tenant.name), 1),
                  createVNode("div", { class: "info-card-row" }, [
                    createVNode("span", null, toDisplayString(idRowLabel.value), 1),
                    createVNode("strong", { class: "mono" }, toDisplayString(__props.tenant.code), 1)
                  ]),
                  createVNode("div", { class: "info-card-row" }, [
                    createVNode("span", null, "Jumlah Pengguna"),
                    createVNode("strong", null, toDisplayString(__props.tenant.user_count) + " / " + toDisplayString(__props.tenant.max_users ?? "∞"), 1)
                  ]),
                  createVNode("div", { class: "info-card-row" }, [
                    createVNode("span", null, "Paket Yang Digunakan"),
                    createVNode("strong", { class: "capitalize" }, toDisplayString(__props.tenant.plan ?? "Free"), 1)
                  ]),
                  __props.tenant.days_left !== null ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "info-card-row"
                  }, [
                    createVNode("span", null, "Sisa Masa Aktif"),
                    createVNode("span", { class: "days-left-value" }, [
                      __props.pendingOrderId ? (openBlock(), createBlock("button", {
                        key: 0,
                        class: "btn-pay-mini",
                        onClick: openPayModal
                      }, " 💳 Bayar Untuk Perpanjang ")) : createCommentVNode("", true),
                      createVNode("strong", {
                        class: __props.tenant.days_left <= 7 ? "text-warn" : ""
                      }, toDisplayString(__props.tenant.days_left >= 0 ? `${__props.tenant.days_left} hari` : "Expired"), 3)
                    ])
                  ])) : createCommentVNode("", true),
                  __props.tenant.expires_at ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "info-card-row"
                  }, [
                    createVNode("span", null, "Masa Berlaku Hingga"),
                    createVNode("strong", null, toDisplayString(expiresAtFormatted.value), 1)
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "info-card info-card-highlight" }, [
                  createVNode("div", { class: "info-card-label" }, toDisplayString(appCardLabel.value), 1),
                  createVNode("p", { class: "lms-desc" }, toDisplayString(appCardDesc.value), 1),
                  tenantAppUrl.value ? (openBlock(), createBlock("a", {
                    key: 0,
                    href: tenantAppUrl.value,
                    target: "_blank",
                    class: "btn-hero lms-link"
                  }, toDisplayString(appLinkLabel.value), 9, ["href"])) : createCommentVNode("", true),
                  createVNode("p", { class: "subdomain-hint" }, toDisplayString(__props.tenant.subdomain) + "." + toDisplayString(centralDomain.value), 1)
                ])
              ]),
              createVNode("div", { class: "section-title" }, "Info Teknis Lainnya"),
              createVNode("div", { class: "info-card" }, [
                createVNode("div", { class: "two-col-grid" }, [
                  createVNode("div", { class: "info-card-row" }, [
                    createVNode("span", null, "ID Database"),
                    createVNode("strong", { class: "mono" }, toDisplayString(__props.tenant.subdomain) + " (" + toDisplayString(__props.tenant.code) + ")", 1)
                  ]),
                  createVNode("div", { class: "info-card-row" }, [
                    createVNode("span", null, toDisplayString(appUrlRowLabel.value), 1),
                    tenantAppUrl.value ? (openBlock(), createBlock("a", {
                      key: 0,
                      href: tenantAppUrl.value,
                      target: "_blank",
                      class: "link-cyan mono"
                    }, toDisplayString(__props.tenant.subdomain) + "." + toDisplayString(centralDomain.value), 9, ["href"])) : createCommentVNode("", true)
                  ])
                ])
              ]),
              createVNode(SubscriptionInvoiceModal, {
                show: showPayModal.value,
                loading: payModalLoading.value,
                submitting: paySubmitting.value,
                calc: payModalCalc.value,
                "plan-name": payModalCalc.value?.plan_name,
                "accent-color": payModalCalc.value?.plan_accent,
                onClose: closePayModal,
                onConfirm: confirmPay
              }, null, 8, ["show", "loading", "submitting", "calc", "plan-name", "accent-color"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Owner/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-43b6e919"]]);
export {
  Dashboard as default
};
