<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';

// ── Config ────────────────────────────────────────────────────────────────
const API_BASE = '/api/v1/admin/hero-slides';
const REORDER_URL = '/api/v1/admin/hero-slides-reorder';

// ── State ─────────────────────────────────────────────────────────────────
const slides = ref([]);
const loading = ref(false);
const saving = ref(false);
const deletingId = ref(null);
const toast = ref(null);
const showForm = ref(false);
const editingSlide = ref(null);
const dragOverIndex = ref(null);
const dragIndex = ref(null);

const form = reactive({
    label: '',
    heading: ['', ''],
    accent: 0,
    sub: '',
    tag: '',
    cta: 'Lihat Program',
    cta_target: 'programs',
    order: 0,
    is_active: true,
    imageFile: null,
    imagePreview: null,
});

const ctaTargets = ['home', 'about', 'programs', 'facilities', 'contact'];

// ── Computed ──────────────────────────────────────────────────────────────
const formTitle = computed(() => editingSlide.value ? 'Edit Slide' : 'Tambah Slide Baru');

// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    toast.value = { message, type };
    setTimeout(() => (toast.value = null), 3500);
}

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * BUG FIX: parse error response Laravel dengan benar.
 * Sebelumnya: operator precedence menyebabkan TypeError saat
 *   `message` ada tapi `errors` tidak ada.
 */
function parseErrorMessage(e) {
    const data = e.response?.data;
    if (!data) return 'Terjadi kesalahan jaringan.';

    // Laravel validation errors: { errors: { field: ['msg'] } }
    if (data.errors && typeof data.errors === 'object') {
        return Object.values(data.errors).flat().join(' ');
    }

    // Laravel 401/403/500 dengan field message
    if (data.message) return data.message;

    return 'Terjadi kesalahan.';
}

function buildFormData() {
    const fd = new FormData();
    fd.append('label', form.label);
    // Filter baris heading kosong sebelum dikirim
    const validHeading = form.heading.filter(h => h.trim() !== '');
    fd.append('heading', JSON.stringify(validHeading));
    fd.append('accent', form.accent);
    fd.append('sub', form.sub);
    fd.append('tag', form.tag ?? '');
    fd.append('cta', form.cta);
    fd.append('cta_target', form.cta_target);
    fd.append('order', form.order);
    fd.append('is_active', form.is_active ? '1' : '0');
    if (form.imageFile) fd.append('image', form.imageFile);
    return fd;
}

// ── API calls ─────────────────────────────────────────────────────────────

async function fetchSlides() {
    loading.value = true;
    try {
        const { data } = await axios.get(API_BASE);
        slides.value = data;
    } catch (e) {
        showToast(parseErrorMessage(e), 'error');
    } finally {
        loading.value = false;
    }
}

