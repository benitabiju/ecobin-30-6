import React, { useEffect, useState } from 'react';
import { authFetch } from '../../api/auth';
import { getAssignedPickups } from '../../api/Collector';
import { getNotifications } from '../../api/notifications';
import { getMyProfile } from '../../api/Users';
import { MapPin, Trash2, TrendingUp, Award, Box, Bell } from 'lucide-react';
import ChangePasswordForm from '../../components/ChangePasswordForm';

export const CollectorRequests = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    getAssignedPickups()
      .then(data => setPickups(Array.isArray(data) ? data : data.results || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPickups = pickups.filter(p => {
    if (filter === 'active') return ['pending', 'assigned'].includes(p.status);
    return ['collected', 'recycled'].includes(p.status);
  });

  return (
    <div className="p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-lg border border-gray-100 dark:border-eco-sage/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white">Assigned Requests</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'active' ? 'bg-eco-forest text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'completed' ? 'bg-eco-forest text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">View pickups assigned to your route.</p>
      
      {loading ? (
        <p className="text-sm text-gray-500">Loading requests...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : filteredPickups.length === 0 ? (
        <p className="text-sm text-gray-500">No {filter} requests found.</p>
      ) : (
        <div className="space-y-4">
          {filteredPickups.map(pickup => (
            <div key={pickup.request_id} className="p-6 bg-white dark:bg-eco-charcoal rounded-xl border border-gray-100 dark:border-eco-sage/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0E1240] dark:text-white">
                  {pickup.category_detail?.category_name || 'Pickup Request'}
                </p>
                <p className="text-sm text-gray-500 dark:text-eco-sage mt-1">
                  Est. {pickup.quantity}kg • Scheduled {pickup.pickup_date}
                </p>
                {pickup.address && (
                  <p className="text-xs text-gray-500 dark:text-eco-sage mt-1">
                    📍 {pickup.address}
                  </p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${pickup.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : pickup.status === 'assigned' ? 'bg-blue-100 text-blue-800' : pickup.status === 'collected' ? 'bg-purple-100 text-purple-800' : pickup.status === 'recycled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {pickup.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CollectorBins = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    authFetch('/smart-bins/')
      .then(data => setBins(Array.isArray(data) ? data : data.results || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-lg border border-gray-100 dark:border-eco-sage/20">
      <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white mb-4">Assigned Bins</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Monitor the fill-levels and zones of bins in your area.</p>
      
      {loading ? (
        <p className="text-sm text-gray-500">Loading bins...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : bins.length === 0 ? (
        <p className="text-sm text-gray-500">No bins assigned.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bins.map(bin => (
            <div key={bin.bin_id} className="p-6 bg-white dark:bg-eco-charcoal rounded-xl border border-gray-100 dark:border-eco-sage/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4">
              <div className="p-3 bg-eco-sage/10 text-eco-forest rounded-lg">
                <Trash2 size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-[#0E1240] dark:text-white">Bin {bin.bin_id.substring(0, 8)}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <MapPin size={16} className="mr-1 text-eco-sage" /> Zone: {bin.location}
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-600 dark:text-gray-300">Fill Level</span>
                    <span className="font-bold text-eco-forest dark:text-white">{bin.fill_level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${bin.fill_level > 80 ? 'bg-red-500' : bin.fill_level > 50 ? 'bg-yellow-500' : 'bg-eco-forest'}`} 
                      style={{ width: `${bin.fill_level}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CollectorRecycling = () => {
  const mockStats = [
    { label: "Total Recycled", value: "2,450 kg", icon: <Box size={20} /> },
    { label: "Efficiency Rating", value: "94%", icon: <TrendingUp size={20} /> },
    { label: "Collector Rank", value: "#3", icon: <Award size={20} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-lg border border-gray-100 dark:border-eco-sage/20">
        <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white mb-2">Recycling Performance</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Your impact at a glance for this month.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockStats.map((stat, idx) => (
            <div key={idx} className="p-6 bg-gradient-to-br from-eco-forest/5 to-eco-sage/20 dark:from-white/5 dark:to-white/10 rounded-xl border border-eco-sage/20 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-white dark:bg-eco-charcoal text-eco-forest rounded-full shadow-sm hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-[#0E1240] dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CollectorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getNotifications()
      .then(data => setNotifications(Array.isArray(data) ? data : data.results || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-lg border border-gray-100 dark:border-eco-sage/20 min-h-[50vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white mb-6 w-full text-left">Notifications</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell size={48} className="mx-auto text-eco-forest dark:text-eco-sage opacity-50" />
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">You're all caught up!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications at the moment.</p>
        </div>
      ) : (
        <ul className="w-full max-w-3xl space-y-3">
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

export const CollectorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyProfile()
      .then(data => setProfile(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500 p-8">Loading profile...</p>;
  }
  if (error) {
    return <p className="text-sm text-red-500 p-8">{error}</p>;
  }

  const displayName = profile?.full_name || profile?.email || 'Collector';
  const avatarInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-lg border border-gray-100 dark:border-eco-sage/20">
      <h2 className="text-2xl font-bold text-[#0E1240] dark:text-white mb-6">Profile & Settings</h2>
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-eco-forest flex items-center justify-center text-white text-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-md">
          {avatarInitials}
        </div>
        <div>
          <p className="text-lg font-medium text-[#0E1240] dark:text-gray-200">{displayName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.email}</p>
          {profile?.phone && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">📞 {profile.phone}</p>}
        </div>
      </div>
      <div className="space-y-4 max-w-md mt-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
};
