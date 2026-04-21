import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Don't toast on /auth/login itself to avoid double messages
      if (!err.config?.url?.endsWith("/auth/login")) {
        toast.error("Session expired — please log in again");
        window.location.assign("/login");
      }
    } else if (status && status >= 500) {
      toast.error("Server error. Please try again.");
    }

    return Promise.reject({ ...err, message });
  }
);

export default api;
