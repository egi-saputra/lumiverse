import { ref, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Head, Link } from "@inertiajs/vue3";
import { ArrowLeftIcon, PlusIcon, ArrowDownTrayIcon, TrashIcon } from "@heroicons/vue/24/solid";
import axios from "axios";
import Swal from "sweetalert2";
import "./Sidebar-COsy3wF2.js";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    soal: Object
  },
  setup(__props) {
    const props = __props;
    const deletingId = ref(null);
    const isDeletingAll = ref(false);
    const isExporting = ref(false);
    async function exportSoal() {
      if (!props.soal.bank_soal?.length) return;
      isExporting.value = true;
      try {
        const response = await axios.get(
          `/proktor/bank-soal/soal/${props.soal.id}/export`,
          { responseType: "blob" }
        );
        const disposition = response.headers["content-disposition"] ?? "";
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        const filename = match ? match[1].replace(/['"]/g, "") : `soal_${props.soal.token}.xlsx`;
        const url = URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Export Failed",
          text: "Failed to export questions. Please try again.",
          confirmButtonColor: "#ef4444"
        });
      } finally {
        isExporting.value = false;
      }
    }
    const getJawaban = (item) => item.jawaban_benar || "Belum ada kunci jawaban.";
    const jawabанLabel = (item) => {
      if (item.tipe_soal !== "PG" || !item.jawaban_benar) return getJawaban(item);
      const map = { opsi_a: "A", opsi_b: "B", opsi_c: "C", opsi_d: "D", opsi_e: "E" };
      const label = map[item.jawaban_benar];
      const text = item[item.jawaban_benar];
      return label ? `${label}. ${text ?? ""}` : item.jawaban_benar;
    };
    async function confirmDeleteItem(id) {
      const result = await Swal.fire({
        title: "Hapus soal ini?",
        text: "Tindakan ini tidak dapat dibatalkan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal"
      });
      if (!result.isConfirmed) return;
      deletingId.value = id;
      try {
        const res = await axios.delete(`/proktor/bank-soal/${id}`);
        const idx = props.soal.bank_soal.findIndex((s) => s.id === id);
        if (idx !== -1) props.soal.bank_soal.splice(idx, 1);
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: res.data.success || "Soal berhasil dihapus.",
          timer: 1800,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.response?.data?.message || "Gagal menghapus soal.",
          confirmButtonColor: "#ef4444"
        });
      } finally {
        deletingId.value = null;
      }
    }
    async function confirmDeleteAll() {
      const result = await Swal.fire({
        title: "Hapus semua soal?",
        text: "Seluruh soal pada quiz ini akan dihapus permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, hapus semua",
        cancelButtonText: "Batal"
      });
      if (!result.isConfirmed) return;
      isDeletingAll.value = true;
      try {
        const res = await axios.delete(`/proktor/bank-soal/soal/${props.soal.id}/delete-all`);
        props.soal.bank_soal.splice(0);
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: res.data.success || "Semua soal berhasil dihapus.",
          timer: 1800,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.response?.data?.message || "Gagal menghapus semua soal.",
          confirmButtonColor: "#ef4444"
        });
      } finally {
        isDeletingAll.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Detail Quiz" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="text-xl font-semibold text-gray-800 dark:text-slate-100"${_scopeId}> Detail Quiz </h2>`);
          } else {
            return [
              createVNode("h2", { class: "text-xl font-semibold text-gray-800 dark:text-slate-100" }, " Detail Quiz ")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-3"${_scopeId}><div class="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"${_scopeId}><p class="text-xs text-gray-400 dark:text-slate-500 mb-1"${_scopeId}>Token Quiz</p><p class="text-lg font-bold tracking-widest text-indigo-600 dark:text-indigo-400"${_scopeId}>${ssrInterpolate(__props.soal.token)}</p></div><div class="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"${_scopeId}><p class="text-xs text-gray-400 dark:text-slate-500 mb-1"${_scopeId}>Status</p><span class="${ssrRenderClass([__props.soal.status === "Aktif" ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400", "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"])}"${_scopeId}><span class="${ssrRenderClass([__props.soal.status === "Aktif" ? "bg-green-500" : "bg-gray-400", "w-1.5 h-1.5 rounded-full"])}"${_scopeId}></span> ${ssrInterpolate(__props.soal.status)}</span></div><div class="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"${_scopeId}><p class="text-xs text-gray-400 dark:text-slate-500 mb-1"${_scopeId}>Format</p><p class="font-semibold text-gray-800 dark:text-slate-200"${_scopeId}>${ssrInterpolate(__props.soal.tipe_soal)}</p></div><div class="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"${_scopeId}><p class="text-xs text-gray-400 dark:text-slate-500 mb-1"${_scopeId}>Durasi</p><p class="font-semibold text-gray-800 dark:text-slate-200"${_scopeId}>${ssrInterpolate(__props.soal.waktu)} menit</p></div><div class="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"${_scopeId}><p class="text-xs text-gray-400 dark:text-slate-500 mb-1"${_scopeId}>Mata Pelajaran</p><p class="font-semibold text-gray-800 dark:text-slate-200"${_scopeId}>${ssrInterpolate(__props.soal.mapel?.mapel ?? "-")}</p></div><div class="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"${_scopeId}><p class="text-xs text-gray-400 dark:text-slate-500 mb-1"${_scopeId}>Kelas</p><p class="font-semibold text-gray-800 dark:text-slate-200"${_scopeId}>${ssrInterpolate(__props.soal.kelas)}</p></div></div><div class="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/proktor/soal",
              class: "hidden md:inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                  _push3(` Kembali `);
                } else {
                  return [
                    createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Kembali ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span class="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300"${_scopeId}>${ssrInterpolate(__props.soal.bank_soal?.length ?? 0)} SOAL </span></div><div class="flex gap-2 w-full sm:w-auto"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/proktor/bank-soal/create?soal_id=${__props.soal.id}`,
              class: "flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(PlusIcon), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                  _push3(` Tambah Soal `);
                } else {
                  return [
                    createVNode(unref(PlusIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Tambah Soal ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button${ssrIncludeBooleanAttr(isExporting.value || !__props.soal.bank_soal?.length) ? " disabled" : ""} class="flex-1 sm:flex-none sm:inline-flex hidden items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"${_scopeId}>`);
            if (isExporting.value) {
              _push2(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(ArrowDownTrayIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            }
            _push2(` Download </button><button${ssrIncludeBooleanAttr(isDeletingAll.value || !__props.soal.bank_soal?.length) ? " disabled" : ""} class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"${_scopeId}>`);
            if (isDeletingAll.value) {
              _push2(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            }
            _push2(` Hapus Semua </button></div></div>`);
            if (!__props.soal.bank_soal || __props.soal.bank_soal.length === 0) {
              _push2(`<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-16 text-center"${_scopeId}><div class="rounded-full bg-gray-100 dark:bg-slate-800 p-4 mb-4"${_scopeId}><svg class="w-8 h-8 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                             M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"${_scopeId}></path></svg></div><p class="font-medium text-gray-500 dark:text-slate-400"${_scopeId}>Belum ada soal</p><p class="text-sm text-gray-400 dark:text-slate-500 mt-1"${_scopeId}> Klik &quot;Tambah Soal&quot; untuk mulai membuat soal. </p></div>`);
            } else {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.soal.bank_soal, (item, index) => {
                _push2(`<div class="group rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden"${_scopeId}><div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/60"${_scopeId}><span class="text-xs font-medium text-gray-400 dark:text-slate-500"${_scopeId}> No. ${ssrInterpolate(index + 1)}</span><span class="${ssrRenderClass([item.tipe_soal === "PG" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", "rounded-full px-2.5 py-0.5 text-xs font-semibold"])}"${_scopeId}>${ssrInterpolate(item.tipe_soal === "PG" ? "Pilihan Ganda" : "Essay")}</span></div><div class="p-4 space-y-3 flex-1"${_scopeId}><div${_scopeId}><p class="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1"${_scopeId}> Pertanyaan </p><div class="prose prose-sm max-w-none text-gray-800 dark:text-slate-200 dark:prose-invert announcement-content line-clamp-4"${_scopeId}>${item.soal ?? ""}</div></div>`);
                if (item.link_lampiran) {
                  _push2(`<div${_scopeId}>`);
                  if (item.link_lampiran_url) {
                    _push2(`<img${ssrRenderAttr("src", item.link_lampiran_url)} alt="Lampiran soal" class="rounded-lg border border-gray-200 dark:border-slate-700 max-h-40 object-cover w-full"${_scopeId}>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (item.tipe_soal === "PG") {
                  _push2(`<div class="space-y-1.5 text-sm"${_scopeId}><p class="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1"${_scopeId}> Pilihan Jawaban </p><!--[-->`);
                  ssrRenderList(["a", "b", "c", "d", "e"], (key) => {
                    _push2(`<!--[-->`);
                    if (item["opsi_" + key]) {
                      _push2(`<div class="${ssrRenderClass([item.jawaban_benar === "opsi_" + key ? "bg-green-50 dark:bg-green-500/10" : "bg-gray-50 dark:bg-slate-800/50", "flex items-start gap-2 rounded-lg px-2.5 py-1.5 transition-colors"])}"${_scopeId}><span class="${ssrRenderClass([item.jawaban_benar === "opsi_" + key ? "bg-green-100 border-green-300 text-green-700 dark:bg-green-500/20 dark:border-green-500/40 dark:text-green-400" : "bg-white border-gray-200 text-gray-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400", "w-5 h-5 rounded-full shrink-0 text-xs font-bold flex items-center justify-center border mt-0.5"])}"${_scopeId}>${ssrInterpolate(key.toUpperCase())}</span><span class="${ssrRenderClass(item.jawaban_benar === "opsi_" + key ? "font-semibold text-green-700 dark:text-green-400" : "text-gray-700 dark:text-slate-300")}"${_scopeId}>${ssrInterpolate(item["opsi_" + key])}</span>`);
                      if (item.jawaban_benar === "opsi_" + key) {
                        _push2(`<span class="ml-auto text-xs font-semibold text-green-600 dark:text-green-400 shrink-0 flex items-center gap-1"${_scopeId}><svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"${_scopeId}></path></svg> Benar </span>`);
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(`</div>`);
                    } else {
                      _push2(`<div class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800/30 opacity-40"${_scopeId}><span class="w-5 h-5 rounded-full shrink-0 text-xs font-bold flex items-center justify-center border bg-white border-gray-200 text-gray-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-500"${_scopeId}>${ssrInterpolate(key.toUpperCase())}</span><span class="text-xs text-gray-400 dark:text-slate-500 italic"${_scopeId}> Opsi ${ssrInterpolate(key.toUpperCase())} belum diisi </span></div>`);
                    }
                    _push2(`<!--]-->`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-3 py-2"${_scopeId}><p class="text-xs font-semibold text-green-700 dark:text-green-400 mb-0.5"${_scopeId}> Kunci Jawaban </p><p class="text-sm text-green-800 dark:text-green-300"${_scopeId}>${ssrInterpolate(jawabанLabel(item))}</p></div></div><div class="flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-slate-800"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/proktor/bank-soal/${item.id}/edit`,
                  class: "flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Edit `);
                    } else {
                      return [
                        createTextVNode(" Edit ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<button${ssrIncludeBooleanAttr(deletingId.value === item.id) ? " disabled" : ""} class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"${_scopeId}>`);
                if (deletingId.value === item.id) {
                  _push2(`<svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(deletingId.value === item.id ? "Menghapus..." : "Hapus")}</button></div></div>`);
              });
              _push2(`<!--]--></div>`);
            }
          } else {
            return [
              createVNode("div", { class: "mb-8 grid grid-cols-2 sm:grid-cols-3 gap-3" }, [
                createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm" }, [
                  createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 mb-1" }, "Token Quiz"),
                  createVNode("p", { class: "text-lg font-bold tracking-widest text-indigo-600 dark:text-indigo-400" }, toDisplayString(__props.soal.token), 1)
                ]),
                createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm" }, [
                  createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 mb-1" }, "Status"),
                  createVNode("span", {
                    class: ["inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", __props.soal.status === "Aktif" ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400"]
                  }, [
                    createVNode("span", {
                      class: ["w-1.5 h-1.5 rounded-full", __props.soal.status === "Aktif" ? "bg-green-500" : "bg-gray-400"]
                    }, null, 2),
                    createTextVNode(" " + toDisplayString(__props.soal.status), 1)
                  ], 2)
                ]),
                createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm" }, [
                  createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 mb-1" }, "Format"),
                  createVNode("p", { class: "font-semibold text-gray-800 dark:text-slate-200" }, toDisplayString(__props.soal.tipe_soal), 1)
                ]),
                createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm" }, [
                  createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 mb-1" }, "Durasi"),
                  createVNode("p", { class: "font-semibold text-gray-800 dark:text-slate-200" }, toDisplayString(__props.soal.waktu) + " menit", 1)
                ]),
                createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm" }, [
                  createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 mb-1" }, "Mata Pelajaran"),
                  createVNode("p", { class: "font-semibold text-gray-800 dark:text-slate-200" }, toDisplayString(__props.soal.mapel?.mapel ?? "-"), 1)
                ]),
                createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm" }, [
                  createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 mb-1" }, "Kelas"),
                  createVNode("p", { class: "font-semibold text-gray-800 dark:text-slate-200" }, toDisplayString(__props.soal.kelas), 1)
                ])
              ]),
              createVNode("div", { class: "mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" }, [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(unref(Link), {
                    href: "/proktor/soal",
                    class: "hidden md:inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Kembali ")
                    ]),
                    _: 1
                  }),
                  createVNode("span", { class: "hidden md:inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300" }, toDisplayString(__props.soal.bank_soal?.length ?? 0) + " SOAL ", 1)
                ]),
                createVNode("div", { class: "flex gap-2 w-full sm:w-auto" }, [
                  createVNode(unref(Link), {
                    href: `/proktor/bank-soal/create?soal_id=${__props.soal.id}`,
                    class: "flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(PlusIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Tambah Soal ")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode("button", {
                    onClick: exportSoal,
                    disabled: isExporting.value || !__props.soal.bank_soal?.length,
                    class: "flex-1 sm:flex-none sm:inline-flex hidden items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  }, [
                    isExporting.value ? (openBlock(), createBlock("svg", {
                      key: 0,
                      class: "w-4 h-4 animate-spin",
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
                      class: "w-4 h-4"
                    })),
                    createTextVNode(" Download ")
                  ], 8, ["disabled"]),
                  createVNode("button", {
                    onClick: confirmDeleteAll,
                    disabled: isDeletingAll.value || !__props.soal.bank_soal?.length,
                    class: "flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  }, [
                    isDeletingAll.value ? (openBlock(), createBlock("svg", {
                      key: 0,
                      class: "w-4 h-4 animate-spin",
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
                    ])) : (openBlock(), createBlock(unref(TrashIcon), {
                      key: 1,
                      class: "w-4 h-4"
                    })),
                    createTextVNode(" Hapus Semua ")
                  ], 8, ["disabled"])
                ])
              ]),
              !__props.soal.bank_soal || __props.soal.bank_soal.length === 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-16 text-center"
              }, [
                createVNode("div", { class: "rounded-full bg-gray-100 dark:bg-slate-800 p-4 mb-4" }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-8 h-8 text-gray-400 dark:text-slate-500",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "1.5",
                      d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2\n                             M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    })
                  ]))
                ]),
                createVNode("p", { class: "font-medium text-gray-500 dark:text-slate-400" }, "Belum ada soal"),
                createVNode("p", { class: "text-sm text-gray-400 dark:text-slate-500 mt-1" }, ' Klik "Tambah Soal" untuk mulai membuat soal. ')
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "grid grid-cols-1 md:grid-cols-2 gap-4"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.soal.bank_soal, (item, index) => {
                  return openBlock(), createBlock("div", {
                    key: item.id,
                    class: "group rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/60" }, [
                      createVNode("span", { class: "text-xs font-medium text-gray-400 dark:text-slate-500" }, " No. " + toDisplayString(index + 1), 1),
                      createVNode("span", {
                        class: ["rounded-full px-2.5 py-0.5 text-xs font-semibold", item.tipe_soal === "PG" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"]
                      }, toDisplayString(item.tipe_soal === "PG" ? "Pilihan Ganda" : "Essay"), 3)
                    ]),
                    createVNode("div", { class: "p-4 space-y-3 flex-1" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1" }, " Pertanyaan "),
                        createVNode("div", {
                          innerHTML: item.soal,
                          class: "prose prose-sm max-w-none text-gray-800 dark:text-slate-200 dark:prose-invert announcement-content line-clamp-4"
                        }, null, 8, ["innerHTML"])
                      ]),
                      item.link_lampiran ? (openBlock(), createBlock("div", { key: 0 }, [
                        item.link_lampiran_url ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: item.link_lampiran_url,
                          alt: "Lampiran soal",
                          class: "rounded-lg border border-gray-200 dark:border-slate-700 max-h-40 object-cover w-full"
                        }, null, 8, ["src"])) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true),
                      item.tipe_soal === "PG" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "space-y-1.5 text-sm"
                      }, [
                        createVNode("p", { class: "text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1" }, " Pilihan Jawaban "),
                        (openBlock(), createBlock(Fragment, null, renderList(["a", "b", "c", "d", "e"], (key) => {
                          return openBlock(), createBlock(Fragment, { key }, [
                            item["opsi_" + key] ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: ["flex items-start gap-2 rounded-lg px-2.5 py-1.5 transition-colors", item.jawaban_benar === "opsi_" + key ? "bg-green-50 dark:bg-green-500/10" : "bg-gray-50 dark:bg-slate-800/50"]
                            }, [
                              createVNode("span", {
                                class: ["w-5 h-5 rounded-full shrink-0 text-xs font-bold flex items-center justify-center border mt-0.5", item.jawaban_benar === "opsi_" + key ? "bg-green-100 border-green-300 text-green-700 dark:bg-green-500/20 dark:border-green-500/40 dark:text-green-400" : "bg-white border-gray-200 text-gray-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400"]
                              }, toDisplayString(key.toUpperCase()), 3),
                              createVNode("span", {
                                class: item.jawaban_benar === "opsi_" + key ? "font-semibold text-green-700 dark:text-green-400" : "text-gray-700 dark:text-slate-300"
                              }, toDisplayString(item["opsi_" + key]), 3),
                              item.jawaban_benar === "opsi_" + key ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "ml-auto text-xs font-semibold text-green-600 dark:text-green-400 shrink-0 flex items-center gap-1"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-3.5 h-3.5",
                                  fill: "currentColor",
                                  viewBox: "0 0 20 20"
                                }, [
                                  createVNode("path", {
                                    "fill-rule": "evenodd",
                                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                    "clip-rule": "evenodd"
                                  })
                                ])),
                                createTextVNode(" Benar ")
                              ])) : createCommentVNode("", true)
                            ], 2)) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex items-center gap-2 rounded-lg px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800/30 opacity-40"
                            }, [
                              createVNode("span", { class: "w-5 h-5 rounded-full shrink-0 text-xs font-bold flex items-center justify-center border bg-white border-gray-200 text-gray-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-500" }, toDisplayString(key.toUpperCase()), 1),
                              createVNode("span", { class: "text-xs text-gray-400 dark:text-slate-500 italic" }, " Opsi " + toDisplayString(key.toUpperCase()) + " belum diisi ", 1)
                            ]))
                          ], 64);
                        }), 64))
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-3 py-2" }, [
                        createVNode("p", { class: "text-xs font-semibold text-green-700 dark:text-green-400 mb-0.5" }, " Kunci Jawaban "),
                        createVNode("p", { class: "text-sm text-green-800 dark:text-green-300" }, toDisplayString(jawabанLabel(item)), 1)
                      ])
                    ]),
                    createVNode("div", { class: "flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-slate-800" }, [
                      createVNode(unref(Link), {
                        href: `/proktor/bank-soal/${item.id}/edit`,
                        class: "flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Edit ")
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      createVNode("button", {
                        onClick: ($event) => confirmDeleteItem(item.id),
                        disabled: deletingId.value === item.id,
                        class: "flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      }, [
                        deletingId.value === item.id ? (openBlock(), createBlock("svg", {
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
                        ])) : createCommentVNode("", true),
                        createTextVNode(" " + toDisplayString(deletingId.value === item.id ? "Menghapus..." : "Hapus"), 1)
                      ], 8, ["onClick", "disabled"])
                    ])
                  ]);
                }), 128))
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Proktor/Soal/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
