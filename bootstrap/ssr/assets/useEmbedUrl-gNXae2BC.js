function resolveEmbedUrl(url) {
  if (!url) return null;
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const gd = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (gd) return `https://drive.google.com/file/d/${gd[1]}/preview`;
  return null;
}
export {
  resolveEmbedUrl as r
};
