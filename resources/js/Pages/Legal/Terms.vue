<script setup>
import { Head, Link } from '@inertiajs/vue3'
import HomeLayout from '@/Layouts/HomeLayout.vue'
import { ref } from 'vue'

const emailCopied = ref(false)

async function copyEmail() {
    try {
        await navigator.clipboard.writeText('info@lumiverse.co.id')
        emailCopied.value = true
        window.setTimeout(() => {
            emailCopied.value = false
        }, 2200)
    } catch {
        emailCopied.value = false
    }
}

const sections = [
    {
        id: 'agreement',
        title: 'Persetujuan Penggunaan',
        paragraphs: [
            'Dengan mengakses atau menggunakan Lumiverse, Anda menyatakan telah membaca dan menyetujui Syarat & Ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, jangan gunakan layanan Lumiverse.',
            'Apabila Anda menggunakan Lumiverse atas nama sekolah, pesantren, atau lembaga lain, Anda menyatakan memiliki kewenangan untuk mengikat lembaga tersebut pada ketentuan ini.',
        ],
    },
    {
        id: 'service',
        title: 'Layanan Lumiverse',
        paragraphs: [
            'Lumiverse menyediakan platform Learning Management System berbasis cloud untuk membantu lembaga mengelola kelas, materi, tugas, ujian, presensi, nilai, dan aktivitas pembelajaran secara digital.',
            'Fitur dan ketersediaan layanan dapat berbeda berdasarkan konfigurasi, paket, domain, atau peran pengguna. Kami dapat mengubah, menambah, membatasi, atau menghentikan fitur tertentu untuk pemeliharaan, keamanan, pengembangan, atau alasan operasional.',
        ],
    },
    {
        id: 'account',
        title: 'Akun dan Tanggung Jawab Pengguna',
        paragraphs: [
            'Anda wajib memberikan informasi yang benar, terbaru, dan tidak menyesatkan ketika mendaftarkan akun. Kredensial akun harus dijaga kerahasiaannya dan setiap aktivitas yang terjadi melalui akun menjadi tanggung jawab pemilik akun, kecuali dapat dibuktikan sebagai akibat kegagalan sistem kami.',
            'Anda wajib segera memberitahukan kepada Lumiverse apabila mengetahui adanya akses tidak sah, kehilangan kendali akun, atau dugaan penyalahgunaan. Kami dapat meminta verifikasi identitas dan menangguhkan akses apabila diperlukan untuk melindungi akun atau layanan.',
            'Pengguna lembaga wajib memastikan bahwa guru, siswa, staf, dan pihak lain yang diberi akses menggunakan layanan sesuai peran dan kewenangan mereka.',
        ],
    },
    {
        id: 'content',
        title: 'Konten dan Data Lembaga',
        paragraphs: [
            'Lembaga dan pengguna tetap bertanggung jawab atas konten, data peserta didik, materi, dokumen, soal, nilai, dan informasi lain yang dimasukkan ke dalam layanan. Anda wajib memiliki hak atau izin yang diperlukan untuk menyimpan dan membagikan konten tersebut.',
            'Anda tidak boleh mengunggah konten yang melanggar hukum, hak kekayaan intelektual, privasi, keamanan, atau hak pihak lain. Anda juga tidak boleh menggunakan layanan untuk menyebarkan malware, spam, penipuan, atau konten yang mengancam keselamatan pengguna.',
            'Anda memberikan izin terbatas kepada Lumiverse untuk memproses, menyimpan, menampilkan, dan mengirimkan konten sejauh diperlukan untuk menyediakan, mengamankan, dan memperbaiki layanan sesuai Kebijakan Privasi.',
        ],
    },
    {
        id: 'partner',
        title: 'Program Partner, Referral, dan Reward',
        paragraphs: [
            'Program partner memungkinkan partner menggunakan kode referral dan memperoleh reward berdasarkan ketentuan program yang berlaku. Perhitungan reward, status referral, dan saldo dapat dipengaruhi oleh validasi transaksi, pembatalan, pengembalian dana, atau aktivitas yang terindikasi tidak wajar.',
            'Partner dilarang memanipulasi referral, membuat akun palsu, melakukan spam, memberikan informasi yang menyesatkan, atau menggunakan cara lain untuk memperoleh reward secara tidak sah. Reward yang diperoleh secara tidak sah dapat dibatalkan atau dipotong dari saldo.',
            'Pencairan reward dilakukan ke rekening utama yang didaftarkan partner. Rekening baru dapat dikenai masa tunggu keamanan, dan Lumiverse dapat menunda atau menolak pencairan apabila data rekening tidak valid, transaksi gagal, saldo tidak mencukupi, atau terdapat pemeriksaan keamanan yang belum selesai.',
        ],
    },
    {
        id: 'security',
        title: 'PIN, Biometric, dan Keamanan Tindakan Sensitif',
        paragraphs: [
            'Lumiverse dapat meminta verifikasi PIN atau biometric sebelum tindakan sensitif seperti menambah atau menghapus rekening, mengubah rekening utama, atau melakukan pencairan. Pengguna bertanggung jawab menjaga perangkat, PIN, dan akses biometric pada perangkatnya.',
            'PIN harus dibuat dan digunakan oleh pemilik akun. Jangan membagikan PIN, kode keamanan, password, atau perangkat kepada pihak lain. Lumiverse tidak meminta PIN melalui email, pesan, atau saluran dukungan yang tidak resmi.',
            'Fitur biometric menggunakan kemampuan keamanan perangkat untuk verifikasi. Lumiverse tidak menerima atau menyimpan data biometric mentah. Kami dapat menolak tindakan atau mencabut akses perangkat apabila terdapat indikasi kompromi atau penyalahgunaan.',
        ],
    },
    {
        id: 'payments',
        title: 'Pembayaran dan Penyedia Pihak Ketiga',
        paragraphs: [
            'Beberapa layanan atau transaksi dapat melibatkan penyedia pihak ketiga. Layanan masuk dan pencairan tunduk pada ketentuan serta kebijakan penyedia tersebut, selain ketentuan Lumiverse yang berlaku.',
            'Lumiverse tidak bertanggung jawab atas gangguan, keterlambatan, kebijakan, biaya, atau keputusan yang sepenuhnya berada di luar kendali penyedia pihak ketiga. Kami akan berusaha membantu meneruskan laporan yang relevan sesuai kemampuan operasional kami.',
        ],
    },
    {
        id: 'prohibited',
        title: 'Penggunaan yang Dilarang',
        paragraphs: [
            'Anda dilarang mencoba memperoleh akses tanpa izin, memindai atau menguji kerentanan tanpa persetujuan, mengganggu infrastruktur, mengakali pembatasan teknis, mengekstrak data secara otomatis secara berlebihan, merekayasa transaksi, atau mengganggu penggunaan layanan oleh pihak lain.',
            'Anda juga dilarang menggunakan Lumiverse untuk aktivitas ilegal, penipuan, pelanggaran hak cipta, pelecehan, penyebaran malware, phishing, atau tindakan yang dapat merugikan Lumiverse, lembaga, peserta didik, maupun pihak lain.',
        ],
    },
    {
        id: 'availability',
        title: 'Ketersediaan dan Penangguhan',
        paragraphs: [
            'Kami berupaya menjaga layanan tetap tersedia, tetapi tidak menjamin layanan selalu bebas gangguan, kesalahan, atau kehilangan konektivitas. Pemeliharaan, pembaruan, gangguan jaringan, dan kejadian di luar kendali kami dapat memengaruhi ketersediaan layanan.',
            'Kami dapat membatasi, menangguhkan, atau menghentikan akun atau fitur apabila pengguna melanggar ketentuan, menimbulkan risiko keamanan, memiliki kewajiban yang belum diselesaikan, atau apabila tindakan tersebut diperlukan untuk mematuhi hukum. Jika memungkinkan, kami akan memberikan pemberitahuan dan kesempatan untuk menyelesaikan masalah.',
        ],
    },
    {
        id: 'intellectual',
        title: 'Kekayaan Intelektual',
        paragraphs: [
            'Nama, merek, tampilan, perangkat lunak, desain, dokumentasi, dan komponen layanan Lumiverse merupakan milik Lumiverse atau pemberi lisensinya. Ketentuan ini tidak memberikan hak untuk menyalin, menjual, memodifikasi, atau mendistribusikan bagian layanan kecuali dengan izin tertulis atau berdasarkan hukum yang berlaku.',
            'Hak atas konten yang Anda masukkan tetap berada pada Anda atau pemiliknya. Anda bertanggung jawab menyelesaikan klaim pihak ketiga terkait konten tersebut.',
        ],
    },
    {
        id: 'liability',
        title: 'Batasan Tanggung Jawab',
        paragraphs: [
            'Sejauh diizinkan oleh hukum, Lumiverse tidak bertanggung jawab atas kerugian tidak langsung, kehilangan peluang, kehilangan data akibat kelalaian pengguna, gangguan pihak ketiga, atau penggunaan layanan yang tidak sesuai ketentuan.',
            'Ketentuan ini tidak membatasi tanggung jawab yang tidak dapat dikecualikan menurut hukum yang berlaku. Anda tetap bertanggung jawab atas tindakan, konten, akun, dan kewajiban yang timbul dari penggunaan layanan.',
        ],
    },
    {
        id: 'changes',
        title: 'Perubahan Ketentuan',
        paragraphs: [
            'Kami dapat memperbarui Syarat & Ketentuan ini untuk mencerminkan perubahan layanan, hukum, atau operasional. Versi terbaru akan dipublikasikan pada halaman ini beserta tanggal pembaruan. Dengan tetap menggunakan layanan setelah perubahan berlaku, Anda menyetujui ketentuan yang diperbarui.',
        ],
    },
]
</script>

