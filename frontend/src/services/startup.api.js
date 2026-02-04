import { apiFetch } from './apiClient.js';

export const getMyStartup = () => apiFetch('/api/startups/me');

export const createStartup = (payload) =>
  apiFetch('/api/startups', {
    method: 'POST',
    data: payload,
  });

export const deleteMyStartup = () =>
  apiFetch('/api/startups/me', {
    method: 'DELETE',
  });
