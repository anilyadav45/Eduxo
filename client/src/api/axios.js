import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
});

// Attach token to all requests EXCEPT login
api.interceptors.request.use((config) => {
  if (config.url.includes("/auth/login")) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
