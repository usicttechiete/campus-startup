import { apiFetch } from './apiClient.js';

export const getComments = (postId) => 
  apiFetch(`/api/posts/${postId}/comments`);

export const createComment = (postId, content) =>
  apiFetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    data: { content },
  });

export const deleteComment = (commentId) =>
  apiFetch(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });