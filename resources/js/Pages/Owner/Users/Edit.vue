<script setup>
import OwnerLayout from '@/Layouts/OwnerLayout.vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { EyeIcon, EyeSlashIcon, XMarkIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const props = defineProps({
    user: Object,
    roleOptions: Array,
    isSelf: Boolean,
})

const showPassword = ref(false)

const form = useForm({
    name: props.user.name,
    email: props.user.email,
    phone: props.user.phone ?? '',
    role: props.user.role,
    password: '',
    password_confirmation: '',
})

const submit = () => {
    form.put(route('owner.users.update', props.user.id), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset('password', 'password_confirmation')
            showPassword.value = false
        },
    })
}
</script>

<template>

    <Head title="Edit Pengguna" />

    <OwnerLayout>
        <template #header>
            <h1 class="topbar-title">Edit Pengguna</h1>
        </template>

        <div
            class="max-w-3xl mx-auto p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-xl transition">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan Profil Pengguna</h1>
            </div>

            <div v-if="isSelf"
                class="mb-6 rounded-xl border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-900/40 px-4 py-3 text-sm text-sky-700 dark:text-sky-300">
                Ini adalah akun Anda sendiri. Peran tidak dapat diubah dari sini.
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama</label>
                    <input type="text" v-model="form.name"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" />
                    <div v-if="form.errors.name" class="text-red-600 text-sm mt-1">{{ form.errors.name }}</div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Alamat Email</label>
                    <input type="email" v-model="form.email"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" />
                    <div v-if="form.errors.email" class="text-red-600 text-sm mt-1">{{ form.errors.email }}</div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Telepon <span class="font-normal text-gray-400 dark:text-gray-500">(opsional)</span>
                    </label>
                    <input type="text" v-model="form.phone" placeholder="08xxxxxxxxxx"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" />
                    <div v-if="form.errors.phone" class="text-red-600 text-sm mt-1">{{ form.errors.phone }}</div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Peran User</label>
                    <select v-model="form.role" :disabled="isSelf"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <option v-for="r in roleOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
                    </select>
                    <div v-if="form.errors.role" class="text-red-600 text-sm mt-1">{{ form.errors.role }}</div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Password Baru <span class="font-normal text-gray-400 dark:text-gray-500">(opsional)</span>
                    </label>
                    <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password"
                            class="w-full pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition">
                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                            <EyeSlashIcon v-else class="w-5 h-5" />
                        </button>
                    </div>
                    <div v-if="form.errors.password" class="text-red-600 text-sm mt-1">{{ form.errors.password }}</div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Konfirmasi Password
                        Baru</label>
                    <input :type="showPassword ? 'text' : 'password'" v-model="form.password_confirmation"
                        class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition" />
                </div>

                <div class="flex flex-row w-full justify-end gap-3 pt-4">
                    <Link :href="route('owner.users.index')"
                        class="inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        <XMarkIcon class="w-4 h-4" />
                        Batal
                    </Link>

                    <button type="submit" :disabled="form.processing"
                        class="inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        <ArrowPathIcon v-if="form.processing" class="w-4 h-4 animate-spin" />
                        <CheckCircleIcon v-else class="w-4 h-4" />
                        <span>{{ form.processing ? 'Menyimpan...' : 'Simpan' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </OwnerLayout>
</template>

<style scoped>
input:focus,
select:focus {
    outline: none;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}
</style>