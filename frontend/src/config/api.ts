import axios from "axios";

// In production, always use the production URL
const isProduction = import.meta.env.PROD;
// Use localhost in development, production URL otherwise
export const BACKEND_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://tripffer-backend.onrender.com";

// Use localhost for media in development, S3 in production
export const MEDIA_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : import.meta.env.VITE_MEDIA_URL ||
    "https://tripffer.s3.eu-north-1.amazonaws.com";

export const getImageUrl = (path: string, addTimestamp: boolean = false) => {
  if (!path) return "";
  if (path.startsWith("http")) {
    // For external URLs (like S3), add timestamp to prevent caching if requested
    return addTimestamp ? `${path}?t=${Date.now()}` : path;
  }
  // Remove any leading slashes and media prefix
  const cleanPath = path.replace(/^\//, "").replace(/^media\//, "");
  const url = `${MEDIA_URL}/${cleanPath}`;
  // Add timestamp to prevent caching if requested
  return addTimestamp ? `${url}?t=${Date.now()}` : url;
};

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Enable credentials for production
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Only set content type to JSON if it's not already set (e.g., for file uploads)
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("Response error:", error.response.data);

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear tokens on auth error
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Redirect to login
        window.location.href = "/login";
      }
    } else if (error.request) {
      // Request was made but no response
      console.error("Request error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
