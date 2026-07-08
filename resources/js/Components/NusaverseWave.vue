<template>
    <div class="absolute bottom-0 left-0 w-full pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" class="w-full h-44 md:h-56 block">
            <!-- BACK WAVE -->
            <path :fill="backColor" d="M0,180 C240,260 480,120 720,160 960,200 1200,260 1440,220 L1440,320 L0,320 Z">
                <animate attributeName="d" :dur="backDur" repeatCount="indefinite" :values="backValues" />
            </path>

            <!-- MIDDLE WAVE -->
            <path :fill="midColor" d="M0,210 C300,280 540,140 760,180 980,220 1180,260 1440,200 L1440,320 L0,320 Z">
                <animate attributeName="d" :dur="midDur" repeatCount="indefinite" :values="midValues" />
            </path>

            <!-- FRONT WAVE -->
            <path :fill="frontColor" d="M0,240 C240,200 480,280 720,240 960,200 1200,220 1440,180 L1440,320 L0,320 Z">
                <animate attributeName="d" :dur="frontDur" repeatCount="indefinite" :values="frontValues" />
            </path>
        </svg>
    </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
    // colors
    backColor: { type: String, default: "rgba(255,255,255,0.08)" },
    midColor: { type: String, default: "rgba(255,255,255,0.16)" },
    frontColor: { type: String, default: "rgba(255,255,255,0.28)" },

    // animation durations
    backDur: { type: String, default: "16s" },
    midDur: { type: String, default: "12s" },
    frontDur: { type: String, default: "20s" },

    // animation path values
    backValues: {
        type: String,
        default: `
      M0,180 C240,260 480,120 720,160 960,200 1200,260 1440,220 L1440,320 L0,320 Z;
      M0,200 C240,180 480,260 720,200 960,160 1200,220 1440,180 L1440,320 L0,320 Z;
      M0,180 C240,260 480,120 720,160 960,200 1200,260 1440,220 L1440,320 L0,320 Z
    `,
    },
    midValues: {
        type: String,
        default: `
      M0,210 C300,280 540,140 760,180 980,220 1180,260 1440,200 L1440,320 L0,320 Z;
      M0,190 C300,220 540,280 760,220 980,180 1180,240 1440,220 L1440,320 L0,320 Z;
      M0,210 C300,280 540,140 760,180 980,220 1180,260 1440,200 L1440,320 L0,320 Z
    `,
    },
    frontValues: {
        type: String,
        default: `
      M0,240 C240,200 480,280 720,240 960,200 1200,220 1440,180 L1440,320 L0,320 Z;
      M0,230 C240,220 480,240 720,260 960,240 1200,200 1440,200 L1440,320 L0,320 Z;
      M0,240 C240,200 480,280 720,240 960,200 1200,220 1440,180 L1440,320 L0,320 Z
    `,
    },
});
</script>

<style scoped>
/* optional: smooth GPU transform hint */
svg path {
    will-change: transform;
}
</style>
