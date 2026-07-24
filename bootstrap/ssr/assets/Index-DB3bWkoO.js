import { ref, watch, computed, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { usePage, Head, router } from "@inertiajs/vue3";
import { useDebounceFn } from "@vueuse/core";
import Swal from "sweetalert2";
import _sfc_main$1 from "./StatsBar-vhQCBvd2.js";
import _sfc_main$2 from "./RegistrationTable-nzcneOz2.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    registrations: Object,
    stats: Object,
    byProgram: Object,
    filters: Object,
    programs: Array,
    statusOptions: Array
  },
  setup(__props) {
    const props = __props;
    const search = ref(props.filters.search ?? "");
    const status = ref(props.filters.status ?? "");
    const program = ref(props.filters.program ?? "");
    const perPage = ref(props.filters.per_page ?? 20);
    function applyFilters() {
      router.get(
        route("admin.registrations.index"),
        {
          search: search.value || void 0,
          status: status.value || void 0,
          program: program.value || void 0,
          per_page: perPage.value !== 20 ? perPage.value : void 0
        },
        { preserveState: true, replace: true }
      );
    }
    const debouncedApply = useDebounceFn(applyFilters, 350);
    watch(search, debouncedApply);
    watch([status, program, perPage], applyFilters);
    const flash = computed(() => usePage().props.flash);
    const hasActiveFilter = computed(
      () => !!(search.value || status.value || program.value)
    );
    computed(() => {
      const parts = [];
      if (status.value) parts.push(`status "${status.value}"`);
      if (program.value) parts.push(`jurusan "${program.value.split("—")[0].trim()}"`);
      if (search.value) parts.push(`pencarian "${search.value}"`);
      return parts.length ? parts.join(", ") : null;
    });
    async function confirmWithTyping(title, html) {
      const result = await Swal.fire({
        title,
        html,
        input: "text",
        inputPlaceholder: "Ketik HAPUS di sini",
        inputAttributes: {
          autocomplete: "off",
          spellcheck: "false",
          autocorrect: "off",
          autocapitalize: "none"
        },
        showCancelButton: true,
        confirmButtonText: '<i class="ti ti-trash mr-1"></i> Ya, Hapus',
        cancelButtonText: "Batal",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        reverseButtons: true,
        focusCancel: true,
        preConfirm: (inputValue) => {
          if (inputValue !== "HAPUS") {
            Swal.showValidationMessage(
              '<i class="ti ti-alert-circle mr-1"></i> Ketik persis <b>HAPUS</b> (huruf kapital) untuk melanjutkan'
            );
            return false;
          }
          return true;
        }
      });
      return result.isConfirmed;
    }
    async function handleSingleDelete(id, name) {
      const confirmed = await confirmWithTyping(
        "Hapus Pendaftaran?",
        `Data pendaftaran atas nama <strong class="text-gray-900">${name}</strong> akan dihapus.
        <br><br>
        Ketik <code style="background:#fee2e2;color:#dc2626;padding:2px 6px;border-radius:4px;font-weight:700">HAPUS</code> untuk mengkonfirmasi.`
      );
      if (!confirmed) return;
      router.delete(route("admin.registrations.destroy", id), {
        preserveScroll: true,
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Dihapus!",
            text: `Data pendaftaran ${name} berhasil dihapus.`,
            timer: 2500,
            showConfirmButton: false,
            timerProgressBar: true
          });
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan saat menghapus data. Silakan coba lagi."
          });
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Manajemen Pendaftaran — Admin" }, null, _parent));
      _push(`<div class="min-h-screen bg-gray-50 dark:bg-gray-950"><header class="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between gap-4"><div class="flex items-center gap-2.5"><i class="ti ti-school text-xl text-indigo-600 dark:text-indigo-400" aria-hidden="true"></i><span class="font-semibold text-gray-800 dark:text-gray-100 text-sm tracking-tight"> SMK NUSANTARA </span><span class="text-gray-300 dark:text-gray-600">/</span><span class="text-sm text-gray-500 dark:text-gray-400">Sistem Pendaftaran Murid Baru (SPMB)</span></div><a${ssrRenderAttr("href", _ctx.route("admin.registrations.index", { ...__props.filters, export: "csv" }))} class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><i class="ti ti-download text-sm" aria-hidden="true"></i> Powered By KreatiCraft Indonesia </a></div></header><main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">`);
      if (flash.value?.success) {
        _push(`<div class="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"><i class="ti ti-circle-check text-base shrink-0" aria-hidden="true"></i> ${ssrInterpolate(flash.value.success)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-start justify-between gap-4"><div><h1 class="text-lg font-semibold text-gray-900 dark:text-gray-50"> Data Pendaftaran Siswa Baru </h1><p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400"> Kelola dan update status setiap pendaftaran yang masuk. </p></div>`);
      if ((__props.stats?.total ?? 0) > 0) {
        _push(`<button class="${ssrRenderClass([hasActiveFilter.value ? "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40" : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40", "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors shrink-0"])}"${ssrRenderAttr("title", hasActiveFilter.value ? "Hapus semua data yang sesuai filter aktif" : "Hapus semua data pendaftaran")}><i class="ti ti-trash text-sm" aria-hidden="true"></i>`);
        if (hasActiveFilter.value) {
          _push(`<span>Hapus Data Terfilter</span>`);
        } else {
          _push(`<span>Hapus Semua Data</span>`);
        }
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        stats: __props.stats,
        "by-program": __props.byProgram
      }, null, _parent));
      _push(`<div class="flex flex-wrap items-end gap-3"><div class="relative flex-1 min-w-[180px]"><label for="search" class="sr-only">Cari nama / nomor WA</label><i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" aria-hidden="true"></i><input id="search"${ssrRenderAttr("value", search.value)} type="search" placeholder="Cari nama atau nomor HP…" class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"></div><div><label for="filter-status" class="sr-only">Filter status</label><select id="filter-status" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-10 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"><!--[-->`);
      ssrRenderList(__props.statusOptions, (opt) => {
        _push(`<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, opt.value) : ssrLooseEqual(status.value, opt.value)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`);
      });
      _push(`<!--]--></select></div><div><label for="filter-program" class="sr-only">Filter jurusan</label><select id="filter-program" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-10 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"><option value=""${ssrIncludeBooleanAttr(Array.isArray(program.value) ? ssrLooseContain(program.value, "") : ssrLooseEqual(program.value, "")) ? " selected" : ""}>Semua Jurusan</option><!--[-->`);
      ssrRenderList(__props.programs, (p) => {
        _push(`<option${ssrRenderAttr("value", p)}${ssrIncludeBooleanAttr(Array.isArray(program.value) ? ssrLooseContain(program.value, p) : ssrLooseEqual(program.value, p)) ? " selected" : ""}>${ssrInterpolate(p.split("—")[0].trim())}</option>`);
      });
      _push(`<!--]--></select></div><div><label for="per-page" class="sr-only">Baris per halaman</label><select id="per-page" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-10 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"><option${ssrRenderAttr("value", 10)}${ssrIncludeBooleanAttr(Array.isArray(perPage.value) ? ssrLooseContain(perPage.value, 10) : ssrLooseEqual(perPage.value, 10)) ? " selected" : ""}>10 / hal</option><option${ssrRenderAttr("value", 20)}${ssrIncludeBooleanAttr(Array.isArray(perPage.value) ? ssrLooseContain(perPage.value, 20) : ssrLooseEqual(perPage.value, 20)) ? " selected" : ""}>20 / hal</option><option${ssrRenderAttr("value", 50)}${ssrIncludeBooleanAttr(Array.isArray(perPage.value) ? ssrLooseContain(perPage.value, 50) : ssrLooseEqual(perPage.value, 50)) ? " selected" : ""}>50 / hal</option><option${ssrRenderAttr("value", 100)}${ssrIncludeBooleanAttr(Array.isArray(perPage.value) ? ssrLooseContain(perPage.value, 100) : ssrLooseEqual(perPage.value, 100)) ? " selected" : ""}>100 / hal</option></select></div>`);
      if (search.value || status.value || program.value || perPage.value !== 20) {
        _push(`<button class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><i class="ti ti-x text-sm" aria-hidden="true"></i> Reset </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        registrations: __props.registrations,
        "status-options": __props.statusOptions,
        onDelete: handleSingleDelete
      }, null, _parent));
      _push(`</main></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Registrations/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
