import React, { useEffect, useState } from 'react';
import { authFetch } from '../../api/auth';
import { getAssignedPickups } from '../../api/Collector';
import { getNotifications } from '../../api/notifications';
import { getMyProfile } from '../../api/Users';
import { MapPin, Trash2, TrendingUp, Award, Box, Bell, User, Phone, RefreshCw } from 'lucide-react';

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-800',
  assigned:  'bg-blue-100 text-blue-800',
  collected: 'bg-purple-100 text-purple-800',
  recycled:  'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const CollectorRequests = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('active');
  const [refreshing, setRefreshing] = useState(false);

  const loadPickups = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await getAssignedPickups();
      setPickups(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPickups();
    // Auto-refresh every 30s for real-time updates
    const interval = setInterval(() => loadPickups(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredPickups = pickups.filter(p => {
    if (filter === 'active') return ['pending', 'assigned'].includes(p.status);
    return ['collected', 'recycled'].includes(p.status);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-primary">Assigned Requests</h2>
          <p className="text-sm text-secondary mt-0.5">View pickups assigned to your route.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'active' ? 'bg-eco-forest text-white' : 'bg-gray-100 text-secondary dark:bg-gray-800 hover:bg-gray-200'}`}
            >
              Active ({pickups.filter(p => ['pending','assigned'].includes(p.status)).length})
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'completed' ? 'bg-eco-forest text-white' : 'bg-gray-100 text-secondary dark:bg-gray-800 hover:bg-gray-200'}`}
            >
              Completed ({pickups.filter(p => ['collected','recycled'].includes(p.status)).length})
            </button>
          </div>
          <button
            onClick={() => loadPickups(true)}
            disabled={refreshing}
            className="p-2 rounded-lg border border-gray-200 text-muted hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading requests...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : filteredPickups.length === 0 ? (
        <div className="p-8 card-modern text-center">
          <p className="text-sm text-muted">No {filter} requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPickups.map(pickup => (
            <div key={pickup.request_id} className="p-6 card-modern hover:border-eco-emerald/50 transition-all">
              {/* Top row: category + status */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-primary text-base">
                    {pickup.category_detail?.category_name || 'Pickup Request'}
                  </p>
                  <p className="text-sm text-muted mt-0.5">
                    Est. {pickup.quantity}kg · Scheduled {pickup.pickup_date}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shrink-0 ${STATUS_STYLES[pickup.status] || 'bg-gray-100 text-secondary'}`}>
                  {pickup.status}
                </span>
              </div>

              {/* Citizen info */}
              {pickup.user_detail && (
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 text-sm text-secondary">
                    <User className="w-3.5 h-3.5 text-muted shrink-0" />
                    <span className="font-medium">{pickup.user_detail.full_name}</span>
                  </div>
                  {pickup.user_detail.phone && (
                    <div className="flex items-center gap-1.5 text-sm text-secondary">
                      <Phone className="w-3.5 h-3.5 text-muted shrink-0" />
                      <span>{pickup.user_detail.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Address + Map */}
              {(pickup.address || (pickup.latitude && pickup.longitude)) && (
                <div className="mt-2 flex items-start gap-1.5 text-sm text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
                  <div>
                    {pickup.address && <span>{pickup.address}</span>}
                    {pickup.latitude && pickup.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${pickup.latitude},${pickup.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-xs font-medium text-[#387478] hover:underline"
                      >
                        View on Map ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
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
 <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-4">Assigned Bins</h2>
 <p className="text-sm text-secondary mb-6">Monitor the fill-levels and zones of bins in your area.</p>
 
 {loading ? (
 <p className="text-sm text-muted">Loading bins...</p>
 ) : error ? (
 <p className="text-sm text-red-500">{error}</p>
 ) : bins.length === 0 ? (
 <p className="text-sm text-muted">No bins assigned.</p>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {bins.map(bin => (
 <div key={bin.bin_id} className="p-6 card-modern flex items-start space-x-4 shadow-sm hover:border-eco-emerald/50">
 <div className="p-3 bg-eco-sage/10 text-primary rounded-lg">
 <Trash2 size={24} />
 </div>
 <div className="flex-1">
 <h3 className="font-semibold text-lg text-[#0E1240] text-primary">Bin {bin.bin_id.substring(0, 8)}</h3>
 <p className="text-sm text-muted flex items-center mt-1">
 <MapPin size={16} className="mr-1 text-eco-sage" /> Zone: {bin.location}
 </p>
 <div className="mt-3">
 <div className="flex justify-between text-xs mb-1">
 <span className="font-medium text-secondary">Fill Level</span>
 <span className="font-bold text-primary">{bin.fill_level}%</span>
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
 <div className="p-8 card-modern">
 <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-2">Recycling Performance</h2>
 <p className="text-sm text-secondary mb-6">Your impact at a glance for this month.</p>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {mockStats.map((stat, idx) => (
 <div key={idx} className="p-6 card-modern shadow-inner border-eco-sage/10 flex items-center space-x-4">
 <div className="p-3 bg-white dark:bg-eco-charcoal text-primary rounded-full shadow-sm hover:scale-110 transition-transform duration-300">
 {stat.icon}
 </div>
 <div>
 <p className="text-sm text-muted font-medium">{stat.label}</p>
 <p className="text-2xl font-bold text-[#0E1240] text-primary">{stat.value}</p>
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
 <div className="p-8 card-modern min-h-[50vh] flex flex-col items-center justify-center">
 <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-6 w-full text-left">Notifications</h2>
 {loading ? (
 <p className="text-sm text-muted">Loading...</p>
 ) : error ? (
 <p className="text-sm text-red-500">{error}</p>
 ) : notifications.length === 0 ? (
 <div className="text-center py-8">
 <Bell size={48} className="mx-auto text-primary opacity-50" />
 <p className="mt-4 text-lg font-medium text-secondary">You're all caught up!</p>
 <p className="text-sm text-muted">No new notifications at the moment.</p>
 </div>
 ) : (
 <ul className="w-full max-w-3xl space-y-3">
 {notifications.map((n) => (
 <li key={n.id} className="p-5 card-modern shadow-inner border-eco-sage/10">
 <p className="text-sm text-secondary dark:text-gray-200">{n.message || 'No message'}</p>
 <p className="text-xs text-muted mt-1">{new Date(n.created_at).toLocaleString()}</p>
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
 return <p className="text-sm text-muted p-8">Loading profile...</p>;
 }
 if (error) {
 return <p className="text-sm text-red-500 p-8">{error}</p>;
 }

 const displayName = profile?.full_name || profile?.email || 'Collector';
 const avatarInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

 return (
 <div className="p-8 bg-white dark:bg-eco-charcoal rounded-xl shadow-lg border border-gray-100 dark:border-eco-sage/20">
 <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-6">Profile & Settings</h2>
 <div className="flex items-center space-x-4 mb-6">
 <div className="w-16 h-16 rounded-full bg-eco-forest flex items-center justify-center text-white text-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-md">
 {avatarInitials}
 </div>
 <div>
 <p className="text-lg font-medium text-[#0E1240] dark:text-gray-200">{displayName}</p>
 <p className="text-sm text-secondary dark:text-muted">{profile?.email}</p>
 {profile?.phone && <p className="text-sm text-muted mt-1">📞 {profile.phone}</p>}
 </div>
 </div>
 </div>
 );
};
