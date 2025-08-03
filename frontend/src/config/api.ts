import axios from "axios";

// In production, always use the production URL
const isProduction = import.meta.env.PROD;
export const BACKEND_URL = "https://tripffer.onrender.com";
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || "https://tripffer.s3.eu-north-1.amazonaws.com";

export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Remove any leading slashes and media prefix
  const cleanPath = path.replace(/^\//, '').replace(/^media\//, '');
  return `${MEDIA_URL}/${cleanPath}`;
};

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('Request error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
