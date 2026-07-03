import { authFetch } from './auth';

export async function getRecycling() {
  return authFetch('/recycling/');
}

export async function createRecycling(data) {
  return authFetch('/recycling/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteRecycling(id) {
  return authFetch(`/recycling/${id}/`, {
    method: 'DELETE',
  });
}
