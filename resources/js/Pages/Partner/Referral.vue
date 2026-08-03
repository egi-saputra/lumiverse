<script setup>
import { Head, Link, usePage, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import PartnerLayout from '@/Layouts/PartnerLayout.vue'
import {
    ShareIcon, UserPlusIcon, ArrowPathIcon, BanknotesIcon,
    QuestionMarkCircleIcon, XMarkIcon, SparklesIcon,
    ClipboardDocumentIcon, CheckIcon, PencilSquareIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
    stats: Object,
    rewards: Object, // paginator: { data, links, ... }
})

const page = usePage()

function formatPrice(amount) {
    if (amount === null || amount === undefined) return '0'
    return new Intl.NumberFormat('id-ID').format(amount)
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function actionLabel(action) {
    return {
        subscribe: 'Berlangganan Baru',
        upgrade: 'Upgrade Paket',
        renewal: 'Perpanjangan',
    }[action] ?? action
}

// ─── Copy kode referral (klik langsung di kodenya) ──────────────────────
const copied = ref(false)
async function copyCode() {
    if (!props.stats.referral_code) return
    try {
        await navigator.clipboard.writeText(props.stats.referral_code)
        copied.value = true
        setTimeout(() => { copied.value = false }, 1800)
    } catch (e) {
        // clipboard gagal, diamkan
    }
}

// ─── Modal "Cara Kerja" ─────────────────────────────────────────────────
const showHowItWorks = ref(false)

// ─── Modal "Ubah Kode Referral" ─────────────────────────────────────────
const showEditCode = ref(false)
const codeForm = useForm({ referral_code: props.stats.referral_code ?? '' })

function openEditCode() {
    codeForm.clearErrors()
    codeForm.referral_code = props.stats.referral_code ?? ''
    showEditCode.value = true
}

function closeEditCode() {
    if (codeForm.processing) return
    showEditCode.value = false
}

function submitEditCode() {
    codeForm.transform((data) => ({
        ...data,
        referral_code: data.referral_code.trim().toUpperCase(),
    })).patch(route('partner.referral.update-code'), {
        preserveScroll: true,
        onSuccess: () => { showEditCode.value = false },
    })
}
</script>

<template>

    <Head title="Reward Referral" />

    <PartnerLayout>
        <template #header>
            <h1 class="topbar-title">My Referral & Rewards</h1>
        </template>

        <!-- ── Kode referral ─────────────────────────────────────────────── -->
        <div class="referral-code-card" v-if="stats.referral_code">
            <div>
                <div class="rc-label">Kode Referral Kamu</div>
                <button type="button" class="rc-code-btn" @click="copyCode">
                    <span class="rc-code mono">{{ stats.referral_code }}</span>
                    <span class="rc-copy-icon" :class="{ 'rc-copy-icon-done': copied }">
                        <CheckIcon v-if="copied" />
                        <ClipboardDocumentIcon v-else />
                    </span>
                </button>
                <p class="rc-copy-feedback">
                    <Transition name="fade" mode="out-in">
                        <span v-if="copied" key="copied" class="rc-copied-text">Kode disalin ke clipboard ✓</span>
                        <span v-else key="hint">Klik kode untuk menyalin</span>
                    </Transition>
                </p>
            </div>
            <button type="button" class="rc-edit-btn" @click="openEditCode">
                <PencilSquareIcon class="rc-edit-icon" />
                Ubah Kode
            </button>
        </div>

        <!-- ── Stat cards ────────────────────────────────────────────────── -->
        <div class="stats-grid mb-gap">
            <div class="stat-card">
                <div class="stat-label">Saldo Reward Saat Ini</div>
                <div class="stat-value stat-accent">Rp {{ formatPrice(stats.balance) }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Reward Diterima</div>
                <div class="stat-value">Rp {{ formatPrice(stats.total_earned) }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Sekolah / Lembaga Direferensikan</div>
                <div class="stat-value">{{ stats.referred_count }}</div>
            </div>
        </div>

        <!-- ── Trigger "Cara Kerja" ──────────────────────────────────────── -->
        <button type="button" class="hiw-trigger mb-gap" @click="showHowItWorks = true">
            <QuestionMarkCircleIcon class="hiw-trigger-icon" />
            <span>Kok bisa dapat komisi berulang & makin besar? Lihat cara kerjanya</span>
        </button>

        <!-- ── History ───────────────────────────────────────────────────── -->
        <div class="section-title">Riwayat Reward</div>

        <div v-if="rewards.data.length === 0" class="empty-state">
            Belum ada reward yang masuk. Bagikan kode referral kamu ke sekolah/lembaga supaya
            mulai dapat komisi setiap kali mereka melakukan pembayaran.
        </div>

        <div v-else class="reward-list">
            <div v-for="r in rewards.data" :key="r.id" class="reward-row">
                <div class="reward-main">
                    <div class="reward-tenant">{{ r.referred_name ?? 'Tenant tidak diketahui' }}</div>
                    <div class="reward-sub">
                        {{ actionLabel(r.order_action) }} · Paket {{ r.plan_name }}
                        <span v-if="r.billing_cycle"> ({{ r.billing_cycle === 'yearly' ? 'Tahunan' : 'Bulanan'
                            }})</span>
                    </div>
                </div>
                <div class="reward-side">
                    <div class="reward-amount">+ Rp {{ formatPrice(r.reward_amount) }}</div>
                    <div class="reward-percent">{{ r.reward_percent }}% komisi</div>
                    <div class="reward-date">{{ formatDate(r.credited_at) }}</div>
                </div>
            </div>
        </div>

        <!-- ── Pagination ────────────────────────────────────────────────── -->
        <div v-if="rewards.data.length > 0" class="pagination">
            <Link v-for="(link, i) in rewards.links" :key="i" :href="link.url ?? '#'" class="page-link"
                :class="{ 'page-link-active': link.active, 'page-link-disabled': !link.url }" v-html="link.label"
                preserve-scroll preserve-state />
        </div>

        <!-- ── Modal Ubah Kode Referral ─────────────────────────────────────────── -->
        <Teleport to="body">
            <div v-if="showEditCode" class="modal-overlay" @click.self="closeEditCode">
                <div class="ec-modal-box">
                    <button type="button" class="hiw-modal-close" @click="closeEditCode">
                        <XMarkIcon style="width:18px;height:18px;" />
                    </button>

                    <div class="ec-badge">
                        <PencilSquareIcon class="ec-badge-icon" />
                        Ubah Kode Referral
                    </div>

                    <h2 class="ec-title">Pilih kode referral kamu sendiri</h2>
                    <p class="ec-sub">
                        Kode ini yang dipakai sekolah/lembaga saat mendaftar lewat referensi kamu.
                        Gunakan huruf dan angka saja, tanpa spasi atau simbol.
                    </p>

                    <form @submit.prevent="submitEditCode" class="ec-form">
                        <input v-model="codeForm.referral_code" type="text" class="ec-input mono" maxlength="20"
                            placeholder="MISALNYA: BUDI2024" autocomplete="off"
                            @input="codeForm.referral_code = codeForm.referral_code.toUpperCase()" />
                        <p v-if="codeForm.errors.referral_code" class="ec-error">
                            {{ codeForm.errors.referral_code }}
                        </p>

                        <div class="ec-warning">
                            ⚠️ Sekolah/lembaga yang <strong>sudah pernah mendaftar</strong> lewat kode lama tidak
                            terpengaruh, mereka tetap terhubung permanen dan komisi recurring-nya tetap berjalan
                            seperti biasa. Yang berhenti berfungsi hanya kode lama untuk <strong>pendaftaran
                                baru</strong> -jika kamu sudah pernah membagikan link dengan kode ini ke
                            calon referral yang belum sempat mendaftar, mereka perlu menggunakan kode referral
                            terbarumu.
                        </div>

                        <div class="ec-actions">
                            <button type="button" class="ec-btn-cancel" @click="closeEditCode"
                                :disabled="codeForm.processing">
                                Batal
                            </button>
                            <button type="submit" class="ec-btn-save" :disabled="codeForm.processing">
                                {{ codeForm.processing ? 'Menyimpan…' : 'Simpan Kode' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- ── Modal Cara Kerja Recurring Referral + Tier ──────────────────────── -->
        <Teleport to="body">
            <div v-if="showHowItWorks" class="modal-overlay" @click.self="showHowItWorks = false">
                <div class="hiw-modal-box">
                    <button type="button" class="hiw-modal-close" @click="showHowItWorks = false">
                        <XMarkIcon style="width:18px;height:18px;" />
                    </button>

                    <div class="hiw-badge">
                        <ArrowPathIcon class="hiw-badge-icon hiw-loop-icon" />
                        Recurring rewards
                    </div>

                    <h2 class="hiw-title">Sekali ajak, komisi jalan terus — makin banyak, makin besar</h2>
                    <p class="hiw-sub">
                        Beda dari referral biasa yang cuma bayar sekali di awal! Di sini,
                        <strong>setiap kali</strong> sekolah/lembaga yang kamu ajak memperpanjang
                        langganannya (bulan depan, tahun depan, dan seterusnya selama mereka aktif),
                        kamu otomatis dapat komisi lagi. Tanpa kerja tambahan.
                    </p>

                    <div class="hiw-steps">
                        <div class="hiw-step">
                            <div class="hiw-step-icon">
                                <ShareIcon />
                            </div>
                            <div class="hiw-step-num">1</div>
                            <div class="hiw-step-title">Bagikan kode referral</div>
                            <div class="hiw-step-desc">Sekali share ke sekolah/lembaga lain, tidak perlu diulang.
                            </div>
                        </div>

                        <div class="hiw-arrow">→</div>

                        <div class="hiw-step">
                            <div class="hiw-step-icon">
                                <UserPlusIcon />
                            </div>
                            <div class="hiw-step-num">2</div>
                            <div class="hiw-step-title">Mereka berlangganan</div>
                            <div class="hiw-step-desc">Kode dipakai saat checkout, otomatis terhubung permanen ke
                                akun mereka.</div>
                        </div>

                        <div class="hiw-arrow">→</div>

                        <div class="hiw-step hiw-step-highlight">
                            <div class="hiw-step-icon">
                                <BanknotesIcon />
                            </div>
                            <div class="hiw-step-num">3</div>
                            <div class="hiw-step-title">Kamu dapat komisi</div>
                            <div class="hiw-step-desc">Setiap sekolah/lembaga referralmu melakukan transaksi
                                pembayaran — persenannya makin besar seiring makin banyak yang kamu ajak.
                            </div>
                        </div>
                    </div>

                    <div class="hiw-example">
                        <span class="hiw-example-label">
                            <SparklesIcon style="width:13px;height:13px;display:inline;vertical-align:-2px;" /> Contoh
                            tier komisi:
                        </span>
                        Sekolah ke-1 sampai 3 yang berhasil kamu ajak → komisi <strong>10%</strong> per transaksi.
                        Sekolah ke-4 sampai 6 → naik jadi <strong>15%</strong>. Sekolah ke-7 sampai 10 → naik lagi jadi
                        <strong>20%</strong>. Makin banyak sekolah/lembaga yang kamu ajak, makin besar juga persen
                        komisi yang kamu dapat dari setiap transaksi mereka — dan tetap berulang tiap kali mereka
                        memperpanjang langganan, bukan cuma sekali di awal.
                    </div>

                    <button type="button" class="hiw-modal-cta" @click="showHowItWorks = false">
                        Oke, Mengerti!
                    </button>
                </div>
            </div>
        </Teleport>

    </PartnerLayout>
</template>

<style scoped>
.mb-gap {
    margin-bottom: 1.5rem;
}

.referral-code-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(0, 212, 255, 0.02));
    border: 1px solid rgba(0, 212, 255, 0.25);
    border-radius: 14px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.rc-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin-bottom: 0.3rem;
}

.rc-code-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: opacity 0.15s ease;
}

.rc-code-btn:hover {
    opacity: 0.85;
}

.rc-code-btn:active {
    transform: scale(0.98);
}

.rc-code {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--cyan);
}

.rc-copy-icon {
    display: inline-flex;
    color: var(--muted);
    transition: color 0.15s ease;
}

.rc-copy-icon svg {
    width: 15px;
    height: 15px;
}

.rc-copy-icon-done {
    color: #34d399;
}

.rc-copy-feedback {
    font-size: 0.74rem;
    color: var(--muted);
    margin: 0.3rem 0 0;
    min-height: 1.1em;
}

.rc-copied-text {
    color: #34d399;
    font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.rc-edit-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    border: 1px solid rgba(0, 212, 255, 0.35);
    background: rgba(0, 212, 255, 0.1);
    color: var(--cyan);
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.2s;
}

.rc-edit-btn:hover {
    opacity: 0.85;
}

.rc-edit-icon {
    width: 15px;
    height: 15px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
}

.stat-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.25rem;
}

