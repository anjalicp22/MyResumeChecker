//services/resumeService.ts
import api from './api';

// export const uploadResume = (formData: FormData) =>
//   api.post('/api/resume', formData, {
//   headers: { 'Content-Type': 'multipart/form-data' },
// });
export const uploadResume = (formData: FormData, token: string | null) =>
  api.post('/api/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

export const getResumes = (token: string) =>
  api.get('/api/resume', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
