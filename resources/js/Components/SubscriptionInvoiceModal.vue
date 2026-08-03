<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    show: Boolean,
    loading: Boolean,
    submitting: Boolean,
    calc: Object,
    planName: String,
    accentColor: { type: String, default: '#00d4ff' },
})

const emit = defineEmits(['close', 'confirm', 'apply-referral'])
const referralInput = ref('')

// reset input tiap kali modal dibuka ulang
watch(() => props.show, (val) => {
    if (val) referralInput.value = ''
})

function formatPrice(amount) {
    if (amount === null || amount === undefined) return null
    if (amount === 0) return '0'
    return new Intl.NumberFormat('id-ID').format(amount)
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function referralLabelText(c) {
    if (!c) return ''
    return c.referral_discount_type === 'fixed'
        ? `Rp ${formatPrice(c.referral_discount_amount)}`
        : `${c.referral_discount_percent}%`
}
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="modal-overlay" @click.self="emit('close')">
            <div class="modal-box" :style="{ '--accent': accentColor }">

                <!-- Loading state -->
                <div v-if="loading" class="modal-loading">
                    <div class="modal-spinner" />
                    <p>Menyiapkan invoice...</p>
                </div>

                <!-- Content -->
                <template v-else-if="calc">

                    <div class="modal-header">
                        <div class="modal-header-left">
                            <div class="modal-invoice-label">INVOICE BERLANGGANAN</div>
                            <div class="modal-title">Paket {{ planName }}</div>
                            <div class="modal-subtitle">
                                <span class="inv-cycle-badge">
                                    {{ calc.billing_cycle === 'yearly' ? '📅 Tahunan' : '🗓 Bulanan' }}
                                </span>
                                <span v-if="calc.action === 'upgrade'" class="inv-action-badge inv-upgrade">↑
                                    Upgrade</span>
                                <span v-else-if="calc.action === 'downgrade'" class="inv-action-badge inv-downgrade">↓
                                    Downgrade</span>
                                <span v-else-if="calc.action === 'renewal'" class="inv-action-badge inv-renewal">🔄
                                    Perpanjangan</span>
                                <span v-else class="inv-action-badge inv-new">✦ Berlangganan Baru</span>
                            </div>
                        </div>
                        <button class="modal-close" @click="emit('close')">✕</button>
                    </div>

                    <div class="inv-body">
                        <div v-if="calc.price_per_month" class="inv-row">
                            <span class="inv-label">
                                Harga per bulan
                                <span class="inv-label-sub">Paket {{ planName }}</span>
                            </span>
                            <span class="inv-value">Rp {{ formatPrice(calc.price_per_month) }}</span>
                        </div>

                        <div v-if="calc.billing_cycle === 'yearly'" class="inv-row">
                            <span class="inv-label">
                                Periode berlangganan
                                <span class="inv-label-sub">× 12 bulan</span>
                            </span>
                            <span class="inv-value">Rp {{ formatPrice(calc.subtotal) }}</span>
                        </div>

                        <div v-if="calc.yearly_discount > 0" class="inv-row inv-row-discount">
                            <span class="inv-label">
                                Diskon berlangganan tahunan
                                <span class="inv-label-sub">Hemat vs bayar bulanan ×12</span>
                            </span>
                            <span class="inv-value inv-green">− Rp {{ formatPrice(calc.yearly_discount) }}</span>
                        </div>

                        <div v-if="calc.discount_amount > 0" class="inv-row inv-row-discount">
                            <span class="inv-label">
                                Diskon paket {{ calc.discount_percent }}%
                                <span class="inv-label-sub">Promo khusus paket {{ planName }}</span>
                            </span>
                            <span class="inv-value inv-green">− Rp {{ formatPrice(calc.discount_amount) }}</span>
                        </div>

                        <div v-if="calc.referral_discount_amount > 0" class="inv-row inv-row-discount">
                            <span class="inv-label">
                                Diskon Referral {{ referralLabelText(calc) }}
                                <span class="inv-label-sub">Menggunakan kode referral</span>
                            </span>
                            <span class="inv-value inv-green">− Rp {{ formatPrice(calc.referral_discount_amount)
                                }}</span>
                        </div>

                        <div v-if="calc.credit_amount > 0" class="inv-row inv-row-credit">
                            <span class="inv-label">
                                Kredit paket sebelumnya
                                <span class="inv-label-sub" v-if="calc.credit_days">Sisa {{ calc.credit_days }} hari
                                    dikonversi</span>
                            </span>
                            <span class="inv-value inv-green">− Rp {{ formatPrice(calc.credit_amount) }}</span>
                        </div>

                        <div v-if="calc.bonus_days > 0" class="inv-row inv-row-bonus">
                            <span class="inv-label">
                                Perpanjangan dari sisa kredit
                                <span class="inv-label-sub">+ {{ calc.bonus_days }} hari tambahan</span>
                            </span>
                            <span class="inv-value inv-green">Gratis</span>
                        </div>

                        <div class="inv-divider" />

                        <div class="inv-row">
                            <span class="inv-label">Subtotal</span>
                            <span class="inv-value">Rp {{ formatPrice(calc.amount_to_pay) }}</span>
                        </div>

                        <div v-if="calc.tax_amount > 0" class="inv-row inv-row-tax">
                            <span class="inv-label">
                                PPN {{ calc.tax_percent ?? 0 }}%
                                <span class="inv-label-sub">Pajak Pertambahan Nilai</span>
                            </span>
                            <span class="inv-value">Rp {{ formatPrice(calc.tax_amount) }}</span>
                        </div>

                        <div class="inv-divider inv-divider-bold" />

                        <div class="inv-row inv-row-grand">
                            <span>Total yang harus dibayar</span>
                            <span class="inv-grand-value">Rp {{ formatPrice(calc.amount_to_pay_after_tax) }}</span>
                        </div>

                        <div v-if="calc.new_expires_at" class="inv-expires">
                            <span>🗓</span>
                            <span>Aktif hingga <strong>{{ formatDate(calc.new_expires_at) }}</strong></span>
                        </div>

                        <div v-if="calc.downgrade_note" class="modal-note">
                            {{ calc.downgrade_note }}
                        </div>

                        <div v-if="calc.user_count_warning" class="modal-warning">
                            ⚠️ {{ calc.user_count_warning }}
                        </div>
                    </div>

                    <div v-if="calc && !calc.referral_locked" class="referral-input-box">
                        <label for="referral_code_input" class="referral-label">Punya kode referral?</label>
                        <div class="referral-input-row">
                            <input id="referral_code_input" type="text" v-model="referralInput"
                                placeholder="Contoh: A3F9K2XZ" class="referral-input" />
                            <button type="button" class="referral-apply-btn"
                                @click="emit('apply-referral', referralInput)">
                                Terapkan
                            </button>
                        </div>
                        <div v-if="calc.referral_discount_amount > 0" class="referral-applied-note">
                            ✓ Diskon referral {{ referralLabelText(calc) }} diterapkan
                        </div>
                    </div>

                    <div v-if="calc && calc.referral_locked && calc.referral_discount_amount > 0"
                        class="referral-applied-note">
                        ✓ Diskon referral {{ referralLabelText(calc) }} otomatis diterapkan
                    </div>

                    <div class="modal-actions">
                        <button class="modal-btn-cancel" @click="emit('close')">Batal</button>
                        <button class="modal-btn-confirm" :disabled="submitting" @click="emit('confirm')">
                            {{ submitting ? 'Memproses...' : (calc.amount_to_pay_after_tax === 0 ? 'Aktifkan Gratis' :
                                'Lanjut Bayar') }}
                        </button>
                    </div>
                </template>

                <div v-else class="modal-loading">
                    <p>Gagal memuat data. <button @click="emit('close')">Tutup</button></p>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
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

.modal-box {
    background: var(--navy);
    border: 1px solid color-mix(in srgb, var(--accent, #00d4ff) 30%, var(--border));
    border-radius: 20px;
    padding: 1.75rem;
    width: 100%;
    max-width: 420px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 0 60px color-mix(in srgb, var(--accent, #00d4ff) 12%, transparent),
        0 24px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}

.modal-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.modal-invoice-label {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent, #00d4ff);
}

.modal-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.1rem;
}

.modal-subtitle {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    font-size: 0.82rem;
    color: var(--muted);
}

.inv-cycle-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.72rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 0.15rem 0.55rem;
    border-radius: 100px;
}

.inv-action-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.15rem 0.55rem;
    border-radius: 100px;
}

.inv-upgrade {
    background: rgba(99, 179, 237, 0.12);
    color: #63b3ed;
    border: 1px solid rgba(99, 179, 237, 0.25);
}

.inv-downgrade {
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.25);
}

.inv-renewal {
    background: rgba(167, 139, 250, 0.12);
    color: #a78bfa;
    border: 1px solid rgba(167, 139, 250, 0.25);
}

.inv-new {
    background: color-mix(in srgb, var(--accent, #00d4ff) 10%, transparent);
    color: var(--accent, #00d4ff);
    border: 1px solid color-mix(in srgb, var(--accent, #00d4ff) 30%, transparent);
}

.modal-close {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 0.2rem;
    flex-shrink: 0;
    font-size: 1.1rem;
    line-height: 1;
}

.modal-close:hover {
    color: var(--white);
}

.inv-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 12px;
    max-height: 50vh;
    overflow-y: auto;
    scrollbar-width: none;
}

.inv-body::-webkit-scrollbar {
    display: none;
}

.inv-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.7rem 1rem;
    font-size: 0.84rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.inv-row:last-child {
    border-bottom: none;
}

.inv-label {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    color: var(--muted);
    flex: 1;
}

.inv-label-sub {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 400;
}

.inv-value {
    font-weight: 600;
    color: var(--white);
    white-space: nowrap;
    text-align: right;
}

.inv-green {
    color: #34d399;
}

.inv-row-discount,
.inv-row-credit,
.inv-row-bonus {
    background: rgba(52, 211, 153, 0.04);
}

.inv-row-tax {
    background: rgba(255, 255, 255, 0.015);
}

.inv-divider {
    height: 1px;
    background: var(--border);
    margin: 0;
}

.inv-divider-bold {
    background: rgba(255, 255, 255, 0.12);
}

.inv-row-grand {
    position: sticky;
    bottom: 2.45rem;
    padding: 0.5rem 1rem;
    font-weight: 800;
    font-size: 0.92rem;
    color: var(--white);
    background: var(--navy);
}

.inv-grand-value {
    font-family: var(--font-display);
    font-size: 0.92rem;
    font-weight: 900;
    color: var(--accent, #00d4ff);
    white-space: nowrap;
}

.inv-expires {
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1rem;
    font-size: 0.78rem;
    color: var(--muted);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background: var(--navy);
}

.inv-expires strong {
    color: var(--white);
}

.modal-note {
    font-size: 0.78rem;
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.08);
    border: 1px solid rgba(251, 191, 36, 0.2);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    margin-top: 0.25rem;
}

.modal-warning {
    font-size: 0.78rem;
    color: #fb923c;
    background: rgba(251, 146, 60, 0.08);
    border: 1px solid rgba(251, 146, 60, 0.25);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
}

.modal-actions {
    display: flex;
    gap: 0.75rem;
}

.modal-btn-cancel {
    flex: 1;
    padding: 0.65rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
}

.modal-btn-cancel:hover {
    color: var(--white);
    border-color: rgba(255, 255, 255, 0.2);
}

.modal-btn-confirm {
    flex: 2;
    padding: 0.65rem;
    border-radius: 10px;
    border: none;
    background: var(--accent, #00d4ff);
    color: var(--midnight, #0a0f1e);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
}

.modal-btn-confirm:hover:not(:disabled) {
    opacity: 0.88;
}

.modal-btn-confirm:disabled {
    opacity: 0.5;
    cursor: default;
}

.modal-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 0;
    color: var(--muted);
    font-size: 0.85rem;
}

.modal-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid var(--border);
    border-top-color: var(--accent, #00d4ff);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.referral-input-box {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.85rem 1rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 12px;
}

.referral-label {
    font-size: 0.78rem;
    color: var(--muted);
    font-weight: 600;
}

.referral-input-row {
    display: flex;
    gap: 0.5rem;
}

.referral-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--white);
    font-size: 0.82rem;
    text-transform: uppercase;
}

.referral-input:focus {
    outline: none;
    border-color: var(--accent, #00d4ff);
}

.referral-apply-btn {
    padding: 0.5rem 0.9rem;
    border-radius: 8px;
    border: 1px solid color-mix(in srgb, var(--accent, #00d4ff) 35%, transparent);
    background: color-mix(in srgb, var(--accent, #00d4ff) 12%, transparent);
    color: var(--accent, #00d4ff);
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
}

.referral-applied-note {
    font-size: 0.78rem;
    color: #34d399;
    font-weight: 600;
}
</style>