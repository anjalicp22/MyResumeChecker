//services/resumeService.ts
import api from './api.ts';

export const uploadResume = (formData: FormData) =>
  api.post('/api/resume', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const getResumes = (token: string) =>
  api.get('/api/resume', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