.stat-label {
    font-size: 0.76rem;
    color: var(--muted);
    margin-bottom: 0.4rem;
}

.stat-value {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.35rem;
}

.stat-accent {
    color: var(--cyan);
}

.section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--muted);
    font-weight: 700;
    margin-bottom: 0.75rem;
}

.empty-state {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.5rem;
    color: var(--muted);
    font-size: 0.88rem;
    text-align: center;
}

.reward-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.reward-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.9rem 1.1rem;
}

.reward-tenant {
    font-weight: 700;
    font-size: 0.9rem;
}

.reward-sub {
    font-size: 0.78rem;
    color: var(--muted);
    margin-top: 0.15rem;
}

.reward-side {
    text-align: right;
    flex-shrink: 0;
}

.reward-amount {
    font-weight: 800;
    color: #34d399;
    font-size: 0.92rem;
}

.reward-percent {
    font-size: 0.74rem;
    color: var(--muted);
    margin-top: 0.1rem;
}

.reward-date {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.35);
    margin-top: 0.15rem;
}

.pagination {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 1.25rem;
}

.page-link {
    padding: 0.4rem 0.75rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    font-size: 0.8rem;
    color: var(--muted);
    text-decoration: none;
}

.page-link-active {
    color: var(--cyan);
    border-color: rgba(0, 212, 255, 0.35);
    background: rgba(0, 212, 255, 0.08);
}

