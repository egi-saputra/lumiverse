import { ref, unref, withCtx, createVNode, openBlock, createBlock, createTextVNode, createCommentVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { usePage, Head, router } from "@inertiajs/vue3";
import { O as OwnerLayout } from "./OwnerLayout-C9QaMqab.js";
import { S as SubscriptionInvoiceModal } from "./SubscriptionInvoiceModal-DhKsRycN.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "@heroicons/vue/24/outline";
const _sfc_main = {
  __name: "Invoice",
  __ssrInlineRender: true,
  props: {
    order: Object,
    tenant: Object,
    owner: Object
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    ref(false);
    const showModal = ref(false);
    const modalCalc = ref(null);
    const modalLoading = ref(false);
    const submitting = ref(false);
    const payTo = {
      name: "PT Lumi Platforms Indonesia",
      address: "Jl. Citayam - Parung No. 30 Ragajaya, Kabupaten Bogor, Jawa Barat 16920",
      // npwp: '1000 0000 1032 5710',
      npwp: "10.000.000.1-032.5710"
    };
    function formatPrice(amount) {
      if (!amount) return "Rp 0";
      return "Rp " + new Intl.NumberFormat("id-ID").format(amount);
    }
    function formatDate(dateStr) {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
    function csrfToken() {
      return page.props.csrf_token ?? document.querySelector('meta[name="csrf-token"]')?.content ?? "";
    }
    async function openPayModal() {
      modalCalc.value = null;
      modalLoading.value = true;
      showModal.value = true;
      try {
        const res = await fetch(route("owner.subscription.order-preview", props.order.order_id), {
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
    }
    async function confirmPay() {
      if (submitting.value) return;
      submitting.value = true;
      try {
        const res = await fetch(route("owner.subscription.retry", props.order.order_id), {
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
          router.reload();
          return;
        }
        if (data.action === "failed") {
          closeModal();
          alert("Transaksi ini sudah kedaluwarsa/dibatalkan.");
          router.reload();
          return;
        }
        if (data.action === "pay" && data.snap_token) {
          closeModal();
          window.snap.pay(data.snap_token, {
            onSuccess: () => {
              window.location.href = route("owner.subscription.finish") + "?order_id=" + props.order.order_id;
            },
            onPending: () => router.reload(),
            onError: () => alert("Pembayaran gagal. Silakan coba lagi."),
            onClose: () => {
              window.location.href = route("owner.subscription.finish") + "?order_id=" + props.order.order_id;
            }
          });
        }
      } catch (e) {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        submitting.value = false;
      }
    }
    function print() {
      window.print();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: "Invoice " + __props.order.order_id
      }, null, _parent));
      _push(ssrRenderComponent(OwnerLayout, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="topbar-title" data-v-fa2b0ef3${_scopeId}>Payment Invoice #${ssrInterpolate(__props.order.order_id)}</h1>`);
          } else {
            return [
              createVNode("h1", { class: "topbar-title" }, "Payment Invoice #" + toDisplayString(__props.order.order_id), 1)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="invoice-actions no-print" data-v-fa2b0ef3${_scopeId}><button class="btn-print" data-v-fa2b0ef3${_scopeId}>🖨️ Cetak Invoice</button></div>`);
            if (__props.order.status === "pending") {
              _push2(`<div class="status-notice no-print" data-v-fa2b0ef3${_scopeId}> ⏳ Transaksi ini <strong data-v-fa2b0ef3${_scopeId}>belum dibayar</strong>. <button class="btn-inline-pay" data-v-fa2b0ef3${_scopeId}>💳 Bayar Sekarang</button></div>`);
            } else if (__props.order.status === "failed") {
              _push2(`<div class="status-notice no-print" data-v-fa2b0ef3${_scopeId}> ⚠️ Transaksi ini <strong data-v-fa2b0ef3${_scopeId}>gagal/dibatalkan</strong>. Invoice ini bukan bukti pembayaran resmi. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="invoice-sheet" data-v-fa2b0ef3${_scopeId}><div class="inv-top" data-v-fa2b0ef3${_scopeId}><div data-v-fa2b0ef3${_scopeId}><div class="flex flex-row" data-v-fa2b0ef3${_scopeId}><img src="/images/logo-light.webp" alt="Lumiverse School" class="h-10 object-cover mt-1 scale-150 sm:flex hidden" data-v-fa2b0ef3${_scopeId}><div class="inv-brand mt-0.5" data-v-fa2b0ef3${_scopeId}>LUMIVERSE <span class="inv-brand-accent" data-v-fa2b0ef3${_scopeId}>SCHOOL</span></div></div><div class="inv-status-line" data-v-fa2b0ef3${_scopeId}> STATUS: <span class="${ssrRenderClass(["status-" + __props.order.status, "inv-status"])}" data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(__props.order.status === "paid" ? "PAID" : __props.order.status.toUpperCase())}</span></div>`);
            if (__props.order.status === "paid") {
              _push2(`<div class="inv-sub-line" data-v-fa2b0ef3${_scopeId}> Invoice Date Paid: ${ssrInterpolate(formatDate(__props.order.paid_at))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="inv-meta" data-v-fa2b0ef3${_scopeId}><div class="inv-meta-title" data-v-fa2b0ef3${_scopeId}>#INVOICE</div><div class="inv-meta-row" data-v-fa2b0ef3${_scopeId}><span data-v-fa2b0ef3${_scopeId}>No.</span><span data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(__props.order.order_id)}</span></div><div class="inv-meta-row" data-v-fa2b0ef3${_scopeId}><span data-v-fa2b0ef3${_scopeId}>Order Date</span><span data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(formatDate(__props.order.created_at))}</span></div></div></div><div class="inv-divider" data-v-fa2b0ef3${_scopeId}></div><div class="party-grid" data-v-fa2b0ef3${_scopeId}><div class="party-block" data-v-fa2b0ef3${_scopeId}><div class="party-label" data-v-fa2b0ef3${_scopeId}>Invoiced To</div><div class="party-name" data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(__props.tenant.name)}</div><div class="party-detail" data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(__props.owner.name)}</div>`);
            if (__props.tenant.address) {
              _push2(`<div class="party-detail" data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(__props.tenant.address)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="party-block" data-v-fa2b0ef3${_scopeId}><div class="party-label" data-v-fa2b0ef3${_scopeId}>Pay To</div><div class="party-name" data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(payTo.name)}</div><div class="party-detail max-w-md" data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(payTo.address)}</div>`);
            {
              _push2(`<div class="party-detail" data-v-fa2b0ef3${_scopeId}>NPWP: ${ssrInterpolate(payTo.npwp)}</div>`);
            }
            _push2(`</div></div><div class="inv-table-wrap" data-v-fa2b0ef3${_scopeId}><div class="inv-table-label" data-v-fa2b0ef3${_scopeId}>Invoice Items</div><table class="inv-table" data-v-fa2b0ef3${_scopeId}><thead data-v-fa2b0ef3${_scopeId}><tr data-v-fa2b0ef3${_scopeId}><th data-v-fa2b0ef3${_scopeId}>Description</th><th class="text-right" data-v-fa2b0ef3${_scopeId}>Amount</th></tr></thead><tbody data-v-fa2b0ef3${_scopeId}><tr data-v-fa2b0ef3${_scopeId}><td data-v-fa2b0ef3${_scopeId}><div class="inv-item-title" data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(__props.order.plan_name)} Plan Service</div><div class="inv-item-sub" data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(__props.order.billing_cycle === "yearly" ? "Yearly Subscription" : "Monthly Subscription")} `);
            if (__props.order.action === "upgrade") {
              _push2(`<span data-v-fa2b0ef3${_scopeId}> · Upgraded</span>`);
            } else if (__props.order.action === "downgrade") {
              _push2(`<span data-v-fa2b0ef3${_scopeId}> · Downgrade</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></td><td class="text-right" data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(formatPrice(__props.order.subtotal))}</td></tr>`);
            if (__props.order.yearly_discount > 0) {
              _push2(`<tr data-v-fa2b0ef3${_scopeId}><td class="text-muted" data-v-fa2b0ef3${_scopeId}>Diskon tahunan</td><td class="text-right inv-green" data-v-fa2b0ef3${_scopeId}>− ${ssrInterpolate(formatPrice(__props.order.yearly_discount))}</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.order.discount_amount > 0) {
              _push2(`<tr data-v-fa2b0ef3${_scopeId}><td class="text-muted" data-v-fa2b0ef3${_scopeId}>Diskon paket ${ssrInterpolate(__props.order.discount_percent)}%</td><td class="text-right inv-green" data-v-fa2b0ef3${_scopeId}>− ${ssrInterpolate(formatPrice(__props.order.discount_amount))}</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.order.credit_amount > 0) {
              _push2(`<tr data-v-fa2b0ef3${_scopeId}><td class="text-muted" data-v-fa2b0ef3${_scopeId}>Previous package credit</td><td class="text-right inv-green" data-v-fa2b0ef3${_scopeId}>− ${ssrInterpolate(formatPrice(__props.order.credit_amount))}</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.order.bonus_days > 0) {
              _push2(`<tr data-v-fa2b0ef3${_scopeId}><td class="text-muted" data-v-fa2b0ef3${_scopeId}>Renewal bonus</td><td class="text-right inv-green" data-v-fa2b0ef3${_scopeId}>+ ${ssrInterpolate(__props.order.bonus_days)} days</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table><div class="inv-summary" data-v-fa2b0ef3${_scopeId}><div class="inv-summary-row" data-v-fa2b0ef3${_scopeId}><span data-v-fa2b0ef3${_scopeId}>Sub Total</span><span data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(formatPrice(__props.order.subtotal - __props.order.yearly_discount - __props.order.discount_amount - __props.order.credit_amount))}</span></div>`);
            if (__props.order.tax_amount > 0) {
              _push2(`<div class="inv-summary-row" data-v-fa2b0ef3${_scopeId}><span data-v-fa2b0ef3${_scopeId}>PPN (${ssrInterpolate(__props.order.tax_percent)}%)</span><span data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(formatPrice(__props.order.tax_amount))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="inv-summary-row inv-summary-total" data-v-fa2b0ef3${_scopeId}><span data-v-fa2b0ef3${_scopeId}>Total Paid</span><span data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(formatPrice(__props.order.amount))}</span></div></div></div>`);
            if (__props.order.expires_at) {
              _push2(`<div class="inv-expires" data-v-fa2b0ef3${_scopeId}> Active package / plan until <strong data-v-fa2b0ef3${_scopeId}>${ssrInterpolate(formatDate(__props.order.expires_at))}</strong></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="inv-footer" data-v-fa2b0ef3${_scopeId}> Invoice ini dibuat otomatis oleh sistem Lumiverse dan sah tanpa tanda tangan basah. </div></div>`);
            _push2(ssrRenderComponent(SubscriptionInvoiceModal, {
              show: showModal.value,
              loading: modalLoading.value,
              submitting: submitting.value,
              calc: modalCalc.value,
              "plan-name": __props.order.plan_name,
              "accent-color": "#00d4ff",
              onClose: closeModal,
              onConfirm: confirmPay
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "invoice-actions no-print" }, [
                createVNode("button", {
                  class: "btn-print",
                  onClick: print
                }, "🖨️ Cetak Invoice")
              ]),
              __props.order.status === "pending" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "status-notice no-print"
              }, [
                createTextVNode(" ⏳ Transaksi ini "),
                createVNode("strong", null, "belum dibayar"),
                createTextVNode(". "),
                createVNode("button", {
                  class: "btn-inline-pay",
                  onClick: openPayModal
                }, "💳 Bayar Sekarang")
              ])) : __props.order.status === "failed" ? (openBlock(), createBlock("div", {
                key: 1,
                class: "status-notice no-print"
              }, [
                createTextVNode(" ⚠️ Transaksi ini "),
                createVNode("strong", null, "gagal/dibatalkan"),
                createTextVNode(". Invoice ini bukan bukti pembayaran resmi. ")
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "invoice-sheet" }, [
                createVNode("div", { class: "inv-top" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "flex flex-row" }, [
                      createVNode("img", {
                        src: "/images/logo-light.webp",
                        alt: "Lumiverse School",
                        class: "h-10 object-cover mt-1 scale-150 sm:flex hidden"
                      }),
                      createVNode("div", { class: "inv-brand mt-0.5" }, [
                        createTextVNode("LUMIVERSE "),
                        createVNode("span", { class: "inv-brand-accent" }, "SCHOOL")
                      ])
                    ]),
                    createVNode("div", { class: "inv-status-line" }, [
                      createTextVNode(" STATUS: "),
                      createVNode("span", {
                        class: ["inv-status", "status-" + __props.order.status]
                      }, toDisplayString(__props.order.status === "paid" ? "PAID" : __props.order.status.toUpperCase()), 3)
                    ]),
                    __props.order.status === "paid" ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "inv-sub-line"
                    }, " Invoice Date Paid: " + toDisplayString(formatDate(__props.order.paid_at)), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "inv-meta" }, [
                    createVNode("div", { class: "inv-meta-title" }, "#INVOICE"),
                    createVNode("div", { class: "inv-meta-row" }, [
                      createVNode("span", null, "No."),
                      createVNode("span", null, toDisplayString(__props.order.order_id), 1)
                    ]),
                    createVNode("div", { class: "inv-meta-row" }, [
                      createVNode("span", null, "Order Date"),
                      createVNode("span", null, toDisplayString(formatDate(__props.order.created_at)), 1)
                    ])
                  ])
                ]),
                createVNode("div", { class: "inv-divider" }),
                createVNode("div", { class: "party-grid" }, [
                  createVNode("div", { class: "party-block" }, [
                    createVNode("div", { class: "party-label" }, "Invoiced To"),
                    createVNode("div", { class: "party-name" }, toDisplayString(__props.tenant.name), 1),
                    createVNode("div", { class: "party-detail" }, toDisplayString(__props.owner.name), 1),
                    __props.tenant.address ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "party-detail"
                    }, toDisplayString(__props.tenant.address), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "party-block" }, [
                    createVNode("div", { class: "party-label" }, "Pay To"),
                    createVNode("div", { class: "party-name" }, toDisplayString(payTo.name), 1),
                    createVNode("div", { class: "party-detail max-w-md" }, toDisplayString(payTo.address), 1),
                    (openBlock(), createBlock("div", {
                      key: 0,
                      class: "party-detail"
                    }, "NPWP: " + toDisplayString(payTo.npwp), 1))
                  ])
                ]),
                createVNode("div", { class: "inv-table-wrap" }, [
                  createVNode("div", { class: "inv-table-label" }, "Invoice Items"),
                  createVNode("table", { class: "inv-table" }, [
                    createVNode("thead", null, [
                      createVNode("tr", null, [
                        createVNode("th", null, "Description"),
                        createVNode("th", { class: "text-right" }, "Amount")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      createVNode("tr", null, [
                        createVNode("td", null, [
                          createVNode("div", { class: "inv-item-title" }, toDisplayString(__props.order.plan_name) + " Plan Service", 1),
                          createVNode("div", { class: "inv-item-sub" }, [
                            createTextVNode(toDisplayString(__props.order.billing_cycle === "yearly" ? "Yearly Subscription" : "Monthly Subscription") + " ", 1),
                            __props.order.action === "upgrade" ? (openBlock(), createBlock("span", { key: 0 }, " · Upgraded")) : __props.order.action === "downgrade" ? (openBlock(), createBlock("span", { key: 1 }, " · Downgrade")) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("td", { class: "text-right" }, toDisplayString(formatPrice(__props.order.subtotal)), 1)
                      ]),
                      __props.order.yearly_discount > 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", { class: "text-muted" }, "Diskon tahunan"),
                        createVNode("td", { class: "text-right inv-green" }, "− " + toDisplayString(formatPrice(__props.order.yearly_discount)), 1)
                      ])) : createCommentVNode("", true),
                      __props.order.discount_amount > 0 ? (openBlock(), createBlock("tr", { key: 1 }, [
                        createVNode("td", { class: "text-muted" }, "Diskon paket " + toDisplayString(__props.order.discount_percent) + "%", 1),
                        createVNode("td", { class: "text-right inv-green" }, "− " + toDisplayString(formatPrice(__props.order.discount_amount)), 1)
                      ])) : createCommentVNode("", true),
                      __props.order.credit_amount > 0 ? (openBlock(), createBlock("tr", { key: 2 }, [
                        createVNode("td", { class: "text-muted" }, "Previous package credit"),
                        createVNode("td", { class: "text-right inv-green" }, "− " + toDisplayString(formatPrice(__props.order.credit_amount)), 1)
                      ])) : createCommentVNode("", true),
                      __props.order.bonus_days > 0 ? (openBlock(), createBlock("tr", { key: 3 }, [
                        createVNode("td", { class: "text-muted" }, "Renewal bonus"),
                        createVNode("td", { class: "text-right inv-green" }, "+ " + toDisplayString(__props.order.bonus_days) + " days", 1)
                      ])) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "inv-summary" }, [
                    createVNode("div", { class: "inv-summary-row" }, [
                      createVNode("span", null, "Sub Total"),
                      createVNode("span", null, toDisplayString(formatPrice(__props.order.subtotal - __props.order.yearly_discount - __props.order.discount_amount - __props.order.credit_amount)), 1)
                    ]),
                    __props.order.tax_amount > 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "inv-summary-row"
                    }, [
                      createVNode("span", null, "PPN (" + toDisplayString(__props.order.tax_percent) + "%)", 1),
                      createVNode("span", null, toDisplayString(formatPrice(__props.order.tax_amount)), 1)
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "inv-summary-row inv-summary-total" }, [
                      createVNode("span", null, "Total Paid"),
                      createVNode("span", null, toDisplayString(formatPrice(__props.order.amount)), 1)
                    ])
                  ])
                ]),
                __props.order.expires_at ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "inv-expires"
                }, [
                  createTextVNode(" Active package / plan until "),
                  createVNode("strong", null, toDisplayString(formatDate(__props.order.expires_at)), 1)
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "inv-footer" }, " Invoice ini dibuat otomatis oleh sistem Lumiverse dan sah tanpa tanda tangan basah. ")
              ]),
              createVNode(SubscriptionInvoiceModal, {
                show: showModal.value,
                loading: modalLoading.value,
                submitting: submitting.value,
                calc: modalCalc.value,
                "plan-name": __props.order.plan_name,
                "accent-color": "#00d4ff",
                onClose: closeModal,
                onConfirm: confirmPay
              }, null, 8, ["show", "loading", "submitting", "calc", "plan-name"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Owner/Invoice.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Invoice = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fa2b0ef3"]]);
export {
  Invoice as default
};
