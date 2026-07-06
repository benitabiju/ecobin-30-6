import { authFetch } from './auth';

export async function getSmartBins() {
  return authFetch('/smart-bins/');
}

export async function getAllPickups() {
  return authFetch('/pickups/');
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
