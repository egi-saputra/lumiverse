import { ref, onMounted, onUnmounted, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, useSSRContext, nextTick, onBeforeUnmount } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { Link, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$b } from "./HomeLayout-BfxWiMNu.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { V as ValuesSection } from "./ValuesSection-DYw0Od39.js";
import "./LegalitasSection-WL5YB0Nn.js";
const _sfc_main$a = {
  __name: "HeroSection",
  __ssrInlineRender: true,
  setup(__props) {
    const variants = [
      {
        platform: "Learning",
        audience: "sekolah Indonesia",
        title: "Digitalisasi",
        subject: "Pembelajaran",
        pace: "Cerdas,"
      },
      // {
      //     platform: 'Classroom',
      //     audience: 'Komunitas Anda',
      //     subject: 'Pelatihan',
      //     pace: 'Cepat,'
      // },
      {
        platform: "Workspace",
        audience: "sekolah indonesia",
        title: "Kelola Sistem",
        subject: "Administrasi",
        pace: "Cepat,"
        // pace: 'Cermat,'
      }
    ];
    const activeIndex = ref(0);
    let intervalId = null;
    onMounted(() => {
      intervalId = setInterval(() => {
        activeIndex.value = (activeIndex.value + 1) % variants.length;
      }, 2500);
    });
    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "hero",
        id: "hero",
        "aria-labelledby": "hero-title"
      }, _attrs))} data-v-fe5554e4><div class="hero-bg" aria-hidden="true" data-v-fe5554e4><div class="hero-glow-1" data-v-fe5554e4></div><div class="hero-glow-2" data-v-fe5554e4></div><div class="hero-grid" data-v-fe5554e4></div></div><div class="container" data-v-fe5554e4><div class="hero-layout" data-v-fe5554e4><div class="hero-content" data-v-fe5554e4><div class="hero-badge hidden"${ssrRenderAttr("aria-label", `Platform ${variants[activeIndex.value].platform} #1 untuk ${variants[activeIndex.value].audience}`)} data-v-fe5554e4><div class="hero-badge-dot" data-v-fe5554e4></div><span data-v-fe5554e4>Platform</span><span class="word-slot" data-v-fe5554e4><span class="word-inner" data-v-fe5554e4>${ssrInterpolate(variants[activeIndex.value].platform)}</span></span><span data-v-fe5554e4>#1 untuk</span><span class="word-slot" data-v-fe5554e4> Sekolah Indonesia </span></div><div class="hero-badge inline-flex sm:hidden"${ssrRenderAttr("aria-label", `Platform LMS #1 untuk Sekolah Indonesia`)} data-v-fe5554e4><div class="hero-badge-dot" data-v-fe5554e4></div><span data-v-fe5554e4>Platform LMS #1 Untuk Sekolah Indonesia</span></div><h1 class="hero-title" id="hero-title" data-v-fe5554e4><span class="word-slot-h word-slot-h-title" data-v-fe5554e4><span class="word-inner-h" data-v-fe5554e4>${ssrInterpolate(variants[activeIndex.value].title)}</span></span><span class="word-slot-h word-slot-h-title" data-v-fe5554e4><span class="word-inner-h" data-v-fe5554e4>${ssrInterpolate(variants[activeIndex.value].subject)}</span></span><br data-v-fe5554e4><span class="highlight word-slot-h word-slot-h-title" data-v-fe5554e4> Lebih <span class="word-inner-h" data-v-fe5554e4>${ssrInterpolate(variants[activeIndex.value].pace)}</span></span><br data-v-fe5554e4><span class="highlight-gold" data-v-fe5554e4>Lebih Mudah.</span></h1><p class="hero-desc sm:flex hidden" data-v-fe5554e4> Daftarkan sekolah Anda dan mulai gunakan Lumiverse School hanya dalam hitungan menit. Proses aktivasi dilakukan secara otomatis, tanpa perlu menghubungi sales atau menunggu proses integrasi manual. </p><p class="hero-desc sm:hidden flex" data-v-fe5554e4> Bersama Lumiverse School, fokus pada pembelajaran Anda. Biarkan teknologi kami yang mengatasi sisanya. </p><div class="hero-actions" data-v-fe5554e4>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/registration",
        class: "btn-hero"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-v-fe5554e4${_scopeId}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" data-v-fe5554e4${_scopeId}></path></svg> Coba Gratis Sekarang `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2.5"
              }, [
                createVNode("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" })
              ])),
              createTextVNode(" Coba Gratis Sekarang ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="#demo" class="btn-outline" data-v-fe5554e4><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-fe5554e4><polygon points="5,3 19,12 5,21" data-v-fe5554e4></polygon></svg> Lihat Demo </a></div><div class="hero-trust" data-v-fe5554e4><div class="trust-avatars" aria-hidden="true" data-v-fe5554e4><div class="trust-avatar" data-v-fe5554e4>NH</div><div class="trust-avatar" data-v-fe5554e4>WB</div><div class="trust-avatar" data-v-fe5554e4>SN</div><div class="trust-avatar" data-v-fe5554e4>+</div></div><p class="trust-text" data-v-fe5554e4><strong data-v-fe5554e4>100+ Lembaga pendidikan</strong> telah bergabung bersama kami, Sekarang giliran Anda!</p></div></div><div class="hero-visual" aria-hidden="true" data-v-fe5554e4><div class="hero-dashboard" data-v-fe5554e4><div class="dashboard-topbar" data-v-fe5554e4><div class="dot dot-red" data-v-fe5554e4></div><div class="dot dot-yellow" data-v-fe5554e4></div><div class="dot dot-green" data-v-fe5554e4></div><div class="dashboard-url" data-v-fe5554e4>app.lumiverse.co.id/dashboard</div></div><div class="dashboard-body" data-v-fe5554e4><div class="dashboard-sidebar" data-v-fe5554e4><div class="sidebar-brand" data-v-fe5554e4>Lumiverse School</div><div class="sidebar-label" data-v-fe5554e4>Menu Utama</div><div class="sidebar-item active" data-v-fe5554e4><div class="sidebar-icon" data-v-fe5554e4></div> Dashboard </div><div class="sidebar-item" data-v-fe5554e4><div class="sidebar-icon" data-v-fe5554e4></div> Mata Pelajaran </div><div class="sidebar-item" data-v-fe5554e4><div class="sidebar-icon" data-v-fe5554e4></div> Siswa </div><div class="sidebar-item" data-v-fe5554e4><div class="sidebar-icon" data-v-fe5554e4></div> Ujian </div><div class="sidebar-item" data-v-fe5554e4><div class="sidebar-icon" data-v-fe5554e4></div> Nilai &amp; Rapor </div><div class="sidebar-item" data-v-fe5554e4><div class="sidebar-icon" data-v-fe5554e4></div> Absensi </div><div style="${ssrRenderStyle({ "margin-top": "1rem" })}" data-v-fe5554e4><div class="sidebar-label" data-v-fe5554e4>Administrasi</div><div class="sidebar-item" data-v-fe5554e4><div class="sidebar-icon" data-v-fe5554e4></div> Guru </div><div class="sidebar-item" data-v-fe5554e4><div class="sidebar-icon" data-v-fe5554e4></div> Laporan </div></div></div><div class="dashboard-main" data-v-fe5554e4><div class="dash-header" data-v-fe5554e4>Selamat datang, Pak Budi 👋</div><div class="dash-cards" data-v-fe5554e4><div class="dash-card" data-v-fe5554e4><div class="dash-card-label" data-v-fe5554e4>Total Siswa</div><div class="dash-card-val cyan" data-v-fe5554e4>847</div><div class="dash-card-sub" data-v-fe5554e4>↑ 12% bulan ini</div></div><div class="dash-card" data-v-fe5554e4><div class="dash-card-label" data-v-fe5554e4>Guru Aktif</div><div class="dash-card-val gold" data-v-fe5554e4>64</div><div class="dash-card-sub" data-v-fe5554e4>↑ 3 baru</div></div><div class="dash-card" data-v-fe5554e4><div class="dash-card-label" data-v-fe5554e4>Avg. Nilai</div><div class="dash-card-val green" data-v-fe5554e4>87.4</div><div class="dash-card-sub" data-v-fe5554e4>↑ 5.2 poin</div></div></div><div class="dash-chart-area" data-v-fe5554e4><div class="chart-label" data-v-fe5554e4>Aktivitas Belajar — 7 Hari Terakhir</div><div class="chart-bars" data-v-fe5554e4><div class="chart-bar" style="${ssrRenderStyle({ "height": "40%" })}" data-v-fe5554e4></div><div class="chart-bar" style="${ssrRenderStyle({ "height": "65%" })}" data-v-fe5554e4></div><div class="chart-bar" style="${ssrRenderStyle({ "height": "55%" })}" data-v-fe5554e4></div><div class="chart-bar" style="${ssrRenderStyle({ "height": "80%" })}" data-v-fe5554e4></div><div class="chart-bar" style="${ssrRenderStyle({ "height": "70%" })}" data-v-fe5554e4></div><div class="chart-bar" style="${ssrRenderStyle({ "height": "90%" })}" data-v-fe5554e4></div><div class="chart-bar" style="${ssrRenderStyle({ "height": "100%" })}" data-v-fe5554e4></div></div></div><div class="dash-activity" data-v-fe5554e4><div class="activity-label" data-v-fe5554e4>Aktivitas Terbaru</div><div class="activity-item" data-v-fe5554e4><div class="activity-dot" style="${ssrRenderStyle({ "background": "var(--cyan)" })}" data-v-fe5554e4></div> Ujian Matematika kelas X selesai — 32 siswa </div><div class="activity-item" data-v-fe5554e4><div class="activity-dot" style="${ssrRenderStyle({ "background": "var(--gold)" })}" data-v-fe5554e4></div> Materi baru diunggah: Fisika Dasar Bab 7 </div><div class="activity-item" style="${ssrRenderStyle({ "border": "none" })}" data-v-fe5554e4><div class="activity-dot" style="${ssrRenderStyle({ "background": "#34d399" })}" data-v-fe5554e4></div> Rapor Semester 1 siap diunduh </div></div></div></div></div><div class="hero-float float-1" data-v-fe5554e4><div class="float-icon cyan" data-v-fe5554e4>🚀</div><div class="float-info" data-v-fe5554e4><div class="label" data-v-fe5554e4>Uptime</div><div class="val cyan" data-v-fe5554e4>99.97%</div></div></div><div class="hero-float float-2" data-v-fe5554e4><div class="float-icon green" data-v-fe5554e4>✓</div><div class="float-info" data-v-fe5554e4><div class="label" data-v-fe5554e4>Infastruktur Keamanan Data</div><div class="val green" data-v-fe5554e4>Standar ISO 27001</div></div></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/HeroSection.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-fe5554e4"]]);
const _sfc_main$9 = {
  setup(__props) {
    const logos = [
      "SDIT Nurul Hikmah",
      "SMPN 2 Bojong Gede",
      "SMKN 1 Jakarta",
      "SMP Islam Nusantara",
      "SMK Nusantara",
      "Pesantren Mathla`ul Anwar",
      "SMA Bina Bangsa",
      "SMP Kusuma Bangsa",
      "SMK Laboratorium Indonesia",
      "Yayasan Pendidikan Nurul Qolbi",
      "SMP Binadidaktika"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "logos-section",
        "aria-label": "Dipercaya oleh"
      }, _attrs))} data-v-0062a4e3><div class="container" data-v-0062a4e3><p class="logos-label" data-v-0062a4e3>Dipercaya oleh berbagai lembaga pendidikan di Indonesia</p><div class="logos-track" data-v-0062a4e3><!--[-->`);
      ssrRenderList(logos, (logo) => {
        _push(`<div class="logo-item" data-v-0062a4e3>${ssrInterpolate(logo)}</div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/LogosSection.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {
  __name: "StatsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const stats = [
      { num: "100", suffix: "+", color: "cyan", label: "Sekolah, Komunitas Belajar, Bimbel & Lembaga Pendidikan Lainnya" },
      { num: "75K", suffix: "+", color: "gold", label: "Pengguna Aktif Dari Berbagai Institusi" },
      { num: "99.97", suffix: "%", color: "white", label: "Uptime Dijamin" },
      { num: "4.9", suffix: "★", color: "green", label: "Rating Kepuasan" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "stats-section" }, _attrs))} data-v-27930e0d><div class="container" data-v-27930e0d><div class="stats-grid" role="list" data-v-27930e0d><!--[-->`);
      ssrRenderList(stats, (stat) => {
        _push(`<div class="stat-item reveal" role="listitem" data-v-27930e0d><div class="${ssrRenderClass([stat.color, "stat-num"])}" data-v-27930e0d>${ssrInterpolate(stat.num)}<span data-v-27930e0d>${ssrInterpolate(stat.suffix)}</span></div><div class="stat-label" data-v-27930e0d>${ssrInterpolate(stat.label)}</div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/StatsSection.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const StatsSection = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-27930e0d"]]);
const _sfc_main$7 = {
  __name: "ServicesSection",
  __ssrInlineRender: true,
  setup(__props) {
    const serviceFeatures = [
      {
        icon: "📊",
        bg: "rgba(0,212,255,0.1)",
        title: "Absensi & Nilai Real-time",
        desc: "Guru input sekali, orang tua dan siswa langsung melihat pembaruan absensi dan nilai secara instan."
      },
      {
        icon: "🔔",
        bg: "rgba(245,166,35,0.1)",
        title: "Notifikasi WhatsApp Otomatis",
        desc: "Pemberitahuan pendaftaran, hasil ujian, dan pengumuman penting dikirim otomatis ke WhatsApp orang tua."
      },
      {
        icon: "📅",
        bg: "rgba(52,211,153,0.1)",
        title: "Jadwal & Kalender Akademik",
        desc: "Jadwal pelajaran, ujian, dan agenda sekolah tersinkronisasi otomatis di aplikasi setiap siswa dan guru."
      },
      {
        icon: "📱",
        bg: "rgba(167,139,250,0.1)",
        title: "Aplikasi Mobile Native",
        desc: "Akses kapan saja lewat aplikasi Android & iOS yang ringan, cepat, dan bisa dipakai offline sebagian fitur."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "layanan-section",
        id: "layanan",
        "aria-labelledby": "layanan-title"
      }, _attrs))} data-v-5f84bad1><div class="container" data-v-5f84bad1><div class="layanan-layout" data-v-5f84bad1><div class="phone-stage reveal" data-v-5f84bad1><div class="phone-mockup" data-v-5f84bad1><div class="phone-notch" data-v-5f84bad1></div><div class="phone-screen" data-v-5f84bad1><div class="status-bar" data-v-5f84bad1><span class="status-time" data-v-5f84bad1>09:41</span><div class="status-icons" data-v-5f84bad1><svg width="14" height="10" viewBox="0 0 16 12" fill="currentColor" data-v-5f84bad1><rect x="0" y="8" width="3" height="4" rx="0.5" data-v-5f84bad1></rect><rect x="4.5" y="5" width="3" height="7" rx="0.5" data-v-5f84bad1></rect><rect x="9" y="2" width="3" height="10" rx="0.5" data-v-5f84bad1></rect><rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.4" data-v-5f84bad1></rect></svg><svg width="15" height="10" viewBox="0 0 20 12" fill="none" stroke="currentColor" stroke-width="1.4" data-v-5f84bad1><path d="M1 4a13 13 0 0 1 18 0" stroke-opacity="0.4" data-v-5f84bad1></path><path d="M4.2 7a8.5 8.5 0 0 1 11.6 0" data-v-5f84bad1></path><circle cx="10" cy="10" r="1.4" fill="currentColor" stroke="none" data-v-5f84bad1></circle></svg><svg width="20" height="10" viewBox="0 0 24 12" fill="none" data-v-5f84bad1><rect x="0.5" y="0.5" width="19" height="11" rx="2.5" stroke="currentColor" stroke-opacity="0.5" data-v-5f84bad1></rect><rect x="2" y="2" width="14" height="8" rx="1.2" fill="currentColor" data-v-5f84bad1></rect><rect x="20.5" y="4" width="2" height="4" rx="1" fill="currentColor" fill-opacity="0.5" data-v-5f84bad1></rect></svg></div></div><div class="app-header" data-v-5f84bad1><div data-v-5f84bad1><div class="app-greeting" data-v-5f84bad1>Selamat pagi 👋</div><div class="app-username" data-v-5f84bad1>Ahmad Fauzi</div></div><div class="app-avatar" data-v-5f84bad1>AF</div></div><div class="app-stats" data-v-5f84bad1><div class="app-stat" data-v-5f84bad1><div class="app-stat-value cyan" data-v-5f84bad1>98%</div><div class="app-stat-label" data-v-5f84bad1>Kehadiran</div></div><div class="app-stat" data-v-5f84bad1><div class="app-stat-value gold" data-v-5f84bad1>12/15</div><div class="app-stat-label" data-v-5f84bad1>Tugas Selesai</div></div></div><div class="app-section-label" data-v-5f84bad1>Jadwal Hari Ini</div><div class="app-schedule" data-v-5f84bad1><div class="app-schedule-item" data-v-5f84bad1><div class="app-schedule-time" data-v-5f84bad1>07:30</div><div class="app-schedule-dot active" data-v-5f84bad1></div><div class="app-schedule-text" data-v-5f84bad1><div class="app-schedule-title" data-v-5f84bad1>Matematika</div><div class="app-schedule-sub" data-v-5f84bad1>Kelas XII IPA 1 · Ruang 204</div></div></div><div class="app-schedule-item" data-v-5f84bad1><div class="app-schedule-time" data-v-5f84bad1>09:15</div><div class="app-schedule-dot" data-v-5f84bad1></div><div class="app-schedule-text" data-v-5f84bad1><div class="app-schedule-title" data-v-5f84bad1>Bahasa Indonesia</div><div class="app-schedule-sub" data-v-5f84bad1>Kelas XII IPA 1 · Ruang 204</div></div></div><div class="app-schedule-item" data-v-5f84bad1><div class="app-schedule-time" data-v-5f84bad1>10:45</div><div class="app-schedule-dot" data-v-5f84bad1></div><div class="app-schedule-text" data-v-5f84bad1><div class="app-schedule-title" data-v-5f84bad1>Ujian Fisika</div><div class="app-schedule-sub" data-v-5f84bad1>Kelas XII IPA 1 · Lab 1</div></div></div></div><div class="app-nav w-64 absolute bottom-6 left-6" data-v-5f84bad1><div class="app-nav-item active" data-v-5f84bad1><span class="app-nav-icon" data-v-5f84bad1>🏠</span></div><div class="app-nav-item" data-v-5f84bad1><span class="app-nav-icon" data-v-5f84bad1>📅</span></div><div class="app-nav-item" data-v-5f84bad1><span class="app-nav-icon" data-v-5f84bad1>📊</span></div><div class="app-nav-item" data-v-5f84bad1><span class="app-nav-icon" data-v-5f84bad1>👤</span></div></div></div></div><div class="float-card float-card--top" data-v-5f84bad1><span class="float-icon" data-v-5f84bad1>✅</span><div data-v-5f84bad1><div class="float-title" data-v-5f84bad1>Absensi berhasil</div><div class="float-sub" data-v-5f84bad1>Tercatat 07:28 WIB</div></div></div><div class="float-card float-card--bottom" data-v-5f84bad1><span class="float-icon wa" data-v-5f84bad1>💬</span><div data-v-5f84bad1><div class="float-title" data-v-5f84bad1>WhatsApp terkirim</div><div class="float-sub" data-v-5f84bad1>Nilai Ujian Fisika telah diperbarui</div></div></div></div><div data-v-5f84bad1><div class="section-header reveal" data-v-5f84bad1><div class="section-eyebrow" data-v-5f84bad1>Fitur &amp; Layanan</div><h2 class="section-title" id="layanan-title" data-v-5f84bad1> Satu aplikasi,<br data-v-5f84bad1><span class="text-gradient" data-v-5f84bad1>Untuk semua kebutuhan sekolah.</span></h2></div><div class="layanan-features" data-v-5f84bad1><!--[-->`);
      ssrRenderList(serviceFeatures, (feat, i) => {
        _push(`<div class="svc-feature reveal" style="${ssrRenderStyle({ transitionDelay: `${(i + 1) * 0.1}s` })}" data-v-5f84bad1><div class="svc-feature-icon" style="${ssrRenderStyle({ background: feat.bg })}" data-v-5f84bad1>${ssrInterpolate(feat.icon)}</div><div class="svc-feature-text" data-v-5f84bad1><div class="title" data-v-5f84bad1>${ssrInterpolate(feat.title)}</div><div class="desc" data-v-5f84bad1>${ssrInterpolate(feat.desc)}</div></div></div>`);
      });
      _push(`<!--]--></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/ServicesSection.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const ServicesSection = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-5f84bad1"]]);
const _sfc_main$6 = {
  __name: "HowItWorksSection",
  __ssrInlineRender: true,
  setup(__props) {
    const steps = [
      { num: "01", title: "Daftar Akun", desc: "Daftar gratis dengan email sekolah. Tidak perlu kartu kredit." },
      { num: "02", title: "Setup Sekolah", desc: "Isi profil sekolah, import data siswa & guru via Excel atau formulir." },
      { num: "03", title: "Konfigurasi Kelas", desc: "Buat mata pelajaran, jadwal, dan kurikulum sesuai kebutuhan sekolah." },
      { num: "04", title: "Mulai Belajar", desc: "Platform siap digunakan. Siswa dan guru bisa langsung login hari ini." }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "how-section",
        id: "cara-kerja",
        "aria-labelledby": "how-title"
      }, _attrs))} data-v-b4e86c0a><div class="container" data-v-b4e86c0a><div class="section-header centered reveal" data-v-b4e86c0a><div class="section-eyebrow" data-v-b4e86c0a>Cara Memulai</div><h2 class="section-title" id="how-title" data-v-b4e86c0a>Mulai dalam 4 langkah mudah</h2><p class="section-desc" data-v-b4e86c0a> Proses pendaftaran hingga aktivasi dirancang sederhana, cepat, mudah dan sepenuhnya otomatis. </p></div><div class="steps-grid" data-v-b4e86c0a><!--[-->`);
      ssrRenderList(steps, (step, i) => {
        _push(`<div class="step-item reveal" style="${ssrRenderStyle({ transitionDelay: `${i * 0.1}s` })}" data-v-b4e86c0a><div class="step-num" data-v-b4e86c0a>${ssrInterpolate(step.num)}</div><h3 class="step-title" data-v-b4e86c0a>${ssrInterpolate(step.title)}</h3><p class="step-desc" data-v-b4e86c0a>${ssrInterpolate(step.desc)}</p></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/HowItWorksSection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const HowItWorksSection = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-b4e86c0a"]]);
const _sfc_main$5 = {
  __name: "FaqSection",
  __ssrInlineRender: true,
  setup(__props) {
    const faqs = [
      {
        q: "Apa itu Lumiverse School dan siapa yang cocok menggunakannya?",
        a: "Lumiverse School adalah platform Learning Management System (LMS) berbasis cloud yang dirancang untuk memudahkan sekolah dalam mengelola pembelajaran dan administrasi secara digital. Seluruh kebutuhan seperti absensi, rekap absen otomatis, analitik kehadiran siswa, materi / modul pembelajaran, tugas harian siswa, ujian online, rekap nilai otomatis, hingga komunikasi dengan orang tua tersedia dalam satu platform. Cocok untuk sekolah maupun lembaga pendidikan yang ingin bertransformasi digital dengan cepat dan mudah tanpa memerlukan tim IT khusus."
      },
      {
        q: "Berapa lama proses onboarding hingga Lumiverse School siap digunakan?",
        a: "Sekolah Anda dapat mulai menggunakan Lumiverse School dalam waktu kurang dari 1 menit setelah menyelesaikan proses pendaftaran. Seluruh proses aktivasi dilakukan secara otomatis, sehingga Anda tidak perlu menghubungi sales atau menunggu proses integrasi manual."
      },
      {
        q: "Apakah data sekolah kami aman dan terpisah dari sekolah lain?",
        a: "Tentu. Setiap sekolah memiliki lingkungan yang terisolasi sehingga seluruh data tetap aman dan tidak pernah bercampur dengan sekolah lain. Seluruh komunikasi data dilindungi melalui koneksi HTTPS/TLS (SSL) yang terenkripsi serta sistem hak akses berdasarkan peran untuk memastikan setiap pengguna hanya dapat mengakses informasi yang menjadi kewenangannya."
      },
      {
        q: "Apakah Lumiverse School tetap stabil saat digunakan untuk ujian serentak?",
        a: "Tentu. Lumiverse School telah digunakan oleh sekolah mitra kami selama lebih dari dua tahun. Platform ini juga telah melalui uji coba secara langsung dengan 2.374 siswa dan guru yang mengakses sistem secara bersamaan saat pelaksanaan ujian, serta pengujian beban (load testing) dengan simulasi ratusan ribu pengguna. Seluruh pengujian tersebut menjadi dasar dalam membangun platform yang cepat, responsif, dan stabil untuk mendukung aktivitas pembelajaran maupun ujian online."
      },
      // {
      //     q: 'Apakah bisa mengintegrasikan sistem yang sudah kami pakai sekarang?',
      //     a: 'Bisa. Kami menyediakan REST API, webhook events, serta SDK resmi untuk Laravel dan Vue.js sehingga sistem existing sekolah — misalnya aplikasi pendaftaran atau portal keuangan — dapat terhubung tanpa perlu membangun ulang dari nol.',
      // },
      {
        q: "Berapa biaya berlangganan dan apakah ada masa uji coba?",
        a: "Biaya disesuaikan dengan jumlah pengguna aktif dan modul yang digunakan. Kami menyediakan masa uji coba gratis untuk sekolah yang ingin melihat dan merasakan secara langsung bagaimana Lumiverse School bekerja sebelum berkomitmen jangka panjang. Hubungi tim kami untuk penawaran yang sesuai."
      },
      {
        q: "Apakah tersedia dukungan teknis jika terjadi kendala?",
        a: "Tim support kami tersedia melalui WhatsApp, email, dan panduan dokumentasi lengkap. Untuk isu krusial seperti pelaksanaan ujian, kami menyediakan jalur prioritas agar kendala dapat ditangani secepat mungkin."
      }
    ];
    const openIndex = ref(-1);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "faq-section",
        id: "faq",
        "aria-labelledby": "faq-title"
      }, _attrs))} data-v-1f9ec48e><div class="container" data-v-1f9ec48e><div class="faq-layout" data-v-1f9ec48e><div class="faq-intro reveal" data-v-1f9ec48e><div class="section-eyebrow" data-v-1f9ec48e>Pertanyaan Umum</div><h2 class="section-title" id="faq-title" data-v-1f9ec48e> Masih ada yang<br data-v-1f9ec48e><span class="text-cyan" data-v-1f9ec48e>ingin ditanyakan?</span></h2><p class="section-desc" data-v-1f9ec48e> Temukan jawaban atas pertanyaan yang paling sering diajukan sebelum menggunakan Lumiverse School. </p><div class="contact-card sm:flex hidden" data-v-1f9ec48e><div class="contact-text" data-v-1f9ec48e><div class="contact-title" data-v-1f9ec48e>Selalu ada untuk membantu Anda</div><div class="contact-sub" data-v-1f9ec48e>Apabila Anda ingin mengetahui lebih lanjut mengenai fitur produk, harga layanan, atau solusi atas kendala yang dialami, kami selalu siap membantu Anda. Hubungi kami melaui email atau media sosial. Anda juga dapat mengunjungi Pusat Bantuan kami.</div></div><a href="https://wa.me/6281234567890" class="btn-hero" target="_blank" rel="noopener" data-v-1f9ec48e> Hubungi Kami <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" data-v-1f9ec48e><path d="M4 12H20" data-v-1f9ec48e></path><path d="M14 6L20 12L14 18" data-v-1f9ec48e></path></svg></a></div></div><div class="faq-list reveal" data-v-1f9ec48e><!--[-->`);
      ssrRenderList(faqs, (item, i) => {
        _push(`<div class="${ssrRenderClass([{ "faq-item--open": openIndex.value === i }, "faq-item"])}" style="${ssrRenderStyle({ "--i": i })}" data-v-1f9ec48e><button class="faq-question" type="button"${ssrRenderAttr("aria-expanded", openIndex.value === i)} data-v-1f9ec48e><span class="faq-index sm:inline-flex hidden" data-v-1f9ec48e>${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span><span class="faq-question-text" data-v-1f9ec48e>${ssrInterpolate(item.q)}</span><span class="faq-toggle" aria-hidden="true" data-v-1f9ec48e><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-v-1f9ec48e><path d="M5 12h14M12 5v14" class="plus-v" data-v-1f9ec48e></path></svg></span></button><div class="faq-answer-wrap" data-v-1f9ec48e><div class="faq-answer-inner" data-v-1f9ec48e><p class="faq-answer" data-v-1f9ec48e>${ssrInterpolate(item.a)}</p></div></div></div>`);
      });
      _push(`<!--]--></div><div class="contact-card flex sm:hidden" data-v-1f9ec48e><div class="contact-text" data-v-1f9ec48e><div class="contact-icon" data-v-1f9ec48e>💬</div><div class="contact-title" data-v-1f9ec48e>Kami selalu ada,<br data-v-1f9ec48e>untuk membantu Anda</div><div class="contact-sub" data-v-1f9ec48e>Apabila Anda ingin mengetahui lebih lanjut mengenai fitur produk, harga layanan, atau solusi atas kendala yang dialami, kami selalu siap membantu Anda. Hubungi kami melaui email atau media sosial. Anda juga dapat mengunjungi Pusat Bantuan kami.</div></div><a href="https://wa.me/6281234567890" class="btn-hero" target="_blank" rel="noopener" data-v-1f9ec48e> Hubungi Kami <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-v-1f9ec48e><path d="M5 12h14M13 6l6 6-6 6" data-v-1f9ec48e></path></svg></a></div></div></div></section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/FaqSection.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const FaqSection = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-1f9ec48e"]]);
const _sfc_main$4 = {
  setup(__props) {
    const docFeatures = [
      {
        icon: "📖",
        bg: "rgba(0,212,255,0.1)",
        title: "REST API Lengkap",
        desc: "Endpoint terdokumentasi untuk semua fitur: siswa, nilai, absensi, ujian, laporan, dan manajemen pengguna."
      },
      {
        icon: "🔔",
        bg: "rgba(245,166,35,0.1)",
        title: "Webhook & Event System",
        desc: "Subscribe ke events real-time: pendaftaran siswa baru, selesai ujian, upload materi, dan 20+ event lainnya."
      },
      {
        icon: "🧩",
        bg: "rgba(52,211,153,0.1)",
        title: "SDK Laravel & Vue",
        desc: "Package Composer dan NPM resmi untuk integrasi cepat ke sistem existing berbasis Laravel + Vue.js."
      },
      {
        icon: "🛟",
        bg: "rgba(167,139,250,0.1)",
        title: "Panduan Step-by-Step",
        desc: "Panduan lengkap dalam Bahasa Indonesia untuk admin, guru, dan siswa. Dari setup pertama hingga fitur lanjutan."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "docs-section",
        id: "docs",
        "aria-labelledby": "docs-title"
      }, _attrs))} data-v-6ab2eb1b><div class="container" data-v-6ab2eb1b><div class="docs-layout" data-v-6ab2eb1b><div class="docs-sidebar reveal" data-v-6ab2eb1b><div class="docs-topbar" data-v-6ab2eb1b><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="rgba(255,255,255,0.4)" data-v-6ab2eb1b><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-6ab2eb1b></path><polyline points="14 2 14 8 20 8" data-v-6ab2eb1b></polyline></svg><span class="docs-topbar-label" data-v-6ab2eb1b>docs.lumiverse.co.id</span></div><div class="docs-nav" data-v-6ab2eb1b><div class="docs-nav-group" data-v-6ab2eb1b><div class="docs-nav-title" data-v-6ab2eb1b>Memulai</div><div class="docs-nav-item active" data-v-6ab2eb1b>Pengenalan</div><div class="docs-nav-item" data-v-6ab2eb1b>Instalasi &amp; Setup</div><div class="docs-nav-item" data-v-6ab2eb1b>Manajemen Pengguna</div></div><div class="docs-nav-group" data-v-6ab2eb1b><div class="docs-nav-title" data-v-6ab2eb1b>API Reference</div><div class="docs-nav-item" data-v-6ab2eb1b>REST API v1</div><div class="docs-nav-item" data-v-6ab2eb1b>Webhook Events</div><div class="docs-nav-item" data-v-6ab2eb1b>SDK &amp; Library</div></div><div class="docs-nav-group" data-v-6ab2eb1b><div class="docs-nav-title" data-v-6ab2eb1b>Panduan</div><div class="docs-nav-item" data-v-6ab2eb1b>Panduan Guru</div><div class="docs-nav-item" data-v-6ab2eb1b>Panduan Admin</div></div></div><div class="docs-content-preview" data-v-6ab2eb1b><div class="docs-code" data-v-6ab2eb1b><span class="cyan" data-v-6ab2eb1b># Autentikasi API</span> Semua request ke API Lumiverse harus menyertakan Bearer token. <span class="gold" data-v-6ab2eb1b>curl</span> -X GET \\ https://api.lumiverse.co.id/v1/siswa \\ -H <span class="green" data-v-6ab2eb1b>&quot;Authorization: Bearer {token}&quot;</span> \\ -H <span class="green" data-v-6ab2eb1b>&quot;Accept: application/json&quot;</span></div></div></div><div data-v-6ab2eb1b><div class="section-header reveal" data-v-6ab2eb1b><div class="section-eyebrow" data-v-6ab2eb1b>Dokumentasi Lengkap</div><h2 class="section-title" id="docs-title" data-v-6ab2eb1b> Developer-first.<br data-v-6ab2eb1b><span class="text-cyan" data-v-6ab2eb1b>Docs yang benar-benar berguna.</span></h2><p class="section-desc" data-v-6ab2eb1b> Dokumentasi teknis lengkap, contoh kode nyata, dan panduan integrasi — tersedia dalam Bahasa Indonesia dan Inggris. </p></div><div class="docs-features" data-v-6ab2eb1b><!--[-->`);
      ssrRenderList(docFeatures, (feat, i) => {
        _push(`<div class="doc-feature reveal" style="${ssrRenderStyle({ transitionDelay: `${(i + 1) * 0.1}s` })}" data-v-6ab2eb1b><div class="doc-feature-icon" style="${ssrRenderStyle({ background: feat.bg })}" data-v-6ab2eb1b>${ssrInterpolate(feat.icon)}</div><div class="doc-feature-text" data-v-6ab2eb1b><div class="title" data-v-6ab2eb1b>${ssrInterpolate(feat.title)}</div><div class="desc" data-v-6ab2eb1b>${ssrInterpolate(feat.desc)}</div></div></div>`);
      });
      _push(`<!--]--></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/DocsSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const GAP = 24;
const _sfc_main$3 = {
  setup(__props) {
    const plans = [
      {
        tier: "Starter Pack",
        tierKey: "dasar",
        name: "Learning",
        desc: "Untuk sekolah kecil yang baru memulai perjalanan digitalisasi.",
        price: "Rp 199K",
        period: "/bln",
        priceNote: "atau Rp 1,9 juta/tahun (hemat 20%)",
        popular: false,
        accentVar: "--color-learning",
        features: [
          { included: true, text: "100+ User Account" },
          // { included: true, text: '5 akun guru' },
          { included: true, text: "Modul & materi belajar" },
          { included: true, text: "Ujian online dasar" },
          { included: true, text: "5 GB penyimpanan" },
          { included: false, text: "Rapor digital" },
          { included: false, text: "Notifikasi WhatsApp" },
          { included: false, text: "Akses API" }
        ],
        btnClass: "btn-learning",
        btnText: "Coba Gratis Sekarang",
        btnHref: "/registration"
      },
      {
        tier: "Modular",
        tierKey: "popular",
        name: "Understanding",
        desc: "Untuk sekolah menengah dengan kebutuhan yang lebih lengkap.",
        price: "Rp 599K",
        period: "/bln",
        priceNote: "atau Rp 3,8 juta/tahun (hemat 20%)",
        popular: true,
        accentVar: "--color-understanding",
        features: [
          { included: true, text: "300+ User Account" },
          // { included: true, text: '20 akun guru' },
          { included: true, text: "Semua fitur Learning" },
          { included: true, text: "Rapor digital" },
          { included: true, text: "25 GB penyimpanan" },
          { included: true, text: "Notifikasi WhatsApp" },
          { included: false, text: "Analitik lanjutan" },
          { included: false, text: "Akses API" }
        ],
        btnClass: "btn-understanding",
        btnText: "Coba Gratis Sekarang",
        btnHref: "/registration"
      },
      {
        tier: "Enterprise",
        tierKey: "unggulan",
        name: "Mastering",
        desc: "Pilihan terbaik untuk sekolah aktif dengan ekosistem digital penuh.",
        price: "Rp 899K",
        period: "/bln",
        priceNote: "atau Rp 6,7 juta/tahun (hemat 20%)",
        popular: false,
        accentVar: "--color-mastering",
        features: [
          { included: true, text: "500+ Pengguna / Anggota" },
          // { included: true, text: 'Guru tidak terbatas' },
          { included: true, text: "Semua fitur Understanding" },
          { included: true, text: "Absensi digital" },
          { included: true, text: "Analitik lanjutan" },
          { included: true, text: "100 GB penyimpanan" },
          { included: true, text: "Akses REST API" },
          { included: false, text: "White-label & custom domain" }
        ],
        btnClass: "btn-mastering",
        btnText: "Coba Gratis Sekarang",
        btnHref: "/registration"
      },
      {
        tier: "Expertise",
        tierKey: "expertise",
        name: "Inspiring",
        desc: "Untuk institusi besar dengan branding sendiri dan integrasi penuh.",
        price: "Rp 1.299K",
        period: "/bln",
        priceNote: "atau Rp 11,5 juta/tahun (hemat 20%)",
        popular: false,
        accentVar: "--color-inspiring",
        features: [
          { included: true, text: "800+ User Account" },
          { included: true, text: "Semua fitur Mastering" },
          { included: true, text: "White-label & custom domain" },
          { included: true, text: "Integrasi sistem existing" },
          { included: true, text: "500 GB penyimpanan" },
          { included: true, text: "SLA 99.9% uptime" },
          { included: true, text: "Priority support" },
          { included: false, text: "Dedicated support manager" }
        ],
        btnClass: "btn-inspiring",
        btnText: "Coba Gratis Sekarang",
        btnHref: "/registration"
      },
      {
        tier: "Pro Max",
        tierKey: "promax",
        name: "Universe",
        desc: "Untuk institusi besar dengan branding sendiri dan integrasi penuh.",
        price: "Rp 1.799K",
        period: "/bln",
        priceNote: "atau Rp 11,5 juta/tahun (hemat 20%)",
        popular: false,
        accentVar: "--color-inspiring",
        features: [
          { included: true, text: "1000+ User Account" },
          { included: true, text: "Semua fitur Mastering" },
          { included: true, text: "White-label & custom domain" },
          { included: true, text: "Integrasi sistem existing" },
          { included: true, text: "500 GB penyimpanan" },
          { included: true, text: "SLA 99.9% uptime" },
          { included: true, text: "Priority support" },
          { included: false, text: "Dedicated support manager" }
        ],
        btnClass: "btn-inspiring",
        btnText: "Coba Gratis Sekarang",
        btnHref: "/registration"
      }
      // {
      //     tier: 'Paket Enterprise',
      //     tierKey: 'promax',
      //     name: 'Custom Yayasan',
      //     desc: 'Untuk yayasan multi-unit dengan kebutuhan custom dan skala enterprise.',
      //     price: 'Custom',
      //     period: '',
      //     priceNote: 'Hubungi kami untuk penawaran khusus',
      //     popular: false,
      //     accentVar: '--color-promax',
      //     features: [
      //         { included: true, text: 'Siswa tidak terbatas' },
      //         { included: true, text: 'Multi-unit sekolah' },
      //         { included: true, text: 'Semua fitur Inspiring' },
      //         { included: true, text: 'Penyimpanan tidak terbatas' },
      //         { included: true, text: 'SLA 99.99% uptime' },
      //         { included: true, text: 'Dedicated support manager' },
      //         { included: true, text: 'Onboarding & pelatihan tim' },
      //         { included: true, text: 'Custom development' },
      //     ],
      //     btnClass: 'btn-promax',
      //     btnText: 'Hubungi Tim Sales',
      //     btnHref: 'mailto:sales@kreaticraft.id',
      // },
    ];
    const track = ref(null);
    const spacerStart = ref(null);
    ref([]);
    const currentIndex = ref(2);
    ref(false);
    ref(0);
    ref(0);
    const CARD_WIDTH = ref(300);
    function getCardWidth() {
      if (window.innerWidth <= 480) return window.innerWidth - 72;
      if (window.innerWidth <= 768) return 260;
      return 300;
    }
    function updateCardWidth() {
      CARD_WIDTH.value = getCardWidth();
    }
    function getSpacerWidth() {
      return spacerStart.value ? spacerStart.value.offsetWidth : 0;
    }
    function scrollToIndex(idx, smooth = true) {
      if (!track.value) return;
      const clamped = Math.max(0, Math.min(idx, plans.length - 1));
      currentIndex.value = clamped;
      const trackWidth = track.value.clientWidth;
      const spacerW = getSpacerWidth();
      const cardPos = spacerW + clamped * (CARD_WIDTH.value + GAP);
      const offset = cardPos - (trackWidth / 2 - CARD_WIDTH.value / 2);
      track.value.scrollTo({ left: Math.max(0, offset), behavior: smooth ? "smooth" : "instant" });
    }
    onMounted(() => {
      updateCardWidth();
      window.addEventListener("resize", () => {
        updateCardWidth();
        nextTick(() => scrollToIndex(currentIndex.value, false));
      });
      nextTick(() => setTimeout(() => scrollToIndex(2, false), 60));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "pricing-section",
        id: "harga",
        "aria-labelledby": "pricing-title",
        tabindex: "-1"
      }, _attrs))} data-v-ead2fb42><div class="container" data-v-ead2fb42><div class="section-header centered reveal" data-v-ead2fb42><div class="section-eyebrow" data-v-ead2fb42>Daftar Harga &amp; Paket Layanan</div><h2 class="section-title" id="pricing-title" data-v-ead2fb42> Harga transparan tanpa biaya tersembunyi </h2><p class="section-desc" data-v-ead2fb42> Pilih paket plan yang sesuai dengan ukuran dan kebutuhan lembaga pendidikan Anda.<br data-v-ead2fb42> Upgrade atau downgrade kapanpun, tanpa penalti. </p></div><div class="slider-root" data-v-ead2fb42><button class="slider-arrow arrow-left"${ssrIncludeBooleanAttr(currentIndex.value === 0) ? " disabled" : ""} aria-label="Sebelumnya" data-v-ead2fb42><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-ead2fb42><polyline points="15 18 9 12 15 6" data-v-ead2fb42></polyline></svg></button><div class="slider-track" data-v-ead2fb42><div class="track-spacer" aria-hidden="true" data-v-ead2fb42></div><!--[-->`);
      ssrRenderList(plans, (plan, i) => {
        _push(`<div class="${ssrRenderClass([[
          "card-" + plan.tierKey,
          { "card-active": currentIndex.value === i },
          { "card-side": Math.abs(currentIndex.value - i) === 1 },
          { "card-far": Math.abs(currentIndex.value - i) >= 2 },
          { popular: plan.popular }
        ], "pricing-card"])}" style="${ssrRenderStyle({ "--accent": `var(${plan.accentVar})` })}" data-v-ead2fb42>`);
        if (plan.popular && currentIndex.value === i) {
          _push(`<div class="popular-badge" data-v-ead2fb42>✦ Paling Populer</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="card-top" data-v-ead2fb42><div class="pricing-tier" data-v-ead2fb42>${ssrInterpolate(plan.tier)}</div><div class="pricing-name" data-v-ead2fb42>${ssrInterpolate(plan.name)}</div><div class="pricing-desc" data-v-ead2fb42>${ssrInterpolate(plan.desc)}</div></div><div class="pricing-price" data-v-ead2fb42><div class="price-amount" data-v-ead2fb42>${ssrInterpolate(plan.price)}`);
        if (plan.period) {
          _push(`<span class="price-period" data-v-ead2fb42>${ssrInterpolate(plan.period)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="price-note" data-v-ead2fb42>${ssrInterpolate(plan.priceNote)}</div></div><div class="pricing-features" data-v-ead2fb42><!--[-->`);
        ssrRenderList(plan.features, (feat) => {
          _push(`<div class="${ssrRenderClass([{ "feat-off": !feat.included }, "pricing-feature"])}" data-v-ead2fb42><span class="feat-icon" data-v-ead2fb42>${ssrInterpolate(feat.included ? "✓" : "✕")}</span><span data-v-ead2fb42>${ssrInterpolate(feat.text)}</span></div>`);
        });
        _push(`<!--]--></div><a${ssrRenderAttr("href", plan.btnHref)} class="${ssrRenderClass([plan.btnClass, "btn-plan"])}"${ssrRenderAttr("tabindex", currentIndex.value === i ? 0 : -1)} data-v-ead2fb42>${ssrInterpolate(plan.btnText)}</a></div>`);
      });
      _push(`<!--]--><div class="track-spacer" aria-hidden="true" data-v-ead2fb42></div></div><button class="slider-arrow arrow-right"${ssrIncludeBooleanAttr(currentIndex.value === plans.length - 1) ? " disabled" : ""} aria-label="Berikutnya" data-v-ead2fb42><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-ead2fb42><polyline points="9 18 15 12 9 6" data-v-ead2fb42></polyline></svg></button></div><div class="slider-dots" role="tablist" data-v-ead2fb42><!--[-->`);
      ssrRenderList(plans, (plan, i) => {
        _push(`<button class="${ssrRenderClass([{ "dot-active": currentIndex.value === i }, "dot"])}" style="${ssrRenderStyle(currentIndex.value === i ? { background: `var(${plan.accentVar})` } : {})}"${ssrRenderAttr("aria-label", plan.name)} role="tab"${ssrRenderAttr("aria-selected", currentIndex.value === i)} data-v-ead2fb42></button>`);
      });
      _push(`<!--]--></div><div class="slider-labels" data-v-ead2fb42><!--[-->`);
      ssrRenderList(plans, (plan, i) => {
        _push(`<span class="${ssrRenderClass([{ "label-active": currentIndex.value === i }, "slider-label"])}" style="${ssrRenderStyle(currentIndex.value === i ? { color: `var(${plan.accentVar})`, borderColor: `color-mix(in srgb, var(${plan.accentVar}) 30%, transparent)`, background: `color-mix(in srgb, var(${plan.accentVar}) 8%, transparent)` } : {})}" data-v-ead2fb42>${ssrInterpolate(plan.name)}</span>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/PricingSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "TestimonialsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const testimonials = [
      {
        text: "Sejak pakai Lumiverse, proses rekap nilai dan pembuatan rapor yang dulu butuh 2 minggu sekarang bisa selesai dalam 2 jam. Luar biasa efisiennya!",
        name: "Aditya Dwi Anggara, M.Pd",
        role: "Waka Kurikulum, SMK Nusantara",
        initials: "AD",
        avatarGradient: ""
      },
      {
        text: "Fitur pembuatan modul pelatihan dan pengembangan karyawan yang sangat membantu. Mereka sekarang jadi lebih cepat untuk mengakses modul sebagai bahan bacaan dan pembelajaran untuk perkembangan skill mereka.",
        name: "Ade Kurniawan",
        role: "Kepala Toko, Koperasi Desa Sejahtera",
        initials: "AS",
        avatarGradient: "linear-gradient(135deg,var(--gold-dim),var(--navy-light))"
      },
      {
        text: "Sangat membantu saya untuk keperluan recruitment pegawai baru. Bisa melakukan test / psikotest terhadap karyawan baru secara daring dengan visual yang lebih modern dan futuristic.",
        name: "Ahmad Prasetyo",
        role: "HR Staff, PT Jala Lintas Media",
        initials: "AP",
        avatarGradient: "linear-gradient(135deg,#7dd3fc,var(--navy-light))"
      },
      {
        text: "Onboarding sekolah kami hanya butuh waktu seminggu. Tim support sangat responsif menjawab pertanyaan teknis maupun non-teknis dari guru-guru kami.",
        name: "Siti Nurhaliza, S.Pd",
        role: "Kepala Sekolah, SMA Cendekia Bangsa",
        initials: "SN",
        avatarGradient: "linear-gradient(135deg,#a78bfa,var(--navy-light))"
      },
      {
        text: "Notifikasi WhatsApp otomatis ke orang tua benar-benar mengurangi beban admin. Tidak ada lagi telepon manual satu per satu saat ada pengumuman penting.",
        name: "Bagus Setiawan",
        role: "Staff TU, MA Al-Hikmah",
        initials: "BS",
        avatarGradient: "linear-gradient(135deg,#34d399,var(--navy-light))"
      }
    ];
    ref(null);
    const activeIndex = ref(0);
    const perView = ref(3);
    let autoplayTimer = null;
    function updatePerView() {
      const w = window.innerWidth;
      perView.value = w <= 768 ? 1 : w <= 1100 ? 2 : 3;
      if (activeIndex.value > maxIndex.value) {
        activeIndex.value = maxIndex.value;
      }
    }
    const maxIndex = ref(0);
    function recalcMaxIndex() {
      maxIndex.value = Math.max(0, testimonials.length - perView.value);
    }
    function next() {
      activeIndex.value = activeIndex.value >= maxIndex.value ? 0 : activeIndex.value + 1;
    }
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        next();
      }, 5e3);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
    function handleResize() {
      updatePerView();
      recalcMaxIndex();
    }
    onMounted(() => {
      updatePerView();
      recalcMaxIndex();
      startAutoplay();
      window.addEventListener("resize", handleResize);
    });
    onBeforeUnmount(() => {
      stopAutoplay();
      window.removeEventListener("resize", handleResize);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "testimonials-section",
        id: "testimonial",
        "aria-labelledby": "testimonials-title"
      }, _attrs))} data-v-bc7d0be3><div class="container" data-v-bc7d0be3><div class="section-header centered reveal" data-v-bc7d0be3><div class="section-eyebrow" data-v-bc7d0be3>Apa kata mereka</div><h2 class="section-title" id="testimonials-title" data-v-bc7d0be3> Dipercaya 100+ lembaga pendidikan di Indonesia </h2></div><div class="carousel reveal" data-v-bc7d0be3><button class="carousel-arrow carousel-arrow--prev" type="button" aria-label="Sebelumnya" data-v-bc7d0be3><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-v-bc7d0be3><path d="M15 18l-6-6 6-6" data-v-bc7d0be3></path></svg></button><div class="carousel-viewport" data-v-bc7d0be3><div class="carousel-track" style="${ssrRenderStyle({
        transform: `translateX(calc(-${activeIndex.value} * (100% / ${perView.value})))`
      })}" data-v-bc7d0be3><!--[-->`);
      ssrRenderList(testimonials, (t) => {
        _push(`<div class="carousel-slide" style="${ssrRenderStyle({ "--per-view": perView.value })}" data-v-bc7d0be3><div class="testimonial-card" data-v-bc7d0be3><div class="testimonial-stars" data-v-bc7d0be3>★★★★★</div><p class="testimonial-text" data-v-bc7d0be3>&quot;${ssrInterpolate(t.text)}&quot;</p><div class="testimonial-author" data-v-bc7d0be3><div class="author-avatar" style="${ssrRenderStyle(t.avatarGradient ? { background: t.avatarGradient } : {})}" data-v-bc7d0be3>${ssrInterpolate(t.initials)}</div><div data-v-bc7d0be3><div class="author-name" data-v-bc7d0be3>${ssrInterpolate(t.name)}</div><div class="author-role" data-v-bc7d0be3>${ssrInterpolate(t.role)}</div></div></div></div></div>`);
      });
      _push(`<!--]--></div></div><button class="carousel-arrow carousel-arrow--next" type="button" aria-label="Berikutnya" data-v-bc7d0be3><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-v-bc7d0be3><path d="M9 18l6-6-6-6" data-v-bc7d0be3></path></svg></button></div><div class="carousel-dots" role="tablist" data-v-bc7d0be3><!--[-->`);
      ssrRenderList(maxIndex.value + 1, (i) => {
        _push(`<button class="${ssrRenderClass([{ "carousel-dot--active": activeIndex.value === i - 1 }, "carousel-dot"])}" type="button"${ssrRenderAttr("aria-label", `Ke slide ${i}`)} data-v-bc7d0be3></button>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/TestimonialsSection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TestimonialsSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-bc7d0be3"]]);
const _sfc_main$1 = {
  __name: "CtaSection",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "cta-section",
        id: "cta",
        "aria-labelledby": "cta-title"
      }, _attrs))} data-v-3d2deef3><div class="container" data-v-3d2deef3><div class="cta-box reveal" data-v-3d2deef3><h2 class="cta-title" id="cta-title" data-v-3d2deef3> Siap transformasi <span class="sm:inline-flex hidden" data-v-3d2deef3>digital</span><br data-v-3d2deef3><span class="gradient-text" data-v-3d2deef3>bersama kami?</span></h2><p class="cta-desc" data-v-3d2deef3> Pendaftaran gratis. Tanpa skill teknis. Setup mudah dalam 2 menit. </p><div class="cta-actions" data-v-3d2deef3><a href="https://wa.me/628987504976" class="btn-outline" target="_blank" rel="noopener noreferrer" data-v-3d2deef3> 💬 Chat via WhatsApp </a>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/registration",
        class: "btn-hero"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Daftar Gratis Sekarang <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-3d2deef3${_scopeId}><path d="M3 12H21" data-v-3d2deef3${_scopeId}></path><path d="M15 6L21 12L15 18" data-v-3d2deef3${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" Daftar Gratis Sekarang "),
              (openBlock(), createBlock("svg", {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, [
                createVNode("path", { d: "M3 12H21" }),
                createVNode("path", { d: "M15 6L21 12L15 18" })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></section>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/CtaSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CtaSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3d2deef3"]]);
const _sfc_main = /* @__PURE__ */ Object.assign({
  layout: _sfc_main$b
}, {
  __name: "School",
  __ssrInlineRender: true,
  setup(__props) {
    onMounted(() => {
      document.documentElement.classList.add("dark");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Lumiverse School</title><meta head-key="description" name="description" content="Lumiverse merupakan sebuah platform Learning Management System berbasis cloud yang hadir untuk memberikan solusi dan kemudahan bagi sekolah dan intansi lembaga pendidikan lainnya di Indonesia."${_scopeId}><meta head-key="og:type" property="og:type" content="website"${_scopeId}><meta head-key="og:site_name" property="og:site_name" content="Lumiverse School"${_scopeId}><meta head-key="og:url" property="og:url" content="https://lumiverse.co.id/"${_scopeId}><meta head-key="og:title" property="og:title" content="Lumiverse School"${_scopeId}><meta head-key="og:description" property="og:description" content="Platform LMS gratis berbasis cloud untuk sekolah, pesantren, dan lembaga pendidikan di Indonesia. Kelola kelas, materi pembelajaran online, tugas harian siswa, ujian online, rekap nilai siswa otomatis, rapor digital, presensi siswa, rekap absensi siswa otomatis dalam satu sistem."${_scopeId}><meta head-key="og:image" property="og:image" content="https://lumiverse.co.id/og-image-lms.jpg"${_scopeId}><meta head-key="og:locale" property="og:locale" content="id_ID"${_scopeId}><meta head-key="twitter:card" name="twitter:card" content="summary_large_image"${_scopeId}><meta head-key="twitter:title" name="twitter:title" content="Lumiverse — Sistem LMS Sekolah Berbasis Cloud"${_scopeId}><meta head-key="twitter:description" name="twitter:description" content="LMS cloud untuk sekolah dan lembaga pendidikan di Indonesia. Cepat, aman, dan mudah digunakan guru maupun siswa."${_scopeId}><meta head-key="twitter:image" name="twitter:image" content="https://lumiverse.co.id/og-image-lms.jpg"${_scopeId}><link head-key="canonical" rel="canonical" href="https://lumiverse.co.id/"${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, "Lumiverse School"),
              createVNode("meta", {
                "head-key": "description",
                name: "description",
                content: "Lumiverse merupakan sebuah platform Learning Management System berbasis cloud yang hadir untuk memberikan solusi dan kemudahan bagi sekolah dan intansi lembaga pendidikan lainnya di Indonesia."
              }),
              createVNode("meta", {
                "head-key": "og:type",
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                "head-key": "og:site_name",
                property: "og:site_name",
                content: "Lumiverse School"
              }),
              createVNode("meta", {
                "head-key": "og:url",
                property: "og:url",
                content: "https://lumiverse.co.id/"
              }),
              createVNode("meta", {
                "head-key": "og:title",
                property: "og:title",
                content: "Lumiverse School"
              }),
              createVNode("meta", {
                "head-key": "og:description",
                property: "og:description",
                content: "Platform LMS gratis berbasis cloud untuk sekolah, pesantren, dan lembaga pendidikan di Indonesia. Kelola kelas, materi pembelajaran online, tugas harian siswa, ujian online, rekap nilai siswa otomatis, rapor digital, presensi siswa, rekap absensi siswa otomatis dalam satu sistem."
              }),
              createVNode("meta", {
                "head-key": "og:image",
                property: "og:image",
                content: "https://lumiverse.co.id/og-image-lms.jpg"
              }),
              createVNode("meta", {
                "head-key": "og:locale",
                property: "og:locale",
                content: "id_ID"
              }),
              createVNode("meta", {
                "head-key": "twitter:card",
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                "head-key": "twitter:title",
                name: "twitter:title",
                content: "Lumiverse — Sistem LMS Sekolah Berbasis Cloud"
              }),
              createVNode("meta", {
                "head-key": "twitter:description",
                name: "twitter:description",
                content: "LMS cloud untuk sekolah dan lembaga pendidikan di Indonesia. Cepat, aman, dan mudah digunakan guru maupun siswa."
              }),
              createVNode("meta", {
                "head-key": "twitter:image",
                name: "twitter:image",
                content: "https://lumiverse.co.id/og-image-lms.jpg"
              }),
              createVNode("link", {
                "head-key": "canonical",
                rel: "canonical",
                href: "https://lumiverse.co.id/"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(ssrRenderComponent(StatsSection, null, null, _parent));
      _push(ssrRenderComponent(ServicesSection, null, null, _parent));
      _push(ssrRenderComponent(ValuesSection, null, null, _parent));
      _push(ssrRenderComponent(HowItWorksSection, null, null, _parent));
      _push(ssrRenderComponent(TestimonialsSection, null, null, _parent));
      _push(ssrRenderComponent(CtaSection, null, null, _parent));
      _push(ssrRenderComponent(FaqSection, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home/School.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
