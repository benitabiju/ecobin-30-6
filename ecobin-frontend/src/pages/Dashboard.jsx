import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getMyPickups, getCategories, createPickupRequest } from '../api/pickups';
import { getMyProfile } from '../api/Users';
import CollectorDashboard from './CollectorDashboard';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  collected: 'bg-purple-100 text-purple-800',
  recycled: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function CitizenDashboard() {
  const [pickups, setPickups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRequest, setNewRequest] = useState({
    category: '',
    quantity: '',
    pickup_date: '',
    address: ''
  });

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

  useEffect(() => {
    async function fetchData() {
      await loadPickups();
      // Since the backend doesn't have a /categories/ endpoint, 
      // we use the static list requested by the user.
      const staticCategories = [
        { id: '64ba77a6-82ad-4ac6-924c-c9818ab5b4e2', name: 'Organic' },
        { id: '3c32c6f5-e412-4d3f-a38b-508b75459f1d', name: 'E-Waste' },
        { id: 'bd439f98-901a-4052-a29c-85d7289eb54d', name: 'Plastic' },
        { id: 'ec85aef5-2744-4273-aae1-57f6991bc986', name: 'Paper/Cardboard' }
      ];
      setCategories(staticCategories);
    }
    fetchData();
  }, []);

      const navigate = useNavigate();

      const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
          // Ensure quantity is sent as a number, not a string
          const payload = {
            ...newRequest,
            quantity: newRequest.quantity !== '' ? parseFloat(newRequest.quantity) : undefined,
          };
          await createPickupRequest(payload);
          setShowModal(false);
          setNewRequest({ category: '', quantity: '', pickup_date: '', address: '' });
          await loadPickups();
          // Show a success toast notification
          setSuccessMessage('Pickup request submitted successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
          // Redirect to My Requests page
          navigate('/citizen/requests');
        } catch (err) {
          setError(err.message);
        } finally {
          setSubmitting(false);
        }
      };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-display text-3xl font-bold text-[#0E1240] dark:text-white">
          Your dashboard
        </h1>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm"
        >
          + New Request
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Track your pickup requests and their status.
      </p>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white dark:bg-eco-charcoal rounded-2xl border border-gray-100 dark:border-eco-sage/20 shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <span className="text-sm font-semibold text-gray-500 dark:text-eco-sage uppercase tracking-wider mb-2">Total Requests</span>
          <span className="text-3xl font-bold text-eco-forest dark:text-white">{pickups.length}</span>
        </div>
        <div className="p-6 bg-white dark:bg-eco-charcoal rounded-2xl border border-gray-100 dark:border-eco-sage/20 shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <span className="text-sm font-semibold text-gray-500 dark:text-eco-sage uppercase tracking-wider mb-2">Active</span>
          <span className="text-3xl font-bold text-eco-forest dark:text-white">
            {pickups.filter(p => ['pending', 'assigned'].includes(p.status)).length}
          </span>
        </div>
        <div className="p-6 bg-white dark:bg-eco-charcoal rounded-2xl border border-gray-100 dark:border-eco-sage/20 shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <span className="text-sm font-semibold text-gray-500 dark:text-eco-sage uppercase tracking-wider mb-2">Completed</span>
          <span className="text-3xl font-bold text-eco-forest dark:text-white">
            {pickups.filter(p => ['collected', 'recycled'].includes(p.status)).length}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm rounded-lg">
          {successMessage}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading your requests...</p>
      ) : pickups.length === 0 ? (
        <div className="p-8 bg-white dark:bg-eco-charcoal rounded-2xl border border-gray-100 dark:border-eco-sage/20 shadow-sm text-center">
          <p className="text-sm text-gray-500 dark:text-eco-sage">
            You haven't made any pickup requests yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pickups.map((pickup) => (
            <div
              key={pickup.request_id}
              className="p-6 bg-white dark:bg-eco-charcoal rounded-2xl border border-gray-100 dark:border-eco-sage/20 shadow-sm flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <p className="font-bold text-[#0E1240] dark:text-white">
                  {pickup.category_detail?.category_name || 'Pickup Request'}
                </p>
                <p className="text-sm text-gray-500 dark:text-eco-sage mt-1">
                  {pickup.quantity}kg · Scheduled {pickup.pickup_date}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-eco-charcoal rounded-2xl p-6 w-full max-w-md shadow-xl border border-eco-sage/20">
            <h2 className="text-xl font-bold mb-4 text-[#0E1240] dark:text-white">New Pickup Request</h2>
            <form onSubmit={handleRequestSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">Category</label>
                <select 
                  required
                  value={newRequest.category}
                  onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm text-eco-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-forest"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.category_id || cat.id} value={cat.category_id || cat.id}>
                      {cat.category_name || cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">Quantity (kg)</label>
                <input 
                  type="number" required min="0" step="0.1"
                  value={newRequest.quantity}
                  onChange={(e) => setNewRequest({...newRequest, quantity: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm text-eco-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-forest"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">Pickup Date</label>
                <input 
                  type="date" required
                  value={newRequest.pickup_date}
                  onChange={(e) => setNewRequest({...newRequest, pickup_date: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm text-eco-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-forest"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-eco-mint dark:text-eco-sage mb-1">Address</label>
                <input 
                  type="text" required
                  value={newRequest.address}
                  onChange={(e) => setNewRequest({...newRequest, address: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg text-sm text-eco-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-forest"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={submitting} className="flex-1 bg-eco-forest text-white p-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-eco-emerald transition-colors">
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-eco-sage/40 text-eco-charcoal dark:text-white p-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-eco-sage/10 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
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
    return <Navigate to="/collector/dashboard" replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/citizen/dashboard" replace />;
}
