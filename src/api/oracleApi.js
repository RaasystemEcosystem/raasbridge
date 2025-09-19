// src/api/oracleApi.js
import axios from "axios";

// Dynamic backend API base URL from .env (e.g., http://localhost:5000/api/raaspay)
// But we want /api/oracle, so better build from BACKEND_URL and replace /api/raaspay with /api/oracle
const baseAPI = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/raaspay').replace('/api/raaspay', '/api/oracle');

// Fetch latest gold price from backend oracle route
export const getGoldPrice = () => axios.get(`${baseAPI}/price`);
