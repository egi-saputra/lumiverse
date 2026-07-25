import { ref, withCtx, unref, createVNode, createTextVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { useForm, Link, router } from "@inertiajs/vue3";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import { QuillEditor } from "@vueup/vue-quill";
/* empty css                        */
import { ArrowLeftIcon, TrashIcon, PhotoIcon } from "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
import "sweetalert2";
import "ziggy-js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    pengumuman: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const { success, error } = ToastAlert();
    const form = useForm({
      judul: props.pengumuman.judul ?? "",
      pengumuman: props.pengumuman.pengumuman ?? "",
      file: null,
      video_url: props.pengumuman.video_url ?? "",
      remove_file: false
    });
    const existingFile = ref(props.pengumuman.file_url ?? null);
    const previewUrl = ref(null);
    const onFileChange = (e) => {
      const file = e.target.files[0] ?? null;
      form.file = file;
      form.remove_file = false;
      previewUrl.value = file ? URL.createObjectURL(file) : null;
    };
    const removeExisting = () => {
      existingFile.value = null;
      form.remove_file = true;
    };
    const removeNew = () => {
      form.file = null;
      previewUrl.value = null;
      const el = document.getElementById("file-input-edit");
      if (el) el.value = "";
    };
    const submit = () => {
      form.post(route("pengumuman.update", props.pengumuman.id), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => success("Pengumuman berhasil diperbarui!"),
        onError: () => error("Gagal memperbarui. Periksa isian form.")
      });
    };
    const confirmDelete = () => {
      if (!confirm("Hapus pengumuman ini? Tindakan tidak dapat dibatalkan.")) return;
      router.delete(route("pengumuman.destroy", props.pengumuman.id));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto px-4 py-6 space-y-6"${_scopeId}><div class="flex items-center justify-between"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("pengumuman.show", __props.pengumuman.id),
              class: "inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
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
            _push2(`<button class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Hapus </button></div><section class="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8"${_scopeId}><h1 class="text-xl font-bold text-gray-800 dark:text-white mb-6"${_scopeId}>Edit Pengumuman</h1><form class="space-y-6" novalidate${_scopeId}><div${_scopeId}><label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"${_scopeId}> Judul <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(form).judul)} type="text" maxlength="255" class="${ssrRenderClass([unref(form).errors.judul ? "border border-red-500 focus:ring-red-400" : "border border-gray-300 dark:border-white/10 focus:ring-indigo-500", "w-full rounded-xl px-4 py-3 transition bg-white dark:bg-[#0F172A] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:border-transparent"])}"${_scopeId}>`);
            if (unref(form).errors.judul) {
              _push2(`<p class="mt-1 text-xs text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.judul)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"${_scopeId}> Isi Pengumuman <span class="text-red-500"${_scopeId}>*</span></label><div class="${ssrRenderClass([unref(form).errors.pengumuman ? "border-red-500" : "border-gray-300 dark:border-white/10", "rounded-xl overflow-hidden border shadow-sm"])}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(QuillEditor), {
              content: unref(form).pengumuman,
              "onUpdate:content": ($event) => unref(form).pengumuman = $event,
              "content-type": "html",
              theme: "snow",
              class: "pengumuman-editor",
              toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["link"],
                ["clean"]
              ]
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(form).errors.pengumuman) {
              _push2(`<p class="mt-1 text-xs text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.pengumuman)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"${_scopeId}> Lampiran Gambar <span class="font-normal text-gray-400 dark:text-gray-500"${_scopeId}>(opsional)</span></label>`);
            if (existingFile.value && !previewUrl.value) {
              _push2(`<div class="mb-3 relative inline-block"${_scopeId}><img${ssrRenderAttr("src", existingFile.value)} alt="Gambar saat ini" class="max-h-48 rounded-xl border border-gray-200 dark:border-white/10 object-cover shadow-sm"${_scopeId}><button type="button" class="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else if (previewUrl.value) {
              _push2(`<div class="mb-3 relative inline-block"${_scopeId}><img${ssrRenderAttr("src", previewUrl.value)} alt="Preview baru" class="max-h-48 rounded-xl border border-indigo-300 dark:border-indigo-500 object-cover shadow-sm"${_scopeId}><button type="button" class="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!existingFile.value && !previewUrl.value) {
              _push2(`<!--[--><label for="file-input-edit" class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-indigo-400 text-gray-400 hover:text-indigo-500 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PhotoIcon), { class: "w-6 h-6 shrink-0" }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm"${_scopeId}>Pilih gambar baru</span></label><input id="file-input-edit" type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden"${_scopeId}><!--]-->`);
            } else if (existingFile.value && !previewUrl.value) {
              _push2(`<!--[--><label for="file-input-edit" class="inline-flex items-center gap-2 mt-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-medium border border-gray-300 dark:border-white/10 text-gray-500 hover:text-indigo-600 hover:border-indigo-400 transition"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PhotoIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Ganti gambar </label><input id="file-input-edit" type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden"${_scopeId}><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(form).errors.file) {
              _push2(`<p class="mt-1 text-xs text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.file)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"${_scopeId}> Link Video <span class="font-normal text-gray-400 dark:text-gray-500"${_scopeId}>(opsional, YouTube / Google Drive)</span></label><input${ssrRenderAttr("value", unref(form).video_url)} type="url" placeholder="https://www.youtube.com/watch?v=..." class="${ssrRenderClass([{ "border-red-500 focus:ring-red-400": unref(form).errors.video_url }, "w-full rounded-xl px-4 py-3 transition bg-white dark:bg-[#0F172A] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 border border-gray-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"])}"${_scopeId}>`);
            if (unref(form).errors.video_url) {
              _push2(`<p class="mt-1 text-xs text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.video_url)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex justify-end gap-3 pt-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("pengumuman.show", __props.pengumuman.id),
              class: "px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Batal `);
                } else {
                  return [
                    createTextVNode(" Batal ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition disabled:opacity-60"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(form).processing ? "Menyimpan..." : "Perbarui Pengumuman")}</button></div></form></section></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto px-4 py-6 space-y-6" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode(unref(Link), {
                    href: _ctx.route("pengumuman.show", __props.pengumuman.id),
                    class: "inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowLeftIcon), { class: "w-4 h-4" }),
                      createTextVNode(" Kembali ")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode("button", {
                    onClick: confirmDelete,
                    class: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition"
                  }, [
                    createVNode(unref(TrashIcon), { class: "w-4 h-4" }),
                    createTextVNode(" Hapus ")
                  ])
                ]),
                createVNode("section", { class: "rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8" }, [
                  createVNode("h1", { class: "text-xl font-bold text-gray-800 dark:text-white mb-6" }, "Edit Pengumuman"),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "space-y-6",
                    novalidate: ""
                  }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" }, [
                        createTextVNode(" Judul "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).judul = $event,
                        type: "text",
                        maxlength: "255",
                        class: ["w-full rounded-xl px-4 py-3 transition bg-white dark:bg-[#0F172A] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:border-transparent", unref(form).errors.judul ? "border border-red-500 focus:ring-red-400" : "border border-gray-300 dark:border-white/10 focus:ring-indigo-500"]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).judul]
                      ]),
                      unref(form).errors.judul ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-xs text-red-500"
                      }, toDisplayString(unref(form).errors.judul), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" }, [
                        createTextVNode(" Isi Pengumuman "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      createVNode("div", {
                        class: ["rounded-xl overflow-hidden border shadow-sm", unref(form).errors.pengumuman ? "border-red-500" : "border-gray-300 dark:border-white/10"]
                      }, [
                        createVNode(unref(QuillEditor), {
                          content: unref(form).pengumuman,
                          "onUpdate:content": ($event) => unref(form).pengumuman = $event,
                          "content-type": "html",
                          theme: "snow",
                          class: "pengumuman-editor",
                          toolbar: [
                            ["bold", "italic", "underline"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ align: [] }],
                            ["link"],
                            ["clean"]
                          ]
                        }, null, 8, ["content", "onUpdate:content"])
                      ], 2),
                      unref(form).errors.pengumuman ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-xs text-red-500"
                      }, toDisplayString(unref(form).errors.pengumuman), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" }, [
                        createTextVNode(" Lampiran Gambar "),
                        createVNode("span", { class: "font-normal text-gray-400 dark:text-gray-500" }, "(opsional)")
                      ]),
                      existingFile.value && !previewUrl.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mb-3 relative inline-block"
                      }, [
                        createVNode("img", {
                          src: existingFile.value,
                          alt: "Gambar saat ini",
                          class: "max-h-48 rounded-xl border border-gray-200 dark:border-white/10 object-cover shadow-sm"
                        }, null, 8, ["src"]),
                        createVNode("button", {
                          type: "button",
                          onClick: removeExisting,
                          class: "absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow transition"
                        }, [
                          createVNode(unref(TrashIcon), { class: "w-3.5 h-3.5" })
                        ])
                      ])) : previewUrl.value ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "mb-3 relative inline-block"
                      }, [
                        createVNode("img", {
                          src: previewUrl.value,
                          alt: "Preview baru",
                          class: "max-h-48 rounded-xl border border-indigo-300 dark:border-indigo-500 object-cover shadow-sm"
                        }, null, 8, ["src"]),
                        createVNode("button", {
                          type: "button",
                          onClick: removeNew,
                          class: "absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow transition"
                        }, [
                          createVNode(unref(TrashIcon), { class: "w-3.5 h-3.5" })
                        ])
                      ])) : createCommentVNode("", true),
                      !existingFile.value && !previewUrl.value ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                        createVNode("label", {
                          for: "file-input-edit",
                          class: "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-indigo-400 text-gray-400 hover:text-indigo-500 transition"
                        }, [
                          createVNode(unref(PhotoIcon), { class: "w-6 h-6 shrink-0" }),
                          createVNode("span", { class: "text-sm" }, "Pilih gambar baru")
                        ]),
                        createVNode("input", {
                          id: "file-input-edit",
                          type: "file",
                          accept: "image/jpeg,image/png,image/webp,image/gif",
                          class: "hidden",
                          onChange: onFileChange
                        }, null, 32)
                      ], 64)) : existingFile.value && !previewUrl.value ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                        createVNode("label", {
                          for: "file-input-edit",
                          class: "inline-flex items-center gap-2 mt-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-medium border border-gray-300 dark:border-white/10 text-gray-500 hover:text-indigo-600 hover:border-indigo-400 transition"
                        }, [
                          createVNode(unref(PhotoIcon), { class: "w-4 h-4" }),
                          createTextVNode(" Ganti gambar ")
                        ]),
                        createVNode("input", {
                          id: "file-input-edit",
                          type: "file",
                          accept: "image/jpeg,image/png,image/webp,image/gif",
                          class: "hidden",
                          onChange: onFileChange
                        }, null, 32)
                      ], 64)) : createCommentVNode("", true),
                      unref(form).errors.file ? (openBlock(), createBlock("p", {
                        key: 4,
                        class: "mt-1 text-xs text-red-500"
                      }, toDisplayString(unref(form).errors.file), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" }, [
                        createTextVNode(" Link Video "),
                        createVNode("span", { class: "font-normal text-gray-400 dark:text-gray-500" }, "(opsional, YouTube / Google Drive)")
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).video_url = $event,
                        type: "url",
                        placeholder: "https://www.youtube.com/watch?v=...",
                        class: ["w-full rounded-xl px-4 py-3 transition bg-white dark:bg-[#0F172A] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 border border-gray-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent", { "border-red-500 focus:ring-red-400": unref(form).errors.video_url }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).video_url]
                      ]),
                      unref(form).errors.video_url ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-xs text-red-500"
                      }, toDisplayString(unref(form).errors.video_url), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("pengumuman.show", __props.pengumuman.id),
                        class: "px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 transition"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Batal ")
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition disabled:opacity-60"
                      }, [
                        unref(form).processing ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "animate-spin w-4 h-4",
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
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          })
                        ])) : createCommentVNode("", true),
                        createTextVNode(" " + toDisplayString(unref(form).processing ? "Menyimpan..." : "Perbarui Pengumuman"), 1)
                      ], 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Pengumuman/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