async function saveSlide() {
    if (!form.label.trim() || !form.sub.trim()) {
        showToast('Label dan deskripsi wajib diisi.', 'error');
        return;
    }
    if (!editingSlide.value && !form.imageFile) {
        showToast('Gambar wajib diunggah.', 'error');
        return;
    }

    saving.value = true;
    const fd = buildFormData();
    if (editingSlide.value) fd.append('_method', 'PUT');

    try {
        const url = editingSlide.value ? `${API_BASE}/${editingSlide.value.id}` : API_BASE;
        const { data } = await axios.post(url, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast(data.message);
        closeForm();
        await fetchSlides();
    } catch (e) {
        showToast(parseErrorMessage(e), 'error');
    } finally {
        saving.value = false;
    }
}

async function deleteSlide(slide) {
    if (!confirm(`Hapus slide "${slide.label}"? Gambar juga akan dihapus.`)) return;
    deletingId.value = slide.id;
    try {
        const { data } = await axios.delete(`${API_BASE}/${slide.id}`);
        showToast(data.message);
        slides.value = slides.value.filter(s => s.id !== slide.id);
    } catch (e) {
        showToast(parseErrorMessage(e), 'error');
    } finally {
        deletingId.value = null;
    }
}

async function toggleActive(slide) {
    // Simpan nilai lama untuk rollback jika gagal
    const previousActive = slide.is_active;
    const idx = slides.value.findIndex(s => s.id === slide.id);

    // BUG FIX: lakukan optimistic update secara lokal dulu
    if (idx !== -1) slides.value[idx] = { ...slides.value[idx], is_active: !previousActive };

    const fd = new FormData();
    fd.append('is_active', previousActive ? '0' : '1');
    fd.append('_method', 'PUT');

    try {
        const { data } = await axios.post(`${API_BASE}/${slide.id}`, fd);
        // Sinkronkan dengan data server (source of truth)
        if (idx !== -1) slides.value[idx] = data.slide;
        showToast(data.message);
    } catch (e) {
        // BUG FIX: rollback state lokal jika request gagal
        if (idx !== -1) slides.value[idx] = { ...slides.value[idx], is_active: previousActive };
        showToast(parseErrorMessage(e), 'error');
    }
}

async function saveOrder() {
    const payload = {
        order: slides.value.map((s, i) => ({ id: s.id, order: i })),
    };
    try {
        const { data } = await axios.post(REORDER_URL, payload);
        showToast(data.message);
    } catch (e) {
        showToast(parseErrorMessage(e), 'error');
        // Reload agar urutan tampilan kembali sinkron dengan DB
        await fetchSlides();
    }
}

// ── Form helpers ──────────────────────────────────────────────────────────
function openCreate() {
    editingSlide.value = null;
    Object.assign(form, {
        label: '', heading: ['', ''], accent: 0,
        sub: '', tag: '', cta: 'Lihat Program', cta_target: 'programs',
        order: slides.value.length, is_active: true,
        imageFile: null, imagePreview: null,
    });
    showForm.value = true;
}

function openEdit(slide) {
    editingSlide.value = slide;
    Object.assign(form, {
        label: slide.label,
        heading: [...(Array.isArray(slide.heading) && slide.heading.length ? slide.heading : ['', ''])],
        accent: slide.accent ?? 0,
        sub: slide.sub,
        tag: slide.tag ?? '',
        cta: slide.cta,
        cta_target: slide.cta_target,
        order: slide.order,
        is_active: slide.is_active,
        imageFile: null,
        imagePreview: slide.image_url ?? null,
    });
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editingSlide.value = null;
}

function onImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    form.imageFile = file;
    form.imagePreview = URL.createObjectURL(file);
}

function addHeadingLine() { if (form.heading.length < 4) form.heading.push(''); }
function removeHeadingLine(i) { if (form.heading.length > 1) form.heading.splice(i, 1); }

// ── Drag-to-reorder ───────────────────────────────────────────────────────
function onDragStart(i) { dragIndex.value = i; }
function onDragEnter(i) { dragOverIndex.value = i; }
function onDrop(i) {
    if (dragIndex.value === null || dragIndex.value === i) return;
    const arr = [...slides.value];
    const [moved] = arr.splice(dragIndex.value, 1);
    arr.splice(i, 0, moved);
    slides.value = arr;
    dragIndex.value = null;
    dragOverIndex.value = null;
}
function onDragEnd() { dragIndex.value = dragOverIndex.value = null; }

onMounted(fetchSlides);
</script>

