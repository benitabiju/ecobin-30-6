import React, { useEffect, useState } from 'react';
import { getMyProfile } from '../../api/Users';
import { Bell, MapPin } from 'lucide-react';
import { getNotifications } from '../../api/notifications';
import { getMyPickups } from '../../api/pickups';
import ChangePasswordForm from '../../components/ChangePasswordForm';

// Component to list the citizen's pickup requests
export const CitizenRequests = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMyPickups();
        setPickups(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message || 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading requests...</p>;
  }
  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }
  if (pickups.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-eco-sage">No pickup requests found.</p>;
  }

  return (
    <div className="space-y-4">
      {pickups.map((p) => (
        <div key={p.request_id} className="p-4 bg-white dark:bg-eco-charcoal rounded-xl border border-gray-100 dark:border-eco-sage/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h3 className="font-semibold text-[#0E1240] dark:text-white">
            {p.category_detail?.category_name || 'Pickup Request'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-eco-sage mt-1">
            {p.quantity}kg • {p.pickup_date}
          </p>
          <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : p.status === 'collected' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
            {p.status}
          </span>
        </div>
      ))}
    </div>
  );
};

// Keep other placeholder pages simple
export const CitizenBins = () => (
  <div className="p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-lg border border-gray-100 dark:border-eco-sage/20">
    <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white mb-4">Nearby Bins</h2>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Explore bins in your vicinity.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[{ id: 1, name: 'Bin #1', location: 'Main Street' },
        { id: 2, name: 'Bin #2', location: 'Oak Avenue' },
        { id: 3, name: 'Bin #3', location: 'River Road' },
        { id: 4, name: 'Bin #4', location: 'Pine Lane' }].map(bin => (
        <div key={bin.id} className="p-4 bg-white/30 dark:bg-white/10 rounded-xl border border-white/20 backdrop-blur-md shadow-lg flex items-start space-x-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <MapPin size={20} className="mt-1 text-eco-forest dark:text-eco-sage" />
          <div>
            <h3 className="font-semibold text-[#0E1240] dark:text-white">{bin.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <span className="mr-1">📍</span>{bin.location}
            </p>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(bin.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-eco-forest dark:text-eco-sage text-sm hover:underline mt-1 block"
            >
              View on map
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export const CitizenRecycling = () => {
  const mockRecords = [
    { id: 1, recycling_center: 'GreenEarth Center', recycled_weight: 15.5, recycled_date: '2026-06-15' },
    { id: 2, recycling_center: 'City Recyclers', recycled_weight: 8.2, recycled_date: '2026-06-20' },
    { id: 3, recycling_center: 'Eco Hub', recycled_weight: 22.0, recycled_date: '2026-07-01' },
  ];

  return (
    <div className="p-8 bg-white/30 dark:bg-white/10 rounded-xl shadow-lg border border-white/20 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white mb-4">Recycling History</h2>
      {mockRecords.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No recycling records found.</p>
      ) : (
        <ul className="space-y-3">
          {mockRecords.map(rec => (
            <li
              key={rec.id}
              className="p-4 bg-white/30 dark:bg-white/10 rounded-xl border border-white/20 flex justify-between items-center backdrop-blur-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <p className="font-medium text-[#0E1240] dark:text-white">
                  {rec.recycling_center} – {rec.recycled_weight} kg
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{rec.recycled_date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export const CitizenFeedback = () => (
  <div className="p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-lg border border-gray-100 dark:border-eco-sage/20">
    <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white mb-4">Feedback</h2>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">We value your thoughts. Share suggestions or report issues.</p>
    <form className="space-y-3">
      <textarea className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-eco-charcoal text-gray-800 dark:text-gray-200" rows={5} placeholder="Your feedback..." required />
      <button type="submit" className="px-4 py-2 bg-eco-forest text-white rounded-md hover:bg-eco-forest/80 transition-colors font-medium">Submit</button>
    </form>
  </div>
);
export const CitizenNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getNotifications()
      .then(data => setNotifications(Array.isArray(data) ? data : data.results || []))
      .catch(err => setError(err.message || 'Failed to fetch notifications'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>;
  }
  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-sm border border-gray-100 dark:border-eco-sage/20">
        <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white mb-4">
          Notifications
        </h2>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={48} className="mx-auto text-eco-forest dark:text-eco-sage" />
            <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">You're all caught up!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications at the moment.</p>
          </div>
        ) : (
          <ul className="w-full max-w-2xl space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="p-4 bg-gray-50 dark:bg-eco-sage rounded-xl border border-gray-200 dark:border-eco-sage/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <p className="text-sm text-gray-800 dark:text-gray-200">{n.message || 'No message'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
};
export const CitizenProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyProfile()
      .then(data => {
        setProfile(data);
      })
      .catch(err => setError(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>;
  }
  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }

  const displayName = profile?.full_name || profile?.email || 'User';
  const avatarInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-lg border border-gray-100 dark:border-eco-sage/20">
      <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white mb-4">Profile & Settings</h2>
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-eco-forest flex items-center justify-center text-white text-2xl font-bold hover:scale-105 transition-transform duration-300">
          {avatarInitials}
        </div>
        <div>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{displayName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.email}</p>
        </div>
      </div>
      
      <div className="max-w-md mt-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
};
