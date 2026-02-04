import { apiFetch } from './apiClient.js';

export const getMe = () => apiFetch('/api/users/me');

export const getUserProfileById = (id) => apiFetch(`/api/users/profile/${id}`);

export const updateProfile = (profileData) =>
  apiFetch('/api/users/profile', {
    method: 'PUT',
    data: profileData,
  });

export const updateRole = (role) =>
  apiFetch('/api/users/profile', {
    method: 'PUT',
    data: { role },
  });

export const endorsePeer = (payload) =>
  apiFetch('/api/trust/endorse', {
    method: 'POST',
    data: payload,
  });

export const requestAdminUpgrade = (admin_password) =>
  apiFetch('/api/users/request-admin', {
    method: 'POST',
    data: { admin_password },
  });

export const requestStudentUpgrade = () =>
  apiFetch('/api/users/request-student', {
    method: 'POST',
  });
