<script setup>
import { BookOpenIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    form: Object,
    kelasList: Array,
    mapelList: Array,
    submitLabel: {
        type: String,
        default: 'Simpan Jurnal',
    },
    // Saat true, tanggal & jam tidak bisa diubah user (diisi otomatis dari server)
    lockTime: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['submit'])
</script>

<template>
    <form @submit.prevent="emit('submit')" class="space-y-5">

        <!-- Tanggal & Jam -->
        <div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Tanggal</label>
                    <input v-model="form.tanggal" type="date" required :readonly="lockTime"
                        :tabindex="lockTime ? -1 : 0" class="w-full px-4 py-2.5 rounded-xl border text-sm"
                        :class="lockTime
                            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-800/60 dark:border-gray-800 dark:text-gray-400'
                            : 'bg-white border-gray-200 text-gray-800 dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40'" />
                    <p v-if="form.errors.tanggal" class="text-xs text-rose-500 mt-1">{{ form.errors.tanggal }}</p>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Jam Mulai</label>
                    <input v-model="form.jam_mulai" type="time" required :readonly="lockTime"
                        :tabindex="lockTime ? -1 : 0" class="w-full px-4 py-2.5 rounded-xl border text-sm"
                        :class="lockTime
                            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-800/60 dark:border-gray-800 dark:text-gray-400'
                            : 'bg-white border-gray-200 text-gray-800 dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40'" />
                    <p v-if="form.errors.jam_mulai" class="text-xs text-rose-500 mt-1">{{ form.errors.jam_mulai }}</p>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Jam
                        Selesai</label>
                    <input v-model="form.jam_selesai" type="time" :readonly="lockTime" :tabindex="lockTime ? -1 : 0"
                        class="w-full px-4 py-2.5 rounded-xl border text-sm"
                        :class="lockTime
                            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-800/60 dark:border-gray-800 dark:text-gray-400'
                            : 'bg-white border-gray-200 text-gray-800 dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40'" />
                    <p v-if="form.errors.jam_selesai" class="text-xs text-rose-500 mt-1">{{ form.errors.jam_selesai }}
                    </p>
                </div>
            </div>
            <p v-if="lockTime" class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Tanggal & jam diisi otomatis oleh sistem sesuai waktu saat jurnal dibuat (durasi sesi 90 menit) dan
                tidak dapat diubah.
            </p>
        </div>

        <!-- Kelas & Mapel -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Kelas</label>
                <select v-model="form.kelas_id" required
                    class="w-full px-4 py-2.5 rounded-xl border text-sm bg-white border-gray-200 text-gray-800
                           dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40">
                    <option value="" disabled>Pilih kelas</option>
                    <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.kelas }}</option>
                </select>
                <p v-if="form.errors.kelas_id" class="text-xs text-rose-500 mt-1">{{ form.errors.kelas_id }}</p>
            </div>

            <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Mata
                    Pelajaran</label>
                <select v-model="form.mapel_id" required
                    class="w-full px-4 py-2.5 rounded-xl border text-sm bg-white border-gray-200 text-gray-800
                           dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40">
                    <option value="" disabled>Pilih mata pelajaran</option>
                    <option v-for="m in mapelList" :key="m.id" :value="m.id">{{ m.mapel }}</option>
                </select>
                <p v-if="form.errors.mapel_id" class="text-xs text-rose-500 mt-1">{{ form.errors.mapel_id }}</p>
            </div>
        </div>

        <!-- Materi -->
        <div>
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Materi yang
                Diajarkan</label>
            <textarea v-model="form.materi" rows="5" required
                placeholder="Tuliskan materi/pokok bahasan yang disampaikan hari ini..."
                class="w-full px-4 py-3 rounded-xl border text-sm bg-white border-gray-200 text-gray-800 resize-none
                       dark:bg-gray-900/60 dark:border-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"></textarea>
            <p v-if="form.errors.materi" class="text-xs text-rose-500 mt-1">{{ form.errors.materi }}</p>
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="form.processing"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500
                   text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-opacity disabled:opacity-50">
            <BookOpenIcon class="w-4 h-4" />
            {{ form.processing ? 'Menyimpan...' : submitLabel }}
        </button>
    </form>
</template>