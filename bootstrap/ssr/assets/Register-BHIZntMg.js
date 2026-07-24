import { ref, computed, withCtx, unref, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { useForm, usePage, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import Swal from "sweetalert2";
import axios from "axios";
import { route } from "ziggy-js";
import { DocumentArrowUpIcon } from "@heroicons/vue/24/solid";
import "./Sidebar-COsy3wF2.js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
const _sfc_main = {
  __name: "Register",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      nama_lengkap: "",
      email: "",
      password: "",
      kelas_id: "",
      kejuruan_id: "",
      excel: null,
      processing: false
    });
    const fileInput = ref(null);
    const page = usePage();
    const isSmk = computed(
      () => (page.props.tenant?.school_level ?? "").toString().toLowerCase() === "smk"
    );
    const kelasAll = ref([...page.props.kelasList]);
    const kejuruanList = ref([...page.props.kejuruanList || []]);
    const submitManual = async () => {
      form.processing = true;
      try {
        const res = await axios.post(route("proktor.peserta.register.store"), {
          nama_lengkap: form.nama_lengkap,
          email: form.email,
          password: form.password,
          kelas_id: form.kelas_id,
          kejuruan_id: form.kejuruan_id
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: res.data.success || "Peserta berhasil didaftarkan.",
          toast: true,
          position: "top-end",
          timer: 3e3,
          showConfirmButton: false
        });
        form.reset();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: err.response?.data?.error || "Gagal submit peserta.",
          toast: true,
          position: "top-end",
          timer: 3e3,
          showConfirmButton: false
        });
      } finally {
        form.processing = false;
      }
    };
    const handleFileChange = (e) => {
      form.excel = e.target.files[0] || null;
    };
    const fileName = computed(() => form.excel?.name || "");
    const isProcessing = computed(() => form.processing);
    const submitExcel = async () => {
      if (!form.excel) {
        return Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Pilih file Excel terlebih dahulu!",
          toast: true,
          position: "top-end",
          timer: 3e3,
          showConfirmButton: false
        });
      }
      const data = new FormData();
      data.append("excel", form.excel);
      form.processing = true;
      router.post(route("proktor.peserta.import"), data);
      form.processing = false;
    };
    const downloadTemplate = async () => {
      try {
        const res = await axios.get(route("proktor.peserta.template"), { responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "template_peserta.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Gagal download template", "error");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="sm:px-6 mx-auto"${_scopeId}><h1 class="sm:text-3xl text-xl font-bold dark:text-white text-[#063970] mb-8"${_scopeId}>Form Register Peserta Didik </h1><div class="bg-white dark:bg-white/5 dark:border-gray-700 shadow-sm border border-gray-300 rounded-lg p-6 mb-8"${_scopeId}><h2 class="sm:text-xl text-lg font-semibold dark:text-gray-200 text-gray-700 mb-4"${_scopeId}>Daftarkan Peserta Didik</h2><form class="flex flex-wrap gap-4"${_scopeId}><div class="w-full mt-2"${_scopeId}><input${ssrRenderAttr("value", unref(form).nama_lengkap)} type="text" placeholder="Nama Lengkap" required class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}></div><div class="sm:flex-1 sm:min-w-[45%] w-full"${_scopeId}><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="Email Address" required class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}></div><div class="sm:flex-1 sm:min-w-[45%] w-full"${_scopeId}><input${ssrRenderAttr("value", unref(form).password)} type="password" placeholder="Password" required class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}></div><div class="sm:flex-1 sm:min-w-[45%] w-full"${_scopeId}><select required class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, "") : ssrLooseEqual(unref(form).kelas_id, "")) ? " selected" : ""}${_scopeId}>-- Pilih Kelas --</option><!--[-->`);
            ssrRenderList(kelasAll.value, (k) => {
              _push2(`<option${ssrRenderAttr("value", k.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, k.id) : ssrLooseEqual(unref(form).kelas_id, k.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k.kelas)}</option>`);
            });
            _push2(`<!--]--></select></div>`);
            if (isSmk.value) {
              _push2(`<div class="sm:flex-1 sm:min-w-[45%] w-full"${_scopeId}><select required class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).kejuruan_id) ? ssrLooseContain(unref(form).kejuruan_id, "") : ssrLooseEqual(unref(form).kejuruan_id, "")) ? " selected" : ""}${_scopeId}>-- Pilih Kejuruan --</option><!--[-->`);
              ssrRenderList(kejuruanList.value, (kj) => {
                _push2(`<option${ssrRenderAttr("value", kj.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).kejuruan_id) ? ssrLooseContain(unref(form).kejuruan_id, kj.id) : ssrLooseEqual(unref(form).kejuruan_id, kj.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(kj.kejuruan)}</option>`);
              });
              _push2(`<!--]--></select></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="w-full mt-2"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="bg-[#063970] text-white px-6 py-3 rounded-lg transition font-semibold shadow-md hover:bg-[#052d5a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<svg class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(form).processing ? "Processing..." : "Daftarkan")}</span></button></div></form></div><div class="border border-gray-300 dark:border-gray-700 p-6 rounded-lg dark:bg-white/5 bg-white text-center space-y-4"${_scopeId}><h2 class="text-xl font-semibold dark:text-white text-gray-700 mb-2"${_scopeId}>Import Peserta dari Excel</h2><label class="flex flex-col items-center border-dashed justify-center cursor-pointer border dark:border-gray-700 border-gray-300 max-w-2xl mx-auto rounded-lg p-4 bg-white dark:bg-white/5 dark:hover:bg-gray-900 hover:bg-gray-100 transition"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DocumentArrowUpIcon), { class: "w-10 h-10 text-blue-500 mb-2" }, null, _parent2, _scopeId));
            _push2(`<span class="text-gray-600 dark:text-gray-400 font-semibold mb-1"${_scopeId}>Upload File Peserta</span><span class="text-gray-400 text-sm"${_scopeId}>(.xlsx / .xls)</span><input type="file" accept=".xls,.xlsx" class="hidden"${_scopeId}></label>`);
            if (fileName.value) {
              _push2(`<p class="text-red-600 font-extrabold"${_scopeId}>${ssrInterpolate(fileName.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-col md:flex-row justify-center gap-3 mt-2"${_scopeId}><button type="button" class="${ssrRenderClass([
              "px-4 py-2 rounded text-white font-medium flex items-center justify-center gap-2 transition cursor-pointer",
              isProcessing.value ? "bg-gray-400 cursor-not-allowed" : "bg-[#063970] hover:bg-gray-800"
            ])}"${ssrIncludeBooleanAttr(!fileName.value || isProcessing.value) ? " disabled" : ""}${_scopeId}>`);
            if (isProcessing.value) {
              _push2(`<svg class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(isProcessing.value ? "Importing..." : "Import File")}</span></button><button type="button" class="px-4 py-2 text-[#063970] border border-[#063970] font-semibold rounded dark:text-white dark:border-gray-400 hover:bg-gray-100 dark:hover:text-gray-800 transition"${_scopeId}> Download </button></div><p class="text-gray-500 mt-2 text-sm"${_scopeId}>Pastikan format Excel sesuai template.</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "sm:px-6 mx-auto" }, [
                createVNode("h1", { class: "sm:text-3xl text-xl font-bold dark:text-white text-[#063970] mb-8" }, "Form Register Peserta Didik "),
                createVNode("div", { class: "bg-white dark:bg-white/5 dark:border-gray-700 shadow-sm border border-gray-300 rounded-lg p-6 mb-8" }, [
                  createVNode("h2", { class: "sm:text-xl text-lg font-semibold dark:text-gray-200 text-gray-700 mb-4" }, "Daftarkan Peserta Didik"),
                  createVNode("form", {
                    onSubmit: withModifiers(submitManual, ["prevent"]),
                    class: "flex flex-wrap gap-4"
                  }, [
                    createVNode("div", { class: "w-full mt-2" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).nama_lengkap = $event,
                        type: "text",
                        placeholder: "Nama Lengkap",
                        required: "",
                        class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).nama_lengkap]
                      ])
                    ]),
                    createVNode("div", { class: "sm:flex-1 sm:min-w-[45%] w-full" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).email = $event,
                        type: "email",
                        placeholder: "Email Address",
                        required: "",
                        class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).email]
                      ])
                    ]),
                    createVNode("div", { class: "sm:flex-1 sm:min-w-[45%] w-full" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).password = $event,
                        type: "password",
                        placeholder: "Password",
                        required: "",
                        class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).password]
                      ])
                    ]),
                    createVNode("div", { class: "sm:flex-1 sm:min-w-[45%] w-full" }, [
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).kelas_id = $event,
                        required: "",
                        class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                      }, [
                        createVNode("option", { value: "" }, "-- Pilih Kelas --"),
                        (openBlock(true), createBlock(Fragment, null, renderList(kelasAll.value, (k) => {
                          return openBlock(), createBlock("option", {
                            key: k.id,
                            value: k.id
                          }, toDisplayString(k.kelas), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).kelas_id]
                      ])
                    ]),
                    isSmk.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "sm:flex-1 sm:min-w-[45%] w-full"
                    }, [
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).kejuruan_id = $event,
                        required: "",
                        class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                      }, [
                        createVNode("option", { value: "" }, "-- Pilih Kejuruan --"),
                        (openBlock(true), createBlock(Fragment, null, renderList(kejuruanList.value, (kj) => {
                          return openBlock(), createBlock("option", {
                            key: kj.id,
                            value: kj.id
                          }, toDisplayString(kj.kejuruan), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).kejuruan_id]
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "w-full mt-2" }, [
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "bg-[#063970] text-white px-6 py-3 rounded-lg transition font-semibold shadow-md hover:bg-[#052d5a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full"
                      }, [
                        unref(form).processing ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "w-5 h-5 animate-spin text-white",
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
                        createVNode("span", null, toDisplayString(unref(form).processing ? "Processing..." : "Daftarkan"), 1)
                      ], 8, ["disabled"])
                    ])
                  ], 32)
                ]),
                createVNode("div", { class: "border border-gray-300 dark:border-gray-700 p-6 rounded-lg dark:bg-white/5 bg-white text-center space-y-4" }, [
                  createVNode("h2", { class: "text-xl font-semibold dark:text-white text-gray-700 mb-2" }, "Import Peserta dari Excel"),
                  createVNode("label", { class: "flex flex-col items-center border-dashed justify-center cursor-pointer border dark:border-gray-700 border-gray-300 max-w-2xl mx-auto rounded-lg p-4 bg-white dark:bg-white/5 dark:hover:bg-gray-900 hover:bg-gray-100 transition" }, [
                    createVNode(unref(DocumentArrowUpIcon), { class: "w-10 h-10 text-blue-500 mb-2" }),
                    createVNode("span", { class: "text-gray-600 dark:text-gray-400 font-semibold mb-1" }, "Upload File Peserta"),
                    createVNode("span", { class: "text-gray-400 text-sm" }, "(.xlsx / .xls)"),
                    createVNode("input", {
                      type: "file",
                      ref_key: "fileInput",
                      ref: fileInput,
                      onChange: handleFileChange,
                      accept: ".xls,.xlsx",
                      class: "hidden"
                    }, null, 544)
                  ]),
                  fileName.value ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-red-600 font-extrabold"
                  }, toDisplayString(fileName.value), 1)) : createCommentVNode("", true),
                  createVNode("div", { class: "flex flex-col md:flex-row justify-center gap-3 mt-2" }, [
                    createVNode("button", {
                      type: "button",
                      onClick: submitExcel,
                      class: [
                        "px-4 py-2 rounded text-white font-medium flex items-center justify-center gap-2 transition cursor-pointer",
                        isProcessing.value ? "bg-gray-400 cursor-not-allowed" : "bg-[#063970] hover:bg-gray-800"
                      ],
                      disabled: !fileName.value || isProcessing.value
                    }, [
                      isProcessing.value ? (openBlock(), createBlock("svg", {
                        key: 0,
                        class: "w-5 h-5 animate-spin text-white",
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
                      createVNode("span", null, toDisplayString(isProcessing.value ? "Importing..." : "Import File"), 1)
                    ], 10, ["disabled"]),
                    createVNode("button", {
                      type: "button",
                      onClick: downloadTemplate,
                      class: "px-4 py-2 text-[#063970] border border-[#063970] font-semibold rounded dark:text-white dark:border-gray-400 hover:bg-gray-100 dark:hover:text-gray-800 transition"
                    }, " Download ")
                  ]),
                  createVNode("p", { class: "text-gray-500 mt-2 text-sm" }, "Pastikan format Excel sesuai template.")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Proktor/Peserta/Register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
