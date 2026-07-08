<script setup>
import { Link } from '@inertiajs/vue3'
import { ref } from 'vue'
import {
    XMarkIcon, EnvelopeIcon, UserCircleIcon, PencilSquareIcon,
    TrashIcon, ShieldCheckIcon, AcademicCapIcon, Cog6ToothIcon, UserIcon,
    CalendarIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
    roleLabels: Object,
})

const emit = defineEmits(['delete'])

const show = ref(false)
const user = ref(null)

function open(u) {
    user.value = u
    show.value = true
}

function close() {
    show.value = false
    // beri jeda kecil biar transisi keluar tidak "patah" saat user di-null-kan
    setTimeout(() => (user.value = null), 200)
}

function roleLabel(u) {
    if (!u) return ''
    if (u.role === 'admin' && u.isSelf) return 'Super Admin'
    return props.roleLabels?.[u.role] ?? u.role
}

const roleBadgeClass = (u) => ({
    'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/40 dark:border-amber-600 dark:text-amber-300': u.role === 'admin' && u.isSelf,
    'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900 dark:border-purple-600 dark:text-purple-300': u.role === 'admin' && !u.isSelf,
    'bg-green-50 border-green-200 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300': u.role === 'guru',
    'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-300': u.role === 'proktor',
    'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300': u.role === 'siswa',
    'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300': u.role === 'user',
})

function handleDelete() {
    if (!user.value) return
    emit('delete', user.value.id)
    close()
}

defineExpose({ open })
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center px-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close" />

                <!-- Modal -->
                <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                    <div v-if="user"
                        class="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
                        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

                        <button @click="close"
                            class="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition">
                            <XMarkIcon class="w-5 h-5" />
                        </button>

                        <div class="p-6">
                            <!-- Header -->
                            <div class="flex items-center gap-4 mb-5">
                                <div
                                    class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xl">
                                    {{ user.name.charAt(0).toUpperCase() }}
                                </div>
                                <div class="min-w-0">
                                    <h3 class="font-semibold text-lg text-gray-900 dark:text-white truncate">
                                        {{ user.name }}
                                    </h3>
                                    <span
                                        class="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                        :class="roleBadgeClass(user)">
                                        <SparklesIcon v-if="user.role === 'admin' && user.isSelf" class="w-3.5 h-3.5" />
                                        <ShieldCheckIcon v-else-if="user.role === 'admin'" class="w-3.5 h-3.5" />
                                        <AcademicCapIcon v-else-if="user.role === 'guru'" class="w-3.5 h-3.5" />
                                        <Cog6ToothIcon v-else-if="user.role === 'proktor'" class="w-3.5 h-3.5" />
                                        <UserIcon v-else class="w-3.5 h-3.5" />
                                        {{ roleLabel(user) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Info rows -->
                            <div class="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <div class="flex items-center gap-2 text-sm">
                                    <EnvelopeIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span class="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">Email</span>
                                    <span class="text-gray-800 dark:text-gray-200 truncate">{{ user.email }}</span>
                                </div>
                                <div class="flex items-center gap-2 text-sm">
                                    <UserCircleIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span class="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">Telepon</span>
                                    <span class="text-gray-800 dark:text-gray-200">{{ user.phone ?? '-' }}</span>
                                </div>
                                <div v-if="user.created_at" class="flex items-center gap-2 text-sm">
                                    <CalendarIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span class="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">Terdaftar</span>
                                    <span class="text-gray-800 dark:text-gray-200">{{ user.created_at }}</span>
                                </div>
                            </div>

                            <p v-if="user.isSelf" class="mt-4 text-xs text-amber-600 dark:text-amber-400">
                                Ini adalah akun Anda sendiri.
                            </p>

                            <!-- Actions -->
                            <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button v-if="!user.isSelf" @click="handleDelete"
                                    class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/40 hover:bg-red-100 dark:hover:bg-red-900 transition">
                                    <TrashIcon class="w-4 h-4" />
                                    Hapus
                                </button>
                                <Link :href="route('owner.users.edit', user.id)"
                                    class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition">
                                    <PencilSquareIcon class="w-4 h-4" />
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>