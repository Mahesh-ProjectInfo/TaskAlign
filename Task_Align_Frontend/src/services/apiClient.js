import axios from "axios";

// Base URL for Spring Boot REST API integration.
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("ta_token") ||
    localStorage.getItem("taskalign_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Do not force application/json for FormData requests.
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export default apiClient;