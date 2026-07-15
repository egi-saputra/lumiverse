<script setup>
import { ref, reactive } from 'vue'

const values = [
    {
        icon: '⚡',
        title: 'Fast by Default',
        desc: 'Pengalaman yang cepat bukan fitur tambahan, tetapi standar kualitas produk. Kami menghilangkan proses manual yang tidak perlu dan memakan waktu.',
    },
    {
        icon: '🚀',
        title: 'Performance Matters',
        desc: 'Setiap fitur dirancang agar tetap cepat, responsif, dan stabil, bahkan saat digunakan secara bersamaan.',
    },
    {
        icon: '🤖',
        title: 'Automate Everything',
        desc: 'Setiap proses yang dapat diotomatisasi akan kami sederhanakan agar pengguna dapat fokus pada hal yang lebih bermakna.',
    },
    {
        icon: '🎯',
        title: 'Built for Simplicity',
        desc: 'Teknologi yang kompleks kami sembunyikan di balik pengalaman pengguna yang sederhana dan mudah dipahami.',
    },
    {
        icon: '🔒',
        title: 'Security by Design',
        desc: 'Keamanan dan privasi data menjadi bagian dari fondasi sistem, bukan sekadar fitur tambahan.',
    },
    // {
    //     icon: '📈',
    //     title: 'Scalable by Default',
    //     desc: 'Platform dirancang untuk tumbuh bersama sekolah, mulai dari puluhan hingga ribuan pengguna.',
    // },
    {
        icon: '✨',
        title: 'Thoughtful Experience',
        desc: 'Kami percaya pengalaman pengguna yang baik lebih penting daripada daftar fitur yang panjang.',
    },
    {
        icon: '❤️',
        title: 'Built with Passion',
        desc: 'Kami membangun Lumiverse sebagai produk yang terus berkembang, bukan sekadar proyek yang selesai setelah diluncurkan.',
    },
    {
        icon: '🔄',
        title: 'Continuous Improvement',
        desc: 'Kami terus mendengarkan masukan pengguna untuk menghadirkan pembaruan yang bermakna.'
    },
]

const milestones = [
    { year: '2021', title: 'Lahirnya Aplikasi Pembelajaran Lumiverse School', desc: 'Berawal dari rasa frustasi terhadap sistem administrasi sekolah yang masih dikelola secara manual, sehingga perlu menghabiskan banyak waktu dan tenaga hanya untuk urusan administrasi yang kaku.' },
    { year: '2022', title: 'Mewujudkan ide di kepala menjadi sebuah produk nyata', desc: 'Membangun struktur dan menciptakan sebuah sistem aplikasi pembelajaran yang sustainable, cepat, aman dan stabil namun tetap intuitif serta mudah digunakan oleh para guru dan siswa tanpa keahlian teknis khusus apapun dalam menghadapi perkembangan teknologi digital di era IOT 4.0.' },
    { year: '2023', title: 'Proses uji coba dan pengembangan bertahap', desc: 'Melihat, mempelajari, dan memperbaiki setiap kendala yang dihadapi, serta mengembangkan sistem aplikasi agar memiliki performa tinggi dan memberikan pengalaman yang lebih baik bagi pengguna.' },
    { year: '2024', title: 'Upgrade micro engine sistem', desc: 'Penerapan micro-engine pada sistem backend guna memfasilitasi beberapa fitur yang memerlukan performa tinggi secara realtime untuk menghindari gangguan seperti bottleneck atau server down karena traffic pooling yang tinggi di waktu-waktu paling krusial seperti pada saat pelaksanaan ujian.' },
    { year: '2025', title: 'Piloting 6 sekolah terdekat', desc: 'Meluncur ke 6 sekolah pertama di area terdekat dalam proses transformasi digitalisasi sekolah. Feedback langsung dari guru & kepala sekolah menjadi motivasi dan fondasi produk kami.' },
    { year: '2026', title: 'Ekspansi Nasional & Legalitas Hukum', desc: 'Menjangkau 70+ sekolah di 6 provinsi dan pendirian serta pembentukan legalitas badan hukum menjadi sebuah Perusahaan Perseroan (PT) dengan nomor SK AHU-A099848.AH.01.30.Tahun 2026.' },
    // { year: '2026', title: 'Take Experiencing & Ekspansi Nasional', desc: 'Menjangkau 70+ sekolah di 6 provinsi dan sudah berpengalaman dalam menghadapi ribuan siswa untuk pelaksanaan ujian sekolah secara online dan serentak tanpa kendala selama bertahun-tahun.' },
]

