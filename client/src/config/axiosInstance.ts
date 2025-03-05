import axios from "axios";
import { auth } from "./firebase";

const apiUrl = import.meta.env.REACT_APP_API_BASE_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: apiUrl || "http://localhost:8082/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach the Firebase Auth token
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth?.currentUser;
    if (currentUser) {
      const token = await currentUser?.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
