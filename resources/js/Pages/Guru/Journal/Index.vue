<script setup>
import UserLayout from '@/Layouts/UserLayout.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>

    <Head title="Homeroom Teacher" />

    <UserLayout>
        <div class="py-6">
            <div class="mx-auto max-w-7xl">

                <div class="bg-white dark:bg-[#0F172A] rounded-xl shadow p-8">
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                        Journal Online Prakerin
                    </h1>

                    <p class="mt-4 text-gray-600 dark:text-gray-300">
                        This feature is currently under development.
                    </p>
                    <p class="mt-4 text-gray-600 dark:text-gray-300">
                        Halaman ini sedang dalam tahap pengembangan.
                    </p>
                    <p class="mt-4 text-gray-600 dark:text-gray-300">
                        Halaman ini sedang menunggu budgeting masuk.
                    </p>
                </div>

            </div>
        </div>
    </UserLayout>
</template>