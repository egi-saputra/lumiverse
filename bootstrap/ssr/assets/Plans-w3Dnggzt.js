import { ref, watch, computed, onMounted, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { useForm, Head } from "@inertiajs/vue3";
import { PlusIcon, Bars3Icon, PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/vue/24/outline";
const _sfc_main = {
  __name: "Plans",
  __ssrInlineRender: true,
  props: {
    plans: Array
  },
  setup(__props) {
    const props = __props;
    const localPlans = ref([...props.plans]);
    watch(() => props.plans, (val) => {
      localPlans.value = [...val];
    });
    const showModal = ref(false);
    const editingPlan = ref(null);
    const form = useForm({
      key: "",
      product_type: "school",
      name: "",
      description: "",
      price_monthly: 0,
      price_yearly: 0,
      tax: 0,
      discount: 0,
      max_users: "",
      duration_days: "",
      features: [],
      unavailable_features: [],
      badge: "",
      accent_color: "#00d4ff",
      is_highlighted: false,
      is_active: true,
      sort_order: 0
    });
    const newFeature = ref("");
    const newUnavailable = ref("");
    const dragging = ref(null);
    function formatPrice(val) {
      if (!val) return "Gratis";
      return "Rp " + new Intl.NumberFormat("id-ID").format(val);
    }
    const planToDelete = computed(
      () => localPlans.value.find((p) => p.id === confirmDeleteId.value)
    );
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Manajemen Paket" }, null, _parent));
      _push(`<div class="max-w-6xl mx-auto px-6 py-8"><div class="flex items-start justify-between gap-4 mb-6"><div><h1 class="text-xl font-extrabold mb-1">Manajemen Paket / Plan</h1><p class="text-sm text-[var(--muted)]">Tambah, edit, dan atur urutan paket yang ditampilkan di halaman pricing.</p></div><button class="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 transition whitespace-nowrap">`);
      _push(ssrRenderComponent(unref(PlusIcon), { class: "w-4 h-4" }, null, _parent));
      _push(` Tambah Paket </button></div>`);
      if (_ctx.$page.props.flash?.success) {
        _push(`<div class="px-4 py-3 rounded-lg text-sm mb-4 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400">${ssrInterpolate(_ctx.$page.props.flash.success)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$page.props.errors?.plan) {
        _push(`<div class="px-4 py-3 rounded-lg text-sm mb-4 bg-rose-400/10 border border-rose-400/30 text-rose-400">${ssrInterpolate(_ctx.$page.props.errors.plan)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (localPlans.value.length) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        ssrRenderList(localPlans.value, (plan, i) => {
          _push(`<div draggable="true" class="${ssrRenderClass([dragging.value === i ? "opacity-50 ring-1 ring-[var(--cyan)]/40" : "", "relative flex flex-col rounded-2xl border bg-[var(--navy)] border-[var(--border)] p-5 transition"])}"><div class="absolute top-4 right-4 cursor-grab active:cursor-grabbing text-[var(--muted)]">`);
          _push(ssrRenderComponent(unref(Bars3Icon), { class: "w-4 h-4" }, null, _parent));
          _push(`</div><div class="flex items-start gap-3 pr-6"><span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style="${ssrRenderStyle({ background: plan.accent_color })}"></span><div class="min-w-0"><div class="font-bold truncate">${ssrInterpolate(plan.name)}</div><div class="text-xs text-[var(--muted)] line-clamp-2">${ssrInterpolate(plan.description)}</div></div></div><div class="flex flex-wrap gap-1.5 mt-3"><span class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-white/10 text-[var(--muted)] whitespace-nowrap">${ssrInterpolate(plan.product_type === "workspace" ? "Workspace" : "School")}</span>`);
          if (plan.badge) {
            _push(`<span class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] whitespace-nowrap">${ssrInterpolate(plan.badge)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (plan.is_highlighted) {
            _push(`<span class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 whitespace-nowrap"> ★ Highlight </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><code class="inline-block w-fit mt-3 font-mono text-xs bg-white/5 px-2 py-0.5 rounded">${ssrInterpolate(plan.key)}</code><div class="grid grid-cols-2 gap-y-2 gap-x-3 mt-4 text-sm"><div><div class="text-[0.7rem] text-[var(--muted)] uppercase tracking-wide">Bulanan</div><div class="font-semibold">${ssrInterpolate(formatPrice(plan.price_monthly))}</div></div><div><div class="text-[0.7rem] text-[var(--muted)] uppercase tracking-wide">Tahunan</div><div class="font-semibold">${ssrInterpolate(formatPrice(plan.price_yearly))}</div></div><div><div class="text-[0.7rem] text-[var(--muted)] uppercase tracking-wide">Maks. User</div><div class="font-semibold">${ssrInterpolate(plan.max_users ? plan.max_users.toLocaleString("id-ID") : "∞")}</div></div><div><div class="text-[0.7rem] text-[var(--muted)] uppercase tracking-wide">Durasi Trial</div><div class="font-semibold">${ssrInterpolate(plan.duration_days ? plan.duration_days + " hari" : "—")}</div></div></div><div class="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border)]"><span class="${ssrRenderClass([plan.is_active ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400", "text-xs font-bold px-2.5 py-1 rounded-full"])}">${ssrInterpolate(plan.is_active ? "Aktif" : "Nonaktif")}</span><div class="flex gap-1.5"><button title="Edit" class="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 flex items-center justify-center transition">`);
          _push(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-4 h-4" }, null, _parent));
          _push(`</button><button title="Hapus" class="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-rose-400 hover:border-rose-400/40 flex items-center justify-center transition">`);
          _push(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent));
          _push(`</button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center text-[var(--muted)] text-sm py-16 rounded-2xl border border-[var(--border)] bg-[var(--navy)]"> Belum ada paket. Klik &quot;Tambah Paket&quot; untuk mulai. </div>`);
      }
      _push(`<p class="text-xs text-[var(--muted)] mt-3">💡 Seret kartu untuk mengubah urutan tampil di halaman pricing.</p>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showModal.value) {
          _push2(`<div class="fixed inset-0 bg-black/65 flex items-center justify-center z-[999] p-4 overflow-y-auto"><div class="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border bg-[var(--navy)] border-[var(--border)]"><div class="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]"><h2 class="text-base font-extrabold">${ssrInterpolate(editingPlan.value ? "Edit Paket" : "Tambah Paket Baru")}</h2><button class="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 flex items-center justify-center transition">`);
          _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent));
          _push2(`</button></div><div class="px-6 py-5 overflow-y-auto flex-1"><div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4"><div class="flex flex-col gap-1.5 sm:col-span-2"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Nama Paket <span class="text-rose-400">*</span></label><input${ssrRenderAttr("value", unref(form).name)} class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="contoh: Pro, Enterprise">`);
          if (unref(form).errors.name) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.name)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Key <span class="font-normal normal-case text-[0.73rem]">(auto-generate jika kosong)</span></label><input${ssrRenderAttr("value", unref(form).key)}${ssrIncludeBooleanAttr(!!editingPlan.value) ? " disabled" : ""} class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm font-mono outline-none focus:border-[var(--cyan)] disabled:opacity-45 disabled:cursor-not-allowed transition" placeholder="contoh: pro">`);
          if (unref(form).errors.key) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.key)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<p class="text-xs text-[var(--muted)]">Key dipakai di kolom tenants.plan — tidak bisa diubah setelah disimpan.</p></div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Produk <span class="text-rose-400">*</span></label><select class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"><option value="school"${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_type) ? ssrLooseContain(unref(form).product_type, "school") : ssrLooseEqual(unref(form).product_type, "school")) ? " selected" : ""}>Lumiverse School</option><option value="workspace"${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_type) ? ssrLooseContain(unref(form).product_type, "workspace") : ssrLooseEqual(unref(form).product_type, "workspace")) ? " selected" : ""}>Lumiverse Workspace</option></select>`);
          if (unref(form).errors.product_type) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.product_type)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Badge <span class="font-normal normal-case text-[0.73rem]">(opsional)</span></label><input${ssrRenderAttr("value", unref(form).badge)} class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="Paling Populer">`);
          if (unref(form).errors.badge) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.badge)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5 sm:col-span-2"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Deskripsi</label><textarea rows="2" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] resize-y min-h-[60px] transition" placeholder="Deskripsi singkat paket ini">${ssrInterpolate(unref(form).description)}</textarea>`);
          if (unref(form).errors.description) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.description)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Harga Bulanan (Rp) <span class="text-rose-400">*</span></label><input${ssrRenderAttr("value", unref(form).price_monthly)} type="number" min="0" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="0 = Gratis">`);
          if (unref(form).errors.price_monthly) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.price_monthly)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Harga Tahunan (Rp) <span class="text-rose-400">*</span></label><input${ssrRenderAttr("value", unref(form).price_yearly)} type="number" min="0" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="0 = Gratis">`);
          if (unref(form).errors.price_yearly) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.price_yearly)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Pajak (%) </label><input${ssrRenderAttr("value", unref(form).tax)} type="number" min="0" max="100" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="0">`);
          if (unref(form).errors.tax) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.tax)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Diskon (%) </label><input${ssrRenderAttr("value", unref(form).discount)} type="number" min="0" max="100" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="0">`);
          if (unref(form).errors.discount) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.discount)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Maks. Pengguna <span class="font-normal normal-case text-[0.73rem]">(kosong = unlimited)</span></label><input${ssrRenderAttr("value", unref(form).max_users)} type="number" min="1" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="contoh: 300">`);
          if (unref(form).errors.max_users) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.max_users)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Durasi Trial (hari) <span class="font-normal normal-case text-[0.73rem]">(kosong = tanpa batas)</span></label><input${ssrRenderAttr("value", unref(form).duration_days)} type="number" min="1" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="contoh: 30">`);
          if (unref(form).errors.duration_days) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.duration_days)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Warna Aksen</label><div class="flex gap-2 items-center"><input${ssrRenderAttr("value", unref(form).accent_color)} class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="#00d4ff"><input type="color"${ssrRenderAttr("value", unref(form).accent_color)} class="w-[38px] h-[38px] rounded-lg border border-[var(--border)] bg-transparent cursor-pointer p-0.5 flex-shrink-0"></div>`);
          if (unref(form).errors.accent_color) {
            _push2(`<p class="text-xs text-rose-400">${ssrInterpolate(unref(form).errors.accent_color)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex flex-col gap-1.5"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Sort Order</label><input${ssrRenderAttr("value", unref(form).sort_order)} type="number" min="0" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"></div><div class="flex flex-col gap-2 sm:col-span-2"><label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_highlighted) ? ssrLooseContain(unref(form).is_highlighted, null) : unref(form).is_highlighted) ? " checked" : ""} class="w-4 h-4 cursor-pointer accent-[var(--cyan)]"><span>Jadikan sebagai kartu highlight (ditonjolkan di UI)</span></label><label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} class="w-4 h-4 cursor-pointer accent-[var(--cyan)]"><span>Paket aktif (tampil di halaman pricing)</span></label></div><div class="flex flex-col gap-1.5 sm:col-span-2"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Daftar Fitur Tersedia</label><div class="flex gap-2"><input${ssrRenderAttr("value", newFeature.value)} class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="Tambah fitur, tekan Enter"><button type="button" class="w-[38px] h-[38px] rounded-lg border border-[var(--border)] bg-white/5 hover:bg-white/10 text-lg flex-shrink-0 transition">+</button></div><div class="flex flex-wrap gap-1.5 mt-1 min-h-[28px]"><!--[-->`);
          ssrRenderList(unref(form).features, (f, i) => {
            _push2(`<span class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400">${ssrInterpolate(f)} <button class="opacity-70 hover:opacity-100 leading-none">×</button></span>`);
          });
          _push2(`<!--]-->`);
          if (!unref(form).features.length) {
            _push2(`<span class="text-xs text-[var(--muted)]">Belum ada fitur.</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div><div class="flex flex-col gap-1.5 sm:col-span-2"><label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]"> Fitur Tidak Tersedia <span class="font-normal normal-case text-[0.73rem]">(ditampilkan dengan strikethrough)</span></label><div class="flex gap-2"><input${ssrRenderAttr("value", newUnavailable.value)} class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="Tambah fitur tidak tersedia, tekan Enter"><button type="button" class="w-[38px] h-[38px] rounded-lg border border-[var(--border)] bg-white/5 hover:bg-white/10 text-lg flex-shrink-0 transition">+</button></div><div class="flex flex-wrap gap-1.5 mt-1 min-h-[28px]"><!--[-->`);
          ssrRenderList(unref(form).unavailable_features, (f, i) => {
            _push2(`<span class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/5 text-[var(--muted)]">${ssrInterpolate(f)} <button class="opacity-70 hover:opacity-100 leading-none">×</button></span>`);
          });
          _push2(`<!--]-->`);
          if (!unref(form).unavailable_features.length) {
            _push2(`<span class="text-xs text-[var(--muted)]">Kosong.</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div></div><div class="flex justify-end gap-2 px-6 py-4 border-t border-[var(--border)]"><button class="text-sm font-semibold px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition"> Batal </button><button${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="text-sm font-bold px-4 py-2 rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition">${ssrInterpolate(unref(form).processing ? "Menyimpan..." : editingPlan.value ? "Simpan Perubahan" : "Buat Paket")}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (_ctx.confirmDeleteId) {
          _push2(`<div class="fixed inset-0 bg-black/65 flex items-center justify-center z-[999] p-4 overflow-y-auto"><div class="w-full max-w-md rounded-3xl border bg-[var(--navy)] border-[var(--border)]"><div class="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]"><h2 class="text-base font-extrabold">Hapus Paket?</h2><button class="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 flex items-center justify-center transition">`);
          _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent));
          _push2(`</button></div><div class="px-6 py-5"><p class="text-sm">Paket <strong>${ssrInterpolate(planToDelete.value?.name)}</strong> akan dihapus permanen. Pastikan tidak ada tenant aktif yang menggunakan paket ini.</p></div><div class="flex justify-end gap-2 px-6 py-4 border-t border-[var(--border)]"><button class="text-sm font-semibold px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition"> Batal </button><button class="text-sm font-bold px-4 py-2 rounded-lg bg-rose-400 text-[#0a0f1e] hover:opacity-90 transition"> Ya, Hapus </button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Developer/Plans.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
