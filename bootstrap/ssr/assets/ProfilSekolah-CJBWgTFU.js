import { defineComponent, h, ref, computed, resolveComponent, withCtx, unref, createVNode, openBlock, createBlock, createCommentVNode, createTextVNode, toDisplayString, withDirectives, vModelText, Transition, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
const ICONS = {
  photo: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 19.5h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v12a.75.75 0 00.75.75z",
  identification: "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z",
  map: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z",
  academic: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
};
const PageCard = defineComponent({
  name: "PageCard",
  props: { title: String, icon: { type: String, default: "photo" } },
  setup(props, { slots }) {
    return () => h("section", {
      class: [
        "bg-white dark:bg-slate-800/60",
        "border border-gray-200 dark:border-slate-700/50",
        "rounded-2xl shadow-sm overflow-hidden",
        "backdrop-blur-sm transition-colors duration-200"
      ].join(" ")
    }, [
      // Card header
      h("div", {
        class: "flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/80 dark:bg-slate-800/40"
      }, [
        h("div", {
          class: "w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shrink-0"
        }, [
          h("svg", {
            class: "w-4 h-4 text-blue-600 dark:text-blue-400",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.8",
            viewBox: "0 0 24 24"
          }, [
            h("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: ICONS[props.icon] ?? ICONS.photo
            })
          ])
        ]),
        h("h2", {
          class: "text-sm font-bold text-gray-700 dark:text-slate-200 tracking-wide uppercase"
        }, props.title)
      ]),
      // Card body
      h("div", { class: "p-6" }, slots.default?.())
    ]);
  }
});
const FormField = defineComponent({
  name: "FormField",
  props: { label: String, required: Boolean, error: String },
  setup(props, { slots }) {
    return () => h("div", { class: "flex flex-col gap-1.5" }, [
      h("label", {
        class: "text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
      }, [
        props.label,
        props.required ? h("span", { class: "text-red-500 ml-0.5" }, " *") : null
      ]),
      slots.default?.(),
      props.error ? h("p", { class: "text-xs text-red-500 dark:text-red-400 flex items-center gap-1 mt-0.5" }, [
        h("svg", { class: "w-3 h-3 shrink-0", fill: "currentColor", viewBox: "0 0 20 20" }, [
          h("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" })
        ]),
        props.error
      ]) : null
    ]);
  }
});
const _sfc_main = {
  __name: "ProfilSekolah",
  __ssrInlineRender: true,
  props: {
    profil: { type: Object, default: null }
  },
  setup(__props) {
    const props = __props;
    const logoPreview = ref(
      props.profil?.file_path ? `/storage/${props.profil.file_path}?v=${new Date(props.profil.updated_at).getTime()}` : null
    );
    const form = useForm({
      nama_sekolah: props.profil?.nama_sekolah ?? "",
      kepala_yayasan: props.profil?.kepala_yayasan ?? "",
      kepala_sekolah: props.profil?.kepala_sekolah ?? "",
      akreditasi: props.profil?.akreditasi ?? "",
      npsn: props.profil?.npsn ?? "",
      no_izin: props.profil?.no_izin ?? "",
      nss: props.profil?.nss ?? "",
      telepon: props.profil?.telepon ?? "",
      email: props.profil?.email ?? "",
      website: props.profil?.website ?? "",
      alamat: props.profil?.alamat ?? "",
      rt: props.profil?.rt ?? "",
      rw: props.profil?.rw ?? "",
      kelurahan: props.profil?.kelurahan ?? "",
      kecamatan: props.profil?.kecamatan ?? "",
      kabupaten_kota: props.profil?.kabupaten_kota ?? "",
      provinsi: props.profil?.provinsi ?? "",
      kode_pos: props.profil?.kode_pos ?? "",
      visi: props.profil?.visi ?? "",
      misi: props.profil?.misi ?? "",
      logo: null
    });
    const submitLabel = computed(() => props.profil ? "Update Profil" : "Simpan Profil");
    function onLogoChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      form.logo = file;
      logoPreview.value = URL.createObjectURL(file);
    }
    function submit() {
      form.post(route("admin.profil_sekolah.storeOrUpdate"), {
        forceFormData: true,
        preserveScroll: true
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, { title: "Profil Sekolah" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-5xl mx-auto space-y-6" data-v-dab55715${_scopeId}><div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border border-blue-500/30 dark:border-white/5 shadow-xl shadow-blue-900/20 dark:shadow-black/40 px-8 py-7" data-v-dab55715${_scopeId}><span class="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" data-v-dab55715${_scopeId}></span><span class="absolute -bottom-10 -left-4 w-32 h-32 rounded-full bg-white/5 pointer-events-none" data-v-dab55715${_scopeId}></span><div class="relative flex items-center gap-5" data-v-dab55715${_scopeId}><div class="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner" data-v-dab55715${_scopeId}><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" data-v-dab55715${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" data-v-dab55715${_scopeId}></path></svg></div><div data-v-dab55715${_scopeId}><h1 class="text-xl font-bold text-white tracking-tight" data-v-dab55715${_scopeId}>Data Profil Sekolah</h1><p class="mt-0.5 text-sm text-blue-200 dark:text-slate-400" data-v-dab55715${_scopeId}> Kelola identitas, alamat, dan visi misi sekolah </p></div></div></div>`);
            if (_ctx.$page.props.flash?.success) {
              _push2(`<div class="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl shadow-sm" data-v-dab55715${_scopeId}><div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0" data-v-dab55715${_scopeId}><svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20" data-v-dab55715${_scopeId}><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-v-dab55715${_scopeId}></path></svg></div><span class="text-sm font-medium" data-v-dab55715${_scopeId}>${ssrInterpolate(_ctx.$page.props.flash.success)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="space-y-5" data-v-dab55715${_scopeId}>`);
            _push2(ssrRenderComponent(unref(PageCard), {
              title: "Logo Sekolah",
              icon: "photo"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col sm:flex-row items-center gap-6" data-v-dab55715${_scopeId2}><div class="relative shrink-0 group" data-v-dab55715${_scopeId2}><div class="w-28 h-28 rounded-2xl overflow-hidden border-2 border-dashed p-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/60 flex items-center justify-center transition-colors group-hover:border-blue-400 dark:group-hover:border-blue-500" data-v-dab55715${_scopeId2}>`);
                  if (logoPreview.value) {
                    _push3(`<img${ssrRenderAttr("src", logoPreview.value)} alt="Logo" class="w-full h-full object-contain" data-v-dab55715${_scopeId2}>`);
                  } else {
                    _push3(`<div class="flex flex-col items-center text-gray-300 dark:text-slate-600" data-v-dab55715${_scopeId2}><svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24" data-v-dab55715${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 19.5h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v12a.75.75 0 00.75.75z" data-v-dab55715${_scopeId2}></path></svg><span class="text-xs mt-1.5 font-medium" data-v-dab55715${_scopeId2}>No logo</span></div>`);
                  }
                  _push3(`</div>`);
                  if (logoPreview.value) {
                    _push3(`<span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" data-v-dab55715${_scopeId2}></span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex-1 w-full space-y-3" data-v-dab55715${_scopeId2}><label class="block" data-v-dab55715${_scopeId2}><span class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block" data-v-dab55715${_scopeId2}> Upload Logo Baru </span><input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" class="block w-full text-sm text-gray-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:file:bg-blue-500 dark:hover:file:bg-blue-600 file:transition-colors file:duration-150 cursor-pointer" data-v-dab55715${_scopeId2}></label><p class="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5" data-v-dab55715${_scopeId2}><svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-dab55715${_scopeId2}><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" data-v-dab55715${_scopeId2}></path></svg> Format JPG, PNG, WebP · Maks 10MB </p>`);
                  if (unref(form).errors.logo) {
                    _push3(`<p class="text-xs text-red-500 dark:text-red-400" data-v-dab55715${_scopeId2}>${ssrInterpolate(unref(form).errors.logo)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex flex-col sm:flex-row items-center gap-6" }, [
                      createVNode("div", { class: "relative shrink-0 group" }, [
                        createVNode("div", { class: "w-28 h-28 rounded-2xl overflow-hidden border-2 border-dashed p-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/60 flex items-center justify-center transition-colors group-hover:border-blue-400 dark:group-hover:border-blue-500" }, [
                          logoPreview.value ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: logoPreview.value,
                            alt: "Logo",
                            class: "w-full h-full object-contain"
                          }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex flex-col items-center text-gray-300 dark:text-slate-600"
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-10 h-10",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "1.2",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 19.5h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v12a.75.75 0 00.75.75z"
                              })
                            ])),
                            createVNode("span", { class: "text-xs mt-1.5 font-medium" }, "No logo")
                          ]))
                        ]),
                        logoPreview.value ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800"
                        })) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex-1 w-full space-y-3" }, [
                        createVNode("label", { class: "block" }, [
                          createVNode("span", { class: "text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block" }, " Upload Logo Baru "),
                          createVNode("input", {
                            type: "file",
                            accept: "image/jpg,image/jpeg,image/png,image/webp",
                            onChange: onLogoChange,
                            class: "block w-full text-sm text-gray-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:file:bg-blue-500 dark:hover:file:bg-blue-600 file:transition-colors file:duration-150 cursor-pointer"
                          }, null, 32)
                        ]),
                        createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5" }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-3.5 h-3.5 shrink-0",
                            fill: "currentColor",
                            viewBox: "0 0 20 20"
                          }, [
                            createVNode("path", {
                              "fill-rule": "evenodd",
                              d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
                              "clip-rule": "evenodd"
                            })
                          ])),
                          createTextVNode(" Format JPG, PNG, WebP · Maks 10MB ")
                        ]),
                        unref(form).errors.logo ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-xs text-red-500 dark:text-red-400"
                        }, toDisplayString(unref(form).errors.logo), 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(PageCard), {
              title: "Identitas Sekolah",
              icon: "identification"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid grid-cols-1 gap-4 md:grid-cols-2" data-v-dab55715${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Nama Sekolah",
                    required: "",
                    error: unref(form).errors.nama_sekolah,
                    class: "md:col-span-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).nama_sekolah)} type="text" placeholder="Masukkan nama sekolah" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).nama_sekolah = $event,
                            type: "text",
                            placeholder: "Masukkan nama sekolah",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).nama_sekolah]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Nama Kepala Yayasan",
                    error: unref(form).errors.kepala_yayasan
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).kepala_yayasan)} type="text" placeholder="Nama lengkap" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).kepala_yayasan = $event,
                            type: "text",
                            placeholder: "Nama lengkap",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).kepala_yayasan]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Nama Kepala Sekolah",
                    error: unref(form).errors.kepala_sekolah
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).kepala_sekolah)} type="text" placeholder="Nama lengkap" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).kepala_sekolah = $event,
                            type: "text",
                            placeholder: "Nama lengkap",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).kepala_sekolah]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Akreditasi",
                    error: unref(form).errors.akreditasi
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).akreditasi)} type="text" placeholder="Contoh: A / B / C" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).akreditasi = $event,
                            type: "text",
                            placeholder: "Contoh: A / B / C",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).akreditasi]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "NPSN",
                    error: unref(form).errors.npsn
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).npsn)} type="text" placeholder="Nomor Pokok Sekolah" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).npsn = $event,
                            type: "text",
                            placeholder: "Nomor Pokok Sekolah",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).npsn]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "No. Izin Operasional",
                    error: unref(form).errors.no_izin
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).no_izin)} type="text" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).no_izin = $event,
                            type: "text",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).no_izin]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "NSS",
                    error: unref(form).errors.nss
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).nss)} type="text" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).nss = $event,
                            type: "text",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).nss]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Telepon",
                    error: unref(form).errors.telepon
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).telepon)} type="text" placeholder="0xx-xxxx-xxxx" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).telepon = $event,
                            type: "text",
                            placeholder: "0xx-xxxx-xxxx",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).telepon]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Email",
                    error: unref(form).errors.email
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="sekolah@email.com" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            placeholder: "sekolah@email.com",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).email]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Website",
                    error: unref(form).errors.website
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).website)} type="text" placeholder="https://..." class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).website = $event,
                            type: "text",
                            placeholder: "https://...",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).website]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 gap-4 md:grid-cols-2" }, [
                      createVNode(unref(FormField), {
                        label: "Nama Sekolah",
                        required: "",
                        error: unref(form).errors.nama_sekolah,
                        class: "md:col-span-2"
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).nama_sekolah = $event,
                            type: "text",
                            placeholder: "Masukkan nama sekolah",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).nama_sekolah]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "Nama Kepala Yayasan",
                        error: unref(form).errors.kepala_yayasan
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).kepala_yayasan = $event,
                            type: "text",
                            placeholder: "Nama lengkap",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).kepala_yayasan]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "Nama Kepala Sekolah",
                        error: unref(form).errors.kepala_sekolah
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).kepala_sekolah = $event,
                            type: "text",
                            placeholder: "Nama lengkap",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).kepala_sekolah]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "Akreditasi",
                        error: unref(form).errors.akreditasi
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).akreditasi = $event,
                            type: "text",
                            placeholder: "Contoh: A / B / C",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).akreditasi]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "NPSN",
                        error: unref(form).errors.npsn
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).npsn = $event,
                            type: "text",
                            placeholder: "Nomor Pokok Sekolah",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).npsn]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "No. Izin Operasional",
                        error: unref(form).errors.no_izin
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).no_izin = $event,
                            type: "text",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).no_izin]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "NSS",
                        error: unref(form).errors.nss
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).nss = $event,
                            type: "text",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).nss]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "Telepon",
                        error: unref(form).errors.telepon
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).telepon = $event,
                            type: "text",
                            placeholder: "0xx-xxxx-xxxx",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).telepon]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "Email",
                        error: unref(form).errors.email
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            placeholder: "sekolah@email.com",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).email]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "Website",
                        error: unref(form).errors.website
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).website = $event,
                            type: "text",
                            placeholder: "https://...",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).website]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(PageCard), {
              title: "Alamat Sekolah",
              icon: "map"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4" data-v-dab55715${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Alamat Jalan",
                    error: unref(form).errors.alamat
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<textarea rows="3" placeholder="Jl. nama jalan no. ..." class="field-input resize-none" data-v-dab55715${_scopeId3}>${ssrInterpolate(unref(form).alamat)}</textarea>`);
                      } else {
                        return [
                          withDirectives(createVNode("textarea", {
                            "onUpdate:modelValue": ($event) => unref(form).alamat = $event,
                            rows: "3",
                            placeholder: "Jl. nama jalan no. ...",
                            class: "field-input resize-none"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).alamat]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="grid grid-cols-2 gap-4 sm:grid-cols-4" data-v-dab55715${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "RT",
                    error: unref(form).errors.rt
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).rt)} type="text" placeholder="001" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).rt = $event,
                            type: "text",
                            placeholder: "001",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).rt]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "RW",
                    error: unref(form).errors.rw
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).rw)} type="text" placeholder="002" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).rw = $event,
                            type: "text",
                            placeholder: "002",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).rw]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Kode Pos",
                    error: unref(form).errors.kode_pos,
                    class: "sm:col-span-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).kode_pos)} type="text" placeholder="5xxxx" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).kode_pos = $event,
                            type: "text",
                            placeholder: "5xxxx",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).kode_pos]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid grid-cols-1 gap-4 sm:grid-cols-2" data-v-dab55715${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Kelurahan / Desa",
                    error: unref(form).errors.kelurahan
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).kelurahan)} type="text" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).kelurahan = $event,
                            type: "text",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).kelurahan]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Kecamatan",
                    error: unref(form).errors.kecamatan
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).kecamatan)} type="text" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).kecamatan = $event,
                            type: "text",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).kecamatan]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Kabupaten / Kota",
                    error: unref(form).errors.kabupaten_kota
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).kabupaten_kota)} type="text" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).kabupaten_kota = $event,
                            type: "text",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).kabupaten_kota]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Provinsi",
                    error: unref(form).errors.provinsi
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input${ssrRenderAttr("value", unref(form).provinsi)} type="text" class="field-input" data-v-dab55715${_scopeId3}>`);
                      } else {
                        return [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).provinsi = $event,
                            type: "text",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).provinsi]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(unref(FormField), {
                        label: "Alamat Jalan",
                        error: unref(form).errors.alamat
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("textarea", {
                            "onUpdate:modelValue": ($event) => unref(form).alamat = $event,
                            rows: "3",
                            placeholder: "Jl. nama jalan no. ...",
                            class: "field-input resize-none"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).alamat]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode("div", { class: "grid grid-cols-2 gap-4 sm:grid-cols-4" }, [
                        createVNode(unref(FormField), {
                          label: "RT",
                          error: unref(form).errors.rt
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).rt = $event,
                              type: "text",
                              placeholder: "001",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).rt]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "RW",
                          error: unref(form).errors.rw
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).rw = $event,
                              type: "text",
                              placeholder: "002",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).rw]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Kode Pos",
                          error: unref(form).errors.kode_pos,
                          class: "sm:col-span-2"
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).kode_pos = $event,
                              type: "text",
                              placeholder: "5xxxx",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).kode_pos]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"])
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 gap-4 sm:grid-cols-2" }, [
                        createVNode(unref(FormField), {
                          label: "Kelurahan / Desa",
                          error: unref(form).errors.kelurahan
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).kelurahan = $event,
                              type: "text",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).kelurahan]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Kecamatan",
                          error: unref(form).errors.kecamatan
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).kecamatan = $event,
                              type: "text",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).kecamatan]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Kabupaten / Kota",
                          error: unref(form).errors.kabupaten_kota
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).kabupaten_kota = $event,
                              type: "text",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).kabupaten_kota]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Provinsi",
                          error: unref(form).errors.provinsi
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).provinsi = $event,
                              type: "text",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).provinsi]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(PageCard), {
              title: "Visi & Misi Sekolah",
              icon: "academic"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid grid-cols-1 gap-4 md:grid-cols-2" data-v-dab55715${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Visi",
                    error: unref(form).errors.visi
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<textarea rows="6" placeholder="Tuliskan visi sekolah..." class="field-input resize-none" data-v-dab55715${_scopeId3}>${ssrInterpolate(unref(form).visi)}</textarea>`);
                      } else {
                        return [
                          withDirectives(createVNode("textarea", {
                            "onUpdate:modelValue": ($event) => unref(form).visi = $event,
                            rows: "6",
                            placeholder: "Tuliskan visi sekolah...",
                            class: "field-input resize-none"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).visi]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(FormField), {
                    label: "Misi",
                    error: unref(form).errors.misi
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<textarea rows="6" placeholder="Tuliskan misi sekolah..." class="field-input resize-none" data-v-dab55715${_scopeId3}>${ssrInterpolate(unref(form).misi)}</textarea>`);
                      } else {
                        return [
                          withDirectives(createVNode("textarea", {
                            "onUpdate:modelValue": ($event) => unref(form).misi = $event,
                            rows: "6",
                            placeholder: "Tuliskan misi sekolah...",
                            class: "field-input resize-none"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).misi]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 gap-4 md:grid-cols-2" }, [
                      createVNode(unref(FormField), {
                        label: "Visi",
                        error: unref(form).errors.visi
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("textarea", {
                            "onUpdate:modelValue": ($event) => unref(form).visi = $event,
                            rows: "6",
                            placeholder: "Tuliskan visi sekolah...",
                            class: "field-input resize-none"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).visi]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(unref(FormField), {
                        label: "Misi",
                        error: unref(form).errors.misi
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("textarea", {
                            "onUpdate:modelValue": ($event) => unref(form).misi = $event,
                            rows: "6",
                            placeholder: "Tuliskan misi sekolah...",
                            class: "field-input resize-none"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).misi]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex items-center justify-between pb-6 pt-4 border-t border-gray-200 dark:border-slate-700/60" data-v-dab55715${_scopeId}><p class="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1" data-v-dab55715${_scopeId}><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" data-v-dab55715${_scopeId}><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" data-v-dab55715${_scopeId}></path></svg> Field bertanda * wajib diisi </p><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-600/25 dark:shadow-blue-500/20 border border-blue-500/40 dark:border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95" data-v-dab55715${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" data-v-dab55715${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-dab55715${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" data-v-dab55715${_scopeId}></path></svg>`);
            } else {
              _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-dab55715${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-v-dab55715${_scopeId}></path></svg>`);
            }
            _push2(` ${ssrInterpolate(unref(form).processing ? "Menyimpan..." : submitLabel.value)}</button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-5xl mx-auto space-y-6" }, [
                createVNode("div", { class: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border border-blue-500/30 dark:border-white/5 shadow-xl shadow-blue-900/20 dark:shadow-black/40 px-8 py-7" }, [
                  createVNode("span", { class: "absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" }),
                  createVNode("span", { class: "absolute -bottom-10 -left-4 w-32 h-32 rounded-full bg-white/5 pointer-events-none" }),
                  createVNode("div", { class: "relative flex items-center gap-5" }, [
                    createVNode("div", { class: "w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-7 h-7 text-white",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "1.6",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                        })
                      ]))
                    ]),
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-xl font-bold text-white tracking-tight" }, "Data Profil Sekolah"),
                      createVNode("p", { class: "mt-0.5 text-sm text-blue-200 dark:text-slate-400" }, " Kelola identitas, alamat, dan visi misi sekolah ")
                    ])
                  ])
                ]),
                createVNode(Transition, {
                  "enter-active-class": "transition duration-300 ease-out",
                  "enter-from-class": "opacity-0 -translate-y-2",
                  "enter-to-class": "opacity-100 translate-y-0",
                  "leave-active-class": "transition duration-200 ease-in",
                  "leave-from-class": "opacity-100 translate-y-0",
                  "leave-to-class": "opacity-0 -translate-y-2"
                }, {
                  default: withCtx(() => [
                    _ctx.$page.props.flash?.success ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl shadow-sm"
                    }, [
                      createVNode("div", { class: "w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400",
                          fill: "currentColor",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                            "clip-rule": "evenodd"
                          })
                        ]))
                      ]),
                      createVNode("span", { class: "text-sm font-medium" }, toDisplayString(_ctx.$page.props.flash.success), 1)
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "space-y-5"
                }, [
                  createVNode(unref(PageCard), {
                    title: "Logo Sekolah",
                    icon: "photo"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex flex-col sm:flex-row items-center gap-6" }, [
                        createVNode("div", { class: "relative shrink-0 group" }, [
                          createVNode("div", { class: "w-28 h-28 rounded-2xl overflow-hidden border-2 border-dashed p-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/60 flex items-center justify-center transition-colors group-hover:border-blue-400 dark:group-hover:border-blue-500" }, [
                            logoPreview.value ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: logoPreview.value,
                              alt: "Logo",
                              class: "w-full h-full object-contain"
                            }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex flex-col items-center text-gray-300 dark:text-slate-600"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-10 h-10",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "1.2",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 19.5h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v12a.75.75 0 00.75.75z"
                                })
                              ])),
                              createVNode("span", { class: "text-xs mt-1.5 font-medium" }, "No logo")
                            ]))
                          ]),
                          logoPreview.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800"
                          })) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex-1 w-full space-y-3" }, [
                          createVNode("label", { class: "block" }, [
                            createVNode("span", { class: "text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block" }, " Upload Logo Baru "),
                            createVNode("input", {
                              type: "file",
                              accept: "image/jpg,image/jpeg,image/png,image/webp",
                              onChange: onLogoChange,
                              class: "block w-full text-sm text-gray-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:file:bg-blue-500 dark:hover:file:bg-blue-600 file:transition-colors file:duration-150 cursor-pointer"
                            }, null, 32)
                          ]),
                          createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-3.5 h-3.5 shrink-0",
                              fill: "currentColor",
                              viewBox: "0 0 20 20"
                            }, [
                              createVNode("path", {
                                "fill-rule": "evenodd",
                                d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
                                "clip-rule": "evenodd"
                              })
                            ])),
                            createTextVNode(" Format JPG, PNG, WebP · Maks 10MB ")
                          ]),
                          unref(form).errors.logo ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-xs text-red-500 dark:text-red-400"
                          }, toDisplayString(unref(form).errors.logo), 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(PageCard), {
                    title: "Identitas Sekolah",
                    icon: "identification"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "grid grid-cols-1 gap-4 md:grid-cols-2" }, [
                        createVNode(unref(FormField), {
                          label: "Nama Sekolah",
                          required: "",
                          error: unref(form).errors.nama_sekolah,
                          class: "md:col-span-2"
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).nama_sekolah = $event,
                              type: "text",
                              placeholder: "Masukkan nama sekolah",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).nama_sekolah]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Nama Kepala Yayasan",
                          error: unref(form).errors.kepala_yayasan
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).kepala_yayasan = $event,
                              type: "text",
                              placeholder: "Nama lengkap",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).kepala_yayasan]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Nama Kepala Sekolah",
                          error: unref(form).errors.kepala_sekolah
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).kepala_sekolah = $event,
                              type: "text",
                              placeholder: "Nama lengkap",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).kepala_sekolah]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Akreditasi",
                          error: unref(form).errors.akreditasi
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).akreditasi = $event,
                              type: "text",
                              placeholder: "Contoh: A / B / C",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).akreditasi]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "NPSN",
                          error: unref(form).errors.npsn
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).npsn = $event,
                              type: "text",
                              placeholder: "Nomor Pokok Sekolah",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).npsn]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "No. Izin Operasional",
                          error: unref(form).errors.no_izin
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).no_izin = $event,
                              type: "text",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).no_izin]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "NSS",
                          error: unref(form).errors.nss
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).nss = $event,
                              type: "text",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).nss]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Telepon",
                          error: unref(form).errors.telepon
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).telepon = $event,
                              type: "text",
                              placeholder: "0xx-xxxx-xxxx",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).telepon]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Email",
                          error: unref(form).errors.email
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).email = $event,
                              type: "email",
                              placeholder: "sekolah@email.com",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).email]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Website",
                          error: unref(form).errors.website
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).website = $event,
                              type: "text",
                              placeholder: "https://...",
                              class: "field-input"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).website]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(PageCard), {
                    title: "Alamat Sekolah",
                    icon: "map"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode(unref(FormField), {
                          label: "Alamat Jalan",
                          error: unref(form).errors.alamat
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("textarea", {
                              "onUpdate:modelValue": ($event) => unref(form).alamat = $event,
                              rows: "3",
                              placeholder: "Jl. nama jalan no. ...",
                              class: "field-input resize-none"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).alamat]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode("div", { class: "grid grid-cols-2 gap-4 sm:grid-cols-4" }, [
                          createVNode(unref(FormField), {
                            label: "RT",
                            error: unref(form).errors.rt
                          }, {
                            default: withCtx(() => [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).rt = $event,
                                type: "text",
                                placeholder: "001",
                                class: "field-input"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).rt]
                              ])
                            ]),
                            _: 1
                          }, 8, ["error"]),
                          createVNode(unref(FormField), {
                            label: "RW",
                            error: unref(form).errors.rw
                          }, {
                            default: withCtx(() => [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).rw = $event,
                                type: "text",
                                placeholder: "002",
                                class: "field-input"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).rw]
                              ])
                            ]),
                            _: 1
                          }, 8, ["error"]),
                          createVNode(unref(FormField), {
                            label: "Kode Pos",
                            error: unref(form).errors.kode_pos,
                            class: "sm:col-span-2"
                          }, {
                            default: withCtx(() => [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).kode_pos = $event,
                                type: "text",
                                placeholder: "5xxxx",
                                class: "field-input"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).kode_pos]
                              ])
                            ]),
                            _: 1
                          }, 8, ["error"])
                        ]),
                        createVNode("div", { class: "grid grid-cols-1 gap-4 sm:grid-cols-2" }, [
                          createVNode(unref(FormField), {
                            label: "Kelurahan / Desa",
                            error: unref(form).errors.kelurahan
                          }, {
                            default: withCtx(() => [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).kelurahan = $event,
                                type: "text",
                                class: "field-input"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).kelurahan]
                              ])
                            ]),
                            _: 1
                          }, 8, ["error"]),
                          createVNode(unref(FormField), {
                            label: "Kecamatan",
                            error: unref(form).errors.kecamatan
                          }, {
                            default: withCtx(() => [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).kecamatan = $event,
                                type: "text",
                                class: "field-input"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).kecamatan]
                              ])
                            ]),
                            _: 1
                          }, 8, ["error"]),
                          createVNode(unref(FormField), {
                            label: "Kabupaten / Kota",
                            error: unref(form).errors.kabupaten_kota
                          }, {
                            default: withCtx(() => [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).kabupaten_kota = $event,
                                type: "text",
                                class: "field-input"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).kabupaten_kota]
                              ])
                            ]),
                            _: 1
                          }, 8, ["error"]),
                          createVNode(unref(FormField), {
                            label: "Provinsi",
                            error: unref(form).errors.provinsi
                          }, {
                            default: withCtx(() => [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).provinsi = $event,
                                type: "text",
                                class: "field-input"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).provinsi]
                              ])
                            ]),
                            _: 1
                          }, 8, ["error"])
                        ])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(PageCard), {
                    title: "Visi & Misi Sekolah",
                    icon: "academic"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "grid grid-cols-1 gap-4 md:grid-cols-2" }, [
                        createVNode(unref(FormField), {
                          label: "Visi",
                          error: unref(form).errors.visi
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("textarea", {
                              "onUpdate:modelValue": ($event) => unref(form).visi = $event,
                              rows: "6",
                              placeholder: "Tuliskan visi sekolah...",
                              class: "field-input resize-none"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).visi]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(unref(FormField), {
                          label: "Misi",
                          error: unref(form).errors.misi
                        }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("textarea", {
                              "onUpdate:modelValue": ($event) => unref(form).misi = $event,
                              rows: "6",
                              placeholder: "Tuliskan misi sekolah...",
                              class: "field-input resize-none"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).misi]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "flex items-center justify-between pb-6 pt-4 border-t border-gray-200 dark:border-slate-700/60" }, [
                    createVNode("p", { class: "text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-3 h-3",
                        fill: "currentColor",
                        viewBox: "0 0 20 20"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
                          "clip-rule": "evenodd"
                        })
                      ])),
                      createTextVNode(" Field bertanda * wajib diisi ")
                    ]),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-600/25 dark:shadow-blue-500/20 border border-blue-500/40 dark:border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                    }, [
                      unref(form).processing ? (openBlock(), createBlock("svg", {
                        key: 0,
                        class: "w-4 h-4 animate-spin",
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
                          d: "M4 12a8 8 0 018-8v8H4z"
                        })
                      ])) : (openBlock(), createBlock("svg", {
                        key: 1,
                        class: "w-4 h-4",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2.5",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M5 13l4 4L19 7"
                        })
                      ])),
                      createTextVNode(" " + toDisplayString(unref(form).processing ? "Menyimpan..." : submitLabel.value), 1)
                    ], 8, ["disabled"])
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/ProfilSekolah.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProfilSekolah = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dab55715"]]);
export {
  FormField,
  PageCard,
  ProfilSekolah as default
};
