const API_BASE = 'http://127.0.0.1:8000/api/v1';

export async function registerUser({ full_name, email, phone, address, password }) {
  const response = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, phone, address, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const firstError = Object.values(data)[0];
    const message = Array.isArray(firstError) ? firstError[0] : 'Registration failed.';
    throw new Error(message);
  }

  // Save tokens if returned (development mode returns only message, production returns JWTs)
  if (data.access && data.refresh) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // DRF simplejwt returns { detail: "..." } on failure
    throw new Error(data.detail || 'Invalid email or password.');
  }

  // Save tokens so the user stays logged in across refreshes
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);

  return data;
}

export function logoutUser() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

// Wrapper around fetch that automatically attaches the JWT access token.
// Use this for any request to a protected endpoint (e.g. /pickups/, /users/).
export async function authFetch(path, options = {}) {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token missing/expired â€” log the user out and let the calling page redirect
    logoutUser();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const firstError = Object.values(data)[0];
    const message = Array.isArray(firstError) ? firstError[0] : (data.detail || 'Request failed.');
    throw new Error(message);
  }

  // Some endpoints (e.g. 204 No Content) won't have a body
  return response.status === 204 ? null : response.json();
}

export function isLoggedIn() {
  return !!getAccessToken();
}

export async function requestPasswordReset(email) {
  const response = await fetch(`${API_BASE}/auth/password-reset/request/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed.');
  }
  return data;
}

export async function confirmPasswordReset(token, new_password) {
  const response = await fetch(`${API_BASE}/auth/password-reset/confirm/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }
  return data;
}

