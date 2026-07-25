import { ref, computed, watch, onMounted, withCtx, unref, createVNode, createTextVNode, toDisplayString, withDirectives, openBlock, createBlock, Fragment, renderList, vModelSelect, vModelText, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { ArrowPathIcon, TrashIcon, BuildingLibraryIcon, BookOpenIcon, FunnelIcon, MagnifyingGlassIcon, XMarkIcon, UserGroupIcon } from "@heroicons/vue/24/outline";
import axios from "axios";
import Swal from "sweetalert2";
import "@inertiajs/vue3";
import "./Sidebar-COsy3wF2.js";
import "ziggy-js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const perPage = 30;
const MAX_PAGES = 7;
const _sfc_main = {
  __name: "RuangUjian",
  __ssrInlineRender: true,
  props: {
    peserta: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const pesertaList = ref([...props.peserta]);
    const filterKelas = ref("");
    const filterMapel = ref("");
    const searchNama = ref("");
    const isLoading = ref(false);
    const loadingIds = ref(/* @__PURE__ */ new Set());
    const filterStatus = ref("");
    const kelasOptions = computed(() => {
      const set = /* @__PURE__ */ new Set();
      pesertaList.value.forEach((p) => p.user?.siswa?.kelas?.kelas && set.add(p.user.siswa.kelas.kelas));
      return [...set].sort();
    });
    const mapelOptions = computed(() => {
      const set = /* @__PURE__ */ new Set();
      pesertaList.value.forEach((p) => p.soal?.mapel?.mapel && set.add(p.soal.mapel.mapel));
      return [...set].sort();
    });
    const currentPage = ref(1);
    const filteredPeserta = computed(() => {
      let data = pesertaList.value;
      if (filterKelas.value) data = data.filter((p) => p.user?.siswa?.kelas?.kelas === filterKelas.value);
      if (filterMapel.value) data = data.filter((p) => p.soal?.mapel?.mapel === filterMapel.value);
      if (filterStatus.value) {
        if (filterStatus.value === "Terkunci") {
          data = data.filter((p) => !p.status || p.status === "Terkunci");
        } else {
          data = data.filter((p) => p.status === filterStatus.value);
        }
      }
      if (searchNama.value) {
        const q = searchNama.value.toLowerCase();
        data = data.filter((p) => p.user?.siswa?.nama_lengkap?.toLowerCase().includes(q));
      }
      return data;
    });
    watch(filteredPeserta, () => {
      currentPage.value = 1;
    });
    const paginatedPeserta = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filteredPeserta.value.slice(start, start + perPage);
    });
    const totalPages = computed(() => Math.ceil(filteredPeserta.value.length / perPage));
    const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      if (total <= MAX_PAGES) return Array.from({ length: total }, (_, i) => i + 1);
      const half = Math.floor(MAX_PAGES / 2);
      let start = Math.max(1, current - half);
      let end = Math.min(total, start + MAX_PAGES - 1);
      if (end - start + 1 < MAX_PAGES) start = Math.max(1, end - MAX_PAGES + 1);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });
    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };
    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };
    const hasActiveFilter = computed(
      () => filterKelas.value || filterMapel.value || filterStatus.value || searchNama.value
    );
    const resetFilter = () => {
      filterKelas.value = "";
      filterMapel.value = "";
      filterStatus.value = "";
      searchNama.value = "";
    };
    const stats = computed(() => ({
      total: pesertaList.value.length,
      selesai: pesertaList.value.filter((p) => p.status === "Selesai").length,
      aktif: pesertaList.value.filter((p) => p.status === "Sedang Dikerjakan").length,
      terkunci: pesertaList.value.filter((p) => !p.status || p.status === "Terkunci").length
    }));
    const toast = (icon, title, text = "") => Swal.fire({
      icon,
      title,
      text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3e3,
      timerProgressBar: true,
      customClass: { popup: "text-sm" }
    });
    const setRowLoading = (id, val) => {
      const next = new Set(loadingIds.value);
      val ? next.add(id) : next.delete(id);
      loadingIds.value = next;
    };
    const copyToken = (token) => {
      navigator.clipboard.writeText(token).then(() => toast("success", "Token disalin!"));
    };
    const reloadPeserta = async () => {
      isLoading.value = true;
      try {
        const { data } = await axios.get("/proktor/ruang-ujian/peserta");
        pesertaList.value = data.peserta;
        toast("success", "Data diperbarui");
      } catch {
        toast("error", "Gagal memuat data", "Periksa koneksi internet Anda.");
      } finally {
        isLoading.value = false;
      }
    };
    const deletePeserta = async (id, nama) => {
      const result = await Swal.fire({
        title: "Hapus Peserta?",
        html: `Peserta <strong>${nama ?? "ini"}</strong> akan dihapus dari ruang ujian.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal"
      });
      if (!result.isConfirmed) return;
      setRowLoading(id, true);
      try {
        await axios.delete(`/proktor/ruang-ujian/peserta/${id}`);
        pesertaList.value = pesertaList.value.filter((p) => p.id !== id);
        toast("success", "Peserta dihapus");
      } catch (e) {
        const msg = e.response?.data?.message ?? "Terjadi kesalahan.";
        toast("error", "Gagal menghapus", msg);
      } finally {
        setRowLoading(id, false);
      }
    };
    const deleteAllPeserta = async () => {
      const kelasAktif = filterKelas.value;
      const label = kelasAktif ? `kelas <strong>${kelasAktif}</strong>` : "semua kelas";
      const jumlah = filteredPeserta.value.length;
      if (jumlah === 0) {
        return toast("info", "Tidak ada data", "Tidak ada peserta yang cocok dengan filter saat ini.");
      }
      const step1 = await Swal.fire({
        title: "Hapus Data Peserta",
        html: `Anda akan menghapus <strong>${jumlah} peserta</strong> dari ${label}.<br><br>
               Pilih data yang ingin dihapus:`,
        icon: "warning",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        denyButtonColor: "#f97316",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "🗑️ Ujian Siswa + Riwayat",
        denyButtonText: "📋 Ujian Siswa Saja",
        cancelButtonText: "Batal",
        reverseButtons: false
      });
      if (step1.isDismissed) return;
      const includeRiwayat = step1.isConfirmed;
      const step2 = await Swal.fire({
        title: "Konfirmasi Akhir",
        html: `Tindakan ini <strong>tidak dapat dibatalkan</strong>.<br>
               ${jumlah} data dari ${label} akan dihapus${includeRiwayat ? " beserta seluruh riwayat ujian" : ""}.`,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Hapus Sekarang",
        cancelButtonText: "Batal",
        input: "text",
        inputPlaceholder: "Ketik HAPUS untuk konfirmasi",
        inputAttributes: { autocomplete: "off" },
        preConfirm: (val) => {
          if (val !== "HAPUS") {
            Swal.showValidationMessage("Ketik tepat: HAPUS");
            return false;
          }
        }
      });
      if (!step2.isConfirmed) return;
      isLoading.value = true;
      try {
        await axios.delete("/proktor/ruang-ujian/peserta/destroy-all", {
          data: {
            kelas: kelasAktif || null,
            include_riwayat: includeRiwayat
          }
        });
        if (kelasAktif) {
          pesertaList.value = pesertaList.value.filter(
            (p) => p.user?.siswa?.kelas?.kelas !== kelasAktif
          );
        } else {
          pesertaList.value = [];
        }
        filterKelas.value = "";
        toast("success", "Data berhasil dihapus", `${jumlah} peserta telah dihapus.`);
      } catch (e) {
        const msg = e.response?.data?.message ?? "Terjadi kesalahan pada server.";
        toast("error", "Gagal menghapus", msg);
      } finally {
        isLoading.value = false;
      }
    };
    onMounted(async () => {
      try {
        const { data } = await axios.get("/proktor/ruang-ujian/peserta");
        pesertaList.value = data.peserta;
      } catch {
        toast("error", "Gagal memuat data awal", "Coba refresh halaman.");
      }
    });
    const statusClass = (status) => {
      if (status === "Selesai") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300";
      if (status === "Sedang Dikerjakan") return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
      return "bg-slate-100 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400";
    };
    const statusDot = (status) => {
      if (status === "Selesai") return "bg-emerald-500";
      if (status === "Sedang Dikerjakan") return "bg-amber-500 animate-pulse";
      return "bg-slate-400";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-6xl w-full px-4 pb-10"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight"${_scopeId}> Exam Room Management </h1><p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5"${_scopeId}> Kelola dan pantau peserta ujian (Klik tombol reload untuk refresh dan menampilkan data terbaru) </p></div><div class="flex gap-2"${_scopeId}><button${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition shadow-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowPathIcon), {
              class: ["w-4 h-4", { "animate-spin": isLoading.value }]
            }, null, _parent2, _scopeId));
            _push2(` Reload </button><button${ssrIncludeBooleanAttr(isLoading.value || filteredPeserta.value.length === 0) ? " disabled" : ""} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white transition shadow-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Hapus ${ssrInterpolate(filterKelas.value ? `Kelas ${filterKelas.value}` : "Semua")}</button></div></div><div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"${_scopeId}><div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm"${_scopeId}><p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide"${_scopeId}>Total</p><p class="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1"${_scopeId}>${ssrInterpolate(stats.value.total)}</p></div><div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm"${_scopeId}><p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide"${_scopeId}> Selesai</p><p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1"${_scopeId}>${ssrInterpolate(stats.value.selesai)}</p></div><div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm"${_scopeId}><p class="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide"${_scopeId}>Aktif</p><p class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1"${_scopeId}>${ssrInterpolate(stats.value.aktif)}</p></div><div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm"${_scopeId}><p class="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide"${_scopeId}>Terkunci </p><p class="text-2xl font-bold text-slate-600 dark:text-slate-300 mt-1"${_scopeId}>${ssrInterpolate(stats.value.terkunci)}</p></div></div><div class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-sm p-4 mb-5"${_scopeId}><div class="flex flex-col sm:flex-row gap-3"${_scopeId}><div class="relative flex-1"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(BuildingLibraryIcon), { class: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }, null, _parent2, _scopeId));
            _push2(`<select class="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(filterKelas.value) ? ssrLooseContain(filterKelas.value, "") : ssrLooseEqual(filterKelas.value, "")) ? " selected" : ""}${_scopeId}>Semua Kelas</option><!--[-->`);
            ssrRenderList(kelasOptions.value, (k) => {
              _push2(`<option${ssrRenderAttr("value", k)}${ssrIncludeBooleanAttr(Array.isArray(filterKelas.value) ? ssrLooseContain(filterKelas.value, k) : ssrLooseEqual(filterKelas.value, k)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="relative flex-1"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(BookOpenIcon), { class: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }, null, _parent2, _scopeId));
            _push2(`<select class="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(filterMapel.value) ? ssrLooseContain(filterMapel.value, "") : ssrLooseEqual(filterMapel.value, "")) ? " selected" : ""}${_scopeId}>Semua Mapel</option><!--[-->`);
            ssrRenderList(mapelOptions.value, (m) => {
              _push2(`<option${ssrRenderAttr("value", m)}${ssrIncludeBooleanAttr(Array.isArray(filterMapel.value) ? ssrLooseContain(filterMapel.value, m) : ssrLooseEqual(filterMapel.value, m)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(m)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="relative flex-1"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(FunnelIcon), { class: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }, null, _parent2, _scopeId));
            _push2(`<select class="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "") : ssrLooseEqual(filterStatus.value, "")) ? " selected" : ""}${_scopeId}>Semua Status</option><option value="Sedang Dikerjakan"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "Sedang Dikerjakan") : ssrLooseEqual(filterStatus.value, "Sedang Dikerjakan")) ? " selected" : ""}${_scopeId}>Sedang Dikerjakan</option><option value="Selesai"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "Selesai") : ssrLooseEqual(filterStatus.value, "Selesai")) ? " selected" : ""}${_scopeId}>Selesai</option><option value="Terkunci"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "Terkunci") : ssrLooseEqual(filterStatus.value, "Terkunci")) ? " selected" : ""}${_scopeId}>Terkunci</option></select></div><div class="relative flex-1"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(MagnifyingGlassIcon), { class: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }, null, _parent2, _scopeId));
            _push2(`<input type="text"${ssrRenderAttr("value", searchNama.value)} placeholder="Cari nama peserta…" class="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}></div>`);
            if (hasActiveFilter.value) {
              _push2(`<button class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Reset </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (hasActiveFilter.value) {
              _push2(`<p class="text-xs text-gray-400 dark:text-gray-500 mt-2.5"${_scopeId}> Menampilkan <strong class="text-gray-600 dark:text-gray-300"${_scopeId}>${ssrInterpolate(filteredPeserta.value.length)}</strong> dari ${ssrInterpolate(pesertaList.value.length)} peserta </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (filteredPeserta.value.length) {
              _push2(`<div class="hidden md:block bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-sm overflow-hidden"${_scopeId}><table class="w-full text-sm"${_scopeId}><thead${_scopeId}><tr class="bg-slate-50 dark:bg-slate-700/60 border-b border-gray-100 dark:border-white/10"${_scopeId}><th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center w-12"${_scopeId}> #</th><th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left"${_scopeId}> Nama</th><th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center"${_scopeId}> Kelas</th><th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center"${_scopeId}> Token</th><th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center"${_scopeId}> Status</th><th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center w-16"${_scopeId}> Aksi</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-white/5"${_scopeId}><!--[-->`);
              ssrRenderList(paginatedPeserta.value, (p, i) => {
                _push2(`<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"${_scopeId}><td class="px-4 py-3 text-center text-xs text-gray-400 dark:text-gray-500"${_scopeId}>${ssrInterpolate((currentPage.value - 1) * perPage + i + 1)}</td><td class="px-4 py-3"${_scopeId}><span class="font-medium text-gray-800 dark:text-gray-100"${_scopeId}>${ssrInterpolate(p.user?.siswa?.nama_lengkap ?? "—")}</span>`);
                if (p.soal?.mapel?.mapel) {
                  _push2(`<span class="block text-xs text-gray-400 dark:text-gray-500 mt-0.5"${_scopeId}>${ssrInterpolate(p.soal.mapel.mapel)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</td><td class="px-4 py-3 text-center"${_scopeId}><span class="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"${_scopeId}>${ssrInterpolate(p.user?.siswa?.kelas?.kelas ?? "—")}</span></td><td class="px-4 py-3 text-center"${_scopeId}><button class="font-mono text-xs px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-300 transition cursor-copy tracking-wider"${_scopeId}>${ssrInterpolate(p.token)}</button></td><td class="px-4 py-3 text-center"${_scopeId}><span class="${ssrRenderClass([statusClass(p.status), "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"])}"${_scopeId}><span class="${ssrRenderClass([statusDot(p.status), "w-1.5 h-1.5 rounded-full flex-shrink-0"])}"${_scopeId}></span> ${ssrInterpolate(p.status ?? "Terkunci")}</span></td><td class="px-4 py-3 text-center"${_scopeId}><button${ssrIncludeBooleanAttr(loadingIds.value.has(p.id)) ? " disabled" : ""} class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:opacity-40 transition"${_scopeId}>`);
                if (loadingIds.value.has(p.id)) {
                  _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-4 h-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                }
                _push2(`</button></td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (filteredPeserta.value.length) {
              _push2(`<div class="md:hidden space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(paginatedPeserta.value, (p, i) => {
                _push2(`<div class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-xl p-4 shadow-sm"${_scopeId}><div class="flex items-start justify-between gap-2"${_scopeId}><div${_scopeId}><p class="font-semibold text-gray-800 dark:text-gray-100 text-sm"${_scopeId}>${ssrInterpolate(p.user?.siswa?.nama_lengkap ?? "—")}</p><p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5"${_scopeId}>${ssrInterpolate(p.soal?.mapel?.mapel ?? "—")}</p></div><span class="${ssrRenderClass([statusClass(p.status), "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"])}"${_scopeId}><span class="${ssrRenderClass([statusDot(p.status), "w-1.5 h-1.5 rounded-full"])}"${_scopeId}></span> ${ssrInterpolate(p.status ?? "Terkunci")}</span></div><div class="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400"${_scopeId}><div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2"${_scopeId}><span class="block text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-0.5"${_scopeId}>Kelas</span><span class="font-medium text-gray-700 dark:text-gray-200"${_scopeId}>${ssrInterpolate(p.user?.siswa?.kelas?.kelas ?? "—")}</span></div><button class="bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2 text-left cursor-copy hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"${_scopeId}><span class="block text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-0.5"${_scopeId}>Token</span><span class="font-mono font-medium text-gray-700 dark:text-gray-200 tracking-wider"${_scopeId}>${ssrInterpolate(p.token)}</span></button></div><button${ssrIncludeBooleanAttr(loadingIds.value.has(p.id)) ? " disabled" : ""} class="mt-3 w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg text-sm border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 transition"${_scopeId}>`);
                if (loadingIds.value.has(p.id)) {
                  _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-4 h-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                }
                _push2(` ${ssrInterpolate(loadingIds.value.has(p.id) ? "Menghapus…" : "Hapus Peserta")}</button></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!filteredPeserta.value.length) {
              _push2(`<div class="flex flex-col items-center justify-center py-20 text-center"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(UserGroupIcon), { class: "w-14 h-14 text-gray-300 dark:text-gray-600 mb-4" }, null, _parent2, _scopeId));
              _push2(`<p class="text-gray-500 dark:text-gray-400 font-medium"${_scopeId}>Tidak ada peserta ditemukan</p><p class="text-sm text-gray-400 dark:text-gray-500 mt-1"${_scopeId}>${ssrInterpolate(hasActiveFilter.value ? "Coba ubah filter pencarian." : "Belum ada peserta yang terdaftar.")}</p>`);
              if (hasActiveFilter.value) {
                _push2(`<button class="mt-4 text-sm text-blue-500 hover:underline"${_scopeId}>Reset filter</button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (totalPages.value > 1) {
              _push2(`<div class="flex justify-center items-center gap-1 mt-6"${_scopeId}><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-2 rounded-lg border text-sm border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition"${_scopeId}>‹</button><!--[-->`);
              ssrRenderList(visiblePages.value, (page) => {
                _push2(`<button class="${ssrRenderClass([page === currentPage.value ? "bg-blue-600 border-blue-600 text-white font-medium shadow-sm" : "border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700", "px-3 py-2 rounded-lg border text-sm transition"])}"${_scopeId}>${ssrInterpolate(page)}</button>`);
              });
              _push2(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-2 rounded-lg border text-sm border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition"${_scopeId}>›</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-6xl w-full px-4 pb-10" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight" }, " Exam Room Management "),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 mt-0.5" }, " Kelola dan pantau peserta ujian (Klik tombol reload untuk refresh dan menampilkan data terbaru) ")
                  ]),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode("button", {
                      onClick: reloadPeserta,
                      disabled: isLoading.value,
                      class: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition shadow-sm"
                    }, [
                      createVNode(unref(ArrowPathIcon), {
                        class: ["w-4 h-4", { "animate-spin": isLoading.value }]
                      }, null, 8, ["class"]),
                      createTextVNode(" Reload ")
                    ], 8, ["disabled"]),
                    createVNode("button", {
                      onClick: deleteAllPeserta,
                      disabled: isLoading.value || filteredPeserta.value.length === 0,
                      class: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white transition shadow-sm"
                    }, [
                      createVNode(unref(TrashIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Hapus " + toDisplayString(filterKelas.value ? `Kelas ${filterKelas.value}` : "Semua"), 1)
                    ], 8, ["disabled"])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6" }, [
                  createVNode("div", { class: "bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm" }, [
                    createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide" }, "Total"),
                    createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1" }, toDisplayString(stats.value.total), 1)
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm" }, [
                    createVNode("p", { class: "text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide" }, " Selesai"),
                    createVNode("p", { class: "text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1" }, toDisplayString(stats.value.selesai), 1)
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm" }, [
                    createVNode("p", { class: "text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide" }, "Aktif"),
                    createVNode("p", { class: "text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1" }, toDisplayString(stats.value.aktif), 1)
                  ]),
                  createVNode("div", { class: "bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm" }, [
                    createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide" }, "Terkunci "),
                    createVNode("p", { class: "text-2xl font-bold text-slate-600 dark:text-slate-300 mt-1" }, toDisplayString(stats.value.terkunci), 1)
                  ])
                ]),
                createVNode("div", { class: "bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-sm p-4 mb-5" }, [
                  createVNode("div", { class: "flex flex-col sm:flex-row gap-3" }, [
                    createVNode("div", { class: "relative flex-1" }, [
                      createVNode(unref(BuildingLibraryIcon), { class: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => filterKelas.value = $event,
                        class: "w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      }, [
                        createVNode("option", { value: "" }, "Semua Kelas"),
                        (openBlock(true), createBlock(Fragment, null, renderList(kelasOptions.value, (k) => {
                          return openBlock(), createBlock("option", {
                            key: k,
                            value: k
                          }, toDisplayString(k), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, filterKelas.value]
                      ])
                    ]),
                    createVNode("div", { class: "relative flex-1" }, [
                      createVNode(unref(BookOpenIcon), { class: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => filterMapel.value = $event,
                        class: "w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      }, [
                        createVNode("option", { value: "" }, "Semua Mapel"),
                        (openBlock(true), createBlock(Fragment, null, renderList(mapelOptions.value, (m) => {
                          return openBlock(), createBlock("option", {
                            key: m,
                            value: m
                          }, toDisplayString(m), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, filterMapel.value]
                      ])
                    ]),
                    createVNode("div", { class: "relative flex-1" }, [
                      createVNode(unref(FunnelIcon), { class: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => filterStatus.value = $event,
                        class: "w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      }, [
                        createVNode("option", { value: "" }, "Semua Status"),
                        createVNode("option", { value: "Sedang Dikerjakan" }, "Sedang Dikerjakan"),
                        createVNode("option", { value: "Selesai" }, "Selesai"),
                        createVNode("option", { value: "Terkunci" }, "Terkunci")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, filterStatus.value]
                      ])
                    ]),
                    createVNode("div", { class: "relative flex-1" }, [
                      createVNode(unref(MagnifyingGlassIcon), { class: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => searchNama.value = $event,
                        placeholder: "Cari nama peserta…",
                        class: "w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, searchNama.value]
                      ])
                    ]),
                    hasActiveFilter.value ? (openBlock(), createBlock("button", {
                      key: 0,
                      onClick: resetFilter,
                      class: "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                    }, [
                      createVNode(unref(XMarkIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Reset ")
                    ])) : createCommentVNode("", true)
                  ]),
                  hasActiveFilter.value ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-xs text-gray-400 dark:text-gray-500 mt-2.5"
                  }, [
                    createTextVNode(" Menampilkan "),
                    createVNode("strong", { class: "text-gray-600 dark:text-gray-300" }, toDisplayString(filteredPeserta.value.length), 1),
                    createTextVNode(" dari " + toDisplayString(pesertaList.value.length) + " peserta ", 1)
                  ])) : createCommentVNode("", true)
                ]),
                filteredPeserta.value.length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "hidden md:block bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-sm overflow-hidden"
                }, [
                  createVNode("table", { class: "w-full text-sm" }, [
                    createVNode("thead", null, [
                      createVNode("tr", { class: "bg-slate-50 dark:bg-slate-700/60 border-b border-gray-100 dark:border-white/10" }, [
                        createVNode("th", { class: "px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center w-12" }, " #"),
                        createVNode("th", { class: "px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left" }, " Nama"),
                        createVNode("th", { class: "px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center" }, " Kelas"),
                        createVNode("th", { class: "px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center" }, " Token"),
                        createVNode("th", { class: "px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center" }, " Status"),
                        createVNode("th", { class: "px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center w-16" }, " Aksi")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-100 dark:divide-white/5" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(paginatedPeserta.value, (p, i) => {
                        return openBlock(), createBlock("tr", {
                          key: p.id,
                          class: "hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                        }, [
                          createVNode("td", { class: "px-4 py-3 text-center text-xs text-gray-400 dark:text-gray-500" }, toDisplayString((currentPage.value - 1) * perPage + i + 1), 1),
                          createVNode("td", { class: "px-4 py-3" }, [
                            createVNode("span", { class: "font-medium text-gray-800 dark:text-gray-100" }, toDisplayString(p.user?.siswa?.nama_lengkap ?? "—"), 1),
                            p.soal?.mapel?.mapel ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "block text-xs text-gray-400 dark:text-gray-500 mt-0.5"
                            }, toDisplayString(p.soal.mapel.mapel), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("td", { class: "px-4 py-3 text-center" }, [
                            createVNode("span", { class: "inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" }, toDisplayString(p.user?.siswa?.kelas?.kelas ?? "—"), 1)
                          ]),
                          createVNode("td", { class: "px-4 py-3 text-center" }, [
                            createVNode("button", {
                              onClick: ($event) => copyToken(p.token),
                              class: "font-mono text-xs px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-300 transition cursor-copy tracking-wider"
                            }, toDisplayString(p.token), 9, ["onClick"])
                          ]),
                          createVNode("td", { class: "px-4 py-3 text-center" }, [
                            createVNode("span", {
                              class: ["inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusClass(p.status)]
                            }, [
                              createVNode("span", {
                                class: ["w-1.5 h-1.5 rounded-full flex-shrink-0", statusDot(p.status)]
                              }, null, 2),
                              createTextVNode(" " + toDisplayString(p.status ?? "Terkunci"), 1)
                            ], 2)
                          ]),
                          createVNode("td", { class: "px-4 py-3 text-center" }, [
                            createVNode("button", {
                              onClick: ($event) => deletePeserta(p.id, p.user?.siswa?.nama_lengkap),
                              disabled: loadingIds.value.has(p.id),
                              class: "p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:opacity-40 transition"
                            }, [
                              loadingIds.value.has(p.id) ? (openBlock(), createBlock(unref(ArrowPathIcon), {
                                key: 0,
                                class: "w-4 h-4 animate-spin"
                              })) : (openBlock(), createBlock(unref(TrashIcon), {
                                key: 1,
                                class: "w-4 h-4"
                              }))
                            ], 8, ["onClick", "disabled"])
                          ])
                        ]);
                      }), 128))
                    ])
                  ])
                ])) : createCommentVNode("", true),
                filteredPeserta.value.length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "md:hidden space-y-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(paginatedPeserta.value, (p, i) => {
                    return openBlock(), createBlock("div", {
                      key: p.id,
                      class: "bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-xl p-4 shadow-sm"
                    }, [
                      createVNode("div", { class: "flex items-start justify-between gap-2" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "font-semibold text-gray-800 dark:text-gray-100 text-sm" }, toDisplayString(p.user?.siswa?.nama_lengkap ?? "—"), 1),
                          createVNode("p", { class: "text-xs text-gray-400 dark:text-gray-500 mt-0.5" }, toDisplayString(p.soal?.mapel?.mapel ?? "—"), 1)
                        ]),
                        createVNode("span", {
                          class: ["inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0", statusClass(p.status)]
                        }, [
                          createVNode("span", {
                            class: ["w-1.5 h-1.5 rounded-full", statusDot(p.status)]
                          }, null, 2),
                          createTextVNode(" " + toDisplayString(p.status ?? "Terkunci"), 1)
                        ], 2)
                      ]),
                      createVNode("div", { class: "mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400" }, [
                        createVNode("div", { class: "bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2" }, [
                          createVNode("span", { class: "block text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-0.5" }, "Kelas"),
                          createVNode("span", { class: "font-medium text-gray-700 dark:text-gray-200" }, toDisplayString(p.user?.siswa?.kelas?.kelas ?? "—"), 1)
                        ]),
                        createVNode("button", {
                          onClick: ($event) => copyToken(p.token),
                          class: "bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2 text-left cursor-copy hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                        }, [
                          createVNode("span", { class: "block text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-0.5" }, "Token"),
                          createVNode("span", { class: "font-mono font-medium text-gray-700 dark:text-gray-200 tracking-wider" }, toDisplayString(p.token), 1)
                        ], 8, ["onClick"])
                      ]),
                      createVNode("button", {
                        onClick: ($event) => deletePeserta(p.id, p.user?.siswa?.nama_lengkap),
                        disabled: loadingIds.value.has(p.id),
                        class: "mt-3 w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg text-sm border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 transition"
                      }, [
                        loadingIds.value.has(p.id) ? (openBlock(), createBlock(unref(ArrowPathIcon), {
                          key: 0,
                          class: "w-4 h-4 animate-spin"
                        })) : (openBlock(), createBlock(unref(TrashIcon), {
                          key: 1,
                          class: "w-4 h-4"
                        })),
                        createTextVNode(" " + toDisplayString(loadingIds.value.has(p.id) ? "Menghapus…" : "Hapus Peserta"), 1)
                      ], 8, ["onClick", "disabled"])
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true),
                !filteredPeserta.value.length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "flex flex-col items-center justify-center py-20 text-center"
                }, [
                  createVNode(unref(UserGroupIcon), { class: "w-14 h-14 text-gray-300 dark:text-gray-600 mb-4" }),
                  createVNode("p", { class: "text-gray-500 dark:text-gray-400 font-medium" }, "Tidak ada peserta ditemukan"),
                  createVNode("p", { class: "text-sm text-gray-400 dark:text-gray-500 mt-1" }, toDisplayString(hasActiveFilter.value ? "Coba ubah filter pencarian." : "Belum ada peserta yang terdaftar."), 1),
                  hasActiveFilter.value ? (openBlock(), createBlock("button", {
                    key: 0,
                    onClick: resetFilter,
                    class: "mt-4 text-sm text-blue-500 hover:underline"
                  }, "Reset filter")) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                totalPages.value > 1 ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "flex justify-center items-center gap-1 mt-6"
                }, [
                  createVNode("button", {
                    onClick: prevPage,
                    disabled: currentPage.value === 1,
                    class: "px-3 py-2 rounded-lg border text-sm border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  }, "‹", 8, ["disabled"]),
                  (openBlock(true), createBlock(Fragment, null, renderList(visiblePages.value, (page) => {
                    return openBlock(), createBlock("button", {
                      key: page,
                      onClick: ($event) => currentPage.value = page,
                      class: ["px-3 py-2 rounded-lg border text-sm transition", page === currentPage.value ? "bg-blue-600 border-blue-600 text-white font-medium shadow-sm" : "border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"]
                    }, toDisplayString(page), 11, ["onClick"]);
                  }), 128)),
                  createVNode("button", {
                    onClick: nextPage,
                    disabled: currentPage.value === totalPages.value,
                    class: "px-3 py-2 rounded-lg border text-sm border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  }, "›", 8, ["disabled"])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Proktor/RuangUjian.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
