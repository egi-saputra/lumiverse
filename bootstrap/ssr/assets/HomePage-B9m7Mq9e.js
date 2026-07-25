import { computed, ref, onMounted, onUnmounted, mergeProps, useSSRContext, unref, withCtx, createVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent } from "vue/server-renderer";
import { usePage, Head } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main$9 = {
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const logoUrl = computed(() => page.props.logoUrl ?? "/images/default.png");
    const profil = computed(() => page.props.profilSekolah ?? {});
    const isScrolled = ref(false);
    const isMenuOpen = ref(false);
    const activeSection = ref("home");
    const navLinks = [
      { id: "home", label: "Beranda" },
      { id: "about", label: "Tentang" },
      { id: "programs", label: "Program" },
      { id: "testimonials", label: "Alumni" },
      { id: "spmb", label: "SPMB" },
      { id: "contact", label: "Kontak" }
    ];
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            activeSection.value = link.id;
          }
        }
      }
    };
    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    });
    onUnmounted(() => window.removeEventListener("scroll", handleScroll));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: ["smk-nav", { scrolled: isScrolled.value }]
      }, _attrs))} data-v-0f4272ad><div class="nav-inner" data-v-0f4272ad><button class="nav-logo" data-v-0f4272ad><span class="logo-emblem" data-v-0f4272ad><img${ssrRenderAttr("src", logoUrl.value)} class="sm:h-14 h-8 object-cover" alt="Logo" loading="lazy" data-v-0f4272ad></span><span class="logo-text" data-v-0f4272ad><span class="logo-primary mb-1 uppercase" data-v-0f4272ad>${ssrInterpolate(profil.value.namaSekolah ?? "-")}</span><span class="logo-secondary" data-v-0f4272ad>Lumi Platforms, Inc. Collaboration</span></span></button><ul class="nav-links" data-v-0f4272ad><!--[-->`);
      ssrRenderList(navLinks, (link) => {
        _push(`<li data-v-0f4272ad><button class="${ssrRenderClass(["nav-link", { active: activeSection.value === link.id }])}" data-v-0f4272ad>${ssrInterpolate(link.label)}</button></li>`);
      });
      _push(`<!--]--></ul><div class="nav-cta" data-v-0f4272ad><button class="btn-outline-gold hero-btn" data-v-0f4272ad> Login <svg width="14" height="14" viewBox="0 0 14 14" fill="none" data-v-0f4272ad><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-0f4272ad></path></svg></button></div><button class="burger"${ssrRenderAttr("aria-expanded", isMenuOpen.value)} data-v-0f4272ad><span class="${ssrRenderClass(["burger-line", { open: isMenuOpen.value }])}" data-v-0f4272ad></span><span class="${ssrRenderClass(["burger-line", { open: isMenuOpen.value }])}" data-v-0f4272ad></span><span class="${ssrRenderClass(["burger-line", { open: isMenuOpen.value }])}" data-v-0f4272ad></span></button></div><div class="${ssrRenderClass(["mobile-menu", { open: isMenuOpen.value }])}" data-v-0f4272ad><ul class="mobile-links" data-v-0f4272ad><!--[-->`);
      ssrRenderList(navLinks, (link, i) => {
        _push(`<li style="${ssrRenderStyle(`--i: ${i}`)}" data-v-0f4272ad><button class="${ssrRenderClass(["mobile-link", { active: activeSection.value === link.id }])}" data-v-0f4272ad>${ssrInterpolate(link.label)}</button></li>`);
      });
      _push(`<!--]--></ul><div class="mobile-cta-group" data-v-0f4272ad><button class="btn-login mobile-btn" data-v-0f4272ad> Login </button><button class="btn-gold-solid mobile-btn" data-v-0f4272ad> Daftar </button></div></div></nav>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Landing/Navbar.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-0f4272ad"]]);
