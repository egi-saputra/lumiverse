<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import DevLayout from '@/Layouts/DevLayout.vue'

const props = defineProps({
    tenant: Object,
    plans: Array,
})

const domainForm = useForm({ domain: '' })

function addDomain() {
    domainForm.post(route('developer.tenants.domains.store', props.tenant.id), {
        preserveScroll: true,
        onSuccess: () => { domainForm.reset() },
    })
}

function removeDomain(domain) {
    if (!confirm(`Hapus domain "${domain.domain}"?`)) return
    useForm({}).delete(route('developer.tenants.domains.destroy', [props.tenant.id, domain.id]), {
        preserveScroll: true,
    })
}

const logoPreview = ref(props.tenant.logo_path)

// Hitung sisa hari dari expires_at yang ada
function daysFromNow(dateStr) {
    if (!dateStr) return 0
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
}

const form = useForm({
    name: props.tenant.name ?? '',
    contact_phone: props.tenant.contact_phone ?? '',
    institution_email: props.tenant.institution_email ?? '',
    institution_website: props.tenant.institution_website ?? '',
    address: props.tenant.address ?? '',
    plan_id: props.tenant.plan_id ?? '',
    max_users: props.tenant.max_users ?? '', // ← override manual, kosong = ikuti plan
    expires_days: daysFromNow(props.tenant.expires_at), // ← ganti expires_at ke ini
    is_active: props.tenant.is_active,
    logo: null,
    _method: 'PUT',
})

// Label preview tanggal hasil konversi
const expiresPreview = computed(() => {
    if (!form.expires_days || form.expires_days === 0) return 'Tidak terbatas (unlimited)'
    const date = new Date()
    date.setDate(date.getDate() + Number(form.expires_days))
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})

// Label preview kuota — kalau kosong, kuota mengikuti max_users bawaan plan
const maxUsersPreview = computed(() => {
    if (form.max_users !== '' && form.max_users !== null && form.max_users !== undefined) {
        return `${form.max_users} pengguna (override manual)`
    }
    if (props.tenant.plan_max_users) {
        return `Mengikuti plan: ${props.tenant.plan_max_users} pengguna`
    }
    return 'Mengikuti plan: tidak terbatas'
})

function onLogoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
}

function submit() {
    form.post(route('developer.tenants.update', props.tenant.id), {
        forceFormData: true,
        preserveScroll: true,
    })
}
</script>

