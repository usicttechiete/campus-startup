import { apiFetch } from './apiClient.js';

export const fetchInternships = (params) => apiFetch('/api/internships', { params });

export const fetchInternshipById = (internshipId) => apiFetch(`/api/internships/${internshipId}`);

export const applyToInternship = (internshipId, payload) =>
  apiFetch(`/api/internships/${internshipId}/apply`, {
    method: 'POST',
    data: payload,
  });

export const fetchMyApplications = () => apiFetch('/api/internships/my/applications');

export const fetchJobsByStartup = (startupId) => apiFetch(`/api/internships/startup/${startupId}`);

export const checkApplicationStatus = (internshipId) => apiFetch(`/api/internships/${internshipId}/status`);
