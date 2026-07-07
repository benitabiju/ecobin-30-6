import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker as LeafletMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

import { getMyPickups, getCategories, createPickupRequest, uploadCitizenProof } from '../api/pickups';
import { getMyProfile } from '../api/Users';
import { UploadCloud, X } from 'lucide-react';
import CollectorDashboard from './CollectorDashboard';
import RecyclableBadge from '../components/RecyclableBadge';
import { ImageGallery } from '../components/ImageGallery';

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
 const [filter, setFilter] = useState('active');
 
 const [showModal, setShowModal] = useState(false);
 const [submitting, setSubmitting] = useState(false);
  const [newRequest, setNewRequest] = useState({
    category: '',
    quantity: '',
    pickup_date: '',
    address: '',
    street: '',
    landmark: '',
    description: '',
    images: [],
    latitude: 40.7128, // Default New York
    longitude: -74.0060
  });

  const [verifyingPickup, setVerifyingPickup] = useState(null);
  const [verifyImages, setVerifyImages] = useState([]);
  const [uploadingVerify, setUploadingVerify] = useState(false);

  // Helper component to handle map clicks
  const MapEvents = ({ onClick }) => {
    useMapEvents({
      click(e) {
        onClick(e);
      }
    });
    return null;
  };

  const onMapClick = useCallback(async (e) => {
    const { lat, lng } = e.latlng;
    setNewRequest(prev => ({ ...prev, latitude: lat, longitude: lng }));
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setNewRequest(prev => ({ ...prev, address: data.display_name }));
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  }, []);

  useEffect(() => {
    if (showModal && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setNewRequest(prev => ({ ...prev, latitude: lat, longitude: lng }));
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setNewRequest(prev => ({ ...prev, address: data.display_name }));
          }
        } catch (err) {
           console.error("Geocoding failed", err);
        }
      }, () => {
        // user denied or error, keep default
      });
    }
  }, [showModal]);

  const navigate = useNavigate();

  async function loadPickups() {
    try {
      const data = await getMyPickups();
      setPickups(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      // If the session expired (authFetch called logoutUser), redirect to login
      if (err.message?.toLowerCase().includes('session expired') || err.message?.toLowerCase().includes('log in')) {
        navigate('/login');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await loadPickups();
      try {
        const cats = await getCategories();
        setCategories(Array.isArray(cats) ? cats : (cats.results || []));
      } catch { /* categories are non-critical */ }
    }
    fetchData();
    const interval = setInterval(() => { loadPickups(); }, 30000);
    return () => clearInterval(interval);
  }, []);


  const getDaysRemaining = (dateString) => {
    if (!dateString) return 0;
    const completedAt = new Date(dateString);
    const deadline = new Date(completedAt.getTime() + 72 * 60 * 60 * 1000);
    const now = new Date();
    const diff = deadline - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleRequestSubmit = async (e) => {
  e.preventDefault();
  if (!newRequest.images || newRequest.images.length === 0) {
    setError('Please upload at least one image of the trash/site.');
    return;
  }
  setSubmitting(true);
  setError('');
  try {
    const formData = new FormData();
    formData.append('category', newRequest.category);
    formData.append('quantity', newRequest.quantity);
    formData.append('pickup_date', newRequest.pickup_date);
    formData.append('address', newRequest.address);
    formData.append('street', newRequest.street);
    formData.append('landmark', newRequest.landmark);
    formData.append('description', newRequest.description);
    formData.append('latitude', newRequest.latitude);
    formData.append('longitude', newRequest.longitude);
    
    newRequest.images.forEach((file) => {
      formData.append('images', file);
    });

    await createPickupRequest(formData);
    setShowModal(false);
    setNewRequest({ category: '', quantity: '', pickup_date: '', address: '', street: '', landmark: '', description: '', images: [], latitude: 40.7128, longitude: -74.0060 });
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

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (verifyImages.length === 0) return setError("Please upload at least one image");
    
    setUploadingVerify(true);
    setError('');
    
    try {
      const formData = new FormData();
      verifyImages.forEach(file => {
        formData.append('images', file);
      });
      
      await uploadCitizenProof(verifyingPickup.request_id, formData);
      await loadPickups();
      setSuccessMessage('Verification submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setVerifyingPickup(null);
      setVerifyImages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingVerify(false);
    }
  };

  const filteredPickups = pickups.filter(p => {
    if (filter === 'active') {
      return ['pending_assignment', 'submitted', 'pending_review', 'assigned', 'in_progress', 'pending_verification'].includes(p.status);
    }
    return ['completed', 'cancelled', 'completion_rejected', 'collected', 'recycled'].includes(p.status);
  });

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

    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <div className="flex space-x-2">
        <button 
          onClick={() => setFilter('active')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'active' ? 'bg-[#387478] text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
        >
          Active ({pickups.filter(p => ['pending_assignment', 'submitted', 'pending_review', 'assigned', 'in_progress', 'pending_verification'].includes(p.status)).length})
        </button>
        <button 
          onClick={() => setFilter('history')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'history' ? 'bg-[#387478] text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
        >
          History ({pickups.filter(p => ['completed', 'cancelled', 'completion_rejected', 'collected', 'recycled'].includes(p.status)).length})
        </button>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="btn-primary py-2 px-5 text-sm"
      >
        + New Request
      </button>
    </div>

 {loading ? (
 <p className="text-sm text-muted">Loading your requests...</p>
 ) : filteredPickups.length === 0 ? (
 <div className="p-10 card-modern text-center">
 <p className="text-sm text-muted">
 No pickup requests found in this view.
 </p>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 {filteredPickups.map((pickup) => (
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
 {pickup.status === 'pending_verification' && (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="mb-2 p-2 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-xs font-semibold text-center">
        ⏳ Auto-completes in {getDaysRemaining(pickup.collector_completed_at)} days if unverified
      </div>
      {!pickup.images?.some(img => img.image_type === 'citizen_verification') && (
        <button
          onClick={() => { setVerifyingPickup(pickup); setVerifyImages([]); }}
          className="w-full py-2 bg-[#387478] text-white hover:bg-[#2d5f62] font-bold rounded-lg shadow-sm transition-colors text-sm"
        >
          Upload Verification Photo
        </button>
      )}
    </div>
  )}
 {pickup.assigned_collector_detail && (
 <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-muted">
 <span className="font-semibold text-secondary">Collector:</span>
 <span className="font-bold text-primary">{pickup.assigned_collector_detail.full_name}</span>
 {pickup.assigned_collector_detail.assigned_area && (
 <span>· {pickup.assigned_collector_detail.assigned_area}</span>
 )}
 </div>
 )}
  {pickup.images?.length > 0 && (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="text-xs font-bold uppercase text-muted tracking-wider mb-2">Request Images</div>
      <ImageGallery images={pickup.images} />
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
              className="input-modern w-full"
              placeholder="Search for your address or enter manually..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              Street Name <span className="text-muted font-normal text-[10px] normal-case">(used to group street-level cleanups)</span>
            </label>
            <input 
              type="text"
              value={newRequest.street}
              onChange={(e) => setNewRequest({...newRequest, street: e.target.value})}
              className="input-modern"
              placeholder="e.g. Oak Avenue, Main Street"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Landmark</label>
            <input 
              type="text" 
              value={newRequest.landmark}
              onChange={(e) => setNewRequest({...newRequest, landmark: e.target.value})}
              className="input-modern"
              placeholder="e.g. Near the big oak tree"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Description</label>
            <textarea 
              value={newRequest.description}
              onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
              className="input-modern min-h-[80px] py-3"
              placeholder="Describe what needs to be picked up..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Upload Images</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setNewRequest(prev => ({ ...prev, images: [...prev.images, ...files] }));
                }}
                className="hidden" 
                id="image-upload" 
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="w-8 h-8 text-secondary mb-2" />
                <span className="text-sm font-medium text-primary">Click to upload or drag and drop</span>
                <span className="text-xs text-muted mt-1">SVG, PNG, JPG or WEBP (max. 800x400px)</span>
              </label>
            </div>
            
            {newRequest.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {newRequest.images.map((file, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-20 object-cover" />
                    <button 
                      type="button"
                      onClick={() => setNewRequest(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Pinpoint Location on Map</label>
            <div className="h-64 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 relative z-0">
              <MapContainer 
                center={[newRequest.latitude, newRequest.longitude]} 
                zoom={14} 
                style={{ height: '100%', width: '100%', zIndex: 0 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LeafletMarker position={[newRequest.latitude, newRequest.longitude]} />
                <MapEvents onClick={onMapClick} />
              </MapContainer>
            </div>
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

      {/* Verification Modal */}
      {verifyingPickup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-modern p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2 text-primary font-display">Verify Pickup</h2>
            <p className="text-sm text-secondary mb-6">The collector marked this pickup as complete. Please upload a photo of the cleared location to verify.</p>
            <form onSubmit={handleVerifySubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Upload Verification Photo(s)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-muted mb-2" />
                    <p className="text-sm text-secondary">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted mt-1">JPEG, PNG, WEBP</p>
                  </div>
                  <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => setVerifyImages(Array.from(e.target.files))} />
                </label>
                {verifyImages.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {verifyImages.map((file, i) => (
                      <div key={i} className="relative w-16 h-16 shrink-0 group">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => setVerifyImages(verifyImages.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setVerifyingPickup(null)} className="flex-1 py-2 text-secondary bg-gray-100 hover:bg-gray-200 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={uploadingVerify || verifyImages.length === 0} className="flex-1 py-2 bg-[#C9742B] text-white hover:bg-[#b06323] font-bold rounded-xl shadow-md transition-colors disabled:opacity-50">
                  {uploadingVerify ? 'Uploading...' : 'Verify Now'}
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
