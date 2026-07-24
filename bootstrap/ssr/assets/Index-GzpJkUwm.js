import { withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, Fragment, withModifiers, createTextVNode, createCommentVNode, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Link } from "@inertiajs/vue3";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: { materials: Array },
  setup(__props) {
    const isImage = (path) => ["jpg", "jpeg", "png", "svg", "webp"].includes(path.split(".").pop().toLowerCase());
    const isVideo = (path) => ["mp4", "webm", "ogg"].includes(path.split(".").pop().toLowerCase());
    const isPdf = (path) => path.split(".").pop().toLowerCase() === "pdf";
    const isExternal = (path) => path.startsWith("http");
    const isExternalVideo = (path) => {
      if (!isExternal(path)) return false;
      return path.includes("youtube.com") || path.includes("youtu.be") || path.includes("drive.google.com");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen sm:p-6 pb-20 relative"${_scopeId}><div class="flex justify-between items-center mb-6"${_scopeId}><h1 class="sm:text-3xl text-xl font-bold text-gray-900 dark:text-white"${_scopeId}>Learning Material List</h1></div><div class="grid grid-cols-1 gap-6"${_scopeId}><!--[-->`);
            ssrRenderList(__props.materials, (materi) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: materi.id,
                href: _ctx.route("siswa.material.show", materi.id),
                class: "relative cursor-pointer bg-transparent dark:bg-gradient-to-r dark:from-blue-400/20 dark:via-blue-500/20 dark:to-blue-700/10 border border-gray-400 dark:border-blue-600 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col justify-between transition hover:border-blue-600"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div${_scopeId2}><h2 class="text-xl font-semibold dark:text-white mb-2"${_scopeId2}> Title : ${ssrInterpolate(materi.judul)}</h2><p class="dark:text-gray-200 font-semibold text-sm mb-2"${_scopeId2}>${ssrInterpolate(materi.deskripsi)}</p><div class="flex flex-col space-y-2"${_scopeId2}>`);
                    if (materi.file_path) {
                      _push3(`<!--[-->`);
                      if (isImage(materi.file_path)) {
                        _push3(`<div${_scopeId2}><p class="text-sm sm:text-xs dark:text-gray-300"${_scopeId2}>Materi ini menggunakan sebuah gambar/image.</p></div>`);
                      } else if (isVideo(materi.file_path) && !isExternal(materi.file_path)) {
                        _push3(`<div${_scopeId2}><video class="mt-2 w-full max-h-48 rounded" controls${_scopeId2}><source${ssrRenderAttr("src", materi.file_url)} type="video/mp4"${_scopeId2}> Your browser does not support the video tag. </video></div>`);
                      } else if (isExternalVideo(materi.file_path)) {
                        _push3(`<div${_scopeId2}><p class="text-sm sm:text-xs dark:text-gray-300"${_scopeId2}>Materi ini memiliki sebuah video. </p></div>`);
                      } else if (isPdf(materi.file_path)) {
                        _push3(`<div${_scopeId2}><p class="text-sm sm:text-xs dark:text-gray-300"${_scopeId2}>Materi ini menggunakan file pdf. </p></div>`);
                      } else {
                        _push3(`<div${_scopeId2}><p class="text-sm dark:text-gray-300"${_scopeId2}> Materi ini menggunakan file word/excel/docx. </p></div>`);
                      }
                      _push3(`<!--]-->`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div class="flex sm:flex-row mt-6 flex-col justify-between"${_scopeId2}><div class="flex sm:flex-row flex-col gap-3"${_scopeId2}><p class="bg-blue-100 p-1 text-center rounded-full px-4 text-xs font-semibold border border-blue-500 text-blue-600"${_scopeId2}> Subject: ${ssrInterpolate(materi.mapel.mapel)}</p><p class="sm:bg-amber-100 sm:p-1 dark:text-gray-300 sm:rounded-full sm:px-4 text-xs sm:font-semibold sm:border sm:border-amber-500 dark:sm:text-amber-600 sm:text-amber-600"${_scopeId2}> Author: <span class="sm:font-semibold dark:text-gray-300 dark:sm:text-amber-600 sm:text-amber-600"${_scopeId2}>${ssrInterpolate(materi.guru.nama_lengkap)}</span></p></div></div></div>`);
                  } else {
                    return [
                      createVNode("div", null, [
                        createVNode("h2", { class: "text-xl font-semibold dark:text-white mb-2" }, " Title : " + toDisplayString(materi.judul), 1),
                        createVNode("p", { class: "dark:text-gray-200 font-semibold text-sm mb-2" }, toDisplayString(materi.deskripsi), 1),
                        createVNode("div", { class: "flex flex-col space-y-2" }, [
                          materi.file_path ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            isImage(materi.file_path) ? (openBlock(), createBlock("div", { key: 0 }, [
                              createVNode("p", { class: "text-sm sm:text-xs dark:text-gray-300" }, "Materi ini menggunakan sebuah gambar/image.")
                            ])) : isVideo(materi.file_path) && !isExternal(materi.file_path) ? (openBlock(), createBlock("div", { key: 1 }, [
                              createVNode("video", {
                                onClick: withModifiers(() => {
                                }, ["stop"]),
                                class: "mt-2 w-full max-h-48 rounded",
                                controls: ""
                              }, [
                                createVNode("source", {
                                  src: materi.file_url,
                                  type: "video/mp4"
                                }, null, 8, ["src"]),
                                createTextVNode(" Your browser does not support the video tag. ")
                              ], 8, ["onClick"])
                            ])) : isExternalVideo(materi.file_path) ? (openBlock(), createBlock("div", { key: 2 }, [
                              createVNode("p", { class: "text-sm sm:text-xs dark:text-gray-300" }, "Materi ini memiliki sebuah video. ")
                            ])) : isPdf(materi.file_path) ? (openBlock(), createBlock("div", { key: 3 }, [
                              createVNode("p", { class: "text-sm sm:text-xs dark:text-gray-300" }, "Materi ini menggunakan file pdf. ")
                            ])) : (openBlock(), createBlock("div", { key: 4 }, [
                              createVNode("p", { class: "text-sm dark:text-gray-300" }, " Materi ini menggunakan file word/excel/docx. ")
                            ]))
                          ], 64)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex sm:flex-row mt-6 flex-col justify-between" }, [
                          createVNode("div", { class: "flex sm:flex-row flex-col gap-3" }, [
                            createVNode("p", { class: "bg-blue-100 p-1 text-center rounded-full px-4 text-xs font-semibold border border-blue-500 text-blue-600" }, " Subject: " + toDisplayString(materi.mapel.mapel), 1),
                            createVNode("p", { class: "sm:bg-amber-100 sm:p-1 dark:text-gray-300 sm:rounded-full sm:px-4 text-xs sm:font-semibold sm:border sm:border-amber-500 dark:sm:text-amber-600 sm:text-amber-600" }, [
                              createTextVNode(" Author: "),
                              createVNode("span", { class: "sm:font-semibold dark:text-gray-300 dark:sm:text-amber-600 sm:text-amber-600" }, toDisplayString(materi.guru.nama_lengkap), 1)
                            ])
                          ])
                        ])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
            if (__props.materials.length === 0) {
              _push2(`<div class="col-span-full text-center text-gray-500 dark:text-gray-400"${_scopeId}> No learning materials submitted yet. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen sm:p-6 pb-20 relative" }, [
                createVNode("div", { class: "flex justify-between items-center mb-6" }, [
                  createVNode("h1", { class: "sm:text-3xl text-xl font-bold text-gray-900 dark:text-white" }, "Learning Material List")
                ]),
                createVNode("div", { class: "grid grid-cols-1 gap-6" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.materials, (materi) => {
                    return openBlock(), createBlock(unref(Link), {
                      key: materi.id,
                      href: _ctx.route("siswa.material.show", materi.id),
                      class: "relative cursor-pointer bg-transparent dark:bg-gradient-to-r dark:from-blue-400/20 dark:via-blue-500/20 dark:to-blue-700/10 border border-gray-400 dark:border-blue-600 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col justify-between transition hover:border-blue-600"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", null, [
                          createVNode("h2", { class: "text-xl font-semibold dark:text-white mb-2" }, " Title : " + toDisplayString(materi.judul), 1),
                          createVNode("p", { class: "dark:text-gray-200 font-semibold text-sm mb-2" }, toDisplayString(materi.deskripsi), 1),
                          createVNode("div", { class: "flex flex-col space-y-2" }, [
                            materi.file_path ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              isImage(materi.file_path) ? (openBlock(), createBlock("div", { key: 0 }, [
                                createVNode("p", { class: "text-sm sm:text-xs dark:text-gray-300" }, "Materi ini menggunakan sebuah gambar/image.")
                              ])) : isVideo(materi.file_path) && !isExternal(materi.file_path) ? (openBlock(), createBlock("div", { key: 1 }, [
                                createVNode("video", {
                                  onClick: withModifiers(() => {
                                  }, ["stop"]),
                                  class: "mt-2 w-full max-h-48 rounded",
                                  controls: ""
                                }, [
                                  createVNode("source", {
                                    src: materi.file_url,
                                    type: "video/mp4"
                                  }, null, 8, ["src"]),
                                  createTextVNode(" Your browser does not support the video tag. ")
                                ], 8, ["onClick"])
                              ])) : isExternalVideo(materi.file_path) ? (openBlock(), createBlock("div", { key: 2 }, [
                                createVNode("p", { class: "text-sm sm:text-xs dark:text-gray-300" }, "Materi ini memiliki sebuah video. ")
                              ])) : isPdf(materi.file_path) ? (openBlock(), createBlock("div", { key: 3 }, [
                                createVNode("p", { class: "text-sm sm:text-xs dark:text-gray-300" }, "Materi ini menggunakan file pdf. ")
                              ])) : (openBlock(), createBlock("div", { key: 4 }, [
                                createVNode("p", { class: "text-sm dark:text-gray-300" }, " Materi ini menggunakan file word/excel/docx. ")
                              ]))
                            ], 64)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex sm:flex-row mt-6 flex-col justify-between" }, [
                            createVNode("div", { class: "flex sm:flex-row flex-col gap-3" }, [
                              createVNode("p", { class: "bg-blue-100 p-1 text-center rounded-full px-4 text-xs font-semibold border border-blue-500 text-blue-600" }, " Subject: " + toDisplayString(materi.mapel.mapel), 1),
                              createVNode("p", { class: "sm:bg-amber-100 sm:p-1 dark:text-gray-300 sm:rounded-full sm:px-4 text-xs sm:font-semibold sm:border sm:border-amber-500 dark:sm:text-amber-600 sm:text-amber-600" }, [
                                createTextVNode(" Author: "),
                                createVNode("span", { class: "sm:font-semibold dark:text-gray-300 dark:sm:text-amber-600 sm:text-amber-600" }, toDisplayString(materi.guru.nama_lengkap), 1)
                              ])
                            ])
                          ])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["href"]);
                  }), 128))
                ]),
                __props.materials.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "col-span-full text-center text-gray-500 dark:text-gray-400"
                }, " No learning materials submitted yet. ")) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Material/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
