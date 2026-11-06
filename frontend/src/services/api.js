/**
 * API Service for CareerPath
 * Uses VITE_API_URL for all network requests.
 * Never hardcodes localhost URLs.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Helper to execute fetch with JSON headers and optional Bearer token
 */
async function request(endpoint, options = {}, token = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg =
      (data && data.error) ||
      (data && data.message) ||
      `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Career Endpoints
  getMatches: (scores) => {
    const params = new URLSearchParams({
      analytical: scores.analytical,
      creative: scores.creative,
      social: scores.social,
      technical: scores.technical
    });
    return request(`/api/careers/matches?${params.toString()}`);
  },

  getAllCareers: () => {
    return request('/api/careers');
  },

  getCareerById: (id) => {
    return request(`/api/careers/${id}`);
  },

  // Mentor Endpoints
  getMentors: (focus = '') => {
    const query = focus && focus !== 'All' ? `?focus=${encodeURIComponent(focus)}` : '';
    return request(`/api/mentors${query}`);
  },

  // User Endpoints (Protected by Firebase Bearer Token)
  syncUser: (token, profileData = {}) => {
    return request('/api/users/sync', {
      method: 'POST',
      body: JSON.stringify(profileData)
    }, token);
  },

  getUserProfile: (token) => {
    return request('/api/users/profile', { method: 'GET' }, token);
  },

  saveQuiz: (token, quizPayload) => {
    return request('/api/users/quiz', {
      method: 'PUT',
      body: JSON.stringify(quizPayload)
    }, token);
  },

  saveCareer: (token, careerId) => {
    return request(`/api/users/saved/${careerId}`, {
      method: 'POST'
    }, token);
  },

  unsaveCareer: (token, careerId) => {
    return request(`/api/users/saved/${careerId}`, {
      method: 'DELETE'
    }, token);
  },

  bookMentorSession: (token, bookingPayload) => {
    return request('/api/users/book', {
      method: 'POST',
      body: JSON.stringify(bookingPayload)
    }, token);
  }
};
