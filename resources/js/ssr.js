import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ZiggyVue } from "../../vendor/tightenco/ziggy";
import { Ziggy } from "./ziggy.js";

const SSR_ALLOWED = ["Home/School", "Home/Workspace"];

createServer((page) => {
    // Halaman selain landing page: skip render Vue di server,
    // biarkan client hydrate normal (CSR biasa).
    if (!SSR_ALLOWED.includes(page.component)) {
        return Promise.resolve({
            head: [],
            body: `<div id="app" data-page='${JSON.stringify(page).replace(/'/g, "&#39;")}'></div>`,
        });
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
                .use(ZiggyVue, Ziggy);
        },
    });
});
