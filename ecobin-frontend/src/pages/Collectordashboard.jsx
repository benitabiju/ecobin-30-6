import React, { useEffect, useState, useCallback } from 'react';
import { getAssignedPickups, updatePickupStatus, logCollection } from '../api/Collector';
import RecyclableBadge from '../components/RecyclableBadge';
import { MapPin, User, RefreshCw } from 'lucide-react';

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-800',
  assigned:  'bg-blue-100 text-blue-800',
  collected: 'bg-purple-100 text-purple-800',
  recycled:  'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// Inline form for logging weight + notes when a collector completes a pickup.
function CompletionForm({ pickup, onSubmit, onCancel, submitting }) {
  const [weight, setWeight] = useState(pickup.quantity || '');
  const [notes, setNotes] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(weight, notes);
      }}
      className="mt-4 pt-4 border-t border-eco-sage/20 flex flex-col gap-3"
    >
      <div className="flex gap-3">
        <input
          type="number"
          step="0.1"
          min="0"
          required
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Actual weight (kg)"
          className="input-modern flex-1 py-2 text-sm"
        />
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional — e.g. access issues, contamination)"
        rows="2"
        className="input-modern py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary py-2 px-4 text-xs disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Confirm collection'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary py-2 px-4 text-xs"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CollectorDashboard() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFormId, setActiveFormId] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const loadPickups = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await getAssignedPickups();
      setPickups(Array.isArray(data) ? data : data.results || []);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPickups();
    // Auto-refresh every 30 seconds to pick up new assignments
    const interval = setInterval(() => loadPickups(true), 30000);
    return () => clearInterval(interval);
  }, [loadPickups]);

  async function handleComplete(pickup, weight, notes) {
    setSubmittingId(pickup.request_id);
    setError('');
    try {
      await logCollection(pickup.request_id, weight, notes);
      await updatePickupStatus(pickup.request_id, 'collected');
      setActiveFormId(null);
      await loadPickups(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingId(null);
    }
  }

  const activePickups    = pickups.filter((p) => ['assigned', 'pending'].includes(p.status));
  const completedPickups = pickups.filter((p) => ['collected', 'recycled'].includes(p.status));

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl font-bold text-primary">
          Collector dashboard
        </h1>
        <button
          onClick={() => loadPickups(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-secondary border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      <p className="text-sm text-secondary mb-1">
        Your assigned pickups. Auto-refreshes every 30s.
      </p>
      <p className="text-xs text-muted mb-8">
        Last updated: {lastRefreshed.toLocaleTimeString()}
      </p>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 card-modern flex flex-col hover:border-eco-emerald/50">
          <span className="text-sm font-bold text-muted uppercase tracking-wider mb-2">Total Assigned</span>
          <span className="text-4xl font-extrabold text-primary">{pickups.length}</span>
        </div>
        <div className="p-6 card-modern flex flex-col hover:border-eco-emerald/50">
          <span className="text-sm font-bold text-muted uppercase tracking-wider mb-2">To Collect</span>
          <span className="text-4xl font-extrabold text-primary">{activePickups.length}</span>
        </div>
        <div className="p-6 card-modern flex flex-col hover:border-eco-emerald/50">
          <span className="text-sm font-bold text-muted uppercase tracking-wider mb-2">Completed</span>
          <span className="text-4xl font-extrabold text-primary">{completedPickups.length}</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-secondary">Loading your route...</p>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-primary mb-4">
              To collect ({activePickups.length})
            </h2>
            {activePickups.length === 0 ? (
              <div className="p-8 card-modern text-center">
                <p className="text-sm text-secondary">
                  No pickups currently assigned to you.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activePickups.map((pickup) => (
                  <div
                    key={pickup.request_id}
                    className="p-6 card-modern hover:border-eco-emerald/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        {/* Category + Status */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-primary text-lg">
                            {pickup.category_detail?.category_name || 'Pickup Request'}
                          </p>
                          {pickup.category_detail?.disposal_category === 'RECYCLABLE' && <RecyclableBadge />}
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[pickup.status] || 'bg-gray-100 text-secondary'}`}>
                            {pickup.status}
                          </span>
                        </div>

                        {/* Weight + Date */}
                        <p className="text-sm text-secondary mt-1">
                          Est. {pickup.quantity}kg · Scheduled {pickup.pickup_date}
                        </p>

                        {/* Citizen Info */}
                        {pickup.user_detail && (
                          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                            <User className="w-3.5 h-3.5" />
                            <span className="font-medium text-secondary">{pickup.user_detail.full_name}</span>
                            <span className="text-xs">· {pickup.user_detail.phone || pickup.user_detail.email}</span>
                          </div>
                        )}

                        {/* Address + Map */}
                        {pickup.address && (
                          <div className="mt-1.5 flex items-start gap-1.5 text-sm text-muted">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{pickup.address}</span>
                          </div>
                        )}
                        {pickup.latitude && pickup.longitude && (
                          <a
                            href={`https://www.google.com/maps?q=${pickup.latitude},${pickup.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-[#387478] hover:underline"
                          >
                            <MapPin className="w-3 h-3" /> View on Map ↗
                          </a>
                        )}
                      </div>

                      {activeFormId !== pickup.request_id && (
                        <button
                          onClick={() => setActiveFormId(pickup.request_id)}
                          className="btn-primary py-2 px-4 text-xs shrink-0"
                        >
                          Mark collected
                        </button>
                      )}
                    </div>

                    {activeFormId === pickup.request_id && (
                      <CompletionForm
                        pickup={pickup}
                        submitting={submittingId === pickup.request_id}
                        onCancel={() => setActiveFormId(null)}
                        onSubmit={(weight, notes) => handleComplete(pickup, weight, notes)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary mb-4">
              Recently completed
            </h2>
            {completedPickups.length === 0 ? (
              <p className="text-sm text-secondary">
                Nothing completed yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {completedPickups.map((pickup) => (
                  <div
                    key={pickup.request_id}
                    className="p-5 card-modern flex items-center justify-between shadow-sm border-eco-sage/10"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-primary">
                          {pickup.category_detail?.category_name || 'Pickup Request'} · {pickup.quantity}kg
                        </p>
                        {pickup.category_detail?.disposal_category === 'RECYCLABLE' && <RecyclableBadge className="scale-90" />}
                      </div>
                      {pickup.user_detail && (
                        <p className="text-xs text-muted mt-0.5">{pickup.user_detail.full_name}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[pickup.status] || 'bg-gray-100 text-secondary'}`}>
                      {pickup.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
