import { unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./DevLayout-DPhNoVcK.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    tenants: Array,
    totalTenants: Number
  },
  setup(__props) {
    function quotaLabel(t) {
      return t.max_users === null ? `${t.user_count} / ∞` : `${t.user_count} / ${t.max_users}`;
    }
    function daysLeftLabel(t) {
      if (t.days_left === null) return "—";
      if (t.days_left < 0) return "Expired";
      return `${t.days_left} hari`;
    }
    function statusClass(t) {
      if (t.status === "Aktif") return "bg-emerald-400/10 text-emerald-400";
      if (t.status === "Expired") return "bg-amber-400/10 text-amber-400";
      return "bg-rose-400/10 text-rose-400";
    }
    function deleteTenant(tenant) {
      if (!confirm(`Hapus "${tenant.name}"? Database tenant akan ikut terhapus permanen.`)) return;
      useForm({}).delete(route("developer.tenants.delete", tenant.id));
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Manajemen Tenant" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-7xl mx-auto px-6 py-8"${_scopeId}><div class="flex items-start justify-between gap-4 mb-6"${_scopeId}><div${_scopeId}><h1 class="text-xl font-extrabold mb-1"${_scopeId}>Manajemen Tenant</h1><p class="text-sm text-[var(--muted)]"${_scopeId}>Semua sekolah / lembaga yang terdaftar di platform.</p></div><div class="text-right"${_scopeId}><div class="text-2xl font-extrabold text-[var(--cyan)]"${_scopeId}>${ssrInterpolate(__props.totalTenants)}</div><div class="text-xs text-[var(--muted)]"${_scopeId}>Total Tenant</div></div></div>`);
            if (_ctx.$page.props.flash?.success) {
              _push2(`<div class="px-4 py-3 rounded-lg text-sm mb-4 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400"${_scopeId}>${ssrInterpolate(_ctx.$page.props.flash.success)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] overflow-x-auto"${_scopeId}>`);
            if (__props.tenants.length) {
              _push2(`<table class="w-full border-collapse text-sm min-w-[860px]"${_scopeId}><thead${_scopeId}><tr class="border-b border-[var(--border)]"${_scopeId}><th class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold whitespace-nowrap"${_scopeId}> Nama Lembaga</th><th class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold"${_scopeId}> Subdomain</th><th class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold"${_scopeId}> Plan</th><th class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold"${_scopeId}> Kuota</th><th class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold"${_scopeId}> Sisa Waktu</th><th class="text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold"${_scopeId}> Status</th><th class="px-5 py-3 w-[160px]"${_scopeId}></th></tr></thead><tbody${_scopeId}><!--[-->`);
              ssrRenderList(__props.tenants, (tenant) => {
                _push2(`<tr class="border-t border-[var(--border)] hover:bg-white/[0.02] transition"${_scopeId}><td class="px-5 py-3.5 font-semibold whitespace-nowrap"${_scopeId}>${ssrInterpolate(tenant.name)}</td><td class="px-5 py-3.5"${_scopeId}><!--[-->`);
                ssrRenderList(tenant.domains, (domain) => {
                  _push2(`<span class="inline-block font-mono text-xs bg-[var(--cyan)]/8 text-[var(--cyan)] px-2 py-0.5 rounded mr-1"${_scopeId}>${ssrInterpolate(domain)}</span>`);
                });
                _push2(`<!--]--></td><td class="px-5 py-3.5 capitalize"${_scopeId}>${ssrInterpolate(tenant.plan)}</td><td class="px-5 py-3.5 tabular-nums"${_scopeId}>${ssrInterpolate(quotaLabel(tenant))}</td><td class="px-5 py-3.5"${_scopeId}>${ssrInterpolate(daysLeftLabel(tenant))}</td><td class="px-5 py-3.5"${_scopeId}><span class="${ssrRenderClass([statusClass(tenant), "text-xs font-bold px-2.5 py-1 rounded-full"])}"${_scopeId}>${ssrInterpolate(tenant.status)}</span></td><td class="px-5 py-3.5"${_scopeId}><div class="flex items-center gap-1.5 justify-end"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("developer.tenants.show", tenant.id),
                  class: "px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Detail `);
                    } else {
                      return [
                        createTextVNode(" Detail ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("developer.tenants.edit", tenant.id),
                  class: "px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition"
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
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<button class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-rose-400/30 text-rose-400 hover:bg-rose-400/10 transition"${_scopeId}> Hapus </button></div></td></tr>`);
              });
              _push2(`<!--]--></tbody></table>`);
            } else {
              _push2(`<div class="py-16 text-center text-sm text-[var(--muted)]"${_scopeId}> Belum ada tenant yang terdaftar. </div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-7xl mx-auto px-6 py-8" }, [
                createVNode("div", { class: "flex items-start justify-between gap-4 mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-xl font-extrabold mb-1" }, "Manajemen Tenant"),
                    createVNode("p", { class: "text-sm text-[var(--muted)]" }, "Semua sekolah / lembaga yang terdaftar di platform.")
                  ]),
                  createVNode("div", { class: "text-right" }, [
                    createVNode("div", { class: "text-2xl font-extrabold text-[var(--cyan)]" }, toDisplayString(__props.totalTenants), 1),
                    createVNode("div", { class: "text-xs text-[var(--muted)]" }, "Total Tenant")
                  ])
                ]),
                _ctx.$page.props.flash?.success ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "px-4 py-3 rounded-lg text-sm mb-4 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400"
                }, toDisplayString(_ctx.$page.props.flash.success), 1)) : createCommentVNode("", true),
                createVNode("div", { class: "rounded-2xl border border-[var(--border)] bg-[var(--navy)] overflow-x-auto" }, [
                  __props.tenants.length ? (openBlock(), createBlock("table", {
                    key: 0,
                    class: "w-full border-collapse text-sm min-w-[860px]"
                  }, [
                    createVNode("thead", null, [
                      createVNode("tr", { class: "border-b border-[var(--border)]" }, [
                        createVNode("th", { class: "text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold whitespace-nowrap" }, " Nama Lembaga"),
                        createVNode("th", { class: "text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold" }, " Subdomain"),
                        createVNode("th", { class: "text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold" }, " Plan"),
                        createVNode("th", { class: "text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold" }, " Kuota"),
                        createVNode("th", { class: "text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold" }, " Sisa Waktu"),
                        createVNode("th", { class: "text-left text-xs uppercase tracking-wider text-[var(--muted)] px-5 py-3 font-bold" }, " Status"),
                        createVNode("th", { class: "px-5 py-3 w-[160px]" })
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.tenants, (tenant) => {
                        return openBlock(), createBlock("tr", {
                          key: tenant.id,
                          class: "border-t border-[var(--border)] hover:bg-white/[0.02] transition"
                        }, [
                          createVNode("td", { class: "px-5 py-3.5 font-semibold whitespace-nowrap" }, toDisplayString(tenant.name), 1),
                          createVNode("td", { class: "px-5 py-3.5" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(tenant.domains, (domain) => {
                              return openBlock(), createBlock("span", {
                                key: domain,
                                class: "inline-block font-mono text-xs bg-[var(--cyan)]/8 text-[var(--cyan)] px-2 py-0.5 rounded mr-1"
                              }, toDisplayString(domain), 1);
                            }), 128))
                          ]),
                          createVNode("td", { class: "px-5 py-3.5 capitalize" }, toDisplayString(tenant.plan), 1),
                          createVNode("td", { class: "px-5 py-3.5 tabular-nums" }, toDisplayString(quotaLabel(tenant)), 1),
                          createVNode("td", { class: "px-5 py-3.5" }, toDisplayString(daysLeftLabel(tenant)), 1),
                          createVNode("td", { class: "px-5 py-3.5" }, [
                            createVNode("span", {
                              class: ["text-xs font-bold px-2.5 py-1 rounded-full", statusClass(tenant)]
                            }, toDisplayString(tenant.status), 3)
                          ]),
                          createVNode("td", { class: "px-5 py-3.5" }, [
                            createVNode("div", { class: "flex items-center gap-1.5 justify-end" }, [
                              createVNode(unref(Link), {
                                href: _ctx.route("developer.tenants.show", tenant.id),
                                class: "px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Detail ")
                                ]),
                                _: 1
                              }, 8, ["href"]),
                              createVNode(unref(Link), {
                                href: _ctx.route("developer.tenants.edit", tenant.id),
                                class: "px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Edit ")
                                ]),
                                _: 1
                              }, 8, ["href"]),
                              createVNode("button", {
                                onClick: ($event) => deleteTenant(tenant),
                                class: "px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-rose-400/30 text-rose-400 hover:bg-rose-400/10 transition"
                              }, " Hapus ", 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128))
                    ])
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "py-16 text-center text-sm text-[var(--muted)]"
                  }, " Belum ada tenant yang terdaftar. "))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Developer/Tenants/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
