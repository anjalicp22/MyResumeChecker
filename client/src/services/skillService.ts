// client/src/services/skillService.ts
import api from './api';

export const getSkills = (token: string) =>
  api.get('/api/skills', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getSkillsForResume = (resumeId: string, token: string) =>
  api.get(`/api/skills?source=resume&ref=${resumeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const saveAnalyzedSkills = (
  payload: {
    resumeId: string;
    existing_skills: string[];
    suggested_skills?: string[];
  },
  token: string
) =>
  api.post('/api/skills/analyze', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const getSkillFrequency = (token: string) =>
  api.get("/api/skills/frequency", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getGapForPair = (
  resumeId: string,
  applicationId: string,
  token: string
) =>
  api.get(`/api/skills/gap?resumeId=${resumeId}&applicationId=${applicationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });