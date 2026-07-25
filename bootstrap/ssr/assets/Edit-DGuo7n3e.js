import { ref, computed, reactive, watch, withCtx, unref, createTextVNode, createVNode, withModifiers, withDirectives, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, createCommentVNode, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Link, router } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    assignment: Object,
    // existing assignment data
    teachers: Array,
    // [{ id, nama_lengkap }]
    subjects: Array
    // [{ id, mapel, guru_id }]
  },
  setup(__props) {
    const props = __props;
    const detectFileType = (filePath) => {
      if (!filePath) return "none";
      if (filePath.startsWith("http")) return "link";
      return "file";
    };
    const existingFilePath = ref(props.assignment?.file_path || null);
    const existingFileName = computed(() => {
      if (!existingFilePath.value) return "";
      if (existingFilePath.value.startsWith("http")) return existingFilePath.value;
      return existingFilePath.value.split("/").pop();
    });
    const form = reactive({
      guru_id: props.assignment?.guru_id ?? "",
      mapel_id: props.assignment?.mapel_id ?? "",
      judul: props.assignment?.judul ?? "",
      deskripsi: props.assignment?.deskripsi ?? "",
      file: null,
      link: detectFileType(props.assignment?.file_path) === "link" ? props.assignment?.file_path ?? "" : ""
    });
    const fileType = ref(detectFileType(props.assignment?.file_path));
    const selectedFile = ref(null);
    const sending = ref(false);
    const loadingMapel = ref(false);
    const assignmentForm = ref(null);
    const filteredSubjects = computed(() => {
      if (!form.guru_id) return [];
      return (props.subjects || []).filter(
        (s) => String(s.guru_id) === String(form.guru_id)
      );
    });
    let isFirstLoad = true;
    watch(() => form.guru_id, (newVal) => {
      if (isFirstLoad) {
        isFirstLoad = false;
        return;
      }
      form.mapel_id = "";
      loadingMapel.value = true;
      setTimeout(() => {
        loadingMapel.value = false;
        if (filteredSubjects.value.length === 1) {
          form.mapel_id = filteredSubjects.value[0].id;
        }
      }, 150);
    });
    const setFileType = (type) => {
      fileType.value = type;
      form.file = null;
      form.link = "";
      selectedFile.value = null;
    };
    const handleFile = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      selectedFile.value = file;
      form.file = file;
    };
    const submitAssignment = () => {
      if (!assignmentForm.value.checkValidity()) {
        assignmentForm.value.reportValidity();
        return;
      }
      sending.value = true;
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("guru_id", form.guru_id);
      formData.append("mapel_id", form.mapel_id);
      formData.append("judul", form.judul);
      const normalizedDesc = (form.deskripsi || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      formData.append("deskripsi", normalizedDesc);
      formData.append("attachment_type", fileType.value);
      if (fileType.value === "file" && form.file) formData.append("file", form.file);
      if (fileType.value === "link") formData.append("link", form.link);
      router.post(route("siswa.assignment.update", props.assignment.id), formData, {
        onSuccess: () => {
          sending.value = false;
        },
        onError: () => {
          sending.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen sm:p-6 flex justify-center items-start"${_scopeId}><div class="w-full"${_scopeId}><div class="mb-8"${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"${_scopeId}>Edit Your Assignment </h1><p class="text-sm text-gray-500 dark:text-gray-400 mt-1"${_scopeId}>Update the details of your submitted assignment.</p></div><form class="space-y-5"${_scopeId}><div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500"${_scopeId}> Target</p><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}>Recipient (Teacher)</label><select required class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.guru_id) ? ssrLooseContain(form.guru_id, "") : ssrLooseEqual(form.guru_id, "")) ? " selected" : ""}${_scopeId}>Select a teacher...</option><!--[-->`);
            ssrRenderList(__props.teachers, (teacher) => {
              _push2(`<option${ssrRenderAttr("value", teacher.id)}${ssrIncludeBooleanAttr(Array.isArray(form.guru_id) ? ssrLooseContain(form.guru_id, teacher.id) : ssrLooseEqual(form.guru_id, teacher.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(teacher.nama_lengkap)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}> Subject `);
            if (!form.guru_id) {
              _push2(`<span class="font-normal text-gray-400"${_scopeId}>(Select a teacher first)</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><select required${ssrIncludeBooleanAttr(!form.guru_id || loadingMapel.value) ? " disabled" : ""} class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.mapel_id) ? ssrLooseContain(form.mapel_id, "") : ssrLooseEqual(form.mapel_id, "")) ? " selected" : ""}${_scopeId}>${ssrInterpolate(loadingMapel.value ? "Loading..." : form.guru_id ? "Select a subject..." : "Select teacher first")}</option><!--[-->`);
            ssrRenderList(filteredSubjects.value, (subject) => {
              _push2(`<option${ssrRenderAttr("value", subject.id)}${ssrIncludeBooleanAttr(Array.isArray(form.mapel_id) ? ssrLooseContain(form.mapel_id, subject.id) : ssrLooseEqual(form.mapel_id, subject.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(subject.mapel)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (form.guru_id && !loadingMapel.value && filteredSubjects.value.length === 0) {
              _push2(`<p class="text-xs text-amber-500 dark:text-amber-400"${_scopeId}> No subjects found for this teacher. </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500"${_scopeId}> Details</p><div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}>Title</label><input type="text"${ssrRenderAttr("value", form.judul)} required maxlength="255" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="e.g. Math Homework Chapter 3"${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}>Description</label><textarea rows="5" required maxlength="5000" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none leading-relaxed" placeholder="Describe your assignment in detail."${_scopeId}>${ssrInterpolate(form.deskripsi)}</textarea><p class="text-xs text-gray-400 dark:text-gray-500"${_scopeId}>You can press Enter to create new paragraphs.</p></div></div><div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500"${_scopeId}> Attachment</p><div class="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 p-1 gap-1"${_scopeId}><button type="button" class="${ssrRenderClass([fileType.value === "none" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", "flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 text-center"])}"${_scopeId}> None </button><button type="button" class="${ssrRenderClass([fileType.value === "file" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", "flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 text-center"])}"${_scopeId}> File </button><button type="button" class="${ssrRenderClass([fileType.value === "link" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", "flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 text-center"])}"${_scopeId}> Link </button></div>`);
            if (existingFilePath.value && fileType.value !== "none") {
              _push2(`<div class="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50"${_scopeId}><svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><p class="text-xs text-amber-700 dark:text-amber-400"${_scopeId}> Current attachment: <span class="font-semibold"${_scopeId}>${ssrInterpolate(existingFileName.value)}</span>. Upload a new file or enter a new link to replace it, or switch to &quot;None&quot; to remove it. </p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (fileType.value === "file") {
              _push2(`<div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}> Choose File <span class="font-normal text-gray-400"${_scopeId}>(Image, PDF, Excel, Word — max 10MB)</span></label><label class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition group"${_scopeId}><div class="flex flex-col items-center gap-1 text-center px-4"${_scopeId}><svg class="w-7 h-7 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"${_scopeId}></path></svg>`);
              if (selectedFile.value) {
                _push2(`<span class="text-sm font-medium text-blue-600 dark:text-blue-400 truncate max-w-xs"${_scopeId}>${ssrInterpolate(selectedFile.value.name)}</span>`);
              } else {
                _push2(`<span class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}> Click to upload a new file (leave empty to keep current) </span>`);
              }
              _push2(`</div><input type="file" class="hidden" accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.doc,.docx,.zip"${_scopeId}></label></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (fileType.value === "link") {
              _push2(`<div class="space-y-1.5"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}> Enter Link <span class="font-normal text-gray-400"${_scopeId}>(YouTube, Google Drive, etc.)</span></label><input type="url"${ssrRenderAttr("value", form.link)} maxlength="2048" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="https://youtube.com/..."${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (fileType.value === "none") {
              _push2(`<p class="text-sm text-gray-400 dark:text-gray-500 italic"${_scopeId}>${ssrInterpolate(existingFilePath.value ? "Current attachment will be removed on save." : "No attachment will be added.")}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex justify-end gap-3 pt-2 pb-8"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("siswa.assignment.index"),
              class: "px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(sending.value) ? " disabled" : ""} class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-200 dark:shadow-none transition-all duration-200"${_scopeId}>`);
            if (sending.value) {
              _push2(`<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(sending.value ? "Saving..." : "Save Changes")}</button></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen sm:p-6 flex justify-center items-start" }, [
                createVNode("div", { class: "w-full" }, [
                  createVNode("div", { class: "mb-8" }, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white tracking-tight" }, "Edit Your Assignment "),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 mt-1" }, "Update the details of your submitted assignment.")
                  ]),
                  createVNode("form", {
                    ref_key: "assignmentForm",
                    ref: assignmentForm,
                    onSubmit: withModifiers(submitAssignment, ["prevent"]),
                    class: "space-y-5"
                  }, [
                    createVNode("div", { class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500" }, " Target"),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Recipient (Teacher)"),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => form.guru_id = $event,
                            required: "",
                            class: "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          }, [
                            createVNode("option", {
                              value: "",
                              disabled: ""
                            }, "Select a teacher..."),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.teachers, (teacher) => {
                              return openBlock(), createBlock("option", {
                                key: teacher.id,
                                value: teacher.id
                              }, toDisplayString(teacher.nama_lengkap), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, form.guru_id]
                          ])
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, [
                            createTextVNode(" Subject "),
                            !form.guru_id ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "font-normal text-gray-400"
                            }, "(Select a teacher first)")) : createCommentVNode("", true)
                          ]),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => form.mapel_id = $event,
                            required: "",
                            disabled: !form.guru_id || loadingMapel.value,
                            class: "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                          }, [
                            createVNode("option", {
                              value: "",
                              disabled: ""
                            }, toDisplayString(loadingMapel.value ? "Loading..." : form.guru_id ? "Select a subject..." : "Select teacher first"), 1),
                            (openBlock(true), createBlock(Fragment, null, renderList(filteredSubjects.value, (subject) => {
                              return openBlock(), createBlock("option", {
                                key: subject.id,
                                value: subject.id
                              }, toDisplayString(subject.mapel), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue", "disabled"]), [
                            [vModelSelect, form.mapel_id]
                          ]),
                          form.guru_id && !loadingMapel.value && filteredSubjects.value.length === 0 ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-xs text-amber-500 dark:text-amber-400"
                          }, " No subjects found for this teacher. ")) : createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500" }, " Details"),
                      createVNode("div", { class: "space-y-1.5" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Title"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => form.judul = $event,
                          required: "",
                          maxlength: "255",
                          class: "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition",
                          placeholder: "e.g. Math Homework Chapter 3"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, form.judul]
                        ])
                      ]),
                      createVNode("div", { class: "space-y-1.5" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "Description"),
                        withDirectives(createVNode("textarea", {
                          "onUpdate:modelValue": ($event) => form.deskripsi = $event,
                          rows: "5",
                          required: "",
                          maxlength: "5000",
                          class: "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none leading-relaxed",
                          placeholder: "Describe your assignment in detail."
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, form.deskripsi]
                        ]),
                        createVNode("p", { class: "text-xs text-gray-400 dark:text-gray-500" }, "You can press Enter to create new paragraphs.")
                      ])
                    ]),
                    createVNode("div", { class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500" }, " Attachment"),
                      createVNode("div", { class: "flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 p-1 gap-1" }, [
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => setFileType("none"),
                          class: [fileType.value === "none" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", "flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 text-center"]
                        }, " None ", 10, ["onClick"]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => setFileType("file"),
                          class: [fileType.value === "file" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", "flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 text-center"]
                        }, " File ", 10, ["onClick"]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => setFileType("link"),
                          class: [fileType.value === "link" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", "flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 text-center"]
                        }, " Link ", 10, ["onClick"])
                      ]),
                      existingFilePath.value && fileType.value !== "none" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 text-amber-500 flex-shrink-0",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          })
                        ])),
                        createVNode("p", { class: "text-xs text-amber-700 dark:text-amber-400" }, [
                          createTextVNode(" Current attachment: "),
                          createVNode("span", { class: "font-semibold" }, toDisplayString(existingFileName.value), 1),
                          createTextVNode('. Upload a new file or enter a new link to replace it, or switch to "None" to remove it. ')
                        ])
                      ])) : createCommentVNode("", true),
                      fileType.value === "file" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "space-y-1.5"
                      }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, [
                          createTextVNode(" Choose File "),
                          createVNode("span", { class: "font-normal text-gray-400" }, "(Image, PDF, Excel, Word — max 10MB)")
                        ]),
                        createVNode("label", { class: "flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition group" }, [
                          createVNode("div", { class: "flex flex-col items-center gap-1 text-center px-4" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-7 h-7 text-gray-400 group-hover:text-blue-500 transition",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "1.5",
                                d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                              })
                            ])),
                            selectedFile.value ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-sm font-medium text-blue-600 dark:text-blue-400 truncate max-w-xs"
                            }, toDisplayString(selectedFile.value.name), 1)) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-sm text-gray-500 dark:text-gray-400"
                            }, " Click to upload a new file (leave empty to keep current) "))
                          ]),
                          createVNode("input", {
                            type: "file",
                            class: "hidden",
                            onChange: handleFile,
                            accept: ".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.doc,.docx,.zip"
                          }, null, 32)
                        ])
                      ])) : createCommentVNode("", true),
                      fileType.value === "link" ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "space-y-1.5"
                      }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, [
                          createTextVNode(" Enter Link "),
                          createVNode("span", { class: "font-normal text-gray-400" }, "(YouTube, Google Drive, etc.)")
                        ]),
                        withDirectives(createVNode("input", {
                          type: "url",
                          "onUpdate:modelValue": ($event) => form.link = $event,
                          maxlength: "2048",
                          class: "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition",
                          placeholder: "https://youtube.com/..."
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, form.link]
                        ])
                      ])) : createCommentVNode("", true),
                      fileType.value === "none" ? (openBlock(), createBlock("p", {
                        key: 3,
                        class: "text-sm text-gray-400 dark:text-gray-500 italic"
                      }, toDisplayString(existingFilePath.value ? "Current attachment will be removed on save." : "No attachment will be added."), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex justify-end gap-3 pt-2 pb-8" }, [
                      createVNode(unref(Link), {
                        href: unref(route)("siswa.assignment.index"),
                        class: "px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      createVNode("button", {
                        type: "submit",
                        disabled: sending.value,
                        class: "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-200 dark:shadow-none transition-all duration-200"
                      }, [
                        sending.value ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "animate-spin h-4 w-4 text-white",
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
                        createTextVNode(" " + toDisplayString(sending.value ? "Saving..." : "Save Changes"), 1)
                      ], 8, ["disabled"])
                    ])
                  ], 544)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Assignment/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
