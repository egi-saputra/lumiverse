<script setup>
import { computed, ref } from 'vue'

const helpUrl = computed(() => {
    const hostname = window.location.hostname
    const port = window.location.port ? `:${window.location.port}` : ''
    const protocol = window.location.protocol
    const isLocal = hostname === 'localhost'
        || hostname.endsWith('.localhost')
        || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)

    return isLocal ? `${protocol}//localhost${port}/help` : 'https://lumiverse.co.id/help'
})

const faqs = [
    {
        q: 'Apa itu program partner lumiverse ?',
        a: 'Lumiverse menghadirkan program partner sebagai bentuk kolaborasi dalam menjangkau pasar yang lebih luas, kami menawarkan beberapa benefit kepada siapa saja yang ingin bergabung sebagai partner kami secara terbuka dengan sistem recurring rewards atau komisi berulang, sehingga diharapkan dapat membantu Anda dalam memanfaatkan opportunity yang tersedia sebagai pendapatan tambahan atau passive income dari setiap transaksi yang dilakukan dengan menggunakan kode referral yang Anda bagikan.',
    },
    {
        q: 'Bagaimana skema pendapatan / komisi dari program partner ini ?',
        a: 'Anda akan mendapatkan komisi mulai dari 10% hingga 25% secara bertahap dari setiap lembaga yang melakukan transaksi berlangganan dengan menggunakan kode referral Anda. Komisi akan dibayarkan setiap bulan secara otomatis ke rekening yang telah Anda daftarkan di akun partner Anda selama lembaga tersebut masih aktif berlangganan. Semakin banyak lembaga yang Anda referensikan, semakin tinggi persentase komisi yang akan Anda dapatkan.',
    },
    {
        q: 'Bagaimana cara menghitung akumulasi persentase komisinya ?',
        a: 'Anda akan mendapatkan komisi berdasarkan tingkat persentase yang dimiliki mulai dari 10% hingga 25%, setiap lembaga yang melakukan transaksi berlangganan dengan menggunakan kode referral Anda akan mempengaruhi persentase komisi yang akan Anda dapatkan, jika lembaga tersebut berlangganan dengan paket plan Starter Kit, Basic atau Lainnya, maka Anda akan mendapatkan komisi sebesar 10% dari harga plan yang mereka beli pada penggunaan referral pertama Anda, persentase ini akan meningkat secara bertahap berdasarkan jumlah referral yang berhasil Anda generasi.',
    },
    {
        q: 'Apakah proses transaksi dan komisi yang tersimpan aman ?',
        a: 'Tentu. Semua pembayaran diproses melalui payment gateway resmi dan terpercaya, sehingga semua transaksi yang dilakukan akan aman dan terlindungi. Semua dana yang Anda dapatkan dari program partner lumiverse akan tersimpan dengan aman di akun partner Anda, dan hanya bisa dicairkan ke rekening bank lokal atau akun penyimpanan saldo yang sudah Anda daftarkan di akun partner Anda, kami juga telah mengoptimalkan beberapa lapisan keamanan sistem dalam hal ini seperti autentikasi akun dasar, kunci pin dan biometric serta notifikasi otomatis melalui email yang sudah Anda daftarkan agar jika ada aktivitas mencurigakan, Anda akan langsung mendapatkan pemberitahuan secara realtime.',
    },
    {
        q: "Uang komisinya masuk ke mana dan berapa lama proses pencairannya ?",
        a: "Dana komisi akan masuk secara otomatis ke akun partner Anda dan dicairkan ke rekening bank lokal yang sudah didaftarkan. Anda dapat menambahkan informasi rekening Anda di akun partner, proses penarikan dana atau pencarian komisi dapat dilakukan secara otomatis hanya dalam hitungan menit setelah akun bank Anda sudah terdaftar maksimal 1 x 24 jam dan berhasil di verifikasi saat transaksi penarikan dana dilakukan pertama kali."
    },
    {
        q: 'Apakah ada biaya potongan Admin dan lainnya saat proses pencairan dana ?',
        a: 'Tidak ada biaya potongan apapun saat Anda melakukan proses pencairan dana / komisi.',
    },
]

const openIndex = ref(-1)
// const openIndex = ref(0)

function toggle(i) {
    openIndex.value = openIndex.value === i ? -1 : i
}
</script>