<template>

    <Head>
        <title>Syarat & Ketentuan | Lumiverse</title>
        <meta head-key="description" name="description"
            content="Syarat dan Ketentuan penggunaan Lumiverse School dan program partner Lumiverse." />
        <link head-key="canonical" rel="canonical" href="https://lumiverse.co.id/syarat" />
    </Head>

    <section class="terms-page">
        <div class="terms-shell">
            <div class="terms-intro">
                <Link href="/" class="back-link" prefetch="hover">Kembali ke Lumiverse</Link>
                <p class="eyebrow">LEGAL & LAYANAN</p>
                <h1>Syarat & Ketentuan</h1>
                <p class="intro-copy">
                    Ketentuan ini mengatur akses dan penggunaan Lumiverse School, layanan lembaga pendidikan, serta
                    program partner Lumiverse.
                </p>
                <p class="updated">Terakhir diperbarui: 31 Juli 2026</p>
            </div>

            <div class="terms-layout">
                <aside class="terms-nav" aria-label="Daftar isi syarat dan ketentuan">
                    <p class="nav-title">Di halaman ini</p>
                    <a v-for="section in sections" :key="section.id" :href="`#${section.id}`">
                        {{ section.title }}
                    </a>
                    <a href="#contact">Kontak</a>
                </aside>

                <article class="terms-content">
                    <section v-for="(section, index) in sections" :id="section.id" :key="section.id"
                        class="terms-section">
                        <p class="section-number">{{ String(index + 1).padStart(2, '0') }}</p>
                        <h2>{{ section.title }}</h2>
                        <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
                    </section>

                    <section id="contact" class="terms-section contact-section">
                        <p class="section-number">13</p>
                        <h2>Kontak</h2>
                        <p>
                            Pertanyaan mengenai Syarat & Ketentuan atau laporan pelanggaran dapat disampaikan kepada PT
                            Lumi Platforms Indonesia melalui:
                        </p>
                        <div class="contact-actions">
                            <a class="contact-link" href="mailto:info@lumiverse.co.id" @click="copyEmail">
                                info@lumiverse.co.id
                            </a>
                            <button type="button" class="copy-button" @click="copyEmail">
                                {{ emailCopied ? 'Tersalin' : 'Salin email' }}
                            </button>
                        </div>
                    </section>
                </article>
            </div>
        </div>
    </section>
