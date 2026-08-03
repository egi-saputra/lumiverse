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
        id: 'data',
        title: 'Data yang Kami Kumpulkan',
        paragraphs: [
            'Kami mengumpulkan data yang Anda berikan saat membuat akun atau menggunakan layanan, seperti nama, alamat email, nomor telepon, nama lembaga, serta informasi akun dan profil.',
            'Saat Anda menggunakan fitur LMS, data yang tersimpan dapat mencakup data kelas, materi, tugas, ujian, presensi, nilai, dan aktivitas pembelajaran yang dibuat atau dikelola oleh lembaga Anda.',
            'Untuk program partner, kami dapat memproses kode referral, riwayat referral, saldo reward, riwayat pencairan, dan informasi rekening bank yang Anda daftarkan. Nomor rekening digunakan untuk tujuan pencairan dan tidak digunakan untuk tujuan lain yang tidak dijelaskan dalam kebijakan ini.',
            'Untuk keamanan, sistem dapat menyimpan informasi perangkat, waktu penggunaan, serta data yang diperlukan untuk verifikasi PIN atau biometric dalam bentuk terlindungi. Kami tidak menyimpan data biometric mentah seperti sidik jari atau wajah.',
        ],
    },
    {
        id: 'use',
        title: 'Cara Kami Menggunakan Data',
        paragraphs: [
            'Data digunakan untuk menyediakan, mengoperasikan, memelihara, dan meningkatkan layanan Lumiverse, termasuk autentikasi, pengelolaan lembaga, pembelajaran, referral, pencairan reward, dukungan pelanggan, dan pengiriman pemberitahuan layanan.',
            'Kami juga menggunakan data untuk mendeteksi penyalahgunaan, mencegah akses tidak sah, melindungi akun, menerapkan masa tunggu keamanan rekening bank, serta memenuhi kewajiban hukum dan administrasi yang berlaku.',
        ],
    },
    {
        id: 'sharing',
        title: 'Pembagian Data kepada Pihak Ketiga',
        paragraphs: [
            'Kami tidak menjual data pribadi Anda. Data hanya dibagikan sejauh diperlukan untuk menjalankan layanan, memenuhi kewajiban hukum, atau melindungi keamanan pengguna dan platform.',
            'Jika Anda menggunakan layanan masuk pihak ketiga, sebagian data akun diproses sesuai izin yang Anda berikan dan kebijakan privasi penyedia tersebut. Untuk pencairan reward, informasi rekening dan detail transaksi dapat dikirim kepada penyedia pembayaran agar pencairan dapat diproses dan diverifikasi.',
            'Penyedia layanan tersebut bertanggung jawab atas pemrosesan pada sistem mereka sendiri sesuai kebijakan privasi dan ketentuan layanan masing-masing. Kami dapat menggunakan penyedia hosting, penyimpanan, email, analitik, atau dukungan teknis yang membantu operasional Lumiverse dengan kewajiban menjaga kerahasiaan data.',
        ],
    },
    {
        id: 'security',
        title: 'Keamanan dan Penyimpanan',
        paragraphs: [
            'Kami menerapkan langkah teknis dan organisatoris yang wajar untuk melindungi data, termasuk autentikasi, pembatasan akses, perlindungan password dan PIN, konfirmasi keamanan untuk tindakan sensitif, serta masa berlaku konfirmasi yang terbatas.',
            'Data disimpan selama diperlukan untuk tujuan pengumpulan, penyediaan layanan, penyelesaian sengketa, audit, keamanan, dan pemenuhan kewajiban hukum. Masa penyimpanan dapat berbeda sesuai jenis data dan hubungan Anda dengan lembaga atau Lumiverse.',
            'Tidak ada metode transmisi atau penyimpanan yang sepenuhnya bebas risiko. Apabila terjadi insiden yang berdampak pada data pribadi, kami akan mengambil langkah penanganan dan pemberitahuan sesuai kewajiban yang berlaku.',
        ],
    },
    {
        id: 'rights',
        title: 'Hak Anda',
        paragraphs: [
            'Sejauh diizinkan oleh hukum, Anda dapat meminta akses, koreksi, pembaruan, atau penghapusan data pribadi Anda, serta meminta informasi mengenai cara data diproses. Permintaan dapat dibatasi apabila data diperlukan untuk keamanan, kewajiban hukum, atau penyelesaian transaksi yang masih berjalan.',
            'Untuk data pembelajaran atau data yang dikelola oleh sekolah/lembaga, sebagian permintaan perlu diajukan kepada lembaga yang menjadi pengelola akun tersebut. Kami dapat meminta verifikasi identitas sebelum memproses permintaan.',
        ],
    },
    {
        id: 'cookies',
        title: 'Cookie dan Teknologi Serupa',
        paragraphs: [
            'Lumiverse dapat menggunakan cookie atau penyimpanan lokal untuk menjaga sesi login, mengingat preferensi, mendukung keamanan, dan memahami penggunaan layanan. Cookie yang diperlukan untuk fungsi utama mungkin tidak dapat dinonaktifkan tanpa memengaruhi layanan.',
            'Anda dapat mengatur cookie melalui browser. Menonaktifkan cookie tertentu dapat menyebabkan login atau sebagian fitur tidak berfungsi sebagaimana mestinya.',
        ],
    },
    {
        id: 'children',
        title: 'Pengguna Anak dan Data Pembelajaran',
        paragraphs: [
            'Lumiverse digunakan oleh sekolah dan lembaga pendidikan yang dapat mengelola data peserta didik. Lembaga bertanggung jawab memastikan dasar pemrosesan, pemberitahuan, dan persetujuan yang diperlukan untuk data peserta didik sesuai peraturan yang berlaku.',
            'Apabila Anda yakin data anak diproses tanpa dasar yang sesuai, hubungi kami melalui kontak di bawah ini dan jelaskan masalahnya agar dapat kami tindak lanjuti bersama pihak pengelola akun.',
        ],
    },
    {
        id: 'changes',
        title: 'Perubahan Kebijakan',
        paragraphs: [
            'Kami dapat memperbarui kebijakan ini untuk mencerminkan perubahan layanan, teknologi, atau peraturan. Versi terbaru akan dipublikasikan pada halaman ini dengan tanggal pembaruan. Perubahan penting dapat diberitahukan melalui layanan atau email jika diperlukan.',
        ],
    },
]
</script>