.page-link-disabled {
    opacity: 0.35;
    pointer-events: none;
}

/* ── Trigger "Cara Kerja" ──────────────────────────────────────────────── */
.hiw-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(52, 211, 153, 0.06);
    border: 1px dashed rgba(52, 211, 153, 0.3);
    color: #34d399;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.55rem 0.9rem;
    border-radius: 100px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
}

.hiw-trigger:hover {
    background: rgba(52, 211, 153, 0.1);
    border-color: rgba(52, 211, 153, 0.5);
}

.hiw-trigger-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

/* ── Modal overlay & box (shared) ──────────────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.hiw-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--muted);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
}

.hiw-modal-close:hover {
    color: var(--white);
    border-color: rgba(255, 255, 255, 0.2);
}

/* ── Modal: Ubah Kode Referral ─────────────────────────────────────────── */
.ec-modal-box {
    position: relative;
    background: linear-gradient(160deg, rgba(0, 212, 255, 0.07), var(--navy) 40%);
    border: 1px solid rgba(0, 212, 255, 0.25);
    border-radius: 20px;
    padding: 1.75rem;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 0 60px rgba(0, 212, 255, 0.1), 0 24px 60px rgba(0, 0, 0, 0.5);
}

.ec-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cyan);
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    padding: 0.3rem 0.75rem;
    border-radius: 100px;
    margin-bottom: 0.85rem;
}

