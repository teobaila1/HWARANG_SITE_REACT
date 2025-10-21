import axios from "axios";
import { API_BASE } from "../config";

/*
  .env recomandat:
  - .env.development  VITE_API_URL=http://localhost:5000
  - .env.production   VITE_API_URL=https://backend-hwarang-new.onrender.com
  În cod, folosești în continuare endpoint-uri cu prefix /api/...
*/
export const api = axios.create({
  baseURL: API_BASE || "",
  headers: { "Content-Type": "application/json" },
});
