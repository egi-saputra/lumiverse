<script setup>
import { Head, useForm, router } from '@inertiajs/vue3'
import { ref, computed, watch, onMounted } from 'vue'
import {
    PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon,
    Bars3Icon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
    plans: Array,
})

const localPlans = ref([...props.plans])
watch(() => props.plans, (val) => { localPlans.value = [...val] })

const showModal = ref(false)
const editingPlan = ref(null)

const form = useForm({
    key: '',
    product_type: 'school',
    name: '',
    description: '',
    price_monthly: 0,
    price_yearly: 0,
    tax: 0,
    discount: 0,
    max_users: '',
    duration_days: '',
    features: [],
    unavailable_features: [],
    badge: '',
    accent_color: '#00d4ff',
    is_highlighted: false,
    is_active: true,
    sort_order: 0,
})

const newFeature = ref('')
const newUnavailable = ref('')

function addFeature() {
    const val = newFeature.value.trim()
    if (val && !form.features.includes(val)) form.features = [...form.features, val]
    newFeature.value = ''
}
function removeFeature(i) {
    form.features = form.features.filter((_, idx) => idx !== i)
}
function addUnavailable() {
    const val = newUnavailable.value.trim()
    if (val && !form.unavailable_features.includes(val)) form.unavailable_features = [...form.unavailable_features, val]
    newUnavailable.value = ''
}
function removeUnavailable(i) {
    form.unavailable_features = form.unavailable_features.filter((_, idx) => idx !== i)
}

function openCreate() {
    editingPlan.value = null
    form.reset()
    form.product_type = 'school'
    form.tax = 0
    form.discount = 0
    form.accent_color = '#00d4ff'
    form.is_active = true
    form.sort_order = localPlans.value.length
    showModal.value = true
    newFeature.value = ''
    newUnavailable.value = ''
}

function openEdit(plan) {
    editingPlan.value = plan
    form.key = plan.key
    form.product_type = plan.product_type ?? 'school'
    form.name = plan.name
    form.description = plan.description ?? ''
    form.price_monthly = plan.price_monthly
    form.price_yearly = plan.price_yearly
    form.tax = plan.tax ?? 0
    form.discount = plan.discount ?? 0
    form.max_users = plan.max_users ?? ''
    form.duration_days = plan.duration_days ?? ''
    form.features = [...(plan.features ?? [])]
    form.unavailable_features = [...(plan.unavailable_features ?? [])]
    form.badge = plan.badge ?? ''
    form.accent_color = plan.accent_color ?? '#00d4ff'
    form.is_highlighted = plan.is_highlighted
    form.is_active = plan.is_active
    form.sort_order = plan.sort_order
    showModal.value = true
    newFeature.value = ''
    newUnavailable.value = ''
}

function closeModal() {
    showModal.value = false
    editingPlan.value = null
    form.clearErrors()
}

function submit() {
    if (editingPlan.value) {
        form.put(route('developer.plans.update', editingPlan.value.id), {
            preserveScroll: true,
            onSuccess: closeModal,
        })
    } else {
        form.post(route('developer.plans.store'), {
            preserveScroll: true,
            onSuccess: closeModal,
        })
    }
}

function confirmDelete() {
    router.delete(route('developer.plans.destroy', confirmDeleteId.value), {
        preserveScroll: true,
        onSuccess: () => { confirmDeleteId.value = null },
    })
}

const dragging = ref(null)
function onDragStart(i) { dragging.value = i }
function onDragOver(i) {
    if (dragging.value === null || dragging.value === i) return
    const arr = [...localPlans.value]
    const moved = arr.splice(dragging.value, 1)[0]
    arr.splice(i, 0, moved)
    localPlans.value = arr
    dragging.value = i
}

function onDragEnd() {
    dragging.value = null
    router.post(route('developer.plans.reorder'), {
        orders: localPlans.value.map((p, i) => ({ id: p.id, sort_order: i })),
    }, { preserveScroll: true })
}

