import axios from "axios";
import { router } from "../Router/router";

const api = axios.create({ baseURL: `/api` })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("user_auth");

    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`)
    }
    return config
})

api.interceptors.response.use((response) => response, (error) => {
    const status = error?.response?.status;

    if (status === 401) {
        localStorage.removeItem("user_auth");
        window.dispatchEvent(new Event("unauthorized"));
        router.navigate("/login", { replace: true });
    }

    if (status === 403) {
        window.alert(error?.response?.data?.message || "You don't have permission.");
        router.navigate("/workspaces", { replace: true });
    }

    return Promise.reject(error.response || error);
})

export default api