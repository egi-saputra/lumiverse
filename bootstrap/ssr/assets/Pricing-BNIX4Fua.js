import { ref, computed, onMounted, nextTick, watch, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, toDisplayString, withModifiers, withDirectives, vShow, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
import { usePage, Head, router } from "@inertiajs/vue3";
import { S as SubscriptionInvoiceModal } from "./SubscriptionInvoiceModal-DhKsRycN.js";
import { SparklesIcon, ChevronLeftIcon, AcademicCapIcon, BuildingLibraryIcon, BoltIcon, CheckIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { O as OwnerLayout } from "./OwnerLayout-C9QaMqab.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const CARD_WIDTH = 340;
const GAP = 24;
const _sfc_main = {
  __name: "Pricing",
  __ssrInlineRender: true,
  props: {
    owner: Object,
    tenant: Object,
    productType: String,
    currentPlan: String,
    currentSortOrder: Number,
    expiresAt: String,
    pendingPlan: String,
    trialUsed: Boolean,
    plans: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const billingCycle = ref("yearly");
    const planList = computed(() => props.plans ?? []);
    function isCtaDisabled(plan) {
      if (plan.key === props.currentPlan) return true;
      if (plan.key === props.pendingPlan) return true;
      return false;
    }
    const page = usePage();
    const showModal = ref(false);
    const modalPlan = ref(null);
    const modalCalc = ref(null);
    const modalLoading = ref(false);
    const submitting = ref(false);
    function csrfToken() {
      return page.props.csrf_token ?? document.querySelector('meta[name="csrf-token"]')?.content ?? "";
    }
    async function handleCta(plan) {
      if (isCtaDisabled(plan)) return;
      modalPlan.value = plan;
      modalCalc.value = null;
      modalLoading.value = true;
      showModal.value = true;
      try {
        const res = await fetch(route("owner.subscription.preview"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken(),
            "Accept": "application/json"
          },
          body: JSON.stringify({
            plan_key: plan.key,
            billing_cycle: billingCycle.value
          })
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
      modalPlan.value = null;
      modalCalc.value = null;
    }
    async function confirmSubscribe() {
      if (!modalPlan.value || submitting.value) return;
      submitting.value = true;
      try {
        const res = await fetch(route("owner.subscription.charge"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken(),
            "Accept": "application/json"
          },
          body: JSON.stringify({
            plan_key: modalPlan.value.key,
            billing_cycle: billingCycle.value
          })
        });
        const data = await res.json();
        if (data.action === "activated" || data.action === "downgrade") {
          closeModal();
          router.reload({ only: ["currentPlan", "expiresAt", "pendingPlan"] });
          return;
        }
        if (data.action === "pay" && data.snap_token) {
          closeModal();
          const orderId = data.order_id;
          window.snap.pay(data.snap_token, {
            onSuccess: (result) => {
              window.location.href = route("owner.subscription.finish") + "?order_id=" + (result.order_id || orderId);
            },
            onPending: () => {
              window.location.href = route("owner.subscription.history");
            },
            onError: () => {
              alert("Pembayaran gagal. Silakan coba lagi.");
            },
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
    const faqs = [
      {
        q: "Apakah ada masa uji coba gratis?",
        a: "Ya, semua paket berbayar memiliki masa uji coba 14 hari tanpa perlu kartu kredit. Anda bisa upgrade atau batal kapan saja."
      },
      {
        q: "Bagaimana cara pembayaran?",
        a: "Kami menerima transfer bank, kartu kredit/debit, dan dompet digital (GoPay, OVO, DANA) melalui Midtrans."
      },
      {
        q: "Apakah data saya aman saat upgrade/downgrade?",
        a: "Tentu. Semua data tersimpan aman. Saat downgrade, data tetap ada namun akses ke fitur premium akan dibatasi."
      },
      {
        q: "Bisakah saya ganti paket di tengah periode?",
        a: "Bisa. Upgrade langsung aktif dengan perhitungan prorata. Downgrade berlaku di akhir periode tagihan."
      },
      {
        q: "Apakah harga sudah termasuk PPN?",
        a: "Harga yang ditampilkan belum termasuk PPN 11%. Total akan terlihat pada halaman pembayaran."
      }
    ];
    const openFaq = ref(null);
    function toggleFaq(i) {
      openFaq.value = openFaq.value === i ? null : i;
    }
    function formatPrice(amount) {
      if (amount === null || amount === void 0) return null;
      if (amount === 0) return "0";
      return new Intl.NumberFormat("id-ID").format(amount);
    }
    const avgYearlyDiscount = computed(() => {
      const discounts = planList.value.filter((p) => p.price?.monthly > 0 && p.price?.yearly > 0).map((p) => Math.round((1 - p.price.yearly / p.price.monthly) * 100));
      if (!discounts.length) return null;
      const avg = Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length);
      return avg > 0 ? avg : null;
    });
    function getSavingPercent(plan) {
      if (!plan.price?.monthly || !plan.price?.yearly) return null;
      return Math.round((1 - plan.price.yearly / plan.price.monthly) * 100);
    }
    function getSaving(plan) {
      if (!plan.price.monthly || !plan.price.yearly) return null;
      const saved = (plan.price.monthly - plan.price.yearly) * 12;
      return formatPrice(saved);
    }
    function isCurrentPlan(plan) {
      return plan.key === props.currentPlan;
    }
    const billingToggle = ref(null);
    function measurePill() {
      if (!billingToggle.value) return;
      const btns = billingToggle.value.querySelectorAll(".toggle-btn");
      if (btns.length < 2) return;
      billingToggle.value.style.setProperty("--pill-monthly-w", btns[0].offsetWidth + "px");
      billingToggle.value.style.setProperty("--pill-yearly-w", btns[1].offsetWidth + "px");
    }
    const sliderRoot = ref(null);
    const track = ref(null);
    const currentIndex = ref(1);
    function getHalfContainer() {
      return sliderRoot.value ? sliderRoot.value.clientWidth / 2 : 0;
    }
    function scrollToIndex(idx, smooth = true) {
      if (!track.value) return;
      const clamped = Math.max(0, Math.min(idx, planList.value.length - 1));
      currentIndex.value = clamped;
      const half = getHalfContainer();
      const spacerW = half - CARD_WIDTH / 2;
      const cardLeft = spacerW + clamped * (CARD_WIDTH + GAP);
      track.value.scrollTo({ left: Math.max(0, cardLeft - (half - CARD_WIDTH / 2)), behavior: smooth ? "smooth" : "instant" });
    }
    function onKeydown(e) {
      if (e.key === "ArrowLeft") scrollToIndex(currentIndex.value - 1);
      if (e.key === "ArrowRight") scrollToIndex(currentIndex.value + 1);
    }
    onMounted(() => {
      window.addEventListener("resize", measurePill);
      window.addEventListener("resize", () => nextTick(() => scrollToIndex(currentIndex.value, false)));
    });
    watch(
      () => props.plans,
      (plans) => {
        if (!plans || plans.length === 0) return;
        nextTick(() => {
          measurePill();
          setTimeout(() => scrollToIndex(1, false), 80);
        });
      },
      { immediate: true, flush: "post" }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Price List" }, null, _parent));
      _push(ssrRenderComponent(OwnerLayout, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="topbar-title" data-v-66d6f49d${_scopeId}>Price List &amp; Our Services</h1>`);
          } else {
            return [
              createVNode("h1", { class: "topbar-title" }, "Price List & Our Services")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="pricing-hero" data-v-66d6f49d${_scopeId}><div class="hero-badge" data-v-66d6f49d${_scopeId}>`);
            _push2(ssrRenderComponent(unref(SparklesIcon), { class: "hero-badge-icon" }, null, _parent2, _scopeId));
            _push2(` Paket Layanan &amp; Daftar Harga </div><h1 class="hero-title hidden sm:block" data-v-66d6f49d${_scopeId}>Berbagai macam fitur <span class="hidden sm:inline-flex" data-v-66d6f49d${_scopeId}>untuk semua kebutuhanmu!</span></h1><p class="hero-sub" data-v-66d6f49d${_scopeId}>Akses fitur lengkap sepuasnya, berhenti berlangganan kapan saja. <span class="hidden sm:inline-flex" data-v-66d6f49d${_scopeId}>Tanpa kontrak panjang, tanpa kartu kredit dan tanpa biaya tersembunyi.</span></p><div class="billing-toggle"${ssrRenderAttr("data-cycle", billingCycle.value)} data-v-66d6f49d${_scopeId}><div class="toggle-slider-pill" data-v-66d6f49d${_scopeId}></div><button class="${ssrRenderClass([{ active: billingCycle.value === "monthly" }, "toggle-btn"])}" data-v-66d6f49d${_scopeId}>Bulanan</button><button class="${ssrRenderClass([{ active: billingCycle.value === "yearly" }, "toggle-btn"])}" data-v-66d6f49d${_scopeId}> Tahunan `);
            if (avgYearlyDiscount.value) {
              _push2(`<span class="toggle-save" data-v-66d6f49d${_scopeId}>Hemat hingga ~30%</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button></div></div>`);
            if (planList.value.length > 0) {
              _push2(`<!--[--><div class="slider-root desktop-only" tabindex="-1" data-v-66d6f49d${_scopeId}><button class="slider-arrow slider-arrow-left"${ssrIncludeBooleanAttr(currentIndex.value === 0) ? " disabled" : ""} aria-label="Sebelumnya" data-v-66d6f49d${_scopeId}>`);
              _push2(ssrRenderComponent(unref(ChevronLeftIcon), { class: "arrow-icon" }, null, _parent2, _scopeId));
              _push2(`</button><div class="slider-track" data-v-66d6f49d${_scopeId}><div class="track-spacer" aria-hidden="true" data-v-66d6f49d${_scopeId}></div><!--[-->`);
              ssrRenderList(planList.value, (plan, i) => {
                _push2(`<div class="${ssrRenderClass([{
                  "card-active": currentIndex.value === i,
                  "card-side": Math.abs(currentIndex.value - i) === 1,
                  "card-far": Math.abs(currentIndex.value - i) >= 2,
                  "plan-card-current": isCurrentPlan(plan)
                }, "plan-card"])}" style="${ssrRenderStyle({ "--accent": plan.accent })}" data-v-66d6f49d${_scopeId}>`);
                if (plan.badge && currentIndex.value === i) {
                  _push2(`<div class="plan-popular-badge" data-v-66d6f49d${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(SparklesIcon), { style: { "width": "11px", "height": "11px" } }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(plan.badge)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="plan-header" data-v-66d6f49d${_scopeId}><div class="plan-icon" data-v-66d6f49d${_scopeId}>`);
                if (plan.key === "basic") {
                  _push2(ssrRenderComponent(unref(AcademicCapIcon), { style: { "width": "16px", "height": "16px" } }, null, _parent2, _scopeId));
                } else if (plan.key === "enterprise") {
                  _push2(ssrRenderComponent(unref(BuildingLibraryIcon), { style: { "width": "16px", "height": "16px" } }, null, _parent2, _scopeId));
                } else if (plan.key === "expertise") {
                  _push2(ssrRenderComponent(unref(SparklesIcon), { style: { "width": "16px", "height": "16px" } }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(BoltIcon), { style: { "width": "16px", "height": "16px" } }, null, _parent2, _scopeId));
                }
                _push2(`</div><div data-v-66d6f49d${_scopeId}><div class="plan-name" data-v-66d6f49d${_scopeId}>${ssrInterpolate(plan.name)}</div><div class="plan-desc" data-v-66d6f49d${_scopeId}>${ssrInterpolate(plan.desc)}</div></div></div><div class="plan-price-block" data-v-66d6f49d${_scopeId}>`);
                if (plan.priceLabel) {
                  _push2(`<div class="plan-price-custom" data-v-66d6f49d${_scopeId}>${ssrInterpolate(plan.priceLabel)}</div>`);
                } else if (plan.price[billingCycle.value] === 0) {
                  _push2(`<!--[--><div class="plan-price-amount" data-v-66d6f49d${_scopeId}>Gratis</div><div class="plan-price-period" data-v-66d6f49d${_scopeId}>selamanya</div><!--]-->`);
                } else {
                  _push2(`<!--[--><div class="plan-price-row" data-v-66d6f49d${_scopeId}><span class="plan-price-currency" data-v-66d6f49d${_scopeId}>Rp</span><span class="plan-price-amount" data-v-66d6f49d${_scopeId}>${ssrInterpolate(formatPrice(plan.price[billingCycle.value]))}</span></div><div class="plan-price-period" data-v-66d6f49d${_scopeId}> per bulan`);
                  if (billingCycle.value === "yearly") {
                    _push2(`<span data-v-66d6f49d${_scopeId}> · ditagih tahunan</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                  if (billingCycle.value === "yearly" && getSaving(plan)) {
                    _push2(`<div class="plan-price-saving" data-v-66d6f49d${_scopeId}> Hemat ${ssrInterpolate(getSavingPercent(plan))}% · Rp ${ssrInterpolate(getSaving(plan))}/tahun </div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<!--]-->`);
                }
                _push2(`</div>`);
                if (plan.maxUsers) {
                  _push2(`<div class="plan-users flex justify-center" data-v-66d6f49d${_scopeId}> Hingga <strong class="pl-1" data-v-66d6f49d${_scopeId}>${ssrInterpolate(plan.maxUsers.toLocaleString("id-ID"))} pengguna</strong></div>`);
                } else if (plan.key === "expertise") {
                  _push2(`<div class="plan-users flex justify-center" data-v-66d6f49d${_scopeId}><strong data-v-66d6f49d${_scopeId}>Unlimited account</strong></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<button class="${ssrRenderClass([{
                  "plan-cta-highlight": plan.highlight && !isCurrentPlan(plan),
                  "plan-cta-current": isCurrentPlan(plan),
                  "plan-cta-accent": !plan.highlight && !isCurrentPlan(plan)
                }, "plan-cta"])}"${ssrIncludeBooleanAttr(isCurrentPlan(plan)) ? " disabled" : ""}${ssrRenderAttr("tabindex", currentIndex.value === i ? 0 : -1)} data-v-66d6f49d${_scopeId}>${ssrInterpolate(isCurrentPlan(plan) ? "✓ Paket Aktif" : plan.cta)}</button><div class="plan-features" data-v-66d6f49d${_scopeId}><!--[-->`);
                ssrRenderList(plan.features, (f) => {
                  _push2(`<div class="plan-feature" data-v-66d6f49d${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(CheckIcon), { class: "feature-check feature-check-yes" }, null, _parent2, _scopeId));
                  _push2(`<span data-v-66d6f49d${_scopeId}>${ssrInterpolate(f)}</span></div>`);
                });
                _push2(`<!--]--><!--[-->`);
                ssrRenderList(plan.unavailable, (f) => {
                  _push2(`<div class="plan-feature plan-feature-no" data-v-66d6f49d${_scopeId}><span class="feature-check feature-check-no" data-v-66d6f49d${_scopeId}>—</span><span data-v-66d6f49d${_scopeId}>${ssrInterpolate(f)}</span></div>`);
                });
                _push2(`<!--]--></div></div>`);
              });
              _push2(`<!--]--><div class="track-spacer" aria-hidden="true" data-v-66d6f49d${_scopeId}></div></div><button class="slider-arrow slider-arrow-right"${ssrIncludeBooleanAttr(currentIndex.value === planList.value.length - 1) ? " disabled" : ""} aria-label="Berikutnya" data-v-66d6f49d${_scopeId}>`);
              _push2(ssrRenderComponent(unref(ChevronRightIcon), { class: "arrow-icon" }, null, _parent2, _scopeId));
              _push2(`</button></div><div class="slider-dots desktop-only" role="tablist" data-v-66d6f49d${_scopeId}><!--[-->`);
              ssrRenderList(planList.value, (plan, i) => {
                _push2(`<button class="${ssrRenderClass([{ "dot-active": currentIndex.value === i }, "dot"])}" style="${ssrRenderStyle(currentIndex.value === i ? { background: plan.accent, width: "26px" } : {})}"${ssrRenderAttr("aria-label", plan.name)} role="tab"${ssrRenderAttr("aria-selected", currentIndex.value === i)} data-v-66d6f49d${_scopeId}></button>`);
              });
              _push2(`<!--]--></div><div class="slider-labels desktop-only" data-v-66d6f49d${_scopeId}><!--[-->`);
              ssrRenderList(planList.value, (plan, i) => {
                _push2(`<span class="${ssrRenderClass([{ "label-active": currentIndex.value === i }, "slider-label"])}" style="${ssrRenderStyle(currentIndex.value === i ? { color: plan.accent, borderColor: plan.accent + "44", background: plan.accent + "12" } : {})}" data-v-66d6f49d${_scopeId}>${ssrInterpolate(plan.name)}</span>`);
              });
              _push2(`<!--]--></div><div class="mobile-cards mobile-only" data-v-66d6f49d${_scopeId}><!--[-->`);
              ssrRenderList(planList.value, (plan) => {
                _push2(`<div class="${ssrRenderClass([{ "mobile-plan-card-current": isCurrentPlan(plan), "mobile-plan-card-highlight": plan.highlight }, "mobile-plan-card"])}" style="${ssrRenderStyle({ "--accent": plan.accent })}" data-v-66d6f49d${_scopeId}>`);
                if (plan.badge) {
                  _push2(`<div class="mobile-popular-badge" data-v-66d6f49d${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(SparklesIcon), { style: { "width": "10px", "height": "10px" } }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(plan.badge)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="plan-header" data-v-66d6f49d${_scopeId}><div data-v-66d6f49d${_scopeId}><div class="plan-name" data-v-66d6f49d${_scopeId}>${ssrInterpolate(plan.name)}</div><div class="plan-desc" data-v-66d6f49d${_scopeId}>${ssrInterpolate(plan.desc)}</div></div></div><div class="mobile-price-row" data-v-66d6f49d${_scopeId}><div class="plan-price-block" data-v-66d6f49d${_scopeId}><div class="plan-price-row" data-v-66d6f49d${_scopeId}><span class="plan-price-currency" data-v-66d6f49d${_scopeId}>Rp</span><span class="plan-price-amount" data-v-66d6f49d${_scopeId}>${ssrInterpolate(formatPrice(plan.price[billingCycle.value]))}</span></div><div class="plan-price-period" data-v-66d6f49d${_scopeId}> per bulan`);
                if (billingCycle.value === "yearly") {
                  _push2(`<span data-v-66d6f49d${_scopeId}> · ditagih tahunan</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (billingCycle.value === "yearly" && getSaving(plan)) {
                  _push2(`<div class="plan-price-saving" data-v-66d6f49d${_scopeId}> Hemat Rp ${ssrInterpolate(getSaving(plan))}/tahun </div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
                if (plan.maxUsers) {
                  _push2(`<div class="plan-users flex justify-center" data-v-66d6f49d${_scopeId}> Hingga <strong class="pl-1" data-v-66d6f49d${_scopeId}>${ssrInterpolate(plan.maxUsers.toLocaleString("id-ID"))} akun pengguna</strong></div>`);
                } else if (plan.key === "expertise") {
                  _push2(`<div class="plan-users flex justify-center" data-v-66d6f49d${_scopeId}><strong class="pl-1" data-v-66d6f49d${_scopeId}>Unlimited Akun Pengguna</strong></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<button class="${ssrRenderClass([{
                  "plan-cta-highlight": plan.highlight && !isCurrentPlan(plan),
                  "plan-cta-current": isCurrentPlan(plan),
                  "plan-cta-accent": !plan.highlight && !isCurrentPlan(plan)
                }, "plan-cta mobile-cta"])}"${ssrIncludeBooleanAttr(isCurrentPlan(plan)) ? " disabled" : ""} data-v-66d6f49d${_scopeId}>${ssrInterpolate(isCurrentPlan(plan) ? "✓ Aktif" : plan.cta)}</button><div class="plan-features" data-v-66d6f49d${_scopeId}><!--[-->`);
                ssrRenderList(plan.features, (f) => {
                  _push2(`<div class="plan-feature" data-v-66d6f49d${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(CheckIcon), { class: "feature-check feature-check-yes" }, null, _parent2, _scopeId));
                  _push2(`<span data-v-66d6f49d${_scopeId}>${ssrInterpolate(f)}</span></div>`);
                });
                _push2(`<!--]--><!--[-->`);
                ssrRenderList(plan.unavailable, (f) => {
                  _push2(`<div class="plan-feature plan-feature-no" data-v-66d6f49d${_scopeId}><span class="feature-check feature-check-no" data-v-66d6f49d${_scopeId}>—</span><span data-v-66d6f49d${_scopeId}>${ssrInterpolate(f)}</span></div>`);
                });
                _push2(`<!--]--></div></div>`);
              });
              _push2(`<!--]--></div><!--]-->`);
            } else {
              _push2(`<div class="pricing-empty-state" data-v-66d6f49d${_scopeId}><div class="pricing-empty-icon" data-v-66d6f49d${_scopeId}>`);
              _push2(ssrRenderComponent(unref(SparklesIcon), { style: { "width": "28px", "height": "28px" } }, null, _parent2, _scopeId));
              _push2(`</div><div class="pricing-empty-title" data-v-66d6f49d${_scopeId}>Belum ada paket tersedia</div><p class="pricing-empty-desc" data-v-66d6f49d${_scopeId}> Saat ini belum ada paket harga yang bisa ditampilkan untuk jenis layanan Anda. Silakan hubungi tim kami untuk informasi lebih lanjut. </p></div>`);
            }
            _push2(`<div class="guarantee-strip" data-v-66d6f49d${_scopeId}><div class="guarantee-item" data-v-66d6f49d${_scopeId}><span class="guarantee-icon" data-v-66d6f49d${_scopeId}>🔒</span><span data-v-66d6f49d${_scopeId}>Sistem pembayaran yang cepat, mudah dan aman</span></div><div class="guarantee-divider" data-v-66d6f49d${_scopeId}></div><div class="guarantee-item" data-v-66d6f49d${_scopeId}><span class="guarantee-icon" data-v-66d6f49d${_scopeId}>↩️</span><span data-v-66d6f49d${_scopeId}>Uji coba 14 hari dan batalkan kapan saja</span></div><div class="guarantee-divider" data-v-66d6f49d${_scopeId}></div><div class="guarantee-item" data-v-66d6f49d${_scopeId}><span class="guarantee-icon" data-v-66d6f49d${_scopeId}>📞</span><span data-v-66d6f49d${_scopeId}>Dukungan layanan uptime 24/7</span></div></div><div class="faq-section" data-v-66d6f49d${_scopeId}><div class="section-title" data-v-66d6f49d${_scopeId}>Pertanyaan Umum</div><div class="faq-list" data-v-66d6f49d${_scopeId}><!--[-->`);
            ssrRenderList(faqs, (item, i) => {
              _push2(`<div class="${ssrRenderClass([{ "faq-item-open": openFaq.value === i }, "faq-item"])}" data-v-66d6f49d${_scopeId}><button class="faq-question" data-v-66d6f49d${_scopeId}><span data-v-66d6f49d${_scopeId}>${ssrInterpolate(item.q)}</span><span class="${ssrRenderClass([{ "faq-chevron-open": openFaq.value === i }, "faq-chevron"])}" data-v-66d6f49d${_scopeId}>›</span></button><div class="faq-answer" style="${ssrRenderStyle(openFaq.value === i ? null : { display: "none" })}" data-v-66d6f49d${_scopeId}>${ssrInterpolate(item.a)}</div></div>`);
            });
            _push2(`<!--]--></div></div>`);
            _push2(ssrRenderComponent(SubscriptionInvoiceModal, {
              show: showModal.value,
              loading: modalLoading.value,
              submitting: submitting.value,
              calc: modalCalc.value,
              "plan-name": modalPlan.value?.name,
              "accent-color": modalPlan.value?.accent,
              onClose: closeModal,
              onConfirm: confirmSubscribe
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "pricing-hero" }, [
                createVNode("div", { class: "hero-badge" }, [
                  createVNode(unref(SparklesIcon), { class: "hero-badge-icon" }),
                  createTextVNode(" Paket Layanan & Daftar Harga ")
                ]),
                createVNode("h1", { class: "hero-title hidden sm:block" }, [
                  createTextVNode("Berbagai macam fitur "),
                  createVNode("span", { class: "hidden sm:inline-flex" }, "untuk semua kebutuhanmu!")
                ]),
                createVNode("p", { class: "hero-sub" }, [
                  createTextVNode("Akses fitur lengkap sepuasnya, berhenti berlangganan kapan saja. "),
                  createVNode("span", { class: "hidden sm:inline-flex" }, "Tanpa kontrak panjang, tanpa kartu kredit dan tanpa biaya tersembunyi.")
                ]),
                createVNode("div", {
                  class: "billing-toggle",
                  ref_key: "billingToggle",
                  ref: billingToggle,
                  "data-cycle": billingCycle.value
                }, [
                  createVNode("div", { class: "toggle-slider-pill" }),
                  createVNode("button", {
                    class: ["toggle-btn", { active: billingCycle.value === "monthly" }],
                    onClick: ($event) => billingCycle.value = "monthly"
                  }, "Bulanan", 10, ["onClick"]),
                  createVNode("button", {
                    class: ["toggle-btn", { active: billingCycle.value === "yearly" }],
                    onClick: ($event) => billingCycle.value = "yearly"
                  }, [
                    createTextVNode(" Tahunan "),
                    avgYearlyDiscount.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "toggle-save"
                    }, "Hemat hingga ~30%")) : createCommentVNode("", true)
                  ], 10, ["onClick"])
                ], 8, ["data-cycle"])
              ]),
              planList.value.length > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                createVNode("div", {
                  class: "slider-root desktop-only",
                  ref_key: "sliderRoot",
                  ref: sliderRoot,
                  onKeydown,
                  tabindex: "-1"
                }, [
                  createVNode("button", {
                    class: "slider-arrow slider-arrow-left",
                    disabled: currentIndex.value === 0,
                    onClick: ($event) => scrollToIndex(currentIndex.value - 1),
                    "aria-label": "Sebelumnya"
                  }, [
                    createVNode(unref(ChevronLeftIcon), { class: "arrow-icon" })
                  ], 8, ["disabled", "onClick"]),
                  createVNode("div", {
                    class: "slider-track",
                    ref_key: "track",
                    ref: track,
                    onScrollPassive: _ctx.onCarouselScroll
                  }, [
                    createVNode("div", {
                      class: "track-spacer",
                      "aria-hidden": "true"
                    }),
                    (openBlock(true), createBlock(Fragment, null, renderList(planList.value, (plan, i) => {
                      return openBlock(), createBlock("div", {
                        key: plan.key,
                        class: ["plan-card", {
                          "card-active": currentIndex.value === i,
                          "card-side": Math.abs(currentIndex.value - i) === 1,
                          "card-far": Math.abs(currentIndex.value - i) >= 2,
                          "plan-card-current": isCurrentPlan(plan)
                        }],
                        style: { "--accent": plan.accent },
                        onClick: ($event) => currentIndex.value !== i && scrollToIndex(i)
                      }, [
                        plan.badge && currentIndex.value === i ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "plan-popular-badge"
                        }, [
                          createVNode(unref(SparklesIcon), { style: { "width": "11px", "height": "11px" } }),
                          createTextVNode(" " + toDisplayString(plan.badge), 1)
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "plan-header" }, [
                          createVNode("div", { class: "plan-icon" }, [
                            plan.key === "basic" ? (openBlock(), createBlock(unref(AcademicCapIcon), {
                              key: 0,
                              style: { "width": "16px", "height": "16px" }
                            })) : plan.key === "enterprise" ? (openBlock(), createBlock(unref(BuildingLibraryIcon), {
                              key: 1,
                              style: { "width": "16px", "height": "16px" }
                            })) : plan.key === "expertise" ? (openBlock(), createBlock(unref(SparklesIcon), {
                              key: 2,
                              style: { "width": "16px", "height": "16px" }
                            })) : (openBlock(), createBlock(unref(BoltIcon), {
                              key: 3,
                              style: { "width": "16px", "height": "16px" }
                            }))
                          ]),
                          createVNode("div", null, [
                            createVNode("div", { class: "plan-name" }, toDisplayString(plan.name), 1),
                            createVNode("div", { class: "plan-desc" }, toDisplayString(plan.desc), 1)
                          ])
                        ]),
                        createVNode("div", { class: "plan-price-block" }, [
                          plan.priceLabel ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "plan-price-custom"
                          }, toDisplayString(plan.priceLabel), 1)) : plan.price[billingCycle.value] === 0 ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createVNode("div", { class: "plan-price-amount" }, "Gratis"),
                            createVNode("div", { class: "plan-price-period" }, "selamanya")
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                            createVNode("div", { class: "plan-price-row" }, [
                              createVNode("span", { class: "plan-price-currency" }, "Rp"),
                              createVNode("span", { class: "plan-price-amount" }, toDisplayString(formatPrice(plan.price[billingCycle.value])), 1)
                            ]),
                            createVNode("div", { class: "plan-price-period" }, [
                              createTextVNode(" per bulan"),
                              billingCycle.value === "yearly" ? (openBlock(), createBlock("span", { key: 0 }, " · ditagih tahunan")) : createCommentVNode("", true)
                            ]),
                            billingCycle.value === "yearly" && getSaving(plan) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "plan-price-saving"
                            }, " Hemat " + toDisplayString(getSavingPercent(plan)) + "% · Rp " + toDisplayString(getSaving(plan)) + "/tahun ", 1)) : createCommentVNode("", true)
                          ], 64))
                        ]),
                        plan.maxUsers ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "plan-users flex justify-center"
                        }, [
                          createTextVNode(" Hingga "),
                          createVNode("strong", { class: "pl-1" }, toDisplayString(plan.maxUsers.toLocaleString("id-ID")) + " pengguna", 1)
                        ])) : plan.key === "expertise" ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "plan-users flex justify-center"
                        }, [
                          createVNode("strong", null, "Unlimited account")
                        ])) : createCommentVNode("", true),
                        createVNode("button", {
                          class: ["plan-cta", {
                            "plan-cta-highlight": plan.highlight && !isCurrentPlan(plan),
                            "plan-cta-current": isCurrentPlan(plan),
                            "plan-cta-accent": !plan.highlight && !isCurrentPlan(plan)
                          }],
                          disabled: isCurrentPlan(plan),
                          tabindex: currentIndex.value === i ? 0 : -1,
                          onClick: withModifiers(($event) => handleCta(plan), ["stop"])
                        }, toDisplayString(isCurrentPlan(plan) ? "✓ Paket Aktif" : plan.cta), 11, ["disabled", "tabindex", "onClick"]),
                        createVNode("div", { class: "plan-features" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(plan.features, (f) => {
                            return openBlock(), createBlock("div", {
                              key: f,
                              class: "plan-feature"
                            }, [
                              createVNode(unref(CheckIcon), { class: "feature-check feature-check-yes" }),
                              createVNode("span", null, toDisplayString(f), 1)
                            ]);
                          }), 128)),
                          (openBlock(true), createBlock(Fragment, null, renderList(plan.unavailable, (f) => {
                            return openBlock(), createBlock("div", {
                              key: f,
                              class: "plan-feature plan-feature-no"
                            }, [
                              createVNode("span", { class: "feature-check feature-check-no" }, "—"),
                              createVNode("span", null, toDisplayString(f), 1)
                            ]);
                          }), 128))
                        ])
                      ], 14, ["onClick"]);
                    }), 128)),
                    createVNode("div", {
                      class: "track-spacer",
                      "aria-hidden": "true"
                    })
                  ], 40, ["onScrollPassive"]),
                  createVNode("button", {
                    class: "slider-arrow slider-arrow-right",
                    disabled: currentIndex.value === planList.value.length - 1,
                    onClick: ($event) => scrollToIndex(currentIndex.value + 1),
                    "aria-label": "Berikutnya"
                  }, [
                    createVNode(unref(ChevronRightIcon), { class: "arrow-icon" })
                  ], 8, ["disabled", "onClick"])
                ], 544),
                createVNode("div", {
                  class: "slider-dots desktop-only",
                  role: "tablist"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(planList.value, (plan, i) => {
                    return openBlock(), createBlock("button", {
                      key: plan.key,
                      class: ["dot", { "dot-active": currentIndex.value === i }],
                      style: currentIndex.value === i ? { background: plan.accent, width: "26px" } : {},
                      onClick: ($event) => scrollToIndex(i),
                      "aria-label": plan.name,
                      role: "tab",
                      "aria-selected": currentIndex.value === i
                    }, null, 14, ["onClick", "aria-label", "aria-selected"]);
                  }), 128))
                ]),
                createVNode("div", { class: "slider-labels desktop-only" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(planList.value, (plan, i) => {
                    return openBlock(), createBlock("span", {
                      key: plan.key,
                      class: ["slider-label", { "label-active": currentIndex.value === i }],
                      style: currentIndex.value === i ? { color: plan.accent, borderColor: plan.accent + "44", background: plan.accent + "12" } : {},
                      onClick: ($event) => scrollToIndex(i)
                    }, toDisplayString(plan.name), 15, ["onClick"]);
                  }), 128))
                ]),
                createVNode("div", { class: "mobile-cards mobile-only" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(planList.value, (plan) => {
                    return openBlock(), createBlock("div", {
                      key: plan.key,
                      class: ["mobile-plan-card", { "mobile-plan-card-current": isCurrentPlan(plan), "mobile-plan-card-highlight": plan.highlight }],
                      style: { "--accent": plan.accent }
                    }, [
                      plan.badge ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mobile-popular-badge"
                      }, [
                        createVNode(unref(SparklesIcon), { style: { "width": "10px", "height": "10px" } }),
                        createTextVNode(" " + toDisplayString(plan.badge), 1)
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "plan-header" }, [
                        createVNode("div", null, [
                          createVNode("div", { class: "plan-name" }, toDisplayString(plan.name), 1),
                          createVNode("div", { class: "plan-desc" }, toDisplayString(plan.desc), 1)
                        ])
                      ]),
                      createVNode("div", { class: "mobile-price-row" }, [
                        createVNode("div", { class: "plan-price-block" }, [
                          createVNode("div", { class: "plan-price-row" }, [
                            createVNode("span", { class: "plan-price-currency" }, "Rp"),
                            createVNode("span", { class: "plan-price-amount" }, toDisplayString(formatPrice(plan.price[billingCycle.value])), 1)
                          ]),
                          createVNode("div", { class: "plan-price-period" }, [
                            createTextVNode(" per bulan"),
                            billingCycle.value === "yearly" ? (openBlock(), createBlock("span", { key: 0 }, " · ditagih tahunan")) : createCommentVNode("", true)
                          ]),
                          billingCycle.value === "yearly" && getSaving(plan) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "plan-price-saving"
                          }, " Hemat Rp " + toDisplayString(getSaving(plan)) + "/tahun ", 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      plan.maxUsers ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "plan-users flex justify-center"
                      }, [
                        createTextVNode(" Hingga "),
                        createVNode("strong", { class: "pl-1" }, toDisplayString(plan.maxUsers.toLocaleString("id-ID")) + " akun pengguna", 1)
                      ])) : plan.key === "expertise" ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "plan-users flex justify-center"
                      }, [
                        createVNode("strong", { class: "pl-1" }, "Unlimited Akun Pengguna")
                      ])) : createCommentVNode("", true),
                      createVNode("button", {
                        class: ["plan-cta mobile-cta", {
                          "plan-cta-highlight": plan.highlight && !isCurrentPlan(plan),
                          "plan-cta-current": isCurrentPlan(plan),
                          "plan-cta-accent": !plan.highlight && !isCurrentPlan(plan)
                        }],
                        disabled: isCurrentPlan(plan),
                        onClick: ($event) => handleCta(plan)
                      }, toDisplayString(isCurrentPlan(plan) ? "✓ Aktif" : plan.cta), 11, ["disabled", "onClick"]),
                      createVNode("div", { class: "plan-features" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(plan.features, (f) => {
                          return openBlock(), createBlock("div", {
                            key: f,
                            class: "plan-feature"
                          }, [
                            createVNode(unref(CheckIcon), { class: "feature-check feature-check-yes" }),
                            createVNode("span", null, toDisplayString(f), 1)
                          ]);
                        }), 128)),
                        (openBlock(true), createBlock(Fragment, null, renderList(plan.unavailable, (f) => {
                          return openBlock(), createBlock("div", {
                            key: f,
                            class: "plan-feature plan-feature-no"
                          }, [
                            createVNode("span", { class: "feature-check feature-check-no" }, "—"),
                            createVNode("span", null, toDisplayString(f), 1)
                          ]);
                        }), 128))
                      ])
                    ], 6);
                  }), 128))
                ])
              ], 64)) : (openBlock(), createBlock("div", {
                key: 1,
                class: "pricing-empty-state"
              }, [
                createVNode("div", { class: "pricing-empty-icon" }, [
                  createVNode(unref(SparklesIcon), { style: { "width": "28px", "height": "28px" } })
                ]),
                createVNode("div", { class: "pricing-empty-title" }, "Belum ada paket tersedia"),
                createVNode("p", { class: "pricing-empty-desc" }, " Saat ini belum ada paket harga yang bisa ditampilkan untuk jenis layanan Anda. Silakan hubungi tim kami untuk informasi lebih lanjut. ")
              ])),
              createVNode("div", { class: "guarantee-strip" }, [
                createVNode("div", { class: "guarantee-item" }, [
                  createVNode("span", { class: "guarantee-icon" }, "🔒"),
                  createVNode("span", null, "Sistem pembayaran yang cepat, mudah dan aman")
                ]),
                createVNode("div", { class: "guarantee-divider" }),
                createVNode("div", { class: "guarantee-item" }, [
                  createVNode("span", { class: "guarantee-icon" }, "↩️"),
                  createVNode("span", null, "Uji coba 14 hari dan batalkan kapan saja")
                ]),
                createVNode("div", { class: "guarantee-divider" }),
                createVNode("div", { class: "guarantee-item" }, [
                  createVNode("span", { class: "guarantee-icon" }, "📞"),
                  createVNode("span", null, "Dukungan layanan uptime 24/7")
                ])
              ]),
              createVNode("div", { class: "faq-section" }, [
                createVNode("div", { class: "section-title" }, "Pertanyaan Umum"),
                createVNode("div", { class: "faq-list" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(faqs, (item, i) => {
                    return createVNode("div", {
                      key: i,
                      class: ["faq-item", { "faq-item-open": openFaq.value === i }]
                    }, [
                      createVNode("button", {
                        class: "faq-question",
                        onClick: ($event) => toggleFaq(i)
                      }, [
                        createVNode("span", null, toDisplayString(item.q), 1),
                        createVNode("span", {
                          class: ["faq-chevron", { "faq-chevron-open": openFaq.value === i }]
                        }, "›", 2)
                      ], 8, ["onClick"]),
                      withDirectives(createVNode("div", { class: "faq-answer" }, toDisplayString(item.a), 513), [
                        [vShow, openFaq.value === i]
                      ])
                    ], 2);
                  }), 64))
                ])
              ]),
              createVNode(SubscriptionInvoiceModal, {
                show: showModal.value,
                loading: modalLoading.value,
                submitting: submitting.value,
                calc: modalCalc.value,
                "plan-name": modalPlan.value?.name,
                "accent-color": modalPlan.value?.accent,
                onClose: closeModal,
                onConfirm: confirmSubscribe
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Owner/Pricing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Pricing = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-66d6f49d"]]);
export {
  Pricing as default
};
