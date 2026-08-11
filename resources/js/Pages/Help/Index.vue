<script setup>
import { Head, Link } from '@inertiajs/vue3'
import HomeLayout from '@/Layouts/HomeLayout.vue'
import { computed, ref } from 'vue'

const search = ref('')
const activeCategory = ref('Semua')
const openQuestion = ref(null)
const copiedEmail = ref('')

const categories = ['Semua', 'Memulai', 'Pembelajaran', 'Akun & Keamanan', 'Partner']

const contactEmails = [
    { label: 'Dukungan umum', email: 'support@lumiverse.co.id' },
    { label: 'Legal & privasi', email: 'legal@lumiverse.co.id' },
    { label: 'Program partner', email: 'partner@lumiverse.co.id' },
    { label: 'Penjualan', email: 'sales@lumiverse.co.id' },
    { label: 'Pembayaran', email: 'Billing@lumiverse.co.id' },
    { label: 'Karir', email: 'recruitment@lumiverse.co.id' },
]

const articles = [
    {
        category: 'Memulai',
        title: 'Mulai menggunakan Lumiverse School',
        description: 'Daftarkan lembaga, aktifkan ruang kerja, lalu mulai kelola pembelajaran dari satu tempat.',
        href: '#getting-started',
        number: '01',
    },
    {
        category: 'Pembelajaran',
        title: 'Kelola kelas, tugas, dan ujian',
        description: 'Panduan ringkas untuk mengatur kelas, materi, presensi, tugas, ujian, dan nilai.',
        href: '#learning',
        number: '02',
    },
    {
        category: 'Akun & Keamanan',
        title: 'Jaga akun tetap aman',
        description: 'Pahami peran pengguna, akses akun, verifikasi, serta perlindungan tindakan penting.',
        href: '#security',
        number: '03',
    },
    {
        category: 'Partner',
        title: 'Referral, reward, dan pencairan',
        description: 'Temukan informasi tentang kode referral, saldo reward, rekening bank, dan payout.',
        href: '#partner',
        number: '04',
    },
]

const faqs = [
    {
        category: 'Memulai',
        question: 'Apa itu Lumiverse School?',
        answer: 'Lumiverse School adalah platform pembelajaran berbasis cloud untuk membantu sekolah dan lembaga pendidikan mengelola kelas, materi, tugas, ujian, presensi, nilai, dan komunikasi pembelajaran secara digital.',
    },
    {
        category: 'Memulai',
        question: 'Berapa lama proses pendaftaran hingga bisa digunakan?',
        answer: 'Setelah pendaftaran lembaga selesai, ruang kerja dapat digunakan secara otomatis. Anda dapat mulai mengatur pengguna dan pembelajaran tanpa menunggu proses aktivasi manual.',
    },
    {
        category: 'Pembelajaran',
        question: 'Fitur pembelajaran apa saja yang tersedia?',
        answer: 'Fitur utama mencakup pengelolaan kelas, materi atau modul, tugas, ujian online, presensi, rekap kehadiran, analitik, dan rekap nilai.',
    },
    {
        category: 'Pembelajaran',
        question: 'Apakah platform dapat digunakan untuk ujian serentak?',
        answer: 'Lumiverse dirancang untuk mendukung aktivitas pembelajaran dan ujian online dengan akses pengguna dalam jumlah besar. Untuk ujian penting, siapkan jadwal, perangkat, koneksi, dan akun pengguna terlebih dahulu.',
    },
    {
        category: 'Akun & Keamanan',
        question: 'Bagaimana jika saya lupa password?',
        answer: 'Gunakan alur pemulihan akun pada halaman masuk. Jika tetap mengalami kendala, hubungi tim bantuan dengan menyertakan alamat email akun dan nama lembaga untuk membantu proses verifikasi.',
    },
    {
        category: 'Akun & Keamanan',
        question: 'Bagaimana data sekolah dan pengguna dilindungi?',
        answer: 'Akses dibatasi berdasarkan peran dan lingkungan data lembaga dipisahkan dari lembaga lain. Pengguna juga bertanggung jawab menjaga password, perangkat, dan informasi verifikasi mereka.',
    },
    {
        category: 'Partner',
        question: 'Bagaimana cara kerja program partner?',
        answer: 'Partner memperoleh kode referral yang dapat digunakan untuk mengarahkan lembaga baru. Reward mengikuti ketentuan program dan dapat dipengaruhi oleh validasi referral, pembatalan, atau aktivitas yang tidak wajar.',
    },
    {
        category: 'Partner',
        question: 'Mengapa pencairan reward belum bisa dilakukan?',
        answer: 'Pastikan saldo memenuhi minimum pencairan, rekening utama sudah terdaftar, dan masa tunggu keamanan rekening telah selesai. Pencairan juga dapat tertunda jika data rekening atau transaksi perlu diperiksa.',
    },
]

