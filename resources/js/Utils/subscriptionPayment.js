import { router } from "@inertiajs/vue3";

/**
 * Proses response JSON dari endpoint charge/retry subscription (Xendit).
 * Satu titik kontrol untuk semua alur pembayaran subscription,
 * supaya PriceList / SubscriptionHistory / Invoice tidak duplikasi logic.
 *
 * @param {object} data - hasil res.json()
 * @param {object} handlers
 * @param {Function} [handlers.onError] - dipanggil kalau ada error (pesan string)
 * @param {Function} [handlers.onAlreadyPaid] - dipanggil kalau status ternyata sudah paid
 */
export function handleSubscriptionResponse(
    data,
    { onError, onAlreadyPaid } = {},
) {
    switch (data?.action) {
        case "activated":
        case "downgrade":
            router.reload({
                only: ["currentPlan", "expiresAt", "pendingPlan"],
            });
            return;

        case "already_paid":
            onAlreadyPaid?.();
            return;

        case "failed":
            onError?.("Transaksi ini sudah kedaluwarsa/dibatalkan.");
            router.reload();
            return;

        case "pay":
            if (!data.invoice_url) {
                onError?.(
                    "Gagal mendapatkan link pembayaran. Silakan coba lagi.",
                );
                return;
            }
            // Xendit = hosted invoice page, bukan popup token seperti Snap.
            // Browser harus pindah halaman penuh ke invoice_url.
            window.location.href = data.invoice_url;
            return;

        default:
            onError?.(data?.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
}

/**
 * Wrapper fetch POST JSON standar untuk endpoint subscription,
 * termasuk penanganan response non-2xx (mis. 502 dari Xendit gagal).
 */
export async function postSubscriptionJson(url, csrfToken, body = null) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
            Accept: "application/json",
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        // Controller balikin { message: '...' } untuk error 502 dari Xendit
        throw new Error(
            data?.message || "Gagal menghubungi server. Silakan coba lagi.",
        );
    }

    return data;
}
