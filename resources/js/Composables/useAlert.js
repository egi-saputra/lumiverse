// resources/js/Composables/useAlert.js
import Swal from "sweetalert2";
import { usePage } from "@inertiajs/vue3";
import { onMounted } from "vue";

export function useAlert() {
    const page = usePage();

    // Tampilkan flash otomatis saat mounted
    onMounted(() => {
        const flashSuccess = page.props.flash?.success;
        const flashError = page.props.flash?.error;

        if (flashSuccess) {
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: flashSuccess,
                showConfirmButton: true,
                confirmButtonColor: "#3b82f6", // tombol biru
            });
        }

        if (flashError) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: flashError,
                showConfirmButton: true,
                confirmButtonColor: "#3b82f6", // tombol biru
            });
        }
    });

    // Fungsi alert custom
    function success(message) {
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: message,
            showConfirmButton: true,
            confirmButtonColor: "#3b82f6", // tombol biru
        });
    }

    function error(message) {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: message,
            showConfirmButton: true,
            confirmButtonColor: "#3b82f6", // tombol biru
        });
    }

    function confirm({
        title = "Are you sure?",
        text = "",
        confirmButtonText = "Yes, Delete",
        cancelButtonText = "cancel",
    } = {}) {
        return Swal.fire({
            title,
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            confirmButtonColor: "#dc2626",
            // cancelButtonColor: "#ffffff",
            buttonsStyling: true,
        });
    }

    return { success, error, confirm };
}
