import { apiFetch } from './apiClient.js';

export const fetchEvents = (params) => apiFetch('/api/events', { params });

export const fetchEventDetail = (eventId) => apiFetch(`/api/events/${eventId}`);

export const createEvent = (payload) =>
  apiFetch('/api/events', {
    method: 'POST',
    data: payload,
  });

export const updateEvent = (eventId, payload) =>
  apiFetch(`/api/events/${eventId}`, {
    method: 'PATCH',
    data: payload,
  });

export const deleteEvent = (eventId) =>
  apiFetch(`/api/events/${eventId}`, {
    method: 'DELETE',
  });

export const fetchEventTimeline = (eventId) => apiFetch(`/api/events/${eventId}/timeline`);

export const fetchEventTeams = (eventId, params) => apiFetch(`/api/events/${eventId}/teams`, { params });

export const fetchEventResources = (eventId) => apiFetch(`/api/events/${eventId}/resources`);

export const fetchEventFaqs = (eventId) => apiFetch(`/api/events/${eventId}/faq`);

export const joinEventTeam = (eventId, payload) =>
  apiFetch(`/api/events/${eventId}/team`, {
    method: 'POST',
    data: payload,
  });

export const requestToJoinTeam = (eventId, teamId, payload) =>
  apiFetch(`/api/events/${eventId}/teams/${teamId}/requests`, {
    method: 'POST',
    data: payload,
  });

export const createEventTeam = (eventId, payload) =>
  apiFetch(`/api/events/${eventId}/teams`, {
    method: 'POST',
    data: payload,
  });

export const applySoloToEvent = (eventId, payload) =>
  apiFetch(`/api/events/${eventId}/solo`, {
    method: 'POST',
    data: payload,
  });

export const adminFetchEventSummary = (eventId) => apiFetch(`/api/events/${eventId}/admin/summary`);

export const adminFetchTeams = (eventId) => apiFetch(`/api/events/${eventId}/admin/teams`);

export const adminUpdateTeamStatus = (eventId, teamId, payload) =>
  apiFetch(`/api/events/${eventId}/admin/teams/${teamId}`, {
    method: 'PATCH',
    data: payload,
  });

export const adminMoveSoloParticipant = (eventId, participantId, targetTeamId) =>
  apiFetch(`/api/events/${eventId}/admin/participants/${participantId}/move`, {
    method: 'POST',
    data: { targetTeamId },
  });

export const adminFetchParticipants = (eventId) => apiFetch(`/api/events/${eventId}/admin/participants`);

export const adminLockTeamFormation = (eventId) =>
  apiFetch(`/api/events/${eventId}/admin/teams/lock`, {
    method: 'POST',
  });

export const adminAddResource = (eventId, payload) =>
  apiFetch(`/api/events/${eventId}/admin/resources`, {
    method: 'POST',
    data: payload,
  });

export const adminDeleteResource = (eventId, resourceId) =>
  apiFetch(`/api/events/${eventId}/admin/resources/${resourceId}`, {
    method: 'DELETE',
  });

export const adminCreateFaq = (eventId, payload) =>
  apiFetch(`/api/events/${eventId}/admin/faq`, {
    method: 'POST',
    data: payload,
  });

export const adminUpdateFaq = (eventId, faqId, payload) =>
  apiFetch(`/api/events/${eventId}/admin/faq/${faqId}`, {
    method: 'PATCH',
    data: payload,
  });

export const adminDeleteFaq = (eventId, faqId) =>
  apiFetch(`/api/events/${eventId}/admin/faq/${faqId}`, {
    method: 'DELETE',
  });
