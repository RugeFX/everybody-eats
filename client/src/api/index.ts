import axios from "axios";
import { useAuthStore } from "../lib/store";

export const apiClient = axios.create({
        baseURL: import.meta.env.VITE_BASE_API_URL + "/api",
        withXSRFToken: true,
        withCredentials: true,
        headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
        },
});

apiClient.interceptors.request.use((config) => {
        const token = useAuthStore.getState().token;
        config.headers.Authorization = token;
        return config;
})