.ec-badge-icon {
    width: 12px;
    height: 12px;
}

.ec-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.1rem;
    margin: 0 0 0.5rem;
}

.ec-sub {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.55;
    margin: 0 0 1.25rem;
}

.ec-form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
}

.ec-input {
    background: var(--midnight);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.75rem 0.9rem;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--white);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ec-input:focus {
    outline: none;
    border-color: var(--cyan);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
}

.ec-error {
    font-size: 0.76rem;
    color: #fb7185;
    margin: 0;
}

.ec-warning {
    font-size: 0.76rem;
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.08);
    border: 1px solid rgba(251, 191, 36, 0.25);
    border-radius: 10px;
    padding: 0.65rem 0.8rem;
    line-height: 1.5;
}

.ec-actions {
    display: flex;
    gap: 0.6rem;
    margin-top: 0.3rem;
}

.ec-btn-cancel,
.ec-btn-save {
    flex: 1;
    padding: 0.7rem;
    border-radius: 10px;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
}

.ec-btn-cancel {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--white);
}

.ec-btn-cancel:hover {
    border-color: rgba(255, 255, 255, 0.25);
}

.ec-btn-save {
    background: var(--cyan);
    border: none;
    color: var(--midnight);
}

.ec-btn-save:hover {
    opacity: 0.88;
}

