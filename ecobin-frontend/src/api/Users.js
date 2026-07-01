import { authFetch } from './auth';

// Fetches the logged-in user's own profile, including `role`.
// Backed by UserProfileViewSet's /users/me/ GET action.
export async function getMyProfile() {
  return authFetch('/users/me/');
}
