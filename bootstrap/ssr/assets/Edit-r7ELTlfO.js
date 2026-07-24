import { ref, withCtx, unref, createVNode, createTextVNode, withModifiers, withDirectives, vModelSelect, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Link, router } from "@inertiajs/vue3";
import { PlusIcon, CheckIcon, ArrowLeftIcon } from "@heroicons/vue/24/solid";
import Swal from "sweetalert2";
import axios from "axios";
import { QuillEditor } from "@vueup/vue-quill";
/* empty css                        */
import "./Sidebar-COsy3wF2.js";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: { bankSoal: Object },
  setup(__props) {
    const props = __props;
    const form = ref({
      soal: props.bankSoal.soal,
      tipe_soal: props.bankSoal.tipe_soal,
      jawaban_benar: props.bankSoal.jawaban_benar ?? "",
      nilai: props.bankSoal.nilai,
      jenis_lampiran: props.bankSoal.jenis_lampiran,
      link_lampiran: props.bankSoal.link_lampiran,
      lampiran_file: null,
      opsi_a: props.bankSoal.opsi_a,
      opsi_b: props.bankSoal.opsi_b,
      opsi_c: props.bankSoal.opsi_c,
      opsi_d: props.bankSoal.opsi_d,
      opsi_e: props.bankSoal.opsi_e,
      opsi_a_lampiran: props.bankSoal.opsi_a_lampiran,
      opsi_b_lampiran: props.bankSoal.opsi_b_lampiran,
      opsi_c_lampiran: props.bankSoal.opsi_c_lampiran,
      opsi_d_lampiran: props.bankSoal.opsi_d_lampiran,
      opsi_e_lampiran: props.bankSoal.opsi_e_lampiran
    });
    const isSubmitting = ref(false);
    const existingFile = ref(props.bankSoal.link_lampiran || "");
    const opsiFiles = ref({});
    const opsiPreviews = ref({});
    const removeFlags = ref({});
    const opsiState = ref([]);
    ["a", "b", "c", "d", "e"].forEach((k) => {
      if (form.value["opsi_" + k]) opsiState.value.push(k);
    });
    if (!opsiState.value.length) opsiState.value.push("a");
    const opsiLampiranUrls = ref({});
    ["a", "b", "c", "d", "e"].forEach((k) => {
      opsiLampiranUrls.value[k] = props.bankSoal["opsi_" + k + "_lampiran_url"] ?? null;
    });
    function addOpsi() {
      if (opsiState.value.length < 5) {
        opsiState.value.push(String.fromCharCode(97 + opsiState.value.length));
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
      delete removeFlags.value[key];
    }
    function requestRemoveOpsiImg(key) {
      if (opsiPreviews.value[key]) {
        URL.revokeObjectURL(opsiPreviews.value[key]);
        delete opsiPreviews.value[key];
        delete opsiFiles.value[key];
      }
      removeFlags.value[key] = true;
    }
    async function submit() {
      const data = new FormData();
      const skipKeys = /* @__PURE__ */ new Set([
        "lampiran_file",
        "opsi_a_lampiran",
        "opsi_b_lampiran",
        "opsi_c_lampiran",
        "opsi_d_lampiran",
        "opsi_e_lampiran"
      ]);
      Object.keys(form.value).forEach((key) => {
        if (skipKeys.has(key)) return;
        data.append(key, form.value[key] ?? "");
      });
      if (form.value.lampiran_file) data.append("lampiran_file", form.value.lampiran_file);
      if (existingFile.value) data.append("existing_file", existingFile.value);
      Object.entries(opsiFiles.value).forEach(([key, file]) => {
        data.append(`opsi_${key}_file`, file);
      });
      Object.keys(removeFlags.value).forEach((key) => {
        data.append(`remove_opsi_${key}_lampiran`, "1");
      });
      isSubmitting.value = true;
      try {
        const res = await axios.post(`/proktor/bank-soal/${props.bankSoal.id}?_method=PUT`, data);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: res.data.success || "Butir soal berhasil diperbarui!",
          confirmButtonText: "OKE",
          confirmButtonColor: "#3b82f6"
        });
        router.visit(res.data.redirect || `/proktor/soal/${props.bankSoal.soal_id}`);
      } catch (err) {
        const errors = err.response?.data?.errors;
        const msg = errors ? Object.values(errors).flat().join("\n") : err.response?.data?.message || "Terjadi kesalahan saat update.";
        Swal.fire({ icon: "error", title: "Gagal!", text: msg, confirmButtonColor: "#ef4444" });
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto sm:rounded-2xl sm:shadow-xl sm:p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"${_scopeId}><h1 class="text-lg sm:text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100"${_scopeId}> Edit Detail Soal </h1><form class="space-y-5"${_scopeId}><div${_scopeId}><label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300"${_scopeId}> Soal / Pertanyaan </label><div class="relative rounded-xl overflow-hidden border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(QuillEditor), {
              content: form.value.soal,
              "onUpdate:content": ($event) => form.value.soal = $event,
              "content-type": "html",
              theme: "snow",
              placeholder: "Type the question here...",
              class: "announcement-editor",
              toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["clean"]
              ]
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex w-full justify-end border-t border-gray-300 dark:border-white/10"${_scopeId}><span class="w-full px-3 py-2 text-xs text-right text-gray-500 dark:text-gray-400"${_scopeId}> Powered by <strong class="pl-1 tracking-widest text-gray-700 dark:text-gray-200"${_scopeId}> Lumiverse </strong></span></div></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"${_scopeId}><div${_scopeId}><label class="block mb-2 font-semibold text-gray-700 dark:text-gray-300"${_scopeId}> Tipe Soal </label><select class="form-input w-full p-3 rounded-lg border transition border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}><option value="PG"${ssrIncludeBooleanAttr(Array.isArray(form.value.tipe_soal) ? ssrLooseContain(form.value.tipe_soal, "PG") : ssrLooseEqual(form.value.tipe_soal, "PG")) ? " selected" : ""}${_scopeId}>Pilihan Ganda</option><option value="Essay"${ssrIncludeBooleanAttr(Array.isArray(form.value.tipe_soal) ? ssrLooseContain(form.value.tipe_soal, "Essay") : ssrLooseEqual(form.value.tipe_soal, "Essay")) ? " selected" : ""}${_scopeId}>Essay</option></select></div><div${_scopeId}><label class="block mb-2 font-semibold text-gray-700 dark:text-gray-300"${_scopeId}> Bobot Nilai </label><input type="number" min="0"${ssrRenderAttr("value", form.value.nilai)} placeholder="Nilai soal" class="form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}></div><div${_scopeId}><label class="block mb-2 font-semibold text-gray-700 dark:text-gray-300"${_scopeId}> Jenis Lampiran </label><select class="form-input w-full p-3 rounded-lg border transition border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}><option value="Tanpa Lampiran"${ssrIncludeBooleanAttr(Array.isArray(form.value.jenis_lampiran) ? ssrLooseContain(form.value.jenis_lampiran, "Tanpa Lampiran") : ssrLooseEqual(form.value.jenis_lampiran, "Tanpa Lampiran")) ? " selected" : ""}${_scopeId}>Tanpa Lampiran</option><option value="Gambar"${ssrIncludeBooleanAttr(Array.isArray(form.value.jenis_lampiran) ? ssrLooseContain(form.value.jenis_lampiran, "Gambar") : ssrLooseEqual(form.value.jenis_lampiran, "Gambar")) ? " selected" : ""}${_scopeId}>Gambar</option></select></div></div>`);
            if (form.value.jenis_lampiran === "Gambar") {
              _push2(`<div${_scopeId}><label class="block font-semibold mb-1 text-gray-700 dark:text-slate-200"${_scopeId}> Upload Gambar </label><input type="file" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"${_scopeId}>`);
              if (form.value.lampiran_file) {
                _push2(`<p class="mt-1 text-green-600 dark:text-green-400"${_scopeId}>${ssrInterpolate(form.value.lampiran_file.name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (form.value.tipe_soal === "PG") {
              _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(opsiState.value, (key) => {
                _push2(`<div class="space-y-2"${_scopeId}><label class="font-semibold text-gray-700 dark:text-gray-300"${_scopeId}> Opsi ${ssrInterpolate(key.toUpperCase())}</label><input${ssrRenderAttr("value", form.value["opsi_" + key])} class="form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}>`);
                if (opsiLampiranUrls.value[key] && !removeFlags.value[key]) {
                  _push2(`<div class="flex items-center gap-3"${_scopeId}><img${ssrRenderAttr("src", opsiLampiranUrls.value[key])} class="h-16 rounded-lg object-cover border border-gray-200 dark:border-slate-700"${_scopeId}><button type="button" class="text-xs text-red-500 hover:text-red-700 font-medium"${_scopeId}> 🗑 Hapus gambar </button></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="flex items-center gap-2"${_scopeId}><label${ssrRenderAttr("for", `opsi_${key}_file`)} class="cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"${_scopeId}> 📷 ${ssrInterpolate(form.value["opsi_" + key + "_lampiran"] && !removeFlags.value[key] ? "Ganti Gambar" : "Tambah Gambar")}</label><input${ssrRenderAttr("id", `opsi_${key}_file`)} type="file" accept="image/*" class="hidden"${_scopeId}>`);
                if (opsiFiles.value[key]) {
                  _push2(`<span class="text-xs text-green-600 dark:text-green-400 truncate max-w-[140px]"${_scopeId}>${ssrInterpolate(opsiFiles.value[key].name)}</span>`);
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
              _push2(`<!--]-->`);
              if (opsiState.value.length < 5) {
                _push2(`<button type="button" class="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(PlusIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                _push2(` Tambah </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div${_scopeId}><label class="block mb-2 font-semibold text-gray-700 dark:text-gray-300"${_scopeId}> Jawaban Benar </label>`);
            if (form.value.tipe_soal === "Essay") {
              _push2(`<input${ssrRenderAttr("value", form.value.jawaban_benar)} type="text" placeholder="Jawaban Essay" class="form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}>`);
            } else {
              _push2(`<select class="form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}><!--[-->`);
              ssrRenderList(opsiState.value, (key) => {
                _push2(`<option${ssrRenderAttr("value", "opsi_" + key)}${ssrIncludeBooleanAttr(Array.isArray(form.value.jawaban_benar) ? ssrLooseContain(form.value.jawaban_benar, "opsi_" + key) : ssrLooseEqual(form.value.jawaban_benar, "opsi_" + key)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(key.toUpperCase())}. ${ssrInterpolate(form.value["opsi_" + key])}</option>`);
              });
              _push2(`<!--]--></select>`);
            }
            _push2(`</div><div class="flex flex-col sm:flex-row gap-4 pt-4"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="btn-primary"${_scopeId}>`);
            if (isSubmitting.value) {
              _push2(`<svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(CheckIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(isSubmitting.value ? "Updating process..." : "Update")}</span></button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/proktor/soal/${props.bankSoal.soal_id}`,
              class: "btn-secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-5 h-5" }, null, _parent3, _scopeId2));
                  _push3(` Cancel `);
                } else {
                  return [
                    createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto sm:rounded-2xl sm:shadow-xl sm:p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10" }, [
                createVNode("h1", { class: "text-lg sm:text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100" }, " Edit Detail Soal "),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "space-y-5"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block mb-1 font-semibold text-gray-700 dark:text-gray-300" }, " Soal / Pertanyaan "),
                    createVNode("div", { class: "relative rounded-xl overflow-hidden border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm" }, [
                      createVNode(unref(QuillEditor), {
                        content: form.value.soal,
                        "onUpdate:content": ($event) => form.value.soal = $event,
                        "content-type": "html",
                        theme: "snow",
                        placeholder: "Type the question here...",
                        class: "announcement-editor",
                        toolbar: [
                          ["bold", "italic", "underline"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ align: [] }],
                          ["clean"]
                        ]
                      }, null, 8, ["content", "onUpdate:content"]),
                      createVNode("div", { class: "flex w-full justify-end border-t border-gray-300 dark:border-white/10" }, [
                        createVNode("span", { class: "w-full px-3 py-2 text-xs text-right text-gray-500 dark:text-gray-400" }, [
                          createTextVNode(" Powered by "),
                          createVNode("strong", { class: "pl-1 tracking-widest text-gray-700 dark:text-gray-200" }, " Lumiverse ")
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block mb-2 font-semibold text-gray-700 dark:text-gray-300" }, " Tipe Soal "),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.tipe_soal = $event,
                        class: "form-input w-full p-3 rounded-lg border transition border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                      }, [
                        createVNode("option", { value: "PG" }, "Pilihan Ganda"),
                        createVNode("option", { value: "Essay" }, "Essay")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.value.tipe_soal]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block mb-2 font-semibold text-gray-700 dark:text-gray-300" }, " Bobot Nilai "),
                      withDirectives(createVNode("input", {
                        type: "number",
                        min: "0",
                        "onUpdate:modelValue": ($event) => form.value.nilai = $event,
                        placeholder: "Nilai soal",
                        class: "form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.nilai]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block mb-2 font-semibold text-gray-700 dark:text-gray-300" }, " Jenis Lampiran "),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.jenis_lampiran = $event,
                        class: "form-input w-full p-3 rounded-lg border transition border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                      }, [
                        createVNode("option", { value: "Tanpa Lampiran" }, "Tanpa Lampiran"),
                        createVNode("option", { value: "Gambar" }, "Gambar")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.value.jenis_lampiran]
                      ])
                    ])
                  ]),
                  form.value.jenis_lampiran === "Gambar" ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("label", { class: "block font-semibold mb-1 text-gray-700 dark:text-slate-200" }, " Upload Gambar "),
                    createVNode("input", {
                      type: "file",
                      onChange: handleFile,
                      class: "w-full p-2 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
                    }, null, 32),
                    form.value.lampiran_file ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-green-600 dark:text-green-400"
                    }, toDisplayString(form.value.lampiran_file.name), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  form.value.tipe_soal === "PG" ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "space-y-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(opsiState.value, (key) => {
                      return openBlock(), createBlock("div", {
                        key,
                        class: "space-y-2"
                      }, [
                        createVNode("label", { class: "font-semibold text-gray-700 dark:text-gray-300" }, " Opsi " + toDisplayString(key.toUpperCase()), 1),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => form.value["opsi_" + key] = $event,
                          class: "form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, form.value["opsi_" + key]]
                        ]),
                        opsiLampiranUrls.value[key] && !removeFlags.value[key] ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center gap-3"
                        }, [
                          createVNode("img", {
                            src: opsiLampiranUrls.value[key],
                            class: "h-16 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                          }, null, 8, ["src"]),
                          createVNode("button", {
                            type: "button",
                            onClick: ($event) => requestRemoveOpsiImg(key),
                            class: "text-xs text-red-500 hover:text-red-700 font-medium"
                          }, " 🗑 Hapus gambar ", 8, ["onClick"])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("label", {
                            for: `opsi_${key}_file`,
                            class: "cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                          }, " 📷 " + toDisplayString(form.value["opsi_" + key + "_lampiran"] && !removeFlags.value[key] ? "Ganti Gambar" : "Tambah Gambar"), 9, ["for"]),
                          createVNode("input", {
                            id: `opsi_${key}_file`,
                            type: "file",
                            accept: "image/*",
                            onChange: ($event) => handleOpsiFile($event, key),
                            class: "hidden"
                          }, null, 40, ["id", "onChange"]),
                          opsiFiles.value[key] ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-xs text-green-600 dark:text-green-400 truncate max-w-[140px]"
                          }, toDisplayString(opsiFiles.value[key].name), 1)) : createCommentVNode("", true)
                        ]),
                        opsiPreviews.value[key] ? (openBlock(), createBlock("img", {
                          key: 1,
                          src: opsiPreviews.value[key],
                          class: "h-20 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                        }, null, 8, ["src"])) : createCommentVNode("", true)
                      ]);
                    }), 128)),
                    opsiState.value.length < 5 ? (openBlock(), createBlock("button", {
                      key: 0,
                      type: "button",
                      onClick: addOpsi,
                      class: "flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold"
                    }, [
                      createVNode(unref(PlusIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Tambah ")
                    ])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  createVNode("div", null, [
                    createVNode("label", { class: "block mb-2 font-semibold text-gray-700 dark:text-gray-300" }, " Jawaban Benar "),
                    form.value.tipe_soal === "Essay" ? withDirectives((openBlock(), createBlock("input", {
                      key: 0,
                      "onUpdate:modelValue": ($event) => form.value.jawaban_benar = $event,
                      type: "text",
                      placeholder: "Jawaban Essay",
                      class: "form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    }, null, 8, ["onUpdate:modelValue"])), [
                      [vModelText, form.value.jawaban_benar]
                    ]) : withDirectives((openBlock(), createBlock("select", {
                      key: 1,
                      "onUpdate:modelValue": ($event) => form.value.jawaban_benar = $event,
                      class: "form-input w-full p-3 rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(opsiState.value, (key) => {
                        return openBlock(), createBlock("option", {
                          key,
                          value: "opsi_" + key
                        }, toDisplayString(key.toUpperCase()) + ". " + toDisplayString(form.value["opsi_" + key]), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"])), [
                      [vModelSelect, form.value.jawaban_benar]
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-col sm:flex-row gap-4 pt-4" }, [
                    createVNode("button", {
                      type: "submit",
                      disabled: isSubmitting.value,
                      class: "btn-primary"
                    }, [
                      isSubmitting.value ? (openBlock(), createBlock("svg", {
                        key: 0,
                        class: "w-5 h-5 animate-spin",
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
                        class: "w-5 h-5"
                      })),
                      createVNode("span", null, toDisplayString(isSubmitting.value ? "Updating process..." : "Update"), 1)
                    ], 8, ["disabled"]),
                    createVNode(unref(Link), {
                      href: `/proktor/soal/${props.bankSoal.soal_id}`,
                      class: "btn-secondary"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
                        createTextVNode(" Cancel ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Proktor/BankSoal/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
