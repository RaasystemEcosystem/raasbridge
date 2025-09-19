// Plac// src/api/raaspay.js
import axios from 'axios';

// Dynamic backend API URL from .env
const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/raaspay';

// Health check
export const healthCheck = () => axios.get(`${API}/health`);

// List all payments
export const listPayments = () => axios.get(`${API}/payments`);

// Create payment
export const createPayment = (payment) => axios.post(`${API}/transfer`, payment);

// (Optional) Check fake balance by address
export const checkBalance = (address) => axios.get(`${API}/balance/${address}`);
eholder for src/api/oracleApi.js