import { computed, unref } from "vue";
import { usePage } from "@inertiajs/vue3";

export function useTenant(explicitTenant = null) {
    const page = usePage();

    // Prioritaskan tenant yang di-pass eksplisit (context Owner/central),
    // fallback ke shared prop (context tenant)
    const tenant = computed(
        () => unref(explicitTenant) ?? page.props.tenant ?? {},
    );

    const isSmk = computed(
        () =>
            (tenant.value.school_level ?? "").toString().toLowerCase() ===
            "smk",
    );

    return { tenant, isSmk };
}
