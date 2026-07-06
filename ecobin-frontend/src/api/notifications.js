import { authFetch } from './auth';

export async function getNotifications() {
  return authFetch('/notifications/', { cache: 'no-store' });
}
