import axios from "axios";
const isDevelopment = import.meta.env.MODE === "development";
const api = axios.create({
  baseURL: isDevelopment
    ? "http://localhost:5000/api"
    : import.meta.env.VITE_API_URL,
  withCredentials: true,
});
export default api;