</template>

<style scoped>
.terms-page {
    min-height: 100%;
    padding: 8.5rem 1.5rem 7rem;
    color: var(--white);
    background:
        radial-gradient(circle at 8% 4%, rgba(52, 211, 153, 0.12), transparent 32rem),
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 24rem),
        var(--midnight);
}

.terms-shell {
    width: min(100%, 1380px);
    margin: 0 auto;
}

.terms-intro {
    max-width: 900px;
    padding-bottom: 5.5rem;
}

.back-link {
    display: inline-flex;
    margin-bottom: 3rem;
    color: var(--cyan);
    font-size: 0.8rem;
    text-decoration: none;
}

.back-link:hover,
.contact-link:hover {
    text-decoration: underline;
}

.eyebrow {
    margin: 0 0 0.75rem;
    color: #34d399;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
}

h1,
h2 {
    font-family: var(--font-display);
}

h1 {
    max-width: none;
    margin: 0;
    font-size: clamp(2.4rem, 7vw, 5.2rem);
    line-height: 0.98;
    letter-spacing: -0.03em;
    white-space: nowrap;
}

.intro-copy {
    max-width: 760px;
    margin: 1.5rem 0 0;
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.8;
}

.updated {
    margin: 1.25rem 0 0;
    color: var(--muted);
    font-size: 0.76rem;
}

