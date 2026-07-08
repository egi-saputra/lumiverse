// Nonaktifkan klik kanan (context menu)
document.addEventListener("contextmenu", (e) => e.preventDefault());

// Nonaktifkan copy (ctrl+c / cmd+c dan copy via menu)
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("cut", (e) => e.preventDefault());

// Nonaktifkan seleksi teks lewat drag (jaga-jaga selain CSS)
document.addEventListener("selectstart", (e) => e.preventDefault());

// Nonaktifkan beberapa shortcut keyboard umum (desktop)
document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + C, X, U (view source), S (save page), P (print), Shift+I/J (devtools Chrome)
    if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "x", "u", "s", "p"].includes(e.key.toLowerCase())
    ) {
        e.preventDefault();
    }
    if (e.key === "F12") e.preventDefault();
});
