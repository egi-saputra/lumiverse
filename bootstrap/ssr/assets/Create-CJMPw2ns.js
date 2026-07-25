import { ref, computed, withCtx, unref, createVNode, createTextVNode, withModifiers, openBlock, createBlock, toDisplayString, createCommentVNode, withDirectives, vModelSelect, Fragment, renderList, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderClass, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Link, router } from "@inertiajs/vue3";
import { DocumentArrowUpIcon, PlusIcon, CheckIcon, ArrowLeftIcon } from "@heroicons/vue/24/solid";
import axios from "axios";
import Swal from "sweetalert2";
import { QuillEditor } from "@vueup/vue-quill";
/* empty css                        */
import "./Sidebar-COsy3wF2.js";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: { soal_id: [Number, String] },
  setup(__props) {
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
    ref(null);
    const opsiState = ref(["a"]);
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
        return Swal.fire({ icon: "warning", title: "Belum ada gambar", text: "Silakan upload file gambar terlebih dahulu!", confirmButtonColor: "#3b82f6" });
      }
      const data = new FormData();
      data.append("soal_id", props.soal_id);
      data.append("soal", form.value.soal);
      data.append("tipe_soal", form.value.tipe_soal);
      data.append("jenis_lampiran", form.value.jenis_lampiran);
      data.append("jawaban_benar", form.value.jawaban_benar ?? "");
      data.append("nilai", form.value.nilai);
      data.append("opsi_a", form.value.opsi_a ?? "");
      data.append("opsi_b", form.value.opsi_b ?? "");
      data.append("opsi_c", form.value.opsi_c ?? "");
      data.append("opsi_d", form.value.opsi_d ?? "");
      data.append("opsi_e", form.value.opsi_e ?? "");
      if (form.value.jenis_lampiran === "Gambar" && form.value.lampiran_file) {
        data.append("lampiran_file", form.value.lampiran_file);
      }
      Object.entries(opsiFiles.value).forEach(([key, file]) => {
        data.append(`opsi_${key}_file`, file);
      });
      isSubmitting.value = true;
      try {
        const res = await axios.post("/proktor/bank-soal", data);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: res.data.success || "Soal berhasil ditambahkan.",
          confirmButtonText: "OKE",
          confirmButtonColor: "#3b82f6"
        });
        router.visit(res.data.redirect || `/proktor/soal/${props.soal_id}`);
      } catch (err) {
        const msg = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join("\n") : err.response?.data?.message || "Terjadi kesalahan saat menyimpan soal.";
        Swal.fire({ icon: "error", title: "Gagal!", text: msg, confirmButtonColor: "#ef4444" });
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
        const res = await axios.post("/proktor/bank-soal/import", data);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: res.data.success,
          confirmButtonText: "OKE",
          confirmButtonColor: "#3b82f6"
        });
        router.visit(res.data.redirect || `/proktor/soal/${props.soal_id}`);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Import Gagal", text: err.response?.data?.message || "Terjadi kesalahan saat import.", confirmButtonColor: "#ef4444" });
      } finally {
        isImporting.value = false;
      }
    }
    function downloadTemplate() {
      window.location.href = "/proktor/bank-soal/template";
    }
    const isManualDisabled = computed(() => !!form.value.excel);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto bg-gray-100 dark:bg-slate-950"${_scopeId}><form class="mx-auto space-y-5 sm:p-6 sm:bg-white sm:border sm:border-gray-300 sm:rounded-2xl sm:shadow sm:dark:bg-slate-900 sm:dark:border-slate-800"${_scopeId}><h1 class="text-2xl font-extrabold mb-6 text-gray-800 dark:text-slate-100"${_scopeId}><span class="text-3xl"${_scopeId}>+</span> Tambahkan Soal Quiz </h1><div class="border border-dashed p-4 rounded-lg text-center space-y-2 bg-gray-50 border-gray-300 dark:bg-slate-800/60 dark:border-slate-700"${_scopeId}><label class="flex flex-col items-center justify-center cursor-pointer"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DocumentArrowUpIcon), { class: "w-10 h-10 text-blue-500 mb-2" }, null, _parent2, _scopeId));
            _push2(`<span class="font-semibold mb-1 text-gray-600 dark:text-slate-200"${_scopeId}> Upload File Soal </span><span class="text-sm text-gray-400 dark:text-slate-400"${_scopeId}> (.xlsx / .xls) </span><input type="file" accept=".xlsx,.xls" class="hidden"${_scopeId}></label>`);
            if (form.value.excel) {
              _push2(`<p class="mt-2 font-medium text-green-600 dark:text-green-400"${_scopeId}>${ssrInterpolate(form.value.excel.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-center gap-2 mt-2"${_scopeId}><button type="button"${ssrIncludeBooleanAttr(!form.value.excel || isImporting.value) ? " disabled" : ""} class="${ssrRenderClass([
              "px-4 py-2 rounded-lg transition font-medium flex items-center gap-2 text-white",
              form.value.processing ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            ])}"${_scopeId}>`);
            if (isImporting.value) {
              _push2(`<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(isImporting.value ? "Importing..." : "Import Excel")}</span></button><button type="button" class="px-4 py-2 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700"${_scopeId}> Unduh Template </button></div></div><div class="grid sm:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block font-semibold mb-1 text-gray-700 dark:text-slate-200"${_scopeId}><span class="text-red-600"${_scopeId}>*</span> Tipe Soal </label><select${ssrIncludeBooleanAttr(isManualDisabled.value) ? " disabled" : ""} class="w-full p-3 rounded-lg border transition border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"${_scopeId}><option value="PG"${ssrIncludeBooleanAttr(Array.isArray(form.value.tipe_soal) ? ssrLooseContain(form.value.tipe_soal, "PG") : ssrLooseEqual(form.value.tipe_soal, "PG")) ? " selected" : ""}${_scopeId}>Pilihan Ganda</option><option value="Essay"${ssrIncludeBooleanAttr(Array.isArray(form.value.tipe_soal) ? ssrLooseContain(form.value.tipe_soal, "Essay") : ssrLooseEqual(form.value.tipe_soal, "Essay")) ? " selected" : ""}${_scopeId}>Essay</option></select></div><div${_scopeId}><label class="block font-semibold mb-1 text-gray-700 dark:text-slate-200"${_scopeId}> Jenis Lampiran </label><select${ssrIncludeBooleanAttr(isManualDisabled.value) ? " disabled" : ""} class="w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"${_scopeId}><option value="Tanpa Lampiran"${ssrIncludeBooleanAttr(Array.isArray(form.value.jenis_lampiran) ? ssrLooseContain(form.value.jenis_lampiran, "Tanpa Lampiran") : ssrLooseEqual(form.value.jenis_lampiran, "Tanpa Lampiran")) ? " selected" : ""}${_scopeId}>Tanpa Lampiran</option><option value="Gambar"${ssrIncludeBooleanAttr(Array.isArray(form.value.jenis_lampiran) ? ssrLooseContain(form.value.jenis_lampiran, "Gambar") : ssrLooseEqual(form.value.jenis_lampiran, "Gambar")) ? " selected" : ""}${_scopeId}>Gambar</option></select></div></div>`);
            if (form.value.jenis_lampiran === "Gambar") {
              _push2(`<div${_scopeId}><label class="block font-semibold mb-1 text-gray-700 dark:text-slate-200"${_scopeId}> Upload Gambar </label><input type="file" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"${_scopeId}>`);
              if (form.value.lampiran_file) {
                _push2(`<p class="mt-1 text-green-600 dark:text-green-400"${_scopeId}>${ssrInterpolate(form.value.lampiran_file.name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div${_scopeId}><label class="block font-semibold mb-1 text-gray-700 dark:text-slate-200"${_scopeId}><span class="text-red-600"${_scopeId}>*</span> Soal / Pertanyaan </label><div class="rounded-xl overflow-hidden border shadow-sm border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900"${_scopeId}>`);
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
            _push2(`<div class="flex justify-end border-t border-gray-300 dark:border-slate-700"${_scopeId}><span class="px-3 py-2 text-xs text-gray-500 dark:text-slate-400"${_scopeId}> Powered by <strong class="pl-1 tracking-widest text-gray-700 dark:text-slate-200"${_scopeId}> Lumiverse </strong></span></div></div></div>`);
            if (form.value.tipe_soal === "PG") {
              _push2(`<div class="space-y-4 pt-4"${_scopeId}><div class="flex sm:flex-row flex-col gap-3 justify-start sm:justify-between"${_scopeId}><h3 class="font-semibold text-gray-700 dark:text-gray-200"${_scopeId}>Answer Options</h3><div class="flex gap-2"${_scopeId}>`);
              if (opsiState.value.length > 1) {
                _push2(`<button type="button" class="text-red-600 btn-primary !py-1 !px-3 font-semibold flex items-center gap-1"${_scopeId}> Remove </button>`);
              } else {
                _push2(`<!---->`);
              }
              if (opsiState.value.length < 5) {
                _push2(`<button type="button" class="text-indigo-600 font-semibold btn-primary !py-1 !px-3 flex items-center gap-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(PlusIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                _push2(` Add </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="grid md:grid-cols-2 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(opsiState.value, (key) => {
                _push2(`<div class="space-y-2"${_scopeId}><label class="text-sm font-medium dark:text-gray-300"${_scopeId}> Option ${ssrInterpolate(key.toUpperCase())}</label><input${ssrRenderAttr("value", form.value["opsi_" + key])} class="form-input dark:text-gray-400 w-full" placeholder="Enter Optional Answer"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><label${ssrRenderAttr("for", `opsi_${key}_file`)} class="cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"${_scopeId}> 📷 Gambar (opsional) </label><input${ssrRenderAttr("id", `opsi_${key}_file`)} type="file" accept="image/*" class="hidden"${_scopeId}>`);
                if (opsiFiles.value[key]) {
                  _push2(`<span class="text-xs text-green-600 dark:text-green-400 truncate max-w-[120px]"${_scopeId}>${ssrInterpolate(opsiFiles.value[key].name)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (opsiPreviews.value[key]) {
                  _push2(`<img${ssrRenderAttr("src", opsiPreviews.value[key])} class="mt-1 h-20 rounded-lg object-cover border border-gray-200 dark:border-slate-700"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="grid sm:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block font-semibold mb-1 text-gray-700 dark:text-slate-200"${_scopeId}> Jawaban Benar </label>`);
            if (form.value.tipe_soal === "Essay") {
              _push2(`<input${ssrRenderAttr("value", form.value.jawaban_benar)} type="text" placeholder="Jawaban Essay"${ssrIncludeBooleanAttr(isManualDisabled.value) ? " disabled" : ""} class="w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"${_scopeId}>`);
            } else {
              _push2(`<select${ssrIncludeBooleanAttr(isManualDisabled.value) ? " disabled" : ""} class="w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"${_scopeId}><option value="opsi_a"${ssrIncludeBooleanAttr(Array.isArray(form.value.jawaban_benar) ? ssrLooseContain(form.value.jawaban_benar, "opsi_a") : ssrLooseEqual(form.value.jawaban_benar, "opsi_a")) ? " selected" : ""}${_scopeId}>A. ${ssrInterpolate(form.value.opsi_a)}</option><option value="opsi_b"${ssrIncludeBooleanAttr(Array.isArray(form.value.jawaban_benar) ? ssrLooseContain(form.value.jawaban_benar, "opsi_b") : ssrLooseEqual(form.value.jawaban_benar, "opsi_b")) ? " selected" : ""}${_scopeId}>B. ${ssrInterpolate(form.value.opsi_b)}</option><option value="opsi_c"${ssrIncludeBooleanAttr(Array.isArray(form.value.jawaban_benar) ? ssrLooseContain(form.value.jawaban_benar, "opsi_c") : ssrLooseEqual(form.value.jawaban_benar, "opsi_c")) ? " selected" : ""}${_scopeId}>C. ${ssrInterpolate(form.value.opsi_c)}</option><option value="opsi_d"${ssrIncludeBooleanAttr(Array.isArray(form.value.jawaban_benar) ? ssrLooseContain(form.value.jawaban_benar, "opsi_d") : ssrLooseEqual(form.value.jawaban_benar, "opsi_d")) ? " selected" : ""}${_scopeId}>D. ${ssrInterpolate(form.value.opsi_d)}</option><option value="opsi_e"${ssrIncludeBooleanAttr(Array.isArray(form.value.jawaban_benar) ? ssrLooseContain(form.value.jawaban_benar, "opsi_e") : ssrLooseEqual(form.value.jawaban_benar, "opsi_e")) ? " selected" : ""}${_scopeId}>E. ${ssrInterpolate(form.value.opsi_e)}</option></select>`);
            }
            _push2(`</div><div${_scopeId}><label class="block font-semibold mb-1 text-gray-700 dark:text-slate-200"${_scopeId}> Bobot Nilai </label><input${ssrRenderAttr("value", form.value.nilai)} type="number" min="0"${ssrIncludeBooleanAttr(isManualDisabled.value) ? " disabled" : ""} class="w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"${_scopeId}></div></div><div class="flex flex-col md:flex-row gap-4 mt-4"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg shadow transition"${_scopeId}>`);
            if (isSubmitting.value) {
              _push2(`<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(CheckIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(isSubmitting.value ? "Creating..." : "Create Quest")}</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/proktor/soal/${props.soal_id}`,
              class: "flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-5 h-5" }, null, _parent3, _scopeId2));
                  _push3(` Back to Quiz List `);
                } else {
                  return [
                    createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
                    createTextVNode(" Back to Quiz List ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto bg-gray-100 dark:bg-slate-950" }, [
                createVNode("form", {
                  onSubmit: withModifiers(submitManual, ["prevent"]),
                  class: "mx-auto space-y-5 sm:p-6 sm:bg-white sm:border sm:border-gray-300 sm:rounded-2xl sm:shadow sm:dark:bg-slate-900 sm:dark:border-slate-800"
                }, [
                  createVNode("h1", { class: "text-2xl font-extrabold mb-6 text-gray-800 dark:text-slate-100" }, [
                    createVNode("span", { class: "text-3xl" }, "+"),
                    createTextVNode(" Tambahkan Soal Quiz ")
                  ]),
                  createVNode("div", { class: "border border-dashed p-4 rounded-lg text-center space-y-2 bg-gray-50 border-gray-300 dark:bg-slate-800/60 dark:border-slate-700" }, [
                    createVNode("label", { class: "flex flex-col items-center justify-center cursor-pointer" }, [
                      createVNode(unref(DocumentArrowUpIcon), { class: "w-10 h-10 text-blue-500 mb-2" }),
                      createVNode("span", { class: "font-semibold mb-1 text-gray-600 dark:text-slate-200" }, " Upload File Soal "),
                      createVNode("span", { class: "text-sm text-gray-400 dark:text-slate-400" }, " (.xlsx / .xls) "),
                      createVNode("input", {
                        type: "file",
                        accept: ".xlsx,.xls",
                        onChange: importExcel,
                        class: "hidden"
                      }, null, 32)
                    ]),
                    form.value.excel ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-2 font-medium text-green-600 dark:text-green-400"
                    }, toDisplayString(form.value.excel.name), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "flex justify-center gap-2 mt-2" }, [
                      createVNode("button", {
                        type: "button",
                        onClick: submitExcel,
                        disabled: !form.value.excel || isImporting.value,
                        class: [
                          "px-4 py-2 rounded-lg transition font-medium flex items-center gap-2 text-white",
                          form.value.processing ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                        ]
                      }, [
                        isImporting.value ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "w-5 h-5 animate-spin",
                          xmlns: "http://www.w3.org/2000/svg",
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
                        createVNode("span", null, toDisplayString(isImporting.value ? "Importing..." : "Import Excel"), 1)
                      ], 10, ["disabled"]),
                      createVNode("button", {
                        type: "button",
                        onClick: downloadTemplate,
                        class: "px-4 py-2 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700"
                      }, " Unduh Template ")
                    ])
                  ]),
                  createVNode("div", { class: "grid sm:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block font-semibold mb-1 text-gray-700 dark:text-slate-200" }, [
                        createVNode("span", { class: "text-red-600" }, "*"),
                        createTextVNode(" Tipe Soal ")
                      ]),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.tipe_soal = $event,
                        disabled: isManualDisabled.value,
                        class: "w-full p-3 rounded-lg border transition border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      }, [
                        createVNode("option", { value: "PG" }, "Pilihan Ganda"),
                        createVNode("option", { value: "Essay" }, "Essay")
                      ], 8, ["onUpdate:modelValue", "disabled"]), [
                        [vModelSelect, form.value.tipe_soal]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block font-semibold mb-1 text-gray-700 dark:text-slate-200" }, " Jenis Lampiran "),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.jenis_lampiran = $event,
                        disabled: isManualDisabled.value,
                        class: "w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      }, [
                        createVNode("option", { value: "Tanpa Lampiran" }, "Tanpa Lampiran"),
                        createVNode("option", { value: "Gambar" }, "Gambar")
                      ], 8, ["onUpdate:modelValue", "disabled"]), [
                        [vModelSelect, form.value.jenis_lampiran]
                      ])
                    ])
                  ]),
                  form.value.jenis_lampiran === "Gambar" ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("label", { class: "block font-semibold mb-1 text-gray-700 dark:text-slate-200" }, " Upload Gambar "),
                    createVNode("input", {
                      type: "file",
                      onChange: handleFile,
                      class: "w-full p-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    }, null, 32),
                    form.value.lampiran_file ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-green-600 dark:text-green-400"
                    }, toDisplayString(form.value.lampiran_file.name), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  createVNode("div", null, [
                    createVNode("label", { class: "block font-semibold mb-1 text-gray-700 dark:text-slate-200" }, [
                      createVNode("span", { class: "text-red-600" }, "*"),
                      createTextVNode(" Soal / Pertanyaan ")
                    ]),
                    createVNode("div", { class: "rounded-xl overflow-hidden border shadow-sm border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900" }, [
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
                      createVNode("div", { class: "flex justify-end border-t border-gray-300 dark:border-slate-700" }, [
                        createVNode("span", { class: "px-3 py-2 text-xs text-gray-500 dark:text-slate-400" }, [
                          createTextVNode(" Powered by "),
                          createVNode("strong", { class: "pl-1 tracking-widest text-gray-700 dark:text-slate-200" }, " Lumiverse ")
                        ])
                      ])
                    ])
                  ]),
                  form.value.tipe_soal === "PG" ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "space-y-4 pt-4"
                  }, [
                    createVNode("div", { class: "flex sm:flex-row flex-col gap-3 justify-start sm:justify-between" }, [
                      createVNode("h3", { class: "font-semibold text-gray-700 dark:text-gray-200" }, "Answer Options"),
                      createVNode("div", { class: "flex gap-2" }, [
                        opsiState.value.length > 1 ? (openBlock(), createBlock("button", {
                          key: 0,
                          type: "button",
                          onClick: removeOpsi,
                          class: "text-red-600 btn-primary !py-1 !px-3 font-semibold flex items-center gap-1"
                        }, " Remove ")) : createCommentVNode("", true),
                        opsiState.value.length < 5 ? (openBlock(), createBlock("button", {
                          key: 1,
                          type: "button",
                          onClick: addOpsi,
                          class: "text-indigo-600 font-semibold btn-primary !py-1 !px-3 flex items-center gap-1"
                        }, [
                          createVNode(unref(PlusIcon), { class: "w-4 h-4" }),
                          createTextVNode(" Add ")
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(opsiState.value, (key) => {
                        return openBlock(), createBlock("div", {
                          key,
                          class: "space-y-2"
                        }, [
                          createVNode("label", { class: "text-sm font-medium dark:text-gray-300" }, " Option " + toDisplayString(key.toUpperCase()), 1),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => form.value["opsi_" + key] = $event,
                            class: "form-input dark:text-gray-400 w-full",
                            placeholder: "Enter Optional Answer"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, form.value["opsi_" + key]]
                          ]),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("label", {
                              for: `opsi_${key}_file`,
                              class: "cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                            }, " 📷 Gambar (opsional) ", 8, ["for"]),
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
                            class: "mt-1 h-20 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                          }, null, 8, ["src"])) : createCommentVNode("", true)
                        ]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "grid sm:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block font-semibold mb-1 text-gray-700 dark:text-slate-200" }, " Jawaban Benar "),
                      form.value.tipe_soal === "Essay" ? withDirectives((openBlock(), createBlock("input", {
                        key: 0,
                        "onUpdate:modelValue": ($event) => form.value.jawaban_benar = $event,
                        type: "text",
                        placeholder: "Jawaban Essay",
                        disabled: isManualDisabled.value,
                        class: "w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      }, null, 8, ["onUpdate:modelValue", "disabled"])), [
                        [vModelText, form.value.jawaban_benar]
                      ]) : withDirectives((openBlock(), createBlock("select", {
                        key: 1,
                        "onUpdate:modelValue": ($event) => form.value.jawaban_benar = $event,
                        disabled: isManualDisabled.value,
                        class: "w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      }, [
                        createVNode("option", { value: "opsi_a" }, "A. " + toDisplayString(form.value.opsi_a), 1),
                        createVNode("option", { value: "opsi_b" }, "B. " + toDisplayString(form.value.opsi_b), 1),
                        createVNode("option", { value: "opsi_c" }, "C. " + toDisplayString(form.value.opsi_c), 1),
                        createVNode("option", { value: "opsi_d" }, "D. " + toDisplayString(form.value.opsi_d), 1),
                        createVNode("option", { value: "opsi_e" }, "E. " + toDisplayString(form.value.opsi_e), 1)
                      ], 8, ["onUpdate:modelValue", "disabled"])), [
                        [vModelSelect, form.value.jawaban_benar]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block font-semibold mb-1 text-gray-700 dark:text-slate-200" }, " Bobot Nilai "),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => form.value.nilai = $event,
                        type: "number",
                        min: "0",
                        disabled: isManualDisabled.value,
                        class: "w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                        [vModelText, form.value.nilai]
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-col md:flex-row gap-4 mt-4" }, [
                    createVNode("button", {
                      type: "submit",
                      disabled: isSubmitting.value,
                      class: "flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg shadow transition"
                    }, [
                      isSubmitting.value ? (openBlock(), createBlock("svg", {
                        key: 0,
                        class: "w-5 h-5 animate-spin",
                        xmlns: "http://www.w3.org/2000/svg",
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
                      createVNode(unref(CheckIcon), { class: "w-5 h-5" }),
                      createTextVNode(" " + toDisplayString(isSubmitting.value ? "Creating..." : "Create Quest"), 1)
                    ], 8, ["disabled"]),
                    createVNode(unref(Link), {
                      href: `/proktor/soal/${props.soal_id}`,
                      class: "flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow transition"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
                        createTextVNode(" Back to Quiz List ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])
                ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Proktor/BankSoal/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
