<script setup>
import MenuLayout from '@/Layouts/MenuLayout.vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { ref, computed, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'

const page = usePage()

const props = defineProps({
  roles: Array,
  remainingSlots: { type: Number, default: null }, // null = tanpa batas
})

// ─── Step 1: pilih role dulu ─────────────────────────────────────────────
const selectedRole = ref('')
const roleConfirmed = ref(false)

const confirmRole = () => {
  if (!selectedRole.value) return
  roleConfirmed.value = true
}

const changeRole = () => {
  roleConfirmed.value = false
}

// ─── Step 2: bulk rows ───────────────────────────────────────────────────
const rows = ref([
  { name: '', email: '', password: '' },
])

// ref per kolom, supaya Enter di username lompat ke username baris berikutnya
// (bukan ke email), begitu juga email dan password
const nameRefs = ref([])
const emailRefs = ref([])
const passwordRefs = ref([])

const setRef = (refsArray, el, index) => {
  if (el) refsArray[index] = el
}

const quotaReached = computed(() => {
  if (props.remainingSlots === null) return false
  return rows.value.length >= props.remainingSlots
})

const addRowIfPossible = async (field, index) => {
  if (index !== rows.value.length - 1) return
  if (!rows.value[index][field].trim()) return
  if (quotaReached.value) return

  rows.value.push({ name: '', email: '', password: '' })
  await nextTick()

  const targetRefs = field === 'name' ? nameRefs : field === 'email' ? emailRefs : passwordRefs
  targetRefs.value[rows.value.length - 1]?.focus() // tetap pakai .value, ini di script
}

const focusNext = async (field, index) => {
  if (index === rows.value.length - 1) {
    await addRowIfPossible(field, index)
    return
  }
  const targetRefs = field === 'name' ? nameRefs : field === 'email' ? emailRefs : passwordRefs
  targetRefs.value[index + 1]?.focus() // tetap pakai .value, ini di script
}

const removeRow = (index) => {
  if (rows.value.length === 1) {
    rows.value[0] = { name: '', email: '', password: '' }
    return
  }
  rows.value.splice(index, 1)
}

// ─── Submit ──────────────────────────────────────────────────────────────
const form = useForm({
  role: '',
  items: [],
})

const submit = () => {
  const items = rows.value
    .filter(r => r.name.trim() || r.email.trim() || r.password.trim())
    .map(r => ({
      name: r.name.trim(),
      email: r.email.trim(),
      password: r.password,
    }))

  if (items.length === 0) return

  form.role = selectedRole.value
  form.items = items
  form.post(route('admin.users.store'), {
    preserveScroll: true,
  })
}
</script>

<template>

  <Head title="Create User" />

  <MenuLayout>
    <div class="mx-auto p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-xl transition">

      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          + Create Users (Bulk)
        </h1>
      </div>

      <p v-if="remainingSlots !== null" class="text-sm mb-6"
        :class="remainingSlots === 0 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'">
        Sisa kuota akun: <span class="font-semibold">{{ remainingSlots }}</span>
      </p>
      <p v-else class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Kuota akun tidak dibatasi.
      </p>

      <!-- STEP 1: PILIH ROLE -->
      <div v-if="!roleConfirmed" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role User</label>
          <select v-model="selectedRole"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
            <option value="" disabled>-- Pilih Role --</option>
            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
          </select>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Semua user yang ditambahkan pada sesi ini akan menggunakan role yang sama.
          </p>
        </div>

        <div class="flex justify-end gap-3">
          <Link :href="route('admin.users.index')"
            class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-center">
            Cancel
          </Link>
          <button type="button" @click="confirmRole" :disabled="!selectedRole"
            class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
            Continue
          </button>
        </div>
      </div>

      <!-- STEP 2: BULK INPUT -->
      <form v-if="roleConfirmed" @submit.prevent="submit" class="space-y-4">

        <div class="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/30 rounded-xl px-4 py-2">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Role dipilih: <span class="font-semibold capitalize">{{ selectedRole }}</span>
          </span>
          <button type="button" @click="changeRole" :disabled="form.processing"
            class="text-sm text-indigo-600 dark:text-indigo-300 hover:underline disabled:opacity-50">
            Ganti role
          </button>
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Tekan Enter untuk menambah baris baru</p>

        <!-- Header kolom -->
        <div class="hidden sm:flex gap-3 px-1">
          <div class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">Username</div>
          <div class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</div>
          <div class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password</div>
          <div class="w-9"></div>
        </div>

        <div v-for="(row, index) in rows" :key="index" class="flex flex-col sm:flex-row gap-2 sm:gap-3">

          <!-- Username -->
          <div class="flex-1">
            <input :ref="el => setRef(nameRefs, el, index)" v-model="row.name" type="text" placeholder="Username"
              :disabled="form.processing" @keydown.enter.prevent="focusNext('name', index)"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition disabled:opacity-60" />
          </div>

          <!-- Email -->
          <div class="flex-1">
            <input :ref="el => setRef(emailRefs, el, index)" v-model="row.email" type="email"
              placeholder="Email Address" :disabled="form.processing" @keydown.enter.prevent="focusNext('email', index)"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition disabled:opacity-60" />
          </div>

          <!-- Password -->
          <div class="flex-1">
            <input :ref="el => setRef(passwordRefs, el, index)" v-model="row.password" type="password"
              placeholder="Password" :disabled="form.processing" @keydown.enter.prevent="focusNext('password', index)"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-700/60 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md transition disabled:opacity-60" />
          </div>

          <!-- Tombol Hapus -->
          <button type="button" @click="removeRow(index)" :disabled="form.processing"
            class="p-2 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition shrink-0 self-center disabled:opacity-40 disabled:cursor-not-allowed"
            title="Hapus baris">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <p v-if="quotaReached" class="text-sm text-amber-600 dark:text-amber-400">
          Jumlah baris sudah mencapai sisa kuota ({{ remainingSlots }}). Hapus baris lain untuk menambah baris baru.
        </p>

        <div v-if="form.errors.items" class="text-red-600 text-sm">{{ form.errors.items }}</div>
        <div v-if="form.errors.role" class="text-red-600 text-sm">{{ form.errors.role }}</div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Link :href="route('admin.users.index')" :class="{ 'pointer-events-none opacity-50': form.processing }"
            class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-center">
            Cancel
          </Link>

          <button type="submit" :disabled="form.processing"
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition min-w-[110px]">
            <svg v-if="form.processing" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
              </circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>{{ form.processing ? 'Saving...' : 'Save All' }}</span>
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