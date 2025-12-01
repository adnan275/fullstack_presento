
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);

export const getProfile = () => api.get("/auth/me");

export const createProduct = (formData) =>
  api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getProducts = () => api.get("/products");

export default api;