const team = [
    {
        name: 'Egi Saputra',
        role: 'Founder, Chief Product & Digital Officer',
        bio: 'Tiga tahun berkarier sebagai seorang guru honorer di salah satu sekolah swasta Kabupaten Bogor dan mengambil berbagai macam freelance dengan mengambil jobdesk seperti Web Developer dan Software Engineer, sebelum memutuskan untuk fokus membangun produk digitalnya sendiri. Percaya teknologi terbaik adalah yang paling tidak terasa, simpel di tangan pengguna, kokoh di baliknya.',
        photo: '/images/team/egi-saputra.jpg',
        initials: 'ES',
        gradient: 'linear-gradient(135deg, #00D4FF, #0066ff)',
    },
    {
        name: 'Siti Rahayu',
        role: 'Chief Executive Officer',
        bio: 'Enam tahun memimpin sebagai kepala sekolah SMA sebelum terjun membangun Lumiverse School. Tahu persis di mana letak keruwetan administrasi sekolah, karena pernah mengalaminya langsung dari dalam.',
        photo: '/images/team/siti-rahayu.jpg',
        initials: 'SR',
        gradient: 'linear-gradient(135deg, #F5A623, #e05c00)',
    },
    {
        name: 'Cantika Apriliani',
        role: 'Chief Financial Officer',
        bio: 'Berlatar belakang akuntansi dengan jam terbang mengelola keuangan bisnis rintisan sejak tahap paling awal. Memastikan setiap keputusan perusahaan berpijak pada angka yang sehat, bukan sekadar optimisme.',
        photo: '/images/team/cantika-apriliani.jpg',
        initials: 'CA',
        gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    },
    {
        name: 'Riko Syarif Hidayat',
        role: 'Chief Marketing Officer',
        bio: 'Praktisi pemasaran digital yang membangun brand dari nol hingga dikenal ratusan sekolah di seluruh Indonesia. Percaya cerita yang jujur adalah strategi pemasaran paling kuat yang bisa dimiliki produk edukasi.',
        photo: '/images/team/riko-syarif.jpg',
        initials: 'RH',
        gradient: 'linear-gradient(135deg, #fb7185, #e11d48)',
    },
    {
        name: 'Dewi Kusuma',
        role: 'Head of Customer Success',
        bio: 'Memastikan setiap sekolah berhasil onboarding dalam 7 hari pertama. Skor NPS tim Customer Success yang ia pimpin: 92 — bukti bahwa layanan yang baik dimulai dari mendengarkan.',
        photo: '/images/team/dewi-kusuma.jpg',
        initials: 'DK',
        gradient: 'linear-gradient(135deg, #34d399, #059669)',
    },
    {
        name: 'Dayanih Elvasari',
        role: 'Co-Founder & President Commissioner',
        bio: 'Membawa pengalaman lintas industri dalam tata kelola dan pengawasan strategis. Menjaga arah pertumbuhan Lumiverse School tetap selaras dengan visi jangka panjang dan prinsip good corporate governance.',
        photo: '/images/team/dayanih-elvasari.jpg',
        initials: 'DE',
        gradient: 'linear-gradient(135deg, #94a3b8, #475569)',
    },
]

// Modal profil anggota tim
const activeMember = ref(null)
const imgError = reactive({})

function onImgError(member) {
    imgError[member.name] = true
}

function openProfile(member) {
    activeMember.value = member
}

function closeProfile() {
    activeMember.value = null
}
</script>