<template>

    <Head>
        <title>Kebijakan Privasi | Lumiverse</title>
        <meta head-key="description" name="description"
            content="Kebijakan Privasi Lumiverse School dan program partner Lumiverse." />
        <link head-key="canonical" rel="canonical" href="https://lumiverse.co.id/privasi" />
    </Head>

    <section class="privacy-page">
        <div class="privacy-shell">
            <div class="privacy-intro">
                <Link href="/" class="back-link" prefetch="hover">Kembali ke Lumiverse</Link>
                <p class="eyebrow">LEGAL & PRIVASI</p>
                <h1>Kebijakan Privasi</h1>
                <p class="intro-copy">
                    Kebijakan ini menjelaskan bagaimana PT Lumi Platforms Indonesia mengumpulkan, menggunakan,
                    menyimpan, dan melindungi data saat Anda menggunakan Lumiverse School dan layanan partner.
                </p>
                <p class="updated">Terakhir diperbarui: 31 Juli 2026</p>
            </div>

            <div class="privacy-layout">
                <aside class="privacy-nav" aria-label="Daftar isi kebijakan privasi">
                    <p class="nav-title">Di halaman ini</p>
                    <a v-for="section in sections" :key="section.id" :href="`#${section.id}`">
                        {{ section.title }}
                    </a>
                    <a href="#contact">Kontak</a>
                </aside>

                <article class="privacy-content">
                    <section v-for="section in sections" :id="section.id" :key="section.id" class="policy-section">
                        <p class="section-number">{{ String(sections.indexOf(section) + 1).padStart(2, '0') }}</p>
                        <h2>{{ section.title }}</h2>
                        <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
                    </section>

                    <section id="contact" class="policy-section contact-section">
                        <p class="section-number">09</p>
                        <h2>Hubungi Kami</h2>
                        <p>
                            Untuk pertanyaan, permintaan data, atau laporan terkait privasi, hubungi PT Lumi Platforms
                            Indonesia melalui email berikut:
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
.privacy-page {
    min-height: 100%;
    padding: 8rem 1.25rem 6rem;
    color: var(--white);
    background:
        radial-gradient(circle at 85% 0%, rgba(0, 212, 255, 0.11), transparent 28rem),
        var(--midnight);
}

.privacy-shell {
    width: min(100%, 1120px);
    margin: 0 auto;
}

.privacy-intro {
    max-width: 720px;
    padding-bottom: 4rem;
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
    color: var(--cyan);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
}

h1,
h2 {
    font-family: var(--font-display);
}

h1 {
    max-width: 650px;
    margin: 0;
    font-size: clamp(2.4rem, 7vw, 5.2rem);
    line-height: 0.98;
    letter-spacing: -0.03em;
}

.intro-copy {
    max-width: 650px;
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

.privacy-layout {
    display: grid;
    grid-template-columns: 220px minmax(0, 700px);
    gap: clamp(2rem, 7vw, 6rem);
    align-items: start;
}

.privacy-nav {
    position: sticky;
    top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.025);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.14);
}

.nav-title {
    margin: 0 0 0.35rem;
    color: var(--white);
    font-size: 0.8rem;
    font-weight: 700;
}

.privacy-nav a {
    display: block;
    padding: 0.55rem 0.65rem;
    border-left: 2px solid transparent;
    border-radius: 7px;
    color: var(--muted);
    font-size: 0.86rem;
    font-weight: 600;
    line-height: 1.4;
    text-decoration: none;
    transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.privacy-nav a:hover,
.privacy-nav a:focus-visible {
    border-left-color: var(--cyan);
    background: rgba(0, 212, 255, 0.08);
    color: var(--white);
    outline: none;
    transform: translateX(3px);
}

.privacy-content {
    min-width: 0;
}

.policy-section {
    scroll-margin-top: 2rem;
    padding: 0 0 3.5rem;
    margin-bottom: 3.5rem;
    border-bottom: 1px solid var(--border);
}

.section-number {
    margin: 0 0 0.65rem;
    color: var(--cyan);
    font-family: var(--font-mono);
    font-size: 0.75rem;
}

h2 {
    margin: 0 0 1.15rem;
    font-size: 1.55rem;
    line-height: 1.2;
}

.policy-section p:not(.section-number) {
    margin: 0 0 1rem;
    color: var(--muted);
    font-size: 0.92rem;
    line-height: 1.85;
}

.policy-section p:last-of-type {
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
    .privacy-page {
        padding-top: 6.5rem;
    }

    .privacy-layout {
        display: block;
    }

    .privacy-nav {
        position: static;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-bottom: 3.5rem;
        padding: 1rem 0 1rem 1rem;
    }

    .nav-title {
        grid-column: 1 / -1;
    }
}
</style>
