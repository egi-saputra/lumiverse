import { withCtx, unref, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { format } from "date-fns";
import { Link, router } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
import "@heroicons/vue/24/outline";
import "sweetalert2";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: { materials: Array },
  setup(__props) {
    const { success, error, confirm } = ToastAlert();
    const formatDate = (date) => format(new Date(date), "dd MMM yyyy, HH:mm");
    const deleteMaterial = async (id) => {
      const result = await confirm({
        title: "Delete this material?",
        text: "This action cannot be undone.",
        confirmButtonText: "Yes, delete"
      });
      if (!result.isConfirmed) return;
      router.delete(route("guru.material.destroy", id), {
        preserveScroll: true,
        onSuccess: () => {
          success("Material successfully deleted.");
        },
        onError: () => {
          error("Failed to delete material.");
        }
      });
    };
    const isFile = (path) => path && ["jpg", "jpeg", "png", "pdf", "xls", "xlsx", "doc", "docx", "zip"].includes(path.split(".").pop().toLowerCase());
    const isImage = (path) => path && ["jpg", "jpeg", "png", "svg", "webp"].includes(path.split(".").pop().toLowerCase());
    const isVideo = (path) => path && ["mp4", "webm", "ogg"].includes(path.split(".").pop().toLowerCase());
    const isPdf = (path) => path && path.split(".").pop().toLowerCase() === "pdf";
    const fileName = (path) => path ? path.split("/").pop() : "";
    const previewFile = (material) => window.open(material.file_url, "_blank");
    const isExternal = (path) => path && path.startsWith("http");
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen pb-20 relative"${_scopeId}><div class="flex justify-between items-center mb-6"${_scopeId}><h1 class="text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>Learning Material List</h1>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("guru.material.create"),
              prefetch: "",
              "preserve-scroll": "",
              class: "hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-lg shadow transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + New Create `);
                } else {
                  return [
                    createTextVNode(" + New Create ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid grid-cols-1 gap-6"${_scopeId}><!--[-->`);
            ssrRenderList(__props.materials, (material) => {
              _push2(`<div class="relative bg-transparent dark:bg-gradient-to-r dark:from-blue-400/20 dark:via-blue-500/20 dark:to-blue-700/10 border border-gray-400 dark:border-blue-600 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col justify-between transition hover:shadow-xl"${_scopeId}><button class="absolute bottom-3 right-4 sm:bottom-6 sm:right-6 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"${_scopeId}> Delete </button><div${_scopeId}><h2 class="text-xl font-semibold dark:text-white mb-2"${_scopeId}>${ssrInterpolate(material.judul)}</h2><p class="dark:text-gray-200 text-sm mb-2"${_scopeId}>${ssrInterpolate(material.deskripsi)}</p><div class="flex gap-4"${_scopeId}><p class="dark:text-gray-300 text-xs mb-2"${_scopeId}>Subject: ${ssrInterpolate(material.mapel.mapel)}</p><p class="dark:text-gray-300 text-xs mb-2"${_scopeId}>Recipient: ${ssrInterpolate(material.kelas.kelas)}</p></div></div><div class="mt-4 flex flex-col space-y-2"${_scopeId}>`);
              if (material.file_path) {
                _push2(`<!--[-->`);
                if (isImage(material.file_path)) {
                  _push2(`<div${_scopeId}><img${ssrRenderAttr("src", material.file_url)} alt="preview" class="mt-2 w-full mb-3 max-h-48 object-cover rounded"${_scopeId}><button class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 px-3 mb-3 py-1 rounded text-sm font-semibold"${_scopeId}> Preview Image </button></div>`);
                } else if (isVideo(material.file_path) && !isExternal(material.file_path)) {
                  _push2(`<div${_scopeId}><video class="mt-2 w-full max-h-48 rounded" controls${_scopeId}><source${ssrRenderAttr("src", material.file_url)} type="video/mp4"${_scopeId}> Your browser does not support the video tag. </video></div>`);
                } else if (isExternalVideo(material.file_path)) {
                  _push2(`<div${_scopeId}><iframe class="mt-2 w-full bg-gray-200 rounded"${ssrRenderAttr("src", getVideoEmbedUrl(material.file_path))} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen${_scopeId}></iframe></div>`);
                } else if (isPdf(material.file_path)) {
                  _push2(`<div${_scopeId}><button class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 px-3 py-1 rounded text-sm font-semibold"${_scopeId}> Preview PDF </button></div>`);
                } else {
                  _push2(`<div${_scopeId}><p class="text-sm dark:text-gray-300 truncate"${_scopeId}>${ssrInterpolate(fileName(material.file_path))} <a${ssrRenderAttr("href", material.file_url)} target="_blank" class="ml-2 text-blue-500 hover:underline text-sm"${_scopeId}>Download</a></p></div>`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              if (material.file_path && !isFile(material.file_path)) {
                _push2(`<a${ssrRenderAttr("href", material.file_path)} target="_blank" class="text-blue-300 hover:underline text-sm truncate"${_scopeId}>Open Link</a>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<p class="dark:text-gray-400 text-xs"${_scopeId}>Submitted: ${ssrInterpolate(formatDate(material.created_at))}</p></div></div>`);
            });
            _push2(`<!--]-->`);
            if (__props.materials.length === 0) {
              _push2(`<div class="col-span-full text-center text-gray-500 dark:text-gray-400"${_scopeId}> No learning materials submitted yet. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("guru.material.create"),
              prefetch: "",
              "preserve-scroll": "",
              class: "sm:hidden fixed bottom-16 right-3 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 text-sm sm:text-base hover:to-blue-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + Add New `);
                } else {
                  return [
                    createTextVNode(" + Add New ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen pb-20 relative" }, [
                createVNode("div", { class: "flex justify-between items-center mb-6" }, [
                  createVNode("h1", { class: "text-3xl font-bold text-gray-900 dark:text-white" }, "Learning Material List"),
                  createVNode(unref(Link), {
                    href: unref(route)("guru.material.create"),
                    prefetch: "",
                    "preserve-scroll": "",
                    class: "hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-lg shadow transition"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + New Create ")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                createVNode("div", { class: "grid grid-cols-1 gap-6" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.materials, (material) => {
                    return openBlock(), createBlock("div", {
                      key: material.id,
                      class: "relative bg-transparent dark:bg-gradient-to-r dark:from-blue-400/20 dark:via-blue-500/20 dark:to-blue-700/10 border border-gray-400 dark:border-blue-600 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col justify-between transition hover:shadow-xl"
                    }, [
                      createVNode("button", {
                        onClick: ($event) => deleteMaterial(material.id),
                        class: "absolute bottom-3 right-4 sm:bottom-6 sm:right-6 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                      }, " Delete ", 8, ["onClick"]),
                      createVNode("div", null, [
                        createVNode("h2", { class: "text-xl font-semibold dark:text-white mb-2" }, toDisplayString(material.judul), 1),
                        createVNode("p", { class: "dark:text-gray-200 text-sm mb-2" }, toDisplayString(material.deskripsi), 1),
                        createVNode("div", { class: "flex gap-4" }, [
                          createVNode("p", { class: "dark:text-gray-300 text-xs mb-2" }, "Subject: " + toDisplayString(material.mapel.mapel), 1),
                          createVNode("p", { class: "dark:text-gray-300 text-xs mb-2" }, "Recipient: " + toDisplayString(material.kelas.kelas), 1)
                        ])
                      ]),
                      createVNode("div", { class: "mt-4 flex flex-col space-y-2" }, [
                        material.file_path ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          isImage(material.file_path) ? (openBlock(), createBlock("div", { key: 0 }, [
                            createVNode("img", {
                              src: material.file_url,
                              alt: "preview",
                              class: "mt-2 w-full mb-3 max-h-48 object-cover rounded"
                            }, null, 8, ["src"]),
                            createVNode("button", {
                              onClick: ($event) => previewFile(material),
                              class: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 px-3 mb-3 py-1 rounded text-sm font-semibold"
                            }, " Preview Image ", 8, ["onClick"])
                          ])) : isVideo(material.file_path) && !isExternal(material.file_path) ? (openBlock(), createBlock("div", { key: 1 }, [
                            createVNode("video", {
                              class: "mt-2 w-full max-h-48 rounded",
                              controls: ""
                            }, [
                              createVNode("source", {
                                src: material.file_url,
                                type: "video/mp4"
                              }, null, 8, ["src"]),
                              createTextVNode(" Your browser does not support the video tag. ")
                            ])
                          ])) : isExternalVideo(material.file_path) ? (openBlock(), createBlock("div", { key: 2 }, [
                            createVNode("iframe", {
                              class: "mt-2 w-full bg-gray-200 rounded",
                              src: getVideoEmbedUrl(material.file_path),
                              frameborder: "0",
                              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                              allowfullscreen: ""
                            }, null, 8, ["src"])
                          ])) : isPdf(material.file_path) ? (openBlock(), createBlock("div", { key: 3 }, [
                            createVNode("button", {
                              onClick: ($event) => previewFile(material),
                              class: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 px-3 py-1 rounded text-sm font-semibold"
                            }, " Preview PDF ", 8, ["onClick"])
                          ])) : (openBlock(), createBlock("div", { key: 4 }, [
                            createVNode("p", { class: "text-sm dark:text-gray-300 truncate" }, [
                              createTextVNode(toDisplayString(fileName(material.file_path)) + " ", 1),
                              createVNode("a", {
                                href: material.file_url,
                                target: "_blank",
                                class: "ml-2 text-blue-500 hover:underline text-sm"
                              }, "Download", 8, ["href"])
                            ])
                          ]))
                        ], 64)) : createCommentVNode("", true),
                        material.file_path && !isFile(material.file_path) ? (openBlock(), createBlock("a", {
                          key: 1,
                          href: material.file_path,
                          target: "_blank",
                          class: "text-blue-300 hover:underline text-sm truncate"
                        }, "Open Link", 8, ["href"])) : createCommentVNode("", true),
                        createVNode("p", { class: "dark:text-gray-400 text-xs" }, "Submitted: " + toDisplayString(formatDate(material.created_at)), 1)
                      ])
                    ]);
                  }), 128)),
                  __props.materials.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "col-span-full text-center text-gray-500 dark:text-gray-400"
                  }, " No learning materials submitted yet. ")) : createCommentVNode("", true)
                ]),
                createVNode(unref(Link), {
                  href: unref(route)("guru.material.create"),
                  prefetch: "",
                  "preserve-scroll": "",
                  class: "sm:hidden fixed bottom-16 right-3 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 text-sm sm:text-base hover:to-blue-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" + Add New ")
                  ]),
                  _: 1
                }, 8, ["href"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Material/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
