import React, { useEffect, useState } from 'react';
import { authFetch } from '../api/auth';

export default function AdminDashboard() {
 const [stats, setStats] = useState({ pickups: 0, bins: 0, collectors: 0 });
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 useEffect(() => {
 async function loadStats() {
 try {
 const [pickups, bins, collectors] = await Promise.all([
 authFetch('/pickups/'),
 authFetch('/smart-bins/'),
 authFetch('/collectors/'),
 ]);
 setStats({
 pickups: (Array.isArray(pickups) ? pickups : pickups.results || []).length,
 bins: (Array.isArray(bins) ? bins : bins.results || []).length,
 collectors: (Array.isArray(collectors) ? collectors : collectors.results || []).length,
 });
 } catch (err) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 }
 loadStats();
 }, []);

 return (
 <main className="max-w-5xl mx-auto px-6 py-16">
 <h1 className="font-display text-3xl font-bold text-primary mb-2">
 Admin dashboard
 </h1>
 <p className="text-sm text-secondary mb-10">
 System-wide overview.
 </p>

 {error && (
 <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
 {error}
 </div>
 )}

 {loading ? (
 <p className="text-sm text-secondary">Loading stats...</p>
 ) : (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
  <div className="p-8 card-modern hover:border-eco-emerald/50">
  <p className="text-4xl font-extrabold text-primary">{stats.pickups}</p>
  <p className="text-sm text-secondary mt-2 font-bold uppercase tracking-wider">Total pickup requests</p>
  </div>
  <div className="p-8 card-modern hover:border-eco-emerald/50">
  <p className="text-4xl font-extrabold text-primary">{stats.bins}</p>
  <p className="text-sm text-secondary mt-2 font-bold uppercase tracking-wider">Smart bins</p>
  </div>
  <div className="p-8 card-modern hover:border-eco-emerald/50">
  <p className="text-4xl font-extrabold text-primary">{stats.collectors}</p>
  <p className="text-sm text-secondary mt-2 font-bold uppercase tracking-wider">Collectors</p>
  </div>
  </div>
  )}
 </main>
 );
}
