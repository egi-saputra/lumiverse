<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { useForm, Head, Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import { useTenant } from '@/Composables/useTenant.js'

const props = defineProps({
    kelas: Array,
    kejuruan: Array,
    isSmk: Boolean,
})

/* ─── Tenant (product_type) ─────────────────────────────── */
const { isWorkspace } = useTenant()

/* ─── Label kondisional per product_type ────────────────── */
const t = computed(() => isWorkspace.value ? {
    pageTitle: 'Register Employee',
    heading: 'Employee Registration',
    idPrimaryLabel: 'Employee ID',
    idSecondaryLabel: 'Secondary Employee ID',
    groupLabel: 'Team / Division',
    groupPlaceholder: '-- Choose the team / division --',
} : {
    pageTitle: 'Register Siswa',
    heading: 'Registrasi Siswa',
    idPrimaryLabel: 'NIS (10 digit)',
    idSecondaryLabel: 'NISN (10 digit)',
    groupLabel: 'Class Unit',
    groupPlaceholder: '-- Choose the class --',
})

const form = useForm({
    nama_lengkap: '',
    nis: '',
    nisn: '',
    kelas_id: '',
    kejuruan_id: '',
})

const submit = () => {
    form.post(route('admin.siswa.store'))
}
</script>

<template>

    <Head :title="t.pageTitle" />

    <MenuLayout>
        <div class="bg-white rounded-lg shadow p-6">
            <h1 class="text-xl font-semibold mb-6">{{ t.heading }}</h1>

            <form @submit.prevent="submit" class="space-y-4">
                <!-- Nama Lengkap -->
                <div>
                    <label class="block text-sm font-medium mb-1">Nama Lengkap</label>
                    <input v-model="form.nama_lengkap" type="text" class="w-full rounded-lg border-gray-300" />
                    <div v-if="form.errors.nama_lengkap" class="text-red-500 text-sm">
                        {{ form.errors.nama_lengkap }}
                    </div>
                </div>

                <!-- NIS -->
                <div>
                    <label class="block text-sm font-medium mb-1">{{ t.idPrimaryLabel }}</label>
                    <input v-model="form.nis" type="text" maxlength="10" class="w-full rounded-lg border-gray-300" />
                    <div v-if="form.errors.nis" class="text-red-500 text-sm">
                        {{ form.errors.nis }}
                    </div>
                </div>

                <!-- NISN -->
                <div>
                    <label class="block text-sm font-medium mb-1">{{ t.idSecondaryLabel }}</label>
                    <input v-model="form.nisn" type="text" maxlength="10" class="w-full rounded-lg border-gray-300" />
                    <div v-if="form.errors.nisn" class="text-red-500 text-sm">
                        {{ form.errors.nisn }}
                    </div>
                </div>

                <!-- Kelas -->
                <div>
                    <label class="block text-sm font-medium mb-1">{{ t.groupLabel }}</label>
                    <select v-model="form.kelas_id" class="w-full rounded-lg border-gray-300">
                        <option value="">{{ t.groupPlaceholder }}</option>
                        <option v-for="k in kelas" :key="k.id" :value="k.id">
                            {{ k.kelas }}
                        </option>
                    </select>
                    <div v-if="form.errors.kelas_id" class="text-red-500 text-sm">
                        {{ form.errors.kelas_id }}
                    </div>
                </div>

                <!-- Kejuruan (hanya untuk tenant SMK) -->
                <div v-if="isSmk && !isWorkspace">
                    <label class="block text-sm font-medium mb-1">Vocational</label>
                    <select v-model="form.kejuruan_id" class="w-full rounded-lg border-gray-300">
                        <option value="">-- Choose a vocation --</option>
                        <option v-for="k in kejuruan" :key="k.id" :value="k.id">
                            {{ k.kejuruan }}
                        </option>
                    </select>
                    <div v-if="form.errors.kejuruan_id" class="text-red-500 text-sm">
                        {{ form.errors.kejuruan_id }}
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex justify-end gap-2 pt-4">
                    <Link :href="route('admin.siswa.index')" class="px-4 py-2 rounded-lg border">
                        Cancel
                    </Link>
                    <button type="submit" class="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                        :disabled="form.processing">
                        Save
                    </button>
                </div>
            </form>
        </div>
    </MenuLayout>
</template>