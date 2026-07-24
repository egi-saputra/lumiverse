import { ref, watch, computed, onMounted, withCtx, unref, createTextVNode, createVNode, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import { usePage, Link, router } from "@inertiajs/vue3";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/solid";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import axios from "axios";
import "ziggy-js";
import "sweetalert2";
import "@vueuse/core";
const perPage = 25;
const MAX_VISIBLE_PAGES = 7;
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    const { success, error, confirm } = ToastAlert();
    const page = usePage();
    const pesertaData = ref([...page.props.pesertaAll]);
    watch(
      () => page.props.pesertaAll,
      (newVal) => {
        pesertaData.value = [...newVal];
      }
    );
    const kelasAll = ref([...page.props.kelasList]);
    const filterNama = ref("");
    const filterKelas = ref("");
    const editing = ref(false);
    const editForm = ref({
      id: null,
      nama_lengkap: "",
      kelas_id: "",
      status: "",
      email: "",
      password: ""
    });
    const kelasForEdit = computed(() => {
      return kelasAll.value;
    });
    const refreshData = () => {
      filterNama.value = "";
      filterKelas.value = "";
      currentPage.value = 1;
    };
    const currentPage = ref(1);
    const filteredPeserta = computed(() => {
      return pesertaData.value.filter((p) => {
        const byNama = p.nama.toLowerCase().includes(filterNama.value.toLowerCase());
        const byKelas = filterKelas.value ? p.kelas_id == filterKelas.value : true;
        return byNama && byKelas;
      });
    });
    const paginatedPeserta = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filteredPeserta.value.slice(start, start + perPage).map((p) => ({
        ...p,
        displayStatus: p.status === "Activated" ? "Active" : "Inactive"
      }));
    });
    const totalPages = computed(() => Math.ceil(filteredPeserta.value.length / perPage));
    const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      if (total <= MAX_VISIBLE_PAGES) return Array.from({ length: total }, (_, i) => i + 1);
      const half = Math.floor(MAX_VISIBLE_PAGES / 2);
      let start = current - half;
      let end = current + half - 1;
      if (start < 1) {
        start = 1;
        end = MAX_VISIBLE_PAGES;
      }
      if (end > total) {
        end = total;
        start = total - MAX_VISIBLE_PAGES + 1;
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });
    const prevPage = () => {
      currentPage.value = Math.max(currentPage.value - 1, 1);
    };
    const nextPage = () => {
      currentPage.value = Math.min(currentPage.value + 1, totalPages.value);
    };
    watch([filterNama, filterKelas], () => {
      currentPage.value = 1;
    });
    const openEdit = (p) => {
      editing.value = true;
      editForm.value = {
        id: p.id,
        nama_lengkap: p.nama,
        kelas_id: p.kelas_id,
        status: p.status,
        email: p.email,
        password: ""
      };
    };
    const closeEdit = () => {
      editing.value = false;
    };
    const updatePeserta = async () => {
      try {
        const payload = {
          nama_lengkap: editForm.value.nama_lengkap,
          kelas_id: editForm.value.kelas_id,
          status: editForm.value.status,
          email: editForm.value.email
        };
        if (editForm.value.password?.trim() !== "") {
          payload.password = editForm.value.password;
        }
        const res = await axios.put(
          `/proktor/peserta/${editForm.value.id}`,
          payload
        );
        success(res.data.success || "Peserta berhasil diupdate");
        closeEdit();
        router.reload({
          only: ["pesertaAll"],
          preserveScroll: true
        });
      } catch (err) {
        console.log(err.response?.data);
        if (err.response?.data?.errors) {
          const errors = Object.values(err.response.data.errors).flat().join("\n");
          error(errors);
        } else {
          error(
            err.response?.data?.message || "Gagal update peserta"
          );
        }
      }
    };
    const deletePeserta = async (id) => {
      const result = await confirm({ text: "Yakin ingin menghapus peserta ini?" });
      if (!result.isConfirmed) return;
      await axios.delete(`/proktor/peserta/${id}`);
      pesertaData.value = pesertaData.value.filter((p) => p.id !== id);
      success("Peserta berhasil dihapus");
    };
    const deleteAllPeserta = () => {
      confirm({
        text: filterKelas.value ? "Yakin ingin menghapus semua peserta di kelas ini?" : "Yakin ingin menghapus semua peserta?"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete("/proktor/peserta/destroy-all", {
            data: {
              kelas_id: filterKelas.value
            }
          }).then((res) => {
            success(res.data.success);
            router.reload({
              only: ["pesertaAll"],
              preserveScroll: true
            });
          }).catch((err) => {
            error(err.response?.data?.message || "Gagal hapus peserta");
          });
        }
      });
    };
    onMounted(() => {
      const flashSuccess = page.props.flash?.success;
      if (flashSuccess) success(flashSuccess);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:mb-10 mb-4 gap-3"${_scopeId}><h1 class="text-xl md:text-2xl font-bold dark:text-white text-gray-800 w-full sm:w-auto"${_scopeId}> Daftar Peserta Didik </h1>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/proktor/peserta/register",
              class: "px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 w-full sm:w-auto text-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + Tambah Peserta `);
                } else {
                  return [
                    createTextVNode(" + Tambah Peserta ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="sm:bg-white dark:bg-white/5 sm:rounded sm:p-6 sm:shadow"${_scopeId}><div class="flex flex-col md:flex-row md:justify-between gap-3 mb-6 items-start md:items-center"${_scopeId}><div class="flex flex-col sm:flex-row gap-3 sm:mb-0 mb-6 w-full md:w-auto"${_scopeId}><input type="text"${ssrRenderAttr("value", filterNama.value)} placeholder="Cari nama..." class="border px-3 py-2 rounded-lg dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition sm:w-auto flex-1"${_scopeId}><select class="w-full rounded-lg border pr-10 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(filterKelas.value) ? ssrLooseContain(filterKelas.value, "") : ssrLooseEqual(filterKelas.value, "")) ? " selected" : ""}${_scopeId}>Semua Kelas</option><!--[-->`);
            ssrRenderList(kelasAll.value, (k) => {
              _push2(`<option${ssrRenderAttr("value", k.id)}${ssrIncludeBooleanAttr(Array.isArray(filterKelas.value) ? ssrLooseContain(filterKelas.value, k.id) : ssrLooseEqual(filterKelas.value, k.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k.kelas)}</option>`);
            });
            _push2(`<!--]--></select><button class="flex gap-2 justify-center bg-gray-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowPathIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` Refresh </button></div><button class="bg-red-700 text-white px-4 py-2 rounded-lg hidden sm:flex items-center justify-center gap-1 w-full sm:w-auto"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` Hapus Semua </button></div><table class="w-full border dark:border-gray-500 text-center hidden md:table"${_scopeId}><thead class="bg-[#063970] text-white"${_scopeId}><tr${_scopeId}><th class="p-2 border dark:border-gray-500"${_scopeId}>No</th><th class="p-2 border dark:border-gray-500"${_scopeId}>Full Name</th><th class="p-2 border dark:border-gray-500"${_scopeId}>Email Address</th><th class="p-2 border dark:border-gray-500"${_scopeId}>Class Name</th><th class="p-2 border dark:border-gray-500"${_scopeId}>Status</th><th class="p-2 border dark:border-gray-500"${_scopeId}>Actions</th></tr></thead><tbody class="text-gray-700 dark:text-gray-300"${_scopeId}><!--[-->`);
            ssrRenderList(paginatedPeserta.value, (p, i) => {
              _push2(`<tr${_scopeId}><td class="p-2 border dark:border-gray-700"${_scopeId}>${ssrInterpolate((currentPage.value - 1) * perPage + i + 1)}</td><td class="p-2 text-left border dark:border-gray-700"${_scopeId}>${ssrInterpolate(p.nama)}</td><td class="p-2 text-left border dark:border-gray-700"${_scopeId}>${ssrInterpolate(p.email)}</td><td class="p-2 border dark:border-gray-700"${_scopeId}>${ssrInterpolate(p.kelas)}</td><td class="p-2 border dark:border-gray-700"${_scopeId}><span class="${ssrRenderClass(p.status === "Activated" ? "text-green-600 font-semibold" : "text-gray-500")}"${_scopeId}>${ssrInterpolate(p.displayStatus)}</span></td><td class="p-2 border dark:border-gray-700"${_scopeId}><div class="flex justify-center gap-3"${_scopeId}><button class="p-2 bg-blue-600 text-white rounded"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(`</button><button class="p-2 bg-red-600 text-white rounded"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(`</button></div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (paginatedPeserta.value.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="7" class="p-3 dark:text-gray-300 text-gray-500"${_scopeId}>Tidak ada data peserta.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table><div class="md:hidden flex flex-col gap-4"${_scopeId}><!--[-->`);
            ssrRenderList(paginatedPeserta.value, (p, i) => {
              _push2(`<div class="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500"${_scopeId}><div class="flex justify-between items-center"${_scopeId}><div class="font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(p.nama)}</div><div class="text-sm text-gray-500 font-mono"${_scopeId}>${ssrInterpolate((currentPage.value - 1) * perPage + i + 1)}</div></div><div class="mt-2 flex flex-col gap-2 text-gray-600 text-sm"${_scopeId}><div${_scopeId}>Email: <span class="font-mono"${_scopeId}>${ssrInterpolate(p.email)}</span></div><div class="flex justify-between w-full gap 4"${_scopeId}><div class="bg-ambers-50 w-1/2 p-2 px-4 items-center text-center rounded-lg text-amber-600"${_scopeId}> Kelas: <span class="font-semibold text-amber-600"${_scopeId}>${ssrInterpolate(p.kelas)}</span></div><div class="${ssrRenderClass([p.status === "Activated" ? "text-green-600 font-semibold bg-green-50" : "text-gray-500 bg-gray-50", "w-1/2 p-2 px-4 items-center text-center rounded-lg"])}"${_scopeId}> Status: <span${_scopeId}>${ssrInterpolate(p.displayStatus)}</span></div></div></div><div class="flex gap-2 mt-3"${_scopeId}><button class="flex-1 bg-blue-600 text-white px-2 py-1 rounded flex justify-center items-center gap-1"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(PencilSquareIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Edit </button><button class="flex-1 bg-red-600 text-white px-2 py-1 rounded flex justify-center items-center gap-1"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(TrashIcon), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Hapus </button></div></div>`);
            });
            _push2(`<!--]--></div>`);
            if (editing.value) {
              _push2(`<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"${_scopeId}><div class="bg-white dark:bg-gray-900 p-6 w-[460px] rounded shadow-lg"${_scopeId}><h2 class="text-xl font-bold mb-4"${_scopeId}>Edit Peserta</h2><div class="mb-3"${_scopeId}><label class="block font-semibold"${_scopeId}>Nama Lengkap</label><input${ssrRenderAttr("value", editForm.value.nama_lengkap)} class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}></div><div class="mb-3"${_scopeId}><label class="block font-semibold"${_scopeId}>Email</label><input${ssrRenderAttr("value", editForm.value.email)} type="email" class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}></div><div class="mb-3"${_scopeId}><label class="block font-semibold"${_scopeId}>Kelas</label><select class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}><!--[-->`);
              ssrRenderList(kelasForEdit.value, (k) => {
                _push2(`<option${ssrRenderAttr("value", k.id)}${ssrIncludeBooleanAttr(Array.isArray(editForm.value.kelas_id) ? ssrLooseContain(editForm.value.kelas_id, k.id) : ssrLooseEqual(editForm.value.kelas_id, k.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k.kelas)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="mb-3"${_scopeId}><label class="block font-semibold"${_scopeId}>Password</label><input${ssrRenderAttr("value", editForm.value.password)} type="password" placeholder="Kosongkan jika tidak ingin mengubah" class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}></div><div class="mb-3"${_scopeId}><label class="block font-semibold"${_scopeId}>Status</label><select class="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"${_scopeId}><option value="Activated"${ssrIncludeBooleanAttr(Array.isArray(editForm.value.status) ? ssrLooseContain(editForm.value.status, "Activated") : ssrLooseEqual(editForm.value.status, "Activated")) ? " selected" : ""}${_scopeId}>Activated</option><option value="Deactivated"${ssrIncludeBooleanAttr(Array.isArray(editForm.value.status) ? ssrLooseContain(editForm.value.status, "Deactivated") : ssrLooseEqual(editForm.value.status, "Deactivated")) ? " selected" : ""}${_scopeId}>Deactivated</option></select></div><div class="flex justify-end gap-2 mt-4"${_scopeId}><button class="px-3 py-2 bg-gray-300 dark:bg-white/5 rounded"${_scopeId}>Batal</button><button class="px-3 py-2 bg-blue-600 text-white rounded"${_scopeId}>Simpan</button></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-center gap-2 mt-4"${_scopeId}><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="${ssrRenderClass([currentPage.value === 1 ? "bg-gray-100 dark:bg-white/5 dark:border-gray-700 text-gray-400 dark:text-gray-700 cursor-not-allowed" : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400 dark:hover:bg-white/10", "px-3 py-1 rounded border"])}"${_scopeId}> Prev </button><!--[-->`);
            ssrRenderList(visiblePages.value, (p) => {
              _push2(`<button class="${ssrRenderClass([p === currentPage.value ? "bg-blue-600 dark:border-gray-700 text-white" : "bg-gray-100 dark:bg-white/5 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700", "px-3 py-1 rounded border"])}"${_scopeId}>${ssrInterpolate(p)}</button>`);
            });
            _push2(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="${ssrRenderClass([currentPage.value === totalPages.value ? "bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:text-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-100 dark:border-gray-700 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 dark:text-gray-400 text-gray-700", "px-3 py-1 rounded border"])}"${_scopeId}> Next </button></div></div></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "flex flex-col sm:flex-row justify-between items-start sm:items-center sm:mb-10 mb-4 gap-3" }, [
                  createVNode("h1", { class: "text-xl md:text-2xl font-bold dark:text-white text-gray-800 w-full sm:w-auto" }, " Daftar Peserta Didik "),
                  createVNode(unref(Link), {
                    href: "/proktor/peserta/register",
                    class: "px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 w-full sm:w-auto text-center"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + Tambah Peserta ")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "sm:bg-white dark:bg-white/5 sm:rounded sm:p-6 sm:shadow" }, [
                  createVNode("div", { class: "flex flex-col md:flex-row md:justify-between gap-3 mb-6 items-start md:items-center" }, [
                    createVNode("div", { class: "flex flex-col sm:flex-row gap-3 sm:mb-0 mb-6 w-full md:w-auto" }, [
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => filterNama.value = $event,
                        placeholder: "Cari nama...",
                        class: "border px-3 py-2 rounded-lg dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition sm:w-auto flex-1"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, filterNama.value]
                      ]),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => filterKelas.value = $event,
                        class: "w-full rounded-lg border pr-10 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      }, [
                        createVNode("option", { value: "" }, "Semua Kelas"),
                        (openBlock(true), createBlock(Fragment, null, renderList(kelasAll.value, (k) => {
                          return openBlock(), createBlock("option", {
                            key: k.id,
                            value: k.id
                          }, toDisplayString(k.kelas), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, filterKelas.value]
                      ]),
                      createVNode("button", {
                        onClick: refreshData,
                        class: "flex gap-2 justify-center bg-gray-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                      }, [
                        createVNode(unref(ArrowPathIcon), { class: "w-5 h-5" }),
                        createTextVNode(" Refresh ")
                      ])
                    ]),
                    createVNode("button", {
                      onClick: deleteAllPeserta,
                      class: "bg-red-700 text-white px-4 py-2 rounded-lg hidden sm:flex items-center justify-center gap-1 w-full sm:w-auto"
                    }, [
                      createVNode(unref(TrashIcon), { class: "w-5 h-5" }),
                      createTextVNode(" Hapus Semua ")
                    ])
                  ]),
                  createVNode("table", { class: "w-full border dark:border-gray-500 text-center hidden md:table" }, [
                    createVNode("thead", { class: "bg-[#063970] text-white" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "p-2 border dark:border-gray-500" }, "No"),
                        createVNode("th", { class: "p-2 border dark:border-gray-500" }, "Full Name"),
                        createVNode("th", { class: "p-2 border dark:border-gray-500" }, "Email Address"),
                        createVNode("th", { class: "p-2 border dark:border-gray-500" }, "Class Name"),
                        createVNode("th", { class: "p-2 border dark:border-gray-500" }, "Status"),
                        createVNode("th", { class: "p-2 border dark:border-gray-500" }, "Actions")
                      ])
                    ]),
                    createVNode("tbody", { class: "text-gray-700 dark:text-gray-300" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(paginatedPeserta.value, (p, i) => {
                        return openBlock(), createBlock("tr", {
                          key: p.id
                        }, [
                          createVNode("td", { class: "p-2 border dark:border-gray-700" }, toDisplayString((currentPage.value - 1) * perPage + i + 1), 1),
                          createVNode("td", { class: "p-2 text-left border dark:border-gray-700" }, toDisplayString(p.nama), 1),
                          createVNode("td", { class: "p-2 text-left border dark:border-gray-700" }, toDisplayString(p.email), 1),
                          createVNode("td", { class: "p-2 border dark:border-gray-700" }, toDisplayString(p.kelas), 1),
                          createVNode("td", { class: "p-2 border dark:border-gray-700" }, [
                            createVNode("span", {
                              class: p.status === "Activated" ? "text-green-600 font-semibold" : "text-gray-500"
                            }, toDisplayString(p.displayStatus), 3)
                          ]),
                          createVNode("td", { class: "p-2 border dark:border-gray-700" }, [
                            createVNode("div", { class: "flex justify-center gap-3" }, [
                              createVNode("button", {
                                onClick: ($event) => openEdit(p),
                                class: "p-2 bg-blue-600 text-white rounded"
                              }, [
                                createVNode(unref(PencilSquareIcon), { class: "w-4 h-4" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => deletePeserta(p.id),
                                class: "p-2 bg-red-600 text-white rounded"
                              }, [
                                createVNode(unref(TrashIcon), { class: "w-4 h-4" })
                              ], 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128)),
                      paginatedPeserta.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "7",
                          class: "p-3 dark:text-gray-300 text-gray-500"
                        }, "Tidak ada data peserta.")
                      ])) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "md:hidden flex flex-col gap-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(paginatedPeserta.value, (p, i) => {
                      return openBlock(), createBlock("div", {
                        key: p.id,
                        class: "bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500"
                      }, [
                        createVNode("div", { class: "flex justify-between items-center" }, [
                          createVNode("div", { class: "font-semibold text-gray-800" }, toDisplayString(p.nama), 1),
                          createVNode("div", { class: "text-sm text-gray-500 font-mono" }, toDisplayString((currentPage.value - 1) * perPage + i + 1), 1)
                        ]),
                        createVNode("div", { class: "mt-2 flex flex-col gap-2 text-gray-600 text-sm" }, [
                          createVNode("div", null, [
                            createTextVNode("Email: "),
                            createVNode("span", { class: "font-mono" }, toDisplayString(p.email), 1)
                          ]),
                          createVNode("div", { class: "flex justify-between w-full gap 4" }, [
                            createVNode("div", { class: "bg-ambers-50 w-1/2 p-2 px-4 items-center text-center rounded-lg text-amber-600" }, [
                              createTextVNode(" Kelas: "),
                              createVNode("span", { class: "font-semibold text-amber-600" }, toDisplayString(p.kelas), 1)
                            ]),
                            createVNode("div", {
                              class: ["w-1/2 p-2 px-4 items-center text-center rounded-lg", p.status === "Activated" ? "text-green-600 font-semibold bg-green-50" : "text-gray-500 bg-gray-50"]
                            }, [
                              createTextVNode(" Status: "),
                              createVNode("span", null, toDisplayString(p.displayStatus), 1)
                            ], 2)
                          ])
                        ]),
                        createVNode("div", { class: "flex gap-2 mt-3" }, [
                          createVNode("button", {
                            onClick: ($event) => openEdit(p),
                            class: "flex-1 bg-blue-600 text-white px-2 py-1 rounded flex justify-center items-center gap-1"
                          }, [
                            createVNode(unref(PencilSquareIcon), { class: "w-4 h-4" }),
                            createTextVNode(" Edit ")
                          ], 8, ["onClick"]),
                          createVNode("button", {
                            onClick: ($event) => deletePeserta(p.id),
                            class: "flex-1 bg-red-600 text-white px-2 py-1 rounded flex justify-center items-center gap-1"
                          }, [
                            createVNode(unref(TrashIcon), { class: "w-4 h-4" }),
                            createTextVNode(" Hapus ")
                          ], 8, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ]),
                  editing.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                  }, [
                    createVNode("div", { class: "bg-white dark:bg-gray-900 p-6 w-[460px] rounded shadow-lg" }, [
                      createVNode("h2", { class: "text-xl font-bold mb-4" }, "Edit Peserta"),
                      createVNode("div", { class: "mb-3" }, [
                        createVNode("label", { class: "block font-semibold" }, "Nama Lengkap"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => editForm.value.nama_lengkap = $event,
                          class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, editForm.value.nama_lengkap]
                        ])
                      ]),
                      createVNode("div", { class: "mb-3" }, [
                        createVNode("label", { class: "block font-semibold" }, "Email"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => editForm.value.email = $event,
                          type: "email",
                          class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, editForm.value.email]
                        ])
                      ]),
                      createVNode("div", { class: "mb-3" }, [
                        createVNode("label", { class: "block font-semibold" }, "Kelas"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => editForm.value.kelas_id = $event,
                          class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(kelasForEdit.value, (k) => {
                            return openBlock(), createBlock("option", {
                              key: k.id,
                              value: k.id
                            }, toDisplayString(k.kelas), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, editForm.value.kelas_id]
                        ])
                      ]),
                      createVNode("div", { class: "mb-3" }, [
                        createVNode("label", { class: "block font-semibold" }, "Password"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => editForm.value.password = $event,
                          type: "password",
                          placeholder: "Kosongkan jika tidak ingin mengubah",
                          class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, editForm.value.password]
                        ])
                      ]),
                      createVNode("div", { class: "mb-3" }, [
                        createVNode("label", { class: "block font-semibold" }, "Status"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => editForm.value.status = $event,
                          class: "px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 w-full text-gray-800 dark:text-white backdrop-blur-md focus:outline-none rounded-lg focus:ring-2 focus:ring-[#063970] transition"
                        }, [
                          createVNode("option", { value: "Activated" }, "Activated"),
                          createVNode("option", { value: "Deactivated" }, "Deactivated")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, editForm.value.status]
                        ])
                      ]),
                      createVNode("div", { class: "flex justify-end gap-2 mt-4" }, [
                        createVNode("button", {
                          onClick: closeEdit,
                          class: "px-3 py-2 bg-gray-300 dark:bg-white/5 rounded"
                        }, "Batal"),
                        createVNode("button", {
                          onClick: updatePeserta,
                          class: "px-3 py-2 bg-blue-600 text-white rounded"
                        }, "Simpan")
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex justify-center gap-2 mt-4" }, [
                    createVNode("button", {
                      onClick: prevPage,
                      disabled: currentPage.value === 1,
                      class: ["px-3 py-1 rounded border", currentPage.value === 1 ? "bg-gray-100 dark:bg-white/5 dark:border-gray-700 text-gray-400 dark:text-gray-700 cursor-not-allowed" : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400 dark:hover:bg-white/10"]
                    }, " Prev ", 10, ["disabled"]),
                    (openBlock(true), createBlock(Fragment, null, renderList(visiblePages.value, (p) => {
                      return openBlock(), createBlock("button", {
                        key: p,
                        onClick: ($event) => currentPage.value = p,
                        class: ["px-3 py-1 rounded border", p === currentPage.value ? "bg-blue-600 dark:border-gray-700 text-white" : "bg-gray-100 dark:bg-white/5 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700"]
                      }, toDisplayString(p), 11, ["onClick"]);
                    }), 128)),
                    createVNode("button", {
                      onClick: nextPage,
                      disabled: currentPage.value === totalPages.value,
                      class: ["px-3 py-1 rounded border", currentPage.value === totalPages.value ? "bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:text-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-100 dark:border-gray-700 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 dark:text-gray-400 text-gray-700"]
                    }, " Next ", 10, ["disabled"])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Proktor/Peserta/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
