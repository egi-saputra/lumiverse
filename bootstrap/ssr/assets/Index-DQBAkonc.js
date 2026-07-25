import { withCtx, unref, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { format } from "date-fns";
import { Link, router } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: { assignments: Array },
  setup(__props) {
    const formatDate = (date) => format(new Date(date), "dd MMM yyyy, HH:mm");
    const deleteAssignment = (assignment) => {
      if (!confirm(`Delete "${assignment.judul}"?
This action cannot be undone.`)) return;
      router.delete(route("siswa.assignment.destroy", assignment.id), {
        preserveScroll: true
      });
    };
    const getExt = (path) => (path || "").split(".").pop().toLowerCase();
    const isImage = (path) => ["jpg", "jpeg", "png", "svg", "webp"].includes(getExt(path));
    const isPdf = (path) => getExt(path) === "pdf";
    const isVideo = (path) => ["mp4", "webm", "ogg"].includes(getExt(path));
    const isWord = (path) => ["doc", "docx"].includes(getExt(path));
    const isExcel = (path) => ["xls", "xlsx"].includes(getExt(path));
    const isExternal = (path) => (path || "").startsWith("http");
    const isExternalVideo = (path) => {
      if (!isExternal(path)) return false;
      return path.includes("youtube.com") || path.includes("youtu.be") || path.includes("drive.google.com");
    };
    const getAttachmentColor = (path) => {
      if (!path) return "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500";
      if (isImage(path)) return "bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400";
      if (isPdf(path)) return "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400";
      if (isExternalVideo(path) || isVideo(path)) return "bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400";
      if (isWord(path)) return "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400";
      if (isExcel(path)) return "bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400";
      return "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500";
    };
    const getAttachmentIcon = (path) => {
      if (!path) return "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
      if (isImage(path)) return "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z";
      if (isPdf(path)) return "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z";
      if (isExternalVideo(path) || isVideo(path)) return "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      return "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen sm:p-6 pb-24"${_scopeId}><div class="flex justify-between items-center mb-8"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"${_scopeId}>My Assignments</h1><p class="text-sm text-gray-500 dark:text-gray-400 mt-1"${_scopeId}>${ssrInterpolate(__props.assignments.length)} submission${ssrInterpolate(__props.assignments.length !== 1 ? "s" : "")}</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("siswa.assignment.create"),
              prefetch: "",
              class: "hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-none transition-all duration-200"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId2}></path></svg> New Submission `);
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
                        d: "M12 4v16m8-8H4"
                      })
                    ])),
                    createTextVNode(" New Submission ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.assignments.length > 0) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.assignments, (assignment) => {
                _push2(`<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="${ssrRenderClass([getAttachmentColor(assignment.file_path), "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"])}"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"${ssrRenderAttr("d", getAttachmentIcon(assignment.file_path))}${_scopeId}></path></svg></div><div class="flex-1 min-w-0"${_scopeId}><h2 class="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate"${_scopeId}>${ssrInterpolate(assignment.judul)}</h2><p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-pre-line leading-relaxed"${_scopeId}>${ssrInterpolate(assignment.deskripsi)}</p><div class="flex flex-wrap items-center gap-2 mt-3"${_scopeId}><span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800"${_scopeId}>${ssrInterpolate(assignment.mapel.mapel)}</span><span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"${_scopeId}> To: ${ssrInterpolate(assignment.guru.nama_lengkap)}</span><span class="text-xs text-gray-400 dark:text-gray-500 ml-auto hidden sm:inline"${_scopeId}>${ssrInterpolate(formatDate(assignment.created_at))}</span></div><p class="text-xs text-gray-400 dark:text-gray-500 mt-2 sm:hidden"${_scopeId}>${ssrInterpolate(formatDate(assignment.created_at))}</p></div><div class="flex-shrink-0 flex flex-col sm:flex-row items-center gap-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: unref(route)("siswa.assignment.edit", assignment.id),
                  class: "p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200",
                  title: "Edit assignment"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"${_scopeId2}></path></svg>`);
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
                            d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          })
                        ]))
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<button class="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200" title="Delete assignment"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"${_scopeId}></path></svg></button></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl"${_scopeId}><div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4"${_scopeId}><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg></div><p class="text-base font-semibold text-gray-700 dark:text-gray-300"${_scopeId}>No assignments submitted yet</p><p class="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-5"${_scopeId}>Submit your first assignment to get started.</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: unref(route)("siswa.assignment.create"),
                class: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId2}></path></svg> Submit Assignment `);
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
                          d: "M12 4v16m8-8H4"
                        })
                      ])),
                      createTextVNode(" Submit Assignment ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(ssrRenderComponent(unref(Link), {
              href: unref(route)("siswa.assignment.create"),
              prefetch: "",
              class: "sm:hidden fixed bottom-6 right-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-blue-300/40 dark:shadow-none transition-all duration-200 z-50"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId2}></path></svg> New `);
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
                        d: "M12 4v16m8-8H4"
                      })
                    ])),
                    createTextVNode(" New ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen sm:p-6 pb-24" }, [
                createVNode("div", { class: "flex justify-between items-center mb-8" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white tracking-tight" }, "My Assignments"),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 mt-1" }, toDisplayString(__props.assignments.length) + " submission" + toDisplayString(__props.assignments.length !== 1 ? "s" : ""), 1)
                  ]),
                  createVNode(unref(Link), {
                    href: unref(route)("siswa.assignment.create"),
                    prefetch: "",
                    class: "hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-none transition-all duration-200"
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
                          d: "M12 4v16m8-8H4"
                        })
                      ])),
                      createTextVNode(" New Submission ")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                __props.assignments.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.assignments, (assignment) => {
                    return openBlock(), createBlock("div", {
                      key: assignment.id,
                      class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                    }, [
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode("div", {
                          class: ["flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5", getAttachmentColor(assignment.file_path)]
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-5 h-5",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "1.5",
                              d: getAttachmentIcon(assignment.file_path)
                            }, null, 8, ["d"])
                          ]))
                        ], 2),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("h2", { class: "text-base font-semibold text-gray-900 dark:text-white mb-1 truncate" }, toDisplayString(assignment.judul), 1),
                          createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-pre-line leading-relaxed" }, toDisplayString(assignment.deskripsi), 1),
                          createVNode("div", { class: "flex flex-wrap items-center gap-2 mt-3" }, [
                            createVNode("span", { class: "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800" }, toDisplayString(assignment.mapel.mapel), 1),
                            createVNode("span", { class: "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700" }, " To: " + toDisplayString(assignment.guru.nama_lengkap), 1),
                            createVNode("span", { class: "text-xs text-gray-400 dark:text-gray-500 ml-auto hidden sm:inline" }, toDisplayString(formatDate(assignment.created_at)), 1)
                          ]),
                          createVNode("p", { class: "text-xs text-gray-400 dark:text-gray-500 mt-2 sm:hidden" }, toDisplayString(formatDate(assignment.created_at)), 1)
                        ]),
                        createVNode("div", { class: "flex-shrink-0 flex flex-col sm:flex-row items-center gap-1" }, [
                          createVNode(unref(Link), {
                            href: unref(route)("siswa.assignment.edit", assignment.id),
                            class: "p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200",
                            title: "Edit assignment"
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
                                  d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                })
                              ]))
                            ]),
                            _: 1
                          }, 8, ["href"]),
                          createVNode("button", {
                            onClick: ($event) => deleteAssignment(assignment),
                            class: "p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200",
                            title: "Delete assignment"
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
                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              })
                            ]))
                          ], 8, ["onClick"])
                        ])
                      ])
                    ]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl"
                }, [
                  createVNode("div", { class: "w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-8 h-8 text-gray-400",
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
                    ]))
                  ]),
                  createVNode("p", { class: "text-base font-semibold text-gray-700 dark:text-gray-300" }, "No assignments submitted yet"),
                  createVNode("p", { class: "text-sm text-gray-400 dark:text-gray-500 mt-1 mb-5" }, "Submit your first assignment to get started."),
                  createVNode(unref(Link), {
                    href: unref(route)("siswa.assignment.create"),
                    class: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
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
                          d: "M12 4v16m8-8H4"
                        })
                      ])),
                      createTextVNode(" Submit Assignment ")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ])),
                createVNode(unref(Link), {
                  href: unref(route)("siswa.assignment.create"),
                  prefetch: "",
                  class: "sm:hidden fixed bottom-6 right-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-blue-300/40 dark:shadow-none transition-all duration-200 z-50"
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
                        d: "M12 4v16m8-8H4"
                      })
                    ])),
                    createTextVNode(" New ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Assignment/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
