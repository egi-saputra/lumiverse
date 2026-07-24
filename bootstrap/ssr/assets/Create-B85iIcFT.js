import { reactive, ref, withCtx, createVNode, withModifiers, withDirectives, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, vModelText, createCommentVNode, unref, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { router } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { u as useAlert } from "./useAlert-BvFJG0MV.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    kelas: Array,
    subjects: Array
  },
  setup(__props) {
    useAlert();
    const form = reactive({
      kelas_id: "",
      mapel_id: "",
      judul: "",
      deskripsi: "",
      file: null,
      link: ""
    });
    const fileType = ref("none");
    const selectedFile = ref(null);
    const create = ref(false);
    const materiForm = ref(null);
    const handleFile = (e) => {
      selectedFile.value = e.target.files[0];
      form.file = selectedFile.value;
    };
    const submitMateri = () => {
      if (!materiForm.value.checkValidity()) {
        materiForm.value.reportValidity();
        return;
      }
      create.value = true;
      const formData = new FormData();
      formData.append("kelas_id", form.kelas_id);
      formData.append("mapel_id", form.mapel_id);
      formData.append("judul", form.judul);
      formData.append("deskripsi", form.deskripsi);
      if (fileType.value === "file") formData.append("file", form.file);
      if (fileType.value === "link") formData.append("link", form.link);
      router.post(route("guru.material.store"), formData, {
        onSuccess: () => {
          create.value = false;
          form.kelas_id = "";
          form.mapel_id = "";
          form.judul = "";
          form.deskripsi = "";
          form.file = null;
          form.link = "";
          fileType.value = "none";
          selectedFile.value = null;
        },
        onError: () => {
          create.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen sm:p-6 flex justify-center items-start"${_scopeId}><div class="w-full max-w-7xl rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800"${_scopeId}><h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white"${_scopeId}>Submit Materials</h1><form class="space-y-6"${_scopeId}><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block mb-1 font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Recipient</label><select required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.kelas_id) ? ssrLooseContain(form.kelas_id, "") : ssrLooseEqual(form.kelas_id, "")) ? " selected" : ""}${_scopeId}>Select Class</option><!--[-->`);
            ssrRenderList(__props.kelas, (kelas) => {
              _push2(`<option${ssrRenderAttr("value", kelas.id)}${ssrIncludeBooleanAttr(Array.isArray(form.kelas_id) ? ssrLooseContain(form.kelas_id, kelas.id) : ssrLooseEqual(form.kelas_id, kelas.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(kelas.kelas)}</option>`);
            });
            _push2(`<!--]--></select></div><div${_scopeId}><label class="block mb-1 font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Subject</label><select required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.mapel_id) ? ssrLooseContain(form.mapel_id, "") : ssrLooseEqual(form.mapel_id, "")) ? " selected" : ""}${_scopeId}>Select subject</option><!--[-->`);
            ssrRenderList(__props.subjects, (subject) => {
              _push2(`<option${ssrRenderAttr("value", subject.id)}${ssrIncludeBooleanAttr(Array.isArray(form.mapel_id) ? ssrLooseContain(form.mapel_id, subject.id) : ssrLooseEqual(form.mapel_id, subject.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(subject.mapel)}</option>`);
            });
            _push2(`<!--]--></select></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block mb-1 font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Title</label><input type="text"${ssrRenderAttr("value", form.judul)} required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Enter title"${_scopeId}></div><div${_scopeId}><label class="block mb-1 font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Attachment Type</label><select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"${_scopeId}><option value="none"${ssrIncludeBooleanAttr(Array.isArray(fileType.value) ? ssrLooseContain(fileType.value, "none") : ssrLooseEqual(fileType.value, "none")) ? " selected" : ""}${_scopeId}>No Attachment</option><option value="file"${ssrIncludeBooleanAttr(Array.isArray(fileType.value) ? ssrLooseContain(fileType.value, "file") : ssrLooseEqual(fileType.value, "file")) ? " selected" : ""}${_scopeId}>File (Image, PDF, Excel, Word)</option><option value="link"${ssrIncludeBooleanAttr(Array.isArray(fileType.value) ? ssrLooseContain(fileType.value, "link") : ssrLooseEqual(fileType.value, "link")) ? " selected" : ""}${_scopeId}>Link (Video, PPT)</option></select></div></div><div${_scopeId}><label class="block mb-1 font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Description</label><textarea required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Enter description"${_scopeId}>${ssrInterpolate(form.deskripsi)}</textarea></div>`);
            if (fileType.value === "file") {
              _push2(`<div${_scopeId}><label class="block mb-1 font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Choose File</label><input type="file" required class="w-full border border-gray-300 rounded-lg px-3 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (fileType.value === "link") {
              _push2(`<div${_scopeId}><label class="block mb-1 font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Enter Link</label><input type="url"${ssrRenderAttr("value", form.link)} required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="https://example.com/video-or-ppt"${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-end space-x-4 mt-6"${_scopeId}><button type="button" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg flex items-center justify-center transition-all duration-200"${_scopeId}> Cancel </button><button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-all duration-200"${ssrIncludeBooleanAttr(create.value) ? " disabled" : ""}${_scopeId}>`);
            if (create.value) {
              _push2(`<svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(create.value ? "Creating..." : "Create Material")}</button></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen sm:p-6 flex justify-center items-start" }, [
                createVNode("div", { class: "w-full max-w-7xl rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800" }, [
                  createVNode("h1", { class: "text-3xl font-bold mb-6 text-gray-900 dark:text-white" }, "Submit Materials"),
                  createVNode("form", {
                    ref_key: "materiForm",
                    ref: materiForm,
                    onSubmit: withModifiers(submitMateri, ["prevent"]),
                    class: "space-y-6"
                  }, [
                    createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block mb-1 font-medium text-gray-700 dark:text-gray-200" }, "Recipient"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => form.kelas_id = $event,
                          required: "",
                          class: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        }, [
                          createVNode("option", {
                            value: "",
                            disabled: ""
                          }, "Select Class"),
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.kelas, (kelas) => {
                            return openBlock(), createBlock("option", {
                              key: kelas.id,
                              value: kelas.id
                            }, toDisplayString(kelas.kelas), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, form.kelas_id]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block mb-1 font-medium text-gray-700 dark:text-gray-200" }, "Subject"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => form.mapel_id = $event,
                          required: "",
                          class: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        }, [
                          createVNode("option", {
                            value: "",
                            disabled: ""
                          }, "Select subject"),
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.subjects, (subject) => {
                            return openBlock(), createBlock("option", {
                              key: subject.id,
                              value: subject.id
                            }, toDisplayString(subject.mapel), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, form.mapel_id]
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block mb-1 font-medium text-gray-700 dark:text-gray-200" }, "Title"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => form.judul = $event,
                          required: "",
                          class: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600",
                          placeholder: "Enter title"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, form.judul]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block mb-1 font-medium text-gray-700 dark:text-gray-200" }, "Attachment Type"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => fileType.value = $event,
                          class: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        }, [
                          createVNode("option", { value: "none" }, "No Attachment"),
                          createVNode("option", { value: "file" }, "File (Image, PDF, Excel, Word)"),
                          createVNode("option", { value: "link" }, "Link (Video, PPT)")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, fileType.value]
                        ])
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block mb-1 font-medium text-gray-700 dark:text-gray-200" }, "Description"),
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => form.deskripsi = $event,
                        required: "",
                        class: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600",
                        placeholder: "Enter description"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.deskripsi]
                      ])
                    ]),
                    fileType.value === "file" ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode("label", { class: "block mb-1 font-medium text-gray-700 dark:text-gray-200" }, "Choose File"),
                      createVNode("input", {
                        type: "file",
                        onChange: handleFile,
                        required: "",
                        class: "w-full border border-gray-300 rounded-lg px-3 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      }, null, 32)
                    ])) : createCommentVNode("", true),
                    fileType.value === "link" ? (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode("label", { class: "block mb-1 font-medium text-gray-700 dark:text-gray-200" }, "Enter Link"),
                      withDirectives(createVNode("input", {
                        type: "url",
                        "onUpdate:modelValue": ($event) => form.link = $event,
                        required: "",
                        class: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600",
                        placeholder: "https://example.com/video-or-ppt"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.link]
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "flex justify-end space-x-4 mt-6" }, [
                      createVNode("button", {
                        type: "button",
                        onClick: ($event) => unref(router).get(unref(route)("guru.material.index")),
                        class: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg flex items-center justify-center transition-all duration-200"
                      }, " Cancel ", 8, ["onClick"]),
                      createVNode("button", {
                        type: "submit",
                        class: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-all duration-200",
                        disabled: create.value
                      }, [
                        create.value ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "animate-spin h-5 w-5 mr-2 text-white",
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
                        createTextVNode(" " + toDisplayString(create.value ? "Creating..." : "Create Material"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Material/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
