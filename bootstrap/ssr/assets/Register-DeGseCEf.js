import { watch, useSSRContext, ref, computed, onMounted, unref, withCtx, createTextVNode } from "vue";
import { ssrRenderTeleport, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { useForm, Head, Link, router } from "@inertiajs/vue3";
import axios from "axios";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import PasswordFields from "./PasswordFields-D4GKJ6WH.js";
const _sfc_main$1 = {
  __name: "ProductSelectModal",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  },
  emits: ["close", "select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const products = [
      {
        type: "school",
        icon: "🏫",
        accent: "school",
        brand: "Lumi",
        name: "Classroom",
        tagline: "Untuk Sekolah / Lembaga Pendidikan",
        desc: "Platform manajemen sekolah lengkap dalam satu aplikasi.",
        features: ["Bank soal & Ujian online", "Materi & Tugas Harian", "Presensi & rekap Absensi otomatis", "Rekap nilai otomatis & Fitur Lainnya"]
      },
      {
        type: "workspace",
        icon: "🏢",
        accent: "workspace",
        brand: "Lumi",
        name: "Workspace",
        tagline: "Untuk Perusahaan / Korporat",
        desc: "Ruang kerja digital untuk kelola tim dan operasional harian.",
        features: ["Manajemen data karyawan", "Modul Pelatihan & Pengembangan", "Psikotest / Test masuk karyawan baru", "Pengumuman, informasi dan lainnya"]
      }
    ];
    watch(() => props.show, (val) => {
      document.body.style.overflow = val ? "hidden" : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.show) {
          _push2(`<div class="product-modal-overlay" data-v-9203a181><div class="product-modal-panel" data-v-9203a181><button type="button" class="product-modal-close" aria-label="Tutup" data-v-9203a181>✕</button><div class="product-modal-header" data-v-9203a181><h2 data-v-9203a181>Pilih Jenis Produk Layanan</h2><p data-v-9203a181>Sesuaikan dengan kebutuhan Anda, bisa diganti kapan saja.</p></div><div class="product-select" data-v-9203a181><div class="product-grid" data-v-9203a181><!--[-->`);
          ssrRenderList(products, (p) => {
            _push2(`<button type="button" class="${ssrRenderClass([`product-card--${p.accent}`, "product-card"])}" data-v-9203a181><span class="product-card__glow" data-v-9203a181></span><span class="product-icon-wrap" data-v-9203a181><span class="product-icon" data-v-9203a181>${ssrInterpolate(p.icon)}</span></span><span class="product-name" data-v-9203a181>${ssrInterpolate(p.brand)} <span class="text-cyan" data-v-9203a181>${ssrInterpolate(p.name)}</span></span><span class="product-tagline" data-v-9203a181>${ssrInterpolate(p.tagline)}</span><span class="product-desc" data-v-9203a181>${ssrInterpolate(p.desc)}</span><ul class="product-features" data-v-9203a181><!--[-->`);
            ssrRenderList(p.features, (f) => {
              _push2(`<li data-v-9203a181><span class="product-feature-dot" data-v-9203a181>✓</span>${ssrInterpolate(f)}</li>`);
            });
            _push2(`<!--]--></ul><span class="product-cta" data-v-9203a181> Gunakan produk ini <span class="product-cta-arrow" data-v-9203a181>→</span></span></button>`);
          });
          _push2(`<!--]--></div>`);
          if (__props.error) {
            _push2(`<div class="field-error text-center" data-v-9203a181>${ssrInterpolate(__props.error)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Modals/ProductSelectModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ProductSelectModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9203a181"]]);
const _sfc_main = {
  __name: "Register",
  __ssrInlineRender: true,
  props: {
    productType: {
      type: String,
      default: "school"
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      product_type: props.productType,
      institution_type: "",
      institution_type_other: "",
      school_name: "",
      subdomain: "",
      logo: null,
      school_level: "",
      npsn: "",
      nss: "",
      registration_number: "",
      registration_number_school: "",
      contact_phone: "",
      institution_email: "",
      institution_website: "",
      address: "",
      admin_name: "",
      admin_email: "",
      admin_phone: "",
      admin_password: "",
      admin_password_confirmation: ""
    });
    const currentStep = ref(1);
    const isWorkspace = computed(() => form.product_type === "workspace");
    const showProductModal = ref(false);
    const totalSteps = computed(() => isWorkspace.value ? 3 : 4);
    const stepLabels = computed(
      () => isWorkspace.value ? ["Detail Perusahaan", "Kontak Perusahaan", "Admin"] : ["Lembaga", "Profil", "Kontak", "Admin"]
    );
    const subdomainTouchedManually = ref(false);
    const centralDomain = window.location.hostname;
    const logoPreview = ref(null);
    const stepErrors = ref({});
    const passwordFieldsRef = ref(null);
    const fieldStepMap = computed(() => {
      if (isWorkspace.value) {
        return {
          school_name: 1,
          subdomain: 1,
          logo: 1,
          registration_number: 1,
          address: 1,
          contact_phone: 2,
          institution_email: 2,
          institution_website: 2,
          admin_name: 3,
          admin_email: 3,
          admin_phone: 3,
          admin_password: 3
        };
      }
      return {
        institution_type: 1,
        institution_type_other: 1,
        school_name: 2,
        subdomain: 2,
        logo: 2,
        school_level: 2,
        npsn: 2,
        nss: 2,
        registration_number: 2,
        contact_phone: 3,
        institution_email: 3,
        institution_website: 3,
        address: 3,
        admin_name: 4,
        admin_email: 4,
        admin_phone: 4,
        admin_password: 4
      };
    });
    function jumpToFirstErrorStep() {
      const errorKeys = Object.keys(form.errors);
      if (errorKeys.length === 0) return;
      const steps = errorKeys.map((key) => fieldStepMap.value[key] || 1);
      currentStep.value = Math.min(...steps);
    }
    onMounted(jumpToFirstErrorStep);
    watch(() => form.errors, jumpToFirstErrorStep);
    let debounceTimer = null;
    const institutionOptions = [
      { value: "sekolah", label: "Sekolah / Madrasah", desc: "SD, SMP, SMA/SMK/Sederajat", icon: "🏫" },
      { value: "yayasan", label: "Yayasan / Lembaga", desc: "Yayasan pendidikan / Lembaga sosial", icon: "🏛️" },
      { value: "kursus", label: "Kursus & Bimbel", desc: "Lembaga pelatihan / bimbingan belajar", icon: "📚" },
      { value: "lainnya", label: "Institusi Lainnya", desc: "Lembaga pendidikan lainnya", icon: "🎓" }
    ];
    const schoolLevelOptions = [
      { value: "sd", label: "SD / MI / Sederajat" },
      { value: "smp", label: "SMP / MTS / Sederajat" },
      { value: "smk", label: "SMA / SMK / Sederajat" }
    ];
    const isSchool = computed(() => form.institution_type === "sekolah");
    const isLainnya = computed(() => form.institution_type === "lainnya");
    const registrationNumberLabel = computed(() => {
      const map = {
        kursus: "Nomor Izin Operasional",
        privat: "NIK / NPWP Penanggung Jawab",
        yayasan: "Nomor Akta Notaris Yayasan",
        lainnya: "Nomor Izin / Legalitas Lembaga"
      };
      return map[form.institution_type] || "Nomor Izin Pendirian / Operasional";
    });
    watch(() => form.school_name, (newName) => {
      if (subdomainTouchedManually.value) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        if (!newName.trim()) {
          form.subdomain = "";
          return;
        }
        try {
          const { data } = await axios.post(route("tenant.suggest-subdomain"), { name: newName });
          form.subdomain = data.subdomain;
        } catch (e) {
        }
      }, 200);
    });
    function fieldError(field) {
      return form.errors[field] || stepErrors.value[field] || null;
    }
    function onSwitchProduct(type) {
      showProductModal.value = false;
      if (type === form.product_type) return;
      router.get(route("tenant.register.form"), { product: type });
    }
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Registration" }, null, _parent));
      _push(`<div class="register-page flex-col" data-v-410eba56><div class="register-card" data-v-410eba56><h1 class="register-title text-center" data-v-410eba56>Saatnya transformasi bersama kami!</h1><p class="register-sub flex sm:flex-row flex-col justify-center text-center gap-1" data-v-410eba56><span data-v-410eba56>Daftar gratis sekarang juga! </span><span data-v-410eba56>Provisioning otomatis dalam hitungan menit.</span></p><div class="steps-bar" data-v-410eba56><!--[-->`);
      ssrRenderList(totalSteps.value, (n) => {
        _push(`<div class="step-item" data-v-410eba56><div class="${ssrRenderClass([{
          "step-active": currentStep.value === n,
          "step-done": currentStep.value > n
        }, "step-circle"])}" data-v-410eba56>`);
        if (currentStep.value > n) {
          _push(`<span data-v-410eba56>✓</span>`);
        } else {
          _push(`<span data-v-410eba56>${ssrInterpolate(n)}</span>`);
        }
        _push(`</div><span class="step-label" data-v-410eba56>${ssrInterpolate(stepLabels.value[n - 1])}</span>`);
        if (n < totalSteps.value) {
          _push(`<div class="${ssrRenderClass([{ "step-line-done": currentStep.value > n }, "step-line"])}" data-v-410eba56></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><form class="register-form" data-v-410eba56>`);
      if (currentStep.value === 1 && isWorkspace.value) {
        _push(`<div data-v-410eba56><div class="field" data-v-410eba56><label for="ws_school_name" data-v-410eba56>* Nama Perusahaan</label><input id="ws_school_name" type="text"${ssrRenderAttr("value", unref(form).school_name)} placeholder="PT Lumi Platforms Indonesia" data-v-410eba56>`);
        if (fieldError("school_name")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("school_name"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="ws_subdomain" data-v-410eba56>* URL / Link Akses Aplikasi</label><div class="subdomain-input" data-v-410eba56><input id="ws_subdomain" type="text"${ssrRenderAttr("value", unref(form).subdomain)} placeholder="lumiplatforms" data-v-410eba56><span class="subdomain-suffix" data-v-410eba56>.${ssrInterpolate(unref(centralDomain))}</span></div>`);
        if (fieldError("subdomain")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("subdomain"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="field-hint" data-v-410eba56>Ini akan jadi alamat khusus workspace perusahaan Anda.</p></div><div class="field" data-v-410eba56><label data-v-410eba56>Logo Perusahaan <span class="optional-tag" data-v-410eba56>(opsional, maks 15MB)</span></label>`);
        if (!logoPreview.value) {
          _push(`<div class="logo-upload" data-v-410eba56><input type="file" accept="image/*" id="ws_logo" class="logo-input" data-v-410eba56><label for="ws_logo" class="logo-upload-label" data-v-410eba56><span class="logo-upload-icon" data-v-410eba56>📷</span><span data-v-410eba56>Klik untuk upload logo</span><span class="field-hint" data-v-410eba56>PNG/JPG/WebP, maks 15MB</span></label></div>`);
        } else {
          _push(`<div class="logo-preview" data-v-410eba56><img${ssrRenderAttr("src", logoPreview.value)} alt="Preview logo" data-v-410eba56><button type="button" class="logo-remove" data-v-410eba56>✕</button></div>`);
        }
        if (fieldError("logo")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("logo"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field-divider" data-v-410eba56></div><div class="field" data-v-410eba56><label for="ws_registration_number" data-v-410eba56>Nomor Legalitas Perusahaan <span class="optional-tag" data-v-410eba56>(opsional, NIB/NPWP/Akta)</span></label><input id="ws_registration_number" type="text"${ssrRenderAttr("value", unref(form).registration_number)} placeholder="Masukkan nomor legalitas perusahaan" data-v-410eba56>`);
        if (fieldError("registration_number")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("registration_number"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="ws_address" data-v-410eba56>* Alamat Lengkap Perusahaan</label><textarea id="ws_address" rows="3" placeholder="Jl. Sudirman No. 1, Jakarta Selatan, 12190." data-v-410eba56>${ssrInterpolate(unref(form).address)}</textarea>`);
        if (fieldError("address")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("address"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="step-actions" data-v-410eba56><button type="button" class="btn-ghost-step" data-v-410eba56>Kembali</button><button type="button" class="btn-hero step-next" data-v-410eba56>Selanjutnya</button></div></div>`);
      } else if (currentStep.value === 2 && isWorkspace.value) {
        _push(`<div data-v-410eba56><p class="step-intro" data-v-410eba56>Informasi kontak ini akan ditampilkan sebagai kontak resmi perusahaan Anda di platform. Semua field pada step ini bersifat opsional.</p><div class="field" data-v-410eba56><label for="ws_contact_phone" data-v-410eba56>Nomor Telepon <span class="optional-tag" data-v-410eba56>(opsional)</span></label><input id="ws_contact_phone" type="text"${ssrRenderAttr("value", unref(form).contact_phone)} placeholder="Masukkan No.Telp Perusahaan" data-v-410eba56>`);
        if (fieldError("contact_phone")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("contact_phone"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="ws_institution_email" data-v-410eba56>Alamat Email <span class="optional-tag" data-v-410eba56>(opsional)</span></label><input id="ws_institution_email" type="email"${ssrRenderAttr("value", unref(form).institution_email)} placeholder="info@perusahaan.co.id" data-v-410eba56>`);
        if (fieldError("institution_email")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("institution_email"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="ws_institution_website" data-v-410eba56>Website Utama <span class="optional-tag" data-v-410eba56>(opsional)</span></label><input id="ws_institution_website" type="text"${ssrRenderAttr("value", unref(form).institution_website)} placeholder="https://perusahaan.co.id" data-v-410eba56>`);
        if (fieldError("institution_website")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("institution_website"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="step-actions" data-v-410eba56><button type="button" class="btn-ghost-step" data-v-410eba56>Kembali</button><button type="button" class="btn-hero step-next" data-v-410eba56>Selanjutnya</button></div></div>`);
      } else if (currentStep.value === 3 && isWorkspace.value) {
        _push(`<div data-v-410eba56><p class="step-intro" data-v-410eba56>Data ini akan digunakan untuk login / masuk ke halaman dashboard Lumiverse Workspace perusahaan Kamu.</p><div class="field" data-v-410eba56><label for="ws_admin_name" data-v-410eba56>* Nama Lengkap (Admin / PIC)</label><input id="ws_admin_name" type="text"${ssrRenderAttr("value", unref(form).admin_name)} placeholder="Budi Santoso" data-v-410eba56>`);
        if (fieldError("admin_name")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("admin_name"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="ws_admin_email" data-v-410eba56>* Alamat Email</label><input id="ws_admin_email" type="email"${ssrRenderAttr("value", unref(form).admin_email)} placeholder="budi@perusahaan.co.id" data-v-410eba56>`);
        if (fieldError("admin_email")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("admin_email"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="ws_admin_phone" data-v-410eba56>* Nomor WhatsApp</label><input id="ws_admin_phone" type="text"${ssrRenderAttr("value", unref(form).admin_phone)} placeholder="08123456789" data-v-410eba56>`);
        if (fieldError("admin_phone")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("admin_phone"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(PasswordFields, {
          ref_key: "passwordFieldsRef",
          ref: passwordFieldsRef,
          password: unref(form).admin_password,
          "onUpdate:password": ($event) => unref(form).admin_password = $event,
          "password-confirmation": unref(form).admin_password_confirmation,
          "onUpdate:passwordConfirmation": ($event) => unref(form).admin_password_confirmation = $event,
          "password-error": fieldError("admin_password"),
          "confirmation-error": fieldError("admin_password_confirmation")
        }, null, _parent));
        if (fieldError("school_name")) {
          _push(`<div class="field-error submit-error" data-v-410eba56>${ssrInterpolate(fieldError("school_name"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="step-actions" data-v-410eba56><button type="button" class="btn-ghost-step" data-v-410eba56>Kembali</button><button type="submit" class="btn-hero step-next"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-410eba56>${ssrInterpolate(unref(form).processing ? "Sedang membuat akun..." : "Daftar Sekarang")}</button></div></div>`);
      } else if (currentStep.value === 1) {
        _push(`<div data-v-410eba56><div class="field" data-v-410eba56><label data-v-410eba56>Apa Jenis Instansi Lembaga Pendidikanmu ?</label><div class="institution-grid" data-v-410eba56><!--[-->`);
        ssrRenderList(institutionOptions, (opt) => {
          _push(`<button type="button" class="${ssrRenderClass([{ "institution-card-active": unref(form).institution_type === opt.value }, "institution-card"])}" data-v-410eba56><span class="institution-icon" data-v-410eba56>${ssrInterpolate(opt.icon)}</span><span class="institution-label" data-v-410eba56>${ssrInterpolate(opt.label)}</span><span class="institution-desc" data-v-410eba56>${ssrInterpolate(opt.desc)}</span></button>`);
        });
        _push(`<!--]--></div>`);
        if (fieldError("institution_type")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("institution_type"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (isLainnya.value) {
          _push(`<div class="field" data-v-410eba56><label for="institution_type_other" data-v-410eba56>Nama Jenis Lembaga Anda</label><input id="institution_type_other" type="text"${ssrRenderAttr("value", unref(form).institution_type_other)} placeholder="Contoh: Komunitas Belajar, Tutor, Private, PAUD, Pesantren dll" data-v-410eba56>`);
          if (fieldError("institution_type_other")) {
            _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("institution_type_other"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="step-actions" data-v-410eba56><button type="button" class="btn-ghost-step" data-v-410eba56>Kembali</button><button type="button" class="btn-hero step-next" data-v-410eba56>Selanjutnya</button></div></div>`);
      } else if (currentStep.value === 2) {
        _push(`<div data-v-410eba56><div class="field" data-v-410eba56><label for="school_name" data-v-410eba56>* Nama Lengkap Lembaga</label><input id="school_name" type="text"${ssrRenderAttr("value", unref(form).school_name)} placeholder="Lumi Boarding School" data-v-410eba56>`);
        if (fieldError("school_name")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("school_name"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="subdomain" data-v-410eba56>* URL / Link Akses Aplikasi LMS</label><div class="subdomain-input" data-v-410eba56><input id="subdomain" type="text"${ssrRenderAttr("value", unref(form).subdomain)} placeholder="smkluminous" data-v-410eba56><span class="subdomain-suffix" data-v-410eba56>.${ssrInterpolate(unref(centralDomain))}</span></div>`);
        if (fieldError("subdomain")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("subdomain"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="field-hint" data-v-410eba56>Ini akan jadi alamat khusus untuk sekolah / lembaga Anda. </p></div><div class="field" data-v-410eba56><label data-v-410eba56>Logo Utama <span class="optional-tag" data-v-410eba56>(opsional, maks 15MB)</span></label>`);
        if (!logoPreview.value) {
          _push(`<div class="logo-upload" data-v-410eba56><input type="file" accept="image/*" id="logo" class="logo-input" data-v-410eba56><label for="logo" class="logo-upload-label" data-v-410eba56><span class="logo-upload-icon" data-v-410eba56>📷</span><span data-v-410eba56>Klik untuk upload logo sekolah / lembaga</span></label></div>`);
        } else {
          _push(`<div class="logo-preview" data-v-410eba56><img${ssrRenderAttr("src", logoPreview.value)} alt="Preview logo" data-v-410eba56><button type="button" class="logo-remove" data-v-410eba56>✕</button></div>`);
        }
        if (fieldError("logo")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("logo"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field-divider" data-v-410eba56></div>`);
        if (isSchool.value) {
          _push(`<div class="field-row" data-v-410eba56><div class="field" data-v-410eba56><label for="school_level" class="field-label" data-v-410eba56>* Tingkat / Jenjang</label><select id="school_level" class="field-input" data-v-410eba56><option value="" disabled data-v-410eba56${ssrIncludeBooleanAttr(Array.isArray(unref(form).school_level) ? ssrLooseContain(unref(form).school_level, "") : ssrLooseEqual(unref(form).school_level, "")) ? " selected" : ""}>Silakan Pilih jenjang</option><!--[-->`);
          ssrRenderList(schoolLevelOptions, (lvl) => {
            _push(`<option${ssrRenderAttr("value", lvl.value)} data-v-410eba56${ssrIncludeBooleanAttr(Array.isArray(unref(form).school_level) ? ssrLooseContain(unref(form).school_level, lvl.value) : ssrLooseEqual(unref(form).school_level, lvl.value)) ? " selected" : ""}>${ssrInterpolate(lvl.label)}</option>`);
          });
          _push(`<!--]--></select>`);
          if (fieldError("school_level")) {
            _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("school_level"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="field" data-v-410eba56><label for="npsn" data-v-410eba56>* NPSN <span class="optional-tag" data-v-410eba56>(8 digit)</span></label><input id="npsn" type="text" inputmode="numeric"${ssrRenderAttr("value", unref(form).npsn)} maxlength="8" placeholder="20123456" data-v-410eba56>`);
          if (fieldError("npsn")) {
            _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("npsn"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else if (unref(form).institution_type) {
          _push(`<div class="field" data-v-410eba56><label for="registration_number" data-v-410eba56>${ssrInterpolate(registrationNumberLabel.value)}</label><input id="registration_number" type="text"${ssrRenderAttr("value", unref(form).registration_number)} placeholder="Masukkan nomor legalitas" data-v-410eba56>`);
          if (fieldError("registration_number")) {
            _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("registration_number"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (isSchool.value) {
          _push(`<div class="field" data-v-410eba56><label for="nss" data-v-410eba56>NSS <span class="optional-tag" data-v-410eba56>(opsional, 12 digit)</span></label><input id="nss" type="text" inputmode="numeric"${ssrRenderAttr("value", unref(form).nss)} maxlength="12" placeholder="201234567890" data-v-410eba56>`);
          if (fieldError("nss")) {
            _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("nss"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (isSchool.value) {
          _push(`<div class="field" data-v-410eba56><label for="registration_number_school" data-v-410eba56>Nomor Izin Pendirian / Operasional <span class="optional-tag" data-v-410eba56>(opsional)</span></label><input id="registration_number_school" type="text"${ssrRenderAttr("value", unref(form).registration_number_school)} placeholder="Masukkan nomor izin (jika ada)" data-v-410eba56>`);
          if (fieldError("registration_number_school")) {
            _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("registration_number_school"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="step-actions" data-v-410eba56><button type="button" class="btn-ghost-step" data-v-410eba56>Kembali</button><button type="button" class="btn-hero step-next" data-v-410eba56>Selanjutnya</button></div></div>`);
      } else if (currentStep.value === 3) {
        _push(`<div data-v-410eba56><div class="field" data-v-410eba56><label for="contact_phone" data-v-410eba56>Nomor Telepon <span class="optional-tag" data-v-410eba56>(opsional)</span></label><input id="contact_phone" type="text"${ssrRenderAttr("value", unref(form).contact_phone)} placeholder="Masukkan No.Telp Sekolah / Lembaga Pendidikan" data-v-410eba56>`);
        if (fieldError("contact_phone")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("contact_phone"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="institution_email" data-v-410eba56>Alamat Email <span class="optional-tag" data-v-410eba56>(opsional)</span></label><input id="institution_email" type="email"${ssrRenderAttr("value", unref(form).institution_email)} placeholder="info@sekolah.sch.id" data-v-410eba56>`);
        if (fieldError("institution_email")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("institution_email"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="institution_website" data-v-410eba56>Website Utama <span class="optional-tag" data-v-410eba56>(opsional)</span></label><input id="institution_website" type="text"${ssrRenderAttr("value", unref(form).institution_website)} placeholder="https://sekolah.sch.id" data-v-410eba56>`);
        if (fieldError("institution_website")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("institution_website"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="address" data-v-410eba56>* Alamat Lengkap (Lembaga)</label><textarea id="address" rows="3" placeholder="Jl. Pendidikan No. 1, Bogor, Jawa Barat, 17820." data-v-410eba56>${ssrInterpolate(unref(form).address)}</textarea>`);
        if (fieldError("address")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("address"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="step-actions" data-v-410eba56><button type="button" class="btn-ghost-step" data-v-410eba56>Kembali</button><button type="button" class="btn-hero step-next" data-v-410eba56>Selanjutnya</button></div></div>`);
      } else if (currentStep.value === 4) {
        _push(`<div data-v-410eba56><p class="step-intro" data-v-410eba56>Data ini akan digunakan untuk login / masuk ke halaman dashboard lumiverse dan juga aplikasi LMS lembaga Kamu.</p><div class="field" data-v-410eba56><label for="admin_name" data-v-410eba56>* Nama Lengkap (Admin / PIC)</label><input id="admin_name" type="text"${ssrRenderAttr("value", unref(form).admin_name)} placeholder="Budi Santoso" data-v-410eba56>`);
        if (fieldError("admin_name")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("admin_name"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="admin_email" data-v-410eba56>* Alamat Email</label><input id="admin_email" type="email"${ssrRenderAttr("value", unref(form).admin_email)} placeholder="budi@sekolah.id" data-v-410eba56>`);
        if (fieldError("admin_email")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("admin_email"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="field" data-v-410eba56><label for="admin_phone" data-v-410eba56>* Nomor WhatsApp</label><input id="admin_phone" type="text"${ssrRenderAttr("value", unref(form).admin_phone)} placeholder="08123456789" data-v-410eba56>`);
        if (fieldError("admin_phone")) {
          _push(`<div class="field-error" data-v-410eba56>${ssrInterpolate(fieldError("admin_phone"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(PasswordFields, {
          ref_key: "passwordFieldsRef",
          ref: passwordFieldsRef,
          password: unref(form).admin_password,
          "onUpdate:password": ($event) => unref(form).admin_password = $event,
          "password-confirmation": unref(form).admin_password_confirmation,
          "onUpdate:passwordConfirmation": ($event) => unref(form).admin_password_confirmation = $event,
          "password-error": fieldError("admin_password"),
          "confirmation-error": fieldError("admin_password_confirmation")
        }, null, _parent));
        if (fieldError("school_name")) {
          _push(`<div class="field-error submit-error" data-v-410eba56>${ssrInterpolate(fieldError("school_name"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="step-actions" data-v-410eba56><button type="button" class="btn-ghost-step" data-v-410eba56>Kembali</button><button type="submit" class="btn-hero step-next"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-410eba56>${ssrInterpolate(unref(form).processing ? "Sedang membuat akun..." : "Daftar Sekarang")}</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><p class="register-footer" data-v-410eba56> Sudah terdaftar? `);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("owner.login"),
        class: "text-cyan"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Masuk di sini`);
          } else {
            return [
              createTextVNode("Masuk di sini")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div>`);
      _push(ssrRenderComponent(ProductSelectModal, {
        show: showProductModal.value,
        onClose: ($event) => showProductModal.value = false,
        onSelect: onSwitchProduct
      }, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Tenant/Register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-410eba56"]]);
export {
  Register as default
};
