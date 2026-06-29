/**
 * api.js
 * Centralised API layer for Lap AI.
 * All HTTP calls go through here — never call Axios directly from components.
 */

import axios from 'axios';

/* ── Axios instance ─────────────────────────────────────────────────────── */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000, // 30 s
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/* ── Request interceptor (attach auth token if needed later) ─────────────── */
apiClient.interceptors.request.use(
  config => config,
  error  => Promise.reject(error),
);

/* ── Response interceptor (normalise errors) ─────────────────────────────── */
apiClient.interceptors.response.use(
  response => response,
  error    => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    if (!error.response) {
      return Promise.reject(
        new Error('Unable to reach the server. Check your connection.'),
      );
    }
    const serverMsg =
      error.response.data?.error ||
      error.response.data?.message ||
      `Server error (${error.response.status})`;
    return Promise.reject(new Error(serverMsg));
  },
);

/* ── Public API functions ─────────────────────────────────────────────────── */

/**
 * Send a chat message to the Flask backend.
 * @param {string} message
 * @returns {Promise<string>} — bot reply text
 */
export async function sendMessage(message) {
  const { data } = await apiClient.post('/api/chat', { message });
  return data.reply;
}

/**
 * Health-check ping.
 * @returns {Promise<boolean>}
 */
export async function checkHealth() {
  try {
    await apiClient.get('/api/health');
    return true;
  } catch {
    return false;
  }
}