<template>
    <div class="admin-wrap">

        <!-- ── Header ───────────────────────────────────── -->
        <header class="adm-header">
            <div class="adm-header-inner">
                <div class="adm-logo">
                    <div class="logo-mark"></div>
                    <div>
                        <span class="logo-title">SMK Nusantara</span>
                        <span class="logo-sub">Admin Panel</span>
                    </div>
                </div>
                <div class="adm-header-right">
                    <span class="breadcrumb">Dashboard / <strong>Hero Slides</strong></span>
                </div>
            </div>
        </header>

        <!-- ── Main ─────────────────────────────────────── -->
        <main class="adm-main">

            <!-- Page title bar -->
            <div class="page-bar">
                <div>
                    <h1 class="page-title">Hero Slides</h1>
                    <p class="page-desc">Kelola gambar dan konten hero section halaman utama.</p>
                </div>
                <button class="btn-add" @click="openCreate">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    Tambah Slide
                </button>
            </div>

            <!-- ── Slide cards ─────────────────────────── -->
            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <span>Memuat data...</span>
            </div>

            <div v-else-if="slides.length === 0" class="empty-state">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity=".3">
                    <rect x="4" y="10" width="40" height="28" rx="3" stroke="#C9A84C" stroke-width="2" />
                    <path d="M4 18h40" stroke="#C9A84C" stroke-width="2" />
                    <circle cx="24" cy="30" r="5" stroke="#C9A84C" stroke-width="2" />
                </svg>
                <p>Belum ada slide. Klik <strong>Tambah Slide</strong> untuk memulai.</p>
            </div>

            <div v-else class="slides-grid">
                <div v-for="(slide, i) in slides" :key="slide.id" class="slide-card" :class="{
                    'drag-over': dragOverIndex === i,
                    'is-inactive': !slide.is_active,
                    'is-dragging': dragIndex === i,
                }" draggable="true" @dragstart="onDragStart(i)" @dragenter.prevent="onDragEnter(i)"
                    @dragover.prevent @drop.prevent="onDrop(i)" @dragend="onDragEnd">
                    <!-- Drag handle -->
                    <div class="drag-handle" title="Seret untuk mengubah urutan">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="6" cy="4" r="1.5" fill="currentColor" />
                            <circle cx="6" cy="8" r="1.5" fill="currentColor" />
                            <circle cx="6" cy="12" r="1.5" fill="currentColor" />
                            <circle cx="10" cy="4" r="1.5" fill="currentColor" />
                            <circle cx="10" cy="8" r="1.5" fill="currentColor" />
                            <circle cx="10" cy="12" r="1.5" fill="currentColor" />
                        </svg>
                    </div>

                    <!-- Thumb -->
                    <div class="card-thumb" :style="`background-image:url('${slide.image_url}')`">
                        <div class="card-thumb-overlay"></div>
                        <span class="card-order">#{{ i + 1 }}</span>
                        <span class="card-badge" :class="slide.is_active ? 'badge-active' : 'badge-inactive'">
                            {{ slide.is_active ? 'Aktif' : 'Nonaktif' }}
                        </span>
                    </div>

                    <!-- Info -->
                    <div class="card-body">
                        <div class="card-label">{{ slide.label }}</div>
                        <div class="card-heading">
                            <span v-for="(h, hi) in slide.heading" :key="hi"
                                :class="{ 'hd-gold': hi === slide.accent }">{{ h }} </span>
                        </div>
                        <p class="card-sub">{{ slide.sub }}</p>
                        <div class="card-meta">
                            <span class="meta-tag" v-if="slide.tag">{{ slide.tag }}</span>
                            <span class="meta-cta">{{ slide.cta }} → #{{ slide.cta_target }}</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="card-actions">
                        <button class="action-btn toggle-btn" :class="slide.is_active ? 'toggle-on' : 'toggle-off'"
                            @click="toggleActive(slide)" :title="slide.is_active ? 'Nonaktifkan' : 'Aktifkan'">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5" />
                                <path v-if="slide.is_active" d="M5 7l2 2 3-3" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path v-else d="M5 5l4 4M9 5l-4 4" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" />
                            </svg>
                            {{ slide.is_active ? 'Aktif' : 'Nonaktif' }}
                        </button>

                        <div class="action-right">
                            <button class="icon-btn edit-btn" @click="openEdit(slide)" title="Edit">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                    <path d="M10.5 2.5l2 2-8 8H2.5v-2l8-8z" stroke="currentColor" stroke-width="1.4"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <button class="icon-btn delete-btn" @click="deleteSlide(slide)"
                                :disabled="deletingId === slide.id" title="Hapus">
                                <svg v-if="deletingId !== slide.id" width="15" height="15" viewBox="0 0 15 15"
                                    fill="none">
                                    <path d="M2 4h11M5 4V2h5v2M6 7v4M9 7v4M3 4l1 9h7l1-9H3z" stroke="currentColor"
                                        stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span v-else class="mini-spin"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Save order button -->
            <div v-if="slides.length > 1" class="order-save-bar">
                <p class="order-hint">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v6M4 4l3-3 3 3" stroke="#C9A84C" stroke-width="1.4" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M2 9v3h10V9" stroke="#C9A84C" stroke-width="1.4" stroke-linecap="round" />
                    </svg>
                    Seret kartu untuk mengubah urutan tampilan
                </p>
                <button class="btn-save-order" @click="saveOrder">Simpan Urutan</button>
            </div>

        </main>

        <!-- ── Slide-over Form ──────────────────────────── -->
        <Transition name="overlay">
            <div v-if="showForm" class="overlay" @click.self="closeForm"></div>
        </Transition>
        <Transition name="drawer">
            <aside v-if="showForm" class="drawer">
                <div class="drawer-header">
                    <h2 class="drawer-title">{{ formTitle }}</h2>
                    <button class="close-btn" @click="closeForm">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.6"
                                stroke-linecap="round" />
                        </svg>
                    </button>
                </div>

                <div class="drawer-body">

                    <!-- Image upload -->
                    <div class="field-group">
                        <label class="field-label">Gambar Slide <span class="req">*</span></label>
                        <div class="upload-zone" :class="{ 'has-preview': form.imagePreview }"
                            @click="$refs.fileInput.click()">
                            <img v-if="form.imagePreview" :src="form.imagePreview" class="preview-img" alt="preview" />
                            <div v-else class="upload-placeholder">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <rect x="2" y="6" width="24" height="16" rx="2" stroke="#C9A84C" stroke-width="1.5"
                                        stroke-dasharray="4 3" />
                                    <circle cx="10" cy="12" r="2" stroke="#C9A84C" stroke-width="1.5" />
                                    <path d="M2 19l6-5 4 4 4-3 6 4" stroke="#C9A84C" stroke-width="1.5"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>Klik untuk pilih gambar</span>
                                <span class="upload-hint">JPG, PNG, WebP · Maks 4 MB · Rekomendasi 1400×800 px</span>
                            </div>
                            <div v-if="form.imagePreview" class="preview-change">Ganti Gambar</div>
                        </div>
                        <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" class="hidden-input"
                            @change="onImageChange" />
                    </div>

                    <!-- Label -->
                    <div class="field-group">
                        <label class="field-label">Label <span class="req">*</span></label>
                        <input v-model="form.label" class="field-input" placeholder="e.g. Program Unggulan" />
                    </div>

                    <!-- Heading lines -->
                    <div class="field-group">
                        <label class="field-label">
                            Judul Slide
                            <span class="field-hint">Setiap baris = satu baris judul</span>
                        </label>
                        <div class="heading-lines">
                            <div v-for="(_, i) in form.heading" :key="i" class="heading-line-row">
                                <span class="line-num">{{ i + 1 }}</span>
                                <input v-model="form.heading[i]" class="field-input" :placeholder="`Baris ${i + 1}`" />
                                <button class="line-remove" @click="removeHeadingLine(i)"
                                    :disabled="form.heading.length <= 1" title="Hapus baris">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 7h8" stroke="currentColor" stroke-width="1.5"
                                            stroke-linecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button class="btn-add-line" @click="addHeadingLine" :disabled="form.heading.length >= 4">
                            + Tambah Baris
                        </button>
                    </div>

                    <!-- Accent line -->
                    <div class="field-group">
                        <label class="field-label">
                            Baris Emas (gold)
                            <span class="field-hint">Indeks baris yang diwarnai emas (mulai dari 0)</span>
                        </label>
                        <div class="accent-pills">
                            <button v-for="(_, i) in form.heading" :key="i"
                                :class="['accent-pill', { active: form.accent === i }]" @click="form.accent = i">
                                Baris {{ i + 1 }}
                            </button>
                        </div>
                    </div>

                    <!-- Sub / description -->
                    <div class="field-group">
                        <label class="field-label">Deskripsi <span class="req">*</span></label>
                        <textarea v-model="form.sub" class="field-input field-textarea"
                            placeholder="Tuliskan deskripsi singkat slide..."></textarea>
                    </div>

                    <!-- Tag -->
                    <div class="field-group">
                        <label class="field-label">Tag / Badge</label>
                        <input v-model="form.tag" class="field-input" placeholder="e.g. Pendaftaran 2025/2026 Dibuka" />
                    </div>

                    <!-- CTA -->
                    <div class="field-row">
                        <div class="field-group">
                            <label class="field-label">Teks Tombol</label>
                            <input v-model="form.cta" class="field-input" placeholder="e.g. Lihat Program" />
                        </div>
                        <div class="field-group">
                            <label class="field-label">Target Scroll</label>
                            <select v-model="form.cta_target" class="field-input field-select">
                                <option v-for="t in ctaTargets" :key="t" :value="t">#{{ t }}</option>
                            </select>
                        </div>
                    </div>

                    <!-- Order + Active -->
                    <div class="field-row">
                        <div class="field-group">
                            <label class="field-label">Urutan</label>
                            <input v-model.number="form.order" type="number" min="0" class="field-input"
                                placeholder="0" />
                        </div>
                        <div class="field-group field-toggle-group">
                            <label class="field-label">Status</label>
                            <button :class="['toggle-switch', { on: form.is_active }]"
                                @click="form.is_active = !form.is_active">
                                <span class="toggle-knob"></span>
                                <span class="toggle-text">{{ form.is_active ? 'Aktif' : 'Nonaktif' }}</span>
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Footer -->
                <div class="drawer-footer">
                    <button class="btn-cancel" @click="closeForm">Batal</button>
                    <button class="btn-save" @click="saveSlide" :disabled="saving">
                        <span v-if="saving" class="mini-spin white"></span>
                        <span v-else>{{ editingSlide ? 'Simpan Perubahan' : 'Tambahkan Slide' }}</span>
                    </button>
                </div>
            </aside>
        </Transition>

        <!-- ── Toast ───────────────────────────────────── -->
        <Transition name="toast">
            <div v-if="toast" :class="['toast', `toast-${toast.type}`]">
                <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 5v4M8 11v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5" />
                </svg>
                {{ toast.message }}
            </div>
        </Transition>

    </div>