.terms-layout {
    display: grid;
    grid-template-columns: 240px minmax(0, 860px);
    gap: clamp(3rem, 8vw, 8rem);
    align-items: start;
}

.terms-nav {
    position: sticky;
    top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding-left: 1rem;
    border-left: 1px solid var(--border);
}

.nav-title {
    margin: 0 0 0.35rem;
    color: var(--white);
    font-size: 0.8rem;
    font-weight: 700;
}

.terms-nav a {
    color: var(--muted);
    font-size: 0.82rem;
    font-weight: 500;
    line-height: 1.4;
    text-decoration: none;
    transition: color 0.2s ease, transform 0.2s ease;
}

.terms-nav a:hover,
.terms-nav a:focus-visible {
    color: #34d399;
    outline: none;
    transform: translateX(4px);
}

.terms-content {
    min-width: 0;
}

.terms-section {
    scroll-margin-top: 2rem;
    padding: 0 0 4.5rem;
    margin-bottom: 4.5rem;
    border-bottom: 1px solid var(--border);
}

.section-number {
    margin: 0 0 0.65rem;
    color: #34d399;
    font-family: var(--font-mono);
    font-size: 0.75rem;
}

h2 {
    margin: 0 0 1.35rem;
    font-size: clamp(1.55rem, 2.2vw, 2rem);
    line-height: 1.2;
}

.terms-section p:not(.section-number) {
    max-width: 780px;
    margin: 0 0 1.15rem;
    color: var(--muted);
    font-size: 0.98rem;
    line-height: 1.9;
}

.terms-section p:last-of-type {
    margin-bottom: 0;
}

.contact-section {
    margin-bottom: 0;
    border-bottom: 0;
}

.contact-link {
    display: inline-block;
    color: var(--cyan);
    font-size: 1rem;
    font-weight: 700;
}

.contact-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

.copy-button {
    padding: 0.45rem 0.7rem;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.03);
    color: var(--muted);
    font-size: 0.74rem;
    font-weight: 700;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.copy-button:hover,
.copy-button:focus-visible {
    border-color: var(--cyan);
    background: rgba(0, 212, 255, 0.08);
    color: var(--cyan);
    outline: none;
}

@media (max-width: 760px) {
    .terms-page {
        padding-top: 7rem;
    }

    h1 {
        white-space: normal;
    }

    .terms-layout {
        display: block;
    }

    .terms-nav {
        position: static;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-bottom: 3.5rem;
        padding: 0 0 0 1rem;
    }

    .nav-title {
        grid-column: 1 / -1;
    }
}
</style>
