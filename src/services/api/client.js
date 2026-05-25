import axios from "axios";
import { env } from "@/config/env";
import { tokenStorage } from "@/lib/storage";

const apiClient = axios.create({
  baseURL: `${env.apiBaseUrl}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    if (status === 401) {
      tokenStorage.clear();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
