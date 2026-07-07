import React, { useEffect, useState } from 'react';
import { getMyProfile } from '../../api/Users';
import { Bell, MapPin, User, Truck, Star, AlertTriangle, CheckCircle2, Home, Sparkles } from 'lucide-react';
import { getNotifications } from '../../api/notifications';
import { getMyPickups, uploadCitizenProof, submitPickupFeedback } from '../../api/pickups';
import { getMyCompoundCleanups } from '../../api/cleanups';
import { UploadCloud, X } from 'lucide-react';
import { ImageGallery } from '../../components/ImageGallery';
import RecyclableBadge from '../../components/RecyclableBadge';

const STATUS_STYLES = {
  pending_assignment: { cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending Assignment' },
  pending_review:     { cls: 'bg-amber-100 text-amber-800 border-amber-200',    label: 'Pending Review' },
  approved:           { cls: 'bg-sky-100 text-sky-800 border-sky-200',          label: 'Approved' },
  assigned:           { cls: 'bg-blue-100 text-blue-800 border-blue-200',       label: 'Assigned' },
  in_progress:        { cls: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'In Progress' },
  pending_verification:{ cls: 'bg-orange-100 text-orange-800 border-orange-200',label: 'Pending Verification' },
  completion_rejected:{ cls: 'bg-red-100 text-red-800 border-red-200',         label: 'Completion Rejected' },
  completed:          { cls: 'bg-green-100 text-green-800 border-green-200',    label: 'Completed' },
  cancelled:          { cls: 'bg-gray-100 text-gray-600 border-gray-200',       label: 'Cancelled' },
  rejected:           { cls: 'bg-red-100 text-red-600 border-red-200',          label: 'Rejected' },
};

// ── Rule 5: Star Rating Input Component ──
const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="focus:outline-none"
        aria-label={`${star} star${star !== 1 ? 's' : ''}`}
      >
        <Star
          className={`w-8 h-8 transition-colors ${
            star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      </button>
    ))}
  </div>
);

// ── Rule 5: Rating Modal ──
const RatingModal = ({ pickup, onSuccess, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a star rating.');
    if (!comments.trim()) return setError('Please add a comment.');
    setSubmitting(true);
    setError('');
    try {
      await submitPickupFeedback(pickup.request_id, { rating, comments });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-modern p-8 w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-1">Rate Your Collector</h2>
          <p className="text-sm text-secondary">
            Your pickup <span className="font-semibold">{pickup.category_detail?.category_name}</span> is complete.
            Rate your experience to unlock new requests.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              Rating
            </label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              className="input-modern min-h-[100px] resize-none"
              placeholder="How was the collection? Was the collector professional?"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 font-bold text-secondary bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 py-2.5 font-bold text-white bg-[#387478] hover:bg-[#2d5f62] rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Rule 5: Rating Gate Banner ──
const RatingGateBanner = ({ pendingPickup, onRate }) => (
  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 shadow-sm">
    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="font-bold text-amber-800 text-sm">Rating Required Before New Request</p>
      <p className="text-amber-700 text-xs mt-0.5">
        Please rate your last completed collection (<span className="font-semibold">{pendingPickup?.category_detail?.category_name}</span>) before submitting a new pickup request.
      </p>
    </div>
    <button
      onClick={onRate}
      className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors shrink-0"
    >
      Rate Now
    </button>
  </div>
);

export const CitizenRequests = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('active');

  const [verifyingPickup, setVerifyingPickup] = useState(null);
  const [verifyImages, setVerifyImages] = useState([]);
  const [uploadingVerify, setUploadingVerify] = useState(false);

  // Rule 5: Rating modal
  const [ratingPickup, setRatingPickup] = useState(null);

  useEffect(() => {
    loadPickups();
  }, []);

  const loadPickups = async () => {
    try {
      const data = await getMyPickups();
      const all = Array.isArray(data) ? data : data.results || [];
      setPickups(all);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  // The pickup that needs a rating (if any)
  const pendingRatingPickup = pickups.find(p => p.pending_rating === true);

  const handleRatingSuccess = async () => {
    setRatingPickup(null);
    setSuccessMessage('Thank you for your feedback! You can now submit new requests.');
    setTimeout(() => setSuccessMessage(''), 4000);
    await loadPickups();
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (verifyImages.length === 0) return setError('Please upload at least one image');
    
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

  if (loading) return <p className="text-sm text-muted">Loading requests…</p>;

  const filteredPickups = pickups.filter(p => {
    if (filter === 'active') {
      return ['pending_assignment', 'pending_review', 'approved', 'assigned', 'in_progress', 'pending_verification', 'completion_rejected'].includes(p.status);
    }
    return ['completed', 'cancelled', 'rejected'].includes(p.status);
  });

  return (
    <div className="space-y-4">
      {/* Toast messages */}
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Rule 5: Rating Gate Banner */}
      {pendingRatingPickup && (
        <RatingGateBanner
          pendingPickup={pendingRatingPickup}
          onRate={() => setRatingPickup(pendingRatingPickup)}
        />
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
            Active ({pickups.filter(p => ['pending_assignment','pending_review','approved','assigned','in_progress','pending_verification','completion_rejected'].includes(p.status)).length})
          </button>
          <button 
            onClick={() => setFilter('history')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'history' ? 'bg-[#387478] text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
          >
            History ({pickups.filter(p => ['completed','cancelled','rejected'].includes(p.status)).length})
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
          <div key={p.request_id} className={`card-modern p-5 transition-all ${p.pending_rating ? 'border-amber-300 ring-1 ring-amber-200' : 'hover:border-eco-emerald/50'}`}>
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-[#0E1240] text-primary text-lg">
                    {p.category_detail?.category_name || 'Pickup Request'}
                  </p>
                  {p.category_detail?.disposal_category === 'RECYCLABLE' && <RecyclableBadge />}
                  {p.pending_rating && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      Rating Pending
                    </span>
                  )}
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
                  {p.street && <span className="ml-2 text-xs text-muted">({p.street})</span>}
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

            {/* Assigned Collector */}
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

            {/* Pending verification action */}
            {p.status === 'pending_verification' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => setVerifyingPickup(p)} className="w-full py-2 bg-eco-emerald text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors">
                  Verify Pickup Completion
                </button>
              </div>
            )}

            {/* Rule 5: Rate completed pickup */}
            {p.status === 'completed' && p.pending_rating && (
              <div className="mt-3 pt-3 border-t border-amber-100">
                <button
                  onClick={() => setRatingPickup(p)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-white" />
                  Rate This Collection to Unlock New Requests
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
                  {uploadingVerify ? 'Uploading…' : 'Verify Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rule 5: Rating Modal */}
      {ratingPickup && (
        <RatingModal
          pickup={ratingPickup}
          onSuccess={handleRatingSuccess}
          onClose={() => setRatingPickup(null)}
        />
      )}
    </div>
  );
};

// ── Rule 1: Compound Cleanup Status Panel ──
export const CitizenCleanupStatus = () => {
  const [cleanups, setCleanups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyCompoundCleanups()
      .then(data => setCleanups(Array.isArray(data) ? data : data.results || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold text-primary">Compound Cleanups</h2>
        <p className="text-sm text-secondary mt-1">Scheduled cleanups for your premises (triggered when you submit 10+ requests).</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : cleanups.length === 0 ? (
        <div className="p-10 card-modern text-center">
          <Home size={40} className="mx-auto text-muted opacity-40 mb-3" />
          <p className="text-sm text-muted font-medium">No compound cleanups yet.</p>
          <p className="text-xs text-muted mt-1">A cleanup will be scheduled automatically when you submit 10+ pickup requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cleanups.map(c => (
            <div key={c.compound_cleanup_id} className="card-modern p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#E2F1E7] rounded-lg">
                    <Sparkles className="w-5 h-5 text-[#387478]" />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Compound Cleanup</p>
                    <p className="text-xs text-muted">Triggered {new Date(c.triggered_at).toLocaleDateString()} · {c.trigger_request_count} requests</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[c.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              {c.assigned_collector_name && (
                <p className="text-xs text-secondary mt-3 pt-3 border-t border-gray-100">
                  Assigned to: <span className="font-semibold">{c.assigned_collector_name}</span>
                </p>
              )}
              {c.completed_at && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Completed on {new Date(c.completed_at).toLocaleDateString()}
                </p>
              )}
              {c.notes && <p className="text-xs text-muted italic mt-1">{c.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Keep other pages simple
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

export const CitizenFeedback = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPickups()
      .then(data => setPickups(Array.isArray(data) ? data : data.results || []))
      .finally(() => setLoading(false));
  }, []);

  const ratedPickups = pickups.filter(p => p.status === 'completed' && !p.pending_rating);
  const pendingPickups = pickups.filter(p => p.pending_rating);

  return (
    <div className="p-8 card-modern space-y-4">
      <h2 className="text-2xl font-bold text-[#0E1240] text-primary mb-2">My Feedback</h2>
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <>
          {pendingPickups.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm font-bold text-amber-800">⚠ Pending Ratings ({pendingPickups.length})</p>
              <p className="text-xs text-amber-700 mt-1">Go to "My Requests" tab to rate these collections.</p>
            </div>
          )}
          {ratedPickups.length === 0 ? (
            <p className="text-sm text-secondary">No submitted feedback yet.</p>
          ) : (
            <ul className="space-y-3">
              {ratedPickups.map(p => (
                <li key={p.request_id} className="p-4 card-modern border-eco-sage/10">
                  <p className="font-medium text-primary text-sm">{p.category_detail?.category_name}</p>
                  <p className="text-xs text-muted mt-0.5">Completed {p.pickup_date}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">✅ Feedback submitted</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

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
 <li key={n.notification_id || n.id} className="p-5 card-modern border-eco-sage/20 shadow-inner">
 <p className="text-sm font-semibold text-primary">{n.title}</p>
 <p className="text-sm text-secondary dark:text-gray-200 mt-0.5">{n.message || 'No message'}</p>
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
