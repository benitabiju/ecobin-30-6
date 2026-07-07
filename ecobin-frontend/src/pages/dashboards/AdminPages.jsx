import React, { useState, useEffect } from 'react';
import { Users, Truck, CheckCircle, Clock, MapPin, Mail, Phone, Loader2, UserCog, Activity, Box, Archive, Trash2, Edit, Star, Trophy, Zap, Home, Sparkles } from 'lucide-react';
import RecyclableBadge from '../../components/RecyclableBadge';
import { getAllUsers, deleteUser, getMyProfile, updateMyProfile } from '../../api/Users';
import { getAllCollectors, deleteCollector } from '../../api/Collector';
import { getSmartBins, getAllPickups, getAllCollections, getAllRecycling, getAuditLogs, getAllNotifications, assignCollector, approvePickup, rejectPickup, verifyCompletion, getAvailableCollectors, triggerAutoComplete, getCompoundCleanups, getStreetCleanups, updateCompoundCleanup, updateStreetCleanup } from '../../api/admin';
import { getCategories } from '../../api/pickups';
import { ImageGallery } from '../../components/ImageGallery';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom Delete Modal & Toast State
  const [confirmDialog, setConfirmDialog] = useState(null); // { id, name }
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      const results = Array.isArray(data) ? data : data.results || [];
      setUsers(results);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = async () => {
    if (!confirmDialog) return;
    const { id } = confirmDialog;
    setDeletingId(id);
    
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.user_id !== id));
      showToast('success', 'User successfully deleted.');
      setConfirmDialog(null);
    } catch (err) {
      showToast('error', err.message || 'Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-[#387478] animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 flex items-center">
      <span className="font-semibold">Error:</span>&nbsp;{error}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <span>⚠</span>}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">User Management</h2>
          <p className="text-secondary mt-1">Manage citizens and administrators.</p>
        </div>
        <div className="bg-eco-forest text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm">
          <Users className="w-5 h-5" />
          {users.length} Users
        </div>
      </div>

      <div className="card-modern p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-semibold text-muted uppercase tracking-wider">
                <th className="p-5">User</th>
                <th className="p-5">Contact</th>
                <th className="p-5">Role</th>
                <th className="p-5">Joined</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#387478] to-[#243642] flex items-center justify-center text-white font-bold shadow-sm">
                        {user.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-[#0E1240]">{user.full_name}</div>
                        <div className="text-sm text-muted">ID: {user.user_id?.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2 text-secondary">
                        <Mail className="w-4 h-4 text-muted" /> {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-secondary">
                          <Phone className="w-4 h-4 text-muted" /> {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'collector' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-5 text-sm text-muted">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => setConfirmDialog({ id: user.user_id, name: user.full_name })} 
                      disabled={deletingId === user.user_id}
                      className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <span className="font-semibold text-gray-700">{confirmDialog.name}</span>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors flex-1"
                disabled={deletingId}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex-1 flex items-center justify-center"
                disabled={deletingId}
              >
                {deletingId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminCollectors = () => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom Delete Modal & Toast State
  const [confirmDialog, setConfirmDialog] = useState(null); // { id, name }
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCollectors = async () => {
    try {
      const data = await getAllCollectors();
      const results = Array.isArray(data) ? data : data.results || [];
      setCollectors(results);
    } catch (err) {
      setError(err.message || 'Failed to load collectors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const confirmDelete = async () => {
    if (!confirmDialog) return;
    const { id } = confirmDialog;
    setDeletingId(id);
    
    try {
      await deleteCollector(id);
      setCollectors(prev => prev.filter(c => c.collector_id !== id));
      showToast('success', 'Collector successfully deleted.');
      setConfirmDialog(null);
    } catch (err) {
      showToast('error', err.message || 'Failed to delete collector.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-[#387478] animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 flex items-center">
      <span className="font-semibold">Error:</span>&nbsp;{error}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <span>⚠</span>}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">Collector Fleet</h2>
          <p className="text-secondary mt-1">Manage collector profiles, vehicles, and assigned areas.</p>
        </div>
        <div className="bg-eco-forest text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md">
          <Truck className="w-5 h-5" />
          {collectors.length} Collectors
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectors.map((collector) => (
          <div key={collector.collector_id} className="card-modern p-6 hover:border-eco-emerald/50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E2F1E7] flex items-center justify-center text-[#243642] shadow-sm">
                  <UserCog className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0E1240] text-lg leading-tight">{collector.full_name}</h3>
                  <span className="text-xs text-muted">{collector.email}</span>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                collector.availability === 'available' ? 'bg-green-100 text-green-700' : 
                collector.availability === 'on_route' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
              }`}>
                {collector.availability === 'available' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {collector.availability}
              </span>
            </div>
            
            <div className="space-y-3 mt-6 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-muted">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted font-medium">Assigned Zone</div>
                  <div className="text-secondary font-semibold">{collector.assigned_area}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-muted">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted font-medium">Vehicle Reg.</div>
                  <div className="text-secondary font-semibold uppercase">{collector.vehicle_number}</div>
                </div>
              </div>
              
              <div className="pt-3 flex justify-end">
                <button 
                  onClick={() => setConfirmDialog({ id: collector.collector_id, name: collector.full_name })} 
                  disabled={deletingId === collector.collector_id}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 font-semibold disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> Delete Collector
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Collector?</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <span className="font-semibold text-gray-700">{confirmDialog.name}</span>? 
                This action cannot be undone and will clear their assignments.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors flex-1"
                disabled={deletingId}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex-1 flex items-center justify-center"
                disabled={deletingId}
              >
                {deletingId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminBins = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSmartBins().then(data => setBins(Array.isArray(data) ? data : data.results || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-primary">Smart Bins</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bins.map(bin => (
          <div key={bin.bin_id} className="card-modern p-6">
            <h3 className="font-bold text-lg">{bin.location}</h3>
            <p className="text-muted text-sm mt-1">Capacity: {bin.capacity}kg</p>
            <p className="text-secondary mt-2 text-xl font-extrabold">{bin.fill_level}kg filled</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${bin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {bin.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : data.results || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-primary">Waste Categories</h2>
      <div className="card-modern overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-muted font-semibold text-sm">Category Name</th>
              <th className="p-4 text-muted font-semibold text-sm">Items Included</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map(cat => (
              <tr key={cat.category_id || cat.id}>
                <td className="p-4 font-bold text-primary">{cat.category_name || cat.name}</td>
                <td className="p-4 text-sm text-secondary">
                  {cat.items?.map(i => i.name).join(', ') || 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');

  // Assignment modal state
  const [assigningPickup, setAssigningPickup] = useState(null); // the pickup being assigned
  const [collectorSearch, setCollectorSearch] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  
  // Review Modal state
  const [reviewingPickup, setReviewingPickup] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    try {
      const [pickupsData, collectorsData] = await Promise.all([
        getAllPickups(),
        getAvailableCollectors(),
      ]);
      setPickups(Array.isArray(pickupsData) ? pickupsData : pickupsData.results || []);
      setCollectors(Array.isArray(collectorsData) ? collectorsData : collectorsData.results || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (collectorId) => {
    if (!assigningPickup) return;
    setAssigning(true);
    try {
      await assignCollector(assigningPickup.request_id, collectorId);
      setAssigningPickup(null);
      setCollectorSearch('');
      await fetchData();
      showToast('success', 'Collector assigned successfully!');
    } catch (err) {
      showToast('error', err.message || 'Assignment failed. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const handleApprove = async () => {
    if (!reviewingPickup) return;
    setReviewing(true);
    try {
      await approvePickup(reviewingPickup.request_id);
      showToast('success', 'Pickup request approved.');
      setReviewingPickup(null);
      await fetchData();
    } catch (err) {
      showToast('error', err.message || 'Failed to approve request.');
    } finally {
      setReviewing(false);
    }
  };

  const handleReject = async () => {
    if (!reviewingPickup) return;
    if (!rejectReason.trim()) {
      showToast('error', 'Rejection reason is required.');
      return;
    }
    setReviewing(true);
    try {
      await rejectPickup(reviewingPickup.request_id, rejectReason);
      showToast('success', 'Pickup request rejected.');
      setReviewingPickup(null);
      setRejectReason('');
      await fetchData();
    } catch (err) {
      showToast('error', err.message || 'Failed to reject request.');
    } finally {
      setReviewing(false);
    }
  };

  const handleVerify = async (actionType) => {
    if (!reviewingPickup) return;
    if (actionType === 'reject' && !rejectReason.trim()) {
      showToast('error', 'Rejection reason is required.');
      return;
    }
    setReviewing(true);
    try {
      await verifyCompletion(reviewingPickup.request_id, actionType, rejectReason);
      showToast('success', actionType === 'approve' ? 'Collection verified.' : 'Collection proof rejected.');
      setReviewingPickup(null);
      setRejectReason('');
      await fetchData();
    } catch (err) {
      showToast('error', err.message || 'Failed to verify completion.');
    } finally {
      setReviewing(false);
    }
  };

  const STATUS_COLORS = {
    pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
    assigned:  'bg-blue-100 text-blue-800 border-blue-200',
    pending_verification: 'bg-orange-100 text-orange-800 border-orange-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    collected: 'bg-purple-100 text-purple-800 border-purple-200',
    recycled:  'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  const AVAIL_COLORS = {
    available:   'bg-green-100 text-green-700',
    unavailable: 'bg-red-100 text-red-700',
    on_route:    'bg-blue-100 text-blue-700',
  };

  const filteredCollectors = collectors.filter(c => {
    const q = collectorSearch.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.assigned_area?.toLowerCase().includes(q)
    );
  });

  // Count active assignments per collector
  const activeAssignmentsCount = (collectorId) =>
    pickups.filter(
      p => p.assigned_collector === collectorId && ['pending', 'assigned'].includes(p.status)
    ).length;

  const [triggering, setTriggering] = useState(false);

  const handleTriggerAutoComplete = async () => {
    try {
      setTriggering(true);
      await triggerAutoComplete();
      setToast({ message: 'Auto-completion triggered successfully!', type: 'success' });
      await fetchData();
    } catch (err) {
      setToast({ message: `Error: ${err.message}`, type: 'error' });
    } finally {
      setTriggering(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const getDaysRemaining = (dateString) => {
    if (!dateString) return 0;
    const completedAt = new Date(dateString);
    const deadline = new Date(completedAt.getTime() + 72 * 60 * 60 * 1000);
    const now = new Date();
    const diff = deadline - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>;

  const pendingCount  = pickups.filter(p => p.status === 'pending_review' || p.status === 'pending_assignment').length;
  const assignedCount = pickups.filter(p => p.status === 'assigned').length;

  const filteredPickups = pickups.filter(p => {
    if (filter === 'active') {
      return ['pending_assignment', 'submitted', 'pending_review', 'assigned', 'in_progress', 'pending_verification'].includes(p.status);
    }
    return ['completed', 'cancelled', 'completion_rejected', 'collected', 'recycled'].includes(p.status);
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <span>⚠</span>}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">Pickup Requests</h2>
          <p className="text-secondary mt-1">Manage and assign all citizen pickup requests.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleTriggerAutoComplete}
            disabled={triggering}
            className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
          >
            {triggering ? 'Triggering...' : 'Trigger Auto-Complete'}
          </button>
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" /> {pendingCount} Pending
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4" /> {assignedCount} Assigned
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={() => setFilter('active')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'active' ? 'bg-[#387478] text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
        >
          Active ({pickups.filter(p => ['submitted', 'pending_review', 'assigned', 'pending_verification'].includes(p.status)).length})
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'completed' ? 'bg-[#387478] text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
        >
          Completed ({pickups.filter(p => ['completed', 'cancelled', 'completion_rejected', 'collected', 'recycled'].includes(p.status)).length})
        </button>
      </div>

      {/* Table */}
      <div className="card-modern p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-muted uppercase tracking-wider">
                <th className="p-4">Citizen</th>
                <th className="p-4">Category</th>
                <th className="p-4">Qty / Date</th>
                <th className="p-4">Address</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPickups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted text-sm">
                    No pickup requests found in this view.
                  </td>
                </tr>
              ) : filteredPickups.map(p => (
                <tr key={p.request_id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#387478] to-[#243642] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {p.user_detail?.full_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-primary">{p.user_detail?.full_name || 'N/A'}</div>
                        <div className="text-xs text-muted">{p.user_detail?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-secondary flex items-center gap-2">
                      {p.category_detail?.category_name || 'N/A'}
                      {p.category_detail?.disposal_category === 'RECYCLABLE' && <RecyclableBadge className="scale-90" />}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-secondary">
                    <div className="font-semibold text-primary">{p.quantity} kg</div>
                    <div className="text-xs text-muted">{p.pickup_date}</div>
                  </td>
                  <td className="p-4 text-xs text-secondary max-w-[180px]">
                    <div className="truncate">{p.address || '—'}</div>
                    {p.latitude && p.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${p.latitude},${p.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#387478] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <MapPin className="w-3 h-3" /> View Map
                      </a>
                    )}
                  </td>
                  <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {p.status.replace(/_/g, ' ')}
                      </span>
                      {p.status === 'pending_verification' && (
                        <div className="mt-2 text-xs font-semibold text-orange-600">
                          ⏳ {getDaysRemaining(p.collector_completed_at)} days left
                        </div>
                      )}
                    </td>
                  <td className="p-4">
                    {p.assigned_collector_detail ? (
                      <div>
                        <div className="text-sm font-semibold text-primary">{p.assigned_collector_detail.full_name}</div>
                        <div className="text-xs text-muted">{p.assigned_collector_detail.assigned_area}</div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${AVAIL_COLORS[p.assigned_collector_detail.availability] || 'bg-gray-100 text-gray-700'}`}>
                          {p.assigned_collector_detail.availability}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 items-end">
                      {['pending_review', 'pending_verification'].includes(p.status) && (
                        <button
                          onClick={() => { setReviewingPickup(p); setRejectReason(''); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          Review
                        </button>
                      )}
                      
                      {['pending_assignment', 'approved', 'assigned', 'in_progress', 'collected'].includes(p.status) && (
                        <button
                          onClick={() => { setAssigningPickup(p); setCollectorSearch(''); }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            p.assigned_collector_detail
                              ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                              : 'bg-[#387478] text-white hover:bg-[#2d5f62] shadow-sm'
                          }`}
                        >
                          <UserCog className="w-3.5 h-3.5" />
                          {p.assigned_collector_detail ? 'Reassign' : 'Assign'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {assigningPickup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-primary">
                    {assigningPickup.assigned_collector_detail ? 'Reassign Collector' : 'Assign Collector'}
                  </h3>
                  <p className="text-sm text-muted mt-1 flex items-center gap-2 flex-wrap">
                    <span>Request: <span className="font-semibold text-secondary">{assigningPickup.category_detail?.category_name}</span></span>
                    {assigningPickup.category_detail?.disposal_category === 'RECYCLABLE' && <RecyclableBadge />}
                    <span>· {assigningPickup.quantity}kg · {assigningPickup.pickup_date}</span>
                  </p>
                  {assigningPickup.user_detail && (
                    <p className="text-xs text-muted mt-0.5">
                      Citizen: {assigningPickup.user_detail.full_name} ({assigningPickup.user_detail.email})
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setAssigningPickup(null)}
                  className="text-muted hover:text-primary text-xl leading-none p-1"
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or zone..."
                  value={collectorSearch}
                  onChange={e => setCollectorSearch(e.target.value)}
                  className="input-modern pl-10 text-sm"
                  autoFocus
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>

            {/* Collector List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredCollectors.length === 0 ? (
                <p className="text-center text-sm text-muted py-8">No collectors found.</p>
              ) : filteredCollectors.map(c => {
                const isCurrentlyAssigned = assigningPickup.assigned_collector === c.collector_id;
                const activeCount = c.active_assignment_count || 0;
                return (
                  <div
                    key={c.collector_id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isCurrentlyAssigned
                        ? 'border-[#387478] bg-[#387478]/5'
                        : 'border-gray-100 hover:border-[#387478]/40 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E2F1E7] flex items-center justify-center text-[#243642] font-bold text-sm shrink-0">
                          {c.full_name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-primary flex items-center gap-1.5">
                            {c.full_name}
                            {isCurrentlyAssigned && (
                              <span className="px-1.5 py-0.5 bg-[#387478] text-white rounded text-[10px] font-bold">Current</span>
                            )}
                          </div>
                          <div className="text-xs text-muted">{c.email}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${AVAIL_COLORS[c.availability] || 'bg-gray-100 text-gray-700'}`}>
                              {c.availability}
                            </span>
                            {c.assigned_area && (
                              <span className="text-[10px] text-muted flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5" /> {c.assigned_area}
                              </span>
                            )}
                            <span className="text-[10px] text-muted">
                              {activeCount} active job{activeCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssign(c.collector_id)}
                        disabled={assigning || isCurrentlyAssigned}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                          isCurrentlyAssigned
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-[#387478] text-white hover:bg-[#2d5f62] shadow-sm hover:shadow-md'
                        }`}
                      >
                        {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : isCurrentlyAssigned ? 'Assigned' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setAssigningPickup(null)}
                className="w-full py-2 rounded-xl border border-gray-200 text-sm font-semibold text-secondary hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingPickup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-extrabold text-primary">
                  Review Pickup Request
                </h3>
                <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[reviewingPickup.status] || 'bg-gray-100 text-gray-700'}`}>
                  {reviewingPickup.status}
                </span>
              </div>
              <button onClick={() => setReviewingPickup(null)} className="text-muted hover:text-primary text-xl leading-none p-1">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase text-muted tracking-wider">Citizen</div>
                  <div className="font-semibold text-primary">{reviewingPickup.user_detail?.full_name}</div>
                  <div className="text-sm text-secondary">{reviewingPickup.user_detail?.email}</div>
                  <div className="text-sm text-secondary">{reviewingPickup.user_detail?.phone}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase text-muted tracking-wider">Category</div>
                  <div className="font-semibold text-primary">{reviewingPickup.category_detail?.category_name}</div>
                  <div className="text-sm text-secondary">{reviewingPickup.quantity} kg</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase text-muted tracking-wider">Location Info</div>
                <div className="text-sm text-primary font-medium">{reviewingPickup.address}</div>
                {reviewingPickup.landmark && <div className="text-sm text-secondary italic">Landmark: {reviewingPickup.landmark}</div>}
                {reviewingPickup.latitude && (
                  <a href={`https://www.google.com/maps?q=${reviewingPickup.latitude},${reviewingPickup.longitude}`} target="_blank" rel="noreferrer" className="text-sm text-[#387478] hover:underline flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4"/> Open in Google Maps
                  </a>
                )}
              </div>
              
              {reviewingPickup.description && (
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase text-muted tracking-wider">Description / Notes</div>
                  <div className="text-sm text-secondary bg-gray-50 p-3 rounded-lg border border-gray-100">{reviewingPickup.description}</div>
                </div>
              )}
              
              {reviewingPickup.images?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase text-muted tracking-wider">Uploaded Images</div>
                  <ImageGallery images={reviewingPickup.images} />
                </div>
              )}

              {/* Action Area */}
              <div className="pt-6 border-t border-gray-100">
                {['submitted', 'pending_review'].includes(reviewingPickup.status) ? (
                  <div className="space-y-4">
                    <textarea 
                      placeholder="Rejection reason (required if rejecting)..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="input-modern w-full"
                    />
                    <div className="flex gap-3">
                      <button onClick={handleReject} disabled={reviewing || !rejectReason.trim()} className="flex-1 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-bold rounded-xl transition-colors disabled:opacity-50">
                        {reviewing ? <Loader2 className="w-4 h-4 mx-auto animate-spin"/> : 'Reject Request'}
                      </button>
                      <button onClick={handleApprove} disabled={reviewing} className="flex-1 py-2 bg-[#387478] text-white hover:bg-[#2d5f62] font-bold rounded-xl shadow-md transition-colors disabled:opacity-50">
                        {reviewing ? <Loader2 className="w-4 h-4 mx-auto animate-spin"/> : 'Approve Request'}
                      </button>
                    </div>
                  </div>
                ) : reviewingPickup.status === 'pending_verification' ? (
                  <div className="space-y-4">
                    <textarea 
                      placeholder="Rejection reason (required if rejecting proof)..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="input-modern w-full"
                    />
                    <div className="flex gap-3">
                      <button onClick={() => handleVerify('reject')} disabled={reviewing || !rejectReason.trim()} className="flex-1 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-bold rounded-xl transition-colors disabled:opacity-50">
                        {reviewing ? <Loader2 className="w-4 h-4 mx-auto animate-spin"/> : 'Reject Proof'}
                      </button>
                      <button onClick={() => handleVerify('approve')} disabled={reviewing || (!reviewingPickup.images?.some(img => img.image_type === 'citizen_verification') && getDaysRemaining(reviewingPickup.collector_completed_at) > 0)} className="flex-1 py-2 bg-green-600 text-white hover:bg-green-700 font-bold rounded-xl shadow-md transition-colors disabled:opacity-50">
                        {reviewing ? <Loader2 className="w-4 h-4 mx-auto animate-spin"/> : 'Verify Completion'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [recycling, setRecycling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('collections'); // 'collections' | 'recycling'

  useEffect(() => {
    Promise.all([getAllCollections(), getAllRecycling()])
      .then(([collectionsData, recyclingData]) => {
        setCollections(Array.isArray(collectionsData) ? collectionsData : collectionsData.results || []);
        setRecycling(Array.isArray(recyclingData) ? recyclingData : recyclingData.results || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-primary">Collections & Recycling</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'collections' ? 'bg-[#387478] text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
          >
            Collections ({collections.length})
          </button>
          <button 
            onClick={() => setActiveTab('recycling')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'recycling' ? 'bg-[#387478] text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
          >
            Recycling ({recycling.length})
          </button>
        </div>
      </div>
      
      <div className="card-modern overflow-hidden">
        {activeTab === 'collections' ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-muted font-semibold text-sm">Collector ID</th>
                <th className="p-4 text-muted font-semibold text-sm">Collected Weight</th>
                <th className="p-4 text-muted font-semibold text-sm">Date</th>
                <th className="p-4 text-muted font-semibold text-sm">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {collections.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-muted">No collections recorded yet.</td></tr>
              ) : collections.map((c, idx) => (
                <tr key={c.collection_id || c.id || idx}>
                  <td className="p-4 font-medium text-sm text-secondary">{c.collector}</td>
                  <td className="p-4 font-bold text-primary">{c.collected_weight} kg</td>
                  <td className="p-4 text-sm text-secondary">{c.collection_date}</td>
                  <td className="p-4 text-sm text-secondary">{c.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-muted font-semibold text-sm">Center</th>
                <th className="p-4 text-muted font-semibold text-sm">Recycled Weight</th>
                <th className="p-4 text-muted font-semibold text-sm">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recycling.length === 0 ? (
                <tr><td colSpan={3} className="p-6 text-center text-muted">No recycling records yet.</td></tr>
              ) : recycling.map((r, idx) => (
                <tr key={r.recycle_id || r.id || idx}>
                  <td className="p-4 font-medium text-sm text-secondary">{r.recycling_center}</td>
                  <td className="p-4 font-bold text-primary">{r.recycled_weight} kg</td>
                  <td className="p-4 text-sm text-secondary">{r.recycled_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllNotifications().then(data => setNotifications(Array.isArray(data) ? data : data.results || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-primary">System Notifications</h2>
      <div className="space-y-4">
        {notifications.map(n => (
          <div key={n.notification_id} className="card-modern p-4 border-l-4 border-eco-forest">
            <h4 className="font-bold">{n.title}</h4>
            <p className="text-sm text-secondary mt-1">{n.message}</p>
            <span className="text-xs text-muted mt-2 block">{new Date(n.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminAuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs().then(data => setLogs(Array.isArray(data) ? data : data.results || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-primary">Audit Log</h2>
      <div className="card-modern overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-muted font-semibold text-sm">Action</th>
              <th className="p-4 text-muted font-semibold text-sm">Details</th>
              <th className="p-4 text-muted font-semibold text-sm">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.map(log => (
              <tr key={log.log_id}>
                <td className="p-4 font-bold text-primary text-sm uppercase">{log.action}</td>
                <td className="p-4 text-sm text-secondary">{log.details ? JSON.stringify(log.details) : 'N/A'}</td>
                <td className="p-4 text-xs text-muted">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getMyProfile().then(data => setProfile(data)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await updateMyProfile({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address
      });
      setProfile(updated);
      setMessage('Settings updated successfully!');
    } catch (err) {
      setMessage('Error updating settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-3xl font-extrabold text-primary">Profile Settings</h2>
      
      {message && (
        <div className={`p-4 rounded-xl ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-modern p-8 space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Full Name</label>
          <input 
            type="text" required
            value={profile?.full_name || ''}
            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
            className="input-modern"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Email Address (Read Only)</label>
          <input 
            type="email" disabled
            value={profile?.email || ''}
            className="input-modern bg-gray-50 opacity-70"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Phone Number</label>
          <input 
            type="text" required
            value={profile?.phone || ''}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            className="input-modern"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Address</label>
          <input 
            type="text"
            value={profile?.address || ''}
            onChange={(e) => setProfile({...profile, address: e.target.value})}
            className="input-modern"
          />
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming authFetch can just hit /feedback/ if no dedicated function
    import('../../api/auth').then(({ authFetch }) => {
      authFetch('/feedback/').then(data => setFeedback(Array.isArray(data) ? data : data.results || [])).finally(() => setLoading(false));
    });
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-primary">User Feedback</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedback.map(f => (
          <div key={f.feedback_id} className="card-modern p-6">
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-xs text-muted ml-1">{f.rating}/5</span>
            </div>
            <p className="text-secondary text-sm italic">"{f.comments}"</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
              <span className="text-xs text-muted">{new Date(f.submitted_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ── Rule 1 & 2: Admin Cleanups Management ──
const CLEANUP_STATUS_STYLES = {
  pending:     'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  completed:   'bg-green-100 text-green-800 border-green-200',
};

const STATUS_OPTIONS = ['pending', 'in_progress', 'completed'];

export const AdminCleanups = () => {
  const [tab, setTab] = useState('compound'); // 'compound' | 'street'
  const [compoundCleanups, setCompoundCleanups] = useState([]);
  const [streetCleanups, setStreetCleanups] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [updating, setUpdating] = useState(null); // cleanup ID being updated

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    Promise.all([
      getCompoundCleanups(),
      getStreetCleanups(),
      getAvailableCollectors(),
    ])
      .then(([cc, sc, col]) => {
        setCompoundCleanups(Array.isArray(cc) ? cc : cc.results || []);
        setStreetCleanups(Array.isArray(sc) ? sc : sc.results || []);
        setCollectors(Array.isArray(col) ? col : col.results || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (type, id, data) => {
    setUpdating(id);
    try {
      const updated = type === 'compound'
        ? await updateCompoundCleanup(id, data)
        : await updateStreetCleanup(id, data);

      if (type === 'compound') {
        setCompoundCleanups(prev => prev.map(c => c.compound_cleanup_id === id ? { ...c, ...updated } : c));
      } else {
        setStreetCleanups(prev => prev.map(c => c.street_cleanup_id === id ? { ...c, ...updated } : c));
      }
      showToast('success', 'Cleanup updated successfully.');
    } catch (err) {
      showToast('error', err.message || 'Update failed.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-[#387478] animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
      <span className="font-semibold">Error:</span>&nbsp;{error}
    </div>
  );

  const currentList = tab === 'compound' ? compoundCleanups : streetCleanups;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <span>⚠</span>}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">Cleanup Management</h2>
          <p className="text-secondary mt-1">Manage compound and street cleanups triggered by citizen requests.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-bold">
            {compoundCleanups.filter(c => c.status === 'pending').length} Compound Pending
          </span>
          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">
            {streetCleanups.filter(c => c.status === 'pending').length} Street Pending
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        <button
          onClick={() => setTab('compound')}
          className={`px-5 py-2.5 text-sm font-bold rounded-t-lg border-b-2 transition-colors ${
            tab === 'compound' ? 'border-[#387478] text-[#387478] bg-[#387478]/5' : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          <Home className="w-4 h-4 inline mr-1.5" />
          Compound Cleanups ({compoundCleanups.length})
        </button>
        <button
          onClick={() => setTab('street')}
          className={`px-5 py-2.5 text-sm font-bold rounded-t-lg border-b-2 transition-colors ${
            tab === 'street' ? 'border-[#387478] text-[#387478] bg-[#387478]/5' : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-1.5" />
          Street Cleanups ({streetCleanups.length})
        </button>
      </div>

      {/* Cleanup Cards */}
      {currentList.length === 0 ? (
        <div className="p-12 card-modern text-center">
          <Sparkles className="w-12 h-12 mx-auto text-muted opacity-30 mb-3" />
          <p className="text-secondary font-medium">No {tab} cleanups yet.</p>
          <p className="text-xs text-muted mt-1">
            {tab === 'compound'
              ? 'Triggered when a citizen submits 10+ pickup requests.'
              : 'Triggered when 5+ collective requests come from the same street.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map(c => {
            const id = tab === 'compound' ? c.compound_cleanup_id : c.street_cleanup_id;
            const isUpdating = updating === id;
            return (
              <div key={id} className="card-modern p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#E2F1E7] rounded-lg shrink-0">
                      {tab === 'compound' ? <Home className="w-5 h-5 text-[#387478]" /> : <MapPin className="w-5 h-5 text-[#387478]" />}
                    </div>
                    <div>
                      <p className="font-bold text-primary">
                        {tab === 'compound' ? `${c.citizen_name || 'Citizen'}'s Compound` : c.street}
                      </p>
                      {tab === 'compound' && (
                        <p className="text-xs text-muted">{c.citizen_email}</p>
                      )}
                      <p className="text-xs text-muted mt-0.5">
                        Triggered {new Date(c.triggered_at).toLocaleDateString()} · {c.trigger_request_count} requests
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${
                    CLEANUP_STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Assigned collector */}
                {c.assigned_collector_name && (
                  <p className="text-xs text-secondary mt-3">
                    Assigned to: <span className="font-semibold">{c.assigned_collector_name}</span>
                  </p>
                )}
                {c.completed_at && (
                  <p className="text-xs text-green-600 mt-1">✅ Completed {new Date(c.completed_at).toLocaleDateString()}</p>
                )}

                {/* Admin actions */}
                {c.status !== 'completed' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Assign Collector</label>
                      <select
                        className="input-modern text-sm py-2"
                        value={c.assigned_collector || ''}
                        onChange={e => handleUpdate(tab, id, { assigned_collector: e.target.value || null })}
                        disabled={isUpdating}
                      >
                        <option value="">— Unassigned —</option>
                        {collectors.map(col => (
                          <option key={col.collector_id} value={col.collector_id}>
                            {col.full_name} ({col.assigned_area})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      {c.status === 'pending' && (
                        <button
                          onClick={() => handleUpdate(tab, id, { status: 'in_progress' })}
                          disabled={isUpdating}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mark In Progress'}
                        </button>
                      )}
                      {c.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdate(tab, id, { status: 'completed' })}
                          disabled={isUpdating}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : '✓ Mark Completed'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
