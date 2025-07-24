import axios from "axios";

type DataType =
  | {
      [key: string]: any;
    }
  | any[];

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle image URLs
api.interceptors.response.use(
  (response) => {
    // If the response contains image URLs, convert them to full URLs
    if (response.data) {
      const processImageUrls = (data: DataType): DataType => {
        if (Array.isArray(data)) {
          return data.map((item) => processImageUrls(item));
        }
        if (typeof data === "object" && data !== null) {
          const processed = { ...data };
          for (const key in processed) {
            if (
              typeof processed[key] === "string" &&
              processed[key].startsWith("/media/")
            ) {
              processed[key] = `http://localhost:8000${processed[key]}`;
            } else if (typeof processed[key] === "object") {
              processed[key] = processImageUrls(processed[key]);
            }
          }
          return processed;
        }
        return data;
      };
      response.data = processImageUrls(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
