const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : 'http://127.0.0.1:8000/api/v1';

export async function registerUser({ full_name, email, phone, address, password }) {
  const response = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, phone, address, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // BUG-03 fix: handle nested DRF error objects and plain strings
    const firstError = Object.values(data)[0];
    const message = Array.isArray(firstError)
      ? firstError[0]
      : typeof firstError === 'string'
      ? firstError
      : data.detail || data.error || 'Registration failed.';
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


export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function logoutUser() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  // Dispatch a storage event so other tabs / App.jsx can react
  window.dispatchEvent(new Event('storage'));
}

// ── Silent token refresh ──
// Returns the new access token on success, or null on failure.
let _refreshPromise = null; // de-duplicate concurrent refresh attempts

async function refreshAccessToken() {
  // If a refresh is already in flight, wait for that one instead of making two
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        // Some simplejwt configs also rotate the refresh token
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        return data.access;
      }
      return null;
    } catch {
      return null;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

// Wrapper around fetch that automatically attaches the JWT access token.
// On a 401 (expired access token) it silently refreshes once and retries.
// Use this for any request to a protected endpoint (e.g. /pickups/, /users/).
export async function authFetch(path, options = {}) {
  const doRequest = async (token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    return fetch(`${API_BASE}${path}`, { ...options, headers });
  };

  let response = await doRequest(getAccessToken());

  // ── Silent refresh on 401 ──
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Retry the original request with the fresh token
      response = await doRequest(newToken);
    }

    // If refresh also failed (or we still get 401), log out
    if (response.status === 401) {
      logoutUser();
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const firstError = Object.values(data)[0];
    const message = Array.isArray(firstError)
      ? firstError[0]
      : data.detail || data.error || 'Request failed.';
    throw new Error(message);
  }

  // Some endpoints (e.g. 204 No Content) won't have a body
  return response.status === 204 ? null : response.json();
}

export function isLoggedIn() {
  // Access token present is sufficient; authFetch will refresh it transparently
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

