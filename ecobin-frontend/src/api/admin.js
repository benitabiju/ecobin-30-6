import { authFetch } from './auth';

export async function getSmartBins() {
  return authFetch('/smart-bins/');
}

export async function getAllPickups() {
  return authFetch('/pickups/');
}

export async function getAvailableCollectors() {
  return authFetch('/collectors/available/');
}

export async function getAllCollections() {
  return authFetch('/collections/');
}

export async function getAllRecycling() {
  return authFetch('/recycling/');
}

export async function getAuditLogs() {
  return authFetch('/audit-logs/');
}

export async function getAllNotifications() {
  return authFetch('/notifications/');
}

/**
 * Assign a collector to a pickup request.
 * Only admins can call this endpoint.
 */
export async function assignCollector(pickupId, collectorId) {
  return authFetch(`/pickups/${pickupId}/assign/`, {
    method: 'PATCH',
    body: JSON.stringify({ collector_id: collectorId }),
  });
}

export async function approvePickup(pickupId) {
  return authFetch(`/pickups/${pickupId}/approve/`, { method: 'POST' });
}

export async function rejectPickup(pickupId, reason) {
  return authFetch(`/pickups/${pickupId}/reject/`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function verifyCompletion(pickupId, action, reason) {
  return authFetch(`/pickups/${pickupId}/verify/`, {
    method: 'POST',
    body: JSON.stringify({ action, reason }),
  });
}

export async function triggerAutoComplete() {
  return authFetch('/pickups/trigger_auto_complete/', {
    method: 'POST'
  });
}

// Rule 1 & 2: Compound and Street Cleanup management (admin)
export async function getCompoundCleanups() {
  return authFetch('/compound-cleanups/');
}

export async function updateCompoundCleanup(id, data) {
  return authFetch(`/compound-cleanups/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function getStreetCleanups() {
  return authFetch('/street-cleanups/');
}

export async function updateStreetCleanup(id, data) {
  return authFetch(`/street-cleanups/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Rule 3, 4: Collector stats
export async function getAllCollectors() {
  return authFetch('/collectors/');
}
