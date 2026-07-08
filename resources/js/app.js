import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createApp, h } from "vue";
import { createHead } from "@vueuse/head";
import { ZiggyVue } from "../../vendor/tightenco/ziggy";

const appName = import.meta.env.VITE_APP_NAME || "Lumiverse School";

// deteksi apakah mobile
const isMobile = window.innerWidth < 768;

createInertiaApp({
    // title: (title) => `${title} | ${appName}`,
    title: (title) => `${title}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob("./Pages/**/*.vue"),
        ),
    setup({ el, App, props, plugin }) {
        const head = createHead();

        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(head)
            .mount(el);
    },
    progress: isMobile
        ? {
              color: "#2563EB",
              includeCSS: true,
              showSpinner: true,
          }
        : false,
    // progress: {
    //     color: "#00D4FF",
    //     showSpinner: false,
    // },
});
