import { withCtx, openBlock, createBlock, createVNode, toDisplayString, createTextVNode, Fragment, withModifiers, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { format } from "date-fns";
import "@inertiajs/vue3";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: { material: Object },
  setup(__props) {
    const formatDate = (date) => format(new Date(date), "dd MMM yyyy, HH:mm");
    const isImage = (path) => ["jpg", "jpeg", "png", "svg", "webp"].includes(path.split(".").pop().toLowerCase());
    const isVideo = (path) => ["mp4", "webm", "ogg"].includes(path.split(".").pop().toLowerCase());
    const isPdf = (path) => path.split(".").pop().toLowerCase() === "pdf";
    const previewFile = (material) => window.open(material.file_url, "_blank");
    const isWord = (path) => ["doc", "docx"].includes(path.split(".").pop().toLowerCase());
    const isExcel = (path) => ["xls", "xlsx"].includes(path.split(".").pop().toLowerCase());
    const isExternal = (path) => path.startsWith("http");
    const isExternalVideo = (path) => {
      if (!isExternal(path)) return false;
      return path.includes("youtube.com") || path.includes("youtu.be") || path.includes("drive.google.com");
    };
    const getVideoEmbedUrl = (url) => {
      if (url.includes("youtu.be")) {
        const id = url.split("/").pop();
        return `https://www.youtube.com/embed/${id}`;
      } else if (url.includes("youtube.com")) {
        const params = new URL(url).searchParams;
        return `https://www.youtube.com/embed/${params.get("v")}`;
      } else if (url.includes("drive.google.com")) {
        const idMatch = url.match(/\/d\/(.*?)\//);
        if (idMatch) return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }
      return url;
    };
    const getPdfEmbedUrl = (material) => {
      if (!material?.file_path) return "";
      if (material.file_path.includes("drive.google.com")) {
        const match = material.file_path.match(/\/d\/([^/]+)/);
        if (match) {
          return `https://drive.google.com/file/d/${match[1]}/preview`;
        }
      }
      return material.file_url;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.material) {
              _push2(`<div class="sm:p-6"${_scopeId}><h1 class="text-2xl mb-3 font-bold dark:text-white"${_scopeId}>${ssrInterpolate(__props.material.judul)}</h1><div class="flex gap-3"${_scopeId}><p class="bg-blue-50 p-1 rounded-full px-4 text-xs font-semibold mb-2 border border-blue-500 text-blue-600"${_scopeId}> Subject: ${ssrInterpolate(__props.material.mapel.mapel)}</p><p class="bg-amber-50 p-1 rounded-full px-4 text-xs font-semibold mb-2 border border-amber-500 text-amber-600"${_scopeId}> Author: <span class="font-semibold"${_scopeId}>${ssrInterpolate(__props.material.guru.nama_lengkap)}</span></p></div><div class="flex flex-col space-y-2"${_scopeId}>`);
              if (__props.material.file_path) {
                _push2(`<!--[-->`);
                if (isImage(__props.material.file_path)) {
                  _push2(`<div${_scopeId}><img${ssrRenderAttr("src", __props.material.file_url)} alt="preview" class="mt-2 w-full mb-3 object-cover rounded shadow-lg"${_scopeId}><div class="flex w-full justify-end"${_scopeId}><button class="bg-blue-700 text-white hover:bg-gray-300 px-6 mb-3 py-2 rounded text-sm font-semibold"${_scopeId}> View Image </button></div></div>`);
                } else if (isVideo(__props.material.file_path) && !isExternal(__props.material.file_path)) {
                  _push2(`<div${_scopeId}><video class="mt-2 w-full max-h-48 rounded" controls${_scopeId}><source${ssrRenderAttr("src", __props.material.file_url)} type="video/mp4"${_scopeId}> Your browser does not support the video tag. </video></div>`);
                } else if (isExternalVideo(__props.material.file_path)) {
                  _push2(`<div class="my-6 mb-12 w-full aspect-video border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden"${_scopeId}><iframe class="w-full h-full border rounded-lg"${ssrRenderAttr("src", getVideoEmbedUrl(__props.material.file_path))} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen${_scopeId}></iframe></div>`);
                } else if (isPdf(__props.material.file_path)) {
                  _push2(`<div class="mt-4 w-full space-y-2"${_scopeId}><div class="h-[70vh] border rounded overflow-hidden bg-gray-100 dark:bg-gray-800"${_scopeId}><iframe class="w-full h-full"${ssrRenderAttr("src", getPdfEmbedUrl(__props.material))} frameborder="0"${_scopeId}></iframe></div><div class="flex justify-end"${_scopeId}><a${ssrRenderAttr("href", __props.material.file_url)} target="_blank" class="text-sm my-4 py-2 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"${_scopeId}> Buka di tab baru </a></div></div>`);
                } else if (isWord(__props.material.file_path) || isExcel(__props.material.file_path)) {
                  _push2(`<div class="sm:my-12 my-6 border sm:mx-auto p-10 sm:p-12 sm:px-40 border-dashed rounded-lg justify-center items-center dark:bg-white/5 bg-gray-100 dark:bg-gray-800"${_scopeId}><p class="font-semibold text-gray-700 text-center dark:text-gray-200"${_scopeId}> File ${ssrInterpolate(isWord(__props.material.file_path) ? "Word" : "Excel")}</p><p class="text-sm text-gray-500 text-center mb-3"${_scopeId}> File ini tidak bisa ditampilkan langsung di browser. </p><div class="flex justify-center"${_scopeId}><a${ssrRenderAttr("href", __props.material.file_url)} class="inline-block px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"${_scopeId}> Download File </a></div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><p class="mb-2 font-semibold sm:text-lg dark:text-gray-200"${_scopeId}>Pembahasan Materi :</p><p class="mb-6 dark:text-gray-400 sm:text-base text-sm"${_scopeId}>${ssrInterpolate(__props.material.deskripsi)}</p><div class="w-full border-t border-gray-400 dark:border-gray-700 mb-2"${_scopeId}></div><div class="flex justify-between flex-row gap-3"${_scopeId}><p class="sm:inline-flex hidden dark:text-gray-400 text-xs"${_scopeId}> Submitted: ${ssrInterpolate(formatDate(__props.material.created_at))}</p><p class="dark:text-gray-400 text-xs"${_scopeId}> Last updated: ${ssrInterpolate(formatDate(__props.material.updated_at))}</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.material ? (openBlock(), createBlock("div", {
                key: 0,
                class: "sm:p-6"
              }, [
                createVNode("h1", { class: "text-2xl mb-3 font-bold dark:text-white" }, toDisplayString(__props.material.judul), 1),
                createVNode("div", { class: "flex gap-3" }, [
                  createVNode("p", { class: "bg-blue-50 p-1 rounded-full px-4 text-xs font-semibold mb-2 border border-blue-500 text-blue-600" }, " Subject: " + toDisplayString(__props.material.mapel.mapel), 1),
                  createVNode("p", { class: "bg-amber-50 p-1 rounded-full px-4 text-xs font-semibold mb-2 border border-amber-500 text-amber-600" }, [
                    createTextVNode(" Author: "),
                    createVNode("span", { class: "font-semibold" }, toDisplayString(__props.material.guru.nama_lengkap), 1)
                  ])
                ]),
                createVNode("div", { class: "flex flex-col space-y-2" }, [
                  __props.material.file_path ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    isImage(__props.material.file_path) ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode("img", {
                        src: __props.material.file_url,
                        alt: "preview",
                        class: "mt-2 w-full mb-3 object-cover rounded shadow-lg"
                      }, null, 8, ["src"]),
                      createVNode("div", { class: "flex w-full justify-end" }, [
                        createVNode("button", {
                          onClick: withModifiers(($event) => previewFile(__props.material), ["stop"]),
                          class: "bg-blue-700 text-white hover:bg-gray-300 px-6 mb-3 py-2 rounded text-sm font-semibold"
                        }, " View Image ", 8, ["onClick"])
                      ])
                    ])) : isVideo(__props.material.file_path) && !isExternal(__props.material.file_path) ? (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode("video", {
                        onClick: withModifiers(() => {
                        }, ["stop"]),
                        class: "mt-2 w-full max-h-48 rounded",
                        controls: ""
                      }, [
                        createVNode("source", {
                          src: __props.material.file_url,
                          type: "video/mp4"
                        }, null, 8, ["src"]),
                        createTextVNode(" Your browser does not support the video tag. ")
                      ], 8, ["onClick"])
                    ])) : isExternalVideo(__props.material.file_path) ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "my-6 mb-12 w-full aspect-video border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden"
                    }, [
                      createVNode("iframe", {
                        class: "w-full h-full border rounded-lg",
                        src: getVideoEmbedUrl(__props.material.file_path),
                        frameborder: "0",
                        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                        allowfullscreen: ""
                      }, null, 8, ["src"])
                    ])) : isPdf(__props.material.file_path) ? (openBlock(), createBlock("div", {
                      key: 3,
                      class: "mt-4 w-full space-y-2"
                    }, [
                      createVNode("div", { class: "h-[70vh] border rounded overflow-hidden bg-gray-100 dark:bg-gray-800" }, [
                        createVNode("iframe", {
                          class: "w-full h-full",
                          src: getPdfEmbedUrl(__props.material),
                          frameborder: "0"
                        }, null, 8, ["src"])
                      ]),
                      createVNode("div", { class: "flex justify-end" }, [
                        createVNode("a", {
                          href: __props.material.file_url,
                          target: "_blank",
                          class: "text-sm my-4 py-2 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                        }, " Buka di tab baru ", 8, ["href"])
                      ])
                    ])) : isWord(__props.material.file_path) || isExcel(__props.material.file_path) ? (openBlock(), createBlock("div", {
                      key: 4,
                      class: "sm:my-12 my-6 border sm:mx-auto p-10 sm:p-12 sm:px-40 border-dashed rounded-lg justify-center items-center dark:bg-white/5 bg-gray-100 dark:bg-gray-800"
                    }, [
                      createVNode("p", { class: "font-semibold text-gray-700 text-center dark:text-gray-200" }, " File " + toDisplayString(isWord(__props.material.file_path) ? "Word" : "Excel"), 1),
                      createVNode("p", { class: "text-sm text-gray-500 text-center mb-3" }, " File ini tidak bisa ditampilkan langsung di browser. "),
                      createVNode("div", { class: "flex justify-center" }, [
                        createVNode("a", {
                          href: __props.material.file_url,
                          class: "inline-block px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                        }, " Download File ", 8, ["href"])
                      ])
                    ])) : createCommentVNode("", true)
                  ], 64)) : createCommentVNode("", true)
                ]),
                createVNode("p", { class: "mb-2 font-semibold sm:text-lg dark:text-gray-200" }, "Pembahasan Materi :"),
                createVNode("p", { class: "mb-6 dark:text-gray-400 sm:text-base text-sm" }, toDisplayString(__props.material.deskripsi), 1),
                createVNode("div", { class: "w-full border-t border-gray-400 dark:border-gray-700 mb-2" }),
                createVNode("div", { class: "flex justify-between flex-row gap-3" }, [
                  createVNode("p", { class: "sm:inline-flex hidden dark:text-gray-400 text-xs" }, " Submitted: " + toDisplayString(formatDate(__props.material.created_at)), 1),
                  createVNode("p", { class: "dark:text-gray-400 text-xs" }, " Last updated: " + toDisplayString(formatDate(__props.material.updated_at)), 1)
                ])
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Material/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
