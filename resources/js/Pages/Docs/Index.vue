<script setup>
import { Head } from '@inertiajs/vue3'
import DocsLayout from '@/Layouts/DocsLayout.vue'
import { inject, onMounted } from 'vue'

defineOptions({
    layout: DocsLayout,
})

const language = inject('docsLanguage')

onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>

    <Head>
        <title>Dokumentasi | Lumiverse</title>
        <meta head-key="description" name="description"
            content="Dokumentasi Lumiverse School untuk admin, guru, siswa, partner, dan integrasi." />
    </Head>

    <div class="docs-page">
        <div id="overview" class="docs-section docs-hero">
            <p class="docs-eyebrow">{{ language === 'en' ? 'LUMIVERSE DOCUMENTATION' : 'DOKUMENTASI LUMIVERSE' }}</p>
            <h1 v-if="language === 'id'">Bangun pengalaman belajar<br><span>yang lebih terarah.</span></h1>
            <h1 v-else>Build a more<br><span>structured learning experience.</span></h1>
            <p class="docs-lead" v-if="language === 'id'">Panduan yang mengikuti alur layanan Lumiverse yang tersedia:
                setup lembaga, pembagian peran, pembelajaran, ujian, partner, dan API tenant.</p>
            <p class="docs-lead" v-else>Guides that follow Lumiverse's available workflows: organization setup, user
                roles, learning, exams, partner services, and tenant APIs.</p>
            <div class="docs-meta"><span>{{ language === 'en' ? 'Public documentation' : 'Dokumentasi publik'
                    }}</span><span>•</span><span>{{ language === 'en' ? 'Updated 01 Aug 2026' : 'Diperbarui 01 Agu 2026'
                    }}</span></div>
        </div>

        <div id="setup" class="docs-section split-section">
            <div class="section-index">01 / {{ language === 'en' ? 'GETTING STARTED' : 'MEMULAI' }}</div>
            <div>
                <h2>{{ language === 'en' ? 'Get started in a few steps' : 'Mulai dalam beberapa langkah' }}</h2>
                <p v-if="language === 'id'">Daftar melalui halaman pendaftaran lembaga pada domain utama. Setelah
                    lembaga aktif, pengguna masuk melalui subdomain lembaga masing-masing, lalu menyelesaikan pemilihan
                    peran sebelum membuka dashboard.</p>
                <p v-else>Register your organization on the main domain. Once active, users sign in through the
                    organization subdomain and select their role before opening the dashboard.</p>
                <ol class="step-list">
                    <li v-if="language === 'id'"><b>Daftarkan lembaga.</b> Gunakan alamat email yang aktif dan informasi
                        lembaga yang benar.</li>
                    <li v-else><b>Register your organization.</b> Use an active email address and accurate organization
                        information.</li>
                    <li v-if="language === 'id'"><b>Pilih peran.</b> Pengguna dapat masuk sebagai admin, guru, proktor,
                        siswa, atau pengguna sesuai akses yang tersedia.</li>
                    <li v-else><b>Select a role.</b> Users can access the service as admin, teacher, proctor, student,
                        or user according to their access.</li>
                    <li v-if="language === 'id'"><b>Mulai pembelajaran.</b> Admin menyiapkan pengguna dan kelas; guru,
                        proktor, serta siswa menggunakan alur masing-masing.</li>
                    <li v-else><b>Start learning.</b> Admins prepare users and classes while teachers, proctors, and
                        students follow their respective workflows.</li>
                </ol>
            </div>
        </div>

        <div id="roles" class="docs-section split-section">
            <div class="section-index">02 / {{ language === 'en' ? 'ROLES' : 'PERAN' }}</div>
            <div>
                <h2>{{ language === 'en' ? 'Every role has its workflow' : 'Setiap peran punya alurnya' }}</h2>
                <p v-if="language === 'id'">Akses utama dibagi berdasarkan peran yang diterapkan pada layanan lembaga.
                    Admin mengatur data lembaga, guru mengelola pembelajaran, proktor mengelola kebutuhan ujian, dan
                    siswa mengikuti aktivitas belajar.</p>
                <p v-else>Access is divided by role. Admins manage organization data, teachers manage learning, proctors
                    handle exam operations, and students follow learning activities.</p>
                <div class="role-grid">
                    <div><strong>Admin</strong><span>{{ language === 'en' ? 'Manage organizations, users, classes, and
                            settings.' : 'Kelola lembaga, pengguna, kelas, dan konfigurasi.' }}</span></div>
                    <div><strong>{{ language === 'en' ? 'Teacher' : 'Guru' }}</strong><span>{{ language === 'en' ?
                        'Create materials, assignments, exams, attendance, and grades.' : 'Buat materi, tugas,
                            ujian, presensi, dan nilai.' }}</span></div>
                    <div><strong>{{ language === 'en' ? 'Proctor' : 'Proktor' }}</strong><span>{{ language === 'en' ?
                        'Manage participants, question banks, exam rooms, and reports.' : 'Kelola peserta, bank
                            soal, ruang ujian, dan rekap.' }}</span></div>
                    <div><strong>{{ language === 'en' ? 'Student' : 'Siswa' }}</strong><span>{{ language === 'en' ?
                        'Take part in learning, assignments, exams, and attendance.' : 'Ikuti pembelajaran, tugas,
                            ujian, dan presensi.' }}</span></div>
                </div>
            </div>
        </div>

        <div id="admin" class="docs-section split-section accent-green">
            <div class="section-index">03 / ADMIN</div>
            <div>
                <h2>{{ language === 'en' ? 'Admin guide' : 'Panduan admin' }}</h2>
                <p v-if="language === 'id'">Admin menjadi pusat pengaturan lembaga. Pastikan data pengguna dan pembagian
                    peran sudah benar sebelum aktivitas pembelajaran dimulai.</p>
                <p v-else>The admin is the center of organization settings. Make sure user data and roles are correct
                    before learning activities begin.</p>
                <ul class="bullet-list">
                    <li>{{ language === 'en' ? 'Update the organization profile and information.' : 'Perbarui profil dan
                        informasi lembaga.' }}</li>
                    <li>{{ language === 'en' ? 'Add users and assign the right roles.' : 'Tambahkan pengguna dan berikan
                        peran yang sesuai.' }}</li>
                    <li>{{ language === 'en' ? 'Set up classes, subjects, and academic years.' : 'Atur kelas, mata
                    pelajaran, dan tahun ajaran.' }}</li>
                    <li>{{ language === 'en' ? 'Review user access regularly.' : 'Periksa akses pengguna secara
                        berkala.' }}</li>
                </ul>
            </div>
        </div>

        <div id="teacher" class="docs-section split-section">
            <div class="section-index">04 / GURU</div>
            <div>
                <h2>{{ language === 'en' ? 'Teacher guide' : 'Panduan guru' }}</h2>
                <p v-if="language === 'id'">Guru dapat menyusun alur belajar dari materi hingga evaluasi. Gunakan judul
                    dan instruksi yang jelas agar siswa mudah mengikuti setiap aktivitas.</p>
                <p v-else>Teachers can structure the learning flow from materials to assessment. Use clear titles and
                    instructions so students can follow each activity.</p>
                <ul class="bullet-list">
                    <li>{{ language === 'en' ? 'Share learning materials or modules.' : 'Bagikan materi atau modul
                        pembelajaran.' }}</li>
                    <li>{{ language === 'en' ? 'Create assignments with clear instructions and deadlines.' : 'Buat tugas
                        dengan instruksi dan tenggat yang jelas.' }}</li>
                    <li>{{ language === 'en' ? 'Prepare online exams and review the results.' : 'Siapkan ujian online
                        dan tinjau hasilnya.' }}</li>
                    <li>{{ language === 'en' ? 'Manage attendance and student grade reports.' : 'Kelola presensi serta
                        rekap nilai siswa.' }}</li>
                </ul>
            </div>
        </div>

        <div id="student" class="docs-section split-section">
            <div class="section-index">05 / SISWA</div>
            <div>
                <h2>{{ language === 'en' ? 'Student guide' : 'Panduan siswa' }}</h2>
                <p v-if="language === 'id'">Siswa dapat membuka materi, mengerjakan tugas, mengikuti ujian, melihat
                    presensi, dan memantau hasil belajar melalui akun yang diberikan lembaga.</p>
                <p v-else>Students can open materials, complete assignments, take exams, view attendance, and track
                    learning results through their organization account.</p>
                <div class="callout"><b>{{ language === 'en' ? 'Tip:' : 'Tips:' }}</b> {{ language === 'en' ? 'Use a
                    stable connection, check schedules, and save answers according to the teacher instructions.' :
                    'gunakan koneksi yang stabil, periksa jadwal, dan simpan jawaban sesuai instruksi guru.' }}</div>
            </div>
        </div>

        <div id="partner" class="docs-section split-section accent-green">
            <div class="section-index">06 / PARTNER</div>
            <div>
                <h2>{{ language === 'en' ? 'Partner program' : 'Program partner' }}</h2>
                <p v-if="language === 'id'">Partner dapat menggunakan kode referral untuk mengarahkan lembaga baru dan
                    memperoleh reward sesuai ketentuan program. Kelola kode, saldo reward, rekening utama, serta
                    pencairan dari area partner.</p>
                <p v-else>Partners can use a referral code to introduce new organizations and earn rewards according to
                    the program terms. Manage codes, reward balances, primary bank accounts, and payouts from the
                    partner area.</p>
                <div class="callout"><b>{{ language === 'en' ? 'Security:' : 'Keamanan:' }}</b> {{ language === 'en' ?
                    'Actions such as changing a bank account or requesting a payout may require additional
                    verification.' : 'tindakan seperti perubahan rekening dan pencairan dapat memerlukan verifikasi
                    tambahan.' }}</div>
            </div>
        </div>

        <div id="api" class="docs-section split-section">
            <div class="section-index">07 / REFERENSI</div>
            <div>
                <h2>API & {{ language === 'en' ? 'integration' : 'integrasi' }}</h2>
                <p v-if="language === 'id'">API yang tersedia saat ini berada pada subdomain lembaga dan menggunakan
                    prefix <code>/api</code>. Daftar di bawah adalah endpoint yang benar-benar terdaftar pada layanan,
                    bukan REST API umum untuk seluruh data aplikasi.</p>
                <p v-else>The available API runs on the organization subdomain and uses the <code>/api</code> prefix.
                    The list below contains endpoints registered in the service, not a general API for every application
                    feature.</p>
                <div class="api-table">
                    <div><code>POST /api/auth/social/login</code><span>Login sosial untuk akun yang sudah
                            terdaftar.</span></div>
                    <div><code>GET /api/user</code><span>Informasi pengguna yang sedang terautentikasi.</span></div>
                    <div><code>GET /api/rekap-nilai</code><span>Rekap nilai untuk pengguna dengan peran proktor.</span>
                    </div>
                    <div><code>GET /api/list-soal</code><span>Daftar soal untuk kebutuhan rekap proktor.</span></div>
                    <div><code>GET /api/list-mapel</code><span>Daftar mata pelajaran untuk filter rekap.</span></div>
                    <div><code>GET /api/list-kelas</code><span>Daftar kelas untuk filter rekap.</span></div>
                    <div><code>POST /api/rekap-filtered</code><span>Rekap nilai berdasarkan filter yang dikirim.</span>
                    </div>
                </div>
                <pre class="code-block"><code>POST https://&lt;subdomain-lembaga&gt;/api/auth/social/login
Content-Type: application/json

{
    "provider": "google",
    "token": "&lt;access-token-provider&gt;"
}</code></pre>
                <p class="muted-note" v-if="language === 'id'">Login sosial menerima provider google, apple, atau
                    facebook dan token dari aplikasi klien. Jika berhasil, layanan mengembalikan token akses dan data
                    pengguna. Endpoint terproteksi memerlukan autentikasi token; endpoint rekap juga memerlukan peran
                    proktor.</p>
                <p class="muted-note" v-else>Social login accepts google, apple, or facebook and a client token. On
                    success, the service returns an access token and user data. Protected endpoints require token
                    authentication; report endpoints also require the proctor role.</p>
            </div>
        </div>

        <div id="security" class="docs-section split-section">
            <div class="section-index">08 / KEAMANAN</div>
            <div>
                <h2>{{ language === 'en' ? 'Security practices' : 'Praktik keamanan' }}</h2>
                <p v-if="language === 'id'">Jaga password, kode verifikasi, dan perangkat yang digunakan untuk mengakses
                    akun. Jangan membagikan informasi keamanan melalui email atau pesan yang tidak resmi.</p>
                <p v-else>Protect your password, verification codes, and the devices used to access your account. Never
                    share security information through unofficial email or messages.</p>
                <ul class="bullet-list">
                    <li>{{ language === 'en' ? 'Use a unique, hard-to-guess password.' : 'Gunakan password yang unik dan
                        tidak mudah ditebak.' }}</li>
                    <li>{{ language === 'en' ? 'Limit access based on user roles.' : 'Batasi akses berdasarkan peran
                        pengguna.' }}</li>
                    <li>{{ language === 'en' ? 'Report suspicious activity to support.' : 'Laporkan aktivitas yang
                        mencurigakan kepada support.' }}</li>
                    <li>{{ language === 'en' ? 'Use additional verification for sensitive actions.' : 'Gunakan
                        verifikasi tambahan untuk tindakan sensitif.' }}</li>
                </ul>
            </div>
        </div>

        <div class="docs-contact">
            <p class="docs-eyebrow">{{ language === 'en' ? 'NEED MORE HELP?' : 'MASIH MEMBUTUHKAN BANTUAN?' }}</p>
            <h2>{{ language === 'en' ? 'Contact support' : 'Hubungi tim support' }}</h2>
            <p>{{ language === 'en' ? 'Send your question to' : 'Kirim pertanyaan Anda ke' }} <a
                    href="mailto:support@lumiverse.co.id">support@lumiverse.co.id</a>.</p>
        </div>
    </div>
</template>

<style scoped>
.docs-page {
    width: min(100%, 860px);
}

.docs-section {
    scroll-margin-top: 110px;
}

.docs-hero {
    padding-bottom: 6rem;
}

.docs-eyebrow {
    margin: 0 0 0.75rem;
    color: #62d9eb;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
}

.docs-hero h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 6vw, 5.8rem);
    line-height: 0.98;
    letter-spacing: -0.04em;
}

.docs-hero h1 span {
    color: #62d9eb;
}

.docs-lead {
    max-width: 650px;
    margin: 1.75rem 0 1rem;
    color: #9bb0bf;
    font-size: 1rem;
    line-height: 1.8;
}

.docs-meta {
    display: flex;
    gap: 0.7rem;
    color: #708b9c;
    font-family: var(--font-mono);
    font-size: 0.68rem;
}

.split-section {
    display: grid;
    grid-template-columns: 155px minmax(0, 1fr);
    gap: 2rem;
    padding: 4.5rem 0;
    border-top: 1px solid rgba(153, 190, 214, 0.14);
}

.section-index {
    color: #62d9eb;
    font-family: var(--font-mono);
    font-size: 0.68rem;
}

.accent-green .section-index {
    color: #6ee7b7;
}

h2 {
    margin: 0 0 1rem;
    color: #f5fbff;
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 3vw, 2.5rem);
    line-height: 1.1;
}

.split-section p {
    margin: 0 0 1.2rem;
    color: #9bb0bf;
    font-size: 0.94rem;
    line-height: 1.85;
}

.step-list,
.bullet-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.5rem 0 0;
    padding-left: 1.2rem;
    color: #9bb0bf;
    font-size: 0.86rem;
    line-height: 1.7;
}

.step-list b,
.bullet-list b {
    color: #e8f0f7;
}

.role-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.7rem;
    margin-top: 1.6rem;
}

.role-grid>div {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    padding: 1rem;
    border: 1px solid rgba(153, 190, 214, 0.14);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.025);
}

.role-grid strong {
    color: #62d9eb;
    font-family: var(--font-display);
}

.role-grid span,
.muted-note {
    color: #708b9c;
    font-size: 0.76rem;
    line-height: 1.55;
}

.api-table {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    margin: 1.5rem 0;
}

.api-table>div {
    display: grid;
    grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1fr);
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(153, 190, 214, 0.12);
}

.api-table code {
    color: #9ee7ef;
    font-family: var(--font-mono);
    font-size: 0.75rem;
}

.api-table span {
    color: #708b9c;
    font-size: 0.78rem;
    line-height: 1.5;
}

.callout {
    padding: 1rem 1.15rem;
    border-left: 2px solid #62d9eb;
    background: rgba(98, 217, 235, 0.06);
    color: #9bb0bf;
    font-size: 0.86rem;
    line-height: 1.7;
}

.callout b {
    color: #e8f0f7;
}

.code-block {
    margin: 1.5rem 0 0.7rem;
    padding: 1.25rem;
    overflow-x: auto;
    border: 1px solid rgba(153, 190, 214, 0.14);
    border-radius: 8px;
    background: #050c14;
    color: #9ee7ef;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    line-height: 1.7;
}

.muted-note {
    margin: 0 !important;
}

.docs-contact {
    margin-top: 2rem;
    padding: 2rem 0 0;
    border-top: 1px solid rgba(153, 190, 214, 0.14);
}

.docs-contact h2 {
    margin-bottom: 0.55rem;
}

.docs-contact p:last-child {
    margin: 0;
    color: #9bb0bf;
    font-size: 0.88rem;
}

.docs-contact a {
    color: #62d9eb;
    text-decoration: none;
}

.docs-contact a:hover {
    text-decoration: underline;
}

@media (max-width: 640px) {
    .docs-page {
        width: 100%;
    }

    .docs-hero {
        padding-bottom: 4rem;
    }

    .docs-meta {
        flex-wrap: wrap;
    }

    .split-section {
        display: block;
        padding: 3.25rem 0;
    }

    .section-index {
        margin-bottom: 1.25rem;
    }

    .role-grid {
        grid-template-columns: 1fr;
    }

    .api-table>div {
        grid-template-columns: 1fr;
        gap: 0.3rem;
    }
}
</style>
