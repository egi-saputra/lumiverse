<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3'

const props = defineProps({
    guru: Array,
})

const form = useForm({
    kelas: '',
    guru_id: '', // wali kelas
})

const submit = () => {
    form.post(route('admin.kelas.store'))
}
</script>

<template>

    <Head title="Add Class" />

    <MenuLayout>
        <div class="max-w-4xl mx-auto sm:p-6">

            <!-- Glassmorphism container -->
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Class</h1>

                <form @submit.prevent="submit" class="space-y-4">

                    <!-- Class Name -->
                    <div>
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Class
                            Name</label>
                        <input v-model="form.kelas" type="text" placeholder="Enter class name / unit" required
                            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                        <div v-if="form.errors.kelas" class="text-red-600 text-sm mt-1">
                            {{ form.errors.kelas }}
                        </div>
                    </div>

                    <!-- Homeroom Teacher -->
                    <div>
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Homeroom Teacher
                            (Walas)</label>
                        <select v-model="form.guru_id"
                            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700 50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            required>
                            <option value="">-- select teacher --</option>
                            <option v-for="g in guru" :key="g.id" :value="g.id">
                                {{ g.nama_lengkap }}
                            </option>
                        </select>
                        <div v-if="form.errors.guru_id" class="text-red-600 text-sm mt-1">
                            {{ form.errors.guru_id }}
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-2 pt-4">
                        <Link :href="route('admin.kelas.index')" class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            Cancel
                        </Link>
                        <button type="submit"
                            class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            :disabled="form.processing">
                            Save
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </MenuLayout>
</template>
