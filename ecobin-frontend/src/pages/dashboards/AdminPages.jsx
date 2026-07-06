import React, { useState, useEffect } from 'react';
import { Users, Truck, CheckCircle, Clock, MapPin, Mail, Phone, Loader2, UserCog, Activity, Box, Archive, Trash2, Edit } from 'lucide-react';
import RecyclableBadge from '../../components/RecyclableBadge';
import { getAllUsers, deleteUser, getMyProfile, updateMyProfile } from '../../api/Users';
import { getAllCollectors, deleteCollector } from '../../api/Collector';
import { getSmartBins, getAllPickups, getAllCollections, getAllRecycling, getAuditLogs, getAllNotifications, assignCollector } from '../../api/admin';
import { getCategories } from '../../api/pickups';

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

  // Assignment modal state
  const [assigningPickup, setAssigningPickup] = useState(null); // the pickup being assigned
  const [collectorSearch, setCollectorSearch] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    try {
      const [pickupsData, collectorsData] = await Promise.all([
        getAllPickups(),
        getAllCollectors(),
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

  const STATUS_COLORS = {
    pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
    assigned:  'bg-blue-100 text-blue-800 border-blue-200',
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

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>;

  const pendingCount  = pickups.filter(p => p.status === 'pending').length;
  const assignedCount = pickups.filter(p => p.status === 'assigned').length;

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
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" /> {pendingCount} Pending
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4" /> {assignedCount} Assigned
          </div>
        </div>
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
              {pickups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted text-sm">
                    No pickup requests found.
                  </td>
                </tr>
              ) : pickups.map(p => (
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
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {p.status}
                    </span>
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
                  <td className="p-4 text-right">
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
                const activeCount = activeAssignmentsCount(c.collector_id);
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
    </div>
  );
};


export const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCollections().then(data => setCollections(Array.isArray(data) ? data : data.results || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-primary">Collections & Recycling</h2>
      <div className="card-modern overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-muted font-semibold text-sm">Collector ID</th>
              <th className="p-4 text-muted font-semibold text-sm">Collected Weight</th>
              <th className="p-4 text-muted font-semibold text-sm">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {collections.map(c => (
              <tr key={c.collection_id}>
                <td className="p-4 font-medium text-sm text-secondary">{c.collector}</td>
                <td className="p-4 font-bold text-primary">{c.collected_weight} kg</td>
                <td className="p-4 text-sm text-secondary">{c.collection_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <h3 className="font-bold text-lg mb-2">Rating: {f.rating}/5</h3>
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