<template>
    <section id="about" class="about-section" aria-labelledby="about-title">

        <!-- ── Header ─────────────────────────────────────── -->
        <!-- <div class="container sm:block hidden">
            <div class="section-header centered reveal">
                <span class="section-eyebrow">Tentang Kami</span>
                <h2 class="section-title" id="about-title">
                    Lumiverse School<br>
                </h2>
                <span class="section-desc">Merupakan sebuah platform yang hadir untuk
                    memberikan solusi dan kemudahan dalam transformasi digitalisasi sekolah atau lembaga pendidikan di
                    Indonesia</span> -->

        <!-- <p class="section-desc">
                    Lumiverse School lahir dari satu pertanyaan sederhana: <em>kenapa guru di Indonesia disibukkan
                        dengan urusan administrasi sekolah?</em>
                    Seharusnya guru lebih fokus dengan inovasi dalam mengembangkan sistem pembelajaran dan pendidikan di
                    Indonesia demi
                    membangun generasi penerus bangsa yang kompeten dan berintegritas, Kami pun hadir untuk membantu
                    dalam mengatasi hal tersebut.
                </p> -->
        <!-- </div> -->

        <!-- ── Visi & Misi ──────────────────────────────── -->
        <!-- <div class="visi-misi-grid reveal">
                <div class="vm-card vm-visi">
                    <div class="vm-icon" aria-hidden="true">🌟</div>
                    <div class="vm-label">Visi</div>
                    <p class="vm-text">
                        Menjadi infrastruktur digital pendidikan yang menggerakkan setiap sekolah di Indonesia menuju
                        kualitas pembelajaran kelas dunia pada era Internet of Things (IOT 4.0).
                    </p>
                </div>
                <div class="vm-divider" aria-hidden="true">
                    <div class="vm-divider-line"></div>
                    <div class="vm-divider-dot"></div>
                    <div class="vm-divider-line"></div>
                </div>
                <div class="vm-card vm-misi">
                    <div class="vm-icon" aria-hidden="true">🚀</div>
                    <div class="vm-label">Misi</div>
                    <ul class="vm-list">
                        <li>Menyederhanakan administrasi sekolah melalui teknologi yang intuitif</li>
                        <li>Memberdayakan guru agar fokus mengajar, bukan mengurus administrasi</li>
                        <li>Menghubungkan orang tua, siswa, dan sekolah dalam satu ekosistem digital</li>
                        <li>Menghadirkan data & analitik yang membantu pengambilan keputusan berbasis fakta</li>
                    </ul>
                </div>
            </div> -->
        <!-- </div> -->

        <!-- ── Nilai-Nilai ──────────────────────────────────── -->
        <div class="values-band">
            <div class="container">
                <div class="section-header centered reveal">
                    <span class="section-eyebrow">Mengapa Memilih Lumiverse?</span>
                    <!-- <h3 class="section-title">
                        Pengalaman modern yang dirancang untuk sekolah masa kini.
                    </h3> -->
                    <h3 class="section-title">Fokus pada pembelajaran,<br>biarkan teknologi menangani sisanya.</h3>
                </div>
                <div class="values-grid">
                    <div v-for="(val, i) in values" :key="val.title" class="value-card reveal"
                        :style="`transition-delay: ${i * 0.1}s`">
                        <div class="value-icon" aria-hidden="true">{{ val.icon }}</div>
                        <h4 class="value-title">{{ val.title }}</h4>
                        <p class="value-desc">{{ val.desc }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Timeline / Sejarah ───────────────────────────── -->
        <!-- <div class="container">
            <div class="timeline-header section-header centered reveal">
                <span class="section-eyebrow">Perjalanan Kami</span>
                <h3 class="section-title">Dari ide di sekolah menjadi platform nasional</h3>
            </div>

            <div class="timeline" role="list">
                <div v-for="(ms, i) in milestones" :key="ms.year" class="timeline-item reveal"
                    :class="{ 'timeline-item--right': i % 2 !== 0 }" :style="`transition-delay: ${i * 0.1}s`"
                    role="listitem">
                    <div class="timeline-year" aria-label="`Tahun ${ms.year}`">{{ ms.year }}</div>
                    <div class="timeline-connector" aria-hidden="true">
                        <div class="timeline-dot"></div>
                        <div class="timeline-line"></div>
                    </div>
                    <div class="timeline-content">
                        <h4 class="timeline-title">{{ ms.title }}</h4>
                        <p class="timeline-desc">{{ ms.desc }}</p>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- ── Tim ─────────────────────────────────────────── -->
        <!-- <div class="team-band">
            <div class="container">
                <div class="section-header centered reveal">
                    <span class="text-4xl font-semibold text-[var(--cyan)] mb-10 tracking-wide">Executives</span>
                    <h3 class="section-title">Meet Lumi's executives and access their biographies and headshots.</h3>
                    <h3 class="text-xl font-semibold mt-3">Meet Lumi's executives and access their biographies and
                        headshots.
                    </h3>
                    <p class="section-desc">
                        Gabungan praktisi edukasi dan engineer berpengalaman yang menyatukan passion
                        yang sama: memajukan sistem pendidikan Indonesia.
                    </p>
                </div>

                <div class="team-grid">
                    <div v-for="(member, i) in team" :key="member.name" class="team-card reveal"
                        :style="`transition-delay: ${i * 0.1}s`">
                        <div class="team-photo-wrap">
                            <img v-if="member.photo && !imgError[member.name]" :src="member.photo" :alt="member.name"
                                class="team-photo" @error="onImgError(member)" />
                            <div v-else class="team-avatar-fallback" :style="`background: ${member.gradient}`"
                                aria-hidden="true">
                                {{ member.initials }}
                            </div>
                        </div>
                        <h4 class="team-name">{{ member.name }}</h4>
                        <div class="team-role font-poppins font-semibold text-sky-400">{{ member.role }}</div>
                        <button type="button" class="team-info-btn" @click="openProfile(member)">
                            <span class="team-info-arrow" aria-hidden="true">›</span>
                            Read bio
                        </button>
                    </div>
                </div> -->

        <!-- Hiring CTA -->
        <!-- <div class="hiring-cta reveal">
                    <div class="hiring-icon" aria-hidden="true">✨</div>
                    <div class="hiring-text">
                        <strong>Kami sedang berkembang!</strong>
                        Tertarik untuk bergabung dan mengembangkan potensimu bersama Kami?
                    </div>
                    <a href="/karir" class="hiring-btn">Lihat Lowongan →</a>
                </div>
            </div>
        </div> -->

        <!-- Modal Profil Tim -->
        <!-- <Transition name="team-modal-fade">
            <div v-if="activeMember" class="team-modal-overlay" @click.self="closeProfile">
                <div class="team-modal" role="dialog" aria-modal="true">
                    <button type="button" class="team-modal-close" @click="closeProfile" aria-label="Tutup">✕</button>
                    <div class="team-modal-photo-wrap">
                        <img v-if="activeMember.photo && !imgError[activeMember.name]" :src="activeMember.photo"
                            :alt="activeMember.name" class="team-modal-photo" @error="onImgError(activeMember)" />
                        <div v-else class="team-avatar-fallback" :style="`background: ${activeMember.gradient}`">
                            {{ activeMember.initials }}
                        </div>
                    </div>
                    <h3 class="team-modal-name">{{ activeMember.name }}</h3>
                    <div class="team-modal-role">{{ activeMember.role }}</div>
                    <p class="team-modal-bio">{{ activeMember.bio }}</p>
                </div>
            </div>
        </Transition> -->

    </section>
</template>

<style scoped>
/* ── Section wrapper ────────────────────────────────── */
.about-section {
    padding: 7rem 0 0;
    position: relative;
    z-index: 1;
}

/* ── Visi Misi ──────────────────────────────────────── */
.visi-misi-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0;
    align-items: stretch;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 7rem;
}

