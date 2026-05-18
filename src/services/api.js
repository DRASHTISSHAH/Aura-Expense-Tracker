// src/services/api.js
import axios from 'axios';
import { supabase } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : '/api');

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Transaction Methods
export const fetchTransactions = async (range) => {
  const response = await api.get('/transactions', { params: { range } });
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await api.post('/transactions', data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await api.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

export const fetchDashboardData = (range = 'all') => api.get('/transactions/dashboard-data', { params: { range } }).then(res => res.data);
export const fetchCombinedAppData = () => api.get('/transactions/combined').then(res => res.data);

// Wallet Methods
export const fetchWallets = async () => {
  const response = await api.get('/wallets');
  return response.data;
};

export const createWallet = async (data) => {
  const response = await api.post('/wallets', data);
  return response.data;
};

export const updateWallet = async (id, data) => {
  const response = await api.put(`/wallets/${id}`, data);
  return response.data;
};

export const deleteWallet = async (id) => {
  const response = await api.delete(`/wallets/${id}`);
  return response.data;
};

// Savings Methods
export const fetchSavings = async () => {
  const response = await api.get('/savings');
  return response.data;
};

export const createSavings = async (data) => {
  const response = await api.post('/savings', data);
  return response.data;
};

export const updateSavings = async (id, data) => {
  const response = await api.put(`/savings/${id}`, data);
  return response.data;
};

export const deleteSavings = async (id) => {
  const response = await api.delete(`/savings/${id}`);
  return response.data;
};

// Investment Methods
export const fetchInvestments = async () => {
  const response = await api.get('/investments');
  return response.data;
};

export const createInvestment = async (data) => {
  const response = await api.post('/investments', data);
  return response.data;
};

export const updateInvestment = async (id, data) => {
  const response = await api.put(`/investments/${id}`, data);
  return response.data;
};

export const deleteInvestment = async (id) => {
  const response = await api.delete(`/investments/${id}`);
  return response.data;
};

export default api;
