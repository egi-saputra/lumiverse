import { ref } from "vue";

// State module-level: dishare ke semua komponen yang import composable ini,
// jadi Navbar, halaman page, atau komponen lain manapun selalu baca nilai yang sama.
const isDark = ref(true);
let initialized = false;

function applyTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
}

/**
 * Baca preferensi tema dari localStorage (fallback ke prefers-color-scheme sistem)
 * lalu terapkan ke <html>. Idempotent — aman dipanggil dari beberapa komponen,
 * cuma akan benar-benar jalan sekali di seluruh lifecycle halaman.
 */
function initTheme() {
    if (initialized) return;
    initialized = true;

    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches;
    isDark.value = saved ? saved === "dark" : prefersDark;
    applyTheme(isDark.value);
}

function toggleTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
    applyTheme(isDark.value);
}

export function useTheme() {
    return { isDark, initTheme, toggleTheme };
}
