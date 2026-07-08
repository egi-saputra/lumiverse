<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3'
import { computed } from 'vue'
import { useTenant } from '@/Composables/useTenant.js'

const props = defineProps({
    siswa: Object,
    kelas: Array,
    kejuruan: Array,
    isSmk: Boolean,
})

/* ─── Tenant (product_type) ─────────────────────────────── */
const { isWorkspace } = useTenant()

/* ─── Label kondisional per product_type ────────────────── */
const t = computed(() => isWorkspace.value ? {
    pageTitle: 'Edit Employee Data',
    heading: 'Edit Employee Data',
    idPrimaryLabel: 'Employee ID',
    idPrimaryPlaceholder: 'Enter Employee ID here...',
    idSecondaryLabel: 'Secondary Employee ID',
    idSecondaryPlaceholder: 'Enter Secondary Employee ID here...',
    groupLabel: 'Team / Division',
    groupPlaceholder: '-- Select Team / Division --',
    leadLabel: 'Team Lead',
} : {
    pageTitle: 'Edit Student Data',
    heading: 'Edit Student Data',
    idPrimaryLabel: 'NIS',
    idPrimaryPlaceholder: 'Enter NIS here...',
    idSecondaryLabel: 'NISN',
    idSecondaryPlaceholder: 'Enter NISN here...',
    groupLabel: 'Class Unit',
    groupPlaceholder: '-- Select Class --',
    leadLabel: 'OSIS Member',
})

const form = useForm({
    nama_lengkap: props.siswa.nama_lengkap,
    nis: props.siswa.nis,
    nisn: props.siswa.nisn,
    kelas_id: props.siswa.kelas_id,
    kejuruan_id: props.siswa.kejuruan_id,
    status: props.siswa.status,
    osis: props.siswa.osis,
})

const submit = () => {
    form.put(route('admin.siswa.update', props.siswa.id))
}
</script>

<template>

    <Head :title="t.pageTitle" />

    <MenuLayout>
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition">

            <!-- Header -->
            <div class="flex items-center gap-2 mb-6">
                <h1 class="text-xl dark:text-gray-100 font-semibold">{{ t.heading }}</h1>
            </div>

            <!-- Form -->
            <form @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <!-- Full Name -->
                <div>
                    <label class="block text-sm dark:text-gray-300 font-medium mb-1">Full Name</label>
                    <input v-model="form.nama_lengkap" type="text"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    <div v-if="form.errors.nama_lengkap" class="text-red-500 text-sm">
                        {{ form.errors.nama_lengkap }}
                    </div>
                </div>

                <!-- Status -->
                <div>
                    <label class="block text-sm dark:text-gray-300 font-medium mb-1">Account Status</label>
                    <select v-model="form.status"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                        <option value="Activated">Active</option>
                        <option value="Deactivated">Inactive</option>
                    </select>
                </div>

                <!-- NIS -->
                <div>
                    <label class="block text-sm dark:text-gray-300 font-medium mb-1">{{ t.idPrimaryLabel }}</label>
                    <input v-model="form.nis" type="text" :placeholder="t.idPrimaryPlaceholder"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    <div v-if="form.errors.nis" class="text-red-500 text-sm">
                        {{ form.errors.nis }}
                    </div>
                </div>

                <!-- NISN -->
                <div>
                    <label class="block text-sm dark:text-gray-300 font-medium mb-1">{{ t.idSecondaryLabel }}</label>
                    <input v-model="form.nisn" type="text" maxlength="10" :placeholder="t.idSecondaryPlaceholder"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    <div v-if="form.errors.nisn" class="text-red-500 text-sm">
                        {{ form.errors.nisn }}
                    </div>
                </div>

                <!-- Class Unit -->
                <div>
                    <label class="block text-sm dark:text-gray-300 font-medium mb-1">{{ t.groupLabel }}</label>
                    <select v-model="form.kelas_id"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                        <option value="">{{ t.groupPlaceholder }}</option>
                        <option v-for="k in kelas" :key="k.id" :value="k.id">
                            {{ k.kelas }}
                        </option>
                    </select>
                    <div v-if="form.errors.kelas_id" class="text-red-500 text-sm">
                        {{ form.errors.kelas_id }}
                    </div>
                </div>

                <!-- Major / Study Program (hanya untuk tenant SMK) -->
                <div v-if="isSmk && !isWorkspace">
                    <label class="block text-sm dark:text-gray-300 font-medium mb-1">Vocational Program</label>
                    <select v-model="form.kejuruan_id"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                        <option value="">-- Select Program --</option>
                        <option v-for="k in kejuruan" :key="k.id" :value="k.id">
                            {{ k.kejuruan }}
                        </option>
                    </select>
                    <div v-if="form.errors.kejuruan_id" class="text-red-500 text-sm">
                        {{ form.errors.kejuruan_id }}
                    </div>
                </div>

                <!-- OSIS -->
                <div>
                    <label class="block text-sm dark:text-gray-300 font-medium mb-1">
                        {{ t.leadLabel }}
                    </label>

                    <select v-model="form.osis" class="w-full rounded-xl border border-gray-200 dark:border-gray-700
               bg-white/60 dark:bg-gray-700/50
               px-4 py-2 text-gray-900 dark:text-white
               focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                        <option value="">-- Select --</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>

                    <div v-if="form.errors.osis" class="text-red-500 text-sm">
                        {{ form.errors.osis }}
                    </div>
                </div>

                <!-- Actions -->
                <div class="md:col-span-2 flex dark:text-gray-300 justify-end gap-2 pt-4">
                    <Link :href="route('admin.siswa.index')" class="px-4 py-2 dark:hover:bg-gray-800 rounded-lg border">
                        Cancel
                    </Link>
                    <button type="submit"
                        class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        :disabled="form.processing">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </MenuLayout>
</template>