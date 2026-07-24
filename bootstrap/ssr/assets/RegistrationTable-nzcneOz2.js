import { ref, resolveComponent, useSSRContext } from "vue";
import { ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderComponent } from "vue/server-renderer";
import "@inertiajs/vue3";
const _sfc_main = {
  __name: "RegistrationTable",
  __ssrInlineRender: true,
  props: {
    registrations: Object,
    statusOptions: Array
  },
  emits: ["delete"],
  setup(__props, { emit: __emit }) {
    const updating = ref(null);
    const STATUS_STYLE = {
      pending: "bg-amber-100  text-amber-800  dark:bg-amber-900/40  dark:text-amber-300",
      contacted: "bg-blue-100   text-blue-800   dark:bg-blue-900/40   dark:text-blue-300",
      enrolled: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      rejected: "bg-red-100    text-red-800    dark:bg-red-900/40    dark:text-red-300"
    };
    const PROGRAM_STYLE = {
      MPLB: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
      BR: "bg-sky-100    text-sky-800    dark:bg-sky-900/40    dark:text-sky-300"
    };
    const STATUS_NEXT = {
      pending: ["contacted", "rejected"],
      contacted: ["enrolled", "rejected"],
      enrolled: [],
      rejected: ["pending"]
    };
    const STATUS_LABEL = {
      contacted: "Proses",
      enrolled: "Terima",
      rejected: "Tolak",
      pending: "Reset"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<!--[--><div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700"><table class="w-full text-sm"><thead><tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"><th class="px-4 py-3">Nama Pendaftar</th><th class="px-4 py-3">No. WhatsApp</th><th class="px-4 py-3">Program Kejuruan</th><th class="px-4 py-3">Status Pendaftaran</th><th class="px-4 py-3">Waktu Pendaftaran</th><th class="px-4 py-3 text-center">Tindakan</th><th class="px-4 py-3 text-center"></th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">`);
      if (!__props.registrations.data.length) {
        _push(`<tr><td colspan="7" class="py-16 text-center text-gray-400 dark:text-gray-500"><i class="ti ti-inbox text-4xl block mb-2" aria-hidden="true"></i> Tidak ada data pendaftaran ditemukan. </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(__props.registrations.data, (reg) => {
        _push(`<tr class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"><td class="px-4 py-3 max-w-[180px]"><p class="font-medium text-gray-800 dark:text-gray-100 truncate">${ssrInterpolate(reg.name)}</p>`);
        if (reg.message) {
          _push(`<p class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5"${ssrRenderAttr("title", reg.message)}>${ssrInterpolate(reg.message)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap"><a${ssrRenderAttr("href", `https://wa.me/${reg.phone.replace(/\D/g, "")}`)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><i class="ti ti-brand-whatsapp text-base" aria-hidden="true"></i> ${ssrInterpolate(reg.phone)}</a></td><td class="px-4 py-3"><span class="${ssrRenderClass([
          "inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
          PROGRAM_STYLE[reg.program_short] ?? "bg-gray-100 text-gray-600"
        ])}">${ssrInterpolate(reg.program_short)}</span></td><td class="px-4 py-3"><div class="flex items-center gap-2"><span class="${ssrRenderClass([
          "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
          STATUS_STYLE[reg.status]
        ])}">${ssrInterpolate(reg.status_label)}</span>`);
        if (updating.value === reg.id) {
          _push(`<i class="ti ti-loader-2 animate-spin text-gray-400" aria-hidden="true"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></td><td class="px-4 py-3 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap"><time${ssrRenderAttr("datetime", reg.created_at)}${ssrRenderAttr("title", reg.created_at)}>${ssrInterpolate(reg.created_at_human)}</time></td><td class="px-4 py-3"><div class="flex items-center justify-center gap-1.5"><!--[-->`);
        ssrRenderList(STATUS_NEXT[reg.status], (next) => {
          _push(`<button${ssrRenderAttr("title", `Tandai: ${next}`)}${ssrIncludeBooleanAttr(updating.value === reg.id) ? " disabled" : ""} class="${ssrRenderClass([{
            "bg-blue-50    text-blue-700    hover:bg-blue-100    dark:bg-blue-900/30    dark:text-blue-300": next === "contacted",
            "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300": next === "enrolled",
            "bg-red-50     text-red-700     hover:bg-red-100     dark:bg-red-900/30     dark:text-red-300": next === "rejected",
            "bg-gray-100   text-gray-600   hover:bg-gray-200    dark:bg-gray-800       dark:text-gray-300": next === "pending"
          }, "rounded-lg px-2 py-1 text-xs font-medium transition-colors disabled:opacity-40"])}">${ssrInterpolate(STATUS_LABEL[next])}</button>`);
        });
        _push(`<!--]--></div></td><td class="px-4 py-3"><div class="flex items-center justify-center gap-1.5"><button${ssrIncludeBooleanAttr(updating.value === reg.id) ? " disabled" : ""} class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-40" title="Hapus pendaftaran ini" aria-label="Hapus pendaftaran"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg></button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      if (__props.registrations.meta?.last_page > 1) {
        _push(`<div class="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400"><p> Menampilkan <strong class="text-gray-700 dark:text-gray-200">${ssrInterpolate(__props.registrations.meta.from)}–${ssrInterpolate(__props.registrations.meta.to)}</strong> dari <strong class="text-gray-700 dark:text-gray-200">${ssrInterpolate(__props.registrations.meta.total)}</strong> data </p><div class="flex gap-1"><!--[-->`);
        ssrRenderList(__props.registrations.meta.links, (link) => {
          _push(ssrRenderComponent(_component_Link, {
            key: link.label,
            href: link.url ?? "#",
            "preserve-scroll": "",
            class: [
              "inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs transition-colors",
              link.active ? "bg-indigo-600 text-white font-semibold" : link.url ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" : "opacity-40 cursor-not-allowed"
            ]
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Registrations/Partials/RegistrationTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
