<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import { useTenant } from '@/Composables/useTenant.js'

const props = defineProps({
    guru: Array, // menerima list guru dari controller
})

/* ─── Tenant (product_type) ─────────────────────────────── */
const { isWorkspace } = useTenant()

/* ─── Label kondisional per product_type ────────────────── */
const t = computed(() => isWorkspace.value ? {
    pageTitle: 'Add Department',
    heading: 'Add Department Data',
    itemNameLabel: 'Department Name',
    itemNamePlaceholder: 'Enter department name...',
    personLabel: 'Department Manager',
    personPlaceholder: '-- select manager --',
} : {
    pageTitle: 'Add Subject',
    heading: 'Add Subject Data',
    itemNameLabel: 'Subject Name',
    itemNamePlaceholder: 'Enter subject name...',
    personLabel: 'Subject Teacher',
    personPlaceholder: '-- select teacher --',
})

const form = useForm({
    mapel: '',
    guru_id: '', // tambahkan ini
})

const submit = () => {
    form.post(route('admin.mapel.store'))
}
</script>

<template>

    <Head :title="t.pageTitle" />

    <MenuLayout>
        <div class="max-w-3xl mx-auto sm:p-6">
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ t.heading }}</h1>

                <form @submit.prevent="submit" class="space-y-5">

                    <!-- Subject Name -->
                    <div>
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{{
                            t.itemNameLabel }}</label>
                        <input v-model="form.mapel" type="text" :placeholder="t.itemNamePlaceholder"
                            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required />
                        <div v-if="form.errors.mapel" class="text-red-600 text-sm mt-1">
                            {{ form.errors.mapel }}
                        </div>
                    </div>

                    <!-- Subject Teacher -->
                    <div>
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{{
                            t.personLabel }}</label>
                        <select v-model="form.guru_id"
                            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            required>
                            <option value="">{{ t.personPlaceholder }}</option>
                            <option v-for="g in props.guru" :key="g.id" :value="g.id">{{ g.nama_lengkap }}</option>
                        </select>
                        <div v-if="form.errors.guru_id" class="text-red-600 text-sm mt-1">
                            {{ form.errors.guru_id }}
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end gap-3 pt-4">
                        <Link :href="route('admin.mapel.index')"
                            class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            Cancel
                        </Link>

                        <button type="submit" :disabled="form.processing"
                            class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </MenuLayout>
</template>

<style scoped>
/* Optional: smooth shadow & hover for better UI feel */
input:focus,
select:focus {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}
</style>