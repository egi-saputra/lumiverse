import { computed, ref, watch, onMounted, onBeforeUnmount, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderComponent } from "vue/server-renderer";
import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { router, usePage } from "@inertiajs/vue3";
import axios from "axios";
const perPage = 10;
const _sfc_main = {
  __name: "Kerjakan",
  __ssrInlineRender: true,
  props: {
    soal: Object,
    ujianSiswa: Object,
    quest: Object,
    riwayat: Object,
    nomorList: Array,
    no: Number,
    totalSoal: Number,
    sisaDetik: Number,
    answered: Array
  },
  setup(__props) {
    const props = __props;
    const directLampiranLink = computed(() => {
      if (props.quest?.jenis_lampiran !== "Gambar") return null;
      return props.quest?.link_lampiran_url ?? null;
    });
    const isEssay = computed(() => props.quest?.tipe_soal === "Essay");
    const allAnswered = computed(() => props.nomorList.every((id) => answeredLocal.value.includes(id)));
    const currentPage = ref(1);
    const token = ref(props.ujianSiswa.token);
    const jawaban = ref(props.riwayat?.jawaban ?? null);
    const jawabanAwal = ref(props.riwayat?.jawaban ?? null);
    const timer = ref(props.sisaDetik);
    let interval = null;
    const answeredLocal = ref([...props.answered]);
    watch(() => props.answered, (val) => {
      answeredLocal.value = [...val];
    });
    const totalPages = computed(() => Math.ceil(props.nomorList.length / perPage));
    const paginatedNomorList = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return props.nomorList.slice(start, start + perPage);
    });
    watch(() => props.no, (val) => {
      currentPage.value = Math.ceil(val / perPage);
    });
    const showLegend = ref(false);
    const closeLegend = (e) => {
      if (!e.target.closest(".legend-wrapper")) showLegend.value = false;
    };
    const isAnswered = (questId) => answeredLocal.value.includes(questId);
    const ujianSelesai = ref(false);
    const isFullscreen = ref(false);
    const exitFullscreen = () => {
      if (document.exitFullscreen) document.exitFullscreen();
    };
    computed(() => {
      return !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen || document.documentElement.msRequestFullscreen);
    });
    const onFullscreenChange = () => {
      const fs = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      isFullscreen.value = !!fs;
      if (!fs && !ujianSelesai.value) {
        alert("Keluar dari mode layar penuh tidak diperbolehkan!");
        blockExit();
      }
    };
    watch(
      () => props.quest?.id,
      () => {
        jawaban.value = props.riwayat?.jawaban ?? null;
        jawabanAwal.value = props.riwayat?.jawaban ?? null;
      },
      { immediate: true }
    );
    const updateTimer = () => {
      if (timer.value <= 0) {
        clearInterval(interval);
        exitFullscreen();
        submitUjian();
        return;
      }
      timer.value--;
    };
    const isSaving = ref(false);
    const isNavigating = ref(false);
    const navigatingTo = ref(null);
    let saveTimeout = null;
    const pendingQueue = /* @__PURE__ */ new Map();
    const flushQueue = async () => {
      if (isSaving.value || pendingQueue.size === 0) return;
      isSaving.value = true;
      const [[questId, { jaw, tipe_soal }]] = pendingQueue;
      pendingQueue.delete(questId);
      try {
        await axios.post(route("siswa.ujian.autosave"), {
          soal_id: props.soal.id,
          quest_id: questId,
          jawaban: jaw,
          tipe_soal,
          token: token.value
        });
        if (questId === props.quest?.id) {
          jawabanAwal.value = jaw;
        }
        if (jaw !== null && !answeredLocal.value.includes(questId)) {
          answeredLocal.value.push(questId);
        }
      } catch (err) {
        if (!pendingQueue.has(questId)) {
          pendingQueue.set(questId, { jaw, tipe_soal });
        }
        console.warn("Autosave retry queued:", err?.response?.status);
      } finally {
        isSaving.value = false;
        if (pendingQueue.size > 0) {
          flushQueue();
        }
      }
    };
    const autosave = () => {
      if (jawaban.value === null) return;
      if (jawaban.value === jawabanAwal.value) return;
      pendingQueue.set(props.quest.id, {
        jaw: jawaban.value,
        tipe_soal: props.quest.tipe_soal
      });
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        flushQueue();
      }, 600);
    };
    watch(jawaban, () => {
      if (isNavigating.value) return;
      autosave();
    });
    const isSubmitting = ref(false);
    const submitUjian = async () => {
      if (isSubmitting.value) return;
      isSubmitting.value = true;
      try {
        if (jawaban.value !== null && jawaban.value !== jawabanAwal.value) {
          pendingQueue.set(props.quest.id, {
            jaw: jawaban.value,
            tipe_soal: props.quest.tipe_soal
          });
        }
        clearTimeout(saveTimeout);
        await flushQueue();
        const waitQueue = new Promise((resolve) => {
          const check = setInterval(() => {
            if (pendingQueue.size === 0 && !isSaving.value) {
              clearInterval(check);
              resolve();
            }
          }, 100);
          setTimeout(() => {
            clearInterval(check);
            resolve();
          }, 3e3);
        });
        await waitQueue;
        await axios.post(route("siswa.ujian.submit", props.soal.id), {
          token: token.value
        });
        ujianSelesai.value = true;
        exitFullscreen();
        router.get(route("siswa.ujian.finish"));
      } catch (e) {
        console.error(e);
        alert("Gagal menyimpan jawaban terakhir. Silakan coba lagi.");
      } finally {
        isSubmitting.value = false;
      }
    };
    const refreshToken = async () => {
      try {
        await axios.post(route("siswa.ujian.refreshToken", props.soal.id), {}, {
          headers: { "X-CSRF-TOKEN": usePage().props.csrf_token }
        });
      } catch (err) {
        console.error("Refresh token error:", err);
      }
    };
    const blockExit = async () => {
      clearInterval(interval);
      clearTimeout(saveTimeout);
      await refreshToken();
      try {
        await axios.post(route("siswa.ujian.forceExit", props.soal.id));
      } catch (e) {
      }
      window.location.href = route("siswa.ujian.token");
    };
    const blockKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "r", "t", "n", "w"].includes(e.key.toLowerCase())) e.preventDefault();
      if (["F5", "Escape"].includes(e.key)) e.preventDefault();
      if (e.key === "Escape") {
        e.preventDefault();
        alert("ESC tidak diperbolehkan!");
      }
    };
    const blockContext = (e) => e.preventDefault();
    const blockClipboard = (e) => e.preventDefault();
    const blockSelect = (e) => e.preventDefault();
    const blockScreenshot = (e) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        alert("Screenshot tidak diperbolehkan!");
        blockExit();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ["3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        alert("Screenshot tidak diperbolehkan!");
        blockExit();
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) blockExit();
    };
    const handleBeforeUnload = () => {
    };
    onMounted(() => {
      interval = setInterval(updateTimer, 1e3);
      document.addEventListener("visibilitychange", onVisibilityChange);
      document.addEventListener("keydown", blockKeydown);
      document.addEventListener("keydown", blockScreenshot);
      document.addEventListener("contextmenu", blockContext);
      document.addEventListener("cut", blockClipboard);
      document.addEventListener("copy", blockClipboard);
      document.addEventListener("paste", blockClipboard);
      document.addEventListener("fullscreenchange", onFullscreenChange);
      document.addEventListener("webkitfullscreenchange", onFullscreenChange);
      document.addEventListener("msfullscreenchange", onFullscreenChange);
      document.addEventListener("selectstart", blockSelect);
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("click", closeLegend);
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) blockExit();
      });
    });
    onBeforeUnmount(() => {
      clearInterval(interval);
      clearTimeout(saveTimeout);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("click", closeLegend);
      document.removeEventListener("keydown", blockKeydown);
      document.removeEventListener("keydown", blockScreenshot);
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("cut", blockClipboard);
      document.removeEventListener("copy", blockClipboard);
      document.removeEventListener("paste", blockClipboard);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      document.removeEventListener("msfullscreenchange", onFullscreenChange);
      document.removeEventListener("selectstart", blockSelect);
    });
    const showFullscreenGate = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen no-select w-full py-4 md:py-10 p-4 dark:bg-[#020617] md:px-6" }, _attrs))}>`);
      if (showFullscreenGate.value) {
        _push(`<div class="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center text-white"><div class="text-center space-y-6 w-full px-6"><h2 class="text-2xl font-bold">Masuk Mode Ujian</h2><p class="text-sm text-gray-300"> Ujian harus dikerjakan dalam <b>mode layar penuh (Full screen)</b>. Keluar dari mode full screen akan mengakhiri ujian dan anda akan dikeluarkan secara paksa. </p><button class="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 font-semibold"> Mulai Ujian </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isSubmitting.value) {
        _push(`<div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"><div class="bg-white p-6 rounded-lg shadow"> Mengirim jawaban... </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex sm:flex-row w-full sm:mx-auto sm:max-w-6xl mt-4 sm:mt-12 flex-col gap-4"><div class="flex-1 bg-white/70 dark:bg-[#0F172A]/90 backdrop-blur-xl md:shadow-xl border border-white/20 dark:border-white/10 rounded-lg md:rounded-2xl md:p-6 pt-4 pb-6 px-4 md:px-6 md:pt-6 md:pb-6"><div class="flex items-center justify-between mb-4"><h3 class="font-semibold dark:text-gray-200 select-none pointer-events-none text-gray-700"> Soal ${ssrInterpolate(__props.no)} dari ${ssrInterpolate(__props.totalSoal)}</h3><div class="z-20 md:-mt-20 -mt-2 -mr-2 md:mr-0 dark:bg-[#0F172A] bg-white md:rounded-xl dark:md:border-white/10 px-4 py-2 flex items-center gap-2 md:border"><svg class="w-5 h-5 text-red-500 dark:md:text-gray-300 md:text-[#063970]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="font-bold md:inline-block hidden -ml-1 mt-0.5 text-[#063970] dark:text-indigo-300 text-sm select-none pointer-events-none"> Timer : </span><span class="font-bold text-red-600 dark:text-red-500 mt-0.5 text-sm">${ssrInterpolate(Math.floor(timer.value / 60))}:${ssrInterpolate(String(timer.value % 60).padStart(2, "0"))}</span></div></div>`);
      if (directLampiranLink.value) {
        _push(`<div class="mb-4 mt-3 w-full"><img${ssrRenderAttr("src", directLampiranLink.value)} class="w-full max-w-sm max-h-24 sm:max-h-32 object-contain object-left"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="announcement-content prose prose-sm max-w-none dark:prose-invert mb-6 text-gray-800 dark:text-gray-100 leading-relaxed select-none pointer-events-none">${__props.quest.soal ?? ""}</div>`);
      if (!isEssay.value) {
        _push(`<div class="space-y-2.5"><!--[-->`);
        ssrRenderList(["A", "B", "C", "D", "E"], (opsi) => {
          _push(`<!--[-->`);
          if (__props.quest["opsi_" + opsi.toLowerCase()] || __props.quest["opsi_" + opsi.toLowerCase() + "_lampiran"]) {
            _push(`<label class="${ssrRenderClass([jawaban.value === opsi ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400 shadow-sm" : "border-gray-200 dark:border-white/10 bg-white/60 dark:bg-slate-800/40 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/5", "flex gap-3 items-center cursor-pointer px-4 py-3 rounded-xl border-2 transition-all duration-200 select-none"])}"><input type="radio"${ssrRenderAttr("value", opsi)}${ssrIncludeBooleanAttr(ssrLooseEqual(jawaban.value, opsi)) ? " checked" : ""} class="sr-only"><span class="${ssrRenderClass([jawaban.value === opsi ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-white" : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400", "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 self-start mt-0.5"])}">${ssrInterpolate(opsi)}</span><span class="flex-1 flex flex-col gap-2 min-w-0">`);
            if (__props.quest["opsi_" + opsi.toLowerCase()]) {
              _push(`<span class="${ssrRenderClass([jawaban.value === opsi ? "text-blue-900 dark:text-blue-100 font-medium" : "text-gray-700 dark:text-gray-300", "text-sm leading-relaxed pointer-events-none select-none transition-colors duration-200"])}">${__props.quest["opsi_" + opsi.toLowerCase()] ?? ""}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (__props.quest["opsi_" + opsi.toLowerCase() + "_lampiran"]) {
              _push(`<img${ssrRenderAttr("src", __props.quest["opsi_" + opsi.toLowerCase() + "_lampiran_url"])}${ssrRenderAttr("alt", `Gambar opsi ${opsi}`)} class="${ssrRenderClass([jawaban.value === opsi ? "border-blue-300 dark:border-blue-500" : "border-gray-200 dark:border-slate-600", "max-h-40 max-w-xs rounded-lg object-contain border pointer-events-none select-none"])}">`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span>`);
            if (jawaban.value === opsi) {
              _push(`<svg class="flex-shrink-0 w-5 h-5 text-blue-500 dark:text-blue-400 self-start mt-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</label>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="mt-4"><label class="block text-sm font-semibold dark:text-gray-400 text-gray-600 mb-2"> Jawaban Anda </label><textarea rows="6" placeholder="Tulis jawaban Anda di sini..." class="w-full rounded-xl bg-white/70 dark:bg-[#0F172A]/90 backdrop-blur border-2 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-300 p-4 text-sm leading-relaxed focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors resize-none">${ssrInterpolate(jawaban.value)}</textarea><p class="text-xs dark:text-gray-500 text-gray-400 mt-2 flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg> Jawaban tersimpan otomatis </p></div>`);
      }
      _push(`<div class="flex flex-col sm:flex-row gap-3 justify-between mt-8">`);
      if (__props.no > 1) {
        _push(`<button${ssrIncludeBooleanAttr(isNavigating.value) ? " disabled" : ""} class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition disabled:opacity-50 disabled:cursor-not-allowed dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">`);
        if (isNavigating.value && navigatingTo.value === __props.no - 1) {
          _push(`<svg class="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`);
        } else {
          _push(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>`);
        }
        _push(`<span>${ssrInterpolate(isNavigating.value && navigatingTo.value === __props.no - 1 ? "Menyimpan..." : "Sebelumnya")}</span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.no < __props.totalSoal) {
        _push(`<button${ssrIncludeBooleanAttr(isNavigating.value) ? " disabled" : ""} class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 disabled:hover:bg-blue-600"><span>${ssrInterpolate(isNavigating.value && navigatingTo.value === __props.no + 1 ? "Menyimpan..." : "Selanjutnya")}</span>`);
        if (isNavigating.value && navigatingTo.value === __props.no + 1) {
          _push(`<svg class="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`);
        } else {
          _push(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>`);
        }
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.no === __props.totalSoal) {
        _push(`<button${ssrIncludeBooleanAttr(isSubmitting.value || isNavigating.value || !allAnswered.value) ? " disabled" : ""}${ssrRenderAttr("title", !allAnswered.value ? "Masih ada soal yang belum dijawab" : "")} class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 disabled:hover:bg-blue-600">`);
        if (isSubmitting.value) {
          _push(`<svg class="animate-spin w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${ssrInterpolate(isSubmitting.value ? "Mengirim Jawaban..." : "Selesaikan Ujian")}</span>`);
        if (!isSubmitting.value) {
          _push(ssrRenderComponent(unref(PaperAirplaneIcon), { class: "w-5 h-5 shrink-0" }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.no === __props.totalSoal && !allAnswered.value) {
        _push(`<p class="text-xs text-red-500 dark:text-red-400 mt-1 text-center w-full">${ssrInterpolate(props.nomorList.length - answeredLocal.value.length)} soal belum dijawab </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="hidden md:block w-72 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 relative"><div class="flex items-center justify-between mb-4"><h3 class="font-semibold dark:text-gray-300 text-gray-700"> Daftar Soal </h3><div class="relative legend-wrapper"><button class="w-6 h-6 rounded-xl border border-gray-300 font-extrabold flex items-center justify-center dark:text-gray-300 text-gray-500 transition"> ! </button>`);
      if (showLegend.value) {
        _push(`<div class="absolute right-8 -mt-6 w-48 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl dark:text-gray-200 border border-white/20 dark:border-white/10 shadow-xl rounded-xl p-3 text-xs z-50"><div class="space-y-2"><div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-green-600"></span><span>Soal aktif</span></div><div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-blue-600"></span><span>Sudah dijawab</span></div><div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-gray-300"></span><span>Belum dijawab</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="grid grid-cols-5 gap-2"><!--[-->`);
      ssrRenderList(__props.nomorList, (id, i) => {
        _push(`<button${ssrIncludeBooleanAttr(isNavigating.value) ? " disabled" : ""} class="${ssrRenderClass([{
          "bg-blue-500 text-white border-blue-400": navigatingTo.value === i + 1,
          "bg-green-600 text-white border-green-700": i + 1 === __props.no && navigatingTo.value !== i + 1,
          "bg-blue-600 text-white border-blue-700": i + 1 !== __props.no && isAnswered(id) && navigatingTo.value !== i + 1,
          "bg-gray-100 text-gray-700 border-gray-300 disabled:opacity-60": i + 1 !== __props.no && !isAnswered(id) && navigatingTo.value !== i + 1
        }, "aspect-square rounded-lg font-bold text-sm border transition relative disabled:cursor-not-allowed"])}"><span class="${ssrRenderClass({ "opacity-0": navigatingTo.value === i + 1 })}">${ssrInterpolate(i + 1)}</span>`);
        if (navigatingTo.value === i + 1) {
          _push(`<svg class="animate-spin w-3 h-3 absolute inset-0 m-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div></div><div class="md:hidden mt-6 bg-white/70 dark:bg-[#0F172A]/90 backdrop-blur-xl rounded-lg md:border-t border-white/20 dark:border-white/10 md:shadow-xl p-4"><div class="flex items-center justify-between mb-4"><h3 class="font-semibold dark:text-gray-300 text-gray-700"> Daftar Soal </h3><div class="relative legend-wrapper"><button class="w-6 h-6 rounded-full border border-gray-500 dark:border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-800 dark:hover:border-gray-800 transition"> ! </button>`);
      if (showLegend.value) {
        _push(`<div class="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl dark:text-gray-200 border border-white/20 dark:border-white/10 shadow-xl rounded-xl p-3 text-xs z-50"><div class="space-y-2"><div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-green-600"></span><span>Soal aktif</span></div><div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-blue-600"></span><span>Sudah dijawab</span></div><div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-gray-300"></span><span>Belum dijawab</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="grid grid-cols-5 gap-2"><!--[-->`);
      ssrRenderList(paginatedNomorList.value, (id, i) => {
        _push(`<button${ssrIncludeBooleanAttr(isNavigating.value) ? " disabled" : ""} class="${ssrRenderClass([{
          "bg-blue-500 text-white border-blue-400": navigatingTo.value === (currentPage.value - 1) * perPage + i + 1,
          "bg-green-600 text-white border-green-700": (currentPage.value - 1) * perPage + i + 1 === __props.no && navigatingTo.value !== (currentPage.value - 1) * perPage + i + 1,
          "bg-blue-600 text-white border-blue-700": (currentPage.value - 1) * perPage + i + 1 !== __props.no && isAnswered(id) && navigatingTo.value !== (currentPage.value - 1) * perPage + i + 1,
          "bg-gray-100 text-gray-700 border-gray-300 disabled:opacity-60": (currentPage.value - 1) * perPage + i + 1 !== __props.no && !isAnswered(id) && navigatingTo.value !== (currentPage.value - 1) * perPage + i + 1
        }, "aspect-square rounded-lg font-bold text-sm border transition relative disabled:cursor-not-allowed"])}"><span class="${ssrRenderClass({ "opacity-0": navigatingTo.value === (currentPage.value - 1) * perPage + i + 1 })}">${ssrInterpolate((currentPage.value - 1) * perPage + i + 1)}</span>`);
        if (navigatingTo.value === (currentPage.value - 1) * perPage + i + 1) {
          _push(`<svg class="animate-spin w-3 h-3 absolute inset-0 m-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div><div class="flex justify-between items-center mt-4 text-sm"><button${ssrIncludeBooleanAttr(currentPage.value === 1 || isNavigating.value) ? " disabled" : ""} class="px-3 py-2 rounded border dark:hover:bg-gray-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"> ← Prev </button><span class="text-gray-500 dark:text-gray-400">${ssrInterpolate(currentPage.value)} / ${ssrInterpolate(totalPages.value)}</span><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value || isNavigating.value) ? " disabled" : ""} class="px-3 py-2 rounded border dark:hover:bg-gray-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"> Next → </button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Ujian/Kerjakan.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
