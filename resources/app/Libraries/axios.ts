import axios from "axios";

const api = axios.create({ baseURL: `/api` })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("user_auth");

    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`)
    }
    return config
})

api.interceptors.response.use((response) => response, (error) => {
    if (error.response.status === 401) {
        window.dispatchEvent(new Event("unauthorized"))
    }

    return Promise.reject(error.response || error);
})

export default api