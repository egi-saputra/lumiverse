<script setup>
import { useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import MenuLayout from '@/Layouts/MenuLayout.vue'

const props = defineProps({
    profil: { type: Object, default: null },
})

const logoPreview = ref(
    props.profil?.file_path
        ? `/storage/${props.profil.file_path}?v=${new Date(props.profil.updated_at).getTime()}`
        : null
)

const form = useForm({
    nama_sekolah: props.profil?.nama_sekolah ?? '',
    kepala_yayasan: props.profil?.kepala_yayasan ?? '',
    kepala_sekolah: props.profil?.kepala_sekolah ?? '',
    akreditasi: props.profil?.akreditasi ?? '',
    npsn: props.profil?.npsn ?? '',
    no_izin: props.profil?.no_izin ?? '',
    nss: props.profil?.nss ?? '',
    telepon: props.profil?.telepon ?? '',
    email: props.profil?.email ?? '',
    website: props.profil?.website ?? '',
    alamat: props.profil?.alamat ?? '',
    rt: props.profil?.rt ?? '',
    rw: props.profil?.rw ?? '',
    kelurahan: props.profil?.kelurahan ?? '',
    kecamatan: props.profil?.kecamatan ?? '',
    kabupaten_kota: props.profil?.kabupaten_kota ?? '',
    provinsi: props.profil?.provinsi ?? '',
    kode_pos: props.profil?.kode_pos ?? '',
    visi: props.profil?.visi ?? '',
    misi: props.profil?.misi ?? '',
    logo: null,
})

const submitLabel = computed(() => props.profil ? 'Update Profil' : 'Simpan Profil')

function onLogoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
}

function submit() {
    form.post(route('admin.profil_sekolah.storeOrUpdate'), {
        forceFormData: true,
        preserveScroll: true,
    })
}
</script>

