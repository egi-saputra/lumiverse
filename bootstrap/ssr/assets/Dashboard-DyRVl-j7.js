import { computed, ref, onMounted, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, Transition, createCommentVNode, createTextVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./UserLayout-bEWAD7gb.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { NewspaperIcon, DocumentTextIcon, ClipboardDocumentListIcon, UserGroupIcon, MegaphoneIcon, XMarkIcon, IdentificationIcon, AcademicCapIcon } from "@heroicons/vue/24/solid";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "@vueuse/core";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const user = computed(() => page.props.auth.user || {});
    const isSmk = computed(
      () => (page.props.tenant?.school_level ?? "").toString().trim().toLowerCase() === "smk"
    );
    const toast = ref({ show: false, message: "", type: "info" });
    const showToast = (message, type = "info") => {
      toast.value = { show: true, message, type };
      setTimeout(() => {
        toast.value.show = false;
      }, 2500);
    };
    const menuItems = [
      {
        title: "Learning",
        icon: NewspaperIcon,
        route: route("siswa.material.index"),
        gradient: "from-sky-400 to-cyan-500",
        glow: "shadow-sky-400/30",
        bg: "bg-sky-50 dark:bg-sky-950/40",
        border: "border-sky-100 dark:border-sky-800/30"
      },
      {
        title: "Assignment",
        icon: DocumentTextIcon,
        route: route("siswa.assignment.index"),
        gradient: "from-violet-500 to-purple-600",
        glow: "shadow-violet-400/30",
        bg: "bg-violet-50 dark:bg-violet-950/40",
        border: "border-violet-100 dark:border-violet-800/30"
      },
      {
        title: "Exam Room",
        icon: ClipboardDocumentListIcon,
        route: route("siswa.ujian.token"),
        gradient: "from-rose-500 to-pink-600",
        glow: "shadow-rose-400/30",
        bg: "bg-rose-50 dark:bg-rose-950/40",
        border: "border-rose-100 dark:border-rose-800/30"
      },
      {
        title: "Attendance",
        icon: UserGroupIcon,
        route: route("siswa.absensi.index"),
        gradient: "from-blue-500 to-teal-500",
        glow: "shadow-blue-400/30",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        border: "border-blue-100 dark:border-blue-800/30"
      },
      {
        title: "Messages",
        icon: EnvelopeIcon,
        route: route("pesan.index"),
        gradient: "from-emerald-500 to-teal-500",
        glow: "shadow-emerald-400/30",
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        border: "border-emerald-100 dark:border-emerald-800/30"
      },
      {
        title: "Announcements",
        icon: MegaphoneIcon,
        route: route("pengumuman.index"),
        gradient: "from-amber-500 to-orange-500",
        glow: "shadow-amber-400/30",
        bg: "bg-amber-50 dark:bg-amber-950/40",
        border: "border-amber-100 dark:border-amber-800/30"
      }
    ];
    const siswa = computed(() => page.props.siswa || {});
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => showToast("ID berhasil disalin!", "success")).catch(() => showToast("Gagal menyalin ke clipboard!", "error"));
    };
    const sliderRef = ref(null);
    const activeSlide = ref(0);
    onMounted(() => {
      if (!sliderRef.value) return;
      sliderRef.value.addEventListener("scroll", () => {
        activeSlide.value = Math.round(
          sliderRef.value.scrollLeft / sliderRef.value.clientWidth
        );
      });
    });
    const getInitials = (name) => {
      if (!name) return "?";
      return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            if (toast.value.show) {
              _push2(`<div class="${ssrRenderClass([toast.value.type === "success" ? "bg-emerald-600/90" : toast.value.type === "error" ? "bg-rose-600/90" : "bg-gray-900/90", "fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50 md:hidden flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium text-white shadow-2xl backdrop-blur-xl border border-white/10"])}" data-v-05a6f94c${_scopeId}><span class="truncate" data-v-05a6f94c${_scopeId}>${ssrInterpolate(toast.value.message)}</span><button class="flex-shrink-0 opacity-70 hover:opacity-100" data-v-05a6f94c${_scopeId}>`);
              _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(``);
            if (toast.value.show) {
              _push2(`<div class="${ssrRenderClass([toast.value.type === "success" ? "bg-emerald-600/90" : toast.value.type === "error" ? "bg-rose-600/90" : "bg-gray-900/90", "hidden md:flex fixed top-6 right-6 w-72 z-50 items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium text-white shadow-2xl backdrop-blur-xl border border-white/10"])}" data-v-05a6f94c${_scopeId}><span class="truncate" data-v-05a6f94c${_scopeId}>${ssrInterpolate(toast.value.message)}</span><button class="ml-auto flex-shrink-0 opacity-70 hover:opacity-100" data-v-05a6f94c${_scopeId}>`);
              _push2(ssrRenderComponent(unref(XMarkIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="sm:max-w-7xl mx-auto overflow-x-hidden sm:py-6 space-y-5 min-h-screen" data-v-05a6f94c${_scopeId}><div class="flex md:flex-col gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory md:snap-none scroll-smooth -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0" data-v-05a6f94c${_scopeId}><div class="min-w-full snap-center relative overflow-hidden rounded-2xl sm:rounded-3xl" data-v-05a6f94c${_scopeId}><div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#0c4a6e]" data-v-05a6f94c${_scopeId}></div><div class="absolute inset-0 opacity-25" style="${ssrRenderStyle({ "background-image": "radial-gradient(ellipse at 15% 60%, rgba(99,102,241,0.6) 0%, transparent 55%), radial-gradient(ellipse at 85% 10%, rgba(6,182,212,0.4) 0%, transparent 50%)" })}" data-v-05a6f94c${_scopeId}></div><div class="absolute inset-0 opacity-[0.06]" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", "background-size": "24px 24px" })}" data-v-05a6f94c${_scopeId}></div><div class="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" data-v-05a6f94c${_scopeId}></div><div class="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" data-v-05a6f94c${_scopeId}></div><div class="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 sm:p-8" data-v-05a6f94c${_scopeId}><div class="relative flex-shrink-0" data-v-05a6f94c${_scopeId}>`);
            if (user.value.avatar) {
              _push2(`<img${ssrRenderAttr("src", user.value.avatar)} alt="Avatar" class="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white/30 shadow-xl" data-v-05a6f94c${_scopeId}>`);
            } else {
              _push2(`<div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white font-bold text-2xl shadow-xl" data-v-05a6f94c${_scopeId}>${ssrInterpolate(getInitials(user.value.name))}</div>`);
            }
            _push2(`</div><div class="text-center sm:text-left flex-1" data-v-05a6f94c${_scopeId}><h1 class="text-xl sm:text-3xl font-bold text-white leading-tight" data-v-05a6f94c${_scopeId}> Hai, ${ssrInterpolate(user.value.name)}! 👋 </h1><p class="text-white/70 text-sm mt-1" data-v-05a6f94c${_scopeId}> May your day remain productive and enjoyable! </p></div><div class="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full" data-v-05a6f94c${_scopeId}><span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse" data-v-05a6f94c${_scopeId}></span><span class="text-white/80 text-xs font-medium" data-v-05a6f94c${_scopeId}>Lumiverse School</span></div></div></div><div class="hidden md:flex items-center gap-3 -mb-1" data-v-05a6f94c${_scopeId}><div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-400/25" data-v-05a6f94c${_scopeId}>`);
            _push2(ssrRenderComponent(unref(IdentificationIcon), { class: "w-5 h-5 text-white" }, null, _parent2, _scopeId));
            _push2(`</div><h2 class="text-xl font-bold text-gray-800 dark:text-gray-100" data-v-05a6f94c${_scopeId}>Personal Information</h2></div><div class="min-w-full snap-center rounded-2xl sm:rounded-3xl border transition-all duration-300 bg-white border-gray-100 shadow-sm dark:bg-gray-900/60 dark:border-gray-700 dark:backdrop-blur-xl" data-v-05a6f94c${_scopeId}><div class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4" data-v-05a6f94c${_scopeId}><div class="flex-1" data-v-05a6f94c${_scopeId}><h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight" data-v-05a6f94c${_scopeId}>${ssrInterpolate(siswa.value.nama_lengkap || "—")}</h3><p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5" data-v-05a6f94c${_scopeId}>Data pribadi siswa</p></div><span class="${ssrRenderClass([
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0",
              siswa.value.status === "Activated" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            ])}" data-v-05a6f94c${_scopeId}><span class="${ssrRenderClass([
              "w-1.5 h-1.5 rounded-full",
              siswa.value.status === "Activated" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            ])}" data-v-05a6f94c${_scopeId}></span> ${ssrInterpolate(siswa.value.status === "Activated" ? "Active" : "Inactive")}</span></div><div class="${ssrRenderClass([isSmk.value ? "sm:grid-cols-5" : "sm:grid-cols-4", "p-6 grid grid-cols-2 gap-4"])}" data-v-05a6f94c${_scopeId}><div class="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20" data-v-05a6f94c${_scopeId}><div class="flex items-center gap-1.5 mb-0.5" data-v-05a6f94c${_scopeId}>`);
            _push2(ssrRenderComponent(unref(AcademicCapIcon), { class: "w-3.5 h-3.5 text-sky-500" }, null, _parent2, _scopeId));
            _push2(`<span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500" data-v-05a6f94c${_scopeId}>Kelas</span></div><span class="text-sm font-semibold text-gray-800 dark:text-gray-200" data-v-05a6f94c${_scopeId}>${ssrInterpolate(siswa.value.kelas?.kelas || "Belum ada")}</span></div>`);
            if (isSmk.value) {
              _push2(`<div class="hidden sm:flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20" data-v-05a6f94c${_scopeId}><div class="flex items-center gap-1.5 mb-0.5" data-v-05a6f94c${_scopeId}>`);
              _push2(ssrRenderComponent(unref(DocumentTextIcon), { class: "w-3.5 h-3.5 text-rose-500" }, null, _parent2, _scopeId));
              _push2(`<span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500" data-v-05a6f94c${_scopeId}>Jurusan</span></div><span class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" data-v-05a6f94c${_scopeId}>${ssrInterpolate(siswa.value.kejuruan?.kejuruan || "Belum ada")}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-col gap-1 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/15 border border-indigo-100 dark:border-indigo-800/20" data-v-05a6f94c${_scopeId}><div class="flex items-center justify-between mb-0.5" data-v-05a6f94c${_scopeId}><span class="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 dark:text-indigo-400" data-v-05a6f94c${_scopeId}>ID Siswa</span><button class="opacity-60 hover:opacity-100 transition-opacity active:scale-90" data-v-05a6f94c${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ClipboardDocumentListIcon), { class: "w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" }, null, _parent2, _scopeId));
            _push2(`</button></div><span class="text-sm font-bold font-mono text-indigo-700 dark:text-indigo-300" data-v-05a6f94c${_scopeId}>${ssrInterpolate(siswa.value.id_siswa)}</span></div><div class="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20" data-v-05a6f94c${_scopeId}><span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 mb-0.5" data-v-05a6f94c${_scopeId}>NIS</span><span class="text-sm font-semibold font-mono text-gray-800 dark:text-gray-200" data-v-05a6f94c${_scopeId}>${ssrInterpolate(siswa.value.nis || "—")}</span></div><div class="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20" data-v-05a6f94c${_scopeId}><span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 mb-0.5" data-v-05a6f94c${_scopeId}>NISN</span><span class="text-sm font-semibold font-mono text-gray-800 dark:text-gray-200" data-v-05a6f94c${_scopeId}>${ssrInterpolate(siswa.value.nisn || "—")}</span></div></div></div></div><div class="flex justify-center items-center gap-2 md:hidden" data-v-05a6f94c${_scopeId}><!--[-->`);
            ssrRenderList(2, (i) => {
              _push2(`<button class="${ssrRenderClass([activeSlide.value === i - 1 ? "w-6 h-2 bg-indigo-500 dark:bg-blue-400" : "w-2 h-2 bg-gray-300 dark:bg-gray-600", "transition-all duration-300 rounded-full"])}" data-v-05a6f94c${_scopeId}></button>`);
            });
            _push2(`<!--]--></div><div class="md:hidden" data-v-05a6f94c${_scopeId}><p class="text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-3 px-0.5" data-v-05a6f94c${_scopeId}> Quick Access</p><div class="grid grid-cols-2 gap-3" data-v-05a6f94c${_scopeId}><!--[-->`);
            ssrRenderList(menuItems, (item, index) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: item.title,
                href: item.route,
                "preserve-scroll": "",
                class: ["group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 active:scale-[0.97]", [
                  item.bg,
                  item.border,
                  menuItems.length % 2 !== 0 && index === menuItems.length - 1 ? "col-span-2" : ""
                ]]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 rounded-2xl" data-v-05a6f94c${_scopeId2}></div><div class="${ssrRenderClass([[item.gradient, item.glow], "relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] bg-gradient-to-br"])}" data-v-05a6f94c${_scopeId2}>`);
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(item.icon), { class: "w-6 h-6 text-white" }, null), _parent3, _scopeId2);
                    _push3(`</div><span class="relative text-sm font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight" data-v-05a6f94c${_scopeId2}>${ssrInterpolate(item.title)}</span>`);
                  } else {
                    return [
                      createVNode("div", { class: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 rounded-2xl" }),
                      createVNode("div", {
                        class: ["relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] bg-gradient-to-br", [item.gradient, item.glow]]
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-6 h-6 text-white" }))
                      ], 2),
                      createVNode("span", { class: "relative text-sm font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight" }, toDisplayString(item.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div><div class="hidden md:block" data-v-05a6f94c${_scopeId}><p class="text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-4 px-0.5" data-v-05a6f94c${_scopeId}> Quick Acces</p><div class="grid grid-cols-2 lg:grid-cols-4 gap-4" data-v-05a6f94c${_scopeId}><!--[-->`);
            ssrRenderList(menuItems, (item) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: item.title,
                href: item.route,
                "preserve-scroll": "",
                class: ["group relative overflow-hidden flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg", [item.bg, item.border]]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="${ssrRenderClass([[item.gradient, item.glow], "relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br"])}" data-v-05a6f94c${_scopeId2}>`);
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(item.icon), { class: "w-5 h-5 text-white" }, null), _parent3, _scopeId2);
                    _push3(`</div><span class="text-sm font-semibold text-gray-700 dark:text-gray-200" data-v-05a6f94c${_scopeId2}>${ssrInterpolate(item.title)}</span><svg class="w-4 h-4 ml-auto text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-05a6f94c${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-05a6f94c${_scopeId2}></path></svg>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: ["relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br", [item.gradient, item.glow]]
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-5 h-5 text-white" }))
                      ], 2),
                      createVNode("span", { class: "text-sm font-semibold text-gray-700 dark:text-gray-200" }, toDisplayString(item.title), 1),
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4 ml-auto text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2.5"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M9 5l7 7-7 7"
                        })
                      ]))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div></div>`);
          } else {
            return [
              createVNode(Transition, {
                "enter-active-class": "transition duration-300 ease-out",
                "enter-from-class": "opacity-0 translate-y-3",
                "enter-to-class": "opacity-100 translate-y-0",
                "leave-active-class": "transition duration-200 ease-in",
                "leave-from-class": "opacity-100 translate-y-0",
                "leave-to-class": "opacity-0 translate-y-3"
              }, {
                default: withCtx(() => [
                  toast.value.show ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: ["fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50 md:hidden flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium text-white shadow-2xl backdrop-blur-xl border border-white/10", toast.value.type === "success" ? "bg-emerald-600/90" : toast.value.type === "error" ? "bg-rose-600/90" : "bg-gray-900/90"]
                  }, [
                    createVNode("span", { class: "truncate" }, toDisplayString(toast.value.message), 1),
                    createVNode("button", {
                      onClick: ($event) => toast.value.show = false,
                      class: "flex-shrink-0 opacity-70 hover:opacity-100"
                    }, [
                      createVNode(unref(XMarkIcon), { class: "w-4 h-4" })
                    ], 8, ["onClick"])
                  ], 2)) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(Transition, {
                "enter-active-class": "transition duration-300 ease-out",
                "enter-from-class": "opacity-0 translate-x-3",
                "enter-to-class": "opacity-100 translate-x-0",
                "leave-active-class": "transition duration-200 ease-in",
                "leave-from-class": "opacity-100 translate-x-0",
                "leave-to-class": "opacity-0 translate-x-3"
              }, {
                default: withCtx(() => [
                  toast.value.show ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: ["hidden md:flex fixed top-6 right-6 w-72 z-50 items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium text-white shadow-2xl backdrop-blur-xl border border-white/10", toast.value.type === "success" ? "bg-emerald-600/90" : toast.value.type === "error" ? "bg-rose-600/90" : "bg-gray-900/90"]
                  }, [
                    createVNode("span", { class: "truncate" }, toDisplayString(toast.value.message), 1),
                    createVNode("button", {
                      onClick: ($event) => toast.value.show = false,
                      class: "ml-auto flex-shrink-0 opacity-70 hover:opacity-100"
                    }, [
                      createVNode(unref(XMarkIcon), { class: "w-4 h-4" })
                    ], 8, ["onClick"])
                  ], 2)) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode("div", { class: "sm:max-w-7xl mx-auto overflow-x-hidden sm:py-6 space-y-5 min-h-screen" }, [
                createVNode("div", {
                  ref_key: "sliderRef",
                  ref: sliderRef,
                  class: "flex md:flex-col gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory md:snap-none scroll-smooth -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
                }, [
                  createVNode("div", { class: "min-w-full snap-center relative overflow-hidden rounded-2xl sm:rounded-3xl" }, [
                    createVNode("div", { class: "absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#0c4a6e]" }),
                    createVNode("div", {
                      class: "absolute inset-0 opacity-25",
                      style: { "background-image": "radial-gradient(ellipse at 15% 60%, rgba(99,102,241,0.6) 0%, transparent 55%), radial-gradient(ellipse at 85% 10%, rgba(6,182,212,0.4) 0%, transparent 50%)" }
                    }),
                    createVNode("div", {
                      class: "absolute inset-0 opacity-[0.06]",
                      style: { "background-image": "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", "background-size": "24px 24px" }
                    }),
                    createVNode("div", { class: "absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" }),
                    createVNode("div", { class: "absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" }),
                    createVNode("div", { class: "relative flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 sm:p-8" }, [
                      createVNode("div", { class: "relative flex-shrink-0" }, [
                        user.value.avatar ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: user.value.avatar,
                          alt: "Avatar",
                          class: "w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white/30 shadow-xl"
                        }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white font-bold text-2xl shadow-xl"
                        }, toDisplayString(getInitials(user.value.name)), 1))
                      ]),
                      createVNode("div", { class: "text-center sm:text-left flex-1" }, [
                        createVNode("h1", { class: "text-xl sm:text-3xl font-bold text-white leading-tight" }, " Hai, " + toDisplayString(user.value.name) + "! 👋 ", 1),
                        createVNode("p", { class: "text-white/70 text-sm mt-1" }, " May your day remain productive and enjoyable! ")
                      ]),
                      createVNode("div", { class: "hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full" }, [
                        createVNode("span", { class: "w-2 h-2 rounded-full bg-amber-600 animate-pulse" }),
                        createVNode("span", { class: "text-white/80 text-xs font-medium" }, "Lumiverse School")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "hidden md:flex items-center gap-3 -mb-1" }, [
                    createVNode("div", { class: "w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-400/25" }, [
                      createVNode(unref(IdentificationIcon), { class: "w-5 h-5 text-white" })
                    ]),
                    createVNode("h2", { class: "text-xl font-bold text-gray-800 dark:text-gray-100" }, "Personal Information")
                  ]),
                  createVNode("div", { class: "min-w-full snap-center rounded-2xl sm:rounded-3xl border transition-all duration-300 bg-white border-gray-100 shadow-sm dark:bg-gray-900/60 dark:border-gray-700 dark:backdrop-blur-xl" }, [
                    createVNode("div", { class: "px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4" }, [
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("h3", { class: "text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight" }, toDisplayString(siswa.value.nama_lengkap || "—"), 1),
                        createVNode("p", { class: "text-xs text-gray-400 dark:text-gray-500 mt-0.5" }, "Data pribadi siswa")
                      ]),
                      createVNode("span", {
                        class: [
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0",
                          siswa.value.status === "Activated" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        ]
                      }, [
                        createVNode("span", {
                          class: [
                            "w-1.5 h-1.5 rounded-full",
                            siswa.value.status === "Activated" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                          ]
                        }, null, 2),
                        createTextVNode(" " + toDisplayString(siswa.value.status === "Activated" ? "Active" : "Inactive"), 1)
                      ], 2)
                    ]),
                    createVNode("div", {
                      class: ["p-6 grid grid-cols-2 gap-4", isSmk.value ? "sm:grid-cols-5" : "sm:grid-cols-4"]
                    }, [
                      createVNode("div", { class: "flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20" }, [
                        createVNode("div", { class: "flex items-center gap-1.5 mb-0.5" }, [
                          createVNode(unref(AcademicCapIcon), { class: "w-3.5 h-3.5 text-sky-500" }),
                          createVNode("span", { class: "text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500" }, "Kelas")
                        ]),
                        createVNode("span", { class: "text-sm font-semibold text-gray-800 dark:text-gray-200" }, toDisplayString(siswa.value.kelas?.kelas || "Belum ada"), 1)
                      ]),
                      isSmk.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "hidden sm:flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20"
                      }, [
                        createVNode("div", { class: "flex items-center gap-1.5 mb-0.5" }, [
                          createVNode(unref(DocumentTextIcon), { class: "w-3.5 h-3.5 text-rose-500" }),
                          createVNode("span", { class: "text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500" }, "Jurusan")
                        ]),
                        createVNode("span", { class: "text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" }, toDisplayString(siswa.value.kejuruan?.kejuruan || "Belum ada"), 1)
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "flex flex-col gap-1 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/15 border border-indigo-100 dark:border-indigo-800/20" }, [
                        createVNode("div", { class: "flex items-center justify-between mb-0.5" }, [
                          createVNode("span", { class: "text-[10px] uppercase tracking-wider font-semibold text-indigo-400 dark:text-indigo-400" }, "ID Siswa"),
                          createVNode("button", {
                            onClick: ($event) => copyToClipboard(siswa.value.id_siswa),
                            class: "opacity-60 hover:opacity-100 transition-opacity active:scale-90"
                          }, [
                            createVNode(unref(ClipboardDocumentListIcon), { class: "w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" })
                          ], 8, ["onClick"])
                        ]),
                        createVNode("span", { class: "text-sm font-bold font-mono text-indigo-700 dark:text-indigo-300" }, toDisplayString(siswa.value.id_siswa), 1)
                      ]),
                      createVNode("div", { class: "flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20" }, [
                        createVNode("span", { class: "text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 mb-0.5" }, "NIS"),
                        createVNode("span", { class: "text-sm font-semibold font-mono text-gray-800 dark:text-gray-200" }, toDisplayString(siswa.value.nis || "—"), 1)
                      ]),
                      createVNode("div", { class: "flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-indigo-900/15 border border-gray-100 dark:border-indigo-800/20" }, [
                        createVNode("span", { class: "text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 mb-0.5" }, "NISN"),
                        createVNode("span", { class: "text-sm font-semibold font-mono text-gray-800 dark:text-gray-200" }, toDisplayString(siswa.value.nisn || "—"), 1)
                      ])
                    ], 2)
                  ])
                ], 512),
                createVNode("div", { class: "flex justify-center items-center gap-2 md:hidden" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(2, (i) => {
                    return createVNode("button", {
                      key: i,
                      onClick: ($event) => sliderRef.value && sliderRef.value.scrollTo({ left: (i - 1) * sliderRef.value.clientWidth, behavior: "smooth" }),
                      class: ["transition-all duration-300 rounded-full", activeSlide.value === i - 1 ? "w-6 h-2 bg-indigo-500 dark:bg-blue-400" : "w-2 h-2 bg-gray-300 dark:bg-gray-600"]
                    }, null, 10, ["onClick"]);
                  }), 64))
                ]),
                createVNode("div", { class: "md:hidden" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-3 px-0.5" }, " Quick Access"),
                  createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item, index) => {
                      return createVNode(unref(Link), {
                        key: item.title,
                        href: item.route,
                        "preserve-scroll": "",
                        class: ["group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 active:scale-[0.97]", [
                          item.bg,
                          item.border,
                          menuItems.length % 2 !== 0 && index === menuItems.length - 1 ? "col-span-2" : ""
                        ]]
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 rounded-2xl" }),
                          createVNode("div", {
                            class: ["relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] bg-gradient-to-br", [item.gradient, item.glow]]
                          }, [
                            (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-6 h-6 text-white" }))
                          ], 2),
                          createVNode("span", { class: "relative text-sm font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight" }, toDisplayString(item.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["href", "class"]);
                    }), 64))
                  ])
                ]),
                createVNode("div", { class: "hidden md:block" }, [
                  createVNode("p", { class: "text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-4 px-0.5" }, " Quick Acces"),
                  createVNode("div", { class: "grid grid-cols-2 lg:grid-cols-4 gap-4" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item) => {
                      return createVNode(unref(Link), {
                        key: item.title,
                        href: item.route,
                        "preserve-scroll": "",
                        class: ["group relative overflow-hidden flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg", [item.bg, item.border]]
                      }, {
                        default: withCtx(() => [
                          createVNode("div", {
                            class: ["relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br", [item.gradient, item.glow]]
                          }, [
                            (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-5 h-5 text-white" }))
                          ], 2),
                          createVNode("span", { class: "text-sm font-semibold text-gray-700 dark:text-gray-200" }, toDisplayString(item.title), 1),
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 ml-auto text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            "stroke-width": "2.5"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M9 5l7 7-7 7"
                            })
                          ]))
                        ]),
                        _: 2
                      }, 1032, ["href", "class"]);
                    }), 64))
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-05a6f94c"]]);
export {
  Dashboard as default
};
