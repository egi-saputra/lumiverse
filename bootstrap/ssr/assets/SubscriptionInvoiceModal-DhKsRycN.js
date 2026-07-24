import { ssrRenderTeleport, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "SubscriptionInvoiceModal",
  __ssrInlineRender: true,
  props: {
    show: Boolean,
    loading: Boolean,
    submitting: Boolean,
    calc: Object,
    // shape sama seperti hasil calculate() / orderPreview()
    planName: String,
    accentColor: { type: String, default: "#00d4ff" }
  },
  emits: ["close", "confirm"],
  setup(__props, { emit: __emit }) {
    function formatPrice(amount) {
      if (amount === null || amount === void 0) return null;
      if (amount === 0) return "0";
      return new Intl.NumberFormat("id-ID").format(amount);
    }
    function formatDate(dateStr) {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.show) {
          _push2(`<div class="modal-overlay" data-v-3c0e1d0c><div class="modal-box" style="${ssrRenderStyle({ "--accent": __props.accentColor })}" data-v-3c0e1d0c>`);
          if (__props.loading) {
            _push2(`<div class="modal-loading" data-v-3c0e1d0c><div class="modal-spinner" data-v-3c0e1d0c></div><p data-v-3c0e1d0c>Menyiapkan invoice...</p></div>`);
          } else if (__props.calc) {
            _push2(`<!--[--><div class="modal-header" data-v-3c0e1d0c><div class="modal-header-left" data-v-3c0e1d0c><div class="modal-invoice-label" data-v-3c0e1d0c>INVOICE BERLANGGANAN</div><div class="modal-title" data-v-3c0e1d0c>Paket ${ssrInterpolate(__props.planName)}</div><div class="modal-subtitle" data-v-3c0e1d0c><span class="inv-cycle-badge" data-v-3c0e1d0c>${ssrInterpolate(__props.calc.billing_cycle === "yearly" ? "📅 Tahunan" : "🗓 Bulanan")}</span>`);
            if (__props.calc.action === "upgrade") {
              _push2(`<span class="inv-action-badge inv-upgrade" data-v-3c0e1d0c>↑ Upgrade</span>`);
            } else if (__props.calc.action === "downgrade") {
              _push2(`<span class="inv-action-badge inv-downgrade" data-v-3c0e1d0c>↓ Downgrade</span>`);
            } else if (__props.calc.action === "renewal") {
              _push2(`<span class="inv-action-badge inv-renewal" data-v-3c0e1d0c>🔄 Perpanjangan</span>`);
            } else {
              _push2(`<span class="inv-action-badge inv-new" data-v-3c0e1d0c>✦ Berlangganan Baru</span>`);
            }
            _push2(`</div></div><button class="modal-close" data-v-3c0e1d0c>✕</button></div><div class="inv-body" data-v-3c0e1d0c>`);
            if (__props.calc.price_per_month) {
              _push2(`<div class="inv-row" data-v-3c0e1d0c><span class="inv-label" data-v-3c0e1d0c> Harga per bulan <span class="inv-label-sub" data-v-3c0e1d0c>Paket ${ssrInterpolate(__props.planName)}</span></span><span class="inv-value" data-v-3c0e1d0c>Rp ${ssrInterpolate(formatPrice(__props.calc.price_per_month))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.calc.billing_cycle === "yearly") {
              _push2(`<div class="inv-row" data-v-3c0e1d0c><span class="inv-label" data-v-3c0e1d0c> Periode berlangganan <span class="inv-label-sub" data-v-3c0e1d0c>× 12 bulan</span></span><span class="inv-value" data-v-3c0e1d0c>Rp ${ssrInterpolate(formatPrice(__props.calc.subtotal))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.calc.yearly_discount > 0) {
              _push2(`<div class="inv-row inv-row-discount" data-v-3c0e1d0c><span class="inv-label" data-v-3c0e1d0c> Diskon berlangganan tahunan <span class="inv-label-sub" data-v-3c0e1d0c>Hemat vs bayar bulanan ×12</span></span><span class="inv-value inv-green" data-v-3c0e1d0c>− Rp ${ssrInterpolate(formatPrice(__props.calc.yearly_discount))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.calc.discount_amount > 0) {
              _push2(`<div class="inv-row inv-row-discount" data-v-3c0e1d0c><span class="inv-label" data-v-3c0e1d0c> Diskon paket ${ssrInterpolate(__props.calc.discount_percent)}% <span class="inv-label-sub" data-v-3c0e1d0c>Promo khusus paket ${ssrInterpolate(__props.planName)}</span></span><span class="inv-value inv-green" data-v-3c0e1d0c>− Rp ${ssrInterpolate(formatPrice(__props.calc.discount_amount))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.calc.credit_amount > 0) {
              _push2(`<div class="inv-row inv-row-credit" data-v-3c0e1d0c><span class="inv-label" data-v-3c0e1d0c> Kredit paket sebelumnya `);
              if (__props.calc.credit_days) {
                _push2(`<span class="inv-label-sub" data-v-3c0e1d0c>Sisa ${ssrInterpolate(__props.calc.credit_days)} hari dikonversi</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</span><span class="inv-value inv-green" data-v-3c0e1d0c>− Rp ${ssrInterpolate(formatPrice(__props.calc.credit_amount))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.calc.bonus_days > 0) {
              _push2(`<div class="inv-row inv-row-bonus" data-v-3c0e1d0c><span class="inv-label" data-v-3c0e1d0c> Perpanjangan dari sisa kredit <span class="inv-label-sub" data-v-3c0e1d0c>+ ${ssrInterpolate(__props.calc.bonus_days)} hari tambahan</span></span><span class="inv-value inv-green" data-v-3c0e1d0c>Gratis</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="inv-divider" data-v-3c0e1d0c></div><div class="inv-row" data-v-3c0e1d0c><span class="inv-label" data-v-3c0e1d0c>Subtotal</span><span class="inv-value" data-v-3c0e1d0c>Rp ${ssrInterpolate(formatPrice(__props.calc.amount_to_pay))}</span></div>`);
            if (__props.calc.tax_amount > 0) {
              _push2(`<div class="inv-row inv-row-tax" data-v-3c0e1d0c><span class="inv-label" data-v-3c0e1d0c> PPN ${ssrInterpolate(__props.calc.tax_percent ?? 0)}% <span class="inv-label-sub" data-v-3c0e1d0c>Pajak Pertambahan Nilai</span></span><span class="inv-value" data-v-3c0e1d0c>Rp ${ssrInterpolate(formatPrice(__props.calc.tax_amount))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="inv-divider inv-divider-bold" data-v-3c0e1d0c></div><div class="inv-row inv-row-grand" data-v-3c0e1d0c><span data-v-3c0e1d0c>Total yang harus dibayar</span><span class="inv-grand-value" data-v-3c0e1d0c>Rp ${ssrInterpolate(formatPrice(__props.calc.amount_to_pay_after_tax))}</span></div>`);
            if (__props.calc.new_expires_at) {
              _push2(`<div class="inv-expires" data-v-3c0e1d0c><span data-v-3c0e1d0c>🗓</span><span data-v-3c0e1d0c>Aktif hingga <strong data-v-3c0e1d0c>${ssrInterpolate(formatDate(__props.calc.new_expires_at))}</strong></span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.calc.downgrade_note) {
              _push2(`<div class="modal-note" data-v-3c0e1d0c>${ssrInterpolate(__props.calc.downgrade_note)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.calc.user_count_warning) {
              _push2(`<div class="modal-warning" data-v-3c0e1d0c> ⚠️ ${ssrInterpolate(__props.calc.user_count_warning)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="modal-actions" data-v-3c0e1d0c><button class="modal-btn-cancel" data-v-3c0e1d0c>Batal</button><button class="modal-btn-confirm"${ssrIncludeBooleanAttr(__props.submitting) ? " disabled" : ""} data-v-3c0e1d0c>${ssrInterpolate(__props.submitting ? "Memproses..." : __props.calc.amount_to_pay_after_tax === 0 ? "Aktifkan Gratis" : "Lanjut Bayar")}</button></div><!--]-->`);
          } else {
            _push2(`<div class="modal-loading" data-v-3c0e1d0c><p data-v-3c0e1d0c>Gagal memuat data. <button data-v-3c0e1d0c>Tutup</button></p></div>`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SubscriptionInvoiceModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SubscriptionInvoiceModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3c0e1d0c"]]);
export {
  SubscriptionInvoiceModal as S
};
