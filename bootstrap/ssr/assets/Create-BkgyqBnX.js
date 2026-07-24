import { ref, computed, onMounted, unref, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrRenderVNode, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { usePage, useForm, Head } from "@inertiajs/vue3";
import { CheckCircleIcon, ExclamationTriangleIcon, CheckBadgeIcon, XMarkIcon, ArrowLeftOnRectangleIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/vue/24/solid";
import { AcademicCapIcon, UserIcon, IdentificationIcon, PhoneIcon, MapPinIcon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: { kelas: Array, kejuruan: Array, isSmk: Boolean },
  setup(__props) {
    const page = usePage();
    const props = __props;
    const toast = ref({ show: false, type: "success", message: "" });
    let toastTimer = null;
    const showToast = (type, message) => {
      clearTimeout(toastTimer);
      toast.value = { show: true, type, message };
      toastTimer = setTimeout(() => {
        toast.value.show = false;
      }, 5e3);
    };
    const toastStyle = computed(() => ({
      success: { bg: "bg-emerald-600", icon: CheckBadgeIcon },
      error: { bg: "bg-red-600", icon: ExclamationTriangleIcon },
      info: { bg: "bg-blue-600", icon: CheckCircleIcon }
    })[toast.value.type] ?? { bg: "bg-gray-700", icon: CheckCircleIcon });
    onMounted(() => {
      if (page.props.flash?.success) showToast("success", page.props.flash.success);
      if (page.props.flash?.error) showToast("error", page.props.flash.error);
      if (page.props.flash?.info) showToast("info", page.props.flash.info);
    });
    const form = useForm({
      // Identitas
      nama_lengkap: "",
      nis: "",
      nisn: "",
      kelas_id: "",
      kejuruan_id: "",
      // Pribadi
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: "",
      agama: "",
      no_hp: "",
      no_hp_ortu: "",
      // Alamat
      alamat: "",
      kelurahan: "",
      kecamatan: "",
      kota: "",
      kode_pos: ""
    });
    const steps = ["Identitas Siswa", "Data Pribadi", "Alamat Tinggal"];
    const currentStep = ref(0);
    const isLastStep = computed(() => currentStep.value === steps.length - 1);
    const isFirstStep = computed(() => currentStep.value === 0);
    computed(() => [
      props.isSmk ? ["nama_lengkap", "nis", "nisn", "kelas_id", "kejuruan_id"] : ["nama_lengkap", "nis", "nisn", "kelas_id"],
      ["tempat_lahir", "tanggal_lahir", "jenis_kelamin", "agama", "no_hp", "no_hp_ortu"],
      ["alamat", "kelurahan", "kecamatan", "kota", "kode_pos"]
    ]);
    const localErrors = ref({});
    const fieldError = (field) => localErrors.value[field] || form.errors[field];
    const agamaOptions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Form Data Siswa" }, null, _parent));
      if (toast.value.show) {
        _push(`<div class="${ssrRenderClass([
          toastStyle.value.bg,
          "fixed z-50 flex items-center gap-3 px-5 py-3.5 shadow-2xl text-white",
          "bottom-4 left-4 right-4 rounded-xl",
          "md:top-5 md:right-5 md:bottom-auto md:left-auto md:rounded-xl md:w-auto md:max-w-sm"
        ])}" data-v-8f244af0>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(toastStyle.value.icon), { class: "w-5 h-5 shrink-0" }, null), _parent);
        _push(`<span class="text-sm font-medium flex-1 leading-snug" data-v-8f244af0>${ssrInterpolate(toast.value.message)}</span><button class="ml-1 opacity-70 hover:opacity-100 transition" data-v-8f244af0>`);
        _push(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100" data-v-8f244af0><div class="pointer-events-none fixed inset-0 overflow-hidden -z-10" data-v-8f244af0><div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl" data-v-8f244af0></div><div class="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-200/40 blur-3xl" data-v-8f244af0></div></div><div class="w-full max-w-2xl" data-v-8f244af0><div class="wizard-card bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden scroll-mt-6" data-v-8f244af0><div class="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" data-v-8f244af0></div><div class="px-8 pt-8 pb-10 sm:px-10" data-v-8f244af0><div class="flex items-start justify-between mb-8" data-v-8f244af0><div data-v-8f244af0><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide mb-3" data-v-8f244af0>`);
      _push(ssrRenderComponent(unref(AcademicCapIcon), { class: "w-3.5 h-3.5" }, null, _parent));
      _push(` FORM PENDAFTARAN SISWA </div><h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight" data-v-8f244af0> Lengkapi Data Diri </h1><p class="mt-1.5 text-gray-500 text-sm" data-v-8f244af0> Isi dengan data yang sesuai ijazah terakhir kamu. </p></div><button type="button" class="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors mt-1 shrink-0" data-v-8f244af0>`);
      _push(ssrRenderComponent(unref(ArrowLeftOnRectangleIcon), { class: "w-4 h-4" }, null, _parent));
      _push(`<span class="hidden sm:inline" data-v-8f244af0>Keluar</span></button></div><div class="flex justify-center items-center gap-2 mb-8" data-v-8f244af0><!--[-->`);
      ssrRenderList(steps, (step, i) => {
        _push(`<!--[--><button type="button"${ssrIncludeBooleanAttr(i > currentStep.value) ? " disabled" : ""} class="${ssrRenderClass([[
          i <= currentStep.value ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-400",
          i < currentStep.value ? "cursor-pointer hover:bg-blue-700" : i > currentStep.value ? "cursor-not-allowed" : "cursor-default"
        ], "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"])}" data-v-8f244af0><span class="${ssrRenderClass([i <= currentStep.value ? "bg-white/30" : "bg-gray-200", "w-4 h-4 rounded-full flex items-center justify-center text-[10px]"])}" data-v-8f244af0>${ssrInterpolate(i + 1)}</span><span class="hidden sm:inline" data-v-8f244af0>${ssrInterpolate(step)}</span></button>`);
        if (i < steps.length - 1) {
          _push(`<div class="${ssrRenderClass([i < currentStep.value ? "bg-blue-400" : "bg-gray-200", "w-6 h-px shrink-0"])}" data-v-8f244af0></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div><form class="space-y-5" novalidate data-v-8f244af0>`);
      if (currentStep.value === 0) {
        _push(`<!--[--><div class="flex items-center gap-2 mb-1" data-v-8f244af0>`);
        _push(ssrRenderComponent(unref(UserIcon), { class: "w-4 h-4 text-blue-500" }, null, _parent));
        _push(`<span class="text-xs font-bold text-gray-400 uppercase tracking-widest" data-v-8f244af0> Identitas Siswa </span></div><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> Nama Lengkap <span class="text-red-500" data-v-8f244af0>*</span><span class="text-gray-400 font-normal ml-1 text-xs" data-v-8f244af0>(sesuai ijazah)</span></label><input${ssrRenderAttr("value", unref(form).nama_lengkap)} type="text" placeholder="Contoh: Budi Santoso" autocomplete="name" class="${ssrRenderClass([fieldError("nama_lengkap") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2"])}" data-v-8f244af0>`);
        if (fieldError("nama_lengkap")) {
          _push(`<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" data-v-8f244af0>`);
          _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "w-3.5 h-3.5 shrink-0" }, null, _parent));
          _push(` ${ssrInterpolate(fieldError("nama_lengkap"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-8f244af0><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> NIS <span class="text-gray-400 font-normal ml-1 text-xs" data-v-8f244af0>(opsional)</span></label><input${ssrRenderAttr("value", unref(form).nis)} type="text" placeholder="Min. 7 digit" class="${ssrRenderClass([fieldError("nis") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2"])}" data-v-8f244af0>`);
        if (fieldError("nis")) {
          _push(`<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" data-v-8f244af0>`);
          _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "w-3.5 h-3.5 shrink-0" }, null, _parent));
          _push(` ${ssrInterpolate(fieldError("nis"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> NISN <span class="text-red-500" data-v-8f244af0>*</span><span class="text-gray-400 font-normal ml-1 text-xs" data-v-8f244af0>(10 digit)</span></label><input${ssrRenderAttr("value", unref(form).nisn)} type="text" placeholder="0000000000" maxlength="10" inputmode="numeric" class="${ssrRenderClass([fieldError("nisn") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 tracking-widest"])}" data-v-8f244af0><div class="flex items-center justify-between mt-1.5" data-v-8f244af0>`);
        if (fieldError("nisn")) {
          _push(`<p class="text-xs text-red-500 flex items-center gap-1" data-v-8f244af0>`);
          _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "w-3.5 h-3.5 shrink-0" }, null, _parent));
          _push(` ${ssrInterpolate(fieldError("nisn"))}</p>`);
        } else {
          _push(`<p class="text-xs text-gray-400" data-v-8f244af0></p>`);
        }
        _push(`<span class="${ssrRenderClass([unref(form).nisn.length === 10 ? "text-emerald-500 font-semibold" : "text-gray-400", "text-xs tabular-nums shrink-0"])}" data-v-8f244af0>${ssrInterpolate(unref(form).nisn.length)}/10 </span></div></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-8f244af0><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> Unit Kelas <span class="text-red-500" data-v-8f244af0>*</span></label><select class="${ssrRenderClass([fieldError("kelas_id") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 transition focus:outline-none focus:ring-2 appearance-none select-custom"])}" data-v-8f244af0><option value="" data-v-8f244af0${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, "") : ssrLooseEqual(unref(form).kelas_id, "")) ? " selected" : ""}>-- Pilih Kelas --</option><!--[-->`);
        ssrRenderList(__props.kelas, (k) => {
          _push(`<option${ssrRenderAttr("value", k.id)} data-v-8f244af0${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, k.id) : ssrLooseEqual(unref(form).kelas_id, k.id)) ? " selected" : ""}>${ssrInterpolate(k.kelas)}</option>`);
        });
        _push(`<!--]--></select>`);
        if (fieldError("kelas_id")) {
          _push(`<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" data-v-8f244af0>`);
          _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "w-3.5 h-3.5 shrink-0" }, null, _parent));
          _push(` ${ssrInterpolate(fieldError("kelas_id"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (__props.isSmk) {
          _push(`<div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> Program Kejuruan <span class="text-red-500" data-v-8f244af0>*</span></label><select class="${ssrRenderClass([fieldError("kejuruan_id") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 transition focus:outline-none focus:ring-2 appearance-none select-custom"])}" data-v-8f244af0><option value="" data-v-8f244af0${ssrIncludeBooleanAttr(Array.isArray(unref(form).kejuruan_id) ? ssrLooseContain(unref(form).kejuruan_id, "") : ssrLooseEqual(unref(form).kejuruan_id, "")) ? " selected" : ""}>-- Pilih Program Kejuruan --</option><!--[-->`);
          ssrRenderList(__props.kejuruan, (j) => {
            _push(`<option${ssrRenderAttr("value", j.id)} data-v-8f244af0${ssrIncludeBooleanAttr(Array.isArray(unref(form).kejuruan_id) ? ssrLooseContain(unref(form).kejuruan_id, j.id) : ssrLooseEqual(unref(form).kejuruan_id, j.id)) ? " selected" : ""}>${ssrInterpolate(j.kejuruan)}</option>`);
          });
          _push(`<!--]--></select>`);
          if (fieldError("kejuruan_id")) {
            _push(`<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" data-v-8f244af0>`);
            _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "w-3.5 h-3.5 shrink-0" }, null, _parent));
            _push(` ${ssrInterpolate(fieldError("kejuruan_id"))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (currentStep.value === 1) {
        _push(`<!--[--><div class="flex items-center gap-2 mb-1" data-v-8f244af0>`);
        _push(ssrRenderComponent(unref(IdentificationIcon), { class: "w-4 h-4 text-blue-500" }, null, _parent));
        _push(`<span class="text-xs font-bold text-gray-400 uppercase tracking-widest" data-v-8f244af0> Data Pribadi </span></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-8f244af0><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> Tempat Lahir </label><input${ssrRenderAttr("value", unref(form).tempat_lahir)} type="text" placeholder="Contoh: Jakarta" class="${ssrRenderClass([fieldError("tempat_lahir") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2"])}" data-v-8f244af0></div><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> Tanggal Lahir </label><input${ssrRenderAttr("value", unref(form).tanggal_lahir)} type="date"${ssrRenderAttr("max", (/* @__PURE__ */ new Date()).toISOString().split("T")[0])} class="${ssrRenderClass([fieldError("tanggal_lahir") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2"])}" data-v-8f244af0>`);
        if (fieldError("tanggal_lahir")) {
          _push(`<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" data-v-8f244af0>`);
          _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "w-3.5 h-3.5 shrink-0" }, null, _parent));
          _push(` ${ssrInterpolate(fieldError("tanggal_lahir"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-8f244af0><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> Jenis Kelamin </label><select class="${ssrRenderClass([fieldError("jenis_kelamin") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 transition focus:outline-none focus:ring-2 appearance-none select-custom"])}" data-v-8f244af0><option value="" data-v-8f244af0${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis_kelamin) ? ssrLooseContain(unref(form).jenis_kelamin, "") : ssrLooseEqual(unref(form).jenis_kelamin, "")) ? " selected" : ""}>-- Pilih --</option><option value="L" data-v-8f244af0${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis_kelamin) ? ssrLooseContain(unref(form).jenis_kelamin, "L") : ssrLooseEqual(unref(form).jenis_kelamin, "L")) ? " selected" : ""}>Laki-laki</option><option value="P" data-v-8f244af0${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis_kelamin) ? ssrLooseContain(unref(form).jenis_kelamin, "P") : ssrLooseEqual(unref(form).jenis_kelamin, "P")) ? " selected" : ""}>Perempuan</option></select></div><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> Agama </label><select class="${ssrRenderClass([fieldError("agama") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 transition focus:outline-none focus:ring-2 appearance-none select-custom"])}" data-v-8f244af0><option value="" data-v-8f244af0${ssrIncludeBooleanAttr(Array.isArray(unref(form).agama) ? ssrLooseContain(unref(form).agama, "") : ssrLooseEqual(unref(form).agama, "")) ? " selected" : ""}>-- Pilih --</option><!--[-->`);
        ssrRenderList(agamaOptions, (a) => {
          _push(`<option${ssrRenderAttr("value", a)} data-v-8f244af0${ssrIncludeBooleanAttr(Array.isArray(unref(form).agama) ? ssrLooseContain(unref(form).agama, a) : ssrLooseEqual(unref(form).agama, a)) ? " selected" : ""}>${ssrInterpolate(a)}</option>`);
        });
        _push(`<!--]--></select></div></div><div class="flex items-center gap-2 pt-3 mb-1" data-v-8f244af0>`);
        _push(ssrRenderComponent(unref(PhoneIcon), { class: "w-4 h-4 text-blue-500" }, null, _parent));
        _push(`<span class="text-xs font-bold text-gray-400 uppercase tracking-widest" data-v-8f244af0> Kontak Siswa &amp; Wali Murid </span></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-8f244af0><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> No. HP / WA Siswa </label><input${ssrRenderAttr("value", unref(form).no_hp)} type="tel" placeholder="08xxxxxxxxxx" inputmode="tel" class="${ssrRenderClass([fieldError("no_hp") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2"])}" data-v-8f244af0>`);
        if (fieldError("no_hp")) {
          _push(`<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" data-v-8f244af0>`);
          _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "w-3.5 h-3.5 shrink-0" }, null, _parent));
          _push(` ${ssrInterpolate(fieldError("no_hp"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> No. HP Orang Tua / Wali </label><input${ssrRenderAttr("value", unref(form).no_hp_ortu)} type="tel" placeholder="08xxxxxxxxxx" inputmode="tel" class="${ssrRenderClass([fieldError("no_hp_ortu") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2"])}" data-v-8f244af0>`);
        if (fieldError("no_hp_ortu")) {
          _push(`<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" data-v-8f244af0>`);
          _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "w-3.5 h-3.5 shrink-0" }, null, _parent));
          _push(` ${ssrInterpolate(fieldError("no_hp_ortu"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (currentStep.value === 2) {
        _push(`<!--[--><div class="flex items-center gap-2 mb-1" data-v-8f244af0>`);
        _push(ssrRenderComponent(unref(MapPinIcon), { class: "w-4 h-4 text-blue-500" }, null, _parent));
        _push(`<span class="text-xs font-bold text-gray-400 uppercase tracking-widest" data-v-8f244af0> Alamat Tempat Tinggal </span></div><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0> Alamat Lengkap </label><textarea rows="2" placeholder="Nama jalan, nomor rumah, RT/RW, dll." class="${ssrRenderClass([fieldError("alamat") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 resize-none"])}" data-v-8f244af0>${ssrInterpolate(unref(form).alamat)}</textarea></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-8f244af0><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0>Kelurahan / Desa</label><input${ssrRenderAttr("value", unref(form).kelurahan)} type="text" placeholder="Contoh: Cempaka Putih" class="${ssrRenderClass([fieldError("kelurahan") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2"])}" data-v-8f244af0></div><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0>Kecamatan</label><input${ssrRenderAttr("value", unref(form).kecamatan)} type="text" placeholder="Contoh: Tanah Abang" class="${ssrRenderClass([fieldError("kecamatan") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2"])}" data-v-8f244af0></div></div><div class="grid grid-cols-2 sm:grid-cols-3 gap-4" data-v-8f244af0><div class="col-span-2 sm:col-span-2" data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0>Kota / Kabupaten</label><input${ssrRenderAttr("value", unref(form).kota)} type="text" placeholder="Contoh: Jakarta Pusat" class="${ssrRenderClass([fieldError("kota") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2"])}" data-v-8f244af0></div><div data-v-8f244af0><label class="block text-sm font-semibold text-gray-700 mb-1.5" data-v-8f244af0>Kode Pos</label><input${ssrRenderAttr("value", unref(form).kode_pos)} type="text" placeholder="12345" maxlength="5" inputmode="numeric" class="${ssrRenderClass([fieldError("kode_pos") ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-blue-300 focus:border-blue-400", "w-full rounded-xl border px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 tracking-widest"])}" data-v-8f244af0>`);
        if (fieldError("kode_pos")) {
          _push(`<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1" data-v-8f244af0>`);
          _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "w-3.5 h-3.5 shrink-0" }, null, _parent));
          _push(` ${ssrInterpolate(fieldError("kode_pos"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="pt-4 flex items-center gap-3" data-v-8f244af0>`);
      if (!isFirstStep.value) {
        _push(`<button type="button" class="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200 shrink-0" data-v-8f244af0>`);
        _push(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-4 h-4" }, null, _parent));
        _push(` Kembali </button>`);
      } else {
        _push(`<!---->`);
      }
      if (!isLastStep.value) {
        _push(`<button type="submit" class="flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-lg shadow-blue-200 transition-all duration-200" data-v-8f244af0> Selanjutnya `);
        _push(ssrRenderComponent(unref(ArrowRightIcon), { class: "w-4 h-4" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all duration-200" data-v-8f244af0>`);
        if (unref(form).processing) {
          _push(`<svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-8f244af0><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-8f244af0></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" data-v-8f244af0></path></svg>`);
        } else {
          _push(ssrRenderComponent(unref(CheckBadgeIcon), { class: "w-4 h-4" }, null, _parent));
        }
        _push(` ${ssrInterpolate(unref(form).processing ? "Menyimpan..." : "Simpan Data")}</button>`);
      }
      _push(`</div>`);
      if (isFirstStep.value) {
        _push(`<button type="button" class="w-full mt-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-colors sm:hidden" data-v-8f244af0>`);
        _push(ssrRenderComponent(unref(ArrowLeftOnRectangleIcon), { class: "w-4 h-4" }, null, _parent));
        _push(` Keluar dari Akun </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></div><p class="text-center text-xs text-gray-400 mt-5" data-v-8f244af0> Data yang kamu isi akan digunakan untuk keperluan administrasi sekolah. </p></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Form/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8f244af0"]]);
export {
  Create as default
};
