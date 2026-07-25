import { reactive, unref, withCtx, openBlock, createBlock, createVNode, createCommentVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1, a as _sfc_main$2, b as _sfc_main$3 } from "./TextInput-A0-GkXWF.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { useForm } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "UpdateStudentDataForm",
  __ssrInlineRender: true,
  props: {
    siswa: { type: Object, required: true },
    kelas: { type: Array, required: true },
    kejuruan: { type: Array, required: true },
    isSmk: { type: Boolean, default: false },
    status: { type: String, default: null }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      nama_lengkap: props.siswa.nama_lengkap ?? "",
      nis: props.siswa.nis ?? "",
      nisn: props.siswa.nisn ?? "",
      kelas_id: props.siswa.kelas_id ?? "",
      kejuruan_id: props.siswa.kejuruan_id ?? ""
    });
    const local = reactive({ nama_lengkap: "", nis: "", nisn: "", kejuruan_id: "" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><header><h2 class="text-lg font-medium text-gray-900 dark:text-white">Data Induk Siswa</h2><p class="mt-1 text-sm text-gray-600 dark:text-gray-400"> Mohon perhatikan data pelajar anda dengan baik dan teliti, karena ini akan digunakan untuk data raport dan data sekolah lainnya! </p></header><form class="mt-6 space-y-6"><div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        for: "nama_lengkap",
        value: "Full Name",
        class: "dark:text-gray-300"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        id: "nama_lengkap",
        type: "text",
        modelValue: unref(form).nama_lengkap,
        "onUpdate:modelValue": ($event) => unref(form).nama_lengkap = $event,
        required: "",
        autocomplete: "off",
        class: "mt-1 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:placeholder-gray-500"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        class: "mt-2",
        message: local.nama_lengkap || unref(form).errors.nama_lengkap
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        for: "nis",
        value: "NIS",
        class: "dark:text-gray-300"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        id: "nis",
        type: "text",
        modelValue: unref(form).nis,
        "onUpdate:modelValue": ($event) => unref(form).nis = $event,
        autocomplete: "off",
        class: "mt-1 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      }, null, _parent));
      _push(`<p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Minimum 7 characters (optional)</p>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        class: "mt-1",
        message: local.nis || unref(form).errors.nis
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        for: "nisn",
        value: "NISN",
        class: "dark:text-gray-300"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        id: "nisn",
        type: "text",
        modelValue: unref(form).nisn,
        "onUpdate:modelValue": ($event) => unref(form).nisn = $event,
        maxlength: "10",
        inputmode: "numeric",
        autocomplete: "off",
        onInput: ($event) => unref(form).nisn = unref(form).nisn.replace(/\D/g, ""),
        class: "mt-1 block w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      }, null, _parent));
      _push(`<p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Exactly 10 digits (optional)</p>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        class: "mt-1",
        message: local.nisn || unref(form).errors.nisn
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        for: "kelas_id",
        value: "Class",
        class: "dark:text-gray-300"
      }, null, _parent));
      _push(`<select id="kelas_id" required class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"><option value="" disabled class="dark:bg-gray-800"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, "") : ssrLooseEqual(unref(form).kelas_id, "")) ? " selected" : ""}>Select class</option><!--[-->`);
      ssrRenderList(__props.kelas, (k) => {
        _push(`<option${ssrRenderAttr("value", k.id)} class="dark:bg-gray-800"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, k.id) : ssrLooseEqual(unref(form).kelas_id, k.id)) ? " selected" : ""}>${ssrInterpolate(k.kelas)}</option>`);
      });
      _push(`<!--]--></select>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        class: "mt-2",
        message: unref(form).errors.kelas_id
      }, null, _parent));
      _push(`</div>`);
      if (__props.isSmk) {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          for: "kejuruan_id",
          value: "Major",
          class: "dark:text-gray-300"
        }, null, _parent));
        _push(`<select id="kejuruan_id" required class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"><option value="" disabled class="dark:bg-gray-800"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kejuruan_id) ? ssrLooseContain(unref(form).kejuruan_id, "") : ssrLooseEqual(unref(form).kejuruan_id, "")) ? " selected" : ""}>Select major</option><!--[-->`);
        ssrRenderList(__props.kejuruan, (k) => {
          _push(`<option${ssrRenderAttr("value", k.id)} class="dark:bg-gray-800"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kejuruan_id) ? ssrLooseContain(unref(form).kejuruan_id, k.id) : ssrLooseEqual(unref(form).kejuruan_id, k.id)) ? " selected" : ""}>${ssrInterpolate(k.kejuruan)}</option>`);
        });
        _push(`<!--]--></select>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          class: "mt-2",
          message: local.kejuruan_id || unref(form).errors.kejuruan_id
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(PrimaryButton, {
        disabled: unref(form).processing,
        class: "flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(form).processing) {
              _push2(`<svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(form).processing ? "Saving..." : "Save")}`);
          } else {
            return [
              unref(form).processing ? (openBlock(), createBlock("svg", {
                key: 0,
                class: "animate-spin w-4 h-4 text-white",
                xmlns: "http://www.w3.org/2000/svg",
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
              ])) : createCommentVNode("", true),
              createTextVNode(" " + toDisplayString(unref(form).processing ? "Saving..." : "Save"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.status === "student-data-updated") {
        _push(`<p class="text-sm text-gray-600 dark:text-gray-400"> Saved. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/UpdateStudentDataForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
