<script setup>
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

/* ✅ PROPS */
const props = defineProps({
    description: {
        type: String,
        default: 'This action cannot be undone.',
    },
    title: {
        type: String,
        default: 'Delete Data?',
    },
})

const show = ref(false)
const deleteId = ref(null)
const deleteRoute = ref(null)

/* API dari parent */
const open = (id, routeName) => {
    deleteId.value = id
    deleteRoute.value = routeName
    show.value = true
}

const close = () => {
    show.value = false
    deleteId.value = null
    deleteRoute.value = null
}

const confirm = () => {
    router.delete(route(deleteRoute.value, deleteId.value))
    close()
}

/* expose */
defineExpose({ open })
</script>

<template>
    <!-- Overlay -->
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-40 bg-black/80" @click="close" />
    </Transition>

    <!-- Modal -->
    <Transition name="popup">
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                class="relative bg-white border-2 border-amber-900 rounded-xl -mb-10 w-full max-w-sm py-6 px-6 shadow-2xl">

                <!-- Floating Image -->
                <div
                    class="absolute -top-[10.8rem] -right-2 pointer-events-none w-44 h-44 mx-auto -mb-2 overflow-hidden rounded">
                    <img src="/images/delete-warning.png" class="w-full h-full object-cover" />
                </div>

                <!-- Content -->
                <h3 class="text-lg font-semibold text-center text-gray-800">
                    {{ title }}
                </h3>

                <p class="text-sm text-gray-500 text-center mt-2">
                    {{ description }}
                </p>

                <!-- Actions -->
                <div class="flex gap-3 mt-6">
                    <button @click="close" class="flex-1 rounded-lg border-2 border-amber-900 px-4 py-2 text-sm
                               hover:bg-amber-100 transition">
                        Cancel
                    </button>

                    <button @click="confirm" class="flex-1 rounded-lg bg-red-600 text-white px-4 py-2 text-sm
                               hover:bg-red-700 transition">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>
