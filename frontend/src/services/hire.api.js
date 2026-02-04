import { apiFetch } from './apiClient.js';

export const fetchHireJobs = (params) => apiFetch('/api/hire/jobs', { params });

export const postJob = (payload) =>
  apiFetch('/api/hire/jobs', {
    method: 'POST',
    data: payload,
  });

export const fetchJobApplicants = (jobId) => apiFetch(`/api/hire/jobs/${jobId}/apps`);

export const updateApplicationStatus = (applicationId, payload) =>
  apiFetch(`/api/hire/apps/${applicationId}`, {
    method: 'PATCH',
    data: payload,
  });
