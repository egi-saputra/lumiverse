<script setup>
import { ref, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'

/* PROPS (optional override) */
const props = defineProps({
    title: {
        type: String,
        default: 'Success! 🎉',
    },
})

const show = ref(false)
const message = ref('')

const page = usePage()

/* 🔥 WATCH FLASH SUCCESS */
watch(
    () => page.props.flash?.success,
    (val) => {
        if (val) {
            message.value = val
            show.value = true
        }
    },
    { immediate: true }
)

/* CLOSE MODAL */
const close = () => {
    show.value = false
}
</script>

<template>
    <!-- Overlay -->
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-40 bg-black/60" />
    </Transition>

    <!-- Modal -->
    <Transition name="popup">
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div class="relative bg-white rounded-xl -mb-10 w-full max-w-sm py-6 px-6 shadow-2xl">

                <!-- Floating Image -->
                <!-- <div class="absolute -top-[9.2rem] -right-4 pointer-events-none">
                    <img src="/images/success.png" class="w-44 h-44 object-contain drop-shadow-xl" />
                </div> -->
                <!-- Floating Image -->
                <div
                    class="absolute -top-[9rem] -right-2 pointer-events-none w-44 h-44 mx-auto -mb-2 overflow-hidden rounded">
                    <img src="/images/success.png" class="w-full h-full object-cover" />
                </div>

                <div class="border-2  border-amber-900 border-dashed rounded-lg p-6">
                    <!-- Content -->
                    <h3 class="text-2xl font-bold text-center tracking-wide text-green-600 mt-6">
                        {{ title }}
                    </h3>

                    <p class="text-sm text-gray-500 text-center mt-2">
                        {{ message }}
                    </p>

                    <!-- OK Button -->
                    <div class="mt-6 mb-6 w-full flex justify-center">
                        <button @click="close"
                            class="rounded bg-blue-600 text-white font-extrabold px-12 py-2 hover:bg-blue-700  text-sm font-mono tracking-widest transition">
                            Close
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </Transition>
</template>
