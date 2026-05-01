// =============================================
// utils/api.js
// Axios instance with base URL and auth header
// =============================================

import axios from "axios";

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://school-complaint-system.onrender.com/api",
});

// Interceptor: automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
