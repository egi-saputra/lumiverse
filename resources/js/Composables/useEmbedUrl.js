export function resolveEmbedUrl(url) {
    if (!url) return null;

    // YouTube — semua format: watch?v=, youtu.be/, shorts/, embed/
    const yt = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/,
    );
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;

    // Google Drive
    const gd = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
    if (gd) return `https://drive.google.com/file/d/${gd[1]}/preview`;

    return null; // link tidak dikenali → tampilkan sebagai anchor biasa
}
