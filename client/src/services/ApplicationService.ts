// client\src\services\ApplicationService.ts

import api from './api';

// Create new job application
export const createApplication = (data: any, token: string) =>
  api.post('/api/applications', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get all applications for logged-in user
export const getApplications = (token: string) =>
  api.get('/api/applications', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Update a specific application by ID
export const updateApplication = (id: string, data: any, token: string) =>
  api.put(`/api/applications/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Delete a specific application by ID
export const deleteApplication = (id: string, token: string) =>
  api.delete(`/api/applications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