<template>

    <Head :title="`Edit — ${tenant.name}`" />
    <DevLayout>
        <div class="mx-auto px-6 py-8">

            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 text-xs text-[var(--muted)] mb-6">
                <Link :href="route('developer.tenants.index')" class="hover:text-white transition">Tenant</Link>
                <span>/</span>
                <Link :href="route('developer.tenants.show', tenant.id)" class="hover:text-white transition">{{
                    tenant.name }}</Link>
                <span>/</span>
                <span class="text-white">Edit</span>
            </div>

            <h1 class="text-xl font-extrabold mb-6">Edit Tenant</h1>

            <form @submit.prevent="submit" class="space-y-5">

                <!-- Logo -->
                <div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5">
                    <label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block mb-3">Logo
                        Lembaga</label>
                    <div class="flex items-center gap-4">
                        <img v-if="logoPreview" :src="logoPreview"
                            class="w-16 h-16 rounded-xl object-cover border border-[var(--border)]" />
                        <div v-else
                            class="w-16 h-16 rounded-xl border border-dashed border-[var(--border)] bg-white/3 flex items-center justify-center text-[var(--muted)] text-xs">
                            No logo
                        </div>
                        <div>
                            <input type="file" id="logo" accept="image/*" class="hidden" @change="onLogoChange" />
                            <label for="logo"
                                class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white cursor-pointer transition">
                                Ganti Logo
                            </label>
                            <p class="text-xs text-[var(--muted)] mt-1.5">JPG/PNG/WebP, maks 15MB</p>
                        </div>
                    </div>
                    <p v-if="form.errors.logo" class="text-xs text-rose-400 mt-2">{{ form.errors.logo }}</p>
                </div>

                <!-- Info utama -->
                <div
                    class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="sm:col-span-2 flex flex-col gap-1.5">
                        <label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Nama Lembaga <span
                                class="text-rose-400">*</span></label>
                        <input v-model="form.name"
                            class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" />
                        <p v-if="form.errors.name" class="text-xs text-rose-400">{{ form.errors.name }}</p>
                    </div>

                    <!-- Domain -->
                    <div class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5">
                        <p class="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">Domain</p>

                        <div class="flex flex-wrap gap-2 mb-4" v-if="tenant.domains?.length">
                            <div v-for="d in tenant.domains" :key="d.id"
                                class="flex items-center gap-2 font-mono text-xs bg-[var(--cyan)]/8 text-[var(--cyan)] pl-2.5 pr-1.5 py-1 rounded-lg">
                                {{ d.domain }}
                                <button type="button" @click="removeDomain(d)"
                                    class="text-[var(--muted)] hover:text-rose-400 transition px-1"
                                    title="Hapus domain">
                                    ✕
                                </button>
                            </div>
                        </div>
                        <p v-else class="text-xs text-[var(--muted)] mb-4">Belum ada domain terdaftar.</p>

                        <div class="flex gap-2">
                            <input v-model="domainForm.domain" placeholder="contoh: smpislamnusantara.id"
                                class="flex-1 px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                                @keyup.enter="addDomain" />
                            <button type="button" @click="addDomain"
                                :disabled="domainForm.processing || !domainForm.domain"
                                class="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                Tambah
                            </button>
                        </div>
                        <p v-if="domainForm.errors.domain" class="text-xs text-rose-400 mt-2">{{
                            domainForm.errors.domain }}</p>
                        <p class="text-xs text-[var(--muted)] mt-2">
                            Tambahkan hanya setelah CNAME & SSL di Cloudflare for SaaS sudah aktif — domain langsung
                            live begitu ditambahkan di sini.
                        </p>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Telepon</label>
                        <input v-model="form.contact_phone"
                            class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" />
                        <p v-if="form.errors.contact_phone" class="text-xs text-rose-400">{{ form.errors.contact_phone
                            }}</p>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Email
                            Lembaga</label>
                        <input v-model="form.institution_email" type="email"
                            class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition" />
                        <p v-if="form.errors.institution_email" class="text-xs text-rose-400">{{
                            form.errors.institution_email }}</p>
                    </div>

                    <div class="flex flex-col gap-1.5 sm:col-span-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Website</label>
                        <input v-model="form.institution_website"
                            class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition"
                            placeholder="https://..." />
                        <p v-if="form.errors.institution_website" class="text-xs text-rose-400">{{
                            form.errors.institution_website }}</p>
                    </div>

                    <div class="flex flex-col gap-1.5 sm:col-span-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Alamat</label>
                        <textarea v-model="form.address" rows="3"
                            class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] resize-y transition" />
                        <p v-if="form.errors.address" class="text-xs text-rose-400">{{ form.errors.address }}</p>
                    </div>
                </div>

                <!-- Subscription -->
                <div
                    class="rounded-2xl border border-[var(--border)] bg-[var(--navy)] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="sm:col-span-2">
                        <p class="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">Subscription</p>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Plan</label>
                        <select v-model="form.plan_id"
                            class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition">
                            <option value="">— Tanpa Plan —</option>
                            <option v-for="plan in plans" :key="plan.id" :value="plan.id">{{ plan.name }}</option>
                        </select>
                        <p v-if="form.errors.plan_id" class="text-xs text-rose-400">{{ form.errors.plan_id }}</p>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                            Durasi Akses (hari)
                        </label>
                        <div class="relative">
                            <input v-model.number="form.expires_days" type="number" min="0"
                                class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition pr-14" />
                            <span
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">hari</span>
                        </div>
                        <p class="text-xs" :class="form.expires_days === 0 ? 'text-amber-400' : 'text-[var(--cyan)]'">
                            → {{ expiresPreview }}
                        </p>
                        <p class="text-xs text-[var(--muted)]">0 = tidak terbatas (unlimited)</p>
                        <p v-if="form.errors.expires_days" class="text-xs text-rose-400">{{ form.errors.expires_days }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                            Maksimal Pengguna (override)
                        </label>
                        <div class="relative">
                            <input v-model.number="form.max_users" type="number" min="1"
                                placeholder="Kosongkan untuk ikuti plan"
                                class="w-full px-3 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--cyan)] transition pr-16" />
                            <span
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">akun</span>
                        </div>
                        <p class="text-xs" :class="form.max_users ? 'text-[var(--cyan)]' : 'text-[var(--muted)]'">
                            → {{ maxUsersPreview }}
                        </p>
                        <p class="text-xs text-[var(--muted)]">Kosongkan untuk memakai kuota bawaan plan yang dipilih.
                        </p>
                        <p v-if="form.errors.max_users" class="text-xs text-rose-400">{{ form.errors.max_users }}</p>
                    </div>

                    <div class="sm:col-span-2">
                        <label class="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" v-model="form.is_active"
                                class="w-4 h-4 cursor-pointer accent-[var(--cyan)]" />
                            <span>Tenant aktif</span>
                        </label>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-2">
                    <Link :href="route('developer.tenants.show', tenant.id)"
                        class="px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20 transition">
                        Batal
                    </Link>
                    <button type="submit" :disabled="form.processing"
                        class="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--cyan)] text-[#0a0f1e] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        {{ form.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </button>
                </div>
            </form>
        </div>
    </DevLayout>
</template>