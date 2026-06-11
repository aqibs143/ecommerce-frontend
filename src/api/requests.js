import axios from "axios";
const api = axios.create({
  baseURL: "https://salessavvy-backend-difs.onrender.com",
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (
      token &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register") &&
      !config.url.includes("/signUp")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
