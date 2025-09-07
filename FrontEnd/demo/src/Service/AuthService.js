import axios from "axios";

const API_URL = process.env.BASEURL || "http://localhost:5454";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services
export const signup = async (formData) => {
  const { data } = await api.post("/auth/signup", formData);
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
};

export const login = async (formData) => {
  const { data } = await api.post("/auth/login", formData);
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/user/me");
  return data;
};

export const logout = () => {
  localStorage.clear();
};

export const getRole = () => localStorage.getItem("role");
export const getUser = () => JSON.parse(localStorage.getItem("user"));
export const isAuthenticated = () => !!localStorage.getItem("token");