.vm-card {
    padding: 3rem 2.5rem;
}

.vm-visi {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.04), transparent);
}

.vm-misi {
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.04), transparent);
}

.vm-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.vm-label {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--cyan);
    margin-bottom: 1rem;
}

.vm-misi .vm-label {
    color: var(--gold);
}

.vm-text {
    font-size: 1.05rem;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.85);
    font-style: italic;
}

.vm-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    list-style: none;
    padding: 0;
}

.vm-list li {
    font-size: 0.925rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    padding-left: 1.25rem;
    position: relative;
}

.vm-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--gold);
    font-weight: 700;
}

/* Divider tengah */
.vm-divider {
    width: 1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    background: var(--border);
}

.vm-divider-line {
    flex: 1;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border), transparent);
}

.vm-divider-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--cyan);
    flex-shrink: 0;
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
}

/* ── Values band ─────────────────────────────────────── */
.values-band {
    background: rgba(255, 255, 255, 0.015);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 5rem 0;
    margin-bottom: 7rem;
}

.values-header {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

.values-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.3rem, 2.5vw, 1.75rem);
    line-height: 1.3;
    letter-spacing: -0.02em;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
}

.value-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 1.75rem 1.5rem;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
}

.value-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s;
}

.value-card:hover {
    border-color: rgba(0, 212, 255, 0.25);
    transform: translateY(-3px);
}

