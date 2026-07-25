import { computed, unref } from "vue";
import { usePage } from "@inertiajs/vue3";
function useTenant(explicitTenant = null) {
  const page = usePage();
  const tenant = computed(
    () => unref(explicitTenant) ?? page.props.tenant ?? {}
  );
  const isWorkspace = computed(
    () => tenant.value.product_type === "workspace"
  );
  const isSmk = computed(
    () => (tenant.value.school_level ?? "").toString().toLowerCase() === "smk"
  );
  return { tenant, isWorkspace, isSmk };
}
export {
  useTenant as u
};
