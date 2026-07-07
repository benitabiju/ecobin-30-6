import { authFetch } from './auth';

// Rule 1: Compound Cleanups
export async function getCompoundCleanups() {
  return authFetch('/compound-cleanups/');
}

export async function updateCompoundCleanup(id, data) {
  return authFetch(`/compound-cleanups/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Rule 2: Street Cleanups
export async function getStreetCleanups() {
  return authFetch('/street-cleanups/');
}

export async function updateStreetCleanup(id, data) {
  return authFetch(`/street-cleanups/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Citizen: get own compound cleanups
export async function getMyCompoundCleanups() {
  return authFetch('/compound-cleanups/');
}
