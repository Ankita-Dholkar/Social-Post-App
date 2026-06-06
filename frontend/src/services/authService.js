import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("socialUser");
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupApi = (data) => API.post("/auth/signup", data);
export const loginApi  = (data) => API.post("/auth/login", data);
export const getMeApi  = ()     => API.get("/auth/me");

export default API;
