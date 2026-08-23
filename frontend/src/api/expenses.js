import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const getExpenses = () => api.get('/expenses');

export const getExpense = (id) => api.get(`/expenses/${id}`);

export const createExpense = (data) => api.post('/expenses', data);

export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);

export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export default api;