export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api",
  timeout: 8000,
};

export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    profile: "/auth/profile",
  },
  properties: {
    list: "/properties",
  },
};
