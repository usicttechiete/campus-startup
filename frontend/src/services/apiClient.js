import { supabase } from '../utils/supabaseClient.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const buildQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '');
  if (!entries.length) return '';
  const searchParams = new URLSearchParams();
  entries.forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
    } else {
      searchParams.set(key, value);
    }
  });
  return `?${searchParams.toString()}`;
};

const getAccessToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
};

export const apiFetch = async (endpoint, { method = 'GET', data, params, headers: customHeaders } = {}) => {
  const token = await getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(customHeaders || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`;

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(responseBody?.message || 'API request failed');
    error.status = response.status;
    error.details = responseBody;
    throw error;
  }

  return responseBody;
};
