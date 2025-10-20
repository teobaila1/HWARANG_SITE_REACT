import axios from "axios";
import { API_BASE } from "../config";

export const api = axios.create({
  baseURL: API_BASE || "",
  withCredentials: true, // trimite cookie-uri httpOnly JWT
  headers: {
    "Content-Type": "application/json",
  },
});

// opțional: tratează erorile 401 global
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("Neautentificat — token invalid sau expirat.");
    }
    return Promise.reject(err);
  }
);
