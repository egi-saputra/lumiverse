import { computed } from "vue";
import { usePage } from "@inertiajs/vue3";

export function useCentralUrl() {
    const page = usePage();
    const centralDomain = computed(() => page.props.centralDomain);

    function centralUrl(path) {
        if (typeof window === "undefined") {
            // SSR: fallback https, aman karena centralDomain sudah dari server
            return `https://${centralDomain.value}${path}`;
        }
        const { protocol, port } = window.location;
        const portPart = port ? `:${port}` : "";
        return `${protocol}//${centralDomain.value}${portPart}${path}`;
    }

    return { centralUrl };
}
