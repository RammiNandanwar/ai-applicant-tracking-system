import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Add JWT token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Let Axios automatically set the correct
        // Content-Type when sending FormData
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;