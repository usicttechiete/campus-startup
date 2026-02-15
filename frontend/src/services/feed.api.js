import { apiFetch } from './apiClient.js';

export const fetchFeed = (params) => apiFetch('/api/feed/posts', { params });

export const fetchFeedPostById = (postId) => apiFetch(`/api/feed/posts/${postId}`);

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

export const fetchPostUpdates = (postId) => apiFetch(`/api/feed/posts/${postId}/updates`);

export const createPostUpdate = (postId, payload) =>
  apiFetch(`/api/feed/posts/${postId}/updates`, {
    method: 'POST',
    data: payload,
  });