</template>

<style scoped>
/* ── Reset / Base ─────────────────────────────────────────────────────── */
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

button {
    cursor: pointer;
    font-family: inherit;
    border: none;
}

input,
textarea,
select {
    font-family: inherit;
}

.admin-wrap {
    min-height: 100vh;
    background: #06101e;
    color: #e2e8f0;
    font-family: 'Inter', 'DM Sans', system-ui, sans-serif;
    font-size: 14px;
}

/* ── Header ──────────────────────────────────────────────────────────── */
.adm-header {
    background: rgba(3, 11, 24, 0.95);
    border-bottom: 1px solid rgba(201, 168, 76, 0.12);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 40;
}

.adm-header-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.adm-logo {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-mark {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #C9A84C, #e8c96b);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.logo-title {
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #fff;
}

.logo-sub {
    display: block;
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(201, 168, 76, 0.5);
}

.breadcrumb {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.3);
}

.breadcrumb strong {
    color: rgba(201, 168, 76, 0.7);
}

/* ── Main ────────────────────────────────────────────────────────────── */
.adm-main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2.5rem 2rem 5rem;
}

/* ── Page bar ─────────────────────────────────────────────────────────── */
.page-bar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
}

.page-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
}

.page-desc {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.35);
    margin-top: 4px;
}