<template>

    <Head title="Profil Sekolah" />

    <MenuLayout>
        <div class="max-w-5xl mx-auto space-y-6">

            <!-- ── Page Header ───────────────────────────────── -->
            <div class="relative overflow-hidden rounded-2xl
                        bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800
                        dark:from-slate-800 dark:via-slate-800 dark:to-slate-900
                        border border-blue-500/30 dark:border-white/5
                        shadow-xl shadow-blue-900/20 dark:shadow-black/40
                        px-8 py-7">
                <span class="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
                <span class="absolute -bottom-10 -left-4 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

                <div class="relative flex items-center gap-5">
                    <div class="w-14 h-14 rounded-xl bg-white/10 border border-white/20
                                flex items-center justify-center shrink-0 shadow-inner">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.6"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-white tracking-tight">Data Profil Sekolah</h1>
                        <p class="mt-0.5 text-sm text-blue-200 dark:text-slate-400">
                            Kelola identitas, alamat, dan visi misi sekolah
                        </p>
                    </div>
                </div>
            </div>

            <!-- ── Flash Success ──────────────────────────────── -->
            <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2">
                <div v-if="$page.props.flash?.success" class="flex items-center gap-3 px-4 py-3
                           bg-emerald-50 dark:bg-emerald-500/10
                           border border-emerald-200 dark:border-emerald-500/30
                           text-emerald-800 dark:text-emerald-300
                           rounded-xl shadow-sm">
                    <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium">{{ $page.props.flash.success }}</span>
                </div>
            </Transition>

            <form @submit.prevent="submit" class="space-y-5">

                <!-- ── Card: Logo ─────────────────────────────── -->
                <PageCard title="Logo Sekolah" icon="photo">
                    <div class="flex flex-col sm:flex-row items-center gap-6">
                        <div class="relative shrink-0 group">
                            <div
                                class="w-28 h-28 rounded-2xl overflow-hidden
                                        border-2 border-dashed p-2
                                        border-gray-200 dark:border-slate-600
                                        bg-gray-50 dark:bg-slate-900/60
                                        flex items-center justify-center
                                        transition-colors group-hover:border-blue-400 dark:group-hover:border-blue-500">
                                <img v-if="logoPreview" :src="logoPreview" alt="Logo"
                                    class="w-full h-full object-contain" />
                                <div v-else class="flex flex-col items-center text-gray-300 dark:text-slate-600">
                                    <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 19.5h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v12a.75.75 0 00.75.75z" />
                                    </svg>
                                    <span class="text-xs mt-1.5 font-medium">No logo</span>
                                </div>
                            </div>
                            <span v-if="logoPreview" class="absolute -top-1 -right-1 w-4 h-4 rounded-full
                                       bg-emerald-500 border-2 border-white dark:border-slate-800" />
                        </div>

                        <div class="flex-1 w-full space-y-3">
                            <label class="block">
                                <span
                                    class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                                    Upload Logo Baru
                                </span>
                                <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp"
                                    @change="onLogoChange" class="block w-full text-sm text-gray-500 dark:text-slate-400
                                           file:mr-4 file:py-2.5 file:px-5
                                           file:rounded-lg file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-blue-600 file:text-white
                                           hover:file:bg-blue-700
                                           dark:file:bg-blue-500 dark:hover:file:bg-blue-600
                                           file:transition-colors file:duration-150
                                           cursor-pointer" />
                            </label>
                            <p class="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                                <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                        clip-rule="evenodd" />
                                </svg>
                                Format JPG, PNG, WebP · Maks 10MB
                            </p>
                            <p v-if="form.errors.logo" class="text-xs text-red-500 dark:text-red-400">{{
                                form.errors.logo }}</p>
                        </div>
                    </div>
                </PageCard>

                <!-- ── Card: Identitas ────────────────────────── -->
                <PageCard title="Identitas Sekolah" icon="identification">
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <FormField label="Nama Sekolah" required :error="form.errors.nama_sekolah"
                            class="md:col-span-2">
                            <input v-model="form.nama_sekolah" type="text" placeholder="Masukkan nama sekolah"
                                class="field-input" />
                        </FormField>

                        <FormField label="Nama Kepala Yayasan" :error="form.errors.kepala_yayasan">
                            <input v-model="form.kepala_yayasan" type="text" placeholder="Nama lengkap"
                                class="field-input" />
                        </FormField>

                        <FormField label="Nama Kepala Sekolah" :error="form.errors.kepala_sekolah">
                            <input v-model="form.kepala_sekolah" type="text" placeholder="Nama lengkap"
                                class="field-input" />
                        </FormField>

                        <FormField label="Akreditasi" :error="form.errors.akreditasi">
                            <input v-model="form.akreditasi" type="text" placeholder="Contoh: A / B / C"
                                class="field-input" />
                        </FormField>

                        <FormField label="NPSN" :error="form.errors.npsn">
                            <input v-model="form.npsn" type="text" placeholder="Nomor Pokok Sekolah"
                                class="field-input" />
                        </FormField>

                        <FormField label="No. Izin Operasional" :error="form.errors.no_izin">
                            <input v-model="form.no_izin" type="text" class="field-input" />
                        </FormField>

                        <FormField label="NSS" :error="form.errors.nss">
                            <input v-model="form.nss" type="text" class="field-input" />
                        </FormField>

                        <FormField label="Telepon" :error="form.errors.telepon">
                            <input v-model="form.telepon" type="text" placeholder="0xx-xxxx-xxxx" class="field-input" />
                        </FormField>

                        <FormField label="Email" :error="form.errors.email">
                            <input v-model="form.email" type="email" placeholder="sekolah@email.com"
                                class="field-input" />
                        </FormField>

                        <FormField label="Website" :error="form.errors.website">
                            <input v-model="form.website" type="text" placeholder="https://..." class="field-input" />
                        </FormField>

                    </div>
                </PageCard>

                <!-- ── Card: Alamat ───────────────────────────── -->
                <PageCard title="Alamat Sekolah" icon="map">
                    <div class="space-y-4">

                        <FormField label="Alamat Jalan" :error="form.errors.alamat">
                            <textarea v-model="form.alamat" rows="3" placeholder="Jl. nama jalan no. ..."
                                class="field-input resize-none" />
                        </FormField>

                        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <FormField label="RT" :error="form.errors.rt">
                                <input v-model="form.rt" type="text" placeholder="001" class="field-input" />
                            </FormField>
                            <FormField label="RW" :error="form.errors.rw">
                                <input v-model="form.rw" type="text" placeholder="002" class="field-input" />
                            </FormField>
                            <FormField label="Kode Pos" :error="form.errors.kode_pos" class="sm:col-span-2">
                                <input v-model="form.kode_pos" type="text" placeholder="5xxxx" class="field-input" />
                            </FormField>
                        </div>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField label="Kelurahan / Desa" :error="form.errors.kelurahan">
                                <input v-model="form.kelurahan" type="text" class="field-input" />
                            </FormField>
                            <FormField label="Kecamatan" :error="form.errors.kecamatan">
                                <input v-model="form.kecamatan" type="text" class="field-input" />
                            </FormField>
                            <FormField label="Kabupaten / Kota" :error="form.errors.kabupaten_kota">
                                <input v-model="form.kabupaten_kota" type="text" class="field-input" />
                            </FormField>
                            <FormField label="Provinsi" :error="form.errors.provinsi">
                                <input v-model="form.provinsi" type="text" class="field-input" />
                            </FormField>
                        </div>

                    </div>
                </PageCard>

                <!-- ── Card: Visi & Misi ──────────────────────── -->
                <PageCard title="Visi & Misi Sekolah" icon="academic">
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField label="Visi" :error="form.errors.visi">
                            <textarea v-model="form.visi" rows="6" placeholder="Tuliskan visi sekolah..."
                                class="field-input resize-none" />
                        </FormField>
                        <FormField label="Misi" :error="form.errors.misi">
                            <textarea v-model="form.misi" rows="6" placeholder="Tuliskan misi sekolah..."
                                class="field-input resize-none" />
                        </FormField>
                    </div>
                </PageCard>

                <!-- ── Submit ─────────────────────────────────── -->
                <div class="flex items-center justify-between pb-6
                            pt-4 border-t border-gray-200 dark:border-slate-700/60">
                    <p class="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                                clip-rule="evenodd" />
                        </svg>
                        Field bertanda * wajib diisi
                    </p>
                    <button type="submit" :disabled="form.processing" class="inline-flex items-center gap-2.5
                               px-7 py-3 rounded-xl
                               text-sm font-semibold text-white
                               bg-blue-600 hover:bg-blue-700
                               dark:bg-blue-500 dark:hover:bg-blue-600
                               shadow-lg shadow-blue-600/25 dark:shadow-blue-500/20
                               border border-blue-500/40 dark:border-blue-400/30
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               dark:focus:ring-offset-slate-900
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200 active:scale-95">
                        <svg v-if="form.processing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ form.processing ? 'Menyimpan...' : submitLabel }}
                    </button>
                </div>

            </form>
        </div>
    </MenuLayout>
