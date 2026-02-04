import { apiFetch } from './apiClient.js';

export const fetchFeed = (params) => apiFetch('/api/feed/posts', { params });

export const createFeedPost = (payload) =>
  apiFetch('/api/feed/posts', {
    method: 'POST',
    data: payload,
  });

export const joinFeedPost = (postId, payload) =>
  apiFetch(`/api/feed/posts/${postId}/collaborate`, {
    method: 'POST',
    data: payload,
  });

export const deleteFeedPost = (postId) =>
  apiFetch(`/api/feed/posts/${postId}`, {
    method: 'DELETE',
  });
