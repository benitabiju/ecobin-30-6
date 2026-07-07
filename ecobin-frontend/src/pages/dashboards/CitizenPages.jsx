import React, { useEffect, useState } from 'react';
import { getMyProfile } from '../../api/Users';
import { Bell, MapPin, User, Truck } from 'lucide-react';
import { getNotifications } from '../../api/notifications';
import { getMyPickups, uploadCitizenProof } from '../../api/pickups';
import { UploadCloud, X } from 'lucide-react';
import { ImageGallery } from '../../components/ImageGallery';
import RecyclableBadge from '../../components/RecyclableBadge';

const STATUS_STYLES = {
  pending:   { cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending Assignment' },
  assigned:  { cls: 'bg-blue-100 text-blue-800 border-blue-200',   label: 'Assigned' },
  pending_citizen_verification: { cls: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Pending Citizen Verify' },
  pending_admin_verification: { cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending Admin Verify' },
  collected: { cls: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Collected' },
  completed: { cls: 'bg-green-100 text-green-800 border-green-200', label: 'Completed' },
  recycled:  { cls: 'bg-green-100 text-green-800 border-green-200', label: 'Recycled' },
  cancelled: { cls: 'bg-red-100 text-red-800 border-red-200',      label: 'Cancelled' },
};

export const CitizenRequests = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('active');

  const [verifyingPickup, setVerifyingPickup] = useState(null);
  const [verifyImages, setVerifyImages] = useState([]);
  const [uploadingVerify, setUploadingVerify] = useState(false);

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

  const loadPickups = async () => {
    try {
      const data = await getMyPickups();
      setPickups(Array.isArray(data) ? data : data.results || []);
    } catch (err) {}
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

  if (loading) {
    return <p className="text-sm text-muted">Loading requests...</p>;
  }
  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }
  const filteredPickups = pickups.filter(p => {
    if (filter === 'active') {
      return ['submitted', 'pending_review', 'assigned', 'pending_citizen_verification', 'pending_admin_verification'].includes(p.status);
    }
    return ['completed', 'cancelled', 'completion_rejected', 'collected', 'recycled'].includes(p.status);
  });

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          {successMessage}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">My Pickup Requests</h2>
          <span className="text-sm text-muted">{pickups.length} total</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'active' ? 'bg-[#387478] text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
          >
            Active ({pickups.filter(p => ['submitted', 'pending_review', 'assigned', 'pending_citizen_verification', 'pending_admin_verification'].includes(p.status)).length})
          </button>
          <button 
            onClick={() => setFilter('history')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'history' ? 'bg-[#387478] text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
          >
            History ({pickups.filter(p => ['completed', 'cancelled', 'completion_rejected', 'collected', 'recycled'].includes(p.status)).length})
          </button>
        </div>
      </div>

      {filteredPickups.length === 0 ? (
        <div className="p-10 card-modern text-center">
          <Truck size={48} className="mx-auto text-muted opacity-40 mb-3" />
          <p className="text-sm text-muted">No pickup requests found in this view.</p>
        </div>
      ) : filteredPickups.map((p) => {
        const statusInfo = STATUS_STYLES[p.status] || { cls: 'bg-gray-100 text-gray-700 border-gray-200', label: p.status };
        const collector = p.assigned_collector_detail;
        return (
          <div key={p.request_id} className="card-modern p-5 hover:border-eco-emerald/50 transition-all">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                <p className="font-bold text-[#0E1240] text-primary text-lg">
                  {p.category_detail?.category_name || 'Pickup Request'}
                </p>
                {p.category_detail?.disposal_category === 'RECYCLABLE' && <RecyclableBadge />}
              </div>
              <p className="text-sm text-muted mt-1 font-medium">
                  {p.quantity} kg · Scheduled {p.pickup_date}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${statusInfo.cls}`}>
                {statusInfo.label}
              </span>
            </div>

            {/* Address & Map */}
            {(p.address || (p.latitude && p.longitude)) && (
              <div className="mt-3 flex items-start gap-1.5 text-sm text-secondary">
                <MapPin className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                <div>
                  {p.address && <span>{p.address}</span>}
                  {p.latitude && p.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${p.latitude},${p.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[#387478] hover:underline text-xs font-medium"
                    >
                      View on Map ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Assigned Collector (shown when assigned) */}
            {collector && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E2F1E7] flex items-center justify-center text-[#243642] font-bold text-sm shrink-0">
                  {collector.full_name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <div className="text-xs text-muted font-medium uppercase tracking-wide">Assigned Collector</div>
                  <div className="text-sm font-semibold text-primary">{collector.full_name}</div>
                  {collector.assigned_area && (
                    <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {collector.assigned_area}
                    </div>
                  )}
                </div>
                <span className={`ml-auto px-2 py-1 rounded-full text-[10px] font-bold ${
                  collector.availability === 'available' ? 'bg-green-100 text-green-700' :
                  collector.availability === 'on_route'  ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {collector.availability}
                </span>
              </div>
            )}

            {/* Pending — no collector yet */}
            {!collector && p.status === 'pending' && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-muted">
                <User className="w-4 h-4" />
                Awaiting collector assignment by admin
              </div>
            )}
            
            {p.status === 'pending_citizen_verification' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => setVerifyingPickup(p)} className="w-full py-2 bg-eco-emerald text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors">
                  Verify Pickup Completion
                </button>
              </div>
            )}

            {p.images?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs font-bold uppercase text-muted tracking-wider mb-2">Request Images</div>
                <ImageGallery images={p.images} />
              </div>
            )}
          </div>
        );
      })}
      
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
    </div>
  );
};

