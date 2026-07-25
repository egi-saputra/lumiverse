import { ref, mergeProps, useSSRContext, computed, unref, withCtx, openBlock, createBlock, Teleport, toDisplayString, createCommentVNode, createVNode, Fragment, withDirectives, vModelText, renderList, vModelSelect, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderComponent, ssrRenderTeleport, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./MenuLayout-61-dwqPB.js";
import { Head, router } from "@inertiajs/vue3";
import { CalendarDaysIcon } from "@heroicons/vue/24/solid";
import "xlsx-js-style";
import "jspdf";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
const _sfc_main$2 = {
  __name: "ExportExcel",
  __ssrInlineRender: true,
  props: {
    kelas: { type: Object, default: null },
    label: { type: String, default: "" },
    hariEfektif: { type: Array, default: () => [] },
    siswa: { type: Array, default: () => [] },
    rekapKelas: { type: Object, default: null },
    avgKehadiran: { type: [Number, null], default: null },
    allCatatan: { type: Array, default: () => [] }
  },
  setup(__props) {
    const exporting = ref(false);
    const errorMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "inline-flex flex-col items-end gap-1" }, _attrs))}><button${ssrIncludeBooleanAttr(exporting.value) ? " disabled" : ""} class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all">`);
      if (exporting.value) {
        _push(`<svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`);
      } else {
        _push(`<span>📊</span>`);
      }
      _push(`<span class="hidden sm:inline">${ssrInterpolate(exporting.value ? "Mengekspor…" : "Excel")}</span></button>`);
      if (errorMsg.value) {
        _push(`<p class="text-[10px] text-rose-500 max-w-[160px] text-right">${ssrInterpolate(errorMsg.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Export/ExportExcel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "ExportPdf",
  __ssrInlineRender: true,
  props: {
    kelas: { type: Object, default: null },
    label: { type: String, default: "" },
    hariEfektif: { type: Array, default: () => [] },
    siswa: { type: Array, default: () => [] },
    rekapKelas: { type: Object, default: null },
    avgKehadiran: { type: [Number, null], default: null },
    allCatatan: { type: Array, default: () => [] }
  },
  setup(__props) {
    const exporting = ref(false);
    const errorMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "inline-flex flex-col items-end gap-1" }, _attrs))}><button${ssrIncludeBooleanAttr(exporting.value) ? " disabled" : ""} class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-700/60 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all">`);
      if (exporting.value) {
        _push(`<svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`);
      } else {
        _push(`<span>📄</span>`);
      }
      _push(`<span class="hidden sm:inline">${ssrInterpolate(exporting.value ? "Mengekspor…" : "PDF")}</span></button>`);
      if (errorMsg.value) {
        _push(`<p class="text-[10px] text-rose-500 max-w-[160px] text-right">${ssrInterpolate(errorMsg.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Export/ExportPdf.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Rekap",
  __ssrInlineRender: true,
  props: {
    guru: { type: Object, required: true },
    kelasList: { type: Array, default: () => [] },
    kelas: { type: Object, default: null },
    mode: { type: String, default: "bulan" },
    bulan: { type: Number, default: null },
    tahun: { type: Number, default: null },
    mulai: { type: String, default: null },
    sampai: { type: String, default: null },
    label: { type: String, default: "" },
    hariEfektif: { type: Array, default: () => [] },
    siswa: { type: Array, default: () => [] },
    rekapKelas: { type: Object, default: null },
    dataLoaded: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const STATUS = {
      hadir: { label: "Hadir", short: "H", bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-300 dark:ring-emerald-700" },
      sakit: { label: "Sakit", short: "S", bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-300 dark:ring-amber-700" },
      izin: { label: "Izin", short: "I", bg: "bg-sky-100 dark:bg-sky-900/40", text: "text-sky-700 dark:text-sky-300", ring: "ring-sky-300 dark:ring-sky-700" },
      alpha: { label: "Alpha", short: "A", bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-700 dark:text-rose-300", ring: "ring-rose-300 dark:ring-rose-700" }
    };
    const BULAN_NAMES = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];
    const kelasSearch = ref("");
    const loading = ref(false);
    const kelasFiltered = computed(() => {
      if (!kelasSearch.value.trim()) return props.kelasList;
      const q = kelasSearch.value.toLowerCase();
      return props.kelasList.filter(
        (k) => k.kelas.toLowerCase().includes(q) || k.guru_nama.toLowerCase().includes(q)
      );
    });
    function selectKelas(kelasId) {
      loading.value = true;
      router.get(
        route("guru.absensi.rekap"),
        { kelas_id: kelasId },
        { preserveScroll: false, onFinish: () => {
          loading.value = false;
        } }
      );
    }
    function changeKelas() {
      router.get(route("guru.absensi.rekap"), {}, { preserveScroll: false });
    }
    const filterMode = ref(props.mode ?? "bulan");
    const selectedBulan = ref(props.bulan ?? (/* @__PURE__ */ new Date()).getMonth() + 1);
    const selectedTahun = ref(props.tahun ?? (/* @__PURE__ */ new Date()).getFullYear());
    const tanggalMulai = ref(props.mulai ?? "");
    const tanggalSampai = ref(props.sampai ?? "");
    const filterError = ref("");
    const tahunOptions = computed(() => {
      const y = (/* @__PURE__ */ new Date()).getFullYear();
      return Array.from({ length: 6 }, (_, i) => y - i);
    });
    function applyFilter() {
      if (!props.kelas) return;
      filterError.value = "";
      const base = { kelas_id: props.kelas.id };
      if (filterMode.value === "bulan") {
        loading.value = true;
        router.get(route("guru.absensi.rekap"), {
          ...base,
          mode: "bulan",
          bulan: selectedBulan.value,
          tahun: selectedTahun.value
        }, { preserveScroll: false, onFinish: () => {
          loading.value = false;
        } });
      } else {
        if (!tanggalMulai.value || !tanggalSampai.value) {
          filterError.value = "Isi kedua tanggal terlebih dahulu.";
          return;
        }
        if (tanggalMulai.value > tanggalSampai.value) {
          filterError.value = "Tanggal mulai harus sebelum tanggal akhir.";
          return;
        }
        const diff = (new Date(tanggalSampai.value) - new Date(tanggalMulai.value)) / 864e5;
        if (diff > 92) {
          filterError.value = "Rentang maksimal 92 hari.";
          return;
        }
        loading.value = true;
        router.get(route("guru.absensi.rekap"), {
          ...base,
          mode: "rentang",
          mulai: tanggalMulai.value,
          sampai: tanggalSampai.value
        }, { preserveScroll: false, onFinish: () => {
          loading.value = false;
        } });
      }
    }
    const showCatatan = ref(false);
    const allCatatan = computed(
      () => props.siswa.flatMap(
        (s) => (s.catatan ?? []).map((c) => ({ ...c, nama: s.nama_lengkap, nis: s.nis }))
      ).sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    );
    const tooltip = ref({ visible: false, text: "", x: 0, y: 0 });
    function showTooltip(evt, text) {
      if (!text) return;
      tooltip.value = { visible: true, text, x: evt.clientX + 14, y: evt.clientY + 14 };
    }
    function hideTooltip() {
      tooltip.value.visible = false;
    }
    const search = ref("");
    const siswaFiltered = computed(() => {
      if (!search.value.trim()) return props.siswa;
      const q = search.value.toLowerCase();
      return props.siswa.filter(
        (s) => s.nama_lengkap.toLowerCase().includes(q) || String(s.nis).includes(q)
      );
    });
    const hasData = computed(() => props.hariEfektif.length > 0);
    function formatTanggal(tgl) {
      return new Date(tgl).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    }
    function getDayShort(tgl) {
      return new Date(tgl).toLocaleDateString("id-ID", { weekday: "short" });
    }
    function isWeekend(tgl) {
      const d = new Date(tgl).getDay();
      return d === 0 || d === 6;
    }
    function getDetail(siswa, tgl) {
      return siswa.detail?.find((d) => d.tanggal === tgl) ?? null;
    }
    function pctStyle(pct) {
      if (pct === null || pct === void 0) return "none";
      if (pct >= 80) return "high";
      if (pct >= 60) return "mid";
      return "low";
    }
    function pctClass(pct) {
      const s = pctStyle(pct);
      if (s === "high") return "text-emerald-700 dark:text-emerald-300";
      if (s === "mid") return "text-orange-700 dark:text-orange-300";
      if (s === "low") return "text-rose-700 dark:text-rose-300";
      return "text-slate-400 dark:text-slate-500";
    }
    const avgKehadiran = computed(() => {
      const valid = props.siswa.filter((s) => s.pct_kehadiran !== null && s.pct_kehadiran !== void 0);
      if (!valid.length) return null;
      return Math.round(valid.reduce((a, s) => a + s.pct_kehadiran, 0) / valid.length * 10) / 10;
    });
    const summaryCards = computed(() => {
      if (!props.rekapKelas) return [];
      return [
        { label: "Hari Efektif", value: props.rekapKelas.hari_efektif, icon: "📅", color: "bg-slate-50 dark:bg-slate-800/60", ring: "ring-1 ring-slate-200 dark:ring-slate-700", val: "text-slate-800 dark:text-white" },
        { label: "Hadir", value: props.rekapKelas.total_hadir, icon: "✅", color: "bg-emerald-50 dark:bg-emerald-900/20", ring: "ring-1 ring-emerald-200 dark:ring-emerald-800", val: "text-emerald-700 dark:text-emerald-300" },
        { label: "Sakit", value: props.rekapKelas.total_sakit, icon: "🩺", color: "bg-amber-50 dark:bg-amber-900/20", ring: "ring-1 ring-amber-200 dark:ring-amber-800", val: "text-amber-700 dark:text-amber-300" },
        { label: "Izin", value: props.rekapKelas.total_izin, icon: "📋", color: "bg-sky-50 dark:bg-sky-900/20", ring: "ring-1 ring-sky-200 dark:ring-sky-800", val: "text-sky-700 dark:text-sky-300" },
        { label: "Alpha", value: props.rekapKelas.total_alpha, icon: "🚫", color: "bg-rose-50 dark:bg-rose-900/20", ring: "ring-1 ring-rose-200 dark:ring-rose-800", val: "text-rose-700 dark:text-rose-300" },
        {
          label: "Rata-rata",
          value: avgKehadiran.value !== null ? avgKehadiran.value + "%" : "—",
          icon: "📊",
          color: pctStyle(avgKehadiran.value) === "high" ? "bg-emerald-50 dark:bg-emerald-900/20" : pctStyle(avgKehadiran.value) === "mid" ? "bg-orange-50 dark:bg-orange-900/20" : pctStyle(avgKehadiran.value) === "low" ? "bg-rose-50 dark:bg-rose-900/20" : "bg-slate-50 dark:bg-slate-800/60",
          ring: "ring-1 ring-slate-200 dark:ring-slate-700",
          val: pctClass(avgKehadiran.value)
        }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Rekap Absensi" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderTeleport(_push2, (_push3) => {
              if (tooltip.value.visible) {
                _push3(`<div class="fixed z-[9999] pointer-events-none max-w-[240px] px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-950 text-white text-xs leading-snug shadow-xl" style="${ssrRenderStyle({ top: tooltip.value.y + "px", left: tooltip.value.x + "px" })}" data-v-c250100e${_scopeId}>${ssrInterpolate(tooltip.value.text)}</div>`);
              } else {
                _push3(`<!---->`);
              }
            }, "body", false, _parent2);
            _push2(`<div class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100" data-v-c250100e${_scopeId}><header data-v-c250100e${_scopeId}><div class="mx-auto py-4 px-2 flex items-center justify-between gap-4" data-v-c250100e${_scopeId}><div class="flex items-center gap-3" data-v-c250100e${_scopeId}><div class="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg flex-shrink-0" data-v-c250100e${_scopeId}> 📋 </div><div data-v-c250100e${_scopeId}><div class="text-sm font-bold dark:text-gray-200 text-gray-700 leading-tight" data-v-c250100e${_scopeId}>Rekap Absensi </div><div class="text-xs text-slate-400 mt-0.5" data-v-c250100e${_scopeId}>${ssrInterpolate(__props.guru.nama_lengkap)}</div></div></div>`);
            if (hasData.value) {
              _push2(`<div class="flex items-center gap-2" data-v-c250100e${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                kelas: __props.kelas,
                label: __props.label,
                "hari-efektif": __props.hariEfektif,
                siswa: __props.siswa,
                "rekap-kelas": __props.rekapKelas,
                "avg-kehadiran": avgKehadiran.value,
                "all-catatan": allCatatan.value
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$1, {
                kelas: __props.kelas,
                label: __props.label,
                "hari-efektif": __props.hariEfektif,
                siswa: __props.siswa,
                "rekap-kelas": __props.rekapKelas,
                "avg-kehadiran": avgKehadiran.value,
                "all-catatan": allCatatan.value
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></header><main class="mx-auto space-y-5" data-v-c250100e${_scopeId}>`);
            if (!__props.kelas) {
              _push2(`<!--[--><div class="text-center py-4" data-v-c250100e${_scopeId}><span class="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-widest mb-3" data-v-c250100e${_scopeId}> Langkah 1 </span><h2 class="text-2xl font-extrabold text-slate-800 dark:text-white" data-v-c250100e${_scopeId}>Pilih kelasnya dulu yuk!</h2><p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400" data-v-c250100e${_scopeId}>Sekarang, semua guru dapat merekap data absensi siswa dari kelas manapun dengan mudah.</p></div><div class="max-w-md mx-auto" data-v-c250100e${_scopeId}><div class="flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 transition-colors" data-v-c250100e${_scopeId}><span class="text-slate-400 text-sm" data-v-c250100e${_scopeId}>🔍</span><input${ssrRenderAttr("value", kelasSearch.value)} type="search" placeholder="Cari kelas atau wali kelas…" class="flex-1 bg-transparent outline-none text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-white" data-v-c250100e${_scopeId}></div></div>`);
              if (kelasFiltered.value.length) {
                _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-v-c250100e${_scopeId}><!--[-->`);
                ssrRenderList(kelasFiltered.value, (k) => {
                  _push2(`<button class="group flex items-center gap-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200" data-v-c250100e${_scopeId}><div class="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl flex-shrink-0" data-v-c250100e${_scopeId}> 🏫</div><div class="flex-1 min-w-0" data-v-c250100e${_scopeId}><div class="font-bold text-slate-800 dark:text-white text-sm" data-v-c250100e${_scopeId}>${ssrInterpolate(k.kelas)}</div><div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400" data-v-c250100e${_scopeId}><span data-v-c250100e${_scopeId}>👤 ${ssrInterpolate(k.guru_nama)}</span><span data-v-c250100e${_scopeId}>🎓 ${ssrInterpolate(k.jumlah_siswa)} siswa</span></div></div><span class="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all text-sm" data-v-c250100e${_scopeId}>›</span></button>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<div class="text-center py-16 text-slate-400 dark:text-slate-500" data-v-c250100e${_scopeId}><div class="text-4xl mb-3" data-v-c250100e${_scopeId}>😶</div><p class="text-sm" data-v-c250100e${_scopeId}>Tidak ada kelas yang cocok dengan pencarian</p></div>`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<!--[--><div class="flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3" data-v-c250100e${_scopeId}><div class="flex items-center gap-3" data-v-c250100e${_scopeId}><div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg flex-shrink-0" data-v-c250100e${_scopeId}> 🏫</div><div data-v-c250100e${_scopeId}><div class="font-bold text-slate-800 dark:text-white text-sm" data-v-c250100e${_scopeId}>${ssrInterpolate(__props.kelas.kelas)}</div><div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5" data-v-c250100e${_scopeId}>Wali Kelas: ${ssrInterpolate(__props.kelas.guru_nama)}</div></div></div><button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all" data-v-c250100e${_scopeId}> 🔄 Ganti Kelas </button></div><div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4" data-v-c250100e${_scopeId}><p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5" data-v-c250100e${_scopeId}> 🔽 Filter Periode </p><div class="flex gap-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl p-1 w-fit" data-v-c250100e${_scopeId}><button class="${ssrRenderClass(["flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all", filterMode.value === "bulan" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"])}" data-v-c250100e${_scopeId}> 📆 Per Bulan </button><button class="${ssrRenderClass(["flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all", filterMode.value === "rentang" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"])}" data-v-c250100e${_scopeId}> 📅 Rentang Tanggal </button></div><div class="flex flex-wrap items-end gap-3" data-v-c250100e${_scopeId}>`);
              if (filterMode.value === "bulan") {
                _push2(`<!--[--><div class="flex flex-col gap-1" data-v-c250100e${_scopeId}><label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500" data-v-c250100e${_scopeId}>Bulan</label><select class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 min-w-[150px] transition" data-v-c250100e${_scopeId}><!--[-->`);
                ssrRenderList(BULAN_NAMES, (nama, idx) => {
                  _push2(`<option${ssrRenderAttr("value", idx + 1)} data-v-c250100e${ssrIncludeBooleanAttr(Array.isArray(selectedBulan.value) ? ssrLooseContain(selectedBulan.value, idx + 1) : ssrLooseEqual(selectedBulan.value, idx + 1)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(nama)}</option>`);
                });
                _push2(`<!--]--></select></div><div class="flex flex-col gap-1" data-v-c250100e${_scopeId}><label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500" data-v-c250100e${_scopeId}>Tahun</label><select class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 min-w-[110px] transition" data-v-c250100e${_scopeId}><!--[-->`);
                ssrRenderList(tahunOptions.value, (y) => {
                  _push2(`<option${ssrRenderAttr("value", y)} data-v-c250100e${ssrIncludeBooleanAttr(Array.isArray(selectedTahun.value) ? ssrLooseContain(selectedTahun.value, y) : ssrLooseEqual(selectedTahun.value, y)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(y)}</option>`);
                });
                _push2(`<!--]--></select></div><!--]-->`);
              } else {
                _push2(`<!--[--><div class="flex flex-col gap-1" data-v-c250100e${_scopeId}><label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500" data-v-c250100e${_scopeId}>Dari Tanggal</label><div class="relative" data-v-c250100e${_scopeId}><input type="date"${ssrRenderAttr("value", tanggalMulai.value)}${ssrRenderAttr("max", tanggalSampai.value || void 0)} class="date-input w-full pr-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-gray-700 dark:text-gray-200" data-v-c250100e${_scopeId}>`);
                _push2(ssrRenderComponent(unref(CalendarDaysIcon), { class: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" }, null, _parent2, _scopeId));
                _push2(`</div></div><div class="flex flex-col gap-1" data-v-c250100e${_scopeId}><label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500" data-v-c250100e${_scopeId}>Sampai Tanggal</label><div class="relative" data-v-c250100e${_scopeId}><input type="date"${ssrRenderAttr("value", tanggalSampai.value)}${ssrRenderAttr("min", tanggalMulai.value || void 0)}${ssrRenderAttr("max", (/* @__PURE__ */ new Date()).toISOString().slice(0, 10))} class="date-input w-full pr-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-gray-700 dark:text-gray-200" data-v-c250100e${_scopeId}>`);
                _push2(ssrRenderComponent(unref(CalendarDaysIcon), { class: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" }, null, _parent2, _scopeId));
                _push2(`</div></div><!--]-->`);
              }
              if (filterError.value) {
                _push2(`<p class="text-xs text-rose-500 flex items-center gap-1 pb-1.5" data-v-c250100e${_scopeId}>⚠️ ${ssrInterpolate(filterError.value)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-v-c250100e${_scopeId}>`);
              if (loading.value) {
                _push2(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" data-v-c250100e${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-c250100e${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" data-v-c250100e${_scopeId}></path></svg>`);
              } else {
                _push2(`<span data-v-c250100e${_scopeId}>🔍</span>`);
              }
              _push2(` ${ssrInterpolate(loading.value ? "Memuat…" : "Tampilkan")}</button></div></div>`);
              if (!__props.dataLoaded && !hasData.value) {
                _push2(`<div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-16 text-center" data-v-c250100e${_scopeId}><div class="text-5xl mb-4" data-v-c250100e${_scopeId}>📊</div><p class="font-semibold text-slate-700 dark:text-slate-200" data-v-c250100e${_scopeId}>Belum ada data ditampilkan</p><p class="mt-1.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto" data-v-c250100e${_scopeId}> Pilih periode (bulan atau rentang tanggal), lalu klik <strong data-v-c250100e${_scopeId}>Tampilkan</strong>. </p></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (hasData.value) {
                _push2(`<!--[--><div class="flex items-center flex-wrap gap-3" data-v-c250100e${_scopeId}><span class="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-950 text-sky-300 px-4 py-1.5 rounded-full text-xs font-bold" data-v-c250100e${_scopeId}> 📅 ${ssrInterpolate(__props.label)}</span><span class="text-xs text-slate-500 dark:text-slate-400" data-v-c250100e${_scopeId}>${ssrInterpolate(__props.rekapKelas.hari_efektif)} hari efektif · ${ssrInterpolate(__props.rekapKelas.total_siswa)} siswa </span><div class="flex-1" data-v-c250100e${_scopeId}></div>`);
                if (allCatatan.value.length) {
                  _push2(`<button class="sm:inline-flex hidden items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all" data-v-c250100e${_scopeId}> 📝 Catatan (${ssrInterpolate(allCatatan.value.length)}) <span data-v-c250100e${_scopeId}>${ssrInterpolate(showCatatan.value ? "▲" : "▼")}</span></button>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" data-v-c250100e${_scopeId}><!--[-->`);
                ssrRenderList(summaryCards.value, (card) => {
                  _push2(`<div class="${ssrRenderClass(["rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-default", card.color, card.ring])}" data-v-c250100e${_scopeId}><div class="text-lg mb-1.5" data-v-c250100e${_scopeId}>${ssrInterpolate(card.icon)}</div><div class="${ssrRenderClass(["text-2xl font-extrabold leading-none font-mono", card.val])}" data-v-c250100e${_scopeId}>${ssrInterpolate(card.value)}</div><div class="text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide" data-v-c250100e${_scopeId}>${ssrInterpolate(card.label)}</div></div>`);
                });
                _push2(`<!--]--></div><div class="w-full sm:hidden flex justify-end" data-v-c250100e${_scopeId}>`);
                if (allCatatan.value.length) {
                  _push2(`<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all" data-v-c250100e${_scopeId}> 📝 Catatan (${ssrInterpolate(allCatatan.value.length)}) <span data-v-c250100e${_scopeId}>${ssrInterpolate(showCatatan.value ? "▲" : "▼")}</span></button>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (showCatatan.value && allCatatan.value.length) {
                  _push2(`<div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden" data-v-c250100e${_scopeId}><div class="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 flex items-center gap-1.5" data-v-c250100e${_scopeId}> 📝 Daftar Keterangan Absensi </div><div class="divide-y divide-slate-100 dark:divide-slate-700/50" data-v-c250100e${_scopeId}><!--[-->`);
                  ssrRenderList(allCatatan.value, (c, i) => {
                    _push2(`<div class="flex items-start gap-3 px-5 py-3 flex-wrap" data-v-c250100e${_scopeId}><span class="${ssrRenderClass(["inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] font-extrabold flex-shrink-0", STATUS[c.status]?.bg, STATUS[c.status]?.text])}" data-v-c250100e${_scopeId}>${ssrInterpolate(STATUS[c.status]?.short)}</span><div class="flex flex-col mt-0.5 min-w-0" data-v-c250100e${_scopeId}><span class="text-sm font-semibold text-slate-800 dark:text-white" data-v-c250100e${_scopeId}>${ssrInterpolate(c.nama)}</span></div><span class="text-xs dark:text-slate-400 text-slate-700 font-mono self-center whitespace-nowrap" data-v-c250100e${_scopeId}>Tanggal ${ssrInterpolate(formatTanggal(c.tanggal))}</span><span class="text-sm sm:pl-0 pl-10 text-slate-600 dark:text-slate-300 flex-1 min-w-[180px] self-center" data-v-c250100e${_scopeId}>${ssrInterpolate(c.keterangan)}</span></div>`);
                  });
                  _push2(`<!--]--></div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="flex items-center justify-between gap-3 flex-wrap" data-v-c250100e${_scopeId}><div class="group relative flex items-center min-w-[240px] max-w-sm w-full overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/70 backdrop-blur px-4 py-2.5 shadow-sm" data-v-c250100e${_scopeId}><div class="absolute inset-0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-500/5 via-sky-500/5 to-transparent" data-v-c250100e${_scopeId}></div><div class="relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" data-v-c250100e${_scopeId}> 🔍</div><input${ssrRenderAttr("value", search.value)} type="search" placeholder="Cari nama siswa atau NIS..." class="relative flex-1 bg-transparent px-3 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-0 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus:ring-transparent focus:shadow-none" data-v-c250100e${_scopeId}>`);
                if (search.value) {
                  _push2(`<button class="relative flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200" data-v-c250100e${_scopeId}>✕</button>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="hidden sm:flex items-center gap-2 flex-wrap" data-v-c250100e${_scopeId}><!--[-->`);
                ssrRenderList(STATUS, (cfg, key) => {
                  _push2(`<span class="${ssrRenderClass(["inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold", cfg.bg, cfg.text, cfg.ring.replace("ring-1", "border")])}" data-v-c250100e${_scopeId}>${ssrInterpolate(cfg.short)} = ${ssrInterpolate(cfg.label)}</span>`);
                });
                _push2(`<!--]--><span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800" data-v-c250100e${_scopeId}> 💬 Ada catatan </span></div></div><div class="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/70" tabindex="0" data-v-c250100e${_scopeId}><table class="border-collapse w-max min-w-full text-[13px]" data-v-c250100e${_scopeId}><thead data-v-c250100e${_scopeId}><tr data-v-c250100e${_scopeId}><th class="md:sticky md:left-0 md:z-20 px-3 py-3 bg-slate-900 dark:bg-slate-950 text-white/70 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 min-w-[40px]" data-v-c250100e${_scopeId}> #</th><th class="md:sticky md:left-10 md:z-20 px-3 py-3 bg-slate-900 dark:bg-slate-950 text-white/70 text-[11px] font-bold text-left whitespace-nowrap border-r border-white/5 min-w-[160px] w-52" data-v-c250100e${_scopeId}> Nama Siswa</th><th class="md:sticky md:left-[248px] md:z-20 px-3 py-3 bg-slate-900 dark:bg-slate-950 text-white/70 text-[11px] font-bold text-center whitespace-nowrap border-r-2 border-white/10 w-20 min-w-[80px] font-mono" data-v-c250100e${_scopeId}> NIS</th><th class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-emerald-950 text-emerald-400" data-v-c250100e${_scopeId}> H</th><th class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-orange-950 text-orange-400" data-v-c250100e${_scopeId}> S</th><th class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-sky-950 text-sky-400" data-v-c250100e${_scopeId}> I</th><th class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-rose-950 text-rose-400" data-v-c250100e${_scopeId}> A</th><th class="px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-16 bg-slate-900 dark:bg-slate-950 text-white/70" data-v-c250100e${_scopeId}> %</th><!--[-->`);
                ssrRenderList(__props.hariEfektif, (tgl) => {
                  _push2(`<th class="${ssrRenderClass(["px-1 py-2 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-[72px] min-w-[64px]", isWeekend(tgl) ? "bg-indigo-950 text-indigo-300/80" : "bg-slate-900 dark:bg-slate-950 text-white/60"])}" data-v-c250100e${_scopeId}><div class="flex flex-col items-center gap-0.5" data-v-c250100e${_scopeId}><span class="text-[9px] opacity-60" data-v-c250100e${_scopeId}>${ssrInterpolate(getDayShort(tgl))}</span><span class="text-[10px] font-bold" data-v-c250100e${_scopeId}>${ssrInterpolate(formatTanggal(tgl))}</span></div></th>`);
                });
                _push2(`<!--]--></tr></thead><tbody data-v-c250100e${_scopeId}>`);
                if (!siswaFiltered.value.length) {
                  _push2(`<tr data-v-c250100e${_scopeId}><td${ssrRenderAttr("colspan", 8 + __props.hariEfektif.length)} class="px-4 py-14 text-center text-slate-400 dark:text-slate-500" data-v-c250100e${_scopeId}><div class="text-3xl mb-2" data-v-c250100e${_scopeId}>😶</div><p class="text-sm" data-v-c250100e${_scopeId}>Tidak ada siswa yang cocok</p></td></tr>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--[-->`);
                ssrRenderList(siswaFiltered.value, (s, idx) => {
                  _push2(`<tr class="group border-b border-slate-100 dark:border-slate-700/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors" data-v-c250100e${_scopeId}><td class="md:sticky md:left-0 md:z-10 px-3 py-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 font-mono bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/50" data-v-c250100e${_scopeId}>${ssrInterpolate(idx + 1)}</td><td class="md:sticky md:left-10 md:z-10 px-3 py-2.5 text-left font-medium text-slate-800 dark:text-white bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/50 whitespace-nowrap" data-v-c250100e${_scopeId}>${ssrInterpolate(s.nama_lengkap)}</td><td class="md:sticky md:left-[248px] md:z-10 px-3 py-2.5 text-center text-[12px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 border-r-2 border-slate-200 dark:border-slate-600 whitespace-nowrap" data-v-c250100e${_scopeId}>${ssrInterpolate(s.nis)}</td><td class="px-2 py-2.5 text-center font-bold font-mono text-[13px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-900/10 border-r border-slate-100 dark:border-slate-700/50" data-v-c250100e${_scopeId}>${ssrInterpolate(s.counts.hadir)}</td><td class="px-2 py-2.5 text-center font-bold font-mono text-[13px] text-orange-700 dark:text-orange-300 bg-orange-50/60 dark:bg-orange-900/10 border-r border-slate-100 dark:border-slate-700/50" data-v-c250100e${_scopeId}>${ssrInterpolate(s.counts.sakit)}</td><td class="px-2 py-2.5 text-center font-bold font-mono text-[13px] text-sky-700 dark:text-sky-300 bg-sky-50/60 dark:bg-sky-900/10 border-r border-slate-100 dark:border-slate-700/50" data-v-c250100e${_scopeId}>${ssrInterpolate(s.counts.izin)}</td><td class="px-2 py-2.5 text-center font-bold font-mono text-[13px] text-rose-700 dark:text-rose-300 bg-rose-50/60 dark:bg-rose-900/10 border-r border-slate-100 dark:border-slate-700/50" data-v-c250100e${_scopeId}>${ssrInterpolate(s.counts.alpha)}</td><td class="px-2 py-2.5 text-center border-r border-slate-100 dark:border-slate-700/50" data-v-c250100e${_scopeId}><span class="${ssrRenderClass(["inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-bold font-mono", pctClass(s.pct_kehadiran)])}" data-v-c250100e${_scopeId}>${ssrInterpolate(s.pct_kehadiran !== null && s.pct_kehadiran !== void 0 ? s.pct_kehadiran + "%" : "—")}</span></td><!--[-->`);
                  ssrRenderList(__props.hariEfektif, (tgl) => {
                    _push2(`<td class="${ssrRenderClass(["px-1 py-1.5 text-center border-r border-slate-100 dark:border-slate-700/50", isWeekend(tgl) ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""])}" data-v-c250100e${_scopeId}>`);
                    if (getDetail(s, tgl)) {
                      _push2(`<div class="${ssrRenderClass([{ "cursor-help": !!getDetail(s, tgl).keterangan }, "flex flex-col items-center gap-0.5 cursor-default"])}" data-v-c250100e${_scopeId}><span class="${ssrRenderClass(["inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-extrabold hover:scale-110 transition-transform", STATUS[getDetail(s, tgl).status]?.bg, STATUS[getDetail(s, tgl).status]?.text])}" data-v-c250100e${_scopeId}>${ssrInterpolate(STATUS[getDetail(s, tgl).status]?.short)}</span>`);
                      if (getDetail(s, tgl).keterangan) {
                        _push2(`<span class="text-[9px] text-indigo-400 dark:text-indigo-500" data-v-c250100e${_scopeId}>💬</span>`);
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(`</div>`);
                    } else {
                      _push2(`<span class="inline-flex items-center justify-center w-7 h-7 text-xs text-slate-300 dark:text-slate-600" data-v-c250100e${_scopeId}>—</span>`);
                    }
                    _push2(`</td>`);
                  });
                  _push2(`<!--]--></tr>`);
                });
                _push2(`<!--]--></tbody></table></div><p class="text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1 sm:hidden" data-v-c250100e${_scopeId}> ↔ Geser untuk melihat semua hari </p><!--]-->`);
              } else if (__props.dataLoaded) {
                _push2(`<div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-16 text-center" data-v-c250100e${_scopeId}><div class="text-5xl mb-4" data-v-c250100e${_scopeId}>📭</div><p class="font-semibold text-slate-700 dark:text-slate-200" data-v-c250100e${_scopeId}>Belum ada data absensi</p><p class="mt-1.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto" data-v-c250100e${_scopeId}> Pilih periode lain atau pastikan absensi sudah diinput terlebih dahulu. </p></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            }
            _push2(`</main></div>`);
          } else {
            return [
              (openBlock(), createBlock(Teleport, { to: "body" }, [
                tooltip.value.visible ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed z-[9999] pointer-events-none max-w-[240px] px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-950 text-white text-xs leading-snug shadow-xl",
                  style: { top: tooltip.value.y + "px", left: tooltip.value.x + "px" }
                }, toDisplayString(tooltip.value.text), 5)) : createCommentVNode("", true)
              ])),
              createVNode("div", { class: "min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100" }, [
                createVNode("header", null, [
                  createVNode("div", { class: "mx-auto py-4 px-2 flex items-center justify-between gap-4" }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg flex-shrink-0" }, " 📋 "),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm font-bold dark:text-gray-200 text-gray-700 leading-tight" }, "Rekap Absensi "),
                        createVNode("div", { class: "text-xs text-slate-400 mt-0.5" }, toDisplayString(__props.guru.nama_lengkap), 1)
                      ])
                    ]),
                    hasData.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-2"
                    }, [
                      createVNode(_sfc_main$2, {
                        kelas: __props.kelas,
                        label: __props.label,
                        "hari-efektif": __props.hariEfektif,
                        siswa: __props.siswa,
                        "rekap-kelas": __props.rekapKelas,
                        "avg-kehadiran": avgKehadiran.value,
                        "all-catatan": allCatatan.value
                      }, null, 8, ["kelas", "label", "hari-efektif", "siswa", "rekap-kelas", "avg-kehadiran", "all-catatan"]),
                      createVNode(_sfc_main$1, {
                        kelas: __props.kelas,
                        label: __props.label,
                        "hari-efektif": __props.hariEfektif,
                        siswa: __props.siswa,
                        "rekap-kelas": __props.rekapKelas,
                        "avg-kehadiran": avgKehadiran.value,
                        "all-catatan": allCatatan.value
                      }, null, 8, ["kelas", "label", "hari-efektif", "siswa", "rekap-kelas", "avg-kehadiran", "all-catatan"])
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("main", { class: "mx-auto space-y-5" }, [
                  !__props.kelas ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode("div", { class: "text-center py-4" }, [
                      createVNode("span", { class: "inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-widest mb-3" }, " Langkah 1 "),
                      createVNode("h2", { class: "text-2xl font-extrabold text-slate-800 dark:text-white" }, "Pilih kelasnya dulu yuk!"),
                      createVNode("p", { class: "mt-1.5 text-sm text-slate-500 dark:text-slate-400" }, "Sekarang, semua guru dapat merekap data absensi siswa dari kelas manapun dengan mudah.")
                    ]),
                    createVNode("div", { class: "max-w-md mx-auto" }, [
                      createVNode("div", { class: "flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 transition-colors" }, [
                        createVNode("span", { class: "text-slate-400 text-sm" }, "🔍"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => kelasSearch.value = $event,
                          type: "search",
                          placeholder: "Cari kelas atau wali kelas…",
                          class: "flex-1 bg-transparent outline-none text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-white"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, kelasSearch.value]
                        ])
                      ])
                    ]),
                    kelasFiltered.value.length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(kelasFiltered.value, (k) => {
                        return openBlock(), createBlock("button", {
                          key: k.id,
                          onClick: ($event) => selectKelas(k.id),
                          class: "group flex items-center gap-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl flex-shrink-0" }, " 🏫"),
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("div", { class: "font-bold text-slate-800 dark:text-white text-sm" }, toDisplayString(k.kelas), 1),
                            createVNode("div", { class: "mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400" }, [
                              createVNode("span", null, "👤 " + toDisplayString(k.guru_nama), 1),
                              createVNode("span", null, "🎓 " + toDisplayString(k.jumlah_siswa) + " siswa", 1)
                            ])
                          ]),
                          createVNode("span", { class: "text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all text-sm" }, "›")
                        ], 8, ["onClick"]);
                      }), 128))
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-center py-16 text-slate-400 dark:text-slate-500"
                    }, [
                      createVNode("div", { class: "text-4xl mb-3" }, "😶"),
                      createVNode("p", { class: "text-sm" }, "Tidak ada kelas yang cocok dengan pencarian")
                    ]))
                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("div", { class: "flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3" }, [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode("div", { class: "w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg flex-shrink-0" }, " 🏫"),
                        createVNode("div", null, [
                          createVNode("div", { class: "font-bold text-slate-800 dark:text-white text-sm" }, toDisplayString(__props.kelas.kelas), 1),
                          createVNode("div", { class: "text-xs text-slate-500 dark:text-slate-400 mt-0.5" }, "Wali Kelas: " + toDisplayString(__props.kelas.guru_nama), 1)
                        ])
                      ]),
                      createVNode("button", {
                        onClick: changeKelas,
                        class: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                      }, " 🔄 Ganti Kelas ")
                    ]),
                    createVNode("div", { class: "bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4" }, [
                      createVNode("p", { class: "text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5" }, " 🔽 Filter Periode "),
                      createVNode("div", { class: "flex gap-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl p-1 w-fit" }, [
                        createVNode("button", {
                          class: ["flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all", filterMode.value === "bulan" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"],
                          onClick: ($event) => {
                            filterMode.value = "bulan";
                            filterError.value = "";
                          }
                        }, " 📆 Per Bulan ", 10, ["onClick"]),
                        createVNode("button", {
                          class: ["flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all", filterMode.value === "rentang" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"],
                          onClick: ($event) => {
                            filterMode.value = "rentang";
                            filterError.value = "";
                          }
                        }, " 📅 Rentang Tanggal ", 10, ["onClick"])
                      ]),
                      createVNode("div", { class: "flex flex-wrap items-end gap-3" }, [
                        filterMode.value === "bulan" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createVNode("div", { class: "flex flex-col gap-1" }, [
                            createVNode("label", { class: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500" }, "Bulan"),
                            withDirectives(createVNode("select", {
                              "onUpdate:modelValue": ($event) => selectedBulan.value = $event,
                              class: "px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 min-w-[150px] transition"
                            }, [
                              (openBlock(), createBlock(Fragment, null, renderList(BULAN_NAMES, (nama, idx) => {
                                return createVNode("option", {
                                  key: idx,
                                  value: idx + 1
                                }, toDisplayString(nama), 9, ["value"]);
                              }), 64))
                            ], 8, ["onUpdate:modelValue"]), [
                              [vModelSelect, selectedBulan.value]
                            ])
                          ]),
                          createVNode("div", { class: "flex flex-col gap-1" }, [
                            createVNode("label", { class: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500" }, "Tahun"),
                            withDirectives(createVNode("select", {
                              "onUpdate:modelValue": ($event) => selectedTahun.value = $event,
                              class: "px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 min-w-[110px] transition"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(tahunOptions.value, (y) => {
                                return openBlock(), createBlock("option", {
                                  key: y,
                                  value: y
                                }, toDisplayString(y), 9, ["value"]);
                              }), 128))
                            ], 8, ["onUpdate:modelValue"]), [
                              [vModelSelect, selectedTahun.value]
                            ])
                          ])
                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createVNode("div", { class: "flex flex-col gap-1" }, [
                            createVNode("label", { class: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500" }, "Dari Tanggal"),
                            createVNode("div", { class: "relative" }, [
                              withDirectives(createVNode("input", {
                                type: "date",
                                "onUpdate:modelValue": ($event) => tanggalMulai.value = $event,
                                max: tanggalSampai.value || void 0,
                                class: "date-input w-full pr-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-gray-700 dark:text-gray-200"
                              }, null, 8, ["onUpdate:modelValue", "max"]), [
                                [vModelText, tanggalMulai.value]
                              ]),
                              createVNode(unref(CalendarDaysIcon), { class: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" })
                            ])
                          ]),
                          createVNode("div", { class: "flex flex-col gap-1" }, [
                            createVNode("label", { class: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500" }, "Sampai Tanggal"),
                            createVNode("div", { class: "relative" }, [
                              withDirectives(createVNode("input", {
                                type: "date",
                                "onUpdate:modelValue": ($event) => tanggalSampai.value = $event,
                                min: tanggalMulai.value || void 0,
                                max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
                                class: "date-input w-full pr-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-gray-700 dark:text-gray-200"
                              }, null, 8, ["onUpdate:modelValue", "min", "max"]), [
                                [vModelText, tanggalSampai.value]
                              ]),
                              createVNode(unref(CalendarDaysIcon), { class: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" })
                            ])
                          ])
                        ], 64)),
                        filterError.value ? (openBlock(), createBlock("p", {
                          key: 2,
                          class: "text-xs text-rose-500 flex items-center gap-1 pb-1.5"
                        }, "⚠️ " + toDisplayString(filterError.value), 1)) : createCommentVNode("", true),
                        createVNode("button", {
                          onClick: applyFilter,
                          disabled: loading.value,
                          class: "inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        }, [
                          loading.value ? (openBlock(), createBlock("svg", {
                            key: 0,
                            class: "animate-spin h-4 w-4",
                            fill: "none",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("circle", {
                              class: "opacity-25",
                              cx: "12",
                              cy: "12",
                              r: "10",
                              stroke: "currentColor",
                              "stroke-width": "4"
                            }),
                            createVNode("path", {
                              class: "opacity-75",
                              fill: "currentColor",
                              d: "M4 12a8 8 0 018-8v8z"
                            })
                          ])) : (openBlock(), createBlock("span", { key: 1 }, "🔍")),
                          createTextVNode(" " + toDisplayString(loading.value ? "Memuat…" : "Tampilkan"), 1)
                        ], 8, ["disabled"])
                      ])
                    ]),
                    !__props.dataLoaded && !hasData.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-16 text-center"
                    }, [
                      createVNode("div", { class: "text-5xl mb-4" }, "📊"),
                      createVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Belum ada data ditampilkan"),
                      createVNode("p", { class: "mt-1.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto" }, [
                        createTextVNode(" Pilih periode (bulan atau rentang tanggal), lalu klik "),
                        createVNode("strong", null, "Tampilkan"),
                        createTextVNode(". ")
                      ])
                    ])) : createCommentVNode("", true),
                    hasData.value ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode("div", { class: "flex items-center flex-wrap gap-3" }, [
                        createVNode("span", { class: "inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-950 text-sky-300 px-4 py-1.5 rounded-full text-xs font-bold" }, " 📅 " + toDisplayString(__props.label), 1),
                        createVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, toDisplayString(__props.rekapKelas.hari_efektif) + " hari efektif · " + toDisplayString(__props.rekapKelas.total_siswa) + " siswa ", 1),
                        createVNode("div", { class: "flex-1" }),
                        allCatatan.value.length ? (openBlock(), createBlock("button", {
                          key: 0,
                          onClick: ($event) => showCatatan.value = !showCatatan.value,
                          class: "sm:inline-flex hidden items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                        }, [
                          createTextVNode(" 📝 Catatan (" + toDisplayString(allCatatan.value.length) + ") ", 1),
                          createVNode("span", null, toDisplayString(showCatatan.value ? "▲" : "▼"), 1)
                        ], 8, ["onClick"])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(summaryCards.value, (card) => {
                          return openBlock(), createBlock("div", {
                            key: card.label,
                            class: ["rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-default", card.color, card.ring]
                          }, [
                            createVNode("div", { class: "text-lg mb-1.5" }, toDisplayString(card.icon), 1),
                            createVNode("div", {
                              class: ["text-2xl font-extrabold leading-none font-mono", card.val]
                            }, toDisplayString(card.value), 3),
                            createVNode("div", { class: "text-[10px] font-semibold mt-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide" }, toDisplayString(card.label), 1)
                          ], 2);
                        }), 128))
                      ]),
                      createVNode("div", { class: "w-full sm:hidden flex justify-end" }, [
                        allCatatan.value.length ? (openBlock(), createBlock("button", {
                          key: 0,
                          onClick: ($event) => showCatatan.value = !showCatatan.value,
                          class: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
                        }, [
                          createTextVNode(" 📝 Catatan (" + toDisplayString(allCatatan.value.length) + ") ", 1),
                          createVNode("span", null, toDisplayString(showCatatan.value ? "▲" : "▼"), 1)
                        ], 8, ["onClick"])) : createCommentVNode("", true)
                      ]),
                      showCatatan.value && allCatatan.value.length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
                      }, [
                        createVNode("div", { class: "px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 flex items-center gap-1.5" }, " 📝 Daftar Keterangan Absensi "),
                        createVNode("div", { class: "divide-y divide-slate-100 dark:divide-slate-700/50" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(allCatatan.value, (c, i) => {
                            return openBlock(), createBlock("div", {
                              key: i,
                              class: "flex items-start gap-3 px-5 py-3 flex-wrap"
                            }, [
                              createVNode("span", {
                                class: ["inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] font-extrabold flex-shrink-0", STATUS[c.status]?.bg, STATUS[c.status]?.text]
                              }, toDisplayString(STATUS[c.status]?.short), 3),
                              createVNode("div", { class: "flex flex-col mt-0.5 min-w-0" }, [
                                createVNode("span", { class: "text-sm font-semibold text-slate-800 dark:text-white" }, toDisplayString(c.nama), 1)
                              ]),
                              createVNode("span", { class: "text-xs dark:text-slate-400 text-slate-700 font-mono self-center whitespace-nowrap" }, "Tanggal " + toDisplayString(formatTanggal(c.tanggal)), 1),
                              createVNode("span", { class: "text-sm sm:pl-0 pl-10 text-slate-600 dark:text-slate-300 flex-1 min-w-[180px] self-center" }, toDisplayString(c.keterangan), 1)
                            ]);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "flex items-center justify-between gap-3 flex-wrap" }, [
                        createVNode("div", { class: "group relative flex items-center min-w-[240px] max-w-sm w-full overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/70 backdrop-blur px-4 py-2.5 shadow-sm" }, [
                          createVNode("div", { class: "absolute inset-0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-500/5 via-sky-500/5 to-transparent" }),
                          createVNode("div", { class: "relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" }, " 🔍"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => search.value = $event,
                            type: "search",
                            placeholder: "Cari nama siswa atau NIS...",
                            class: "relative flex-1 bg-transparent px-3 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-0 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus:ring-transparent focus:shadow-none"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, search.value]
                          ]),
                          search.value ? (openBlock(), createBlock("button", {
                            key: 0,
                            onClick: ($event) => search.value = "",
                            class: "relative flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200"
                          }, "✕", 8, ["onClick"])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "hidden sm:flex items-center gap-2 flex-wrap" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(STATUS, (cfg, key) => {
                            return createVNode("span", {
                              key,
                              class: ["inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold", cfg.bg, cfg.text, cfg.ring.replace("ring-1", "border")]
                            }, toDisplayString(cfg.short) + " = " + toDisplayString(cfg.label), 3);
                          }), 64)),
                          createVNode("span", { class: "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800" }, " 💬 Ada catatan ")
                        ])
                      ]),
                      createVNode("div", {
                        class: "w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/70",
                        tabindex: "0"
                      }, [
                        createVNode("table", { class: "border-collapse w-max min-w-full text-[13px]" }, [
                          createVNode("thead", null, [
                            createVNode("tr", null, [
                              createVNode("th", { class: "md:sticky md:left-0 md:z-20 px-3 py-3 bg-slate-900 dark:bg-slate-950 text-white/70 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 min-w-[40px]" }, " #"),
                              createVNode("th", { class: "md:sticky md:left-10 md:z-20 px-3 py-3 bg-slate-900 dark:bg-slate-950 text-white/70 text-[11px] font-bold text-left whitespace-nowrap border-r border-white/5 min-w-[160px] w-52" }, " Nama Siswa"),
                              createVNode("th", { class: "md:sticky md:left-[248px] md:z-20 px-3 py-3 bg-slate-900 dark:bg-slate-950 text-white/70 text-[11px] font-bold text-center whitespace-nowrap border-r-2 border-white/10 w-20 min-w-[80px] font-mono" }, " NIS"),
                              createVNode("th", { class: "px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-emerald-950 text-emerald-400" }, " H"),
                              createVNode("th", { class: "px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-orange-950 text-orange-400" }, " S"),
                              createVNode("th", { class: "px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-sky-950 text-sky-400" }, " I"),
                              createVNode("th", { class: "px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-10 bg-rose-950 text-rose-400" }, " A"),
                              createVNode("th", { class: "px-2 py-3 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-16 bg-slate-900 dark:bg-slate-950 text-white/70" }, " %"),
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.hariEfektif, (tgl) => {
                                return openBlock(), createBlock("th", {
                                  key: "hd-" + tgl,
                                  class: ["px-1 py-2 text-[11px] font-bold text-center whitespace-nowrap border-r border-white/5 w-[72px] min-w-[64px]", isWeekend(tgl) ? "bg-indigo-950 text-indigo-300/80" : "bg-slate-900 dark:bg-slate-950 text-white/60"]
                                }, [
                                  createVNode("div", { class: "flex flex-col items-center gap-0.5" }, [
                                    createVNode("span", { class: "text-[9px] opacity-60" }, toDisplayString(getDayShort(tgl)), 1),
                                    createVNode("span", { class: "text-[10px] font-bold" }, toDisplayString(formatTanggal(tgl)), 1)
                                  ])
                                ], 2);
                              }), 128))
                            ])
                          ]),
                          createVNode("tbody", null, [
                            !siswaFiltered.value.length ? (openBlock(), createBlock("tr", { key: 0 }, [
                              createVNode("td", {
                                colspan: 8 + __props.hariEfektif.length,
                                class: "px-4 py-14 text-center text-slate-400 dark:text-slate-500"
                              }, [
                                createVNode("div", { class: "text-3xl mb-2" }, "😶"),
                                createVNode("p", { class: "text-sm" }, "Tidak ada siswa yang cocok")
                              ], 8, ["colspan"])
                            ])) : createCommentVNode("", true),
                            (openBlock(true), createBlock(Fragment, null, renderList(siswaFiltered.value, (s, idx) => {
                              return openBlock(), createBlock("tr", {
                                key: s.siswa_id,
                                class: "group border-b border-slate-100 dark:border-slate-700/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors"
                              }, [
                                createVNode("td", { class: "md:sticky md:left-0 md:z-10 px-3 py-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 font-mono bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/50" }, toDisplayString(idx + 1), 1),
                                createVNode("td", { class: "md:sticky md:left-10 md:z-10 px-3 py-2.5 text-left font-medium text-slate-800 dark:text-white bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/50 whitespace-nowrap" }, toDisplayString(s.nama_lengkap), 1),
                                createVNode("td", { class: "md:sticky md:left-[248px] md:z-10 px-3 py-2.5 text-center text-[12px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 border-r-2 border-slate-200 dark:border-slate-600 whitespace-nowrap" }, toDisplayString(s.nis), 1),
                                createVNode("td", { class: "px-2 py-2.5 text-center font-bold font-mono text-[13px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-900/10 border-r border-slate-100 dark:border-slate-700/50" }, toDisplayString(s.counts.hadir), 1),
                                createVNode("td", { class: "px-2 py-2.5 text-center font-bold font-mono text-[13px] text-orange-700 dark:text-orange-300 bg-orange-50/60 dark:bg-orange-900/10 border-r border-slate-100 dark:border-slate-700/50" }, toDisplayString(s.counts.sakit), 1),
                                createVNode("td", { class: "px-2 py-2.5 text-center font-bold font-mono text-[13px] text-sky-700 dark:text-sky-300 bg-sky-50/60 dark:bg-sky-900/10 border-r border-slate-100 dark:border-slate-700/50" }, toDisplayString(s.counts.izin), 1),
                                createVNode("td", { class: "px-2 py-2.5 text-center font-bold font-mono text-[13px] text-rose-700 dark:text-rose-300 bg-rose-50/60 dark:bg-rose-900/10 border-r border-slate-100 dark:border-slate-700/50" }, toDisplayString(s.counts.alpha), 1),
                                createVNode("td", { class: "px-2 py-2.5 text-center border-r border-slate-100 dark:border-slate-700/50" }, [
                                  createVNode("span", {
                                    class: ["inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-bold font-mono", pctClass(s.pct_kehadiran)]
                                  }, toDisplayString(s.pct_kehadiran !== null && s.pct_kehadiran !== void 0 ? s.pct_kehadiran + "%" : "—"), 3)
                                ]),
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.hariEfektif, (tgl) => {
                                  return openBlock(), createBlock("td", {
                                    key: "c-" + tgl,
                                    class: ["px-1 py-1.5 text-center border-r border-slate-100 dark:border-slate-700/50", isWeekend(tgl) ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""]
                                  }, [
                                    getDetail(s, tgl) ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: ["flex flex-col items-center gap-0.5 cursor-default", { "cursor-help": !!getDetail(s, tgl).keterangan }],
                                      onMouseenter: (e) => showTooltip(e, getDetail(s, tgl).keterangan),
                                      onMouseleave: hideTooltip
                                    }, [
                                      createVNode("span", {
                                        class: ["inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-extrabold hover:scale-110 transition-transform", STATUS[getDetail(s, tgl).status]?.bg, STATUS[getDetail(s, tgl).status]?.text]
                                      }, toDisplayString(STATUS[getDetail(s, tgl).status]?.short), 3),
                                      getDetail(s, tgl).keterangan ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: "text-[9px] text-indigo-400 dark:text-indigo-500"
                                      }, "💬")) : createCommentVNode("", true)
                                    ], 42, ["onMouseenter"])) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "inline-flex items-center justify-center w-7 h-7 text-xs text-slate-300 dark:text-slate-600"
                                    }, "—"))
                                  ], 2);
                                }), 128))
                              ]);
                            }), 128))
                          ])
                        ])
                      ]),
                      createVNode("p", { class: "text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1 sm:hidden" }, " ↔ Geser untuk melihat semua hari ")
                    ], 64)) : __props.dataLoaded ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-16 text-center"
                    }, [
                      createVNode("div", { class: "text-5xl mb-4" }, "📭"),
                      createVNode("p", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Belum ada data absensi"),
                      createVNode("p", { class: "mt-1.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto" }, " Pilih periode lain atau pastikan absensi sudah diinput terlebih dahulu. ")
                    ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Walas/Rekap.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Rekap = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c250100e"]]);
export {
  Rekap as default
};
