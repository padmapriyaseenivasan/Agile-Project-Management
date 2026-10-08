import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired / invalid token -> back to login (backend now returns 401)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-expired"));
    }
    return Promise.reject(error);
  }
);

// Readable message from any backend error
export const errMsg = (e, fallback = "Something went wrong") => {
  if (!e.response) return "Cannot reach the server. Is the backend running?";
  const d = e.response.data;
  if (typeof d === "string" && d) return d;
  return d?.message || fallback;
};

export default api;