.value-card:hover::before {
    opacity: 1;
}

.value-icon {
    font-size: 1.75rem;
    margin-bottom: 1rem;
}

.value-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 0.6rem;
}

.value-desc {
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.65;
}

/* ── Timeline ─────────────────────────────────────────── */
.timeline-header {
    margin-bottom: 4rem;
}

.timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 7rem;
}

/* Garis vertikal tengah */
.timeline::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border) 10%, var(--border) 90%, transparent);
    transform: translateX(-50%);
}

.timeline-item {
    display: grid;
    grid-template-columns: 1fr 80px 1fr;
    align-items: start;
    gap: 0;
    padding: 1.5rem 0;
}

/* Item kiri: year kiri, content kanan dari connector */
.timeline-item .timeline-year {
    text-align: right;
    padding-right: 2rem;
    padding-top: 0.15rem;
}

.timeline-item .timeline-content {
    padding-left: 2rem;
}

/* Item kanan: year kanan, content kiri dari connector */
.timeline-item--right .timeline-year {
    order: 3;
    text-align: left;
    padding-right: 0;
    padding-left: 2rem;
}

.timeline-item--right .timeline-connector {
    order: 2;
}

.timeline-item--right .timeline-content {
    order: 1;
    padding-left: 0;
    padding-right: 2rem;
    text-align: right;
}

.timeline-year {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.5rem;
    color: var(--cyan);
    line-height: 1;
}

.timeline-connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    position: relative;
    z-index: 1;
}

.timeline-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--midnight);
    border: 2px solid var(--cyan);
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.4);
    flex-shrink: 0;
    margin-top: 0.2rem;
    transition: all 0.3s;
}

.timeline-item:hover .timeline-dot {
    background: var(--cyan);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
    transform: scale(1.2);
}

.timeline-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
}

.timeline-desc {
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.65;
}

/* ── Team band ───────────────────────────────────────── */
.team-band {
    background: rgba(255, 255, 255, 0.015);
    border-top: 1px solid var(--border);
    padding: 5rem 0 7rem;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2.5rem;
}

.team-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem 1.5rem;
    text-align: center;
    transition: all 0.3s;
}

.team-card:hover {
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.team-photo-wrap {
    width: 88px;
    height: 88px;
    margin: 0 auto 1.25rem;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.team-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.team-avatar-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1.3rem;
    color: white;
}

.team-info-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: 1px solid var(--border);
    color: rgba(255, 255, 255, 0.85);
    font-family: var(--font-display);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.5rem 1.1rem;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.2s;
}

.team-info-btn:hover {
    border-color: var(--cyan);
    color: var(--cyan);
    background: rgba(0, 212, 255, 0.08);
}

.team-info-arrow {
    color: var(--gold);
    font-weight: 700;
}

