import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

import { toast } from "sonner";

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 429) {
            toast.error("Too many requests. Please try again later.");
        }
        return Promise.reject(error);
    }
);

export default api;
