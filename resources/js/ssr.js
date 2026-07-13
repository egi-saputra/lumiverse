import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createHead, renderHeadToString } from "@vueuse/head";

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.vue`,
                import.meta.glob("./Pages/**/*.vue"),
            ),
        setup({ App, props, plugin }) {
            const head = createHead();
            const app = createSSRApp({ render: () => h(App, props) })
                .use(plugin)
                .use(head);

            return { app, head };
        },
    }),
);
