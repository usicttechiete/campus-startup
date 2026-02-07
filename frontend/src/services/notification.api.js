import { apiFetch } from './apiClient.js';

export const getMyNotifications = (params = {}) =>
  apiFetch('/api/notifications/me', { params });

export const markNotificationRead = (id) =>
  apiFetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  });