function formatPrice(val) {
    if (!val) return 'Gratis'
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(val)
}

const planToDelete = computed(() =>
    localPlans.value.find(p => p.id === confirmDeleteId.value)
)

onMounted(() => {
    document.documentElement.classList.add('dark')
})
</script>

<template>

    <Head title="Manajemen Paket" />

    <div class="max-w-6xl mx-auto px-6 py-8">

        <!-- Header -->
        <div class="flex items-start justify-between gap-4 mb-6">
            <div>
                <h1 class="text-xl font-extrabold mb-1">Manajemen Paket / Plan</h1>
                <p class="text-sm text-[var(--muted)]">Tambah, edit, dan atur urutan paket yang ditampilkan di halaman
                    pricing.</p>
            </div>
            <button
                class="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 transition whitespace-nowrap"
                @click="openCreate">
                <PlusIcon class="w-4 h-4" /> Tambah Paket
            </button>
        </div>

        <!-- Flash -->
        <div v-if="$page.props.flash?.success"
            class="px-4 py-3 rounded-lg text-sm mb-4 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400">
            {{ $page.props.flash.success }}
        </div>
        <div v-if="$page.props.errors?.plan"
            class="px-4 py-3 rounded-lg text-sm mb-4 bg-rose-400/10 border border-rose-400/30 text-rose-400">
            {{ $page.props.errors.plan }}
        </div>

        <!-- Cards -->
        <div v-if="localPlans.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(plan, i) in localPlans" :key="plan.id" draggable="true" @dragstart="onDragStart(i)"
                @dragover.prevent="onDragOver(i)" @dragend="onDragEnd"
                class="relative flex flex-col rounded-2xl border bg-[var(--navy)] border-[var(--border)] p-5 transition"
                :class="dragging === i ? 'opacity-50 ring-1 ring-[var(--cyan)]/40' : ''">

                <!-- Drag handle -->
                <div class="absolute top-4 right-4 cursor-grab active:cursor-grabbing text-[var(--muted)]"
                    @mousedown.stop>
                    <Bars3Icon class="w-4 h-4" />
                </div>

                <!-- Top: accent + name -->
                <div class="flex items-start gap-3 pr-6">
                    <span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                        :style="{ background: plan.accent_color }" />
                    <div class="min-w-0">
                        <div class="font-bold truncate">{{ plan.name }}</div>
                        <div class="text-xs text-[var(--muted)] line-clamp-2">{{ plan.description }}</div>
                    </div>
                </div>

                <!-- Badges -->
                <div class="flex flex-wrap gap-1.5 mt-3">
                    <span
                        class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-white/10 text-[var(--muted)] whitespace-nowrap">
                        {{ plan.product_type === 'workspace' ? 'Workspace' : 'School' }}
                    </span>
                    <span v-if="plan.badge"
                        class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] whitespace-nowrap">
                        {{ plan.badge }}
                    </span>
                    <span v-if="plan.is_highlighted"
                        class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 whitespace-nowrap">
                        ★ Highlight
                    </span>
                </div>

                <!-- Key -->
                <code class="inline-block w-fit mt-3 font-mono text-xs bg-white/5 px-2 py-0.5 rounded">
                    {{ plan.key }}
                </code>

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-y-2 gap-x-3 mt-4 text-sm">
                    <div>
                        <div class="text-[0.7rem] text-[var(--muted)] uppercase tracking-wide">Bulanan</div>
                        <div class="font-semibold">{{ formatPrice(plan.price_monthly) }}</div>
                    </div>
                    <div>
                        <div class="text-[0.7rem] text-[var(--muted)] uppercase tracking-wide">Tahunan</div>
                        <div class="font-semibold">{{ formatPrice(plan.price_yearly) }}</div>
                    </div>
                    <div>
                        <div class="text-[0.7rem] text-[var(--muted)] uppercase tracking-wide">Maks. User</div>
                        <div class="font-semibold">{{ plan.max_users ? plan.max_users.toLocaleString('id-ID') : '∞' }}
                        </div>
                    </div>
                    <div>
                        <div class="text-[0.7rem] text-[var(--muted)] uppercase tracking-wide">Durasi Trial</div>
                        <div class="font-semibold">{{ plan.duration_days ? plan.duration_days + ' hari' : '—' }}</div>
                    </div>
                </div>

                <!-- Footer: status + actions -->
                <div class="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border)]">
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full" :class="plan.is_active
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : 'bg-rose-400/10 text-rose-400'">
                        {{ plan.is_active ? 'Aktif' : 'Nonaktif' }}
                    </span>
                    <div class="flex gap-1.5">
                        <button title="Edit" @click.stop="openEdit(plan)" @mousedown.stop
                            class="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 flex items-center justify-center transition">
                            <PencilSquareIcon class="w-4 h-4" />
                        </button>
                        <button title="Hapus" @click.stop="deletePlan(plan)" @mousedown.stop
                            class="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-rose-400 hover:border-rose-400/40 flex items-center justify-center transition">
                            <TrashIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else
            class="text-center text-[var(--muted)] text-sm py-16 rounded-2xl border border-[var(--border)] bg-[var(--navy)]">
            Belum ada paket. Klik "Tambah Paket" untuk mulai.
        </div>

        <p class="text-xs text-[var(--muted)] mt-3">💡 Seret kartu untuk mengubah urutan tampil di halaman pricing.</p>

        <!-- ── Create / Edit Modal ───────────────────────────────────────── -->
        <Teleport to="body">
            <div v-if="showModal"
                class="fixed inset-0 bg-black/65 flex items-center justify-center z-[999] p-4 overflow-y-auto"
                @mousedown.self="closeModal">
                <div
                    class="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border bg-[var(--navy)] border-[var(--border)]">

                    <div class="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
                        <h2 class="text-base font-extrabold">{{ editingPlan ? 'Edit Paket' : 'Tambah Paket Baru' }}</h2>
                        <button @click="closeModal"
                            class="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 flex items-center justify-center transition">
                            <XMarkIcon class="w-4 h-4" />
                        </button>
                    </div>

                    <div class="px-6 py-5 overflow-y-auto flex-1">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">

                            <!-- Nama -->
                            <div class="flex flex-col gap-1.5 sm:col-span-2">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Nama Paket <span class="text-rose-400">*</span>
                                </label>
                                <input v-model="form.name"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                    placeholder="contoh: Pro, Enterprise" />
                                <p v-if="form.errors.name" class="text-xs text-rose-400">{{ form.errors.name }}</p>
                            </div>

                            <!-- Key -->
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Key <span class="font-normal normal-case text-[0.73rem]">(auto-generate jika
                                        kosong)</span>
                                </label>
                                <input v-model="form.key" :disabled="!!editingPlan"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm font-mono outline-none focus:border-[var(--cyan)] disabled:opacity-45 disabled:cursor-not-allowed transition"
                                    placeholder="contoh: pro" />
                                <p v-if="form.errors.key" class="text-xs text-rose-400">{{ form.errors.key }}</p>
                                <p class="text-xs text-[var(--muted)]">Key dipakai di kolom tenants.plan — tidak bisa
                                    diubah setelah disimpan.</p>
                            </div>

                            <!-- Produk -->
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Produk <span class="text-rose-400">*</span>
                                </label>
                                <select v-model="form.product_type"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition">
                                    <option value="school">Lumiverse School</option>
                                    <option value="workspace">Lumiverse Workspace</option>
                                </select>
                                <p v-if="form.errors.product_type" class="text-xs text-rose-400">{{
                                    form.errors.product_type }}</p>
                            </div>

                            <!-- Badge -->
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Badge <span class="font-normal normal-case text-[0.73rem]">(opsional)</span>
                                </label>
                                <input v-model="form.badge"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                    placeholder="Paling Populer" />
                                <p v-if="form.errors.badge" class="text-xs text-rose-400">{{ form.errors.badge }}</p>
                            </div>

                            <!-- Deskripsi -->
                            <div class="flex flex-col gap-1.5 sm:col-span-2">
                                <label
                                    class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Deskripsi</label>
                                <textarea v-model="form.description" rows="2"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] resize-y min-h-[60px] transition"
                                    placeholder="Deskripsi singkat paket ini" />
                                <p v-if="form.errors.description" class="text-xs text-rose-400">{{
                                    form.errors.description }}</p>
                            </div>

                            <!-- Harga -->
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Harga Bulanan (Rp) <span class="text-rose-400">*</span>
                                </label>
                                <input v-model.number="form.price_monthly" type="number" min="0"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                    placeholder="0 = Gratis" />
                                <p v-if="form.errors.price_monthly" class="text-xs text-rose-400">{{
                                    form.errors.price_monthly }}</p>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Harga Tahunan (Rp) <span class="text-rose-400">*</span>
                                </label>
                                <input v-model.number="form.price_yearly" type="number" min="0"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                    placeholder="0 = Gratis" />
                                <p v-if="form.errors.price_yearly" class="text-xs text-rose-400">{{
                                    form.errors.price_yearly }}</p>
                            </div>

                            <!-- Tax + discount -->
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Pajak (%)
                                </label>
                                <input v-model.number="form.tax" type="number" min="0" max="100"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                    placeholder="0" />
                                <p v-if="form.errors.tax" class="text-xs text-rose-400">{{ form.errors.tax }}</p>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Diskon (%)
                                </label>
                                <input v-model.number="form.discount" type="number" min="0" max="100"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                    placeholder="0" />
                                <p v-if="form.errors.discount" class="text-xs text-rose-400">{{ form.errors.discount
                                    }}</p>
                            </div>

                            <!-- Max users + duration -->
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Maks. Pengguna <span class="font-normal normal-case text-[0.73rem]">(kosong =
                                        unlimited)</span>
                                </label>
                                <input v-model.number="form.max_users" type="number" min="1"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                    placeholder="contoh: 300" />
                                <p v-if="form.errors.max_users" class="text-xs text-rose-400">{{ form.errors.max_users
                                    }}</p>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Durasi Trial (hari) <span class="font-normal normal-case text-[0.73rem]">(kosong =
                                        tanpa batas)</span>
                                </label>
                                <input v-model.number="form.duration_days" type="number" min="1"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                    placeholder="contoh: 30" />
                                <p v-if="form.errors.duration_days" class="text-xs text-rose-400">{{
                                    form.errors.duration_days }}</p>
                            </div>

                            <!-- Accent color + sort -->
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Warna
                                    Aksen</label>
                                <div class="flex gap-2 items-center">
                                    <input v-model="form.accent_color"
                                        class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                        placeholder="#00d4ff" />
                                    <input type="color" v-model="form.accent_color"
                                        class="w-[38px] h-[38px] rounded-lg border border-[var(--border)] bg-transparent cursor-pointer p-0.5 flex-shrink-0" />
                                </div>
                                <p v-if="form.errors.accent_color" class="text-xs text-rose-400">{{
                                    form.errors.accent_color }}</p>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Sort
                                    Order</label>
                                <input v-model.number="form.sort_order" type="number" min="0"
                                    class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" />
                            </div>

                            <div class="flex flex-col gap-2 sm:col-span-2">
                                <label class="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" v-model="form.is_highlighted"
                                        class="w-4 h-4 cursor-pointer accent-[var(--cyan)]" />
                                    <span>Jadikan sebagai kartu highlight (ditonjolkan di UI)</span>
                                </label>
                                <label class="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" v-model="form.is_active"
                                        class="w-4 h-4 cursor-pointer accent-[var(--cyan)]" />
                                    <span>Paket aktif (tampil di halaman pricing)</span>
                                </label>
                            </div>

                            <!-- Features -->
                            <div class="flex flex-col gap-1.5 sm:col-span-2">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Daftar
                                    Fitur Tersedia</label>
                                <div class="flex gap-2">
                                    <input v-model="newFeature" @keydown.enter.prevent="addFeature"
                                        class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                        placeholder="Tambah fitur, tekan Enter" />
                                    <button type="button" @click="addFeature"
                                        class="w-[38px] h-[38px] rounded-lg border border-[var(--border)] bg-white/5 hover:bg-white/10 text-lg flex-shrink-0 transition">+</button>
                                </div>
                                <div class="flex flex-wrap gap-1.5 mt-1 min-h-[28px]">
                                    <span v-for="(f, i) in form.features" :key="i"
                                        class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400">
                                        {{ f }}
                                        <button @click="removeFeature(i)"
                                            class="opacity-70 hover:opacity-100 leading-none">×</button>
                                    </span>
                                    <span v-if="!form.features.length" class="text-xs text-[var(--muted)]">Belum ada
                                        fitur.</span>
                                </div>
                            </div>

                            <!-- Unavailable features -->
                            <div class="flex flex-col gap-1.5 sm:col-span-2">
                                <label class="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    Fitur Tidak Tersedia <span
                                        class="font-normal normal-case text-[0.73rem]">(ditampilkan dengan
                                        strikethrough)</span>
                                </label>
                                <div class="flex gap-2">
                                    <input v-model="newUnavailable" @keydown.enter.prevent="addUnavailable"
                                        class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                        placeholder="Tambah fitur tidak tersedia, tekan Enter" />
                                    <button type="button" @click="addUnavailable"
                                        class="w-[38px] h-[38px] rounded-lg border border-[var(--border)] bg-white/5 hover:bg-white/10 text-lg flex-shrink-0 transition">+</button>
                                </div>
                                <div class="flex flex-wrap gap-1.5 mt-1 min-h-[28px]">
                                    <span v-for="(f, i) in form.unavailable_features" :key="i"
                                        class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/5 text-[var(--muted)]">
                                        {{ f }}
                                        <button @click="removeUnavailable(i)"
                                            class="opacity-70 hover:opacity-100 leading-none">×</button>
                                    </span>
                                    <span v-if="!form.unavailable_features.length"
                                        class="text-xs text-[var(--muted)]">Kosong.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
                        <button @click="closeModal"
                            class="text-sm font-semibold px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition">
                            Batal
                        </button>
                        <button :disabled="form.processing" @click="submit"
                            class="text-sm font-bold px-4 py-2 rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            {{ form.processing ? 'Menyimpan...' : (editingPlan ? 'Simpan Perubahan' : 'Buat Paket') }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- ── Confirm Delete Modal ──────────────────────────────────────── -->
        <Teleport to="body">
            <div v-if="confirmDeleteId"
                class="fixed inset-0 bg-black/65 flex items-center justify-center z-[999] p-4 overflow-y-auto"
                @mousedown.self="confirmDeleteId = null">
                <div class="w-full max-w-md rounded-3xl border bg-[var(--navy)] border-[var(--border)]">
                    <div class="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
                        <h2 class="text-base font-extrabold">Hapus Paket?</h2>
                        <button @click="confirmDeleteId = null"
                            class="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 flex items-center justify-center transition">
                            <XMarkIcon class="w-4 h-4" />
                        </button>
                    </div>
                    <div class="px-6 py-5">
                        <p class="text-sm">Paket <strong>{{ planToDelete?.name }}</strong> akan dihapus permanen.
                            Pastikan tidak ada tenant aktif yang menggunakan paket ini.</p>
                    </div>
                    <div class="flex justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
                        <button @click="confirmDeleteId = null"
                            class="text-sm font-semibold px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition">
                            Batal
                        </button>
                        <button @click="confirmDelete"
                            class="text-sm font-bold px-4 py-2 rounded-lg bg-rose-400 text-[#0a0f1e] hover:opacity-90 transition">
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

    </div>
</template>