const filteredFaqs = computed(() => {
    const query = search.value.trim().toLowerCase()

    return faqs.filter((faq) => {
        const matchesCategory = activeCategory.value === 'Semua' || faq.category === activeCategory.value
        const matchesSearch = !query || `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase().includes(query)
        return matchesCategory && matchesSearch
    })
})

function toggleQuestion(index) {
    openQuestion.value = openQuestion.value === index ? null : index
}

async function copyEmail(email) {
    try {
        await navigator.clipboard.writeText(email)
        copiedEmail.value = email
        window.setTimeout(() => {
            if (copiedEmail.value === email) copiedEmail.value = ''
        }, 2200)
    } catch {
        copiedEmail.value = ''
    }
}
</script>

<template>

    <Head>
        <title>Help Center | Lumiverse</title>
        <meta head-key="description" name="description"
            content="Pusat bantuan Lumiverse School dan program partner Lumiverse." />
        <link head-key="canonical" rel="canonical" href="https://lumiverse.co.id/help" />
    </Head>

    <section class="help-page">
        <div class="help-shell">
            <header class="help-hero">
                <Link href="/" class="back-link">Kembali ke Lumiverse</Link>
                <div class="hero-grid">
                    <div>
                        <p class="eyebrow">PUSAT BANTUAN</p>
                        <h1><span class="hero-line">Temukan jawaban.</span><br><span>Atasi kendala.</span></h1>
                        <p class="hero-copy">
                            Panduan singkat untuk membantu Anda mulai menggunakan Lumiverse, mengelola pembelajaran,
                            dan menjaga akun tetap aman.
                        </p>
                    </div>
                    <div class="hero-orbit" aria-hidden="true">
                        <span class="orbit-ring ring-one"></span>
                        <span class="orbit-ring ring-two"></span>
                        <span class="orbit-core">?</span>
                    </div>
                </div>

                <label class="search-box">
                    <span class="search-icon" aria-hidden="true">/</span>
                    <input v-model="search" type="search" placeholder="Cari pertanyaan atau topik..." />
                    <span class="search-hint">{{ filteredFaqs.length }} hasil</span>
                </label>
            </header>

            <section class="article-section" aria-labelledby="quick-start-title">
                <div class="section-heading">
                    <div>
                        <p class="eyebrow">JALUR CEPAT</p>
                        <h2 id="quick-start-title">Mulai dari sini</h2>
                    </div>
                    <p>Topik paling penting untuk langkah pertama Anda.</p>
                </div>
                <div class="article-grid">
                    <a v-for="article in articles" :key="article.title" :href="article.href" class="article-card">
                        <span class="article-number">{{ article.number }}</span>
                        <span class="article-category">{{ article.category }}</span>
                        <strong>{{ article.title }}</strong>
                        <span class="article-description">{{ article.description }}</span>
                        <span class="article-arrow" aria-hidden="true">&#8599;</span>
                    </a>
                </div>
            </section>

            <section id="getting-started" class="guide-section guide-start">
                <div class="guide-label">01 / MEMULAI</div>
                <div>
                    <h2>Siapkan ruang belajar Anda</h2>
                    <p>Daftarkan lembaga, lengkapi profil, undang pengguna sesuai peran, lalu atur kelas dan tahun
                        ajaran. Setelah struktur awal siap, guru dapat mulai menambahkan materi dan aktivitas
                        pembelajaran.</p>
                </div>
            </section>

            <section id="learning" class="guide-section guide-learning">
                <div class="guide-label">02 / PEMBELAJARAN</div>
                <div>
                    <h2>Kelola pembelajaran dalam satu alur</h2>
                    <p>Buat kelas, bagikan materi, atur tugas atau ujian, dan pantau presensi serta nilai. Untuk
                        kegiatan serentak, komunikasikan jadwal dan pastikan pengguna memiliki akses sebelum kegiatan
                        dimulai.</p>
                </div>
            </section>

            <section id="security" class="guide-section guide-security">
                <div class="guide-label">03 / KEAMANAN</div>
                <div>
                    <h2>Berikan akses sesuai kebutuhan</h2>
                    <p>Gunakan peran pengguna dengan tepat, jangan membagikan password, dan segera laporkan akses yang
                        mencurigakan. Tindakan penting pada area partner dapat memerlukan PIN atau verifikasi perangkat.
                    </p>
                </div>
            </section>

            <section id="partner" class="guide-section guide-partner">
                <div class="guide-label">04 / PARTNER</div>
                <div>
                    <h2>Kelola reward dengan aman</h2>
                    <p>Gunakan kode referral secara wajar, periksa saldo reward, daftarkan rekening utama yang benar,
                        dan perhatikan masa tunggu keamanan sebelum mengajukan pencairan.</p>
                </div>
            </section>

            <section class="faq-section" aria-labelledby="faq-title">
                <div class="section-heading faq-heading">
                    <div>
                        <p class="eyebrow">PERTANYAAN UMUM</p>
                        <h2 id="faq-title">Jawaban yang sering dicari</h2>
                    </div>
                    <div class="category-tabs" role="tablist" aria-label="Kategori bantuan">
                        <button v-for="category in categories" :key="category" type="button"
                            :class="{ active: activeCategory === category }" @click="activeCategory = category">
                            {{ category }}
                        </button>
                    </div>
                </div>

                <div v-if="filteredFaqs.length" class="faq-list">
                    <article v-for="(faq, index) in filteredFaqs" :key="faq.question" class="faq-item"
                        :class="{ open: openQuestion === index }">
                        <button type="button" class="faq-question" :aria-expanded="openQuestion === index"
                            @click="toggleQuestion(index)">
                            <span class="faq-category">{{ faq.category }}</span>
                            <span>{{ faq.question }}</span>
                            <span class="faq-plus" aria-hidden="true">+</span>
                        </button>
                        <div v-if="openQuestion === index" class="faq-answer">
                            <p>{{ faq.answer }}</p>
                        </div>
                    </article>
                </div>
                <div v-else class="empty-search">Tidak ada jawaban yang cocok. Coba kata kunci lain atau hubungi kami.
                </div>
            </section>

            <section class="support-section">
                <div>
                    <p class="eyebrow">MASIH MEMBUTUHKAN BANTUAN?</p>
                    <h2>Tim kami siap membantu.</h2>
                    <p>Pilih alamat yang sesuai agar pertanyaan Anda sampai ke tim yang tepat.</p>
                </div>
                <div class="contact-list">
                    <div v-for="contact in contactEmails" :key="contact.email" class="contact-row">
                        <div>
                            <span class="contact-label">{{ contact.label }}</span>
                            <a :href="`mailto:${contact.email}`" class="contact-email">{{ contact.email }}</a>
                        </div>
                        <div class="contact-actions">
                            <a :href="`mailto:${contact.email}`" class="support-button">Kirim Email</a>
                            <button type="button" class="copy-button" @click="copyEmail(contact.email)">
                                {{ copiedEmail === contact.email ? 'Tersalin' : 'Salin' }}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>
</template>

<style scoped>
.help-page {
    min-height: 100%;
    padding: 7rem 1.5rem 6rem;
    color: var(--white);
    background:
        radial-gradient(circle at 88% 2%, rgba(0, 212, 255, 0.14), transparent 30rem),
        radial-gradient(circle at 4% 42%, rgba(52, 211, 153, 0.07), transparent 24rem),
        var(--midnight);
}

.help-shell {
    width: min(100%, 1380px);
    margin: 0 auto;
}

.help-hero {
    padding-bottom: 6rem;
}

.back-link {
    display: inline-block;
    margin-bottom: 4rem;
    color: var(--cyan);
    font-size: 0.82rem;
    text-decoration: none;
}

.back-link:hover {
    text-decoration: underline;
}

.hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 3rem;
    align-items: center;
}

.eyebrow {
    margin: 0 0 0.7rem;
    color: var(--cyan);
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.16em;
}

h1,
h2 {
    font-family: var(--font-display);
}

h1 {
    max-width: 800px;
    margin: 0;
    font-size: clamp(2.8rem, 7vw, 6.8rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
}

h1 span {
    color: var(--cyan);
}

h1 .hero-line {
    color: var(--white);
    white-space: nowrap;
}

.hero-copy {
    max-width: 600px;
    margin: 1.5rem 0 0;
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.8;
}

.hero-orbit {
    position: relative;
    width: 220px;
    height: 220px;
    justify-self: end;
}

.orbit-ring {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 50%;
    transform: rotate(-24deg) scaleX(0.46);
}

.ring-two {
    transform: rotate(66deg) scaleX(0.46);
    border-color: rgba(52, 211, 153, 0.35);
}

.orbit-core {
    position: absolute;
    inset: 72px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(0, 212, 255, 0.35);
    border-radius: 50%;
    background: rgba(0, 212, 255, 0.08);
    color: var(--cyan);
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 800;
    box-shadow: 0 0 60px rgba(0, 212, 255, 0.16);
}

.search-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 780px;
    margin-top: 3.5rem;
    padding: 0.9rem 1rem;
    border: 1px solid rgba(0, 212, 255, 0.25);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.045);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
}

.search-box:focus-within {
    border-color: var(--cyan);
    box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.08);
}

.search-icon {
    color: var(--cyan);
    font-family: var(--font-mono);
    font-size: 1.2rem;
    transform: rotate(-45deg);
}

.search-box input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--white);
    font-size: 0.92rem;
}

.search-box input::placeholder {
    color: var(--muted);
}

.search-hint {
    color: var(--muted);
    font-size: 0.72rem;
    white-space: nowrap;
}

.article-section,
.faq-section {
    padding: 4rem 0 5rem;
    border-top: 1px solid var(--border);
}

.section-heading {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: end;
    margin-bottom: 2rem;
}

.section-heading h2,
.support-section h2 {
    margin: 0;
    font-size: clamp(1.8rem, 3vw, 3rem);
    line-height: 1.05;
}

.section-heading>p {
    max-width: 270px;
    margin: 0;
    color: var(--muted);
    font-size: 0.84rem;
    line-height: 1.6;
}

.article-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
}

.article-card {
    position: relative;
    display: flex;
    min-height: 250px;
    flex-direction: column;
    padding: 1.35rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.025);
    color: var(--white);
    text-decoration: none;
    overflow: hidden;
    transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
}

.article-card::after {
    position: absolute;
    right: -2rem;
    bottom: -3rem;
    width: 8rem;
    height: 8rem;
    border: 1px solid rgba(0, 212, 255, 0.16);
    border-radius: 50%;
    content: '';
}

.article-card:hover {
    border-color: rgba(0, 212, 255, 0.55);
    background: rgba(0, 212, 255, 0.055);
    transform: translateY(-4px);
}

.article-number {
    color: var(--cyan);
    font-family: var(--font-mono);
    font-size: 0.72rem;
}

.article-category {
    margin-top: 2.5rem;
    color: var(--muted);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.article-card strong {
    max-width: 210px;
    margin-top: 0.55rem;
    font-family: var(--font-display);
    font-size: 1.08rem;
    line-height: 1.2;
}

.article-description {
    margin-top: 0.65rem;
    color: var(--muted);
    font-size: 0.78rem;
    line-height: 1.55;
}

.article-arrow {
    position: absolute;
    right: 1.3rem;
    bottom: 1.15rem;
    color: var(--cyan);
    font-size: 1.25rem;
}

.guide-section {
    display: grid;
    grid-template-columns: 240px minmax(0, 780px);
    gap: clamp(2rem, 8vw, 8rem);
    padding: 4.5rem 0;
    border-top: 1px solid var(--border);
}

.guide-label {
    color: var(--cyan);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 600;
}

.guide-learning .guide-label,
.guide-partner .guide-label {
    color: #34d399;
}

.guide-section h2 {
    margin: 0 0 1rem;
    font-size: clamp(1.6rem, 3vw, 2.8rem);
    line-height: 1.08;
}

.guide-section p {
    max-width: 720px;
    margin: 0;
    color: var(--muted);
    font-size: 0.98rem;
    line-height: 1.9;
}

.faq-heading {
    align-items: start;
}

.category-tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.4rem;
    max-width: 620px;
}

.category-tabs button {
    padding: 0.45rem 0.7rem;
    border: 1px solid var(--border);
    border-radius: 100px;
    background: transparent;
    color: var(--muted);
    font-size: 0.74rem;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.category-tabs button:hover,
.category-tabs button.active {
    border-color: var(--cyan);
    background: rgba(0, 212, 255, 0.09);
    color: var(--cyan);
}

.faq-list {
    border-top: 1px solid var(--border);
}

.faq-item {
    border-bottom: 1px solid var(--border);
}

.faq-question {
    display: grid;
    grid-template-columns: 145px minmax(0, 1fr) 24px;
    gap: 1rem;
    align-items: center;
    width: 100%;
    padding: 1.2rem 0;
    border: 0;
    background: transparent;
    color: var(--white);
    text-align: left;
    font-size: 0.94rem;
    cursor: pointer;
}

.faq-question:hover {
    color: var(--cyan);
}

.faq-category {
    color: var(--muted);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.faq-plus {
    color: var(--cyan);
    font-size: 1.4rem;
    font-weight: 300;
    transition: transform 0.2s ease;
}

.faq-item.open .faq-plus {
    transform: rotate(45deg);
}

.faq-answer {
    padding: 0 3rem 1.35rem 145px;
}

.faq-answer p,
.empty-search {
    margin: 0;
    color: var(--muted);
    font-size: 0.88rem;
    line-height: 1.8;
}

.empty-search {
    padding: 2rem 0;
    border-top: 1px solid var(--border);
}

.support-section {
    display: grid;
    grid-template-columns: minmax(240px, 0.75fr) minmax(0, 1.25fr);
    gap: 2rem;
    margin-top: 4rem;
    padding: 2.5rem;
    border: 1px solid rgba(0, 212, 255, 0.22);
    border-radius: 16px;
    background: linear-gradient(120deg, rgba(0, 212, 255, 0.09), rgba(52, 211, 153, 0.05));
}

.support-section h2 {
    margin-bottom: 0.65rem;
}

.support-section p:last-child {
    max-width: 540px;
    margin: 0;
    color: var(--muted);
    font-size: 0.88rem;
    line-height: 1.7;
}

.contact-list {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.contact-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-row:last-child {
    border-bottom: 0;
}

.contact-label {
    display: block;
    margin-bottom: 0.2rem;
    color: var(--muted);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.contact-email {
    color: var(--white);
    font-size: 0.84rem;
    text-decoration: none;
}

.contact-email:hover {
    color: var(--cyan);
}

.contact-actions {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    flex-shrink: 0;
}

.support-button {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    background: var(--cyan);
    color: var(--midnight);
    font-size: 0.82rem;
    font-weight: 600;
    text-decoration: none;
}

.support-button:hover {
    opacity: 0.88;
}

.copy-button {
    padding: 0.68rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--muted);
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
}

.copy-button:hover,
.copy-button:focus-visible {
    border-color: var(--cyan);
    color: var(--cyan);
    outline: none;
}

@media (max-width: 900px) {
    .hero-orbit {
        width: 170px;
        height: 170px;
    }

    .orbit-core {
        inset: 55px;
    }

    .article-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .guide-section {
        grid-template-columns: 150px minmax(0, 1fr);
        gap: 2rem;
    }
}

@media (max-width: 640px) {
    .help-page {
        padding: 3rem 1rem 4rem;
    }

    .help-hero {
        padding-bottom: 4rem;
    }

    .back-link {
        display: none;
        /* margin-bottom: 2.5rem; */
    }

    .hero-grid,
    .section-heading,
    .support-section {
        display: block;
    }

    h1 .hero-line {
        white-space: normal;
    }

    .hero-orbit {
        display: none;
    }

    .search-box {
        margin-top: 2.5rem;
    }

    .section-heading>p {
        margin-top: 0.8rem;
    }

    .article-grid {
        grid-template-columns: 1fr;
    }

    .article-card {
        min-height: 210px;
    }

    .guide-section {
        display: block;
    }

    .guide-label {
        margin-bottom: 1.4rem;
    }

    .category-tabs {
        justify-content: flex-start;
        margin-top: 1.25rem;
    }

    .faq-question {
        grid-template-columns: minmax(0, 1fr) 24px;
        gap: 0.75rem;
    }

    .faq-category {
        grid-column: 1 / -1;
    }

    .faq-answer {
        padding: 0 1.5rem 1.25rem 0;
    }

    .support-section {
        padding: 1.5rem;
    }

    .contact-row {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.75rem;
    }

    .contact-actions,
    .support-button {
        margin-top: 1.5rem;
    }
}
</style>
