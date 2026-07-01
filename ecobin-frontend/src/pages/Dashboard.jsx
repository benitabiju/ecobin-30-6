import React, { useEffect, useState } from 'react';
import { getMyPickups } from '../api/pickups';
import { getMyProfile } from '../api/Users';
import CollectorDashboard from './Collectordashboard';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  collected: 'bg-purple-100 text-purple-800',
  recycled: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function CitizenDashboard() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPickups() {
      try {
        const data = await getMyPickups();
        setPickups(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPickups();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-2">
        Your dashboard
      </h1>
      <p className="text-sm text-eco-mint dark:text-eco-sage mb-10">
        Track your pickup requests and their status.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-eco-mint dark:text-eco-sage">Loading your requests...</p>
      ) : pickups.length === 0 ? (
        <div className="p-8 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 text-center">
          <p className="text-sm text-eco-mint dark:text-eco-sage">
            You haven't made any pickup requests yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pickups.map((pickup) => (
            <div
              key={pickup.request_id}
              className="p-6 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-eco-forest dark:text-white">
                  {pickup.category_detail?.category_name || 'Pickup Request'}
                </p>
                <p className="text-sm text-eco-mint dark:text-eco-sage mt-1">
                  {pickup.quantity}kg Â· Scheduled {pickup.pickup_date}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[pickup.status] || 'bg-gray-100 text-gray-800'}`}
              >
                {pickup.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getMyProfile();
        setRole(profile.role);
      } catch (err) {
        setProfileError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  if (loadingProfile) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-sm text-eco-mint dark:text-eco-sage">Loading your dashboard...</p>
      </main>
    );
  }

  if (profileError) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {profileError}
        </div>
      </main>
    );
  }

  if (role === 'collector') {
    return <CollectorDashboard />;
  }

  // Admins land on the citizen view for now too â€” swap in an AdminDashboard
  // here later if/when you build one.
  return <CitizenDashboard />;
}
