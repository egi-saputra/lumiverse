import { unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./DevLayout-DPhNoVcK.js";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: { tenant: Object },
  setup(__props) {
    const props = __props;
    function deleteTenant() {
      if (!confirm(`Hapus "${props.tenant.name}"? Database tenant akan ikut terhapus permanen.`)) return;
      useForm({}).delete(route("developer.tenants.delete", props.tenant.id));
    }
    function toggleTenant() {
      useForm({}).post(route("developer.tenants.toggle", props.tenant.id));
    }
    const statusClass = props.tenant.status === "Aktif" ? "bg-emerald-400/10 text-emerald-400" : props.tenant.status === "Expired" ? "bg-amber-400/10 text-amber-400" : "bg-rose-400/10 text-rose-400";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: __props.tenant.name
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
            _push2(`<span${_scopeId}>/</span><span class="text-white"${_scopeId}>${ssrInterpolate(__props.tenant.name)}</span></div><div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-6 mb-4"${_scopeId}><div class="flex items-start gap-4"${_scopeId}>`);
            if (__props.tenant.logo_path) {
              _push2(`<img${ssrRenderAttr("src", __props.tenant.logo_path)}${ssrRenderAttr("alt", __props.tenant.name)} class="w-16 h-16 rounded-xl object-cover border border-[var(--border)]"${_scopeId}>`);
            } else {
              _push2(`<div class="w-16 h-16 rounded-xl border border-[var(--border)] bg-white/5 flex items-center justify-center text-2xl font-black text-[var(--muted)]"${_scopeId}>${ssrInterpolate(__props.tenant.name?.charAt(0))}</div>`);
            }
            _push2(`<div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-2 flex-wrap"${_scopeId}><h1 class="text-xl font-extrabold truncate"${_scopeId}>${ssrInterpolate(__props.tenant.name)}</h1><span class="${ssrRenderClass([unref(statusClass), "text-xs font-bold px-2.5 py-1 rounded-full"])}"${_scopeId}>${ssrInterpolate(__props.tenant.status)}</span></div><div class="flex flex-wrap gap-1.5 mt-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.tenant.domains, (d) => {
              _push2(`<span class="font-mono text-xs bg-[var(--cyan)]/8 text-[var(--cyan)] px-2 py-0.5 rounded"${_scopeId}>${ssrInterpolate(d)}</span>`);
            });
            _push2(`<!--]--></div><p class="text-xs text-[var(--muted)] mt-1.5"${_scopeId}>Terdaftar ${ssrInterpolate(__props.tenant.created_at)}</p></div><div class="flex gap-2 flex-shrink-0"${_scopeId}><button class="${ssrRenderClass([__props.tenant.is_active ? "border-rose-400/30 text-rose-400 hover:bg-rose-400/10" : "border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10", "px-3 py-1.5 text-xs font-bold rounded-lg border transition"])}"${_scopeId}>${ssrInterpolate(__props.tenant.is_active ? "Nonaktifkan" : "Aktifkan")}</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("developer.tenants.edit", __props.tenant.id),
              class: "px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Edit `);
                } else {
                  return [
                    createTextVNode(" Edit ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"${_scopeId}><div class="rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4"${_scopeId}><div class="text-xs text-[var(--muted)] mb-1"${_scopeId}>Plan</div><div class="font-bold capitalize"${_scopeId}>${ssrInterpolate(__props.tenant.plan)}</div></div><div class="rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4"${_scopeId}><div class="text-xs text-[var(--muted)] mb-1"${_scopeId}>Kuota User</div><div class="font-bold tabular-nums"${_scopeId}>${ssrInterpolate(__props.tenant.user_count)} / ${ssrInterpolate(__props.tenant.max_users ?? "∞")}</div></div><div class="rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4"${_scopeId}><div class="text-xs text-[var(--muted)] mb-1"${_scopeId}>Sisa Waktu</div><div class="font-bold"${_scopeId}>${ssrInterpolate(__props.tenant.days_left === null ? "—" : __props.tenant.days_left < 0 ? "Expired" : __props.tenant.days_left + " hari")}</div></div><div class="rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4"${_scopeId}><div class="text-xs text-[var(--muted)] mb-1"${_scopeId}>Kedaluwarsa</div><div class="font-bold"${_scopeId}>${ssrInterpolate(__props.tenant.expires_at ?? "—")}</div></div></div><div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] divide-y divide-[var(--border)]"${_scopeId}><div class="px-6 py-4"${_scopeId}><h2 class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]"${_scopeId}>Informasi Lembaga </h2></div><!--[-->`);
            ssrRenderList([
              { label: "Jenis Lembaga", value: __props.tenant.institution_type },
              { label: "Jenjang", value: __props.tenant.school_level?.toUpperCase() ?? "—" },
              { label: "NPSN", value: __props.tenant.npsn ?? "—" },
              { label: "NSS", value: __props.tenant.nss ?? "—" },
              { label: "No. Izin / Legalitas", value: __props.tenant.registration_number ?? "—" },
              { label: "Telepon", value: __props.tenant.contact_phone ?? "—" },
              { label: "Email Lembaga", value: __props.tenant.institution_email ?? "—" },
              { label: "Website", value: __props.tenant.institution_website ?? "—" },
              { label: "Alamat", value: __props.tenant.address ?? "—" }
            ], (row, i) => {
              _push2(`<div class="px-6 py-3.5 flex gap-4"${_scopeId}><div class="w-44 flex-shrink-0 text-xs text-[var(--muted)] pt-0.5"${_scopeId}>${ssrInterpolate(row.label)}</div><div class="text-sm"${_scopeId}>${ssrInterpolate(row.value)}</div></div>`);
            });
            _push2(`<!--]--></div><div class="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5"${_scopeId}><h2 class="text-sm font-bold text-rose-400 mb-1"${_scopeId}>Zona Berbahaya</h2><p class="text-xs text-[var(--muted)] mb-3"${_scopeId}>Menghapus tenant akan menghapus seluruh database dan data lembaga secara permanen.</p><button class="px-4 py-2 text-xs font-bold rounded-lg bg-rose-400 text-[#0a0f1e] hover:opacity-90 transition"${_scopeId}> Hapus Tenant Ini </button></div></div>`);
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
                  createVNode("span", { class: "text-white" }, toDisplayString(__props.tenant.name), 1)
                ]),
                createVNode("div", { class: "rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-6 mb-4" }, [
                  createVNode("div", { class: "flex items-start gap-4" }, [
                    __props.tenant.logo_path ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: __props.tenant.logo_path,
                      alt: __props.tenant.name,
                      class: "w-16 h-16 rounded-xl object-cover border border-[var(--border)]"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "w-16 h-16 rounded-xl border border-[var(--border)] bg-white/5 flex items-center justify-center text-2xl font-black text-[var(--muted)]"
                    }, toDisplayString(__props.tenant.name?.charAt(0)), 1)),
                    createVNode("div", { class: "flex-1 min-w-0" }, [
                      createVNode("div", { class: "flex items-center gap-2 flex-wrap" }, [
                        createVNode("h1", { class: "text-xl font-extrabold truncate" }, toDisplayString(__props.tenant.name), 1),
                        createVNode("span", {
                          class: ["text-xs font-bold px-2.5 py-1 rounded-full", unref(statusClass)]
                        }, toDisplayString(__props.tenant.status), 3)
                      ]),
                      createVNode("div", { class: "flex flex-wrap gap-1.5 mt-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.tenant.domains, (d) => {
                          return openBlock(), createBlock("span", {
                            key: d,
                            class: "font-mono text-xs bg-[var(--cyan)]/8 text-[var(--cyan)] px-2 py-0.5 rounded"
                          }, toDisplayString(d), 1);
                        }), 128))
                      ]),
                      createVNode("p", { class: "text-xs text-[var(--muted)] mt-1.5" }, "Terdaftar " + toDisplayString(__props.tenant.created_at), 1)
                    ]),
                    createVNode("div", { class: "flex gap-2 flex-shrink-0" }, [
                      createVNode("button", {
                        onClick: toggleTenant,
                        class: ["px-3 py-1.5 text-xs font-bold rounded-lg border transition", __props.tenant.is_active ? "border-rose-400/30 text-rose-400 hover:bg-rose-400/10" : "border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"]
                      }, toDisplayString(__props.tenant.is_active ? "Nonaktifkan" : "Aktifkan"), 3),
                      createVNode(unref(Link), {
                        href: _ctx.route("developer.tenants.edit", __props.tenant.id),
                        class: "px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 transition"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Edit ")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4" }, [
                  createVNode("div", { class: "rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4" }, [
                    createVNode("div", { class: "text-xs text-[var(--muted)] mb-1" }, "Plan"),
                    createVNode("div", { class: "font-bold capitalize" }, toDisplayString(__props.tenant.plan), 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4" }, [
                    createVNode("div", { class: "text-xs text-[var(--muted)] mb-1" }, "Kuota User"),
                    createVNode("div", { class: "font-bold tabular-nums" }, toDisplayString(__props.tenant.user_count) + " / " + toDisplayString(__props.tenant.max_users ?? "∞"), 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4" }, [
                    createVNode("div", { class: "text-xs text-[var(--muted)] mb-1" }, "Sisa Waktu"),
                    createVNode("div", { class: "font-bold" }, toDisplayString(__props.tenant.days_left === null ? "—" : __props.tenant.days_left < 0 ? "Expired" : __props.tenant.days_left + " hari"), 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-[var(--border)] bg-[var(--navy)] p-4" }, [
                    createVNode("div", { class: "text-xs text-[var(--muted)] mb-1" }, "Kedaluwarsa"),
                    createVNode("div", { class: "font-bold" }, toDisplayString(__props.tenant.expires_at ?? "—"), 1)
                  ])
                ]),
                createVNode("div", { class: "rounded-2xl border border-[var(--border)] bg-[var(--navy)] divide-y divide-[var(--border)]" }, [
                  createVNode("div", { class: "px-6 py-4" }, [
                    createVNode("h2", { class: "text-xs font-bold uppercase tracking-wider text-[var(--muted)]" }, "Informasi Lembaga ")
                  ]),
                  (openBlock(true), createBlock(Fragment, null, renderList([
                    { label: "Jenis Lembaga", value: __props.tenant.institution_type },
                    { label: "Jenjang", value: __props.tenant.school_level?.toUpperCase() ?? "—" },
                    { label: "NPSN", value: __props.tenant.npsn ?? "—" },
                    { label: "NSS", value: __props.tenant.nss ?? "—" },
                    { label: "No. Izin / Legalitas", value: __props.tenant.registration_number ?? "—" },
                    { label: "Telepon", value: __props.tenant.contact_phone ?? "—" },
                    { label: "Email Lembaga", value: __props.tenant.institution_email ?? "—" },
                    { label: "Website", value: __props.tenant.institution_website ?? "—" },
                    { label: "Alamat", value: __props.tenant.address ?? "—" }
                  ], (row, i) => {
                    return openBlock(), createBlock("div", {
                      key: i,
                      class: "px-6 py-3.5 flex gap-4"
                    }, [
                      createVNode("div", { class: "w-44 flex-shrink-0 text-xs text-[var(--muted)] pt-0.5" }, toDisplayString(row.label), 1),
                      createVNode("div", { class: "text-sm" }, toDisplayString(row.value), 1)
                    ]);
                  }), 128))
                ]),
                createVNode("div", { class: "mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5" }, [
                  createVNode("h2", { class: "text-sm font-bold text-rose-400 mb-1" }, "Zona Berbahaya"),
                  createVNode("p", { class: "text-xs text-[var(--muted)] mb-3" }, "Menghapus tenant akan menghapus seluruh database dan data lembaga secara permanen."),
                  createVNode("button", {
                    onClick: deleteTenant,
                    class: "px-4 py-2 text-xs font-bold rounded-lg bg-rose-400 text-[#0a0f1e] hover:opacity-90 transition"
                  }, " Hapus Tenant Ini ")
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Developer/Tenants/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