.btn-add {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #C9A84C;
    color: #060f1e;
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.6rem 1.25rem;
    transition: filter 0.2s, transform 0.15s;
}

.btn-add:hover {
    filter: brightness(1.12);
    transform: translateY(-1px);
}

/* ── Loading / Empty ─────────────────────────────────────────────────── */
.loading-state,
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 280px;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.85rem;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 2px solid rgba(201, 168, 76, 0.2);
    border-top-color: #C9A84C;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* ── Slides grid ─────────────────────────────────────────────────────── */
.slides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.25rem;
}

.slide-card {
    background: rgba(3, 14, 28, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition: border-color 0.2s, transform 0.15s;
    position: relative;
    cursor: grab;
}

.slide-card:hover {
    border-color: rgba(201, 168, 76, 0.18);
}

.slide-card.drag-over {
    border-color: #C9A84C;
    transform: scale(1.02);
}

.slide-card.is-dragging {
    opacity: 0.4;
}

.slide-card.is-inactive {
    opacity: 0.55;
}

.drag-handle {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    color: rgba(255, 255, 255, 0.25);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    cursor: grab;
}

.drag-handle:hover {
    color: #C9A84C;
    background: rgba(201, 168, 76, 0.1);
}

.card-thumb {
    height: 180px;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
}

.card-thumb-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(3, 11, 24, 0.85) 0%, transparent 60%);
}

.card-order {
    position: absolute;
    bottom: 8px;
    left: 10px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
}

.card-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 8px;
}

.badge-active {
    background: rgba(34, 197, 94, 0.15);
    color: #4ade80;
    border: 1px solid rgba(34, 197, 94, 0.25);
}

