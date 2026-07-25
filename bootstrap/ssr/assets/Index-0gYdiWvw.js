import { ref, onMounted, watch, computed, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, createCommentVNode, withDirectives, vModelText, vModelSelect, toDisplayString, Fragment, renderList, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import { PencilIcon, ArrowDownTrayIcon, TrashIcon } from "@heroicons/vue/24/outline";
import axios from "axios";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
import "sweetalert2";
import "ziggy-js";
const perPage = 10;
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    soal: Object
  },
  setup(__props) {
    const props = __props;
    usePage();
    const exportingId = ref(null);
    const { success, error, confirm } = ToastAlert();
    onMounted(() => {
      allSoal.value = props.soal?.data ?? [];
      const totalFromProps = props.soal?.total ?? 0;
      const dataFromProps = props.soal?.data?.length ?? 0;
      if (totalFromProps > dataFromProps) fetchAllSoal();
    });
    const allSoal = ref([]);
    const isLoading = ref(false);
    async function fetchAllSoal() {
      isLoading.value = true;
      try {
        const res = await axios.get("/guru/soal", {
          params: { per_page: "all" },
          headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" }
        });
        allSoal.value = res.data.data ?? res.data;
      } catch {
        allSoal.value = props.soal?.data ?? [];
      } finally {
        isLoading.value = false;
      }
    }
    const search = ref("");
    const filterStatus = ref("semua");
    const filterSoal = ref("semua");
    watch([search, filterStatus, filterSoal], () => {
      currentPage.value = 1;
    });
    const filteredSoal = computed(() => {
      const q = search.value.trim().toLowerCase();
      return allSoal.value.filter((item) => {
        if (q && !(item.kelas?.toLowerCase().includes(q) || item.token?.toLowerCase().includes(q) || item.mapel?.mapel?.toLowerCase().includes(q) || item.title?.toLowerCase().includes(q))) return false;
        if (filterStatus.value !== "semua" && item.status !== filterStatus.value) return false;
        const jml = item.bank_soal?.length ?? 0;
        if (filterSoal.value === "ada" && jml === 0) return false;
        if (filterSoal.value === "kosong" && jml > 0) return false;
        return true;
      });
    });
    const isFiltering = computed(
      () => search.value.trim() || filterStatus.value !== "semua" || filterSoal.value !== "semua"
    );
    function resetFilters() {
      search.value = "";
      filterStatus.value = "semua";
      filterSoal.value = "semua";
    }
    const currentPage = ref(1);
    const totalPages = computed(() => Math.ceil(filteredSoal.value.length / perPage));
    const paginatedSoal = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filteredSoal.value.slice(start, start + perPage);
    });
    const pageNumbers = computed(() => {
      const total = totalPages.value;
      const cur = currentPage.value;
      if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
      let start = Math.max(1, cur - 2);
      let end = Math.min(total, start + 4);
      if (end - start < 4) start = Math.max(1, end - 4);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });
    const hasData = computed(() => allSoal.value.length > 0);
    const hasFilteredData = computed(() => filteredSoal.value.length > 0);
    async function confirmDeleteItem(id, event) {
      event?.stopPropagation();
      const result = await confirm({
        title: "Hapus quiz ini?",
        text: "Tindakan ini tidak bisa dibatalkan.",
        confirmButtonText: "Ya, hapus"
      });
      if (!result.isConfirmed) return;
      try {
        const res = await axios.delete(`/guru/soal/${id}`);
        allSoal.value = allSoal.value.filter((s) => s.id !== id);
        success(res.data.success || "Quiz berhasil dihapus.");
      } catch (err) {
        error(err.response?.data?.message || "Gagal menghapus quiz.");
      }
    }
    async function exportSoal(item, event) {
      event?.stopPropagation();
      if (!item.bank_soal?.length) {
        return error("This quiz has no questions to export.");
      }
      exportingId.value = item.id;
      try {
        const response = await axios.get(`/guru/bank-soal/soal/${item.id}/export`, { responseType: "blob" });
        const disposition = response.headers["content-disposition"] ?? "";
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        const filename = match ? match[1].replace(/['"]/g, "") : `Soal_${item.id}.xlsx`;
        const url = URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch {
        error("Failed to export questions.");
      } finally {
        exportingId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Daftar Quiz Saya" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto w-full sm:px-4 pb-16"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:mb-8 mb-4 pt-2"${_scopeId}><div${_scopeId}><h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight"${_scopeId}> Quiz &amp; Soal Saya </h1></div>`);
            if (hasData.value) {
              _push2(ssrRenderComponent(unref(Link), {
                href: "/guru/soal/create",
                class: "inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-150 whitespace-nowrap"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"${_scopeId2}></path></svg> Buat Quiz Baru `);
                  } else {
                    return [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2.5"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M12 4v16m8-8H4"
                        })
                      ])),
                      createTextVNode(" Buat Quiz Baru ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (hasData.value) {
              _push2(`<div class="mb-6 flex flex-col sm:flex-row gap-3"${_scopeId}><div class="relative flex-1 max-w-lg"${_scopeId}><svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"${_scopeId}></path></svg><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Cari mapel, kelas, token..." class="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 shadow-sm transition"${_scopeId}>`);
              if (search.value) {
                _push2(`<button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"${_scopeId}><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg></button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><select class="py-2.5 px-3 pr-8 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm transition cursor-pointer"${_scopeId}><option value="semua"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "semua") : ssrLooseEqual(filterStatus.value, "semua")) ? " selected" : ""}${_scopeId}>Semua Status</option><option value="Aktif"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "Aktif") : ssrLooseEqual(filterStatus.value, "Aktif")) ? " selected" : ""}${_scopeId}>Soal Aktif</option><option value="Tidak Aktif"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "Tidak Aktif") : ssrLooseEqual(filterStatus.value, "Tidak Aktif")) ? " selected" : ""}${_scopeId}>Soal Nonaktif</option></select><select class="py-2.5 px-3 pr-8 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm transition cursor-pointer"${_scopeId}><option value="semua"${ssrIncludeBooleanAttr(Array.isArray(filterSoal.value) ? ssrLooseContain(filterSoal.value, "semua") : ssrLooseEqual(filterSoal.value, "semua")) ? " selected" : ""}${_scopeId}>Semua Soal</option><option value="ada"${ssrIncludeBooleanAttr(Array.isArray(filterSoal.value) ? ssrLooseContain(filterSoal.value, "ada") : ssrLooseEqual(filterSoal.value, "ada")) ? " selected" : ""}${_scopeId}>Sudah Ada Soal</option><option value="kosong"${ssrIncludeBooleanAttr(Array.isArray(filterSoal.value) ? ssrLooseContain(filterSoal.value, "kosong") : ssrLooseEqual(filterSoal.value, "kosong")) ? " selected" : ""}${_scopeId}>Soal Masih Kosong</option></select>`);
              if (isFiltering.value) {
                _push2(`<button class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition whitespace-nowrap"${_scopeId}><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg> Reset </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (hasData.value && isFiltering.value) {
              _push2(`<div class="mb-4 text-xs text-gray-400 dark:text-gray-500"${_scopeId}> Menampilkan <span class="font-semibold text-gray-600 dark:text-gray-300"${_scopeId}>${ssrInterpolate(filteredSoal.value.length)}</span> dari <span class="font-semibold text-gray-600 dark:text-gray-300"${_scopeId}>${ssrInterpolate(allSoal.value.length)}</span> quiz </div>`);
            } else {
              _push2(`<!---->`);
            }
            if (isLoading.value) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}><!--[-->`);
              ssrRenderList(4, (n) => {
                _push2(`<div class="h-52 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 animate-pulse"${_scopeId}><div class="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-t-2xl"${_scopeId}></div><div class="p-5 space-y-3"${_scopeId}><div class="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"${_scopeId}></div><div class="h-3 w-1/2 bg-slate-100 dark:bg-slate-600 rounded"${_scopeId}></div><div class="grid grid-cols-3 gap-2 pt-2"${_scopeId}><div class="h-10 bg-slate-100 dark:bg-slate-600 rounded-xl"${_scopeId}></div><div class="h-10 bg-slate-100 dark:bg-slate-600 rounded-xl"${_scopeId}></div><div class="h-10 bg-slate-100 dark:bg-slate-600 rounded-xl"${_scopeId}></div></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else if (!hasFilteredData.value) {
              _push2(`<div class="flex flex-col items-center justify-center py-24 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 shadow-sm text-center"${_scopeId}><div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-5"${_scopeId}><svg class="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-3-3v6m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg></div><p class="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1"${_scopeId}>${ssrInterpolate(isFiltering.value ? "Tidak ada hasil ditemukan" : "Belum ada quiz atau soal")}</p><p class="text-sm text-gray-400 dark:text-gray-500 mb-6"${_scopeId}>${ssrInterpolate(isFiltering.value ? "Coba ubah atau reset filter pencarian." : "Mulai buat quiz pertama untuk ujian siswa.")}</p>`);
              if (isFiltering.value) {
                _push2(`<button class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all"${_scopeId}><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg> Reset Filter </button>`);
              } else {
                _push2(ssrRenderComponent(unref(Link), {
                  href: "/guru/soal/create",
                  class: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30 transition-all"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"${_scopeId2}></path></svg> Buat Quiz Sekarang `);
                    } else {
                      return [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          "stroke-width": "2.5"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M12 4v16m8-8H4"
                          })
                        ])),
                        createTextVNode(" Buat Quiz Sekarang ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              }
              _push2(`</div>`);
            } else {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-5"${_scopeId}><!--[-->`);
              ssrRenderList(paginatedSoal.value, (item) => {
                _push2(`<div class="relative flex flex-col bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-lg overflow-hidden transition-shadow duration-200"${_scopeId}><div class="${ssrRenderClass([item.status === "Aktif" ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500", "h-1 w-full"])}"${_scopeId}></div><div class="flex flex-col flex-1 p-5 gap-4"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div class="min-w-0"${_scopeId}><p class="font-bold text-base text-gray-900 dark:text-white leading-snug truncate"${_scopeId}>${ssrInterpolate(item.mapel?.mapel ?? "—")}</p><p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate"${_scopeId}>${ssrInterpolate(item.title ?? "Tanpa judul")}</p></div><span class="${ssrRenderClass([item.status === "Aktif" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400", "flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"])}"${_scopeId}><span class="${ssrRenderClass([item.status === "Aktif" ? "bg-emerald-500" : "bg-slate-400", "w-1.5 h-1.5 rounded-full"])}"${_scopeId}></span> ${ssrInterpolate(item.status === "Aktif" ? "Aktif" : "Nonaktif")}</span></div><div class="grid grid-cols-3 gap-2"${_scopeId}><div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5 text-center"${_scopeId}><p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1"${_scopeId}> Kelas</p><p class="text-xs font-bold text-gray-700 dark:text-gray-200 truncate"${_scopeId}>${ssrInterpolate(item.kelas)}</p></div><div class="bg-blue-50 dark:bg-blue-500/10 rounded-xl px-3 py-2.5 text-center"${_scopeId}><p class="text-[9px] font-bold uppercase tracking-widest text-blue-400 mb-1"${_scopeId}>Token</p><p class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest"${_scopeId}>${ssrInterpolate(item.token)}</p></div><div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5 text-center"${_scopeId}><p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1"${_scopeId}> Durasi</p><p class="text-xs font-bold text-gray-700 dark:text-gray-200"${_scopeId}>${ssrInterpolate(item.waktu)} mnt</p></div></div><div class="flex sm:flex-row flex-col gap-2 items-center justify-between text-[11px] text-gray-400 dark:text-gray-500"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><span${_scopeId}>${ssrInterpolate(item.tipe_soal === "Berurutan" ? "Sequential" : item.tipe_soal === "Acak" ? "Shuffle" : item.tipe_soal)}</span><span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"${_scopeId}></span><span class="${ssrRenderClass((item.bank_soal?.length ?? 0) === 0 ? "text-amber-500 dark:text-amber-400 font-semibold" : "")}"${_scopeId}>${ssrInterpolate(item.bank_soal?.length ?? 0)} Soal `);
                if ((item.bank_soal?.length ?? 0) === 0) {
                  _push2(`<span class="text-[10px]"${_scopeId}>(kosong)</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</span></div>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/guru/soal/${item.id}`,
                  class: "group inline-flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Preview Quiz <svg class="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"${_scopeId2}></path></svg>`);
                    } else {
                      return [
                        createTextVNode(" Preview Quiz "),
                        (openBlock(), createBlock("svg", {
                          class: "w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          "stroke-width": "2.5"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M9 5l7 7-7 7"
                          })
                        ]))
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div><div class="border-t border-gray-100 dark:border-white/5"${_scopeId}></div><div class="flex items-center gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/guru/soal/${item.id}/edit`,
                  onClick: () => {
                  },
                  class: "flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-600 dark:bg-slate-700 dark:hover:bg-blue-600 text-slate-600 hover:text-white dark:text-slate-300 dark:hover:text-white transition-all duration-150"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(PencilIcon), { class: "w-3.5 h-3.5" }, null, _parent3, _scopeId2));
                      _push3(` Settings `);
                    } else {
                      return [
                        createVNode(unref(PencilIcon), { class: "w-3.5 h-3.5" }),
                        createTextVNode(" Settings ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<button${ssrIncludeBooleanAttr(exportingId.value === item.id || !item.bank_soal?.length) ? " disabled" : ""} class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-600 dark:bg-slate-700 dark:hover:bg-emerald-600 text-slate-600 hover:text-white dark:text-slate-300 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-700 disabled:hover:text-slate-600 dark:disabled:hover:text-slate-300 transition-all duration-150"${_scopeId}>`);
                if (exportingId.value === item.id) {
                  _push2(`<svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
                } else {
                  _push2(ssrRenderComponent(unref(ArrowDownTrayIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                }
                _push2(` ${ssrInterpolate(exportingId.value === item.id ? "Downloading..." : "Download")}</button><button class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-600 dark:bg-slate-700 dark:hover:bg-red-600 text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white transition-all duration-150"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                _push2(`</button></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            if (!isLoading.value && hasFilteredData.value && totalPages.value > 1) {
              _push2(`<div class="flex justify-between items-center mt-8 gap-2"${_scopeId}><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"${_scopeId}> ← Sebelumnya </button><div class="flex items-center gap-1"${_scopeId}>`);
              if (pageNumbers.value[0] > 1) {
                _push2(`<!--[--><button class="w-9 h-9 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"${_scopeId}>1</button>`);
                if (pageNumbers.value[0] > 2) {
                  _push2(`<span class="px-1 text-gray-400"${_scopeId}>…</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(pageNumbers.value, (n) => {
                _push2(`<button class="${ssrRenderClass([n === currentPage.value ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25" : "bg-white dark:bg-slate-800 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700", "w-9 h-9 rounded-lg text-sm font-medium border transition"])}"${_scopeId}>${ssrInterpolate(n)}</button>`);
              });
              _push2(`<!--]-->`);
              if (pageNumbers.value[pageNumbers.value.length - 1] < totalPages.value) {
                _push2(`<!--[-->`);
                if (pageNumbers.value[pageNumbers.value.length - 1] < totalPages.value - 1) {
                  _push2(`<span class="px-1 text-gray-400"${_scopeId}>…</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<button class="w-9 h-9 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"${_scopeId}>${ssrInterpolate(totalPages.value)}</button><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"${_scopeId}> Berikutnya → </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!isLoading.value && hasFilteredData.value && totalPages.value > 1) {
              _push2(`<div class="text-center mt-3 text-xs text-gray-400 dark:text-gray-500"${_scopeId}> Halaman ${ssrInterpolate(currentPage.value)} dari ${ssrInterpolate(totalPages.value)} (${ssrInterpolate(filteredSoal.value.length)} quiz) </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Link), {
              href: "/guru/soal/create",
              class: "sm:hidden fixed bottom-6 right-5 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl active:scale-95 transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + Quiz Baru `);
                } else {
                  return [
                    createTextVNode(" + Quiz Baru ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto w-full sm:px-4 pb-16" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:mb-8 mb-4 pt-2" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight" }, " Quiz & Soal Saya ")
                  ]),
                  hasData.value ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: "/guru/soal/create",
                    class: "inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-150 whitespace-nowrap"
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2.5"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M12 4v16m8-8H4"
                        })
                      ])),
                      createTextVNode(" Buat Quiz Baru ")
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                hasData.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mb-6 flex flex-col sm:flex-row gap-3"
                }, [
                  createVNode("div", { class: "relative flex-1 max-w-lg" }, [
                    (openBlock(), createBlock("svg", {
                      class: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                      })
                    ])),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => search.value = $event,
                      type: "text",
                      placeholder: "Cari mapel, kelas, token...",
                      class: "w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 shadow-sm transition"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, search.value]
                    ]),
                    search.value ? (openBlock(), createBlock("button", {
                      key: 0,
                      onClick: ($event) => search.value = "",
                      class: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2.5"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M6 18L18 6M6 6l12 12"
                        })
                      ]))
                    ], 8, ["onClick"])) : createCommentVNode("", true)
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => filterStatus.value = $event,
                    class: "py-2.5 px-3 pr-8 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm transition cursor-pointer"
                  }, [
                    createVNode("option", { value: "semua" }, "Semua Status"),
                    createVNode("option", { value: "Aktif" }, "Soal Aktif"),
                    createVNode("option", { value: "Tidak Aktif" }, "Soal Nonaktif")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, filterStatus.value]
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => filterSoal.value = $event,
                    class: "py-2.5 px-3 pr-8 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm transition cursor-pointer"
                  }, [
                    createVNode("option", { value: "semua" }, "Semua Soal"),
                    createVNode("option", { value: "ada" }, "Sudah Ada Soal"),
                    createVNode("option", { value: "kosong" }, "Soal Masih Kosong")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, filterSoal.value]
                  ]),
                  isFiltering.value ? (openBlock(), createBlock("button", {
                    key: 0,
                    onClick: resetFilters,
                    class: "inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition whitespace-nowrap"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-3.5 h-3.5",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2.5"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M6 18L18 6M6 6l12 12"
                      })
                    ])),
                    createTextVNode(" Reset ")
                  ])) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                hasData.value && isFiltering.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mb-4 text-xs text-gray-400 dark:text-gray-500"
                }, [
                  createTextVNode(" Menampilkan "),
                  createVNode("span", { class: "font-semibold text-gray-600 dark:text-gray-300" }, toDisplayString(filteredSoal.value.length), 1),
                  createTextVNode(" dari "),
                  createVNode("span", { class: "font-semibold text-gray-600 dark:text-gray-300" }, toDisplayString(allSoal.value.length), 1),
                  createTextVNode(" quiz ")
                ])) : createCommentVNode("", true),
                isLoading.value ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "grid grid-cols-1 sm:grid-cols-2 gap-5"
                }, [
                  (openBlock(), createBlock(Fragment, null, renderList(4, (n) => {
                    return createVNode("div", {
                      key: n,
                      class: "h-52 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 animate-pulse"
                    }, [
                      createVNode("div", { class: "h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-t-2xl" }),
                      createVNode("div", { class: "p-5 space-y-3" }, [
                        createVNode("div", { class: "h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" }),
                        createVNode("div", { class: "h-3 w-1/2 bg-slate-100 dark:bg-slate-600 rounded" }),
                        createVNode("div", { class: "grid grid-cols-3 gap-2 pt-2" }, [
                          createVNode("div", { class: "h-10 bg-slate-100 dark:bg-slate-600 rounded-xl" }),
                          createVNode("div", { class: "h-10 bg-slate-100 dark:bg-slate-600 rounded-xl" }),
                          createVNode("div", { class: "h-10 bg-slate-100 dark:bg-slate-600 rounded-xl" })
                        ])
                      ])
                    ]);
                  }), 64))
                ])) : !hasFilteredData.value ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "flex flex-col items-center justify-center py-24 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 shadow-sm text-center"
                }, [
                  createVNode("div", { class: "w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-5" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-8 h-8 text-blue-400",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "1.5",
                        d: "M9 12h6m-3-3v6m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      })
                    ]))
                  ]),
                  createVNode("p", { class: "text-base font-semibold text-gray-700 dark:text-gray-200 mb-1" }, toDisplayString(isFiltering.value ? "Tidak ada hasil ditemukan" : "Belum ada quiz atau soal"), 1),
                  createVNode("p", { class: "text-sm text-gray-400 dark:text-gray-500 mb-6" }, toDisplayString(isFiltering.value ? "Coba ubah atau reset filter pencarian." : "Mulai buat quiz pertama untuk ujian siswa."), 1),
                  isFiltering.value ? (openBlock(), createBlock("button", {
                    key: 0,
                    onClick: resetFilters,
                    class: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2.5"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M6 18L18 6M6 6l12 12"
                      })
                    ])),
                    createTextVNode(" Reset Filter ")
                  ])) : (openBlock(), createBlock(unref(Link), {
                    key: 1,
                    href: "/guru/soal/create",
                    class: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30 transition-all"
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2.5"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M12 4v16m8-8H4"
                        })
                      ])),
                      createTextVNode(" Buat Quiz Sekarang ")
                    ]),
                    _: 1
                  }))
                ])) : (openBlock(), createBlock("div", {
                  key: 4,
                  class: "grid grid-cols-1 sm:grid-cols-2 gap-5"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(paginatedSoal.value, (item) => {
                    return openBlock(), createBlock("div", {
                      key: item.id,
                      class: "relative flex flex-col bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-lg overflow-hidden transition-shadow duration-200"
                    }, [
                      createVNode("div", {
                        class: ["h-1 w-full", item.status === "Aktif" ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500"]
                      }, null, 2),
                      createVNode("div", { class: "flex flex-col flex-1 p-5 gap-4" }, [
                        createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                          createVNode("div", { class: "min-w-0" }, [
                            createVNode("p", { class: "font-bold text-base text-gray-900 dark:text-white leading-snug truncate" }, toDisplayString(item.mapel?.mapel ?? "—"), 1),
                            createVNode("p", { class: "text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate" }, toDisplayString(item.title ?? "Tanpa judul"), 1)
                          ]),
                          createVNode("span", {
                            class: ["flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold", item.status === "Aktif" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400"]
                          }, [
                            createVNode("span", {
                              class: ["w-1.5 h-1.5 rounded-full", item.status === "Aktif" ? "bg-emerald-500" : "bg-slate-400"]
                            }, null, 2),
                            createTextVNode(" " + toDisplayString(item.status === "Aktif" ? "Aktif" : "Nonaktif"), 1)
                          ], 2)
                        ]),
                        createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                          createVNode("div", { class: "bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5 text-center" }, [
                            createVNode("p", { class: "text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1" }, " Kelas"),
                            createVNode("p", { class: "text-xs font-bold text-gray-700 dark:text-gray-200 truncate" }, toDisplayString(item.kelas), 1)
                          ]),
                          createVNode("div", { class: "bg-blue-50 dark:bg-blue-500/10 rounded-xl px-3 py-2.5 text-center" }, [
                            createVNode("p", { class: "text-[9px] font-bold uppercase tracking-widest text-blue-400 mb-1" }, "Token"),
                            createVNode("p", { class: "font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest" }, toDisplayString(item.token), 1)
                          ]),
                          createVNode("div", { class: "bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5 text-center" }, [
                            createVNode("p", { class: "text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1" }, " Durasi"),
                            createVNode("p", { class: "text-xs font-bold text-gray-700 dark:text-gray-200" }, toDisplayString(item.waktu) + " mnt", 1)
                          ])
                        ]),
                        createVNode("div", { class: "flex sm:flex-row flex-col gap-2 items-center justify-between text-[11px] text-gray-400 dark:text-gray-500" }, [
                          createVNode("div", { class: "flex items-center gap-3" }, [
                            createVNode("span", null, toDisplayString(item.tipe_soal === "Berurutan" ? "Sequential" : item.tipe_soal === "Acak" ? "Shuffle" : item.tipe_soal), 1),
                            createVNode("span", { class: "w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" }),
                            createVNode("span", {
                              class: (item.bank_soal?.length ?? 0) === 0 ? "text-amber-500 dark:text-amber-400 font-semibold" : ""
                            }, [
                              createTextVNode(toDisplayString(item.bank_soal?.length ?? 0) + " Soal ", 1),
                              (item.bank_soal?.length ?? 0) === 0 ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "text-[10px]"
                              }, "(kosong)")) : createCommentVNode("", true)
                            ], 2)
                          ]),
                          createVNode(unref(Link), {
                            href: `/guru/soal/${item.id}`,
                            class: "group inline-flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Preview Quiz "),
                              (openBlock(), createBlock("svg", {
                                class: "w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                "stroke-width": "2.5"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  d: "M9 5l7 7-7 7"
                                })
                              ]))
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ]),
                        createVNode("div", { class: "border-t border-gray-100 dark:border-white/5" }),
                        createVNode("div", {
                          class: "flex items-center gap-2",
                          onClick: withModifiers(() => {
                          }, ["stop"])
                        }, [
                          createVNode(unref(Link), {
                            href: `/guru/soal/${item.id}/edit`,
                            onClick: withModifiers(() => {
                            }, ["stop"]),
                            class: "flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-600 dark:bg-slate-700 dark:hover:bg-blue-600 text-slate-600 hover:text-white dark:text-slate-300 dark:hover:text-white transition-all duration-150"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(PencilIcon), { class: "w-3.5 h-3.5" }),
                              createTextVNode(" Settings ")
                            ]),
                            _: 1
                          }, 8, ["href", "onClick"]),
                          createVNode("button", {
                            onClick: ($event) => exportSoal(item, $event),
                            disabled: exportingId.value === item.id || !item.bank_soal?.length,
                            class: "flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-600 dark:bg-slate-700 dark:hover:bg-emerald-600 text-slate-600 hover:text-white dark:text-slate-300 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-700 disabled:hover:text-slate-600 dark:disabled:hover:text-slate-300 transition-all duration-150"
                          }, [
                            exportingId.value === item.id ? (openBlock(), createBlock("svg", {
                              key: 0,
                              class: "w-3.5 h-3.5 animate-spin",
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
                                d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              })
                            ])) : (openBlock(), createBlock(unref(ArrowDownTrayIcon), {
                              key: 1,
                              class: "w-3.5 h-3.5"
                            })),
                            createTextVNode(" " + toDisplayString(exportingId.value === item.id ? "Downloading..." : "Download"), 1)
                          ], 8, ["onClick", "disabled"]),
                          createVNode("button", {
                            onClick: ($event) => confirmDeleteItem(item.id, $event),
                            class: "inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-600 dark:bg-slate-700 dark:hover:bg-red-600 text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white transition-all duration-150"
                          }, [
                            createVNode(unref(TrashIcon), { class: "w-3.5 h-3.5" })
                          ], 8, ["onClick"])
                        ], 8, ["onClick"])
                      ])
                    ]);
                  }), 128))
                ])),
                !isLoading.value && hasFilteredData.value && totalPages.value > 1 ? (openBlock(), createBlock("div", {
                  key: 5,
                  class: "flex justify-between items-center mt-8 gap-2"
                }, [
                  createVNode("button", {
                    onClick: ($event) => currentPage.value--,
                    disabled: currentPage.value === 1,
                    class: "px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                  }, " ← Sebelumnya ", 8, ["onClick", "disabled"]),
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    pageNumbers.value[0] > 1 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode("button", {
                        onClick: ($event) => currentPage.value = 1,
                        class: "w-9 h-9 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                      }, "1", 8, ["onClick"]),
                      pageNumbers.value[0] > 2 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "px-1 text-gray-400"
                      }, "…")) : createCommentVNode("", true)
                    ], 64)) : createCommentVNode("", true),
                    (openBlock(true), createBlock(Fragment, null, renderList(pageNumbers.value, (n) => {
                      return openBlock(), createBlock("button", {
                        key: n,
                        onClick: ($event) => currentPage.value = n,
                        class: ["w-9 h-9 rounded-lg text-sm font-medium border transition", n === currentPage.value ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25" : "bg-white dark:bg-slate-800 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"]
                      }, toDisplayString(n), 11, ["onClick"]);
                    }), 128)),
                    pageNumbers.value[pageNumbers.value.length - 1] < totalPages.value ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                      pageNumbers.value[pageNumbers.value.length - 1] < totalPages.value - 1 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "px-1 text-gray-400"
                      }, "…")) : createCommentVNode("", true),
                      createVNode("button", {
                        onClick: ($event) => currentPage.value = totalPages.value,
                        class: "w-9 h-9 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                      }, toDisplayString(totalPages.value), 9, ["onClick"])
                    ], 64)) : createCommentVNode("", true)
                  ]),
                  createVNode("button", {
                    onClick: ($event) => currentPage.value++,
                    disabled: currentPage.value === totalPages.value,
                    class: "px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                  }, " Berikutnya → ", 8, ["onClick", "disabled"])
                ])) : createCommentVNode("", true),
                !isLoading.value && hasFilteredData.value && totalPages.value > 1 ? (openBlock(), createBlock("div", {
                  key: 6,
                  class: "text-center mt-3 text-xs text-gray-400 dark:text-gray-500"
                }, " Halaman " + toDisplayString(currentPage.value) + " dari " + toDisplayString(totalPages.value) + " (" + toDisplayString(filteredSoal.value.length) + " quiz) ", 1)) : createCommentVNode("", true),
                createVNode(unref(Link), {
                  href: "/guru/soal/create",
                  class: "sm:hidden fixed bottom-6 right-5 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl active:scale-95 transition"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" + Quiz Baru ")
                  ]),
                  _: 1
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Quiz/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