</template>

<script>
import { defineComponent, h } from 'vue'

/* ── PageCard ─────────────────────────────────────────────── */
const ICONS = {
    photo: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 19.5h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v12a.75.75 0 00.75.75z',
    identification: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z',
    map: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
    academic: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
}

export const PageCard = defineComponent({
    name: 'PageCard',
    props: { title: String, icon: { type: String, default: 'photo' } },
    setup(props, { slots }) {
        return () => h('section', {
            class: [
                'bg-white dark:bg-slate-800/60',
                'border border-gray-200 dark:border-slate-700/50',
                'rounded-2xl shadow-sm overflow-hidden',
                'backdrop-blur-sm transition-colors duration-200',
            ].join(' '),
        }, [
            // Card header
            h('div', {
                class: 'flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/80 dark:bg-slate-800/40',
            }, [
                h('div', {
                    class: 'w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shrink-0',
                }, [
                    h('svg', {
                        class: 'w-4 h-4 text-blue-600 dark:text-blue-400',
                        fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', viewBox: '0 0 24 24',
                    }, [
                        h('path', {
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round',
                            d: ICONS[props.icon] ?? ICONS.photo,
                        }),
                    ]),
                ]),
                h('h2', {
                    class: 'text-sm font-bold text-gray-700 dark:text-slate-200 tracking-wide uppercase',
                }, props.title),
            ]),
            // Card body
            h('div', { class: 'p-6' }, slots.default?.()),
        ])
    },
})

/* ── FormField ────────────────────────────────────────────── */
export const FormField = defineComponent({
    name: 'FormField',
    props: { label: String, required: Boolean, error: String },
    setup(props, { slots }) {
        return () => h('div', { class: 'flex flex-col gap-1.5' }, [
            h('label', {
                class: 'text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider',
            }, [
                props.label,
                props.required ? h('span', { class: 'text-red-500 ml-0.5' }, ' *') : null,
            ]),
            slots.default?.(),
            props.error
                ? h('p', { class: 'text-xs text-red-500 dark:text-red-400 flex items-center gap-1 mt-0.5' }, [
                    h('svg', { class: 'w-3 h-3 shrink-0', fill: 'currentColor', viewBox: '0 0 20 20' }, [
                        h('path', { 'fill-rule': 'evenodd', 'clip-rule': 'evenodd', d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z' }),
                    ]),
                    props.error,
                ])
                : null,
        ])
    },
})
</script>

<style scoped>
.field-input {
    @apply w-full px-3.5 py-2.5 text-sm rounded-xl text-gray-800 dark:text-slate-200 bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 placeholder-gray-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition duration-150;
}
</style>