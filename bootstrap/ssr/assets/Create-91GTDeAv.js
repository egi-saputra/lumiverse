import { ref, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, withDirectives, vModelText, Fragment, renderList, vModelSelect, vModelDynamic, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderDynamicModel } from "vue/server-renderer";
import { O as OwnerLayout } from "./OwnerLayout-C9QaMqab.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    roleOptions: Array,
    userCount: Number,
    maxUsers: { type: [Number, null], default: null }
  },
  setup(__props) {
    const form = useForm({
      name: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      password_confirmation: ""
    });
    const showPassword = ref(false);
    const submit = () => {
      form.post(route("owner.users.store"), {
        preserveScroll: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Tambah Pengguna" }, null, _parent));
      _push(ssrRenderComponent(OwnerLayout, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="topbar-title" data-v-e5fe125e${_scopeId}>Tambah Pengguna</h1>`);
          } else {
            return [
              createVNode("h1", { class: "topbar-title" }, "Tambah Pengguna")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-3xl mx-auto p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-xl transition" data-v-e5fe125e${_scopeId}><div class="flex items-center justify-between mb-6" data-v-e5fe125e${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white" data-v-e5fe125e${_scopeId}> + Tambah Pengguna Baru </h1></div>`);
            if (unref(form).errors.limit) {
              _push2(`<div class="mb-6 rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/40 px-4 py-3 text-sm text-amber-700 dark:text-amber-300" data-v-e5fe125e${_scopeId}>${ssrInterpolate(unref(form).errors.limit)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="space-y-6" data-v-e5fe125e${_scopeId}><div data-v-e5fe125e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-e5fe125e${_scopeId}>Nama</label><input type="text"${ssrRenderAttr("value", unref(form).name)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-e5fe125e${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-e5fe125e${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-e5fe125e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-e5fe125e${_scopeId}>Alamat Email</label><input type="email"${ssrRenderAttr("value", unref(form).email)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-e5fe125e${_scopeId}>`);
            if (unref(form).errors.email) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-e5fe125e${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-e5fe125e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-e5fe125e${_scopeId}> Telepon <span class="font-normal text-gray-400 dark:text-gray-500" data-v-e5fe125e${_scopeId}>(opsional)</span></label><input type="text"${ssrRenderAttr("value", unref(form).phone)} placeholder="08xxxxxxxxxx" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-e5fe125e${_scopeId}>`);
            if (unref(form).errors.phone) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-e5fe125e${_scopeId}>${ssrInterpolate(unref(form).errors.phone)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-e5fe125e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-e5fe125e${_scopeId}>Peran User</label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" data-v-e5fe125e${_scopeId}><option value="" disabled data-v-e5fe125e${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "") : ssrLooseEqual(unref(form).role, "")) ? " selected" : ""}${_scopeId}>-- Pilih Peran --</option><!--[-->`);
            ssrRenderList(__props.roleOptions, (r) => {
              _push2(`<option${ssrRenderAttr("value", r.value)} data-v-e5fe125e${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, r.value) : ssrLooseEqual(unref(form).role, r.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(r.label)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.role) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-e5fe125e${_scopeId}>${ssrInterpolate(unref(form).errors.role)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-e5fe125e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-e5fe125e${_scopeId}>Password</label><div class="relative" data-v-e5fe125e${_scopeId}><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(form).password, null)} class="w-full pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-e5fe125e${_scopeId}><button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition" data-v-e5fe125e${_scopeId}>`);
            if (!showPassword.value) {
              _push2(ssrRenderComponent(unref(EyeIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(EyeSlashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            }
            _push2(`</button></div>`);
            if (unref(form).errors.password) {
              _push2(`<div class="text-red-600 text-sm mt-1" data-v-e5fe125e${_scopeId}>${ssrInterpolate(unref(form).errors.password)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-e5fe125e${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" data-v-e5fe125e${_scopeId}>Konfirmasi Password</label><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(form).password_confirmation, null)} class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" data-v-e5fe125e${_scopeId}></div><div class="flex flex-col sm:flex-row justify-end gap-3 pt-4" data-v-e5fe125e${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("owner.users.index"),
              class: "px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-center"
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
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition" data-v-e5fe125e${_scopeId}>${ssrInterpolate(unref(form).processing ? "Menyimpan..." : "Simpan")}</button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-3xl mx-auto p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-xl transition" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, " + Tambah Pengguna Baru ")
                ]),
                unref(form).errors.limit ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mb-6 rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/40 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
                }, toDisplayString(unref(form).errors.limit), 1)) : createCommentVNode("", true),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "space-y-6"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Nama"),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).name]
                    ]),
                    unref(form).errors.name ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-600 text-sm mt-1"
                    }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Alamat Email"),
                    withDirectives(createVNode("input", {
                      type: "email",
                      "onUpdate:modelValue": ($event) => unref(form).email = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).email]
                    ]),
                    unref(form).errors.email ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-600 text-sm mt-1"
                    }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, [
                      createTextVNode(" Telepon "),
                      createVNode("span", { class: "font-normal text-gray-400 dark:text-gray-500" }, "(opsional)")
                    ]),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => unref(form).phone = $event,
                      placeholder: "08xxxxxxxxxx",
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).phone]
                    ]),
                    unref(form).errors.phone ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-600 text-sm mt-1"
                    }, toDisplayString(unref(form).errors.phone), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Peran User"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).role = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    }, [
                      createVNode("option", {
                        value: "",
                        disabled: ""
                      }, "-- Pilih Peran --"),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.roleOptions, (r) => {
                        return openBlock(), createBlock("option", {
                          key: r.value,
                          value: r.value
                        }, toDisplayString(r.label), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(form).role]
                    ]),
                    unref(form).errors.role ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-600 text-sm mt-1"
                    }, toDisplayString(unref(form).errors.role), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Password"),
                    createVNode("div", { class: "relative" }, [
                      withDirectives(createVNode("input", {
                        type: showPassword.value ? "text" : "password",
                        "onUpdate:modelValue": ($event) => unref(form).password = $event,
                        class: "w-full pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition"
                      }, null, 8, ["type", "onUpdate:modelValue"]), [
                        [vModelDynamic, unref(form).password]
                      ]),
                      createVNode("button", {
                        type: "button",
                        onClick: ($event) => showPassword.value = !showPassword.value,
                        class: "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
                      }, [
                        !showPassword.value ? (openBlock(), createBlock(unref(EyeIcon), {
                          key: 0,
                          class: "w-5 h-5"
                        })) : (openBlock(), createBlock(unref(EyeSlashIcon), {
                          key: 1,
                          class: "w-5 h-5"
                        }))
                      ], 8, ["onClick"])
                    ]),
                    unref(form).errors.password ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-red-600 text-sm mt-1"
                    }, toDisplayString(unref(form).errors.password), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Konfirmasi Password"),
                    withDirectives(createVNode("input", {
                      type: showPassword.value ? "text" : "password",
                      "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition"
                    }, null, 8, ["type", "onUpdate:modelValue"]), [
                      [vModelDynamic, unref(form).password_confirmation]
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-col sm:flex-row justify-end gap-3 pt-4" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("owner.users.index"),
                      class: "px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-center"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Batal ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                    }, toDisplayString(unref(form).processing ? "Menyimpan..." : "Simpan"), 9, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Owner/Users/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e5fe125e"]]);
export {
  Create as default
};
