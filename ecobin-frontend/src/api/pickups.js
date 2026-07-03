import { authFetch } from './auth';

// Fetches the logged-in citizen's pickup requests.
// Assumes PickupRequestViewSet's get_queryset() filters by request.user â€”
// if it currently returns ALL requests instead, flag that to Claude to fix.
export async function getMyPickups() {
  return authFetch('/pickups/');
}

export async function getCategories() {
  return authFetch('/categories/');
}

export async function createPickupRequest(data) {
  return authFetch('/pickups/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
