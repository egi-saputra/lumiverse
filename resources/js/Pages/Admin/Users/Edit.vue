<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { EyeIcon, EyeSlashIcon, XMarkIcon, CheckCircleIcon, ArrowPathIcon, } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const props = defineProps({
    user: Object,
})

const page = usePage()
const roles = page.props.roles
const showPassword = ref(false)

const form = useForm({
    name: props.user.name,
    email: props.user.email,
    role: props.user.role,
    password: '',
})

const submit = () => {
    form.put(route('admin.users.update', props.user.id), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset('password')
            showPassword.value = false
        },
    })
}
</script>

<template>

    <Head title="Edit User" />

    <MenuLayout>
        <div
            class="max-w-3xl mx-auto p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-xl transition">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Profile Settings</h1>
            </div>

            <!-- Form -->
            <form @submit.prevent="submit" class="space-y-6">
                <!-- Username -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
                    <input type="text" v-model="form.name"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" />
                    <div v-if="form.errors.name" class="text-red-600 text-sm mt-1">{{ form.errors.name }}</div>
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                    <input type="email" v-model="form.email"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" />
                    <div v-if="form.errors.email" class="text-red-600 text-sm mt-1">{{ form.errors.email }}</div>
                </div>

                <!-- Role -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role User</label>
                    <select v-model="form.role"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
                        <option value="" disabled>-- Select Role --</option>
                        <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
                    </select>
                    <div v-if="form.errors.role" class="text-red-600 text-sm mt-1">{{ form.errors.role }}</div>
                </div>

                <!-- Password -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password
                        (Optional)</label>
                    <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password"
                            class="w-full pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition">
                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                            <EyeSlashIcon v-else class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-row w-full justify-end gap-3 pt-4">
                    <Link :href="route('admin.users.index')"
                        class="inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        <XMarkIcon class="w-4 h-4" />
                        Cancel
                    </Link>

                    <button type="submit" :disabled="form.processing"
                        class="inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        <ArrowPathIcon v-if="form.processing" class="w-4 h-4 animate-spin" />
                        <CheckCircleIcon v-else class="w-4 h-4" />
                        <span>{{ form.processing ? 'Updating…' : 'Update' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </MenuLayout>
</template>

<style scoped>
input:focus,
select:focus {
    outline: none;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}
</style>