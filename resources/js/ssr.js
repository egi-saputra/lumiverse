import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ZiggyVue } from "../../vendor/tightenco/ziggy";

// Hanya halaman publik/landing yang butuh SSR (untuk SEO: meta tags, JSON-LD).
// Sesuaikan nama komponen ini persis dengan yang dipakai di Inertia::render()
// pada routes/web.php. Semua halaman lain (dashboard, register, auth, dll)
// tetap CSR — tidak perlu SEO dan lebih rawan error (window, store client-only).
const SSR_ENABLED_PAGES = new Set(["Home/School", "Home/Workspace"]);

createServer((page) => {
    if (!SSR_ENABLED_PAGES.has(page.component)) {
        // Bentuk kosong yang valid, BUKAN null — supaya Inertia-Laravel
        // fallback ke CSR dengan aman tanpa membuat proses Node SSR crash.
        return Promise.resolve({ head: [], body: "" });
    }

    return createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.vue`,
                import.meta.glob("./Pages/**/*.vue"),
            ),
        setup({ App, props, plugin }) {
            return createSSRApp({ render: () => h(App, props) })
                .use(plugin)
                .use(ZiggyVue, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });
        },
    });
});
