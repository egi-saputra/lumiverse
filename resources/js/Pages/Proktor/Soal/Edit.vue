<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Link, useForm } from '@inertiajs/vue3';
import { ArrowPathIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/vue/24/solid';
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps({
    soal: Object,
    nilai_per_soal: Number,
    mapel: Array, // tambahkan props mapel dari backend
});

// Form pengaturan quiz
const form = useForm({
    title: props.soal.title || '',
    mapel_id: props.soal.mapel_id || '',  // gunakan mapel_id
    kelas: props.soal.kelas || '',
    waktu: props.soal.waktu || 0,
    status: props.soal.status || 'Tidak Aktif',
    tipe_soal: props.soal.tipe_soal || 'Berurutan',
    token: props.soal.token || '',
    nilai_per_soal: props.nilai_per_soal,
});

// Generate token 6 digit
const generateToken = () => {
    const t = Math.floor(100000 + Math.random() * 900000);
    form.token = t.toString().padStart(6, '0'); // selalu 6 digit
};

// Submit form & update semua nilai butir soal
const submit = async () => {
    form.processing = true;

    try {
        // Update data quiz utama, pastikan token dikirim
        await form.put(`/proktor/soal/${props.soal.id}`);

        // Hanya update nilai per butir soal jika ada soal
        if (props.soal.bank_soal && props.soal.bank_soal.length > 0) {
            await axios.put(`/proktor/soal/${props.soal.id}/update-nilai`, {
                nilai: form.nilai_per_soal
            });
        }

        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Pengaturan quiz, mapel, kelas, dan nilai berhasil diperbarui.',
            confirmButtonColor: '#3b82f6',
        }).then(() => {
            window.location.href = `/proktor/soal`;
        });

    } catch (err) {
        Swal.fire('Error', 'Terjadi kesalahan saat update.', 'error');
    } finally {
        form.processing = false;
    }
};
</script>

<template>
    <MenuLayout>
        <div class="mx-auto p-2 sm:p-8
                   sm:bg-white sm:dark:bg-white/5
                   sm:rounded-2xl sm:shadow-xl
                   sm:border sm:border-gray-200 sm:dark:border-white/10">

            <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-8
                       text-gray-800 dark:text-gray-100">
                Pengaturan / Konfigurasi Quiz
            </h1>

            <form @submit.prevent="submit" class="space-y-5">

                <!-- Judul -->
                <div>
                    <label class="label">Judul Quiz</label>
                    <input v-model="form.title" type="text" placeholder="Masukkan judul quiz"
                        class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" />
                </div>

                <!-- Mapel & Kelas -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="label">Mata Pelajaran</label>
                        <select v-model="form.mapel_id"
                            class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                            <option value="">-- Pilih Mata Pelajaran --</option>
                            <option v-for="m in mapel" :key="m.id" :value="m.id">
                                {{ m.mapel }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="label">Kelas</label>
                        <input v-model="form.kelas" type="text" placeholder="Masukkan kelas"
                            class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" />
                    </div>
                </div>

                <!-- Waktu & Status -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="label">Waktu (Menit)</label>
                        <input v-model="form.waktu" type="number" placeholder="Masukkan waktu pengerjaan"
                            class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" />
                    </div>

                    <div>
                        <label class="label">Status Quiz</label>
                        <select v-model="form.status"
                            class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                            <option value="Aktif">Aktif</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                        </select>
                    </div>
                </div>

                <!-- Format & Nilai -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="label">Format Soal</label>
                        <select v-model="form.tipe_soal"
                            class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                            <option value="Berurutan">Berurutan</option>
                            <option value="Acak">Acak</option>
                        </select>
                    </div>

                    <div>
                        <label class="label">Nilai (/Butir Soal)</label>
                        <input v-model="form.nilai_per_soal" type="number" min="0"
                            :disabled="!props.soal.bank_soal || props.soal.bank_soal.length === 0"
                            class="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:text-gray-400" />

                        <p v-if="!props.soal.bank_soal || props.soal.bank_soal.length === 0"
                            class="mt-1 text-sm text-red-500">
                            Tidak ada soal, tidak dapat mengisi nilai poin.
                        </p>
                    </div>
                </div>

                <!-- Token -->
                <div>
                    <label class="label">Token Quiz</label>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <input v-model="form.token" type="text" readonly class="flex-1 rounded-lg p-3 font-semibold
                                   bg-gray-100 dark:bg-slate-900
                                   border border-gray-300 dark:border-white/10
                                   text-gray-700 dark:text-gray-200" />

                        <button type="button" @click="generateToken" class="btn-success">
                            <ArrowPathIcon class="w-5 h-5" />
                            Generate Token Baru
                        </button>
                    </div>
                </div>

                <!-- Tombol -->
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/proktor/soal" class="btn-secondary">
                        <ArrowLeftIcon class="w-5 h-5" />
                        Kembali
                    </Link>

                    <button type="submit" :disabled="form.processing" class="btn-primary">
                        <CheckIcon class="w-5 h-5" />
                        <span>{{ form.processing ? 'Updating...' : 'Update' }}</span>
                    </button>
                </div>

            </form>
        </div>
    </MenuLayout>
</template>
