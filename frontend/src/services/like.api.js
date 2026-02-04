import { apiFetch } from './apiClient.js';

export const getLikes = (postId) => 
  apiFetch(`/api/posts/${postId}/likes`);

export const getLikeInfo = (postId) =>
  apiFetch(`/api/posts/${postId}/like-info`);

export const toggleLike = (postId) =>
  apiFetch(`/api/posts/${postId}/like`, {
    method: 'POST',
  });