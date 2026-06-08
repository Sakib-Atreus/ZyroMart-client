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

const isLoginRequest = (config) => config?.url?.endsWith("/auth/login");

/**
 * Build a useful error message from the server response.
 * Prefers the first field-level validation detail over the generic top-level
 * "Validation error" so toasts actually tell the user what's wrong.
 */
const extractMessage = (err) => {
  const data = err.response?.data;
  const first = Array.isArray(data?.errorMessages) && data.errorMessages[0];
  if (first) {
    const label = first.path !== undefined && first.path !== "" ? `${first.path}: ` : "";
    return `${label}${first.message}`;
  }
  return data?.message || err.message;
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = extractMessage(err);

    if (status === 401 && !isLoginRequest(err.config)) {
      const hadToken = !!localStorage.getItem("token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (hadToken) {
        toast.error("Session expired — please log in again");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.assign("/login");
        }
      }
    } else if (status === 403 && message !== "EMAIL_NOT_VERIFIED") {
      toast.error(message || "You don't have access to this resource");
    } else if (status && status >= 500) {
      toast.error("Server error. Please try again.");
    }

    return Promise.reject({ ...err, message });
  }
);

export default api;
