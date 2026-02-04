import { apiFetch } from './apiClient.js';

export const fetchInternships = (params) => apiFetch('/api/internships', { params });

export const fetchInternshipById = (internshipId) => apiFetch(`/api/internships/${internshipId}`);

export const applyToInternship = (internshipId, payload) =>
  apiFetch(`/api/internships/${internshipId}/apply`, {
    method: 'POST',
    data: payload,
  });
