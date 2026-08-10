<script setup>
import UserLayout from '@/Layouts/UserLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3'
import { route } from 'ziggy-js'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import Form from './Form.vue'

const props = defineProps({
    journal: Object,
    kelasList: Array,
    mapelList: Array,
})

const form = useForm({
    kelas_id: props.journal.kelas_id,
    mapel_id: props.journal.mapel_id,
    tanggal: props.journal.tanggal,
    jam_mulai: props.journal.jam_mulai?.slice(0, 5),
    jam_selesai: props.journal.jam_selesai?.slice(0, 5) || '',
    materi: props.journal.materi,
})

const submit = () => {
    form.put(route('guru.journal.update', props.journal.id))
}
</script>

<template>

    <Head title="Edit Jurnal Mengajar" />

    <UserLayout>
        <div class="mx-auto">
            <Link :href="route('guru.journal.index')"
                class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5">
                <ArrowLeftIcon class="w-4 h-4" />
                Kembali ke Jurnal
            </Link>

            <div class="mb-6">
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">Edit Jurnal Mengajar</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Perbarui catatan jurnal yang sudah diisi.</p>
            </div>

            <div
                class="p-6 rounded-2xl border bg-white border-gray-100 shadow-sm dark:bg-gray-900/60 dark:border-gray-800">
                <Form :form="form" :kelas-list="kelasList" :mapel-list="mapelList" :lock-time="true"
                    submit-label="Perbarui Jurnal" @submit="submit" />
            </div>
        </div>
    </UserLayout>
</template>