<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { useForm, Link, usePage } from '@inertiajs/vue3'
import { CheckIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid';
import { ToastAlert } from '@/Composables/ToastAlert.js';

const page = usePage()
const { success, error } = ToastAlert();

const props = defineProps({
    mapel: Array,
})

const form = useForm({
    title: '',
    mapel_id: '',
    kelas: '',
    waktu: '60',
    status: 'Tidak Aktif',
    tipe_soal: 'Berurutan',
});

const submit = () => {
    form.post('/guru/soal', {
        onSuccess: () => {
            if (page.props.flash?.error) {
                error(page.props.flash.error);
            } else {
                success('Quiz berhasil dibuat.');
            }
        },
        onError: () => {
            error('Terjadi kesalahan saat membuat quiz.');
        },
    });
};
</script>

<template>
    <MenuLayout>

        <div class="min-h-screen sm:py-4 pb-14 sm:px-2">
            <div class="
                rounded-xl
                bg-white/70 dark:bg-white/5
                backdrop-blur-2xl
                border border-white/20 dark:border-white/10
                shadow-2xl
                p-6 sm:p-10">

                <!-- Header -->
                <div class="mb-8">
                    <h1
                        class="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
                        <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl
                            bg-gradient-to-br from-blue-500 to-indigo-600
                            text-white shadow-lg">
                            +
                        </span>
                        Create / Add Quiz
                    </h1>

                    <p class="mt-2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        Create and configure a new quiz or exam for your class.
                    </p>
                </div>

                <!-- FORM -->
                <form @submit.prevent="submit" class="space-y-6">

                    <!-- Title -->
                    <div>
                        <label class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Quiz Title
                        </label>

                        <input v-model="form.title" type="text" placeholder="e.g. ASAS GANJIL 2025"
                            class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2" />

                        <p v-if="form.errors.title" class="mt-1 text-sm text-red-500">
                            {{ form.errors.title }}
                        </p>
                    </div>

                    <!-- SUBJECT & CLASS -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <!-- Subject -->
                        <div>
                            <label class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Subject
                            </label>

                            <select v-model="form.mapel_id"
                                class="w-full border rounded-xl p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2">

                                <option value="">-- Select Subject --</option>
                                <option v-for="m in mapel" :key="m.id" :value="m.id">
                                    {{ m.mapel }}
                                </option>
                            </select>

                            <p v-if="form.errors.mapel_id" class="mt-1 text-sm text-red-500">
                                {{ form.errors.mapel_id }}
                            </p>
                        </div>

                        <!-- Class -->
                        <div>
                            <label class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Class Unit
                            </label>

                            <input v-model="form.kelas" type="text" placeholder="XI BR / XII MP"
                                class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue- dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2" />

                            <p v-if="form.errors.kelas" class="mt-1 text-sm text-red-500">
                                {{ form.errors.kelas }}
                            </p>
                        </div>
                    </div>

                    <!-- ACTION BUTTONS -->
                    <div class="flex flex-col sm:flex-row gap-4 pt-4">

                        <!-- Submit -->
                        <button type="submit" :disabled="form.processing" class="flex-1 flex items-center justify-center gap-2
                            rounded-xl px-6 py-3
                            bg-gradient-to-r from-blue-500 to-indigo-600
                            hover:from-blue-600 hover:to-indigo-700
                            text-white font-semibold
                            shadow-lg shadow-blue-500/30
                            transition">

                            <svg v-if="form.processing" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>

                            <CheckIcon v-else class="w-5 h-5" />

                            <span>
                                {{ form.processing ? 'Creating Quiz...' : 'Create Quiz' }}
                            </span>
                        </button>

                        <!-- Back -->
                        <Link href="/guru/soal" class="flex-1 flex items-center justify-center gap-2
                            rounded-xl px-6 py-3
                            bg-gray-800 dark:bg-white/10
                            border border-gray-300 dark:border-gray-600
                            text-gray-100 dark:text-white
                            font-semibold
                            hover:bg-gray-900 dark:hover:bg-white/20
                            transition">

                            <ArrowLeftIcon class="w-5 h-5" />
                            Back to Quiz
                        </Link>
                    </div>

                </form>
            </div>
        </div>

    </MenuLayout>
</template>

<style>
/* Input user otomatis uppercase */
.uppercase-input {
    text-transform: uppercase;
}

/* Placeholder tetap normal */
.uppercase-input::placeholder {
    text-transform: none;
}

/* Input user otomatis capitaliez */
.capitalize-input {
    text-transform: capitalize;
}

/* Placeholder tetap normal */
.capitalize-input::placeholder {
    text-transform: none;
}
</style>