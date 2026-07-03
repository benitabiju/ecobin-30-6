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
