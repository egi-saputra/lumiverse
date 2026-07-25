import { ref, onMounted, onUnmounted, computed, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { usePage, Head } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "AbsensiHarian",
  __ssrInlineRender: true,
  props: {
    sekretaris: { type: Object, required: true },
    daftar_siswa: { type: Array, default: () => [] },
    absensi_hari_ini: { type: Array, default: () => [] },
    sudah_disimpan: { type: Boolean, default: false },
    rekap_bulan: { type: Object, default: () => ({ hadir: 0, sakit: 0, izin: 0, alpha: 0, total_hari_aktif: 0 }) }
  },
  setup(__props) {
    const props = __props;
    const STATUS = {
      hadir: { label: "Hadir", short: "H", icon: "ti-circle-check", bg: "#EAF3DE", text: "#3B6D11", border: "#97C459", ring: "#639922" },
      sakit: { label: "Sakit", short: "S", icon: "ti-heart-rate-monitor", bg: "#FAEEDA", text: "#854F0B", border: "#EF9F27", ring: "#BA7517" },
      izin: { label: "Izin", short: "I", icon: "ti-file-description", bg: "#E6F1FB", text: "#185FA5", border: "#85B7EB", ring: "#378ADD" },
      alpha: { label: "Alpha", short: "A", icon: "ti-circle-x", bg: "#FCEBEB", text: "#A32D2D", border: "#F09595", ring: "#E24B4A" }
    };
    const now = ref(/* @__PURE__ */ new Date());
    const loading = ref(false);
    const showConfirm = ref(false);
    const search = ref("");
    const filterStatus = ref("semua");
    const errors = ref({});
    const absensiMap = ref({});
    const page = usePage();
    const flashMsg = ref(page.props.flash?.success || page.props.flash?.error || null);
    const flashType = ref(page.props.flash?.error ? "error" : "success");
    function initAbsensiMap() {
      const map = {};
      props.daftar_siswa.forEach((s) => {
        const existing = props.absensi_hari_ini.find((a) => a.siswa_id === s.id);
        const status = existing?.status || "hadir";
        map[s.id] = {
          status,
          keterangan: existing?.keterangan || "",
          // showKet: true jika status butuh ket ATAU sudah ada keterangan tersimpan
          showKet: bolehKeterangan(status) || !!existing?.keterangan
        };
      });
      absensiMap.value = map;
    }
    let clockTimer;
    onMounted(() => {
      initAbsensiMap();
      clockTimer = setInterval(() => {
        now.value = /* @__PURE__ */ new Date();
      }, 1e3);
      if (flashMsg.value) setTimeout(() => {
        flashMsg.value = null;
      }, 4500);
    });
    onUnmounted(() => clearInterval(clockTimer));
    const tanggalFormatted = computed(
      () => now.value.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    );
    const jamFormatted = computed(
      () => now.value.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    );
    const daftarFiltered = computed(() => {
      let list = props.daftar_siswa;
      if (search.value.trim()) {
        const q = search.value.toLowerCase();
        list = list.filter((s) => s.nama.toLowerCase().includes(q) || String(s.nis).includes(q));
      }
      if (filterStatus.value !== "semua") {
        list = list.filter((s) => absensiMap.value[s.id]?.status === filterStatus.value);
      }
      return list;
    });
    const summary = computed(() => {
      const counts = { hadir: 0, sakit: 0, izin: 0, alpha: 0 };
      Object.values(absensiMap.value).forEach((a) => {
        if (a.status && counts[a.status] !== void 0) counts[a.status]++;
      });
      return { ...counts, total: props.daftar_siswa.length };
    });
    const persenHadir = computed(() => {
      if (!summary.value.total) return 0;
      return Math.round(summary.value.hadir / summary.value.total * 100);
    });
    const allFilled = computed(
      () => props.daftar_siswa.every((s) => !!absensiMap.value[s.id]?.status)
    );
    function bolehKeterangan(status) {
      return status === "izin" || status === "alpha";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Input Absensi Kelas" }, null, _parent));
      _push(`<div class="page-wrap" data-v-2c5608bc>`);
      if (flashMsg.value) {
        _push(`<div class="${ssrRenderClass([flashType.value, "flash"])}" role="alert" aria-live="polite" data-v-2c5608bc><i class="${ssrRenderClass(flashType.value === "success" ? "ti ti-circle-check" : "ti ti-alert-circle")}" aria-hidden="true" data-v-2c5608bc></i><span data-v-2c5608bc>${ssrInterpolate(flashMsg.value)}</span><button class="flash-x" aria-label="Tutup notifikasi" data-v-2c5608bc><i class="ti ti-x" data-v-2c5608bc></i></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<header class="topbar" data-v-2c5608bc><div class="topbar-inner" data-v-2c5608bc><div class="topbar-left" data-v-2c5608bc><div class="topbar-logo" aria-hidden="true" data-v-2c5608bc><i class="ti ti-clipboard-list" data-v-2c5608bc></i></div><div data-v-2c5608bc><div class="topbar-title" data-v-2c5608bc>Input Absensi</div><div class="topbar-sub" data-v-2c5608bc>${ssrInterpolate(__props.sekretaris.kelas_nama)} · Sekretaris</div></div></div><div class="topbar-clock" data-v-2c5608bc><div class="clock-hms" data-v-2c5608bc>${ssrInterpolate(jamFormatted.value)}</div><div class="clock-date" data-v-2c5608bc>${ssrInterpolate(tanggalFormatted.value)}</div></div></div></header><main class="page-main" data-v-2c5608bc><div class="info-bar" data-v-2c5608bc><div class="info-bar-left" data-v-2c5608bc><div class="avatar-circle" aria-hidden="true" data-v-2c5608bc>${ssrInterpolate(__props.sekretaris.nama.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase())}</div><div data-v-2c5608bc><p class="info-nama" data-v-2c5608bc>${ssrInterpolate(__props.sekretaris.nama)}</p><p class="info-meta" data-v-2c5608bc>NIS ${ssrInterpolate(__props.sekretaris.nis)} · Sekretaris Kelas</p></div></div><div class="info-bar-right" data-v-2c5608bc>`);
      if (__props.sudah_disimpan) {
        _push(`<div class="pill saved-pill" data-v-2c5608bc><i class="ti ti-lock" aria-hidden="true" data-v-2c5608bc></i> Sudah Tersimpan </div>`);
      } else {
        _push(`<div class="pill draft-pill" data-v-2c5608bc><i class="ti ti-pencil" aria-hidden="true" data-v-2c5608bc></i> Draft — Belum Disimpan </div>`);
      }
      _push(`</div></div><div class="summary-strip" data-v-2c5608bc><!--[-->`);
      ssrRenderList(STATUS, (cfg, key) => {
        _push(`<div class="summary-card" style="${ssrRenderStyle({ background: cfg.bg, borderColor: cfg.border })}" data-v-2c5608bc><i class="${ssrRenderClass("ti " + cfg.icon)}" style="${ssrRenderStyle({ color: cfg.ring })}" aria-hidden="true" data-v-2c5608bc></i><span class="sum-val" style="${ssrRenderStyle({ color: cfg.text })}" data-v-2c5608bc>${ssrInterpolate(summary.value[key])}</span><span class="sum-lbl" style="${ssrRenderStyle({ color: cfg.text })}" data-v-2c5608bc>${ssrInterpolate(cfg.label)}</span></div>`);
      });
      _push(`<!--]--></div><div class="progress-row" data-v-2c5608bc><div class="progress-track" data-v-2c5608bc><div class="progress-fill" style="${ssrRenderStyle({ width: persenHadir.value + "%" })}" data-v-2c5608bc></div></div><span class="progress-pct" data-v-2c5608bc>${ssrInterpolate(persenHadir.value)}% hadir hari ini</span></div><div class="flex sm:flex-row flex-col w-full gap-2 justify-between" data-v-2c5608bc><div class="flex sm:flex-row flex-col w-full sm:w-auto gap-3" data-v-2c5608bc><div class="search-box" data-v-2c5608bc><i class="ti ti-search" aria-hidden="true" data-v-2c5608bc></i><input${ssrRenderAttr("value", search.value)} type="search" placeholder="Cari nama atau NIS…" class="search-input" aria-label="Cari siswa" data-v-2c5608bc>`);
      if (search.value) {
        _push(`<button class="search-clear" aria-label="Hapus pencarian" data-v-2c5608bc><i class="ti ti-x" data-v-2c5608bc></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="sm:flex hidden gap-1" role="group" aria-label="Filter status" data-v-2c5608bc><!--[-->`);
      ssrRenderList(["semua", "hadir", "sakit", "izin", "alpha"], (opt) => {
        _push(`<button class="${ssrRenderClass([{ active: filterStatus.value === opt }, "filter-tab"])}"${ssrRenderAttr("aria-pressed", filterStatus.value === opt)} data-v-2c5608bc>${ssrInterpolate(opt === "semua" ? "Semua" : STATUS[opt]?.label)}</button>`);
      });
      _push(`<!--]--></div></div><div class="toolbar-right" data-v-2c5608bc>`);
      if (!__props.sudah_disimpan) {
        _push(`<button class="btn-all-hadir" data-v-2c5608bc><i class="ti ti-checks" aria-hidden="true" data-v-2c5608bc></i> Semua Hadir </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="siswa-list" role="list" data-v-2c5608bc><!--[-->`);
      ssrRenderList(daftarFiltered.value, (siswa) => {
        _push(`<div class="${ssrRenderClass([{ locked: __props.sudah_disimpan, "has-error": errors.value[siswa.id] }, "siswa-row"])}" role="listitem" data-v-2c5608bc><div class="row-main" data-v-2c5608bc><div class="siswa-info" data-v-2c5608bc><span class="siswa-nama" data-v-2c5608bc>${ssrInterpolate(siswa.nama)} `);
        if (siswa.is_sekretaris) {
          _push(`<span class="badge-sek" data-v-2c5608bc>Sekretaris</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span><span class="siswa-nis" data-v-2c5608bc>${ssrInterpolate(siswa.nis)}</span></div><div class="status-btns" role="group"${ssrRenderAttr("aria-label", `Status ${siswa.nama}`)} data-v-2c5608bc><!--[-->`);
        ssrRenderList(STATUS, (cfg, key) => {
          _push(`<button class="${ssrRenderClass([{ active: absensiMap.value[siswa.id]?.status === key }, "status-btn"])}" style="${ssrRenderStyle(absensiMap.value[siswa.id]?.status === key ? { background: cfg.bg, color: cfg.text, borderColor: cfg.ring } : {})}"${ssrIncludeBooleanAttr(__props.sudah_disimpan) ? " disabled" : ""}${ssrRenderAttr("aria-pressed", absensiMap.value[siswa.id]?.status === key)}${ssrRenderAttr("title", cfg.label)} data-v-2c5608bc><span class="btn-short" data-v-2c5608bc>${ssrInterpolate(cfg.short)}</span><span class="btn-label" data-v-2c5608bc>${ssrInterpolate(cfg.label)}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
        if (absensiMap.value[siswa.id]?.showKet) {
          _push(`<div class="row-ket" data-v-2c5608bc><textarea class="ket-input"${ssrRenderAttr("placeholder", `Keterangan ${STATUS[absensiMap.value[siswa.id]?.status]?.label ?? ""} (opsional)…`)} rows="2"${ssrIncludeBooleanAttr(__props.sudah_disimpan) ? " disabled" : ""}${ssrRenderAttr("aria-label", `Keterangan absensi ${siswa.nama}`)} data-v-2c5608bc>${ssrInterpolate(absensiMap.value[siswa.id].keterangan)}</textarea></div>`);
        } else {
          _push(`<!---->`);
        }
        if (errors.value[siswa.id]) {
          _push(`<p class="row-error" role="alert" data-v-2c5608bc>${ssrInterpolate(errors.value[siswa.id])}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      if (!daftarFiltered.value.length) {
        _push(`<div class="empty-state" data-v-2c5608bc><i class="ti ti-mood-empty" aria-hidden="true" data-v-2c5608bc></i><p data-v-2c5608bc>Tidak ada siswa yang cocok dengan filter</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></main>`);
      if (!__props.sudah_disimpan) {
        _push(`<div class="action-footer" data-v-2c5608bc><div class="footer-info" data-v-2c5608bc><span class="footer-count" data-v-2c5608bc>${ssrInterpolate(summary.value.hadir + summary.value.sakit + summary.value.izin + summary.value.alpha)} / ${ssrInterpolate(summary.value.total)} siswa diisi </span><span class="footer-date" data-v-2c5608bc>${ssrInterpolate(tanggalFormatted.value)}</span></div><button class="btn-simpan"${ssrIncludeBooleanAttr(!allFilled.value) ? " disabled" : ""}${ssrRenderAttr("title", !allFilled.value ? "Lengkapi status semua siswa terlebih dahulu" : "Simpan absensi")} data-v-2c5608bc><i class="ti ti-device-floppy" aria-hidden="true" data-v-2c5608bc></i> Simpan Absensi </button></div>`);
      } else {
        _push(`<div class="action-footer action-footer--saved" data-v-2c5608bc><div class="footer-saved" data-v-2c5608bc><i class="ti ti-lock-check" aria-hidden="true" data-v-2c5608bc></i><span data-v-2c5608bc>Absensi hari ini sudah tersimpan dan terkunci</span></div></div>`);
      }
      if (showConfirm.value) {
        _push(`<div class="modal-veil" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-v-2c5608bc><div class="modal-box" data-v-2c5608bc><div class="modal-head" data-v-2c5608bc><div class="modal-icon" data-v-2c5608bc><i class="ti ti-clipboard-check" data-v-2c5608bc></i></div><div data-v-2c5608bc><h3 class="modal-title" id="modal-title" data-v-2c5608bc>Simpan Absensi Kelas</h3><p class="modal-sub" data-v-2c5608bc>${ssrInterpolate(__props.sekretaris.kelas_nama)} · ${ssrInterpolate(tanggalFormatted.value)}</p></div><button class="modal-close-btn"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} aria-label="Tutup" data-v-2c5608bc><i class="ti ti-x" data-v-2c5608bc></i></button></div><div class="modal-body" data-v-2c5608bc><div class="confirm-grid" data-v-2c5608bc><!--[-->`);
        ssrRenderList(STATUS, (cfg, key) => {
          _push(`<div class="confirm-item" style="${ssrRenderStyle({ background: cfg.bg, borderColor: cfg.border })}" data-v-2c5608bc><i class="${ssrRenderClass("ti " + cfg.icon)}" style="${ssrRenderStyle({ color: cfg.ring })}" data-v-2c5608bc></i><span class="ci-val" style="${ssrRenderStyle({ color: cfg.text })}" data-v-2c5608bc>${ssrInterpolate(summary.value[key])}</span><span class="ci-lbl" style="${ssrRenderStyle({ color: cfg.text })}" data-v-2c5608bc>${ssrInterpolate(cfg.label)}</span></div>`);
        });
        _push(`<!--]--></div><p class="confirm-note" data-v-2c5608bc><i class="ti ti-info-circle" data-v-2c5608bc></i> Setelah disimpan, absensi akan <strong data-v-2c5608bc>terkunci</strong> dan tidak bisa diubah kecuali oleh guru atau admin. </p></div><div class="modal-foot" data-v-2c5608bc><button class="btn-cancel"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-2c5608bc>Batal</button><button class="btn-confirm"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-2c5608bc>`);
        if (loading.value) {
          _push(`<i class="ti ti-loader-2 spin" data-v-2c5608bc></i>`);
        } else {
          _push(`<i class="ti ti-check" data-v-2c5608bc></i>`);
        }
        _push(` ${ssrInterpolate(loading.value ? "Menyimpan…" : "Ya, Simpan Sekarang")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/AbsensiHarian.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AbsensiHarian = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2c5608bc"]]);
export {
  AbsensiHarian as default
};
