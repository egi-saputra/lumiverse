import { ref, reactive, computed, onMounted, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import axios from "axios";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const API_BASE = "/api/v1/admin/hero-slides";
const _sfc_main = {
  __name: "HeroSlideAdmin",
  __ssrInlineRender: true,
  setup(__props) {
    const slides = ref([]);
    const loading = ref(false);
    const saving = ref(false);
    const deletingId = ref(null);
    const toast = ref(null);
    const showForm = ref(false);
    const editingSlide = ref(null);
    const dragOverIndex = ref(null);
    const dragIndex = ref(null);
    const form = reactive({
      label: "",
      heading: ["", ""],
      accent: 0,
      sub: "",
      tag: "",
      cta: "Lihat Program",
      cta_target: "programs",
      order: 0,
      is_active: true,
      imageFile: null,
      imagePreview: null
    });
    const ctaTargets = ["home", "about", "programs", "facilities", "contact"];
    const formTitle = computed(() => editingSlide.value ? "Edit Slide" : "Tambah Slide Baru");
    function showToast(message, type = "success") {
      toast.value = { message, type };
      setTimeout(() => toast.value = null, 3500);
    }
    function parseErrorMessage(e) {
      const data = e.response?.data;
      if (!data) return "Terjadi kesalahan jaringan.";
      if (data.errors && typeof data.errors === "object") {
        return Object.values(data.errors).flat().join(" ");
      }
      if (data.message) return data.message;
      return "Terjadi kesalahan.";
    }
    async function fetchSlides() {
      loading.value = true;
      try {
        const { data } = await axios.get(API_BASE);
        slides.value = data;
      } catch (e) {
        showToast(parseErrorMessage(e), "error");
      } finally {
        loading.value = false;
      }
    }
    onMounted(fetchSlides);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-wrap" }, _attrs))} data-v-72033cdc><header class="adm-header" data-v-72033cdc><div class="adm-header-inner" data-v-72033cdc><div class="adm-logo" data-v-72033cdc><div class="logo-mark" data-v-72033cdc></div><div data-v-72033cdc><span class="logo-title" data-v-72033cdc>SMK Nusantara</span><span class="logo-sub" data-v-72033cdc>Admin Panel</span></div></div><div class="adm-header-right" data-v-72033cdc><span class="breadcrumb" data-v-72033cdc>Dashboard / <strong data-v-72033cdc>Hero Slides</strong></span></div></div></header><main class="adm-main" data-v-72033cdc><div class="page-bar" data-v-72033cdc><div data-v-72033cdc><h1 class="page-title" data-v-72033cdc>Hero Slides</h1><p class="page-desc" data-v-72033cdc>Kelola gambar dan konten hero section halaman utama.</p></div><button class="btn-add" data-v-72033cdc><svg width="16" height="16" viewBox="0 0 16 16" fill="none" data-v-72033cdc><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-72033cdc></path></svg> Tambah Slide </button></div>`);
      if (loading.value) {
        _push(`<div class="loading-state" data-v-72033cdc><div class="spinner" data-v-72033cdc></div><span data-v-72033cdc>Memuat data...</span></div>`);
      } else if (slides.value.length === 0) {
        _push(`<div class="empty-state" data-v-72033cdc><svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity=".3" data-v-72033cdc><rect x="4" y="10" width="40" height="28" rx="3" stroke="#C9A84C" stroke-width="2" data-v-72033cdc></rect><path d="M4 18h40" stroke="#C9A84C" stroke-width="2" data-v-72033cdc></path><circle cx="24" cy="30" r="5" stroke="#C9A84C" stroke-width="2" data-v-72033cdc></circle></svg><p data-v-72033cdc>Belum ada slide. Klik <strong data-v-72033cdc>Tambah Slide</strong> untuk memulai.</p></div>`);
      } else {
        _push(`<div class="slides-grid" data-v-72033cdc><!--[-->`);
        ssrRenderList(slides.value, (slide, i) => {
          _push(`<div class="${ssrRenderClass([{
            "drag-over": dragOverIndex.value === i,
            "is-inactive": !slide.is_active,
            "is-dragging": dragIndex.value === i
          }, "slide-card"])}" draggable="true" data-v-72033cdc><div class="drag-handle" title="Seret untuk mengubah urutan" data-v-72033cdc><svg width="16" height="16" viewBox="0 0 16 16" fill="none" data-v-72033cdc><circle cx="6" cy="4" r="1.5" fill="currentColor" data-v-72033cdc></circle><circle cx="6" cy="8" r="1.5" fill="currentColor" data-v-72033cdc></circle><circle cx="6" cy="12" r="1.5" fill="currentColor" data-v-72033cdc></circle><circle cx="10" cy="4" r="1.5" fill="currentColor" data-v-72033cdc></circle><circle cx="10" cy="8" r="1.5" fill="currentColor" data-v-72033cdc></circle><circle cx="10" cy="12" r="1.5" fill="currentColor" data-v-72033cdc></circle></svg></div><div class="card-thumb" style="${ssrRenderStyle(`background-image:url('${slide.image_url}')`)}" data-v-72033cdc><div class="card-thumb-overlay" data-v-72033cdc></div><span class="card-order" data-v-72033cdc>#${ssrInterpolate(i + 1)}</span><span class="${ssrRenderClass([slide.is_active ? "badge-active" : "badge-inactive", "card-badge"])}" data-v-72033cdc>${ssrInterpolate(slide.is_active ? "Aktif" : "Nonaktif")}</span></div><div class="card-body" data-v-72033cdc><div class="card-label" data-v-72033cdc>${ssrInterpolate(slide.label)}</div><div class="card-heading" data-v-72033cdc><!--[-->`);
          ssrRenderList(slide.heading, (h, hi) => {
            _push(`<span class="${ssrRenderClass({ "hd-gold": hi === slide.accent })}" data-v-72033cdc>${ssrInterpolate(h)}</span>`);
          });
          _push(`<!--]--></div><p class="card-sub" data-v-72033cdc>${ssrInterpolate(slide.sub)}</p><div class="card-meta" data-v-72033cdc>`);
          if (slide.tag) {
            _push(`<span class="meta-tag" data-v-72033cdc>${ssrInterpolate(slide.tag)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="meta-cta" data-v-72033cdc>${ssrInterpolate(slide.cta)} → #${ssrInterpolate(slide.cta_target)}</span></div></div><div class="card-actions" data-v-72033cdc><button class="${ssrRenderClass([slide.is_active ? "toggle-on" : "toggle-off", "action-btn toggle-btn"])}"${ssrRenderAttr("title", slide.is_active ? "Nonaktifkan" : "Aktifkan")} data-v-72033cdc><svg width="14" height="14" viewBox="0 0 14 14" fill="none" data-v-72033cdc><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5" data-v-72033cdc></circle>`);
          if (slide.is_active) {
            _push(`<path d="M5 7l2 2 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-72033cdc></path>`);
          } else {
            _push(`<path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" data-v-72033cdc></path>`);
          }
          _push(`</svg> ${ssrInterpolate(slide.is_active ? "Aktif" : "Nonaktif")}</button><div class="action-right" data-v-72033cdc><button class="icon-btn edit-btn" title="Edit" data-v-72033cdc><svg width="15" height="15" viewBox="0 0 15 15" fill="none" data-v-72033cdc><path d="M10.5 2.5l2 2-8 8H2.5v-2l8-8z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" data-v-72033cdc></path></svg></button><button class="icon-btn delete-btn"${ssrIncludeBooleanAttr(deletingId.value === slide.id) ? " disabled" : ""} title="Hapus" data-v-72033cdc>`);
          if (deletingId.value !== slide.id) {
            _push(`<svg width="15" height="15" viewBox="0 0 15 15" fill="none" data-v-72033cdc><path d="M2 4h11M5 4V2h5v2M6 7v4M9 7v4M3 4l1 9h7l1-9H3z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" data-v-72033cdc></path></svg>`);
          } else {
            _push(`<span class="mini-spin" data-v-72033cdc></span>`);
          }
          _push(`</button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (slides.value.length > 1) {
        _push(`<div class="order-save-bar" data-v-72033cdc><p class="order-hint" data-v-72033cdc><svg width="14" height="14" viewBox="0 0 14 14" fill="none" data-v-72033cdc><path d="M7 1v6M4 4l3-3 3 3" stroke="#C9A84C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" data-v-72033cdc></path><path d="M2 9v3h10V9" stroke="#C9A84C" stroke-width="1.4" stroke-linecap="round" data-v-72033cdc></path></svg> Seret kartu untuk mengubah urutan tampilan </p><button class="btn-save-order" data-v-72033cdc>Simpan Urutan</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
      if (showForm.value) {
        _push(`<div class="overlay" data-v-72033cdc></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showForm.value) {
        _push(`<aside class="drawer" data-v-72033cdc><div class="drawer-header" data-v-72033cdc><h2 class="drawer-title" data-v-72033cdc>${ssrInterpolate(formTitle.value)}</h2><button class="close-btn" data-v-72033cdc><svg width="18" height="18" viewBox="0 0 18 18" fill="none" data-v-72033cdc><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" data-v-72033cdc></path></svg></button></div><div class="drawer-body" data-v-72033cdc><div class="field-group" data-v-72033cdc><label class="field-label" data-v-72033cdc>Gambar Slide <span class="req" data-v-72033cdc>*</span></label><div class="${ssrRenderClass([{ "has-preview": form.imagePreview }, "upload-zone"])}" data-v-72033cdc>`);
        if (form.imagePreview) {
          _push(`<img${ssrRenderAttr("src", form.imagePreview)} class="preview-img" alt="preview" data-v-72033cdc>`);
        } else {
          _push(`<div class="upload-placeholder" data-v-72033cdc><svg width="28" height="28" viewBox="0 0 28 28" fill="none" data-v-72033cdc><rect x="2" y="6" width="24" height="16" rx="2" stroke="#C9A84C" stroke-width="1.5" stroke-dasharray="4 3" data-v-72033cdc></rect><circle cx="10" cy="12" r="2" stroke="#C9A84C" stroke-width="1.5" data-v-72033cdc></circle><path d="M2 19l6-5 4 4 4-3 6 4" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-72033cdc></path></svg><span data-v-72033cdc>Klik untuk pilih gambar</span><span class="upload-hint" data-v-72033cdc>JPG, PNG, WebP · Maks 4 MB · Rekomendasi 1400×800 px</span></div>`);
        }
        if (form.imagePreview) {
          _push(`<div class="preview-change" data-v-72033cdc>Ganti Gambar</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><input type="file" accept="image/jpeg,image/png,image/webp" class="hidden-input" data-v-72033cdc></div><div class="field-group" data-v-72033cdc><label class="field-label" data-v-72033cdc>Label <span class="req" data-v-72033cdc>*</span></label><input${ssrRenderAttr("value", form.label)} class="field-input" placeholder="e.g. Program Unggulan" data-v-72033cdc></div><div class="field-group" data-v-72033cdc><label class="field-label" data-v-72033cdc> Judul Slide <span class="field-hint" data-v-72033cdc>Setiap baris = satu baris judul</span></label><div class="heading-lines" data-v-72033cdc><!--[-->`);
        ssrRenderList(form.heading, (_, i) => {
          _push(`<div class="heading-line-row" data-v-72033cdc><span class="line-num" data-v-72033cdc>${ssrInterpolate(i + 1)}</span><input${ssrRenderAttr("value", form.heading[i])} class="field-input"${ssrRenderAttr("placeholder", `Baris ${i + 1}`)} data-v-72033cdc><button class="line-remove"${ssrIncludeBooleanAttr(form.heading.length <= 1) ? " disabled" : ""} title="Hapus baris" data-v-72033cdc><svg width="14" height="14" viewBox="0 0 14 14" fill="none" data-v-72033cdc><path d="M3 7h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" data-v-72033cdc></path></svg></button></div>`);
        });
        _push(`<!--]--></div><button class="btn-add-line"${ssrIncludeBooleanAttr(form.heading.length >= 4) ? " disabled" : ""} data-v-72033cdc> + Tambah Baris </button></div><div class="field-group" data-v-72033cdc><label class="field-label" data-v-72033cdc> Baris Emas (gold) <span class="field-hint" data-v-72033cdc>Indeks baris yang diwarnai emas (mulai dari 0)</span></label><div class="accent-pills" data-v-72033cdc><!--[-->`);
        ssrRenderList(form.heading, (_, i) => {
          _push(`<button class="${ssrRenderClass(["accent-pill", { active: form.accent === i }])}" data-v-72033cdc> Baris ${ssrInterpolate(i + 1)}</button>`);
        });
        _push(`<!--]--></div></div><div class="field-group" data-v-72033cdc><label class="field-label" data-v-72033cdc>Deskripsi <span class="req" data-v-72033cdc>*</span></label><textarea class="field-input field-textarea" placeholder="Tuliskan deskripsi singkat slide..." data-v-72033cdc>${ssrInterpolate(form.sub)}</textarea></div><div class="field-group" data-v-72033cdc><label class="field-label" data-v-72033cdc>Tag / Badge</label><input${ssrRenderAttr("value", form.tag)} class="field-input" placeholder="e.g. Pendaftaran 2025/2026 Dibuka" data-v-72033cdc></div><div class="field-row" data-v-72033cdc><div class="field-group" data-v-72033cdc><label class="field-label" data-v-72033cdc>Teks Tombol</label><input${ssrRenderAttr("value", form.cta)} class="field-input" placeholder="e.g. Lihat Program" data-v-72033cdc></div><div class="field-group" data-v-72033cdc><label class="field-label" data-v-72033cdc>Target Scroll</label><select class="field-input field-select" data-v-72033cdc><!--[-->`);
        ssrRenderList(ctaTargets, (t) => {
          _push(`<option${ssrRenderAttr("value", t)} data-v-72033cdc${ssrIncludeBooleanAttr(Array.isArray(form.cta_target) ? ssrLooseContain(form.cta_target, t) : ssrLooseEqual(form.cta_target, t)) ? " selected" : ""}>#${ssrInterpolate(t)}</option>`);
        });
        _push(`<!--]--></select></div></div><div class="field-row" data-v-72033cdc><div class="field-group" data-v-72033cdc><label class="field-label" data-v-72033cdc>Urutan</label><input${ssrRenderAttr("value", form.order)} type="number" min="0" class="field-input" placeholder="0" data-v-72033cdc></div><div class="field-group field-toggle-group" data-v-72033cdc><label class="field-label" data-v-72033cdc>Status</label><button class="${ssrRenderClass(["toggle-switch", { on: form.is_active }])}" data-v-72033cdc><span class="toggle-knob" data-v-72033cdc></span><span class="toggle-text" data-v-72033cdc>${ssrInterpolate(form.is_active ? "Aktif" : "Nonaktif")}</span></button></div></div></div><div class="drawer-footer" data-v-72033cdc><button class="btn-cancel" data-v-72033cdc>Batal</button><button class="btn-save"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} data-v-72033cdc>`);
        if (saving.value) {
          _push(`<span class="mini-spin white" data-v-72033cdc></span>`);
        } else {
          _push(`<span data-v-72033cdc>${ssrInterpolate(editingSlide.value ? "Simpan Perubahan" : "Tambahkan Slide")}</span>`);
        }
        _push(`</button></div></aside>`);
      } else {
        _push(`<!---->`);
      }
      if (toast.value) {
        _push(`<div class="${ssrRenderClass(["toast", `toast-${toast.value.type}`])}" data-v-72033cdc>`);
        if (toast.value.type === "success") {
          _push(`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" data-v-72033cdc><path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-72033cdc></path></svg>`);
        } else {
          _push(`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" data-v-72033cdc><path d="M8 5v4M8 11v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-72033cdc></path><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5" data-v-72033cdc></circle></svg>`);
        }
        _push(` ${ssrInterpolate(toast.value.message)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/HeroSlideAdmin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HeroSlideAdmin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-72033cdc"]]);
export {
  HeroSlideAdmin as default
};