.ec-btn-cancel:disabled,
.ec-btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* ── Modal: Cara Kerja (hijau) ─────────────────────────────────────────── */
.hiw-modal-box {
    position: relative;
    background: linear-gradient(160deg, rgba(52, 211, 153, 0.06), var(--navy) 40%);
    border: 1px solid rgba(52, 211, 153, 0.25);
    border-radius: 20px;
    padding: 1.75rem;
    width: 100%;
    max-width: 620px;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;
    box-shadow: 0 0 60px rgba(52, 211, 153, 0.1), 0 24px 60px rgba(0, 0, 0, 0.5);
}

.hiw-modal-box::-webkit-scrollbar {
    display: none;
}

.hiw-modal-cta {
    display: block;
    width: 100%;
    margin-top: 1.25rem;
    padding: 0.7rem;
    border-radius: 10px;
    border: none;
    background: #34d399;
    color: #06281c;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    transition: opacity 0.2s;
}

.hiw-modal-cta:hover {
    opacity: 0.88;
}

/* ── Header ────────────────────────────────────────────────────────────── */
.hiw-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #34d399;
    background: rgba(52, 211, 153, 0.1);
    border: 1px solid rgba(52, 211, 153, 0.3);
    padding: 0.3rem 0.75rem;
    border-radius: 100px;
    margin-bottom: 0.85rem;
}

.hiw-badge-icon {
    width: 12px;
    height: 12px;
}

.hiw-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.15rem;
    margin: 0 0 0.6rem;
}

.hiw-sub {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.6;
    margin: 0 0 1.5rem;
}

.hiw-sub strong {
    color: var(--white);
}

/* ── Steps ─────────────────────────────────────────────────────────────── */
.hiw-steps {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    position: relative;
    padding-bottom: 2.5rem;
}

.hiw-step {
    flex: 1 1 160px;
    max-width: 190px;
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.1rem 1rem;
    position: relative;
    text-align: center;
}

.hiw-step-highlight {
    border-color: rgba(52, 211, 153, 0.4);
    box-shadow: 0 0 24px rgba(52, 211, 153, 0.08);
}

.hiw-step-icon {
    width: 34px;
    height: 34px;
    margin: 0 auto 0.6rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 212, 255, 0.1);
    color: var(--cyan);
}

.hiw-step-highlight .hiw-step-icon {
    background: rgba(52, 211, 153, 0.14);
    color: #34d399;
}

.hiw-step-icon svg {
    width: 18px;
    height: 18px;
}

.hiw-step-num {
    position: absolute;
    top: -8px;
    left: -8px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--midnight);
    border: 1px solid var(--border);
    font-size: 0.7rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
}

.hiw-step-title {
    font-weight: 700;
    font-size: 0.85rem;
    margin-bottom: 0.3rem;
}

.hiw-step-desc {
    font-size: 0.75rem;
    color: var(--muted);
    line-height: 1.45;
}

.hiw-arrow {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.2);
    font-size: 1.2rem;
    font-weight: 300;
}

/* ── Example strip ─────────────────────────────────────────────────────── */
.hiw-example {
    font-size: 0.8rem;
    color: var(--muted);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    line-height: 1.6;
}

.hiw-example strong {
    color: #34d399;
}

.hiw-example-label {
    font-weight: 700;
    color: var(--white);
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 720px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .referral-code-card {
        flex-direction: column;
        align-items: flex-start;
    }

    .rc-edit-btn {
        width: 100%;
        justify-content: center;
    }

    .hiw-steps {
        flex-direction: column;
        align-items: center;
        padding-bottom: 3.2rem;
    }

    .hiw-arrow {
        transform: rotate(90deg);
    }

    .hiw-step {
        max-width: 100%;
        width: 100%;
    }

    .hiw-modal-box,
    .ec-modal-box {
        padding: 1.25rem;
    }
}
</style>