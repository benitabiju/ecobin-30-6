import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../api/auth';
import { getAssignedPickups, uploadCompletionProof } from '../../api/Collector';
import { getNotifications } from '../../api/notifications';
import { getMyProfile } from '../../api/Users';
import { ImageGallery } from '../../components/ImageGallery';
import { MapPin, Trash2, TrendingUp, Award, Box, Bell, User, Phone, RefreshCw, Star, Trophy, Zap, Home, CheckCircle2, Loader2 } from 'lucide-react';

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

  const [proofModal, setProofModal] = useState(null); // stores the pickup object
  const [proofData, setProofData] = useState({ notes: '', weight: '', images: [] });
  const [submittingProof, setSubmittingProof] = useState(false);

  const navigate = useNavigate();

  const loadPickups = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await getAssignedPickups();
      setPickups(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      if (err.message?.toLowerCase().includes('session expired') || err.message?.toLowerCase().includes('log in')) {
        navigate('/login');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPickups();
    // Auto-refresh every 15s for real-time updates
    const interval = setInterval(() => loadPickups(true), 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredPickups = pickups.filter(p => {
    if (filter === 'active') return ['pending_assignment', 'assigned', 'in_progress'].includes(p.status);
    return ['collected', 'recycled', 'pending_verification', 'completed'].includes(p.status);
  });

  const handleProofSubmit = async (e) => {
    e.preventDefault();
    if (proofData.images.length === 0) {
      setError('Please upload at least one photo as proof of collection.');
      return;
    }
    setSubmittingProof(true);
    setError('');
    
    try {
      const formData = new FormData();
      if (proofData.notes) formData.append('notes', proofData.notes);
      if (proofData.weight) formData.append('weight', proofData.weight);
      proofData.images.forEach(img => formData.append('images', img));
      
      await uploadCompletionProof(proofModal.request_id, formData);
      setProofModal(null);
      setProofData({ notes: '', weight: '', images: [] });
      await loadPickups();
    } catch (err) {
      setError(err.message || 'Failed to upload proof. Please try again.');
    } finally {
      setSubmittingProof(false);
    }
  };

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
              Completed ({pickups.filter(p => ['collected', 'recycled', 'pending_verification', 'completed'].includes(p.status)).length})
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
              {(pickup.address || (pickup.latitude && pickup.longitude) || pickup.landmark) && (
                <div className="mt-2 flex items-start gap-1.5 text-sm text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
                  <div>
                    {pickup.address && <span>{pickup.address}</span>}
                    {pickup.landmark && <span className="italic ml-2">({pickup.landmark})</span>}
                    {pickup.latitude && pickup.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${pickup.latitude},${pickup.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-xs font-medium text-[#387478] hover:underline block mt-1"
                      >
                        View on Map ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {/* Display Uploaded Images */}
              {pickup.images?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs font-bold uppercase text-muted tracking-wider mb-2">Attached Images</div>
                  <ImageGallery images={pickup.images} />
                </div>
              )}
              
              {/* Action Button */}
              {pickup.status === 'assigned' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setProofModal(pickup)}
                    className="px-4 py-2 bg-[#387478] text-white text-sm font-bold rounded-lg hover:bg-[#2d5f62] transition-colors"
                  >
                    Log Collection & Upload Proof
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Proof Modal */}
      {proofModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-modern p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-primary">Complete Pickup</h2>
            <p className="text-sm text-secondary mb-6">Upload proof for {proofModal.category_detail?.category_name} pickup.</p>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
            
            <form onSubmit={handleProofSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Collected Weight (kg)</label>
                <input 
                  type="number" min="0" step="0.1" 
                  value={proofData.weight} 
                  onChange={e => setProofData({...proofData, weight: e.target.value})}
                  className="input-modern"
                  placeholder={proofModal.quantity.toString()}
                />
                <p className="text-xs text-muted mt-1">Leave blank to use original estimate ({proofModal.quantity}kg)</p>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Notes / Remarks</label>
                <textarea 
                  value={proofData.notes} 
                  onChange={e => setProofData({...proofData, notes: e.target.value})}
                  className="input-modern min-h-[80px]"
                  placeholder="Any issues or details about the collection?"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Proof Photos (Required)</label>
                <input 
                  type="file" multiple accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setProofData(prev => ({ ...prev, images: [...prev.images, ...files] }));
                  }}
                  className="w-full text-sm border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#E2F1E7] file:text-[#387478] hover:file:bg-[#d0e6d8]"
                />
                
                {proofData.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {proofData.images.map((file, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setProofData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <button 
                  type="button" 
                  onClick={() => { setProofModal(null); setProofData({ notes: '', weight: '', images: [] }); setError(''); }}
                  className="px-5 py-2.5 rounded-xl font-bold text-secondary bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={submittingProof}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#387478] hover:bg-[#2d5f62] shadow-md transition-colors disabled:opacity-50"
                  disabled={submittingProof}
                >
                  {submittingProof ? 'Uploading...' : 'Submit Proof'}
                </button>
              </div>
            </form>
          </div>
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

// ── Rules 3, 4, 5: Collector Performance & Bonus Panel ──
const CycleProgressBar = ({ label, value, max, color = 'bg-[#387478]' }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-secondary">{label}</span>
        <span className="font-bold text-primary">{value} / {max}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-green-500' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export const CollectorRecycling = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch collector profile which includes bonus/points fields
    authFetch('/collectors/')
      .then(data => {
        const list = Array.isArray(data) ? data : data.results || [];
        // The current user's collector record
        if (list.length > 0) setStats(list[0]);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-48">
      <Loader2 className="w-7 h-7 animate-spin text-[#387478]" />
    </div>
  );

  if (error) return <p className="text-sm text-red-500 p-4">{error}</p>;

  // Points gauge (0–5 scale)
  const points = stats?.points ?? 0;
  const pointsPct = Math.round((points / 5) * 100);
  const bonusCycles = stats?.bonus_cycles_completed ?? 0;
  const incrementQualified = stats?.increment_qualified ?? false;

  return (
    <div className="space-y-6">
      {/* Increment badge */}
      {incrementQualified && (
        <div className="p-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl flex items-center gap-3 shadow-lg">
          <Trophy className="w-8 h-8 text-white shrink-0" />
          <div>
            <p className="font-bold text-white text-lg">Increment Qualified! 🎉</p>
            <p className="text-yellow-100 text-sm">You've completed 3 bonus cycles. Contact admin for your tier/salary upgrade.</p>
          </div>
        </div>
      )}

      {/* Points & Bonus card */}
      <div className="card-modern p-6">
        <h2 className="text-2xl font-bold text-primary mb-1">Performance Overview</h2>
        <p className="text-sm text-secondary mb-6">Live stats from your collections and ratings.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-5 bg-gradient-to-br from-[#387478]/10 to-[#243642]/5 rounded-xl border border-[#387478]/20">
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Points Score</p>
            <p className="text-3xl font-extrabold text-[#387478]">{points.toFixed(1)}<span className="text-base text-muted font-normal">/5.0</span></p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-[#387478] transition-all duration-500" style={{ width: `${pointsPct}%` }} />
            </div>
            <p className="text-xs text-muted mt-1">{stats?.ratings_count ?? 0} ratings received</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Bonus Amount</p>
            <p className="text-3xl font-extrabold text-green-600">₹{(stats?.bonus_amount ?? 0).toFixed(0)}</p>
            <p className="text-xs text-muted mt-2">Scales with your rating score</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Bonus Cycles</p>
            <p className="text-3xl font-extrabold text-purple-600">{bonusCycles}<span className="text-base text-muted font-normal">/3</span></p>
            <p className="text-xs text-muted mt-2">Completed cycles toward increment</p>
          </div>
        </div>

        {/* Current cycle progress */}
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide">Current Bonus Cycle Progress</h3>
          </div>
          <div className="space-y-3">
            <CycleProgressBar
              label="Recyclable Collections"
              value={stats?.total_recyclable_collections ?? 0}
              max={10}
              color="bg-green-500"
            />
            <CycleProgressBar
              label="Compound Cleanups"
              value={stats?.compound_cleanups_this_cycle ?? 0}
              max={2}
              color="bg-blue-500"
            />
            <CycleProgressBar
              label="Street Cleanups"
              value={stats?.street_cleanups_this_cycle ?? 0}
              max={1}
              color="bg-purple-500"
            />
          </div>
          <p className="text-xs text-muted mt-3">
            Complete all 3 thresholds in one cycle to earn a bonus. After 3 cycles → salary increment.
          </p>
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
 <li key={n.notification_id || n.id} className="p-5 card-modern shadow-inner border-eco-sage/10">
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
