<script setup>
import { computed } from 'vue'

const props = defineProps({
    show: Boolean,
    title: String,
    message: String,
    image: String,
    variant: {
        type: String,
        default: 'danger', // danger | success | info
    },
})

const emit = defineEmits(['close', 'confirm'])

const variantClass = computed(() => ({
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700',
    info: 'bg-blue-600 hover:bg-blue-700',
}[props.variant]))
</script>

<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl w-full max-w-sm pt-20 pb-6 px-6 shadow-xl z-10">

            <!-- Floating Image -->
            <div v-if="image" class="absolute -top-16 left-1/2 -translate-x-1/2">
                <img :src="image" class="w-32 h-32 object-contain drop-shadow-xl" />
            </div>

            <h3 class="text-lg font-semibold text-center text-gray-800">
                {{ title }}
            </h3>

            <p class="text-sm text-gray-500 text-center mt-2">
                {{ message }}
            </p>

            <div class="flex gap-3 mt-6">
                <button @click="$emit('close')" class="flex-1 rounded-lg border px-4 py-2 text-sm hover:bg-gray-100">
                    Cancel
                </button>

                <button @click="$emit('confirm')"
                    :class="['flex-1 rounded-lg text-white px-4 py-2 text-sm', variantClass]">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>
