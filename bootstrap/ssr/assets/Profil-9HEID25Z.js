import { computed, ref, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, createCommentVNode, withDirectives, vModelText, renderList, vModelSelect, createTextVNode, vModelDynamic, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderDynamicModel } from "vue/server-renderer";
import { useForm, Head } from "@inertiajs/vue3";
import { O as OwnerLayout } from "./OwnerLayout-C9QaMqab.js";
import { PencilSquareIcon, EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Profil",
  __ssrInlineRender: true,
  props: {
    owner: Object,
    tenant: Object
  },
  setup(__props) {
    const props = __props;
    const isWorkspace = computed(() => props.tenant.product_type === "workspace");
    const editingProfile = ref(false);
    const editingAccount = ref(false);
    const profileForm = useForm({
      school_name: props.tenant.name,
      institution_type: props.tenant.institution_type,
      institution_type_other: props.tenant.institution_type_other ?? "",
      school_level: props.tenant.school_level ?? "",
      npsn: props.tenant.npsn ?? "",
      nss: props.tenant.nss ?? "",
      registration_number: props.tenant.institution_type !== "sekolah" ? props.tenant.registration_number ?? "" : "",
      registration_number_school: props.tenant.institution_type === "sekolah" ? props.tenant.registration_number ?? "" : "",
      contact_phone: props.tenant.contact_phone ?? "",
      institution_email: props.tenant.institution_email ?? "",
      institution_website: props.tenant.institution_website ?? "",
      address: props.tenant.address ?? "",
      logo: null
    });
    const accountForm = useForm({
      name: props.owner.name,
      email: props.owner.email,
      phone: props.owner.phone ?? "",
      password: "",
      password_confirmation: ""
    });
    function cancelProfile() {
      profileForm.reset();
      profileForm.school_name = props.tenant.name;
      profileForm.institution_type = props.tenant.institution_type;
      profileForm.institution_type_other = props.tenant.institution_type_other ?? "";
      profileForm.school_level = props.tenant.school_level ?? "";
      profileForm.npsn = props.tenant.npsn ?? "";
      profileForm.nss = props.tenant.nss ?? "";
      profileForm.registration_number = props.tenant.institution_type !== "sekolah" ? props.tenant.registration_number ?? "" : "";
      profileForm.registration_number_school = props.tenant.institution_type === "sekolah" ? props.tenant.registration_number ?? "" : "";
      profileForm.contact_phone = props.tenant.contact_phone ?? "";
      profileForm.institution_email = props.tenant.institution_email ?? "";
      profileForm.institution_website = props.tenant.institution_website ?? "";
      profileForm.address = props.tenant.address ?? "";
      profileForm.logo = null;
      editingProfile.value = false;
    }
    function cancelAccount() {
      accountForm.reset();
      accountForm.name = props.owner.name;
      accountForm.email = props.owner.email;
      accountForm.phone = props.owner.phone ?? "";
      accountForm.password = "";
      accountForm.password_confirmation = "";
      editingAccount.value = false;
    }
    function submitProfile() {
      profileForm.post(route("owner.update.profile"), {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          editingProfile.value = false;
        }
      });
    }
    function submitAccount() {
      accountForm.patch(route("owner.update.account"), {
        preserveScroll: true,
        onSuccess: () => {
          editingAccount.value = false;
          accountForm.password = "";
          accountForm.password_confirmation = "";
        }
      });
    }
    const showPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfPassword = ref(false);
    const institutionTypes = computed(() => {
      if (isWorkspace.value) {
        return [
          { value: "pt", label: "PT (Perseroan Terbatas)" },
          { value: "cv", label: "CV (Commanditaire Venootschap)" },
          { value: "startup", label: "Startup / Rintisan" },
          { value: "yayasan", label: "Yayasan / Organisasi Non-Profit" },
          { value: "lainnya", label: "Lainnya" }
        ];
      }
      return [
        { value: "sekolah", label: "Sekolah" },
        { value: "kursus", label: "Kursus & Bimbel" },
        { value: "privat", label: "Privat / Tutor" },
        { value: "yayasan", label: "Yayasan" },
        { value: "lainnya", label: "Lainnya" }
      ];
    });
    const schoolLevels = [
      { value: "sd", label: "SD / MI / Sederajat" },
      { value: "smp", label: "SMP / MTS / Sederajat" },
      { value: "smk", label: "SMA / SMK / Sederajat" }
    ];
    const institutionTypeLabel = computed(() => {
      const map = Object.fromEntries(institutionTypes.value.map((t) => [t.value, t.label]));
      const base = map[props.tenant.institution_type] || props.tenant.institution_type;
      if (props.tenant.institution_type === "lainnya" && props.tenant.institution_type_other) {
        return `${base} (${props.tenant.institution_type_other})`;
      }
      return base;
    });
    const schoolLevelLabel = computed(() => {
      const map = { sd: "SD / Sederajat", smp: "SMP / MTS / Sederajat", smk: "SMA / SMK / Sederajat" };
      return props.tenant.school_level ? map[props.tenant.school_level] || props.tenant.school_level : null;
    });
    const logoUrl = computed(() => props.tenant.logo_url ?? null);
    const pageLead = computed(() => isWorkspace.value ? "Kelola data perusahaan / organisasi dan akun admin (PIC) yang digunakan untuk mengakses Lumiverse." : "Kelola data lembaga / institusi pendidikan dan akun admin (PIC) yang digunakan untuk mengakses Lumiverse.");
    const profileSectionTitle = computed(() => isWorkspace.value ? "Profil Perusahaan / Organisasi" : "Profil Lembaga / Institusi Pendidikan");
    const profileSubLabel = computed(() => isWorkspace.value ? "Jenis Organisasi" : "Jenis Lembaga Pendidikan");
    const nameFieldLabel = computed(() => isWorkspace.value ? "Nama Perusahaan / Organisasi" : "Nama Lembaga Pendidikan");
    const typeFieldLabel = computed(() => isWorkspace.value ? "Jenis Organisasi" : "Jenis Lembaga Pendidikan");
    const typeOtherFieldLabel = computed(() => isWorkspace.value ? "Nama Jenis Organisasi" : "Nama Jenis Lembaga");
    const typeOtherPlaceholder = computed(() => isWorkspace.value ? "contoh: Koperasi" : "contoh: Pesantren");
    const legalityFieldLabel = computed(() => isWorkspace.value ? "NPWP / No. Legalitas Perusahaan" : "No. Legalitas");
    const legalityPlaceholder = computed(() => isWorkspace.value ? "Nomor NPWP / akta pendirian" : "Nomor akta / ijin");
    const phoneFieldLabel = computed(() => isWorkspace.value ? "Telepon Kantor" : "Telepon Sekolah / Lembaga");
    const addressFieldLabel = computed(() => isWorkspace.value ? "Alamat Kantor / Perusahaan" : "Alamat Sekolah");
    const addressPlaceholder = computed(() => isWorkspace.value ? "Alamat lengkap kantor / perusahaan" : "Alamat lengkap lembaga");
    const websiteFieldLabel = computed(() => isWorkspace.value ? "Website Perusahaan" : "Website");
    const emailFieldLabel = computed(() => isWorkspace.value ? "Alamat Email Perusahaan" : "Alamat Email");
    const namePlaceholder = computed(() => isWorkspace.value ? "Nama perusahaan / organisasi" : "Nama lembaga");
    const emailRowLabel = computed(() => isWorkspace.value ? "Email Perusahaan" : "Email Address");
    const legalityRowLabel = computed(() => isWorkspace.value ? "NPWP / No. Legalitas" : "No. Legalitas");
    const accountNote = computed(() => isWorkspace.value ? "Informasi / data akun ini dapat digunakan untuk mengakses halaman dashboard lumiverse dan juga aplikasi workspace pada url perusahaan yang sudah Anda daftarkan!" : "Informasi / data akun ini dapat digunakan untuk mengakses halaman dashboard lumiverse dan juga aplikasi lms pada url sekolah yang sudah Anda daftarkan!");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Profil Lembaga & Akun" }, null, _parent));
      _push(ssrRenderComponent(OwnerLayout, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="topbar-title" data-v-ce4f2423${_scopeId}>Profil Lembaga &amp; Akun</h1>`);
          } else {
            return [
              createVNode("h1", { class: "topbar-title" }, "Profil Lembaga & Akun")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="page-lead" data-v-ce4f2423${_scopeId}>${ssrInterpolate(pageLead.value)}</p><div class="section-title" data-v-ce4f2423${_scopeId}>${ssrInterpolate(profileSectionTitle.value)}</div><div class="info-card mb-gap" data-v-ce4f2423${_scopeId}>`);
            if (!editingProfile.value) {
              _push2(`<!--[--><div class="profile-header" data-v-ce4f2423${_scopeId}><div class="logo-box" data-v-ce4f2423${_scopeId}>`);
              if (logoUrl.value) {
                _push2(`<img${ssrRenderAttr("src", logoUrl.value)}${ssrRenderAttr("alt", __props.tenant.name)} class="logo-img" data-v-ce4f2423${_scopeId}>`);
              } else {
                _push2(`<div class="logo-placeholder" data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.name?.charAt(0) ?? "?")}</div>`);
              }
              _push2(`</div><div data-v-ce4f2423${_scopeId}><div class="profile-name" data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.name)}</div><div class="profile-sub" data-v-ce4f2423${_scopeId}>${ssrInterpolate(profileSubLabel.value)} ( ${ssrInterpolate(institutionTypeLabel.value)} )</div></div></div><div class="two-col-grid" data-v-ce4f2423${_scopeId}><div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>${ssrInterpolate(typeFieldLabel.value)}</span><strong data-v-ce4f2423${_scopeId}>${ssrInterpolate(institutionTypeLabel.value)}</strong></div>`);
              if (!isWorkspace.value && schoolLevelLabel.value) {
                _push2(`<div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>Tingkat / Jenjang</span><strong data-v-ce4f2423${_scopeId}>${ssrInterpolate(schoolLevelLabel.value)}</strong></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (!isWorkspace.value && __props.tenant.npsn) {
                _push2(`<div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>NPSN</span><strong class="mono" data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.npsn)}</strong></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (!isWorkspace.value && __props.tenant.nss) {
                _push2(`<div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>NSS</span><strong class="mono" data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.nss)}</strong></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (!isWorkspace.value && __props.tenant.institution_type === "sekolah" && __props.tenant.registration_number) {
                _push2(`<div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>No. Izin Pendirian</span><strong class="mono" data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.registration_number)}</strong></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.tenant.institution_type !== "sekolah" && __props.tenant.registration_number) {
                _push2(`<div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>${ssrInterpolate(legalityRowLabel.value)}</span><strong class="mono" data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.registration_number)}</strong></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.tenant.contact_phone) {
                _push2(`<div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>${ssrInterpolate(phoneFieldLabel.value)}</span><strong data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.contact_phone)}</strong></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.tenant.institution_email) {
                _push2(`<div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>${ssrInterpolate(emailRowLabel.value)}</span><strong data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.institution_email)}</strong></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.tenant.institution_website) {
                _push2(`<div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>${ssrInterpolate(websiteFieldLabel.value)}</span><a${ssrRenderAttr("href", __props.tenant.institution_website)} target="_blank" class="link-cyan" data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.institution_website)}</a></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.tenant.address) {
                _push2(`<div class="info-card-row col-span-2" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>${ssrInterpolate(addressFieldLabel.value)}</span><strong class="text-right" data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.address)}</strong></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><!--]-->`);
            } else {
              _push2(`<div class="edit-grid" data-v-ce4f2423${_scopeId}><div class="field-group col-span-2" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>${ssrInterpolate(nameFieldLabel.value)}</label><input${ssrRenderAttr("value", unref(profileForm).school_name)} class="field-input"${ssrRenderAttr("placeholder", namePlaceholder.value)} data-v-ce4f2423${_scopeId}>`);
              if (unref(profileForm).errors.school_name) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.school_name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>${ssrInterpolate(typeFieldLabel.value)}</label><select class="field-input" data-v-ce4f2423${_scopeId}><!--[-->`);
              ssrRenderList(institutionTypes.value, (t) => {
                _push2(`<option${ssrRenderAttr("value", t.value)} data-v-ce4f2423${ssrIncludeBooleanAttr(Array.isArray(unref(profileForm).institution_type) ? ssrLooseContain(unref(profileForm).institution_type, t.value) : ssrLooseEqual(unref(profileForm).institution_type, t.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(t.label)}</option>`);
              });
              _push2(`<!--]--></select>`);
              if (unref(profileForm).errors.institution_type) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.institution_type)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (unref(profileForm).institution_type === "lainnya") {
                _push2(`<div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>${ssrInterpolate(typeOtherFieldLabel.value)}</label><input${ssrRenderAttr("value", unref(profileForm).institution_type_other)} class="field-input"${ssrRenderAttr("placeholder", typeOtherPlaceholder.value)} data-v-ce4f2423${_scopeId}>`);
                if (unref(profileForm).errors.institution_type_other) {
                  _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.institution_type_other)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (!isWorkspace.value && unref(profileForm).institution_type === "sekolah") {
                _push2(`<div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>Tingkat / Jenjang</label><select class="field-input" data-v-ce4f2423${_scopeId}><option value="" data-v-ce4f2423${ssrIncludeBooleanAttr(Array.isArray(unref(profileForm).school_level) ? ssrLooseContain(unref(profileForm).school_level, "") : ssrLooseEqual(unref(profileForm).school_level, "")) ? " selected" : ""}${_scopeId}>— Pilih jenjang —</option><!--[-->`);
                ssrRenderList(schoolLevels, (l) => {
                  _push2(`<option${ssrRenderAttr("value", l.value)} data-v-ce4f2423${ssrIncludeBooleanAttr(Array.isArray(unref(profileForm).school_level) ? ssrLooseContain(unref(profileForm).school_level, l.value) : ssrLooseEqual(unref(profileForm).school_level, l.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(l.label)}</option>`);
                });
                _push2(`<!--]--></select>`);
                if (unref(profileForm).errors.school_level) {
                  _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.school_level)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (!isWorkspace.value && unref(profileForm).institution_type === "sekolah") {
                _push2(`<div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>No. Pokok Sekolah Nasional (NPSN)</label><input${ssrRenderAttr("value", unref(profileForm).npsn)} class="field-input mono" placeholder="8 digit" maxlength="8" data-v-ce4f2423${_scopeId}>`);
                if (unref(profileForm).errors.npsn) {
                  _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.npsn)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (!isWorkspace.value && unref(profileForm).institution_type === "sekolah") {
                _push2(`<div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>No. Statistik Sekolah (NSS)</label><input${ssrRenderAttr("value", unref(profileForm).nss)} class="field-input mono" placeholder="12 digit" maxlength="12" data-v-ce4f2423${_scopeId}>`);
                if (unref(profileForm).errors.nss) {
                  _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.nss)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (!isWorkspace.value && unref(profileForm).institution_type === "sekolah") {
                _push2(`<div class="field-group col-span-2" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>No. Izin Pendirian / Operasional <span class="field-optional" data-v-ce4f2423${_scopeId}>(opsional)</span></label><input${ssrRenderAttr("value", unref(profileForm).registration_number_school)} class="field-input mono" placeholder="Nomor izin pendirian sekolah" data-v-ce4f2423${_scopeId}>`);
                if (unref(profileForm).errors.registration_number_school) {
                  _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.registration_number_school)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(profileForm).institution_type !== "sekolah") {
                _push2(`<div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>${ssrInterpolate(legalityFieldLabel.value)}</label><input${ssrRenderAttr("value", unref(profileForm).registration_number)} class="field-input mono"${ssrRenderAttr("placeholder", legalityPlaceholder.value)} data-v-ce4f2423${_scopeId}>`);
                if (unref(profileForm).errors.registration_number) {
                  _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.registration_number)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>${ssrInterpolate(phoneFieldLabel.value)} <span class="field-optional" data-v-ce4f2423${_scopeId}>(opsional)</span></label><input${ssrRenderAttr("value", unref(profileForm).contact_phone)} class="field-input" placeholder="021-xxxxxxx" data-v-ce4f2423${_scopeId}>`);
              if (unref(profileForm).errors.contact_phone) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.contact_phone)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>${ssrInterpolate(emailFieldLabel.value)} <span class="field-optional" data-v-ce4f2423${_scopeId}>(opsional)</span></label><input${ssrRenderAttr("value", unref(profileForm).institution_email)} class="field-input" type="email" placeholder="email@lumiverse.co.id" data-v-ce4f2423${_scopeId}>`);
              if (unref(profileForm).errors.institution_email) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.institution_email)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="field-group col-span-2" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>${ssrInterpolate(websiteFieldLabel.value)} <span class="field-optional" data-v-ce4f2423${_scopeId}>(opsional)</span></label><input${ssrRenderAttr("value", unref(profileForm).institution_website)} class="field-input" placeholder="https://lumiverse.sch.id" data-v-ce4f2423${_scopeId}>`);
              if (unref(profileForm).errors.institution_website) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.institution_website)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="field-group col-span-2" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>${ssrInterpolate(addressFieldLabel.value)}</label><textarea class="field-input field-textarea" rows="3"${ssrRenderAttr("placeholder", addressPlaceholder.value)} data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).address)}</textarea>`);
              if (unref(profileForm).errors.address) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.address)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="field-group col-span-2" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>Logo <span class="field-optional" data-v-ce4f2423${_scopeId}>(opsional, max 15MB · JPG/PNG/WebP)</span></label><div class="logo-upload-row" data-v-ce4f2423${_scopeId}><div class="logo-preview-sm" data-v-ce4f2423${_scopeId}>`);
              if (logoUrl.value) {
                _push2(`<img${ssrRenderAttr("src", logoUrl.value)} class="logo-img" data-v-ce4f2423${_scopeId}>`);
              } else {
                _push2(`<div class="logo-placeholder logo-placeholder-sm" data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.tenant.name?.charAt(0) ?? "?")}</div>`);
              }
              _push2(`</div><input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" class="field-input file-input" data-v-ce4f2423${_scopeId}></div>`);
              if (unref(profileForm).errors.logo) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).errors.logo)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            }
            _push2(`<div class="card-footer" data-v-ce4f2423${_scopeId}>`);
            if (!editingProfile.value) {
              _push2(`<button class="btn-edit" data-v-ce4f2423${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "btn-icon" }, null, _parent2, _scopeId));
              _push2(` Edit Profil </button>`);
            } else {
              _push2(`<!--[--><button class="btn-cancel" data-v-ce4f2423${_scopeId}>Batal</button><button class="btn-update"${ssrIncludeBooleanAttr(unref(profileForm).processing) ? " disabled" : ""} data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(profileForm).processing ? "Menyimpan..." : "Simpan Profil")}</button><!--]-->`);
            }
            _push2(`</div></div><div class="section-title" data-v-ce4f2423${_scopeId}>Akun Admin / Penanggung Jawab (PIC)</div><div class="info-card" data-v-ce4f2423${_scopeId}>`);
            if (!editingAccount.value) {
              _push2(`<!--[--><p class="title-note" data-v-ce4f2423${_scopeId}>${ssrInterpolate(accountNote.value)}</p><div class="two-col-grid" data-v-ce4f2423${_scopeId}><div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>Nama Lengkap</span><strong data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.owner.name)}</strong></div><div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>Email Address</span><strong data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.owner.email)}</strong></div><div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>No. WhatsApp</span><strong data-v-ce4f2423${_scopeId}>${ssrInterpolate(__props.owner.phone || "-")}</strong></div><div class="info-card-row" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>Password</span><div class="password-field" data-v-ce4f2423${_scopeId}><span class="mono password-value" data-v-ce4f2423${_scopeId}>${ssrInterpolate(showPassword.value ? "(tersimpan di database)" : "••••••••••")}</span><button class="eye-btn"${ssrRenderAttr("title", showPassword.value ? "Sembunyikan" : "Tampilkan")} data-v-ce4f2423${_scopeId}>`);
              if (!showPassword.value) {
                _push2(ssrRenderComponent(unref(EyeIcon), { class: "icon-16" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(EyeSlashIcon), { class: "icon-16" }, null, _parent2, _scopeId));
              }
              _push2(`</button></div></div></div><p class="password-note" data-v-ce4f2423${_scopeId}>🔒 Password di-hash dan tidak dapat dilihat. Gunakan tombol edit untuk menggantinya.</p><!--]-->`);
            } else {
              _push2(`<div class="edit-grid" data-v-ce4f2423${_scopeId}><div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>Nama Lengkap</label><input${ssrRenderAttr("value", unref(accountForm).name)} class="field-input" placeholder="Nama lengkap" data-v-ce4f2423${_scopeId}>`);
              if (unref(accountForm).errors.name) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(accountForm).errors.name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>Email Address</label><input${ssrRenderAttr("value", unref(accountForm).email)} class="field-input" type="email" placeholder="email@domain.com" data-v-ce4f2423${_scopeId}>`);
              if (unref(accountForm).errors.email) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(accountForm).errors.email)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="field-group col-span-2" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>No. WhatsApp</label><input${ssrRenderAttr("value", unref(accountForm).phone)} class="field-input" placeholder="08xxxxxxxxxx" data-v-ce4f2423${_scopeId}>`);
              if (unref(accountForm).errors.phone) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(accountForm).errors.phone)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="field-divider col-span-2" data-v-ce4f2423${_scopeId}><span data-v-ce4f2423${_scopeId}>Ganti Password <span class="field-optional" data-v-ce4f2423${_scopeId}>(kosongkan jika tidak ingin diganti)</span></span></div><div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>Password Baru</label><div class="input-eye-wrap" data-v-ce4f2423${_scopeId}><input${ssrRenderDynamicModel(showNewPassword.value ? "text" : "password", unref(accountForm).password, null)}${ssrRenderAttr("type", showNewPassword.value ? "text" : "password")} class="field-input" placeholder="Min. 8 karakter" data-v-ce4f2423${_scopeId}><button class="eye-btn eye-inside" type="button" data-v-ce4f2423${_scopeId}>`);
              if (!showNewPassword.value) {
                _push2(ssrRenderComponent(unref(EyeIcon), { class: "icon-15" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(EyeSlashIcon), { class: "icon-15" }, null, _parent2, _scopeId));
              }
              _push2(`</button></div>`);
              if (unref(accountForm).errors.password) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(accountForm).errors.password)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="field-group" data-v-ce4f2423${_scopeId}><label class="field-label" data-v-ce4f2423${_scopeId}>Konfirmasi Password</label><div class="input-eye-wrap" data-v-ce4f2423${_scopeId}><input${ssrRenderDynamicModel(showConfPassword.value ? "text" : "password", unref(accountForm).password_confirmation, null)}${ssrRenderAttr("type", showConfPassword.value ? "text" : "password")} class="field-input" placeholder="Ulangi password baru" data-v-ce4f2423${_scopeId}><button class="eye-btn eye-inside" type="button" data-v-ce4f2423${_scopeId}>`);
              if (!showConfPassword.value) {
                _push2(ssrRenderComponent(unref(EyeIcon), { class: "icon-15" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(EyeSlashIcon), { class: "icon-15" }, null, _parent2, _scopeId));
              }
              _push2(`</button></div>`);
              if (unref(accountForm).errors.password_confirmation) {
                _push2(`<p class="field-error" data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(accountForm).errors.password_confirmation)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            }
            _push2(`<div class="card-footer" data-v-ce4f2423${_scopeId}>`);
            if (!editingAccount.value) {
              _push2(`<button class="btn-edit" data-v-ce4f2423${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "btn-icon" }, null, _parent2, _scopeId));
              _push2(` Edit Akun </button>`);
            } else {
              _push2(`<!--[--><button class="btn-cancel" data-v-ce4f2423${_scopeId}>Batal</button><button class="btn-update"${ssrIncludeBooleanAttr(unref(accountForm).processing) ? " disabled" : ""} data-v-ce4f2423${_scopeId}>${ssrInterpolate(unref(accountForm).processing ? "Menyimpan..." : "Simpan Akun")}</button><!--]-->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("p", { class: "page-lead" }, toDisplayString(pageLead.value), 1),
              createVNode("div", { class: "section-title" }, toDisplayString(profileSectionTitle.value), 1),
              createVNode("div", { class: "info-card mb-gap" }, [
                !editingProfile.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createVNode("div", { class: "profile-header" }, [
                    createVNode("div", { class: "logo-box" }, [
                      logoUrl.value ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: logoUrl.value,
                        alt: __props.tenant.name,
                        class: "logo-img"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "logo-placeholder"
                      }, toDisplayString(__props.tenant.name?.charAt(0) ?? "?"), 1))
                    ]),
                    createVNode("div", null, [
                      createVNode("div", { class: "profile-name" }, toDisplayString(__props.tenant.name), 1),
                      createVNode("div", { class: "profile-sub" }, toDisplayString(profileSubLabel.value) + " ( " + toDisplayString(institutionTypeLabel.value) + " )", 1)
                    ])
                  ]),
                  createVNode("div", { class: "two-col-grid" }, [
                    createVNode("div", { class: "info-card-row" }, [
                      createVNode("span", null, toDisplayString(typeFieldLabel.value), 1),
                      createVNode("strong", null, toDisplayString(institutionTypeLabel.value), 1)
                    ]),
                    !isWorkspace.value && schoolLevelLabel.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "info-card-row"
                    }, [
                      createVNode("span", null, "Tingkat / Jenjang"),
                      createVNode("strong", null, toDisplayString(schoolLevelLabel.value), 1)
                    ])) : createCommentVNode("", true),
                    !isWorkspace.value && __props.tenant.npsn ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "info-card-row"
                    }, [
                      createVNode("span", null, "NPSN"),
                      createVNode("strong", { class: "mono" }, toDisplayString(__props.tenant.npsn), 1)
                    ])) : createCommentVNode("", true),
                    !isWorkspace.value && __props.tenant.nss ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "info-card-row"
                    }, [
                      createVNode("span", null, "NSS"),
                      createVNode("strong", { class: "mono" }, toDisplayString(__props.tenant.nss), 1)
                    ])) : createCommentVNode("", true),
                    !isWorkspace.value && __props.tenant.institution_type === "sekolah" && __props.tenant.registration_number ? (openBlock(), createBlock("div", {
                      key: 3,
                      class: "info-card-row"
                    }, [
                      createVNode("span", null, "No. Izin Pendirian"),
                      createVNode("strong", { class: "mono" }, toDisplayString(__props.tenant.registration_number), 1)
                    ])) : createCommentVNode("", true),
                    __props.tenant.institution_type !== "sekolah" && __props.tenant.registration_number ? (openBlock(), createBlock("div", {
                      key: 4,
                      class: "info-card-row"
                    }, [
                      createVNode("span", null, toDisplayString(legalityRowLabel.value), 1),
                      createVNode("strong", { class: "mono" }, toDisplayString(__props.tenant.registration_number), 1)
                    ])) : createCommentVNode("", true),
                    __props.tenant.contact_phone ? (openBlock(), createBlock("div", {
                      key: 5,
                      class: "info-card-row"
                    }, [
                      createVNode("span", null, toDisplayString(phoneFieldLabel.value), 1),
                      createVNode("strong", null, toDisplayString(__props.tenant.contact_phone), 1)
                    ])) : createCommentVNode("", true),
                    __props.tenant.institution_email ? (openBlock(), createBlock("div", {
                      key: 6,
                      class: "info-card-row"
                    }, [
                      createVNode("span", null, toDisplayString(emailRowLabel.value), 1),
                      createVNode("strong", null, toDisplayString(__props.tenant.institution_email), 1)
                    ])) : createCommentVNode("", true),
                    __props.tenant.institution_website ? (openBlock(), createBlock("div", {
                      key: 7,
                      class: "info-card-row"
                    }, [
                      createVNode("span", null, toDisplayString(websiteFieldLabel.value), 1),
                      createVNode("a", {
                        href: __props.tenant.institution_website,
                        target: "_blank",
                        class: "link-cyan"
                      }, toDisplayString(__props.tenant.institution_website), 9, ["href"])
                    ])) : createCommentVNode("", true),
                    __props.tenant.address ? (openBlock(), createBlock("div", {
                      key: 8,
                      class: "info-card-row col-span-2"
                    }, [
                      createVNode("span", null, toDisplayString(addressFieldLabel.value), 1),
                      createVNode("strong", { class: "text-right" }, toDisplayString(__props.tenant.address), 1)
                    ])) : createCommentVNode("", true)
                  ])
                ], 64)) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "edit-grid"
                }, [
                  createVNode("div", { class: "field-group col-span-2" }, [
                    createVNode("label", { class: "field-label" }, toDisplayString(nameFieldLabel.value), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).school_name = $event,
                      class: "field-input",
                      placeholder: namePlaceholder.value
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(profileForm).school_name]
                    ]),
                    unref(profileForm).errors.school_name ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.school_name), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "field-group" }, [
                    createVNode("label", { class: "field-label" }, toDisplayString(typeFieldLabel.value), 1),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).institution_type = $event,
                      class: "field-input"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(institutionTypes.value, (t) => {
                        return openBlock(), createBlock("option", {
                          key: t.value,
                          value: t.value
                        }, toDisplayString(t.label), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(profileForm).institution_type]
                    ]),
                    unref(profileForm).errors.institution_type ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.institution_type), 1)) : createCommentVNode("", true)
                  ]),
                  unref(profileForm).institution_type === "lainnya" ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "field-group"
                  }, [
                    createVNode("label", { class: "field-label" }, toDisplayString(typeOtherFieldLabel.value), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).institution_type_other = $event,
                      class: "field-input",
                      placeholder: typeOtherPlaceholder.value
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(profileForm).institution_type_other]
                    ]),
                    unref(profileForm).errors.institution_type_other ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.institution_type_other), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  !isWorkspace.value && unref(profileForm).institution_type === "sekolah" ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "field-group"
                  }, [
                    createVNode("label", { class: "field-label" }, "Tingkat / Jenjang"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).school_level = $event,
                      class: "field-input"
                    }, [
                      createVNode("option", { value: "" }, "— Pilih jenjang —"),
                      (openBlock(), createBlock(Fragment, null, renderList(schoolLevels, (l) => {
                        return createVNode("option", {
                          key: l.value,
                          value: l.value
                        }, toDisplayString(l.label), 9, ["value"]);
                      }), 64))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(profileForm).school_level]
                    ]),
                    unref(profileForm).errors.school_level ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.school_level), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  !isWorkspace.value && unref(profileForm).institution_type === "sekolah" ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "field-group"
                  }, [
                    createVNode("label", { class: "field-label" }, "No. Pokok Sekolah Nasional (NPSN)"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).npsn = $event,
                      class: "field-input mono",
                      placeholder: "8 digit",
                      maxlength: "8"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(profileForm).npsn]
                    ]),
                    unref(profileForm).errors.npsn ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.npsn), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  !isWorkspace.value && unref(profileForm).institution_type === "sekolah" ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "field-group"
                  }, [
                    createVNode("label", { class: "field-label" }, "No. Statistik Sekolah (NSS)"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).nss = $event,
                      class: "field-input mono",
                      placeholder: "12 digit",
                      maxlength: "12"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(profileForm).nss]
                    ]),
                    unref(profileForm).errors.nss ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.nss), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  !isWorkspace.value && unref(profileForm).institution_type === "sekolah" ? (openBlock(), createBlock("div", {
                    key: 4,
                    class: "field-group col-span-2"
                  }, [
                    createVNode("label", { class: "field-label" }, [
                      createTextVNode("No. Izin Pendirian / Operasional "),
                      createVNode("span", { class: "field-optional" }, "(opsional)")
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).registration_number_school = $event,
                      class: "field-input mono",
                      placeholder: "Nomor izin pendirian sekolah"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(profileForm).registration_number_school]
                    ]),
                    unref(profileForm).errors.registration_number_school ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.registration_number_school), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  unref(profileForm).institution_type !== "sekolah" ? (openBlock(), createBlock("div", {
                    key: 5,
                    class: "field-group"
                  }, [
                    createVNode("label", { class: "field-label" }, toDisplayString(legalityFieldLabel.value), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).registration_number = $event,
                      class: "field-input mono",
                      placeholder: legalityPlaceholder.value
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(profileForm).registration_number]
                    ]),
                    unref(profileForm).errors.registration_number ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.registration_number), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "field-group" }, [
                    createVNode("label", { class: "field-label" }, [
                      createTextVNode(toDisplayString(phoneFieldLabel.value) + " ", 1),
                      createVNode("span", { class: "field-optional" }, "(opsional)")
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).contact_phone = $event,
                      class: "field-input",
                      placeholder: "021-xxxxxxx"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(profileForm).contact_phone]
                    ]),
                    unref(profileForm).errors.contact_phone ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.contact_phone), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "field-group" }, [
                    createVNode("label", { class: "field-label" }, [
                      createTextVNode(toDisplayString(emailFieldLabel.value) + " ", 1),
                      createVNode("span", { class: "field-optional" }, "(opsional)")
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).institution_email = $event,
                      class: "field-input",
                      type: "email",
                      placeholder: "email@lumiverse.co.id"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(profileForm).institution_email]
                    ]),
                    unref(profileForm).errors.institution_email ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.institution_email), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "field-group col-span-2" }, [
                    createVNode("label", { class: "field-label" }, [
                      createTextVNode(toDisplayString(websiteFieldLabel.value) + " ", 1),
                      createVNode("span", { class: "field-optional" }, "(opsional)")
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).institution_website = $event,
                      class: "field-input",
                      placeholder: "https://lumiverse.sch.id"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(profileForm).institution_website]
                    ]),
                    unref(profileForm).errors.institution_website ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.institution_website), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "field-group col-span-2" }, [
                    createVNode("label", { class: "field-label" }, toDisplayString(addressFieldLabel.value), 1),
                    withDirectives(createVNode("textarea", {
                      "onUpdate:modelValue": ($event) => unref(profileForm).address = $event,
                      class: "field-input field-textarea",
                      rows: "3",
                      placeholder: addressPlaceholder.value
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(profileForm).address]
                    ]),
                    unref(profileForm).errors.address ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.address), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "field-group col-span-2" }, [
                    createVNode("label", { class: "field-label" }, [
                      createTextVNode("Logo "),
                      createVNode("span", { class: "field-optional" }, "(opsional, max 15MB · JPG/PNG/WebP)")
                    ]),
                    createVNode("div", { class: "logo-upload-row" }, [
                      createVNode("div", { class: "logo-preview-sm" }, [
                        logoUrl.value ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: logoUrl.value,
                          class: "logo-img"
                        }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "logo-placeholder logo-placeholder-sm"
                        }, toDisplayString(__props.tenant.name?.charAt(0) ?? "?"), 1))
                      ]),
                      createVNode("input", {
                        type: "file",
                        accept: "image/jpg,image/jpeg,image/png,image/webp",
                        class: "field-input file-input",
                        onChange: (e) => unref(profileForm).logo = e.target.files[0]
                      }, null, 40, ["onChange"])
                    ]),
                    unref(profileForm).errors.logo ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(profileForm).errors.logo), 1)) : createCommentVNode("", true)
                  ])
                ])),
                createVNode("div", { class: "card-footer" }, [
                  !editingProfile.value ? (openBlock(), createBlock("button", {
                    key: 0,
                    class: "btn-edit",
                    onClick: ($event) => editingProfile.value = true
                  }, [
                    createVNode(unref(PencilSquareIcon), { class: "btn-icon" }),
                    createTextVNode(" Edit Profil ")
                  ], 8, ["onClick"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("button", {
                      class: "btn-cancel",
                      onClick: cancelProfile
                    }, "Batal"),
                    createVNode("button", {
                      class: "btn-update",
                      disabled: unref(profileForm).processing,
                      onClick: submitProfile
                    }, toDisplayString(unref(profileForm).processing ? "Menyimpan..." : "Simpan Profil"), 9, ["disabled"])
                  ], 64))
                ])
              ]),
              createVNode("div", { class: "section-title" }, "Akun Admin / Penanggung Jawab (PIC)"),
              createVNode("div", { class: "info-card" }, [
                !editingAccount.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createVNode("p", { class: "title-note" }, toDisplayString(accountNote.value), 1),
                  createVNode("div", { class: "two-col-grid" }, [
                    createVNode("div", { class: "info-card-row" }, [
                      createVNode("span", null, "Nama Lengkap"),
                      createVNode("strong", null, toDisplayString(__props.owner.name), 1)
                    ]),
                    createVNode("div", { class: "info-card-row" }, [
                      createVNode("span", null, "Email Address"),
                      createVNode("strong", null, toDisplayString(__props.owner.email), 1)
                    ]),
                    createVNode("div", { class: "info-card-row" }, [
                      createVNode("span", null, "No. WhatsApp"),
                      createVNode("strong", null, toDisplayString(__props.owner.phone || "-"), 1)
                    ]),
                    createVNode("div", { class: "info-card-row" }, [
                      createVNode("span", null, "Password"),
                      createVNode("div", { class: "password-field" }, [
                        createVNode("span", { class: "mono password-value" }, toDisplayString(showPassword.value ? "(tersimpan di database)" : "••••••••••"), 1),
                        createVNode("button", {
                          class: "eye-btn",
                          onClick: ($event) => showPassword.value = !showPassword.value,
                          title: showPassword.value ? "Sembunyikan" : "Tampilkan"
                        }, [
                          !showPassword.value ? (openBlock(), createBlock(unref(EyeIcon), {
                            key: 0,
                            class: "icon-16"
                          })) : (openBlock(), createBlock(unref(EyeSlashIcon), {
                            key: 1,
                            class: "icon-16"
                          }))
                        ], 8, ["onClick", "title"])
                      ])
                    ])
                  ]),
                  createVNode("p", { class: "password-note" }, "🔒 Password di-hash dan tidak dapat dilihat. Gunakan tombol edit untuk menggantinya.")
                ], 64)) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "edit-grid"
                }, [
                  createVNode("div", { class: "field-group" }, [
                    createVNode("label", { class: "field-label" }, "Nama Lengkap"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(accountForm).name = $event,
                      class: "field-input",
                      placeholder: "Nama lengkap"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(accountForm).name]
                    ]),
                    unref(accountForm).errors.name ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(accountForm).errors.name), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "field-group" }, [
                    createVNode("label", { class: "field-label" }, "Email Address"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(accountForm).email = $event,
                      class: "field-input",
                      type: "email",
                      placeholder: "email@domain.com"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(accountForm).email]
                    ]),
                    unref(accountForm).errors.email ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(accountForm).errors.email), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "field-group col-span-2" }, [
                    createVNode("label", { class: "field-label" }, "No. WhatsApp"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(accountForm).phone = $event,
                      class: "field-input",
                      placeholder: "08xxxxxxxxxx"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(accountForm).phone]
                    ]),
                    unref(accountForm).errors.phone ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(accountForm).errors.phone), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "field-divider col-span-2" }, [
                    createVNode("span", null, [
                      createTextVNode("Ganti Password "),
                      createVNode("span", { class: "field-optional" }, "(kosongkan jika tidak ingin diganti)")
                    ])
                  ]),
                  createVNode("div", { class: "field-group" }, [
                    createVNode("label", { class: "field-label" }, "Password Baru"),
                    createVNode("div", { class: "input-eye-wrap" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(accountForm).password = $event,
                        type: showNewPassword.value ? "text" : "password",
                        class: "field-input",
                        placeholder: "Min. 8 karakter"
                      }, null, 8, ["onUpdate:modelValue", "type"]), [
                        [vModelDynamic, unref(accountForm).password]
                      ]),
                      createVNode("button", {
                        class: "eye-btn eye-inside",
                        type: "button",
                        onClick: ($event) => showNewPassword.value = !showNewPassword.value
                      }, [
                        !showNewPassword.value ? (openBlock(), createBlock(unref(EyeIcon), {
                          key: 0,
                          class: "icon-15"
                        })) : (openBlock(), createBlock(unref(EyeSlashIcon), {
                          key: 1,
                          class: "icon-15"
                        }))
                      ], 8, ["onClick"])
                    ]),
                    unref(accountForm).errors.password ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(accountForm).errors.password), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "field-group" }, [
                    createVNode("label", { class: "field-label" }, "Konfirmasi Password"),
                    createVNode("div", { class: "input-eye-wrap" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(accountForm).password_confirmation = $event,
                        type: showConfPassword.value ? "text" : "password",
                        class: "field-input",
                        placeholder: "Ulangi password baru"
                      }, null, 8, ["onUpdate:modelValue", "type"]), [
                        [vModelDynamic, unref(accountForm).password_confirmation]
                      ]),
                      createVNode("button", {
                        class: "eye-btn eye-inside",
                        type: "button",
                        onClick: ($event) => showConfPassword.value = !showConfPassword.value
                      }, [
                        !showConfPassword.value ? (openBlock(), createBlock(unref(EyeIcon), {
                          key: 0,
                          class: "icon-15"
                        })) : (openBlock(), createBlock(unref(EyeSlashIcon), {
                          key: 1,
                          class: "icon-15"
                        }))
                      ], 8, ["onClick"])
                    ]),
                    unref(accountForm).errors.password_confirmation ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "field-error"
                    }, toDisplayString(unref(accountForm).errors.password_confirmation), 1)) : createCommentVNode("", true)
                  ])
                ])),
                createVNode("div", { class: "card-footer" }, [
                  !editingAccount.value ? (openBlock(), createBlock("button", {
                    key: 0,
                    class: "btn-edit",
                    onClick: ($event) => editingAccount.value = true
                  }, [
                    createVNode(unref(PencilSquareIcon), { class: "btn-icon" }),
                    createTextVNode(" Edit Akun ")
                  ], 8, ["onClick"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("button", {
                      class: "btn-cancel",
                      onClick: cancelAccount
                    }, "Batal"),
                    createVNode("button", {
                      class: "btn-update",
                      disabled: unref(accountForm).processing,
                      onClick: submitAccount
                    }, toDisplayString(unref(accountForm).processing ? "Menyimpan..." : "Simpan Akun"), 9, ["disabled"])
                  ], 64))
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Owner/Profil.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Profil = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ce4f2423"]]);
export {
  Profil as default
};
