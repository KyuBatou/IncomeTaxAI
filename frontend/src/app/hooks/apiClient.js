import axios from "axios";
import { BASE_URL } from "app/utils/constant";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Attach JWT token automatically
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

export default apiClient;