import { computed, ref, unref, withCtx, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, createVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { S as SubscriptionInvoiceModal } from "./SubscriptionInvoiceModal-DhKsRycN.js";
import { O as OwnerLayout } from "./OwnerLayout-C9QaMqab.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "@heroicons/vue/24/outline";
const _sfc_main = {
  __name: "SubscriptionHistory",
  __ssrInlineRender: true,
  props: {
    orders: Object
    // hasil paginate() Laravel: { data: [...], links: [...], meta / current_page dst }
  },
  setup(__props) {
    const page = usePage();
    const flash = computed(() => page.props.flash ?? {});
    const showModal = ref(false);
    const modalCalc = ref(null);
    const modalLoading = ref(false);
    const submitting = ref(false);
    const activeOrderId = ref(null);
    const statusMap = {
      paid: { label: "✓ Lunas", class: "badge-paid" },
      pending: { label: "⏳ Menunggu", class: "badge-pending" },
      failed: { label: "✗ Gagal", class: "badge-failed" }
    };
    function statusInfo(status) {
      return statusMap[status] ?? { label: status, class: "badge-pending" };
    }
    function formatPrice(amount) {
      if (amount === null || amount === void 0) return "-";
      return "Rp " + new Intl.NumberFormat("id-ID").format(amount);
    }
    function formatDate(dateStr) {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }
    function csrfToken() {
      return page.props.csrf_token ?? document.querySelector('meta[name="csrf-token"]')?.content ?? "";
    }
    async function openPayModal(orderId) {
      activeOrderId.value = orderId;
      modalCalc.value = null;
      modalLoading.value = true;
      showModal.value = true;
      try {
        const res = await fetch(route("owner.subscription.order-preview", orderId), {
          headers: { "Accept": "application/json" }
        });
        modalCalc.value = await res.json();
      } catch (e) {
        modalCalc.value = null;
      } finally {
        modalLoading.value = false;
      }
    }
    function closeModal() {
      showModal.value = false;
      modalCalc.value = null;
      activeOrderId.value = null;
    }
    async function confirmPay() {
      if (!activeOrderId.value || submitting.value) return;
      submitting.value = true;
      try {
        const res = await fetch(route("owner.subscription.retry", activeOrderId.value), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken(),
            "Accept": "application/json"
          }
        });
        const data = await res.json();
        if (data.action === "already_paid") {
          closeModal();
          router.visit(route("owner.subscription.invoice", activeOrderId.value));
          return;
        }
        if (data.action === "failed") {
          closeModal();
          alert("Transaksi ini sudah kedaluwarsa/dibatalkan.");
          router.reload();
          return;
        }
        if (data.action === "pay" && data.snap_token) {
          const orderId = activeOrderId.value;
          closeModal();
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
        submitting.value = false;
      }
    }
    function cancelOrder(orderId) {
      if (!confirm("Batalkan pesanan ini? Tindakan ini tidak bisa dibatalkan.")) return;
      router.post(route("owner.subscription.cancel-order", orderId), {}, { preserveScroll: true });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Billing History" }, null, _parent));
      _push(ssrRenderComponent(OwnerLayout, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="topbar-title" data-v-f8579ae5${_scopeId}>My Billing History</h1>`);
          } else {
            return [
              createVNode("h1", { class: "topbar-title" }, "My Billing History")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (flash.value.success) {
              _push2(`<div class="flash flash-success" data-v-f8579ae5${_scopeId}>${ssrInterpolate(flash.value.success)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (flash.value.warning) {
              _push2(`<div class="flash flash-warning" data-v-f8579ae5${_scopeId}>${ssrInterpolate(flash.value.warning)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (flash.value.info) {
              _push2(`<div class="flash flash-info" data-v-f8579ae5${_scopeId}>${ssrInterpolate(flash.value.info)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="history-card overflow-x-auto" data-v-f8579ae5${_scopeId}>`);
            if (__props.orders.data.length) {
              _push2(`<table class="history-table whitespace-nowrap" data-v-f8579ae5${_scopeId}><thead data-v-f8579ae5${_scopeId}><tr data-v-f8579ae5${_scopeId}><th data-v-f8579ae5${_scopeId}># Invoice</th><th data-v-f8579ae5${_scopeId}>Plan</th><th data-v-f8579ae5${_scopeId}>Subscription</th><th data-v-f8579ae5${_scopeId}>Invoice Date</th><th data-v-f8579ae5${_scopeId}>Total</th><th data-v-f8579ae5${_scopeId}>Status</th><th data-v-f8579ae5${_scopeId}></th></tr></thead><tbody data-v-f8579ae5${_scopeId}><!--[-->`);
              ssrRenderList(__props.orders.data, (order) => {
                _push2(`<tr data-v-f8579ae5${_scopeId}><td class="mono" data-v-f8579ae5${_scopeId}>${ssrInterpolate(order.order_id)}</td><td data-v-f8579ae5${_scopeId}>${ssrInterpolate(order.plan_name ?? "-")}</td><td data-v-f8579ae5${_scopeId}>${ssrInterpolate(order.billing_cycle === "yearly" ? "Yearly" : "Monthly")}</td><td data-v-f8579ae5${_scopeId}>${ssrInterpolate(formatDate(order.created_at))}</td><td data-v-f8579ae5${_scopeId}>${ssrInterpolate(formatPrice(order.amount))}</td><td data-v-f8579ae5${_scopeId}><span class="${ssrRenderClass([statusInfo(order.status).class, "badge"])}" data-v-f8579ae5${_scopeId}>${ssrInterpolate(statusInfo(order.status).label)}</span></td><td data-v-f8579ae5${_scopeId}>`);
                if (order.status === "pending") {
                  _push2(`<div class="action-group" data-v-f8579ae5${_scopeId}><button class="pay-btn" data-v-f8579ae5${_scopeId}>💳 Bayar</button><button class="cancel-btn" data-v-f8579ae5${_scopeId}>Batalkan</button></div>`);
                } else {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("owner.subscription.invoice", order.order_id),
                    class: "view-link"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(` Detail → `);
                      } else {
                        return [
                          createTextVNode(" Detail → ")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                }
                _push2(`</td></tr>`);
              });
              _push2(`<!--]--></tbody></table>`);
            } else {
              _push2(`<div class="history-empty" data-v-f8579ae5${_scopeId}> Belum ada transaksi. Silakan pilih paket di halaman Upgrade Premium. </div>`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(SubscriptionInvoiceModal, {
              show: showModal.value,
              loading: modalLoading.value,
              submitting: submitting.value,
              calc: modalCalc.value,
              "plan-name": modalCalc.value?.plan_name,
              "accent-color": modalCalc.value?.plan_accent,
              onClose: closeModal,
              onConfirm: confirmPay
            }, null, _parent2, _scopeId));
            if (__props.orders.links && __props.orders.links.length > 3) {
              _push2(`<div class="pagination" data-v-f8579ae5${_scopeId}><!--[-->`);
              ssrRenderList(__props.orders.links, (link, i) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: i,
                  href: link.url || "",
                  class: ["page-btn", { "page-btn-active": link.active, "page-btn-disabled": !link.url }],
                  "preserve-scroll": ""
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              flash.value.success ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flash flash-success"
              }, toDisplayString(flash.value.success), 1)) : createCommentVNode("", true),
              flash.value.warning ? (openBlock(), createBlock("div", {
                key: 1,
                class: "flash flash-warning"
              }, toDisplayString(flash.value.warning), 1)) : createCommentVNode("", true),
              flash.value.info ? (openBlock(), createBlock("div", {
                key: 2,
                class: "flash flash-info"
              }, toDisplayString(flash.value.info), 1)) : createCommentVNode("", true),
              createVNode("div", { class: "history-card overflow-x-auto" }, [
                __props.orders.data.length ? (openBlock(), createBlock("table", {
                  key: 0,
                  class: "history-table whitespace-nowrap"
                }, [
                  createVNode("thead", null, [
                    createVNode("tr", null, [
                      createVNode("th", null, "# Invoice"),
                      createVNode("th", null, "Plan"),
                      createVNode("th", null, "Subscription"),
                      createVNode("th", null, "Invoice Date"),
                      createVNode("th", null, "Total"),
                      createVNode("th", null, "Status"),
                      createVNode("th")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.orders.data, (order) => {
                      return openBlock(), createBlock("tr", {
                        key: order.order_id
                      }, [
                        createVNode("td", { class: "mono" }, toDisplayString(order.order_id), 1),
                        createVNode("td", null, toDisplayString(order.plan_name ?? "-"), 1),
                        createVNode("td", null, toDisplayString(order.billing_cycle === "yearly" ? "Yearly" : "Monthly"), 1),
                        createVNode("td", null, toDisplayString(formatDate(order.created_at)), 1),
                        createVNode("td", null, toDisplayString(formatPrice(order.amount)), 1),
                        createVNode("td", null, [
                          createVNode("span", {
                            class: ["badge", statusInfo(order.status).class]
                          }, toDisplayString(statusInfo(order.status).label), 3)
                        ]),
                        createVNode("td", null, [
                          order.status === "pending" ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "action-group"
                          }, [
                            createVNode("button", {
                              class: "pay-btn",
                              onClick: ($event) => openPayModal(order.order_id)
                            }, "💳 Bayar", 8, ["onClick"]),
                            createVNode("button", {
                              class: "cancel-btn",
                              onClick: ($event) => cancelOrder(order.order_id)
                            }, "Batalkan", 8, ["onClick"])
                          ])) : (openBlock(), createBlock(unref(Link), {
                            key: 1,
                            href: _ctx.route("owner.subscription.invoice", order.order_id),
                            class: "view-link"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Detail → ")
                            ]),
                            _: 1
                          }, 8, ["href"]))
                        ])
                      ]);
                    }), 128))
                  ])
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "history-empty"
                }, " Belum ada transaksi. Silakan pilih paket di halaman Upgrade Premium. "))
              ]),
              createVNode(SubscriptionInvoiceModal, {
                show: showModal.value,
                loading: modalLoading.value,
                submitting: submitting.value,
                calc: modalCalc.value,
                "plan-name": modalCalc.value?.plan_name,
                "accent-color": modalCalc.value?.plan_accent,
                onClose: closeModal,
                onConfirm: confirmPay
              }, null, 8, ["show", "loading", "submitting", "calc", "plan-name", "accent-color"]),
              __props.orders.links && __props.orders.links.length > 3 ? (openBlock(), createBlock("div", {
                key: 3,
                class: "pagination"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.orders.links, (link, i) => {
                  return openBlock(), createBlock(unref(Link), {
                    key: i,
                    href: link.url || "",
                    class: ["page-btn", { "page-btn-active": link.active, "page-btn-disabled": !link.url }],
                    innerHTML: link.label,
                    "preserve-scroll": ""
                  }, null, 8, ["href", "class", "innerHTML"]);
                }), 128))
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Owner/SubscriptionHistory.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SubscriptionHistory = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f8579ae5"]]);
export {
  SubscriptionHistory as default
};