.badge-inactive {
    background: rgba(100, 116, 139, 0.15);
    color: #94a3b8;
    border: 1px solid rgba(100, 116, 139, 0.2);
}

.card-body {
    padding: 1rem 1.1rem 0.75rem;
}

.card-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(201, 168, 76, 0.6);
    margin-bottom: 6px;
}

.card-heading {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.25;
    margin-bottom: 8px;
}

.hd-gold {
    color: #C9A84C;
    font-style: italic;
}

.card-sub {
    font-size: 0.74rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.35);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 10px;
}

.card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.meta-tag {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 2px 8px;
    background: rgba(201, 168, 76, 0.08);
    border: 1px solid rgba(201, 168, 76, 0.18);
    color: rgba(201, 168, 76, 0.7);
}

.meta-cta {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.2);
    padding: 2px 6px;
    background: rgba(255, 255, 255, 0.04);
}

.card-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 1.1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    gap: 8px;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 5px 10px;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.toggle-on {
    background: rgba(34, 197, 94, 0.08);
    color: #4ade80;
    border-color: rgba(34, 197, 94, 0.2);
}

.toggle-off {
    background: rgba(100, 116, 139, 0.08);
    color: #64748b;
    border-color: rgba(100, 116, 139, 0.15);
}

.action-btn:hover {
    filter: brightness(1.2);
}

.action-right {
    display: flex;
    gap: 6px;
}

.icon-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.35);
    transition: all 0.2s;
}

.edit-btn:hover {
    border-color: rgba(201, 168, 76, 0.3);
    color: #C9A84C;
    background: rgba(201, 168, 76, 0.07);
}

.delete-btn:hover {
    border-color: rgba(239, 68, 68, 0.3);
    color: #f87171;
    background: rgba(239, 68, 68, 0.07);
}

.icon-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* ── Order save bar ──────────────────────────────────────────────────── */
.order-save-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5rem;
    padding: 0.9rem 1.25rem;
    background: rgba(201, 168, 76, 0.05);
    border: 1px solid rgba(201, 168, 76, 0.12);
    gap: 1rem;
    flex-wrap: wrap;
}

.order-hint {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    color: rgba(201, 168, 76, 0.6);
}

.btn-save-order {
    background: transparent;
    border: 1px solid rgba(201, 168, 76, 0.35);
    color: #C9A84C;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.5rem 1.1rem;
    transition: all 0.2s;
}

.btn-save-order:hover {
    background: rgba(201, 168, 76, 0.1);
}

/* ── Drawer ───────────────────────────────────────────────────────────── */
.overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(2, 7, 18, 0.7);
    backdrop-filter: blur(4px);
}

.drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(520px, 100vw);
    z-index: 51;
    background: #060f1e;
    border-left: 1px solid rgba(201, 168, 76, 0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
}

.drawer-title {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
}

.close-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.07);
    transition: all 0.2s;
}

.close-btn:hover {
    color: #C9A84C;
    border-color: rgba(201, 168, 76, 0.3);
}

.drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.drawer-body::-webkit-scrollbar {
    width: 4px;
}

.drawer-body::-webkit-scrollbar-track {
    background: transparent;
}

.drawer-body::-webkit-scrollbar-thumb {
    background: rgba(201, 168, 76, 0.2);
    border-radius: 2px;
}

.drawer-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
}

/* ── Form fields ─────────────────────────────────────────────────────── */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.field-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
    display: flex;
    align-items: center;
    gap: 8px;
}

.field-hint {
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    color: rgba(255, 255, 255, 0.2);
    font-size: 0.65rem;
}

.req {
    color: #f87171;
}

.field-input {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.09);
    color: #e2e8f0;
    font-size: 0.82rem;
    padding: 0.6rem 0.85rem;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
}

.field-input:focus {
    border-color: rgba(201, 168, 76, 0.4);
}

.field-textarea {
    resize: vertical;
    min-height: 80px;
}

.field-select {
    appearance: none;
    cursor: pointer;
}

/* Upload zone */
.upload-zone {
    border: 1.5px dashed rgba(201, 168, 76, 0.25);
    background: rgba(201, 168, 76, 0.03);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
    overflow: hidden;
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-zone:hover {
    border-color: rgba(201, 168, 76, 0.5);
    background: rgba(201, 168, 76, 0.06);
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.78rem;
}

.upload-hint {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.2);
}

