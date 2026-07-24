import { ref, computed, withCtx, unref, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, withDirectives, vModelSelect, Fragment, renderList, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderClass, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Link, router } from "@inertiajs/vue3";
import { DocumentArrowUpIcon, XMarkIcon, ArrowDownTrayIcon, PlusIcon, CheckIcon, ArrowLeftIcon } from "@heroicons/vue/24/solid";
import axios from "axios";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import { QuillEditor } from "@vueup/vue-quill";
/* empty css                        */
import "@vueuse/core";
import "@heroicons/vue/24/outline";
import "sweetalert2";
import "ziggy-js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: { soal_id: [Number, String] },
  setup(__props) {
    const { success, error } = ToastAlert();
    const props = __props;
    const form = ref({
      soal_id: Number(props.soal_id),
      soal: "",
      tipe_soal: "PG",
      jenis_lampiran: "Tanpa Lampiran",
      lampiran_file: null,
      opsi_a: "",
      opsi_b: "",
      opsi_c: "",
      opsi_d: "",
      opsi_e: "",
      jawaban_benar: "",
      nilai: 0,
      excel: null
    });
    const isSubmitting = ref(false);
    const isImporting = ref(false);
    const opsiState = ref(["a"]);
    const fileInputRef = ref(null);
    const opsiFiles = ref({});
    const opsiPreviews = ref({});
    function addOpsi() {
      if (opsiState.value.length < 5) {
        opsiState.value.push(String.fromCharCode(97 + opsiState.value.length));
      }
    }
    function removeOpsi() {
      if (opsiState.value.length > 1) {
        const lastKey = opsiState.value.pop();
        form.value["opsi_" + lastKey] = "";
        if (opsiPreviews.value[lastKey]) URL.revokeObjectURL(opsiPreviews.value[lastKey]);
        delete opsiFiles.value[lastKey];
        delete opsiPreviews.value[lastKey];
      }
    }
    function handleFile(event) {
      form.value.lampiran_file = event.target.files[0] || null;
    }
    function handleOpsiFile(event, key) {
      const file = event.target.files[0];
      if (!file) return;
      if (opsiPreviews.value[key]) URL.revokeObjectURL(opsiPreviews.value[key]);
      opsiFiles.value[key] = file;
      opsiPreviews.value[key] = URL.createObjectURL(file);
    }
    async function submitManual() {
      if (form.value.jenis_lampiran === "Gambar" && !form.value.lampiran_file) {
        return error("Please upload an image file first!");
      }
      const data = new FormData();
      Object.entries(form.value).forEach(([key, val]) => {
        if (key === "lampiran_file") {
          if (form.value.jenis_lampiran === "Gambar" && val) data.append(key, val);
        } else if (key !== "excel") {
          data.append(key, val ?? "");
        }
      });
      Object.entries(opsiFiles.value).forEach(([key, file]) => {
        data.append(`opsi_${key}_file`, file);
      });
      isSubmitting.value = true;
      try {
        const res = await axios.post("/guru/bank-soal", data);
        success(res.data.success || "Question successfully added.");
        router.visit(res.data.redirect || `/guru/soal/${props.soal_id}`, {
          only: ["soal"],
          preserveScroll: true
        });
      } catch (err) {
        const msg = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join("\n") : err.response?.data?.message || "An error occurred while saving the question.";
        error(msg);
      } finally {
        isSubmitting.value = false;
      }
    }
    function importExcel(event) {
      form.value.excel = event.target.files[0] || null;
    }
    async function submitExcel() {
      if (!form.value.excel) return;
      const data = new FormData();
      data.append("excel", form.value.excel);
      data.append("soal_id", props.soal_id);
      isImporting.value = true;
      try {
        const res = await axios.post("/guru/bank-soal/import", data);
        success(res.data.success);
        router.visit(res.data.redirect || `/guru/soal/${props.soal_id}`, {
          only: ["soal"],
          preserveScroll: true
        });
      } catch (err) {
        const msg = err.response?.data?.message || "An error occurred while importing.";
        error(msg);
      } finally {
        isImporting.value = false;
      }
    }
    function clearExcel() {
      form.value.excel = null;
      if (fileInputRef.value) fileInputRef.value.value = "";
    }
    function downloadTemplate() {
      window.location.href = "/guru/bank-soal/template";
    }
    const isManualDisabled = computed(() => !!form.value.excel);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-50 dark:bg-slate-950"${_scopeId}><div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden"${_scopeId}><div class="border-b border-gray-200 dark:border-slate-800 px-6 py-5"${_scopeId}><h1 class="text-xl font-semibold text-gray-900 dark:text-slate-100"${_scopeId}> Add Quiz Question </h1><p class="mt-1 text-sm text-gray-500 dark:text-slate-400"${_scopeId}> Fill in the form below or import from an Excel file. </p></div><div class="px-6 py-6 space-y-6"${_scopeId}><div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/50 p-5"${_scopeId}><div class="flex flex-col items-center gap-3"${_scopeId}><div class="rounded-full bg-blue-50 dark:bg-blue-500/10 p-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DocumentArrowUpIcon), { class: "w-7 h-7 text-blue-500" }, null, _parent2, _scopeId));
            _push2(`</div><div class="text-center"${_scopeId}><p class="font-medium text-gray-700 dark:text-slate-200"${_scopeId}> Import Questions from Excel </p><p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5"${_scopeId}> Format: .xlsx / .xls </p></div><label class="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"${_scopeId}> Choose File <input type="file" accept=".xlsx,.xls" class="hidden"${_scopeId}></label>`);
            if (form.value.excel) {
              _push2(`<div class="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-3 py-2 text-sm text-green-700 dark:text-green-400"${_scopeId}><span class="truncate max-w-[220px]"${_scopeId}>${ssrInterpolate(form.value.excel.name)}</span><button type="button" class="ml-1 rounded-full hover:bg-green-100 dark:hover:bg-green-500/20 p-0.5 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex justify-center gap-3 mt-4"${_scopeId}><button type="button"${ssrIncludeBooleanAttr(!form.value.excel || isImporting.value) ? " disabled" : ""} class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600"${_scopeId}>`);
            if (isImporting.value) {
              _push2(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(isImporting.value ? "Importing..." : "Import Excel")}</button><button type="button" class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowDownTrayIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Download Template </button></div></div><div class="relative flex items-center gap-3"${_scopeId}><div class="flex-1 border-t border-gray-200 dark:border-slate-700"${_scopeId}></div><span class="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-widest"${_scopeId}> or fill manually </span><div class="flex-1 border-t border-gray-200 dark:border-slate-700"${_scopeId}></div></div><form class="${ssrRenderClass([{ "opacity-50 pointer-events-none": isManualDisabled.value }, "space-y-5"])}"${_scopeId}><div class="grid sm:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-slate-300"${_scopeId}> Question Type <span class="text-red-500"${_scopeId}>*</span></label><select class="w-full rounded-lg border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}><option value="PG"${ssrIncludeBooleanAttr(Array.isArray(form.value.tipe_soal) ? ssrLooseContain(form.value.tipe_soal, "PG") : ssrLooseEqual(form.value.tipe_soal, "PG")) ? " selected" : ""}${_scopeId}>Multiple Choice</option><option value="Essay"${ssrIncludeBooleanAttr(Array.isArray(form.value.tipe_soal) ? ssrLooseContain(form.value.tipe_soal, "Essay") : ssrLooseEqual(form.value.tipe_soal, "Essay")) ? " selected" : ""}${_scopeId}>Essay</option></select></div><div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-slate-300"${_scopeId}> Attachment </label><select class="w-full rounded-lg border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}><option value="Tanpa Lampiran"${ssrIncludeBooleanAttr(Array.isArray(form.value.jenis_lampiran) ? ssrLooseContain(form.value.jenis_lampiran, "Tanpa Lampiran") : ssrLooseEqual(form.value.jenis_lampiran, "Tanpa Lampiran")) ? " selected" : ""}${_scopeId}>No Attachment</option><option value="Gambar"${ssrIncludeBooleanAttr(Array.isArray(form.value.jenis_lampiran) ? ssrLooseContain(form.value.jenis_lampiran, "Gambar") : ssrLooseEqual(form.value.jenis_lampiran, "Gambar")) ? " selected" : ""}${_scopeId}>Image</option></select></div></div>`);
            if (form.value.jenis_lampiran === "Gambar") {
              _push2(`<div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-slate-300"${_scopeId}> Upload Image </label><input type="file" accept="image/*" class="w-full rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-medium dark:file:bg-blue-500/10 dark:file:text-blue-400 transition"${_scopeId}>`);
              if (form.value.lampiran_file) {
                _push2(`<p class="text-xs text-green-600 dark:text-green-400"${_scopeId}> ✓ ${ssrInterpolate(form.value.lampiran_file.name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-slate-300"${_scopeId}> Question <span class="text-red-500"${_scopeId}>*</span></label><div class="rounded-xl overflow-hidden border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(QuillEditor), {
              content: form.value.soal,
              "onUpdate:content": ($event) => form.value.soal = $event,
              placeholder: "Type the question here...",
              "content-type": "html",
              theme: "snow",
              class: "announcement-editor",
              toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["clean"]
              ]
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex justify-end border-t border-gray-200 dark:border-slate-700"${_scopeId}><span class="px-3 py-2 text-xs text-gray-400 dark:text-slate-500"${_scopeId}> Powered by <strong class="pl-1 tracking-widest text-gray-600 dark:text-slate-300"${_scopeId}> Lumiverse </strong></span></div></div></div>`);
            if (form.value.tipe_soal === "PG") {
              _push2(`<div class="space-y-3"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-slate-300"${_scopeId}> Answer Options </label><div class="flex gap-2"${_scopeId}>`);
              if (opsiState.value.length > 1) {
                _push2(`<button type="button" class="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-3 h-3" }, null, _parent2, _scopeId));
                _push2(` Remove </button>`);
              } else {
                _push2(`<!---->`);
              }
              if (opsiState.value.length < 5) {
                _push2(`<button type="button" class="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(PlusIcon), { class: "w-3 h-3" }, null, _parent2, _scopeId));
                _push2(` Add </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="grid md:grid-cols-2 gap-3"${_scopeId}><!--[-->`);
              ssrRenderList(opsiState.value, (key) => {
                _push2(`<div class="space-y-2"${_scopeId}><label class="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide"${_scopeId}> Option ${ssrInterpolate(key.toUpperCase())}</label><input${ssrRenderAttr("value", form.value["opsi_" + key])}${ssrRenderAttr("placeholder", `Enter option ${key.toUpperCase()}`)} class="w-full rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 dark:placeholder-slate-500"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><label${ssrRenderAttr("for", `opsi_${key}_file`)} class="cursor-pointer inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition"${_scopeId}> 📷 Image (optional) </label><input${ssrRenderAttr("id", `opsi_${key}_file`)} type="file" accept="image/*" class="hidden"${_scopeId}>`);
                if (opsiFiles.value[key]) {
                  _push2(`<span class="text-xs text-green-600 dark:text-green-400 truncate max-w-[120px]"${_scopeId}>${ssrInterpolate(opsiFiles.value[key].name)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (opsiPreviews.value[key]) {
                  _push2(`<img${ssrRenderAttr("src", opsiPreviews.value[key])} class="h-20 rounded-lg object-cover border border-gray-200 dark:border-slate-700"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="grid sm:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-slate-300"${_scopeId}> Correct Answer </label>`);
            if (form.value.tipe_soal === "Essay") {
              _push2(`<textarea rows="3" placeholder="Essay answer key" class="w-full rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}>${ssrInterpolate(form.value.jawaban_benar)}</textarea>`);
            } else {
              _push2(`<select class="w-full rounded-lg border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.value.jawaban_benar) ? ssrLooseContain(form.value.jawaban_benar, "") : ssrLooseEqual(form.value.jawaban_benar, "")) ? " selected" : ""}${_scopeId}>-- Select correct answer --</option><!--[-->`);
              ssrRenderList(opsiState.value, (key) => {
                _push2(`<option${ssrRenderAttr("value", "opsi_" + key)}${ssrIncludeBooleanAttr(Array.isArray(form.value.jawaban_benar) ? ssrLooseContain(form.value.jawaban_benar, "opsi_" + key) : ssrLooseEqual(form.value.jawaban_benar, "opsi_" + key)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(key.toUpperCase())}. ${ssrInterpolate(form.value["opsi_" + key] || "(empty)")}</option>`);
              });
              _push2(`<!--]--></select>`);
            }
            _push2(`</div><div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-slate-300"${_scopeId}> Score Weight <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", form.value.nilai)} type="number" min="0" placeholder="0" class="w-full rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}></div></div><div class="flex flex-col sm:flex-row gap-3 pt-2"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"${_scopeId}>`);
            if (isSubmitting.value) {
              _push2(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(CheckIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            }
            _push2(` ${ssrInterpolate(isSubmitting.value ? "Saving..." : "Create Question")}</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/guru/soal/${props.soal_id}`,
              class: "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                  _push3(` Cancel `);
                } else {
                  return [
                    createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-gray-50 dark:bg-slate-950" }, [
                createVNode("div", { class: "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden" }, [
                  createVNode("div", { class: "border-b border-gray-200 dark:border-slate-800 px-6 py-5" }, [
                    createVNode("h1", { class: "text-xl font-semibold text-gray-900 dark:text-slate-100" }, " Add Quiz Question "),
                    createVNode("p", { class: "mt-1 text-sm text-gray-500 dark:text-slate-400" }, " Fill in the form below or import from an Excel file. ")
                  ]),
                  createVNode("div", { class: "px-6 py-6 space-y-6" }, [
                    createVNode("div", { class: "rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/50 p-5" }, [
                      createVNode("div", { class: "flex flex-col items-center gap-3" }, [
                        createVNode("div", { class: "rounded-full bg-blue-50 dark:bg-blue-500/10 p-3" }, [
                          createVNode(unref(DocumentArrowUpIcon), { class: "w-7 h-7 text-blue-500" })
                        ]),
                        createVNode("div", { class: "text-center" }, [
                          createVNode("p", { class: "font-medium text-gray-700 dark:text-slate-200" }, " Import Questions from Excel "),
                          createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 mt-0.5" }, " Format: .xlsx / .xls ")
                        ]),
                        createVNode("label", { class: "cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors" }, [
                          createTextVNode(" Choose File "),
                          createVNode("input", {
                            ref_key: "fileInputRef",
                            ref: fileInputRef,
                            type: "file",
                            accept: ".xlsx,.xls",
                            onChange: importExcel,
                            class: "hidden"
                          }, null, 544)
                        ]),
                        form.value.excel ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-3 py-2 text-sm text-green-700 dark:text-green-400"
                        }, [
                          createVNode("span", { class: "truncate max-w-[220px]" }, toDisplayString(form.value.excel.name), 1),
                          createVNode("button", {
                            type: "button",
                            onClick: clearExcel,
                            class: "ml-1 rounded-full hover:bg-green-100 dark:hover:bg-green-500/20 p-0.5 transition"
                          }, [
                            createVNode(unref(XMarkIcon), { class: "w-3.5 h-3.5" })
                          ])
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex justify-center gap-3 mt-4" }, [
                        createVNode("button", {
                          type: "button",
                          onClick: submitExcel,
                          disabled: !form.value.excel || isImporting.value,
                          class: "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600"
                        }, [
                          isImporting.value ? (openBlock(), createBlock("svg", {
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
                          ])) : createCommentVNode("", true),
                          createTextVNode(" " + toDisplayString(isImporting.value ? "Importing..." : "Import Excel"), 1)
                        ], 8, ["disabled"]),
                        createVNode("button", {
                          type: "button",
                          onClick: downloadTemplate,
                          class: "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        }, [
                          createVNode(unref(ArrowDownTrayIcon), { class: "w-4 h-4" }),
                          createTextVNode(" Download Template ")
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "relative flex items-center gap-3" }, [
                      createVNode("div", { class: "flex-1 border-t border-gray-200 dark:border-slate-700" }),
                      createVNode("span", { class: "text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-widest" }, " or fill manually "),
                      createVNode("div", { class: "flex-1 border-t border-gray-200 dark:border-slate-700" })
                    ]),
                    createVNode("form", {
                      onSubmit: withModifiers(submitManual, ["prevent"]),
                      class: ["space-y-5", { "opacity-50 pointer-events-none": isManualDisabled.value }]
                    }, [
                      createVNode("div", { class: "grid sm:grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-slate-300" }, [
                            createTextVNode(" Question Type "),
                            createVNode("span", { class: "text-red-500" }, "*")
                          ]),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => form.value.tipe_soal = $event,
                            class: "w-full rounded-lg border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          }, [
                            createVNode("option", { value: "PG" }, "Multiple Choice"),
                            createVNode("option", { value: "Essay" }, "Essay")
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, form.value.tipe_soal]
                          ])
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-slate-300" }, " Attachment "),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => form.value.jenis_lampiran = $event,
                            class: "w-full rounded-lg border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          }, [
                            createVNode("option", { value: "Tanpa Lampiran" }, "No Attachment"),
                            createVNode("option", { value: "Gambar" }, "Image")
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, form.value.jenis_lampiran]
                          ])
                        ])
                      ]),
                      form.value.jenis_lampiran === "Gambar" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-1.5"
                      }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-slate-300" }, " Upload Image "),
                        createVNode("input", {
                          type: "file",
                          accept: "image/*",
                          onChange: handleFile,
                          class: "w-full rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-medium dark:file:bg-blue-500/10 dark:file:text-blue-400 transition"
                        }, null, 32),
                        form.value.lampiran_file ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-xs text-green-600 dark:text-green-400"
                        }, " ✓ " + toDisplayString(form.value.lampiran_file.name), 1)) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "space-y-1.5" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-slate-300" }, [
                          createTextVNode(" Question "),
                          createVNode("span", { class: "text-red-500" }, "*")
                        ]),
                        createVNode("div", { class: "rounded-xl overflow-hidden border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm" }, [
                          createVNode(unref(QuillEditor), {
                            content: form.value.soal,
                            "onUpdate:content": ($event) => form.value.soal = $event,
                            placeholder: "Type the question here...",
                            "content-type": "html",
                            theme: "snow",
                            class: "announcement-editor",
                            toolbar: [
                              ["bold", "italic", "underline"],
                              [{ list: "ordered" }, { list: "bullet" }],
                              [{ align: [] }],
                              ["clean"]
                            ]
                          }, null, 8, ["content", "onUpdate:content"]),
                          createVNode("div", { class: "flex justify-end border-t border-gray-200 dark:border-slate-700" }, [
                            createVNode("span", { class: "px-3 py-2 text-xs text-gray-400 dark:text-slate-500" }, [
                              createTextVNode(" Powered by "),
                              createVNode("strong", { class: "pl-1 tracking-widest text-gray-600 dark:text-slate-300" }, " Lumiverse ")
                            ])
                          ])
                        ])
                      ]),
                      form.value.tipe_soal === "PG" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "space-y-3"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-slate-300" }, " Answer Options "),
                          createVNode("div", { class: "flex gap-2" }, [
                            opsiState.value.length > 1 ? (openBlock(), createBlock("button", {
                              key: 0,
                              type: "button",
                              onClick: removeOpsi,
                              class: "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                            }, [
                              createVNode(unref(XMarkIcon), { class: "w-3 h-3" }),
                              createTextVNode(" Remove ")
                            ])) : createCommentVNode("", true),
                            opsiState.value.length < 5 ? (openBlock(), createBlock("button", {
                              key: 1,
                              type: "button",
                              onClick: addOpsi,
                              class: "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                            }, [
                              createVNode(unref(PlusIcon), { class: "w-3 h-3" }),
                              createTextVNode(" Add ")
                            ])) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "grid md:grid-cols-2 gap-3" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(opsiState.value, (key) => {
                            return openBlock(), createBlock("div", {
                              key,
                              class: "space-y-2"
                            }, [
                              createVNode("label", { class: "text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide" }, " Option " + toDisplayString(key.toUpperCase()), 1),
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => form.value["opsi_" + key] = $event,
                                placeholder: `Enter option ${key.toUpperCase()}`,
                                class: "w-full rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 dark:placeholder-slate-500"
                              }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                                [vModelText, form.value["opsi_" + key]]
                              ]),
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("label", {
                                  for: `opsi_${key}_file`,
                                  class: "cursor-pointer inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                                }, " 📷 Image (optional) ", 8, ["for"]),
                                createVNode("input", {
                                  id: `opsi_${key}_file`,
                                  type: "file",
                                  accept: "image/*",
                                  onChange: ($event) => handleOpsiFile($event, key),
                                  class: "hidden"
                                }, null, 40, ["id", "onChange"]),
                                opsiFiles.value[key] ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "text-xs text-green-600 dark:text-green-400 truncate max-w-[120px]"
                                }, toDisplayString(opsiFiles.value[key].name), 1)) : createCommentVNode("", true)
                              ]),
                              opsiPreviews.value[key] ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: opsiPreviews.value[key],
                                class: "h-20 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                              }, null, 8, ["src"])) : createCommentVNode("", true)
                            ]);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "grid sm:grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-slate-300" }, " Correct Answer "),
                          form.value.tipe_soal === "Essay" ? withDirectives((openBlock(), createBlock("textarea", {
                            key: 0,
                            "onUpdate:modelValue": ($event) => form.value.jawaban_benar = $event,
                            rows: "3",
                            placeholder: "Essay answer key",
                            class: "w-full rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          }, null, 8, ["onUpdate:modelValue"])), [
                            [vModelText, form.value.jawaban_benar]
                          ]) : withDirectives((openBlock(), createBlock("select", {
                            key: 1,
                            "onUpdate:modelValue": ($event) => form.value.jawaban_benar = $event,
                            class: "w-full rounded-lg border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          }, [
                            createVNode("option", { value: "" }, "-- Select correct answer --"),
                            (openBlock(true), createBlock(Fragment, null, renderList(opsiState.value, (key) => {
                              return openBlock(), createBlock("option", {
                                key,
                                value: "opsi_" + key
                              }, toDisplayString(key.toUpperCase()) + ". " + toDisplayString(form.value["opsi_" + key] || "(empty)"), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue"])), [
                            [vModelSelect, form.value.jawaban_benar]
                          ])
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-slate-300" }, [
                            createTextVNode(" Score Weight "),
                            createVNode("span", { class: "text-red-500" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => form.value.nilai = $event,
                            type: "number",
                            min: "0",
                            placeholder: "0",
                            class: "w-full rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, form.value.nilai]
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "flex flex-col sm:flex-row gap-3 pt-2" }, [
                        createVNode("button", {
                          type: "submit",
                          disabled: isSubmitting.value,
                          class: "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                        }, [
                          isSubmitting.value ? (openBlock(), createBlock("svg", {
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
                          ])) : (openBlock(), createBlock(unref(CheckIcon), {
                            key: 1,
                            class: "w-4 h-4"
                          })),
                          createTextVNode(" " + toDisplayString(isSubmitting.value ? "Saving..." : "Create Question"), 1)
                        ], 8, ["disabled"]),
                        createVNode(unref(Link), {
                          href: `/guru/soal/${props.soal_id}`,
                          class: "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ])
                    ], 34)
                  ])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Quest/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
