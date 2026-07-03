import React, { useState, useEffect } from 'react';
import { Users, Truck, CheckCircle, Clock, MapPin, Mail, Phone, Loader2, UserCog, Activity, Box, Archive } from 'lucide-react';
import { getAllUsers } from '../../api/Users';
import { getAllCollectors } from '../../api/Collector';

const PlaceholderPage = ({ title, description, icon: Icon }) => (
  <div className="bg-[#1A2255]/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-white/10 flex flex-col items-center justify-center min-h-[400px] text-center transition-all duration-300 hover:shadow-2xl">
    <div className="w-20 h-20 bg-gradient-to-br from-[#E2F1E7] to-[#387478] rounded-full flex items-center justify-center mb-6 shadow-inner">
      {Icon ? <Icon className="w-10 h-10 text-[#0E1240]" /> : <Activity className="w-10 h-10 text-[#0E1240]" />}
    </div>
    <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">{title}</h2>
    <p className="text-gray-300 max-w-md text-lg leading-relaxed">{description}</p>
    <div className="mt-8 px-6 py-2 bg-[#387478] text-white rounded-full text-sm font-semibold tracking-wide shadow-sm hover:bg-[#243642] transition-colors">
      Coming Soon
    </div>
  </div>
);

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">User Management</h2>
          <p className="text-gray-300 mt-1">Manage citizens and administrators.</p>
        </div>
        <div className="bg-[#E2F1E7] text-[#243642] px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm">
          <Users className="w-5 h-5" />
          {users.length} Users
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-5">User</th>
                <th className="p-5">Contact</th>
                <th className="p-5">Role</th>
                <th className="p-5">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#387478] to-[#243642] flex items-center justify-center text-white font-bold shadow-sm">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-[#0E1240]">{user.full_name}</div>
                        <div className="text-sm text-gray-500">ID: {user.user_id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" /> {user.phone}
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
                  <td className="p-5 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminCollectors = () => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const data = await getAllCollectors();
        setCollectors(data);
      } catch (err) {
        setError(err.message || 'Failed to load collectors');
      } finally {
        setLoading(false);
      }
    };
    fetchCollectors();
  }, []);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Collector Fleet</h2>
          <p className="text-gray-300 mt-1">Manage collector profiles, vehicles, and assigned areas.</p>
        </div>
        <div className="bg-[#629584] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-[#629584]/20">
          <Truck className="w-5 h-5" />
          {collectors.length} Collectors
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectors.map((collector) => (
          <div key={collector.collector_id} className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E2F1E7] flex items-center justify-center text-[#243642] shadow-sm">
                  <UserCog className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0E1240] text-lg leading-tight">{collector.full_name}</h3>
                  <span className="text-xs text-gray-400">{collector.email}</span>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                collector.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {collector.availability ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {collector.availability ? 'Available' : 'Busy'}
              </span>
            </div>
            
            <div className="space-y-3 mt-6 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 font-medium">Assigned Zone</div>
                  <div className="text-gray-700 font-semibold">{collector.assigned_area}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 font-medium">Vehicle Reg.</div>
                  <div className="text-gray-700 font-semibold uppercase">{collector.vehicle_number}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminBins = () => <PlaceholderPage title="Smart Bins" description="Manage physical smart bin locations and real-time status." icon={Archive} />;
export const AdminCategories = () => <PlaceholderPage title="Waste Categories" description="Configure and manage system waste classification types." icon={Box} />;
export const AdminPickups = () => <PlaceholderPage title="Pickup Requests" description="View pending pickups and assign them to active collectors." icon={Truck} />;
export const AdminCollections = () => <PlaceholderPage title="Collections & Recycling" description="View historical completed collection and recycling records." icon={Activity} />;
export const AdminFeedback = () => <PlaceholderPage title="Feedback" description="Read and respond to citizen reviews and feedback." icon={Mail} />;
export const AdminNotifications = () => <PlaceholderPage title="Notifications" description="Broadcast system notifications and alerts." icon={Phone} />;
export const AdminAuditLog = () => <PlaceholderPage title="Audit Log" description="Read-only view of critical system events and actions." icon={UserCog} />;
export const AdminSettings = () => <PlaceholderPage title="Settings" description="Configure global system properties and preferences." icon={Activity} />;
