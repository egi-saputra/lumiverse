import { mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import "./MenuLayout-61-dwqPB.js";
import { Head, Link } from "@inertiajs/vue3";
import { ArrowLeftIcon, PlayCircleIcon } from "@heroicons/vue/24/solid";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
const _sfc_main = {
  __name: "Preview",
  __ssrInlineRender: true,
  props: {
    soal: Object,
    jumlahSoal: Number
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dark:bg-[#020617]" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Head), { title: "Informasi Ujian" }, null, _parent));
      _push(`<template><h2 class="text-xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"> Informasi Ujian </h2></template><div class="sm:max-w-4xl mx-auto sm:px-4 sm:py-8"><div class="relative overflow-hidden sm:rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] py-6 p-4 md:p-10"><div class="absolute inset-0 pointer-events-none bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent"></div><h3 class="relative z-10 text-2xl md:text-4xl font-extrabold text-gray-800 dark:text-white text-center mb-10"> Quiz / Exam Overview </h3><div class="relative z-10 mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-center shadow-xl"><p class="text-xs uppercase tracking-[0.3em] text-white/80"> Exam Token </p><p class="mt-3 text-4xl md:text-5xl font-black tracking-widest text-white select-all">${ssrInterpolate(__props.soal.token)}</p></div><div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10"><!--[-->`);
      ssrRenderList([
        ["Quiz Title", __props.soal.title ?? "Tidak ada"],
        ["Subject", __props.soal.mapel?.mapel ?? "-"],
        ["Class Unit", __props.soal.kelas ?? "-"],
        ["Total Questions", __props.jumlahSoal + " Items"],
        ["Duration", __props.soal.waktu + " Minutes"]
      ], ([label, value], i) => {
        _push(`<div class="p-4 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-lg border border-white/30 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300"><p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">${ssrInterpolate(label)}</p><p class="mt-1 font-semibold text-gray-800 dark:text-white">${ssrInterpolate(value)}</p></div>`);
      });
      _push(`<!--]--></div><div class="relative z-10 p-6 rounded-2xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 shadow-lg mb-10"><h4 class="flex items-center gap-2 font-bold text-red-600 dark:text-red-400 mb-4"> ⚠️ Perhatian Penting </h4><ul class="list-disc list-inside text-sm text-red-600 dark:text-red-300 space-y-2"><li>Kerjakan ujian sesuai waktu yang ditentukan.</li><li>Waktu dimulai setelah klik <b>Kerjakan</b>.</li><li>Ujian otomatis berakhir saat waktu habis.</li><li>Dilarang membuka tab baru atau refresh.</li><li>Dilarang copy–paste, screenshot, shortcut, DevTools.</li></ul><p class="mt-4 text-sm font-medium text-red-700 dark:text-red-300"> Pelanggaran dapat menyebabkan ujian dibatalkan otomatis. </p></div><div class="relative z-10 flex flex-col sm:flex-row gap-4 justify-between">`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("siswa.ujian.token"),
        class: "flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-semibold transition shadow-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeftIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` Kembali `);
          } else {
            return [
              createVNode(unref(ArrowLeftIcon), { class: "w-5 h-5" }),
              createTextVNode(" Kembali ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold shadow-xl transition transform hover:-translate-y-0.5">`);
      _push(ssrRenderComponent(unref(PlayCircleIcon), { class: "w-6 h-6" }, null, _parent));
      _push(` Kerjakan Ujian </button></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Ujian/Preview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
