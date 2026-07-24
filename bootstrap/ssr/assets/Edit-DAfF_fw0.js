import { withCtx, unref, createVNode, createTextVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { useForm, Link } from "@inertiajs/vue3";
import { ArrowPathIcon, ArrowLeftIcon, CheckIcon } from "@heroicons/vue/24/solid";
import axios from "axios";
import Swal from "sweetalert2";
import "./Sidebar-COsy3wF2.js";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    soal: Object,
    nilai_per_soal: Number,
    mapel: Array
    // tambahkan props mapel dari backend
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      title: props.soal.title || "",
      mapel_id: props.soal.mapel_id || "",
      // gunakan mapel_id
      kelas: props.soal.kelas || "",
      waktu: props.soal.waktu || 0,
      status: props.soal.status || "Tidak Aktif",
      tipe_soal: props.soal.tipe_soal || "Berurutan",
      token: props.soal.token || "",
      nilai_per_soal: props.nilai_per_soal
    });
    const generateToken = () => {
      const t = Math.floor(1e5 + Math.random() * 9e5);
      form.token = t.toString().padStart(6, "0");
    };
    const submit = async () => {
      form.processing = true;
      try {
        await form.put(`/proktor/soal/${props.soal.id}`);
        if (props.soal.bank_soal && props.soal.bank_soal.length > 0) {
          await axios.put(`/proktor/soal/${props.soal.id}/update-nilai`, {
            nilai: form.nilai_per_soal
          });
        }
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pengaturan quiz, mapel, kelas, dan nilai berhasil diperbarui.",
          confirmButtonColor: "#3b82f6"
        }).then(() => {
          window.location.href = `/proktor/soal`;
        });
      } catch (err) {
        Swal.fire("Error", "Terjadi kesalahan saat update.", "error");
      } finally {
        form.processing = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto p-2 sm:p-8 sm:bg-white sm:dark:bg-white/5 sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-200 sm:dark:border-white/10"${_scopeId}><h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-gray-800 dark:text-gray-100"${_scopeId}> Pengaturan / Konfigurasi Quiz </h1><form class="space-y-5"${_scopeId}><div${_scopeId}><label class="label"${_scopeId}>Judul Quiz</label><input${ssrRenderAttr("value", unref(form).title)} type="text" placeholder="Masukkan judul quiz" class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="label"${_scopeId}>Mata Pelajaran</label><select class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel_id) ? ssrLooseContain(unref(form).mapel_id, "") : ssrLooseEqual(unref(form).mapel_id, "")) ? " selected" : ""}${_scopeId}>-- Pilih Mata Pelajaran --</option><!--[-->`);
            ssrRenderList(__props.mapel, (m) => {
              _push2(`<option${ssrRenderAttr("value", m.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel_id) ? ssrLooseContain(unref(form).mapel_id, m.id) : ssrLooseEqual(unref(form).mapel_id, m.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(m.mapel)}</option>`);
            });
            _push2(`<!--]--></select></div><div${_scopeId}><label class="label"${_scopeId}>Kelas</label><input${ssrRenderAttr("value", unref(form).kelas)} type="text" placeholder="Masukkan kelas" class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="label"${_scopeId}>Waktu (Menit)</label><input${ssrRenderAttr("value", unref(form).waktu)} type="number" placeholder="Masukkan waktu pengerjaan" class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}></div><div${_scopeId}><label class="label"${_scopeId}>Status Quiz</label><select class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}><option value="Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Aktif") : ssrLooseEqual(unref(form).status, "Aktif")) ? " selected" : ""}${_scopeId}>Aktif</option><option value="Tidak Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Tidak Aktif") : ssrLooseEqual(unref(form).status, "Tidak Aktif")) ? " selected" : ""}${_scopeId}>Tidak Aktif</option></select></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="label"${_scopeId}>Format Soal</label><select class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"${_scopeId}><option value="Berurutan"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe_soal) ? ssrLooseContain(unref(form).tipe_soal, "Berurutan") : ssrLooseEqual(unref(form).tipe_soal, "Berurutan")) ? " selected" : ""}${_scopeId}>Berurutan</option><option value="Acak"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe_soal) ? ssrLooseContain(unref(form).tipe_soal, "Acak") : ssrLooseEqual(unref(form).tipe_soal, "Acak")) ? " selected" : ""}${_scopeId}>Acak</option></select></div><div${_scopeId}><label class="label"${_scopeId}>Nilai (/Butir Soal)</label><input${ssrRenderAttr("value", unref(form).nilai_per_soal)} type="number" min="0"${ssrIncludeBooleanAttr(!props.soal.bank_soal || props.soal.bank_soal.length === 0) ? " disabled" : ""} class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:text-gray-400"${_scopeId}>`);
            if (!props.soal.bank_soal || props.soal.bank_soal.length === 0) {
              _push2(`<p class="mt-1 text-sm text-red-500"${_scopeId}> Tidak ada soal, tidak dapat mengisi nilai poin. </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div${_scopeId}><label class="label"${_scopeId}>Token Quiz</label><div class="flex flex-col sm:flex-row gap-3"${_scopeId}><input${ssrRenderAttr("value", unref(form).token)} type="text" readonly class="flex-1 rounded-lg p-3 font-semibold bg-gray-100 dark:bg-slate-900 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-200"${_scopeId}><button type="button" class="btn-success"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` Generate Token Baru </button></div></div><div class="flex flex-col sm:flex-row gap-4 pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/proktor/soal",
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
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "label" }, "Waktu (Menit)"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).waktu = $event,
                        type: "number",
                        placeholder: "Masukkan waktu pengerjaan",
                        class: "form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).waktu]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "label" }, "Status Quiz"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).status = $event,
                        class: "form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                      }, [
                        createVNode("option", { value: "Aktif" }, "Aktif"),
                        createVNode("option", { value: "Tidak Aktif" }, "Tidak Aktif")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).status]
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "label" }, "Format Soal"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).tipe_soal = $event,
                        class: "form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                      }, [
                        createVNode("option", { value: "Berurutan" }, "Berurutan"),
                        createVNode("option", { value: "Acak" }, "Acak")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).tipe_soal]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "label" }, "Nilai (/Butir Soal)"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).nilai_per_soal = $event,
                        type: "number",
                        min: "0",
                        disabled: !props.soal.bank_soal || props.soal.bank_soal.length === 0,
                        class: "form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:text-gray-400"
                      }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                        [vModelText, unref(form).nilai_per_soal]
                      ]),
                      !props.soal.bank_soal || props.soal.bank_soal.length === 0 ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-500"
                      }, " Tidak ada soal, tidak dapat mengisi nilai poin. ")) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "label" }, "Token Quiz"),
                    createVNode("div", { class: "flex flex-col sm:flex-row gap-3" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).token = $event,
                        type: "text",
                        readonly: "",
                        class: "flex-1 rounded-lg p-3 font-semibold bg-gray-100 dark:bg-slate-900 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-200"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).token]
                      ]),
                      createVNode("button", {
                        type: "button",
                        onClick: generateToken,
                        class: "btn-success"
                      }, [
                        createVNode(unref(ArrowPathIcon), { class: "w-5 h-5" }),
                        createTextVNode(" Generate Token Baru ")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-col sm:flex-row gap-4 pt-4" }, [
                    createVNode(unref(Link), {
                      href: "/proktor/soal",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Proktor/Soal/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
