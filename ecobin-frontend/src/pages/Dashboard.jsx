import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { getMyPickups, getCategories, createPickupRequest } from '../api/pickups';
import { getMyProfile } from '../api/Users';
import CollectorDashboard from './CollectorDashboard';
import RecyclableBadge from '../components/RecyclableBadge';

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
    address: '',
    latitude: 40.7128, // Default New York
    longitude: -74.0060
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '' 
    // Using env variable or empty string (which gives dev warning but works)
  });

  const onMapClick = useCallback((e) => {
    setNewRequest(prev => ({
      ...prev,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng()
    }));
  }, []);

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
      const cats = await getCategories();
      const results = Array.isArray(cats) ? cats : (cats.results || []);
      setCategories(results);
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
      setNewRequest({ category: '', quantity: '', pickup_date: '', address: '', latitude: 40.7128, longitude: -74.0060 });
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
 <h1 className="font-display text-3xl font-bold text-primary">
 Your dashboard
 </h1>
 <button 
 onClick={() => setShowModal(true)}
 className="btn-primary"
 >
 + New Request
 </button>
 </div>
 <p className="text-sm text-muted mb-8">
 Track your pickup requests and their status.
 </p>

 {/* Dashboard Stats */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
 <div className="p-6 card-modern flex flex-col justify-center items-start">
 <span className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Total Requests</span>
 <span className="text-4xl font-extrabold text-primary">{pickups.length}</span>
 </div>
 <div className="p-6 card-modern flex flex-col justify-center items-start">
 <span className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Active</span>
 <span className="text-4xl font-extrabold text-primary">
 {pickups.filter(p => ['pending', 'assigned'].includes(p.status)).length}
 </span>
 </div>
 <div className="p-6 card-modern flex flex-col justify-center items-start">
 <span className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Completed</span>
 <span className="text-4xl font-extrabold text-primary">
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
 <p className="text-sm text-muted">Loading your requests...</p>
 ) : pickups.length === 0 ? (
 <div className="p-10 card-modern text-center">
 <p className="text-sm text-muted">
 You haven't made any pickup requests yet.
 </p>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 {pickups.map((pickup) => (
 <div
 key={pickup.request_id}
 className="p-6 card-modern"
 >
 <div className="flex items-start justify-between gap-3">
 <div>
 <div className="flex items-center gap-2">
   <p className="font-bold text-primary text-lg">
   {pickup.category_detail?.category_name || 'Pickup Request'}
   </p>
   {pickup.category_detail?.disposal_category === 'RECYCLABLE' && <RecyclableBadge />}
 </div>
 <p className="text-sm text-muted mt-1 font-medium">
 {pickup.quantity}kg · Scheduled {pickup.pickup_date}
 </p>
 {pickup.address && (
 <p className="text-xs text-muted mt-1">📍 {pickup.address}</p>
 )}
 </div>
 <span
 className={`badge-modern shrink-0 ${STATUS_STYLES[pickup.status] || 'bg-gray-100 text-secondary'}`}
 >
 {pickup.status}
 </span>
 </div>
 {pickup.assigned_collector_detail && (
 <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-muted">
 <span className="font-semibold text-secondary">Collector:</span>
 <span className="font-bold text-primary">{pickup.assigned_collector_detail.full_name}</span>
 {pickup.assigned_collector_detail.assigned_area && (
 <span>· {pickup.assigned_collector_detail.assigned_area}</span>
 )}
 </div>
 )}
 </div>
 ))}
 </div>
 )}

 {showModal && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="card-modern p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-primary font-display">New Pickup Request</h2>
          <form onSubmit={handleRequestSubmit} className="flex flex-col gap-5">
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Category</label>
 <select 
 required
 value={newRequest.category}
 onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
 className="input-modern"
 >
 <option value="">Select a category</option>
 {categories.map(cat => (
 <option key={cat.category_id || cat.id} value={cat.category_id || cat.id}>
 {cat.category_name || cat.name} {cat.disposal_category === 'RECYCLABLE' ? '♻️' : ''}
 </option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Quantity (kg)</label>
 <input 
 type="number" required min="0" step="0.1"
 value={newRequest.quantity}
 onChange={(e) => setNewRequest({...newRequest, quantity: e.target.value})}
 className="input-modern"
 />
 </div>
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Pickup Date</label>
 <input 
 type="date" required
 value={newRequest.pickup_date}
 onChange={(e) => setNewRequest({...newRequest, pickup_date: e.target.value})}
 className="input-modern"
 />
 </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Address</label>
            <input 
              type="text" required
              value={newRequest.address}
              onChange={(e) => setNewRequest({...newRequest, address: e.target.value})}
              className="input-modern"
              placeholder="e.g. 123 Main St, Apt 4"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Pinpoint Location on Map</label>
            {isLoaded ? (
              <div className="h-64 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={{ lat: newRequest.latitude, lng: newRequest.longitude }}
                  zoom={12}
                  onClick={onMapClick}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                  }}
                >
                  <Marker position={{ lat: newRequest.latitude, lng: newRequest.longitude }} />
                </GoogleMap>
              </div>
            ) : (
              <div className="h-64 bg-gray-100 flex items-center justify-center rounded-xl text-sm text-secondary">
                Loading Map...
              </div>
            )}
            <p className="text-xs text-muted mt-2">Click on the map to accurately place your pickup location pin.</p>
          </div>

          <div className="flex gap-4 mt-6">
 <button type="submit" disabled={submitting} className="btn-primary flex-1">
 {submitting ? 'Submitting...' : 'Submit Request'}
 </button>
 <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
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
 <p className="text-sm text-muted">Loading your dashboard...</p>
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
