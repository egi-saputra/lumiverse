import { ref, computed, unref, withCtx, createTextVNode, toDisplayString, createVNode, withModifiers, openBlock, createBlock, createCommentVNode, withDirectives, vModelText, Fragment, renderList, vModelSelect, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./DevLayout-DPhNoVcK.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    tenant: Object,
    plans: Array
  },
  setup(__props) {
    const props = __props;
    const logoPreview = ref(props.tenant.logo_path);
    function daysFromNow(dateStr) {
      if (!dateStr) return 0;
      const diff = Math.ceil((new Date(dateStr) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    }
    const form = useForm({
      name: props.tenant.name ?? "",
      contact_phone: props.tenant.contact_phone ?? "",
      institution_email: props.tenant.institution_email ?? "",
      institution_website: props.tenant.institution_website ?? "",
      address: props.tenant.address ?? "",
      plan_id: props.tenant.plan_id ?? "",
      max_users: props.tenant.max_users ?? "",
      // ← override manual, kosong = ikuti plan
      expires_days: daysFromNow(props.tenant.expires_at),
      // ← ganti expires_at ke ini
      is_active: props.tenant.is_active,
      logo: null,
      _method: "PUT"
    });
    const expiresPreview = computed(() => {
      if (!form.expires_days || form.expires_days === 0) return "Tidak terbatas (unlimited)";
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() + Number(form.expires_days));
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    });
    const maxUsersPreview = computed(() => {
      if (form.max_users !== "" && form.max_users !== null && form.max_users !== void 0) {
        return `${form.max_users} pengguna (override manual)`;
      }
      if (props.tenant.plan_max_users) {
        return `Mengikuti plan: ${props.tenant.plan_max_users} pengguna`;
      }
      return "Mengikuti plan: tidak terbatas";
    });
    function onLogoChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      form.logo = file;
      logoPreview.value = URL.createObjectURL(file);
    }
    function submit() {
      form.post(route("developer.tenants.update", props.tenant.id), {
        forceFormData: true,
        preserveScroll: true
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `Edit — ${__props.tenant.name}`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto px-6 py-8"${_scopeId}><div class="flex items-center gap-2 text-xs text-[var(--muted)] mb-6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("developer.tenants.index"),
              class: "hover:text-white transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Tenant`);
                } else {
                  return [
                    createTextVNode("Tenant")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span${_scopeId}>/</span>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("developer.tenants.show", __props.tenant.id),
              class: "hover:text-white transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.tenant.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.tenant.name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span${_scopeId}>/</span><span class="text-white"${_scopeId}>Edit</span></div><h1 class="text-xl font-extrabold mb-6"${_scopeId}>Edit Tenant</h1><form class="space-y-5"${_scopeId}><div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5"${_scopeId}><label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block mb-3"${_scopeId}>Logo Lembaga</label><div class="flex items-center gap-4"${_scopeId}>`);
            if (logoPreview.value) {
              _push2(`<img${ssrRenderAttr("src", logoPreview.value)} class="w-16 h-16 rounded-xl object-cover border border-[var(--border)]"${_scopeId}>`);
            } else {
              _push2(`<div class="w-16 h-16 rounded-xl border border-dashed border-[var(--border)] bg-white/3 flex items-center justify-center text-[var(--muted)] text-xs"${_scopeId}> No logo </div>`);
            }
            _push2(`<div${_scopeId}><input type="file" id="logo" accept="image/*" class="hidden"${_scopeId}><label for="logo" class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white cursor-pointer transition"${_scopeId}> Ganti Logo </label><p class="text-xs text-[var(--muted)] mt-1.5"${_scopeId}>JPG/PNG/WebP, maks 15MB</p></div></div>`);
            if (unref(form).errors.logo) {
              _push2(`<p class="text-xs text-rose-400 mt-2"${_scopeId}>${ssrInterpolate(unref(form).errors.logo)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><div class="sm:col-span-2 flex flex-col gap-1.5"${_scopeId}><label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]"${_scopeId}>Nama Lembaga <span class="text-rose-400"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(form).name)} class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<p class="text-xs text-rose-400"${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-1.5"${_scopeId}><label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]"${_scopeId}>Telepon</label><input${ssrRenderAttr("value", unref(form).contact_phone)} class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"${_scopeId}>`);
            if (unref(form).errors.contact_phone) {
              _push2(`<p class="text-xs text-rose-400"${_scopeId}>${ssrInterpolate(unref(form).errors.contact_phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-1.5"${_scopeId}><label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]"${_scopeId}>Email Lembaga</label><input${ssrRenderAttr("value", unref(form).institution_email)} type="email" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"${_scopeId}>`);
            if (unref(form).errors.institution_email) {
              _push2(`<p class="text-xs text-rose-400"${_scopeId}>${ssrInterpolate(unref(form).errors.institution_email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-1.5 sm:col-span-2"${_scopeId}><label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]"${_scopeId}>Website</label><input${ssrRenderAttr("value", unref(form).institution_website)} class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" placeholder="https://..."${_scopeId}>`);
            if (unref(form).errors.institution_website) {
              _push2(`<p class="text-xs text-rose-400"${_scopeId}>${ssrInterpolate(unref(form).errors.institution_website)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-1.5 sm:col-span-2"${_scopeId}><label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]"${_scopeId}>Alamat</label><textarea rows="3" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] resize-y transition"${_scopeId}>${ssrInterpolate(unref(form).address)}</textarea>`);
            if (unref(form).errors.address) {
              _push2(`<p class="text-xs text-rose-400"${_scopeId}>${ssrInterpolate(unref(form).errors.address)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><div class="sm:col-span-2"${_scopeId}><p class="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3"${_scopeId}>Subscription</p></div><div class="flex flex-col gap-1.5"${_scopeId}><label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]"${_scopeId}>Plan</label><select class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).plan_id) ? ssrLooseContain(unref(form).plan_id, "") : ssrLooseEqual(unref(form).plan_id, "")) ? " selected" : ""}${_scopeId}>— Tanpa Plan —</option><!--[-->`);
            ssrRenderList(__props.plans, (plan) => {
              _push2(`<option${ssrRenderAttr("value", plan.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).plan_id) ? ssrLooseContain(unref(form).plan_id, plan.id) : ssrLooseEqual(unref(form).plan_id, plan.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(plan.name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (unref(form).errors.plan_id) {
              _push2(`<p class="text-xs text-rose-400"${_scopeId}>${ssrInterpolate(unref(form).errors.plan_id)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-1.5"${_scopeId}><label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]"${_scopeId}> Durasi Akses (hari) </label><div class="relative"${_scopeId}><input${ssrRenderAttr("value", unref(form).expires_days)} type="number" min="0" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition pr-14"${_scopeId}><span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]"${_scopeId}>hari</span></div><p class="${ssrRenderClass([unref(form).expires_days === 0 ? "text-amber-400" : "text-[var(--cyan)]", "text-xs"])}"${_scopeId}> → ${ssrInterpolate(expiresPreview.value)}</p><p class="text-xs text-[var(--muted)]"${_scopeId}>0 = tidak terbatas (unlimited)</p>`);
            if (unref(form).errors.expires_days) {
              _push2(`<p class="text-xs text-rose-400"${_scopeId}>${ssrInterpolate(unref(form).errors.expires_days)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-1.5"${_scopeId}><label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]"${_scopeId}> Maksimal Pengguna (override) </label><div class="relative"${_scopeId}><input${ssrRenderAttr("value", unref(form).max_users)} type="number" min="1" placeholder="Kosongkan untuk ikuti plan" class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition pr-16"${_scopeId}><span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]"${_scopeId}>akun</span></div><p class="${ssrRenderClass([unref(form).max_users ? "text-[var(--cyan)]" : "text-[var(--muted)]", "text-xs"])}"${_scopeId}> → ${ssrInterpolate(maxUsersPreview.value)}</p><p class="text-xs text-[var(--muted)]"${_scopeId}>Kosongkan untuk memakai kuota bawaan plan yang dipilih. </p>`);
            if (unref(form).errors.max_users) {
              _push2(`<p class="text-xs text-rose-400"${_scopeId}>${ssrInterpolate(unref(form).errors.max_users)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="sm:col-span-2"${_scopeId}><label class="flex items-center gap-2 text-sm cursor-pointer"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} class="w-4 h-4 cursor-pointer accent-[var(--cyan)]"${_scopeId}><span${_scopeId}>Tenant aktif</span></label></div></div><div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("developer.tenants.show", __props.tenant.id),
              class: "px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition"
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
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"${_scopeId}>${ssrInterpolate(unref(form).processing ? "Menyimpan..." : "Simpan Perubahan")}</button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto px-6 py-8" }, [
                createVNode("div", { class: "flex items-center gap-2 text-xs text-[var(--muted)] mb-6" }, [
                  createVNode(unref(Link), {
                    href: _ctx.route("developer.tenants.index"),
                    class: "hover:text-white transition"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Tenant")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode("span", null, "/"),
                  createVNode(unref(Link), {
                    href: _ctx.route("developer.tenants.show", __props.tenant.id),
                    class: "hover:text-white transition"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.tenant.name), 1)
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode("span", null, "/"),
                  createVNode("span", { class: "text-white" }, "Edit")
                ]),
                createVNode("h1", { class: "text-xl font-extrabold mb-6" }, "Edit Tenant"),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "space-y-5"
                }, [
                  createVNode("div", { class: "rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5" }, [
                    createVNode("label", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)] block mb-3" }, "Logo Lembaga"),
                    createVNode("div", { class: "flex items-center gap-4" }, [
                      logoPreview.value ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: logoPreview.value,
                        class: "w-16 h-16 rounded-xl object-cover border border-[var(--border)]"
                      }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "w-16 h-16 rounded-xl border border-dashed border-[var(--border)] bg-white/3 flex items-center justify-center text-[var(--muted)] text-xs"
                      }, " No logo ")),
                      createVNode("div", null, [
                        createVNode("input", {
                          type: "file",
                          id: "logo",
                          accept: "image/*",
                          class: "hidden",
                          onChange: onLogoChange
                        }, null, 32),
                        createVNode("label", {
                          for: "logo",
                          class: "px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white cursor-pointer transition"
                        }, " Ganti Logo "),
                        createVNode("p", { class: "text-xs text-[var(--muted)] mt-1.5" }, "JPG/PNG/WebP, maks 15MB")
                      ])
                    ]),
                    unref(form).errors.logo ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-xs text-rose-400 mt-2"
                    }, toDisplayString(unref(form).errors.logo), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                    createVNode("div", { class: "sm:col-span-2 flex flex-col gap-1.5" }, [
                      createVNode("label", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)]" }, [
                        createTextVNode("Nama Lembaga "),
                        createVNode("span", { class: "text-rose-400" }, "*")
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        class: "w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).name]
                      ]),
                      unref(form).errors.name ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-rose-400"
                      }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col gap-1.5" }, [
                      createVNode("label", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)]" }, "Telepon"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).contact_phone = $event,
                        class: "w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).contact_phone]
                      ]),
                      unref(form).errors.contact_phone ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-rose-400"
                      }, toDisplayString(unref(form).errors.contact_phone), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col gap-1.5" }, [
                      createVNode("label", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)]" }, "Email Lembaga"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).institution_email = $event,
                        type: "email",
                        class: "w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).institution_email]
                      ]),
                      unref(form).errors.institution_email ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-rose-400"
                      }, toDisplayString(unref(form).errors.institution_email), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col gap-1.5 sm:col-span-2" }, [
                      createVNode("label", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)]" }, "Website"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).institution_website = $event,
                        class: "w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition",
                        placeholder: "https://..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).institution_website]
                      ]),
                      unref(form).errors.institution_website ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-rose-400"
                      }, toDisplayString(unref(form).errors.institution_website), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col gap-1.5 sm:col-span-2" }, [
                      createVNode("label", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)]" }, "Alamat"),
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => unref(form).address = $event,
                        rows: "3",
                        class: "w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] resize-y transition"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).address]
                      ]),
                      unref(form).errors.address ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-rose-400"
                      }, toDisplayString(unref(form).errors.address), 1)) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                    createVNode("div", { class: "sm:col-span-2" }, [
                      createVNode("p", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3" }, "Subscription")
                    ]),
                    createVNode("div", { class: "flex flex-col gap-1.5" }, [
                      createVNode("label", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)]" }, "Plan"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).plan_id = $event,
                        class: "w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                      }, [
                        createVNode("option", { value: "" }, "— Tanpa Plan —"),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.plans, (plan) => {
                          return openBlock(), createBlock("option", {
                            key: plan.id,
                            value: plan.id
                          }, toDisplayString(plan.name), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).plan_id]
                      ]),
                      unref(form).errors.plan_id ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-rose-400"
                      }, toDisplayString(unref(form).errors.plan_id), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col gap-1.5" }, [
                      createVNode("label", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)]" }, " Durasi Akses (hari) "),
                      createVNode("div", { class: "relative" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).expires_days = $event,
                          type: "number",
                          min: "0",
                          class: "w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition pr-14"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [
                            vModelText,
                            unref(form).expires_days,
                            void 0,
                            { number: true }
                          ]
                        ]),
                        createVNode("span", { class: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]" }, "hari")
                      ]),
                      createVNode("p", {
                        class: ["text-xs", unref(form).expires_days === 0 ? "text-amber-400" : "text-[var(--cyan)]"]
                      }, " → " + toDisplayString(expiresPreview.value), 3),
                      createVNode("p", { class: "text-xs text-[var(--muted)]" }, "0 = tidak terbatas (unlimited)"),
                      unref(form).errors.expires_days ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-rose-400"
                      }, toDisplayString(unref(form).errors.expires_days), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col gap-1.5" }, [
                      createVNode("label", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)]" }, " Maksimal Pengguna (override) "),
                      createVNode("div", { class: "relative" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).max_users = $event,
                          type: "number",
                          min: "1",
                          placeholder: "Kosongkan untuk ikuti plan",
                          class: "w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition pr-16"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [
                            vModelText,
                            unref(form).max_users,
                            void 0,
                            { number: true }
                          ]
                        ]),
                        createVNode("span", { class: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]" }, "akun")
                      ]),
                      createVNode("p", {
                        class: ["text-xs", unref(form).max_users ? "text-[var(--cyan)]" : "text-[var(--muted)]"]
                      }, " → " + toDisplayString(maxUsersPreview.value), 3),
                      createVNode("p", { class: "text-xs text-[var(--muted)]" }, "Kosongkan untuk memakai kuota bawaan plan yang dipilih. "),
                      unref(form).errors.max_users ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-rose-400"
                      }, toDisplayString(unref(form).errors.max_users), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "sm:col-span-2" }, [
                      createVNode("label", { class: "flex items-center gap-2 text-sm cursor-pointer" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => unref(form).is_active = $event,
                          class: "w-4 h-4 cursor-pointer accent-[var(--cyan)]"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).is_active]
                        ]),
                        createVNode("span", null, "Tenant aktif")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex justify-end gap-2" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("developer.tenants.show", __props.tenant.id),
                      class: "px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Batal ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "px-4 py-2 text-sm font-bold rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    }, toDisplayString(unref(form).processing ? "Menyimpan..." : "Simpan Perubahan"), 9, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Developer/Tenants/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
