import { ref, computed, watch, onUnmounted, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, withDirectives, vModelText, vModelSelect, Teleport, Transition, withModifiers, vModelRadio, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MenuLayout-61-dwqPB.js";
import { Head, router } from "@inertiajs/vue3";
import { T as ToastAlert } from "./Sidebar-COsy3wF2.js";
import "@vueuse/core";
import "@heroicons/vue/24/solid";
import "@heroicons/vue/24/outline";
import "sweetalert2";
import "ziggy-js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    kelas: { type: Object, default: null },
    guru: { type: Object, default: null },
    siswa: { type: Object, default: null },
    stats: { type: Object, default: null },
    filters: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const { success, error } = ToastAlert();
    const props = __props;
    const search = ref(props.filters.search ?? "");
    const filterStatus = ref(props.filters.status ?? "");
    const filterRole = ref(props.filters.role ?? "");
    let debounceTimer = null;
    const siswaList = computed(() => props.siswa?.data ?? []);
    const pagination = computed(() => props.siswa ?? {});
    const hasKelas = computed(() => !!props.kelas);
    const hasActiveFilter = computed(
      () => search.value.trim() || filterStatus.value || filterRole.value
    );
    function buildParams() {
      return {
        ...search.value.trim() ? { search: search.value.trim() } : {},
        ...filterStatus.value ? { status: filterStatus.value } : {},
        ...filterRole.value ? { role: filterRole.value } : {}
      };
    }
    function applyFilter() {
      router.get(route("guru.walas.index"), buildParams(), {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    }
    watch(search, () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilter, 400);
    });
    watch([filterStatus, filterRole], () => {
      clearTimeout(debounceTimer);
      applyFilter();
    });
    onUnmounted(() => clearTimeout(debounceTimer));
    function clearFilters() {
      search.value = "";
      filterStatus.value = "";
      filterRole.value = "";
      router.get(route("guru.walas.index"), {}, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    }
    function goToPage(url) {
      if (url) router.get(url, buildParams(), { preserveScroll: true });
    }
    function getInitials(name) {
      return (name ?? "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    }
    const AVATAR_COLORS = [
      "from-violet-500 to-purple-600",
      "from-sky-500 to-blue-600",
      "from-emerald-500 to-teal-600",
      "from-rose-500 to-pink-600",
      "from-amber-500 to-orange-600",
      "from-cyan-500 to-sky-600",
      "from-indigo-500 to-violet-600",
      "from-fuchsia-500 to-pink-600"
    ];
    function avatarColor(name) {
      let hash = 0;
      for (const c of name ?? "") hash += c.charCodeAt(0);
      return AVATAR_COLORS[hash % AVATAR_COLORS.length];
    }
    const statCards = computed(() => {
      if (!props.stats) return [];
      return [
        { label: "Total Siswa", value: props.stats.total, icon: "👥", color: "bg-indigo-50  dark:bg-indigo-900/30  text-indigo-700  dark:text-indigo-300", ring: "ring-indigo-200  dark:ring-indigo-700" },
        { label: "Aktif", value: props.stats.aktif, icon: "✅", color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-200 dark:ring-emerald-700" },
        { label: "Nonaktif", value: props.stats.nonaktif, icon: "⛔", color: "bg-rose-50    dark:bg-rose-900/30    text-rose-700    dark:text-rose-300", ring: "ring-rose-200    dark:ring-rose-700" },
        { label: "Sekretaris", value: props.stats.sekretaris, icon: "📋", color: "bg-sky-50     dark:bg-sky-900/30     text-sky-700     dark:text-sky-300", ring: "ring-sky-200     dark:ring-sky-700" },
        { label: "Bendahara", value: props.stats.bendahara, icon: "💰", color: "bg-amber-50   dark:bg-amber-900/30   text-amber-700   dark:text-amber-300", ring: "ring-amber-200   dark:ring-amber-700" },
        { label: "OSIS", value: props.stats.osis, icon: "🏅", color: "bg-violet-50  dark:bg-violet-900/30  text-violet-700  dark:text-violet-300", ring: "ring-violet-200  dark:ring-violet-700" }
      ];
    });
    const showEditModal = ref(false);
    const editLoading = ref(false);
    const editErrors = ref({});
    const editForm = ref({
      id: null,
      nama_lengkap: "",
      status: "Activated",
      sekretaris: "no",
      bendahara: "no",
      osis: "no"
    });
    function openEdit(siswa) {
      editErrors.value = {};
      editForm.value = {
        id: siswa.id,
        nama_lengkap: siswa.nama_lengkap,
        status: siswa.status,
        sekretaris: siswa.sekretaris ?? "no",
        bendahara: siswa.bendahara ?? "no",
        osis: siswa.osis ?? "no"
      };
      showEditModal.value = true;
    }
    function closeEdit() {
      if (editLoading.value) return;
      showEditModal.value = false;
    }
    function submitEdit() {
      if (editLoading.value) return;
      editLoading.value = true;
      editErrors.value = {};
      router.put(
        route("guru.walas.update", editForm.value.id),
        {
          status: editForm.value.status,
          sekretaris: editForm.value.sekretaris,
          bendahara: editForm.value.bendahara,
          osis: editForm.value.osis
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            showEditModal.value = false;
            success("Data siswa berhasil diperbarui.");
          },
          onError: (errors) => {
            editErrors.value = errors;
            error("Gagal memperbarui data siswa. Periksa kembali isian form.");
          },
          onFinish: () => {
            editLoading.value = false;
          }
        }
      );
    }
    const showDeleteModal = ref(false);
    const deleteLoading = ref(false);
    const deleteSiswa = ref(null);
    function openDelete(siswa) {
      deleteSiswa.value = siswa;
      showDeleteModal.value = true;
    }
    function closeDelete() {
      if (deleteLoading.value) return;
      showDeleteModal.value = false;
      deleteSiswa.value = null;
    }
    function confirmDelete() {
      if (deleteLoading.value || !deleteSiswa.value) return;
      deleteLoading.value = true;
      router.delete(
        route("guru.walas.destroy", deleteSiswa.value.id),
        {
          preserveScroll: true,
          data: buildParams(),
          // kirim filter agar redirect balik ke halaman/filter yang sama
          onSuccess: () => {
            showDeleteModal.value = false;
            deleteSiswa.value = null;
          },
          onFinish: () => {
            deleteLoading.value = false;
          }
        }
      );
    }
    function onKeydown(e) {
      if (e.key === "Escape") {
        closeEdit();
        closeDelete();
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Wali Kelas" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { onKeydown }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen py-4 px-2 sm:px-0"${_scopeId}><div class="mx-auto max-w-7xl space-y-6"${_scopeId}><div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 shadow-xl p-6 sm:p-8"${_scopeId}><div class="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"${_scopeId}></div><div class="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-violet-500/10 blur-2xl"${_scopeId}></div><div class="relative flex flex-col sm:flex-row sm:items-center gap-4"${_scopeId}><div class="flex-shrink-0 w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl shadow-inner ring-1 ring-white/20"${_scopeId}> 🏫 </div><div class="flex-1"${_scopeId}><h1 class="text-2xl sm:text-3xl font-bold text-white leading-tight"${_scopeId}> Wali Kelas `);
            if (hasKelas.value) {
              _push2(`<span class="ml-2 text-indigo-300"${_scopeId}>— ${ssrInterpolate(__props.kelas.kelas)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</h1>`);
            if (__props.guru) {
              _push2(`<p class="mt-1 text-slate-400 text-sm"${_scopeId}>${ssrInterpolate(__props.guru.nama_lengkap)} <span class="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs text-slate-300"${_scopeId}>${ssrInterpolate(__props.guru.jabatan)}</span></p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (hasKelas.value) {
              _push2(`<div class="flex-shrink-0"${_scopeId}><div class="px-5 py-2 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30 backdrop-blur text-center"${_scopeId}><p class="text-xs text-indigo-300 font-medium uppercase tracking-wider"${_scopeId}>Kelas</p><p class="text-xl font-bold text-white mt-0.5"${_scopeId}>${ssrInterpolate(__props.kelas.kelas)}</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            if (!hasKelas.value) {
              _push2(`<div class="rounded-2xl bg-white dark:bg-slate-800/60 shadow-sm border border-slate-100 dark:border-slate-700/50 p-12 text-center"${_scopeId}><div class="text-6xl mb-4"${_scopeId}>🏷️</div><h2 class="text-xl font-semibold text-slate-700 dark:text-slate-200"${_scopeId}>Belum Memiliki Kelas Wali</h2><p class="mt-2 text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm"${_scopeId}> Anda belum ditugaskan sebagai wali kelas. Hubungi admin untuk pengaturan lebih lanjut. </p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (hasKelas.value && __props.stats) {
              _push2(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"${_scopeId}><!--[-->`);
              ssrRenderList(statCards.value, (card) => {
                _push2(`<div class="${ssrRenderClass(["rounded-xl p-4 ring-1 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-default", card.color, card.ring])}"${_scopeId}><div class="flex items-center justify-between mb-2"${_scopeId}><span class="text-lg"${_scopeId}>${ssrInterpolate(card.icon)}</span></div><p class="text-2xl font-bold leading-none"${_scopeId}>${ssrInterpolate(card.value)}</p><p class="text-xs font-medium mt-1 opacity-80"${_scopeId}>${ssrInterpolate(card.label)}</p></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (hasKelas.value) {
              _push2(`<div class="rounded-2xl bg-white dark:bg-slate-800/60 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden"${_scopeId}><div class="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><h2 class="font-semibold text-slate-800 dark:text-white text-sm"${_scopeId}>Data Siswa</h2><span class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full"${_scopeId}>${ssrInterpolate(pagination.value.total ?? 0)} siswa </span></div><div class="flex flex-wrap gap-2 w-full sm:w-auto"${_scopeId}><div class="relative flex-1 sm:flex-none"${_scopeId}><span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"${_scopeId}>🔍</span><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Cari nama, NIS, NISN..." class="w-full sm:w-60 pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"${_scopeId}></div><select class="px-10 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "") : ssrLooseEqual(filterStatus.value, "")) ? " selected" : ""}${_scopeId}>Semua Status</option><option value="Activated"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "Activated") : ssrLooseEqual(filterStatus.value, "Activated")) ? " selected" : ""}${_scopeId}>Aktif</option><option value="Deactivated"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "Deactivated") : ssrLooseEqual(filterStatus.value, "Deactivated")) ? " selected" : ""}${_scopeId}>Nonaktif</option></select><select class="px-10 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(filterRole.value) ? ssrLooseContain(filterRole.value, "") : ssrLooseEqual(filterRole.value, "")) ? " selected" : ""}${_scopeId}>Semua Peran</option><option value="sekretaris"${ssrIncludeBooleanAttr(Array.isArray(filterRole.value) ? ssrLooseContain(filterRole.value, "sekretaris") : ssrLooseEqual(filterRole.value, "sekretaris")) ? " selected" : ""}${_scopeId}>Sekretaris</option><option value="bendahara"${ssrIncludeBooleanAttr(Array.isArray(filterRole.value) ? ssrLooseContain(filterRole.value, "bendahara") : ssrLooseEqual(filterRole.value, "bendahara")) ? " selected" : ""}${_scopeId}>Bendahara</option><option value="osis"${ssrIncludeBooleanAttr(Array.isArray(filterRole.value) ? ssrLooseContain(filterRole.value, "osis") : ssrLooseEqual(filterRole.value, "osis")) ? " selected" : ""}${_scopeId}>OSIS</option></select>`);
              if (hasActiveFilter.value) {
                _push2(`<button class="px-3 py-2 text-sm rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition font-medium"${_scopeId}> ✕ Reset </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="overflow-x-auto"${_scopeId}><table class="w-full text-sm"${_scopeId}><thead${_scopeId}><tr class="bg-slate-50/80 dark:bg-slate-700/40 border-b border-slate-100 dark:border-slate-700/50"${_scopeId}><th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-8"${_scopeId}> #</th><th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"${_scopeId}> Siswa</th><th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"${_scopeId}> NIS</th><th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"${_scopeId}> NISN</th><th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"${_scopeId}> Kejuruan</th><th class="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"${_scopeId}> Peran</th><th class="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"${_scopeId}> Status</th><th class="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"${_scopeId}> Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-700/40"${_scopeId}>`);
              if (siswaList.value.length === 0) {
                _push2(`<tr${_scopeId}><td colspan="9" class="px-4 py-16 text-center"${_scopeId}><div class="text-4xl mb-3"${_scopeId}>🔍</div><p class="text-slate-500 dark:text-slate-400 font-medium"${_scopeId}>Tidak ada siswa ditemukan</p><p class="text-slate-400 dark:text-slate-500 text-xs mt-1"${_scopeId}>Coba ubah filter atau kata kunci pencarian</p></td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(siswaList.value, (s, idx) => {
                _push2(`<tr class="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors duration-100"${_scopeId}><td class="px-4 py-3 text-slate-400 dark:text-slate-500 text-xs font-mono"${_scopeId}>${ssrInterpolate((pagination.value.current_page - 1) * pagination.value.per_page + idx + 1)}</td><td class="px-4 py-3"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="${ssrRenderClass(["flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br text-white text-xs font-bold flex items-center justify-center shadow-sm", avatarColor(s.nama_lengkap)])}"${_scopeId}>${ssrInterpolate(getInitials(s.nama_lengkap))}</div><span class="font-medium text-slate-800 dark:text-white"${_scopeId}>${ssrInterpolate(s.nama_lengkap)}</span></div></td><td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-300 text-xs"${_scopeId}>${ssrInterpolate(s.nis ?? "—")}</td><td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-300 text-xs"${_scopeId}>${ssrInterpolate(s.nisn ?? "—")}</td><td class="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs"${_scopeId}>${ssrInterpolate(s.kejuruan?.kejuruan ?? "—")}</td><td class="px-4 py-3"${_scopeId}><div class="flex items-center justify-center gap-1 flex-wrap"${_scopeId}>`);
                if (s.sekretaris === "yes") {
                  _push2(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300"${_scopeId}>📋 Sekretaris</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (s.bendahara === "yes") {
                  _push2(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"${_scopeId}>💰 Bendahara</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (s.osis === "yes") {
                  _push2(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"${_scopeId}>🏅 OSIS</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (s.sekretaris !== "yes" && s.bendahara !== "yes" && s.osis !== "yes") {
                  _push2(`<span class="text-slate-300 dark:text-slate-600 text-xs"${_scopeId}>—</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></td><td class="px-4 py-3 text-center"${_scopeId}><span class="${ssrRenderClass([
                  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold",
                  s.status === "Activated" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                ])}"${_scopeId}><span class="${ssrRenderClass(["w-1.5 h-1.5 rounded-full", s.status === "Activated" ? "bg-emerald-500" : "bg-rose-500"])}"${_scopeId}></span> ${ssrInterpolate(s.status === "Activated" ? "Aktif" : "Nonaktif")}</span></td><td class="px-4 py-3"${_scopeId}><div class="flex items-center justify-center gap-1.5"${_scopeId}><button class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition" title="Edit siswa"${_scopeId}> ✏️ Edit </button><button class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition" title="Hapus siswa"${_scopeId}> 🗑️ Hapus </button></div></td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
              if (pagination.value.last_page > 1) {
                _push2(`<div class="px-5 py-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3"${_scopeId}><p class="text-xs text-slate-500 dark:text-slate-400"${_scopeId}> Menampilkan <span class="font-semibold text-slate-700 dark:text-slate-200"${_scopeId}>${ssrInterpolate(pagination.value.from)}–${ssrInterpolate(pagination.value.to)}</span> dari <span class="font-semibold text-slate-700 dark:text-slate-200"${_scopeId}>${ssrInterpolate(pagination.value.total)}</span> siswa </p><div class="flex items-center gap-1"${_scopeId}><button${ssrIncludeBooleanAttr(!pagination.value.prev_page_url) ? " disabled" : ""} class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"${_scopeId}> ← Sebelumnya </button><!--[-->`);
                ssrRenderList(pagination.value.links, (link) => {
                  _push2(`<!--[-->`);
                  if (link.label !== "« Previous" && link.label !== "Next »") {
                    _push2(`<button${ssrIncludeBooleanAttr(!link.url) ? " disabled" : ""} class="${ssrRenderClass([
                      "w-8 h-8 text-xs rounded-lg border transition font-medium",
                      link.active ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    ])}"${_scopeId}>${link.label ?? ""}</button>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<!--]-->`);
                });
                _push2(`<!--]--><button${ssrIncludeBooleanAttr(!pagination.value.next_page_url) ? " disabled" : ""} class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"${_scopeId}> Berikutnya → </button></div></div>`);
              } else if (siswaList.value.length > 0) {
                _push2(`<div class="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50"${_scopeId}><p class="text-xs text-slate-400 dark:text-slate-500"${_scopeId}> Total ${ssrInterpolate(pagination.value.total ?? siswaList.value.length)} siswa ditampilkan </p></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            ssrRenderTeleport(_push2, (_push3) => {
              if (showEditModal.value) {
                _push3(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"${_scopeId}>`);
                if (showEditModal.value) {
                  _push3(`<div class="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden"${_scopeId}><div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between"${_scopeId}><div${_scopeId}><h3 class="font-semibold text-slate-800 dark:text-white text-base"${_scopeId}>Edit Data Siswa </h3><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5"${_scopeId}>${ssrInterpolate(editForm.value.nama_lengkap)}</p></div><button class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"${_scopeId}> ✕ </button></div><div class="px-6 py-5 space-y-5"${_scopeId}><div${_scopeId}><label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide"${_scopeId}>Status</label><div class="flex gap-3"${_scopeId}><!--[-->`);
                  ssrRenderList([{ value: "Activated", label: "✅ Aktif" }, { value: "Deactivated", label: "⛔ Nonaktif" }], (opt) => {
                    _push3(`<label class="${ssrRenderClass([
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition",
                      editForm.value.status === opt.value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500"
                    ])}"${_scopeId}><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(editForm.value.status, opt.value)) ? " checked" : ""}${ssrRenderAttr("value", opt.value)} class="sr-only"${_scopeId}> ${ssrInterpolate(opt.label)}</label>`);
                  });
                  _push3(`<!--]--></div>`);
                  if (editErrors.value.status) {
                    _push3(`<p class="mt-1 text-xs text-rose-500"${_scopeId}>${ssrInterpolate(editErrors.value.status)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div${_scopeId}><label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide"${_scopeId}>Peran Kelas</label><div class="space-y-2"${_scopeId}><!--[-->`);
                  ssrRenderList([
                    { key: "sekretaris", label: "📋 Sekretaris", note: "Hanya 1 per kelas" },
                    { key: "bendahara", label: "💰 Bendahara", note: "Hanya 1 per kelas" },
                    { key: "osis", label: "🏅 OSIS", note: "Bisa lebih dari 1" }
                  ], (role) => {
                    _push3(`<label class="${ssrRenderClass([
                      "flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition",
                      editForm.value[role.key] === "yes" ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                    ])}"${_scopeId}><div${_scopeId}><span class="text-sm font-medium text-slate-700 dark:text-slate-200"${_scopeId}>${ssrInterpolate(role.label)}</span><span class="ml-2 text-xs text-slate-400"${_scopeId}>${ssrInterpolate(role.note)}</span></div><button type="button" class="${ssrRenderClass([
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200",
                      editForm.value[role.key] === "yes" ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
                    ])}"${_scopeId}><span class="${ssrRenderClass([
                      "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200",
                      editForm.value[role.key] === "yes" ? "translate-x-4" : "translate-x-1"
                    ])}"${_scopeId}></span></button></label>`);
                  });
                  _push3(`<!--]--></div>`);
                  if (editErrors.value.sekretaris || editErrors.value.bendahara || editErrors.value.osis) {
                    _push3(`<p class="mt-1 text-xs text-rose-500"${_scopeId}>${ssrInterpolate(editErrors.value.sekretaris || editErrors.value.bendahara || editErrors.value.osis)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div><div class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3"${_scopeId}><button${ssrIncludeBooleanAttr(editLoading.value) ? " disabled" : ""} class="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition"${_scopeId}> Batal </button><button${ssrIncludeBooleanAttr(editLoading.value) ? " disabled" : ""} class="inline-flex items-center gap-2 px-5 py-2 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60 transition"${_scopeId}>`);
                  if (editLoading.value) {
                    _push3(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"${_scopeId}></path></svg>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(` ${ssrInterpolate(editLoading.value ? "Menyimpan..." : "Simpan Perubahan")}</button></div></div>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div>`);
              } else {
                _push3(`<!---->`);
              }
            }, "body", false, _parent2);
            ssrRenderTeleport(_push2, (_push3) => {
              if (showDeleteModal.value) {
                _push3(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"${_scopeId}>`);
                if (showDeleteModal.value) {
                  _push3(`<div class="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden"${_scopeId}><div class="p-6 text-center"${_scopeId}><div class="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-2xl mx-auto mb-4"${_scopeId}> 🗑️ </div><h3 class="text-base font-semibold text-slate-800 dark:text-white"${_scopeId}>Hapus Siswa?</h3><p class="mt-2 text-sm text-slate-500 dark:text-slate-400"${_scopeId}> Anda akan menghapus <span class="font-semibold text-slate-700 dark:text-slate-200"${_scopeId}>${ssrInterpolate(deleteSiswa.value?.nama_lengkap)}</span>. Tindakan ini tidak dapat dibatalkan. </p></div><div class="px-6 pb-6 flex gap-3"${_scopeId}><button${ssrIncludeBooleanAttr(deleteLoading.value) ? " disabled" : ""} class="flex-1 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition font-medium"${_scopeId}> Batal </button><button${ssrIncludeBooleanAttr(deleteLoading.value) ? " disabled" : ""} class="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium disabled:opacity-60 transition"${_scopeId}>`);
                  if (deleteLoading.value) {
                    _push3(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"${_scopeId}></path></svg>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(` ${ssrInterpolate(deleteLoading.value ? "Menghapus..." : "Ya, Hapus")}</button></div></div>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div>`);
              } else {
                _push3(`<!---->`);
              }
            }, "body", false, _parent2);
          } else {
            return [
              createVNode("div", { class: "min-h-screen py-4 px-2 sm:px-0" }, [
                createVNode("div", { class: "mx-auto max-w-7xl space-y-6" }, [
                  createVNode("div", { class: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 shadow-xl p-6 sm:p-8" }, [
                    createVNode("div", { class: "pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" }),
                    createVNode("div", { class: "pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-violet-500/10 blur-2xl" }),
                    createVNode("div", { class: "relative flex flex-col sm:flex-row sm:items-center gap-4" }, [
                      createVNode("div", { class: "flex-shrink-0 w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl shadow-inner ring-1 ring-white/20" }, " 🏫 "),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("h1", { class: "text-2xl sm:text-3xl font-bold text-white leading-tight" }, [
                          createTextVNode(" Wali Kelas "),
                          hasKelas.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "ml-2 text-indigo-300"
                          }, "— " + toDisplayString(__props.kelas.kelas), 1)) : createCommentVNode("", true)
                        ]),
                        __props.guru ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-slate-400 text-sm"
                        }, [
                          createTextVNode(toDisplayString(__props.guru.nama_lengkap) + " ", 1),
                          createVNode("span", { class: "ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs text-slate-300" }, toDisplayString(__props.guru.jabatan), 1)
                        ])) : createCommentVNode("", true)
                      ]),
                      hasKelas.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex-shrink-0"
                      }, [
                        createVNode("div", { class: "px-5 py-2 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30 backdrop-blur text-center" }, [
                          createVNode("p", { class: "text-xs text-indigo-300 font-medium uppercase tracking-wider" }, "Kelas"),
                          createVNode("p", { class: "text-xl font-bold text-white mt-0.5" }, toDisplayString(__props.kelas.kelas), 1)
                        ])
                      ])) : createCommentVNode("", true)
                    ])
                  ]),
                  !hasKelas.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "rounded-2xl bg-white dark:bg-slate-800/60 shadow-sm border border-slate-100 dark:border-slate-700/50 p-12 text-center"
                  }, [
                    createVNode("div", { class: "text-6xl mb-4" }, "🏷️"),
                    createVNode("h2", { class: "text-xl font-semibold text-slate-700 dark:text-slate-200" }, "Belum Memiliki Kelas Wali"),
                    createVNode("p", { class: "mt-2 text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm" }, " Anda belum ditugaskan sebagai wali kelas. Hubungi admin untuk pengaturan lebih lanjut. ")
                  ])) : createCommentVNode("", true),
                  hasKelas.value && __props.stats ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(statCards.value, (card) => {
                      return openBlock(), createBlock("div", {
                        key: card.label,
                        class: ["rounded-xl p-4 ring-1 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-default", card.color, card.ring]
                      }, [
                        createVNode("div", { class: "flex items-center justify-between mb-2" }, [
                          createVNode("span", { class: "text-lg" }, toDisplayString(card.icon), 1)
                        ]),
                        createVNode("p", { class: "text-2xl font-bold leading-none" }, toDisplayString(card.value), 1),
                        createVNode("p", { class: "text-xs font-medium mt-1 opacity-80" }, toDisplayString(card.label), 1)
                      ], 2);
                    }), 128))
                  ])) : createCommentVNode("", true),
                  hasKelas.value ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "rounded-2xl bg-white dark:bg-slate-800/60 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden"
                  }, [
                    createVNode("div", { class: "px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("h2", { class: "font-semibold text-slate-800 dark:text-white text-sm" }, "Data Siswa"),
                        createVNode("span", { class: "px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full" }, toDisplayString(pagination.value.total ?? 0) + " siswa ", 1)
                      ]),
                      createVNode("div", { class: "flex flex-wrap gap-2 w-full sm:w-auto" }, [
                        createVNode("div", { class: "relative flex-1 sm:flex-none" }, [
                          createVNode("span", { class: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" }, "🔍"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => search.value = $event,
                            type: "text",
                            placeholder: "Cari nama, NIS, NISN...",
                            class: "w-full sm:w-60 pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, search.value]
                          ])
                        ]),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => filterStatus.value = $event,
                          class: "px-10 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
                        }, [
                          createVNode("option", { value: "" }, "Semua Status"),
                          createVNode("option", { value: "Activated" }, "Aktif"),
                          createVNode("option", { value: "Deactivated" }, "Nonaktif")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, filterStatus.value]
                        ]),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => filterRole.value = $event,
                          class: "px-10 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
                        }, [
                          createVNode("option", { value: "" }, "Semua Peran"),
                          createVNode("option", { value: "sekretaris" }, "Sekretaris"),
                          createVNode("option", { value: "bendahara" }, "Bendahara"),
                          createVNode("option", { value: "osis" }, "OSIS")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, filterRole.value]
                        ]),
                        hasActiveFilter.value ? (openBlock(), createBlock("button", {
                          key: 0,
                          onClick: clearFilters,
                          class: "px-3 py-2 text-sm rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition font-medium"
                        }, " ✕ Reset ")) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "overflow-x-auto" }, [
                      createVNode("table", { class: "w-full text-sm" }, [
                        createVNode("thead", null, [
                          createVNode("tr", { class: "bg-slate-50/80 dark:bg-slate-700/40 border-b border-slate-100 dark:border-slate-700/50" }, [
                            createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-8" }, " #"),
                            createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" }, " Siswa"),
                            createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" }, " NIS"),
                            createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" }, " NISN"),
                            createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" }, " Kejuruan"),
                            createVNode("th", { class: "px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" }, " Peran"),
                            createVNode("th", { class: "px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" }, " Status"),
                            createVNode("th", { class: "px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" }, " Aksi")
                          ])
                        ]),
                        createVNode("tbody", { class: "divide-y divide-slate-100 dark:divide-slate-700/40" }, [
                          siswaList.value.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                            createVNode("td", {
                              colspan: "9",
                              class: "px-4 py-16 text-center"
                            }, [
                              createVNode("div", { class: "text-4xl mb-3" }, "🔍"),
                              createVNode("p", { class: "text-slate-500 dark:text-slate-400 font-medium" }, "Tidak ada siswa ditemukan"),
                              createVNode("p", { class: "text-slate-400 dark:text-slate-500 text-xs mt-1" }, "Coba ubah filter atau kata kunci pencarian")
                            ])
                          ])) : createCommentVNode("", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(siswaList.value, (s, idx) => {
                            return openBlock(), createBlock("tr", {
                              key: s.id,
                              class: "hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors duration-100"
                            }, [
                              createVNode("td", { class: "px-4 py-3 text-slate-400 dark:text-slate-500 text-xs font-mono" }, toDisplayString((pagination.value.current_page - 1) * pagination.value.per_page + idx + 1), 1),
                              createVNode("td", { class: "px-4 py-3" }, [
                                createVNode("div", { class: "flex items-center gap-3" }, [
                                  createVNode("div", {
                                    class: ["flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br text-white text-xs font-bold flex items-center justify-center shadow-sm", avatarColor(s.nama_lengkap)]
                                  }, toDisplayString(getInitials(s.nama_lengkap)), 3),
                                  createVNode("span", { class: "font-medium text-slate-800 dark:text-white" }, toDisplayString(s.nama_lengkap), 1)
                                ])
                              ]),
                              createVNode("td", { class: "px-4 py-3 font-mono text-slate-600 dark:text-slate-300 text-xs" }, toDisplayString(s.nis ?? "—"), 1),
                              createVNode("td", { class: "px-4 py-3 font-mono text-slate-600 dark:text-slate-300 text-xs" }, toDisplayString(s.nisn ?? "—"), 1),
                              createVNode("td", { class: "px-4 py-3 text-slate-600 dark:text-slate-300 text-xs" }, toDisplayString(s.kejuruan?.kejuruan ?? "—"), 1),
                              createVNode("td", { class: "px-4 py-3" }, [
                                createVNode("div", { class: "flex items-center justify-center gap-1 flex-wrap" }, [
                                  s.sekretaris === "yes" ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300"
                                  }, "📋 Sekretaris")) : createCommentVNode("", true),
                                  s.bendahara === "yes" ? (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                                  }, "💰 Bendahara")) : createCommentVNode("", true),
                                  s.osis === "yes" ? (openBlock(), createBlock("span", {
                                    key: 2,
                                    class: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
                                  }, "🏅 OSIS")) : createCommentVNode("", true),
                                  s.sekretaris !== "yes" && s.bendahara !== "yes" && s.osis !== "yes" ? (openBlock(), createBlock("span", {
                                    key: 3,
                                    class: "text-slate-300 dark:text-slate-600 text-xs"
                                  }, "—")) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("td", { class: "px-4 py-3 text-center" }, [
                                createVNode("span", {
                                  class: [
                                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold",
                                    s.status === "Activated" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                                  ]
                                }, [
                                  createVNode("span", {
                                    class: ["w-1.5 h-1.5 rounded-full", s.status === "Activated" ? "bg-emerald-500" : "bg-rose-500"]
                                  }, null, 2),
                                  createTextVNode(" " + toDisplayString(s.status === "Activated" ? "Aktif" : "Nonaktif"), 1)
                                ], 2)
                              ]),
                              createVNode("td", { class: "px-4 py-3" }, [
                                createVNode("div", { class: "flex items-center justify-center gap-1.5" }, [
                                  createVNode("button", {
                                    onClick: ($event) => openEdit(s),
                                    class: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition",
                                    title: "Edit siswa"
                                  }, " ✏️ Edit ", 8, ["onClick"]),
                                  createVNode("button", {
                                    onClick: ($event) => openDelete(s),
                                    class: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition",
                                    title: "Hapus siswa"
                                  }, " 🗑️ Hapus ", 8, ["onClick"])
                                ])
                              ])
                            ]);
                          }), 128))
                        ])
                      ])
                    ]),
                    pagination.value.last_page > 1 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "px-5 py-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3"
                    }, [
                      createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, [
                        createTextVNode(" Menampilkan "),
                        createVNode("span", { class: "font-semibold text-slate-700 dark:text-slate-200" }, toDisplayString(pagination.value.from) + "–" + toDisplayString(pagination.value.to), 1),
                        createTextVNode(" dari "),
                        createVNode("span", { class: "font-semibold text-slate-700 dark:text-slate-200" }, toDisplayString(pagination.value.total), 1),
                        createTextVNode(" siswa ")
                      ]),
                      createVNode("div", { class: "flex items-center gap-1" }, [
                        createVNode("button", {
                          onClick: ($event) => goToPage(pagination.value.prev_page_url),
                          disabled: !pagination.value.prev_page_url,
                          class: "px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        }, " ← Sebelumnya ", 8, ["onClick", "disabled"]),
                        (openBlock(true), createBlock(Fragment, null, renderList(pagination.value.links, (link) => {
                          return openBlock(), createBlock(Fragment, {
                            key: link.label
                          }, [
                            link.label !== "« Previous" && link.label !== "Next »" ? (openBlock(), createBlock("button", {
                              key: 0,
                              onClick: ($event) => goToPage(link.url),
                              disabled: !link.url,
                              class: [
                                "w-8 h-8 text-xs rounded-lg border transition font-medium",
                                link.active ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                              ],
                              innerHTML: link.label
                            }, null, 10, ["onClick", "disabled", "innerHTML"])) : createCommentVNode("", true)
                          ], 64);
                        }), 128)),
                        createVNode("button", {
                          onClick: ($event) => goToPage(pagination.value.next_page_url),
                          disabled: !pagination.value.next_page_url,
                          class: "px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        }, " Berikutnya → ", 8, ["onClick", "disabled"])
                      ])
                    ])) : siswaList.value.length > 0 ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "px-5 py-3 border-t border-slate-100 dark:border-slate-700/50"
                    }, [
                      createVNode("p", { class: "text-xs text-slate-400 dark:text-slate-500" }, " Total " + toDisplayString(pagination.value.total ?? siswaList.value.length) + " siswa ditampilkan ", 1)
                    ])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ])
              ]),
              (openBlock(), createBlock(Teleport, { to: "body" }, [
                createVNode(Transition, {
                  "enter-from-class": "opacity-0",
                  "enter-active-class": "transition duration-200",
                  "leave-to-class": "opacity-0",
                  "leave-active-class": "transition duration-150"
                }, {
                  default: withCtx(() => [
                    showEditModal.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
                      onClick: withModifiers(closeEdit, ["self"])
                    }, [
                      createVNode(Transition, {
                        "enter-from-class": "opacity-0 scale-95",
                        "enter-active-class": "transition duration-200",
                        "leave-to-class": "opacity-0 scale-95",
                        "leave-active-class": "transition duration-150"
                      }, {
                        default: withCtx(() => [
                          showEditModal.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden"
                          }, [
                            createVNode("div", { class: "px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between" }, [
                              createVNode("div", null, [
                                createVNode("h3", { class: "font-semibold text-slate-800 dark:text-white text-base" }, "Edit Data Siswa "),
                                createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400 mt-0.5" }, toDisplayString(editForm.value.nama_lengkap), 1)
                              ]),
                              createVNode("button", {
                                onClick: closeEdit,
                                class: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                              }, " ✕ ")
                            ]),
                            createVNode("div", { class: "px-6 py-5 space-y-5" }, [
                              createVNode("div", null, [
                                createVNode("label", { class: "block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide" }, "Status"),
                                createVNode("div", { class: "flex gap-3" }, [
                                  (openBlock(), createBlock(Fragment, null, renderList([{ value: "Activated", label: "✅ Aktif" }, { value: "Deactivated", label: "⛔ Nonaktif" }], (opt) => {
                                    return createVNode("label", {
                                      key: opt.value,
                                      class: [
                                        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition",
                                        editForm.value.status === opt.value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500"
                                      ]
                                    }, [
                                      withDirectives(createVNode("input", {
                                        type: "radio",
                                        "onUpdate:modelValue": ($event) => editForm.value.status = $event,
                                        value: opt.value,
                                        class: "sr-only"
                                      }, null, 8, ["onUpdate:modelValue", "value"]), [
                                        [vModelRadio, editForm.value.status]
                                      ]),
                                      createTextVNode(" " + toDisplayString(opt.label), 1)
                                    ], 2);
                                  }), 64))
                                ]),
                                editErrors.value.status ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "mt-1 text-xs text-rose-500"
                                }, toDisplayString(editErrors.value.status), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { class: "block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide" }, "Peran Kelas"),
                                createVNode("div", { class: "space-y-2" }, [
                                  (openBlock(), createBlock(Fragment, null, renderList([
                                    { key: "sekretaris", label: "📋 Sekretaris", note: "Hanya 1 per kelas" },
                                    { key: "bendahara", label: "💰 Bendahara", note: "Hanya 1 per kelas" },
                                    { key: "osis", label: "🏅 OSIS", note: "Bisa lebih dari 1" }
                                  ], (role) => {
                                    return createVNode("label", {
                                      key: role.key,
                                      class: [
                                        "flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition",
                                        editForm.value[role.key] === "yes" ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                                      ]
                                    }, [
                                      createVNode("div", null, [
                                        createVNode("span", { class: "text-sm font-medium text-slate-700 dark:text-slate-200" }, toDisplayString(role.label), 1),
                                        createVNode("span", { class: "ml-2 text-xs text-slate-400" }, toDisplayString(role.note), 1)
                                      ]),
                                      createVNode("button", {
                                        type: "button",
                                        onClick: ($event) => editForm.value[role.key] = editForm.value[role.key] === "yes" ? "no" : "yes",
                                        class: [
                                          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200",
                                          editForm.value[role.key] === "yes" ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
                                        ]
                                      }, [
                                        createVNode("span", {
                                          class: [
                                            "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200",
                                            editForm.value[role.key] === "yes" ? "translate-x-4" : "translate-x-1"
                                          ]
                                        }, null, 2)
                                      ], 10, ["onClick"])
                                    ], 2);
                                  }), 64))
                                ]),
                                editErrors.value.sekretaris || editErrors.value.bendahara || editErrors.value.osis ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "mt-1 text-xs text-rose-500"
                                }, toDisplayString(editErrors.value.sekretaris || editErrors.value.bendahara || editErrors.value.osis), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", { class: "px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3" }, [
                              createVNode("button", {
                                onClick: closeEdit,
                                disabled: editLoading.value,
                                class: "px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition"
                              }, " Batal ", 8, ["disabled"]),
                              createVNode("button", {
                                onClick: submitEdit,
                                disabled: editLoading.value,
                                class: "inline-flex items-center gap-2 px-5 py-2 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60 transition"
                              }, [
                                editLoading.value ? (openBlock(), createBlock("svg", {
                                  key: 0,
                                  class: "animate-spin h-4 w-4",
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
                                    d: "M4 12a8 8 0 018-8v8z"
                                  })
                                ])) : createCommentVNode("", true),
                                createTextVNode(" " + toDisplayString(editLoading.value ? "Menyimpan..." : "Simpan Perubahan"), 1)
                              ], 8, ["disabled"])
                            ])
                          ])) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ])),
              (openBlock(), createBlock(Teleport, { to: "body" }, [
                createVNode(Transition, {
                  "enter-from-class": "opacity-0",
                  "enter-active-class": "transition duration-200",
                  "leave-to-class": "opacity-0",
                  "leave-active-class": "transition duration-150"
                }, {
                  default: withCtx(() => [
                    showDeleteModal.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
                      onClick: withModifiers(closeDelete, ["self"])
                    }, [
                      createVNode(Transition, {
                        "enter-from-class": "opacity-0 scale-95",
                        "enter-active-class": "transition duration-200",
                        "leave-to-class": "opacity-0 scale-95",
                        "leave-active-class": "transition duration-150"
                      }, {
                        default: withCtx(() => [
                          showDeleteModal.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden"
                          }, [
                            createVNode("div", { class: "p-6 text-center" }, [
                              createVNode("div", { class: "w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-2xl mx-auto mb-4" }, " 🗑️ "),
                              createVNode("h3", { class: "text-base font-semibold text-slate-800 dark:text-white" }, "Hapus Siswa?"),
                              createVNode("p", { class: "mt-2 text-sm text-slate-500 dark:text-slate-400" }, [
                                createTextVNode(" Anda akan menghapus "),
                                createVNode("span", { class: "font-semibold text-slate-700 dark:text-slate-200" }, toDisplayString(deleteSiswa.value?.nama_lengkap), 1),
                                createTextVNode(". Tindakan ini tidak dapat dibatalkan. ")
                              ])
                            ]),
                            createVNode("div", { class: "px-6 pb-6 flex gap-3" }, [
                              createVNode("button", {
                                onClick: closeDelete,
                                disabled: deleteLoading.value,
                                class: "flex-1 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition font-medium"
                              }, " Batal ", 8, ["disabled"]),
                              createVNode("button", {
                                onClick: confirmDelete,
                                disabled: deleteLoading.value,
                                class: "flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium disabled:opacity-60 transition"
                              }, [
                                deleteLoading.value ? (openBlock(), createBlock("svg", {
                                  key: 0,
                                  class: "animate-spin h-4 w-4",
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
                                    d: "M4 12a8 8 0 018-8v8z"
                                  })
                                ])) : createCommentVNode("", true),
                                createTextVNode(" " + toDisplayString(deleteLoading.value ? "Menghapus..." : "Ya, Hapus"), 1)
                              ], 8, ["disabled"])
                            ])
                          ])) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Guru/Walas/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
