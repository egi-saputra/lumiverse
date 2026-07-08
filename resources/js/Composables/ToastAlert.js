// resources/js/Composables/ToastAlert.js
import Swal from "sweetalert2";
import { usePage } from "@inertiajs/vue3";
import { onMounted } from "vue";

export function ToastAlert() {
    const page = usePage();

    // Helper posisi toast
    const getToastPosition = () =>
        window.innerWidth < 768 ? "bottom-start" : "top-end";
    const getToastWidth = () => (window.innerWidth < 768 ? "100%" : "auto");

    // Flash otomatis saat mounted
    onMounted(() => {
        const flashSuccess = page.props.flash?.success;
        const flashError = page.props.flash?.error;

        if (flashSuccess) {
            Swal.fire({
                icon: "success",
                title: flashSuccess,
                toast: true,
                position: getToastPosition(),
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
                width: getToastWidth(),
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });
        }

        if (flashError) {
            Swal.fire({
                icon: "error",
                title: flashError,
                toast: true,
                position: getToastPosition(),
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
                width: getToastWidth(),
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });
        }
    });

    // Toast custom
    function success(message) {
        Swal.fire({
            icon: "success",
            title: message,
            toast: true,
            position: getToastPosition(),
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            width: getToastWidth(),
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
    }

    function error(message) {
        Swal.fire({
            icon: "error",
            title: message,
            toast: true,
            position: getToastPosition(),
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            width: getToastWidth(),
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
    }

    function confirm({
        title = "Are you sure?",
        text = "",
        confirmButtonText = "Yes, Delete",
        cancelButtonText = "Cancel",
    } = {}) {
        return Swal.fire({
            title,
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            confirmButtonColor: "#dc2626",
        });
    }

    return { success, error, confirm };
}
