import { ref, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, Transition, createCommentVNode, createTextVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./UserLayout-bEWAD7gb.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { UserGroupIcon, DocumentTextIcon, ClipboardDocumentListIcon, NewspaperIcon, MegaphoneIcon, XMarkIcon, UserIcon, AcademicCapIcon } from "@heroicons/vue/24/solid";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const userName = page.props.auth.user.name || "User";
    const userInitials = userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const toast = ref({ show: false, message: "", type: "info" });
    const menuItems = [
      {
        title: "Students",
        desc: "Kelola data siswa",
        icon: UserGroupIcon,
        route: route("proktor.peserta.index"),
        color: "purple"
      },
      {
        title: "Exam Room",
        desc: "Ruang ujian aktif",
        icon: DocumentTextIcon,
        route: route("proktor.ruangUjian.index"),
        color: "blue"
      },
      {
        title: "Quiz List",
        desc: "Daftar soal ujian",
        icon: ClipboardDocumentListIcon,
        route: route("proktor.soal.index"),
        color: "green"
      },
      {
        title: "Assessment",
        desc: "Penilaian siswa",
        icon: NewspaperIcon,
        route: route("proktor.nilai.index"),
        color: "amber"
      },
      {
        title: "Announcement",
        desc: "Kirim token & pengumuman",
        icon: MegaphoneIcon,
        route: route("pesan.index"),
        color: "red",
        wide: true
      }
    ];
    const statCards = [
      { label: "Proktor", key: "proktor", color: "purple", icon: UserIcon },
      { label: "Guru", key: "guru", color: "green", icon: AcademicCapIcon },
      { label: "Siswa", key: "siswa", color: "blue", icon: UserGroupIcon }
    ];
    const notices = [
      { type: "g", text: "Pastikan semua <b>data soal</b> sudah benar sebelum ujian dimulai." },
      { type: "g", text: "Pastikan semua <b>data siswa</b> sudah dicek dan benar sebelum ujian." },
      { type: "g", text: "Siswa yang tidak diperkenankan ujian dapat <b>dinonaktifkan</b> di fitur daftar siswa." },
      { type: "y", text: "Berikan <b>token soal secara bergilir</b> dengan jeda beberapa detik / menit antar ruang." },
      { type: "g", text: "Token dapat dikirim melalui fitur <b>Ruang Informasi</b> berdasarkan kelas masing-masing." },
      { type: "g", text: "Minta pengawas konfirmasi ke siswa bahwa <b>token ujian telah dikirim</b>." },
      { type: "g", text: "Siswa dapat melihat token melalui <b>notifikasi icon bell</b> di pojok kanan atas." },
      { type: "r", text: "<b>Jangan edit data soal saat ujian berlangsung!</b> Dapat menyebabkan cache sistem bermasalah dan data tidak sinkron." },
      { type: "b", text: "Pantau alur ujian pada <b>Ruang Ujian</b>, jangan lupa sambil ngopi biar gak goyang! Semangat!! ☕" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            if (toast.value.show) {
              _push2(`<div class="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center justify-between z-50 md:hidden border border-white/10" data-v-bfff4de9${_scopeId}><span class="truncate text-sm" data-v-bfff4de9${_scopeId}>${ssrInterpolate(toast.value.message)}</span><button class="ml-4 flex-shrink-0 text-white/60 hover:text-white" data-v-bfff4de9${_scopeId}>`);
              _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(``);
            if (toast.value.show) {
              _push2(`<div class="${ssrRenderClass([toast.value.type === "success" ? "bg-emerald-700" : "bg-gray-900", "hidden md:flex fixed top-5 right-5 w-80 px-5 py-3.5 rounded-xl shadow-2xl z-50 items-center gap-3 text-white border border-white/10"])}" data-v-bfff4de9${_scopeId}>`);
              if (toast.value.type === "success") {
                _push2(`<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-bfff4de9${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" data-v-bfff4de9${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="truncate text-sm" data-v-bfff4de9${_scopeId}>${ssrInterpolate(toast.value.message)}</span><button class="ml-auto text-white/60 hover:text-white" data-v-bfff4de9${_scopeId}>`);
              _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center justify-between mb-7 animate-slide-down" data-v-bfff4de9${_scopeId}><div class="flex items-center gap-3" data-v-bfff4de9${_scopeId}><div class="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30" data-v-bfff4de9${_scopeId}> ✨ </div><div data-v-bfff4de9${_scopeId}><p class="text-sm font-semibold leading-none tracking-tight text-gray-900 dark:text-slate-100" data-v-bfff4de9${_scopeId}><span class="sm:inline-flex hidden" data-v-bfff4de9${_scopeId}>Lumiverse System</span><span class="inline-flex sm:hidden" data-v-bfff4de9${_scopeId}>Kreaticraft Smart Learning System</span></p><p class="text-[11px] mt-0.5 text-gray-400 dark:text-slate-500" data-v-bfff4de9${_scopeId}>Proktor Dashboard</p></div></div><div class="flex items-center gap-2.5" data-v-bfff4de9${_scopeId}><span class="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-mono font-medium tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-300" data-v-bfff4de9${_scopeId}> PROKTOR </span><div class="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 sm:flex hidden items-center justify-center text-white text-xs font-semibold border-2 border-indigo-200 dark:border-indigo-500/40 cursor-pointer" data-v-bfff4de9${_scopeId}>${ssrInterpolate(unref(userInitials))} <span class="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0b0f1a]" data-v-bfff4de9${_scopeId}></span></div></div></div><div class="relative overflow-hidden rounded-2xl mb-6 p-6 sm:p-8 animate-fade-up bg-white border border-blue-100 dark:bg-[#111827] dark:border-blue-500/20" style="${ssrRenderStyle({ "animation-delay": ".05s" })}" data-v-bfff4de9${_scopeId}><div class="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none blur-3xl bg-indigo-100 dark:bg-indigo-600/20" data-v-bfff4de9${_scopeId}></div><div class="absolute -bottom-16 left-4 w-48 h-48 rounded-full pointer-events-none blur-3xl bg-blue-50 dark:bg-blue-500/10" data-v-bfff4de9${_scopeId}></div><div class="absolute inset-0 opacity-[0.035] dark:opacity-[0.03]" style="${ssrRenderStyle({ "background-image": "repeating-linear-gradient(0deg,#6366f1 0,#6366f1 1px,transparent 1px,transparent 25px),repeating-linear-gradient(90deg,#6366f1 0,#6366f1 1px,transparent 1px,transparent 25px)" })}" data-v-bfff4de9${_scopeId}></div><div class="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5" data-v-bfff4de9${_scopeId}><div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-200 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-indigo-600/20 dark:border-indigo-500/30" data-v-bfff4de9${_scopeId}>`);
            _push2(ssrRenderComponent(unref(UserIcon), { class: "w-7 h-7 text-blue-500 dark:text-blue-400" }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex-1" data-v-bfff4de9${_scopeId}><h1 class="text-xl sm:text-2xl font-bold tracking-tight text-gray-800 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-slate-400 dark:bg-clip-text" data-v-bfff4de9${_scopeId}> Welcome, ${ssrInterpolate(unref(userName))}! 👋 </h1><p class="text-sm mt-1 text-gray-400 dark:text-slate-400" data-v-bfff4de9${_scopeId}> May your day remain productive and enjoyable! </p></div><div class="hidden sm:flex items-center gap-2 flex-shrink-0" data-v-bfff4de9${_scopeId}><div class="text-center px-5 py-2 rounded-xl bg-blue-50 border border-blue-100 dark:bg-transparent dark:border-0" data-v-bfff4de9${_scopeId}><p class="text-2xl font-bold font-mono tracking-tight text-blue-600 dark:text-transparent dark:bg-gradient-to-b dark:from-blue-300 dark:to-indigo-400 dark:bg-clip-text" data-v-bfff4de9${_scopeId}>${ssrInterpolate(unref(page).props.usersCount?.siswa ?? 0)}</p><p class="text-[10px] uppercase tracking-widest mt-1 text-gray-400 dark:text-slate-500" data-v-bfff4de9${_scopeId}>Siswa </p></div><div class="w-px h-8 bg-blue-100 dark:bg-white/5" data-v-bfff4de9${_scopeId}></div><div class="text-center px-5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 dark:bg-transparent dark:border-0" data-v-bfff4de9${_scopeId}><p class="text-2xl font-bold font-mono tracking-tight text-indigo-600 dark:text-transparent dark:bg-gradient-to-b dark:from-blue-300 dark:to-indigo-400 dark:bg-clip-text" data-v-bfff4de9${_scopeId}>${ssrInterpolate(unref(page).props.usersCount?.proktor ?? 0)}</p><p class="text-[10px] uppercase tracking-widest mt-1 text-gray-400 dark:text-slate-500" data-v-bfff4de9${_scopeId}>Proktor </p></div></div></div></div><div class="hidden sm:grid grid-cols-3 gap-3 mb-6" data-v-bfff4de9${_scopeId}><!--[-->`);
            ssrRenderList(statCards, (card, i) => {
              _push2(`<div class="${ssrRenderClass([{
                "border-violet-100 hover:border-violet-300 dark:border-indigo-500/20 dark:hover:border-indigo-500/50": card.color === "purple",
                "border-blue-100   hover:border-blue-300   dark:border-blue-500/20   dark:hover:border-blue-500/50": card.color === "blue",
                "border-emerald-100 hover:border-emerald-300 dark:border-emerald-500/20 dark:hover:border-emerald-500/50": card.color === "green"
              }, "relative overflow-hidden rounded-2xl border p-5 cursor-default transition-all duration-200 hover:-translate-y-1 animate-fade-up bg-white dark:bg-[#111827]"])}" style="${ssrRenderStyle(`animation-delay:${0.12 + i * 0.05}s`)}" data-v-bfff4de9${_scopeId}><div class="${ssrRenderClass([{
                "bg-gradient-to-r from-indigo-500 to-violet-400": card.color === "purple",
                "bg-gradient-to-r from-blue-500 to-sky-400": card.color === "blue",
                "bg-gradient-to-r from-emerald-500 to-teal-400": card.color === "green"
              }, "absolute top-0 left-0 right-0 h-[2.5px] rounded-t-2xl"])}" data-v-bfff4de9${_scopeId}></div><div class="${ssrRenderClass([{
                "bg-violet-50  dark:bg-indigo-500/10": card.color === "purple",
                "bg-blue-50    dark:bg-blue-500/10": card.color === "blue",
                "bg-emerald-50 dark:bg-emerald-500/10": card.color === "green"
              }, "w-9 h-9 rounded-xl flex items-center justify-center mb-4"])}" data-v-bfff4de9${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(card.icon), {
                class: ["w-[18px] h-[18px]", {
                  "text-violet-500 dark:text-violet-400": card.color === "purple",
                  "text-blue-500   dark:text-sky-400": card.color === "blue",
                  "text-emerald-500 dark:text-teal-400": card.color === "green"
                }]
              }, null), _parent2, _scopeId);
              _push2(`</div><p class="text-[11px] uppercase tracking-widest font-medium mb-1 text-gray-400 dark:text-slate-500" data-v-bfff4de9${_scopeId}>${ssrInterpolate(card.label)}</p><p class="${ssrRenderClass([{
                "text-violet-600 dark:text-violet-300": card.color === "purple",
                "text-blue-600   dark:text-sky-300": card.color === "blue",
                "text-emerald-600 dark:text-teal-300": card.color === "green"
              }, "text-3xl font-bold font-mono tracking-tight"])}" data-v-bfff4de9${_scopeId}>${ssrInterpolate(unref(page).props.usersCount?.[card.key] ?? 0)}</p></div>`);
            });
            _push2(`<!--]--></div><p class="text-[11px] uppercase tracking-widest font-semibold mb-3 px-0.5 animate-fade-up text-gray-400 dark:text-slate-500" style="${ssrRenderStyle({ "animation-delay": ".28s" })}" data-v-bfff4de9${_scopeId}> Navigasi Cepat </p><div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6" data-v-bfff4de9${_scopeId}><!--[-->`);
            ssrRenderList(menuItems, (item, i) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: item.title,
                href: item.route,
                prefetch: "hover",
                "preserve-scroll": "",
                "preserve-state": "",
                class: ["group relative flex flex-col items-start gap-3 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl animate-fade-up bg-white dark:bg-[#111827]", {
                  "border-violet-100 hover:border-violet-300 hover:shadow-violet-100/60 dark:border-indigo-500/20 dark:hover:border-indigo-500/50 dark:hover:shadow-indigo-500/10": item.color === "purple",
                  "border-blue-100   hover:border-blue-300   hover:shadow-blue-100/60   dark:border-blue-500/20   dark:hover:border-blue-500/50   dark:hover:shadow-blue-500/10": item.color === "blue",
                  "border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/60 dark:border-emerald-500/20 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10": item.color === "green",
                  "border-amber-100  hover:border-amber-300  hover:shadow-amber-100/60  dark:border-amber-500/20  dark:hover:border-amber-500/50  dark:hover:shadow-amber-500/10": item.color === "amber",
                  "border-red-100    hover:border-red-300    hover:shadow-red-100/60    dark:border-red-500/20    dark:hover:border-red-500/50    dark:hover:shadow-red-500/10": item.color === "red",
                  "sm:col-span-2 lg:col-span-1": item.wide
                }],
                style: `animation-delay:${0.32 + i * 0.05}s`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="${ssrRenderClass([{
                      "bg-violet-50  dark:bg-indigo-500/10": item.color === "purple",
                      "bg-blue-50    dark:bg-blue-500/10": item.color === "blue",
                      "bg-emerald-50 dark:bg-emerald-500/10": item.color === "green",
                      "bg-amber-50   dark:bg-amber-500/10": item.color === "amber",
                      "bg-red-50     dark:bg-red-500/10": item.color === "red"
                    }, "w-10 h-10 rounded-[11px] flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3"])}" data-v-bfff4de9${_scopeId2}>`);
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(item.icon), {
                      class: ["w-5 h-5", {
                        "text-violet-500 dark:text-violet-400": item.color === "purple",
                        "text-blue-500   dark:text-sky-400": item.color === "blue",
                        "text-emerald-500 dark:text-teal-400": item.color === "green",
                        "text-amber-500  dark:text-amber-400": item.color === "amber",
                        "text-red-500    dark:text-red-400": item.color === "red"
                      }]
                    }, null), _parent3, _scopeId2);
                    _push3(`</div><div class="flex-1 min-w-0" data-v-bfff4de9${_scopeId2}><p class="text-sm font-semibold leading-tight text-gray-800 dark:text-slate-100" data-v-bfff4de9${_scopeId2}>${ssrInterpolate(item.title)}</p><p class="text-[11px] mt-0.5 leading-tight text-gray-400 dark:text-slate-500" data-v-bfff4de9${_scopeId2}>${ssrInterpolate(item.desc)}</p></div><span class="text-xs transition-all duration-200 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 dark:text-slate-600 dark:group-hover:text-blue-400" data-v-bfff4de9${_scopeId2}>→</span>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: ["w-10 h-10 rounded-[11px] flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3", {
                          "bg-violet-50  dark:bg-indigo-500/10": item.color === "purple",
                          "bg-blue-50    dark:bg-blue-500/10": item.color === "blue",
                          "bg-emerald-50 dark:bg-emerald-500/10": item.color === "green",
                          "bg-amber-50   dark:bg-amber-500/10": item.color === "amber",
                          "bg-red-50     dark:bg-red-500/10": item.color === "red"
                        }]
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                          class: ["w-5 h-5", {
                            "text-violet-500 dark:text-violet-400": item.color === "purple",
                            "text-blue-500   dark:text-sky-400": item.color === "blue",
                            "text-emerald-500 dark:text-teal-400": item.color === "green",
                            "text-amber-500  dark:text-amber-400": item.color === "amber",
                            "text-red-500    dark:text-red-400": item.color === "red"
                          }]
                        }, null, 8, ["class"]))
                      ], 2),
                      createVNode("div", { class: "flex-1 min-w-0" }, [
                        createVNode("p", { class: "text-sm font-semibold leading-tight text-gray-800 dark:text-slate-100" }, toDisplayString(item.title), 1),
                        createVNode("p", { class: "text-[11px] mt-0.5 leading-tight text-gray-400 dark:text-slate-500" }, toDisplayString(item.desc), 1)
                      ]),
                      createVNode("span", { class: "text-xs transition-all duration-200 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 dark:text-slate-600 dark:group-hover:text-blue-400" }, "→")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="rounded-2xl border p-5 sm:p-6 animate-fade-up bg-white border-gray-100 dark:bg-[#111827] dark:border-white/5" style="${ssrRenderStyle({ "animation-delay": ".55s" })}" data-v-bfff4de9${_scopeId}><div class="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/5" data-v-bfff4de9${_scopeId}><div class="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-amber-50 dark:bg-amber-500/10" data-v-bfff4de9${_scopeId}><svg class="w-[18px] h-[18px] text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" data-v-bfff4de9${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" data-v-bfff4de9${_scopeId}></path></svg></div><div data-v-bfff4de9${_scopeId}><p class="text-[15px] font-semibold tracking-tight text-gray-800 dark:text-slate-100" data-v-bfff4de9${_scopeId}>Peringatan Penting</p><p class="text-[11px] mt-0.5 text-gray-400 dark:text-slate-500" data-v-bfff4de9${_scopeId}>Panduan pelaksanaan ujian</p></div></div><ul class="space-y-1.5" data-v-bfff4de9${_scopeId}><!--[-->`);
            ssrRenderList(notices, (notice) => {
              _push2(`<li class="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-transparent transition-all duration-150 hover:bg-gray-50 hover:border-gray-100 dark:hover:bg-white/[0.03] dark:hover:border-white/5" data-v-bfff4de9${_scopeId}><div class="${ssrRenderClass([{
                "bg-emerald-50 dark:bg-emerald-500/10": notice.type === "g",
                "bg-amber-50   dark:bg-amber-500/10": notice.type === "y",
                "bg-red-50     dark:bg-red-500/10": notice.type === "r",
                "bg-blue-50    dark:bg-blue-500/10": notice.type === "b"
              }, "w-[22px] h-[22px] rounded-[7px] flex items-center justify-center flex-shrink-0 mt-px"])}" data-v-bfff4de9${_scopeId}>`);
              if (notice.type === "g") {
                _push2(`<svg class="w-3 h-3 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-bfff4de9${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" data-v-bfff4de9${_scopeId}></path></svg>`);
              } else if (notice.type === "y") {
                _push2(`<svg class="w-3 h-3 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-bfff4de9${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.007v-.008H12z" data-v-bfff4de9${_scopeId}></path></svg>`);
              } else if (notice.type === "r") {
                _push2(`<svg class="w-3 h-3 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-bfff4de9${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-bfff4de9${_scopeId}></path></svg>`);
              } else if (notice.type === "b") {
                _push2(`<svg class="w-3 h-3 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-bfff4de9${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" data-v-bfff4de9${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-bfff4de9${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><p class="text-[13px] leading-relaxed flex-1 notice-text text-gray-500 dark:text-slate-400" data-v-bfff4de9${_scopeId}>${notice.text ?? ""}</p></li>`);
            });
            _push2(`<!--]--></ul></div>`);
          } else {
            return [
              createVNode(Transition, { name: "toast" }, {
                default: withCtx(() => [
                  toast.value.show ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center justify-between z-50 md:hidden border border-white/10"
                  }, [
                    createVNode("span", { class: "truncate text-sm" }, toDisplayString(toast.value.message), 1),
                    createVNode("button", {
                      onClick: ($event) => toast.value.show = false,
                      class: "ml-4 flex-shrink-0 text-white/60 hover:text-white"
                    }, [
                      createVNode(unref(XMarkIcon), { class: "w-4 h-4" })
                    ], 8, ["onClick"])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(Transition, { name: "toast-desk" }, {
                default: withCtx(() => [
                  toast.value.show ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: ["hidden md:flex fixed top-5 right-5 w-80 px-5 py-3.5 rounded-xl shadow-2xl z-50 items-center gap-3 text-white border border-white/10", toast.value.type === "success" ? "bg-emerald-700" : "bg-gray-900"]
                  }, [
                    toast.value.type === "success" ? (openBlock(), createBlock("svg", {
                      key: 0,
                      class: "w-5 h-5 flex-shrink-0",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2.5",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M4.5 12.75l6 6 9-13.5"
                      })
                    ])) : createCommentVNode("", true),
                    createVNode("span", { class: "truncate text-sm" }, toDisplayString(toast.value.message), 1),
                    createVNode("button", {
                      onClick: ($event) => toast.value.show = false,
                      class: "ml-auto text-white/60 hover:text-white"
                    }, [
                      createVNode(unref(XMarkIcon), { class: "w-4 h-4" })
                    ], 8, ["onClick"])
                  ], 2)) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode("div", { class: "flex items-center justify-between mb-7 animate-slide-down" }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  createVNode("div", { class: "w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30" }, " ✨ "),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold leading-none tracking-tight text-gray-900 dark:text-slate-100" }, [
                      createVNode("span", { class: "sm:inline-flex hidden" }, "Lumiverse System"),
                      createVNode("span", { class: "inline-flex sm:hidden" }, "Kreaticraft Smart Learning System")
                    ]),
                    createVNode("p", { class: "text-[11px] mt-0.5 text-gray-400 dark:text-slate-500" }, "Proktor Dashboard")
                  ])
                ]),
                createVNode("div", { class: "flex items-center gap-2.5" }, [
                  createVNode("span", { class: "hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-mono font-medium tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-300" }, " PROKTOR "),
                  createVNode("div", { class: "relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 sm:flex hidden items-center justify-center text-white text-xs font-semibold border-2 border-indigo-200 dark:border-indigo-500/40 cursor-pointer" }, [
                    createTextVNode(toDisplayString(unref(userInitials)) + " ", 1),
                    createVNode("span", { class: "absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0b0f1a]" })
                  ])
                ])
              ]),
              createVNode("div", {
                class: "relative overflow-hidden rounded-2xl mb-6 p-6 sm:p-8 animate-fade-up bg-white border border-blue-100 dark:bg-[#111827] dark:border-blue-500/20",
                style: { "animation-delay": ".05s" }
              }, [
                createVNode("div", { class: "absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none blur-3xl bg-indigo-100 dark:bg-indigo-600/20" }),
                createVNode("div", { class: "absolute -bottom-16 left-4 w-48 h-48 rounded-full pointer-events-none blur-3xl bg-blue-50 dark:bg-blue-500/10" }),
                createVNode("div", {
                  class: "absolute inset-0 opacity-[0.035] dark:opacity-[0.03]",
                  style: { "background-image": "repeating-linear-gradient(0deg,#6366f1 0,#6366f1 1px,transparent 1px,transparent 25px),repeating-linear-gradient(90deg,#6366f1 0,#6366f1 1px,transparent 1px,transparent 25px)" }
                }),
                createVNode("div", { class: "relative z-10 flex flex-col sm:flex-row sm:items-center gap-5" }, [
                  createVNode("div", { class: "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-200 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-indigo-600/20 dark:border-indigo-500/30" }, [
                    createVNode(unref(UserIcon), { class: "w-7 h-7 text-blue-500 dark:text-blue-400" })
                  ]),
                  createVNode("div", { class: "flex-1" }, [
                    createVNode("h1", { class: "text-xl sm:text-2xl font-bold tracking-tight text-gray-800 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-slate-400 dark:bg-clip-text" }, " Welcome, " + toDisplayString(unref(userName)) + "! 👋 ", 1),
                    createVNode("p", { class: "text-sm mt-1 text-gray-400 dark:text-slate-400" }, " May your day remain productive and enjoyable! ")
                  ]),
                  createVNode("div", { class: "hidden sm:flex items-center gap-2 flex-shrink-0" }, [
                    createVNode("div", { class: "text-center px-5 py-2 rounded-xl bg-blue-50 border border-blue-100 dark:bg-transparent dark:border-0" }, [
                      createVNode("p", { class: "text-2xl font-bold font-mono tracking-tight text-blue-600 dark:text-transparent dark:bg-gradient-to-b dark:from-blue-300 dark:to-indigo-400 dark:bg-clip-text" }, toDisplayString(unref(page).props.usersCount?.siswa ?? 0), 1),
                      createVNode("p", { class: "text-[10px] uppercase tracking-widest mt-1 text-gray-400 dark:text-slate-500" }, "Siswa ")
                    ]),
                    createVNode("div", { class: "w-px h-8 bg-blue-100 dark:bg-white/5" }),
                    createVNode("div", { class: "text-center px-5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 dark:bg-transparent dark:border-0" }, [
                      createVNode("p", { class: "text-2xl font-bold font-mono tracking-tight text-indigo-600 dark:text-transparent dark:bg-gradient-to-b dark:from-blue-300 dark:to-indigo-400 dark:bg-clip-text" }, toDisplayString(unref(page).props.usersCount?.proktor ?? 0), 1),
                      createVNode("p", { class: "text-[10px] uppercase tracking-widest mt-1 text-gray-400 dark:text-slate-500" }, "Proktor ")
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "hidden sm:grid grid-cols-3 gap-3 mb-6" }, [
                (openBlock(), createBlock(Fragment, null, renderList(statCards, (card, i) => {
                  return createVNode("div", {
                    key: card.key,
                    class: ["relative overflow-hidden rounded-2xl border p-5 cursor-default transition-all duration-200 hover:-translate-y-1 animate-fade-up bg-white dark:bg-[#111827]", {
                      "border-violet-100 hover:border-violet-300 dark:border-indigo-500/20 dark:hover:border-indigo-500/50": card.color === "purple",
                      "border-blue-100   hover:border-blue-300   dark:border-blue-500/20   dark:hover:border-blue-500/50": card.color === "blue",
                      "border-emerald-100 hover:border-emerald-300 dark:border-emerald-500/20 dark:hover:border-emerald-500/50": card.color === "green"
                    }],
                    style: `animation-delay:${0.12 + i * 0.05}s`
                  }, [
                    createVNode("div", {
                      class: ["absolute top-0 left-0 right-0 h-[2.5px] rounded-t-2xl", {
                        "bg-gradient-to-r from-indigo-500 to-violet-400": card.color === "purple",
                        "bg-gradient-to-r from-blue-500 to-sky-400": card.color === "blue",
                        "bg-gradient-to-r from-emerald-500 to-teal-400": card.color === "green"
                      }]
                    }, null, 2),
                    createVNode("div", {
                      class: ["w-9 h-9 rounded-xl flex items-center justify-center mb-4", {
                        "bg-violet-50  dark:bg-indigo-500/10": card.color === "purple",
                        "bg-blue-50    dark:bg-blue-500/10": card.color === "blue",
                        "bg-emerald-50 dark:bg-emerald-500/10": card.color === "green"
                      }]
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(card.icon), {
                        class: ["w-[18px] h-[18px]", {
                          "text-violet-500 dark:text-violet-400": card.color === "purple",
                          "text-blue-500   dark:text-sky-400": card.color === "blue",
                          "text-emerald-500 dark:text-teal-400": card.color === "green"
                        }]
                      }, null, 8, ["class"]))
                    ], 2),
                    createVNode("p", { class: "text-[11px] uppercase tracking-widest font-medium mb-1 text-gray-400 dark:text-slate-500" }, toDisplayString(card.label), 1),
                    createVNode("p", {
                      class: ["text-3xl font-bold font-mono tracking-tight", {
                        "text-violet-600 dark:text-violet-300": card.color === "purple",
                        "text-blue-600   dark:text-sky-300": card.color === "blue",
                        "text-emerald-600 dark:text-teal-300": card.color === "green"
                      }]
                    }, toDisplayString(unref(page).props.usersCount?.[card.key] ?? 0), 3)
                  ], 6);
                }), 64))
              ]),
              createVNode("p", {
                class: "text-[11px] uppercase tracking-widest font-semibold mb-3 px-0.5 animate-fade-up text-gray-400 dark:text-slate-500",
                style: { "animation-delay": ".28s" }
              }, " Navigasi Cepat "),
              createVNode("div", { class: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6" }, [
                (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item, i) => {
                  return createVNode(unref(Link), {
                    key: item.title,
                    href: item.route,
                    prefetch: "hover",
                    "preserve-scroll": "",
                    "preserve-state": "",
                    class: ["group relative flex flex-col items-start gap-3 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl animate-fade-up bg-white dark:bg-[#111827]", {
                      "border-violet-100 hover:border-violet-300 hover:shadow-violet-100/60 dark:border-indigo-500/20 dark:hover:border-indigo-500/50 dark:hover:shadow-indigo-500/10": item.color === "purple",
                      "border-blue-100   hover:border-blue-300   hover:shadow-blue-100/60   dark:border-blue-500/20   dark:hover:border-blue-500/50   dark:hover:shadow-blue-500/10": item.color === "blue",
                      "border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/60 dark:border-emerald-500/20 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/10": item.color === "green",
                      "border-amber-100  hover:border-amber-300  hover:shadow-amber-100/60  dark:border-amber-500/20  dark:hover:border-amber-500/50  dark:hover:shadow-amber-500/10": item.color === "amber",
                      "border-red-100    hover:border-red-300    hover:shadow-red-100/60    dark:border-red-500/20    dark:hover:border-red-500/50    dark:hover:shadow-red-500/10": item.color === "red",
                      "sm:col-span-2 lg:col-span-1": item.wide
                    }],
                    style: `animation-delay:${0.32 + i * 0.05}s`
                  }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: ["w-10 h-10 rounded-[11px] flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3", {
                          "bg-violet-50  dark:bg-indigo-500/10": item.color === "purple",
                          "bg-blue-50    dark:bg-blue-500/10": item.color === "blue",
                          "bg-emerald-50 dark:bg-emerald-500/10": item.color === "green",
                          "bg-amber-50   dark:bg-amber-500/10": item.color === "amber",
                          "bg-red-50     dark:bg-red-500/10": item.color === "red"
                        }]
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                          class: ["w-5 h-5", {
                            "text-violet-500 dark:text-violet-400": item.color === "purple",
                            "text-blue-500   dark:text-sky-400": item.color === "blue",
                            "text-emerald-500 dark:text-teal-400": item.color === "green",
                            "text-amber-500  dark:text-amber-400": item.color === "amber",
                            "text-red-500    dark:text-red-400": item.color === "red"
                          }]
                        }, null, 8, ["class"]))
                      ], 2),
                      createVNode("div", { class: "flex-1 min-w-0" }, [
                        createVNode("p", { class: "text-sm font-semibold leading-tight text-gray-800 dark:text-slate-100" }, toDisplayString(item.title), 1),
                        createVNode("p", { class: "text-[11px] mt-0.5 leading-tight text-gray-400 dark:text-slate-500" }, toDisplayString(item.desc), 1)
                      ]),
                      createVNode("span", { class: "text-xs transition-all duration-200 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 dark:text-slate-600 dark:group-hover:text-blue-400" }, "→")
                    ]),
                    _: 2
                  }, 1032, ["href", "class", "style"]);
                }), 64))
              ]),
              createVNode("div", {
                class: "rounded-2xl border p-5 sm:p-6 animate-fade-up bg-white border-gray-100 dark:bg-[#111827] dark:border-white/5",
                style: { "animation-delay": ".55s" }
              }, [
                createVNode("div", { class: "flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/5" }, [
                  createVNode("div", { class: "w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-amber-50 dark:bg-amber-500/10" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-[18px] h-[18px] text-amber-500 dark:text-amber-400",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "1.5",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      })
                    ]))
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-[15px] font-semibold tracking-tight text-gray-800 dark:text-slate-100" }, "Peringatan Penting"),
                    createVNode("p", { class: "text-[11px] mt-0.5 text-gray-400 dark:text-slate-500" }, "Panduan pelaksanaan ujian")
                  ])
                ]),
                createVNode("ul", { class: "space-y-1.5" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(notices, (notice) => {
                    return createVNode("li", {
                      key: notice.text,
                      class: "flex items-start gap-3 px-3 py-2.5 rounded-xl border border-transparent transition-all duration-150 hover:bg-gray-50 hover:border-gray-100 dark:hover:bg-white/[0.03] dark:hover:border-white/5"
                    }, [
                      createVNode("div", {
                        class: ["w-[22px] h-[22px] rounded-[7px] flex items-center justify-center flex-shrink-0 mt-px", {
                          "bg-emerald-50 dark:bg-emerald-500/10": notice.type === "g",
                          "bg-amber-50   dark:bg-amber-500/10": notice.type === "y",
                          "bg-red-50     dark:bg-red-500/10": notice.type === "r",
                          "bg-blue-50    dark:bg-blue-500/10": notice.type === "b"
                        }]
                      }, [
                        notice.type === "g" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "w-3 h-3 text-emerald-500 dark:text-emerald-400",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2.5",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M4.5 12.75l6 6 9-13.5"
                          })
                        ])) : notice.type === "y" ? (openBlock(), createBlock("svg", {
                          key: 1,
                          class: "w-3 h-3 text-amber-500 dark:text-amber-400",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2.5",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M12 9v3.75m0 3.75h.007v-.008H12z"
                          })
                        ])) : notice.type === "r" ? (openBlock(), createBlock("svg", {
                          key: 2,
                          class: "w-3 h-3 text-red-500 dark:text-red-400",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2.5",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M6 18L18 6M6 6l12 12"
                          })
                        ])) : notice.type === "b" ? (openBlock(), createBlock("svg", {
                          key: 3,
                          class: "w-3 h-3 text-blue-500 dark:text-blue-400",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2.5",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          }),
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          })
                        ])) : createCommentVNode("", true)
                      ], 2),
                      createVNode("p", {
                        class: "text-[13px] leading-relaxed flex-1 notice-text text-gray-500 dark:text-slate-400",
                        innerHTML: notice.text
                      }, null, 8, ["innerHTML"])
                    ]);
                  }), 64))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Proktor/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bfff4de9"]]);
export {
  Dashboard as default
};
