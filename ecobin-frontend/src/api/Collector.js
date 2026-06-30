import { authFetch } from './auth';

// Returns pickups assigned to the logged-in collector.
// Reuses the same /pickups/ endpoint as citizens — the backend's
// get_queryset() on PickupRequestViewSet already filters by
// assigned_collector_id when request.user.role === 'collector',
// so no separate endpoint is needed here.
export async function getAssignedPickups() {
  return authFetch('/pickups/');
}

// Updates a pickup's status (e.g. 'collected').
// NOTE: backend comments reference both /pickups/{id}/status/ and
// /pickup-requests/{id}/status/ as the action path — using /pickups/
// here to match the working getMyPickups() convention. Confirm against
// your urls.py router prefix if this 404s.
export async function updatePickupStatus(requestId, newStatus) {
  return authFetch(`/pickups/${requestId}/status/`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }),
  });
}

// Logs the actual collected weight + optional notes for a completed pickup.
// ASSUMPTION: hits a /collections/ endpoint (CollectionViewSet) and expects
// field names `pickup`, `weight_kg`, `notes`. These field names are guesses —
// confirm against your actual Collection model/serializer and adjust if needed.
export async function logCollection(requestId, weightKg, notes) {
  return authFetch('/collections/', {
    method: 'POST',
    body: JSON.stringify({
      pickup: requestId,
      weight_kg: weightKg,
      notes: notes || '',
    }),
  });
}