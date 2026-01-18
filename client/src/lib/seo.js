export const BASE_URL = import.meta.env.VITE_APP_URL;

export const buildUrl = (path = "") => {
    // Ensure clean base without trailing slash
    const base = BASE_URL.replace(/\/$/, "");
    
    // Ensure path starts with slash
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    // Combine and return
    return `${base}${cleanPath.split('?')[0]}`; // Strip query params
};
