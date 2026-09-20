/**
 * Header CSRF untuk fetch() manual.
 * Dibaca dari cookie XSRF-TOKEN di setiap pemanggilan, jadi selalu fresh
 * (Laravel memperbarui cookie ini di setiap response).
 */
export const getCsrfHeader = () => {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    return token ? { "X-XSRF-TOKEN": token } : {};
};