const autoplayDuration = 5500;
const _sfc_main$8 = {
  __name: "HeroSection",
  __ssrInlineRender: true,
  setup(__props) {
    const mounted = ref(false);
    const currentSlide = ref(0);
    const prevSlide = ref(-1);
    const direction = ref(1);
    const isAnimating = ref(false);
    const progressWidth = ref(0);
    const slideReady = ref(false);
    let autoplayTimer = null;
    let progressRaf = null;
    let progressStart = null;
    const slides = ref([]);
    async function fetchSlides() {
      try {
        const res = await fetch("/api/v1/hero-slides");
        const data = await res.json();
        slides.value = data;
      } catch (e) {
        console.error("Gagal memuat hero slides:", e);
        slides.value = [];
      } finally {
        slideReady.value = true;
      }
    }
    const active = computed(() => slides.value[currentSlide.value] ?? null);
    const prev = computed(() => prevSlide.value >= 0 ? slides.value[prevSlide.value] ?? null : null);
    const stats = [
      { num: "18+", label: "Tahun Berdiri" },
      { num: "5K+", label: "Alumni" },
      { num: "75+", label: "Mitra Industri" },
      { num: "99%", label: "Kelulusan" }
    ];
    function startProgress() {
      progressWidth.value = 0;
      progressStart = performance.now();
      cancelAnimationFrame(progressRaf);
      function step(now) {
        const elapsed = now - progressStart;
        progressWidth.value = Math.min(elapsed / autoplayDuration * 100, 100);
        if (elapsed < autoplayDuration) progressRaf = requestAnimationFrame(step);
      }
      progressRaf = requestAnimationFrame(step);
    }
    function goTo(index, dir = 1) {
      if (isAnimating.value || index === currentSlide.value) return;
      isAnimating.value = true;
      direction.value = dir;
      prevSlide.value = currentSlide.value;
      currentSlide.value = index;
      startProgress();
      setTimeout(() => {
        prevSlide.value = -1;
        isAnimating.value = false;
      }, 750);
    }
    function next(userTriggered = false) {
      if (!slides.value.length) return;
      goTo((currentSlide.value + 1) % slides.value.length, 1);
      if (userTriggered) resetAutoplay();
    }
    function resetAutoplay() {
      clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(() => {
        next();
        resetAutoplay();
      }, autoplayDuration);
    }
    onMounted(async () => {
      await fetchSlides();
      setTimeout(() => {
        mounted.value = true;
      }, 100);
      if (slides.value.length) {
        startProgress();
        resetAutoplay();
      }
    });
    onUnmounted(() => {
      clearTimeout(autoplayTimer);
      cancelAnimationFrame(progressRaf);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "home",
        class: "hero"
      }, _attrs))} data-v-ce38344a>`);
      if (!slideReady.value) {
        _push(`<div class="hero-loading" data-v-ce38344a><div class="hero-loading-bar" data-v-ce38344a></div></div>`);
      } else if (slides.value.length > 0 && active.value) {
        _push(`<!--[--><div class="slides-wrap" data-v-ce38344a>`);
        if (prev.value) {
          _push(`<div class="${ssrRenderClass([direction.value === 1 ? "out-to-left" : "out-to-right", "slide slide-out"])}" data-v-ce38344a><div class="slide-img" style="${ssrRenderStyle(`background-image:url('${prev.value.img}')`)}" data-v-ce38344a></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass([direction.value === 1 ? "in-from-right" : "in-from-left", "slide slide-in"])}" data-v-ce38344a><div class="slide-img" style="${ssrRenderStyle(`background-image:url('${active.value.img}')`)}" data-v-ce38344a></div></div></div><div class="slide-ol-base" data-v-ce38344a></div><div class="slide-ol-grad" data-v-ce38344a></div><div class="slide-ol-noise" data-v-ce38344a></div><div class="hero-grid" data-v-ce38344a></div><div class="hero-diag diag-1" data-v-ce38344a></div><div class="hero-diag diag-2" data-v-ce38344a></div><div class="${ssrRenderClass([{ mounted: mounted.value }, "hero-layout"])}" data-v-ce38344a><div class="hero-content" data-v-ce38344a><div class="slide-label" data-v-ce38344a><span class="label-icon" data-v-ce38344a>◈</span><span class="label-text" data-v-ce38344a>${ssrInterpolate(active.value.label)}</span></div><div class="hero-heading" data-v-ce38344a><div class="heading-group" data-v-ce38344a><!--[-->`);
        ssrRenderList(active.value.heading, (line, li) => {
          _push(`<span class="${ssrRenderClass(["heading-line", { "line-gold": li === active.value.accent }])}" style="${ssrRenderStyle(`--i:${li}`)}" data-v-ce38344a>${ssrInterpolate(line)}</span>`);
        });
        _push(`<!--]--></div></div><p class="hero-sub" data-v-ce38344a>${ssrInterpolate(active.value.sub)}</p><div class="hero-tag" data-v-ce38344a><span class="tag-dot" data-v-ce38344a></span>${ssrInterpolate(active.value.tag)}</div></div><div class="absolute bottom-10 left-4 right-4 sm:left-16 sm:right-auto sm:bottom-20 flex flex-col sm:flex-row gap-3 items-center sm:items-start justify-center sm:justify-start mx-auto" data-v-ce38344a><button class="btn-ghost-hero" data-v-ce38344a>${ssrInterpolate(active.value.cta)}</button><button class="btn-primary-hero" data-v-ce38344a> Daftar Sekarang <svg width="16" height="16" viewBox="0 0 16 16" fill="none" data-v-ce38344a><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-ce38344a></path></svg></button></div></div><div class="slide-controls" data-v-ce38344a><button class="ctrl-btn" aria-label="Previous" data-v-ce38344a><svg width="18" height="18" viewBox="0 0 18 18" fill="none" data-v-ce38344a><path d="M11 4L6 9l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-ce38344a></path></svg></button><div class="slide-dots" data-v-ce38344a><!--[-->`);
        ssrRenderList(slides.value, (s, i) => {
          _push(`<button class="${ssrRenderClass(["dot", { active: currentSlide.value === i }])}"${ssrRenderAttr("aria-label", `Slide ${i + 1}`)} data-v-ce38344a><span class="dot-inner" data-v-ce38344a>`);
          if (currentSlide.value === i) {
            _push(`<span class="dot-progress" style="${ssrRenderStyle(`width:${progressWidth.value}%`)}" data-v-ce38344a></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span></button>`);
        });
        _push(`<!--]--></div><button class="ctrl-btn" aria-label="Next" data-v-ce38344a><svg width="18" height="18" viewBox="0 0 18 18" fill="none" data-v-ce38344a><path d="M7 4l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-ce38344a></path></svg></button><span class="ctrl-count" data-v-ce38344a><span class="count-cur" data-v-ce38344a>${ssrInterpolate(String(currentSlide.value + 1).padStart(2, "0"))}</span><span class="count-sep" data-v-ce38344a>/</span><span class="count-tot" data-v-ce38344a>${ssrInterpolate(String(slides.value.length).padStart(2, "0"))}</span></span></div><div class="${ssrRenderClass([{ mounted: mounted.value }, "stats-bar"])}" data-v-ce38344a><div class="stats-bar-inner" data-v-ce38344a><!--[-->`);
        ssrRenderList(stats, (s, i) => {
          _push(`<div class="sbar-item" data-v-ce38344a><span class="sbar-num" data-v-ce38344a>${ssrInterpolate(s.num)}</span><span class="sbar-label" data-v-ce38344a>${ssrInterpolate(s.label)}</span></div>`);
        });
        _push(`<!--]--></div></div><div class="scroll-cue" data-v-ce38344a><span class="sc-text" data-v-ce38344a>Scroll</span><div class="sc-track" data-v-ce38344a><div class="sc-runner" data-v-ce38344a></div></div></div><!--]-->`);
      } else if (slideReady.value && slides.value.length === 0) {
        _push(`<div class="hero-empty" data-v-ce38344a><p data-v-ce38344a>Belum ada slide yang diaktifkan!</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Landing/HeroSection.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-ce38344a"]]);
const _sfc_main$7 = {
  __name: "AboutSection",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const profil = computed(() => page.props.profilSekolah ?? {});
    const sectionRef = ref(null);
    const isVisible = ref(false);
    const values = computed(() => [
      {
        icon: "◈",
        title: "Visi Kami",
        desc: profil.value.visi ?? "-"
      },
      {
        icon: "◉",
        title: "Misi Kami",
        desc: profil.value.misi ?? "-"
      },
      {
        icon: "◇",
        title: "Nilai Kami",
        desc: "Integritas, Inovasi, dan Kolaborasi menjadi fondasi kami dalam membentuk generasi penerus yang unggul dan berkarakter."
      }
    ]);
    let observer;
    onMounted(() => {
      observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) isVisible.value = true;
      }, { threshold: 0.15 });
      if (sectionRef.value) observer.observe(sectionRef.value);
    });
    onUnmounted(() => observer?.disconnect());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "about",
        class: "about",
        ref_key: "sectionRef",
        ref: sectionRef
      }, _attrs))} data-v-6e2b3b10><div class="about-bg" data-v-6e2b3b10><div class="bg-lines" data-v-6e2b3b10></div></div><div class="about-inner" data-v-6e2b3b10><div class="${ssrRenderClass(["about-text", { visible: isVisible.value }])}" data-v-6e2b3b10><span class="section-label" data-v-6e2b3b10>Tentang Kami</span><h2 class="section-title-light" data-v-6e2b3b10> Mendidik dengan Hati <span class="text-gold-gradient" data-v-6e2b3b10>Mengembangkan Skill Standar Industri</span></h2><p class="about-lead" data-v-6e2b3b10> 18 Tahun berdiri sejak tahun 2009, SMK Nusantara telah menjadi pilihan utama keluarga Indonesia yang ingin anaknya memiliki keahlian nyata dan masa depan cerah. </p><p class="about-body" data-v-6e2b3b10> Kami percaya pendidikan vokasi bukan sekadar transfer ilmu — ini tentang membentuk karakter, mengasah keterampilan, dan membuka pintu karier. Setiap program kami dirancang bersama mitra industri terkemuka agar relevan dengan kebutuhan dunia kerja masa kini dan mendatang. </p><div class="accred-badges" data-v-6e2b3b10><div class="badge-divider" data-v-6e2b3b10></div><div class="badge-item" data-v-6e2b3b10><div class="badge-letter" data-v-6e2b3b10>B</div><div class="badge-info" data-v-6e2b3b10><span class="bi-label" data-v-6e2b3b10>Akreditasi</span><span class="bi-value" data-v-6e2b3b10>Terakreditasi - B</span></div></div><div class="badge-divider" data-v-6e2b3b10></div><div class="badge-item" data-v-6e2b3b10><div class="badge-letter" data-v-6e2b3b10>★</div><div class="badge-info" data-v-6e2b3b10><span class="bi-label" data-v-6e2b3b10>Program Penghargaan</span><span class="bi-value" data-v-6e2b3b10>SMK Pusat Keunggulan Tahun 2025</span></div></div></div></div><div class="about-cards" data-v-6e2b3b10><!--[-->`);
      ssrRenderList(values.value, (v, i) => {
        _push(`<div class="${ssrRenderClass(["value-card", { visible: isVisible.value }])}" style="${ssrRenderStyle(`--delay: ${i * 0.15}s`)}" data-v-6e2b3b10><div class="vc-icon" data-v-6e2b3b10>${ssrInterpolate(v.icon)}</div><div class="vc-content" data-v-6e2b3b10><h3 class="vc-title" data-v-6e2b3b10>${ssrInterpolate(v.title)}</h3><p class="vc-desc" data-v-6e2b3b10>${ssrInterpolate(v.desc)}</p></div><div class="vc-glow" data-v-6e2b3b10></div></div>`);
      });
      _push(`<!--]--><div class="about-deco" data-v-6e2b3b10><svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-6e2b3b10><circle cx="100" cy="100" r="90" stroke="rgba(201,168,76,0.08)" stroke-width="1" data-v-6e2b3b10></circle><circle cx="100" cy="100" r="65" stroke="rgba(201,168,76,0.06)" stroke-width="1" stroke-dasharray="4 6" data-v-6e2b3b10></circle><circle cx="100" cy="100" r="40" stroke="rgba(201,168,76,0.1)" stroke-width="1.5" data-v-6e2b3b10></circle><circle cx="100" cy="100" r="6" fill="rgba(201,168,76,0.3)" data-v-6e2b3b10></circle><line x1="100" y1="10" x2="100" y2="60" stroke="rgba(201,168,76,0.2)" stroke-width="1" data-v-6e2b3b10></line><line x1="100" y1="140" x2="100" y2="190" stroke="rgba(201,168,76,0.2)" stroke-width="1" data-v-6e2b3b10></line><line x1="10" y1="100" x2="60" y2="100" stroke="rgba(201,168,76,0.2)" stroke-width="1" data-v-6e2b3b10></line><line x1="140" y1="100" x2="190" y2="100" stroke="rgba(201,168,76,0.2)" stroke-width="1" data-v-6e2b3b10></line></svg></div></div></div></section>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Landing/AboutSection.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const AboutSection = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-6e2b3b10"]]);
const _sfc_main$6 = {
  __name: "ProgramsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const sectionRef = ref(null);
    const isVisible = ref(false);
    const activeCard = ref(0);
    const selectedProgram = ref(null);
    const activeTab = ref("profil");
    const programs = [
      {
        code: "MPLB",
        title: "MANAJEMEN PERKANTORAN DAN LAYANAN BISNIS",
        subtitle: "OFFICE MANAGEMENT (MPLB)",
        icon: "⌨",
        color: "#C9A84C",
        desc: "Program Keahlian Manajemen dan Layanan Bisnis (MPLB) SMK Nusantara Kabupaten Bogor menerapkan Konsentrasi Keahlian Manajemen Perkantoran yang berfokus pada keterampilan mengelola layanan administrasi dan tata kelola perkantoran.",
        skills: ["Junior Administrative", "Sekretaris Junior", "Office Administrative Staff", "Front Desk Officer", "Admin Online"],
        career: ["Junior Administrative", "Sekretaris Junior", "Office Administrative Staff", "Front Desk Officer"],
        duration: "18 Tahun",
        seats: "120 Kursi",
        kepala: {
          nama: "Sandi Destian, S. Pd.",
          inisial: "SD",
          foto: null,
          jabatan: "Kepala Program MPLB",
          pendidikan: "S1 Manajemen Pendidikan, UNJ",
          bio: "Bapak Sandi Destian, S. Pd telah memimpin Program MPLB selama lebih dari satu dekade dengan fokus pada pengembangan kompetensi digital-office dan sertifikasi BNSP.",
          stats: [
            { nilai: "12 Thn", label: "Pengalaman" },
            { nilai: "480+", label: "Lulusan" },
            { nilai: "8", label: "Mitra Industri" }
          ],
          pesan: "Dunia administrasi modern bukan lagi soal meja dan kertas. Ia adalah tentang kemampuan mengelola informasi, berkomunikasi dengan presisi, dan berkolaborasi lintas tim."
        }
      },
      {
        code: "BR",
        title: "BISNIS RETAIL DAN PEMASARAN",
        subtitle: "Retail Business (BR)",
        icon: "⬡",
        color: "#A8882A",
        desc: "Pelajari infrastruktur bisnis, strategi pemasaran, digitalisasi bidang pemasaran. Fondasi dunia bisnis dan strategi marketing yang efisien untuk mencetak wirausahawan muda.",
        skills: ["Retail Business", "Digital Marketing", "Relationship", "Public Speaking"],
        career: ["CEO", "Enterpreneur", "Super Visor", "Cashier", "Influencer", "Sales Marketing", "Wirausaha"],
        duration: "18 Tahun",
        seats: "90 Kursi",
        kepala: {
          nama: "Andini Alawiyah, S. Pd",
          inisial: "AA",
          foto: null,
          jabatan: "Kepala Program BR",
          pendidikan: "S1 Bisnis Manajemen, UNESA",
          bio: "Ibu Andini Alawiyah, S. Pd merupakan praktisi bisnis berpengalaman yang bergabung sebagai kepala program setelah 8 tahun berkarier di industri retail nasional.",
          stats: [
            { nilai: "9 Thn", label: "Pengalaman" },
            { nilai: "360+", label: "Lulusan" },
            { nilai: "6", label: "Mitra Industri" }
          ],
          pesan: "Bisnis yang sukses dimulai dari memahami pelanggan. Di sinilah kalian akan belajar bukan hanya cara menjual, tapi cara membangun relasi dan menciptakan nilai."
        }
      }
    ];
    function closeModal() {
      selectedProgram.value = null;
      document.body.style.overflow = "";
    }
    function handleKeydown(e) {
      if (e.key === "Escape") closeModal();
    }
    let observer;
    onMounted(() => {
      observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) isVisible.value = true;
      }, { threshold: 0.1 });
      if (sectionRef.value) observer.observe(sectionRef.value);
      window.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      observer?.disconnect();
      window.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><section id="programs" class="relative py-28 px-8 bg-[#030B18] overflow-hidden" data-v-1dc11cec><div class="absolute inset-0 pointer-events-none" style="${ssrRenderStyle({ "background": "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(26,58,107,0.3) 0%, transparent 60%)" })}" data-v-1dc11cec></div><div class="max-w-[1280px] mx-auto" data-v-1dc11cec><div class="${ssrRenderClass([isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", "text-center max-w-[580px] mx-auto mb-16 transition-all duration-700 ease-out"])}" data-v-1dc11cec><span class="section-label justify-center before:hidden" data-v-1dc11cec>Program Keahlian</span><h2 class="section-title-light" data-v-1dc11cec> Pilih Jurusan <span class="text-gold-gradient" data-v-1dc11cec>Impianmu</span></h2><p class="mt-4 text-[0.95rem] leading-[1.7] text-white/45" data-v-1dc11cec> Program unggulan yang dirancang bersama beberapa mitra industri untuk memastikan kamu lulus dengan keahlian yang langsung bisa diaplikasikan. </p></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.08)]" data-v-1dc11cec><!--[-->`);
      ssrRenderList(programs, (p, i) => {
        _push(`<div class="${ssrRenderClass([[
          isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          activeCard.value === i ? "bg-[rgba(11,30,61,0.95)] z-10" : ""
        ], "relative p-7 pb-10 bg-[#030B18] overflow-hidden cursor-pointer transition-all duration-700 ease-out group"])}" style="${ssrRenderStyle(`--delay: ${i * 0.12}s; --accent: ${p.color}; transition-delay: ${isVisible.value ? i * 0.12 : 0}s`)}" tabindex="0" data-v-1dc11cec><div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="${ssrRenderStyle({ "background": "radial-gradient(circle at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)" })}" data-v-1dc11cec></div><div class="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style="${ssrRenderStyle(`background: linear-gradient(90deg, ${p.color}, transparent)`)}" data-v-1dc11cec></div><div class="flex items-center justify-between mb-6" data-v-1dc11cec><div class="flex items-center gap-2" data-v-1dc11cec><span class="text-2xl" style="${ssrRenderStyle(`color: ${p.color}`)}" data-v-1dc11cec>${ssrInterpolate(p.icon)}</span><span class="font-display text-[1.8rem] font-bold leading-none" style="${ssrRenderStyle(`color: ${p.color}`)}" data-v-1dc11cec>${ssrInterpolate(p.code)}</span></div><div class="flex items-center gap-1.5" data-v-1dc11cec><span class="text-[0.65rem] font-bold tracking-[0.08em] uppercase text-white/30" data-v-1dc11cec>${ssrInterpolate(p.duration)}</span><span class="text-white/20 text-sm" data-v-1dc11cec>·</span><span class="text-[0.65rem] font-bold tracking-[0.08em] uppercase text-white/30" data-v-1dc11cec>${ssrInterpolate(p.seats)}</span></div></div><div class="mb-4" data-v-1dc11cec><h3 class="font-display text-[1.2rem] font-semibold text-white leading-[1.3] mb-1" data-v-1dc11cec>${ssrInterpolate(p.title)}</h3><p class="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-white/30" data-v-1dc11cec>${ssrInterpolate(p.subtitle)}</p></div><p class="text-[0.85rem] leading-[1.7] text-white/50 mb-6" data-v-1dc11cec>${ssrInterpolate(p.desc)}</p><div class="flex flex-wrap gap-1.5 mb-6" data-v-1dc11cec><!--[-->`);
        ssrRenderList(p.skills, (s) => {
          _push(`<span class="${ssrRenderClass([activeCard.value === i ? "border-[rgba(201,168,76,0.3)] text-white/80" : "", "text-[0.65rem] font-semibold tracking-[0.06em] px-2.5 py-1 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] text-white/60 transition-all duration-300"])}" data-v-1dc11cec>${ssrInterpolate(s)}</span>`);
        });
        _push(`<!--]--></div><div class="text-[0.75rem] text-white/35 leading-[1.6] mb-6" data-v-1dc11cec><span class="text-[0.65rem] font-bold tracking-[0.08em] uppercase mr-1.5" style="${ssrRenderStyle(`color: ${p.color}`)}" data-v-1dc11cec>Karier:</span><!--[-->`);
        ssrRenderList(p.career, (c, ci) => {
          _push(`<span class="text-white/50" data-v-1dc11cec>${ssrInterpolate(c)}`);
          if (ci < p.career.length - 1) {
            _push(`<span class="mr-1" data-v-1dc11cec>,</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span>`);
        });
        _push(`<!--]--></div><div class="${ssrRenderClass([activeCard.value === i ? "border-[rgba(201,168,76,0.2)]" : "", "flex items-center gap-2 pt-4 border-t border-[rgba(201,168,76,0.1)] transition-colors duration-300"])}" data-v-1dc11cec><span class="w-6 h-6 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] text-[0.55rem] font-bold flex items-center justify-center shrink-0" style="${ssrRenderStyle(`color: ${p.color}`)}" data-v-1dc11cec>${ssrInterpolate(p.kepala.inisial)}</span><span class="text-[0.7rem] font-semibold tracking-[0.06em] text-[rgba(201,168,76,0.6)]" data-v-1dc11cec>Lihat Kepala Program</span><span class="ml-auto text-[0.75rem] text-[rgba(201,168,76,0.4)] transition-transform duration-300 group-hover:translate-x-1" data-v-1dc11cec>→</span></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (selectedProgram.value) {
          _push2(`<div class="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center backdrop-blur-md bg-black/80 sm:p-6 p-0" role="dialog" aria-modal="true" data-v-1dc11cec>`);
          if (selectedProgram.value) {
            _push2(`<div class="relative w-full sm:max-w-[540px] bg-[#07152b] border border-[rgba(201,168,76,0.2)] flex flex-col sm:rounded-sm max-h-[100vh] sm:max-h-[90vh]" style="${ssrRenderStyle(`--accent: ${selectedProgram.value.color}`)}" data-v-1dc11cec><div class="flex items-center gap-4 px-6 py-3.5 bg-[rgba(201,168,76,0.04)] border-b border-[rgba(201,168,76,0.1)] shrink-0" data-v-1dc11cec><div class="flex-1 h-px bg-[rgba(201,168,76,0.2)]" data-v-1dc11cec></div><span class="font-display text-[0.6rem] font-bold tracking-[0.3em] uppercase" style="${ssrRenderStyle(`color: ${selectedProgram.value.color}`)}" data-v-1dc11cec>${ssrInterpolate(selectedProgram.value.code)}</span><div class="flex-1 h-px bg-[rgba(201,168,76,0.2)]" data-v-1dc11cec></div></div><div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 px-6 pt-5 pb-4 shrink-0" data-v-1dc11cec><div class="shrink-0" data-v-1dc11cec><div class="w-20 h-20 rounded-full border border-[rgba(201,168,76,0.4)] p-[3px] bg-[rgba(201,168,76,0.05)]" data-v-1dc11cec>`);
            if (selectedProgram.value.kepala.foto) {
              _push2(`<img${ssrRenderAttr("src", selectedProgram.value.kepala.foto)}${ssrRenderAttr("alt", selectedProgram.value.kepala.nama)} class="w-full h-full rounded-full object-cover block" data-v-1dc11cec>`);
            } else {
              _push2(`<div class="w-full h-full rounded-full bg-[rgba(201,168,76,0.1)] flex items-center justify-center font-display text-2xl font-bold" style="${ssrRenderStyle(`color: ${selectedProgram.value.color}`)}" data-v-1dc11cec>${ssrInterpolate(selectedProgram.value.kepala.inisial)}</div>`);
            }
            _push2(`</div></div><div class="flex-1 text-center sm:text-left pt-0 sm:pt-1" data-v-1dc11cec><p class="text-[0.6rem] font-bold tracking-[0.12em] uppercase mb-1.5 opacity-70" style="${ssrRenderStyle(`color: ${selectedProgram.value.color}`)}" data-v-1dc11cec> Kepala Program Keahlian </p><h3 class="font-display text-[1.05rem] font-semibold text-white leading-[1.3] mb-1" data-v-1dc11cec>${ssrInterpolate(selectedProgram.value.kepala.nama)}</h3><p class="text-[0.7rem] text-white/35 mb-2" data-v-1dc11cec>${ssrInterpolate(selectedProgram.value.kepala.pendidikan)}</p><span class="text-[0.6rem] font-bold tracking-[0.06em] uppercase text-white/25 bg-[rgba(201,168,76,0.07)] border border-[rgba(201,168,76,0.12)] px-2.5 py-1 inline-block" data-v-1dc11cec>${ssrInterpolate(selectedProgram.value.title)}</span></div></div><div class="grid grid-cols-3 border-t border-b border-white/[0.04] shrink-0" data-v-1dc11cec><!--[-->`);
            ssrRenderList(selectedProgram.value.kepala.stats, (s, si) => {
              _push2(`<div class="${ssrRenderClass([si < selectedProgram.value.kepala.stats.length - 1 ? "border-r border-white/[0.04]" : "", "flex flex-col items-center py-3 px-2"])}" data-v-1dc11cec><span class="font-display text-base font-bold" style="${ssrRenderStyle(`color: ${selectedProgram.value.color}`)}" data-v-1dc11cec>${ssrInterpolate(s.nilai)}</span><span class="text-[0.55rem] tracking-[0.08em] uppercase text-white/25 mt-0.5" data-v-1dc11cec>${ssrInterpolate(s.label)}</span></div>`);
            });
            _push2(`<!--]--></div><div class="flex border-b border-white/[0.06] px-6 shrink-0" data-v-1dc11cec><!--[-->`);
            ssrRenderList(["profil", "pesan"], (tab) => {
              _push2(`<button class="${ssrRenderClass([activeTab.value === tab ? "border-b-[var(--accent)] text-[var(--accent)]" : "border-b-transparent text-white/30 hover:text-white/50", "bg-none border-none py-2.5 mr-6 text-[0.7rem] font-bold tracking-[0.08em] uppercase cursor-pointer border-b-2 -mb-px transition-all duration-200"])}" data-v-1dc11cec>${ssrInterpolate(tab === "profil" ? "Profil Singkat" : "Pesan Singkat")}</button>`);
            });
            _push2(`<!--]--></div><div class="overflow-y-auto flex-1" data-v-1dc11cec>`);
            if (activeTab.value === "profil") {
              _push2(`<div class="px-6 py-5" data-v-1dc11cec><p class="text-[0.83rem] leading-[1.8] text-white/50 mb-5" data-v-1dc11cec>${ssrInterpolate(selectedProgram.value.kepala.bio)}</p><p class="text-[0.6rem] font-bold tracking-[0.1em] uppercase text-white/25 mb-2.5" data-v-1dc11cec> Kompetensi Program </p><div class="flex flex-wrap gap-1.5 mb-4" data-v-1dc11cec><!--[-->`);
              ssrRenderList(selectedProgram.value.skills, (s) => {
                _push2(`<span class="text-[0.65rem] font-semibold tracking-[0.05em] px-2.5 py-1 bg-[rgba(201,168,76,0.07)] border border-[rgba(201,168,76,0.15)] text-white/55" data-v-1dc11cec>${ssrInterpolate(s)}</span>`);
              });
              _push2(`<!--]--></div><div class="text-[0.75rem] text-white/35 leading-[1.7]" data-v-1dc11cec><span class="text-[0.6rem] font-bold tracking-[0.08em] uppercase mr-1.5" style="${ssrRenderStyle(`color: ${selectedProgram.value.color}`)}" data-v-1dc11cec>Prospek Karier:</span><!--[-->`);
              ssrRenderList(selectedProgram.value.career, (c, ci) => {
                _push2(`<span class="text-white/45" data-v-1dc11cec>${ssrInterpolate(c)}`);
                if (ci < selectedProgram.value.career.length - 1) {
                  _push2(`<span data-v-1dc11cec>, </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</span>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<div class="px-6 py-5 flex flex-col justify-center" data-v-1dc11cec><div class="bg-[rgba(201,168,76,0.04)] border-l-2 border-[rgba(201,168,76,0.3)] px-5 py-5 mb-4" data-v-1dc11cec><span class="block font-serif text-[3.5rem] leading-[0.8] text-[rgba(201,168,76,0.12)] select-none mb-[-0.5rem]" data-v-1dc11cec>&quot;</span><p class="text-[0.88rem] leading-[1.85] text-white/65 italic" data-v-1dc11cec>${ssrInterpolate(selectedProgram.value.kepala.pesan)}</p><span class="block font-serif text-[3.5rem] leading-[0.8] text-[rgba(201,168,76,0.12)] select-none text-right mt-[-0.5rem]" data-v-1dc11cec>&quot;</span></div><p class="text-[0.7rem] text-[rgba(201,168,76,0.5)] text-right italic" data-v-1dc11cec> — ${ssrInterpolate(selectedProgram.value.kepala.nama)}, ${ssrInterpolate(selectedProgram.value.kepala.jabatan)}</p></div>`);
            }
            _push2(`</div><div class="flex items-center justify-between gap-2.5 px-6 py-3.5 border-t border-white/[0.06] bg-black/15 shrink-0" data-v-1dc11cec><button class="bg-transparent w-full border border-white/10 text-white/40 text-[0.7rem] font-bold tracking-[0.06em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 hover:border-white/25 hover:text-white/70" data-v-1dc11cec> Tutup </button><button class="border-none w-full text-[#07152b] text-[0.7rem] font-bold tracking-[0.06em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97]" style="${ssrRenderStyle(`background: ${selectedProgram.value.color}`)}" data-v-1dc11cec> Daftar Sekarang </button></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Landing/ProgramsSection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ProgramsSection = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-1dc11cec"]]);
const _sfc_main$5 = {
  __name: "StatsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const sectionRef = ref(null);
    const isVisible = ref(false);
    const counters = ref([0, 0, 0, 0]);
    const stats = [
      { num: 18, suffix: "+", label: "Tahun Berdiri", desc: "Pengalaman mendidik generasi unggul", icon: "🏛️" },
      { num: 5e3, suffix: "+", label: "Alumni Tersebar", desc: "Di seluruh Indonesia & mancanegara", icon: "🌏" },
      { num: 99, suffix: "%", label: "Tingkat Kelulusan", desc: "Konsisten setiap tahun ajaran", icon: "🏆" },
      { num: 200, suffix: "+", label: "Mitra Industri", desc: "Siap menyerap lulusan kami", icon: "🤝" }
    ];
    let observer;
    let animationFrames = [];
    const animateCounter = (index, target) => {
      const duration = 2e3;
      const start = performance.now();
      const step = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        counters.value[index] = Math.round(eased * target);
        if (progress < 1) {
          animationFrames[index] = requestAnimationFrame(step);
        }
      };
      animationFrames[index] = requestAnimationFrame(step);
    };
    onMounted(() => {
      observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          isVisible.value = true;
          stats.forEach((s, i) => setTimeout(() => animateCounter(i, s.num), i * 150));
        }
      }, { threshold: 0.2 });
      if (sectionRef.value) observer.observe(sectionRef.value);
    });
    onUnmounted(() => {
      observer?.disconnect();
      animationFrames.forEach((f) => cancelAnimationFrame(f));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "stats",
        class: "stats-section",
        ref_key: "sectionRef",
        ref: sectionRef
      }, _attrs))} data-v-4110a5f2><div class="stats-glow" data-v-4110a5f2></div><div class="stats-line-top" data-v-4110a5f2></div><div class="stats-inner" data-v-4110a5f2><div class="${ssrRenderClass([{ visible: isVisible.value }, "stats-label-wrap"])}" data-v-4110a5f2><span class="section-label" data-v-4110a5f2>Pencapaian Kami</span></div><div class="stats-grid" data-v-4110a5f2><!--[-->`);
      ssrRenderList(stats, (s, i) => {
        _push(`<div class="${ssrRenderClass([{ visible: isVisible.value }, "stat-card"])}" style="${ssrRenderStyle(`--delay: ${i * 0.1}s`)}" data-v-4110a5f2><div class="stat-icon" data-v-4110a5f2>${ssrInterpolate(s.icon)}</div><div class="stat-number" data-v-4110a5f2><span class="stat-num" data-v-4110a5f2>${ssrInterpolate(counters.value[i].toLocaleString("id-ID"))}</span><span class="stat-suffix" data-v-4110a5f2>${ssrInterpolate(s.suffix)}</span></div><div class="stat-label" data-v-4110a5f2>${ssrInterpolate(s.label)}</div><div class="stat-desc" data-v-4110a5f2>${ssrInterpolate(s.desc)}</div><div class="stat-bar" data-v-4110a5f2></div></div>`);
      });
      _push(`<!--]--></div></div><div class="stats-line-bottom" data-v-4110a5f2></div></section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Landing/StatsSection.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const StatsSection = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-4110a5f2"]]);
const _sfc_main$4 = {
  __name: "TestimonialsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const current = computed(() => testimonials[activeIndex.value]);
    const sectionRef = ref(null);
    const isVisible = ref(false);
    const activeIndex = ref(0);
    let autoplayInterval;
    const testimonials = [
      {
        name: "Andhika Alamsyah",
        role: "Software Engineer",
        company: "Gojek",
        batch: "Lulusan 2022",
        quote: "SMK Nusantara benar-benar mengubah hidup saya. Kurikulum yang selaras dengan industri membuat saya langsung siap kerja setelah lulus. Kini saya berkarier di Gojek sebagai Software Engineer.",
        avatar: "AA",
        color: "#C9A84C"
      },
      {
        name: "Shela Juliana Putri",
        role: "Digital Marketing Manager",
        company: "Tokopedia",
        batch: "Lulusan 2017",
        quote: "Program Bisnis Retail di sini jauh melampaui ekspektasi saya. Praktik langsung di mitra industri nyata memberi pengalaman yang tidak bisa didapatkan di tempat lain.",
        avatar: "SJ",
        color: "#A8882A"
      },
      {
        name: "Ardhito Pratama",
        role: "Network Administrator",
        company: "Telkom Indonesia",
        batch: "Lulusan 2023",
        quote: "Fasilitas lab OTKP yang lengkap dan instruktur berpengalaman membuat saya menguasai bidang ini dengan cepat. Terima kasih SMK Nusantara!",
        avatar: "SD",
        color: "#C9A84C"
      },
      {
        name: "Muhammad Rivaldi",
        role: "Content Creator",
        company: "1.2M Followers",
        batch: "Lulusan 2020",
        quote: "Jurusan MP di sini memberikan fondasi kreatif dan teknis yang kuat. Saya bisa membangun karier sebagai kreator konten dengan percaya diri.",
        avatar: "MR",
        color: "#D4B55B"
      }
    ];
    const next = () => {
      activeIndex.value = (activeIndex.value + 1) % testimonials.length;
      resetAutoplay();
    };
    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(next, 5e3);
    };
    let observer;
    onMounted(() => {
      observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) isVisible.value = true;
      }, { threshold: 0.15 });
      if (sectionRef.value) observer.observe(sectionRef.value);
      autoplayInterval = setInterval(next, 5e3);
    });
    onUnmounted(() => {
      observer?.disconnect();
      clearInterval(autoplayInterval);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "testimonials",
        class: "relative py-28 px-8 bg-navy-950 overflow-hidden",
        ref_key: "sectionRef",
        ref: sectionRef
      }, _attrs))} data-v-5de830ed><div class="absolute inset-0 pointer-events-none" style="${ssrRenderStyle({ "background": "radial-gradient(ellipse 70% 50% at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 50%, rgba(26,58,107,0.25) 0%, transparent 60%)" })}" data-v-5de830ed></div><div class="max-w-[900px] mx-auto" data-v-5de830ed><div class="${ssrRenderClass([isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", "text-center mb-14 transition-all duration-700 ease-out"])}" data-v-5de830ed><span class="section-label justify-center before:hidden" data-v-5de830ed>Suara Alumni</span><h2 class="section-title-light" data-v-5de830ed> Mereka yang Telah <span class="text-gold-gradient" data-v-5de830ed>Membuktikan</span></h2></div><div class="${ssrRenderClass([isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", "relative border border-[rgba(201,168,76,0.12)] bg-[rgba(11,30,61,0.4)] px-12 pt-14 pb-10 mb-8 transition-all duration-700 ease-out delay-150"])}" data-v-5de830ed><div class="absolute sm:top-4 top-2 sm:left-8 left-4 font-display text-[7rem] leading-none text-[rgba(201,168,76,0.1)] pointer-events-none select-none" data-v-5de830ed> &quot; </div><div class="relative" data-v-5de830ed><div data-v-5de830ed><p class="font-display text-[clamp(1.05rem,2.5vw,1.3rem)] font-medium italic leading-[1.75] text-white/75 mt-4 mb-8 min-h-[100px]" data-v-5de830ed>${ssrInterpolate(current.value.quote)}</p><div class="flex items-center gap-4" data-v-5de830ed><div class="w-[52px] h-[52px] shrink-0 sm:flex hidden items-center justify-center font-display text-base font-bold" style="${ssrRenderStyle(`background: linear-gradient(135deg, ${current.value.color}, rgba(201,168,76,0.3)); border: 1.5px solid $color: var(--navy-900); clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);`)}" data-v-5de830ed>${ssrInterpolate(current.value.avatar)}</div><div class="flex flex-col gap-0.5 flex-1 min-w-0" data-v-5de830ed><span class="text-sm font-bold text-white tracking-wide truncate" data-v-5de830ed>${ssrInterpolate(current.value.name)}</span><span class="text-xs text-[#C9A84C] font-medium" data-v-5de830ed>${ssrInterpolate(current.value.role)} · ${ssrInterpolate(current.value.company)}</span><span class="text-[0.65rem] text-white/30 tracking-widest uppercase" data-v-5de830ed>${ssrInterpolate(current.value.batch)}</span></div><div class="shrink-0 text-[#C9A84C] tracking-widest text-sm" data-v-5de830ed> ★★★★★ </div></div></div></div><div class="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)]" data-v-5de830ed><button class="w-9 h-9 border border-[rgba(201,168,76,0.3)] bg-transparent text-gold-500 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold-500" aria-label="Previous" data-v-5de830ed><svg width="18" height="18" viewBox="0 0 18 18" fill="none" data-v-5de830ed><path d="M11 4l-5 5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-5de830ed></path></svg></button><div class="flex gap-[6px]" data-v-5de830ed><!--[-->`);
      ssrRenderList(testimonials, (_, i) => {
        _push(`<button class="${ssrRenderClass([i === activeIndex.value ? "w-8 bg-gold-500" : "w-5 bg-[rgba(201,168,76,0.2)]", "h-[2px] border-none cursor-pointer p-0 transition-all duration-300"])}" data-v-5de830ed></button>`);
      });
      _push(`<!--]--></div><button class="w-9 h-9 border border-[rgba(201,168,76,0.3)] bg-transparent text-gold-500 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold-500" aria-label="Next" data-v-5de830ed><svg width="18" height="18" viewBox="0 0 18 18" fill="none" data-v-5de830ed><path d="M7 4l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-5de830ed></path></svg></button></div></div><div class="${ssrRenderClass([isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5", "sm:flex hidden gap-3 justify-center flex-wrap transition-all duration-700 ease-out delay-[250ms]"])}" data-v-5de830ed><!--[-->`);
      ssrRenderList(testimonials, (t, i) => {
        _push(`<button class="${ssrRenderClass([i === activeIndex.value ? "opacity-100 bg-[rgba(201,168,76,0.05)]" : "opacity-45 border-[rgba(255,255,255,0.06)] hover:opacity-80", "flex items-center gap-2 px-[0.875rem] py-2 bg-transparent border cursor-pointer transition-all duration-300"])}" style="${ssrRenderStyle(i === activeIndex.value ? `border-color: ${t.color};` : "")}" data-v-5de830ed><span class="w-6 h-6 flex items-center justify-center text-[0.6rem] font-bold flex-shrink-0" style="${ssrRenderStyle(`background: linear-gradient(135deg, ${t.color}, rgba(201,168,76,0.2)); color: var(--navy-900);`)}" data-v-5de830ed>${ssrInterpolate(t.avatar)}</span><span class="${ssrRenderClass([i === activeIndex.value ? "text-white" : "text-[rgba(255,255,255,0.6)]", "text-[0.72rem] font-semibold tracking-[0.04em] whitespace-nowrap"])}" data-v-5de830ed>${ssrInterpolate(t.name)}</span></button>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Landing/TestimonialsSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const TestimonialsSection = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-5de830ed"]]);
const _sfc_main$3 = {
  __name: "CTASection",
  __ssrInlineRender: true,
  setup(__props) {
    const sectionRef = ref(null);
    const isVisible = ref(false);
    let observer;
    onMounted(() => {
      observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) isVisible.value = true;
      }, { threshold: 0.2 });
      if (sectionRef.value) observer.observe(sectionRef.value);
    });
    onUnmounted(() => observer?.disconnect());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "spmb",
        class: "cta-section",
        ref_key: "sectionRef",
        ref: sectionRef
      }, _attrs))} data-v-966b58f7><div class="cta-grid" data-v-966b58f7></div><div class="cta-line cta-line-1" data-v-966b58f7></div><div class="cta-line cta-line-2" data-v-966b58f7></div><div class="cta-glow" data-v-966b58f7></div><div class="${ssrRenderClass([{ visible: isVisible.value }, "cta-inner"])}" data-v-966b58f7><div class="cta-badge" data-v-966b58f7><span class="badge-pulse" data-v-966b58f7></span> Pendaftaran 2025/2026 Dibuka </div><h2 class="cta-title" data-v-966b58f7> Siap Wujudkan<br data-v-966b58f7><span class="cta-title-gold" data-v-966b58f7>Masa Depanmu?</span></h2><p class="cta-desc" data-v-966b58f7> Bergabunglah dengan ribuan alumni sukses SMK Nusantara. Kuota terbatas — segera daftarkan dirimu sebelum kehabisan. </p><div class="cta-urgency" data-v-966b58f7><div class="urgency-item" data-v-966b58f7><span class="urgency-num" data-v-966b58f7>120</span><span class="urgency-label" data-v-966b58f7>Kuota tersisa</span></div><div class="urgency-sep" data-v-966b58f7></div><div class="urgency-item" data-v-966b58f7><span class="urgency-num" data-v-966b58f7>2</span><span class="urgency-label" data-v-966b58f7>Program Unggulan</span></div><div class="urgency-sep" data-v-966b58f7></div><div class="urgency-item" data-v-966b58f7><span class="urgency-num" data-v-966b58f7>Gratis</span><span class="urgency-label" data-v-966b58f7>Biaya pendaftaran</span></div></div><div class="cta-actions" data-v-966b58f7><button class="btn-gold-solid cta-btn-primary" data-v-966b58f7> Daftar Sekarang <svg width="16" height="16" viewBox="0 0 16 16" fill="none" data-v-966b58f7><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-966b58f7></path></svg></button><button class="btn-outline-gold" data-v-966b58f7> Lihat Program </button></div><div class="trust-row" data-v-966b58f7><span class="trust-item" data-v-966b58f7>✓ Sertifikasi Pusat Keunggulan</span><span class="trust-item" data-v-966b58f7>✓ Kurikulum Nasional</span><span class="trust-item" data-v-966b58f7>✓ Terakreditasi B</span><span class="trust-item" data-v-966b58f7>✓ Sertifikasi Industri</span></div></div></section>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Landing/CTASection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const CTASection = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-966b58f7"]]);
const _sfc_main$2 = {
  __name: "ContactSection",
  __ssrInlineRender: true,
  setup(__props) {
    const profil = computed(() => page.props.profilSekolah ?? {});
    const page = usePage();
    const sectionRef = ref(null);
    const isVisible = ref(false);
    const submitted = ref(false);
    const loading = ref(false);
    const serverErrors = ref({});
    const globalError = ref("");
    const form = ref({
      name: "",
      phone: "",
      program: "",
      message: "",
      device_fingerprint: "",
      device_info: {}
    });
    const programs = [
      "MPLB — Manajemen Perkantoran & Lembaga Bisnis",
      "BR — Bisnis Retail & Pemasaran"
    ];
    const contacts = computed(() => [
      { icon: "📍", label: "Alamat", value: profil.value.alamat ?? "-" },
      { icon: "📞", label: "Telepon", value: profil.value.telepon ?? "-" },
      { icon: "✉️", label: "Email", value: profil.value.email ?? "-" },
      { icon: "⏰", label: "Jam Operasional", value: "Senin–Sabtu, 07.00–16.00 WIB" }
    ]);
    const fieldError = (field) => serverErrors.value[field]?.[0] ?? "";
    async function generateFingerprint() {
      const components = [
        navigator.userAgent,
        navigator.language,
        screen.width + "x" + screen.height,
        screen.colorDepth,
        (/* @__PURE__ */ new Date()).getTimezoneOffset(),
        navigator.hardwareConcurrency ?? "",
        navigator.platform ?? ""
      ].join("|");
      const encoder = new TextEncoder();
      const data = encoder.encode(components);
      const hash = await crypto.subtle.digest("SHA-256", data);
      const hex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
      return hex;
    }
    async function collectDeviceInfo() {
      const fingerprint = await generateFingerprint();
      form.value.device_fingerprint = fingerprint;
      form.value.device_info = {
        screen_width: screen.width,
        screen_height: screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform ?? ""
      };
    }
    function getCsrfToken() {
      const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : "";
    }
    async function initSession() {
      try {
        if (!getCsrfToken()) {
          await fetch(`${"http://localhost:8000"}/sanctum/csrf-cookie`, {
            credentials: "include"
          });
        }
      } catch (_) {
      }
      await collectDeviceInfo();
    }
    let observer;
    onMounted(async () => {
      await initSession();
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) isVisible.value = true;
        },
        { threshold: 0.1 }
      );
      if (sectionRef.value) observer.observe(sectionRef.value);
    });
    onUnmounted(() => observer?.disconnect());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "contact",
        class: "contact-section",
        ref_key: "sectionRef",
        ref: sectionRef
      }, _attrs))} data-v-343c04ec><div class="contact-bg" data-v-343c04ec></div><div class="contact-inner" data-v-343c04ec><div class="${ssrRenderClass([{ visible: isVisible.value }, "contact-info"])}" data-v-343c04ec><span class="section-label" data-v-343c04ec>Hubungi Kami</span><h2 class="section-title-light" data-v-343c04ec> Mulai Perjalananmu<br data-v-343c04ec><span class="text-gold-gradient" data-v-343c04ec>Bersama Kami</span></h2><p class="contact-lead" data-v-343c04ec> Punya pertanyaan tentang program, fasilitas, atau pendaftaran? Tim kami siap membantu kamu menemukan jurusan terbaik. </p><div class="info-cards" data-v-343c04ec><!--[-->`);
      ssrRenderList(contacts.value, (c, i) => {
        _push(`<div style="${ssrRenderStyle(`--delay: ${i * 0.08}s`)}" class="${ssrRenderClass([{ visible: isVisible.value }, "info-card"])}" data-v-343c04ec><span class="info-icon" data-v-343c04ec>${ssrInterpolate(c.icon)}</span><div class="info-text" data-v-343c04ec><span class="info-label" data-v-343c04ec>${ssrInterpolate(c.label)}</span><span class="info-value" data-v-343c04ec>${ssrInterpolate(c.value)}</span></div></div>`);
      });
      _push(`<!--]--></div><div class="social-row" data-v-343c04ec><a href="#" class="social-btn" aria-label="Instagram" data-v-343c04ec><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-343c04ec><rect x="2" y="2" width="20" height="20" rx="5" data-v-343c04ec></rect><circle cx="12" cy="12" r="5" data-v-343c04ec></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" data-v-343c04ec></circle></svg></a><a href="#" class="social-btn" aria-label="YouTube" data-v-343c04ec><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-343c04ec><rect x="2" y="5" width="20" height="14" rx="3" data-v-343c04ec></rect><path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" data-v-343c04ec></path></svg></a><a href="#" class="social-btn" aria-label="WhatsApp" data-v-343c04ec><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-343c04ec><circle cx="12" cy="12" r="10" data-v-343c04ec></circle><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.4-.7 2.7-1.8 3.4l.8 2.6-2.8-.9C11.5 17.7 9.8 17 9 15.8" data-v-343c04ec></path></svg></a><a href="#" class="social-btn" aria-label="TikTok" data-v-343c04ec><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-343c04ec><path d="M9 12a4 4 0 1 0 4 4V4c.5 2 2.5 4 5 4" data-v-343c04ec></path></svg></a></div></div><div class="${ssrRenderClass([{ visible: isVisible.value }, "contact-form-wrap"])}" data-v-343c04ec>`);
      if (submitted.value) {
        _push(`<div class="form-success" data-v-343c04ec><div class="success-icon" data-v-343c04ec>✓</div><h3 class="success-title" data-v-343c04ec>Terima Kasih!</h3><p class="success-msg" data-v-343c04ec> Kami telah menerima pendaftaranmu. Tim kami akan menghubungimu dalam 1×24 jam. </p></div>`);
      } else {
        _push(`<form class="contact-form" novalidate data-v-343c04ec><div class="form-header" data-v-343c04ec><h3 class="form-title" data-v-343c04ec>Formulir Pendaftaran</h3><p class="form-sub" data-v-343c04ec>Isi data di bawah — gratis &amp; tanpa biaya apapun</p></div><div class="form-grid" data-v-343c04ec><div class="${ssrRenderClass([{ "has-error": fieldError("name") }, "form-field"])}" data-v-343c04ec><label class="field-label" data-v-343c04ec>Nama Lengkap *</label><input${ssrRenderAttr("value", form.value.name)} type="text" class="field-input" placeholder="Masukkan nama lengkap" required autocomplete="name" data-v-343c04ec>`);
        if (fieldError("name")) {
          _push(`<span class="field-error" data-v-343c04ec>${ssrInterpolate(fieldError("name"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="${ssrRenderClass([{ "has-error": fieldError("phone") }, "form-field"])}" data-v-343c04ec><label class="field-label" data-v-343c04ec>Nomor WhatsApp *</label><input${ssrRenderAttr("value", form.value.phone)} type="tel" class="field-input" placeholder="08xx-xxxx-xxxx" required autocomplete="tel" data-v-343c04ec>`);
        if (fieldError("phone")) {
          _push(`<span class="field-error" data-v-343c04ec>${ssrInterpolate(fieldError("phone"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="${ssrRenderClass([{ "has-error": fieldError("program") }, "form-field form-field--full"])}" data-v-343c04ec><label class="field-label" data-v-343c04ec>Jurusan yang Diminati *</label><select class="field-input field-select" required data-v-343c04ec><option value="" disabled data-v-343c04ec${ssrIncludeBooleanAttr(Array.isArray(form.value.program) ? ssrLooseContain(form.value.program, "") : ssrLooseEqual(form.value.program, "")) ? " selected" : ""}>Pilih jurusan</option><!--[-->`);
        ssrRenderList(programs, (p) => {
          _push(`<option${ssrRenderAttr("value", p)} data-v-343c04ec${ssrIncludeBooleanAttr(Array.isArray(form.value.program) ? ssrLooseContain(form.value.program, p) : ssrLooseEqual(form.value.program, p)) ? " selected" : ""}>${ssrInterpolate(p)}</option>`);
        });
        _push(`<!--]--></select>`);
        if (fieldError("program")) {
          _push(`<span class="field-error" data-v-343c04ec>${ssrInterpolate(fieldError("program"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="form-field form-field--full" data-v-343c04ec><label class="field-label" data-v-343c04ec>Pesan / Pertanyaan</label><textarea class="field-input field-textarea" placeholder="Tulis pertanyaan atau pesan kamu di sini..." rows="4" data-v-343c04ec>${ssrInterpolate(form.value.message)}</textarea></div></div>`);
        if (globalError.value) {
          _push(`<div class="alert-error" data-v-343c04ec><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-343c04ec><circle cx="12" cy="12" r="10" data-v-343c04ec></circle><path d="M12 8v4M12 16h.01" data-v-343c04ec></path></svg> ${ssrInterpolate(globalError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="btn-gold-solid form-submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-343c04ec>`);
        if (loading.value) {
          _push(`<span class="loading-spinner" data-v-343c04ec></span>`);
        } else {
          _push(`<span data-v-343c04ec>Kirim Pendaftaran</span>`);
        }
        if (!loading.value) {
          _push(`<span data-v-343c04ec><svg width="16" height="16" viewBox="0 0 16 16" fill="none" data-v-343c04ec><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-343c04ec></path></svg></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><p class="form-note" data-v-343c04ec>* Wajib diisi. Data kamu aman bersama kami.</p></form>`);
      }
      _push(`</div></div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Landing/ContactSection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ContactSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-343c04ec"]]);
const _sfc_main$1 = {
  __name: "FooterSection",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const profil = computed(() => page.props.profilSekolah ?? {});
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const links = {
      "Navigasi": [
        { label: "Beranda", id: "home" },
        { label: "Tentang Kami", id: "about" },
        { label: "Program Keahlian", id: "programs" },
        { label: "Artikel", id: "articles" },
        { label: "Kontak", id: "contact" }
      ],
      "Program": [
        { label: "MPLB", id: "programs" },
        { label: "Bisnis Retail", id: "programs" }
      ],
      "Info": [
        { label: "Pendaftaran", id: "contact" },
        { label: "Beasiswa", id: "contact" },
        { label: "Karir Alumni", id: "contact" },
        { label: "Kerjasama Industri", id: "contact" }
      ]
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-8991f9d9><div class="footer-top-line" data-v-8991f9d9></div><div class="footer-glow" data-v-8991f9d9></div><div class="footer-inner" data-v-8991f9d9><div class="footer-brand" data-v-8991f9d9><button class="footer-logo" data-v-8991f9d9><span class="footer-logo-text" data-v-8991f9d9>${ssrInterpolate(profil.value.namaSekolah ?? "-")}</span></button><p class="footer-tagline" data-v-8991f9d9> Mencetak generasi profesional yang siap bersaing di era global dengan pendidikan vokasi berkualitas tinggi. </p><div class="footer-accreditation" data-v-8991f9d9><span class="accreditation-badge" data-v-8991f9d9>Akreditasi B</span><span class="accreditation-badge" data-v-8991f9d9>SMK PK — Pusat Keunggulan</span></div><div class="footer-socials" data-v-8991f9d9><a href="#" class="footer-social" aria-label="Instagram" data-v-8991f9d9><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-8991f9d9><rect x="2" y="2" width="20" height="20" rx="5" data-v-8991f9d9></rect><circle cx="12" cy="12" r="5" data-v-8991f9d9></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" data-v-8991f9d9></circle></svg></a><a href="#" class="footer-social" aria-label="YouTube" data-v-8991f9d9><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-8991f9d9><rect x="2" y="5" width="20" height="14" rx="3" data-v-8991f9d9></rect><path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" data-v-8991f9d9></path></svg></a><a href="#" class="footer-social" aria-label="WhatsApp" data-v-8991f9d9><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-8991f9d9><circle cx="12" cy="12" r="10" data-v-8991f9d9></circle><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.4-.7 2.7-1.8 3.4l.8 2.6-2.8-.9C11.5 17.7 9.8 17 9 15.8" data-v-8991f9d9></path></svg></a><a href="#" class="footer-social" aria-label="TikTok" data-v-8991f9d9><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-8991f9d9><path d="M9 12a4 4 0 1 0 4 4V4c.5 2 2.5 4 5 4" data-v-8991f9d9></path></svg></a></div></div><!--[-->`);
      ssrRenderList(links, (items, groupName) => {
        _push(`<div class="footer-col" data-v-8991f9d9><h4 class="footer-col-title" data-v-8991f9d9>${ssrInterpolate(groupName)}</h4><ul class="footer-links" data-v-8991f9d9><!--[-->`);
        ssrRenderList(items, (link) => {
          _push(`<li data-v-8991f9d9><button class="footer-link" data-v-8991f9d9>${ssrInterpolate(link.label)}</button></li>`);
        });
        _push(`<!--]--></ul></div>`);
      });
      _push(`<!--]--><div class="footer-col" data-v-8991f9d9><h4 class="footer-col-title" data-v-8991f9d9>Kontak</h4><div class="footer-contact-list" data-v-8991f9d9><div class="footer-contact-item" data-v-8991f9d9><span class="fc-icon" data-v-8991f9d9>📍</span><span data-v-8991f9d9>${ssrInterpolate(profil.value.alamat ?? "-")}</span></div><div class="footer-contact-item" data-v-8991f9d9><span class="fc-icon" data-v-8991f9d9>📞</span><span data-v-8991f9d9>${ssrInterpolate(profil.value.telepon ?? "-")}</span></div><div class="footer-contact-item" data-v-8991f9d9><span class="fc-icon" data-v-8991f9d9>✉️</span><span data-v-8991f9d9>${ssrInterpolate(profil.value.email ?? "-")}</span></div></div><button class="btn-gold-solid footer-cta-btn" data-v-8991f9d9> Daftar Sekarang </button></div></div><div class="footer-bottom" data-v-8991f9d9><div class="footer-bottom-inner" data-v-8991f9d9><span class="footer-copy" data-v-8991f9d9> © ${ssrInterpolate(unref(year))} PT Lumi Platforms Indonesia </span><div class="footer-bottom-links" data-v-8991f9d9><a href="#" class="footer-policy-link" data-v-8991f9d9>Kebijakan Privasi</a><span class="footer-bottom-sep" data-v-8991f9d9>·</span><a href="#" class="footer-policy-link" data-v-8991f9d9>Syarat &amp; Ketentuan</a></div></div></div></footer>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Landing/FooterSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FooterSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8991f9d9"]]);
const _sfc_main = {
  __name: "HomePage",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "SMK Nusantara",
      "description": "Sekolah Menengah Kejuruan Nusantara — mencetak generasi profesional siap kerja",
      "url": "https://smknusantara.sch.id",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ID",
        "addressRegion": "Indonesia"
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title class="capitalize"${_scopeId}>${ssrInterpolate(unref(page).props.tenant?.name)} | Smart Learning System App</title><meta name="description" content="SMK Nusantara adalah sekolah menengah kejuruan terkemuka yang mendidik generasi profesional siap kerja dengan kurikulum modern, fasilitas lengkap, dan mitra industri terpercaya."${_scopeId}><meta name="keywords" content="SMK Nusantara, sekolah kejuruan terbaik, RPL, TKJ, Multimedia, Akuntansi, pendaftaran SMK 2024, SMK unggulan"${_scopeId}><meta name="robots" content="index, follow"${_scopeId}><meta name="author" content="SMK Nusantara"${_scopeId}><meta property="og:title" content="SMK Nusantara — Sekolah Kejuruan Unggulan"${_scopeId}><meta property="og:description" content="Bergabunglah dengan SMK Nusantara. Kami mencetak generasi profesional yang siap bersaing di era global dengan pendidikan vokasi berkualitas tinggi."${_scopeId}><meta property="og:type" content="website"${_scopeId}><meta property="og:url" content="https://smknusantara.sch.id"${_scopeId}><meta property="og:image" content="https://smknusantara.sch.id/og-image.jpg"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title" content="SMK Nusantara — Sekolah Kejuruan Unggulan"${_scopeId}><meta name="twitter:description" content="Wujudkan masa depan gemilangmu bersama SMK Nusantara."${_scopeId}><link rel="canonical" href="https://smknusantara.sch.id"${_scopeId}><link rel="preconnect" href="https://fonts.googleapis.com"${_scopeId}><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"${_scopeId}><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&amp;family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet"${_scopeId}>`);
          } else {
            return [
              createVNode("title", { class: "capitalize" }, toDisplayString(unref(page).props.tenant?.name) + " | Smart Learning System App", 1),
              createVNode("meta", {
                name: "description",
                content: "SMK Nusantara adalah sekolah menengah kejuruan terkemuka yang mendidik generasi profesional siap kerja dengan kurikulum modern, fasilitas lengkap, dan mitra industri terpercaya."
              }),
              createVNode("meta", {
                name: "keywords",
                content: "SMK Nusantara, sekolah kejuruan terbaik, RPL, TKJ, Multimedia, Akuntansi, pendaftaran SMK 2024, SMK unggulan"
              }),
              createVNode("meta", {
                name: "robots",
                content: "index, follow"
              }),
              createVNode("meta", {
                name: "author",
                content: "SMK Nusantara"
              }),
              createVNode("meta", {
                property: "og:title",
                content: "SMK Nusantara — Sekolah Kejuruan Unggulan"
              }),
              createVNode("meta", {
                property: "og:description",
                content: "Bergabunglah dengan SMK Nusantara. Kami mencetak generasi profesional yang siap bersaing di era global dengan pendidikan vokasi berkualitas tinggi."
              }),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                property: "og:url",
                content: "https://smknusantara.sch.id"
              }),
              createVNode("meta", {
                property: "og:image",
                content: "https://smknusantara.sch.id/og-image.jpg"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: "SMK Nusantara — Sekolah Kejuruan Unggulan"
              }),
              createVNode("meta", {
                name: "twitter:description",
                content: "Wujudkan masa depan gemilangmu bersama SMK Nusantara."
              }),
              createVNode("link", {
                rel: "canonical",
                href: "https://smknusantara.sch.id"
              }),
              createVNode("link", {
                rel: "preconnect",
                href: "https://fonts.googleapis.com"
              }),
              createVNode("link", {
                rel: "preconnect",
                href: "https://fonts.gstatic.com",
                crossorigin: "anonymous"
              }),
              createVNode("link", {
                href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
                rel: "stylesheet"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div id="smk-nusantara" class="smk-root">`);
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      _push(`<main>`);
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(ssrRenderComponent(AboutSection, null, null, _parent));
      _push(ssrRenderComponent(ProgramsSection, null, null, _parent));
      _push(ssrRenderComponent(StatsSection, null, null, _parent));
      _push(ssrRenderComponent(TestimonialsSection, null, null, _parent));
      _push(ssrRenderComponent(CTASection, null, null, _parent));
      _push(ssrRenderComponent(ContactSection, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(FooterSection, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/HomePage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