// Keep other placeholder pages simple
export const CitizenBins = () => (
 <div className="p-8 card-modern">
 <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-4">Nearby Bins</h2>
 <p className="text-sm text-secondary mb-4">Explore bins in your vicinity.</p>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {[{ id: 1, name: 'Bin #1', location: 'Main Street' },
 { id: 2, name: 'Bin #2', location: 'Oak Avenue' },
 { id: 3, name: 'Bin #3', location: 'River Road' },
 { id: 4, name: 'Bin #4', location: 'Pine Lane' }].map(bin => (
 <div key={bin.id} className="p-5 card-modern shadow-inner border-eco-sage/10 flex items-start space-x-3">
 <MapPin size={20} className="mt-1 text-primary" />
 <div>
 <h3 className="font-semibold text-[#0E1240] text-primary">{bin.name}</h3>
 <p className="text-sm text-muted flex items-center">
 <span className="mr-1">📍</span>{bin.location}
 </p>
 <a
 href={`https://www.google.com/maps/search/${encodeURIComponent(bin.location)}`}
 target="_blank"
 rel="noopener noreferrer"
 className="text-primary text-sm hover:underline mt-1 block"
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
 <div className="p-8 card-modern">
 <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-4">Recycling History</h2>
 {mockRecords.length === 0 ? (
 <p className="text-center text-secondary">No recycling records found.</p>
 ) : (
 <ul className="space-y-3">
 {mockRecords.map(rec => (
 <li
 key={rec.id}
 className="p-5 card-modern flex justify-between items-center shadow-inner border-eco-sage/10"
 >
 <div>
 <p className="font-medium text-[#0E1240] text-primary">
 {rec.recycling_center} – {rec.recycled_weight} kg
 </p>
 <p className="text-sm text-muted">{rec.recycled_date}</p>
 </div>
 </li>
 ))}
 </ul>
 )}
 </div>
 );
};
export const CitizenFeedback = () => (
 <div className="p-8 card-modern">
 <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-4">Feedback</h2>
 <p className="text-sm text-secondary mb-4">We value your thoughts. Share suggestions or report issues.</p>
 <form className="space-y-4">
 <textarea className="input-modern" rows={5} placeholder="Your feedback..." required />
 <button type="submit" className="btn-primary">Submit</button>
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
 return <p className="text-sm text-muted">Loading notifications...</p>;
 }
 if (error) {
 return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
 }
 return (
 <div className="min-h-screen flex flex-col items-center justify-center p-8 card-modern bg-gray-50/50">
 <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-4">
 Notifications
 </h2>
 {notifications.length === 0 ? (
 <div className="text-center py-8">
 <Bell size={48} className="mx-auto text-primary" />
 <p className="mt-4 text-lg font-medium text-secondary">You're all caught up!</p>
 <p className="text-sm text-muted">No new notifications at the moment.</p>
 </div>
 ) : (
 <ul className="w-full max-w-2xl space-y-3">
 {notifications.map((n) => (
 <li key={n.id} className="p-5 card-modern border-eco-sage/20 shadow-inner">
 <p className="text-sm text-secondary dark:text-gray-200">{n.message || 'No message'}</p>
 <p className="text-xs text-muted mt-1">{new Date(n.created_at).toLocaleString()}</p>
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
 return <p className="text-sm text-muted">Loading profile...</p>;
 }
 if (error) {
 return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
 }

 const displayName = profile?.full_name || profile?.email || 'User';
 const avatarInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

 return (
 <div className="p-8 card-modern">
 <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-4">Profile & Settings</h2>
 <div className="flex items-center space-x-4 mb-6">
 <div className="w-16 h-16 rounded-full bg-eco-forest flex items-center justify-center text-white text-2xl font-bold hover:scale-105 transition-transform duration-300">
 {avatarInitials}
 </div>
 <div>
 <p className="text-lg font-medium text-secondary dark:text-gray-200">{displayName}</p>
 <p className="text-sm text-secondary dark:text-muted">{profile?.email}</p>
 </div>
 </div>
 </div>
 );
};
