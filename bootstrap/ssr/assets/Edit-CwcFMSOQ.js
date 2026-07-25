import { unref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import _sfc_main$5 from "./DeleteUserForm-CpA0CpcD.js";
import _sfc_main$4 from "./UpdatePasswordForm-BWQ2Sg0D.js";
import _sfc_main$2 from "./UpdateProfileInformationForm-Bq9iGmxe.js";
import _sfc_main$3 from "./UpdateStudentDataForm-DlxKf6pd.js";
import { usePage, Head } from "@inertiajs/vue3";
import "./Sidebar-COsy3wF2.js";
import "sweetalert2";
import "ziggy-js";
import "@heroicons/vue/24/outline";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./TextInput-A0-GkXWF.js";
import "./PrimaryButton-CIooT64n.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: {
      type: Boolean
    },
    status: {
      type: String
    },
    // Dikirim dari controller jika role === 'siswa', null jika bukan
    siswa: {
      type: Object,
      default: null
    },
    kelas: {
      type: Array,
      default: null
    },
    kejuruan: {
      type: Array,
      default: null
    },
    isSmk: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const page = usePage();
    const isStudent = page.props.auth.user.role === "siswa";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Profile" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-1"${_scopeId}><h2 class="text-2xl font-bold text-gray-800 dark:text-white"${_scopeId}> Account Profile </h2><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}> Manage your personal information &amp; security </p></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col gap-1" }, [
                createVNode("h2", { class: "text-2xl font-bold text-gray-800 dark:text-white" }, " Account Profile "),
                createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, " Manage your personal information & security ")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-6"${_scopeId}><div class="max-w-6xl mx-auto space-y-8"${_scopeId}><section class="relative p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl"${_scopeId}><h3 class="mb-6 text-lg font-semibold text-gray-800 dark:text-white"${_scopeId}> 👤 Profile Information </h3>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              "must-verify-email": __props.mustVerifyEmail,
              status: __props.status,
              class: "max-w-xl"
            }, null, _parent2, _scopeId));
            _push2(`</section>`);
            if (isStudent && __props.siswa) {
              _push2(`<section class="relative p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl"${_scopeId}><h3 class="mb-6 text-lg font-semibold text-gray-800 dark:text-white"${_scopeId}> 🎓 Student Data </h3>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                siswa: __props.siswa,
                kelas: __props.kelas,
                kejuruan: __props.kejuruan,
                "is-smk": __props.isSmk,
                status: __props.status,
                class: "max-w-xl"
              }, null, _parent2, _scopeId));
              _push2(`</section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section class="relative p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl"${_scopeId}><h3 class="mb-6 text-lg font-semibold text-gray-800 dark:text-white"${_scopeId}> 🔐 Security &amp; Password </h3>`);
            _push2(ssrRenderComponent(_sfc_main$4, { class: "max-w-xl" }, null, _parent2, _scopeId));
            _push2(`</section><section class="relative p-6 sm:p-8 rounded-3xl bg-red-50/70 dark:bg-red-500/5 backdrop-blur-xl border border-red-200/50 dark:border-red-500/20 shadow-xl"${_scopeId}><h3 class="mb-6 text-lg font-semibold text-red-600 dark:text-red-400"${_scopeId}> ⚠️ Danger Zone </h3>`);
            _push2(ssrRenderComponent(_sfc_main$5, { class: "max-w-xl" }, null, _parent2, _scopeId));
            _push2(`</section></div></div>`);
          } else {
            return [
              createVNode("div", { class: "py-6" }, [
                createVNode("div", { class: "max-w-6xl mx-auto space-y-8" }, [
                  createVNode("section", { class: "relative p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl" }, [
                    createVNode("h3", { class: "mb-6 text-lg font-semibold text-gray-800 dark:text-white" }, " 👤 Profile Information "),
                    createVNode(_sfc_main$2, {
                      "must-verify-email": __props.mustVerifyEmail,
                      status: __props.status,
                      class: "max-w-xl"
                    }, null, 8, ["must-verify-email", "status"])
                  ]),
                  isStudent && __props.siswa ? (openBlock(), createBlock("section", {
                    key: 0,
                    class: "relative p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl"
                  }, [
                    createVNode("h3", { class: "mb-6 text-lg font-semibold text-gray-800 dark:text-white" }, " 🎓 Student Data "),
                    createVNode(_sfc_main$3, {
                      siswa: __props.siswa,
                      kelas: __props.kelas,
                      kejuruan: __props.kejuruan,
                      "is-smk": __props.isSmk,
                      status: __props.status,
                      class: "max-w-xl"
                    }, null, 8, ["siswa", "kelas", "kejuruan", "is-smk", "status"])
                  ])) : createCommentVNode("", true),
                  createVNode("section", { class: "relative p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl" }, [
                    createVNode("h3", { class: "mb-6 text-lg font-semibold text-gray-800 dark:text-white" }, " 🔐 Security & Password "),
                    createVNode(_sfc_main$4, { class: "max-w-xl" })
                  ]),
                  createVNode("section", { class: "relative p-6 sm:p-8 rounded-3xl bg-red-50/70 dark:bg-red-500/5 backdrop-blur-xl border border-red-200/50 dark:border-red-500/20 shadow-xl" }, [
                    createVNode("h3", { class: "mb-6 text-lg font-semibold text-red-600 dark:text-red-400" }, " ⚠️ Danger Zone "),
                    createVNode(_sfc_main$5, { class: "max-w-xl" })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
