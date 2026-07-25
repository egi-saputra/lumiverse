import { withCtx, unref, createVNode, createTextVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { useForm, Link } from "@inertiajs/vue3";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/vue/24/solid";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import "@vueuse/core";
import "@heroicons/vue/24/outline";
import "sweetalert2";
import "ziggy-js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    soal: Object,
    nilai_per_soal: Number,
    mapel: Array
  },
  setup(__props) {
    const { success, error } = ToastAlert();
    const props = __props;
    const form = useForm({
      title: props.soal.title || "",
      mapel_id: props.soal.mapel_id || "",
      kelas: props.soal.kelas || "",
      waktu: props.soal.waktu || 0,
      status: props.soal.status || "Tidak Aktif",
      tipe_soal: props.soal.tipe_soal || "Berurutan",
      token: props.soal.token || "",
      nilai_per_soal: props.nilai_per_soal
    });
    const submit = () => {
      form.put(`/guru/soal/${props.soal.id}`, {
        onSuccess: () => {
          success("Pengaturan quiz berhasil diperbarui.");
        },
        onError: () => {
          error("Terjadi kesalahan saat update.");
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto p-2 sm:p-8 sm:bg-white sm:dark:bg-white/5 sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-200 sm:dark:border-white/10"${_scopeId}><h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-gray-800 dark:text-gray-100"${_scopeId}> Pengaturan / Konfigurasi Quiz </h1><form class="space-y-5"${_scopeId}><div${_scopeId}><label class="label"${_scopeId}>Judul Quiz</label><input${ssrRenderAttr("value", unref(form).title)} type="text" placeholder="Masukkan judul quiz" class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="label"${_scopeId}>Mata Pelajaran</label><select class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel_id) ? ssrLooseContain(unref(form).mapel_id, "") : ssrLooseEqual(unref(form).mapel_id, "")) ? " selected" : ""}${_scopeId}>-- Pilih Mata Pelajaran --</option><!--[-->`);
            ssrRenderList(__props.mapel, (m) => {
              _push2(`<option${ssrRenderAttr("value", m.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel_id) ? ssrLooseContain(unref(form).mapel_id, m.id) : ssrLooseEqual(unref(form).mapel_id, m.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(m.mapel)}</option>`);
            });
            _push2(`<!--]--></select></div><div${_scopeId}><label class="label"${_scopeId}>Kelas</label><input${ssrRenderAttr("value", unref(form).kelas)} type="text" placeholder="Masukkan kelas" class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}></div></div><div class="flex flex-col sm:flex-row gap-4 pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/guru/soal",
              class: "btn-secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-5 h-5" }, null, _parent3, _scopeId2));
                  _push3(` Kembali `);
                } else {
                  return [
                    createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
                    createTextVNode(" Kembali ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="btn-primary"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(form).processing ? "Updating..." : "Update")}</span></button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto p-2 sm:p-8 sm:bg-white sm:dark:bg-white/5 sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-200 sm:dark:border-white/10" }, [
                createVNode("h1", { class: "text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-gray-800 dark:text-gray-100" }, " Pengaturan / Konfigurasi Quiz "),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "space-y-5"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Judul Quiz"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).title = $event,
                      type: "text",
                      placeholder: "Masukkan judul quiz",
                      class: "form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).title]
                    ])
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "label" }, "Mata Pelajaran"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).mapel_id = $event,
                        class: "form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                      }, [
                        createVNode("option", { value: "" }, "-- Pilih Mata Pelajaran --"),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.mapel, (m) => {
                          return openBlock(), createBlock("option", {
                            key: m.id,
                            value: m.id
                          }, toDisplayString(m.mapel), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).mapel_id]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "label" }, "Kelas"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).kelas = $event,
                        type: "text",
                        placeholder: "Masukkan kelas",
                        class: "form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).kelas]
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-col sm:flex-row gap-4 pt-4" }, [
                    createVNode(unref(Link), {
                      href: "/guru/soal",
                      class: "btn-secondary"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
                        createTextVNode(" Kembali ")
                      ]),
                      _: 1
                    }),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "btn-primary"
                    }, [
                      createVNode(unref(CheckIcon), { class: "w-5 h-5" }),
                      createVNode("span", null, toDisplayString(unref(form).processing ? "Updating..." : "Update"), 1)
                    ], 8, ["disabled"])
                  ])
                ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Quiz/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