.preview-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
}

.preview-change {
    position: absolute;
    inset: 0;
    background: rgba(2, 9, 20, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #C9A84C;
    opacity: 0;
    transition: opacity 0.2s;
}

.upload-zone.has-preview:hover .preview-change {
    opacity: 1;
}

.hidden-input {
    display: none;
}

/* Heading lines */
.heading-lines {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.heading-line-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.line-num {
    width: 20px;
    height: 20px;
    background: rgba(201, 168, 76, 0.1);
    color: rgba(201, 168, 76, 0.6);
    font-size: 0.65rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.line-remove {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(239, 68, 68, 0.07);
    border: 1px solid rgba(239, 68, 68, 0.15);
    color: rgba(239, 68, 68, 0.5);
    transition: all 0.2s;
}

.line-remove:hover:not(:disabled) {
    color: #f87171;
    border-color: rgba(239, 68, 68, 0.35);
}

.line-remove:disabled {
    opacity: 0.25;
    cursor: not-allowed;
}

.btn-add-line {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: rgba(201, 168, 76, 0.6);
    background: none;
    border: none;
    padding: 4px 0;
    align-self: flex-start;
    transition: color 0.2s;
}

.btn-add-line:hover:not(:disabled) {
    color: #C9A84C;
}

.btn-add-line:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

/* Accent pills */
.accent-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.accent-pill {
    padding: 4px 12px;
    font-size: 0.68rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.3);
    transition: all 0.2s;
}

.accent-pill.active {
    background: rgba(201, 168, 76, 0.12);
    border-color: rgba(201, 168, 76, 0.4);
    color: #C9A84C;
}

.accent-pill:hover:not(.active) {
    border-color: rgba(201, 168, 76, 0.2);
    color: rgba(201, 168, 76, 0.5);
}

/* Toggle switch */
.field-toggle-group {
    justify-content: flex-start;
}

.toggle-switch {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 6px 12px 6px 6px;
    transition: all 0.3s;
    cursor: pointer;
}

.toggle-switch.on {
    background: rgba(34, 197, 94, 0.08);
    border-color: rgba(34, 197, 94, 0.25);
}

.toggle-knob {
    width: 28px;
    height: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    position: relative;
    transition: background 0.3s;
}

.toggle-switch.on .toggle-knob {
    background: #22c55e;
}

.toggle-knob::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.3s;
}

.toggle-switch.on .toggle-knob::after {
    transform: translateX(12px);
}

.toggle-text {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
}

.toggle-switch.on .toggle-text {
    color: #4ade80;
}

/* Buttons */
.btn-cancel {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 0.6rem 1.25rem;
    transition: all 0.2s;
}

.btn-cancel:hover {
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.7);
}

.btn-save {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #C9A84C;
    color: #060f1e;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.6rem 1.5rem;
    transition: filter 0.2s, transform 0.15s;
    min-width: 120px;
    justify-content: center;
}

.btn-save:hover:not(:disabled) {
    filter: brightness(1.1);
}

.btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Spinners */
.mini-spin {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(6, 15, 30, 0.3);
    border-top-color: #060f1e;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

.mini-spin.white {
    border-color: rgba(255, 255, 255, 0.2);
    border-top-color: #fff;
}

/* ── Toast ───────────────────────────────────────────────────────────── */
.toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.75rem 1.25rem;
    font-size: 0.78rem;
    font-weight: 600;
    min-width: 220px;
}

.toast-success {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.25);
    color: #4ade80;
}

.toast-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.25);
    color: #f87171;
}

/* ── Transitions ─────────────────────────────────────────────────────── */
.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.drawer-enter-from,
.drawer-leave-to {
    transform: translateX(100%);
}

.toast-enter-active,
.toast-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.toast-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(16px);
}

/* ── Animations ──────────────────────────────────────────────────────── */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Responsive ──────────────────────────────────────────────────────── */
@media (max-width: 640px) {
    .adm-main {
        padding: 1.5rem 1rem 4rem;
    }

    .slides-grid {
        grid-template-columns: 1fr;
    }

    .field-row {
        grid-template-columns: 1fr;
    }

    .page-bar {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>