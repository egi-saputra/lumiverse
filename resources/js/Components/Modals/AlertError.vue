<script setup>
import { ref } from 'vue'

/* PROPS */
const props = defineProps({
    title: {
        type: String,
        default: 'Error!',
    },
    description: {
        type: String,
        default: 'Something went wrong.',
    },
})

const show = ref(false)
// Buat ref baru untuk pesan agar bisa diubah
const descriptionText = ref(props.description)

/* API */
const open = (msg) => {
    if (msg) descriptionText.value = msg
    show.value = true
}

const close = () => {
    show.value = false
}

defineExpose({ open })
</script>

<template>
    <!-- Overlay -->
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-40 bg-black/80" />
    </Transition>

    <!-- Modal -->
    <Transition name="popup">
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div class="relative bg-white rounded-xl -mb-10 w-full max-w-sm py-6 px-6 shadow-2xl">

                <!-- Floating Image -->
                <div
                    class="absolute -top-[9.7rem] -right-3 pointer-events-none w-48 h-48 mx-auto -mb-2 overflow-hidden rounded">
                    <img src="/images/error.png" class="w-full h-full object-cover" />
                </div>

                <div class="border-2  border-amber-900 border-dashed rounded-lg p-6">
                    <!-- Content -->
                    <h3 class="text-2xl font-bold text-center tracking-wide text-red-600 mt-6">
                        {{ title }}
                    </h3>

                    <p class="text-sm text-gray-500 text-center mt-2">
                        {{ descriptionText }}
                    </p>

                    <!-- Action -->
                    <div class="mt-6 mb-3 w-full flex justify-center">
                        <button @click="close"
                            class="rounded border border-dashed border-red-600 text-stone-600 font-extrabold px-12 py-2 hover:bg-blue-100 hover:text-red-600  text-sm font-mono tracking-widest transition">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>
