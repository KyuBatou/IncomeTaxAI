import axios from "axios";
import { BASE_URL } from "app/utils/constant";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// 🔐 REQUEST: attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 RESPONSE: handle auth globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // clear auth
      localStorage.removeItem("accessToken");

      // optional: clear axios header
      delete apiClient.defaults.headers.common.Authorization;

      // force redirect
      window.location.href = "/session/signin";
    }

    return Promise.reject(error);
  }
);

export default apiClient;