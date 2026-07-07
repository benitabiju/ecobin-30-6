import { authFetch } from './auth';

// Fetches the logged-in citizen's pickup requests.
// Assumes PickupRequestViewSet's get_queryset() filters by request.user â€”
// if it currently returns ALL requests instead, flag that to Claude to fix.
export async function getMyPickups() {
  return authFetch('/pickups/');
}

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export async function getCategories() {
  const response = await fetch(`${API_BASE}/categories/`);
  return response.json();
}

export async function createPickupRequest(data) {
  // If data is FormData, do not JSON.stringify it
  const isFormData = data instanceof FormData;
  return authFetch('/pickups/', {
    method: 'POST',
    body: isFormData ? data : JSON.stringify(data),
  });
}

export async function uploadCitizenProof(pickupId, formData) {
  return authFetch(`/pickups/${pickupId}/citizen_verify/`, {
    method: 'POST',
    body: formData,
  });
}
