<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { useForm, Link, usePage } from '@inertiajs/vue3'
import { CheckIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid';

const page = usePage()

const props = defineProps({
    mapel: Array,
})

const form = useForm({
    title: '',
    mapel_id: '',
    kelas: '',
    waktu: '',
    status: 'Tidak Aktif',
    tipe_soal: 'Berurutan',
});
</script>

<template>
    <MenuLayout>
        <div class="sm:py-8 sm:pb-0 pb-10 sm:px-4 min-h-screen">
            <div class="mx-auto md:border md:text-base text-sm
               md:border-gray-300 md:bg-white
               dark:bg-slate-900/70 dark:border-slate-800
               md:rounded-2xl md:shadow-xl md:p-8">

                <!-- HEADER -->
                <div class="mb-6">
                    <h1
                        class="text-2xl sm:inline-block hidden font-extrabold text-gray-800 dark:text-slate-100 text-left">
                        Create / Add Quiz
                    </h1>
                    <p class="text-gray-500 dark:text-slate-400 sm:text-base text-sm">
                        This page is intended to create or add quiz.
                    </p>
                </div>

                <form @submit.prevent="() => { console.log(form); form.post('/proktor/soal'); }">

                    <!-- GRID INPUT UTAMA -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                        <!-- TITLE -->
                        <div>
                            <label class="block font-semibold text-gray-700 dark:text-slate-200">
                                Quiz Title
                            </label>
                            <input v-model="form.title" type="text" placeholder="Please enter the quiz title"
                                class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2" />
                            <p v-if="form.errors.title" class="text-red-600 text-sm mt-1">
                                {{ form.errors.title }}
                            </p>
                        </div>

                        <!-- SUBJECT -->
                        <div>
                            <label class="block font-semibold text-gray-700 dark:text-slate-200">
                                Subjects
                            </label>
                            <select v-model="form.mapel_id"
                                class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2">
                                <option value="">-- Choose the subjects --</option>
                                <option v-for="m in mapel" :key="m.id" :value="m.id">
                                    {{ m.mapel }}
                                </option>
                            </select>
                            <div v-if="form.errors.mapel_id" class="text-red-500 text-sm mt-1">
                                {{ form.errors.mapel_id }}
                            </div>
                        </div>

                        <!-- CLASS -->
                        <div>
                            <label class="block font-semibold text-gray-700 dark:text-slate-200">
                                Class Room
                            </label>
                            <input v-model="form.kelas" type="text" placeholder="Please enter the class room"
                                class="w-full border rounded-lg p-3 transition border-gray-300 focus:ring-blue- dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2" />
                            <p v-if="form.errors.kelas" class="text-red-600 text-sm mt-1">
                                {{ form.errors.kelas }}
                            </p>
                        </div>

                        <!-- DURATION -->
                        <div>
                            <label class="block font-semibold text-gray-700 dark:text-slate-200">
                                Duration (Minute)
                            </label>
                            <input v-model="form.waktu" type="number" placeholder="Enter the time limit here" class="w-full border rounded-lg p-3 transition
                       border-gray-300 focus:ring-blue-400
                       dark:bg-slate-800 dark:border-slate-700
                       dark:text-slate-100 dark:placeholder-slate-400
                       focus:outline-none focus:ring-2" />
                            <p v-if="form.errors.waktu" class="text-red-600 text-sm mt-1">
                                {{ form.errors.waktu }}
                            </p>
                        </div>

                    </div>

                    <!-- STATUS & TIPE -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block font-semibold text-gray-700 dark:text-slate-200">
                                Quiz Status
                            </label>
                            <select v-model="form.status" class="w-full border rounded-lg p-3 transition
                       border-gray-300 focus:ring-blue-400
                       dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100
                       focus:outline-none focus:ring-2">
                                <option value="Aktif">Activated</option>
                                <option value="Tidak Aktif">Deactivated</option>
                            </select>
                        </div>

                        <div>
                            <label class="block font-semibold text-gray-700 dark:text-slate-200">
                                Question Form
                            </label>
                            <select v-model="form.tipe_soal" class="w-full border rounded-lg p-3 transition
                       border-gray-300 focus:ring-blue-400
                       dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100
                       focus:outline-none focus:ring-2">
                                <option value="Berurutan">Sequence</option>
                                <option value="Acak">Shuffle</option>
                            </select>
                        </div>
                    </div>

                    <!-- BUTTON -->
                    <div class="flex flex-col sm:flex-row gap-4 mt-6">
                        <button type="submit" :disabled="form.processing" class="flex-1 flex items-center justify-center gap-2 px-6 py-3
                     bg-gradient-to-r from-blue-500 to-blue-700
                     hover:from-blue-600 hover:to-blue-800
                     text-white font-semibold rounded-lg shadow-lg transition">
                            <svg v-if="form.processing" class="w-5 h-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <CheckIcon v-else class="w-5 h-5" />
                            <span>{{ form.processing ? 'Creating your quiz....' : 'Create Quiz' }}</span>
                        </button>

                        <Link href="/proktor/soal/" class="flex-1 flex items-center justify-center gap-2 px-6 py-3
                     bg-gradient-to-r from-gray-500 to-gray-700
                     hover:from-gray-600 hover:to-gray-800
                     text-white font-semibold rounded-lg shadow-lg transition">
                            <ArrowLeftIcon class="w-5 h-5" />
                            Back to Quiz
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    </MenuLayout>
</template>
