// src/services/authService.ts

import api from './api';

export const login = (data: any) => api.post('/api/auth/login', data);
export const register = (data: any) => api.post('/api/auth/register', data);
export const logout = () => api.post('/api/auth/logout');