<template>
    <section class="faq-section" id="faq" aria-labelledby="faq-title">
        <div class="container">
            <div class="faq-layout">
                <!-- Left: intro + contact -->
                <div class="faq-intro reveal">
                    <div class="section-eyebrow">Pertanyaan Umum</div>
                    <h2 class="section-title" id="faq-title">
                        Masih ada yang<br>
                        <span class="text-cyan">ingin ditanyakan?</span>
                    </h2>
                    <p class="section-desc">
                        Temukan jawaban atas pertanyaan yang paling sering diajukan sebelum bergabung dengan program
                        partner lumiverse.
                    </p>

                    <div class="contact-card sm:flex hidden">
                        <div class="contact-text">
                            <div class="contact-title">Selalu ada untuk membantu Anda</div>
                            <div class="contact-sub">Apabila Anda ingin mengetahui lebih lanjut mengenai implementasi
                                program partnership lumiverse, kami selalu siap membantu Anda. Hubungi kami melaui email
                                atau Pusat Bantuan kami di bawah ini.</div>
                        </div>
                        <a :href="helpUrl" class="btn-hero">
                            Hubungi Kami
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 12H20"></path>
                                <path d="M14 6L20 12L14 18"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Right: accordion -->
                <div class="faq-list reveal">
                    <div v-for="(item, i) in faqs" :key="item.q" class="faq-item"
                        :class="{ 'faq-item--open': openIndex === i }" :style="{ '--i': i }">
                        <button class="faq-question" type="button" :aria-expanded="openIndex === i" @click="toggle(i)">
                            <span class="faq-index sm:inline-flex hidden">{{ String(i + 1).padStart(2, '0') }}</span>
                            <span class="faq-question-text">{{ item.q }}</span>
                            <span class="faq-toggle" aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <path d="M5 12h14M12 5v14" class="plus-v" />
                                </svg>
                            </span>
                        </button>
                        <div class="faq-answer-wrap">
                            <div class="faq-answer-inner">
                                <p class="faq-answer">{{ item.a }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="contact-card flex sm:hidden">
                    <div class="contact-text">
                        <div class="contact-icon">💬</div>
                        <div class="contact-title">Kami selalu ada,<br>untuk membantu Anda</div>
                        <div class="contact-sub">Apabila Anda ingin mengetahui lebih lanjut mengenai sistem implementasi
                            program partner lumiverse ini, kami selalu siap membantu Anda. Hubungi kami melaui email
                            atau Pusat Bantuan kami di bawah.</div>
                    </div>
                    <a :href="helpUrl" class="btn-hero">
                        Hubungi Kami
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.faq-section {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

.faq-layout {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 5rem;
    align-items: start;
}

/* ── Left: intro ─────────────────────────────────────── */
.faq-intro {
    position: sticky;
    top: 6rem;
}

.section-eyebrow {
    display: inline-block;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--cyan);
    margin-bottom: 0.75rem;
}

.section-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.7rem, 3.2vw, 2.4rem);
    line-height: 1.3;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
}

.text-cyan {
    color: var(--cyan);
}

.section-desc {
    font-size: 1rem;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 2.25rem;
}

.contact-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 1.5rem;
    flex-direction: column;
    gap: 0.85rem;
    align-items: flex-start;
    transition: border-color 0.3s;
}

.contact-card:hover {
    border-color: rgba(52, 211, 153, 0.3);
}

.contact-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(52, 211, 153, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
}

.contact-title {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 1.65rem;
    margin-bottom: 0.2rem;
}

.contact-sub {
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.5;
}

.btn-hero {
    /* border-radius: 100px; */
    font-family: var(--font-body);
}

.contact-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.85rem;
    color: #05080f;
    background: linear-gradient(135deg, #34d399, #059669);
    padding: 0.6rem 1.1rem;
    border-radius: 10px;
    margin-top: 0.25rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.contact-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(52, 211, 153, 0.3);
}

.contact-btn svg {
    transition: transform 0.2s;
}

.contact-btn:hover svg {
    transform: translateX(2px);
}

/* ── Right: accordion ─────────────────────────────────── */
.faq-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.faq-item {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.3s;
    animation: faq-fade-in 0.5s ease backwards;
    animation-delay: calc(var(--i) * 0.06s);
}

@keyframes faq-fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .faq-item {
        animation: none;
    }
}

.faq-item--open {
    border-color: rgba(0, 212, 255, 0.3);
}

.faq-question {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: none;
    border: none;
    text-align: left;
    padding: 1.25rem 1.5rem;
    cursor: pointer;
    color: var(--white);
}

.faq-index {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--cyan);
    opacity: 0.7;
    flex-shrink: 0;
    padding-top: 0.1rem;
}

.faq-question-text {
    flex: 1;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.98rem;
    line-height: 1.5;
}

.faq-toggle {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.04);
    color: var(--muted);
    transition: background 0.3s, color 0.3s, transform 0.3s;
}

.faq-item--open .faq-toggle {
    background: rgba(0, 212, 255, 0.12);
    color: var(--cyan);
    transform: rotate(135deg);
}

.plus-v {
    transition: opacity 0.2s;
}

/* Smooth height animation via grid trick */
.faq-answer-wrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s ease;
}

.faq-item--open .faq-answer-wrap {
    grid-template-rows: 1fr;
}

.faq-answer-inner {
    overflow: hidden;
}

.faq-answer {
    padding: 0 1.5rem 1.5rem 3.25rem;
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.75;
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 1024px) {
    .faq-layout {
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .faq-intro {
        position: static;
    }
}

@media (max-width: 640px) {
    .contact-title {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        line-height: 1.5rem;
    }

    .section-desc {
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 1rem;
    }

    .faq-section {
        padding: 5rem 0;
    }

    .faq-list {
        margin-top: -2rem;
    }

    .faq-question {
        padding: 1.1rem 1.1rem;
        gap: 0.75rem;
    }

    .faq-answer {
        padding: 0 1.1rem 1.25rem 1.25rem;
    }
}
</style>