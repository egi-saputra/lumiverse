import { ref, withCtx, unref, createVNode, createTextVNode, withModifiers, withDirectives, vModelSelect, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { usePage, Link, router } from "@inertiajs/vue3";
import { PencilSquareIcon, PlusIcon, CheckIcon, ArrowLeftIcon } from "@heroicons/vue/24/solid";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import axios from "axios";
import { QuillEditor } from "@vueup/vue-quill";
/* empty css                        */
import "@vueuse/core";
import "@heroicons/vue/24/outline";
import "sweetalert2";
import "ziggy-js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    bankSoal: Object
  },
  setup(__props) {
    usePage();
    const { success, error } = ToastAlert();
    const props = __props;
    const form = ref({
      soal: props.bankSoal.soal,
      tipe_soal: props.bankSoal.tipe_soal,
      jawaban_benar: props.bankSoal.jawaban_benar || "",
      nilai: props.bankSoal.nilai,
      jenis_lampiran: props.bankSoal.jenis_lampiran,
      lampiran_file: null,
      // file baru
      opsi_a: props.bankSoal.opsi_a,
      opsi_b: props.bankSoal.opsi_b,
      opsi_c: props.bankSoal.opsi_c,
      opsi_d: props.bankSoal.opsi_d,
      opsi_e: props.bankSoal.opsi_e,
      opsi_a_lampiran: props.bankSoal.opsi_a_lampiran,
      opsi_b_lampiran: props.bankSoal.opsi_b_lampiran,
      opsi_c_lampiran: props.bankSoal.opsi_c_lampiran,
      opsi_d_lampiran: props.bankSoal.opsi_d_lampiran,
      opsi_e_lampiran: props.bankSoal.opsi_e_lampiran,
      processing: false
    });
    const existingFile = ref(props.bankSoal.link_lampiran || "");
    const opsiFiles = ref({});
    const opsiPreviews = ref({});
    const removeFlags = ref({});
    const opsiState = ref([]);
    ["a", "b", "c", "d", "e"].forEach((k) => {
      if (form.value["opsi_" + k]) opsiState.value.push(k);
    });
    if (!opsiState.value.length) opsiState.value.push("a");
    function addOpsi() {
      if (opsiState.value.length < 5) {
        const nextOpsi = String.fromCharCode(97 + opsiState.value.length);
        opsiState.value.push(nextOpsi);
      }
    }
    function handleFile(event) {
      const file = event.target.files[0];
      if (file) {
        form.value.lampiran_file = file;
      }
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
    function submit() {
      form.value.processing = true;
      const skipKeys = /* @__PURE__ */ new Set([
        "processing",
        "lampiran_file",
        "opsi_a_lampiran",
        "opsi_b_lampiran",
        "opsi_c_lampiran",
        "opsi_d_lampiran",
        "opsi_e_lampiran"
      ]);
      const data = new FormData();
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
      axios.post(`/guru/bank-soal/${props.bankSoal.id}?_method=PUT`, data).then((res) => {
        success(res.data.success || "Question item has been successfully updated!");
        router.visit(`/guru/soal/${props.bankSoal.soal_id}`, {
          only: ["soal"],
          preserveScroll: true
        });
      }).catch((err) => {
        const errors = err.response?.data?.errors;
        if (errors) {
          Object.values(errors).forEach((e) => error(e[0]));
        } else {
          error("An error occurred while updating the question.");
        }
      }).finally(() => {
        form.value.processing = false;
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-5xl mx-auto sm:px-4 sm:py-6"${_scopeId}><div class="relative overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 sm:rounded-3xl rounded-xl sm:shadow-2xl p-6 md:p-8"${_scopeId}><div class="flex items-center gap-3 mb-8"${_scopeId}><div class="p-3 rounded-xl bg-indigo-600/10 text-indigo-600"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-6 h-6" }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><h1 class="text-2xl font-bold text-gray-800 dark:text-white"${_scopeId}> Edit Question </h1><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}> Update question type, content, and correct answer </p></div></div><form class="space-y-8"${_scopeId}><section class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}><div${_scopeId}><label class="form-label"${_scopeId}>Question Type</label><select class="form-input dark:text-gray-400"${_scopeId}><option value="PG"${ssrIncludeBooleanAttr(Array.isArray(form.value.tipe_soal) ? ssrLooseContain(form.value.tipe_soal, "PG") : ssrLooseEqual(form.value.tipe_soal, "PG")) ? " selected" : ""}${_scopeId}>Multiple Choice</option><option value="Essay"${ssrIncludeBooleanAttr(Array.isArray(form.value.tipe_soal) ? ssrLooseContain(form.value.tipe_soal, "Essay") : ssrLooseEqual(form.value.tipe_soal, "Essay")) ? " selected" : ""}${_scopeId}>Essay</option></select></div><div${_scopeId}><label class="form-label"${_scopeId}>Attachment Type</label><select class="form-input dark:text-gray-400"${_scopeId}><option value="Tanpa Lampiran"${ssrIncludeBooleanAttr(Array.isArray(form.value.jenis_lampiran) ? ssrLooseContain(form.value.jenis_lampiran, "Tanpa Lampiran") : ssrLooseEqual(form.value.jenis_lampiran, "Tanpa Lampiran")) ? " selected" : ""}${_scopeId}>No Attachment</option><option value="Gambar"${ssrIncludeBooleanAttr(Array.isArray(form.value.jenis_lampiran) ? ssrLooseContain(form.value.jenis_lampiran, "Gambar") : ssrLooseEqual(form.value.jenis_lampiran, "Gambar")) ? " selected" : ""}${_scopeId}>Image</option></select></div></section>`);
            if (form.value.jenis_lampiran === "Gambar") {
              _push2(`<section class="rounded-2xl border border-dashed border-gray-300 dark:border-white/20 p-5"${_scopeId}><label class="form-label"${_scopeId}>Upload Image</label><input type="file" class="form-input dark:text-gray-400"${_scopeId}>`);
              if (form.value.lampiran_file) {
                _push2(`<p class="text-green-500 text-sm mt-2"${_scopeId}>${ssrInterpolate(form.value.lampiran_file.name)}</p>`);
              } else if (existingFile.value) {
                _push2(`<div class="mt-2"${_scopeId}><p class="text-gray-500 text-sm mb-1"${_scopeId}>Current file: ${ssrInterpolate(existingFile.value.split("/").pop())}</p>`);
                if (props.bankSoal.link_lampiran_url) {
                  _push2(`<img${ssrRenderAttr("src", props.bankSoal.link_lampiran_url)} class="h-24 rounded-lg object-cover border border-gray-200 dark:border-slate-700"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section${_scopeId}><div${_scopeId}><label class="font-semibold mb-1 block text-gray-700 dark:text-gray-300"${_scopeId}>Question</label><div class="relative rounded-xl overflow-hidden border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-sm"${_scopeId}>`);
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
            _push2(`<div class="flex w-full border-t border-gray-300 dark:border-gray-800 justify-end"${_scopeId}><span class="flex justify-end px-3 text-xs py-2 editor-brand w-full text-gray-500 dark:text-gray-400"${_scopeId}> Powered by<strong class="text-gray-700 pl-1 tracking-widest dark:text-gray-200 font-bold"${_scopeId}> Lumiverse</strong></span></div></div></div></section>`);
            if (form.value.tipe_soal === "PG") {
              _push2(`<section class="space-y-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h3 class="font-semibold text-gray-700 dark:text-gray-200"${_scopeId}>Answer Options</h3>`);
              if (opsiState.value.length < 5) {
                _push2(`<button type="button" class="flex items-center gap-1 text-indigo-600 font-semibold"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(PlusIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                _push2(` Add Option </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(opsiState.value, (key) => {
                _push2(`<div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-600 dark:text-gray-300"${_scopeId}> Option ${ssrInterpolate(key.toUpperCase())}</label><input${ssrRenderAttr("value", form.value["opsi_" + key])} class="form-input dark:text-gray-400 w-full"${_scopeId}>`);
                if (props.bankSoal["opsi_" + key + "_lampiran_url"] && !removeFlags.value[key]) {
                  _push2(`<div${_scopeId}><img${ssrRenderAttr("src", props.bankSoal["opsi_" + key + "_lampiran_url"])} class="h-16 rounded-lg object-cover border border-gray-200 dark:border-slate-700"${_scopeId}><button type="button" class="text-xs text-red-500 hover:text-red-700 font-medium transition"${_scopeId}> 🗑 Remove image </button></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="flex items-center gap-2"${_scopeId}><label${ssrRenderAttr("for", `opsi_${key}_file`)} class="cursor-pointer inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition"${_scopeId}> 📷 ${ssrInterpolate(form.value["opsi_" + key + "_lampiran"] && !removeFlags.value[key] ? "Change Image" : "Add Image")}</label><input${ssrRenderAttr("id", `opsi_${key}_file`)} type="file" accept="image/*" class="hidden"${_scopeId}>`);
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
              _push2(`<!--]--></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section${_scopeId}><label class="form-label"${_scopeId}>Correct Answer</label>`);
            if (form.value.tipe_soal === "Essay") {
              _push2(`<input${ssrRenderAttr("value", form.value.jawaban_benar)} placeholder="Essay answer" class="form-input dark:text-gray-400"${_scopeId}>`);
            } else {
              _push2(`<select class="form-input dark:text-gray-400"${_scopeId}><!--[-->`);
              ssrRenderList(opsiState.value, (key) => {
                _push2(`<option${ssrRenderAttr("value", "opsi_" + key)}${ssrIncludeBooleanAttr(Array.isArray(form.value.jawaban_benar) ? ssrLooseContain(form.value.jawaban_benar, "opsi_" + key) : ssrLooseEqual(form.value.jawaban_benar, "opsi_" + key)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(key.toUpperCase())}. ${ssrInterpolate(form.value["opsi_" + key])}</option>`);
              });
              _push2(`<!--]--></select>`);
            }
            _push2(`</section><div class="flex flex-col sm:flex-row gap-4 pt-4"${_scopeId}><button type="submit" class="flex-1 btn-primary"${ssrIncludeBooleanAttr(form.value.processing) ? " disabled" : ""}${_scopeId}>`);
            if (!form.value.processing) {
              _push2(ssrRenderComponent(unref(CheckIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            } else {
              _push2(`<svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24"${_scopeId}><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"${_scopeId}></circle></svg>`);
            }
            _push2(` ${ssrInterpolate(form.value.processing ? "Updating..." : "Update Question")}</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/guru/soal/${props.bankSoal.soal_id}`,
              class: "flex-1 btn-secondary"
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
            _push2(`</div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-5xl mx-auto sm:px-4 sm:py-6" }, [
                createVNode("div", { class: "relative overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 sm:rounded-3xl rounded-xl sm:shadow-2xl p-6 md:p-8" }, [
                  createVNode("div", { class: "flex items-center gap-3 mb-8" }, [
                    createVNode("div", { class: "p-3 rounded-xl bg-indigo-600/10 text-indigo-600" }, [
                      createVNode(unref(PencilSquareIcon), { class: "w-6 h-6" })
                    ]),
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-gray-800 dark:text-white" }, " Edit Question "),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, " Update question type, content, and correct answer ")
                    ])
                  ]),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "space-y-8"
                  }, [
                    createVNode("section", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "form-label" }, "Question Type"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => form.value.tipe_soal = $event,
                          class: "form-input dark:text-gray-400"
                        }, [
                          createVNode("option", { value: "PG" }, "Multiple Choice"),
                          createVNode("option", { value: "Essay" }, "Essay")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, form.value.tipe_soal]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "form-label" }, "Attachment Type"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => form.value.jenis_lampiran = $event,
                          class: "form-input dark:text-gray-400"
                        }, [
                          createVNode("option", { value: "Tanpa Lampiran" }, "No Attachment"),
                          createVNode("option", { value: "Gambar" }, "Image")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, form.value.jenis_lampiran]
                        ])
                      ])
                    ]),
                    form.value.jenis_lampiran === "Gambar" ? (openBlock(), createBlock("section", {
                      key: 0,
                      class: "rounded-2xl border border-dashed border-gray-300 dark:border-white/20 p-5"
                    }, [
                      createVNode("label", { class: "form-label" }, "Upload Image"),
                      createVNode("input", {
                        type: "file",
                        onChange: handleFile,
                        class: "form-input dark:text-gray-400"
                      }, null, 32),
                      form.value.lampiran_file ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-green-500 text-sm mt-2"
                      }, toDisplayString(form.value.lampiran_file.name), 1)) : existingFile.value ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "mt-2"
                      }, [
                        createVNode("p", { class: "text-gray-500 text-sm mb-1" }, "Current file: " + toDisplayString(existingFile.value.split("/").pop()), 1),
                        props.bankSoal.link_lampiran_url ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: props.bankSoal.link_lampiran_url,
                          class: "h-24 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                        }, null, 8, ["src"])) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    createVNode("section", null, [
                      createVNode("div", null, [
                        createVNode("label", { class: "font-semibold mb-1 block text-gray-700 dark:text-gray-300" }, "Question"),
                        createVNode("div", { class: "relative rounded-xl overflow-hidden border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-sm" }, [
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
                          createVNode("div", { class: "flex w-full border-t border-gray-300 dark:border-gray-800 justify-end" }, [
                            createVNode("span", { class: "flex justify-end px-3 text-xs py-2 editor-brand w-full text-gray-500 dark:text-gray-400" }, [
                              createTextVNode(" Powered by"),
                              createVNode("strong", { class: "text-gray-700 pl-1 tracking-widest dark:text-gray-200 font-bold" }, " Lumiverse")
                            ])
                          ])
                        ])
                      ])
                    ]),
                    form.value.tipe_soal === "PG" ? (openBlock(), createBlock("section", {
                      key: 1,
                      class: "space-y-4"
                    }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("h3", { class: "font-semibold text-gray-700 dark:text-gray-200" }, "Answer Options"),
                        opsiState.value.length < 5 ? (openBlock(), createBlock("button", {
                          key: 0,
                          type: "button",
                          onClick: addOpsi,
                          class: "flex items-center gap-1 text-indigo-600 font-semibold"
                        }, [
                          createVNode(unref(PlusIcon), { class: "w-4 h-4" }),
                          createTextVNode(" Add Option ")
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(opsiState.value, (key) => {
                          return openBlock(), createBlock("div", {
                            key,
                            class: "space-y-2"
                          }, [
                            createVNode("label", { class: "text-sm font-medium text-gray-600 dark:text-gray-300" }, " Option " + toDisplayString(key.toUpperCase()), 1),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => form.value["opsi_" + key] = $event,
                              class: "form-input dark:text-gray-400 w-full"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, form.value["opsi_" + key]]
                            ]),
                            props.bankSoal["opsi_" + key + "_lampiran_url"] && !removeFlags.value[key] ? (openBlock(), createBlock("div", { key: 0 }, [
                              createVNode("img", {
                                src: props.bankSoal["opsi_" + key + "_lampiran_url"],
                                class: "h-16 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                              }, null, 8, ["src"]),
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => requestRemoveOpsiImg(key),
                                class: "text-xs text-red-500 hover:text-red-700 font-medium transition"
                              }, " 🗑 Remove image ", 8, ["onClick"])
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              createVNode("label", {
                                for: `opsi_${key}_file`,
                                class: "cursor-pointer inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                              }, " 📷 " + toDisplayString(form.value["opsi_" + key + "_lampiran"] && !removeFlags.value[key] ? "Change Image" : "Add Image"), 9, ["for"]),
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
                        }), 128))
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode("section", null, [
                      createVNode("label", { class: "form-label" }, "Correct Answer"),
                      form.value.tipe_soal === "Essay" ? withDirectives((openBlock(), createBlock("input", {
                        key: 0,
                        "onUpdate:modelValue": ($event) => form.value.jawaban_benar = $event,
                        placeholder: "Essay answer",
                        class: "form-input dark:text-gray-400"
                      }, null, 8, ["onUpdate:modelValue"])), [
                        [vModelText, form.value.jawaban_benar]
                      ]) : withDirectives((openBlock(), createBlock("select", {
                        key: 1,
                        "onUpdate:modelValue": ($event) => form.value.jawaban_benar = $event,
                        class: "form-input dark:text-gray-400"
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
                        class: "flex-1 btn-primary",
                        disabled: form.value.processing
                      }, [
                        !form.value.processing ? (openBlock(), createBlock(unref(CheckIcon), {
                          key: 0,
                          class: "w-5 h-5"
                        })) : (openBlock(), createBlock("svg", {
                          key: 1,
                          class: "w-5 h-5 animate-spin",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("circle", {
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            "stroke-width": "4",
                            fill: "none"
                          })
                        ])),
                        createTextVNode(" " + toDisplayString(form.value.processing ? "Updating..." : "Update Question"), 1)
                      ], 8, ["disabled"]),
                      createVNode(unref(Link), {
                        href: `/guru/soal/${props.bankSoal.soal_id}`,
                        class: "flex-1 btn-secondary"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Quest/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
