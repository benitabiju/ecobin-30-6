import { authFetch } from './auth';

// Fetches the logged-in user's own profile, including `role`.
// Backed by UserProfileViewSet's /users/me/ GET action.
export async function getMyProfile() {
  return authFetch('/users/me/');
}

// Fetches all users (admin only)
export async function getAllUsers() {
  return authFetch('/users/');
}

export async function deleteUser(userId) {
  return authFetch(`/users/${userId}/`, { method: 'DELETE' });
}

export async function updateMyProfile(data) {
  return authFetch('/users/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
