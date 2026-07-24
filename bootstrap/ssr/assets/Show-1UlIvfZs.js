import { withCtx, unref, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { format } from "date-fns";
import { Link } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: { assignment: Object },
  setup(__props) {
    const props = __props;
    const formatDate = (date) => format(new Date(date), "dd MMM yyyy, HH:mm");
    const getExt = (path) => (path ?? "").split(".").pop().toLowerCase();
    const getFileName = (path) => {
      if (!path) return "download";
      const ext = getExt(path);
      const nama = props.assignment?.siswa?.nama_lengkap?.replace(/\s+/g, "_")?.replace(/[^\w\-]/g, "");
      return `${nama}.${ext}`;
    };
    const isImage = (path) => ["jpg", "jpeg", "png", "svg", "webp", "gif"].includes(getExt(path));
    const isVideo = (path) => ["mp4", "webm", "ogg"].includes(getExt(path));
    const isPdf = (path) => getExt(path) === "pdf";
    const getFileUrl = () => props.assignment.file_url ?? "";
    const isExternal = (path) => (path ?? "").startsWith("http");
    const isExternalVideo = (path) => {
      if (!isExternal(path)) return false;
      return path.includes("youtube.com") || path.includes("youtu.be") || path.includes("drive.google.com");
    };
    const getVideoEmbedUrl = (url) => {
      if (url.includes("youtu.be")) {
        const id = url.split("/").pop().split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes("youtube.com")) {
        const id = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes("drive.google.com")) {
        const match = url.match(/\/d\/([^/]+)/);
        if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return url;
    };
    const getPdfEmbedUrl = (url) => {
      if (!url) return "";
      if (url.includes("drive.google.com")) {
        const match = url.match(/\/d\/([^/]+)/);
        if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return getFileUrl();
    };
    const FILE_TYPES = {
      doc: { label: "Word Document", bg: "bg-blue-100 dark:bg-blue-900/40", color: "text-blue-600 dark:text-blue-400" },
      docx: { label: "Word Document", bg: "bg-blue-100 dark:bg-blue-900/40", color: "text-blue-600 dark:text-blue-400" },
      xls: { label: "Excel Spreadsheet", bg: "bg-green-100 dark:bg-green-900/40", color: "text-green-600 dark:text-green-400" },
      xlsx: { label: "Excel Spreadsheet", bg: "bg-green-100 dark:bg-green-900/40", color: "text-green-600 dark:text-green-400" },
      ppt: { label: "PowerPoint", bg: "bg-orange-100 dark:bg-orange-900/40", color: "text-orange-600 dark:text-orange-400" },
      pptx: { label: "PowerPoint", bg: "bg-orange-100 dark:bg-orange-900/40", color: "text-orange-600 dark:text-orange-400" }
    };
    const getFileMeta = (path) => FILE_TYPES[getExt(path)] ?? { label: "File", bg: "bg-gray-100 dark:bg-gray-700", color: "text-gray-500 dark:text-gray-400" };
    const fileTypeLabel = (path) => getFileMeta(path).label;
    const fileIconBg = (path) => getFileMeta(path).bg;
    const fileIconColor = (path) => getFileMeta(path).color;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.assignment) {
              _push2(`<div class="min-h-screen sm:p-6"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: unref(route)("guru.assignment.index"),
                class: "inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"${_scopeId2}></path></svg> Back to Assignments `);
                  } else {
                    return [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M15 19l-7-7 7-7"
                        })
                      ])),
                      createTextVNode(" Back to Assignments ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm mb-5"${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"${_scopeId}>${ssrInterpolate(__props.assignment.judul)}</h1><div class="flex flex-wrap gap-2"${_scopeId}><span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800"${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"${_scopeId}></path></svg> ${ssrInterpolate(__props.assignment.mapel.mapel)}</span><span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50"${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg> ${ssrInterpolate(__props.assignment.siswa.nama_lengkap)}</span></div></div>`);
              if (__props.assignment.file_path) {
                _push2(`<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm mb-5"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500"${_scopeId}> Attachment </p>`);
                if (!isExternalVideo(__props.assignment.file_path)) {
                  _push2(`<a${ssrRenderAttr("href", getFileUrl(__props.assignment.file_path))}${ssrRenderAttr("download", getFileName(__props.assignment.file_path))} class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"${_scopeId}></path></svg> Download </a>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (isImage(__props.assignment.file_path)) {
                  _push2(`<div${_scopeId}><img${ssrRenderAttr("src", getFileUrl(__props.assignment.file_path))} alt="Assignment attachment" class="w-full rounded-xl object-cover mb-3 border border-gray-100 dark:border-gray-700"${_scopeId}><div class="flex justify-end"${_scopeId}><a${ssrRenderAttr("href", getFileUrl(__props.assignment.file_path))} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"${_scopeId}></path></svg> Open Full Size </a></div></div>`);
                } else if (isVideo(__props.assignment.file_path) && !isExternal(__props.assignment.file_path)) {
                  _push2(`<div${_scopeId}><video class="w-full rounded-xl border border-gray-100 dark:border-gray-700" controls${_scopeId}><source${ssrRenderAttr("src", getFileUrl(__props.assignment.file_path))} type="video/mp4"${_scopeId}> Your browser does not support the video tag. </video></div>`);
                } else if (isExternalVideo(__props.assignment.file_path)) {
                  _push2(`<div class="w-full aspect-video rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"${_scopeId}><iframe class="w-full h-full"${ssrRenderAttr("src", getVideoEmbedUrl(__props.assignment.file_path))} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen${_scopeId}></iframe></div>`);
                } else if (isPdf(__props.assignment.file_path)) {
                  _push2(`<div class="space-y-3"${_scopeId}><div class="h-[70vh] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800"${_scopeId}><iframe class="w-full h-full"${ssrRenderAttr("src", getPdfEmbedUrl(__props.assignment.file_path))} frameborder="0"${_scopeId}></iframe></div><div class="flex justify-end"${_scopeId}><a${ssrRenderAttr("href", getFileUrl(__props.assignment.file_path))} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"${_scopeId}></path></svg> Open in New Tab </a></div></div>`);
                } else {
                  _push2(`<div class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center gap-3"${_scopeId}><div class="${ssrRenderClass([fileIconBg(__props.assignment.file_path), "w-12 h-12 rounded-xl flex items-center justify-center"])}"${_scopeId}><svg class="${ssrRenderClass([fileIconColor(__props.assignment.file_path), "w-6 h-6"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg></div><div${_scopeId}><p class="font-semibold text-gray-700 dark:text-gray-200 text-sm"${_scopeId}>${ssrInterpolate(fileTypeLabel(__props.assignment.file_path))}</p><p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5"${_scopeId}> This file cannot be previewed in browser </p></div><a${ssrRenderAttr("href", getFileUrl(__props.assignment.file_path))}${ssrRenderAttr("download", getFileName(__props.assignment.file_path))} class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"${_scopeId}></path></svg> Download File </a></div>`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm mb-5"${_scopeId}><p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3"${_scopeId}> Description </p><p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(__props.assignment.deskripsi)}</p></div><div class="flex flex-col sm:flex-row justify-between gap-2 px-1"${_scopeId}><p class="text-xs text-gray-400 dark:text-gray-500"${_scopeId}> Submitted: ${ssrInterpolate(formatDate(__props.assignment.created_at))}</p><p class="text-xs text-gray-400 dark:text-gray-500"${_scopeId}> Last updated: ${ssrInterpolate(formatDate(__props.assignment.updated_at))}</p></div>`);
              if (__props.assignment.revisions.length > 0) {
                _push2(`<div class="mt-8"${_scopeId}><h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"${_scopeId}> Revision History (Jumlah revisi ${ssrInterpolate(__props.assignment.revisions.length)}x) </h3><div class="space-y-2"${_scopeId}><!--[-->`);
                ssrRenderList(__props.assignment.revisions, (rev) => {
                  _push2(`<div class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm"${_scopeId}><div class="flex justify-between items-center mb-1"${_scopeId}><span class="font-medium text-gray-800 dark:text-white"${_scopeId}> Revisi Ke - ${ssrInterpolate(rev.revision_number)}</span><span class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(formatDate(rev.created_at))}</span></div><p class="text-gray-500 dark:text-gray-400 text-xs"${_scopeId}>${ssrInterpolate(rev.judul)}</p>`);
                  if (rev.catatan_revisi) {
                    _push2(`<p class="mt-1 text-amber-600 dark:text-amber-400 text-xs italic"${_scopeId}> &quot;${ssrInterpolate(rev.catatan_revisi)}&quot; </p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]--></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.assignment ? (openBlock(), createBlock("div", {
                key: 0,
                class: "min-h-screen sm:p-6"
              }, [
                createVNode(unref(Link), {
                  href: unref(route)("guru.assignment.index"),
                  class: "inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
                }, {
                  default: withCtx(() => [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M15 19l-7-7 7-7"
                      })
                    ])),
                    createTextVNode(" Back to Assignments ")
                  ]),
                  _: 1
                }, 8, ["href"]),
                createVNode("div", { class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm mb-5" }, [
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight" }, toDisplayString(__props.assignment.judul), 1),
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    createVNode("span", { class: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-3.5 h-3.5",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        })
                      ])),
                      createTextVNode(" " + toDisplayString(__props.assignment.mapel.mapel), 1)
                    ]),
                    createVNode("span", { class: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-3.5 h-3.5",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        })
                      ])),
                      createTextVNode(" " + toDisplayString(__props.assignment.siswa.nama_lengkap), 1)
                    ])
                  ])
                ]),
                __props.assignment.file_path ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm mb-5"
                }, [
                  createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                    createVNode("p", { class: "text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500" }, " Attachment "),
                    !isExternalVideo(__props.assignment.file_path) ? (openBlock(), createBlock("a", {
                      key: 0,
                      href: getFileUrl(__props.assignment.file_path),
                      download: getFileName(__props.assignment.file_path),
                      class: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-3.5 h-3.5",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        })
                      ])),
                      createTextVNode(" Download ")
                    ], 8, ["href", "download"])) : createCommentVNode("", true)
                  ]),
                  isImage(__props.assignment.file_path) ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("img", {
                      src: getFileUrl(__props.assignment.file_path),
                      alt: "Assignment attachment",
                      class: "w-full rounded-xl object-cover mb-3 border border-gray-100 dark:border-gray-700"
                    }, null, 8, ["src"]),
                    createVNode("div", { class: "flex justify-end" }, [
                      createVNode("a", {
                        href: getFileUrl(__props.assignment.file_path),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          })
                        ])),
                        createTextVNode(" Open Full Size ")
                      ], 8, ["href"])
                    ])
                  ])) : isVideo(__props.assignment.file_path) && !isExternal(__props.assignment.file_path) ? (openBlock(), createBlock("div", { key: 1 }, [
                    createVNode("video", {
                      class: "w-full rounded-xl border border-gray-100 dark:border-gray-700",
                      controls: ""
                    }, [
                      createVNode("source", {
                        src: getFileUrl(__props.assignment.file_path),
                        type: "video/mp4"
                      }, null, 8, ["src"]),
                      createTextVNode(" Your browser does not support the video tag. ")
                    ])
                  ])) : isExternalVideo(__props.assignment.file_path) ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "w-full aspect-video rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                  }, [
                    createVNode("iframe", {
                      class: "w-full h-full",
                      src: getVideoEmbedUrl(__props.assignment.file_path),
                      frameborder: "0",
                      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                      allowfullscreen: ""
                    }, null, 8, ["src"])
                  ])) : isPdf(__props.assignment.file_path) ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "space-y-3"
                  }, [
                    createVNode("div", { class: "h-[70vh] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800" }, [
                      createVNode("iframe", {
                        class: "w-full h-full",
                        src: getPdfEmbedUrl(__props.assignment.file_path),
                        frameborder: "0"
                      }, null, 8, ["src"])
                    ]),
                    createVNode("div", { class: "flex justify-end" }, [
                      createVNode("a", {
                        href: getFileUrl(__props.assignment.file_path),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        class: "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          })
                        ])),
                        createTextVNode(" Open in New Tab ")
                      ], 8, ["href"])
                    ])
                  ])) : (openBlock(), createBlock("div", {
                    key: 4,
                    class: "flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center gap-3"
                  }, [
                    createVNode("div", {
                      class: ["w-12 h-12 rounded-xl flex items-center justify-center", fileIconBg(__props.assignment.file_path)]
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: ["w-6 h-6", fileIconColor(__props.assignment.file_path)],
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "1.5",
                          d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        })
                      ], 2))
                    ], 2),
                    createVNode("div", null, [
                      createVNode("p", { class: "font-semibold text-gray-700 dark:text-gray-200 text-sm" }, toDisplayString(fileTypeLabel(__props.assignment.file_path)), 1),
                      createVNode("p", { class: "text-xs text-gray-400 dark:text-gray-500 mt-0.5" }, " This file cannot be previewed in browser ")
                    ]),
                    createVNode("a", {
                      href: getFileUrl(__props.assignment.file_path),
                      download: getFileName(__props.assignment.file_path),
                      class: "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        })
                      ])),
                      createTextVNode(" Download File ")
                    ], 8, ["href", "download"])
                  ]))
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm mb-5" }, [
                  createVNode("p", { class: "text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3" }, " Description "),
                  createVNode("p", { class: "text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap" }, toDisplayString(__props.assignment.deskripsi), 1)
                ]),
                createVNode("div", { class: "flex flex-col sm:flex-row justify-between gap-2 px-1" }, [
                  createVNode("p", { class: "text-xs text-gray-400 dark:text-gray-500" }, " Submitted: " + toDisplayString(formatDate(__props.assignment.created_at)), 1),
                  createVNode("p", { class: "text-xs text-gray-400 dark:text-gray-500" }, " Last updated: " + toDisplayString(formatDate(__props.assignment.updated_at)), 1)
                ]),
                __props.assignment.revisions.length > 0 ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mt-8"
                }, [
                  createVNode("h3", { class: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3" }, " Revision History (Jumlah revisi " + toDisplayString(__props.assignment.revisions.length) + "x) ", 1),
                  createVNode("div", { class: "space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.assignment.revisions, (rev) => {
                      return openBlock(), createBlock("div", {
                        key: rev.id,
                        class: "p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm"
                      }, [
                        createVNode("div", { class: "flex justify-between items-center mb-1" }, [
                          createVNode("span", { class: "font-medium text-gray-800 dark:text-white" }, " Revisi Ke - " + toDisplayString(rev.revision_number), 1),
                          createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(formatDate(rev.created_at)), 1)
                        ]),
                        createVNode("p", { class: "text-gray-500 dark:text-gray-400 text-xs" }, toDisplayString(rev.judul), 1),
                        rev.catatan_revisi ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-amber-600 dark:text-amber-400 text-xs italic"
                        }, ' "' + toDisplayString(rev.catatan_revisi) + '" ', 1)) : createCommentVNode("", true)
                      ]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Assignment/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
