import axios from "axios";

// In dev (npm run dev) this is left unset, so requests hit "/api" and Vite's
// dev proxy (see vite.config.js) forwards them to your local backend.
// In production (Vercel), set VITE_API_URL in the frontend project's
// Environment Variables to your deployed backend's full URL, e.g.
//   https://sensora-api.vercel.app/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sensora_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sensora_admin_token");
      localStorage.removeItem("sensora_admin");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