/* ── Modal Profil Tim ──────────────────────────────────── */
.team-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5, 8, 15, 0.72);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    z-index: 200;
}

.team-modal {
    position: relative;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 2.75rem 2.25rem 2.25rem;
    max-width: 420px;
    width: 100%;
    text-align: center;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}

.team-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
}

.team-modal-close:hover {
    color: var(--white);
    border-color: rgba(255, 255, 255, 0.3);
}

.team-modal-photo-wrap {
    width: 96px;
    height: 96px;
    margin: 0 auto 1.5rem;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.team-modal-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.team-modal-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.15rem;
    margin-bottom: 0.35rem;
}

.team-modal-role {
    font-size: 0.8rem;
    color: var(--cyan);
    font-weight: 600;
    letter-spacing: 0.06em;
    margin-bottom: 1.25rem;
}

.team-modal-bio {
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.7;
    text-align: left;
}

.team-modal-fade-enter-active,
.team-modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.team-modal-fade-enter-from,
.team-modal-fade-leave-to {
    opacity: 0;
}

.team-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.25rem;
    letter-spacing: 0.075rem;
    margin-bottom: 0.3rem;
}

.team-role {
    font-size: 0.9rem;
    /* color: var(--cyan); */
    /* font-weight: 600; */
    margin-bottom: 0.875rem;
}

/* ── Hiring CTA ──────────────────────────────────────── */
.hiring-cta {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem 2rem;
    transition: border-color 0.3s;
}

.hiring-cta:hover {
    border-color: rgba(245, 166, 35, 0.3);
}

.hiring-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.hiring-text {
    flex: 1;
    font-size: 0.925rem;
    color: var(--muted);
    line-height: 1.5;
}

.hiring-text strong {
    color: var(--white);
    display: block;
    margin-bottom: 0.2rem;
}

.hiring-btn {
    flex-shrink: 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.875rem;
    padding: 0.6rem 1.25rem;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--gold), var(--gold-dim));
    color: var(--midnight);
    transition: all 0.2s;
    white-space: nowrap;
}

.hiring-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 24px rgba(245, 166, 35, 0.35);
}

/* gradient text helper (kalau belum global) */
.text-gradient-cyan {
    background: linear-gradient(135deg, var(--cyan) 0%, #7dd3fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 1024px) {
    .values-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .team-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .container {
        padding: 0 0.75rem;
    }

    .section-title {
        font-size: clamp(1.45rem, 3.5vw, 2.75rem);
    }

    .visi-misi-grid {
        grid-template-columns: 1fr;
    }

    .vm-divider {
        width: 100%;
        height: 1px;
        flex-direction: row;
        padding: 0 2rem;
    }

    .vm-divider-line {
        flex: 1;
        width: auto;
        height: 1px;
        background: linear-gradient(to right, transparent, var(--border), transparent);
    }

    .values-grid {
        grid-template-columns: 1fr;
    }

    .team-grid {
        grid-template-columns: 1fr;
    }

    /* Timeline mobile: single column */
    .timeline::before {
        left: 7.5px;
    }

    .timeline-item,
    .timeline-item--right {
        grid-template-columns: 40px 1fr;
        grid-template-rows: auto auto;
    }

    .timeline-item .timeline-year,
    .timeline-item--right .timeline-year {
        grid-column: 2;
        grid-row: 1;
        order: unset;
        text-align: left;
        padding: 0 0 0.25rem 1.5rem;
        font-size: 1.1rem;
    }

    .timeline-item .timeline-connector,
    .timeline-item--right .timeline-connector {
        grid-column: 1;
        grid-row: 1 / 3;
        order: unset;
        align-items: flex-start;
        padding-top: 0.2rem;
    }

    .timeline-item .timeline-content,
    .timeline-item--right .timeline-content {
        grid-column: 2;
        grid-row: 2;
        order: unset;
        padding: 0 0 0 1.5rem;
        text-align: left;
    }

    .hiring-cta {
        flex-direction: column;
        text-align: center;
    }

    .hiring-btn {
        width: 100%;
        text-align: center;
    }
}
</style>