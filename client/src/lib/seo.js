export const BASE_URL = import.meta.env.VITE_APP_URL;

export const buildUrl = (path = "") =>
    `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
