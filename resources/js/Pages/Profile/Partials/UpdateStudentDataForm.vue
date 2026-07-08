<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { reactive } from 'vue';

const props = defineProps({
    siswa: { type: Object, required: true },
    kelas: { type: Array, required: true },
    kejuruan: { type: Array, required: true },
    isSmk: { type: Boolean, default: false },
    status: { type: String, default: null },
})

const form = useForm({
    nama_lengkap: props.siswa.nama_lengkap ?? '',
    nis: props.siswa.nis ?? '',
    nisn: props.siswa.nisn ?? '',
    kelas_id: props.siswa.kelas_id ?? '',
    kejuruan_id: props.siswa.kejuruan_id ?? '',
})

/* ── Local (client-side) error messages ─────────────────── */
const local = reactive({ nama_lengkap: '', nis: '', nisn: '', kejuruan_id: '' })

const validate = () => {
    local.nama_lengkap = ''
    local.nis = ''
    local.nisn = ''
    local.kejuruan_id = ''

    let valid = true

    if (!form.nama_lengkap.trim()) {
        local.nama_lengkap = 'Full name is required.'
        valid = false
    }

    if (form.nis && form.nis.trim().length < 7) {
        local.nis = 'NIS must be at least 7 characters.'
        valid = false
    }

    if (form.nisn && !/^\d{10}$/.test(form.nisn)) {
        local.nisn = 'NISN must be exactly 10 digits.'
        valid = false
    }

    if (props.isSmk && !form.kejuruan_id) {
        local.kejuruan_id = 'Major is required.'
        valid = false
    }

    return valid
}

const submit = () => {
    if (!validate()) return
    form.patch(route('profile.siswa.update'), { preserveScroll: true })
}
</script>

<template>
    <section>
        <header>
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Data Induk Siswa</h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Mohon perhatikan data pelajar anda dengan baik dan teliti, karena ini akan digunakan untuk data raport
                dan data sekolah lainnya!
            </p>
        </header>

        <form @submit.prevent="submit" class="mt-6 space-y-6">

            <!-- Full Name -->
            <div>
                <InputLabel for="nama_lengkap" value="Full Name" class="dark:text-gray-300" />
                <TextInput id="nama_lengkap" type="text" v-model="form.nama_lengkap" required autocomplete="off" class="mt-1 block w-full
                           bg-white dark:bg-gray-800
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:ring-indigo-500 dark:focus:ring-indigo-400
                           dark:placeholder-gray-500" />
                <InputError class="mt-2" :message="local.nama_lengkap || form.errors.nama_lengkap" />
            </div>

            <!-- NIS -->
            <div>
                <InputLabel for="nis" value="NIS" class="dark:text-gray-300" />
                <TextInput id="nis" type="text" v-model="form.nis" autocomplete="off" class="mt-1 block w-full
                           bg-white dark:bg-gray-800
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:ring-indigo-500 dark:focus:ring-indigo-400" />
                <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Minimum 7 characters (optional)</p>
                <InputError class="mt-1" :message="local.nis || form.errors.nis" />
            </div>

            <!-- NISN -->
            <div>
                <InputLabel for="nisn" value="NISN" class="dark:text-gray-300" />
                <TextInput id="nisn" type="text" v-model="form.nisn" maxlength="10" inputmode="numeric"
                    autocomplete="off" @input="form.nisn = form.nisn.replace(/\D/g, '')" class="mt-1 block w-full
                           bg-white dark:bg-gray-800
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:ring-indigo-500 dark:focus:ring-indigo-400" />
                <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Exactly 10 digits (optional)</p>
                <InputError class="mt-1" :message="local.nisn || form.errors.nisn" />
            </div>

            <!-- Kelas -->
            <div>
                <InputLabel for="kelas_id" value="Class" class="dark:text-gray-300" />
                <select id="kelas_id" v-model="form.kelas_id" required class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition
                           bg-white dark:bg-gray-800
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                    <option value="" disabled class="dark:bg-gray-800">Select class</option>
                    <option v-for="k in kelas" :key="k.id" :value="k.id" class="dark:bg-gray-800">
                        {{ k.kelas }}
                    </option>
                </select>
                <InputError class="mt-2" :message="form.errors.kelas_id" />
            </div>

            <!-- Kejuruan (hanya untuk tenant SMK) -->
            <div v-if="isSmk">
                <InputLabel for="kejuruan_id" value="Major" class="dark:text-gray-300" />
                <select id="kejuruan_id" v-model="form.kejuruan_id" required class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition
                           bg-white dark:bg-gray-800
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                    <option value="" disabled class="dark:bg-gray-800">Select major</option>
                    <option v-for="k in kejuruan" :key="k.id" :value="k.id" class="dark:bg-gray-800">
                        {{ k.kejuruan }}
                    </option>
                </select>
                <InputError class="mt-2" :message="local.kejuruan_id || form.errors.kejuruan_id" />
            </div>

            <!-- Submit -->
            <div class="flex items-center gap-4">
                <PrimaryButton :disabled="form.processing" class="flex items-center gap-2">
                    <svg v-if="form.processing" class="animate-spin w-4 h-4 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {{ form.processing ? 'Saving...' : 'Save' }}
                </PrimaryButton>

                <Transition enter-active-class="transition ease-in-out" enter-from-class="opacity-0"
                    leave-active-class="transition ease-in-out" leave-to-class="opacity-0">
                    <p v-if="status === 'student-data-updated'" class="text-sm text-gray-600 dark:text-gray-400">
                        Saved.
                    </p>
                </Transition>
            </div>

        </form>
    </section>
</template>