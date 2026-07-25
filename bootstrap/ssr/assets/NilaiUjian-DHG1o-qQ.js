import { ref, computed, onMounted, watch, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode, withDirectives, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { ClipboardDocumentCheckIcon, DocumentTextIcon, BookOpenIcon, AcademicCapIcon, XMarkIcon, ArrowPathIcon, InboxIcon, ArrowUpIcon, ArrowDownIcon, ArrowDownTrayIcon, CheckCircleIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { PlayIcon } from "@heroicons/vue/24/solid";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "@inertiajs/vue3";
import "@vueuse/core";
import "sweetalert2";
import "ziggy-js";
const perPage = 50;
const MAX_VISIBLE_PAGES = 7;
const _sfc_main = {
  __name: "NilaiUjian",
  __ssrInlineRender: true,
  setup(__props) {
    const { success, error } = ToastAlert();
    const loading = ref(false);
    const loaded = ref(false);
    const rekap = ref([]);
    const filter = ref({ soal_title: "", mapel_id: "", kelas_id: "" });
    const sort = ref({ by: "nilai", direction: "desc" });
    const listSoal = ref([]);
    const listMapel = ref([]);
    const listKelas = ref([]);
    const currentPage = ref(1);
    const sortOptions = [
      { label: "Nilai", value: "nilai" },
      { label: "Nama", value: "nama" }
    ];
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content ?? "";
    const hasFilter = computed(
      () => !!filter.value.soal_title || !!filter.value.mapel_id || !!filter.value.kelas_id
    );
    const uniqueSoal = computed(() => {
      const seen = /* @__PURE__ */ new Set();
      return listSoal.value.filter((s) => {
        if (seen.has(s.title)) return false;
        seen.add(s.title);
        return true;
      });
    });
    const filteredRekap = computed(
      () => rekap.value.filter((r) => r.status === "Selesai")
    );
    const sortedRekap = computed(() => {
      const data = [...filteredRekap.value];
      const dir = sort.value.direction === "asc" ? 1 : -1;
      if (sort.value.by === "nilai") {
        data.sort((a, b) => dir * ((a.total_nilai ?? 0) - (b.total_nilai ?? 0)));
      } else {
        data.sort(
          (a, b) => dir * (a.nama_lengkap ?? "").localeCompare(b.nama_lengkap ?? "", "id")
        );
      }
      return data;
    });
    const paginatedRekap = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return sortedRekap.value.slice(start, start + perPage);
    });
    const totalPages = computed(() => Math.ceil(sortedRekap.value.length / perPage));
    const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      if (total <= MAX_VISIBLE_PAGES) return Array.from({ length: total }, (_, i) => i + 1);
      const half = Math.floor(MAX_VISIBLE_PAGES / 2);
      let start = Math.max(1, current - half);
      let end = Math.min(total, start + MAX_VISIBLE_PAGES - 1);
      if (end - start < MAX_VISIBLE_PAGES - 1) start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });
    onMounted(async () => {
      try {
        const [soalRes, mapelRes, kelasRes] = await Promise.all([
          fetch("/guru/list-soal"),
          fetch("/guru/list-mapel"),
          fetch("/guru/list-kelas")
        ]);
        if (!soalRes.ok || !mapelRes.ok || !kelasRes.ok) {
          throw new Error("Salah satu request dropdown gagal.");
        }
        const [soalData, mapelData, kelasRaw] = await Promise.all([
          soalRes.json(),
          mapelRes.json(),
          kelasRes.json()
        ]);
        listSoal.value = Array.isArray(soalData) ? soalData : [];
        listMapel.value = Array.isArray(mapelData) ? mapelData : [];
        const kelasArr = Array.isArray(kelasRaw) ? kelasRaw : kelasRaw?.data ?? [];
        listKelas.value = kelasArr.filter((k) => k?.id && k?.kelas?.trim());
      } catch (e) {
        console.error("Dropdown load error:", e);
        error("Gagal memuat data dropdown filter.");
      }
    });
    watch(filter, () => {
      currentPage.value = 1;
    }, { deep: true });
    watch(sortedRekap, () => {
      currentPage.value = 1;
    });
    const generate = async () => {
      if (!hasFilter.value) {
        error("Pilih minimal satu filter sebelum generate rekap.");
        return;
      }
      loading.value = true;
      rekap.value = [];
      loaded.value = false;
      try {
        const res = await fetch("/guru/rekap-filtered", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
            "Accept": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(filter.value)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        rekap.value = Array.isArray(data) ? data : [];
        loaded.value = true;
        success(`Rekap berhasil dimuat — ${filteredRekap.value.length} data ditemukan.`);
      } catch (e) {
        console.error("Generate rekap error:", e);
        error("Terjadi kesalahan saat mengambil data. Coba lagi.");
      } finally {
        loading.value = false;
      }
    };
    const resetFilter = () => {
      filter.value = { soal_title: "", mapel_id: "", kelas_id: "" };
      rekap.value = [];
      loaded.value = false;
    };
    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };
    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };
    const exportExcel = async () => {
      if (!sortedRekap.value.length) return;
      const mapelLabel = filter.value.mapel_id ? listMapel.value.find((m) => m.id === filter.value.mapel_id)?.mapel ?? "Semua" : "Semua";
      const kelasLabel = filter.value.kelas_id ? listKelas.value.find((k) => k.id === filter.value.kelas_id)?.kelas ?? "Semua" : "Semua";
      const wb = new ExcelJS.Workbook();
      const sheet = wb.addWorksheet("Rekap Nilai");
      sheet.columns = [
        { header: "No", key: "no", width: 6 },
        { header: "Nama Siswa", key: "nama", width: 32 },
        { header: "Kelas", key: "kelas", width: 16 },
        { header: "Mata Pelajaran", key: "mapel", width: 26 },
        { header: "Jumlah Soal", key: "total", width: 14 },
        { header: "Soal Dijawab", key: "dijawab", width: 14 },
        { header: "Tidak Dijawab", key: "skip", width: 14 },
        { header: "Benar", key: "benar", width: 10 },
        { header: "Salah", key: "salah", width: 10 },
        { header: "Nilai", key: "nilai", width: 10 }
      ];
      sortedRekap.value.forEach((item, idx) => {
        sheet.addRow({
          no: idx + 1,
          nama: item.nama_lengkap,
          kelas: item.nama_kelas,
          mapel: item.nama_mapel,
          total: item.total_soal,
          dijawab: item.dijawab,
          skip: item.tidak_dijawab,
          benar: item.total_benar,
          salah: item.salah,
          nilai: item.total_nilai
        });
      });
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 22;
      sheet.eachRow({ includeEmpty: false }, (row, rn) => {
        if (rn === 1) return;
        const isEven = rn % 2 === 0;
        row.eachCell((cell, colNumber) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: isEven ? "FFF0F4FF" : "FFFFFFFF" } };
          cell.border = { bottom: { style: "thin", color: { argb: "FFE2E8F0" } } };
          cell.alignment = {
            vertical: "middle",
            horizontal: colNumber === 2 ? "left" : "center"
            // kolom Nama = left
          };
        });
      });
      const buf = await wb.xlsx.writeBuffer();
      saveAs(
        new Blob([buf], { type: "application/octet-stream" }),
        `Rekap_Nilai_${mapelLabel}_${kelasLabel}.xlsx`
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="nilai-page" data-v-a57b791d${_scopeId}><header class="page-header" data-v-a57b791d${_scopeId}><div class="header-left" data-v-a57b791d${_scopeId}><div class="header-icon" data-v-a57b791d${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ClipboardDocumentCheckIcon), { class: "icon" }, null, _parent2, _scopeId));
            _push2(`</div><div data-v-a57b791d${_scopeId}><h1 class="page-title" data-v-a57b791d${_scopeId}>Assessment Summary</h1><p class="page-subtitle" data-v-a57b791d${_scopeId}>Rekap &amp; Evaluasi Hasil Ujian Siswa</p></div></div>`);
            if (loaded.value && sortedRekap.value.length > 0) {
              _push2(`<div class="header-stat" data-v-a57b791d${_scopeId}><span class="stat-num" data-v-a57b791d${_scopeId}>${ssrInterpolate(sortedRekap.value.length)}</span><span class="stat-label" data-v-a57b791d${_scopeId}>Siswa</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</header><section class="filter-panel" data-v-a57b791d${_scopeId}><div class="filter-grid" data-v-a57b791d${_scopeId}><div class="filter-field" data-v-a57b791d${_scopeId}><label class="field-label" data-v-a57b791d${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DocumentTextIcon), { class: "label-icon" }, null, _parent2, _scopeId));
            _push2(` Judul Soal </label><select class="field-select" data-v-a57b791d${_scopeId}><option value="" data-v-a57b791d${ssrIncludeBooleanAttr(Array.isArray(filter.value.soal_title) ? ssrLooseContain(filter.value.soal_title, "") : ssrLooseEqual(filter.value.soal_title, "")) ? " selected" : ""}${_scopeId}>Semua Soal</option><!--[-->`);
            ssrRenderList(uniqueSoal.value, (s) => {
              _push2(`<option${ssrRenderAttr("value", s.title)} data-v-a57b791d${ssrIncludeBooleanAttr(Array.isArray(filter.value.soal_title) ? ssrLooseContain(filter.value.soal_title, s.title) : ssrLooseEqual(filter.value.soal_title, s.title)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(s.title)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="filter-field" data-v-a57b791d${_scopeId}><label class="field-label" data-v-a57b791d${_scopeId}>`);
            _push2(ssrRenderComponent(unref(BookOpenIcon), { class: "label-icon" }, null, _parent2, _scopeId));
            _push2(` Mata Pelajaran </label><select class="field-select" data-v-a57b791d${_scopeId}><option value="" data-v-a57b791d${ssrIncludeBooleanAttr(Array.isArray(filter.value.mapel_id) ? ssrLooseContain(filter.value.mapel_id, "") : ssrLooseEqual(filter.value.mapel_id, "")) ? " selected" : ""}${_scopeId}>Semua Mapel</option><!--[-->`);
            ssrRenderList(listMapel.value, (m) => {
              _push2(`<option${ssrRenderAttr("value", m.id)} data-v-a57b791d${ssrIncludeBooleanAttr(Array.isArray(filter.value.mapel_id) ? ssrLooseContain(filter.value.mapel_id, m.id) : ssrLooseEqual(filter.value.mapel_id, m.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(m.mapel)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="filter-field" data-v-a57b791d${_scopeId}><label class="field-label" data-v-a57b791d${_scopeId}>`);
            _push2(ssrRenderComponent(unref(AcademicCapIcon), { class: "label-icon" }, null, _parent2, _scopeId));
            _push2(` Kelas </label><select class="field-select" data-v-a57b791d${_scopeId}><option value="" data-v-a57b791d${ssrIncludeBooleanAttr(Array.isArray(filter.value.kelas_id) ? ssrLooseContain(filter.value.kelas_id, "") : ssrLooseEqual(filter.value.kelas_id, "")) ? " selected" : ""}${_scopeId}>Semua Kelas</option><!--[-->`);
            ssrRenderList(listKelas.value, (k) => {
              _push2(`<option${ssrRenderAttr("value", k.id)} data-v-a57b791d${ssrIncludeBooleanAttr(Array.isArray(filter.value.kelas_id) ? ssrLooseContain(filter.value.kelas_id, k.id) : ssrLooseEqual(filter.value.kelas_id, k.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k.kelas)}</option>`);
            });
            _push2(`<!--]--></select></div></div><div class="filter-actions" data-v-a57b791d${_scopeId}><button class="btn-reset"${ssrIncludeBooleanAttr(!hasFilter.value) ? " disabled" : ""} data-v-a57b791d${_scopeId}>`);
            _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Reset </button><button class="btn-generate"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-a57b791d${_scopeId}>`);
            if (loading.value) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-4 h-4 animate-spin" }, null, _parent2, _scopeId));
              _push2(` Memuat... <!--]-->`);
            } else {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(unref(PlayIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Generate Rekap <!--]-->`);
            }
            _push2(`</button></div></section>`);
            if (loading.value) {
              _push2(`<div class="state-loading" data-v-a57b791d${_scopeId}><div class="loading-spinner" data-v-a57b791d${_scopeId}></div><p data-v-a57b791d${_scopeId}>Mengambil data rekap nilai…</p></div>`);
            } else if (loaded.value && sortedRekap.value.length === 0) {
              _push2(`<div class="state-empty" data-v-a57b791d${_scopeId}><div class="empty-icon" data-v-a57b791d${_scopeId}>`);
              _push2(ssrRenderComponent(unref(InboxIcon), { class: "w-10 h-10" }, null, _parent2, _scopeId));
              _push2(`</div><h3 data-v-a57b791d${_scopeId}>Tidak Ada Data</h3><p data-v-a57b791d${_scopeId}>Tidak ditemukan rekap nilai sesuai filter yang dipilih.</p></div>`);
            } else if (sortedRekap.value.length > 0) {
              _push2(`<!--[--><div class="toolbar" data-v-a57b791d${_scopeId}><div class="sort-group" data-v-a57b791d${_scopeId}><span class="sort-label" data-v-a57b791d${_scopeId}>Urutkan Berdasarkan:</span><div class="sort-tabs" data-v-a57b791d${_scopeId}><!--[-->`);
              ssrRenderList(sortOptions, (opt) => {
                _push2(`<button class="${ssrRenderClass([{ active: sort.value.by === opt.value }, "sort-tab"])}" data-v-a57b791d${_scopeId}>${ssrInterpolate(opt.label)}</button>`);
              });
              _push2(`<!--]--></div><button class="sort-dir-btn"${ssrRenderAttr("title", sort.value.direction === "asc" ? "Ascending" : "Descending")} data-v-a57b791d${_scopeId}>`);
              if (sort.value.direction === "asc") {
                _push2(ssrRenderComponent(unref(ArrowUpIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(ArrowDownIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              }
              _push2(`</button></div><button class="btn-export" data-v-a57b791d${_scopeId}>`);
              _push2(ssrRenderComponent(unref(ArrowDownTrayIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(`<span class="hidden sm:inline" data-v-a57b791d${_scopeId}>Export Excel</span></button></div><div class="table-wrapper hidden md:block" data-v-a57b791d${_scopeId}><table class="data-table" data-v-a57b791d${_scopeId}><thead data-v-a57b791d${_scopeId}><tr data-v-a57b791d${_scopeId}><th class="col-no" data-v-a57b791d${_scopeId}>No</th><th class="col-text" data-v-a57b791d${_scopeId}>Nama Siswa</th><th class="col-text" data-v-a57b791d${_scopeId}>Unit Kelas</th><th class="col-text" data-v-a57b791d${_scopeId}>Mata Pelajaran</th><th class="col-num" data-v-a57b791d${_scopeId}>Jumlah Soal</th><th class="col-num" data-v-a57b791d${_scopeId}>Jawaban</th><th class="col-num" data-v-a57b791d${_scopeId}>Benar</th><th class="col-num" data-v-a57b791d${_scopeId}>Nilai</th><th class="col-center" data-v-a57b791d${_scopeId}>Status</th></tr></thead><tbody data-v-a57b791d${_scopeId}><!--[-->`);
              ssrRenderList(paginatedRekap.value, (item, i) => {
                _push2(`<tr class="data-row" data-v-a57b791d${_scopeId}><td class="col-no text-muted" data-v-a57b791d${_scopeId}>${ssrInterpolate((currentPage.value - 1) * perPage + i + 1)}</td><td class="col-text cell-name" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.nama_lengkap)}</td><td class="col-text" data-v-a57b791d${_scopeId}><span class="badge badge-kelas" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.nama_kelas)}</span></td><td class="col-text" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.nama_mapel)}</td><td class="col-num" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.total_soal)}</td><td class="col-num" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.dijawab)}</td><td class="col-num" data-v-a57b791d${_scopeId}><span class="num-success" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.total_benar)}</span></td><td class="col-num" data-v-a57b791d${_scopeId}><span class="nilai-badge" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.total_nilai)}</span></td><td class="col-center" data-v-a57b791d${_scopeId}><span class="${ssrRenderClass([item.status === "Selesai" ? "status-done" : "status-pending", "status-badge"])}" data-v-a57b791d${_scopeId}>`);
                if (item.status === "Selesai") {
                  _push2(ssrRenderComponent(unref(CheckCircleIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(ClockIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                }
                _push2(` ${ssrInterpolate(item.status)}</span></td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div><div class="card-list md:hidden" data-v-a57b791d${_scopeId}><!--[-->`);
              ssrRenderList(paginatedRekap.value, (item, i) => {
                _push2(`<div class="nilai-card" data-v-a57b791d${_scopeId}><div class="card-header-row" data-v-a57b791d${_scopeId}><div class="card-rank" data-v-a57b791d${_scopeId}>${ssrInterpolate((currentPage.value - 1) * perPage + i + 1)}</div><div class="card-identity" data-v-a57b791d${_scopeId}><span class="card-name" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.nama_lengkap)}</span><div class="card-meta" data-v-a57b791d${_scopeId}><span class="badge badge-kelas" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.nama_kelas)}</span><span class="badge badge-mapel" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.nama_mapel)}</span></div></div><span class="${ssrRenderClass([item.status === "Selesai" ? "status-done" : "status-pending", "status-badge"])}" data-v-a57b791d${_scopeId}>`);
                if (item.status === "Selesai") {
                  _push2(ssrRenderComponent(unref(CheckCircleIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(ClockIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                }
                _push2(` ${ssrInterpolate(item.status)}</span></div><div class="card-stats" data-v-a57b791d${_scopeId}><div class="stat-item" data-v-a57b791d${_scopeId}><span class="stat-value" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.total_soal)}</span><span class="stat-key" data-v-a57b791d${_scopeId}>Total Soal</span></div><div class="stat-item" data-v-a57b791d${_scopeId}><span class="stat-value" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.dijawab)}</span><span class="stat-key" data-v-a57b791d${_scopeId}>Dijawab</span></div><div class="stat-item" data-v-a57b791d${_scopeId}><span class="stat-value num-success" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.total_benar)}</span><span class="stat-key" data-v-a57b791d${_scopeId}>Benar</span></div><div class="stat-item" data-v-a57b791d${_scopeId}><span class="stat-value num-danger" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.salah)}</span><span class="stat-key" data-v-a57b791d${_scopeId}>Salah</span></div></div><div class="card-nilai-row" data-v-a57b791d${_scopeId}><span class="card-nilai-label" data-v-a57b791d${_scopeId}>Nilai Akhir</span><span class="card-nilai-value" data-v-a57b791d${_scopeId}>${ssrInterpolate(item.total_nilai)}</span></div></div>`);
              });
              _push2(`<!--]--></div>`);
              if (totalPages.value > 1) {
                _push2(`<div class="pagination" data-v-a57b791d${_scopeId}><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="page-btn" data-v-a57b791d${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ChevronLeftIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                _push2(`</button><!--[-->`);
                ssrRenderList(visiblePages.value, (p) => {
                  _push2(`<button class="${ssrRenderClass([{ "page-active": p === currentPage.value }, "page-btn"])}" data-v-a57b791d${_scopeId}>${ssrInterpolate(p)}</button>`);
                });
                _push2(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="page-btn" data-v-a57b791d${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ChevronRightIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                _push2(`</button><span class="page-info" data-v-a57b791d${_scopeId}>${ssrInterpolate(currentPage.value)} / ${ssrInterpolate(totalPages.value)} halaman — ${ssrInterpolate(sortedRekap.value.length)} data </span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "nilai-page" }, [
                createVNode("header", { class: "page-header" }, [
                  createVNode("div", { class: "header-left" }, [
                    createVNode("div", { class: "header-icon" }, [
                      createVNode(unref(ClipboardDocumentCheckIcon), { class: "icon" })
                    ]),
                    createVNode("div", null, [
                      createVNode("h1", { class: "page-title" }, "Assessment Summary"),
                      createVNode("p", { class: "page-subtitle" }, "Rekap & Evaluasi Hasil Ujian Siswa")
                    ])
                  ]),
                  loaded.value && sortedRekap.value.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "header-stat"
                  }, [
                    createVNode("span", { class: "stat-num" }, toDisplayString(sortedRekap.value.length), 1),
                    createVNode("span", { class: "stat-label" }, "Siswa")
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("section", { class: "filter-panel" }, [
                  createVNode("div", { class: "filter-grid" }, [
                    createVNode("div", { class: "filter-field" }, [
                      createVNode("label", { class: "field-label" }, [
                        createVNode(unref(DocumentTextIcon), { class: "label-icon" }),
                        createTextVNode(" Judul Soal ")
                      ]),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => filter.value.soal_title = $event,
                        class: "field-select"
                      }, [
                        createVNode("option", { value: "" }, "Semua Soal"),
                        (openBlock(true), createBlock(Fragment, null, renderList(uniqueSoal.value, (s) => {
                          return openBlock(), createBlock("option", {
                            key: s.id,
                            value: s.title
                          }, toDisplayString(s.title), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, filter.value.soal_title]
                      ])
                    ]),
                    createVNode("div", { class: "filter-field" }, [
                      createVNode("label", { class: "field-label" }, [
                        createVNode(unref(BookOpenIcon), { class: "label-icon" }),
                        createTextVNode(" Mata Pelajaran ")
                      ]),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => filter.value.mapel_id = $event,
                        class: "field-select"
                      }, [
                        createVNode("option", { value: "" }, "Semua Mapel"),
                        (openBlock(true), createBlock(Fragment, null, renderList(listMapel.value, (m) => {
                          return openBlock(), createBlock("option", {
                            key: m.id,
                            value: m.id
                          }, toDisplayString(m.mapel), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, filter.value.mapel_id]
                      ])
                    ]),
                    createVNode("div", { class: "filter-field" }, [
                      createVNode("label", { class: "field-label" }, [
                        createVNode(unref(AcademicCapIcon), { class: "label-icon" }),
                        createTextVNode(" Kelas ")
                      ]),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => filter.value.kelas_id = $event,
                        class: "field-select"
                      }, [
                        createVNode("option", { value: "" }, "Semua Kelas"),
                        (openBlock(true), createBlock(Fragment, null, renderList(listKelas.value, (k) => {
                          return openBlock(), createBlock("option", {
                            key: k.id,
                            value: k.id
                          }, toDisplayString(k.kelas), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, filter.value.kelas_id]
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "filter-actions" }, [
                    createVNode("button", {
                      onClick: resetFilter,
                      class: "btn-reset",
                      disabled: !hasFilter.value
                    }, [
                      createVNode(unref(XMarkIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Reset ")
                    ], 8, ["disabled"]),
                    createVNode("button", {
                      onClick: generate,
                      class: "btn-generate",
                      disabled: loading.value
                    }, [
                      loading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createVNode(unref(ArrowPathIcon), { class: "w-4 h-4 animate-spin" }),
                        createTextVNode(" Memuat... ")
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createVNode(unref(PlayIcon), { class: "w-4 h-4" }),
                        createTextVNode(" Generate Rekap ")
                      ], 64))
                    ], 8, ["disabled"])
                  ])
                ]),
                loading.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "state-loading"
                }, [
                  createVNode("div", { class: "loading-spinner" }),
                  createVNode("p", null, "Mengambil data rekap nilai…")
                ])) : loaded.value && sortedRekap.value.length === 0 ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "state-empty"
                }, [
                  createVNode("div", { class: "empty-icon" }, [
                    createVNode(unref(InboxIcon), { class: "w-10 h-10" })
                  ]),
                  createVNode("h3", null, "Tidak Ada Data"),
                  createVNode("p", null, "Tidak ditemukan rekap nilai sesuai filter yang dipilih.")
                ])) : sortedRekap.value.length > 0 ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                  createVNode("div", { class: "toolbar" }, [
                    createVNode("div", { class: "sort-group" }, [
                      createVNode("span", { class: "sort-label" }, "Urutkan Berdasarkan:"),
                      createVNode("div", { class: "sort-tabs" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(sortOptions, (opt) => {
                          return createVNode("button", {
                            key: opt.value,
                            onClick: ($event) => sort.value.by = opt.value,
                            class: ["sort-tab", { active: sort.value.by === opt.value }]
                          }, toDisplayString(opt.label), 11, ["onClick"]);
                        }), 64))
                      ]),
                      createVNode("button", {
                        onClick: ($event) => sort.value.direction = sort.value.direction === "asc" ? "desc" : "asc",
                        class: "sort-dir-btn",
                        title: sort.value.direction === "asc" ? "Ascending" : "Descending"
                      }, [
                        sort.value.direction === "asc" ? (openBlock(), createBlock(unref(ArrowUpIcon), {
                          key: 0,
                          class: "w-4 h-4"
                        })) : (openBlock(), createBlock(unref(ArrowDownIcon), {
                          key: 1,
                          class: "w-4 h-4"
                        }))
                      ], 8, ["onClick", "title"])
                    ]),
                    createVNode("button", {
                      onClick: exportExcel,
                      class: "btn-export"
                    }, [
                      createVNode(unref(ArrowDownTrayIcon), { class: "w-4 h-4" }),
                      createVNode("span", { class: "hidden sm:inline" }, "Export Excel")
                    ])
                  ]),
                  createVNode("div", { class: "table-wrapper hidden md:block" }, [
                    createVNode("table", { class: "data-table" }, [
                      createVNode("thead", null, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "col-no" }, "No"),
                          createVNode("th", { class: "col-text" }, "Nama Siswa"),
                          createVNode("th", { class: "col-text" }, "Unit Kelas"),
                          createVNode("th", { class: "col-text" }, "Mata Pelajaran"),
                          createVNode("th", { class: "col-num" }, "Jumlah Soal"),
                          createVNode("th", { class: "col-num" }, "Jawaban"),
                          createVNode("th", { class: "col-num" }, "Benar"),
                          createVNode("th", { class: "col-num" }, "Nilai"),
                          createVNode("th", { class: "col-center" }, "Status")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(paginatedRekap.value, (item, i) => {
                          return openBlock(), createBlock("tr", {
                            key: `${item.user_id}-${item.soal_id}`,
                            class: "data-row"
                          }, [
                            createVNode("td", { class: "col-no text-muted" }, toDisplayString((currentPage.value - 1) * perPage + i + 1), 1),
                            createVNode("td", { class: "col-text cell-name" }, toDisplayString(item.nama_lengkap), 1),
                            createVNode("td", { class: "col-text" }, [
                              createVNode("span", { class: "badge badge-kelas" }, toDisplayString(item.nama_kelas), 1)
                            ]),
                            createVNode("td", { class: "col-text" }, toDisplayString(item.nama_mapel), 1),
                            createVNode("td", { class: "col-num" }, toDisplayString(item.total_soal), 1),
                            createVNode("td", { class: "col-num" }, toDisplayString(item.dijawab), 1),
                            createVNode("td", { class: "col-num" }, [
                              createVNode("span", { class: "num-success" }, toDisplayString(item.total_benar), 1)
                            ]),
                            createVNode("td", { class: "col-num" }, [
                              createVNode("span", { class: "nilai-badge" }, toDisplayString(item.total_nilai), 1)
                            ]),
                            createVNode("td", { class: "col-center" }, [
                              createVNode("span", {
                                class: ["status-badge", item.status === "Selesai" ? "status-done" : "status-pending"]
                              }, [
                                item.status === "Selesai" ? (openBlock(), createBlock(unref(CheckCircleIcon), {
                                  key: 0,
                                  class: "w-3.5 h-3.5"
                                })) : (openBlock(), createBlock(unref(ClockIcon), {
                                  key: 1,
                                  class: "w-3.5 h-3.5"
                                })),
                                createTextVNode(" " + toDisplayString(item.status), 1)
                              ], 2)
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "card-list md:hidden" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(paginatedRekap.value, (item, i) => {
                      return openBlock(), createBlock("div", {
                        key: `mob-${item.user_id}-${item.soal_id}`,
                        class: "nilai-card"
                      }, [
                        createVNode("div", { class: "card-header-row" }, [
                          createVNode("div", { class: "card-rank" }, toDisplayString((currentPage.value - 1) * perPage + i + 1), 1),
                          createVNode("div", { class: "card-identity" }, [
                            createVNode("span", { class: "card-name" }, toDisplayString(item.nama_lengkap), 1),
                            createVNode("div", { class: "card-meta" }, [
                              createVNode("span", { class: "badge badge-kelas" }, toDisplayString(item.nama_kelas), 1),
                              createVNode("span", { class: "badge badge-mapel" }, toDisplayString(item.nama_mapel), 1)
                            ])
                          ]),
                          createVNode("span", {
                            class: ["status-badge", item.status === "Selesai" ? "status-done" : "status-pending"]
                          }, [
                            item.status === "Selesai" ? (openBlock(), createBlock(unref(CheckCircleIcon), {
                              key: 0,
                              class: "w-3.5 h-3.5"
                            })) : (openBlock(), createBlock(unref(ClockIcon), {
                              key: 1,
                              class: "w-3.5 h-3.5"
                            })),
                            createTextVNode(" " + toDisplayString(item.status), 1)
                          ], 2)
                        ]),
                        createVNode("div", { class: "card-stats" }, [
                          createVNode("div", { class: "stat-item" }, [
                            createVNode("span", { class: "stat-value" }, toDisplayString(item.total_soal), 1),
                            createVNode("span", { class: "stat-key" }, "Total Soal")
                          ]),
                          createVNode("div", { class: "stat-item" }, [
                            createVNode("span", { class: "stat-value" }, toDisplayString(item.dijawab), 1),
                            createVNode("span", { class: "stat-key" }, "Dijawab")
                          ]),
                          createVNode("div", { class: "stat-item" }, [
                            createVNode("span", { class: "stat-value num-success" }, toDisplayString(item.total_benar), 1),
                            createVNode("span", { class: "stat-key" }, "Benar")
                          ]),
                          createVNode("div", { class: "stat-item" }, [
                            createVNode("span", { class: "stat-value num-danger" }, toDisplayString(item.salah), 1),
                            createVNode("span", { class: "stat-key" }, "Salah")
                          ])
                        ]),
                        createVNode("div", { class: "card-nilai-row" }, [
                          createVNode("span", { class: "card-nilai-label" }, "Nilai Akhir"),
                          createVNode("span", { class: "card-nilai-value" }, toDisplayString(item.total_nilai), 1)
                        ])
                      ]);
                    }), 128))
                  ]),
                  totalPages.value > 1 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "pagination"
                  }, [
                    createVNode("button", {
                      onClick: prevPage,
                      disabled: currentPage.value === 1,
                      class: "page-btn"
                    }, [
                      createVNode(unref(ChevronLeftIcon), { class: "w-4 h-4" })
                    ], 8, ["disabled"]),
                    (openBlock(true), createBlock(Fragment, null, renderList(visiblePages.value, (p) => {
                      return openBlock(), createBlock("button", {
                        key: p,
                        onClick: ($event) => currentPage.value = p,
                        class: ["page-btn", { "page-active": p === currentPage.value }]
                      }, toDisplayString(p), 11, ["onClick"]);
                    }), 128)),
                    createVNode("button", {
                      onClick: nextPage,
                      disabled: currentPage.value === totalPages.value,
                      class: "page-btn"
                    }, [
                      createVNode(unref(ChevronRightIcon), { class: "w-4 h-4" })
                    ], 8, ["disabled"]),
                    createVNode("span", { class: "page-info" }, toDisplayString(currentPage.value) + " / " + toDisplayString(totalPages.value) + " halaman — " + toDisplayString(sortedRekap.value.length) + " data ", 1)
                  ])) : createCommentVNode("", true)
                ], 64)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/NilaiUjian.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const NilaiUjian = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a57b791d"]]);
export {
  NilaiUjian as default
};
