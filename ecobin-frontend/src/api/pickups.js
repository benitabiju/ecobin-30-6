import { authFetch } from './auth';

// Fetches the logged-in citizen's pickup requests.
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

// Rule 5: Submit rating + feedback after a completed pickup
export async function submitPickupFeedback(pickupId, { rating, comments }) {
  return authFetch(`/pickups/${pickupId}/submit_feedback/`, {
    method: 'POST',
    body: JSON.stringify({ rating, comments }),
  });
}

// Check if citizen has any pending ratings (blocks new requests)
export async function getPendingRatingPickup() {
  const pickups = await getMyPickups();
  const all = Array.isArray(pickups) ? pickups : pickups.results || [];
  return all.find(p => p.pending_rating === true) || null;
}
