import { apiFetch } from './apiClient.js';

export const adminListStartups = (params = {}) => apiFetch('/api/admin/startups', { params });

export const adminApproveStartup = (startupId) =>
  apiFetch(`/api/admin/startups/${startupId}/approve`, {
    method: 'PATCH',
  });

export const adminRejectStartup = (startupId, payload) =>
  apiFetch(`/api/admin/startups/${startupId}/reject`, {
    method: 'PATCH',
    data: payload,
  });
