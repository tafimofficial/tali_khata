import axios from 'axios';

// Dynamically resolve API host — works on PC (localhost) and phone (LAN IP)
const API_HOST = '192.168.0.171'; // Hardcoded for Android App testing
const API_URL = `http://${API_HOST}:8000/api/`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSummary = () => api.get('summary/');
export const getUsers = () => api.get('users/');
export const getUser = (id) => api.get(`users/${id}/`);
export const createUser = (data) => api.post('users/', data);
export const updateUser = (id, data) => api.patch(`users/${id}/`, data);
export const deleteUser = (id) => api.delete(`users/${id}/`);

export const getTransactions = () => api.get('transactions/');
export const createTransaction = (data) => api.post('transactions/', data);
export const updateTransaction = (id, data) => api.patch(`transactions/${id}/`, data);

export default api;
