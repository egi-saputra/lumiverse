<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import DeleteUserForm from './Partials/DeleteUserForm.vue';
import UpdatePasswordForm from './Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.vue';
import UpdateStudentDataForm from './Partials/UpdateStudentDataForm.vue';
import { Head, usePage } from '@inertiajs/vue3';

const page = usePage()

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
    // Dikirim dari controller jika role === 'siswa', null jika bukan
    siswa: {
        type: Object,
        default: null,
    },
    kelas: {
        type: Array,
        default: null,
    },
    kejuruan: {
        type: Array,
        default: null,
    },
    isSmk: {
        type: Boolean,
        default: false,
    },
});

const isStudent = page.props.auth.user.role === 'siswa'
</script>

<!-- Glassmorphism Style -->
<template>

    <Head title="Profile" />

    <MenuLayout>
        <template #header>
            <div class="flex flex-col gap-1">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                    Account Profile
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Manage your personal information & security
                </p>
            </div>
        </template>

        <div class="py-6">
            <div class="max-w-6xl mx-auto space-y-8">

                <!-- Profile Information -->
                <section class="relative p-6 sm:p-8 rounded-3xl
                           bg-white/70 dark:bg-white/5
                           backdrop-blur-xl
                           border border-white/20 dark:border-white/10
                           shadow-xl">

                    <h3 class="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
                        👤 Profile Information
                    </h3>

                    <UpdateProfileInformationForm :must-verify-email="mustVerifyEmail" :status="status"
                        class="max-w-xl" />
                </section>

                <!-- Student Data — hanya tampil jika role siswa dan data tersedia -->
                <section v-if="isStudent && siswa" class="relative p-6 sm:p-8 rounded-3xl
                           bg-white/70 dark:bg-white/5
                           backdrop-blur-xl
                           border border-white/20 dark:border-white/10
                           shadow-xl">
                    <h3 class="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
                        🎓 Student Data
                    </h3>

                    <UpdateStudentDataForm :siswa="siswa" :kelas="kelas" :kejuruan="kejuruan" :is-smk="isSmk"
                        :status="status" class="max-w-xl" />
                </section>

                <!-- Security & Password -->
                <section class="relative p-6 sm:p-8 rounded-3xl
                           bg-white/70 dark:bg-white/5
                           backdrop-blur-xl
                           border border-white/20 dark:border-white/10
                           shadow-xl">

                    <h3 class="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
                        🔐 Security & Password
                    </h3>

                    <UpdatePasswordForm class="max-w-xl" />
                </section>

                <!-- Danger Zone -->
                <section class="relative p-6 sm:p-8 rounded-3xl
                           bg-red-50/70 dark:bg-red-500/5
                           backdrop-blur-xl
                           border border-red-200/50 dark:border-red-500/20
                           shadow-xl">

                    <h3 class="mb-6 text-lg font-semibold text-red-600 dark:text-red-400">
                        ⚠️ Danger Zone
                    </h3>

                    <DeleteUserForm class="max-w-xl" />
                </section>

            </div>
        </div>
    </MenuLayout>
</template>