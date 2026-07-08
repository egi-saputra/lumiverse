import { ref, onMounted, onUnmounted } from "vue";

/**
 * Composable for triggering CSS animations on scroll using IntersectionObserver.
 * @param {number} threshold - Percentage of element visible before triggering (0–1)
 * @param {string} rootMargin - IntersectionObserver rootMargin
 */
export function useScrollAnimation(threshold = 0.15, rootMargin = "0px") {
    const elementRef = ref(null);
    const isVisible = ref(false);
    let observer = null;

    onMounted(() => {
        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    isVisible.value = true;
                    observer?.disconnect();
                }
            },
            { threshold, rootMargin },
        );
        if (elementRef.value) observer.observe(elementRef.value);
    });

    onUnmounted(() => {
        observer?.disconnect();
    });

    return { elementRef, isVisible };
}

/**
 * Animate a number from 0 to target value.
 * @param {number} target
 * @param {number} duration - ms
 * @param {Function} onUpdate - callback with current value
 */
export function animateCounter(target, duration = 2000, onUpdate) {
    const start = performance.now();
    const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        onUpdate(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
