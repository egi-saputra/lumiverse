<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3'
import { computed } from 'vue'

// Props dari controller
const props = defineProps({
    guru: Array
})

const form = useForm({
    kejuruan: '',
    guru_id: ''
})

const submit = () => {
    form.post(route('admin.kejuruan.store'))
}
</script>

<template>

    <Head title="Add Vocational Program" />

    <MenuLayout>
        <div class="max-w-3xl mx-auto sm:p-6">

            <!-- Glassmorphism container -->
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 transition">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Vocational Program Data</h1>

                <form @submit.prevent="submit" class="space-y-4">

                    <!-- Vocational Program Name -->
                    <div>
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Program
                            Name</label>
                        <input v-model="form.kejuruan" type="text" placeholder="Enter vocational program" required
                            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                        <div v-if="form.errors.kejuruan" class="text-red-600 dark:text-red-400 text-sm mt-1">
                            {{ form.errors.kejuruan }}
                        </div>
                    </div>

                    <!-- Head of Program -->
                    <div>
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Head of
                            Program</label>
                        <select v-model="form.guru_id" required
                            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-700 50 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                            <option value="">-- Select Teacher --</option>
                            <option v-for="g in props.guru" :key="g.id" :value="g.id">{{ g.nama_lengkap }}</option>
                        </select>
                        <div v-if="form.errors.guru_id" class="text-red-600 dark:text-red-400 text-sm mt-1">
                            {{ form.errors.guru_id }}
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end gap-3 pt-4">
                        <Link :href="route('admin.kejuruan.index')" class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            Cancel
                        </Link>
                        <button type="submit"
                            class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            Save
                        </button>
                    </div>

                </form>
            </div>

        </div>
    </MenuLayout>
</template>
