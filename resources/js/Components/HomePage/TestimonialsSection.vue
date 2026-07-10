<script setup>
const testimonials = [
    {
        text: 'Sejak pakai Lumiverse, proses rekap nilai dan pembuatan rapor yang dulu butuh 2 minggu sekarang bisa selesai dalam 2 jam. Luar biasa efisiennya!',
        name: 'Aditya Dwi Anggara, M.Pd',
        role: 'Waka Kurikulum, SMK Nusantara',
        initials: 'AD',
        avatarGradient: '',
    },
    {
        text: 'Fitur pembuatan modul pelatihan dan pengembangan karyawan yang sangat membantu. Mereka sekarang jadi lebih cepat untuk mengakses modul sebagai bahan bacaan dan pembelajaran untuk perkembangan skill mereka.',
        name: 'Ade Kurniawan',
        role: 'Kepala Toko, Koperasi Desa Sejahtera',
        initials: 'AS',
        avatarGradient: 'linear-gradient(135deg,var(--gold-dim),var(--navy-light))',
    },
    {
        text: 'Sangat membantu saya untuk keperluan recruitment pegawai baru. Bisa melakukan test / psikotest terhadap karyawan baru secara daring dengan visual yang lebih modern dan futuristic.',
        name: 'Ahmad Prasetyo',
        role: 'HR Staff, PT Jala Lintas Media',
        initials: 'AP',
        avatarGradient: 'linear-gradient(135deg,#7dd3fc,var(--navy-light))',
    },
]
</script>

<template>
    <section class="testimonials-section" id="testimonial" aria-labelledby="testimonials-title">
        <div class="container">
            <div class="section-header centered reveal">
                <div class="section-eyebrow">Apa kata mereka</div>
                <h2 class="section-title" id="testimonials-title">Dipercaya 100+ lembaga pendidikan di Indonesia
                </h2>
            </div>

            <div class="testimonials-grid">
                <div v-for="(t, i) in testimonials" :key="t.name" class="testimonial-card reveal"
                    :style="{ transitionDelay: `${i * 0.1}s` }">
                    <div class="testimonial-stars">★★★★★</div>
                    <p class="testimonial-text">"{{ t.text }}"</p>
                    <div class="testimonial-author">
                        <div class="author-avatar" :style="t.avatarGradient ? { background: t.avatarGradient } : {}">{{
                            t.initials }}</div>
                        <div>
                            <div class="author-name">{{ t.name }}</div>
                            <div class="author-role">{{ t.role }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.testimonials-section {
    padding: 7rem 0;
    position: relative;
    z-index: 1;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.testimonial-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    transition: all 0.3s;
}

.testimonial-card:hover {
    border-color: rgba(0, 212, 255, 0.2);
    transform: translateY(-2px);
}

.testimonial-stars {
    display: flex;
    gap: 0.2rem;
    margin-bottom: 1rem;
    color: var(--gold);
    font-size: 0.875rem;
}

.testimonial-text {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    font-style: italic;
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.author-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--cyan-dim), var(--navy-light));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.9rem;
    color: var(--white);
    flex-shrink: 0;
}

.author-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.9rem;
}

.author-role {
    font-size: 0.78rem;
    color: var(--muted);
}

@media (max-width: 768px) {
    .container {
        padding: 0 0.75rem;
    }

    .testimonials-grid {
        grid-template-columns: 1fr;
    }
}
</style>