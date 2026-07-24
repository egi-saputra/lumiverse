import { ref, inject, computed, onMounted, onUnmounted, mergeProps, unref, withCtx, createTextVNode, useSSRContext, provide, createVNode, reactive } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link, Head } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { F as Footer } from "./LegalitasSection-WL5YB0Nn.js";
const _sfc_main$2 = {
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const isScrolled = ref(false);
    const isMenuOpen = ref(false);
    const scrollRoot = inject("scrollRoot");
    function isIpOrLocalhost(hostname) {
      return hostname === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    }
    const centralDomain = computed(() => {
      const hostname = window.location.hostname;
      if (isIpOrLocalhost(hostname)) return "localhost";
      return page.props.centralDomain ?? hostname;
    });
    const protocolPort = computed(() => {
      const protocol = window.location.protocol;
      const port = window.location.port ? `:${window.location.port}` : "";
      return { protocol, port };
    });
    const currentSubdomain = computed(() => {
      const hostname = window.location.hostname;
      const base = centralDomain.value;
      if (hostname === base) return null;
      return hostname.replace(`.${base}`, "");
    });
    function subdomainUrl(prefix) {
      const { protocol, port } = protocolPort.value;
      if (!prefix) return `${protocol}//${centralDomain.value}${port}/`;
      return `${protocol}//${prefix}.${centralDomain.value}${port}/`;
    }
    const navItems = [
      { key: null, label: "Beranda" },
      { key: "about", label: "Tentang Kami" },
      { key: "article", label: "Artikel" },
      { key: "docs", label: "Dokumentasi" }
    ];
    function isCurrent(key) {
      return currentSubdomain.value === key;
    }
    function handleScroll() {
      isScrolled.value = (scrollRoot?.value?.scrollTop ?? 0) > 40;
    }
    onMounted(() => {
      scrollRoot?.value?.addEventListener("scroll", handleScroll, { passive: true });
    });
    onUnmounted(() => {
      scrollRoot?.value?.removeEventListener("scroll", handleScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: ["navbar", { scrolled: isScrolled.value, "menu-open": isMenuOpen.value }],
        role: "navigation",
        "aria-label": "Main navigation"
      }, _attrs))} data-v-d16f178b><div class="navbar-bg" aria-hidden="true" data-v-d16f178b></div><div class="container" data-v-d16f178b><div class="navbar-content" data-v-d16f178b><a${ssrRenderAttr("href", subdomainUrl(null))} class="nav-logo" data-v-d16f178b><img src="/images/logo-dark.webp" alt="Lumiverse School" class="h-8 object-cover scale-150 flex" data-v-d16f178b><div class="text-2xl font-semibold logo-text-static" data-v-d16f178b> Lumiverse <span class="text-cyan" data-v-d16f178b>School</span></div></a><ul class="nav-links" role="list" data-v-d16f178b><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(`<li data-v-d16f178b>`);
        if (!isCurrent(item.key)) {
          _push(`<a${ssrRenderAttr("href", subdomainUrl(item.key))} data-v-d16f178b>${ssrInterpolate(item.label)}</a>`);
        } else {
          _push(`<span class="nav-current" data-v-d16f178b>${ssrInterpolate(item.label)}</span>`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--><li data-v-d16f178b><a${ssrRenderAttr("href", subdomainUrl(null) + "#kontak")} data-v-d16f178b>Kontak</a></li></ul><div class="nav-actions" data-v-d16f178b>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/lumiverse/login",
        class: "btn-ghost"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Login`);
          } else {
            return [
              createTextVNode("Login")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/registration",
        class: "btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Coba Gratis`);
          } else {
            return [
              createTextVNode("Coba Gratis")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button class="nav-toggle"${ssrRenderAttr("aria-expanded", isMenuOpen.value)} aria-label="Buka menu" data-v-d16f178b><span class="${ssrRenderClass([{ open: isMenuOpen.value }, "burger-line"])}" data-v-d16f178b></span><span class="${ssrRenderClass([{ open: isMenuOpen.value }, "burger-line"])}" data-v-d16f178b></span><span class="${ssrRenderClass([{ open: isMenuOpen.value }, "burger-line"])}" data-v-d16f178b></span></button></div><div class="${ssrRenderClass([{ open: isMenuOpen.value }, "mobile-menu"])}" data-v-d16f178b><ul class="mobile-links" data-v-d16f178b><!--[-->`);
      ssrRenderList(navItems, (item, i) => {
        _push(`<li style="${ssrRenderStyle(`--i: ${i}`)}" data-v-d16f178b>`);
        if (!isCurrent(item.key)) {
          _push(`<a class="mobile-link"${ssrRenderAttr("href", subdomainUrl(item.key))} data-v-d16f178b>${ssrInterpolate(item.label)}</a>`);
        } else {
          _push(`<span class="mobile-link nav-current" data-v-d16f178b>${ssrInterpolate(item.label)}</span>`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--><li style="${ssrRenderStyle(`--i: ${navItems.length}`)}" data-v-d16f178b><a class="mobile-link"${ssrRenderAttr("href", subdomainUrl(null) + "#kontak")} data-v-d16f178b>Kontak</a></li></ul><div class="mobile-cta-group" data-v-d16f178b>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/lumiverse/login",
        class: "btn-mob-ghost",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Masuk`);
          } else {
            return [
              createTextVNode("Masuk")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/registration",
        class: "btn-mob-cta",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Coba Gratis`);
          } else {
            return [
              createTextVNode("Coba Gratis")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></nav>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/About/Navbar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-d16f178b"]]);
const _sfc_main$1 = {
  __name: "AboutLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const scrollRoot = ref(null);
    provide("scrollRoot", scrollRoot);
    onMounted(() => {
      document.documentElement.classList.add("lock-scroll");
      document.body.classList.add("lock-scroll");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: scrollRoot.value,
          // penting: root sekarang container, bukan viewport document
          threshold: 0.1,
          rootMargin: "0px 0px -40px 0px"
        }
      );
      scrollRoot.value?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    });
    onUnmounted(() => {
      document.documentElement.classList.remove("lock-scroll");
      document.body.classList.remove("lock-scroll");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta name="theme-color" content="#0b1120"${_scopeId}><meta name="msapplication-navbutton-color" content="#0b1120"${_scopeId}><meta name="apple-mobile-web-app-capable" content="yes"${_scopeId}><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"${_scopeId}><meta name="color-scheme" content="dark"${_scopeId}><link rel="preconnect" href="https://fonts.googleapis.com"${_scopeId}><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin${_scopeId}><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&amp;family=Inter:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap"${_scopeId}>`);
          } else {
            return [
              createVNode("meta", {
                name: "theme-color",
                content: "#0b1120"
              }),
              createVNode("meta", {
                name: "msapplication-navbutton-color",
                content: "#0b1120"
              }),
              createVNode("meta", {
                name: "apple-mobile-web-app-capable",
                content: "yes"
              }),
              createVNode("meta", {
                name: "apple-mobile-web-app-status-bar-style",
                content: "black-translucent"
              }),
              createVNode("meta", {
                name: "color-scheme",
                content: "dark"
              }),
              createVNode("link", {
                rel: "preconnect",
                href: "https://fonts.googleapis.com"
              }),
              createVNode("link", {
                rel: "preconnect",
                href: "https://fonts.gstatic.com",
                crossorigin: ""
              }),
              createVNode("link", {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="scroll-viewport no-scrollbar" id="scroll-root">`);
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      _push(`<main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AboutLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "AboutSection",
  __ssrInlineRender: true,
  setup(__props) {
    const milestones = [
      { year: "2021", title: "Lahirnya Aplikasi Pembelajaran Lumiverse School", desc: "Berawal dari rasa frustasi terhadap sistem administrasi sekolah yang masih dikelola secara manual, sehingga perlu menghabiskan banyak waktu dan tenaga hanya untuk urusan administrasi yang kaku." },
      { year: "2022", title: "Mewujudkan ide di kepala menjadi sebuah produk nyata", desc: "Membangun struktur dan menciptakan sebuah sistem aplikasi pembelajaran yang sustainable, cepat, aman dan stabil namun tetap intuitif serta mudah digunakan oleh para guru dan siswa tanpa keahlian teknis khusus apapun dalam menghadapi perkembangan teknologi digital di era IOT 4.0." },
      { year: "2023", title: "Proses uji coba dan pengembangan bertahap", desc: "Melihat, mempelajari, dan memperbaiki setiap kendala yang dihadapi, serta mengembangkan sistem aplikasi agar memiliki performa tinggi dan memberikan pengalaman yang lebih baik bagi pengguna." },
      { year: "2024", title: "Upgrade micro engine sistem", desc: "Penerapan micro-engine pada sistem backend guna memfasilitasi beberapa fitur yang memerlukan performa tinggi secara realtime untuk menghindari gangguan seperti bottleneck atau server down karena traffic pooling yang tinggi di waktu-waktu paling krusial seperti pada saat pelaksanaan ujian." },
      { year: "2025", title: "Piloting 6 sekolah terdekat", desc: "Meluncur ke 6 sekolah pertama di area terdekat dalam proses transformasi digitalisasi sekolah. Feedback langsung dari guru & kepala sekolah menjadi motivasi dan fondasi produk kami." },
      { year: "2026", title: "Ekspansi Nasional & Legalitas Hukum", desc: "Menjangkau 70+ sekolah di 6 provinsi dan pendirian serta pembentukan legalitas badan hukum menjadi sebuah Perusahaan Perseroan (PT) dengan nomor SK AHU-A099848.AH.01.30.Tahun 2026." }
      // { year: '2026', title: 'Take Experiencing & Ekspansi Nasional', desc: 'Menjangkau 70+ sekolah di 6 provinsi dan sudah berpengalaman dalam menghadapi ribuan siswa untuk pelaksanaan ujian sekolah secara online dan serentak tanpa kendala selama bertahun-tahun.' },
    ];
    const team = [
      {
        name: "Egi Saputra",
        role: "Founder, Chief Product & Digital Officer",
        bio: "Tiga tahun berkarier sebagai seorang guru honorer di salah satu sekolah swasta Kabupaten Bogor dan mengambil berbagai macam freelance dengan mengambil jobdesk seperti Web Developer dan Software Engineer, sebelum memutuskan untuk fokus membangun produk digitalnya sendiri. Percaya teknologi terbaik adalah yang paling tidak terasa, simpel di tangan pengguna, kokoh di baliknya.",
        photo: "/images/team/egi-saputra.jpg",
        initials: "ES",
        gradient: "linear-gradient(135deg, #00D4FF, #0066ff)"
      },
      {
        name: "Siti Rahayu",
        role: "Chief Executive Officer",
        bio: "Enam tahun memimpin sebagai kepala sekolah SMA sebelum terjun membangun Lumiverse School. Tahu persis di mana letak keruwetan administrasi sekolah, karena pernah mengalaminya langsung dari dalam.",
        photo: "/images/team/siti-rahayu.jpg",
        initials: "SR",
        gradient: "linear-gradient(135deg, #F5A623, #e05c00)"
      },
      {
        name: "Cantika Apriliani",
        role: "Chief Financial Officer",
        bio: "Berlatar belakang akuntansi dengan jam terbang mengelola keuangan bisnis rintisan sejak tahap paling awal. Memastikan setiap keputusan perusahaan berpijak pada angka yang sehat, bukan sekadar optimisme.",
        photo: "/images/team/cantika-apriliani.jpg",
        initials: "CA",
        gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)"
      },
      {
        name: "Riko Syarif Hidayat",
        role: "Chief Marketing Officer",
        bio: "Praktisi pemasaran digital yang membangun brand dari nol hingga dikenal ratusan sekolah di seluruh Indonesia. Percaya cerita yang jujur adalah strategi pemasaran paling kuat yang bisa dimiliki produk edukasi.",
        photo: "/images/team/riko-syarif.jpg",
        initials: "RH",
        gradient: "linear-gradient(135deg, #fb7185, #e11d48)"
      },
      {
        name: "Dewi Kusuma",
        role: "Head of Customer Success",
        bio: "Memastikan setiap sekolah berhasil onboarding dalam 7 hari pertama. Skor NPS tim Customer Success yang ia pimpin: 92 — bukti bahwa layanan yang baik dimulai dari mendengarkan.",
        photo: "/images/team/dewi-kusuma.jpg",
        initials: "DK",
        gradient: "linear-gradient(135deg, #34d399, #059669)"
      },
      {
        name: "Dayanih Elvasari",
        role: "Co-Founder & President Commissioner",
        bio: "Membawa pengalaman lintas industri dalam tata kelola dan pengawasan strategis. Menjaga arah pertumbuhan Lumiverse School tetap selaras dengan visi jangka panjang dan prinsip good corporate governance.",
        photo: "/images/team/dayanih-elvasari.jpg",
        initials: "DE",
        gradient: "linear-gradient(135deg, #94a3b8, #475569)"
      }
    ];
    const activeMember = ref(null);
    const imgError = reactive({});
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "about",
        class: "about-section",
        "aria-labelledby": "about-title"
      }, _attrs))} data-v-e21815b8><div class="ambient" aria-hidden="true" data-v-e21815b8><div class="orb orb--cyan" data-v-e21815b8></div><div class="orb orb--violet" data-v-e21815b8></div></div><div class="container sm:block hidden" data-v-e21815b8><div class="section-header centered reveal" data-v-e21815b8><span class="section-eyebrow" data-v-e21815b8>Tentang Kami</span><h2 class="section-title" id="about-title" data-v-e21815b8> Lumiverse School<br data-v-e21815b8></h2><span class="section-desc" data-v-e21815b8>Merupakan sebuah platform yang hadir untuk memberikan solusi dan kemudahan dalam transformasi digitalisasi sekolah atau lembaga pendidikan di Indonesia</span><p class="section-desc" data-v-e21815b8> Lumiverse School lahir dari satu pertanyaan sederhana: <em data-v-e21815b8>kenapa guru di Indonesia disibukkan dengan urusan administrasi sekolah?</em> Seharusnya guru lebih fokus dengan inovasi dalam mengembangkan sistem pembelajaran dan pendidikan di Indonesia demi membangun generasi penerus bangsa yang kompeten dan berintegritas, Kami pun hadir untuk membantu dalam mengatasi hal tersebut. </p></div><div class="visi-misi-grid reveal" data-v-e21815b8><div class="vm-card vm-visi" data-v-e21815b8><div class="vm-icon" aria-hidden="true" data-v-e21815b8>🌟</div><div class="vm-label" data-v-e21815b8>Visi</div><p class="vm-text" data-v-e21815b8> Menjadi infrastruktur digital pendidikan yang menggerakkan setiap sekolah di Indonesia menuju kualitas pembelajaran kelas dunia pada era Internet of Things (IOT 4.0). </p></div><div class="vm-divider" aria-hidden="true" data-v-e21815b8><div class="vm-divider-line" data-v-e21815b8></div><div class="vm-divider-dot" data-v-e21815b8></div><div class="vm-divider-line" data-v-e21815b8></div></div><div class="vm-card vm-misi" data-v-e21815b8><div class="vm-icon" aria-hidden="true" data-v-e21815b8>🚀</div><div class="vm-label" data-v-e21815b8>Misi</div><ul class="vm-list" data-v-e21815b8><li data-v-e21815b8>Menyederhanakan administrasi sekolah melalui teknologi yang intuitif</li><li data-v-e21815b8>Memberdayakan guru agar fokus mengajar, bukan mengurus administrasi</li><li data-v-e21815b8>Menghubungkan orang tua, siswa, dan sekolah dalam satu ekosistem digital</li><li data-v-e21815b8>Menghadirkan data &amp; analitik yang membantu pengambilan keputusan berbasis fakta</li></ul></div></div></div><div class="container" data-v-e21815b8><div class="timeline-header section-header centered reveal" data-v-e21815b8><span class="section-eyebrow" data-v-e21815b8>Perjalanan Kami</span><h3 class="section-title" data-v-e21815b8>Dari ide di sekolah menjadi platform nasional</h3></div><div class="timeline" role="list" data-v-e21815b8><!--[-->`);
      ssrRenderList(milestones, (ms, i) => {
        _push(`<div class="${ssrRenderClass([{ "timeline-item--right": i % 2 !== 0 }, "timeline-item reveal"])}" style="${ssrRenderStyle(`transition-delay: ${i * 0.1}s`)}" role="listitem" data-v-e21815b8><div class="timeline-year" aria-label="\`Tahun \${ms.year}\`" data-v-e21815b8>${ssrInterpolate(ms.year)}</div><div class="timeline-connector" aria-hidden="true" data-v-e21815b8><div class="timeline-dot" data-v-e21815b8></div><div class="timeline-line" data-v-e21815b8></div></div><div class="timeline-content" data-v-e21815b8><h4 class="timeline-title" data-v-e21815b8>${ssrInterpolate(ms.title)}</h4><p class="timeline-desc" data-v-e21815b8>${ssrInterpolate(ms.desc)}</p></div></div>`);
      });
      _push(`<!--]--></div></div><div class="team-band" data-v-e21815b8><div class="container" data-v-e21815b8><div class="section-header centered reveal" data-v-e21815b8><span class="text-4xl font-semibold text-[var(--cyan)] mb-10 tracking-wide" data-v-e21815b8>Executives</span><h3 class="section-title" data-v-e21815b8>Meet Lumi&#39;s executives and access their biographies and headshots.</h3><h3 class="text-xl font-semibold mt-3" data-v-e21815b8>Meet Lumi&#39;s executives and access their biographies and headshots. </h3><p class="section-desc" data-v-e21815b8> Gabungan praktisi edukasi dan engineer berpengalaman yang menyatukan passion yang sama: memajukan sistem pendidikan Indonesia. </p></div><div class="team-grid" data-v-e21815b8><!--[-->`);
      ssrRenderList(team, (member, i) => {
        _push(`<div class="team-card reveal" style="${ssrRenderStyle(`transition-delay: ${i * 0.1}s`)}" data-v-e21815b8><div class="team-photo-wrap" data-v-e21815b8>`);
        if (member.photo && !imgError[member.name]) {
          _push(`<img${ssrRenderAttr("src", member.photo)}${ssrRenderAttr("alt", member.name)} class="team-photo" data-v-e21815b8>`);
        } else {
          _push(`<div class="team-avatar-fallback" style="${ssrRenderStyle(`background: ${member.gradient}`)}" aria-hidden="true" data-v-e21815b8>${ssrInterpolate(member.initials)}</div>`);
        }
        _push(`</div><h4 class="team-name" data-v-e21815b8>${ssrInterpolate(member.name)}</h4><div class="team-role font-poppins font-semibold text-sky-400" data-v-e21815b8>${ssrInterpolate(member.role)}</div><button type="button" class="team-info-btn" data-v-e21815b8><span class="team-info-arrow" aria-hidden="true" data-v-e21815b8>›</span> Read bio </button></div>`);
      });
      _push(`<!--]--></div><div class="hiring-cta reveal" data-v-e21815b8><div class="hiring-icon" aria-hidden="true" data-v-e21815b8>✨</div><div class="hiring-text" data-v-e21815b8><strong data-v-e21815b8>Kami sedang berkembang!</strong> Tertarik untuk bergabung dan mengembangkan potensimu bersama Kami? </div><a href="/karir" class="hiring-btn" data-v-e21815b8>Lihat Lowongan →</a></div></div></div>`);
      if (activeMember.value) {
        _push(`<div class="team-modal-overlay" data-v-e21815b8><div class="team-modal" role="dialog" aria-modal="true" data-v-e21815b8><button type="button" class="team-modal-close" aria-label="Tutup" data-v-e21815b8>✕</button><div class="team-modal-photo-wrap" data-v-e21815b8>`);
        if (activeMember.value.photo && !imgError[activeMember.value.name]) {
          _push(`<img${ssrRenderAttr("src", activeMember.value.photo)}${ssrRenderAttr("alt", activeMember.value.name)} class="team-modal-photo" data-v-e21815b8>`);
        } else {
          _push(`<div class="team-avatar-fallback" style="${ssrRenderStyle(`background: ${activeMember.value.gradient}`)}" data-v-e21815b8>${ssrInterpolate(activeMember.value.initials)}</div>`);
        }
        _push(`</div><h3 class="team-modal-name" data-v-e21815b8>${ssrInterpolate(activeMember.value.name)}</h3><div class="team-modal-role" data-v-e21815b8>${ssrInterpolate(activeMember.value.role)}</div><p class="team-modal-bio" data-v-e21815b8>${ssrInterpolate(activeMember.value.bio)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HomePage/AboutSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AboutSection = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e21815b8"]]);
export {
  AboutSection as A,
  _sfc_main$1 as _
};
