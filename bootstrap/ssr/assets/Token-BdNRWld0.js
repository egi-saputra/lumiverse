import { onMounted, onUnmounted, ref, nextTick, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { usePage, useForm, Head, router } from "@inertiajs/vue3";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const _sfc_main = {
  __name: "Token",
  __ssrInlineRender: true,
  setup(__props) {
    onMounted(() => {
      window.history.pushState(null, "", window.location.href);
      const handleBack = () => {
        router.visit(route("siswa.dashboard"), {
          replace: true
        });
      };
      window.addEventListener("popstate", handleBack);
      onUnmounted(() => {
        window.removeEventListener("popstate", handleBack);
      });
    });
    const page = usePage();
    const form = useForm({ token: "" });
    const isSubmitting = ref(false);
    const tokenInput = ref(null);
    const submit = () => {
      if (isSubmitting.value) return;
      isSubmitting.value = true;
      form.post(route("siswa.ujian.validateToken"), {
        preserveScroll: true,
        onFinish: () => {
          isSubmitting.value = false;
        }
      });
    };
    onMounted(() => {
      form.token = "";
      nextTick(() => {
        tokenInput.value?.focus();
        tokenInput.value?.select();
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ disableSwal: true }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Input Token Ujian" }, null, _parent2, _scopeId));
            _push2(`<div class="sm:min-h-[80vh] flex items-center justify-center sm:px-4"${_scopeId}><div class="relative w-full max-w-lg rounded-3xl bg-white/70 dark:bg-white/10 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-2xl p-8 sm:p-10 transition"${_scopeId}><div class="absolute -top-24 -right-24 w-72 h-72 dark:bg-gradient-to-br dark:from-blue-500 dark:to-indigo-600 opacity-20 blur-3xl rounded-full"${_scopeId}></div><div class="relative z-10 text-center space-y-4 mb-8"${_scopeId}><div class="${ssrRenderClass([unref(page).props.flash?.error ? "bg-red-100 dark:bg-red-500/20" : "bg-blue-100 dark:bg-blue-500/20", "mx-auto w-16 h-16 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300"])}"${_scopeId}>`);
            if (!unref(form).processing) {
              _push2(`<svg class="${ssrRenderClass([unref(page).props.flash?.error ? "text-red-600" : "text-blue-600", "w-8 h-8"])}" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 116 0v3H9z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<svg class="w-6 h-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            }
            _push2(`</div>`);
            if (unref(page).props.flash?.error) {
              _push2(`<div class="mx-auto w-fit px-6 py-2 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-full text-sm font-mono tracking-widest"${_scopeId}>${ssrInterpolate(unref(page).props.flash.error)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h1 class="text-2xl sm:text-3xl font-extrabold tracking-wide text-gray-800 dark:text-white"${_scopeId}> Enter Exam Token </h1><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}> Masukkan kode ujian yang diberikan oleh pengawas </p></div><form class="relative z-10"${_scopeId}><div class="space-y-5 p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 backdrop-blur-lg"${_scopeId}><input${ssrRenderAttr("value", unref(form).token)} required autocomplete="off" placeholder="XXXX-XXXX" class="w-full text-center px-5 py-4 rounded-xl text-lg sm:text-2xl font-mono font-bold tracking-widest text-blue-700 dark:text-blue-400 bg-white dark:bg-transparent border border-gray-300 dark:border-white/20 focus:ring-4 focus:ring-blue-400/40 focus:outline-none transition"${_scopeId}>`);
            if (unref(form).errors.token) {
              _push2(`<p class="text-sm text-red-600 text-center"${_scopeId}>${ssrInterpolate(unref(form).errors.token)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(isSubmitting.value || unref(form).processing) ? " disabled" : ""} class="w-full py-4 rounded-xl font-bold text-white tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"${_scopeId}>`);
            if (isSubmitting.value || unref(form).processing) {
              _push2(`<svg class="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(isSubmitting.value || unref(form).processing ? "Verifying..." : "Verify & Start Exam")}</span></button></div></form></div></div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Input Token Ujian" }),
              createVNode("div", { class: "sm:min-h-[80vh] flex items-center justify-center sm:px-4" }, [
                createVNode("div", { class: "relative w-full max-w-lg rounded-3xl bg-white/70 dark:bg-white/10 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-2xl p-8 sm:p-10 transition" }, [
                  createVNode("div", { class: "absolute -top-24 -right-24 w-72 h-72 dark:bg-gradient-to-br dark:from-blue-500 dark:to-indigo-600 opacity-20 blur-3xl rounded-full" }),
                  createVNode("div", { class: "relative z-10 text-center space-y-4 mb-8" }, [
                    createVNode("div", {
                      class: ["mx-auto w-16 h-16 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300", unref(page).props.flash?.error ? "bg-red-100 dark:bg-red-500/20" : "bg-blue-100 dark:bg-blue-500/20"]
                    }, [
                      !unref(form).processing ? (openBlock(), createBlock("svg", {
                        key: 0,
                        class: ["w-8 h-8", unref(page).props.flash?.error ? "text-red-600" : "text-blue-600"],
                        viewBox: "0 0 24 24",
                        fill: "currentColor"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          "clip-rule": "evenodd",
                          d: "M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 116 0v3H9z"
                        })
                      ], 2)) : (openBlock(), createBlock("svg", {
                        key: 1,
                        class: "w-6 h-6 animate-spin text-blue-600",
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
                      ]))
                    ], 2),
                    unref(page).props.flash?.error ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mx-auto w-fit px-6 py-2 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-full text-sm font-mono tracking-widest"
                    }, toDisplayString(unref(page).props.flash.error), 1)) : createCommentVNode("", true),
                    createVNode("h1", { class: "text-2xl sm:text-3xl font-extrabold tracking-wide text-gray-800 dark:text-white" }, " Enter Exam Token "),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, " Masukkan kode ujian yang diberikan oleh pengawas ")
                  ]),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "relative z-10"
                  }, [
                    createVNode("div", { class: "space-y-5 p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 backdrop-blur-lg" }, [
                      withDirectives(createVNode("input", {
                        ref_key: "tokenInput",
                        ref: tokenInput,
                        "onUpdate:modelValue": ($event) => unref(form).token = $event,
                        required: "",
                        autocomplete: "off",
                        placeholder: "XXXX-XXXX",
                        class: "w-full text-center px-5 py-4 rounded-xl text-lg sm:text-2xl font-mono font-bold tracking-widest text-blue-700 dark:text-blue-400 bg-white dark:bg-transparent border border-gray-300 dark:border-white/20 focus:ring-4 focus:ring-blue-400/40 focus:outline-none transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).token]
                      ]),
                      unref(form).errors.token ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-600 text-center"
                      }, toDisplayString(unref(form).errors.token), 1)) : createCommentVNode("", true),
                      createVNode("button", {
                        type: "submit",
                        disabled: isSubmitting.value || unref(form).processing,
                        class: "w-full py-4 rounded-xl font-bold text-white tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      }, [
                        isSubmitting.value || unref(form).processing ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "w-5 h-5 animate-spin text-white",
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
                        createVNode("span", null, toDisplayString(isSubmitting.value || unref(form).processing ? "Verifying..." : "Verify & Start Exam"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Ujian/Token.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
