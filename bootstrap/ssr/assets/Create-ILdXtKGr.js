import { watch, ref, computed, withCtx, unref, createVNode, withModifiers, createTextVNode, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, vModelSelect, Transition, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { useForm, router } from "@inertiajs/vue3";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import { QuillEditor } from "@vueup/vue-quill";
/* empty css                        */
import { PencilSquareIcon, ArrowPathIcon, PaperAirplaneIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
import "sweetalert2";
import "ziggy-js";
const PER_PAGE = 5;
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    kelas: { type: Array, default: () => [] },
    myPesan: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const { success, error } = ToastAlert();
    const form = useForm({
      judul: "",
      isi: "",
      penerima: "semua",
      kelas_id: null
    });
    watch(() => form.penerima, (val) => {
      if (val !== "siswa") form.kelas_id = null;
    });
    const submit = () => {
      form.post(route("pesan.store"), {
        preserveScroll: true,
        onSuccess: () => {
          form.reset();
          success("Pesan berhasil dikirim!");
        },
        onError: () => error("Gagal mengirim pesan. Periksa kembali isian form.")
      });
    };
    const localPesan = ref([...props.myPesan]);
    watch(() => props.myPesan, (val) => {
      localPesan.value = [...val ?? []];
    });
    const currentPage = ref(1);
    const totalPages = computed(
      () => Math.max(1, Math.ceil(localPesan.value.length / PER_PAGE))
    );
    const paginated = computed(() => {
      const start = (currentPage.value - 1) * PER_PAGE;
      return localPesan.value.slice(start, start + PER_PAGE);
    });
    watch(totalPages, (t) => {
      if (currentPage.value > t) currentPage.value = t;
    });
    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };
    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };
    const deleting = ref(null);
    const deletePesan = (id) => {
      if (!confirm("Hapus pesan ini?")) return;
      deleting.value = id;
      router.delete(route("pesan.destroy", id), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          localPesan.value = localPesan.value.filter((p) => p.id !== id);
          success("Pesan dihapus.");
        },
        onError: () => error("Gagal menghapus pesan."),
        onFinish: () => {
          deleting.value = null;
        }
      });
    };
    const deletingAll = ref(false);
    const deleteAll = () => {
      if (!confirm("Hapus semua pesan yang Anda kirim?")) return;
      deletingAll.value = true;
      router.delete(route("pesan.deleteAll"), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          localPesan.value = [];
          currentPage.value = 1;
          success("Semua pesan dihapus.");
        },
        onError: () => error("Gagal menghapus semua pesan."),
        onFinish: () => {
          deletingAll.value = false;
        }
      });
    };
    const labelPenerima = (item) => {
      if (item.penerima === "semua") return "Semua User";
      if (item.penerima === "siswa") {
        return item.kelas ? `Siswa — Kelas ${item.kelas.kelas}` : "Siswa (Semua Kelas)";
      }
      return item.penerima.charAt(0).toUpperCase() + item.penerima.slice(1);
    };
    const formatDate = (iso) => new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto space-y-10 px-4 py-6" data-v-9340065f${_scopeId}><section class="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8" data-v-9340065f${_scopeId}><div class="flex items-center gap-3 mb-8" data-v-9340065f${_scopeId}><div class="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md" data-v-9340065f${_scopeId}>`);
            _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-6 h-6" }, null, _parent2, _scopeId));
            _push2(`</div><div data-v-9340065f${_scopeId}><h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white leading-tight" data-v-9340065f${_scopeId}> Kirim Pesan </h1><p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5" data-v-9340065f${_scopeId}> Kirim informasi atau pesan kepada role atau kelas tertentu. </p></div></div><form novalidate class="space-y-6" data-v-9340065f${_scopeId}><div data-v-9340065f${_scopeId}><label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" data-v-9340065f${_scopeId}> Judul Pesan <span class="text-red-500" data-v-9340065f${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(form).judul)} type="text" maxlength="255" placeholder="Masukkan judul pesan..." class="${ssrRenderClass([
              "w-full rounded-xl px-4 py-3 transition",
              "bg-white dark:bg-[#0F172A]",
              "text-gray-800 dark:text-gray-100",
              "placeholder-gray-400 dark:placeholder-gray-600",
              "focus:outline-none focus:ring-2 focus:border-transparent",
              unref(form).errors.judul ? "border border-red-500 focus:ring-red-400" : "border border-gray-300 dark:border-white/10 focus:ring-indigo-500"
            ])}" data-v-9340065f${_scopeId}>`);
            if (unref(form).errors.judul) {
              _push2(`<p class="mt-1 text-xs text-red-500" data-v-9340065f${_scopeId}>${ssrInterpolate(unref(form).errors.judul)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-9340065f${_scopeId}><label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" data-v-9340065f${_scopeId}> Isi Pesan <span class="text-red-500" data-v-9340065f${_scopeId}>*</span></label><div class="${ssrRenderClass([unref(form).errors.isi ? "border-red-500" : "border-gray-300 dark:border-white/10", "rounded-xl overflow-hidden border shadow-sm"])}" data-v-9340065f${_scopeId}>`);
            _push2(ssrRenderComponent(unref(QuillEditor), {
              content: unref(form).isi,
              "onUpdate:content": ($event) => unref(form).isi = $event,
              "content-type": "html",
              theme: "snow",
              placeholder: "Tulis pesan di sini...",
              class: "pesan-editor",
              toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["clean"]
              ]
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex justify-end border-t border-gray-200 dark:border-white/10 px-3 py-1.5 bg-white dark:bg-[#0F172A]" data-v-9340065f${_scopeId}><span class="text-xs text-gray-400 dark:text-gray-500" data-v-9340065f${_scopeId}> Powered by <strong class="text-gray-600 dark:text-gray-300" data-v-9340065f${_scopeId}>Lumiverse</strong></span></div></div>`);
            if (unref(form).errors.isi) {
              _push2(`<p class="mt-1 text-xs text-red-500" data-v-9340065f${_scopeId}>${ssrInterpolate(unref(form).errors.isi)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-9340065f${_scopeId}><label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" data-v-9340065f${_scopeId}> Penerima <span class="text-red-500" data-v-9340065f${_scopeId}>*</span></label><select class="w-full rounded-xl px-4 py-3 transition bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-white/10 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" data-v-9340065f${_scopeId}><option value="semua" data-v-9340065f${ssrIncludeBooleanAttr(Array.isArray(unref(form).penerima) ? ssrLooseContain(unref(form).penerima, "semua") : ssrLooseEqual(unref(form).penerima, "semua")) ? " selected" : ""}${_scopeId}>Semua Pengguna</option><option value="admin" data-v-9340065f${ssrIncludeBooleanAttr(Array.isArray(unref(form).penerima) ? ssrLooseContain(unref(form).penerima, "admin") : ssrLooseEqual(unref(form).penerima, "admin")) ? " selected" : ""}${_scopeId}>Admin</option><option value="guru" data-v-9340065f${ssrIncludeBooleanAttr(Array.isArray(unref(form).penerima) ? ssrLooseContain(unref(form).penerima, "guru") : ssrLooseEqual(unref(form).penerima, "guru")) ? " selected" : ""}${_scopeId}>Guru</option><option value="proktor" data-v-9340065f${ssrIncludeBooleanAttr(Array.isArray(unref(form).penerima) ? ssrLooseContain(unref(form).penerima, "proktor") : ssrLooseEqual(unref(form).penerima, "proktor")) ? " selected" : ""}${_scopeId}>Proktor</option><option value="siswa" data-v-9340065f${ssrIncludeBooleanAttr(Array.isArray(unref(form).penerima) ? ssrLooseContain(unref(form).penerima, "siswa") : ssrLooseEqual(unref(form).penerima, "siswa")) ? " selected" : ""}${_scopeId}>Siswa</option></select>`);
            if (unref(form).errors.penerima) {
              _push2(`<p class="mt-1 text-xs text-red-500" data-v-9340065f${_scopeId}>${ssrInterpolate(unref(form).errors.penerima)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(form).penerima === "siswa") {
              _push2(`<div data-v-9340065f${_scopeId}><label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" data-v-9340065f${_scopeId}> Filter Kelas </label><select class="w-full rounded-xl px-4 py-3 transition bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-white/10 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" data-v-9340065f${_scopeId}><option${ssrRenderAttr("value", null)} data-v-9340065f${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, null) : ssrLooseEqual(unref(form).kelas_id, null)) ? " selected" : ""}${_scopeId}>— Semua Kelas —</option>`);
              if (__props.kelas && __props.kelas.length > 0) {
                _push2(`<!--[-->`);
                ssrRenderList(__props.kelas, (k) => {
                  _push2(`<option${ssrRenderAttr("value", k.id)} data-v-9340065f${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, k.id) : ssrLooseEqual(unref(form).kelas_id, k.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k.kelas)}</option>`);
                });
                _push2(`<!--]-->`);
              } else {
                _push2(`<option disabled value="" data-v-9340065f${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, "") : ssrLooseEqual(unref(form).kelas_id, "")) ? " selected" : ""}${_scopeId}> (Tidak ada data kelas) </option>`);
              }
              _push2(`</select><p class="mt-1 text-xs text-gray-400 dark:text-gray-500" data-v-9340065f${_scopeId}> * Biarkan &quot;Semua Kelas&quot; untuk broadcast ke seluruh kelas </p>`);
              if (unref(form).errors.kelas_id) {
                _push2(`<p class="mt-1 text-xs text-red-500" data-v-9340065f${_scopeId}>${ssrInterpolate(unref(form).errors.kelas_id)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-end gap-3 pt-2" data-v-9340065f${_scopeId}><button type="button"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 transition disabled:opacity-50" data-v-9340065f${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Reset </button><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition disabled:opacity-60" data-v-9340065f${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" data-v-9340065f${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-9340065f${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" data-v-9340065f${_scopeId}></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(PaperAirplaneIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            }
            _push2(` ${ssrInterpolate(unref(form).processing ? "Mengirim..." : "Kirim Pesan")}</button></div></form></section><section class="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8" data-v-9340065f${_scopeId}><div class="flex items-center justify-between mb-6" data-v-9340065f${_scopeId}><h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2" data-v-9340065f${_scopeId}> 📤 Pesan Terkirim <span class="text-sm font-normal text-gray-400 dark:text-gray-500" data-v-9340065f${_scopeId}> (${ssrInterpolate(localPesan.value.length)}) </span></h2>`);
            if (localPesan.value.length > 0) {
              _push2(`<button${ssrIncludeBooleanAttr(deletingAll.value) ? " disabled" : ""} class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60" data-v-9340065f${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(deletingAll.value ? "Menghapus..." : "Hapus Semua")}</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (localPesan.value.length === 0) {
              _push2(`<div class="py-14 text-center text-gray-400 dark:text-gray-500 italic text-sm" data-v-9340065f${_scopeId}> Belum ada pesan yang dikirim. </div>`);
            } else {
              _push2(`<ul class="space-y-4" data-v-9340065f${_scopeId}><!--[-->`);
              ssrRenderList(paginated.value, (item) => {
                _push2(`<li class="rounded-xl p-5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition" data-v-9340065f${_scopeId}><div class="flex justify-between gap-4" data-v-9340065f${_scopeId}><div class="flex-1 min-w-0" data-v-9340065f${_scopeId}><span class="inline-block mb-2 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" data-v-9340065f${_scopeId}> Ke: ${ssrInterpolate(labelPenerima(item))}</span><h3 class="font-bold text-base text-gray-800 dark:text-white truncate" data-v-9340065f${_scopeId}>${ssrInterpolate(item.judul)}</h3><div class="prose prose-sm dark:prose-invert max-w-none mt-1.5 text-sm pesan-preview" data-v-9340065f${_scopeId}>${item.isi ?? ""}</div><p class="mt-2 text-xs text-gray-400 dark:text-gray-500" data-v-9340065f${_scopeId}>${ssrInterpolate(formatDate(item.created_at))}</p></div><button${ssrIncludeBooleanAttr(deleting.value === item.id) ? " disabled" : ""} class="shrink-0 text-gray-400 hover:text-red-500 transition disabled:opacity-40 self-start mt-1" title="Hapus pesan" data-v-9340065f${_scopeId}>`);
                _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                _push2(`</button></div></li>`);
              });
              _push2(`<!--]--></ul>`);
            }
            if (totalPages.value > 1) {
              _push2(`<div class="flex justify-center items-center gap-3 mt-6" data-v-9340065f${_scopeId}><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="p-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition disabled:opacity-40" data-v-9340065f${_scopeId}>`);
              _push2(ssrRenderComponent(unref(ChevronLeftIcon), { class: "w-5 h-5 text-gray-600 dark:text-gray-300" }, null, _parent2, _scopeId));
              _push2(`</button><span class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-sm font-medium text-gray-700 dark:text-gray-300" data-v-9340065f${_scopeId}>${ssrInterpolate(currentPage.value)} / ${ssrInterpolate(totalPages.value)}</span><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="p-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition disabled:opacity-40" data-v-9340065f${_scopeId}>`);
              _push2(ssrRenderComponent(unref(ChevronRightIcon), { class: "w-5 h-5 text-gray-600 dark:text-gray-300" }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto space-y-10 px-4 py-6" }, [
                createVNode("section", { class: "rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8" }, [
                  createVNode("div", { class: "flex items-center gap-3 mb-8" }, [
                    createVNode("div", { class: "p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md" }, [
                      createVNode(unref(PencilSquareIcon), { class: "w-6 h-6" })
                    ]),
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-xl sm:text-2xl font-bold text-gray-800 dark:text-white leading-tight" }, " Kirim Pesan "),
                      createVNode("p", { class: "text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5" }, " Kirim informasi atau pesan kepada role atau kelas tertentu. ")
                    ])
                  ]),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    novalidate: "",
                    class: "space-y-6"
                  }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" }, [
                        createTextVNode(" Judul Pesan "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).judul = $event,
                        type: "text",
                        maxlength: "255",
                        placeholder: "Masukkan judul pesan...",
                        class: [
                          "w-full rounded-xl px-4 py-3 transition",
                          "bg-white dark:bg-[#0F172A]",
                          "text-gray-800 dark:text-gray-100",
                          "placeholder-gray-400 dark:placeholder-gray-600",
                          "focus:outline-none focus:ring-2 focus:border-transparent",
                          unref(form).errors.judul ? "border border-red-500 focus:ring-red-400" : "border border-gray-300 dark:border-white/10 focus:ring-indigo-500"
                        ]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).judul]
                      ]),
                      unref(form).errors.judul ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-xs text-red-500"
                      }, toDisplayString(unref(form).errors.judul), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" }, [
                        createTextVNode(" Isi Pesan "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      createVNode("div", {
                        class: ["rounded-xl overflow-hidden border shadow-sm", unref(form).errors.isi ? "border-red-500" : "border-gray-300 dark:border-white/10"]
                      }, [
                        createVNode(unref(QuillEditor), {
                          content: unref(form).isi,
                          "onUpdate:content": ($event) => unref(form).isi = $event,
                          "content-type": "html",
                          theme: "snow",
                          placeholder: "Tulis pesan di sini...",
                          class: "pesan-editor",
                          toolbar: [
                            ["bold", "italic", "underline"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ align: [] }],
                            ["clean"]
                          ]
                        }, null, 8, ["content", "onUpdate:content"]),
                        createVNode("div", { class: "flex justify-end border-t border-gray-200 dark:border-white/10 px-3 py-1.5 bg-white dark:bg-[#0F172A]" }, [
                          createVNode("span", { class: "text-xs text-gray-400 dark:text-gray-500" }, [
                            createTextVNode(" Powered by "),
                            createVNode("strong", { class: "text-gray-600 dark:text-gray-300" }, "Lumiverse")
                          ])
                        ])
                      ], 2),
                      unref(form).errors.isi ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-xs text-red-500"
                      }, toDisplayString(unref(form).errors.isi), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" }, [
                        createTextVNode(" Penerima "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).penerima = $event,
                        class: "w-full rounded-xl px-4 py-3 transition bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-white/10 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      }, [
                        createVNode("option", { value: "semua" }, "Semua Pengguna"),
                        createVNode("option", { value: "admin" }, "Admin"),
                        createVNode("option", { value: "guru" }, "Guru"),
                        createVNode("option", { value: "proktor" }, "Proktor"),
                        createVNode("option", { value: "siswa" }, "Siswa")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).penerima]
                      ]),
                      unref(form).errors.penerima ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-xs text-red-500"
                      }, toDisplayString(unref(form).errors.penerima), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode(Transition, { name: "slide-fade" }, {
                      default: withCtx(() => [
                        unref(form).penerima === "siswa" ? (openBlock(), createBlock("div", { key: "kelas-field" }, [
                          createVNode("label", { class: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" }, " Filter Kelas "),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => unref(form).kelas_id = $event,
                            class: "w-full rounded-xl px-4 py-3 transition bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-white/10 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          }, [
                            createVNode("option", { value: null }, "— Semua Kelas —"),
                            __props.kelas && __props.kelas.length > 0 ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(__props.kelas, (k) => {
                              return openBlock(), createBlock("option", {
                                key: k.id,
                                value: k.id
                              }, toDisplayString(k.kelas), 9, ["value"]);
                            }), 128)) : (openBlock(), createBlock("option", {
                              key: 1,
                              disabled: "",
                              value: ""
                            }, " (Tidak ada data kelas) "))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).kelas_id]
                          ]),
                          createVNode("p", { class: "mt-1 text-xs text-gray-400 dark:text-gray-500" }, ' * Biarkan "Semua Kelas" untuk broadcast ke seluruh kelas '),
                          unref(form).errors.kelas_id ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "mt-1 text-xs text-red-500"
                          }, toDisplayString(unref(form).errors.kelas_id), 1)) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [
                      createVNode("button", {
                        type: "button",
                        onClick: ($event) => unref(form).reset(),
                        disabled: unref(form).processing,
                        class: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 transition disabled:opacity-50"
                      }, [
                        createVNode(unref(ArrowPathIcon), { class: "w-4 h-4" }),
                        createTextVNode(" Reset ")
                      ], 8, ["onClick", "disabled"]),
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition disabled:opacity-60"
                      }, [
                        unref(form).processing ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "animate-spin w-4 h-4",
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
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          })
                        ])) : (openBlock(), createBlock(unref(PaperAirplaneIcon), {
                          key: 1,
                          class: "w-4 h-4"
                        })),
                        createTextVNode(" " + toDisplayString(unref(form).processing ? "Mengirim..." : "Kirim Pesan"), 1)
                      ], 8, ["disabled"])
                    ])
                  ], 32)
                ]),
                createVNode("section", { class: "rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8" }, [
                  createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                    createVNode("h2", { class: "text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2" }, [
                      createTextVNode(" 📤 Pesan Terkirim "),
                      createVNode("span", { class: "text-sm font-normal text-gray-400 dark:text-gray-500" }, " (" + toDisplayString(localPesan.value.length) + ") ", 1)
                    ]),
                    localPesan.value.length > 0 ? (openBlock(), createBlock("button", {
                      key: 0,
                      onClick: deleteAll,
                      disabled: deletingAll.value,
                      class: "hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60"
                    }, [
                      createVNode(unref(TrashIcon), { class: "w-4 h-4" }),
                      createTextVNode(" " + toDisplayString(deletingAll.value ? "Menghapus..." : "Hapus Semua"), 1)
                    ], 8, ["disabled"])) : createCommentVNode("", true)
                  ]),
                  localPesan.value.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "py-14 text-center text-gray-400 dark:text-gray-500 italic text-sm"
                  }, " Belum ada pesan yang dikirim. ")) : (openBlock(), createBlock("ul", {
                    key: 1,
                    class: "space-y-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(paginated.value, (item) => {
                      return openBlock(), createBlock("li", {
                        key: item.id,
                        class: "rounded-xl p-5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition"
                      }, [
                        createVNode("div", { class: "flex justify-between gap-4" }, [
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("span", { class: "inline-block mb-2 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" }, " Ke: " + toDisplayString(labelPenerima(item)), 1),
                            createVNode("h3", { class: "font-bold text-base text-gray-800 dark:text-white truncate" }, toDisplayString(item.judul), 1),
                            createVNode("div", {
                              class: "prose prose-sm dark:prose-invert max-w-none mt-1.5 text-sm pesan-preview",
                              innerHTML: item.isi
                            }, null, 8, ["innerHTML"]),
                            createVNode("p", { class: "mt-2 text-xs text-gray-400 dark:text-gray-500" }, toDisplayString(formatDate(item.created_at)), 1)
                          ]),
                          createVNode("button", {
                            onClick: ($event) => deletePesan(item.id),
                            disabled: deleting.value === item.id,
                            class: "shrink-0 text-gray-400 hover:text-red-500 transition disabled:opacity-40 self-start mt-1",
                            title: "Hapus pesan"
                          }, [
                            createVNode(unref(TrashIcon), { class: "w-5 h-5" })
                          ], 8, ["onClick", "disabled"])
                        ])
                      ]);
                    }), 128))
                  ])),
                  totalPages.value > 1 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "flex justify-center items-center gap-3 mt-6"
                  }, [
                    createVNode("button", {
                      onClick: prevPage,
                      disabled: currentPage.value === 1,
                      class: "p-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition disabled:opacity-40"
                    }, [
                      createVNode(unref(ChevronLeftIcon), { class: "w-5 h-5 text-gray-600 dark:text-gray-300" })
                    ], 8, ["disabled"]),
                    createVNode("span", { class: "px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-sm font-medium text-gray-700 dark:text-gray-300" }, toDisplayString(currentPage.value) + " / " + toDisplayString(totalPages.value), 1),
                    createVNode("button", {
                      onClick: nextPage,
                      disabled: currentPage.value === totalPages.value,
                      class: "p-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition disabled:opacity-40"
                    }, [
                      createVNode(unref(ChevronRightIcon), { class: "w-5 h-5 text-gray-600 dark:text-gray-300" })
                    ], 8, ["disabled"])
                  ])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Pesan/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9340065f"]]);
export {
  Create as default
};
